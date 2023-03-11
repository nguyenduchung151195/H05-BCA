import React, { useRef, useState, useEffect } from 'react';
import { API_USERS, API_INCOMMING_DOCUMENT } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForDocument';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { serialize } from '../../utils/common';
import { Typography } from '@material-ui/core';
import { API_MEETING } from '../../config/urlConfig';
const columnSettings = [
  {
    name: 'processing',
    title: 'Trả lại',
    _id: '5fb3ad613918a44b3053f080',
  },
];

const DocumentAssignModal = props => {
  const { open, docIds, onChangeSnackbar, type = '', processeds = [], processors = [], template, role, currentRole } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});

  const [openFile, setopenFile] = useState({
    file: null,
  });
  const getRole = ({ group = [] }) => {
    if (group.length > 0) {
      let index = group.findIndex(item => item.person === currentRole);
      // let index = group.findIndex(item => item.person === currentRole) ;
      if (index !== -1) {
        return group[index].person;
      } else {
        return currentRole;
      }
    }
  };

  useEffect(
    () => {
      if (processeds.length > 0) {
        let user;
        if (type === 'any' || type === 'flow') {
          user = {  returnDoc: true, filter: { _id: { $in: processeds } } };
          // user = { userId: { $in: JSON.stringify(processeds) } };
        }

        if (type === 'startFlow') {
          let ids = processeds && processeds[0] ? processeds[0] : [];
          user = ids && { returnDoc: true, filter: { _id: { $in: [ids] } } };
        }

        // user && fetch(`${API_INCOMMING_DOCUMENT}/list-user/?authority=true&${serialize(user)}`, {

        user &&
          fetch(`${API_MEETING}/list-user/?${serialize(user)}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
            .then(response => response.json())
            .then(res => {
              if (res && res.data) {
                setAllowedUsers(res.data);
              }
            });
      }
    },
    [open],
  );

  const handleSave = async () => {
    const url = `${API_INCOMMING_DOCUMENT}/return-docs`;
    let urlFile = await fileUpload();
    const body = {
      docIds,
      note,
      urlFile: urlFile && urlFile.url ? urlFile.url : null,
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
        onChangeSnackbar({ variant: 'success', message: 'Trả lại thành công', status: true });
        if (props.onSuccess) {
          return props.onSuccess();
        }
        props.onClose && props.onClose();
      })
      .catch(error => {
        onChangeSnackbar({ variant: 'success', message: 'Trả lại kiến thất bại', status: false });
      });
  };

  const onChangeFile = e => {
    setopenFile({ ...openFile, file: e.target.files[0] });
  };

  const fileUpload = async () => {
    const formData = new FormData();
    formData.append('file', openFile.file);

    const file = await fetch(UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      openFile: formData,
    });
    const fileData = await file.json();
    return fileData;
  };

  return (
    <DialogUI
      title="Gửi trả lại"
      disableSave={!docIds || !docIds.length}
      onSave={() => {
        const url = `${API_INCOMMING_DOCUMENT}/return-docs`;
        const body = {
          docIds,
          note,
          processors: result.processingUsers || result.processing,
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
            onChangeSnackbar({ variant: 'success', message: 'Trả lại văn bản thành công', status: true });
            if (props.onSuccess) {
              return props.onSuccess();
            }
            props.onClose && props.onClose();
          })
          .catch(error => {
            onChangeSnackbar({ variant: 'success', message: 'Trả lại văn bản thất bại', status: false });
          });
      }}
      saveText="Trả lại"
      onClose={() => props.onClose && props.onClose()}
      open={open}
      style={{ position: 'relative' }}
    >
      {type !== '' ? (
        <DepartmentSelect
          title=""
          allowedDepartmentIds={allowedOrgs}
          allowedUsers={allowedUsers}
          onChange={value => {
            // setAllowedOrgs(value);
          }}
          columnSettings={columnSettings.filter(
            c =>
              role === 'receive' ||
              role === 'processors' ||
              role === 'commander' ||
              (role === 'supporters' && c.name !== 'processing' && c.name !== 'command'),
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
          type={type}
          processor={Array.isArray(processors) && processors[0]}
          processeds={processeds}
          moduleCode="IncommingDocument"
          currentRole={currentRole ? (template ? getRole(template) : currentRole) : ''}
          template={template}
        />
      ) : null}

      <CustomInputBase
        multiline
        rows={4}
        value={note}
        name="note"
        onChange={e => setNote(e.target.value)}
        label="Nội dung trả lại"
        checkedShowForm
        error={!note}
        helperText={!note ? 'Đồng chí chưa nhập nội dung trả lại' : ''}
      />
    </DialogUI>
  );
};

export default DocumentAssignModal;
