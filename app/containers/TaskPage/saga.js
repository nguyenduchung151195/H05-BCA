import { takeLatest, call, put } from 'redux-saga/effects';

// Individual exports for testing
import { API_TASK_PROJECT } from '../../config/urlConfig';
// import lodash from 'lodash';
import request from '../../utils/request';
import { getProjectFail, getProjectSuccess } from './actions';
import { GET_PROJECT, POST_PROJECT, PUT_PROJECT } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { serialize } from '../../utils/common';
function* getProjectSaga() {
  try {
    const filterProject = serialize({
      filter: {
        isProject: true,
      },
    });
    const projects = yield call(request, `${API_TASK_PROJECT}?${filterProject}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(getProjectSuccess(projects));
  } catch (err) {
    yield put(getProjectFail(err, 'Lấy dữ liệu thất bại'));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* postProject(action) {
  try {
    yield call(request, API_TASK_PROJECT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ status: true, message: 'Thêm mới dự án thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới dự án thất bại', variant: 'error' }));
  }
}

function* putProject(action) {
  try {
    const data = yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật dự án thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật dự án thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* taskPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_PROJECT, getProjectSaga);
  yield takeLatest(POST_PROJECT, postProject);
  // yield takeLatest(GET_TASK_CURRENT, getTaskCurrent);
  yield takeLatest(PUT_PROJECT, putProject);
}
