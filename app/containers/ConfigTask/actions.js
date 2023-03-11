/*
 *
 * ConfigTask actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_CONFIG,
  GET_CONFIG_SUCCSESS,
  MERGE_DATA,
  POST_CONFIG,
  POST_CONFIG_SUCCESS,
  GET_DEFAULT,
  PUT_CONFIG,
  PUT_CONFIG_SUCCESS,
  DELETE_CONFIG,
  DELETE_CONFIG_SUCCESS,
  PUT_CONFIG_PARENT,
  RESET_ALL_STATUS,
  RESET_ALL_STATUS_SUCCESS,
  RESET_ALL_STATUS_FAILURE,
  GET_ALL_SOURCES,
  GET_ALL_SOURCES_SUCCESS,
  GET_ALL_SOURCES_FAIL,
  ADD_SOURCE,
  ADD_SOURCE_SUCCESS,
  ADD_SOURCE_FAIL,
  RESET_ALL_SOURCE,
  RESET_ALL_SOURCE_SUCCESS,
  RESET_ALL_SOURCE_FAILURE,
  EDIT_SOURCE,
  EDIT_SOURCE_SUCCESS,
  EDIT_SOURCE_FAIL,
  DELETE_SOURCES,
  DELETE_SOURCES_SUCCESS,
  DELETE_SOURCES_FAIL,
  DELETE_CRM_SOURCES,
  DELETE_CRM_SOURCES_SUCCESS,
  DELETE_CRM_SOURCES_FAIL,
  GET_ALL_STATUS,
  GET_ALL_STATUS_SUCCESS,
  GET_ALL_STATUS_FAIL,
  EDIT_CRM_STATUS,
  EDIT_CRM_STATUS_SUCCESS,
  EDIT_CRM_STATUS_FAIL,
  UPDATE_SOURCE,
  UPDATE_SOURCE_SUCCESS,
  UPDATE_SOURCE_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getConfig() {
  return {
    type: GET_CONFIG,
  };
}

export function getConfigSuccess(config) {
  return {
    type: GET_CONFIG_SUCCSESS,
    config,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
export function postConfig(data, id) {
  return {
    type: POST_CONFIG,
    data,
    id,
  };
}
export function postConfigSuccess(data) {
  return {
    type: POST_CONFIG_SUCCESS,
    data,
  };
}
export function getDefault(data) {
  return {
    type: GET_DEFAULT,
    data,
  };
}
export function putConfig(data, id, configId) {
  return {
    type: PUT_CONFIG,
    data,
    id,
    configId,
  };
}
export function putConfigSuccess(data) {
  return {
    type: PUT_CONFIG_SUCCESS,
    data,
  };
}
export function deleteConfig(id, configId) {
  return {
    type: DELETE_CONFIG,
    id,
    configId,
  };
}
export function deleteConfigSuccess(data) {
  return {
    type: DELETE_CONFIG_SUCCESS,
    data,
  };
}

export function putConfigParent(data) {
  return {
    type: PUT_CONFIG_PARENT,
    data,
  };
}



export function resetAllStatus(data) {
  return {
    type: RESET_ALL_STATUS,
    data,
  };
}

export function resetAllStatusSuccess(data) {
  return {
    type: RESET_ALL_STATUS_SUCCESS,
    data,
  };
}

export function resetAllStatusFailure(error) {
  return {
    type: RESET_ALL_STATUS_FAILURE,
    error,
  };
}

export function fetchAllSourcesAction(id) {
  return {
    type: GET_ALL_SOURCES,
    id,
  };
}
export function fetchAllSourcesSuccessAction(data, message) {
  return {
    type: GET_ALL_SOURCES_SUCCESS,
    data,
    message,
  };
}
export function fetchAllSourcesFailAction(err, message) {
  return {
    type: GET_ALL_SOURCES_FAIL,
    err,
    message,
  };
}

export function addSourceAction(body, types) {
  return {
    type: ADD_SOURCE,
    body,
    types,
  };
}
export function addSourceSuccessAction(data, message) {
  return {
    type: ADD_SOURCE_SUCCESS,
    data,
    message,
  };
}
export function addSourceFailAction(err, message) {
  return {
    type: ADD_SOURCE_FAIL,
    err,
    message,
  };
}

export function resetAllSources(data) {
  return {
    type: RESET_ALL_SOURCE,
    data,
  };
}

export function resetAllSourcesSuccess(data) {
  return {
    type: RESET_ALL_SOURCE_SUCCESS,
    data,
  };
}

export function resetAllSourcesFailure(error) {
  return {
    type: RESET_ALL_SOURCE_FAILURE,
    error,
  };
}

export function editSourceAction(body, id, types) {
  return {
    type: EDIT_SOURCE,
    body,
    id,
    types
  };
}
export function editSourceSuccessAction(data, message) {
  return {
    type: EDIT_SOURCE_SUCCESS,
    data,
    message,
  };
}
export function editSourceFailAction(err, message) {
  return {
    type: EDIT_SOURCE_FAIL,
    err,
    message,
  };
}
export function deleteSourcesAction(body) {
  return {
    type: DELETE_SOURCES,
    body,
  };
}
export function deleteSourcesSuccessAction(data, message) {
  return {
    type: DELETE_SOURCES_SUCCESS,
    data,
    message,
  };
}
export function deleteSourcesFailAction(err, message) {
  return {
    type: DELETE_SOURCES_FAIL,
    err,
    message,
  };
}
export function deleteCRMSourcesAction(id, types) {
  return {
    type: DELETE_CRM_SOURCES,
    id,
    types
  };
}
export function deleteCRMSourcesSuccessAction(data, message) {
  return {
    type: DELETE_CRM_SOURCES_SUCCESS,
    data,
    message,
  };
}
export function deleteCRMSourcesFailAction(err, message) {
  return {
    type: DELETE_CRM_SOURCES_FAIL,
    err,
    message,
  };
}
export function fetchAllStatusAction(id, currentType) {
  return {
    type: GET_ALL_STATUS,
    id,
    currentType,
  };
}
export function fetchAllStatusSuccessAction(data, message) {
  return {
    type: GET_ALL_STATUS_SUCCESS,
    data,
    message,
  };
}
export function fetchAllStatusFailAction(err, message) {
  return {
    type: GET_ALL_STATUS_FAIL,
    err,
    message,
  };
}

export function editCRMStatusAction(body, id, types) {
  return {
    type: EDIT_CRM_STATUS,
    body,
    id,
    types,
  };
}
export function editCRMStatusSuccessAction(data, message) {
  return {
    type: EDIT_CRM_STATUS_SUCCESS,
    data,
    message,
  };
}
export function editCRMStatusFailAction(err, message) {
  return {
    type: EDIT_CRM_STATUS_FAIL,
    err,
    message,
  };
}

export function updateSourcesAction(body, param, types) {
  return {
    type: UPDATE_SOURCE,
    body,
    param,
    types
  };
}
export function updateSourcesSuccessAction(data, message) {
  return {
    type: UPDATE_SOURCE_SUCCESS,
    data,
    message,
  };
}
export function updateSourcesFailAction(err, message) {
  return {
    type: UPDATE_SOURCE_FAIL,
    err,
    message,
  };
}