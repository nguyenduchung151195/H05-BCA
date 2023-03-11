import { fromJS } from 'immutable';
import ApproveGroupDetailPageReducer from '../reducer';

describe('ApproveGroupDetailPageReducer', () => {
  it('returns the initial state', () => {
    expect(ApproveGroupDetailPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
