import { takeLatest, put, call } from 'redux-saga/effects';
import qs from 'qs';
import { goBack } from 'connected-react-router';
import { GET_MODULE, ADD_ROLE_GROUP_PORTAL, GET_INFOR_ROLE_GROUP_PORTAL, EDIT_ROLE_GROUP_PORTAL } from './constants';
import request from '../../utils/request';
import {
  getModuleSuccess,
  getModuleError,
  addRolePortalSuccess,
  addRolePortalError,
  getInforRoleGroupPortalActionFailed,
  getInforRoleGroupPortalActionSuccess,
  editRoleGroupPortalActError,
  editRoleGroupPortalActSuccess,
} from './actions';
import { API_COMMON_MODULE, API_ROLE_GROUP_PORTAL } from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
// Individual exports for testing

export function* getModules() {
  try {
    const data = yield call(request, `${API_COMMON_MODULE}?portal=true`, {
      method: 'GET',
    });
    yield put(
      getModuleSuccess({
        data,
      }),
    );
  } catch (err) {
    yield put(getModuleError(err));
  }
}

export function* addRoleGroupPortal(action) {
  const token = localStorage.getItem('token');
  try {
    const createRoleGroup = {
      clientId: action.body.clientId,
      name: action.body.roleName,
      description: action.body.roleDes,
      code: action.body.code,
      roles: action.body.allFunctionForAdd,
      applyEmployeeOrgToModuleOrg: action.body.applyEmployeeOrgToModuleOrg,
      departments: action.body.departments,
      order: action.body.order,
      other: action.body.other
    };
    console.log('API_ROLE_GROUP_PORTAL',API_ROLE_GROUP_PORTAL);
    const dataCreate = yield call(request, API_ROLE_GROUP_PORTAL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createRoleGroup),
    });
    if (dataCreate) {
      yield put(addRolePortalSuccess());
      yield put(changeSnackbar({ status: true, message: 'Tạo mới nhóm quyền thành công ', variant: 'success' }));
      // yield put(goBack());
    } else {
      yield put(addRolePortalError());
      yield put(changeSnackbar({ status: true, message: 'Tạo mới nhóm quyền thất bại', variant: 'error' }));
    }
  } catch (err) {
    //console.log('err', err);
    yield put(addRolePortalError(err));
    yield put(changeSnackbar({ status: true, message: 'Tạo mới nhóm quyền thất bại', variant: 'error' }));
  }
}

export function* getInforRoleGroupPortalAction(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ROLE_GROUP_PORTAL}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data) {
      yield put(getInforRoleGroupPortalActionSuccess(data));
    } else {
      yield put(getInforRoleGroupPortalActionFailed());
    }
  } catch (err) {
    yield put(getInforRoleGroupPortalActionFailed(err));
  }
}

export function* editRoleGroupPortalSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const editRole = {
      clientId: action.body.clientId,
      code: action.body.code,
      name: action.body.roleName,
      description: action.body.roleDes,
      roles: action.body.allFunctionForAdd,
      applyEmployeeOrgToModuleOrg: action.body.applyEmployeeOrgToModuleOrg,
      departments: action.body.departments,
      order: action.body.order,
      other: action.body.other
    };
    const dataEdit = yield call(request, `${API_ROLE_GROUP_PORTAL}/update-group-h05/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editRole),
    });
    if (dataEdit) {
      yield put(editRoleGroupPortalActSuccess());
      yield put(changeSnackbar({ status: true, message: 'Cập nhật nhóm quyền thành công', variant: 'success' }));
      // yield put(goBack());
    } else {
      yield put(editRoleGroupPortalActError());
      yield put(changeSnackbar({ status: true, message: 'Cập nhật nhóm quyền thất bại', variant: 'error' }));
    }
  } catch (error) {
    //console.log('err', error);
    yield put(editRoleGroupPortalActError());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật nhóm quyền thất bại', variant: 'error' }));
  }
}

export default function* addRolesGroupPortalPageSaga() {
  yield takeLatest(GET_MODULE, getModules);
  yield takeLatest(ADD_ROLE_GROUP_PORTAL, addRoleGroupPortal);
  yield takeLatest(GET_INFOR_ROLE_GROUP_PORTAL, getInforRoleGroupPortalAction);
  yield takeLatest(EDIT_ROLE_GROUP_PORTAL, editRoleGroupPortalSaga);
  // See example in containers/HomePage/saga.js
}
