import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import { Tab, Tabs, Grid, Typography, Button, Tooltip, Box, withStyles } from '@material-ui/core';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import DialogView from '../PreviewFile/Dialog';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
// import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import CloseIcon from '@material-ui/icons/Close';
import folder from '../../../assets/img/icon/iconFolder.png';
import iconsImage from '../../../assets/img/icon/iconsImg.png';
import iconsExcel from '../../../assets/img/icon/iconsExcel.png';
import iconsPDF from '../../../assets/img/icon/iconsPDF.png';
import iconsWord from '../../../assets/img/icon/iconsWord.png';
import iconsTxt from '../../../assets/img/icon/iconsTxt.png';
import iconsMp3 from '../../../assets/img/icon/iconsMp3.png';
import iconsMp4 from '../../../assets/img/icon/iconsMp4.png';
import Avatar from '@material-ui/core/Avatar';
import LinkIcon from '@material-ui/icons/Link';
import EditIcon from '@material-ui/icons/Edit';
import './styles.scss';
import { ALLOW_FILE_EXT_UPLOAD, API_CUSTOMERS, API_USERS, UPLOAD_APP_URL, URL_ENCODE_KEY, API_SHARE_FILES } from '../../../config/urlConfig';
import { clientId } from '../../../variable';
import { fetchData } from '../../../helper';

const useStyles = makeStyles({
  tabs: {
    '& button': {
      minWidth: 50,
    },
  },
});

const SmallAvatar = withStyles({
  root: {
    width: '30px',
    height: '30px',
    fontSize: '16px',
  },
})(Avatar);

function DetailFile(props) {
  const classes = useStyles();
  const DOC_TYPES = [
    {
      name: 'cmnd',
      title: 'CMND',
    },
    {
      name: 'cccd',
      title: 'Căn cước công dân',
    },
    {
      name: 'cccc',
      title: 'Căn cước công dân có chíp',
    },
    {
      name: 'abt',
      title: 'Chữ viết tay',
    },
    {
      name: 'dkkd',
      title: 'Đăng ký kinh doanh',
    },
    //  {
    //    name: 'sohong',
    //    title: 'Chứng nhận quyền sử dụng đất',
    //  },
    {
      name: 'hc',
      title: 'Hộ chiếu',
    },
  ];
  const [process, setProcess] = useState(0);
  const [currentCapacity, setCurrentCapacity] = useState(0);
  const [tab, setTab] = useState(0);
  const [openDialogDescription, setDialogDescription] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState('');
  const [showSeparateLine, setShowSeparateLine] = useState(false);
  const [loadingPreFile, setLoadingPreFile] = useState(false);
  const [docFile, setDocFile] = useState();
  const [state, setState] = useState({});

  const [avatarSrc, setAvatarSrc] = useState('');

  useEffect(
    () => {
      console.log('DetailfileProps', props.detailItem);
    },
    [props.detailItem],
  );
  const smartFormsConfig = JSON.parse(localStorage.getItem('smartForms')) || [];
  console.log(smartFormsConfig, 'smartFormsConfig');
  useEffect(
    () => {
      if (!props.maxCapacity) {
        setProcess(0);
      } else {
        const newProcess = (props.currentCapacity / props.maxCapacity) * 100 || 0;
        setProcess(newProcess);
      }
    },
    [props.currentCapacity, props.maxCapacity],
  );
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  const getShortName = (name, maxLength) => {
    if (!name || typeof name != 'string') return '';
    if (name.length > maxLength) return `${name.slice(0, maxLength)} ...`;
    return name;
  };

  const handleEdit = () => {
    const { detailItem = {} } = props;

    console.log(detailItem, 'detailItem');
    setDescription(detailItem.description || '');
    setDialogDescription(true);
  };
  const handleClose = () => {
    setDialogDescription(false);
  };
  const handleUpdateDescription = async () => {
    // fetchData(`${hostUrl}/${tab}?clientId=${clientId}`, 'POST', body, 'token_03')
    const { hostUrl, tab } = props;
    const body = {
      description,
    };
    setLoading(true);
    const { detailItem = {} } = props;
    fetchData(`${hostUrl}/${tab}/sendDescription?fileId=${detailItem._id}`, 'POST', body, 'token_03')
      .then(async res => {
        handleClose();
        if (props.handleReload) {
          await props.handleReload(false, false, true);
        }
        // props.handelOpenDetailC(true)
        props.onChangeSnackbar && props.onChangeSnackbar({ status: true, message: 'Cập nhật mô tả thành công !', variant: 'success' });
        props.handleChangeDetail && props.handleChangeDetail('', res.data);
      })
      .catch(err => {
        props.onChangeSnackbar &&
          props.onChangeSnackbar({ status: true, message: err.message || 'Lấy thông tin chi tiết thất bại!', variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderBackground = data => {
    if (!data.isFile) {
      return <img src={folder} lassName="folder" />;
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
    }
    switch (type) {
      case 'image':
        return <img onClick={() => handleViewFile(props.detailItem)} src={iconsImage} lassName="folder" />;
      case 'excel':
        return <img onClick={() => handleViewFile(props.detailItem)} src={iconsExcel} lassName="folder" />;
      case 'pdf':
        return <img onClick={() => handleViewFile(props.detailItem)} src={iconsPDF} lassName="folder" />;
      case 'word':
        return <img onClick={() => handleViewFile(props.detailItem)} src={iconsWord} lassName="folder" />;
      case 'txt':
        return <img onClick={() => handleViewFile(props.detailItem)} src={iconsTxt} lassName="folder" />;
      case 'mp3':
        return <img onClick={() => handleViewFile(props.detailItem)} src={iconsMp3} lassName="folder" />;
      case 'mp4':
        return <img onClick={() => handleViewFile(props.detailItem)} src={iconsMp4} lassName="folder" />;
      default:
        return <img onClick={() => handleViewFile(props.detailItem)} src={folder} lassName="folder" />;
    }
  };
  // const renderAvatar = (listAva = [], isOwner = false, maxLength = 1, other = false) => {
  //   if (other) {
  //     const listAv = listAva.slice(maxLength).length;
  //     if (listAv)
  //       return (
  //         <Avatar
  //           className='avatar_cat list_avatar'
  //           sizes='small'
  //         >
  //           <span style={{
  //             'fontSize': '14px'
  //           }}>{`+${listAv}`}</span>
  //         </Avatar>
  //       );
  //   }
  //   listAva = listAva
  //     .filter(el => el.isOwner === isOwner)
  //     .slice(0, maxLength)
  //     .map(el => {
  //       return (
  //         <Avatar
  //           alt="Remy Sharp"
  //           src={el.avatar}
  //           className='list_avatar'
  //           sizes='20px'
  //         />
  //       );
  //     });
  //   return listAva;
  // };

  const renderAvatarOwner = (name = null) => {
    return (
      <SmallAvatar alt="Name" className="list_avatar" src={props.detailItem.avatarOwner}>
        {name ? name[0].toUpperCase() : ''}
      </SmallAvatar>
    );
  };
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
    } catch (error) {}
  };
  const handlePdf = async (url, type) => {
    let blob = url && (await fetch(url).then(async data => await data.blob()));
    let typeFile = 'application/pdf';

    var file = new Blob([blob], { type: typeFile });
    var fileURL = URL.createObjectURL(file);
    return fileURL;
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
      props.handleOpenFolder(false, 'read', path, false, currentItem);
      // setDataPathGoBack(dataPathGoBack.concat(currentItem));
      // setDisableBtnBack(false);
      // setOpenDialog(null);
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
      // setOpenDialog(null);
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
  const renderAvatarViewer = (shares = []) => {
    if (shares.length > 0) {
      // setShowSeparateLine(true);

      const renderArr = shares.slice(0, 3).map((item, index) => {
        return (
          <SmallAvatar alt="Remy Sharp" className="list_avatar" src={item && item.avatar && item.avatar}>
            {item && item.username && Array.isArray(item.username) && item.username[0].toUpperCase()}
          </SmallAvatar>
        );
      });

      if (shares.length <= 3) {
        return;
        // return <>{renderArr}</>;
      } else {
        return (
          <>
            {renderArr}
            <SmallAvatar className="avatar_cat list_avatar">
              <span
                style={{
                  fontSize: '14px',
                }}
              >{`+${shares.length - 3}`}</span>
            </SmallAvatar>
          </>
        );
      }
    }
  };
  // const listAvatar = [
  //   { username: 'hbdhvbsdv', isOwner: true, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'f020', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'gfdvdv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'bđvdfv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'ddvdvf', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'ndvsvsv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'udvsvsv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'tfdvsvsv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'kdvsvsv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'dkvsvsv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'xdvsvsv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'cdvsvsv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'ndvsvsv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'dvsvsv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'dvsvsv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  //   { username: 'dvsvsv', isOwner: false, avatar: 'https://trumboss.com/wp-content/uploads/2018/09/4708cd711c24da5ad732ef3f05248b10.jpg' },
  // ];
  const handleGetNameParent = path => {
    const { listFolderDefault = {} } = props;
    const itemCurrent = (listFolderDefault && Array.isArray(listFolderDefault) && listFolderDefault.find(it => it.fullPath === path)) || {};
    return itemCurrent.name || '';
  };

  const handleTypeFile = (type = '') => {
    console.log(type, 'type');
    type = type.toLowerCase();
    const listIMG = ['.jpeg', '.jpg', '.img', '.png', 'gif'];
    const listEXCEL = ['.xls', '.xlsx'];
    const listPDF = ['.pdf', '.pttx'];
    const listDocx = ['.doc', '.docx'];
    const listText = ['.txt'];
    if (listIMG.includes(type)) return 'Ảnh';
    if (listEXCEL.includes(type)) return 'EXCEL';
    if (listDocx.includes(type)) return 'WORD';
    if (listText.includes(type)) return 'TEXT';
    if (listPDF.includes(type)) return 'PDF';
    return type.replace('.', '');
  };

  const fakeMetadata = {
    toBook: 'Luật số: 50/2019/QH14 ',
    abstractNote: 'LUẬT SỬA ĐỒI, BỔ SUNG MỘT SỐ ĐIỀU CỦA LUẬT QUẢN LÝ, SỬ DỤNG VŨ KHÍ, VẬT LIỆU NỔ VÀ CÔNG CỤ HỖ TRỢ ',
    data: 'Sử dụng trái phép sẽ bị xử phạt theo quy định pháp luật',
  };
  const renderActionMonth = (data, dataShares) => {
    if (data && data.parent.length > 0) {
      return data.parent.map(it => {
        return (
          <Grid item container md={12}>
            <>
              {new Date() * 1 - new Date(it.createdAt) * 1 < 2600000000 &&
                new Date() * 1 - new Date(it.createdAt) * 1 > 654800000 && (
                  <>
                    {it.createdAt &&
                      it.action === 'create' && (
                        <>
                          <h6 className="color-text">{moment(it.createdAt).format('DD - MM - YYYY')}</h6>
                          <Grid item md={12} container className="access_list">
                            {renderAvatarOwner(props.detailItem.username)}
                            Bạn{' '}
                            <span style={{ marginLeft: '2px' }} className="color-text">
                              đã tạo và chia sẻ thư mục{' '}
                            </span>
                          </Grid>
                          <Grid
                            item
                            md={12}
                            container
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            {renderBackground(props.detailItem)}
                          </Grid>
                          <Grid item md={12} container className="access_list">
                            {dataShares &&
                              dataShares.length > 0 &&
                              dataShares.map(it => (
                                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  {renderAvatarOwner(it.username)}
                                  <Grid item xs={3} container />
                                  <Grid item style={{ marginLeft: '2px', marginTop: '4px' }} className="color-text">
                                    {it.permission === 'view' ? 'Xem' : it.permission === 'edit' ? 'Chỉnh sửa' : ''}
                                  </Grid>
                                </Grid>
                              ))}
                            {/* {dataShares.length && <Grid item md={12} container style={{,fontWeight : '700',color:'blue'}}>Xem chi tiết</Grid>} */}
                          </Grid>
                        </>
                      )}
                    {it.createdAt &&
                      it.action === 'rename' && (
                        <>
                          <h6 className="color-text">{moment(it.createdAt).format('DD - MM - YYYY')}</h6>
                          <Grid item md={12} container className="access_list">
                            {renderAvatarOwner(props.detailItem.username)}
                            Bạn{' '}
                            <span style={{ marginLeft: '2px' }} className="color-text">
                              đã chỉnh sửa thư mục{' '}
                            </span>
                          </Grid>
                          <Grid
                            item
                            md={12}
                            container
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            {renderBackground(props.detailItem)}
                          </Grid>
                          {dataShares &&
                            dataShares.length > 0 &&
                            dataShares.map(it => (
                              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {renderAvatarOwner(it.username)}
                                <Grid item xs={3} container />
                                <Grid item style={{ marginLeft: '2px', marginTop: '4px' }} className="color-text">
                                  {it.permission === 'view' ? 'Xem' : it.permission === 'edit' ? 'Chỉnh sửa' : ''}
                                </Grid>
                              </Grid>
                            ))}
                        </>
                      )}
                  </>
                )}
            </>
          </Grid>
        );
      });
    } else {
      return <Grid item container md={12} />;
    }
  };
  const renderActionWeek = (data, dataShares) => {
    if (data && data.parent.length > 0) {
      return data.parent.map(it => {
        return (
          <Grid item container md={12}>
            <>
              {new Date() * 1 - new Date(it.createdAt) * 1 <= 654800000 && (
                <>
                  {it.createdAt &&
                    it.action === 'create' && (
                      <>
                        <h6 className="color-text">{moment(it.createdAt).format('DD - MM - YYYY')}</h6>
                        <Grid item md={12} container className="access_list">
                          {renderAvatarOwner(props.detailItem.username)}
                          Bạn{' '}
                          <span style={{ marginLeft: '2px' }} className="color-text">
                            đã tạo và chia sẻ thư mục{' '}
                          </span>
                        </Grid>
                        <Grid
                          item
                          md={12}
                          container
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          {renderBackground(props.detailItem)}
                        </Grid>
                        <Grid item md={12} container className="access_list">
                          {dataShares &&
                            dataShares.length > 0 &&
                            dataShares.map(it => (
                              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {renderAvatarOwner(it.username)}
                                <Grid item xs={3} container />
                                <Grid item style={{ marginLeft: '2px', marginTop: '4px' }} className="color-text">
                                  {it.permission === 'view' ? 'Xem' : it.permission === 'edit' ? 'Chỉnh sửa' : ''}
                                </Grid>
                              </Grid>
                            ))}
                          {/* {dataShares.length && <Grid item md={12} container style={{,fontWeight : '700',color:'blue'}}>Xem chi tiết</Grid>} */}
                        </Grid>
                      </>
                    )}
                  {it.createdAt &&
                    it.action === 'rename' && (
                      <>
                        <h6 className="color-text">{moment(it.createdAt).format('DD - MM - YYYY')}</h6>
                        <Grid item md={12} container className="access_list">
                          {renderAvatarOwner(props.detailItem.username)}
                          Bạn{' '}
                          <span style={{ marginLeft: '2px' }} className="color-text">
                            đã chỉnh sửa thư mục{' '}
                          </span>
                        </Grid>
                        <Grid
                          item
                          md={12}
                          container
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          {renderBackground(props.detailItem)}
                        </Grid>
                        {dataShares &&
                          dataShares.length > 0 &&
                          dataShares.map(it => (
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              {renderAvatarOwner(it.username)}
                              <Grid item xs={3} container />
                              <Grid item style={{ marginLeft: '2px', marginTop: '4px' }} className="color-text">
                                {it.permission === 'view' ? 'Xem' : it.permission === 'edit' ? 'Chỉnh sửa' : ''}
                              </Grid>
                            </Grid>
                          ))}
                      </>
                    )}
                </>
              )}
            </>
          </Grid>
        );
      });
    } else {
      return <Grid item container md={12} />;
    }
  };
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig') || '[]');
// const handleCovertCCCC
  const handleMetadata = (metadataObj, code,type) => {
    console.log(code, 'code');
    console.log(metadataObj, 'metadataObj');
    const moduleCode = smartFormsConfig.find(item => `smart_forms_${item.code}` === code)
      ? smartFormsConfig.find(item => `smart_forms_${item.code}` === code).moduleCode
      : '';
    const scanViewConfig = moduleCode && viewConfig && viewConfig.find(item => item.code === moduleCode);
    console.log(scanViewConfig, 'scanViewConfig');
    const columnsScanFile = scanViewConfig && scanViewConfig.listDisplay.type.fields.type.columns;
    const renderArr = [];
    if(type === '.jpg') {
for (const it in metadataObj) {
  renderArr.push(
    <>
      <Grid item md={6} style={{ fontWeight: 'bold' }}>
        {it}
        {/* {it} */}
      </Grid>
      <Grid item md={6}>
        {metadataObj[it]}
      </Grid>
    </>,
  );
}
    }
    else {
      if (Array.isArray(metadataObj) && metadataObj.length > 0) {
        metadataObj.forEach(item => {
          for (const it in item) {
            renderArr.push(
              <>
                <Grid item md={6} style={{ fontWeight: 'bold' }}>
                  {code
                    ? (columnsScanFile && columnsScanFile.find(itc => itc.name === it) && columnsScanFile.find(itc => itc.name === it).title) || ''
                    : it}
                  {/* {it} */}
                </Grid>
                <Grid item md={6}>
                  {item[it]}
                </Grid>
              </>,
            );
          }
        });
      }
    }
    

    console.log(renderArr, 'renderArr');
    // for (var key in metadataObj) {
    //   if (metadataObj.hasOwnProperty(key)) {
    //     renderArr.push(
    //       <Grid container md={12} style={{ marginBottom: '8px' }}>
    //         <Grid
    //           item
    //           md={6}
    //           style={{
    //             fontStyle: 'italic',
    //             fontWeight: 'bold',
    //             textTransform: 'capitalize',
    //           }}
    //         >
    //           {' '}
    //           <span
    //             style={{
    //               wordWrap: 'break-word',
    //             }}
    //           >
    //             {key}
    //           </span>
    //         </Grid>
    //         <Grid item md={6}>
    //           {' '}
    //           {metadataObj[key]}
    //         </Grid>
    //       </Grid>,
    //     );
    //   }
    // }

    return renderArr;
  };

  const handleMetaDataData = metadataObj => {
    console.log(metadataObj, 'metadataObj');
    let renderArr = [];
    if (Array.isArray(metadataObj) && metadataObj.length > 0) {
      renderArr = metadataObj.map(item => 
            <>
              <Grid item md={6} style={{ fontWeight: 'bold' }}>
                {item ? item.name: ''}
              </Grid>
              <Grid item md={6}>
                {item ? item.value : ''}
              </Grid>
            </>
        
      );
    }
    console.log(renderArr, 'renderArr');
    return renderArr;
  };
  const handleGetFormTrichXuat = (smartForm, smartFormMetaData) => {
    const code = smartForm || smartFormMetaData
    if( code ==='cmnd'||code ==='cccd'|| code ==='cccc'||code ==='abt'||code ==='dkkd' ) {
      return  DOC_TYPES.find(item => item.name === code) ? DOC_TYPES.find(item => item.name === code).title: ""
    }
    if(smartFormMetaData) {
      return smartFormsConfig.length > 0 && smartFormsConfig.find(item => `smart_forms_${item.code}` === code)
      ? smartFormsConfig.find(item => `smart_forms_${item.code}` === code).title
      : ''
    }
   return ''
                  
  }
  return (
    <>
      <Grid
        item
        md={12}
        container
        style={{
          margin: 0,
          padding: 0,
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
        spacing={16}
      >
        <Grid
          item
          md={12}
          container
          style={{
            maxHeight: 100,
            marginTop: 10,
          }}
        >
          <Grid item md={9} className="nameFolder">
            {props.detailItem && props.detailItem.name}
          </Grid>
          <Grid item md={3} className={classes.iconClose} style={{ display: 'flex', justifyContent: 'end' }}>
            <CloseIcon className="closeIcon" onClick={e => props.handleChangeDetail(e)} style={{ cursor: 'pointer' }} />
          </Grid>
        </Grid>
        <Grid
          item
          md={12}
          container
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Tabs value={tab} indicatorColor="primary" textColor="primary" onChange={handleChange} variant="fullWidth" className={classes.tabs}>
            <Tab className="details_title" value={0} label="Chi tiết" />
            <Tab className="details_title" value={1} label="Hành động" />
          </Tabs>
        </Grid>
        {(tab === 0 &&
          Object.keys(props.detailItem).length && (
            <>
              <Grid
                item
                md={12}
                container
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div>{renderBackground(props.detailItem)}</div>
              </Grid>
              <Grid item md={12} container className="access_list">
                Danh sách được truy cập
              </Grid>
              <Grid
                item
                md={12}
                style={{
                  // flexWrap: 'noWrap',
                  // 'overflowX': 'auto'
                  minHeight: 'fitContent',
                  display: 'flex',
                  alignItems: 'center',
                }}
                container
              >
                {/* chủ sở hữu */}
                {renderAvatarOwner(props.detailItem.username)}
                {props.detailItem && props.detailItem.shares && props.detailItem.shares.length > 0 ? <span className="separate-line" /> : null}

                {/* quyền đc xem */}
                {/* {renderAvatar(listAvatar, false, 3)} */}
                {/* Số người còn lại */}
                {/* {renderAvatar(listAvatar, false, 3, true)} */}

                {renderAvatarViewer(props.detailItem.shares)}

                <LinkIcon style={{ color: 'green' }}> </LinkIcon>
              </Grid>
              <Grid
                item
                md={12}
                container
                className="share_management"
                style={{
                  display: 'block',
                }}
              >
                Quản lý chia sẻ
              </Grid>
              <Grid item md={12} container className="from_day">
                Từ 13/02/2022 - đến 20/02/2022
              </Grid>
              {/* detail */}
              <Grid item md={12} container className="view_details">
                <Grid item md={12} container>
                  <span
                    style={{
                      fontWeight: '600',
                      fontSize: '16px',
                      marginBottom: '8px',
                    }}
                  >
                    Thông tin chi tiết
                  </span>
                </Grid>
                <Grid item md={6} style={{ fontWeight: 'bold' }}>
                  {' '}
                  Type
                </Grid>
                <Grid item md={6}>
                  {' '}
                  {props.detailItem.hasOwnProperty('type') ? handleTypeFile(props.detailItem.type) : 'Thư mục'}
                </Grid>
                <Grid item md={6} style={{ fontWeight: 'bold' }}>
                  {' '}
                  Thư mục cha
                </Grid>
                <Grid item md={6}>
                  {' '}
                  {handleGetNameParent(props.detailItem && props.detailItem.parentPath)}
                </Grid>
                <Grid item md={6} style={{ fontWeight: 'bold' }}>
                  {' '}
                  Chủ sở hữu
                </Grid>
                <Grid item md={6}>
                  {' '}
                  {props.detailItem.username}
                </Grid>
                <Grid item md={6} style={{ fontWeight: 'bold' }}>
                  {' '}
                  Chỉnh sửa lần cuối
                </Grid>
                <Grid item md={6}>
                  {' '}
                  {props.detailItem && props.detailItem.dateModified ? moment(props.detailItem.dateModified).format('DD/MM/YYYY') : ''}{' '}
                  {props.detailItem.updatedBy ? `- ${props.detailItem.updatedBy}` : ''}
                </Grid>
                <Grid item md={6} style={{ fontWeight: 'bold' }}>
                  {' '}
                  Mở gần đây nhất
                </Grid>
                <Grid item md={6}>
                  {' '}
                  {props.detailItem && props.detailItem.dateModified ? moment(props.detailItem.dateModified).format('DD/MM/YYYY') : ''}{' '}
                  {props.detailItem.lastOpen ? `- ${props.detailItem.lastOpen}` : ''}
                </Grid>
                <Grid item md={6} style={{ fontWeight: 'bold' }}>
                  {' '}
                  Ngày tạo
                </Grid>
                <Grid item md={6}>
                  {' '}
                  {props.detailItem && props.detailItem.dateCreated ? moment(props.detailItem.dateCreated).format('DD/MM/YYYY') : ''} -{' '}
                  {props.detailItem.username}
                </Grid>

                <Grid item md={6} style={{ fontWeight: 'bold' }}>
                  {' '}
                  Form trích xuất
                </Grid>
               
                {/* handleGetFormTrichXuat */}
                <Grid item md={6}>
                  {' '}


                  {props.detailItem.metaData && props.detailItem.metaData.smartForms && handleGetFormTrichXuat(props.detailItem.smartForm,props.detailItem.metaData.smartForms)}

                  {/* {props.detailItem.metaData && props.detailItem.metaData.smartForms &&
                  DOC_TYPES.find(item => item.name === props.detailItem.metaData.smartForms) ? DOC_TYPES.find(item => item.name === props.detailItem.metaData.smartForms).title:
                  
                (  smartFormsConfig.length > 0 && smartFormsConfig.find(item => `smart_forms_${item.code}` === props.detailItem.metaData.smartForms)
                    ? smartFormsConfig.find(item => `smart_forms_${item.code}` === props.detailItem.metaData.smartForms).title
                    : '')} */}
                  {/* {props.detailItem.smartForm} */}
                </Grid>
                {console.log(props.detailItem,'props.detailItem')}
                {props.detailItem &&
                props.detailItem.type&&
                  props.detailItem.metaData &&
                  props.detailItem.metaData.others &&
                  handleMetadata(props.detailItem.metaData.others, props.detailItem.metaData.smartForms,props.detailItem.type)}

                {props.detailItem &&
                  props.detailItem.metaData &&
                  props.detailItem.metaData.data &&
                  handleMetaDataData(props.detailItem.metaData.data)}

                <Grid item md={6} style={{ fontWeight: 'bold' }}>
                  {' '}
                  Mô tả
                </Grid>
                <Grid
                  item
                  md={5}
                  style={{
                    'word-wrap': 'break-word',
                  }}
                >
                  {' '}
                </Grid>
                <Grid
                  item
                  md={1}
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    color: 'blue',
                    width: 10,
                  }}
                >
                  {' '}
                  <EditIcon onClick={handleEdit} className="edit_icon" />
                </Grid>

                <Grid
                  item
                  md={12}
                  sx={{
                    marginTop: '16px',
                    minHeight: '100px',
                  }}
                >
                  <p
                    style={{
                      minHeight: '100px',
                      // display: 'block'
                    }}
                  >
                    {(props.detailItem && props.detailItem.description) || ''}
                  </p>
                </Grid>
              </Grid>
            </>
          )) ||
          null}
        {(tab === 1 &&
          Object.keys(props.historyItem).length && (
            <>
              <Grid item md={12} container className="access_list">
                <h5>Trong Tuần</h5>
                <span className="bottom-line" />
              </Grid>
              {renderActionWeek(props.historyItem, props.detailItem.shares)}
              <Grid item md={12} container className="access_list">
                <h5>Trong Tháng</h5>
                <span className="bottom-line" />
              </Grid>
              {renderActionMonth(props.historyItem, props.detailItem.shares)}
            </>
          )) ||
          null}
      </Grid>

      <Dialog open={openDialogDescription} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
        <DialogTitle id="form-dialog-title">Mô tả chi tiết</DialogTitle>
        <DialogContent>
          <TextField
            className="input"
            fullWidth
            id="name"
            label="Nhập mô tả"
            variant="outlined"
            value={description}
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => {
              setDescription(e.target.value);
            }}
            // maxRows='string'
            multiline
            rows={7}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Hủy
          </Button>
          <Button onClick={handleUpdateDescription} variant="contained" color="primary" disabled={loading}>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      {state.dialog && (
        <DialogView
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
                    <p>{props.profile.name}</p>
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
                    <p>{props.profile.name}</p>
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
        </DialogView>
      )}

      {/* loading xem file */}
      {loadingPreFile && (
        <Dialog dialogAction={false} open={loadingPreFile}>
          <DialogContent>Đang load dữ liệu, đồng chí vui lòng chờ...</DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default memo(DetailFile);
