/*
 *
 * TaskPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, SET_STATE, GET_PROJECT_SUCCESS, GET_PROJECT_DEFAULT, GET_PROJECT_CURRENT } from './constants';

export const initialState = fromJS({
  data: '',
  open: false,
  tab: '',
  screen: 1,
  isProject: true,
  name: '',
  template: '',
  description: '',
  startDate: '',
  endDate: '',
  taskStatus: '',
  priority: '',
  customer: '',
  inCharge: [],
  join: [],
  viewable: [],
  approved: '',
  projects: [],
  _id: '',
  currentId: '',
  kanbanId: null,
  id: 'add',
  openDrawer: false,
  openDrawerProject: false,
});

function taskPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case SET_STATE:
      return state.set(action.name, action.value);
    case GET_PROJECT_SUCCESS:
      return state.set('projects', action.projects);
    case GET_PROJECT_DEFAULT:
      return state.merge(initialState);
    case GET_PROJECT_CURRENT:
      return state.merge(action.project);
    default:
      return state;
  }
}

export default taskPageReducer;
