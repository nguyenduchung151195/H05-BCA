// AddExecutiveDocuments

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, FileUpload } from '../../components/LifetekUi';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { mergeData, addExecutiveDocument, updateExecutiveDocument, deleteExecutiveDocument } from './actions';
import makeSelectAddExecutiveDocuments from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  API_INCOMMING_DOCUMENT,
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_TASK_PROJECT,
  API_DOCUMENT_HISTORY,
  API_MEETING,
  ALLOW_FILE_EXT_UPLOAD,
  FILE_SIZE_UPLOAD,
  API_BOOK_DOCUMENT,
} from '../../config/urlConfig';
import { Button, Grid, Menu, MenuItem, Dialog, DialogContent, Typography , Dialog as DialogUI} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import FlowDocument from '../../components/FlowComponent';
import { SwipeableDrawer } from '../../components/LifetekUi';

import CustomAppBar from 'components/CustomAppBar';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomDatePickerr from '../../components/CustomDatePicker/CustomDatePicker';

import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import Department from 'components/Filter/DepartmentAndEmployee/Light';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';
import moment from 'moment';
import { Paper as PaperUI, Comment } from 'components/LifetekUi';
import CustomInputField from '../../components/Input/CustomInputField';
import {
  viewConfigCheckForm,
  viewConfigCheckRequired,
  viewConfigName2Title,
  getListData,
  serialize,
} from '../../utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import DocumentAssignModal from 'components/DocumentAssignModal';
import ListPage from 'components/List';
import { taskStatusArr } from '../../variable';
import _ from 'lodash';
import { removeAccents, removeSpaceStr } from '../../utils/functions';
import './index.css';
import { Autocomplete } from 'components/LifetekUi';
import ScanDialog from 'components/ScanDoc/ScanDialog';
import request from '../../utils/request';
import ScanFileByH from '../../components/ScanFileByH';
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

function AddExecutiveDocuments(props) {
  const {
    profile,
    code = 'IncommingDocument',
    addExecutiveDocuments,
    onAddExecutiveDocument,
    onChangeSnackbar,
    onUpdateExecutiveDocument,
    dashboardPage,
    history,
    miniActive
  } = props;
  // const crmSource = JSON.parse(localStorage.getItem('crmSource'));
  const crmSource = JSON.parse(localStorage.getItem('crmSource'));
  let data = crmSource !== undefined && crmSource.find(item => item.code === 'nguoiki');
  let dataSendPlace = [];
  data !== undefined && data.data.map((item) => dataSendPlace.push({ title: item.title, value: item._id }));
  const id = props.match && props.match.params && props.match.params.id;
  const urlParams = new URLSearchParams(window.location.search);
  const isAuthory = urlParams.get('isAuthory') || false;

  const [disableSave, setDisableSave] = useState(false);
  const [openCustom, setOpenCustom] = useState(true);


  const [localState, setLocalState] = useState({
    others: {},
    receiverUnit: profile && profile.organizationUnit && profile.organizationUnit,
    file: [],
    files: [],
    receiveDate: moment().format('YYYY-MM-DD'),
    toBookDate: moment().format('YYYY-MM-DD'),
    documentDate: moment().format('YYYY-MM-DD'),
    receiveDateDepartment: moment().format('YYYY-MM-DD'),
    toBookDateDepartment: moment().format('YYYY-MM-DD'),
    deadline: '',
    signer: { title: '---Chọn---', value: null },
  });

  const [index, setIndex] = useState(0);
  const [name2Title, setName2Title] = useState({});
  const [checkRequired, setCheckRequired] = useState({});
  const [checkShowForm, setCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [openDialog, setOpenDialog] = useState(null);
  const [selectedDocs, setSelectedDocs] = useState(id ? [id] : []);
  const [openAsignProcessor, setOpenAsignProcessor] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [nextRole, setNextRole] = useState(null);
  const [openComplete, setOpenComplete] = useState(false);
  const [show, setShow] = useState(false);
  const [docDetail, setDocDetail] = useState(null);
  const [genCode, setGenCode] = useState('');
  const [isDocOut, setIsDocOut] = useState(true);
  const [checkedDeadline, setCheckedDeadline] = useState(false);

  const requestURL = API_INCOMMING_DOCUMENT;

  const [openLetterAsignModal, setOpenLetterAsignModal] = useState(false);
  const [currentTargetMenu, setCurrentTargetMenu] = useState(null);
  const [openLetterDialog, setOpenLetterDialog] = useState(null);
  const [showTemplatesLetter, setShowTemplatesLetter] = useState(false);
  const [selectedTemplateLetter, setSelectedTemplateLetter] = useState(null);
  const { allTemplates } = dashboardPage;
  const [currentRoleLetter, setCurrentRoleLetter] = useState(null);
  const [nextRoleLetter, setNextRoleLetter] = useState(null);
  const [templatesLetter, setTemplatesLetter] = useState([]);
  const [newBookCode, setNewBookCode] = useState(null);
  // processing
  const [processType, setProcessType] = useState('');
  const [view, setView] = useState(false);
  const [docId, setDocId] = useState(null);
  const [historyy, setHistoryy] = useState(null);
  const [scanDialog, setScanDialog] = useState();
  const [allowSendToUnit, setAllowSendToUnit] = useState('');
  const [openDialogScan, setOpenDialogScan] = useState(false)

  useEffect(() => {
    const query = { filter: { docId: id } };
    if (id) {
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
    }
  }, []);
  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setCheckRequired(checkRequired);
    setCheckShowForm(checkShowForm);
    if (!id) {
      try {
        const listConfig = JSON.parse(localStorage.getItem('crmSource'));
        const defaultValue = {};
        // defaultValue.senderUnit = listConfig.find(i => i.code === 'S39').data[0];
        defaultValue.receiveMethod = listConfig.find(i => i.code === 'S27') && listConfig.find(i => i.code === 'S27').data &&
          Array.isArray(listConfig.find(i => i.code === 'S27').data) && listConfig.find(i => i.code === 'S27').data.length > 0 &&
          listConfig.find(i => i.code === 'S27').data[0];
        defaultValue.privateLevel = listConfig.find(i => i.code === 'S21') && listConfig.find(i => i.code === 'S21').data &&
          Array.isArray(listConfig.find(i => i.code === 'S21').data) && listConfig.find(i => i.code === 'S21').data.length > 0 &&
          listConfig.find(i => i.code === 'S21').data[0];
        defaultValue.urgencyLevel = listConfig.find(i => i.code === 'S20') && listConfig.find(i => i.code === 'S20').data &&
          Array.isArray(listConfig.find(i => i.code === 'S20').data) && listConfig.find(i => i.code === 'S20').data.length > 0 &&
          listConfig.find(i => i.code === 'S20').data[0]
        defaultValue.documentType = listConfig.find(i => i.code === 'S19') && listConfig.find(i => i.code === 'S19').data &&
          Array.isArray(listConfig.find(i => i.code === 'S19').data) && listConfig.find(i => i.code === 'S19').data.length > 0 &&
          listConfig.find(i => i.code === 'S19').data[0]
        defaultValue.documentField = listConfig.find(i => i.code === 'S26') && listConfig.find(i => i.code === 'S26').data &&
          Array.isArray(listConfig.find(i => i.code === 'S26').data) && listConfig.find(i => i.code === 'S26').data.length > 0 &&
          listConfig.find(i => i.code === 'S26').data[0];
        defaultValue.name = listConfig.find(i => i.code === 'S40') && listConfig.find(i => i.code === 'S40').data &&
          Array.isArray(listConfig.find(i => i.code === 'S40').data) && listConfig.find(i => i.code === 'S40').data.length > 0 &&
          listConfig.find(i => i.code === 'S40').data[0];
        // defaultValue.receiveDate = new Date();
        // defaultValue.toBookDate = new Date();
        // defaultValue.documentDate = new Date();
        defaultValue.receiveDate = moment().format('YYYY-MM-DD');
        defaultValue.toBookDate = moment().format('YYYY-MM-DD');
        defaultValue.documentDate = moment().format('YYYY-MM-DD');
        defaultValue.toBookDateDepartment = moment().format('YYYY-MM-DD');
        defaultValue.receiveDateDepartment = moment().format('YYYY-MM-DD');
        handleChangeType('name')({ target: { value: defaultValue.name } });
        // handleChangeType('senderUnit')({ target: { value: defaultValue.senderUnit } });
        setLocalState(pre => ({ ...pre, ...defaultValue }));
      } catch (error) { }
    }

    getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/inCommingDocument`).then(res => {
      if (res) {
        setTemplates([{ ...res }]);
      } else {
        onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng dự thảo', status: true });
      }
    });
    // getListData(API_DOCUMENT_PROCESS_TEMPLATE, { type: 'letter' }).then(setTemplatesLetter);
    // return () => {
    //   newNam2Title;
    //   checkRequired;
    //   checkShowForm;
    // };
  }, []);


  useEffect(
    () => {
      if (Array.isArray(templates) && templates.length > 0 && templates[0].children && Array.isArray(templates[0].children) && templates[0].children[0]) setAllowSendToUnit(templates[0].children && templates[0].children[0].allowSendToUnit || false);
      else setAllowSendToUnit(false)
    },
    [id, templates],
  );
  useEffect(
    () => {
      if (newBookCode) {
        setLocalState({ ...localState, toBookCode: newBookCode });
      }
    },
    [newBookCode],
  );
  useEffect(
    () => {
      setIsDocOut(true);
      if (id && id !== 'add') {
        fetch(`${requestURL}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setDocId(data.docId);
            // if (!data.toBookCode || data.toBookCode.length === 0 || !data.bookDocumentId) {
            console.log(data, 'data nè')

            if (!data.toBookCode || data.toBookCode.length === 0 || !data.bookDocumentId) {
              console.log(data, 'data nè nè')

              setIsDocOut(false);
              let obj = {
                filter: {
                  'typeDocument.moduleCode.value': 'IncommingDocument',
                  year: moment().format('YYYY'),
                  active: true,
                  senderUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
                },
              };
              request(`${API_BOOK_DOCUMENT}?${serialize(obj)}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json',
                },
              })
                .then(res => {
                  if (res && res.data) {
                    const menu = res.data.map(f => ({ _id: f._id, title: f.name, enTitle: f.toBookCode, value: f._id, count: f.count }));

                    if (menu && Array.isArray(menu) && menu.length > 0) {
                      let name = menu[0].enTitle + '/' + menu[0].count;
                      setLocalState({
                        ...data,
                        // deadline: data.deadline ? data.deadline : 'dd/mm/yyyy',
                        signer: data.signer === undefined ? localState.signer : data.signer,
                        bookDocumentId: menu[0],
                        toBookCode: name,
                        // toBookCode:''
                      });
                    } else
                      setLocalState({
                        ...data,
                        // deadline: data.deadline ? data.deadline : 'dd/mm/yyyy',
                        signer: data.signer === undefined ? localState.signer : data.signer,
                      });
                  }
                })
                .catch(error => {
                  onChangeSnackbar({ variant: 'success', message: error, status: false });
                });
            } else {
              setLocalState({
                ...data,
                // deadline: data.deadline ? data.deadline : 'dd/mm/yyyy',
                signer: data.signer === undefined ? localState.signer : data.signer,
              });
            }
            setCurrentRoleLetter(data.currentRole);
            setNextRoleLetter(data.nextRole);
          });
      }
    },
    [id],
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
      if (openLetterDialog === 0) {
        setOpenLetterDialog(currentTargetMenu);
      }
    },
    [openLetterDialog],
  );

  useEffect(
    () => {
      if (openDialog === 0) {
        setOpenDialog(currentTargetMenu);
      }
    },
    [openDialog],
  );

  useEffect(
    () => {
      if (addExecutiveDocuments && addExecutiveDocuments.error === true) {
        setDisableSave(false);
      }
    },
    [addExecutiveDocuments.error],
  );

  function onChangeFile(data) {
    setLocalState({
      ...localState,
      ...data,
    });
  }

  const getDetail = () => {
    setDocDetail({ name: 'abc' });
  };

  const handleChangeTab = (event, newValue) => {
    setIndex(newValue);
  };


  const handleInputChange = useCallback((e, _name, _value) => {
    const name = e && e.target ? e.target.name : _name;
    const value = e && e.target ? e.target.value : _value;
    // if (name === 'deadline' && value === 'Invalid date') {
    //   setLocalState(pre => ({ ...pre, deadline: moment().format('YYYY-MM-DD') }));
    // }
    // if (name === 'deadline') {
    //   setCheckedDeadline(true);
    // }
    setLocalState(pre => ({ ...pre, [name]: value }));
  }, []);

  useEffect(
    () => {
      if (localState) {
        const isValidReceiver = moment(localState.receiveDate, 'YYYY-MM-DD').diff(moment(localState.documentDate), 'd') < 0;
        const isValidToBook =
          moment(localState.toBookDate, 'YYYY-MM-DD').diff(moment(localState.documentDate), 'd') < 0 ||
          moment(localState.toBookDate, 'YYYY-MM-DD').diff(moment(localState.receiveDate), 'd') < 0;
        if (isValidReceiver) {
          setLocalMessages(pre => ({ ...pre, receiveDate: 'Ngày nhận văn bản không được nhỏ hơn ngày văn bản' }));
        } else {
          setLocalMessages(pre => ({ ...pre, receiveDate: null }));
        }
        if (isValidToBook) {
          setLocalMessages(pre => ({ ...pre, toBookDate: 'Ngày vào sổ không được nhỏ hơn ngày văn bản và ngày nhận văn bản' }));
        } else {
          setLocalMessages(pre => ({ ...pre, toBookDate: null }));
        }
      }
    },
    [localState.documentDate, localState.receiveDate, localState.toBookDate],
  );

  const handeChangeDepartmentTake = useCallback(
    result => {
      const { department } = result;
      setLocalState(localState => ({ ...localState, receiverUnit: department }));
    },
    [localState],
  );

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(localState => ({ ...localState, others: newOther }));
    },
    [localState],
  );
  const handleChangeType = name => e => {
    console.log(name, "bookDocumentId")
    if (!(e && e.target && e.target.value && e.target.value.value)) {
      if (name === "bookDocumentId") {
        setLocalState(pre => ({ ...pre, bookDocumentId: e.target.value, toBookCode: "" }));
        return
      }
    }
    if (name === 'bookDocumentId') {
      if (name === 'bookDocumentId' && !id) {
        if (e.target.value) {
          let name = e.target.value.enTitle + '/' + e.target.value.count;
          setLocalState(pre => ({ ...pre, bookDocumentId: e.target.value, toBookCode: name }));
        }
      } else if (name === 'bookDocumentId' && id && isDocOut === false) {
        if (e.target.value) {
          console.log('e.target', e.target);
          let name = e.target.value.enTitle + '/' + e.target.value.count;
          setLocalState(pre => ({ ...pre, bookDocumentId: e.target.value, toBookCode: name }));
        }
      }
    }
    else if (name === 'preBookDocumentId') {
      if (e.target.value) {
        let name = e.target.value.enTitle + '/' + e.target.value.count;
        setLocalState(pre => ({ ...pre, preBookDocumentId: e.target.value, preToBookCode: name }));
      }
    }
    else {
      setLocalState(pre => ({ ...pre, [name]: e.target.value }));
    }
  };


  const handleOpenDoc = e => {
    setOpenDialog(e.currentTarget);
  };

  const handleOpenLetter = e => {
    setOpenLetterDialog(e.currentTarget);
  };

  const handleClose = () => {
    setOpenDialog(null);
    setDisableSave(false);
  };

  const handleCloseLetter = () => {
    setOpenLetterDialog(null);
  };

  const cb = () => {
    props.history.push('/IncommingDocument');
    console.log(id, isDocOut, "isDocOut")
    if (id && !isDocOut) {
      props.history.push(`/IncommingDocument/${id}`);
    }
  };

  const handleSave = useCallback(
    () => {
      let { deadline, ...rest } = localState || {};
      // let restValidate  = {...rest, name:  localState.bookDocumentId && localState.bookDocumentId._id || "", senderUnit: localState.senderUnit && localState.senderUnit.value}
      let restValidate = { ...rest, senderUnit: localState.senderUnit && localState.senderUnit.value }
      let messages = viewConfigCheckForm(code, restValidate);

      setLocalMessages(messages);
      console.log(messages, "messages", localState)
      if (Object.values(messages).filter(v => v).length) {
        setDisableSave(false);
        return props.onChangeSnackbar({ variant: 'error', message: 'Vui lòng nhập đầy đủ các trường thông tin', status: true });
      }

      let body = {};
      if (deadline == 'dd/mm/yyyy' || deadline == '') {
        body = {
          ...rest,
          receiverUnit: localState.receiverUnit ? localState.receiverUnit.organizationUnitId : '',
          viewers: Array.isArray(localState.viewers) ? localState.viewers.map(i => i._id) : [],
          task: localState.taskCheck && localState.task ? localState.task.map(i => i._id) : [],
          senderUnit: localState.senderUnit ? localState.senderUnit : '',
          answer4doc: Array.isArray(localState.answer4doc) ? localState.answer4doc.map(i => i._id) : [],
          signer: {
            title: localState.signer && localState.signer.value === null ? '' : localState.signer && localState.signer.title,
            value: localState.signer && localState.signer.value,
          },
          // deadline: checkedDeadline === true ? localState.deadline : '',
          deadline: localState.deadline && moment(localState.deadline).isValid() ? localState.deadline : ""
        };
      } else {
        body = {
          ...localState,
          receiverUnit: localState.receiverUnit ? localState.receiverUnit.organizationUnitId : '',
          viewers: Array.isArray(localState.viewers) ? localState.viewers.map(i => i._id) : [],
          task: localState.taskCheck && localState.task ? localState.task.map(i => i._id) : [],
          senderUnit: localState.senderUnit ? localState.senderUnit : '',
          answer4doc: Array.isArray(localState.answer4doc) ? localState.answer4doc.map(i => i._id) : [],
          signer: {
            title: localState.signer && localState.signer.value === null ? '' : localState.signer && localState.signer.title,
            value: localState.signer && localState.signer.value,
          },
          // deadline: checkedDeadline === true ? localState.deadline : '',
          deadline: localState.deadline && moment(localState.deadline).isValid() ? localState.deadline : ""
        };
      }
      try {
        if (id) {
          onUpdateExecutiveDocument(body, cb);
          setDisableSave(true);
        } else {
          onAddExecutiveDocument(body, cb);
          setDisableSave(true);
        }
      } catch (error) {
        props.onChangeSnackbar({ variant: 'error', message: error.message, status: true });
        setDisableSave(false);
      }
    },
    [localState],
  );
  useEffect(
    () => {
      const { addExecutiveDocuments } = props;
      if (
        addExecutiveDocuments &&
        addExecutiveDocuments.errorData &&
        addExecutiveDocuments.errorData.status == 0 &&
        addExecutiveDocuments.errorData.toBookCode
      ) {
        setLocalState({ ...localState, toBookCode: addExecutiveDocuments.errorData.toBookCode });
      }
    },
    [props && props.addExecutiveDocuments],
  );

  const handleFileChange = e => {
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
    setLocalState(pre => ({ ...pre, file: [...pre.file, ...files] }));
  };

  function handleFileDelete(f) {
    const newFiles = localState.file.filter((i, idx) => idx !== f);
    setLocalState(pre => ({ ...pre, file: newFiles }));
  }

  const onSuccess = useCallback(() => {
    setOpenAsignProcessor(false);
    setSelectedTemplate(null);
    cb();
  }, []);

  const onClose = useCallback(() => {
    setOpenAsignProcessor(false);
    setSelectedTemplate(null);
  }, []);

  const handleCheckValidate = () => {
    let { deadline, ...rest } = localState || {};
    const restValidate = { ...rest, senderUnit: localState.senderUnit && localState.senderUnit.value }

    const messages = viewConfigCheckForm(code, restValidate);
    console.log(messages, 'messages')
    setLocalMessages(messages)
    if (Object.values(messages).filter(v => v).length) {
      setDisableSave(false);
      return props.onChangeSnackbar({ variant: 'error', message: 'Vui lòng nhập đầy đủ các trường thông tin', status: true });
    }
    return false
  }
  // useEffect(()=>{
  //   let { deadline, ...rest } = localState || {};
  //   rest = {...rest, name:  localState.bookDocumentId && localState.bookDocumentId.value || ""}
  //   const messages = viewConfigCheckForm(code, rest);
  //   setLocalMessages(messages)
  // }, [localState])
  const saveAndSend = useCallback(
    onSaveSuccess => {
      setDisableSave(true);
      let { deadline, ...rest } = localState || {};
      const restValidate = { ...rest, senderUnit: localState.senderUnit && localState.senderUnit.value }

      const messages = viewConfigCheckForm(code, restValidate);
      console.log(messages, 'messages')
      setLocalMessages(messages)
      if (Object.values(messages).filter(v => v).length) {
        setDisableSave(false);
        return props.onChangeSnackbar({ variant: 'error', message: 'Vui lòng nhập đầy đủ các trường thông tin', status: true });
      }
      if (id) return id;
      let body;
      if (deadline == '') {
        body = {
          ...rest,
          receiverUnit: localState.receiverUnit ? localState.receiverUnit.organizationUnitId : '',
          viewers: Array.isArray(localState.viewers) ? localState.viewers.map(i => i._id) : [],
          task: localState.taskCheck && localState.task ? localState.task.map(i => i._id) : [],
          senderUnit: localState.senderUnit ? localState.senderUnit : '',
          answer4doc: Array.isArray(localState.answer4doc) ? localState.answer4doc.map(i => i._id) : [],
          signer: { title: localState.signer.value === null ? '' : localState.signer.title, value: localState.signer.value },
        };
      } else {
        body = {
          ...localState,
          receiverUnit: localState.receiverUnit ? localState.receiverUnit.organizationUnitId : '',
          viewers: Array.isArray(localState.viewers) ? localState.viewers.map(i => i._id) : [],
          task: localState.taskCheck && localState.task ? localState.task.map(i => i._id) : [],
          senderUnit: localState.senderUnit ? localState.senderUnit : '',
          answer4doc: Array.isArray(localState.answer4doc) ? localState.answer4doc.map(i => i._id) : [],
          signer: { title: localState.signer.value === null ? '' : localState.signer.title, value: localState.signer.value },
        };
      }
      try {
        return onAddExecutiveDocument(body, onSaveSuccess, 'send');
      } catch (error) {
        props.onChangeSnackbar({ variant: 'error', message: error.message, status: true });
        setDisableSave(false);
      }
    },
    [localState, localState.file],
  );

  const getRole = array => {
    let str = '';
    if (array) {
      array.map(item => {
        if (item.children) {
          item.children.map((i, index) => {
            if (index !== item.children.length - 1) {
              str += i.code + ',';
            } else {
              str += i.code;
            }
          });
        }
      });
    }
    return str;
  };
  // const handleTypeChange = useCallback(
  //   (value, name) => {
  //     onBlur = { handleTypeChange }
  //     console.log("hbdhvfb: ", value, name)
  //     if (!value.includes('_') && value.length === 10) {
  //       setLocalState(pre => ({ ...pre, [name]: moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD') }));
  //       if (name === 'deadline' && moment(value, 'DD/MM/YYYY').diff(moment(), 'days') < 0) {
  //         setLocalMessages(pre => ({ ...pre, deadline: 'Hạn xử lý không được nhỏ hơn ngày hiện tại' }));
  //         setDisableSave(true);
  //       } else {
  //         if (name === 'deadline' && moment(value, 'DD/MM/YYYY').diff(moment(), 'days') > 0) {
  //           let data = localMessages;
  //           delete data.deadline;
  //           setLocalMessages(data);
  //           handleInputChange(null, 'deadline', moment(value).format('YYYY-MM-DD'));
  //         }
  //         setDisableSave(false);
  //       }
  //     }
  //   },
  //   [
  //     localState.receiveDate,
  //     localState.toBookDate,
  //     localState.documentDate,
  //     localState.deadline,
  //     localState.receiveDateDepartment,
  //     localState.toBookDateDepartment,
  //   ],
  // );

  const handleTypeChange = (value, name) => {
    if (!value.includes('_') && value.length === 10) {
      setLocalState(pre => ({ ...pre, [name]: moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD') }));
      if (name === 'deadline' && moment(value, 'DD/MM/YYYY').diff(moment(), 'days') < 0) {
        setLocalMessages(pre => ({ ...pre, deadline: 'Hạn xử lý không được nhỏ hơn ngày hiện tại' }));
        setDisableSave(true);
      } else {
        if (name === 'deadline' && moment(value, 'DD/MM/YYYY').diff(moment(), 'days') > 0) {
          let data = localMessages;
          delete data.deadline;
          setLocalMessages(data);
          // handleInputChange(null, 'deadline', moment(value).format('YYYY-MM-DD'));
        }
        setDisableSave(false);
      }
    } else if (!value) {
      setLocalState({ ...localState, deadline: "" })
      let data = localMessages;
      delete data.deadline;
      setLocalMessages(data);
      setDisableSave(false);
    }
  }

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
        history.push({
          pathname: link,
          state: { code, idd: id },
        })
      }
    >
      Thêm mới
    </Add>
  );


  useEffect(() => {
    const { loading } = addExecutiveDocuments

    //   if(loading){
    //     console.log("beforeunload")

    //     window.addEventListener("beforeunload", (ev) => 
    //     {  
    //         ev.preventDefault();
    //         alert("hahah")
    //         return ev.returnValue = 'Quá trình xử lý chưa hoàn tất, vui lòng đợi';

    //     });
    //   }else {
    //     console.log("beforeunload 1")
    //     window.removeEventListener('beforeunload', (ev) => 
    //     {  
    //       return false

    //     })

    //   }

    return () => {
      console.log("beforeunload 2: ", loading)

      if (loading) {
        window.onbeforeunload = function () {
          const msg = "Quá trình xử lý chưa được thực hiện xong ..."
          return msg
        }
      } else window.onbeforeunload = null
      // window.removeEventListener('beforeunload', (ev) => 
      // {  

      //     return false

      // })
    }
  }, [addExecutiveDocuments])
  return (
    <SwipeableDrawer
      anchor="right"
      // onClose={() => this.setState({ openEditDialog: false })}
      open={openCustom}
      width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
    >
      <div style={{ width: "calc(100vw - 260px)" }}>
        <CustomAppBar
          title={id ? 'Chỉnh sửa tiếp nhận văn bản đến' : 'Thêm mới tiếp nhận văn bản đến'}
          onGoBack={() => {
            setOpenCustom(false)
            props.history.goBack();
          }}
          disableSave={disableSave}
          onSubmit={handleSave}
          moreButtons={
            <div style={{ marginRight: 10, display: 'flex', justifyContent: 'space-around' }}>
              <Button
                variant="outlined"
                color="inherit"
                disabled={disableSave}
                style={{ marginRight: 10 }}
                onClick={e => {
                  setOpenDialogScan(true)
                }}
              >
                Nhập liệu
              </Button>
              {localState.documentType && localState.documentType.value === 'don-thu' ? (
                <>
                  <Button
                    variant="outlined"
                    color="inherit"
                    disabled={disableSave}
                    onClick={e => {
                      if (currentRoleLetter) {
                        setOpenLetterAsignModal(true);
                        return;
                      }
                      handleOpenLetter(e);
                      if (!currentTargetMenu) {
                        setCurrentTargetMenu(e.currentTarget);
                      }
                    }}
                  >
                    {/* <span style={{ marginRight: 5 }}>
                    <Send />
                  </span> */}
                    Chuyển xử lý
                  </Button>
                  <Menu open={Boolean(openLetterDialog)} anchorEl={openLetterDialog} onClose={handleCloseLetter}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                      <MenuItem
                        style={{ flex: 'auto' }}
                        value="any"
                        onClick={() => {
                          setOpenLetterAsignModal(true);
                        }}
                      >
                        Chuyển tùy chọn
                      </MenuItem>
                    </div>
                    <div style={{ alignItems: 'center', padding: '0 10px' }}>
                      {showTemplatesLetter &&
                        Array.isArray(templatesLetter) &&
                        templatesLetter.map(t => (
                          <>
                            <MenuItem
                              value={t.code}
                              onClick={() => {
                                setSelectedTemplateLetter(t);
                                setOpenLetterAsignModal(true);
                              }}
                            >
                              <span style={{ paddingLeft: 30 }}>{t.name}</span>
                            </MenuItem>
                            {showTemplatesLetter &&
                              Array.isArray(templatesLetter) &&
                              Array.isArray(t.group) &&
                              t.group[0] && (
                                <MenuItem
                                  value={t.group[0].order}
                                  onClick={() => {
                                    setSelectedTemplateLetter(t);

                                    setOpenLetterAsignModal(true);
                                  }}
                                >
                                  <span style={{ paddingLeft: 60 }}>Chuyển cho {t.group[0].name}</span>
                                </MenuItem>
                              )}
                          </>
                        ))}
                    </div>
                  </Menu>
                </>
              ) : (
                <>
                  {isDocOut && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      // onClick={e => {
                      //   if (currentRole) {
                      //     setOpenAsignProcessor(true);
                      //     return;
                      //   }
                      //   handleOpen(e);
                      // }}
                      disabled={disableSave}
                      onClick={e => {
                        console.log("template: ", templates)
                        if (currentRole) {
                          setOpenAsignProcessor(true);
                          return;
                        }
                        handleOpenDoc(e);
                        if (!currentTargetMenu) {
                          setCurrentTargetMenu(e.currentTarget);
                        }
                      }}
                    >
                      {/* chuyển xử lý lúc thêm mới */}
                      Chuyển xử lý
                    </Button>
                  )}
                  <Menu open={Boolean(openDialog)} anchorEl={openDialog} onClose={handleClose}>
                    {localState.children && localState.children.length > 0 ? (
                      <>
                        <MenuItem
                          value={'name'}
                          onClick={() => {
                            if (localState.children && localState.children && localState.children.length === 1) {
                              let [template] = localState.children;
                              template && template.children && setSelectedTemplate(template.children);
                              let role = getRole(template.children);
                              setNextRole(role);
                              setOpenAsignProcessor(true);
                              setProcessType('any');
                            }
                          }}
                        >
                          <span style={{ paddingLeft: 30 }}>Chuyển bất kỳ</span>
                        </MenuItem>
                        {localState.children.map(item => (
                          <>
                            {item &&
                              item.children &&
                              item.children.map(it => (
                                <MenuItem
                                  value={it.code}
                                  onClick={() => {
                                    setSelectedTemplate(it);
                                    setOpenAsignProcessor(true);
                                    setNextRole(it.code);
                                    setProcessType('flow');
                                  }}
                                >
                                  <span>Chuyển cho {it.name}</span>
                                </MenuItem>
                              ))}
                          </>
                        ))}
                      </>
                    ) : (
                      <div style={{ alignItems: 'center', padding: '0 10px' }}>
                        <MenuItem
                          value={'name'}
                          onClick={() => {
                            console.log(templates, "templates")
                            if (templates && templates[0] && templates[0].children && templates[0].children.length === 1) {
                              let [template] = templates[0].children;
                              // template && template.children && setSelectedTemplate(template.children);
                              setSelectedTemplate([]);
                              setNextRole(null);
                              // setNextRole(role);
                              setOpenAsignProcessor(true);
                              setProcessType('any');
                            } else {
                              props.onChangeSnackbar && props.onChangeSnackbar({ variant: 'error', message: 'Cấu hình luồng chưa hợp lệ hoặc chưa cấu hình luồng hợp lệ', status: true });
                            }
                          }}
                        >
                          <span style={{ paddingLeft: 10 }}>Chuyển tùy chọn</span>
                        </MenuItem>
                        {Array.isArray(templates) &&
                          templates.map(t => (
                            <>
                              {
                                <>
                                  {t.children &&
                                    Array.isArray(t.children) &&
                                    t.children[0] && t.children[0].code === profile.roleGroupSource &&
                                    Array.isArray(t.children[0].children) &&
                                    t.children[0].children.length > 0 && (
                                      <>
                                        {t.children[0].children.map(item => (
                                          <MenuItem
                                            value={item.code}
                                            onClick={() => {
                                              setSelectedTemplate(item);
                                              setOpenAsignProcessor(true);
                                              setNextRole(item.code);
                                              setProcessType('flow');
                                            }}
                                          >
                                            <span>Chuyển cho {item.name}</span>
                                          </MenuItem>
                                        ))}
                                      </>
                                    )}
                                </>
                              }
                            </>
                          ))}
                      </div>
                    )}
                  </Menu>
                </>
              )}
            </div>
          }
        />

        <div style={{ marginBottom: 20 }}>
          <Grid container>
            <Tabs onChange={handleChangeTab} value={index}>
              <Tab label="Thông tin chung" />
              {/* <Tab disabled={id == null} label="Ý kiến" /> */}
              <Tab disabled={id == null} label="Hồ sơ công việc" />
              <Tab disabled={id == null} label="Lịch cá nhân" />
              <Tab disabled={id == null} label="Nguồn gốc" />
              {/* <Tab disabled={id == null} label="Lịch sử" /> */}
            </Tabs>
          </Grid>
        </div>
        {index === 0 ? (
          <Grid style={{ zIndex: '0 !important', paddingLeft: 8 }} container >
            <Grid container spacing={8} item xs={id && localState.isAnyDepartment ? 8 : 12}>
              <Grid item xs={3}>
                <CustomInputField
                  className={checkRequired && checkRequired.name && checkRequired.name === true ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                  label={name2Title.name || 'Số VB đến'}
                  configType="crmSource"
                  configCode="S40"
                  type="Source|CrmSource,S40|Value||value"
                  typeDocument="IncommingDocument"
                  name="bookDocumentId"
                  profile={profile}
                  value={localState.bookDocumentId}
                  isBookDocument={true}
                  disabled={(id ? true : false) && isDocOut}
                  onChange={handleChangeType('bookDocumentId')}

                  error={localMessages && localMessages.name}
                  helperText={localMessages && localMessages.name}
                  required={checkRequired.name}
                  checkedShowForm={checkShowForm.name}
                  disableDelete={true}
                />
              </Grid>
              <Grid item xs={3}>
                <CustomInputBase
                  label={_.get(name2Title, 'toBook', 'Số văn bản')}
                  value={localState.toBook}
                  disabled={id ? true : false}
                  name="toBook"
                  onChange={e => handleInputChange(e)}
                  error={localMessages && localMessages.toBook}
                  helperText={localMessages && localMessages.toBook}
                  required={checkRequired.toBook}
                  checkedShowForm={checkShowForm.toBook}
                  className={checkRequired && checkRequired.toBook && checkRequired.toBook === true ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                  autoFocus
                />
              </Grid>


              <Grid item xs={3}>
                {/* <Department
                labelDepartment={name2Title.senderUnit}
                onChange={handeChangeDepartmentTake}
                department={localState.senderUnit}
                disableEmployee
                profile={profile}
                moduleCode="IncommingDocument"
              /> */}

                <CustomInputField
                  label={_.get(name2Title, 'senderUnit', 'Đơn vị gửi')}
                  configType="crmSource"
                  configCode="S39"
                  type="Source|CrmSource,S39|Value||value"
                  name="senderUnit"
                  typeDocument="IncommingDocument"
                  isAddDocument
                  disabled={localState.isAnyDepartment}
                  value={localState && localState.senderUnit}
                  onChange={handleChangeType('senderUnit')}
                  error={localMessages && localMessages.senderUnit}
                  helperText={localMessages && localMessages.senderUnit}
                  required={checkRequired.senderUnit}
                  checkedShowForm={checkShowForm.senderUnit}
                  className={
                    checkRequired && checkRequired.senderUnit && checkRequired.senderUnit === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                  disableDelete={true}
                />
              </Grid>

              <Grid item xs={3}>
                <Department
                  labelDepartment={_.get(name2Title, 'receiverUnit', 'Đơn vị nhận')}
                  onChange={handeChangeDepartmentTake}
                  department={localState.receiverUnit ? localState.receiverUnit.name : ''}
                  disableEmployee
                  profile={profile}
                  moduleCode="IncommingDocument"
                  isNoneExpand={true}
                  error={localMessages && localMessages.receiverUnit}
                  helperText={localMessages && localMessages.receiverUnit}
                  required={checkRequired.receiverUnit}
                  disabled
                  checkedShowForm={checkShowForm.receiverUnit}
                  className={
                    checkRequired && checkRequired.receiverUnit && checkRequired.receiverUnit === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                />
              </Grid>

              <Grid item xs={3}>
                <CustomInputBase
                  label={_.get(name2Title, 'toBookCode', 'Số đến')}
                  value={localState.toBookCode && localState.toBookCode.split("/").slice(-1)[0]}
                  name="toBookCode"
                  // disabled={(id ? (localState.isAnyDepartment ? false : true) : false) && isDocOut}
                  disabled
                  error={localMessages && localMessages.toBookCode}
                  helperText={localMessages && localMessages.toBookCode}
                  required={checkRequired.toBookCode}
                  checkedShowForm={checkShowForm.toBookCode}
                  // onChange={handleChangeType('toBookCode')}
                  className={
                    checkRequired && checkRequired.toBookCode && checkRequired.toBookCode === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <CustomDatePicker
                  label={_.get(name2Title, 'documentDate', 'Ngày VB')}
                  isAddExe={true}
                  value={localState.documentDate}
                  name="documentDate"
                  onChange={e => handleInputChange(null, 'documentDate', moment(e).format('YYYY-MM-DD'))}
                  onBlur={handleTypeChange}
                  error={localMessages && localMessages.documentDate}
                  helperText={localMessages && localMessages.documentDate}
                  required={checkRequired.documentDate}
                  isFuture={false}
                  disabled={localState.isAnyDepartment}
                  checkedShowForm={checkShowForm.documentDate}
                  className={
                    checkRequired && checkRequired.documentDate && checkRequired.documentDate === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <CustomDatePicker
                  label={_.get(name2Title, 'receiveDate', 'Ngày nhận văn bản')}
                  value={localState.receiveDate}
                  isAddExe={true}
                  name="receiveDate"
                  disabled={localState.isAnyDepartment && isDocOut}
                  onBlur={handleTypeChange}
                  isFuture={false}
                  invalidLabel="dd/mm/yyyy"
                  onChange={e => handleInputChange(e, 'receiveDate', moment(e).format('YYYY-MM-DD'))}
                  error={localMessages && localMessages.receiveDate}
                  helperText={localMessages && localMessages.receiveDate}
                  required={checkRequired.receiveDate}
                  checkedShowForm={checkShowForm.receiveDate}
                  className={
                    checkRequired && checkRequired.receiveDate && checkRequired.receiveDate === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <CustomDatePicker
                  label={_.get(name2Title, 'toBookDate', 'Ngày vào sổ')}
                  value={localState.toBookDate}
                  isAddExe={true}
                  name="toBookDate"
                  onBlur={handleTypeChange}
                  disabled={localState.isAnyDepartment && isDocOut}
                  isFuture={false}
                  onChange={e => handleInputChange(null, 'toBookDate', moment(e).format('YYYY-MM-DD'))}
                  // onInputChange={(e) => checkValidDate(e)}
                  error={localMessages && localMessages.toBookDate}
                  helperText={localMessages && localMessages.toBookDate}
                  required={checkRequired.toBookDate}
                  checkedShowForm={checkShowForm.toBookDate}
                  variant="outlined"
                  className={
                    checkRequired && checkRequired.toBookDate && checkRequired.toBookDate === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                />
              </Grid>
              {/* <Grid item xs={3}>
                <CustomInputBase
                  label={_.get(name2Title, 'textSymbols', 'Ký hiệu ban hành')}
                  value={localState.textSymbols}
                  name="textSymbols"
                  // disabled={(id ? (localState.isAnyDepartment ? false : true) : false) && isDocOut}
                  // disabled
                  error={localMessages && localMessages.textSymbols}
                  helperText={localMessages && localMessages.textSymbols}
                  required={checkRequired.textSymbols}
                  checkedShowForm={checkShowForm.textSymbols}
                  onChange={handleChangeType('textSymbols')}
                  className={
                    checkRequired && checkRequired.textSymbols && checkRequired.textSymbols === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                />
              </Grid> */}
              <Grid item xs={3}>
                <CustomDatePicker
                  isAddExe={true}
                  label={_.get(name2Title, 'deadline', 'Hạn xử lý')}
                  isUpdate={id && id !== 'add' ? true : false}
                  value={localState.deadline}
                  disabled={localState.isAnyDepartment}
                  onBlur={handleTypeChange}
                  minDate={moment()}
                  name="deadline"
                  sendAllData
                  onChange={e => {
                    handleInputChange(null, 'deadline', moment(e).format('YYYY-MM-DD'))
                  }}
                  error={localMessages && localMessages.deadline}
                  helperText={localMessages && localMessages.deadline}
                  required={checkRequired.deadline}
                  checkedShowForm={checkShowForm.deadline}
                  className={checkRequired && checkRequired.deadline && checkRequired.deadline === true ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                />

                {/* <CustomDatePickerr
                  label={_.get(name2Title, 'deadline', 'Hạn xử lý')}
                  // isUpdate={id !== 'add' ? true : false}
                  value={localState.deadline}
                  disabled={localState.isAnyDepartment}
                  // onBlur={handleTypeChange}
                  minDate={moment()}
                  name="deadline"
                  onChange={e => {
                    console.log(e, "ssss")
                    // handleInputChange(null, 'deadline', moment(e).format('YYYY-MM-DD'))
                    let date = e
                    if (date) date = moment(date).format('YYYY-MM-DD')
                    setLocalState({ ...localState, deadline: date })
                  }}
                  error={localMessages && localMessages.deadline}
                  helperText={localMessages && localMessages.deadline}
                  required={checkRequired.deadline}
                  checkedShowForm={checkShowForm.deadline}
                  className={checkRequired && checkRequired.deadline && checkRequired.deadline === true ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                /> */}
              </Grid>
              <Grid item xs={3}>
                <CustomInputBase
                  label={_.get(name2Title, 'secondBook', 'Sổ phụ')}
                  value={localState.secondBook}
                  name="secondBook"
                  disabled={localState.isAnyDepartment}
                  onChange={e => handleInputChange(e)}
                  error={localMessages && localMessages.secondBook}
                  helperText={localMessages && localMessages.secondBook}
                  required={checkRequired.secondBook}
                  checkedShowForm={checkShowForm.secondBook}
                  className={
                    checkRequired && checkRequired.secondBook && checkRequired.secondBook === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <CustomInputField
                  label={_.get(name2Title, 'receiveMethod', 'Phương thức nhận')}
                  configType="crmSource"
                  configCode="S27"
                  type="Source|CrmSource,S27|Value||value"
                  name="receiveMethod"
                  value={localState.receiveMethod}
                  disabled={localState.isAnyDepartment}
                  onChange={handleChangeType('receiveMethod')}
                  error={localMessages && localMessages.receiveMethod}
                  helperText={localMessages && localMessages.receiveMethod}
                  required={checkRequired.receiveMethod}
                  checkedShowForm={checkShowForm.receiveMethod}
                  className={
                    checkRequired && checkRequired.receiveMethod && checkRequired.receiveMethod === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                  disableDelete={true}
                />
              </Grid>
              <Grid item xs={3}>
                <CustomInputField
                  label={_.get(name2Title, 'privateLevel', 'Độ mật')}
                  configType="crmSource"
                  configCode="S21"
                  type="Source|CrmSource,S21|Value||value"
                  name="privateLevel"
                  disabled={localState.isAnyDepartment}
                  value={localState.privateLevel}
                  onChange={handleChangeType('privateLevel')}
                  error={localMessages && localMessages.privateLevel}
                  helperText={localMessages && localMessages.privateLevel}
                  required={checkRequired.privateLevel}
                  checkedShowForm={checkShowForm.privateLevel}
                  className={
                    checkRequired && checkRequired.privateLevel && checkRequired.privateLevel === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                  disableDelete={true}
                />
              </Grid>




              <Grid item xs={3}>
                <CustomInputField
                  label={_.get(name2Title, 'urgencyLevel', 'Độ khẩn')}
                  configType="crmSource"
                  configCode="S20"
                  type="Source|CrmSource,S20|Value||value"
                  name="urgencyLevel"
                  disabled={localState.isAnyDepartment}
                  value={localState.urgencyLevel}
                  onChange={handleChangeType('urgencyLevel')}
                  error={localMessages && localMessages.urgencyLevel}
                  helperText={localMessages && localMessages.urgencyLevel}
                  required={checkRequired.urgencyLevel}
                  checkedShowForm={checkShowForm.urgencyLevel}
                  className={
                    checkRequired && checkRequired.urgencyLevel && checkRequired.urgencyLevel === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                  disableDelete={true}
                />
              </Grid>

              <Grid item xs={3}>
                <CustomInputField
                  label={_.get(name2Title, 'documentType', 'Loại văn bản')}
                  configType="crmSource"
                  configCode="S19"
                  disabled={localState.isAnyDepartment}
                  type="Source|CrmSource,S19|Value||value"
                  name="documentType"
                  value={localState.documentType}
                  onChange={handleChangeType('documentType')}
                  error={localMessages && localMessages.documentType}
                  helperText={localMessages && localMessages.documentType}
                  required={checkRequired.documentType}
                  checkedShowForm={checkShowForm.documentType}
                  className={
                    checkRequired && checkRequired.documentType && checkRequired.documentType === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                  disableDelete={true}
                />
              </Grid>

              {localState.documentType && localState.documentType.value === 'don-thu' ? (
                <Grid item xs={3}>
                  <CustomInputField
                    label={_.get(name2Title, 'letterType', 'Phân loại đơn')}
                    configType="crmSource"
                    configCode="S30"
                    type="Source|CrmSource,S30|Value||value"
                    name="letterType"
                    disabled={localState.isAnyDepartment}
                    value={localState.letterType}
                    onChange={handleChangeType('letterType')}
                    error={localMessages && localMessages.letterType}
                    helperText={localMessages && localMessages.letterType}
                    required={checkRequired.letterType}
                    checkedShowForm={checkShowForm.letterType}
                    className={
                      checkRequired && checkRequired.letterType && checkRequired.letterType === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                    }
                  />
                </Grid>
              ) : null}

              <Grid item xs={3}>
                <CustomInputField
                  label={_.get(name2Title, 'documentField', 'Lĩnh vực')}
                  configType="crmSource"
                  configCode="S26"
                  disabled={localState.isAnyDepartment}
                  type="Source|CrmSource,S26|Value||value"
                  name="documentField"
                  value={localState.documentField}
                  onChange={handleChangeType('documentField')}
                  error={localMessages && localMessages.documentField}
                  helperText={localMessages && localMessages.documentField}
                  required={checkRequired.documentField}
                  checkedShowForm={checkShowForm.documentField}
                  className={
                    checkRequired && checkRequired.documentField && checkRequired.documentField === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                  disableDelete={true}
                />
              </Grid>

              <Grid item xs={3}>
                <Autocomplete
                  onChange={value => setLocalState({ ...localState, signer: value })}
                  suggestions={dataSendPlace}
                  value={localState.signer}
                  disabled={localState.isAnyDepartment}
                  label={'Người ký'}
                  checkedShowForm={checkShowForm.signer}
                  required={checkRequired.signer}
                />
                {/* <AsyncAutocomplete
                name="Chọn "
                label={_.get(name2Title, 'signer', 'Người ký')}
                onChange={e => {
                  handleChangeType('signer')({ target: { value: e } });
                }}
                value={localState.signer}
                url={API_USERS}
                defaultOptions
                // ref={ref => (this.projectRef = ref)}
                error={localMessages && localMessages.signer}
                helperText={localMessages && localMessages.signer}
                required={checkRequired.signer}
                checkedShowForm={checkShowForm.signer}
                className={checkRequired && checkRequired.signer && checkRequired.signer === true ? "CustomRequiredLetter" : 'CustomIconRequired'}
              /> */}
              </Grid>



              {/* <Grid item xs={3}> */}
              <CustomGroupInputField code={code} columnPerRow={4} value={localState.others} onChange={handleOtherDataChange} autoDown />
              {/* </Grid> */}
              {id && localState.isAnyDepartment ? (
                <>
                  <Grid container>
                    <Typography variant="h5" style={{ fontSize: 14, fontWeight: 800 }}>
                      THÔNG TIN ĐƠN VỊ GỬI
                    </Typography>
                  </Grid>
                  <Grid container spacing={8}>
                    <Grid item xs={3}>
                      {/* <CustomInputField
                      className={checkRequired && checkRequired.name && checkRequired.name === true ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                      label="Sổ VB phòng"
                      configType="crmSource"
                      configCode="S40"
                      type="Source|CrmSource,S40|Value||value"
                      typeDocument="IncommingDocument"
                      name="preBookDocumentId"
                      profile={profile}
                      value={localState.preBookDocumentId}
                      isBookDocument={true}
                      disabled={true}
                      // onChange={handleChangeType('preBookDocumentId')}
                      error={localMessages && localMessages.preBookDocumentId}
                      helperText={localMessages && localMessages.preBookDocumentId}
                      required={checkRequired.preBookDocumentId}
                      checkedShowForm={checkShowForm.preBookDocumentId}
                    /> */}
                      <CustomInputBase
                        label={_.get(name2Title, 'preToBookCode', 'Sổ VB đến')}
                        value={localState.preBookDocumentId && localState.preBookDocumentId.name}
                        name="preBookDocumentId"
                        disabled={true}
                        error={localMessages && localMessages.preBookDocumentId}
                        helperText={localMessages && localMessages.preBookDocumentId}
                        required={checkRequired.preBookDocumentId}
                        checkedShowForm={checkShowForm.preBookDocumentId}
                        // onChange={handleChangeType('toBookCode')}
                        className={
                          checkRequired && checkRequired.preBookDocumentId && checkRequired.preBookDocumentId === true
                            ? 'CustomRequiredLetter'
                            : 'CustomIconRequired'
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <CustomDatePicker
                        label="Ngày nhận văn bản"
                        isAddExe={true}
                        value={localState.preReceiveDate}
                        name="preReceiveDate"
                        disabled={true}
                        // onChange={e => handleInputChange(null, 'preReceiveDate', moment(e).format('YYYY-MM-DD'))}
                        // onBlur={handleTypeChange}
                        error={localMessages && localMessages.preReceiveDate}
                        helperText={localMessages && localMessages.preReceiveDate}
                        required={checkRequired.preReceiveDate}
                        isFuture={false}
                        checkedShowForm={checkShowForm.preReceiveDate}
                        className={
                          checkRequired && checkRequired.preReceiveDate && checkRequired.preReceiveDate === true
                            ? 'CustomRequiredLetter'
                            : 'CustomIconRequired'
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <CustomDatePicker
                        label="Ngày vào sổ"
                        isAddExe={true}
                        value={localState.preToBookDate}
                        name="preToBookDate"
                        disabled={true}
                        // onChange={e => handleInputChange(null, 'preToBookDate', moment(e).format('YYYY-MM-DD'))}
                        // onBlur={handleTypeChange}
                        error={localMessages && localMessages.preToBookDate}
                        helperText={localMessages && localMessages.preToBookDate}
                        required={checkRequired.preToBookDate}
                        isFuture={false}
                        checkedShowForm={checkShowForm.preToBookDate}
                        className={
                          checkRequired && checkRequired.preToBookDate && checkRequired.preToBookDate === true
                            ? 'CustomRequiredLetter'
                            : 'CustomIconRequired'
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <CustomInputBase
                        label={_.get(name2Title, 'preToBookCode', 'Số đến')}
                        value={localState.preToBookCode}
                        name="preToBookCode"
                        disabled={true}
                        error={localMessages && localMessages.preToBookCode}
                        helperText={localMessages && localMessages.preToBookCode}
                        required={checkRequired.preToBookCode}
                        checkedShowForm={checkShowForm.preToBookCode}
                        // onChange={handleChangeType('toBookCode')}
                        className={
                          checkRequired && checkRequired.preToBookCode && checkRequired.preToBookCode === true
                            ? 'CustomRequiredLetter'
                            : 'CustomIconRequired'
                        }
                      />
                    </Grid>
                  </Grid>
                </>
              ) : null}


              <Grid item xs={12}>
                <CustomInputBase
                  rows={5}
                  multiline
                  label={_.get(name2Title, 'abstractNote', 'Trích yếu')}
                  value={localState.abstractNote}
                  name="abstractNote"
                  onChange={e => handleInputChange(e)}
                  error={localMessages && localMessages.abstractNote}
                  helperText={localMessages && localMessages.abstractNote}
                  required={checkRequired.abstractNote}
                  checkedShowForm={checkShowForm.abstractNote}
                  className={
                    checkRequired && checkRequired.abstractNote && checkRequired.abstractNote === true ? 'CustomRequiredLetter' : 'CustomIconRequired'
                  }
                />
              </Grid>

              <Grid item xs={12}>
                {id && docDetail ? (
                  <>
                    <FileUpload view={view} name={docDetail.name} newWay onChangeFile={onChangeFile} id={id} code={code} />
                  </>
                ) : (
                  <div>
                    <div>
                      <span style={{ marginRight: 10, fontSize: 12, fontWeight: 'bold', color: 'black' }}>TỆP ĐÍNH KÈM</span>
                      <label htmlFor="fileUpload" style={{ display: 'inline-block', marginRight: 10 }}>
                        <Button color="primary" variant="contained" component="span">
                          {/* <span style={{ marginRight: 5 }}>
                          <AttachFileIcon />
                        </span> */}
                          <span style={{ fontWeight: 'bold' }}>Tệp đính kèm</span>
                        </Button>
                      </label>
                      <label htmlFor="fileScan">
                        <Button color="primary" variant="contained" component="span" onClick={() => setScanDialog({})}>
                          {/* <span style={{ marginRight: 5 }}>
                          <Scanner />
                        </span> */}
                          <span style={{ fontWeight: 'bold' }}>Quét văn bản</span>
                        </Button>
                      </label>
                    </div>
                    <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      {localState.file && <FileUpload file={localState.file} id={'add'} onDeleteFile={handleFileDelete} />}
                    </div>
                    <input onChange={handleFileChange} id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" multiple />
                  </div>
                )}
              </Grid>
            </Grid>
            {id &&
              localState.isAnyDepartment && (
                <Grid item xs={4} style={{ height: "calc(100vh - 150px)", overflow: "auto" }}>
                  <Comment profile={profile} code={code} isAuthory={isAuthory} id={localState._id} revert disableLike viewOnly={true} />
                </Grid>
              )}
          </Grid>
        ) : null}
        <Dialog dialogAction={false} open={props.addExecutiveDocuments && props.addExecutiveDocuments.load}>
          <DialogContent>Đang tải files, đồng chí vui lòng chờ...</DialogContent>
        </Dialog>
        <DialogUI title="Tải file" onClose={() => setOpenDialogScan(false)} open={openDialogScan}>
          <ScanFileByH
            onSaveDataScan={(data) => { setLocalState({ ...localState, ...data }); setOpenDialogScan(false) }}
            onCloseDialogScan={() => setOpenDialogScan(false)}
            code="IncommingDocument"
          />
        </DialogUI>
        {/* filter={{
            [`others.${code}`]: id,
          }} */}
        {/* {index === 1 && docDetail ? <Comment profile={profile} code={code} id={id} /> : null} */}
        {index === 1 ? (
          <ListPage
            columnExtensions={[{ columnName: 'name', width: 300 }, { columnName: 'edit', width: 150 }, { columnName: 'progress', width: 180 }]}
            tree
            exportExcel
            // reload={reload}
            apiUrl={`${API_TASK_PROJECT}/projects`}
            code="Task"
            kanban="KANBAN"
            status="taskStatus"
            mapFunction={mapTask}
            addChildTask
            filter={{
              $or: [{ [`others.${code}`]: id }, { [`incommingDocuments`]: id }],
            }}
            perPage={5}
            // extraMenu={openBusiness}
            settingBar={[addItem(`/Task/add`, code, id)]}
            disableAdd
            onEdit={row => history.push(`/Task/${row._id}`)}
          />
        ) : null}
        {/* {index === 5 && id ? (
        <ListPage
          code="DocumentHistory"
          apiUrl={API_DOCUMENT_HISTORY}
          filter={{ docId: id }}
          disableAdd
          disableSearch
          disableImport
          disableViewConfig
        />
      ) : null} */}
        {/* lịch */}
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
                    'createdBy.employeeId': dashboardPage.profile._id,
                  },
                  { 'people.employeeId': dashboardPage.profile._id },
                  { 'organizer.employeeId': dashboardPage.profile._id },
                ],
                $or: [{ [`others.${code}`]: id }, { dataIncoming: id }],
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
              onEdit={row => history.push(`/AllCalendar/MeetingCalendar/${row._id}`)}
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

        {
          openAsignProcessor && <DocumentAssignModal
            open={openAsignProcessor}
            file={localState.file}
            docIds={selectedDocs}
            processType={processType}
            profile={profile}
            dataDoc={localState}
            template={templates}
            childTemplate={selectedTemplate}
            onUpdate={onUpdateExecutiveDocument}
            onClose={onClose}
            saveAndSend={saveAndSend}
            onSuccess={onSuccess}
            onChangeSnackbar={props.onChangeSnackbar}
            currentRole={nextRole}
            role="receive"
            rootTab={localStorage.getItem('IncommingDocumentTab')}
            allowSendToUnit={allowSendToUnit}
            handleCheckValidate={handleCheckValidate}
          />
        }


        <ScanDialog onSave={file => handleFileChange(file)} scanDialog={scanDialog} setScanDialog={setScanDialog} />
      </div>
    </SwipeableDrawer>
  );
}

AddExecutiveDocuments.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addExecutiveDocuments: makeSelectAddExecutiveDocuments(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onAddExecutiveDocument: (query, cb, types) => {
      dispatch(addExecutiveDocument(query, cb, types));
    },
    onDeleteExecutiveDocument: ids => {
      dispatch(deleteExecutiveDocument(ids));
    },
    onUpdateExecutiveDocument: (data, cb) => {
      dispatch(updateExecutiveDocument(data, cb));
    },
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addExecutiveDocuments', reducer });
const withSaga = injectSaga({ key: 'addExecutiveDocuments', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddExecutiveDocuments);
