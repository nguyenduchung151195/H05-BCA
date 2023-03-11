/*
 *
 * SourcePage actions
 *
 */

import { DEFAULT_ACTION, GET_TRADING, GET_TRADING_SUCCESS, GET_TRADING_FAILED, GET_PO, GET_PO_SUCCESS, GET_PO_FAILED } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getTradingAct(body) {
  return {
    type: GET_TRADING,
    body,
  };
}
export function getTradingSuccess(data) {
  return {
    type: GET_TRADING_SUCCESS,
    data,
  };
}
export function getTradingFailed(data) {
  return {
    type: GET_TRADING_FAILED,
    data,
  };
}

export function getPOAct(body) {
  return {
    type: GET_PO,
    body,
  };
}
export function getPOSuccess(data) {
  return {
    type: GET_PO_SUCCESS,
    data,
  };
}
export function getPOFailed(data) {
  return {
    type: GET_PO_FAILED,
    data,
  };
}
