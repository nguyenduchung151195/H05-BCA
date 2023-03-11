/*
 *
 * CallPage actions
 *
 */

import { DEFAULT_ACTION, GET_CUSTOMER, GET_CUSTOMER_FAIL, GET_CUSTOMER_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getCustomerAction(customerId) {
  return {
    type: GET_CUSTOMER,
    customerId,
  };
}
export function getCustomerSuccessAction(data) {
  return {
    type: GET_CUSTOMER_SUCCESS,
    data,
    // message,
  };
}
export function getCustomerFailAction(err, message) {
  return {
    type: GET_CUSTOMER_FAIL,
    err,
    message,
  };
}
export function resetNotis() {
  return {
    type: DEFAULT_ACTION,
  };
}
