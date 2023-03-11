import { fromJS } from 'immutable';
import kpiExchangePageReducer from '../reducer';

describe('kpiExchangePageReducer', () => {
  it('returns the initial state', () => {
    expect(kpiExchangePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
