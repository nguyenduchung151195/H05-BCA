import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addProjects state domain
 */

const selectAddProjectsDomain = state => state.get('addProjectss', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddProjects
 */

const makeSelectaddProjectss = () => createSelector(selectAddProjectsDomain, substate => substate.toJS());

export default makeSelectaddProjectss;
export { selectAddProjectsDomain };
