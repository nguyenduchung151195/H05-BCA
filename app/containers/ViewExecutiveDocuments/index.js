// EditExecutiveDocuments

import {
  Button,
  Fab,
  Grid,
  Menu,
  MenuItem,
  Typography,
  Table,
  TableHead,
  Avatar,
  Dialog as DialogUI,
  Badge,
  TableBody,
  Tooltip,
  TableRow,
  TableCell,
  IconButton,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { mergeData } from './actions';
import makeSelectEditExecutiveDocuments from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Comment, FileUpload, KanbanStep, Dialog, AsyncAutocomplete } from '../../components/LifetekUi';
import ViewContent from '../../components/ViewContent';
import CustomAppBar from 'components/CustomAppBar';
import { Check, ChatBubbleOutline, Replay, Send, CheckBox, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import makeSelectDashboardPage, { makeSelectProfile } from '../Dashboard/selectors';
import ListPage from 'components/List';
import { Paper as PaperUI } from 'components/LifetekUi';
import { Dehaze } from '@material-ui/icons';
import {
  API_INCOMMING_DOCUMENT,
  API_USERS,
  API_DOCUMENT_HISTORY,
  API_AUTHORY_PROFILE,
  API_TASK_PROJECT,
  API_ROLE_APP,
  API_MEETING,
  API_DOCUMENT_PROCESS_TEMPLATE,
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
} from '../../config/urlConfig';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomInputField from '../../components/Input/CustomInputField';
import { viewConfigCheckShowForm, viewConfigName2Title } from '../../utils/common';
import Department from 'components/Filter/DepartmentAndEmployee/Light';
import { taskStatusArr, taskStageArr } from 'variable';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';
import { changeSnackbar } from '../Dashboard/actions';
import DocumentAssignModal from 'components/DocumentAssignModal';
import DocumentSetCommanders from 'components/DocumentAssignModal/SetCommanders';
import ReturnDocs from 'components/DocumentAssignModal/ReturnDocs';
import CompleteDocs from 'components/DocumentAssignModal/CompleteDocs';
import './index.css';
import request from 'utils/request';
import moment from 'moment';
import { serialize, fetchData, printTemplte, printTemplteExcel } from '../../helper';
import FlowDocument from '../../components/FlowComponent';
import { Tabs, Tab, SwipeableDrawer, Autocomplete } from '../../components/LifetekUi';
import _ from 'lodash';
import { getListData } from '../../utils/common';

function colorProgress(item) {
  let color;
  if (item.finishDate) {
    color = new Date(item.finishDate) > new Date(item.endDate) ? '#fa0522' : '#009900';
  } else {
    color = new Date(item.endDate) >= new Date() ? '#056ffa' : '#f00707';
  }

  return color;
}

function color2Progress(item) {
  let color2;
  if (item.finishDate) {
    color2 = new Date(item.finishDate) > new Date(item.endDate) ? '#f28100' : '#009900';
  } else {
    color2 = new Date(item.endDate) >= new Date() ? '#05c9fa' : '#6e1305';
  }

  return color2;
}

function ProcessTask(item) {
  let date;
  let total;
  if (item.finishDate) {
    if (new Date(item.finishDate) > new Date(item.endDate)) {
      date = ((new Date(item.finishDate) - new Date(item.endDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Trễ ${date3} ngày ${date4} giờ`;
    } else {
      date = ((new Date(item.endDate) - new Date(item.finishDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Sớm ${date3} ngày ${date4} giờ`;
    }
  } else {
    if (new Date(item.endDate) > new Date()) {
      date = ((new Date(item.endDate) - new Date()) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Còn ${date3} ngày ${date4} giờ`;
    } else {
      date = ((new Date() - new Date(item.endDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Quá ${date3} ngày ${date4} giờ`;
    }
  }

  return total;
}
function EditExecutiveDocuments(props) {
  const { profile, code = 'IncommingDocument', editExecutiveDocuments, onChangeSnackbar } = props;
  const id = props.id ? props.id : _.get(props, 'match.params.id');
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role') || props.role;
  // const currentTab = urlParams.get('tab');
  const isAuthory = Boolean(urlParams.get('isAuthory')) || false;

  const crmSource = JSON.parse(localStorage.getItem('crmSource'));
  let data = crmSource !== undefined && crmSource.find(item => item.code === 'nguoiki');
  let dataSendPlace = [];
  data !== undefined && data.data.map((item, index) => dataSendPlace.push({ title: item.title, value: item._id }));

  const [selectedDocs, setSelectedDocs] = useState([id]);
  const [docDetail, setDocDetail] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [openDialogTemplate, setOpenDialogTemplate] = useState(null);

  const [viewType, setViewType] = useState('any');
  const [localState, setLocalState] = useState({
    others: {},
    toBookDate: '',
    deadline: '',
    documentDate: '',
    receiveDate: '',
    signer: { title: '', value: null },
  });
  const requestURL = API_INCOMMING_DOCUMENT;
  const [name2Title, setName2Title] = useState({});
  const [openAsignProcessor, setOpenAsignProcessor] = useState(false);
  const [openSetCommanders, setOpenSetCommanders] = useState(false);
  const [openReturnDocs, setOpenReturnDocs] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [openResponse, setOpenResponse] = useState(null);
  const [returnDocType, setReturnDocType] = useState('');
  const [templates, setTemplates] = useState([]);
  const [openComplete, setOpenComplete] = useState(false);
  const [roleForProcess, setRoleForProcess] = useState(null);
  const [tab, setTab] = useState('info');

  const [currentRole, setCurrentRole] = useState(null);
  const [nextRole, setNextRole] = useState(null);
  const [history, setHistory] = useState({});
  const [indexStatus, setIndexStatus] = useState({});
  const [businessRole, setBusinessRole] = useState({});
  const [businessRoleSelect, setBusinessRoleSelect] = useState([]);
  const [note, setNote] = useState('');
  const [allRoles, setAllRoles] = useState([]);
  const [authoryProfile, setAuthoryProfile] = useState({});
  const [openProcessor, setOpenProcessor] = useState(null);
  const [openSupport, setOpenSupport] = useState(null);
  const [openCommand, setOpenCommand] = useState(null);
  //
  const [processType, setProcessType] = useState('');
  const [finalChild, setFinalChild] = useState([]);
  const [ID, setID] = useState();
  const [openMenu, setOpenMenu] = useState(null);
  const [listTemplates, setListTemplates] = useState([]);
  const [templatePrint, setTemplatePrint] = useState({ type: 'PDF' });
  const [handleDialogReturnItem, setHandleDialogReturnItem] = useState(false);
  const [disableBtnRecall, setDisableBtnRecall] = useState(false);
  const [checkRecallDocs, setCheckRecallDocs] = useState(false);

  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);

    return () => {
      newNam2Title;
    };
  }, []);
  useEffect(
    () => {
      const { allTemplates = [] } = props.dashboardPage || {};
      if (code) {
        const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === code) : [];
        setListTemplates(templatesItem);
      }
    },
    [props.dashboardPage],
  );
  const getBusinessRoles = isAuthoryDoc => {
    fetchData(`${API_ROLE_APP}/IncommingDocument/currentUser?${isAuthoryDoc ? 'authority=true' : ''}`).then(res => {
      const newBusinessRole = {};
      const { roles } = res;
      const code = 'BUSSINES';

      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
      setAllRoles(foundRoleDepartment);
      if (foundRoleDepartment) {
        const { data } = foundRoleDepartment;

        if (data) {
          data.forEach(d => {
            newBusinessRole[`${d.name}_return_docs`] = d.data.returnDocs;
            newBusinessRole[d.name] = d.data.view;
          });
        }
      }
      setBusinessRole(newBusinessRole);
    });
  };

  useEffect(
    () => {
      let roleP;
      const { roleDepartment = [] } = props || {};
      if (role === 'processors') {
        roleP = roleDepartment.find(element => element.name === 'processing');
      } else if (role === 'supporters') {
        roleP = roleDepartment.find(element => element.name === 'support');
      } else if (role === 'viewers') {
        roleP = roleDepartment.find(element => element.name === 'view');
      } else if (role === 'commander') {
        roleP = roleDepartment.find(element => element.name === 'command');
      } else if (role === 'receive') {
        roleP = roleDepartment.find(element => element.name === 'receive');
      } else if (role === 'feedback') {
        roleP = roleDepartment.find(element => element.name === 'feedback');
      }
      setCheckRecallDocs(roleP && roleP.data && roleP.data.recallDocs ? roleP.data.recallDocs : false);
    },
    [props.roleDepartment],
  );
  const handleTemplate = async () => {
    // xuất biểu mẫu nè
    if (templatePrint && templatePrint.type === 'PDF') {
      printTemplte(templatePrint.template, id, code, '', templatePrint.templateCode);
    } else {
      printTemplteExcel(templatePrint.template, id, code, '', templatePrint.templateCode);
    }
  };
  const checkEndFlow = array => {
    let result = false;
    if (array) {
      array.map(item => {
        if (!item.children || (item.children && item.children.length === 0)) {
          result = false;
        } else {
          result = true;
        }
      });
    }
    return result;
  };

  useEffect(
    () => {
      if (id) {
        getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/inCommingDocument`).then(res => {
          if (res) {
            setTemplates([{ ...res }]);
          } else {
            onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng dự thảo', status: true });
          }
        });
        getDetail(id);
      }
    },
    [id],
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
            getBusinessRoles(isAuthory);
            setLocalState({ ...data, signer: data.signer === undefined ? localState.signer : data.signer });
          });
      } else {
        getBusinessRoles();
      }
    },
    [id],
  );
  // check logic authority return docs
  useEffect(
    () => {
      if (localState.author && localState.processeds) {
        let findIndex;
        if (localState && localState.author) {
          findIndex = localState.processeds.findIndex(f => f === localState.author);
        } else {
          findIndex = localState.processeds.findIndex(f => f === profile._id);
        }
        let result = [];
        result = findIndex !== -1 ? [localState.processeds[0]] : [localState.processeds[localState.processeds.length - 1]];
        let user = { filter: { _id: { $in: result } } };
        user &&
          fetch(`${API_USERS}/${result}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
            .then(response => response.json())
            .then(res => {
              if (res && res.data) {
                setCurrentRole(res.data.roleGroupSource);
              }
            });
      }
    },
    [id, localState],
  );

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
  }, []);

  useEffect(
    () => {
      if (isAuthory && localState.author) {
        fetchData(`${API_AUTHORY_PROFILE}/${localState.author}`).then(res => {
          if (res && res.data) {
            setAuthoryProfile(res.data);
          }
        });
      }
    },
    [localState],
  );

  const getDetail = id => {
    setDocDetail({ name: 'abc' });
  };

  function handleViewType(newViewType) {
    setViewType(newViewType);
    if (newViewType === 'project') {
      <Check />;
    }

    setOpenDialogTask(null);
  }

  const findNode = (templates, child, count) => {
    let d = count;
    templates.map(temp => {
      if (temp.children) {
        if (child) {
          let [item] = child;
          let index = temp && temp.children && temp.children.findIndex(f => f.idTree == item.idTree);
          if (index !== -1) {
            if (temp.children) {
              setFinalChild([{ ...temp }]);
            }
          } else {
            findNode(temp.children, child, d + 1);
          }
        }
      }
    });
  };

  useEffect(
    () => {
      if (finalChild && finalChild[0] && finalChild[0].code) {
        setCurrentRole(finalChild[0].code);
      }
    },
    [finalChild, returnDocType],
  );

  const handleOpen = (e, type = '') => {
    if (type !== '') {
      if (type !== 'support' && type !== 'commander') {
        setOpenProcessor(e.currentTarget);
      }
      if (type === 'support') {
        setOpenSupport(e.currentTarget);
      }
      if (type === 'commander') {
        setOpenCommand(e.currentTarget);
      }
    } else {
      setOpenResponse(e.currentTarget);
    }
  };

  const handleClose = e => {
    setOpenDialog(null);
    setOpenResponse(null);
    setOpenProcessor(null);
    setOpenCommand(null);
    setOpenSupport(null);
    setFinalChild([]);
    setReturnDocType('');
    setOpenReturnDocs(false);
    setOpenAsignProcessor(false);
    setOpenSetCommanders(false);
  };
  const Process = props => (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 22, width: '100%', position: 'relative' }}>
      <div
        style={{
          width: `${props.value}%`,
          background: `${props.color2}`,
          height: '100%',
          animation: '2s alternate slidein',
        }}
      />
      <div
        style={{
          width: `${100 - props.value}%`,
          background: `${props.color}`,
          height: '100%',
          animation: '2s alternate slidein',
        }}
      />
      <span style={{ fontSize: 12, marginLeft: 3, color: '#e0e0e0', position: 'absolute' }}>
        {props.progress}
        %- {props.time}
        {/* ngày */}
      </span>
    </div>
  );

  const mapTask = item => {
    const taskStt = JSON.parse(localStorage.getItem('taskStatus'));
    const taskType = taskStt && taskStt.find(item => item.code === 'TASKTYPE').data;
    const mapTypeTask = cate => {
      const data = taskType && taskType.find(item => item.type == cate);
      return data && data.name;
    };
    const statusAcceptFm = JSON.parse(localStorage.getItem('viewConfig'));
    const taskTypeFm =
      statusAcceptFm &&
      statusAcceptFm.find(item => item.code === 'Task').listDisplay.type.fields.type.columns.find(i => i.name === 'statusAccept').menuItem;
    const mapStatusAccept = cate => {
      const data = taskTypeFm && taskTypeFm.find(item => item.type == cate);
      return data && data.name;
    };
    const dataSource = JSON.parse(localStorage.getItem('crmSource'));
    const dataValSource = dataSource && dataSource.find(item => item.code === 'S301');
    const dataVal = dataValSource ? dataValSource.data : [];
    const mapTaskLevel = cate => {
      const data = dataVal && dataVal.find(item => item.value == cate);
      return data && data.title;
    };
    return {
      ...item,
      // parentId: item.parentId ? item['parentId.name'] : null,
      // name: (
      //   <button onClick={() => openTask(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
      //     {item.name}
      //   </button>
      // ),
      avatar: <Avatar src={`${item.avatar}?allowDefault=true`} />,
      progress: (
        <Process value={item.progress} progress={item.progress} color={colorProgress(item)} time={ProcessTask(item)} color2={color2Progress(item)} />
      ),
      note: (
        <Tooltip title={item.note || null}>
          <p>{item.note || null}</p>
        </Tooltip>
      ),
      planApproval:
        item.planApproval === 1 ? (
          <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã phê duyệt kế hoạch</p>
        ) : item.planApproval === 2 ? (
          <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Không phê duyệt kế hoạch</p>
        ) : item.planApproval === 3 ? (
          <p style={{ color: 'rgb(214, 129, 11)', fontWeight: 'bold' }}>Chờ phê duyệt kế hoạch</p>
        ) : (
          <p style={{ color: 'rgb(52, 11, 214)', fontWeight: 'bold' }}>Chưa phê duyệt kế hoạch</p>
        ),
      template: item.templateName,
      acceptApproval:
        item.acceptApproval === 1 ? (
          <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã phê duyệt nghiệm thu </p>
        ) : item.acceptApproval === 2 ? (
          <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Không phê duyệt nghiệm thu</p>
        ) : item.acceptApproval === 3 ? (
          <p style={{ color: 'rgb(214, 129, 11)', fontWeight: 'bold' }}>Chờ phê duyệt nghiệm thu</p>
        ) : (
          <p style={{ color: 'rgb(52, 11, 214)', fontWeight: 'bold' }}>Chưa phê duyệt nghiệm thu</p>
        ),
      approvedProgress: item['approvedProgress.name'],
      support: item.support,
      taskStage: taskStageArr[item.taskStage - 1],
      customer: item['customer.name'],
      createdBy: item['createdBy.name'],
      businessOpportunities: item['businessOpportunities.name'],
      exchangingAgreement: item['exchangingAgreement.name'],
      taskStatus: taskStatusArr[item.taskStatus - 1],
      type: item.type === 1 ? 'Nhóm bảo mật' : item.type === 4 ? 'Nhóm công khai' : item.type === 2 ? 'Nhóm ẩn' : 'Nhóm mở rộng',
      priority:
        item.priority === 1
          ? 'Rất cao'
          : item.priority === 2
            ? 'Cao'
            : item.priority === 3
              ? 'Trung bình'
              : item.priority === 4
                ? 'Thấp'
                : 'Rất thấp',
      organizationUnit: item.organizationUnitName || item.organizationUnit,
      taskType: item.taskType === 1 ? 'Công việc' : item.taskType === 2 ? 'Công việc không doanh thu' : 'Công việc cá nhân',
      typeTask: mapTypeTask(item.typeTask),
      statusAccept: mapStatusAccept(item.statusAccept),
      taskLevel: mapTaskLevel(item.taskLevel),
      // name: <span style={{ color: '#1e91eb', cursor: 'pointer' }}>{item.name}</span>,
    };
  };

  const mapFunctionCalendar = item => {
    return {
      ...item,
      createdBy: item['createdBy.name'] ? item['createdBy.name'] : null,
      typeCalendar: item.typeCalendar === '1' ? 'Lịch cá nhân' : 'Lịch công tác',
      'organizer.name': item.organizer ? item.organizer : null,
      task: item['task.name'],
      roomMetting: item['roomMetting.name'],
      approved: item['approved.name'],
    };
  };

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

  const handleChangeKanban = item => {
    props.mergeData({ kanbanStatus: item.type });
  };

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };
  const handleGetNote = value => {
    setNote(value);
  };

  function setStatus(action) {
    const url = isAuthory ? `${API_INCOMMING_DOCUMENT}/set-status?authority=true` : `${API_INCOMMING_DOCUMENT}/set-status`;

    const body = {
      docIds: [id],
      role,
      action,
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
        props.onChangeSnackbar({ variant: 'success', message: 'Lưu thành công', status: true });
        if (isAuthory) {
          props.history.push('/AuthorityDocument');
        } else {
          props.history.push('/IncommingDocument');
        }
      })
      .catch(error => {
        props.onChangeSnackbar({ variant: 'error', message: error.message || 'Lưu thất bại', status: true });
      });
  }
  const dataFormat = history ? history : [];
  const valueTab = _.get(props, 'history.valueTab');

  const checkRoleCanAction = (key, profile, state, isAuthory = false) => {
    if (isAuthory) {
      return state && state.author && state[key] && state[key].indexOf(state.author) !== -1 ? true : false;
    }
    return state && profile && state[key] && state[key].indexOf(profile._id) !== -1 ? true : false;
  };

  const getDataSupport = () => {
    if (!isAuthory && localState && localState.childrenSupport) {
      return localState.childrenSupport.filter(f => f.code == profile.roleGroupSource);
    }
    if (isAuthory && localState && localState.childrenSupport) {
      return localState.childrenSupport.filter(f => f.code == authoryProfile.roleGroupSource);
    }
  };

  const isCommandeds =
    role === 'commander' &&
    localState &&
    localState.processors &&
    localState.commander &&
    localState.processors.length === 0 &&
    localState.commander.length > 0;
  const commandHasProcess =
    role === 'commander' && localState && localState.processors && localState.commandeds.indexOf(profile._id) && localState.processors.length > 0;
  const orHastForceComplete =
    profile && profile.roleCached && profile.roleCached.IncommingDocument && profile.roleCached.IncommingDocument.processing_force_set_complete
      ? true
      : false;

  const orHastForceCompleteAuthor =
    authoryProfile &&
    authoryProfile.roleCached &&
    authoryProfile.roleCached.IncommingDocument &&
    authoryProfile.roleCached.IncommingDocument.processing_force_set_complete
      ? true
      : false;
  const orHasComplete =
    profile && profile.roleCached && profile.roleCached.IncommingDocument && profile.roleCached.IncommingDocument.processing_set_complete
      ? true
      : false;
  const orHasCompleteeAuthor =
    authoryProfile &&
    authoryProfile.roleCached &&
    authoryProfile.roleCached.IncommingDocument &&
    authoryProfile.roleCached.IncommingDocument.processing_set_complete
      ? true
      : false;
  const orEndRole = localState && localState.children && localState.children.length > 0 && checkEndFlow(localState.children);
  // commander
  const isCommanders = checkRoleCanAction('commander', profile, localState);
  const isCommandersAuthor = checkRoleCanAction('commander', profile, localState, isAuthory);
  const isCommandered = checkRoleCanAction('commandered', profile, localState);
  const isCommanderedAuthor = checkRoleCanAction('commandered', profile, localState, isAuthory);
  // process
  const isProcessors = checkRoleCanAction('processors', profile, localState);
  const isProcessorsAuthor = checkRoleCanAction('processors', profile, localState, isAuthory);
  const isProcesseds = checkRoleCanAction('processeds', profile, localState);
  const isProcessedsAuthor = checkRoleCanAction('processeds', profile, localState, isAuthory);

  // support
  const isSupporters = checkRoleCanAction('supporters', profile, localState);
  const isSupportersAuthor = checkRoleCanAction('supporters', profile, localState, isAuthory);
  const isSupported = checkRoleCanAction('supporteds', profile, localState);
  const isSupportedAuthor = checkRoleCanAction('supporteds', profile, localState, isAuthory);

  // draft
  const canDraft = role !== 'receive' && role !== 'viewers' && role !== 'feedback';
  // view
  const isViewers = checkRoleCanAction('viewers', profile, localState);
  const isViewersAuthor = checkRoleCanAction('viewers', profile, localState, isAuthory);
  const isViewered = checkRoleCanAction('vieweds', profile, localState);
  const isVieweredAuthor = checkRoleCanAction('vieweds', profile, localState);

  // checkSupport
  const dataSupport = getDataSupport() || [];
  const isEndSupport = checkEndFlow(dataSupport);
  // docfromAny
  const isDocFormAny = localState && profile && localState.complete && localState.complete.indexOf(profile._id) === -1 ? true : false;
  const onlyProcess = localState.children && localState.children[0] && localState.children[0].type === '' ? true : !isDocFormAny ? true : false;
  const TABS = [
    { label: 'Thông tin chung', value: 'info' },
    { label: 'Hồ sơ công việc', value: 'work' },
    { label: 'Lịch cá nhân', value: 'meetingCalendar' },
    { label: 'Nguồn gốc', value: 'source' },
  ];
  // checkStage
  const isStageComplete = localState && localState.stage && localState.stage.code == 'complete' ? false : true;

  useEffect(
    () => {
      if (allRoles && profile && role) {
        let newCurrRole = '';
        if (role === 'receive') {
          newCurrRole = 'receive';
        }
        if (role === 'processors') {
          newCurrRole = 'processing';
        }
        if (role === 'supporters') {
          newCurrRole = 'support';
        }
        if (role === 'viewers') {
          newCurrRole = 'view';
        }
        if (role === 'commander') {
          newCurrRole = 'command';
        }
        if (role === 'feedback') {
          newCurrRole = 'feedback';
        }

        const newBusinessRole = (allRoles && allRoles.data && allRoles.data.find(a => a.name === newCurrRole)) || {};
        setBusinessRoleSelect(newBusinessRole && newBusinessRole.data);
      }
    },
    [allRoles, profile, role],
  );
  useEffect(() => {
    const { location } = props;
    if (location && location.state !== undefined && location.state.idd !== undefined) setID(location.state.idd);
  }, []);
  const handleReturnItem = () => {
    setDisableBtnRecall(true);
    let body = {
      docIds: selectedDocs || [],
    };

    let url = isAuthory ? `${API_INCOMMING_DOCUMENT}/recall-sent-doc?authority=true` : `${API_INCOMMING_DOCUMENT}/recall-sent-doc`;
    // if(filter && filter.typeDoc === "preliminaryDoc") url =isAuthory ? `${url}&preliminaryRecall=true` : `${url}?preliminaryRecall=true`
    request(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        // setDisableSave(true);
        onChangeSnackbar({ variant: 'success', message: 'Thu hồi văn bản thành công', status: true });
        setHandleDialogReturnItem(false);
        // getData();
        props.handleReload && props.handleReload();
        props.goBack ? props.goBack() : props.history.goBack();
      })
      .catch(error => {
        console.log(error, 'error');
        // setDisableSave(false);
        onChangeSnackbar({ variant: 'success', message: 'Thu hồi văn bản thất bại', status: true });
      })
      .finally(() => {
        setDisableBtnRecall(false);
      });
  };
  const { currentTab } = props;
  return (
    <div>
      <CustomAppBar
        title={'Chi tiết văn bản đến'}
        onGoBack={() => {
          localStorage.setItem('rootTab', role);
          if (ID !== undefined) {
            props.history.push({
              pathname: `/OutGoingDocument/${ID}`,
              state: { status: true, localState: props.location.state.localState },
            });
          } else if (props.goBack) {
            props.goBack ? props.goBack() : props.history.goBack();
          } else if (props.history && props.history.valueData) {
            props.history.push(`/OutGoingDocument/editGoDocuments/${props.history.valueData}`);
          } else if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else if (props.location.state !== undefined) {
            props.history.push(`/OutGoingDocument/editGoDocuments/${props.location.state}`);
          } else if (props.location.recall) {
            props.history.push({
              pathname: '/RecallDocument',
              index: 'executiveDocuments',
            });
          } else {
            props.history.push('/IncommingDocument');
          }
        }}
        disableAdd
        // onSubmit={onSave}
        moreButtons={
          <Fab
            size="small"
            onClick={e => {
              e.stopPropagation();
              // this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item });
              setOpenMenu(e.currentTarget);
            }}
          >
            <Tooltip title="Khác">
              <Dehaze fontSize="small" />
            </Tooltip>
          </Fab>
        }
      />

      <Menu
        open={Boolean(openMenu)}
        anchorEl={openMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={() => setOpenMenu(null)}
      >
        <MenuItem
          value={'flow'}
          onClick={() => {
            setOpenDialogTemplate(true);
            // setOpenReturnDocs(true);
            // setReturnDocType('flow');
            // localState.children &&
            //   localState.template &&
            //   localState.template.children &&
            //   findNode([{ ...localState.template }], [...localState.children], 0);
            // setTypeFlow("backFlow")
          }}
        >
          Xuất biểu mẫu
        </MenuItem>
        {currentTab &&
          !(role === 'commander' && currentTab === 6) &&
          checkRecallDocs &&
          role !== 'supporters' && (
            <MenuItem
              value="any"
              onClick={e => {
                setHandleDialogReturnItem(true);
              }}
            >
              Thu hồi
            </MenuItem>
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
              <Grid container spacing={8}>
                <Grid item xs="12">
                  <PaperUI>
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      display="block"
                      style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                    >
                      Văn bản đến
                    </Typography>
                    {docDetail && <FileUpload name={docDetail.name} id={id} code={code} viewOnly />}
                  </PaperUI>
                </Grid>
                <Grid item xs="12">
                  <PaperUI>
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      display="block"
                      style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}
                    >
                      Thông tin chung
                    </Typography>
                    <Grid container spacing={8}>
                      <Grid item xs={4}>
                        <CustomInputBase
                          label={name2Title.name}
                          name="name"
                          value={localState.name && localState.name.title}
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CustomInputBase label={name2Title.toBook} value={localState.toBook} name="toBook" disabled className="setCustomInput" />
                      </Grid>
                      <Grid item xs={4} className="setCustomInput1">
                        <CustomInputField
                          label={_.get(name2Title, 'senderUnit', 'Đơn vị gửi')}
                          configType="crmSource"
                          configCode="S39"
                          type="Source|CrmSource,S39|Value||value"
                          name="senderUnit"
                          disabled
                          value={localState.senderUnit}
                        />
                      </Grid>
                      <Grid item xs={4} className="setCustomInput1">
                        <Department
                          labelDepartment={name2Title.receiverUnit}
                          department={localState.receiverUnit}
                          disableEmployee
                          profile={profile}
                          moduleCode="IncommingDocument"
                          // onChange={() => {}}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <CustomInputBase
                          label={name2Title.toBookCode}
                          value={localState.toBookCode && localState.toBookCode.split('/').slice(-1)[0]}
                          name="toBookCode"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CustomDatePicker
                          label={name2Title.documentDate || 'Ngày VB'}
                          value={localState.documentDate}
                          name="documentDate"
                          disabled
                          className="setCustomInput"
                          required={false}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CustomDatePicker
                          label={name2Title.receiveDate || 'Ngày nhận văn bản'}
                          value={localState.receiveDate}
                          name="receiveDate"
                          disabled
                          className="setCustomInput"
                          required={false}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CustomDatePicker
                          label={name2Title.toBookDate || 'Ngày vào sổ'}
                          value={localState.toBookDate}
                          name="toBookDate"
                          disabled
                          className="setCustomInput"
                          required={false}
                        />
                      </Grid>
                      {/* <Grid item xs={4}>
                        <CustomInputBase
                          label={_.get(name2Title, 'textSymbols', 'Ký hiệu ban hành')}
                          value={localState.textSymbols}
                          name="textSymbols"
                          disabled
                        />
                      </Grid> */}
                      <Grid item xs={4}>
                        <CustomDatePicker
                          label={name2Title.deadline || 'Hạn xử lý'}
                          value={localState.deadline || 'DD/MM/YYYY'}
                          name="deadline"
                          isFuture={true}
                          isUpdate={id !== '' ? true : false}
                          disabled
                          className="setCustomInput"
                          required={false}
                          helperText={false}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CustomInputBase
                          label={name2Title.secondBook}
                          value={localState.secondBook}
                          name="secondBook"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CustomInputBase
                          label={name2Title.receiveMethod}
                          value={localState.receiveMethod && localState.receiveMethod.title}
                          name="receiveMethod"
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
                          label={name2Title.urgencyLevel}
                          value={localState.urgencyLevel && localState.urgencyLevel.title}
                          name="urgencyLevel"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CustomInputBase
                          label={name2Title.documentType}
                          value={localState.documentType && localState.documentType.title}
                          name="documentType"
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

                      <Grid item xs={4}>
                        <Autocomplete suggestions={dataSendPlace} value={localState.signer} label={'Người ký'} disabled />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomInputBase
                          rows={5}
                          multiline
                          label={name2Title.abstractNote}
                          value={localState.abstractNote}
                          name="abstractNote"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>

                      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} disabled className="setCustomInput" autoDown />
                    </Grid>
                  </PaperUI>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs="4">
              <PaperUI style={{ height: '100%', marginTop: -50 }}>
                {docDetail && (
                  <Comment
                    profile={profile}
                    code={code}
                    id={id}
                    isAuthory={isAuthory}
                    // viewOnly={currentTab !== 0 }
                    viewOnly={
                      isProcessorsAuthor || isCommanders || isCommandersAuthor || isProcessors
                        ? false
                        : isProcesseds ||
                          isCommandeds ||
                          isProcessedsAuthor ||
                          isCommandered ||
                          isCommanderedAuthor ||
                          isSupported ||
                          isSupportedAuthor ||
                          isViewers ||
                          isViewered ||
                          isVieweredAuthor
                    }
                    disableLike
                    revert
                  />
                )}
              </PaperUI>
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs="12">
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
                  <>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: 20, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }} align="center">
                            STT
                          </TableCell>
                          <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }} align="center">
                            Người nhận
                          </TableCell>
                          <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }} align="center">
                            Thao tác
                          </TableCell>
                          <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }} align="center">
                            Hạn xử lý
                          </TableCell>
                          <TableCell style={{ width: 220, borderBottom: '1px solid #e0e0e', fontWeight: 'bold' }} align="center">
                            Trạng thái
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!Array.isArray(dataFormat)
                          ? null
                          : dataFormat.map((item, index) => {
                              return (
                                <>
                                  <TableRow>
                                    <TableCell colSpan={5}>
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
                                              <TableCell align="center" style={{ width: 20, marginLeft: 40 }}>
                                                {index + 1}
                                              </TableCell>
                                              <TableCell align="center">{item.receiver && item.receiver.name ? item.receiver.name : ''}</TableCell>
                                              <TableCell align="center">{item.action ? item.action : ''}</TableCell>
                                              <TableCell align="center">{item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : ''}</TableCell>
                                              <TableCell align="center">{item.stageStatus ? item.stageStatus : ''}</TableCell>
                                            </TableRow>
                                          ))}
                                    </>
                                  )}
                                </>
                              );
                            })}
                      </TableBody>
                    </Table>
                  </>
                )}
              </PaperUI>
            </Grid>
          </Grid>
        </div>
      ) : null}
      {tab === 'source' ? (
        <Grid container>
          <Grid item xs={12}>
            <FlowDocument data={dataFormat} />
          </Grid>
        </Grid>
      ) : null}
      {tab === 'work' ? (
        <ListPage
          withPagination
          disableAdd
          employeeFilterKey="createdBy"
          apiUrl={`${API_TASK_PROJECT}/projects`}
          code="Task"
          kanban="KANBAN"
          status="taskStatus"
          mapFunction={mapTask}
          // onRowClick={item =>
          //   props.history.push({
          //     pathname: `/Task/task-detail/${item._id}`,
          //     link: props.location && props.location.pathname,
          //   })
          // }
          addChildTask
          disableOneEdit
          perPage={10}
          filter={{
            incommingDocuments: id,
          }}
        />
      ) : null}
      {tab === 'meetingCalendar' ? (
        <ListPage
          disableAdd
          disableImport
          disableOneEdit
          kanban="ST16"
          filter={{
            dataIncoming: id,
          }}
          code="MeetingCalendar"
          apiUrl={`${API_MEETING}`}
          mapFunction={mapFunctionCalendar}
          columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
        />
      ) : null}
      <DocumentAssignModal
        open={openAsignProcessor}
        docIds={selectedDocs}
        onClose={handleClose}
        typePage={isAuthory ? 'authority' : ''}
        profile={isAuthory ? authoryProfile : profile}
        onSuccess={() => {
          setOpenAsignProcessor(false);
          setOpenDialog(null);
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/IncommingDocument');
          }
        }}
        processType={processType}
        template={templates}
        isAuthory={isAuthory}
        info={localState}
        childTemplate={selectedTemplate}
        supporteds={localState ? localState.supporteds : []}
        supporters={localState ? localState.supporters : []}
        child={localState.children ? localState.children : []}
        childSupport={localState && localState.childrenSupport ? localState.childrenSupport : []}
        childCommanderSupport={localState && localState.childrenCommanderSupport ? localState.childrenCommanderSupport : []}
        currentRole={roleForProcess ? roleForProcess : nextRole}
        role={role}
        onChangeSnackbar={props.onChangeSnackbar}
      />

      <DocumentSetCommanders
        open={openSetCommanders}
        isAuthory={isAuthory}
        docIds={selectedDocs}
        onClose={handleClose}
        onSuccess={() => {
          setOpenSetCommanders(false);
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/IncommingDocument');
          }
        }}
        onChangeSnackbar={props.onChangeSnackbar}
      />
      <ReturnDocs
        open={openReturnDocs}
        docIds={selectedDocs}
        type={returnDocType}
        processeds={localState ? localState.processeds : []}
        role={role}
        currentRole={currentRole}
        template={localState.template ? [localState.template] : templates}
        childTemplate={localState.children ? [...localState.children] : []}
        onClose={handleClose}
        onSuccess={() => {
          setOpenReturnDocs(false);
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/IncommingDocument');
          }
        }}
        onChangeSnackbar={props.onChangeSnackbar}
      />
      <CompleteDocs
        open={openComplete}
        docIds={selectedDocs}
        isAuthory={isAuthory}
        template={setOpenComplete}
        typePage={isAuthory ? 'authory' : ''}
        onClose={() => {
          setOpenComplete(false);
        }}
        onSuccess={() => {
          setOpenComplete(false);
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/IncommingDocument');
          }
        }}
        onChangeSnackbar={props.onChangeSnackbar}
      />

      <Dialog
        title="Xuất biểu mẫu"
        onSave={handleTemplate}
        open={openDialogTemplate}
        onClose={() => setOpenDialogTemplate(null)}
        saveText="In biểu mẫu"
        maxWidth="sm"
      >
        <TextField
          value={templatePrint && templatePrint.template}
          fullWidth
          select
          InputLabelProps={{ shrink: true }}
          onChange={e => {
            const temp = listTemplates.find(it => it._id === e.target.value);
            // setState({ ...state, template: e.target.value, templateCode: temp ? temp.code : "" })
            setTemplatePrint({ ...templatePrint, template: e.target.value, templateCode: temp ? temp.code : '' });
          }}
          id="outlined-number"
          label="Biểu mẫu"
          autoFocus
        >
          {listTemplates &&
            listTemplates.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item.title}
              </MenuItem>
            ))}
        </TextField>
        {templatePrint && templatePrint.template ? (
          <>
            <TextField
              value={templatePrint && templatePrint.type}
              fullWidth
              select
              id="outlined-number"
              InputLabelProps={{ shrink: true }}
              onChange={e => {
                setTemplatePrint({ ...templatePrint, type: e.target.value });
              }}
              label="Định dạng file"
            >
              <MenuItem value="PDF">PDF</MenuItem>
              {/* <MenuItem value="XLSX">EXCEL</MenuItem> */}
            </TextField>
          </>
        ) : null}
      </Dialog>

      {/* thu hồi */}
      <DialogUI
        onClose={() => {
          setHandleDialogReturnItem(false);
          setDisableBtnRecall(false);
        }}
        aria-labelledby="customized-dialog-title"
        open={handleDialogReturnItem}
        maxWidth="md"
      >
        <DialogTitle id="customized-dialog-title">Thông báo</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Đồng chí có chắc chắn muốn thu hồi?</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleReturnItem} color="primary" variant="contained" disabled={disableBtnRecall}>
            Đồng ý
          </Button>
          <Button
            onClick={() => {
              setHandleDialogReturnItem(false);
              setDisableBtnRecall(false);
            }}
            color="secondary"
            variant="contained"
          >
            Hủy
          </Button>
        </DialogActions>
      </DialogUI>
    </div>
  );
}

EditExecutiveDocuments.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  editExecutiveDocuments: makeSelectEditExecutiveDocuments(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
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

const withReducer = injectReducer({ key: 'editExecutiveDocuments', reducer });
// const withSaga = injectSaga({ key: 'executiveDocuments', saga });

export default compose(
  withReducer,
  // withSaga,
  withConnect,
)(EditExecutiveDocuments);
