import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the importItemsPage state domain
 */

const selectImportItemsPageDomain = state => state.get('importItemsPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ImportItemsPage
 */

const makeSelectImportItemsPage = () => createSelector(selectImportItemsPageDomain, substate => substate.toJS());

export default makeSelectImportItemsPage;
export { selectImportItemsPageDomain };
