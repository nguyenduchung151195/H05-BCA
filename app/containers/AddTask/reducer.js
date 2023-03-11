/*
 *
 * AddTask reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_TASK,
  GET_TASK_FAIL,
  SET_STATE,
  GET_DEFAULT,
  HANDLE_DISCOUNT,
  POST_TASK,
  POST_TASK_FAIL,
  POST_TASK_SUCCESS,
  GET_TASK_CURRENT,
  GET_TASK_CURRENT_FAIL,
  GET_TASK_CURRENT_SUCCESS,
  PUT_TASK_SUCCESS,
  PUT_TASK_FAIL,
  CLOSE_TASK,
  PUT_PROGRESS_SUCCESS,
  MERGE_DATA,
  POST_TRANFER_SUCCESS,
  GET_PROJECT_DEFAULT_ID,
  GET_PARENT_SUCCESS,
} from './constants';

export const initialState = fromJS({
  data: '',
  _id: '',
  projectId: '',
  parentId: null,
  name: '',
  ratio: '',
  description: '',
  startDate: new Date().toISOString().substring(0, 10),
  endDate: '',
  taskStatus: 1,
  priority: 1,
  inCharge: [],
  approved: '',
  customer: '',
  template: '',
  remember: false,
  dateRemember: '',
  rememberTo: 1,
  join: [],
  files: [],
  fileName: '',
  fileDescription: '',
  fileTitle: '',
  url: '',
  employees: [],
  viewable: [],
  customers: [],
  projects: [],
  isProject: true,
  idSelect: null,
  tasks: [],
  note: '',
  progress: 0,
  listInCharge: [],
  listJoin: [],
  type: 1,
  currentEmployees: [],
  tranferEmployees: [],
  support: [],
  taskType: 1,
  businessOpportunities: null,
  comments: [],
  content: '',
  kanbanStatus: 1,
  objectAvatar: '',
  avatar: '',
  displayProgress: false,
  selectProgress: 0,
  selectStatus: null,
  selectNote: '',
  selectPiority: null,
  smallest: false,
  parentTask: {},
  profile: '',
  parentStatus: null,
  category: '',
  source: '',
});

function addTaskReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DEFAULT:
      return state.merge(initialState).merge(action.data);
    case GET_TASK:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_TASK_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case SET_STATE:
      return state.set(action.name, action.value);
    case HANDLE_DISCOUNT:
      return state.set(action.name, action.checked);
    case POST_TASK:
      return state.set('data', action.data);
    case POST_TASK_SUCCESS:
      return state;
    case POST_TASK_FAIL:
      return state.set('err', action.err);
    case GET_TASK_CURRENT:
      return state.set('_id', action.id);
    case GET_TASK_CURRENT_SUCCESS:
      return state
        .merge(action.data)
        .set('idSelect', null)
        .set('listInCharge', [...action.data.inCharge])
        .set('listJoin', [...action.data.join]);
    case GET_TASK_CURRENT_FAIL:
      return state;
    case PUT_TASK_SUCCESS:
      return state.merge(action.data);
    case PUT_TASK_FAIL:
      return state.set('err', action.err);
    case CLOSE_TASK:
      return state.merge(initialState);
    case PUT_PROGRESS_SUCCESS:
      return state.set('data', action.data);
    case POST_TRANFER_SUCCESS:
      return state.set('data', action.data);
    case GET_PROJECT_DEFAULT_ID:
      return state.merge(initialState).set('_id', action.id);
    case GET_PARENT_SUCCESS:
      return state.set('parentTask', action.data);
    default:
      return state;
  }
}

export default addTaskReducer;
