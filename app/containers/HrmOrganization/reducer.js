/*
 *
 * HrmOrganization reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION } from './constants';
import { GET_ALL_HRM_CHART_SUCCESS } from './constants'
export const initialState = fromJS({
  employees: []
});

function hrmOrganizationReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_ALL_HRM_CHART_SUCCESS:
      return state.set('hrmOrgTreeData', action.data)
    default:
      return state;
  }
}

export default hrmOrganizationReducer;
