/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * AddTask
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  MenuItem,
  Checkbox,
  Button,
  Avatar,
  TableRow,
  TableCell,
  TableHead,
  Table,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  CardMedia,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Buttons from 'components/CustomButtons/Button';
import { Info, MailOutline, Textsms, Edit, Add, SaveAlt, Update, BusinessCenter, AddPhotoAlternate } from '@material-ui/icons';
import ListPage from 'components/List';
import { progressColumns, historyColumns, approvedColumns, replaceColumns, taskStatusArr, categoryTaskArr } from 'variable';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddTask from './selectors';
import { changeSnackbar } from '../Dashboard/actions';
import reducer from './reducer';
import saga from './saga';
import { TextField, Grid, Typography, Autocomplete, TextValidator, Comment, ProgressBar } from '../../components/LifetekUi';
import {
  getTask,
  handleChange,
  handleDiscount,
  postTask,
  getDefault,
  getTaskCurrent,
  putTask,
  onCloseTask,
  putProgress,
  mergeData,
  postTranfer,
  getDefaultProjectId,
  postFile,
  getParent,
} from './actions';
import { API_PROGRESS, API_TASK_PROJECT, API_TRANFER } from '../../config/urlConfig';
import { taskStatus, taskPrioty, priotyColor } from '../../helper';

import '../AddProjects/style.css';
import cover from '../../assets/img/task/task_cover_03.jpg';
/* eslint-disable react/prefer-stateless-function */
function KanbanStep(props) {
  const { kanbanStatus } = props;
  // eslint-disable-next-line eqeqeq
  const idx = props.currentStatus.findIndex(i => i.type == kanbanStatus);
  return (
    <Stepper activeStep={idx}>
      {props.currentStatus.map(item => (
        <Step onClick={() => props.handleStepper(item)} key={item.type}>
          <StepLabel style={{ cursor: 'pointer' }}>{item.name}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

function People({ people }) {
  const lenght = people.length;
  return (
    <React.Fragment>
      {people.map(
        (person, index) =>
          index === lenght - 1 ? (
            <span>
              <Link to={`/setting/Employee/add/${person._id}`}>{person.name}</Link>
            </span>
          ) : (
            <span>
              <Link to={`/setting/Employee/add/${person._id}`}>{person.name}</Link>,{' '}
            </span>
          ),
      )}
    </React.Fragment>
  );
}

function Files({ files }) {
  const lenght = files.length;
  return (
    <React.Fragment>
      {files.map(
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        (file, index) =>
          index === lenght - 1 ? (
            <span style={{ cursor: 'pointer' }} onClick={() => window.open(file.url)}>
              {file.name}
            </span>
          ) : (
            <span style={{ cursor: 'pointer' }} onClick={() => window.open(file.url)}>
              {file.name},{' '}
            </span>
          ),
      )}
    </React.Fragment>
  );
}
function TypographyDetail({ children, data }) {
  return (
    <div className="task-info-detail">
      <p>{children}:</p>
      <p>{data}</p>
    </div>
  );
}
export class AddTask extends React.Component {
  constructor(props) {
    super(props);
    const taskColumns = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'Task').listDisplay.type.fields.type.columns;
    const names = {};
    taskColumns.forEach(item => {
      names[item.name] = item.title;
    });

    const listCrmStatus = JSON.parse(localStorage.getItem('taskStatus'));
    const currentStatus = listCrmStatus.find(i => i.code === 'KANBAN').data.sort((a, b) => a.code - b.code);
    this.state = {
      tabIndex: 0,
      tab: 0,
      openDialog: false,
      openDialogProgress: false,
      taskColumns: JSON.parse(localStorage.getItem('viewConfig'))
        .find(item => item.code === 'Task')
        .listDisplay.type.fields.type.columns.map(item => ({ ...item, name: item.name.replace(/\./g, '_') })),
      kanbanSteppers: currentStatus,
    };
  }

  mergeData = data => this.props.mergeData(data);

  componentDidMount() {
    this.props.getTask();
    if (this.props.taskData) {
      this.props.getParent(this.props.taskData.parentId);
    }
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (id === 'add') this.props.getDefault(this.props.taskData);
    else this.props.getTaskCurrent(id);
  }

  mapFunctionTranfer = (item, index) => ({
    ...item,
    index: index + 1,
    // currentEmployees: item.currentEmployees ? `${item.currentEmployees.map(elm => elm.name)},` : null,
    // tranferEmployees: item.tranferEmployees ? `${item.tranferEmployees.map(elm => elm.name)},` : null,
    type: item.type === 1 ? 'Người phụ trách' : 'Người tham gia',
  });

  mapFunction = (item, index) => ({
    ...item,
    index: index + 1,
    // approved: item.approved ? item.approved.name : null,
    // join: item.join ? item.join.map(elm => elm.name) : null,
  });

  mapFunction1 = (item, index) => ({
    ...item,
    updatedBy: item.updatedBy ? item.updatedBy.name : null,
    index: index + 1,
    taskId: item.taskId ? item.taskId.name : null,
  });

  mapFunction2 = (item, index) => ({
    ...item,
    index: index + 1,
    // approved: item.approved ? item.approved.name : null,
    taskStatus:
      item.taskStatus === 1 ? 'Đang thực hiện' : item.taskStatus === 2 ? 'Hoàn thành' : item.taskStatus === 3 ? 'Đóng dùng' : 'Không thực hiện',
    pheduyet:
      item.taskStatus === 2 ? (
        <Button variant="outlined" color="primary">
          Phê duyệt
        </Button>
      ) : (
        'Chờ phê duyệt'
      ),
  });

  findChildren(data) {
    data.forEach(item => {
      const child = data.filter(ele => ele.parentId === item._id);
      if (child.length) {
        item.data = child;
      }
    });
  }

  mapItem(rows, result = []) {
    rows.forEach(item => {
      result.push(
        <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
          {item.name}
        </MenuItem>,
      );
      if (item.data) {
        this.mapItem(item.data, result);
      }
    });
    return result;
  }

  general = names => {
    const { addTask, intl } = this.props;
    const { employees, customers, remember } = addTask;
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    return (
      <Grid container>
        {/* <div style={{ width: '100%' }}>
          <label htmlFor="contained-button-file">
            <Tooltip title="Thay đổi ảnh cover dự án">
              <AddPhotoAlternate style={{ cursor: 'pointer', float: 'right' }} />
            </Tooltip>
          </label>
        </div> */}
        <Grid item md={6} style={{ padding: 4 }}>
          <Typography variant="h5" color="primary" style={{ display: 'flex', alignItems: 'center' }}>
            <Info />
            Thông tin chính
          </Typography>
          {/* this.props.module từ tất cả cac modul co nút thêm công việc cần bắn tên vào trường name */}
          {this.props.module === 'revenueAndExpenditure' ? (
            <TextValidator
              validators={['required']}
              errorMessages={['Không được bỏ trống']}
              fullWidth
              required
              label={names.name}
              onChange={e => this.handleChange('name', e.target.value)}
              value={this.props.data.reason ? this.props.data.reason : this.props.data.name}
              name="name"
            />
          ) : (
            <TextValidator
              validators={['required']}
              errorMessages={['Không được bỏ trống']}
              fullWidth
              required
              label={names.name}
              onChange={e => this.handleChange('name', e.target.value)}
              value={addTask.name}
              name="name"
            />
          )}

          <TextField
            validators={['required']}
            errorMessages={['Không được bỏ trống']}
            required
            InputLabelProps={{ shrink: true }}
            type="datetime-local"
            label={names.startDate}
            value={addTask.startDate}
            name="startDate"
            onChange={e => this.handleChange('startDate', e.target.value)}
          />
          <TextField
            validators={['required']}
            errorMessages={['Không được bỏ trống']}
            required
            InputLabelProps={{ shrink: true }}
            style={{ marginLeft: 5 }}
            type="datetime-local"
            label={names.endDate}
            value={addTask.endDate}
            name="endDate"
            onChange={e => this.handleChange('endDate', e.target.value)}
          />
          <Autocomplete
            name="Chọn khách hàng..."
            label={names.customer}
            onChange={value => this.props.mergeData({ customer: value })}
            suggestions={customers.data}
            value={this.props.customerBos.customerId ? this.props.customerBos : addTask.customer}
          />
          <TextField value={addTask.category} label="Loại công việc" fullWidth onChange={e => this.handleChange('category', e.target.value)} select>
            {categoryTaskArr.map((it, idx) => (
              <MenuItem value={idx + 1} key={it}>
                {it}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label={names.priority}
            value={addTask.priority}
            name="priority"
            onChange={e => this.handleChange('priority', e.target.value)}
          >
            <MenuItem value={1}> {intl.formatMessage(messages.ratcao || { id: 'ratcao', defaultMessage: 'ratcao' })}</MenuItem>
            <MenuItem value={2}>{intl.formatMessage(messages.cao || { id: 'cao', defaultMessage: 'cao' })}</MenuItem>
            <MenuItem value={3}>{intl.formatMessage(messages.trungbinh || { id: 'trungbinh', defaultMessage: 'trungbinh' })}</MenuItem>
            <MenuItem value={4}>{intl.formatMessage(messages.thap || { id: 'thap', defaultMessage: 'thap' })}</MenuItem>
            <MenuItem value={5}>{intl.formatMessage(messages.ratthap || { id: 'ratthap', defaultMessage: 'ratthap' })}</MenuItem>
          </TextField>
          <TextField
            validators={['required']}
            errorMessages={['Không được bỏ trống']}
            required
            fullWidth
            select
            label={names.taskStatus}
            value={addTask.taskStatus}
            name="taskStatus"
            onChange={e => this.handleChange('taskStatus', e.target.value)}
          >
            {taskStatusArr.map((item, index) => (
              <MenuItem key={item} value={index + 1}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            multiline
            rowsMax="4"
            fullWidth
            label={names.description}
            name="description"
            value={addTask.description}
            onChange={e => this.handleChange('description', e.target.value)}
          />
          {intl.formatMessage(messages.nhacnhocongviec || { id: 'nhacnhocongviec', defaultMessage: 'nhacnhocongviec' })}
          <Checkbox color="primary" checked={remember} onChange={e => this.handleDiscount('remember', e.target.checked)} />
          {remember === true ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '50px' }}>
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                type="datetime-local"
                label={names.dateRemember}
                value={addTask.dateRemember}
                name="dateRemember"
                onChange={e => this.handleChange('dateRemember', e.target.value)}
                style={{ padding: 4 }}
              />
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                select
                label={names.rememberTo}
                value={addTask.rememberTo}
                name="rememberTo"
                onChange={e => this.handleChange('rememberTo', e.target.value)}
                style={{ padding: 4 }}
              >
                <MenuItem value={1}>Đến người có trách nhiệm</MenuItem>
                <MenuItem value={2}>Đến người tạo nhiệm vụ</MenuItem>
                <MenuItem value={3}>Tự nhắc nhở</MenuItem>
              </TextField>
              <div style={{ display: 'flex', padding: '0px 15px' }}>
                <span style={{ paddingRight: '10px' }}>
                  <MailOutline />
                </span>
                <Textsms />
              </div>
            </div>
          ) : null}
          <input onChange={this.onSelectImg} accept="image/*" style={{ display: 'none' }} id="contained-button-file" multiple type="file" />
        </Grid>
        <Grid item md={6} style={{ padding: 4 }}>
          <Typography variant="h5" color="primary" style={{ display: 'flex', alignItems: 'center' }}>
            <Info />
            Thông tin người tham gia
          </Typography>
          <Autocomplete
            isMulti
            name="Chọn người được xem..."
            label={names.viewable}
            onChange={value => this.props.mergeData({ viewable: value })}
            suggestions={employees.data}
            value={addTask.viewable}
          />
          <Autocomplete
            isMulti
            name="Chọn người phụ trách... "
            label={names.inCharge}
            onChange={value => this.props.mergeData({ inCharge: value })}
            suggestions={employees.data}
            value={addTask.inCharge}
          />
          <Autocomplete
            isMulti
            name="Chọn người hỗ trợ... "
            label={names.support}
            onChange={value => this.props.mergeData({ support: value })}
            suggestions={employees.data}
            value={addTask.support}
          />
          {id !== 'add' ? (
            <Autocomplete
              isMulti
              name="Chọn người tham gia... "
              label={names.join}
              onChange={this.selectJoin}
              suggestions={employees ? employees.data : []}
              value={addTask.join}
            />
          ) : null}
          {/* props.hiden ẩn phe duyet trong cong viec khong tao doanh thu */}
          {this.props.hiden !== 1 ? (
            <Autocomplete
              isMulti
              name="Chọn người phê duyệt..."
              label={names.approved}
              suggestions={employees ? employees.data : []}
              onChange={this.selectApproved}
              value={addTask.approved}
            />
          ) : null}
        </Grid>
      </Grid>
    );
  };

  onSelectImg = e => {
    const objectAvatar = URL.createObjectURL(e.target.files[0]);
    this.props.mergeData({ objectAvatar, avatar: e.target.files[0] });
  };

  handTab = index => {
    this.setState({ tabIndex: index });
    index === 4 ? this.props.mergeData({ type: 1 }) : '';
  };

  handleStepper = item => {
    this.props.mergeData({ kanbanStatus: item.type, taskStatus: item.code });
  };

  render() {
    const { tabIndex, tab, openDialog, openDialogProgress, kanbanSteppers } = this.state;
    const { addTask, intl } = this.props;
    const { employees, tasks, projects } = addTask;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const avt = addTask.objectAvatar || addTask.avatar || cover;
    this.findChildren(tasks); // đưa coogn việc về dạng cha con
    const names = {};
    this.state.taskColumns.forEach(item => {
      names[item.name] = item.title;
    });

    const tabMenu = [
      intl.formatMessage(messages.chitiet || { id: 'chitiet', defaultMessage: 'chitiet' }),
      intl.formatMessage(messages.coban || { id: 'coban', defaultMessage: 'coban' }),
      intl.formatMessage(messages.tiendo || { id: 'tiendo', defaultMessage: 'tiendo' }),
      intl.formatMessage(messages.tailieu || { id: 'tailieu', defaultMessage: 'tailieu' }),
      intl.formatMessage(messages.chuyencongviec || { id: 'chuyencongviec', defaultMessage: 'chuyencongviec' }),
    ];

    const day = (new Date(makeSelectAddTask.endDate) - new Date()) / 86400000;
    const dayProgress =
      ((new Date() - new Date(makeSelectAddTask.startDate)) * 100) /
      (new Date(makeSelectAddTask.endDate) - new Date(makeSelectAddTask.startDate)).toFixed();

    let fillColor = day > 0 ? 'blue' : 'red';
    if (makeSelectAddTask.taskStatus === 3) fillColor = 'green';
    const taskData = this.props.taskData ? this.props.taskData.parentTask : '';

    return (
      <div className="project-main">
        <img alt="anh du an" className="bg-img" src={avt} />
        <div className="bg-color" />
        <ValidatorForm onSubmit={this.onSave}>
          <div>
            <KanbanStep handleStepper={this.handleStepper} kanbanStatus={addTask.kanbanStatus} currentStatus={kanbanSteppers} />
          </div>

          {id === 'add' ? (
            <div>
              <Helmet>
                <title>{intl.formatMessage(messages.themmoicongviec || { id: 'themmoicongviec', defaultMessage: 'thêm mới' })}</title>
                <meta name="description" content="Description of TaskPage" />
              </Helmet>

              <Grid container>
                <Typography color="primary" variant="h5">
                  <Add />
                  {intl.formatMessage(messages.themmoicongviec || { id: 'themmoicongviec', defaultMessage: 'thêm mới' })}{' '}
                  {taskData ? `Thuộc " ${taskData.name} "` : null}
                </Typography>

                <Grid item md={12}>
                  <div>{this.general(names)}</div>
                </Grid>
              </Grid>
            </div>
          ) : (
            <div>
              <Helmet>
                <title>Task</title>
                <meta name="description" content="Description of TaskPage" />
              </Helmet>
              <Grid>
                <Typography color="primary" variant="h5" style={{ display: 'flex' }}>
                  <Edit />
                  {addTask.name}
                  {projects.find(elm => elm._id === addTask.projectId) ? (
                    <span style={{ marginLeft: 40 }}>
                      <BusinessCenter fontSize="large" /> {projects.find(elm => elm._id === addTask.projectId).name}
                    </span>
                  ) : null}
                  {addTask.join
                    ? addTask.join.map(elm => (
                        <Tooltip title={elm.name} placement="right-start" style={{ marginLeft: 40 }}>
                          <Avatar src={`${elm.avatar}?allowDefault=true`} />
                        </Tooltip>
                      ))
                    : null}
                </Typography>
                <div>
                  <div className="project-content">
                    {tabMenu.map((item, index) => (
                      <Buttons onClick={() => this.handTab(index)} color={index === tabIndex ? 'gradient' : 'simple'}>
                        {item}
                      </Buttons>
                    ))}
                  </div>
                  {tabIndex === 0 && (
                    <div>
                      <Grid container>
                        <Grid item md={5}>
                          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                            <Edit />
                            <Typography variant="h5">
                              {intl.formatMessage(messages.thongtinchitiet || { id: 'thongtinchitiet', defaultMessage: 'thongtinchitiet' })}
                            </Typography>
                          </Grid>
                          <TypographyDetail data={addTask.name}>{names.name} </TypographyDetail>
                          <TypographyDetail data={addTask.code}>Code </TypographyDetail>
                          <TypographyDetail data={addTask.customer ? addTask.customer.name : null}>{names.customer} </TypographyDetail>
                          <TypographyDetail data={addTask.startDate}>{names.startDate} </TypographyDetail>
                          <TypographyDetail data={addTask.endDate}>{names.endDate} </TypographyDetail>
                          <TypographyDetail data={taskStatus[addTask.taskStatus * 1 - 1]}>{names.taskStatus} </TypographyDetail>
                          <TypographyDetail
                            data={
                              projects.find(item => item._id === addTask.projectId)
                                ? projects.find(item => item._id === addTask.projectId).name
                                : null
                            }
                          >
                            Dự án
                          </TypographyDetail>
                          {/* <TypographyDetail data={<Process color="#ff0000" number={addTask.progress} />}>{names.progress}</TypographyDetail> */}

                          <TypographyDetail
                            data={<span style={{ color: priotyColor[addTask.priority * 1 - 1] }}>{taskPrioty[addTask.priority * 1 - 1]}</span>}
                          >
                            {names.priority}
                          </TypographyDetail>
                          <TypographyDetail data={addTask.createdBy ? addTask.createdBy.name : null}>{names.createdBy} </TypographyDetail>
                          <TypographyDetail data={addTask.description}>{names.description} </TypographyDetail>
                          <TypographyDetail data={<Files files={addTask.files} />}>Tài liệu đính kèm </TypographyDetail>

                          <Typography variant="h5">Thông tin người tham gia</Typography>
                          <TypographyDetail data={this.mapPeople(addTask.viewable)}>{names.viewable} </TypographyDetail>
                          <TypographyDetail data={this.mapPeople(addTask.inCharge)}>{names.inCharge} </TypographyDetail>
                          <TypographyDetail data={<People people={addTask.join} />}>{names.join}: </TypographyDetail>
                        </Grid>
                        <Grid className="progress-column" item md={3}>
                          <ProgressBar fillColor={fillColor} textCenter={`${addTask.progress.toFixed()}%`} progress={addTask.progress.toFixed()} />
                          <ProgressBar fillColor={fillColor} textCenter={`${day.toFixed()} ngày`} progress={dayProgress} />
                        </Grid>
                        <Grid item md={4}>
                          {/* <div className="img-detail"> */}
                          <Card>
                            <CardActionArea>
                              <CardMedia component="img" alt="Contemplative Reptile" image={avt} title="Contemplative Reptile" />
                              <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                  {addTask.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                  {addTask.description}
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                            <CardActions>
                              <Button size="small" color="primary">
                                Share
                              </Button>
                              <Button size="small" color="primary">
                                Learn More
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                        <Grid container md={12} style={{ display: 'block' }}>
                          <Grid item md={12}>
                            <div className="commnent-tilte">
                              <Typography variant="h5">Thảo luận</Typography>
                            </div>
                            <Comment profile={addTask.profile} taskId={id} />
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                  {tabIndex === 1 && <div>{this.general(names)}</div>}
                  {tabIndex === 2 && (
                    <div
                      className="my-3"
                      style={{
                        display: 'flex',
                      }}
                    >
                      <Grid container>
                        <Grid item md={12} style={{ display: 'flex', alignItems: 'baseline' }}>
                          <TextField
                            fullWidth
                            id="standard-select-currency"
                            select
                            label="Chọn công việc và dự án"
                            name="idSelect"
                            value={addTask.idSelect ? addTask.idSelect : addTask._id}
                            onChange={this.selectTask}
                            SelectProps={{
                              MenuProps: {},
                            }}
                            margin="normal"
                          >
                            {this.mapItem(tasks.filter(item => item._id === this.props.id))}
                          </TextField>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }} item md={12}>
                          <Button variant="outlined" color="primary" onClick={() => this.setState({ openDialogProgress: true })}>
                            <Update
                              style={{
                                marginRight: 5,
                                fontSize: '1.3rem',
                              }}
                            />
                            {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
                          </Button>
                        </Grid>
                        <Dialog open={openDialogProgress} onClose={this.handleDialogAdd}>
                          <DialogTitle id="alert-dialog-title">
                            {intl.formatMessage(messages.capnhattiendo || { id: 'capnhattiendo', defaultMessage: 'capnhattiendo' })}
                          </DialogTitle>
                          <DialogContent style={{ width: 600 }}>
                            <TextField
                              fullWidth
                              select
                              label={names.taskStatus}
                              value={addTask.taskStatus}
                              name="taskStatus"
                              onChange={e => this.handleChange('taskStatus', e.target.value)}
                            >
                              {taskStatusArr.map((item, index) => (
                                <MenuItem key={item} disabled={this.caculeDisable(index + 1)} value={index + 1}>
                                  {item}
                                </MenuItem>
                              ))}
                            </TextField>
                            {!addTask.tasks.find(item => item.parentId === addTask.idSelect) ? (
                              <TextField
                                fullWidth
                                id="standard-name"
                                label={names.progress}
                                margin="normal"
                                name="progress"
                                onChange={e => this.handleChange('progress', e.target.value)}
                                value={addTask.progress}
                                type="number"
                              />
                            ) : null}

                            <TextField
                              fullWidth
                              select
                              label={names.priority}
                              value={addTask.priority}
                              name="priority"
                              onChange={e => this.handleChange('priority', e.target.value)}
                            >
                              <MenuItem value={1}>Rất cao</MenuItem>
                              <MenuItem value={2}>Cao</MenuItem>
                              <MenuItem value={3}>Trung bình</MenuItem>
                              <MenuItem value={4}>Thấp</MenuItem>
                              <MenuItem value={5}>Rất thấp</MenuItem>
                            </TextField>
                            <TextField
                              fullWidth
                              id="standard-name"
                              label="Ghi chú"
                              margin="normal"
                              name="note"
                              onChange={e => this.handleChange('note', e.target.value)}
                              value={addTask.note}
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={this.onSaveProgress} variant="outlined" color="contained" autoFocus>
                              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                            </Button>
                          </DialogActions>
                        </Dialog>
                        <Grid item md={12} spacing={4} style={{ display: 'flex' }}>
                          <Typography style={{ fontWeight: 'bold' }}>
                            {' '}
                            {intl.formatMessage(messages.tiendovapheduyet || { id: 'tiendovapheduyet', defaultMessage: 'tiendovapheduyet' })}
                          </Typography>
                        </Grid>
                        <Grid item md={12} spacing={4}>
                          <div className="tab-contract">
                            <Buttons onClick={() => this.setState({ tab: 0 })} color={tab === 0 ? 'gradient' : 'simple'} size="sm">
                              {intl.formatMessage(messages.tiendo || { id: 'tiendo', defaultMessage: 'tiendo' })}
                            </Buttons>
                            <Buttons onClick={() => this.setState({ tab: 1 })} color={tab === 1 ? 'gradient' : 'simple'} size="sm">
                              {intl.formatMessage(messages.lichsu || { id: 'lichsu', defaultMessage: 'lichsu' })}
                            </Buttons>
                            <Buttons onClick={() => this.setState({ tab: 2 })} color={tab === 2 ? 'gradient' : 'simple'} size="sm">
                              {intl.formatMessage(messages.phesuyet || { id: 'phesuyet', defaultMessage: 'phesuyet' })}
                            </Buttons>
                          </div>
                        </Grid>
                        {tab === 0 && (
                          <Grid container md={12} spacing={4}>
                            <ListPage
                              disableEdit
                              disableAdd
                              columns={progressColumns}
                              apiUrl={`${API_PROGRESS}/${addTask._id}`}
                              mapFunction={this.mapFunction}
                            />
                          </Grid>
                        )}
                        {tab === 1 && (
                          <Grid item md={12} spacing={4}>
                            <ListPage
                              disableEdit
                              disableAdd
                              columns={historyColumns}
                              apiUrl={`${API_PROGRESS}/${addTask._id}`}
                              mapFunction={this.mapFunction1}
                            />
                          </Grid>
                        )}
                        {tab === 2 && (
                          <Grid item md={12} spacing={4}>
                            <ListPage
                              filter={{ isProject: true }}
                              disableEdit
                              disableAdd
                              columns={approvedColumns}
                              apiUrl={API_TASK_PROJECT}
                              mapFunction={this.mapFunction2}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </div>
                  )}
                  {tabIndex === 3 && (
                    <div
                      className="my-3"
                      style={{
                        display: 'flex',
                      }}
                    >
                      <Grid item md={12} spacing={4}>
                        <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
                          {intl.formatMessage(messages.danhsachtailieu || { id: 'danhsachtailieu', defaultMessage: 'danhsachtailieu' })}
                        </Typography>
                        <Button variant="outlined" color="primary" style={{ marginLeft: '85%', marginBottom: '30px' }} onClick={this.handleDialog}>
                          {intl.formatMessage(messages.themmoifile || { id: 'themmoifile', defaultMessage: 'themmoifile' })}
                        </Button>
                        <div>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>{intl.formatMessage(messages.tentailieu || { id: 'tentailieu', defaultMessage: 'tentailieu' })}</TableCell>
                                <TableCell>{intl.formatMessage(messages.tenfile || { id: 'tenfile', defaultMessage: 'tenfile' })}</TableCell>
                                <TableCell>{intl.formatMessage(messages.ngaytao || { id: 'ngaytao', defaultMessage: 'ngaytao' })}</TableCell>
                                <TableCell>Người tạo</TableCell>
                                <TableCell>{intl.formatMessage(messages.ghichu || { id: 'ghichu', defaultMessage: 'ghichu' })}</TableCell>
                                <TableCell>{intl.formatMessage(messages.taixuong || { id: 'taixuong', defaultMessage: 'taixuong' })}</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {addTask.files.length > 0
                                ? addTask.files.map(item => (
                                    <TableRow>
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell>{item.fileName}</TableCell>
                                      <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                                      <TableCell>{item.user.name}</TableCell>
                                      <TableCell>{item.description}</TableCell>
                                      <TableCell>
                                        <SaveAlt style={{ color: '#0795db', cursor: 'pointer' }} onClick={() => window.open(item.url)} />
                                      </TableCell>
                                    </TableRow>
                                  ))
                                : ''}
                            </TableBody>
                          </Table>
                        </div>
                      </Grid>
                      <Dialog open={openDialog} onClose={this.handleDialogAdd}>
                        <DialogTitle id="alert-dialog-title">
                          {intl.formatMessage(messages.themmoifile || { id: 'themmoifile', defaultMessage: 'themmoifile' })}
                        </DialogTitle>
                        <DialogContent style={{ width: 600 }}>
                          <TextField
                            fullWidth
                            id="standard-name"
                            label="Tên tài liệu"
                            margin="normal"
                            name="fileTitle"
                            onChange={e => this.handleChange('fileTitle', e.target.value)}
                            value={addTask.fileTitle}
                          />
                          <TextField
                            fullWidth
                            id="standard-name"
                            label="File Upload"
                            margin="normal"
                            name="url"
                            type="file"
                            onChange={this.handleChangeInputFile}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />

                          <TextField
                            fullWidth
                            id="standard-name"
                            label="Mô tả"
                            margin="normal"
                            name="fileDescription"
                            onChange={e => this.handleChange('fileDescription', e.target.value)}
                            value={addTask.fileDescription}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={this.onSaveFile} variant="contained" color="primary" autoFocus>
                            {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  )}
                  {tabIndex === 4 && (
                    <div>
                      <Grid container md={12} spacing={4}>
                        <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
                          {' '}
                          {intl.formatMessage(messages.chonnguoithaythe || { id: 'chonnguoithaythe', defaultMessage: 'chonnguoithaythe' })}
                        </Typography>
                        <Grid container md={12} spacing={4}>
                          <Grid item md={12} spacing={4}>
                            <div className="tab-contract">
                              <Buttons onClick={() => this.props.mergeData({ type: 1 })} color={addTask.type === 1 ? 'gradient' : 'simple'} size="sm">
                                {intl.formatMessage(messages.nguoiphutrach || { id: 'nguoiphutrach', defaultMessage: 'nguoiphutrach' })}
                              </Buttons>
                              <Buttons onClick={() => this.props.mergeData({ type: 2 })} color={addTask.type === 2 ? 'gradient' : 'simple'} size="sm">
                                {intl.formatMessage(messages.nguoithamgia || { id: 'nguoithamgia', defaultMessage: 'nguoithamgia' })}
                              </Buttons>
                            </div>
                          </Grid>
                          {addTask.type === 1 && (
                            <Grid item md={12} spacing={4} style={{ height: '100%' }}>
                              <Autocomplete
                                isMulti
                                name="Chọn "
                                label={names.inCharge}
                                suggestions={addTask.listInCharge}
                                onChange={this.selectcurrentEmployees}
                                value={addTask.currentEmployees}
                              />
                              <Autocomplete
                                isMulti
                                name="Chọn "
                                label="Người thay thế"
                                suggestions={employees ? employees.data : []}
                                onChange={this.selectTranferEmployees}
                                value={addTask.tranferEmployees}
                              />
                              <Button variant="contained" color="primary" style={{ marginLeft: '90%' }} onClick={this.onSaveTranfer}>
                                {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
                              </Button>
                              <ListPage
                                disableEdit
                                disableAdd
                                columns={replaceColumns}
                                apiUrl={`${API_TRANFER}/${addTask._id}`}
                                mapFunction={this.mapFunctionTranfer}
                              />
                            </Grid>
                          )}
                          {addTask.type === 2 && (
                            <Grid item md={12} spacing={4} style={{ height: '100%' }}>
                              <Autocomplete
                                isMulti
                                name="Chọn "
                                label={names.join}
                                suggestions={addTask.listJoin}
                                onChange={this.selectcurrentEmployees}
                                value={addTask.currentEmployees}
                              />
                              <Autocomplete
                                isMulti
                                name="Chọn "
                                label="Người thay thế"
                                suggestions={employees ? employees.data : []}
                                onChange={this.selectTranferEmployees}
                                value={addTask.tranferEmployees}
                              />
                              <Button variant="outlined" color="primary" style={{ marginLeft: '90%' }} onClick={this.onSaveTranfer}>
                                {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
                              </Button>
                              <ListPage
                                disableEdit
                                disableAdd
                                deleteOption="ids"
                                columns={replaceColumns}
                                apiUrl={`${API_TRANFER}/${addTask._id}`}
                                mapFunction={this.mapFunctionTranfer}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </div>
              </Grid>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 20 }}>
            <Button variant="contained" color="primary" style={{ marginRight: 25 }} type="submit">
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </Button>
            <Button variant="contained" color="secondary" onClick={this.onCloseTask}>
              {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'hủy' })}
            </Button>
          </div>
        </ValidatorForm>
      </div>
    );
  }

  selectTask = e => {
    this.props.mergeData({ idSelect: e.target.value });
  };

  // Tính toán disable trạng thái
  caculeDisable = value => {
    const { smallest, parentStatus, selectStatus } = this.props.addTask;
    if ([4, 5, 6].includes(parentStatus)) return true;
    if (value === 1) return true;
    if (selectStatus === 3 && value === 2 && !smallest) return true;
    return false;
  };

  selectApproved = approved => {
    this.props.handleChange('approved', approved);
  };

  selectJoin = join => {
    this.props.handleChange('join', join);
  };

  handleChange = (name, value) => {
    this.props.handleChange(name, value);
  };

  selectTranferEmployees = tranferEmployees => {
    this.props.handleChange('tranferEmployees', tranferEmployees);
  };

  selectcurrentEmployees = currentEmployees => {
    this.props.handleChange('currentEmployees', currentEmployees);
  };

  handleDiscount = (name, checked) => {
    this.props.handleDiscount(name, checked);
  };

  onSave = () => {
    const { addTask } = this.props;
    if (addTask.startDate >= addTask.endDate) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu', variant: 'error' });
      return;
    }

    const data = {
      name: addTask.name,
      ratio: addTask.ratio,
      progress: addTask.progress,
      description: addTask.description,
      startDate: addTask.startDate,
      endDate: addTask.endDate,
      taskStatus: addTask.taskStatus,
      priority: addTask.priority,
      customer: addTask.customer ? addTask.customer._id : null,
      viewable: addTask.viewable ? addTask.viewable.map(item => item._id) : [],
      inCharge: addTask.inCharge ? addTask.inCharge.map(item => item._id) : [],
      join: addTask.join ? addTask.join.map(item => item._id) : [],
      approved: addTask.approved ? addTask.approved.map(item => item._id) : [],
      remember: addTask.remember,
      rememberTo: addTask.rememberTo,
      dateRemember: addTask.dateRemember,
      file: addTask.file,
      isProject: false,
      parentId: addTask.parentId,
      support: addTask.support,
      taskType: this.props.taskType ? this.props.taskType : addTask.taskType,
      businessOpportunities: this.props.businessOpportunities ? this.props.businessOpportunities : addTask.businessOpportunities,
      callBack: this.props.callBack,
      kanbanStatus: addTask.kanbanStatus,
      objectAvatar: addTask.objectAvatar,
      avatar: addTask.avatar,
      category: addTask.category,
      source: addTask.source,
    };
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (id === 'add') this.props.postTask(data);
    else this.props.putTask(data, id);
    this.props.callback();
  };

  handleDialog = () => {
    const { openDialog } = this.state;
    this.setState({ openDialog: !openDialog });
  };

  handleDialogAdd = () => {
    this.setState({
      openDialog: false,
      openDialogProgress: false,
    });
  };

  handleChangeInputFile = e => {
    this.props.mergeData({ url: e.target.files[0] });
  };

  mapPeople(people) {
    let name = '';
    const peopleArr = people || [];
    peopleArr.forEach((item, index) => {
      if (index !== name.length - 1) name = `${item.name} ${name}`;
      else name = `${name}, ${item.name}`;
    });
    return name;
  }

  // Tính toán disable trạng thái
  caculeDisable = value => {
    const { smallest, parentStatus, selectStatus } = this.props.addTask;
    if ([4, 5, 6].includes(parentStatus)) return true;
    if (value === 1) return true;
    if (selectStatus === 3 && value === 2 && !smallest) return true;
    return false;
  };

  onCloseTask = () => {
    const data = { callBack: this.props.callBack };
    this.props.onCloseTask(data);
    this.props.getDefault();
  };

  onSaveProgress = () => {
    const { addTask } = this.props;
    const id = addTask.projectId;
    const data = {
      taskId: addTask.idSelect,
      taskStatus: addTask.taskStatus,
      priority: addTask.priority,
      progress: addTask.progress,
      note: addTask.note,
    };

    this.props.putProgress(data, id);
    this.setState({ openDialogProgress: false });
  };

  onSaveTranfer = () => {
    const { addTask } = this.props;
    const id = addTask._id;
    const data = {
      currentEmployees: addTask.currentEmployees.map(item => item._id),
      tranferEmployees: addTask.tranferEmployees.map(item => item._id),
      type: addTask.type,
    };
    this.props.postTranfer(data, id);
    // this.props.getDefaultProjectId(id);
  };

  onSaveFile = () => {
    const { url } = this.props.addTask;
    this.props.postFile(url);
    this.setState({ openDialog: false });
  };
}

// AddTask.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  addTask: makeSelectAddTask(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getTask: () => {
      dispatch(getTask());
    },
    handleChange: (name, value) => {
      dispatch(handleChange(name, value));
    },
    handleDiscount: (name, checked) => {
      dispatch(handleDiscount(name, checked));
    },
    postTask: data => {
      dispatch(postTask(data));
    },
    getDefault: data => {
      dispatch(getDefault(data));
    },
    getTaskCurrent: id => {
      dispatch(getTaskCurrent(id));
    },
    putTask: (data, id) => {
      dispatch(putTask(data, id));
    },
    onCloseTask: data => dispatch(onCloseTask(data)),
    putProgress: (data, id) => dispatch(putProgress(data, id)),
    postTranfer: (data, id) => dispatch(postTranfer(data, id)),
    getDefaultProjectId: id => dispatch(getDefaultProjectId(id)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },

    postFile: data => dispatch(postFile(data)),
    getParent: id => dispatch(getParent(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addTask', reducer });
const withSaga = injectSaga({ key: 'addTask', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddTask);

AddTask.defaultProps = {
  callback: () => 1,
};
