import React, { useEffect, memo, useState } from 'react';
import { Grid, MenuItem } from '@material-ui/core';
import { AsyncAutocomplete, TextField } from '../../LifetekUi';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { API_USERS, API_PERSONNEL, API_ORIGANIZATION, API_ROLE_APP } from '../../../config/urlConfig';
import { fetchData } from '../../../helper';
import CustomInputBase from '../../Input/CustomInputBase';
import { compose } from 'redux';
import messages from './messages';
import { injectIntl } from 'react-intl';
import './index.css';

function DepartmentAndEmployee(props) {
  const { employee, department = 0, onChange, intl, labelDepartment, isNoneExpand = false } = props;
  const [departments, setDepartments] = useState([]);
  const [localData, setLocalData] = useState({
    employee,
    department: department !== '' ? department : 0,
  });

  const [expandedItems, setExpandedItems] = useState([]);
  const [expandedLv, setExpandedLv] = useState(0);

  useEffect(() => {
    fetchData(API_ORIGANIZATION, 'GET', null).then(departmentsData => {
      setDepartments(departmentsData);
    });
  }, []);

  useEffect(() => {
      if(department){
        setLocalData({...localData, department})
      }
  }, [department]);

  const flatList = (arr, result) => {
    arr.forEach(i => {
      const { child, ...rest } = i;
      if (child && child.length) {
        result.push(rest);
        flatList(child, result);
      } else {
        result.push(rest);
      }
    });
    return result;
  };

  const handleDepartment = e => {
    const { value } = e.target;
    const newLocalData = {
      department: value,
      employee: null,
    };
    setLocalData(newLocalData);
    onChange(newLocalData);
  };

  const findChildren = data => {
    try {
      const newData = data.filter(item => item.parent === null);
      getLevel(newData, 0);
      return newData;
    } catch (error) {
      return [];
    }
  };

  const getLevel = (arr, lvl) => {
    arr.forEach(item => {
      item.level = lvl;
      if (item.child) {
        getLevel(item.child, lvl + 1);
      }
    });
  };

  const mapItem = (array, lv, result = []) => {
    array.forEach(item => {
      let isItemShowed = false;
      if (!item.parent) isItemShowed = true;
      else if (expandedItems.find(exp => exp === item.parent)) {
        isItemShowed = true;
      } else if (lv === expandedLv) {
        isItemShowed = true;
      }
      if (isItemShowed) {
        const isItemExpanded = expandedItems.find(exp => exp === item._id);
        result.push(
          <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
            {item.child && item.child.length ? (
              <span
                className="CustomChildInnput"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (isItemExpanded) {
                    const newExpandedItems = expandedItems.filter(exp => exp !== item._id);
                    setExpandedItems(newExpandedItems);
                  } else {
                    const newExpandedItems = [...expandedItems, item._id];
                    setExpandedItems(newExpandedItems);
                  }
                }}
              >
                {isNoneExpand ? null : (<>
                  {isItemExpanded ? <ExpandLess /> : <ExpandMore />}
                </>)}

              </span>
            ) : null}
            {item.name}
          </MenuItem>,
        );
      }
      if (item.child) mapItem(item.child, lv + 1, result);
    });
    return result;
  };

  return (
    <>
      <Grid container spacing={16}>
        <Grid item md={12}>
          <CustomInputBase
            className={props.className}
            value={localData.department}
            disabled={props.disabled}
            onChange={handleDepartment}
            label={labelDepartment || intl.formatMessage(messages.department)}
            select = {isNoneExpand ? false : true}
          >
            <MenuItem value={0}>{intl.formatMessage(messages.selected)}</MenuItem>
            {mapItem(findChildren(departments))}
          </CustomInputBase>
        </Grid>
      </Grid>
    </>
  );
}

export default compose(
  injectIntl,
  React.memo,
)(DepartmentAndEmployee);

// export default memo(DepartmentAndEmployee);
