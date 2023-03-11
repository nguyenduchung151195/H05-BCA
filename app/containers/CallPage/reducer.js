/*
 *
 * CallPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_CUSTOMER, GET_CUSTOMER_FAIL, GET_CUSTOMER_SUCCESS } from './constants';

export const initialState = fromJS({});

function callPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('callAPIStatus', -1);
    case GET_CUSTOMER:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_CUSTOMER_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('msg', action.message);
    case GET_CUSTOMER_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('callAPIStatus', 1)
        .set('customerPhone', action.data);
    default:
      return state;
  }
}

export default callPageReducer;
