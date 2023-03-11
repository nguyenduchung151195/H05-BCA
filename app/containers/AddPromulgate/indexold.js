// AddPromulgate

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AsyncAutocomplete, FileUpload } from '../../components/LifetekUi';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { mergeData, addSignedDocument, updateSignedDocument, deleteSignedDocument } from './actions';
import reducer from './reducer';
import saga from './saga';
import { API_RELEASE_DOCUMENT, API_INCOMMING_DOCUMENT, API_CHECK_EXIST_RELEASE_DOCUMENT } from '../../config/urlConfig';
import { Button, Checkbox, FormControlLabel, Grid, Menu, MenuItem, FormControl } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomDatePicker from '../../components/CustomDatePicker';
import { makeSelectProfile } from '../Dashboard/selectors';
import _ from 'lodash';
import Department from 'components/Filter/DepartmentAndEmployee';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';
import moment from 'moment';
import { Paper as PaperUI } from 'components/LifetekUi';
import { ArrowDropDown } from '@material-ui/icons';
import { changeSnackbar } from '../Dashboard/actions';
import AddSignProcess from '../AddSignProcess';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigName2Title, viewConfigCheckShowForm } from '../../utils/common';
import CustomInputField from '../../components/Input/CustomInputField';
import DocumentAssignModal from 'components/DocumentAssignModalGo';
import makeSelectAddPromulgate from './selectors';

function AddPromulgate(props) {
  const {
    profile,
    code = 'ReleaseDocument',
    addSignedDocument,
    onChangeSnackbar,
    onAddSignedDocument,
    onDeleteSignedDocument,
    onUpdateSignedDocument,
    addPromulgate,
  } = props;
  const { kanbanStatus } = addPromulgate;
  const crmSource = JSON.parse(localStorage.getItem('crmSource'));
  const id = props.match && props.match.params && props.match.params.id;
  const [localState, setLocalState] = useState({
    others: {},
    receiverUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
    type: 'Release',
    file: [],
    files: [],
    documentDate: moment(),
  });
  const [index, setIndex] = useState(0);
  const [name2Title, setName2Title] = useState({});
  const [checkRequired, setCheckRequired] = useState({});
  const [checkShowForm, setCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [currentRole, setCurrentRole] = useState({});
  const [nextRole, setNextRole] = useState({});
  const [viewType, setViewType] = useState('any');
  const [openAddSignProcessDialog, setOpenAddSignProcessDialog] = useState(false);
  const [show, setShow] = useState(false);
  const [docDetail, setDocDetail] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [selectedDocs, setSelectedDocs] = useState([id]);
  const [openAsignProcessor, setOpenAsignProcessor] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const requestURL = API_RELEASE_DOCUMENT;
  const [errorSymbol, setErrorSymbol] = useState(null);
  const [disableSave, setDisableSave] = useState(false)

  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);
    const checkRequired = viewConfigCheckRequired(code, 'required');
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setCheckRequired(checkRequired);
    setCheckShowForm(checkShowForm);
    return () => {
      newNam2Title;
      checkRequired;
      checkShowForm;
    };
  }, []);

  useEffect(
    () => {
      if (id && id !== 'add')
        fetch(`${requestURL}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setLocalState(data);
            setCurrentRole(data.currentRole);
            setNextRole(data.nextRole);
          });
    },
    [id],
  );

  useEffect(
    () => {
      if (id) {
        getDetail(id);
      }
    },
    [id],
  );

  useEffect(() => {
    if(addPromulgate && addPromulgate.error){
      setDisableSave(false)
    }
  }, [addPromulgate.error])

  const getDetail = id => {
    setDocDetail({ name: 'abc' });
  };

  const handleChangeKanban = item => {
    props.mergeData({ kanbanStatus: item.type });
  };

  const handleInputChange = useCallback(
    (e, isDate, date) => {
      const name = isDate ? 'dateVB' : 'dateText';
      const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
      if (date) {
        setLocalState({ ...localState, [name]: value });
      } else {
        setLocalState({ ...localState, [e.target.name]: e.target.value });
        const { name } = e.target;
        const messages = viewConfigCheckForm(code, { [e.target.name]: e.target.value });
        setLocalMessages(mes => ({ ...(mes || {}), [name]: messages[name] }));
      }
      if (e.target.name === 'releaseNo') {
        fetch(API_CHECK_EXIST_RELEASE_DOCUMENT, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ releaseNo: e.target.value }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === 0) {
              setErrorSymbol(data.message);
            } else {
              setErrorSymbol(null);
            }
          });
      }
    },
    [localState],
  );

  const handleChangeInputDate = useCallback(
    (e, _name, _value) => {
      const name = e && e.target ? e.target.name : _name;
      const value = e && e.target ? e.target.value : _value;
      setLocalState(pre => ({ ...pre, [name]: value }));
    },
    [localState],
  );

  const handeChangeDepartment = useCallback(
    result => {
      const { department } = result;
      setLocalState({ ...localState, senderUnit: department });
    },
    [localState],
  );

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handleChangeType = name => e => {
    setLocalState({ ...localState, [name]: e.target.value });
  };

  const handleChangeCheckbox = name => e => {
    setLocalState({ ...localState, [name]: e.target.checked });
  };

  function handleViewType() {
    setShowTemplates(true);
  }

  const handleCloseAddSignProcessDialog = () => {
    setOpenAddSignProcessDialog(false);
  };

  const handleSaveDialog = () => {};
  function handleFileDelete(f) {
    const newFiles = localState.file.filter((i, idx) => idx !== f);
    setLocalState(pre => ({ ...pre, file: newFiles }));
  }

  const cb = () => {
    props.history.goBack();
  };

  const handleSave = () => {
    const messages = viewConfigCheckForm(code, localState);
    setLocalMessages(messages);
    if (Object.values(messages).filter(v => v).length) {
      return onChangeSnackbar({ variant: 'error', message: 'Vui lòng nhập đầy đủ các trường thông tin', status: true });
    }
    const body = {
      ...localState,
    };
    if (id) {
      onUpdateSignedDocument(body, cb);
      setDisableSave(true)
    } else {
      onAddSignedDocument(body, cb);
      setDisableSave(true)
    }
  };

  function getLabel(name) {
    return viewConfigCheckShowForm('ReleaseDocument', name, '', 'title');
  }

  // function handleFileChange(e) {
  //     const files = e.target.files[0];
  //     setLocalState({ ...localState, file: files });
  //     setShow(true);
  // }

  // function handleFileChange(e) {
  //     const files = e.target.files[0];
  //     setLocalState({ ...localState, file: files });
  //     setShow(true);
  // }
  function handleFileChange(e) {
    const files = e.target.files;
    const newFiles = [...localState.file];
    for (let i = 0; i < files.length; i += 1) {
      newFiles.push(files[i]);
    }
    setLocalState(pre => ({ ...pre, file: newFiles }));
  }

  function handleFileDelete(f) {
    const files = localState.files.filter(i => i !== f);
    setLocalState({ ...localState, file: files });
    setShow(false);
  }

  const handleOpen = e => {
    setOpenDialog(e.currentTarget);
  };

  const handleClose = e => {
    setOpenDialog(null);
  };

  return (
    <div>
      <CustomAppBar
        title={id ? 'Chỉnh sửa ban hành' : 'Thêm mới ban hành'}
        onGoBack={() => {
          props.history.goBack();
        }}
        onSubmit={handleSave}
        disableSave={disableSave}
        moreButtons={
          <div style={{ marginRight: 10, display: 'flex', justifyContent: 'space-around' }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={e => {
                if (currentRole) {
                  setOpenAsignProcessor(true);
                  return;
                }
                handleOpen(e);
              }}
            >
              {/* <span style={{ marginRight: 5 }}>
                                <Send />
                            </span> */}
              Ban hành
            </Button>
            <Menu open={Boolean(openDialog)} anchorEl={openDialog} onClose={handleClose}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                <MenuItem
                  style={{ flex: 'auto' }}
                  value="any"
                  onClick={e => {
                    setOpenAsignProcessor(true);
                  }}
                >
                  Chuyển bất kỳ
                </MenuItem>
              </div>
              <div style={{ alignItems: 'center', padding: '0 10px' }}>
                <MenuItem value="procedure" onClick={e => handleViewType('procedure')}>
                  {' '}
                  {showTemplates ? <ArrowDropDown /> : <ArrowDropDown />}
                  Quy trình xử lý
                </MenuItem>
                {showTemplates &&
                  Array.isArray(templates) &&
                  templates.map(t => (
                    <MenuItem
                      value={t.code}
                      onClick={() => {
                        setSelectedTemplate(t);
                        setOpenAsignProcessor(true);
                      }}
                    >
                      <span style={{ paddingLeft: 30 }}>{t.name}</span>
                    </MenuItem>
                  ))}
              </div>
            </Menu>
          </div>
        }
        // onSubmit={onSave}
      />
      <PaperUI style={{ zIndex: '0 !important', marginTop: 30 }}>
        <Grid container spacing={8}>
          <Grid item xs={3}>
            <CustomInputBase
              label={name2Title.toBook}
              value={localState.toBook}
              name="toBook"
              onChange={e => handleInputChange(e)}
              error={localMessages && localMessages.toBook}
              helperText={localMessages && localMessages.toBook}
              required={checkRequired.toBook}
              checkedShowForm={checkShowForm.toBook}
            />
          </Grid>

          <Grid item xs={3}>
            <Department
              labelDepartment={name2Title.receiverUnit}
              onChange={handeChangeDepartment}
              department={localState.receiverUnit}
              disableEmployee
              profile={profile}
              moduleCode="ReleaseDocument"
            />
          </Grid>

          <Grid item xs={3}>
            <CustomInputField
              label={name2Title.documentField}
              configType="crmSource"
              configCode="S26"
              type="Source|CrmSource,S26|Value||value"
              name="documentField"
              value={localState.documentField}
              onChange={handleChangeType('documentField')}
              error={localMessages && localMessages.documentField}
              helperText={localMessages && localMessages.documentField}
              required={checkRequired.documentField}
              checkedShowForm={checkShowForm.documentField}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputBase
              label={'Số kí hiệu'}
              value={localState.toBookCode}
              name="toBookCode"
              onChange={e => handleInputChange(e)}
              error={(localMessages && localMessages.toBookCode) }
              helperText={(localMessages && localMessages.toBookCode)}
              required={checkRequired.toBookCode}
              checkedShowForm={checkShowForm.toBookCode}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputBase
              label={'Số/ký hiệu ban hành'}
              value={localState.releaseNo}
              name="releaseNo"
              onChange={e => handleInputChange(e)}
              error={(localMessages && localMessages.releaseNo) || errorSymbol !== null}
              helperText={(localMessages && localMessages.releaseNo) || (errorSymbol !== null && errorSymbol)}
              required={checkRequired.releaseNo}
              checkedShowForm={checkShowForm.releaseNo}
            />
          </Grid>
          <Grid item xs={3}>
            <Department
              labelDepartment={'Đơn vị nhận'}
              onChange={handeChangeDepartment}
              department={localState.receiverUnit}
              disableEmployee
              profile={profile}
              moduleCode="ReleaseDocument"
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputField
              label={name2Title.privateLevel}
              configType="crmSource"
              configCode="S21"
              type="Source|CrmSource,S21|Value||value"
              name="privateLevel"
              value={localState.privateLevel}
              onChange={handleChangeType('privateLevel')}
              error={localMessages && localMessages.privateLevel}
              helperText={localMessages && localMessages.privateLevel}
              required={checkRequired.privateLevel}
              checkedShowForm={checkShowForm.privateLevel}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomDatePicker
              label={'Ngày ban hành'}
              value={localState.documentDate}
              name="documentDate"
              onChange={e => handleChangeInputDate(null, 'documentDate', moment(e).format('YYYY-MM-DD'))}
              error={localMessages && localMessages.documentDate}
              helperText={localMessages && localMessages.documentDate}
              required={checkRequired.documentDate}
              checkedShowForm={checkShowForm.documentDate}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInputField
              label={name2Title.documentType}
              onChange={handleChangeType('documentType')}
              value={localState.documentType}
              configType="crmSource"
              configCode="S19"
              type="Source|CrmSource,S19|Value||value"
              error={localMessages && localMessages.documentType}
              helperText={localMessages && localMessages.documentType}
              required={checkRequired.documentType}
              checkedShowForm={checkShowForm.documentType}
            />
          </Grid>

          <Grid item xs={3}>
            <CustomInputField
              label={name2Title.urgencyLevel}
              configType="crmSource"
              configCode="S20"
              type="Source|CrmSource,S20|Value||value"
              name="urgencyLevel"
              value={localState.urgencyLevel}
              onChange={handleChangeType('urgencyLevel')}
              error={localMessages && localMessages.urgencyLevel}
              helperText={localMessages && localMessages.urgencyLevel}
              required={checkRequired.urgencyLevel}
              checkedShowForm={checkShowForm.urgencyLevel}
            />
          </Grid>
          {/* <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={localState.answer4docCheck}
                                    onChange={handleChangeCheckbox('answer4docCheck')}
                                    value="answer4docCheck"
                                    color="primary"
                                />
                            }
                            label="Phúc đáp văn bản"
                        />
                    </Grid> */}
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={4}>
                <FormControl>
                  {id && Array.isArray(localState.answer4doc) && localState.answer4doc.length > 0 ? (
                    <FormControlLabel
                      control={<Checkbox checked={true} onChange={handleChangeCheckbox('answer4docCheck')} value="answer4docCheck" color="primary" />}
                      label={_.get(name2Title, 'answer4doc', 'Phúc đáp văn bản')}
                    />
                  ) : (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={localState.answer4docCheck}
                          onChange={handleChangeCheckbox('answer4docCheck')}
                          value="answer4docCheck"
                          color="primary"
                        />
                      }
                      label={_.get(name2Title, 'answer4doc', 'Phúc đáp văn bản')}
                    />
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={8}>
                <Grid container spacing={8}>
                  {localState.answer4docCheck === true ? (
                    <Grid item xs={12}>
                      <AsyncAutocomplete
                        id="outlined-basic"
                        label={_.get(name2Title, 'answer4doc', 'Phúc đáp văn bản')}
                        url={API_INCOMMING_DOCUMENT}
                        onChange={e => {
                          handleChangeType('answer4doc')({ target: { value: e } });
                        }}
                        value={localState.answer4doc}
                        filter={{ stage: { $ne: 'receive' } }}
                        customOptionLabel={option => `${option.toBookCode}`}
                        filters={['toBookCode']}
                        defaultOptions
                        isMulti
                        error={localMessages && localMessages.answer4doc}
                        helperText={localMessages && localMessages.answer4doc}
                        required={checkRequired.answer4doc}
                        checkedShowForm={checkShowForm.answer4doc}
                        className={checkRequired.answer4doc ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                      />
                    </Grid>
                  ) : id && Array.isArray(localState.answer4doc) && localState.answer4doc.length > 0 ? (
                    <Grid item xs={12}>
                      {/* <AsyncAutocomplete
                                                id="outlined-basic"
                                                label={_.get(name2Title, 'answer4doc', 'Tự động ban hành')}
                                                url={API_INCOMMING_DOCUMENT}
                                                onChange={e => {
                                                    handleChangeType('answer4doc')({ target: { value: e } });
                                                }}
                                                value={localState.answer4doc}
                                                filter={{ stage: { $ne: 'receive' } }}
                                                customOptionLabel={option => `${option.toBookCode}`}
                                                filters={['toBookCode']}
                                                defaultOptions
                                                isMulti
                                                error={localMessages && localMessages.answer4doc}
                                                helperText={localMessages && localMessages.answer4doc}
                                                required={checkRequired.answer4doc}
                                                checkedShowForm={checkShowForm.answer4doc}
                                                className={checkRequired.answer4doc ? "CustomRequiredLetter" : 'CustomIconRequired'}

                                            /> */}
                    </Grid>
                  ) : null}
                  {/* {localState.taskCheck === true ? (
                                        <Grid item xs={12}>
                                            <AsyncAutocomplete
                                                id="outlined-basic"
                                                label={_.get(name2Title, 'task', 'Công việc liên quan')}

                                                url={API_TASK_PROJECT}
                                                onChange={e => {
                                                    handleChangeType('task')({ target: { value: e } });
                                                }}
                                                value={localState.task}
                                                defaultOptions
                                                isMulti
                                                error={localMessages && localMessages.task}
                                                helperText={localMessages && localMessages.task}
                                                required={checkRequired.task}
                                                checkedShowForm={checkShowForm.task}
                                                className={checkRequired.task ? "CustomRequiredLetter" : 'CustomIconRequired'}

                                            />
                                        </Grid>
                                    ) : id && Array.isArray(localState.task) && localState.task.length > 0 ? (
                                        <Grid item xs={12}>
                                            <AsyncAutocomplete
                                                id="outlined-basic"
                                                label={_.get(name2Title, 'task', 'Công việc liên quan')}

                                                url={API_TASK_PROJECT}
                                                onChange={e => {
                                                    handleChangeType('task')({ target: { value: e } });
                                                }}
                                                value={localState.task}
                                                defaultOptions
                                                isMulti
                                                error={localMessages && localMessages.task}
                                                helperText={localMessages && localMessages.task}
                                                required={checkRequired.task}
                                                checkedShowForm={checkShowForm.task}
                                                className={checkRequired.task ? "CustomRequiredLetter" : 'CustomIconRequired'}

                                            />
                                        </Grid>
                                    ) : null} */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <CustomGroupInputField code={code} columnPerRow={4} value={localState.others} onChange={handleOtherDataChange} />
          </Grid>
          <Grid item xs={12}>
            <CustomInputBase
              rows={5}
              multiline
              label={name2Title.abstractNote}
              value={localState.abstractNote}
              name="abstractNote"
              onChange={e => handleInputChange(e)}
              error={localMessages && localMessages.abstractNote}
              helperText={localMessages && localMessages.abstractNote}
              required={checkRequired.abstractNote}
              checkedShowForm={checkShowForm.abstractNote}
            />
            <Grid item xs={12}>
              {id && docDetail ? (
                <FileUpload name={docDetail.name} id={id} code={code} />
              ) : (
                <div>
                  <div>
                    <span style={{ marginRight: 10, fontSize: 14, fontWeight: 600 }}>Tệp đính kèm</span>
                    <label htmlFor="fileUpload" style={{ display: 'inline-block', marginRight: 10 }}>
                      <Button color="primary" variant="contained" component="span">
                        {/* <span style={{ marginRight: 5 }}>
                                                    <AttachFileIcon />
                                                </span> */}
                        Tệp đính kèm
                      </Button>
                    </label>
                    <label htmlFor="fileScan">
                      <Button color="primary" variant="contained" component="span">
                        {/* <span style={{ marginRight: 5 }}>
                                                    <Scanner />
                                                </span> */}
                        <span style={{ fontWeight: 'bold' }}>Quét văn bản</span>
                      </Button>
                    </label>
                  </div>
                  <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    {localState.file && <FileUpload file={localState.file} id={'add'} onDeleteFile={handleFileDelete} />
                    // localState.file.map((item, index) => (
                    // <div
                    //   style={{
                    //     display: 'flex',
                    //     alignItems: 'center',
                    //     justifyContent: 'space-between',
                    //     width: 'calc(25% - 15px)',
                    //     padding: 5,
                    //     margin: 3,
                    //     background: 'rgba(3,3,3,0.04)',
                    //   }}
                    // >
                    //   <div
                    //     title={item.name}
                    //     style={{
                    //       flex: 1,
                    //       whiteSpace: 'nowrap',
                    //       overflow: 'hidden',
                    //       textOverflow: 'ellipsis',
                    //     }}
                    //   >
                    //     {item.name}
                    //   </div>
                    //   <Tooltip title="Hủy bỏ">
                    //     <CloseIcon
                    //       style={{ width: 14, height: 14, marginLeft: 10 }}
                    //       onClick={() => {
                    //         handleFileDelete(index);
                    //       }}
                    //     />
                    //   </Tooltip>
                    // </div>
                    // ))
                    }
                  </div>
                  <input onChange={handleFileChange} id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" multiple />
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
      </PaperUI>
      <AddSignProcess
        // profile={props.profile}
        code="Documentary"
        onChangeSnackbar={onChangeSnackbar}
        open={openAddSignProcessDialog}
        onSave={handleSaveDialog}
        onClose={handleCloseAddSignProcessDialog}
      />
      <DocumentAssignModal
        open={openAsignProcessor}
        docIds={selectedDocs}
        template={selectedTemplate}
        onClose={() => {
          setOpenAsignProcessor(false);
          setSelectedTemplate(null);
          cb();
        }}
        onChangeSnackbar={props.onChangeSnackbar}
        currentRole={nextRole}
      />
    </div>
  );
}

AddPromulgate.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addPromulgate: makeSelectAddPromulgate(),
  // dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
    onAddSignedDocument: (query, cb) => {
      dispatch(addSignedDocument(query, cb));
    },
    onDeleteSignedDocument: ids => {
      dispatch(deleteSignedDocument(ids));
    },
    onUpdateSignedDocument: (data, cb) => {
      dispatch(updateSignedDocument(data, cb));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addPromulgate', reducer });
const withSaga = injectSaga({ key: 'addPromulgate', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddPromulgate);
