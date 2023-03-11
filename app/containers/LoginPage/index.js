/**
 *
 * LoginPage
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import clsx from 'clsx';

import { InputAdornment, Button, withStyles, FormHelperText, CircularProgress } from '@material-ui/core';
// material-ui components

// material-ui-icons
import { Email, Lock } from '@material-ui/icons';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import LoginCard from 'components/Cards/LoginCard';
import CustomInput from 'components/CustomInput/CustomInput';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import loginPageStyle from 'assets/jss/material-dashboard-pro-react/views/loginPageStyle';
import makeSelectLoginPage from './selectors';
import reducer from './reducer';
import axios from 'axios';
import saga from './saga';
import { loginAction, resetNoti, setUSBToken } from './actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import { enableSso, ssoHost } from '../../variable';
import { BASE_URL } from '../../config/urlConfig';
import { sign_file, sign_pdf, getCertinfo, licenseRequest } from 'utils/vgca'
import { auth } from 'utils/vgca';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { getUser } from '../../utils/api/oauth';

/* eslint-disable react/prefer-stateless-function */
export class LoginPage extends React.Component {
  state = {
    username: '',
    password: '',
    usernameEmpty: false,
    passwordEmpty: false,
    loginWrong: false,
    clickLogin: false,
    loading: false,
    errorMess: null,
  };

  handleSubmit = e => {
    if (enableSso && ssoHost) {
      e.preventDefault && e.preventDefault();
      let { username, password } = e.token ? e : this.state;
      username = username.trim();
      password = password.trim();
      this.setState({ clickLogin: true });
      if (username === '' || password === '') {
        if (username === '') this.setState({ usernameEmpty: true });
        if (password === '') this.setState({ passwordEmpty: true });
      } else {
        const body = {
          username,
          password,
          ssoHost
        }
        fetch(`${BASE_URL}/oauth/get-token-from-sso`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(res => res.json())
          .then(res => {
            const { authToken, lifetime, status, message } = res;
            if (!status) {
              this.setState({ errorMess: "Lỗi đăng nhập!" })
            } else {
              document.cookie = "ZM_AUTH_TOKEN=" + `${authToken}`;
              const urlParams = new URLSearchParams(window.location.search);
              const redirect = urlParams.get('redirect');
              //console.log('redirect', redirect);
              if (redirect) {
                window.location.href = redirect;
              } else {
                e.token && localStorage.setItem('usbToken', (e.token))
                this.props.onSetUSBToken(e.token)
                this.props.onLogin({ username, password, enableSso, ssoHost, authToken });
                this.setState({ loading: true });
              }
            }
          }).catch(err => {
            this.setState({ errorMess: err })
          })
      }
    } else {
      e.preventDefault && e.preventDefault();
      let { username, password } = e.token ? e : this.state;
      username = username.trim();
      password = password.trim();
      this.setState({ clickLogin: true });
      if (username === '' || password === '') {
        if (username === '') this.setState({ usernameEmpty: true });
        if (password === '') this.setState({ passwordEmpty: true });
      } else {
        e.token && localStorage.setItem('usbToken', (e.token))
        this.props.onSetUSBToken(e.token)
        this.props.onLogin({ username, password });
        this.setState({ loading: true });
      }
    }
  };

  handleSubmitByEtoken = (e, id) => {
    this.handleSubmit({ ...e, token: id })
  }

  onKeyDown = e => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (e.key === 'Enter') {
      if (enableSso && ssoHost) {
        e.preventDefault && e.preventDefault();
        let { username, password } = e.token ? e : this.state;
        username = username.trim();
        password = password.trim();
        this.setState({ clickLogin: true });
        if (username === '' || password === '') {
          if (username === '') this.setState({ usernameEmpty: true });
          if (password === '') this.setState({ passwordEmpty: true });
        } else {
          const body = {
            username,
            password,
            ssoHost
          }
          fetch(`${BASE_URL}/oauth/get-token-from-sso`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(res => res.json())
            .then(res => {
              const { authToken, lifetime, status, message } = res;
              if (!status) {
                this.setState({ errorMess: "Lỗi đăng nhập!" })
              } else {
                document.cookie = "ZM_AUTH_TOKEN=" + `${authToken}`;
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                // console.log('redirect', redirect);
                if (redirect) {
                  window.location.href = redirect;
                } else {
                  e.token && localStorage.setItem('usbToken', (e.token))
                  this.props.onSetUSBToken(e.token)
                  this.props.onLogin({ username, password, enableSso, ssoHost, authToken });
                  this.setState({ loading: true });
                }
              }
            }).catch(err => {
              this.setState({ errorMess: err })
            })
        }
      } else {
        e.preventDefault && e.preventDefault();
        let { username, password } = e.token ? e : this.state;
        username = username.trim();
        password = password.trim();
        this.setState({ clickLogin: true });
        if (username === '' || password === '') {
          if (username === '') this.setState({ usernameEmpty: true });
          if (password === '') this.setState({ passwordEmpty: true });
        } else {
          e.token && localStorage.setItem('usbToken', (e.token))
          this.props.onSetUSBToken(e.token)
          this.props.onLogin({ username, password });
          this.setState({ loading: true });
        }
      }
    }
    // if (event.key === 'Enter') {
    //   event.preventDefault();
    //   let { username, password } = this.state;
    //   username = username.trim();
    //   password = password.trim();
    //   this.setState({ clickLogin: true });
    //   if (username === '' || password === '') {
    //     if (username === '') this.setState({ usernameEmpty: true });
    //     if (password === '') this.setState({ passwordEmpty: true });
    //   } else this.props.onLogin({ username, password });
    // }
  };

  componentWillMount() {
    const tk = localStorage.getItem('token');
    if (typeof tk === 'string') {
      this.props.authentication(true);
      this.props.history.push('/');
      // console.log(this.props);
    }
  }

  componentWillUpdate(props) {
    const { history } = props;
    if (this.props !== props) {
      if (props.loginPage.success && localStorage.getItem('token')) {
        this.props.authentication(true);
        history.push('/');
      } else if (props.loginPage.error) {
        this.state.loginWrong = true;
        this.state.clickLogin = false;
        this.state.loading = false;
      }
    }
  }

  componentDidUpdate() {

    this.props.onResetNoti();
  }

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    const buttonClassname = clsx({
      [classes.buttonSuccess]: false,
    });
    // const loading = loginPage.loading;
    return (
      <div className={classes.content}>
        {loading && <LoadingIndicator />}
        <div className={classes.container}>
          <GridContainer justify="center">
            <ItemGrid xs={12} sm={6} md={4}>
              <form onSubmit={this.handleSubmit}>
                {/* eslint-disable */}
                <LoginCard
                  customCardClass={classes[this.state.cardAnimaton]}
                  headerColor="blue"
                  cardTitle="Đăng nhập"
                  // cardSubtitle="Or Be Classical"
                  footerAlign="center"
                  footer={
                    // <Button onClick={this.handleSubmit} style={{ marginTop: 20 }} variant="contained" color="primary" wd size="lg">
                    //   Đăng nhập
                    // </Button>
                    <div className={classes.wrapper}>
                      <Button
                        onClick={this.handleSubmit}
                        onSubmit={this.handleSubmit}
                        variant="outlined"
                        color="primary"
                        className={buttonClassname}
                        disabled={loading}
                        style={{ width: 300 }}
                      >
                        Đăng nhập
                      </Button>
                      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                      <br />
                      <ETokenLogin onChangeSnackbar={this.props.onChangeSnackbar} login={this.handleSubmitByEtoken} disabled={loading} />
                    </div>
                  }
                  // socials={['fab fa-facebook-square', 'fab fa-twitter', 'fab fa-google-plus'].map((prop, key) => (
                  //   <Button justicon key={key + 1} customClass={classes.customButtonClass}>
                  //     <i className={prop} />
                  //   </Button>
                  // ))}
                  content={
                    <div>
                      <CustomInput
                        labelText="Tên đăng nhập"
                        id="name"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          value: this.state.email,

                          name: 'username',
                          onChange: e => this.handleChange(e),
                          onKeyDown: this.onKeyDown,
                        }}
                      />
                      {this.state.usernameEmpty || (this.state.usernameEmpty && this.state.passwordEmpty) ? (
                        <FormHelperText style={{ marginTop: -5, color: 'red' }}>Vui lòng nhập tên đăng nhập!</FormHelperText>
                      ) : null}
                      <CustomInput
                        labelText="Mật khẩu"
                        id="password"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Lock className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          value: this.state.password,
                          name: 'password',
                          type: 'password',
                          onChange: e => this.handleChange(e),
                          onKeyDown: this.onKeyDown,
                        }}
                      />
                      {this.state.passwordEmpty || (this.state.usernameEmpty && this.state.passwordEmpty) ? (
                        <FormHelperText style={{ marginTop: -5, color: 'red' }}>Vui lòng nhập mật khẩu!</FormHelperText>
                      ) : null}
                      {this.state.loginWrong ? (
                        <FormHelperText style={{ textAlign: 'center', fontSize: 14, marginTop: 10, marginBottom: 10, color: 'red' }}>
                          Tên đăng nhập hoặc mật khẩu không đúng!
                        </FormHelperText>
                      ) : null}
                      {this.state.errorMess ? (
                        <FormHelperText style={{ textAlign: 'center', fontSize: 14, marginTop: 10, marginBottom: 10, color: 'red' }}>
                          {`${this.state.errorMess}!`}
                        </FormHelperText>
                      ) : null}
                    </div>
                  }
                />
                {/* eslint-enable */}
              </form>
            </ItemGrid>
          </GridContainer>
        </div>
      </div>
    );
  }

  handleChange = e => {
    if (this.state.passwordEmpty || this.state.usernameEmpty || this.state.loginWrong || this.state.clickLogin) {
      if (e.target.name === 'username') {
        this.setState({ usernameEmpty: false, clickLogin: false, loginWrong: false });
      }
      if (e.target.name === 'password') {
        this.setState({ passwordEmpty: false, clickLogin: false, loginWrong: false });
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };
}

LoginPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  loginPage: PropTypes.object.isRequired,
  onLogin: PropTypes.func,
  history: PropTypes.object.isRequired,
  authentication: PropTypes.func.isRequired,
  onResetNoti: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onLogin: body => dispatch(loginAction(body)),
    onResetNoti: () => dispatch(resetNoti()),
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
    onSetUSBToken: obj => dispatch(setUSBToken(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'loginPage', reducer });
const withSaga = injectSaga({ key: 'loginPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(loginPageStyle),
)(LoginPage);










const ETokenLogin = (props) => {
  const { onChangeSnackbar, login, disabled } = props

  const [data, setData] = useState()
  const [loading, setLoading] = useState()

  const onLogin = () => {
    setLoading(true)
    getCertinfo(async e => {
      const { Email, Base64Data } = e
      const res = await getUser({
        emailToken: Email,
        isActiveToken: true,
      })
      // vgca_license_request()
      // console.log('auth', await auth(Email))
      if (res && login) login(res, Base64Data)
      setLoading(false)
    }, () => {
      onChangeSnackbar
      //  && onChangeSnackbar({ variant: 'danger', message: 'Có lỗi xảy ra', status: true })

      setLoading(false)
    })
  }

  return <>
    <hr style={{ margin: 10, height: 5 }} />
    <Button
      style={{ width: 300 }}
      onClick={onLogin}
      variant="outlined"
      color="primary"
      disabled={disabled || loading}
    >
      Đăng nhập bằng USB Token
    </Button>

    {/* <a
      style={{ lineHeight: 3 }}
      disabled={disabled || loading}
    >
      Đăng nhập bằng USB Token
    </a> */}
  </>
}