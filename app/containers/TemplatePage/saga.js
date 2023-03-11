import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';

import request from 'utils/request';
import { API_TEMPLATE } from 'config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { getTemplates, mergeData } from './actions';

function* getTemplatesSaga() {
  try {
    const data = yield call(request, API_TEMPLATE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    // const newData = data.map(item => ({ ...item, categoryDynamicForm: item.categoryDynamicForm.title }));
    // yield put(getTemplatesSuccess(newData));
    yield put(mergeData({ template: data }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* deleteTemplates(action) {
  try {
    yield call(request, `${API_TEMPLATE}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ ids: action.templates }),
    });
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Xóa thành công' }));
    yield put(getTemplates());
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
  }
}

// Individual exports for testing
export default function* templatePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest('GET_TEMPLATES', getTemplatesSaga);
  yield takeLatest('DELETE_TEMPLATES', deleteTemplates);
}
