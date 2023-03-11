/*
 *
 * AddSampleProcess actions
 *
 */

import {
  DEFAULT_ACTION,
  HANDLE_CHANGE,
  POST_TEMPLATE,
  POST_TEMPLATE_SUCCESS,
  POST_TEMPLATE_FAIL,
  GET_DEFAULT,
  GET_TEMPLATE,
  GET_TEMPLATE_FAIL,
  GET_TEMPLATE_SUCCESS,
  PUT_TEMPLATE,
  PUT_TEMPLATE_SUCCESS,
  PUT_TEMPLATE_FAIL,
  MERGE_DATA,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function handleChange(name, value) {
  return {
    type: HANDLE_CHANGE,
    name,
    value,
  };
}
export function postTemplate(data) {
  return {
    type: POST_TEMPLATE,
    data,
  };
}
export function postTemplateSuccess(message) {
  return {
    type: POST_TEMPLATE_SUCCESS,
    message,
  };
}
export function postTemplateFail(err) {
  return {
    type: POST_TEMPLATE_FAIL,
    err,
  };
}
export function getDefault() {
  return {
    type: GET_DEFAULT,
  };
}
export function getTemplate(id) {
  return {
    type: GET_TEMPLATE,
    id,
  };
}
export function getTemplateSuccess(data) {
  return {
    type: GET_TEMPLATE_SUCCESS,
    data,
  };
}
export function getTemplateFail(err) {
  return {
    type: GET_TEMPLATE_FAIL,
    err,
  };
}
export function putTemplate(data, id) {
  return {
    type: PUT_TEMPLATE,
    data,
    id,
  };
}
export function putTemplateSuccess(data, message) {
  return {
    type: PUT_TEMPLATE_SUCCESS,
    data,
    message,
  };
}
export function putTemplateFail(err) {
  return {
    type: PUT_TEMPLATE_FAIL,
    err,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
