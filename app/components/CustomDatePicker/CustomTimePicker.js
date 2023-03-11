import React, { memo, useEffect, useState } from 'react';
import { MuiPickersUtilsProvider, DatePicker,TimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment'
import TodayIcon from '@material-ui/icons/Today';

function CustomTimePicker(props) {
  const { value, label, type, name, format, allowRemove = true, onBlur, error, helperText, isFuture = false, isUpdate = false, isAddExe = false, ...restProps } = props;
  const getMinDate = () => {
    if (isAddExe) {
      if (name === 'deadline') {
        return moment();
      }
    }
  }
  const getMaxDate = () => {
    if (isAddExe) {
      if (name === 'deadline') {
        return moment().add(3, 'year');
      }
      if (name !== 'deadline') {
        return moment();
      }
    }
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale="vi-VN">
      
      <TimePicker
        onInputChange={e =>
            props.onBlur  && moment(e.target.value, 'hh:mm').isValid() && props.onBlur(e.target.value, name)
          // (allowRemove && !e.target.value && props.onChange && props.onChange(null))   ||
        }
        invalidLabel="hh:ss"
        invalidDateMessage={(isFuture || isUpdate) ? '' : "Định dạng không hợp lệ"}
        maxDateMessage="Thời gian không hợp lệ"
        minDateMessage="Thời gian không hợp lệ"
        // maxDate={getMaxDate()}
        // minDate={getMinDate()}
        autoOk={true}
        placeholder={"__:__-__:__"}
        keyboard
        keyboardIcon={false}
        readOnly
        // keyboardIcon={<TodayIcon style={{ width: "80%", color: "black" }} />}
        // KeyboardButtonProps={{
        //   style: {
        //     marginRight: -10
        //   }
        // }}
        mask={value =>
          value
            ? [/\d/, /\d/, ":", /\d/, /\d/, "-", /\d/, /\d/,":",/\d/, /\d/]
            : []
        }
        inputVariant="outlined"
        format="hh:mm-hh:mm"
        variant="outlined"
        margin="dense"
        
        fullWidth

        label={label}
        value={value ? value : null}
        {...(error ? { error } : {})}
        {...(helperText ? { helperText } : {})}
        {...restProps}
      />
      {/* // <DatePicker
      //     invalidLabel="DD/MM/YYYY"
      //     // invalidDateMessage="Nhập ngày"
      //     inputVariant="outlined"
      //     format={"DD/MM/YYYY"}
      //     variant="outlined"
      //     margin="dense"
      //     required
      //     fullWidth
      //     label={label}
      //     value={value}
      //     {...restProps}
      //   /> */}
    </MuiPickersUtilsProvider>
  )
}
export default memo(CustomTimePicker)