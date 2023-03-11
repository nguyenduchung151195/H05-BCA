import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the hrmOrganization state domain
 */

const selectHrmOrganizationDomain = state => state.get('hrmOrganization', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by HrmOrganization
 */

const makeSelectHrmOrganization = () => createSelector(selectHrmOrganizationDomain, substate => substate.toJS());

export default makeSelectHrmOrganization;
export { selectHrmOrganizationDomain };
