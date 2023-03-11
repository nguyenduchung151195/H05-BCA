/*
 *
 * AddExecutiveDocuments reducer
 *
 */

import { fromJS } from 'immutable';

import {
  MERGE_DATA,
  ADD_EXECUTIVE_DOCUMENT,
  ADD_EXECUTIVE_DOCUMENT_SUCCESS,
  ADD_EXECUTIVE_DOCUMENT_FAIL,
  UPLOAD_FILE,
  UPLOAD_FILE_SUCCESS,
  UPDATE_EXECUTIVE_DOCUMENT,
  UPDATE_EXECUTIVE_DOCUMENT_SUCCESS,
  UPDATE_EXECUTIVE_DOCUMENT_FAIL,
  DELETE_EXECUTIVE_DOCUMENT,
  DELETE_EXECUTIVE_DOCUMENT_SUCCESS,
  DELETE_EXECUTIVE_DOCUMENT_FAIL,
} from './constants';

export const initialState = fromJS({
  reload: false,
  kanbanStatus: 0,
  name: '',
});

function addExecutiveDocumentsReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case ADD_EXECUTIVE_DOCUMENT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case ADD_EXECUTIVE_DOCUMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('data', action.data)
        .set('error', false);
    case ADD_EXECUTIVE_DOCUMENT_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('errorData', action.error);
    case UPDATE_EXECUTIVE_DOCUMENT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_EXECUTIVE_DOCUMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('data', action.data)
        .set('error', false);
    case UPDATE_EXECUTIVE_DOCUMENT_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('errorData', action.error);
    case UPLOAD_FILE:
      return state
        .set('load', true)
        .set('success', false)
        .set('error', true);
    case UPLOAD_FILE_SUCCESS:
      return state
        .set('load', false)
        .set('success', false)
        .set('error', true);

    default:
      return state;
  }
}

export default addExecutiveDocumentsReducer;
