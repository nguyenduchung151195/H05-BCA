/*
 *
 * ApproveGroupDetailPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_USER,
  GET_ALL_USER_SUCCESS,
  GET_ALL_USER_FAILED,
  UPDATE_APPROVE_GROUP,
  UPDATE_APPROVE_GROUP_SUCCESS,
  UPDATE_APPROVE_GROUP_FAIL,
  ADD_APPROVE_GROUP,
  ADD_APPROVE_GROUP_FAIL,
  ADD_APPROVE_GROUP_SUCCESS,
  GET_APPROVE_GROUP_DETAIL,
  GET_APPROVE_GROUP_DETAIL_FAILED,
  GET_APPROVE_GROUP_DETAIL_SUCCESS,
} from './constants';

export const initialState = fromJS({
  users: [],
});

function ApproveGroupDetailPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('callAPIStatus', -1);
    case GET_ALL_USER:
      return state
        .set('loading', true)
        .set('error', false)
        .set('success', false);
    case GET_ALL_USER_SUCCESS:
      return state
        .set('users', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_ALL_USER_FAILED:
      return state
        .set('loading', false)
        .set('error', true)
        .set('success', false);
    case GET_APPROVE_GROUP_DETAIL:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_APPROVE_GROUP_DETAIL_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_APPROVE_GROUP_DETAIL_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('ApproveGroupDetailPage', action.data);
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
        .set('success', true);
    // .set('approveGroups', action.data);
    case UPDATE_APPROVE_GROUP_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case ADD_APPROVE_GROUP:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case ADD_APPROVE_GROUP_SUCCESS:
      return state.set('loading', false).set('callAPIStatus', 1);
    // .set('error', false)
    // .set('notiMessage', action.message);

    case ADD_APPROVE_GROUP_FAIL:
      return (
        state
          .set('loading', false)
          .set('success', false)
          .set('callAPIStatus', 0)
          // .set('notiMessage', action.message)
          // .set('err', action.err)
          .set('error', true)
      );
    default:
      return state;
  }
}

export default ApproveGroupDetailPageReducer;
