/*
 *
 * AddTemplatePage actions
 *
 */

import {
  DEFAULT_ACTION, MERGE,
  GET_ALL_TEMPLATE,
  GET_ALL_TEMPLATE_SUCCESS,
  GET_ALL_TEMPLATE_FAILURE,
  GET_ALL_MODULE_CODE,
  GET_ALL_MODULE_CODE_SUCCESS,
  GET_ALL_MODULE_CODE_FAILURE
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const handleChangeTitle = value => ({
  type: 'CHANGE',
  value,
});

export const getTemplate = (id, getTem, getData) => ({
  type: 'GET_TEMPLATE',
  id,
  getTem,
  getData
});
export const getTemplateSuccess = (data, id) => ({
  type: 'GET_TEMPLATE_SUCCESS',
  data,
  id,
});

export const handleChange = data => ({
  type: 'CHANGE_VALUE',
  data,
});

export const postTemplate = data => ({
  type: 'POST_TEMPLATE',
  data,
});

export const putTemplate = (id, data) => ({
  type: 'PUT_TEMPLATE',
  id,
  data,
});

export const postTemplateSuccess = data => ({
  type: 'POST_TEMPLATE_SUCCESS',
  data,
});

export const putTemplateSuccess = data => ({
  type: 'PUT_TEMPLATE_SUCCESS',
  data,
});

export const postTemplateFailed = data => ({
  type: 'POST_TEMPLATE_FAILED',
  data,
});

export const putTemplateFailed = data => ({
  type: 'PUT_TEMPLATE_FAILED',
  data,
});

export const mergeData = data => ({
  type: MERGE,
  data,
});


export function getAllTemplate() {
  return {
    type: GET_ALL_TEMPLATE,
  }
}

export function getAllTemplateSuccess(data) {
  return {
    type: GET_ALL_TEMPLATE_SUCCESS,
    data
  }
}
export function getAllTemplateFailure(error) {
  return {
    type: GET_ALL_TEMPLATE_FAILURE,
    error
  }
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