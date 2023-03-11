import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addMeetingSchedule state domain
 */

const selectAddMeetingScheduleDomain = state => state.get('addMeetingSchedule', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddMeetingSchedule
 */

const makeSelectAddMeetingSchedule = () => createSelector(selectAddMeetingScheduleDomain, substate => substate.toJS());

export default makeSelectAddMeetingSchedule;
export { selectAddMeetingScheduleDomain };
