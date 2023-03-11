import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from '../../utils/request';
import {
  GET_CONTRACT,
  API_TASK_PROJECT,
  API_CUSTOMERS,
  API_BOS,
  API_CRITERIA,
  API_REPORT_TASKS_STATUS,
  APP_URL,
  APP_REPORT_URL,
} from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { mergeData, getRevenueChartDataSuccess, getProfitChartSuccess, getDataSuccess } from './actions';
import { GET_API, GET_KPI, GET_PROFIT_CHART, GET_REVENUE_CHART_DATA, GET_DATA } from './constants';
import { serialize } from '../../utils/common';
import { makeSelectProfile } from '../Dashboard/selectors';
import { API_MEETING } from '../../config/urlConfig';
// Individual exports for testing
export function* getApiSaga() {
  try {
    const response = yield call(request, API_REPORT_TASKS_STATUS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.status === 1) {
      yield put(mergeData(response.data));
    }
  } catch (error) {
    //console.log('get tasks status error', error);
  }
}

export function* getKpiSaga() {
  try {
    const kpiDashBoard = yield call(request, `${API_CRITERIA}/dashboardHome`, {
      method: 'GET',
    });
    yield put(
      mergeData({
        columnXChart: kpiDashBoard.revenue,
        columnCylinder: kpiDashBoard.customer,
      }),
    );
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu KPI thất bại', variant: 'error' }));
  }
}

export function* fetchRevenueChartData() {
  try {
    const { status, data: revenueChartData, message } = yield call(request, `${APP_REPORT_URL}/api/chart`, {
      method: 'GET',
    });
    if (status === 1) {
      const currentYear = new Date().getFullYear();
      if (Array.isArray(revenueChartData) && revenueChartData.length === 12) {
        const newRevenueChartData = revenueChartData.map((monthRevenue, i) => {
          const date = `${currentYear}-${(i + 1).toString().padStart(2, '0')}`;
          return {
            date,
            market1: monthRevenue.now || 0,
            market2: monthRevenue.before || 0,
            sales1: monthRevenue.planKpi || 0,
            sales2: monthRevenue.realityKpi || 0,
          };
        });
        yield put(getRevenueChartDataSuccess(newRevenueChartData));
      }
    } else {
      yield put(changeSnackbar({ status: true, message: message || 'Lấy dữ liệu biểu đồ doanh thu thất bại', variant: 'error' }));
    }
  } catch (error) {
    //console.log('error', error);
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu biểu đồ doanh thu thất bại', variant: 'error' }));
  }
}

export function* getProfitChartSaga() {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${APP_REPORT_URL}/api/report/report-profit-in-year`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    if (res && res.status === 1) {
      yield put(getProfitChartSuccess(res.data));
    } else {
      yield put(changeSnackbar({ status: true, message: message || 'Lấy dữ liệu biểu đồ lợi nhuận thất bại', variant: 'error' }));
    }
  } catch (error) {
    //console.log('error', error);
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu biểu đồ lợi nhuận thất bại', variant: 'error' }));
  }
}

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
      //console.log("this is data .................",dataMeeting);
      yield put(getDataSuccess(dataMeeting.data));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy danh sách lịch công tác thất bại', variant: 'error' }));
    // console.log(err);
  }
}

export default function* dashboardHomeSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_API, getApiSaga);
  yield takeLatest(GET_KPI, getKpiSaga);
  yield takeLatest(GET_REVENUE_CHART_DATA, fetchRevenueChartData);
  yield takeLatest(GET_PROFIT_CHART, getProfitChartSaga);
  yield takeLatest(GET_DATA, getDataSaga);
}
