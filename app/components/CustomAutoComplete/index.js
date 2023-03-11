/* eslint-disable react/no-typos */
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import withStyles from '@material-ui/styles';
import { Checkbox, Tooltip, Popper } from '@material-ui/core';
import { ArrowDropDown as ArrowDropDownIcon, Close as CloseIcon } from '@material-ui/icons';

import CustomTextField from '../CustomTextField';

const StyledAutocomplete = withStyles({
  inputRoot: {
    flexWrap: 'nowrap',
  },
})(props => <Autocomplete {...props} />);

const PoperComponent = React.forwardRef((props, ref) => {
  const newProps = {
    ...props,
    style: {
      ...props.style,
      width: 'auto',
      minWidth: props.style ? props.style.width : 200,
    },
  };
  return <Popper ref={ref} {...newProps} placement="bottom-start" />;
});

function CustomAutocomplete(props) {
  // changeTitleToolTip
  const [titleToolTip, setTitleToolTip] = useState(true);

  const {
    multiple,
    optionLabel,
    optionValue,
    value,
    onChange,
    options,
    size,
    textLabel,
    required,
    disableClearable,
    isItemDisabled,
    disabledLabel,
    ...rest
  } = props;
  const CustomOption = (option, { selected }) => (
    <>
      <p style={{ width: '100%', marginBottom: '2px' }} disabled={typeof isItemDisabled === 'function' && isItemDisabled(option)}>
        <Checkbox
          color="primary"
          checked={selected}
          style={{ marginRight: 8 }}
          disabled={typeof isItemDisabled === 'function' && isItemDisabled(option)}
        />
        {option[optionLabel]}
        {typeof isItemDisabled === 'function' &&
          disabledLabel &&
          isItemDisabled(option) && (
            <span
              style={{
                float: 'right',
                color: '#f44336',
                fontSize: '0.75rem',
                paddingTop: '2px',
              }}
            >
              * {disabledLabel}
            </span>
          )}
      </p>
    </>
  );

  const CustomOptionCheckDisable = option => (
    <>
      <p style={{ width: '100%', marginBottom: '-2px' }} disabled={typeof isItemDisabled === 'function' && isItemDisabled(option)}>
        {option[optionLabel]}
        {typeof isItemDisabled === 'function' &&
          disabledLabel &&
          isItemDisabled(option) && (
            <span
              style={{
                float: 'right',
                color: '#f44336',
                fontSize: '0.75rem',
                paddingTop: '2px',
              }}
            >
              * {disabledLabel}
            </span>
          )}
      </p>
    </>
  );
  const InputRender = params => <CustomTextField {...params} required={required} label={textLabel} error={required ? value == null : null} />;

  const TagsRender = tags => (
    <>
      <span
        style={{
          height: 'auto',
          overflow: ' hidden',
          minHeight: '1.1876em',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          paddingLeft: 10,
        }}
      >
        {tags.map(c => c[optionLabel]).join(', ')}
      </span>
    </>
  );

  return multiple ? (
    <StyledAutocomplete
      multiple={multiple}
      options={options}
      getOptionDisabled={option => typeof isItemDisabled === 'function' && isItemDisabled(option)}
      getOptionLabel={option =>
        //
        //
        option[optionLabel]
      }
      size="small"
      value={value}
      onChange={(_w, item) => {
        if (Array.isArray(item)) {
          const newItems = item.filter(i => !(typeof isItemDisabled === 'function' && isItemDisabled(i)));
          onChange(newItems);
        } else {
          onChange(item);
        }
      }}
      PoperComponent={PoperComponent}
      openOnFocus
      selectOnFocus
      disableCloseOnSelect
      renderOption={CustomOption}
      renderTags={TagsRender}
      renderInput={InputRender}
      openText=""
      closeText=""
      popupIcon={
        <Tooltip title={titleToolTip ? 'Mở' : 'Đóng'}>
          <ArrowDropDownIcon />
        </Tooltip>
      }
      onOpen={() => {
        setTitleToolTip(false);
      }}
      onClose={() => {
        setTitleToolTip(true);
      }}
      clearText=""
      closeIcon={
        <Tooltip title="Xóa">
          <CloseIcon />
        </Tooltip>
      }
      {...rest}
    />
  ) : (
    <Autocomplete
      options={options}
      getOptionDisabled={option => typeof isItemDisabled === 'function' && isItemDisabled(option)}
      getOptionLabel={option =>
        // console.log('option', option);
        // if (typeof isItemDisabled === 'function' && isItemDisabled(option))
        //     return '';
        option[optionLabel]
      }
      size="small"
      value={value}
      onChange={(_e, item) => {
        if (typeof isItemDisabled === 'function' && isItemDisabled(item)) return;
        onChange(item);
      }}
      PoperComponent={PoperComponent}
      openOnFocus
      selectOnFocus
      renderOption={CustomOptionCheckDisable}
      renderInput={InputRender}
      openText=""
      closeText=""
      popupIcon={
        <Tooltip title={titleToolTip ? 'Mở' : 'Đóng'}>
          <ArrowDropDownIcon />
        </Tooltip>
      }
      onOpen={() => {
        setTitleToolTip(false);
      }}
      onClose={() => {
        setTitleToolTip(true);
      }}
      clearText=""
      closeIcon={
        <Tooltip title="Xóa">
          <CloseIcon />
        </Tooltip>
      }
      {...rest}
      disableClearable={disableClearable}
    />
  );
}
CustomAutocomplete.defaultProps = {
  size: 'small',
  optionLabel: 'displayName',
  required: false,
  //
  textLabel: ' Mời nhập thông tin',
  multiple: false,
  options: [],
  value: null,
  disableLabel: '',
};

CustomAutocomplete.PropTypes = {
  classes: PropTypes.object,
  multiple: PropTypes.bool,
  optionLabel: PropTypes.string,
  optionValue: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  textLabel: PropTypes.string,
  size: PropTypes.string,
  options: PropTypes.string,
  required: PropTypes.bool,
  isItemDisabled: PropTypes.func,
  disabledLabel: PropTypes.string,
  disableClearable: PropTypes.bool,
};

export default memo(CustomAutocomplete);
