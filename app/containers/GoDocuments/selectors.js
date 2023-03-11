import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the GoDocuments state domain
 */

const selectGoDocumentsDomain = state => state.get('goDocuments', initialState);
const selectDashboardDomain = state => state.get('dashboardPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by GoDocuments
 */

const makeSelectGoDocuments = () => createSelector(selectGoDocumentsDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashboardDomain, substate => substate.toJS());
export default makeSelectGoDocuments;
export { selectGoDocumentsDomain, makeSelectDashboardPage };