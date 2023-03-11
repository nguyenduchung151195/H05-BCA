/*
 *
 * HistoryLog actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_LOG_ACTION,
  GET_LOG_SUCCESS_ACTION,
  GET_LOG_FAILED_ACTION,
  DELETE_LOGS_FAIL_ACTION,
  DELETE_LOGS_ACTION,
  DELETE_LOGS_SUCCESS_ACTION,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getLogAct(query) {
  return {
    type: GET_LOG_ACTION,
    query,
  };
}

export function getLogSuccessAct(data) {
  return {
    type: GET_LOG_SUCCESS_ACTION,
    data,
  };
}

export function getLogsFailedAct(err) {
  return {
    type: GET_LOG_FAILED_ACTION,
    err,
  };
}

export function deleteLogsAction(ids) {
  return {
    type: DELETE_LOGS_ACTION,
    ids,
  };
}

export function deleteLogsSuccessAction(data) {
  return {
    type: DELETE_LOGS_SUCCESS_ACTION,
    data,
  };
}

export function deleteLogsFailActiont(err) {
  return {
    DELETE_LOGS_FAIL_ACTION,
    err,
  };
}
