import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the templateTypePage state domain
 */

const selectTemplateTypePageDomain = state => state.get('templateTypePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TemplateTypePage
 */

const makeSelectTemplateTypePage = () => createSelector(selectTemplateTypePageDomain, substate => substate.toJS());

export default makeSelectTemplateTypePage;
export { selectTemplateTypePageDomain };
