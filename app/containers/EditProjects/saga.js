import { takeLatest, call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
// Individual exports for testing
import {
  API_TASK_PROJECT,
  API_PROGRESS,
  API_TRANFER,
  // UPLOAD_APP_URL,
  UPLOAD_IMG_SINGLE,
  API_CONVERSATION,
  UPLOAD_APP_URL,
  API_TASK_CONFIG,
  API_TEMPLATE,
  API_APPROVE,
  API_USERS,
} from '../../config/urlConfig';
// import lodash from 'lodash';
import { initialState } from './reducer';
import request from '../../utils/request';
import makeSelectaddProject from './selectors';
import { mergeData, putProgressSuccess, postDrive, getDataSuccess, postFileSystem, getProjectCurrent, getEmployeeSuccess, getProjectCurrentSuccess } from './actions';
import {
  POST_PROJECT,
  PUT_PROJECT,
  GET_PROJECT_CURRENT,
  PUT_PROGRESS,
  POST_TRANFER,
  POST_FILE,
  PUT_PROGRESS_SUCCESS,
  PUT_RATIO,
  POST_DRIVE,
  API_INCOMMING_DOCUMENT,
  GET_DATA,
  POST_FILE_SYSTEM,
  POST_APPROVE,
  GET_EMPLOYEE,
  GET_PROJECT_CURRENT_SUCCESS,
} from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { serialize, sortTask, convertRatio, getIncomingDocs, getOutGoingDocs } from '../../helper';
import { clientId } from '../../variable';
import { convertBody } from '../../utils/common';

function* getProjectCurrentSaga(action) {
  try {
    if (action.id === 'add') {
      yield put(mergeData({ ...initialState.toJS(), taskStatus: 1, ...action.data }));
    } else {
      try {
        let dataDocs = []
        let dataDocsOut = []

        const res = getIncomingDocs(action).then(val => {
          dataDocs = val
        })
        const resOut = getOutGoingDocs(action).then(val => {
          dataDocsOut = val
        })
        const checkConversation = yield call(request, `${API_CONVERSATION}/check?id=${action.id}&moduleName=Task`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const hideAddConversation = checkConversation.success;

        const data = yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        let newProject = [data];
        let newEmployeess;
        let projectName = '';
        if (data.projectId) {
          const filter = serialize({ filter: { projectId: data.projectId, status: 1 } });

          const projects = yield call(request, `${API_TASK_PROJECT}/projects?${filter}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const listRatio = convertRatio(projects.data, action.id);
          // console.log(projects);
          data.listRatio = listRatio;
          const listEmployee = yield call(request, `${API_TASK_PROJECT}/getJoins/${data.projectId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          newEmployeess = listEmployee;
          newProject = sortTask(projects.data, [], action.id, true).filter(i => i);
          const dt = yield call(request, `${API_TASK_PROJECT}/${data.projectId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
          projectName = dt.name;
        }
        let docsData = []
        Array.isArray(data.incommingDocuments) && data.incommingDocuments.length > 0 && data.incommingDocuments.forEach(
          item => {
            const newData = dataDocs && dataDocs.length > 0 && dataDocs.find(i => i._id === item)
            if (newData) docsData.push(newData)
          }
        )


        let docsDataOut = []
        Array.isArray(data.outGoingDocuments) && data.outGoingDocuments.length > 0 && data.outGoingDocuments.forEach(
          item => {
            const newData = dataDocsOut && dataDocsOut.length > 0 && dataDocsOut.find(i => i._id === item)
            if (newData) docsDataOut.push(newData)
          }
        )
        const projectData = {
          ...data,
          hasTemplate: data.template,
          projects: newProject,
          idSelect: action.id,
          selectProgress: data.progress,
          selectStatus: data.taskStatus,
          selectPiority: data.piority,
          employees: newEmployeess,
          incommingDocuments: docsData,
          outGoingDocuments: docsDataOut,
          taskAttached: data.taskAttached,
          errorName: false,
          objectAvatar: '',
          parentStatus: data.parentId ? data.parentId.taskStatus : null,
          listInCharge: [...data.inCharge],
          listJoin: [...data.join],
          hideAddConversation,
          projectName,
          errorDescription: false,
        };
        yield put(mergeData(projectData));
        yield put(getProjectCurrentSuccess())
      } catch (err) {
        //console.log(err, 'ffffff')
      }
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    // console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* getProjectUpdated(action) {
  try {
    const data = yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    let newProject = [data];

    if (data.projectId) {
      const filter = serialize({ filter: { projectId: data.projectId, status: 1 } });

      const projects = yield call(request, `${API_TASK_PROJECT}?${filter}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      newProject = sortTask(projects.data, [], action.id, true);
    }

    const projectData = {
      ...data,
      projects: newProject,
      // idSelect: action.id,
      selectProgress: data.progress,
      selectStatus: data.taskStatus,
      selectPiority: data.piority,
      parentStatus: data.parentId ? data.parentId.taskStatus : null,
      reloadProgress: Math.random(),
      reloadApproved: Math.random(),
      reloadHistory: Math.random(),
    };

    yield put(mergeData(projectData));
  } catch (error) {
    // console.log('1', error);
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* postProject(action) {
  const { data, cb } = action;
  const newData = convertBody(data, 'Task');
  const token = localStorage.getItem('token');
  try {
    // if (action.data.objectAvatar) {
    //   const formData = new FormData();
    //   formData.append('file', action.data.avatar);
    //   const url = yield call(request, UPLOAD_IMG_SINGLE, {
    //     method: 'POST',
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     },
    //     body: formData,
    //   });
    //   action.data.avatar = url.url;
    // }

    const res = yield call(request, API_TASK_PROJECT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
    const rest = res.data

    delete newData.__v;
    delete newData.processors;
    if (rest) {
      if (rest.name) {
        const { files } = yield call(handleUploadAdd, data, rest._id);
        yield call(request, `${API_TASK_PROJECT}/${rest._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify({ ...newData, files }),
        });
      } else {
        cb && cb(rest._id);
      }
      cb && cb(rest._id);
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      // if (action.res.callback) action.res.callback(res);
      yield put(push('/Task'));
    }


    if (action.res.isProject === true)
      yield put(postDrive({ name: res.data.name, description: res.data.description, users: res.data.join, state: 3 }));

    // yield put(
    //   postFileSystem({
    //     action: 'read',
    //     path: '/',
    //     showHiddenItems: false,
    //     data: [],
    //   }),
    // );

    if (action.data.callback) {
      action.data.callback(data);
    } else {
      yield put(push('/Task'));
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
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
      const firstFileInfo = await getFileData([firstUploadFile], url, 'Task', 'root');
      if (abc && abc.length) {
        files = [...files, ...firstFileInfo];
      }
    }
    if (abc && abc.length) {
      const duthaoFileInfo = await getFileData(abc, url, 'Task', 'root');
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
    let url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&mid=${data._id ? data._id : id}&mname=${data.name}`;
    if (firstUploadFile) {
      const firstFileInfo = await getFileData([firstUploadFile], url, 'Task', 'root');
      if (file && file.length) {
        files = [...files, ...firstFileInfo];
      }
    }
    if (file && file.length) {
      const duthaoFileInfo = await getFileData(file, url, 'Task', 'root');
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
    //console.log('error', error);
    return [];
  }
}

function* postDriveSaga(action) {
  try {
    yield call(request, `${UPLOAD_APP_URL}/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
      // body: JSON.stringify({ name: data.data.name, description: data.data.description, id: data.data._id }),
    });
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới tủ hồ sơ dự án thất bại', variant: 'error' }));
  }
}

function* putProject(action) {
  const { data, cb } = action;
  const newData = convertBody(data, 'Task');
  const token = localStorage.getItem('token');
  try {
    // if (action.data.objectAvatar) {
    //   const formData = new FormData();
    //   formData.append('file', action.data.avatar);
    //   const url = yield call(request, UPLOAD_IMG_SINGLE, {
    //     method: 'POST',
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     },
    //     body: formData,
    //   });
    //   action.data.avatar = url.url;
    // }
    const res = yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });

    const rest = res.data
    delete newData.__v;
    delete newData.processors;
    if (res && res.taskData && res.taskData.status === 1) {
      const { files } = yield call(handleUpload, data, res.taskData._id);
      yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ ...newData, files }),
      });
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));

      if (action.data.callback) action.data.callback();
      else {
        yield put(mergeData(res));
        yield put(push('/Task'));
      }
    }


    // if (res && res.taskData && res.taskData.status === 1) {
    //   const { files } = yield call(handleUpload, data);
    //   yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       'Content-Type': 'application/json',
    //     },
    //     method: 'PUT',
    //     body: JSON.stringify({ files }),
    //   });
    //   yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    //   // if (action.res.callback) action.res.callback(res);
    //   yield put(mergeData(res));
    //   yield put(push('/Task'));
    //   cb && cb();
    // }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

function* putProgress(action) {
  try {
    const data = yield call(request, `${API_PROGRESS}/${action.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    // console.log('AAA', data);

    if (data) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật tiến độ thành công', variant: 'success' }));
      if (action.data.callback) action.data.callback();
      yield put(putProgressSuccess(action.id));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật tiến độ thất bại', variant: 'error' }));
  }
}
function* postTranfer(action) {
  try {
    yield call(request, `${API_TRANFER}/${action.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(
      mergeData({
        reloadTranfer: Math.random(),
        tranferJoin: [],
        currentJoin: [],
        currentInCharge: [],
        tranferInCharge: [],
      }),
    );

    yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    yield put(getProjectCurrent(action.id, { id: action.id }));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

function* postFileSaga(action) {
  try {
    const formData = new FormData();
    const type = action.data.type.includes('image') ? 'image' : 'doc';
    formData.append('file', action.data);
    const data = yield call(request, UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    const addProject = yield select(makeSelectaddProject());
    const name = addProject.fileTitle;
    const taskId = addProject._id;
    const description = addProject.fileDescription;
    const fileData = {
      name,
      fileName: action.data.name,
      size: action.data.size,
      originFile: action.data.type,
      type,
      taskId,
      description,
      url: data.url,
    };
    const fileUpdload = yield call(request, `${API_TASK_PROJECT}/file/${taskId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileData),
    });
    const files = addProject.files.concat(fileUpdload);
    yield put(mergeData({ files, fileDescription: '', fileTitle: '' }));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

function* putRatioSaga(action) {
  try {
    yield call(request, `${API_TASK_PROJECT}/ratio/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật tỉ lệ thất bại', variant: 'error' }));
  }
}

function* getDataSaga() {
  try {
    let configs;
    const data = yield call(request, API_TASK_CONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const templates = yield call(request, `${API_TEMPLATE}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (data) configs = data.find(item => item.code === 'TASKTYPE').data;

    const templatesItem = templates ? templates.filter(elm => elm.moduleCode === 'Task') : [];

    yield put(getDataSuccess(configs, templatesItem));
  } catch (err) {
    // console.log('222', err);
    yield put(changeSnackbar({ status: true, message: 'Lấy cấu hình công việc thất bại', variant: 'error' }));
  }
}

function* postFileSystemSaga(action) {
  try {
    yield call(request, `${UPLOAD_APP_URL}/file-system/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới tủ hồ sơ dự án thất bại', variant: 'error' }));
  }
}

function* postApproveSaga(action) {
  try {
    yield call(request, API_APPROVE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ status: true, message: 'Tạo phê duyệt thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Tạo phê duyệt thất bại', variant: 'error' }));
  }
}
export function* getEmployee() {
  try {
    const data = yield call(request, API_USERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (data) {
      yield put(getEmployeeSuccess(data.data));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy nhân viên thất bại', variant: 'error' }));
  }
}

export default function* addProjectsSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_PROJECT, postProject);
  yield takeLatest(POST_FILE, postFileSaga);
  yield takeLatest(GET_PROJECT_CURRENT, getProjectCurrentSaga);
  yield takeLatest(PUT_PROGRESS_SUCCESS, getProjectUpdated);
  yield takeLatest(GET_EMPLOYEE, getEmployee);

  yield takeLatest(PUT_PROJECT, putProject);
  yield takeLatest(PUT_PROGRESS, putProgress);
  yield takeLatest(POST_TRANFER, postTranfer);
  yield takeLatest(PUT_RATIO, putRatioSaga);
  yield takeLatest(POST_DRIVE, postDriveSaga);
  yield takeLatest(GET_DATA, getDataSaga);
  yield takeLatest(POST_FILE_SYSTEM, postFileSystemSaga);
  yield takeLatest(POST_APPROVE, postApproveSaga);
}
