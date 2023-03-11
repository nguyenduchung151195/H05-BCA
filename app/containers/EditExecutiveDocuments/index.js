// EditExecutiveDocuments

import {
  Button,
  Grid,
  Menu,
  MenuItem,
  Typography,
  Table,
  TableHead,
  Avatar,
  TableBody,
  Tooltip,
  TableRow,
  TableCell,
  IconButton,
  Dialog as DialogUI,
  Fab,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import { mergeData } from './actions';
import makeSelectEditExecutiveDocuments from './selectors';
import reducer from './reducer';
import { Comment, Dialog, FileUpload } from '../../components/LifetekUi';
import CustomAppBar from 'components/CustomAppBar';
import { Check, Dehaze, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import makeSelectDashboardPage, { makeSelectProfile } from '../Dashboard/selectors';
import ListPage from 'components/List';
import { Paper as PaperUI } from 'components/LifetekUi';
import {
  API_INCOMMING_DOCUMENT,
  API_USERS,
  API_DOCUMENT_HISTORY,
  API_AUTHORY_PROFILE,
  API_TASK_PROJECT,
  API_ROLE_APP,
  API_MEETING,
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_GOING_DOCUMENT,
  orderHidden,
  API_ADD_TASK_DOCUMENT,
} from '../../config/urlConfig';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomInputField from '../../components/Input/CustomInputField';
import { viewConfigName2Title } from '../../utils/common';
import { taskStatusArr, taskStageArr } from 'variable';
import CustomDatePicker from '../../components/CustomDatePicker';
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
import { Tabs, Tab, Autocomplete } from '../../components/LifetekUi';
import _ from 'lodash';
import { getListData } from '../../utils/common';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';
import TaskDocs from '../AddSignedDocument/components/TaskDocs';
import AddHandleDialog from '../../components/DocumentAssignModal/DocumentAddMoreProcessors';
import ExtendHanleDialog from '../../components/List/ExtendHanleDialog';

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
  const id = (_.get(props, 'match.params.id') && _.get(props, 'match.params.id').split('?')[0]) || props.id;
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role') || props.role;
  const currentTab = Number(urlParams.get('tab'));
  const typeDocOfItem = Number(urlParams.get('typeDoc'));
  // typeDocOfItem : 1 là sơ loại, 0 là vb phòng
  const isAuthory = Boolean(urlParams.get('isAuthory')) || false;

  const crmSource = JSON.parse(localStorage.getItem('crmSource'));
  let data = crmSource && crmSource.find(item => item && item.code === 'nguoiki');
  let dataSendPlace = [];
  data && data.data.map((item, index) => dataSendPlace.push({ title: item.title, value: item._id }));
  const [selectedDocs, setSelectedDocs] = useState([id]);
  const [docDetail, setDocDetail] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
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
  const [flagFlashComplete, setFlagFlashComplete] = useState(false);

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
  const [consult, setConsult] = useState('');
  const [openConsult, setOpenConsult] = useState(null);
  const [roleGroupSource, setRoleGroupSource] = useState(null);
  const [typeFlow, setTypeFlow] = useState();

  //
  const [processType, setProcessType] = useState('');
  const [finalChild, setFinalChild] = useState([]);
  const [ID, setID] = useState();
  const [sendUnit, setSendUnit] = useState();
  const [allowSendToUnit, setAllowSendToUnit] = useState('');
  const [sendAny, setSendAny] = useState(false);
  const [roleGroups, setRoleGroups] = useState(localStorage.getItem('roleGroups') ? JSON.parse(localStorage.getItem('roleGroups')) : {});
  const [roleDirection, setRoleDirection] = useState('');
  const [roleGroupsAndName, setRoleGroupsAndName] = React.useState(JSON.parse(localStorage.getItem('roleGroupsAndName') || []));
  const [openMenu, setOpenMenu] = useState(null);
  const [listTemplates, setListTemplates] = useState([]);
  const [templatePrint, setTemplatePrint] = useState({ type: 'PDF' });
  const [handleDialogReturnItem, setHandleDialogReturnItem] = useState(false);
  const [disableBtnRecall, setDisableBtnRecall] = useState(false);
  const [checkRecallDocs, setCheckRecallDocs] = useState(false);
  const [openDialogTemplate, setOpenDialogTemplate] = useState(null);
  const [addTask, setAddTask] = useState(false);
  const [disableSave, setDisaleSave] = useState(true);
  const [idAddTask, setIdAddTask] = useState([]);
  const [addHandleDialog, setAddHandleDialog] = useState(false);
  const [canDeadlineIncrease, setCanDeadlineIncrease] = useState(false);
  const [dialogHanle, setDialogHanle] = useState(false);
  const [reload, setReload] = useState(new Date()*1);


  const [canAddMoreProcessor, setCanAddMoreProcessor] = useState(false);

  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);

    return () => {
      newNam2Title;
    };
  }, []);
  useEffect(
    () => {
      let roleP;
      const { editExecutiveDocuments = {} } = props || {};
      const { roleDepartment = [] } = editExecutiveDocuments || {};
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
      // if (role === 'processors' || role === 'commander') {
      //   const roleFound = roleDepartment.find(element => element.name === 'processing');
      //   setCanDeadlineIncrease(roleFound && roleFound.data && roleFound.data.deadlineIncrease ? roleFound.data.deadlineIncrease : false);
      // } else {
      //   setCanDeadlineIncrease(false);
      // }
      console.log(roleDepartment, 'roleP', roleP);
      setCanDeadlineIncrease(roleP && roleP.data && roleP.data.deadlineIncrease ? roleP.data.deadlineIncrease : false);
      setCanAddMoreProcessor(roleP && roleP.data && roleP.data.add_more_process ? roleP.data.add_more_process : false);
      setCheckRecallDocs(roleP && roleP.data && roleP.data.recallDocs ? roleP.data.recallDocs : false);
    },
    [props.editExecutiveDocuments],
  );
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
  useEffect(
    () => {
      // .slice(0, str.indexOf("?"))
      if (id && id.indexOf('?') !== -1 && id.length > id.slice(0, id.indexOf('?')).length) {
        setSelectedDocs([id.slice(0, id.indexOf('?'))]);
      }
    },
    [id],
  );
  useEffect(() => {
    if (props.location && props.location.tab) {
      setTab(props.location.tab);
    }
  }, []);
  const getBusinessRoles = isAuthoryDoc => {
    fetchData(`${API_ROLE_APP}/IncommingDocument/currentUser?${isAuthoryDoc ? 'authority=true' : ''}`).then(res => {
      const newBusinessRole = {};
      const { roles } = res;
      const code = 'BUSSINES';
      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it && it.code === code);

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

  // useEffect(
  //   () => {
  //     if (profile && profile._id) {

  //   },
  //   [profile],
  // );

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
            // get data
            let { children } = data;
            let flag = false;
            let newData = [];

            if (children && Array.isArray(children) && children.length > 0 && children[0].children) {
              flag = true;
              let child = children[0].children;
              let role = {};
              Array.isArray(data.dataCheck) &&
                data.dataCheck.length > 0 &&
                data.dataCheck.map(el => {
                  role = { ...role, ...el };
                });
              child &&
                Array.isArray(child) &&
                child.length > 0 &&
                child.map(el => {
                  if (roleGroups[el.code] <= orderHidden) {
                    newData.push(el);
                  } else {
                    if (role[el.code]) newData.push(el);
                  }
                });
              children[0].children = newData;
            }
            setLocalState({ ...data, signer: data.signer === undefined ? localState.signer : data.signer });
          });
      } else {
        getBusinessRoles();
      }
    },
    [id, reload],
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

  useEffect(
    () => {
      const query = { filter: { docId: selectedDocs } };
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
    },
    [selectedDocs, reload],
  );

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

    // setOpenDialogTask(null);
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
      if (finalChild && Array.isArray(finalChild) && finalChild.length && finalChild[0] && finalChild[0].code) {
        setCurrentRole(finalChild[0].code);
      }
    },
    [finalChild, returnDocType],
  );

  const handleOpen = (e, type = '') => {
    if (type !== '') {
      if (type !== 'support' && type !== 'commander' && type !== 'consult') {
        setOpenProcessor(e.currentTarget);
      }
      if (type === 'support') {
        setOpenSupport(e.currentTarget);
      }
      if (type === 'commander') {
        setOpenCommand(e.currentTarget);
      }
      if (type === 'consult') {
        setOpenConsult(e.currentTarget);
      }
    } else {
      setOpenResponse(e.currentTarget);
    }
  };

  const handleClose = e => {
    setOpenDialog(null);
    setOpenResponse(null);
    setOpenProcessor(null);
    setOpenConsult(null);
    setOpenCommand(null);
    setOpenSupport(null);
    setFinalChild([]);
    setReturnDocType('');
    setOpenReturnDocs(false);
    setOpenAsignProcessor(false);
    setOpenSetCommanders(false);
    setTypeFlow();
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
    console.log(item, "item item")
    const taskStt = JSON.parse(localStorage.getItem('taskStatus'));
    const taskType = taskStt && taskStt.find(item => item && item.code === 'TASKTYPE').data;
    const mapTypeTask = cate => {
      const data = taskType && taskType.find(item => item && item.type == cate);
      return data && data.name;
    };
    const statusAcceptFm = JSON.parse(localStorage.getItem('viewConfig'));
    const taskTypeFm =
      statusAcceptFm &&
      statusAcceptFm.find(item => item && item.code === 'Task').listDisplay.type.fields.type.columns.find(i => i.name === 'statusAccept').menuItem;
    const mapStatusAccept = cate => {
      const data = taskTypeFm && taskTypeFm.find(item => item.type == cate);
      return data && data.name;
    };
    const dataSource = JSON.parse(localStorage.getItem('crmSource'));
    const dataValSource = dataSource && dataSource.find(item => item && item.code === 'S301');
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
      name: <span style={{ color: '#1e91eb', cursor: 'pointer' }}>{item.name}</span>,
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
  // const valueTab = _.get(props, 'history.valueTab');

  const checkRoleCanAction = (key, profile, state, isAuthory = false, isComent) => {
    let { approvers = [], processeds = [] } = state;
    if (approvers.length && isComent) {
      const idx = processeds.indexOf(approvers[0]);
      if (idx !== -1) {
        processeds.splice(idx, 1);
          state = {
            ...state,
            processeds,
          };
       
      }
    }
    if (isAuthory) {
      return state && state.author && state[key] && state[key].indexOf(state.author) !== -1 ? true : false;
    }
    return state && profile && state[key] && state[key].indexOf(profile._id) !== -1 ? true : false;
  };

  const getDataSupport = () => {
    if (!isAuthory && localState && localState.childrenSupport) {
      // chính quyền
      const childrenSupport = localState.childrenSupport.filter(f => f && f.code == profile.roleGroupSource);
      if (localState && localState.supportAndIdTree && localState.supportAndIdTree.length) {
        const supportAndIdTree = localState.supportAndIdTree.find(it => it.idSupporter === profile._id) || {};
        const dataSP = childrenSupport.find(it => it.idTree === supportAndIdTree.idTree)
          ? [childrenSupport.find(it => it.idTree === supportAndIdTree.idTree)]
          : [];
        return dataSP;
      }
      return [];
      // return localState.childrenSupport.filter(f => f.code == profile.roleGroupSource);
    }
    if (isAuthory && localState && localState.childrenSupport) {
      // ủy quyền
      const childrenSupport = localState.childrenSupport.filter(f => f && f.code == authoryProfile.roleGroupSource);
      if (localState && localState.supportAndIdTree && localState.supportAndIdTree.length) {
        const supportAndIdTree = localState.supportAndIdTree.find(it => it.idSupporter === authoryProfile._id) || {};
        const dataSPUQ = childrenSupport.find(it => it.idTree === supportAndIdTree.idTree)
          ? [childrenSupport.find(it => it.idTree === supportAndIdTree.idTree)]
          : [];
        return dataSPUQ;
      }
      return [];
      // return localState.childrenSupport.filter(f => f.code == authoryProfile.roleGroupSource);
    }
  };
  useEffect(
    () => {
      const { children } = localState;
      if (children && Array.isArray(children) && children[0]) {
        setSendAny(_.isEmpty(children[0]));
      } else setSendAny(false);
    },
    [localState],
  );
  const isCommandeds =
    role === 'commander' &&
    localState &&
    localState.processors &&
    localState.commander &&
    localState.processors.length === 0 &&
    localState.commander.length > 0;
  const commandHasProcess =
    role === 'commander' && localState && localState.processors && localState.commandeds.indexOf(profile._id) && localState.processors.length > 0;
  const commanderProcess =
    role === 'commander' &&
    localState &&
    localState.commander &&
    localState.commander.indexOf(profile._id) !== -1 &&
    (!localState.processors || (localState.processors && !localState.processors.length));
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

  // sơ loại k tính là đã xử lý
  const isProcessedsComment = checkRoleCanAction('processeds', profile, localState, isAuthory, true);

  const isProcessedsAuthor = checkRoleCanAction('processeds', profile, localState, isAuthory);

  // support
  const isSupporters = checkRoleCanAction('supporters', profile, localState);
  const isSupporteds = checkRoleCanAction('supporteds', profile, localState);

  const isSupportersAuthor = checkRoleCanAction('supporters', profile, localState, isAuthory);
  const isSupported = checkRoleCanAction('supporteds', profile, localState);
  const isSupportedAuthor = checkRoleCanAction('supporteds', profile, localState, isAuthory);

  // draft
  const canDraft = role !== 'receive' && !(role === 'viewers' && currentTab === 0);
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
    { label: 'Văn bản đi', value: 'outGoingDocument' },
  ];
  // checkStage
  const isStageComplete = localState && localState.stage && localState.stage.code == 'complete' ? false : true;
  const handleRenderNameReceiver = item => {
    // roleGroupsAndName
    const { receiver = {} } = item;
    const { roleGroupSource, name } = receiver;
    if (!roleGroupSource) return name;
    const roleGroupsName = roleGroupsAndName.find(it => it.code === roleGroupSource);
    return (roleGroupsName && `${name} - ${roleGroupsName.name}`) || name;
  };
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
  const checkShowReturn = () => {
    if (role === 'receive') return false;
    else if (role === 'processors') {
      return businessRole && businessRole.processing_return_docs;
    } else if (role === 'commander') {
      return businessRole && businessRole.command_return_docs;
    }
    return false;
  };
  useEffect(() => {
    const { location } = props;
    console.log(location, 'location')
    if (location && location.state !== undefined && location.state.idd !== undefined) setID(location.state.idd);
  }, []);
  useEffect(
    () => {
      const { children } = localState;
      if (children && Array.isArray(children) && children.length > 0 && children[0].consult) {
        setConsult(children[0].consult);
      } else setConsult('');
    },
    [localState],
  );

  const getShortNote = (value, length) => {
    if (value.length >= length) {
      let arrayStr = [...value];
      arrayStr = arrayStr.slice(0, length).join('');
      return arrayStr + '...';
    }
    return value;
  };

  const mapFunction = item => {
    const mapkanban = data => {
      if (!data) {
        return item.kanbanStatus;
      } else {
        switch (data) {
          case 'waitting':
            if (item.stage === 'complete') {
              return <a style={{ color: 'rgb(62, 168, 235)' }}>Chờ ban hành</a>;
            } else {
              return <a style={{ color: 'rgb(62, 168, 235)' }}>Chờ ban hành một phần</a>;
            }
          case 'released':
            if (item.completeStatus && item.completeStatus === 'promulgated') {
              return <a style={{ color: 'rgba(26, 144, 50, 0.91)' }}>Đã ban hành </a>;
            } else {
              return <a style={{ color: 'rgba(26, 144, 50, 0.91)' }}>Đã ban hành một phần</a>;
            }
          case '1':
            return <a style={{ color: 'rgb(62, 168, 235)' }}>Chờ xử lý</a>;
          case 'wait4comment':
            return <a style={{ color: 'rgb(62, 168, 235)' }}>Chờ xin ý kiến</a>;
          case 'commented':
            return <a style={{ color: 'rgb(62, 168, 235)' }}>Đã cho ý kiến</a>;
          case 'return':
            return <a style={{ color: 'rgb(62, 168, 235)' }}>Đã cho ý kiến</a>;
          case '2':
            return <a style={{ color: 'rgb(62, 168, 235)' }}>Đang xử lý</a>;
          case '3':
            return <a style={{ color: 'rgb(62, 168, 235)' }}>Đã xử lý</a>;
        }
      }
    };
    return {
      ...item,
      abstractNote: <p style={{ width: 360, wordBreak: 'break-all' }}>{item.abstractNote && getShortNote(item.abstractNote, 80)}</p>,
      kanbanStatus: mapkanban(item.completeStatus),
    };
  };
  const handleReturnItem = () => {
    // console.log(filter, "hahaha")
    setDisableBtnRecall(true);
    let body = {
      docIds: selectedDocs || [],
    };

    let url = isAuthory ? `${API_INCOMMING_DOCUMENT}/recall-sent-doc?authority=true` : `${API_INCOMMING_DOCUMENT}/recall-sent-doc`;
    if (typeDocOfItem) url = isAuthory ? `${url}&preliminaryRecall=true` : `${url}?preliminaryRecall=true`;
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
  const handleTemplate = async () => {
    // xuất biểu mẫu nè
    if (templatePrint && templatePrint.type === 'PDF') {
      printTemplte(templatePrint.template, id, code, '', templatePrint.templateCode);
    } else {
      printTemplteExcel(templatePrint.template, id, code, '', templatePrint.templateCode);
    }
  };
  const onSaveAddTask = () => {
    setDisaleSave(true);
    fetch(API_ADD_TASK_DOCUMENT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docId: localState._id,
        taskIds: idAddTask,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 1) {
          // setSnackbar({ open: true, message: 'Thêm công việc liên quan thành công!', variant: 'success' });
          onChangeSnackbar({ variant: 'success', message: 'Thêm công việc liên quan thành công!', status: true });

          // (false);
        } else {
          // setSnackbar({ open: true, message: data.message, variant: 'error' });
          onChangeSnackbar({ variant: 'error', message: 'Thêm công việc liên quan thất bại!', status: true });
        }
      })
      .catch(() => {
        onChangeSnackbar({ variant: 'error', message: 'Thêm công việc liên quan thất bại!', status: true });
      })
      .finally(() => {
        setDisaleSave(false);
        setAddTask();
        setIdAddTask([]);
      });
  };
  return (
    <div>
      <CustomAppBar
        title={'Chi tiết văn bản đến'}
        onGoBack={() => {
          localStorage.setItem('rootTab', role);
          console.log(props, 'props', isAuthory)
          if (ID) {
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
              tabtab: (props && props.location && props.location.tabtab) || 0,
            });
          } else {
            props.history.push('/IncommingDocument');
          }
        }}
        disableAdd
        moreButtons={
          <div style={{ marginLeft: 10, display: 'flex', justifyContent: 'space-around' }}>
            {canDraft &&
              (props.location && !props.location.recall) &&
              (props.location && !props.location.tabList) && (
                <Button
                  style={{ marginRight: 10 }}
                  variant="outlined"
                  color="inherit"
                  onClick={e => {
                    if (localState && localState._id) {
                      props.history.push(`/OutGoingDocument/add?docId=${localState._id}&toBookCode=${localState.toBookCode}`);
                    } else if (selectedDocs && Array.isArray(selectedDocs) && selectedDocs.length) {
                      props.history.push(`/OutGoingDocument/add?docId=${selectedDocs[0]}&toBookCode=${localState.toBookCode}`);
                    } else {
                      onChangeSnackbar({ variant: 'error', message: 'Lấy dữ liệu thất bại', status: true });
                    }
                    // props.history.push(`/OutGoingDocument/add?docId=${localState._id ||  selectedDocs}&toBookCode=${localState.toBookCode}`);
                  }}
                >
                  {/* <span style={{ marginRight: 5 }}>
                  <CheckBox />
                </span> */}
                  Tạo dự thảo
                </Button>
              )}

            {role === 'supporters' || role === 'feedback' || (role === 'processors' && currentTab == 4) ? null : (
              <>
                {(isProcessors || isProcessorsAuthor) && (props.location && !props.location.recall) ? (
                  <>
                    {(onlyProcess || sendAny) && (orHasComplete || orHasCompleteeAuthor) ? (
                      <Button
                        variant="outlined"
                        color="inherit"
                        style={{ marginRight: 10 }}
                        onClick={e => {
                          setOpenComplete(true);
                        }}
                      >
                        {/* <span style={{ marginRight: 5 }}>
                       <CheckBox />
                     </span> */}
                        Hoàn thành xử lý
                      </Button>
                    ) : null}
                  </>
                ) : null}

                {/* hoàn thành xử lý chỉ đạo */}
                {role !== 'feedback' &&
                (onlyProcess && (orHasComplete || orHasCompleteeAuthor) && (isProcessors || isProcessorsAuthor)) === false &&
                isStageComplete &&
                (isProcesseds || isProcessedsAuthor || commanderProcess) &&
                (props.location && !props.location.recall) ? (
                  <>
                    {orHastForceComplete || orHastForceCompleteAuthor ? (
                      <Button
                        variant="outlined"
                        color="inherit"
                        style={{ marginRight: 10 }}
                        onClick={e => {
                          setOpenComplete(true);
                          if (role === 'commander' && currentTab == 0) {
                            setFlagFlashComplete(true);
                          } else {
                            setFlagFlashComplete(false);
                          }
                        }}
                      >
                        {/* <span style={{ marginRight: 5 }}>
                         <CheckBox />
                       </span> */}
                        Hoàn thành xử lý
                      </Button>
                    ) : null}
                  </>
                ) : null}
              </>
            )}
            {
              //             role === "supporters" && isSupporteds && !isSupporters && <Button
              //               style={{ marginRight: 10 }}
              //               variant="outlined"
              //               color="inherit"
              //               onClick={() => {
              //                 setStatus('Hoàn thành');
              //               }}
              //             >
              //               {/* <span style={{ marginRight: 5 }}>
              //   <CheckBox />
              // </span> */}
              //               Hoàn thành
              //             </Button>
            }

            {role !== 'feedback' &&
            !(role === 'processors' && currentTab == 5) &&
            (isSupporters || (isSupportersAuthor && (props.location && !props.location.recall))) ? (
              <Button
                style={{ marginRight: 10 }}
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setStatus('Hoàn thành');
                }}
              >
                {/* <span style={{ marginRight: 5 }}>
                  <CheckBox />
                </span> */}
                Hoàn thành
              </Button>
            ) : null}
            {role !== 'feedback' && !(role === 'processors' && currentTab == 5) && commandHasProcess && (props.location && !props.location.recall) ? (
              <Button
                style={{ marginRight: 10 }}
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setStatus('Hoàn thành');
                }}
              >
                {/* <span style={{ marginRight: 5 }}>
                  <CheckBox />
                </span> */}
                Hoàn thành
              </Button>
            ) : null}
            {role !== 'feedback' && (isViewers || isViewersAuthor) && (props.location && !props.location.recall) ? (
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

            {!(role === 'processors' && (currentTab == 5 || currentTab == 11 || currentTab == 4)) &&
            props.location &&
            !props.location.recall &&
            businessRoleSelect &&
            (businessRoleSelect.set_feedback || (isAuthory && businessRoleSelect.set_feedback)) &&
            role !== 'feedback' ? (
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
            ) : null}
            {role !== 'feedback' &&
            // (checkShowReturn() &&
            (!(role === 'processors' && currentTab == 4) && (isProcessors || isCommandeds || (isAuthory && (isCommandeds || isProcessorsAuthor))) && (props.location && !props.location.recall)) ? (
              <Button
                style={{ marginRight: 10 }}
                variant="outlined"
                color="inherit"
                onClick={e => {
                  handleOpen(e, '');
                }}
              >
                {/* <span style={{ marginRight: 5 }}>
                    <Replay />
                  </span> */}
                Trả lại
              </Button>
            ) : null}

            {/* tra lai */}
            <Menu
              open={Boolean(openResponse)}
              anchorEl={openResponse}
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
              {/* <MenuItem
                value="any"
                onClick={e => {
                  setOpenReturnDocs(true);
                  setReturnDocType('any');
                }}
              >
                Trả bất kỳ
              </MenuItem> */}
              <MenuItem
                value={'flow'}
                onClick={() => {
                  setOpenReturnDocs(true);
                  setReturnDocType('flow');
                  localState.children &&
                    localState.template &&
                    localState.template.children &&
                    findNode([{ ...localState.template }], [...localState.children], 0);
                  setTypeFlow('backFlow');
                }}
              >
                <span> Trả theo luồng</span>
              </MenuItem>
              <MenuItem
                value={'startFlow'}
                onClick={() => {
                  setOpenReturnDocs(true);
                  setReturnDocType('startFlow');
                  setTypeFlow('startFlow');
                }}
              >
                <span> Trả cho văn thư</span>
              </MenuItem>
            </Menu>

            {role !== 'feedback'  && currentTab !== 4 && props.location && !props.location.recall && (isProcessors || isProcessorsAuthor) && isDocFormAny && orEndRole ? (
              <>
                {localState.children &&
                  localState.children.map(item => (
                    <>
                      <Button
                        variant="outlined"
                        color="inherit"
                        // style={{ marginRight: 10 }}
                        onClick={e => {
                          handleOpen(e, 'process');
                        }}
                      >
                        {/* <span style={{ marginRight: 5 }}>
                          <Send />
                        </span> */}
                        Chuyển xử lý
                      </Button>
                    </>
                  ))}
              </>
            ) : null}

            {!(role === 'processors' && currentTab == 5) &&
            ((role !== 'feedback' && (props.location && !props.location.recall && (isSupporters && isEndSupport))) ||
              (isSupportersAuthor && isEndSupport)) ? (
              <>
                {localState.children &&
                  localState.children.map(item => (
                    <>
                      <Button
                        variant="outlined"
                        color="inherit"
                        // style={{ marginRight: 10 }}
                        onClick={e => {
                          handleOpen(e, 'support');
                        }}
                      >
                        {/* <span style={{ marginRight: 5 }}>
                          <Send />
                        </span> */}
                        Chuyển xử lý
                      </Button>
                    </>
                  ))}
              </>
            ) : null}
            {(role !== 'feedback' && (props.location && !props.location.recall && isCommandeds)) ||
            commandHasProcess ||
            (isAuthory && (isCommandeds || commandHasProcess)) ? (
              <>
                {localState.children &&
                  localState.children.map(item => (
                    <>
                      <Button
                        variant="outlined"
                        color="inherit"
                        // style={{ marginRight: 10 }}
                        onClick={e => {
                          handleOpen(e, 'commander');
                        }}
                      >
                        {/* <span style={{ marginRight: 5 }}>
                          <Send />
                        </span> */}
                        Chuyển xử lý
                      </Button>
                    </>
                  ))}
              </>
            ) : null}
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
                              setRoleGroupSource(null);
                            }}
                          >
                            {/* Xin ý kiến bất kỳ */}
                            Xin ý kiến tùy chọn
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
                                  setRoleGroupSource(item && item.code);
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

                                setRoleGroupSource(t && t.code);
                              }}
                            >
                              Xin ý kiến {t && t.name}
                            </MenuItem>
                          ))}
                      </>
                    )}
                  </>
                ))}
            </Menu>

            {/* Phoi hop*/}
            <Menu
              open={Boolean(openSupport)}
              anchorEl={openSupport}
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
                variant="outlined"
                color="inherit"
                style={{ marginRight: 10 }}
                onClick={e => {
                  if (dataSupport && dataSupport.length === 1) {
                    dataSupport && dataSupport[0].children && setSelectedTemplate(dataSupport[0].children);
                    dataSupport && dataSupport[0] && setSendUnit(dataSupport && dataSupport[0].sendUnit);
                    dataSupport && dataSupport[0] && setAllowSendToUnit(dataSupport && dataSupport[0].allowSendToUnit);
                    let role = getRole(dataSupport[0].children);
                    setNextRole(role);
                    setOpenAsignProcessor(true);
                    setProcessType('any');
                  }
                }}
              >
                Chuyển tùy chọn
              </MenuItem>
              {dataSupport &&
                dataSupport.length > 0 &&
                dataSupport.map(item => (
                  <>
                    {item.children &&
                      item.children.length > 0 &&
                      item.children.map(i => (
                        <MenuItem
                          value="item.code"
                          onClick={e => {
                            setSelectedTemplate(i);
                            setOpenAsignProcessor(true);
                            setRoleForProcess(i && i.code);
                            setProcessType('flow');
                          }}
                        >
                          Chuyển cho {i.name}
                        </MenuItem>
                      ))}
                    {item.children &&
                      item.children.length === 0 && (
                        <MenuItem
                          value="item.code"
                          onClick={e => {
                            setSelectedTemplate(item);
                            setOpenAsignProcessor(true);
                            setRoleForProcess(item && item.code);
                          }}
                        >
                          Chuyển cho {item && item.name}
                        </MenuItem>
                      )}
                  </>
                ))}
            </Menu>
            {/* chi dao */}
            <Menu
              open={Boolean(openCommand)}
              anchorEl={openCommand}
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
              {localState.childrenCommander &&
                localState.childrenCommander.length > 0 &&
                localState.childrenCommander.map(item => (
                  <>
                    <MenuItem
                      variant="outlined"
                      color="inherit"
                      style={{ marginRight: 10 }}
                      onClick={e => {
                        if (localState.childrenCommander && localState.childrenCommander.length === 1) {
                          const [template] = localState.childrenCommander;
                          template && template.children && setSelectedTemplate(template.children);
                          let role = getRole(template.children);
                          setNextRole(role);
                          setOpenAsignProcessor(true);
                          setProcessType('any');
                          setSendUnit(template.sendUnit);
                          setAllowSendToUnit(template.allowSendToUnit);
                          if (Array.isArray(template) && template.length > 0 && template[0].roleDirection)
                            setRoleDirection(template[0].roleDirection);
                          else if (template.roleDirection) setRoleDirection(template.roleDirection);
                          else {
                            setRoleDirection('');
                          }
                        }
                      }}
                    >
                      Chuyển tùy chọn
                    </MenuItem>
                    {item.children &&
                      item.children.length > 0 &&
                      item.children.map(i => (
                        <MenuItem
                          value="item.code"
                          onClick={e => {
                            setSelectedTemplate(i);
                            setOpenAsignProcessor(true);
                            setRoleForProcess(i && i.code);
                            setProcessType('flow');
                          }}
                        >
                          Chuyển cho {i && i.name}
                        </MenuItem>
                      ))}
                    {item.children &&
                      item.children.length === 0 && (
                        <MenuItem
                          value="item.code"
                          onClick={e => {
                            setSelectedTemplate(item);
                            setOpenAsignProcessor(true);
                            setRoleForProcess(item && item.code);
                          }}
                        >
                          Chuyển cho {item && item.name}
                        </MenuItem>
                      )}
                  </>
                ))}
            </Menu>
            {/* chuyển xử lý , xử lý chính*/}
            <Menu
              open={Boolean(openProcessor)}
              anchorEl={openProcessor}
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
                    {role !== 'supporters' && (
                      <MenuItem
                        variant="outlined"
                        color="inherit"
                        style={{ marginRight: 10 }}
                        onClick={e => {
                          if (localState.children && localState.children.length === 1) {
                            const [template] = localState.children;
                            template && template.children && setSelectedTemplate(template.children);
                            let role = getRole(template.children);
                            setSendUnit(template.sendUnit);
                            setAllowSendToUnit(template.allowSendToUnit);
                            setNextRole(role);
                            setOpenAsignProcessor(true);
                            setProcessType('any');
                          }
                        }}
                      >
                        Chuyển tùy chọn
                      </MenuItem>
                    )}
                    {item.children &&
                      item.children.length > 0 &&
                      item.children.map(i => (
                        <MenuItem
                          value="item.code"
                          onClick={e => {
                            setSelectedTemplate(i);
                            setOpenAsignProcessor(true);
                            setRoleForProcess(i && i.code);
                            setProcessType('flow');
                          }}
                        >
                          Chuyển cho {i.name}
                        </MenuItem>
                      ))}
                    {item.children &&
                      item.children.length === 0 && (
                        <MenuItem
                          value="item.code"
                          onClick={e => {
                            setSelectedTemplate(item);
                            setOpenAsignProcessor(true);
                            setRoleForProcess(item && item.code);
                          }}
                        >
                          Chuyển cho {item && item.name}
                        </MenuItem>
                      )}
                  </>
                ))}
            </Menu>

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
          </div>
        }
        // onSubmit={onSave}
      />
      <Grid item xs={8} style={{ marginBottom: 10 }}>
        <Tabs onChange={handleChangeTab} value={tab} variant="scrollable">
          {TABS && TABS.map(tab => <Tab key={`${tab.value + tab.label}`} value={tab.value} label={tab.label} />)}
        </Tabs>
      </Grid>
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
                          value={localState.bookDocumentId && localState.bookDocumentId.name}
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
                        <CustomInputBase
                          label={name2Title.receiverUnit}
                          name="receiverUnit"
                          value={localState.receiverUnitName}
                          disabled
                          className="setCustomInput"
                        />
                        {/* <Department
                          labelDepartment={name2Title.receiverUnit}
                          department={localState.receiverUnit}
                          disableEmployee
                          profile={profile}
                          moduleCode="IncommingDocument"
                        /> */}
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
                          // disabled={(id ? (localState.isAnyDepartment ? false : true) : false) && isDocOut}
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
                      <CustomGroupInputField code={code} columnPerRow={3} value={localState.others} disabled autoDown />

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
                    reload={reload}
                    isAuthory={isAuthory}
                    // viewOnly={currentTab !== 0 }
                    viewOnly={
                      isProcessorsAuthor || isCommanders || isCommandersAuthor || isProcessors
                        ? false
                        : // : isProcesseds ||
                          isProcessedsComment ||
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
                    feedbackTab={props.location && props.location.tabList === 'feedback' ? true : false}
                    prevSender={localState && localState.proposer}
                    // voice
                    showRecorder
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
                                              <TableCell align="center">{handleRenderNameReceiver(item)}</TableCell>
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

          {/* <Grid container spacing={8}>

          </Grid> */}
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
          addChildTask
          disableOneEdit
          disableImport
          perPage={10}
          filter={{
            incommingDocuments: id,
          }}
          onRowClick={item =>
            props.history.push({
              pathname: `/Task/task-detail/${item._id}`,
              link: props.location && props.location.pathname,
            })
          }
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
      {tab === 'outGoingDocument' ? (
        <ListPage
          filterStartEnd="documentDate"
          withPagination
          disableAdd
          apiUrl={`${API_GOING_DOCUMENT}`}
          code="OutGoingDocument"
          selectMultiple={false}
          kanban="ST25"
          kanbanKey="type"
          noKanban
          disableEmployee
          showDepartmentAndEmployeeFilter
          clickToView
          employeeFilterKey="createdBy"
          codeStatus="1"
          disableOneEdit
          disableImport
          mapFunction={mapFunction}
          filter={{
            incommingDocumentId: id,
          }}
          onRowClick={item =>
            props.history.push({
              pathname: `/OutGoingDocument/editGoDocuments/${item._id}`,
              link: props.location && props.location.pathname,
            })
          }
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
        childCommander={localState && localState.childrenCommander ? localState.childrenCommander : []}
        childCommanderSupport={localState && localState.childrenCommanderSupport ? localState.childrenCommanderSupport : []}
        currentRole={roleForProcess ? roleForProcess : nextRole}
        role={role}
        onChangeSnackbar={props.onChangeSnackbar}
        sendUnit={sendUnit}
        allowSendToUnit={allowSendToUnit}
        roleDirection={roleDirection}
      />

      <DocumentSetCommanders
        open={openSetCommanders}
        isAuthory={isAuthory}
        docIds={selectedDocs}
        onClose={handleClose}
        consult={role !== 'feedback' ? consult : ''}
        roleGroupSource={roleGroupSource}
        processType={processType}
        onSuccess={() => {
          setOpenSetCommanders(false);
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/IncommingDocument');
          }
        }}
        onChangeSnackbar={props.onChangeSnackbar}
        profile={profile}
      />
      <ReturnDocs
        open={openReturnDocs}
        docIds={selectedDocs}
        type={returnDocType}
        processeds={localState ? localState.processeds : []}
        role={role}
        data={localState}
        currentRole={currentRole}
        template={localState.template ? [localState.template] : templates}
        childTemplate={localState.children ? [...localState.children] : []}
        onClose={handleClose}
        onSuccess={() => {
          setOpenReturnDocs(false);
          setTypeFlow();
          if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/IncommingDocument');
          }
        }}
        onChangeSnackbar={props.onChangeSnackbar}
        typeFlow={typeFlow}
      />
      <CompleteDocs
        open={openComplete}
        docIds={selectedDocs}
        isAuthory={isAuthory}
        flagFlashComplete={flagFlashComplete}
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
          }}
        >
          Xuất biểu mẫu
        </MenuItem>
        {(role !== 'supporters' &&
          role !== 'viewers' &&
          !(role === 'feedback' && currentTab === 0) && (
            <MenuItem
              value="any"
              onClick={e => {
                setHandleDialogReturnItem(true);
                props.history.valueId = localState._id;
                props.history.valueCode = localState.toBookCode;
                props.history.push(`/Task/add?docId=${localState._id}&toBookCode=${localState.toBookCode}&docSeen=${localState._id}`);
              }}
            >
              Tạo hồ sơ công việc
            </MenuItem>
          )) ||
          null}
        {(role !== 'supporters' &&
          role !== 'viewers' &&
          !(role === 'feedback' && currentTab === 0) && (
            <MenuItem
              value="any"
              onClick={e => {
                // setHandleDialogReturnItem(true)
                setAddTask(true);
              }}
            >
              Hồ sơ công việc liên quan
            </MenuItem>
          )) ||
          null}
        {console.log(role, currentTab, canDeadlineIncrease, 'canDeadlineIncrease')}
        {((currentTab === 4 || currentTab === 0) &&
          (role === 'processors' || role === 'commander') &&
          canDeadlineIncrease && (
            <MenuItem
              value="any"
              onClick={e => {
                setDialogHanle(true);
              }}
            >
              Gia hạn xử lý
            </MenuItem>
          )) ||
          null}
        {currentTab == 4 &&
          canAddMoreProcessor &&
          role !== 'supporters' &&
          role !== 'viewers' &&
          role !== 'feedback' &&
          !typeDocOfItem && (
            <MenuItem
              value="any"
              onClick={e => {
                setAddHandleDialog(true);
                // handleClose()
              }}
            >
              Thêm xử lý
            </MenuItem>
          )}

        {currentTab == 4 &&
          role !== 'supporters' &&
          role !== 'viewers' &&
          role !== 'feedback' &&
          checkRecallDocs && (
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

      {addTask && (
        <Dialog
          onSave={() => onSaveAddTask()}
          maxWidth="md"
          fullWidth
          open={addTask}
          disableSave={disableSave}
          onClose={() => {
            setAddTask(false);
          }}
          aria-labelledby="form-dialog-title1"
        >
          <TaskDocs
            setDisaleSave={status => {
              setDisaleSave(status);
            }}
            getDataTask={value => {
              let newData = idAddTask;
              value.map(item => newData.push(item._id));
              setIdAddTask(newData);
            }}
            menuAction={true}
          />
        </Dialog>
      )}

      <AddHandleDialog
        open={addHandleDialog}
        docIds={selectedDocs}
        currentRole={currentRole}
        onClose={() => {
          setAddHandleDialog(false);
        }}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setAddHandleDialog(false);
          console.log('Thêm xử lý xong nè: ');
          setReload(new Date()*1)
          // props.goBack ? props.goBack() : props.history.goBack();
        }}
        profileAuthority={isAuthory ? props.editExecutiveDocuments && props.editExecutiveDocuments.profileAuthority : null}
        isAuthory={isAuthory}
        role={role}
        currentChild={localState.children}
        currentChildSP={localState.childrenSupport}
        currentPreChild={localState.preChildren}
        currentProcesseds={localState.processeds}
        typeDocOfItem={typeDocOfItem ? 'preliminaryDoc' : 'roomDoc'}
      />
      {/* gia hạn xử lý */}
      <Dialog dialogAction={false} onClose={() => setDialogHanle(false)} open={dialogHanle} maxWidth="sm">
        <ExtendHanleDialog
          onClose={() => setDialogHanle(false)}
          onChangeSnackbar={onChangeSnackbar}
          onSuccess={() => {
            setReload(new Date()*1)
            setDialogHanle(false)
            // closeHanleDate();
            // getData();
            // props.handleReload && props.handleReload();
            // props.goBack ? props.goBack() : props.history.goBack();
          }}
          item={{ ...localState, originItem: { ...localState } }}
        />
      </Dialog>
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
