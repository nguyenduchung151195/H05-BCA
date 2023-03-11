import { fromJS } from 'immutable';
import sourcePageReducer from '../reducer';

describe('sourcePageReducer', () => {
  it('returns the initial state', () => {
    expect(sourcePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
