import { fromJS } from 'immutable';
import calendarContainerReducer from '../reducer';

describe('calendarContainerReducer', () => {
  it('returns the initial state', () => {
    expect(calendarContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
