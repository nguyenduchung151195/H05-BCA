/*
 *
 * ApproveGroupDetailPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_USER,
  GET_ALL_USER_SUCCESS,
  GET_ALL_USER_FAILED,
  UPDATE_APPROVE_GROUP,
  UPDATE_APPROVE_GROUP_FAIL,
  UPDATE_APPROVE_GROUP_SUCCESS,
  ADD_APPROVE_GROUP,
  ADD_APPROVE_GROUP_FAIL,
  ADD_APPROVE_GROUP_SUCCESS,
  GET_APPROVE_GROUP_DETAIL,
  GET_APPROVE_GROUP_DETAIL_FAILED,
  GET_APPROVE_GROUP_DETAIL_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getAllUserAct() {
  return {
    type: GET_ALL_USER,
  };
}
export function getAllUserSuccessAct(data) {
  return {
    type: GET_ALL_USER_SUCCESS,
    data,
  };
}
export function getAllUserFailedAct(error) {
  return {
    type: GET_ALL_USER_FAILED,
    error,
  };
}
export function updateApproveGroupAction(doc) {
  return {
    type: UPDATE_APPROVE_GROUP,
    doc,
  };
}
export function updateApproveGroupSuccessAction() {
  return {
    type: UPDATE_APPROVE_GROUP_SUCCESS,
  };
}
export function updateApproveGroupFailAction(err, message) {
  return {
    type: UPDATE_APPROVE_GROUP_FAIL,
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
export function addApproveGroupSuccessAction(id) {
  return {
    type: ADD_APPROVE_GROUP_SUCCESS,
    id,
  };
}
export function addApproveGroupFailAction(err, message) {
  return {
    type: ADD_APPROVE_GROUP_FAIL,
    err,
    message,
  };
}
export function getApproveGroupDetailPageAction(id) {
  return {
    type: GET_APPROVE_GROUP_DETAIL,
    id,
  };
}
export function getApproveGroupDetailPageSuccessAction(data, message) {
  return {
    type: GET_APPROVE_GROUP_DETAIL_SUCCESS,
    data,
    message,
  };
}
export function getApproveGroupDetailPageFailAction(err, message) {
  return {
    type: GET_APPROVE_GROUP_DETAIL_FAILED,
    err,
    message,
  };
}
export function resetNotis() {
  return {
    type: DEFAULT_ACTION,
  };
}
