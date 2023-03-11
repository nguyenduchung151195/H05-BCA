import { fromJS } from 'immutable';
import fileManagerReducer from '../reducer';

describe('fileManagerReducer', () => {
  it('returns the initial state', () => {
    expect(fileManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
