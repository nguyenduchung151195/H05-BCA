/*
 *
 * AddTtPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({ code: '', title: '', alwaysUsed: false, modules: [] });

function addTtPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case 'CHANGE_VALUE':
      return state.set(action.data.name, action.data.value);
    case 'GET_TEMPLATE_TYPE_SUCCESS':
      if (action.id !== 'add')
        return state
          .merge(action.data)
          .set('loading', false)
          .set('error', false)
          .set('success', true);
      return state.merge(initialState);
    case MERGE_DATA:
      return state.merge(action.data);
    case 'POST_TEMPLATE_TYPE_FAILED':
      return state
        .set('loading', false)
        .set('error', true)
        .set('success', false);
    case 'PUT_TEMPLATE_TYPE':
      return state
        .set('loading', true)
        .set('error', false)
        .set('success', false);
    case 'PUT_TEMPLATE_TYPE_FAILED':
      return state
        .set('loading', false)
        .set('error', true)
        .set('success', false);
    default:
      return state;
  }
}

export default addTtPageReducer;
