import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ApproveGroupDetailPage state domain
 */

const selectApproveGroupDetailPageDomain = state => state.get('ApproveGroupDetailPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ApproveGroupDetailPage
 */

const makeSelectApproveGroupDetailPage = () => createSelector(selectApproveGroupDetailPageDomain, substate => substate.toJS());

export default makeSelectApproveGroupDetailPage;
export { selectApproveGroupDetailPageDomain };
