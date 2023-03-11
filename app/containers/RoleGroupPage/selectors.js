import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the roleGroupPage state domain
 */

const selectRoleGroupPageDomain = state => state.get('roleGroupPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by RoleGroupPage
 */

const makeSelectRoleGroupPage = () => createSelector(selectRoleGroupPageDomain, substate => substate.toJS());

export default makeSelectRoleGroupPage;
export { selectRoleGroupPageDomain };
