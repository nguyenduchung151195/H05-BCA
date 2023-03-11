import { fromJS } from 'immutable';
import taskPageReducer from '../reducer';

describe('taskPageReducer', () => {
  it('returns the initial state', () => {
    expect(taskPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
