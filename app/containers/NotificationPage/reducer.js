/*
 *
 * NotificationPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  UPDATE_NOTIFICATION,
  UPDATE_NOTIFICATION_FAIL,
  UPDATE_NOTIFICATION_SUCCESS,
  // ADD_NOTIFICATION,
  // ADD_NOTIFICATION_FAIL,
  // ADD_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION,
  GET_NOTIFICATION_FAILED,
  GET_NOTIFICATION_SUCCESS,
} from './constants';

export const initialState = fromJS({});

function notificationPageReducer(state = initialState, action) {
  // console.log(action);
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('callAPIStatus', -1);
    case GET_NOTIFICATION:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_NOTIFICATION_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_NOTIFICATION_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('approveRequest', action.data)
        .set('currentUser', action.currentUser);
    case UPDATE_NOTIFICATION:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_NOTIFICATION_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('error', false)
        .set('success', true)
        .set('approveGroups', action.data);
    case UPDATE_NOTIFICATION_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    default:
      return state;
  }
}

export default notificationPageReducer;
