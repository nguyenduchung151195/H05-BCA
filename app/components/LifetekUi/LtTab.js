import React from 'react';
import { Tab, withStyles } from '@material-ui/core';
// import PropTypes from 'prop-types';


const styles = theme => ({
  root: {
    // textTransform: 'none',
    marginTop: 5,

    // maxWidth: '200px',
    // minWidth : '150px'
  },
});

function LtTab(props) {
  const { isArrow } = props;
  const tabStyleP = {
    fontWeight: props.disabled ? 300 : 600,
    fontSize: 12,
    margin: 0,
    width: isArrow ? 65 : 'auto',
    border: isArrow ? '1px solid' : 'none',
    padding: '6px 20px',
    borderRadius: isArrow && '35px',
    transition: '.2s',
  }

  return <Tab maxWidth classes={{ root: props.classes.root }} {...props} label={<p style={tabStyleP}>{props.label}</p>} />;
}
export default withStyles(styles)(LtTab);
