import { takeLatest, call, put } from 'redux-saga/effects';
import { API_SAMPLE_PROCESS } from '../../config/urlConfig';
import request from '../../utils/request';
import { getTemplateSuccess } from './actions';
import { GET_TEMPLATE } from './constants';
import { changeSnackbar } from '../Dashboard/actions';

// Individual exports for testing

export function* getTemplate() {
  try {
    const templates = yield call(request, API_SAMPLE_PROCESS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(getTemplateSuccess(templates));
  } catch (err) {
    //console.log('ERR', err);

    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export default function* sampleProcessSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_TEMPLATE, getTemplate);
}
