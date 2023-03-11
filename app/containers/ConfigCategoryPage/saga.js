// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_HRM_SALARY_CATEGORY } from 'config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { getAllDocumentCategorySuccess, getAllDocumentCategoryFailure, addDocumentCategorySuccess, addDocumentCategoryFailure, updateDocumentCategorySuccess, updateDocumentCategoryFailure, deleteDocumentCategorySuccess, deleteDocumentCategoryFailure, getAllDocumentCategory, resetDocumentCategoryFailure } from './actions';
import { GET_ALL_DOCUMENT_CATEGORY, ADD_DOCUMENT_CATEGORY, UPDATE_DOCUMENT_CATEGORY, DELETE_DOCUMENT_CATEGORY, RESET_DOCUMENT_CATEGORY } from './contants';

export function* getAllDocumentCategorySaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, API_HRM_SALARY_CATEGORY, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res && res.status === 1) {
      yield put(getAllDocumentCategorySuccess(res.data));
    } else {
      yield put(getAllDocumentCategoryFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.messages || 'Thêm mới thất bại', status: true }));
    }

  } catch (error) {
    yield put(getAllDocumentCategoryFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: error || 'Thêm mới thất bại', status: true }));
  }
}
export function* addDocumentCategorySaga(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  try {
    const res = yield call(request, API_HRM_SALARY_CATEGORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (res && res.status === 1) {
      yield put(getAllDocumentCategory());
      yield put(addDocumentCategorySuccess(res));
      yield put(changeSnackbar({ variant: 'success', message: 'Thêm mới thành công', status: true }));
    } else {
      yield put(addDocumentCategoryFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.messages || 'Thêm mới thất bại', status: true }));
    }

  } catch (error) {
    yield put(addDocumentCategoryFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: error || 'Thêm mới thất bại', status: true }));
  }
}
export function* updateDocumentCategorySaga(action) {
  const token = localStorage.getItem('token');
  const { data, typeChild: type } = action;
  const METHOD_TYPE_CHILD = {
    add: 'Thêm mới',
    update: 'Cập nhật',
    delete: 'Xóa'
  }
  try {
    const res = yield call(request, `${API_HRM_SALARY_CATEGORY}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (res && res.status === 1) {
      yield put(getAllDocumentCategory());
      yield put(updateDocumentCategorySuccess(res));
      yield put(changeSnackbar({ variant: 'success', message: `${METHOD_TYPE_CHILD[`${type}`]} thành công`, status: true }));
    } else {
      yield put(updateDocumentCategoryFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.messages || `${METHOD_TYPE_CHILD[`${type} thất bại`]}`, status: true }));
    }

  } catch (error) {
    yield put(updateDocumentCategoryFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: error || `${METHOD_TYPE_CHILD[`${type} thất bại`]}`, status: true }));
  }
}

export function* deleteDocumentCategorySaga(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  try {
    const res = yield call(request, `${API_HRM_SALARY_CATEGORY}/${data._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res && res.status === 1) {
      yield put(getAllDocumentCategory());
      yield put(deleteDocumentCategorySuccess(res));
      yield put(changeSnackbar({ variant: 'success', message: 'Xóa thành công', status: true }));
    } else {
      yield put(deleteDocumentCategoryFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.messages || 'Xóa thất bại', status: true }));
    }

  } catch (error) {
    yield put(deleteDocumentCategoryFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: error || 'Xóa thất bại', status: true }));
  }
}

export function* resetDocumentCategorySaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_SALARY_CATEGORY}/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res && res.status === 1) {
      yield put(getAllDocumentCategory());
      yield put(changeSnackbar({ variant: 'success', message: 'Hoàn tác thành công', status: true }));
    } else {
      yield put(resetDocumentCategoryFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.messages || 'Hoàn tác thất bại', status: true }));
    }

  } catch (error) {
    yield put(resetDocumentCategoryFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: error || 'Hoàn tác thất bại', status: true }));
  }
}

export default function* configHrmSalaryCategorySaga() {
  yield takeLatest(GET_ALL_DOCUMENT_CATEGORY, getAllDocumentCategorySaga);
  yield takeLatest(ADD_DOCUMENT_CATEGORY, addDocumentCategorySaga);
  yield takeLatest(UPDATE_DOCUMENT_CATEGORY, updateDocumentCategorySaga);
  yield takeLatest(DELETE_DOCUMENT_CATEGORY, deleteDocumentCategorySaga);
  yield takeLatest(RESET_DOCUMENT_CATEGORY, resetDocumentCategorySaga);
}
