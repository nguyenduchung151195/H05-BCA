/**
 *
 * SystemConfigPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import NumberFormat from 'react-number-format';

import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import messages from './messages';
import './index.css';
import { API_SQL_OUT, API_SQL_IN } from '../../config/urlConfig';
import { changeSnackbar } from 'containers/Dashboard/actions';

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  InputLabel,
  // Input,
  OutlinedInput,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormLabel,
  FormHelperText,
  AppBar,
  Toolbar,
  Collapse,
  ListItem,
  ListItemIcon,
} from '@material-ui/core';
import { Breadcrumbs } from '@material-ui/lab';
import CustomInputBase from '../../components/Input/CustomInputBase';

import { CameraAlt, ExpandLess, ExpandMore, Close } from '@material-ui/icons';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSystemConfigPage from './selectors';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import avatarA from '../../images/avatarCompany.png';
import { updateSysConfAct, createConfigCodeAct, getSysConfAct, resetNoti, getConfigCodeAct } from './actions';
import CustomAppBar from 'components/CustomAppBar';
import logoDefault from '../../images/logo.jpg';
import { MuiPickersUtilsProvider, TimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
/* eslint-disable react/prefer-stateless-function */
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
// TT - UPDATE=CREATE CODE - 24
const initialDataConfigCode = [
  {
    value: null, // 1
    name: 'moduleType',
    checked: true,
  },
  {
    value: null,
    checked: false,
    name: 'prefix',
  },
  {
    value: null,
    checked: false,
    name: 'formatDate',
  },
  {
    value: null,
    ckecked: false,
    name: 'numericalOrderFormat',
  },
  {
    value: false,
    checked: false,
    name: 'provincial',
  },
  {
    value: false,
    checked: false,
    name: 'productType',
  },
  {
    value: null,
    checked: false,
    name: 'intermediate',
  },
  {
    value: null,
    checked: false,
    name: 'suffixes',
  },
  {
    value: null,
    checked: false,
    name: 'nickname',
  },
  {
    value: null, // 1/ , 2-
    checked: true,
    name: 'breakCharacter',
  },
];

// TT - UPDATE=CREATE CODE - 23
export class SystemConfigPage extends React.Component {
  state = {
    codeExample: '',
    avatar: null,
    avatarURL: '',
    companyName: '',
    nameDisplay: '',
    website: '',
    email: '',
    holiday: '',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    startDay: 1,
    timeStart: '08:00',
    timeEnd: '17:30',
    daysInWeek: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    language: 'vi',
    mailServer: '',
    passServer: '',
    serviceServer: '',
    smsBrandname: '',
    smsAccount: '',
    smsPass: '',
    errorCompanyName: false,
    errorTitleName: false,
    errorEmail: false,
    open: false,
    openSetupCode: false,
    dataConfigCode: initialDataConfigCode, // TT - UPDATE=CREATE CODE - 23
    facebook: '',
    bankAccount: '',
    disableButton: false,
    showBtn: true,
    userAfkTime: '',
    subordinateUnit: '',
    hostUnit: ''
  };

  componentDidMount() {
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack');
    localStorage.removeItem('addWorkingScheduleCallback');
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');
  }

  handleClick = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  handleClickSetupCodeCollapse = () => {
    this.setState(prevState => ({ openSetupCode: !prevState.openSetupCode }));
  };

  componentWillMount() {
    // console.log('state', this.state);
    this.props.onGetConfigCode({ task: 'Task' });
    this.props.onGetConf();
  }

  async componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { systemConfigPage } = props;
      const { configCode } = systemConfigPage;
      const configCodeDefault = {
        moduleType: null,
        prefix: null,
        formatDate: null,
        numericalOrderFormat: null,
        provincial: false,
        productType: false,
        intermediate: null,
        suffixes: null,
        nickname: null,
        breakCharacter: null,
      };
      const configCodeFull = Object.assign(configCodeDefault, configCode);
      if (configCodeFull.moduleType === 4) {
        configCodeFull.nickname = false;
      }
      if (Object.keys(configCodeFull).length) {
        const defaultDataConfigCode = [...initialDataConfigCode];
        const newDataConfigCode = defaultDataConfigCode.map(item => {
          const newVal = configCodeFull[item.name];
          return {
            value: newVal,
            checked: !!newVal,
            name: item.name,
          };
        });
        await this.setState({ dataConfigCode: newDataConfigCode });
        this.handleCodeFollowDataConfigCode();
      }
      if (systemConfigPage.sysConf) {
        const { sysConf } = systemConfigPage;
        const holiday = sysConf.holidays.join(', ');
        const daysInWeek = sysConf.workingDays.map(item => {
          if (parseInt(item, 10) > 1) {
            return `Thứ ${item}`;
          }
          return 'Chủ nhật';
        });
        this.setState({
          avatarURL: sysConf.logo,
          companyName: sysConf.name,
          nameDisplay: sysConf.displayName,
          website: sysConf.website,
          email: sysConf.email,
          holiday,
          dateFormat: sysConf.dateFomat || '',
          timeFormat: sysConf.timeFomat || '',
          startDay: sysConf.firstDayOfTheWeek - 1,
          timeStart: sysConf.workingTime.start,
          timeEnd: sysConf.workingTime.end,
          mailServer: sysConf.mailServer,
          passServer: sysConf.passServer,
          serviceServer: sysConf.serviceServer,
          smsBrandname: sysConf.smsBrandname,
          smsAccount: sysConf.smsAccount,
          smsPass: sysConf.smsPass,
          daysInWeek,
          language: sysConf.language,
          facebook: sysConf.facebook,
          bankAccount: sysConf.bankAccount,
          userAfkTime: sysConf.userAfkTime || 1,
          subordinateUnit: sysConf.subordinateUnit,
          hostUnit: sysConf.hostUnit,
        });
      }
    }
  }

  // systemConfigPage :
  componentDidUpdate() {
    const { systemConfigPage } = this.props;
    if (systemConfigPage) {
      if (systemConfigPage.successUpdate === true) {
        this.setState({ disableButton: false })
        this.props.enqueueSnackbar('Thao tác thành công!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        this.props.onReset();
      }
      if (systemConfigPage.successCreateCode === true) {
        this.setState({ disableButton: false })
        this.props.enqueueSnackbar('Thao tác thành công!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        this.props.onReset();
      }
      if (systemConfigPage.error) {
        this.setState({ disableButton: false })
        this.props.enqueueSnackbar('Thao tác thất bại!', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        this.props.onReset();
      }
    }
  }

  // TT - UPDATE=CREATE CODE - 5
  // TT 1.2 - ONCHANGE - INPUT
  handleChangeInputForConfigCode = e => {
    const val = e.target.value;
    const name = e.target.name;

    this.setState(
      prevState => ({
        dataConfigCode: prevState.dataConfigCode.map(item => {
          if (item.name === name) {
            return { ...item, value: val };
          }
          return { ...item };
        }),
      }),
      // TT - UPDATE=CREATE CODE - 6
      () => this.handleCodeFollowDataConfigCode(),
    );
    // TT - UPDATE=CREATE CODE - 7 NẾU CLICK VAO MODULETYPE - thì nó sẽ LOAD lại REQUEST SERVER LOAD = LOGIC GET
    if (e.target.name === 'moduleType') {
      const body = { task: null };
      switch (e.target.value) {
        case 1:
          body.task = 'Task';
          break;
        case 2:
          body.task = 'Contract';
          break;
        case 3:
          body.task = 'Customer';
          break;
        case 4:
          body.task = 'Supplier';
          break;
        case 5:
          body.task = 'SalesQuotation';
          break;
        default:
          break;
      }
      // TT - UPDATE=CREATE CODE - 7 NẾU CLICK VAO MODULETYPE - thì nó sẽ LOAD lại REQUEST SERVER LOAD = LOGIC GET
      if (body) {
        this.props.onGetConfigCode(body);
      }
    }
  };

  // TT - UPDATE=CREATE CODE - 2
  // TT 1.1 - ONCHANGE - CHECK BOX truyen len fieldName : thay đổi checked dataConfigCode - fieldName truyền lên
  handleCheckBoxConfigCode = fieldName => {
    this.setState(
      prevState => ({
        dataConfigCode: prevState.dataConfigCode.map(item => {
          // nếu là dataConfigCode.item - fieldName truyen len :
          // toggle checked cua dataConfigCode.item (default : checked= false,) (THAY DOI - ITEM do)
          if (item.name === fieldName) {
            if (fieldName === 'nickname' || fieldName === 'provincial' || fieldName === 'productType') {
              return { ...item, checked: !item.checked, value: !item.checked }; // vi nickname bi DISABLE - khong bat ONCHANGE
            }
            return { ...item, checked: !item.checked };
          }
          // nếu khong phai là dataConfigCode.item - fieldName truyen len : thi tra ve ITEM cu (KO DOI)
          return { ...item };
        }),
      }),
      // TT - UPDATE=CREATE CODE - 3
      () => this.handleCodeFollowDataConfigCode(), // CB
    );
  };

  // TT - UPDATE=CREATE CODE - 4
  // TT 2 - ONCHANGE : để hiển thị : state codeExample.
  handleCodeFollowDataConfigCode = () => {
    // loc ITEM cua - dataConfigCode : ko phải moduleType,breakCharacter,null,'' (KO NỐI VÀO CHUỖI - codeExample)
    const data = this.state.dataConfigCode.filter(
      item => item.checked === true && item.name !== 'moduleType' && item.name !== 'breakCharacter' && item.value !== null && item.value !== '',
    );
    // NỐI CHUỖI - codeExample : sau do SETSTATE
    this.setState(prevState => ({
      codeExample: data
        .map(item => {
          if (item.name === 'formatDate') {
            if (item.value === 1) {
              return '01122021';
            }
            if (item.value === 2) {
              return '20211201';
            }
            if (item.value === 3) {
              return '12012021';
            }
          }
          if (item.name === 'numericalOrderFormat') {
            if (item.value === 1) {
              return '01';
            }
            if (item.value === 2) {
              return '001';
            }
            if (item.value === 3) {
              return '0001';
            }
          }
          if (item.name === 'nickname') {
            if (item.value === true) {
              return 'BIET DANH';
            }
            return '';
          }
          return item.value;
        })
        .join(
          prevState.dataConfigCode.find(item => item.name === 'breakCharacter').value === 2
            ? '-'
            : prevState.dataConfigCode.find(item => item.name === 'breakCharacter').value === 1
              ? '/'
              : '',
        ),
      // .join(prevState.dataConfigCode.find(item => item.name === 'breakCharacter').value),
    }));
  };

  onGoBack = () => {
    this.props.history.push('/Kpi');
    // window.location.reload();
  };
  handleConvertFile = (url, code) => {
    this.setState({ showBtn: false })
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ code }),
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ showBtn: true })
        if (data && data.status)
          alert("Convert thành công")
        else alert("Convert thất bại")
      })
      .catch((error) => {
        this.setState({ showBtn: true })
        console.error('Error:', error);
      });
  }
  render() {
    const { classes, intl } = this.props;
    const { showBtn } = this.state
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 6, nameAdd.length);
    return (
      <div  >
        <CustomAppBar
          title={
            addStock === 'config'
              ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Cấu hình chung' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cấu hình chung' })}`
          }
          // onGoBack={this.onGoBack}
          onSubmit={this.onSubmit}
          disableSave={this.state.disableButton}
        />
        <Helmet>
          <title>Cấu hình hệ thống</title>
          <meta name="description" content="Cấu hình hệ thống" />
        </Helmet>
        <Grid container >
          <Grid justify="center" md={6} spacing={32} style={{ paddingTop: 100 }}>
            <Paper container direction="row" justify="center" alignItems="center" style={{ paddingTop: 10 }}>
              <FormControl className={classes.textField} error style={{ marginTop: 10 }}>
                <CustomInputBase
                  label="Tên cơ quan"
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  value={this.state.companyName}
                  name="companyName"
                  margin="normal"
                  variant="outlined"
                // InputLabelProps={{
                //   shrink: true,
                // }}
                />
                {this.state.errorCompanyName ? (
                  <FormHelperText id="component-error-text1" style={{ marginTop: -3 }}>
                    Tên công ty không được để trống
                  </FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
              <FormControl className={classes.textField} error style={{ marginTop: 10 }}>
                <CustomInputBase
                  label="Tên cơ quan hiển thị trên thanh tiêu đề"
                  onChange={this.handleChangeInput}
                  style={{ marginTop: '10px' }}
                  // className={classes.textField}
                  value={this.state.nameDisplay}
                  name="nameDisplay"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="displayName"
                />
                {this.state.errorTitleName ? (
                  <FormHelperText id="component-error-text1">Tên công ty hiển thị trên thanh tiêu đề không được để trống</FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>
              <FormControl className={classes.textField} style={{ marginTop: 10 }}>
                <CustomInputBase
                  label="Tên website"
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  value={this.state.website}
                  name="website"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
              </FormControl>





              <FormControl className={classes.textField} style={{ marginTop: 10 }}>
                <CustomInputBase
                  label="Đơn vị trực thuộc"
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  value={this.state.subordinateUnit}
                  name="subordinateUnit"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
              </FormControl>
              <FormControl className={classes.textField} style={{ marginTop: 10 }}>
                <CustomInputBase
                  label="Đơn vị chủ quản"
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  value={this.state.hostUnit}
                  name="hostUnit"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
              </FormControl>





              <FormControl className={classes.textField} style={{ marginTop: 10 }}>
                <CustomInputBase
                  label="Địa chỉ Facebook"
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  value={this.state.facebook}
                  name="facebook"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
              </FormControl>
              <FormControl className={classes.textField} style={{ marginTop: 10 }}>
                <CustomInputBase
                  label="Tài khoản ngân hàng"
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  value={this.state.bankAccount}
                  name="bankAccount"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
              </FormControl>

              <FormControl className={classes.textField} error style={{ marginTop: 10 }}>
                <CustomInputBase
                  label="Email quản trị viên : "
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  value={this.state.email}
                  name="email"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                />
                {this.state.errorEmail ? (
                  <FormHelperText id="component-error-text1" style={{ marginTop: -2 }}>
                    Email sai định dạng
                  </FormHelperText>
                ) : (
                  ''
                )}
              </FormControl>

              <FormControl className={classes.textField} error style={{ marginTop: 10 }}>
                <NumberFormat
                  label={'Giới hạn treo(phút)'}
                  customInput={CustomInputBase}
                  value={this.state.userAfkTime}
                  onChange={e => {
                    this.setState({ userAfkTime: e.target.value })
                  }}
                />
              </FormControl>
              {/* <InputLabel style={{ fontSize: 12, marginLeft: 25, marginTop: 20 }}>Định dạng ngày tháng</InputLabel> */}
              {/* Định dạng ngày th */}
              {/* <FormControl className={classes.textField} >
                <CustomInputBase
                  select
                  label="Định dạng ngày tháng"
                  variant="outlined"
                  // className={classes.CustomInputBase}
                  value={this.state.dateFormat}
                  name="dateFormat"
                  onChange={this.handleChangeInput}
                  input={<OutlinedInput labelWidth={0} id="select-checkbox" />}
                >
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                </CustomInputBase>
              </FormControl> */}


              {/* <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend" style={{ fontSize: 12, color: '#000', marginBottom: 0 }}>
                  Định dạng thời gian
                </FormLabel>
                <RadioGroup
                  aria-label="timeFormat"
                  name="timeFormat"
                  className={classes.group}
                  value={this.state.timeFormat}
                  onChange={this.handleChangeInput}
                >
                  <FormControlLabel value="12h" control={<Radio />} label="12 giờ" />
                  <FormControlLabel value="24h" control={<Radio />} label="24 giờ" />
                </RadioGroup>
              </FormControl> */}
              {/* <InputLabel style={{ fontSize: 12, marginLeft: 25, display: 'block' }}>Ngày đầu tiên trong tuần</InputLabel> */}
              {/* <FormControl className={classes.textField} >
                <CustomInputBase
                  select
                  label="Ngày đầu tiên trong tuần"
                  variant="outlined"
                  // className={classes.textField}
                  value={this.state.startDay}
                  name="startDay"
                  onChange={this.handleChangeInput}
                  input={<OutlinedInput labelWidth={0} id="select" />}
                >
                  <MenuItem value={0}>Chủ nhật</MenuItem>
                  <MenuItem value={1}>Thứ 2</MenuItem>
                </CustomInputBase>
              </FormControl> */}

              {/* <Grid container justify="flex-start" className={classes.textField}>
                <FormLabel component="legend" style={{ fontSize: 12, marginTop: 30, marginRight: 20, color: '#000' }}>
                  Thời gian làm việc:
                </FormLabel>
               
                <MuiPickersUtilsProvider utils={MomentUtils} locale="vi-VN">
                  <TimePicker
                    clearable
                    ampm={false}
                    label="Thời gian bắt đầu"
                    value={this.state.timeStart}
                    // onChange={this.handleChangeInput}
                    invalidLabel="DD/MM/YYYY"
                    invalidDateMessage={false}
                    onChange={event => {
                      this.setState({ timeStart: event });
                    }
                    }
                  />
                  <span style={{ fontSize: 12, marginTop: 30, marginRight: 10, marginLeft: 10 }}>&nbsp;đến</span>
                  <TimePicker
                    clearable
                    ampm={false}
                    label="Thời gian kết thúc"
                    value={this.state.timeEnd}
                    // onChange={this.handleChangeInput}
                    invalidLabel="DD/MM/YYYY"
                    invalidDateMessage={false}
                    onChange={event => {
                      this.setState({ timeEnd: event });
                    }
                    }
                  />
                </MuiPickersUtilsProvider>

          
              </Grid> */}
              {/* <FormControl className={classes.textField} >
                <CustomInputBase
                  select
                  label="Ngày trong tuần"
                  variant="outlined"
                  multiple
                  value={this.state.daysInWeek}
                  name="daysInWeek"
                  // className={classes.textField}
                  onChange={this.handleChangeInput}
                  // input={<Input id="select-multiple-checkbox" />}
                  renderValue={selected => selected.join(', ')}
                  MenuProps={MenuProps}
                  input={<OutlinedInput labelWidth={0} id="select-multiple-checkbox" />}
                >
                  <MenuItem value="Thứ 2">
                    <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 2') > -1} />
                    <ListItemText primary="Thứ 2" />
                  </MenuItem>
                  <MenuItem value="Thứ 3">
                    <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 3') > -1} />
                    <ListItemText primary="Thứ 3" />
                  </MenuItem>
                  <MenuItem value="Thứ 4">
                    <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 4') > -1} />
                    <ListItemText primary="Thứ 4" />
                  </MenuItem>
                  <MenuItem value="Thứ 5">
                    <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 5') > -1} />
                    <ListItemText primary="Thứ 5" />
                  </MenuItem>
                  <MenuItem value="Thứ 6">
                    <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 6') > -1} />
                    <ListItemText primary="Thứ 6" />
                  </MenuItem>
                  <MenuItem value="Thứ 7">
                    <Checkbox checked={this.state.daysInWeek.indexOf('Thứ 7') > -1} />
                    <ListItemText primary="Thứ 7" />
                  </MenuItem>
                  <MenuItem value="Chủ nhật">
                    <Checkbox checked={this.state.daysInWeek.indexOf('Chủ nhật') > -1} />
                    <ListItemText primary="Chủ nhật" />
                  </MenuItem>
                </CustomInputBase>
              </FormControl> */}

              {/* <FormControl className={classes.textField} >
                <CustomInputBase
                  label="Ngày nghỉ(định dạng: dd/mm/yyyy, mỗi ngày cách nhau bởi một dấu phẩy): "
                  onChange={this.handleChangeInput}
                  // className={classes.textField}
                  name="holiday"
                  variant="outlined"
                  // inputRef={input => (this.code = input)}
                  margin="normal"
                  value={this.state.holiday}
                // InputLabelProps={{
                //   shrink: true,
                // }}
                />
              </FormControl> */}


              {/* <FormControl className={classes.textField} >
                <CustomInputBase
                  select
                  label="Ngôn ngữ"
                  variant="outlined"
                  // className={classes.textField}
                  value={this.state.language}
                  name="language"
                  onChange={this.handleChangeInput}
                  input={<OutlinedInput labelWidth={0} id="select-language" />}
                >
                  <MenuItem value="vi">Việt Nam</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </CustomInputBase>
              </FormControl> */}


            </Paper>
          </Grid>
          <Grid style={{ height: '100%' }} md={6} justify="center" container flexWrap="wrap" className="avatar">
            <Avatar style={{ width: 300, height: 300 }} src={logoDefault} className={classes.avatar} srcSet={this.state.avatarURL} />
            <input
              className={classes.textFieldAva}
              onChange={this.onSelectImg}
              accept="image/*"
              name="avatar"
              type="file"
              style={{ cursor: 'pointer', opacity: 0, width: '300px', position: 'absolute', zIndex: '999', margin: '0px' }}
            />
            <span className={classes.spanAva}>
              <CameraAlt className={classes.iconCam} />
            </span>
            <Grid container justify="center">
              <span>Logo đơn vị </span>
            </Grid>
            <Grid container justify="center">
              <span>(Nhấp vào ảnh để thay đổi logo đơn vị)</span>
            </Grid>
            <Grid container style={{ padding: 10 }}>
              <ListItem button onClick={() => this.handleClick()}>
                <ListItemIcon>
                  <Typography variant="body1">Sms và Email</Typography>
                </ListItemIcon>
                {this.state.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Paper container direction="row" justify="center" alignItems="center">
                <Collapse style={{ padding: 20 }} in={this.state.open} timeout={0} unmountOnExit>
                  <CustomInputBase
                    name="smsBrandname"
                    value={this.state.smsBrandname}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    // defaultValue="Gmail"
                    variant="outlined"
                    fullWidth
                    label="Công ty Sms"
                  />
                  <CustomInputBase
                    name="smsAccount"
                    value={this.state.smsAccount}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    label="Tài khoản Sms"
                  />
                  <CustomInputBase
                    name="smsPass"
                    value={this.state.smsPass}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    type="password"
                    variant="outlined"
                    fullWidth
                    label="Mật khẩu Sms"
                  />
                  <CustomInputBase
                    name="serviceServer"
                    value={this.state.serviceServer}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    // defaultValue="Gmail"
                    variant="outlined"
                    fullWidth
                    label="Dịch vụ máy chủ"
                  />
                  <CustomInputBase
                    name="mailServer"
                    value={this.state.mailServer}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    label="Mail Máy chủ"
                  />
                  <CustomInputBase
                    name="passServer"
                    value={this.state.passServer}
                    onChange={this.handleChangeInput}
                    margin="normal"
                    type="password"
                    variant="outlined"
                    fullWidth
                    label="Mật khẩu Máy chủ"
                  />
                </Collapse>
              </Paper>
            </Grid>
            {/* TASK 1 - DIEN GIA TRI CHECKED */}
            <Grid container style={{ padding: 10 }}>
              <ListItem button onClick={() => this.handleClickSetupCodeCollapse()}>
                <ListItemIcon>
                  <Typography variant="body1">Cấu hình tạo mã hệ thống</Typography>
                </ListItemIcon>
                {this.state.openSetupCode ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Paper style={{ width: '100%' }}>
                <Collapse in={this.state.openSetupCode} style={{ width: '100%', padding: 20 }} timeout={0} unmountOnExit>
                  {/* <Button variant="contained" color="primary" style={{ margin: 10, 'margin-left': 0 }}>
                    Thêm mới
                  </Button> */}
                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block', color: '#000', marginBottom: 20 }}>MODULE ÁP DỤNG</InputLabel>
                  <Select
                    className={classes.textField}
                    style={{ 'margin-left': 0, width: '100%' }}
                    // TT - UPDATE=CREATE CODE - 25
                    value={this.state.dataConfigCode.find(item => item.name === 'moduleType').value}
                    name="moduleType"
                    onChange={this.handleChangeInputForConfigCode}
                    input={<OutlinedInput labelWidth={0} id="select-language" />}
                  >
                    <MenuItem value={1}>Hồ sơ công việc</MenuItem>
                  </Select>
                  <div className={classes.checkboxGroup} style={{ marginTop: 10 }} >
                    <CustomInputBase
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'prefix').value}
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      name="prefix"
                      margin="normal"
                      variant={this.state.dataConfigCode.find(item => item.name === 'prefix').checked ? 'outlined' : 'filled'}
                      fullWidth
                      label="TIỀN TỐ"
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'prefix').checked}
                    />
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'prefix').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('prefix')}
                      color="primary"
                    />
                  </div>
                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block', color: '#000' }}>ĐỊNH DẠNG NGÀY</InputLabel>
                  <div className={classes.checkboxGroup} style={{ marginTop: 10 }}>
                    <Select
                      className={
                        this.state.dataConfigCode.find(item => item.name === 'formatDate').checked ? classes.textField : classes.disabledSelect
                      }
                      style={{ 'margin-left': 0, width: '100%' }}
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'formatDate').value}
                      name="formatDate"
                      // variant={this.state.dataConfigCode.find(item => item.name === 'formatDate').checked ? 'outlined' : 'filled'}
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      input={<OutlinedInput labelWidth={0} id="select-language" />}
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'formatDate').checked}
                    >
                      <MenuItem value={1}>DD/MM/YYYY</MenuItem>
                      <MenuItem value={2}>YYYY/MM/DD</MenuItem>
                      <MenuItem value={3}>MM/DD/YYYY</MenuItem>
                    </Select>
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'formatDate').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('formatDate')}
                      color="primary"
                    />
                  </div>
                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block', color: '#000' }}>ĐỊNH DẠNG SỐ THỨ TỰ</InputLabel>
                  <div className={classes.checkboxGroup} style={{ marginTop: 10 }}>
                    <Select
                      style={{ 'margin-left': 0, width: '100%' }}
                      // TT - UPDATE=CREATE CODE - 4
                      value={this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').value}
                      // TT - UPDATE=CREATE CODE - 25
                      name="numericalOrderFormat"
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').checked}
                      onChange={this.handleChangeInputForConfigCode}
                      className={
                        this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').checked
                          ? classes.textField
                          : classes.disabledSelect
                      }
                      input={<OutlinedInput labelWidth={0} id="select-language" />}
                    >
                      <MenuItem value={1}>2 Chữ số</MenuItem>
                      <MenuItem value={2}>3 Chữ số</MenuItem>
                      <MenuItem value={3}>4 Chữ số</MenuItem>
                    </Select>
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'numericalOrderFormat').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('numericalOrderFormat')}
                      color="primary"
                    />
                  </div>
                  {this.state.dataConfigCode.find(item => item.name === 'moduleType').value === 3 ? (
                    <div className={classes.checkboxGroup} style={{ marginTop: 10 }}>
                      <CustomInputBase
                        // TT - UPDATE=CREATE CODE - 25
                        value={this.state.dataConfigCode.find(item => item.name === 'provincial').checked ? 'KHU VỰC' : ''}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        name="provincial"
                        margin="normal"
                        variant={this.state.dataConfigCode.find(item => item.name === 'provincial').checked ? 'outlined' : 'filled'}
                        fullWidth
                        label="KHU VỰC"
                        disabled
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'provincial').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => {
                          // console.log('check>>>>>', this.state.dataConfigCode)
                          this.handleCheckBoxConfigCode('provincial');
                        }}
                        color="primary"
                      />
                    </div>
                  ) : this.state.dataConfigCode.find(item => item.name === 'moduleType').value === 2 ? (
                    <div className={classes.checkboxGroup} style={{ marginTop: 10 }}>
                      <CustomInputBase
                        // TT - UPDATE=CREATE CODE - 25
                        value={''}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        name="productType"
                        margin="normal"
                        variant={this.state.dataConfigCode.find(item => item.name === 'productType').checked ? 'outlined' : 'filled'}
                        fullWidth
                        label="LOẠI SẢN PHẨM"
                        disabled
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'productType').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => {
                          // console.log('check>>>>>', this.state.dataConfigCode)
                          this.handleCheckBoxConfigCode('productType');
                        }}
                        color="primary"
                      />
                    </div>
                  ) : (
                    <div className={classes.checkboxGroup} style={{ marginTop: 10 }}>
                      <CustomInputBase
                        // TT - UPDATE=CREATE CODE - 25
                        value={this.state.dataConfigCode.find(item => item.name === 'intermediate').value}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        name="intermediate"
                        margin="normal"
                        variant={this.state.dataConfigCode.find(item => item.name === 'intermediate').checked ? 'outlined' : 'filled'}
                        fullWidth
                        label="TRUNG TỐ"
                        disabled={!this.state.dataConfigCode.find(item => item.name === 'intermediate').checked}
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'intermediate').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => {
                          // console.log('check>>>>>', this.state.dataConfigCode)
                          this.handleCheckBoxConfigCode('intermediate');
                        }}
                        color="primary"
                      />
                    </div>
                  )}

                  <div className={classes.checkboxGroup} style={{ marginTop: 10 }}>
                    <CustomInputBase
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'suffixes').value}
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      margin="normal"
                      name="suffixes"
                      fullWidth
                      variant={this.state.dataConfigCode.find(item => item.name === 'suffixes').checked ? 'outlined' : 'filled'}
                      label="HẬU TỐ"
                      disabled={!this.state.dataConfigCode.find(item => item.name === 'suffixes').checked}
                    />
                    <Checkbox
                      checked={this.state.dataConfigCode.find(item => item.name === 'suffixes').checked}
                      // TT - UPDATE=CREATE CODE - 1
                      onClick={() => this.handleCheckBoxConfigCode('suffixes')}
                      color="primary"
                    />
                  </div>
                  {/* NICKNAME */}
                  {this.state.dataConfigCode.find(item => item.name === 'moduleType').value !== 4 && (
                    <div className={classes.checkboxGroup} style={{ marginTop: 10 }}>
                      <CustomInputBase
                        // TT - UPDATE=CREATE CODE - 25
                        value={this.state.dataConfigCode.find(item => item.name === 'nickname').value ? 'BIET DANH' : ''}
                        // TT - UPDATE=CREATE CODE - 4
                        onChange={this.handleChangeInputForConfigCode}
                        margin="normal"
                        name="nickname"
                        variant="filled"
                        fullWidth
                        label="BIỆT DANH"
                        disabled
                      />
                      <Checkbox
                        checked={this.state.dataConfigCode.find(item => item.name === 'nickname').checked}
                        // TT - UPDATE=CREATE CODE - 1
                        onClick={() => this.handleCheckBoxConfigCode('nickname')}
                        color="primary"
                      />
                    </div>
                  )}

                  <InputLabel style={{ fontSize: 12, marginTop: 20, display: 'block', color: '#000' }}>KÍ TỰ NGẮT</InputLabel>
                  <div className={classes.exampleCodeGroup} style={{ marginTop: 10 }}>
                    <Select
                      className={classes.textField}
                      style={{ 'margin-left': 0, width: '100%' }}
                      // TT - UPDATE=CREATE CODE - 25
                      value={this.state.dataConfigCode.find(item => item.name === 'breakCharacter').value}
                      name="breakCharacter"
                      // TT - UPDATE=CREATE CODE - 4
                      onChange={this.handleChangeInputForConfigCode}
                      input={<OutlinedInput labelWidth={0} id="select-language" />}
                    >
                      <MenuItem value={1}>/</MenuItem>
                      <MenuItem value={2}>-</MenuItem>
                    </Select>
                    <CustomInputBase
                      style={{ margin: 0 }}
                      disabled
                      value={this.state.codeExample}
                      margin="normal"
                      variant="filled"
                      fullWidth
                      label="ĐỊNH DẠNG MÃ"
                    />
                  </div>
                  <div className={classes.groupBtnForAction}>
                    {/* // TT - UPDATE=CREATE CODE - 8 - SUBMIT - SEND DATA */}
                    <Button variant="contained" color="primary" onClick={this.onSubmitSaveConfigCode}>
                      Lưu
                    </Button>
                  </div>
                </Collapse>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item md={12} style={{ marginTop: 20 }} spacing={24}>
          {
            showBtn ? <>
              <Button
                color="primary"
                onClick={() => this.handleConvertFile(API_SQL_IN, 'incoming')}
                variant="contained"
              >incoming</Button>
              <Button
                color="primary"
                onClick={() => this.handleConvertFile(API_SQL_OUT, 'outgoing')}
                style={{ marginLeft: 20 }}
                variant="contained" >
                outgoing</Button></>
              : <>
                <CircularProgress color="secondary" />
              </>
          }
        </Grid> */}
      </div>
    );
  }

  onSubmit = () => {
    let {
      avatar,
      companyName,
      nameDisplay,
      website,
      email,
      dateFormat,
      timeFormat,
      startDay,
      timeStart,
      avatarURL,
      timeEnd,
      daysInWeek,
      language,
      holiday,
      mailServer,
      serviceServer,
      passServer,
      smsBrandname,
      smsAccount,
      smsPass,
      facebook,
      bankAccount,
      userAfkTime,
      subordinateUnit,
      hostUnit,
    } = this.state;
    const workDay = [];
    daysInWeek.forEach(item => {
      if (item === 'Chủ nhật') {
        workDay.push('1');
      } else {
        workDay.push(item[item.length - 1]);
      }
    });
    if (!userAfkTime) {
      return this.props.onChangeSnackbar && this.props.onChangeSnackbar({ variant: 'error', message: 'Thời gian tự động đăng xuất không hợp lệ!', status: true });
    }
    const firstDayOfTheWeek = startDay + 1;
    const restDay = holiday.split(',').map(item => item.trim());
    const rex = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (companyName === '' || nameDisplay === '') {
      if (companyName === '') {
        this.setState({ errorCompanyName: true });
      }
      if (nameDisplay === '') {
        this.setState({ errorTitleName: true });
      }
    } else if (!rex.test(email.trim()) || email === '') {
      this.setState({ errorEmail: true });
    } else {
      userAfkTime = Number(userAfkTime)
      const body = {
        firstDayOfTheWeek,
        name: companyName,
        displayName: nameDisplay,
        website,
        email,
        avatar,
        avatarURL,
        language,
        holidays: restDay,
        workingDay: workDay,
        workingTime: {
          start: timeStart,
          end: timeEnd,
        },
        timeFormat,
        dateFormat,
        mailServer,
        serviceServer,
        passServer,
        smsBrandname,
        smsAccount,
        smsPass,
        facebook,
        bankAccount,
        userAfkTime,
        subordinateUnit,
        hostUnit
      };
      this.setState({ disableButton: true })
      this.props.onUpdate(body);
      // setTimeout(() => {
      //   this.setState({ disableButton: false })
      // }, 2000)
    }
  };
  // componentDidUpdate() {
  //   const { systemConfigPage } = this.props
  //   if (systemConfigPage !== undefined && systemConfigPage.successUpdate === false && systemConfigPage.error === true)
  //     this.setState({ disableButton: false })

  // }
  onSubmitSaveConfigCode = () => {
    const { dataConfigCode } = this.state;

    const body = dataConfigCode.reduce((map, obj) => {
      if (obj.checked === true && obj.value) {
        map[obj.name] = obj.value;
      }
      return map;
    }, {});
    this.props.onCreateConfigCode(body);
  };

  onSelectImg = e => {
    const urlAvt = URL.createObjectURL(e.target.files[0]);
    this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] }); // avatar: e.target.files[0]
  };

  handleChangeInput = e => {
    if (e.target.name === 'email' || e.target.name === 'nameDisplay' || e.target.name === 'companyName') {
      if (e.target.name === 'email') {
        this.setState({ errorEmail: false });
      }
      if (e.target.name === 'nameDisplay') {
        this.setState({ errorTitleName: false });
      }
      if (e.target.name === 'companyName') {
        this.setState({ errorCompanyName: false });
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };
}

SystemConfigPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

// TT - UPDATE=CREATE CODE - 19
const mapStateToProps = createStructuredSelector({
  systemConfigPage: makeSelectSystemConfigPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onUpdate: body => {
      dispatch(updateSysConfAct(body));
    },
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
    // TT
    // TT - UPDATE=CREATE CODE - 11
    onCreateConfigCode: body => {
      dispatch(createConfigCodeAct(body));
    },
    onGetConfigCode: body => {
      dispatch(getConfigCodeAct(body));
    },
    onGetConf: () => {
      dispatch(getSysConfAct());
    },
    onReset: () => {
      dispatch(resetNoti());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'systemConfigPage', reducer });
const withSaga = injectSaga({ key: 'systemConfigPage', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(SystemConfigPage);
