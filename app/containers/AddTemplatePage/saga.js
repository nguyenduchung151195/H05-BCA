import { call, put, takeLatest } from 'redux-saga/effects';

import { push } from 'react-router-redux';
import request from 'utils/request';
import { API_TEMPLATE } from 'config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import {
  getTemplateSuccess,
  putTemplateFailed,
  postTemplateFailed,
  getAllTemplateSuccess,
  getAllTemplateFailure,
  getAllModuleCodeSuccess,
  getAllModuleCodeFailure,
} from './actions';
import { GET_ALL_MODULE_CODE, GET_ALL_TEMPLATE } from './constants';
import { clientId } from '../../variable';
import { postTemplateSuccess } from './actions';
import { putTemplateSuccess } from './actions';
import { delSpace } from 'utils/common';
import { API_COMMON_MODULE } from '../../config/urlConfig';
import { serialize } from '../../helper';
export function* getAllTemplateSaga() {
  let filter = { filter: { $or: [{ clientId }, { clientId: 'ALL' }] } };
  try {
    const res = yield call(request, `${API_TEMPLATE}?${serialize(filter)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (res) {
      yield put(getAllTemplateSuccess(res));
    } else {
      yield put(getAllTemplateFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* getTemplateSaga(action) {
  try {
    const dataTemplateType = yield call(request, `${API_TEMPLATE}/category`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const d = dataTemplateType.data;
    d.forEach((item, index) => {
      if (item.alwaysUsed == false) {
        dataTemplateType.data.splice(index, 1);
      }
    });
    let data = { templateTypes: dataTemplateType.data };
    if (action.id !== 'add') {
      const dataTemplate = yield call(request, `${API_TEMPLATE}/${action.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const newDataTemplate = { ...dataTemplate, categoryDynamicForm: dataTemplate.categoryDynamicForm._id };
      data = { ...data, ...newDataTemplate };
    }
    yield put(getTemplateSuccess(data, action.id));
    if(data.selection == 1) {
      action.getData(data)
    }else  {
      action.getTem();
    }
  } catch (error) {
    console.log(error, 'error')
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* postTemplateSaga(action) {
  try {
    const data = yield call(request, API_TEMPLATE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(delSpace(action.data)),
    });
    const smartForms = localStorage.getItem('smartForms');
    const smart_Forms = JSON.parse(smartForms);
    smart_Forms.push(data.data);
    const newSmartForm = JSON.stringify(smart_Forms);
    localStorage.setItem('smartForms', newSmartForm);
    yield put(postTemplateSuccess(data));
    yield put(changeSnackbar({ message: `Thêm mới thành công ${data.data.title}`, status: true, variant: 'success' }));
    // yield put(push(`/crm/suppliers/${supplierInfo.data._id}`));
    yield put(push('/setting/DynamicForm'));
  } catch (error) {
    yield put(changeSnackbar({ message: error.message ||  'Thêm mới thất bại', status: true, variant: 'error' }));
    yield put(postTemplateFailed());
  }
}

function* putTemplateSaga(action) {
  try {
    const data = yield call(request, `${API_TEMPLATE}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(delSpace(action.data)),
    });
    const smartForms = localStorage.getItem('smartForms');
    let smart_Forms = JSON.parse(smartForms);
    smart_Forms.forEach((item, index) => {
      if (item.code === data.data.code) {
        smart_Forms.splice(index, 1, data.data);
      }
    });
    const newSmartForm = JSON.stringify(smart_Forms);
    localStorage.setItem('smartForms', newSmartForm);
    yield put(putTemplateSuccess(data));
    yield put(changeSnackbar({ message: `Cập nhật thành công`, status: true, variant: 'success' }));
    yield put(push('/setting/DynamicForm'));
  } catch (error) {
    yield put(changeSnackbar({ message: error.message || 'Cập nhật thất bại.', status: true, variant: 'error' }));
    yield put(putTemplateFailed());
  }
}

function* getAllModuleCodeSaga(action) {
  try {
    const res = yield call(request, `${API_COMMON_MODULE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (res) {
      //console.log('res', res);
      yield put(getAllModuleCodeSuccess(res));
    } else {
      yield put(getAllModuleCodeFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

export default function* addTemplatePageSaga() {
  yield takeLatest('GET_TEMPLATE', getTemplateSaga);
  yield takeLatest('POST_TEMPLATE', postTemplateSaga);
  yield takeLatest('PUT_TEMPLATE', putTemplateSaga);
  yield takeLatest(GET_ALL_TEMPLATE, getAllTemplateSaga);
  yield takeLatest(GET_ALL_MODULE_CODE, getAllModuleCodeSaga);
}
