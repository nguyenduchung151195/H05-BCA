/*
 *
 * CustomersPage reducer
 *
 */
import io from 'socket.io-client';
import { APP_URL } from '../../config/urlConfig';
import { fromJS } from 'immutable';

import {
  GET_SYS_CONF,
  GET_SYS_CONF_FAILED,
  GET_SYS_CONF_SUCCESS,
  CLOSE_SNACKBAR,
  CHANGE_SNACKBAR,
  GET_PROFILE,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILED,
  GET_STOCK,
  GET_STOCK_FAILED,
  GET_STOCK_SUCCESS,
  CHANGE_STOCK,
  MERGE_DATA,
  GET_CODE_CONFIG,
  GET_CODE_CONFIG_ERROR,
  GET_CODE_CONFIG_SUCCESS,
  GET_ROLE_TASK,
  GET_APPROVE,
  GET_APPROVE_FAILED,
  GET_APPROVE_SUCCESS,
  GET_ALL_DEPARTMENT_SUCCESS,
  GET_ALL_DEPARTMENT_FAILED,
  GET_ALL_HRM_TIMEKEEPING,
  GET_ALL_VIEWCONFIG_FORMULA_FAILER,
  GET_ALL_HRM_TIMEKEEPING_SUCCESS,
  GET_ALL_VIEWCONFIG_FORMULA_SUCCESS,
  GET_ALL_VIEWCONFIGS,
  GET_ALL_VIEWCONFIGS_SUCCESS,
  GET_ALL_VIEWCONFIGS_FAILED,
  DOC_UPDATED,
  NEW_COMMENT,
  GET_DATA_SUCCESS,
  UPDATE_LOAD

} from './constants';

export const initialState = fromJS({
  message: '',
  variant: null,
  status: false,
  profile: { avatar: '', name: '', _id: '' },
  sysConf: {},
  allStock: [],
  allDepartment: [],
  allHoliday: [],
  currentStock: '',
  chooseStock: '',
  codeConfig: [],
  loading: true,
  role: {},
  roleTask: [],
  roleCustomer: [],
  roleBusinessOpportunities: [],
  GET_ALL_VIEWCONFIG_FORMULA_SUCCESS: [],
  docUpdated: null,
  miniActive: false,
  hiddenHeader: false,
  // socket: io(APP_URL, { query: { token: localStorage.getItem('token') }, transports: ['websocket'] }),
  newComment: null,
});

function dashboardPageReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOAD:
      return state.set('loadToken', action.data)
    case 'DEFAULT_ACTION':
      return state;
    case CLOSE_SNACKBAR:
      return state.set('status', false);
    case CHANGE_SNACKBAR:
      return state.merge(action.data);
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DATA_SUCCESS:
      return state.set('mettings', action.mettings);
    case GET_SYS_CONF:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_SYS_CONF_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_VIEWCONFIGS:
      return state
        .set('load', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_VIEWCONFIGS_SUCCESS:
      return state
        .set('load', false)
        .set('success', false)
        .set('error', true);
    case GET_SYS_CONF_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('sysConf', action.data || {});
    case GET_PROFILE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PROFILE_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_PROFILE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('profile', action.data.data)
        .set('role', action.data.role);
    case GET_STOCK:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_STOCK_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_STOCK_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('allStock', action.data || []);
    case GET_ALL_DEPARTMENT_SUCCESS:
      return state.set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('allDepartment', action.data || []);
    case GET_ALL_DEPARTMENT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_CODE_CONFIG:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_CODE_CONFIG_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_CODE_CONFIG_SUCCESS:
      localStorage.setItem('codeConfig', JSON.stringify(action.data.data));
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('codeConfig', action.data.data || []);
    case CHANGE_STOCK:
      return state
        .set('currentStock', action.body || '')
        .set('chooseStock', action.name || '');
    case GET_ROLE_TASK:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_APPROVE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_APPROVE_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_APPROVE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('approveRequest', action.data)
    case GET_ALL_HRM_TIMEKEEPING:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_VIEWCONFIG_FORMULA_FAILER:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_HRM_TIMEKEEPING_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('allHoliday', action.data.holidays)
        .set('allTimekeepType', action.data.timekeepType)
        .set('allSymbol', action.data.symbols);
    case GET_ALL_VIEWCONFIG_FORMULA_SUCCESS:
      return state.set('allViewconfigFormula', action.data);
    case DOC_UPDATED:
      return state.set('docUpdated', action.data);
    case NEW_COMMENT:
      return state.set('newComment', action.data);
    default:
      return state;
  }
}

export default dashboardPageReducer;
