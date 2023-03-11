import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the suppliersPage state domain
 */

const selectDashboardPageDomain = state => state.get('dashboardPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SuppliersPage
 */

const makeSelectDashboardPage = () => createSelector(selectDashboardPageDomain, substate => substate.toJS());
const makeSelectCurrentStock = () => createSelector(selectDashboardPageDomain, substate => substate.get('currentStock'));
const makeSelectProfile = () => createSelector(selectDashboardPageDomain, substate => substate.get('profile').toJS());
const makeSelectSocket = () => createSelector(selectDashboardPageDomain, substate => substate.get('socket'));
const makeSelectDocUpdated = () => createSelector(selectDashboardPageDomain, substate => substate.get('docUpdated'));
const makeSelectSocketInstance = () => createSelector(selectDashboardPageDomain, substate => substate.get('socket'));
const makeSelectMiniActive = () => createSelector(selectDashboardPageDomain, substate => substate.get('miniActive'));
const makeSelectNewComment = () => createSelector(selectDashboardPageDomain, substate => substate.get('newComment'));
const makeSelectRole = () => createSelector(selectDashboardPageDomain, substate => substate.get('role').toJS());
const makeSelectMettings = () => createSelector(selectDashboardPageDomain ,substate => substate.get('mettings').toJS())

export default makeSelectDashboardPage;
export {
    selectDashboardPageDomain,
    makeSelectCurrentStock,
    makeSelectProfile,
    makeSelectSocket,
    makeSelectDocUpdated,
    makeSelectSocketInstance,
    makeSelectMiniActive,
    makeSelectNewComment,
    makeSelectRole,
    makeSelectMettings
};
