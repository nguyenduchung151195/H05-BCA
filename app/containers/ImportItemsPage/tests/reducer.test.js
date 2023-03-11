import { fromJS } from 'immutable';
import importItemsPageReducer from '../reducer';

describe('importItemsPageReducer', () => {
  it('returns the initial state', () => {
    expect(importItemsPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
