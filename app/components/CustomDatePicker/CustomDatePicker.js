import React, { memo, useEffect, useState } from 'react';
import TodayIcon from '@material-ui/icons/Today';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment'

function CustomDatePicker(props) {
  const { value, label, ...restProps } = props;
  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale="vi-VN">
      <DatePicker
        invalidLabel="DD/MM/YYYY"
        format="DD/MM/YYYY"
        // invalidDateMessage="Nhập ngày"
        autoOk={true}
        keyboard
        keyboardIcon={<TodayIcon />}
        inputVariant="outlined"
        variant="outlined"
        margin="dense"
        required
        fullWidth
        label={label}
        value={value}
        okLabel=""
        cancelLabel=""
        {...restProps}
      />
      {/* <DatePicker
          invalidLabel="DD/MM/YYYY"
          // invalidDateMessage="Nhập ngày"
          inputVariant="outlined"
          format="DD/MM/YYYY"
          variant="outlined"
          margin="dense"
          required
          fullWidth
          label={label}
          value={value}
          {...restProps}
        /> */}
    </MuiPickersUtilsProvider>
  )
}
export default memo(CustomDatePicker)