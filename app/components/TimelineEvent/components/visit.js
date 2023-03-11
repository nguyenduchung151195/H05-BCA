import React from 'react';
import { Grid, TextField, Button, InputAdornment, IconButton, Checkbox, MenuItem } from '@material-ui/core';
import { Delete, CloudDownload } from '@material-ui/icons';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { DateTimePicker } from 'material-ui-pickers';
import moment from 'moment';
import { API_USERS, UPLOAD_IMG_SINGLE } from '../../../config/urlConfig';
import { serialize } from '../../../utils/common';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { makeSelectProfile } from '../../../containers/Dashboard/selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { AsyncAutocomplete } from '../../LifetekUi';

const promiseOptions = (searchString, putBack) => {
  const param = {
    limit: '10',
    skip: '0',
  };
  if (searchString !== '') {
    param.filter = {
      name: {
        $regex: searchString,
        $options: 'gi',
      },
    };
  }
  const token = localStorage.getItem('token');
  axios
    .get(`${API_USERS}?${serialize(param)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const convertedData = [];
      response.data.data.map(item => convertedData.push({ ...item, ...{ label: item.name, value: item._id } }));
      putBack(convertedData);
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      //console.log(err);
    });
};
const customStyles = {
  menu: base => ({
    ...base,
    backgroundColor: 'white',
    zIndex: '2!important',
  }),
  menuList: base => ({
    ...base,
    backgroundColor: 'white',
    zIndex: '2!important',
  }),
};

export class Visit extends React.Component {
  state = {
    visit: {
      businessName: '',
      address: '',
      people: [],
      pointOfContact: '',
      purpose: '',
      file: undefined,
      result: '',
      isFinished: false,
      isImportant: false,
      timeNotification: undefined,
      startTime: new Date(),
      endTime: new Date(),
    },
    reminderBefore: {
      enable: false,
      value: 0,
      unit: 'minutes',
    },
  };

  componentWillReceiveProps(props) {
    if (props.visitDetail) {
      this.state.visit = props.visitDetail;
      this.state.visit.people = this.state.visit.people.map(person => ({
        ...person,
        ...{ label: person.name, value: person.employeeId },
      }));
      if (props.visitDetail.timeNotification) {
        this.state.reminderBefore.enable = true;
        const startTime = moment(props.visitDetail.startTime);
        this.state.reminderBefore.value = moment.duration(startTime.diff(moment(props.visitDetail.timeNotification))).asMinutes();
        this.state.reminderBefore.unit = 'minutes';
      }
    }
    this.setState({ visit: { people: [this.props.profile] } })
  }

  componentDidMount() {
    this.setState({ visit: { people: [this.props.profile] } })
  }

  handleChangeSelect = (selectedOption, key) => {
    const { visit } = this.state;
    visit[key] = selectedOption;
    this.setState({ visit });
  };

  handleCreateVisit = () => {
    const { visit, reminderBefore } = this.state;
    const newVisit = Object.assign({}, visit);
    newVisit.link = `${this.props.path}/${this.props.generalData._id}`;
    newVisit.from = this.props.generalData._id;
    newVisit.people = newVisit.people.map(item => ({
      name: item.name,
      employeeId: item._id,
    }));
    if (reminderBefore.enable) {
      newVisit.timeNotification = moment(visit.startTime).subtract(reminderBefore.value, reminderBefore.unit);
    }
    if (visit.businessName.trim() === '') {
      this.props.onChangeSnackbar({ status: true, message: 'Tên doang nghiệp không được để trống!', variant: 'error' });
      return;
    }
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
          newVisit.file = success.url;
          this.props.onCreateVisit(newVisit, this.props.generalData._id);
        })
        .catch(error => {
          // eslint-disable-next-line no-alert
          alert(error);
        });
    } else {
      this.props.onCreateVisit(newVisit, this.props.generalData._id);
    }
    this.clearInput();
  };

  clearInput = () => {
    this.setState({
      visit: {
        businessName: '',
        address: '',
        people: [],
        pointOfContact: '',
        purpose: '',
        file: undefined,
        result: '',
        isFinished: false,
        isImportant: false,
        isRemindBefore: false,
        timeNotification: undefined,
        startTime: new Date(),
        endTime: new Date(),
      },
      reminderBefore: {
        enable: false,
        value: 0,
        unit: 'minutes',
      },
    });
  };

  render() {
    const { visit, reminderBefore } = this.state;
    return (
      <div style={{ marginBottom: 100 }}>
        <Grid container>
          <Grid item sm={12} lg={6} className="px-2 my-1">
            <DateTimePicker
              fullWidth
              disablePast
              keyboard
              variant="outlined"
              disableOpenOnEnter
              keyboardIcon={<i className="far fa-clock fa-xs" />}
              label="Thời gian bắt đầu"
              value={visit.startTime}
              onChange={event => {
                const { visit } = this.state;
                visit.startTime = event;
                this.setState({ visit });
              }}
              format="DD/MM/YYYY HH:mm"
            />
          </Grid>
          <Grid item sm={12} lg={6} className="px-2 my-1">
            <DateTimePicker
              fullWidth
              disablePast
              keyboard
              variant="outlined"
              disableOpenOnEnter
              keyboardIcon={<i className="far fa-clock fa-xs" />}
              label="Thời gian kết thúc"
              onChange={event => {
                const { visit } = this.state;
                if (event <= visit.startTime) {
                  visit.endTime = visit.startTime;
                  this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc không được nhỏ hơn bắt đầu!', variant: 'error' });
                } else {
                  visit.endTime = event;
                }
                this.setState({ visit });
              }}
              value={visit.endTime}
              format="DD/MM/YYYY HH:mm"
            />
          </Grid>
          <Grid item sm={4} className="px-2 my-1">
            <Checkbox
              checked={visit.isFinished}
              onChange={event => {
                visit.isFinished = event.target.checked;
                this.setState({ visit });
              }}
              value="isFinished"
            />
            <span> Đã hoàn thành </span>
          </Grid>
          <Grid item sm={4} className="px-2 my-1">
            <Checkbox
              checked={visit.isImportant}
              onChange={event => {
                visit.isImportant = event.target.checked;
                this.setState({ visit });
              }}
              value="isImportant"
              label="Quan trọng"
            />
            <span> Quan trọng </span>
          </Grid>
          <Grid item sm={4} className="px-2 my-1">
            <Checkbox
              checked={reminderBefore.enable}
              onChange={event => {
                reminderBefore.enable = event.target.checked;
                this.setState({ reminderBefore });
              }}
              value="isRemindBefore"
              label="Nhắc trước"
            />
            <span> Nhắc trước </span>
          </Grid>
          {reminderBefore.enable ? (
            <Grid item sm={12} lg={12} className="px-2 my-1">
              <p>Nhắc nhở trong: </p>
            </Grid>
          ) : (
            ''
          )}

          {reminderBefore.enable ? (
            <Grid item sm={12} lg={6} className="px-2 my-1">
              <TextField
                variant="outlined"
                fullWidth
                type="number"
                label="Thời gian"
                value={reminderBefore.value}
                onChange={event => {
                  reminderBefore.value = event.target.value;
                  this.setState({ reminderBefore });
                }}
              />
            </Grid>
          ) : (
            ''
          )}
          {reminderBefore.enable ? (
            <Grid item sm={12} lg={6} className="px-2 my-1">
              <TextField
                variant="outlined"
                fullWidth
                select
                label="Đơn vị"
                value={reminderBefore.unit}
                onChange={event => {
                  reminderBefore.unit = event.target.value;
                  this.setState({ reminderBefore });
                }}
              >
                <MenuItem value="minutes">Phút</MenuItem>
                <MenuItem value="hours">Giờ</MenuItem>
              </TextField>
            </Grid>
          ) : (
            ''
          )}
          <Grid item sm={12} lg={6} className="px-2 my-1">
            <TextField
              variant="outlined"
              fullWidth
              label="Tên doanh nghiệp"
              value={visit.businessName}
              onChange={event => {
                visit.businessName = event.target.value;
                this.setState({ visit });
              }}
            />
          </Grid>
          <Grid item sm={12} lg={6} className="px-2 my-1">
            <TextField
              variant="outlined"
              fullWidth
              label="Địa điểm"
              value={visit.address}
              onChange={event => {
                visit.address = event.target.value;
                this.setState({ visit });
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12} className="px-2 my-1">
            {/* {console.log(visit.people,'visit.people')}  */}
            {/* <AsyncSelect
              onChange={selectedOption => {
                this.handleChangeSelect(selectedOption, 'people');
              }}
              placeholder="Người tham gia"
              styles={customStyles}
              defaultOptions
              value={visit.people}
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
            <AsyncAutocomplete
              name="Chọn..."
              label="Nguoi tham gia"
              onChange={selectedOption => {
                this.handleChangeSelect(selectedOption, 'people');
              }}
              url={`${API_USERS}`}
              value={visit.people}
              isMulti
              placeholder="Người tham gia"
            // error={localMessages && localMessages.people}
            // helperText={localMessages && localMessages.people}
            // required={checkRequired.people}
            // checkedShowForm={checkShowForm.people}
            />
          </Grid>
          <Grid item sm={12} lg={12} className="px-2 my-1">
            <TextField
              variant="outlined"
              fullWidth
              label="Đầu mối liên hệ"
              value={visit.pointOfContact}
              onChange={event => {
                visit.pointOfContact = event.target.value;
                this.setState({ visit });
              }}
            />
          </Grid>
          <Grid item sm={12} className="px-2 my-1 ">
            {visit.file !== undefined ? (
              <TextField
                id="outlined-adornment-password"
                variant="outlined"
                label="Tệp đính kèm"
                value={visit.file}
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
                          window.open(visit.file);
                        }}
                      >
                        <CloudDownload />
                      </IconButton>
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() => {
                          visit.file = undefined;
                          this.setState({ visit });
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
                value={visit.file}
                onChange={event => {
                  const { visit } = this.state;
                  visit.file = event.target.value;
                  this.meetingFile = event.target.files[0];
                  this.setState({ visit });
                }}
                margin="normal"
                variant="outlined"
              />
            )}
          </Grid>
          <Grid item sm={12} lg={12} className="px-2 my-1">
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              label="Mục đích"
              value={visit.purpose}
              onChange={event => {
                visit.purpose = event.target.value;
                this.setState({ visit });
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12} className="px-2 my-1">
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              label="Kết quả"
              value={visit.result}
              onChange={event => {
                visit.result = event.target.value;
                this.setState({ visit });
              }}
            />
          </Grid>
          <Grid item sm={12} className="my-1 text-right ">
            <Button
              onClick={() => {
                this.handleCreateVisit();
              }}
              variant="contained"
              color="primary"
              className="mx-1"
            >
              Lưu
              {/* {this.props.isEditting ? 'Chỉnh sửa lịch cá nhân' : 'Tạo lịch cá nhân'} */}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className="mx-1"
              onClick={() => {
                this.clearInput();
              }}
            >
              Huỷ
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
Visit.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});



const withConnect = connect(
  mapStateToProps,
);


export default compose(
  withConnect,
)(Visit);
