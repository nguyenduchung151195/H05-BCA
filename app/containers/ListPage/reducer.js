/*
 *
 * ListPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_ROWS_SUCCESS } from './constants';

export const initialState = fromJS({
  rows: [],
  columns: [],
  tableColumnExtensions: [{ columnName: 'checkbox', width: 90 }],
  columnOrder: [],
  selected: [],
  selectAll: false,
  dialogStatus: false,
  activePage: 0,
  perPage: 10,
  search: '',
  initDialog: false,
  rightColumns: ['edit'],
  deleteDialog: false,
  shareDialog: false,
  allId: [],
});

function listPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case 'SET_STATE':
      return state.merge(action.data);
    case GET_ROWS_SUCCESS:
      return state.set('rows', action.data);
    default:
      return state;
  }
}

export default listPageReducer;
