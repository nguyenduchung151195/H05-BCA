import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ProcessFlow state domain
 */

const selectProcessFlowDomain = state => state.get('processFlow', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProcessFlow
 */

const makeSelectProcessFlow = () => createSelector(selectProcessFlowDomain, substate => substate.toJS());
export default makeSelectProcessFlow;
export { selectProcessFlowDomain };