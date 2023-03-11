// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import { requestCustom } from 'utils/request';
import request from 'utils/request';

import { API_INCOMMING_DOCUMENT, UPLOAD_APP_URL } from 'config/urlConfig';
import {
  addExecutiveDocumentFail,
  uploadFile,
  uploadFileSuccess,
  addExecutiveDocumentSuccess,
  updateExecutiveDocumentSuccess,
  updateExecutiveDocumentFail,
  deleteExecutiveDocumentSuccess,
  deleteExecutiveDocumentFail,
  deleteExecutiveDocument
} from './actions';
import { ADD_EXECUTIVE_DOCUMENT, UPDATE_EXECUTIVE_DOCUMENT, DELETE_EXECUTIVE_DOCUMENT } from './constants';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { serialize, convertBody } from 'utils/common';
import { clientId } from '../../variable';

export function* executiveDocumentSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data, cb, types } = action;
    let file = data.file
    console.log(file, "file nè", file.length)
    const newData = convertBody(data, 'IncommingDocument');
    const res = yield call(requestCustom, `${API_INCOMMING_DOCUMENT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(newData),
    });
    yield put(uploadFile(true));
    if (res) {
      if (res.name && res._id) {
        // if (res._id) {
        const { files } = yield call(handleUploadAdd, data, res._id);
        console.log(files, "files nè 2")
        if(file && file.length){
          if (files && files.length && files.length === file.length) {
            // đủ file mới cho update
            yield put(uploadFileSuccess(true));
  
            yield call(request, `${API_INCOMMING_DOCUMENT}/${res._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              method: 'PUT',
              body: JSON.stringify({ files }),
            });
          }else {
            // k đủ file so với khi thêm mới 
            // phải xóa cái bản ghi đó đi
            yield put(deleteExecutiveDocument([res._id]));
            
            yield put(addExecutiveDocumentFail({errorData: "Thiếu file trong khi upload"}));
            yield put(changeSnackbar({ variant: 'error', message:  'Thêm mới dữ liệu thất bại', status: true }));
          }
        }
        
      } else {
        if (newData.documentType === 'don-thu') {
          cb && cb(res.letterId);
        } else {
          cb && cb(res._id);
        }
      }
      yield put(uploadFileSuccess(true));
      yield put(addExecutiveDocumentSuccess(res));
      if (!types) {
        yield put(changeSnackbar({ variant: 'success', message: 'Thêm mới dữ liệu thành công', status: true }));
      }

      cb && cb(res._id);
    } else {
      yield put(addExecutiveDocumentFail(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Thêm mới dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    console.log('ThaiError', error);
    let data = {}
    if (error.status === 0)
      data = {
        status: error.status,
        toBookCode: error.toBookCode
      }
    yield put(addExecutiveDocumentFail(data));
    yield put(changeSnackbar({ variant: 'error', message: error.message, status: true }));
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
      task.push(fetch(`${url}&code=${code}&fname=${name}`, head).then(res => res.json()));
    }
    const res = await Promise.all(task);
    const fileInfos = res
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
    //console.log('error', error);
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
    let mname = data.toBookCode;
    let url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&mid=${data._id ? data._id : id}&mname=${mname}`;
    if (firstUploadFile) {
      const firstFileInfo = await getFileData([firstUploadFile], url, 'IncommingDocument', 'root');
      if (abc && abc.length) {
        files = [...files, ...firstFileInfo];
      }
    }
    if (abc && abc.length) {
      const duthaoFileInfo = await getFileData(abc, url, 'IncommingDocument', 'root');
      files = [...files, ...duthaoFileInfo];
    }

    return {
      files,
    };
  } catch (error) {
    //console.log('error', error);
    return {
      files: [],
    };
  }
}
async function handleUploadAdd(data, id) {
  console.log(data, id, "ThaiLog");
  try {
    const { file } = data;
    if (!file)
      return {
        files: [],
      };

    let firstUploadFile = [];
    if (file && file.length >= 0) {
      firstUploadFile = file.pop();
    }
    // console.log(data)
    let mname = data.toBookCode;

    let files = [...(data.file_old || [])];
    let url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&mid=${data._id ? data._id : id}&mname=${mname}`;
    if (firstUploadFile) {
      const firstFileInfo = await getFileData([firstUploadFile], url, 'IncommingDocument', 'root');
      if (firstFileInfo && firstFileInfo.length > 0) {
        files = [...files, ...firstFileInfo];
      }
    }
    if (file && file.length > 0) {
      const duthaoFileInfo = await getFileData(file, url, 'IncommingDocument', 'root');
      files = [...files, ...duthaoFileInfo];
    }
    return {
      files,
    };
  } catch (error) {
    //console.log('error', error);
    return {
      files: [],
    };
  }
}

export function* updateExecutiveDocumentSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data, cb } = action;
    const res = yield call(request, `${API_INCOMMING_DOCUMENT}/${data._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(convertBody(data, 'IncommingDocument')),
    });
    yield put(uploadFile(true));
    if (res && res.status == 1) {
      const { files } = yield call(handleUpload, data);
      if (files && files.length !== 0) {
        yield put(uploadFileSuccess(true));
        yield call(request, `${API_INCOMMING_DOCUMENT}/${data._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify({ files }),
        });
      }
      yield put(updateExecutiveDocumentSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Cập nhật dữ liệu thành công', status: true }));
      yield put(uploadFileSuccess(true));
      cb && cb();
    } else {
      yield put(updateExecutiveDocumentFail(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Cập nhật dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    //console.log(error, 'kk')
    yield put(updateExecutiveDocumentFail(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Cập nhật dữ liệu thất bại', status: true }));
  }
}
export function* deleteExecutiveDocumentSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { ids } = action;
    const res = yield call(request, `${API_INCOMMING_DOCUMENT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify(ids),
    });
    if (res && res.status === 1) {
      yield put(deleteExecutiveDocumentSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Xóa dữ liệu thành công', status: true }));
    } else {
      yield put(deleteExecutiveDocumentFail(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Xóa dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(deleteExecutiveDocumentFail(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Xóa dữ liệu thất bại', status: true }));
  }
}

export default function* executiveDocumentPageSaga() {
  yield takeLatest(ADD_EXECUTIVE_DOCUMENT, executiveDocumentSaga);
  yield takeLatest(UPDATE_EXECUTIVE_DOCUMENT, updateExecutiveDocumentSaga);
  yield takeLatest(DELETE_EXECUTIVE_DOCUMENT, deleteExecutiveDocumentSaga);
}
