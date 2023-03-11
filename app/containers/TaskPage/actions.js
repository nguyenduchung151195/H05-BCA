/*
 *
 * TaskPage actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE_DATA,
  SET_STATE,
  GET_PROJECT,
  GET_PROJECT_SUCCESS,
  GET_PROJECT_FAIL,
  POST_PROJECT,
  PUT_PROJECT,
  GET_PROJECT_DEFAULT,
  GET_PROJECT_CURRENT,
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

export function getProject() {
  return {
    type: GET_PROJECT,
  };
}
export function getProjectSuccess(projects) {
  return {
    type: GET_PROJECT_SUCCESS,
    projects,
    // templates,
    // customers,
    // employees,
    // crmStatus,
  };
}
export function getProjectFail(err) {
  return {
    type: GET_PROJECT_FAIL,
    err,
  };
}
export function postProject(data) {
  return {
    type: POST_PROJECT,
    data,
  };
}
export function getDefaultProject() {
  return {
    type: GET_PROJECT_DEFAULT,
  };
}
export function getProjectCurrent(project) {
  return {
    type: GET_PROJECT_CURRENT,
    project,
  };
}

export function putProject(data, id) {
  return {
    type: PUT_PROJECT,
    data,
    id,
  };
}
