import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_CUSTOMERS } from '../../config/urlConfig';
import { GET_CUSTOMER } from './constants';
import { getCustomerFailAction, getCustomerSuccessAction } from './actions';
// Individual exports for testing
export function* getCustomer(action) {
  // console.log(action);
  try {
    const data = yield call(request, `${API_CUSTOMERS}/${action.customerId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data && data.phoneNumber) {
      yield put(getCustomerSuccessAction(data.phoneNumber));
    } else {
      yield put(getCustomerSuccessAction('nodata'));
    }
  } catch (err) {
    yield put(getCustomerFailAction(err));
  }
}
export default function* callPageSaga() {
  yield takeLatest(GET_CUSTOMER, getCustomer);
  // See example in containers/HomePage/saga.js
}
