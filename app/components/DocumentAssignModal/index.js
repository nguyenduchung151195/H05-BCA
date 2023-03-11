import React, { useRef, useCallback, useState, memo, useEffect } from 'react';
import { API_INCOMMING_DOCUMENT, TRANSFER_FILE_DOCUMENT, API_TRANFER_SET_PROCESSOR_IS_ANY, API_FILE_SYSTERM_TRANSFER } from 'config/urlConfig';
import { TextField, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForDocument';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { API_COMMEN } from '../../config/urlConfig';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { fetchData } from '../../helper';

const columnSettings = [
  {
    name: 'command',
    title: 'Chỉ đạo',
    _id: '5fb3ad613918a44b3053f080',
    allowSelectDepartment: false,
  },
  {
    name: 'processing',
    title: 'Xử lý chính',
    _id: '5fb3ad613918a44b3053f080',
    allowSelectDepartment: true,
  },
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
    info,
    onSuccess,
    dataDoc,
    childSupport = [],
    child,
    supporteds = [],
    supporters = [],
    childCommander,
    childCommanderSupport,
    childTemplate,
    role,
    saveAndSend,
    handleCheckValidate,
    doc,
    typePage = '',
    isAuthory = false,
    checkOrg,
    roleDirection,
    sendUnit,
    unit,
    allowSendToUnit,
    rootTab,
    file
  } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});
  const [roleSelect, setRoleSelect] = useState('');
  const [roleSupportSelect, setRoleSupportSelect] = useState('');
  const [roleCommander, setRoleCommander] = useState('');
  const type = childTemplate && childTemplate.type ? childTemplate.type : '';
  const [flag, setFlag] = useState(false);
  const [disableSave, setDisableSave] = useState(false);
  const [replyUser, setReplyUser] = useState();

  const checkRoleCommander = ({ processors = [], commander = [] }, { _id }) => {
    let result = false;
    if (isAuthory) {
      result = true;
    } else {
      if (processors && processors.length > 0 && _id) {
        let index = processors.findIndex(f => f === _id);
        if (index !== -1) {
          result = true;
        } else {
          result = false;
        }
      }
      if (processors && processors.length === 0 && commander && _id) {
        let index = commander.findIndex(f => f === _id);
        if (index !== -1) {
          result = true;
        } else {
          result = false;
        }
      }
    }
    return result;
  };

  let commanderCanProcess = info && profile && checkRoleCommander(info, profile);
  let column;
  if (role === 'receive') {
    column = role === 'receive' ? columnSettings.filter(f => f.name === 'processing') : columnSettings;
  } else {
    column = !commanderCanProcess ? columnSettings.filter(f => f.name !== 'processing') : columnSettings;
  }

  const getChildren = (type, role) => {
    if (type === 'any' && role !== '') {
      return [getChildrenSelected(typeof child !== 'undefined' && Array.isArray(child) && child.length > 0 ? child : childTemplate[0], roleSelect)];
    }
    if (type === 'any' && role === '') {
      return child ? [...child] : [];
    }
    if ((type === 'flow' || type === 'command') && role !== '') {
      return [childTemplate];
    }
    return child ? [...child] : [];
  };

  const checkChildrenSupport = array => {
    let result = false;
    if (array && Array.isArray(array)) {
      array.map(item => {
        if (item && item.code) {
          result = true;
        }
        if (!item) {
          result = false;
        }
      });
    }

    return result;
  };
  const getChildrenProcess = (children, roleSelected = '', roleCommand = '') => {
    if (roleCommand) {
      if (roleSelected == '') {
        return [...getChildrenSupportSelected(child, roleCommand)];
      }
      if (roleSelected) {
        return children;
      }
    }
    if (roleCommand == '') {
      if (roleSelected) {
        return children;
      }
      if (roleSelected == '') {
        return children;
      }
    }
  };

  const getChildrenSupport = (role, childSupport = [], roleSelected = '') => {
    if (role === 'supporters') {
      if (childSupport && checkChildrenSupport(childSupport) && roleSelected) {
        let itemSelect = getChildrenSupportSelected(childSupport, roleSelected);
        let [item] = itemSelect && itemSelect.length === 1 && itemSelect;
        let originChildSupport = [...childSupport];
        let index = originChildSupport.findIndex(f => f.idTree === item.idTree);
        if (index !== -1) {
          return [...originChildSupport];
        }
        originChildSupport.push(...itemSelect);
        return [...originChildSupport.filter(f => f.code)];
      }
      return childSupport && [...childSupport];
    }
    if (role === 'commander') {
      if (roleSelected) {
        return [...getChildrenSupportSelected(childCommander, roleSelected)];
      }
      return [childTemplate];
    }
    if (role !== 'supporters' && role !== 'commanders' && roleSelected) {
      return [...childSupport, ...getChildrenSupportSelected(child, roleSelected)];
    }
    return [...childSupport];
  };

  const handleSave = _docIds => {
    const validate = handleCheckValidate &&  handleCheckValidate()
    if(validate) return 
    const url = isAuthory ? `${API_INCOMMING_DOCUMENT}/set-processor?authority=true` : `${API_INCOMMING_DOCUMENT}/set-processor`;
    let children = getChildren(processType, roleSelect);
    let dataChildren = getChildrenProcess(children, roleSelect, roleCommander);
    let body = {
      template: template[0] ? { ...template[0] } : {},
      children: dataChildren,
      // children: roleCommander !== '' && roleSelect === '' ? [getChildrenSupportSelected(child, roleCommander)] : children,
      // childrenSupport: role === 'supporters' && childSupport && checkChildrenSupport(childSupport) ? roleSupportSelect ? [...getChildrenSupportSelected(child, roleSupportSelect)] : [...childSupport] : getRoleSelected ? [...getChildrenSupportSelected(child, roleSupportSelect)] : [getChildrenSelected(childTemplate, roleSupportSelect)],
      childrenSupport: getChildrenSupport(role, childSupport, roleSupportSelect),
      childrenCommander: checkChildrenSupport(childCommander) ? [...childCommander] : [...getChildrenSupportSelected(child, roleCommander)],
      // childrenCommanderSupport: role === 'commander' && commanderCanProcess ? [] : roleSupportSelect ? [...getChildrenSupportSelected(childCommander, roleSupportSelect)] : [childCommanderSupport],
      parent: template[0] ? { ...template[0] } : {},
      docIds: _docIds,
      processors: result.processing && result.processing.length > 0 ? [] : result.processingUsers,
      processorUnits: result.processing,
      complete: profile && processType === 'flow' ? [] : [],
      supporters: [...new Set(result.supportUsers)],
      supporterUnits: result.support,
      commander: result.commandUsers,
      viewers: [...new Set(result.viewUsers)],
      viewerUnits: result.view,
      currentRole: processType === 'any' ? (Array.isArray(dataChildren) && dataChildren.length > 0 ? dataChildren[0].code : '') : currentRole,
      nextRole,
      note,
      replyUser,
    };
    if (rootTab === 'receive' && processType === 'any') {
      // khi mà chuyển bất kì chọn đích danh thì dùng cái này
      body = {
        ...body,
        processors: result.processingUser || [],
        processingUsers: result.processingUsers || [],


        // processors: result.processingUsers || [],

      };
    }
    console.log(body, 'body')
    console.log(result, 'result')
    let finalBody;
    if (role !== 'supporters' && role !== 'commander') {
      finalBody = { ...body };
    }
    if (role === 'supporters') {
      let { children, ...rest } = body;
      finalBody = { ...rest };
    }
    if (role === 'commander') {
      if (commanderCanProcess) {
        let { childrenCommanderSupport, ...rest } = body;
        finalBody = { childrenCommanderSupport: [], ...rest };
      }
      if (!commanderCanProcess) {
        let { children, ...rest } = body;
        finalBody = { ...rest, childrenCommander: [] };
      }
    }
    if (role === 'receive' && dataDoc && dataDoc._id) {
      let dataSend = {};
      if (dataDoc.deadline == 'dd/mm/yyyy') {
        let { deadline, ...rest } = dataDoc || {};
        dataSend = { ...rest };
      } else {
        dataSend = { ...dataDoc };
      }
      onUpdate && onUpdate(dataSend, '');
    }
    request(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalBody),
    })
      .then(res => {
        if (res && res.incommingDocumentIDCopy && res.incommingDocumentIDCopy !== res.incommingDocumentID) {
          fetch(TRANSFER_FILE_DOCUMENT, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              incommingDocumentID: res.incommingDocumentID,
              incommingDocumentIDCopy: res.incommingDocumentIDCopy,
            }),
          });
        }

        if (
          res.successNo === 1 &&
          res.incommingDocumentID &&
          res.incommingDocumentIDCopy &&
          res.incommingDocumentID !== res.incommingDocumentIDCopy
        ) {
          fetchData(
            `${API_TRANFER_SET_PROCESSOR_IS_ANY}?incommingDocumentID=${res.incommingDocumentID}&incommingDocumentIDCopy=${res.incommingDocumentIDCopy
            }`,
          );
        }

        if (res && res.fileTrans) {
          fetch(API_FILE_SYSTERM_TRANSFER, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileTrans: res.fileTrans }),
          });
        }
        setDisableSave(true);

        if (res) {
          const { sucess, fails } = res;
          let mess = '';
          let status = true;
          if (sucess && sucess.status) {
            mess = mess + sucess.message + ' và ';
            if (fails && fails.status) {
              status = false;
              const name = fails.resultFails.join(', ');
              mess = mess + fails.message + ': ' + name;
            }
          } else if (fails && fails.status) {
            status = false;
            const name = fails.resultFails.join(', ');
            mess = 'Chuyển xử lý ' + fails.message + ': ' + name;
          }

          onChangeSnackbar({
            variant: status ? 'success' : 'error',
            message: status ? 'Chuyển xử lý thành công' : mess || 'Chuyển xử lý thành công',
            status: true,
          });
        }

        if (props.onSuccess) {
          return props.onSuccess();
        }
        props.onClose && props.onClose();
      })
      .catch(error => {
        setDisableSave(false);
        onChangeSnackbar({ variant: 'error', message: error.message || 'Chuyển xử lý thất bại', status: true });
      });
  };

  useEffect(
    () => {
      setNote(null);
      setDisableSave(false);
      setResult({});
    },
    [open],
  );

  const getChildrenSelected = (children, role) => {
    let result = {};
    if (children && Array.isArray(children)) {
      children.length > 0 &&
        children[0].children &&
        children[0].children.map(child => {
          if (!role.includes(',') && child.code == role) {
            result = { ...child };
          }
        });
    } else if (children && children.code) {
      if (children.code == role) {
        result = { ...children };
      }
    }
    if (result) {
      return result;
    }
  };
  const getChildrenSupportSelected = (children, role) => {
    let result = {};
    let results = [];
    if (Array.isArray(children)) {
      children.map(child => {
        if (child.children) {
          child.children.map(ch => {
            if (role.includes(',')) {
              let roles = role.split(',') || [];
              if (roles && roles.length > 0) {
                roles.map(role => {
                  if (ch.code === role) {
                    results.push({ ...ch });
                  }
                });
              }
            }
            if (!role.includes(',') && ch.code == role) {
              result = { ...ch };
            }
          });
        } else {
          if (!role.includes(',')) {
            result = { ...child };
          }
        }
      });
    }
    if (!role.includes(',') && result) {
      return [result];
    }
    if (role.includes(',') && results) {
      return [...results];
    }
  };
  const getRoleSelected = code => {
    setRoleSelect(code);
  };
  const getSupportSelected = code => {
    setRoleSupportSelect(code);
  };
  const getCommanderSelected = code => {
    setRoleCommander(code);
  };

  const supportDisableCond = role === 'processors' && result && (!result.processingUsers || !result.commandUsers);
  const supportDisableDeparment = role === 'processors' && result && (!result.processing || !result.command);
  return (
    // chuyển xử lý - xử lý chính
    <Dialog fullWidth maxWidth="xl" open={open} onClose={() => props.onClose && props.onClose()} aria-labelledby="max-width-dialog-title">
      <DialogContent style={{ height: 'calc(100vh - 50px)', padding: '5px 10px' }}>
        <Typography style={{ fontSize: 20, marginBottom: 30, fontWeight: 'bold' }}>Chuyển xử lý</Typography>
        <DepartmentSelect
          title=""
          typeDoc={type}
          typePage={typePage}
          allowedDepartmentIds={allowedOrgs}
          allowedUsers={allowedUsers}
          childTemplate={childTemplate}
          processType={processType}
          roleP={role}
          supporteds={supporteds}
          docIds={docIds}
          open={open}
          supporters={supporters}
          profile={profile}
          getRole={getRoleSelected}
          getSupportRole={getSupportSelected}
          resultP={result}
          getCommander={getCommanderSelected}
          onChange={value => {
            // setAllowedOrgs(value);
          }}
          columnSettings={
            column &&
            column.filter(
              c =>
                role === 'receive' ||
                role === 'processors' ||
                role === 'commander' ||
                (role === 'supporters' && c.name !== 'processing' && c.name !== 'command'),
            )
          }
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
            departments.map((item, index) => {
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
          moduleCode="IncommingDocument"
          currentRole={currentRole ? currentRole : template && template.group && template.group[0] ? template.group[0].person : ''}
          template={template}
          roleDirection={roleDirection}
          checkOrg={checkOrg || (childTemplate && childTemplate.checkOrg) || false}
          byOrg={true}
          unit={unit || (childTemplate && childTemplate.unit) || ''}
          sendUnit={sendUnit}
          allowSendToUnit={allowSendToUnit}
          organizationUnit={props.info && props.info.organizationUnit ? props.info.organizationUnit : ''}
          rootTab={rootTab}
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
          className={'CustomRequiredLetter'}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            console.log('chuyển xử lý');
            const oldDate = localStorage.getItem('oldDate') || 0;
            console.log(parseInt(oldDate) + 100, new Date() * 1, 'so sánh date',  "docIds: ", docIds);
            if (oldDate && (parseInt(oldDate) + 100 )> new Date() * 1) return;
            localStorage.setItem('oldDate', new Date() * 1);
            // console.log('chuyển xử lý đc');
            setDisableSave(true);
            if (!docIds.length && saveAndSend) {
              return saveAndSend(id => {
                // console.log('vào 1: ', id);
                return handleSave([id]);
              });
            } else {
              console.log('vào 2');
              return handleSave(docIds);
            }
          }}
          disabled={
            !result ||
            supportDisableCond ||
            supportDisableDeparment ||
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
        >
          Chuyển
        </Button>
        <Button color="secondary" variant="contained" onClick={() => props.onClose && props.onClose()}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(DocumentAssignModal);
