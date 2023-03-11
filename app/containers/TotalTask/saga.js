import { takeLatest, call, put, select } from 'redux-saga/effects';
// import { push } from 'react-router-redux';
import request from 'utils/request';
import { API_TASK_PROJECT, API_ORIGANIZATION, API_APPROVE_GROUPS, API_BOS } from 'config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { mergeData, getTasks, addBoSuccessAction } from './actions';
import { GET_TASKS, DELETE_TASKS, ADD_BO, GET_TASK_FOR_TIMEMANAGEMENT } from './constants';
import { serialize } from '../../utils/common';
import { makeSelectProfile } from '../Dashboard/selectors';
// Individual exports for testing

function* getTasksSaga(action) {
  try {
    // const profile = yield select(makeSelectProfile());
    // const projectFilter = serialize({
    //   filter: {
    //     isProject: true,
    //   },
    // });
    // const config = JSON.parse(localStorage.getItem('taskStatus'));
    // const planner = config.find(item => item.code === 'PLANER').data;
    // // const approvedGroups = yield call(request, API_APPROVE_GROUPS, {
    // //   method: 'GET',
    // //   headers: {
    // //     Authorization: `Bearer ${localStorage.getItem('token')}`,
    // //   },
    // // });

    // const arrApproved = [];
    // approvedGroups.forEach(elm => {
    //   const a = elm.group.find(item => item.person === profile.userId);
    //   if (a) arrApproved.push(elm);
    // });
    // const newApproved = arrApproved.map(item => ({ id: item._id, name: item.name }));
    // yield put(
    //   mergeData({
    //     planner,
    //     approvedGroups: newApproved,
    //   }),
    // );
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* fetchTaskForTimeManagement(action) {
  try {
    const taskFilter = serialize({
      filter: {
        isProject: false,
      },
    });

    const tasks = yield call(request, `${API_TASK_PROJECT}?${taskFilter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(
      mergeData({
        tasks: tasks.data,
      }),
    );
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* deleteTasksSaga(action) {
  try {
    yield call(request, API_TASK_PROJECT, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.data.ids }),
    });
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Xóa thành công' }));
    yield put(getTasks(action.data.queryString));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa không thành công' }));
  }
}

export function* fetchAddBo(action) {
  const token = localStorage.getItem('token');

  try {
    // console.log('action', action);
    const addBo = yield call(request, `${API_BOS}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.doc),
    });

    yield put(addBoSuccessAction(addBo, 'Thêm thành công'));

    yield put(changeSnackbar({ status: true, message: 'Thêm cơ hội kinh doanh thành công', variant: 'success' }));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Thêm cơ hội kinh doanh thất bại', variant: 'error' }));
  }
}

export default function* totalTaskSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_TASKS, getTasksSaga);
  yield takeLatest(DELETE_TASKS, deleteTasksSaga);
  yield takeLatest(ADD_BO, fetchAddBo);
  yield takeLatest(GET_TASK_FOR_TIMEMANAGEMENT, fetchTaskForTimeManagement);
}
