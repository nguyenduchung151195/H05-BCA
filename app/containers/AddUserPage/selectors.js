import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addUserPage state domain
 */

const selectAddUserPageDomain = state => state.get('addUserPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddUserPage
 */

const makeSelectAddUserPage = () => createSelector(selectAddUserPageDomain, substate => substate.toJS());

export default makeSelectAddUserPage;
export { selectAddUserPageDomain };
