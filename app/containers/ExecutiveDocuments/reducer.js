/*
 *
 * ExecutiveDocuments reducer
 *
 */

import { fromJS } from 'immutable';

import {
  MERGE_DATA,
  UPDATE_STATUS,
  UPDATE_STATUS_SUCCESS,
  UPDATE_STATUS_FAILED,
} from './constants';

export const initialState = fromJS({
  tab: 0,
  reload: false,
  kanbanFilter: {},
  success: false,
  error: false,
  loading: false,
  // receiveCost: 0,
  // processorsCost: 0,
  // supportersCost: 0,
  // viewersCost: 0,
  // commandersCost: 0,
});

function executiveDocumentsReducer(state = initialState, action) {
  // console.log('action.data', action.data)
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case UPDATE_STATUS:
      return state
        .set('success', false)
        .set('loading', true)
        .set('error', false)
        .set('reload', false);
    case UPDATE_STATUS_SUCCESS:
      return state
        .set('success', true)
        .set('loading', false)
        .set('error', false);
    case UPDATE_STATUS_FAILED:
      return state
        .set('success', false)
        .set('loading', false)
        .set('error', true)
        .set('reload', true);

    default:
      return state;
  }
}

export default executiveDocumentsReducer;