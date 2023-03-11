// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_PROFILE, API_ORIGANIZATION } from '../../config/urlConfig';
import { getData, getProSuccess, getProFailed, getDataFailed, getDataSuccess } from './actions';
import { GET_PROFILE, GET_ORGANIZATIONUNIT } from './constants';

export function* getProAct() {
  // console.log('xxxx')
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
      yield put(getData(data.organizationUnit));
    } else {
      yield put(getProFailed());
    }
  } catch (error) {
    yield put(getProFailed(error));
  }
}

export function* getDataUnit(action) {
  const { params } = action;
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ORIGANIZATION}/${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getDataSuccess(data.data));
    } else {
      yield put(getDataFailed({}));
    }
  } catch (err) {
    yield put(getDataFailed(err));
  }
}

// Individual exports for testing
export default function* profilePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_PROFILE, getProAct);
  yield takeLatest(GET_ORGANIZATIONUNIT, getDataUnit);
}
