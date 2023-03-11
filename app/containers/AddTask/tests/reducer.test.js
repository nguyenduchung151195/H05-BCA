import { fromJS } from 'immutable';
import addTaskReducer from '../reducer';

describe('addTaskReducer', () => {
  it('returns the initial state', () => {
    expect(addTaskReducer(undefined, {})).toEqual(fromJS({}));
  });
});
