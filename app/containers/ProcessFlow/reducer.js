/*
 *
 * ProcessFlow reducer
 *
 */

import { fromJS } from 'immutable';

import {MERGE_DATA,
} from './constants';

export const initialState = fromJS({
    tab: 0,
    reload: false,
  });

  function processFlowReducer(state = initialState, action) {
    switch (action.type) {
      case MERGE_DATA:
        return state.merge(action.data);
      default:
        return state;
    }
  }
  
  export default processFlowReducer;