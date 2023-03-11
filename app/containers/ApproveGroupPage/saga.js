/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { call, put, takeLatest, select } from 'redux-saga/effects';
import lodash from 'lodash';
// import { serialize } from 'helper';
// import { clientId } from 'variable';
import request, { requestApprove } from '../../utils/request';
import { API_APPROVE_GROUPS, API_USERS } from '../../config/urlConfig';
import {
  getApproveGroupsFailAction,
  getApproveGroupsSuccessAction,
  addApproveGroupSuccessAction,
  addApproveGroupFailAction,
  updateApproveGroupFailAction,
  updateApproveGroupSuccessAction,
  deleteApproveGroupsSuccessAction,
  deleteApproveGroupsFailAction,
} from './actions';
import { makeSelectBody } from './selectors';
import { GET_APPROVE_GROUPS, ADD_APPROVE_GROUP, DELETE_APPROVE_GROUPS, UPDATE_APPROVE_GROUP } from './constants';
// Individual exports for testing
export function* fetchApproveGroups() {
  try {
    // const query = serialize({ filter: { clientId } });
    const data = yield call(requestApprove, `${API_APPROVE_GROUPS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const users = yield call(request, `${API_USERS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data && users) {
      const userHasId = users.data.filter(item => {
        if (Object.keys(item).includes('userId')) {
          return item;
        }
      });

      const newData = data.map(item => {
        item.group = item.group.map(employee => ({ ...employee, ...userHasId.find(d => d.userId === employee.person) }));
        return item;
      });

      yield put(getApproveGroupsSuccessAction(newData));
    }
  } catch (err) {
    yield put(getApproveGroupsFailAction(err));
  }
}
export function* fetchAddApproveGroup(action) {
  const token = localStorage.getItem('token');

  try {
    // console.log('action', action);
    const addApproveGroup = yield call(requestApprove, `${API_APPROVE_GROUPS}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.doc),
    });
    if (addApproveGroup) {
      const oldApproveGroups = yield select(makeSelectBody('approveGroups'));
      oldApproveGroups.push(addApproveGroup.data);

      yield put(addApproveGroupSuccessAction(oldApproveGroups, 'Thêm thành công'));
    }
  } catch (err) {
    yield put(addApproveGroupFailAction(err, 'Thêm đơn vị thất bại'));
  }
}
export function* fetchDeleteApproveGroups(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedApproveGroups = yield call(requestApprove, `${API_APPROVE_GROUPS}/${action.approveGroup._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ ids: action.deleteIds }),
    });

    if (deletedApproveGroups) {
      const oldApproveGroups = yield select(makeSelectBody('approveGroups'));
      const newApproveGroups = lodash.differenceBy(oldApproveGroups, [deletedApproveGroups.data], '_id');
      yield put(deleteApproveGroupsSuccessAction(newApproveGroups, 'Xóa thành công'));
    }
  } catch (err) {
    yield put(deleteApproveGroupsFailAction(err, 'Xóa thất bại'));
  }
}
export function* fetchUpdateApproveGroups(action) {
  const token = localStorage.getItem('token');

  try {
    const updateApproveGroups = yield call(requestApprove, `${API_APPROVE_GROUPS}/${action.doc._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.doc),
    });
    if (updateApproveGroups) {
      const oldApproveGroups = yield select(makeSelectBody('approveGroups'));

      oldApproveGroups[oldApproveGroups.findIndex(d => d._id === updateApproveGroups.data._id)] = updateApproveGroups.data;

      yield put(updateApproveGroupSuccessAction(oldApproveGroups, 'Cập nhật thành công'));
    }
  } catch (err) {
    yield put(updateApproveGroupFailAction(err, 'Cập nhật thất bại'));
  }
}
export default function* ApproveGroupPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_APPROVE_GROUPS, fetchApproveGroups);
  yield takeLatest(ADD_APPROVE_GROUP, fetchAddApproveGroup);
  yield takeLatest(DELETE_APPROVE_GROUPS, fetchDeleteApproveGroups);
  yield takeLatest(UPDATE_APPROVE_GROUP, fetchUpdateApproveGroups);
}
