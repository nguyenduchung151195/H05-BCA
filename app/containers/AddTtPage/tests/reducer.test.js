import { fromJS } from 'immutable';
import addTtPageReducer from '../reducer';

describe('addTtPageReducer', () => {
  it('returns the initial state', () => {
    expect(addTtPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
