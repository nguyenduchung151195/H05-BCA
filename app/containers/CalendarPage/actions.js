/*
 *
 * CalendarPage actions
 *
 */

import { DEFAULT_ACTION, GET_MEETING_ACTION, GET_MEETING_SUCCESS_ACTION, GET_VISIT_SUCCESS_ACTION, GET_VISIT_ACTION, MERGE_DATA } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getMeetingAct(query) {
  return {
    type: GET_MEETING_ACTION,
    query,
  };
}

export function getMeetingSuccessAct(data) {
  return {
    type: GET_MEETING_SUCCESS_ACTION,
    data,
  };
}
export function getVisitAct(query) {
  return {
    type: GET_VISIT_ACTION,
    query,
  };
}

export function getVisitSuccessAct(data) {
  return {
    type: GET_VISIT_SUCCESS_ACTION,
    data,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
