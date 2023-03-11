import React, { useCallback, useEffect, useState } from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Checkbox,
  Button,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Menu,
  Select,
} from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { API_ORIGANIZATION, API_USERS } from '../../config/urlConfig';
import { fetchData, flatChild } from '../../helper';
import lodash from 'lodash';
import { Autocomplete } from 'components/LifetekUi';

function DepartmentSelect(props) {
  const {
    onChange,
    title,
    allowedDepartmentIds,
    allowedUsers = [],
    onAllowedUsersChange,
    isMultiple,
    targetGroupCode,
    onChangetargetGroupCode,
    disabledEmployee,
    onChangeAddRoles,
    columnSettings,
    onChangeColumnCheck,
  } = props;
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [columns, setColumns] = useState([
    {
      name: 'view',
      title: 'Xem',
      _id: '5fb3ad613918a44b3053f080',
    },
  ]);
  const [employees, setEmployees] = useState();
  const [cloneEpl, setCloneEpl] = useState([]);
  const [filter, setFilter] = useState({ position: isMultiple ? [] : '' });
  const [positions, setPositions] = useState([]);

  useEffect(
    () => {
      if (Array.isArray(columnSettings)) {
        setColumns(columnSettings);
      }
    },
    [columnSettings],
  );

  useEffect(() => {
    if (props.position) {
      const newColumns = [{ name: 'position', title: 'Chức vụ', _id: '5fb3ad613918a44b3053f081' }].concat(columns);
      setColumns(newColumns);
    }
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    const foundPosition = crmSource.find(it => it.code === 'S25');
    const { data } = foundPosition;
    if (Array.isArray(data)) {
      setPositions([...data]);
    }

    getData();
    fetchData(API_USERS)
      .then(response => {
        if (response && response.data) {
          setEmployees(response.data);
          setCloneEpl(response.data);
        }
      })
      .catch();
  }, []);

  useEffect(
    () => {
      if ((allowedDepartmentIds, departments, employees)) {
        // if (columnSettings && columnSettings.length && data.length) {
        //   return;
        // }
        let ids = [];
        if (Array.isArray(allowedDepartmentIds)) {
          ids = allowedDepartmentIds;
        }

        if (Array.isArray(data)) {
          ids = lodash.uniq(ids.concat(data.filter(i => i.data && i.data.view).map(i => i.name)));
        }
        setData(mergeDerpartment(ids, departments, employees, allowedUsers));
      }
    },
    [allowedDepartmentIds, departments, employees, allowedUsers],
  );

  useEffect(
    () => {
      if (targetGroupCode) {
        const position = positions.filter(e => targetGroupCode.includes(e.value));
        setFilter(state => ({ ...state, position }));
      }
    },
    [targetGroupCode],
  );

  useEffect(
    () => {
      let newEmployees = [];
      const value = filter.position;

      if (isMultiple) {
        if (value && value.length > 0) {
          const cloneEmployee = [...cloneEpl];
          // newEmployees = cloneEmployee.filter(it => it.positions && value.includes(it.positions.value));
          newEmployees = cloneEmployee.filter(it => it.positions && value.some(i => i.value === it.positions.value));
        } else {
          newEmployees = [...cloneEpl];
        }
      } else {
        if (value && value !== 0) {
          const cloneEmployee = [...cloneEpl];
          newEmployees = cloneEmployee.filter(it => it.positions && it.positions.value === value.value);
        } else {
          newEmployees = [...cloneEpl];
        }
      }

      setEmployees(newEmployees);
    },
    [filter.position, cloneEpl],
  );

  const getData = async () => {
    try {
      const departmentsRes = await fetchData(API_ORIGANIZATION);
      const flattedDepartment = flatChild(departmentsRes);
      setDepartments(flattedDepartment);
    } catch (error) {}
  };

  function mergeDerpartment(data, z, users = [], allowedEmployees = [], result) {
    const x = z.map(i => {
      const departmentUsers = (users.filter(u => u.organizationUnit && u.organizationUnit.organizationUnitId === i.id) || []).map(u => {
        const dt = allowedEmployees.find(it => it === u._id);
        if (dt) {
          return {
            is_user: true,
            userName: u.name,
            open: u.open,
            name: u.id,
            id: u._id,
            expand: u.expand,
            slug: u.slug,
            position: u.positions && u.positions.title,
            data: { view: true, edit: false, delete: false },
          };
        }
        return {
          is_user: true,
          userName: u.name,
          open: u.open,
          name: u.id,
          id: u._id,
          expand: u.expand,
          slug: u.slug,
          position: u.positions && u.positions.title,
          data: { view: false, edit: false, delete: false },
        };
      });
      if (Array.isArray(data) && data.length) {
        const dt = data.find(it => it === i.id);
        if (dt)
          return {
            open: i.open,
            name: i.id,
            id: i.id,
            expand: i.expand,
            slug: i.slug,
            data: { view: true, edit: false, delete: false },
            users: departmentUsers,
          };
      }
      return {
        open: i.open,
        name: i.id,
        id: i.id,
        expand: i.expand,
        slug: i.slug,
        data: { view: false, edit: false, delete: false },
        users: departmentUsers,
      };
    });
    return x;
  }

  function handleCheckDerpartment(name, valueName, checked) {
    const slug = data.find(i => i.name === name).slug;
    const list = slug.split('/');
    const newAllowedUsers = [...allowedUsers];
    const newData = data.map(
      i =>
        i.slug.includes(slug) || (list.includes(i.name) && checked)
          ? {
              ...i,
              data: { ...i.data, [valueName]: !checked },
              // users: i.users.map(it => {
              //   const index = newAllowedUsers.findIndex(u => u === it.id);
              //   if (!checked) {
              //     if (index === -1) {
              //       newAllowedUsers.push(it.id);
              //     }
              //   } else {
              //     newAllowedUsers.splice(index, 1);
              //   }
              //   return {
              //     ...it,
              //     data: {
              //       ...it.data,
              //       view: !checked,
              //     },
              //   };
              // }),
            }
          : i,
    );
    setData(newData);
    const viewedDepartmentIds = newData.filter(item => item.data.view).map(item => item.name);
    if (columnSettings && columnSettings.length) {
      const result = {};
      columnSettings.forEach(c => {
        result[c.name] = newData.filter(item => item.data[c.name]).map(item => item.name);
        result[`${c.name}Users`] = [];
        newData.forEach(rowData => {
          rowData.users && rowData.users.forEach(u => {
            if (u.data[c.name]) {
              result[`${c.name}Users`].push(u.id);
            }
          });
        })
        if (onChangeColumnCheck) {
          onChangeColumnCheck(result);
        }
      });
    }
    if (onChangeAddRoles) onChangeAddRoles(newData, departments);
    if (onChange) onChange(viewedDepartmentIds, newAllowedUsers);
  }

  function handleCheckUser(userId, columnName, rowIndex) {
    if (!userId) return;
    if (columnSettings && columnSettings.length) {
      const newData = [ ...data ];
      const user = newData[rowIndex].users.find(u => u.id === userId);
      user.data[columnName] = !user.data[columnName];
      const result = {};
      columnSettings.forEach(c => {
        result[c.name] = newData.filter(item => item.data[c.name]).map(item => item.name);
        result[`${c.name}Users`] = [];
        newData.forEach(rowData => {
          rowData.users && rowData.users.forEach(u => {
            if (u.data[c.name]) {
              result[`${c.name}Users`].push(u.id);
            }
          });
        })
        if (onChangeColumnCheck) {
          onChangeColumnCheck(result);
        }
      });
      return;
    }

    const newAllowedUsers = [...allowedUsers];
    const index = newAllowedUsers.findIndex(u => u === userId);
    if (index === -1) {
      newAllowedUsers.push(userId);
    } else {
      newAllowedUsers.splice(index, 1);
    }
    if (onAllowedUsersChange) {
      onAllowedUsersChange(newAllowedUsers);
    }
  }

  function expandRow(slug, name, expand) {
    let tabDerpartment;

    if (expand) {
      tabDerpartment = departments.map(i => {
        if (i.name === name) return { ...i, expand: false };
        if (i.slug.includes(slug)) return { ...i, open: false, hide: true };
        return i;
      });
    } else {
      tabDerpartment = departments.map(i => {
        if (i.name === name) return { ...i, expand: true };
        if (i.parent === name) return { ...i, open: true, hide: false };
        return { ...i, expand: false };
      });
    }
    setDepartments(tabDerpartment);
  }

  const handleFilter = position => {
    setFilter({ ...filter, position });

    if (onChangetargetGroupCode) {
      const pos = positions.filter(e => position.includes(e));
      onChangetargetGroupCode({
        targetGroup: pos.map(e => e.title),
        targetGroupCode: pos.map(e => e.value),
      });
    }
  };
  const sortAZ=(list)=>{
    let listUser =list
    console.log(list, "list")
  
    for (let i = 0; i < listUser.length -1; i++) {
      for (let j = i+1; j < listUser.length; j++) {
       if( listUser[i].userName.localeCompare(listUser[j].userName) == 1)
          {
            let temp=  listUser[i];
            listUser[i] = listUser[j]
            listUser[j]= temp
          }
      }
      
    }
    console.log(listUser, "listUser")
    return listUser|| []
  }
  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <p>{title}</p>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Phòng ban</TableCell>
            {columns.map(i => (
              <TableCell>{i.title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map(
            (i, rowIndex) =>
              i.open ? (
                <>
                  <TableRow>
                    <TableCell style={props.firstColumnStyle || styles.codeCol}>
                      <p
                        style={{ paddingLeft: i.level ? i.level * 10 : 0, fontWeight: i.child ? 'bold' : false }}
                        onClick={e => {
                          e.stopPropagation();
                          expandRow(i.slug, i.name, i.expand);
                        }}
                      >
                        {i.title}
                        {i.child || (data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length) ? (
                          i.expand ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )
                        ) : null}
                      </p>
                    </TableCell>
                    {columns.map(it => (
                      <TableCell>
                        {props.position && it.name === 'position' ? (
                          ''
                        ) : (
                          <CheckDerpartment
                            isView={props.isView ? props.isView : null}
                            handleCheckDerpartment={handleCheckDerpartment}
                            checked={data[rowIndex] && data[rowIndex].data && data[rowIndex].data[it.name] ? true : false}
                            column={it.name}
                            row={i.name}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {!disabledEmployee
                    ? i.expand && data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length
                      ? sortAZ(data[rowIndex].users).map(user => (
                          <TableRow>
                            <TableCell style={props.firstColumnStyle || styles.codeCol}>
                              <p style={{ paddingLeft: i.level ? (i.level + 1) * 10 : 0, color: '#2196F3' }}>{user.userName}</p>
                            </TableCell>
                            {columns.map(it => (
                              <TableCell>
                                {props.position && it.name === 'position' ? (
                                  <Typography>{user && user.position ? user.position : ''}</Typography>
                                ) : (
                                  <Checkbox
                                    onClick={() => {
                                      handleCheckUser(user.id, it.name, rowIndex);
                                    }}
                                    checked={user && user.data ? user.data[it.name] : false}
                                  />
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      : null
                    : null}
                </>
              ) : null,
          )}
        </TableBody>
      </Table>
    </>
  );
}

function CheckDerpartment({ handleCheckDerpartment, row, column, checked, isView }) {
  function check() {
    handleCheckDerpartment(row, column, checked);
  }
  return <Checkbox disabled={isView} onClick={check} checked={checked} />;
}

DepartmentSelect.propTypes = {};

export default DepartmentSelect;

const styles = {
  codeCol: {
    minWidth: '34vw',
  },
};
