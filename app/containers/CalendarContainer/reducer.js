/*
 *
 * CalendarContainer reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_DATA, GET_DATA_ERROR, GET_DATA_SUCCESS } from './constants';

export const initialState = fromJS({
  data: [],
});

function calendarContainerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_DATA:
      return state
        .set('success', false)
        .set('error', false)
        .set('loading', true);
    case GET_DATA_SUCCESS:
      return state
        .set('success', true)
        .set('error', false)
        .set('loading', false)
        .set('data', action.data);
    case GET_DATA_ERROR:
      return state
        .set('success', false)
        .set('error', true)
        .set('loading', false);
    default:
      return state;
  }
}

export default calendarContainerReducer;
