/*
 *
 * RoleGroupPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ROLE_GROUP_PORTAL,
  GET_ROLE_GROUP_PORTAL_SUCCESS,
  GET_ROLE_GROUP_PORTAL_ERROR,
  DELETE_ROLE_GROUP_PORTAL,
  DELETE_ROLE_GROUP_PORTAL_SUCCESS,
  DELETE_ROLE_GROUP_PORTAL_ERROR,
} from './constants';

export const initialState = fromJS({
  roleGroups: [],
});

function roleGroupPageReducerPortal(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('successDelete', false);
    case GET_ROLE_GROUP_PORTAL:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ROLE_GROUP_PORTAL_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('roleGroups', action.data);
    case GET_ROLE_GROUP_PORTAL_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case DELETE_ROLE_GROUP_PORTAL:
      return state
        .set('loading', true)
        .set('successDelete', false)
        .set('error', false);
    case DELETE_ROLE_GROUP_PORTAL_SUCCESS:
      return state
        .set('loading', false)
        .set('successDelete', true)
        .set('error', false);
    case DELETE_ROLE_GROUP_PORTAL_ERROR:
      return state
        .set('loading', false)
        .set('successDelete', false)
        .set('error', true);
    default:
      return state;
  }
}

export default roleGroupPageReducerPortal;
