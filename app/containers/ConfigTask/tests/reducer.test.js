import { fromJS } from 'immutable';
import configTaskReducer from '../reducer';

describe('configTaskReducer', () => {
  it('returns the initial state', () => {
    expect(configTaskReducer(undefined, {})).toEqual(fromJS({}));
  });
});
