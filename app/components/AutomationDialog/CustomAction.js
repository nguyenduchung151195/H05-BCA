import React from 'react';
import { Grid, MenuItem } from '@material-ui/core';
import { TextValidator } from 'react-material-ui-form-validator';
import { AsyncAutocomplete } from '../LifetekUi';
import { API_USERS, API_FIELD } from '../../config/urlConfig';
import CircleSelect from '../Filter/CircleSelect';
export const renderActionContent = (
  action,
  listDynamicForms,
  listApproveGroup,
  listMappingConvert,
  actionIndex,
  callBack,
  setState,
  error,
  hasCondition,
) => {
  let fieldCode;
  const newAddtionData = Object.assign({}, action.additionData);
  // console.log(listDynamicForms);
  switch (action.actionType) {
    case 'mail':
      fieldCode = (
        <Grid container>
          <Grid item sm={12}>
            <TextValidator
              key="email"
              onChange={event => {
                newAddtionData.to = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.to}
              label="To *"
              variant="outlined"
              fullWidth
              margin="dense"
              validators={['required', 'isEmail']}
              errorMessages={['Trường bắt buộc', 'Dữ liệu không đúng định dạng Email']}
            />
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              validators={['required', 'isEmail']}
              errorMessages={['Trường bắt buộc', 'Dữ liệu không đúng định dạng Email']}
              onChange={event => {
                newAddtionData.from = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.from}
              label="From *"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              onChange={event => {
                newAddtionData.fields = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.fields}
              label="Các trường trong Module, Cách nhau bởi dấu ,"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              validators={['required', 'whiteSpace']}
              errorMessages={['Trường bắt buộc', 'Subject không hợp lệ']}
              onChange={event => {
                newAddtionData.subject = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.subject}
              label="Subject *"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              onChange={event => {
                newAddtionData.dynamicForm = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              select
              value={action.additionData.dynamicForm}
              label="Biểu mẫu *"
              variant="outlined"
              fullWidth
              margin="dense"
            >
              {listDynamicForms.map(form => (
                <MenuItem key={form._id} value={form._id}>
                  {form.title}
                </MenuItem>
              ))}
            </TextValidator>
          </Grid>
          <Grid item sm={12}>
            <CircleSelect
              value={action.additionData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
            />
          </Grid>
        </Grid>
      );
      break;

    case 'approve': {
      fieldCode = (
        <Grid container>
          <Grid item sm={12}>
            <TextValidator
              validators={['required', 'whiteSpace']}
              errorMessages={['Trường bắt buộc', 'Subject không hợp lệ']}
              onChange={event => {
                newAddtionData.approveName = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.approveName}
              label="Tên yêu cầu phê duyệt *"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              validators={['required', 'whiteSpace']}
              errorMessages={['Trường bắt buộc', 'Subject không hợp lệ']}
              onChange={event => {
                newAddtionData.subCode = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.subCode}
              label="Quy trình *"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              onChange={event => {
                newAddtionData.approveGroup = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              select
              value={action.additionData.approveGroup}
              label="Nhóm phê duyệt *"
              variant="outlined"
              fullWidth
              margin="dense"
            >
              {listApproveGroup
                ? listApproveGroup.map(form => (
                    <MenuItem key={form._id} value={form._id}>
                      {form.name}
                    </MenuItem>
                  ))
                : ''}
            </TextValidator>
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              onChange={event => {
                newAddtionData.dynamicForm = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              select
              value={action.additionData.dynamicForm}
              label="Biểu mẫu *"
              variant="outlined"
              fullWidth
              margin="dense"
            >
              {listDynamicForms.map(form => (
                <MenuItem key={form._id} value={form._id}>
                  {form.title}
                </MenuItem>
              ))}
            </TextValidator>
          </Grid>
          <Grid item sm={12}>
            <TextValidator
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              onChange={event => {
                newAddtionData.convertMapping = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              select
              value={action.additionData.convertMapping}
              label="Kiểu chuyển đổi dữ liệu *"
              variant="outlined"
              fullWidth
              margin="dense"
            >
              {listMappingConvert
                ? listMappingConvert.map(form => (
                    <MenuItem key={form._id} value={form._id}>
                      {form.name}
                    </MenuItem>
                  ))
                : ''}
            </TextValidator>
          </Grid>
          <Grid item sm={12}>
            <CircleSelect
              value={action.additionData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
            />
          </Grid>
        </Grid>
      );
      break;
    }
    case 'notice': {
      fieldCode = (
        <Grid container>
          <Grid item sm={12}>
            <TextValidator
              validators={['required', 'whiteSpace']}
              errorMessages={['Trường bắt buộc', 'Subject không hợp lệ']}
              onChange={event => {
                newAddtionData.noticeTitle = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.noticeTitle}
              label="Nội dung thông báo *"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <AsyncAutocomplete
              isMulti
              onChange={value => {
                newAddtionData.toNotice = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.toNotice}
              url={API_USERS}
            />
            <TextValidator
              onChange={event => {
                newAddtionData.fieldItem = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.fieldItem}
              label="Các trường trong module"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <CircleSelect
              value={action.additionData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
            />
          </Grid>
        </Grid>
      );
      break;
    }
    case 'task': {
      fieldCode = (
        <Grid style={{ paddingBottom: 20 }} container>
          <Grid item sm={12}>
            <TextValidator
              validators={['whiteSpace', 'minStringLength:5']}
              errorMessages={['Tên công việc dự án không hợp lệ', 'Tên công việc dự án ít nhất 5 ký tự']}
              onChange={event => {
                newAddtionData.taskName = event.target.value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.taskName}
              label="Tên công việc án *"
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <AsyncAutocomplete
              isMulti
              label="Người tham gia"
              onChange={value => {
                newAddtionData.join = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.join}
              url={API_USERS}
            />
            <TextValidator
              onChange={event => {
                newAddtionData.startDate = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.startDate || new Date()}
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              label="Ngày bắt đầu"
              variant="outlined"
              fullWidth
              type="date"
              margin="dense"
            />
            <TextValidator
              onChange={event => {
                newAddtionData.endDate = event.target.value;

                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.endDate || new Date()}
              validators={['required']}
              errorMessages={['Trường bắt buộc']}
              label="Ngày kết thúc"
              variant="outlined"
              type="date"
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item sm={12}>
            <CircleSelect
              disabled={hasCondition}
              value={action.additionData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
            />
          </Grid>
        </Grid>
      );
      break;
    }
    case 'field': {
      fieldCode = (
        <Grid container>
          <Grid item sm={12}>
            <AsyncAutocomplete
              label="loại field"
              onChange={value => {
                newAddtionData.fieldId = value;
                setState({
                  error: {},
                });
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
              value={action.additionData.fieldId}
              url={API_FIELD}
              {...error.field && { error: true, helperText: error.field }}
            />
          </Grid>
          <Grid item sm={12} style={{ paddingBottom: 20 }}>
            <CircleSelect
              value={action.additionData.timeCircle}
              onChange={value => {
                newAddtionData.timeCircle = value;
                callBack('addition-data-change', { newAddtionData, actionIndex });
              }}
            />
          </Grid>
        </Grid>
      );
      break;
    }
    default:
      break;
  }
  return fieldCode;
};
