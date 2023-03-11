// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { fetchListDepartmentSuccess, fetchListDepartmentFalse, fetchAddDepartmentSuccess } from './actions';
import { GET_LIST_DEPARTMENT, ADD_DEPARTMENT } from './constants';
import { API_ORIGANIZATION } from '../../config/urlConfig';
export function* fetchAllDepartment() {
  try {
    // const departmentId = action.departmentId;

    const data = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(fetchListDepartmentSuccess(data));
    } else {
      yield put(fetchListDepartmentFalse({}));
    }
  } catch (err) {
    yield put(fetchListDepartmentFalse(err));
  }
}
export function* fetchAddDepartment(action) {
  try {
    // const departmentId = action.departmentId;

    const data = yield call(request, API_ORIGANIZATION, {
      method: 'POST',
      data: JSON.parse(action.body),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(fetchAddDepartmentSuccess(data));
    } else {
      yield put(fetchListDepartmentFalse({}));
    }
  } catch (err) {
    yield put(fetchListDepartmentFalse(err));
  }
}
// Individual exports for testing
export default function* listOfDepartmentPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_LIST_DEPARTMENT, fetchAllDepartment);
  yield takeLatest(ADD_DEPARTMENT, fetchAddDepartment);
}
