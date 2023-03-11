import React, { useEffect, memo, useState, useRef, useCallback } from 'react';
import { Typography, IconButton, FormControl, Select, MenuItem, InputLabel, Button, Dialog, Radio, Grid, Tooltip } from '@material-ui/core';
import { Fullscreen, Refresh, FullscreenExit, ImportExport, Archive, Remove } from '@material-ui/icons';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import CircularProgress from '@material-ui/core/CircularProgress';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';

function CustomChartWrapper(props) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const {
    onGetData,
    onRefresh,
    isLoading,
    id = '',
    organizationUnitFilterKey,
    employeeFilterKey,
    code = '',
    profile,
    onZoom,
    noChart = false,
    isReport = false,
  } = props;

  // useEffect(() => {
  //   document.onkeydown = function (evt) {
  //     evt = evt || window.event;
  //     var isEscape = false;
  //     if ('key' in evt) {
  //       isEscape = evt.key === 'Escape' || evt.key === 'Esc';
  //     } else {
  //       isEscape = evt.keyCode === 27;
  //     }
  //     if (isEscape) {
  //       setIsFullScreen(false);
  //     }
  //   };

  // }, []);

  const INITIAL_QUERY = {
    year: 0,
    month: 0,
    startDate: moment().add(-1, 'year'),
    endDate: moment(),
    organizationUnitId: '',
    employeeId: '',
  };
  const currentYear = moment().format('YYYY');
  const currentMonth = moment().format('MM');
  const FORMAT_DATE = 'YYYY/MM/DD`';
  const [years, setYears] = useState();
  const [months, setMonths] = useState();
  const [show, setShow] = useState(true);
  const [isClear, setIsClear] = useState(false);
  const [innerFilter, setInnerFilter] = useState({});
  const [localQueryFilter, setLocalQueryFilter] = useState(INITIAL_QUERY);

  const YEAR = [
    'chart8',
    'chart9',
    'chart3',
    'receivableChart1',
    'receivableChart2',
    'chart1',
    'favoriteChart1',
    'generalChart1',
    'generalChart2',
    'generalChart3',
    'expenseChart1',
    'expenseChart2',
    'statisticReport1',
    'receivableChart3',
    'stockChart5',
    'stockChart4',
    'customerChart1',
    'customerChart2',
    'employeeReport2',
  ];
  const MONTH = ['chart8', 'chart1', 'chart9'];

  const generateYear = () => {
    let result = [];

    let count = 0;
    while (count < 5) {
      result.push(Number(currentYear) - count);
      count += 1;
    }
    setYears(result);
  };

  const generateMonth = () => {
    let result = [];
    let count = 1;
    while (count <= Number(currentMonth)) {
      result.push(count);
      count += 1;
    }
    setMonths(result.reverse());
  };

  function checkShow(show) {
    setShow(show);
  }

  const getFirstDayOfYear = year => {
    return moment(year, 'YYYY').startOf('year');
  };
  const getLastDayOfYear = year => {
    return moment(year, 'YYYY').endOf('year');
  };
  const getFirstDayOfMonth = month => {
    return moment(month, 'MM').startOf('month');
  };
  const getLastDayOfMonth = month => {
    return moment(month, 'MM').endOf('month');
  };
  const getFirstDayInMonthOfYear = (year, month) => {
    let date = month + '/' + year;

    return moment(date, 'MM/YYYY').startOf('month');
  };
  const getLastDayInMonthOfYear = (year, month) => {
    let date = month + '/' + year;
    return moment(date, 'MM/YYYY').endOf('month');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setLocalQueryFilter({ ...localQueryFilter, [name]: value });
  };

  const handleSendingData = () => {
    const { year, month, organizationUnitId, employeeId, startDate, endDate } = localQueryFilter;
    let obj = {};
    if (id === 'processReport3') {
      {
        obj = {
          organizationUnitId,
          startDate,
          endDate,
          employeeId: employeeId && employeeId,
        };
      }
    }
    if (id === 'chart8' || id === 'chart9') {
      if (year === 0 && month === 0) {
        obj = {
          organizationUnitId,
          startDate: getFirstDayOfYear(2021),
          endDate: getLastDayOfYear(2021),

          employeeId: employeeId && employeeId,
        };
      }
      if (year !== 0 && month === 0) {
        obj = {
          startDate: getFirstDayOfYear(year),
          endDate: getLastDayOfYear(year),
          organizationUnitId,
          employeeId: employeeId && employeeId,
        };
      }
      if (year === 0 && month !== 0) {
        obj = {
          startDate: getFirstDayOfMonth(month),
          endDate: getLastDayOfMonth(month),
          organizationUnitId,
          employeeId: employeeId && employeeId,
        };
      }
      if (year !== 0 && month !== 0) {
        obj = {
          startDate: getFirstDayInMonthOfYear(year, month),
          endDate: getLastDayInMonthOfYear(year, month),
          organizationUnitId,
          employeeId: employeeId && employeeId,
        };
      }
    } else {
      if (year === 0 && month === 0) {
        obj = {
          organizationUnitId,
          year: moment().format('YYYY'),
          month: moment().format('MM'),
          employeeId: employeeId && employeeId,
        };
      }
      if (year !== 0 && month === 0) {
        obj = {
          year,
          organizationUnitId,
          employeeId: employeeId && employeeId,
        };
      }
      if (year === 0 && month !== 0) {
        obj = {
          month,
          organizationUnitId,
          employeeId: employeeId && employeeId,
        };
      }
      if (year !== 0 && month !== 0) {
        obj = {
          year,
          month,
          organizationUnitId,
          employeeId: employeeId && employeeId,
        };
      }
    }
    onGetData && onGetData(obj);
  };
  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (typeof onZoom === 'function') {
      onZoom(!isFullScreen);
    }
  };
  const handleClear = () => {
    setLocalQueryFilter(INITIAL_QUERY);
    setIsClear(true);
    onRefresh();
  };
  const handleChangeDate = useCallback((value, name) => {
    if (new Date(localQueryFilter.startDate) > new Date(value)) {
      // console.log('error');
    }
    setLocalQueryFilter({ ...localQueryFilter, [name]: value });
  }, [localQueryFilter.startDate, localQueryFilter.endDate]);

  useEffect(() => {
    generateYear();
    generateMonth();
    return () => {
      generateYear();
      generateMonth();
    };
  }, []);
  useEffect(
    () => {
      if (localQueryFilter) {
        handleSendingData();
      }

    },
    [localQueryFilter],
  );
  useEffect(() => {
    if (props.show != null || props.show != undefined) {
      setShow(props.show)
    }
  }, [])
  return (
    <div
      style={
        isFullScreen
          ? { width: '100%', maxWidth: '100%', height: '100vh', position: 'fixed', backgroundColor: 'white', top: 0, left: 0, zIndex: 100000000 }
          : { width: '100%', backgroundColor: 'rgb(238 238 238)' }
      }
    >
      <div>
        {/* <Button>Filter here</Button> */}
        <Grid container item md={12} spacing={0}>
          {/* LEFT */}

          <Grid item xs={1}>
            <span
              style={{ padding: '4px 2px', backgroundColor: 'white', border: '1px solid #666666', position: 'relative', top: '6px', left: '5px' }}
            >
              <EqualizerIcon />
            </span>
          </Grid>
          {/* RIGHT */}
          <Grid item xs={11}>
            <Grid container spacing={0} justify="flex-end" alignItems="center" style={{ gap: 4 }}>
              <>
                {/* {id === 'processReport3' && isReport === true &&
                  (
                    <Grid item xs={3}>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <DateTimePicker
                            inputVariant="outlined"
                            format="DD/MM/YYYY"
                            label="Từ Ngày"
                            className={'dateStyle'}
                            value={localQueryFilter.startDate}
                            name="startDate"
                            error={false}
                            helperText={null}
                            variant="outlined"
                            margin="dense"
                            onChange={value => handleChangeDate(value, 'startDate')}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', height: 28 }}>
                            <Remove color="primary" />
                          </div>

                          <DateTimePicker
                            inputVariant="outlined"
                            format="DD/MM/YYYY"
                            label="Đến"
                            className={'dateStyle'}
                            error={false}
                            helperText={null}
                            value={localQueryFilter.endDate}
                            name="endDate"
                            margin="dense"
                            variant="outlined"
                            onChange={value => handleChangeDate(value, 'endDate')}
                          />
                        </div>
                      </MuiPickersUtilsProvider>
                    </Grid>
                  )} */}
                {YEAR.includes(id) && (
                  <Grid item xs={2}>
                    <FormControl variant="outlined" className="form form__select">
                      {localQueryFilter.year !== 0 ? <> </> : <InputLabel id="year">Năm</InputLabel>}
                      <Select fullWidth labelId="year" name="year" value={localQueryFilter.year} onChange={handleChange}>
                        <MenuItem value={0}>
                          <em style={{ fontStyle: 'normal', fontSize: 14 }}>---- CHỌN ----</em>
                        </MenuItem>
                        {years && years.map(year => <MenuItem value={year}>{`Năm ${year}`}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {MONTH.includes(id) && (
                  <Grid item xs={1} xs={2}>
                    <FormControl variant="outlined" className="form form__select">
                      {localQueryFilter.month !== 0 ? <> </> : <InputLabel id="month">Tháng</InputLabel>}
                      <Select fullWidth labelId="month" name="month" value={localQueryFilter.month} onChange={handleChange}>
                        <MenuItem value={0} style={{ fontStyle: 'normal' }}>
                          <em style={{ fontStyle: 'normal', fontSize: 14 }}>---- CHỌN ----</em>
                        </MenuItem>
                        {months && months.map(month => <MenuItem value={month}>{`Tháng ${month}`}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {show === true && (
                  // id !== 'chart8' &&
                  // id !== 'chart9' && 
                  <Grid item md={4} style={{ height: isReport && 28 }}>
                    <DepartmentAndEmployee
                      onChangeShow={s => checkShow(s)}
                      isClear={isClear}
                      onClearSuccess={() => setIsClear(false)}
                      onChange={result => {
                        let employeeId = '';
                        let organizationUnitId = '';
                        const newFilter = {};
                        if (result) {
                          if (result.department) {
                            newFilter[organizationUnitFilterKey || 'organizationUnitId'] = result.department;
                          }
                          if (result.employee) {
                            newFilter[employeeFilterKey || 'employeeId'] = result.employee._id;
                          }
                        }
                        setLocalQueryFilter(pre => ({
                          ...pre,
                          organizationUnitId: newFilter && newFilter.organizationUnitId ? newFilter.organizationUnitId : null,
                          employeeId: newFilter && newFilter.employeeId ? newFilter.employeeId : null,
                        }));
                      }}
                      profile={profile}
                      isReport={isReport}
                      disableEmployee={props.disableEmployee || false}
                      moduleCode={code}
                    />
                  </Grid>
                )}
              </>
              {noChart === true ? (
                <Grid item>
                  <Tooltip title="Xuất dữ liệu">
                    <IconButton style={{ padding: '6px' }} aria-label="Export" onClick={props.onExport} disabled={isLoading}>
                      <Archive />
                    </IconButton>
                  </Tooltip>
                </Grid>
              ) : (
                <Grid item>
                  <Tooltip title="Xuất dữ liệu">
                    <IconButton style={{ padding: '6px' }} aria-label="Export" onClick={props.onExport} disabled={isLoading}>
                      <Archive />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}

              <Grid item>
                <Tooltip title="Làm mới">
                  <IconButton style={{ padding: '6px' }} aria-label="Refresh" onClick={() => handleClear()} disabled={isLoading}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Toàn màn hình">
                  <IconButton style={{ padding: '6px' }} aria-label="FullScreen" onClick={() => handleFullScreen()}>
                    {!isFullScreen ? <Fullscreen /> : <FullscreenExit />}
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div style={{ height: isFullScreen ? '100vh' : props.height, width: '100%' }}>
        {!isLoading ? (
          props.children
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
}
export default memo(CustomChartWrapper);
