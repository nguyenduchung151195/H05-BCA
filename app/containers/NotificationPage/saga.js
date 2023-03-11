/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { call, put, takeEvery } from 'redux-saga/effects';
import qs from 'qs';
import request, { requestApprove } from '../../utils/request';
// import { serialize } from '../../utils/common';
// import { changeSnackbar } from '../Dashboard/actions';
import { API_NOTIFICATION, API_USERS, API_PROFILE, API_TEMPLATE, API_COMMON, UPLOAD_APP_URL } from '../../config/urlConfig';
import {
  // getApproveFailAction, updateApproveFailAction, updateApproveSuccessAction,
  getApproveSuccessAction,
  getApproveAction,
} from './actions';
import { GET_NOTIFICATION, UPDATE_NOTIFICATION, OPEN_TEMPLATE } from './constants';

import { changeSnackbar } from '../Dashboard/actions';
import { convertTemplate } from '../../helper';
// import { clientId } from '../../variable';
// Individual exports for testing
export function* fetchApprove() {
  try {
    // const query = serialize({ filter: { clientId } });
    const data = yield call(requestApprove, `${API_NOTIFICATION}`, {
      method: 'GET',
    });
    // console.log(data);
    const users = yield call(request, `${API_USERS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const currentUser = yield call(request, API_PROFILE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (data && users) {
      const userHasId = users.data.filter(item => {
        if (Object.keys(item).includes('userId')) {
          return item;
        }
      });
      // console.log(userHasId);

      const newData = data.data.map(item => {
        item.groupInfo = item.groupInfo.map(employee => ({ ...employee, ...userHasId.find(d => d.userId === employee.person) }));
        return item;
      });
      yield put(getApproveSuccessAction(newData, currentUser));
    }
  } catch (err) {
    // yield put(getApproveGroupDetailPageFailAction(err));
    // yield put(changeSnackbar({ status: true, message: 'Lấy nhóm phê duyệt thất bại', variant: 'error' }));
  }
}
export function* updateApprove(action) {
  try {
    try {
      const data = yield call(requestApprove, `${API_NOTIFICATION}/${action.approve._id}`, {
        method: 'PATCH',
        headers: {
          // Authorization: `Bearer ${getToken.data.token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs.stringify(action.result.approveData),
      });
      if (action.result.selectedFiles && action.result.selectedFiles.length > 0) {
        const url = `${UPLOAD_APP_URL}/approveFiles`;
        const fileBody = {
          approveFiles: action.result.selectedFiles.map(c => c._id),
          approver: {
            _id: action.currentUser._id,
            name: action.currentUser.name,
          },
          approvedDate: Date(),
        };
        const fileResponse = yield call(requestApprove, url, {
          method: 'PATCH',
          headers: {
            // Authorization: `Bearer ${getToken.data.token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: qs.stringify(fileBody),
        });
      }

      if (data) {
        yield put(getApproveAction());
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      // console.log(err);
    }
  } catch (err) {
    // alert('Quá hạn đăng nhập, vui lòng đăng nhập lại');
  }
}
function PrintElemD(elem) {
  // eslint-disable-next-line no-restricted-globals
  const mywindow = window.open('', 'newWin', `width=${screen.availWidth},height=${screen.availHeight}`);

  mywindow.document.write(elem);

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
  mywindow.close();

  return true;
}
function* getTemplate(action) {
  try {
    const collectionCode = action.data.collectionCode;
    const formId = action.data.dynamicForm;
    const viewConfigs = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewconfig = viewConfigs.find(item => item.code === collectionCode);
    // console.log(currentViewconfig.listDisplay.type.fields.type.columns)
    const listRelationRef = [];
    currentViewconfig.listDisplay.type.fields.type.columns.forEach(element => {
      if (element.type.includes('Relation')) {
        let ref = '';
        ref = element.type.replace('Relation|', '');
        ref = ref.replace(/'/g, '"');
        const objectRef = JSON.parse(ref);
        listRelationRef.push({ columnName: element.name, ref: objectRef.ref });
      }
      if (element.type.includes('ObjectId')) {
        let ref = '';
        ref = element.type.replace('ObjectId|', '');
        listRelationRef.push({ columnName: element.name, ref });
      }
    });
    try {
      // listRelationRef.map(item => (action.data[item.columnName] = refData[item.columnName]));
      const templates = yield call(request, `${API_TEMPLATE}/${formId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const newData = yield call(request, `${API_COMMON}/${collectionCode}/${action.data.dataInfo._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const temp = convertTemplate({
        code: collectionCode,
        content: templates.content,
        data: newData,
      });
      PrintElemD(temp);
      yield put(changeSnackbar({ status: true, message: 'Xuất File thành công', variant: 'success' }));
    } catch (errRelation) {
      yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Xuất File thất bại', variant: 'error' }));
  }
}
export default function* notificationPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(UPDATE_NOTIFICATION, updateApprove);
  yield takeEvery(GET_NOTIFICATION, fetchApprove);
  yield takeEvery(OPEN_TEMPLATE, getTemplate);
}
