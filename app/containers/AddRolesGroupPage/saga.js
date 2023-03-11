import { takeLatest, put, call } from 'redux-saga/effects';
import qs from 'qs';
import { goBack } from 'connected-react-router';
import { GET_MODULE, ADD_ROLE_GROUP, GET_INFOR_ROLE_GROUP, EDIT_ROLE_GROUP } from './constants';
import request from '../../utils/request';
import {
  getModuleSuccess,
  getModuleError,
  addRoleSuccess,
  addRoleError,
  getInforRoleGroupActionFailed,
  getInforRoleGroupActionSuccess,
  editRoleGroupActError,
  editRoleGroupActSuccess,
} from './actions';
import { API_COMMON_MODULE, API_ROLE_GROUP } from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
// Individual exports for testing

export function* getModules() {
  try {
    const data = yield call(request, `${API_COMMON_MODULE}`, {
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

export function* addRoleGroup(action) {
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
    const dataCreate = yield call(request, API_ROLE_GROUP, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createRoleGroup),
    });
    if (dataCreate) {
      yield put(addRoleSuccess());
      yield put(changeSnackbar({ status: true, message: 'Tạo mới nhóm quyền thành công ', variant: 'success' }));
      // yield put(goBack());
    } else {
      yield put(addRoleError());
      yield put(changeSnackbar({ status: true, message: 'Tạo mới nhóm quyền thất bại', variant: 'error' }));
    }
  } catch (err) {
    //console.log('err', err);
    yield put(addRoleError(err));
    yield put(changeSnackbar({ status: true, message: 'Tạo mới nhóm quyền thất bại', variant: 'error' }));
  }
}

export function* getInforRoleGroupAction(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ROLE_GROUP}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data) {
      yield put(getInforRoleGroupActionSuccess(data));
    } else {
      yield put(getInforRoleGroupActionFailed());
    }
  } catch (err) {
    yield put(getInforRoleGroupActionFailed(err));
  }
}

export function* editRoleGroupSaga(action) {
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
    const dataEdit = yield call(request, `${API_ROLE_GROUP}/update-group-h05/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editRole),
    });
    if (dataEdit) {
      yield put(editRoleGroupActSuccess());
      yield put(changeSnackbar({ status: true, message: 'Cập nhật nhóm quyền thành công', variant: 'success' }));
      // yield put(goBack());
    } else {
      yield put(editRoleGroupActError());
      yield put(changeSnackbar({ status: true, message: 'Cập nhật nhóm quyền thất bại', variant: 'error' }));
    }
  } catch (error) {
    //console.log('err', error);
    yield put(editRoleGroupActError());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật nhóm quyền thất bại', variant: 'error' }));
  }
}

export default function* addRolesGroupPageSaga() {
  yield takeLatest(GET_MODULE, getModules);
  yield takeLatest(ADD_ROLE_GROUP, addRoleGroup);
  yield takeLatest(GET_INFOR_ROLE_GROUP, getInforRoleGroupAction);
  yield takeLatest(EDIT_ROLE_GROUP, editRoleGroupSaga);
  // See example in containers/HomePage/saga.js
}
