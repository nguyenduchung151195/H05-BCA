import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the kpiExchangePage state domain
 */

const selectKpiExchangePageDomain = state => state.get('kpiExchangePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by KpiExchangePage
 */

const makeSelectKpiExchangePage = () => createSelector(selectKpiExchangePageDomain, substate => substate.toJS());

export default makeSelectKpiExchangePage;
export { selectKpiExchangePageDomain };
