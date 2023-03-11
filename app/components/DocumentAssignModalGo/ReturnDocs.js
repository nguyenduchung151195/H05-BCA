import React, { useEffect, useRef, useState } from 'react';
import { API_GOING_DOCUMENT } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForDocumentReturnDocs';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';

const columnSettings = [
  {
    name: 'processing',
    title: 'Trả lại',
    _id: '5fb3ad613918a44b3053f080',
  },
]
const DocumentAssignModalGo = props => {
  const { open,
    docIds,
    onChangeSnackbar,
    template,
    childTemplate,
    currentRole,
    employeeReturn = [],
    processeds,
    isAuthory = false,
    type = '', processors = [],
    role,
    returnTypeDocument
  } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});
  const [item] = employeeReturn || []
  const [openFile, setopenFile] = useState({
    file: null,
  });
  const [finalChild, setFinalChild] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const typeDoc = childTemplate && childTemplate.type ? childTemplate.type : '';
  const [roleSelect, setRoleSelect] = useState('');
  const [isFirstID, setIsFirstID] = useState();


  function findNode(templates, child, count) {
    let d = count;
    templates.map(temp => {
      if (temp.children) {
        if (child) {
          let [item] = child;
          let index = temp && temp.children && temp.children.findIndex(f => f.idTree == item.idTree);
          if (index !== -1) {
            if (temp.children) {
              setFinalChild([{ ...temp }])
            }
          } else {
            findNode(temp.children, child, d + 1)
          }
        }
      }
    })
  }


  useEffect(() => {
    if (open && childTemplate && template) {
      findNode(template, childTemplate, 0)
    }
  }, [open, template, childTemplate])

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

  const getRoleSelected = code => {
    setRoleSelect(code);
  };

  const onChangeFile = e => {
    // console.log(e.target.files[0]);

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

  useEffect(
    () => {
      setDisableButton(false)
    },
    [open],
  );
  return (
    <DialogUI title="Gửi trả lại" disableSave={!docIds || !docIds.length || disableButton || (!result.processingUsers && !isFirstID)} onSave={() => {
      // setDisableButton(true)
      const url = isAuthory ? `${API_GOING_DOCUMENT}/return-docs?authority=true` : `${API_GOING_DOCUMENT}/return-docs`;
      let body = {
        docIds,
        processors: result.processingUsers,
        note,
        parent: template,
        children: finalChild
      };
      if (isFirstID) {
        body = {
          ...body,
          processors: isFirstID
        }
      }
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
        setDisableButton(false)
        onChangeSnackbar({ variant: 'success', message: 'Trả lại kiến thất bại', status: false })
      })
    }}
      saveText="Gửi trả"
      onClose={() => props.onClose && props.onClose()}
      open={open}
      style={{ position: 'relative' }}
    >

      {type !== '' ? (
        <DepartmentSelect
          title=""
          allowedDepartmentIds={allowedOrgs}
          allowedUsers={allowedUsers}
          typeDoc={typeDoc}
          // roleP={role}
          docIds={docIds}
          open={open}
          getRole={getRoleSelected}
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
          isReturn={true}
          typeReturn={true}
          type={type}
          roleP="processors"
          processor={Array.isArray(processors) && processors[0]}
          processeds={processeds}
          moduleCode="IncommingDocument"
          currentRole={finalChild && finalChild[0] ? finalChild[0].code : currentRole}
          template={template}
          returnTypeDocument={returnTypeDocument}
          setIsFirstID={setIsFirstID}
          isFirstID={isFirstID}
        />
      ) : null}

      <CustomInputBase
        multiline
        rows={4}
        value={note}
        name="note"
        onChange={e => setNote(e.target.value)}
        label="Nội dung trả lại"
      // checkedShowForm
      // error={!note}
      // helperText={!note ? 'Đồng chí chưa nhập nội dung trả lại' : ''}
      />
    </DialogUI>
  );
};

export default DocumentAssignModalGo;
