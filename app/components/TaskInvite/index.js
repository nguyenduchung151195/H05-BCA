/**
 *
 * TaskInvite
 *
 */

import React, { useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Avatar, Typography } from '@material-ui/core';
import { Dialog, TextField } from '../LifetekUi';
import { fetchData, serialize } from '../../helper';
import { API_TASK_PROJECT } from '../../config/urlConfig';

import Snackbar from '../Snackbar';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
const arrType = ['Người tham gia', 'Xử lý chính', 'Phối hợp xử lý'];
function TaskInvite(props) {
  const [limit, setLimit] = React.useState(10);
  const [data, setData] = React.useState([]);
  const [snackbar, setSnackbar] = React.useState({ open: false, variant: 'success', message: '' });
  const [state, setState] = React.useState({ dialog: false, id: null, reason: '' });

  async function getData() {
    const query = serialize({ limit: { limit }, filterUser: true });
    try {
      const respon = await fetchData(`${API_TASK_PROJECT}/invite?${query}`);
      setData(respon.data);
    } catch (error) {
      setSnackbar({ open: true, variant: 'error', message: 'Lấy dữ liệu thất bại' });
    }
  }

  async function replyInvite(id, isAccept) {
    try {
      await fetchData(`${API_TASK_PROJECT}/invite`, 'POST', {
        id,
        isAccept,
        reason: state.reason,
      });
      getData();
      setSnackbar({ open: true, variant: 'success', message: 'Cập nhật thành công' });
    } catch (error) {
      setSnackbar({ open: true, variant: 'error', message: 'Cập nhật không thành công' });
    }
  }

  useEffect(
    () => {
      getData();
    },
    [limit],
  );

  function refuseInvite() {
    if (state.reason.trim()) {
      setState({ ...state, dialog: false });
      replyInvite(state.id, false);
    }
  }

  const onClickRow = (e, id) => {
    e.preventDefault()

    props.history.push(`task-detail/${id}`);

  }

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên công việc</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Người mời</TableCell>
            <TableCell>Nội dung công việc</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(i => (
            <TableRow style={{cursor: 'pointer'}} onClick={e => onClickRow(e, i.taskId._id)}>
              <TableCell>{i.taskId && i.taskId.name}</TableCell>
              <TableCell>{arrType[i.type * 1 - 1]}</TableCell>
              <TableCell>
              {i.taskId && i.taskId.createdBy &&  i.taskId.createdBy.name}
              </TableCell>
              <TableCell>{i.taskId && i.taskId.description}</TableCell>
              <TableCell>
                <Button onClick={() => replyInvite(i._id, true)} color="primary" variant="contained" style={{marginRight: 10}} >
                  Đồng ý
                </Button>
                <Button onClick={() => setState({ dialog: true, id: i._id, reason: '' })} color="secondary" variant="contained">
                  Từ chối
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog saveText="Gửi" onSave={refuseInvite} maxWidth="sm" onClose={() => setState({ ...state, dialog: false })} open={state.dialog}>
        <Typography>Nhập lý do </Typography>
        <TextField
          helperText={state.reason.trim() ? null : 'Không được bỏ trống'}
          error={!state.reason.trim()}
          onChange={e => setState({ ...state, reason: e.target.value })}
          value={state.reason}
          multiline
          rows={3}
        />
      </Dialog>
      <Button style={{ float: 'right' }} color="primary" onClick={() => setLimit(limit + 10)}>
        Xem thêm
      </Button>
      <Snackbar
        onClose={() => setSnackbar({ open: false, variant: 'success', message: '' })}
        message={snackbar.message}
        open={snackbar.open}
        variant={snackbar.variant}
      />
    </div>
  );
}

TaskInvite.propTypes = {};

export default TaskInvite;
