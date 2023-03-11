import React from 'react';
import { withStyles } from '@material-ui/core';
import { TextValidator as Validator } from 'react-material-ui-form-validator';

const styles = theme => ({
  root: {
    // padding: `0px ${theme.spacing.unit}0px `,
    margin: `${theme.spacing.unit}px 0px`,
  },
});

export default withStyles(styles)(({ classes, variant, ...rest }) => (
  <Validator margin="dense" className={classes.root} variant={variant || 'outlined'} {...rest} />
));
