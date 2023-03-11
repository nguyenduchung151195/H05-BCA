import { fromJS } from 'immutable';
import addMeetingScheduleReducer from '../reducer';

describe('addMeetingScheduleReducer', () => {
  it('returns the initial state', () => {
    expect(addMeetingScheduleReducer(undefined, {})).toEqual(fromJS({}));
  });
});
