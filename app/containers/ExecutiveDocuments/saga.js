import { call, put, takeLatest } from 'redux-saga/effects';
import {
  UpdateStatusFailed,
  UpdateStatusSuccess,
} from './actions';
import { API_INCOMMING_DOCUMENT } from '../../config/urlConfig';
import request from '../../utils/request';
import {  UPDATE_STATUS } from './constants';
import { changeSnackbar } from '../Dashboard/actions';

export function* updateStatus(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_INCOMMING_DOCUMENT}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (!data || data.status === 0) {
      yield put(changeSnackbar({ status: true, message: data.message, variant: 'error' }));
      yield put(UpdateStatusFailed());  
    } else {
      yield put(UpdateStatusSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(UpdateStatusFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thất bại', variant: 'error' }));
  }
}

export default function* ExecutiveDocumentsSaga() {
  yield takeLatest(UPDATE_STATUS, updateStatus);
}
