import { fromJS } from 'immutable';
import sampleProcessReducer from '../reducer';

describe('sampleProcessReducer', () => {
  it('returns the initial state', () => {
    expect(sampleProcessReducer(undefined, {})).toEqual(fromJS({}));
  });
});
