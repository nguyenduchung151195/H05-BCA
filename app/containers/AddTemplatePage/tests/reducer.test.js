import { fromJS } from 'immutable';
import addTemplatePageReducer from '../reducer';

describe('addTemplatePageReducer', () => {
  it('returns the initial state', () => {
    expect(addTemplatePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
