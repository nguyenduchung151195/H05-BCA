// ExecutiveDocuments

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SwipeableDrawer } from '../../components/LifetekUi';
import Buttons from 'components/CustomButtons/Button';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import * as docx from 'docx-preview';
import { mergeData, UpdateStatusAct } from './actions';
import { mergeData as mergeDataEdit } from '../EditExecutiveDocuments/actions';

import makeSelectExecutiveDocuments from './selectors';
import reducer from './reducer';
import saga from './saga';
import request from 'utils/request';
import iconHoatoc from '../../assets/img/icons/iconHoatoc.svg';
import { Grid, Tooltip, withStyles, FormControlLabel, Checkbox } from '@material-ui/core';
import {
  API_INCOMMING_DOCUMENT,
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_INCOMMING_DOCUMENT_COUNT,
  API_ROLE_APP,
  UPLOAD_APP_URL,
  orderHidden,
} from '../../config/urlConfig';
import EditExecutiveDocuments from '../EditExecutiveDocuments';
import ViewExecutiveDocuments from '../ViewExecutiveDocuments';
import { CloudDownload, RotateLeft, RotateRight } from '@material-ui/icons';
import { Paper as PaperUI } from 'components/LifetekUi';
import { makeSelectMiniActive, makeSelectProfile } from '../Dashboard/selectors';
import DocumentAssignModal from 'components/DocumentAssignModal';
import DocumentSetCommanders from 'components/DocumentAssignModal/SetCommanders';
import ReturnDocs from 'components/DocumentAssignModal/ReturnDocs';
import ReturnDocsEx from 'components/DocumentAssignModal/ReturnDocsEx';
import { Dialog } from 'components/LifetekUi';
import { Dialog as DialogMui, DialogTitle, DialogActions, DialogContent, Button } from '@material-ui/core';
import { changeSnackbar } from '../Dashboard/actions';
import _ from 'lodash';
import { getListData } from '../../utils/common';
import { fetchData } from '../../helper';
// import styles from './styles';
import moment from 'moment';
import { clientId } from '../../variable';
import XLSX from 'xlsx';
import './index.css';
import RoleTabs from '../../components/RoleTabs';
import WrapperListPage from '../../components/WrapperListPage';
import { getShortNote } from '../../utils/functions';

function Bt(props) {
  return (
    <Buttons
      // color={props.tab === tab ? 'gradient' : 'simple'}
      color={props.color}
      right
      round
      size="sm"
      onClick={props.onClick}
    >
      {props.children}
    </Buttons>
  );
}

function ExecutiveDocuments(props) {
  const FILES = ['xlsx', 'xls', 'docx', 'pdf', 'doc'];
  const customContent = [
    {
      title: 'Số đến',
      fieldName: 'toBookCode',
      type: 'string',
    },
    {
      title: 'Số VB',
      fieldName: 'toBook',
      type: 'string',
    },
    {
      title: 'Trích yếu',
      fieldName: 'abstractNote',
      type: 'string',
    },
  ];
  const contentKanbanTemplate = [
    {
      title: 'Số đến',
      fieldName: 'toBookCode',
      type: 'string',
    },
    {
      title: 'Số VB',
      fieldName: 'toBook',
      type: 'string',
    },
    {
      title: 'Trích yếu',
      fieldName: 'abstractNote',
      type: 'string',
    },
  ];
  const { mergeData, mergeDataEdit, executiveDocuments, miniActive, onChangeSnackbar, profile } = props;
  const { tab, reload, kanbanFilter } = executiveDocuments;
  let show = document.getElementById('show');

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const [openAsignProcessor, setOpenAsignProcessor] = useState(false);
  const [openCommandersDiaLog, setOpenSetCommandersDiaLog] = useState(false);
  const [openSetCommanders, setOpenSetCommanders] = useState(null);
  const [view, setView] = useState(false);
  const [roleGroupSource, setRoleGroupSource] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [openReturnDocs, setOpenReturnDocs] = useState(false);
  const [rootTab, setRootTab] = useState(localStorage.getItem('IncommingDocumentTab'));
  const [oldRootTab, setOldRootTab] = useState(localStorage.getItem('IncommingDocumentTab'));

  const [reloadPage, setReloadPage] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(JSON.parse(localStorage.getItem('IncommingDocumentProcess')));

  const [openDialog, setOpenDialog] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  // return doc
  const [openDialogResponse, setOpenDialogResponse] = useState(null);
  const [returnDocType, setReturnDocType] = useState('');
  const [processedsReturnDoc, setProcessedsReturnDoc] = useState([]);

  const [localState, setLocalState] = useState({});
  const [businessRole, setBusinessRole] = useState({});
  const [openPreview, setOpenPreview] = useState(false);
  const [selectUrl, setSelectedUrl] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [canView, setCanView] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(null);
  const nameCallBack = 'receive';
  const requestURL = API_INCOMMING_DOCUMENT_COUNT;
  const [lands, setLands] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [businessRoleSelect, setBusinessRoleSelect] = useState([]);
  const [selected, setSelected] = useState([]);
  const [nextRole, setNextRole] = useState(null);
  const [roleForProcess, setRoleForProcess] = useState(null);
  const [selectedDocData, setSelectedDocData] = useState(null);
  const [infoEmployee, setInfoEmployee] = useState({});
  const [finalChild, setFinalChild] = useState([]);

  const [openDialogSupport, setOpenDialogSupport] = useState(null);
  // processType
  const [processType, setProcessType] = useState('');
  const [listFlow, setListFlow] = useState([]);
  const [resetSelect, setResetSelect] = useState(true);
  const [ok, setOk] = useState(false);
  const [openDialogReturn, setOpenDialogReturn] = useState(false);

  // open Dialog menu
  const [openDialogCommand, setOpenDialogCommand] = useState(null);
  const docxOptions = Object.assign(docx.defaultOptions, {
    debug: true,
    experimental: true,
  });
  const [checkOrg, setCheckOrg] = useState(false);
  const [roleDirection, setRoleDirection] = useState('');
  const [sendUnit, setSendUnit] = useState('');
  const [allowSendToUnit, setAllowSendToUnit] = useState('');

  const [consult, setConsult] = useState('');
  const [unit, setUnit] = useState('');
  const [checkDocument, setCheckDocument] = useState(false);
  const [roleDepartment, setRoleDepartment] = useState([]);
  const [typeFlow, setTypeFlow] = useState({});
  const [openDialogViewer, setOpenDialogViewer] = useState(false);
  const [disablebtnView, setDisablebtnView] = useState(false);

  const [roleGroups, setRoleGroups] = useState(localStorage.getItem('roleGroups') ? JSON.parse(localStorage.getItem('roleGroups')) : {});

  const [listUrgencyLevel, setListUrgencyLevel] = useState();

  // useEffect(() => {

  //   return () => {
  //     localStorage.removeItem('IncommingDocumentTab')
  //   }
  // }, []);
  useEffect(() => {
    const listData = localStorage.getItem('crmSource') ? JSON.parse(localStorage.getItem('crmSource')) : [];
    let data = listData.find(it => it.code === 'S20');
    data = data && data.data ? data.data : [];
    setListUrgencyLevel(data);
  }, []);
  useEffect(
    () => {
      localStorage.setItem('IncommingDocumentTab', rootTab);
    },
    [rootTab],
  );

  useEffect(
    () => {
      if (_.get(selectedProcess, '_id')) {
        setLands(_.get(selectedProcess, 'group'));
      } else {
        setLands([]);
        localStorage.setItem('IncommingDocumentProcess', JSON.stringify([]));
      }
    },
    [selectedProcess],
  );

  // Load ra html
  const loadDocx = useCallback(
    (file, container) => {
      if (!file) return;
      docx.renderAsync(file, container, null, docxOptions).then(function (x) { });
    },
    [docxOptions, view],
  );

  // Xử biến đổi url -> file
  useEffect(
    () => {
      let container = document.getElementById('docx-container');
      if (filePreview) {
        fetch(filePreview).then(async res => {
          if (res) {
            let blob = await res.blob();
            let file = blob && new File([blob], 'new_file');
            if (file) {
              loadDocx(file, container);
            }
          }
        });
      }
    },
    [view],
  );

  // Xử lý load ra lại DOM
  useEffect(
    () => {
      if (selectUrl === 'docx' || selectUrl === 'doc') {
        let timer = setTimeout(() => {
          setView(filePreview ? true : false);
        }, 500);
        return () => {
          clearTimeout(timer);
        };
      }
    },
    [selectUrl, filePreview],
  );

  const getValueTabByRole = value => {
    switch (value) {
      case 'receive':
      case 'feedback':
        return value;
      case 'processing':
        return 'processors';
      case 'support':
      case 'view':
        let newValue = `${value}ers`;
        return newValue;
      case 'command':
        return 'commander';
    }
  };
  useEffect(() => {
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack');
    localStorage.removeItem('addWorkingScheduleCallback');
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');
    if (props.profile && props.profile._id) {
      fetchData(`${API_ROLE_APP}/IncommingDocument/${props.profile._id}`).then(res => {
        const newBusinessRole = {};
        const { roles } = res;
        const code = 'BUSSINES';

        const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
        setAllRoles(foundRoleDepartment);
        if (foundRoleDepartment) {
          const { data } = foundRoleDepartment;
          setRoleDepartment(data);
          mergeDataEdit({ roleDepartment: data });
          let check = false;
          if (data) {
            data.forEach(d => {
              newBusinessRole[d.name] = d.data.view;
              newBusinessRole[`${d.name}_return_docs`] = d.data.returnDocs;
              if (!check && d.data.view) {
                check = true;
              }
            });
          }
        }
        if (typeof rootTab !== 'string') {
          let roleArr = (newBusinessRole && Object.keys(newBusinessRole).filter(f => f && !f.includes('_') && newBusinessRole[f])) || [];
          if (roleArr.length > 0) {
            if (props.location && props.location.tabs) {
              setRootTab('findStatistics');
            } else {
              setRootTab(getValueTabByRole(roleArr[0]));
            }
            mergeData({ tab: 0 });
          }
        }

        setBusinessRole(newBusinessRole);
      });
    }
    mergeData({ tab: tab });
    setCanView(false);
  }, []);

  useEffect(
    () => {
      if (allRoles && profile && rootTab) {
        let newCurrRole = '';
        if (rootTab === 'receive') {
          newCurrRole = 'receive';
        }
        if (rootTab === 'processors') {
          newCurrRole = 'processing';
        }
        if (rootTab === 'supporters') {
          newCurrRole = 'support';
        }
        if (rootTab === 'viewers') {
          newCurrRole = 'view';
        }
        if (rootTab === 'commander') {
          newCurrRole = 'command';
        }
        if (rootTab === 'feedback') {
          newCurrRole = 'feedback';
        }

        const newBusinessRole = (allRoles && allRoles.data && allRoles.data.find(a => a.name === newCurrRole)) || {};
        setBusinessRoleSelect(newBusinessRole && newBusinessRole.data);
      }
    },
    [allRoles, profile, rootTab],
  );

  useEffect(
    () => {
      if (selectedDocs.length > 0) {
        setInfoEmployee({});
        getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/inCommingDocument`, {}, onChangeSnackbar).then(res => {
          if (res) {
            setTemplates([{ ...res }]);
          } else {
            onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng dự thảo', status: true });
          }
        });
        let [id] = selectedDocs;
        fetch(`${API_INCOMMING_DOCUMENT}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            if (data) {
              setProcessedsReturnDoc(data.processeds);
              if (data && data.dataCheck && rootTab === 'processors') {
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
                // const finalData = flag ? newData : children
                setInfoEmployee(data);
              } else {
                setInfoEmployee(data);
              }
              if (data.children && Array.isArray(data.children) && data.children.length > 0) {
                setConsult(data.children[0].consult || null);
              }

              // setNextRole(data.nextRole);
              // check 11
            }
          });
      } else setConsult(null);
    },
    [selectedDocs],
  );

  useEffect(
    () => {
      setCanView(false);
      setInfoEmployee({});
    },
    [tab],
  );

  useEffect(
    () => {
      if (infoEmployee.children && infoEmployee.children.length > 0 && selectedTemplate) {
        setRoleForProcess(selectedTemplate.code);
      }
    },
    [selectedTemplate, infoEmployee],
  );

  useEffect(() => {
    fetch(`${requestURL}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setLocalState(data);
      });
  }, []);
  const handleChangeTab = (event, newValue) => {
    handleClose();
    mergeData({ tab: 0 });
    const oldTab = localStorage.getItem('IncommingDocumentTab');
    if (newValue !== oldTab && oldTab !== null) {
      setCanView(false);
      setInfoEmployee({});
    }
    setOldRootTab(newValue);
    setRootTab(newValue);
    setResetSelect(!resetSelect);
  };

  // const checkShowReturn = () => {
  //   if (rootTab === 'receive') return false;
  //   if (rootTab === 'processors') {
  //     return businessRole && businessRole.processing_return_docs;
  //   }
  //   if (rootTab === 'supporters') {
  //     return businessRole && businessRole.support_return_docs;
  //   }
  //   if (rootTab === 'viewers') {
  //     return businessRole && businessRole.view_return_docs;
  //   }
  //   if (rootTab === 'commander') {
  //     return businessRole && businessRole.command_return_docs;
  //   }
  //   if (rootTab === 'feedback') {
  //     return businessRole && businessRole.feedback_return_docs;
  //   }
  // };
  const checkShowReturn = () => {
    if (rootTab === 'receive') return false;
    else if (rootTab === 'processors') {
      return businessRole && businessRole.processing_return_docs;
    } else if (rootTab === 'commander') {
      return businessRole && businessRole.command_return_docs;
    }
    return false;
  };
  const reloadState = () => {
    fetch(`${requestURL}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setLocalState(data);
      });
    // setCanView(false)
    setReloadPage(new Date() * 1);
  };

  const openTitleDialog = (id, role, tab, typeDoc) => {
    switch (tab) {
      case 0:
      case 4:
      case 5:
      case 6:
      case 11:
        switch (role) {
          case 'receive':
            handleOpenEditExecutiveDocumentsDialog(id);
            return;
          case 'viewReceive':
          case 'viewUncomplete':
          case 'viewCommander':
          case 'viewSupporters':
            handleOpenViewExecutiveDocumentsDialog(id);
            return;
        }
    }
    localStorage.setItem('IncommingDocumentProcess', JSON.stringify(selectedProcess));
    let type = typeDoc ? 1 : 0;
    props.history.push(`incomming-document-detail/${id}?role=${role}&tab=${tab}&typeDoc=${type || 0}`);
  };

  const openTitleDialogCustom = (id, role, tab) => {
    switch (role) {
      case 'viewReceive':
        handleOpenViewExecutiveDocumentsDialog(id);
        return;
    }
    localStorage.setItem('IncommingDocumentProcess', JSON.stringify(selectedProcess));
    props.history.push(`incomming-document-detail/${id}?role=${role}&tab=${tab}`);
  };
  const handleOpenEditExecutiveDocumentsDialog = useCallback(id => {
    setOpenEditDialog(true);
    setSelected(id);
  }, []);

  const handleCloseEditExecutiveDocumentsDialog = useCallback(() => {
    setOpenEditDialog(false);
    setSelected(null);
  }, []);

  // view
  const handleOpenViewExecutiveDocumentsDialog = useCallback(id => {
    setOpenViewDialog(true);
    setSelected(id);
  }, []);
  const handleCloseViewExecutiveDocumentsDialog = useCallback(() => {
    setOpenViewDialog(false);
    setSelected(null);
  }, []);
  const callBack = (cmd, data) => {
    switch (cmd) {
      case 'kanban-dragndrop-receive': {
        props.onUpdate(data);
        break;
      }
      case 'quick-add': {
        props.history.push('/IncommingDocument/add');
        break;
      }
      default:
        break;
    }
  };
  const getExtensionFile = name => {
    let ext = name.split('.');
    return ext[ext.length - 1];
  };

  const mapFunction = item => {
    const kanbanStt = JSON.parse(localStorage.getItem('crmStatus'));
    const kanbanSttDatas = kanbanStt && kanbanStt.find(item => item.code === 'ST21');
    const kanbanSttData = kanbanSttDatas ? kanbanSttDatas.data : [];
    const customKanbanStt = data => {
      const data1 = kanbanSttData && kanbanSttData.find(item => item.type === data);
      return data1 ? data1.name : 'Không xác định';
    };
    const customDate = data => {
      if (data) {
        const times = Number(moment(item.deadline).endOf('day') - moment()) / 86400000;
        if (times < 0) {
          return <p style={{ textAlign: 'left', color: '#e13a3a', wordBreak: 'break-all' }}>{getShortNote(data, 150)}</p>;
        } else if (times > 0 && times < 3 && item.deadline) {
          return (
            <p
              style={{
                textAlign: 'left',
                wordBreak: 'break-all',
              }}
            >
              {getShortNote(data, 150)}
            </p>
          );
        } else {
          return <p style={{ textAlign: 'left', color: '#3e9bfa', wordBreak: 'break-all' }}>{getShortNote(data, 150)}</p>;
        }
      }
    };
    const renderIconDoKhan = (urgencyLevelCode = '') => {
      // listUrgencyLevel
      // let  codeUrgencyLevel = listUrgencyLevel.find(it=> it.title === urgencyLevel)
      // codeUrgencyLevel = codeUrgencyLevel && codeUrgencyLevel.value || ""
      switch (urgencyLevelCode) {
        case 'Aha-tc':
          // màu đỏ
          return (
            <img
              src={iconHoatoc}
              width="10"
              height="10"
              style={{ filter: 'invert(9%) sepia(92%) saturate(6525%) hue-rotate(0deg) brightness(117%) contrast(98%)', marginRight: 10 }}
            />
          );
        case 'Bthng-khn':
          // cam
          return (
            <img
              src={iconHoatoc}
              width="10"
              height="10"
              style={{ filter: 'invert(52%) sepia(63%) saturate(5505%) hue-rotate(16deg) brightness(90%) contrast(88%)', marginRight: 10 }}
            />
          );
        case 'Ckhn':
          // vàng
          return (
            <img
              src={iconHoatoc}
              width="10"
              height="10"
              style={{ filter: 'invert(71%) sepia(100%) saturate(556%) hue-rotate(6deg) brightness(105%) contrast(96%)', marginRight: 10 }}
            />
          );
        default:
          return '';
      }
    };
    return {
      ...item,
      documentDate: customDate(item.documentDate),
      toBook: customDate(item.toBook),
      senderUnit: customDate(item.senderUnit),
      // abstractNote: customDate(getShortNote(item.abstractNote, 150)),
      abstractNote: !item.abstractNote ? (
        ''
      ) : item.abstractNote.length < 150 ? (
        customDate(getShortNote(item.abstractNote, 150))
      ) : (
        <>
          <Tooltip title={item.abstractNote} placement="bottom-start" style={{ maxWidth: 800 }}>
            {customDate(getShortNote(item.abstractNote, 150))}
          </Tooltip>
        </>
      ),

      name: customDate(item.name),
      secondBook: customDate(item.secondBook),
      receiverUnit: customDate(item.receiverUnit),
      toBookCode: customDate(item.toBookCode),
      kanbanStatus: customDate(customKanbanStt(item.kanbanStatus)),
      documentType: customDate(item.documentType),
      documentField: customDate(item.documentField),
      receiveMethod: customDate(item.receiveMethod),
      privateLevel: customDate(item.privateLevel),
      // urgencyLevel: customDate(item.urgencyLevel),
      urgencyLevel: (
        <p style={{ textAlign: 'left', wordBreak: 'break-all', display: 'flex' }}>
          {renderIconDoKhan(item.urgencyLevelCode)}
          {customDate(item.urgencyLevel)}
        </p>
      ),

      signer: customDate(item.signer),
      processStatus: customDate(item.processStatus),
      currentNote: customDate(item.currentNote),
      currentRole: customDate(item.currentRole),
      nextRole: customDate(item.nextRole),
      letterType: customDate(item.letterType),
      processors: customDate(item.processors),
      processeds: customDate(item.processeds),
      createdBy: customDate(item.createdBy),
      stage: customDate(item.stage),
      currentNote: customDate(item.currentNote ? item.currentNote : ''),
      receiveDate: customDate(item.receiveDate),
      toBookDate: customDate(moment(item.toBookDate).format('DD/MM/YYYY')),
      deadline: item.deadline && moment(item.deadline).isValid() ? customDate(moment(item.deadline).format('DD/MM/YYYY')) : '',
      // item.deadline === 'Invalid date'
      //   ? ''
      //   : customDate(moment(item.deadline).format('DD/MM/YYYY')).props.children === 'Invalid date'
      //     ? customDate(item.deadline)
      //     : customDate(moment(item.deadline).format('DD/MM/YYYY')),
      files: item.originItem.files ? (
        <>
          {item.originItem.files.map(f => (
            <div
              onClick={e => {
                let extension = f.name && getExtensionFile(f.name);
                e.stopPropagation();
                setOpenPreview(true);
                if (extension && FILES.indexOf(extension) === -1) {
                  setSelectedUrl(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${f.id}`);
                }
                if (FILES.indexOf(extension) !== -1) {
                  setSelectedUrl(extension);
                  setFilePreview(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${f.id}`);
                }
              }}
            >
              {f.name}{' '}
            </div>
          ))}
        </>
      ) : (
        ''
      ),
    };
  };

  const handleClose = e => {
    // setCanView(false);
    setOpenDialog(null);
    setOpenDialogResponse(null);
    setOpenDialogSupport(null);
    setOpenDialogReturn(false);
    setOpenDialogCommand(null);
    setFinalChild([]);
    setReturnDocType('');
    setOpenReturnDocs(false);
    setOpenAsignProcessor(false);
    setOpenSetCommandersDiaLog(false);
    setOpenSetCommanders(false);
  };

  const handleOpen = (e, type, isReturn = false) => {
    if (type === 'command') {
      setOpenSetCommanders(e.currentTarget);
    } else {
      if (type !== 'supporters' && type !== 'commander') {
        if (isReturn === false) {
          setOpenDialog(e.currentTarget);
          return;
        }
        if (isReturn) {
          setOpenDialogResponse(e.currentTarget);
          return;
        }
      }
      if (type === 'supporters') {
        setOpenDialogSupport(e.currentTarget);
      }
      if (type === 'commander' && isReturn === false) {
        setOpenDialogCommand(e.currentTarget);
      }
      if (type === 'commander' && isReturn) {
        setOpenDialogResponse(e.currentTarget);
      }
    }
  };
  const handleOpenDialogReturn = (e, type) => {
    setOpenDialogReturn(true);
  };

  const handleSelectedDoc = (docIds, val) => {
    setSelectedDocs(docIds);
    setSelectedDocData(val && val[0] ? val[0] : null);
  };
  const handle = (docIds, val) => {
    if (docIds || val) {
      setOk(true);
    } else {
      setOk(false);
    }
  };

  const handleSetCurrentRole = currentRole => {
    setCurrentRole(currentRole);
  };

  const handleSetProcessed = processeds => {
    setProcessedsReturnDoc(processeds);
  };
  const handleSetSelectProcess = value => {
    setSelectedProcess(value);
  };

  const handleOpenDialogDoc = (bool, type, direction) => {
    if (type === 'assign') {
      setOpenAsignProcessor(bool);
    } else {
      setOpenReturnDocs(bool);
      setReturnDocType(type);
    }
    setTypeFlow(direction);
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
  const checkChildren = (obj, list) => {
    let listFloww = list;
    obj.forEach(subObj => {
      listFloww.push(subObj);
      if (subObj.hasOwnProperty('children') && subObj.children instanceof Array && subObj.children.length > 0) {
        checkChildren(subObj.children, listFloww);
      }
    });
    setListFlow([listFloww]);
  };
  const handleSelectTemplate = (bool, template, type) => {
    if (templates[0].children) checkChildren([...templates[0].children], []);
    else checkChildren([], []);
    if (Array.isArray(template) && template.length > 0 && template[0].sendUnit) setSendUnit(template[0].sendUnit);
    else if (template.sendUnit) setSendUnit(template.sendUnit);
    else {
      setSendUnit('');
    }
    if (Array.isArray(template) && template.length > 0 && template[0].allowSendToUnit) setAllowSendToUnit(template[0].allowSendToUnit);
    else if (template.allowSendToUnit) setAllowSendToUnit(template.allowSendToUnit);
    else {
      setAllowSendToUnit('');
    }

    if (Array.isArray(template) && template.length > 0 && template[0].checkOrg) {
      setCheckOrg(template[0].checkOrg);
    } else {
      setCheckOrg(template.checkOrg || false);
    }

    if (Array.isArray(template) && template.length > 0 && template[0].roleDirection) setRoleDirection(template[0].roleDirection);
    else if (template.roleDirection) setRoleDirection(template.roleDirection);
    else {
      setRoleDirection('');
    }

    if (Array.isArray(template) && template.length > 0 && template[0].unit) setUnit(template[0].unit);
    else if (template.unit) setUnit(template.unit);
    else {
      setUnit('');
    }
    if (type !== 'any') {
      setNextRole(template.code);
      setSelectedTemplate(template);
      setOpenAsignProcessor(bool);

      setProcessType('flow');
    }
    if (type === 'any') {
      let role = getRole(template);
      setProcessType('any');
      setNextRole(role);
      if (rootTab === 'processors') setSelectedTemplate(listFlow);
      else if (rootTab === 'receive') {
        setSelectedTemplate([]);
        setNextRole(null);
      } else template[0] && template[0].children && setSelectedTemplate(template[0].children);
      setOpenAsignProcessor(bool);
    }
  };
  const handleSelectTemplateYk = (bool, template, type) => {
    checkChildren([...templates[0].children], []);
    if (Array.isArray(template) && template.length > 0 && template[0].sendUnit) setSendUnit(template[0].sendUnit);
    else if (template.sendUnit) setSendUnit(template.sendUnit);
    else {
      setSendUnit('');
    }
    if (Array.isArray(template) && template.length > 0 && template[0].checkOrg) setCheckOrg(template[0].checkOrg);
    else if (template.checkOrg) setCheckOrg(template.checkOrg);
    if (Array.isArray(template) && template.length > 0 && template[0].sendUnit) setAllowSendToUnit(template[0].allowSendToUnit);
    else if (template.allowSendToUnit) setAllowSendToUnit(template.allowSendToUnit);
    else {
      setAllowSendToUnit('');
    }
    if (Array.isArray(template) && template.length > 0 && template[0].unit) setRoleDirection(template[0].unit);
    else if (template.unit) setUnit(template.unit);
    else {
      setUnit('');
    }
    if (Array.isArray(template) && template.length > 0 && template[0].roleDirection) setRoleDirection(template[0].roleDirection);
    else if (template.roleDirection) setRoleDirection(template.roleDirection);
    else {
      setRoleDirection('');
    }
    if (type !== 'any') {
      setNextRole(template.code);
      setRoleGroupSource(template.code);
      setSelectedTemplate(template);
      setOpenSetCommandersDiaLog(bool);

      setProcessType('flow');
    }
    if (type === 'any') {
      let role = getRole(template);
      setProcessType('any');
      setNextRole(role);
      if (rootTab === 'processors') setSelectedTemplate(listFlow);
      else template[0] && template[0].children && setSelectedTemplate(template[0].children);
      setOpenSetCommandersDiaLog(bool);
    }
  };

  const findNode = (templates, child, count) => {
    let d = count;
    templates.map(temp => {
      if (temp.children) {
        if (child) {
          let [item] = child;
          let index = item && temp && temp.children && temp.children.findIndex(f => f && f.idTree == item.idTree);
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

  const handleSelectReturnTemplate = (bool, template, type) => {
    setSelectedTemplate(template);
    setReturnDocType(type);
    infoEmployee && infoEmployee.template && findNode([infoEmployee.template], template, 0);
  };

  useEffect(
    () => {
      if (finalChild && finalChild[0] && finalChild[0].code) {
        setCurrentRole(finalChild[0].code);
      }
    },
    [finalChild, returnDocType],
  );

  const OpenExecutiveDocumenDialog = () => {
    props.history.push('/IncommingDocument/add');
  };

  const handleRotate = type => {
    if (type === 'left') {
      if (rotation > 0) {
        setRotation(r => r - 90);
      }
      if (rotation === 0) {
        setRotation(360);
      }
    }

    if (type === 'right') {
      if (rotation >= 0) {
        setRotation(r => r + 90);
      }
      if (rotation === 360) {
        setRotation(0);
      }
    }
  };
  const getStateSelection = e => {
    Array.isArray(e) && e.length > 0 ? setCanView(true) : setCanView(false);
  };

  const displayFileExcel = async f => {
    let reader = new FileReader();
    let file;
    await fetch(f).then(async response => (file = await response.blob()));
    reader.readAsArrayBuffer(file);
    reader.onload = function (e) {
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

  const handlePdf = async (url, type) => {
    let blob = url && (await fetch(url).then(async data => await data.blob()));
    let typeFile;
    if (type === '.pdf') {
      typeFile = 'application/pdf';
    }

    var file = new Blob([blob], { type: typeFile });
    var fileURL = URL.createObjectURL(file);
    setPreviewHtml(fileURL);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewHtml(null);
    setFilePreview(null);
  };

  function downloadFile(url, fileName) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(this.response);
      const tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    };
    xhr.send();
  }

  let downloadImage = (url, fileName) => {
    let img = new Image();
    img.src = url;
    img.crossOrigin = 'anonymous';
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    // Wait till the image is loaded.
    img.onload = function () {
      rotateImage();
      saveImage(img.src);
    };

    let rotateImage = () => {
      // Create canvas context.
      // Assign width and height.
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.translate(canvas.width / 2, canvas.height / 2);

      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
    };
    let saveImage = () => {
      let a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.setAttribute('download', `${fileName}.jpg`);
      document.body.appendChild(a);
      a.click();
    };
  };

  useEffect(
    () => {
      if (openPreview && selectUrl === 'xlsx') {
        displayFileExcel(filePreview);
      }
      if (openPreview && selectUrl === 'pdf') {
        handlePdf(filePreview, '.pdf');
      }
    },
    [openPreview],
  );

  useEffect(
    () => {
      if (show && previewHtml !== '') {
        show.innerHTML = previewHtml;
      }
    },
    [previewHtml, openPreview],
  );
  useEffect(() => {
    // profile.type.includes('outlineDoc')
    if (profile && profile.type && profile.type.includes('outlineDoc')) {
      setCheckDocument(true)
    }
  }, [profile])
  const handleViewDoc = () => {
    // const url = isAuthory ? `${API_INCOMMING_DOCUMENT}/set-status?authority=true` : `${API_INCOMMING_DOCUMENT}/set-status`;

    const body = {
      action: 'Đã xem',
      docIds: selectedDocs,
      role: 'viewers',
    };
    request(`${API_INCOMMING_DOCUMENT}/set-status`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(() => {
        setDisablebtnView(false);
        setOpenDialogViewer(false);
        reloadState();
        setCanView(false);
      })
      .catch(() => {
        setDisablebtnView(false);
      });
  };
  return (
    <div>
      <div>
        <RoleTabs
          roles={businessRole}
          rolesByTab={businessRoleSelect}
          handleChangeTab={handleChangeTab}
          templates={templates}
          rootTab={rootTab}
          tab={tab}
          profile={profile}
          ok={ok}
          document={localState}
          checkShowReturn={checkShowReturn}
          canView={canView}
          openSetCommanders={openSetCommanders}
          openDialog={openDialog}
          data={infoEmployee}
          openDialogResponse={openDialogResponse}
          handleOpen={handleOpen}
          handleOpenDialogReturn={handleOpenDialogReturn}
          openDialogSupport={openDialogSupport}
          openDialogCommand={openDialogCommand}
          handleSelectReturnTemplate={handleSelectReturnTemplate}
          handleOpenDialogDoc={handleOpenDialogDoc}
          handleSelectTemplate={handleSelectTemplate}
          handleSelectTemplateYk={handleSelectTemplateYk}
          handleClose={handleClose}
          setOpenDialogViewer={setOpenDialogViewer}
          history={props.history}
          docData={selectedDocData}
          checkOrg={checkOrg}
          roleDirection={roleDirection}
          consult={consult}
          unit={unit}
          roleDepartment={roleDepartment}
        />
      </div>
      <PaperUI
        className="CustomPaperUI"
        style={{ zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px', maxWidth: '100vw' }}
      >
        <Grid container>
          {profile.type &&
            profile.type.includes('outlineDoc') && (
              <Grid item sm={profile.type && profile.type.includes('outlineDoc') ? 4 : 0} container>
                {rootTab === 'processors' && (
                  <>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={<Checkbox color="primary" checked={checkDocument} />}
                        onChange={() => setCheckDocument(!checkDocument)}
                        label="Văn bản sơ loại"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={<Checkbox color="primary" checked={!checkDocument} />}
                        onChange={() => setCheckDocument(!checkDocument)}
                        label="Văn bản của phòng"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          <Grid item sm={profile.type && profile.type.includes('outlineDoc') ? 8 : 12} style={{ justifyContent: 'flex-end', textAlign: 'right' }}>
            {/* {rootTab !== 'findStatistics' && (
              <Bt onClick={() => mergeData({ tab: 3 })} color={tab === 3 ? 'gradient' : 'simple'}>
                Bảng tự động hóa
              </Bt>
            )} */}
            {/* {(rootTab === 'receive' || rootTab === 'processors' || rootTab === 'supporters' || rootTab === 'viewers' || rootTab === 'commander') && (
              <Bt onClick={() => mergeData({ tab: 2 })} color={tab === 2 ? 'gradient' : 'simple'}>
                Luồng văn bản
              </Bt>
            )} */}

            {/* {rootTab !== 'findStatistics' && (
              <Bt onClick={() => mergeData({ tab: 1 })} color={tab === 1 ? 'gradient' : 'simple'}>
                Trạng thái
              </Bt>
            )} */}
            {rootTab === 'processors' || rootTab === 'supporters' || rootTab === 'commander' ? (
              <Bt onClick={() => mergeData({ tab: 5 })} color={tab === 5 ? 'gradient' : 'simple'}>
                {rootTab === 'commander' ? 'Đã hoàn thành' : 'Hoàn thành'}
              </Bt>
            ) : null}



            {rootTab === 'supporters' || rootTab === 'commander' ? (
              <Bt onClick={() => mergeData({ tab: 6 })} color={tab === 6 ? 'gradient' : 'simple'}>
                Chưa Hoàn thành
              </Bt>
            ) : null}

            {rootTab === 'processors' ? (
              <Bt onClick={() => mergeData({ tab: 11 })} color={tab === 11 ? 'gradient' : 'simple'}>
                Chưa Hoàn thành
              </Bt>
            ) : null}
            <Bt onClick={() => mergeData({ tab: 4 })} color={tab === 4 ? 'gradient' : 'simple'}>
              {rootTab === 'receive'
                ? ' Tra cứu'
                : rootTab === 'processors' || rootTab === 'supporters' || rootTab === 'viewers'
                  ? 'Đã xử lý'
                  : rootTab === 'commander'
                    ? 'Đã chỉ đạo'
                    : rootTab === 'feedback'
                      ? 'Đã cho ý kiến'
                      : ''}
            </Bt>
            <Bt onClick={() => mergeData({ tab: 10 })} color={tab === 10 ? 'gradient' : 'simple'}>
              {rootTab === 'receive' ? 'Phiếu xử lý' : ''}
            </Bt>
            {/* tiếp nhận nhận  nđb */}
            {/* {rootTab === 'receive' ? (
              <Bt onClick={() => mergeData({ tab: 5 })} color={tab === 5 ? 'gradient' : 'simple'}>
                Tiếp nhận nhận để biết
              </Bt>
            ) : null} */}
            {/* tiếp nhận nhận  ph */}
            {/* {rootTab === 'receive' ? (
              <Bt onClick={() => mergeData({ tab: 6 })} color={tab === 6 ? 'gradient' : 'simple'}>
                Tiếp nhận phối hợp
              </Bt>
            ) : null} */}
            {rootTab !== 'findStatistics' && (
              <Bt onClick={() => mergeData({ tab: 0 })} color={tab === 0 ? 'gradient' : 'simple'}>
                {rootTab === 'receive'
                  ? 'Tiếp nhận'
                  : rootTab === 'processors' || rootTab === 'supporters' || rootTab === 'viewers'
                    ? 'Chưa xử lý'
                    : rootTab === 'commander'
                      ? 'Chưa chỉ đạo'
                      : rootTab === 'feedback'
                        ? 'Chờ cho ý kiến'
                        : // : rootTab === 'findStatistics'
                        //   ? 'Tra cứu thống kê'
                        ''}
              </Bt>
            )}
          </Grid>
        </Grid>
        <div>
          <WrapperListPage
            moduleCode={props.location.pathname.replace('/', '')}
            tab={tab}
            rootTab={rootTab}
            kanbanFilter={kanbanFilter}
            profile={profile}
            openTitleDialog={openTitleDialog}
            handleSelectedDoc={handleSelectedDoc}
            handle={handle}
            handleSetCurrentRole={handleSetCurrentRole}
            handleSetProcessed={handleSetProcessed}
            getStateSelection={getStateSelection}
            OpenExecutiveDocumenDialog={OpenExecutiveDocumenDialog}
            handleSetSelectProcess={handleSetSelectProcess}
            mapFunction={mapFunction}
            reloadPage={reloadPage}
            roles={businessRole}
            businessRoleSelect={businessRoleSelect}
            // tab1
            templates={templates}
            reload={reload}
            callBack={callBack}
            history={props.history}
            selectedProcess={selectedProcess}
            lands={lands}
            resetSelect={resetSelect}
            openTitleDialogCustom={openTitleDialogCustom}
            checkListDocument={checkDocument}
            setCanView={setCanView}
            roleDepartment={roleDepartment}
            setReloadPage={() => setReloadPage(new Date() * 1)}
          />
        </div>
      </PaperUI>
      <Dialog dialogAction={false} onClose={() => handleClosePreview()} maxWidth="lg" open={openPreview}>
        {/* check11 */}
        {selectUrl &&
          FILES.indexOf(selectUrl) === -1 && (
            <>
              <div className="wrapperImage">
                <img alt="ds" className="image-preview" style={{ transform: `rotate(${rotation}deg)` }} src={selectUrl} />
              </div>
              <Grid container justify="flex-end" spacing={8}>
                <Grid item md={2} container style={{ cursor: 'pointer', color: 'black' }} alignItems="center" spacing={8}>
                  <Grid item>
                    <Tooltip title="Xoay trái" onClick={() => handleRotate('left')}>
                      <RotateLeft style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  </Grid>
                  <Grid item>Xoay trái</Grid>
                  <Grid item>
                    <Tooltip title="Xoay phải" onClick={() => handleRotate('right')}>
                      <RotateRight style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  </Grid>
                  <Grid item>Xoay phải</Grid>
                </Grid>

                <Grid
                  item
                  md={1}
                  container
                  style={{ cursor: 'pointer', color: 'black' }}
                  alignItems="center"
                  spacing={8}
                  onClick={() => downloadImage(selectUrl, 'Download')}
                >
                  <Grid item>
                    <Tooltip title="Tải xuống">
                      <CloudDownload style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  </Grid>
                  <Grid item>Tải file</Grid>
                </Grid>
              </Grid>
            </>
          )}

        {selectUrl &&
          (selectUrl === 'docx' || selectUrl === 'doc') && (
            <>
              <Grid
                container
                justify="flex-end"
                style={{ cursor: 'pointer' }}
                alignItems="center"
                spacing={8}
                onClick={() => downloadFile(filePreview, 'Download')}
              >
                <Grid item>
                  <Tooltip title="Tải xuống">
                    <CloudDownload style={{ cursor: 'pointer' }} />
                  </Tooltip>
                </Grid>
                <Grid item>Tải file</Grid>
              </Grid>
              <div style={{ height: '80vh' }} id="docx-container" />
            </>
          )}
        {selectUrl &&
          selectUrl === 'xlsx' && (
            <>
              <div id="show" />
              <Grid
                container
                justify="flex-end"
                style={{ cursor: 'pointer' }}
                alignItems="center"
                spacing={8}
                onClick={() => downloadFile(filePreview, 'Download')}
              >
                <Grid item>
                  <Tooltip title="Tải xuống">
                    <CloudDownload style={{ cursor: 'pointer' }} />
                  </Tooltip>
                </Grid>
                <Grid item>Tải file</Grid>
              </Grid>
            </>
          )}
        {selectUrl &&
          selectUrl === 'pdf' && (
            <div style={{ height: '80vh' }}>
              <iframe width="100%" height="100%" id="docx" src={previewHtml} />
            </div>
          )}
      </Dialog>
      <SwipeableDrawer
        anchor="right"
        onClose={handleCloseEditExecutiveDocumentsDialog}
        open={openEditDialog}
        width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
      >
        <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
          <EditExecutiveDocuments role={rootTab} id={selected} goBack={handleCloseEditExecutiveDocumentsDialog} roleDepartment={roleDepartment} />
        </div>
      </SwipeableDrawer>

      {/* view */}
      <SwipeableDrawer
        anchor="right"
        onClose={handleCloseViewExecutiveDocumentsDialog}
        open={openViewDialog}
        width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
      >
        <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
          <ViewExecutiveDocuments
            role={rootTab}
            id={selected}
            goBack={handleCloseViewExecutiveDocumentsDialog}
            currentTab={tab}
            roleDepartment={roleDepartment}
            handleReload={() => {
              console.log('setReloadPage');
              setReloadPage(new Date() * 1);
            }}
          />
        </div>
      </SwipeableDrawer>
      <DocumentAssignModal
        open={openAsignProcessor}
        docIds={selectedDocs}
        processType={processType}
        template={templates}
        info={infoEmployee}
        supporteds={infoEmployee ? infoEmployee.supporteds : []}
        supporters={infoEmployee ? infoEmployee.supporters : []}
        child={infoEmployee.children ? infoEmployee.children : []}
        childTemplate={selectedTemplate}
        childSupport={infoEmployee && infoEmployee.childrenSupport ? infoEmployee.childrenSupport : []}
        childCommander={infoEmployee.childrenCommander ? infoEmployee.childrenCommander : []}
        childCommanderSupport={infoEmployee.childrenCommanderSupport ? infoEmployee.childrenCommanderSupport : []}
        currentRole={roleForProcess ? roleForProcess : nextRole}
        onClose={handleClose}
        profile={profile}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setOpenAsignProcessor(false);
          setOpenDialogCommand(false);
          setOpenDialog(false);
          reloadState();
          setSelectedDocs([]);
          setCanView(false);
        }}
        role={rootTab}
        checkOrg={checkOrg}
        roleDirection={roleDirection}
        sendUnit={sendUnit}
        consult={consult}
        unit={unit}
        allowSendToUnit={allowSendToUnit}
        rootTab={rootTab}
      />
      {/* Xin ý kiến */}
      <DocumentSetCommanders
        open={openCommandersDiaLog}
        docIds={selectedDocs}
        processType={processType}
        template={templates}
        info={infoEmployee}
        supporteds={infoEmployee ? infoEmployee.supporteds : []}
        supporters={infoEmployee ? infoEmployee.supporters : []}
        child={infoEmployee.children ? infoEmployee.children : []}
        childTemplate={selectedTemplate}
        childSupport={infoEmployee && infoEmployee.childrenSupport ? infoEmployee.childrenSupport : []}
        childCommander={infoEmployee.childrenCommander ? infoEmployee.childrenCommander : []}
        childCommanderSupport={infoEmployee.childrenCommanderSupport ? infoEmployee.childrenCommanderSupport : []}
        currentRole={roleForProcess ? roleForProcess : nextRole}
        roleGroupSource={roleGroupSource}
        onClose={handleClose}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setOpenSetCommandersDiaLog(false);
          setOpenSetCommanders(null);
          reloadState();
        }}
        profile={props.profile}
        checkOrg={checkOrg}
        roleDirection={roleDirection}
        consult={consult}
        typepage={processType}
      />
      {/* check 11 */}
      {/* trả lại */}
      <ReturnDocs
        open={openReturnDocs}
        docIds={selectedDocs}
        type={returnDocType}
        template={templates}
        childTemplate={selectedTemplate ? selectedTemplate : infoEmployee.children}
        role={rootTab}
        currentRole={currentRole}
        processeds={processedsReturnDoc}
        onClose={handleClose}
        onChangeSnackbar={onChangeSnackbar}
        data={infoEmployee}
        onSuccess={() => {
          setCanView(false);
          setOpenReturnDocs(false);
          setReturnDocType('');
          reloadState();
        }}
        typeFlow={typeFlow}
      />
      <ReturnDocsEx
        open={openDialogReturn}
        docIds={selectedDocs}
        type={returnDocType}
        template={templates}
        childTemplate={selectedTemplate ? selectedTemplate : infoEmployee.children}
        role={rootTab}
        currentRole={currentRole}
        processeds={processedsReturnDoc}
        onClose={handleClose}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setOpenDialogReturn(false);
          setReturnDocType('');
          reloadState();
        }}
      />
      {/* Đã xem */}
      <DialogMui
        fullWidth
        maxWidth="md"
        open={openDialogViewer}
        onClose={() => {
          setOpenDialogViewer(false);
        }}
        aria-labelledby="max-width-dialog-title"
      >
        {/* <DialogTitle id="max-width-dialog-title">{'Đã xem'}</DialogTitle> */}
        <DialogContent>
          <h3 style={{ textAlign: 'center' }}>Đồng ý có chắc chắn xác nhận đã xem các văn bản này ?</h3>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={disablebtnView}
            onClick={() => {
              setDisablebtnView(true);
              handleViewDoc();
            }}
            color="primary"
            variant="contained"
          >
            Xác nhận xem
          </Button>

          <Button
            disabled={disablebtnView}
            onClick={() => {
              setOpenDialogViewer(false);
            }}
            color="secondary"
            variant="contained"
          >
            HỦY
          </Button>
        </DialogActions>
      </DialogMui>
    </div>
  );
}

ExecutiveDocuments.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  executiveDocuments: makeSelectExecutiveDocuments(),
  miniActive: makeSelectMiniActive(),
  // dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    mergeDataEdit: data => dispatch(mergeDataEdit(data)),
    onUpdate: body => {
      dispatch(UpdateStatusAct(body));
    },
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'executiveDocuments', reducer });
const withSaga = injectSaga({ key: 'executiveDocuments', saga });

// export default compose(
//   withReducer,
//   withSaga,
//   withConnect,
//   withStyles(styles),
// )(ExecutiveDocuments);
export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ExecutiveDocuments);

const processCustomContent = [];
