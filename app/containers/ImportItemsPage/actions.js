/*
 *
 * ImportItemsPage actions
 *
 */

import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_ALL_ITEMS,
  GET_ALL_ITEMS_SUCCESS,
  GET_ALL_ITEMS_FAILED,
  DELETE_ITEMS,
  DELETE_ITEMS_SUCCESS,
  DELETE_ITEMS_FAILED,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function resetNotiAct() {
  return {
    type: RESET_NOTI,
  };
}

export function getAllItemsAct(query) {
  return {
    type: GET_ALL_ITEMS,
    query,
  };
}
export function getAllItemsSuccess(data) {
  return {
    type: GET_ALL_ITEMS_SUCCESS,
    data,
  };
}
export function getAllItemsFailed(err) {
  return {
    type: GET_ALL_ITEMS_FAILED,
    err,
  };
}

export function deleteItemsAct(body) {
  return {
    type: DELETE_ITEMS,
    body,
  };
}
export function deleteItemsSuccess(data) {
  return {
    type: DELETE_ITEMS_SUCCESS,
    data,
  };
}
export function deleteItemsFailed(err) {
  return {
    type: DELETE_ITEMS_FAILED,
    err,
  };
}
