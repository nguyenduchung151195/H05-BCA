import {
  Avatar,
  Button,
  Checkbox,
  Dialog as DialogMUI,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import CachedIcon from '@material-ui/icons/Cached';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DehazeIcon from '@material-ui/icons/Dehaze';
import InfoIcon from '@material-ui/icons/Info';
import MicIcon from '@material-ui/icons/Mic';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import ScreenShareOutlinedIcon from '@material-ui/icons/ScreenShareOutlined';
import TocIcon from '@material-ui/icons/Toc';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import EnhancedTable from '../ListPage';
// import OpenWithOutlinedIcon from '@material-ui/icons/OpenWithOutlined';
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'; // chức năng copy
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import InputOutlinedIcon from '@material-ui/icons/InputOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import OpenInBrowserOutlinedIcon from '@material-ui/icons/OpenInBrowserOutlined';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import SearchIcon from '@material-ui/icons/Search';
import folderEmpty from '../../../assets/img/icon/folderEmpty.png';
import folder from '../../../assets/img/icon/iconFolder.png';
import iconsCss from '../../../assets/img/icon/iconsCss.png';
import iconsEot from '../../../assets/img/icon/iconsEot.png';
import iconsExcel from '../../../assets/img/icon/iconsExcel.png';
import iconsExe from '../../../assets/img/icon/iconsExe.png';
import iconsHtml from '../../../assets/img/icon/iconsHtml.png';
import iconsIco from '../../../assets/img/icon/iconsIco.png';
import iconsImage from '../../../assets/img/icon/iconsImg.png';
import iconsJs from '../../../assets/img/icon/iconsJs.png';
import iconsJson from '../../../assets/img/icon/iconsJson.png';
import iconsLock from '../../../assets/img/icon/iconsLock.png';
import iconsMd from '../../../assets/img/icon/iconsMd.png';
import iconsMp3 from '../../../assets/img/icon/iconsMp3.png';
import iconsMp4 from '../../../assets/img/icon/iconsMp4.png';
import iconsPDF from '../../../assets/img/icon/iconsPDF.png';
import iconsSvg from '../../../assets/img/icon/iconsSvg.png';
import iconsTs from '../../../assets/img/icon/iconsTs.png';
import iconsTtf from '../../../assets/img/icon/iconsTtf.png';
import iconsTxt from '../../../assets/img/icon/iconsTxt.png';
import iconsVoice from '../../../assets/img/icon/iconsVoice.png';
import iconsWoff from '../../../assets/img/icon/iconsWoff.png';
import iconsWord from '../../../assets/img/icon/iconsWord.png';
import iconsYml from '../../../assets/img/icon/iconsYml.png';
// import iconsShare from '../../../assets/img/icon/iconsShare.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import avatarDefault from '../../../assets/img/icon/avatarDefault.svg';
import logoEncode from '../../../assets/img/icon/logoEncode.jpg';
import { Delete, Restore } from '@material-ui/icons';
import { ArrowBack, Close, KeyboardArrowRight } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import XLSX from 'xlsx';
import iconsfolder from '../../../assets/img/icon/iconsfolder.png';
import { AsyncAutocomplete } from '../../../components/LifetekUi';
import {
  ALLOW_FILE_EXT_UPLOAD,
  API_CUSTOMERS,
  API_USERS,
  UPLOAD_APP_URL,
  URL_ENCODE_KEY,
  API_SHARE_FILES,
  UPLOAD_FILE_METADATA,
} from '../../../config/urlConfig';
import { clientId } from '../../../variable';
import { fetchData } from '../../../helper';

import { SPEECH_2_TEXT } from '../../../config/urlConfig';
import { InputField, SelectField } from '../FormFields';
import Dialog from '../PreviewFile/Dialog';
import ScanFile from '../ScanFile';
import ScanFileText from '../ScanFileText';
import SearchImage from '../SearchImage';
import './styles.scss';
// import { Value } from 'devextreme-react/range-selector';
import { KeyboardVoice } from '@material-ui/icons';
import CustomDatePicker from '../../../components/CustomDatePicker';
import moment from 'moment';
import { clearWidthSpace } from '../../../utils/common';
import CustomGroupInputField from '../../../components/Input/CustomGroupInputField';
import _ from 'lodash';
import { set } from 'dot-object';
import ScanDialog from '../../../components/ScanDoc/ScanDialog';
// const useStyles = makeStyles({
//   underline: {
//     "&&&:before": {
//       borderBottom: "none"
//     },
//     "&&:after": {
//       borderBottom: "none"
//     }
//   }
// });

const styles = theme => ({
  rootStyle: {
    borderRadius: 200,
    height: 120,
  },
  dialogOCR: {
    borderRadius: 20,
  },
  dense: {
    marginTop: 0,
  },
  inputField: {
    padding: 10.5,
  },
  selectField: {
    padding: 0,
  },
  menu: {
    boxSizing: 'borderBox',
  },
});
let timeout = 0;
function FilesManager(props) {
  const [type, setType] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [itemSelect, setItemSelect] = useState(null);
  const [state, setState] = useState({});
  const [docFile, setDocFile] = useState();
  const [loadingPreFile, setLoadingPreFile] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogCleanUp, setOpenDialogCleanUp] = useState(false)
  const [openDialogDeleteList, setOpenDialogDeleteList] = useState(false);

  const [openDialogVoice, setOpenDialogVoice] = useState(false);

  const [disablebtnOCR, setDisablebtnOCR] = useState(true);
  const [listIdsDelete, setListIdsDelete] = useState([]);
  const [checked, setChecked] = useState(false);
  const [openDialogTick, setOpenDialogTick] = useState(false);
  const [openDialogDuplicate, setOpenDialogDuplicate] = useState(false);

  const [openDialogShare, setOpenDialogShare] = useState(false);

  const [openDialogEnCode, setOpenDialogEnCode] = useState(false);
  const [openDialogDecryption, setOpenDialogDecryption] = useState(false);
  const [openDialogDigitalData, setOpenDialogDigitalData] = useState(false);
  const [hostUrl, setHostUrl] = useState(`${UPLOAD_APP_URL}/file-system`);
  const [loading, setLoading] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const [errName, setErrName] = useState('');
  const [previewHtml, setPreviewHtml] = useState();

  const [openDialogMove, setOpenDialogMove] = useState(false);
  const [nameEncode, setNameEncode] = useState('');
  const [openDialogMetaData, setOpenDialogMetaData] = useState(false);
  const [searchMeta, setSearchMeta] = useState('');

  const [fieldConfig, setFieldConfig] = useState(false);
  const [isConfig, setIsConfig] = useState(false);
  const [isItemConfig, setIsItemConfig] = useState(false);

  // const { handleChangeDetail, handleOpenFolder, handleGetDetailFieldConfig,handleGetDetailSmartForm } = props;
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [waitConvert, setWaitConvert] = useState(false);
  const [activeConvert, setActiveConvert] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [dataUpload, setDataUpload] = useState(null);
  const [search, setSearch] = useState(null);
  const [searchInput, setSearchInput] = useState(null);
  const [valueSearch, setValueSearch] = useState(null);
  const [files, setFiles] = useState([]);
  const [isChosseFile, setIsChosseFile] = useState(true);
  const [isScan, setIsScan] = useState(false);
  const [meta, setMeta] = useState();
  const [listUser, setListUser] = useState([]);
  const [listUserSelect, setListUserSelect] = useState([]);
  const [openOptionSearch, setOpenOptionSearch] = useState(null);
  const [extract, setExtract] = useState([]);
  const [isOCRInSt, setIsOCRInSt] = useState(true);
  const [scanDialog, setScanDialog] = useState();
  const [parentPath, setParentPath] = useState('')
  const [disableSave, setDisableSave] = useState(true)
  const { setDetailItem } = props;
  const getShortName = (name, maxLength) => {
    if (!name || typeof name != 'string') return '';
    if (name.length > maxLength) return `${name.slice(0, maxLength)} ...`;
    return name;
  };

  const [listFolders, setListFolders] = useState([]);
  useEffect(
    () => {
      if (!parentPath) {
        setDisableSave(true);
      } else {
        setDisableSave(false);
      }
    },
    [parentPath],
  );

  const handleDecryption = () => {
    setLoading(true);
    const form = new FormData();
    const myNewFile = document.getElementById('fileUploadDecryption').files[0];
    form.append('file', myNewFile);
    form.append('path', parentPath);

    console.log(parentPath, 'parentPath');
    console.log(myNewFile, 'myNewFile');
    // fetchData(, 'POST', form, 'token_03')
    // fetchData(`${hostUrl}/${tab}/moveFile`, 'POST', body, 'token')
    // let body ={
    //   file : myNewFile,
    //   path: pathMove
    // }
    const token = localStorage.getItem('token_03');
    // fetchData(`${hostUrl}/decryption?clientId=${clientId}&fileId=${itemSelect._id}`,'POST', body, 'token')
    fetch(`${hostUrl}/decryption?clientId=${clientId}&fileId=${itemSelect._id}`, {
      method: 'POST', // or 'PUT'
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: form,
    })
      .then(resp => resp.json())
      .then(async res => {
        if (res.status) {
          // setOpenDialogEnCode(false);
          // handleViewFile(res.data);
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thành công !', variant: 'success' });
          setOpenDialogDigitalData(false);
          setOpenDialogDecryption(false);
          props.handleReload && props.handleReload();
        } else {

          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thất bại !', variant: 'error' });
        }
      })
      .catch(err => {
        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thất bại !', variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
        return true;
      });

  };
  useEffect(
    () => {
      if (openDialogMetaData == false) {
        setIsConfig(false);
        setIsItemConfig(false);
        setFieldConfig(false);
      }
    },
    [openDialogMetaData],
  );
  const onSaveScan = (e) => {
    setFiles(e && e.target && e.target.files || [])
    if (!(e && e.target && e.target.files && e.target.files.length)) {
      setIsChosseFile(false);
      setDisablebtnOCR();

    }
    else {
      setDisablebtnOCR();
      setIsChosseFile(true);
      props.handleReload && props.handleReload();
    }
  }


  const handleChangeDateShare = (name, value, data) => {
    var found = listUser.find(it => it.user && it.user._id === data.user._id);
    var dataNew = {
      ...found,
      [name]: value && value,
    };
    var dataOld = listUser.filter(it => it.user && it.user._id !== data.user._id);
    if (dataOld.length > 0) {
      setListUser([dataNew, ...dataOld]);
    } else {
      setListUser([dataNew]);
    }
  };
  const handleChangeRole = (e, data) => {
    var found = listUser.find(it => it.user && it.user._id === data.user._id);
    var dataNew = {
      ...found,
      permissions: e && e.target && e.target.value,
    };
    var dataOld = listUser.filter(it => it.user && it.user._id !== data.user._id);
    if (dataOld.length > 0) {
      setListUser([dataNew, ...dataOld]);
    } else {
      setListUser([dataNew]);
    }
  };
  const handleChangePeopleShare = value => {
    let newListUser = [];
    let valueNew = [];
    let valueOld = [];
    if (value && value.length > listUser.length) {
      valueNew = [value[value.length - 1]];
      valueOld = listUser;
    } else {
      valueNew = [];
      value &&
        value.map(it => {
          listUser.filter(el => {
            if (el.user.username === it.username) {
              valueOld = [...valueOld, el];
            }
          });
        });
    }
    if (value && value.length) {
      if (valueNew.length > 0) {
        valueNew.map(el => {
          newListUser.push({
            user: { ...el },
            startDate: null,
            endDate: null,
            permissions: 'view',
          });
        });
      }
      setListUserSelect(value);
      console.log([...newListUser, ...valueOld]);
      setListUser([...newListUser, ...valueOld]);
      // if(value.length !== listUser.le ){

      // }
    } else {
      setListUserSelect(null);
      setListUser([]);
    }
    // const newListUser = listUser;
    // if (value && value.length) {
    //   value.map(el => {
    //     const itemFound = listUser.findIndex(it => it.user && it.user._id === el._id);
    //     if (itemFound === -1) {
    //       console.log(itemFound, 'itemFound');
    //       newListUser.push({
    //         user: { ...el },
    //         startDate: null,
    //         endDate: null,
    //         permissions: 'view',
    //       });
    //       if (value.length !== newListUser.length) {
    //         const itemFound = newListUser.filter(it => it.user && it.user._id === el._id);
    //         if (itemFound) {
    //           setListUserSelect(value);
    //           setListUser(itemFound);
    //         }
    //       } else {
    //         setListUserSelect(value);
    //         setListUser(newListUser);
    //       }
    //     }
    //   });
    // }else{
    //   setListUserSelect(null);
    //   setListUser(null);
    // }
  };
  const handleDelete = () => {
    let body = {
      type: "remove",
      fileId: [itemSelect._id],
    }
    setIsDelete(false)
    setLoading(true);
    fetchData(`${hostUrl}/${tab}/trash-action`, 'POST', body, 'token')
      .then(res => {
        if (res.status) {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Xóa thành công !', variant: 'success' });
          setOpenDialog(null);
          props.handleReload && props.handleReload(false);
        } else {

          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Xóa thất bại !', variant: 'error' });
        }
      })
      .catch(err => {
        console.log('err', err);
        // setOpenDialogEnCode(false);
        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Xóa thất bại !', variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
        return true;
      });
  }
  const handleRemoveAll =()=> {
    let body = {
      type: "removeAll",
      fileId: [],
    }
    setIsDelete(false)
    setLoading(true);
    fetchData(`${hostUrl}/${tab}/trash-action`, 'POST', body, 'token')
      .then(res => {
        if (res.status) {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Xóa thành công !', variant: 'success' });
          setOpenDialog(null);
          props.handleReload && props.handleReload(false);
        } else {

          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Xóa thất bại !', variant: 'error' });
        }
      })
      .catch(err => {
        console.log('err', err);
        // setOpenDialogEnCode(false);
        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Xóa thất bại !', variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
        return true;
      });
  }
  const handleRestore = () => {
    let body = {
      type: "restore",
      fileId: [itemSelect._id],
    }
    setIsDelete(false)
    setLoading(true);
    fetchData(`${hostUrl}/${tab}/trash-action`, 'POST', body, 'token')
      .then(res => {
        if (res.status) {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Khôi phục thành công !', variant: 'success' });
          setOpenDialog(null);
          props.handleReload && props.handleReload(false);
        } else {

          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Khôi phục thất bại !', variant: 'error' });
        }
      })
      .catch(err => {
        console.log('err', err);
        // setOpenDialogEnCode(false);
        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Khôi phục thất bại !', variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
        return true;
      });
  }
  const handleEncode = () => {
    setLoading(true);
    // fetchData(`${hostUrl}/${tab}?clientId=${clientId}`, 'POST', null, 'token')
    fetchData(`${hostUrl}/encode?name=${nameEncode}&fileId=${itemSelect._id}`, 'GET', null, 'token_03')
      .then(async res => {
        if (res.status) {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thành công !', variant: 'success' });
          const { data = [] } = res;
          // let item = data.find(it => it.lastIndexOf(".pem") === (it.length - 4) && it.lastIndexOf(".pem") !== -1) || ""
          const key = (res && res.data && res.data.key) || '';
          const link = `${URL_ENCODE_KEY}/${key}`;
          // let name = key.slice(key.lastIndexOf("/") + 1)
          let name = key.replace('keyrsa/', '');
          // name = name.replace(/.pem/, "")
          await downloadFile(link, name);
          setNameEncode('');
          props.handleReload && props.handleReload();
          setOpenDialogEnCode(false);
        } else {
          setOpenDialogEnCode(false);
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thất bại !', variant: 'error' });
        }
      })
      .catch(err => {
        // setOpenDialogEnCode(false);
        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thất bại !', variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
        return true;
      });
  };
  const handleGetOcr = async () => {
    setLoading(true);
    const token = localStorage.getItem('token_03');
    let url;
    // let typeOfFile = '.pdf';
    let typeOfFile = itemSelect.type;
    console.log(typeOfFile, 'typeOfFile')
    url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${itemSelect && itemSelect._id}`;
    url = await handlePdf(url, typeOfFile);
    let file = await (await fetch(url, { method: 'GET', headers: { Authorization: `Bearer ${token}` } })).blob();
    console.log('itemSelect', itemSelect);
    if (typeOfFile === '.pdf') {
      file = new File([file], itemSelect.name, { type: 'application/pdf' });

    }
    if (typeOfFile === '.png') {
      file = new File([file], itemSelect.name, { type: 'image/png' });
    }
    if (typeOfFile === '.jpeg') {
      file = new File([file], itemSelect.name, { type: 'image/jpeg' });
    }
    if (typeOfFile === '.jpg') {
      file = new File([file], itemSelect.name, { type: 'image/jpg' });
    }
    // typeOfFile ==='.jpg' || typeOfFile ==='.jpeg' ||
    console.log(file, 'file');
    setFiles([file]);
  };
  const handleOcrSyS = async callback => {
    setLoading(true);
    const token = localStorage.getItem('token_3');

    const { smartForms } = props;
    console.log(smartForms, 'smartForms');
    // if (isScan) {
    //   fetchData(`${hostUrl}/company/ocr-file-by-id`, 'POST', { fileId: itemSelect && itemSelect._id }, 'token_03')
    //     .then(res => {
    //       setExtract(res.data);
    //     })
    //     .catch(err => {
    //       console.log(err, 'err');
    //       props.onChangeSnackbar &&
    //         props.onChangeSnackbar({ status: true, message: err.message || 'Lấy thông tin chi tiết thất bại!', variant: 'error' });
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     });
    // }
    // let body = {
    //   id: itemSelect && itemSelect._id,
    //   model: 'FileManager',
    //   metaData: {
    //     others: meta,
    //     smartForms,
    //   },
    // };
    // fetchData(UPLOAD_FILE_METADATA, 'PUT', body)
    //   .then(res => {
    //     console.log('res', res);
    //   })
    //   .catch(() => {});

    let body = {
      model: 'FileManager',
      metaData: {
        others: meta,
        smartForms,
      },
      id: itemSelect._id
    };
    const metaData = fetchData(UPLOAD_FILE_METADATA, 'PUT', body);
    if (isScan) {
      const ocrById = fetchData(`${hostUrl}/company/ocr-file-by-id`, 'POST', { fileId: itemSelect && itemSelect._id }, 'token_03');
      Promise.all([metaData, ocrById])
        .then(res => {
          let body = {
            model: 'FileManager',
            metaData: {
              others: meta,
              smartForms,
            },
            id: res[1] ? res[1].data._id : null
          };
          fetchData(UPLOAD_FILE_METADATA, 'PUT', body);
          setExtract(res[1].data)
        }
        )
        .catch(err => {
          console.log(err, 'err');
          props.onChangeSnackbar &&
            props.onChangeSnackbar({ status: true, message: err.message || 'Lấy thông tin chi tiết thất bại!', variant: 'error' });
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (callback) {
      callback();
    }
  };
  useEffect(() => { }, [extract]);
  const handleMove = () => {
    let body = {
      moveTo: pathMove,
      fileId: dataCurrent._id,
    };
    setLoading(true);
    fetchData(`${hostUrl}/${tab}/moveFile`, 'POST', body, 'token')
      .then(res => {
        if (res.code === 200 || res.status === 1) {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Di chuyển file thành công !', variant: 'success' });
          props.handleReload && props.handleReload();
          setOpenDialogMove(false);
        } else {
          setOpenDialogMove(false);
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Di chuyển file thất bại !', variant: 'error' });
        }
      })
      .catch(err => {
        console.log('err', err);
        // setOpenDialogEnCode(false);
        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Di chuyển file thất bại !', variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
        return true;
      });
  };
  //handleMeta
  const handleSearchMetaData = () => {
    // const filter =
    //   fieldConfig === 'cht'
    //     ? {
    //         // filter cht
    //       }
    //     : fieldConfig === 'smf'
    //       ? {
    //           //  filter smf
    //         }
    //       : {};
    let newFilter = {}
    for (const key in filterMeta) {
      if (typeof filterMeta[key] === 'object') {
        newFilter[`metaData.others.${key}`] = { $regex: filterMeta[key].title, $options: 'gi' }
      } else if (typeof filterMeta[key] === 'string') {
        newFilter[`metaData.others.${key}`] = { $regex: filterMeta[key], $options: 'gi' }
      }
    }
    let path = currentFolder.fullPath.split('/');
    path = `/${path
      .filter((i, idx) => {
        return idx > 1;
      })
      .join('/')}/`;
    let body = {
      action: 'read',
      path: '/',
      showHiddenItems: false,
      data: [],
      filter: {
        metaData: {
          others: {
            ...filterMeta,
          },
        },
      },
    };
    if (searchMeta) {
      body = {
        action: 'read',
        path: '/',
        showHiddenItems: false,
        data: [],
        filter: {
          'metaData.name': searchMeta,
        },
      };
    }

    setLoading(true);
    fetchData(`${hostUrl}/${tab}/searchMeta?clientId=${clientId}`, 'POST', body, 'token_03')
      .then(res => {
        if (res) {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Tìm kiếm metaData thành công !', variant: 'success' });
          // setOpenDialogMetaData(false);
          props.handleGetListDataMeta && props.handleGetListDataMeta((res && res.file) || []);
        } else {
          // setOpenDialogMetaData(false);
          props.handleGetListDataMeta && props.handleGetListDataMeta([]);
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Tìm kiếm metaData thất bại !', variant: 'error' });
        }
      })
      .catch(err => {
        console.log('err', err);
        // setOpenDialogEnCode(false);
        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: err.message || 'Tìm kiếm file thất bại !', variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
        return true;
      });
  };
  const handleShareFile = () => {
    setLoading(true);
    let newData = [];
    listUser.map(it => {
      newData.push({
        username: it.user.username,
        permission: it.permissions,
        timeStart: it.startDate,
        timeEnd: it.endDate,
      });
    });
    console.log(newData, 'newData');
    const body = {
      ...itemSelect,
      shares: [...newData],
    };
    fetchData(`${API_SHARE_FILES}/${itemSelect._id}`, 'PUT', body, 'token_03')
      .then(res => {
        if (res) {
          setOpenDialogShare(false);
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Chia sẻ file thành công !', variant: 'success' });
          handleReload();
        } else {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Chia sẻ file thất bại !', variant: 'error' });
        }
      })
      .catch(err => {
        console.log('err', err);
        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: err.message || 'Chia sẻ file thất bại !', variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
        return true;
      });
  };
  const handleTickFile = () => {
    setLoading(true);
    fetchData(`${hostUrl}/starred?fileId=${itemSelect._id}&clientId=${clientId}`, 'GET', null, 'token_03')
      .then(res => {
        if (res && res.status) {
          console.log(res, 'res');

          props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Đánh dấu thành công !', variant: 'success' });
        } else {
          props.onChangeSnackbar && props.onChangeSnackbar({ status: false, message: 'Đánh dấu thất bại !', variant: 'error' });
        }
      })
      .catch(err => {
        props.onChangeSnackbar && props.onChangeSnackbar({ status: false, message: 'Đánh dấu thất bại !', variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleDuplicateFile = () => {
    setLoading(true);
    fetchData(`${hostUrl}/coppy`, 'POST', { fileId: itemSelect && itemSelect._id }, 'token_03')
      .then(async res => {
        if (res && res.status) {
          (await props.handleReload) && props.handleReload();

          props.onChangeSnackbar &&
            props.onChangeSnackbar({
              status: true,
              message: `Nhân bản ${itemSelect.isFile ? 'tập tin' : ' thư mục'} thành công !`,
              variant: 'success',
            });
          setOpenDialogDuplicate(false);
        } else {
          props.onChangeSnackbar &&
            props.onChangeSnackbar({ status: false, message: `Nhân bản ${itemSelect.isFile ? 'tập tin' : ' thư mục'} thất bại !`, variant: 'error' });
        }
      })
      .catch(err => {
        props.onChangeSnackbar &&
          props.onChangeSnackbar({ status: false, message: `Nhân bản ${itemSelect.isFile ? 'tập tin' : ' thư mục'} thất bại !`, variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const renderBackground = (data, height, classOfImg, classOfFolder) => {
    if (!data.isFile) {
      return <img src={folder} style={{ height: height || 50 }} className={classOfImg} />;
    }
    if (data && data.isEncryption) {
      return <img src={logoEncode} style={{ height: height || 50 }} className={classOfImg} />;
    }
    let type = '';
    if (['.png', '.jpg', '.jpeg'].includes(data.type.toLowerCase())) {
      type = 'image';
    } else if (['.xlsx', '.xls'].includes(data.type.toLowerCase())) {
      type = 'excel';
    } else if (['.pdf'].includes(data.type.toLowerCase())) {
      type = 'pdf';
    } else if (['.doc', '.docx'].includes(data.type.toLowerCase())) {
      type = 'word';
    } else if (['.txt'].includes(data.type.toLowerCase())) {
      type = 'txt';
    } else if (['.mp3'].includes(data.type.toLowerCase())) {
      type = 'mp3';
    } else if (['.mp4'].includes(data.type.toLowerCase())) {
      type = 'mp4';
    } else if (['.ttf'].includes(data.type.toLowerCase())) {
      type = 'ttf';
    } else if (['.woff', '.woff2'].includes(data.type.toLowerCase())) {
      type = 'woff';
    } else if (['.eot'].includes(data.type.toLowerCase())) {
      type = 'eot';
    } else if (['.svg'].includes(data.type.toLowerCase())) {
      type = 'svg';
    } else if (['.js'].includes(data.type.toLowerCase())) {
      type = 'js';
    } else if (['.exe'].includes(data.type.toLowerCase())) {
      type = 'exe';
    } else if (['.html'].includes(data.type.toLowerCase())) {
      type = 'html';
    } else if (['.ico'].includes(data.type.toLowerCase())) {
      type = 'ico';
    } else if (['.css'].includes(data.type.toLowerCase())) {
      type = 'css';
    } else if (['.ts', '.tsx'].includes(data.type.toLowerCase())) {
      type = 'ts';
    } else if (['.yml'].includes(data.type.toLowerCase())) {
      type = 'yml';
    } else if (['.json'].includes(data.type.toLowerCase())) {
      type = 'json';
    } else if (['.md', '.mdj'].includes(data.type.toLowerCase())) {
      type = 'md';
    } else if (['.lock'].includes(data.type.toLowerCase())) {
      type = 'lock';
    }
    switch (type) {
      case 'image':
        return <img src={iconsImage} style={{ height: height || 50 }} className={classOfImg} />;
      case 'excel':
        return <img src={iconsExcel} style={{ height: height || 50 }} className={classOfImg} />;
      case 'pdf':
        return <img src={iconsPDF} style={{ height: height || 50 }} className={classOfImg} />;
      case 'word':
        return <img src={iconsWord} style={{ height: height || 50 }} className={classOfImg} />;
      case 'txt':
        return <img src={iconsTxt} style={{ height: height || 50 }} className={classOfImg} />;
      case 'mp3':
        return <img src={iconsMp3} style={{ height: height || 50 }} className={classOfImg} />;
      case 'mp4':
        return <img src={iconsMp4} style={{ height: height || 50 }} className={classOfImg} />;
      case 'ttf':
        return <img src={iconsTtf} style={{ height: height || 50 }} className={classOfImg} />;
      case 'woff':
        return <img src={iconsWoff} style={{ height: height || 50 }} className={classOfImg} />;
      case 'eot':
        return <img src={iconsEot} style={{ height: height || 50 }} className={classOfImg} />;
      case 'svg':
        return <img src={iconsSvg} style={{ height: height || 50 }} className={classOfImg} />;
      case 'js':
        return <img src={iconsJs} style={{ height: height || 50 }} className={classOfImg} />;
      case 'exe':
        return <img src={iconsExe} style={{ height: height || 50 }} className={classOfImg} />;
      case 'html':
        return <img src={iconsHtml} style={{ height: height || 50 }} className={classOfImg} />;
      case 'ico':
        return <img src={iconsIco} style={{ height: height || 50 }} className={classOfImg} />;
      case 'css':
        return <img src={iconsCss} style={{ height: height || 50 }} className={classOfImg} />;
      case 'ts':
        return <img src={iconsTs} style={{ height: height || 50 }} className={classOfImg} />;
      case 'yml':
        return <img src={iconsYml} style={{ height: height || 50 }} className={classOfImg} />;
      case 'json':
        return <img src={iconsJson} style={{ height: height || 50 }} className={classOfImg} />;
      case 'md':
        return <img src={iconsMd} style={{ height: height || 50 }} className={classOfImg} />;
      case 'lock':
        return <img src={iconsLock} style={{ height: height || 50 }} className={classOfImg} />;
      default:
        return <img src={folder} style={{ height: height || 50 }} className={classOfImg} />;
    }
  };
  const handleClickOpen = (e, el) => {
    e.preventDefault();
    setOpenDialog(e.currentTarget);
    setItemSelect(el);
    setDataCurrent(el);
  };
  const handlePdf = async (url, type) => {
    let blob = url && (await fetch(url).then(async data => await data.blob()));
    let typeFile = 'application/pdf';

    var file = new Blob([blob], { type: typeFile });
    var fileURL = URL.createObjectURL(file);
    return fileURL;
  };
  let show = document.getElementById('show');

  const handleGetListFolder = () => {
    setLoading(true);
    fetchData(`${hostUrl}/folder-list?clientId=${clientId}`, 'GET', null, 'token_03')
      .then(async res => {
        // if (res.status) {
        // props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thành công !', variant: 'success' });
        const { data } = res;
        setListFolders(data);
        // props.handleReload && props.handleReload();
        setOpenDialogEnCode(false);
        // }
        //  else {
        //   setOpenDialogEnCode(false);
        //   props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thất bại !', variant: 'error' });
        // }
      })
      .catch(err => {
        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Thao tác thất bại !', variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
        return true;
      });
  };

  useEffect(
    () => {
      if (show && previewHtml) {
        show.innerHTML = previewHtml;
      }
    },
    [show, previewHtml, state.dialog, state.type],
  );

  const displayFileExcel = async item => {
    const token = localStorage.getItem('token_3');
    const url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${item._id}`;
    try {
      let reader = new FileReader();
      let file;
      let htmlstr;
      file = await (await fetch(url, { method: 'GET', headers: { Authorization: `Bear ${token}` } })).blob();
      reader.readAsArrayBuffer(file);
      reader.onload = e => {
        var data = new Uint8Array(reader.result);

        const wb = XLSX.read(data, { type: 'array' });
        htmlstr = XLSX.utils
          .sheet_to_html(wb.Sheets[wb.SheetNames[0]], { editable: true })
          .replace('<table', '<table id="table-preview-excel" border="1"');
        if (htmlstr) {
          htmlstr = htmlstr.replace(
            '</head>',
            `<style>
            #table-preview-excel{
              border: 1px solid gray;
              font-family: 'roboto',
            }
            #table-preview-excel td,tr{
              border: 1px solid gray;
              font-family: 'roboto',
            }
          
          </style></head>`,
          );

          let div = document.createElement('div');
          div.innerHTML = htmlstr;
          htmlstr = `<div>${htmlstr}</div>`;
          setPreviewHtml(htmlstr);
          // swal({
          //   content: (
          //     div
          //   ),
          //   className: 'swal-document',
          //   button: true,
          // });

          // htmlstr = htmlstr.replace('</body></html>', '');
        }
      };
    } catch (error) { }
  };
  const handleGetFileTXT = async url => {
    let objectURL = '';
    await fetch(url)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        setDocFile(blob);
        const file = new File([blob], 'foo.txt', {
          type: 'text/plain',
        });
        objectURL = URL.createObjectURL(file);
        return objectURL;
      })
      .catch(er => {
        console.log(er);
        return url;
      });
    return objectURL || url;
  };
  const handleViewFile = async currentItem => {
    if (!(currentItem && currentItem.isFile)) {
      let path = currentItem.fullPath.split('/');
      path = `/${path
        .filter((i, idx) => {
          return idx > 1;
        })
        .join('/')}/`;
      handleOpenFolder(false, 'read', path, false, currentItem);
      setDataPathGoBack(dataPathGoBack.concat(currentItem));
      setDisableBtnBack(false);
      setOpenDialog(null);
      return;
    }
    let url;
    let img;
    let type;
    const typeOfFile = (currentItem && currentItem.type && currentItem.type.toLowerCase()) || '';
    // if (currentItem && currentItem.isEncryption) {
    //   props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Tập tin không hỗ trợ xem online vui lòng tải xuống!', variant: 'warning' });
    //   setOpenDialog(null);
    //   return
    // }
    if (!ALLOW_FILE_EXT_UPLOAD.includes(typeOfFile)) {
      props.onChangeSnackbar &&
        props.onChangeSnackbar({ status: true, message: 'Tập tin không hỗ trợ xem online vui lòng tải xuống!', variant: 'warning' });
      setOpenDialog(null);
      return;
    }
    setLoadingPreFile(true);
    if (['.jpg', '.png', '.jpeg'].includes(typeOfFile)) {
      url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${currentItem._id}`;
      img = true;
    } else {
      img = false;
      if (typeOfFile === '.pdf') {
        url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${currentItem._id}`;
        url = await handlePdf(url, typeOfFile);
        type = 'pdf';
      }
      if (typeOfFile === '.xlsx') {
        url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${currentItem._id}`;
        await displayFileExcel(currentItem);
        type = 'xlsx';
      }
      if (typeOfFile === '.xls') {
        url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${currentItem._id}`;
        await displayFileExcel(currentItem);
        type = 'xls';
      }
      if (typeOfFile === '.docx') {
        url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${currentItem._id}`;
        await fetch(url).then(async res => {
          if (res) {
            let blob = await res.blob();
            if (blob) {
              let file = new File([blob], `new_file${new Date() * 1}`);
              file && setDocFile(file);
            }
          }
        });
        type = 'docx';
      }
      if (['.mp4', '.mp3'].includes(typeOfFile)) {
        url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${currentItem._id}`;
        await fetch(url).then(async res => {
          if (res) {
            let blob = await res.blob();
            if (blob) {
              let file = new File([blob], `new_file${new Date() * 1}`);
              url = URL.createObjectURL(file);
              file && setDocFile(file);
            }
          }
        });
        // type = currentItem.type.replace('.', '');
        type = 'audio';
      }
      if (typeOfFile === '.doc') {
        url = `${UPLOAD_APP_URL}/get-doc-like-pdf?id=${currentItem._id}&clientId=${clientId}`;
        url = await handleConvertDocLikePdf(url, '.pdf');
        type = 'pdf';
      }
      if (typeOfFile === '.txt') {
        type = typeOfFile;
        if (currentItem._id) {
          url = await handleGetFileTXT(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${currentItem._id}`);
        }
      }
    }
    setLoadingPreFile(false);
    console.log(url, 'url');
    setState({
      ...state,
      dialog: true,
      type,
      url,
      img,
    });
  };
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    fetchData(API_USERS, 'GET', null, 'token').then(res => {
      setAllUsers(res.data);
    });
  }, []);

  const handleDeleteItemFolder = () => {
    let path = itemSelect.fullPath.split('/');
    path = `/${path
      .filter((i, idx) => {
        return idx > 1;
      })
      .join('/')}/`;
    props.handleDeleteItem && props.handleDeleteItem('delete', path, [{ ...itemSelect }], [itemSelect.name], () => setOpenDialogDelete(false));
  };
  const downloadFile = (url, fileName) => {
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
  };
  const {
    tab,
    listFile = [],
    handelOpenDetail,
    openDetail,
    handleChangeOpenOCR,
    openDialogOCR,
    handleReload,
    handleChangeOpenSmart,
    openDialogSmart,
    handleChangeOpenImage,
    openDialogSearchImage,
    handleChangeTypeSearchImage,
    searchImage,
    handleChangleMetaDataOthers,
    handleChangeTypeEdit,
    typeEdit,
    handleOpenEditName,
    handleChangeSearchContent,
    profile,
    currentFolder,
    reloadPage,
    loadingPage,
    isDetail,
    classes,
    loadingDelete,
    loadingCallApi,
    renderListFolder,
    detailItem,
    handleChangeDetail,
    handleOpenFolder,
    handleGetDetailFieldConfig,
    handleGetDetailSmartForm,
    handleGetDetailSmartForm2,
    listFieldConfig,
    handleGetDetailFieldConfig2,
    listFieldSmart,
    listDetailSmartForm,
    optionSearch,
    handleChangeOptionSearch,
    codeSelected,
    setIsDelete,
    smartForms,
  } = props;
  useEffect(
    () => {
      setListIdsDelete([]);
    },
    [listFile],
  );

  useEffect(
    () => {
      setOpenDialogMetaData(false);
    },
    [tab],
  );
  const [allModule, setAllModule] = useState(true);
  useEffect(
    () => {
      console.log(codeSelected, 'codeSelected');
      if (codeSelected) {
        setAllModule(true);
      }
    },
    [codeSelected],
  );

  // meta_data_search
  // select1
  useEffect(
    () => {
      if (fieldConfig === 'cht') {
        handleGetDetailFieldConfig(fieldConfig);
      }
      if (fieldConfig === 'smf') {
        handleGetDetailSmartForm(fieldConfig);
      }
    },
    [fieldConfig],
  );
  // select2
  useEffect(
    () => {
      if (isItemConfig != '') {
        if (isItemConfig != false) {
          if (fieldConfig === 'cht') {
            console.log(isItemConfig, 'isItemConfigisItemConfig');
            handleGetDetailFieldConfig2(isItemConfig);
          }
          if (fieldConfig === 'smf') {
            handleGetDetailSmartForm2(isItemConfig);
          }
        }
      }
    },
    [isItemConfig],
  );
  const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const currentViewConfig =
    (listViewConfig && listViewConfig.filter(item => item.listDisplay.type.fields.type && item.listDisplay.type.fields.type.fileColumns)) || [];
  let others = [];
  currentViewConfig.forEach(item => {
    const other = item.listDisplay.type.fields.type.fileColumns;
    others = others.concat(other);
  });
  const length = others.length;

  // const listUser = [
  //   { user: { name: 'lê văn a', avatar: '' }, startDate: '11/11/2021', endDate: '11/12/2022', permissions: 'view' },
  //   { user: { name: 'lê văn b', avatar: '' }, startDate: '12/11/2021', endDate: '11/12/2022', permissions: 'view' },
  //   { user: { name: 'lê văn c', avatar: '' }, startDate: '13/11/2021', endDate: '11/12/2022', permissions: 'view' },
  //   { user: { name: 'lê văn d', avatar: '' }, startDate: '14/11/2021', endDate: '11/12/2022', permissions: 'view' },
  //   { user: { name: 'lê văn e', avatar: '' }, startDate: '15/11/2021', endDate: '11/12/2022', permissions: 'view' },
  //   { user: { name: 'lê văn f', avatar: '' }, startDate: '16/11/2021', endDate: '11/12/2022', permissions: 'view' },
  //   { user: { name: 'lê văn g', avatar: '' }, startDate: '17/11/2021', endDate: '11/12/2022', permissions: 'view' },
  // ];
  /** Handle form search*/

  const { control, handleSubmit } = useForm({
    defaultValues: '',
  });
  const handleFormSubmit = formValues => { };

  {
    /* Xu ly data && path move file */
  }
  const [pathGoBack, setPathGoBack] = useState([]);
  const [dataPathGoBack, setDataPathGoBack] = useState([]);
  const [disableBtnBack, setDisableBtnBack] = useState(true);
  const [disableBtnMove, setDisableBtnMove] = useState(true);
  const [dataCurrent, setDataCurrent] = useState({});
  const [pathCurrent, setPathCurrent] = useState('/');
  const [pathMove, setPathMove] = useState('/');
  const [disableMenuDelete, setDisableMenuDelete] = useState(false);
  useEffect(
    () => {
      setDataPathGoBack([]);
    },
    [tab],
  );
  let lengthData = dataPathGoBack.length;
  useEffect(
    () => {
      if (pathCurrent === pathMove) {
        setDisableBtnMove(true);
      } else {
        setDisableBtnMove(false);
      }
    },
    [pathCurrent, pathMove],
  );
  useEffect(
    () => {
      const diffMinutes = moment(new Date()).diff(dataCurrent.updatedAt, 'minutes');
      if (dataCurrent.isEncryption === true && diffMinutes > 30) {
        setDisableMenuDelete(true);
      } else {
        setDisableMenuDelete(false);
      }
    },
    [dataCurrent],
  );
  const styleFolder = {
    border: '1px solid silver',
    padding: '0px 0px 0px 5px',
    margin: '5px 0px',
    borderRadius: '5px',
    backgroundColor: '#F5F5F5',
  };

  const handleSearch = e => {
    e.target.value = clearWidthSpace(e.target.value).trimStart();
    const textSearch = e.target.value;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setSearch(textSearch.toLowerCase());
      setSearchInput(textSearch.toLowerCase());
    }, 500);
  };

  const startRecording = () => {
    setIsRecording(true);
  };
  const requestRecorder = async () => {
    let stream;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } else console.log('error');
    return new MediaRecorder(stream);
  };

  const setDataUpdate = async () => {
    if (!recorder) {
      if (isRecording) {
        requestRecorder().then(data => {
          setRecorder(data);
        });
        // requestRecorder().then(setRecorder, console.error);
      }
      return;
    }
    if (isRecording) {
      setActiveConvert(false);

      recorder.start();
    } else {
      setActiveConvert(true);
      recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = e => {
      setAudioURL(URL.createObjectURL(e.data));
      setDataUpload(e);
    };

    recorder.addEventListener('dataavailable', handleData);
    return () => recorder.removeEventListener('dataavailable', handleData);
  };
  useEffect(
    () => {
      console.log('run 123');
    },
    [listUser],
  );

  const startConvert = async () => {
    setActiveConvert(false);
    const data = {
      lastModified: dataUpload ? dataUpload.timecode : null,
      lastModifiedDate: moment(),
      name: `File_ghi_âm_${moment().format('hh:mm DD/MM/YYYY')}`,
    };
    const dataUploads = dataUpload ? dataUpload.data : null;
    let dataRecord = dataUpload ? Object.assign(dataUploads, data) : null;
    const form = new FormData();

    let file = dataRecord;
    form.append('data', file);
    setWaitConvert(false);
    setDataUpload(null);

    if (file) {
      try {
        const url = SPEECH_2_TEXT;
        const head = {
          body: form,
          method: 'POST',
        };
        setLoadingVoice(true);
        await fetch(url, head)
          .then(res => res.json())
          .then(res => {
            setLoadingVoice(false);
            if (res.status === 'ok') {
              const str = res.str.join('\n');
              // onChange && onChange({ target: { name: restProps.name, value: str } });
              if (res && res.str && Array.isArray(res.str) && res.str.length) {
                const e = {
                  target: {
                    value: res.str[0],
                  },
                };
                handleSearch(e);
              }
            } else {
              // onChange && onChange({ target: { name: restProps.name, value: res.traceback } });
              // alert(res.traceback);
            }
            setWaitConvert(false);
          })
          .catch(e => {
            console.log(e, 'error');
            setWaitConvert(false);
            setLoadingVoice(false);
          });
      } catch (err) {
        console.log(err, 'error');
      }
    } else {
      setWaitConvert(false);

      // this.props.onChangeSnackbar && this.props.onChangeSnackbar({ variant: 'warning', message: 'Có vẻ không thu được âm thanh nào!', status: true });
    }
  };
  const stopRecording = () => {
    setIsRecording(false);
  };

  useEffect(
    () => {
      setDataUpdate();
      if (waitConvert && dataUpload && dataUpload.data) {
        startConvert();
      }
    },
    [loadingVoice, isRecording, recorder, waitConvert, activeConvert, audioURL, dataUpload, search],
  );

  // const classesSearch = useStyles();

  useEffect(
    () => {
      setValueSearch(search);
      if (timeout) clearTimeout(timeout);
      let timeout = setTimeout(() => {
        handleChangeSearchContent(search);
        setOpenDialogVoice(false);
        setSearchInput(null);
      }, 5000);
    },
    [search],
  );
  const [filterMeta, setFilterMeta] = useState({});
  const handleChangeFilter = (dataFilter) => {
    console.log(dataFilter, 'dataFilter');
    setFilterMeta({ ...filterMeta, ...dataFilter });
  };
  const handleReloadFile = () => {
    setFilterMeta({});
    handleReload();
  };

  // useEffect(() => {
  //   if(!openDialogVoice){
  //     setSearchInput(null)
  //   }
  // }, [openDialogVoice])

  // // Handle metadata smart form
  // const handleSmartForm = code => {
  //   const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  //   const currentViewConfig = listViewConfig.filter(item => item.listDisplay.type.fields.type && item.listDisplay.type.fields.type.fileColumns) || [];
  //   let others = [];
  //   currentViewConfig.forEach(item => {
  //     const other = item.listDisplay.type.fields.type.fileColumns;
  //     others = others.concat(other);
  //     others = _.uniqBy(others, 'name');
  //   });
  //   const filteredOthers = others.filter(item => item.checkedShowForm);
  // };

  const handleDoubleClick = (e, el) => {
    if(props.isDelete){

      let path = el.fullPath.split('/');
      path = `/${path
        .filter((i, idx) => {
          return idx > 1;
        })
        .join('/')}/`;
      handleOpenFolder && handleOpenFolder(false, 'read', path, false, el);
    }
    else {
      alert('Bạn phải khôi phục mới có thể xem file')
    }
  };
  const handleRenderRouter = () => { };
  const handleClearFilter = () => {
    setFilterMeta({});
    // call api
    handleReload();
  };
  const handleRenderPath = (data) => {
    let newPath = data.replace(clientId, "Kho dữ liệu số")
    if (props.tab === 'company') {
      newPath = newPath.replace("company", "Kho dữ liệu số công ty")
    } else if (props.tab === "users") {
      newPath = newPath.replace("users", "Kho dữ liệu số của tôi")
    } else if (props.tab === "share") {
      newPath = newPath.replace("share", "Được chia sẻ với tôi")
    }
    let path = newPath.split('/') || []
    path = path.filter(it => it)
    if (path.length <= 2) {
      return newPath;
    }
    else {
      const newPath2 = `${path[0]}/.../${path[path.length - 1]}/`
      return newPath2
    }
  }
  const handleRenderName = (data) => {


    return data === 'company' ? data.replace('company', 'Driver công ty') : data

  }

  return (
    <>
      <Grid item md={12} container className="main_title">
        <Grid item md={6} className="routerFolder">
          &nbsp;
          {type === 0 ? <DehazeIcon className="show_icons" onClick={() => setType(1)} /> : null}
          {type === 1 ? <ViewModuleIcon className="show_icons" onClick={() => setType(0)} /> : null}
          {/* </Grid>
        <Grid item md={3}> */}
          {/* &nbsp; {currentFolder && currentFolder.fullPath} */}
          &nbsp; {currentFolder && currentFolder.fullPath && handleRenderPath(currentFolder.fullPath)}
        </Grid>
        {props.isDelete ?
          <Grid item md={6} style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            {!isDetail && (
              <>
                &nbsp;
                <Tooltip title="Thông tin">
                  <InfoIcon
                    onClick={() => {
                      handelOpenDetail && handelOpenDetail();
                    }}
                    className="show_icons"
                  />
                </Tooltip>
              </>
            )}
            &nbsp;
            <Tooltip title="Tìm kiếm nâng cao">
              <FilterListOutlinedIcon
                className="iconsOptionSearch"
                onClick={e => {
                  setOpenOptionSearch(e.currentTarget);
                }}
              />
            </Tooltip>
            <div>
              <SearchIcon className="iconsSearch" />
              <InputBase
                className="show_icons_search"
                placeholder="Nhập Tìm Kiếm"
                value={valueSearch ? valueSearch : null}
                onChange={e => {
                  setValueSearch(e.target.value);
                  let data = e.target.value;
                  if (timeout) clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    handleChangeSearchContent(data);
                  }, 500);
                }}
              />
            </div>
            {/* <SearchIcon className='iconsSearch'/> */}
            {/* &nbsp; */}
            <Tooltip title="Reload">
              <CachedIcon
                onClick={() => {
                  handleReload && handleReload(true);
                }}
                className="show_icons"
              />
            </Tooltip>
            &nbsp;
            <Tooltip title="speech to text">
              <MicIcon className="show_icons" onClick={() => setOpenDialogVoice(true)} color="primary" />
            </Tooltip>
            &nbsp;
            <Tooltip title="Search image">
              <CameraAltOutlinedIcon className="show_icons" onClick={() => handleChangeOpenImage(true)} />
            </Tooltip>
            &nbsp;
            {/* {tab === 'company' || tab === 'user' ? (
            <>
              <Tooltip title="Trích xuất Smart form">
                <ScreenShareOutlinedIcon className="show_icons" onClick={() => handleChangeOpenSmart(true)} />
              </Tooltip>
              &nbsp;
            </>
          ) : null} */}
            {tab === 'company' || tab === 'users' ? (
              <>
                <Tooltip
                  title="OCR"
                  onClick={() => {
                    handleChangeOpenOCR(true);
                    setFiles();
                    setIsChosseFile(true);
                    setIsScan(false);
                    setDisablebtnOCR(true);
                    setIsOCRInSt(false);
                  }}
                >
                  <CropFreeIcon className="show_icons" color="primary" />
                </Tooltip>
                &nbsp; &nbsp;
              </>
            ) : null}
            <Tooltip title="Meta data">
              <TocIcon
                color="primary"
                className="svg_icons"
                onClick={() => {
                  setOpenDialogMetaData(!openDialogMetaData);
                }}
              />
            </Tooltip>
          </Grid>
          :
          <Grid item md={6} style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <>
              &nbsp;
              <Tooltip title="Thông tin">
                <InfoIcon
                  onClick={() => {
                    handelOpenDetail && handelOpenDetail();
                  }}
                  className="show_icons"
                />
              </Tooltip>
            </>

            &nbsp;
            <Tooltip title="Tìm kiếm nâng cao">
              <FilterListOutlinedIcon
                className="iconsOptionSearch"
                onClick={e => {
                  setOpenOptionSearch(e.currentTarget);
                }}
              />
            </Tooltip>
            <div>
              <SearchIcon className="iconsSearch" />
              <InputBase
                className="show_icons_search"
                placeholder="Nhập Tìm Kiếm"
                value={valueSearch ? valueSearch : null}
                onChange={e => {
                  setValueSearch(e.target.value);
                  let data = e.target.value;
                  if (timeout) clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    handleChangeSearchContent(data);
                  }, 500);
                }}
              />
            </div>
            &nbsp;
            <Tooltip title="Dọn sạch thùng rác">
              <button style={{ fontWeight: '600', marginTop: '-5px' }}
                onClick={() => {
                  setOpenDialogCleanUp(true);

                }}>Dọn sạch thùng rác</button>
            </Tooltip>
          </Grid>
        }
      </Grid>
      {/* !loadingPage && */}
      {(
        <>
          {type == 0 && (
            <Grid
              item
              md={12}
              style={{
                height: 'calc(100vh - 150px)',
                overflowY: 'scroll',
                overflowX: 'hidden',
                borderTop: '1px solid black',
              }}
              renderBackground
            >
              {/* meta_data */}
              {(tab === 'company' || tab === 'users') &&
                openDialogMetaData && (
                  <Grid item md={12} alignItems="center">
                    {/* {others.length ? ( */}
                    <>
                      <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <Grid xs={12} style={{ marginLeft: 10 }} container spacing={16}>
                          <Grid item md={2} sm={2}>
                            <SelectField
                              SelectProps={{ classes: { select: classes.selectField } }}
                              onItemConfig={data => {
                                setFieldConfig(data);
                                setFilterMeta({});
                                setIsConfig(data);
                              }}
                              name="selectMeta1"
                              control={control}
                              options={[
                                { title: 'Cấu hình trường', _id: 'cht', label: 'Cấu hình trường' },
                                { title: 'Smart form', _id: 'smf', label: 'Smart form' },
                              ]}
                            />
                          </Grid>
                          {isConfig &&
                            isConfig != '' && (
                              <Grid item md={2} sm={2}>
                                <SelectField
                                  onItemConfig={data => {
                                    setFilterMeta({});
                                    console.log(data, 'dsadasdsa');
                                    setIsItemConfig(data);
                                  }}
                                  SelectProps={{ classes: { select: classes.selectField } }}
                                  name="selectMeta2"
                                  control={control}
                                  options={
                                    fieldConfig === 'cht'
                                      ? [...listFieldConfig].map(item => item[1])
                                      : fieldConfig === 'smf'
                                        ? [...listFieldSmart].map(item => item[1])
                                        : []
                                  }
                                />
                              </Grid>
                            )}
                          {isItemConfig &&
                            isConfig &&
                            isConfig != '' && (
                              <Grid container md={4} sm={4} spacing={16} style={{ marginLeft: 0, marginTop: 8 }}>
                                {/* {[{ name: 'meta1' }, { name: 'meta2' }].map(meta => (
                                  <Grid item xs={6} md={6} sm={6}>
                                    <InputField
                                      style={{ textAlign: 'center' }}
                                      InputProps={{ classes: { input: classes.inputField } }}
                                      label={meta.name}
                                      variant="outlined"
                                      name={meta.name}
                                      control={control}
                                    />
                                  </Grid>
                                ))} */}
                                {fieldConfig === 'smf' &&
                                  listDetailSmartForm.moduleCode && (
                                    <CustomGroupInputField
                                      autoDown
                                      code={listDetailSmartForm.moduleCode}
                                      itemConfig={listDetailSmartForm.config}
                                      columnPerRow={2}
                                      isSmartForm
                                      source="fileColumns"
                                      onChange={handleChangeFilter}
                                      value={filterMeta}

                                    // value={this.state.localState.others}
                                    // othersLength={this.state.otherLength}
                                    // onChangeSearch={this.dialogSave}
                                    // handleReload={this.handleReload}
                                    />
                                  )}
                                {fieldConfig === 'cht' && (
                                  <CustomGroupInputField
                                    autoDown
                                    allModule={allModule}
                                    columnPerRow={2}
                                    source="fileColumns"
                                    code={codeSelected}
                                    onChange={data => handleChangeFilter(data)}
                                    value={filterMeta}
                                    // othersLength={this.state.otherLength}
                                    // onChangeSearch={this.dialogSave}
                                    handleReload={handleReloadFile}
                                  />
                                )}
                              </Grid>
                            )}
                          {isItemConfig &&
                            isConfig &&
                            isConfig != '' && (
                              <Grid
                                container
                                md={3}
                                sm={3}
                                style={{ marginTop: 16, marginLeft: 8 }}
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={16}
                              >
                                <Grid item>
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    // onClick={this.dialogSave}
                                    fullWidth
                                    style={{ height: 40, textTransform: 'none' }}
                                    type="submit"
                                    onClick={handleSearchMetaData}
                                  >
                                    Tìm kiếm
                                  </Button>
                                </Grid>
                                <Grid item>
                                  <Button
                                    sentenceCase
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleClearFilter}
                                    style={{ height: 40, textTransform: 'none' }}
                                  >
                                    Xóa tìm kiếm
                                  </Button>
                                </Grid>
                              </Grid>
                            )}
                          {/* <CustomGroupInputField
                            allModule
                            columnPerRow={4}
                            source="fileColumns"
                            autoDown
                            isLifeDrive
                            onChange={e => {
                              console.log('eeeeeeee', e);
                              setSearchMeta(e);
                            }}
                            value={searchMeta}
                          /> */}
                          {/* {others.length >= 6 ? ( */}
                        </Grid>
                      </form>
                      {/* ) : null} */}
                    </>
                    {/* ) : null} */}
                  </Grid>
                )}

              {/* folder */}
              {listFile && Array.isArray(listFile) && listFile.length ? (
                <>
                  <Grid
                    item
                    md={12}
                    container
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: '#5F6368',
                    }}
                  >
                    Thư mục {listFile.filter(it => it.isFile === false).length}
                  </Grid>
                  <Grid item md={12} sm={12} container spacing={5} style={{ margin: 0, padding: '12px' }}>
                    {listFile.filter(it => it.isFile === false && it.canDelete !== false ).map(el => {
                      return (
                        <>
                          <Grid
                            item
                            md={isDetail ? 3 : 2}
                            style={{ cursor: 'pointer', margin: '10px' }}
                            onMouseDown={() => {
                              return false;
                            }}
                          >
                            <Paper
                              className="new_folder"
                              elevation={2}
                              onClick={e => handleChangeDetail(e, el)}
                              onContextMenu={e => handleClickOpen(e, el)}
                              onDoubleClick={e => {
                                if(props.isDelete){

                                  let path = el.fullPath.split('/');
                                  path = `/${path
                                    .filter((i, idx) => {
                                      return idx > 1;
                                    })
                                    .join('/')}/`;
                                  handleOpenFolder && handleOpenFolder(false, 'read', path, false, el);
                                  setDataPathGoBack(dataPathGoBack.concat(el));
                                  setDisableBtnBack(false);
                                  setDataCurrent(el);
                                  setPathCurrent(el.fullPath);
                                }
                                else {
                                  alert('Bạn phải khôi phục mới có thể xem file')
                                }
                              }}
                            // onDoubleClick={(e)=>handleDoubleClick(e,el)}
                            >
                              {renderBackground(el, 0, 'imgFile', 'nameFolderList')}
                              <p className="nameFolderList">
                                <Tooltip className="nameFolder_titel" title={(el && el.name) || ''}>
                                  <div className="nameFolder">{(el && el.name) || ''}</div>
                                </Tooltip>
                              </p>
                            </Paper>
                          </Grid>
                        </>
                      );
                    })}
                  </Grid>
                  {/* file */}
                  <Grid
                    item
                    md={12}
                    container
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: '#5F6368',
                    }}
                  >
                    Tập tin {listFile.filter(it => it.isFile === true).length}
                  </Grid>

                  <Grid item md={12} container spacing={16} style={{ margin: 0, padding: 0 }}>
                    {listFile.filter(it => it.isFile === true).map(el => {
                      return (
                        <>
                          <Grid
                            item
                            md={1}
                            style={{ cursor: 'pointer', width: 100, height: 100, marginLeft: '10px', marginRight: '10px', padding: 0 }}
                            onClick={e => {
                              handleChangeDetail(e, el);
                            }}
                            onContextMenu={e => {
                              handleClickOpen(e, el);
                            }}
                          >
                            <Grid item md={12} style={{ display: 'flex', justifyContent: 'center' }}>
                              {renderBackground(el, 0, 'imgFile', 'nameFolderList')}
                            </Grid>
                            {/* <p style={{ display: 'flex', justifyContent: 'center' }}>
                          <div className="nameFolder">{(el && el.name) || ''}</div>
                        </p> */}

                            <p style={{ display: 'flex', justifyContent: 'center' }}>
                              <Tooltip title={(el && el.name) || ''}>
                                {props.isDelete ?

                                  <div className="nameFile">{(el && el.name) || ''}</div>
                                  :
                                  <div className="nameFile" style={{ fontStyle: 'italic', opacity: '0.5' }}>{(el && el.name) || ''}</div>

                                }
                              </Tooltip>
                            </p>{' '}
                          </Grid>
                        </>
                      );
                    })}
                  </Grid>
                </>
              ) : (
                // không có tập tin
                <>
                  {/*  không có tập tin */}
                  <Grid style={{ textAlign: 'center', marginTop: '15%' }}>
                    <img src={folderEmpty} style={{ height: 250 }} />;<p style={{ fontSize: 15, fontWeight: 'bold' }}>Thư mục trống</p>
                  </Grid>
                </>
              )}
            </Grid>
          )}

          {/* dạng list */}
          {(type === 1 && (
            <>
              <Grid
                item
                md={12}
                style={{
                  height: 'calc(100vh - 150px)',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  borderTop: '1px solid black',
                }}
              >
                <EnhancedTable
                  onDoubleClick={handleDoubleClick}
                  onContextMenu={handleClickOpen}
                  setDetailItem={setDetailItem}
                  renderBackground={renderBackground}
                  rows={listFile}
                  checkSelect={listIdsDelete.length}
                  handleDeleteItem={ids => {
                    setListIdsDelete(ids);
                    setOpenDialogDeleteList(true);
                  }}
                />
              </Grid>
            </>
          )) ||
            null}
        </>
      ) || null}
      {/* dạng lưới */}

      {/* menu click right in item */}
      {openDialog && (props.isDelete ?
        <Menu
          open={Boolean(openDialog)}
          anchorEl={openDialog}
          style={{ minHeight: 250 }}
          keepMounted
          onClose={() => {
            setOpenDialog(null);
            // setItemSelect(null);
          }}
          onContextMenu={e => {
            e.preventDefault();
            setOpenDialog(null);
          }}
          id="idMenuFilesManager"

        >
          <MenuItem style={{ height: 20 }} onClick={() => handleViewFile(itemSelect)} >
            <VisibilityOutlinedIcon /> &nbsp; Xem
          </MenuItem>
          {((props.tab === 'company' && props.companyRoles.edit) || (props.tab === 'users' && props.myDriveRoles.edit)) && (
            <>
              <MenuItem
                style={{
                  height: 20,
                  //  borderTop: '1px solid'
                }}
                onClick={() => {
                  const data = itemSelect;
                  let dataUser = [];
                  let dataUserSelect = [];
                  data.shares &&
                    data.shares.map(it => {
                      const itemNew = allUsers.find(el => el.username === it.username);
                      dataUser.push({
                        user: { ...itemNew },
                        startDate: it.timeStart,
                        endDate: it.timeEnd,
                        permissions: it.permission,
                      });
                      dataUserSelect.push(itemNew);
                    });
                  console.log(dataUser, 'dataUser');
                  setListUser(dataUser);
                  setListUserSelect(dataUserSelect);
                  setOpenDialog(null);
                  setOpenDialogShare(true);

                }}
              >
                <PersonAddOutlinedIcon /> &nbsp; Chia sẻ
              </MenuItem>
              <MenuItem
                style={{
                  height: 20,
                  //  borderTop: '1px solid'
                }}
                onClick={() => {
                  setOpenDialogTick(true);
                  setOpenDialog(null);
                  setLoading(false);
                }}
              >
                <StarOutlineOutlinedIcon /> &nbsp; Đánh dấu
              </MenuItem>
              {itemSelect && itemSelect.isFile && !itemSelect.isEncryption ? (
                <MenuItem
                  style={{
                    height: 20,
                    // borderTop: '1px solid'
                  }}
                  onClick={() => {
                    setOpenDialogEnCode(true);
                    setOpenDialog(null);
                    setLoading(false);
                    // setErrName()
                  }}
                >
                  <LockOutlinedIcon /> &nbsp; Mã hóa
                </MenuItem>
              ) : null}
              {itemSelect && itemSelect.isEncryption ? (
                <MenuItem
                  style={{
                    height: 20,
                    // borderTop: '1px solid'
                  }}
                  onClick={() => {
                    setOpenDialogDecryption(true);
                    setOpenDialog(null);
                    setLoading(false);
                    setHasFile(false);
                    handleGetListFolder();
                    setParentPath('')
                    setPathGoBack([])
                  }}
                >
                  <LockOpenOutlinedIcon /> &nbsp; Giải mã
                </MenuItem>
              ) : null}
              {itemSelect && itemSelect.isFile ? (
                <MenuItem
                  style={{
                    height: 20,
                    // borderTop: '1px solid'
                  }}
                  onClick={() => {
                    handleChangeOpenOCR(true);
                    setIsChosseFile(false);
                    setOpenDialog(null);
                    setLoading(false);
                    setDisablebtnOCR(false);
                    setIsOCRInSt(true);
                    handleGetOcr();
                  }}
                >
                  <CropFreeIcon /> &nbsp; OCR
                </MenuItem>
              ) : null}
              <MenuItem
                style={{
                  height: 20,
                  //  borderTop: '1px solid'
                }}
                onClick={() => {
                  setPathMove(itemSelect.parentPath);
                  setPathCurrent(itemSelect.parentPath);
                  setDataCurrent(itemSelect);
                  handleGetListFolder();
                  setOpenDialogMove(true);
                  setOpenDialog(null);
                }}
              >
                <InputOutlinedIcon /> &nbsp; Di chuyển
              </MenuItem>
              <MenuItem
                style={{
                  height: 20,
                  //  borderTop: '1px solid'
                }}
                onClick={() => {
                  // setOpenDialogMove(true);
                  setOpenDialog(null);
                }}
              >
                <OpenInBrowserOutlinedIcon /> &nbsp; Chuyển sang Google drive
              </MenuItem>
              <MenuItem
                style={{
                  height: 20,
                  //  borderTop: '1px solid'
                }}
                onClick={() => {
                  handleChangeTypeEdit(itemSelect);
                  handleOpenEditName(true);
                  setOpenDialog(null);
                }}
              >
                <BorderColorOutlinedIcon /> &nbsp; Đổi tên
              </MenuItem>
            </>
          )}
          {((props.tab === 'company' && props.companyRoles.delete) || (props.tab === 'users' && props.myDriveRoles.delete)) && (
            <MenuItem
              disabled={disableMenuDelete}
              style={{
                height: 20,
                // borderTop: '1px solid'
              }}
              onClick={() => {
                setOpenDialogDelete(true);
                setOpenDialog(null);
              }}
            >
              <DeleteOutlinedIcon /> &nbsp; Xóa
            </MenuItem>
          )}
          {((props.tab === 'company' && props.companyRoles.edit) || (props.tab === 'users' && props.myDriveRoles.edit)) && (
            <>
              {(itemSelect.isFile && (
                <MenuItem
                  style={{
                    height: 20,
                    // borderTop: '1px solid'
                  }}
                  onClick={() => {
                    setOpenDialogDuplicate(true);
                    setOpenDialog(null);
                    setLoading(false);
                  }}
                >
                  <FileCopyOutlinedIcon /> &nbsp; Nhân bản
                </MenuItem>
              )) ||
                null}

              <MenuItem
                style={{
                  height: 20,
                  // borderTop: '1px solid'
                }}
                onClick={async () => {
                  // setOpenDialogDelete(true);

                  const url = `${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${itemSelect._id}`;
                  downloadFile(url, itemSelect.name);
                  setOpenDialog(null);
                  return;
                }}
              >
                <GetAppOutlinedIcon /> &nbsp; Tải xuống
              </MenuItem>
            </>
          )}
        </Menu>
        :
        <Menu open={Boolean(openDialog)}
          anchorEl={openDialog}
          style={{ minHeight: 250 }}
          keepMounted
          onClose={() => {
            setOpenDialog(null);
            // setItemSelect(null);
          }}
          onContextMenu={e => {
            e.preventDefault();
            setOpenDialog(null);
          }}
          id="idMenuFilesManager">
          <MenuItem style={{ height: 20 }} onClick={handleRestore}>
            <Restore /> &nbsp; Khôi phục
          </MenuItem>
          <MenuItem style={{ height: 20 }} onClick={handleDelete} >
            <Delete /> &nbsp; Xóa vĩnh viễn
          </MenuItem>
        </Menu>
      )}

      {/* xem file */}

      {state.dialog && (
        <Dialog
          maxWidth={'md'}
          docFile={docFile}
          typeFile={state.type}
          fullScreen
          open={state.dialog}
          onClose={() => setState({ ...state, dialog: false, type: '' })}
        >
          <div style={{ height: state.type === 'audio' ? 'auto' : '1000px', textAlign: 'center' }} id="containerIframe">
            {state.type === 'audio' || state.type === 'xlsx' || state.type === 'xls' ? null : <div id="overlay" />}
            {state.img === true ? (
              <img alt="HHH" src={state.url} style={{ maxHeight: 800 }} />
            ) : (
              <>
                {/* {state.type === 'pdf' && <iframe title="PDF" src={`${state.url}#toolbar=0` } frameBorder="0" width="100%" height="100%" value="file" />} */}
                {state.type === 'pdf' && (
                  <div id="watermark" style={{ width: '100%', height: '100%' }}>
                    <iframe title="PDF" src={`${state.url}#toolbar=0`} width="100%" style={{ height: '100%' }} value="file" />
                    <p>{profile.name}</p>
                  </div>
                )}

                {/* {(state.type === 'xlsx' || state.type === 'xls') && <div id="show" />} */}
                {(state.type === 'xlsx' || state.type === 'xls') && (
                  <div id="watermark" style={{ width: '100%', height: '100%' }}>
                    <iframe
                      id="main_frame"
                      title="Excel"
                      src={`https://docs.google.com/viewer?url=${state.url}&embedded=true`}
                      width="100%"
                      style={{ height: '100%' }}
                      value="file"
                    />
                    <p>{profile.name}</p>
                  </div>
                )}

                {state.type === '.txt' && <iframe title="txt" src={`${state.url}`} width="100%" height="100%" value="file" />}
                {/* {state.type === 'audio' && <iframe title="video" src={`${state.url}`} width="100%" height="100%" value="file" />} */}

                {state.type === 'audio' && (
                  <video width="100%" controls autoPlay controlsList="nodownload" disablePictureInPicture>
                    <source src={state.url} type="video/mp4" />
                  </video>
                )}
              </>
            )}
          </div>
        </Dialog>
      )}

      {/* loading xem file */}
      {loadingPreFile && (
        <Dialog dialogAction={false} open={loadingPreFile}>
          <DialogContent>Đang load dữ liệu, đồng chí vui lòng chờ...</DialogContent>
        </Dialog>
      )}
      {/* xóa lưới */}
      {openDialogDelete && (
        <DialogMUI open={openDialogDelete} onClose={() => setOpenDialogDelete(false)}>
          <DialogTitle id="alert-dialog-title">Đồng chí có chắc chắn muốn xóa</DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialogDelete(false);
              }}
              variant="contained"
              color="secondary"
              autoFocus
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                handleDeleteItemFolder();
              }}
              variant="contained"
              color="primary"
              disabled={loadingDelete}
            >
              Đồng ý
            </Button>
          </DialogActions>
        </DialogMUI>
      )}
      {openDialogCleanUp && (
        <DialogMUI open={openDialogCleanUp} onClose={() => setOpenDialogCleanUp(false)}>
          <DialogTitle id="alert-dialog-title">Đồng chí có chắc chắn muốn xóa vĩnh viễn</DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialogCleanUp(false);
              }}
              variant="contained"
              color="secondary"
              autoFocus
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                setOpenDialogCleanUp(false)
                handleRemoveAll()
              }}
              variant="contained"
              color="primary"
              disabled={loadingDelete}
            >
              Đồng ý
            </Button>
          </DialogActions>
        </DialogMUI>
      )}
      {/* Đánh dấu file,folfer */}

      {openDialogTick && (
        <DialogMUI open={openDialogTick} onClose={() => setOpenDialogTick(false)} fullWidth>
          <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
            Bạn có muốn đánh dấu file này không ?
          </DialogTitle>

          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialogTick(false);
              }}
              variant="contained"
              color="secondary"
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                setOpenDialogTick(false);
                handleTickFile();
              }}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Đồng ý
            </Button>
          </DialogActions>
        </DialogMUI>
      )}
      {/* duplicate - nhân bản*/}
      {openDialogDuplicate && (
        <DialogMUI open={openDialogDuplicate} onClose={() => setOpenDialogDuplicate(false)} fullWidth>
          <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
            Bạn có muốn nhân bản file này không ?
          </DialogTitle>

          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialogDuplicate(false);
              }}
              variant="contained"
              color="secondary"
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                handleDuplicateFile();
              }}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Đồng ý
            </Button>
          </DialogActions>
        </DialogMUI>
      )}
      {/* Chia sẻ file,folfer */}

      {openDialogShare && (
        <DialogMUI open={openDialogShare} onClose={() => setOpenDialogShare(false)} fullWidth>
          <DialogTitle id="alert-dialog-title">Chia sẻ {itemSelect && itemSelect.name}</DialogTitle>
          <DialogContent id="alert-dialog-title">
            <>
              <Grid item md={12} spacing={16} st>
                <AsyncAutocomplete
                  label="Thêm người được chia sẻ"
                  url={API_USERS}
                  value={listUserSelect}
                  filter={{ _id: { $ne: props.profile._id } }}
                  onChange={value => {
                    handleChangePeopleShare(value);
                  }}
                  variant="outlined"
                  margin="dense"
                  isMulti
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item md={12} spacing={16} style={{ height: 400, overflow: 'auto' }}>
                {/* listUser */}
                {(listUser &&
                  Array.isArray(listUser) &&
                  listUser.length &&
                  listUser.map((el, index) => {
                    return (
                      <Grid item md={12} spacing={16} style={{ marginTop: 5, marginLeft: 0, alignItems: "center" }} container>
                        <Grid md={3} container>
                          <Avatar
                            srcSet={avatarDefault}
                            src={(el.user && el.user.avatar) || avatarDefault}
                            style={{
                              width: 30,
                              height: 30,
                              margin: '0px 5px',
                            }}
                          />
                          {el && el.user && el.user.name}
                        </Grid>
                        <Grid item container md={6}>
                          <Grid item xs={5}>
                            <CustomDatePicker
                              variant="standard"
                              value={el.startDate}
                              name="startDate"
                              onChange={e => handleChangeDateShare('startDate', moment(e).format('YYYY-MM-DD'), el)}
                            // label= "Ngày bắt đầu"
                            />
                          </Grid>
                          <Grid item xs={2} />
                          <Grid item xs={5}>
                            <CustomDatePicker
                              variant="standard"
                              name="endDate"
                              value={el.endDate}
                              onChange={e => handleChangeDateShare('endDate', moment(e).format('YYYY-MM-DD'), el)}
                            // label= "Ngày kết thúc"
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          md={3}
                          style={{
                            justifyContent: 'center',
                          }}
                        >
                          <div>
                            <select
                              className="selectPermission"
                              name="permissions"
                              value={el && el.permissions && el.permissions}
                              onChange={e => {
                                handleChangeRole(e, el);
                              }}
                            >
                              <option value="view">Xem</option>
                              <option value="edit">Chỉnh sửa</option>
                              <option value="permissionEdit">Chuyển quyền sở hữu</option>
                              <option value="delete">Xóa quyền truy cập</option>
                            </select>

                            {/* <ArrowDropDownIcon /> */}
                          </div>
                          {/* <Grid item md={3}>
                          {el && el.permissions} */}
                        </Grid>
                      </Grid>
                    );
                  })) ||
                  null}
              </Grid>
              <Grid item md={12} spacing={16} container>
                <Grid item md={9}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label={''}
                    variant="outlined"
                    value={'http://lifetek.vn'}
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item md={3} style={{ marginTop: 10 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigator.clipboard.writeText('Copy được rồi nè, hihi');
                    }}
                  >
                    Copy link
                  </Button>
                </Grid>
              </Grid>
            </>
          </DialogContent>

          <DialogActions>
            {/* <Button
              onClick={() => {
                setOpenDialogShare(false);
              }}
              variant="contained"
              color="secondary"
            >
              Hủy
            </Button> */}
            <Button
              onClick={() => {
                // setOpenDialogTick(false);
                handleShareFile();
              }}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Đồng ý
            </Button>
          </DialogActions>
        </DialogMUI>
      )}

      {/* mã hóa */}
      {openDialogEnCode && (
        <DialogMUI
          open={openDialogEnCode}
          onClose={() => {
            setOpenDialogEnCode(false);
            setNameEncode('');
          }}
          fullWidth
        >
          <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
            Bạn có muốn muốn mã hóa file này không ?
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              id="outlined-basic"
              label={'Tên file mật khẩu'}
              variant="outlined"
              onChange={e => {
                const value = e.target.value || '';
                setNameEncode(value || '');
              }}
              // inputProps={{ maxLength: 75 }}
              value={nameEncode}
              style={{ marginTop: 10 }}
              autoFocus={true}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialogEnCode(false);
                setNameEncode('');
              }}
              variant="contained"
              color="secondary"
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                handleEncode();
              }}
              variant="contained"
              color="primary"
              disabled={loading || !nameEncode}
            >
              Đồng ý
            </Button>
          </DialogActions>
        </DialogMUI>
      )}
      {/* giải mã */}
      {openDialogDigitalData && (
        <DialogMUI open={openDialogDigitalData} onClose={() => setOpenDialogDigitalData(false)} fullWidth>
          {/* <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}></DialogTitle> */}
          <Grid container>
            <Grid item xs={1}>
              <IconButton disabled={disableBtnBack}>
                <ArrowBack
                  style={{ cursor: 'pointer' }}
                  onClick={e => {
                    // setPathMove(dataPathGoBack[lengthData - 1].parentPath);
                    // let oldPath = dataPathGoBack[lengthData - 1].parentPath.split('/');

                    // oldPath = `/${oldPath
                    //   .filter((i, idx) => {
                    //     return idx > 1;
                    //   })
                    //   .join('/')}/`;
                    // if (oldPath === '//' || (tab === 'users' && oldPath === '/h05ocr//')) {
                    //   handleOpenFolder(false, 'read', '/', false, []);
                    //   setDisableBtnBack(true);
                    // }
                    // // else if (tab === 'users' && oldPath === '/h05ocr//') {
                    // //   handleOpenFolder(false, 'read', '/', false, []);
                    // //   setDisableBtnBack(true)
                    // // }
                    // else {
                    //   handleOpenFolder(false, 'read', oldPath, false, dataPathGoBack[lengthData - 2]);
                    //   dataPathGoBack.pop();
                    // } 
                    console.log(pathGoBack, 'pathGoBack');
                    if (Array.isArray(pathGoBack) && pathGoBack.length > 0) {
                      const newPath = pathGoBack[pathGoBack.length - 1];
                      setParentPath(newPath)
                      pathGoBack.pop()
                      setPathGoBack(pathGoBack)
                      setDisableBtnBack(false)
                    } else {
                      console.log(2222)
                      setParentPath('')
                      setDisableBtnBack(true)
                    }
                  }}
                />
              </IconButton>
            </Grid>
            {console.log(parentPath)}
            <Grid item xs={10} style={{ paddingTop: '15px' }}>
              Kho dữ liệu số
            </Grid>
            <Grid item xs={1}>
              <IconButton>
                <Close
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setOpenDialogDigitalData(false);
                    setPathGoBack([]);
                    // setDataPathGoBack([])
                  }}
                />
              </IconButton>
            </Grid>
          </Grid>
          <Divider style={{ width: '100%', height: '2px' }} />
          {/* {renderListFolder(0, true, listFile[0].parentPath)} */}
          {listFolders && Array.isArray(listFolders) && listFolders.filter(it => it.isFile === false).length ? (
            <>
              <Grid item md={12} sm={12} container spacing={16} style={{ margin: 0, padding: '12px' }}>
                {listFolders.filter(it => {

                  if (!parentPath) {
                    return it.isFile === false && (it.fullPath === `${clientId}/users/${props.userName}/`) || (it.fullPath === `${clientId}/company/`)
                  }
                  else {
                    return it.isFile === false && it.parentPath === parentPath && it.canDelete === true
                  }
                }
                ).map(el => {

                  return (
                    <Grid container id={el._id}>
                      <Grid
                        item
                        md={8}
                        style={{ cursor: 'pointer' }}
                        onMouseDown={() => {
                          return false;
                        }}
                      >
                        <Grid container>
                          <Grid item md={1}>
                            <img src={iconsfolder} style={{ height: 15, userSelect: 'none' }} />
                          </Grid>
                          <Grid item md={11}>
                            <span
                              onClick={e => {
                                // handleChangeDetail(e, el);
                                // if (e.detail === 2) {
                                //   console.log(el, 'elllllllllll');
                                //   let path = el.fullPath.split('/');
                                //   path = `/${path
                                //     .filter((i, idx) => {
                                //       return idx > 1;
                                //     })
                                //     .join('/')}/`;
                                //   handleOpenFolder && handleOpenFolder(false, 'read', path, false, el);
                                //   setDataPathGoBack(dataPathGoBack.concat(el));
                                //   setDisableBtnBack(false);
                                //   setPathMove(el.fullPath);
                                // }
                                setDisableBtnBack(false);

                                setParentPath(el.fullPath)
                                if (el.parentPath === `${clientId}/users/` || el.fullPath === `${clientId}/company/`) {
                                  console.log('el.fullPath', el.fullPath)
                                  setPathGoBack([])
                                }
                                else {
                                  pathGoBack.push(el.parentPath)
                                  setPathGoBack(pathGoBack)
                                  console.log(pathGoBack);
                                }
                              }}
                              onMouseOver={e => {
                                const myEl = document.getElementById(String(el._id));
                                myEl.style.border = styleFolder.border;
                                myEl.style.padding = styleFolder.padding;
                                myEl.style.marginBottom = styleFolder.marginBottom;
                                myEl.style.borderRadius = styleFolder.borderRadius;
                                myEl.style.backgroundColor = styleFolder.backgroundColor;
                              }}
                              onMouseOut={e => {
                                const myEl = document.getElementById(String(el._id));
                                myEl.style = null;
                              }}
                            >
                              <div className="nameFolder">{(el && handleRenderName(el.name)) || ''}</div>
                            </span>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item md={3} style={{ textAlign: 'right' }}>
                        <KeyboardArrowRight
                          style={{ cursor: 'pointer' }}
                          onClick={e => {
                            // let path = el.fullPath.split('/');
                            // path = `/${path
                            //   .filter((i, idx) => {
                            //     return idx > 1;
                            //   })
                            //   .join('/')}/`;
                            // handleOpenFolder && handleOpenFolder(false, 'read', path, false, el);
                            // setDataPathGoBack(dataPathGoBack.concat(el));
                            // setDisableBtnBack(false);
                            // setPathMove(el.fullPath);

                            setDisableBtnBack(false);
                            console.log('el.fullPath', el.fullPath)
                            setParentPath(el.fullPath)
                            if (el.parentPath === `${clientId}/users/` || el.fullPath === `${clientId}/company/`) {
                              setPathGoBack([])
                            }
                            else {
                              pathGoBack.push(el.fullPath)
                              setPathGoBack(pathGoBack)
                              console.log(pathGoBack);
                            }


                          }}
                        />
                      </Grid>
                      <Grid item md={1} />
                    </Grid>
                  );
                })}
              </Grid>
            </>
          ) : (
            <>
              {/*  không có tập tin */}
              <Grid style={{ textAlign: 'center' }}>
                <img src={folderEmpty} style={{ height: 50 }} />;<p style={{ fontSize: 15, fontWeight: 'bold' }}>Thư mục trống</p>
              </Grid>
            </>
          )}

          <DialogActions>
            <Button
              onClick={() => {
                handleDecryption();

              }}
              variant="contained"
              color="primary"
              disabled={disableSave}
            >
              Lưu
            </Button>
          </DialogActions>
        </DialogMUI>
      )}
      {openDialogDecryption && (
        <DialogMUI
          open={openDialogDecryption}
          onClose={() => {
            setOpenDialogDecryption(false);
          }}
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">Giải mã</DialogTitle>
          <DialogContent>
            <input
              type="file"
              id="fileUploadDecryption"
              name="fileUpload"
              onChange={event => {
                setHasFile(event && event.target && event.target.files && event.target.files.length);
              }}
              accept=".pem"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialogDecryption(false);
              }}
              variant="contained"
              color="secondary"
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                setOpenDialogDigitalData(true);
              }}
              variant="contained"
              color="primary"
              disabled={loading || !hasFile}
            >
              Đồng ý
            </Button>
          </DialogActions>
        </DialogMUI>
      )}
      {/* di chuyển */}
      {openDialogMove && (
        <DialogMUI open={openDialogMove} onClose={() => setOpenDialogMove(false)} fullWidth>
          {/* <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}></DialogTitle> */}
          <Grid container>
            <Grid item xs={1}>
              <IconButton disabled={disableBtnBack}>
                <ArrowBack
                  style={{ cursor: 'pointer' }}
                  onClick={e => {
                    setPathMove(dataPathGoBack[lengthData - 1].parentPath);
                    let oldPath = dataPathGoBack[lengthData - 1].parentPath.split('/');
                    oldPath = `/${oldPath
                      .filter((i, idx) => {
                        return idx > 1;
                      })
                      .join('/')}/`;
                    if (oldPath === '//' || (tab === 'users' && oldPath === '/h05ocr//')) {
                      handleOpenFolder(false, 'read', '/', false, []);
                      setDisableBtnBack(true);
                    }
                    // else if (tab === 'users' && oldPath === '/h05ocr//') {
                    //   handleOpenFolder(false, 'read', '/', false, []);
                    //   setDisableBtnBack(true)
                    // }
                    else {
                      handleOpenFolder(false, 'read', oldPath, false, dataPathGoBack[lengthData - 2]);
                      dataPathGoBack.pop();
                    }
                  }}
                />
              </IconButton>
            </Grid>
            <Grid item xs={10} style={{ paddingTop: '15px' }}>
              Life Driver
            </Grid>
            <Grid item xs={1}>
              <IconButton>
                <Close
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setOpenDialogMove(false);
                    setPathGoBack('');
                    // setDataPathGoBack([])
                  }}
                />
              </IconButton>
            </Grid>
          </Grid>
          <Divider style={{ width: '100%', height: '2px' }} />
          {/* {renderListFolder(0, true, listFile[0].parentPath)} */}

          {listFile && Array.isArray(listFile) && listFile.filter(it => it.isFile === false).length ? (
            <>
              <Grid item md={12} sm={12} container spacing={16} style={{ margin: 0, padding: '12px' }}>
                {listFile.filter(it => it.isFile === false).map(el => {
                  return (
                    <Grid container id={el._id}>
                      <Grid
                        item
                        md={8}
                        style={{ cursor: 'pointer' }}
                        onMouseDown={() => {
                          return false;
                        }}
                      >
                        <Grid container>
                          <Grid item md={1}>
                            <img src={iconsfolder} style={{ height: 15, userSelect: 'none' }} />
                          </Grid>
                          <Grid item md={11}>
                            <span
                              onClick={e => {
                                handleChangeDetail(e, el);
                                if (e.detail === 2) {
                                  let path = el.fullPath.split('/');
                                  path = `/${path
                                    .filter((i, idx) => {
                                      return idx > 1;
                                    })
                                    .join('/')}/`;
                                  handleOpenFolder && handleOpenFolder(false, 'read', path, false, el);
                                  setDataPathGoBack(dataPathGoBack.concat(el));
                                  setDisableBtnBack(false);
                                  setPathMove(el.fullPath);
                                }
                              }}
                              onMouseOver={e => {
                                const myEl = document.getElementById(String(el._id));
                                myEl.style.border = styleFolder.border;
                                myEl.style.padding = styleFolder.padding;
                                myEl.style.marginBottom = styleFolder.marginBottom;
                                myEl.style.borderRadius = styleFolder.borderRadius;
                                myEl.style.backgroundColor = styleFolder.backgroundColor;
                              }}
                              onMouseOut={e => {
                                const myEl = document.getElementById(String(el._id));
                                myEl.style = null;
                              }}
                            >
                              <div className="nameFolder">{(el && el.name) || ''}</div>
                            </span>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item md={3} style={{ textAlign: 'right' }}>
                        <KeyboardArrowRight
                          style={{ cursor: 'pointer' }}
                          onClick={e => {
                            let path = el.fullPath.split('/');
                            path = `/${path
                              .filter((i, idx) => {
                                return idx > 1;
                              })
                              .join('/')}/`;
                            handleOpenFolder && handleOpenFolder(false, 'read', path, false, el);
                            setDataPathGoBack(dataPathGoBack.concat(el));
                            setDisableBtnBack(false);
                            setPathMove(el.fullPath);
                          }}
                        />
                      </Grid>
                      <Grid item md={1} />
                    </Grid>
                  );
                })}
              </Grid>
            </>
          ) : (
            <>
              {/*  không có tập tin */}
              <Grid style={{ textAlign: 'center' }}>
                <img src={folderEmpty} style={{ height: 50 }} />;<p style={{ fontSize: 15, fontWeight: 'bold' }}>Thư mục trống</p>
              </Grid>
            </>
          )}

          <DialogActions>
            <Button
              onClick={() => {
                handleMove();
              }}
              variant="contained"
              color="primary"
              disabled={disableBtnMove}
            >
              Chuyển
            </Button>
          </DialogActions>
        </DialogMUI>
      )}
      <ScanDialog
        onSave={onSaveScan}
        setScanDialog={setScanDialog}
        scanDialog={scanDialog}

      />
      {/* xóa list */}
      {openDialogDeleteList && (
        <DialogMUI open={openDialogDeleteList} onClose={() => setOpenDialogDeleteList(false)}>
          <DialogTitle id="alert-dialog-title">Đồng chí có chắc chắn muốn xóa</DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                // handleDeleteItemFolder();
                const data = listFile.filter(it => listIdsDelete.includes(it._id));
                const listName = data.map(it => it.name);
                let path = currentFolder.fullPath.split('/');
                path = `/${path
                  .filter((i, idx) => {
                    return idx > 1;
                  })
                  .join('/')}/`;
                props.handleDeleteItem &&
                  props.handleDeleteItem('delete', path, data, listName, () => {
                    setOpenDialogDeleteList(false);
                    setListIdsDelete([]);
                  });
              }}
              variant="contained"
              color="primary"
            >
              Đồng ý
            </Button>
            <Button
              onClick={() => {
                setOpenDialogDeleteList(false);
              }}
              variant="contained"
              color="secondary"
              autoFocus
            >
              Hủy
            </Button>
          </DialogActions>
        </DialogMUI>
      )}
      {/* ocr */}
      {/* old */}
      {/* {openDialogOCR && (
        <DialogMUI open={openDialogOCR} onClose={() => handleChangeOpenOCR(false)} maxWidth="md" fullWidth>
          <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center', backgroundColor: '#2596CA', color: 'white' }}>
            OCR tài liệu
          </DialogTitle>
          <DialogContent>
            <Grid item md={12} container>
              <ScanFile
                onChangeFile={e => {
                  const files = e.target.files || {};
                  if (!files.length) {
                    setDisablebtnOCR(true);
                  } else {
                    setDisablebtnOCR(false);handleOCR
                  }
                }}
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleChangeOpenOCR(false);
              }}
              variant="contained"
              color="secondary"
              autoFocus
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                props.handleOCR &&
                  props.handleOCR(e => {
                    setDisablebtnOCR(e);
                  });
              }}
              disabled={disablebtnOCR}
              variant="contained"
              color="primary"
            >
              Đồng ý
            </Button>
          </DialogActions>
        </DialogMUI>
      )} */}

      {openDialogOCR && (
        <DialogMUI
          open={openDialogOCR}
          onClose={() => {
            handleChangeOpenOCR(false);
            setIsChosseFile(true);
          }}
          maxWidth={isChosseFile ? 'sm' : 'lg'}
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">Trích xuất OCR</DialogTitle>
          <DialogContent>
            <Grid item md={12} container>
              <ScanFile
                onChangeFile={e => {
                  const newfiles = e.target.files || [];
                  setFiles(newfiles);
                  if (!newfiles.length) {
                    setDisablebtnOCR(true);
                  } else {
                    setDisablebtnOCR(false);
                  }
                }}
                setScanDialog={setScanDialog}
                handelChangeIsChosseFile={setIsChosseFile}
                handlechangeMeta={setMeta}
                isChosseFile={isChosseFile}
                nameFile={files && files[0] && files[0].name}
                type={files && files[0] && files[0].type}
                files={files && files[0]}
                onChangeSnackbar={props.onChangeSnackbar}
                extract={extract}
                setSmartForms={props.setSmartForms}
                smartFormss={props.smartFormss}
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            {!isChosseFile ? (
              <Button
                // onClick={() => {
                //   handleChangeOpenOCR(false);
                //   setIsChosseFile(true)
                // }}
                // variant="contained"
                // color="secondary"
                // autoFocus
                className="btnOptinFileOCR"
              >
                Chọn dữ liệu lưu trữ sau thao tác <Checkbox color="primary" checked={isScan} onChange={() => setIsScan(!isScan)} /> File OCR
              </Button>
            ) : null}

            <Button
              onClick={() => {
                handleChangeOpenOCR(false);
                setIsChosseFile(true);
              }}
              variant="contained"
              color="secondary"
              autoFocus
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (isChosseFile) {
                  setIsChosseFile(false);
                } else {
                  setDisablebtnOCR(true);
                  // ocr trên hệ thống
                  if (isOCRInSt) {
                    handleOcrSyS(() => {
                      setDisablebtnOCR();
                      setIsChosseFile(true);
                    });
                  } else {
                    // ocr mới

                    props.handleOCR &&
                      props.handleOCR(
                        e => {
                          setDisablebtnOCR();
                          setIsChosseFile(true);
                        },
                        isScan,
                        meta,
                        files,
                      );
                  }
                }
              }}
              disabled={disablebtnOCR}
              variant="contained"
              color="primary"
            >
              {isChosseFile ? `Tiếp theo` : 'Lưu'}
            </Button>
          </DialogActions>
        </DialogMUI>
      )}

      {/* trích xuất smart form */}
      {openDialogSmart && (
        <DialogMUI open={openDialogSmart} onClose={() => handleChangeOpenSmart(false)} maxWidth="md" fullWidth>
          <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center', backgroundColor: '#2596CA', color: 'white' }}>
            Trích xuất văn bản
          </DialogTitle>

          <DialogContent>
            <Grid item md={12} container>
              <ScanFileText
                handleChangleMetaDataOthers={handleChangleMetaDataOthers}
                onChangeFile={e => {
                  const files = e.target.files || {};
                  if (!files.length) {
                    setDisablebtnOCR(true);
                  } else {
                    setDisablebtnOCR(false);
                  }
                }}
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleChangeOpenSmart(false);
              }}
              variant="contained"
              color="secondary"
              autoFocus
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                props.handleUploadSmartForm &&
                  props.handleUploadSmartForm(e => {
                    handleChangeOpenSmart(false);
                  });
              }}
              // disabled={disablebtnOCR}
              variant="contained"
              color="primary"
            >
              Đồng ý
            </Button>
          </DialogActions>
        </DialogMUI>
      )}

      {/* Tìm kiếm ảnh */}
      {/* {openDialogSearchImage && (
        <DialogMUI open={openDialogSearchImage} onClose={() => handleChangeOpenImage(false)} maxWidth="md" fullWidth>
          <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center', backgroundColor: '#2596CA', color: 'white' }}>
            Tìm kiếm media
          </DialogTitle>
          <DialogContent>
            <Grid item md={12} container>
              <SearchImage
                handleChangeTypeSearchImage={data => {
                  handleChangeTypeSearchImage({ ...searchImage, ...data });
                }}
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleChangeOpenImage(false);
              }}
              variant="contained"
              color="secondary"
              autoFocus
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                props.handleSearchMedia &&
                  props.handleSearchMedia(e => {
                    handleChangeOpenImage(false);
                  });
              }}
              disabled={loadingCallApi}
              variant="contained"
              color="primary"
            >
              Đồng ý
            </Button>
          </DialogActions>
        </DialogMUI>
      )} */}

      {/* Tìm kiếm ảnh */}
      {openDialogSearchImage && (
        <DialogMUI open={openDialogSearchImage} onClose={() => handleChangeOpenImage(false)} maxWidth="md" fullWidth>
          <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center', backgroundColor: '#2596CA', color: 'white' }}>
            Tìm kiếm media
          </DialogTitle>
          <DialogContent>
            <Grid item md={12} container>
              <SearchImage
                handleChangeTypeSearchImage={data => {
                  handleChangeTypeSearchImage({ ...searchImage, ...data });
                }}
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleChangeOpenImage(false);
              }}
              variant="contained"
              color="secondary"
              autoFocus
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                props.handleSearchMedia &&
                  props.handleSearchMedia(e => {
                    handleChangeOpenImage(false);
                  });
              }}
              disabled={loadingCallApi}
              variant="contained"
              color="primary"
            >
              Đồng ý
            </Button>
          </DialogActions>
        </DialogMUI>
      )}

      {/* tìm kiếm bằng giọng nói */}
      {openDialogVoice && (
        <DialogMUI
          open={openDialogVoice}
          onClose={() => {
            setOpenDialogVoice(false);
            setSearch(null);
          }}
          maxWidth="sm"
          fullWidth
          classes={{
            paper: classes.rootStyle,
          }}
        >
          <DialogContent>
            <Grid item md={12} container>
              <Grid
                item
                md={10}
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', height: '90%', width: '100%' }}
              >
                <input
                  style={{ fontSize: '22px', color: '#AAAAAA', width: '90%', padding: '23px 0px', textOverflow: 'ellipsis', whiteSpace: ' nowrap' }}
                  placeholder="Xin mời nói ..."
                  value={searchInput}
                  disabled={true}
                />
              </Grid>
              <Grid item md={2}>
                {!loadingVoice ? (
                  <IconButton
                    variant="contained"
                    onClick={() => {
                      if (!isRecording) {
                        setDataUpload(null);

                        // bắt đầu ghi âm
                        setIsRecording(true);
                        if (!recorder) {
                          setTimeout(() => {
                            startRecording();
                          }, 100);
                        }
                      } else {
                        // dừng ghi âm
                        stopRecording();
                        setWaitConvert(true);
                      }
                    }}
                    color={isRecording === true ? 'secondary' : 'primary'}
                  >
                    <KeyboardVoice style={{ width: '40px', height: '40px' }} />
                  </IconButton>
                ) : (
                  <CircularProgress style={{ width: '40px', height: '40px', margin: '16px 0px' }} />
                )}

                {/* <CircularProgress /> */}

                {/* <SearchVoice /> */}
              </Grid>
            </Grid>
          </DialogContent>
        </DialogMUI>
      )}

      {/* option search */}
      {openOptionSearch && (
        <Menu
          open={Boolean(openOptionSearch)}
          anchorEl={openOptionSearch}
          // style={{ minHeight: 250 }}
          keepMounted
          onClose={() => {
            setOpenOptionSearch(null);
            // setItemSelect(null);
          }}

        // id="idMenuFilesManager"
        >
          <MenuItem>
            <Checkbox
              checked={optionSearch && optionSearch.normal}
              onChange={e => {
                handleChangeOptionSearch &&
                  handleChangeOptionSearch({
                    ...optionSearch,
                    normal: e.target.checked,
                  });
              }}
            />{' '}
            Tìm kiếm thông thường
          </MenuItem>

          <MenuItem>
            <Checkbox
              checked={optionSearch && optionSearch.nlp}
              onChange={e => {
                handleChangeOptionSearch &&
                  handleChangeOptionSearch({
                    ...optionSearch,
                    nlp: e.target.checked,
                  });
              }}
            />{' '}
            Tìm kiếm ngôn ngữ tự nhiên NLP
          </MenuItem>
        </Menu>
      )}
    </>
  );
}
FilesManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withStyles(styles),
)(FilesManager);
