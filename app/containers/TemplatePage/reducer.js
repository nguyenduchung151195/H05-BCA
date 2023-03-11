/*
 *
 * TemplatePage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({ list: [], template: [] });

function templatePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case 'GET_TEMPLATES':
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case 'GET_TEMPLATES_SUCCESS':
      return state
        .set('list', action.data)
        .set('success', true)
        .set('loading', false)
        .set('error', false);
    case 'DELETE_TEMPLATES':
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case 'DELETE_TEMPLATES_SUCCESS':
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default templatePageReducer;
