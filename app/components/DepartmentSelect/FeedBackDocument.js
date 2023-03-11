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
import { ExpandMore, ExpandLess, Search, AccountBalance, AccountCircle, LeakRemoveTwoTone } from '@material-ui/icons';
import { API_INCOMMING_DOCUMENT, API_ORIGANIZATION, API_ROLE_APP, MIN_ORDER } from '../../config/urlConfig';
import { fetchData, flatChildOpen, convertDot } from '../../helper';
import _ from 'lodash';
import { Autocomplete } from 'components/LifetekUi';
import withStyles from '@material-ui/styles';
import { serialize } from '../../utils/common';
import './index.css'
const TextFieldUI = props => <TextField id="id" {...props} />;
TextFieldUI.defaultProps = {
  size: 'small',
};
// document.getElementById('id').style.borderRadius = '10px'
let roleGroupsOrder = {};
try {
  roleGroupsOrder = JSON.parse(localStorage.getItem('roleGroups'));
} catch (error) {
  // console.log('error', error);
}
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
    roleGroupSource,
    columnSettings,
    onChangeColumnCheck,
    currentRole,
    nextRole,
    moduleCode,
    docIds,
    consult
  } = props;
  let timeout = 0;
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [listRoleLevel, setListRoleLevel] = useState({});
  const [listRoleLevelAndName, setListRoleLevelAndName] = useState([]);
  const [columns, setColumns] = useState([
    {
      name: 'view',
      title: 'Xem',
      _id: '5fb3ad613918a44b3053f080',
    },
  ]);
  const [employees, setEmployees] = useState();
  const [cloneEpl, setCloneEpl] = useState([]);
  const [search, setSearch] = useState([]);
  const [role, setRole] = useState({});
  const [userOrg, setUserOrg] = useState(null);
  let urlCurrent =
    moduleCode && props.typePage ? `${API_ROLE_APP}/${moduleCode}/currentUser?authority=true` : `${API_ROLE_APP}/${moduleCode}/currentUser`;
  useEffect(
    () => {
      if (Array.isArray(columnSettings)) {
        let newColumnSettings = [...columnSettings];
        if (!role.processing_set_command) {
          newColumnSettings = newColumnSettings.filter(c => c.name !== 'command');
        }
        setColumns(newColumnSettings);
      }
    },
    [columnSettings, role],
  );

  useEffect(() => {
    if (moduleCode) {
      fetchData(urlCurrent).then(res => {
        const { roles } = res;
        const code = 'BUSSINES';

        const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
        if (foundRoleDepartment) {
          const { data } = foundRoleDepartment;
          const newRole = {};
          data.forEach(rol => {
            Object.keys(rol.data).forEach(key => {
              newRole[`${rol.name}_${key}`] = rol.data[key];
            });
          });
          setRole(newRole);
        }
      });
    }
  }, []);

  useEffect(
    () => {
      if (docIds) {
        getData();
        let query = { filter: {}, actionType: 'set_feedback', docIds };
        if (roleGroupSource && roleGroupSource !== '' && props.typepage === "flow" && !consult) {
          query.filter.roleGroupSource = roleGroupSource;
        }
        if (consult && consult !== null && consult !== undefined && props.typepage === "flow") {
          query.roleDirection = consult;
        }
        if (consult && consult !== null && consult !== undefined && props.typepage === "flow") {
          query.consult = true;
        }
        // &roleDirection=${consult !== null ? consult : false}
        let urlListUser = props.typePage
          ? `${API_INCOMMING_DOCUMENT}/list-user?authority=true&${serialize(query)}}`
          : `${API_INCOMMING_DOCUMENT}/list-user?${serialize(query)}`;
        fetchData(urlListUser)
          .then(response => {
            if (response && response.data) {
              setUserOrg(response.currentEmployee.organizationUnit.organizationUnitId);
              const newUsers = response.data.map(e => convertDot({ ob: e, newOb: { organizationUnit: e.organizationUnit } }));
              setEmployees(newUsers);
              setCloneEpl(newUsers);
            }
          })
          .catch();
      }
    },
    [currentRole, docIds],
  );
  useEffect(
    () => {
      let employeesFilter;
      if (search) {
        employeesFilter =
          cloneEpl && cloneEpl.filter(item => removeVietnameseTones(item.name.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase())));
      } else {
        employeesFilter = cloneEpl;
      }
      if (search.length > 0) {
        departments.forEach(item => {
          employeesFilter.forEach(ele => {
            if (item._id == ele['organizationUnit.organizationUnitId'] || item._id == ele.organizationUnit.organizationUnitId) {
              const arr = item.slug.split('/');
              departments.forEach(items => {
                if (items.slug.includes(arr[0])) {
                  items.expand = true;
                  items.open = true;
                }
              });
            }
          });
        });
      } else {
        departments.forEach((item, index) => {
          if (item.parent === null) {
            item.open = true;
            item.expand = false;
          } else {
            item.open = false;
            item.expand = false;
          }
        });
      }
      setEmployees(employeesFilter);
    },
    [search],
  );
  useEffect(
    () => {
      if ((allowedDepartmentIds, departments, employees)) {
        setData(mergeDerpartment(data, departments, employees, allowedUsers));
      }
    },
    [allowedDepartmentIds, departments, employees, allowedUsers],
  );
  useEffect(() => {
    setListRoleLevel(localStorage.getItem('roleGroups') ? JSON.parse(localStorage.getItem('roleGroups')) : {})
    setListRoleLevelAndName(localStorage.getItem('roleGroupsAndName') ? JSON.parse(localStorage.getItem('roleGroupsAndName')) : [])

  }, [])
  const removeVietnameseTones = str => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    str = str.replace(/\u02C6|\u0306|\u031B/g, '');
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
    return str;
  };

  const getData = async () => {
    try {
      const departmentsRes = await fetchData(API_ORIGANIZATION);
      const flattedDepartment = flatChildOpen(departmentsRes);
      flattedDepartment.forEach((item, index) => {
        if (item.parent === null) {
          item.open = true;
          item.expand = false;
        } else {
          item.open = false;
          item.expand = false;
        }
      });
      setDepartments(flattedDepartment);
    } catch (error) { }
  };
  const handleSearch = e => {
    const search = e.target.value;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setSearch(search);
    }, 500);

    // const data2 = _.cloneDeep(employees)
    // data2.forEach((item,index) => {
    //   const dataFilter = item && item.users && item.users.filter(item => item.userName.includes(search))
    //   data2[index].users = dataFilter
    // })
    // console.log(data, data2, 'oooooo')
    // setDepartments(departFilter)
    // setData(data2)
  };

  function mergeDerpartment(data, z, users = [], allowedEmployees = [], result) {
    let level = -1;
    const findOrg = z.find(i => i.id === userOrg);
    if (findOrg) {
      level = findOrg.level;
    }
    const x = z.map((i, index) => {
      let disableSetProcess = false;
      // if (i.level >= level && !i.slug.includes(userOrg)) {
      //   disableSetProcess = true;
      // }
      const dataIndex = data[index];
      const departmentUsers = (users.filter(u => u.organizationUnit && u.organizationUnit.organizationUnitId === i.id && !disableSetProcess) || [])
        .sort((a, b) => {
          if (((roleGroupsOrder && roleGroupsOrder[b.roleGroupSource]) || 0) > ((roleGroupsOrder && roleGroupsOrder[a.roleGroupSource]) || 0)) {
            return -1;
          }
          if (((roleGroupsOrder && roleGroupsOrder[b.roleGroupSource]) || 0) < ((roleGroupsOrder && roleGroupsOrder[a.roleGroupSource]) || 0)) {
            return 1;
          }
          return 0;
        })
        .map(u => {
          let dataCheck = { view: false, edit: false, delete: false };
          if (dataIndex && dataIndex.users) {
            const findUser = dataIndex.users.find(ui => ui.id === u._id);
            if (findUser) {
              dataCheck = findUser.data;
            }
          }
          return {
            ...u,
            is_user: true,
            userName: u.name,
            userNameCopy: u.name,
            open: u.open,
            name: u.id,
            id: u._id,
            expand: u.expand,
            slug: u.slug,
            data: dataCheck,
            disableSetProcess,
          };
        });
      return {
        open: i.open,
        name: i.id,
        id: i.id,
        expand: true,
        slug: i.slug,
        data: dataIndex ? dataIndex.data : { view: false, edit: false, delete: false },
        users: departmentUsers,
        allowedSelectDepartment: i.level > level,
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
            data: { [valueName]: !checked },
            users: i.users.map(it => {
              return {
                ...it,
                data: {
                  ...it.data,
                  [valueName]: false,
                },
              };
            }),
          }
          : {
            ...i,
            data: valueName === 'processing' ? { ...i.data, [valueName]: false } : i.data,
            users: i.users.map(it => {
              return {
                ...it,
                data: valueName === 'processing' ? { ...i.data, [valueName]: false } : { ...i.data },
              };
            }),
          },
    );
    setData(newData);
    const viewedDepartmentIds = newData.filter(item => item.data.view).map(item => item.name);
    if (columnSettings && columnSettings.length) {
      const result = {};
      columnSettings.forEach(c => {
        result[c.name] = newData.filter(item => item.data[c.name]).map(item => item.name);
        result[`${c.name}Users`] = [];
        newData.forEach(rowData => {
          rowData.users &&
            rowData.users.forEach(u => {
              if (c.name !== 'processing' && u.data[c.name]) {
                result[`${c.name}Users`].push(u.id);
              }
              if (c.name === 'processing' && u.data[c.name]) {
                result[`${c.name}Users`] = [u.id];
              }
            });
        });
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
      const newData = [...data];

      for (let i = 0; i < newData.length; i += 1) {
        newData[i].data[columnName] = false;
        if (columnName === 'processing') {
          newData[i].users.map(item => {
            item.data[columnName] = false;
          });
        }
      }

      let user = newData[rowIndex].users.find(u => u.id === userId);
      if (user.data) {
        Object.keys(user.data).map(item => {
          if (item !== columnName) {
            user.data[item] = false;
          }
        });
      }

      user.data[columnName] = !user.data[columnName];
      const result = {};

      columnSettings.forEach(c => {
        result[c.name] = newData.filter(item => item.data[c.name]).map(item => item.name);
        result[`${c.name}Users`] = [];
        newData.forEach(rowData => {
          rowData.users &&
            rowData.users.forEach(u => {
              if (c.name !== 'processing' && u.data[c.name]) {
                result[`${c.name}Users`].push(u.id);
              }
              if (c.name === 'processing' && u.data[c.name]) {
                result[`${c.name}Users`] = [u.id];
              }
            });
        });
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
        return i;
      });
    }
    setDepartments(tabDerpartment);
  }
  const getName = (item) => {
    const role = item && (item.roleGroupSourceAuthorized || item.roleGroupSource) || ""
    const roleAcc = listRoleLevelAndName.find(element => element.code === role);
    if (roleAcc && roleAcc.order <= MIN_ORDER) {
      return `${item.userNameCopy} - ${roleAcc.name || ""}` || item.nameAuthorized || item.userNameCopy
    }
    return item && (item.nameAuthorized || item.userNameCopy) || ""
  }

  const getNameOfUserName = (userName) => {
    let fullName = userName && (userName.nameAuthorized || userName.userNameCopy) || ""
    fullName = fullName ? fullName.trim() : ""
    const idx = fullName.lastIndexOf(" ")
    return fullName.slice(idx) || ""
  }

  const sortAZ = (list) => {
    let listUser = list
    for (let i = 0; i < listUser.length - 1; i++) {
      for (let j = i + 1; j < listUser.length; j++) {
        if (getNameOfUserName(listUser[i].userName).localeCompare(getNameOfUserName(listUser[j].userName)) == 1) {
          let temp = listUser[i];
          listUser[i] = listUser[j]
          listUser[j] = temp
        }
      }
    }
    listUser.map((el) => el.userName = getName(el))
    return listUser || []
  }
  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <p>{title}</p>
      </div>
      <div style={{ width: 200, marginBottom: 10, marginTop: -25 }}>
        <TextFieldUI
          variant="outlined"
          InputProps={{
            startAdornment: <Search />,
          }}
          placeholder="Tìm kiếm..."
          ref={input => (this.search = input)}
          onChange={handleSearch}
        />
      </div>
      <div style={{ padding: '0 10px', height: '100%', overflow: 'auto' }}>
        <Grid container style={{ justifyContent: 'space-between', marginBottom: 5, paddingRight: 10 }}>
          <Grid item xs={3}>
            Tên đơn vị, cá nhân
          </Grid>
          {columns.map(i => (
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              {i.title}
            </Grid>
          ))}
        </Grid>
        <div style={{ height: 400, overflowY: 'auto', paddingBottom: 20 }}>
          {departments.map(
            (i, rowIndex) =>
              i.open && (i.child || (data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length > 0)) ? (
                <>
                  <Grid
                    container
                    className='customHover'
                    style={{ justifyContent: 'space-between', borderBottom: '1px solid #e2e2e2', display: 'flex', alignItems: 'center' }}
                  >
                    <Grid item xs={columns && Array.isArray(columns) && columns.length ? Math.floor(12 / (2 * (columns.length))) : 3} style={props.firstColumnStyle || styles.codeCol}>
                      <p
                        style={{ paddingLeft: i.level ? i.level * 10 : 0, fontWeight: i.child ? 'bold' : false, margin: 0 }}
                        onClick={e => {
                          e.stopPropagation();
                          expandRow(i.slug, i.name, i.expand);
                        }}
                      >
                        <AccountBalance style={{ paddingRight: 10 }} />
                        {i.title}
                        {i.child || (data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length > 0) ? (
                          i.expand ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )
                        ) : null}
                      </p>
                    </Grid>
                    {columns.map(it => (
                      <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center' }}>
                        {role.processing_free_role_to_set && it.allowSelectDepartment && data[rowIndex] && data[rowIndex].allowedSelectDepartment ? (
                          <CheckDerpartment
                            isView={props.isView ? props.isView : null}
                            handleCheckDerpartment={handleCheckDerpartment}
                            checked={data[rowIndex] && data[rowIndex].data && data[rowIndex].data[it.name] ? true : false}
                            column={it.name}
                            row={i.name}
                          />
                        ) : null}
                      </Grid>
                    ))}
                  </Grid>
                  {i.expand && data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length
                    ? sortAZ(data[rowIndex].users).map(user => (
                      <>
                        <Grid container className='customHover' style={{ justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e2e2' }}>
                          <Grid item xs={columns && Array.isArray(columns) && columns.length ? Math.floor(12 / (2 * (columns.length))) : 3} style={props.firstColumnStyle || styles.codeCol}>
                            <p
                              style={{
                                paddingLeft: i.level ? (i.level + 1) * 10 : 0,
                                color: '#2196F3',
                                margin: 0,
                                minHeight: 40,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <AccountCircle style={{ paddingRight: 10 }} />
                              {user.userName}
                            </p>
                          </Grid>
                          {columns.map(it => (
                            <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center' }}>
                              {!(user[`roleCached.IncommingDocument.${it.name}_view`] || it.name === 'commanders') ||
                                (it.name === 'processing' && user.disableSetProcess) ? null : (
                                <Checkbox
                                  onChange={() => {
                                    handleCheckUser(user.id, it.name, rowIndex);
                                  }}
                                  checked={(user && user.data && user.data[it.name]) || false}
                                />
                              )}
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    ))
                    : null}
                </>
              ) : null,
          )}
        </div>
      </div>
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
