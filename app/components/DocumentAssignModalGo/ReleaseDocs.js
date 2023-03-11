import React, { useEffect, useRef, useState } from 'react';
import { API_GOING_DOCUMENT, API_GET_GEN_CODE } from 'config/urlConfig';
import { Dialog as DialogUI } from 'components/LifetekUi';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import CustomDatePicker from 'components/CustomDatePicker';
import CustomInputField from 'components/Input/CustomInputField';
import { Grid, Fab, Button, Menu, MenuItem, Badge, Typography, Tooltip, Checkbox, Dialog } from '@material-ui/core';
import { Paper as PaperUI, FileUpload } from 'components/LifetekUi';

import moment from 'moment';
import axios from 'axios';
import { API_CHECK_EXIST_OUT_GOING, API_FILE_SYSTERM_TRANSFER, API_CHECK_EXIST_TO_BOOK } from '../../config/urlConfig';
import { insertTextToPdf } from '../../utils/api/outgoingdocument';

const DocumentAssignModal = props => {
  const { open, docIds, onChangeSnackbar, template, currentRole, profile, onePiece } = props;
  const [note, setNote] = useState(null);
  const [releaseNo, setReleaseNo] = useState(null);
  const [toBook, setToBook] = useState(null);
  const [textSymbols, setTextSymbols] = useState(props.textSymbols || null);

  const [releaseDate, setReleaseDate] = useState(
    moment()
      .startOf('day')
      .toDate(),
  );


  const [typeDocument, setTypeDocument] = useState('');
  const [errorText, setErrorText] = useState(null);
  const [errorToBook, setErrorToBook] = useState(null);
  const [disableButton, setDisableButton] = useState(false);

  const vbbc = useRef({});
  const vbdt = useRef({});
  const textToPdfSetting = useRef({});

  const handleChangeType = name => e => {
    if (name === 'typeDocument') {
      if (e.target.value) {
        setTypeDocument(e.target.value);
        setReleaseNo(e.target.value.enTitle);
      }
    } else {
      setReleaseNo(e.target.value);
    }
  };
  useEffect(
    () => {
      if (typeDocument) {
        let code = typeDocument.enTitle + '/' + typeDocument.count;
        setReleaseNo(code);
      }
    },
    [typeDocument],
  );
  useEffect(
    () => {
      let newData = releaseNo && releaseNo.split('/')[parseInt(releaseNo.split('/').length) - 1];
      setToBook(newData);
    },
    [releaseNo],
  );
  useEffect(
    () => {
      setNote(null);
      setErrorText(null);
      setErrorToBook(null);
    },
    [open],
  );

  async function sendFileReleaseDocument(inDocId, outDocId) {
    await fetch(`${API_FILE_SYSTERM_TRANSFER}?outGoingDocumentID=${outDocId}&incommingDocumentID=${inDocId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
  }
  async function sendFileReleaseDocumentClone(fileTrans) {
    await fetch(`${API_FILE_SYSTERM_TRANSFER}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileTrans }),
    });
  }

  async function handleSave() {
    if (onePiece) {
      const url = `${API_GOING_DOCUMENT}/set-release-files`;
      const bookDocumentNumber = releaseNo.split('/');
      const body = {
        docIds,
        note,
        releaseNo,
        releaseDate,
        bookDocumentId: typeDocument ? typeDocument._id : '',
        senderUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
        typeDocument,
        bookDocumentNumber: bookDocumentNumber[3],
        toBook, textSymbols

      };
      axios
        .post(
          API_CHECK_EXIST_OUT_GOING,
          { releaseNo: releaseNo },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          if (response.data.status === 1) {
            axios
              .post(
                API_CHECK_EXIST_TO_BOOK,
                { toBook: toBook },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                  },
                },
              )
              .then(respon => {
                if (respon.data.status === 1) {
                  setErrorText(null);
                  let result = axios
                    .post(url, body, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                      },
                    })
                    .then(res => {
                      if (res.data.incommingDocumentID !== res.data.outGoingDocumentID) {
                        sendFileReleaseDocument(res.data.incommingDocumentID, res.data.outGoingDocumentID);
                      }
                      onChangeSnackbar({ variant: 'success', message: 'Ban hành thành công', status: true });
                      // console.log('updatePdf123');
                      updatePdf();

                      if (props.onSuccess) {
                        return props.onSuccess();
                      }
                      props.onClose && props.onClose();
                    })
                    .catch(error => {
                      setDisableButton(false);
                      return error.response;
                    });
                  if (result.status == 400) {
                    let { data } = result;
                    onChangeSnackbar({ variant: 'error', message: data.message, status: true });
                    setDisableButton(false);
                  }
                } else {
                  setErrorToBook(respon.data.message);
                  setDisableButton(false);
                }
              })
              .catch(() => {
                setDisableButton(false);
              });
          } else {
            setErrorText(response.data.message);
            setDisableButton(false);
          }
        })
        .catch(() => {
          setDisableButton(false);
        });
    } else {
      const url = `${API_GOING_DOCUMENT}/set-release`;
      const bookDocumentNumber = releaseNo.split('/');
      const body = {
        docIds,
        note,
        releaseNo,
        releaseDate,
        bookDocumentId: typeDocument ? typeDocument._id : '',
        senderUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
        typeDocument,
        bookDocumentNumber: bookDocumentNumber[3],
        toBook,
        textSymbols
      };
      axios
        .post(
          API_CHECK_EXIST_OUT_GOING,
          { releaseNo: releaseNo },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          if (response.data.status === 1) {
            axios
              .post(
                API_CHECK_EXIST_TO_BOOK,
                { toBook: toBook },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                  },
                },
              )
              .then(respon => {
                if (respon.data.status === 1) {
                  setErrorText(null);
                  let result = axios
                    .post(url, body, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                      },
                    })
                    .then(res => {
                      if (res.data && res.data.fileTrans && res.data.fileTrans.length > 0) sendFileReleaseDocumentClone(res.data.fileTrans);
                      onChangeSnackbar({ variant: 'success', message: 'Ban hành thành công', status: true });
                      // console.log('updatePdf');
                      updatePdf();
                      if (props.onSuccess) {
                        return props.onSuccess();
                      }
                      props.onClose && props.onClose();
                    })
                    .catch(error => {
                      setDisableButton(false);
                      return error.response;
                    });
                  if (result.status == 400) {
                    let { data } = result;
                    onChangeSnackbar({ variant: 'error', message: data.message, status: true });
                    setDisableButton(false);
                  }
                } else {
                  setErrorToBook(respon.data.message);
                  setDisableButton(false);
                }
              })
              .catch(() => {
                setDisableButton(false);
              });
          } else {
            setErrorText(response.data.message);
            setDisableButton(false);
          }
        })
        .catch(() => {
          setDisableButton(false);
        });
    }
  }
  useEffect(
    () => {
      setDisableButton(false);
    },
    [open],
  );

  const updatePdf = () => {
    const idDoc = [...Object.keys(vbbc.current), ...Object.keys(vbdt.current)];
    idDoc.map(id => {
      insertTextToPdf({
        id,
        content: toBook,
        ...textToPdfSetting.current[id]
      });
    });
  };

  const onUpdateSetting = (id, data) => {
    textToPdfSetting.current[id] = data
  }

  return (
    <DialogUI
      title="Ban hành văn bản"
      disableSave={!docIds || !docIds.length || disableButton || !toBook}
      maxWidth={'sm'}
      onSave={() => {
        setDisableButton(true);
        handleSave();
      }}
      saveText="Ban hành"
      onClose={() => props.onClose && props.onClose()}
      open={open}
      style={{ position: 'relative' }}
    >
      <CustomInputField
        // className={checkRequired && checkRequired.name && checkRequired.name === true ? "CustomRequiredLetter" : 'CustomIconRequired'}
        label={'Sổ văn bản đi'}
        configType="crmSource"
        configCode="S40"
        profile={profile}
        type="Source|CrmSource,S40|Value||value"
        typeDocument="OutGoingDocument"
        name="typeDocument"
        value={typeDocument}
        isBookDocument={true}
        onChange={handleChangeType('typeDocument')}
      />

      <CustomInputBase
        label={'Số văn bản đi'}
        value={releaseNo}
        name="releaseNo"
        onChange={handleChangeType('releaseNo')}
        helperText={errorText}
        error={errorText !== null}
      />
      <Grid item md={12} container spacing={8}>
        <Grid item md={4} >
          <CustomInputBase label={'Số văn bản'} name="toBook" value={toBook} onChange={e => setToBook(e.target.value)} required />

        </Grid>
        <Grid item md={8} >
          <CustomInputBase
            label={'Ký hiệu văn bản'}
            value={textSymbols}
            name="textSymbols"
            onChange={(e) => {
              setTextSymbols(e.target.value || "")
            }}
          />
        </Grid>
      </Grid>
      {/* <CustomInputBase label={'Số văn bản'} name="toBook" value={toBook} onChange={e => setToBook(e.target.value)} required />
      <CustomInputBase
        label={'Ký hiệu văn bản'}
        value={textSymbols}
        name="textSymbols"
        onChange={(e) => {
          setTextSymbols(e.target.value || "")
        }}
      /> */}
      {/* disablePast */}
      <CustomDatePicker label="Ngày ban hành" value={releaseDate} name="releaseDate" onChange={e => setReleaseDate(e)} checkedShowForm />
      {/* <CustomInputBase
        multiline
        rows={4}
        value={note}
        name="note"
        onChange={e => setNote(e.target.value)}
        label="Nội dung"
      // checkedShowForm
      // error={!note}
      // helperText={!note ? 'Đồng chí chưa nhập nội dung' : ''}
      /> */}

      <span
        style={{
          textTransform: 'uppercase',
          marginRight: 10,
          fontSize: 16,
          fontWeight: 'bold',
          color: 'black',
          display: 'inline-block',
        }}
      >
        Tự động nhập số văn bản
      </span>

      <Grid item xs="12" style={{ marginTop: 20 }}>
        <PaperUI>
          <Grid item container>
            <span
              style={{
                textTransform: 'uppercase',
                marginRight: 10,
                fontSize: 14,
                // fontWeight: 'bold',
                color: 'black',
                display: 'inline-block',
              }}
            >
              Văn bản báo cáo
            </span>
          </Grid>
          <FileUpload
            profile={profile}
            id={docIds}
            isDetail={true}
            name="totrinh"
            draft="vanbantotrinh"
            code={`OutGoingDocument-fileLists`}
            // previewToBook
            checkbox={selected => (vbbc.current = selected)}
            docOnly
            onUpdateSetting={onUpdateSetting}
            svbText={toBook}
          />
        </PaperUI>
      </Grid>

      <Grid item xs="12" style={{ marginTop: 20 }}>
        <PaperUI>
          <span
            style={{
              textTransform: 'uppercase',
              marginRight: 10,
              fontSize: 14,
              // fontWeight: 'bold',
              color: 'black',
              display: 'inline-block',
            }}
          >
            Văn bản dự thảo
          </span>
          <FileUpload
            profile={profile}
            id={docIds}
            isDetail={true}
            name="duthao"
            draft="vanbanduthao"
            code={`OutGoingDocument-fileDocs`}
            // previewToBook
            checkbox={selected => (vbdt.current = selected)}
            docOnly
            onUpdateSetting={onUpdateSetting}
            svbText={toBook}
          />
        </PaperUI>
      </Grid>
    </DialogUI>
  );
};

export default DocumentAssignModal;
