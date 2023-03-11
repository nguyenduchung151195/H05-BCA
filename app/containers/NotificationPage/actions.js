/*
 *
 * NotificationPage actions
 *
 */

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
  OPEN_TEMPLATE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function updateApproveAction(approve, result, currentUser) {
  return {
    type: UPDATE_NOTIFICATION,
    approve,
    result,
    currentUser,
  };
}
export function updateApproveSuccessAction(data) {
  return {
    type: UPDATE_NOTIFICATION_SUCCESS,
    data,
  };
}
export function updateApproveFailAction(err, message) {
  return {
    type: UPDATE_NOTIFICATION_FAIL,
    err,
    message,
  };
}
export function getApproveAction() {
  return {
    type: GET_NOTIFICATION,
  };
}
export function getApproveSuccessAction(data, currentUser) {
  return {
    type: GET_NOTIFICATION_SUCCESS,
    data,
    currentUser,
  };
}
export function getApproveFailAction(err, message) {
  return {
    type: GET_NOTIFICATION_FAILED,
    err,
    message,
  };
}
export function resetNotis() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function showTemplate(data) {
  return {
    type: OPEN_TEMPLATE,
    data,
  };
}
