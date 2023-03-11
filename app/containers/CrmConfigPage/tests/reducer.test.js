import { fromJS } from 'immutable';
import crmConfigPageReducer from '../reducer';

describe('crmConfigPageReducer', () => {
  it('returns the initial state', () => {
    expect(crmConfigPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
