import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// material-ui components
import { withStyles, FormControl, FormHelperText, Input, InputLabel } from '@material-ui/core';

// material-ui-icons
import { Clear, Check } from '@material-ui/icons';

import customInputStyle from 'assets/jss/material-dashboard-pro-react/components/customInputStyle';

function CustomInput({ ...props }) {
  const { classes, formControlProps, labelText, id, labelProps, inputProps, error, success, helpText, rtlActive } = props;

  let labelClasses = cx({
    [` ${classes.labelRootError}`]: error,
    [` ${classes.labelRootSuccess}`]: success && !error,
  });

  let formControlClasses = classes.formControl;
  if (formControlProps !== undefined) {
    formControlClasses += ` ${formControlProps.className}`;
  }
  let underlineClasses = classes.underline;
  if (inputProps !== undefined) {
    formControlClasses = `${formControlClasses} ${cx({
      [classes.inputWithAdornment]: (inputProps.startAdornment !== undefined || inputProps.endAdornment !== undefined) && labelText === undefined,
    })}`;
    underlineClasses = cx({
      [classes.underline]: inputProps.disabled !== true,
    });
  }
  if (inputProps !== undefined) {
    labelClasses = `${labelClasses} ${cx({
      [classes.labelWithAdornment]: inputProps.endAdornment !== undefined,
    })}`;
  }
  const successClasses = `${classes.feedback} ${classes.labelRootSuccess} ${cx({
    [classes.feedbackNoLabel]: labelText === undefined,
    [classes.feedbackAdorment]: inputProps !== undefined && inputProps.endAdornment !== undefined,
  })}`;
  const errorClasses = `${classes.feedback} ${classes.labelRootError} ${cx({
    [classes.feedbackNoLabel]: labelText === undefined,
    [classes.feedbackAdorment]: inputProps !== undefined && inputProps.endAdornment !== undefined,
  })}`;
  const input = `${classes.input} ${cx({
    [classes.inputRTL]: rtlActive,
    [classes.inputNoLabel]: labelText === undefined,
  })}`;
  return (
    <FormControl {...formControlProps} className={formControlClasses} aria-describedby={`${id}-text`}>
      {labelText !== undefined ? (
        <InputLabel className={classes.labelRoot + labelClasses} htmlFor={id} {...labelProps}>
          {labelText}
        </InputLabel>
      ) : null}
      <Input
        classes={{
          input,
          disabled: classes.disabled,
          underline: underlineClasses,
          // inkbar: inkbarClasses,
        }}
        id={id}
        {...inputProps}
        inputRef={props.inputRef}
      />
      {error ? <Clear className={errorClasses} /> : success ? <Check className={successClasses} /> : null}
      {helpText !== undefined ? <FormHelperText id={`${id}-text`}>{helpText}</FormHelperText> : null}
    </FormControl>
  );
}

CustomInput.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
  helpText: PropTypes.string,
  rtlActive: PropTypes.bool,
};

export default withStyles(customInputStyle)(CustomInput);
