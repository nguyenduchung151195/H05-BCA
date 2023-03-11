/*
 *
 * DashboardHome actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_API,
  GET_API_SUCCESS,
  MERGE_DATA,
  GET_KPI,
  GET_REVENUE_CHART_DATA,
  GET_REVENUE_CHART_DATA_SUCCESS,
  GET_REVENUE_CHART_DATA_FAILURE,
  GET_PROFIT_CHART,
  GET_PROFIT_CHART_SUCCESS,
  GET_PROFIT_CHART_FAILURE,
  GET_DATA,
  GET_DATA_SUCCESS,
} from './constants';
export function getData() {
  return {
    type: GET_DATA,
  };
}

export function getDataSuccess(mettings) {
  return {
    type: GET_DATA_SUCCESS,
    mettings,
  };
}
export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function getApi() {
  return {
    type: GET_API,
  };
}
export function getKpi() {
  return {
    type: GET_KPI,
  };
}

export function getRevenueChartData() {
  return {
    type: GET_REVENUE_CHART_DATA,
  };
}

export function getRevenueChartDataSuccess(data) {
  return {
    type: GET_REVENUE_CHART_DATA_SUCCESS,
    data,
  };
}

export function getRevenueChartDataFailure() {
  return {
    type: GET_REVENUE_CHART_DATA_FAILURE,
  };
}

export function getApiSuccess(
  contracts,
  projects,
  customers,
  businessOpportunities,
  profile,
  tasks,
  inChargeSelect,
  viewableSelect,
  stopSelect,
  cancelSelect,
  doingSelect,
  progressSelect,
  completeSelect,
  projectSkip,
  notDoingSelect,
) {
  return {
    type: GET_API_SUCCESS,
    contracts,
    projects,
    customers,
    businessOpportunities,
    profile,
    tasks,
    inChargeSelect,
    viewableSelect,
    stopSelect,
    cancelSelect,
    doingSelect,
    progressSelect,
    completeSelect,
    projectSkip,
    notDoingSelect,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function getProfitChart() {
  return {
    type: GET_PROFIT_CHART,
  };
}

export function getProfitChartSuccess(data) {
  return {
    type: GET_PROFIT_CHART_SUCCESS,
    data,
  };
}

export function getProfitChartFailure() {
  return {
    type: GET_PROFIT_CHART_FAILURE,
  };
}
