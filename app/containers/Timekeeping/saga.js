import { takeLatest, call, put } from 'redux-saga/effects';
import moment from 'moment';
import { API_MEETING, API_NOTIFY, API_SALARY } from '../../config/urlConfig';
import { serialize } from '../../utils/common';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import { addSalarySuccess } from './actions'
import { ADD_MEETING, GET_ALL_MEETINGS, ADD_MEETING_SUCCESS, DELETE_MEETINGS, ADD_Salary, UPDATE_Salary } from './constants';
import * as actions from './actions';
import { deleteMeetingsSuccessAction, deleteMeetingsFailAction } from './actions'
// Individual exports for testing

export function* fetchCreateMeeting(action) {
  const token = localStorage.getItem('token');
  try {
    const createdMeeting = yield call(request, `${API_MEETING}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.meeting),
    });
    if (action.reminderBefore) {
      const reminder = {
        date: moment(action.meeting.timeStart * 1000),
        title: action.meeting.name,
        content: action.meeting.content,
      };

      // console.log(moment(reminder.date).format('DD/MM/YYYY hh:mm:ss'));
      if (action.reminderBefore === '1 day') {
        reminder.date = moment(reminder.date)
          .subtract(1, 'day')
          .unix();
        // console.log(moment(reminder.date).format('DD/MM/YYYY hh:mm:ss'));
      }
      if (action.reminderBefore === '1 hour') {
        reminder.date = moment(reminder.date)
          .subtract(1, 'hour')
          .unix();
        // console.log(moment(reminder.date).format('DD/MM/YYYY hh:mm:ss'));
      }
      if (action.reminderBefore === '30 mins') {
        reminder.date = moment(reminder.date)
          .subtract(30, 'minute')
          .unix();
        // console.log(moment(reminder.date).format('DD/MM/YYYY hh:mm:ss'));
      }
      const createdReminder = yield call(request, `${API_NOTIFY}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminder),
      });
      if (!createdReminder) {
        yield put(changeSnackbar({ status: true, message: 'Tạo nhắc lịch thất bại', variant: 'error' }));
      }
    }
    if (createdMeeting) {
      yield put(changeSnackbar({ status: true, message: 'Tạo lịch cá nhân thành công', variant: 'success' }));
      yield put(actions.addMeetingSuccessAction());
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Tạo lịch cá nhân thất bại', variant: 'error' }));
  }
}

export function* fetchDeleteMeeting(action) {
  const token = localStorage.getItem('token');
  try {
    const deletedMeeting = yield call(request, API_MEETING, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: [action.deleteIds] }),
    });
    if (deletedMeeting) {
      yield put(deleteMeetingsSuccessAction(deletedMeeting.message ? deletedMeeting.message : 'Xóa thành công'));
      yield put(changeSnackbar({ status: true, message: deletedMeeting.message ? deletedMeeting.message : 'Xóa thành công', variant: deletedMeeting.success ? 'success' : 'error' }));
    }
  } catch (err) {
    yield put(deleteMeetingsFailAction(err, 'Xóa thất bại'));
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}
export function* fetchGetMeeting(action) {
  const token = localStorage.getItem('token');
  try {
    const dataMeeting = yield call(request, `${API_MEETING}?${serialize({ filter: action.query })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (dataMeeting) {
      yield put(actions.getAllMeetingsSuccessAction(dataMeeting.data));
    }
  } catch (err) {
    yield put(actions.getAllMeetingsFailAction());
    yield put(changeSnackbar({ status: true, message: 'Lấy danh sách lịch cá nhân thất bại', variant: 'error' }));
  }
}



////
export function* fetchAddSalary(action) {
  const token = localStorage.getItem('token');
  try {
    const createdSalary = yield call(request, `${API_SALARY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (createdSalary.status) {
      yield put(changeSnackbar({ status: true, message: 'Tạo nháp thành công ! ', variant: 'success' }));
      yield put(addSalarySuccess());
      if (action.close) action.close()
    } else {
      yield put(changeSnackbar({ status: true, message: createdSalary.message || 'Tạo nháp thất bại ! ', variant: 'error' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Tạo nháp thất bại ! ', variant: 'error' }));
  }
}
export function* fetchUpdateSalary(action) {
  const token = localStorage.getItem('token');
  try {
    const updateSalary = yield call(request, `${API_SALARY}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    console.log(updateSalary, 'updateSalary')
    if (updateSalary.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công ! ', variant: 'success' }));
      yield put(addSalarySuccess());
      if (action.close) action.close()
    } else {
      yield put(changeSnackbar({ status: true, message: createdSalary.message || 'Tạo nháp thất bại ! ', variant: 'error' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Tạo nháp thất bại ! ', variant: 'error' }));
  }
}
export default function* meetingPageSaga() {
  // See example in containers/HomePage/saga.js
  // yield takeLatest(ADD_MEETING, fetchCreateMeeting);
  // yield takeLatest(GET_ALL_MEETINGS, fetchGetMeeting);
  // yield takeLatest(ADD_MEETING_SUCCESS, fetchGetMeeting);
  // yield takeLatest(DELETE_MEETINGS, fetchDeleteMeeting);

  yield takeLatest(ADD_Salary, fetchAddSalary);
  yield takeLatest(UPDATE_Salary, fetchUpdateSalary);



}
