/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { Component } from 'react';
import qs from 'qs';
import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
// import indexRouters from 'routes';
import history from 'utils/history';
import Pages from 'containers/Pages';
import { API_LOGIN, API_GET_TOKEN, APP_URL, API_VIEWCONFIG, UPLOAD_APP_URL } from 'config/urlConfig';
import Dashboard from '../Dashboard';
import { enableSso, ssoHost, clientId, DriveId } from '../../variable';
import axios from 'axios';
import 'assets/scss/material-dashboard-pro-react.css';
import './CustomCSSGlobal.css';
import swal from '@sweetalert/with-react';
// const action = key => (
//   <Fragment>
//     <Button
//       onClick={() => {
//         alert(`I belong to snackbar with key ${key}`);
//       }}
//     >
//       {'Alert'}
//     </Button>
//     <Button
//       onClick={() => {
//         props.closeSnackbar(key);
//       }}
//     >
//       {'Dismiss'}
//     </Button>
//   </Fragment>
// );
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      zmToken: '',
    };
  }

  handleAuthencation(user) {
    if (user === true) {
      // this.setState({
      //   auth: false,
      // });
    }
  }

  isLogin = () => this.state.auth;

  componentWillMount() {
    if (enableSso && ssoHost) {
      const dataCookies = document.cookie.split(';')
      const indexZm = Array.isArray(dataCookies) ? dataCookies.findIndex(item => item.includes('ZM_AUTH_TOKEN')) : -1;
      let zm_token
      if (indexZm !== -1) {
        zm_token = dataCookies[indexZm].slice(14, dataCookies[indexZm].length)
      }
      if (zm_token) {
        this.setState({ zmToken: zm_token })
        if (localStorage.getItem('token')) {
          this.setState({
            auth: true,
          })
        } else {
          const body = {
            username: 'aaaaa',
            password: '1223456',
            client_id: 'authServer',
            grant_type: 'password',
            scope: 'user',
            ssoToken: zm_token,
            ssoHost: ssoHost,
            enableSso: enableSso,
          };
          axios.post(
            `${API_LOGIN}`,
            qs.stringify(body),
            {
              headers: {
                'content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
            },
          )
            .then(res => {
              // console.log('res', res);
              if (res && res.data && typeof res.data.access_token === 'string') {
                const API_GET_TOKEN_URL = `${API_GET_TOKEN}?client_id=${clientId}&allowed=true&redirect_uri=${APP_URL}/api/oauth/callback&state=antiCSRF&response_type=code&scope=user`;
                const API_GET_TOKEN_URL_03DRIVER = `${API_GET_TOKEN}?client_id=${DriveId}&allowed=true&redirect_uri=${UPLOAD_APP_URL}/oauth/callback&state=antiCSRF&response_type=code&scope=user`;
                fetch(API_GET_TOKEN_URL_03DRIVER, {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${res.data.access_token}`,
                  },
                }).then(ress => ress.json())
                  .then(ress => {
                    if (ress.status === 'success') {
                      localStorage.setItem('token_03', ress.data.token);
                    }
                    fetch(API_GET_TOKEN_URL, {
                      method: 'GET',
                      headers: {
                        Authorization: `Bearer ${res.data.access_token}`,
                      },
                    }).then(res2 => res2.json())
                      .then(res2 => {
                        if (res2.status === 'success') {
                          localStorage.setItem('token', res2.data.token);
                          // res.expiried = Math.floor(new Date().getTime() / 1000 + Number(res.expires_in));
                          localStorage.setItem('tokenBase', JSON.stringify(res));
                          fetch(API_VIEWCONFIG, {
                            method: 'GET',
                            headers: {
                              Authorization: `Bearer ${res2.data.token}`,
                            },
                          })
                            .then(res3 => res3.json())
                            .then(res3 => {
                              const viewConfig = [res3]
                              localStorage.setItem('viewConfig', JSON.stringify(viewConfig))
                              history.push('/')
                            })
                        }
                      })
                  })
              }
            }).catch(err => {
              //console.log(err)
            })
        }
      } else {
        if (localStorage.getItem('token')) {
          localStorage.clear();
          window.location.reload();
        }
      }
    }
    else if (localStorage.getItem('token'))
      this.setState({
        auth: true,
      });

    // if (localStorage.getItem('token')) {
    //   this.setState({
    //     auth: true,
    //   });
    // }

    // this.props.onGetViewConfig();
  }

  componentWillUpdate() {
    if (localStorage.getItem('token') !== null) this.state.auth = true;
    else {
      this.state.auth = false;

      const classSwal = document.getElementsByClassName('swal-modal');
      if (classSwal.length > 0) swal.close();
    }
  }

  render() {
    const { auth } = this.state;

    return (
      <SnackbarProvider maxSnack={3}>
        <Switch>
          {auth ? (
            <Route path="/" render={props => <Dashboard {...props} />} />
          ) : (
            <Route
              path="/"
              render={props => <Pages {...props} authentication={user => this.handleAuthencation(user)} zmToken={this.state.zmToken} />}
            />
          )}
        </Switch>
      </SnackbarProvider>
    );
  }
}
 // function mapDispatchToProps(dispatch) {
 //   return {
 //     dispatch,
 //     onGetViewConfig: () => {
 //       dispatch(fetchAllViewConfigsAction());
 //     },
 //   };
 // }
 // const withConnect = connect(
 //   null,
 //   mapDispatchToProps,
 // );
 // // const withReducer = injectReducer({ key: 'appReducer', reducer });
 // const withSaga = injectSaga({ key: 'appReducer', saga });
 // export default compose(
 //   // withReducer,
 //   withSaga,
 //   withConnect,
 // )(App);
