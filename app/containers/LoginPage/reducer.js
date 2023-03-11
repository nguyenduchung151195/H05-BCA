/*
 *
 * LoginPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, LOGIN, LOGIN_SUCCESS, LOGIN_FALSE, RESET_NOTI, USB_TOKEN } from './constants';

export const initialState = fromJS({});

function loginPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false);
    case LOGIN:
      return state
        .set('body', action.body)
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case LOGIN_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case LOGIN_FALSE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case USB_TOKEN:
      return state.set('usbToken', action.data);
    default:
      return state;
  }
}

export default loginPageReducer;
