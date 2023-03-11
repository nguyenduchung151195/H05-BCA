import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the conversation state domain
 */

const selectConversationDomain = state => state.get('conversation', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Conversation
 */

const makeSelectConversation = () => createSelector(selectConversationDomain, substate => substate.toJS());

export default makeSelectConversation;
export { selectConversationDomain };
