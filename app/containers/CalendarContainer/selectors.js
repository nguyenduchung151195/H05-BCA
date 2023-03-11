import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the calendarContainer state domain
 */

const selectCalendarContainerDomain = state => state.get('calendarContainer', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by CalendarContainer
 */

const makeSelectCalendarContainer = () => createSelector(selectCalendarContainerDomain, substate => substate.toJS());

export default makeSelectCalendarContainer;
export { selectCalendarContainerDomain };
