/*
 *
 * TemplatePage actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const getTemplates = () => ({
  type: 'GET_TEMPLATES',
});

export const getTemplatesSuccess = data => ({
  type: 'GET_TEMPLATES_SUCCESS',
  data,
});

export const deleteTemplates = templates => ({
  type: 'DELETE_TEMPLATES',
  templates,
});
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
