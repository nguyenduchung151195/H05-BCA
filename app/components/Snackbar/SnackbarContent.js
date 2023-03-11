import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// material-ui components
import { withStyles, SnackbarContent, IconButton } from '@material-ui/core';

// material-ui-icons
import { Close } from '@material-ui/icons';

import snackbarContentStyle from 'assets/jss/material-dashboard-pro-react/components/snackbarContentStyle';

function SnackContent({ ...props }) {
  const { classes, message, color, close, icon } = props;
  var action = [];
  const messageClasses = cx({
    [classes.iconMessage]: icon !== undefined,
  });
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
      >
        <Close className={classes.close} />
      </IconButton>,
    ];
  }
  const iconClasses = cx({
    [classes.icon]: classes.icon,
    [classes.infoIcon]: color === 'info',
    [classes.successIcon]: color === 'success',
    [classes.warningIcon]: color === 'warning',
    [classes.dangerIcon]: color === 'danger',
    [classes.primaryIcon]: color === 'primary',
    [classes.roseIcon]: color === 'rose',
  });
  return (
    <SnackbarContent
      message={
        <div>
          {icon !== undefined ? <props.icon className={iconClasses} /> : null}
          <span className={messageClasses}>{message}</span>
        </div>
      }
      classes={{
        root: classes.root + ' ' + classes[color],
        message: classes.message,
      }}
      action={action}
    />
  );
}

SnackContent.defaultProps = {
  color: 'info',
};

SnackContent.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    'info',
    'success',
    'warning',
    'danger',
    'primary',
    'rose',
  ]),
  close: PropTypes.bool,
  icon: PropTypes.func,
};

export default withStyles(snackbarContentStyle)(SnackContent);
