import React, { useRef, useState } from 'react';
import { API_GOING_DOCUMENT } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForOutDocument';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';

const columnSettings = [
  {
    name: 'commanders',
    title: 'Xin ý kiến',
    _id: '5fb3ad613918a44b3053f080',
  },
]
const DocumentAssignModal = props => {
  const { open, docIds, onChangeSnackbar, template, currentRole, isAuthory = false } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});
  return (
    <DialogUI title="Xin ý kiến" disableSave={!result || !result.commandersUsers || !docIds || !docIds.length} onSave={() => {
      const url = isAuthory ? `${API_GOING_DOCUMENT}/set-commanders?authority=true` : `${API_GOING_DOCUMENT}/set-commanders`;
      const body = {
        docIds,
        commanders: result.commandersUsers,
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
      <DepartmentSelect
        title=""
        allowedDepartmentIds={allowedOrgs}
        allowedUsers={allowedUsers}
        onChange={value => {
          // setAllowedOrgs(value);
        }}
        columnSettings={columnSettings}
        onAllowedUsersChange={value => {
          // setAllowedUsers(value);
        }}
        onChangeColumnCheck={(result) => {
          //console.log('result', result);
          setResult(result);
        }}
        firstColumnStyle={{
          width: 300
        }}

        currentRole={currentRole ? currentRole : (template && template.group && template.group[0]) ? template.group[0].person : ''}
        template={template}
      />
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

export default DocumentAssignModal;
