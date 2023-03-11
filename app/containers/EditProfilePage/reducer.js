/*
 *
 * EditProfilePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_PROFILE,
  GET_PROFILE_FAILED,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_FAILED,
  UPDATE_PROFILE_SUCCESS,
} from './constants';
import { CHANGE_PASSWORD, CHANGE_PASSWORD_ERROR, CHANGE_PASSWORD_SUCCESS } from '../UsersPage/constants';

export const initialState = fromJS({});

function editProfilePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successDelete', false)
        .set('successUpdate', false)
        .set('error', false);
    case GET_PROFILE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PROFILE_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_PROFILE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('proPage', action.data || {});
    case CHANGE_PASSWORD:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case CHANGE_PASSWORD_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case CHANGE_PASSWORD_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case UPDATE_PROFILE:
      return state
        .set('loading', true)
        .set('successUpdate', false)
        .set('error', false);
    case UPDATE_PROFILE_FAILED:
      return state
        .set('loading', false)
        .set('successUpdate', false)
        .set('error', true);
    case UPDATE_PROFILE_SUCCESS:
      return state
        .set('loading', false)
        .set('successUpdate', true)
        .set('error', false)
        .set('proPage', action.data || {});
    default:
      return state;
  }
}

export default editProfilePageReducer;
