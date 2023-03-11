/*
 *
 * AddMeetingSchedule actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  POST_DATA,
  POST_DATA_SUCCESS,
  POST_DATA_FAILED,
  PUT_DATA,
  PUT_DATA_SUCCESS,
  PUT_DATA_FAILED,
  GET_CURRENT,
  GET_CURRENT_SUCCESS,
  GET_DEFAULT,
  GET_DATA,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function postData(data, cb) {
  return {
    type: POST_DATA,
    data,
    cb,
  };
}

export function postDataSuccess(data) {
  return {
    type: POST_DATA_SUCCESS,
    data,
  };
}

export function postDataFailed(data) {
  return {
    type: POST_DATA_FAILED,
    data,
  };
}

export function putData(data, id, cb) {
  return {
    type: PUT_DATA,
    data,
    id,
    cb
  };
}

export function putDataSuccess(data) {
  return {
    type: PUT_DATA_SUCCESS,
    data,
  };
}

export function putDataFailed(data) {
  return {
    type: PUT_DATA_FAILED,
    data,
  };
}

export function getCurrent(id) {
  return {
    type: GET_CURRENT,
    id,
  };
}

export function getCurrentSuccess(data) {
  return {
    type: GET_CURRENT_SUCCESS,
    data,
  };
}

export function getDefault() {
  return {
    type: GET_DEFAULT,
  };
}

export function getData() {
  return {
    type: GET_DATA,
  };
}
