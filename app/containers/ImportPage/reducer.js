/*
 *
 * ImportPage reducer
 *
 */

// import { fromJS } from 'immutable';
// import { DEFAULT_ACTION, IMPORT_EXCEL, IMPORT_EXCEL_SUCCESS, IMPORT_EXCEL_FALSE, IMPORT_EXCEL_WARNING } from './constants';

// export const initialState = fromJS({
//   loading: false,
//   error: false,
//   success: false,
//   warning: false,
//   msg: '',
//   data: {
//     success: true,
//   },
// });

// function importPageReducer(state = initialState, action) {
//   switch (action.type) {
//     case DEFAULT_ACTION:
//       return state
//         .set('loading', false)
//         .set('error', false)
//         .set('success', false)
//         .set('warning', false)
//         .set('msg', '');
//     case IMPORT_EXCEL:
//       return state
//         .set('loading', true)
//         .set('error', false)
//         .set('success', false)
//         .set('warning', false)
//         .set('msg', '');
//     case IMPORT_EXCEL_SUCCESS:
//       return state
//         .set('loading', false)
//         .set('error', false)
//         .set('success', true)
//         .set('data', action.data)
//         .set('warning', false)
//         .set('msg', 'Import thành công');
//     case IMPORT_EXCEL_FALSE:
//       return state
//         .set('loading', true)
//         .set('error', false)
//         .set('success', false)
//         .set('warning', false)
//         .set('msg', 'import thất bại');
//     case IMPORT_EXCEL_WARNING:
//       return state
//         .set('loading', false)
//         .set('error', false)
//         .set('success', false)
//         .set('warning', true)
//         .set('data', action.data)
//         .set('msg', 'Một số phần tử không thể import');
//     default:
//       return state;
//   }
// }

// export default importPageReducer;


import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  IMPORT_EXCEL,
  IMPORT_EXCEL_SUCCESS,
  IMPORT_EXCEL_FALSE,
  IMPORT_EXCEL_WARNING,
  UPDATE_IMPORT_PROCESS,
  MERGE_DATA
} from './constants';

export const initialState = fromJS({
  loading: false,
  error: false,
  success: false,
  warning: false,
  msg: '',
  data: {
    success: true,
  },
  importCount: null,
  importedCount: 0,
  openCountDialog: false,
});

function importPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state
        .set('loading', false)
        .set('error', false)
        .set('success', false)
        .set('warning', false)
        .set('msg', '');
    case MERGE_DATA:
      return state.merge(action.data);
    case IMPORT_EXCEL:
      return state
        .set('openCountDialog', true)
        .set('importCount', null)
        .set('importedCount', 0)
        .set('loading', true)
        .set('error', false)
        .set('success', false)
        .set('warning', false)
        .set('msg', '')
        .set('showWarning', null);
    case IMPORT_EXCEL_SUCCESS:
      return state
        .set('openCountDialog', false)
        .set('loading', false)
        .set('error', false)
        .set('success', true)
        .set('data', action.data)
        .set('warning', false)
        .set('msg', 'Tải lên thành công');
    case IMPORT_EXCEL_FALSE:
      return state
        .set('openCountDialog', false)
        .set('loading', true)
        .set('error', false)
        .set('success', false)
        .set('warning', false)
        .set('msg', 'Tải lên thất bại')
        .set('showWarning', true);
    case IMPORT_EXCEL_WARNING:
      return state
        .set('openCountDialog', false)
        .set('loading', false)
        .set('error', false)
        .set('success', false)
        .set('warning', true)
        .set('data', action.data)
        .set('msg', 'Một số phần tử không thể import')
        .set('showWarning', true);
    case UPDATE_IMPORT_PROCESS:
      return state
        .set('importCount', action.data.importCount)
        .set('importedCount', action.data.importedCount)
    default:
      return state;
  }
}

export default importPageReducer;
