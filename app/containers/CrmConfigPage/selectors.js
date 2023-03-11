import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the crmConfigPage state domain
 */

const selectCrmConfigPageDomain = state => state.get('crmConfigPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by CrmConfigPage
 */

const makeSelectCrmConfigPage = () => createSelector(selectCrmConfigPageDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectCrmConfigPageDomain, substate => substate.get(listName));
export default makeSelectCrmConfigPage;
export { selectCrmConfigPageDomain, makeSelectBody };
