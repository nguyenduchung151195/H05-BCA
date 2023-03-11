import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addSignedDocument state domain
 */

const selectAddSignedDocumentDomain = state => state.get('addSignedDocument', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by addSignedDocument
 */

const makeSelectAddSignedDocument = () => createSelector(selectAddSignedDocumentDomain, substate => substate.toJS());
export default makeSelectAddSignedDocument;
export { selectAddSignedDocumentDomain };