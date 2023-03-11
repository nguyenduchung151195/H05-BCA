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
import { ExpandMore, ExpandLess, Search, AccountBalance, AccountCircle } from '@material-ui/icons';
import { API_INCOMMING_DOCUMENT, API_USERS, API_ORIGANIZATION, API_ROLE_APP, API_DOCUMENT_HISTORY, MIN_ORDER } from '../../config/urlConfig';
import { fetchData, flatChildOpen, convertDot } from '../../helper';
import _ from 'lodash';
import { Autocomplete } from 'components/LifetekUi';
import withStyles from '@material-ui/styles';
import { serialize } from '../../utils/common';
import moment from 'moment';
import { arrayOf } from 'prop-types';
import './index.css'
import ja from 'date-fns/locale/ja/index';
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
    typeReturn,
    columnSettings,
    type = '',
    typeFlow = '',
    onChangeColumnCheck,
    getRole,
    getCommander,
    getSupportRole,
    resultP = {},
    currentRole,
    nextRole,
    processType,
    typePage = '',
    processeds = [],
    supporteds = [],
    supporters = [],
    moduleCode,
    isReturn = false,
    open = false,
    roleP,
    typeDoc = '',
    profile,
    childTemplate,
    docIds,
    getFlag,
    checkOrg,
    roleDirection,
    sendUnit,
    allowSendToUnit,
    byOrg,
    unit,
    organizationUnit,
    rootTab,
    setIsFirstID,
    isReturnDoc
  } = props;
  let timeout = 0;
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentsClone, setDepartmentsClone] = useState([]);
  const [checkFirst, setCheckFirst] = useState(0);
  const [firstId, setFirstId] = useState();


  const [listRoleLevel, setListRoleLevel] = useState({});
  const [listRoleLevelAndName, setListRoleLevelAndName] = useState([]);


  const [columns, setColumns] = useState([
    {
      name: 'view',
      title: 'Xem',
      _id: '5fb3ad613918a44b3053f080',
    },

  ]);

  const [history, setHistory] = useState([]);
  const isRoom = profile && profile.canProcessAny && profile.workingOrganization && !profile.workingOrganization.parent ? true : false;
  const [employees, setEmployees] = useState();
  const [cloneEpl, setCloneEpl] = useState([]);
  const [search, setSearch] = useState((props.childTemplate && props.childTemplate.name || props.type === "flow" || props.type === "startFlow") ? " " : []);
  const [role, setRole] = useState({});
  const [userOrg, setUserOrg] = useState(null);
  const [countObj, setCountObj] = useState({});



  const [checkAll, setCheckAll] = useState({
    support: false,
    view: false,
    processing: false
  });

  let urlCurrent =
    moduleCode && typePage !== '' ? `${API_ROLE_APP}/${moduleCode}/currentUser?authority=true` : `${API_ROLE_APP}/${moduleCode}/currentUser`;
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
  // const checkProcess = (id) => {
  //   let canProcess = true
  //   history.length > 0 && history.map((el) => {
  //     el.childs && Array.isArray(el.childs) && el.childs.length > 0 && el.childs.map((it) => {
  //       if (it.action === "Xử lý chính" && it.stageStatus === "Chưa xử lý")
  //         if (it.receiver && it.receiver._id && it.receiver._id === id) canProcess = false
  //     })
  //   })
  //   return canProcess
  // }
  // useEffect(() => {
  //   const query = { filter: { docId: docIds } };
  //   fetch(`${API_DOCUMENT_HISTORY}?${serialize(query)}`, {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       setHistory(data)
  //     })
  // }, [])
  useEffect(() => {
    setListRoleLevel(localStorage.getItem('roleGroups') ? JSON.parse(localStorage.getItem('roleGroups')) : {})
    setListRoleLevelAndName(localStorage.getItem('roleGroupsAndName') ? JSON.parse(localStorage.getItem('roleGroupsAndName')) : [])

  }, [])
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
      getData();
      if (open) {
        if ( (type === '' || type === 'flow') && !isReturnDoc) {
          // k là lấy ds trả lại
          const query = { filter: {} };
          if (docIds && docIds.length) {
            query.docIds = docIds;
          }
          if (isReturn) {
            query.isReturn = isReturn;
          }
          if (Array.isArray(childTemplate) && roleP !== 'supporters') {
            let and = [];
            let role = [];
            childTemplate.map(child => {
              if (processType === 'any' && profile && profile.canProcessAny) {
                // if (child.type !== '') {
                //   role.push({
                //     roleGroupSource: child.code
                //   })
                // }
              } else {
                if (child.type !== '') {
                  and = [
                    {
                      type: child.type,
                    },
                    {
                      roleGroupSource: child.code,
                    },
                  ];
                } else {
                  role.push({
                    roleGroupSource: child.code,
                  });
                }
              }
            });
            let or = and.length === 0 ? role : [{ $and: [...and] }, ...role];
            query.filter['$or'] = [...or];
          }
          if (!Array.isArray(childTemplate) && role !== 'supporters' && currentRole) {
            query.filter.roleGroupSource = currentRole;
          }

          if (roleP === 'supporters' && supporteds && supporteds.length > 0) {
            query.filter._id = { $nin: supporteds };
          }

          if (roleP === 'commander' && supporters && supporters.length > 0) {
            query.filter._id = { $nin: supporters };
          }
          if (processType === 'any') {
            query.isAny = true;
          }
          if (processType === 'any' && sendUnit) {
            query.unit = sendUnit;
          }
          // if (processType === 'any' && allowSendToUnit) {
          //   query.allowSendToUnit = allowSendToUnit;
          // }
          if (roleP === 'commander') {
            query.isCommand = roleP;
          }
          if ((processType === 'flow') && unit) {
            query.unit = unit;
          }
          // let roleDirection = Array.isArray(props.childTemplate) && props.childTemplate.length > 0 && props.childTemplate[0].roleDirection ? props.childTemplate[0].roleDirection : null
          // if (Array.isArray(props.childTemplate) && props.childTemplate.length) {
          // }
          let urlListUser;
          if (props.processType === 'flow') {
            if (roleP !== 'supporters') {
              urlListUser =
                typePage !== ''
                  ? `${API_INCOMMING_DOCUMENT}/list-user?authority=true&${serialize(query)}&checkOrg=${checkOrg !== undefined ? checkOrg : false}`
                  : `${API_INCOMMING_DOCUMENT}/list-user?${serialize(query)}&checkOrg=${checkOrg !== undefined ? checkOrg : false}`;
              urlListUser = typeDoc !== '' ? `${urlListUser}&type=${typeDoc}` : urlListUser;
            } else {
              // query.filter['organizationUnit.organizationUnitId'] = profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId;
              urlListUser =
                typePage !== ''
                  ? `${API_INCOMMING_DOCUMENT}/list-user?&authority=true&${serialize(query)}&checkOrg=${checkOrg !== undefined ? checkOrg : false}`
                  : `${API_INCOMMING_DOCUMENT}/list-user?&${serialize(query)}&checkOrg=${checkOrg !== undefined ? checkOrg : false}`;
              urlListUser = typeDoc !== '' ? `${urlListUser}&type=${typeDoc}` : urlListUser;
            }
          } else {
            if (roleP !== 'supporters') {
              if (typeReturn) {
                urlListUser =
                  typePage !== ''
                    ? `${API_INCOMMING_DOCUMENT}/list-user?isFlow=true&authority=true&${serialize(query)}&checkOrg=${checkOrg !== undefined ? checkOrg : false}${roleDirection ? `&roleDirection=${roleDirection}` : ''}`
                    : `${API_INCOMMING_DOCUMENT}/list-user?isFlow=true&${serialize(query)}&checkOrg=${checkOrg !== undefined ? checkOrg : false}${roleDirection ? `&roleDirection=${roleDirection}` : ''}`;
                urlListUser = typeDoc !== '' ? `${urlListUser}&type=${typeDoc}` : urlListUser;
              } else {

                urlListUser =
                  typePage !== ''
                    ? `${API_INCOMMING_DOCUMENT}/list-user?authority=true&${serialize(query)}&checkOrg=${checkOrg !== undefined ? checkOrg : false}${roleDirection ? `&roleDirection=${roleDirection}` : ''}`
                    : `${API_INCOMMING_DOCUMENT}/list-user?${serialize(query)}&checkOrg=${checkOrg !== undefined ? checkOrg : false}${roleDirection ? `&roleDirection=${roleDirection}` : ''}`;
                urlListUser = typeDoc !== '' ? `${urlListUser}&type=${typeDoc}` : urlListUser;
              }
            } else {
              // query.filter['organizationUnit.organizationUnitId'] = profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId;
              urlListUser =
                typePage !== ''
                  ? `${API_INCOMMING_DOCUMENT}/list-user?&authority=true&${serialize(query)}&checkOrg=${checkOrg !== undefined ? checkOrg : false}${roleDirection ? `&roleDirection=${roleDirection}` : ''}`
                  : `${API_INCOMMING_DOCUMENT}/list-user?&${serialize(query)}&checkOrg=${checkOrg !== undefined ? checkOrg : false}${roleDirection ? `&roleDirection=${roleDirection}` : ''}`;
              urlListUser = typeDoc !== '' ? `${urlListUser}&type=${typeDoc}&support=true` : `${urlListUser}&support=true`;
            }
          }
          fetchData(urlListUser)
            .then(response => {
              if (response && response.data) {
                if (roleP === 'supporters') {
                  setEmployees(response.data);
                  setCloneEpl(response.data);
                } else {
                  setUserOrg(response.currentEmployee.organizationUnit.organizationUnitId);
                  let newUsers = response.data.map(e => convertDot({ ob: e, newOb: { organizationUnit: e.organizationUnit } }));
                  if (type === 'flow' && processeds && allowedUsers && allowedUsers.length > 0) {
                    let sortAllow = [];
                    processeds.map((item, index) => {
                      allowedUsers.map(allow => {
                        if (allow._id === item) {
                          sortAllow[index] = allow;
                        }
                      });
                    });
                    sortAllow = sortAllow.filter(f => f);
                    newUsers = newUsers.map(item => {
                      sortAllow =
                        sortAllow &&
                        sortAllow.filter(user => user.roleGroupSource === item.roleGroupSource);
                      return sortAllow[sortAllow.length - 1];
                    });
                    if (newUsers.length === 0) {
                      newUsers = [...sortAllow];
                    }
                    newUsers = [...new Set(newUsers)];
                  }
                  setEmployees(newUsers);
                  setCloneEpl(newUsers);
                }
              }
            })
            .catch(e => {
            });
        } else {
          allowedUsers && setEmployees(allowedUsers);
          allowedUsers && setCloneEpl(allowedUsers);
        }
      }
    },
    [open, currentRole, type, allowedUsers],
  );
  useEffect(
    () => {
      let employeesFilter;

      if (search.length > 0) {
        employeesFilter =
          cloneEpl && cloneEpl.filter(item => item && item.name && removeVietnameseTones(item.name.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase())));
      } else {
        employeesFilter = cloneEpl;
      }
      // if (Array.isArray(departments) && departments.length === 0)
      //   setCount(!count)

      if (search.length > 0) {
        departments.forEach(item => {
          employeesFilter.forEach(ele => {
            if (item._id === ele['organizationUnit.organizationUnitId'] || ele && ele.organizationUnit && item && item._id && item._id === ele.organizationUnit.organizationUnitId) {
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
    [search, cloneEpl, departmentsClone],
  );
  useEffect(
    () => {
      if ((allowedDepartmentIds, departments, employees)) {
        setData(mergeDerpartment(data, departments, employees, allowedUsers));
      }
    },
    [allowedDepartmentIds, departments, employees, allowedUsers],
  );

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
  const unique = arr => {
    return Array.from(new Set(arr)); //
  };
  const clearDer = () => { };
  const getData = async (listEmp = []) => {
    try {
      const departmentsRes = await fetchData(
        `${API_ORIGANIZATION}?processType=${props.template && props.template[0] ? props.template[0].type : null}&processId=${props.template && props.template[0] ? props.template[0]._id : null
        }${docIds && docIds[0] ? `&docId=${docIds[0]}` : ''}`,
      );
      // const departmentsRes = await fetchData(`${API_ORIGANIZATION}`);
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
      setDepartmentsClone(flattedDepartment)
    } catch (error) { }
  };
  const handleSearch = e => {
    const search = e.target.value;
    // if (timeout) clearTimeout(timeout);
    // timeout = setTimeout(() => {
    //   setSearch(search);
    // }, 500);
    setSearch(search);
    // const data2 = _.cloneDeep(employees)
    // data2.forEach((item,index) => {
    //   const dataFilter = item && item.users && item.users.filter(item => item.userName.includes(search))
    //   data2[index].users = dataFilter
    // })
    // setDepartments(departFilter)
  };
  // useEffect(() => {
  //   if (firstId && checkFirst && columns && Array.isArray(columns)) {
  //     setTimeout(() => {
  //       handleCheckUser(firstId, 'processing', 0)
  //     }, 1000);
  //   }

  // }, [checkFirst, firstId, columns])
  function mergeDerpartment(data, departments, users = [], allowedEmployees = [], result) {
    console.log(data, "datadatadata")
    let level = -1;
    const newCountObj = {};
    const findOrg = departments.find(i => i.id === userOrg);
    if (findOrg) {
      level = findOrg.level;
    }
    const x = departments.map((i, index) => {
      let disableSetProcess = false;
      // if (roleP !== 'supporters') {
      //   if (type === '' && i.level >= level && !i.slug.includes(userOrg)) {
      //     disableSetProcess = true;
      //   }
      // } else {
      //   disableSetProcess = false
      // }

      const dataIndex = data[index];
      const departmentUsers = (
        users.filter(u => u && u.organizationUnit && u.organizationUnit.organizationUnitId === i.id && !disableSetProcess) || []
      )
        .sort((a, b) => {
          if (roleGroupsOrder && (roleGroupsOrder[b.roleGroupSource] || 0) > (roleGroupsOrder[a.roleGroupSource] || 0)) {
            return -1;
          }
          if (roleGroupsOrder && (roleGroupsOrder[b.roleGroupSource] || 0) < (roleGroupsOrder[a.roleGroupSource] || 0)) {
            return 1;
          }
          return 0;
        })
        .map(u => {
          let dataCheck
          if (!checkFirst && (typeFlow === "startFlow" || typeFlow === "backFlow")) {
            setCheckFirst(1)
            setIsFirstID && setIsFirstID([u._id])
            dataCheck = { view: false, edit: false, delete: false, processing: true };
          }
          else if (typeFlow === "startFlow" || typeFlow === "backFlow")
            dataCheck = { view: false, edit: false, delete: false, processing: false }
          else dataCheck = { view: false, edit: false, delete: false }
          if (dataIndex && dataIndex.users) {
            const findUser = dataIndex.users.find(ui => ui.id === u._id);
            if (findUser) {
              dataCheck = findUser.data;
            }
          }
          return {
            ...u,
            is_user: true,
            // userName: getName(u),
            userNameCopy: u.name,
            userName: u.name,
            open: u.open,
            name: u.id,
            id: u._id,
            expand: u.expand,
            slug: u.slug,
            data: dataCheck,
            disableSetProcess,
          };
        });
      newCountObj[i._id] = departmentUsers.length;
      const slugArr = i.slug.split('/');
      slugArr.pop();
      slugArr.forEach(idOrg => {
        if (isNaN(newCountObj[idOrg])) {
          newCountObj[idOrg] = 0;
          1;
        }
        newCountObj[idOrg] += departmentUsers.length;
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
    setCountObj(newCountObj);
    return x;
  }
  function handleCheckDerpartment(name, valueName, checked) {
    if (valueName === 'view' || valueName === 'support') {
      const slug = data.find(i => i.name === name).slug;
      let flag = 'view';
      if (valueName === 'view') flag = 'support';
      const list = slug.split('/');
      const newAllowedUsers = [...allowedUsers] || [];
      const newData = data.map(
        i =>
          i.slug.includes(slug) || (list.includes(i.name) && checked)
            ? {
              ...i,
              data: { [flag]: i.data[flag], [valueName]: !checked },
              users: i.users.map(it => {
                return {
                  ...it,
                  data: {
                    ...it.data,
                    [valueName]: it[`roleCached.IncommingDocument.${valueName}_department_incharge`],
                    [flag]: it[`roleCached.IncommingDocument.${valueName}_department_incharge`] === true ? false : it.data[flag],
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
                  data: valueName === 'processing' ? { ...it.data, [valueName]: false } : it.data,
                };
              }),
            },
      );
      let roleSupport = [];
      setData(newData);
      const viewedDepartmentIds = newData.filter(item => item.data.view).map(item => item.name);
      if (columnSettings && columnSettings.length) {
        const result = { ...resultP };
        columnSettings.forEach(c => {
          result[c.name] = newData.filter(item => item.data[c.name]) && newData.filter(item => item.data[c.name]).map(item => item.name);
          // chi dao gap van de
          result[`${c.name}Users`] = (result[`${c.name}Users`] && [...result[`${c.name}Users`]]) || [...result[`${c.name}`]];
          newData.forEach(rowData => {
            rowData.users &&
              rowData.users.forEach(u => {
                if (c.name !== 'processing' && rowData.data[c.name]) {
                  if (c.name === 'command') {
                    if (result[`${c.name}Users`].indexOf(u.id) === -1) {
                      result[`${c.name}Users`].push(u.id);
                    }
                    getCommander && getCommander(u.roleGroupSource);
                  }
                  if (c.name === 'support') {
                    if (roleSupport.indexOf(u.roleGroupSource) === -1) {
                      roleSupport.push(u.roleGroupSource);
                    }
                    if (roleSupport.length > 0) {
                      let totalRole = roleSupport.reduce((str, i, index) => (str += index === roleSupport.length - 1 ? i : i + ','), '');
                      getSupportRole && getSupportRole(totalRole);
                    }
                  }
                }
                if (c.name === 'processing' && rowData.data[c.name]) {
                  if (u['roleCached.IncommingDocument.processing_department_incharge'] == true) {
                    if (result[`${c.name}Users`].indexOf(u.id) === -1) {
                      result[`${c.name}Users`].push(u.id);
                    }
                    getRole && getRole(u.roleGroupSource);
                  }
                }
              });
          });
          if (onChangeColumnCheck) {
            onChangeColumnCheck(result, departments);
          }
        });
      }
      if (onChangeAddRoles) onChangeAddRoles(newData, departments);
      if (onChange) onChange(viewedDepartmentIds, newAllowedUsers);
      return;
    }
    const slug = data.find(i => i.name === name).slug;
    const list = slug.split('/');
    const newAllowedUsers = [...allowedUsers] || [];
    const newData = data.map(
      i =>
        i.slug === slug || (list.includes(i.name) && checked)
          ? {
            ...i,
            data: { [valueName]: !checked },
            users: i.users.map(it => {
              if (rootTab === "receive" && processType === "any") {
                // " tiếp nhận tùy chọn nè"
                return {
                  ...it,
                  data: {
                    ...it.data
                  },
                };
              }
              else
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
            data: i.data,
            users: i.users.map(it => {
              return {
                ...it,
                // data: valueName === 'processing' && !(rootTab === "receive" && processType === "any") ? { ...it.data, [valueName]: false } : it.data,
                data: valueName === 'processing' ? { ...it.data, [valueName]: false } : it.data,

              };
            }),
          },
    );
    let roleSupport = [];
    setData(newData);
    const viewedDepartmentIds = newData.filter(item => item.data.view).map(item => item.name);
    if (columnSettings && columnSettings.length) {
      const result = { ...resultP };
      columnSettings.forEach(c => {
        result[c.name] = newData.filter(item => item.data[c.name]) && newData.filter(item => item.data[c.name]).map(item => item.name);
        // chi dao gap van de
        result[`${c.name}Users`] = (result[`${c.name}Users`] && [...result[`${c.name}Users`]]) || [...result[`${c.name}`]];
        newData.forEach(rowData => {
          rowData.users &&
            rowData.users.forEach(u => {
              if (c.name !== 'processing' && rowData.data[c.name]) {
                if (c.name === 'command') {
                  if (result[`${c.name}Users`].indexOf(u.id) === -1) {
                    result[`${c.name}Users`].push(u.id);
                  }
                  getCommander && getCommander(u.roleGroupSource);
                }
                if (c.name === 'support') {
                  if (roleSupport.indexOf(u.roleGroupSource) === -1) {
                    roleSupport.push(u.roleGroupSource);
                  }
                  if (roleSupport.length > 0) {
                    let totalRole = roleSupport.reduce((str, i, index) => (str += index === roleSupport.length - 1 ? i : i + ','), '');
                    getSupportRole && getSupportRole(totalRole);
                  }
                }
              }
              if (c.name === 'processing' && rowData.data[c.name]) {
                if (u['roleCached.IncommingDocument.processing_department_incharge'] == true) {
                  if (result[`${c.name}Users`].indexOf(u.id) === -1) {
                    result[`${c.name}Users`].push(u.id);
                  }
                  getRole && getRole(u.roleGroupSource);
                }
              }
            });
        });
        if (onChangeColumnCheck) {
          onChangeColumnCheck(result, departments);
        }
      });
    }
    if (onChangeAddRoles) onChangeAddRoles(newData, departments);
    if (onChange) onChange(viewedDepartmentIds, newAllowedUsers);
  }

  const getName = (item) => {
    const role = item && (item.roleGroupSourceAuthorized || item.roleGroupSource) || ""
    const roleAcc = listRoleLevelAndName.find(element => element.code === role);
    if (roleAcc && roleAcc.order <= MIN_ORDER) {
      let name = ""
      if (item.nameAuthorized) {
        // item.roleGroupSourceAuthorized || item.roleGroupSource
        name = `${item.nameAuthorized} - ${roleAcc && roleAcc.name || " "} (Người được ${item.userNameCopy} ủy quyền)`
      } else {
        name = `${item.userNameCopy} - ${roleAcc && roleAcc.name || " "}`
      }
      return name || item.nameAuthorized || item.userNameCopy
    }
    else {
      let name = ""
      if (item.nameAuthorized) {
        // item.roleGroupSourceAuthorized || item.roleGroupSource
        name = `${item.nameAuthorized} - (Người được ${item.userNameCopy} ủy quyền)`
      } else {
        name = `${item.userNameCopy}`
      }
      return name || item.nameAuthorized || item.userNameCopy
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
    let listRole = []
    for (const property in listRoleLevel) {
      listRole.push({
        name: property,
        value: listRoleLevel[property]
      })
    }
    listRole = _.sortBy(listRole, ["value"])
    let listUserany = []
    listRole.map((el) => {
      let lisst = []
      for (let i = 0; i < listUser.length; i++) {
        let role = listUser[i]["roleGroupSourceAuthorized"] ? listUser[i]["roleGroupSourceAuthorized"] : listUser[i]["roleGroupSource"]
        if ((role === el.name)) {
          lisst.push(listUser[i])
        }
      }
      listUserany.push(lisst)
    })
    for (let i = 0; i < listUserany.length; i++) {
      for (let j = 0; j < listUserany[i].length - 1; j++) {
        for (let k = j + 1; k < listUserany[i].length; k++) {
          if (getNameOfUserName(listUserany[i][j]).localeCompare(getNameOfUserName(listUserany[i][k])) == 1) {
            let temp = listUserany[i][j];
            listUserany[i][j] = listUserany[i][k]
            listUserany[i][k] = temp
          }
        }
      }
    }
    let data = []
    for (let i = 0; i < listUserany.length; i++) {
      data = [...data, ...listUserany[i]]
    }
    listUser = data

    listUser.map((el) => el.userName = getName(el))
    console.log(listUser, 'listUser')
    return listUser || []
  }
  function handleCheckUser(userId, columnName, rowIndex) {
    setIsFirstID && setIsFirstID()
    if (!userId) return;
    if (columnSettings && columnSettings.length) {
      const newData = [...data];
      for (let i = 0; i < newData.length; i += 1) {
        newData[rowIndex].data[columnName] = false;
        if (rootTab === "receive" && processType === "any") {
          if (columnName === 'processing' || columnName === 'command') {
            // không bỏ tích khi chuyển tùy chọn tiếp nhận
            // newData[i].data[columnName] = false;
            // newData[i].users.filter(u => u.id !== userId).map(item => {
            //   item.data[columnName] = false;
            // });
          }
        }
        else {
          if (columnName === 'processing' || columnName === 'command') {
            newData[i].data[columnName] = false;
            newData[i].users.filter(u => u.id !== userId).map(item => {
              item.data[columnName] = false;
            });
          }
        }

      }

      let user = newData[rowIndex].users.find(u => u.id === userId) || {};
      if (user.data) {
        Object.keys(user.data).map(item => {
          if (item != columnName) {
            user.data[item] = false;
          }
        });
      }
      user.data[columnName] = !user.data[columnName];

      const result = { ...resultP };
      let roleSupport = [];
      const newUser =[]
      columnSettings.forEach(c => {
        result[c.name] = newData.filter(item => item.data[c.name]).map(item => item.name);
        // let tempData =result[`${c.name}Users`]
        result[`${c.name}Users`] = [];
        newData.forEach(rowData => {
          rowData.users &&
            rowData.users.forEach(u => {
              if (c.name !== 'processing' && u.data[c.name]) {
                result[`${c.name}Users`].push(u.id);
                if (c.name === 'command') {
                  getCommander && getCommander(u.roleGroupSource);
                }
                if (c.name === 'support') {
                  if (roleSupport.indexOf(u.roleGroupSource) === -1) {
                    roleSupport.push(u.roleGroupSource);
                  }
                  if (roleSupport.length > 0) {
                    let totalRole = roleSupport.reduce((str, i, index) => (str += index === roleSupport.length - 1 ? i : i + ','), '');
                    getSupportRole && getSupportRole(totalRole);
                  }
                }
              }
              if (c.name === 'processing' && u.data[c.name]) {
                if (rootTab === "receive" && processType === "any") {
                  // let dataUser = result[`${c.name}Users`] || []
                  // dataUser.push(u.id)
                  // dataUser = unique(dataUser)
                  // result[`${c.name}Users`] = dataUser

                  // result[`${c.name}Users`] = [u.id]
                  // getRole && getRole(u.roleGroupSource);


                  newUser.push(u.id)
                  // result[`${c.name}`] = [u.id]
                  getRole && getRole(u.roleGroupSource);
                } else {
                  result[`${c.name}Users`] = [u.id];
                  getRole && getRole(u.roleGroupSource);
                }

              }
            });
        });
        if (rootTab === "receive" && processType === "any") {
          // khi mà chuyển bất kì chọn đích danh thì dùng cái này
          result[`${c.name}User`] = newUser
        }
        if (onChangeColumnCheck) {
          onChangeColumnCheck(result, departments);
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
  const handleCheckUserAll = columnName => {
    console.log(columnName, 'columnName', columnSettings)
    console.log(data, 'data')
    console.log(resultP, 'daresultPta')
    const {commandUsers =[], processingUsers =[], supportUsers =[], viewUsers =[]} = resultP
    const columnDefault =[
      {name: "commandUsers", idx: 0},
      {name: "processingUsers", idx: 1},
      {name: "supportUsers", idx: 2},
      {name: "viewUsers", idx: 3}
    ]
    if (columnSettings && columnSettings.length) {
      const newData = [...data];
      let listUser = [];
      if (columnName === 'view') setCheckAll({ view: !checkAll.view, support: false });
      else setCheckAll({ view: false, support: !checkAll.support });
      newData.map(el => {
        if (el.users && Array.isArray(el.users) && el.users.length > 0)
          el.users.map(user => {
            listUser.push(user);
          });
      });
      if (listUser && Array.isArray(listUser) && listUser.length > 0) {
        listUser.map(user => {
          Object.keys(user.data).map(item => {
            if (item != columnName && checkAll[columnName] === false) {
              // user.data[item] = false;
              // if(commandUsers.includes(user._id)){
              // }
              // else if(processingUsers.includes(user._id)){
              // }else {
              //   user.data[item] = false;
              // }

              if(columnName === "support" ){
                if(commandUsers.includes(user._id) || processingUsers.includes(user._id)){
                }else {
                  user.data[item] = false;
                }
              }else if(columnName === "view"){
                if(commandUsers.includes(user._id) || processingUsers.includes(user._id)|| supportUsers.includes(user._id)){
                }else {
                  user.data[item] = false;;
                }
              }else {
                user.data[item] = false;
              }
            }
          });
          if (checkAll[columnName] === true) {
            // user.data[columnName] = false;


            if(columnName === "support" ){
              if(commandUsers.includes(user._id) || processingUsers.includes(user._id)){
              }else {
                 user.data[columnName] = false;
              }
            }else if(columnName === "view"){
              if(commandUsers.includes(user._id) || processingUsers.includes(user._id)|| supportUsers.includes(user._id)){
              }else {
                user.data[columnName] = false;
              }
            }else {
              user.data[columnName] = false;
            }


          }
          else {
            // user.data[columnName] = true;
            if(columnName === "support" ){
              if(commandUsers.includes(user._id) || processingUsers.includes(user._id)){
              }else {
                user.data[columnName] = true;
              }
            }else if(columnName === "view"){
              if(commandUsers.includes(user._id) || processingUsers.includes(user._id)|| supportUsers.includes(user._id)){
              }else {
                user.data[columnName] = true;
              }
            }else {
              user.data[columnName] = true;
            }
          }
        });
      }
      const result = { ...resultP };
      let roleSupport = [];
      columnSettings.forEach(c => {
        result[c.name] = newData.filter(item => item.data[c.name]).map(item => item.name);
        result[`${c.name}Users`] = [];
        newData.forEach(rowData => {
          rowData.users &&
            rowData.users.forEach(u => {
              if (c.name !== 'processing' && u.data[c.name]) {
                if(columnName === "support" ){
                  if(commandUsers.includes(u.id)){
                    result["commandUsers"].push(u.id);
                  }
                  else if(processingUsers.includes(u.id)){
                    result["processingUsers"].push(u.id);
                  }else {
                    result[`${c.name}Users`].push(u.id);
                  }
                }else if(columnName === "view"){
                  if((processingUsers.includes(u.id) ||  commandUsers.includes(u.id) || commandUsers.includes(u.id))){
                    console.log(u.id, "u.id", columnName)
                  }else {
                    result[`${c.name}Users`].push(u.id);
                  }
                }else {
                  result[`${c.name}Users`].push(u.id);
                }
                // if(`${c.name}Users`)
                if (c.name === 'command') {
                  getCommander && getCommander(u.roleGroupSource);
                }
                if (c.name === 'support') {
                  if (roleSupport.indexOf(u.roleGroupSource) === -1) {
                    roleSupport.push(u.roleGroupSource);
                  }
                  if (roleSupport.length > 0) {
                    let totalRole = roleSupport.reduce((str, i, index) => (str += index === roleSupport.length - 1 ? i : i + ','), '');
                    getSupportRole && getSupportRole(totalRole);
                  }
                }
              }
              if (c.name === 'processing' && u.data[c.name]) {
                if (rootTab === "receive" && processType === "any") {
                  // result[`${c.name}Users`] = [u.id];
                  getRole && getRole(u.roleGroupSource);
                } else {
                  result[`${c.name}Users`] = [u.id];
                  getRole && getRole(u.roleGroupSource);
                }

              }
            });
        });
        console.log(result, 'result')
        if (onChangeColumnCheck) {
          onChangeColumnCheck(result, departments);
        }
      });
      return;
    }
  };

  const handleCheckUserAllReceive = columnName => {
    if (columnSettings && columnSettings.length) {
      const newData = [...data];
      let listUser = [];
      if (columnName === 'processing') setCheckAll({ processing: !checkAll.processing });
      newData.map(el => {
        if (el.users && Array.isArray(el.users) && el.users.length > 0)
          el.users.map(user => {
            listUser.push(user);
          });
      });
      let derpartment = []
      let derpartmentCurrent = Array.isArray(data) && data.length > 0 && data[0].slug


      const result = { ...resultP };
      let user = []
      columnSettings.forEach(c => {
        result[c.name] = newData.filter(item => item.data[c.name]).map(item => item.name);
        result[`${c.name}Users`] = [];
        data.map((el) => {
          if (checkAll[columnName] === true && el.slug.split('/').length === 1) derpartmentCurrent = el.slug
          if (checkAll[columnName] === true && el.slug.split('/').length === 2) el.data[c.name] = false
          else if (checkAll[columnName] === false && el.slug.split('/').length === 2) {
            el.data[c.name] = true
            derpartment.push(el.id)
          }
          else el.data[c.name] = false
        })
        if (listUser && Array.isArray(listUser) && listUser.length > 0) {
          listUser.map(user => {
            // if (checkAll[columnName] === true) user.data[columnName] = false;
            // else user.data[columnName] = true;
            if (checkAll[columnName] === true && user["organizationUnit.organizationUnitId"] === derpartmentCurrent) user.data[columnName] = false
            else if (checkAll[columnName] === false && user["organizationUnit.organizationUnitId"] === derpartmentCurrent) user.data[columnName] = true
            else user.data[c.name] = false
          });
        }
        newData.forEach(rowData => {
          rowData.users &&
            rowData.users.forEach(u => {
              if (c.name === 'processing' && u.data[c.name] && derpartmentCurrent === u['organizationUnit.organizationUnitId']) {
                // result[`${c.name}Users`] = [u._id];
                user.push(u._id)
                getRole && getRole(u.roleGroupSource);
              }
            });
        });
        result[`${c.name}Users`] = user


        result[`${c.name}`] = derpartment
        if (onChangeColumnCheck) {
          onChangeColumnCheck(result, departments);
        }
      });
      return;
    }
  };
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
        // value={search}
        />
      </div>
      <div style={{ padding: '0 10px', height: 'calc(100vh - 370px)', overflow: 'scroll' }}>
        <Grid container style={{ justifyContent: 'space-between', marginBottom: 5, paddingRight: 10 }}>
          <Grid item xs={6}>
            Tên đơn vị, cá nhân
          </Grid>

          {columns.map(i => (
            <Grid item style={{ textAlign: 'center', maxWidth: i.title === "Xử lý chính" && rootTab === "receive" && processType === "any" ? '150px' : "90px", width: i.title === "Xử lý chính" && rootTab === "receive" && processType === "any" ? '150px' : "90px" }}>
              {i.title === "Xử lý chính" && rootTab === "receive" && processType === "any" ? "Chọn đơn vị/cá nhân" : i.title}
            </Grid>
          ))}
        </Grid>

        <div style={{ height: 'calc(100vh - 405px)', overflowY: 'scroll', paddingBottom: 20 }}>
          {departments.map(
            (i, rowIndex) =>
              i.open && ((countObj[i._id] > 0) && (i.child || (data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length > 0)) || (processType === 'any' && allowSendToUnit && organizationUnit !== i._id)) ? (
                <>

                  <Grid
                    className='customHover'
                    container
                    style={{ justifyContent: 'space-between', borderBottom: '1px solid #e2e2e2', display: 'flex', alignItems: 'center' }}
                  >
                    {((rowIndex === 0 && roleP === 'processors' && Array.isArray(data) && data.length ) ||
                      (rowIndex === 0 && roleP === 'commander' && Array.isArray(data) && data.length )) && Array.isArray(columns) && columns.length == 4 && (
                        <>
                          <Grid item xs={6} md={6} xl={6} style={props.firstColumnStyle || styles.codeCol}>
                          </Grid>
                          <Grid container xs={6} md={6} xl={6} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Grid item xs={6} md={6} xl={6} />
                            <Grid item style={{ display: 'flex', justifyContent: 'center', maxWidth: '100px', width: '100px' }}>
                              {columns && columns[0] && columns[0].name === 'processing' && columns &&  Array.isArray(columns) && columns.length === 4 ? null : (
                                <Checkbox
                                  onChange={() => {
                                    handleCheckUserAll('support');
                                  }}
                                  checked={checkAll.support || false}
                                />
                              )}
                            </Grid>

                            <Grid item style={{ display: 'flex', justifyContent: 'center', maxWidth: '100px', width: '100px' }}>
                              <Checkbox
                                onChange={() => {
                                  handleCheckUserAll('view');
                                }}
                                checked={checkAll.view || false}
                              />
                            </Grid>
                          </Grid>
                        </>

                      )}

                    
                    {((rowIndex === 0 && roleP === 'processors' && Array.isArray(data) && data.length ) ||
                      (rowIndex === 0 && roleP === 'commander' && Array.isArray(data) && data.length )) && Array.isArray(columns) && columns.length == 3 && (
                        <>
                          <Grid item xs={4} md={4} xl={4} style={props.firstColumnStyle || styles.codeCol}>
                          </Grid>
                          <Grid container xs={8} md={8} xl={8} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Grid item xs={6} md={6} xl={6} />
                            <Grid item style={{ display: 'flex', justifyContent: 'center', maxWidth: '100px', width: '100px' }}>
                              {columns && columns[0] && columns[0].name === 'processing' && columns &&  Array.isArray(columns) && columns.length === 4 ? null : (
                                <Checkbox
                                  onChange={() => {
                                    handleCheckUserAll('support');
                                  }}
                                  checked={checkAll.support || false}
                                />
                              )}
                            </Grid>

                            <Grid item style={{ display: 'flex', justifyContent: 'center', maxWidth: '100px', width: '100px' }}>
                              <Checkbox
                                onChange={() => {
                                  handleCheckUserAll('view');
                                }}
                                checked={checkAll.view || false}
                              />
                            </Grid>
                          </Grid>
                        </>

                      )}
                    {((rowIndex === 0 && roleP === 'processors' && Array.isArray(data) && data.length ) ||
                      (rowIndex === 0 && roleP === 'supporters' && Array.isArray(data) && data.length )) && Array.isArray(columns) && columns.length == 2 && (
                        <>
                          <Grid item xs={4} md={4} xl={4} style={props.firstColumnStyle || styles.codeCol}>
                          </Grid>
                          <Grid container xs={8} md={8} xl={8} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Grid item xs={4} md={4} xl={4} />
                            <Grid item style={{ display: 'flex', justifyContent: 'center', maxWidth: '100px', width: '100px', marginRight: 80 }}>
                              {columns && columns[0] && columns[0].name === 'processing' && columns &&  Array.isArray(columns) && columns.length === 4 ? null : (
                                <Checkbox
                                  onChange={() => {
                                    handleCheckUserAll('support');
                                  }}
                                  checked={checkAll.support || false}
                                />
                              )}
                            </Grid>

                            <Grid item style={{ display: 'flex', justifyContent: 'center', maxWidth: '100px', width: '100px' }}>
                              <Checkbox
                                onChange={() => {
                                  handleCheckUserAll('view');
                                }}
                                checked={checkAll.view || false}
                              />
                            </Grid>
                          </Grid>
                        </>

                      )}
                    {(rowIndex === 0 && roleP === 'receive' && processType === "any" && Array.isArray(data) && data.length ) && Array.isArray(columns) && columns.length == 1 && (
                      <>
                        <Grid item xs={4} md={4} xl={4} style={props.firstColumnStyle || styles.codeCol}>
                        </Grid>
                        <Grid container xs={8} md={8} xl={8} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                          <Grid item xs={4} md={4} xl={4} />


                          <Grid item style={{ display: 'flex', justifyContent: 'center', maxWidth: '100px', width: '100px' }}>
                            <Checkbox
                              onChange={() => {
                                handleCheckUserAllReceive('processing');
                              }}
                              checked={checkAll.processing || false}
                            />
                          </Grid>
                        </Grid>
                      </>

                    )}
                    <Grid item xs={6} md={6} xl={6} style={props.firstColumnStyle || styles.codeCol} >
                      <p
                        style={{ padding: 5, paddingLeft: i.level ? i.level * 10 : 0, fontWeight: i.child ? 'bold' : false, margin: 0 }}
                        onClick={e => {
                          e.stopPropagation();
                          expandRow(i.slug, i.name, i.expand);
                        }}
                      >
                        <AccountBalance style={{ paddingRight: 10 }} />
                        {i.title}
                        {i.child || (data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length > 0) ? (
                          i.expand ? (
                            <>
                              <ExpandLess />
                            </>
                          ) : (
                            <ExpandMore />
                          )
                        ) : null}
                      </p>
                    </Grid>

                    {columns.map(it => (
                      <Grid item style={{ display: 'flex', justifyContent: 'center', maxWidth: '100px', width: '100px' }} >

                        {(processType === 'any' && allowSendToUnit && organizationUnit !== i._id && it.name !== "command") || (processType !== 'any' && role.processing_free_role_to_set && it.allowSelectDepartment && data[rowIndex] && data[rowIndex].allowedSelectDepartment) ? (
                          <CheckDerpartment
                            isView={props.isView ? props.isView : null}
                            handleCheckDerpartment={handleCheckDerpartment}
                            checked={data[rowIndex] && data[rowIndex].data && data[rowIndex].data[it.name] ? true : false}
                            column={it.name}
                            roleP={roleP}
                            processType={processType}
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
                          <Grid item xs={6} style={props.firstColumnStyle || styles.codeCol}>
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
                            <Grid item style={{ display: 'flex', justifyContent: 'center', maxWidth: '100px', width: '100px' }}>
                              {roleP === 'supporters' ? (
                                <Checkbox
                                  onChange={() => {
                                    handleCheckUser(user.id, it.name, rowIndex);
                                  }}
                                  checked={(user && user.data && user.data[it.name]) || false}
                                />
                              ) : (
                                <>
                                  {!user[`roleCached.IncommingDocument.${it.name}_view`] ||
                                    it.name === 'commander' ||
                                    (it.name === 'processing' && user.disableSetProcess) ? null : (
                                    <>
                                      <Checkbox
                                        onChange={() => {
                                          handleCheckUser(user.id, it.name, rowIndex);
                                        }}
                                        checked={(user && user.data && user.data[it.name]) || false}
                                      />
                                    </>
                                  )}
                                  {type === '' ||
                                    type === 'flow' ||
                                    (!user[`roleCached.IncommingDocument.${it.name}_view`] || it.name === 'commanders') ||
                                    (it.name === 'processing' && !user.disableSetProcess) ? null : (
                                    <>
                                      <Checkbox
                                        onChange={() => {
                                          handleCheckUser(user.id, it.name, rowIndex);
                                        }}
                                        checked={(user && user.data && user.data[it.name]) || false}
                                      />
                                    </>
                                  )}
                                  {type !== '' &&
                                    type === 'flow' && (
                                      <>
                                        <Checkbox
                                          onChange={() => {
                                            handleCheckUser(user.id, it.name, rowIndex);
                                          }}
                                          checked={(user && user.data && user.data[it.name]) || false}
                                        />
                                      </>
                                    )}
                                  {type !== '' &&
                                    type !== 'flow' && (
                                      <Checkbox
                                        onChange={() => {
                                          handleCheckUser(user.id, it.name, rowIndex);
                                        }}
                                        checked={(user && user.data && user.data[it.name]) || false}
                                      />
                                    )}
                                </>
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

function CheckDerpartment({ handleCheckDerpartment, row, column, checked, isView, roleP, processType }) {
  function check() {
    handleCheckDerpartment(row, column, checked);
  }
  // An hien o day
  return processType === 'flow' || (processType !== 'any' && roleP == 'commander') ? null : (
    <Checkbox disabled={isView} onClick={check} checked={checked} />
  );
}

DepartmentSelect.propTypes = {};

export default DepartmentSelect;

const styles = {
  codeCol: {
    minWidth: '34vw',
  },
};
