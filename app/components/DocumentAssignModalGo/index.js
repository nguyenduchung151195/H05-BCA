import React, { useRef, useState, memo, useEffect } from 'react';
import { API_GOING_DOCUMENT, UPLOAD_APP_URL } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForOutDocument';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { clientId } from '../../variable';
import { convertBody } from 'utils/common';

const columnSettings = [
  {
    name: 'processing',
    title: 'Xử lý chính',
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
    onUpdate,
    dataDoc,
    template,
    currentRole,
    childTemplate,
    nextRole,
    typeProcess = '',
    onSuccess,
    role,
    saveAndSend,
    doc,
    typePage,
    isAuthory = false,
    checkOrg,
    unit,
  } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);

  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});
  const [disableButton, setDisableButton] = useState(false);
  const [replyUser, setReplyUser] = useState();
  const handleUpload = async (data, id) => {
    try {
      console.log(data, "data")
      const { duthao , file = [], totrinh  } = data;
      let number = 0
      if ((!duthao && !file && !totrinh) || (!duthao && file && !file.length && totrinh && !totrinh.length)) {
        return {
          files: data.files,
          docFiles: data.docFiles,
          listFiles: data.totrinh,
        };
      }
      let firstUploadFile;
      if (duthao && duthao.length) {
        number += 1
        firstUploadFile = duthao.pop();
      }
      if (!firstUploadFile && file.length) {
        firstUploadFile = file.pop();
      }
      if (!firstUploadFile && totrinh.length) {
        number = -10
        firstUploadFile = totrinh.pop();
      }
      let files = [...(data.file_old || [])];
      let docFiles = [...(data.duthao_old || [])];
      let listFiles = [...(data.totrinh_old || [])];
      let url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&mid=${data.originId ? data.originId : id}&mname=${data.documentType && data.documentType.value}`;
      if (firstUploadFile) {
        const fname = number !== 0 ? (number > 0 ? 'duthao' : 'totrinh') : 'file'
        console.log(number, fname, "number")
        const firstFileInfo = await getFileData([firstUploadFile], url, 'OutGoingDocument', fname, 1);
        console.log(firstFileInfo, 'firstFileInfo', data.documentType && data.documentType.value)
        if (duthao && duthao.length) {
          docFiles = [...docFiles, ...firstFileInfo];
        } else {
          if (fname === 'duthao') {
            docFiles = [...docFiles, ...firstFileInfo];
          } else
            listFiles = [...listFiles, ...firstFileInfo];
          files = [...files, ...firstFileInfo];
        }
      }
      console.log(duthao, totrinh, file, 'file', totrinh.length)
      if (duthao && duthao.length) {
        const duthaoFileInfo = await getFileData(duthao, url, 'OutGoingDocument-fileDocs', 'duthao', 1);
        docFiles = [...docFiles, ...duthaoFileInfo];
      }
      if (totrinh && totrinh.length) {
        const listFileInfo = await getFileData(totrinh, url, 'OutGoingDocument-fileLists', 'totrinh', 1);
        listFiles = [...listFiles, ...listFileInfo];
        console.log(listFiles, 'listFiles')
        console.log(listFileInfo, "listFileInfo")
      }
      if (file && file.length) {
        const fileInfo = await getFileData(file, url, 'OutGoingDocument-files', 'file', 1);
        files = [...files, ...fileInfo];
      }
      return {
        files,
        docFiles,
        listFiles,
      };
    } catch (error) {
      return {
        files: [],
        docFiles: [],
        listFiles: [],
      };
    }
  }
  const getFileData = async (files, url, code, name, type) => {
    try {
      const task = [];
      for (let i = 0; i < files.length; i += 1) {
        const form = new FormData();
        form.append('fileUpload', files[i]);
        if (name === 'duthao' || name === 'totrinh') form.append('version', 'upload')
        const head = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token_03')}`,
          },
          body: form,
        };
        task.push(fetch(`${url}&code=${code}&fname=${name}&ftype=${type}`, head).then(res => res.json()));
      }
      const res = await Promise.all(task);
      const fileInfos = res
        .map(r => {
          if (r && r.data && r.data[0]) {
            return {
              id: r.data[0]._id,
              name: r.data[0].name,
            };
          }
          return null;
        })
        .filter(r => r);
      return fileInfos;
    } catch (error) {
      return [];
    }
  }
  const handleSave = async _docIds => {
    const url = isAuthory ? `${API_GOING_DOCUMENT}/set-processor?authority=true` : `${API_GOING_DOCUMENT}/set-processor`;
    const body = {
      template: template[0] ? { ...template[0] } : {},
      children: [childTemplate],
      parent: template[0] ? { ...template[0] } : {},
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
      replyUser,
    };
    if (role === 'receive' && dataDoc && dataDoc._id) {
      let dataSend = {};
      dataSend = { ...dataDoc };
      let { stage, ...rest } = dataSend || {};
      const { files, docFiles, listFiles } = await handleUpload(dataDoc, dataDoc._id)
      let convertedBody = convertBody(rest, 'OutGoingDocument');
      convertedBody = {
        ...convertedBody,
        files: files || [],
        docFiles: docFiles || [],
        listFiles: listFiles || []
      }
      request(`${API_GOING_DOCUMENT}/${dataDoc._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(rest),
        body: JSON.stringify(convertedBody),
      })
        .then(res => {
          if (res) {
            request(url, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            })
              .then(res => {
                onChangeSnackbar({
                  variant: 'success',
                  message: role === 'receive' ? 'Trình ký thành công' : 'Chuyển xử lý thành công',
                  status: true,
                });
                if (props.onSuccess) {
                  return props.onSuccess();
                }
                props.onClose && props.onClose();
              })
              .catch(error => {
                onChangeSnackbar({ variant: 'success', message: role === 'receive' ? 'Trình ký thất bại' : 'Chuyển xử lý thất bại', status: false });
                setDisableButton(false);
              });
          }
        })
        .catch(() => {
          setDisableButton(false);
        });
    } else {
      request(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then(res => {
          onChangeSnackbar({ variant: 'success', message: role === 'receive' ? 'Trình ký thành công' : 'Chuyển xử lý thành công', status: true });
          if (props.onSuccess) {
            return props.onSuccess();
          }
          props.onClose && props.onClose();
        })
        .catch(error => {
          onChangeSnackbar({ variant: 'success', message: role === 'receive' ? 'Trình ký thất bại' : 'Chuyển xử lý thất bại', status: false });
          setDisableButton(false);
        });
    }
  };

  useEffect(
    () => {
      setDisableButton(false);
    },
    [open],
  );

  const disableSave = !result || (!result.processing && !result.processingUsers) || disableButton === true;
  return (
    <DialogUI
      title={role === 'receive' ? 'Trình ký' : 'Chuyển xử lý'}
      disableSave={disableSave}
      onSave={() => {
        setDisableButton(true);
        if (saveAndSend) {
          saveAndSend(id => {
            handleSave([id]);
          });
        } else {
          handleSave(docIds);
        }
      }}
      saveText="Gửi"
      onClose={() => {
        props.onClose && props.onClose();
        setResult({});
      }}
      open={open}
      style={{ position: 'relative' }}
      maxWidth="xl"
      height={'calc(100vh - 50px)'}
    >
      <DepartmentSelect
        title=""
        allowedDepartmentIds={allowedOrgs}
        allowedUsers={allowedUsers}
        onChange={value => {
          // setAllowedOrgs(value);
        }}
        columnSettings={columnSettings}
        childTemplate={childTemplate}
        // columnSettings={columnSettings.filter(
        //   c =>
        //     (role === 'receive' && c.name === 'processing') ||
        //     role === 'processors'
        // )}
        onAllowedUsersChange={value => {
          // setAllowedUsers(value);
        }}
        onChangeColumnCheck={(result, departments) => {
          setResult(pre => ({ ...pre, ...result }));
          let newData = [];
          Object.keys(result).forEach(k => {
            if (Array.isArray(result[k])) {
              newData = newData.concat(result[k]);
            }
          });
          let checkDepartMent = false;
          departments && departments.map((item, index) => {
            newData.map(element => {
              if (item._id === element) {
                checkDepartMent = true;
              }
            });
          });
          if (checkDepartMent === true) {
            setReplyUser(null);
          } else {
            setReplyUser(newData);
          }
        }}
        firstColumnStyle={{
          width: 300,
        }}
        moduleCode="OutGoingDocument"
        typePage={typePage}
        currentRole={currentRole ? currentRole : template && template.group && template.group[0] ? template.group[0].person : ''}
        template={template}
        typeProcess={typeProcess}
        docIds={docIds}
        checkOrg={checkOrg || (childTemplate && childTemplate.checkOrg) || false}
        unit={unit || (childTemplate && childTemplate.unit) || ''}
      />
      <CustomInputBase
        style={{ marginTop: 30 }}
        multiline
        rows={2}
        value={note}
        name="note"
        // showSpeaker
        onChange={e => setNote(e.target.value)}
        label={role === 'receive' ? 'Nội dung trình ký' : 'Nội dung xử lý'}
      // checkedShowForm
      // error={!note}
      // helperText={!note ? `Đồng chí chưa nhập nội dung ${role === 'receive' ? 'trình ký' : 'xử lý'}` : ''}
      />
    </DialogUI>
  );
};

export default memo(DocumentAssignModal);
