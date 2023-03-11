import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { push } from 'react-router-redux';
import request from 'utils/request';
import { API_TEMPLATE } from 'config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { getTemplateTypeSuccess, putTemplateTypeFailed, postTemplateTypeFailed } from './actions';

function* getTemplateTypeSaga(action) {
  try {
    let data = null;
    if (action.id !== 'add') {
      data = yield call(request, `${API_TEMPLATE}/category/${action.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    }

    yield put(getTemplateTypeSuccess(data, action.id));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* postTemplateTypeSaga(action) {
  try {
    const data = yield call(request, `${API_TEMPLATE}/category`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ message: `Thêm mới thành công ${data.data.title}`, status: true, variant: 'success' }));
    // yield put(push(`/crm/suppliers/${supplierInfo.data._id}`));
    yield put(push('/setting/template_type'));
  } catch (error) {
    yield put(changeSnackbar({ message: 'Thêm mới thất bại', status: true, variant: 'error' }));
    yield put(postTemplateTypeFailed());
  }
}

function* putTemplateTypeSaga(action) {
  try {
    const data = yield call(request, `${API_TEMPLATE}/category/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ message: `Cập nhật thành công ${data.data.title}`, status: true, variant: 'success' }));
    yield put(push('/setting/template_type'));
  } catch (error) {
    yield put(changeSnackbar({ message: error.message || "Cập nhật thất bại", status: true, variant: 'error' }));
    yield put(putTemplateTypeFailed());
  }
}

export default function* addTtPageSaga() {
  yield takeLatest('GET_TEMPLATE_TYPE', getTemplateTypeSaga);
  yield takeLatest('POST_TEMPLATE_TYPE', postTemplateTypeSaga);
  yield takeLatest('PUT_TEMPLATE_TYPE', putTemplateTypeSaga);
}
