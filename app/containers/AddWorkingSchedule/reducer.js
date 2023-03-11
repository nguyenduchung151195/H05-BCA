/*
 *
 * AddWorkingSchedule reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, POST_DATA_SUCCESS, GET_CURRENT, GET_CURRENT_SUCCESS, GET_DEFAULT, PUT_DATA_SUCCESS } from './constants';
import moment from 'moment'
import { getDatetimeLocal } from '../../helper';
export const initialState = fromJS({
  data: {},
  kanbanStatus: 0,
  name: '',
  calenDetail: [
    [
      {
        timeMeet: '',
        timeEndMeet: '',
        contentMeet: '',
        time: new Date(),
        typeCalendar: '',
        addressMeet: '',
        roomMetting: null,
        checkMeet: false,
      }
    ],
  ],
  search: '',
  address: '',
  cityCircle: {},
  zoom: 18,
  location: { lat: 0, lng: 0 },
  timeStart: moment().startOf("weeks"),
  timeEnd: moment().day(5),
  approved: null,
  customers: [],
  people: null,
  organizer: null,
  content: '',
  result: '',
  file: undefined,
  from: null,
  link: 'Calendar/working-calendar',
  typeCalendar: 2,
  id: 'add',
  idTask: 'add',
  tab: 0,
  openDrawer: false,
  filter: {},
  employee: null,
  code: 'add',
  addSchedule: {
    timeMeet: '',
    addressMeet: '',
    contentMeet: '',
    roomMetting: null,
    timeEndMeet: '',
    typeCalendar: {},
  },
  editSchedule: {
    timeMeet: '',
    addressMeet: '',
    contentMeet: '',
    roomMetting: null,
    timeEndMeet: '',
    typeCalendar: {},
  }

});

function addWorkingScheduleReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case POST_DATA_SUCCESS:
      return state.set('data', action.data);
    case GET_CURRENT:
      return state.set('id', action.id);
    case GET_CURRENT_SUCCESS:
      return state.merge(action.data);
    case GET_DEFAULT:
      return state.merge(initialState);
    case PUT_DATA_SUCCESS:
      return state.set('data', action.data);
    default:
      return state;
  }
}

export default addWorkingScheduleReducer;
