/*
 *
 * DashboardHome reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_API,
  GET_API_SUCCESS,
  GET_REVENUE_CHART_DATA,
  GET_REVENUE_CHART_DATA_SUCCESS,
  GET_REVENUE_CHART_DATA_FAILURE,
  GET_PROFIT_CHART,
  GET_PROFIT_CHART_SUCCESS,
  GET_PROFIT_CHART_FAILURE,
  GET_DATA_SUCCESS,
} from './constants';

export const initialState = fromJS({
  projectSkip: [],
  data: '',
  contracts: 0,
  projects: 0,
  customers: 0,
  businessOpportunities: 0,
  profile: '',
  tasks: 0,
  inChargeSelect: 0,
  viewableSelect: 0,
  stopSelect: 0,
  cancelSelect: 0,
  doingSelect: 0,
  progressSelect: 0,
  completeSelect: 0,
  notDoingSelect: 0,
  columnXChart: [
    {
      name: 'Nm Trường',
      total: 4568,
      avatar:
        'https://media.licdn.com/dms/image/C5603AQGSnnduTKva0w/profile-displayphoto-shrink_100_100/0?e=2159024400&v=beta&t=gwc8OWQMXzNNbEH2RLtFd6mtlzIMJAyTe2z2gJbH8T8',
    },
    {
      name: 'Nv Khương',
      total: 3578,
      avatar: 'https://www.amcharts.com/wp-content/uploads/2019/04/phoebe.jpg',
    },
    {
      name: 'Ht Lăng',
      total: 2546,
      avatar: 'https://www.amcharts.com/wp-content/uploads/2019/04/phoebe.jpg',
    },
    {
      name: 'Phoebe',
      total: 1878,
      avatar: 'https://www.amcharts.com/wp-content/uploads/2019/04/phoebe.jpg',
    },
    {
      name: 'Rachel',
      total: 1546,
      avatar: 'https://www.amcharts.com/wp-content/uploads/2019/04/rachel.jpg',
    },
  ],
  columnCylinder: [
    {
      country: 'Cty TNHH TM DV Tân Thanh Bình',
      visits: 4025,
    },
    {
      country: 'Công ty CP Hà Giang - CN Cà Mau',
      visits: 3010,
    },
    {
      country: 'Công ty CP thương mại Huy Nguyễn ',
      visits: 2012,
    },
    {
      country: 'Công ty CP trang thiết bị nội thất Minh Hoàng',
      visits: 1501,
    },
    {
      country: 'Tổng công ty điện lực Thành phố Hồ Chí Minh',
      visits: 1456,
    },
    {
      country: 'Công ty Lifetek',
      visits: 1201,
    },
    {
      country: 'Công ty Trancomos',
      visits: 1101,
    },
    {
      country: 'Công ty VNPT',
      visits: 1000,
    },
    {
      country: 'Công ty Hoàng Minh',
      visits: 867,
    },
    {
      country: 'Công ty Hòa Phát',
      visits: 758,
    },
  ],
  columnXYRevenueChart: [],
  profitChart: [],
  loadingRevenueChart: false,
  loadingProfitChart: false,
});

function dashboardHomeReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_API:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_DATA_SUCCESS:
      return state.set('mettings', action.mettings);
    // case GET_API_SUCCESS:
    //   return state
    //     .set('contracts', action.contracts)
    //     .set('projects', action.projects)
    //     .set('customers', action.customers)
    //     .set('businessOpportunities', action.businessOpportunities)
    //     .set('profile', action.profile)
    //     .set('tasks', action.tasks)
    //     .set('inChargeSelect', action.inChargeSelect)
    //     .set('viewableSelect', action.viewableSelect)
    //     .set('stopSelect', action.stopSelect)
    //     .set('cancelSelect', action.cancelSelect)
    //     .set('doingSelect', action.doingSelect)
    //     .set('progressSelect', action.progressSelect)
    //     .set('completeSelect', action.completeSelect)
    //     .set('projectSkip', action.projectSkip)
    //     .set('notDoingSelect', action.notDoingSelect);
    case GET_REVENUE_CHART_DATA:
      return state.set('loadingRevenueChart', true);
    case GET_REVENUE_CHART_DATA_SUCCESS:
      return state.set('columnXYRevenueChart', action.data).set('loadingRevenueChart', false);
    case GET_REVENUE_CHART_DATA_FAILURE:
      return state.set('loadingRevenueChart', false);

    case GET_PROFIT_CHART:
      return state.set('loadingProfitChart', true);
    case GET_PROFIT_CHART_SUCCESS:
      return state.set('profitChart', action.data).set('loadingProfitChart', false);
    case GET_PROFIT_CHART_FAILURE:
      return state.set('loadingProfitChart', false);
    default:
      return state;
  }
}

export default dashboardHomeReducer;
