import { fromJS } from 'immutable';
import roleGroupPageReducer from '../reducer';

describe('roleGroupPageReducer', () => {
  it('returns the initial state', () => {
    expect(roleGroupPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
