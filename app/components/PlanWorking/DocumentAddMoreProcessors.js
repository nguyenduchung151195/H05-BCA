import React, { useRef, useState, memo } from 'react';
import { API_INCOMMING_DOCUMENT } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForDocument';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { API_COMMENT } from '../../config/urlConfig';

const columnSettings = [
  {
    name: 'support',
    title: 'Phối hợp xử lý',
    _id: '5fb3ad613918a44b3053f080',
    allowSelectDepartment: true,
  },
  {
    name: 'view',
    title: 'Nhận để biết',
    _id: '5fb3ad613918a44b3053f080',
    allowSelectDepartment: true,
  },
];

const DocumentAssignModal = props => {
  const { open, docIds, onChangeSnackbar, template, currentRole, nextRole, onSuccess, role, saveAndSend, doc } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});

  
  const handleSave = _docIds => {
    const url = `${API_INCOMMING_DOCUMENT}/add-more-processor`;

    const body = {
      template,
      docIds: _docIds,
      supporters: result.supportUsers,
      supporterUnits: result.support,
      viewers: result.viewUsers,
      viewerUnits: result.view,
      currentRole,
      nextRole,
      note,
    };
    request(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(async res => {
     
        onChangeSnackbar({ variant: 'success', message: 'Thêm xử lý thành công', status: true });
        if (props.onSuccess) {
          return props.onSuccess();
        }
        props.onClose && props.onClose();
      })
      .catch(error => {
        onChangeSnackbar({ variant: 'success', message: 'Thêm xử lý thất bại', status: false });
      });
  };

  const supportDisableCond = role === 'processors' && result && !result.processing && !result.processingUsers && !result.commandUsers;

  return (
    <DialogUI
      title="Thêm xử lý"
      disableSave={!result || (!result.processing && !result.processingUsers && !result.support && !result.supportUsers && !result.view && !result.viewUsers) || Array.isArray(result.processingUsers) && result.processingUsers.length === 0 || ((!docIds || !docIds.length) && !saveAndSend)}
      onSave={() => {
        if (!docIds.length && saveAndSend) {
          return saveAndSend(id => {
            handleSave([id]);
          });
        }
        return handleSave(docIds);
      }}
      saveText="Thêm"
      onClose={() => props.onClose && props.onClose()}
      open={open}
      style={{ position: 'relative' }}
    >
      <DepartmentSelect
        title=""
        allowedDepartmentIds={allowedOrgs}
        allowedUsers={allowedUsers}
        docIds={docIds}
        onChange={value => {
          // setAllowedOrgs(value);
        }}
        columnSettings={columnSettings.filter(
          c => role === 'receive' || role === 'processors' || role === 'commander' || (role === 'supporters' && c.name !== 'processing' && c.name !== 'command'),
        )}
        onAllowedUsersChange={value => {
          // setAllowedUsers(value);
        }}
        onChangeColumnCheck={result => {
          setResult(result);
        }}
        firstColumnStyle={{
          width: 300,
        }}
        moduleCode="IncommingDocument"
        currentRole={currentRole ? currentRole : template && template.group && template.group[0] ? template.group[0].person : ''}
        template={template}
      />
      <CustomInputBase
        style={{ marginTop: 30 }}
        multiline
        rows={2}
        value={note}
        name="note"
        // showSpeaker
        onChange={e => setNote(e.target.value)}
        label="Nội dung xử lý"
        checkedShowForm
        autoFocus
        // error={!note}
        // helperText={!note ? 'Đồng chí chưa nhập nội dung xử lý' : ''}
      />
    </DialogUI>
  );
};

export default memo(DocumentAssignModal);
