import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addRolesGroupPage state domain
 */

const selectAddRolesGroupPageDomain = state => state.get('addRolesGroupPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddRolesGroupPage
 */

const makeSelectAddRolesGroupPage = () => createSelector(selectAddRolesGroupPageDomain, substate => substate.toJS());

export default makeSelectAddRolesGroupPage;
export { selectAddRolesGroupPageDomain };
