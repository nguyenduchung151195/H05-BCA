/*
 *
 * ProfilePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_PROFILE,
  GET_PROFILE_FAILED,
  GET_PROFILE_SUCCESS,
  GET_ORGANIZATIONUNIT,
  GET_ORGANIZATIONUNIT_FAILED,
  GET_ORGANIZATIONUNIT_SUCCESS,
} from './constants';

export const initialState = fromJS({});

function profilePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
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
    case GET_ORGANIZATIONUNIT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ORGANIZATIONUNIT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('organizationUnit', action.data);
    case GET_ORGANIZATIONUNIT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    default:
      return state;
  }
}

export default profilePageReducer;
