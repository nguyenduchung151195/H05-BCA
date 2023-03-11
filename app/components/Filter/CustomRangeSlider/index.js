/**
 *
 * CustomRangeSlider
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import { Typography, Checkbox, FormControlLabel, Slider } from '@material-ui/core';
import PropTypes from 'prop-types';

function CustomRangeSlider(props) {
  const { min = 0, max = 100, title, value, onChange, enableFilter, onEnableFilterChange, unit } = props;
  const [localState, setLocalState] = useState([min, max]);
  // const [disabled, setDisabled] = useState(true);

  useEffect(
    () => {
      setLocalState(value);
    },
    [value],
  );

  const handleDone = value => {
    setLocalState(value);
  };

  const handleChange = value => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <>
      {/* <Checkbox onClick={() => setDisabled(!disabled)}  inputProps={{ 'label': `Lọc theo ${title}`,  }} /> */}
      <FormControlLabel
        control={<Checkbox checked={enableFilter} onClick={() => onEnableFilterChange(!enableFilter)} name="checkedA" />}
        label={`Tìm kiếm theo ${title.toLowerCase()}`}
      />

      {enableFilter ? (
        <>
          <Typography>
            {title} từ {localState[0]} đến {localState[1]} {unit}
          </Typography>
          <Slider
            value={[localState[0], localState[1]]}
            min={min}
            max={max}
            onChange={handleChange}
            disabled={!enableFilter}
            onChangeComplete={handleDone}
            range
          />
        </>
      ) : null}
    </>
  );
}

CustomRangeSlider.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  handleSave: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default compose(
  memo,
)(CustomRangeSlider);
