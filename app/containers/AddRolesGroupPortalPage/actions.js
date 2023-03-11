/*
 *
 * AddRolesGroupPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_MODULE,
  GET_MODULE_SUCCESS,
  GET_MODULE_ERROR,
  ADD_ROLE_GROUP_PORTAL,
  ADD_ROLE_PORTAL_SUCCESSS,
  ADD_ROLE_PORTAL_ERROR,
  GET_INFOR_ROLE_GROUP_PORTAL,
  GET_INFOR_ROLE_GROUP_PORTAL_ERROR,
  GET_INFOR_ROLE_GROUP_PORTAL_SUCCESS,
  EDIT_ROLE_GROUP_PORTAL,
  EDIT_ROLE_GROUP_PORTAL_ERROR,
  EDIT_ROLE_GROUP_PORTAL_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getModuleAct(body) {
  return {
    type: GET_MODULE,
    body,
  };
}

export function getModuleSuccess(data) {
  return {
    type: GET_MODULE_SUCCESS,
    data,
  };
}

export function getModuleError(err) {
  return {
    type: GET_MODULE_ERROR,
    err,
  };
}

export function addRoleGroupPortal(body) {
  return {
    type: ADD_ROLE_GROUP_PORTAL,
    body,
  };
}

export function addRolePortalSuccess(data) {
  return {
    type: ADD_ROLE_PORTAL_SUCCESSS,
    data,
  };
}

export function addRolePortalError(err) {
  return {
    type: ADD_ROLE_PORTAL_ERROR,
    err,
  };
}
export function getInforRoleGroupPortalAction(body) {
  return {
    type: GET_INFOR_ROLE_GROUP_PORTAL,
    body,
  };
}
export function getInforRoleGroupPortalActionSuccess(data) {
  return {
    type: GET_INFOR_ROLE_GROUP_PORTAL_SUCCESS,
    data,
  };
}
export function getInforRoleGroupPortalActionFailed(err) {
  return {
    type: GET_INFOR_ROLE_GROUP_PORTAL_ERROR,
    err,
  };
}

export function editRoleGroupPortalAct(body) {
  return {
    type: EDIT_ROLE_GROUP_PORTAL,
    body,
  };
}
export function editRoleGroupPortalActSuccess(data) {
  return {
    type: EDIT_ROLE_GROUP_PORTAL_SUCCESS,
    data,
  };
}
export function editRoleGroupPortalActError(err) {
  return {
    type: EDIT_ROLE_GROUP_PORTAL_ERROR,
    err,
  };
}
