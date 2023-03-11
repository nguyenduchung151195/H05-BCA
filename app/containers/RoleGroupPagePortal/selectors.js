import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the roleGroupPage state domain
 */

const selectRoleGroupPageDomainPortal = state => state.get('roleGroupPagePortal', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by RoleGroupPage
 */

const makeSelectRoleGroupPagePortal = () => createSelector(selectRoleGroupPageDomainPortal, substate => substate.toJS());

export default makeSelectRoleGroupPagePortal;
export { selectRoleGroupPageDomainPortal };
