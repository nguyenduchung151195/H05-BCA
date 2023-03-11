/*
 *
 * ProjectPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, ADD_BOS_SUCCESS, GET_DATA_SUCCESS } from './constants';

export const initialState = fromJS({
  openDrawer: false,
  id: 'add',
  projects: {},
  filter: { isProject: true },
  openDialog: false,
  isEditting: false,
  editData: {},
  projectss: [],
});

function projectPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case ADD_BOS_SUCCESS:
      return state.merge('data', action.data);
    case GET_DATA_SUCCESS:
      return state.set('projectss', action.projects);
    default:
      return state;
  }
}

export default projectPageReducer;
