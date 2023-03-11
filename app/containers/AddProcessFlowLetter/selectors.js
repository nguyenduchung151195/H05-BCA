import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the AddProcessFlow state domain
 */

const selectAddProcessFlowDomain = state => state.get('addProcessFlow', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddProcessFlow
 */

const makeAddSelectProcessFlow = () => createSelector(selectAddProcessFlowDomain, substate => substate.toJS());
export default makeAddSelectProcessFlow;
export { selectAddProcessFlowDomain };