import { fromJS } from 'immutable';
import templatePageReducer from '../reducer';

describe('templatePageReducer', () => {
  it('returns the initial state', () => {
    expect(templatePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
