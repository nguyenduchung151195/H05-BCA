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
  const { open, docIds, onChangeSnackbar, template, currentRole } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});

  const [openFile, setopenFile] = useState({
    file: null,
  });

  const handleSave = async () => {
    const url = `${API_GOING_DOCUMENT}/return-docs`;
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => {
      onChangeSnackbar({ variant: 'success', message: 'Trả lại thành công', status: true });
      if (props.onSuccess) {
        return props.onSuccess();
      }
      props.onClose && props.onClose()
    }).catch(error => {
      onChangeSnackbar({ variant: 'success', message: 'Trả lại kiến thất bại', status: false })
    })
  };

  const onChangeFile = e => {
    //console.log(e.target.files[0]);

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
    <DialogUI title="Gửi trả lại" disableSave={!docIds || !docIds.length} onSave={() => {
      const url = `${API_GOING_DOCUMENT}/return-docs`;
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
        onChangeSnackbar({ variant: 'success', message: 'Trả lại thành công', status: true });
        if (props.onSuccess) {
          return props.onSuccess();
        }
        props.onClose && props.onClose()
      }).catch(error => {
        onChangeSnackbar({ variant: 'success', message: 'Trả lại kiến thất bại', status: false })
      })
    }} saveText="Gửi trả" onClose={() => props.onClose && props.onClose()} open={open} style={{ position: 'relative' }}>
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
        label="Nội dung trả lại"
        checkedShowForm
      />
    </DialogUI>
  );
};

export default DocumentAssignModal;
