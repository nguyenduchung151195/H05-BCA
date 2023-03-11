import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addProjects state domain
 */

const selectAddProjectsDomain = state => state.get('addProjects', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddProjects
 */

const makeSelectAddProjects = () => createSelector(selectAddProjectsDomain, substate => substate.toJS());

export default makeSelectAddProjects;
export { selectAddProjectsDomain };
