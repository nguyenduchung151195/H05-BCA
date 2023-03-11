import { fromJS } from 'immutable';
import meetingRoomReducer from '../reducer';

describe('meetingRoomReducer', () => {
  it('returns the initial state', () => {
    expect(meetingRoomReducer(undefined, {})).toEqual(fromJS({}));
  });
});
