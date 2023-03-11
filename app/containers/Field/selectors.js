import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the field state domain
 */

const selectFieldDomain = state => state.get('field', initialState);


/**
 * Other specific selectors
 */

/**
 * Default selector used by Field
 */

const makeSelectField = () => createSelector(selectFieldDomain, substate => substate.toJS());

export default makeSelectField;
export { selectFieldDomain };
