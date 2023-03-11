import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the kanbanPlugin state domain
 */

const selectKanbanPluginDomain = state => state.get('kanbanPlugin', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by KanbanPlugin
 */

const makeSelectKanbanPlugin = () => createSelector(selectKanbanPluginDomain, substate => substate.toJS());
const makeSelectBodyKanban = listName => createSelector(selectKanbanPluginDomain, substate => substate.get(listName));

export default makeSelectKanbanPlugin;
export { selectKanbanPluginDomain, makeSelectBodyKanban };
