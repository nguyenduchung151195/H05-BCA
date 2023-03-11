/*
 *
 * AddMeetingSchedule reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  MERGE_DATA,
  POST_DATA,
  POST_DATA_SUCCESS,
  POST_DATA_FAILED,
  GET_CURRENT,
  GET_CURRENT_SUCCESS,
  PUT_DATA,
  PUT_DATA_SUCCESS,
  PUT_DATA_FAILED,
  GET_DEFAULT,
} from './constants';

export const initialState = fromJS({
  code: '',
  data: '',
  date: new Date(),
  timeStart: new Date(),
  timeEnd: new Date(),
  from: null,
  link: 'Calendar/meeting-calendar',
  organizer: null,
  people: null,
  prepare: null,
  prepareMeeting: '',
  name: '',
  address: '',
  content: '',
  kanbanStatus: 0,
  task: null,
  roomMetting: null,
  id: 'add',
  typeCalendar: 1, // 1 la lich hop, 2 la cong tac
  tab: 0,
  reload: 0,
  openDrawer: false,
  idTask: 'add',
  filter: {},
  employee: null,
  departments: [],
  department: '',
  hasRelatedProject: false,
  hasRelatedDocument: false,
  answer4doc: null,
  dataIncoming: [],
  dataTask: [],
  error: false,
  code: `LH-${new Date() * 1}`
});

function addMeetingScheduleReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('error', false);
    case MERGE_DATA:
      return state.merge(action.data);
    case POST_DATA:
      return state.set('error', false);
    case POST_DATA_SUCCESS:
      return state.set('data', action.data).set('error', false);
    case POST_DATA_FAILED:
      return state.set('error', true);
    case GET_CURRENT:
      return state.set('id', action.id);
    case GET_CURRENT_SUCCESS:
      return state.merge(action.data);
    case PUT_DATA:
      return state.set('error', false);
    case PUT_DATA_SUCCESS:
      return state.set('data', action.data).set('error', false);
    case PUT_DATA_FAILED:
      return state.set('error', true);
    case GET_DEFAULT:
      return state.merge(initialState);
    default:
      return state;
  }
}

export default addMeetingScheduleReducer;
