/*
 *
 * AddSampleProcess reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  HANDLE_CHANGE,
  POST_TEMPLATE,
  POST_TEMPLATE_SUCCESS,
  POST_TEMPLATE_FAIL,
  GET_DEFAULT,
  GET_TEMPLATE_SUCCESS,
  GET_TEMPLATE_FAIL,
  PUT_TEMPLATE,
  PUT_TEMPLATE_FAIL,
  PUT_TEMPLATE_SUCCESS,
  MERGE_DATA,
} from './constants';

export const initialState = fromJS({
  _id: null,
  name: '',
  treeData: [],
  errorName: true,
  configs: [],
});

function addSampleProcessReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case HANDLE_CHANGE:
      return state.set(action.name, action.value);
    case POST_TEMPLATE:
      return state.set('data', action.data).set('error', false);
    case POST_TEMPLATE_SUCCESS:
      return state.set('_id', null).set('error', false);
    case POST_TEMPLATE_FAIL:
      return state.set('err', action.err).set('error', true);
    case GET_DEFAULT:
      return state.merge(initialState.toJS());
    case GET_TEMPLATE_SUCCESS:
      return state.merge(action.data);
    case GET_TEMPLATE_FAIL:
      return state();
    case PUT_TEMPLATE:
      return state.set('_id', action.id).set('error', false);
    case PUT_TEMPLATE_SUCCESS:
      return state.set('_id', null).set('error', false);
    case PUT_TEMPLATE_FAIL:
      return state.set('err', action.err).set('error', true);
    case MERGE_DATA:
      return state.merge(action.data);

    default:
      return state;
  }
}

export default addSampleProcessReducer;
