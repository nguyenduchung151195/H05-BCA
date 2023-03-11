import React, { useState, useEffect } from 'react';
import CustomInputBase from '../../CustomInputBase';
import { MenuItem, Grid } from '@material-ui/core';
import { LIST } from '../constants';

function WarrantyPeriodInput(props) {
  const { periodLabel, unitLabel, value, type, onChange, noPadding, ...restProps } = props;
  const [localState, setLocalState] = useState({
    period: '',
    unit: LIST[type][0].value,
  });

  useEffect(() => {
    setLocalState({
      period: value && value.period,
      unit: value && value.unit
    });
  }, [value.period, value.unit]);

  const handleChange = (e) => {
    const newLocalState = {
      ...localState,
      [e.target.name]: e.target.value,
    }
    setLocalState(newLocalState);
    onChange(newLocalState);
  }

  const getSelectedItem = (unitVal) => {
    const matchItem = LIST[type].find(item => unitVal && item.value === unitVal);
    if (matchItem) return matchItem.value;
  }
  return (
    <>
      <Grid container spacing={8}>
        <Grid item xs={9}>
          <CustomInputBase label={periodLabel || 'Thời gian bảo hành'} type='number' value={localState.period} onChange={handleChange} name='period' {...restProps} />
        </Grid>
        <Grid item xs={3}>
          <CustomInputBase value={getSelectedItem(localState.unit)} onChange={handleChange} label={unitLabel || 'Đơn vị'} name='unit' select {...restProps}>
            {Array.isArray(LIST[type]) && LIST[type] ? LIST[type].map(item => <MenuItem value={item.value}>{item.title}</MenuItem>) : null}
          </CustomInputBase>
        </Grid>
      </Grid>
    </>
  );
}
export default WarrantyPeriodInput;
