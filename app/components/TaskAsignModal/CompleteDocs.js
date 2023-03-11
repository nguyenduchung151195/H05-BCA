import React, { useRef, useState } from 'react';
import { API_GOING_DOCUMENT } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForDocument';
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
    <DialogUI title="Hoàn thành xử lý" disableSave={!note || !docIds || !docIds.length}  onSave={() => {
      const url = isAuthory ? `${API_INCOMMING_DOCUMENT}/set-complete?authority=true` : `${API_INCOMMING_DOCUMENT}/set-complete`;
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
        onChangeSnackbar({ variant: 'success', message: 'Hoàn thành xử lý thành công', status: true });
        if (props.onSuccess) {
          return props.onSuccess();
        }
        props.onClose && props.onClose()
      }).catch(error => {
        onChangeSnackbar({ variant: 'success', message: 'Hoàn thành xử lý kiến thất bại', status: false })
      })
    }} saveText="Hoàn thành" onClose={() => props.onClose && props.onClose()} open={open} style={{ position: 'relative' }}>
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
      />
    </DialogUI>
  );
};

export default DocumentAssignModal;
