/*
 *
 * SuppliersPage actions
 *
 */

import {
  GET_ALL_VIEWCONFIGS,
  GET_ALL_VIEWCONFIGS_SUCCESS,
  GET_ALL_VIEWCONFIGS_FAIL,
  GET_SYS_CONF,
  GET_SYS_CONF_SUCCESS,
  GET_SYS_CONF_FAILED,
  CLOSE_SNACKBAR,
  CHANGE_SNACKBAR,
  GET_PROFILE,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILED,
  GET_STOCK,
  GET_STOCK_SUCCESS,
  GET_STOCK_FAILED,
  CHANGE_STOCK,
  ADD_LOG,
  MERGE_DATA,
  GET_CODE_CONFIG,
  GET_CODE_CONFIG_SUCCESS,
  GET_CODE_CONFIG_ERROR,
  GET_ROLE,
  GET_ROLE_TASK,
  GET_APPROVE,
  GET_APPROVE_SUCCESS,
  GET_APPROVE_FAILED,
  CHANGE_WORKING_ORGANIZATION,
  CHANGE_WORKING_ORGANIZATION_SUCCESS,
  CHANGE_WORKING_ORGANIZATION_FAILED,
  GET_ALL_DEPARTMENT_FAILED,
  GET_ALL_DEPARTMENT_SUCCESS,
  GET_ALL_HRM_TIMEKEEPING,
  GET_ALL_HRM_TIMEKEEPING_SUCCESS,
  GET_ALL_HRM_TIMEKEEPING_FAILER,
  GET_ALL_VIEWCONFIG_FORMULA,
  GET_ALL_VIEWCONFIG_FORMULA_SUCCESS,
  GET_ALL_VIEWCONFIG_FORMULA_FAILER,
  DOC_UPDATED,
  NEW_COMMENT,
  GET_DATA,
  GET_DATA_SUCCESS,
  UPDATE_LOAD
} from './constants';

// export function defaultAction() {
//   return {
//     type: 'DEFAULT_ACTION',
//   };
// }

export const closeSnackbar = () => ({ type: CLOSE_SNACKBAR });

export function changeSnackbar(data) {
  return {
    type: CHANGE_SNACKBAR,
    data,
  };
}
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
export function getApproveAction() {
  return {
    type: GET_APPROVE,
  };
}

export function getApproveSuccessAction(data, currentUser) {
  return {
    type: GET_APPROVE_SUCCESS,
    data,
    currentUser,
  };
}

export function getApproveFailAction(err, message) {
  return {
    type: GET_APPROVE_FAILED,
    err,
    message,
  };
}

// export const changeSnackbar = data => ({ type: CHANGE_SNACKBAR, data });

export function fetchAllViewConfigsAction(id) {
  return {
    type: GET_ALL_VIEWCONFIGS,
    id,
  };
}
export function fetchAllViewConfigsSuccessAction(data, message) {
  return {
    type: GET_ALL_VIEWCONFIGS_SUCCESS,
    data,
    message,
  };
}
export function fetchAllViewConfigsFailAction(err, message) {
  return {
    type: GET_ALL_VIEWCONFIGS_FAIL,
    err,
    message,
  };
}

export function getSysConfAct(body) {
  return {
    type: GET_SYS_CONF,
    body,
  };
}
export function getSysConfSuccess(data) {
  return {
    type: GET_SYS_CONF_SUCCESS,
    data,
  };
}
export function getSysConfFailed(err) {
  return {
    type: GET_SYS_CONF_FAILED,
    err,
  };
}

export function getStockAct(body) {
  return {
    type: GET_STOCK,
    body,
  };
}
export function getStockSuccess(data) {
  return {
    type: GET_STOCK_SUCCESS,
    data,
  };
}
export function getStockFailed(err) {
  return {
    type: GET_STOCK_FAILED,
    err,
  };
}

export function getProfileAct(body) {
  return {
    type: GET_PROFILE,
    body,
  };
}
export function getProfileSuccess(data) {
  return {
    type: GET_PROFILE_SUCCESS,
    data,
  };
}
export function getProfileFailed(err) {
  return {
    type: GET_PROFILE_FAILED,
    err,
  };
}
export function getCodeConfig(body) {
  return {
    type: GET_CODE_CONFIG,
    body,
  };
}
export function getCodeConfigSuccess(data) {
  return {
    type: GET_CODE_CONFIG_SUCCESS,
    data,
  };
}
export function getCodeConfigError(err) {
  return {
    type: GET_CODE_CONFIG_ERROR,
    err,
  };
}

export function changeStockAct(body, name) {
  return {
    type: CHANGE_STOCK,
    body,
    name
  };
}

export function addLog(object) {
  // console.log(object);
  return {
    type: ADD_LOG,
    object,
  };
}

export function mergeData(data) {
  // console.log(object);
  return {
    type: MERGE_DATA,
    data,
  };
}

export function getRole(data) {
  return {
    type: GET_ROLE,
    userId: data,
  };
}

export function getRoleTask(data) {
  return {
    type: GET_ROLE_TASK,
    userId: data,
  };
}

export function changeWorkingOrganization(id) {
  return {
    type: CHANGE_WORKING_ORGANIZATION,
    id
  }
}

export function changeWorkingOrganizationSuccess(data) {
  return {
    type: CHANGE_WORKING_ORGANIZATION_SUCCESS,
    data
  }
}

export function changeWorkingOrganizationFailed(err) {
  return {
    type: CHANGE_WORKING_ORGANIZATION_FAILED,
    err
  }
}

export function getAllDepartmentSuccess(data) {
  return {
    type: GET_ALL_DEPARTMENT_SUCCESS,
    data
  }
}
export function getAllDepartmentFailed(error) {
  return {
    type: GET_ALL_DEPARTMENT_FAILED,
    error
  }
}


export function getAllHrmTimekeeping() {
  return {
    type: GET_ALL_HRM_TIMEKEEPING,
  };
}

export function getAllHrmTimekeepingSuccess(data) {
  return {
    type: GET_ALL_HRM_TIMEKEEPING_SUCCESS,
    data
  }
}

export function getAllHrmTimekeepingFailer(error) {
  return {
    type: GET_ALL_HRM_TIMEKEEPING_FAILER,
    error
  }
}

export function getAllViewconfigFormula() {
  return {
    type: GET_ALL_VIEWCONFIG_FORMULA,
  };
}

export function getAllViewconfigFormulaSuccess(data) {
  return {
    type: GET_ALL_VIEWCONFIG_FORMULA_SUCCESS,
    data
  }
}

export function getAllViewconfigFormulaFailer(error) {
  return {
    type: GET_ALL_VIEWCONFIG_FORMULA_FAILER,
    error
  }
}

export function docUpdated(data) {
  return {
    type: DOC_UPDATED,
    data,
  }
}

export function newComment(data) {
  return {
    type: NEW_COMMENT,
    data,
  };
}

export function updateLoad(data) {
  return {
    type: UPDATE_LOAD,
    data,
  };
}