/*
 *
 * TemplateTypePage actions
 *
 */

import { DEFAULT_ACTION } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const getTemplateTypes = () => ({
  type: 'GET_TEMPLATE_TYPES',
});

export const getTemplateTypesSuccess = data => ({
  type: 'GET_TEMPLATE_TYPES_SUCCESS',
  data,
});

export const deleteTemplateTypes = templates => ({
  type: 'DELETE_TEMPLATE_TYPES',
  templates,
});
