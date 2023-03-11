import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addRolesGroupPage state domain
 */

const selectAddRolesGroupPortalPageDomain = state => state.get('addRolesGroupPortalPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddRolesGroupPage
 */

const makeSelectAddRolesGroupPortalPage = () => createSelector(selectAddRolesGroupPortalPageDomain, substate => substate.toJS());

export default makeSelectAddRolesGroupPortalPage;
export { selectAddRolesGroupPortalPageDomain };
