import { fromJS } from 'immutable';
import workingScheduleReducer from '../reducer';

describe('workingScheduleReducer', () => {
  it('returns the initial state', () => {
    expect(workingScheduleReducer(undefined, {})).toEqual(fromJS({}));
  });
});
