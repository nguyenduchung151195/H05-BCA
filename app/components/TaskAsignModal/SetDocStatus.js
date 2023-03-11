import React, { useRef, useState } from 'react';
import { API_LETTER } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';

const DocumentAssignModal = props => {
  const { open, docIds, onChangeSnackbar, template, currentRole, docStatus, saveAndTextTransfer, isAuthory = false } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});


  const handleSave = _docIds => {
    const url = isAuthory ? `${API_LETTER}/set-status?authority=true` : `${API_LETTER}/set-status`;
    const body = {
      docIds: _docIds,
      note
    };
    request(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => {
      onChangeSnackbar({ variant: 'success', message: 'Chuyển văn bản thành công', status: true });
      if (props.onSuccess) {
        return props.onSuccess();
      }
      props.onClose && props.onClose()
    }).catch(error => {
      onChangeSnackbar({ variant: 'success', message: 'Chuyển văn bản thất bại', status: false })
    })
  }

  return (
    <DialogUI title="Lí do chuyển văn bản"
      onSave={() => {
        if (!docIds.length && saveAndTextTransfer) {
          return saveAndTextTransfer(id => {
            handleSave([id]);
          });
        }
        return handleSave(docIds);
      }}
      saveText="Lưu" disableSave={(!docIds || !docIds.length) && !saveAndTextTransfer} onClose={() => props.onClose && props.onClose()} open={open} style={{ position: 'relative' }}>
      <CustomInputBase
        multiline
        rows={4}
        value={note}
        name="note"
        onChange={e => setNote(e.target.value)}
        label="Lí do"
        checkedShowForm
      />
    </DialogUI>
  );
};

export default DocumentAssignModal;
