import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the sourcePage state domain
 */

const selectSourcePageDomain = state => state.get('sourcePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SourcePage
 */

const makeSelectSourcePage = () => createSelector(selectSourcePageDomain, substate => substate.toJS());

export default makeSelectSourcePage;
export { selectSourcePageDomain };
