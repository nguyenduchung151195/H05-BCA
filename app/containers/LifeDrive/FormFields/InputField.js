import { TextField } from '@material-ui/core';
import React from 'react';
import { useController } from 'react-hook-form';

export function InputField(props) {
  const { name, control, label, style,InputProps, ...inputProps } = props;
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });
  return (
    <TextField
      style={style}
      fullWidth
      size="small"
      margin="normal"
      value={value}
      // label={label}
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
      error={invalid}
      helperText={error && error.message}
      variant="outlined"
      InputProps={InputProps}
      inputProps={inputProps}
      placeholder={label}
    />
  );
}
