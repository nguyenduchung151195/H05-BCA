/*
 *
 * RoleGroupPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ROLE_GROUP_PORTAL,
  GET_ROLE_GROUP_PORTAL_SUCCESS,
  GET_ROLE_GROUP_PORTAL_ERROR,
  DELETE_ROLE_GROUP_PORTAL,
  DELETE_ROLE_GROUP_PORTAL_SUCCESS,
  DELETE_ROLE_GROUP_PORTAL_ERROR,
  // UPDATE_ROLE, UPDATE_ROLE_ERROR, UPDATE_ROLE_SUCCESS
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getRoleGroupPortalAction(body) {
  return {
    type: GET_ROLE_GROUP_PORTAL,
    body,
  };
}

export function getRoleGroupPortalSuccessAction(data) {
  return {
    type: GET_ROLE_GROUP_PORTAL_SUCCESS,
    data,
  };
}

export function getRoleGroupPortalError(err) {
  return {
    type: GET_ROLE_GROUP_PORTAL_ERROR,
    err,
  };
}

export function deleteRoleGroupPortalAct(body) {
  return {
    type: DELETE_ROLE_GROUP_PORTAL,
    body,
  };
}

export function deleteRoleGroupPortalSuccess(data) {
  return {
    type: DELETE_ROLE_GROUP_PORTAL_SUCCESS,
    data,
  };
}

export function deleteRoleGroupPortalFailed(err) {
  return {
    type: DELETE_ROLE_GROUP_PORTAL_ERROR,
    err,
  };
}
