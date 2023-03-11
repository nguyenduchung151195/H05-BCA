import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the notificationPage state domain
 */

const selectNotificationPageDomain = state => state.get('notificationPage', initialState);
const selectDashboardPageDomain = state => state.get('dashboardPage', initialState);
/**
 * Other specific selectors
 */

/**
 * Default selector used by NotificationPage
 */

const makeSelectNotificationPage = () => createSelector(selectNotificationPageDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectNotificationPageDomain, substate => substate.get(listName));
const makeSelectDashboardPage = () => createSelector(selectDashboardPageDomain, substate => substate.toJS());
export default makeSelectNotificationPage;
export { selectNotificationPageDomain, makeSelectDashboardPage, makeSelectBody };
