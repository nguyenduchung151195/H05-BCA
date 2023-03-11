import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import clsx from 'clsx';
import { withStyles, Chip, TextField } from '@material-ui/core';
// import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { Cancel as CancelIcon } from '@material-ui/icons';
import Async from 'react-select/async';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
// import TextField from './LtTextField';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { serialize } from '../../helper';
import { clientId } from '../../variable';
import './style.css';
import _ from 'lodash'
import messages from './messages';

const styles = theme => ({
  root: {
    flexGrow: 1,
    position: 'relative',
  },
  input: {
    display: 'flex',
  },

  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    // '& > div': {
    //   position: 'absolute',
    // },
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700], 0.08),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
    position: 'absolute',
  },
  placeholder: {
    position: 'absolute',
    // left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    minWidth: '300px',
    '& div': {
      width: '100%',
      whiteSpace: 'nowrap',
    },
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      className="CustomIconRequired"
      fullWidth
      margin="dense"
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
          style: { padding: '6px 8px', width: '100%' },
        },
      }}
      {...TextFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography color="textSecondary" className={props.selectProps.classes.placeholder} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
  return (
    <Paper style={{ background: 'white', zIndex: '99999' }} square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}
function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={clsx(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

MultiValue.propTypes = {
  children: PropTypes.node,
  isFocused: PropTypes.bool,
  removeProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired,
};

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  MultiValue,
};

class MultipleAutocomplete extends React.Component {
  handleChange = value => {

    if (this.props.onChange) this.props.onChange(value);
    else this.props.select(value);
  };

  render() {
    const { classes, name, isMulti, theme, optionLabel, optionValue, value, suggestions, isClearable, onChange, intl, disablePlaceholder, ...rest } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            isDisabled={this.props.disabled}
            disabled={this.props.disabled}
            className="CustomIconRequired"
            placeholder={intl.formatMessage(messages.seaching)}
            noOptionsMessage={() => intl.formatMessage(messages.resultnotfound)}
            classes={classes}
            style={{ marginTop: 0 }}
            styles={selectStyles}
            // getOptionLabel={option => option[optionLabel || 'name']}
            getOptionLabel={option => (this.props.customOptionLabel ? this.props.customOptionLabel(option) : option[optionLabel || 'title' || 'name'])}
            getOptionValue={option => option[optionValue || '_id']}
            options={suggestions}
            components={components}
            value={value}
            onChange={this.handleChange}
            inputId="react-select-multiple"
            TextFieldProps={{
              ...rest,
              InputLabelProps: {
                htmlFor: 'react-select-multiple',
                shrink: true,
              },
            }}
            isClearable={isClearable}
            isMulti={isMulti}
          />
        </NoSsr>
      </div>
    );
  }
}

// const useStyles = makeStyles((props, theme) => ({
//   customMenu: {
//     '& .mymenu': {
//       minWidth: props,
//     },
//   },
// }));

function AsyncAutocomplete(props) {
  // const cn = useStyles(width);
  const {
    classes,
    name,
    isMulti,
    theme,
    optionLabel,
    url,
    optionValue,
    value,
    onChange,
    filters,
    filter,
    mapFunction,
    isClearable,
    suggestions,
    isSinged = false,
    error,
    helperText,
    checkedShowForm,
    intl,
    exports,
    order = [],
    defaultOptions,
    disablePlaceholder,
    ...rest
  } = props;
  // let timeout = 0;
  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };
  const [width, setWidth] = React.useState(300);

  // const ref = React.useRef(null);

  // React.useEffect(() => {
  //   setWidth(ref.current.clientWidth);
  // }, []);

  function loadOptions(inputValue, callback) {
    loadData(inputValue, callback);
  }

  function loadData(rex, callback) {
    const { $or, ...restFilter } = filter;
    if (rex && rex.trim()) {
      restFilter.$or = filters.map(i => ({ [i]: { $regex: rex.trim(), $options: 'gi' } }));
    }
    let exportCoppy = '';
    if (props.exports) {
      exportCoppy = '&exports=1';
    }
    // filter.name = { $regex: rex, $options: 'gi' };
    const query = serialize({ filter: restFilter });
    let resultUrl = ''
    console.log(url, 'url')
    if (isSinged) {
      if(url.includes("?")){
        resultUrl = props.noLimit
        ? `${url}&${props.clientId ? `clientId=${clientId}&order=Greater` : ''}${query}&order=Greater${exportCoppy}`
        : `${url}&${props.clientId ? `clientId=${clientId}&order=Greater` : ''}${query}&limit=${props.limit ? props.limit : 20}&order=Greater${exportCoppy}`;
      }else {
      resultUrl = props.noLimit
      ? `${url}?${props.clientId ? `clientId=${clientId}&order=Greater` : ''}${query}&order=Greater${exportCoppy}`
      : `${url}?${props.clientId ? `clientId=${clientId}&order=Greater` : ''}${query}&limit=${props.limit ? props.limit : 20}&order=Greater${exportCoppy}`;
     }
    } else {
      if(url.includes("?")){
        resultUrl = props.noLimit
        ? `${url}&${props.clientId ? `clientId=${clientId}&` : ''}${query}${exportCoppy}`
        : `${url}&${props.clientId ? `clientId=${clientId}&` : ''}${query}&limit=${props.limit ? props.limit : 20}${exportCoppy}`;
      }else {
        resultUrl = props.noLimit
        ? `${url}?${props.clientId ? `clientId=${clientId}&` : ''}${query}${exportCoppy}`
        : `${url}?${props.clientId ? `clientId=${clientId}&` : ''}${query}&limit=${props.limit ? props.limit : 20}${exportCoppy}`;
      }
     
    }

    return fetch(resultUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(data => data.json())
      .then(dt => {

        if (dt.data) {
          let finalData = [];
          if (order && order.length > 0) {
            order.map((i, index) => {

              let findI = dt.data && dt.data.findIndex(f => f.roleGroupSource === i);
              if (findI !== -1) {
                finalData[index] = dt.data[findI];
              }

            })
          } else {
            finalData = [...dt.data]
          }
          if (mapFunction) callback(finalData.map(mapFunction));
          else callback(finalData);
        } else {
          if (mapFunction) callback(dt.map(mapFunction));
          else if (Array.isArray(dt)) callback(dt);
          else callback([]);
        }
      })
      .catch(() => {
        callback([]);
      });
  }

  const renderCheckForm = check => {
    let xhtml = null;

    if (check === true) {
      xhtml = (
        <NoSsr>
          <Async
            className="CustomIconRequired"
            // defaultOptions
            isDisabled={props.disabled}
            placeholder={disablePlaceholder ? disablePlaceholder : intl.formatMessage(messages.seaching)}
            noOptionsMessage={() => intl.formatMessage(messages.resultnotfound)}
            classes={classes}
            styles={selectStyles}
            components={components}
            TextFieldProps={{
              error,
              helperText,
              ...rest,
              InputLabelProps: {
                htmlFor: 'react-select-multiple',
                shrink: true,
              },
            }}
            onChange={onChange}
            // getOptionLabel={option => option[optionLabel]}
            getOptionLabel={option => (props.customOptionLabel ? props.customOptionLabel(option) : option[optionLabel])}
            getOptionValue={option => option[optionValue]}
            value={mapFunction && Array.isArray(value) ? value.map(e => mapFunction(e)) : value}
            isClearable={isClearable}
            loadOptions={loadOptions}
            mapFunction={mapFunction}
            defaultOptions
            isMulti={isMulti}
          // onKeyDown={e => {
          //   // if (e.keyCode === 32 && this.selectRef && !this.selectRef.state.inputValue) e.preventDefault();
          //   if (e.keyCode === 32 && !_.get(this, 'selectRef.state.inputValue')) e.preventDefault();
          // }}
          />
        </NoSsr>
      );
    } else if (check === false) {
      xhtml = null;
    } else {
      xhtml = (
        <NoSsr>
          <Async
            className="CustomIconRequired"
            isDisabled={props.disabled}
            placeholder={disablePlaceholder ? disablePlaceholder : intl.formatMessage(messages.seaching)}
            noOptionsMessage={() => intl.formatMessage(messages.resultnotfound)}
            classes={classes}
            styles={selectStyles}
            components={components}
            TextFieldProps={{
              error,
              helperText,
              ...rest,
              InputLabelProps: {
                htmlFor: 'react-select-multiple',
                shrink: true,
              },
            }}
            onChange={onChange}
            // getOptionLabel={option => option[optionLabel]}
            getOptionLabel={option => (props.customOptionLabel ? props.customOptionLabel(option) : option[optionLabel])}
            getOptionValue={option => option[optionValue]}
            value={mapFunction && value ? value.map(e => mapFunction(e)) : value}
            isClearable={isClearable}
            loadOptions={loadOptions}
            mapFunction={mapFunction}
            defaultOptions
            isMulti={isMulti}
          // onKeyDown={e => {
          //   // if (e.keyCode === 32 && this.selectRef && !this.selectRef.state.inputValue) e.preventDefault();
          //   if (e.keyCode === 32 && !_.get(this, 'selectRef.state.inputValue')) e.preventDefault();
          // }}
          />
        </NoSsr>
      );
    }
    return xhtml;
  };
  return (
    <div className={classes.root}>
      {renderCheckForm(checkedShowForm)}
      {/* <NoSsr>
        <Async
          placeholder="Tìm kiếm"
          noOptionsMessage={() => 'Không có kết quả'}
          classes={classes}
          styles={selectStyles}
          components={components}
          TextFieldProps={{
            error,
            helperText,
            ...rest,
            InputLabelProps: {
              htmlFor: 'react-select-multiple',
              shrink: true,
            },
          }}
          onChange={onChange}
          getOptionLabel={option => option[optionLabel]}
          getOptionValue={option => option[optionValue]}
          cacheOptions
          value={value}
          isClearable={isClearable}
          loadOptions={loadOptions}
          mapFunction={mapFunction}
          // defaultOptions
          isMulti={isMulti}
        />
      </NoSsr> */}
    </div>
  );
}

MultipleAutocomplete.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

AsyncAutocomplete.defaultProps = { filters: ['name'], optionLabel: 'name', optionValue: '_id', filter: {}, isClearable: true };
MultipleAutocomplete.defaultProps = { name: 'Tìm kiếm', isClearable: true };

export default compose(
  injectIntl,
  withStyles(styles, { withTheme: true }),
)(MultipleAutocomplete);

export const AsyncAutocompleteLt = compose(
  injectIntl,
  withStyles(styles, { withTheme: true }),
)(AsyncAutocomplete);
// export const AsyncAutocompleteLt = withStyles(styles, { withTheme: true })(AsyncAutocomplete);
