import React, { useRef, useState, memo, useEffect } from 'react';
import { API_INCOMMING_DOCUMENT } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForCalendar';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { API_COMMENT, API_MEETING } from '../../config/urlConfig';

const columnSettings = [
  {
    name: 'processing',
    title: '',
    _id: '5fb3ad613918a44b3053f080',
  },
  // {
  //   name: 'support',
  //   title: 'Phối hợp xử lý',
  //   _id: '5fb3ad613918a44b3053f080',
  // },
  // {
  //   name: 'view',
  //   title: 'Nhận để biết',
  //   _id: '5fb3ad613918a44b3053f080',
  // },
];

const DocumentAssignModal = props => {
  const {
    open,
    docIds,
    onChangeSnackbar,
    template,
    currentRole,
    nextRole,
    onSuccess,
    role,
    saveAndSend,
    doc,
    typePage = '',
    isAuthory = false,
    childTemplate,
    typeRole,
    handleComplete,
    id,
    unit,
    processType
  } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});
  const [disableSave, setDisableSave] = useState(false);
  const type = childTemplate && childTemplate.type ? childTemplate.type : '';
  const internal = childTemplate && childTemplate.internal ? childTemplate.internal : false;

  const getBody = _docIds => {
    return {
      template: template && template._id ? template._id : '',
      children: [childTemplate],
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
      typeRole,
    };
  };
  const handleSave = _docIds => {
    const url = `${API_MEETING}/set-processor`;
    const body = getBody(_docIds);
    // if(handleComplete && id !== 'add') {
    //   handleComplete();
    // }
    const newRequest = () => {
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
          onChangeSnackbar({ variant: 'success', message: 'Trình duyệt thành công', status: true });
          if (props.onSuccess) {
            return props.onSuccess();
          }
          props.onClose && props.onClose();
        })
        .catch(error => {
          setDisableSave(false);
          onChangeSnackbar({ variant: 'success', message: 'Trình duyệt thất bại', status: false });
        });
    };

    if (handleComplete && id !== 'add') {
      handleComplete(newRequest);
    } else newRequest();
  };
  useEffect(
    () => {
      setNote(null);
      setDisableSave(false);
    },
    [open],
  );

  // const supportDisableCond = role === 'processors' && result && (!result.processingUsers || !result.commandUsers);
  // const supportDisableDeparment = role === 'processors' && result && (!result.processing || !result.command);

  return (
    <DialogUI
      title="Trình duyệt"
      disableSave={
        !result ||
        ((!result.processing || !result.processingUsers) &&
          (!result.command && !result.commandUsers) &&
          !result.support &&
          !result.supportUsers &&
          !result.view &&
          !result.viewUsers) ||
        (result.processingUsers &&
          result.commandUsers &&
          (result.processingUsers.length === 0 && result.commandUsers.length === 0) &&
          (result.processing && result.command && (result.processing.length === 0 && result.command.length === 0))) ||
        ((!docIds || docIds.length === 0) && !saveAndSend) ||
        disableSave
      }
      onSave={() => {
        setDisableSave(true);
        if (props.customSave) props.customSave(getBody(docIds));
        else {
          if (!docIds.length && saveAndSend) {
            return saveAndSend(id => {
              handleSave([id]);
            });
          }
          return handleSave(docIds);
        }
      }}
      saveText="Trình duyệt"
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
        typeDoc={type}
        internal={internal}
        columnSettings={columnSettings}
        onAllowedUsersChange={value => {
          // setAllowedUsers(value);
        }}
        onChangeColumnCheck={result => {
          setResult(result);
        }}
        firstColumnStyle={{
          width: 300,
        }}
        moduleCode="Calendar"
        currentRole={currentRole ? currentRole : childTemplate && childTemplate.code ? childTemplate.code : ''}
        template={template}
        typeRole={typeRole}
        unit={unit}
        processType={processType}
      />
      {/* <CustomInputBase
        style={{ marginTop: 30 }}
        multiline
        rows={2}
        value={note ? note : ''}
        name="note"
        // showSpeaker
        onChange={e => setNote(e.target.value)}
        label="Nội dung xử lý"
        checkedShowForm
        error={!note}
        helperText={!note ? 'Đồng chí chưa nhập nội dung xử lý' : ''}
        required
        className={"CustomRequiredLetter"}
      /> */}
    </DialogUI>
  );
};

export default memo(DocumentAssignModal);
