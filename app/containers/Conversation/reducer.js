/*
 *
 * Conversation reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA } from './constants';

export const initialState = fromJS({
  listChat: false,
  employees: [],
  groups: [{ name: 'Dự án Hòa Bình' }, { name: 'Carbon' }],
  search: '',
  chatWindows: [],
  conversations: [],
  openDrawer: false,
  conversationGroup: [],
});

function conversationReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default conversationReducer;
