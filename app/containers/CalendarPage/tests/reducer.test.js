import { fromJS } from 'immutable';
import calendarPageReducer from '../reducer';

describe('calendarPageReducer', () => {
  it('returns the initial state', () => {
    expect(calendarPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
