import React, { useEffect, useRef, useState } from 'react';
import { API_INCOMMING_DOCUMENT, API_LETTER } from 'config/urlConfig';
import { MenuItem, Grid, Select, Button, Tooltip } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { TextValidator } from 'react-material-ui-form-validator';
import { Scanner } from '@material-ui/icons';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForDocument';
import CloseIcon from '@material-ui/icons/Close';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { API_MEETING } from '../../config/urlConfig';

const columnSettings = [
  {
    name: 'commanders',
    title: 'Xin ý kiến',
    _id: '5fb3ad613918a44b3053f080',
  },
];
const DocumentAssignModal = props => {
  const { open, docIds, onChangeSnackbar, template, currentRole, typePage = '', isAuthory = false, handleComplete, id } = props;
  const [file, setFile] = useState([]);
  const [note, setNote] = useState(null);
  const [resultProcess, setResultProcess] = useState(null);
  const [resultSave, setResultSave] = useState(null);
  const [disableSave, setDisableSave] = useState(false);
  const resultsPro = (JSON.parse(localStorage.getItem('crmSource')) || []).find(item => item.code === 'S42');
  const resultsSav = (JSON.parse(localStorage.getItem('crmSource')) || []).find(item => item.code === 'S43');
  const dataPro = resultsPro && resultsPro.data;
  const dataSav = resultsSav && resultsSav.data;
  const handleChange = e => {
    const files = e.target.files;
    const newFiles = [...file];
    for (let i = 0; i < files.length; i += 1) {
      newFiles.push(files[i]);
    }
    setFile(newFiles);
  };
  const handleDelete = e => {
    const newFiles = file.filter((i, idx) => idx !== e);
    setFile(newFiles);
  };

  useEffect(
    () => {
      setDisableSave(false);
    },
    [open],
  );

  return (
    <DialogUI
      title="Đồng chí có chắc chắn muốn hủy duyệt không ?"
      onSave={() => {
        setDisableSave(true);
        if (props.customSave) {
          props.customSave();
          return;
        }
        let url;
        url = `${API_MEETING}/set-complete`;

        const body = {
          docIds,
          // note,
          processResult: resultProcess,
          saveResult: resultSave,
          stage: 'processing',
        };
        if (handleComplete && id !== 'add') {
          handleComplete();
        }
        request(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
          .then(res => {
            setDisableSave(true);
            onChangeSnackbar({ variant: 'success', message: 'Hủy duyệt thành công', status: true });
            if (props.onSuccess) {
              return props.onSuccess();
            }
            props.onClose && props.onClose();
          })
          .catch(error => {
            setDisableSave(false);
            onChangeSnackbar({ variant: 'success', message: 'Hủy duyệt kiến thất bại', status: false });
          });
      }}
      saveText="Hủy duyệt"
      disableSave={!docIds || !docIds.length || disableSave}
      onClose={() => props.onClose && props.onClose()}
      open={open}
      style={{ position: 'relative' }}
    >
      {/* <DepartmentSelect
        title=""
        allowedDepartmentIds={allowedOrgs}
        allowedUsers={allowedUsers}
        onChange={value => {
        }}
        columnSettings={columnSettings}
        onAllowedUsersChange={value => {
        }}
        onChangeColumnCheck={(result) => {
          console.log('result', result);
          setResult(result);
        }}
        firstColumnStyle={{
          width: 300
        }}

        currentRole={currentRole ? currentRole : (template && template.group && template.group[0]) ? template.group[0].person : ''}
        template={template}
      /> */}
      {/* <CustomInputBase
        multiline
        rows={4}
        value={note}
        name="note"
        onChange={e => setNote(e.target.value)}
        label="Nội dung"
        checkedShowForm
        error={!note}
        helperText={!note ? 'Đồng chí chưa nhập nội dung' : ''}
      /> */}
      {/* {props.isLetter && (
        <>
          <Grid item sm={12}>
            <CustomInputBase
              // validators={['required']}
              // errorMessages={['Trường bắt buộc']}
              onChange={e => setResultProcess(e.target.value)}
              select
              value={resultProcess}
              label="Kết quả xử lý"
              variant="outlined"
              fullWidth
              margin="dense"
            >
              {dataPro.map(item => (
                <MenuItem value={item.value}>
                  {item.title}
                </MenuItem>
              ))}
            </CustomInputBase>
          </Grid>
          <Grid item sm={12}>
            <CustomInputBase
              // validators={['required']}
              // errorMessages={['Trường bắt buộc']}
              onChange={e => setResultSave(e.target.value)}
              select
              value={resultSave}
              label="Kết quả lưu đơn"
              variant="outlined"
              fullWidth
              margin="dense"
            >
              {dataSav.map(item => (
                <MenuItem value={item.value}>
                  {item.title}
                </MenuItem>
              ))}
            </CustomInputBase>
          </Grid>
          <div>
            <label htmlFor="fileUpload1" style={{ display: 'inline-block', marginRight: 10 }}>
              <Button color="primary" variant="outlined" component="span">
                <span style={{ marginRight: 5 }}>
                  <AttachFileIcon />
                </span>
                Tải tài liệu
              </Button>
            </label>
            <label htmlFor="fileScan">
              <Button color="primary" variant="outlined" component="span">
                <span style={{ marginRight: 5 }}>
                  <Scanner />
                </span>
                Quét tài liệu
              </Button>
            </label>
          </div>
          <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {file &&
              file.map((item, index) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: 'calc(25% - 15px)',
                    padding: 5,
                    margin: 3,
                    background: 'rgba(3,3,3,0.04)',
                  }}
                >
                  <div
                    title={item.name}
                    style={{
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </div>
                  <Tooltip title="Xoá">
                    <CloseIcon
                      style={{ width: 14, height: 14, marginLeft: 10 }}
                      onClick={() => {
                        handleDelete(index);
                      }}
                    />
                  </Tooltip>
                </div>
              ))}
          </div>
          <input onChange={handleChange} id="fileUpload1" style={{ display: 'none' }} name="fileUpload1" type="file" multiple />
        </>
      )} */}
    </DialogUI>
  );
};

export default DocumentAssignModal;
