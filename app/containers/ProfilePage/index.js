/**
 *
 * ProfilePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Link, NavLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { Paper, FormControl, Button } from '@material-ui/core';
import { Breadcrumbs } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectProfilePage from './selectors';
// import avatarA from '../../images/avatar.png';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { convertDatetimeToDate } from '../../utils/common';
import { getProAct, getData } from './actions';

/* eslint-disable react/prefer-stateless-function */
export class ProfilePage extends React.Component {
  state = {
    avatar: '',
    code: '', // mã nhân viên
    name: '', // tên
    gender: 0, // giới tính
    email: '', // email
    phoneNumber: '', // số điện thoại
    beginWork: '', // thời gian
    dob: '', // ngày sinh
    address: '', // địa trỉ
    identityCardNumber: '', // cmt
    positions: '', // cấp bậc
    organizationUnit: '', // đơn vị tổ chức
    note: '', // ghi chú
    // roles: '',
    // errorName: false,
    // errorCode: false,
    // errorEmail: false,
  };

  componentWillMount() {
    this.props.onGetProfile();
    this.props.onGetOrganizationUnit();
  }

  componentWillReceiveProps(props) {
    const { profilePage } = props;
    if (props !== this.props) {
      if (profilePage.proPage) {
        this.state.name = profilePage.proPage.name;
        this.state.avatar = profilePage.proPage.avatar;
        this.state.address = profilePage.proPage.address;
        this.state.note = profilePage.proPage.note;
        this.state.code = profilePage.proPage.code;
        this.state.email = profilePage.proPage.email;
        this.state.positions = profilePage.proPage.positions;
        this.state.beginWork = convertDatetimeToDate(profilePage.proPage.beginWork);
        this.state.gender = profilePage.proPage.gender;
        this.state.phoneNumber = profilePage.proPage.phoneNumber;
        // this.state.dob = profilePage.proPage.dob;
        this.state.dob = convertDatetimeToDate(profilePage.proPage.dob);
        this.state.identityCardNumber = profilePage.proPage.identityCardNumber;
      }
      this.state.organizationUnit = profilePage.organizationUnit ? profilePage.organizationUnit.name : '';
    }
  }

  render() {
    const { classes } = this.props;
    const {
      avatar,
      code,
      name,
      gender,
      email,
      phoneNumber,
      beginWork,
      dob,
      address,
      identityCardNumber,
      positions,
      organizationUnit,
      note,
    } = this.state;

    return (
      <div className={classes.root}>
        <Helmet>
          <title>ProfilePage</title>
          <meta name="description" content="Description of ProfilePage" />
        </Helmet>
        <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Admin
            </Link>
            <Typography color="textPrimary">Thông tin cá nhân</Typography>
          </Breadcrumbs>
        </Paper>
        <Paper style={{ width: '1000px', margin: 'auto' }} className={classes.bgImage}>
          <Grid container>
            <Grid style={{ height: 200 }} item md={4} container justify="center">
              <Avatar style={{ width: 250, height: 250, marginTop: '100px' }} src={avatar} className={classes.avatar} srcSet={avatar} />
              <span className={classes.spanAva} />
            </Grid>
            <Grid item md={8} container center>
              <Grid container md={12} justify="center" style={{ paddingTop: '30px' }}>
                <Grid container md={12}>
                  <Paper style={{ width: '80%', background: '#169BDD', margin: 'auto', marginBottom: '30px' }}>
                    <Typography className={classes.textTitle} style={{ color: 'white' }}>
                      Thông tin nhân viên
                    </Typography>
                  </Paper>
                </Grid>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Mã Cán bộ:{' '}
                    <span name="code" className={classes.textContent} style={{ color: '#2AA4E0' }}>
                      {code}
                    </span>
                  </Typography>
                </FormControl>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Họ và tên:{' '}
                    <span value={this.state.name} name="name" style={{ fontSize: '23px' }}>
                      {name}
                    </span>
                  </Typography>
                </FormControl>
                <hr width="500px" style={{ fontWeight: '500' }} />
                <Grid justify="flex-start" item md={6} style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                  <FormControl className={classes.textField1} error>
                    <Typography style={{ fontWeight: 400 }}>
                      Giới tính:{' '}
                      <span value={this.state.gender} name="gender" className={classes.textContent}>
                        {gender === 'male' ? 'Nam' : 'Nữ'}
                      </span>
                    </Typography>
                    {/* <Typography value={this.state.gender} name="gender" className={classes.textContent}>
                        {gender === 'male' ? 'Nam' : 'Nữ'}
                      </Typography> */}
                  </FormControl>
                  <FormControl className={classes.textField1} error>
                    <Typography style={{ fontWeight: 400 }}>
                      Email:{' '}
                      <span value={this.state.email} name="email" className={classes.textContent}>
                        {email}
                      </span>{' '}
                    </Typography>
                    {/* <Typography value={this.state.email} name="email" className={classes.textContent}>
                        {email}
                      </Typography> */}
                  </FormControl>
                  <FormControl className={classes.textField1} error>
                    <Typography style={{ fontWeight: 400 }}>
                      Số điện thoại:{' '}
                      <span value={this.state.mobileNumber} name="mobileNumber" className={classes.textContent}>
                        {phoneNumber}
                      </span>
                    </Typography>
                    {/* <Typography value={this.state.mobileNumber} name="mobileNumber" className={classes.textContent}>
                        {phoneNumber}
                      </Typography> */}
                  </FormControl>
                  <FormControl className={classes.textField1} error>
                    <Typography style={{ fontWeight: 400 }}>
                      Thời gian vào:{' '}
                      <span value={this.state.timeToJoin} name="timeToJoin" className={classes.textContent}>
                        {beginWork}
                      </span>
                    </Typography>
                    {/* <Typography value={this.state.timeToJoin} name="timeToJoin" className={classes.textContent}>
                        {beginWork}
                      </Typography> */}
                  </FormControl>
                  <FormControl className={classes.textField1} error>
                    <Typography style={{ fontWeight: 400 }}>
                      Cấp bậc:{' '}
                      <span value={this.state.positions} name="positions" className={classes.textContent}>
                        {positions}
                      </span>{' '}
                    </Typography>
                    {/* <Typography value={this.state.positions} name="positions" className={classes.textContent}>
                        {positions}
                      </Typography> */}
                  </FormControl>
                </Grid>
                <Grid container justify="flex-end" item md={6} style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                  <FormControl className={classes.textField1} error>
                    <Typography style={{ fontWeight: 400 }}>
                      Ngày sinh:
                      <span value={this.state.dob} name="dob" className={classes.textContent}>
                        {dob}
                      </span>
                    </Typography>
                    {/* <Typography value={this.state.dob} name="dob" className={classes.textContent}>
                        {dob}
                      </Typography> */}
                  </FormControl>
                  <FormControl className={classes.textField1} error>
                    <Typography style={{ fontWeight: 400 }}>
                      Số CMND/CCCD:{' '}
                      <span value={this.state.IDcard} name="IDcard" className={classes.textContent}>
                        {identityCardNumber}
                      </span>
                    </Typography>
                    {/* <Typography value={this.state.IDcard} name="IDcard" className={classes.textContent}>
                        {identityCardNumber}
                      </Typography> */}
                  </FormControl>
                  <FormControl className={classes.textField1} error>
                    <Typography style={{ fontWeight: 400 }}>
                      Địa chỉ:{' '}
                      <span value={this.state.address} name="address" className={classes.textContent}>
                        {address}
                      </span>{' '}
                    </Typography>
                    {/* <Typography value={this.state.address} name="address" className={classes.textContent}>
                        {address}
                      </Typography> */}
                  </FormControl>
                  <FormControl className={classes.textField1} error>
                    <Typography style={{ fontWeight: 400 }}>
                      Đơn vị:{' '}
                      <span value={this.state.organizationUnit} name="organizationUnit" className={classes.textContent}>
                        {organizationUnit}
                      </span>{' '}
                    </Typography>
                    {/* <Typography value={this.state.organizationUnit} name="organizationUnit" className={classes.textContent}>
                        {organizationUnit}
                      </Typography> */}
                  </FormControl>
                  <FormControl className={classes.textField1} error>
                    <Typography style={{ fontWeight: 400 }}>
                      Ghi chú :{' '}
                      <span value={this.state.note} name="note" className={classes.textContent}>
                        {note}
                      </span>
                    </Typography>
                    {/* <Typography value={this.state.note} name="note" className={classes.textContent}>
                        {note}
                      </Typography> */}
                  </FormControl>
                  <NavLink to="/admin/editProfile">
                    <Button
                      variant="outlined"
                      style={{ background: '#2196F3', marginRight: '50px', marginTop: '50px', color: 'white' }}
                      className={classes.button}
                    >
                      Cập nhật
                    </Button>
                  </NavLink>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  onGetProfile: PropTypes.func.isRequired,
  onGetOrganizationUnit: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  profilePage: makeSelectProfilePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetProfile: () => dispatch(getProAct()),
    onGetOrganizationUnit: () => dispatch(getData()),
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'profilePage', reducer });
const withSaga = injectSaga({ key: 'profilePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(ProfilePage);
