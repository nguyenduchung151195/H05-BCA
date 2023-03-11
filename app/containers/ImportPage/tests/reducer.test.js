import { fromJS } from 'immutable';
import importPageReducer from '../reducer';

describe('importPageReducer', () => {
  it('returns the initial state', () => {
    expect(importPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
