// EditGoDocuments

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import { DialogTitle, DialogActions, DialogContent, Dialog as Dialogg } from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import { mergeData } from './actions';
import makeSelectEditGoDocuments from './selectors';
import reducer from './reducer';
import { Comment, FileUpload, Tabs, Tab, AsyncAutocomplete, Autocomplete } from '../../components/LifetekUi';
import CustomAppBar from 'components/CustomAppBar';
import { Check, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import DepartmentSelect from '../../components/DepartmentSelect/CloneTripble';

import { makeSelectProfile } from '../Dashboard/selectors';
import ListPage from 'components/List';
import { Paper as PaperUI } from 'components/LifetekUi';
import {
  API_GOING_DOCUMENT,
  API_USERS,
  API_DOCUMENT_HISTORY,
  API_ROLE_APP,
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_AUTHORY_PROFILE,
  API_ORIGANIZATION,
  API_TASK_PROJECT,
  API_BEFORE_RECALL,
} from '../../config/urlConfig';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { viewConfigName2Title, getListData } from '../../utils/common';
import Department from 'components/Filter/DepartmentAndEmployee';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';
import { changeSnackbar } from '../Dashboard/actions';
import DocumentAssignModal from 'components/DocumentAssignModalGo';
import DocumentSetCommanders from 'components/DocumentAssignModalGo/SetCommanders';
import ReturnDocs from 'components/DocumentAssignModalGo/ReturnDocs';
import CompleteDocs from 'components/DocumentAssignModalGo/CompleteDocs';
import AgreeFiles from 'components/DocumentAssignModalGo/AgreeFiles';

import ReleaseDocs from 'components/DocumentAssignModalGo/ReleaseDocs';
import { fetchData, flatChild, serialize } from '../../helper';
import FlowDocument from 'components/FlowComponent';
import { getShortNote, checkCanProcess } from '../../utils/functions';
import './index.css';
import moment from 'moment';
import _ from 'lodash';
import { taskStatusArr } from 'variable';
import request from '../../utils/request';

function getId(str) {
  if (!str) {
    return str;
  }
  const arr = str.split('/');
  return arr[arr.length - 1];
}
function EditGoDocuments(props) {
  const { profile, code = 'OutGoingDocument', editGoDocuments, onChangeSnackbar } = props;
  const id = props.id ? props.id : props.location.id ? props.location.id : getId(props.location.pathname);
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role');
  const isAuthory = urlParams.get('isAuthory') || false;

  const currentTab = urlParams.get('tab');
  const [statusButton1, setStatusButton1] = useState(true);
  const [statusButton2, setStatusButton2] = useState(false);
  const [statusButton3, setStatusButton3] = useState(false);
  const [statusButton4, setStatusButton4] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([id]);
  const [docDetail, setDocDetail] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [viewType, setViewType] = useState('any');
  const [localState, setLocalState] = useState({
    others: {},
    processeds: props.location && props.location.state,
  });
  const [returnTypeDocument, setReturnTypeDocument] = useState('');

  const [openRelease, setOpenRelease] = useState(false);
  const [name2Title, setName2Title] = useState({});
  const [currentRole, setCurrentRole] = useState(null);
  const [nextRole, setNextRole] = useState(null);
  const requestURL = API_GOING_DOCUMENT;
  const [openAsignProcessor, setOpenAsignProcessor] = useState(false);
  const [openSetCommanders, setOpenSetCommanders] = useState(false);
  const [onePiece, setOnePiece] = useState(false);
  const [openReturnDocs, setOpenReturnDocs] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [openAgreeFiles, setOpenAgreeFiles] = useState(false);

  const [openDialogResponse, setOpenDialogResponse] = useState(null);
  const [history, setHistory] = useState({});
  const [indexStatus, setIndexStatus] = useState({});
  const [allRoles, setAllRoles] = useState([]);
  const [signRole, setSignRole] = useState();
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [businessRole, setBusinessRole] = useState({});
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [tab, setTab] = useState('info');
  const [newDraftFile, setNewDraftFile] = useState();
  const [updateDraft, setUpdateDraft] = useState();

  const [newDraftTTFile, setNewTTDraftFile] = useState();
  const [updateTTDraft, setUpdateTTDraft] = useState();

  const [draftData, setDraftData] = useState({});
  const [authoryProfile, setAuthoryProfile] = useState({});
  const [process, setProcess] = useState(localStorage.getItem('Processor'));
  const convertFileRef = useRef([]);
  const [recipientId, setRecipientId] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [recipient, setRecipient] = useState([]);
  const [docId, setDocId] = useState(null);
  const [reloadVBBC, setReloadVBBC] = useState(0);
  const [reloadPBBC, setReloadPPBC] = useState(0);
  const [reloadVBDT, setReloadVBDT] = useState(0);
  const [reloadPBDT, setReloadPBDT] = useState(0);
  const [senderUnitData, setSenderUnitData] = useState({});
  const [openConsult, setOpenConsult] = useState(null);
  const [consult, setConsult] = useState('');
  const [processType, setProcessType] = useState('');
  const [roleGroupSource, setRoleGroupSource] = useState(null);
  const [handleClick, setHandleClick] = useState(false);
  const [openDialogRecall, setOpenDialogRecall] = useState(false);
  const [roomApply, setRoomApply] = useState([]);
  const [note, setNote] = useState('');
  const [dataRecall, setdataRecall] = useState();
  const [canChangeFile, setCanChangeFile] = useState(true);
  const [cantChangeFileReport, setCantChangeFileReport] = useState(false);
  const [isRefund, setIsRefund] = useState(true);

  const [listFileDuThao, setListFileDuThao] = useState([]);
  const [listFileBaoCao, setListFileBaoCao] = useState([]);
  const [resetTab, setResetTab] = useState(new Date()*1);


  
  
  const [goTypeProcess, setGoTypeProcess] = useState('');
  const onReloadVBBC = () => setReloadVBBC(reloadVBBC + 1);
  const onReloadPBBC = () => setReloadPPBC(reloadPBBC + 1);
  const onReloadVBDT = () => setReloadVBDT(reloadVBDT + 1);
  const onReloadPBDT = () => setReloadPBDT(reloadPBDT + 1);
  const [canScanReport, setcanScanReport] = useState(true);
  const [canScanDraft, setcanScanDraft] = useState(true);
  const [checkCanProcessDoc, setCheckCanProcessDoc] = useState(false);

  const [issuedAPart, setIssuedAPart] = useState(false);




  const allowScan = _.get(businessRole, 'scan');
  const forceUpload = (_.get(localState, 'completeStatus') === 'promulgated' || _.get(localState, 'releasePartStatus') === "released") && allowScan;
  const allowSign = _.get(businessRole, 'esign') || _.get(signRole, 'ky_so') || _.get(signRole, 'ky_nhay');
  const allowSignApostropher = _.get(profile, '_id') === localState.apostropher && localState.signingStatus === 'waitingSign';

  const TABS = [
    { label: 'Thông tin chung', value: 'info' },
    { label: 'Hồ sơ công việc', value: 'work' },
    { label: 'Lịch cá nhân', value: 'meetingCalendar' },
    { label: 'Nguồn gốc', value: 'source' },
  ];

  // const newData = (JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S19') || { data: [] }).data;
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
      // releasePartStatus
      console.log(currentTab, 'currentTab', role)
      if (parseInt(currentTab) === 0 && (role === 'receive' || role === 'processors')) {
        const { releasePartStatus } = localState
        if (releasePartStatus === "released") {
          // ban hành rồi thì k đc sửa, ký
          setCantChangeFileReport(true)
          setIsRefund(false)
          console.log("Đã ban hành")

          if(localState.completeStatus === "promulgated"){
            // đã ban hành
            setCanChangeFile(false);
          }else {
            console.log("Đã ban hành 1 phần")
            // đã ban hành 1 phần
            setCanChangeFile(false);
          }
          
        } else{
          setIsRefund(true)

          console.log("Chưa ban hành")
          setCanChangeFile(false);
          setCantChangeFileReport(false)
        }
       
      }
      else {
        setIsRefund(true)

        // ở các tab khác
        console.log("ở các tab khác")
        setCantChangeFileReport(true)
        setCanChangeFile(true);
      }
    },
    [role, currentTab, localState],
  );
  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);
    return () => {
      newNam2Title;
    };
  }, []);
  useEffect(() => {
    if(!isAuthory){
      // check quyền xử lý văn bản
      if (localState && localState.processors && localState.processors[0] && localState.processors[0] === profile._id) {
        setCheckCanProcessDoc(true)
      } else setCheckCanProcessDoc(false)
    }else {
      if (localState && localState.authorized  === profile._id) {
        console.log("KKK")
        setCheckCanProcessDoc(true)
      } else setCheckCanProcessDoc(false)
    }
   
  }, [localState])
  useEffect(
    () => {
      getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/outGoingDocument`).then(res => {
        if (res.status === 1) {
          setTemplates([{ ...res }]);
          fetchData(`${API_ORIGANIZATION}?processType=outGoingDocument&processId=${res._id}`).then(departmentsData => {
            const flattedDepartment = flatChild(departmentsData);
            setRecipient(flattedDepartment);
          });
        } else {
          onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng dự thảo', status: true });
        }
      });
      if (role === 'processors' && localState.processeds) {
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
    [role, openDialogResponse],
  );

  useEffect(
    () => {
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
            getBusinessRoles(isAuthory);
            // let dataLocal = { ...data };
            // if (data && data.recipientId && data.recipientId._id) {
            //   dataLocal = { ...dataLocal, recipientId: recipient.find(i => i._id === data.recipientId._id) };
            //   setRecipientId(data.recipientId._id);
            // }
            let datab = { ...data };
            datab.recipientIds &&
              Array.isArray(datab.recipientIds) &&
              datab.recipientIds.length > 0 &&
              datab.recipientIds.map(el => {
                el.recipientId = recipient.find(i => i._id === el.recipientId);
              });
            setLocalState(datab);
            setCurrentRole(data.currentRole);
            setNextRole(data.nextRole);

            setReceiver(data.receiver);
          });
      } else {
        getBusinessRoles();
      }
    },
    [id, recipient],
  );

  const getDraft = data => {
    if (data) {
      data.map(item => {
        if (item.code === profile.roleGroupSource) {
          setDraftData(item);
        }
      });
    }
  };

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
        setHistory(data);
      });
  }, [id]);

  const getBusinessRoles = (isAuthoryDoc = false) => {
    fetchData(`${API_ROLE_APP}/OutGoingDocument/currentUser?${isAuthoryDoc ? 'authority=true' : ''}`).then(res => {
      const { roles } = res;
      const code = 'BUSSINES';
      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
      setAllRoles(foundRoleDepartment);

      const role = Array.isArray(roles) && roles.find(it => it.code === 'NATURE');
      const sign_role = {};
      _.get(role, 'data', []).forEach(e => {
        sign_role[e.name] = e.data.allow || e.data.access;
      });

      setSignRole(sign_role);
    });
  };
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
        setBusinessRole(newBusinessRole && newBusinessRole.data);
      }
    },
    [id, allRoles, profile],
  );

  const getDetail = id => {
    setDocDetail({ name: 'abc' });
  };

  function handleViewType(newViewType) {
    setViewType(newViewType);
    if (newViewType === 'project') {
      <Check />;
    }

    // setOpenDialogTask(null);
  }

  const handleChangeTab = (event, newValue) => {
    // thay đổi tab nè
    console.log("setResetTab(new Date()*1)")
    setNewDraftFile()
    setNewTTDraftFile()
    setResetTab(new Date()*1)
    setTab(newValue);
  };
  const onClickRow = (e, ids) => {
    // e.preventDefault()
    // props.history.valueData = id;
    props.history.push({
      pathname: `/incomming-document-detail/${ids}`,
      state: id,
    });
  };
  const onClickRowTask = (e, id) => {
    e.preventDefault();
    props.history.valueData = id;
    // props.history.push(`Task/task-detail/${id}`);

    props.history.push({
      pathname: `/Task/task-detail/${id}`,
      // state: {
      //   idd: id ? id : 'add',
      //   localState: JSON.stringify(localState),
      // },
    });
  };

  const handleOpen = (e, type, isReturn = false) => {
    if (type === 'command') {
      setOpenSetCommanders(true);
      return;
    }
    if (type === 'consult') {
      setOpenConsult(e.currentTarget);
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

  const handleClose = e => {
    setOpenDialog(null);
    setOpenConsult(null);
    setOpenDialogResponse(null);
    setOpenReturnDocs(false);
    setOpenAsignProcessor(false);
    setOpenSetCommanders(false);
    setAllowedUsers([]);
    setReturnTypeDocument()
  };

  const handleOpenDialogDoc = (bool, type, typeDocument) => {
    if (type === 'assign') {
      setOpenAsignProcessor(bool);
    } else if (type === 'release') {
      setOpenRelease(bool);
    } else {
      setOpenReturnDocs(bool);
    }
    setReturnTypeDocument(typeDocument)
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

  const checkEndFlow = (array = []) => {
    let result = false;
    if (array && array.length > 0) {
      array.map(item => {
        if (item.children && item.children.length === 0) {
          result = false;
        }
        if (!item.children) {
          result = false;
        }
        if (item.children && item.children.length > 0) {
          result = true;
        }
      });
    }
    if (array.length === 0) {
      result = false;
    }
    return result;
  };

  const checkRoleCanAction = (key, profile, state, isAuthory = false) => {
    if (isAuthory) {
      return state && state.author && state[key] && state[key].indexOf(state.author) !== -1 ? true : false;
    }
    return state && profile && state[key] && state[key].indexOf(profile._id) !== -1 ? true :
      state && profile && state[key] && state[key].find(it => it._id === profile._id) ? true : false;
  };
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
  const getFileReport = data => {
  };

  const canReturn = businessRole && businessRole.returnDocs && role !== 'receive' && localState.completeStatus === 'waitPromulgate';
  const canFeedBack = businessRole && businessRole.set_feedback && role !== 'receive' && localState.completeStatus === 'waitPromulgate';
  let canEditFile;

  if (role === 'processors') {
    canEditFile = process === 'Chờ xử lý';
  } else {
    canEditFile = localState.stage === 'processing' ? false : true;
  }

  const dataFormat = history ? history : [];

  // processors
  // const isEndFlow = localState && localState.children && localState.children[0] && !localState.children[0].children ? false : true;
  const isProcessor =
    role !== 'receive' ? checkRoleCanAction('processors', profile, localState) : checkRoleCanAction('processeds', profile, localState) ? false : true;
  const isProcessorAuthor =
    role !== 'receive'
      ? checkRoleCanAction('processors', profile, localState, isAuthory)
      : checkRoleCanAction('processeds', profile, localState)
        ? false
        : true;
  const isProcesseds = checkRoleCanAction('processeds', profile, localState);
  const isProcessedsAuthor = checkRoleCanAction('processeds', profile, localState, isAuthory);
  // support
  const isSupporters = checkRoleCanAction('supporters', profile, localState);
  const isSupportersAuthor = checkRoleCanAction('supporters', profile, localState, isAuthory);
  const isSupported = checkRoleCanAction('supporteds', profile, localState);
  const isSupportedAuthor = checkRoleCanAction('supporteds', profile, localState, isAuthory);
  // commanded feedBack
  const isCommanders = checkRoleCanAction('commanders', profile, localState);
  const isCommandersAuthor = checkRoleCanAction('commanders', profile, localState, isAuthory);
  const isCommanded = checkRoleCanAction('commandeds', profile, localState);
  const isCommandedAuthor = checkRoleCanAction('commandeds', profile, localState, isAuthory);
  const isEndFlow = localState && localState.children && checkEndFlow(localState.children);

  const isViewers = checkRoleCanAction('viewers', profile, localState);
  const isViewersAuthor = checkRoleCanAction('viewers', profile, localState, isAuthory);
  // can complete
  const completeAuthor =
    isAuthory && localState && localState.author && localState.signer && localState.author === localState.signer._id ? true : false;
  const complete = localState && profile && localState.signer && localState.signer._id === profile._id ? true : false;

  const canComplete = completeAuthor || complete;

  const checkComplete = () => {
    const isLastInTemplate = businessRole && businessRole.set_complete && businessRole.set_complete === true ? true : false;
    return isLastInTemplate || canComplete;
  };
  const checkSetProcessor = () => {
    let result = isProcessorAuthor || isProcessor;
    return result;
  };
  // can complete a peace
  // const child = (Array.isArray(templates) && templates.length > 0 && templates[0].children) || [];
  const child = (Array.isArray(localState.children) && localState.children.length > 0 && localState.children) || [];

  const childComplate = child.find(item => item.code === props.profile.roleGroupSource) || {};
  //  Done
  const isDone = checkComplete() && checkSetProcessor();
  const isDoneAuthor = isAuthory && checkComplete() && checkSetProcessor();
  const canProcess = templates && profile && isAuthory ? checkCanProcess(templates, localState) : checkCanProcess(templates, localState);

  // Luog du thao
  useEffect(
    () => {
      if (id !== '' || isDraft) {
        templates && templates[0] && templates[0].children && getDraft(templates[0].children);
      }
    },
    [openAsignProcessor, templates, id],
  );
  useEffect(() => {
    if (isAuthory && localState.author) {
      fetchData(`${API_AUTHORY_PROFILE}/${localState.author}`).then(res => {
        if (res && res.data) {
          setAuthoryProfile(res.data);
        }
      });
    }
  }, [localState])
  useEffect(
    () => {
      if (role === "release" && (currentTab === 0 || currentTab === "0")) {
        if (role === 'release' &&
          localState.releasePartStatus !== 'released' &&
          (Array.isArray(localState.listFiles) && localState.listFiles.length > 0) &&
          (location && !location.recall) &&
          (props &&
            props.profile &&
            props.profile.organizationUnit &&
            props.profile.organizationUnit.organizationUnitId === localState.completePartUnit)) {
          //  ban hành 1 phần 
          setcanScanDraft(false)
          setcanScanReport(true)
        }
        else if (props.location &&
          !props.location.recall &&
          localState &&
          role === 'release' &&
          localState.completeStatus === 'waitPromulgate' && localState.releasePartStatus === "released"
          && Array.isArray(localState.listFiles) && localState.listFiles.length > 0
          // !(
          //   role === 'release' &&
          //   localState.releasePartStatus !== 'released' &&
          //   (Array.isArray(localState.listFiles) && localState.listFiles.length > 0) &&
          //   (location && !location.recall) &&
          //   (props &&
          //     props.profile &&
          //     props.profile.organizationUnit &&
          //     props.profile.organizationUnit.organizationUnitId === localState.completePartUnit)
          //)
        ) {
          // ban hành toàn phần - đã ban hành 1p
          console.log('toàn phần')
          setcanScanDraft(true)
          setcanScanReport(false)
        }
        else if (props.location &&
          !props.location.recall &&
          localState &&
          role === 'release' &&
          localState.completeStatus === 'waitPromulgate'
          && Array.isArray(localState.listFiles) && localState.listFiles.length > 0) {
          setcanScanDraft(true)
          setcanScanReport(true)
        }
      }
      else {
        console.log('fail')
        setcanScanDraft(false)
        setcanScanReport(false)
      }


      // if (localState && localState.releasePartStatus === "released") {
      //   if (localState.completeStatus === "promulgated") {
      //     setcanScanDraft(true)
      //     setcanScanReport(false)
      //   }
      //   else {
      //     setcanScanDraft(false)
      //     setcanScanReport(true)
      //   }
      // }
      // else {
      //   setcanScanDraft(true)
      //   setcanScanReport(true)
      // }
    },
    [localState, role, currentTab],
  );

  useEffect(() => {
    setProcess(localStorage.getItem('Processor'));
  });
  useEffect(
    () => {
      if (localState.senderUnit !== undefined && typeof localState.senderUnit === 'string' && id && id !== 'add')
        fetchData(`${API_ORIGANIZATION}/${localState.senderUnit}`).then(res => {
          if (res && res.data) {
            setSenderUnitData(res.data);
          }
        });
    },
    [localState.senderUnit],
  );
  useEffect(
    () => {
      const { children } = localState;
      if (children && Array.isArray(children) && children.length > 0 && children[0].consult) {
        setConsult(children[0].consult);
      } else setConsult('');
    },
    [localState],
  );
  const getValue = receivers => {
    let data = '';
    if (receivers && Array.isArray(receivers) && receivers.length > 0) {
      data = receivers.map(it => (it ? it.name : null)).join(', ');
    }
    return data;
  };
  const recipientUnit = (el, ind) => {
    return (
      <>
        <Grid item xs={12} md={12} container spacing={8}>
          <Grid item xs={6}>
            <Autocomplete
              disabled
              // onChange={value => setLocalState({ ...localState, recipientId: value })}
              suggestions={recipient}
              value={el.recipientId}
              label="Đơn vị nhận"
            />
          </Grid>
          {/* <Grid item xs={6}>
            <AsyncAutocomplete
              // filter={{ ['organizationUnit.organizationUnitId']: el.recipientId && el.recipientId._id }}
              value={el.receivers}
              label="Cán bộ nhận"
              url={API_PERSONNEL_RECEIVER}
            disabled
            />
          </Grid> */}
          <Grid item xs={6}>
            <CustomInputBase disabled value={el.receivers ? getValue(el.receivers) : ''} label="Cán bộ nhận" variant="outlined" fullWidth />
          </Grid>
        </Grid>
      </>
    );
  };
  const handleChangeOrganization = viewedDepartmentIds => {
    setRoomApply(viewedDepartmentIds);
  };
  const handleReCall = () => {
    const result = dataRecall.filter(x => roomApply.includes(x.receiverUnit));
    let docIds = [];
    Array.isArray(result) &&
      result.length > 0 &&
      result.map(el => {
        docIds.push(el._id);
      });
    const urlApi = `${API_GOING_DOCUMENT}/recall-internal`;
    request(urlApi, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docIds: docIds,
        outGoingDocumentID: id,
        note: note,
      }),
    })
      .then(data => {
        if (data.successNo > 0) {
          onChangeSnackbar({ variant: 'success', message: 'Thu hồi thành công', status: true });
          props.history.push('/OutGoingDocument');
        } else onChangeSnackbar({ variant: 'error', message: 'Thu hồi thất bại', status: true });
      })
      .catch(err => {
        onChangeSnackbar({ variant: 'error', message: err.message || 'Thu hồi thất bại', status: true });
      });
  };
  const handleGetApiBeforeRecall = () => {
    const urlApi = `${API_BEFORE_RECALL}`;
    request(urlApi, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ docIds: [id] }),
    })
      .then(data => {
        if (data.success && data.data) setdataRecall(data.data);
      })
      .catch(err => {
        onChangeSnackbar({ variant: 'error', message: 'Thao tác thất bại', status: true });
      });
  };
  useEffect(() => {
    // role === 'release' &&
    // localState.releasePartStatus !== 'released' &&
    // (Array.isArray(localState.listFiles) && localState.listFiles.length > 0) &&
    // (location && !location.recall) &&
    // completePartUnit === localState.completePartUnit
    // console.log(role, "role");
    // console.log(localState.releasePartStatus, "role", props.location);
    // chờ ban hành 
    // props.location &&
    // !props.location.recall &&
    // localState &&
    // role === 'release' &&
    // parseInt(currentTab) !== 5 &&
    // localState.completeStatus === 'waitPromulgate' &&
    // !(
    //   role === 'release' &&
    //   localState.releasePartStatus !== 'released' &&
    //   (Array.isArray(localState.listFiles) && localState.listFiles.length > 0) &&
    //   (location && !location.recall) &&
    //   (props &&
    //     props.profile &&
    //     props.profile.organizationUnit &&
    //     props.profile.organizationUnit.organizationUnitId === localState.completePartUnit)
    // )


    // chờ ban hành 1 phần
    // const { location } = props
    // const completePartUnit = props && props.profile && props.profile.organizationUnit && props.profile.organizationUnit.organizationUnitId
    // if (role === 'release' && localState.releasePartStatus !== 'released'
    //   && (Array.isArray(localState.listFiles) && localState.listFiles.length > 0) && (location && !location.recall) && completePartUnit === localState.completePartUnit) {
    //   setcanScanDraft(false)
    //   setcanScanReport(true)
    //   console.log("chờ ban hành 1p")
    // }
    // else {
    //   console.log("chờ ban hành")
    //   setcanScanDraft(false)
    //   setcanScanReport(false)
    // }
    if (localState && localState.releasePartStatus) {
      switch (localState.releasePartStatus) {
        case 'waitting':
          if (localState.stage === 'complete') {
            // Chờ ban hành
            setIssuedAPart(false)
          } else {
            console.log('Chờ ban hành một phần')
            // Chờ ban hành một phần
            setIssuedAPart(true)
          }
        case 'released':
          if (localState.completeStatus && localState.completeStatus === 'promulgated') {
            // Đã ban hành
            // setIssuedAPart(false)

          } else {
            // Đã ban hành một phần
            // setIssuedAPart(true)
          }
      }
    } else {
      setIssuedAPart(false)
    }
  }, [localState])


  function setStatus(action) {
    const url = isAuthory ? `${API_GOING_DOCUMENT}/change-status?authority=true` : `${API_GOING_DOCUMENT}/change-status`;

    const body = {
      docIds: [id],
      role: "viewers",
      // action,
    };
    request(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        props.onChangeSnackbar({ variant: 'success', message: 'Thao tác thành công', status: true });
        if (isAuthory) {
          props.history.push('/AuthorityDocument');
        } else {
          props.history.push('/OutGoingDocument');
        }
      })
      .catch(error => {
        props.onChangeSnackbar({ variant: 'error', message: error.message || 'Thao tác thất bại', status: true });
      });
  }
  return (
    <div>
      <CustomAppBar
        title={'Chi tiết văn bản dự thảo'}
        onGoBack={() => {
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else if (props.location && props.location.recall) {
            props.history.push({
              pathname: '/RecallDocument',
              index: 'goDocuments',
              tabtab: (props && props.location && props.location.tabtab) || 0,
            });
          }
          // else if (props.goBackTask) {
          //   props.goBack()
          // }
          else if (props.goBack) {
            props.goBack();
          } else if (props.location && props.location.link) {
            props.history.push({
              pathname: props.location.link,
              tab: 'outGoingDocument',
            });
          } else {
            props.history.push('/OutGoingDocument');
          }
        }}
        disableAdd
        moreButtons={
          <div style={{ marginLeft: 10, display: 'flex', justifyContent: 'space-around' }}>
            {!issuedAPart &&(isDone || isDoneAuthor) &&
              // ((Array.isArray(localState.listFiles) && localState.listFiles.length === 0 && !(listFileBaoCao.length && listFileDuThao)) ||
              (( !(listFileBaoCao.length && listFileDuThao.length)) ||

                // (Array.isArray(localState.listFiles) && localState.listFiles.length > 0 && localState.releasePartStatus)) &&
                !issuedAPart && 
                (listFileBaoCao.length && listFileDuThao && localState.releasePartStatus)) &&
              (props.location && !props.location.recall) && (
                <Button
                  style={{ marginRight: 10 }}
                  variant="outlined"
                  color="inherit"
                  onClick={e => {
                    setOpenComplete(true);
                  }}
                >
                  {/* <span style={{ marginRight: 5 }}>
                  <CheckBox />
                </span> */}
                  Hoàn thành xử lý
                </Button>
              )}
            {/* {(childComplate.signedProcess) && (props.location && !props.location.recall) && ( */}

            {/* <ReleaseButton role={role} localState={localState} location={props.location} setOpenRelease={setOpenRelease} setOnePiece={setOnePiece} /> */}
            {props.location &&
              !props.location.recall &&
              localState &&
              role === 'release' &&
              parseInt(currentTab) !== 5 &&
              localState.completeStatus === 'waitPromulgate' &&
              !(
                role === 'release' &&
                localState.releasePartStatus !== 'released' &&
                (Array.isArray(localState.listFiles) && localState.listFiles.length > 0) &&
                (location && !location.recall) &&
                (props &&
                  props.profile &&
                  props.profile.organizationUnit &&
                  props.profile.organizationUnit.organizationUnitId === localState.completePartUnit)
              ) ? (
              <Button
                style={{ marginRight: 10 }}
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setOpenRelease(true);
                }}
              >
                {/* <span style={{ marginRight: 5 }}>
                  <CheckBox />
                </span> */}
                Ban hành
              </Button>
            ) : null}
           
            {props.location &&
              !props.location.recall &&
              (canFeedBack || (isAuthory && canFeedBack)) &&
              role !== 'feedback' && (
                <Button
                  style={{ marginRight: 10 }}
                  variant="outlined"
                  color="inherit"
                  onClick={e => {
                    // setOpenSetCommanders(true);
                    handleOpen(e, 'consult');
                  }}
                >
                  {/* <span style={{ marginRight: 5 }}>
                  <ChatBubbleOutline />
                </span> */}
                  {role === 'feedback' ? 'Chuyển xử lý ý kiến' : ' Xin ý kiến'}
                </Button>
              )}
            {isRefund && !issuedAPart && props.location &&
              !props.location.recall &&
              currentTab === '0' &&
              (canReturn || (isAuthory && canReturn)) && localState.canReturn && checkCanProcessDoc && (
                <Button
                  style={{ marginRight: 10 }}
                  variant="outlined"
                  color="inherit"
                  onClick={e => {
                    // handleOpen(e, role, true);
                    handleOpenDialogDoc && handleOpenDialogDoc(true, 'flow', 'OutgoingDocument');
                  }}
                >
                  <span style={{ marginRight: 5 }}>{/* <Replay /> */}</span>
                  Trả lại
                </Button>
              )}

            {/* tra lai */}
            {/* <Menu
              open={Boolean(openDialogResponse)}
              anchorEl={openDialogResponse}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handleClose}
            >
              <MenuItem
                value="flow"
                onClick={e => {
                  handleOpenDialogDoc && handleOpenDialogDoc(true, 'flow');
                }}
              >
                Trả cho {allowedUsers && allowedUsers[0] ? allowedUsers[0].name : ''}
              </MenuItem>
            </Menu> */}

            {!issuedAPart &&props.location &&
              !props.location.recall &&
              (role === 'receive' || role !== 'processors') &&
              checkSetProcessor() &&
              canProcess && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={e => {
                    handleOpen(e, 'receive');
                  }}
                >
                  {/* <span style={{ marginRight: 5 }}>
                    <Send />
                  </span> */}
                  Trình ký
                </Button>
              )}
            {! issuedAPart && props.location &&
              !props.location.recall &&
              role !== 'receive' &&
              (checkSetProcessor() && !canComplete) &&
              canProcess &&
              isEndFlow && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={e => {
                    if (
                      childComplate &&
                      childComplate.signedProcess === true &&
                      role === 'processors' &&
                      (Array.isArray(localState.listFiles) && localState.listFiles.length > 0 && !localState.releasePartStatus)
                    ) {
                      onChangeSnackbar({
                        variant: 'error',
                        message: 'Đồng chí chưa hoàn thành văn bản báo cáo',
                        status: true,
                      });
                    } else {
                      handleOpen(e, 'processors');
                    }
                  }}
                >
                  {/* <span style={{ marginRight: 5 }}>
                    <Send />
                  </span> */}
                  Chuyển xử lý
                </Button>
              )}
            {role === 'release' &&
              localState.releasePartStatus === 'released' &&
              localState.recipientIds &&
              Array.isArray(localState.recipientIds) &&
              localState.recipientIds.length > 0 && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setOpenDialogRecall(true);
                    handleGetApiBeforeRecall();
                  }}
                >
                  Thu Hồi
                </Button>
              )}

            {(isViewers || isViewersAuthor) && (props.location && !props.location.recall) ? (
              <Button
                style={{ marginRight: 10 }}
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setStatus('Đã xem');
                }}
              >
                {/* <span style={{ marginRight: 5 }}>
                  <CheckBox />
                </span> */}
                Đã xem
              </Button>
            ) : null}
          </div>
        }
      />
      {/* xin ý kiến  */}
      <Menu
        open={Boolean(openConsult)}
        anchorEl={openConsult}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleClose}
      >
        {localState.children &&
          localState.children.length > 0 &&
          localState.children.map(item => (
            <>
              {role !== 'supporters' &&
                role !== 'feedback' && (
                  <>
                    <MenuItem
                      variant="outlined"
                      color="inherit"
                      style={{ marginRight: 10 }}
                      onClick={e => {
                        setOpenSetCommanders(true);
                        setProcessType('any');
                      }}
                    >
                      Xin ý kiến bất kỳ
                    </MenuItem>
                    {consult &&
                      consult !== '' && (
                        <MenuItem
                          variant="outlined"
                          color="inherit"
                          style={{ marginRight: 10 }}
                          onClick={e => {
                            setOpenSetCommanders(true);
                            setProcessType('flow');
                            setRoleGroupSource(item.code);
                          }}
                        >
                          Xin ý kiến{' '}
                          {consult === 'up'
                            ? 'cấp trên'
                            : consult === 'equal'
                              ? 'ngang cấp'
                              : consult === 'upandequal'
                                ? 'cấp trên và ngang cấp'
                                : ''}
                        </MenuItem>
                      )}
                  </>
                )}

              {role === 'feedback' && (
                <>
                  {item &&
                    item.children &&
                    Array.isArray(item.children) &&
                    item.children.length > 0 &&
                    item.children.map(t => (
                      <MenuItem
                        variant="outlined"
                        color="inherit"
                        style={{ marginRight: 10 }}
                        onClick={e => {
                          setOpenSetCommanders(true);
                          setProcessType('flow');
                          setRoleGroupSource(t.code);
                        }}
                      >
                        Xin ý kiến {t.name}
                      </MenuItem>
                    ))}
                </>
              )}
            </>
          ))}
      </Menu>

      <Menu open={Boolean(openDialog)} anchorEl={openDialog} onClose={handleClose}>
        {role !== 'receive' && localState.children && localState.children.length > 0 ? (
          <>
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
            <>
              {id !== '' && (
                <>
                  {draftData &&
                    draftData.children &&
                    draftData.children.map(item => (
                      <MenuItem
                        value={item.code}
                        onClick={() => {
                          setSelectedTemplate(item);
                          setOpenAsignProcessor(true);
                          setNextRole(item.code);
                          setGoTypeProcess('flow');
                        }}
                      >
                        <span>Chuyển cho {item.name}</span>
                      </MenuItem>
                    ))}
                </>
              )}
            </>
          </div>
        )}
      </Menu>
      <div style={{ marginBottom: 10 }}>
        <Tabs onChange={handleChangeTab} value={tab}>
          {TABS && TABS.map(tab => <Tab key={`${tab.value + tab.label}`} value={tab.value} label={tab.label} />)}
        </Tabs>
      </div>
      {tab === 'info' ? (
        <div>
          <Grid container spacing={8}>
            <Grid item xs="8">
              <Grid container>
                <Grid item xs="12" style={{ marginTop: 20 }}>
                  <PaperUI>
                    {/* <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      display="block"
                      style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                    >
                      Thông tin chung
                    </Typography> */}
                    <Grid container spacing={8}>
                      <Grid item xs={4} className="setCustomInput1">
                        {id === 'add' ? (
                          <Department
                            labelDepartment={name2Title.senderUnit}
                            disabled
                            department={localState.senderUnit}
                            disableEmployee
                            profile={profile}
                            moduleCode="OutGoingDocument"
                          />
                        ) : (
                          <CustomInputBase label={name2Title.senderUnit} value={senderUnitData.name} name="privateLevel" disabled />
                        )}
                      </Grid>
                      <Grid item xs={4}>
                        <AsyncAutocomplete
                          name="Chọn "
                          // label={name2Title.viewers}
                          label={'Người soạn thảo'}
                          value={localState.drafter}
                          url={API_USERS}
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CustomInputBase
                          label={name2Title.urgencyLevel}
                          value={localState.urgencyLevel && localState.urgencyLevel.title}
                          name="urgencyLevel"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CustomInputBase
                          label={name2Title.privateLevel}
                          value={localState.privateLevel && localState.privateLevel.title}
                          name="privateLevel"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CustomInputBase
                          label="Loại văn bản"
                          value={localState.documentType && localState.documentType.title}
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <CustomInputBase
                          label={name2Title.documentField}
                          value={localState.documentField && localState.documentField.title}
                          name="documentField"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>

                      {localState.viewers && localState.viewers.length === 0 ? (
                        <Grid item xs={4}>
                          <CustomInputBase label={'Nơi nhận nội bộ'} value={' '} name="toBookCode" disabled />
                        </Grid>
                      ) : (
                        <Grid item xs={4}>
                          <AsyncAutocomplete
                            name="Chọn"
                            label={'Nơi nhận nội bộ'}
                            value={localState.viewers}
                            url={API_USERS}
                            disabled
                            className="setCustomInput"
                            isMulti
                          />
                        </Grid>
                      )}

                      <Grid item xs={4}>
                        <AsyncAutocomplete
                          name="Chọn "
                          label={'Người kí'}
                          value={localState.signer}
                          url={API_USERS}
                          disabled
                          className="setCustomInput"
                          isMulti
                        />
                      </Grid>
                      {/* <Grid item xs={4}>
                        <CustomInputBase
                          label={_.get(name2Title, 'textSymbols', 'Ký hiệu ban hành')}
                          value={localState.textSymbols}
                          name="textSymbols"
                          // disabled={(id ? (localState.isAnyDepartment ? false : true) : false) && isDocOut}
                          disabled
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

                      <Grid item xs={4}>
                        <CustomInputBase
                          disabled
                          label={_.get(name2Title, 'recipientsOutSystem', 'Nơi nhận ngoài HT')}
                          value={localState.recipientsOutSystem}
                          name="recipientsOutSystem"
                        // onChange={e => handleInputChange(e)}
                        />
                      </Grid>
                      {/* <Grid item xs={4}>
                        <Autocomplete suggestions={recipient} value={localState.recipientId} label="Đơn vị nhận" disabled />
                      </Grid>
                      <Grid item xs={4}>
                        <AsyncAutocomplete
                          filter={{ ['organizationUnit.organizationUnitId']: recipientId }}
                          value={receiver}
                          label="Cán bộ nhận"
                          url={API_PERSONNEL_RECEIVER}
                          disabled
                        />
                      </Grid> */}

                      {localState && localState.completeStatus === 'promulgated' ? (
                        <>
                          <Grid item xs={4}>
                            <CustomInputBase
                              label="Sổ văn bản đi"
                              value={localState.bookDocumentId && localState.bookDocumentId.name}
                              name="bookCode"
                              disabled
                              className="setCustomInput"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <CustomInputBase
                              label={name2Title.releaseNo}
                              value={localState.releaseNo}
                              name="releaseNo"
                              disabled
                              className="setCustomInput"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <CustomInputBase
                              label={name2Title.releaseDate}
                              value={localState.releaseDate ? moment(localState.releaseDate).format('DD/MM/YYYY') : ''}
                              name="releaseDate"
                              disabled
                              className="setCustomInput"
                            />
                          </Grid>
                          {
                            localState && localState.toBook ? (
                              <Grid item xs={4}>
                                <CustomInputBase
                                  label={name2Title.toBook}
                                  value={localState.textSymbols ? `${localState.toBook}/${localState.textSymbols}` : localState.toBook}
                                  name="toBook"
                                  disabled
                                  className="setCustomInput"
                                />
                              </Grid>
                            ) : null
                          }
                        </>
                      ) : null}

                      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others}  autoDown disabled/>

                      <Grid item xs={12}>
                        <Typography variant="h6" style={{ fontSize: 16 }}>
                          {' '}
                          Danh sách đơn vị nhận
                        </Typography>
                      </Grid>
                      <>
                        {/* đơn vị nhận */}
                        {localState.recipientIds &&
                          Array.isArray(localState.recipientIds) &&
                          localState.recipientIds.length > 0 &&
                          localState.recipientIds.map((el, index) => {
                            return <>{recipientUnit(el, index)}</>;
                          })}
                      </>
                      <Grid item xs={12}>
                        <CustomInputBase
                          rows={5}
                          multiline
                          label={name2Title.abstractNote || 'Trích yếu'}
                          value={localState.abstractNote}
                          name="abstractNote"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>

                      {/* <Grid item xs={12}>
                        <CustomGroupInputField code={code} columnPerRow={2} disabled value={localState.others} className="setCustomInput" />
                      </Grid> */}
                    </Grid>
                  </PaperUI>
                </Grid>
                <Grid item xs="12" style={{ marginTop: 20 }}>
                  <Grid container spacing={8}>
                    {profile &&
                      profile.signer === true && (
                        <Grid item xs={4}>
                          <PaperUI>
                            <FormControl>
                              <FormControlLabel
                                className="setCustomCheckbox"
                                control={<Checkbox checked={localState.caSignCheck ? true : false} value="caSignCheck" color="primary" disabled />}
                                label={name2Title.caSignCheck}
                              />
                            </FormControl>
                          </PaperUI>
                        </Grid>
                      )}
                    {profile &&
                      profile.canProcessAny && (
                        <Grid item xs={4}>
                          <PaperUI>
                            <FormControl>
                              <FormControlLabel
                                className="setCustomCheckbox"
                                control={
                                  <Checkbox checked={localState.autoReleaseCheck ? true : false} value="autoReleaseCheck" color="primary" disabled />
                                }
                                label={name2Title.autoReleaseCheck}
                              />
                            </FormControl>
                          </PaperUI>
                        </Grid>
                      )}
                    {profile &&
                      profile.inherit === true && (
                        <Grid item xs={4}>
                          <PaperUI>
                            <FormControl>
                              <FormControlLabel
                                className="setCustomCheckbox"
                                control={<Checkbox checked={localState.inherit ? true : false} value="inherit" color="primary" disabled />}
                                label={'Thừa lệnh/Thừa uỷ quyền'}
                              />
                            </FormControl>
                          </PaperUI>
                        </Grid>
                      )}
                  </Grid>
                </Grid>
                <Grid item xs="12" style={{ marginTop: 20 }}>
                  <PaperUI>
                    <Grid item xs={12} md={12} container>
                      {statusButton1 ? (
                        <>
                          <KeyboardArrowUp onClick={() => setStatusButton1(false)} />
                        </>
                      ) : (
                        <>
                          <KeyboardArrowDown onClick={() => setStatusButton1(true)} />
                        </>
                      )}
                      <Grid item xs={4}>
                        {/* {!forceUpload && ( */}
                        <Typography
                          variant="h6"
                          component="h2"
                          gutterBottom
                          display="block"
                          style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                        >
                          Dự thảo
                        </Typography>
                        {/* // )} */}
                      </Grid>
                    </Grid>
                    {statusButton1 ? (
                      <PaperUI>
                        <Grid item xs="12">
                          <PaperUI>
                            <Grid item xs={12} md={12} container>
                              <Grid item xs={4}>
                                {!forceUpload && (
                                  <Typography
                                    variant="h6"
                                    component="h2"
                                    gutterBottom
                                    display="block"
                                    style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                                  >
                                    Văn bản dự thảo
                                  </Typography>
                                )}
                              </Grid>

                              {!forceUpload &&
                                Array.isArray(localState.children) &&
                                localState.children[0] &&
                                localState.children[0].agreeFiles &&
                                localState.signingStatus === 'none' &&
                                role === 'processors' && listFileDuThao.length && 
                                parseInt(currentTab) === 0 && (
                                  <Grid item xs={4}>
                                    <Button
                                      style={{ marginRight: 10 }}
                                      variant="contained"
                                      color="primary"
                                      onClick={e => {
                                        setOpenAgreeFiles(true);
                                        // setOnePiece(true);
                                      }}
                                    >
                                      Đồng ý dự thảo
                                    </Button>
                                  </Grid>
                                )}

                              {/* {!forceUpload && Array.isArray(localState.children) && localState.children[0] && localState.children[0].apostropher && localState.signingStatus === "waitingSign" && (
                                  <Grid item xs={4}>
                                    <Button
                                      style={{ marginRight: 10 }}
                                      variant="contained"
                                      color="primary"
                                      onClick={e => {
                                        // setOpenComplete(true);
                                        // setOnePiece(true);
                                      }}
                                    >
                                      Ký dự thảo
                                    </Button>
                                  </Grid>
                                )} */}
                            </Grid>

                            <FileUpload
                              reload={reloadVBDT}
                              onUpdateFileSuccess={onReloadPBDT}
                              profile={profile}
                              id={id}
                              isDetail={true}
                              canAssess
                              name="duthao"
                              draft="vanbanduthao"
                              code={`${code}-fileDocs`}
                              onReceiveFile={setNewDraftFile}
                              editFile={canEditFile}
                              // template={templates}
                              template={localState.children && Array.isArray(localState.children) && localState.children.length ? localState.children : templates && Array.isArray(templates) && templates.length && templates[0].children || []}
                              updateFile={updateDraft}
                              status={true}
                              iconButton={true}
                              getShowFile={file => (convertFileRef.current = [...convertFileRef.current, ...file])}
                              signed={allowSign}
                              deleteSigned={allowSign}
                              allowSignApostropher={allowSignApostropher}
                              addTextToFile={_.get(localState, 'completeStatus') === 'promulgated'}
                              forceUpload={forceUpload}
                              scanOnly
                              currentRole={localState.currentRole}
                              isAuthory={isAuthory === 'true' ? true : isAuthory}
                              canChangeFile={canChangeFile}
                              canScan={canScanDraft}
                              setListFile={(data)=>{setListFileDuThao(data)}}
                            />
                            {/* {props.profile}---{props.code} */}
                          </PaperUI>
                        </Grid>
                        <Grid item xs="12" style={{ marginTop: 20 }}>
                          <PaperUI>
                            <Typography
                              variant="h6"
                              component="h2"
                              gutterBottom
                              display="block"
                              style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                            >
                              Phiên bản dự thảo
                            </Typography>
                            <FileUpload
                              reload={reloadPBDT}
                              reverse
                              // signed={allowSign}
                              profile={profile}
                              id={localState ? localState.originId : id}
                              isCreator={localState.createdBy}
                              isDetail={true}
                              iconButton={true}
                              status={true}
                              name="duthao"
                              draft="phienbanduthao"
                              creator
                              code={`${code}-fileDocs`}
                              addFile={newDraftFile}
                              resetTab={resetTab}
                              addFileText="Đồng chí có muốn thêm phiên bản dự thảo không?"
                              addFileSuccess={setUpdateDraft}
                              addVersion="update"
                              getShowFile={file => (convertFileRef.current = [...convertFileRef.current, ...file])}
                              onUpdateSignFile={onReloadVBDT}
                              onChangeSnackbar={onChangeSnackbar}
                            // canChangeFile={canChangeFile}
                            />
                          </PaperUI>
                        </Grid>
                      </PaperUI>
                    ) : null}
                  </PaperUI>
                </Grid>

                <Grid item xs="12" style={{ marginTop: 20 }}>
                  <PaperUI>
                    <Grid item xs={12} md={12} container>
                      {statusButton2 ? (
                        <>
                          <KeyboardArrowUp onClick={() => setStatusButton2(false)} />
                        </>
                      ) : (
                        <>
                          <KeyboardArrowDown onClick={() => setStatusButton2(true)} />
                        </>
                      )}
                      <Grid item xs={4}>
                        {/* {!forceUpload && ( */}
                        <Typography
                          variant="h6"
                          component="h2"
                          gutterBottom
                          display="block"
                          style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                        >
                          Báo cáo
                        </Typography>
                        {/* )} */}
                      </Grid>
                    </Grid>

                    {statusButton2 ? (
                      <PaperUI>
                        <Grid item xs="12">
                          <PaperUI>
                            <Grid item container>
                              <Grid item xs={3}>

                                {!forceUpload && (
                                  <div style={{ display: 'inline-block' }}>
                                    <span
                                      style={{
                                        textTransform: 'uppercase',
                                        marginRight: 10,
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: 'black',
                                        display: 'inline-block',
                                      }}
                                    >
                                      Văn bản báo cáo (nếu có)
                                    </span>
                                  </div>
                                )}
                              </Grid>

                              {!forceUpload && (
                                <ReleaseButton
                                  color="primary"
                                  variant="contained"
                                  role={role}
                                  localState={localState}
                                  location={props.location}
                                  setOpenRelease={setOpenRelease}
                                  setOnePiece={setOnePiece}
                                  completePartUnit={
                                    props && props.profile && props.profile.organizationUnit && props.profile.organizationUnit.organizationUnitId
                                  }
                                />
                              )}
                              {/* ủy quền, đang xử lý và có quyền, vừa tạo và có quyền */}
                              <Grid item xs={4} md={4} style={{ marginTop: -7 }}>
                                {((((childComplate && childComplate.signedProcess === true) ||
                                  (localState.children &&
                                    Array.isArray(localState.children) &&
                                    localState.children.length > 0 &&
                                    localState.children[0].signedProcess &&
                                    currentTab == '0')) &&
                                  role === 'processors') ||
                                  (role === 'receive' && currentTab == '0' && draftData && draftData.signedProcess === true)) &&
                                  (Array.isArray(localState.listFiles) && localState.listFiles.length > 0 && !localState.releasePartStatus) &&
                                  listFileBaoCao.length && listFileDuThao.length &&
                                  (props.location && !props.location.recall) && (
                                    <Button
                                      style={{ marginRight: 10 }}
                                      variant="contained"
                                      color="primary"
                                      onClick={e => {
                                        setOpenComplete(true);
                                        setOnePiece(true);
                                      }}
                                    >
                                      Hoàn thành VBBC
                                    </Button>
                                  )}
                              </Grid>
                            </Grid>
                            {/* vb dự thao scan báo cáo */}

                            <FileUpload
                              reload={reloadVBDT}
                              onUpdateFileSuccess={onReloadPBBC}
                              profile={profile}
                              id={docId === null || docId === undefined ? id : docId}
                              isDetail={true}
                              iconButton={false}
                              status={true}
                              name="totrinh"
                              canAssess
                              // template={templates}
                              template={localState.children && Array.isArray(localState.children) && localState.children.length ? localState.children : templates && Array.isArray(templates) && templates.length && templates[0].children}

                              draft="vanbantotrinh"
                              code={`${code}-fileLists`}
                              onReceiveFile={setNewTTDraftFile}
                              editFile={canEditFile}
                              updateFile={updateTTDraft}
                              getShowFile={file => (convertFileRef.current = [...convertFileRef.current, ...file])}
                              signed={allowSign}
                              deleteSigned={allowSign}
                              allowSignApostropher={allowSignApostropher}
                              forceUpload={forceUpload}
                              scanOnly
                              currentRole={localState.currentRole}
                              isAuthory={isAuthory === 'true' ? true : isAuthory}
                              statusButton2={statusButton2}
                              canScan={canScanReport}
                              canChangeFile={cantChangeFileReport}
                              setListFile={(data)=>setListFileBaoCao(data)}
                              moreButton={
                                forceUpload && (
                                  <ReleaseButton
                                    color="primary"
                                    variant="contained"
                                    role={role}
                                    localState={localState}
                                    location={props.location}
                                    setOpenRelease={setOpenRelease}
                                    setOnePiece={setOnePiece}
                                    completePartUnit={
                                      props && props.profile && props.profile.organizationUnit && props.profile.organizationUnit.organizationUnitId
                                    }
                                  />
                                )
                              }
                            />
                          </PaperUI>
                        </Grid>
                        <Grid item xs="12" style={{ marginTop: 20 }}>
                          <PaperUI>
                            <Typography
                              variant="h6"
                              component="h2"
                              gutterBottom
                              display="block"
                              style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                            >
                              Phiên bản báo cáo
                            </Typography>
                            <FileUpload
                              reload={reloadPBBC}
                              reverse
                              profile={profile}
                              id={localState ? localState.originId : id}
                              isCreator={localState.createdBy}
                              isDetail={true}
                              iconButton={false}
                              status={true}
                              name="totrinh"
                              draft="phienbantotrinh"
                              creator
                              code={`${code}-fileDocs`}
                              addFile={newDraftTTFile}
                              addFileText="Đồng chí có muốn thêm phiên bản báo cáo không?"
                              addFileSuccess={setUpdateTTDraft}
                              addVersion="update"
                              getShowFile={file => (convertFileRef.current = [...convertFileRef.current, ...file])}
                              onUpdateSignFile={onReloadVBBC}
                              onChangeSnackbar={onChangeSnackbar}
                            />
                          </PaperUI>
                        </Grid>
                      </PaperUI>
                    ) : null}
                  </PaperUI>
                </Grid>
                <Grid item xs="12" style={{ marginTop: 20 }}>
                  <PaperUI>
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      display="block"
                      style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                    >
                      Văn bản đính kèm
                    </Typography>
                    <FileUpload
                      id={localState ? localState.originId : id}
                      name="file"
                      isDetail={true}
                      status={true}
                      iconButton={false}
                      code={`${code}-file`}
                    />
                  </PaperUI>
                </Grid>

                <Grid item xs="12" style={{ marginTop: 20 }}>
                  <PaperUI>
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      display="block"
                      style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                    >
                      Phúc đáp văn bản
                    </Typography>
                    {localState.incommingDocument && (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ width: 30, borderBottom: '1px solid #e0e0e' }}>
                              {statusButton3 ? (
                                <>
                                  <KeyboardArrowUp onClick={() => setStatusButton3(false)} />
                                </>
                              ) : (
                                <>
                                  <KeyboardArrowDown onClick={() => setStatusButton3(true)} />
                                </>
                              )}
                            </TableCell>
                            <TableCell style={{ textAlign: 'left', width: 20, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>STT</TableCell>
                            <TableCell style={{ textAlign: 'left', width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>
                              Số văn bản
                            </TableCell>
                            <TableCell style={{ textAlign: 'left', width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>
                              Ngày văn bản
                            </TableCell>
                            <TableCell style={{ textAlign: 'left', width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>
                              Trích yếu
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        {Array.isArray(localState.incommingDocument) && localState.incommingDocument
                          ? localState.incommingDocument.map((item, index) => (
                            <TableBody>
                              <TableRow style={{ cursor: 'pointer' }} onClick={e => onClickRow(e, item._id)}>
                                {statusButton3 ? (
                                  <>
                                    <TableCell style={{ width: 30, borderBottom: '1px solid #e0e0e' }} />
                                    <TableCell style={{ width: 20, borderBottom: '1px solid #e0e0e' }}>{index + 1}</TableCell>
                                    <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e' }}>{item.toBook}</TableCell>
                                    <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e' }}>
                                      {moment(item.toBookDate).format('DD/MM/YYYY') === 'Invalid date'
                                        ? item.toBookDate
                                        : moment(item.toBookDate).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e' }}>
                                      <p style={{ textAlign: 'left', width: 300, wordBreak: 'break-all' }}>{getShortNote(item.abstractNote, 60)}</p>
                                    </TableCell>
                                  </>
                                ) : null}
                              </TableRow>
                            </TableBody>
                          ))
                          : null}
                      </Table>
                    )}
                  </PaperUI>
                </Grid>
                <Grid item xs="12" style={{ marginTop: 20 }}>
                  <PaperUI>
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      display="block"
                      style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                    >
                      HỒ SƠ CÔNG VIỆC
                    </Typography>
                    {localState.tasks && (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ width: 30, borderBottom: '1px solid #e0e0e' }}>
                              {statusButton4 ? (
                                <>
                                  <KeyboardArrowUp onClick={() => setStatusButton4(false)} />
                                </>
                              ) : (
                                <>
                                  <KeyboardArrowDown onClick={() => setStatusButton4(true)} />
                                </>
                              )}
                            </TableCell>
                            <TableCell style={{ width: 20, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>STT</TableCell>
                            <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>Tên công việc</TableCell>
                            <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>Loại công việc</TableCell>
                            <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>Nội dung công việc</TableCell>
                          </TableRow>
                        </TableHead>
                        {Array.isArray(localState.tasks) && localState.tasks
                          ? localState.tasks.map((item, index) => (
                            <TableBody>
                              <TableRow
                                style={{ cursor: 'pointer', alignItems: 'center', color: 'blue' }}
                                onClick={e => onClickRowTask(e, item._id)}
                              >
                                {statusButton4 ? (
                                  <>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{mapCate(item.category)}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                  </>
                                ) : null}
                              </TableRow>
                            </TableBody>
                          ))
                          : null}
                      </Table>
                    )}
                  </PaperUI>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs="4">
              <PaperUI style={{ height: '100%', marginTop: -50 }}>
                {docDetail &&
                  localState.originId && (
                    <Comment
                      profile={profile}
                      code={code}
                      isAuthory={isAuthory}
                      id={localState.originId}
                      viewOnly={
                        isProcessor || isCommanders || isCommandersAuthor || isProcessorAuthor || isSupporters || isSupportersAuthor
                          ? false
                          : role === 'release' ||
                          isSupported ||
                          isSupportedAuthor ||
                          isProcesseds ||
                          isProcessedsAuthor ||
                          isCommanded ||
                          isCommandedAuthor
                      }
                      revert
                      disableLike
                    />
                  )}
                { }
              </PaperUI>
            </Grid>
          </Grid>
          <Grid container item xs="12" style={{ marginTop: 20 }}>
            <Grid item xs="12" style={{ marginTop: 20 }}>
              <PaperUI>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  display="block"
                  style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                >
                  Thông tin gửi nhận
                </Typography>
                {id && (
                  <Table className="editDocuments">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: 20, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>STT</TableCell>
                        <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>Người nhận</TableCell>
                        <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>Thao tác</TableCell>
                        <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }}>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!Array.isArray(dataFormat)
                        ? null
                        : dataFormat.map((item, index) => {
                          return (
                            <>
                              <TableRow>
                                <TableCell className="CustomTr" colSpan={5}>
                                  {indexStatus[index] ? (
                                    <IconButton
                                      aria-label="expand row"
                                      size="small"
                                      onClick={() => setIndexStatus({ ...indexStatus, [index]: false })}
                                    >
                                      <KeyboardArrowUp />
                                    </IconButton>
                                  ) : (
                                    <IconButton
                                      aria-label="expand row"
                                      size="small"
                                      onClick={() => setIndexStatus({ ...indexStatus, [index]: true })}
                                    >
                                      <KeyboardArrowDown />
                                    </IconButton>
                                  )}
                                  {item.createdByName} - {item.createdAt}
                                </TableCell>
                              </TableRow>
                              {indexStatus[index] && (
                                <>
                                  {!Array.isArray(item.childs)
                                    ? null
                                    : item.childs.map((item, index) => (
                                      <TableRow>
                                        <TableCell align="center" className="CustomTrChild CustomSTT" style={{ width: 20 }}>
                                          {index + 1}
                                        </TableCell>
                                        <TableCell align="center" className="CustomTrChild">
                                          {item.receiver && item.receiver.name ? item.receiver.name : ''}
                                        </TableCell>
                                        <TableCell align="center" className="CustomTrChild">
                                          {item.action ? item.action : ''}
                                        </TableCell>
                                        <TableCell align="center" className="CustomTrChild">
                                          {item.stageStatus ? item.stageStatus : ''}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </>
                              )}
                            </>
                          );
                        })}
                    </TableBody>
                  </Table>
                )}
              </PaperUI>
            </Grid>
          </Grid>
        </div>
      ) : null}
      
      {tab === 'work' ? (
        <>
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
              // $or: [
              //   { [`others.${code}`]: id },
              //   { "outGoingDocuments": id }
              // ],
              outGoingDocuments: id,
            }}
            disableMenuAction
            perPage={5}
            disableOneEdit
            disableAdd
          // settingBar={[addItem(`/Task/add`, code, id)]}
          />
        </>
      ) : null}

      {/* 
      {
        tab === "meetingCalendar" ? (
          <>
            ssss
          </>
        ) : null
      } */}
      {tab === 'source' ? (
        <Grid container>
          <Grid item xs={12}>
            <FlowDocument data={dataFormat} />
          </Grid>
        </Grid>
      ) : null}

      <DocumentAssignModal
        open={openAsignProcessor}
        docIds={selectedDocs}
        isAuthory={isAuthory}
        onClose={() => {
          setOpenAsignProcessor(false);
        }}
        onSuccess={() => {
          setOpenAsignProcessor(false);
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/OutGoingDocument');
          }
        }}
        role={role}
        currentRole={nextRole}
        template={templates}
        childTemplate={selectedTemplate}
        onChangeSnackbar={props.onChangeSnackbar}
        typePage={isAuthory}

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
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/OutGoingDocument');
          }
        }}
        onChangeSnackbar={props.onChangeSnackbar}
        processType={processType}
        consult={role !== 'feedback' ? consult : ''}
        roleGroupSource={roleGroupSource}
        template={templates}
      // unit={unit}
      />
      <ReturnDocs
        open={openReturnDocs}
        docIds={selectedDocs}
        type={'flow'}
        role={role}
        template={templates}
        childTemplate={localState.children ? localState.children : []}
        processeds={localState ? localState.processeds : []}
        employeeReturn={allowedUsers}
        onClose={() => {
          setOpenReturnDocs(false);
          setReturnTypeDocument()
        }}
        onChangeSnackbar={props.onChangeSnackbar}
        onSuccess={() => {
          setOpenReturnDocs(false);
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/OutGoingDocument');
          }
          setAllowedUsers([]);
          setReturnTypeDocument()
        }}
        returnTypeDocument={returnTypeDocument}
      />
      <CompleteDocs
        replace
        onePiece={onePiece}
        open={openComplete}
        docIds={selectedDocs}
        isAuthory={isAuthory}
        profile={profile}
        template={setOpenComplete}
        files={[
          ...(Array.isArray(localState.docFiles) && localState.docFiles.length > 0
            ? localState.docFiles
            : Array.isArray(localState.files) && localState.files.length > 0
              ? [localState.files[0]]
              : []),
          ...convertFileRef.current,
        ]}
        listFiles={[...(Array.isArray(localState.listFiles) && localState.listFiles.length > 0 ? localState.listFiles : [])]}
        onClose={() => {
          setOpenComplete(false);
        }}
        onSuccess={() => {
          setOpenComplete(false);
          setHandleClick(true);
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/OutGoingDocument');
          }
        }}
        onChangeSnackbar={props.onChangeSnackbar}
      />

      {/* đồng ý dự thảo */}
      <AgreeFiles
        replace
        open={openAgreeFiles}
        docIds={selectedDocs}
        isAuthory={isAuthory}
        profile={profile}
        // files={[
        //   ...(Array.isArray(localState.docFiles) && localState.docFiles.length > 0
        //     ? localState.docFiles
        //     : Array.isArray(localState.files) && localState.files.length > 0
        //       ? [localState.files[0]]
        //       : []),
        //   ...convertFileRef.current,
        // ]}
        // listFiles={[...(Array.isArray(localState.listFiles) && localState.listFiles.length > 0 ? localState.listFiles : [])]}
        onClose={() => {
          setOpenAgreeFiles(false);
        }}
        onSuccess={() => {
          setOpenAgreeFiles(false);
          // setHandleClick(true);
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/OutGoingDocument');
          }
        }}
        onChangeSnackbar={props.onChangeSnackbar}
      />
      {
        // ban hành
        openRelease && <ReleaseDocs
          open={openRelease}
          textSymbols={localState.textSymbols}
          onePiece={onePiece}
          isAuthory={isAuthory}
          docIds={selectedDocs}
          onClose={() => {
            setOpenRelease(false);
          }}
          onSuccess={() => {
            setOpenRelease(false);
            if (isAuthory) {
              props.history.push('/AuthorityDocument');
            } else {
              props.history.push('/OutGoingDocument');
            }
          }}
          onChangeSnackbar={props.onChangeSnackbar}
        />
      }

      {/* Thu hồi  */}

      <Dialogg
        open={openDialogRecall}
        onClose={() => setOpenDialogRecall(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">Thu Hồi</DialogTitle>
        <DialogContent>
          <DepartmentSelect
            title=""
            onChange={handleChangeOrganization}
            recipientIds={localState.recipientIds}
            isMultiple
            customTitle="Thu hồi"
            note={note}
            setNote={setNote}
          // byOrg
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => handleReCall()} disabled={roomApply.length === 0}>
            LƯU
          </Button>
          <Button variant="contained" color="secondary" autoFocus onClick={() => setOpenDialogRecall(false)}>
            HỦY
          </Button>
        </DialogActions>
      </Dialogg>
    </div>
  );
}

EditGoDocuments.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  editGoDocuments: makeSelectEditGoDocuments(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'editGoDocuments', reducer });
// const withSaga = injectSaga({key: 'executiveDocuments', saga });

export default compose(
  withReducer,
  // withSaga,
  withConnect,
)(EditGoDocuments);

const ReleaseButton = props => {
  const { role, localState, location, setOpenRelease, setOnePiece, color, variant, styles = {}, completePartUnit } = props;

  return role === 'release' &&
    localState.releasePartStatus !== 'released' &&
    (Array.isArray(localState.listFiles) && localState.listFiles.length > 0) &&
    (location && !location.recall) &&
    completePartUnit === localState.completePartUnit ? (
    <Grid item xs={4} md={4} style={{ marginTop: -7 }}>
      <Button
        style={{ marginRight: 10, ...styles }}
        color={color || 'inherit'}
        variant={variant || 'outlined'}
        component="span"
        onClick={() => {
          setOpenRelease(true);
          setOnePiece(true);
        }}
      >
        {/* <span style={{ marginRight: 5 }}>
    <CheckBox />
  </span> */}
        {/* Ban hành văn bản báo cáo */}
        Ban hành VBBC
      </Button>
    </Grid>
  ) : (
    <></>
  );
};
