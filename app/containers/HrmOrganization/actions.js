/*
 *
 * HrmOrganization actions
 *
 */

import { DEFAULT_ACTION, GET_ALL_HRM_CHART, GET_ALL_HRM_CHART_FAILURE, GET_ALL_HRM_CHART_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAllHrmChart() {
  return {
    type: GET_ALL_HRM_CHART
  }
}
export function getAllHrmChartSuccess(data) {
  return {
    type: GET_ALL_HRM_CHART_SUCCESS,
    data
  }
}
export function getAllHrmChartFailure(error) {
  return {
    type: GET_ALL_HRM_CHART_FAILURE,
    error
  }
}