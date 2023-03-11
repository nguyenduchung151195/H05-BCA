/*
 *
 * WorkingSchedule reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_DATA_SUCCESS, MERGE_DATA } from './constants';

export const initialState = fromJS({ reload: 1, mettings: [], tab: 1, });

function workingScheduleReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case DEFAULT_ACTION:
      return state;
    case GET_DATA_SUCCESS:
      return state.set('mettings', action.mettings);
    default:
      return state;
  }
}

export default workingScheduleReducer;
