/*
 *
 * RoleGroupPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ROLE_GROUP,
  GET_ROLE_GROUP_SUCCESS,
  GET_ROLE_GROUP_ERROR,
  DELETE_ROLE_GROUP,
  DELETE_ROLE_GROUP_SUCCESS,
  DELETE_ROLE_GROUP_ERROR,
  // UPDATE_ROLE, UPDATE_ROLE_ERROR, UPDATE_ROLE_SUCCESS
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getRoleGroupAction(body) {
  return {
    type: GET_ROLE_GROUP,
    body,
  };
}

export function getRoleGroupSuccessAction(data) {
  return {
    type: GET_ROLE_GROUP_SUCCESS,
    data,
  };
}

export function getRoleGroupError(err) {
  return {
    type: GET_ROLE_GROUP_ERROR,
    err,
  };
}

export function deleteRoleGroupAct(body) {
  return {
    type: DELETE_ROLE_GROUP,
    body,
  };
}

export function deleteRoleGroupSuccess(data) {
  return {
    type: DELETE_ROLE_GROUP_SUCCESS,
    data,
  };
}

export function deleteRoleGroupFailed(err) {
  return {
    type: DELETE_ROLE_GROUP_ERROR,
    err,
  };
}
