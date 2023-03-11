import { Grid, MenuItem, TextField, Typography, Button } from '@material-ui/core';
import React, { memo, useState, useCallback, useEffect } from 'react';
import { FormatListBulletedSharp } from '@material-ui/icons';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
// import CustomInputBase from '../../../../../../components/Input/CustomInputBase';
import { API_LOGOUT } from '../../../config/urlConfig';
import ListPage from '../../../components/List';
import DepartmentAndEmployee from '../../../components/Filter/DepartmentAndEmployee';
import _ from 'lodash'

// const FIX_COLUMNS = [
//   { name: 'Ip', title: 'IP', checked: true },
//   { name: 'userName', title: 'Tên đăng nhập', checked: true },
//   { name: 'employee', title: 'Tên nhân viên', checked: true },
//   { name: 'timeForlogin', title: 'Thời gian đăng nhập', checked: true },
//   { name: 'timeForLogout', title: 'Thời gian đăng xuất', checked: true },
//   { name: 'result', title: 'Kết quả', checked: true },
// ];
function HistoryLoginUser(props) {
  const [filter, setFilter] = useState({});
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');

  useEffect(() => {
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack'); 
    localStorage.removeItem('addWorkingScheduleCallback'); 
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');
}, []);

  const handleChangeFilter = useCallback(
    (e, isStartDate) => {
      const name = isStartDate ? 'startDate' : 'endDate';
      const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
      const newFilter = { ...filter, [name]: value };
      // TT
      if (!newFilter.startDate && newFilter.endDate) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('nhập thiếu: "Từ ngày"');
        setErrorTextEndDate('');
      } else if (newFilter.startDate && !newFilter.endDate) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('');
        setErrorTextEndDate('nhập thiếu: "Đến ngày"');
      } else if (newFilter.startDate && newFilter.endDate && new Date(newFilter.endDate) < new Date(newFilter.startDate)) {
        setErrorStartDateEndDate(true);
        setErrorTextStartDate('"Từ ngày" phải nhỏ hơn "Đến ngày"');
        setErrorTextEndDate('"Đến ngày" phải lớn hơn "Từ ngày"');
      } else {
        setErrorStartDateEndDate(false);
        setErrorTextStartDate('');
        setErrorTextEndDate('');
      }
      // setReload((newFilter.startDate && newFilter.endDate) || (!newFilter.startDate && !newFilter.endDate))
      setFilter(newFilter);
    },
    [filter],
  );

  // const formatTime = time => {
  //   let result = moment(time)

  //   result = result.isValid() ? result : moment(time, 'MM-DD-YYYY HH:mm')
  //   result = result.isValid() ? result : moment(time, 'MM/DD/YYYY HH:mm')

  //   return result.isValid() ? valid.format('DD/MM/YYYY HH:mm:ss') : null
  // }
  function customFunction(it) {
    // const newData = data && data.map(it => ({
    //   ...it,
    //   loginTime: it.loginTime && moment(it.loginTime).format('DD/MM/YYYY HH:mm:ss'),
    //   logoutDate: it.loginTime && moment(it.updatedAt).format('DD/MM/YYYY HH:mm:ss '),
    //   username: it['employeeId.name'],
    //   organizationUnit: it['organizationUnit'],
    // }));
    // console.log(data,newData)
    // return newData;

    return ({
      ...it,
      // loginTime: formatTime(it.loginTime),
      // logoutDate: formatTime(it.logoutDate),
      employeeId: _.get(it, 'employeeId.name'),
      organizationUnit: _.get(it, 'organizationUnit') || _.get(it, 'organizationUnitId.name'),
    })
  }

  const handleChangeDepartment = useCallback(
    res => {
      //   console.log(1, res);
      const value = res.department;
      const newFilter = { ...filter };
      if (value) {
        setFilter({ ...newFilter, organizationUnit: value });
      } else if (value === 0) {
        delete newFilter.organizationUnit;
        setFilter(newFilter);
      }
    },
    [filter],
  );
  function handleOut() {
    const { history } = props;
    history.push('/setting/Employee');
  }

  console.log(filter);


  return (
    <React.Fragment>
      {/* <Grid container spacing={16} direction="row" justify="flex-start" alignItems="center" >
        <Grid item xs={2}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              inputVariant="outlined"
              format="DD/MM/YYYY"
              value={filter.startDate || null}
              variant="outlined"
              label="Từ ngày"
              margin="dense"
              required
              name="startDate"
              onChange={e => handleChangeFilter(e, true)}
            />
          </MuiPickersUtilsProvider> */}
          {/* {errorStartDateEndDate ? <p style={{ color: 'red', margin: '0px' }}>{errorTextStartDate}</p> : null} */}
        {/* </Grid>
        <Grid item xs={2}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              inputVariant="outlined"
              format="DD/MM/YYYY"
              value={filter.endDate || null}
              variant="outlined"
              label="Đến ngày"
              margin="dense"
              required
              name="endDate"
              onChange={e => handleChangeFilter(e, false)}
            />
          </MuiPickersUtilsProvider> */}
          {/* {errorStartDateEndDate ? <p style={{ color: 'red', margin: '0px' }}>{errorTextEndDate}</p> : null} */}
        {/* </Grid>
      </Grid> */}
      {/* <Grid item xs={2}>
            <DepartmentAndEmployee
              department={filter.organizationUnit}
              // disableEmployee
              onChange={handleChangeDepartment}
              moduleCode="LoginLog"
              profile={props.profile}
            />
          </Grid> */}

      <Grid item xs={12}>
        {(filter.startDate && filter.endDate) || (!filter.startDate && !filter.endDate) ? (
          <ListPage
            filterStartEnd={['startDate', 'endDate']}
            apiUrl={API_LOGOUT}
            filter={filter}
            code="LoginLog"
            mapFunction={customFunction}
            disableAdd
            disableEdit
            disableSelect
            disableImport
            inSwipeable
            noFilterStatus
            showExport
            exportExcel
          />
        ) : (
          <ListPage filterStartEnd code="LoginLog" noFilterStatus noData />
        )}
      </Grid>
    </React.Fragment>
  );
}

export default memo(HistoryLoginUser);
