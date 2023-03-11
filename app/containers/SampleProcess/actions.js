/*
 *
 * SampleProcess actions
 *
 */

import { DEFAULT_ACTION, GET_TEMPLATE, GET_TEMPLATE_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getTemplate() {
  return {
    type: GET_TEMPLATE,
  };
}
export function getTemplateSuccess(templates) {
  return {
    type: GET_TEMPLATE_SUCCESS,
    templates,
  };
}
