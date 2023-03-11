// AddSignedDocument

import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, SwipeableDrawer, Dialog, AsyncAutocomplete, FileUpload } from '../../components/LifetekUi';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { mergeData, addSignedDocument, updateSignedDocument, deleteSignedDocument } from './actions';
import makeSelectAddSignedDocument from './selectors';
import reducer from './reducer';
import saga from './saga';
import DepartmentSelect from '../../components/DepartmentSelect/CloneQuadra';

import {
  API_GOING_DOCUMENT,
  API_ROLE_APP,
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_USERS,
  API_USERS_SEARCH,
  API_INCOMMING_DOCUMENT,
  API_TASK_PROJECT,
  API_OUTGOING_DOCUMENT_SINGER,
  API_ORIGANIZATION,
  API_MEETING,
  API_DOCUMENT_HISTORY,
  API_PERSONNEL_RECEIVER,
  ALLOW_FILE_EXT_UPLOAD,
  FILE_SIZE_UPLOAD,
} from '../../config/urlConfig';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Menu,
  MenuItem,
  FormControl,
  Tooltip,
  Table,
  TableCell,
  TableHead,
  IconButton,
  TableRow,
  TableBody,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  Dialog as Dialogg,
  TextField,
} from '@material-ui/core';
import FlowDocument from '../../components/FlowComponent';

import CustomAppBar from 'components/CustomAppBar';
import CustomInputBase from '../../components/Input/CustomInputBase';
import makeSelectDashboardPage, { makeSelectMiniActive, makeSelectProfile } from '../Dashboard/selectors';
import Department from 'components/Filter/DepartmentAndEmployee';
import moment from 'moment';
import { Paper as PaperUI } from 'components/LifetekUi';
import { Delete, Add, Edit } from '@material-ui/icons';
import { changeSnackbar } from '../Dashboard/actions';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigName2Title, viewConfigCheckShowForm, getListData } from '../../utils/common';
import CustomInputField from '../../components/Input/CustomInputField';
import ListPage from 'components/List';
import { taskStatusArr } from '../../variable';
import DocumentAssignModal from 'components/DocumentAssignModalGo';
import CompleteDocs from 'components/DocumentAssignModalGo/CompleteDocs';
import ReturnDocs from 'components/DocumentAssignModalGo/ReturnDocs';
import DocumentSetCommanders from 'components/DocumentAssignModalGo/SetCommanders';
import _ from 'lodash';
import { fetchData, serialize, flatChild } from '../../helper';
import FilterDocs from './components/FilterDocs';

import TaskDocs from './components/TaskDocs';
import { withStyles } from '@material-ui/core/styles';
import { getShortNote, checkCanProcess } from '../../utils/functions';
import { Autocomplete } from 'components/LifetekUi';
import ScanDialog from '../../components/ScanDoc/ScanDialog';
import EditExecutiveDocuments from '../EditExecutiveDocuments';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';

const mapTask = item => ({
  ...item,
  // parentId: item['parentId.name'],
  name: (
    <button onClick={() => openTask(item)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
      {item.name}
    </button>
  ),
  customer: item['customer.name'],
  createdBy: item['createdBy.name'],
  taskStatus: taskStatusArr[item.taskStatus - 1],
  type: item.type === 1 ? 'Nhóm bảo mật' : item.type === 4 ? 'Nhóm công khai' : item.type === 2 ? 'Nhóm ẩn' : 'Nhóm mở rộng',
  priority:
    item.priority === 1 ? 'Rất cao' : item.priority === 2 ? 'Cao' : item.priority === 3 ? 'Trung bình' : item.priority === 4 ? 'Thấp' : 'Rất thấp',
});
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  tableCell: {
    padding: '4px 20px',
    borderBottom: '1px solid #e0e0e',
    textWrap: 'wrap',
    width: '25%',
  },
  txtRight: {
    textAlign: 'right',
  },
});

const order = ['TRUONGPHONG', 'CUCPHO', 'CUCTRUONG'];

function AddSignedDocument(props) {
  const {
    profile,
    code = 'OutGoingDocument',
    addSignedDocument,
    onChangeSnackbar,
    onAddSignedDocument,
    onDeleteSignedDocument,
    onUpdateSignedDocument,
    indexTab,
    classes,
    miniActive,
  } = props;

  const crmSource = JSON.parse(localStorage.getItem('crmSource'));
  let data = crmSource !== undefined && crmSource.find(item => item.code === 'noi gui');
  let dataSendPlace = [];
  data !== undefined && data.data.map((item, index) => dataSendPlace.push({ title: item.title, value: item._id }));
  const id = props.match && props.match.params ? props.match.params.id : 'add';
  const [localState, setLocalState] = useState({
    others: {},
    answer4docCheck: false,
    viewers: [],
    task: [],
    signer: null,
    answer4doc: [],
    drafter: profile,
    senderUnit: profile && profile.organizationUnit ? profile.organizationUnit.organizationUnitId : {},
    file: [],
    fileDocument: [],
    fileList: [],
    newFiles: [],
    incommingDocument: [],
    dataTask: [],
    recipientId: {},
    sendingMan: { title: '---Chọn---', value: null },
    receiver: null,
    recipientIds: [],
  });

  const urlParams = new URLSearchParams(window.location.search);
  const role = props.location.search.split('=')[1];
  const isAuthory = Boolean(urlParams.get('isAuthory')) || false;
  const isDraft = Boolean(urlParams.get('isDraft')) || false;
  const [index, setIndex] = useState(0);
  const [name2Title, setName2Title] = useState({});
  const [checkRequired, setCheckRequired] = useState({});
  const [checkShowForm, setCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [currentRole, setCurrentRole] = useState({});
  const [nextRole, setNextRole] = useState({});
  const [viewType, setViewType] = useState('any');
  const [openAddSignProcessDialog, setOpenAddSignProcessDialog] = useState(false);
  const [show, setShow] = useState(false);
  const [docDetail, setDocDetail] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [selectedDocs, setSelectedDocs] = useState(id ? [id] : []);
  const [openAsignProcessor, setOpenAsignProcessor] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [openReturnDocs, setOpenReturnDocs] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const requestURL = API_GOING_DOCUMENT;
  const [templates, setTemplates] = useState([]);
  const [openDialogFilter, setOpenDialogFilter] = useState(false);
  const [openDialogTask, setOpenDialogTask] = useState(false);
  const [allRoles, setAllRoles] = useState([]);
  const [businessRole, setBusinessRole] = useState({});
  const [openDialogResponse, setOpenDialogResponse] = useState(null);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [openSetCommanders, setOpenSetCommanders] = useState(false);
  const [goTypeProcess, setGoTypeProcess] = useState('');
  const convertFileRef = useRef([]);
  const [draftData, setDraftData] = useState({});
  const [recipient, setRecipient] = useState([]);
  const [docId, setDocId] = useState(null);
  const [scanDialog, setScanDialog] = useState();
  const [scanDevices, setScanDevices] = useState([]);
  const [historyy, setHistoryy] = useState(null);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogDeletee, setOpenDialogDeletee] = useState(false);

  const [openDialogAdd, setopenDialogAdd] = useState(false);
  const [openDialogEdit, setopenDialogEdit] = useState(false);

  const [idDelete, setIdDelete] = useState({});
  const [disableSave, setDisableSave] = useState(false);
  const [employeeFilter, setEmployeeFilter] = useState();
  const [viewersEmployeeFilter, setViewersEmployeeFilter] = useState();
  const [statusTask, setStatusTask] = useState(false);
  const [oldTask, setOldTask] = useState([]);
  const [listDataTask, setListDataTask] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const [recipientIdTemp, setRecipientIdTemp] = useState();
  const [receiverTemp, setReceiverTemp] = useState();
  const [indArray, setIndArray] = useState();
  const [idDeletee, setIdDeletee] = useState();
  const [flagInToOut, setFlagInToOut] = useState();
  const [roomApply, setRoomApply] = useState();
  const [tempUnit, setTempUnit] = useState([]);
  const [openCustom, setOpenCustom] = useState(true);
  const [departmentFull, setDepartmentFull] = useState([]);
  const [reloadUser, setReloadUser] = useState(true);


  useEffect(() => {
    const query = { filter: { docId: id } };
    fetch(`${API_DOCUMENT_HISTORY}?${serialize(query)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setHistoryy(data);
      });
  }, []);
  let toBookCode = urlParams.get('toBookCode') || '';

  const checkRoleCanAction = (key, profile, state, isAuthory = false) => {
    if (isAuthory) {
      return state && state.author && state[key] && state[key].indexOf(state.author) !== -1 ? true : false;
    }
    return state && profile && state[key] && state[key].indexOf(profile._id) !== -1 ? true : false;
  };

  // process
  const isProcessor = role !== 'receive' ? checkRoleCanAction('processors', profile, localState) : true;
  const isProcessorAuthor = role !== 'receive' ? checkRoleCanAction('processors', profile, localState, isAuthory) : true;
  // can complete
  const canCompleteAuthor = localState && localState.author && localState.signer && localState.author === localState.signer._id ? true : false;
  const completeAuthor =
    isAuthory && localState && localState.author && localState.signer && localState.author === localState.signer._id ? true : false;
  const complete = localState && profile && localState.signer && localState.signer._id === profile._id ? true : false;
  const canComplete = completeAuthor || complete;

  const checkComplete = () => {
    const isFreeComplete = localState.template;
    const isLastInTemplate = businessRole && businessRole.set_complete && businessRole.set_complete === true;
    return isFreeComplete || isLastInTemplate || canComplete;
  };
  const checkSetProcessor = () => {
    let result = isProcessorAuthor || isProcessor;
    return result;
  };

  //  Done
  const isDone = checkComplete() && checkSetProcessor();
  const isDoneAuthor = isAuthory && checkComplete() && checkSetProcessor();

  const canReturn = businessRole && businessRole.returnDocs && role !== 'receive' && localState.completeStatus === 'waitPromulgate';
  const canFeedBack = businessRole && businessRole.set_feedback && role !== 'receive' && localState.completeStatus === 'waitPromulgate';

  useEffect(() => {
    getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/outGoingDocument`).then(res => {
      if (res.status === 1) {
        setTemplates([{ ...res }]);
        fetchData(`${API_ORIGANIZATION}?processType=outGoingDocument&processId=${res._id}`).then(departmentsData => {
          const flattedDepartment = flatChild(departmentsData);
          console.log(flattedDepartment, 'flattedDepartment');
          setRecipient(flattedDepartment);
        });
      } else {
        onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng dự thảo', status: true });
      }
    });
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setCheckRequired(checkRequired);
    setCheckShowForm(checkShowForm);
    if (!id || id == 'add') {
      try {
        const listConfig = JSON.parse(localStorage.getItem('crmSource'));
        const defaultValue = {};
        defaultValue.urgencyLevel = data && listConfig.find(i => i.code === 'S20').data[0];
        defaultValue.documentType = data && listConfig.find(i => i.code === 'S19').data[0];
        defaultValue.privateLevel = data && listConfig.find(i => i.code === 'S21').data[0];
        defaultValue.documentField = listConfig.find(i => i.code === 'S26').data[0];
        handleChangeType('name')({ target: { value: defaultValue.documentField } });
        setLocalState(pre => ({ ...pre, ...defaultValue }));
      } catch (error) { }
    }
    fetchData(`${API_ORIGANIZATION}`)
      .then(departmentsData => {
        const flattedDepartmentFull = flatChild(departmentsData);
        console.log(flattedDepartmentFull, 'flattedDepartmentFull');
        setDepartmentFull(flattedDepartmentFull);
        // setRecipient(flattedDepartment);
      })
      .catch(err => {
        onChangeSnackbar({ variant: 'error', message: err.message || 'Lấy dữ liệu phòng ban thất bại!', status: true });
        setDepartmentFull([]);
      });

    return () => {
      newNam2Title;
      checkRequired;
      checkShowForm;
    };
  }, []);
  useEffect(() => {
    if (departmentFull && Array.isArray(departmentFull) && departmentFull.length) {
      setLocalState({ ...localState, senderUnit: departmentFull[0]._id, releaseDepartment: departmentFull[0]._id })
    }
  }, [departmentFull])
  useEffect(() => {
    let url = isAuthory ? `${API_ROLE_APP}/OutGoingDocument/${profile._id}?authority=true` : `${API_ROLE_APP}/OutGoingDocument/${profile._id}`;
    fetchData(url).then(res => {
      const { roles } = res;
      const code = 'BUSSINES';
      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
      setAllRoles(foundRoleDepartment);
    });
    if (urlParams.get('docId')) setFlagInToOut(urlParams.get('docId'));
  }, []);

  useEffect(
    () => {
      if (allRoles && profile) {
        let newCurrRole = '';
        if (role === 'receive') {
          newCurrRole = 'receive';
        }
        if (role === 'processors') {
          newCurrRole = 'processing';
        }
        if (role === 'release') {
          newCurrRole = 'release';
        }
        if (role === 'outgoing') {
          newCurrRole = 'textGo';
        }
        if (role === 'feedback') {
          newCurrRole = 'feedback';
        }
        const newBusinessRole = (allRoles && allRoles.data && allRoles.data.find(a => a.name === newCurrRole)) || {};
        const urlParams = new URLSearchParams(window.location.search);
        const docId = urlParams.get('docId');
        const toBookCode = urlParams.get('toBookCode');
        if (docId && toBookCode) {
          setLocalState(pre => ({ ...pre, answer4docCheck: true, answer4doc: [{ _id: docId, toBookCode }] }));
        }
        setBusinessRole(newBusinessRole && newBusinessRole.data);
      }
    },
    [allRoles, profile],
  );
  // Luog du thao
  useEffect(
    () => {
      if (openDialog || isDraft) {
        templates && templates[0] && templates[0].children && getDraft(templates[0].children);
      }
    },
    [openDialog, templates, id],
  );

  useEffect(
    () => {
      if (id && id !== 'add')
        fetch(`${requestURL}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            // if (data && data.recipientId && data.recipientId._id)
            //   setLocalState({ ...data, dataTask: data.tasks });
            //  setLocalState({ ...data, dataTask: data.tasks, recipientId: recipient.find(i => i._id === data.recipientId._id) });
            let datab = { ...data, dataTask: data.tasks };
            // datab.recipientIds && Array.isArray(datab.recipientIds) && datab.recipientIds.length > 0 && datab.recipientIds.map((el) => {
            //   el.recipientId = recipient.find(i => i._id === el.recipientId)
            // })
            let datas = [];
            datab.recipientIds &&
              Array.isArray(datab.recipientIds) &&
              datab.recipientIds.length > 0 &&
              datab.recipientIds.map(el => {
                datas.push(el.recipientId);
              });
            if (datab.recipientIds) setTempUnit(datab.recipientIds);
            setRoomApply(datas || []);
            setLocalState(datab);
            setDocId(data.docId);
            setCurrentRole(data.currentRole);
            setNextRole(data.nextRole);
            let dataa = [];
            data &&
              data.tasks &&
              Array.isArray(data.tasks) &&
              data.tasks.length > 0 &&
              data.tasks.map(el => {
                dataa.push(el._id);
              });
            setListDataTask(dataa);
          });
    },
    [id, recipient],
  );

  useEffect(
    () => {
      if (id) {
        getDetail(id);
      }
    },
    [id],
  );

  useEffect(
    () => {
      if (addSignedDocument && addSignedDocument.error) {
        setDisableSave(false);
      }
    },
    [addSignedDocument.error],
  );

  function onChangeFile(data) {
    setLocalState({
      ...localState,
      ...data,
    });
  }
  const getDetail = id => {
    setDocDetail({ name: 'abc' });
  };

  const handleChangeTab = (event, newValue) => {
    setIndex(newValue);
  };

  const handleInputChange = useCallback(
    (e, _name, _value) => {
      const name = e ? e.target.name : _name;
      const value = e ? e.target.value : _value;
      if (value.length === 0) {
        setLocalMessages(pre => ({ ...pre, [name]: true }));
      } else {
        setLocalMessages(e => ({ ...e, [name]: false }));
      }
      setLocalState(pre => ({ ...pre, [name]: value }));
    },
    [localState],
  );

  const handeChangeDepartment = useCallback(
    result => {
      const { department } = result;
      setLocalState({ ...localState, senderUnit: department });
    },
    [localState],
  );

  const handeChangeDepartmentTake = useCallback(
    result => {
      const { department } = result;
      setLocalState({ ...localState, recipientId: department });
    },
    [localState],
  );

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handleChangeType = name => e => {
    setLocalState(pre => ({ ...pre, [name]: e.target.value }));
  };

  const handleChangeCheckbox = name => e => {
    setLocalState({ ...localState, [name]: e.target.checked });
  };

  const cb = (id) => {
    // ra ngoài list
    props.history.push('/OutGoingDocument');
    // chuyển đến mà chờ ban hành
    props.history.push({
      pathname: `OutGoingDocument/editGoDocuments/${id}?role=release&tab=${0}`,
      state: null,
      id: id,
    });
  };

  const onSave = data => {
    let newDataConcat = localState.incommingDocument;
    if (newDataConcat.length == 0) {
      newDataConcat = newDataConcat.concat(data);
    } else {
      newDataConcat.forEach(item => {
        const index = data.findIndex(i => i._id === item._id);
        if (index !== -1) {
          data.splice(index, 1);
        }
      });
      newDataConcat = newDataConcat.concat(data);
    }
    setLocalState({ ...localState, incommingDocument: newDataConcat });
    setOpenDialogFilter(false);
  };
  const onGet = data => {
    if (toBookCode !== '') {
      let newDataConcat = localState.incommingDocument || [];
      if (newDataConcat.length == 0) {
        newDataConcat = newDataConcat.concat(data);
      } else {
        newDataConcat.forEach(item => {
          const index = data.findIndex(i => i._id === item._id);
          if (index !== -1) {
            data.splice(index, 1);
          }
        });
        newDataConcat = newDataConcat.concat(data);
      }
      setLocalState(pre => ({ ...pre, incommingDocument: newDataConcat }));
    }
  };
  const onSaveTask = data => {
    let newDataConcat = localState.dataTask || [];
    if (newDataConcat.length == 0) {
      newDataConcat = newDataConcat.concat(data);
    } else {
      newDataConcat.forEach(item => {
        const index = data.findIndex(i => i._id === item._id);
        if (index !== -1) {
          data.splice(index, 1);
        }
      });
      newDataConcat = newDataConcat.concat(data);
    }
    setLocalState({ ...localState, dataTask: newDataConcat });
    setOpenDialogTask(false);
  };
  const deleteDocs = index => {
    const newData = localState.incommingDocument.filter(item => item._id !== index);

    setLocalState({ ...localState, incommingDocument: newData });
  };
  const deleteTask = index => {
    const newData = localState.dataTask.filter(item => item._id !== index);
    setLocalState({ ...localState, dataTask: newData });
  };

  const saveAndSend = useCallback(
    onSaveSuccess => {
      const messages = viewConfigCheckForm(code, localState);
      if (Object.values(messages).filter(v => v).length) {
        return props.onChangeSnackbar({ variant: 'error', message: 'Vui lòng nhập đầy đủ các trường thông tin', status: true });
      }
      if (id) return id;
      let dataaa = [];
      let listTaskRemoved = [];
      if (localState.dataTask && Array.isArray(localState.dataTask) && localState.dataTask.length > 0)
        localState.dataTask.map(el => {
          dataaa.push(el._id);
        });
      listTaskRemoved = listDataTask.filter(x => !dataaa.includes(x));
      // localState.recipientIds.length > 0 && localState.recipientIds.map((el) => {
      //   el.recipientId = el.recipientId._id
      // })
      let body = {
        ...localState,
        tasks: localState.dataTask,
        drafter: localState.drafter ? localState.drafter._id : '',
        viewers: Array.isArray(localState.viewers) ? localState.viewers.map(i => i._id) : [],
        task: localState.taskCheck && localState.task ? localState.task.map(i => i._id) : [],
        answer4doc: Array.isArray(localState.answer4doc) ? localState.answer4doc.map(i => i._id) : [],
        sendingMan: localState.sendingMan,
        // receiver: localState.receiver,
        // recipientId: localState.recipientId && localState.recipientId._id,
        recipientIds: localState.recipientIds,
        listTaskRemoved: listTaskRemoved || [],
      };
      if (flagInToOut)
        body = {
          ...body,
          flagInToOut: flagInToOut,
        };
      onAddSignedDocument(body, onSaveSuccess);
    },
    [localState],
  );

  const handleSave = useCallback(
    () => {
      let localStateClone = localState
      localStateClone["drafter.name"] = localStateClone.drafter
      // delete localStateClone.drafter
      const messages = viewConfigCheckForm(code, localStateClone);
      setLocalMessages(messages);
      if (Object.values(messages).filter(v => v).length) {
        return onChangeSnackbar({ variant: 'error', message: 'Vui lòng nhập đầy đủ các trường thông tin', status: true });
      }
      let dataaa = [];
      let listTaskRemoved = [];
      if (localState.dataTask && Array.isArray(localState.dataTask) && localState.dataTask.length > 0)
        localState.dataTask.map(el => {
          dataaa.push(el._id);
        });

      listTaskRemoved = listDataTask.filter(x => !dataaa.includes(x));
      // localState.recipientIds.length > 0 && localState.recipientIds.map((el) => {
      //   el.recipientId = el.recipientId._id
      // })
      let body = {
        ...localState,
        tasks: localState.dataTask,
        drafter: localState.drafter ? localState.drafter._id : '',
        viewers: Array.isArray(localState.viewers) ? localState.viewers.map(i => i._id) : [],
        task: localState.taskCheck && localState.task ? localState.task.map(i => i._id) : [],
        answer4doc: Array.isArray(localState.answer4doc) ? localState.answer4doc.map(i => i._id) : [],
        sendingMan: localState.sendingMan,
        // receiver: localState.receiver,
        // recipientId: localState.recipientId && localState.recipientId._id,
        recipientIds: localState.recipientIds,
        listTaskRemoved: listTaskRemoved || [],
      };
      if (flagInToOut)
        body = {
          ...body,
          flagInToOut: flagInToOut,
        };
      body = {
        ...body,
        completeStatus: 'waitPromulgate',
        stage: 'complete',
        releaseDepartment: (props.profile && props.profile.organizationUnit && props.profile.organizationUnit.organizationUnitId) || '',
      };
      if (id) {
        onUpdateSignedDocument(body, cb);
        setDisableSave(true);
      } else {
        console.log('onAddSignedDocument', body);
        onAddSignedDocument(body, cb);
        setDisableSave(true);
      }
    },
    [localState],
  );

  function handleFileChange(e) {
    const files = e.target.files;
    for (const property in files) {
      if (property !== 'length' && typeof files[property] !== 'function') {
        const nameOfFile = files[property].name || ""
        let extName = nameOfFile.split('.').pop() || ""
        extName = extName.toLowerCase() || ""
        if (extName && ALLOW_FILE_EXT_UPLOAD.includes('.' + extName) === false || !extName) {
          return props.onChangeSnackbar({ variant: 'warning', message: 'Loại file không hợp lệ, vui lòng chọn lại!', status: true });
        }
        if (files[property] && typeof files[property] !== 'function' && files[property].size > FILE_SIZE_UPLOAD) {
          return props.onChangeSnackbar({ variant: 'warning', message: 'Dung lượng file quá lớn, vui lòng chọn lại!', status: true });
        }
      }
    }
    if (e.target.name === 'fileUpload2') {
      setLocalState(pre => ({ ...pre, fileDocument: [...pre.fileDocument, ...files] }));
    } else if (e.target.name === 'fileUpload') {
      setLocalState(pre => ({ ...pre, file: [...pre.file, ...files] }));
    } else if (e.target.name === 'fileUpload3') {
      setLocalState(pre => ({ ...pre, fileList: [...pre.fileList, ...files] }));
    }
  }

  function handleFileDelete(f, name = '') {
    if (name === 'fileUpload2') {
      const newFiles = localState.fileDocument.filter((i, idx) => idx !== f);
      setLocalState({ ...localState, fileDocument: newFiles });
    } else if (name === 'fileUpload') {
      const newFiles = localState.file.filter((i, idx) => idx !== f);
      setLocalState({ ...localState, file: newFiles });
    } else if (name === 'fileUpload3') {
      const newFiles = localState.fileList.filter((i, idx) => idx !== f);
      setLocalState({ ...localState, fileList: newFiles });
    }
  }
  const isEndFlow = localState && localState.children && localState.children.length > 0 && !localState.children[0].children ? false : true;
  const isEndTemp = profile && templates && checkCanProcess(templates, localState);

  useEffect(
    () => {
      if (role === 'processors' && localState.processeds && localState.processeds.length > 0) {
        let findIndex;
        if (localState && localState.author) {
          findIndex = localState.processeds.findIndex(f => f === localState.author);
        } else {
          findIndex = localState.processeds.findIndex(f => f === profile._id);
        }
        let result = [];
        if (findIndex !== -1) {
          result = findIndex - 1 === 0 ? [localState.processeds[0]] : [localState.processeds[findIndex - 1]];
        } else {
          result = [localState.processeds[localState.processeds.length - 1]];
        }
        let user = { filter: { _id: { $in: result } } };
        user &&
          fetch(`${API_USERS}/?${serialize(user)}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
            .then(response => response.json())
            .then(res => {
              if (res && res.data) {
                setAllowedUsers(res.data);
              }
            });
      }
    },
    [role, openDialogResponse, localState],
  );

  const handleOpenDialogDoc = (bool, type) => {
    if (type === 'assign') {
      setOpenAsignProcessor(bool);
    } else if (type === 'release') {
      setOpenRelease(bool);
    } else {
      setOpenReturnDocs(bool);
    }
  };

  const handleOpen = (e, type, isReturn = false) => {
    if (type === 'command') {
      setOpenSetCommanders(true);
      return;
    }
    if ((type === 'receive' || type === 'processors') && isReturn === false) {
      setOpenDialog(e.currentTarget);
      return;
    }
    if (type !== 'receive' && isReturn) {
      setOpenDialogResponse(e.currentTarget);
      return;
    }
  };

  const closeDialog = e => {
    setOpenDialogFilter(false);
  };
  const closeDialogTask = e => {
    setOpenDialogTask(false);
  };
  const mapCate = cate => {
    switch (cate) {
      case 1:
        return 'Xứ lý công văn';
      case 2:
        return 'Xứ lý công việc';
      case 3:
        return 'Xứ lý hồ sơ';
      case 4:
        return 'Xứ lý đơn thư';
    }
  };

  const handleClose = e => {
    setOpenDialog(null);
    setOpenDialogResponse(null);
    setOpenReturnDocs(false);
    setOpenAsignProcessor(false);
    setOpenSetCommanders(false);
    setAllowedUsers([]);
  };

  const getDraft = data => {
    if (data) {
      data.map(item => {
        if (item.code === profile.roleGroupSource) {
          setDraftData(item);
        }
      });
    }
  };
  const getBookCode = async toBookCode => {
    let result = [];
    const query = {
      filter: { toBookCode: toBookCode },
      limit: 1,
    };
    const json = await fetch(`${API_INCOMMING_DOCUMENT}?${serialize(query)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
        'Content-Type': 'application/json',
      },
    });
    let data = await json.json();
    if (data && data.data && data.data.length > 0) {
      data.data &&
        data.data.map(item => {
          if (item.toBookCode == toBookCode) {
            result.push(item);
          }
        });
    }
    onGet(result);
  };

  useEffect(
    () => {
      if (toBookCode) {
        getBookCode(toBookCode);
      }
    },
    [toBookCode],
  );

  const onCloseProject = () => {
    if (props.history && props.location && props.location.state && props.location.state.status !== true) {
      props.history.goBack();
    } else if (props.callback) props.callback();
  };

  const checkForm = value => {
    return viewConfigCheckShowForm(code, value, '', 'checkedShowForm');
  };

  const openScanDialog = name => {
    setScanDialog({ name });
  };
  const mapFunctionCalendar = item => {
    return {
      ...item,
      createdBy: item['createdBy.name'] ? item['createdBy.name'] : null,
      typeCalendar: item.typeCalendar === '1' ? 'Lịch cá nhân' : 'Lịch đơn vị',
      'organizer.name': item.organizer ? item.organizer : null,
      task: item['task.name'],
      roomMetting: item['roomMetting.name'],
      approved: item['approved.name'],
    };
  };
  const addItem = (link, code, id) => (
    <Add
      style={{ color: 'white' }}
      onClick={() =>
        props.history &&
        props.history.push({
          pathname: link,
          state: { code, idd: id },
        })
      }
    >
      Thêm mới
    </Add>
  );
  const handleDeleteItem = () => {
    if (idDelete.id && idDelete.type) {
      if (idDelete.type === 'deleteTask') {
        deleteTask(idDelete.id);
        setOpenDialogDelete(false), setIdDelete({});
      } else if (idDelete.type === 'deleteDocs') {
        deleteDocs(idDelete.id);
        setOpenDialogDelete(false), setIdDelete({});
      }
    }
  };
  const handleDeleteIds = () => {
    let { recipientIds } = localState;
    // const temp = recipientIds.splice(idDeletee, 1);
    // const tempUnitt = temp && temp[0] && tempUnit.filter((el) => el.recipientId !== temp[0].recipientId) || false
    // if (tempUnitt) {
    //   let data = []
    //   tempUnit.map((el) => {
    //     if (el.recipientId !== tempUnitt.recipientId) data.push(el)
    //   })
    //   console.log(data, "data")
    //   setTempUnit(data)
    // }
    // console.log(temp, "temp", tempUnitt, tempUnit)

    let room = [];
    recipientIds.map(el => {
      room.push(el.recipientId);
    });
    setRoomApply(room);
    setLocalState({ ...localState, recipientIds });
    setOpenDialogDeletee(false);
    setIdDeletee();
  };
  useEffect(
    () => {
      setEmployeeFilter(null);
      setTimeout(() => {
        setEmployeeFilter({ ['organizationUnit.organizationUnitId']: recipientIdTemp });
      }, 1);
    },
    [recipientIdTemp],
  );
  useEffect(
    () => {
      let id = recipient.length !== 0 ? recipient.find(i => i.level === 0)._id : '';
      setViewersEmployeeFilter({ ['organizationUnit.organizationUnitId']: id });
    },
    [recipient],
  );
  useEffect(
    () => {
      const { location } = props;
      const { state } = location;
      let data = [];
      setStatusTask(false);
      if (state && state.dataTask) {
        data.push(state.dataTask);
        setLocalState({ ...localState, dataTask: [...data] });
        setStatusTask(true);
        setOldTask([...data]);
      }
    },
    [props],
  );
  const handleEditItem = (e, index) => {
    setopenDialogEdit(true);
    setReceiverTemp(e.receivers);
    setRecipientIdTemp(e.recipientId);
    setIndArray(index);
  };
  const recipientUnit = (el, ind) => {
    return (
      <>
        <Grid item xs={12} md={12} container spacing={8}>
          <Grid item xs={5}>
            {/* <Autocomplete
              disabled
              // onChange={value => setLocalState({ ...localState, recipientId: value })}
              suggestions={recipient}
              value={el.recipientId}
              label="Đơn vị nhận"

            /> */}

            <CustomInputBase disabled select value={el.recipientId} label="Đơn vị nhận" variant="outlined" fullWidth>
              {recipient.map(item => (
                <MenuItem value={item.id}>{item.title}</MenuItem>
              ))}
            </CustomInputBase>
          </Grid>
          <Grid item xs={5}>
            {employeeFilter !== null && (
              <AsyncAutocomplete
                disabled
                filter={employeeFilter}
                value={el.receivers}
                // onChange={e => setLocalState({ ...localState, receiver: e })}
                label="Cán bộ nhận"
                limit="5000"
                url={API_PERSONNEL_RECEIVER}
                isMulti
              />
            )}
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Cập nhật">
              <Edit
                fontSize="small"
                color="primary"
                style={{ marginTop: '21px' }}
                onClick={() => {
                  handleEditItem(el, ind);
                }}
              />
            </Tooltip>
          </Grid>

          <Grid item xs={1}>
            <Tooltip title="Xóa">
              <Delete
                fontSize="small"
                color="primary"
                style={{ marginTop: '21px' }}
                onClick={() => {
                  setOpenDialogDeletee(true);
                  setIdDeletee(ind);
                }}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </>
    );
  };

  const handleAddItem = () => {
    let rooms = [];
    tempUnit.map(el => {
      rooms.push(el.recipientId);
    });
    let result = tempUnit.filter(x => roomApply.includes(x.recipientId));
    let resultRoomNoReceivers = roomApply.filter(x => !rooms.includes(x));

    if (Array.isArray(resultRoomNoReceivers) && resultRoomNoReceivers.length > 0)
      resultRoomNoReceivers.map(el => {
        result.push({ recipientId: el });
      });
    setLocalState({ ...localState, recipientIds: result });
    setopenDialogAdd(false);
  };
  const handleEditItemm = () => {
    let { recipientIds } = localState;
    if (!recipientIdTemp) return props.onChangeSnackbar({ variant: 'warning', message: 'Đồng chí chưa chọn đơn vị nhận', status: true });
    else {
      if (indArray === undefined || isNaN(indArray)) {
        recipientIds.push({ recipientId: recipientIdTemp, receivers: receiverTemp });
      } else recipientIds[indArray] = { recipientId: recipientIdTemp, receivers: receiverTemp };
    }
    setLocalState({ ...localState, recipientIds: recipientIds });
    setRecipientIdTemp();
    setReceiverTemp();
    setopenDialogEdit(false);
  };
  // const handleChangeUnit = (value) => {
  //   const { recipientIds } = localState
  //   if (recipientIds.length > 0) {
  //     recipientIds.map((el) => {

  //       if (el.recipientId._id === value._id) {
  //         setopenDialogAdd(false)
  //         setRecipientIdTemp()
  //         setReceiverTemp()
  //         return props.onChangeSnackbar({ variant: 'warning', message: 'Đơn vị nhận này đã tồn tại, đồng chí vui lòng chọn lại ', status: true });
  //       }
  //     })
  //   }
  //   setRecipientIdTemp(value)
  //   setReceiverTemp()
  // }
  const handleChangeAllowedSellingOrganization = viewedDepartmentIds => {
    setRoomApply(viewedDepartmentIds);
    // setTempUnit(viewedDepartmentIds);
    // let tempUnitt = [];
    // let temp = tempUnit;
    // tempUnit.map(el => {
    //   tempUnitt.push(el.recipientId);
    // });

    // let result = viewedDepartmentIds.filter(x => !tempUnitt.includes(x));
    // console.log(result, 'result', tempUnitt, tempUnit);
    // if (result) {
    //   temp.push({ recipientId: result[0] });
    //   setTempUnit(temp);
    // }
  };
  const handleChangeUserUnit = (der, user) => {
    let tempUnitt = tempUnit;
    const temp = tempUnitt.find(element => element.recipientId === der);
    if (!temp) {
      tempUnitt.push({
        recipientId: der,
        receivers: user,
      });
      setTempUnit(tempUnitt);
    } else {
      // const tempUnittt = tempUnitt.map(obj => [temp].find(o => o.recipientId === obj.recipientId) || obj);

      tempUnitt.map(el => (el.recipientId === der ? (el.receivers = user) : el));
      setTempUnit(tempUnitt);
    }
  };
  return (
    <SwipeableDrawer
      anchor="right"
      // onClose={() => this.setState({ openEditDialog: false })}
      open={openCustom}
      width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
    >
      <div style={{ width: 'calc(100vw - 260px)' }}>
        <Dialogg
          onClose={() => {
            setOpenDialogDelete(false), setIdDelete({});
          }}
          aria-labelledby="customized-dialog-title"
          open={openDialogDelete}
          maxWidth="md"
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Thông báo
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>Đồng chí có chắc chắn muốn xóa?.</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleDeleteItem} color="primary" variant="contained">
              Đồng ý
            </Button>
            <Button
              onClick={() => {
                setOpenDialogDelete(false), setIdDelete({});
              }}
              color="secondary"
              variant="contained"
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialogg>
        <Dialog
          onClose={() => {
            setopenDialogEdit(false);
            setRecipientIdTemp();
            setReceiverTemp();
          }}
          aria-labelledby="customized-dialog-title"
          open={openDialogEdit}
          dialogAction={false}
        >
          <div>
            <div style={{ minHeight: 300 }}>
              <Typography
                variant="body2"
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}
              >
                {' '}
                {indArray === undefined || isNaN(indArray) ? 'Thêm mới đơn vị nhận' : 'Cập nhật đơn vị nhận'}
              </Typography>
              <Grid container spacing={8}>
                <Grid item xs={6}>
                  {/* <Autocomplete
                  onChange={value => {
                    handleChangeUnit(value)

                  }}
                  suggestions={recipient}
                  value={recipientIdTemp}
                  label="Đơn vị nhận"
                  fullWidth
                  disabled
                /> */}

                  <CustomInputBase disabled select value={recipientIdTemp} label="Đơn vị nhận" variant="outlined" fullWidth>
                    {recipient.map(item => (
                      <MenuItem value={item.id}>{item.title}</MenuItem>
                    ))}
                  </CustomInputBase>
                </Grid>
                <Grid item xs={6}>
                  {employeeFilter !== null && (
                    <AsyncAutocomplete
                      filter={employeeFilter}
                      value={receiverTemp}
                      onChange={e => {
                        if (!recipientIdTemp)
                          return props.onChangeSnackbar({ variant: 'warning', message: 'Đồng chí chưa chọn đơn vị nhận', status: true });
                        setReceiverTemp(e);
                      }}
                      // filter={{ ['organizationUnit.organizationUnitId']: data[rowIndex].id }}
                      label="Cán bộ nhận"
                      limit="5000"
                      url={API_PERSONNEL_RECEIVER}
                      isMulti
                      fullWidth
                    />
                  )}
                </Grid>
              </Grid>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button autoFocus onClick={() => handleEditItemm()} color="primary" variant="contained" style={{ marginRight: 10 }}>
                Lưu
              </Button>
              <Button
                onClick={() => {
                  setopenDialogEdit(false);
                  setRecipientIdTemp();
                  setReceiverTemp();
                }}
                color="secondary"
                variant="contained"
              >
                Hủy
              </Button>
            </div>
          </div>
        </Dialog>

        <Dialogg
          open={openDialogAdd}
          onClose={() => {
            setopenDialogAdd(false);
            // const { recipientIds } = localState;
            // let room = [];
            // recipientIds.map(el => {
            //   room.push(el.recipientId);
            // });
            // setRoomApply(room);
            // setTempUnit(recipientIds);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Áp dụng cho</DialogTitle>
          <DialogContent>
            <DepartmentSelect
              title=""
              allowedDepartmentIds={roomApply || []}
              onChange={handleChangeAllowedSellingOrganization}
              isMultiple
              customTitle="Áp dụng"
              handleChangeUserUnit={handleChangeUserUnit}
              tempUnit={tempUnit}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleAddItem();
              }}
            >
              LƯU
            </Button>
            <Button
              variant="contained"
              color="secondary"
              autoFocus
              onClick={() => {
                setopenDialogAdd(false);
                const { recipientIds } = localState;
                let room = [];
                recipientIds.map(el => {
                  room.push(el.recipientId);
                });
                setRoomApply(room);
                setTempUnit(recipientIds);
              }}
            >
              HỦY
            </Button>
          </DialogActions>
        </Dialogg>
        <CustomAppBar
          title={id ? 'Chỉnh sửa ban hành' : 'Thêm mới ban hành'}
          onGoBack={() => {
            setOpenCustom(false);
            onCloseProject();
            isAuthory ? props.history.push('/AuthorityDocument') : props.history.push('/OutGoingDocument');
          }}
          disableSave={disableSave}
          onSubmit={handleSave}
        />
        <div>
          <Grid container>
            <Tabs onChange={handleChangeTab} value={index}>
              <Tab label="Thông tin chung" />
              <Tab disabled={id == null} label="Hồ sơ công việc" />
              <Tab disabled={id == null} label="Lịch cá nhân" />
              <Tab disabled={id == null} label="Nguồn gốc" />
            </Tabs>
          </Grid>
        </div>

        {index === 0 ? (
          <PaperUI style={{ zIndex: '0 !important', marginTop: 20 }}>
            <Grid container spacing={8}>
              {/* flattedDepartmentFull */}
              {/* <Grid item xs={3}>
                <Department
                  labelDepartment={_.get(name2Title, 'senderUnit', 'Đơn vị soạn thảo')}
                  onChange={handeChangeDepartment}
                  department={localState.senderUnit}
                  disableEmployee
                  profile={profile}
                  // disabled
                  isNoneExpand={true}
                  moduleCode="OutGoingDocument"
                  className={checkRequired.senderUnit ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                />
              </Grid>
              <Grid item xs={3}>
                <Department
                  labelDepartment={name2Title.releaseDepartment || "Đơn vị ban hành"}
                  onChange={(result)=>{
                    console.log(result, 'e')
                    const { department } = result;
                    setLocalState({ ...localState, releaseDepartment: department });
                  }}
                  department={localState.releaseDepartment}
                  disableEmployee
                  profile={profile}
                  // disabled
                  isNoneExpand={true}
                  moduleCode="OutGoingDocument"
                  className={checkRequired.senderUnit ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                />
                
              </Grid> */}
              <Grid item xs={3}>
                <CustomInputBase
                  label={name2Title.senderUnit}
                  select
                  value={localState.senderUnit}
                  onChange={async (e) => {
                    await setReloadUser(false)
                    setLocalState({ ...localState, senderUnit: e.target.value, drafter: null });
                    // setTimeout(() => {
                    //   setReloadUser(true)
                    // }, 500);
                    setReloadUser(true)
                  }}
                  fullWidth
                >
                  {departmentFull &&
                    Array.isArray(departmentFull) &&
                    departmentFull.length &&
                    departmentFull.map(i => (
                      <MenuItem value={i._id} style={{ paddingLeft: i.level * 15 }}>
                        {i.title}
                      </MenuItem>
                    ))}
                </CustomInputBase>
              </Grid>
              <Grid item xs={3}>

                <CustomInputBase
                  label={name2Title.releaseDepartment}
                  select
                  value={localState.releaseDepartment}
                  onChange={e => {
                    setLocalState({ ...localState, releaseDepartment: e.target.value });

                  }}
                  fullWidth
                >
                  {departmentFull &&
                    Array.isArray(departmentFull) &&
                    departmentFull.length &&
                    departmentFull.map(i => (
                      <MenuItem value={i._id} style={{ paddingLeft: i.level * 15 }}>
                        {i.title}
                      </MenuItem>
                    ))}
                </CustomInputBase>

              </Grid>
              {
                reloadUser && <Grid item xs={3}>
                  <AsyncAutocomplete
                    name="Chọn "
                    label="Người soạn thảo"
                    onChange={e => {
                      handleChangeType('drafter')({ target: { value: e } });
                    }}
                    value={localState.drafter}

                    // {'organizationUnit.organizationUnitId':localState.releaseDepartment && localState.releaseDepartment._id}


                    url={`${API_USERS_SEARCH}?${serialize({ filter: { 'organizationUnit.organizationUnitId': localState.senderUnit } })}`}

                    // url={`${API_USERS}?${serialize({ filter: { 'organizationUnit.organizationUnitId':localState.senderUnit } })}`}
                    error={localMessages && localMessages['drafter.name']}
                    helperText={localMessages && localMessages['drafter.name']}
                    required={checkRequired['drafter.name']}
                    checkedShowForm={checkShowForm['drafter.name']}
                  // disabled
                  />
                </Grid>
              }


              <Grid item xs={3}>
                <CustomInputField
                  label={_.get(name2Title, 'documentType', 'Loại văn bản')}
                  onChange={handleChangeType('documentType')}
                  value={localState.documentType}
                  configType="crmSource"
                  configCode="S19"
                  type="Source|CrmSource,S19|Value||value"
                  error={localMessages && localMessages.documentType}
                  helperText={localMessages && localMessages.documentType}
                  required={checkRequired.documentType}
                  checkedShowForm={checkShowForm.documentType}
                  className={checkRequired.documentType ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                  disableDelete
                />
              </Grid>

              <Grid item xs={3}>
                <CustomInputField
                  label={_.get(name2Title, 'urgencyLevel', 'Độ khẩn')}
                  configType="crmSource"
                  configCode="S20"
                  type="Source|CrmSource,S20|Value||value"
                  name="urgencyLevel"
                  value={localState.urgencyLevel}
                  onChange={handleChangeType('urgencyLevel')}
                  error={localMessages && localMessages.urgencyLevel}
                  helperText={localMessages && localMessages.urgencyLevel}
                  required={checkRequired.urgencyLevel}
                  checkedShowForm={checkShowForm.urgencyLevel}
                  className={checkRequired.urgencyLevel ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                  disableDelete
                />
              </Grid>

              <Grid item xs={3}>
                <CustomInputField
                  label={_.get(name2Title, 'privateLevel', 'Độ mật')}
                  configType="crmSource"
                  configCode="S21"
                  type="Source|CrmSource,S21|Value||value"
                  name="privateLevel"
                  value={localState.privateLevel}
                  onChange={handleChangeType('privateLevel')}
                  error={localMessages && localMessages.privateLevel}
                  helperText={localMessages && localMessages.privateLevel}
                  required={checkRequired.privateLevel}
                  checkedShowForm={checkShowForm.privateLevel}
                  className={checkRequired.privateLevel ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                  disableDelete
                />
              </Grid>

              <Grid item xs={3}>
                <CustomInputField
                  label={_.get(name2Title, 'documentField', 'Lĩnh vực')}
                  configType="crmSource"
                  configCode="S26"
                  type="Source|CrmSource,S26|Value||value"
                  name="documentField"
                  value={localState.documentField}
                  onChange={handleChangeType('documentField')}
                  error={localMessages && localMessages.documentField}
                  helperText={localMessages && localMessages.documentField}
                  required={checkRequired.documentField}
                  checkedShowForm={checkShowForm.documentField}
                  className={checkRequired.documentField ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                  disableDelete
                />
              </Grid>
              <Grid item xs={3}>
                <AsyncAutocomplete
                  name="Chọn "
                  label={'Người ký'}
                  onChange={e => {
                    handleChangeType('signer')({ target: { value: e } });
                  }}
                  // order={order}
                  value={localState.signer}
                  isSinged={true}
                  url={`${API_OUTGOING_DOCUMENT_SINGER}`}
                  error={localMessages && localMessages.signer}
                  helperText={localMessages && localMessages.signer}
                  required={checkRequired.signer}
                  checkedShowForm={checkShowForm.signer}
                  defaultOptions
                />
              </Grid>

              {/* <Grid item xs={3}>
                <CustomInputBase
                  label={_.get(name2Title, 'textSymbols', 'Ký hiệu ban hành')}
                  value={localState.textSymbols}
                  name="textSymbols"
                  onChange={e => handleInputChange(e)}
                // disabled={(id ? (localState.isAnyDepartment ? false : true) : false) && isDocOut}
                // disabled
                // error={localMessages && localMessages.textSymbols}
                // helperText={localMessages && localMessages.textSymbols}
                // required={checkRequired.textSymbols}
                // checkedShowForm={checkShowForm.textSymbols}
                // onChange={handleChangeType('textSymbols')}
                // className={
                //   checkRequired && checkRequired.textSymbols && checkRequired.textSymbols === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                // }
                />
              </Grid> */}
              <Grid item xs={3}>
                <CustomInputBase
                  label={_.get(name2Title, 'recipientsOutSystem', 'Nơi nhận ngoài HT')}
                  value={localState.recipientsOutSystem}
                  name="recipientsOutSystem"
                  onChange={e => handleInputChange(e)}
                />
              </Grid>

              <Grid item xs={3}>
                {recipient.length !== 0 && (
                  <AsyncAutocomplete
                    name="Chọn "
                    label={_.get(name2Title, 'viewers', 'Nơi nhận')}
                    onChange={e => {
                      handleChangeType('viewers')({ target: { value: e } });
                    }}
                    value={localState.viewers}
                    url={API_PERSONNEL_RECEIVER}
                    isMulti
                    filter={viewersEmployeeFilter}
                    limit="5000"
                    error={localMessages && localMessages.viewers}
                    helperText={localMessages && localMessages.viewers}
                    required={checkRequired.viewers}
                    checkedShowForm={checkShowForm.viewers}
                    className={checkRequired.viewers ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                    defaultOptions
                  />
                )}
              </Grid>
              <CustomGroupInputField code={code} columnPerRow={4} value={localState.others} onChange={handleOtherDataChange} autoDown />

              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={4}>
                    <FormControl>
                      {id && Array.isArray(localState.answer4doc) && localState.answer4doc.length > 0 ? (
                        <FormControlLabel
                          control={
                            <Checkbox checked={true} onChange={handleChangeCheckbox('answer4docCheck')} value="answer4docCheck" color="primary" />
                          }
                          label={_.get(name2Title, 'answer4doc', 'Phúc đáp văn bản')}
                        />
                      ) : (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={localState.answer4docCheck}
                              onChange={handleChangeCheckbox('answer4docCheck')}
                              value="answer4docCheck"
                              color="primary"
                            />
                          }
                          label={_.get(name2Title, 'answer4doc', 'Phúc đáp văn bản')}
                        />
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container spacing={8}>
                      {localState.answer4docCheck === true ? (
                        <Grid item xs={12}>
                          <AsyncAutocomplete
                            id="outlined-basic"
                            label={_.get(name2Title, 'answer4doc', 'Phúc đáp văn bản')}
                            url={API_INCOMMING_DOCUMENT}
                            onChange={e => {
                              handleChangeType('incommingDocument')({ target: { value: e } });
                            }}
                            value={localState.incommingDocument}
                            filter={{ stage: { $ne: 'receive' } }}
                            customOptionLabel={option => `${option.toBookCode}`}
                            filters={['toBookCode']}
                            defaultOptions
                            isMulti
                            error={localMessages && localMessages.answer4doc}
                            helperText={localMessages && localMessages.answer4doc}
                            required={checkRequired.answer4doc}
                            checkedShowForm={checkShowForm.answer4doc}
                            className={checkRequired.answer4doc ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                          />
                        </Grid>
                      ) : id && Array.isArray(localState.answer4doc) && localState.answer4doc.length > 0 ? (
                        <Grid item xs={12} />
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item style={{ maxHeight: '250px' }}>
                  <Typography variant="h6" style={{ fontSize: 13 }}>
                    {' '}
                    Danh sách đơn vị nhận
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} style={{ display: 'flex', justifyContent: 'flex-end', color: 'blue' }}>
                  <Tooltip title="Thêm đơn vị nhận">
                    <Add
                      style={{ fontSize: 16 }}
                      onClick={() => {
                        setopenDialogAdd(true);
                      }}
                    />
                  </Tooltip>
                </Grid>
              </Grid>

              <>
                {localState.recipientIds &&
                  Array.isArray(localState.recipientIds) &&
                  localState.recipientIds.length > 0 &&
                  localState.recipientIds.map((el, index) => {
                    return <>{recipientUnit(el, index)}</>;
                  })}
              </>

              {checkForm('sendingMan') && (
                <Grid item xs={3}>
                  <Autocomplete
                    onChange={value => setLocalState({ ...localState, sendingMan: value })}
                    suggestions={dataSendPlace}
                    value={localState.sendingMan}
                    label={_.get(name2Title, 'sendingMan')}
                    checkedShowForm={checkShowForm.sendingMan}
                    required={checkRequired.sendingMan}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <CustomInputBase
                  autoFocus={id && id === 'add'}
                  rows={5}
                  multiline
                  label={_.get(name2Title, 'abstractNote', 'Trích yếu')}
                  value={localState.abstractNote}
                  name="abstractNote"
                  onChange={e => handleInputChange(e)}
                  helperText={localMessages && localMessages.abstractNote}
                  required={checkRequired.abstractNote}
                  checkedShowForm={checkShowForm.abstractNote}
                  className={
                    checkRequired && checkRequired.abstractNote && checkRequired.abstractNote === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                  error={localMessages && localMessages.abstractNote}
                />
              </Grid>

              <Grid item xs={6}>
                <Grid container>
                  {profile &&
                    profile.signer === true && (
                      <Grid item xs={4}>
                        <FormControl>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={localState.caSignCheck ? true : false}
                                onChange={handleChangeCheckbox('caSignCheck')}
                                value="caSignCheck"
                                color="primary"
                              />
                            }
                            label={_.get(name2Title, 'caSignCheck', 'Ký CA')}
                          />
                        </FormControl>
                      </Grid>
                    )}
                  {profile &&
                    profile.canProcessAny === true && (
                      <Grid item xs={4}>
                        <FormControl>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={localState.autoReleaseCheck ? true : false}
                                onChange={handleChangeCheckbox('autoReleaseCheck')}
                                value="autoReleaseCheck"
                                color="primary"
                              />
                            }
                            label={_.get(name2Title, 'autoReleaseCheck', 'Tự động ban hành')}
                          />
                        </FormControl>
                      </Grid>
                    )}
                  {/* {profile &&
                    profile.inherit === true && (
                      <Grid item xs={4}>
                        <FormControl>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={localState.inherit ? true : false}
                                onChange={handleChangeCheckbox('inherit')}
                                value="inherit"
                                color="primary"
                              />
                            }
                            label={_.get(name2Title, 'inherit', 'Thừa lệnh/Thừa uỷ quyền')}
                          />
                        </FormControl>
                      </Grid>
                    )} */}
                  {/* Lỗi ở đây */}
                  <Grid item xs={8}>
                    <Grid container spacing={8}>
                      {localState.answer4docCheck === true ? (
                        <Grid item xs={12}>
                          {/* <AsyncAutocomplete
                            id="outlined-basic"
                            label={_.get(name2Title, 'answer4doc', 'Tự động ban hành')}
                            url={API_INCOMMING_DOCUMENT}
                            onChange={e => {
                              handleChangeType('answer4doc')({ target: { value: e } });
                            }}
                            value={localState.answer4doc}
                            filter={{ stage: { $ne: 'receive' } }}
                            customOptionLabel={option => `${option.toBookCode}`}
                            filters={['toBookCode']}
                            defaultOptions
                            isMulti
                            error={localMessages && localMessages.answer4doc}
                            helperText={localMessages && localMessages.answer4doc}
                            required={checkRequired.answer4doc}
                            checkedShowForm={checkShowForm.answer4doc}
                            className={checkRequired.answer4doc ? "CustomRequiredLetter" : 'CustomIconRequired'}

                          /> */}
                        </Grid>
                      ) : id && Array.isArray(localState.answer4doc) && localState.answer4doc.length > 0 ? (
                        <Grid item xs={12}>
                          {/* <AsyncAutocomplete
                            id="outlined-basic"
                            label={_.get(name2Title, 'answer4doc', 'Phúc đáp văn bản')}
                            url={API_INCOMMING_DOCUMENT}
                            onChange={e => {
                              handleChangeType('answer4doc')({ target: { value: e } });
                            }}
                            value={localState.answer4doc}
                            filter={{ stage: { $ne: 'receive' } }}
                            customOptionLabel={option => `${option.toBookCode}`}
                            filters={['toBookCode']}
                            defaultOptions
                            isMulti
                            error={localMessages && localMessages.answer4doc}
                            helperText={localMessages && localMessages.answer4doc}
                            required={checkRequired.answer4doc}
                            checkedShowForm={checkShowForm.answer4doc}
                            className={checkRequired.answer4doc ? "CustomRequiredLetter" : 'CustomIconRequired'}
                          /> */}
                        </Grid>
                      ) : null}
                      {localState.taskCheck === true ? (
                        <Grid item xs={12}>
                          <AsyncAutocomplete
                            id="outlined-basic"
                            label={_.get(name2Title, 'task', 'Công việc liên quan')}
                            url={API_TASK_PROJECT}
                            onChange={e => {
                              handleChangeType('task')({ target: { value: e } });
                            }}
                            value={localState.task}
                            defaultOptions
                            isMulti
                            error={localMessages && localMessages.task}
                            helperText={localMessages && localMessages.task}
                            required={checkRequired.task}
                            checkedShowForm={checkShowForm.task}
                            className={checkRequired.task ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                          />
                        </Grid>
                      ) : id && Array.isArray(localState.task) && localState.task.length > 0 ? (
                        <Grid item xs={12}>
                          <AsyncAutocomplete
                            id="outlined-basic"
                            label={_.get(name2Title, 'task', 'Công việc liên quan')}
                            url={API_TASK_PROJECT}
                            onChange={e => {
                              handleChangeType('task')({ target: { value: e } });
                            }}
                            value={localState.task}
                            defaultOptions
                            isMulti
                            error={localMessages && localMessages.task}
                            helperText={localMessages && localMessages.task}
                            required={checkRequired.task}
                            checkedShowForm={checkShowForm.task}
                            className={checkRequired.task ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                          />
                        </Grid>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* PHÚC ĐÁP VĂN BẢN */}
              {
                // <>
                //   <Grid item xs={12} style={{ marginTop: 20 }}>
                //     <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black' }}>PHÚC ĐÁP VĂN BẢN</span>
                //     <label style={{ display: 'inline-block', marginRight: 10 }}>
                //       <Button
                //         color="primary"
                //         variant="contained"
                //         onClick={() => {
                //           setOpenDialogFilter(true);
                //         }}
                //         component="span"
                //       >
                //         <span style={{ fontWeight: 'bold' }}>Tìm kiếm</span>
                //       </Button>
                //     </label>
                //     <Table>
                //       <TableHead>
                //         <TableRow>
                //           <TableCell className={classes.tableCell || ''} style={{ cursor: 'pointer', alignItems: 'center', fontWeight: 'bold' }}>
                //             Số văn bản
                //           </TableCell>
                //           <TableCell className={classes.tableCell || ''} style={{ cursor: 'pointer', alignItems: 'center', fontWeight: 'bold' }}>
                //             Ngày văn bản
                //           </TableCell>
                //           <TableCell className={classes.tableCell || ''} style={{ cursor: 'pointer', alignItems: 'center', fontWeight: 'bold' }}>
                //             Trích yếu
                //           </TableCell>
                //           <TableCell className={classes.tableCell || ''} style={{ cursor: 'pointer', alignItems: 'center', fontWeight: 'bold' }}>
                //             Hành động
                //           </TableCell>
                //         </TableRow>
                //       </TableHead>
                //       <TableBody>
                //         {localState.incommingDocument &&
                //           localState.incommingDocument.map((item, index) => {
                //             return (
                //               <TableRow>
                //                 <TableCell
                //                   onClick={e => {
                //                     e.preventDefault();
                //                     setIdEdit(item._id);
                //                     setOpenEditDialog(true);
                //                   }}
                //                   className={classes.tableCell || ''}
                //                   style={{ cursor: 'pointer', alignItems: 'center', color: 'blue' }}
                //                 >
                //                   {item.toBook}
                //                 </TableCell>
                //                 <TableCell
                //                   onClick={e => {
                //                     e.preventDefault();
                //                     setIdEdit(item._id);
                //                     setOpenEditDialog(true);
                //                   }}
                //                   className={classes.tableCell || ''}
                //                   style={{ cursor: 'pointer', alignItems: 'center', color: 'blue' }}
                //                 >
                //                   {id ? moment(item.documentDate).format('DD/MM/YYYY') : item.documentDate}
                //                 </TableCell>
                //                 <TableCell
                //                   onClick={e => {
                //                     e.preventDefault();
                //                     setIdEdit(item._id);
                //                     setOpenEditDialog(true);
                //                   }}
                //                   className={classes.tableCell || ''}
                //                   style={{ cursor: 'pointer', alignItems: 'center', color: 'blue' }}
                //                 >
                //                   <p style={{ textAlign: 'left', width: 380, wordBreak: 'all-break' }}>{getShortNote(item.abstractNote, 80)}</p>
                //                 </TableCell>
                //                 {/* xóa */}
                //                 <TableCell className={classes.tableCell || ''} style={{ cursor: 'pointer', alignItems: 'center' }}>
                //                   <IconButton
                //                     onClick={() => {
                //                       setIdDelete({ id: item._id, type: 'deleteDocs' });
                //                       setOpenDialogDelete(true);
                //                     }}
                //                   >
                //                     <Delete />
                //                   </IconButton>
                //                 </TableCell>
                //               </TableRow>
                //             );
                //           })}
                //       </TableBody>
                //     </Table>
                //   </Grid>
                // </>
              }
              {/* HỒ SƠ CÔNG VIỆC */}
              {
                // <>
                //   <Grid item xs={12} style={{ marginTop: 20 }}>
                //     <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black' }}>HỒ SƠ CÔNG VIỆC</span>
                //     <label style={{ display: 'inline-block', marginRight: 10 }}>
                //       <Button
                //         color="primary"
                //         variant="contained"
                //         onClick={() => {
                //           setOpenDialogTask(true);
                //         }}
                //         component="span"
                //       >
                //         {/* <span style={{ marginRight: 5 }}>
                //       <Search />
                //     </span> */}
                //         <span style={{ fontWeight: 'bold' }}>Tìm kiếm</span>
                //       </Button>
                //     </label>
                //     <Table>
                //       <TableHead>
                //         <TableRow>
                //           <TableCell className={classes.tableCell || ''} style={{ cursor: 'pointer', alignItems: 'center', fontWeight: 'bold' }}>
                //             Tên công việc
                //           </TableCell>
                //           <TableCell
                //             className={classes.tableCell || ''}
                //             style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left', fontWeight: 'bold' }}
                //           >
                //             Loại công việc
                //           </TableCell>
                //           <TableCell
                //             className={classes.tableCell || ''}
                //             style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left', fontWeight: 'bold' }}
                //           >
                //             Nội dung công việc
                //           </TableCell>
                //           <TableCell
                //             className={classes.tableCell || ''}
                //             style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left', fontWeight: 'bold' }}
                //           >
                //             Hành động
                //           </TableCell>
                //         </TableRow>
                //       </TableHead>
                //       <TableBody>
                //         {Array.isArray(localState.dataTask) &&
                //           localState.dataTask.length > 0 &&
                //           localState.dataTask.map(item => {
                //             return (
                //               <TableRow>
                //                 <TableCell
                //                   onClick={() => {
                //                     props.history.push({
                //                       pathname: `/Task/task-detail/${item._id}`,
                //                       state: {
                //                         idd: id ? id : 'add',
                //                         localState: JSON.stringify(localState),
                //                       },
                //                     });
                //                   }}
                //                   className={classes.tableCell || ''}
                //                   style={{ cursor: 'pointer', alignItems: 'center', color: 'blue' }}
                //                 >
                //                   {item.name}
                //                 </TableCell>
                //                 <TableCell
                //                   onClick={() => {
                //                     props.history.push({
                //                       pathname: `/Task/task-detail/${item._id}`,
                //                       state: {
                //                         idd: id ? id : 'add',
                //                         localState: JSON.stringify(localState),
                //                       },
                //                     });
                //                   }}
                //                   className={classes.tableCell || ''}
                //                   style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left', color: 'blue' }}
                //                 >
                //                   {item.typeTask}
                //                 </TableCell>
                //                 <TableCell
                //                   onClick={() => {
                //                     props.history.push({
                //                       pathname: `/Task/task-detail/${item._id}`,
                //                       state: {
                //                         idd: id ? id : 'add',
                //                         localState: JSON.stringify(localState),
                //                       },
                //                     });
                //                   }}
                //                   className={classes.tableCell || ''}
                //                   style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left', color: 'blue' }}
                //                 >
                //                   {item.description}
                //                 </TableCell>
                //                 <TableCell
                //                   // onClick={() => {
                //                   //   props.history.push({
                //                   //     pathname: `/Task/task-detail/${item._id}`,
                //                   //     state: {
                //                   //       idd: id ? id : "add",
                //                   //       localState: JSON.stringify(localState)
                //                   //     }
                //                   //   });
                //                   // }}
                //                   className={classes.tableCell || ''}
                //                   style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left', color: 'blue' }}
                //                 >
                //                   <IconButton
                //                     onClick={() => {
                //                       setIdDelete({ id: item._id, type: 'deleteTask' });
                //                       setOpenDialogDelete(true);
                //                     }}
                //                   >
                //                     <Delete />
                //                   </IconButton>
                //                 </TableCell>
                //               </TableRow>
                //             );
                //           })}
                //       </TableBody>
                //     </Table>
                //   </Grid>
                // </>
              }
              {/* VĂN BẢN BÁO CÁO (NẾU CÓ) */}

              <Grid item xs={12} style={{ marginTop: 20 }}>
                {
                  // <>
                  //   {
                  //     id ? (
                  //       <>
                  //         <FileUpload
                  //           draft="vanbantotrinh"
                  //           id={docId === null || docId === undefined ? id : docId}
                  //           getAllFile={file => (convertFileRef.current = [...convertFileRef.current, ...file])}
                  //           name="totrinh"
                  //           newWay
                  //           onChangeFile={onChangeFile}
                  //           onDeleteFile={handleFileDelete}
                  //           code={`${code}-fileLists`}
                  //         />
                  //       </>
                  //     ) : (
                  //       <>
                  //         <div>
                  //           <div>
                  //             <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black', width: 160, display: 'inline-block' }}>
                  //               VĂN BẢN BÁO CÁO (NẾU CÓ)
                  //             </span>
                  //             <label htmlFor="fileUpload3" style={{ display: 'inline-block', marginRight: 10 }}>
                  //               <Button color="primary" variant="contained" component="span">
                  //                 {/* <span style={{ marginRight: 5 }}>
                  //             <AttachFileIcon />
                  //           </span> */}
                  //                 <span style={{ fontWeight: 'bold' }}>Tải lên</span>
                  //               </Button>
                  //             </label>
                  //             <label htmlFor="fileScan">
                  //               <Button color="primary" variant="contained" component="span" onClick={() => openScanDialog('fileUpload3')}>
                  //                 {/* <span style={{ marginRight: 5 }}>
                  //             <Scanner />
                  //           </span> */}
                  //                 <span style={{ fontWeight: 'bold' }}>Quét văn bản</span>
                  //               </Button>
                  //             </label>
                  //           </div>
                  //           <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  //             {localState.fileList && (
                  //               <FileUpload file={localState.fileList} id={'add'} onDeleteFile={handleFileDelete} nameBtn="fileUpload3" />
                  //             )}
                  //           </div>
                  //           <input onChange={handleFileChange} id="fileUpload3" style={{ display: 'none' }} name="fileUpload3" type="file" multiple />
                  //         </div>
                  //       </>
                  //     )}
                  // </>
                }

                {
                  // <>
                  //   {id ? (
                  //     <>
                  //       <FileUpload
                  //         draft="vanbanduthao"
                  //         id={docId === null || docId === undefined ? id : docId}
                  //         getAllFile={file => (convertFileRef.current = [...convertFileRef.current, ...file])}
                  //         name="duthao"
                  //         newWay
                  //         onChangeFile={onChangeFile}
                  //         onDeleteFile={handleFileDelete}
                  //         code={`${code}-fileDocs`}
                  //       />
                  //     </>
                  //   ) : (
                  //     <>
                  //       <div>
                  //         <div>
                  //           <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black', width: 160, display: 'inline-block' }}>
                  //             VĂN BẢN DỰ THẢO
                  //           </span>
                  //           <label htmlFor="fileUpload2" style={{ display: 'inline-block', marginRight: 10 }}>
                  //             <Button color="primary" variant="contained" component="span">
                  //               {/* <span style={{ marginRight: 5 }}>
                  //             <AttachFileIcon />
                  //           </span> */}
                  //               <span style={{ fontWeight: 'bold' }}>Tải lên</span>
                  //             </Button>
                  //           </label>
                  //           <label htmlFor="fileScan">
                  //             <Button color="primary" variant="contained" component="span" onClick={() => openScanDialog('fileUpload2')}>
                  //               {/* <span style={{ marginRight: 5 }}>
                  //             <Scanner />
                  //           </span> */}
                  //               <span style={{ fontWeight: 'bold' }}>Quét văn bản</span>
                  //             </Button>
                  //           </label>
                  //         </div>
                  //         <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  //           {localState.fileDocument && (
                  //             <FileUpload file={localState.fileDocument} id={'add'} onDeleteFile={handleFileDelete} nameBtn="fileUpload2" />
                  //           )}
                  //         </div>
                  //         <input onChange={handleFileChange} id="fileUpload2" style={{ display: 'none' }} name="fileUpload2" type="file" multiple />
                  //       </div>
                  //     </>
                  //   )}
                  // </>
                }

                {id ? (
                  <>
                    <FileUpload
                      id={docId === null || docId === undefined ? id : docId}
                      name="file"
                      newWay
                      onChangeFile={onChangeFile}
                      onDeleteFile={handleFileDelete}
                      code={`${code}-files`}
                    />
                  </>
                ) : (
                  <div style={{ marginTop: 20 }}>
                    <div>
                      <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black', width: 160, display: 'inline-block' }}>
                        {' '}
                        VĂN BẢN ĐÍNH KÈM
                      </span>
                      <label htmlFor="fileUpload" style={{ display: 'inline-block', marginRight: 10, fontWeight: 'bold' }}>
                        <Button color="primary" variant="contained" component="span">
                          {/* <span style={{ marginRight: 5 }}>
                            <AttachFileIcon />
                          </span> */}
                          <span style={{ fontWeight: 'bold' }}>Tải lên</span>
                        </Button>
                      </label>
                      <label htmlFor="fileScan">
                        <Button color="primary" variant="contained" component="span" onClick={() => openScanDialog('fileUpload')}>
                          {/* <span style={{ marginRight: 5 }}>
                            <Scanner />
                          </span> */}
                          <span style={{ fontWeight: 'bold' }}>Quét văn bản</span>
                        </Button>
                      </label>
                    </div>
                    <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      {localState.file && <FileUpload file={localState.file} id={'add'} onDeleteFile={handleFileDelete} nameBtn="fileUpload" />}
                    </div>
                    <input onChange={handleFileChange} id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" multiple />
                  </div>
                )}
              </Grid>
            </Grid>
          </PaperUI>
        ) : null}
        {/* công việc */}
        {index === 1 ? (
          <ListPage
            columnExtensions={[{ columnName: 'name', width: 300 }, { columnName: 'edit', width: 150 }, { columnName: 'progress', width: 180 }]}
            tree
            exportExcel
            apiUrl={`${API_TASK_PROJECT}/projects`}
            code="Task"
            kanban="KANBAN"
            status="taskStatus"
            mapFunction={mapTask}
            addChildTask
            filter={{
              $or: [{ [`others.${code}`]: id }, { outGoingDocuments: id }],
            }}
            disableMenuAction
            perPage={5}
            disableOneEdit
            disableAdd
          // settingBar={[addItem(`/Task/add`, code, id)]}
          />
        ) : null}
        {index === 2 ? (
          <PaperUI style={{ position: 'relative' }}>
            <ListPage
              showDepartmentAndEmployeeFilter
              exportExcel
              kanban="ST15"
              // reload={calendarPage.reload}
              filter={{
                typeCalendar: '1',
                $or: [
                  {
                    'createdBy.employeeId': props.dashboardPage && props.dashboardPage.profile._id,
                  },
                  { 'people.employeeId': props.dashboardPage && props.dashboardPage.profile._id },
                  { 'organizer.employeeId': props.dashboardPage && props.dashboardPage.profile._id },
                ],
                [`others.${code}`]: id,
              }}
              // columns={calendarColumns}
              code="MeetingCalendar"
              apiUrl={API_MEETING}
              mapFunction={mapFunctionCalendar}
              columnExtensions={[{ columnName: 'edit', width: 150 }]}
              className="mt-2"
              listMenus={[]}
              disableAdd
              settingBar={[addItem(`/AllCalendar/MeetingCalendar/add`, code, id)]}
              onRowClick={item => {
                this.openTitleDialog(item._id);
              }}
              pointerCursor="pointer"
              // onEdit={row => {
              //   this.props.history.push(`MeetingCalendar/${row._id}`)
              // }}
              disableOneEdit
            />
            {/* {this.props.meetingPage.loading && <Loading />} */}
          </PaperUI>
        ) : null}
        {index === 3 ? (
          <Grid container>
            <Grid item xs={12}>
              <FlowDocument data={historyy ? historyy : []} />
            </Grid>
          </Grid>
        ) : null}
        <Dialog dialogAction={false} onClose={closeDialog} open={openDialogFilter}>
          <FilterDocs
            onGet={onGet}
            onSave={onSave}
            toBookCode={urlParams.get('toBookCode')}
            handleCloseFilter={closeDialog}
            onChangeSnackbar={onChangeSnackbar}
            search={true}
          />
        </Dialog>
        <Dialogg dialogAction={false} open={props.addSignedDocument.load}>
          <DialogContent>Đang tải files, đồng chí vui lòng chờ...</DialogContent>
        </Dialogg>
        <Dialog dialogAction={false} onClose={closeDialogTask} open={openDialogTask}>
          <TaskDocs onSave={onSaveTask} handleCloseFilter={closeDialogTask} />
        </Dialog>

        <DocumentAssignModal
          open={openAsignProcessor}
          docIds={selectedDocs}
          saveAndSend={id ? null : saveAndSend}
          handleSavee={handleSave}
          isAuthory={isAuthory}
          template={templates}
          onUpdate={onUpdateSignedDocument}
          dataDoc={localState}
          childTemplate={selectedTemplate}
          profile={profile}
          tasks={localState.dataTask}
          drafter={localState.drafter ? localState.drafter._id : ''}
          viewers={Array.isArray(localState.viewers) ? localState.viewers.map(i => i._id) : []}
          task={localState.taskCheck && localState.task ? localState.task.map(i => i._id) : []}
          answer4doc={Array.isArray(localState.answer4doc) ? localState.answer4doc.map(i => i._id) : []}
          typeProcess={goTypeProcess}
          onClose={() => {
            setOpenAsignProcessor(false);
            setSelectedTemplate(null);
          }}
          onSuccess={() => {
            setOpenAsignProcessor(false);
            setSelectedTemplate(null);
            cb();
          }}
          onChangeSnackbar={props.onChangeSnackbar}
          currentRole={nextRole}
          role={role}
          typePage={isAuthory}
        />

        <ReturnDocs
          open={openReturnDocs}
          docIds={selectedDocs}
          type={'flow'}
          role={role}
          processeds={localState ? localState.processeds : []}
          employeeReturn={allowedUsers}
          onClose={() => {
            setOpenReturnDocs(false);
          }}
          onChangeSnackbar={props.onChangeSnackbar}
          onSuccess={() => {
            setOpenReturnDocs(false);
            setAllowedUsers([]);
          }}
        />
        <DocumentSetCommanders
          open={openSetCommanders}
          docIds={selectedDocs}
          isAuthory={isAuthory}
          onClose={() => {
            setOpenSetCommanders(false);
          }}
          onSuccess={() => {
            setOpenSetCommanders(false);
            props.history.goBack();
          }}
          onChangeSnackbar={props.onChangeSnackbar}
        />
        <CompleteDocs
          replace
          open={openComplete}
          docIds={selectedDocs}
          isAuthory={isAuthory}
          inherit={localState.inherit}
          saveAndSend={saveAndSend}
          template={setOpenComplete}
          files={[...(localState.files || []), ...convertFileRef.current]}
          onClose={() => {
            setOpenComplete(false);
          }}
          onSuccess={() => {
            setOpenComplete(false);
            props.history.goBack();
          }}
          onChangeSnackbar={props.onChangeSnackbar}
        />

        <ScanDialog onSave={file => handleFileChange(file)} scanDialog={scanDialog} setScanDialog={setScanDialog} />

        <SwipeableDrawer
          anchor="right"
          onClose={() => setOpenEditDialog(false)}
          open={openEditDialog}
          width={props.miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div style={{ width: props.miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
            <EditExecutiveDocuments id={idEdit} goBack={() => setOpenEditDialog(false)} />
          </div>
        </SwipeableDrawer>

        <Dialogg
          onClose={() => {
            setOpenDialogDeletee(false), setIdDeletee();
          }}
          aria-labelledby="customized-dialog-title"
          open={openDialogDeletee}
          maxWidth="md"
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={() => {
              setOpenDialogDeletee(false);
              setIdDeletee();
            }}
          >
            Thông báo
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>Đồng chí có chắc chắn muốn xóa?</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleDeleteIds} color="primary" variant="contained">
              Đồng ý
            </Button>
            <Button
              onClick={() => {
                setOpenDialogDeletee(false);
              }}
              color="secondary"
              variant="contained"
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialogg>
      </div>
    </SwipeableDrawer>
  );
}

AddSignedDocument.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addSignedDocument: makeSelectAddSignedDocument(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onAddSignedDocument: (query, cb) => {
      dispatch(addSignedDocument(query, cb));
    },
    onDeleteSignedDocument: ids => {
      dispatch(deleteSignedDocument(ids));
    },
    onUpdateSignedDocument: (data, cb) => {
      dispatch(updateSignedDocument(data, cb));
    },
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addSignedDocument', reducer });
const withSaga = injectSaga({ key: 'addSignedDocument', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddSignedDocument);
