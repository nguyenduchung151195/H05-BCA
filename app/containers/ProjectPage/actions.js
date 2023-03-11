/*
 *
 * ProjectPage actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, ADD_BOS, ADD_BOS_SUCCESS, GET_DATA_SUCCESS, GET_DATA } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function mergeDataProject(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function addBos(data) {
  return {
    type: ADD_BOS,
    data,
  };
}
export function addBosSuccess(data) {
  return {
    type: ADD_BOS_SUCCESS,
    data,
  };
}
export function getData() {
  return {
    type: GET_DATA,
  };
}
export function getDataSuccess(projects) {
  return {
    type: GET_DATA_SUCCESS,
    projects,
  };
}
