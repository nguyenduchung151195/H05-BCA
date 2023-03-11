/**
 *
 * TaskProgress
 *
 */

import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Avatar, Typography } from '@material-ui/core';
import { Dialog, TextField } from '../LifetekUi';
import { serialize, fetchData } from '../../helper';
import { API_TASK_PROJECT } from '../../config/urlConfig';
import Snackbar from '../Snackbar';

// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class TaskProgress extends React.Component {
  state = {
    dialog: false,
    open: false,
    variant: 'success',
    message: '',
    data: [],
    limit: 10,
    reason: '',
    id: null,
  };

  componentDidMount() {
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack'); 
    localStorage.removeItem('addWorkingScheduleCallback'); 
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');
    this.getData();
  }

  getData = () => {
    const query = serialize({ limit: this.state.limit, filterUser: true });
    fetch(`${API_TASK_PROJECT}/time?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ data: data ? data.data : [] });
      });
  };

  acceptProgress = (id, isAccept) => {
    try {
      // fetch(`${API_TASK_PROJECT}/time`, {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`,
      //   },
      //   body: JSON.stringify({
      //     id,
      //     isAccept,
      //     reason: this.state.reason,
      //   }),
      // });
      fetchData(`${API_TASK_PROJECT}/time`, 'POST', {
        id,
        isAccept,
        reason: this.state.reason,
      });
      this.getData();
      this.setState({ open: true, variant: 'success', message: 'Cập nhật thành công' });
    } catch (error) {
      this.setState({ open: true, variant: 'error', message: 'Cập nhật không thành công' });
    }
  };

  render() {
    const { data, open, variant, message } = this.state;
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên công việc</TableCell>
              <TableCell>Người gửi yêu cầu</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Lý do gửi yêu cầu</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(item => (
              <TableRow>
                <TableCell>{item.taskId.name}</TableCell>
                <TableCell>{item.sender.name}</TableCell>
                <TableCell>
                  <Avatar
                    src={
                      item.sender.avatar
                        ? `${item.sender.avatar}?allowDefault=true`
                        : 'https://vnn-imgs-f.vgcloud.vn/2019/05/03/11/co-gai-khien-hot-girl-tram-anh-bi-lu-mo-vi-qua-xinh-dep-3.jpg'
                    }
                  />
                </TableCell>
                <TableCell>{item.note}</TableCell>
                <TableCell>
                  <Button onClick={() => this.acceptProgress(item._id, true)} color="primary" variant="outlined">
                    Phê duyệt
                  </Button>
                  <Button onClick={() => this.setState({ dialog: true, id: item._id, reason: '' })} color="secondary" variant="outlined">
                    Từ chối
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog saveText="Gửi" onSave={this.refuseInvite} maxWidth="sm" onClose={() => this.setState({ dialog: false })} open={this.state.dialog}>
          <Typography>Nhập lý do </Typography>
          <TextField
            // helperText={this.state.reason.trim() ? null : 'Không được bỏ trống'}
            // error={!this.state.reason.trim()}
            onChange={e => this.setState({ reason: e.target.value })}
            value={this.state.reason}
            multiline
            rows={3}
          />
        </Dialog>
        <Button style={{ float: 'right' }} color="primary" onClick={() => this.setLimit(this.state.limit + 10)}>
          Xem thêm
        </Button>
        <Snackbar onClose={() => this.setState({ open: false, variant: 'success', message: '' })} message={message} open={open} variant={variant} />
      </div>
    );
  }

  refuseInvite = () => {
    if (this.state.reason.trim()) {
      this.setState({ dialog: false });
      this.acceptProgress(this.state.id, false);
    }
  };
}

TaskProgress.propTypes = {};

export default TaskProgress;
