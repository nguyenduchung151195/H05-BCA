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
  RESET_NOTI,
  UPDATE_DEPARTMENT,
  UPDATE_DEPARTMENT_SUCCESS,
  UPDATE_DEPARTMENT_FALSE,
  DELETE_DEPARTMENT,
  DELETE_DEPARTMENT_FALSE,
  DELETE_DEPARTMENT_SUCCESS,
} from './constants';

export const initialState = fromJS({});

function listOfDepartmentPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('successDelete', false)
        .set('error', false);
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
        .set('success', true)
        .set('error', false)
        .set('arrDepartment', action.data);
    case ADD_DEPARTMENT:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case ADD_DEPARTMENT_FALSE:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    case ADD_DEPARTMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case UPDATE_DEPARTMENT:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case UPDATE_DEPARTMENT_FALSE:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    case UPDATE_DEPARTMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case DELETE_DEPARTMENT:
      return state
        .set('loading', true)
        .set('successDelete', false)
        .set('error', false);
    case DELETE_DEPARTMENT_FALSE:
      return state
        .set('loading', false)
        .set('successDelete', false)
        .set('error', true);
    case DELETE_DEPARTMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('successDelete', true)
        .set('error', false);
    default:
      return state;
  }
}

export default listOfDepartmentPageReducer;
