import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the personalPage state domain
 */

const selectPersonalPageDomain = state => state.get('personalPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by PersonalPage
 */

const makeSelectPersonalPage = () => createSelector(selectPersonalPageDomain, substate => substate.toJS());

export default makeSelectPersonalPage;
export { selectPersonalPageDomain };
