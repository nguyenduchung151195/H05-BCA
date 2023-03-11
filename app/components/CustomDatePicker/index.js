import React, { memo, useEffect, useState } from 'react';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import TodayIcon from '@material-ui/icons/Today';
import "moment/locale/vi";

function CustomDatePicker(props) {
  const {
    value,
    label,
    type,
    name,
    format,
    allowRemove = true,
    onBlur,
    error,
    helperText,
    isFuture = false,
    isUpdate = false,
    isTimeJoin = false,
    isAddExe = false,
    clone = false,
    sendAllData,
    ...restProps
  } = props;
  const getMinDate = () => {
    if (clone) {
      return moment("01/01/1900");
    }
    else if (isAddExe || !isUpdate) {
      if (name === 'deadline' || name === 'dob') {
        return moment().add(-122, 'year');
      } else {
        return moment().add(-3, 'year');
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
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} >
      <DatePicker
        onInputChange={e => {
          console.log("jnjdnsj: ", e.target.value);
          // props.onBlur && moment(e.target.value, 'DD/MM/YYYY').isValid() && props.onBlur(e.target.value, name);
          if (props.onBlur && moment(e.target.value, 'DD/MM/YYYY').isValid()) {
            props.onBlur(e.target.value, name)
          } else if (sendAllData && props.onBlur) {
            props.onBlur && props.onBlur(e.target.value, name)
          }
          else {
            props.onBlur && props.onBlur("", name)
          }

          // (allowRemove && !e.target.value && props.onChange && props.onChange(null))   ||
          props.allowRemove2 && !e.target.value && props.onChange && props.onChange(null);
          // console.log("sss: ", e)
        }}
        invalidLabel="DD/MM/YYYY"
        invalidDateMessage={isFuture || isUpdate ? '' : ' Định dạng không hợp lệ'}
        maxDateMessage="Thời gian không hợp lệ"
        minDateMessage={name === 'deadline' ? 'Hạn xử lý không được chọn ngày quá khứ' : isUpdate ? '' : isTimeJoin ? `${label} phải lớn hơn hoặc bằng ngày hiện tại` : 'Thời gian không hợp lệ'}
        maxDate={getMaxDate()}
        minDate={isUpdate ? moment().subtract(3, 'years') : getMinDate()}
        autoOk={true}
        placeholder={'__/__/____'}
        keyboard
        keyboardIcon={<TodayIcon style={{ width: '80%', color: 'black' }} />}
        KeyboardButtonProps={{
          style: {
            marginRight: -10,
          },
        }}
        mask={value => (value ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : [])}
        inputVariant="outlined"
        format="DD/MM/YYYY"
        variant="outlined"
        margin="dense"
        required
        fullWidth
        cancelLabel="Hủy bỏ"
        okLabel="Đồng ý"
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
  );
}
export default memo(CustomDatePicker);
