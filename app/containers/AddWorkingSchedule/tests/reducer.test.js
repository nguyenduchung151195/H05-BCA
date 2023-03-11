import { fromJS } from 'immutable';
import addWorkingScheduleReducer from '../reducer';

describe('addWorkingScheduleReducer', () => {
  it('returns the initial state', () => {
    expect(addWorkingScheduleReducer(undefined, {})).toEqual(fromJS({}));
  });
});
