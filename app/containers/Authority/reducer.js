/*
 *
 * Authority reducer
 *
 */

import { fromJS } from 'immutable';

import {MERGE_DATA,
} from './constants';

export const initialState = fromJS({
    tab: 0,
    reloadS: false,
    kanbanFilter: {},
  });

  function authorityReducer(state = initialState, action) {
    switch (action.type) {
      case MERGE_DATA:
        return state.merge(action.data);
      default:
        return state;
    }
  }
  
  export default authorityReducer;