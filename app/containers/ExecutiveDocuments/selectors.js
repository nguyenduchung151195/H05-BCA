import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the wagesMamagemen state domain
 */

const selectExecutiveDocumentsDomain = state => state.get('executiveDocuments', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WageSalary
 */

const makeSelectExecutiveDocuments = () => createSelector(selectExecutiveDocumentsDomain, substate => substate.toJS());
export default makeSelectExecutiveDocuments;
export { selectExecutiveDocumentsDomain };