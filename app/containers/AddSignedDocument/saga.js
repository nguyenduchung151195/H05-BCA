import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_GOING_DOCUMENT, UPLOAD_APP_URL } from 'config/urlConfig';
import {
  addSignedDocumentFail,
  uploadFile, uploadFileSuccess,
  addSignedDocumentSuccess,
  updateSignedDocumentSuccess,
  updateSignedDocumentFail,
  deleteSignedDocumentSuccess,
  deleteSignedDocumentFail,
} from './actions';
import { ADD_SIGNED_DOCUMENT, UPDATE_SIGNED_DOCUMENT, DELETE_SIGNED_DOCUMENT } from './constants';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { serialize, convertBody, uploadFileGo } from 'utils/common';
import { clientId } from '../../variable';

export function* signedDocumentSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data, cb } = action;
    const res = yield call(request, `${API_GOING_DOCUMENT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(convertBody(data, 'OutGoingDocument')),
    });
    yield put(uploadFile(true))
    if (res) {
      const { files, docFiles, listFiles } = yield call(handleUploadAdd, data, res._id);
      if (files || docFiles || listFiles) {
        yield put(uploadFileSuccess(true));
      }
      yield call(request, `${API_GOING_DOCUMENT}/update/${res._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ files, docFiles, listFiles }),
      });
      cb && cb(res._id);
      yield put(addSignedDocumentSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Thêm mới dữ liệu thành công', status: true }));
    } else {
      yield put(addSignedDocumentFail(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Thêm mới dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(addSignedDocumentFail(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Thêm mới dữ liệu thất bại', status: true }));
  }
}

async function getFileData(files, url, code, name, type) {
  try {
    const task = [];
    for (let i = 0; i < files.length; i += 1) {
      const form = new FormData();
      form.append('fileUpload', files[i]);
      if (name === 'duthao' || name === 'totrinh') form.append('version', 'upload')
      const head = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_03')}`,
        },
        body: form,
      };
      task.push(fetch(`${url}&code=${code}&fname=${name}&ftype=${type}`, head).then(res => res.json()));
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
    return [];
  }
}

async function handleUploadAdd(data, id) {
  try {
    const { file, fileDocument, duthao, fileList } = data;
    let number = 0
    if (!fileDocument && !file && !fileList)
      return {
        files: [],
        docFiles: [],
        listFiles: [],
      };
    let firstUploadFile;
    if (fileDocument && fileDocument.length) {
      number += 1
      firstUploadFile = fileDocument.pop();
    }
    // if (fileList && fileList.length) {
    //   number -= 10
    //   firstUploadFile = fileList.pop();
    // }
    if (duthao && duthao.length) {
      number += 1
      firstUploadFile = duthao.pop();
    }
    if (!firstUploadFile && file.length > 0) {
      firstUploadFile = file.pop();
    }
    if (!firstUploadFile && fileList.length > 0) {
      number = -10
      firstUploadFile = fileList.pop();
    }

    let files = [...(data.file_old || [])];
    let docFiles = [...(data.fileDocument_old || data.duthao_old || [])];
    let listFiles = [...(data.fileList_old || [])];
    let url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&mid=${data._id ? data._id : id}&mname=${data.documentType && data.documentType.value} `;
    if (firstUploadFile) {
      const fname = number !== 0 ? (number > 0 ? 'duthao' : 'totrinh') : 'file'
      const firstFileInfo = await getFileData([firstUploadFile], url, 'OutGoingDocument', fname, 1);
      if (fileDocument && fileDocument.length) {
        docFiles = [...docFiles, ...firstFileInfo];
      } else {
        files = [...files, ...firstFileInfo];
        listFiles = [...listFiles];
      }
      // if (fileList && fileList.length) {
      //   listFiles = [...listFiles, ...firstFileInfo];
      // } else {
      //   files = [...files, ...firstFileInfo];
      //   docFiles = [...docFiles, ...firstFileInfo];
      // }
      if (duthao && duthao.length) {
        docFiles = [...docFiles, ...firstFileInfo];
      } else {
        files = [...files, ...firstFileInfo];
        listFiles = [...listFiles];
      }
    }
    if (fileList && fileList.length) {
      const listFileInfo = await getFileData(fileList, url, 'OutGoingDocument-fileLists', 'totrinh', 1);
      listFiles = [...listFiles, ...listFileInfo];
    }
    if (fileDocument && fileDocument.length) {
      const duthaoFileInfo = await getFileData(fileDocument, url, 'OutGoingDocument-fileDocs', 'duthao', 1);
      docFiles = [...docFiles, ...duthaoFileInfo];
    }
    if (duthao && duthao.length) {
      const duthaoFileInfo = await getFileData(fileDocument, url, 'OutGoingDocument-fileDocs', 'duthao', 1);
      docFiles = [...docFiles, ...duthaoFileInfo];
    }
    if (file && file.length) {
      const fileInfo = await getFileData(file, url, 'OutGoingDocument-files', 'file', 1);
      files = [...files, ...fileInfo];
    }
    return {
      files,
      docFiles,
      listFiles
    };
  } catch (error) {
    return {
      files: [],
      docFiles: [],
      listFiles: [],
    };
  }
}
async function handleUpload(data, id) {
  try {
    const { duthao, file = [], totrinh = [] } = data;
    let number = 0
    console.log(data, 'data')
    console.log(!duthao && !file && !totrinh, "!duthao && !file && !totrinh")
    console.log(!duthao && file && !file.length && totrinh && !totrinh.length, "!duthao && !file && !totrinh")

    if ((!duthao && !file && !totrinh) || (!duthao && file && !file.length && totrinh && !totrinh.length)) {
      return {
        files: data.files,
        docFiles: data.docFiles,
        // listFiles: data.totrinh ,
        listFiles: data.listFiles,

      };
    }
    let firstUploadFile;
    if (duthao && duthao.length) {
      number += 1
      firstUploadFile = duthao.pop();
    }
    if (!firstUploadFile && file.length) {
      firstUploadFile = file.pop();
    }
    if (!firstUploadFile && totrinh.length) {
      number = -10
      firstUploadFile = totrinh.pop();
    }
    let files = [...(data.file_old || [])];
    let docFiles = [...(data.duthao_old || [])];
    let listFiles = [...(data.totrinh_old || [])];
    let url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&mid=${data.originId ? data.originId : id}&mname=${data.documentType && data.documentType.value}`;
    console.log(firstUploadFile, 'firstUploadFile')
    if (firstUploadFile) {
      const fname = number !== 0 ? (number > 0 ? 'duthao' : 'totrinh') : 'file'
      const firstFileInfo = await getFileData([firstUploadFile], url, 'OutGoingDocument', fname, 1);
      console.log(number, fname, "number")
      if (duthao && duthao.length) {
        docFiles = [...docFiles, ...firstFileInfo];
      } else {
        if (fname === 'duthao') {
          docFiles = [...docFiles, ...firstFileInfo];
        } else
          listFiles = [...listFiles, ...firstFileInfo];
        files = [...files, ...firstFileInfo];
      }
    }
    if (duthao && duthao.length) {
      const duthaoFileInfo = await getFileData(duthao, url, 'OutGoingDocument-fileDocs', 'duthao', 1);
      docFiles = [...docFiles, ...duthaoFileInfo];
    }
    if (totrinh && totrinh.length) {
      const listFileInfo = await getFileData(totrinh, url, 'OutGoingDocument-fileLists', 'totrinh', 1);
      console.log(listFileInfo, "listFileInfo")

      listFiles = [...listFiles, ...listFileInfo];
    }
    if (file && file.length) {
      const fileInfo = await getFileData(file, url, 'OutGoingDocument-files', 'file', 1);
      files = [...files, ...fileInfo];
    }
    return {
      files,
      docFiles,
      listFiles,
    };
  } catch (error) {
    //console.log('error', error);
    return {
      files: [],
      docFiles: [],
      listFiles: [],
    };
  }
}

export function* updateSignedDocumentSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const { data, cb } = action;
    yield put(uploadFile(true))
    const { files, docFiles, listFiles } = yield call(handleUpload, data);
    if (files || docFiles || listFiles) {
      yield put(uploadFileSuccess(true))
    }
    let convertedBody = convertBody(data, 'OutGoingDocument');
    // convertedBody.files = files;
    // convertedBody.docFiles = docFiles ;
    // convertedBody.docFiles = listFiles;
    convertedBody = {
      ...convertedBody,
      files: files || [],
      docFiles: docFiles || [],
      listFiles: listFiles || []
    }
    console.log(convertedBody, "njfdnj")
    const res = yield call(request, `${API_GOING_DOCUMENT}/${data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(convertedBody),
    });
    if (res) {
      yield put(uploadFileSuccess(true))
      cb && cb(res._id);
      yield put(updateSignedDocumentSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Cập nhật dữ liệu thành công', status: true }));
    } else {
      yield put(updateSignedDocumentFail(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Cập nhật dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(updateSignedDocumentFail(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Cập nhật dữ liệu thất bại', status: true }));
  }
}
export function* deleteSignedDocumentSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { ids } = action;
    const res = yield call(request, `${API_GOING_DOCUMENT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify(ids),
    });
    if (res && res.status === 1) {
      yield put(deleteSignedDocumentSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Xóa dữ liệu thành công', status: true }));
    } else {
      yield put(deleteSignedDocumentFail(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Xóa dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(deleteSignedDocumentFail(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Xóa dữ liệu thất bại', status: true }));
  }
}

export default function* signedDocumentPageSaga() {
  yield takeLatest(ADD_SIGNED_DOCUMENT, signedDocumentSaga);
  yield takeLatest(UPDATE_SIGNED_DOCUMENT, updateSignedDocumentSaga);
  yield takeLatest(DELETE_SIGNED_DOCUMENT, deleteSignedDocumentSaga);
}