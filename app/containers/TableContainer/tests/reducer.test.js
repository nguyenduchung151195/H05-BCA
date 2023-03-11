import { fromJS } from 'immutable';
import tableContainerReducer from '../reducer';

describe('tableContainerReducer', () => {
  it('returns the initial state', () => {
    expect(tableContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
