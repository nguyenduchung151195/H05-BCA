/*
 *
 * AddSignedDocument actions
 *
 */

import {MERGE_DATA,
  ADD_SIGNED_DOCUMENT,
  ADD_SIGNED_DOCUMENT_SUCCESS,
  ADD_SIGNED_DOCUMENT_FAIL,
  UPDATE_SIGNED_DOCUMENT,
  UPDATE_SIGNED_DOCUMENT_SUCCESS,
  UPDATE_SIGNED_DOCUMENT_FAIL,
  DELETE_SIGNED_DOCUMENT,
  DELETE_SIGNED_DOCUMENT_SUCCESS,
  DELETE_SIGNED_DOCUMENT_FAIL,
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

  export function addSignedDocument(data, cb) {
    return {
      type: ADD_SIGNED_DOCUMENT,
      data,
      cb
    }
  }
  
  export function addSignedDocumentSuccess(data) {
    return {
      type: ADD_SIGNED_DOCUMENT_SUCCESS,
      data
    }
  }
  
  export function addSignedDocumentFail(error) {
    return {
      type: ADD_SIGNED_DOCUMENT_FAIL,
      error
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
  
  export function updateSignedDocument(data, cb) {
    return {
      type: UPDATE_SIGNED_DOCUMENT,
      data,
      cb
    }
  }
  
  export function updateSignedDocumentSuccess(data) {
    return {
      type: UPDATE_SIGNED_DOCUMENT_SUCCESS,
      data
    }
  }
  
  export function updateSignedDocumentFail(error) {
    return {
      type: UPDATE_SIGNED_DOCUMENT_FAIL,
      error
    }
  }
  
  export function deleteSignedDocument(ids) {
    return {
      type: DELETE_SIGNED_DOCUMENT,
      ids
    }
  }
  
  export function deleteSignedDocumentSuccess(data) {
    return {
      type: DELETE_SIGNED_DOCUMENT_SUCCESS,
      data
    }
  }
  
  export function deleteSignedDocumentFail(error) {
    return {
      type: DELETE_SIGNED_DOCUMENT_FAIL,
      error
    }
  }