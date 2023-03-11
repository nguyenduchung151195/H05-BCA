/*
 *
 * AddRolesGroupPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_MODULE,
  GET_MODULE_SUCCESS,
  GET_MODULE_ERROR,
  ADD_ROLE_GROUP,
  ADD_ROLE_SUCCESSS,
  ADD_ROLE_ERROR,
  GET_INFOR_ROLE_GROUP,
  GET_INFOR_ROLE_GROUP_SUCCESS,
  GET_INFOR_ROLE_GROUP_ERROR,
  EDIT_ROLE_GROUP,
  EDIT_ROLE_GROUP_SUCCESS,
  EDIT_ROLE_GROUP_ERROR,
} from './constants';

export const initialState = fromJS({
  roleGroup: {},
});

function addRolesGroupPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_MODULE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false);
    case GET_MODULE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('successCreate', false)
        .set('modules', action.data.data)
        .set('error', false);
    case GET_MODULE_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', true);
    case ADD_ROLE_GROUP:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false)
        .set('successCreate', false)
        .set('body', action.body);
    case ADD_ROLE_SUCCESSS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('successCreate', true)
        .set('error', false);
    case ADD_ROLE_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', true);
    case GET_INFOR_ROLE_GROUP:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('successCreate', false)
        .set('body', action.body);
    case GET_INFOR_ROLE_GROUP_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('roleGroup', action.data)
        .set('successCreate', false)
        .set('error', false);
    case GET_INFOR_ROLE_GROUP_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', true);
    case EDIT_ROLE_GROUP:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case EDIT_ROLE_GROUP_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case EDIT_ROLE_GROUP_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addRolesGroupPageReducer;
