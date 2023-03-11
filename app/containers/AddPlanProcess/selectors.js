import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addPlanProcess state domain
 */

const selectAddPlanProcessDomain = state => state.get('addPlanProcess', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddPlanProcess
 */

const makeSelectAddPlanProcess = () => createSelector(selectAddPlanProcessDomain, substate => substate.toJS());

export default makeSelectAddPlanProcess;
export { selectAddPlanProcessDomain };
