import { fromJS } from 'immutable';
import meetingPageReducer from '../reducer';

describe('meetingPageReducer', () => {
  it('returns the initial state', () => {
    expect(meetingPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
