// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request, { requestAuth } from '../../utils/request';
import { API_PROFILE, UPLOAD_IMG_SINGLE, API_CHANGE_MY_PASSWORD, API_VIEWCONFIG } from '../../config/urlConfig';
import {
  updateProSuccess,
  updateProFailed,
  getProSuccess,
  getProFailed,
  changeMyPassSuccessAct,
  changeMyPassErrorAct,
  repairViewConfigSuccessAct,
  repairViewConfigErrorAct,
} from './actions';
import { GET_PROFILE, UPDATE_PROFILE, CHANGE_MY_PASS, REPAIR_VIEWCONFIG } from './constants';
import { changeSnackbar, fetchAllViewConfigsAction } from '../Dashboard/actions';
export function* updateProAct(action) {

  const token = localStorage.getItem('token');
  try {
    let avatar;
    if (action.body.avatar !== undefined) {
      // if (typeof action.body.avatar === 'string' && action.body.avatar.indexOf('http://g.lifetek.vn:203') > -1) {
      if (typeof action.body.avatar === 'string') {
        avatar = action.body.avatar;
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
    }

    const bodySend = {
      name: action.body.name,
      gender: action.body.gender,
      email: action.body.email,
      phoneNumber: action.body.phoneNumber,
      avatar,
      dob: action.body.dob,
      address: action.body.address,
      identityCardNumber: action.body.identityCardNumber,
      note: action.body.note,
    };
    const dataUpdated = yield call(request, API_PROFILE, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodySend),
    });
    if (dataUpdated.success === true) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thông tin người dùng thành công', variant: 'success' }));
      yield put(updateProSuccess(dataUpdated.data));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thông tin người dùng thất bại', variant: 'error' }));
      yield put(updateProFailed());
    }
    // yield put(addUserSuccessAction(data));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thông tin người dùng thất bại', variant: 'error' }));
    yield put(updateProFailed(err));
  }
}
export function* getProAct() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_PROFILE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getProSuccess(data));
    } else {
      yield put(getProFailed());
    }
  } catch (error) {
    yield put(getProFailed(error));
  }
}
export function* changePassSaga(action) {
  try {
    const data = yield call(requestAuth, API_CHANGE_MY_PASSWORD, {
      method: 'PATCH',
      body: JSON.stringify(action.body),
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (data) {
      yield put(changeMyPassSuccessAct(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhập mật khẩu thành công', variant: 'success' }));
    } else {
      yield put(changeMyPassErrorAct());
      yield put(changeSnackbar({ status: true, message: 'Cập nhập mật khẩu thất bại', variant: 'error' }));
    }
  } catch (error) {
    yield put(changeMyPassErrorAct(error));
    yield put(changeSnackbar({ status: true, message: error.message, variant: 'error' }));
  }
}
export function* repairViewConfig() {
  try {
    const data = yield call(request, API_VIEWCONFIG, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (data) {
      yield put(repairViewConfigSuccessAct(data));
      yield put(changeSnackbar({ status: true, message: 'Khôi phục cấu hình thành công', variant: 'success' }));
      yield put(fetchAllViewConfigsAction());
    } else {
      yield put(repairViewConfigErrorAct());
      yield put(changeSnackbar({ status: true, message: 'Khôi phục cấu hình  thất bại', variant: 'error' }));
    }
  } catch (error) {
    yield put(repairViewConfigErrorAct(error));
    yield put(changeSnackbar({ status: true, message: error.message, variant: 'error' }));
  }
}

// Individual exports for testing
export default function* editProfilePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(UPDATE_PROFILE, updateProAct);
  yield takeLatest(GET_PROFILE, getProAct);
  yield takeLatest(CHANGE_MY_PASS, changePassSaga);
  yield takeLatest(REPAIR_VIEWCONFIG, repairViewConfig);
}
