/* eslint-disable no-alert */
import React from 'react';
import { Grid, TextField, Button, InputAdornment, IconButton, Checkbox } from '@material-ui/core';
import { Delete, CloudDownload } from '@material-ui/icons';
// import AsyncSelect from 'react-select/async';
// import axios from 'axios';
import { DatePicker, TimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import AsyncSelect from '../AsyncComponent';
import { UPLOAD_IMG_SINGLE, API_USERS } from '../../config/urlConfig';

export default class Meeting extends React.Component {
  state = {
    meetingData: {
      date: new Date(),
      timeStart: new Date(),
      timeEnd: new Date(),
      name: '',
      createdBy: null,
      people: [],
      organizer: null,
      content: '',
      result: '',
      address: '',
      from: '',
    },
    reminderBefore: undefined,
  };

  componentDidMount() {
    if (this.state.meetingData.createdBy === null) {
      this.state.meetingData.createdBy = {};
      this.state.meetingData.createdBy.label = this.props.profile.name;
      this.state.meetingData.createdBy.value = this.props.profile._id;
    }
  }

  componentWillReceiveProps(props) {
    // console.log(props.meetingDetail);
    if (props.meetingDetail) {
      // console.log(props.meetingDetail);
      this.state.meetingData = props.meetingDetail;
      this.state.meetingData.timeEnd = new Date(this.state.meetingData.timeEnd * 1000);
      this.state.meetingData.timeStart = new Date(this.state.meetingData.timeStart * 1000);
      this.state.meetingData.createdBy.label = this.state.meetingData.createdBy ? this.state.meetingData.createdBy.name : '';
      this.state.meetingData.createdBy.value = this.state.meetingData.createdBy ? this.state.meetingData.createdBy.employeeId : '';
      this.state.meetingData.organizer.label = this.state.meetingData.organizer.name;
      this.state.meetingData.organizer.value = this.state.meetingData.organizer.employeeId;
      this.state.meetingData.people = this.state.meetingData.people.map(person => ({
        ...person,
        ...{ label: person.name, value: person.employeeId },
      }));
    }
    // else {
    //   this.clearInput();
    // }
  }

  handleChangeSelect = (selectedOption, key) => {
    const { meetingData } = this.state;
    meetingData[key] = selectedOption;
    this.setState({ meetingData });
  };

  handleChangeInput = key => event => {
    const { meetingData } = this.state;
    meetingData[key] = event.target.value;
    this.setState(meetingData);
  };

  handleCreateMeeting = () => {
    const { meetingData } = this.state;
    const newMeeting = Object.assign({}, meetingData);
    if (newMeeting.name.trim() === '') {
      this.props.onChangeSnackbar({ status: true, message: 'Tiêu đề buổi họp không được để trống!', variant: 'error' });
      return;
    }
    if (meetingData.timeStart >= meetingData.timeEnd) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngày bắt đầu lớn hơn ngày kết thúc!', variant: 'error' });
      return;
    }
    if (meetingData.organizer === null || meetingData.people === null) {
      this.props.onChangeSnackbar({ status: true, message: 'Người tham gia hoặc người tổ chức trống!', variant: 'error' });
      return;
    }
    if (this.props.documentary && this.props.documentary._id) {
      newMeeting.link = `${this.props.path}/${this.props.documentary._id}`;
      newMeeting.from = this.props.documentary._id;
    } else {
      // newMeeting.link = 'undefined';
      // newMeeting.from = 'undefined';
    }
    newMeeting.timeStart = moment(meetingData.timeStart).unix();
    newMeeting.timeEnd = moment(meetingData.timeEnd).unix();
    newMeeting.createdBy = {
      name: meetingData.createdBy.name || meetingData.createdBy.label,
      employeeId: meetingData.createdBy._id || meetingData.createdBy.value,
    };
    newMeeting.organizer = {
      name: meetingData.organizer.name,
      employeeId: meetingData.organizer._id,
    };
    newMeeting.people = meetingData.people.map(item => ({
      name: item.name,
      employeeId: item._id,
    }));
    if (this.meetingFile) {
      const formData = new FormData();
      formData.append('file', this.meetingFile);
      fetch(UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {},
        body: formData,
      })
        .then(response => response.json())
        .then(success => {
          newMeeting.file = success.url;
          this.props.onCreateMeeting(newMeeting, this.state.reminderBefore);
        })
        .catch(error => {
          alert(error);
        });
    } else {
      this.props.onCreateMeeting(newMeeting, this.state.reminderBefore);
    }
    // this.props.handleClear();
    // this.clearInput();
  };

  clearInput = () => {
    this.setState({
      meetingData: {
        date: new Date(),
        timeStart: new Date(),
        timeEnd: new Date(),
        name: '',
        createdBy: null,
        people: [],
        organizer: null,
        file: undefined,
        content: '',
        result: '',
        address: '',
        from: '',
      },
    });
  };

  handleChangeReminder = event => {
    let { reminderBefore } = this.state;

    if (event.target.checked) {
      reminderBefore = event.target.value;
    } else {
      reminderBefore = undefined;
    }
    this.setState({ reminderBefore });
  };

  render() {
    const { meetingData } = this.state;

    return (
      <div className="p-5">
        <h4>Thông tin Lịch cá nhân</h4>{' '}
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container>
            <Grid item sm={12} lg={4} className="my-1 pr-lg-2">
              <DatePicker
                fullWidth
                variant="outlined"
                keyboard
                className="my-0"
                margin="normal"
                label="Ngày họp"
                value={meetingData.date}
                onChange={event => {
                  const { meetingData } = this.state;
                  meetingData.date = event;
                  this.setState(meetingData);
                }}
                disablePast
              />
            </Grid>
            <Grid item sm={6} lg={4} className="my-1 px-lg-2">
              <TimePicker
                fullWidth
                variant="outlined"
                keyboard
                keyboardIcon={<i className="far fa-clock fa-xs" />}
                className="picker2"
                label="Thời gian bắt đầu"
                value={meetingData.timeStart}
                onChange={event => {
                  const { meetingData } = this.state;
                  if (meetingData._id) {
                    meetingData.timeStart = event;
                    this.setState(meetingData);
                  } else if (event >= new Date()) {
                    meetingData.timeStart = event;
                    this.setState(meetingData);
                  } else {
                    this.props.onChangeSnackbar({ status: true, message: 'Thời gian bắt đầu không được nhỏ hơn hiện tại!', variant: 'error' });
                  }
                }}
                disableOpenOnEnter
              // disablePast
              />
            </Grid>
            <Grid sm={6} lg={4} className="my-1 pl-lg-2">
              <TimePicker
                fullWidth
                variant="outlined"
                keyboard
                className="picker "
                label="Thời gian kết thúc"
                value={meetingData.timeEnd}
                onChange={event => {
                  const { meetingData } = this.state;
                  if (event <= meetingData.timeStart) {
                    meetingData.timeEnd = meetingData.timeStart;
                    this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc không được nhỏ hơn bắt đầu!', variant: 'error' });
                  } else {
                    meetingData.timeEnd = event;
                  }
                  this.setState(meetingData);
                }}
                disableOpenOnEnter
                // disablePast
                keyboardIcon={<i className="far fa-clock fa-xs" />}
              />
            </Grid>
            <Grid item sm={12} lg={6} className="my-1 pr-3">
              <TextField
                fullWidth
                id="outlined-name"
                label="Tiêu đề buổi họp"
                className=""
                value={meetingData.name}
                onChange={this.handleChangeInput('name')}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item sm={12} lg={6} className="my-1 pl-3">
              <TextField
                fullWidth
                id="outlined-name"
                label="Địa điểm"
                className=""
                value={meetingData.address}
                onChange={this.handleChangeInput('address')}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid sm="12" className="my-2">
              <AsyncSelect
                onChange={value => {
                  this.handleChangeSelect(value, 'people');
                }}
                value={meetingData.people}
                placeholder="Người tham gia"
                API={API_USERS}
                modelName="Employee"
                isMulti
              />
              {/* <AsyncSelect
                onChange={selectedOption => {
                  this.handleChangeSelect(selectedOption, 'people');
                }}
                placeholder="Người tham gia"
                styles={customStyles}
                defaultOptions
                value={meetingData.people}
                isMulti
                loadOptions={(inputValue, callback) => {
                  clearTimeout(this.people);
                  this.people = setTimeout(() => {
                    promiseOptions(inputValue, callback);
                  }, 1000);
                }}
                theme={theme => ({
                  ...theme,
                  spacing: {
                    ...theme.spacing,
                    controlHeight: '55px',
                  },
                })}
              /> */}
            </Grid>
            <Grid sm="12" className="my-2">
              <AsyncSelect
                onChange={value => {
                  this.handleChangeSelect(value, 'createdBy');
                }}
                value={meetingData.createdBy}
                placeholder="Người tạo"
                API={API_USERS}
                modelName="Employee"
              />
            </Grid>
            <Grid sm="12" className="my-2">
              <AsyncSelect
                onChange={value => {
                  this.handleChangeSelect(value, 'organizer');
                }}
                value={meetingData.organizer}
                placeholder="Người tổ chức"
                API={API_USERS}
                modelName="Employee"
              />
            </Grid>
            <Grid item sm={12} className="my-1 ">
              {meetingData.file !== undefined ? (
                <TextField
                  id="outlined-adornment-password"
                  variant="outlined"
                  label="Tệp đính kèm"
                  value={meetingData.file}
                  fullWidth
                  className="my-2"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={() => {
                            window.open(meetingData.file);
                          }}
                        >
                          <CloudDownload />
                        </IconButton>
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={() => {
                            meetingData.file = undefined;
                            this.setState({ meetingData });
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  id="outlined-name"
                  label="Tệp đính kèm"
                  className=""
                  type="file"
                  value={meetingData.file}
                  onChange={event => {
                    const { meetingData } = this.state;
                    meetingData.file = event.target.value;

                    this.meetingFile = event.target.files[0];
                    this.setState({ meetingData });
                  }}
                  margin="normal"
                  variant="outlined"
                />
              )}
            </Grid>
            <Grid item sm={12} className="my-1 ">
              <TextField
                multiline
                rows={4}
                fullWidth
                id="outlined-name"
                label="Nội dung"
                className=""
                value={meetingData.content}
                onChange={this.handleChangeInput('content')}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item sm={3}>
              Nhắc trước
            </Grid>
            <Grid item sm={3}>
              <Checkbox checked={this.state.reminderBefore === '1 day'} onChange={this.handleChangeReminder} value="1 day" color="primary" />
              <span>Nhắc trước 1 ngày</span>
            </Grid>
            <Grid item sm={3}>
              <Checkbox checked={this.state.reminderBefore === '1 hour'} onChange={this.handleChangeReminder} value="1 hour" color="primary" />
              <span>Nhắc trước 1 giờ</span>
            </Grid>
            <Grid item sm={3}>
              <Checkbox checked={this.state.reminderBefore === '30 mins'} onChange={this.handleChangeReminder} value="30 mins" color="primary" />
              <span>Nhắc trước 30 phút</span>
            </Grid>
            <Grid item sm={12} className="my-1 text-right ">
              <Button
                onClick={() => {
                  this.handleCreateMeeting();
                }}
                variant="outlined"
                color="primary"
                className="mx-1"
              >
                Tạo Lịch cá nhân
                {/* {this.props.isEditting ? 'Chỉnh sửa Lịch cá nhân' : 'Tạo Lịch cá nhân'} */}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className="mx-1"
                onClick={() => {
                  this.clearInput();
                  if (this.props.closeDialog) {
                    this.props.closeDialog();
                  }
                }}
              >
                Huỷ
              </Button>
            </Grid>
          </Grid>{' '}
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}
