import {
  GET_ALL_DOCUMENT_CATEGORY, GET_ALL_DOCUMENT_CATEGORY_FAILURE, GET_ALL_DOCUMENT_CATEGORY_SUCCESS,
  ADD_DOCUMENT_CATEGORY,
  ADD_DOCUMENT_CATEGORY_SUCCESS,
  ADD_DOCUMENT_CATEGORY_FAILURE,
  UPDATE_DOCUMENT_CATEGORY,
  UPDATE_DOCUMENT_CATEGORY_SUCCESS,
  UPDATE_DOCUMENT_CATEGORY_FAILURE,
  DELETE_DOCUMENT_CATEGORY,
  DELETE_DOCUMENT_CATEGORY_FAILURE,
  DELETE_DOCUMENT_CATEGORY_SUCCESS,
  RESET_DOCUMENT_CATEGORY,
  RESET_DOCUMENT_CATEGORY_SUCCESS,
  RESET_DOCUMENT_CATEGORY_FAILURE
} from "./contants"

// get all
export function getAllDocumentCategory() {
  return {
    type: GET_ALL_DOCUMENT_CATEGORY,
  }
}
export function getAllDocumentCategorySuccess(data) {
  return {
    type: GET_ALL_DOCUMENT_CATEGORY_SUCCESS,
    data
  }
}
export function getAllDocumentCategoryFailure(error) {
  return {
    type: GET_ALL_DOCUMENT_CATEGORY_FAILURE,
    error
  }
}

// add
export function addDocumentCategory(data) {
  return {
    type: ADD_DOCUMENT_CATEGORY,
    data
  }
}
export function addDocumentCategorySuccess(data) {
  return {
    type: ADD_DOCUMENT_CATEGORY_SUCCESS,
    data
  }
}
export function addDocumentCategoryFailure(error) {
  return {
    type: ADD_DOCUMENT_CATEGORY_FAILURE,
    error
  }
}

// update
export function updateDocumentCategory(data, typeChild) {
  return {
    type: UPDATE_DOCUMENT_CATEGORY,
    typeChild,
    data
  }
}
export function updateDocumentCategorySuccess(data) {
  return {
    type: UPDATE_DOCUMENT_CATEGORY_SUCCESS,
    data
  }
}
export function updateDocumentCategoryFailure(error) {
  return {
    type: UPDATE_DOCUMENT_CATEGORY_FAILURE,
    error
  }
}

// delete
export function deleteDocumentCategory(data) {
  return {
    type: DELETE_DOCUMENT_CATEGORY,
    data
  }
}
export function deleteDocumentCategorySuccess(data) {
  return {
    type: DELETE_DOCUMENT_CATEGORY_SUCCESS,
    data
  }
}
export function deleteDocumentCategoryFailure(error) {
  return {
    type: DELETE_DOCUMENT_CATEGORY_FAILURE,
    error
  }
}

// reset
export function resetDocumentCategory() {
  return {
    type: RESET_DOCUMENT_CATEGORY,
  }
}
export function resetDocumentCategorySuccess(data) {
  return {
    type: RESET_DOCUMENT_CATEGORY_SUCCESS,
    data
  }
}
export function resetDocumentCategoryFailure(error) {
  return {
    type: RESET_DOCUMENT_CATEGORY_FAILURE,
    error
  }
}