/*
 *
 * SystemConfigPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_SYS_CONF,
  GET_SYS_CONF_FAILED,
  GET_SYS_CONF_SUCCESS,
  UPDATE_SYS_CONF,
  UPDATE_SYS_CONF_FAILED,
  UPDATE_SYS_CONF_SUCCESS,
  CREATE_CONFIG_CODE,
  CREATE_CONFIG_CODE_SUCCESS,
  CREATE_CONFIG_CODE_FAILED,
  GET_CONFIG_CODE,
  GET_CONFIG_CODE_FAILED,
  GET_CONFIG_CODE_SUCCESS,
} from './constants';

export const initialState = fromJS({
  loading: false,
  success: false,
  successDelete: false,
  successUpdate: false,
  successCreateCode: false,
  error: false,
  configCode: {},
});

function systemConfigPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      // console.log('REDUCER - RESET_NOTI : state', state);
      return state
        .set('loading', false)
        .set('success', false)
        .set('successDelete', false)
        .set('successUpdate', false)
        .set('successCreateCode', false)
        .set('successGetCode', false)
        .set('error', false);
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
    case GET_SYS_CONF_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('sysConf', action.data || {});
    case UPDATE_SYS_CONF:
      return state
        .set('loading', true)
        .set('successUpdate', false)
        .set('error', false);
    case UPDATE_SYS_CONF_FAILED:
      return state
        .set('loading', false)
        .set('successUpdate', false)
        .set('error', true);
    case UPDATE_SYS_CONF_SUCCESS:
      return state
        .set('loading', false)
        .set('successUpdate', true)
        .set('error', false)
        .set('sysConf', action.data || {});
    // TT
    // TT - UPDATE=CREATE CODE - 12
    case CREATE_CONFIG_CODE:
      return state
        .set('loading', true)
        .set('successCreateCode', false)
        .set('error', false);
    case CREATE_CONFIG_CODE_FAILED:
      return state
        .set('loading', false)
        .set('successCreateCode', false)
        .set('error', true);
    // TT - UPDATE=CREATE CODE - 17
    case CREATE_CONFIG_CODE_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreateCode', true)
        .set('error', false)
        .set('configCode', action.data); // TT - UPDATE=CREATE CODE - 18
    case GET_CONFIG_CODE:
      return state
        .set('loading', true)
        .set('successGetCode', false)
        .set('error', false);
    case GET_CONFIG_CODE_FAILED:
      return state
        .set('loading', false)
        .set('successGetCode', false)
        .set('error', true);
    case GET_CONFIG_CODE_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('configCode', action.data);
    // .set('successGetCode', true)

    default:
      return state;
  }
}

export default systemConfigPageReducer;
