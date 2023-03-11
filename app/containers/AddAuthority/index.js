/**
 *
 * AddAuthority
 *
 */

import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Today } from '@material-ui/icons';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AsyncAutocomplete } from 'components/LifetekUi';
import CloseIcon from '@material-ui/icons/Close';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
  Button,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigCheckShowForm } from '../../utils/common';
import { compose } from 'redux';
import { makeSelectProfile } from 'containers/Dashboard/selectors';
import { API_USERS, API_AUTHORITY_DOCUMENT, UPLOAD_IMG_SINGLE, UPLOAD_APP_URL } from '../../config/urlConfig';
import moment from 'moment';
import request from 'utils/request';
import { fetchData, serialize } from '../../helper';
import _ from 'lodash';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';

/* eslint-disable react/prefer-stateless-function */
function AddAuthority(props) {
  const { onClose, code, open, onChangeSnackbar, addAuthorityDialog, onClickAttachFile, onShowDetail } = props;
  const [localState, setLocalState] = useState({
    others: {},
    startDate: moment().format('YYYY/MM/DD HH:mm'),
    endDate: moment()
      .endOf('month')
      .format('YYYY/MM/DD HH:mm'),
    authorized: '',
    isForceEnd: false,
  });
  const [checkRequired, setCheckRequired] = useState({});
  const [file, setFile] = useState([]);
  const [checkShowForm, setCheckShowForm] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [idDelete, setidDelete] = useState();
  const [disabled, setDisabled] = useState(false);
  const [checkBeforeDate, setCheckBeforeDate] = useState(false);

  useEffect(() => {
    const checkRequired = viewConfigCheckRequired(code, 'required');
    const checkShowForm = viewConfigCheckRequired(code, 'showForm');
    setCheckRequired(checkRequired);
    setCheckShowForm(checkShowForm);
    setCheckBeforeDate(false);
    return () => {
      checkRequired;
      checkShowForm;
      setCheckBeforeDate(false);
    };
  }, []);

  useEffect(
    () => {
      if (!open) {
        setLocalMessages({});
        setErrorStartDateEndDate('');
        setErrorTextStartDate('');
        setErrorTextEndDate('');
        setCheckBeforeDate(false);
      }
      setDisabled(false);
    },
    [open],
  );

  // useEffect(
  //   () => {
  //     const messages = viewConfigCheckForm(code, localState);
  //     setLocalMessages(messages);
  //   },
  //   [localState],
  // );

  useEffect(
    () => {
      if (addAuthorityDialog && addAuthorityDialog._id) {
        setIsEdit(true);
        fetchData(`${API_AUTHORITY_DOCUMENT}/${addAuthorityDialog._id}`, 'GET').then(data => {
          if (_.get(data, '_id')) {
            setFile(_.get(data, 'url', []));

            if (_.get(data, 'authorized._id')) {
              const filter = { filter: { _id: _.get(data, 'authorized._id') } };
              fetchData(`${API_USERS}?${serialize(filter)}`, 'GET').then(users => {
                const user = _.get(users, 'data', []).find(item => item.name === addAuthorityDialog.authorized);
                if (user) {
                  setLocalState({
                    isForceEnd: false,
                    ...addAuthorityDialog,
                    ...localState,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    authorized: user,
                  });

                  setCheckBeforeDate(moment(data.startDate).isBefore(moment()));
                }
              });
            }
          }
        });
      } else {
        setIsEdit(false);
        setLocalState({
          startDate: moment().format('YYYY/MM/DD HH:mm'),
          endDate: moment()
            .endOf('month')
            .format('YYYY/MM/DD HH:mm'),
        });
      }
    },
    [addAuthorityDialog],
  );

  const handleChange = e => {
    const files = e.target.files;
    const newFiles = [...file];
    for (let i = 0; i < files.length; i += 1) {
      newFiles.push(files[i]);
    }
    setFile(newFiles);
  };
  const handleDelete = e => {
    const newFiles = file.filter((i, idx) => idx !== e);
    setFile(newFiles);
    setOpenDelete(false);
  };

  const handleInputChange = useCallback(
    (e, _name, _value) => {
      const name = e ? e.target.name : _name;
      const value = e ? e.target.value : _value;
      const newFilter = { ...localState, [name]: value };
      if (!newFilter.startDate && newFilter.endDate) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('');
        setErrorTextEndDate('');
      } else if (newFilter.startDate && !newFilter.endDate) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('');
        setErrorTextEndDate('');
      } else if (newFilter.startDate && newFilter.endDate && new Date(newFilter.endDate) < new Date(newFilter.startDate)) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('"Ngày bắt đầu" phải nhỏ hơn "Ngày kết thúc"');
        setErrorTextEndDate('"Ngày kết thúc" phải lớn hơn "Ngày bắt đầu"');
      } else {
        setErrorStartDateEndDate(false);
        setErrorTextStartDate('');
        setErrorTextEndDate('');
      }
      setLocalState({ ...localState, [name]: value });
      setLocalMessages({ ...localMessages, [name]: !value });
    },
    [localState, localMessages],
  );
  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handleSave = async () => {
    setDisabled(true);
    try {
      const messages = viewConfigCheckForm(code, localState);
      setLocalMessages(messages);
      if (Object.values(messages).filter(v => v).length || errorStartDateEndDate) {
        return onChangeSnackbar({ variant: 'error', message: 'Vui lòng nhập đầy đủ các trường thông tin', status: true });
      }
      const urlFile = await fileUpload();
      //   let urlObj;
      //   if (urlFile) {
      //     const dataId = urlFile.fileData.split('/')[urlFile.fileData.split('/').length - 1];
      //     urlObj = {
      //       id: dataId,
      //       name: urlFile.nameFl,
      //     };
      //   }
      const url = `${API_AUTHORITY_DOCUMENT}`;
      let body;
      if (file.length === 0) {
        body = {
          ...localState,
          url: []
        };
      } else {
        body = {
          ...localState,
          url: urlFile || [],
        };
      }
      if (localState._id) {
        request(`${url}/${localState._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
          .then(() => {
            setDisabled(true);
            setFile([]);
            onChangeSnackbar({ variant: 'success', message: 'Cập nhật ủy quyền thành công', status: true });
            if (props.onSuccess) {
              return props.onSuccess();
            }
            props.onClose && props.onClose();
          })
          .catch(error => {
            setDisabled(false);
            onChangeSnackbar({ variant: 'error', message: error.message || 'Cập nhật ủy quyền thất bại', status: true });
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
          .then(() => {
            setDisabled(true);
            setFile([]);
            onChangeSnackbar({ variant: 'success', message: 'Ủy quyền thành công', status: true });
            if (props.onSuccess) {
              return props.onSuccess();
            }
            props.onClose && props.onClose();
          })
          .catch(error => {
            setDisabled(false);
            onChangeSnackbar({ variant: 'error', message: error.message || 'Ủy quyền thất bại', status: true });
          });
      }
    } catch (err) {
      //console.log(err, 'asdasdsad');
    }
  };

  const handleClose = () => {
    onClose();
    setLocalState({});
    setFile([]);
    setErrorStartDateEndDate(false);
  };

  const fileUpload = async () => {
    if (file.length > 0) {
      const tasks = [];
      for (let i = 0; i < file.length; i += 1) {
        if (file[i]._id) {
          tasks.push((() => file[i]._id)());
        } else {
          const formData = new FormData();
          formData.append('file', file[i]);

          tasks.push(
            fetch(UPLOAD_IMG_SINGLE, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: formData,
            }).then(res => res.json()),
          );
        }
      }
      const responses = await Promise.all(tasks);
      return responses.map((fileData, index) => {
        const f = file[index];
        const item = {
          fileData: fileData.url,
          name: f.name,
          id: f.id || (fileData.url && fileData.url.split('/') && fileData.url.split('/')[fileData.url.split('/').length - 1]),
        };
        if (f._id) {
          item._id = f._id;
          item.fileData = `${UPLOAD_APP_URL}/files/${f.id}`;
        }
        return item;
      });
    } else {
      return { fileData: '', name: '' };
    }
  };

  function getLabel(name) {
    return viewConfigCheckShowForm('AuthorityDocument', name, '', 'title');
  }

  return (
    <>
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle id="alert-dialog-title">
          <p style={{ fontWeight: 600, fontSize: 16 }}>Thông báo</p>
        </DialogTitle>
        <DialogContent>Đồng chí có chắc chắn muốn xóa tập tin?</DialogContent>
        <DialogActions>
          <Grid item xs={12}>
            <Grid container spacing={8} justify="flex-end">
              <Grid item>
                <CustomButton
                  color="primary"
                  onClick={() => {
                    idDelete !== undefined && handleDelete(idDelete);
                    setidDelete(undefined);
                  }}
                >
                  Đồng ý
                </CustomButton>
              </Grid>
              <Grid item>
                <CustomButton
                  color="secondary"
                  onClick={() => {
                    setOpenDelete(false);
                    setidDelete(undefined);
                  }}
                >
                  HỦY
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          <p style={{ fontWeight: 600, fontSize: 16 }}>Ủy Quyền</p>
        </DialogTitle>
        <DialogContent style={{ height: "100vh" }} >
          <Grid container direction="row" justify="center" alignItems="flex-start" spacing={8}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Grid item sm={6} style={{ position: 'relative', marginBottom: 5 }}>
                {/* <CustomDatePicker
                  allowRemove
                  disablePast
                  label={getLabel('startDate')}
                  value={localState.startDate}
                  isUpdate={localState && localState._id ? true : false}
                  name="startDate"
                  onChange={e => handleInputChange(null, 'startDate', e && moment(e).format('YYYY-MM-DD'))}
                  required={checkRequired && checkRequired.startDate}
                  checkedShowForm={checkShowForm && checkShowForm.startDate}
                  className={checkRequired.startDate ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                /> */}

                <DateTimePicker
                  fullWidth
                  format="DD/MM/YYYY HH:mm"
                  variant="outlined"
                  keyboard
                  disablePast={onShowDetail === false ? !checkBeforeDate : !onShowDetail}
                  disabled={onShowDetail || checkBeforeDate}
                  allowRemove
                  isUpdate={localState && localState._id ? true : false}
                  label={getLabel('startDate')}
                  value={localState.startDate}
                  onChange={e => handleInputChange(null, 'startDate', moment(e).format('YYYY-MM-DD HH:mm'))}
                  required={checkRequired && checkRequired.startDate}
                  checkedShowForm={checkShowForm && checkShowForm.startDate}
                  className={checkRequired.startDate ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                  keyboardIcon={<Today style={{ width: '80%', color: 'black' }} />}
                  margin="dense"
                />
                {errorStartDateEndDate ? (
                  <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px' }}>{errorTextStartDate}</p>
                ) : null}
              </Grid>
              <Grid item sm={6} style={{ position: 'relative', marginBottom: 5 }}>
                {/* <CustomDatePicker
                  allowRemove
                  disablePast
                  label={getLabel('endDate')}
                  value={localState.endDate}
                  name="endDate"
                  isUpdate={localState && localState._id ? true : false}
                  onChange={e => handleInputChange(null, 'endDate', e && moment(e).format('YYYY-MM-DD'))}
                  required={checkRequired && checkRequired.endDate}
                  checkedShowForm={checkShowForm && checkShowForm.endDate}
                  className={checkRequired.endDate ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                /> */}
                <DateTimePicker
                  fullWidth
                  format="DD/MM/YYYY HH:mm"
                  variant="outlined"
                  keyboard
                  disablePast={!onShowDetail}
                  disabled={onShowDetail}
                  allowRemove
                  isUpdate={localState && localState._id ? true : false}
                  label={getLabel('endDate')}
                  name="endDate"
                  value={localState.endDate}
                  onChange={e => handleInputChange(null, 'endDate', e && moment(e).format('YYYY-MM-DD HH:mm'))}
                  required={checkRequired && checkRequired.endDate}
                  checkedShowForm={checkShowForm && checkShowForm.endDate}
                  className={checkRequired.endDate ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                  keyboardIcon={<Today style={{ width: '80%', color: 'black' }} />}
                  margin="dense"
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <Grid item sm={12} style={{ marginTop: 20 }}>
              <AsyncAutocomplete
                label={getLabel('authorized')}
                // onChange={e => handleInputChange(e)}
                disabled={onShowDetail}
                onChange={value => {
                  setLocalState({ ...localState, authorized: value });
                  const messages = viewConfigCheckForm(code, { authorized: value });
                  setLocalMessages(e => ({ ...e, authorized: messages.authorized }));
                  setDisabled(false);
                }}
                value={localState.authorized}
                url={`${API_AUTHORITY_DOCUMENT}/list-user`}
                // ref={ref => (this.projectRef = ref)}
                error={localMessages && localMessages.authorized}
                helperText={localMessages && localMessages.authorized}
                required={checkRequired.authorized}
                className={checkRequired.authorized ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                checkedShowForm={checkShowForm.authorized}
              />
            </Grid>
            <Grid item sm={12}>
              <CustomGroupInputField
                disabled={onShowDetail}
                code={code}
                columnPerRow={1}
                value={localState.others}
                onChange={handleOtherDataChange}
              />
            </Grid>
          </Grid>
          <Grid item sm={12}>
            <div>
              <label htmlFor="fileUpload1" style={{ display: 'inline-block', marginRight: 10 }}>
                <Button color="primary" variant="contained" component="span" disabled={onShowDetail}>
                  {/* <span style={{ marginRight: 5 }}>
                  <AttachFileIcon />
                </span> */}
                  Tệp đính kèm
                </Button>
              </label>
            </div>
            <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              {file &&
                file.map((item, index) => (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: 'calc(25% - 15px)',
                      padding: 5,
                      margin: 3,
                      background: 'rgba(3,3,3,0.04)',
                    }}
                  >
                    <div
                      title={item.name}
                      style={{
                        flex: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      onClick={() => isEdit && onClickAttachFile(item)}
                    >
                      {item.name}
                    </div>
                    <Tooltip title="Xoá">
                      <CloseIcon
                        style={{ width: 14, height: 14, marginLeft: 10 }}
                        onClick={() => {
                          if (!onShowDetail) {
                            setOpenDelete(true);
                            setidDelete(index);
                          }
                        }}
                      />
                    </Tooltip>
                  </div>
                ))}
            </div>
            <input onChange={handleChange} id="fileUpload1" style={{ display: 'none' }} name="fileUpload1" type="file" multiple />
          </Grid>
          {isEdit === true && (
            <Grid item sm={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={onShowDetail}
                    checked={localState.isForceEnd}
                    onClick={() => {
                      setLocalState({ ...localState, isForceEnd: !localState.isForceEnd })
                    }}
                  />
                }
                label="Kết thúc ủy quyền"
              />
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Grid item xs={12}>
            <Grid container spacing={8} justify="flex-end">
              <Grid item>
                {!onShowDetail && (
                  <CustomButton
                    color="primary"
                    disabled={disabled}
                    onClick={() => {
                      setDisabled(true);
                      setTimeout(() => {
                        handleSave();
                      }, 1);
                    }}
                  >
                    Lưu
                  </CustomButton>
                )}
              </Grid>
              <Grid item>
                <CustomButton color="secondary" onClick={() => handleClose()}>
                  HỦY
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

const withConnect = connect(mapStateToProps);

AddAuthority.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default compose(withConnect)(AddAuthority);
