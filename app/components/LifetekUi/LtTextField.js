import React from 'react';
import { TextField, withStyles } from '@material-ui/core';
// import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    // padding: `0px ${theme.spacing.unit}0px `,
    margin: `${theme.spacing.unit}px 0px`,
  },
});

function LtTextField(props) {
  return <TextField
   {...props} />;
}
export default withStyles(styles)(LtTextField);
LtTextField.defaultProps = {
  variant: 'outlined',
  margin: 'dense',
};
