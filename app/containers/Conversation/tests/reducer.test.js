import { fromJS } from 'immutable';
import conversationReducer from '../reducer';

describe('conversationReducer', () => {
  it('returns the initial state', () => {
    expect(conversationReducer(undefined, {})).toEqual(fromJS({}));
  });
});
