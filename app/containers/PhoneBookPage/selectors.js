import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the usersPage state domain
 */

const selectUsersPageDomain = state => state.get('usersPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by UsersPage
 */

const makeSelectUsersPage = () => createSelector(selectUsersPageDomain, substate => substate.toJS());
export default makeSelectUsersPage;
export { selectUsersPageDomain };
