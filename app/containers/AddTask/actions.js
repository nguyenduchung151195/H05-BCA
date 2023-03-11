/*
 *
 * AddTask actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_TASK,
  GET_TASK_SUCCESS,
  GET_TASK_FAIL,
  SET_STATE,
  HANDLE_DISCOUNT,
  POST_TASK,
  POST_TASK_FAIL,
  POST_TASK_SUCCESS,
  GET_DEFAULT,
  GET_TASK_CURRENT,
  GET_TASK_CURRENT_SUCCESS,
  GET_TASK_CURRENT_FAIL,
  PUT_TASK,
  PUT_TASK_FAIL,
  PUT_TASK_SUCCESS,
  CLOSE_TASK,
  PUT_PROGRESS,
  PUT_PROGRESS_SUCCESS,
  MERGE_DATA,
  POST_TRANFER,
  POST_TRANFER_SUCCESS,
  GET_PROJECT_DEFAULT_ID,
  POST_FILE,
  GET_PARENT,
  GET_PARENT_SUCCESS,
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
export function getTask() {
  return {
    type: GET_TASK,
  };
}
export function getTaskSuccess(tasks, customers, employees, templates, projects, profile) {
  return {
    type: GET_TASK_SUCCESS,
    tasks, // luu cong viec
    customers,
    employees,
    projects,
    profile,
  };
}
export function getTaskFail(err) {
  return {
    type: GET_TASK_FAIL,
    err,
  };
}

export const handleChange = (name, value) => ({ type: SET_STATE, name, value });

export function handleDiscount(name, checked) {
  return {
    type: HANDLE_DISCOUNT,
    name,
    checked,
  };
}
export function postTask(data) {
  return {
    type: POST_TASK,
    data,
  };
}
export function postTaskSuccess(message) {
  return {
    type: POST_TASK_SUCCESS,
    message,
  };
}
export function postTaskFail(err) {
  return {
    type: POST_TASK_FAIL,
    err,
  };
}
export function getDefault(data) {
  return {
    type: GET_DEFAULT,
    data,
  };
}

export function getTaskCurrent(id) {
  return {
    type: GET_TASK_CURRENT,
    id,
  };
}
export function getTaskCurrentSuccess(data) {
  return {
    type: GET_TASK_CURRENT_SUCCESS,
    data,
  };
}
export function getTaskCurrentFail(err) {
  return {
    type: GET_TASK_CURRENT_FAIL,
    err,
  };
}
export function putTask(data, id) {
  return {
    type: PUT_TASK,
    data,
    id,
  };
}
export function putTaskSuccess(data) {
  return {
    type: PUT_TASK_SUCCESS,
    data,
  };
}
export function putTaskFail(err) {
  return {
    type: PUT_TASK_FAIL,
    err,
  };
}
export function onCloseTask(data) {
  return {
    type: CLOSE_TASK,
    data,
  };
}
export function putProgress(data, id) {
  return {
    type: PUT_PROGRESS,
    data,
    id,
  };
}
export function putProgressSuccess(data) {
  return {
    type: PUT_PROGRESS_SUCCESS,
    data,
  };
}
export function postTranfer(data, id) {
  return {
    type: POST_TRANFER,
    data,
    id,
  };
}
export function postTranferSuccess(data) {
  return {
    type: POST_TRANFER_SUCCESS,
    data,
  };
}
export function getDefaultProjectId(id) {
  return {
    type: GET_PROJECT_DEFAULT_ID,
    id,
  };
}

export function postFile(data) {
  return {
    type: POST_FILE,
    data,
  };
}

export function getParent(id) {
  return {
    type: GET_PARENT,
    id,
  };
}
export function getParentSuccess(data) {
  return {
    type: GET_PARENT_SUCCESS,
    data,
  };
}
