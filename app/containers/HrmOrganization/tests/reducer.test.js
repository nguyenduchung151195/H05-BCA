import { fromJS } from 'immutable';
import hrmOrganizationReducer from '../reducer';

describe('hrmOrganizationReducer', () => {
  it('returns the initial state', () => {
    expect(hrmOrganizationReducer(undefined, {})).toEqual(fromJS({}));
  });
});
