/*
 *
 * CalendarPage reducer
 *
 */
import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_MEETING_ACTION, GET_MEETING_SUCCESS_ACTION, GET_VISIT_SUCCESS_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({ tabIndex: 0, reload: 0 });

function calendarPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_MEETING_ACTION:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false);
    case GET_MEETING_SUCCESS_ACTION:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false)
        .set('meetings', action.data);
    case GET_VISIT_SUCCESS_ACTION:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false)
        .set('visits', action.data);
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default calendarPageReducer;
