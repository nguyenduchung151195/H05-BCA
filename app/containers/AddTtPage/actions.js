/*
 *
 * AddTtPage actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export const handleChange = data => ({
  type: 'CHANGE_VALUE',
  data,
});

export const getTemplateType = id => ({
  type: 'GET_TEMPLATE_TYPE',
  id,
});

export const getTemplateTypeSuccess = (data, id) => ({
  type: 'GET_TEMPLATE_TYPE_SUCCESS',
  data,
  id,
});

export const getTemplateTypeFailed = () => ({
  type: 'GET_TEMPLATE_TYPE_FALIED',
});

export const postTemplateType = data => ({
  type: 'POST_TEMPLATE_TYPE',
  data,
});

export const putTemplateType = (id, data) => ({
  type: 'PUT_TEMPLATE_TYPE',
  id,
  data,
});

export const postTemplateTypeSuccess = data => ({
  type: 'POST_TEMPLATE_TYPE_SUCCESS',
  data,
});

export const postTemplateTypeFailed = data => ({
  type: 'POST_TEMPLATE_TYPE_FAILED',
  data,
});

export const putTemplateTypeFailed = data => ({
  type: 'PUT_TEMPLATE_TYPE_FAILED',
  data,
});
export const mergeData = data => ({
  type: MERGE_DATA,
  data,
});
