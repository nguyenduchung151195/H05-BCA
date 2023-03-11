import { takeLatest, call, put, takeEvery, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
// Individual exports for testing
import { API_TASK_PROJECT, API_CUSTOMERS, API_USERS, API_PROGRESS, API_TRANFER, UPLOAD_IMG_SINGLE } from '../../config/urlConfig';
// import lodash from 'lodash';
import request from '../../utils/request';
import {
  getTaskFail,
  postTaskSuccess,
  postTaskFail,
  getTaskCurrentSuccess,
  putTaskSuccess,
  putProgressSuccess,
  postTranferSuccess,
  mergeData,
  getParentSuccess,
} from './actions';
import makeSelectAddTask from './selectors';
import { makeSelectProfile } from '../Dashboard/selectors';
import { GET_TASK, POST_TASK, GET_TASK_CURRENT, PUT_TASK, CLOSE_TASK, PUT_PROGRESS, POST_TRANFER, POST_FILE, GET_PARENT } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { serialize } from '../../helper';
const token = `Bearer ${localStorage.getItem('token')}`;

export function* getTask() {
  try {
    const isProjectFilter = serialize({
      filter: {
        isProject: true,
      },
    });
    const taskFilter = serialize({
      filter: {
        isProject: false,
      },
    });
    const projects = yield call(request, `${API_TASK_PROJECT}?${isProjectFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const tasks = yield call(request, `${API_TASK_PROJECT}?${taskFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const customers = yield call(request, API_CUSTOMERS, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const employees = yield call(request, API_USERS, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const profile = yield select(makeSelectProfile());

    yield put(mergeData({ tasks: tasks.data, customers, employees, projects: projects.data, profile }));
  } catch (err) {
    yield put(getTaskFail(err, 'Lấy dữ liệu thất bại'));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* postTask(action) {
  try {
    // console.log('aa', action);
    if (action.data.objectAvatar) {
      const formData = new FormData();
      formData.append('file', action.data.avatar);
      const url = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      action.data.avatar = url.url;
    }

    const data = yield call(request, API_TASK_PROJECT, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(postTaskSuccess());
    yield put(changeSnackbar({ status: true, message: 'Thêm mới công việc thành công', variant: 'success' }));
    // callBack lai cong viec lien quan
    const callBack = action.data.callBack;
    if (callBack) callBack(data);
    else yield put(push('/task'));
  } catch (error) {
    yield put(postTaskFail(error));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới công việc thất bại', variant: 'error' }));
  }
}

function* getTaskCurrent(action) {
  try {
    const data = yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(getTaskCurrentSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* putTask(action) {
  try {
    if (action.data.objectAvatar) {
      const formData = new FormData();
      formData.append('file', action.data.avatar);
      const url = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      action.data.avatar = url.url;
    }

    const data = yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(putTaskSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật công việc thành công', variant: 'success' }));
    const callBack = action.data.callBack;
    if (callBack) callBack();
    else yield put(push('/task'));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật công việc thất bại', variant: 'error' }));
  }
}

function* postFileSaga(action) {
  try {
    const formData = new FormData();
    const type = action.data.type.includes('image') ? 'image' : 'doc';
    formData.append('file', action.data);
    const data = yield call(request, UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const addTask = yield select(makeSelectAddTask());
    const name = addTask.fileTitle;
    const taskId = addTask._id;
    const description = addTask.fileDescription;
    const fileData = {
      name,
      fileName: action.data.name,
      size: action.data.size,
      originFile: action.data.type,
      type,
      taskId,
      description,
      url: data.url,
    };

    const fileUpdload = yield call(request, `${API_TASK_PROJECT}/file/${taskId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileData),
    });

    const files = addTask.files.concat(fileUpdload);
    yield put(mergeData({ files, fileDescription: '', fileTitle: '' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

// đóng CV
function* onCloseTask(action) {
  try {
    const callBack = action.data.callBack;
    if (callBack) callBack();
    else yield put(push('/task'));
  } catch (error) {
    yield put(push('/task'));
  }
}
function* putProgress(action) {
  try {
    const data = yield call(request, `${API_PROGRESS}/${action.id}`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    if (data) {
      yield put(putProgressSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật tiến độ công việc thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật tiến độ công việc thất bại', variant: 'error' }));
  }
}
function* postTranfer(action) {
  try {
    const data = yield call(request, `${API_TRANFER}/${action.id}`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    // console.log('AAA', data);

    if (data) {
      yield put(postTranferSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

function* getParentSaga(action) {
  try {
    const parentTask = yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(getParentSuccess(parentTask));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Không lấy được công việc cha', variant: 'error' }));
  }
}
export default function* addTaskSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_TASK, getTask);
  yield takeLatest(POST_TASK, postTask);
  yield takeLatest(GET_TASK_CURRENT, getTaskCurrent);
  yield takeLatest(PUT_TASK, putTask);
  yield takeLatest(CLOSE_TASK, onCloseTask);
  yield takeLatest(PUT_PROGRESS, putProgress);
  yield takeLatest(POST_TRANFER, postTranfer);
  yield takeLatest(POST_FILE, postFileSaga);
  yield takeLatest(GET_PARENT, getParentSaga);
}
