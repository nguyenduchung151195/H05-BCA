// import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
// import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    padding: `${theme.spacing.unit}px 0px `,
    margin: `${theme.spacing.unit * 0.5}px ${theme.spacing.unit}px`,
  },
});

export default withStyles(styles)(Typography);
