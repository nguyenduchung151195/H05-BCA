import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the taskPage state domain
 */

const selectTaskPageDomain = state => state.get('taskPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TaskPage
 */

const makeSelectTaskPage = () => createSelector(selectTaskPageDomain, substate => substate.toJS());

export default makeSelectTaskPage;
export { selectTaskPageDomain };
