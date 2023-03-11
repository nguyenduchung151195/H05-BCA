import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Paper,
  Typography,
  Grid,
  Tooltip,
  withStyles,
  Fab,
} from '@material-ui/core';
import { Print as PrintUI } from '@material-ui/icons';
import CustomAppBar from 'components/CustomAppBar';
import CustomDatePicker from 'components/CustomDatePicker';
import CustomInputBase from '../../components/Input/CustomInputBase';
import makeSelectDashboardPage, { makeSelectProfile } from '../../containers/Dashboard/selectors';
import RemoveDialog from './RemoveDialog';
import styles from './styles';
import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { changeSnackbar } from '../Dashboard/actions';
import { Comment, FileUpload } from '../../components/LifetekUi';
import { API_PLAN_WORKING, ALLOW_FILE_EXT_UPLOAD, FILE_SIZE_UPLOAD, UPLOAD_APP_URL } from '../../config/urlConfig';
import request from '../../utils/request';
import PlanItem from './PlanItem';
import { clientId } from '../../variable';
import { PrintContentTable } from '../../helper';

const INITIALDATA = {
  name: '',
  timeStart: moment().startOf('week'),
  timeEnd: moment().endOf('week'),
};
function AddPlanWorkingOrganization(props) {
  const [localState, setLocalState] = useState({
    others: {},
    answer4docCheck: false,
    viewers: [],
    task: [],
    signer: null,
    answer4doc: [],
    drafter: profile,
    senderUnit: profile && profile.organizationUnit ? profile.organizationUnit.organizationUnitId : {},
    file: [],
    fileDocument: [],
    fileList: [],
    newFiles: [],
    incommingDocument: [],
    dataTask: [],
    recipientId: {},
    sendingMan: { title: '---Chọn---', value: null },
    receiver: null,
    recipientIds: [],
  });
  const [openDialogTask, setOpenDialogTask] = useState(false);
  const [openDialogFilter, setOpenDialogFilter] = useState(false);
  const { classes, profile, onChangeSnackbar } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [errors, setErrors] = useState({});
  const id = props.match && props.match.params ? props.match.params.id : 'add';
  const [disableSave, setDisableSave] = useState(false);
  const [countTurn, setCountTurn] = useState(0);
  const [checkImportFile, setCheckImportFile] = useState({
    files: [],
  });
  const [formData, setFormData] = useState({
    // ...INITIALDATA,
    name: '',
    timeStart: moment().startOf('week'),
    timeEnd: moment().endOf('week'),
    files: [],
    organizationUnitId: profile && profile.organizationUnit,
    organizationUnitName: profile && profile.organizationUnit ? profile.organizationUnit.name : '',
    resultDetail: [
      {
        checked: false,
        title: 'I. Công tác chuyên môn',
        type: 3,
        name: '1. Quản lý nhà nước',
        content: '',
        result: '',
      },
      {
        checked: false,
        title: '',
        name: '2. Thường xuyên',
        content: '',
        result: '',
      },
      {
        checked: false,
        title: '',
        name: '3. Đề án - Dự án - Kế hoạch',
        content: '',
        result: '',
      },
      {
        checked: false,
        title: 'II. Công tác đảng,thi đua khen thưởng,cán bộ',
        type: 1,
        name: '1. Công tác đảng,thi đua khen thưởng,cán bộ',
        content: '',
        result: '',
      },
      {
        checked: false,
        title: 'III. Công tác hậu cần',
        type: 1,
        name: '1. Hậu cần',
        content: '',
        result: '',
      },
    ],
    planDetail: [
      {
        checked: false,
        title: 'I. Công tác chuyên môn',
        type: 3,
        name: '1. Quản lý nhà nước',
        content: '',
        result: '',
      },
      {
        checked: false,
        title: '',
        name: '2. Thường xuyên',
        content: '',
        result: '',
      },
      {
        checked: false,
        title: '',
        name: '3. Đề án - Dự án - Kế hoạch',
        content: '',
        result: '',
      },
      {
        checked: false,
        title: 'II. Công tác đảng,thi đua khen thưởng,cán bộ',
        type: 1,
        name: '1. Công tác đảng,thi đua khen thưởng,cán bộ',
        content: '',
        result: '',
      },
      {
        checked: false,
        title: 'III. Công tác hậu cần',
        type: 1,
        name: '1. Hậu cần',
        content: '',
        result: '',
      },
    ],
  });
  const handleGoBack = () => {
    props.history.push('/PlanWorking/organizationPlan');
  };

  const isValid = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return 'Cần nhập thông tin tên kế hoạch';
        return '';
      case 'timeStart':
        if (!value) return 'Cần nhập thông tin ngày bắt đầu';
        if (formData.timeEnd && moment(value).diff(moment(formData.timeEnd), 'day') > 0) {
          return 'Ngày bắt đầu không được lớn hơn ngày kết thúc';
        }
        return '';
      case 'timeEnd':
        if (!value) return 'Cần nhập thông tin ngày kết thúc';
        if (formData.timeStart && moment(value).diff(moment(formData.timeStart), 'day') < 0) {
          return 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu';
        }
        return '';
    }
  };
  const checkValidForm = useCallback(
    data => {
      let fields = ['name', 'timeStart', 'timeEnd'];
      let errors = {};
      fields.forEach(f => {
        errors[f] = isValid(f, data[f]);
      });
      if (Object.values(errors).every(x => x === '')) {
        return true;
      } else {
        let fieldErrors = Object.keys(errors);
        let message = fieldErrors && fieldErrors.reduce((result, el) => (result += el ? (errors[el] ? errors[el] + ',' : '') : ''), '');
        onChangeSnackbar({ variant: 'error', message, status: true });
        setErrors(errors);
        return false;
      }
    },
    [formData.name, formData.timeEnd, formData.timeStart],
  );

  const handleSave = () => {
    try {
      let body = { ...formData, typeCalendar: 1 };
      let finalBody = { ...body, organizationUnitId: body && body.organizationUnitId && body.organizationUnitId.organizationUnitId };
      if (checkValidForm(finalBody)) {
        let url = id ? `${API_PLAN_WORKING}/${id}` : `${API_PLAN_WORKING}`;
        setDisableSave(true);
        request(url, {
          method: id ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalBody),
        })
          .then(res => {
            if (res && res.status === 1) {
              let message = id ? 'Cập nhật kế hoạch thành công' : 'Thêm mới kế hoạch thành công';
              let url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&mid=${res._id}&mname=cng-vn%20`;
              if (checkImportFile.files.length === 0 && id === 'add') {
                const firstFileInfo = getFileData(formData.files, url, 'workingCalendar', 'files', 1).then(response => {
                  fetch(`${API_PLAN_WORKING}/update/${res._id}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json',
                    },
                    method: 'PUT',
                    body: JSON.stringify({ files: response, docFiles: [], listFiles: [] }),
                  }).then((data)=>{
                    console.log(data, "data")
                  }).catch((err)=>{
                    console.log(err, "data")
                  }).finally(()=>{
                    handleGoBack()
                  })
                });
              } else if (checkImportFile.files.length !== 0 && id !== 'add') {
                const firstFileInfo = getFileData(checkImportFile.files, url, 'workingCalendar', 'files', 1).then(response => {
                  fetch(`${API_PLAN_WORKING}/update/${res._id}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json',
                    },
                    method: 'PUT',
                    body: JSON.stringify({ files: formData.files.concat(response), docFiles: [], listFiles: [] }),
                  }).then((data)=>{
                    console.log(data, "data")
                  }).catch((err)=>{
                    console.log(err, "data")
                  }).finally(()=>{
                    handleGoBack()
                  })
                });
              }else {
                handleGoBack()
              }
              setDisableSave(true);
              onChangeSnackbar({ variant: 'success', message: message, status: true });
              // handleGoBack();
            } else {
              setDisableSave(false);
              onChangeSnackbar({ variant: 'error', message: res.message, status: true });
            }
          })
          .catch(error => {
            if (error && error.message) {
              setDisableSave(false);
              onChangeSnackbar({ variant: 'error', message: error.message, status: true });
            }
          });
      }
    } catch (error) {
      setDisableSave(false);
      onChangeSnackbar({ variant: 'error', message: error, status: true });
    }
  };

  const handleChangeDateValue = (e, _name, _value) => {
    const name = e && e.target ? e.target.name : _name;
    const value = e && e.target ? e.target.value : _value;
    setFormData(pre => ({ ...pre, [name]: value }));
  };

  const handleAddWorking = nameTable => {
    let planDetail = [...formData[nameTable]];
    let newPlan = {
      name: '',
      checked: false,
      content: '',
    };
    planDetail.push(newPlan);
    setFormData(pre => ({ ...pre, [nameTable]: [...planDetail] }));
  };
  const handleChangeValue = useCallback(
    e => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData.name],
  );

  const handleChangeValueChild = (e, index, nameTable) => {
    const { name, value, type } = e.target;
    let planDetail = [...formData[nameTable]];
    if (type === 'checkbox') {
      planDetail[index] = {
        ...planDetail[index],
        [name]: e.target.checked,
      };
    }
    if (type !== 'checkbox') {
      planDetail[index] = {
        ...planDetail[index],
        [name]: value,
      };
    }
    setFormData(pre => ({ ...pre, [nameTable]: [...planDetail] }));
  };
  useEffect(
    () => {
      if (id) {
        request(`${API_PLAN_WORKING}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            if (res) {
              setFormData({ ...res });
            }
          })
          .catch(error => {
            onChangeSnackbar({ variant: 'success', message: error, status: false });
          });
      } else {
        request(
          `${API_PLAN_WORKING}/weekCalendar?startDate=${countTurn === 1 ? formData.timeStart : formData.timeStart.format('YYYY/MM/DD')}&endDate=${countTurn === 1 ? formData.timeEnd : formData.timeEnd.format('YYYY/MM/DD')
          }`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          },
        )
          .then(res => {
            if (res) {
              setFormData({ ...formData, resultDetail: res.previousCalendar ? res.previousCalendar.planDetail : formData.planDetail });
              setCountTurn(1);
            }
          })
          .catch(error => {
            onChangeSnackbar({ variant: 'success', message: error, status: false });
          });
      }
    },
    [id, formData.timeEnd],
  );

  const handeChangeDepartmentTake = useCallback(
    result => {
      const { department } = result;
      setFormData(pre => ({ ...pre, organizationUnitId: department }));
    },
    [formData],
  );
  const handleOpenDialogRemove = (data, nameTable) => {
    setOpenDialog(true);
    let result = [...data];
    if (data) {
      data.map((item, index) => {
        if (item.checked) {
          result.splice(index, 1);
        }
      });
    }
    setSelectedData(pre => ({ ...pre, [nameTable]: [...result] }));
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleDelete = useCallback(
    () => {
      if (selectedData && selectedData.resultDetail) {
        setFormData(pre => ({ ...pre, resultDetail: selectedData.resultDetail }));
      }
      if (selectedData && selectedData.planDetail) {
        setFormData(pre => ({ ...pre, planDetail: selectedData.planDetail }));
      }
      if (selectedData && selectedData.nextPlanDetail) {
        setFormData(pre => ({ ...pre, nextPlanDetail: selectedData.nextPlanDetail }));
      }
      setOpenDialog(false);
    },
    [selectedData],
  );

  const handleTypeChange = useCallback(
    (value, name) => {
      value && setFormData(pre => ({ ...pre, [name]: moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD') }));
    },
    [formData.timeStart, formData.timeEnd],
  );

  function handleFileChange(e) {
    const files = e.target.files;
    for (const property in files) {
      if (property !== 'length' && typeof files[property] !== 'function') {
        const nameOfFile = files[property].name || ""
        let extName = nameOfFile.split('.').pop() || ""
        extName = extName.toLowerCase() || ""
        if (extName && ALLOW_FILE_EXT_UPLOAD.includes('.' + extName) === false || !extName) {
          return props.onChangeSnackbar({ variant: 'warning', message: 'Loại file không hợp lệ, vui lòng chọn lại!', status: true });
        }
        if (files[property] && typeof files[property] !== 'function' && files[property].size > FILE_SIZE_UPLOAD) {
          return props.onChangeSnackbar({ variant: 'warning', message: 'Dung lượng file quá lớn, vui lòng chọn lại!', status: true });
        }
      }
    }
    if (id !== 'add' || !id) {
      setCheckImportFile(pre => ({ ...pre, files: [...pre.files, ...files] }));
    } else {
      setFormData(pre => ({ ...pre, files: [...pre.files, ...files] }));
    }
  }

  function handleFileDelete(f, name = '') {
    if (name === 'fileUpload') {
      const newFiles = formData.files.filter((i, idx) => idx !== f);
      const idFiles = formData.files.filter((i, idx) => idx === f);
      if (idFiles.length !== 0) {
        setFormData({ ...formData, files: newFiles });
        let url = `${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&id=${idFiles[0].id}&code=workingCalendar`;
        fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
          body: JSON.stringify({ id: idFiles[0].id }),
        });
      } else {
        setCheckImportFile({ ...checkImportFile, files: checkImportFile.files.filter((i, idx) => idx !== Math.abs(formData.files.length - f)) });
      }
    }
    // else {
    //   const newFiles = checkImportFile.files.filter((i, idx) => idx !== f);
    //   console.log(newFiles);
    //   setCheckImportFile({ ...checkImportFile, files: newFiles });
    // }
  }

  async function getFileData(files, url, code, name, type) {
    try {
      const task = [];
      for (let i = 0; i < files.length; i += 1) {
        const form = new FormData();
        form.append('fileUpload', files[i]);
        if (name === 'duthao' || name === 'totrinh') form.append('version', 'upload');
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
  return (
    <>
      <Paper style={{ padding: 20, marginTop: 10 }}>
        <CustomAppBar
          title={!id ? 'Thêm mới kế hoạch đơn vị' : props.location.state === 'view' ? 'Chi tiết kế hoạch đơn vị' : 'Cật nhật kế hoạch đơn vị'}
          onGoBack={handleGoBack}
          disableAdd
          moreButtons={
            <div style={{ marginRight: 10, display: 'flex', justifyContent: 'space-around' }}>
              <Button variant="outlined" color="inherit" onClick={handleSave} style={{ marginRight: 10 }} disabled={disableSave}>
                Lưu
              </Button>
            </div>
          }
        />
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Typography variant="h6" align="start" style={{ marginBottom: '10px', fontSize: 14, fontWeight: 'bold' }}>
              Thông tin kế hoạch
            </Typography>
          </Grid>
          <Grid item container md={!id ? 12 : 8} spacing={8}>
            <Grid item xs={6}>
              {/* <Department
                labelDepartment={'Tên đơn vị'}
                onChange={e => handeChangeDepartmentTake(e)}
                department={formData.organizationUnitId ? formData.organizationUnitId.name : ''}
                disableEmployee
                name="organizationUnitId"
                profile={profile}
                moduleCode="IncommingDocument"
                isNoneExpand={true}
                disabled
              /> */}
              <CustomInputBase
                label={'Tên đơn vị'}
                value={formData.organizationUnitName}
                name="organizationUnitId"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <CustomInputBase
                label={'Tên kế hoạch'}
                value={formData.name}
                name="name"
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                autofocus
                error={errors.name}
                helperText={errors ? errors.name : ''}
                disabled={props.location.state === 'view'}
              // required={checkRequired.toBookCode}
              // checkedShowForm={checkShowForm.toBookCode}
              // className={checkRequired && checkRequired.toBookCode && checkRequired.toBookCode === true ? "CustomRequiredLetter" : 'CustomIconRequired'}
              />
            </Grid>
            <Grid item md={6}>
              <CustomDatePicker
                inputVariant="outlined"
                label={'Ngày bắt đầu'}
                format="DD/MM/YYYY"
                value={formData.timeStart}
                name="timeStart"
                onBlur={handleTypeChange}
                margin="dense"
                variant="outlined"
                onChange={e => handleChangeDateValue(null, 'timeStart', moment(e).format('YYYY-MM-DD'))}
                fullWidth
                error={errors && errors.timeStart}
                helperText={errors && errors.timeStart}
                required
                disabled={props.location.state === 'view'}
              // checkedShowForm={checkShowForm.timeStart}
              // minDate={new Date()}
              />
            </Grid>
            <Grid item md={6}>
              <CustomDatePicker
                inputVariant="outlined"
                format="DD/MM/YYYY"
                label={'Ngày kết thúc'}
                value={formData.timeEnd}
                name="timeEnd"
                margin="dense"
                variant="outlined"
                onChange={e => handleChangeDateValue(null, 'timeEnd', moment(e).format('YYYY-MM-DD'))}
                onBlur={handleTypeChange}
                fullWidth
                error={errors && errors.timeEnd}
                helperText={errors && errors.timeEnd}
                required
                disabled={props.location.state === 'view'}
              // checkedShowForm={checkShowForm.timeEnd}
              />
            </Grid>
            <Grid item md={12}>
              <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black' }}>FILE ĐÍNH KÈM</span>
              <label htmlFor="fileUpload" style={{ display: 'inline-block', marginRight: 10 }}>
                <Button color="primary" variant="contained" component="span">
                  <span style={{ fontWeight: 'bold' }}>Tải lên</span>
                </Button>
              </label>
              {/* <label style={{ display: 'inline-block', marginRight: 10 }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setOpenDialogFilter(true);
                  }}
                  component="span"
                >
                  <span style={{ fontWeight: 'bold' }}>Tìm kiếm</span>
                </Button>
              </label> */}
              <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {formData.files && (
                  <FileUpload
                    file={id !== 'add' && checkImportFile.files.length !== 0 ? formData.files.concat(checkImportFile.files) : formData.files}
                    id={'add'}
                    onDeleteFile={handleFileDelete}
                    nameBtn="fileUpload"
                  />
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="control-panel calendar-export" style={{ textAlign: 'right' }}>
                  <Fab
                    onClick={() => {
                      const {allTemplates} = props.dashboardPage;
                      if (allTemplates) {
                        const foundPersonPlanTemplate = allTemplates.find(elm => elm.moduleCode === 'OrganizationPlan');
                        if (foundPersonPlanTemplate) {
                          return PrintContentTable({ content: foundPersonPlanTemplate.content, data: formData, code: 'OrganizationPlan', isClone: false });
                        }
                      }
                      console.log('show notify here')
                    }}
                  >
                    <Tooltip title="IN">
                      <PrintUI />
                    </Tooltip>
                  </Fab>
                </div>
              </div>
              <input onChange={handleFileChange} id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" multiple />
            </Grid>
            <Grid item md={12}>
              {/* Block */}
              <PlanItem
                formData={formData}
                handleChangeValueChild={handleChangeValueChild}
                handleAddWorking={handleAddWorking}
                handleDelete={handleOpenDialogRemove}
                titleTable={'Kết quả trong tuần'}
                nameTable="resultDetail"
                disabled={props.location.state === 'view'}
              />
              <PlanItem
                formData={formData}
                handleChangeValueChild={handleChangeValueChild}
                handleAddWorking={handleAddWorking}
                handleDelete={handleOpenDialogRemove}
                titleTable={'Kế hoạch tuần tới'}
                nameTable="planDetail"
                disabled={props.location.state === 'view'}
              />
            </Grid>
          </Grid>
          {!id ? null : (
            <>
              <Grid item container md={4} style={{ maxHeight: 550, overflow: 'scroll' }}>
                <Comment
                  profile={profile}
                  code={'WorkingCalendar'}
                  id={id}
                  // viewOnly={currentTab !== 0 }
                  viewOnly={false}
                  disableLike
                  revert
                  disabled={props.location.state === 'view'}
                />
              </Grid>
            </>
          )}
        </Grid>

        <RemoveDialog
          title="Đồng chí có muốn xóa công việc này không?"
          openDialogRemove={openDialog}
          handleClose={() => handleCloseDialog()}
          handleDelete={handleDelete}
        />
      </Paper>
      {/* <Dialog dialogAction={false} onClose={closeDialog} open={openDialogFilter}>
        <FilterDocs
          onGet={onGet}
          onSave={onSave}
          // toBookCode={urlParams.get('toBookCode')}
          handleCloseFilter={closeDialog}
          onChangeSnackbar={onChangeSnackbar}
          search={true}
        />
      </Dialog> */}
      {/* <Dialogg dialogAction={false} open={props.addSignedDocument.load}>
        <DialogContent>Đang tải files, đồng chí vui lòng chờ...</DialogContent>
      </Dialogg>
      <Dialog dialogAction={false} onClose={closeDialogTask} open={openDialogTask}>
        <TaskDocs onSave={onSaveTask} handleCloseFilter={closeDialogTask} />
      </Dialog> */}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage()
});
function mapDispatchToProps(dispatch) {
  return {
    // mergeData: data => dispatch(mergeData(data)),
    // onAddExecutiveDocument: (query, cb) => {
    //     dispatch(addExecutiveDocument(query, cb));
    // },
    // onDeleteExecutiveDocument: ids => {
    //     dispatch(deleteExecutiveDocument(ids));
    // },
    // onUpdateExecutiveDocument: (data, cb) => {
    //     dispatch(updateExecutiveDocument(data, cb));
    // },
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
)(AddPlanWorkingOrganization);
