/*
 *
 * TotalTask reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_TASKS, ADD_BO_SUCCESS } from './constants';

export const initialState = fromJS({
  columns: [{ name: 'name', title: 'Ten du an' }],
  selection: [],
  loading: true,
  sorting: [{ columnName: 'name', direction: 'asc' }],
  totalCount: 10,
  pageSize: 10,
  pageSizes: [10, 50, 100],
  currentPage: 0,
  rows: [],
  tableColumnExtensions: [{ columnName: 'name', width: 300 }, { columnName: 'checkbox', width: 100 }],
  open: false,
  columnnsDialog: [],
  tab: 0,
  search: '',
  allId: [],
  deleteDialog: false,
  lastQuery: '',
  id: 'add',
  planner: [],
  tasks: [],
  reload: 0,
  projects: [],
  employee: '',
  filter: {},
  departments: [],
  openDialog: false,
  isEditting: false,
  editData: {},
  approvedGroups: [],
  department: '',
  filter: { isProject: false },
  startDate1: '',
  startDate2: '',
  endDate1: '',
  endDate2: '',
  categoryCurrent: 0,
  search: 0,
  searchTime: 0,
});

function totalTaskReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_TASKS:
      return state;
    case ADD_BO_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('success', true)
        .set('error', false)
        .set('notiMessage', action.message)
        .set('bos', action.data);
    default:
      return state;
  }
}

export default totalTaskReducer;
