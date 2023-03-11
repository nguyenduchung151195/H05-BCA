/*
 *
 * SystemConfigPage actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_SYS_CONF,
  GET_SYS_CONF_FAILED,
  GET_SYS_CONF_SUCCESS,
  UPDATE_SYS_CONF,
  UPDATE_SYS_CONF_FAILED,
  UPDATE_SYS_CONF_SUCCESS,
  CREATE_CONFIG_CODE,
  CREATE_CONFIG_CODE_SUCCESS,
  CREATE_CONFIG_CODE_FAILED,
  GET_CONFIG_CODE,
  GET_CONFIG_CODE_SUCCESS,
  GET_CONFIG_CODE_FAILED,
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

// get sys conf
export function getSysConfAct(body) {
  return {
    type: GET_SYS_CONF,
    body,
  };
}
export function getSysConfSuccess(data) {
  return {
    type: GET_SYS_CONF_SUCCESS,
    data,
  };
}
export function getSysConfFailed(err) {
  return {
    type: GET_SYS_CONF_FAILED,
    err,
  };
}

// update sys conf
export function updateSysConfAct(body) {
  return {
    type: UPDATE_SYS_CONF,
    body,
  };
}
export function updateSysConfSuccess(data) {
  return {
    type: UPDATE_SYS_CONF_SUCCESS,
    data,
  };
}
export function updateSysConfFailed(err) {
  return {
    type: UPDATE_SYS_CONF_FAILED,
    err,
  };
}

// TT - UPDATE=CREATE CODE - 12
// TT - save config code :
export function createConfigCodeAct(body) {
  return {
    type: CREATE_CONFIG_CODE,
    body,
  };
}
// TT - UPDATE=CREATE CODE - 16
export function createConfigCodeActSuccess(data) {
  return {
    type: CREATE_CONFIG_CODE_SUCCESS,
    data,
  };
}
export function createConfigCodeActFailed(err) {
  return {
    type: CREATE_CONFIG_CODE_FAILED,
    err,
  };
}

export function getConfigCodeAct(body) {
  return {
    type: GET_CONFIG_CODE,
    body,
  };
}

export function getConfigCodeActSuccess(data) {
  return {
    type: GET_CONFIG_CODE_SUCCESS,
    data,
  };
}
export function getConfigCodeActFailed(err) {
  return {
    type: GET_CONFIG_CODE_FAILED,
    err,
  };
}
