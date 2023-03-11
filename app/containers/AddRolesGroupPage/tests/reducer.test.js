import { fromJS } from 'immutable';
import addRolesGroupPageReducer from '../reducer';

describe('addRolesGroupPageReducer', () => {
  it('returns the initial state', () => {
    expect(addRolesGroupPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
