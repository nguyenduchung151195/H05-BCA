/*
 *
 * ImportItemsPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_ALL_ITEMS,
  GET_ALL_ITEMS_SUCCESS,
  GET_ALL_ITEMS_FAILED,
  DELETE_ITEMS,
  DELETE_ITEMS_SUCCESS,
  DELETE_ITEMS_FAILED,
} from './constants';

export const initialState = fromJS({});

function importItemsPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successDelete', false)
        .set('error', false);
    case GET_ALL_ITEMS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_ITEMS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('itemsList', action.data.data)
        .set('count', action.data.count)
        .set('skip', action.data.skip)
        .set('limit', action.data.limit)
        .set('error', false);
    case GET_ALL_ITEMS_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case DELETE_ITEMS:
      return state
        .set('loading', true)
        .set('successDelete', false)
        .set('error', false);
    case DELETE_ITEMS_SUCCESS:
      return state
        .set('loading', false)
        .set('successDelete', true)
        .set('error', false);
    case DELETE_ITEMS_FAILED:
      return state
        .set('loading', false)
        .set('successDelete', false)
        .set('error', true);
    default:
      return state;
  }
}

export default importItemsPageReducer;
