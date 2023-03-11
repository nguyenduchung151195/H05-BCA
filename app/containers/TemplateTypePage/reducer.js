/*
 *
 * TemplateTypePage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION } from './constants';

export const initialState = fromJS({ list: [] });

function templateTypePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case 'GET_TEMPLATE_TYPES':
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case 'GET_TEMPLATE_TYPES_SUCCESS':
      return state
        .set('list', action.data)
        .set('success', true)
        .set('loading', false)
        .set('error', false);
    case 'DELETE_TEMPLATE_TYPES':
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case 'DELETE_TEMPLATE_TYPES_SUCCESS':
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    default:
      return state;
  }
}

export default templateTypePageReducer;
