/**
 *
 * Recall
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Close } from '@material-ui/icons';
import { Button, Dialog as Dialogg, DialogActions, DialogContent, DialogTitle, Grid, Tooltip } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
import Dialog from './Dialog';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import { compose } from 'redux';
import { API_GOING_DOCUMENT_RECALL, API_INCOMMING_DOCUMENT_RECALL, UPLOAD_IMG_SINGLE, UPLOAD_APP_URL } from '../../config/urlConfig';
import { fetchData } from '../../helper';
import * as docx from 'docx-preview';
import { clientId } from '../../variable';
import XLSX from 'xlsx';

/* eslint-disable react/prefer-stateless-function */
function Recall(props) {
  const { index, onClose, code, open, files, onChangeSnackbar, profile, docIds, onSuccess, codeDocs } = props;
  const FILES = ['xlsx', 'xls', 'docx', 'pdf', 'doc'];
  let show = document.getElementById('show');
  const [note, setNote] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [selectUrl, setSelectedUrl] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [docFile, setDocFile] = useState();
  const [fileName, setFileName] = useState();


  const [state, setState] = useState(
    {
      dialog: false,
      type: "",
      url: "",
      img: "",
    }
  )
  const [body, setBody] = useState({
    file: null,
  });
  const [view, setView] = useState(false);

  useEffect(
    () => {
      setDisabled(false);
    },
    [open],
  );
  const docxOptions = Object.assign(docx.defaultOptions, {
    debug: true,
    experimental: true,
  });
  const handleSave = async () => {
    setDisabled(true);
    let url = await fileUpload();
    console.log(fileName, 'fileName')
    let bodySave = {
      docIds,
      note: note,
      code: codeDocs,
      // url: url && url.url ? url.url : null,
      // name: url && url.url ? fileName : ""


    };
    if (url) {
      bodySave = {
        ...bodySave,
        image: [url]
      }
    }
    if (index === 'executiveDocuments') {
      try {
        fetchData(`${API_INCOMMING_DOCUMENT_RECALL}`, 'POST', bodySave);
        setDisabled(true);
        onChangeSnackbar({ variant: 'success', message: 'Thu hồi thành công', status: true });
        onSuccess && onSuccess();
        setBody({ file: null });
        setNote(null);
        onClose();
      } catch (error) {
        //console.log('ERRRR', error);
        setDisabled(false);
        onChangeSnackbar({ variant: 'success', message: 'Thu hồi thất bại', status: false });
      }
    } else if (index === 'goDocuments') {
      try {
        fetchData(`${API_GOING_DOCUMENT_RECALL}`, 'POST', bodySave);
        setDisabled(true);
        onChangeSnackbar({ variant: 'success', message: 'Thu hồi thành công', status: true });
        onSuccess && onSuccess();
        setBody({ file: null });
        setNote(null);
        onClose();
      } catch (error) {
        //console.log('ERRRR', error);
        setDisabled(false);
        onChangeSnackbar({ variant: 'success', message: 'Thu hồi thất bại', status: false });
      }
    }
  };

  const handleClose = () => {
    onClose();
    setBody({ ...body, file: null });
  };

  const onChangeFile = e => {
    setBody({ ...body, file: e.target.files[0] });
  };
  const setValue = (value) => {
    setFileName(value || "")
    return true
  }
  const fileUpload = async () => {
    const formData = new FormData();
    if (body.file) {
      formData.append('file', body.file);

      const file = await fetch(UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const fileData = await file.json();
      console.log(fileData, 'fileData')
      return {
        url: fileData.url,
        name: body.file.name
      };
    }
  };
  const getExtensionFile = name => {
    let ext = name.split('.');
    return ext[ext.length - 1];
  };
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
  const loadDocx = useCallback(
    (file, container) => {
      if (!file) return;
      docx.renderAsync(file, container, null, docxOptions).then(function (x) { });
    },
    [docxOptions, view],
  );
  useEffect(
    () => {
      let container = document.getElementById('docx-container');
      if (filePreview) {
        fetch(filePreview).then(async res => {
          if (res) {
            let blob = await res.blob();
            let file = blob && new File([blob], 'new_file');
            if (file) {
              console.log(file, "file")
              loadDocx(file, container);
            }
          }
        });
      }
    },
    [view],
  );
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
    return fileURL
  };


  const handlePdfNoId = async (url, type) => {
    let blob = url && (await fetch(url).then(async data => await data.blob()));
    let typeFile = 'application/pdf';
    var file = new Blob([blob], { type: typeFile });
    var fileURL = URL.createObjectURL(file);
    return fileURL;
  };



  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewHtml(null);
    setFilePreview(null);
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
  const displayFileExcell = async f => {
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

  const handleClosePreviewLocal = () => {
    setState({ ...state, dialog: false, type: '' });
    setPreviewHtml();
  };
  async function convertFileToUrl(file) {
    // let reader = new FileReader();
    // let url;
    // reader.addEventListener('load', function () {
    //   url = reader.result
    // })
    if (file && file.id) {
      return file.id;
    } else {
      return URL.createObjectURL(file);
    }
  }
  async function convertFileToUrlNoId(file) {
    // let reader = new FileReader();
    // let url;
    // reader.addEventListener('load', function () {
    //   url = reader.result
    // })
    return URL.createObjectURL(file);
  }
  return (
    <>
      <Dialogg open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">Thu hồi</DialogTitle>
        <DialogContent style={{ width: 600 }}>
          <Grid container spacing={8}>
            <Grid item sm={12}>
              <CustomInputBase
                autoFocus
                rows={5}
                multiline
                label="Lí do thu hồi"
                value={note ? note : ''}
                name="note"
                onChange={e => setNote(e.target.value)}
              />
            </Grid>
            <div>
              <input onChange={onChangeFile} style={{ display: 'none' }} id="upload-file-task" type="file" />
              <label htmlFor="upload-file-task">
                <Button color="primary" variant="contained" component="span">
                  Tệp đính kèm
                </Button>
              </label>
              {body.file ? (
                <p>
                  <div
                    onClick={async () => {
                      let url = body.file && (await convertFileToUrl(body.file));

                      let img;
                      let type;
                      let extension = (body.file && body.file.name.split('.')) || [];
                      extension = extension[extension.length - 1];

                      if (['jpg', 'png', 'PNG', 'jpeg'].includes(extension)) {
                        img = true;
                      } else {
                        img = false;
                        if (extension === 'pdf') {
                          url = await handlePdfNoId(url, extension);
                          type = 'pdf';
                        }
                        else if (extension === 'xlsx') {
                          await displayFileExcell(url);
                          type = 'xlsx';
                        }
                        else if (extension === 'xls') {
                          await displayFileExcell(url);
                          type = 'xls';
                        }
                        else if (extension === 'docx' || extension === 'doc') {
                          setDocFile(body.file);
                          type = extension;
                        }
                        else {
                          return onChangeSnackbar({ variant: 'error', message: 'Loại file không hỗ trợ xem online!', status: true });
                        }
                      }
                      setState({
                        ...state,
                        dialog: true,
                        type,
                        url,
                        img,
                      });
                    }}
                  >
                    {body.file.name} </div>
                  <Close onClick={() => setBody({ ...body, file: null })} />
                </p>
              ) : null}
              <Grid container spacing={16} style={{ marginTop: 10 }}>
                {files &&
                  files.map(item => (
                    <Grid item style={{ padding: 10, margin: '0px 5px', backgroundColor: 'rgb(213 205 205)' }}>
                      {/* {item.name} */}
                      <div style={{ cursor: 'pointer' }}
                        onClick={async e => {

                          let extension = item.name && getExtensionFile(item.name);
                          if (extension === 'pdf') {
                            fetch(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${item.id}`).then(async res => {
                              if (res) {
                                let blob = await res.blob();
                                let file = blob && new File([blob], 'new_file');
                                if (file) {
                                  let url = file && (await convertFileToUrl(file));
                                  url = await handlePdfNoId(url, extension);
                                  let img
                                  setState({
                                    ...state,
                                    dialog: true,
                                    type: extension,
                                    url,
                                    img,
                                  });
                                  return
                                }
                                else {
                                  return onChangeSnackbar({ variant: 'error', message: 'Đọc file thất bại', status: true });
                                }
                              }
                            })
                            return
                          }
                          e.stopPropagation();
                          setOpenPreview(true);
                          if (extension && FILES.indexOf(extension) === -1) {
                            setSelectedUrl(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${item.id}`);
                          }
                          if (FILES.indexOf(extension) !== -1) {
                            setSelectedUrl(extension);
                            setFilePreview(`${UPLOAD_APP_URL}/file-system/GetImage/${clientId}?id=${item.id}`);
                          }
                        }}
                      >
                        {item.name}{' '}
                      </div>
                    </Grid>
                  ))}
              </Grid>
            </div>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12}>
            <Grid container spacing={8} justify="flex-end">
              <Grid item>
                <Button
                  color={disabled === true ? "inherit" : "primary"}
                  variant="contained"
                  onClick={() => {
                    setDisabled(true);
                    setTimeout(() => {
                      handleSave();
                    }, 1);
                  }}
                  disabled={disabled}
                >
                  Thu hồi
                </Button>
              </Grid>
              <Grid item>
                <CustomButton color="secondary" onClick={e => handleClose()}>
                  HỦY
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialogg>






      {/* preview file có id*/}

      <Dialogg dialogAction={false} onClose={() => handleClosePreview()} maxWidth="lg" open={openPreview}>
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
            <>
              <div style={{ height: '80vh' }}>
                <iframe width="100%" height="100%" id="docx" src={previewHtml} />
              </div>
            </>


          )}
      </Dialogg>

      {/* preview file vừa upload */}
      <Dialog maxWidth={false} docFile={docFile} typeFile={state.type} fullScreen open={state.dialog} onClose={handleClosePreviewLocal}>
        <div style={{ height: '800px', textAlign: 'center' }}>
          {state.img === true ? (
            <img alt="HHH" src={state.url} style={{ maxHeight: 800 }} />
          ) : (
            <>
              {state.type === 'pdf' && <iframe title="PDF" src={`${state.url}`} width="100%" height="100%" value="file" />}
              {(state.type === 'xlsx' || state.type === 'xls') && <div id="show" />}
            </>
          )}
        </div>
      </Dialog>
    </>
  );
}

Recall.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default compose(memo)(Recall);
