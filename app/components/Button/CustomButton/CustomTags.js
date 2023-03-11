import React from 'react';
import { Chip, withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme) => ({
  icon: {
    fontSize: '12px'
  },
  chip: {
    backgroundColor: 'white',
    border: '1px solid #ccc'
  }
})

function CustomTag(props) {
  const { item, classes, onClick } = props;
  return (
    <Chip
      deleteIcon={<CloseIcon className={classes.icon} />}
      label={item.label}
      onDelete={onClick}
      className={classes.chip}
    />
  )
}

export default withStyles(styles)(CustomTag);