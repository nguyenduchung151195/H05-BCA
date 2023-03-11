import { fromJS } from 'immutable';
import addUserPageReducer from '../reducer';

describe('addUserPageReducer', () => {
  it('returns the initial state', () => {
    expect(addUserPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
