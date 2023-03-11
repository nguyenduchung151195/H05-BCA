/*
 *
 * ApproveGroupdPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_APPROVE_GROUPS,
  GET_APPROVE_GROUPS_SUCCESS,
  GET_APPROVE_GROUPS_FAIL,
  ADD_APPROVE_GROUP,
  ADD_APPROVE_GROUP_FAIL,
  ADD_APPROVE_GROUP_SUCCESS,
  DELETE_APPROVE_GROUPS,
  DELETE_APPROVE_GROUPS_FAIL,
  DELETE_APPROVE_GROUPS_SUCCESS,
  UPDATE_APPROVE_GROUP,
  UPDATE_APPROVE_GROUP_FAIL,
  UPDATE_APPROVE_GROUP_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getApproveGroupsAction() {
  return {
    type: GET_APPROVE_GROUPS,
  };
}
export function getApproveGroupsSuccessAction(data, message) {
  return {
    type: GET_APPROVE_GROUPS_SUCCESS,
    data,
    message,
  };
}
export function getApproveGroupsFailAction(err, message) {
  return {
    type: GET_APPROVE_GROUPS_FAIL,
    err,
    message,
  };
}
export function addApproveGroupAction(doc) {
  return {
    type: ADD_APPROVE_GROUP,
    doc,
  };
}
export function addApproveGroupSuccessAction(data, message) {
  return {
    type: ADD_APPROVE_GROUP_SUCCESS,
    data,
    message,
  };
}
export function addApproveGroupFailAction(err, message) {
  return {
    type: ADD_APPROVE_GROUP_FAIL,
    err,
    message,
  };
}
export function deleteApproveGroupsAction(approveGroup) {
  return {
    type: DELETE_APPROVE_GROUPS,
    approveGroup,
  };
}
export function deleteApproveGroupsSuccessAction(data, message) {
  return {
    type: DELETE_APPROVE_GROUPS_SUCCESS,
    data,
    message,
  };
}
export function deleteApproveGroupsFailAction(err, message) {
  return {
    type: DELETE_APPROVE_GROUPS_FAIL,
    err,
    message,
  };
}
export function updateApproveGroupAction(doc) {
  return {
    type: UPDATE_APPROVE_GROUP,

    doc,
  };
}
export function updateApproveGroupSuccessAction(data, message) {
  return {
    type: UPDATE_APPROVE_GROUP_SUCCESS,
    data,
    message,
  };
}
export function updateApproveGroupFailAction(err, message) {
  return {
    type: UPDATE_APPROVE_GROUP_FAIL,
    err,
    message,
  };
}
export function resetNotis() {
  return {
    type: DEFAULT_ACTION,
  };
}
