import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';

import { API_TASK_CONFIG, API_CREAT_TASK_CONFIG, API_UPDATE_TASK_CONFIG, API_DELETE_TASK_CONFIG, API_SOURCE_CRMCONFIG, API_STATUS_CRMCONFIG, } from '../../config/urlConfig';
import {
  GET_CONFIG, POST_CONFIG, PUT_CONFIG, DELETE_CONFIG, PUT_CONFIG_PARENT, ADD_SOURCE, RESET_ALL_SOURCE, EDIT_SOURCE, DELETE_CRM_SOURCES, GET_ALL_STATUS, GET_ALL_SOURCES,
  UPDATE_SOURCE
} from './constants';
import {
  postConfigSuccess, deleteConfigSuccess, getConfig, mergeData, fetchAllSourcesAction, addSourceFailAction, editSourceFailAction, deleteCRMSourcesFailAction, fetchAllStatusFailAction,
  fetchAllSourcesSuccessAction, fetchAllSourcesFailAction, updateSourcesFailAction
} from './actions';
import { serialize } from '../../helper';

// Individual exports for testing
export function* getTaskSaga() {
  try {
    const config = yield call(request, API_TASK_CONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    localStorage.setItem('taskStatus', JSON.stringify(config));
    yield put(mergeData({ config }));
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}
export function* postTaskSaga(action) {
  try {
    const response = yield call(request, `${API_CREAT_TASK_CONFIG}/${action.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (response.status === 1) {
      yield put(postConfigSuccess(response));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới cấu hình thành công', variant: 'success' }));
      yield put(getConfig());
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới cấu hình thất bại', variant: 'error' }));
    }
  } catch (error) {
    //console.log('error', error);
    yield put(changeSnackbar({ status: true, message: 'Thêm mới cấu hình thất bại', variant: 'error' }));
  }
}
export function* putTaskSaga(action) {
  try {
    const data = yield call(request, `${API_UPDATE_TASK_CONFIG}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(postConfigSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình thành công', variant: 'success' }));
    yield put(getConfig());
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình thất bại', variant: 'error' }));
  }
}
export function* deleteTaskSaga(action) {
  try {
    const data = yield call(request, `${API_DELETE_TASK_CONFIG}/${action.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: action.configId }),
    });

    yield put(deleteConfigSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Xóa cấu hình thành công', variant: 'success' }));
    yield put(getConfig());
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Xóa cấu hình thất bại', variant: 'error' }));
  }
}

export function* putConfigParentSaga(action) {
  try {
    yield call(request, `${API_TASK_CONFIG}/${action.data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: action.data.data, name: action.data.name }),
    });

    yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình gantt thành công', variant: 'success' }));
    yield put(getConfig());
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật  cấu hình gantt thất bại', variant: 'error' }));
  }
}

export function* fetchAddSource(action) {
  const token = localStorage.getItem('token');

  try {
    const addSource = yield call(request, API_SOURCE_CRMCONFIG, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.body, type: action.types }),
    });

    if (addSource) {
      yield put(changeSnackbar({ status: true, message: 'Thêm cấu hình thành công', variant: 'success' }));
      yield put(fetchAllSourcesAction(action.types))
    }
  } catch (err) {
    yield put(addSourceFailAction(err, 'Thêm cấu hình thất bại'));
  }
}

export function* resetAllSources(action) {
  const token = localStorage.getItem('token');

  try {
    const response = yield call(request, `${API_SOURCE_CRMCONFIG}/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Hoàn tác dữ liệu cấu hình loại thành công', variant: 'success' }));
      yield put(fetchAllSourcesAction());
    }
  } catch (err) {
    yield put(resetAllSourcesFailure(data));
    yield put(changeSnackbar({ status: true, message: 'Hoàn tác dữ liệu cấu hình loại thất bại', variant: 'error' }));
  }
}

export function* fetchEditSource(action) {
  const token = localStorage.getItem('token');

  try {
    const editSource = yield call(request, `${API_SOURCE_CRMCONFIG}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.body }),
    });

    if (editSource) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình thành công', variant: 'success' }));
      yield put(fetchAllSourcesAction(action.types));
    }
  } catch (err) {
    yield put(editSourceFailAction(err, 'Cập nhật cấu hình thất bại'));
  }
}

export function* fetchDeleteCRMSource(action) {
  const token = localStorage.getItem('token');

  try {
    const deleteSource = yield call(request, `${API_SOURCE_CRMCONFIG}/${action.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (deleteSource) {
      yield put(changeSnackbar({ status: true, message: 'Xóa cấu hình thành công', variant: 'success' }));
      yield put(fetchAllSourcesAction(action.types));
    }
  } catch (err) {
    yield put(deleteCRMSourcesFailAction(err, 'Xóa cấu hình thất bại'));
  }
}

export function* fetchGetAllStatus(type) {
  const filters = {
    filter:
      { type: type.id }
  }
  let allF = serialize(filters)
  try {
    const data = yield call(request, `${API_STATUS_CRMCONFIG}?${allF}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    localStorage.setItem('crmStatus', JSON.stringify(data));
    if (data) {
      yield put(fetchAllStatusSuccessAction(data));
    } else {
      yield put(fetchAllStatusSuccessAction({}));
    }
  } catch (err) {
    yield put(fetchAllStatusFailAction(err));
  }
}

// SOURCES

export function* fetchGetAllSources(type) {
  const filters = {
    filter:
      { type: type.id }
  }
  let allF = serialize(filters)
  try {
    const data = yield call(request, `${API_SOURCE_CRMCONFIG}?${allF}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(fetchAllSourcesSuccessAction(data));
    } else {
      yield put(fetchAllSourcesSuccessAction({}));
    }
  } catch (err) {
    yield put(fetchAllSourcesFailAction(err));
  }
}

export function* fetchUpdateSources(action) {
  const token = localStorage.getItem('token');

  try {
    const updateSources = yield call(request, `${API_SOURCE_CRMCONFIG}/${action.param._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.param.title, data: action.body }),
    });
    if (updateSources) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình thành công', variant: 'success' }));
      yield put(fetchAllSourcesAction(action.types));
    }
  } catch (err) {
    yield put(updateSourcesFailAction(err, 'Cập nhật cấu hình thất bại'));
  }
}


export default function* configTaskSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_STATUS, fetchGetAllStatus);
  yield takeLatest(GET_CONFIG, getTaskSaga);
  yield takeLatest(POST_CONFIG, postTaskSaga);
  yield takeLatest(PUT_CONFIG, putTaskSaga);
  yield takeLatest(DELETE_CONFIG, deleteTaskSaga);
  yield takeLatest(PUT_CONFIG_PARENT, putConfigParentSaga);
  yield takeLatest(ADD_SOURCE, fetchAddSource);
  yield takeLatest(RESET_ALL_SOURCE, resetAllSources);
  yield takeLatest(EDIT_SOURCE, fetchEditSource);
  yield takeLatest(DELETE_CRM_SOURCES, fetchDeleteCRMSource);
  yield takeLatest(GET_ALL_SOURCES, fetchGetAllSources);
  yield takeLatest(UPDATE_SOURCE, fetchUpdateSources);
}
