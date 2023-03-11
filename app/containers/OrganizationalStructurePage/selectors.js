import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the organizationalStructurePage state domain
 */

const selectOrganizationalStructurePageDomain = state => state.get('organizationalStructurePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by OrganizationalStructurePage
 */

const makeSelectOrganizationalStructurePage = () => createSelector(selectOrganizationalStructurePageDomain, substate => substate.toJS());

export default makeSelectOrganizationalStructurePage;
export { selectOrganizationalStructurePageDomain };
