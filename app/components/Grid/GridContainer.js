import React from 'react';

// material-ui components
import { withStyles, Grid } from '@material-ui/core';

const style = {
  grid: {
    padding: '10px 0px',
    width: 'calc(100%)',
    // '&:before,&:after':{
    //   display: 'table',
    //   content: '" "',
    // },
    // '&:after':{
    //   clear: 'both',
    // }
  },
};

function GridContainer({ ...props }) {
  const { classes, children, className, ...rest } = props;
  return (
    <Grid container {...rest} className={`${classes.grid} ${className}`}>
      {children}
    </Grid>
  );
}

export default withStyles(style)(GridContainer);
