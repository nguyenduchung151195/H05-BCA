import React from 'react';
import { Button } from '@material-ui/core';

function CustomButton(props) {
  const { variant, ...restProps } = props;

  return (
    <Button variant="contained" {...restProps} />
  );
}
export default CustomButton;
