import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addTtPage state domain
 */

const selectAddTtPageDomain = state => state.get('addTtPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddTtPage
 */

const makeSelectAddTtPage = () => createSelector(selectAddTtPageDomain, substate => substate.toJS());

export default makeSelectAddTtPage;
export { selectAddTtPageDomain };
