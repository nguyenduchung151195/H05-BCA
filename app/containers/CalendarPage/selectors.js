import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the calendarPage state domain
 */

const selectCalendarPageDomain = state => state.get('calendarPage', initialState);
const selectDashboardPageDomain = state => state.get('dashboardPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by CalendarPage
 */

const makeSelectCalendarPage = () => createSelector(selectCalendarPageDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashboardPageDomain, substate => substate.toJS());
export default makeSelectCalendarPage;
export { selectCalendarPageDomain, makeSelectDashboardPage, makeSelectCalendarPage };
