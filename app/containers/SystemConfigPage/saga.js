import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { SYS_CONF, UPLOAD_IMG_SINGLE, API_CREATE_CONFIG_CODE, API_GET_CONFIG_CODE } from '../../config/urlConfig';
import {
  updateSysConfSuccess,
  updateSysConfFailed,
  getSysConfFailed,
  getSysConfSuccess,
  createConfigCodeActSuccess,
  createConfigCodeActFailed,
  getConfigCodeActSuccess,
  getConfigCodeActFailed,
} from './actions';
import { UPDATE_SYS_CONF, GET_SYS_CONF, CREATE_CONFIG_CODE, GET_CONFIG_CODE } from './constants';
import logoDefault from '../../images/logo.jpg';

export function* updateSystemConf(action) {
  const token = localStorage.getItem('token');
  try {
    let avatar;
    if (action.body.avatar === null) {
      if (action.body.avatarURL.indexOf('http://g.lifetek.vn:203') > -1) {
        avatar = action.body.avatarURL;
      } else {
        avatar = logoDefault;
      }
    } else {
      const formData = new FormData();
      formData.append('file', action.body.avatar);
      const upload = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {},
        body: formData,
      });
      avatar = upload.url;
    }
    const bodySend = {
      firstDayOfTheWeek: action.body.firstDayOfTheWeek,
      name: action.body.name,
      displayName: action.body.displayName,
      website: action.body.website,
      email: action.body.email,
      logo: avatar,
      language: action.body.language,
      holidays: action.body.holidays,
      workingDays: action.body.workingDay,
      workingTime: action.body.workingTime,
      timeFomat: action.body.timeFormat,
      dateFomat: action.body.dateFormat,
      mailServer: action.body.mailServer,
      passServer: action.body.passServer,
      serviceServer: action.body.serviceServer,
      smsBrandname: action.body.smsBrandname,
      smsAccount: action.body.smsAccount,
      smsPass: action.body.smsPass,
      facebook: action.body.facebook,
      bankAccount: action.body.bankAccount,
      userAfkTime: action.body.userAfkTime,
      subordinateUnit: action.body.subordinateUnit,
      hostUnit: action.body.hostUnit
    };
    const dataCreate = yield call(request, SYS_CONF, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodySend),
    });
    if (dataCreate.success === true) {
      // TT
      yield put(updateSysConfSuccess(dataCreate.data));
    } else {
      yield put(updateSysConfFailed());
    }
    // yield put(addUserSuccessAction(data));
  } catch (err) {
    //console.log('err', err);
    yield put(updateSysConfFailed(err));
  }
}
// TT
// TT - UPDATE=CREATE CODE - 13
export function* createConfigCodeWorker(action) {
  // console.log('da vao saga - createConfigCodeWorker');
  // console.log('action.body', action.body);
  // console.log('JSON.stringify(action.body)', JSON.stringify(action.body));

  const token = localStorage.getItem('token');
  // 1.OK CODE - ĐỢI TESK VỚI BACKEND.
  try {
    const bodySend = { ...action.body };
    // console.log('JSON.stringify(bodySend)', JSON.stringify(bodySend));
    // TT - UPDATE=CREATE CODE - 14
    const dataCreate = yield call(request, API_CREATE_CONFIG_CODE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodySend),
    });
    // console.log('SAU REQUEST CREATE CODE : dataCreate', dataCreate);
    // console.log('SAU REQUEST : dataCreate.success', dataCreate.success);
    if (dataCreate.success === true) {
      // TT - UPDATE=CREATE CODE - 15
      // yield put(createConfigCodeActSuccess(dataCreate.data));
      yield put(createConfigCodeActSuccess(dataCreate.data));
    } else {
      yield put(createConfigCodeActFailed());
    }
  } catch (err) {
    yield put(createConfigCodeActFailed(err));
  }
}

export function* getConfigCodeWorker(action) {
  const token = localStorage.getItem('token');
  try {
    const { task } = action.body;
    const response = yield call(request, `${API_GET_CONFIG_CODE}/${task}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response) {
      yield put(getConfigCodeActSuccess(response));
    } else {
      yield put(getConfigCodeActFailed());
    }
  } catch (err) {
    yield put(getConfigCodeActFailed(err));
  }
}

//
export function* getSystemConf() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, SYS_CONF, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getSysConfSuccess(data));
    } else {
      yield put(getSysConfFailed());
    }
  } catch (error) {
    yield put(getSysConfFailed(error));
  }
}

// Individual exports for testing
export default function* systemConfigPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(UPDATE_SYS_CONF, updateSystemConf);
  yield takeLatest(GET_SYS_CONF, getSystemConf);
  // TT :
  // TT - UPDATE=CREATE CODE - 12
  yield takeLatest(CREATE_CONFIG_CODE, createConfigCodeWorker);
  yield takeLatest(GET_CONFIG_CODE, getConfigCodeWorker);
}
