import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the tableContainer state domain
 */

const selectTableContainerDomain = state => state.get('tableContainer', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TableContainer
 */

const makeSelectTableContainer = () => createSelector(selectTableContainerDomain, substate => substate.toJS());

export default makeSelectTableContainer;
export { selectTableContainerDomain };
