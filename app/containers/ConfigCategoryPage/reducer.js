/*
 *
 * SocialInsurancePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  GET_ALL_DOCUMENT_CATEGORY, GET_ALL_DOCUMENT_CATEGORY_FAILURE, GET_ALL_DOCUMENT_CATEGORY_SUCCESS,
  ADD_DOCUMENT_CATEGORY,
  ADD_DOCUMENT_CATEGORY_SUCCESS,
  ADD_DOCUMENT_CATEGORY_FAILURE,
  UPDATE_SALARY_CATEGORY,
  UPDATE_SALARY_CATEGORY_SUCCESS,
  UPDATE_SALARY_CATEGORY_FAILURE,
  DELETE_DOCUMENT_CATEGORY,
  DELETE_DOCUMENT_CATEGORY_FAILURE,
  DELETE_DOCUMENT_CATEGORY_SUCCESS
} from './contants'

export const initialState = fromJS({
  documentCategory: [],
  addDocumentCategorySuccess: false,
  updateDocumentCategorySuccess: false,
  deleteDocumentCategorySuccess: false,
});

function configDocumentCategoryReducer(state = initialState, action) {
  switch (action.type) {
    // get all
    case GET_ALL_DOCUMENT_CATEGORY_SUCCESS:
      return state.set('documentCategory', action.data).set('addDocumentCategorySuccess', false).set('updateDocumentCategorySuccess', false);

    // add
    case ADD_DOCUMENT_CATEGORY_SUCCESS:
      return state.set('addDocumentCategorySuccess', true);
    case ADD_DOCUMENT_CATEGORY_FAILURE:
      return state.set('addDocumentCategorySuccess', false);
    // update 
    case UPDATE_SALARY_CATEGORY_SUCCESS:
      return state.set('updateDocumentCategorySuccess', true);
    case UPDATE_SALARY_CATEGORY_FAILURE:
      return state.set('updateDocumentCategorySuccess', false);
    // delete
    case DELETE_DOCUMENT_CATEGORY_SUCCESS:
      return state.set('deleteDocumentCategorySuccess', true);
    case DELETE_DOCUMENT_CATEGORY_FAILURE:
      return state.set('deleteDocumentCategorySuccess', false);

    default:
      return state;
  }
}

export default configDocumentCategoryReducer;
