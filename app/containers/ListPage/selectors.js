import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the listPage state domain
 */

const selectListPageDomain = state => state.get('listPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ListPage
 */

const makeSelectListPage = () => createSelector(selectListPageDomain, substate => substate.toJS());
const makeSelectRows = () => createSelector(selectListPageDomain, substate => substate.toJS().rows);

export default makeSelectListPage;
export { selectListPageDomain, makeSelectRows };
