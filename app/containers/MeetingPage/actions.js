/*
 *
 * MeetingPage actions
 *
 */

import * as types from './constants';

export function defaultAction() {
  return {
    type: types.DEFAULT_ACTION,
  };
}

export function getAllMeetingsAction(query) {
  return {
    type: types.GET_ALL_MEETINGS,
    query,
  };
}
export function getAllMeetingsSuccessAction(data) {
  return {
    type: types.GET_ALL_MEETINGS_SUCCESS,
    data,
  };
}
export function getAllMeetingsFailAction() {
  return {
    type: types.GET_ALL_MEETINGS_FAIL,
  };
}
export function addMeetingAction(meeting, reminderBefore) {
  return {
    type: types.ADD_MEETING,
    meeting,
    reminderBefore,
  };
}
export function addMeetingSuccessAction() {
  return {
    type: types.ADD_MEETING_SUCCESS,
  };
}
export function addMeetingFailAction(err) {
  return {
    type: types.ADD_MEETING_FAIL,
    err,
  };
}
export function deleteMeetingsAction(deleteIds) {
  return {
    type: types.DELETE_MEETINGS,
    deleteIds,
  };
}
export function deleteMeetingsSuccessAction(data) {
  return {
    type: types.DELETE_MEETINGS_SUCCESS,
    data,
  };
}
export function deleteMeetingsFailAction(err) {
  return {
    type: types.DELETE_MEETINGS_FAIL,
    err,
  };
}
export function updateMeetingsAction(doc) {
  return {
    type: types.UPDATE_MEETING,
    doc,
  };
}
export function updateMeetingsSuccessAction(data) {
  return {
    type: types.UPDATE_MEETING_SUCCESS,
    data,
  };
}
export function updateMeetingsFailAction(err) {
  return {
    type: types.UPDATE_MEETING_FAIL,
    err,
  };
}
export function resetNotis() {
  return {
    type: types.DEFAULT_ACTION,
  };
}
