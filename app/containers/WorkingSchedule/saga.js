import { takeLatest, call, put } from 'redux-saga/effects';
import { API_MEETING } from '../../config/urlConfig';
import { serialize } from '../../utils/common';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import { GET_DATA } from './constants';
import * as actions from './actions';
// import { makeSelectProfile } from '../Dashboard/selectors';

// Individual exports for testing

export function* getDataSaga() {
  const token = localStorage.getItem('token');
  try {
    // const profile = yield select(makeSelectProfile());
    const filter = { typeCalendar: '2' };
    const dataMeeting = yield call(request, `${API_MEETING}?${serialize({ filter })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (dataMeeting) {
      yield put(actions.getDataSuccess(dataMeeting.data));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy danh sách lịch đơn vị thất bại', variant: 'error' }));
    // console.log(err);
  }
}

export default function* workingScheduleSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getDataSaga);
}
