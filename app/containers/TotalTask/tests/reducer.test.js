import { fromJS } from 'immutable';
import totalTaskReducer from '../reducer';

describe('totalTaskReducer', () => {
  it('returns the initial state', () => {
    expect(totalTaskReducer(undefined, {})).toEqual(fromJS({}));
  });
});
