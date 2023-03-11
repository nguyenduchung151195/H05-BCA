/*
 *
 * MeetingPage reducer
 *
 */

import { fromJS } from 'immutable';
import * as types from './constants';

export const initialState = fromJS({ meetings: [] });

function meetingPageReducer(state = initialState, action) {
  switch (action.type) {
    case types.DEFAULT_ACTION:
      return state;
    case types.GET_ALL_MEETINGS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case types.GET_ALL_MEETINGS_FAIL:
      return state
        .set('loading', false)
        .set('data', [])
        .set('success', false)
        .set('error', true);
    case types.GET_ALL_MEETINGS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('meetings', action.data)
        .set('error', false);
    case types.ADD_MEETING:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false);
    case types.ADD_MEETING_SUCCESS:
      return state.set('loading', false).set('error', false);
    case types.ADD_MEETING_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('err', action.err)
        .set('error', true);
    case types.UPDATE_MEETING:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case types.UPDATE_MEETING_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('success', true);
    case types.UPDATE_MEETING_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case types.DELETE_MEETINGS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('successDeleteC', null)
        .set('error', false)
        .set('body', action.body);
    case types.DELETE_MEETINGS_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('reload', true)
        .set('success', true)
        .set('successDeleteC', true)
        .set('notiMessage', action.message)
        .set('error', false);
    case types.DELETE_MEETINGS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successDeleteC', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('reload', false)
        .set('notiMessage', action.message);
    default:
      return state;
  }
}

export default meetingPageReducer;
