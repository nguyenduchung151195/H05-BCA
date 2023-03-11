/*
 *
 * ListPage actions
 *
 */

import { DEFAULT_ACTION, PUT_VIEWCONFIG, GET_ROWS, GET_ROWS_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function putViewConfig(columns, code) {
  return {
    type: PUT_VIEWCONFIG,
    columns,
    code,
  };
}
export const handleDelete = (selected, deleteUrl, apiUrl, deleteOption) => ({ type: 'DELETE_ROWS', selected, deleteUrl, apiUrl, deleteOption });
export const getRows = apiUrl => ({ type: GET_ROWS, apiUrl });
export const getRowsSuccess = data => ({ type: GET_ROWS_SUCCESS, data });
// export const deleteRowsSuccess = data => ({ type: 'GET_ROWS_SUCCESS', data });
export const setState = data => ({ type: 'SET_STATE', data });
