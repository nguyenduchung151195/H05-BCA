import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the listOfDepartmentPage state domain
 */

const selectListOfDepartmentPageDomain = state => state.get('listOfDepartmentPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ListOfDepartmentPage
 */

const makeSelectListOfDepartmentPage = () => createSelector(selectListOfDepartmentPageDomain, substate => substate.toJS());

export default makeSelectListOfDepartmentPage;
export { selectListOfDepartmentPageDomain };
