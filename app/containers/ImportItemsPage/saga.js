import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_ORDER_PO } from '../../config/urlConfig';
import { GET_ALL_ITEMS, DELETE_ITEMS } from './constants';
import { getAllItemsSuccess, getAllItemsFailed, deleteItemsSuccess, deleteItemsFailed } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
// import { serialize } from '../../helper';

export function* getAllItems(action) {
  let url = '';
  const token = localStorage.getItem('token');
  if (action.query) {
    url = `${API_ORDER_PO}?${action.query}`;
  } else {
    url = `${API_ORDER_PO}`;
  }

  try {
    const data = yield call(request, `${url}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllItemsSuccess({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
    } else {
      yield put(getAllItemsFailed({}));
    }
  } catch (err) {
    yield put(getAllItemsFailed(err));
  }
}

export function* deleteItems(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ORDER_PO}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body.ids }),
    });
    if (data.success) {
      yield put(deleteItemsSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      const dataNew = yield call(request, `${API_ORDER_PO}?limit=${action.body.limit}&skip=${action.body.skip}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data) {
        yield put(getAllItemsSuccess({ data: dataNew.data, count: dataNew.count, skip: dataNew.skip, limit: dataNew.limit }));
      } else {
        yield put(getAllItemsFailed({}));
      }
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
      yield put(deleteItemsFailed());
    }
  } catch (err) {
    yield put(deleteItemsFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* importItemsPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ALL_ITEMS, getAllItems);
  yield takeEvery(DELETE_ITEMS, deleteItems);
}
