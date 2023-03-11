/* eslint-disable consistent-return */
import { call, put, takeEvery } from 'redux-saga/effects';
import request, { requestApprove } from '../../utils/request';
import { API_USERS, API_APPROVE_GROUPS } from '../../config/urlConfig';
import {
  getAllUserFailedAct,
  getAllUserSuccessAct,
  // updateApproveGroupFailAction,
  updateApproveGroupSuccessAction,
  addApproveGroupSuccessAction,
  addApproveGroupFailAction,
  // getApproveGroupDetailPageFailAction,
  getApproveGroupDetailPageSuccessAction,
} from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import { GET_ALL_USER, ADD_APPROVE_GROUP, GET_APPROVE_GROUP_DETAIL, UPDATE_APPROVE_GROUP } from './constants';
export function* getAllUser() {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${API_USERS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      // eslint-disable-next-line array-callback-return
      const userHasId = data.data.filter(item => {
        if (Object.keys(item).includes('userId')) {
          return item;
        }
      });

      yield put(getAllUserSuccessAct(userHasId));
    } else {
      yield put(getAllUserFailedAct({}));
    }
  } catch (err) {
    yield put(getAllUserFailedAct(err));
  }
}
export function* fetchApproveGroupDetailPage(action) {
  try {
    const data = yield call(requestApprove, `${API_APPROVE_GROUPS}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(getApproveGroupDetailPageSuccessAction(data));
    }
  } catch (err) {
    // yield put(getApproveGroupDetailPageFailAction(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy nhóm phê duyệt thất bại', variant: 'error' }));
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
      // const oldApproveGroups = yield select(makeSelectBody('approveGroups'));

      // oldApproveGroups[oldApproveGroups.findIndex(d => d._id === updateApproveGroups.data._id)] = updateApproveGroups.data;
      yield put(changeSnackbar({ status: true, message: 'Cập nhật nhóm phê duyệt thành công', variant: 'success' }));
      yield put(updateApproveGroupSuccessAction());
    }
  } catch (err) {
    // yield put(updateApproveGroupFailAction(err, 'Cập nhật thất bại'));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật nhóm phê duyệt thất bại', variant: 'error' }));
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
      yield put(changeSnackbar({ status: true, message: 'Thêm nhóm phê duyệt đơn thành công', variant: 'success' }));
      yield put(addApproveGroupSuccessAction());
    }
  } catch (err) {
    yield put(addApproveGroupFailAction());
    yield put(changeSnackbar({ status: true, message: 'Thêm nhóm phê duyệt đơn thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* ApproveGroupDetailPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_APPROVE_GROUP_DETAIL, fetchApproveGroupDetailPage);
  yield takeEvery(GET_ALL_USER, getAllUser);
  yield takeEvery(ADD_APPROVE_GROUP, fetchAddApproveGroup);
  yield takeEvery(UPDATE_APPROVE_GROUP, fetchUpdateApproveGroups);
}
