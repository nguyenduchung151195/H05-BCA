/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  TableBody,
  Checkbox,
  Grid,
  Tooltip,
  Link,
  DialogTitle,
  Dialog as Dialogg,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  MenuItem,
  Typography,
} from '@material-ui/core';
import {
  Delete,
  CloudUpload,
  Folder,
  Add,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Visibility,
  CloudDownload,
  Edit,
  FlipToBack,
  CropOriginal,
  ExpandMore,
  ExpandLess,
  FormatListBulleted,
  VerticalSplit,
  AttachFile as AttachFileIcon,
  Scanner,
  BorderColor,
  FormatColorText,
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Dialog } from '.';
import { fetchData, isArray } from '../../helper';
import {
  UPLOAD_APP_URL,
  APP_URL,
  HRM_UPLOAD_AVATAR,
  API_UPLOAD_IMAGE_AI,
  UPLOAD_FILE_METADATA,
  API_UPLOAD_SINGLE,
  API_DOWNLOAD_SCAN_DOC,
  API_WORD_ADDON_UPLOAD,
  API_DOWNLOAD_SIGN_DIGITAL,
} from '../../config/urlConfig';
import { clientId, allowedFileExts } from '../../variable';
import { Loading } from 'components/LifetekUi';
import CircularProgress from '@material-ui/core/CircularProgress';

import moment from 'moment';
import CustomGroupInputField from '../Input/CustomGroupInputField';
import Snackbar from 'components/Snackbar';
import XLSX from 'xlsx';
import _ from 'lodash';
import { toDataUrl, closeWebsocket } from 'utils/common';
import { sign_file, sign_pdf } from 'utils/vgca';
import request from '../../utils/request';
import axios from 'axios';
import { getDevice, scan } from '../../utils/api/scanners';
import ScanDialog from 'components/ScanDoc/ScanDialog';
import { getFilename } from '../../utils/api/file';
import { connectWordAddIn, statusWordAddIn } from '../../utils/api/wordAddIn';
import { insertTextToPdf } from '../../utils/api/outgoingdocument';
import { updateApostropheStatus, updateSignStatus } from '../../utils/api/outgoingdocument';
import ReleaseNoLocation from './components/ReleaseNoLocation';

const SheetJSFT = allowedFileExts.join(',');

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  tableCell: {
    padding: '4px 20px',
    textWrap: 'wrap',
    borderBottom: '1px solid #e0e0e ',
    // width: '25%',
    width: 'auto',
  },
  txtRight: {
    textAlign: 'right',
  },
});

function downloadFile(url, fileName) {
  console.log(url, 'url');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(this.response);
    const tag = document.createElement('a');
    tag.href = imageUrl;
    tag.download = fileName && fileName.toLowerCase();
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.send();
}

function FileUpload({
  code,
  id,
  hiddenPadding,
  classes,
  disableWhenApproved,
  taskId,
  size,
  isCreator,
  newWay,
  onChangeFile,
  file = [],
  employee,
  viewOnly,
  reload,
  disableEdit,
  onDeleteFile,
  isDetail = false,
  name,
  disableDelete,
  view = false,
  nameBtn,
  onReceiveFile,
  editFile,
  addFile,
  addFileText,
  addFileSuccess,
  updateFile,
  addVersion,
  draft,
  profile,
  getShowFile,
  getAllFile,
  signed,
  deleteSigned,
  checkDisableEditTask,
  dataCheckTask,
  checkTabs,
  onUpdateSignFile,
  onChangeSnackbar,
  addTextToFile,
  forceUpload,
  scanOnly,
  canAssess,
  moreButton,
  template,
  onUpdateFileSuccess,
  previewToBook,
  checkbox,
  docOnly,
  allowSignApostropher,
  deleteFile,
  status = false,
  iconButton = true,
  onUpdateSetting,
  svbText,
  currentRole,
  isAuthory = false,
  canChangeFile = false,
  statusButton2,
  canScan = false,
  setListFile,
  resetTab = false,
}) {
  const [files, setFiles] = React.useState([]);
  const [isFileDelete, setIsFileDelete] = React.useState({});

  const [newFiles, setNewsFiles] = useState([]);
  const [previewHtml, setPreviewHtml] = useState();
  const [docFile, setDocFile] = useState();
  let show = document.getElementById('show');
  let container = document.getElementById('docx-container');
  const [list, setList] = React.useState([]);
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [loadingFile, setloadingFile] = React.useState(false);
  const [loadingEditFile, setLoadingEditFile] = React.useState(false);

  const [state, setState] = React.useState({
    display: false,
    select: null,
    type: 0,
    name: 'root',
    dialog: false,
    img: false,
    dialogtext: false,
    type: '',
  });
  const [parentFolder, setParentFolder] = React.useState(name);
  const [localState, setLocalState] = React.useState({
    others: {},
  });
  const [fileId, setFileId] = React.useState(null);
  const [canShowModal, setCanShowModal] = React.useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    variant: 'success',
    message: '',
  });
  const [addFileDialog, setAddFileDialog] = React.useState(false);
  const [addFileData, setAddFileData] = React.useState();
  const [docData, setDocData] = useState(null);
  const [statusIconButton, setStatusIconButton] = useState(iconButton);
  const [statusButton, setStatusButton] = useState(statusButton2);
  const [scanDialog, setScanDialog] = useState();
  const [signing, setSigning] = useState();
  const [existWordAddIn, setExistWordAddIn] = useState();
  const [checked, setChecked] = useState({});

  const fileRef = useRef();
  const isEditFileRef = useRef();
  const editFileRef = useRef();
  const addFileDialogRef = useRef();
  const signingRef = useRef();
  const files_key = useRef({});
  const tmpNewFiles = useRef(newFiles);
  const allFilesRef = useRef([]);
  // const roleTo = isAuthory ? (
  //   template &&
  //   Array.isArray(template) &&
  //   template.length > 0 &&
  //   template[0].children &&
  //   template[0].children.find(item => item.code === currentRole)
  // ) :
  //   (template &&
  //     Array.isArray(template) &&
  //     template.length > 0 &&
  //     template[0].children &&
  //     template[0].children.find(item => item.code === profile.roleGroupSource))
  const roleTo = isAuthory
    ? template && Array.isArray(template) && template.length > 0 && template.find(item => item.code === currentRole)
    : template && Array.isArray(template) && template.length > 0 && template.find(item => item.code === profile.roleGroupSource);

  useEffect(
    () => {
      const func = async event => {
        if (!Object.keys(files_key).length) return;
        try {
          const url = event.detail.data.aaa || event.detail.data.path || event.detail.data.url;
          const res = await getFilename(url.split('/').pop());
          if (res) {
            const key = res.filename.split('_')[0];
            const oldFile = files_key.current[key];
            if (oldFile && res.name.includes(oldFile.name.split('.').pop())) {
              let name = oldFile.name;
              toDataUrl(url, name, function(file) {
                onReceiveFile
                  ? onReceiveFile({ oldFile, newFile: file, _id: oldFile._id })
                  : setState({ oldFile, newFile: file, newFileDialog: true });
              });
            }
          }
        } catch (e) {}
      };

      let vbSocket;
      if (draft === 'vanbanduthao' || draft === 'vanbantotrinh') {
        window.addEventListener('file-message', func);
        vbSocket = connectWordAddIn({
          onReconnect: e => (vbSocket = e),
          onGetMessage: async e => {
            const { FileName: filename, Data: base64 } = e;
            const key = filename.split('_')[0];
            const oldFile = files_key.current[key];
            if (oldFile) {
              let name = oldFile.name;
              const url = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
              toDataUrl(url, name, function(file) {
                onReceiveFile
                  ? onReceiveFile({ oldFile, newFile: file, _id: oldFile._id })
                  : setState({ oldFile, newFile: file, newFileDialog: true });
              });
            }
          },
        });
      }

      return () => {
        if (draft === 'vanbanduthao') window.removeEventListener('file-message', func);
        closeWebsocket(vbSocket);
      };
    },
    [newFiles],
  );

  useEffect(() => {
    const func = async event => {
      if (!Object.keys(files_key).length) return;
      try {
        const url = event.detail.data.aaa || event.detail.data.path || event.detail.data.url;
        const res = await getFilename(url.split('/').pop());
        if (res) {
          const key = res.filename.split('_')[0];
          const oldFile = files_key.current[key];
          if (oldFile && res.name.includes(oldFile.name.split('.').pop())) {
            let name = oldFile.name;
            toDataUrl(url, name, function(file) {
              onReceiveFile ? onReceiveFile({ oldFile, newFile: file, _id: oldFile._id }) : setState({ oldFile, newFile: file, newFileDialog: true });
            });
          }
        }
      } catch (e) {}
    };

    let vbSocket;
    if (draft === 'vanbanduthao') {
      window.addEventListener('file-message', func);
      vbSocket = connectWordAddIn({
        onReconnect: e => (vbSocket = e),
        onGetMessage: async e => {
          const { FileName: filename, Data: base64 } = e;
          const key = filename.split('_')[0];
          const oldFile = files_key.current[key];
          if (oldFile) {
            let name = oldFile.name;
            const url = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
            toDataUrl(url, name, function(file) {
              onReceiveFile ? onReceiveFile({ oldFile, newFile: file, _id: oldFile._id }) : setState({ oldFile, newFile: file, newFileDialog: true });
            });
          }
        },
      });
    }

    return () => {
      if (draft === 'vanbanduthao') window.removeEventListener('file-message', func);
      closeWebsocket(vbSocket);
    };
  }, []);
  useEffect(
    () => {
      if (id === 'add') {
        fileRef.current = file;
        setFiles(file);
      }
    },
    [file],
  );

  useEffect(
    () => {
      getShowFile && Array.isArray(files) && getShowFile([...files]);
    },
    [files],
  );

  useEffect(
    () => {
      if (addFile && !addFileDialogRef.current) {
        setAddFileDialog(true);
        setAddFileData(addFile);
      } else {
        setAddFileDialog(false);
      }
    },
    [addFile],
  );

  useEffect(
    () => {
      addFileDialogRef.current = addFileDialog;
    },
    [addFileDialog],
  );

  useEffect(
    () => {
      onChangeFile && onChangeFile(files, newFiles, name);
    },
    [newFiles, files],
  );

  useEffect(
    () => {
      const func = async () => {
        if (updateFile) {
          isEditFileRef.current = false;
          const { oldFile, newFile } = updateFile;
          const file = {
            target: {
              files: [
                new File([newFile], oldFile.name, {
                  type: newFile.type,
                  lastModified: newFile.lastModified,
                }),
              ],
            },
          };
          // newWay ? uploadManyFileNew(file, name) :
          await uploadManyFile(file, name, 'isUpdate', { changeId: updateFile._id, isReturn: true });
          // onUpdateFileSuccess && onUpdateFileSuccess()
        }
      };

      func();
    },
    [updateFile],
  );

  useEffect(
    () => {
      let interval;

      const test = () => {
        statusWordAddIn({
          onGetMessage: e => {
            setExistWordAddIn(true);
            interval && clearInterval(interval);
          },
        });
      };

      if (editFile && !existWordAddIn) {
        test();
        interval = setInterval(test, 3000);
      }

      return () => {
        if (interval) clearInterval(interval);
      };
    },
    [editFile, existWordAddIn],
  );
  // const []
  // const [fileUpload, setFileUpload] = React.useState(null);

  const downloadFileAdd = async (file, fileName) => {
    let url = file && (await convertFileToUrl(file));
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = fileName && fileName.toLowerCase();
    a.click();
  };

  const signPDF = async (url, filename, fileId) => {
    const onSave = async res => {
      if (res) {
        const { FileServer } = JSON.parse(res);
        if (FileServer) {
          let blob = await fetch(FileServer);
          blob = await blob.blob();

          const file = new File([blob], filename);
          const newFile = { target: { files: [file] } };
          // if (newWay) await uploadManyFileNew(newFile, name).then(() => onUpdateSignFile && onUpdateSignFile()) else
          if (allowSignApostropher) await updateApostropheStatus(id);
          else await updateSignStatus(id);
          await uploadManyFile(newFile, name).then(() => onUpdateSignFile && onUpdateSignFile());
        } else onChangeSnackbar && onChangeSnackbar({ status: true, message: 'Có lỗi xảy ra', variant: 'error' });
      }
    };

    sign_file('', url, onSave);
  };
  function downloadDocx(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      // Others
      var a = document.createElement('a'),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }
  const signFile = async (file, fileName) => {
    if (signingRef.current) return;
    signingRef.current = true;
    setSigning(true);
    try {
      let url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
      let newName = fileName.split('.');
      newName.pop();
      newName = newName.join();
      newName = allowSignApostropher ? `${newName}_quoted.pdf` : `${newName}_signed.pdf`;

      if (file.type === '.pdf') signPDF(url, newName, file._id);
      else if (file.type === '.docx' || file.type === '.doc') {
        let blob = await fetch(url);
        blob = await blob.blob();

        const data = new File([blob], fileName);
        const formData = new FormData();
        formData.append('file', data);
        const uploadRes = await fetch(`${API_UPLOAD_SINGLE}`, {
          method: 'POST',
          body: formData,
        });
        const uploadUrl = await uploadRes.json();
        let newUrl = uploadUrl.url;
        const fileId = newUrl.split('/').pop();

        const json = await fetch(`${UPLOAD_APP_URL}/files/convert-docx-to-pdf`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token_03')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileIds: [fileId],
            replace: true,
            waiting: true,
          }),
        });
        await json.json();
        signPDF(newUrl, newName, file._id);
      }
    } catch (error) {
      onChangeSnackbar && onChangeSnackbar({ status: true, message: 'Có lỗi xảy ra', variant: 'error' });
    }
    signingRef.current = false;
    setTimeout(() => setSigning(false), 3000);
  };

  const displayFileExcel = async f => {
    let reader = new FileReader();
    let file;
    await fetch(f).then(async response => (file = await response.blob()));
    reader.readAsArrayBuffer(file);
    reader.onload = function(e) {
      var data = new Uint8Array(reader.result);

      var wb = XLSX.read(data, { type: 'array' });
      var htmlstr = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]], { editable: true }).replace('<table', '<table id="table" border="1"');
      if (htmlstr) {
        htmlstr = htmlstr.replace(
          '</head>',
          `<style>
          table, td, tr {
            border: 1px solid gray;
            font-family: 'roboto',
          }
        </style></head>`,
        );
        // htmlstr = htmlstr.replace('</body></html>', '');

        setPreviewHtml(htmlstr);
      }
    };
  };

  async function getFiles() {
    try {
      if (!code || !id || id === 'add') return;
      const url = `${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=${code}&id=${taskId || id}`;
      const result = await fetchData(url, 'GET', null, 'token_03');
      let datas = [];
      const midPath = result.find(i => i.mid);
      if (midPath) {
        const listFiles = result.filter(i => i.parentPath === midPath.fullPath && !i.isFile);
        if (listFiles.length) setList(listFiles);
      }
      if (name !== 'duthao' && name !== 'file' && name !== 'totrinh') {
        const newRs = result.filter(i => i.isFile);
        newRs.forEach(item => {
          const data = {
            id: item._id,
            name: item.name,
          };
          datas.push(data);
        });
        if (isArray(result)) {
          let listFile = [];
          listFile = result.filter(i => i.isFile);
          if (name === 'abc') {
            if (code && code.split('-')[0] === 'IncommingDocument') {
              listFile = listFile.filter(e => !e.version);
              if (listFile.length === 0) {
                listFile = result.filter(i => i.isFile);
              } else listFile;
            } else listFile;
            if (Array.isArray(listFile) && listFile.length > 1)
              setFiles(
                listFile.sort(function(a, b) {
                  return moment(b.updatedAt).diff(moment(a.updatedAt), 'seconds');
                }),
              );
            else setFiles(listFile);
          } else {
            if (code && code.split('-')[0] === 'IncommingDocument') {
              listFile = listFile.filter(e => e.version === 'upload' || e.version === 'update' || e.version === 'root');
              if (listFile.length === 0) {
                listFile = result.filter(i => i.isFile);
              } else listFile;
            } else listFile;
            if (Array.isArray(listFile) && listFile.length > 1)
              setFiles(
                listFile.sort(function(a, b) {
                  return moment(b.updatedAt).diff(moment(a.updatedAt), 'seconds');
                }),
              );
            else setFiles(listFile);
          }
        }
      }
      if (name === 'duthao' || name === 'file' || name === 'totrinh') {
        let newRs = [];
        result.filter(i => {
          //  i.isFile && i.fullPath.includes(name)
          // if (i.isFile && (i.fullPath.slice(0, (i.fullPath.length - (i.nameRoot + i.type).length - 1))).includes(name)) {
          if (i.isFile && i.parentPath && i.parentPath.includes(name)) {
            newRs.push(i);
          }
        });
        newRs.forEach(item => {
          const data = {
            id: item._id,
            name: item.name,
          };
          datas.push(data);
        });

        let finalFile = newRs.filter(i => i.isFile && i.fullPath.includes(name));
        // let finalFile = result.filter(i => i.isFile && i.fullPath.includes(name) && !i.coppyTo)
        getAllFile && getAllFile([...finalFile]);
        // allFilesRef.current = [...finalFile]

        if (draft === 'vanbanduthao') finalFile = finalFile.filter(e => e.version !== 'upload' && e.version !== 'update' && e.version !== 'root');
        else if (draft === 'phienbanduthao')
          finalFile = finalFile.filter(e => e.version === 'upload' || e.version === 'update' || e.version === 'root');
        else if (draft === 'phienbantotrinh')
          finalFile = finalFile.filter(e => e.version === 'upload' || e.version === 'update' || e.version === 'root');
        else finalFile = finalFile.filter(i => !i.coppyTo);

        if (docOnly) {
          finalFile = finalFile.filter(file => ['.doc', '.docx', '.pdf'].includes(file.type));
        }

        if (isArray(result)) {
          if (Array.isArray(finalFile) && finalFile.length > 1)
            setFiles(
              finalFile.sort(function(a, b) {
                return moment(b.updatedAt).diff(moment(a.updatedAt), 'seconds');
              }),
            );
          else setFiles(finalFile);
        }
        setListFile && setListFile(finalFile);
      }
      onChangeFile && onChangeFile({ [name]: newFiles, [`${name}_old`]: datas });
    } catch (error) {}
  }

  async function getProjectTree() {
    try {
      if (!code || !id || id === 'add' || !taskId || id === taskId) return;
      const url = `${APP_URL}/api/tasks/getProjectTree?projectId=${id}&taskId=${taskId}`;
      const result = await fetchData(url, 'GET', null, 'token');

      if (result && result.status && result.data && result.data.parentTaskNames && result.data.parentTaskNames.length) {
        setParentFolder(result.data.parentTaskNames.join('/'));
      }
    } catch (error) {}
  }
  async function deleteFile(id, name) {
    const answer = confirm('Đồng chí có chắc chắc muốn xóa file này không?');
    if (!answer) return;
    try {
      let url;
      // if(name !== 'duthao' && name !=='file'){
      //    url = `${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=${code}&id=${id}`;
      // }
      // if(name === 'duthao'){
      //    url = `${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=${code}&id=${id}`;
      // }
      // if(name === 'file'){
      //    url = `${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=${code}&id=${id}`;
      // }
      url = `${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=${code}&id=${id}`;
      await fetchData(url, 'DELETE', { id }, 'token_03');
      await getFiles();
    } catch (error) {}
  }
  function deleteNewFile(index, name) {
    try {
      const fileNew = newFiles;
      fileNew.splice(index, 1);
      const newArr = [...fileNew];
      setNewsFiles(newArr);
    } catch (error) {}
  }

  // async function openFolder(){
  //   await fetchData(url, 'DELETE', { id }, 'token_03');
  // }

  const uploadManyFileNew = (e, name) => {
    const allFiles = tmpNewFiles.current;
    allFiles.push(e.target.files[0]);
    const newArr = [...allFiles];
    let body = [];
    files.forEach(item => {
      const data = {
        id: item._id,
        name: item.name,
      };
      body.push(data);
    });
    onChangeFile && onChangeFile({ [`${name}`]: newArr, [`${name}_old`]: body });
    setNewsFiles(newArr);
  };

  const uploadManyFile = async (e, name, type, rest = {}) => {
    if (!code || !id || !name || id === 'add') return;
    let filesInput = [...e.target.files];
    if (filesInput) {
      await Promise.all(
        filesInput.map(async file => {
          const form = new FormData();
          let exts = file.name.split('.');
          const ext = exts[exts.length - 1];
          if (allowedFileExts.indexOf(`.${ext}`) === -1) return;
          form.append('fileUpload', file);
          let fname = state.name;
          let ftype = state.type;
          // if (code === 'Task' && taskId && state.select === null && id !== taskId) {
          //   fname = parentFolder;
          //   ftype = 1;
          // }
          let url;
          if (name !== 'duthao' && name !== 'file' && name !== 'totrinh') {
            url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=${code}&mid=${id}&mname=${name}&fname=${fname}&ftype=${ftype}&childTaskId=${taskId}`;
          }
          if (name === 'duthao' || name === 'totrinh') {
            url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=${code}&mid=${id}&mname=${name}&fname=${name}&ftype=1&childTaskId=${taskId}`;
            if (type === 'isUpdate') {
              url = url + `&isUpdate=${true}`;
              form.append('version', 'update');
            }
            if (rest.changeId) form.append('id', rest.changeId);
            if (type === 'addVersion') form.append('version', addVersion);
            profile && form.append('fullName', profile.name);
            profile && form.append('currentName', profile.username);
            profile && form.append('currentType', draft);
          }
          if (name === 'file') {
            url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=${code}&mid=${id}&mname=${name}&fname=${name}&ftype=1&childTaskId=${taskId}`;
          }

          if (rest.isReturn) {
            let found, hadDoc;
            allFilesRef.current.filter(e => e.version === 'upload' || e.version === 'update' || e.version === 'root').forEach(e => {
              if (e.coppyTo === rest.changeId) {
                if (!found) found = e;
                if (moment(found.updatedAt).isBefore(moment(e.updatedAt))) found = e;
                if (e.username === profile.username) hadDoc = true;
              }
            });
            if (hadDoc && found && found.username !== profile.username) url = `${url}&isReturn=true`;
          }

          const head = {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token_03')}`,
            },
            body: form,
          };
          if (canShowModal) {
            setState({ ...state, dialogtext: true });
          } else {
            setState({ ...state, dialogtext: false });
          }

          const res = await fetch(url, head);
          if (res) {
            setLoadingEditFile(false);
            res.json().then(response => {
              if (response && response.success && response.data && response.data[0]) {
                setFileId(response.data[0]._id);
              }
            });
          } else {
            setLoadingEditFile(false);
          }

          return await getFiles();
        }),
      );
    }
  };

  useEffect(
    () => {
      getFiles();
      getProjectTree();
      try {
        const view = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === code);
        const fileColumns = view.listDisplay.type.fields.type.fileColumns;
        if (fileColumns && fileColumns.length) {
          setCanShowModal(true);
        }
      } catch (error) {}
    },
    [code, name, id],
  );

  useEffect(
    () => {
      if (!isNaN(reload)) {
        getFiles();
      }
    },
    [reload],
  );

  const handleCheck = (item, index) => {
    // debugger;
    let newSelect;
    if (state.select === index) {
      newSelect = null;
    } else {
      newSelect = index;
    }
    if (index === 0) {
      setState({ ...state, select: newSelect, type: 0 });
    } else {
      setState({ ...state, select: newSelect, type: 1, name: item.name });
    }
  };

  function dialogSave() {
    setState({ ...state, dialogtext: false });

    const body = {
      id: fileId,
      model: 'FileManager',
      metaData: {
        others: localState.others,
      },
    };
    onCreateApprove(body);
  }

  function onCreateApprove(body) {
    fetch(UPLOAD_FILE_METADATA, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(() => {
        setSnackbar({ open: true, message: 'Thêm flle thành công', variant: 'success' });
      })
      .catch(() => {
        setSnackbar({ open: false, message: 'Thêm file thất bại', variant: 'error' });
      });
  }

  const handleList = e => {};
  const handleClose = () => {
    setState({ ...state, dialog: false, type: '' });
    setPreviewHtml();
  };

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handlePdf = async (url, type) => {
    console.log(url, 'url');
    let blob = url && (await fetch(url).then(async data => await data.blob()));
    let typeFile = 'application/pdf';

    var file = new Blob([blob], { type: typeFile });
    var fileURL = URL.createObjectURL(file);
    console.log(fileURL, 'fileURL');
    return fileURL;
  };
  const handleConvertDocLikePdf = async (url, type) => {
    setloadingFile(true);
    let blob =
      url &&
      (await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }).then(async data => await data.blob()));
    let typeFile = 'application/pdf';
    var file = new Blob([blob], { type: typeFile });
    var fileURL = URL.createObjectURL(file);
    setloadingFile(false);
    return fileURL;
  };
  useEffect(
    () => {
      if (show && previewHtml) {
        show.innerHTML = previewHtml;
      }
    },
    [show, previewHtml, state.dialog, state.type],
  );

  async function convertFileToUrl(file) {
    // let reader = new FileReader();
    // let url;
    // reader.addEventListener('load', function () {
    //   url = reader.result
    // })
    if (file && file.id) {
      return file.id;
    } else {
      return URL.createObjectURL(file);
    }
  }

  const handleDeleteItem = () => {
    const { index, name, type } = isFileDelete;
    if (type === 'onDeleteFile') {
      onDeleteFile && onDeleteFile(index, name);
    } else if (type === 'deleteNewFile') deleteNewFile(index, name);
    setIsFileDelete({});
    setOpenDialogDelete(false);
  };

  const onCheck = id => {
    const obj = { ...checked };
    if (!obj[id]) obj[id] = true;
    else delete obj[id];
    setChecked(obj);
    if (typeof checkbox === 'function') checkbox(obj);
  };

  const onPrevỉew = async id => {
    await insertTextToPdf({
      id,
    });
  };
  const handleGetFileTXT = async url => {
    let objectURL = '';
    await fetch(url)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        setDocFile(blob);
        const file = new File([blob], 'foo.txt', {
          type: 'text/plain',
        });
        objectURL = URL.createObjectURL(file);
        console.log(file, 'blob');
        console.log(objectURL, 'objectURL');
        return objectURL;
      })
      .catch(er => {
        console.log(er);
        return url;
      });
    return objectURL || url;
  };
  return (
    <React.Fragment>
      <>
        <Dialogg
          onClose={() => {
            setOpenDialogDelete(false);
          }}
          aria-labelledby="customized-dialog-title"
          open={openDialogDelete}
          maxWidth="md"
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Thông báo
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>Đồng chí có chắc chắn muốn xóa?</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleDeleteItem} color="primary" variant="contained">
              Đồng ý
            </Button>
            <Button
              onClick={() => {
                setOpenDialogDelete(false);
                setIsFileDelete({});
              }}
              color="secondary"
              variant="contained"
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialogg>
      </>

      {/* <input onChange={wrapperFn} multiple id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" accept={SheetJSFT} /> */}
      {id === 'add' ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCell || ''} style={{ cursor: 'pointer', alignItems: 'center', fontWeight: 'bold' }}>
                Tên file
              </TableCell>
              <TableCell
                className={classes.tableCell || ''}
                style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
              >
                Xem chi tiết
              </TableCell>
              <TableCell
                className={classes.tableCell || ''}
                style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
              >
                Tải file
              </TableCell>
              {editFile && (
                <TableCell
                  className={classes.tableCell || ''}
                  style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
                >
                  Chỉnh sửa
                </TableCell>
              )}
              <TableCell
                className={classes.tableCell || ''}
                style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          {files &&
            files.map((file, index) => (
              <TableRow>
                <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center' }}>
                  {file ? file.name : ''}
                </TableCell>
                <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                  <Tooltip title="Xem chi tiết">
                    <Visibility
                      style={{ cursor: 'pointer' }}
                      onClick={async () => {
                        let url = file.id
                          ? `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file.id}`
                          : file && (await convertFileToUrl(file));
                        let img;
                        let type;
                        let extension = (file && file.name.split('.')) || [];
                        extension = extension[extension.length - 1] || '';
                        extension = extension.toLowerCase();
                        if (['jpg', 'png', 'jpeg'].includes(extension)) {
                          img = true;
                        } else {
                          img = false;
                          setDocFile();
                          if (extension === 'pdf') {
                            url = await handlePdf(url, extension);
                            type = 'pdf';
                          }
                          if (extension === 'xlsx') {
                            await displayFileExcel(url);
                            type = 'xlsx';
                          }

                          if (extension === 'xls') {
                            await displayFileExcel(url);
                            type = 'xls';
                          }
                          if (extension === 'docx' || extension === 'doc') {
                            setDocFile(file);
                            type = extension;
                          }
                          if (extension === 'txt') {
                            type = extension;
                            if (file.id) {
                              url = await handleGetFileTXT(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file.id}`);
                              console.log(url, 'url url url');
                            }
                          }
                        }

                        setState({
                          ...state,
                          dialog: true,
                          type,
                          url,
                          img,
                        });
                      }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                  <Tooltip title="Tải xuống">
                    <CloudDownload style={{ cursor: 'pointer' }} onClick={() => downloadFileAdd(file, file.name)} />
                  </Tooltip>
                </TableCell>
                {editFile && (
                  <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                    {file.type === '.docx' || file.type === '.doc' ? (
                      <Tooltip title="Chỉnh sửa">
                        <Edit
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            downloadFileAdd(file, file.name);
                            editFileRef.current = file;
                            isEditFileRef.current = true;
                          }}
                        />
                      </Tooltip>
                    ) : null}
                  </TableCell>
                )}
                <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                  <Tooltip title="Xóa file">
                    {/* <Delete style={{ cursor: 'pointer' }} onClick={() => onDeleteFile && onDeleteFile(index, nameBtn)} /> */}
                    <Delete
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setOpenDialogDelete(true);
                        setIsFileDelete({ index: index, name: nameBtn, type: 'onDeleteFile' });
                      }}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </Table>
      ) : null}
      {!code || !id || !name || id === 'add' ? null : (
        <div>
          <input
            onChange={e => {
              newWay ? uploadManyFileNew(e, name) : uploadManyFile(e, name);
            }}
            multiple
            id={name === 'duthao' ? 'fileUpload' : name === 'totrinh' ? 'fileUpload2' : 'fileUpload1'}
            style={{ display: 'none' }}
            name={name === 'duthao' ? 'fileUpload' : name === 'totrinh' ? 'fileUpload2' : 'fileUpload1'}
            type="file"
            accept={SheetJSFT}
          />
          {/* <input onChange={uploadFile}  id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" accept={SheetJSFT} /> */}

          {checkDisableEditTask ? (
            <>
              <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black', width: 140, display: 'inline-block' }}>
                {' '}
                {name && name === 'duthao' ? 'DỰ THẢO' : 'TỆP ĐÍNH KÈM'}
              </span>
              {dataCheckTask && (checkTabs && checkTabs.tab && checkTabs.tab !== 'support') ? (
                <>
                  <label
                    htmlFor={name === 'duthao' ? 'fileUpload' : name === 'totrinh' ? 'fileUpload2' : 'fileUpload1'}
                    style={{ display: 'inline-block', marginRight: 10, marginTop: 20 }}
                  >
                    <Button color="primary" variant="contained" component="span">
                      {/* <span style={{ marginRight: 5 }}>
                        <AttachFileIcon />
                      </span> */}
                      <span style={{ fontWeight: 'bold' }}>Tải lên</span>
                    </Button>
                  </label>
                </>
              ) : null}
            </>
          ) : (
            <>
              {(!isDetail && !viewOnly && !disableEdit) || forceUpload ? (
                <>
                  <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black', width: 160, display: 'inline-block' }}>
                    {' '}
                    {name && name === 'duthao'
                      ? 'VĂN BẢN DỰ THẢO'
                      : name === 'totrinh'
                        ? 'VĂN BẢN BÁO CÁO (NẾU CÓ)'
                        : name === 'tepdinhkem'
                          ? 'TỆP ĐÍNH KÈM'
                          : 'VĂN BẢN ĐÍNH KÈM'}
                  </span>
                  {!scanOnly && (
                    <label
                      htmlFor={name === 'duthao' ? 'fileUpload' : name === 'totrinh' ? 'fileUpload2' : 'fileUpload1'}
                      style={{ display: 'inline-block', marginRight: 10, marginTop: 20 }}
                    >
                      <Button color="primary" variant="contained" component="span">
                        {/* <span style={{ marginRight: 5 }}>
                        <AttachFileIcon />
                      </span> */}
                        <span style={{ fontWeight: 'bold' }}>Tải lên</span>
                      </Button>
                    </label>
                  )}

                  {canScan && (
                    <label htmlFor="fileScan">
                      <Button color="primary" variant="contained" component="span" onClick={() => setScanDialog({})}>
                        {/* <span style={{ marginRight: 5, fontWeight: 'bold' }}>
                          <Scanner />
                        </span> */}
                        <span style={{ fontWeight: 'bold' }}>Quét văn bản</span>
                      </Button>
                    </label>
                  )}
                </>
              ) : (
                <>
                  {canScan && (
                    <label htmlFor="fileScan">
                      <Button color="primary" variant="contained" component="span" onClick={() => setScanDialog({})}>
                        {/* <span style={{ marginRight: 5, fontWeight: 'bold' }}>
                          <Scanner />
                        </span> */}
                        <span style={{ fontWeight: 'bold' }}>Quét văn bản</span>
                      </Button>
                    </label>
                  )}
                </>
              )}
            </>
          )}
          {moreButton}
          <Table>
            <TableHead>
              <TableRow>
                {checkbox && (
                  <TableCell className={classes.tableCell || ''} style={{ cursor: 'pointer', alignItems: 'center', fontWeight: 'bold' }}>
                    Chọn
                  </TableCell>
                )}
                {status ? (
                  <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center' }}>
                    {statusIconButton || (statusButton !== null ? statusButton : statusIconButton) ? (
                      <>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => {
                            setStatusIconButton(false);
                            setStatusButton(null);
                          }}
                        >
                          <KeyboardArrowUp />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => {
                            setStatusIconButton(true);
                            setStatusButton(null);
                          }}
                        >
                          <KeyboardArrowDown />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                ) : null}
                <TableCell className={classes.tableCell || ''} style={{ cursor: 'pointer', alignItems: 'center', fontWeight: 'bold' }}>
                  Tên file
                </TableCell>
                {isCreator ? (
                  <TableCell
                    className={classes.tableCell || ''}
                    style={{
                      cursor: 'pointer',
                      // alignItems: 'center',
                      //  textAlign: 'center'
                      fontWeight: 'bold',
                    }}
                  >
                    Người thêm
                  </TableCell>
                ) : null}
                <TableCell
                  className={classes.tableCell || ''}
                  style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
                >
                  Xem chi tiết
                </TableCell>
                <TableCell
                  className={classes.tableCell || ''}
                  style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
                >
                  Tải file
                </TableCell>
                {editFile &&
                  !canChangeFile && (
                    <TableCell
                      className={classes.tableCell || ''}
                      style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
                    >
                      Chỉnh sửa
                    </TableCell>
                  )}
                {/* {addTextToFile && (
                  <TableCell
                    className={classes.tableCell || ''}
                    style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
                  >
                    Thêm số VB
                  </TableCell>
                )} */}
                {!isDetail ? (
                  <TableCell
                    className={classes.tableCell || ''}
                    style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
                  >
                    Hành động
                  </TableCell>
                ) : null}
                {(signed || allowSignApostropher) &&
                  !canChangeFile && (
                    <TableCell
                      className={classes.tableCell || ''}
                      style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
                    >
                      {allowSignApostropher ? 'Ký nháy' : 'Ký văn bản'}
                    </TableCell>
                  )}
                {(deleteSigned || (canAssess && roleTo && roleTo.deleteFile)) &&
                  !canChangeFile && (
                    <TableCell
                      className={classes.tableCell || ''}
                      style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
                    >
                      Xóa
                    </TableCell>
                  )}
                {previewToBook && (
                  <TableCell
                    className={classes.tableCell || ''}
                    style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}
                  >
                    Xem trước
                  </TableCell>
                )}

                {!canChangeFile &&
                  canAssess &&
                  roleTo &&
                  roleTo.reUpFile && (
                    <label
                      htmlFor={name === 'duthao' ? 'fileUpload' : name === 'totrinh' ? 'fileUpload2' : 'fileUpload1'}
                      style={{ cursor: 'pointer', display: 'flex', marginLeft: 20 }}
                    >
                      <Tooltip title="Tải file">
                        <CloudUpload color="primary" />
                      </Tooltip>
                    </label>
                  )}
              </TableRow>
            </TableHead>
            <TableBody>
              {code === 'hrm' ? (
                <TableRow>
                  <Grid container alignItems="center">
                    <Grid item>
                      <Add style={{ fontSize: '1rem', cursor: 'pointer' }} onClick={() => setState({ ...state, display: !state.display })} />
                      <Folder />

                      <span className="ml-2"> {`Ảnh đại diện`} </span>
                    </Grid>
                    <Grid item className={classes.txtRight}>
                      <Checkbox checked={state.select === 0} onClick={() => handleCheck(null, 0)} />
                      {state.display
                        ? list.map((i, idx) => (
                            <div>
                              <Folder />
                              {i.name} <Checkbox checked={state.select === idx + 1} onClick={() => handleCheck(i, idx + 1)} />
                            </div>
                          ))
                        : null}
                    </Grid>
                  </Grid>
                </TableRow>
              ) : null}
              {statusIconButton || (statusButton !== null ? statusButton : statusIconButton)
                ? id &&
                  files &&
                  files.map(file => {
                    return (
                      <>
                        <TableRow>
                          {checkbox && (
                            <TableCell padding="checkbox">
                              <Checkbox checked={checked[file._id]} onChange={() => onCheck(file._id)} />
                            </TableCell>
                          )}

                          {status ? <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center' }} /> : null}
                          <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center' }}>
                            {file ? file.name : ''}
                          </TableCell>
                          {isCreator ? (
                            <TableCell className={classes.tableCell || ''}>{file.fullName || isCreator.name || file.username || ''}</TableCell>
                          ) : null}
                          <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                            {checkDisableEditTask ? (
                              <>
                                {dataCheckTask ? (
                                  <>
                                    {loadingFile ? (
                                      <CircularProgress />
                                    ) : (
                                      <Tooltip title="Xem chi tiết">
                                        <Visibility
                                          style={{ cursor: 'pointer' }}
                                          onClick={async () => {
                                            console.log('Xem chi tiết 2');
                                            let url;
                                            let img;
                                            let type;

                                            if (['.jpg', '.png', '.PNG', '.jpeg'].includes(file.type)) {
                                              url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;

                                              img = true;
                                            } else {
                                              img = false;
                                              if (file.type === '.pdf') {
                                                url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}&embedded=true`;
                                                url = await handlePdf(url, file.type);
                                                type = 'pdf';
                                              }
                                              if (file.type === '.xlsx') {
                                                url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                                                await displayFileExcel(url);
                                                type = 'xlsx';
                                              }
                                              if (file.type === '.xls') {
                                                url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                                                await displayFileExcel(url);
                                                type = 'xls';
                                              }
                                              if (file.type === '.docx') {
                                                url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                                                await fetch(url).then(async res => {
                                                  if (res) {
                                                    let blob = await res.blob();
                                                    if (blob) {
                                                      let file = new File([blob], 'new_file');
                                                      file && setDocFile(file);
                                                    }
                                                  }
                                                });

                                                type = 'docx';
                                              }
                                              if (file.type === '.doc') {
                                                // url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                                                // await fetch(url).then(async res => {
                                                //   if (res) {
                                                //     let blob = await res.blob();
                                                //     if (blob) {
                                                //       let file = new File([blob], 'new_file');
                                                //       file && setDocFile(file);
                                                //     }
                                                //   }
                                                // });
                                                // type = 'doc';

                                                url = `${UPLOAD_APP_URL}/get-doc-like-pdf?id=${file._id}&clientId=${clientId}`;
                                                url = await handleConvertDocLikePdf(url, '.pdf');
                                                type = 'pdf';
                                              }
                                            }

                                            setState({
                                              ...state,
                                              dialog: true,
                                              type,
                                              url,
                                              img,
                                            });
                                          }}
                                        />
                                      </Tooltip>
                                    )}
                                  </>
                                ) : null}
                              </>
                            ) : (
                              <>
                                {loadingFile ? (
                                  <CircularProgress />
                                ) : (
                                  <Tooltip title="Xem chi tiết">
                                    <Visibility
                                      style={{ cursor: 'pointer' }}
                                      onClick={async () => {
                                        console.log('Xem chi tiết 3: ', file.type);
                                        let url;
                                        let img;
                                        let type;

                                        if (['.jpg', '.png', '.PNG', '.jpeg'].includes(file.type)) {
                                          url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;

                                          img = true;
                                        } else {
                                          img = false;
                                          if (file.type === '.pdf') {
                                            url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}&embedded=true`;
                                            url = await handlePdf(url, file.type);
                                            type = 'pdf';
                                          }
                                          if (file.type === '.xlsx') {
                                            url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                                            await displayFileExcel(url);
                                            type = 'xlsx';
                                          }
                                          if (file.type === '.xls') {
                                            url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                                            await displayFileExcel(url);
                                            type = 'xls';
                                          }
                                          if (file.type === '.docx') {
                                            url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                                            await fetch(url).then(async res => {
                                              if (res) {
                                                let blob = await res.blob();
                                                if (blob) {
                                                  let file = new File([blob], `new_file${new Date() * 1}`);
                                                  file && setDocFile(file);
                                                  // downloadDocx(file, "download", 'docx')
                                                }
                                              }
                                            });
                                            type = 'docx';
                                          }
                                          if (file.type === '.doc') {
                                            //   url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}`;
                                            //   await fetch(url).then(async res => {
                                            //     if (res) {
                                            //       let blob = await res.blob();
                                            //       if (blob) {
                                            //         let file = new File([blob], 'new_file');
                                            //         file && setDocFile(file);
                                            //       }
                                            //     }
                                            //   });
                                            //   type = 'doc';
                                            url = `${UPLOAD_APP_URL}/get-doc-like-pdf?id=${file._id}&clientId=${clientId}`;
                                            url = await handleConvertDocLikePdf(url, '.pdf');
                                            type = 'pdf';
                                          }
                                        }

                                        setState({
                                          ...state,
                                          dialog: true,
                                          type,
                                          url,
                                          img,
                                        });
                                      }}
                                    />
                                  </Tooltip>
                                )}
                              </>
                            )}
                          </TableCell>
                          <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                            {checkDisableEditTask ? (
                              <>
                                {dataCheckTask ? (
                                  <Tooltip title="Tải xuống">
                                    <CloudDownload
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        downloadFile(
                                          `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}&isDownloadByApp=true`,
                                          file.name,
                                        )
                                      }
                                    />
                                  </Tooltip>
                                ) : null}
                              </>
                            ) : (
                              <>
                                <Tooltip title="Tải xuống">
                                  <CloudDownload
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                      downloadFile(
                                        `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}&isDownloadByApp=true`,
                                        file.name,
                                      )
                                    }
                                  />
                                </Tooltip>
                              </>
                            )}
                          </TableCell>
                          {editFile &&
                            !canChangeFile && (
                              <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                                {file.type === '.docx' || file.type === '.doc' ? (
                                  <Tooltip
                                    title={
                                      <>
                                        <p style={{ parginBottom: 0, marginBottom: 0, textAlign: 'center' }}>Chỉnh sửa</p>
                                        {existWordAddIn ? null : (
                                          <>
                                            <p style={{ parginBottom: 0, marginBottom: 0, textAlign: 'center' }}>
                                              Nếu đồng chí đang mở Word nhưng vẫn hiển thị dòng này, xin vui lòng cài đặt addIn!{' '}
                                              <a download href={API_WORD_ADDON_UPLOAD} target="_blank">
                                                Tải xuống
                                              </a>
                                            </p>
                                            <p style={{ parginBottom: 0, marginBottom: 0, textAlign: 'center' }}>
                                              Xin vui lòng khởi động lại Word sau khi cài đặt!
                                            </p>
                                          </>
                                        )}
                                      </>
                                    }
                                    interactive
                                  >
                                    <Edit
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => {
                                        if (!files_key.current[file.name]) {
                                          const k = `${moment().milliseconds()}${moment().second()}${Math.floor(Math.random() * 10000 + 1000)}`;
                                          files_key.current[file.name] = k;
                                          files_key.current[k] = file;
                                        }
                                        const key = files_key.current[file.name];
                                        downloadFile(
                                          `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${file._id}&isDownloadByApp=true`,
                                          `${key}_${file.name}`,
                                        );
                                        editFileRef.current = file;
                                        isEditFileRef.current = true;
                                      }}
                                    />
                                  </Tooltip>
                                ) : null}
                              </TableCell>
                            )}

                          {/* {addTextToFile && (
                          <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                            {file.type === '.pdf' ? (
                              <Tooltip
                                title={
                                  <>
                                    <p style={{ parginBottom: 0, marginBottom: 0, textAlign: 'center' }}>Thêm số VB</p>
                                  </>
                                }
                                interactive
                              >
                                <FlipToBack
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                  }}
                                />
                              </Tooltip>
                            ) : null}
                          </TableCell>
                        )} */}
                          {checkDisableEditTask ? (
                            <>
                              {(profile && profile.username === file.username && dataCheckTask) || deleteFile ? (
                                <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                                  <Tooltip title="Xóa file">
                                    <Delete style={{ cursor: 'pointer' }} onClick={() => deleteFile(file._id, name)} />
                                  </Tooltip>
                                </TableCell>
                              ) : (
                                <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }} />
                              )}
                            </>
                          ) : (
                            <>
                              {!isDetail && !viewOnly && !disableDelete ? (
                                <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                                  <Tooltip title="Xóa file">
                                    {disableWhenApproved && file.isApprove ? (
                                      ''
                                    ) : (
                                      <Delete style={{ cursor: 'pointer' }} onClick={() => deleteFile(file._id, name)} />
                                    )}
                                  </Tooltip>
                                </TableCell>
                              ) : null}
                            </>
                          )}

                          {(signed || allowSignApostropher) &&
                            !canChangeFile &&
                            // && ['.pdf'].includes(file.type)
                            ['.doc', '.docx', '.pdf'].includes(file.type) && (
                              <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                                <Tooltip
                                  interactive
                                  title={
                                    <>
                                      <p style={{ parginBottom: 0, marginBottom: 0, textAlign: 'center' }}>
                                        {allowSignApostropher ? 'Ký nháy' : 'Ký số'}
                                      </p>
                                      <p style={{ parginBottom: 0, marginBottom: 0 }}>
                                        Chưa cài phần mềm ký?{' '}
                                        <a download href={API_DOWNLOAD_SIGN_DIGITAL} target="_blank">
                                          Tải xuống
                                        </a>
                                      </p>
                                    </>
                                  }
                                >
                                  <BorderColor
                                    style={{ cursor: 'pointer', color: signing ? 'gray' : 'black' }}
                                    onClick={() => !signing && signFile(file, file.name)}
                                  />
                                </Tooltip>
                              </TableCell>
                            )}
                          {(deleteSigned ||
                            (canAssess && roleTo && roleTo.deleteFile && (file.name.includes('_signed.pdf') || file.name.includes('_quoted.pdf')))) &&
                          !canChangeFile ? (
                            <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                              <Tooltip
                                interactive
                                title={
                                  <>
                                    <p style={{ parginBottom: 0, marginBottom: 0, textAlign: 'center' }}>Xóa</p>
                                  </>
                                }
                              >
                                <Delete
                                  style={{ cursor: 'pointer', color: signing ? 'gray' : 'black' }}
                                  onClick={() => deleteFile(file._id, 'name')}
                                />
                              </Tooltip>
                            </TableCell>
                          ) : canAssess && roleTo && roleTo.deleteFile && !canChangeFile ? (
                            <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                              <Tooltip
                                interactive
                                title={
                                  <>
                                    <p style={{ parginBottom: 0, marginBottom: 0, textAlign: 'center' }}>Xóa</p>
                                  </>
                                }
                              >
                                <Delete
                                  style={{ cursor: 'pointer', color: signing ? 'gray' : 'black' }}
                                  onClick={() => deleteFile(file._id, 'name')}
                                />
                              </Tooltip>
                            </TableCell>
                          ) : null}

                          {previewToBook && (
                            <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                              <Tooltip
                                interactive
                                title={
                                  <>
                                    <p style={{ parginBottom: 0, marginBottom: 0, textAlign: 'center' }}>Xem trước</p>
                                  </>
                                }
                              >
                                <FormatColorText onClick={() => onPrevỉew(file._id)} />
                              </Tooltip>
                            </TableCell>
                          )}
                        </TableRow>
                        {checked[file._id] && (
                          <TableCell colspan={4}>
                            <ReleaseNoLocation
                              id={file._id}
                              content={svbText}
                              onChange={data => onUpdateSetting && onUpdateSetting(file._id, data)}
                              file={file}
                            />
                          </TableCell>
                        )}
                      </>
                    );
                  })
                : null}

              {newFiles && newFiles.length > 0
                ? newFiles.map((file, index) => (
                    <TableRow>
                      <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center' }}>
                        {file ? file.name : ''}
                      </TableCell>
                      {isCreator ? (
                        <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center' }}>
                          {''}
                        </TableCell>
                      ) : null}
                      <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                        <Tooltip title="Xem chi tiết">
                          <Visibility
                            style={{ cursor: 'pointer' }}
                            onClick={async () => {
                              console.log('xem chi tiết 4');

                              let url = file && (await convertFileToUrl(file));

                              let img;
                              let type;
                              let extension = (file && file.name.split('.')) || [];
                              extension = extension[extension.length - 1] || '';
                              extension = extension.toLowerCase();
                              if (['jpg', 'png', 'jpeg'].includes(extension)) {
                                img = true;
                              } else {
                                img = false;
                                if (extension === 'pdf') {
                                  url = await handlePdf(url, extension);
                                  type = 'pdf';
                                }
                                if (extension === 'xlsx') {
                                  await displayFileExcel(url);
                                  type = 'xlsx';
                                }
                                if (extension === 'xls') {
                                  await displayFileExcel(url);
                                  type = 'xls';
                                }
                                if (extension === 'docx' || extension === 'doc') {
                                  setDocFile(file);
                                  type = extension;
                                }
                              }

                              setState({
                                ...state,
                                dialog: true,
                                type,
                                url,
                                img,
                              });
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                        <Tooltip title="Tải xuống">
                          <CloudDownload style={{ cursor: 'pointer' }} onClick={() => downloadFileAdd(file, file.name)} />
                        </Tooltip>
                      </TableCell>
                      <TableCell className={classes.tableCell || ''} style={{ alignItems: 'center', textAlign: 'center' }}>
                        {file.type === '.docx' || file.type === '.doc' ? (
                          <Tooltip title="Chỉnh sửa">
                            <Edit
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                downloadFileAdd(file, file.name);
                                editFileRef.current = file;
                                isEditFileRef.current = true;
                              }}
                            />
                          </Tooltip>
                        ) : null}
                        <Tooltip title="Xóa file">
                          {/* <Delete style={{ cursor: 'pointer' }} onClick={() => deleteNewFile(index)} /> */}
                          <Delete
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setOpenDialogDelete(true);
                              setIsFileDelete({ index: index, name: '', type: 'deleteNewFile' });
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>

          {/* {code === 'Task' && !viewOnly ? (
            <Grid container alignItems="center">
              <Grid item xs={3}>
                <Add style={{ fontSize: '1rem' }} onClick={() => setState({ ...state, display: !state.display })} />
                <Folder />
                <span className="ml-2"> {name} </span>
              </Grid>
              <Grid item xs={9} className={classes.txtRight}>
                <Checkbox checked={state.select === 0} onClick={() => handleCheck(null, 0)} />
                {state.display
                  ? list.map((i, idx) => (
                    <div>
                      <Folder />
                      {i.name} <Checkbox checked={state.select === idx + 1} onClick={() => handleCheck(i, idx + 1)} />
                    </div>
                  ))
                  : null}
              </Grid>
            </Grid>
          ) : null} */}
        </div>
      )}
      {state.dialog && (
        <Dialog maxWidth={false} docFile={docFile} typeFile={state.type} fullScreen open={state.dialog} onClose={handleClose}>
          <div style={{ height: '1000px', textAlign: 'center' }}>
            {state.img === true ? (
              <img alt="HHH" src={state.url} style={{ maxHeight: 800 }} />
            ) : (
              <>
                {console.log(state.dialog, 'state', state.url, state.type)}
                {state.type === 'pdf' && <iframe title="PDF" src={`${state.url}`} width="100%" height="100%" value="file" />}
                {(state.type === 'xlsx' || state.type === 'xls') && <div id="show" />}
                {state.type === 'txt' && <iframe title="txt" src={`${state.url}`} width="100%" height="100%" value="file" />}
              </>
            )}
          </div>
        </Dialog>
      )}

      <Dialog maxWidth="md" fullWidth open={state.dialogtext} onSave={dialogSave} onClose={() => setState({ ...state, dialogtext: false })}>
        <DialogTitle style={{ padding: '0 0 20px 0' }} id="form-dialog-title1">
          Thông tin đính kèm file
        </DialogTitle>
        <CustomGroupInputField code={code} columnPerRow={2} source="fileColumns" value={localState.others} onChange={handleOtherDataChange} />
      </Dialog>

      <Dialog
        maxWidth="xs"
        fullWidth
        open={state.newFileDialog}
        onSave={() => {
          try {
            const { newFile } = state;
            const file = { target: { files: [newFile] } };
            newWay ? uploadManyFileNew(file, name) : uploadManyFile(file, name);
            setState({ ...state, newFileDialog: false });
          } catch (error) {}
        }}
        onClose={() => setState({ ...state, newFileDialog: false })}
      >
        <DialogTitle style={{ padding: '0 0 20px 0' }} id="form-dialog-title1">
          Đồng chí có muốn cập nhật tài liệu không?
        </DialogTitle>
        <CustomGroupInputField code={code} columnPerRow={2} source="fileColumns" value={localState.others} onChange={handleOtherDataChange} />
      </Dialog>
      <Dialog dialogAction={false} open={loadingEditFile}>
        <DialogContent>Đang tải xử lý, đồng chí vui lòng chờ...</DialogContent>
      </Dialog>
      {addFileDialog ? (
        <Dialog
          maxWidth="xs"
          fullWidth
          open={addFileDialog}
          onSave={() => {
            try {
              setAddFileDialog(false);
              setLoadingEditFile(true);
              const file = { target: { files: [addFileData.newFile] } };
              uploadManyFile(file, name, 'addVersion', { changeId: addFileData._id, isReturn: true });
              addFileSuccess && addFileSuccess(addFileData);
            } catch (error) {
              console.log(error, 'lỗi nè');
            }
          }}
          onClose={() => setAddFileDialog(false)}
        >
          <DialogTitle style={{ padding: '0 0 20px 0' }} id="form-dialog-title1">
            {addFileText}
          </DialogTitle>
          <CustomGroupInputField code={code} columnPerRow={2} source="fileColumns" value={localState.others} onChange={handleOtherDataChange} />
        </Dialog>
      ) : null}

      <ScanDialog
        onSave={file => (newWay ? uploadManyFileNew(file, name) : uploadManyFile(file, name))}
        scanDialog={scanDialog}
        setScanDialog={setScanDialog}
      />
      <Snackbar
        open={snackbar.open}
        variant={snackbar.variant}
        message={snackbar.message}
        onClose={() =>
          setSnackbar({
            open: false,
            message: '',
            variant: '',
          })
        }
      />
    </React.Fragment>
  );
}

FileUpload.propTypes = {
  classes: PropTypes.object.isRequired,
  disableWhenApproved: PropTypes.bool,
};

FileUpload.defaultProps = {
  disableWhenApproved: false,
};

export default withStyles(styles)(FileUpload);
