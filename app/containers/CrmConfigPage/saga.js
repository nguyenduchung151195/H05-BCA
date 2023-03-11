/* eslint-disable no-useless-escape */
import { call, put, select, takeLatest } from 'redux-saga/effects';
import qs from 'qs';
import { API_STATUS_CRMCONFIG, API_SOURCE_CRMCONFIG, API_CURRENCY, API_MONEY, API_LOCATION, API_TAX } from '../../config/urlConfig';
import _ from 'lodash';
import request from '../../utils/request';
import { setState } from '../ListPage/actions';
import { makeSelectBody } from './selectors';
import { serialize } from 'utils/common';
import { makeSelectRows } from '../ListPage/selectors';
import {
  fetchAllStatusFailAction,
  fetchAllStatusSuccessAction,
  addStatusSuccessAction,
  editCRMStatusSuccessAction,
  editCRMStatusFailAction,
  deleteCRMStatusSuccessAction,
  deleteCRMStatusFailAction,
  addStatusFailAction,
  updateStatusFailAction,
  updateStatusSuccessAction,
  deleteStatusSuccessAction,
  deleteStatusFailAction,
  updateStatusIndexSuccessAction,
  updateStatusIndexFailAction,
  fetchAllSourcesAction,
  fetchAllSourcesFailAction,
  fetchAllSourcesSuccessAction,
  addSourceSuccessAction,
  addSourceFailAction,
  editSourceSuccessAction,
  editSourceFailAction,
  updateSourcesFailAction,
  updateSourcesSuccessAction,
  deleteSourcesSuccessAction,
  deleteSourcesFailAction,
  deleteCRMSourcesSuccessAction,
  deleteCRMSourcesFailAction,
  fetchAllCurrencySuccess,
  fetchAllCurrencyFail,
  addCurrencySuccessAction,
  updateCurrencySuccessAction,
  // updateCurrencyFailAction,
  getMoneySuccess,
  getMoneyFail,
  getLocationSuccess,
  getLocationFail,
  fetchAllStatusAction,
  getTaxFail,
  getTaxSuccess,
  addTaxFail,
  addTaxSuccess,
  addTaxLevelSuccess,
  addTaxLevelFail,
  resetAllSourceSuccess,
  resetAllSourceFailure,
  resetAllStatusSuccess,
  resetAllStatusFailure,
  // updateTaxLevelSuccess,
} from './actions';
import {
  GET_ALL_STATUS,
  ADD_STATUS,
  DELETE_STATUS,
  UPDATE_STATUS,
  UPDATE_STATUS_INDEX,
  GET_ALL_SOURCES,
  ADD_SOURCE,
  EDIT_SOURCE,
  DELETE_SOURCES,
  DELETE_CRM_SOURCES,
  UPDATE_SOURCE,
  GET_ALL_CURRENCY,
  ADD_CURRENCY,
  UPDATE_CURRENCY,
  GET_MONEY,
  GET_LOCATION,
  ADD_CRM_STATUS,
  EDIT_CRM_STATUS,
  DELETE_CRM_STATUS,
  ADD_LOCATION,
  UPDATE_LOCATION,
  GET_TAX,
  ADD_TAX,
  UPDATE_TAX,
  ADD_TAX_LEVEL,
  RESET_ALL_SOURCE,
  RESET_ALL_STATUS,
} from './constants';
import { changeSnackbar } from '../Dashboard/actions';
function convertToSlug(text) {
  let slug;
  const title = text;
  // Lấy text từ thẻ input title

  // Đổi chữ hoa thành chữ thường
  slug = title.toLowerCase();

  // Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  // Xóa các ký tự đặt biệt
  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  // Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, '');
  // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');
  // Xóa các ký tự gạch ngang ở đầu và cuối
  slug = `@${slug}@`;
  // eslint-disable-next-line no-useless-escape
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');
  // In slug ra textbox có id “slug”
  return slug;
}
export function* fetchAddCRMStatus(action) {
  const token = localStorage.getItem('token');
  const code = convertToSlug(action.body);
  try {
    const addStatus = yield call(request, `${API_STATUS_CRMCONFIG}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.body, code, type: action.types }),
    });
    if (addStatus) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới cấu hình thành công', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    }
  } catch (err) {
    yield put(addStatusFailAction(err, 'Thêm mới cấu hình thất bại'));
  }
}

export function* fetchEditCRMStatus(action) {
  const token = localStorage.getItem('token');
  try {
    const editStatus = yield call(request, `${API_STATUS_CRMCONFIG}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.body }),
    });
    if (editStatus) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình thành công', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    }
  } catch (err) {
    yield put(editCRMStatusFailAction(err, 'Cập nhật cấu hình thất bại'));
  }
}

export function* fetchDeleteCRMStatus(action) {
  const token = localStorage.getItem('token');
  // const code = convertToSlug(action.body);
  try {
    const delteStatus = yield call(request, `${API_STATUS_CRMCONFIG}/${action.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // body: qs.stringify({ title: action.body }),
    });
    if (delteStatus) {
      yield put(changeSnackbar({ status: true, message: 'Xóa cấu hình thành công', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    }
  } catch (err) {
    yield put(deleteCRMStatusFailAction(err, 'Xóa cấu hình thất bại'));
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
export function* fetchAddStatus(action) {
  const token = localStorage.getItem('token');
  try {
    const addStatus = yield call(request, `${API_STATUS_CRMCONFIG}/createitem/${action.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (addStatus) {
      yield put(changeSnackbar({ status: true, message: 'Thêm trạng thái thành công', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    }
  } catch (err) {
    yield put(addStatusFailAction(err, 'Thêm trạng thái thất bại'));
  }
}
export function* fetchDeleteStatus(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedStatus = yield call(request, `${API_STATUS_CRMCONFIG}/deleteitem/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: action.statusId }),
    });

    if (deletedStatus) {
      yield put(changeSnackbar({ status: true, message: 'Xóa trạng thái thành công', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    }
  } catch (err) {
    yield put(deleteStatusFailAction(err, 'Xóa trạng thái thất bại'));
  }
}
export function* fetchUpdateStatus(action) {
  const token = localStorage.getItem('token');
  const newData = action.body;
  newData.id = newData._id;
  delete newData._id;
  try {
    const updateStatus = yield call(request, `${API_STATUS_CRMCONFIG}/updateitem/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(newData),
    });
    if (updateStatus) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thành công', variant: 'success' }));
      yield put(fetchAllStatusAction(action.types));
    }
  } catch (err) {
    yield put(updateStatusFailAction(err, 'Cập nhật trạng thái thất bại'));
  }
}
export function* fetchUpdateStatusIndex(action) {
  const token = localStorage.getItem('token');
  try {
    const updateStatus = yield call(request, `${API_STATUS_CRMCONFIG}/updateIndex/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: action.body }),
    });
    if (updateStatus) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thành công', variant: 'success' }));
      yield put(fetchAllStatusAction());
    }
  } catch (err) {
    yield put(updateStatusIndexFailAction(err, 'Cập nhật trạng thái thất bại'));
  }
}
export function* resetAllStatus(action) {
  const token = localStorage.getItem('token');
  try {
    const response = yield call(request, `${API_STATUS_CRMCONFIG}/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Hoàn tác dữ liệu cấu hình trạng thái thành công', variant: 'success' }));
      yield put(fetchAllStatusAction())
    }
  } catch (err) {
    yield put(resetAllStatusFailure(data));
    yield put(changeSnackbar({ status: true, message: 'Hoàn tác dữ liệu cấu hình trạng thái thất bại', variant: 'error' }));
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

export function* fetchDeleteSources(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedSources = yield call(request, `${API_SOURCE_CRMCONFIG}/${action.body}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body }),
    });
    if (deletedSources) {
      yield put(changeSnackbar({ status: true, message: 'Xóa cấu hình thành công', variant: 'success' }));
      yield put(fetchAllSourcesAction());
    }
  } catch (err) {
    yield put(deleteSourcesFailAction(err, 'Xóa kiểu thất bại'));
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

export function* fetchUpdateSources(action) {
  const token = localStorage.getItem('token');
  try {
    const body = { title: action.param.title, data: action.body }
    if (_.get(action, 'body[0].x')) body.specialType = true
    const updateSources = yield call(request, `${API_SOURCE_CRMCONFIG}/${action.param._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (updateSources) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình thành công', variant: 'success' }));
      yield put(fetchAllSourcesAction(action.types));
    }
  } catch (err) {
    yield put(updateSourcesFailAction(err, 'Cập nhật cấu hình thất bại'));
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

export function* fetchAllCurrency() {
  try {
    const currency = yield call(request, API_CURRENCY, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (currency) {
      yield put(fetchAllCurrencySuccess(currency));
    } else {
      yield put(fetchAllCurrencyFail());
    }
  } catch (err) {
    yield put(fetchAllCurrencyFail(err, 'Cập nhật loại tính thất bại'));
  }
}

export function* addCurrency(action) {
  try {
    yield call(request, API_CURRENCY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(addCurrencySuccessAction());
    yield put(changeSnackbar({ status: true, message: 'Thêm mới Tiền thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới Tiền thất bại', variant: 'error' }));
  }
}

export function* updateCurrency(action) {
  try {
    const data = yield call(request, `${API_CURRENCY}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      yield put(updateCurrencySuccessAction(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật Tiền thành công', variant: 'success' }));
      const rows = yield select(makeSelectRows());
      const newRows = rows.map(item => (item._id === action.id ? { ...item, base: 'Có' } : item));
      yield put(setState({ rows: newRows }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật Tiền thất bại', variant: 'error' }));
    }
  } catch (err) {
    // yield put(updateCurrencyFailAction(err, 'Cập nhật Tiền thất bại'));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật Tiền thất bại', variant: 'error' }));
  }
}

export function* getMoney() {
  try {
    const money = yield call(request, API_MONEY, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (money) {
      yield put(getMoneySuccess(money));
    } else {
      yield put(getMoneyFail());
    }
  } catch (err) {
    yield put(getMoneyFail(err, 'Cập nhật loại tính thất bại'));
  }
}

// Location

export function* getLocation() {
  try {
    const location = yield call(request, API_LOCATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (location) {
      yield put(getLocationSuccess(location));
    } else {
      yield put(getLocationFail());
    }
  } catch (err) {
    yield put(getLocationFail(err, 'Lấy dữ liệu thất bại'));
  }
}
export function* addLocation(action) {
  try {
    yield call(request, API_LOCATION, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(addCurrencySuccessAction());
    yield put(changeSnackbar({ status: true, message: 'Thêm mới Địa điểm thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới Địa điểm thất bại', variant: 'error' }));
  }
}
export function* updateLocation(action) {
  try {
    const data = yield call(request, `${API_LOCATION}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật Địa điểm thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật Địa điểm thất bại', variant: 'error' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật Địa điểm thất bại', variant: 'error' }));
  }
}

// TAX
export function* getTax() {
  try {
    const tax = yield call(request, API_TAX, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (tax) {
      yield put(getTaxSuccess(tax));
    } else {
      yield put(getTaxFail());
    }
  } catch (err) {
    yield put(getTaxFail(err, 'Lấy dữ liệu thất bại'));
  }
}

export function* addTax(action) {
  try {
    yield call(request, API_TAX, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(addTaxSuccess());
    yield put(changeSnackbar({ status: true, message: 'Thêm mới Thuế thành công', variant: 'success' }));
  } catch (error) {
    yield put(addTaxFail());
    yield put(changeSnackbar({ status: true, message: 'Thêm mới Thuế thất bại', variant: 'error' }));
  }
}
export function* updateTax(action) {
  try {
    const data = yield call(request, `${API_TAX}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật Thuế thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật Thuế thất bại', variant: 'error' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật Thuế thất bại', variant: 'error' }));
  }
}
export function* addTaxLevel(action) {
  try {
    const data = yield call(request, `${API_TAX}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(addTaxLevelSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới mức thuế thành công', variant: 'success' }));
  } catch (error) {
    yield put(addTaxLevelFail());
    yield put(changeSnackbar({ status: true, message: 'Thêm mới mức thuế thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* crmConfigPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_STATUS, fetchGetAllStatus);
  yield takeLatest(ADD_STATUS, fetchAddStatus);
  yield takeLatest(ADD_CRM_STATUS, fetchAddCRMStatus);
  yield takeLatest(EDIT_CRM_STATUS, fetchEditCRMStatus);
  yield takeLatest(DELETE_CRM_STATUS, fetchDeleteCRMStatus);
  yield takeLatest(DELETE_STATUS, fetchDeleteStatus);
  yield takeLatest(UPDATE_STATUS, fetchUpdateStatus);
  yield takeLatest(UPDATE_STATUS_INDEX, fetchUpdateStatusIndex);
  yield takeLatest(GET_ALL_SOURCES, fetchGetAllSources);
  yield takeLatest(ADD_SOURCE, fetchAddSource);
  yield takeLatest(EDIT_SOURCE, fetchEditSource);
  yield takeLatest(DELETE_SOURCES, fetchDeleteSources);
  yield takeLatest(DELETE_CRM_SOURCES, fetchDeleteCRMSource);
  yield takeLatest(UPDATE_SOURCE, fetchUpdateSources);
  yield takeLatest(GET_ALL_CURRENCY, fetchAllCurrency);
  yield takeLatest(ADD_CURRENCY, addCurrency);
  yield takeLatest(UPDATE_CURRENCY, updateCurrency);
  yield takeLatest(GET_MONEY, getMoney);
  yield takeLatest(GET_LOCATION, getLocation);
  yield takeLatest(ADD_LOCATION, addLocation);
  yield takeLatest(UPDATE_LOCATION, updateLocation);
  yield takeLatest(GET_TAX, getTax);
  yield takeLatest(ADD_TAX, addTax);
  yield takeLatest(UPDATE_TAX, updateTax);
  yield takeLatest(ADD_TAX_LEVEL, addTaxLevel);
  yield takeLatest(RESET_ALL_STATUS, resetAllStatus);
  yield takeLatest(RESET_ALL_SOURCE, resetAllSources);
}
