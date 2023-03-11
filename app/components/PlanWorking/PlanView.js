import React, { useRef, useState } from 'react';
import { API_PLAN_WORKING } from '../../config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import CustomInputBase from '../../components/Input/CustomInputBase';
import request from '../../utils/request';
import FeedBackDocument from '../DepartmentSelect/FeedBackDocument';

const columnSettings = [
  {
    name: 'commanders',
    title: 'Xin ý kiến',
    _id: '5fb3ad613918a44b3053f080',
  },
]
const PlanView = props => {
  const { open, docIds, onChangeSnackbar, template, currentRole, isAuthory = false } = props;
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});

  return (
    <DialogUI title="Xin ý kiến" maxWidth={"sm"} disableSave={!note && !docIds.length} onSave={() => {
      const url =  `${API_PLAN_WORKING}/command`;
      const body = {
        docIds,
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
        onChangeSnackbar({ variant: 'success', message: 'Xin ý kiến thành công', status: true });
        if (props.onSuccess) {
          return props.onSuccess();
        }
        props.onClose && props.onClose()
      }).catch(error => {
        onChangeSnackbar({ variant: 'success', message: 'Xin ý kiến thất bại', status: false })
      })
    }} saveText="Gửi" onClose={() => props.onClose && props.onClose()} open={open} style={{ position: 'relative' }}>
     
      <CustomInputBase
        multiline
        rows={2}
        value={note}
        name="note"
        // showSpeaker
        onChange={e => setNote(e.target.value)}
        label="Nội dung xin ý kiến"
        checkedShowForm
      />
    </DialogUI>
  );
};

export default PlanView;
