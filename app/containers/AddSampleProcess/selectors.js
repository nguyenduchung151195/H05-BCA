import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addSampleProcess state domain
 */

const selectAddSampleProcessDomain = state => state.get('addSampleProcess', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddSampleProcess
 */

const makeSelectAddSampleProcess = () => createSelector(selectAddSampleProcessDomain, substate => substate.toJS());

export default makeSelectAddSampleProcess;
export { selectAddSampleProcessDomain };
