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
  ADD_ROLE_GROUP,
  ADD_ROLE_SUCCESSS,
  ADD_ROLE_ERROR,
  GET_INFOR_ROLE_GROUP,
  GET_INFOR_ROLE_GROUP_ERROR,
  GET_INFOR_ROLE_GROUP_SUCCESS,
  EDIT_ROLE_GROUP,
  EDIT_ROLE_GROUP_ERROR,
  EDIT_ROLE_GROUP_SUCCESS,
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

export function addRoleGroup(body) {
  return {
    type: ADD_ROLE_GROUP,
    body,
  };
}

export function addRoleSuccess(data) {
  return {
    type: ADD_ROLE_SUCCESSS,
    data,
  };
}

export function addRoleError(err) {
  return {
    type: ADD_ROLE_ERROR,
    err,
  };
}
export function getInforRoleGroupAction(body) {
  return {
    type: GET_INFOR_ROLE_GROUP,
    body,
  };
}
export function getInforRoleGroupActionSuccess(data) {
  return {
    type: GET_INFOR_ROLE_GROUP_SUCCESS,
    data,
  };
}
export function getInforRoleGroupActionFailed(err) {
  return {
    type: GET_INFOR_ROLE_GROUP_ERROR,
    err,
  };
}

export function editRoleGroupAct(body) {
  return {
    type: EDIT_ROLE_GROUP,
    body,
  };
}
export function editRoleGroupActSuccess(data) {
  return {
    type: EDIT_ROLE_GROUP_SUCCESS,
    data,
  };
}
export function editRoleGroupActError(err) {
  return {
    type: EDIT_ROLE_GROUP_ERROR,
    err,
  };
}
