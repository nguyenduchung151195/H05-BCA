import React, { useRef, useState, useEffect } from 'react';
import { API_GOING_DOCUMENT, UPLOAD_APP_URL, API_INCOMMING_DOCUMENT } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForDocument';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import _ from 'lodash';
import { Checkbox, FormControlLabel } from '@material-ui/core';

const columnSettings = [
  {
    name: 'commanders',
    title: 'Xin ý kiến',
    _id: '5fb3ad613918a44b3053f080',
  },
];
const DocumentAssignModal = props => {
  const {
    open,
    docIds,
    onChangeSnackbar,
    template,
    currentRole,
    files,
    isAuthory = false,
    replace,
    profile,
    saveAndSend,
    inherit,
    onePiece,
    listFiles,
  } = props;
  const [note, setNote] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const [inherits, setInherits] = useState(false);

  const handleSave = docIds => {
    if (onePiece) {
      const url = isAuthory ? `${API_GOING_DOCUMENT}/set-complete-files?authority=true` : `${API_GOING_DOCUMENT}/set-complete-files`;
      const body = {
        docIds,
        note,
        inherit: inherits,
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
          let filterFile = [];
          if (listFiles && listFiles.length) {
            listFiles.forEach(item => {
              if (item.name.includes('.doc')) {
                filterFile.push(item);
              }
            });
          }
          if (filterFile && filterFile.length > 0) {
            const bodyConvertFile = {
              fileIds: _.uniq(filterFile.map(i => i.id || i._id)),
              replace,
            };
            request(`${UPLOAD_APP_URL}/files/convert-docx-to-pdf`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(bodyConvertFile),
            })
              .then(res => {
                // console.log('res convert file', res);
              })
              .catch(error => {
                // console.log('error convert file', error);
                setDisableButton(false);
              });
          }
          onChangeSnackbar({ variant: 'success', message: 'Hoàn thành văn bản báo cáo thành công', status: true });
          if (props.onSuccess) {
            return props.onSuccess();
          }
          props.onClose && props.onClose();
        })
        .catch(error => {
          onChangeSnackbar({ variant: 'success', message: 'Hoàn thành văn bản báo cáo thất bại', status: false });
          setDisableButton(false);
        });
    } else {
      const url = isAuthory ? `${API_GOING_DOCUMENT}/set-complete?authority=true` : `${API_GOING_DOCUMENT}/set-complete`;
      const body = {
        docIds,
        note,
        inherit: inherits,
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
          let filterFile = [];
          if (files && files.length) {
            files.forEach(item => {
              if (item.name.includes('.doc')) {
                filterFile.push(item);
              }
            });
          }
          if (filterFile && filterFile.length > 0) {
            const bodyConvertFile = {
              fileIds: _.uniq(filterFile.map(i => i.id || i._id)),
              replace,
            };
            request(`${UPLOAD_APP_URL}/files/convert-docx-to-pdf`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(bodyConvertFile),
            })
              .then(res => {
                // console.log('res convert file', res);
              })
              .catch(error => {
                // console.log('error convert file', error);
                setDisableButton(false);
              });
          }
          onChangeSnackbar({ variant: 'success', message: 'Hoàn thành xử lý thành công', status: true });
          if (props.onSuccess) {
            return props.onSuccess();
          }
          props.onClose && props.onClose();
        })
        .catch(error => {
          onChangeSnackbar({ variant: 'success', message: 'Hoàn thành xử lý kiến thất bại', status: false });
          setDisableButton(false);
        });
    }
  };
  useEffect(
    () => {
      setDisableButton(false)
    },
    [open],
  );
  return (
    <DialogUI
      title={onePiece ? 'Hoàn thành văn bản báo cáo' : 'Hoàn thành xử lý'}
      disableSave={!note || disableButton}
      onSave={() => {
        setDisableButton(true);
        if (!docIds.length && saveAndSend) {
          return saveAndSend(id => {
            handleSave([id]);
          });
        }
        return handleSave(docIds);
      }}
      saveText="Hoàn thành"
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

      <CustomInputBase
        multiline
        rows={4}
        value={note}
        name="note"
        onChange={e => setNote(e.target.value)}
        label="Nội dung"
        checkedShowForm
      // error={!note}
      // helperText={!note ? 'Đồng chí chưa nhập nội dung' : ''}
      />
      {!onePiece && profile &&
        profile.inherit === true && (
          <FormControlLabel
            control={<Checkbox checked={inherit ? inherit : inherits} onClick={() => setInherits(!inherits)} name="isSetToManager" />}
            label="Thừa lệnh/Thừa uỷ quyền"
          />
        )}
    </DialogUI>
  );
};

export default DocumentAssignModal;
