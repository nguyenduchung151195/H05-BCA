import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addWorkingSchedule state domain
 */

const selectAddWorkingScheduleDomain = state => state.get('addWorkingSchedule', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddWorkingSchedule
 */

const makeSelectAddWorkingSchedule = () => createSelector(selectAddWorkingScheduleDomain, substate => substate.toJS());

export default makeSelectAddWorkingSchedule;
export { selectAddWorkingScheduleDomain };
