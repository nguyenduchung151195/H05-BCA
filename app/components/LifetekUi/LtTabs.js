import React from 'react';
import { Tabs, withStyles } from '@material-ui/core';
// import PropTypes from 'prop-types';

const styles = () => ({
  root: {
    textTransform: 'none',
    fontSize: 12,
  },
});

function LtTabs({ indicatorColor, ...rest }) {
  return <Tabs indicatorColor="primary" {...rest} />;
}
export default withStyles(styles)(LtTabs);
