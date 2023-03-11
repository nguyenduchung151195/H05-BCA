/*
 *
 * ExecutiveDocuments actions
 *
 */

import {
  MERGE_DATA,
  UPDATE_STATUS,
  UPDATE_STATUS_FAILED,
  UPDATE_STATUS_SUCCESS,
} from './constants';

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data
  }
}

export function UpdateStatusAct(body) {
  return {
    type: UPDATE_STATUS,
    body,
  };
}

export function UpdateStatusSuccess(data) {
  return {
    type: UPDATE_STATUS_SUCCESS,
    data,
  };
}

export function UpdateStatusFailed(err) {
  return {
    type: UPDATE_STATUS_FAILED,
    err,
  };
}