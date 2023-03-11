import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the meetingPage state domain
 */

const selectMeetingPageDomain = state => state.get('meetingPage', initialState);
const selectDashboardDomain = state => state.get('dashboardPage', initialState);
/**
 * Other specific selectors
 */

/**
 * Default selector used by MeetingPage
 */

const makeSelectMeetingPage = () => createSelector(selectMeetingPageDomain, substate => substate.toJS());
const makeSelectDashboardPage = () => createSelector(selectDashboardDomain, substate => substate.toJS());
export default makeSelectMeetingPage;
export { selectMeetingPageDomain, makeSelectDashboardPage };
