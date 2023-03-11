import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the historyLog state domain
 */

const selectHistoryLogDomain = state => state.get('historyLog', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by HistoryLog
 */

const makeSelectHistoryLog = () => createSelector(selectHistoryLogDomain, substate => substate.toJS());

export default makeSelectHistoryLog;
export { selectHistoryLogDomain };
