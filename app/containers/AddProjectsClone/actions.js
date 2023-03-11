/*
 *
 * AddProjects actions
 *
 */
import {
  DEFAULT_ACTION,
  MERGE_DATA,
  SET_STATE,
  POST_PROJECT,
  PUT_PROJECT,
  GET_PROJECT_CURRENT,
  PUT_PROGRESS,
  POST_TRANFER,
  POST_FILE,
  PUT_PROGRESS_SUCCESS,
  POST_CONVERSATION,
  PUT_RATIO,
  POST_DRIVE,
  GET_DATA,
  GET_DATA_SUCCESS,
  POST_FILE_SYSTEM,
  POST_APPROVE,
  POST_APPROVE_SUCCESS,
  GET_PROJECT_CURRENT_SUCCESS,
  GET_EMPLOYEE,
  GET_EMPLOYEE_SUCCESS,
  CLEAN,
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
export const handleChange = (name, value) => ({ type: SET_STATE, name, value });

export function postFile(data) {
  return {
    type: POST_FILE,
    data,
  };
}
export function postProject(data,cb) {
  return {
    type: POST_PROJECT,
    data,
    cb,
  };
}

export function getProjectCurrent(id, data) {
  return {
    type: GET_PROJECT_CURRENT,
    id,
    data,
  };
}

export function getProjectCurrentSuccess(data) {
  return {
    type: GET_PROJECT_CURRENT_SUCCESS,
    data,
  };
}

export function putProject(data, id, cb) {
  return {
    type: PUT_PROJECT,
    data,
    id,
    cb,
  };
}

export function putProgress(data, id) {
  return {
    type: PUT_PROGRESS,
    data,
    id,
  };
}

export function postTranfer(data, id, tranfer) {
  return {
    type: POST_TRANFER,
    data,
    id,
    tranfer,
  };
}

export function putProgressSuccess(id) {
  return {
    type: PUT_PROGRESS_SUCCESS,
    id,
  };
}

export function postConversation(id) {
  return {
    type: POST_CONVERSATION,
    id,
  };
}

export function putRatio(id, data) {
  return {
    type: PUT_RATIO,
    id,
    data,
  };
}

export function postDrive(data) {
  return {
    type: POST_DRIVE,
    data,
  };
}

export function getData() {
  return {
    type: GET_DATA,
  };
}

export function getDataSuccess(data, templates) {
  return {
    type: GET_DATA_SUCCESS,
    data,
    templates,
  };
}

export function postFileSystem(data) {
  return {
    type: POST_FILE_SYSTEM,
    data,
  };
}

export function postApprove(data) {
  return {
    type: POST_APPROVE,
    data,
  };
}

export function postApproveSuccess(data) {
  return {
    type: POST_APPROVE_SUCCESS,
    data,
  };
}

export function getEmployee(data) {
  return {
    type: GET_EMPLOYEE,
    data,
  };
}

export function getEmployeeSuccess(data) {
  return {
    type: GET_EMPLOYEE_SUCCESS,
    data,
  };
}

export function clean() {
  return {
    type: CLEAN,
  };
}