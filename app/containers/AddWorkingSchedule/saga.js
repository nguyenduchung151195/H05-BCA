import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { API_MEETING, API_ORIGANIZATION, API_MEETING_UPDATE_CALEN_DETAIL, API_GIVE_BACK_CALENDE, API_MEETING_RETURN_DOC } from '../../config/urlConfig';
import request from '../../utils/request';
import { postDataSuccess, getCurrentSuccess, putDataSuccess, mergeData, putAppropvedSuccess } from './actions';
import { POST_DATA, GET_CURRENT, PUT_DATA, GET_DATA, PUT_APPROVED, POST_GIVE_BACK_CALENDE } from './constants';
import { changeSnackbar } from '../Dashboard/actions';

// Individual exports for testing

function* postDataSaga(action) {
  const { data, cb } = action;
  const { callback } = data
  delete data.callback

  try {
    const dataFm = yield call(request, API_MEETING, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });


    cb && cb(dataFm._id);
    yield put(postDataSuccess(dataFm));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));

    if (typeof callback === 'function') callback();
    else yield put(push('/AllCalendar/Calendar'));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: error.message ? error.message : 'Thêm mới thất bại', variant: 'error' }));
  }
}

function* getCurrentSaga(action) {
  try {
    const data = yield call(request, `${API_MEETING}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(action.data),
    });
    data.customer = Array.isArray(data.customer) ? data.customer.map(i => ({ _id: i.customerId, name: i.name })) : [];

    yield put(getCurrentSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy lịch công tác thất bại', variant: 'error' }));
  }
}

function* putDataSaga(action) {
  try {
    const { callback } = action.data
    const {handleOpenBtnSave} = action
    const newBody = { ...action.data }
    delete newBody.callback

    const data = yield call(request, `${API_MEETING}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBody),
    });
    console.log(data, 'data')
    if(handleOpenBtnSave && typeof handleOpenBtnSave === "function"){
      console.log("handleOpenBtnSave")
      handleOpenBtnSave()
    }
    if(data && data.status){
      yield put(putDataSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      if (typeof callback === 'function') callback();
      else yield put(push('/AllCalendar/Calendar'));
    }else {
      yield put(changeSnackbar({ status: true, message: data.message || 'Cập nhật thất bại', variant: 'error' }));
    }

  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}
function* putAppropved(action) {
  try {
    const data = yield call(request, `${API_MEETING_UPDATE_CALEN_DETAIL}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      const { calenDetail } = data.data;
      yield put(mergeData({ calenDetail: calenDetail }));
    }
  }
  catch {
    yield put(changeSnackbar({ status: true, message: 'Thay đổi phê duyệt thất bại', variant: 'error' }));
  }
}

function* getTasksSaga() {
  try {
    const departments = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(
      mergeData({
        departments,
      }),
    );
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}
function* postGiveBack(action) {
  try {
    // const data = yield call(request, `${API_GIVE_BACK_CALENDE}/${action.id}`, {
    const data = yield call(request, `${API_MEETING_RETURN_DOC}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      yield put(changeSnackbar({ status: true, message: 'Trả lại thành công', variant: 'success' }));
      // const {calenDetail}=data.data;
      // yield put(mergeData({calenDetail: calenDetail}));
      yield put(push('/AllCalendar/Calendar'));
    }
    else {
      yield put(changeSnackbar({ status: true, message: 'Trả lại thất bại', variant: 'error' }));
    }
  }
  catch {
    yield put(changeSnackbar({ status: true, message: 'Trả lại thất bại', variant: 'error' }));
  }

}
export default function* addWorkingScheduleSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_DATA, postDataSaga);
  yield takeLatest(GET_CURRENT, getCurrentSaga);
  yield takeLatest(PUT_DATA, putDataSaga);
  yield takeLatest(GET_DATA, getTasksSaga);
  yield takeLatest(PUT_APPROVED, putAppropved)
  yield takeLatest(POST_GIVE_BACK_CALENDE, postGiveBack)
}
