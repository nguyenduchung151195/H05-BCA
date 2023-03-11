import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the importPage state domain
 */

const selectImportPageDomain = state => state.get('importPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ImportPage
 */

const makeSelectImportPage = () => createSelector(selectImportPageDomain, substate => substate.toJS());

export default makeSelectImportPage;
export { selectImportPageDomain };
