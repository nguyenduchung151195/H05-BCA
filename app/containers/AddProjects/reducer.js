/*
 *
 * AddProjects reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  MERGE_DATA,
  SET_STATE,
  PUT_PROGRESS_SUCCESS,
  POST_PROJECT,
  GET_DATA_SUCCESS,
  POST_DRIVE,
  POST_FILE_SYSTEM,
  POST_APPROVE_SUCCESS,
  GET_PROJECT_CURRENT_SUCCESS,
  GET_EMPLOYEE,
  GET_EMPLOYEE_SUCCESS,
  CLEAN,
} from './constants';
import { getDatetimeLocal } from '../../helper';

export const initialState = fromJS({
  data: '',
  isProject: true,
  name: '',
  template: '',
  description: '',
  startDate: getDatetimeLocal(),
  endDate: getDatetimeLocal(),
  taskStatus: '',
  priority: 3,
  kanbanStatus: 1,
  planerStatus: 1,
  errorName: true,
  errorTemplate: true,
  errorCustomer: true,
  errorCategory: true,
  errorPriority: true,
  errorDescription: true,
  errorTaskManager: true,
  errorViewable: true,
  errorInCharge: true,
  errorSupport: true,
  errorApproved: true,
  errorApprovedProgress: true,
  customer: '',
  taskMaster: '',
  inCharge: [],
  join: [],
  joinPlan: [],
  supportPlan: [],
  inChargePlan: [],
  viewable: [],
  support: [],
  approved: [],
  incommingDocuments: [],
  outGoingDocuments: [],
  projects: [],
  crmStatus: [],
  _id: '',
  currentId: '',
  idSelect: '',
  progress: 0,
  parentId: '',
  projectId: '',

  fileName: '',
  fileDescription: '',
  fileTitle: '',
  finishDate: null,
  url: '',
  type: 1,
  ratio: '',
  files: [],
  openDrawerAdd: false,
  selectTask: true,
  note: '',
  category: 1,
  typeTask: 1,
  typeTranfer: 1,
  tranferJoin: [],
  tranferInCharge: [],
  currentJoin: [],
  currentInCharge: [],
  employees: [],
  listInCharge: [],
  listJoin: [],
  listRatio: [],
  profile: '',
  joinChild: [],
  joinChildData: [],
  objectAvatar: '',
  avatar: '',
  displayProgress: false,
  selectProgress: 0,
  selectStatus: null,
  selectNote: '',
  selectPiority: null,
  smallest: false,
  reloadTranfer: 0,
  reloadHistory: 0,
  reloadProgress: 0,
  reloadApproved: 0,
  maxDate: null,
  minDate: null,
  hideAddConversation: true,
  taskStage: 1,
  isObligatory: false,
  configs: [],
  assigner: null,
  taskManager: [],
  approvedObj: {
    name: '',
    subCode: 'Task',
    form: '',
    group: null,
  },
  templates: [],
  approvedGroups: [],
  profileApprove: [],
  projectData: [],
  projectName: '',
  employeesData: [],
  errorDescription: true,
  planApproval: 0,
  acceptApproval: 0,
  approvedProgress: null,
  updatedBy: null,
  order: undefined,
  locationAddress: '',
  cityCircle: {},
  search: '',
  location: { lat: 0, lng: 0 },
  zoom: 18,
  provincial: 1,
  taskLevel: null,
  dataTask: [],
  processors: [],
  textContent: '',
  reason: '',
  statusAccept: 'new',
  taskAttached: []
});

function addProjectsReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAN:
      return initialState;
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case SET_STATE:
      return state.set(action.name, action.value);
    case PUT_PROGRESS_SUCCESS:
      return state.set('data', action.data);
    case POST_PROJECT:
      return state.set('data', action.data);
    case GET_DATA_SUCCESS:
      return state.set('configs', action.data).set('templates', action.templates);
    case POST_DRIVE:
      return state.set('data', action.data);
    case POST_FILE_SYSTEM:
      return state.set('data', action.data);
    case POST_APPROVE_SUCCESS:
      return state.set('data', action.data);
    case GET_PROJECT_CURRENT_SUCCESS:
      return state.merge(action.data);
    case GET_EMPLOYEE:
      return state;
    case GET_EMPLOYEE_SUCCESS:
      return state.set('employeesData', action.data);
    default:
      return state;
  }
}

export default addProjectsReducer;
