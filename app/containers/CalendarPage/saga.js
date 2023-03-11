import { call, put, takeLatest } from 'redux-saga/effects';
import { getMeetingSuccessAct, getVisitSuccessAct } from './actions';
import { GET_MEETING_ACTION, GET_VISIT_ACTION } from './constants';
import { serialize } from '../../utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import { API_MEETING, API_VISIT } from '../../config/urlConfig';
import request from '../../utils/request';

// Individual exports for testing
export function* getMeeting(action) {
  try {
    const data = yield call(request, `${API_MEETING}?${serialize({ filter: action.query })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    // const data = yield call(request, `${API_MEETING}`, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`,
    //   },
    // });

    yield put(getMeetingSuccessAct(data.data));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy lịch thất bại', variant: 'error' }));
  }
}
export function* getVisit(action) {
  try {
    const data = yield call(request, `${API_VISIT}?${serialize({ filter: action.query })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(getVisitSuccessAct(data.data));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy lịch thăm doanh nghiệp thất bại', variant: 'error' }));
  }
}
export default function* calendarPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_MEETING_ACTION, getMeeting);
  yield takeLatest(GET_VISIT_ACTION, getVisit);
}
