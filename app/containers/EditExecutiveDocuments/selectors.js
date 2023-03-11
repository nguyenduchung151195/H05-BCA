import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editExecutiveDocuments state domain
 */

const selectEditExecutiveDocumentsDomain = state => state.get('editExecutiveDocuments', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by editExecutiveDocuments
 */

const makeSelectEditExecutiveDocuments = () => createSelector(selectEditExecutiveDocumentsDomain, substate => substate.toJS());
export default makeSelectEditExecutiveDocuments;
export { selectEditExecutiveDocumentsDomain };