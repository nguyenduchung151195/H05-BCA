import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the workingSchedule state domain
 */

const selectWorkingScheduleDomain = state => state.get('workingSchedule', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WorkingSchedule
 */

const makeSelectWorkingSchedule = () => createSelector(selectWorkingScheduleDomain, substate => substate.toJS());

export default makeSelectWorkingSchedule;
export { selectWorkingScheduleDomain };
