/* eslint-disable react/no-typos */
//
import React, { memo } from 'react';
import { TextField, InputAdornment, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  input: {
    color: 'rgba(0, 0, 0, 0.87) !important',
  },
}));

function CustomTextField(props) {
  const { endIcon, startIcon, value, onChange, readOnly, helperText, defaultValue, maxLength, type, ...rest } = props;
  const classes = useStyles();
  const trimStartValue = e => {
    if (onChange) {
      onChange(e);
      // // phoneNumber
      // if (e && e.target && typeof e.target.value === "string") {
      //     if (e.target.value.trimStart) {
      //         e.target.value = e.target.value.trimStart();
      //     }
      //     e.target.value = e.target.value.replace(/\S(?=\s)/g, '');
      //     if (type === "phoneNumber" && e.target.value.length) {

      //         let newVal = e.target.value;
      //         // if (newVal.length === 1 && !VALID_SECOND_CHAR_PHONE_NUMBER.find(v => v.currentChar === newVal[0])) {
      //         //     return;
      //         // }
      //         if (!VALID_SECOND_CHAR_PHONE_NUMBER.find(v => v.currentChar === newVal[0])) {
      //             return;
      //         }
      //         if (newVal.length === 2) {
      //             const foundValidSecondChar = VALID_SECOND_CHAR_PHONE_NUMBER.find(v => v.currentChar === newVal[0]);
      //             if (foundValidSecondChar && foundValidSecondChar.nextChar && foundValidSecondChar.nextChar.findIndex(n => n === newVal[1]) === -1) return;
      //         }   else if (newVal.length > 2) {
      //             const foundValidSecondChar = VALID_SECOND_CHAR_PHONE_NUMBER.find(v => v.currentChar === newVal[0]);
      //             if (foundValidSecondChar && foundValidSecondChar.nextChar && foundValidSecondChar.nextChar.findIndex(n => n === newVal[1]) === -1) return;
      //         }
      //         // if (newVal.length === 2) {

      //         // }
      //         newVal = newVal.replace(/\D/g, '');
      //         // console.log('newVal[0]', newVal[0]);
      //         if (`${newVal[0]}` === '2' && newVal.length > 10) return;
      //         if (`${newVal[0]}` === '2' && newVal.length > 9) return;
      //         e.target.value = newVal;
      //     }   else if (type === 'number'){

      //     }   else if (type === 'number'){

      //     }   else if (type === 'number'){

      //     }   else if (type === 'number'){

      //     }
      //     if (e.target.value) {
      //         const len = parseInt(maxLength, 10);
      //         if (len && e.target.value.length > len) return;
      //     }

      // }
      // onChange(e);
    }
  };
  const inputClasses = readOnly ? classes.input : null;
  return (
    <TextField
      helperText={helperText}
      InputProps={{
        className: inputClasses,
        endAdornment: endIcon && <InputAdornment position="end">{endIcon}</InputAdornment>,
        startAdornment: startIcon && <InputAdornment position="start">{startIcon}</InputAdornment>,
      }}
      disabled={readOnly}
      value={value}
      onChange={trimStartValue}
      defaultValue={defaultValue}
      // type={type}
      {...rest}
    />
  );
}

CustomTextField.defaultProps = {
  variant: 'outlined',
  margin: 'dense',
  size: 'small',
  fullWidth: true,
  value: '',
  readOnly: false,
};

CustomTextField.PropTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func,
  margin: PropTypes.string,
  variant: PropTypes.string,
  startIcon: PropTypes.object,
  endIcon: PropTypes.object,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  readOnly: PropTypes.bool,
};
export default memo(CustomTextField);
