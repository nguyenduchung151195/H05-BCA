/*
 *
 * KanbanPlugin actions
 *
 */

import { DEFAULT_ACTION, GET_ITEMS, GET_ITEMS_SUCCESS, GET_ITEMS_FAILED } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getItemsAct(body) {
  return {
    type: GET_ITEMS,
    body,
  };
}

export function getItemsSuccess(data) {
  return {
    type: GET_ITEMS_SUCCESS,
    data,
  };
}

export function getItemsFailed(err) {
  return {
    type: GET_ITEMS_FAILED,
    err,
  };
}
