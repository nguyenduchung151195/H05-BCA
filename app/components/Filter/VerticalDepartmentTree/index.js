/**
 *
 * AdvanceSearch
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import TableUI from '@material-ui/core/Table';
import { TableRow, TableCell, TableHead, TableBody } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { addUserToDepartment, addHrmToDepartment, fetchData } from '../../../helper';
import { API_USERS, API_PERSONNEL } from '../../../config/urlConfig';
import FluctuationsMonth from 'components/FluctuationsMonth'
import { Grid, Tabs, Tab } from 'components/LifetekUi';


let level = 0;
function VerticalDepartmentTree(props) {
  const { classes = {}, departments = [], onChange, show, addUser = true, addHrm, departmentId, listData, openDetail } = props;
  const [localDepartments, setLocalDepartments] = useState([]);

  const [employees, setEmployees] = useState(null);
  const [hrm, setHrm] = useState(null);
  const [selected, setSelected] = useState('');
  const [tabColumn, setTabColumn] = useState(0)

  useEffect(() => {
    if (addUser) {
      fetchData(API_USERS)
        .then(response => {
          if (response && response.data) {
            setEmployees(response.data);
          }
        })
        .catch(console.log);
    }
    // if (addHrm) {
    //   fetchData(API_PERSONNEL)
    //     .then(response => {
    //       if (response && response.data) {
    //         setHrm(response.data.map(item => ({ ...item, isHrm: true })));
    //       }
    //     })
    //     .catch(console.log);
    // }
  }, []);

  useEffect(
    () => {
      let newDepartment = JSON.parse(JSON.stringify(departments));
      if (departmentId) {
        const seletedDepart = selectDepartment(newDepartment, departmentId);
        if (seletedDepart !== null) {
          newDepartment = seletedDepart;
        }
      }

      if (addUser) {
        setLocalDepartments(addUserToDepartment(newDepartment, employees));
      }
      if (addHrm) {
        setLocalDepartments(addHrmToDepartment(newDepartment, hrm));
      }
    },
    [departments, employees, hrm, departmentId],
  );

  const selectDepartment = (departments, id) => {
    for (let i = 0; i < departments.length; i++) {
      if (departments[i]._id === id) {
        return [departments[i]];
      } else {
        if (Array.isArray(departments[i].child) && departments[i].child.length > 0) {
          const selectedDepart = selectDepartment(departments[i].child, id);
          if (selectedDepart) {
            return selectedDepart;
          };
        }
      }
    }
    return null;
  }

  const clickOpen = depart => {
    /* eslint-disable */
    if (!depart.open) {
      depart.open = true;
    } else {
      depart.open = false;
    }
    // setChangeOpen(true);
  };

  const handleChangeDepartment = depart => {
    if (onChange) {
      setSelected(depart._id);
      onChange(depart);
    }
  };

  const displayTableContent = (dataList, level) => {
    return dataList.map(department => {
      const color = (department.username || department.email) ? '#2196F3' : null;
      if (department.child && department.child.length > 0) {
        return (
          <React.Fragment key={department._id}>
            <TableRow onClick={() => handleChangeDepartment(department)} className="tbColSpan">
              <TableCell onClick={() => clickOpen(department)} className={department._id === selected ? 'selected' : ''}>
                <span style={{ padding: `${level}px` }} />
                {department.open ? <ExpandLess /> : <ExpandMore />}
                &nbsp;
                {department.name}
              </TableCell>
            </TableRow>
            {department.open ? displayTableContent(department.child, level + 20) : null}
          </React.Fragment>
        );
      }
      return (
        <TableRow key={department._id} onClick={() => handleChangeDepartment(department)} className="tbColSpan">
          <TableCell className={department._id === selected ? 'selected' : ''}>
            <span style={{ padding: `${level}px` }} />
            <span style={{ color }}> {department.name}</span>
          </TableCell>
        </TableRow>
      );
    });
  };

  const renderFluctuationsMonth = () => {
    return (
      <Grid item container spacing={16} style={{padding: 0}}>
        {listData.map(item => {
          return (
            <Grid item xs={6}>
              <FluctuationsMonth
                style={{ marginTop: 15 }}
                icon={item.icon}
                // number={catagory.length ? catagory.length : 0}
                text={item.name}
                backColor={item.color}
                color={`linear-gradient(to right, #03A9F4, #03a9f4ad)`}
                openDetail={() => { openDetail(item.name) }}

              />
            </Grid>
          )
        })}
      </Grid>
    )

  }
  
  return (
    <>
      <Tabs value={tabColumn} onChange={(e, tab) => setTabColumn(tab)} centered={true} style={{minWidth: '300px'}}>
        {show && <Tab value={1} label={'Biến động trong tháng'} />}
        <Tab value={0} label={'Sơ đồ cây'} />
      </Tabs>
      {(show && tabColumn === 1) && renderFluctuationsMonth()}
      {tabColumn === 0 && <TableUI className={classes.table} aria-labelledby="tableTitle">
        <TableBody>
          <TableRow onClick={() => handleChangeDepartment('')} className="tbColSpan">
            <TableCell>Tất cả tổ chức</TableCell>
          </TableRow>
          {localDepartments.map(depart => {
            if (depart.child && depart.child.length > 0) {
              return (
                <React.Fragment key={depart._id}>
                  <TableRow onClick={() => handleChangeDepartment(depart)} className="tbColSpan">
                    <TableCell onClick={() => clickOpen(depart)} className={depart._id === selected ? 'selected' : ''}>
                      {depart.open ? <ExpandLess /> : <ExpandMore />}
                      &nbsp;
                      {depart.name}
                    </TableCell>
                  </TableRow>
                  {depart.open ? displayTableContent(depart.child, level + 20) : null}
                </React.Fragment>
              );
            }
            return (
              <TableRow key={depart._id} onClick={() => handleChangeDepartment(depart)} className="tbColSpan">
                <TableCell className={depart._id === selected ? 'selected' : ''}>{depart.name}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableUI>}

    </>
  );
}

VerticalDepartmentTree.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  handleSave: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default compose(
  memo,
)(VerticalDepartmentTree);
