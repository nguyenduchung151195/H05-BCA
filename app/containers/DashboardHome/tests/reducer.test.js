import { fromJS } from 'immutable';
import dashboardHomeReducer from '../reducer';

describe('dashboardHomeReducer', () => {
  it('returns the initial state', () => {
    expect(dashboardHomeReducer(undefined, {})).toEqual(fromJS({}));
  });
});
