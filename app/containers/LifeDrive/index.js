import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import moment from 'moment';
import PropTypes from 'prop-types';
import _, { filter, rest } from 'lodash';
import { UPLOAD_FILE_METADATA } from 'config/urlConfig';
import {
  Tab,
  Tabs,
  Card,
  Fab as Fa,
  Button,
  Menu,
  MenuItem,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  LinearProgress,
} from '@material-ui/core';
import { Dialog as DialogMUI } from '@material-ui/core';
import FilesManager from './FilesManager';
import DetailFile from './DetailFile';
import { makeSelectProfile, makeSelectRole } from '../Dashboard/selectors';

import { CardTravel, NextWeek, Receipt } from '@material-ui/icons';
import CustomChartFiles from './CustomChartFiles';
import FilesChart from './DashboardFiles';

import makeSelectLifeDrive from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Grid, Typography, Tooltip } from '@material-ui/core';
import { changeSnackbar, closeSnackbar } from 'containers/Dashboard/actions';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import {
  UPLOAD_APP_URL,
  API_PROFILE,
  API_WORD_ADDON_UPLOAD,
  SEARCH_IMAGE,
  SEARCH_VIDEO,
  APP_URL,
  API_REPORT_USED,
  API_REPORT_USED_REPORT,
  API_ROLE_APP,
} from '../../config/urlConfig';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import iconsAdd from '../../assets/img/icon/iconsAdd.svg';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { Delete } from '@material-ui/icons';
import { clientId, allowedFileExts } from '../../variable';
import { fetchData } from '../../helper';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { serialize } from "../../helper"
import iconsfolder from '../../assets/img/icon/iconsfolder.png';
import Capacity from './Capacity';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import './styles.scss';
const allowedExtensions = allowedFileExts.join(',');
const sharedFileModel = {
  path: '',
  permissions: [],
  type: '',
  users: [],
  id: '',
  fullPath: '',
};
// L10n.load(language);

function LifeDrive(props) {
  const [tab, setTab] = useState('');
  const [detailItem, setDetailItem] = useState({});
  const [listFolderDefault, setListFolderDefault] = useState([]);
  const [listFile, setListFile] = useState([]);
  const [hostUrl, setHostUrl] = useState(`${UPLOAD_APP_URL}/file-system`);
  const [isDetail, setIsDetail] = useState(false);
  const [currentFolder, setCurrentFolder] = useState({});
  const [nameFolder, setNameFolder] = useState('');
  const [disableBtnAdd, setDisableBtnAdd] = useState(true);
  const [metaDataOthers, setMetaDataOthers] = useState('');
  const [typeEdit, setTypeEdit] = useState('');
  const [loading, setLoading] = useState(true);

  const [openDialogOCR, setOpenDialogOCR] = useState(false);
  const [openDialogSmart, setOpenDialogSmart] = useState(false);
  const [openDialogSearchImage, setOpenDialogSearchImage] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(null);
  const [openDialogAddFolder, setOpenDialogAddFolder] = useState(false);
  const [openDialogAddFile, setOpenDialogAddFile] = useState(false);
  const [isAddFolder, setIsAddFolder] = useState(false);

  const [columnXYRevenueChart, setColumnXYRevenueChart] = useState([]);
  const [dataUsed, setDataUsed] = useState({});
  const [userName, setUserName] = useState();
  const [progress, setProgress] = React.useState(0);
  const [allProcess, setAllProcess] = React.useState(0);
  const [searchContent, setSearchContent] = React.useState('');
  const [loadingCallApi, setLoadingCallApi] = React.useState(false);
  const [historyItem, setHistoryItem] = React.useState({});
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isDelete, setIsDelete] = useState(true)
  const [isUpload, setIsUpload] = React.useState(false);

  const [searchImage, setSearchImage] = useState({
    numberImage: 10,
    typeSearch: '',
  });
  const [capacity, setCapacity] = useState({
    storageCapacity: 0, // dung lượng tối đa có ký hiệu
    usedStorage: 0, // dung lượng đang sử dụng có ký hiệu
    maxCapacity: 0, // dung lượng tối đa không có ký hiệu tính bằng byte
    currentCapacity: 0, // dung lượng đang sử dụng không có ký hiệu tính bằng byte
  });
  const [smartForms, setSmartForms] = useState('');

  useEffect(
    () => {
      console.log(smartForms, 'smartForm');
    },
    [smartForms],
  );
  const [reload, setReload] = useState(new Date() * 1);
  const [loadingPage, setLoadingPage] = useState(false);
  const [optionSearch, setOptionSearch] = useState({
    normal: true,
    nlp: false,
  });
  const parentPath = `${clientId}/company/`;
  const parentPathReplace = `${clientId}/company/`;

  const ReportBox = props => (
    <div
      item
      md={4}
      spacing={4}
      style={{ background: props.color, borderRadius: '3px', padding: '25px 10px', width: '26%', position: 'relative', marginLeft: 10 }}
    >
      <div style={{ padding: 5, zIndex: 999 }}>
        <Typography style={{ color: 'white' }} variant="h4">
          {`${props.number} GB`}
        </Typography>
        <Typography variant="body1">{props.text}</Typography>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.2,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: 88,
          fontSize: '70px',
          padding: 5,
        }}
      >
        {props.icon}
      </div>
    </div>
  );

  const usedStorage = dataUsed && dataUsed.usedStorage ? dataUsed.usedStorage : 0;
  const storageCapacity = dataUsed && dataUsed.storageCapacity ? dataUsed.storageCapacity : 1;
  const percentDataUsed = usedStorage / storageCapacity;

  const getData = async () => {
    const x = await fetchData(API_PROFILE);
    setUserName((x && x.username) || '');
  };
  const [companyRoles, setCompanyRoles] = useState({});
  const [myDriveRoles, setMyDriveRoles] = useState({});
  useEffect(() => {
    fetchData(`${API_ROLE_APP}/file-manager/${props.profile._id}`).then(res => {
      let dataRole = res.roles.find(it => it.code === 'BUSSINES') || {};
      const data = dataRole.data || [];
      const CompanyDrive = data.find(it => it.name === 'CompanyDrive');
      const myDrive = data.find(it => it.name === 'MyDrive');
      setCompanyRoles(CompanyDrive.data);
      setMyDriveRoles(myDrive.data);
      if (CompanyDrive.data.view) {
        setTab('company');
      } else if (myDrive.data.view && !CompanyDrive.data.view) {
        setTab('users');
      } else if (!myDrive.data.view && !CompanyDrive.data.view) {
        setTab('share');
      }

      // dataRole &&
      //   dataRole.data &&
      //   Array.isArray(dataRole.data) &&
      //   dataRole.data.map(it => {
      //     // if (it.name === 'CompanyDrive') {
      //     //   console.log("it.name", it)
      //     //   setCompanyRoles(it.data);
      //     // } else if (it.name === 'MyDrive') {
      //     //   setMyDriveRoles(it.data);
      //     // }
      //     if (companyRoles.view) {
      //       setTab('company');
      //     } else if (myDriveRoles.view && !companyRoles.view) {
      //       setTab('users');
      //     } else if (!myDriveRoles.view && !companyRoles.view) {
      //       setTab('share');
      //     }
      //   });
    });
  }, []);
  const getDataReport = () => {
    fetch(`${API_REPORT_USED_REPORT}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setDataUsed((data && data.data) || {});
      })
      .catch(err => {
        setDataUsed({});
        console.log(err, 'err');
      });
  };

  const getDataUsed = (amount, type, typeData) => {
    fetch(`${API_REPORT_USED}?type=${type}&amount=${amount}&clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        data.data = data.data.map(item => {
          if (type === 'days') {
            item.index = moment()
              .subtract(item.index, type)
              .format('DD/MM');
          }
          if (type === 'months') {
            item.index =
              'Th. ' +
              (moment()
                .subtract(item.index, type)
                .get('months') +
                1);
          }
          if (type === 'weeks') {
            item.index =
              'Tuần ' +
              moment()
                .subtract(item.index, type)
                .get('weeks');
          }
          if (type === 'quarters') {
            item.index =
              'Qúy ' +
              moment()
                .subtract(item.index, type)
                .get('quarters') +
              ` ${moment()
                .subtract(item.index, type)
                .get('years')}`;
          }
          if (type === 'years') {
            item.index = moment()
              .subtract(item.index, type)
              .get('years')
              .toString();
          }
          if (typeData === 'B') {
            item.used = item.used;
            item.typeOfData = typeData;
          }
          if (typeData === 'KB') {
            item.used = Number.isInteger(item.used / 1024) ? item.used / 1024 : (item.used / 1024).toFixed(6);
            item.typeOfData = typeData;
          }
          if (typeData === 'MB') {
            item.used = Number.isInteger(item.used / 1048576) ? item.used / 1048576 : (item.used / 1048576).toFixed(6);
            item.typeOfData = typeData;
          }
          if (typeData === 'GB') {
            item.used = Number.isInteger(item.used / 1073741824) ? item.used / 1073741824 : (item.used / 1073741824).toFixed(6);
            item.typeOfData = typeData;
          }
          if (typeData === 'T') {
            item.used = Number.isInteger(item.used / 1099511627776) ? item.used / 1099511627776 : (item.used / 1099511627776).toFixed(6);
            item.typeOfData = typeData;
          }
          return item;
        });
        console.log(data, 'data');
        setColumnXYRevenueChart(data.data);
      });
  };

  const formatData = number => {
    let result = number / 1099511627776;
    if (Number.isInteger(result)) {
      return result;
    } else {
      return (number / 1099511627776).toFixed(6);
    }
  };

  const customFileSize = size => {
    if (size < 1024) {
      return `${size} B`;
    } else if (1024 <= size && size < 1048576) {
      const amount = size / 1024;
      return `${amount.toFixed(2)} KB`;
    } else if (1048576 <= size && size < 1073741824) {
      const amount = size / 1048576;
      return `${amount.toFixed(2)} MB`;
    } else if (1073741824 <= size && size < 1099511627776) {
      const amount = size / 1073741824;
      return `${amount.toFixed(2)} GB`;
    }
  };

  const handleChangeDetail = (e, data) => {
    if (!data) {
      setIsDetail(false);
    }
    // else {
    //   setIsDetail(true)
    // }
    console.log(data, 'data');
    setDetailItem(data || {});
    // if (data && data.isFile) handleGetHistory(data && data._id);
    if (data && data._id) handleGetHistory(data && data._id);
  };
  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
    handleChangeDetail();
  };
  useEffect(() => {
    getData();
    getDataUsed(7, 'days', 'GB');
    getDataReport();
  }, []);
  useEffect(
    () => {
      if (tab !== '') {
        console.log(tab, 'tab');
        handleGetData(true);
        // handelGetListFolder()
        handelGetCapacity();
      }
    },
    [tab],
  );
  useEffect(
    () => {
      setNameFolder((typeEdit && typeEdit.name) || '');
    },
    [typeEdit],
  );
  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
  const handelGetCapacity = () => {
    fetch(`${UPLOAD_APP_URL}/reportCapacity?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
      },
    })
      .then(response => response.json())
      .then(res => {
        setCapacity({
          storageCapacity: formatBytes(res && res.data.storageCapacity),
          usedStorage: formatBytes(res && res.data.usedStorage),
          maxCapacity: (res && res.data.storageCapacity) || 0,
          currentCapacity: (res && res.data.usedStorage) || 0,
        });
      })
      .catch(() => { });
  };

  function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.findIndex(it => item._id === it._id) === index);
  }
  const handleOpenFolderC = async (action, path, showHiddenItems, data, isAdd, nameFolder) => {
    setLoadingCallApi(true);
    let body = { action, path, showHiddenItems, data: [data] };
    if (isAdd === 'create') {
      body = {
        ...body,
        name: nameFolder,
      };
      delete body.showHiddenItems;
    } else if (isAdd === 'rename') {
      body = {
        ...body,
        newName: nameFolder,
        name: typeEdit.name,
      };
      delete body.showHiddenItems;
    }
    setLoadingCallApi(true);
    fetchData(`${hostUrl}/${tab}?clientId=${clientId}`, 'POST', body, 'token_03')
      .then(res => {
        if (res.files) {
          let file = res.files || [];
          file = file.filter(it => !it.isFile);
          let newdata = listFolderDefault || [];
          newdata.map(it => {
            if (it._id === data._id) {
              return {
                ...it,
                called: true,
              };
            } else return it;
          });
          newdata = [...file, ...newdata];
          newdata = removeDuplicates(newdata);
          // if(tab == "users"){
          //   newdata = newdata.filter((it)=> (it.canDelete=== false && it.canEdit === false))
          // }
          setListFolderDefault(handleSortFileFolder(newdata));
          if (isAdd === 'create') {
            setListFile(handleSortFileFolder(res.files || []));
            props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thành công !', variant: 'success' });
            setOpenDialogAddFolder(false);
          } else if (isAdd === 'rename') {
            props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thành công !', variant: 'success' });
            setOpenDialogAddFolder(false);
          }
          // get lại file, folder ở manager
          handleReload();
        }
      })
      .catch(err => {
        if (isAdd) {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: err.message || 'Thao tác thất bại !', variant: 'error' });
        }
      })
      .finally(() => {
        setLoadingCallApi(false);
        return true;
      });
  };

  const handleOpenFolderUpload = async (action, path, showHiddenItems, data, isAdd, nameFolder, listFolder) => {
    let body = { action, path, showHiddenItems, data: [data] };
    if (isAdd === 'create') {
      body = {
        ...body,
        name: nameFolder,
      };
      delete body.showHiddenItems;
    }
    // fetchData(url, method = 'GET', body = null, token = 'token')
    const res = await fetchData(`${hostUrl}/${tab}?clientId=${clientId}`, 'POST', body, 'token_03');
    if (res.files) {
      let file = res.files || [];
      file = file.filter(it => !it.isFile);
      let newdata = listFolderDefault || [];
      newdata.map(it => {
        if (it._id === data._id) {
          return {
            ...it,
            called: true,
          };
        } else return it;
      });
      newdata = [...file, ...newdata];
      newdata = removeDuplicates(newdata);
      // if(tab == "users"){
      //   newdata = newdata.filter((it)=> (it.canDelete=== false && it.canEdit === false))
      // }
      setListFolderDefault(handleSortFileFolder(newdata));
      if (isAdd === 'create') {
        setListFile(handleSortFileFolder(res.files || []));
      }
      if (listFolder) {
        let child = listFolder.filter(it => it.parentPath === path);
        const dataUploadNewFolder = file.pop();
        for (let i = 0; i < child.length; i++) {
          let nameFolderUpload = child[i].path.replace(`${child[i].parentPath}/`, '');
          await handleOpenFolderUpload('create', child[i].path, false, dataUploadNewFolder, 'create', nameFolderUpload, listFolder);
          // files = dataUpload.files || []
          // data = files.pop()
        }
      }

      //     }
      // get lại file, folder ở manager
      handleReload();
    }
    return res;
    // .then(res => {
    //   if (res.files) {
    //     let file = res.files || [];
    //     file = file.filter(it => !it.isFile);
    //     let newdata = listFolderDefault || [];
    //     newdata.map(it => {
    //       if (it._id === data._id) {
    //         return {
    //           ...it,
    //           called: true,
    //         };
    //       } else return it;
    //     });
    //     newdata = [...file, ...newdata];
    //     newdata = removeDuplicates(newdata);
    //     setListFolderDefault(newdata);
    //     if (isAdd === 'create') {
    //       setListFile(res.files || []);
    //     }
    //     // get lại file, folder ở manager
    //     handleReload();
    //   }
    // })
    // .catch(err => {
    //   if (isAdd) {
    //     props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: err.message || 'Thao tác thất bại !', variant: 'error' });
    //   }
    // })
    // .finally(() => {
    //   return true;
    // });
  };
  const handleSortFileFolder = files => {
    const array = _.reverse(_.map(_.sortBy(files, o => Date.parse(o.updatedAt))));
    const data = _.sortBy(array, ['isFile']);
    return data;
  };
  const handleGetData = (isDefault, action = 'read', path = '/', showHiddenItems = false, data = {}, searchContent, isDelete = false) => {
    setLoadingPage(true);
    setIsDelete(true)
    let body = {
      action,
      path,
      showHiddenItems,
      data: [data],
      nlp: (optionSearch && optionSearch.nlp) || false,
      normal: (optionSearch && optionSearch.normal) || false,
    };
    if (searchContent) {
      body = {
        ...body,
        caseSensitive: false,
        searchContent,
      };
    }
    if (isDelete) {
      body = {
        ...body,
        filter: {
          status: 3
        }
      }
      setIsDelete(false)
    }
    if (isDefault) body = { ...body, data: [] };
    fetch(`${hostUrl}/${tab}?clientId=${clientId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(res => {
        if (isDefault) {
          let newList = res.files || [];

          setListFile(handleSortFileFolder(newList));
          console.log(listFile);
          let data = [res.cwd, ...newList.filter(v => !v.isFile)];
          data = data.map(el => {
            return {
              ...el,
              open: !(el && el.parentPath) ? true : false,
              called: !(el && el.parentPath) ? true : false,
            };
          });

          setLoading(false);

          // if(tab == "users"){
          //   data = data.filter((it)=> ((it.canDelete=== false && it.canEdit === false) || it.parentPath === `${clientId}/${tab}/`))
          // }

          setListFolderDefault(handleSortFileFolder(data || []));
          setCurrentFolder(res.cwd);
        } else {
          let newList = res.files || [];

          // if(tab ==="users"){
          //   newList = newList.filter((it)=> !(it.canDelete=== false && it.canEdit === false))
          // }
          setListFile(handleSortFileFolder(newList));
        }
      })
      .catch(() => { })
      .finally(() => {
        setLoadingPage(false);
      })
      .finally(() => {
        a++;
      });
  };
  const handleDeleteItem = (action = 'delete', path = '/', data = [], namme, callback) => {
    const body = { action, path, data: data };
    setLoadingDelete(true);
    fetch(`${hostUrl}/${tab}?clientId=${clientId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(res => {
        if (!res.status) {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: res.message || 'Thao tác thất bại!', variant: 'error' });
        } else {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: res.message || 'Đã xóa thành công!', variant: 'success' });
          handleReload(false, callback);
          if (data && !data.isFile) {
            let newListFolderDefault = listFolderDefault.filter(el => el._id !== data._id);
            // if(tab == "users"){
            //   newListFolderDefault = newListFolderDefault.filter((it)=> (it.canDelete=== false && it.canEdit === false))
            // }
            setListFolderDefault(handleSortFileFolder(newListFolderDefault));
          }
        }
      })
      .catch(err => {
        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: err.message || 'Thao tác thất bại!', variant: 'error' });
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };
  // handle get detail field config
  const [listFieldConfig, setListFieldConfig] = useState([]);
  const handleGetDetailFieldConfig = () => {
    fetch(`${UPLOAD_APP}/module-config?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
      },
    })
      .then(response => response.json())
      .then(res => {
        setListFieldConfig([...Object.entries(res.data)]);
      })
      .catch(() => { });
  };
  // handle get detail field smart form
  const [listFieldSmart, setListFieldSmart] = useState([]);
  const handleGetDetailSmartForm = () => {
    const filter = { $or: [{ clientId }, { clientId: 'ALL' }] }
    const querry = serialize({ filter })
    fetch(`${DYNAMIC_FORM}/api/dynamic-forms/list?${querry}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        console.log(res, 'res');
        setListFieldSmart([...Object.entries(res.data)]);
        // setCapacity({
        //   storageCapacity: formatBytes(res && res.data.storageCapacity),
        //   usedStorage: formatBytes(res && res.data.usedStorage),
        //   maxCapacity: (res && res.data.storageCapacity) || 0,
        //   currentCapacity: (res && res.data.usedStorage) || 0,
        // });
      })
      .catch(() => { });
  };
  const [codeSelected, setCodeSelected] = useState([]);
  const handleGetDetailFieldConfig2 = title => {
    listFieldConfig.map(item => {
      if (item[1].title == title) {
        const keyItem = Object.keys(item[1].childCodes);
        console.log(keyItem, 'keyItem');
        setCodeSelected([item[0], ...keyItem]);
      }
    });
  };
  // handle get detail field smart detail
  const [listDetailSmartForm, setListDetailSmartForm] = useState([]);
  const handleGetDetailSmartForm2 = id => {
    fetch(`${DYNAMIC_FORM}/api/dynamic-forms/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log('res_smart_detail', res);
        setListDetailSmartForm(res);
        // setCapacity({
        //   storageCapacity: formatBytes(res && res.data.storageCapacity),
        //   usedStorage: formatBytes(res && res.data.usedStorage),
        //   maxCapacity: (res && res.data.storageCapacity) || 0,
        //   currentCapacity: (res && res.data.usedStorage) || 0,
        // });
      })
      .catch(() => { });
  };
  const convertString = str => {
    if (typeof str !== 'string' || !str) return '';
    // Lấy text từ thẻ input title
    let newString = str || '';
    // Đổi chữ hoa thành chữ thường
    // newString = str.toLowerCase();
    // Đổi ký tự có dấu thành không dấu
    newString = newString.replaceAll(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    newString = newString.replaceAll(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    newString = newString.replaceAll(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    newString = newString.replaceAll(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    newString = newString.replaceAll(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    newString = newString.replaceAll(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    newString = newString.replaceAll(/đ/gi, 'd');
    // Gộp nhiều dấu space thành 1 space
    // newString = newString.replace(/\s+/g, ' ');
    // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của xâu
    newString.trim();
    // In newString ra textbox có id “newString”
    return newString;
  };
  const handleReload = async (isReload, callback, noclose) => {
    // const path = currentFolder.fullPath.replace(parentPathReplace, '');
    let path = currentFolder.fullPath.split('/');
    path = `/${path
      .filter((i, idx) => {
        return idx > 1;
      })
      .join('/')}`;
    await handleOpenFolder(false, 'read', path, false, currentFolder, noclose);
    if (isReload) {
      props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Reload thành công', variant: 'success' });
    }
    if(!isDelete){
      handleGetData(false, 'search', '/', false, listFolderDefault, false, true)  
    }
    else {
      handleGetData(true)
    }
    
    if (callback) callback();
  };
  // Convert metaData từ mảng thành object
  // const handleConvertArrToObj = data => {
  //   if (Array.isArray(data)) {
  //     let newData = {};
  //     data.forEach((item, index) => {
  //       for (const it in item) {
  //         newData = { ...newData, [it]: item[it] };
  //       }
  //     });
  //     console.log(newData, 'newDataa');
  //   }
  // };
  const handleOCR = (callback, isScan, meta, file) => {
    // let file = document.getElementById('fileUpload').files[0];
    let other = []
    let data = []
    console.log(file, 'file');
    file = file && file[0];
    if (!file || typeof file === 'undefined') {
      props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Loại file không hợp lệ', variant: 'error' });
    } else {
      const form = new FormData();
      let path = currentFolder.fullPath.split('/');
      path = `/${path
        .filter((i, idx) => {
          return idx > 1;
        })
        .join('/')}/`;
      const nameFile = convertString(file.name);
      const myNewFile = new File([file], nameFile, { type: file.type });
      form.append('uploadFiles', myNewFile);
      form.append('path', path);
      form.append('action', 'save');
      form.append('data', JSON.stringify(currentFolder));
      if (isScan) {
        form.append('isScan', isScan);
      }
      form.append('model', 'FileManager');
      console.log(meta, 'meta');
      if (Array.isArray(meta)) {
        meta.forEach((item, index) => {
          if (Object.keys(item).length === 2) {
            data.push(item)
          }
          if (Object.keys(item).length === 1) {
            other.push(item)
          }
        })
      }
      console.log(data, 'data');
      console.log(other, 'other');
      const others = {
        others: other,
        smartForms,
        data
      };
      console.log('others', meta);
      form.append('metaData', JSON.stringify(others));
      console.log(form, 'form');

      fetch(`${hostUrl}/${tab}/Upload?clientId=${clientId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_03')}`,
        },
        body: form,
      })
        .then(resp => resp.json())
        .then(res => {
          console.log('res: ', res);
          if (res && res.success && res.data && Array.isArray(res.data) && res.data.length) {
            props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'OCR thành công!', variant: 'success' });
          } else {
            props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'OCR thất bại', variant: 'error' });
          }
          handleReload(false);
          setOpenDialogOCR(false);
        })
        .catch(err => {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: err.message || 'OCR thất bại', variant: 'error' });
          console.log('err: ', err);
        })
        .finally(() => {
          callback(false);
        });
    }
  };

  const handleChangeOpen = async (id, open) => {
    const currentItem = listFolderDefault.find(it => it._id === id) || {};
    const { called } = currentItem;
    console.log(currentItem, 'currentItem', called);
    if (!called) {
      let path = currentItem.fullPath.split('/');
      path = `/${path
        .filter((i, idx) => {
          return idx > 1;
        })
        .join('/')}`;
      await handleOpenFolderC('read', path, false, currentItem);
    }
    currentItem.open = open;
    const idx = listFolderDefault.findIndex(it => it._id === id);
    if (idx !== -1) {
      let newData = listFolderDefault;
      newData.splice(idx, 1, currentItem);
      // if(tab == "users"){
      //   newData = newData.filter((it)=> (it.canDelete=== false && it.canEdit === false))
      // }
      setListFolderDefault(handleSortFileFolder(newData));
    }
    setReload(new Date() * 1);
  };
  const handleOpenFolder = async (isDefault, action, path, showHiddenItems, data, noDetail) => {
    !noDetail && handleChangeDetail();
    handleGetData(isDefault, action, path, showHiddenItems, data);
    handleGetCurrentFolder(data);
  };
  const handleGetCurrentFolder = folder => {
    setCurrentFolder(folder);
  };
  const handleCreateFolderUploadFolder = async (listFiles = []) => {
    const listFolder = [];
    for (let i = 0; i < listFiles.length; i++) {
      let pathFile = listFiles[i].webkitRelativePath;
      const realpath = pathFile.slice(0, pathFile.lastIndexOf('/'));
      listFolder.push(realpath);
    }
    let uniq = [...new Set(listFolder)];
    const newlistFolder = [];
    // tính các cây thư mục chính
    uniq.map(el => {
      // const findPath = newlistFolder.find((it)=>el.includes(it))
      // if(!findPath) newlistFolder.push(el)
      let parentPath = '';
      const newList = el.split('/');
      newList.map(els => {
        newlistFolder.push({
          path: `${parentPath}/${els}`,
          parentPath: parentPath,
        });
        parentPath = `${parentPath}/${els}`;
      });
    });
    //  uniq = [...new Set(newlistFolder)]
    uniq = newlistFolder.filter((item, index) => newlistFolder.findIndex(it => item.path === it.path && item.parentPath === it.parentPath) === index);
    let data = currentFolder;
    let name = uniq[0].path.replace(`/${uniq[0].parentPath}`, '');
    await handleOpenFolderUpload('create', uniq[0].path, false, data, 'create', name, uniq);
  };
  const handleUploadFile = async callback => {
    let path = '/';
    let file;
    setIsUpload(true);
    if (!isAddFolder) file = document.getElementById('fileUploadFile').files[0];
    else file = document.getElementById('UploadFolder').files;
    console.log(file, 'file file');
    if (isAddFolder) {
      let err = false;
      try {
        // tạo folder
        // await handleCreateFolderUploadFolder(file);
        setAllProcess(file.length);
        let time = new Date() * 1;
        // return;
        for (let i = 0; i < file.length; i++) {
          const form = new FormData();
          form.append('avatarOwner', props.profile.avatar);
          console.log(props.profile.avatar);
          // lastIndexOf

          let name = file[i].name || '';
          const positionPoint = name.lastIndexOf('.');
          name = `${name.slice(0, positionPoint)}-${time}${name.slice(positionPoint)}`;
          // const myNewFile = new File([file[i]], name, { type: file[i].type });
          console.log(file[i], 'myNewFile');
          time++;
          form.append('uploadFiles', file[i]);
          form.append('path', path);
          form.append('action', 'create');
          // form.append('childPath', file[i].webkitRelativePath);
          form.append('data', JSON.stringify({ ...currentFolder, filterPath: '' }));
          let res = await fetch(`${hostUrl}/${tab}/Upload?clientId=${clientId}&childPath=${file[i].webkitRelativePath}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token_03')}`,
            },
            body: form,
          }).then(resp => resp.json());

          console.log(res, 'res');
          if (!(res && res.data && res.data.length)) {
            console.log('hahahahah');
            err = true;
            setDisableBtnAdd(false);
            handleReload(false);
            setIsUpload(false);
            return props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thất bại', variant: 'error' });
          }
          setProgress(preProgess => i + 1);
        }
        if (err) props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thất bại', variant: 'error' });

        if (callback) callback();
        handleReload(false, callback);
      } catch (error) {
        setDisableBtnAdd(false);
        handleReload(false);
        setIsUpload(false);

        props.onChangeSnackbar &&
          props.onChangeSnackbar({ status: true, message: 'Có vấn đề tải trong lúc tải dữ liệu vui lòng kiểm tra lại!', variant: 'error' });
        console.log(error, 'error');
      }
    } else {
      setAllProcess(1);
      const form = new FormData();
      form.append('uploadFiles', file);
      form.append('avatarOwner', props.profile.avatar);
      console.log(props.profile.avatar);
      form.append('path', path);
      form.append('action', 'save');
      form.append('data', JSON.stringify({ ...currentFolder, filterPath: '' }));

      fetch(`${hostUrl}/${tab}/Upload?clientId=${clientId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_03')}`,
        },
        body: form,
      })
        .then(resp => resp.json())
        .then(res => {
          console.log(res, 'shbhdbc');
          if (res && res.data && res.data.length === 0) {
            callback(false);
            props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Tập tin đã tồn tại!', variant: 'error' });
          } else if (res && res.data && res.data.length) {
            handleReload(false, callback);
          } else {
            callback(false);
            props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Tải lên thất bại', variant: 'error' });
          }
        })
        .catch(err => {
          setDisableBtnAdd(false);
          setIsUpload(false);
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: err.message || 'Tải lên thất bại', variant: 'error' });
        });
    }
  };
  const handleSearch = async keySearch => {
    const paths = (currentFolder && currentFolder.fullPath && currentFolder.fullPath.split('/')) || [];
    let path = `/${paths
      .filter((i, idx) => {
        return idx > 1;
      })
      .join('/')}`;

    await handleGetData(false, 'read', path, false, currentFolder, searchContent);
  };
  useEffect(
    () => {
      // setTimeout(()=>{
      handleSearch();

      // }, 3000)
    },
    [searchContent],
  );
  const handleUploadSmartForm = callback => {
    const form = new FormData();
    // form.append('avatarOwner', props.profile.avatar)
    let path = '/';
    if (currentFolder) {
      const paths = currentFolder && currentFolder.fullPath.split('/');
      path = `/${paths
        .filter((i, idx) => {
          return idx > 1;
        })
        .join('/')}`;
    }
    let file = document.getElementById('fileUpload').files[0];
    form.append('uploadFiles', file);
    form.append('path', path);
    form.append('action', 'save');
    form.append('data', JSON.stringify({ ...currentFolder, filterPath: '' }));
    console.log('form', form);

    fetch(`${hostUrl}/${tab}/Upload?clientId=${clientId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
      },
      body: form,
    })
      .then(response => response.json())
      .then(res => {
        let body = {
          id: res && res.data && res.data[0] && res.data[0]._id,
          model: 'FileManager',
          metaData: {
            others: metaDataOthers,
          },
        };
        if (res && res.data && res.data[0] && res.data[0]._id) {
          fetch(UPLOAD_FILE_METADATA, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-type': 'application/json',
            },
            body: JSON.stringify(body),
          })
            .then(response => response.json())
            .then(res => {
              props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Tải lên thành công !', variant: 'success' });
            })
            .catch(err => {
              console.log(err, 'err');
              props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: err.message || 'Tải lên thất bại', variant: 'error' });
            });
        } else {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Tập tin này đã tồn tại', variant: 'error' });
        }
      })
      .catch(err => {
        console.log(err, 'err');

        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: err.message || 'Tải lên thất bại', variant: 'error' });
      })
      .finally(() => {
        handleReload();
        callback();
      });
  };
  const handleSearchMedia = async callback => {
    const data = currentFolder;
    let file = document.getElementById('fileUpload').files[0];
    console.log(file.length, 'leng');
    const { typeSearch, numberImage } = searchImage;
    if (!file || typeof file === 'undefined' || !numberImage || typeSearch === '') {
      props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Đồng chí chưa nhập đủ dữ liệu !', variant: 'error' });
    } else {
      // if (typeSearch === 'image') {
      console.log('vao image');
      const form = new FormData();
      form.append('file', file, file.name);
      // form.append('meta', JSON.stringify({ topk: numberImage, index: clientId }));
      const paths = currentFolder && currentFolder.fullPath.split('/');
      let path = `/${paths
        .filter((i, idx) => {
          return idx > 1;
        })
        .join('/')}`;
      form.append('path', path);
      form.append('typeSearch', typeSearch);
      if (typeSearch === 'image') form.append('limit', numberImage);
      setLoadingCallApi(true);
      await fetch(`${SEARCH_IMAGE}?clientId=${clientId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_03')}`,
        },
        body: form,
      })
        .then(resp => resp.json())
        .then(res => {
          if (res && res.status) {
            setListFile(handleSortFileFolder(res.data || []));
            props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thành công !', variant: 'success' });
          } else {
            // setListFile(handleSortFileFolder(res.data || []))
            setListFile([]);
            props.onChangeSnackbar &&
              props.onChangeSnackbar({ status: true, message: (res && res.message) || 'Thao tác thất bại !', variant: 'error' });
          }
        })
        .catch(err => {
          console.log(err, 'res');
          setListFile([]);
          props.onChangeSnackbar &&
            props.onChangeSnackbar({ status: true, message: (err && err.message) || 'Thao tác thất bại !', variant: 'error' });
        })
        .finally(() => {
          setLoadingCallApi();
          if (callback) callback();
        });

      // axios
      //   .post(`${SEARCH_IMAGE}?clientId=${clientId}`, form, {
      //     headers: {
      //       // 'Content-Type': 'application/json',
      //     },
      //   })
      //   .then(response => {
      //     console.log('response', response);
      //   })
      //   .catch(err => {
      //     console.log('err', err);
      //     props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: err.message || 'Thao tác thất bại !', variant: 'error' });
      //   });
      // }
      //  else {
      //   console.log('vao video');
      //   const form = new FormData();
      //   form.append('file', file, file.name);
      //   axios
      //     .post(`${SEARCH_VIDEO}`, form, {
      //       headers: {
      //         // 'Content-Type': 'application/json',
      //       },
      //     })
      //     .then(response => {
      //       let arrayId = [];
      //       if (response.data) {
      //         arrayId.push(response.data.id);
      //       }
      //     })
      //     .catch(err => {
      //       console.log('err', err);
      //       props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: err.message || 'Thao tác thất bại !', variant: 'error' });
      //     });
      // }
    }
  };
  const handleGetListDataMeta = (data = []) => {
    setListFile(handleSortFileFolder(data));
  };
  const renderListFolder = (level = 0, isParent, parentPath) => {
    level++;
    if (listFolderDefault && listFolderDefault.length) {
      if (isParent) {
        // cấp to nhất của cây thư mục
        return (
          <>
            {(listFolderDefault &&
              Array.isArray(listFolderDefault) &&
              listFolderDefault.length &&
              listFolderDefault
                .filter(
                  it =>
                    !it.parentPath ||
                    // (tab === 'users' && it.parentPath === `${clientId}/${tab}/` && it.canDelete ===false)  ||
                    (tab === 'users' && it.canDelete === false) ||
                    (tab === 'share' && it.parentPath === `${clientId}/`),
                )
                .map(item => {
                  return (
                    <>
                      <Grid item container style={{ height: 40 }} className="listName">
                        <p style={{ paddingLeft: level * 15, display: 'flex' }}>
                          {item.open ? (
                            // <RemoveIcon onClick={() => handleChangeOpen(item._id, false)} />
                            <ArrowDropDownIcon onClick={() => handleChangeOpen(item._id, false)} />
                          ) : (
                            // <AddIcon onClick={() => handleChangeOpen(item._id, true)} />
                            <ArrowRightIcon onClick={() => handleChangeOpen(item._id, true)} />
                          )}
                          <img src={iconsfolder} style={{ height: 15, marginTop: 5, marginRight: 5, userSelect: 'none' }} />
                          <p
                            style={
                              item._id === currentFolder._id
                                ? {
                                  lineHeight: '25px',
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  color: 'var(--dt-primary-action-stateful,rgb(24,90,188))',
                                }
                                : { lineHeight: '25px', cursor: 'pointer' }
                            }
                            className="nameListFolderDefault"
                            onDoubleClick={() => {
                              // const path = item.fullPath.replace(parentPathReplace, '');
                              let path = item.fullPath.split('/');
                              path = `/${path
                                .filter((i, idx) => {
                                  return idx > 1;
                                })
                                .join('/')}`;
                              handleOpenFolder(false, 'read', path, false, item);
                            }}
                          >
                            <div
                              style={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                position: 'relative',
                                userSelect: 'none',
                              }}
                            >
                              {item.name}
                            </div>
                          </p>
                        </p>
                      </Grid>
                      {(item.open && renderListFolder(level, false, item.fullPath)) || ''}
                    </>
                  );
                })) ||
              ''}
          </>
        );
      } else {
        // cấp thứ 2 trở đi của cây thư mục
        return (
          <>
            {(listFolderDefault &&
              Array.isArray(listFolderDefault) &&
              listFolderDefault.length &&
              listFolderDefault.filter(it => parentPath && it.parentPath === parentPath).length &&
              listFolderDefault
                .filter(it => {
                  if (tab === 'users') {
                    return parentPath && it.parentPath === parentPath && it.canDelete === false;
                  } else {
                    return parentPath && it.parentPath === parentPath;
                  }
                })
                .map(item => {
                  return (
                    <>
                      <Grid item container style={{ height: 40 }} className="listName">
                        <p style={{ paddingLeft: level * 15, display: 'flex' }}>
                          {item.folderChild ? (
                            item.open ? (
                              // <RemoveIcon onClick={() => handleChangeOpen(item._id, false)} />
                              <ArrowDropDownIcon onClick={() => handleChangeOpen(item._id, false)} />
                            ) : (
                              // <AddIcon onClick={() => handleChangeOpen(item._id, true)} />
                              <ArrowRightIcon onClick={() => handleChangeOpen(item._id, true)} />
                            )
                          ) : (
                            <ArrowRightIcon style={{ color: 'transparent' }} />
                          )}

                          <img src={iconsfolder} style={{ height: 15, marginTop: 5, marginRight: 5, userSelect: 'none' }} />
                          <p
                            style={
                              item._id === currentFolder._id
                                ? {
                                  lineHeight: '25px',
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  color: 'var(--dt-primary-action-stateful,rgb(24,90,188))',
                                }
                                : { lineHeight: '25px', cursor: 'pointer' }
                            }
                            className="nameListFolderDefault"
                            onDoubleClick={() => {
                              let path = item.fullPath.split('/');
                              path = `/${path
                                .filter((i, idx) => {
                                  return idx > 1;
                                })
                                .join('/')}`;
                              handleOpenFolder(false, 'read', path, false, item);
                            }}
                          >
                            <div
                              style={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                position: 'relative',
                                userSelect: 'none',
                              }}
                            >
                              {item.name}
                            </div>
                          </p>
                        </p>
                      </Grid>
                      {(item.open && renderListFolder(level, false, item.fullPath)) || ''}
                    </>
                  );
                })) ||
              ''}
          </>
        );
      }
    }
  };

  // add
  const handleCreateFolder = () => {
    let path = currentFolder.fullPath.split('/');
    path = `/${path
      .filter((i, idx) => {
        return idx > 1;
      })
      .join('/')}`;
    const action = typeEdit ? 'rename' : 'create';
    const data = typeEdit ? typeEdit : currentFolder;
    handleOpenFolderC(action, path, false, data, action, nameFolder);
  };
  const handleGetHistory = fileId => {
    fetchData(`${hostUrl}/${tab}/getListAction?fileId=${fileId}`, 'GET', null, 'token_03')
      .then(res => {
        console.log(res, 'resresres');
        setHistoryItem(res && res.data);
      })
      .catch(err => {
        console.log(err, 'err');
        props.onChangeSnackbar &&
          props.onChangeSnackbar({ status: true, message: err.message || 'Lấy thông tin chi tiết thất bại!', variant: 'error' });
      });
  };
  let a = 1001;
  let b = 1000;
  return (
    <>
      {loading && (
        <Dialog dialogAction={false} open={loading}>
          <DialogContent>Đang load dữ liệu, đồng chí vui lòng chờ...</DialogContent>
        </Dialog>
      )}
      {!loading && (
        <div>
          <Grid item md={12} sm={12} style={{ borderBottom: '1px solid' }}>
            <Tabs
              value={tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChangeTab}
              TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
            // variant="fullWidth"
            // className={classes.tabs}
            >
              {companyRoles.view && <Tab className="wareHouse" value={'company'} label="Kho dữ liệu số đơn vị" />}
              {myDriveRoles.view && <Tab className="wareHouse" value={'users'} label="Kho dữ liệu số của tôi" />}
              <Tab className="wareHouse" value={'share'} label="Được chia sẻ với tôi" />
              <Tab className="wareHouse" value={'storage'} label="Quản lý lưu trữ" />
              <Tab className="wareHouse" value={'googleDrive'} label="Liên kết với Google Drive" />
            </Tabs>
          </Grid>

          <Grid item md={12} sm={12} container>
            {tab !== 'storage' && tab !== 'googleDrive' ? (
              <>
                <Grid item md={2} sm={2} container style={{ position: 'relative', top: 15, height: 'calc(100vh - 120px)' }}>
                  {(tab === 'company' && companyRoles.add) || (tab === 'users' && myDriveRoles.add) ? (
                    <Grid
                      item
                      ms={12}
                      sm={12}
                      style={{
                        // borderBottom: '1px solid black',
                        height: 32,
                      }}
                    >
                      {/* <AddCircleRoundedIcon
                        onClick={e => {
                          setOpenDialogAdd(e.currentTarget);
                          setNameFolder('');
                          setTypeEdit();
                        }}
                        style={{ cursor: 'pointer', marginLeft: 15 }}
                      /> */}

                      <Button
                        className="iconsAdd"
                        onClick={e => {
                          setOpenDialogAdd(e.currentTarget);
                          setNameFolder('');
                          setTypeEdit();
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <span>
                          <img src={iconsAdd} className="iconAddnew" />
                        </span>
                        <span className="textNew">Mới</span>
                      </Button>
                    </Grid>
                  ) : null}
                  <Grid
                    item
                    md={12}
                    sm={12}
                    className="nameFolderHover"
                    style={
                      tab === 'share'
                        ? { overflowY: 'scroll', overflowX: 'hidden', height: 'calc(100vh - 320px)', position: 'absolute', width: '100%' }
                        : {
                          overflowY: 'scroll',
                          overflowX: 'hidden',
                          height: 'calc(100vh - 335px)',
                          position: 'absolute',
                          top: 30,
                          width: '100%',
                          marginTop: 20,
                        }
                    }
                  >
                    {/* cây sơ đồ */}
                    {renderListFolder(0, true, '')}
                  </Grid>
                  <Grid item md={12} sm={12} container style={{ position: 'absolute', bottom: 30, padding: '10px 20px' }}>
                    <Capacity capacity={capacity} handleChangeTab={handleChangeTab} />
                    <Button onClick={e => {
                      handleGetData(false, 'search', '/', false, listFolderDefault, false, true)
                    }}>
                      <Delete style={{ color: 'red' }} /> Thùng rác
                    </Button>
                  </Grid>
                </Grid>
                <Grid
                  item
                  md={isDetail ? 7 : 10}
                  sm={isDetail ? 7 : 10}
                  style={{
                    borderRight: '1px solid',
                    borderLeft: '1px solid',
                    height: 'calc(100vh - 120px)',
                  }}
                >
                  <FilesManager
                    tab={tab}
                    userName={userName}
                    codeSelected={codeSelected}
                    companyRoles={companyRoles}
                    myDriveRoles={myDriveRoles}
                    isDetail={isDetail}
                    profile={props.profile}
                    handleChangeDetail={(e, data) => handleChangeDetail(e, data)}
                    listFile={listFile}
                    handleOpenFolder={handleOpenFolder}
                    parentPathReplace={parentPathReplace}
                    handelOpenDetail={() => setIsDetail(!isDetail)}
                    handleDeleteItem={handleDeleteItem}
                    onChangeSnackbar={props.onChangeSnackbar}
                    currentFolder={currentFolder}
                    handleOCR={handleOCR}
                    handleChangeOpenOCR={setOpenDialogOCR}
                    handleChangeOpenSmart={setOpenDialogSmart}
                    handleChangeOpenImage={setOpenDialogSearchImage}
                    handleChangleMetaDataOthers={setMetaDataOthers}
                    handleChangeTypeSearchImage={setSearchImage}
                    searchImage={searchImage}
                    loadingCallApi={loadingCallApi}
                    openDialogSearchImage={openDialogSearchImage}
                    openDialogSmart={openDialogSmart}
                    openDialogOCR={openDialogOCR}
                    handleReload={handleReload}
                    handleUploadSmartForm={handleUploadSmartForm}
                    handleSearchMedia={handleSearchMedia}
                    handleChangeTypeEdit={setTypeEdit}
                    typeEdit={typeEdit}
                    handleOpenEditName={setOpenDialogAddFolder}
                    handleGetHistory={handleGetHistory}
                    handleChangeSearchContent={setSearchContent}
                    handleGetListDataMeta={handleGetListDataMeta}
                    // get detail field config to map in filter metadata
                    handleGetDetailFieldConfig={handleGetDetailFieldConfig}
                    handleGetDetailSmartForm={handleGetDetailSmartForm}
                    handleGetDetailSmartForm2={id => {
                      handleGetDetailSmartForm2(id);
                    }}
                    handleGetDetailFieldConfig2={title => {
                      handleGetDetailFieldConfig2(title);
                    }}
                    listFieldConfig={listFieldConfig}
                    listFieldSmart={listFieldSmart}
                    listDetailSmartForm={listDetailSmartForm}
                    handleChangeOptionSearch={setOptionSearch}
                    optionSearch={optionSearch}
                    loadingPage={loadingPage}
                    loadingDelete={loadingDelete}
                    renderListFolder={renderListFolder}
                    detailItem={detailItem}
                    setDetailItem={setDetailItem}
                    setSmartForms={setSmartForms}
                    smartFormss={smartForms}
                    isDelete={isDelete}
                    setIsDelete={setIsDelete}
                  />
                </Grid>
                {isDetail && (
                  <Grid item md={3} sm={3}>
                    <DetailFile
                      handleReload={handleReload}
                      handleChangeDetail={(e, data) => handleChangeDetail(e, data)}
                      onChangeSnackbar={props.onChangeSnackbar}
                      handleOpenFolder={handleOpenFolder}
                      detailItem={detailItem}
                      historyItem={historyItem}
                      listFolderDefault={listFolderDefault}
                      handelOpenDetail={() => setIsDetail(!isDetail)}
                      handelOpenDetailC={value => setIsDetail(value)}
                      hostUrl={hostUrl}
                      profile={props.profile}
                      tab={tab}
                    />
                  </Grid>
                )}
              </>
            ) : null}
            {tab === 'storage' ? (
              <Grid md={12} sm={12}>
                {percentDataUsed !== 0 && percentDataUsed > 0.8 ? (
                  <Typography style={{ marginLeft: 10, marginTop: 5, color: 'red' }}>
                    {`Bạn đã sử dụng quá 80% dung lượng, mua thêm dung lượng`}{' '}
                    <a style={{ textDecoration: 'underline', cursor: 'pointer' }}> tại đây </a>{' '}
                  </Typography>
                ) : null}
                <Grid style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }} container>
                  <ReportBox
                    icon={<CardTravel style={{ fontSize: 50 }} />}
                    number={formatData(dataUsed ? dataUsed.storageCapacity : 0) || 0}
                    text="Gói dữ liệu"
                    color="linear-gradient(to right, #03A9F4, #03a9f4ad)"
                    backColor="rgb(0, 126, 255)"
                  // openDetail={this.openContract}
                  />
                  <ReportBox
                    icon={<NextWeek style={{ fontSize: 50 }} />}
                    number={formatData(dataUsed ? dataUsed.usedStorage : 0) || 0}
                    text="Đã sử dụng"
                    color="linear-gradient(to right, rgb(76, 175, 80), rgba(76, 175, 80, 0.68))"
                    backColor="#237f1c"
                  // openDetail={this.openProject}
                  />
                  <ReportBox
                    icon={<Receipt style={{ fontSize: 50 }} />}
                    number={formatData(dataUsed ? dataUsed.storageCapacity - dataUsed.usedStorage : 0) || 0}
                    text="Dung lượng còn lại"
                    color="linear-gradient(to right, #FF5722, rgba(255, 87, 34, 0.79))"
                    backColor="red"
                  // openDetail={this.openBusiness}
                  />
                </Grid>
                <Grid style={{ marginTop: 20 }}>
                  <CustomChartFiles height="650px" getDataUsed={getDataUsed}>
                    <FilesChart style={{ height: '100%' }} data={columnXYRevenueChart} id="chart1" />
                  </CustomChartFiles>
                </Grid>
              </Grid>
            ) : null}
          </Grid>

          {/* menu add */}
          {openDialogAdd && (
            <Menu
              open={Boolean(openDialogAdd)}
              anchorEl={openDialogAdd}
              style={{ minHeight: 200, paddingTop: 0 }}
              onClose={() => {
                setOpenDialogAdd(null);
              }}
            // onContextMenu={e => {

            // }}
            >
              <MenuItem
                style={{ height: 10 }}
                onClick={() => {
                  setOpenDialogAddFolder(true);
                  setOpenDialogAdd(null);
                  setTypeEdit();
                }}
              >
                Thư mục mới
              </MenuItem>
              <MenuItem
                style={{ height: 10, borderTop: '1px solid' }}
                onClick={() => {
                  setOpenDialogAddFile(true);
                  setOpenDialogAdd(null);
                  setIsAddFolder(false);
                  setIsUpload(false);
                }}
              >
                Tải tệp lên
              </MenuItem>
              <MenuItem
                style={{ height: 10, borderTop: '1px solid' }}
                onClick={() => {
                  setIsAddFolder(true);
                  setOpenDialogAdd(null);
                  setOpenDialogAddFile(true);
                  setIsUpload(false);
                }}
              >
                Tải thư mục lên
              </MenuItem>
            </Menu>
          )}

          {/* dialog add new folder/ rename*/}
          {openDialogAddFolder && (
            <DialogMUI open={openDialogAddFolder} onClose={() => setOpenDialogAddFolder(false)} maxWidth="sm" fullWidth>
              <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
                {!typeEdit ? 'Thêm mới thư mục' : typeEdit && typeEdit.isFile ? 'Đổi tên tập tin' : 'Đổi tên thư mục'}
              </DialogTitle>
              <DialogContent>
                <Grid item md={12} container>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label={!typeEdit ? 'Tên thư mục' : typeEdit && typeEdit.isFile ? 'Tên tập tin mới' : 'Tên thư mục mới'}
                    variant="outlined"
                    // inputProps={{ maxLength: 75 }}
                    onChange={e => {
                      setNameFolder(e.target.value || '');
                    }}
                    value={nameFolder}
                    style={{ marginTop: 10 }}
                    autoFocus={true}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setOpenDialogAddFolder(false);
                  }}
                  variant="contained"
                  color="secondary"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    handleCreateFolder();
                  }}
                  disabled={!(nameFolder && nameFolder.trim()) || loadingCallApi}
                  variant="contained"
                  color="primary"
                >
                  Đồng ý
                </Button>
              </DialogActions>
            </DialogMUI>
          )}

          {/* dialog add new file */}
          {openDialogAddFile && (
            <DialogMUI open={openDialogAddFile} onClose={() => setOpenDialogAddFile(false)} maxWidth="sm" fullWidth>
              <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
                {isAddFolder ? 'Tải lên thư mục' : 'Tải lên tập tin'}
              </DialogTitle>
              <DialogContent>
                <Grid item md={12} container>
                  {isAddFolder ? (
                    <>
                      <input
                        type="file"
                        id="UploadFolder"
                        directory=""
                        webkitdirectory=""
                        onChange={e => {
                          let file = e && e.target && e.target.files;
                          setDisableBtnAdd(!Boolean(file && file.length));
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type={'file'}
                        id="fileUploadFile"
                        onChange={e => {
                          let file = e && e.target && e.target.files;
                          console.log(file, 'leng');
                          setDisableBtnAdd(!Boolean(file && file.length));
                        }}
                      />
                    </>
                  )}
                  {(isUpload && (
                    // <Grid item md={12} container style={{ marginTop: 10 }}>
                    <LinearProgressWithLabel value={(progress / allProcess) * 100} progress={progress} allProcess={allProcess} />
                    // </Grid>
                  )) ||
                    ''}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setOpenDialogAddFile(false);
                    setIsUpload(false);
                    setProgress(0);
                    setAllProcess(0);
                  }}
                  variant="contained"
                  color="secondary"
                  autoFocus
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    setDisableBtnAdd(true);
                    handleUploadFile(isFalse => {
                      setOpenDialogAddFile(false);
                      setIsUpload(false);
                      setProgress(0);
                      setAllProcess(0);
                      if (!isFalse)
                        props.onChangeSnackbar &&
                          props.onChangeSnackbar({
                            status: true,
                            message: isAddFolder ? 'Tải thư mục thành công !' : 'Tải tập tin thành công !',
                            variant: 'success',
                          });
                    });
                  }}
                  disabled={disableBtnAdd}
                  variant="contained"
                  color="primary"
                >
                  Đồng ý
                </Button>
              </DialogActions>
            </DialogMUI>
          )}

          {/* dialog add new folder */}
        </div>
      )}
    </>
  );
}

LifeDrive.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  lifeDrive: makeSelectLifeDrive(),
  profile: makeSelectProfile(),
  role: makeSelectRole(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
      setTimeout(closeSnackbar(), 500);
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'lifeDrive', reducer });
const withSaga = injectSaga({ key: 'lifeDrive', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LifeDrive);

// ReportBox.defaultProps = {
//   color: 'linear-gradient(to right, #03A9F4, #03a9f4ad)',
//   icon: 'CardTravel',
// };
