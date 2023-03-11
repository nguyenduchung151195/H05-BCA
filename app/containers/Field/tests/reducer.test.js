import { fromJS } from 'immutable';
import fieldReducer from '../reducer';

describe('fieldReducer', () => {
  it('returns the initial state', () => {
    expect(fieldReducer(undefined, {})).toEqual(fromJS({}));
  });
});
