import { fromJS } from 'immutable';
import organizationalStructurePageReducer from '../reducer';

describe('organizationalStructurePageReducer', () => {
  it('returns the initial state', () => {
    expect(organizationalStructurePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
