/*
 *
 * SourcePage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_TRADING, GET_TRADING_SUCCESS, GET_TRADING_FAILED, GET_PO, GET_PO_SUCCESS, GET_PO_FAILED } from './constants';

export const initialState = fromJS({});

function sourcePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_TRADING:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_TRADING_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('trading', action.data)
        .set('error', false);
    case GET_TRADING_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_PO:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PO_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('po', action.data)
        .set('error', false);
    case GET_PO_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    default:
      return state;
  }
}

export default sourcePageReducer;
