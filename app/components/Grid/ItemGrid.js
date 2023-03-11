import React from 'react';

// material-ui components
import { withStyles, Grid } from '@material-ui/core';

const style = {
  grid: {
    padding: '0 6px !important'
  },
  customLeft: {
    padding: '0 0 0 15px !important',
  },
  customRight: {
    padding: '0 15px 0 0 !important',
  },
};

function ItemGrid({ ...props }) {
  const { classes, children, className, custom, ...rest } = props;
  return (
    <Grid item {...rest} className={classes.grid + ' ' + classes[custom] + ' ' + className}>
      {children}
    </Grid>
  );
}

export default withStyles(style)(ItemGrid);
