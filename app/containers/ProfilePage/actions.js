/*
 *
 * ProfilePage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_PROFILE,
  GET_PROFILE_FAILED,
  GET_PROFILE_SUCCESS,
  GET_ORGANIZATIONUNIT,
  GET_ORGANIZATIONUNIT_FAILED,
  GET_ORGANIZATIONUNIT_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getProAct(body) {
  return {
    type: GET_PROFILE,
    body,
  };
}
export function getProSuccess(data) {
  return {
    type: GET_PROFILE_SUCCESS,
    data,
  };
}
export function getProFailed(err) {
  return {
    type: GET_PROFILE_FAILED,
    err,
  };
}

export function getData(params) {
  return {
    type: GET_ORGANIZATIONUNIT,
    params,
  };
}

export function getDataSuccess(data) {
  return {
    type: GET_ORGANIZATIONUNIT_SUCCESS,
    data,
  };
}

export function getDataFailed(err) {
  return {
    type: GET_ORGANIZATIONUNIT_FAILED,
    err,
  };
}
