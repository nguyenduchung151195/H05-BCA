import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the EditPromulgate state domain
 */

const selectEditPromulgateDomain = state => state.get('editPromulgate', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by EditPromulgate
 */

const makeSelectEditPromulgate = () => createSelector(selectEditPromulgateDomain, substate => substate.toJS());
export default makeSelectEditPromulgate;
export { selectEditPromulgateDomain };