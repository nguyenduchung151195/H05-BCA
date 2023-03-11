/* eslint-disable react/button-has-type */
/**
 *
 * AddMeetingSchedule
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Button,
  Avatar,
  MenuItem,
  IconButton,
  Menu,
  ListItemText,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import AddProjects from 'containers/AddProjects';
import { taskStatusArr } from 'variable';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { injectIntl } from 'react-intl';
import messages from './messages';
import makeSelectAddMeetingSchedule from './selectors';
import { Link } from 'react-router-dom';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import {
  API_USERS,
  API_MEETING,
} from '../../config/urlConfig';
import { Typography, Paper, Grid, AsyncAutocomplete, SwipeableDrawer, FileUpload, Dialog } from '../../components/LifetekUi';
import { Grid as GridUI } from '@material-ui/core';
import reducer from './reducer';
import { changeSnackbar } from '../Dashboard/actions';
import { mergeData, postData, getCurrent, putData, getDefault, getData } from './actions';
import saga from './saga';
import { viewConfigCheckRequired, viewConfigCheckForm, getHost } from 'utils/common';
import CustomInputBase from '../../components/Input/CustomInputBase';
import './style.scss';
import CustomAppBar from 'components/CustomAppBar';
import FilterDocs from './components/FilterDocs';
import TaskDocs from './components/TaskDocs';
import { withStyles } from '@material-ui/core/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditExecutiveDocuments from '../EditExecutiveDocuments';
import EditProjects from '../EditProjects';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  tableCell: {
    padding: '4px 20px',
    textWrap: 'wrap',
    width: '25%',
  },
  txtRight: {
    textAlign: 'right',
  },
});

const Process = props => (
  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 22, width: '100%', position: 'relative' }}>
    <div
      style={{
        width: `${props.value}%`,
        background: `${props.color2}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    />
    <div
      style={{
        width: `${100 - props.value}%`,
        background: `${props.color}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    />
    <span style={{ fontSize: 12, marginLeft: 3, color: '#e0e0e0', position: 'absolute' }}>
      {props.progress}
      %- {props.time}
    </span>
  </div>
);
/* eslint-disable react/prefer-stateless-function */
export class AddMeetingSchedule extends React.Component {
  constructor(props) {
    super(props);
    const moduleCode = 'MeetingCalendar';
    const dispatchColumns = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === moduleCode).listDisplay.type.fields.type
      .columns;
    const names = {};
    dispatchColumns.forEach(item => {
      names[item.name] = item.title;
    });
    const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    this.state = {
      names,
      moduleCode,
      checkRequired,
      checkShowForm,
      localMessages: {},
      crmSource,
      openSelectDocumentType: null,
      reload: null,
      docDetail: null,
      localState: {
        file: [],
      },
      openDialogFilter: false,
      openDialogTask: false,
      idEdit: null,
      openEditDialog: false,
      openEditprojects: false,
      disabledButton: false,
      changeRoom: false,
    };
  }

  async componentDidMount() {
    this.props.getData();
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    if (id) {
      this.getDetail(id);
    }

    this.props.mergeData({ tab: 0 });
    console.log(id, 'id')
    if (!id) {
      await this.props.getDefault();
      // this.props.mergeData({ people: [this.props.profile] });
      this.props.mergeData({ code: `LH-${new Date() * 1}` });

    } else {
      this.props.getCurrent(id);
      this.props.mergeData({
        employee: null,
        department: '',
        timeStart: new Date(),
        timeEnd: new Date(),
        filter: {
          isProject: false,
          mettingSchedule: id,
        },
        // code: `LH-${new Date() * 1}`
      });
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.addMeetingSchedule !== props.addMeetingSchedule) {
      if (this.props.addMeetingSchedule && this.props.addMeetingSchedule.error === true) {
        this.setState({
          disabledButton: false,
        });
      }
    }
  }

  handleChangeKanban = item => {
    this.props.mergeData({ kanbanStatus: item.type });
  };

  addItemPersonal = () => (
    <Add style={{ color: 'white' }} onClick={() => this.props.mergeData({ openDrawer: true })}>
      Open Menu
    </Add>
  );

  findChildren(data) {
    const newData = data.filter(item => item.parent === null);
    this.getLevel(newData, 0);
    return newData;
  }

  getLevel(arr, lvl) {
    arr.forEach(item => {
      item.level = lvl;
      if (item.child) {
        this.getLevel(item.child, lvl + 1);
      }
    });
  }

  mapItem(array, result = []) {
    array.forEach(item => {
      result.push(
        <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
          {item.name}
        </MenuItem>,
      );
      if (item.child) this.mapItem(item.child, result);
    });
    return result;
  }

  handleDepartment = e => {
    this.props.mergeData({
      department: e.target.value,
      filter: {
        organizationUnit: e.target.value,
      },
    });
  };

  handleChangeDate = value => {
    if (new Date(this.props.addMeetingSchedule.startDate1) > new Date(value)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    this.props.mergeData({
      startDate2: value,
      filter: {
        startDate: { $gte: new Date(this.props.addMeetingSchedule.startDate1).toISOString(), $lte: new Date(value).toISOString() },
      },
    });
  };

  handleEmployees = value => {
    this.props.mergeData({
      employee: value,
      filter: {
        $or: [
          { createdBy: value._id ? value._id : '5d7b1bed6369c11a047844e7' },
          { inCharge: { $in: value._id ? value._id : '5d7b1bed6369c11a047844e7' } },
          { viewable: { $in: value._id ? value._id : '5d7b1bed6369c11a047844e7' } },
          { support: { $in: value._id ? value._id : '5d7b1bed6369c11a047844e7' } },
          { join: { $in: value._id ? value._id : '5d7b1bed6369c11a047844e7' } },
        ],
      },
    });
  };

  handleChangeInputFile = e => {
    this.props.mergeData({ file: e.target.files[0] });
  };

  callbackTask = () => {
    const { addMeetingSchedule } = this.props;
    this.props.mergeData({ openDrawer: false, reload: addMeetingSchedule.reload + 1 });
  };

  onGoBack = () => {
    if (this.props.history) {
      this.props.history.goBack();
    } else if (this.props.callback) this.props.callback();
  };

  onSaveData = () => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addMeetingSchedule } = this.props;
    const { localState } = this.state;
    // if (addMeetingSchedule.approved === null || addMeetingSchedule.people === null || addMeetingSchedule.organizer === null) return;
    const createdBy = {
      name: this.props.profile.name,
      employeeId: this.props.profile._id,
    };

    // const organizer = {
    //   name: addMeetingSchedule && addMeetingSchedule.organizer && addMeetingSchedule.organizer.name,
    //   employeeId: addMeetingSchedule && addMeetingSchedule.organizer && addMeetingSchedule.organizer._id,
    // };

    if (new Date(addMeetingSchedule.timeStart) >= new Date(addMeetingSchedule.timeEnd)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }
    let data = {
      typeCalendar: addMeetingSchedule.typeCalendar && addMeetingSchedule.typeCalendar.code ? addMeetingSchedule.typeCalendar.code : 1,
      name: addMeetingSchedule.name,
      code: addMeetingSchedule.code,
      date: addMeetingSchedule.date,
      timeStart: addMeetingSchedule.timeStart,
      timeEnd: addMeetingSchedule.timeEnd,
      address:
        (addMeetingSchedule.roomMetting !== null && addMeetingSchedule.roomMetting.address) || this.state.changeRoom === true
          ? addMeetingSchedule.roomMetting.address
          : addMeetingSchedule.address,
      prepareMeeting: addMeetingSchedule.prepareMeeting,
      organizer: Array.isArray(addMeetingSchedule.organizer) ? addMeetingSchedule.organizer.map(i => ({ name: i.name, employeeId: i._id })) : [],
      customers: Array.isArray(addMeetingSchedule.customers) ? addMeetingSchedule.customers.map(i => ({ customerId: i._id, name: i.name })) : [],
      people: Array.isArray(addMeetingSchedule.people) ? addMeetingSchedule.people.map(i => ({ name: i.name, employeeId: i._id })) : [],
      prepare: addMeetingSchedule.prepare,
      // file: addMeetingSchedule.file,
      content: addMeetingSchedule.content,
      createdBy,
      from: addMeetingSchedule.from === null ? '5e0464fd09ea5f2a2c249306' : addMeetingSchedule.from,
      link: addMeetingSchedule.link,
      task: addMeetingSchedule.task,
      roomMetting: addMeetingSchedule.roomMetting,
      kanbanStatus: this.props.kanbanStatus ? this.props.kanbanStatus : addMeetingSchedule.kanbanStatus,
      documentary: this.props.documentary ? this.props.documentary : null,
      callback: this.props.callback,
      file: localState && localState.file,
      dataIncoming: addMeetingSchedule.dataIncoming,
      dataTask: addMeetingSchedule.dataTask,
    };
    const { location } = this.props;
    let code = undefined,
      idd = undefined;
    if (location && location.state !== undefined) {
      code = location.state.code;
      idd = location.state.idd;
    }
    if (code != undefined && idd !== undefined) {
      data = {
        ...data,
        others: {
          [code]: idd,
        },
      };
    }
    const { moduleCode } = this.state;
    // const messages = viewConfigCheckForm(moduleCode, dot.dot(data));
    const messages = viewConfigCheckForm(moduleCode, data);
    this.setState({
      localMessages: messages,
    });
    console.log(messages, 'messages')
    if (Object.values(messages).filter(v => v).length) {
      return this.props.onChangeSnackbar({ status: true, message: 'Vui lòng nhập đầy đủ các trường thông tin', variant: 'error' });
    }
    try {
      if (id) {
        this.setState({ disabledButton: true });
        this.props.putData(data, id, this.cb);
        setTimeout(() => {
          this.setState({ disabledButton: false });
        }, 500);
      } else {
        this.setState({ disabledButton: true });
        this.props.postData(data, this.cb);
        setTimeout(() => {
          this.setState({ disabledButton: false });
        }, 500);
      }
    } catch (error) {
      this.setState({ disabledButton: false });
    }
  };

  handleChange = (name, value) => {
    if (name === 'hasRelatedDocument') {
      this.props.mergeData({ [name]: value, relatedDoc: null });
    } else if (name === 'hasRelatedProject') {
      this.props.mergeData({ [name]: value, relatedTask: null });
    } else this.props.mergeData({ [name]: value });
  };

  mapFunctionTaskRevenue = (item, index) => {
    const roles = this.props.dashboardPage && this.props.dashboardPage.role && this.props.dashboardPage.role.roles

    const roleCode = roles && roles.find(item => item.codeModleFunction === 'Task');
    const roleModule = roleCode ? roleCode.methods : [];
    return {
      ...item,
      name:
        (roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true ? (
          <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => this.props.mergeData({ openDrawer: true, idTask: item._id })}>
            {item.name}
          </button>
        ) : (
          // eslint-disable-next-line no-alert
          <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={() => alert('Đồng chí không có quyền cho chức năng này')}>
            {item.name}
          </button>
        ),
      index: index + 1,
      taskStatus: taskStatusArr[item.taskStatus - 1],
      customer: item['customer.name'],
      createdBy: item['createdBy.name'],
      progress: (
        <Process
          value={item.progress}
          progress={item.progress}
          color={this.colorProgress(item)}
          time={this.ProcessTask(item)}
          color2={this.color2Progress(item)}
        />
      ),
      avatar: <Avatar src={`${props.data.avatar}?allowDefault=true`} />,
      priority:
        item.priority === 1
          ? 'Rất cao'
          : item.priority === 2
            ? 'Cao'
            : item.priority === 3
              ? 'Trung bình'
              : item.priority === 4
                ? 'Thấp'
                : 'Rất thấp',
      type: item.type === 1 ? 'Nhóm bảo mật' : item.type === 4 ? 'Nhóm công khai' : item.type === 2 ? 'Nhóm ẩn' : 'Nhóm mở rộng',
      taskType: item.taskType === 1 ? 'Công việc' : item.taskType === 2 ? 'Công việc không doanh thu' : 'Công việc cá nhân',
    };
  };

  ProcessTask(item) {
    let date;
    let total;
    if (item.finishDate) {
      if (new Date(item.finishDate) > new Date(item.endDate)) {
        date = ((new Date(item.finishDate) - new Date(item.endDate)) / 3600000).toFixed(2);
        const date2 = Number(date) / 24;
        const date3 = Math.floor(date2);
        const date4 = Number(((date2 - date3) * 24).toFixed());
        total = `Trễ ${date3} ngày ${date4} giờ`;
      } else {
        date = ((new Date(item.endDate) - new Date(item.finishDate)) / 3600000).toFixed(2);
        const date2 = Number(date) / 24;
        const date3 = Math.floor(date2);
        const date4 = Number(((date2 - date3) * 24).toFixed());
        total = `Sớm ${date3} ngày ${date4} giờ`;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (new Date(item.endDate) > new Date()) {
        date = ((new Date(item.endDate) - new Date()) / 3600000).toFixed(2);
        const date2 = Number(date) / 24;
        const date3 = Math.floor(date2);
        const date4 = Number(((date2 - date3) * 24).toFixed());
        total = `Còn ${date3} ngày ${date4} giờ`;
      } else {
        date = ((new Date() - new Date(item.endDate)) / 3600000).toFixed(2);
        const date2 = Number(date) / 24;
        const date3 = Math.floor(date2);
        const date4 = Number(((date2 - date3) * 24).toFixed());
        total = `Quá ${date3} ngày ${date4} giờ`;
      }
    }

    return total;
  }

  colorProgress(item) {
    let color;
    if (item.finishDate) {
      color = new Date(item.finishDate) > new Date(item.endDate) ? '#fa0522' : '#009900';
    } else {
      color = new Date(item.endDate) >= new Date() ? '#056ffa' : '#f00707';
    }

    return color;
  }

  color2Progress(item) {
    let color2;
    if (item.finishDate) {
      color2 = new Date(item.finishDate) > new Date(item.endDate) ? '#f28100' : '#009900';
    } else {
      color2 = new Date(item.endDate) >= new Date() ? '#05c9fa' : '#6e1305';
    }

    return color2;
  }

  onAddFunctionClick = e => {
    this.setState({ openSelectDocumentType: e.target });
  };

  mapFunction = item => {
    const { crmSource } = this.state;
    const typeDocumentArr = crmSource.find(elm => elm.code === 'S19').data;
    const urgencyArr = crmSource.find(elm => elm.code === 'S20').data;
    const whereArr = crmSource.find(elm => elm.code === 'S23').data;
    const storageArr = crmSource.find(elm => elm.code === 'S22').data;
    const densityArr = crmSource.find(elm => elm.code === 'S21').data;

    return {
      ...item,
      task: item['task.name'],
      receiverSign: item['receiverSign.name'],
      viewer: item['viewerName'],
      replyDispatch: item['replyDispatch.name'],
      type: item.type === '2' ? 'Công văn đến' : 'Công văn đi',
      typeDocument: typeDocumentArr.find(elm => elm.value === item.typeDocument)
        ? typeDocumentArr.find(elm => elm.value === item.typeDocument).title
        : item.typeDocument,
      urgency: urgencyArr.find(elm => elm.value === item.urgency) ? urgencyArr.find(elm => elm.value === item.urgency).title : item.urgency,
      where: whereArr.find(elm => elm.value === item.where) ? whereArr.find(elm => elm.value === item.where).title : item.where,
      storage: storageArr.find(elm => elm.value === item.storage) ? storageArr.find(elm => elm.value === item.storage).title : item.storage,
      density: densityArr.find(elm => elm.value === item.density) ? densityArr.find(elm => elm.value === item.density).title : item.density,
    };
  };

  getDetail = id => {
    this.setState({ docDetail: 'abc' });
  };

  handleFileChange = e => {
    const { localState } = this.state;
    const files = e.target.files;

    const newFiles = [...localState.file];
    for (let i = 0; i < files.length; i += 1) {
      newFiles.push(files[i]);
    }
    this.setState({ localState: { ...localState, file: newFiles } });
  };

  handleFileDelete = f => {
    const { localState } = this.state;
    const newFiles = localState.file.filter((i, idx) => idx !== f);
    this.setState({ localState: { ...localState, file: newFiles } });
  };

  onChangeFile(data) {
    // this.setState({ localState: { ...localState, ...data } })
  }

  cb = () => {
    this.props.history.goBack();
  };

  deleteDocs = index => {
    const { dataIncoming } = this.props.addMeetingSchedule;
    const newData = dataIncoming.filter(item => item._id !== index);
    // this.setState({ dataIncoming: newData })
    this.props.mergeData({ dataIncoming: newData });
  };

  deleteTask = index => {
    const { dataTask } = this.props.addMeetingSchedule;
    const newData = dataTask.filter(item => item._id !== index);
    // this.setState({ dataTask: newData })
    this.props.mergeData({ dataTask: newData });
  };

  closeDialog = e => {
    this.setState({ openDialogFilter: false });
  };
  closeDialogTask = e => {
    this.setState({ openDialogTask: false });
  };

  onSave = data => {
    this.setState({ openDialogFilter: false });
    this.props.mergeData({ dataIncoming: data });
  };
  onSaveTask = data => {
    this.setState({ openDialogTask: false });
    this.props.mergeData({ dataTask: data });
  };

  mapCate = cate => {
    switch (cate) {
      case 1:
        return 'Xứ lý công văn';
      case 2:
        return 'Xứ lý công việc';
      case 3:
        return 'Xứ lý hồ sơ';
      case 4:
        return 'Xứ lý đơn thư';
    }
  };

  mapTypeTask = cate => {
    const taskStt = JSON.parse(localStorage.getItem('taskStatus'));
    const taskType = taskStt && taskStt.find(item => item.code === 'TASKTYPE').data;
    const data = taskType && taskType.find(i => i.type == cate);
    return data && data.name;
  };

  onClickRow = (e, ids) => {
    e.preventDefault();
    // this.props.history.valueData = id;
    this.setState({ idEdit: ids, openEditDialog: true });
    // this.props.history.push(`/incomming-document-detail/${ids}`)
  };

  onClickRowTask = (e, ids) => {
    e.preventDefault();
    // this.props.history.valueData = id;
    this.setState({ idEdit: ids, openEditprojects: true });
    // this.props.history.push(`/incomming-document-detail/${ids}`)
  };
  render() {
    const { addMeetingSchedule, intl, miniActive, classes, onChangeSnackbar } = this.props;
    const { dataIncoming, dataTask } = addMeetingSchedule;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const {
      names,
      checkRequired,
      checkShowForm,
      localMessages,
      docDetail,
      localState,
      openDialogFilter,
      openDialogTask,
      openEditDialog,
      idEdit,
      openEditprojects,
    } = this.state;
    return (
      <div>
        <CustomAppBar
          title={
            id
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật lịch họp' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới lịch họp' })}`
          }
          onGoBack={this.onGoBack}
          onSubmit={this.onSaveData}
          disableSave={this.state.disabledButton}
        />
        <Paper>
          {/* {id === 'add' ? null : (
            <div>
              <Tabs value={addMeetingSchedule.tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
                <Tab value={0} label="Chi tiết" />
                <Tab value={1} label="Công việc" />
                <Tab value={2} label="Công văn" />
              </Tabs>
            </div>
          )} */}
          {addMeetingSchedule.tab === 0 ? (
            <div>
              {/* <div style={{ marginTop: '64px' }}>
                <KanbanStep
                  handleStepper={this.handleChangeKanban}
                  kanbanStatus={addMeetingSchedule.kanbanStatus}
                  code="ST15"
                  apiUrl={API_MEETING}
                  Id={id}
                />
              </div> */}
              <Typography variant="h6" style={{ marginTop: '30px', fontWeight: 'bold', color: 'black', fontSize: 14 }}>
                Thông tin lịch cá nhân
              </Typography>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <GridUI container spacing={16}>
                  {/* <GridUI item xs={6}>
                    <CustomInputBase
                      label={names.code}
                      value={addMeetingSchedule.code}
                      name="code"
                      onChange={e => this.props.mergeData({ code: e.target.value })}
                      error={localMessages && localMessages.code}
                      helperText={localMessages && localMessages.code}
                      required={checkRequired.code}
                      checkedShowForm={checkShowForm.code}
                      className={checkRequired.code ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                      disabled={id ? true : false}
                    />
                  </GridUI> */}
                  {/* <GridUI item xs={6}>
                    <CustomInputBase
                      label={names.code || "Mã"}
                      value={addMeetingSchedule.code}
                      name="code"
                      required
                      className={checkRequired.code ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                      disabled
                    />
                  </GridUI> */}

                  <GridUI item xs={6}>
                    <CustomInputBase
                      label={names.name}
                      value={addMeetingSchedule.name}
                      name="name"
                      onChange={e => this.props.mergeData({ name: e.target.value })}
                      error={localMessages && localMessages.name}
                      helperText={localMessages && localMessages.name}
                      required={checkRequired.name}
                      checkedShowForm={checkShowForm.name}
                      autoFocus
                      className={checkRequired.name ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                    />
                  </GridUI>
                  {/* <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    error={!addMeetingSchedule.date}
                    helperText={addMeetingSchedule.date ? null : 'Không được bỏ trống'}
                    label={names.date}
                    value={addMeetingSchedule.date}
                    name="date"
                    margin="dense"
                    variant="outlined"
                    onChange={value => this.props.mergeData({ date: value })}
                    fullWidth
                    keyboard
                    style={{ padding: 15 }}
                  /> */}
                  <GridUI item xs={6}>
                    <DateTimePicker
                      fullWidth
                      format="DD/MM/YYYY HH:mm"
                      variant="outlined"
                      keyboard
                      label={names.timeStart}
                      value={addMeetingSchedule.timeStart}
                      onChange={value => this.props.mergeData({ timeStart: value })}
                      error={localMessages && localMessages.timeStart}
                      helperText={localMessages && localMessages.timeStart}
                      required={checkRequired.timeStart}
                      // checkedShowForm={checkShowForm.timeStart}
                      keyboardIcon={<AccessTimeIcon />}
                      // style={{ padding: 15 }}
                      margin="dense"
                      className={checkRequired.timeStart ? 'CustomRequiredLetter' : 'CustomIconRequired' + ' picker '}
                    />
                  </GridUI>
                  <GridUI item xs={6}>
                    <DateTimePicker
                      fullWidth
                      format="DD/MM/YYYY HH:mm"
                      variant="outlined"
                      keyboard
                      label={names.timeEnd}
                      value={addMeetingSchedule.timeEnd}
                      onChange={value => this.props.mergeData({ timeEnd: value })}
                      error={localMessages && localMessages.timeEnd}
                      helperText={localMessages && localMessages.timeEnd}
                      required={checkRequired.timeEnd}
                      // checkedShowForm={checkShowForm.timeEnd}
                      keyboardIcon={<AccessTimeIcon />}
                      margin="dense"
                      className={checkRequired.timeEnd ? 'CustomRequiredLetter' : 'CustomIconRequired' + ' picker '}
                    />
                  </GridUI>
                  <GridUI item xs={6}>
                    <AsyncAutocomplete
                      name="Chọn..."
                      label={names.roomMetting}
                      onChange={value => {
                        this.props.mergeData({ roomMetting: value });
                        this.setState({ changeRoom: true });
                      }}
                      url={`${API_MEETING}/room`}
                      value={addMeetingSchedule.roomMetting}
                      error={localMessages && localMessages.roomMetting}
                      helperText={localMessages && localMessages.roomMetting}
                      required={checkRequired.roomMetting}
                      checkedShowForm={checkShowForm.roomMetting}
                      className={checkRequired.roomMetting ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                    />
                  </GridUI>
                  <GridUI item xs={6}>
                    <AsyncAutocomplete
                      name="Chọn..."
                      label={names['organizer.name'] ? names['organizer.name'] : 'Người tổ chức'}
                      onChange={value => this.props.mergeData({ organizer: value })}
                      url={`${API_USERS}`}
                      value={addMeetingSchedule.organizer}
                      error={localMessages && localMessages['organizer.name']}
                      helperText={localMessages && localMessages['organizer.name']}
                      required={checkRequired['organizer.name']}
                      checkedShowForm={checkShowForm['organizer.name']}
                      className={checkRequired['organizer.name'] ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                      isMulti
                    />
                  </GridUI>
                  <GridUI item xs={6}>
                    <CustomInputBase
                      label={names.address}
                      value={
                        (!id && addMeetingSchedule.roomMetting !== null) || this.state.changeRoom === true
                          ? addMeetingSchedule.roomMetting.address
                          : addMeetingSchedule.address
                      }
                      name="address"
                      onChange={e => this.props.mergeData({ address: e.target.value })}
                      disabled={addMeetingSchedule.roomMetting !== null}
                      // error={localMessages && localMessages.address}
                      // helperText={localMessages && localMessages.address}
                      // required={checkRequired.address}
                      // checkedShowForm={checkShowForm.address}
                      className={checkRequired.address ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                    />
                  </GridUI>
                  <GridUI item xs={6}>
                    <AsyncAutocomplete
                      name="Chọn..."
                      label={names.people}
                      onChange={value => this.props.mergeData({ people: value })}
                      url={`${API_USERS}`}
                      value={addMeetingSchedule.people}
                      isMulti
                      error={localMessages && localMessages.people}
                      helperText={localMessages && localMessages.people}
                      required={checkRequired.people}
                      checkedShowForm={checkShowForm.people}
                      className={checkRequired.people ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                    />
                  </GridUI>
                  {/* <GridUI item xs={6}>
                    <GridUI container style={{ marginTop: 10, display: 'flex' }}>
                      <GridUI item md={4}>
                        <span style={{ float: 'left', display: 'flex', alignItems: 'center', paddingRight: 10, minHeight: 60 }}>
                          <Checkbox
                            onChange={e => this.handleChange('hasRelatedProject', e.target.checked)}
                            color="primary"
                            checked={addMeetingSchedule.hasRelatedProject}
                            value="hasRelatedProject"
                          />
                          Công việc liên quan
                        </span>
                      </GridUI>
                      <GridUI item md={8}>
                        {(addMeetingSchedule.hasRelatedProject === true) && (
                          <AsyncAutocomplete
                            name="Chọn..."
                            label={'Công việc liên quan'}
                            required={checkRequired.task}
                            checkedShowForm={checkShowForm.task}
                            error={localMessages && localMessages.task}
                            helperText={localMessages && localMessages.task}
                            onChange={value => this.props.mergeData({ task: value })}
                            url={API_TASK_CONTRACT_PROJECT}
                            value={addMeetingSchedule.task}
                          />

                          
                        )}
                      </GridUI>
                    </GridUI>
                  </GridUI>
                  <GridUI item xs={6}></GridUI>
                  <GridUI item xs={6}>
                    <GridUI container style={{ marginTop: 10, display: 'flex' }}>
                      <GridUI item md={4}>
                        <span style={{ float: 'left', display: 'flex', alignItems: 'center', paddingRight: 10, minHeight: 60 }}>
                          <Checkbox
                            onChange={e => this.handleChange('hasRelatedDocument', e.target.checked)}
                            color="primary"
                            checked={addMeetingSchedule.hasRelatedDocument}
                            value="hasRelatedDocument"
                          />
                          Văn bản đính kèm
                        </span>
                      </GridUI>
                      <GridUI item md={8}>
                        {(addMeetingSchedule.hasRelatedDocument === true) && (
                          <AsyncAutocomplete
                            name="Chọn..."
                            label={'Văn bản đính kèm'}
                            required={checkRequired.answer4doc}
                            checkedShowForm={checkShowForm.answer4doc}
                            error={localMessages && localMessages.answer4doc}
                            helperText={localMessages && localMessages.answer4doc}
                            onChange={value => this.props.mergeData({ answer4doc: value })}
                            url={API_INCOMMING_DOCUMENT}
                            value={addMeetingSchedule.answer4doc}
                            filter={{ stage: { $ne: 'receive' } }}
                          customOptionLabel={option => `${option.toBookCode}`}
                          filters={['toBookCode']}
                          />

                          
                        )}
                      </GridUI>
                    </GridUI>
                  </GridUI> */}
                </GridUI>
              </MuiPickersUtilsProvider>
              {/* <GridUI container spacing={16}>
                <GridUI item md={6}>



                  <AsyncAutocomplete
                    name="Chọn..."
                    label={names.prepare}
                    onChange={value => this.props.mergeData({ prepare: value })}
                    url={`${API_USERS}`}
                    value={addMeetingSchedule.prepare}
                    isMulti
                    error={localMessages && localMessages.prepare}
                    helperText={localMessages && localMessages.prepare}
                    required={checkRequired.prepare}
                    checkedShowForm={checkShowForm.prepare}
                    className={checkRequired.prepare ? "CustomRequiredLetter" : 'CustomIconRequired'}

                  />
                  <CustomInputBase
                    label={names.prepareMeeting}
                    value={addMeetingSchedule.prepareMeeting}
                    name="prepareMeeting"
                    onChange={e => this.props.mergeData({ prepareMeeting: e.target.value })}
                    error={localMessages && localMessages.prepareMeeting}
                    helperText={localMessages && localMessages.prepareMeeting}
                    required={checkRequired.prepareMeeting}
                    checkedShowForm={checkShowForm.prepareMeeting}
                    className={checkRequired.prepareMeeting ? "CustomRequiredLetter" : 'CustomIconRequired'}

                  />
                </GridUI>
                <GridUI item md={6}>
                  <AsyncAutocomplete
                    name="Chọn..."
                    label={names.task}
                    onChange={value => {
                      const newData = { task: value };
                      if (value && value.customer && value.customer._id) {
                        newData.customers = [value.customer];
                      }
                      this.props.mergeData(newData);
                    }}
                    url={`${API_TASK_PROJECT}`}
                    value={addMeetingSchedule.task}
                    filter={{ isProject: true }}
                    error={localMessages && localMessages.task}
                    helperText={localMessages && localMessages.task}
                    required={checkRequired.task}
                    checkedShowForm={checkShowForm.task}
                    className={checkRequired.task ? "CustomRequiredLetter" : 'CustomIconRequired'}

                  />
                  <AsyncAutocomplete
                    label={names.customers}
                    isMulti
                    onChange={value => this.props.mergeData({ customers: value })}
                    url={`${API_CUSTOMERS}`}
                    value={addMeetingSchedule.customers}
                    error={localMessages && localMessages.customers}
                    helperText={localMessages && localMessages.customers}
                    required={checkRequired.customers}
                    checkedShowForm={checkShowForm.customers}
                    className={checkRequired.customers ? "CustomRequiredLetter" : 'CustomIconRequired'}

                  />



                </GridUI>
              </GridUI> */}
              <Grid item sm={12}>
                {/* <FileUpload name={addMeetingSchedule.name} id={id} code="MeetingCalendar" reload={this.state.reload} /> */}
                <CustomInputBase
                  multiline
                  name={addMeetingSchedule.name}
                  id={id}
                  code="MeetingCalendar"
                  rows={4}
                  showRecorder
                  setReload={() => {
                    this.setState({ reload: (this.state.reload || 0) + 1 });
                  }}
                  label={names.content}
                  value={addMeetingSchedule.content}
                  onChange={e => this.props.mergeData({ content: e.target.value })}
                  error={localMessages && localMessages.content}
                  helperText={localMessages && localMessages.content}
                  required={checkRequired.content}
                  checkedShowForm={checkShowForm.content}
                  className={checkRequired.content ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                />
              </Grid>
              <Grid item md={12} style={{ marginTop: 20 }}>
                <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black', width: 160, display: 'inline-block' }}>
                  VĂN BẢN ĐÍNH KÈM
                </span>
                <label style={{ display: 'inline-block', marginRight: 10 }}>
                  <Button color="primary" variant="contained" onClick={() => this.setState({ openDialogFilter: true })} component="span">
                    {/* <span style={{ marginRight: 5 }}>
                      <Search />
                    </span> */}
                    <span style={{ fontWeight: 'bold' }}>Tìm kiếm</span>
                  </Button>
                </label>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ cursor: 'pointer', alignItems: 'center', fontWeight: 'bold' }}>Số văn bản</TableCell>
                      <TableCell style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}>Ngày văn bản</TableCell>
                      <TableCell style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}>Trích yếu</TableCell>
                      <TableCell style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(dataIncoming) &&
                      dataIncoming.length > 0 &&
                      dataIncoming.map((item, index) => {
                        return (
                          <TableRow>
                            <TableCell style={{ cursor: 'pointer', alignItems: 'center' }} onClick={e => this.onClickRow(e, item._id)}>
                              {item.toBook}
                            </TableCell>
                            <TableCell
                              style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}
                              onClick={e => this.onClickRow(e, item._id)}
                            >
                              {item.documentDate}
                            </TableCell>
                            <TableCell
                              style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}
                              onClick={e => this.onClickRow(e, item._id)}
                            >
                              {item.abstractNote}
                            </TableCell>
                            <TableCell style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}>
                              <IconButton onClick={() => this.deleteDocs(item._id)}>
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item md={12} style={{ marginTop: 20 }}>
                <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black', width: 160, display: 'inline-block' }}>
                  CÔNG VIỆC LIÊN QUAN
                </span>
                <label style={{ display: 'inline-block', marginRight: 10 }}>
                  <Button color="primary" variant="contained" onClick={() => this.setState({ openDialogTask: true })} component="span">
                    {/* <span style={{ marginRight: 5 }}>
                      <Search />
                    </span> */}
                    <span style={{ fontWeight: 'bold' }}>Tìm kiếm</span>
                  </Button>
                </label>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ cursor: 'pointer', alignItems: 'center', fontWeight: 'bold' }}>Tên công việc</TableCell>
                      <TableCell style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}>
                        Loại công việc
                      </TableCell>
                      <TableCell style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}>
                        Nội dung công việc
                      </TableCell>
                      <TableCell style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(dataTask) &&
                      dataTask.length > 0 &&
                      dataTask.map(item => {
                        return (
                          <TableRow>
                            <TableCell style={{ cursor: 'pointer', alignItems: 'center' }} onClick={e => this.onClickRowTask(e, item._id)}>
                              {item.name}
                            </TableCell>
                            {!id ? (
                              <TableCell
                                style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}
                                onClick={e => this.onClickRowTask(e, item._id)}
                              >
                                {item.typeTask}
                              </TableCell>
                            ) : (
                              <TableCell
                                style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}
                                onClick={e => this.onClickRowTask(e, item._id)}
                              >
                                {this.mapTypeTask(item.typeTask)}
                              </TableCell>
                            )}

                            <TableCell
                              style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}
                              onClick={e => this.onClickRowTask(e, item._id)}
                            >
                              {item.description}
                            </TableCell>
                            <TableCell style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}>
                              <IconButton onClick={() => this.deleteTask(item._id)}>
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Grid>

              <Grid item xs={12} style={{ marginTop: 20 }}>
                {id && docDetail ? (
                  <>
                    <FileUpload name='tepdinhkem' onChangeFile={this.onChangeFile} id={id} code="MeetingCalendar" />
                  </>
                ) : (
                  <div>
                    <div>
                      <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black', width: 160, display: 'inline-block' }}>
                        TỆP ĐÍNH KÈM
                      </span>
                      <label htmlFor="fileUpload" style={{ display: 'inline-block', marginRight: 10 }}>
                        <Button color="primary" variant="contained" component="span">
                          Tải lên
                        </Button>
                      </label>
                      <label htmlFor="fileScan">
                        <Button color="primary" variant="contained" component="span" onClick={() => setScanDialog({})}>
                          {/* <span style={{ marginRight: 5, fontWeight: 'bold' }}>
                        <Scanner />
                      </span> */}
                          <span style={{ fontWeight: 'bold' }}>Quét văn bản</span>
                        </Button>
                      </label>
                    </div>
                    <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      {localState.file && <FileUpload file={localState.file} id={'add'} onDeleteFile={this.handleFileDelete} />}
                    </div>
                    <input onChange={this.handleFileChange} id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" multiple />
                  </div>
                )}
              </Grid>
            </div>
          ) : null}
          {/* {addMeetingSchedule.tab === 1 ? (
            <div>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CustomInputBase
                    value={addMeetingSchedule.department}
                    onChange={this.handleDepartment}
                    label="Phòng ban"
                    select
                    error={localMessages && localMessages.department}
                    helperText={localMessages && localMessages.department}
                    required={checkRequired.department}
                    checkedShowForm={checkShowForm.department}
                    className={checkRequired.department ? "CustomRequiredLetter" : 'CustomIconRequired'}

                  >
                    {this.mapItem(this.findChildren(addMeetingSchedule.departments))}
                  </CustomInputBase>
                  <div style={{ width: '20%', padding: 10 }}>
                    <AsyncAutocomplete
                      label="Nhân viên"
                      onChange={value => this.handleEmployees(value)}
                      url={API_USERS}
                      value={addMeetingSchedule.employee}
                      error={localMessages && localMessages.employee}
                      helperText={localMessages && localMessages.employee}
                      required={checkRequired.employee}
                      checkedShowForm={checkShowForm.employee}
                      className={checkRequired.employee ? "CustomRequiredLetter" : 'CustomIconRequired'}

                    />
                  </div>

                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    label="Từ Ngày"
                    value={addMeetingSchedule.startDate1}
                    name="startDate1"
                    variant="outlined"
                    margin="dense"
                    onChange={value => this.props.mergeData({ startDate1: value })}
                    error={localMessages && localMessages.startDate1}
                    helperText={localMessages && localMessages.startDate1}
                    required={checkRequired.startDate1}
                    checkedShowForm={checkShowForm.startDate1}
                    className={checkRequired.startDate1 ? "CustomRequiredLetter" : 'CustomIconRequired'}

                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingFlat color="primary" />
                  </div>

                  <DateTimePicker
                    inputVariant="outlined"
                    format="DD/MM/YYYY HH:mm"
                    label="Đến"
                    value={addMeetingSchedule.startDate2}
                    name="startDate2"
                    onChange={value => this.handleChangeDate(value)}
                    error={localMessages && localMessages.startDate2}
                    helperText={localMessages && localMessages.startDate2}
                    required={checkRequired.startDate2}
                    className={checkRequired.startDate2 ? "CustomRequiredLetter" : 'CustomIconRequired'}

                  // checkedShowForm={checkShowForm.startDate1}
                  />
                </div>
              </MuiPickersUtilsProvider>
              <ListPage
                kanban="ST11"
                reload={addMeetingSchedule.reload}
                disableEdit
                disableAdd
                settingBar={[this.addItemPersonal()]}
                columnExtensions={[{ columnName: 'progress', width: 180 }, { columnName: 'name', width: 200 }]}
                disableConfig
                code="Task"
                apiUrl={API_TASK_PROJECT}
                mapFunction={this.mapFunctionTaskRevenue}
                filter={{
                  ...addMeetingSchedule.filter,
                  isProject: false,
                  mettingSchedule: id,
                }}
              />
            </div>
          ) : null} */}
          {/* {addMeetingSchedule.tab === 2 ? (
            <div>
              <ListPage
                addFunction={this.onAddFunctionClick}
                mapFunction={this.mapFunction}
                code="Documentary"
                apiUrl={API_DISPATCH}
                kanban="ST14"
                customUrl={item => (item.type === '2' ? `${getHost()}/Documentary/inComingDocument` : `${getHost()}/Documentary/outGoingDocument`)}
                filter={{
                  mettingSchedule: id,
                }}
              />
            </div>
          ) : null} */}
          {/* <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 15 }}>
            <Button variant="contained" color="primary" style={{ width: 100, marginRight: 20 }} onClick={this.onSaveData}>
              Lưu
            </Button>
            <Button variant="contained" color="secondary" style={{ width: 100 }} onClick={this.onGoBack}>
              Hủy
            </Button>
          </div> */}
        </Paper>
        <Dialog dialogAction={false} onClose={this.closeDialog} open={openDialogFilter}>
          <FilterDocs onSave={this.onSave} handleCloseFilter={this.closeDialog} onChangeSnackbar={onChangeSnackbar} profile={this.props.profile}/>
        </Dialog>
        <Dialog dialogAction={false} onClose={this.closeDialogTask} open={openDialogTask}>
          <TaskDocs onSave={this.onSaveTask} handleCloseFilter={this.closeDialogTask} />
        </Dialog>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openEditDialog: false })}
          open={openEditDialog}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
            <EditExecutiveDocuments id={idEdit} goBack={() => this.setState({ openEditDialog: false })} />
          </div>
        </SwipeableDrawer>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openEditprojects: false })}
          open={openEditprojects}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
            <EditProjects id={idEdit} goBack={() => this.setState({ openEditprojects: false })} history={this.props.history} page={'meeting'} />
          </div>
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="right"
          onClose={() => this.props.mergeData({ openDrawer: false, idTask: 'add' })}
          open={addMeetingSchedule.openDrawer}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div>
            <AddProjects mettingSchedule={id} data={{ isProject: false }} id={addMeetingSchedule.idTask} callback={this.callbackTask} history={this.props.history} page={'meeting'} />
          </div>
        </SwipeableDrawer>
        <Menu
          id="simple-menu"
          anchorEl={this.state.openSelectDocumentType}
          keepMounted
          open={Boolean(this.state.openSelectDocumentType)}
          onClose={() => this.setState({ openSelectDocumentType: null })}
        >
          <MenuItem>
            <Link style={{ display: 'flex' }} to={`${getHost()}/Documentary/inComingDocument/add`}>
              <ListItemText primary="Công văn đến" />
            </Link>
          </MenuItem>
          <MenuItem>
            <Link style={{ display: 'flex' }} to={`${getHost()}/Documentary/outGoingDocument/add`}>
              <ListItemText primary="Công văn đi" />
            </Link>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

AddMeetingSchedule.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addMeetingSchedule: makeSelectAddMeetingSchedule(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    postData: (data, cb) => dispatch(postData(data, cb)),
    getCurrent: id => dispatch(getCurrent(id)),
    putData: (data, id, cb) => dispatch(putData(data, id, cb)),
    getDefault: () => dispatch(getDefault()),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addMeetingSchedule', reducer });
const withSaga = injectSaga({ key: 'addMeetingSchedule', saga });

export default compose(
  withReducer,
  withSaga,
  injectIntl,
  withConnect,
  withStyles(styles),
)(AddMeetingSchedule);
