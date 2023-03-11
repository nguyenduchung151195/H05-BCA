import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the systemConfigPage state domain
 */

const selectSystemConfigPageDomain = state => state.get('systemConfigPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SystemConfigPage
 */

const makeSelectSystemConfigPage = () => createSelector(selectSystemConfigPageDomain, substate => substate.toJS());

export default makeSelectSystemConfigPage;
export { selectSystemConfigPageDomain };
