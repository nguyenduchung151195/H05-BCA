import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the EditTaskPage state domain
 */

const selectEditTaskPage = state => state.get('editTaskPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by EditTaskPage
 */

const makeSelectEditTaskPage = () => createSelector(selectEditTaskPage, substate => substate.toJS());
export default makeSelectEditTaskPage;
export { selectEditTaskPage };