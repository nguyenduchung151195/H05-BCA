import React, { memo, useEffect, useState } from 'react';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import TodayIcon from '@material-ui/icons/Today';
import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

function CustomDatePicker(props) {
  const { value, label, onChange, top, right, required = true, isClear = true, ...restProps } = props;
  function handleClr(e) {
    e.stopPropagation();
    onChange(null);
  }
  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale="vi-VN">
      <div style={{ position: 'relative' }}>
        <DatePicker
          style={{ width: '100%' }}
          invalidLabel="DD/MM/YYYY"
          // invalidDateMessage="Nhập ngày"
          inputVariant="outlined"
          format="DD/MM/YYYY"
          variant="outlined"
          margin="dense"
          placeholder={'DD/MM/YYYY'}
          mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
          required={required}
          fullWidth
          onChange={onChange}
          label={label}
          // value={value ? value : ''}
          value={value}

          // keyboard
          // keyboardIcon={<TodayIcon style={{ width: '85%' }} />}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <IconButton>
                <TodayIcon />
              </IconButton>
            )
          }}
          {...restProps}
        />
        {isClear && value ? (
          <IconButton
            style={{ position: 'absolute', top: top ? top : '9px', right: right ? right : '44px' }}
            edge="end"
            size="small"
            onClick={() => onChange(null)}
          >
            <ClearIcon />
          </IconButton>
        ) : null}
      </div>
    </MuiPickersUtilsProvider>
  );
}
export default memo(CustomDatePicker);
