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
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
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
export function fetchAddDepartment() {
  return {
    type: ADD_DEPARTMENT,
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
