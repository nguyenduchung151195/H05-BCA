// Authority

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '../../components/LifetekUi';
import Buttons from 'components/CustomButtons/Button';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as docx from 'docx-preview';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import { mergeData } from './actions';
import { mergeData as mergeDataEdit } from '../EditExecutiveDocuments/actions';
import iconHoatoc from '../../assets/img/icons/iconHoatoc.svg';

import makeSelectAuthority from './selectors';
import reducer from './reducer';
import { Grid, Tooltip, Button, Badge, SwipeableDrawer } from '@material-ui/core';
import ListPage from '../../components/List';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import request from 'utils/request';
import {
  API_AUTHORITY_DOCUMENT,
  API_INCOMMING_DOCUMENT,
  API_GOING_DOCUMENT,
  API_INCOMMING_DOCUMENT_COUNT,
  UPLOAD_APP_URL,
  API_USERS,
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_AUTHORY_PROFILE,
  API_ROLE_APP,
  API_INCOMMING_DOCUMENT_COUNT_AUTHORIZED,
  API_OUTGOING_DOCUMENT_COUNT_AUTHORIZED,
  API_EMPLOYEE_GET_AUTHORITY,
} from '../../config/urlConfig';
import AddAuthority from '../AddAuthority';
import { Paper as PaperUI, Dialog } from 'components/LifetekUi';
import { makeSelectMiniActive, makeSelectProfile } from '../Dashboard/selectors';
import { changeSnackbar } from '../Dashboard/actions';
import DocumentAssignModal from 'components/DocumentAssignModal';
import DocumentSetCommanders from 'components/DocumentAssignModal/SetCommanders';
import ReturnDocs from 'components/DocumentAssignModal/ReturnDocs';
import { Add, RotateLeft, RotateRight, CloudDownload } from '@material-ui/icons';
import { clientId } from '../../variable';
import DocumentAssignModalGo from 'components/DocumentAssignModalGo';
import DocumentSetCommandersGo from 'components/DocumentAssignModalGo/SetCommanders';
import ReturnDocsGo from 'components/DocumentAssignModalGo/ReturnDocs';
import ReleaseDocs from 'components/DocumentAssignModalGo/ReleaseDocs';
import XLSX from 'xlsx';
import { getListData } from '../../utils/common';
import { fetchData } from '../../helper';
import RoleTabs from 'components/RoleTabs';
import WrapperListPage from 'components/WrapperListPage';
import WrapperListPageGo from 'components/WrapperListPageGo';
import moment from 'moment';
import { getShortNote } from '../../utils/functions';
import { Dialog as DialogMui, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import ViewExecutiveDocuments from '../ViewExecutiveDocuments';
import EditExecutiveDocuments from '../EditExecutiveDocuments';
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
const code = {
  receive: 'ST22',
  processors: 'ST25',
  promulgate: 'ST23',
};

function Authority(props) {
  const { mergeData, mergeDataEdit, authority, miniActive, onChangeSnackbar, profile } = props;
  const FILES = ['xlsx', 'xls', 'docx', 'pdf'];
  const { tab, reloadS, kanbanFilter } = authority;
  const [reload, setReload] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const tabInd = localStorage.getItem('AuthoriyDocument');
  // const tabInd =
  //   localStorage.getItem('AuthoriyDocument') == 'undefined' || localStorage.getItem('AuthoriyDocument') == null
  //     ? 'roleGroupSource'
  //     : localStorage.getItem('AuthoriyDocument');
  const [index, setIndex] = useState(tabInd);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const [selected, setSelected] = useState([]);

  const [selectedExecutive, setSelectedExecutive] = useState();
  const [selectedGoDucument, setSelectedGoDucument] = useState();
  const nameCallBack = 'author';
  const requestURL = API_INCOMMING_DOCUMENT_COUNT;
  const [rotation, setRotation] = useState(0);
  let show = document.getElementById('show');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [checkDocument, setCheckDocument] = useState(false);

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [openAsignProcessor, setOpenAsignProcessor] = useState(false);
  const [openSetCommanders, setOpenSetCommanders] = useState(false);
  const [openReturnDocs, setOpenReturnDocs] = useState(false);
  const [localState, setLocalState] = useState({});
  const [selectUrl, setSelectedUrl] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [reloadPage, setReloadPage] = useState(null);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [openAsignProcessorGo, setOpenAsignProcessorGo] = useState(false);
  const [openReturnDocsGo, setOpenReturnDocsGo] = useState(false);
  const [openSetCommandersGo, setOpenSetCommandersGo] = useState(false);

  const [SelectedAuthority, setSelectedAuthority] = useState(null);
  // incomingDoc
  const [businessRole, setBusinessRole] = useState({});
  const [businessRoleGoDocument, setBusinessRoleGoDocument] = useState({});
  const [rootTab, setRootTab] = useState(localStorage.getItem('IncommingDocumentAuthorTab'));
  const [rootTab2, setRootTab2] = useState(localStorage.getItem('OutGoingDocumentAuthorTab'));
  console.log(localStorage.getItem('OutGoingDocumentAuthorTab'), 'localStorage.getItem()');
  const [selectedProcess, setSelectedProcess] = useState(JSON.parse(localStorage.getItem('IncommingDocumentProcess')));
  const [allRoles, setAllRoles] = useState([]);
  const [businessRoleSelect, setBusinessRoleSelect] = useState([]);

  const [allGoRoles, setAllGoRoles] = useState([]);
  const [businessGoRoleSelect, setBusinessGoRoleSelect] = useState([]);

  const [canView, setCanView] = useState(false);
  const [view, setView] = useState(false);
  const [openDialogResponse, setOpenDialogResponse] = useState(null);
  const [roleForProcess, setRoleForProcess] = useState(null);
  const [returnDocType, setReturnDocType] = useState('');
  const [processedsReturnDoc, setProcessedsReturnDoc] = useState([]);
  const [lands, setLands] = useState([]);
  const [currentRole, setCurrentRole] = useState('');
  const [documentGo, setDocumentGo] = useState({});
  const [authorityRole, setAuthorityRole] = useState({});
  const [openDialogProcess, setOpenDialogProcess] = useState(null);

  const [infoDoc, setInfoDoc] = useState({});
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [nextRole, setNextRole] = useState(null);
  const [selectedDocData, setSelectedDocData] = useState(null);
  const [openRelease, setOpenRelease] = useState(false);
  // authority of executiveDocument
  const [processType, setProcessType] = useState('');
  const [goTypeProcess, setGoTypeProcess] = useState('');
  const [templatesGo, setTemplatesGo] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [openDialogSupport, setOpenDialogSupport] = useState(null);
  const [openDialogCommand, setOpenDialogCommand] = useState(null);
  const [finalChild, setFinalChild] = useState([]);
  const [authoryProfile, setAuthoryProfile] = useState({});
  const docxOptions = Object.assign(docx.defaultOptions, {
    debug: true,
    experimental: true,
  });
  const [countIncommingDocument, setCountIncommingDocument] = useState();
  const [countOutgoingDocument, setCountOutgoingDocument] = useState();
  const [onShowDetail, setOnShowDetail] = useState(false);
  const [sendUnit, setSendUnit] = useState();
  const [roleDepartment, setRoleDepartment] = useState([]);
  const [openDialogViewer, setOpenDialogViewer] = useState(false);
  const [typeView, setTypeView] = useState();

  const [disablebtnView, setDisablebtnView] = useState(false);

  const [allowSendToUnit, setAllowSendToUnit] = useState();
  const [profileAuthority, setProfileAuthority] = useState();
  const [typeFlow, setTypeFlow] = useState();

  const handleChangeTab = (event, newValue) => {
    mergeData({ tab: 0 });
    setIndex(newValue);
    setCanView(false);
  };
  const handleChangeRootTab = (event, newValue) => {
    mergeData({ tab: 0 });
    setRootTab(newValue);
    setCanView(false);
  };

  const handleChangeRootTabGoDocument = (event, newValue) => {
    mergeData({ tab: 0 });
    setRootTab2(newValue);
  };

  const handleCloseAddAuthorityDialog = () => {
    setSelectedAuthority({});
    setOpenDialog(false);
  };

  // Load ra html
  const loadDocx = useCallback(
    (file, container) => {
      if (!file) return;
      docx.renderAsync(file, container, null, docxOptions).then(function (x) { });
    },
    [docxOptions, view],
  );
  useEffect(() => {
    fetchData(`${API_EMPLOYEE_GET_AUTHORITY}?authority=true`)
      .then(data => {
        console.log('data', data);
        if (data && data.data) {
          setProfileAuthority(data.data);
          mergeDataEdit({ profileAuthority: data.data });
        } else setProfileAuthority();
      })
      .catch(err => {
        console.log(err, 'err');
      });
    return () => {
      mergeDataEdit({ profileAuthority: null });
    };
  }, []);
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
  useEffect(
    () => {
      localStorage.setItem('AuthoriyDocument', index);
    },
    [index],
  );
  useEffect(
    () => {
      localStorage.setItem('IncommingDocumentAuthorTab', rootTab);
    },
    [rootTab],
  );

  useEffect(
    () => {
      localStorage.setItem('OutGoingDocumentAuthorTab', rootTab2);
    },
    [rootTab2],
  );
  useEffect(() => {
    // profileAuthority && profileAuthority.type && profileAuthority.type.includes('outlineDoc')
    if (profileAuthority && profileAuthority.type && profileAuthority.type.includes('outlineDoc')) {
      setCheckDocument(true)
    }
  }, [profileAuthority])
  useEffect(
    () => {
      setCanView(false);
      if (tab === 0) localStorage.setItem('Processor', 'Chờ xử lý');
      else if (tab === 6) localStorage.setItem('Processor', 'Đã xử lý');
      else localStorage.removeItem('Processor');
    },
    [tab],
  );
  useEffect(
    () => {
      if (index === 'outAuthority') {
        if (typeof rootTab2 !== 'string') {
          setRootTab2('processing');
          console.log('receive receive receive', rootTab2, ' nè nè');
        }
        getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/outGoingDocument`).then(res => {
          if (res) {
            setTemplatesGo([{ ...res }]);
          } else {
            onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng dự thảo', status: true });
          }
        });
        fetchData(`${API_ROLE_APP}/OutGoingDocument/${props.profile._id}?authority=true`)
          .then(res => {
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
            setBusinessRoleGoDocument(newBusinessRole);
          })
          .catch(error => { });
      }
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
      case 'support':
      case 'view':
        let newValue = `${value}ers`;
        return newValue;
      case 'command':
        return 'commander';
    }
  };

  const getValueTabByRole2 = value => {
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

  useEffect(
    () => {
      if (index === 'inAuthority') {
        // if (typeof rootTab !== 'string') {
        //   setRootTab('receive');
        // }
        getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/inCommingDocument`).then(res => {
          if (res) {
            setTemplates([{ ...res }]);
          } else {
            onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng dự thảo', status: true });
          }
        });
        fetchData(`${API_ROLE_APP}/IncommingDocument/${props.profile._id}?authority=true`)
          .then(res => {
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
            setBusinessRole(newBusinessRole);
          })
          .catch(error => { });
      }
    },
    [index],
  );

  useEffect(() => {
    localStorage.removeItem('IncommingDocumentAuthorTab');
    localStorage.removeItem('OutGoingDocumentAuthorTab');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack');
    localStorage.removeItem('addWorkingScheduleCallback');
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');

    fetchData(`${API_ROLE_APP}/AuthorityDocument/${props.profile._id}`).then(res => {
      const newBusinessRole = {};
      const { roles } = res;
      const code = 'AUTHORITY';

      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
      if (foundRoleDepartment) {
        const { data } = foundRoleDepartment;
        let check = false;
        if (data) {
          data.forEach(d => {
            newBusinessRole[d.name] = d.data.view;
            if (!check && d.data.view) {
              check = true;
            }
          });
        }
      }
      if (typeof index !== 'string') {
        let roleArr = (newBusinessRole && Object.keys(newBusinessRole).filter(f => !f.includes('_') && newBusinessRole[f])) || [];
        setIndex(roleArr[0]);
      }
      setAuthorityRole(newBusinessRole);
    });
  }, []);
  // check11

  useEffect(() => {
    fetchData(`${API_ROLE_APP}/IncommingDocument/${props.profile._id}?authority=true`).then(res => {
      const newBusinessRole = {};
      const { roles } = res;
      const code = 'BUSSINES';

      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
      setAllRoles(foundRoleDepartment);
      if (foundRoleDepartment) {
        const { data } = foundRoleDepartment;
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
      console.log(typeof rootTab, 'typeof rootTab', rootTab);
      if (typeof rootTab !== 'string' || rootTab === 'null') {
        let roleArr = (newBusinessRole && Object.keys(newBusinessRole).filter(f => !f.includes('_') && newBusinessRole[f])) || [];
        console.log(roleArr, 'roleArr');
        if (roleArr.length > 0) {
          console.log(getValueTabByRole(roleArr[0]), 'getValueTabByRole(roleArr[0])', roleArr[0]);
          setRootTab(getValueTabByRole(roleArr[0]));
          mergeData({ tab: 0 });
        }
      } else {
        mergeData({ tab: tab });
      }
    });
  }, []);

  useEffect(() => {
    fetchData(`${API_ROLE_APP}/OutGoingDocument/${props.profile._id}?authority=true`).then(res => {
      const newBusinessRole = {};
      const { roles } = res;
      const code = 'BUSSINES';

      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
      setAllGoRoles(foundRoleDepartment);
      if (foundRoleDepartment) {
        const { data } = foundRoleDepartment;
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
          console.log(roleArr, 'roleArr roleArr roleArr');
          const newRole = roleArr.filter(el => el !== 'receive');
          console.log(newRole, 'newRole');
          const currentRole = newRole && newRole.length && newRole[0];
          const newIndex = roleArr.indexOf(currentRole);
          console.log(currentRole, 'currentRole', newIndex);

          console.log(getValueTabByRole2(roleArr[newIndex]), 'getValueTabByRole2(roleArr[newIndex])');
          setRootTab2(getValueTabByRole2(roleArr[newIndex]));
          console.log(newIndex, 'newIndex');
          mergeData({ tab: 1 });
        }
      } else {
        console.log('nsjvnsjvnd: ', tab);
        if (tab == 0) {
          mergeData({ tab: 1 });
        } else {
          mergeData({ tab: tab });
        }
      }
      // setBusinessRole(newBusinessRole);
    });
  }, []);

  useEffect(
    () => {
      if ((index === 'inAuthority' || index === 'outAuthority') && infoDoc && processedsReturnDoc.length > 0) {
        let findIndex;
        if (infoDoc && infoDoc.author) {
          findIndex = processedsReturnDoc.findIndex(f => f === infoDoc.author);
        } else {
          findIndex = processedsReturnDoc.findIndex(f => f === profile._id);
        }
        let result = [];
        result = findIndex !== -1 ? [processedsReturnDoc[0]] : [processedsReturnDoc[processedsReturnDoc.length - 1]];
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
                setAllowedUsers([res.data]);
                setCurrentRole(res.data.roleGroupSource);
              }
            });
      }
    },
    [index, processedsReturnDoc, infoDoc],
  );
  useEffect(
    () => {
      if ((index === 'inAuthority' || index === 'outAuthority') && selectedDocs.length > 0) {
        let [id] = selectedDocs;
        let url = index === 'inAuthority' ? `${API_INCOMMING_DOCUMENT}/${id}` : `${API_GOING_DOCUMENT}/${id}`;
        fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            if (data) {
              setProcessedsReturnDoc(data.processeds);
              setInfoDoc(data);
              setCurrentRole(data.currentRole);
            }
          });
      }
    },
    [selectedDocs, index],
  );
  useEffect(
    () => {
      if (allRoles && profile) {
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
    [allRoles, profile],
  );

  useEffect(
    () => {
      if (allGoRoles && profile) {
        let newCurrRole = '';
        if (rootTab2 === 'receive') {
          newCurrRole = 'receive';
        }
        if (rootTab2 === 'processors') {
          newCurrRole = 'processing';
        }
        if (rootTab2 === 'release') {
          newCurrRole = 'promulgate';
        }
        if (rootTab2 === 'outgoing') {
          newCurrRole = 'textGo';
        }
        if (rootTab2 === 'feedback') {
          newCurrRole = 'feedback';
        }
        const newBusinessRole = (allGoRoles && allGoRoles.data && allGoRoles.data.find(a => a.name === newCurrRole)) || {};
        setBusinessGoRoleSelect(newBusinessRole && newBusinessRole.data);
      }
    },
    [index, rootTab2, allGoRoles, profile],
  );

  useEffect(() => {
    // fetch(`${API_INCOMMING_DOCUMENT_COUNT}?authority=true`, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`,
    //   },
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     setCountIncommingDocument(data.countDocumentarys + data.documentCommanders + data.documentarysProcessors + data.documentarysSupporters + data.documentarysViewers + data.feedBackCount);
    //     setLocalState(data);
    //   });
    fetch(`${API_INCOMMING_DOCUMENT_COUNT_AUTHORIZED}?authority=true`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setCountIncommingDocument(
          (data.documentCommanders || 0) +
          (data.documentarysProcessors || 0) +
          (data.documentarysSupporters || 0) +
          (data.documentarysViewers || 0) +
          (data.feedBackCount || 0),
        );
        setLocalState(data);
      });
  }, []);

  useEffect(
    () => {
      if (openPreview && selectUrl === 'xlsx') {
        displayFileExcel(filePreview);
      }
      if (openPreview && selectUrl === 'xls') {
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
      setCanView(false);
    },
    [tab],
  );

  useEffect(
    () => {
      if (show && previewHtml !== '') {
        show.innerHTML = previewHtml;
      }
    },
    [previewHtml, openPreview],
  );

  const getExtensionFile = name => {
    let ext = name.split('.');
    return ext[ext.length - 1];
  };

  const onClickAttachFile = f => {
    let extension = f.name && getExtensionFile(f.name);
    setOpenPreview(true);
    if (f.id === undefined) {
      setSelectedUrl(extension);
      setFilePreview(URL.createObjectURL(f));
    } else {
      if (extension && FILES.indexOf(extension) === -1) {
        setSelectedUrl(`${UPLOAD_APP_URL}/files/${f.id}`);
      }
      if (FILES.indexOf(extension) !== -1) {
        setSelectedUrl(extension);
        setFilePreview(`${UPLOAD_APP_URL}/files/${f.id}`);
      }
    }
  };

  const mapFunction = item => {
    return {
      ...item,
      startDate: moment(item.startDate, 'DD/MM/YYYY HH:mm'),
      endDate: moment(item.endDate, 'DD/MM/YYYY HH:mm'),
      originalEndDate: moment(item.originalEndDate, 'DD/MM/YYYY HH:mm'),
      releaseDate: moment(item.releaseDate).format('DD/MM/YYYY'),
      abstractNote: <p style={{ width: 360, wordBreak: 'break-all' }}>{item.abstractNote && getShortNote(item.abstractNote, 80)}</p>,
      url: item.originItem.url ? (
        <>
          {Array.isArray(item.originItem.url) &&
            item.originItem.url.map(f => (
              <div
                onClick={e => {
                  e.stopPropagation();
                  onClickAttachFile(f);
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
  const mapFunctionDocOut = item => {
    return {
      ...item,
      startDate: moment(item.startDate, 'DD/MM/YYYY HH:mm'),
      endDate: moment(item.endDate, 'DD/MM/YYYY HH:mm'),
      originalEndDate: moment(item.originalEndDate, 'DD/MM/YYYY HH:mm'),
      releaseDate: moment(item.releaseDate).format('DD/MM/YYYY'),
      // abstractNote: <p style={{ width: 360, wordBreak: 'break-all' }}>{item.abstractNote && getShortNote(item.abstractNote, 80)}</p>,
      abstractNote:
        item.abstractNote.length < 150 ? (
          item.abstractNote
        ) : (
          <>
            <Tooltip title={item.abstractNote} classes={{ tooltip: { maxWidth: 800 } }}>
              <p>{getShortNote(item.abstractNote, 150)}</p>
            </Tooltip>
          </>
        ),
      url: item.originItem.url ? (
        <>
          {Array.isArray(item.originItem.url) &&
            item.originItem.url.map(f => (
              <div
                onClick={e => {
                  e.stopPropagation();
                  onClickAttachFile(f);
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
  // const mapFunctionDoc = item => {
  //   const kanbanStt = JSON.parse(localStorage.getItem('crmStatus'));
  //   const kanbanSttData = kanbanStt && kanbanStt.find(item => item.code === 'ST21').data;
  //   const customKanbanStt = data => {
  //     const data1 = (kanbanSttData && kanbanSttData.find(item => item.type === data)) || {};
  //     return data1.name;
  //   };
  //   const customDate = data => {
  //     if (data) {
  //       const times = Number(moment(item.deadline) - moment()) / 86400000;
  //       if (times < 0) {
  //         return <p style={{ color: '#e13a3a', width: 380, wordBreak: 'break-all' }}>{data}</p>;
  //       } else if (times > 0 && times > 3) {
  //         return <p style={{ wordBreak: 'break-all', width: 380 }}>{data}</p>;
  //       } else {
  //         return (
  //           <p type="button" style={{ textAlign: 'left', width: 380, color: '#3e9bfa', wordBreak: 'break-all' }}>
  //             {data}
  //           </p>
  //         );
  //       }
  //     }
  //   };
  //   return {
  //     ...item,
  //     documentDate: customDate(moment(item.documentDate, 'DD/MM/YYYY').format('DD/MM/YYYY')),
  //     toBook: customDate(item.toBook),
  //     senderUnit: customDate(item.senderUnit),
  //     // abstractNote: customDate(getShortNote(item.abstractNote, 80)),
  //     abstractNote:
  //       item.abstractNote.length < 150 ? (
  //         customDate(getShortNote(item.abstractNote, 150))
  //       ) : (
  //         <>
  //           <Tooltip title={item.abstractNote} placement="bottom-start" classes={{ tooltip: { maxWidth: 800 } }}>
  //             {customDate(getShortNote(item.abstractNote, 150))}
  //           </Tooltip>
  //         </>
  //       ),
  //     name: customDate(item.name),
  //     secondBook: customDate(item.secondBook),
  //     receiverUnit: customDate(item.receiverUnit),
  //     toBookCode: customDate(item.toBookCode),
  //     kanbanStatus: customDate(customKanbanStt(item.kanbanStatus)),
  //     documentType: customDate(item.documentType),
  //     documentField: customDate(item.documentField),
  //     receiveMethod: customDate(item.receiveMethod),
  //     privateLevel: customDate(item.privateLevel),
  //     urgencyLevel: customDate(item.urgencyLevel),
  //     signer: customDate(item.signer),
  //     processStatus: customDate(item.processStatus),
  //     currentNote: customDate(item.currentNote),
  //     currentRole: customDate(item.currentRole),
  //     nextRole: customDate(item.nextRole),
  //     letterType: customDate(item.letterType),
  //     processors: customDate(item.processors),
  //     processeds: customDate(item.processeds),
  //     createdBy: customDate(item.createdBy),
  //     stage: customDate(item.stage),
  //     currentNote: customDate(item.currentNote ? item.currentNote : ''),
  //     receiveDate: customDate(moment(item.receiveDate, 'DD/MM/YYYY').format('DD/MM/YYYY')),
  //     toBookDate: customDate(moment(item.toBookDate).format('DD/MM/YYYY')),
  //     deadline: item.deadline && moment(item.deadline).isValid() ? customDate(moment(item.deadline).format('DD/MM/YYYY')) : '',
  //     files: item.originItem.files ? (
  //       <>
  //         {item.originItem.files.map(f => (
  //           <div
  //             onClick={e => {
  //               let extension = f.name && getExtensionFile(f.name);
  //               e.stopPropagation();
  //               setOpenPreview(true);
  //               if (extension && FILES.indexOf(extension) === -1) {
  //                 setSelectedUrl(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${f.id}`);
  //               }
  //               if (FILES.indexOf(extension) !== -1) {
  //                 setSelectedUrl(extension);
  //                 setFilePreview(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${f.id}`);
  //               }
  //             }}
  //           >
  //             {f.name}{' '}
  //           </div>
  //         ))}
  //       </>
  //     ) : (
  //       ''
  //     ),
  //   };
  // };
  const mapFunctionDoc = item => {
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

  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewHtml(null);
    setFilePreview(null);
  };

  const handleSave = () => { };

  const handleOpenAddAuthoityDialog = () => {
    setSelectedAuthority({});
    setOpenDialog(true);
    setOnShowDetail(false);
  };

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenAddAuthoityDialog}>
      Thêm mới
    </Add>
  );

  const callBack = (cmd, data) => {
    console.log('callBack');
    switch (cmd) {
      case 'kanban-dragndrop-author': {
        this.props.mergeData(data);
        break;
      }
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
    setReloadPage(new Date() * 1);
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

  const handleOpen = (e, type, isReturn = false) => {
    if (type === 'command') {
      if (index === 'inAuthority') {
        setOpenSetCommanders(true);
        return;
      }
      if (index === 'outAuthority') {
        setOpenSetCommandersGo(true);
        return;
      }
    } else {
      console.log(isReturn, 'isReturn');
      if (isReturn === false) {
        setOpenDialogProcess(e.currentTarget);
        return;
      }
      if (isReturn) {
        setOpenDialogResponse(e.currentTarget);
        return;
      }
    }
  };

  const handleClose = e => {
    setOpenDialog(null);
    setOpenDialogCommand(null);
    setOpenDialogResponse(null);
    setOpenDialogSupport(null);
    setReturnDocType('');
    setOpenDialogProcess(null);
    setOpenReturnDocs(false);
    setOpenAsignProcessor(false);
    setOpenAsignProcessorGo(false);
    setOpenSetCommanders(false);
  };

  function handleViewType() {
    setShowTemplates(true);
  }

  const checkShowReturn = () => {
    if (rootTab === 'receive') return false;
    if (rootTab === 'processors') {
      return businessRole && businessRole.processing_return_docs;
    }
    if (rootTab === 'supporters') {
      return businessRole && businessRole.support_return_docs;
    }
    if (rootTab === 'viewers') {
      return businessRole && businessRole.view_return_docs;
    }
    if (rootTab === 'commander') {
      return businessRole && businessRole.command_return_docs;
    }
    if (rootTab === 'feedback') {
      return businessRole && businessRole.feedback_return_docs;
    }
  };
  const checkShowReturnGoDocument = () => {
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

  const handleOpenDialogDoc = (bool, type, direction) => {
    if (type === 'assign') {
      if (index === 'outAuthority') {
        console.log('setOpenAsignProcessorGo');
        setOpenAsignProcessorGo(bool);
      } else {
        setOpenAsignProcessor(bool);
      }
    } else if (type === 'release') {
      setOpenRelease(bool);
    } else {
      setOpenReturnDocs(bool);
      setReturnDocType(type);
    }
    console.log(direction, 'direction');
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
  const handleSelectTemplate = (bool, template, type) => {
    if (index === 'outAuthority') {
      setSelectedTemplate(template);
      setNextRole(template.code);
      setOpenAsignProcessorGo(bool);
      setGoTypeProcess('flow');
    } else {
      if (type !== 'any') {
        setNextRole(template.code);
        setSelectedTemplate(template);
        setOpenAsignProcessor(bool);
        setProcessType(type);
      }
      if (type === 'any') {
        let role = getRole(template);
        setProcessType(type);
        setNextRole(role);
        template[0] && template[0].children && setSelectedTemplate(template[0].children);
        template[0] && setSendUnit(template[0].sendUnit);
        template[0] && setAllowSendToUnit(template[0].allowSendToUnit);
        setOpenAsignProcessor(bool);
      }
    }
  };

  const handleSelectReturnTemplate = (bool, template, type) => {
    setSelectedTemplate(template);
    setReturnDocType(type);
    infoDoc && infoDoc.template && findNode([infoDoc.template], template, 0);
  };

  // const openTitleDialog = (id, role, tab, typeDoc) => {
  //   localStorage.setItem('IncommingDocumentProcess', JSON.stringify(selectedProcess));
  //   let type = typeDoc ? 1 : 0;
  //   // check có phải sơ loại hay không
  //   props.history.push({
  //     pathname: `incomming-document-detail/${id}?role=${role}&tab=${tab}&isAuthory=true&typeDoc=${type || 0}`,
  //     id: id,
  //   });
  // };
  const handleOpenEditExecutiveDocumentsDialog = useCallback(id => {
    setOpenEditDialog(true);
    setSelected(id);
  }, []);
  const handleCloseEditExecutiveDocumentsDialog = useCallback(() => {
    setOpenEditDialog(false);
    setSelected(null);
  }, []);
  const handleCloseViewExecutiveDocumentsDialog = useCallback(() => {
    setOpenViewDialog(false);
    setSelected(null);
  }, []);
  const handleOpenViewExecutiveDocumentsDialog = useCallback(id => {
    setOpenViewDialog(true);
    setSelected(id);
  }, []);
  const openTitleDialog = (id, role, tab, typeDoc) => {
    console.log(tab, "sbdhsbdv")
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
    props.history.push({
      pathname: `incomming-document-detail/${id}?role=${role}&tab=${tab}&isAuthory=true&typeDoc=${type || 0}`,
      id: id,
    });
  };
  const openEditOutPage = (id, role) => {
    props.history.push({
      pathname: `OutGoingDocument/${id}?role=${role}&isAuthory=true`,
      id: id,
    });
  };

  const openOutTitleDialog = (id, role, tab) => {
    localStorage.setItem('IncommingDocumentProcess', JSON.stringify(selectedProcess));
    props.history.push({
      pathname: `OutGoingDocument/editGoDocuments/${id}?role=${role}&tab=${tab}&isAuthory=true`,
      id: id,
    });
  };

  const handleSelectedDoc = (docIds, val) => {
    setSelectedDocs(docIds);
    setSelectedDocData(val && val[0] ? val[0] : null);
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
  const OpenExecutiveDocumenDialog = () => {
    console.log('OpenExecutiveDocumenDialog');
    props.history.push('/IncommingDocument/add');
  };
  const OpenGoDocumenDialog = () => {
    console.log('OpenExecutiveDocumenDialog');
    props.history.push('/ReleaseDocument/add');
  };
  const getStateSelection = e => {
    Array.isArray(e) && e.length > 0 ? setCanView(true) : setCanView(false);
  };

  useEffect(() => {
    // const apiUrl = API_OUTGOING_DOCUMENT_COUNT;
    // fetch(`${apiUrl}?authority=true`, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`,
    //   },
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     setCountOutgoingDocument(data.countDocumentarys + data.documentGoing + data.documentarysProcessors + data.documentarysRelease + data.feedBackCount);
    //     setDocumentGo(data);
    //   });
    const apiUrl = API_OUTGOING_DOCUMENT_COUNT_AUTHORIZED;
    fetch(`${apiUrl}?authority=true`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setCountOutgoingDocument(
          (data.countDocumentarys || 0) +
          (data.documentGoing || 0) +
          (data.documentarysProcessors || 0) +
          (data.documentarysRelease || 0) +
          (data.feedBackCount || 0),
        );
        setDocumentGo(data);
      });
  }, []);

  useEffect(
    () => {
      if (infoDoc.children && infoDoc.children.length > 0 && selectedTemplate) {
        setRoleForProcess(selectedTemplate.code);
      }
      if (infoDoc.author) {
        fetchData(`${API_AUTHORY_PROFILE}/${infoDoc.author}`).then(res => {
          if (res && res.data) {
            setAuthoryProfile(res.data);
          }
        });
      }
    },
    [selectedTemplate, infoDoc],
  );
  const handleViewDoc = () => {
    // const url = isAuthory ? `${API_INCOMMING_DOCUMENT}/set-status?authority=true` : `${API_INCOMMING_DOCUMENT}/set-status`;

    const body = {
      action: 'Đã xem',
      docIds: selectedDocs,
      role: 'viewers',
    };
    console.log(selectedDocs, 'handleViewDoc');
    let url;
    if (typeView === 'in') {
      url = `${API_INCOMMING_DOCUMENT}/set-status?authority=true`;
    } else {
      url = `${API_INCOMMING_DOCUMENT}/change-status?authority=true`;
    }
    console.log(url, 'url');
    request(url, {
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

  const tabStyleP = {
    fontWeight: 600,
    fontFamily: `Roboto, Helvetica, Arial, sans-serif`,
    fontSize: '12px',
    margin: 0,
  };
  const handleOpenDialogView = (open, type) => {
    setOpenDialogViewer(open);
    setTypeView(type);
  };
  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item sm={8}>
          <Tabs onChange={handleChangeTab} value={index}>
            {authorityRole && authorityRole.roleGroupSource && <Tab value="roleGroupSource" label={<p style={tabStyleP}>Quản lý ủy quyền</p>} />}
            {authorityRole &&
              authorityRole.inAuthority && (
                <Tab
                  value="inAuthority"
                  label={
                    <Badge color="primary" badgeContent={countIncommingDocument} max={9999}>
                      <p style={tabStyleP}>Văn bản đến</p>
                    </Badge>
                  }
                />
              )}
            {authorityRole &&
              authorityRole.outAuthority && (
                <Tab
                  value="outAuthority"
                  label={
                    <Badge color="primary" badgeContent={countOutgoingDocument} max={9999}>
                      <p style={tabStyleP}>Văn bản đi</p>
                    </Badge>
                  }
                />
              )}
          </Tabs>
        </Grid>
        {index === 'inAuthority' ? (
          <>
            <RoleTabs
              roles={businessRole}
              rolesByTab={businessRoleSelect}
              handleChangeTab={handleChangeRootTab}
              templates={templates}
              tab={tab}
              rootTab={rootTab}
              kanbanFilter={kanbanFilter}
              profile={authoryProfile}
              document={localState}
              checkShowReturn={checkShowReturn}
              canView={canView}
              isAuthory={true}
              openDialog={openDialogProcess}
              openDialogSupport={openDialogSupport}
              data={infoDoc}
              openDialogResponse={openDialogResponse}
              handleOpen={handleOpen}
              handleOpenDialogDoc={handleOpenDialogDoc}
              handleSelectTemplate={handleSelectTemplate}
              handleSelectReturnTemplate={handleSelectReturnTemplate}
              handleClose={handleClose}
              history={props.history}
              docData={selectedDocData}
              setOpenDialogViewer={handleOpenDialogView}
              roleDepartment={roleDepartment}
            />
            <Grid container>
              {profileAuthority &&
                profileAuthority.type &&
                profileAuthority.type.includes('outlineDoc') && (
                  <Grid item sm={profileAuthority && profileAuthority.type && profileAuthority.type.includes('outlineDoc') ? 4 : 0} container>
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
              <Grid item sm={12}>
                {/* <Bt onClick={() => mergeData({ tab: 3 })} color={tab === 3 ? 'gradient' : 'simple'}>
                  Bảng tự động hóa
                </Bt>
                <Bt onClick={() => mergeData({ tab: 1 })} color={tab === 1 ? 'gradient' : 'simple'}>
                  Trạng thái
                </Bt> */}
                {/* {rootTab === 'processors' || rootTab === 'supporters' ? (
                  <Bt onClick={() => mergeData({ tab: 5 })} color={tab === 5 ? 'gradient' : 'simple'}>
                    Hoàn thành
                  </Bt>
                ) : null} */}
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
                <Bt onClick={() => mergeData({ tab: 0 })} color={tab === 0 ? 'gradient' : 'simple'}>
                  {rootTab === 'receive'
                    ? 'Tiếp nhận'
                    : rootTab === 'processors' || rootTab === 'supporters' || rootTab === 'viewers'
                      ? 'Chưa xử lý'
                      : rootTab === 'commander'
                        ? 'Chưa chỉ đạo'
                        : rootTab === 'feedback'
                          ? 'Chờ cho ý kiến'
                          : ''}
                </Bt>
              </Grid>
            </Grid>
          </>
        ) : null}

        {index === 'outAuthority' ? (
          <>
            <RoleTabs
              roles={businessRoleGoDocument}
              rolesByTab={businessGoRoleSelect}
              handleChangeTab={handleChangeRootTabGoDocument}
              templates={templatesGo}
              rootTab={rootTab2}
              isAuthory={true}
              document={documentGo}
              tab={tab}
              data={infoDoc}
              checkShowReturn={checkShowReturnGoDocument}
              canView={canView}
              profile={authoryProfile}
              openDialog={openDialogProcess}
              openDialogResponse={openDialogResponse}
              handleOpen={handleOpen}
              handleOpenDialogDoc={handleOpenDialogDoc}
              handleSelectTemplate={handleSelectTemplate}
              employeeReturn={allowedUsers}
              handleClose={handleClose}
              docType="goDocument"
            />
            <Grid container>
              <Grid item sm="12">
                {/* <Bt onClick={() => mergeData({ tab: 3 })} color={tab === 3 ? 'gradient' : 'simple'}>
                  Bảng tự động hóa
                </Bt> */}
                {/* {(rootTab2 === 'receive' || rootTab2 === 'processors' || rootTab2 === 'promulgate' || rootTab2 === 'textGo') && (
                    <Bt onClick={() => mergeData({ tab: 2 })} color={tab === 2 ? 'gradient' : 'simple'}>
                      Luồng văn bản
                    </Bt>
                  )} */}

                {/* <Bt onClick={() => mergeData({ tab: 1 })} color={tab === 1 ? 'gradient' : 'simple'}>
                  Trạng thái
                </Bt> */}

                {(rootTab2 === 'receive' || rootTab2 === 'promulgate' || rootTab2 === 'feedback' || rootTab2 === 'processors') && (
                  <Bt onClick={() => mergeData({ tab: 5 })} color={tab === 5 ? 'gradient' : 'simple'}>
                    {rootTab2 === 'receive' || rootTab2 === 'promulgate' || rootTab2 === 'processors'
                      ? 'Đã ban hành'
                      : rootTab2 === 'feedback'
                        ? 'Đã cho ý kiến'
                        : ''}
                  </Bt>
                )}
                {rootTab2 === 'processors' && (
                  <Bt onClick={() => mergeData({ tab: 6 })} color={tab === 6 ? 'gradient' : 'simple'}>
                    Đã xử lý
                  </Bt>
                )}
                {rootTab2 === 'receive' && (
                  <Bt onClick={() => mergeData({ tab: 4 })} color={tab === 4 ? 'gradient' : 'simple'}>
                    Đã trình ký
                  </Bt>
                )}
                {rootTab2 === 'textGo' && (
                  <Bt onClick={() => mergeData({ tab: 8 })} color={tab === 8 ? 'gradient' : 'simple'}>
                    Đã xử lý
                  </Bt>
                )}
                <Bt onClick={() => mergeData({ tab: 0 })} color={tab === 0 ? 'gradient' : 'simple'}>
                  {rootTab2 === 'receive'
                    ? 'Dự thảo'
                    : rootTab2 === 'promulgate'
                      ? 'Chờ ban hành'
                      : rootTab2 === 'textGo'
                        ? 'Chưa xử lý'
                        : rootTab2 === 'processors'
                          ? 'Chờ xử lý'
                          : rootTab2 === 'feedback'
                            ? 'Chờ cho ý kiến'
                            : ''}
                </Bt>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Grid>
      <div style={{ zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px' }}>
        <PaperUI style={{ zIndex: '0 !important' }}>
          {index === 'roleGroupSource' && (
            <ListPage
              withPagination
              settingBar={[addItem()]}
              disableAdd
              copyFunction={() => { }}
              onEdit={row => {
                setSelectedAuthority(row && row.originItem);
                setOpenDialog(true);
                setOnShowDetail(false);
              }}
              onRowClick={row => {
                setSelectedAuthority(row && row.originItem);
                setOpenDialog(true);
                setOnShowDetail(true);
              }}
              showDepartmentAndEmployeeFilter
              exportExcel
              enableView
              mapFunction={mapFunction}
              disableEmployee
              code="AuthorityDocument"
              employeeFilterKey="createdBy"
              apiUrl={API_AUTHORITY_DOCUMENT}
              kanbanKey="type"
              listMenus={[]}
              reload={reload}
              filter={{ $or: [{ authorized: profile._id }, { author: profile._id }] }}
            />
          )}
          {index === 'inAuthority' && (
            <>
              <div>
                <WrapperListPage
                  tab={tab}
                  rootTab={rootTab}
                  kanbanFilter={kanbanFilter}
                  profile={profile}
                  openTitleDialog={openTitleDialog}
                  handleSelectedDoc={handleSelectedDoc}
                  handleSetCurrentRole={handleSetCurrentRole}
                  handleSetProcessed={handleSetProcessed}
                  getStateSelection={getStateSelection}
                  OpenExecutiveDocumenDialog={OpenExecutiveDocumenDialog}
                  handleSetSelectProcess={handleSetSelectProcess}
                  mapFunction={mapFunctionDoc}
                  reloadPage={reloadPage}
                  businessRoleSelect={businessRoleSelect}
                  // tab1
                  typePage="authority"
                  templates={templates}
                  reload={reload}
                  callBack={callBack}
                  history={props.history}
                  selectedProcess={selectedProcess}
                  lands={lands}
                  roleDepartment={roleDepartment}
                  isAuthory={true}
                  checkListDocument={checkDocument}
                  profileAuthority={profileAuthority}
                  setReloadPage={() => setReloadPage(new Date() * 1)}
                  permissionOutLineDoc={(profileAuthority && profileAuthority.type && profileAuthority.type.includes('outlineDoc')) || false}
                />
              </div>
            </>
          )}
          {index === 'outAuthority' && (
            <>
              <div>
                <WrapperListPageGo
                  tab={tab}
                  rootTab={rootTab2}
                  kanbanFilter={kanbanFilter}
                  profile={profile}
                  openEditPage={openEditOutPage}
                  openTitleDialog={openOutTitleDialog}
                  handleSelectedDoc={handleSelectedDoc}
                  handleSetCurrentRole={handleSetCurrentRole}
                  handleSetProcessed={handleSetProcessed}
                  getStateSelection={getStateSelection}
                  OpenExecutiveDocumenDialog={OpenGoDocumenDialog}
                  handleSetSelectProcess={handleSetSelectProcess}
                  mapFunction={mapFunctionDocOut}
                  reloadPage={reloadPage}
                  // tab1
                  typePage="authority"
                  templates={templates}
                  reload={reload}
                  isAuthory={true}
                  callBack={callBack}
                  history={props.history}
                  selectedProcess={selectedProcess}
                  kanbanCode={code}
                  roleDepartment={roleDepartment}
                  setReloadPage={() => setReloadPage(new Date() * 1)}
                />
              </div>
            </>
          )}
        </PaperUI>
      </div>

      <Dialog dialogAction={false} onClose={() => handleClosePreview()} maxWidth="lg" open={openPreview}>
        {/* check11 */}
        {selectUrl &&
          FILES.indexOf(selectUrl) === -1 && (
            <>
              <div className="wrapperImage">
                <img alt="ds" className="image-preview" style={{ transform: `rotate(${rotation}deg)` }} src={selectUrl} />
              </div>
              <Grid container justify="flex-end" spacing={8}>
                <Grid item md={1} container style={{ cursor: 'pointer' }} alignItems="center" spacing={8}>
                  <Grid item>
                    <Tooltip title="Xoay trái" onClick={() => handleRotate('left')}>
                      <RotateLeft style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Xoay phải" onClick={() => handleRotate('right')}>
                      <RotateRight style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  </Grid>
                </Grid>

                <Grid container style={{ cursor: 'pointer', justifyContent: 'flex-end' }} alignItems="center">
                  <Grid item md={'auto'} style={{ textAlign: 'right' }}>
                    <Button onClick={() => downloadFile(filePreview, 'Download')}>
                      {' '}
                      <CloudDownload /> Tải file
                    </Button>
                  </Grid>
                  <Grid item md={'auto'} style={{ textAlign: 'right' }} onClick={() => handleClosePreview()}>
                    <Button variant="outlined" color="secondary">
                      Hủy
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}

        {selectUrl &&
          selectUrl === 'docx' && (
            <>
              <Grid container style={{ cursor: 'pointer', justifyContent: 'flex-end' }} alignItems="center">
                <Grid item md={'auto'} style={{ textAlign: 'right' }}>
                  <Button onClick={() => downloadFile(filePreview, 'Download')}>
                    {' '}
                    <CloudDownload /> Tải file
                  </Button>
                </Grid>
                <Grid item md={'auto'} style={{ textAlign: 'right' }} onClick={() => handleClosePreview()}>
                  <Button variant="outlined" color="secondary">
                    Hủy
                  </Button>
                </Grid>
              </Grid>
              <div style={{ height: '80vh' }} id="docx-container" />
            </>
          )}
        {selectUrl &&
          (selectUrl === 'xlsx' || selectUrl === 'xls') && (
            <>
              <div id="show" />
              <Grid container style={{ cursor: 'pointer', justifyContent: 'flex-end' }} alignItems="center">
                <Grid item md={'auto'} style={{ textAlign: 'right' }}>
                  <Button onClick={() => downloadFile(filePreview, 'Download')}>
                    {' '}
                    <CloudDownload /> Tải file
                  </Button>
                </Grid>
                <Grid item md={'auto'} style={{ textAlign: 'right' }} onClick={() => handleClosePreview()}>
                  <Button variant="outlined" color="secondary">
                    Hủy
                  </Button>
                </Grid>
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

      <AddAuthority
        // profile={props.profile}
        code="AuthorityDocument"
        onChangeSnackbar={onChangeSnackbar}
        open={openDialog}
        onSave={handleSave}
        onSuccess={() => {
          handleCloseAddAuthorityDialog();
          setReload(new Date() * 1);
        }}
        onClose={handleCloseAddAuthorityDialog}
        mergeData={mergeData}
        addAuthorityDialog={SelectedAuthority}
        onClickAttachFile={onClickAttachFile}
        onShowDetail={onShowDetail}
      />

      <DocumentAssignModal
        open={openAsignProcessor}
        docIds={selectedDocs}
        isAuthory={true}
        info={infoDoc}
        typePage="authority"
        template={templates}
        profile={profile}
        child={infoDoc.children ? infoDoc.children : []}
        childTemplate={selectedTemplate}
        processType={processType}
        childSupport={infoDoc.childrenSupport ? infoDoc.childrenSupport : []}
        currentRole={roleForProcess ? roleForProcess : nextRole}
        role={rootTab}
        sendUnit={sendUnit}
        onClose={() => {
          setOpenAsignProcessor(false);
        }}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setOpenAsignProcessor(false);
          setOpenDialogProcess(false);
          setOpenDialog(null);
          reloadState();
          setSelectedDocs([]);
          setCanView(false);
        }}
        allowSendToUnit={allowSendToUnit}
      />

      <DocumentSetCommanders
        open={openSetCommanders}
        docIds={selectedDocs}
        onClose={() => {
          setOpenSetCommanders(false);
        }}
        typePage="authority"
        role={rootTab}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setOpenSetCommanders(false);
          reloadState();
        }}
      />
      {index === 'inAuthority' ? (
        <ReturnDocs
          open={openReturnDocs}
          docIds={selectedDocs}
          type={returnDocType}
          role={rootTab}
          currentRole={currentRole}
          childTemplate={selectedTemplate}
          template={templates}
          isAuthory={true}
          processeds={processedsReturnDoc}
          typePage="authority"
          onClose={() => {
            setOpenReturnDocs(false);
            setReturnDocType('');
            setCanView();
          }}
          onChangeSnackbar={onChangeSnackbar}
          onSuccess={() => {
            setOpenReturnDocs(false);
            setReturnDocType('');
            setOpenDialog(null);
            reloadState();
            setCanView();
          }}
          typeFlow={typeFlow}
          data={infoDoc}
        />
      ) : (
        <ReturnDocsGo
          open={openReturnDocs}
          docIds={selectedDocs}
          type={returnDocType}
          role={rootTab2}
          template={templatesGo}
          isAuthory={true}
          childTemplate={infoDoc && infoDoc.children}
          processeds={processedsReturnDoc}
          employeeReturn={allowedUsers}
          onClose={() => {
            setOpenReturnDocs(false);
            setReturnDocType('');
          }}
          onChangeSnackbar={onChangeSnackbar}
          onSuccess={() => {
            setOpenReturnDocs(false);
            setReturnDocType('');
            setAllowedUsers([]);
            reloadState();
          }}
        />
      )}

      <ReleaseDocs
        docIds={selectedDocs}
        open={openRelease}
        onClose={() => {
          setOpenRelease(false);
        }}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setOpenRelease(false);
          props.history.goBack();
        }}
      />

      <DocumentAssignModalGo
        open={openAsignProcessorGo}
        docIds={selectedDocs}
        role={rootTab2}
        info={infoDoc}
        currentRole={roleForProcess ? roleForProcess : currentRole}
        template={templatesGo}
        profile={profile}
        isAuthory={true}
        typeProcess={goTypeProcess}
        childTemplate={selectedTemplate}
        typePage="authority"
        onClose={() => {
          setOpenAsignProcessorGo(false);
        }}
        onChangeSnackbar={onChangeSnackbar}
      />

      <DocumentSetCommandersGo
        open={openSetCommandersGo}
        role={rootTab2}
        docIds={selectedDocs}
        typePage="authority"
        onClose={() => {
          setOpenSetCommandersGo(false);
        }}
        onChangeSnackbar={onChangeSnackbar}
      />
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
      {/* <ReturnDocsGo
        open={openReturnDocsGo}
        docIds={selectedDocs}
        onClose={() => {
          setOpenReturnDocsGo(false);
        }}
        onChangeSnackbar={onChangeSnackbar}
      /> */}

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
    </div>
  );
}

Authority.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  authority: makeSelectAuthority(),
  miniActive: makeSelectMiniActive(),
  // dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    mergeDataEdit: data => dispatch(mergeDataEdit(data)),

    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'authority', reducer });
// const withSaga = injectSaga({ key: 'authority', saga });

export default compose(
  withReducer,
  // withSaga,
  withConnect,
)(Authority);

const customContent = [
  {
    title: 'Số đếnsss',
    fieldName: 'toBookCode',
    type: 'string',
  },
  {
    title: 'Số VB',
    fieldName: 'toBook',
    type: 'string',
  },
];
