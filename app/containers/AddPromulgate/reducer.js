/*
 *
 * AddPromulgate reducer
 *
 */

import { fromJS } from 'immutable';

import {
  MERGE_DATA,
  ADD_SIGNED_DOCUMENT,
  ADD_SIGNED_DOCUMENT_SUCCESS,
  ADD_SIGNED_DOCUMENT_FAIL,
  UPDATE_SIGNED_DOCUMENT,
  UPDATE_SIGNED_DOCUMENT_SUCCESS,
  UPDATE_SIGNED_DOCUMENT_FAIL,
  DELETE_SIGNED_DOCUMENT,
  DELETE_SIGNED_DOCUMENT_SUCCESS,
  DELETE_SIGNED_DOCUMENT_FAIL,
} from './constants';

export const initialState = fromJS({
  reload: false,
  kanbanStatus: 0,
  name: '',
});

function addSignedDocumentReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case ADD_SIGNED_DOCUMENT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case ADD_SIGNED_DOCUMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('data', action.data)
        .set('data', action.data.data)
        .set('count', action.data.count)
        .set('skip', action.data.skip)
        .set('limit', action.data.limit)
        .set('error', false);
    case ADD_SIGNED_DOCUMENT_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addSignedDocumentReducer;