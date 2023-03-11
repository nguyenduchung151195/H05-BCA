import { takeLatest, call, put } from 'redux-saga/effects';
import { API_BOS, API_TASK_PROJECT } from '../../config/urlConfig';
import { ADD_BOS, GET_DATA } from './constants';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import { addBosSuccess, getDataSuccess } from './actions';
import { serialize } from '../../utils/common';

// import { take, call, put, select } from 'redux-saga/effects';
function* addBosSaga(action) {
  try {
    const data = yield call(request, API_BOS, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(addBosSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Thêm cơ hội kinh doanh thành công', variant: 'success' }));
  } catch (err) {
    // console.log('222', err);
    yield put(changeSnackbar({ status: true, message: 'Thêm cơ hội kinh doanh thất bại', variant: 'error' }));
  }
}

function* getDataSaga() {
  try {
    const projectFilter = serialize({
      filter: {
        isProject: true,
      },
    });

    const projects = yield call(request, `${API_TASK_PROJECT}?${projectFilter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (projects) yield put(getDataSuccess(projects.data));
  } catch (err) {
    // console.log('222', err);
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* projectPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(ADD_BOS, addBosSaga);
  yield takeLatest(GET_DATA, getDataSaga);
}
