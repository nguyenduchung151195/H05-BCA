import { takeLatest, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
// Individual exports for testing
import { API_MEETING } from '../../config/urlConfig';
import { POST_DATA, GET_CURRENT, PUT_DATA, GET_DATA } from './constants';
import { postDataSuccess, getCurrentSuccess, putDataSuccess, getDataSuccess, postDataFailed, putDataFailed } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import { serialize } from '../../utils/common';

function* postDataSaga(action) {
  try {
    const data = yield call(request, `${API_MEETING}/room`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postDataSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
  } catch (error) {
    yield put(postDataFailed());
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

function* getCurrentSaga(action) {
  try {
    const data = yield call(request, `${API_MEETING}/room/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getCurrentSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy phòng họp thất bại', variant: 'error' }));
  }
}

function* putDataSaga(action) {
  try {
    const data = yield call(request, `${API_MEETING}/room/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(putDataSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
  } catch (error) {
    yield put(putDataFailed());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

function* getDataSaga() {
  try {
    const meetingFilter = serialize({
      filter: {
        typeCalendar: '1',
      },
    });

    const meetings = yield call(request, `${API_MEETING}?${meetingFilter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    yield put(getDataSuccess(meetings));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu lịch cá nhân thất bại', variant: 'error' }));
  }
}

export default function* meetingRoomSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_DATA, postDataSaga);
  yield takeLatest(GET_CURRENT, getCurrentSaga);
  yield takeLatest(PUT_DATA, putDataSaga);
  yield takeLatest(GET_DATA, getDataSaga);
}
