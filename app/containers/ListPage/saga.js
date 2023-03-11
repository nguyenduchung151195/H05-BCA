// import { take, call, put, select } from 'redux-saga/effects';

import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';

import request from 'utils/request';
import { API_VIEW_CONFIG } from 'config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { getRowsSuccess, getRows } from './actions';

import { PUT_VIEWCONFIG, GET_ROWS } from './constants';

function* getRowsSaga(action) {
  try {
    const data = yield call(request, action.apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(getRowsSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* deleteRowsSaga(action) {
  try {
    yield call(request, action.deleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ [action.deleteOption]: action.selected }),
    });
    yield put(getRows(action.apiUrl));
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Xóa thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa không thành công' }));
  }
}

function* putViewConfigSaga(action) {
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const data = viewConfig.find(item => item.code === action.code);
  const index = viewConfig.findIndex(item => item.code === action.code);
  const newColumns = action.columns.filter(item => item.name !== 'edit');
  data.editDisplay.type.fields.type.columns = newColumns;
  try {
    yield call(request, `${API_VIEW_CONFIG}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    viewConfig[index].editDisplay.type.fields.type.columns = newColumns;
    localStorage.setItem('viewConfig', JSON.stringify(viewConfig));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật không thành công' }));
  }
}

// Individual exports for testing
export default function* listPageSaga() {
  yield takeLatest(GET_ROWS, getRowsSaga);
  yield takeLatest('DELETE_ROWS', deleteRowsSaga);
  yield takeLatest(PUT_VIEWCONFIG, putViewConfigSaga);
}
