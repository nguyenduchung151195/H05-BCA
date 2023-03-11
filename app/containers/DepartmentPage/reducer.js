/*
 *
 * ListOfDepartmentPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_LIST_DEPARTMENT,
  GET_LIST_DEPARTMENT_FALSE,
  GET_LIST_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT,
  ADD_DEPARTMENT_FALSE,
  ADD_DEPARTMENT_SUCCESS,
} from './constants';

export const initialState = fromJS({});

function listOfDepartmentPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_LIST_DEPARTMENT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_LIST_DEPARTMENT_FALSE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_LIST_DEPARTMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('arrDepartment', action.data);
    case ADD_DEPARTMENT:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case ADD_DEPARTMENT_FALSE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case ADD_DEPARTMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false);
    default:
      return state;
  }
}

export default listOfDepartmentPageReducer;
