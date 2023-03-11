import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the LifeDrive state domain
 */

const selectLifeDriveDomain = state => state.get('lifeDrive', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by LifeDrive
 */

const makeSelectLifeDrive = () => createSelector(selectLifeDriveDomain, substate => substate.toJS());

export default makeSelectLifeDrive;
export { selectLifeDriveDomain };
