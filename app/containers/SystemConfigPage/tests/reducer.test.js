import { fromJS } from 'immutable';
import systemConfigPageReducer from '../reducer';

describe('systemConfigPageReducer', () => {
  it('returns the initial state', () => {
    expect(systemConfigPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
