import { takeLatest, call, put } from 'redux-saga/effects';

import { push } from 'react-router-redux';
// Individual exports for testing
import { API_SAMPLE_PROCESS } from '../../config/urlConfig';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import { POST_TEMPLATE, GET_TEMPLATE, PUT_TEMPLATE } from './constants';
import { postTemplateSuccess, getTemplateSuccess, putTemplateSuccess } from './actions';

function* postTemplate(action) {
  try {
    // alert('gfg');
    yield call(request, API_SAMPLE_PROCESS, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(postTemplateSuccess());
    yield put(changeSnackbar({ status: true, message: 'Thêm mới quy trình mẫu thành công', variant: 'success' }));
    yield put(push('/Task/TemplateTask'));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới quy trình mẫu thất bại', variant: 'error' }));
  }
}
function* getTemplate(action) {
  try {
    const data = yield call(request, `${API_SAMPLE_PROCESS}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    data.errorName = false;
    yield put(getTemplateSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy quy trình thất bại', variant: 'error' }));
  }
}

function* putTemplate(action) {
  try {
    const data = yield call(request, `${API_SAMPLE_PROCESS}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(putTemplateSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật quy trình mẫu thành công', variant: 'success' }));
    yield put(push('/Task/TemplateTask'));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật quy trình mẫu thất bại', variant: 'error' }));
  }
}

export default function* addSampleProcessSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_TEMPLATE, postTemplate);
  yield takeLatest(GET_TEMPLATE, getTemplate);
  yield takeLatest(PUT_TEMPLATE, putTemplate);
}
