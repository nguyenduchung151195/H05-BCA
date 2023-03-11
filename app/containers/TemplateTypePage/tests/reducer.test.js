import { fromJS } from 'immutable';
import templateTypePageReducer from '../reducer';

describe('templateTypePageReducer', () => {
  it('returns the initial state', () => {
    expect(templateTypePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
