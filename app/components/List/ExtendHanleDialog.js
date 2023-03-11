import React, { useState, useCallback, useEffect } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import moment from 'moment';
import { Dialog as DialogUI } from 'components/LifetekUi';
import CustomDatePicker from '../CustomDatePicker';
import { serialize } from '../../utils/common';
import request from '../../utils/request';
import { API_INCOMMING_DOCUMENT_SET_DEADLINE } from '../../config/urlConfig';
import CustomInputBase from '../Input/CustomInputBase';

function ExtendHanleDialog(props) {
  const { onClose, onChangeSnackbar, item, onSuccess } = props;
  const [localState, setLocalState] = useState({});

  const handleInputChange = (e, _name, _value) => {
    setLocalState({ ...localState, [_name]: _value });
  };

  const onSave = async () => {
    try {
      if (!localState.newDeadline && !moment(localState.newDeadline).isAfter(moment())) {
        onChangeSnackbar({ status: true, message: 'Ngày gia hạn phải sau ngày hiện tại!', variant: 'error' });
        return;
      }
      const res = await request(`${API_INCOMMING_DOCUMENT_SET_DEADLINE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docIds: [item && item.originItem && item.originItem._id],
          deadline: localState.newDeadline,
        }),
      });
      // console.log(res);
      if (res) {
        onChangeSnackbar({ status: true, message: 'Gia hạn xử lý thành công', variant: 'success' });
        if (onSuccess) {
          onSuccess();
        }
      }
      // if (onClose) {
      //   onClose();
      // }
    } catch (error) {
      onChangeSnackbar({ status: true, message: error.message, variant: 'error' });
      // console.log(error);
    }
  };

  useEffect(
    () => {
      const minDate =
        item.originItem && item.originItem.deadline && moment(item.originItem.deadline).isAfter(moment())
          ? moment(item.originItem.deadline).add(1, 'day')
          : moment().add(1, 'day');
      setLocalState({ ...localState, newDeadline: minDate });
    },
    [item.originItem],
  );

  const minDate =
    item.originItem && item.originItem.deadline && moment(item.originItem.deadline).isAfter(moment())
      ? moment(item.originItem.deadline).add(1, 'day')
      : moment().add(1, 'day');
  return (
    <div>
      <Typography variant="h6" component="h2" gutterBottom display="block" style={{ textTransform: 'uppercase' }} align="center">
        Gia hạn xử lý
      </Typography>
      <Grid container spacing={8}>
        <Grid item xs="12" spacing={24} style={{ padding: '0 30px' }}>
          <CustomInputBase
            value={item.originItem && item.originItem.deadline ? moment(item.originItem.deadline).format('DD/MM/YYYY') : null}
            disabled
            label="Thời gian hiện tại"
          />
        </Grid>
        <Grid item xs="12" spacing={24} style={{ padding: '0 30px' }}>
          <CustomDatePicker
            label="Ngày gia hạn"
            value={localState.newDeadline}
            name="newDeadline"
            type="date-time"
            format="DD/MM/YYYY"
            minDate={minDate}
            onChange={e => handleInputChange(e, 'newDeadline', e)}
            autoFocus
          />
        </Grid>
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, paddingRight: 30 }}>
        <Button onClick={onSave} color="primary" variant="outlined">
          Gia hạn
        </Button>
      </div>
    </div>
  );
}

export default ExtendHanleDialog;
