// EditExecutiveDocuments

import {
  Button,
  Grid,
  Menu,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
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
import { Comment, FileUpload, AsyncAutocomplete } from '../../components/LifetekUi';
import CustomAppBar from 'components/CustomAppBar';
import { Check, CheckBox, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { makeSelectProfile } from '../Dashboard/selectors';
import { Paper as PaperUI } from 'components/LifetekUi';
import { API_INCOMMING_DOCUMENT, API_USERS, API_DOCUMENT_HISTORY, API_AUTHORY_PROFILE, API_ROLE_APP, API_DOCUMENT_PROCESS_TEMPLATE } from '../../config/urlConfig';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { viewConfigName2Title } from '../../utils/common';
import Department from 'components/Filter/DepartmentAndEmployee/Light';
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
import { serialize, fetchData } from '../../helper';
import FlowDocument from '../../components/FlowComponent';
import { Tabs, Tab } from '../../components/LifetekUi';
import _ from 'lodash';
import { getListData } from '../../utils/common';
function EditExecutiveDocuments(props) {
  const { profile, code = 'IncommingDocument', editExecutiveDocuments } = props;
  const id = props.id ? props.id : _.get(props, 'match.params.id');
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role');
  const currentTab = urlParams.get('tab');
  const isAuthory = Boolean(urlParams.get('isAuthory')) || false;



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
  const [finalChild, setFinalChild] = useState([])
  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);

    return () => {
      newNam2Title;
    };
  }, []);

  const getBusinessRoles = (isAuthoryDoc) => {
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
  }

  // useEffect(
  //   () => {
  //     if (profile && profile._id) {

  //   },
  //   [profile],
  // );

  const checkEndFlow = (array) => {
    let result = false;
    if (array) {
      array.map(item => {
        if (!item.children) {
          result = false
        } else {
          result = true;
        }

      })
    }
    return result;
  }

  useEffect(
    () => {
      if (id) {
        getListData(API_DOCUMENT_PROCESS_TEMPLATE, { type: 'process', 'docType.value': 'OutGoingDocument' }).then(setTemplates);
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
            setLocalState(data);
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

  useEffect(() => {
    if (isAuthory && localState.author) {
      fetchData(`${API_AUTHORY_PROFILE}/${localState.author}`).then(res => {
        if (res && res.data) {
          setAuthoryProfile(res.data)
        }
      })
    }
  }, [localState]);

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
              setFinalChild([{ ...temp }])
            }
          } else {
            findNode(temp.children, child, d + 1)
          }
        }
      }
    })
  }

  useEffect(() => {
    if (finalChild && finalChild[0] && finalChild[0].code) {
      setCurrentRole(finalChild[0].code)
    }
  }, [finalChild, returnDocType])


  const handleOpen = (e, type = '') => {
    if (type !== '') {
      if (type !== 'support' && type !== 'commander') {
        setOpenProcessor(e.currentTarget)
      }
      if (type === 'support') {
        setOpenSupport(e.currentTarget)
      }
      if (type === 'commander') {
        setOpenCommand(e.currentTarget)
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

  const getRole = (array) => {
    let str = "";
    if (array) {
      array.map((item) => {
        if (item.children) {
          item.children.map((i, index) => {
            if (index !== item.children.length - 1) {
              str += i.code + ",";
            } else {
              str += i.code;
            }
          })
        }
      })
    }
    return str;
  }

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
    return state && profile && state[key] && state[key].indexOf(profile._id) !== -1 ? true : false
  }

  const getDataSupport = () => {
    if (localState && localState.childrenSupport) {
      return localState.childrenSupport.filter(f => f.code == profile.roleGroupSource)
    }
  }




  const isCommandeds = role === 'commander' && localState && localState.processors && localState.commander && localState.processors.length === 0 && localState.commander.length > 0;
  const commandHasProcess = role === 'commander' && localState && localState.processors && localState.commandeds.indexOf(profile._id) && localState.processors.length > 0;
  const orHastForceComplete =
    profile && profile.roleCached && profile.roleCached.IncommingDocument && profile.roleCached.IncommingDocument.processing_force_set_complete ? true : false;

  const orHastForceCompleteAuthor = authoryProfile && authoryProfile.roleCached && authoryProfile.roleCached.IncommingDocument && authoryProfile.roleCached.IncommingDocument.processing_force_set_complete ? true : false;
  const orHasComplete =
    profile && profile.roleCached && profile.roleCached.IncommingDocument && profile.roleCached.IncommingDocument.processing_set_complete ? true : false;
  const orHasCompleteeAuthor = authoryProfile && authoryProfile.roleCached && authoryProfile.roleCached.IncommingDocument && authoryProfile.roleCached.IncommingDocument.processing_set_complete ? true : false;
  const orEndRole = localState && localState.children && localState.children.length > 0 && checkEndFlow(localState.children);
  // commander
  const isCommanders = checkRoleCanAction('commander', profile, localState)
  const isCommandersAuthor = checkRoleCanAction('commander', profile, localState, isAuthory);
  const isCommandered = checkRoleCanAction('commandered', profile, localState);
  const isCommanderedAuthor = checkRoleCanAction('commandered', profile, localState, isAuthory);
  // process
  const isProcessors = checkRoleCanAction('processors', profile, localState);
  const isProcessorsAuthor = checkRoleCanAction('processors', profile, localState, isAuthory);
  const isProcesseds = checkRoleCanAction('processeds', profile, localState);
  const isProcessedsAuthor = checkRoleCanAction('processeds', profile, localState, isAuthory);
  const onlyProcess = localState.children && localState.children[0] && localState.children[0].type === '' ? true : false;
  // support
  const isSupporters = checkRoleCanAction('supporters', profile, localState);
  const isSupportersAuthor = checkRoleCanAction('supporters', profile, localState, isAuthory);
  const isSupported = checkRoleCanAction('supporteds', profile, localState)
  const isSupportedAuthor = checkRoleCanAction('supporteds', profile, localState, isAuthory);

  // draft
  const canDraft = role !== 'receive' && role !== 'viewers'
  // view
  const isViewers = checkRoleCanAction('viewers', profile, localState);
  const isViewersAuthor = checkRoleCanAction('viewers', profile, localState, isAuthory);
  const isViewered = checkRoleCanAction('vieweds', profile, localState);
  const isVieweredAuthor = checkRoleCanAction('vieweds', profile, localState);

  // checkSupport
  const dataSupport = getDataSupport() || [];
  const isEndSupport = checkEndFlow(dataSupport);

  const TABS = [
    { label: 'Thông tin chung', value: 'info' },
    { label: 'Hồ sơ công việc', value: 'work' },
    { label: 'Lịch cá nhân', value: 'meetingCalendar' },
    { label: 'Nguồn gốc', value: 'source' },
  ];

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

  return (
    <div>
      <CustomAppBar
        title={'Chi tiết văn bản đến'}
        onGoBack={() => {
          localStorage.setItem('rootTab', role);
          props.goBack ? props.goBack() : props.history.goBack();
          if (props.history && props.history.valueData) {
            props.history.push(`/OutGoingDocument/editGoDocuments/${props.history.valueData}`);
          }
          else if (isAuthory) {
            props.history.push('/AuthorityDocument');
          } else {
            props.history.push('/IncommingDocument');
          }
        }}
        disableAdd
        moreButtons={
          <div style={{ marginLeft: 10, display: 'flex', justifyContent: 'space-around' }}>
            {canDraft && (
              <Button
                style={{ marginRight: 10 }}
                variant="outlined"
                color="inherit"
                onClick={e => {
                  props.history.push(`/OutGoingDocument/add?docId=${localState._id}&toBookCode=${localState.toBookCode}`);
                }}
              >
                {/* <span style={{ marginRight: 5 }}>
                  <CheckBox />
                </span> */}
                Tạo dự thảo
              </Button>
            )}

            {(isProcessors || isProcessorsAuthor) ? (
              <>
                {onlyProcess &&
                  (orHasComplete || orHasCompleteeAuthor) ? (
                  <Button
                    variant="outlined"
                    color="inherit"
                    style={{ marginRight: 10 }}
                    onClick={e => {
                      setOpenComplete(true);
                    }}
                  >
                    <span style={{ marginRight: 5 }}>
                      <CheckBox />
                    </span>
                    Hoàn thành xử lý
                  </Button>
                ) : null}
              </>
            ) : null}

            {(isProcesseds || isProcessedsAuthor) ? (
              <>
                {
                  (orHastForceComplete || orHastForceCompleteAuthor) ? (
                    <Button
                      variant="outlined"
                      color="inherit"
                      style={{ marginRight: 10 }}
                      onClick={e => {
                        setOpenComplete(true);
                      }}
                    >
                      <span style={{ marginRight: 5 }}>
                        <CheckBox />
                      </span>
                      Hoàn thành xử lý
                    </Button>
                  ) : null}
              </>
            ) : null}


            {(isSupporters || isSupportersAuthor) ? (
              <Button
                style={{ marginRight: 10 }}
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setStatus('Hoàn thành');
                }}
              >
                <span style={{ marginRight: 5 }}>
                  <CheckBox />
                </span>
                Hoàn thành
              </Button>
            ) : null}
            {commandHasProcess ? (
              <Button
                style={{ marginRight: 10 }}
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setStatus('Hoàn thành');
                }}
              >
                <span style={{ marginRight: 5 }}>
                  <CheckBox />
                </span>
                Hoàn thành
              </Button>
            ) : null}
            {(isViewers || isViewersAuthor) ? (
              <Button
                style={{ marginRight: 10 }}
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setStatus('Đã xem');
                }}
              >
                <span style={{ marginRight: 5 }}>
                  <CheckBox />
                </span>
                Đã xem
              </Button>
            ) : null}

            {businessRoleSelect &&
              (businessRoleSelect.set_feedback || (isAuthory && businessRoleSelect.set_feedback)) ? (
              <Button
                style={{ marginRight: 10 }}
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setOpenSetCommanders(true);
                }}
              >
                {/* <span style={{ marginRight: 5 }}>
                  <ChatBubbleOutline />
                </span> */}
                Xin ý kiến
              </Button>
            ) : null}

            {
              (isProcessors || isCommandeds || (isAuthory && (isCommandeds || isProcessorsAuthor))) ? (
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
                  localState.children && localState.template && localState.template.children && findNode([{ ...localState.template }], [...localState.children], 0)
                }}
              >
                <span> Trả theo luồng</span>
              </MenuItem>
              <MenuItem
                value={'startFlow'}
                onClick={() => {
                  setOpenReturnDocs(true);
                  setReturnDocType('startFlow');
                }}
              >
                <span> Trả cho văn thư</span>
              </MenuItem>
            </Menu>

            {(isProcessors || isProcessorsAuthor) && orEndRole
              ? (
                <>
                  {localState.children && localState.children.map(item => (
                    <>

                      <Button
                        variant="outlined"
                        color="inherit"
                        style={{ marginRight: 10 }}
                        onClick={(e) => {
                          handleOpen(e, 'process')
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

            {((isSupporters && isEndSupport) || (isSupportersAuthor && isEndSupport))
              ? (
                <>
                  {localState.children && localState.children.map(item => (
                    <>
                      <Button
                        variant="outlined"
                        color="inherit"
                        style={{ marginRight: 10 }}
                        onClick={(e) => {
                          handleOpen(e, 'support')
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
            {((isCommandeds || commandHasProcess) || (isAuthory && (isCommandeds || commandHasProcess)))
              ? (
                <>
                  {localState.children && localState.children.map(item => (
                    <>

                      <Button
                        variant="outlined"
                        color="inherit"
                        style={{ marginRight: 10 }}
                        onClick={(e) => {
                          handleOpen(e, 'commander')
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
              {dataSupport && dataSupport.length > 0 && dataSupport.map(item => (
                <>
                  {item.children && item.children.length > 0 && item.children.map(i => (
                    <MenuItem
                      value="item.code"
                      onClick={e => {
                        setSelectedTemplate(i);
                        setOpenAsignProcessor(true);
                        setRoleForProcess(i.code)
                        setProcessType('flow')
                      }}
                    >
                      Chuyển cho {i.name}
                    </MenuItem>
                  ))}
                  {item.children && item.children.length === 0 && (
                    <MenuItem
                      value="item.code"
                      onClick={e => {
                        setSelectedTemplate(item);
                        setOpenAsignProcessor(true);
                        setRoleForProcess(item.code)
                      }}
                    >
                      Chuyển cho {item.name}
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
              {localState.childrenCommander && localState.childrenCommander.length > 0 && localState.childrenCommander.map(item => (
                <>
                  <MenuItem
                    variant="outlined"
                    color="inherit"
                    style={{ marginRight: 10 }}
                    onClick={(e) => {
                      if (localState.childrenCommander && localState.childrenCommander.length === 1) {
                        const [template] = localState.childrenCommander;
                        template && template.children && setSelectedTemplate(template.children);
                        let role = getRole(template.children)
                        setNextRole(role);
                        setOpenAsignProcessor(true);
                        setProcessType('any')
                      }
                    }}
                  >
                    Chuyển tùy chọn
                  </MenuItem>
                  {item.children && item.children.length > 0 && item.children.map(i => (
                    <MenuItem
                      value="item.code"
                      onClick={e => {
                        setSelectedTemplate(i);
                        setOpenAsignProcessor(true);
                        setRoleForProcess(i.code)
                        setProcessType('flow')
                      }}
                    >
                      Chuyển cho {i.name}
                    </MenuItem>
                  ))}
                  {item.children && item.children.length === 0 && (
                    <MenuItem
                      value="item.code"
                      onClick={e => {
                        setSelectedTemplate(item);
                        setOpenAsignProcessor(true);
                        setRoleForProcess(item.code)
                      }}
                    >
                      Chuyển cho {item.name}
                    </MenuItem>
                  )}
                </>

              ))}
            </Menu>
            {/* chuyển xử lý */}
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
              {localState.children && localState.children.length > 0 && localState.children.map(item => (
                <>
                  {role !== 'supporters' && (
                    <MenuItem
                      variant="outlined"
                      color="inherit"
                      style={{ marginRight: 10 }}
                      onClick={(e) => {
                        if (localState.children && localState.children.length === 1) {
                          const [template] = localState.children;
                          template && template.children && setSelectedTemplate(template.children);
                          let role = getRole(template.children)
                          setNextRole(role);
                          setOpenAsignProcessor(true);
                          setProcessType('any')
                        }
                      }}
                    >
                      Chuyển tùy chọn
                    </MenuItem>
                  )}
                  {item.children && item.children.length > 0 && item.children.map(i => (
                    <MenuItem
                      value="item.code"
                      onClick={e => {
                        setSelectedTemplate(i);
                        setOpenAsignProcessor(true);
                        setRoleForProcess(i.code)
                        setProcessType('flow')
                      }}
                    >
                      Chuyển cho {i.name}
                    </MenuItem>
                  ))}
                  {item.children && item.children.length === 0 && (
                    <MenuItem
                      value="item.code"
                      onClick={e => {
                        setSelectedTemplate(item);
                        setOpenAsignProcessor(true);
                        setRoleForProcess(item.code)
                      }}
                    >
                      Chuyển cho {item.name}
                    </MenuItem>
                  )}
                </>

              ))}
            </Menu>
          </div>
        }
      // onSubmit={onSave}
      />
      <div style={{ marginBottom: 10 }}>
        <Tabs onChange={handleChangeTab} value={tab}>
          {TABS && TABS.map(tab => <Tab key={`${tab.value + tab.label}`} value={tab.value} label={tab.label} />)}
        </Tabs>
      </div>
      {tab === 'info' ? (
        <div style={{ marginLeft: 0 }}>
          <Grid container spacing={8}>
            <Grid item xs="8">
              <Grid container spacing={8}>
                <Grid item xs="12">
                  <PaperUI>
                    <Typography variant="h6" component="h2" gutterBottom display="block" style={{ textTransform: 'uppercase' }}>
                      Văn bản đến
                    </Typography>
                    {docDetail && <FileUpload name={docDetail.name} id={id} code={code} viewOnly />}
                  </PaperUI>
                </Grid>
                <Grid item xs="12">
                  <PaperUI>
                    <Typography variant="h6" component="h2" gutterBottom display="block" style={{ textTransform: 'uppercase' }}>
                      Thông tin chung
                    </Typography>
                    <Grid container spacing={8}>
                      <Grid item xs={6}>
                        <CustomInputBase
                          label={name2Title.name}
                          name="name"
                          value={localState.name && localState.name.title}
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={6} className="setCustomInput1">
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
                      <Grid item xs={6} className="setCustomInput1">
                        <CustomInputBase
                          label={name2Title.senderUnit}
                          name="senderUnit"
                          value={localState.senderUnit && localState.senderUnit.title}
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomInputBase
                          label={name2Title.toBookCode}
                          value={localState.toBookCode}
                          name="toBookCode"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomDatePicker
                          label={name2Title.documentDate || 'Ngày VB'}
                          value={localState.documentDate}
                          name="documentDate"
                          disabled
                          className="setCustomInput"
                          required={false}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomInputBase
                          label={name2Title.receiveMethod}
                          value={localState.receiveMethod && localState.receiveMethod.title}
                          name="receiveMethod"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomInputBase label={name2Title.toBook} value={localState.toBook} name="toBook" disabled className="setCustomInput" />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomDatePicker
                          label={name2Title.receiveDate || 'Ngày nhận văn bản'}
                          value={localState.receiveDate}
                          name="receiveDate"
                          disabled
                          className="setCustomInput"
                          required={false}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomInputBase
                          label={name2Title.privateLevel}
                          value={localState.privateLevel && localState.privateLevel.title}
                          name="privateLevel"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomInputBase
                          label={name2Title.secondBook}
                          value={localState.secondBook}
                          name="secondBook"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomDatePicker
                          label={name2Title.toBookDate || 'Ngày vào sổ'}
                          value={localState.toBookDate}
                          name="toBookDate"
                          disabled
                          className="setCustomInput"
                          required={false}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomInputBase
                          label={name2Title.urgencyLevel}
                          value={localState.urgencyLevel && localState.urgencyLevel.title}
                          name="urgencyLevel"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomInputBase
                          label={name2Title.documentType}
                          value={localState.documentType && localState.documentType.title}
                          name="documentType"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomInputBase
                          label={name2Title.documentField}
                          value={localState.documentField && localState.documentField.title}
                          name="documentField"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>
                      <Grid item xs={6}>
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

                      <Grid item xs={6}>
                        <AsyncAutocomplete
                          name="Chọn "
                          label={name2Title.signer}
                          value={localState.signer}
                          url={API_USERS}
                          disabled
                          className="setCustomInput"
                        />
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

                      <Grid item xs={6}>
                        <CustomGroupInputField code={code} columnPerRow={4} value={localState.others} disabled className="setCustomInput" />
                      </Grid>
                    </Grid>
                  </PaperUI>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs="4">
              <PaperUI style={{ height: '100%' }}>
                {docDetail && (
                  <Comment
                    profile={profile}
                    code={code}
                    id={id}
                    isAuthory={isAuthory}
                    // viewOnly={currentTab !== 0 }
                    viewOnly={
                      (isProcessorsAuthor || isCommanders || isCommandersAuthor || isProcessors)
                        ? false
                        : (
                          isProcesseds ||
                          isCommandeds ||
                          isProcessedsAuthor ||
                          isCommandered ||
                          isCommanderedAuthor ||
                          isSupported ||
                          isSupportedAuthor ||
                          isViewers ||
                          isViewered ||
                          isVieweredAuthor
                        )
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
                <Typography variant="h6" component="h2" gutterBottom display="block" style={{ textTransform: 'uppercase' }}>
                  Thông tin gửi nhận
                </Typography>

                {id && (
                  <>
                    <Table className="editDocuments">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: 20, fontWeight: 'bold' }}>STT</TableCell>
                          <TableCell style={{ width: 220, fontWeight: 'bold' }}>Người nhận</TableCell>
                          <TableCell style={{ width: 220, fontWeight: 'bold' }}>Thao tác</TableCell>
                          <TableCell style={{ width: 220, fontWeight: 'bold' }}>Hạn xử lý</TableCell>
                          <TableCell style={{ width: 220, fontWeight: 'bold' }}>Trạng thái</TableCell>
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
                                            {item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : ''}
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

      <DocumentAssignModal
        open={openAsignProcessor}
        docIds={selectedDocs}
        onClose={handleClose}
        typePage={isAuthory ? "authority" : ''}
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
