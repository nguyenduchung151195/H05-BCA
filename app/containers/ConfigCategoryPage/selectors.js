import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the SocialInsurancePage state domain
 */
const selectConfigDocumentCategoryDomain = state => state.get('configDocumentCategory', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SocialInsurancePage
 */

const makeSelectConfigDocumentCategoryPage = () => createSelector(selectConfigDocumentCategoryDomain, substate => substate.toJS());

export default makeSelectConfigDocumentCategoryPage;
export { selectConfigDocumentCategoryDomain };
