import React, { useEffect, memo, useState, useRef, useCallback } from 'react';
import { Typography, IconButton, FormControl, Select, MenuItem, InputLabel, Button, TextField, Dialog, Radio, Grid, Tooltip } from '@material-ui/core';
import { Fullscreen, Refresh, FullscreenExit, ImportExport, Archive, Remove } from '@material-ui/icons';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';

const styles = {
    chartIconHeader: {
        marginRight: '10px',
        backgroundColor: 'white',
        border: '1px solid #8c8c8c',
        position: 'relative',
        top: '7px',
        left: '5px'
    },
    formControlProductGroup: {
        marginLeft: '10px',
        position: 'relative',
        margin: '0px 0px 0px 0px',
        width: '60px',
        border: '1px solid #8c8c8c',
        fontSize: '13px!important',
        backgroundColor: 'white',
        height: '27px',
        top: '4px',
    },
    formControlProductGroup2: {
        marginLeft: '10px',
        position: 'relative',
        margin: '0px 0px 0px 0px',
        width: '100px',
        border: '1px solid #8c8c8c',
        fontSize: '13px!important',
        backgroundColor: 'white',
        height: '28px',
        top: '3px',
    },
    formControlYear: {
        position: 'relative',
        top: '7px',
        margin: '6px 5px 0px 0px',
        width: '68px',
        border: '1px solid #8c8c8c',
        borderBottom: '0px solid #8c8c8c',
        fontSize: '13px!important',
        backgroundColor: 'white',
    },
    selectEmpty: {
        fontSize: '13px!important',
    },
    popperMenu: {
        height: 600
    }
};

function CustomChartWrapper(props) {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [timeAmount, setTimeAmount] = useState(7);
    const [timeType, setTimeType] = useState('days');
    const [dataType, setDataType] = useState('GB');
    const [dataAmount, setDataAmount] = useState(null);
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
        classes,
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
    useEffect(() => {
        props.getDataUsed(timeAmount, timeType, dataType)
    }, [timeAmount, timeType, dataType])

    const handleChangeTimeAmount = e => {
        setTimeAmount(e.target.value)
    }
    const handleChangeTimeType = e => {
        console.log(e);
        setTimeType(e.target.value)
    }
    const handleChangeDataType = e => {
        setDataType(e.target.value)
    }
    useEffect(() => {
        switch (timeType) {
            case 'days':
                setTimeAmount(7)
                break
            case 'weeks':
                setTimeAmount(2)
                break
            case 'months':
                setTimeAmount(2)
                break
            case 'quarters':
                setTimeAmount(2)
                break
            case 'years':
                setTimeAmount(1)
                break
        }
    }, [timeType])



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
            console.log('error');
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
                    ? { width: '100vw', maxWidth: '100%', height: '100vh', position: 'fixed', backgroundColor: 'white', top: 0, left: 0, zIndex: 1300 }
                    : { border: '1px solid #dedede', marginLeft: '10px' }
            }
        >

            <div style={{ backgroundColor: '#f1f1f1', height: '35px', margin: '10px 10px 0px 10px' }}>
                {/* <Button>Filter here</Button> */}
                <Grid container spacing={0}>
                    {/* LEFT */}

                    <Grid item xs={4}>
                        <span
                            style={{ padding: '4px 2px', backgroundColor: 'white', border: '1px solid #666666', position: 'relative', top: '3px', left: '5px' }}
                        >
                            <EqualizerIcon />
                        </span>
                        {/* <span className={classes.formControlProductGroup}> */}
                        <Select
                            value={timeType}
                            onChange={handleChangeTimeType}
                            displayEmpty
                            className={classes.formControlProductGroup2}
                            inputStyle={{ fontSize: '13px' }}
                        >
                            <MenuItem value="days"> Ngày</MenuItem>
                            <MenuItem value="weeks"> Tuần</MenuItem>
                            <MenuItem value="months"> Tháng</MenuItem>
                            <MenuItem value="quarters"> Quý</MenuItem>
                            <MenuItem value="years"> Năm</MenuItem>
                        </Select>
                        {timeType === 'days' && (
                            <Select
                                value={timeAmount}
                                onChange={handleChangeTimeAmount}
                                displayEmpty
                                className={classes.formControlProductGroup}
                                inputStyle={{ fontSize: '13px' }}
                            >

                                <MenuItem value={7}> 7</MenuItem>
                                <MenuItem value={15}> 15</MenuItem>
                                <MenuItem value={30}> 30</MenuItem>
                            </Select>
                        )}
                        {timeType === 'weeks' && (
                            <Select
                                value={timeAmount}
                                onChange={handleChangeTimeAmount}
                                displayEmpty
                                className={classes.formControlProductGroup}
                                inputStyle={{ fontSize: '13px' }}
                            >

                                <MenuItem value={2}> 2</MenuItem>
                                <MenuItem value={4}> 4</MenuItem>
                            </Select>
                        )}
                        {timeType === 'months' && (
                            <Select
                                value={timeAmount}
                                onChange={handleChangeTimeAmount}
                                displayEmpty
                                className={classes.formControlProductGroup}
                                inputStyle={{ fontSize: '13px' }}
                            >

                                <MenuItem value={2}> 2</MenuItem>
                                <MenuItem value={6}> 6</MenuItem>
                                <MenuItem value={12}> 12</MenuItem>
                            </Select>
                        )}
                        {timeType === 'quarters' && (
                            <Select
                                value={timeAmount}
                                onChange={handleChangeTimeAmount}
                                displayEmpty
                                className={classes.formControlProductGroup}
                                inputStyle={{ fontSize: '13px' }}
                            >

                                <MenuItem value={2}> 2</MenuItem>
                                <MenuItem value={4}> 4</MenuItem>
                            </Select>
                        )}
                        {timeType === 'years' && (
                            <Select
                                value={timeAmount}
                                onChange={handleChangeTimeAmount}
                                displayEmpty
                                className={classes.formControlProductGroup}
                                inputStyle={{ fontSize: '13px' }}
                            >

                                <MenuItem value={1}> 1</MenuItem>
                                <MenuItem value={2}> 2</MenuItem>
                                <MenuItem value={3}> 3</MenuItem>
                                <MenuItem value={4}> 4</MenuItem>
                                <MenuItem value={5}> 5</MenuItem>
                            </Select>
                        )}
                        <Select
                            value={dataType}
                            onChange={handleChangeDataType}
                            displayEmpty
                            className={classes.formControlProductGroup}
                            inputStyle={{ fontSize: '13px' }}
                        >
                            <MenuItem value="B"> B</MenuItem>
                            <MenuItem value="KB"> KB</MenuItem>
                            <MenuItem value="MB"> MB</MenuItem>
                            <MenuItem value="GB"> GB</MenuItem>
                        </Select>

                    </Grid>

                    {/* RIGHT */}
                    <Grid item xs={8}>
                        <Grid container spacing={0} justify="flex-end" alignItems="center" style={{ gap: 4 }}>
                            <>
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
                                    <Grid item xs={1} >
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
            <div style={{ height: isFullScreen ? '95vh' : props.height, width: '100%' }}>
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
export default memo(withStyles(styles)(CustomChartWrapper));
