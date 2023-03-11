/*
 *
 * ApproveGroupPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_APPROVE_GROUPS,
  GET_APPROVE_GROUPS_FAIL,
  GET_APPROVE_GROUPS_SUCCESS,
  ADD_APPROVE_GROUP,
  ADD_APPROVE_GROUP_FAIL,
  ADD_APPROVE_GROUP_SUCCESS,
  DELETE_APPROVE_GROUPS,
  DELETE_APPROVE_GROUPS_FAIL,
  DELETE_APPROVE_GROUPS_SUCCESS,
  UPDATE_APPROVE_GROUP,
  UPDATE_APPROVE_GROUP_SUCCESS,
  UPDATE_APPROVE_GROUP_FAIL,
} from './constants';

export const initialState = fromJS({});

function ApproveGroupPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('callAPIStatus', -1);
    case GET_APPROVE_GROUPS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_APPROVE_GROUPS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_APPROVE_GROUPS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('approveGroups', action.data);
    // .set('pageDetail', action.data);

    case ADD_APPROVE_GROUP:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case ADD_APPROVE_GROUP_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('error', false)
        .set('notiMessage', action.message)
        .set('approveGroups', action.data);
    case ADD_APPROVE_GROUP_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case UPDATE_APPROVE_GROUP:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_APPROVE_GROUP_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('success', true)
        .set('approveGroups', action.data);
    case UPDATE_APPROVE_GROUP_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case DELETE_APPROVE_GROUPS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case DELETE_APPROVE_GROUPS_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('approveGroups', action.data);
    case DELETE_APPROVE_GROUPS_FAIL:
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

export default ApproveGroupPageReducer;
