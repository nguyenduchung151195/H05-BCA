/*
 *
 * ConfigTask reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION, GET_CONFIG_SUCCSESS, MERGE_DATA, GET_DEFAULT,
  ADD_SOURCE,
  ADD_SOURCE_FAIL,
  ADD_SOURCE_SUCCESS,
  RESET_ALL_SOURCE,
  RESET_ALL_SOURCE_SUCCESS,
  RESET_ALL_SOURCE_FAILURE,
  EDIT_SOURCE,
  EDIT_SOURCE_SUCCESS,
  EDIT_SOURCE_FAIL,
  DELETE_CRM_SOURCES,
  DELETE_CRM_SOURCES_SUCCESS,
  DELETE_CRM_SOURCES_FAIL,
  GET_ALL_STATUS,
  GET_ALL_STATUS_FAIL,
  GET_ALL_STATUS_SUCCESS,
  GET_ALL_SOURCES,
  GET_ALL_SOURCES_FAIL,
  GET_ALL_SOURCES_SUCCESS,
  UPDATE_SOURCE,
  UPDATE_SOURCE_SUCCESS,
  UPDATE_SOURCE_FAIL,
} from './constants';

export const initialState = fromJS({
  config: [],
  data: '',
  dialogKanban: false,
  name: '',
  code: '',
  type: 1,
  color: '#ff0000',
  configId: null,
  _id: '',
  configItem: '',
  openDialog: false,
  checkConfig: [],
});

function configTaskReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_CONFIG_SUCCSESS:
      return state.set('config', action.config);
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DEFAULT:
      return state
        .set('name', '')
        .set('code', '')
        .set('color', '#ff0000')
        .set('configItem', '')
        .set('listStatus', action.data);
    case ADD_SOURCE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case ADD_SOURCE_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('error', false)
        .set('notiMessage', action.message)
        .set('sources', action.data);
    case ADD_SOURCE_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case RESET_ALL_SOURCE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
    // .set('body', action.body);
    case RESET_ALL_SOURCE_SUCCESS:
      return state
        .set('loading', false)
        // .set('callAPIStatus', 1)
        .set('error', false)
        .set('notiMessage', action.message)
    // .set('sources', action.data);
    case RESET_ALL_SOURCE_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        // .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case EDIT_SOURCE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case EDIT_SOURCE_SUCCESS:
      return state
        .set('loading', false)
        // .set('callAPIStatus', 1)
        .set('error', false)
        .set('notiMessage', action.message)
    // .set('sources', action.data);
    case EDIT_SOURCE_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case DELETE_CRM_SOURCES:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case DELETE_CRM_SOURCES_SUCCESS:
      return state
        .set('loading', false)
        // .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
    // .set('sources', action.data);
    case DELETE_CRM_SOURCES_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        // .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case GET_ALL_STATUS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_STATUS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_STATUS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('listStatus', action.data);
    case GET_ALL_SOURCES:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_SOURCES_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_SOURCES_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('sources', action.data);
    case UPDATE_SOURCE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_SOURCE_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('success', true)
        .set('sources', action.data);
    case UPDATE_SOURCE_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    default:
      return state;
  }
}

export default configTaskReducer;
