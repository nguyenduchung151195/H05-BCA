import React, { useRef, useState, memo, useEffect } from 'react';
import { API_INCOMMING_DOCUMENT } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForDocumentList';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { API_COMMENT } from '../../config/urlConfig';
import { createStructuredSelector } from 'reselect';
import { makeSelectProfile } from '../../containers/Dashboard/selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';

const columnSettings = [
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
    currentChild,
    currentChildSP,
    currentPreChild,
    currentProcesseds,
    profile,
    typeDocOfItem,
    isAuthory = false,
    profileAuthority,
  } = props;
  const [allowedOrgs, setAllowedOrgs] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});
  const [addHandling, setAddHandling] = useState([]);
  const [disableSave, setDisableSave] = useState(false);
  const [roleSupportSelect, setRoleSupportSelect] = useState('');
  const [nowChildren, setNowChildren] = useState('');

  useEffect(
    () => {
      if (Array.isArray(currentChild) && currentChild.length > 0) {
        const a = currentChild.map(i => {
          <>{i && i.children && Array.isArray(i.children) && i.children.length > 0 && setAddHandling(i.children.map(t => t.code))}</>;
        });
      }
    },
    [currentChild],
  );
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
  const getSupportSelected = code => {
    setRoleSupportSelect(code);
  };
  useEffect(
    () => {
      if (isAuthory) {
        if (profileAuthority && profileAuthority._id) {
          const lastIndex = (currentProcesseds && Array.isArray(currentProcesseds) && currentProcesseds.lastIndexOf(profileAuthority._id)) || -1;
          if (lastIndex !== -1) {
            setNowChildren(currentPreChild && currentPreChild[lastIndex]);
          } else {
            setNowChildren();
          }
        }
      } else {
        if (profile && profile._id) {
          const lastIndex = (currentProcesseds && Array.isArray(currentProcesseds) && currentProcesseds.lastIndexOf(profile._id)) || -1;
          if (lastIndex !== -1) {
            setNowChildren(currentPreChild && currentPreChild[lastIndex]);
          } else {
            setNowChildren();
          }
        }
      }
    },
    [currentChild, currentChildSP, currentPreChild, currentProcesseds, profile],
  );
  const getChildrenSupport = (role, childSupport = [], roleSelected = '') => {
    // if (role === 'supporters') {
    //   if (childSupport && checkChildrenSupport(childSupport) && roleSelected) {
    //     let itemSelect = getChildrenSupportSelected(childSupport, roleSelected);
    //     let [item] = itemSelect && itemSelect.length === 1 && itemSelect;
    //     let originChildSupport = [...childSupport];
    //     let index = originChildSupport.findIndex(f => f.idTree === item.idTree);
    //     if (index !== -1) {
    //       return [...originChildSupport];
    //     }
    //     originChildSupport.push(...itemSelect);
    //     return [...originChildSupport.filter(f => f.code)];
    //   }
    //   return childSupport && [...childSupport];
    // }
    // if (role === 'commander') {
    //   if (roleSelected) {
    //     return [...getChildrenSupportSelected(childCommander, roleSelected)];
    //   }
    //   return [childTemplate];
    // }
    console.log(role, 'role');
    console.log(nowChildren, 'nowChildren');
    console.log(roleSelected, 'roleSelected');

    if (role !== 'supporters' && role !== 'commanders' && roleSelected) {
      return [...childSupport, ...getChildrenSupportSelected(nowChildren, roleSelected)];
    }
    return [...childSupport];
  };
  const handleSave = _docIds => {
    const url = `${API_INCOMMING_DOCUMENT}/add-more-processor`;

    let body = {
      template,
      docIds: _docIds,
      supporters: result.supportUsers,
      supporterUnits: result.support,
      viewers: result.viewUsers,
      viewerUnits: result.view,
      currentRole,
      nextRole,
      note,
      // childrenSupport: getChildrenSupport("processors", childSupport, roleSupportSelect),
      childrenSupport: getChildrenSupport(role, currentChildSP, roleSupportSelect),
    };
    console.log(typeDocOfItem, 'typeDocOfItem');

    console.log(body, 'body bodybody');

    // if (typeDocOfItem === "roomDoc") {
    //   body = {
    //     ...body,
    //     childrenSupport: getChildrenSupport(role, currentChildSP, roleSupportSelect)
    //   }
    // }
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
        if (!res.successNo) return onChangeSnackbar({ variant: 'error', message: 'Thêm xử lý thất bại', status: true });
        onChangeSnackbar({ variant: 'success', message: 'Thêm xử lý thành công', status: true });
        if (props.onSuccess) {
          return props.onSuccess();
        }
        props.onClose && props.onClose();
      })
      .catch(error => {
        setDisableSave(false);
        onChangeSnackbar({ variant: 'success', message: 'Thêm xử lý thất bại', status: false });
      });
  };

  useEffect(
    () => {
      setDisableSave(false);
    },
    [open],
  );

  const supportDisableCond = role === 'processors' && result && !result.processing && !result.processingUsers && !result.commandUsers;
  //  check add new process

  return (
    <DialogUI
      title="Thêm xử lý"
      disableSave={
        !result ||
        (!result.processing && !result.processingUsers && !result.support && !result.supportUsers && !result.view && !result.viewUsers) ||
        (Array.isArray(result.processingUsers) && result.processingUsers.length === 0) ||
        ((!docIds || !docIds.length) && !saveAndSend) ||
        disableSave
      }
      onSave={() => {
        setDisableSave(true);
        if (!docIds.length && saveAndSend) {
          return saveAndSend(id => {
            handleSave([id]);
          });
        }
        return handleSave(docIds);
      }}
      saveText="Thêm"
      onClose={() => props.onClose && props.onClose()}
      open={open}
      style={{ position: 'relative' }}
    >
      <DepartmentSelect
        title=""
        allowedDepartmentIds={allowedOrgs}
        allowedUsers={allowedUsers}
        docIds={docIds}
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
        moduleCode="IncommingDocument"
        currentRole={currentRole ? currentRole : template && template.group && template.group[0] ? template.group[0].person : ''}
        template={template}
        currentChild={currentChild}
        addHandling={addHandling}
        isAuthory={isAuthory}
        typeDocOfItem={props.typeDocOfItem}
        getSupportRole={getSupportSelected}
      />
      <CustomInputBase
        style={{ marginTop: 30 }}
        multiline
        rows={2}
        value={note}
        name="note"
        // showSpeaker
        onChange={e => setNote(e.target.value)}
        label="Nội dung xử lý"
        checkedShowForm
        autoFocus

        // error={!note}
        // helperText={!note ? 'Đồng chí chưa nhập nội dung xử lý' : ''}
      />
    </DialogUI>
  );
};

// export default memo(DocumentAssignModal);

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(DocumentAssignModal);
