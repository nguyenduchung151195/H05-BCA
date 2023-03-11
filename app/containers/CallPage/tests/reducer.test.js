import { fromJS } from 'immutable';
import callPageReducer from '../reducer';

describe('callPageReducer', () => {
  it('returns the initial state', () => {
    expect(callPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
