import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { serialize } from '../../helper';
import { getDataSuccessAction, getDataErrorAction } from './actions';
import { GET_DATA } from './constants';
export function* getData(action) {
  const token = localStorage.getItem('token');
  const { filter, url } = action.query;
  const toQuery = serialize(filter);

  const toqueryProps = serialize(action.queryProps);
  try {
    const data = yield call(request, `${url}?${toQuery}${action.queryProps !== '' ? `&${toqueryProps}` : ''}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data) {
      yield put(getDataSuccessAction(data));
    }
  } catch (err) {
    yield put(getDataErrorAction(err));
  }
}

// Individual exports for testing
export default function* calendarContainerSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getData);
}
