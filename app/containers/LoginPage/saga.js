import { call, put, takeLatest, all } from 'redux-saga/effects';
import qs from 'qs';
import { push } from 'connected-react-router';
import request from '../../utils/request';
import { LOGIN } from './constants';
import { loginSuccessAction, loginFalseAction } from './actions';
import { API_LOGIN, API_GET_TOKEN, APP_URL, API_VIEWCONFIG, UPLOAD_APP_URL } from '../../config/urlConfig';
import { clientId, DriveId } from '../../variable';
export function* featchLogin(action) {
  let newBody
  if (action.body.enableSso && action.body.ssoHost && action.body.authToken) {
    newBody = {
      username: action.body.username,
      password: action.body.password,
      enableSso: action.body.enableSso,
      ssoHost: action.body.ssoHost,
      ssoToken: action.body.authToken,
      client_id: 'authServer',
      grant_type: 'password',
      scope: 'user',
    }
  } else {
    newBody = {
      username: action.body.username,
      password: action.body.password,
      client_id: 'authServer',
      grant_type: 'password',
      scope: 'user',
    };
  }
  try {
    const data = yield call(request, API_LOGIN, {
      method: 'POST',
      headers: {
        'content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: qs.stringify(newBody),
    });
    if (typeof data.access_token === 'string') {
      const API_GET_TOKEN_URL = `${API_GET_TOKEN}?client_id=${clientId}&allowed=true&redirect_uri=${APP_URL}/api/oauth/callback&state=antiCSRF&response_type=code&scope=user`;
      const API_GET_TOKEN_URL_03DRIVER = `${API_GET_TOKEN}?client_id=${DriveId}&allowed=true&redirect_uri=${UPLOAD_APP_URL}/oauth/callback&state=antiCSRF&response_type=code&scope=user`;
      const dataGetToken03Driver = yield call(request, API_GET_TOKEN_URL_03DRIVER, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });
      if (dataGetToken03Driver.status === 'success') {
        localStorage.setItem('token_03', dataGetToken03Driver.data.token);
      }
      //console.log(API_GET_TOKEN_URL, 'API_GET_TOKEN_URL')
      const dataGetToken = yield call(request, API_GET_TOKEN_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });
      if (dataGetToken.status === 'success') {
        localStorage.setItem('token', dataGetToken.data.token);
        data.expiried = Math.floor(new Date().getTime() / 1000 + Number(data.expires_in));
        localStorage.setItem('tokenBase', JSON.stringify(data));
        const auth = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${dataGetToken.data.token}`,
          },
        };
        // const [viewConfig] = yield all([call(request, API_VIEWCONFIG, auth)]);
        // if (viewConfig) localStorage.setItem('viewConfig', JSON.stringify(viewConfig));
        yield put(loginSuccessAction(dataGetToken.data.token));
        yield put(push('/'));
      } else {
        yield put(loginFalseAction({}));
      }
      // yield put(loginSuccessAction(data));
    } else {
      yield put(loginFalseAction({}));
    }
  } catch (err) {
    yield put(loginFalseAction(err));
  }
}

// Individual exports for testing
export default function* loginPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(LOGIN, featchLogin);
}
