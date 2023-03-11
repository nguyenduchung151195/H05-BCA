import React, { useRef, useCallback, useState, memo, useEffect } from 'react';
import { API_PLAN_WORKING } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForPlanWorking';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { API_COMMENT } from '../../config/urlConfig';

let columnSettings = [

  {
    name: 'processing',
    title: 'Xử lý chính',
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
  const {
    processType = '',
    open,
    docIds,
    onChangeSnackbar,
    template,
    currentRole,
    profile,
    onUpdate,
    nextRole,
    childTemplate,
    role,
    saveAndSend,
    doc,
    typePage = '',
    isAuthory = false,
    typeCalendar,
    unit
  } = props;

  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});
  const [roleSelect, setRoleSelect] = useState('');
  const [roleSupportSelect, setRoleSupportSelect] = useState('');
  const [roleCommander, setRoleCommander] = useState('');
  const [disableSave, setDisableSave] = useState(true);

  const type = childTemplate && childTemplate.type ? childTemplate.type : '';

  if (typeCalendar) {
    columnSettings = typeCalendar === 2 ? columnSettings.filter(f => f.name === 'processing') : columnSettings
  }



  const handleSave = useCallback(_docIds => {
    const url = isAuthory ? `${API_PLAN_WORKING}/set-processor?authority=true` : `${API_PLAN_WORKING}/set-processor`;
    let body = {
      template: template,

      children: childTemplate,
      docIds: _docIds,
      processors: result.processing && result.processing.length > 0 ? [] : result.processingUsers,
      views: [... new Set(result.viewUsers)],
      note,
      // command: childTemplate.command,
      // complete: profile && profile.canProcessAny && result.processingUsers,
      // processorUnits: result.processing,
      // supporters: [... new Set(result.supportUsers)],
      // supporterUnits: result.support,
      // viewerUnits: result.view,
      // currentRole,
      // nextRole,
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
        if (props.onSuccess) {
          onChangeSnackbar({ variant: 'success', message: 'Chuyển xử lý thành công', status: true });
          props.onSuccess();
        }
      })
      .catch(error => {
        onChangeSnackbar({ variant: 'success', message: 'Chuyển xử lý thất bại', status: false });
      });
  }, [childTemplate, note, result]);

  const getRoleSelected = (code) => {
    setRoleSelect(code);
  }
  const getSupportSelected = (code) => {
    setRoleSupportSelect(code);
  }
  const getCommanderSelected = (code) => {
    setRoleCommander(code);
  }
  useEffect(() => {
    setNote(null)
  }, [open])

  useEffect(() => {
    if (!result.processingUsers || result.processingUsers.length === 0)
      setDisableSave(true)
    else setDisableSave(false)
  }, [result])
  return (
    <DialogUI
      title="Chuyển xử lý"
      disableSave={disableSave}
      onSave={() => {
        if (docIds && docIds.length === 1) {
          handleSave && handleSave(docIds);
        }
      }}

      saveText="Chuyển"
      onClose={() => props.onClose && props.onClose()}
      open={open}
      style={{ position: 'relative' }}
    >
      <DepartmentSelect
        title=""
        typeDoc={type}
        typePage={typePage}
        childTemplate={childTemplate}
        processType={processType}
        roleP={role}
        docIds={docIds}
        profile={profile}
        resultP={result}
        getRole={getRoleSelected}
        getSupportRole={getSupportSelected}
        getCommander={getCommanderSelected}
        onChange={value => {
          //console.log(value)
          // setAllowedOrgs(value);
        }}
        columnSettings={columnSettings}
        onAllowedUsersChange={value => {
          // setAllowedUsers(value);
        }}
        onChangeColumnCheck={result => {

          setResult(pre => ({ ...pre, ...result }));
        }}
        firstColumnStyle={{
          width: 300,
        }}
        moduleCode="IncommingDocument"
        template={template}
        byOrg={true}
        unit={unit}

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
        // required
        className={"CustomRequiredLetter"}
      />
    </DialogUI>
  );
};

export default memo(DocumentAssignModal);
