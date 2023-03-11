import { fromJS } from 'immutable';
import addSampleProcessReducer from '../reducer';

describe('addSampleProcessReducer', () => {
  it('returns the initial state', () => {
    expect(addSampleProcessReducer(undefined, {})).toEqual(fromJS({}));
  });
});
