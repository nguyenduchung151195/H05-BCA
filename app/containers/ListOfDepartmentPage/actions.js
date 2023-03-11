/*
 *
 * ListOfDepartmentPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_LIST_DEPARTMENT,
  GET_LIST_DEPARTMENT_SUCCESS,
  GET_LIST_DEPARTMENT_FALSE,
  ADD_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT_FALSE,
  ADD_DEPARTMENT,
  RESET_NOTI,
  UPDATE_DEPARTMENT,
  UPDATE_DEPARTMENT_FALSE,
  UPDATE_DEPARTMENT_SUCCESS,
  DELETE_DEPARTMENT,
  DELETE_DEPARTMENT_SUCCESS,
  DELETE_DEPARTMENT_FALSE,
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
export function fetchAddDepartment(body) {
  return {
    type: ADD_DEPARTMENT,
    body,
  };
}
export function fetchAddDepartmentSuccess(data) {
  return {
    type: ADD_DEPARTMENT_SUCCESS,
    data,
  };
}
export function fetchAddDepartmentFalse(err) {
  return {
    type: ADD_DEPARTMENT_FALSE,
    err,
  };
}
export function editDepartmentAct(body) {
  return {
    type: UPDATE_DEPARTMENT,
    body,
  };
}
export function editDepartmentSuccess(data) {
  return {
    type: UPDATE_DEPARTMENT_SUCCESS,
    data,
  };
}
export function editDepartmentFailed(err) {
  return {
    type: UPDATE_DEPARTMENT_FALSE,
    err,
  };
}
export function deleteDepartmentAct(body) {
  return {
    type: DELETE_DEPARTMENT,
    body,
  };
}
export function deleteDepartmentSuccess(data) {
  return {
    type: DELETE_DEPARTMENT_SUCCESS,
    data,
  };
}
export function deleteDepartmentFailed(err) {
  return {
    type: DELETE_DEPARTMENT_FALSE,
    err,
  };
}
