import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the totalTask state domain
 */

const selectTotalTaskDomain = state => state.get('totalTask', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TotalTask
 */

const makeSelectTotalTask = () => createSelector(selectTotalTaskDomain, substate => substate.toJS());

export default makeSelectTotalTask;
export { selectTotalTaskDomain };
