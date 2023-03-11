// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import qs from 'qs';
import request from '../../utils/request';
import {
  fetchListDepartmentSuccess,
  fetchListDepartmentFalse,
  fetchAddDepartmentSuccess,
  fetchAddDepartmentFalse,
  deleteDepartmentSuccess,
  deleteDepartmentFailed,
  editDepartmentSuccess,
  editDepartmentFailed,
} from './actions';
import { GET_LIST_DEPARTMENT, DELETE_DEPARTMENT, ADD_DEPARTMENT, UPDATE_DEPARTMENT } from './constants';
import { API_ORIGANIZATION, API_DELETE_ORIGANIZATION } from '../../config/urlConfig';
export function* fetchAllDepartment() {
  try {
    // const departmentId = action.departmentId;

    const data = yield call(request, `${API_ORIGANIZATION}?byOrg=true`, {
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
  const sendBody = {
    code: action.body.code,
    name: action.body.name,
    type: action.body.type,
    priority: action.body.priority,
    level: action.body.level,
    oUFunction: action.body.oUFunction,
    duty: action.body.duty,
    note: action.body.note,
    accountingBranchCode: action.body.accoutingBranchCode,
    accountingDepartmentCode: action.body.accountingDepartmentCode,
  };
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, action.body.parent === '' ? API_ORIGANIZATION : `${API_ORIGANIZATION}/${action.body.parent}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(sendBody),
    });
    if (data.success === true) {
      yield put(fetchAddDepartmentSuccess(data.data));
    } else {
      yield put(fetchAddDepartmentFalse({}));
    }
  } catch (err) {
    yield put(fetchAddDepartmentFalse(err));
  }
}

export function* editDepartment(action) {
  // console.log(action)
  const sendBody = {
    code: action.body.code,
    name: action.body.name,
    type: action.body.type,
    priority: action.body.priority,
    level: action.body.level,
    oUFunction: action.body.oUFunction,
    duty: action.body.duty,
    parent: action.body.parent,
    note: action.body.note,
    accountingBranchCode: action.body.accoutingBranchCode,
    accountingDepartmentCode: action.body.accountingDepartmentCode,
  };
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, `${API_ORIGANIZATION}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(sendBody),
    });
    if (data.success === true) {
      yield put(editDepartmentSuccess(data.data));
    } else {
      yield put(editDepartmentFailed({}));
    }
  } catch (err) {
    yield put(editDepartmentFailed(err));
  }
}

export function* deleteDepartment(action) {
  try {
    // const departmentId = action.departmentId;
    const data = yield call(request, `${API_DELETE_ORIGANIZATION}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organizationUnits: [action.body] }),
    });
    if (data.success === true) {
      yield put(deleteDepartmentSuccess());
    } else {
      yield put(deleteDepartmentFailed({}));
    }
  } catch (err) {
    yield put(deleteDepartmentFailed(err));
  }
}
// Individual exports for testing
export default function* listOfDepartmentPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_LIST_DEPARTMENT, fetchAllDepartment);
  yield takeLatest(ADD_DEPARTMENT, fetchAddDepartment);
  yield takeLatest(UPDATE_DEPARTMENT, editDepartment);
  yield takeLatest(DELETE_DEPARTMENT, deleteDepartment);
}
