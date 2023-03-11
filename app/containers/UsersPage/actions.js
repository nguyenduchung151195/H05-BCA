/*
 *
 * UsersPage actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_ALL_USER_SUCCESS,
  GET_ALL_USER_FALSE,
  GET_ALL_USER,
  GET_CONFIG,
  GET_CONFIG_FALSE,
  GET_CONFIG_SUCCESS,
  UPDATE_GET_CONFIG_SUCCESS,
  UPDATE_GET_CONFIG_FALSE,
  UPDATE_GET_CONFIG,
  DELETE_USERS,
  DELETE_USERS_SUCCESS,
  DELETE_USERS_FALSE,
  GET_LIST_DEPARTMENT,
  GET_LIST_DEPARTMENT_FALSE,
  GET_LIST_DEPARTMENT_SUCCESS,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  MERGE_DATA
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
export function fetchAllUserAction(body) {
  return {
    type: GET_ALL_USER,
    body,
  };
}
export function fetchAllUserSuccessAction(data) {
  return {
    type: GET_ALL_USER_SUCCESS,
    data,
  };
}
export function fetchAllUserfalseAction() {
  return {
    type: GET_ALL_USER_FALSE,
  };
}
export function fetchConfigAction(id) {
  return {
    type: GET_CONFIG,
    id,
  };
}
export function fetchConfigSuccessAction(config) {
  return {
    type: GET_CONFIG_SUCCESS,
    config,
  };
}
export function fetchConfigfalseAction() {
  return {
    type: GET_CONFIG_FALSE,
  };
}
export function fetchUpdateConfigAction(body) {
  return {
    type: UPDATE_GET_CONFIG,
    body,
  };
}
export function fetchUpdateConfigSuccessAction(data) {
  return {
    type: UPDATE_GET_CONFIG_SUCCESS,
    data,
  };
}
export function fetchUpdateConfigfalseAction() {
  return {
    type: UPDATE_GET_CONFIG_FALSE,
  };
}
export function fetchDeleteUsersAction(body) {
  return {
    type: DELETE_USERS,
    body,
  };
}
export function fetchDeleteUsersSuccessAction(data) {
  return {
    type: DELETE_USERS_SUCCESS,
    data,
  };
}
export function fetchDelteUsersfalseAction() {
  return {
    type: DELETE_USERS_FALSE,
  };
}

export function fetchListDepartment() {
  return {
    type: GET_LIST_DEPARTMENT,
  };
}
export function fetchListDepartmentSuccess(data) {
  return {
    type: GET_LIST_DEPARTMENT_SUCCESS,
    data,
  };
}
export function fetchListDepartmentFalse(err) {
  return {
    type: GET_LIST_DEPARTMENT_FALSE,
    err,
  };
}
export function fetchChangePassword(body) {
  return {
    type: CHANGE_PASSWORD,
    body,
  };
}
export function fetchChangePasswordSuccess(data) {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
    data,
  };
}
export function fetchChangePasswordError(err) {
  return {
    type: CHANGE_PASSWORD_ERROR,
    err,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}