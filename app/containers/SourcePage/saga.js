import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_TRADINGS, API_ORDER_PO } from '../../config/urlConfig';
import { GET_TRADING, GET_PO } from './constants';
import { getTradingSuccess, getTradingFailed, getPOSuccess, getPOFailed } from './actions';

export function* getItem(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_TRADINGS}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getTradingSuccess(data));
    } else {
      yield put(getTradingFailed({}));
    }
  } catch (err) {
    yield put(getTradingFailed(err));
  }
}

export function* getItemPO(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ORDER_PO}?filter%5BexchangingAgreement.exchangingAgreementId%5D=${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data) {
      yield put(getPOSuccess(data.data));
    } else {
      yield put(getPOFailed({}));
    }
  } catch (err) {
    yield put(getPOFailed(err));
  }
}

// Individual exports for testing
export default function* sourcePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_TRADING, getItem);
  yield takeEvery(GET_PO, getItemPO);
}
