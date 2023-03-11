import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_ROLE_GROUP_PORTAL, DELETE_ROLE_GROUP_PORTAL } from './constants';
import { API_ROLE_GROUP_PORTAL } from '../../config/urlConfig';
import request from '../../utils/request';
import {
  getRoleGroupPortalSuccessAction,
  getRoleGroupPortalError,
  deleteRoleGroupPortalSuccess,
  getRoleGroupPortalAction,
  deleteRoleGroupPortalFailed,
} from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import { clientId } from '../../variable';

export function* getRoleGroupPortalSaga() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ROLE_GROUP_PORTAL}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (data) {
      yield put(getRoleGroupPortalSuccessAction(data.data));
    } else {
      yield put(getRoleGroupPortalError({}));
    }
  } catch (err) {
    yield put(getRoleGroupPortalError(err));
  }
}

export function* deleteRoleGroupPortalSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ROLE_GROUP_PORTAL}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body,clientId : clientId  }),
    });
    if (data) {
      yield put(deleteRoleGroupPortalSuccess(data.data));
      yield put(getRoleGroupPortalAction());
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
    } else {
      yield put(deleteRoleGroupPortalFailed({}));
      yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
    }
  } catch (err) {
    yield put(deleteRoleGroupPortalFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}
export default function* roleGroupPagePortalSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ROLE_GROUP_PORTAL, getRoleGroupPortalSaga);
  yield takeEvery(DELETE_ROLE_GROUP_PORTAL, deleteRoleGroupPortalSaga);
}
