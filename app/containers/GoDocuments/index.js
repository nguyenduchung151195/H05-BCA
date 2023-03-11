// GoDocuments

import React, { useState, useEffect, memo } from 'react';

import PropTypes from 'prop-types';
import Buttons from 'components/CustomButtons/Button';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import { mergeData } from './actions';
import makeSelectGoDocuments from './selectors';
import reducer from './reducer';
import { Grid, Tooltip, Dialog } from '@material-ui/core';
import AddSignedDocument from '../AddSignedDocument';
import {
  API_GOING_DOCUMENT,
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_USERS,
  API_ROLE_APP,
  API_OUTGOING_DOCUMENT_COUNT,
  API_ORIGANIZATION,
} from '../../config/urlConfig';
import {
  Dialog as DialogMui,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button

} from '@material-ui/core';
import { Paper as PaperUI } from 'components/LifetekUi';
import { makeSelectMiniActive, makeSelectProfile } from '../Dashboard/selectors';
import { makeSelectDashboardPage } from './selectors';
import DocumentAssignModalGo from 'components/DocumentAssignModalGo';
import DocumentSetCommanders from 'components/DocumentAssignModalGo/SetCommanders';
import ReturnDocs from 'components/DocumentAssignModalGo/ReturnDocs';
import { changeSnackbar } from '../Dashboard/actions';
import { getListData, serialize } from '../../utils/common';
// import { AsyncAutocomplete } from 'components/LifetekUi';
import { fetchData, flatChild } from '../../helper';
import CompleteDocs from 'components/DocumentAssignModal/CompleteDocs';
import ReleaseDocs from 'components/DocumentAssignModalGo/ReleaseDocs';
import './index.css';
// import moment from 'moment';
import _ from 'lodash';
import RoleTabs from '../../components/RoleTabs';

import WrapperListPageGo from '../../components/WrapperListPageGo';
import { getShortNote } from '../../utils/functions';
import request from '../../utils/request';

const code = {
  receive: 'ST22',
  processors: 'ST25',
  promulgate: 'ST23',
};

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

function GoDocuments(props) {
  // const classesa = useStyles();

  const { mergeData, executiveDocuments, miniActive, kanbanFilter, onChangeSnackbar, profile } = props;
  const { tab, reload } = executiveDocuments;
  const [index, setIndex] = useState(localStorage.getItem('OutGoingDocumentTab'));
  // const [openDialogExecutiveDocuments, setOpenDialogExecutiveDocuments] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogConsult, setOpenDialogConsult] = useState(false);

  // const [selectedExecutiveDocuments, setSelectedExecutiveDocuments] = useState(null);

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [oldRootTab, setOldRootTab] = useState(localStorage.getItem('OutGoingDocumentTab'));

  const [openAsignProcessor, setOpenAsignProcessor] = useState(false);
  const [openSetCommanders, setOpenSetCommanders] = useState(false);
  const [openReturnDocs, setOpenReturnDocs] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [currentRole, setCurrentRole] = useState('');
  const [nextRole, setNextRole] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [businessRole, setBusinessRole] = useState({});
  const [reloadPage, setReloadPage] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState();
  const [count, setCount] = useState({});
  const [openSignedDocument, setOpenSignedDocument] = useState(false);
  const [openRelease, setOpenRelease] = useState(false);

  const [allGoRoles, setAllGoRoles] = useState([]);
  const [businessGoRoleSelect, setBusinessGoRoleSelect] = useState([]);

  const [openDialogResponse, setOpenDialogResponse] = useState(null);
  const [returnDocType, setReturnDocType] = useState('');
  const [returnTypeDocument, setReturnTypeDocument] = useState('');

  const [processedsReturnDoc, setProcessedsReturnDoc] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [infoEmployee, setInfoEmployee] = useState({});
  const [canReturnDoc, setCanReturnDoc] = useState(false);

  const [canView, setCanView] = useState(false);
  const [goTypeProcess, setGoTypeProcess] = useState('');
  const [roleForProcess, setRoleForProcess] = useState(null);
  const requestURL = API_OUTGOING_DOCUMENT_COUNT;
  const [checkOrg, setCheckOrg] = useState(false);
  const [unit, setUnit] = useState('');
  const [consult, setConsult] = useState('');
  const [roleGroupSource, setRoleGroupSource] = useState('');
  const [roleDepartment, setRoleDepartment] = useState([]);
  const [listDer, setListDer] = useState([]);
  const [openDialogViewer, setOpenDialogViewer] = useState(false);
  const [disablebtnView, setDisablebtnView] = useState(false);

  useEffect(
    () => {
      localStorage.setItem('OutGoingDocumentTab', index);
    },
    [index],
  );

  const getValueTabByRole = value => {
    switch (value) {
      case 'receive':
      case 'feedback':
        return value;
      case 'processing':
        return 'processors';
      case 'release':
        return 'promulgate';
      case 'outgoing':
        return 'textGo';
    }
  };

  useEffect(() => {
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    if (props.profile && props.profile._id) {
      fetchData(`${API_ROLE_APP}/OutGoingDocument/${props.profile._id}`).then(res => {
        const newBusinessRole = {};
        const { roles } = res;
        const code = 'BUSSINES';

        const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
        setAllGoRoles(foundRoleDepartment);
        if (foundRoleDepartment) {
          const { data } = foundRoleDepartment;
          setRoleDepartment(data);
          if (data) {
            let check = false;
            data.forEach(d => {
              newBusinessRole[d.name] = d.data.view;
              newBusinessRole[`${d.name}_return_docs`] = d.data.returnDocs;
              if (!check && d.data.view) {
                check = true;
              }
            });
          }
        }
        if (typeof index !== 'string') {
          let roleArr = (newBusinessRole && Object.keys(newBusinessRole).filter(f => !f.includes('_') && newBusinessRole[f])) || [];
          if (roleArr.length > 0) {
            if ((props.location && props.location.tabs)) {
              setIndex('findStatistics')
            } else {
              setIndex(getValueTabByRole(roleArr[0]));
            }
            // setIndex(getValueTabByRole(roleArr[0]));
            mergeData({ tab: 0 });
          }
        } else {
          console.log("kmdkfmvkfd")

          mergeData({ tab: tab });
        }
        setBusinessRole(newBusinessRole);
      });
    }
  }, []);
  useEffect(
    () => {
      if (allGoRoles && profile && index) {
        let newCurrRole = '';
        if (index === 'receive') {
          newCurrRole = 'receive';
        }
        if (index === 'processors') {
          newCurrRole = 'processing';
        }
        if (index === 'promulgate') {
          newCurrRole = 'release';
        }
        if (index === 'textGo') {
          newCurrRole = 'outgoing';
        }
        if (index === 'feedback') {
          newCurrRole = 'feedback';
        }
        const newBusinessRole = (allGoRoles && allGoRoles.data && allGoRoles.data.find(a => a.name === newCurrRole)) || {};
        setBusinessGoRoleSelect(newBusinessRole && newBusinessRole.data);
      }
    },
    [allGoRoles, profile, index],
  );

  useEffect(() => {
    const apiUrl = API_OUTGOING_DOCUMENT_COUNT;
    fetch(`${apiUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setCount(data);
      });
    setCanView(false);
  }, []);
  useEffect(
    () => {
      setCanView(false);
    },
    [index],
  );
  useEffect(() => {
    fetchData(API_ORIGANIZATION).then(res => {
      const flattedDepartment = flatChild(res);
      setListDer(flattedDepartment);
    });
  }, []);
  const handleChangeTab = (event, newValue) => {
    mergeData({ tab: 0 });
    const oldTab = localStorage.getItem('OutGoingDocumentTab');
    if (newValue !== oldTab && oldTab !== null) {
      setCanView(false);
      setInfoEmployee({});
      setCanReturnDoc(false)
    }
    setOldRootTab(newValue);
    setIndex(newValue);
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
        setCount(data);
        setOpenReturnDocs(false);
        setCanView(false);
      });
    setReloadPage(new Date() * 1);
  };

  const openTitleReleaseDialog = id => {
    props.history.push(`./editPromulgate/${id}`);
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
        }
      }
    };
    return {
      ...item,
      // abstractNote: <p style={{ width: 360, wordBreak: 'break-all' }}>{item.abstractNote && getShortNote(item.abstractNote, 80)}</p>,
      toBook: item.toBook && item.textSymbols ? `${item.toBook}/${item.textSymbols}` : item.toBook ? item.toBook : "",
      abstractNote: !item.abstractNote ? (
        ''
      ) : item.abstractNote.length < 150 ? (
        item.abstractNote
      ) : (
        <>
          <Tooltip title={item.abstractNote} classes={{ tooltip: { maxWidth: 800} }}>
            <p>{getShortNote(item.abstractNote, 150)}</p>
          </Tooltip>
        </>
      ),
      kanbanStatus:
        item.signingStatus === 'waitingSign' ? (
          <a style={{ color: 'rgba(26, 144, 50, 0.91)' }}>Chờ ký nháy</a>
        ) : item.signingStatus === 'signed' ? (
          <a style={{ color: 'rgba(26, 144, 50, 0.91)' }}>Đã ký nháy</a>
        ) : item.isReturned === true ? (
          <a style={{ color: 'red', fontSize: 15 }}>Trả lại</a>
        ) : (
          mapkanban(item.releasePartStatus)
        ),
    };
  };

  const callBack = (cmd, data) => {
    switch (cmd) {
      case 'kanban-dragndrop-receive': {
        this.props.mergeData(data);
        break;
      }
      case 'quick-add': {
        props.history.push('/OutGoingDocument/add');
        break;
      }
      default:
        break;
    }
  };

  const openTitleDialog = (id, role, tab, processeds) => {
    props.history.push({
      pathname: `OutGoingDocument/editGoDocuments/${id}?role=${role}&tab=${tab}`,
      state: processeds,
      id: id,
    });
  };

  const openEditPage = (id, role) => {
    props.history.push(`OutGoingDocument/${id}?role=${role}`);
  };

  const checkShowReturn = () => {
    if (index === 'receive') return false;
    if (index === 'processors') {
      return businessRole && businessRole.processing;
    }
    if (index === 'promulgate') {
      return businessRole && businessRole.release;
    }
    if (index === 'textGo') {
      return businessRole && businessRole.outgoing;
    }
    if (index === 'feedback') {
      return businessRole && businessRole.feedBack;
    }
  };

  const handleSelectedDoc = docIds => {
    setSelectedDocs(docIds);
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

  const handleClose = e => {
    setOpenDialog(null);
    setOpenDialogConsult(null);
    setOpenDialogResponse(null);
    setGoTypeProcess('');
    setReturnDocType('');
    setOpenReturnDocs(false);
    setOpenAsignProcessor(false);
    setOpenSetCommanders(false);
    setAllowedUsers([]);
    setReturnTypeDocument("")
  };

  const handleOpen = (e, type, isReturn = false) => {
    if (type === 'command') {
      // setOpenSetCommanders(true);
      setOpenDialogConsult(e.currentTarget);
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

  const handleOpenDialogDoc = (bool, type, typeDocument) => {
    if (type === 'assign') {
      setOpenAsignProcessor(bool);
      setGoTypeProcess('any');
    } else if (type === 'release') {
      setOpenRelease(bool);
    } else {
      setOpenReturnDocs(bool);
      setReturnDocType(type);
    }
    setReturnTypeDocument(typeDocument)
  };
  const OpenExecutiveDocumenDialog = () => {
    if (index === 'receive') {
      props.history.push('/OutGoingDocument/add');
    }
    if (index === 'promulgate') {
      props.history.push('/ReleaseDocument/add');
    }
  };

  const handleSelectTemplate = (bool, template, templates) => {
    if (Array.isArray(template) && template.length > 0 && template[0].checkOrg) setCheckOrg(template[0].checkOrg);
    else setCheckOrg(template.checkOrg || false);

    if (Array.isArray(template) && template.length > 0 && template[0].unit) setUnit(template[0].unit);
    else setUnit(template.unit || false);
    setCurrentRole(template.code);
    setSelectedTemplate(template);
    setOpenAsignProcessor(bool);
    setGoTypeProcess('flow');
  };
  const handleSelectTemplateYk = (bool, template, type) => {
    setConsult('');
    if (Array.isArray(template) && template.length > 0 && template[0].consult) setConsult(template[0].consult);
    else if (template.consult) setConsult(template.consult);
    else {
      setConsult('');
    }
    setGoTypeProcess(type);
    setOpenDialogConsult(null);
    if (type !== 'any') {
      setRoleGroupSource(template.code);
    }
    if (type === 'any') {
      setRoleGroupSource(null);
    }
  };
  const getStateSelection = e => {
    // Array.isArray(e) && e.length > 0 ? setCanView(true) : setCanView(false)
  };

  useEffect(
    () => {
      if (index === 'processors' && processedsReturnDoc.length > 0) {
        let finđIndex = processedsReturnDoc.findIndex(f => f === profile._id);
        let result = [];
        if (finđIndex !== -1) {
          result = finđIndex - 1 === 0 ? [processedsReturnDoc[0]] : [processedsReturnDoc[finđIndex - 1]];
        } else {
          result = [processedsReturnDoc[processedsReturnDoc.length - 1]];
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
    [processedsReturnDoc, openReturnDocs],
  );

  useEffect(
    () => {
      getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/outGoingDocument`).then(res => {
        if (res) {
          setTemplates([{ ...res }]);
        } else {
          onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng dự thảo', status: true });
        }
      });
      if (selectedDocs.length > 0) {
        setInfoEmployee({});
        setCanView(true);
        let [id] = selectedDocs || [];

        fetch(`${API_GOING_DOCUMENT}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            if (data) {
              setInfoEmployee(data);
              
              const releasePartStatus = data && data.releasePartStatus

              const canReturnDoc = releasePartStatus  === "waitting"  || releasePartStatus === "released" ? false : data && data.canReturn || false
              console.log(releasePartStatus, 'releasePartStatus', data)
              // setCanReturnDoc(data.canReturn)
              // khi ma đang chờ ban hành thì sẽ k có  trả lại
              setCanReturnDoc(canReturnDoc)

            }
          });
      } else {
        setCanView(false);
        setCanReturnDoc(false)
      }
    },
    [selectedDocs],
  );
  useEffect(
    () => {
      setCanView(false);
      if (tab === 0) localStorage.setItem('Processor', 'Chờ xử lý');
      if (tab === 6) localStorage.setItem('Processor', 'Đã xử lý');
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
  const handleViewDoc = () => {
    // const url = isAuthory ? `${API_INCOMMING_DOCUMENT}/set-status?authority=true` : `${API_INCOMMING_DOCUMENT}/set-status`;

    const body = {
      // action: "Đã xem",
      docIds: selectedDocs,
      role: "viewers"
    };
    console.log(selectedDocs, "handleViewDoc")
    request(`${API_GOING_DOCUMENT}/change-status`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(() => {
      setDisablebtnView(false)
      setOpenDialogViewer(false)
      reloadState()
      setCanView(false)

    }).catch(() => {
      setDisablebtnView(false)
    })

  }
  return (
    <div>
      <div>
        <RoleTabs
          tab={tab}
          roles={businessRole}
          rolesByTab={businessGoRoleSelect}
          handleChangeTab={handleChangeTab}
          templates={templates}
          rootTab={index}
          document={count}
          checkShowReturn={checkShowReturn}
          canView={canView}
          openDialog={openDialog}
          profile={profile}
          data={infoEmployee}
          openDialogResponse={openDialogResponse}
          openDialogConsult={openDialogConsult}
          handleOpen={handleOpen}
          handleOpenDialogDoc={handleOpenDialogDoc}
          handleSelectTemplate={handleSelectTemplate}
          handleSelectTemplateYk={handleSelectTemplateYk}
          handleClose={handleClose}
          history={props.history}
          employeeReturn={allowedUsers}
          docType="goDocument"
          checkOrg={checkOrg}
          unit={unit}
          setOpenSetCommanders={setOpenSetCommanders}
          canReturnDoc={canReturnDoc}
          setOpenDialogViewer={setOpenDialogViewer}
        />
      </div>

      {/* {index === 0 ? ( */}
      <PaperUI className="CustomPaperUI" style={{ zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px', maxWidth: '100vw' }}>
        <Grid container>
          <Grid item sm="12">
            {index !== 'findStatistics' && (
              <>
                {/* <Bt onClick={() => mergeData({ tab: 3 })} color={tab === 3 ? 'gradient' : 'simple'}>
                  Bảng tự động hóa
                </Bt> */}
                {/* {(index === 'receive' || index === 'processors' || index === 'promulgate' || index === 'textGo') && (
              <Bt onClick={() => mergeData({ tab: 2 })} color={tab === 2 ? 'gradient' : 'simple'}>
                Luồng văn bản
              </Bt>
            )} */}

                {/* <Bt onClick={() => mergeData({ tab: 1 })} color={tab === 1 ? 'gradient' : 'simple'}>
                  Trạng thái
                </Bt> */}
              </>
            )}
            {(index === 'receive' || index === 'processors' || index === 'promulgate' || index === 'feedback') && (
              <Bt onClick={() => mergeData({ tab: 5 })} color={tab === 5 ? 'gradient' : 'simple'}>
                {index === 'receive' || index === 'processors' || index === 'promulgate'
                  ? 'Đã ban hành'
                  : index === 'feedback'
                    ? 'Đã cho ý kiến'
                    : ''}
              </Bt>
            )}

            {index === 'processors' && (
              <Bt onClick={() => mergeData({ tab: 6 })} color={tab === 6 ? 'gradient' : 'simple'}>
                Đã xử lý
              </Bt>
            )}
            {index === 'receive' && (
              <>
                <Bt onClick={() => mergeData({ tab: 7 })} color={tab === 7 ? 'gradient' : 'simple'}>
                  Chờ ban hành
                </Bt>
                <Bt onClick={() => mergeData({ tab: 4 })} color={tab === 4 ? 'gradient' : 'simple'}>
                  Đã trình ký
                </Bt>
              </>
            )}
            {index !== 'findStatistics' && (

              <>
                {index === 'textGo' && (
                  <Bt onClick={() => mergeData({ tab: 8 })} color={tab === 8 ? 'gradient' : 'simple'}>
                    Đã xử lý
                  </Bt>
                )}
                <Bt onClick={() => mergeData({ tab: 0 })} color={tab === 0 ? 'gradient' : 'simple'}>
                  {index === 'receive'
                    ? 'Dự thảo'
                    : index === 'promulgate'
                      ? 'Chờ ban hành'
                      : index === 'textGo'
                        ? 'Chưa xử lý'
                        : index === 'processors'
                          ? 'Chờ xử lý'
                          : index === 'feedback'
                            ? 'Chờ cho ý kiến'
                            : ''}
                </Bt>

              </>


            )}
          </Grid>
        </Grid>
        <div>
          {/* văn bản đi */}
          <WrapperListPageGo
            tab={tab}
            moduleCode={props.location.pathname.replace('/', '')}
            rootTab={index}
            kanbanFilter={kanbanFilter}
            profile={profile}
            openTitleDialog={openTitleDialog}
            openEditPage={openEditPage}
            handleSelectedDoc={handleSelectedDoc}
            handleSetCurrentRole={handleSetCurrentRole}
            handleSetProcessed={handleSetProcessed}
            getStateSelection={getStateSelection}
            OpenExecutiveDocumenDialog={OpenExecutiveDocumenDialog}
            handleSetSelectProcess={handleSetSelectProcess}
            mapFunction={mapFunction}
            reloadPage={reloadPage}
            // tab1
            templates={templates}
            reload={reload}
            callBack={callBack}
            history={props.history}
            selectedProcess={selectedProcess}
            kanbanCode={code}
            pathname={true}
            roles={businessRole}
            roleDepartment={roleDepartment}
            listDer={listDer}
          />
        </div>
      </PaperUI>

      <DocumentAssignModalGo
        open={openAsignProcessor}
        docIds={selectedDocs}
        currentRole={currentRole}
        template={templates}
        childTemplate={selectedTemplate}
        nextRole={roleForProcess ? roleForProcess : currentRole}
        typeProcess={goTypeProcess}
        onClose={() => {
          setOpenAsignProcessor(false);
        }}
        onSuccess={() => {
          setOpenAsignProcessor(false);
          setOpenDialog(null);
          setOpenDialogConsult(null);
          setSelectedDocs([]);
          reloadState();
        }}
        onChangeSnackbar={onChangeSnackbar}
        role={index}
        tab={tab}
        checkOrg={checkOrg}
        unit={unit}
      />
      <ReleaseDocs
        docIds={selectedDocs}
        open={openRelease}
        profile={profile}
        onClose={() => {
          setOpenRelease(false);
        }}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setOpenRelease(false);
          setReloadPage(new Date());
          props.history.push('/OutGoingDocument');
        }}
      />

      <DocumentSetCommanders
        open={openSetCommanders}
        docIds={selectedDocs}
        template={templates}
        onClose={() => {
          setOpenSetCommanders(false);
        }}
        onChangeSnackbar={onChangeSnackbar}
        consult={consult}
        typeProcess={goTypeProcess}
        processType={goTypeProcess}
        roleGroupSource={roleGroupSource}
      />

      <ReturnDocs
        open={openReturnDocs}
        docIds={selectedDocs}
        type={returnDocType}
        role={index}
        template={templates}
        childTemplate={infoEmployee && infoEmployee.children}
        processeds={processedsReturnDoc}
        employeeReturn={allowedUsers}
        onClose={() => {
          setOpenReturnDocs(false);
          setReturnDocType('');
          setReturnTypeDocument('');
        }}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setOpenReturnDocs(false);
          setReturnDocType('');
          setAllowedUsers([]);
          reloadState();
          setReturnTypeDocument('');
        }}
        returnTypeDocument={returnTypeDocument}
      />

      <CompleteDocs
        open={openComplete}
        docIds={selectedDocs}
        template={setOpenComplete}
        onClose={() => {
          setOpenComplete(false);
        }}
        onSuccess={() => {
          setOpenComplete(false);
          props.history.goBack();
        }}
        onChangeSnackbar={onChangeSnackbar}
      />
      <Dialog open={openSignedDocument} onClose={handleClose}>
        <AddSignedDocument style={{ display: 'none' }} indexTab={index} />
      </Dialog>

      <DialogMui
        fullWidth
        maxWidth="md"
        open={openDialogViewer}
        onClose={() => {
          setOpenDialogViewer(false)
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
              setDisablebtnView(true)
              handleViewDoc()
            }}
            color="primary"
            variant="contained"
          >
            Xác nhận xem
          </Button>

          <Button
            disabled={disablebtnView}
            onClick={() => {
              setOpenDialogViewer(false)
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

GoDocuments.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  executiveDocuments: makeSelectGoDocuments(),
  miniActive: makeSelectMiniActive(),
  dashboardPage: makeSelectDashboardPage(),
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

const withReducer = injectReducer({ key: 'goDocuments', reducer });
// const withSaga = injectSaga({ key: 'goDocuments', saga });

export default compose(
  memo,
  withReducer,
  // withSaga,
  withConnect,
)(GoDocuments);
