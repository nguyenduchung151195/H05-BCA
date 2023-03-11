import { fromJS } from 'immutable';
import ApproveGroupPageReducer from '../reducer';

describe('ApproveGroupPageReducer', () => {
  it('returns the initial state', () => {
    expect(ApproveGroupPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
