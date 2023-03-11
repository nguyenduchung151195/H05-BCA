/*
 *
 * WorkingSchedule actions
 *
 */

import { DEFAULT_ACTION, GET_DATA, GET_DATA_SUCCESS ,MERGE_DATA} from './constants';

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data
  }
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getData() {
  return {
    type: GET_DATA,
  };
}

export function getDataSuccess(mettings) {
  return {
    type: GET_DATA_SUCCESS,
    mettings,
  };
}
