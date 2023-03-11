/*
 *
 * CalendarContainer actions
 *
 */

import { DEFAULT_ACTION, GET_DATA, GET_DATA_SUCCESS, GET_DATA_ERROR } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getDataAction(query, queryProps) {
  return {
    type: GET_DATA,
    query,
    queryProps,
  };
}
export function getDataSuccessAction(data) {
  return {
    type: GET_DATA_SUCCESS,
    data,
  };
}
export function getDataErrorAction(err) {
  return {
    type: GET_DATA_ERROR,
    err,
  };
}
