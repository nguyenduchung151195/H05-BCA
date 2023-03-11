/*
 *
 * Field reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION,GET_ALL_MODULE_CODE_SUCCESS } from './constants';

export const initialState = fromJS({
  name: '',
  modules: {},
});

function fieldReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case 'CHANGE_VALUE':
      return state.set(action.data.name, action.data.value);
    case GET_ALL_MODULE_CODE_SUCCESS:
      return state.set('modules', action.data)
    default:
      return state;
  }
}

export default fieldReducer;
