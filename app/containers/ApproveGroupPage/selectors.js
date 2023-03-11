import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ApproveGroupPage state domain
 */

const selectApproveGroupPageDomain = state => state.get('ApproveGroupPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ApproveGroupPage
 */

const makeSelectApproveGroupPage = () => createSelector(selectApproveGroupPageDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectApproveGroupPageDomain, substate => substate.get(listName));
export default makeSelectApproveGroupPage;
export { selectApproveGroupPageDomain, makeSelectBody };
