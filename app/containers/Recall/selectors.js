import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the Recall state domain
 */

const selectRecallDomain = state => state.get('recall', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Recall
 */

const makeSelectRecall = () => createSelector(selectRecallDomain, substate => substate.toJS());
export default makeSelectRecall;
export { selectRecallDomain };