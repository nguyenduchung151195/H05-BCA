/*
 *
 * Field actions
 *
 */

import {
  DEFAULT_ACTION,
  MERGE,
  GET_ALL_MODULE_CODE,
  GET_ALL_MODULE_CODE_SUCCESS,
  GET_ALL_MODULE_CODE_FAILURE
} from './constants';

export const handleChange = data => ({
  type: 'CHANGE_VALUE',
  data,
});


export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAllModuleCode() {
  return {
    type: GET_ALL_MODULE_CODE,
  }
}
export function getAllModuleCodeSuccess(data) {
  return {
    type: GET_ALL_MODULE_CODE_SUCCESS,
    data
  }
}
export function getAllModuleCodeFailure(error) {
  return {
    type: GET_ALL_MODULE_CODE_FAILURE,
    error
  }
}
