import { fromJS } from 'immutable';
import historyLogReducer from '../reducer';

describe('historyLogReducer', () => {
  it('returns the initial state', () => {
    expect(historyLogReducer(undefined, {})).toEqual(fromJS({}));
  });
});
