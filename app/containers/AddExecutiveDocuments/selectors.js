import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addExecutiveDocuments state domain
 */

const selectAddExecutiveDocumentsDomain = state => state.get('addExecutiveDocuments', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by addExecutiveDocuments
 */

const makeSelectAddExecutiveDocuments = () => createSelector(selectAddExecutiveDocumentsDomain, substate => substate.toJS());
export default makeSelectAddExecutiveDocuments;
export { selectAddExecutiveDocumentsDomain };