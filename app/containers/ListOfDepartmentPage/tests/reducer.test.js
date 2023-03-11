import { fromJS } from 'immutable';
import listOfDepartmentPageReducer from '../reducer';

describe('listOfDepartmentPageReducer', () => {
  it('returns the initial state', () => {
    expect(listOfDepartmentPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
