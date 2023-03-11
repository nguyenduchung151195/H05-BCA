import { fromJS } from 'immutable';
import personalPageReducer from '../reducer';

describe('personalPageReducer', () => {
  it('returns the initial state', () => {
    expect(personalPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
