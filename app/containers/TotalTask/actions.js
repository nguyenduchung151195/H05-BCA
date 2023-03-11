/*
 *
 * TotalTask actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, GET_TASKS, GET_TASKS_SUCCESS, DELETE_TASKS, ADD_BO, ADD_BO_SUCCESS, GET_TASK_FOR_TIMEMANAGEMENT } from './constants';

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

export function getTasks(data) {
  return {
    type: GET_TASKS,
    queryString: data,
  };
}

export function getTasksForTimeManagement(data) {
  return {
    type: GET_TASK_FOR_TIMEMANAGEMENT,
  };
}

export function getTasksSuccess(data) {
  return {
    type: GET_TASKS_SUCCESS,
    data,
  };
}

export function deleteTasks(data) {
  return {
    type: DELETE_TASKS,
    data,
  };
}

export function addBoAction(doc) {
  return {
    type: ADD_BO,
    doc,
  };
}
export function addBoSuccessAction(data, message) {
  return {
    type: ADD_BO_SUCCESS,
    data,
    message,
  };
}
