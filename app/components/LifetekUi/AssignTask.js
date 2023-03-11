/* eslint-disable no-console */
import React from 'react';
import { TextField, AsyncAutocomplete } from 'components/LifetekUi';
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import { Button, MenuItem, Checkbox } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { API_USERS, API_TASK_PROJECT, UPLOAD_IMG_SINGLE } from '../../config/urlConfig';
// import { getDatetimeLocal } from '../../helper';
import { priorityArr } from '../../variable';
import { fetchData } from '../../helper';
import { clearWidthSpace } from '../../utils/common';

export default class AssignTask extends React.Component {
  constructor(props) {
    super(props);
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 1);
    this.state = {
      startDate: new Date(),
      endDate,
      join: [],
      name: '',
      description: '',
      priority: 3,
      file: null,
      parentId: this.props.code === 'Task' ? this.props.id : null,
      errorName: true,
    };
  }

  onSave = async () => {
    const { startDate, endDate, name, join, description, priority, parentId } = this.state;
    // console.log(this.state);
    if (new Date(endDate) - new Date(startDate) < 0) {
      this.props.callbackAssign({ variant: 'error', message: 'Ngày kết thúc phải sau ngày bắt đầu', open: true }, false);
      return;
    }
    if (!name || !startDate || !endDate || !join.length) return;

    const data = {
      taskType: 1,
      taskStatus: 1,
      priority,
      kanbanStatus: 1,
      planerStatus: 1,
      ratio: 100,
      progress: 0,
      isSmallest: true,
      isProject: false,
      source: this.props.code,
      startDate,
      endDate,
      join: join.map(i => i._id),
      name,
      description,
      isObligatory: true,
      parentId,
      sourceData: {
        model: this.props.code,
        objectId: this.props.id,
        objectName: this.props.itemCurrent.name,
      },
    };
    try {
      const allData = [fetchData(API_TASK_PROJECT, 'POST', data)];
      if (this.state.file) allData.push(this.fileUpload());

      Promise.all(allData).then(result => {
        if (this.state.file) {
          fetchData(`${API_TASK_PROJECT}/file/${result[0].data._id}`, 'POST', {
            name: 'Tai lieu giao viec ',
            fileName: this.state.file.name,
            size: 124264,
            originFile: this.state.file.type,
            type: this.state.file.type.includes('image') ? 'image' : 'doc',
            taskId: result[0].data._id,
            description: '',
            url: result[1].url,
          });
        }
      });

      this.props.callbackAssign({ variant: 'success', message: 'Giao việc thành công', open: true });
    } catch (error) {
      // console.log('ERRRR', error);
      this.props.callbackAssign({ variant: 'error', message: 'Lưu dữ liệu thất bại', open: true });
    }
  };

  handleChange = e => {
    e.target.value = clearWidthSpace(e.target.value).trimStart();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeName = e => {
    e.target.value = clearWidthSpace(e.target.value).trimStart();
    e.target.value = e.target.value.replace(/[~!,'"@#$%^&*()-+></]/g, '');
    const rex = /[a-zA-Z0-9_-]+.{4,}/g;
    const errorName = !rex.test(e.target.value);
    this.setState({ [e.target.name]: e.target.value, errorName });
  };

  changeJoin = value => {
    this.setState({ join: value });
  };

  changeDate = name => value => {
    this.setState({ [name]: value });
  };

  setChildTask = e => {
    const checked = e.target.checked;
    const parentId = checked ? this.props.id : null;
    this.setState({ parentId });
  };

  render() {
    const { startDate, endDate, name, join, description, priority, parentId } = this.state;
    return (
      <div>
        <TextField
          error={this.state.errorName}
          value={name}
          helperText={this.state.errorName ? 'Tên ít nhất 5 ký tự và không có khoảng trắng đầu tiên' : null}
          onChange={this.handleChangeName}
          name="name"
          fullWidth
          label="Tên công việc"
        />
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker
            inputVariant="outlined"
            format="DD/MM/YYYY HH:mm"
            helperText={startDate ? null : 'Không được bỏ trống'}
            variant="outlined"
            error={!startDate}
            name="startDate"
            onChange={this.changeDate('startDate')}
            value={startDate}
            label="Ngày bắt đầu"
            margin="dense"
            required
          />
          <DateTimePicker
            inputVariant="outlined"
            format="DD/MM/YYYY HH:mm"
            helperText={startDate ? null : 'Không được bỏ trống'}
            variant="outlined"
            error={!startDate}
            name="startDate"
            onChange={this.changeDate('endDate')}
            value={endDate}
            label="Ngày kết thúc"
            margin="dense"
            required
          />

          {/* <span style={{ float: 'right', display: 'flex', alignItems: 'center', paddingRight: 20 }}>
              <Checkbox onChange={e => this.props.mergeData({ isObligatory: e.target.checked })} color="primary" checked={isObligatory} />
              Bắt buộc tham gia
            </span> */}
        </MuiPickersUtilsProvider>
        <Checkbox color="primary" onChange={this.setChildTask} disabled={this.props.code !== 'Task'} checked={Boolean(parentId)} /> Là công việc con
        <TextField fullWidth select name="priority" value={priority} onChange={this.handleChange} label="Độ ưu tiên">
          {priorityArr.map((it, idx) => (
            <MenuItem value={idx + 1}>{it}</MenuItem>
          ))}
        </TextField>
        <AsyncAutocomplete
          error={join && join.length ? null : true}
          helperText={join && join.length ? null : 'Phải chọn người được giao'}
          value={join}
          isMulti
          onChange={this.changeJoin}
          label="Người được giao"
          url={API_USERS}
        />
        <TextField fullWidth value={description} name="description" onChange={this.handleChange} label="Mô tả" />
        <div>
          <input onChange={this.onChangeFile} style={{ display: 'none' }} id="upload-file-task" type="file" />
          <label htmlFor="upload-file-task">
            <Button color="primary" variant="contained" component="span">
              Tệp đính kèm
            </Button>
          </label>
          {this.state.file ? (
            <p>
              {this.state.file.name}
              <Close onClick={() => this.setState({ file: null })} />
            </p>
          ) : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={this.onSave} disabled={this.state.errorName === true} color="primary" variant="contained">
            Lưu
          </Button>
        </div>
      </div>
    );
  }

  onChangeFile = e => {
    // console.log(e.target.files[0]);

    this.setState({ file: e.target.files[0] });
  };

  fileUpload = async () => {
    const formData = new FormData();
    formData.append('file', this.state.file);

    const file = await fetch(UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    const fileData = await file.json();
    return fileData;
  };
}
