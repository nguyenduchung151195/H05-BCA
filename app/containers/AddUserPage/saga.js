// import { take, call, put, select } from 'redux-saga/effects';

// Individual exports for testing
import qs from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { ADD_USER, GET_DEPARTMENT, EDIT_USER, GET_USER, GET_MODULE, GET_MODULE_PORTAL } from './constants';
import {
  addUserFalseAction,
  addUserSuccessAction,
  getDepartmentSuccess,
  getDepartmentFailed,
  editUserSuccess,
  editUserFailed,
  getUserSuccess,
  getUserFailed,
  getmoduleSuccess,
  getModuleFailed,
  getmodulePortalSuccess,
  getModulePortalFailed,
} from './actions';
import {
  API_USERS,
  API_ORIGANIZATION,
  CREATE,
  UPLOAD_IMG_SINGLE,
  API_ROLE,
  API_ROLE_PORTAL,
  CREATE_USER,
  API_COMMON_MODULE,
  API_ROLE_GROUP,
  API_ROLE_GROUP_PORTAL,
  APP_URL,
} from '../../config/urlConfig';
import { enableSso, ssoHost } from '../../variable';
import { clientId } from '../../variable';

export function* AddUser(action) {
  const formData = new FormData();
  formData.append('file', action.body.avatar);
  let registerUser
  if (enableSso) {
    registerUser = {
      enableSso: enableSso,
      username: action.body.username,
      password: action.body.password,
      name: action.body.name,
      email: action.body.email,
      code: action.body.code,
      status: action.body.status,
    };
  } else {
    registerUser = {
      username: action.body.username,
      password: action.body.password,
      name: action.body.name,
      email: action.body.email,
      code: action.body.code,
      status: action.body.status,
    };
  }
  const token = localStorage.getItem('token');
  try {
    let avatar = '';
    if (action.body.avatar) {
      try {
        const formData = new FormData();
        formData.append('file', action.body.avatar);
        const upload = yield call(request, UPLOAD_IMG_SINGLE, {
          method: 'POST',
          headers: {},
          body: formData,
        });
        avatar = upload.url;
      } catch (error) { }
    }

    const dataRegister = yield call(request, CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      body: qs.stringify(registerUser),
    });
    if (dataRegister) {
      const createUser = {
        organizationUnit: action.body.organizationUnit,
        code: action.body.code,
        name: action.body.name,
        email: action.body.email,
        beginWork: action.body.beginWork,
        gender: action.body.gender,
        identityCardNumber: action.body.IDcard,
        phoneNumber: action.body.mobileNumber,
        address: action.body.address,
        note: action.body.note,
        positions: action.body.positions,
        userExtendViewConfig: action.body.userExtendViewConfig,
        avatar,
        dob: action.body.dob,
        status: action.body.status,
        username: action.body.username,
        user: dataRegister.user,
        others: action.body.others,
        type: action.body.type,
        roleGroupSource: action.body.roleGroupSource,
        roleGroupSourcePortal: action.body.roleGroupSourcePortal,
        allowedDepartment: action.body.allowedDepartment,
        canProcessAny: action.body.canProcessAny,
        canProcessAnyInDepartment: action.body.canProcessAnyInDepartment,
        anonymous: action.body.anonymous,
        internal: action.body.internal,
        signer: action.body.signer,
        inherit: action.body.inherit,
        viewConfigSystem: action.body.viewConfigSystem,
        releaseDepartment: action.body.releaseDepartment,
        cap_bac: action.body.cap_bac
      };
      const dataCreate = yield call(request, API_USERS, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUser),
      });
      const bodyAddRole = {
        roles: action.body.allFunctionForAdd,
        userId: dataRegister.user,
        groupId: action.body.roleGroupSourceId || null,
      };
      yield call(request, API_ROLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyAddRole),
      });
      if (dataCreate) {
        yield put(addUserSuccessAction());
      } else {
        yield put(addUserFalseAction());
      }
    } else {
      yield put(addUserFalseAction());
    }
  } catch (err) {
    yield put(addUserFalseAction(err));
  }
}

export function* editUser(action) {
  const token = localStorage.getItem('token');
  try {
    let avatar = action.body.avatarURL;
    if (action.body.avatar) {
      try {
        const formData = new FormData();
        formData.append('file', action.body.avatar);
        const upload = yield call(request, UPLOAD_IMG_SINGLE, {
          method: 'POST',
          headers: {},
          body: formData,
        });
        avatar = upload.url;
      } catch (error) { }
    }

    const editUser = {
      organizationUnit: action.body.organizationUnit,
      code: action.body.code,
      name: action.body.name,
      email: action.body.email,
      beginWork: action.body.beginWork,
      gender: action.body.gender,
      identityCardNumber: action.body.IDcard,
      phoneNumber: action.body.mobileNumber,
      address: action.body.address,
      note: action.body.note,
      positions: action.body.positions,
      canProcessAny: action.body.canProcessAny,
      canProcessAnyInDepartment: action.body.canProcessAnyInDepartment,
      anonymous: action.body.anonymous,
      internal: action.body.internal,
      avatar,
      userExtendViewConfig: action.body.userExtendViewConfig,
      dob: action.body.dob,
      status: action.body.status,
      user: action.body.user,
      others: action.body.others,
      type: action.body.type,
      codeRoleGroupSelect: action.body.codeRoleGroupSelect,
      signer: action.body.signer,
      inherit: action.body.inherit,
      viewConfigSystem: action.body.viewConfigSystem,
      roleGroupSource: action.body.roleGroupSource,
      roleGroupSourcePortal: action.body.roleGroupSourcePortal,
      allowedDepartment: action.body.allowedDepartment,
      releaseDepartment: action.body.releaseDepartment,
      cap_bac: action.body.cap_bac
    };
    const dataEdit = yield call(request, `${API_USERS}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editUser),
    });
    if (dataEdit) {
      if (action.body.userId) {
        const bodyAddRole = {
          roles: action.body.allFunctionForAdd,
          userId: action.body.userId,
        };
        yield call(request, `${API_ROLE}/${action.body.userId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyAddRole),
        });
      }
      if (action.body.resetChild) {
        const resetRoleBody = {
          userId: action.body.id,
          roleGroupId: action.body.roleGroupSelectId,
        };
        yield call(request, `${APP_URL}/api/roleApp/resetChildRole`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resetRoleBody),
        });
      }
      yield put(editUserSuccess());
    } else {
      yield put(editUserFailed());
    }
  } catch (err) {
    yield put(editUserFailed(err));
  }
}

export function* getDepartment() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ORIGANIZATION}?byOrg=true`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(getDepartmentSuccess(data));
  } catch (err) {
    yield put(getDepartmentFailed(err));
  }
}

export function* getUser(action) {
  const token = localStorage.getItem('token');
  if (action.body === "add") {
    yield put(
      getUserSuccess({
        user: null,
      }),
    );

  } else {
    try {
      const data = yield call(request, `${API_USERS}/${action.body}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data, "data")
      if (data.status === 'success') {
        const userId = data.data.userId || null;
        let roleForCurrentUser = [];
        if (userId !== null) {
          roleForCurrentUser = yield call(request, `${API_ROLE}/${userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        yield put(
          getUserSuccess({
            user: data.data,
            role: roleForCurrentUser,
          }),
        );
      } else {
        yield put(getUserFailed());
      }
    } catch (err) {
      yield put(getUserFailed(err));
    }
  }

}
export function* getModules() {
  try {
    const data = yield call(request, `${API_COMMON_MODULE}`, {
      method: 'GET',
    });
    const roleGroups = yield call(request, `${API_ROLE_GROUP}?clientId=${clientId}`, {
      method: 'GET',
    });
    yield put(
      getmoduleSuccess({
        data,
        roleGroups: roleGroups.data,
      }),
    );
  } catch (err) {
    yield put(getModuleFailed(err));
  }
}
export function* getModulesPortal() {
  try {
    const data = yield call(request, `${API_COMMON_MODULE}?portal=true`, {
      method: 'GET',
    });
    const roleGroupsPortal = yield call(request, `${API_ROLE_GROUP_PORTAL}?clientId=${clientId}`, {
      method: 'GET',
    });
    yield put(
      getmodulePortalSuccess({
        data,
        roleGroupsPortal: roleGroupsPortal.data,
      }),
    );
  } catch (err) {
    yield put(getModulePortalFailed(err));
  }
}

export default function* addUserPageSaga() {
  yield takeLatest(GET_USER, getUser);
  yield takeLatest(ADD_USER, AddUser);
  yield takeLatest(EDIT_USER, editUser);
  yield takeLatest(GET_DEPARTMENT, getDepartment);
  yield takeLatest(GET_MODULE, getModules);
  yield takeLatest(GET_MODULE_PORTAL, getModulesPortal);
}
