// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest } from 'redux-saga/effects';

import { push } from 'react-router-redux';
import request from 'utils/request';
import { API_COMMON_MODULE } from '../../config/urlConfig';
import { getAllModuleCodeSuccess, getAllModuleCodeFailure } from './actions';
import { GET_ALL_MODULE_CODE } from './constants';

// Individual exports for testing
function* getAllModuleCodeSaga(action) {
  try {
    const res = yield call(request, `${API_COMMON_MODULE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (res) {
      yield put(getAllModuleCodeSuccess(res));
    } else {
      yield put(getAllModuleCodeFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

export default function* fieldSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_MODULE_CODE, getAllModuleCodeSaga);
}