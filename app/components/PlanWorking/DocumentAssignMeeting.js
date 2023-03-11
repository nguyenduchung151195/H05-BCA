import React, { useRef, useState, memo, useEffect } from 'react';
import { API_INCOMMING_DOCUMENT } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForDocument';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { API_COMMENT } from '../../config/urlConfig';

const columnSettings = [
  // {
  //   name: 'command',
  //   title: 'Chỉ đạo',
  //   _id: '5fb3ad613918a44b3053f080',
  //   allowSelectDepartment: false,
  // },
  {
    name: 'processing',
    title: 'Xử lý chính',
    _id: '5fb3ad613918a44b3053f080',
    allowSelectDepartment: true,
  },
  // {
  //   name: 'support',
  //   title: 'Phối hợp xử lý',
  //   _id: '5fb3ad613918a44b3053f080',
  //   allowSelectDepartment: true,
  // },
  // {
  //   name: 'view',
  //   title: 'Nhận để biết',
  //   _id: '5fb3ad613918a44b3053f080',
  //   allowSelectDepartment: true,
  // },
];

const DocumentAssignModal = props => {
  const { open, docIds, onChangeSnackbar, template, currentRole, nextRole, onSuccess, role, saveAndSend, doc, typePage = '', isAuthory =false } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});



  const handleSave = _docIds => {
    const url = isAuthory ? `${API_INCOMMING_DOCUMENT}/set-processor?authority=true`: `${API_INCOMMING_DOCUMENT}/set-processor`;

    const body = {
      template,
      docIds: _docIds,
      processors: result.processingUsers,
      processorUnits: result.processing,
      supporters: result.supportUsers,
      supporterUnits: result.support,
      commander: result.commandUsers,
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

        onChangeSnackbar({ variant: 'success', message: 'Chuyển xử lý thành công', status: true });
        if (props.onSuccess) {
          return props.onSuccess();
        }
        props.onClose && props.onClose();
      })
      .catch(error => {
        onChangeSnackbar({ variant: 'success', message: 'Chuyển xử lý thất bại', status: false });
      });
  };
  useEffect(() => {
    setNote(null)
  }, [open])

  const supportDisableCond = role === 'processors' && result && (!result.processingUsers || !result.commandUsers);
  const supportDisableDeparment = role === 'processors' && result && (!result.processing || !result.command);

  return (
    <DialogUI
      title="Chuyển xử lý"
      disableSave={!result || supportDisableCond || supportDisableDeparment ||
        ((!result.processing || !result.processingUsers) && (!result.command && !result.commandUsers) && !result.support && !result.supportUsers && !result.view && !result.viewUsers) ||
        (result.processingUsers && result.commandUsers && (result.processingUsers.length === 0 && result.commandUsers.length === 0)) &&
        (result.processing && result.command && (result.processing.length === 0 && result.command.length === 0)) ||
        ((!docIds || docIds.length === 0) && !saveAndSend)}
      onSave={() => {
        if (!docIds.length && saveAndSend) {
          return saveAndSend(id => {
            handleSave([id]);
          });
        }
        return handleSave(docIds);
      }}
      saveText="Chuyển"
      onClose={() => props.onClose && props.onClose()}
      open={open}
      style={{ position: 'relative' }}
    >
      <DepartmentSelect
        title=""
        typePage={typePage}
        allowedDepartmentIds={allowedOrgs}
        allowedUsers={allowedUsers}
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
        value={note ? note : ''}
        name="note"
        // showSpeaker
        onChange={e => setNote(e.target.value)}
        label="Nội dung xử lý"
        checkedShowForm
        // error={!note}
        // helperText={!note ? 'Đồng chí chưa nhập nội dung xử lý' : ''}
      />
    </DialogUI>
  );
};

export default memo(DocumentAssignModal);
