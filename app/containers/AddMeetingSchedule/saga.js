import { call, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga'
import { push } from 'react-router-redux';
import { API_MEETING, API_ORIGANIZATION, UPLOAD_APP_URL } from '../../config/urlConfig';
import request from '../../utils/request';

import { postDataSuccess, postDataFailed, getCurrentSuccess, putDataSuccess, putDataFailed, mergeData } from './actions';
import { POST_DATA, GET_CURRENT, PUT_DATA, GET_DATA } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { serialize, convertBody, uploadFile } from 'utils/common';
import { clientId } from '../../variable';

// Individual exports for testing

function* postDataSaga(action) {
  const { data, cb } = action;
  const newData = convertBody(data, 'MeetingCalendar');
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, API_MEETING, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
    if (res.status !== 0) {
      const { files } = yield call(handleUploadAdd, data, res.data._id);
      yield call(request, `${API_MEETING}/${res.data._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ files }),
      });
      yield put(postDataSuccess(res));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(push('/AllCalendar/MeetingCalendar'));
    } else {
      yield put(postDataFailed(res));
      yield put(changeSnackbar({ status: true, message: res.message, variant: 'error' }));
    }
  } catch (error) {
    yield put(postDataFailed());
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

async function getFileData(files, url, code, name) {
  try {
    const task = [];
    for (let i = 0; i < files.length; i += 1) {
      const form = new FormData();
      form.append('fileUpload', files[i]);
      const head = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_03')}`,
        },
        body: form,
      };
      task.push(fetch(`${url}&code=${code}&fname=${name}`, head).then(data => data.json()));
    }
    const data = await Promise.all(task);
    const fileInfos = data
      .map(r => {
        if (r && r.data && r.data[0]) {
          return {
            id: r.data[0]._id,
            name: r.data[0].name,
          };
        }
        return null;
      })
      .filter(r => r);
    return fileInfos;
  } catch (error) {
    return [];
  }
}

async function handleUpload(data, id) {
  try {
    const { abc } = data;
    if (!abc)
      return {
        files: [],
      };
    let firstUploadFile;
    if (abc && abc.length) {
      firstUploadFile = abc.pop();
    }
    let files = [...(data.abc_old || [])];
    let url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&mid=${data._id ? data._id : id}&mname=${data.name}`;
    if (firstUploadFile) {
      const firstFileInfo = await getFileData([firstUploadFile], url, 'MeetingCalendar', 'root');
      if (abc && abc.length) {
        files = [...files, ...firstFileInfo];
      }
    }
    if (abc && abc.length) {
      const duthaoFileInfo = await getFileData(abc, url, 'MeetingCalendar', 'root');
      files = [...files, ...duthaoFileInfo];
    }

    return {
      files,
    };
  } catch (error) {
    return {
      files: [],
    };
  }
}

async function handleUploadAdd(data, id) {
  try {
    const { file } = data;
    if (!file)
      return {
        files: [],
      };
    let firstUploadFile;
    if (file && file.length) {
      firstUploadFile = file.pop();
    }
    let files = [...(data.file_old || [])];
    let url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&mid=${id}&mname=cng-vn%20`;
    if (firstUploadFile) {
      const firstFileInfo = await getFileData([firstUploadFile], url, 'MeetingCalendar', 'root');
      if (file && file.length) {
        files = [...files, ...firstFileInfo];
      }
    }
    if (file && file.length) {
      const duthaoFileInfo = await getFileData(file, url, 'MeetingCalendar', 'root');
      files = [...files, ...duthaoFileInfo];
    }

    return {
      files,
    };
  } catch (error) {
    return {
      files: [],
    };
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
      body: JSON.stringify(action.data),
    });
    data.customer = Array.isArray(data.customer) ? data.customer.map(i => ({ _id: i.customerId, name: i.name })) : [];
    yield put(getCurrentSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy lịch cá nhân thất bại', variant: 'error' }));
  }
}

function* putDataSaga(action) {
  const { data, cb } = action;
  const newData = convertBody(data, 'MeetingCalendar');
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_MEETING}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
    if (res && res.status !== 0) {
      const { files } = yield call(handleUpload, data);
      yield call(request, `${API_MEETING}/${action.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ files }),
      });
      yield put(putDataSuccess(res));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      // if (action.res.callback) action.res.callback(res);
      yield put(push('/AllCalendar/MeetingCalendar'));
      cb && cb();
    } else {
      yield put(putDataFailed(res));
      yield put(changeSnackbar({ status: true, message: res.message, variant: 'error' }));
    }
  } catch (error) {
    yield put(putDataFailed());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
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

export default function* addMeetingScheduleSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(POST_DATA, postDataSaga);
  yield takeEvery(GET_CURRENT, getCurrentSaga);
  yield takeEvery(PUT_DATA, putDataSaga);
  yield takeEvery(GET_DATA, getTasksSaga);
}
