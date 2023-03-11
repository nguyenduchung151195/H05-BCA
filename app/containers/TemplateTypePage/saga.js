import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';

import request from 'utils/request';
import { API_TEMPLATE } from 'config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { getTemplateTypesSuccess, getTemplateTypes } from './actions';

function* getTemplateTypesSaga() {
  try {
    const data = yield call(request, `${API_TEMPLATE}/category`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getTemplateTypesSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* deleteTemplateTypes(action) {
  try {
    yield call(request, `${API_TEMPLATE}/category`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ ids: action.templates }),
    });
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Xóa thành công' }));
    yield put(getTemplateTypes());
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
  }
}
export default function* templateTypePageSaga() {
  yield takeLatest('GET_TEMPLATE_TYPES', getTemplateTypesSaga);
  yield takeLatest('DELETE_TEMPLATE_TYPES', deleteTemplateTypes);
}
