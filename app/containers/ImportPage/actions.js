/*
 *
 * ImportPage actions
 *
 */

// import { DEFAULT_ACTION, IMPORT_EXCEL, IMPORT_EXCEL_FALSE, IMPORT_EXCEL_SUCCESS, IMPORT_EXCEL_WARNING } from './constants';

// export function defaultAction() {
//   return {
//     type: DEFAULT_ACTION,
//   };
// }

// export function importExcel(data) {
//   return {
//     type: IMPORT_EXCEL,
//     data,
//   };
// }
// export function importExcelFalse(err) {
//   return {
//     type: IMPORT_EXCEL_FALSE,
//     err,
//   };
// }
// export function importExcelSuccess(data) {
//   return {
//     type: IMPORT_EXCEL_SUCCESS,
//     data,
//   };
// }
// export function importExcelWarning(data) {
//   return {
//     type: IMPORT_EXCEL_WARNING,
//     data,
//   };
// }


import { DEFAULT_ACTION, IMPORT_EXCEL, IMPORT_EXCEL_FALSE, IMPORT_EXCEL_SUCCESS, IMPORT_EXCEL_WARNING, UPDATE_IMPORT_PROCESS, MERGE_DATA } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data
  };
}

export function importExcel(data) {
  return {
    type: IMPORT_EXCEL,
    data,
  };
}
export function importExcelFalse(err) {
  return {
    type: IMPORT_EXCEL_FALSE,
    err,
  };
}
export function importExcelSuccess(data) {
  return {
    type: IMPORT_EXCEL_SUCCESS,
    data,
  };
}
export function importExcelWarning(data) {
  return {
    type: IMPORT_EXCEL_WARNING,
    data,
  };
}

export function updateImportProccess(data) {
  return {
    type: UPDATE_IMPORT_PROCESS,
    data,
  };
}