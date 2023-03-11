/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
import React, { useEffect, memo, useState } from 'react';
import { Grid, MenuItem, Checkbox, TextField } from '@material-ui/core';
const defaultLocalData = {
  active: false,
  type: 'monthly',
  hourOfDay: 8,
  dayOfMonth: 0,
  dayOfWeek: 1,
};

function CircleSelect(props) {
  const { value = {}, onChange, disabled } = props;
  const { active, type, hourOfDay, dayOfMonth, dayOfWeek } = value;
  const [localData, setLocalData] = useState({
    ...defaultLocalData,
  });

  useEffect(
    () => {
      if (disabled) {
        if (onChange) {
          onChange({});
          setLocalData({
            ...localData,
            active: false,
          });
        }
      }
    },
    [disabled],
  );

  useEffect(
    () => {
      const newLocalData = {
        active,
        type: 'monthly',
        hourOfDay: 8,
        dayOfMonth: 0,
        dayOfWeek: 1,
      };
      const newHourOfDay = parseInt(hourOfDay);
      if (!isNaN(newHourOfDay) && newHourOfDay > -1 && newHourOfDay < 24) {
        newLocalData.hourOfDay = newHourOfDay;
      }
      const newType = ['monthly', 'weekly'].includes(type) ? type : 'monthly';
      if (newType === 'monthly') {
        const newDayOfMonth = parseInt(dayOfMonth);
        if (!isNaN(newDayOfMonth) && newDayOfMonth > -1 && newDayOfMonth < 30) {
          newLocalData.dayOfMonth = newDayOfMonth;
        }
      }
      if (newType === 'weekly') {
        const newDayOfWeek = parseInt(dayOfWeek);
        if (!isNaN(newDayOfWeek) && newDayOfWeek > -1 && newDayOfWeek < 30) {
          newLocalData.dayOfWeek = newDayOfWeek;
        }
      }
    },
    [type, hourOfDay, dayOfMonth, dayOfWeek],
  );

  const handleChangeActive = e => {
    const newLocalData = {
      ...localData,
      active: e.target.checked,
    };
    setLocalData(newLocalData);
    if (e.target.checked) {
      onChange(newLocalData);
    } else {
      onChange({});
    }
  };

  const handleChangeType = e => {
    const newLocalData = {
      ...localData,
      type: e.target.value,
    };
    setLocalData(newLocalData);
    onChange(newLocalData);
  };

  const handleChangeHour = e => {
    const newLocalData = {
      ...localData,
      hourOfDay: e.target.value,
    };
    setLocalData(newLocalData);
    onChange(newLocalData);
  };

  const handleChangeDayOfMonth = e => {
    const newLocalData = {
      ...localData,
      dayOfMonth: e.target.value,
    };
    setLocalData(newLocalData);
    onChange(newLocalData);
  };

  const handleChangeDayOfWeek = e => {
    const newLocalData = {
      ...localData,
      dayOfWeek: e.target.value,
    };
    setLocalData(newLocalData);
    onChange(newLocalData);
  };

  return (
    <>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Checkbox disabled={disabled} onChange={handleChangeActive} checked={localData.active} />
          Lặp lại
        </Grid>
        {localData.active ? (
          <>
            <Grid item md={4}>
              <TextField
                value={localData.type}
                onChange={handleChangeType}
                label="Tần xuất"
                variant="outlined"
                select
                style={{ width: '100%' }}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="weekly">Theo tuần</MenuItem>
                <MenuItem value="monthly">Theo tháng</MenuItem>
              </TextField>
            </Grid>
            <Grid item md={4}>
              <TextField
                value={localData.hourOfDay}
                onChange={handleChangeHour}
                label="Giờ"
                variant="outlined"
                select
                style={{ width: '100%' }}
                InputLabelProps={{ shrink: true }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(h => (
                  <MenuItem value={h}>{h}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {localData && localData.type === 'monthly' ? (
              <Grid item md={4}>
                <TextField
                  value={localData.dayOfMonth}
                  onChange={handleChangeDayOfMonth}
                  label="Ngày"
                  variant="outlined"
                  select
                  style={{ width: '100%' }}
                  InputLabelProps={{ shrink: true }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29].map(d => (
                    <MenuItem value={d}>{d + 1}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            ) : null}
            {localData && localData.type === 'weekly' ? (
              <Grid item md={4}>
                <TextField
                  value={localData.dayOfWeek}
                  onChange={handleChangeDayOfWeek}
                  label="Thứ"
                  variant="outlined"
                  select
                  style={{ width: '100%' }}
                  InputLabelProps={{ shrink: true }}
                >
                  {[1, 2, 3, 4, 5, 6, 0].map(d => (
                    <MenuItem value={d}>{d === 0 ? 'Chủ nhật' : `Thứ ${d + 1}`}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            ) : null}
          </>
        ) : null}
      </Grid>
    </>
  );
}
export default memo(CircleSelect);
