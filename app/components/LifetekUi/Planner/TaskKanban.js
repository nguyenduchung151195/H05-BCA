/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-alert */

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import makeSelectDashboardPage, { makeSelectProfile } from 'containers/Dashboard/selectors';
// eslint-disable-next-line import/no-unresolved
import ViewContent from 'components/ViewContent/Loadable'
import './kanban.css';
import {
  // ArrowBackIos,
  // ArrowForwardIos,
  // Done,
  // Close,
  Add,
  Notifications,
  Description,
  AttachFile,
  Comment as InsertCommentOutlined,
  // ModeComment,
  Assignment,
  MoreVert,
  Star,
  InsertDriveFile,
  Delete,
  Image,
  ImportExport,
  Archive,
  FilterList,
  Search,
  VerticalSplit,
  Check,
} from '@material-ui/icons';
// import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Snackbar from 'components/Snackbar';
import {
  Avatar,
  Tooltip,
  Button,
  Menu,
  Checkbox,
  MenuItem,
  Grid,
  Fab,
  Paper,
  Typography,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@material-ui/core';
import AddTask from 'containers/AddProjects';
// import AddProjects from 'containers/AddProjects';
import { serialize, priotyColor, taskPrioty, taskPriotyColor, groupBy, fetchData, tableToExcel } from '../../../helper';
import avatarDefault from '../../../assets/img/default-avatar.png';
import Dialog from '../Dialog';
import { SwipeableDrawer, AsyncAutocomplete, Loading, TextField } from '..';
import Comment from '../Comment';
// import AutoComplete from '../LtAutocomplete';
import { API_TASK_PROJECT, UPLOAD_IMG_SINGLE, API_USERS, API_ORIGANIZATION, API_SAMPLE_PROCESS } from '../../../config/urlConfig';
import DepartmentAndEmployee from '../../Filter/DepartmentAndEmployee';
import ExcelTable from '../../ExcelTable';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import CustomInputBase from '../../Input/CustomInputBase';
import lodash from 'lodash';

const limit = 20;
function PlanDemo(props) {
  const { apiUrl, addItem, reload, code, filterItem, profile, id, showTemplate, listTab, history } = props;


  const categoryTask = JSON.parse(localStorage.getItem('taskStatus')).find(item => item.code === 'TASKTYPE').data;
  const ignore = React.useState([])[0];
  const [snackbar, setSnackbar] = React.useState({ variant: 'success', message: 'Cập nhật thành công', open: false });
  const [columns, setColumns] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef(null);
  const [data, setData] = React.useState({});
  const [dataCount, setDataCount] = React.useState({});
  const [dataNoFormat, setDataNoFormat] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [taskItem, setTaskItem] = React.useState({ priority: 1 });
  const [category, setCategory] = React.useState(0);
  const [employee, setEmployee] = React.useState(null);
  const [searchInput, setSearchInput] = React.useState('');
  const searchEl = React.useRef(null);
  const [origin, setOrigin] = React.useState('');
  const [project, setProject] = React.useState(null);
  const [template, setTemplate] = React.useState(null);
  const [innerFilterItem, setInnerFilterItem] = React.useState(filterItem);
  const [projectFilter, setProjectFilter] = React.useState({ isProject: true });

  const firstDayOfMonth = moment()
    .clone()
    .startOf('quarter')
    .format('YYYY-MM-DD');
  const [time, setTime] = useState({ startDate: firstDayOfMonth, endDate: moment().endOf('quarter').format('YYYY-MM-DD') });
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');

  const [dialogPlanFilter, setDialogPlanFilter] = React.useState(false);
  const [windowHeight, setWindowHeight] = React.useState(null);
  const [windowWidth, setwindowWidth] = React.useState(null);
  const [agreeCategory, setAgreeCategory] = React.useState(0);
  const [agreeTime, setAgreeTime] = React.useState({ startDate: '', endDate: '' });
  const [filters, setFilters] = React.useState('quarter');
  const [openDialogTask, setOpenDialogTask] = React.useState(null);
  const [viewType, setViewType] = React.useState('task');
  const [isReset, setIsReset] = React.useState(null);
  const [allowAdd, setAllowAdd] = React.useState(false);
  const [allowEdit, setAllowEdit] = React.useState(false);
  // console.log('filter', props.filter)

  const [third] = React.useState([
    {
      value: 'quarter',
      label: 'Quý',
    },
    {
      value: 'month',
      label: 'Tháng',
    },
    {
      value: 'week',
      label: 'Tuần',
    },
  ]);

  let timeout = 0;
  useEffect(() => {
    if (props.dashboardPage.role && props.dashboardPage.role.roles && props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Task')) {
      const roleCode = props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Task');
      const roleModule = roleCode.methods ? roleCode.methods : [];
      setAllowAdd((roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow);
      setAllowEdit((roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow);
    }

  }, [props.dashboardPage]);

  useEffect(
    () => {
      setInnerFilterItem(filterItem);
    },
    [filterItem],
  );
  useEffect(
    () => {
      loadData();
    },
    [reload, agreeCategory, employee, searchInput, origin, id, project, agreeTime, time, viewType],
  );

  useEffect(
    () => {
      if (showTemplate) {
        const { template: currentTemplate, ...newProjectFilter } = projectFilter;
        if (template) {
          newProjectFilter.template = template._id;
        }
        setProjectFilter(newProjectFilter);
        loadData();
      }
    },
    [template],
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setwindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function loadData(load = false) {
    // console.log('template', template);
    if (id || template) loadDataProject(load);
    else reloadData(load);
  }

  function handleSearch(e) {
    const search = e.target.value;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setSearchInput(search);
    }, 500);
  }

  async function handleLoadMore(id, page) {
    if (template && template._id) return;
    try {
      // const filter = {
      //   [innerFilterItem]: id,
      //   $or: [
      //     //{ leafIndex: { $exists: true } },
      //     { template: { $exists: false } },
      //     { template: null },
      //     { isSmallest: true }
      //   ],
      // };
      const filter = { ...props.filter };
      filter.status = 1;
      // filter.taskStatus = { $not: { $in: ignore } };
      // filter.isSmallest = true;
      category ? (filter.category = category) : null;
      if (employee) filter.join = { $in: employee._id };
      if (origin) filter.organizationUnit = origin;
      if (searchInput) filter.name = { $regex: searchInput, $options: 'gi' };
      const filterDate = {};
      if (time.startDate) {
        filterDate.$gte = moment(time.startDate)
          .startOf('day')
          .toISOString();
      }
      if (time.endDate) {
        filterDate.$lte = moment(time.endDate)
          .endOf('day')
          .toISOString();
      }
      if (time.startDate || time.endDate) {
        filter.startDate = filterDate;
      }

      if (project) filter.projectId = { $in: [project._id] };

      const query = serialize({ filter });

      const api = `${apiUrl}/kanban?${query}&skip=${(page - 1) * limit}&limit=${limit}&noData=true`;
      // console.log('api', api);

      const dt = await fetchData(api);
      // const dtResult = groupBy(dt.data, newFilterItem);
      // setData(dtResult);
      return dt.data;
    } catch (error) {
      return [];
    }
  }

  async function reloadData(load = true) {
    setLoading(true);
    setIsReset(true);
    try {
      // const filter = {
      //   $or: [
      //     { leafIndex: { $exists: true } },
      //     { template: { $exists: false } },
      //     { template: null },
      //     { isSmallest: true }
      //   ],
      // };
      const filter = { ...props.filter };
      // console.log('filter2',filter);
      // console.log('filter3',props.filter);
      filter.status = 1;
      // filter.taskStatus = { $not: { $in: ignore } };
      filter.isSmallest = true;
      category ? (filter.category = category) : null;
      if (employee) filter.join = { $in: employee._id };
      if (origin) filter.organizationUnit = { $in: origin };
      if (searchInput) filter.name = { $regex: searchInput, $options: 'gi' };
      if (time.startDate) {
        filter.startDate = {
          $gte: moment(time.startDate)
            .startOf('day')
            .toISOString(),
        };
      }
      if (time.endDate) {
        filter.endDate = {
          $lte: moment(time.endDate)
            .endOf('day')
            .toISOString(),
        };
      }
      if (viewType === 'task') {
        filter.isSmallest = true;
      }
      if (viewType === 'project') {
        filter.isSmallest = false;
      }
      let newFilterItem;
      if (template) {
        filter.template = template._id;
        newFilterItem = 'kanbanCode';
      } else {
        newFilterItem = filterItem;
      }

      setInnerFilterItem(newFilterItem);
      if (project) filter.projectId = { $in: [project._id] };

      const newColumns = JSON.parse(localStorage.getItem('taskStatus'))
        .find(item => item.code === code)
        .data.sort((a, b) => a.code - b.code);
      setColumns(newColumns);
      const responses = await Promise.all(
        newColumns.map(c => {
          filter[innerFilterItem] = c.type;
          const query = serialize({ filter });
          const api = `${apiUrl}/kanban?${query}&skip=0&limit=${limit}`;
          return fetchData(api);
        }),
      );
      let allData = [];
      const newDataCount = {};
      responses.forEach((item, index) => {
        newDataCount[newColumns[index].type] = item.count;
        allData = [...allData, ...item.data];
      });
      const dtResult = groupBy(allData, newFilterItem);
      setData(dtResult);
      setIsReset(null);
      setDataCount(newDataCount);
      // if (load === false) {
      //   const columns = JSON.parse(localStorage.getItem('taskStatus'))
      //     .find(item => item.code === code)
      //     .data.sort((a, b) => a.code - b.code);
      //   setColumns(columns);
      // }

      setLoading(false);
      // eslint-disable-next-line no-empty
    } catch (error) {
      setLoading(false);
    }
  }

  async function loadDataProject(load = true) {
    setLoading(true);
    const filter = {};
    filter.status = 1;
    let newInnerFilterItem = filterItem;
    if (id) {
      filter.projectId = id;
    } else {
      newInnerFilterItem = 'kanbanCode';
      filter.template = template._id;
    }
    if (category) filter.category = category;
    if (employee) filter.join = { $in: employee._id };
    if (searchInput) filter.name = { $regex: searchInput, $options: 'gi' };
    if (origin) filter.organizationUnit = { $in: origin };
    if (project) filter.projectId = project._id;
    if (time.startDate) {
      filter.startDate = {
        $gte: moment(time.startDate)
          .startOf('day')
          .toISOString(),
      };
    }
    if (time.endDate) {
      filter.endDate = {
        $lte: moment(time.endDate)
          .endOf('day')
          .toISOString(),
      };
    }
    let query = serialize({ filter });
    let api;
    if (id) {
      api = `${apiUrl}?${query}`;
    } else {
      api = `${apiUrl}/kanban?${query}`;
    }
    try {
      const dt = await fetchData(api);
      const responData = dt.data;
      const groupData = responData.filter(i => i.isSmallest === true);
      const dtResult = groupBy(groupData, newInnerFilterItem);
      setData(dtResult);
      if (load === false) {
        const columns = responData.find(item => item.isProject === true).kanban.map(i => ({ ...i, type: i.code }));
        setColumns(columns);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }
  function onDragEnd(result) {
    if (!allowEdit) {
      setSnackbar({
        variant: 'error',
        message: 'Đồng chí không có quyền chỉnh sửa',
        open: true,
      });
      return;
    }
    if (!result.destination) {
      return;
    }
    // debugger;
    const item = data[result.source.droppableId].find(i => i._id === result.draggableId);
    const inChargePlanFm = item && item.inChargePlan && item.inChargePlan.find(i => i._id === profile._id);
    const supportPlanFm = item && item.supportPlan && item.supportPlan.find(i => i._id === profile._id);

    // project kanban
    let newItem;

    const destinationCode = columns.find(i => i.type === result.destination.droppableId).code;
    if (item.taskStatus === destinationCode && result.destination.droppableId === result.source.droppableId) {
      return;
    }
    if (item.parentId && [4, 5, 6].includes(item.parentId.taskStatus)) {
      if (destinationCode !== item.taskStatus) {
        setSnackbar({
          variant: 'error',
          message: 'Dự án cha đang ở trạng thái Đóng/Tạm dừng hoặc không thực hiện, đồng chí cần truy cập vào dự án để cập nhật lại tiến độ ',
          open: true,
        });
        return;
      }
    }

    if (id || template) {
      newItem = { ...item, [innerFilterItem]: result.destination.droppableId };
    } else {
      newItem = { ...item, [innerFilterItem]: result.destination.droppableId, taskStatus: destinationCode };
      if (destinationCode === 3) newItem.progress = 100;
    }

    const newData = { ...data };
    newData[result.source.droppableId] = newData[result.source.droppableId].filter(i => i._id !== result.draggableId);
    if (!newData[result.destination.droppableId]) newData[result.destination.droppableId] = [];
    newData[result.destination.droppableId] = newData[result.destination.droppableId].concat(newItem);
    setData(newData);

    if (id || template) {
      updateField(newItem);
      return;
    }

    if (
      item.taskStatus !== destinationCode ||
      (item.taskStatus === destinationCode && result.destination.droppableId !== result.source.droppableId)
    ) {
      if ((item.createdBy._id === profile._id)) {
        if (destinationCode === 2 || destinationCode === 1) {
          setSnackbar({
            variant: 'error',
            message: 'Đồng chí không có quyền thay đổi trạng thái',
            open: true,
          });
          return;
        } else {
          updateProgress(newItem);
          return;
        }

      } else if (inChargePlanFm || supportPlanFm) {
        if (destinationCode === 3 || destinationCode === 1) {
          setSnackbar({
            variant: 'error',
            message: 'Đồng chí không có quyền thay đổi trạng thái',
            open: true,
          });
          return;
        } else {
          updateProgress(newItem);
          return;
        }

      }



    }

    updateKanbanStatus(newItem);
  }

  function updateField(item) {
    fetch(`${apiUrl}/${item._id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [innerFilterItem]: item[innerFilterItem] }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 1 || res.success) setSnackbar({ variant: 'success', message: 'Cập nhật thành công', open: true });
        else setSnackbar({ variant: 'error', message: 'Cập nhật thất bại', open: true });
        loadData();
      });
  }

  function updateKanbanStatus(item) {
    const updateData = url => {
      fetchData(`${url}/${item._id}`, 'PUT', item).then(res => {
        if (res.status === 1 || res.success) setSnackbar({ variant: 'success', message: 'Cập nhật thành công', open: true });
        else {
          setSnackbar({ variant: 'error', message: 'Cập nhật thất bại', open: true });
        }
        loadData();
      });
    };
    updateData(apiUrl);
  }
  function updateProgress(item) {
    const updateData = url => {
      const { taskStatus, priority, progress } = item;
      const data = { taskStatus, priority, progress };
      data[innerFilterItem] = item[innerFilterItem];
      data.taskId = item._id;
      const projectId = item.projectId ? item.projectId._id : item._id;
      fetchData(`${url}/progress/${projectId}`, 'POST', data).then(res => {
        if (res.status === 1) setSnackbar({ variant: 'success', message: 'Cập nhật thành công', open: true });
        else {
          setSnackbar({ variant: 'error', message: res.message || 'Cập nhật thất bại', open: true });
        }
        loadData();
      });
    };
    updateData(apiUrl);
  }

  function setCoverTask(id, type, avatar) {
    setSnackbar({ variant: 'success', message: 'Cập nhật ảnh cover thành công', open: true });
    const newData = { ...data };

    const newType = newData[type].map(i => (i._id === id ? { ...i, avatar } : i));

    newData[type] = newType;

    setData(newData);
  }

  const openDialog = React.useCallback(item => {
    setOpen(true);
    setTaskItem(item);
  }, []);

  function closeDialog() {
    setOpen(false);
  }

  function handleCategory(e) {
    setCategory(e.target.value);
  }

  function handleFilter(e) {
    setFilters(e.target.value);
    if (e.target.value === 'week') {
      const newTime = { startDate: moment().startOf('week'), endDate: moment().endOf('week') };
      setTime(newTime);
    } else if (e.target.value === 'month') {
      const newMonth = { startDate: moment().startOf('month'), endDate: moment().endOf('month') };
      setTime(newMonth);
    } else {
      const newQuarter = { startDate: moment().startOf('quarter'), endDate: moment().endOf('quarter') };
      setTime(newQuarter);
    }
  }

  function handleDepartmentAndEmployeeChange(data) {
    const { department, employee } = data;
    setOrigin(department);
    setEmployee(employee);
  }

  // const handleChangeTime = (e,isFirst, isDate) => {
  //   // const { target: { value, name } } = e;
  //   const name = isDate ? (isFirst ? 'startDate' : 'endDate') : e.target.name;
  //   const value = isDate ? (isFirst ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD')) : e.target.value;
  //   console.log('name',name)
  //   console.log('value',value)
  //   setTime({ ...time, [name]: value });
  // }
  const handleChangeTime = (e, isStartDate) => {
    const name = isStartDate ? 'startDate' : 'endDate';
    const value = isStartDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    // setTime({ ...time, [name]: value });
    const newFilter = { ...time, [name]: value };

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
    setTime(newFilter);
    // setFilter({ ...filter, [name]: value })
  };

  function handleChangeProject(e) {
    setProject(e);
  }

  function handleChangeTemplate(e) {
    setTemplate(e);
  }
  const onSaveDialog = () => {
    setAgreeCategory(category);
    setAgreeTime(time);
    setDialogPlanFilter(false);
  };

  function handleViewType(newViewType) {
    setViewType(newViewType);
    if (newViewType === 'project') {
      <Check />;
    }

    setOpenDialogTask(null);
  }
  const handleOpenTask = e => {
    setOpenDialogTask(e.currentTarget);
  };

  const handleClose = e => {
    setOpenDialogTask(null);
  };

  return (
    <Paper>
      <div className="kanban-main">
        <div style={{ zIndex: '9999', position: 'relative', top: '300px' }}>{loading && <Loading />}</div>
        <Dialog dialogAction={false} onClose={closeDialog} open={open}>
          <TaskDialog setCoverTask={setCoverTask} profile={profile} taskId={taskItem._id} filterItem={innerFilterItem} data={taskItem} />
        </Dialog>
        {/* <Grid container spacing={8}>
        <Grid style={{ width: '100%' }}>
          <Grid container spacing={16}>
            <Grid item style={{ width: 'calc(100%/8)' }}>
              <TextField onChange={handleSearch} ref={searchEl} placeholder="Tìm kiếm công việc" variant="outlined" fullWidth />
            </Grid>

          </Grid>

        </Grid>
      </Grid> */}
        <Grid container spacing={8} alignItems="center">
          <Grid item style={{ width: 'calc(60%/3)' }}>
            <TextField
              onChange={handleSearch}
              ref={searchEl}
              label="Tìm kiếm theo tên"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <Search />,
              }}
            />
          </Grid>
          {document.documentElement.clientWidth <= 1285 ? (
            <></>
          ) : (
            <Grid item style={{ marginLeft: 8, width: 'calc((60%/3)*2)' }}>
              <DepartmentAndEmployee

                disableDepartmentH05
                onChange={handleDepartmentAndEmployeeChange}
                employee={employee}
                department={origin}
                profile={profile}
                moduleCode="Task"
              />
            </Grid>
          )}
          <Grid item style={{ width: 'calc(60%/3)' }}>
            <CustomInputBase onChange={handleFilter} select value={filters} label="Thời gian" variant="outlined" fullWidth margin="dense">
              {third.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </CustomInputBase>
          </Grid>
          <Grid item>
            <Fab onClick={() => setDialogPlanFilter(true)} color="primary" style={{ marginLeft: 15, width: 40, height: 40, minWidth: 40 }}>
              <Tooltip title="Xem thêm filter">
                <FilterList />
              </Tooltip>
            </Fab>
          </Grid>
          {/* <Grid item style={{ textAlign: 'right', flex: 'auto' }}>
            <Fab color="primary" style={{ marginLeft: 15, width: 40, height: 40, minWidth: 40 }}>
              <Tooltip title="Công việc">
                <VerticalSplit onClick={handleOpenTask} />
              </Tooltip>
            </Fab>
          </Grid> */}
          <Menu open={Boolean(openDialogTask)} anchorEl={openDialogTask} onClose={handleClose}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              {viewType === 'task' ? <Check /> : null}
              <MenuItem style={{ flex: 'auto' }} value="task" onClick={e => handleViewType('task')}>
                Công việc
              </MenuItem>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              {viewType === 'project' ? <Check /> : null}
              <MenuItem style={{ flex: 'auto' }} value="project" onClick={e => handleViewType('project')}>
                Dự án
              </MenuItem>
            </div>
          </Menu>

          {/* <Grid item style={{ width: 'calc(95%/8)' }}>
          <TextField value={category} select fullWidth onChange={handleCategory} label="Loại công việc">
            <MenuItem value={0}>---Chọn---</MenuItem>
            {categoryTask.map((item, index) => (
              <MenuItem value={index + 1}>{item.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item style={{ width: 'calc((95%/8)*2)' }}>
          <DepartmentAndEmployee onChange={handleDepartmentAndEmployeeChange} employee={employee} department={origin} profile={profile} moduleCode="Task" />
        </Grid> */}
          {/* <Grid item style={{ width: 'calc(95%/8)' }}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker 
            inputVariant="outlined"
            format="DD/MM/YYYY"
            variant="outlined"
            label="Từ ngày"  value={time.startDate} onChange={e => handleChangeTime(e, true)} name="startDate" fullWidth InputLabelProps={{
              shrink: true,
            }} />
          </MuiPickersUtilsProvider>
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextStartDate}</Typography> : null}
        </Grid>
        <Grid item style={{ width: 'calc(95%/8)' }}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker 
            inputVariant="outlined"
            format="DD/MM/YYYY"
            variant="outlined"
            label="Đến ngày"  value={time.endDate} onChange={e => handleChangeTime(e, false)} name="endDate" fullWidth InputLabelProps={{
              shrink: true,
            }} />
          </MuiPickersUtilsProvider>
          {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
        </Grid> */}
          <Dialog onClose={() => setDialogPlanFilter(false)} onSave={onSaveDialog} saveText="LƯU" open={dialogPlanFilter}>
            {document.documentElement.clientWidth <= 1285 ? (
              <Grid item style={{ width: '100%' }}>
                <DepartmentAndEmployee
                  onChange={handleDepartmentAndEmployeeChange}
                  employee={employee}
                  department={origin}
                  profile={profile}
                  moduleCode="Task"
                  disableDepartmentH05
                />
              </Grid>
            ) : null}
            {showTemplate ? (
              <Grid item style={{ width: '100%' }}>
                <AsyncAutocomplete label="Quy trình" onChange={handleChangeTemplate} url={API_SAMPLE_PROCESS} value={template} />
              </Grid>
            ) : null}
            {/* {!id ? (
              <Grid item style={{ width: '100%' }}>
                <AsyncAutocomplete value={project} label="Dự án" onChange={handleChangeProject} filter={projectFilter} url={API_TASK_PROJECT} />
              </Grid>
            ) : null} */}
            <Grid item style={{ width: '100%' }}>
              <TextField value={(category !== 0 ? category : agreeCategory) || 0} select fullWidth onChange={handleCategory} label="Loại công việc">
                <MenuItem value={0}>---Chọn---</MenuItem>
                {categoryTask.map((item, index) => (
                  <MenuItem value={index + 1}>{item.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item style={{ width: '100%', margin: '8px 0' }}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  variant="outlined"
                  label="Từ ngày"
                  value={time.startDate}
                  onChange={e => handleChangeTime(e, true)}
                  name="startDate"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>
              {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextStartDate}</Typography> : null}
            </Grid>
            <Grid item style={{ width: '100%', margin: '8px 0' }}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  variant="outlined"
                  label="Đến ngày"
                  value={time.endDate}
                  onChange={e => handleChangeTime(e, false)}
                  name="endDate"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>
              {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
            </Grid>
          </Dialog>
          {/* <Grid item style={{flex: '1 1 auto', textAlign: 'right'}}>
          <button onClick={() => {
            tableToExcel('excel-table-task', 'W3C Example Table');
          }}><Tooltip title="Xuất dữ liệu">
              <Fab color="primary" size="small">
                <Archive  />
              </Fab></Tooltip></button>
        </Grid> */}
        </Grid>
        {/* <div className="toolbar-kanban">
        <div>
          <TextField onChange={handleSearch} ref={searchEl} placeholder="Tìm kiếm công việc" variant="outlined" fullWidth />
        </div>
        <div style={{ display: 'flex' }}>
          {!id ? (
            <div style={{ width: '20em', marginLeft: 10 }}>
              <AsyncAutocomplete value={project} label="Dự án" onChange={handleChangeProject} url={API_TASK_PROJECT} />
            </div>
          ) : null}
          <div>
            <AsyncAutocomplete
              label="Quy trình"
              onChange={handleChangeTemplate}
              url={API_SAMPLE_PROCESS}
              value={template}
            />
          </div>
          <div>
            <TextField value={category} select style={{ width: '20em', marginLeft: 10 }} onChange={handleCategory} label="Loại công việc">
              <MenuItem value={0}>---Chọn---</MenuItem>
              {categoryTask.map((item, index) => (
                <MenuItem value={index + 1}>{item.name}</MenuItem>
              ))}
            </TextField>
          </div>
          <div style={{ width: '48em', marginLeft: '10px' }}>
            <DepartmentAndEmployee onChange={handleDepartmentAndEmployeeChange} employee={employee} department={origin} />
          </div>
        </div>
      </div> */}

        <DragDropContext onDragEnd={onDragEnd}>
          <div ref={containerRef} className="kanban-container">
            {columns.map(item => (
              <Column
                reloadData={reloadData}
                openDialog={openDialog}
                isReset={isReset}
                addItem={addItem}
                id={item.type}
                code={item.code}
                count={dataCount[item.type]}
                onLaneScroll={handleLoadMore}
                // eslint-disable-next-line eqeqeq
                noLoadmore={template && template._id}
                data={data[item.type]}
                name={item.name}
                color={item.color}
                allowAdd={allowAdd}
                allowEdit={allowEdit}
                history={history}
              />
            ))}
          </div>
        </DragDropContext>
        <Snackbar
          variant={snackbar.variant}
          open={snackbar.open}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
        <ExcelTable data={dataNoFormat} columns={columns} />
      </div>
    </Paper>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
});
const withConnectComment = connect(mapStateToProps);

export default withConnectComment(PlanDemo);
const Column = React.memo(props => {
  const { color, name, data, id, addItem, openDialog, code, reloadData, count, noLoadmore, isReset, allowAdd, allowEdit, history } = props;
  const [loading, setLoading] = React.useState(false);
  const [innerData, setInnerData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [canNext, setCanNext] = React.useState(true);

  useEffect(
    () => {
      if (!Array.isArray(data)) {
        return setInnerData([]);
      }
      setInnerData(data);
    },
    [data],
  );

  useEffect(
    () => {
      if (isReset === true) {
        setPage(1);
        setCanNext(true);
        setInnerData([]);
        setLoading(false);
      }
    },
    [isReset],
  );
  return (
    <div className="kanban-column">
      <div className="main-kanban-column-title">
        <div className="main-kanban-column-title-wrapper main-kanban-column-title-dark">
          <div className="main-kanban-column-title-bg" style={{ background: color }} />
          <div className="main-kanban-column-title-info">
            <div className="main-kanban-column-title-text">
              <div className="main-kanban-column-title-text-inner">{name}</div>
              <div className="main-kanban-column-total-item">({noLoadmore ? innerData.length : count || 0})</div>
            </div>
          </div>
          <span className="main-kanban-column-title-right">
            <svg xmlns="http://www.w3.org/2000/svg" width={13} height={32} viewBox="0 0 13 32">
              <path fill={color} fillOpacity={1} d="M0 0h3c2.8 0 4 3 4 3l6 13-6 13s-1.06 3-4 3H0V0z" />
            </svg>
          </span>
        </div>
        <div className="main-kanban-column-title-add-column" />
      </div>
      {allowAdd ? (
        <div className="main-kanban-column-subtitle">
          <Add onClick={() => addItem(id, code)} style={{ cursor: 'pointer', color: '#2196F3', fontSize: '1.5rem', fontWeight: 'bold' }} />
        </div>
      ) : null}
      <Droppable droppableId={id}>
        {provided => (
          <div
            ref={provided.innerRef}
            onScroll={evt => {
              if (!canNext) return;
              const node = evt.target;
              const elemScrollPosition = node.scrollHeight - node.scrollTop - node.clientHeight;
              const onLaneScroll = props.onLaneScroll; // In some browsers and/or screen sizes a decimal rest value between 0 and 1 exists, so it should be checked on < 1 instead of < 0
              if (elemScrollPosition < 2 && onLaneScroll && !loading) {
                setLoading(true);
                onLaneScroll(id, page + 1).then(moreCards => {
                  if (moreCards && moreCards.length) {
                    setInnerData(lodash.uniqBy([...innerData, ...moreCards], '_id'));
                    setPage(page + 1);
                  } else {
                    setCanNext(false);
                  }
                  // console.log('moreCards', moreCards);
                  setLoading(false);
                });
              }
            }}
            className="main-kanban-column-body"
          >
            {innerData &&
              innerData.map((item, index) => <Item reloadData={reloadData} openDialog={openDialog} key={item._id} index={index} data={item} allowEdit={allowEdit} history={history} />)}
            {provided.placeholder}
            {loading && 'Đang tải dữ liệu...'}
          </div>
        )}
      </Droppable>
    </div>
  );
});

Column.defaultProps = { color: '#00c4fb' };

const Item = React.memo(({ data, index, openDialog, reloadData, allowEdit, history }) => {
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  function closeDialog() {
    setOpen(false);
  }
  const handleCloseEdit = () => {
    setOpenModal(false)
  };

  function openDialogItem() {
    if (!allowEdit) {
      setOpenModal(true)
      setOpen(false);
    }
    else (setOpen(true));
  }
  const openTitleDialog = id => {
    history.push(`Task/${id}`);
  };

  return (
    <React.Fragment>
      <Draggable index={index} draggableId={data._id}>
        {(provided, snapshot) => (
          <div
            className="main-kanban-item"
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            isGroupedOver={Boolean(snapshot.combineTargetFor)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="tasks-kanban-item">
              {/* {console.log('data.avatar', data.avatar)} */}
              {data.avatar ? (
                <div className="tasks-kanban-item-cover">
                  <img alt=" " src={data.avatar} />
                </div>
              ) : null}
              <p className="tasks-kanban-item-title" variant="subtile1" onClick={_id => openTitleDialog(data._id)}>
                {data.name}
              </p>

              {data.projectId ? <p>Dự án: {data.projectId.name}</p> : null}
              <p>Tiến độ: {(data.progress * 1).toFixed(2)}%</p>
              <p>
                Ưu tiên: <span style={{ color: priotyColor[data.priority - 1] }}>{taskPrioty[data.priority - 1]}</span>
              </p>

              <div className="footer-kanban-item">
                <button type="button" className="footer-kanban-item-time">
                  <Notifications style={{ fontSize: '1rem' }} />{' '}
                  {new Date(data.endDate).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
                </button>
                <InsertCommentOutlined style={{ cursor: 'pointer' }} onClick={() => openDialog(data)} />
                <Join joins={data.join} />
              </div>
            </div>
          </div>
        )}
      </Draggable>
      <Dialog
        title="Xem công việc/dự án"
        // onSave={this.handleSaveData}
        onClose={handleCloseEdit}
        open={openModal}
        dialogAction={false}
      >
        <ViewContent code="Task" id={data._id} />
      </Dialog>
      <SwipeableDrawer onClose={closeDialog} open={open} width={window.innerWidth - 260}>
        <AddTask id={data._id} reloadData={reloadData} onClose={closeDialog} />
      </SwipeableDrawer>
    </React.Fragment>
  );
});

function Join({ joins, add, onAdd }) {
  const length = joins.length;
  const [anchorEl, setAnchorEl] = React.useState(null);
  switch (length) {
    case 0:
      return add ? <Add onClick={onAdd} /> : null;
    case 1:
    case 2:
    case 3:
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          {joins.map(i => (
            <Tooltip className="kanban-avatar" placement="top-start" key={i._id} title={i.name}>
              <Avatar alt="Nguyễn văn A" src={avatarDefault} srcSet={i.avatar === 'https://g.lifetek.vn:203/api/files/5f8684e931365b51d00afec6' ? avatarDefault : i.avatar} />
            </Tooltip>
          ))}
          {add ? (
            <span className="add-member">
              {' '}
              <Add onClick={onAdd} />{' '}
            </span>
          ) : null}
          <div style={{ height: 30, width: 10 }} />
        </div>
      );
    default:
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
          <Tooltip className="kanban-avatar kanban-avatar-firt" placement="top-start" title={joins[0].name}>
            <Avatar alt={joins[0].name} src={avatarDefault} srcSet={joins[0].avatar === 'https://g.lifetek.vn:203/api/files/5f8684e931365b51d00afec6' ? avatarDefault : joins[0].avatar} />
          </Tooltip>
          <Tooltip className="kanban-avatar" placement="top-start" title={joins[1].name}>
            <Avatar alt={joins[1].name} src={avatarDefault} srcSet={joins[1].avatar === 'https://g.lifetek.vn:203/api/files/5f8684e931365b51d00afec6' ? avatarDefault : joins[1].avatar} />
          </Tooltip>
          <Tooltip className="kanban-avatar" placement="top-start" title={joins[2].name}>
            <Avatar alt={joins[2].name} src={avatarDefault} srcSet={joins[2].avatar === 'https://g.lifetek.vn:203/api/files/5f8684e931365b51d00afec6' ? avatarDefault : joins[2].avatar} />
          </Tooltip>

          {add ? (
            <span className="add-member">
              {' '}
              <Add onClick={onAdd} />{' '}
            </span>
          ) : null}
          <span onClick={e => setAnchorEl(e.currentTarget)} style={{ fontWeight: 'bold', padding: 5 }}>
            +{length - 3}
          </span>
          <div style={{ height: 55, width: 10 }} />
          <Menu onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)} anchorEl={anchorEl}>
            {joins.map(i => (
              <MenuItem key={i._id}>
                <Tooltip className="kanban-avatar" placement="top-start" title={joins[1].name}>
                  <Avatar alt={i.name} src={`${i.avatar}?allowDefault=true`} />
                </Tooltip>
                {i.name}
              </MenuItem>
            ))}
          </Menu>
        </div>
      );
  }
}

// TASK DIALOG

function TaskDialog(props) {
  const { data, taskId, profile, filterItem } = props;

  const [file, setFile] = React.useState([]);
  const [state, setState] = React.useState({ name: '', description: '', priority: 1, join: [] });
  const [fileReview, setFileReview] = React.useState(false);
  const [currentFile, setCurrentFile] = React.useState({ name: '', size: 0, originFile: '', type: '', url: '', taskId: '', fileName: '' });
  const [obImg, setObImg] = React.useState('');
  const [joins, setJoins] = React.useState([]);

  useEffect(() => {
    const taskPromise = fetch(`${API_TASK_PROJECT}/${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const projectId = data.projectId ? data.projectId._id : data._id;
    const projectPromise = fetch(`${API_TASK_PROJECT}/${projectId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const filePromise = fetch(`${API_TASK_PROJECT}/file/${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    // Promise.all([taskPromise, filePromise, projectPromise]).then(respon => {
    //   Promise.all(respon.map(i => i.json())).then(dt => {
    //     setState(dt[0]);
    //     setFile(dt[1]);
    //     setJoins(dt[2].join);
    //   });
    // });
  }, []);

  function changeFile(e) {
    const uploadData = e.target.files[0];
    const type = uploadData.type.includes('image') ? 'image' : 'doc';

    setCurrentFile({ fileName: uploadData.name, size: uploadData.size, originFile: uploadData.type, type, taskId, data: uploadData });
    if (type === 'image') {
      const preview = URL.createObjectURL(uploadData);
      setObImg(preview);
    }

    setFileReview(true);
  }

  // Lưu ảnh upload
  async function saveFileUpload() {
    const formData = new FormData();
    formData.append('file', currentFile.data);

    const respon = await fetch(UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    const dataRespon = await respon.json();
    const dataUpload = { ...currentFile, url: dataRespon.url, data: undefined };
    const dataResponTask = await fetch(`${API_TASK_PROJECT}/file/${taskId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataUpload),
    });
    const result = await dataResponTask.json();
    const newFile = file.concat(result);
    setFile(newFile);
    setFileReview(false);
  }

  return (
    <div className="task-dialog">
      <div className="task-dialog-content-section">
        <div className="task-dialog-content-row">
          <div className="task-section-header">
            <Assignment />
            <b className="task-dialog-name">{state.name}</b>
          </div>
        </div>
        {/* <div className="task-dialog-desctiption">Tech Startup Board Hot Backlog</div> */}
        <div className="task-dialog-user-label dialog-ct">
          <ListJoin joins={joins} join={state.join} />
          <div>
            <p>ƯU TIÊN</p>
            <span style={{ background: taskPriotyColor[props.data && props.data.priority - 1].color }} className="task-dialog-priority">
              {taskPriotyColor[props.data && props.data.priority - 1].name}
            </span>
          </div>
        </div>
      </div>

      <div className="task-dialog-content-section">
        <div className="task-dialog-content-row">
          <div className="task-section-header">
            <Description /> Mô tả
          </div>
        </div>

        <p className="dialog-ct">{data.description}</p>
      </div>
      <div className="task-dialog-content-section">
        <div className="task-dialog-content-row">
          <div className="task-section-header">
            <AttachFile /> Đính kèm
          </div>
          <div>
            <input onChange={changeFile} style={{ display: 'none' }} id="upload-file-task" type="file" />
            <label htmlFor="upload-file-task">
              <Button component="span" outlined color="primary">
                <Add /> Thêm Tệp đính kèm
              </Button>
            </label>
          </div>
        </div>
        <Dialog maxWidth="sm" onClose={() => setFileReview(false)} onSave={saveFileUpload} open={fileReview}>
          <div className="dialog-upload">
            <div className="dialog-upload-image">
              {currentFile.type === 'image' ? (
                <img alt="fd" style={{ width: '100%' }} src={obImg} />
              ) : (
                <InsertDriveFile style={{ fontSize: '3rem' }} />
              )}
            </div>
            <div className="dialog-upload-detail">
              <p>Thông tin file</p>
              <p>Tên file: {currentFile.fileName}</p>
              <p>
                Dung lượng :{currentFile.size}
                KB
              </p>
              <p>Loại file :{currentFile.type === 'image' ? 'Ảnh' : 'Tài liệu'}</p>
            </div>
          </div>
        </Dialog>
        <div className="attachment-list dialog-ct">
          {file.map(i => (
            <FileItem setCoverTask={props.setCoverTask} taskId={taskId} type={data[filterItem]} data={i} />
          ))}
        </div>
      </div>
      <div className="task-dialog-content-section">
        <div className="task-dialog-content-row">
          <div className="task-section-header">
            <InsertCommentOutlined />
            Thảo luận
          </div>
        </div>

        <Comment profile={profile} code="Task" id={taskId} />
      </div>
    </div>
  );
}

const ListJoin = React.memo(props => {
  const [anchorEl, setAnchorEl] = React.useState(false);
  return (
    <div className="task-dialog-user">
      <p>NGƯỜI THAM GIA</p>
      <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
        <Join add onAdd={e => setAnchorEl(e.currentTarget)} joins={props.join} />
      </span>
      <div className="task-dialog-user" />
      <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)}>
        {props.joins.map(i => (
          <MenuItem>
            <Checkbox color="primary" /> <Avatar style={{ width: 25, height: 25, margin: 5 }} src={`${i.avatar}?allowDefault=true`} /> {i.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
});

function FileItem({ data, taskId, type, setCoverTask }) {
  const [anchorEl, setAnchorEl] = React.useState(false);
  const [dialog, setDialog] = React.useState(false);

  function setCover() {
    // console.log('GGG');

    fetch(`${API_TASK_PROJECT}/${taskId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatar: data.url }),
    }).then(() => {
      setAnchorEl(null);
      setCoverTask(taskId, type, data.url);
    });
    // .catch(e => console.log(e));
  }

  return (
    <div className="attachment-item">
      <div className="attachmnet-item-picture">
        <Tooltip title={`Ngày tạo: ${new Date(data.createdAt).toLocaleString('vi')}`}>
          {data.type === 'image' ? (
            <img alt=" " onClick={() => setDialog(true)} src={data.url} />
          ) : (
            <InsertDriveFile style={{ fontSize: '2.5rem' }} />
          )}
        </Tooltip>
      </div>
      <div className="attachment-file-name">
        <span> {data.fileName}</span>
        <span>
          <Star style={{ fontSize: '1rem' }} /> {data.size} KB
        </span>
      </div>
      <MoreVert style={{ cursor: 'pointer' }} onClick={e => setAnchorEl(e.currentTarget)} />
      <Menu open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <MenuItem onClick={() => alert('Đồng chí không có quyền xóa file này')}>
          <Delete /> Xóa
        </MenuItem>
        {data.type === 'image' ? (
          <MenuItem onClick={setCover}>
            <Image /> Đặt ảnh bìa
          </MenuItem>
        ) : null}
      </Menu>
      <Dialog dialogAction={false} onClose={() => setDialog(false)} maxWidth="lg" open={dialog}>
        <img alt="ds" className="image-preview" src={data.url} />
      </Dialog>
    </div>
  );
}

PlanDemo.defaultProps = {
  filterItem: 'kanbanStatus',
  filterColumn: 'code',
  filter: {},
  code: 'KANBAN',
  module: 'taskStatus',
  reload: 0,
};
