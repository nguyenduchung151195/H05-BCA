import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { getItemsSuccess, getItemsFailed } from './actions';
import { GET_ITEMS } from './constants';

export function* getAllItems(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getItemsSuccess(data.data));
    } else {
      yield put(getItemsFailed({}));
    }
  } catch (err) {
    yield put(getItemsFailed(err));
  }
}

// Individual exports for testing
export default function* kanbanPluginSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ITEMS, getAllItems);
}
