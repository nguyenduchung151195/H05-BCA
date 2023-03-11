/*
 *
 * KanbanPlugin reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_ITEMS, GET_ITEMS_SUCCESS, GET_ITEMS_FAILED } from './constants';

export const initialState = fromJS({});

function kanbanPluginReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_ITEMS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ITEMS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('allItems', action.data)
        .set('error', false);
    case GET_ITEMS_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    default:
      return state;
  }
}

export default kanbanPluginReducer;
