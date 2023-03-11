import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the EditGoDocuments state domain
 */

const selectEditGoDocumentsDomain = state => state.get('editGoDocuments', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by EditGoDocuments
 */

const makeSelectEditGoDocuments = () => createSelector(selectEditGoDocumentsDomain, substate => substate.toJS());
export default makeSelectEditGoDocuments;
export { selectEditGoDocumentsDomain };