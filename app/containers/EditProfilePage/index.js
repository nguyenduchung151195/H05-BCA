/**
 *
 * EditProfilePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { compose } from 'redux';
import { Paper, FormControl, FormHelperText, Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import avatarDefault from '../../images/default-avatar.png';
import CameraAlt from '@material-ui/icons/CameraAlt';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withSnackbar } from 'notistack';
import makeSelectEditProfilePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { convertDatetimeToDate } from '../../utils/common';
import { updateProAct, getProAct, resetNoti, changeMyPassAct, repairViewConfigAct } from './actions';
import CustomDatePicker from 'components/CustomDatePicker';
import moment from 'moment';
import _ from 'lodash';
import { checkValidEmail } from '../../utils/functions';
import { makeSelectProfile } from '../Dashboard/selectors';
import { testAvatar, checkAvatar } from 'utils/common';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { clientId } from '../../variable';

/* eslint-disable react/prefer-stateless-function */
export class EditProfilePage extends React.Component {
  state = {
    name: '',
    gender: 'male',
    email: '',
    phoneNumber: '',
    avatar: '',
    avatarURL: '',
    dob: new Date(),
    address: '',
    identityCardNumber: '',
    positions: '',
    // organizationUnit: '',
    note: '',
    // roles: '',
    errorName: false,
    errorCode: false,
    errorEmail: false,
    openDialog: false,
    lastPassword: '',
    newPassword: '',
    reNewPassword: '',
    lastPasswordError: {
      error: false,
      content: '',
    },
    newPasswordError: {
      error: false,
      content: '',
    },
    dialogRepair: false,
    errReNewPassword: '',
    errNewPassWord: '',
  };

  componentWillMount() {
    this.props.onGetPro();
  }

  componentWillReceiveProps(props) {
    const { editProfilePage } = props;
    if (editProfilePage.proPage) {
      this.state.name = editProfilePage.proPage.name;
      // this.state.avatar = editProfilePage.proPage.avatar ? `${editProfilePage.proPage.avatar}?allowDefault=true` : avatarDefault;
      this.state.avatar = editProfilePage.proPage.avatar;
      this.state.address = editProfilePage.proPage.address;
      this.state.note = editProfilePage.proPage.note;
      this.state.code = editProfilePage.proPage.code;
      this.state.email = editProfilePage.proPage.email;
      this.state.positions = editProfilePage.proPage.positions;
      this.state.gender = editProfilePage.proPage.gender;
      this.state.phoneNumber = editProfilePage.proPage.phoneNumber;
      this.state.avatarURL = editProfilePage.proPage.avatar;
      // this.state.dob = editProfilePage.proPage.dob;
      this.state.dob = editProfilePage.proPage.dob && convertDatetimeToDate(editProfilePage.proPage.dob);
      this.state.identityCardNumber = editProfilePage.proPage.identityCardNumber;
      testAvatar(editProfilePage.proPage.avatar, () => (this.state.avatar = checkAvatar(editProfilePage.proPage.avatar)), () => {});
    }
  }

  render() {
    const { classes } = this.props;
    const { avatar } = this.state;
    return (
      <div className={classes.root}>
        <Helmet>
          <title>Thông tin cá nhân</title>
          <meta name="description" content="Description of EditProfilePage" />
        </Helmet>
        <Dialog
          open={this.state.openDialog}
          onClose={this.onOpenDialogChangePass}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Đổi mật khẩu</DialogTitle>
          <DialogContent style={{ width: '500px' }}>
            <div style={{ display: 'none' }}>
              <CustomInputBase
                margin="normal"
                label="Mật khẩu hiện tại"
                variant="outlined"
                name="userName"
                style={{ width: '100%' }}
                value={this.state.code}
              />
            </div>
            <CustomInputBase
              margin="normal"
              label="Mật khẩu hiện tại"
              variant="outlined"
              name="lastPassword"
              style={{ width: '100%' }}
              value={this.state.lastPassword}
              onChange={this.handleChangeInput}
              InputLabelProps={{
                shrink: true,
              }}
              type="password"
              className={'CustomIconRequired'}
            />
            <FormHelperText style={this.state.lastPasswordError.error ? { color: 'red', width: '100%' } : { color: 'red', display: 'none' }}>
              {this.state.lastPasswordError.content}
            </FormHelperText>
            {console.log()}
            <CustomInputBase
              label="Mật khẩu mới"
              variant="outlined"
              name="newPassword"
              style={{ width: '100%' }}
              value={this.state.newPassword}
              error={this.state.errNewPassWord}
              helperText={this.state.errNewPassWord}
              onChange={this.handleChangeInput}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              type="password"
              className={'CustomIconRequired'}
            />
            <FormHelperText style={this.state.newPasswordError.error ? { color: 'red', width: '100%' } : { color: 'red', display: 'none' }}>
              {this.state.newPasswordError.content}
            </FormHelperText>
            <CustomInputBase
              id="reNewPassword"
              variant="outlined"
              label="Nhập lại mật khẩu mới "
              onChange={this.handleChangeInput}
              style={{ width: '100%' }}
              value={this.state.reNewPassword}
              error={this.state.errReNewPassword}
              helperText={this.state.errReNewPassword}
              name="reNewPassword"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              type="password"
              className={'CustomIconRequired'}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleChangePassword} variant="contained">
              LƯU
            </Button>
            <Button onClick={this.onOpenDialogChangePass} color="secondary" variant="contained" autoFocus>
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.dialogRepair}
          onClose={this.onOpenDialogRepair}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Khôi phục cấu hình</DialogTitle>
          <DialogContent style={{ width: '500px' }}>
            <Typography>Đồng chí có chắc chắn muốn khôi phục cấu hình? </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleRepairViewconfig} variant="contained">
              LƯU
            </Button>
            <Button variant="contained" onClick={this.props.onOpenDialogRepair} color="secondary" autoFocus>
              hủy
            </Button>
          </DialogActions>
        </Dialog>
        {/* <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Admin
            </Link>
            <Typography color="textPrimary">Cập nhật thông tin</Typography>
          </Breadcrumbs>
        </Paper> */}
        <Grid container>
          <Grid item md={8}>
            <Paper>
              <ExpansionPanelSummary>
                <Typography className={classes.heading}>Thông tin cơ bản</Typography>
                {/* <Typography className={classes.secondaryHeading}>Các trường có dấu * là bắt buộc</Typography> */}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container spacing={8}>
                  <Grid item md={6}>
                    <FormControl className={classes.textField} error>
                      <CustomInputBase
                        id="code"
                        disabled
                        variant="outlined"
                        label="Mã cán bộ (*) : "
                        className={'CustomRequiredLetter'}
                        onChange={this.handleChangeInput}
                        type="text"
                        // className={classes.textField}
                        value={this.state.code}
                        error={this.state.errorName}
                        name="code"
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      {this.state.errorCode ? (
                        <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                          Mã Cán bộ không được để trống
                        </FormHelperText>
                      ) : (
                        ''
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item md={6}>
                    <FormControl className={classes.textField} style={{ padding: 0 }} error>
                      <CustomInputBase
                        autoFocus
                        variant="outlined"
                        id="name"
                        label="Họ và tên (*): "
                        className={'CustomRequiredLetter'}
                        value={this.state.name}
                        error={this.state.errorName}
                        name="name"
                        onChange={this.handleChangeInput}
                        type="text"
                        // className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        style={{ width: '100%' }}
                        disabled
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6}>
                    <CustomInputBase
                      variant="outlined"
                      id="standard-select-currency"
                      select
                      label="Giới tính"
                      name="gender"
                      // className={classes.textField}
                      value={this.state.gender}
                      onChange={this.handleChangeInput}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      // helperText="Please select your currency"
                      margin="normal"
                      className={'CustomIconRequired'}
                    >
                      <MenuItem key="0" value="male">
                        Nam
                      </MenuItem>
                      <MenuItem key="1" value="female">
                        Nữ
                      </MenuItem>
                    </CustomInputBase>
                  </Grid>
                  <Grid item md={6}>
                    <CustomDatePicker
                      allowRemove
                      label="Ngày sinh: "
                      value={this.state.dob ? moment(this.state.dob, 'YYYY-MM-DD') : null}
                      name="dob"
                      onChange={e => {
                        //  console.log('eeê', e);
                        this.handleChangeInput({ target: { name: 'dob', value: e && moment(e).format('YYYY-MM-DD') } });
                      }}
                      className={'CustomIconRequired'}
                      required={false}
                    />

                    {/* <CustomInputBase
                      variant="outlined"
                      id="dob"
                      label="Ngày sinh: "
                      name="dob"
                      value={this.state.dob}
                      onChange={this.handleChangeInput}
                      type="date"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    /> */}
                  </Grid>
                  <Grid item md={6}>
                    <FormControl className={classes.textField1} style={{ padding: 0 }} error>
                      <CustomInputBase
                        variant="outlined"
                        id="email"
                        label="Email : "
                        // inputRef={input => (this.email = input)}
                        type="text"
                        name="email"
                        onChange={this.handleChangeInput}
                        value={this.state.email}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        error={this.state.errorEmail}
                        className={'CustomIconRequired'}
                      />

                      {this.state.errorEmail ? (
                        <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                          Email không hợp lệ
                        </FormHelperText>
                      ) : (
                        ''
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item md={6}>
                    <CustomInputBase
                      variant="outlined"
                      id="cmtnd"
                      label="Số CMND/CCCD:"
                      name="identityCardNumber"
                      // value={this.state.age}
                      onChange={this.handleChangeInput}
                      // type="number"
                      className={'CustomIconRequired'}
                      value={this.state.identityCardNumber}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item md={6}>
                    <CustomInputBase
                      variant="outlined"
                      id="phoneNumber"
                      label="Số điện thoại: "
                      value={this.state.phoneNumber}
                      name="phoneNumber"
                      onChange={this.handleChangeInput}
                      // type="number"
                      className={'CustomIconRequired'}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item md={6}>
                    <CustomInputBase
                      variant="outlined"
                      id="address"
                      label="Địa chỉ liên hệ: "
                      value={this.state.address}
                      name="address"
                      onChange={this.handleChangeInput}
                      type="text"
                      className={'CustomIconRequired'}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item md={6}>
                    <CustomInputBase
                      variant="outlined"
                      id="standard-select-currency"
                      disabled
                      // select
                      name="positions"
                      label="Cấp bậc:"
                      onChange={this.handleChangeInput}
                      className={'CustomIconRequired'}
                      value={this.state.positions}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      // helperText="Please select your currency"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item md={6}>
                    <CustomInputBase
                      variant="outlined"
                      id="note"
                      label="Ghi chú: "
                      value={this.state.note}
                      onChange={this.handleChangeInput}
                      name="note"
                      type="text"
                      className={'CustomIconRequired'}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </Paper>
            <Button variant="contained" color="primary" style={{ marginTop: 20 }} onClick={this.onSubmit}>
              Lưu
            </Button>
            <Button variant="contained" color="primary" style={{ marginTop: 20, marginLeft: 20 }} onClick={this.onOpenDialogChangePass}>
              Đổi mật khẩu
            </Button>
            {/* <Button variant="outlined" color="primary" style={{ marginTop: 20, marginLeft: 20 }} onClick={this.onOpenDialogRepair}>
              Khôi phục cấu hình
            </Button> */}

            <Button variant="contained" color="secondary" onClick={this.goBack} style={{ marginTop: 20, marginLeft: 20 }}>
              Hủy
            </Button>
          </Grid>
          <Grid style={{ height: 200 }} item md={4} container justify="center">
            <Avatar
              style={{ width: 300, height: 300 }}
              src={avatarDefault}
              className={classes.avatar}
              srcSet={this.state.avatarURL === 'https://g.lifetek.vn:203/api/files/5f8684e931365b51d00afec6' ? avatarDefault : this.state.avatarURL}
            />
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
              <span>Ảnh đại diện</span>
            </Grid>
            <Grid container justify="center">
              <span style={{ fontStyle: 'italic' }}>(Nhấp vào ảnh để thay đổi ảnh đại diện)</span>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }

  goBack = () => {
    this.state.user = null;
    localStorage.removeItem('user');
    this.props.history.goBack();
  };

  onOpenDialogChangePass = () => {
    const { openDialog } = this.state;
    this.setState({
      openDialog: !openDialog,
      newPassword: '',
      reNewPassword: '',
      lastPassword: '',
      errNewPassWord: '',
      errReNewPassword: '',
      newPasswordError: {
        error: false,
        content: '',
      },
      lastPasswordError: {
        error: false,
        content: '',
      },
    });
  };

  onOpenDialogRepair = () => {
    const { dialogRepair } = this.state;
    this.setState({ dialogRepair: !dialogRepair });
  };

  handleRepairViewconfig = () => {
    this.props.onRepairViewConfig();
    this.onOpenDialogRepair();
  };

  // eslint-disable-next-line consistent-return
  handleChangePassword = () => {
    const { errNewPassWord, errReNewPassword } = this.state;
    if (errNewPassWord || errReNewPassword) {
      return;
    }
    const { lastPassword, newPassword, reNewPassword } = this.state;
    if (lastPassword.length < 8) {
      return this.setState({
        lastPasswordError: {
          error: true,
          content: 'Mật khẩu tối thiểu 8 kí tự',
        },
      });
    }
    if (newPassword.length < 8) {
      return this.setState({
        newPasswordError: {
          error: true,
          content: 'Mật khẩu mới tối thiểu 8 kí tự',
        },
      });
    }
    if (newPassword !== reNewPassword) {
      return this.setState({
        newPasswordError: {
          error: true,
          content: 'Mật khẩu mới và nhập lại mật khẩu mới không trùng nhau',
        },
      });
    }
    this.props.onChangeMyPass({
      password: newPassword,
      lastPassword,
      clientId: clientId,
    });
    this.setState({ openDialog: false });
  };

  onSubmit = () => {
    const { avatar, code, name, gender, email, phoneNumber, positions, dob, avatarURL, identityCardNumber, address, note } = this.state;
    if (code === '' || name === '') {
      if (code === '') {
        this.setState({ errorCode: true });
      }
      if (name === '') {
        this.setState({ errorName: true });
      }
    } else {
      const body = {
        avatar,
        code,
        name,
        gender,
        email,
        avatarURL,
        phoneNumber,
        positions,
        dob,
        identityCardNumber,
        address,
        note,
      };
      this.props.onUpdate(body);
    }
  };

  onSelectImg = e => {
    const urlAvt = URL.createObjectURL(e.target.files[0]);
    this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] });
  };

  toNumber = (neu, old, limit = 12) => {
    const result = [...neu]
      .filter(c => '0123456789'.includes(c))
      .join('')
      .substring(0, limit);
    return result.length <= limit ? result : old;
  };

  handleChangeInput = e => {
    const { value } = e.target;

    if (e.target.name === 'identityCardNumber') e.target.value = this.toNumber(e.target.value, this.state.identityCardNumber);
    if (e.target.name === 'phoneNumber') e.target.value = this.toNumber(e.target.value, this.state.phoneNumber);

    if (e.target.name === 'name') {
      this.state.errorName = !value.trim();
    }
    if (e.target.name === 'code') {
      this.state.errorCode = !value.trim();
    }
    if (e.target.name === 'email') {
      if (checkValidEmail(value)) this.state.errorEmail = true;
      else this.state.errorEmail = false;
    }
    function checkUTF8(text) {
      // handle check string is unicode
      let utf8Text = text;
      try {
        utf8Text = decodeURIComponent(escape(value));
      } catch (e) {
        console.log(e, 'lỗi nè lêu lêu');
        utf8Text = '';
      }
      return utf8Text; // returned text is always utf-8
    }
    const name = e.target.name;
    if (name === 'newPassword') {
      const err = checkUTF8(e.target.value);
      console.log(err, name);
      if (err) this.setState({ errNewPassWord: '' });
      else this.setState({ errNewPassWord: 'Mật khẩu không được chưa ký tự unicode' });
    } else if (name === 'reNewPassword') {
      const err = checkUTF8(e.target.value);
      console.log(err, name);

      if (err) this.setState({ errReNewPassword: '' });
      else this.setState({ errReNewPassword: 'Mật khẩu không được chưa ký tự unicode' });
    }
    this.setState({ [e.target.name]: e.target.value });
  };
}

EditProfilePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  editProfilePage: makeSelectEditProfilePage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onUpdate: body => {
      dispatch(updateProAct(body));
    },
    onGetPro: () => {
      dispatch(getProAct());
    },
    onReset: () => {
      dispatch(resetNoti());
    },
    onChangeMyPass: body => {
      dispatch(changeMyPassAct(body));
    },
    onRepairViewConfig: () => {
      dispatch(repairViewConfigAct());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'editProfilePage', reducer });
const withSaga = injectSaga({ key: 'editProfilePage', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(EditProfilePage);
