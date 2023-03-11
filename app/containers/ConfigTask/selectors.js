import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the configTask state domain
 */

const selectConfigTaskDomain = state => state.get('configTask', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ConfigTask
 */

const makeSelectConfigTask = () => createSelector(selectConfigTaskDomain, substate => substate.toJS());

export default makeSelectConfigTask;
export { selectConfigTaskDomain };
