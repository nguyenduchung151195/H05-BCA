/**
 *
 * RemoveDialog
 *
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogActions,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { Paper } from 'components/LifetekUi';
import moment from 'moment';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomInputField from '../../components/Input/CustomInputField';
import PropTypes from 'prop-types';
import request from '../../utils/request';
import Department from 'components/Filter/DepartmentAndEmployee/Light';
import { removeAccents, removeSpaceStr } from '../../utils/functions';
import { API_USERS, API_BOOK_DOCUMENT, API_GET_GEN_CODE } from '../../config/urlConfig';
// import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import { TextField } from '@material-ui/core';

function AddBookDocument(props) {
  const { openDialog, handleClose, onSave, id = '', typeDoc, profile, error } = props;
  const [years, setYears] = useState([]);
  const INITDATA = {
    year: moment().format('YYYY'),
    name: null,
    code: '',
    bookDocumentId: '',
    active: true,
    codeStart: 1
  };
  const [localState, setLocalState] = useState(INITDATA);
  const [disabled, setDisabled] = useState(false);
  const [errorTextField, setError] = useState({
    name: null,
    toBookCode: null,
  });
  const [errorCodeStart, setErrorCodeStart] = useState("");
  const handleChangeType = name => e => {
    setLocalState(pre => ({ ...pre, [name]: e.target.value }));
  };

  const handleCloseInDialog = () => {
    setLocalState({
      year: moment().format('YYYY'),
      name: '',
      code: '',
      bookDocumentId: '',
      active: false,
    });
    handleClose();
  };
  const handleCloseLocal = () => {
    setLocalState({
      year: moment().format('YYYY'),
      name: '',
      code: '',
      bookDocumentId: '',
      active: false,
    });
    handleClose();
  };

  const generateToBookCode = useCallback(
    () => {
      const { bookDocumentId, name, year } = localState;
      const { value } = bookDocumentId;
      let nameRemoveSign = removeAccents(name);
      if (nameRemoveSign) {
        nameRemoveSign = removeSpaceStr(nameRemoveSign);
      }
      let result
      if (profile.workingOrganization) {
        result = nameRemoveSign && `${profile.workingOrganization.code}/${value}/${year.value}/${nameRemoveSign.toUpperCase()}`;
      }
      else result = nameRemoveSign && `${value}/${year.value}/${nameRemoveSign.toUpperCase()}`;
      setLocalState(pre => ({ ...pre, toBookCode: result }));
    },
    [localState],
  );
  useEffect(
    () => {
      let timer = setTimeout(() => {
        generateToBookCode();
      }, 100);
      () => {
        clearTimeout(timer);
        generateToBookCode();
      };
    },
    [localState.name, localState.year, localState.bookDocumentId],
  );

  const handleChangeValue = e => {
    const { type, name } = e.target;
    let { value } = e.target;
    if (type === 'checkbox') {
      return setLocalState(pre => ({ ...pre, [name]: e && e.target && e.target.checked || false }));
    }
    setLocalState(pre => ({ ...pre, [name]: value }));
  };

  const generateYear = () => {
    let count = 0;
    let years = [];
    while (count <= 5) {
      let year = moment()
        .add(count, 'year')
        .format('YYYY');
      let obj = {
        value: year,
        title: `${year}`,
      };
      years.push(obj);
      count += 1;
    }
    setYears(years);
  };
  useEffect(() => {
    generateYear();
  }, []);

  useEffect(
    () => {
      if (id) {
        request(`${API_BOOK_DOCUMENT}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            if (res) {
              let year = years.find(f => f.value == res.year);
              setLocalState({ ...res, bookDocumentId: res.typeDocument, year });
            }
          })
          .catch(error => {
            onChangeSnackbar({ variant: 'success', message: error, status: false });
          });
      }
    },
    [id, years],
  );

  useEffect(
    () => {
      if (error === true) {
        setDisabled(false);
      }
    },
    [error],
  );

  useEffect(
    () => {
      setDisabled(false);
      setLocalState({ ...localState, name: null, toBookCode: null, active: true })
    },
    [openDialog],
  );

  const handleSave = useCallback(
    () => {
      if (localState.name === null) {
        return setError({ ...errorTextField, name: 'Vui lòng nhập tên sổ!' });
      }
      if (localState.codeStart === "0" || localState.codeStart === 0) {
        return setErrorCodeStart("Số bắt đầu không hợp lệ!");
      }
      else if (localState.codeStart !== "0" || localState.codeStart !== 0) {
        setErrorCodeStart("")
      }
      setDisabled(true);
      onSave && onSave(localState);
    },
    [localState],
  );

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={() => {
          handleCloseInDialog();
          setLocalState({ ...localState, name: null });
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <p style={{ fontWeight: 600, fontSize: 16 }}>{props.title}</p>
        </DialogTitle>
        <DialogContent>
          <Paper style={{ zIndex: '0 !important' }}>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <Department
                  labelDepartment={'Tên đơn vị'}
                  department={profile.organizationUnit ? profile.organizationUnit.name : ''}
                  disableEmployee
                  name="organizationUnitId"
                  profile={profile}
                  moduleCode="IncommingDocument"
                  isNoneExpand={true}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <CustomInputField
                  label={'Năm'}
                  configType="year"
                  configCode="S302"
                  type="Source|CrmSource,S302|Value||value"
                  name="year"
                  options={years}
                  value={localState.year}
                  onChange={handleChangeType('year')}
                />
              </Grid>
              <Grid container spacing={8} style={{ marginTop: 5 }}>
                <Grid item xs={12}>
                  <CustomInputField
                    label={'Loại sổ'}
                    configType="crmSource"
                    configCode="S302"
                    type="Source|CrmSource,S302|Value||value"
                    name="bookDocumentId"
                    typeDoc={id ? localState.typeDocument && localState.typeDocument && localState.typeDocument.moduleCode.value : typeDoc}
                    value={localState.bookDocumentId}
                    onChange={handleChangeType('bookDocumentId')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInputBase
                    label={'Tên sổ'}
                    value={localState.name ? localState.name : ''}
                    name="name"
                    onChange={e => {
                      handleChangeValue(e);
                      setError({ ...errorTextField, name: null });
                    }}
                    autoFocus
                    error={errorTextField.name !== null}
                    helperText={errorTextField.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInputBase
                    label={'Mã sổ'}
                    value={localState.toBookCode ? localState.toBookCode : ''}
                    name="toBookCode"
                    onChange={e => {
                      handleChangeValue(e);
                      setError({ ...errorTextField, toBookCode: null });
                    }}
                    autoFocus
                    error={errorTextField.toBookCode !== null}
                    helperText={errorTextField.toBookCode}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <NumberFormat
                  label="Số bắt đầu"
                  value={localState.codeStart}
                  onChange={(e) => setLocalState({ ...localState, codeStart: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={id && id !== "add"}
                  error={errorCodeStart}
                  helperText={errorCodeStart}
                  margin="normal"
                  customInput={CustomInputBase}
                  allowNegative={false}
                  decimalSeparator={null}
                />
              </Grid>
              <Grid item xs={12}>
                {
                  console.log(localState, "localState")
                }
                <FormControlLabel
                  control={<Checkbox name="active" color="primary" checked={localState.active ? true : false} onChange={handleChangeValue} />}
                  label="Hoạt động"
                />
              </Grid>

            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleSave();
            }}
            disabled={disabled}
            color="primary"
            variant="contained"
            autoFocus
          >
            Lưu
          </Button>
          <Button onClick={handleCloseLocal} color="secondary" variant="contained">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

AddBookDocument.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  openDialogRemove: PropTypes.bool,
};

export default AddBookDocument;
