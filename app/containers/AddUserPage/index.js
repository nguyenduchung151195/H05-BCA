import { FormControl, FormHelperText, Paper, TextField, Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Autocomplete } from 'components/LifetekUi';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import AsyncSelect from '../../components/AsyncComponent';
import CustomAppBar from 'components/CustomAppBar';
import RoleByFunction from '../../components/RoleByFunction';
import RoleByFunctionPortal from '../../components/RoleByFunctionPortal';
import { API_USERS, API_CHECK_DUPLICATE_DATA, API_CHECK_DUPLICATE_USERNAME, API_ORIGANIZATION } from '../../config/urlConfig';
import { getLabelName, getUserRole } from '../../utils/common';
import DepartmentSelect from 'containers/AddRolesGroupPage/DetailDepartment';
import { changeSnackbar } from '../Dashboard/actions';
import { addUserAction, editUserAct, getDepartmentAct, getModuleAct, getUserAct, resetNoti, merge, getModulePortalAct } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectAddUserPage from './selectors';
import styles from './styles';
import { injectIntl } from 'react-intl';
import { CUSTOMER_TYPE_CODE } from '../../utils/constants';
import { clientId } from '../../variable';
import { fetchData } from '../../helper';
import _ from 'lodash';
import './style.scss';
import CustomDatePicker from '../../components/CustomDatePicker';
import { flatChild } from 'helper';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { getCertinfo } from 'utils/vgca';
import { updateInfo } from '../../utils/api/users';
import { getTokenInfo } from '../../utils/api/oauth';
import messages from './messages';
import { isPort } from 'variable'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
const currentViewConfig = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'Employee');
const rankConfig = currentViewConfig && currentViewConfig.listDisplay.type.fields.type.columns.find(i => (i.name = 'cap_bac'));

/* eslint-disable react/prefer-stateless-function */
export class AddUserPage extends React.PureComponent {
  state = {
    oldUsername: '',
    expanded: 'panel1',
    avatarURL: '',
    avatar: '',
    value: 0,
    code: '',
    cap_bac: '',
    name: '',
    gender: 0,
    email: '',
    mobileNumber: '',
    timeToJoin: '',
    dob: '',
    address: '',
    IDcard: '',
    positions: '',
    organizationUnit: '',
    note: '',
    // roles: '',
    username: '',
    rePassword: '',
    password: '',
    listOrganizationUnit: [],
    active: false,
    errorName: false,
    errorCode: false,
    errorEmail: false,
    errorUsername: false,
    errorNotMatch: false,
    errorPassword: false,
    errorOrganizationUnit: false,
    releaseError: false,
    canProcessAny: false,
    canProcessAnyInDepartment: false,
    anonymous: false,
    btnSave: false,
    user: null,
    type: [],
    messages: {
      errorCode: '',
      errorName: '',
      errorPassword: '',
      errorNotMatch: '',
      errorEmail: '',
      errorOrganizationUnit: '',
      errorUsername: '',
      releaseDepartmentError: '',
    },
    fieldAdded: [],
    allFunctionForAdd: [],
    allFunctionForAddPortal: [],
    codeRoleGroupSelect: undefined,
    codeRoleGroupPortalSelect: undefined,
    userExtendViewConfig: null,
    // type: 1,
    roleGroupSelectId: null,
    roleGroupPortalSelectId: null,
    resetChild: false,
    userTypes: [],
    names: {
      errorCode: 'Mã Cán bộ',
      errorName: 'Tên Cán bộ',
      errorPassword: 'Mật khẩu',
      errorNotMatch: 'Mật khẩu',
      errorEmail: 'Email',
      errorOrganizationUnit: 'Đơn vị',
      errorUsername: 'Tên đăng nhập',
    },
    signer: false,
    viewConfigSystem: false,
    internal: false,
    inherit: false,
    department: [],
    releaseDepartment: null,
    disableButton: false,
    decentralization: [],
    decentralizationPortal: [],
  };


  getMessages = () => {
    const { messages, names } = this.state;

    let newMessages = {};
    Object.keys(messages).map(item => {
      if (messages[item].length === 0) {
        this.setState({
          [item]: true,
        });
        if (item !== 'errorOrganizationUnit') newMessages[`${item}`] = `${names[`${item}`]} tối thiểu 5 ký tự!`;
        if (item === 'errorUsername') newMessages[`${item}`] = `${names[`${item}`]} tối thiếu 5 và tối đa 50 ký tự!`;
        if (item === 'errorPassword') newMessages[`${item}`] = `${names[`${item}`]} tối thiểu 7 ký tự!`;
        if (item === 'errorOrganizationUnit' || item === 'errorEmail') newMessages[`${item}`] = `${names[`${item}`]} không được để trống!`;
      }
    });
    this.setState(prevState => ({
      ...prevState,
      messages: newMessages,
    }));
  };

  componentWillMount() {
    this.props.onResetNoti();
    this.props.onGetOrganizationUnit();
    this.props.onGetModule();
    if (isPort)
      this.props.onGetModulePortal();
    const { match } = this.props;
    if (match.params.id) {
      this.props.onGetUser(match.params.id);
    } else {
      // const e = {
      //   target: {
      //     value: null
      //   }
      // }
      // this.handleChangeRoleGroupPortal(e)
      // this.setState({codeRoleGroupPortalSelect:})
      console.log("onGetUser")
      this.props.onGetUser("add");
    }
  }

  componentDidMount() {
    const { addUserPage } = this.props;
    // if (!this.props.match.params.id) {
    //   this.getMessages();
    // }
    this.state.listOrganizationUnit = [];
    // if (addUserPage.listOrganizationUnit) {
    addUserPage.listOrganizationUnit.forEach(unit => {
      const newItem = {
        id: unit.id,
        name: unit.name,
      };
      this.state.listOrganizationUnit.push(newItem);
      if (unit.child && unit.child.length > 0) {
        this.listChil(unit.child, 20);
      }
    });
    const { listOrganizationUnit } = this.state;

    if (listOrganizationUnit.length > 0) {
      const id = listOrganizationUnit[0].id;
      this.setState({ organizationUnit: id });
    }
    this.props.onResetNoti();
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.find(item => item.code === 'Employee');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }

    try {
      const customerTypeSource = JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === CUSTOMER_TYPE_CODE);
      if (customerTypeSource && Array.isArray(customerTypeSource.data) && customerTypeSource.data.length) {
        this.setState({ userTypes: customerTypeSource.data });
      }
    } catch (error) { }
    fetchData(`${API_ORIGANIZATION}`).then(departmentsData => {
      const flattedDepartment = flatChild(departmentsData);
      this.setState({ department: flattedDepartment });
    });
  }

  componentDidUpdate() {
    const { addUserPage } = this.props;
    if (
      !this.state.errorName &&
      !this.state.errorCode &&
      !this.state.errorEmail &&
      !this.state.errorUsername &&
      !this.state.errorPassword &&
      !this.state.errorNotMatch &&
      !this.state.errorOrganizationUnit
    ) {
      this.setState({ btnSave: true });
    } else {
      this.setState({ btnSave: false });
    }
    if (addUserPage.successCreate === true) {
      this.props.enqueueSnackbar('Thao tác thành công!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.history.push({
        pathname: `/setting/Employee`,
        state: 0,
      });
      this.props.onResetNoti();
    }
    if (addUserPage.error) {
      if (addUserPage.error && addUserPage.error.message === 'Account already exists') {
        this.setState({ disableButton: false });
        this.props.enqueueSnackbar('Tài khoản đã tồn tại !', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      } else {
        this.setState({ disableButton: false });
        this.props.enqueueSnackbar('Thao tác thất bại!', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }

      this.props.onResetNoti();
    }
  }

  componentWillUnmount() {
    this.setState({ user: null, resetChild: false, disableButton: false });
  }

  componentWillReceiveProps(props) {
    if (props.addUserPage !== this.props.addUserPage) {
      const { addUserPage } = props;
      const user = addUserPage.user || null;
      const { modules = [], role = {}, modulesPortal = [] } = addUserPage;
      const { roles } = role;
      const allFunctionForAdd = getUserRole(roles, modules, clientId);
      // handleChangeRoleGroupPortal
      let allFunctionForAddPortal = []
      if (user && user.roleGroupSourcePortal) {
        const e = {
          target: {
            value: user.roleGroupSourcePortal
          }
        }
        this.handleChangeRoleGroupPortal(e)
        this.setState({ allFunctionForAdd });

      } else {
        allFunctionForAddPortal = getUserRole(roles, modulesPortal, clientId);
        this.setState({ allFunctionForAdd, allFunctionForAddPortal });
      }
      let order = [];
      let nonOrder = [];
      let newData;
      let newDataPortal;
      addUserPage.roleGroups.map((item, index) => {
        if (item.order === null || !item.order) {
          nonOrder.push(item);
        } else {
          order.push(item);
        }
        const orders = _.sortBy(order, ['order']);
        return (newData = orders.concat(nonOrder));
      });
      this.setState({ decentralization: newData });

      let orderPortal = [];
      let nonOrderPortal = [];
      addUserPage.roleGroupsPortal.map((item, index) => {
        if (item.order === null || !item.order) {
          nonOrderPortal.push(item);
        } else {
          orderPortal.push(item);
        }
        const orders = _.sortBy(orderPortal, ['order']);
        return (newDataPortal = orders.concat(nonOrderPortal));
      });
      this.setState({ decentralizationPortal: newDataPortal });


      if (props.addUserPage.listOrganizationUnit !== this.props.addUserPage.listOrganizationUnit) {
        this.state.listOrganizationUnit = [];
        addUserPage.listOrganizationUnit.forEach(unit => {
          const newItem = {
            id: unit._id,
            name: unit.name,
            padding: 0,
          };
          this.state.listOrganizationUnit.push(newItem);
          if (unit.child && unit.child.length > 0) {
            this.listChil(unit.child, 20);
          }
        });
      }
      const dataSource = JSON.parse(localStorage.getItem('crmSource'));
      const dataValSource = dataSource && dataSource.find(item => item.code === 'S300');
      const dataVal = dataValSource ? dataValSource.data : [];
      console.log(user, 'user')
      if (user !== null && props.addUserPage.user !== this.props.addUserPage.user && String(user._id) === String(this.props.match.params.id)) {
        let dataTypes = [];
        user.type.forEach(item => {
          const data = dataVal.find(i => i.value === item);
          if (data) dataTypes.push(data);
        });
        this.state.address = user.address;
        this.state.timeToJoin = moment(user.beginWork).format('YYYY-MM-DD');
        this.state.code = user.code;
        this.state.email = user.email;
        this.state.dob = moment(user.dob).format('YYYY-MM-DD');
        this.state.gender = user.gender === 'male' ? 0 : 1;
        this.state.id = user.id;
        this.state.IDcard = user.identityCardNumber;
        this.state.name = user.name;
        this.state.note = user.note;
        this.state.organizationUnit = user.organizationUnit ? user.organizationUnit.organizationUnitId : '';
        this.state.userDepartment = user.organizationUnit ? user.organizationUnit.organizationUnitId : '';
        this.state.mobileNumber = user.phoneNumber;
        this.state.positions = user.positions;
        this.state.canProcessAny = user.canProcessAny;
        this.state.canProcessAnyInDepartment = user.canProcessAnyInDepartment;
        this.state.active = user.status === 1;
        this.state.user = user;
        this.state.signer = user.signer;
        this.state.anonymous = user.anonymous;
        this.state.internal = user.internal;
        this.state.inherit = user.inherit;
        this.state.viewConfigSystem = user.viewConfigSystem;
        this.state.avatarURL = user.avatar;
        this.state.username = user.username;
        this.state.type = dataTypes;
        this.state.departmentRoles = user.allowedDepartment ? user.allowedDepartment.roles : [];
        this.state.codeRoleGroupSelect = user.roleGroupSource;
        this.state.codeRoleGroupPortalSelect = user.roleGroupSourcePortal;
        this.state.releaseDepartment = user.releaseDepartment;
        this.state.cap_bac = user.cap_bac;
        if (user.others && Object.keys(user.others).length > 0) {
          const { fieldAdded } = this.state;
          const keys = Object.keys(user.others);
          fieldAdded.forEach(item => {
            const index = keys.findIndex(n => n === item.name.replace('others.', ''));
            if (index > -1) {
              item.value = user.others[keys[index]];
            }
          });
          this.state.fieldAdded = fieldAdded;
        }
      }
    }
  }

  listChil = (chil, level) => {
    if (chil.length > 0) {
      chil.forEach(item => {
        const newItem = {
          id: item._id,
          name: item.name,
          padding: `${level}`,
        };
        this.state.listOrganizationUnit.push(newItem);
        if (item.child && item.child.length > 0) {
          this.listChil(item.child, level + 20);
        }
      });
    }
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleChangeCheckbox = e => {
    this.setState({ [e.target.name]: e.target.checked });
  };
  onChangeType = e => {
    this.setState({ type: e });
  };

  handleClickAddNewUser = () => {
    const body = {};

    this.props.onAddNewUser(body);
  };

  handleInputChange = (e, _name, _value) => {
    const name = e && e.target ? e.target.name : _name;
    const value = e && e.target ? e.target.value : _value;
    this.setState({ [name]: value });
  };

  toNumber = (neu, old, limit = 12) => {
    const result = [...neu]
      .filter(c => '0123456789'.includes(c))
      .join('')
      .substring(0, limit);
    return result.length <= limit ? result : old;
  };

  mobileNumber = (neu, old, limit = 10) => {
    const result = [...neu]
      .filter(c => '0123456789'.includes(c))
      .join('')
      .substring(0, limit);
    return result.length <= limit ? result : old;
  };

  handleChangeInput = (e, isDate) => {
    const name = isDate ? 'dob' : 'timeToJoin';
    const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    this.setState({ [name]: value });
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { messages, password, names } = this.state;
    if (e && e.target && e.target.name === 'IDcard') e.target.value = this.toNumber(e.target.value, this.state.IDcard);
    if (e && e.target && e.target.name === 'mobileNumber') e.target.value = this.mobileNumber(e.target.value, this.state.mobileNumber);

    if (
      e &&
      e.target &&
      (e.target.name === 'name' ||
        e.target.name === 'code' ||
        e.target.name === 'email' ||
        e.target.name === 'username' ||
        e.target.name === 'password' ||
        e.target.name === 'rePassword' ||
        e.target.name === 'organizationUnit')
    ) {
      if (e.target.name === 'name') {
        if (e.target.value === '' || e.target.value.length < 5) {
          this.setState({
            errorName: true,
            messages: { ...messages, errorName: `${names.errorName} tối thiếu 5 ký tự!` },
          });
        } else {
          this.setState({
            errorName: false,
            messages: { ...messages, errorName: '' },
          });
        }
      }
      if (e.target.name === 'code') {
        if (e.target.value === '' || e.target.value.length < 5) {
          this.setState({
            errorCode: true,
            messages: { ...messages, errorCode: `${names.errorCode} tối thiếu 5 ký tự!` },
          });
        } else {
          this.setState({
            errorCode: false,
            messages: { ...messages, errorCode: '' },
          });
          this.checkMatchData(e.target.name, e.target.value);
        }
      }
      if (e.target.name === 'email') {
        if (e.target.value === '') {
          this.setState({
            errorEmail: true,
            messages: { ...messages, errorEmail: 'Không được để trống Email!' },
          });
        } else {
          if (re.test(String(e.target.value).toLowerCase())) {
            this.setState({
              errorEmail: false,
              messages: { ...messages, errorEmail: '' },
            });
            this.checkMatchData(e.target.name, e.target.value);
          } else {
            this.setState({
              errorEmail: true,
              messages: { ...messages, errorEmail: 'Email không hợp lệ!' },
            });
          }
        }
      }
      if (e.target.name === 'username') {
        if (e.target.value === '' || e.target.value.length < 5 || e.target.value.length > 50) {
          this.setState({
            errorUsername: true,
            messages: { ...messages, errorUsername: `${names.errorUsername} tối thiếu 5 và tối đa 50 ký tự!` },
          });
        } else {
          this.setState({
            errorUsername: false,
            messages: { ...messages, errorUsername: '' },
          });
          this.checkMatchData(e.target.name, e.target.value);
        }
      }
      if (e.target.name === 'password') {
        if (e.target.value === '' || e.target.value.length < 7) {
          this.setState({
            errorPassword: true,
            messages: { ...messages, errorPassword: `${names.errorPassword} tối thiếu 7 ký tự!` },
          });
        } else {
          this.setState({
            errorPassword: false,
            messages: { ...messages, errorPassword: '' },
          });
        }
      }
      if (e.target.name === 'organizationUnit') {
        if (e.target.value === '') {
          this.setState({
            errorOrganizationUnit: true,
            messages: { ...messages, errorOrganizationUnit: `${names.errorOrganizationUnit} không được để trống!` },
          });
        } else {
          this.setState({
            errorOrganizationUnit: false,
            messages: { ...messages, errorOrganizationUnit: '' },
          });
        }
      }
      if (e.target.name === 'rePassword') {
        if (e.target.value === '') {
          this.setState({
            errorNotMatch: true,
            messages: { ...messages, errorNotMatch: `${names.errorNotMatch} không được để trống!` },
          });
        } else if (password === '') {
          this.setState({
            errorPassword: true,
            messages: { ...messages, errorPassword: `${names.errorPassword} không được để trống!` },
          });
        } else if (!(password === e.target.value)) {
          this.setState({
            errorNotMatch: true,
            messages: { ...messages, errorNotMatch: `${names.errorNotMatch} không khớp` },
          });
        } else {
          this.setState({
            errorNotMatch: false,
            messages: { ...messages, errorNotMatch: '' },
          });
        }
      }
    }
    if (e && e.target) {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  checkMatchData = _.debounce((name, value) => {
    const { messages } = this.state;
    let body = {
      [name]: value,
    };
    if (name === 'code' || name === 'email') {
      fetchData(API_CHECK_DUPLICATE_DATA, 'POST', body).then(data => {
        if (data.status === 0) {
          if (name === 'code') {
            this.setState({
              errorCode: true,
              messages: { ...messages, errorCode: 'Mã Cán bộ bị trùng! Vui lòng nhập mã khác' },
            });
          } else {
            this.setState({
              errorEmail: true,
              messages: { ...messages, errorEmail: 'Email bị trùng! Vui lòng nhập email khác' },
            });
          }
        } else {
          if (name === 'code') {
            this.setState({
              errorCode: false,
              messages: { ...messages, errorCode: '' },
            });
          } else {
            this.setState({
              errorEmail: false,
              messages: { ...messages, errorEmail: '' },
            });
          }
        }
      });
    }
    if (name === 'username') {
      fetchData(API_CHECK_DUPLICATE_USERNAME, 'POST', body).then(data => {
        if (data.status === 0) {
          this.setState({
            errorUsername: true,
            messages: { ...messages, errorUsername: 'Tài khoản bị trùng! Vui lòng nhập tài khoản khác' },
          });
        } else {
          this.setState({
            errorUsername: false,
            messages: { ...messages, errorUsername: '' },
          });
        }
      });
    }
  }, 500);

  onSelectImg = e => {
    const urlAvt = URL.createObjectURL(e.target.files[0]);
    this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] }); // avatar: e.target.files[0]
  };

  handleChangeRole = allFunctionForAdd => {
    this.state.allFunctionForAdd = allFunctionForAdd;
  };

  handleChangeRolePortal = allFunctionForAddPortal => {
    this.state.allFunctionForAddPortal = allFunctionForAddPortal;
  };

  handleChangeRoleGroup = e => {
    const { addUserPage } = this.props;
    const listOrganizationUnit = flatChild(addUserPage.listOrganizationUnit);
    const modules = addUserPage.modules || [];
    const roleGroupSelect = addUserPage.roleGroups.find(roleGroup => roleGroup.code === e.target.value) || {};
    const { roles, applyEmployeeOrgToModuleOrg, departments, other } = roleGroupSelect;
    const allFunctionForAdd = getUserRole(roles, modules, clientId);
    if (other) {
      this.setState({
        anonymous: other.anonymous || false,
        canProcessAny: other.canProcessAny || false,
        canProcessAnyInDepartment: other.canProcessAnyInDepartment || false,
        inherit: other.inherit || false,
        internal: other.internal || false,
        releaseDepartment: other.releaseDepartment || undefined,
        signer: other.signer || false,
      });
    } else {
      this.setState({
        anonymous: false,
        canProcessAny: false,
        canProcessAnyInDepartment: false,
        inherit: false,
        internal: false,
        releaseDepartment: undefined,
        signer: false,
      });
    }
    if (applyEmployeeOrgToModuleOrg) {
      const allowedDepartment = {
        moduleCode: applyEmployeeOrgToModuleOrg,
        roles: [
          {
            code: 'DERPARTMENT',
            column: [
              {
                name: 'view',
                title: 'Xem',
              },
              {
                name: 'edit',
                title: 'Sửa',
              },
              {
                name: 'delete',
                title: 'Xóa',
              },
            ],
            data: listOrganizationUnit.map(item => ({
              data:
                this.state.organizationUnit && item.slug.includes(this.state.organizationUnit)
                  ? { view: true, edit: true, delete: true }
                  : { view: false, edit: false, delete: false },
              expand: false,
              id: item._id,
              name: item._id,
              open: true,
              slug: item.slug,
            })),
            type: 0,
            name: 'Phòng ban',
            row: listOrganizationUnit.map(l => ({
              access: false,
              expand: false,
              id: l._id,
              level: l.level,
              name: l._id,
              open: false,
              parent: l.parent,
              slug: l.slug,
              title: l.name,
            })),
          },
        ],
      };
      this.setState({ allowedDepartment, departmentRoles: allowedDepartment.roles });
    } else {
      const { departments } = roleGroupSelect || {};
      const { roles = [] } = departments || {};
      let role = roles.find(e => e.code === 'DERPARTMENT');
      if (role) {
        role = role.data ? role.data : [];
        const allowedDepartment = {
          moduleCode: true,
          roles: [
            {
              code: 'DERPARTMENT',
              column: [
                {
                  name: 'view',
                  title: 'Xem',
                },
                {
                  name: 'edit',
                  title: 'Sửa',
                },
                {
                  name: 'delete',
                  title: 'Xóa',
                },
              ],
              data: this.state.listOrganizationUnit.map(item => {
                const r = role.find(e => e.id === item._id);
                return {
                  data: r && r.data ? { view: r.data.view, edit: r.data.edit, delete: r.data.delete } : { view: false, edit: false, delete: false },
                  expand: false,
                  id: item._id,
                  name: item._id,
                  open: true,
                  slug: item.slug,
                };
              }),
              type: 0,
              name: 'Phòng ban',
              row: this.state.listOrganizationUnit.map(l => ({
                access: false,
                expand: false,
                id: l._id,
                level: l.level,
                name: l._id,
                open: false,
                parent: l.parent,
                slug: l.slug,
                title: l.name,
              })),
            },
          ],
        };
        this.setState({ allowedDepartment, departmentRoles: allowedDepartment.roles });
      }
    }
    const newDepartments = departments && departments.roles.find(it => it.code === 'DERPARTMENT');
    const allDepartment = newDepartments && newDepartments.data.map(i => ({ ...i.data, id: i.id }));
    this.setState({
      codeRoleGroupSelect: e.target.value,
      allFunctionForAdd,
      roleGroupSelectId: roleGroupSelect._id,
      resetChild: !applyEmployeeOrgToModuleOrg,
      allDepartment,
      applyEmployeeOrgToModuleOrg,
    });
  };
  handleChangeRoleGroupPortal = e => {
    const { addUserPage } = this.props;
    const listOrganizationUnit = flatChild(addUserPage.listOrganizationUnit);
    const modulesPortal = addUserPage.modulesPortal || [];
    const roleGroupPortalSelect = addUserPage.roleGroupsPortal.find(roleGroup => roleGroup.code === e.target.value) || {};
    const { roles, applyEmployeeOrgToModuleOrg, departments, other } = roleGroupPortalSelect;
    const allFunctionForAddPortal = getUserRole(roles, modulesPortal, clientId);
    // if (other) {
    //   this.setState({
    //     anonymous: other.anonymous || false,
    //     canProcessAny: other.canProcessAny || false,
    //     canProcessAnyInDepartment: other.canProcessAnyInDepartment || false,
    //     inherit: other.inherit || false,
    //     internal: other.internal || false,
    //     releaseDepartment: other.releaseDepartment || undefined,
    //     signer: other.signer || false,
    //   });
    // } else {
    //   this.setState({
    //     anonymous: false,
    //     canProcessAny: false,
    //     canProcessAnyInDepartment: false,
    //     inherit: false,
    //     internal: false,
    //     releaseDepartment: undefined,
    //     signer: false,
    //   });
    // }
    if (applyEmployeeOrgToModuleOrg) {
      const allowedDepartmentPortal = {
        moduleCode: applyEmployeeOrgToModuleOrg,
        roles: [
          {
            code: 'DERPARTMENT',
            column: [
              {
                name: 'view',
                title: 'Truy cập',
              },
              // {
              //   name: 'edit',
              //   title: 'Sửa',
              // },
              // {
              //   name: 'delete',
              //   title: 'Xóa',
              // },
            ],
            data: listOrganizationUnit.map(item => ({
              data:
                this.state.organizationUnit && item.slug.includes(this.state.organizationUnit)
                  // ? { view: true, edit: true, delete: true }
                  // : { view: false, edit: false, delete: false },
                  ? { view: true }
                  : { view: false },
              expand: false,
              id: item._id,
              name: item._id,
              open: true,
              slug: item.slug,
            })),
            type: 0,
            name: 'Phòng ban',
            row: listOrganizationUnit.map(l => ({
              access: false,
              expand: false,
              id: l._id,
              level: l.level,
              name: l._id,
              open: false,
              parent: l.parent,
              slug: l.slug,
              title: l.name,
            })),
          },
        ],
      };
      this.setState({ allowedDepartmentPortal, departmentRoles: allowedDepartmentPortal.roles });
    }
    else {
      const { departments } = roleGroupPortalSelect || {};
      const { roles = [] } = departments || {};
      let role = roles.find(e => e.code === 'DERPARTMENT');
      if (role) {
        role = role.data ? role.data : [];
        const allowedDepartmentPortal = {
          moduleCode: true,
          roles: [
            {
              code: 'DERPARTMENT',
              column: [
                {
                  name: 'view',
                  title: 'Truy cập',
                },
                // {
                //   name: 'edit',
                //   title: 'Sửa',
                // },
                // {
                //   name: 'delete',
                //   title: 'Xóa',
                // },
              ],
              data: this.state.listOrganizationUnit.map(item => {
                const r = role.find(e => e.id === item._id);
                return {
                  // data: r && r.data ? { view: r.data.view, edit: r.data.edit, delete: r.data.delete } : { view: false, edit: false, delete: false },
                  data: r && r.data ? { view: r.data.view } : { view: false },
                  expand: false,
                  id: item._id,
                  name: item._id,
                  open: true,
                  slug: item.slug,
                };
              }),
              type: 0,
              name: 'Phòng ban',
              row: this.state.listOrganizationUnit.map(l => ({
                access: false,
                expand: false,
                id: l._id,
                level: l.level,
                name: l._id,
                open: false,
                parent: l.parent,
                slug: l.slug,
                title: l.name,
              })),
            },
          ],
        };
        this.setState({ allowedDepartmentPortal, departmentRoles: allowedDepartmentPortal.roles });
      }
    }
    const newDepartments = departments && departments.roles.find(it => it.code === 'DERPARTMENT');
    const allDepartment = newDepartments && newDepartments.data.map(i => ({ ...i.data, id: i.id }));
    this.setState({
      codeRoleGroupPortalSelect: e.target.value,
      allFunctionForAddPortal,
      roleGroupPortalSelectId: roleGroupPortalSelect._id,
      resetChild: !applyEmployeeOrgToModuleOrg,
      allDepartment,
      applyEmployeeOrgToModuleOrg,
    });
  };
  handleChangeRoles = departments => {
    this.setState({ allDepartment: departments });
    const { allFunctionForAdd, applyEmployeeOrgToModuleOrg, allowedDepartment } = this.state;
    const roles = [];
    if (allowedDepartment)
      allFunctionForAdd.map(row => {
        const GET = row.methods.find(item => item.name === 'GET').allow;
        const PUT = row.methods.find(item => item.name === 'PUT').allow;
        const DELETE = row.methods.find(item => item.name === 'DELETE').allow;
        const role = !applyEmployeeOrgToModuleOrg
          ? allowedDepartment.roles.map(it => ({
            ...it,
            name: 'Phòng ban',
            data: it.data.map(i => ({
              ...i,
              data: { view: GET ? i.data.view : false, edit: PUT ? i.data.edit : false, delete: DELETE ? i.data.delete : false },
            })),
          }))
          : allowedDepartment.roles.map(it => ({
            ...it,
            name: 'Phòng ban',
            data: it.data.map(i => ({ ...i, data: { view: false, edit: false, delete: false } })),
          }));
        roles.push({ moduleCode: row.codeModleFunction, roles: role });
      });
    this.setState({ roles });
  };
  handleChangeAllowedDepart = (departments, row) => {
    const roles = [...departments];
    const moduleCode = 'applyEmployeeOrgToModuleOrg';
    const allowedDepartment = {
      moduleCode,
      roles: [
        {
          code: 'DERPARTMENT',
          column: [
            {
              name: 'view',
              title: 'Xem',
            },
            {
              name: 'edit',
              title: 'Sửa',
            },
            {
              name: 'delete',
              title: 'Xóa',
            },
          ],
          data: roles.map(item => ({ data: item.data, expand: item.expand, id: item.id, name: item.name, open: item.open, slug: item.slug })),
          type: 0,
          name: 'Phòng ban',
          row,
        },
      ],
    };
    this.setState({ allowedDepartment });
  };
  componentWillUnmount() {
    this.setState({ allowedDepartment: [] });
    this.props.mergeData({ role: {} });
  }

  handleChangeType = name => e => {
    this.setState({ [name]: e.target.value });
  };

  render() {
    const { classes, addUserPage, intl } = this.props;
    const { expanded, value, userTypes, signer, viewConfigSystem } = this.state;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    const dataSource = JSON.parse(localStorage.getItem('crmSource'));
    const dataValSource = dataSource && dataSource.find(item => item.code === 'S300');
    const dataVal = dataValSource ? dataValSource.data : [];

    return (
      <div className={classes.root}>
        <CustomAppBar
          title={
            addStock === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới người dùng' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật người dùng' })}`
          }
          onGoBack={this.goBack}
          disableSave={this.state.disableButton}
          onSubmit={addStock === 'add' ? this.onSubmit : this.onEditBtn}
        />
        {/* <Helmet>
          {this.state.user === null ? <title>Thêm mới cán bộ</title> : <title>Sửa cán bộ</title>}
          <meta name="description" content="Description of AddUserPage" />
        </Helmet> */}
        <Grid container>
          <Grid item md={12}>
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{intl.formatMessage(messages.employeeInfo || { id: 'employeeInfo' })}</Typography>
                {/* <Typography className={classes.secondaryHeading}>{intl.formatMessage(messages.warning || { id: 'warning' })}</Typography> */}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container spacing={8}>
                  <Grid item md={3}>
                    <FormControl className={classes.textField1} error>
                      <CustomInputBase
                        id="code"
                        label={`${intl.formatMessage(messages.employeeCode || { id: 'employeeCode' })}:`}
                        onChange={this.handleChangeInput}
                        type="text"
                        //className={classes.textField}
                        value={this.state.code}
                        name="code"
                        variant="outlined"
                        //margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                        helperText={this.state.messages && this.state.messages.errorCode}
                        error={this.state.errorCode}
                        className={'CustomRequiredLetter'}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3}>
                    <FormControl className={classes.textField} style={{ padding: 0 }} error>
                      <CustomInputBase
                        id="name"
                        label={`${intl.formatMessage(messages.employeeName || { id: 'employeeName' })}:`}
                        value={this.state.name}
                        variant="outlined"
                        name="name"
                        onChange={this.handleChangeInput}
                        type="text"
                        // className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        required
                        helperText={this.state.messages && this.state.messages.errorName}
                        error={this.state.errorName}
                        className={'CustomRequiredLetter'}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3}>
                    <CustomInputBase
                      id="standard-select-currency"
                      select
                      label={`${intl.formatMessage(messages.sex || { id: 'sex' })}:`}
                      name="gender"
                      //className={classes.textField}

                      variant="outlined"
                      value={this.state.gender}
                      onChange={this.handleChangeInput}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      margin="normal"
                    >
                      <MenuItem key="0" value={0}>
                        Nam
                      </MenuItem>
                      <MenuItem key="1" value={1}>
                        Nữ
                      </MenuItem>
                    </CustomInputBase>
                  </Grid>
                  <Grid item md={3} style={{ marginTop: -8 }}>
                    <CustomDatePicker
                      id="dob"
                      label={`${getLabelName('dob', 'Employee')}:`}
                      name="dob"
                      variant="outlined"
                      // isUpdate={this.state.code ? true : false}
                      value={this.state.dob}
                      onChange={e => this.handleInputChange(null, 'dob', moment(e).format('YYYY-MM-DD'))}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      disableFuture
                      helperText={null}
                      error={false}
                      className={'CustomRequiredLetter'}
                      isUpdate={false}
                    />
                  </Grid>
                  <Grid item md={3}>
                    <FormControl className={classes.textField1} style={{ padding: 0 }} error>
                      <CustomInputBase
                        id="email"
                        label={`${getLabelName('email', 'Employee')}:`}
                        type="text"
                        variant="outlined"
                        name="email"
                        //className={classes.textField}
                        onChange={this.handleChangeInput}
                        value={this.state.email}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        required
                        className={'CustomRequiredLetter'}
                        helperText={this.state.messages && this.state.messages.errorEmail}
                        error={this.state.errorEmail}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3}>
                    <CustomInputBase
                      id="cmtnd"
                      label={`${intl.formatMessage(messages.idCard || { id: 'idCard' })}:`}
                      // label='Số CMND/CCCD'
                      name="IDcard"
                      variant="outlined"
                      onChange={this.handleChangeInput}
                      // type="number"
                      //className={classes.textField}
                      value={this.state.IDcard}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    //margin="normal"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <CustomInputBase
                      id="phoneNumber"
                      label={`${intl.formatMessage(messages.phone || { id: 'phone' })}:`}
                      value={this.state.mobileNumber}
                      name="mobileNumber"
                      variant="outlined"
                      onChange={this.handleChangeInput}
                      type="text"
                      //className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    //margin="normal"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <CustomInputBase
                      id="address"
                      // label={intl.formatMessage(messages.address || { id: 'address' })}
                      label="Địa chỉ liên hệ:"
                      value={this.state.address}
                      variant="outlined"
                      name="address"
                      onChange={this.handleChangeInput}
                      type="text"
                      //className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    //margin="normal"
                    />
                  </Grid>
                  {/* fix */}
                  <Grid item md={3}>
                    <CustomDatePicker
                      name="timeToJoin"
                      isTimeJoin={true}
                      disablePast={addStock === 'add' ? true : false}
                      label={`${intl.formatMessage(messages.timeJoin || { id: 'timeJoin' })}:`}
                      variant="outlined"
                      value={this.state.timeToJoin}
                      className={'CustomRequiredLetter'}
                      onChange={e => this.handleChangeInput(e, false)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      // margin="normal"
                      error={false}
                      helperText={null}
                    />
                  </Grid>
                  <Grid item md={3} spacing={6}>
                    <CustomInputBase
                      id="standard-select-currency"
                      select
                      label={`${intl.formatMessage(messages.organizationUnit || { id: 'organizationUnit' })}:`}
                      name="organizationUnit"
                      variant="outlined"
                      value={this.state.organizationUnit}
                      onChange={this.handleChangeInput}
                      required
                      // className={classes.textField}
                      className={'CustomRequiredLetter'}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      helperText={this.state.messages && this.state.messages['errorOrganizationUnit']}
                      error={this.state.errorOrganizationUnit}
                    // margin="normal"
                    >
                      {this.state.listOrganizationUnit.map(item => (
                        <MenuItem
                          key={item.id}
                          value={item.id}
                          style={item.padding !== 0 ? { paddingLeft: `${parseInt(item.padding, 10) * 1.5}px` } : {}}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomInputBase>
                  </Grid>
                  <Grid item md={3} spacing={6}>
                    <CustomInputBase
                      id="standard-select-currency"
                      // select
                      name="positions"
                      label={`${intl.formatMessage(messages.positions || { id: 'positions' })}:`}
                      variant="outlined"
                      onChange={this.handleChangeInput}
                      //className={classes.textField}
                      value={this.state.positions}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                    // margin="normal"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <CustomInputBase
                      id="note"
                      label={`${intl.formatMessage(messages.note || { id: 'note' })}:`}
                      variant="outlined"
                      value={this.state.note}
                      onChange={this.handleChangeInput}
                      name="note"
                      type="text"
                      //className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    // margin="normal"
                    />
                  </Grid>
                  <Grid item md={3}>
                    {/* <CustomInputField
                      label={'Cấp bậc'}
                      type={rankConfig.type}
                      name={rankConfig.name}
                      code="Employee"
                      checkedShowForm
                      value={this.state.rank}
                      onChange={this.handleChangeInput}
                    /> */}
                    <CustomInputBase
                      id="cap_bac"
                      label={'Cấp bậc:'}
                      variant="outlined"
                      value={this.state.cap_bac}
                      onChange={this.handleChangeInput}
                      name="cap_bac"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    // margin="normal"
                    />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Thông tin khác</Typography>
              </ExpansionPanelSummary>
              <Grid container spacing={8}>
                <Grid item md={8}>
                  <ExpansionPanelDetails>
                    <Grid item md={12} spacing={16}>
                      {/* {this.state.user === null ? ( */}
                      <Grid item md={6}>
                        <AsyncSelect
                          onChange={value => {
                            this.setState({ userExtendViewConfig: value._id });
                          }}
                          value={this.state.userExtendViewConfig}
                          style={{ width: '100%' }}
                          placeholder="Kế thừa viewConfig từ"
                          API={API_USERS}
                          modelName="Employee"
                          theme={theme => ({
                            ...theme,
                            spacing: {
                              ...theme.spacing,
                              controlHeight: '55px',
                            },
                          })}
                        />
                      </Grid>
                      {this.state.fieldAdded.length > 0
                        ? this.state.fieldAdded.map((item, index) => {
                          if (item.checked) {
                            return (
                              <Grid item md={6} key={item.name}>
                                <TextField
                                  label={`${item.title}:`}
                                  variant="outlined"
                                  type={item.type === 'string' ? 'text' : item.type}
                                  value={item.value}
                                  onChange={event => this.handleChangeAddedField(index, event)}
                                  style={{ width: '100%' }}
                                  margin="normal"
                                />
                              </Grid>
                            );
                          }
                        })
                        : ''}
                    </Grid>
                  </ExpansionPanelDetails>
                </Grid>
                <Grid item md={4} alignItems="center" style={{ display: 'flex' }}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={this.state.viewConfigSystem ? true : false} />}
                      label="Đặt làm hệ thống"
                      labelPlacement="viewConfigSystem"
                      value={this.state.viewConfigSystem}
                      name="viewConfigSystem"
                      onChange={this.handleChangeCheckbox}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Thông tin đăng nhập</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container spacing={8}>
                  <Grid item md={6}>
                    <FormControl className={classes.textField1} style={{ padding: 0 }} error>
                      <TextField
                        id="username"
                        label="Tài khoản: "
                        value={this.state.username}
                        name="username"
                        onChange={this.handleChangeInput}
                        type="text"
                        disabled={this.state.user !== null || addStock !== 'add'}
                        // className={classes.textField}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        required
                        className={'CustomRequiredLetter'}
                        error={this.state.errorUsername}
                      />
                      {this.state.errorUsername && addStock === 'add' ? (
                        <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                          {this.state.messages.errorUsername}
                        </FormHelperText>
                      ) : (
                        ''
                      )}
                    </FormControl>
                  </Grid>
                  {this.state.user === null ? (
                    <Grid item md={6} spacing={6}>
                      <FormControl className={classes.textField1} style={{ paddingBottom: 0 }} error>
                        <TextField
                          id="pass"
                          label="Mật khẩu : "
                          value={this.state.password}
                          name="password"
                          onChange={this.handleChangeInput}
                          variant="outlined"
                          type="password"
                          // className={classes.textField}
                          disabled={this.state.user !== null}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          margin="normal"
                          required
                          className={'CustomRequiredLetter'}
                          error={this.state.errorPassword}
                        />
                        {this.state.errorPassword ? (
                          <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                            {this.state.messages.errorPassword}
                          </FormHelperText>
                        ) : (
                          ''
                        )}
                      </FormControl>
                    </Grid>
                  ) : (
                    ''
                  )}

                  {this.state.user === null ? (
                    <Grid item md={6} spacing={6}>
                      <FormControl className={classes.textField1} style={{ padding: 0 }} error>
                        <TextField
                          id="repasss"
                          label="Nhập lại mật khẩu: "
                          value={this.state.rePassword}
                          name="rePassword"
                          variant="outlined"
                          onChange={this.handleChangeInput}
                          type="password"
                          disabled={this.state.user !== null}
                          // className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          margin="normal"
                          required
                          className={'CustomRequiredLetter'}
                          error={this.state.errorNotMatch}
                        />
                        {this.state.errorNotMatch ? (
                          <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                            {this.state.messages.errorNotMatch}
                          </FormHelperText>
                        ) : (
                          ''
                        )}
                      </FormControl>
                    </Grid>
                  ) : (
                    ''
                  )}
                  {/* <Grid item md={6} spacing={6}>
                    <FormControl className={classes.textField1} style={{ paddingTop: '16px' }}>
                      <CustomInputBase
                        id="date"
                        label="Ngày kết thúc:"
                        type="date"
                        //className={classes.textField}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        
                      />
                    </FormControl>
                  </Grid> */}
                  {/* <Grid item md={6} spacing={6}>
                    <TextField
                      id="standard-multiline-static"
                      label="Lý do không tham gia hoạt động"
                      multiline
                      rows="4"
                      className={classes.textField}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid> */}
                  <Grid>
                    <FormGroup row className={classes.tetxCheckBox}>
                      <FormControlLabel control={<Checkbox />} label="Bắt buộc thay đổi mật khẩu khi lần đầu đăng nhập" labelPlacement="end" />
                      <FormControlLabel
                        control={<Checkbox checked={this.state.active} />}
                        label="Kích hoạt"
                        labelPlacement="end"
                        value={this.state.active}
                        name="active"
                        onChange={this.handleChangeCheckbox}
                      />
                      {/* <FormControlLabel control={<Checkbox />} label="Xóa" labelPlacement="end" />
                      <FormControlLabel control={<Checkbox />} label="Tài khoản cổng thông tin nhân sự" labelPlacement="end" /> */}
                    </FormGroup>
                  </Grid>

                  <Grid item xs={6}>
                    <EToken id={_.get(this, 'state.user.userId')} onChangeSnackbar={this.props.onChangeSnackbar} />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>

            <ExpansionPanel expanded={expanded === 'panel4'} onChange={this.handleChange('panel4')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Phân quyền truy cập</Typography>
                {/* <Typography className={classes.secondaryHeading}>Tích vào các tính năng mà đồng chí muốn Cán bộ truy cập</Typography> */}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid item container spacing={8}>
                  <Grid item md={6}>
                    <CustomInputBase
                      //className={classes.textField}
                      select
                      label="Nhóm phân quyền:"
                      value={this.state.codeRoleGroupSelect}
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={this.handleChangeRoleGroup}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                    //margin="normal"
                    >
                      {this.state.decentralization &&
                        this.state.decentralization.map(option => {
                          return (
                            <MenuItem key={option.code} value={option.code}>
                              {option.name}
                            </MenuItem>
                          );
                        })}
                    </CustomInputBase>
                  </Grid>
                  <Grid item md={6} style={{ paddingLeft: 5 }}>
                    <Autocomplete label={'Vai trò:'} isMulti name="type" value={this.state.type} onChange={this.onChangeType} suggestions={dataVal} />
                  </Grid>
                  <Grid item md={2} style={{ display: 'flex', alignItems: 'center' }}>
                    <FormGroup row className={classes.tetxCheckBox}>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.signer === true ? true : false} />}
                        label="Người ký"
                        // labelPlacement="Singe"
                        value={this.state.signer}
                        name="signer"
                        onChange={this.handleChangeCheckbox}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} style={{ display: 'flex', alignItems: 'center' }}>
                    <FormGroup row className={classes.tetxCheckBox}>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.canProcessAny === true ? true : false} />}
                        label="Chuyển bất kỳ"
                        // labelPlacement="Singe"
                        value={this.state.canProcessAny}
                        name="canProcessAny"
                        onChange={this.handleChangeCheckbox}
                      />
                    </FormGroup>
                  </Grid>
                  {/* <Grid item md={2} style={{ display: 'flex', alignItems: 'center' }}>
                    <FormGroup row className={classes.tetxCheckBox}>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.canProcessAnyInDepartment === true ? true : false} />}
                        label="Chuyển bất kỳ giới hạn phòng ban"
                        // labelPlacement="Singe"
                        value={this.state.canProcessAnyInDepartment}
                        name="canProcessAnyInDepartment"
                        onChange={this.handleChangeCheckbox}
                      />
                    </FormGroup>
                  </Grid> */}
                  <Grid item md={2} style={{ display: 'flex', alignItems: 'center' }}>
                    <FormGroup row className={classes.tetxCheckBox}>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.anonymous === true ? true : false} />}
                        label="Tài khoản ẩn"
                        // labelPlacement="Singe"
                        value={this.state.anonymous}
                        name="anonymous"
                        onChange={this.handleChangeCheckbox}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} style={{ display: 'flex', alignItems: 'center' }}>
                    <FormGroup row className={classes.tetxCheckBox}>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.internal === true ? true : false} />}
                        label="Nơi nhận nội bộ"
                        // labelPlacement="Singe"
                        value={this.state.internal}
                        name="internal"
                        onChange={this.handleChangeCheckbox}
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} style={{ display: 'flex', alignItems: 'center' }}>
                    <FormGroup row className={classes.tetxCheckBox}>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.inherit === true ? true : false} />}
                        label="Thừa lệnh/Thừa uỷ quyền"
                        // labelPlacement="Singe"
                        value={this.state.inherit}
                        name="inherit"
                        onChange={this.handleChangeCheckbox}
                      />
                    </FormGroup>
                  </Grid>
                  {this.state.inherit && (
                    <Grid item md={4} style={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Phòng ban thừa lệnh/thừa uỷ quyền"
                        select
                        variant="outlined"
                        fullWidth
                        error={this.state.releaseError}
                        helperText={this.state.messages.releaseDepartmentError}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={this.state.releaseDepartment}
                        onChange={e => {
                          this.setState({
                            releaseDepartment: e.target.value,
                            releaseError: false,
                            messages: { ...this.state.messages, releaseDepartmentError: '' },
                          });
                        }}
                      >
                        <MenuItem value={null}>---Chọn phòng ban---</MenuItem>
                        {this.state.department.map((item, index) => {
                          return (
                            <MenuItem value={item._id} style={{ paddingLeft: `${item.level * 20}px` }}>
                              {item.title}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                  )}
                </Grid>
              </ExpansionPanelDetails>
              <Grid item md={12}>
                <div style={{ width: '100%' }}>
                  <AppBar position="static">
                    <Tabs
                      value={value}
                      onChange={value => {
                        this.handleChangeValue;
                      }}
                    >
                      <Tab className={classes.btnAppBar} label="Phân quyền chức năng" />
                    </Tabs>
                  </AppBar>
                </div>
              </Grid>
              {expanded === 'panel4' ? (
                <Grid item md={12}>
                  <Paper item md={12}>
                    {value === 0 && (
                      <TabContainer>
                        <RoleByFunction
                          employeeId={this.state.roleGroupSelectId || this.props.match.params.id}
                          allFunctionForAdd={this.state.allFunctionForAdd}
                          allowedDepartment={this.state.allowedDepartment}
                          fromAddUser
                          handleChangeRole={this.handleChangeRole}
                          id={this.props.match.params.id ? this.props.match.params.id : 'add'}
                          byOrg={true}
                        />
                      </TabContainer>
                    )}
                    {value === 1 && (
                      <TabContainer>
                        <DepartmentSelect
                          allowedDepartmentIds={this.state.allDepartment || []}
                          allowedDepartment={this.handleChangeRoles}
                          onChange={this.handleChangeAllowedDepart}
                          currentDepartment={this.state.organizationUnit} // phong ban moi
                          userDepartment={this.state.userDepartment} // phong ban cu
                          disabledAction
                          applyEmployeeOrgToModuleOrg={!this.state.applyEmployeeOrgToModuleOrg}
                          userRoles={this.state.departmentRoles || []}
                          requiredUserRoles
                        />
                      </TabContainer>
                    )}
                  </Paper>
                </Grid>
              ) : null}
            </ExpansionPanel>
            {
              isPort && <ExpansionPanel expanded={expanded === 'panel5'} onChange={this.handleChange('panel5')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>Phân quyền truy cập Portal</Typography>
                  {/* <Typography className={classes.secondaryHeading}>Tích vào các tính năng mà đồng chí muốn Cán bộ truy cập</Typography> */}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid item container spacing={8}>
                    <Grid item md={6}>
                      <CustomInputBase
                        //className={classes.textField}
                        select
                        label="Nhóm phân quyền Portal:"
                        value={this.state.codeRoleGroupPortalSelect}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={this.handleChangeRoleGroupPortal}
                        SelectProps={{
                          MenuProps: {
                            className: classes.menu,
                          },
                        }}
                      //margin="normal"
                      >
                        {this.state.decentralizationPortal &&
                          this.state.decentralizationPortal.map(option => {
                            return (
                              <MenuItem key={option.code} value={option.code}>
                                {option.name}
                              </MenuItem>
                            );
                          })}
                      </CustomInputBase>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
                <Grid item md={12}>
                  <div style={{ width: '100%' }}>
                    <AppBar position="static">
                      <Tabs
                        value={value}
                        onChange={value => {
                          this.handleChangeValue;
                        }}
                      >
                        <Tab className={classes.btnAppBar} label="Phân quyền chức năng" />
                      </Tabs>
                    </AppBar>
                  </div>
                </Grid>
                {expanded === 'panel5' ? (
                  <Grid item md={12}>
                    <Paper item md={12}>
                      <TabContainer>
                        <RoleByFunctionPortal
                          employeeId={this.state.roleGroupSelectId || this.props.match.params.id}
                          allFunctionForAdd={this.state.allFunctionForAddPortal}
                          allowedDepartment={this.state.allowedDepartmentPortal}
                          fromAddUser
                          handleChangeRole={this.handleChangeRolePortal}
                          id={this.props.match.params.id ? this.props.match.params.id : 'add'}
                          byOrg={true}
                          disableCheckBox={true}
                        />
                      </TabContainer>
                      {/* <TabContainer>
                      <DepartmentSelect
                        allowedDepartmentIds={this.state.allDepartment || []}
                        allowedDepartment={this.handleChangeRoles}
                        onChange={this.handleChangeAllowedDepart}
                        currentDepartment={this.state.organizationUnit} // phong ban moi
                        userDepartment={this.state.userDepartment} // phong ban cu
                        disabledAction
                        applyEmployeeOrgToModuleOrg={!this.state.applyEmployeeOrgToModuleOrg}
                        userRoles={this.state.departmentRoles || []}
                        requiredUserRoles
                      />
                    </TabContainer> */}
                    </Paper>
                  </Grid>
                ) : null}
              </ExpansionPanel>
            }

          </Grid>
        </Grid>
      </div>
    );
  }

  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };

  handleChangeValue = (event, value) => {
    this.setState({ value });
  };

  goBack = () => {
    this.state.user = null;
    localStorage.removeItem('user');
    this.props.history.push({
      pathname: `/setting/Employee`,
      state: 0,
    });
  };

  onSubmit = () => {
    const {
      name = '',
      code = '',
      email = '',
      password,
      organizationUnit,
      rePassword,
      username,
      canProcessAny,
      canProcessAnyInDepartment,
      timeToJoin,
      IDcard,
      gender,
      address,
      dob,
      positions,
      note,
      mobileNumber,
      active,
      avatar,
      fieldAdded,
      listOrganizationUnit,
      allFunctionForAdd,
      type,
      resetChild,
      allowedDepartment,
      allowedDepartmentPortal,
      codeRoleGroupSelect,
      signer,
      anonymous,
      roleGroupSelectId,
      roleGroupPortalSelectId,
      viewConfigSystem,
      internal,
      messages,
      inherit,
      releaseDepartment,
      codeRoleGroupPortalSelect,
      cap_bac,
    } = this.state;

    // this.getMessages()

    let beginWork;
    let dobDate;
    if (timeToJoin === '') {
      beginWork = new Date();
    } else {
      beginWork = new Date(timeToJoin);
    }
    if (dob === '') {
      dobDate = new Date();
    } else {
      dobDate = new Date(dob);
    }
    const genderRaw = gender === 0 ? 'male' : 'female';
    const status = active ? 1 : 0;
    const others = {};
    if (fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }
    const depart = listOrganizationUnit.find(item => String(item.id) === String(organizationUnit));
    let organizationUnitRaw;
    if (depart) {
      organizationUnitRaw = {
        organizationUnitId: depart.id,
        name: depart.name,
      };
    }

    let dataType = [];
    if (Array.isArray(type) && type.length > 0) {
      type.forEach(item => {
        dataType.push(item.value);
      });
    }
    const body = {
      organizationUnit: organizationUnitRaw,
      code,
      name,
      email,
      avatar,
      status,
      dob: dobDate,
      beginWork,
      gender: genderRaw,
      IDcard,
      mobileNumber,
      canProcessAny,
      canProcessAnyInDepartment,
      address,
      note,
      anonymous,
      internal,
      userExtendViewConfig: this.state.userExtendViewConfig !== null ? this.state.userExtendViewConfig : undefined,
      positions,
      username,
      password,
      others,
      allFunctionForAdd,
      type: dataType,
      resetChild,
      allowedDepartment,
      roleGroupSource: codeRoleGroupSelect,
      roleGroupSourcePortal: codeRoleGroupPortalSelect,
      roleGroupSourceId: roleGroupSelectId || null,
      signer,
      viewConfigSystem,
      inherit,
      releaseDepartment,
      cap_bac: cap_bac,
    };
    let listCheckValid = ['organizationUnit', 'code', 'name', 'email'];
    let errors = {};
    listCheckValid.forEach(name => {
      errors[name] = this.checkValidationUserData(name, body[name]);
    });
    if (
      String(name).length <= 5 ||
      String(code).length <= 5 ||
      String(email).length <= 5 ||
      String(username).length <= 5 ||
      String(password).length <= 5 ||
      String(rePassword).length <= 5 ||
      String(organizationUnit).length <= 5 ||
      (this.state.releaseDepartment === null && this.state.inherit === true) ||
      this.state.errorEmail === true
    ) {
      this.checkBeforSubmit();
      this.props.onChangeSnackbar({ status: true, message: 'Vui lòng kiểm tra lại thông tin nhập vào!', variant: 'error' });
    } else {
      if (Object.values(errors).every(x => x === '')) {
        try {
          this.setState({ disableButton: true });
          console.log(body, 'body')
          this.props.onAddNewUser(body);
        } catch (error) {
          this.setState({ disableButton: false });
        }
      } else {
        Object.values(errors).map((x, index) => {
          // this.getMessages();
          if (x) {
            this.setState({ disableButton: false });
            this.props.onChangeSnackbar({ status: true, message: x, variant: 'error' });
          }
        });
      }
    }
  };

  checkBeforSubmit() {
    const { name, code, email, password, organizationUnit, rePassword, username, messages, releaseDepartment } = this.state;

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let newMessages = {};

    if (String(name).length === 0 || name.length < 5) {
      newMessages = { ...newMessages, errorName: 'Tên cán bộ tối thiếu 5 ký tự!' };
      this.setState({
        errorName: true,
      });
    }

    if (String(code).length === 0 || code.length < 5) {
      newMessages = { ...newMessages, errorCode: 'Mã cán bộ tối thiếu 5 ký tự!' };
      this.setState({
        errorCode: true,
      });
    }
    if (String(email).length === 0) {
      newMessages = { ...newMessages, errorEmail: 'Không được để trống Email!' };
      this.setState({
        errorEmail: true,
      });
    } else if (re.test(email) === false) {
      newMessages = { ...newMessages, errorEmail: 'Email không hợp lệ!' };
      this.setState({
        errorEmail: true,
      });
    } else {
      delete newMessages.errorEmail;
      this.setState({
        errorEmail: false,
      });
    }

    if (String(username).length === 0 || String(username).length < 5 || String(username).length > 50) {
      newMessages = { ...newMessages, errorUsername: `Tên đăng nhập tối thiếu 5 và tối đa 50 ký tự!` };
      this.setState({
        errorUsername: true,
      });
    }

    if (String(password).length === 0 || String(password).length < 7) {
      newMessages = { ...newMessages, errorPassword: `Mật khẩu tối thiếu 7 ký tự!` };
      this.setState({
        errorPassword: true,
      });
    }

    if (String(organizationUnit).length === 0) {
      newMessages = { ...newMessages, errorOrganizationUnit: `Đơn vị không được để trống!` };
      this.setState({
        errorOrganizationUnit: true,
      });
    }

    if (String(rePassword).length === 0) {
      newMessages = { ...newMessages, errorNotMatch: `Xác minh mật khẩu không được để trống!` };
      this.setState({
        errorNotMatch: true,
      });
    } else if (password.length === 0) {
      newMessages = { ...newMessages, errorPassword: `Mật khẩu không được để trống!` };
      this.setState({
        errorPassword: true,
      });
    } else if (!(password === rePassword)) {
      newMessages = { ...newMessages, errorNotMatch: `Mật khẩu không khớp` };
      this.setState({
        errorNotMatch: true,
      });
    }

    if (releaseDepartment === null) {
      newMessages = { ...newMessages, releaseDepartmentError: `Không được để trống phòng ban` };
      this.setState({
        releaseError: true,
      });
    } else {
      this.setState({
        releaseError: false,
      });
    }

    this.setState({ messages: newMessages });
  }

  checkValidationUserData = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) {
          return 'Cần nhập thông tin tên cán bộ';
        }
        return '';
      case 'code':
        if (!value) {
          return 'Cần nhập thông tin mã cán bộ';
        }
        return '';
      case 'email':
        if (!value) {
          return 'Cần nhập thông tin email cán bộ';
        }
        return '';
      case 'organizationUnit':
        if (!value) {
          return 'Cần chọn thông tin đơn vị cán bộ';
        }
        return '';
    }
  };

  onEditBtn = () => {
    const rex = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const {
      name,
      code,
      email,
      organizationUnit,
      timeToJoin,
      IDcard,
      gender,
      address,
      dob,
      user,
      positions,
      note,
      mobileNumber,
      active,
      canProcessAny,
      canProcessAnyInDepartment,
      avatar,
      avatarURL,
      fieldAdded,
      listOrganizationUnit,
      allFunctionForAdd,
      allFunctionForAddPortal,
      type,
      resetChild,
      roleGroupSelectId,
      codeRoleGroupSelect,
      signer,
      anonymous,
      allowedDepartment,
      viewConfigSystem,
      internal,
      inherit,
      releaseDepartment,
      cap_bac,
      codeRoleGroupPortalSelect
    } = this.state;
    const { addUserPage } = this.props;
    // this.getMessages()
    if (name.length < 5 || code.length < 5) {
      if (name.length < 5) {
        this.setState({ errorName: true });
      }
      if (code.length < 5) {
        this.setState({ errorCode: true });
      }
    } else if (!rex.test(email.trim())) {
      this.setState({ errorEmail: true });
    } else {
      let beginWork;
      let dobDate;
      if (timeToJoin === '') {
        beginWork = new Date();
      } else {
        beginWork = new Date(timeToJoin);
      }
      if (dob === '') {
        dobDate = new Date();
      } else {
        dobDate = new Date(dob);
      }
      const genderRaw = gender === 0 ? 'male' : 'female';
      const status = active ? 1 : 0;
      const others = {};
      if (fieldAdded.length > 0) {
        fieldAdded.forEach(item => {
          others[item.name.replace('others.', '')] = item.value;
        });
      }
      const depart = listOrganizationUnit.find(item => String(item.id) === String(organizationUnit));
      let organizationUnitRaw;
      if (depart) {
        organizationUnitRaw = {
          organizationUnitId: depart.id,
          name: depart.name,
        };
      }
      let dataType = [];
      if (Array.isArray(type) && type.length > 0) {
        type.forEach(item => {
          dataType.push(item.value);
        });
      }
      const body = {
        organizationUnit: organizationUnitRaw,
        code,
        name,
        email,
        status,
        avatar,
        avatarURL,
        dob: dobDate,
        beginWork,
        gender: genderRaw,
        IDcard,
        id: this.props.match.params.id,
        user: user.user,
        mobileNumber,
        address,
        canProcessAny,
        canProcessAnyInDepartment,
        note,
        userExtendViewConfig: this.state.userExtendViewConfig !== null ? this.state.userExtendViewConfig : undefined,
        positions,
        others,
        allFunctionForAdd,
        allFunctionForAddPortal,
        userId: addUserPage.user.userId,
        type: dataType,
        resetChild,
        roleGroupSelectId,
        roleGroupSource: codeRoleGroupSelect,
        roleGroupSourcePortal: codeRoleGroupPortalSelect,
        allowedDepartment,
        signer,
        anonymous,
        viewConfigSystem,
        internal,
        inherit,
        releaseDepartment,
        cap_bac: cap_bac,
      };
      let listCheckValid = ['organizationUnit', 'code', 'name', 'email'];
      let errors = {};
      listCheckValid.forEach(name => {
        errors[name] = this.checkValidationUserData(name, body[name]);
      });

      if (Object.values(errors).every(x => x === '')) {
        try {
          this.setState({ disableButton: true });
          this.props.onEdit(body);
        } catch (error) {
          this.setState({ disableButton: false });
        }
      } else {
        Object.values(errors).map((x, index) => {
          this.getMessages();
          if (x) {
            this.props.onChangeSnackbar({ status: true, message: x, variant: 'error' });
          }
        });
      }
    }
  };

  handleChangeSelect = selectedOption => {
    this.setState({ organizationUnit: selectedOption });
  };
}

AddUserPage.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onAddNewUser: PropTypes.func.isRequired,
  onResetNoti: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addUserPage: makeSelectAddUserPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onAddNewUser: body => {
      dispatch(addUserAction(body));
    },
    onGetOrganizationUnit: () => {
      dispatch(getDepartmentAct());
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onEdit: body => {
      dispatch(editUserAct(body));
    },
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
    onGetUser: id => {
      dispatch(getUserAct(id));
    },
    onGetModule: () => {
      dispatch(getModuleAct());
    },
    onGetModulePortal: () => {
      dispatch(getModulePortalAct());
    },
    mergeData: data => {
      dispatch(merge(data));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addUserPage', reducer });
const withSaga = injectSaga({ key: 'addUserPage', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  injectIntl,
  withConnect,
  withStyles(styles),
)(AddUserPage);

const EToken = props => {
  const { id, onChangeSnackbar } = props;

  const [data, setData] = useState();
  const notConnect = !data || !data.emailToken || data.emailToken === 'delete';

  useEffect(
    () => {
      if (id) getData();
    },
    [id],
  );

  const getData = async () => {
    const res = await getTokenInfo({
      userId: id,
    });
    if (res) setData(res);
  };

  const onClick = () => {
    getCertinfo(
      async e => {
        const { Email } = e;

        const res = await updateInfo({
          userId: id,
          emailToken: Email,
          keyToken: 'keyToken',
          isActiveToken: true,
        });
        // vgca_license_request()
        // auth(Email)
        await getData();
        onChangeSnackbar && onChangeSnackbar({ variant: 'success', message: 'Cập nhật thành công', status: true });
      },
      () => onChangeSnackbar && onChangeSnackbar({ variant: 'danger', message: 'Cập nhật không thành công', status: true }),
    );
  };

  const onChangeActive = async checked => {
    const res = await updateInfo({
      userId: id,
      emailToken: data.emailToken,
      // keyToken: data.keyToken,
      isActiveToken: checked,
    });
    // vgca_license_request()
    // auth(Email)
    await getData();
    onChangeSnackbar && onChangeSnackbar({ variant: 'success', message: 'Cập nhật thành công', status: true });
  };

  const onDelete = async () => {
    // getCertinfo(async e => {
    // const { Email } = e

    const res = await updateInfo({
      userId: id,
      emailToken: 'delete',
      keyToken: '',
      isActiveToken: true,
    });
    await getData();
    onChangeSnackbar && onChangeSnackbar({ variant: 'success', message: 'Chập nhật thành công', status: true });

    // }, () => onChangeSnackbar && onChangeSnackbar({ variant: 'danger', message: 'Chập nhật không thành công', status: true }))
  };

  if (!id || !data) return null;
  return (
    <>
      {notConnect ? (
        <Button color="primary" variant="contained" component="span" onClick={onClick} style={{ marginRight: 50 }}>
          <span style={{ fontWeight: 'bold' }}>Kết nối USB Token</span>
        </Button>
      ) : (
        <>
          <Button color="primary" variant="contained" component="span" onClick={onDelete} style={{ marginRight: 50 }}>
            <span style={{ fontWeight: 'bold' }}>Xóa USB Token</span>
          </Button>
          <FormControlLabel
            control={<Checkbox checked={_.get(data, 'isActiveToken')} onClick={e => onChangeActive(!data.isActiveToken)} />}
            label="Đăng nhập sử dụng E-Token"
            labelPlacement="end"
          />
        </>
      )}
    </>
  );
};
