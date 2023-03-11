import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the callPage state domain
 */

const selectCallPageDomain = state => state.get('callPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by CallPage
 */

const makeSelectCallPage = () => createSelector(selectCallPageDomain, substate => substate.toJS());

export default makeSelectCallPage;
export { selectCallPageDomain };
