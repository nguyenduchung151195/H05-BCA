import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addTemplatePage state domain
 */

const selectAddTemplatePageDomain = state => state.get('addTemplatePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddTemplatePage
 */

const makeSelectAddTemplatePage = () => createSelector(selectAddTemplatePageDomain, substate => substate.toJS());

export default makeSelectAddTemplatePage;
export { selectAddTemplatePageDomain };
