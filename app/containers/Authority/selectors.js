import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the Authority state domain
 */

const selectAuthorityDomain = state => state.get('authority', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Authority
 */

const makeSelectAuthority = () => createSelector(selectAuthorityDomain, substate => substate.toJS());
export default makeSelectAuthority;
export { selectAuthorityDomain };