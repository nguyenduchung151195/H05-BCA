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

function DepartmentAndEmployee(props) {
  const {
    onClearSuccess,
    isClear = false,
    onChangeShow,
    employee,
    department = 0,
    onChange,
    disableEmployee,
    disableDepartmentH05,
    intl,
    labelDepartment,
    labelEmployee,
    moduleCode = '',
    profile,
    isHrm,
    isReport = false,
  } = props;
  const [departments, setDepartments] = useState([]);
  const [localData, setLocalData] = useState({
    employee,
    department: profile && profile.organizationUnit ? profile.organizationUnit.organizationUnitId : department,
  });

  const [expandedItems, setExpandedItems] = useState([]);
  const [expandedLv, setExpandedLv] = useState(0);
  const [employeeFilter, setEmployeeFilter] = useState({});
  const [roleDepartment, setRoleDepartment] = useState([]);
  const [firtBlood, setFirstBlood] = useState(false);

  useEffect(() => {
    if (
      props.moduleCode === 'reportDoingTask' ||
      props.moduleCode === 'reportsTaskStatus' ||
      props.moduleCode === 'reportStatsHrm' ||
      props.moduleCode === 'reportMeetingCustomer' ||
      props.moduleCode === 'reportsBusinessOpportunities' ||
      props.moduleCode === 'reportMonthlySalesTarget'
    ) {
      fetchData(`${API_ORIGANIZATION}?moduleCode=${props.moduleCode}`, 'GET', null).then(departmentsData => {
        setDepartments(departmentsData);
      });
    } else {
      fetchData(API_ORIGANIZATION, 'GET', null).then(departmentsData => {
        setDepartments(departmentsData);
      });
    }
  }, []);

  useEffect(
    () => {
      if (moduleCode && profile && !firtBlood) {
        getDepartmentModuleCode();
        setFirstBlood(true);
      }
    },
    [moduleCode, profile],
  );

  const getDepartmentModuleCode = async () => {
    try {
      const res = await fetchData(`${API_ROLE_APP}/${moduleCode}/${profile && profile._id}`);
      const { roles } = res;
      const code = 'DERPARTMENT';

      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
      const { data } = foundRoleDepartment;

      const newData = data.map(item => ({
        departmentId: item.id && item.id._id,
        view: item.data && item.data.view,
        edit: item.data && item.data.edit,
        delete: item.data && item.data.delete,
      }));
      setRoleDepartment(newData);
      const check = newData.find(i => i.view);
      if (!check) {
        onChangeShow && onChangeShow(false);
      }
    } catch (error) {
      // console.log(123, error);
    }
  };

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
  useEffect(
    () => {
      if (departments && departments.length && roleDepartment) {
        const result = [];
        const departmentArr = flatList(departments, result);
        const views = roleDepartment.filter(item => item.view).map(item => item.departmentId);
        const defaultExpandLv = findExpandedLv(departmentArr, views);
        setExpandedLv(defaultExpandLv);
      }
    },
    [departments, roleDepartment],
  );

  useEffect(
    () => {
      const newEmployeeFilter = {};
      if (department) {
        if (props.isHrm) {
          newEmployeeFilter['organizationUnit'] = department;
        } else {
          newEmployeeFilter['organizationUnit.organizationUnitId'] = department;
        }
      }
      setEmployeeFilter(newEmployeeFilter);
      setLocalData({
        employee: null,
        department: department || 0,
      });
    },
    [department],
  );

  useEffect(
    () => {
      setLocalData({
        ...localData,
        employee,
      });
    },
    [employee],
  );
  // const [innerEmployee, setInnerEmployee]

  const handleDepartment = e => {
    const { value } = e.target;
    const newLocalData = {
      department: value,
      employee: null,
    };
    setLocalData(newLocalData);
    onChange(newLocalData);

    if (value) {
      if (props.isHrm) {
        setEmployeeFilter({
          organizationUnit: value,
        });
      } else {
        setEmployeeFilter({
          'organizationUnit.organizationUnitId': value,
        });
      }
    } else {
      setEmployeeFilter({});
    }
  };

  const handleEmployee = newEmployee => {
    const newLocalData = {
      ...localData,
      employee: newEmployee,
    };
    setLocalData(newLocalData);
    onChange(newLocalData);
  };

  const findExpandedLv = (array, views) => {
    if (!views.length) {
      return 0;
    }
    const newData = array.filter(item => item.parent === null);
    if (newData.find(outer => views.find(inner => inner === outer._id))) {
      return 0;
    }
    return findLv(array, newData, 0, views);
  };

  const findLv = (allItem, parentArray, lv, views) => {
    lv += 1;
    const newData = parentArray && parentArray.length > 0 ? allItem.filter(item => parentArray.find(inner => inner._id === item.parent)) : [];
    if (newData && newData.length > 0) {
      if (newData.find(outer => views.find(inner => inner === outer._id))) {
        return lv;
      }
    }
    return findLv(allItem, newData, lv, views);
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
      const row = roleDepartment.find(it => it.departmentId === item._id);
      const parentRow = roleDepartment.find(exp => item.parent && exp.departmentId === item.parent);
      let isItemShowed = false;
      if (!item.parent) isItemShowed = true;
      else if (profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId === item._id) {
        isItemShowed = true;
      } else if (expandedItems.find(exp => exp === item.parent)) {
        isItemShowed = true;
      } else if (lv === expandedLv) {
        isItemShowed = true;
      } else if (row && row.view && (!parentRow || !parentRow.view)) {
        isItemShowed = true;
      } else if (item._id === localData.department) {
        isItemShowed = true;
      }
      if (isItemShowed && (props.noRole || (row && row.view))) {
        const isItemExpanded = expandedItems.find(exp => exp === item._id);
        result.push(
          <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
            {item.child && item.child.length ? (
              <span
                style={{ width: '40px' }}
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
              />
            ) : null}
            {item.name}
          </MenuItem>,
        );
      }
      if (item.child) mapItem(item.child, lv + 1, result);
    });
    return result;
  };
  useEffect(
    () => {
      if (isClear === true) {
        setLocalData({ employee: '', department: 0 });
        onClearSuccess();
      }
    },
    [isClear],
  );

  // console.log(1, roleDepartment.map(it => it.view == true))
  return (
    <>
      <Grid container spacing={isReport ? 0 : 16}>
        {Array.isArray(roleDepartment) && roleDepartment.find(it => it.view == true) ? (
          !disableEmployee ? (
            <>
              {!disableDepartmentH05 && (
                <Grid item md={6} className={isReport && 'reportStyle'}>
                  <CustomInputBase
                    isReport={isReport}
                    value={localData.department}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleDepartment}
                    label={labelDepartment || intl.formatMessage(messages.department)}
                    select
                  >
                    <MenuItem value={0}>{intl.formatMessage(messages.selected)}</MenuItem>
                    {mapItem(findChildren(departments))}
                  </CustomInputBase>
                </Grid>
              )}

              <Grid item md={disableDepartmentH05 ? 12 : 6} className={isReport && 'reportEmployeeStyle'}>
                <AsyncAutocomplete
                  value={localData.employee}
                  label={!labelEmployee ? intl.formatMessage(messages.employee) : labelEmployee}
                  placeholder={intl.formatMessage(messages.seaching)}
                  onChange={handleEmployee}
                  filter={employeeFilter}
                  url={props.isHrm ? API_PERSONNEL : API_USERS}
                  checkedShowForm={true}
                  filters={['name', 'code']}
                  customOptionLabel={option => `${option.name} - ${option.code}`}
                />
              </Grid>
            </>
          ) : (
            <Grid item md={12} className={isReport && 'reportStyle'}>
              {!disableDepartmentH05 && (
                <CustomInputBase
                  isReport={isReport}
                  value={localData.department}
                  disabled={props.disabled}
                  onChange={handleDepartment}
                  label={labelDepartment || intl.formatMessage(messages.department)}
                  select
                >
                  <MenuItem value={0}>{intl.formatMessage(messages.selected)}</MenuItem>
                  {mapItem(findChildren(departments))}
                </CustomInputBase>
              )}
            </Grid>
          )
        ) : null}
      </Grid>
    </>
  );
}

export default compose(
  injectIntl,
  React.memo,
)(DepartmentAndEmployee);

// export default memo(DepartmentAndEmployee);
