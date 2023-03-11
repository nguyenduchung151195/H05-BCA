/*
 *
 * SampleProcess reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_TEMPLATE, GET_TEMPLATE_SUCCESS } from './constants';

export const initialState = fromJS({ templates: [] });

function sampleProcessReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_TEMPLATE:
      return state;
    case GET_TEMPLATE_SUCCESS:
      return state.set('templates', action.templates);
    default:
      return state;
  }
}

export default sampleProcessReducer;
