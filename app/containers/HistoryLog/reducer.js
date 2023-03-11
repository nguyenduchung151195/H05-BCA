/*
 *
 * HistoryLog reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_LOG_ACTION,
  //  GET_LOG_FAILED_ACTION,
  GET_LOG_SUCCESS_ACTION,
} from './constants';

export const initialState = fromJS({});

function historyLogReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_LOG_ACTION:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case GET_LOG_SUCCESS_ACTION:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false)
        .set('logs', action.data);
    default:
      return state;
  }
}

export default historyLogReducer;
