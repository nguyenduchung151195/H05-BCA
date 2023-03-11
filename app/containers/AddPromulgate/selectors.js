import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addPromulgate state domain
 */

const selectAddPromulgate = state => state.get('addPromulgate', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by addPromulgate
 */

const makeSelectAddPromulgate = () => createSelector(selectAddPromulgate, substate => substate.toJS());
export default makeSelectAddPromulgate;
export { selectAddPromulgate };