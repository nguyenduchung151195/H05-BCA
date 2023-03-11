/*
 *
 * AddWorkingSchedule actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  POST_DATA,
  POST_DATA_SUCCESS,
  GET_DEFAULT,
  GET_CURRENT,
  GET_CURRENT_SUCCESS,
  PUT_DATA,
  PUT_DATA_SUCCESS,
  GET_DATA,
  PUT_APPROVED, POST_GIVE_BACK_CALENDE
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
    cb
  };
}

export function postDataSuccess(data) {
  return {
    type: POST_DATA_SUCCESS,
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

export function putData(data, id, handleOpenBtnSave) {
  return {
    type: PUT_DATA,
    data,
    id,
    handleOpenBtnSave
  };
}

export function putDataSuccess(data) {
  return {
    type: PUT_DATA_SUCCESS,
    data,
  };
}

export function getData() {
  return {
    type: GET_DATA,
  };
}
export function putAppropved(data, id){
  return {
    type: PUT_APPROVED,
    data,
    id
  }
}
export function putAppropvedSuccess(data) {
  return {
    type: PUT_APPROVED_SUCCESS,
    data,
  };
}
export function postGiveBack(data,id){
  return {
    type: POST_GIVE_BACK_CALENDE,
    data, id
  }
}