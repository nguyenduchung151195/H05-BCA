/*
 *
 * EditProfilePage actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_PROFILE,
  GET_PROFILE_FAILED,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_FAILED,
  UPDATE_PROFILE_SUCCESS,
  CHANGE_MY_PASS,
  CHANGE_MY_PASS_SUCCESS,
  CHANGE_MY_PASS_ERROR,
  REPAIR_VIEWCONFIG,
  REPAIR_VIEWCONFIG_SUCCESS,
  REPAIR_VIEWCONFIG_ERROR,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function resetNoti() {
  return {
    type: RESET_NOTI,
  };
}

// get PROFILE conf
export function getProAct(body) {
  return {
    type: GET_PROFILE,
    body,
  };
}
export function getProSuccess(data) {
  return {
    type: GET_PROFILE_SUCCESS,
    data,
  };
}
export function getProFailed(err) {
  return {
    type: GET_PROFILE_FAILED,
    err,
  };
}

// update PROFILE
export function updateProAct(body) {
  return {
    type: UPDATE_PROFILE,
    body,
  };
}
export function updateProSuccess(data) {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    data,
  };
}
export function updateProFailed(err) {
  return {
    type: UPDATE_PROFILE_FAILED,
    err,
  };
}
// update PASSWORD
export function changeMyPassAct(body) {
  return {
    type: CHANGE_MY_PASS,
    body,
  };
}
export function changeMyPassSuccessAct(data) {
  return {
    type: CHANGE_MY_PASS_SUCCESS,
    data,
  };
}
export function changeMyPassErrorAct(err) {
  return {
    type: CHANGE_MY_PASS_ERROR,
    err,
  };
}
// REPAIR VIEWCONFIG
export function repairViewConfigAct(body) {
  return {
    type: REPAIR_VIEWCONFIG,
    body,
  };
}
export function repairViewConfigSuccessAct(data) {
  return {
    type: REPAIR_VIEWCONFIG_SUCCESS,
    data,
  };
}
export function repairViewConfigErrorAct(err) {
  return {
    type: REPAIR_VIEWCONFIG_ERROR,
    err,
  };
}
