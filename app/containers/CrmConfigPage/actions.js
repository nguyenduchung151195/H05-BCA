/*
 *
 * CrmConfigPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ALL_STATUS,
  GET_ALL_STATUS_SUCCESS,
  GET_ALL_STATUS_FAIL,
  ADD_STATUS,
  ADD_STATUS_FAIL,
  ADD_STATUS_SUCCESS,
  ADD_CRM_STATUS,
  ADD_CRM_STATUS_FAIL,
  ADD_CRM_STATUS_SUCCESS,
  EDIT_CRM_STATUS,
  EDIT_CRM_STATUS_FAIL,
  EDIT_CRM_STATUS_SUCCESS,
  DELETE_CRM_STATUS,
  DELETE_CRM_STATUS_FAIL,
  DELETE_CRM_STATUS_SUCCESS,
  DELETE_STATUS,
  DELETE_STATUS_FAIL,
  DELETE_STATUS_SUCCESS,
  UPDATE_STATUS,
  UPDATE_STATUS_FAIL,
  UPDATE_STATUS_SUCCESS,
  UPDATE_STATUS_INDEX,
  UPDATE_STATUS_INDEX_FAIL,
  UPDATE_STATUS_INDEX_SUCCESS,
  GET_ALL_SOURCES,
  GET_ALL_SOURCES_SUCCESS,
  GET_ALL_SOURCES_FAIL,
  ADD_SOURCE,
  ADD_SOURCE_FAIL,
  ADD_SOURCE_SUCCESS,
  DELETE_SOURCES,
  DELETE_SOURCES_FAIL,
  DELETE_SOURCES_SUCCESS,
  DELETE_CRM_SOURCES,
  DELETE_CRM_SOURCES_SUCCESS,
  DELETE_CRM_SOURCES_FAIL,
  UPDATE_SOURCE,
  UPDATE_SOURCE_FAIL,
  UPDATE_SOURCE_SUCCESS,
  EDIT_SOURCE,
  EDIT_SOURCE_SUCCESS,
  EDIT_SOURCE_FAIL,
  // curency
  GET_ALL_CURRENCY,
  GET_ALL_CURRENCY_SUCCESS,
  GET_ALL_CURRENCY_FAIL,
  ADD_CURRENCY,
  ADD_CURRENCY_FAIL,
  ADD_CURRENCY_SUCCESS,
  UPDATE_CURRENCY,
  UPDATE_CURRENCY_SUCCESS,
  UPDATE_CURRENCY_FAIL,
  CHANGE_NAME_CURRENCY,
  CHANGE_FORMAT_CURRENCY,
  HANDLE_DISCOUNT,
  GET_CURRENCY,
  GET_MONEY_SUCCESS,
  GET_MONEY,
  GET_MONEY_FAIL,
  GET_CURRENCY_DEFAULT,
  CHANGE_BASE_CURRENCY,
  // location
  GET_LOCATION,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAIL,
  ADD_LOCATION,
  ADD_LOCATION_SUCCESS,
  ADD_LOCATION_FAIL,
  CHANGE_LOCATION,
  GET_CURRENT_LOCATION,
  UPDATE_LOCATION,
  UPDATE_LOCATION_SUCCESS,
  UPDATE_LOCATION_FAIL,
  // tax
  GET_TAX,
  GET_TAX_SUCCESS,
  GET_TAX_FAIL,
  ADD_TAX,
  ADD_TAX_SUCCESS,
  ADD_TAX_FAIL,
  CHANGE_TAX,
  GET_CURRENT_TAX,
  UPDATE_TAX,
  UPDATE_TAX_SUCCESS,
  UPDATE_TAX_FAIL,
  SELECT_TAX,
  GET_CURRENT_TAX_VAT,
  ADD_TAX_LEVEL,
  ADD_TAX_LEVEL_SUCCESS,
  ADD_TAX_LEVEL_FAIL,
  HANDLE_CHANGE_TAX_LEVEL,
  GET_TAX_LEVEL,
  UPDATE_TAX_LEVEL,
  UPDATE_TAX_LEVEL_SUCCESS,
  UPDATE_TAX_LEVEL_FAIL,
  RESET_ALL_SOURCE,
  RESET_ALL_SOURCE_SUCCESS,
  RESET_ALL_SOURCE_FAILURE,
  RESET_ALL_STATUS,
  RESET_ALL_STATUS_SUCCESS,
  RESET_ALL_STATUS_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function fetchAllStatusAction(id, currentType) {
  return {
    type: GET_ALL_STATUS,
    id,
    currentType,
  };
}
export function fetchAllStatusSuccessAction(data, message) {
  return {
    type: GET_ALL_STATUS_SUCCESS,
    data,
    message,
  };
}
export function fetchAllStatusFailAction(err, message) {
  return {
    type: GET_ALL_STATUS_FAIL,
    err,
    message,
  };
}
export function addStatusAction(body, id, types) {
  return {
    type: ADD_STATUS,
    body,
    id,
    types,
  };
}
export function addStatusSuccessAction(data, message) {
  return {
    type: ADD_STATUS_SUCCESS,
    data,
    message,
  };
}
export function addStatusFailAction(err, message) {
  return {
    type: ADD_STATUS_FAIL,
    err,
    message,
  };
}
export function addCRMStatusAction(body, types) {
  return {
    type: ADD_CRM_STATUS,
    body,
    types,
  };
}

export function addCRMStatusSuccessAction(data, message) {
  return {
    type: ADD_CRM_STATUS_SUCCESS,
    data,
    message,
  };
}
export function addCRMStatusFailAction(err, message) {
  return {
    type: ADD_CRM_STATUS_FAIL,
    err,
    message,
  };
}
export function editCRMStatusAction(body, id, types) {
  return {
    type: EDIT_CRM_STATUS,
    body,
    id,
    types,
  };
}
export function editCRMStatusSuccessAction(data, message) {
  return {
    type: EDIT_CRM_STATUS_SUCCESS,
    data,
    message,
  };
}
export function editCRMStatusFailAction(err, message) {
  return {
    type: EDIT_CRM_STATUS_FAIL,
    err,
    message,
  };
}
export function deleteCRMStatusAction(id, types) {
  return {
    type: DELETE_CRM_STATUS,
    id,
    types,
  };
}
export function deleteCRMStatusSuccessAction(data, message) {
  
  return {
    type: DELETE_CRM_STATUS_SUCCESS,
    data,
    message,
  };
}
export function deleteCRMStatusFailAction(err, message) {
  return {
    type: DELETE_CRM_STATUS_FAIL,
    err,
    message,
  };
}
export function deleteStatusAction(statusId, id, types) {
  return {
    type: DELETE_STATUS,
    statusId,
    id,
    types
  };
}
export function deleteStatusSuccessAction(data, message) {
  return {
    type: DELETE_STATUS_SUCCESS,
    data,
    message,
  };
}
export function deleteStatusFailAction(err, message) {
  return {
    type: DELETE_STATUS_FAIL,
    err,
    message,
  };
}
export function updateStatusAction(body, id, types) {
  return {
    type: UPDATE_STATUS,
    body,
    id,
    types,
  };
}
export function updateStatusSuccessAction(data, message) {
  return {
    type: UPDATE_STATUS_SUCCESS,
    data,
    message,
  };
}
export function updateStatusFailAction(err, message) {
  return {
    type: UPDATE_STATUS_FAIL,
    err,
    message,
  };
}
export function updateStatusIndexAction(body, id) {
  return {
    type: UPDATE_STATUS_INDEX,
    body,
    id,
  };
}
export function updateStatusIndexSuccessAction(data, message) {
  return {
    type: UPDATE_STATUS_INDEX_SUCCESS,
    data,
    message,
  };
}
export function updateStatusIndexFailAction(err, message) {
  return {
    type: UPDATE_STATUS_INDEX_FAIL,
    err,
    message,
  };
}

export function resetAllStatus(data) {
  return {
    type: RESET_ALL_STATUS,
    data,
  };
}

export function resetAllStatusSuccess(data) {
  return {
    type: RESET_ALL_STATUS_SUCCESS,
    data,
  };
}

export function resetAllStatusFailure(error) {
  return {
    type: RESET_ALL_STATUS_FAILURE,
    error,
  };
}

// Kiểu nguồn

export function fetchAllSourcesAction(id) {
  return {
    type: GET_ALL_SOURCES,
    id,
  };
}
export function fetchAllSourcesSuccessAction(data, message) {
  return {
    type: GET_ALL_SOURCES_SUCCESS,
    data,
    message,
  };
}
export function fetchAllSourcesFailAction(err, message) {
  return {
    type: GET_ALL_SOURCES_FAIL,
    err,
    message,
  };
}
export function addSourceAction(body, types) {
  return {
    type: ADD_SOURCE,
    body,
    types,
  };
}
export function addSourceSuccessAction(data, message) {
  return {
    type: ADD_SOURCE_SUCCESS,
    data,
    message,
  };
}
export function addSourceFailAction(err, message) {
  return {
    type: ADD_SOURCE_FAIL,
    err,
    message,
  };
}
export function editSourceAction(body, id, types) {
  return {
    type: EDIT_SOURCE,
    body,
    id,
    types
  };
}
export function editSourceSuccessAction(data, message) {
  return {
    type: EDIT_SOURCE_SUCCESS,
    data,
    message,
  };
}
export function editSourceFailAction(err, message) {
  return {
    type: EDIT_SOURCE_FAIL,
    err,
    message,
  };
}
export function deleteSourcesAction(body) {
  return {
    type: DELETE_SOURCES,
    body,
  };
}
export function deleteSourcesSuccessAction(data, message) {
  return {
    type: DELETE_SOURCES_SUCCESS,
    data,
    message,
  };
}
export function deleteSourcesFailAction(err, message) {
  return {
    type: DELETE_SOURCES_FAIL,
    err,
    message,
  };
}
export function deleteCRMSourcesAction(id, types) {
  return {
    type: DELETE_CRM_SOURCES,
    id,
    types
  };
}
export function deleteCRMSourcesSuccessAction(data, message) {
  return {
    type: DELETE_CRM_SOURCES_SUCCESS,
    data,
    message,
  };
}
export function deleteCRMSourcesFailAction(err, message) {
  return {
    type: DELETE_CRM_SOURCES_FAIL,
    err,
    message,
  };
}
export function updateSourcesAction(body, param, types) {
  return {
    type: UPDATE_SOURCE,
    body,
    param,
    types
  };
}
export function updateSourcesSuccessAction(data, message) {
  return {
    type: UPDATE_SOURCE_SUCCESS,
    data,
    message,
  };
}
export function updateSourcesFailAction(err, message) {
  return {
    type: UPDATE_SOURCE_FAIL,
    err,
    message,
  };
}

export function resetNotis() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function resetAllSources(data) {
  return {
    type: RESET_ALL_SOURCE,
    data,
  };
}

export function resetAllSourcesSuccess(data) {
  return {
    type: RESET_ALL_SOURCE_SUCCESS,
    data,
  };
}

export function resetAllSourcesFailure(error) {
  return {
    type: RESET_ALL_SOURCE_FAILURE,
    error,
  };
}

// Tien Te
export function fetchAllCurrency() {
  return {
    type: GET_ALL_CURRENCY,
  };
}
export function fetchAllCurrencySuccess(currency) {
  return {
    type: GET_ALL_CURRENCY_SUCCESS,
    currency,
  };
}
export function fetchAllCurrencyFail(err) {
  return {
    type: GET_ALL_CURRENCY_FAIL,
    err,
  };
}
export function addCurrencyAction(data) {
  return {
    type: ADD_CURRENCY,
    data: {
      base: data.base,
      reportingCurrency: data.reportingCurrency,
      defaultInvoicingCurrency: data.defaultInvoicingCurrency,
      _id: data._id,
      name: data.name,
      code: data.code,
      sort: data.sort,
      exchangeRate: data.exchangeRate,
      faceValue: data.faceValue,
      nameCurrency: data.nameCurrency,
      isHandmade: data.isHandmade,
    },
  };
}
export function addCurrencySuccessAction(message) {
  return {
    type: ADD_CURRENCY_SUCCESS,
    message,
  };
}
export function addCurrencyFailAction(err, message) {
  return {
    type: ADD_CURRENCY_FAIL,
    err,
    message,
  };
}
export function updateCurrencyAction(data, id) {
  return {
    type: UPDATE_CURRENCY,
    data,
    id,
  };
}
export function updateCurrencySuccessAction(data, message) {
  return {
    type: UPDATE_CURRENCY_SUCCESS,
    data,
    message,
  };
}
export function updateCurrencyFailAction(err, message) {
  return {
    type: UPDATE_CURRENCY_FAIL,
    err,
    message,
  };
}
export function handleChangeNameCurrency(a, b) {
  return {
    type: CHANGE_NAME_CURRENCY,
    a,
    b,
  };
}
export function onChangeNameCurrency(data) {
  return {
    type: CHANGE_FORMAT_CURRENCY,
    data,
  };
}
export function handleDiscount(name, checked) {
  return {
    type: HANDLE_DISCOUNT,
    name,
    checked,
  };
}
export function getCurrentCurrency(currentCurrency, id) {
  return {
    type: GET_CURRENCY,
    currentCurrency,
    id,
  };
}
export function getMoney() {
  return {
    type: GET_MONEY,
  };
}

export function getMoneySuccess(money) {
  return {
    type: GET_MONEY_SUCCESS,
    money,
  };
}
export function getMoneyFail(err) {
  return {
    type: GET_MONEY_FAIL,
    err,
  };
}
export function getCurrencyDefault() {
  return {
    type: GET_CURRENCY_DEFAULT,
  };
}
export function changeBaseCurrency(currencyId, base) {
  return {
    type: CHANGE_BASE_CURRENCY,
    currencyId,
    base,
  };
}
// Địa điểm

export function getLocation() {
  return {
    type: GET_LOCATION,
  };
}
export function getLocationSuccess(location) {
  return {
    type: GET_LOCATION_SUCCESS,
    location,
  };
}
export function getLocationFail(err) {
  return {
    type: GET_LOCATION_FAIL,
    err,
  };
}
export function addLocation(data) {
  return {
    type: ADD_LOCATION,
    data: {
      base: data.base,
      _id: data._id,
      name: data.name,
      titlesByLanguage: data.titlesByLanguage,
      code: data.code,
      sort: data.sort,
      latitude: data.latitude,
      longitude: data.longitude,
      type: 'Country',
    },
  };
}
export function addLocationSuccess(message) {
  return {
    type: ADD_LOCATION_SUCCESS,
    message,
  };
}
export function addLocationFail(err, message) {
  return {
    type: ADD_LOCATION_FAIL,
    err,
    message,
  };
}
export function handleChangeLocation(a, b) {
  return {
    type: CHANGE_LOCATION,
    a,
    b,
  };
}

export function getCurrentLocation(currentLocation) {
  return {
    type: GET_CURRENT_LOCATION,
    currentLocation,
  };
}

export function updateLocation(data, id) {
  return {
    type: UPDATE_LOCATION,
    data,
    id,
  };
}

export function updateLocationSuccess(data, message) {
  return {
    type: UPDATE_LOCATION_SUCCESS,
    data,
    message,
  };
}

export function updateLocationFail(error, message) {
  return {
    type: UPDATE_LOCATION_FAIL,
    error,
    message,
  };
}
// Thuế

export function getTax() {
  return {
    type: GET_TAX,
  };
}
export function getTaxSuccess(tax) {
  return {
    type: GET_TAX_SUCCESS,
    tax,
  };
}
export function getTaxFail(err) {
  return {
    type: GET_TAX_FAIL,
    err,
  };
}
export function addTax(data) {
  return {
    type: ADD_TAX,
    data: {
      _id: data._id,
      name: data.name,
      code: data.code,
      describe: data.describe,
      updatedAt: data.updatedAt,
      isBillTax: data.isBillTax,
      isVATTax: data.isVATTax,
      effective: data.effective,
      classify: data.classify,
      exchangeRate: data.exchangeRate,
      taxRates: data.taxRates,
    },
  };
}
export function addTaxSuccess(message) {
  return {
    type: ADD_TAX_SUCCESS,
    message,
  };
}
export function addTaxFail(err, message) {
  return {
    type: ADD_TAX_FAIL,
    err,
    message,
  };
}
export function handleChangeTax(a, b) {
  return {
    type: CHANGE_TAX,
    a,
    b,
  };
}
export function getCurrentTax(currentTax, id) {
  return {
    type: GET_CURRENT_TAX,
    currentTax,
    id,
  };
}
export function updateTax(data, id) {
  return {
    type: UPDATE_TAX,
    data,
    id,
  };
}
export function updateTaxSuccess(data, message) {
  return {
    type: UPDATE_TAX_SUCCESS,
    data,
    message,
  };
}
export function updateTaxFail(err, message) {
  return {
    type: UPDATE_TAX_FAIL,
    err,
    message,
  };
}
export function handleSelectTax(value) {
  return {
    type: SELECT_TAX,
    value,
  };
}
export function getCurrentTaxVAT(currentTaxVAT, id) {
  return {
    type: GET_CURRENT_TAX_VAT,
    currentTaxVAT,
    id,
  };
}
export function addTaxLevel(data, id) {
  return {
    type: ADD_TAX_LEVEL,
    data: {
      _id: data._id,
      code: data.code,
      name: data.name,
      describe: data.describe,
      exchangeRate: data.exchangeRate,
      taxRates: data.taxRates,
      updatedAt: data.updatedAt,
      isBillTax: data.isBillTax,
    },
    id,
  };
}
export function addTaxLevelSuccess(data, message) {
  return {
    type: ADD_TAX_LEVEL_SUCCESS,
    data,
    message,
  };
}
export function addTaxLevelFail(err, message) {
  return {
    type: ADD_TAX_LEVEL_FAIL,
    err,
    message,
  };
}
export const handleChangeTaxLevel = (name, data) => ({
  type: HANDLE_CHANGE_TAX_LEVEL,
  name,
  data,
});
export function getTaxlevel(taxLevel, index) {
  return {
    type: GET_TAX_LEVEL,
    taxLevel,
    index,
  };
}
export function updateTaxLevel(data, id) {
  return {
    type: UPDATE_TAX_LEVEL,
    data,
    id,
  };
}
export function updateTaxLevelSuccess(data, message) {
  return {
    type: UPDATE_TAX_LEVEL_SUCCESS,
    data,
    message,
  };
}
export function updateTaxLevelFail(err, message) {
  return {
    type: UPDATE_TAX_LEVEL_FAIL,
    err,
    message,
  };
}
