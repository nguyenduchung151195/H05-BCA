import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the templatePage state domain
 */

const selectTemplatePageDomain = state => state.get('templatePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TemplatePage
 */

const makeSelectTemplatePage = () => createSelector(selectTemplatePageDomain, substate => substate.toJS());

export default makeSelectTemplatePage;
export { selectTemplatePageDomain };
