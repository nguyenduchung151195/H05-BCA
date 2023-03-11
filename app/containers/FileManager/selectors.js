import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the fileManager state domain
 */

const selectFileManagerDomain = state => state.get('fileManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by FileManager
 */

const makeSelectFileManager = () => createSelector(selectFileManagerDomain, substate => substate.toJS());

export default makeSelectFileManager;
export { selectFileManagerDomain };
