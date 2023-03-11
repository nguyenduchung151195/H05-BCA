import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addTask state domain
 */

const selectAddTaskDomain = state => state.get('addTask', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddTask
 */

const makeSelectAddTask = () => createSelector(selectAddTaskDomain, substate => substate.toJS());

export default makeSelectAddTask;
export { selectAddTaskDomain };
