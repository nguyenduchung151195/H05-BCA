/*
 *
 * MeetingRoom actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  POST_DATA,
  POST_DATA_SUCCESS,
  GET_CURRENT,
  GET_CURRENT_SUCCESS,
  PUT_DATA,
  PUT_DATA_SUCCESS,
  GET_DATA,
  GET_DATA_SUCCESS,
  POST_DATA_FAILED,
  PUT_DATA_FAILED
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

export function postData(data) {
  return {
    type: POST_DATA,
    data,
  };
}

export function postDataSuccess(data) {
  return {
    type: POST_DATA_SUCCESS,
    data,
  };
}

export function postDataFailed() {
  return {
    type: POST_DATA_FAILED,
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

export function putData(id, data) {
  return {
    type: PUT_DATA,
    id,
    data,
  };
}

export function putDataSuccess(data) {
  return {
    type: PUT_DATA_SUCCESS,
    data,
  };
}

export function putDataFailed() {
  return {
    type: PUT_DATA_FAILED,
  };
}

export function getData() {
  return {
    type: GET_DATA,
  };
}

export function getDataSuccess(meetings) {
  return {
    type: GET_DATA_SUCCESS,
    meetings,
  };
}
