import { FormHelperText, InputLabel, MenuItem, NativeSelect, OutlinedInput, Select } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import React from 'react';
import { useController } from 'react-hook-form';

export function SelectField(props) {
  const { name, control, label, disabled, options, onItemConfig,SelectProps } = props;
  const {
    field: { _id, onChange, onBlur, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });
  return (
    <FormControl  fullWidth size="small" variant="outlined" disabled={disabled} margin="normal" error={invalid}>
      <Select
        native
        labelId={`${name}_label`}
        value={_id}
        onChange={e => {
          console.log('e__',e.target.value)
          onChange(e);
          onItemConfig(e.target.value);
        }}
        onBlur={onBlur}
        label={label}
        input={<OutlinedInput />}
        style={{ height: 40 }}
      >
        <option key="" value={''} style={{textAlign:'center'}}>
          ---CHỌN----
        </option>
        {options &&
          options.map(option => {
             console.log('option_', option)
            return(
            <option key={option._id} value={option._id}>
              {option.title}
            </option>
          )})}
      </Select>
    </FormControl>

    // <FormControl
    //   fullWvalueth
    //   size="small"
    //   variant="outlined"
    //   disabled={disabled}
    //   margin="normal"
    //   component="fieldset"
    //   error={invalid}
    // >
    //   <InputLabel id={`${name}_label`}>{label}</InputLabel>
    //   <Select
    //     labelId={`${name}_label`}
    //     value={value}
    //     onChange={(e)=>{onChange(e)
    //       onItemConfig(e.target.value)
    //     }}
    //     onBlur={onBlur}
    //     label={label}
    //   >
    //     {options &&
    //       options.map(option => (
    //         <option key={option.value}
    //         value={option.value}>
    //           {option.label}
    //         </option>
    //       ))}
    //   </Select>
    //   <FormHelperText>{error && error.message}</FormHelperText>
    // </FormControl>
  );
}
