/*
 *
 * CrmConfigPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_ALL_STATUS,
  GET_ALL_STATUS_FAIL,
  GET_ALL_STATUS_SUCCESS,
  ADD_STATUS,
  ADD_STATUS_FAIL,
  ADD_STATUS_SUCCESS,
  DELETE_STATUS,
  DELETE_STATUS_FAIL,
  DELETE_STATUS_SUCCESS,
  UPDATE_STATUS,
  UPDATE_STATUS_SUCCESS,
  UPDATE_STATUS_FAIL,
  UPDATE_STATUS_INDEX,
  UPDATE_STATUS_INDEX_FAIL,
  UPDATE_STATUS_INDEX_SUCCESS,
  GET_ALL_SOURCES,
  GET_ALL_SOURCES_FAIL,
  GET_ALL_SOURCES_SUCCESS,
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
  UPDATE_SOURCE_SUCCESS,
  UPDATE_SOURCE_FAIL,
  GET_ALL_CURRENCY,
  GET_ALL_CURRENCY_SUCCESS,
  GET_ALL_CURRENCY_FAIL,
  ADD_CURRENCY,
  ADD_CURRENCY_SUCCESS,
  ADD_CURRENCY_FAIL,
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
  GET_LOCATION,
  GET_LOCATION_FAIL,
  GET_LOCATION_SUCCESS,
  CHANGE_BASE_CURRENCY,
  ADD_LOCATION,
  ADD_LOCATION_SUCCESS,
  ADD_LOCATION_FAIL,
  CHANGE_LOCATION,
  GET_CURRENT_LOCATION,
  UPDATE_LOCATION_SUCCESS,
  UPDATE_LOCATION,
  UPDATE_LOCATION_FAIL,
  GET_TAX,
  GET_TAX_SUCCESS,
  GET_TAX_FAIL,
  ADD_TAX,
  ADD_TAX_SUCCESS,
  ADD_TAX_FAIL,
  CHANGE_TAX,
  GET_CURRENT_TAX,
  UPDATE_TAX,
  UPDATE_TAX_FAIL,
  UPDATE_TAX_SUCCESS,
  SELECT_TAX,
  GET_CURRENT_TAX_VAT,
  ADD_TAX_LEVEL,
  ADD_TAX_LEVEL_FAIL,
  ADD_TAX_LEVEL_SUCCESS,
  HANDLE_CHANGE_TAX_LEVEL,
  GET_TAX_LEVEL,
  UPDATE_TAX_LEVEL,
  UPDATE_TAX_LEVEL_SUCCESS,
  UPDATE_TAX_LEVEL_FAIL,
  EDIT_CRM_STATUS_FAIL,
  EDIT_CRM_STATUS_SUCCESS,
  EDIT_CRM_STATUS,
  DELETE_CRM_STATUS,
  DELETE_CRM_STATUS_FAIL,
  DELETE_CRM_STATUS_SUCCESS,
  EDIT_SOURCE,
  EDIT_SOURCE_SUCCESS,
  EDIT_SOURCE_FAIL,
  RESET_ALL_SOURCE,
  RESET_ALL_SOURCE_SUCCESS,
  RESET_ALL_SOURCE_FAILURE,
  RESET_ALL_STATUS,
  RESET_ALL_STATUS_SUCCESS,
  RESET_ALL_STATUS_FAILURE,
} from './constants';

export const initialState = fromJS({
  status: [],
  data: [],
  name: '',
  sort: '',
  faceValue: '',
  exchangeRate: '',
  code: '',
  reportingCurrency: false,
  defaultInvoicingCurrency: false,
  base: false,
  isHandmade: true,
  _id: null,
  nameCurrency: [
    {
      name: '',
      formatTemplates: '',
      symbol: '',
      locationMoney: 'Số tiền trước',
      separator: '',
      decimal: '.',
      numberDecimal: '2',
    },
  ],
  // location: [],
  currencyId: null,
  type: 'Country',
  latitude: '0',
  longitude: '0',
  shortName: '',
  describe: '',
  updatedAt: '',
  tax: [],
  typeCustomer: '',
  isBillTax: true,
  isVATTax: true,
  effective: false,
  classify: '',
  priceTax: false,
  order: '',
  selectLocation: [],
  taxRates: [
    {
      effective: false,
      order: '',
      priceTax: false,
      selectLocation: [],
      typeCustomer: '',
      level: '',
    },
  ],
  // selectLocation: '',
  taxRatesColumns: [
    // { name: '_id', title: 'ID', checked: true },
    { name: 'level', title: 'Tỷ giá', checked: true, type: 'number' },
    { name: 'priceTax', title: 'Thuế trong giá thành', type: 'boolean', checked: true },
    { name: 'typeCustomer', title: 'Loại khách hàng', checked: true, type: 'text' },
    { name: 'effective', title: 'Có hiệu lực', type: 'boolean', checked: true },
    { name: 'order', title: 'Thứ tự của ứng dụng', checked: true, type: 'number' },
    { name: 'updatedAt', title: 'Đã chỉnh sửa vào', checked: true, type: 'date' },
    { name: 'edit', title: 'Sửa', checked: true, type: 'text' },
  ],
  idTax: '',
});

function crmConfigPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state.set('callAPIStatus', -1);
    case GET_ALL_STATUS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_STATUS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_STATUS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('listStatus', action.data);
    case ADD_STATUS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case ADD_STATUS_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('error', false)
        .set('notiMessage', action.message)
        .set('listStatus', action.data);
    case ADD_STATUS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case EDIT_CRM_STATUS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case EDIT_CRM_STATUS_SUCCESS:
      return (
        state
          .set('loading', false)
          // .set('callAPIStatus', 1)
          .set('error', false)
          // .set('notiMessage', action.message)
      );
    // .set('listStatus', action.data);
    case EDIT_CRM_STATUS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case DELETE_CRM_STATUS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case DELETE_CRM_STATUS_SUCCESS:
      return (
        state
          .set('loading', false)
          // .set('callAPIStatus', 1)
          .set('error', false)
          .set('notiMessage', action.message)
      );
    // .set('listStatus', action.data);
    case DELETE_CRM_STATUS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case UPDATE_STATUS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_STATUS_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('success', true)
        .set('listStatus', action.data);
    case UPDATE_STATUS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case UPDATE_STATUS_INDEX:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_STATUS_INDEX_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('success', true)
        .set('listStatus', action.data);
    case UPDATE_STATUS_INDEX_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case DELETE_STATUS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case DELETE_STATUS_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('listStatus', action.data);
    case DELETE_STATUS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case RESET_ALL_STATUS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
    // .set('body', action.body);
    case RESET_ALL_STATUS_SUCCESS:
      return state
        .set('loading', false)
        // .set('callAPIStatus', 1)
        .set('error', false)
        .set('notiMessage', action.message)
    // .set('sources', action.data);
    case RESET_ALL_STATUS_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        // .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);

    // SOURCE

    case GET_ALL_SOURCES:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_SOURCES_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ALL_SOURCES_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('sources', action.data);
    case ADD_SOURCE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case ADD_SOURCE_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('error', false)
        .set('notiMessage', action.message)
        .set('sources', action.data);
    case ADD_SOURCE_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case EDIT_SOURCE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case EDIT_SOURCE_SUCCESS:
      return state
        .set('loading', false)
        // .set('callAPIStatus', 1)
        .set('error', false)
        .set('notiMessage', action.message)
    // .set('sources', action.data);
    case EDIT_SOURCE_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case UPDATE_SOURCE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_SOURCE_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('success', true)
        .set('sources', action.data);
    case UPDATE_SOURCE_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case DELETE_SOURCES:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case DELETE_SOURCES_SUCCESS:
      return state
        .set('loading', false)
        .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
        .set('sources', action.data);
    case DELETE_SOURCES_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case DELETE_CRM_SOURCES:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case DELETE_CRM_SOURCES_SUCCESS:
      return state
        .set('loading', false)
        // .set('callAPIStatus', 1)
        .set('notiMessage', action.message)
        .set('error', false)
    // .set('sources', action.data);
    case DELETE_CRM_SOURCES_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        // .set('callAPIStatus', 0)
        .set('notiMessage', action.message);
    case RESET_ALL_SOURCE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
    // .set('body', action.body);
    case RESET_ALL_SOURCE_SUCCESS:
      return state
        .set('loading', false)
        // .set('callAPIStatus', 1)
        .set('error', false)
        .set('notiMessage', action.message)
    // .set('sources', action.data);
    case RESET_ALL_SOURCE_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        // .set('callAPIStatus', 0)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);

    case GET_ALL_CURRENCY:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ALL_CURRENCY_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('currency', action.currency);
    case GET_ALL_CURRENCY_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case CHANGE_NAME_CURRENCY:
      return state.set(action.a, action.b);
    case ADD_CURRENCY:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false)
        .set('data', action.data);
    case ADD_CURRENCY_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('notiMessage', action.message);
    case ADD_CURRENCY_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case UPDATE_CURRENCY:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_CURRENCY_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('data', action.data)
        .set('notiMessage', action.message);
    case UPDATE_CURRENCY_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('err', action.err)
        .set('notiMessage', action.message);
    case CHANGE_FORMAT_CURRENCY:
      return state.set('nameCurrency', action.data);
    case HANDLE_DISCOUNT:
      return state.set(action.name, action.checked);
    case GET_CURRENCY:
      return state.merge(action.currentCurrency);
    case GET_MONEY:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_MONEY_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('money', action.money);
    case GET_MONEY_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_CURRENCY_DEFAULT:
      return state.merge(initialState);
    case CHANGE_BASE_CURRENCY:
      return state.set('currencyId', action.currencyId).set('base', action.base);
    // Location

    case GET_LOCATION:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_LOCATION_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('location', action.location);
    case GET_LOCATION_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case ADD_LOCATION:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false)
        .set('data', action.data);
    case ADD_LOCATION_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('notiMessage', action.message);
    case ADD_LOCATION_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case CHANGE_LOCATION:
      return state.set(action.a, action.b);
    case GET_CURRENT_LOCATION:
      return state.merge(action.currentLocation);
    case UPDATE_LOCATION:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_LOCATION_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('data', action.data);
    case UPDATE_LOCATION_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('err', action.err);
    // TAX
    case GET_TAX:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_TAX_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('tax', action.tax);
    case GET_TAX_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case ADD_TAX:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false)
        .set('data', action.data);
    case ADD_TAX_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('notiMessage', action.message);
    case ADD_TAX_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case CHANGE_TAX:
      return state.set(action.a, action.b);
    case GET_CURRENT_TAX:
      return state.merge(action.currentTax).set('idTax', action.currentTax._id);
    case UPDATE_TAX:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case UPDATE_TAX_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('data', action.data);
    case UPDATE_TAX_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('err', action.err);
    case SELECT_TAX:
      return state.set('typeCustomer', action.value);
    case GET_CURRENT_TAX_VAT:
      return state.merge(action.currentTaxVAT);
    case ADD_TAX_LEVEL:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false)
        .set('data', action.data);
    case ADD_TAX_LEVEL_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('taxRates', action.data.taxRates)
        .set('notiMessage', action.message);
    case ADD_TAX_LEVEL_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('notiMessage', action.message)
        .set('err', action.err)
        .set('error', true);
    case HANDLE_CHANGE_TAX_LEVEL:
      return state.set(action.name, action.data);
    case GET_TAX_LEVEL:
      return state.merge(action.taxLevel).set('index', action.index);
    case UPDATE_TAX_LEVEL:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false)
        .set('taxRates', action.data);
    case UPDATE_TAX_LEVEL_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('tax', action.data);
    case UPDATE_TAX_LEVEL_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true)
        .set('err', action.err);
    default:
      return state;
  }
}

export default crmConfigPageReducer;
