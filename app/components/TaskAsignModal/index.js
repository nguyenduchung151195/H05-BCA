import React, { useRef, useState, memo } from 'react';
import { API_LETTER } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForTaskClone';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { MenuItem } from '@material-ui/core';

const columnSettings = [
  {
    name: 'processing',
    title: 'Xử lý chính',
    _id: '5fb3ad613918a44b3053f080',
  },
  {
    name: 'support',
    title: 'Phối hợp xử lý',
    _id: '5fb3ad613918a44b3053f081',
  },

];
const DocumentAssignModal = props => {
  const { open, docIds, onChangeSnackbar, template, currentRole, nextRole, onSuccess, role, saveAndSend, doc, code = 'Letter'
    , allTemplates, businessRole, isAuthory = false, onSave, inCharge, historyTask, filterPeople, checkInchage } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});
  const [state, setState] = useState({})
  const [filterDatas, setFilterDatas] = useState([])
  const [dataNin, setDataNin] = useState([])

  const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === code) : null;

  return (
    <DialogUI
      title="Tìm kiếm người tham gia"

      onSave={() => onSave(result)}
      saveText="Lưu"
      onClose={() => props.onClose && props.onClose()}
      open={open}
      style={{ position: 'relative' }}
      disableSave={
        !result ||
        (!result.processing && !result.processingUsers && !result.support && !result.supportUsers && !result.view && !result.viewUsers)
        || dataNin.length === 0
      }
    >
      <DepartmentSelect
        title=""
        allowedDepartmentIds={allowedOrgs}
        allowedUsers={allowedUsers}
        onChange={value => {
          //console.log('value1', value);
        }}
        // columnSettings={columnSettings.filter(
        //   c =>
        //     (role === 'receive' && c.name === 'processing') ||
        //     role === 'processors'
        // )}
        columnSettings={columnSettings}
        onAllowedUsersChange={value => {
          //console.log('value', value);
        }}
        onChangeColumnCheck={result => {
          //console.log('result', result);
          const dataFm = result.processingUsers.concat(result.supportUsers);
          setDataNin(dataFm)
          setResult(result);
        }}
        firstColumnStyle={{
          width: 300,
        }}
        moduleCode="Letter"
        currentRole={currentRole ? currentRole : template && template.group && template.group[0] ? template.group[0].person : ''}
        template={template}
        docIds={docIds}
        inCharge={inCharge}
        historyTask={historyTask}
        filterPeople={filterPeople}
        checkInchage={checkInchage}
      />




    </DialogUI>
  );
};

export default memo(DocumentAssignModal);
