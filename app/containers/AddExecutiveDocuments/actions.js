/*
 *
 * AddExecutiveDocuments actions
 *
 */

import {MERGE_DATA,
  ADD_EXECUTIVE_DOCUMENT,
  ADD_EXECUTIVE_DOCUMENT_SUCCESS,
  ADD_EXECUTIVE_DOCUMENT_FAIL,
  UPDATE_EXECUTIVE_DOCUMENT,
  UPDATE_EXECUTIVE_DOCUMENT_SUCCESS,
  UPDATE_EXECUTIVE_DOCUMENT_FAIL,
  DELETE_EXECUTIVE_DOCUMENT,
  DELETE_EXECUTIVE_DOCUMENT_SUCCESS,
  DELETE_EXECUTIVE_DOCUMENT_FAIL,
  UPLOAD_FILE,
  UPLOAD_FILE_FAIL,
  UPLOAD_FILE_SUCCESS,
} from './constants';

export function mergeData(data) {
    return {
      type: MERGE_DATA,
      data
    }
  }

  export function addExecutiveDocument(data, cb, types) {
    return {
      type: ADD_EXECUTIVE_DOCUMENT,
      data,
      cb,
      types
    }
  }
  
  export function addExecutiveDocumentSuccess(data) {
    return {
      type: ADD_EXECUTIVE_DOCUMENT_SUCCESS,
      data
    }
  }
  
  export function addExecutiveDocumentFail(error) {
    return {
      type: ADD_EXECUTIVE_DOCUMENT_FAIL,
      error
    }
  }
  
  export function updateExecutiveDocument(data, cb) {
    return {
      type: UPDATE_EXECUTIVE_DOCUMENT,
      data,
      cb
    }
  }

  export function uploadFileSuccess(data) {
    return {
      type: UPLOAD_FILE_SUCCESS,
      data
    }
  }
  export function uploadFile(data) {
    return {
      type: UPLOAD_FILE,
      data
    }
  }
  
  export function updateExecutiveDocumentSuccess(data) {
    return {
      type: UPDATE_EXECUTIVE_DOCUMENT_SUCCESS,
      data
    }
  }
  
  export function updateExecutiveDocumentFail(error) {
    return {
      type: UPDATE_EXECUTIVE_DOCUMENT_FAIL,
      error
    }
  }
  
  export function deleteExecutiveDocument(ids) {
    return {
      type: DELETE_EXECUTIVE_DOCUMENT,
      ids
    }
  }
  
  export function deleteExecutiveDocumentSuccess(data) {
    return {
      type: DELETE_EXECUTIVE_DOCUMENT_SUCCESS,
      data
    }
  }
  
  export function deleteExecutiveDocumentFail(error) {
    return {
      type: DELETE_EXECUTIVE_DOCUMENT_FAIL,
      error
    }
  }