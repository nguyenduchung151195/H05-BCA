import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the sampleProcess state domain
 */

const selectSampleProcessDomain = state => state.get('sampleProcess', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SampleProcess
 */

const makeSelectSampleProcess = () => createSelector(selectSampleProcessDomain, substate => substate.toJS());

export default makeSelectSampleProcess;
export { selectSampleProcessDomain };
