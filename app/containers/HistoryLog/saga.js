import { call, put, takeLatest } from 'redux-saga/effects';
import { getLogSuccessAct, getLogAct } from './actions';
import { GET_LOG_ACTION, DELETE_LOGS_ACTION } from './constants';
import { serialize } from '../../utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import { API_LOG, API_COMMON } from '../../config/urlConfig';
import request from '../../utils/request';
// Individual exports for testing
export function* fetchGetLogs(action) {
  try {
    const data = yield call(request, `${API_LOG}?${serialize({ filter: action.query })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const employeeIds = [];
    data.data.forEach(element => {
      if (element.employee) {
        if (!employeeIds.includes(element.employee.employeeId)) {
          employeeIds.push(element.employee.employeeId);
        }
      }
    });
    const param = {
      model: 'Employee',
      ids: employeeIds,
    };
    const convertedParam = serialize(param);
    try {
      const employeeInfors = yield call(request, `${API_COMMON}?${convertedParam}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (employeeInfors) {
        const mergeData = data.data.map(item => {
          const employeeInfor = employeeInfors.data.find(d => String(d._id) === String(item.employee ? item.employee.employeeId : ''));
          if (employeeInfor) {
            item.employee = { ...item.employee, ...employeeInfor };
          }
          return item;
        });
        yield put(getLogSuccessAct(mergeData));
      }
    } catch (err) {
      // console.log(err);
    }
  } catch (err) {
    // console.log(err);
    // yield put(getLogFailedAct(err));
  }
}
export function* deleteLogs(action) {
  try {
    const deletedLogs = yield call(request, `${API_LOG}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.ids }),
    });

    if (deletedLogs) {
      yield put(getLogAct({ objectId: deletedLogs.data[0].objectId }));
      yield put(changeSnackbar({ status: true, message: 'Xóa lịch sử thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Xóa lịch sử thất bại', variant: 'error' }));
  }
}
export default function* historyLogSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_LOG_ACTION, fetchGetLogs);
  yield takeLatest(DELETE_LOGS_ACTION, deleteLogs);
}
