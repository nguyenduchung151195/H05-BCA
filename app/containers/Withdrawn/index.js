/**
 *
 * Withdrawn
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Close, Info } from '@material-ui/icons';
import { AsyncAutocomplete } from 'components/LifetekUi';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Tooltip, Typography } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm, viewConfigHandleOnChange } from 'utils/common';
import { compose } from 'redux';
import NumberFormat from 'react-number-format';
import CustomDatePicker from '../../components/CustomDatePicker';
import { API_GOING_DOCUMENT_RECOVER, API_INCOMMING_DOCUMENT_RECOVER, UPLOAD_IMG_SINGLE } from '../../config/urlConfig';
import moment from 'moment';
import request from '../../utils/request';
import { fetchData } from '../../helper';
/* eslint-disable react/prefer-stateless-function */
function Withdrawn(props) {
  const { index, onClose, files, code, open, onChangeSnackbar, profile, docIds, onSuccess } = props;

  const [note, setNote] = useState(null);
  const [body, setBody] = useState({
    file: null,
  });
  const [disabled, setDisabled] = useState(false);

  useEffect(
    () => {
      setDisabled(false);
    },
    [open],
  );

  const handleSave = async () => {
    setDisabled(true);
    let url = await fileUpload();
    const bodySave = {
      docIds,
      note,
      url: url && url.url ? url.url : null,
    };
    if (index === 'executiveDocuments') {
      try {
        fetchData(`${API_INCOMMING_DOCUMENT_RECOVER}`, 'POST', bodySave);
        setDisabled(true);
        onChangeSnackbar({ variant: 'success', message: 'Khôi phục thành công', status: true });
        onSuccess && onSuccess();
        setNote(null);
        setBody({ file: null });
        onClose();
      } catch (error) {
        setDisabled(false);
        onChangeSnackbar({ variant: 'success', message: 'Khôi phục thất bại', status: false });
      }
    } else if (index === 'goDocuments') {
      try {
        fetchData(`${API_GOING_DOCUMENT_RECOVER}`, 'POST', bodySave);
        setDisabled(true);
        onChangeSnackbar({ variant: 'success', message: 'Khôi phục thành công', status: true });
        onSuccess && onSuccess();
        setNote(null);
        setBody({ file: null });
        onClose();
      } catch (error) {
        console.log('ERRRR', error);
        setDisabled(false);
        onChangeSnackbar({ variant: 'success', message: 'Khôi phục thất bại', status: false });
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  const onChangeFile = e => {

    setBody({ ...body, file: e.target.files[0] });
  };

  const fileUpload = async () => {
    if (body.file) {
      const formData = new FormData();
      formData.append('file', body.file);

      const file = await fetch(UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const fileData = await file.json();
      return fileData;
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">Khôi phục</DialogTitle>
        <DialogContent style={{ width: 600 }}>
          <Grid container spacing={8}>
            <Grid item sm={12}>
              <CustomInputBase
                autoFocus
                rows={5}
                multiline
                label="Lí do khôi phục"
                value={note}
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
                  {body.file.name}
                  <Close onClick={() => setBody({ ...body, file: null })} />
                </p>
              ) : null}

              <Grid container spacing={16} style={{ marginTop: 10 }}>
                {files &&
                  files.map(item => (
                    <Grid item style={{ padding: 10, margin: '0px 5px', backgroundColor: 'rgb(213 205 205)' }}>
                      {item.name}
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
                <CustomButton
                  color="primary"
                  disabled={disabled}
                  onClick={() => {
                    setDisabled(true);
                    setTimeout(() => {
                      handleSave();
                    }, 1);
                  }}
                >
                  Khôi phục
                </CustomButton>
              </Grid>
              <Grid item>
                <CustomButton color="secondary" onClick={e => handleClose()}>
                  HỦY
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}

Withdrawn.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default compose(memo)(Withdrawn);
