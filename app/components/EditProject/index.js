/**
 *
 * EditProject
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import { Button } from '@material-ui/core';
import { TextField, AsyncAutocomplete } from 'components/LifetekUi';
import { API_USERS, API_TASK_PROJECT, API_PROFILE } from '../../config/urlConfig';
/* eslint-disable react/prefer-stateless-function */
class EditProject extends React.Component {
  state = {
    project: { isProgress: false },
    profile: {},
  };

  componentDidMount() {
    if (this.props.id)
      fetch(`${API_TASK_PROJECT}/${this.props.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          this.setState({ project: data });
        })
        // eslint-disable-next-line no-alert
        .catch(() => alert('Lấy Cv/Da thất bại'));

    fetch(`${API_PROFILE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ profile: data });
      })
      // eslint-disable-next-line no-alert
      .catch(() => alert('Lấy token thất bại'));
  }

  handleChangeDate = (key, value) => {
    const { project } = this.state;
    project[key] = value;
    this.setState({ project });
  };

  handleChangeStartDate = (key, value) => {
    const { project } = this.state;
    project[key] = value;
    this.setState({ project });
  };

  handleChangeEndDate = (key, value) => {
    const { project } = this.state;
    project[key] = value;
    this.setState({ project });
  };

  handleChangeInput = (name, value) => {
    const { project } = this.state;
    project[name] = value;
    this.setState({ project });
  };

  handleChangeNote = (name, e) => {
    const { project } = this.state;
    project[name] = e.target.value;
    this.setState({ project });
  };

  render() {
    return (
      <div>
        <TextField fullWidth label="Tên CV/DA" value={this.state.project.name} name="name" disabled InputLabelProps={{ shrink: true }} />
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div>
            <DateTimePicker
              style={{ width: '50%', paddingRight: 10 }}
              inputVariant="outlined"
              format="DD/MM/YYYY HH:mm"
              value={this.state.project.startDate}
              variant="outlined"
              label="Thời gian bắt đầu"
              margin="dense"
              required
              disabled={this.state.project.isSmallest ? false : !!this.state.project.projectId}
              onChange={value => this.handleChangeStartDate('startDate', value)}
            />
            <DateTimePicker
              style={{ width: '50%', paddingLeft: 10 }}
              inputVariant="outlined"
              format="DD/MM/YYYY HH:mm"
              required
              label="Thời gian kêt thúc"
              value={this.state.project.endDate}
              name="endDate"
              margin="dense"
              variant="outlined"
              disabled={this.state.project.isSmallest ? false : !!this.state.project.projectId}
              onChange={value => this.handleChangeEndDate('endDate', value)}
            />
          </div>
        </MuiPickersUtilsProvider>
        <AsyncAutocomplete
          name="Chọn người được xem..."
          label="Người phê duyệt tiến độ"
          onChange={value => this.handleChangeInput('approvedProgress', value)}
          url={API_USERS}
          value={this.state.project.approvedProgress}
        />
        <TextField
          multiline
          rows={2}
          fullWidth
          label="Ghi chú"
          name="note"
          value={this.state.project.note}
          onChange={e => this.handleChangeNote('note', e)}
          InputLabelProps={{ shrink: true }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={this.onSaveData} color="primary" variant="contained" style={{ marginRight: 15 }}>
            Lưu
          </Button>
          <Button onClick={this.onClose} color="secondary" variant="contained">
            Hủy
          </Button>
        </div>
      </div>
    );
  }

  onClose = () => {
    this.props.handleCloseEdit();
  };

  onSaveData = () => {
    const { project } = this.state;
    // console.log(project);
    fetch(`${API_TASK_PROJECT}/${this.props.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ ...project, isProgress: false, updatedBy: this.state.profile }),
    })
      .then(response => response.json())
      .then(() => {
        // eslint-disable-next-line no-alert
        // alert('Cập nhật thành công');
        this.props.onChangeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' });
        this.props.handleCloseEdit();
      })
      // eslint-disable-next-line no-alert
      .catch(() => {
        this.props.onChangeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' });
      });
  };
}

EditProject.propTypes = {};

export default EditProject;
