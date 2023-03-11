import React, { useRef, useState, useEffect, useCallback } from 'react';
import { API_USERS, API_INCOMMING_DOCUMENT } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForDocument';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { serialize } from '../../utils/common';
import { Typography } from '@material-ui/core';
const columnSettings = [
  {
    name: 'processing',
    title: 'Thu hồi',
    _id: '5fb3ad613918a44b3053f080',
  },
];

const DocumentAssignModal = props => {
  const {
    open,
    docIds,
    onChangeSnackbar,
    type = '',
    processeds = [],
    processors = [],
    template,
    childTemplate,
    role,
    currentRole,
    isAuthory = false,
  } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [finalChild, setFinalChild] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});
  const [roleSelect, setRoleSelect] = useState('');
  const [finalChildAny, setFinalChildAny] = useState([]);
  const typeDoc = childTemplate && childTemplate.type ? childTemplate.type : '';
  const [disableSave, setDisableSave] = useState(false);

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

  const findNode = (templates, child, count) => {
    let d = count;
    templates.map(temp => {
      if (temp.children) {
        if (child) {
          let [item] = child;
          let index;

          index = item && temp && temp.children && temp.children.findIndex(f => f.idTree == item.idTree);
          if (index !== -1) {
            if (temp.children) {
              if (roleSelect) {
                setFinalChildAny([{ ...temp }]);
              } else {
                setFinalChild([{ ...temp }]);
              }
            }
          } else {
            findNode(temp.children, child, d + 1);
          }
        }
      }
    });
  };

  useEffect(
    () => {
      setNote(null);
      setDisableSave(false);
      if (open && template && childTemplate) {
        findNode(template, childTemplate, 0);
      }
    },
    [open],
  );

  useEffect(
    () => {
      if (processeds.length > 0) {
        let user;
        if (type === 'any' || type === 'flow') {
          user = { returnDoc: true, filter: { _id: { $in: processeds } } };
          // user = { userId: { $in: JSON.stringify(processeds) } };
        }

        if (type === 'startFlow') {
          let ids = processeds && processeds[0] ? processeds[0] : [];
          user = ids && { returnDoc: true, filter: { _id: { $in: [ids] } } };
        }

        // user && fetch(`${API_INCOMMING_DOCUMENT}/list-user/?authority=true&${serialize(user)}`, {

        user &&
          fetch(`${API_INCOMMING_DOCUMENT}/list-user/?${serialize(user)}`, {
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

  useEffect(
    () => {
      setFinalChildAny([]);
      if (type === 'any' && finalChild && finalChild.length === 1 && roleSelect) {
        let [item] = finalChild;
        if (item && item.code == roleSelect) {
          setFinalChildAny(finalChild);
        }
        if (item && item.code != roleSelect) {
          findNode(template, finalChild, 0);
        }
      }
    },
    [roleSelect],
  );

  useEffect(
    () => {
      if (finalChildAny && finalChildAny.length === 1 && roleSelect) {
        let [item] = finalChildAny;
        if (item && item.code == roleSelect) {
          // console.log('done');
        }
        if (item && item.code != roleSelect) {
          findNode(template, finalChildAny, 0);
        }
      }
    },
    [finalChildAny],
  );

  const getRoleSelected = code => {
    setRoleSelect(code);
  };

  // const handleSave = async () => {
  //   const url = `${API_INCOMMING_DOCUMENT}/return-docs`;
  //   let urlFile = await fileUpload();
  //   const body = {
  //     docIds,
  //     note,
  //     urlFile: urlFile && urlFile.url ? urlFile.url : null,
  //     children: template
  //   };
  //   request(url, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(body),
  //   })
  //     .then(res => {
  //       onChangeSnackbar({ variant: 'success', message: 'Trả lại thành công', status: true });
  //       if (props.onSuccess) {
  //         return props.onSuccess();
  //       }
  //       props.onClose && props.onClose();
  //     })
  //     .catch(error => {
  //       onChangeSnackbar({ variant: 'success', message: 'Trả lại kiến thất bại', status: false });
  //     });
  // };

  const onChangeFile = e => {
    setopenFile({ ...openFile, file: e.target.files[0] });
  };
  const checkIsFirst = (template, array) => {
    let result = false;
    if (array && array.length === 1) {
      let [item] = array;
      if (template) {
        template.map(temp => {
          if (temp.children && temp.children.length === 1) {
            let [fist] = temp.children;
            if (fist.idTree !== item.idTree) {
              result = false;
            } else {
              result = true;
            }
          }
        });
      }
    }
    return result;
  };

  const getChildByType = useCallback(
    type => {
      if (type === 'any') {
        return finalChildAny;
      }
      if (type === 'flow') {
        return finalChild;
      }
      if (type === 'startFlow') {
        return template && template[0] && template[0].children;
      }
    },
    [finalChild, finalChildAny, template],
  );

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
      title="Thu hồi văn bản"
      disableSave={!docIds || !docIds.length || disableSave}
      onSave={() => {
        setDisableSave(true);
        const url = `${API_INCOMMING_DOCUMENT}/recall-sent-doc`;
        const body = {
          docIds,
          note,
          //   isFirst: type === 'any' ? checkIsFirst(template, finalChildAny) : checkIsFirst(template, finalChild),
          //   processors: result.processingUsers || result.processing,
          //   children: getChildByType(type),
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
            setDisableSave(true);
            onChangeSnackbar({ variant: 'success', message: 'Thu hồi văn bản thành công', status: true });
            if (props.onSuccess) {
              return props.onSuccess();
            }
            props.onClose && props.onClose();
          })
          .catch(error => {
            setDisableSave(false);
            onChangeSnackbar({ variant: 'success', message: 'Thu hồi văn bản thất bại', status: false });
          });
      }}
      saveText="Trả lại"
      onClose={() => props.onClose && props.onClose()}
      open={open}
      style={{ position: 'relative' }}
    >
      {/* trả lại */}
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
        />
      ) : null}

      <CustomInputBase
        multiline
        rows={4}
        value={note}
        name="note"
        onChange={e => setNote(e.target.value)}
        label="Nội dung thu hồi"
      // checkedShowForm
      // error={!note}
      // helperText={!note ? 'Đồng chí chưa nhập nội dung trả lại' : ''}
      />
    </DialogUI>
  );
};

export default DocumentAssignModal;
