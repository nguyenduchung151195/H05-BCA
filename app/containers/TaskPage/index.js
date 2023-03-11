import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
// import { Add } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import CalendarContainer from '../CalendarContainerDuplicate';
import makeSelectTaskPage from './selectors';
import makeSelectDashboardPage, { makeSelectMiniActive } from '../Dashboard/selectors';
// import { makeSelectMiniActive } from '../Dashboard/selectors';
import { Grid, TextField, Button } from '@material-ui/core';
import reducer from './reducer';
import saga from './saga';
import { mergeData, getProject } from './actions';
import TotalTask from '../TotalTask/Loadable';
import { API_TASK_CONFIG, API_TASK_PROJECT, API_TASKS_STATISTICS } from '../../config/urlConfig';
import { Tabs, Tab, SwipeableDrawer } from '../../components/LifetekUi';
import Planner from '../../components/LifetekUi/Planner/TaskKanban';
import messages from './messages';
import AddProjects from '../AddProjects';
import { Badge, Typography } from '@material-ui/core';
import ListTastStatistical from '../../components/List/listTaskStatistical';
import CustomInputField from '../../components/Input/CustomInputField';
import { fetchData, workStatus, taskPrioty } from '../../helper';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePickerCustom';

/* eslint-disable react/prefer-stateless-function */

export class TaskPage extends React.Component {
  // state = {
  //   open: false,
  //   data: {},
  //   reload: 0,
  //   count: {},
  //   reloadCount: '',
  //   filterTask: {},
  //   filterFake: {},
  //   configs: [],
  //   name: '',
  //   description: '',
  //   'taskMaster.name': '',
  //   inCharge: '',
  //   support: '',
  //   statusAccept: ''
  // };
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      data: {},
      reload: 0,
      count: {},
      reloadCount: '',
      filter: {},
      filterFake: {},
      configs: [],
      name: '',
      description: '',
      'taskMaster.name': '',
      inCharge: '',
      support: '',
      statusAccept: '',
      startDate: '',
      endDate: '',
      priority: {
        "target": {
          "value": null
        }
      }
    };

  }
  // componentDidUpdate(preProps, preState) {
  //   if (preProps !== this.props && preProps.location !== this.props.location) {
  //     console.log('jdfnvjnd: ', this.props.location)
  //     if (this.props.location && this.props.location.tab) {
  //       console.log('jdfnvjnd222: ')
  //       this.props.mergeData({ tab: this.props.location.tab })
  //     }

  //   }

  // }
  componentDidMount() {

    fetchData(API_TASK_CONFIG).then((res) => {
      let configs = []
      if (res) configs = res.find(item => item.code === 'TASKTYPE') && res.find(item => item.code === 'TASKTYPE').data || [];
      this.setState({ configs: configs })
      console.log(configs, "configs")
    }).catch((err) => {
      console.log("err", err)
      this.setState({ configs: [] })
    })


    this.getCountProjects();
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    localStorage.removeItem('addWorkingScheduleCallback');
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');
    const taskPage = this.props.taskPage;
    const { tab } = taskPage;

    const { dashboardPage } = this.props;

    const bussines =
      this.props.dashboardPage &&
      this.props.dashboardPage.roleTask &&
      this.props.dashboardPage.roleTask.roles &&
      this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES') &&
      this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data;

    const a = localStorage.getItem('taskCallBack');
    const b = localStorage.getItem('taskAddCallBack');
    console.log(this.props.location.tab, 'this.props.location.tab')

    if (this.props.location.tab) {
      this.props.mergeData({ tab: this.props.location.tab || 0 })
    }
    else if ((a !== null || a) || (b !== null || b)) {
      this.props.mergeData({ tab: Number(a) || Number(b) });
    } else {
      if (dashboardPage.roleTask.roles && bussines && bussines.find(elm => elm.name === 'createdBy') && bussines.find(elm => elm.name === 'createdBy').data.view === true) {
        return this.props.mergeData({ tab: 0 });
      } else if (dashboardPage.roleTask.roles && bussines && bussines.find(elm => elm.name === 'inCharge') && bussines.find(elm => elm.name === 'inCharge').data.view === true) {
        return this.props.mergeData({ tab: 1 });
      } else if (dashboardPage.roleTask.roles && bussines && bussines.find(elm => elm.name === 'support') && bussines.find(elm => elm.name === 'support').data.view === true) {
        return this.props.mergeData({ tab: 3 });
      } else {
        this.props.mergeData({ tab: 4 });
      }
    }


  }
  getCountProjects = () => {
    const apiUrl = `${API_TASK_PROJECT}/count`;
    fetch(`${apiUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ count: data });
      });
  };

  getTaskProjects = () => {
    const apiUrl = `${API_TASK_PROJECT}`;
    fetch(`${apiUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
  };

  addItem = (type, code) => {
    this.setState({ data: { kanbanStatus: type, taskStatus: code, isProject: false }, open: true, id: 'add' });
  };

  callbackTask = () => {
    const { reload } = this.state;
    this.setState({ reload: reload + 1, open: false });
  };

  handleAddClick = () => {
    this.props.mergeData({ openDrawer: true, id: 'add' });
  };

  handleClickEdit = data => {
    // const { projects } = this.props.taskPage;
    // if (projects.data)
    //   if (projects.data.find(it => it._id === data.Id)) this.props.mergeData({ openDrawerProject: true, id: data.Id });
    //   else this.props.mergeData({ openDrawer: true, id: data.Id });
  };

  closeDrawer = () => {
    this.setState({ open: false });
  };

  reloadCount = (data) => {
    if (data) {
      this.getCountProjects();
      this.getTaskProjects();
    }
  }
  // handleFilter = () => {
  //   // const { filterFake } = this.state
  //   const filter = this.state.filterFake
  //   this.setState({ filter, filterTask: filter })
  // }
  mapFunction = (item) => {
    const priority = item && item.priority ? taskPrioty[item.priority - 1] : null;
    return {
      ...item,
      priority: priority,
      startDate: item && item.startDate ? moment(item.startDate).format("DD/MM/YYYY") : '',
      endDate: item && item.endDate ? moment(item.endDate).format("DD/MM/YYYY") : ''
    }
  }
 customDataExport = data => {
    data = data.map((el)=>{
      const priority = el && el.priority ? taskPrioty[el.priority - 1] : null;
       return {
        ...el,
        taskMaster: el.taskMaster &&  el.taskMaster.name,
        priority: priority,
        startDate: el && el.startDate ? moment(el.startDate).format("DD/MM/YYYY") : '',
        endDate: el && el.endDate ? moment(el.endDate).format("DD/MM/YYYY") : '',
        inCharge: el.inChargeStr,
        support:el.supportStr
      }
    })
    return data || []
  };

  render() {
    const taskPage = this.props.taskPage;
    const { tab } = taskPage;


    const { open, data, id, reload, count, configs, filter, filterTask } = this.state;
    const { intl, dashboardPage, miniActive, history } = this.props;

    // const nature = this.props.dashboardPage.roleTask.roles ? this.props.dashboardPage.roleTask.roles.find(item => item.code === 'NATURE').data : [];

    const bussines =
      this.props.dashboardPage &&
      this.props.dashboardPage.roleTask &&
      this.props.dashboardPage.roleTask.roles &&
      this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES') &&
      this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data;


    const topNavList = [
      {
        name: 'createdBy',
        id: 'Giao Việc',
      },
      {
        name: 'inCharge',
        id: 'Xử lý chính',
      },
      {
        name: 'support',
        id: 'Phối hợp',
      },
      {
        name: 'findStatistics',
        id: 'Tra cứu',
      },

    ];

    return (
      <div>
        <Helmet>
          <title>TaskPage</title>
          <meta name="description" content="Description of TaskPage" />
        </Helmet>
        <div>
          <Tabs value={tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
            {topNavList.map(
              (item, key) =>
                dashboardPage.roleTask && dashboardPage.roleTask.roles && bussines
                  && bussines.find(elm => elm.name === item.name)
                  && bussines.find(elm => elm.name === item.name)
                  && bussines.find(elm => elm.name === item.name).data
                  && bussines.find(elm => elm.name === item.name).data.view === true ? (
                  <Tab
                    value={key}
                    label={
                      <Badge color="primary" badgeContent={this.state.count[`${item.name}Count`] || 0} max={9999}>
                        <Typography style={{ fontSize: 12, fontWeight: '600' }}>{intl.formatMessage(messages[item.id] || { id: item.id })}</Typography>
                      </Badge>
                    }
                  />
                ) : null,
            )}


            {/* <Tab value={3} label={
              <Typography style={{ fontSize: 12, fontWeight: '600' }}>{intl.formatMessage(messages.kanban || { id: 'kanban', defaultMessage: 'kanban' })}</Typography>} /> */}
            <Tab value={4} label={
              <Typography style={{ fontSize: 12, fontWeight: '600' }}>{intl.formatMessage(messages.lich || { id: 'lich', defaultMessage: 'lich' })}</Typography>} />
          </Tabs>


          {tab === 0 && <TotalTask tabType="assignTask" history={history} reloadCount={data => { this.reloadCount(data) }} />}
          {/* {tab === 3 && (
            <Planner reload={reload} showTemplate code="KANBAN" filterItem="kanbanStatus" apiUrl={API_TASK_PROJECT} addItem={this.addItem} history={history} />
          )} */}

          {tab === 4 ? (
            <CalendarContainer
              column={{
                Id: '_id',
                Subject: 'name',
                Location: '',
                StartTime: 'startDate',
                EndTime: 'endDate',
                CategoryColor: '',
              }}
              source="taskStatus"
              sourceCode="KANBAN"
              sourceKey="type"
              isCloneModule
              url={API_TASK_PROJECT}
              handleAdd={this.handleAddClick}
              handleEdit={this.handleClickEdit}
            />
          ) : null}

          {tab === 1 && <TotalTask reloadCount={data => { this.reloadCount(data) }} disableAdd disableImport tabType="inCharge" onGoingText="Chưa thực hiện" history={history} />}


          {tab === 2 && <TotalTask reloadCount={data => { this.reloadCount(data) }} disableAdd disableImport tabType="support" onGoingText="Chưa thực hiện" history={history} />}
          {tab === 3 &&
            <Grid item md={12}>
              <Grid item md={12} spacing={8} container>
                <Grid item md={3}>
                  <TextField
                    name='name'
                    value={this.state.name}
                    onChange={(e) => {
                      let { filterFake } = this.state
                      if (e.target.value)
                        filterFake['name'] = { $regex: e.target.value, $options: 'gi' }
                      else delete filterFake.name
                      this.setState({ name: e.target.value, filterFake: filterFake })
                    }}
                    fullWidth
                    variant="outlined"
                    label='Tên công việc'
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name='description'
                    value={this.state.description}
                    onChange={(e) => {

                      let { filterFake } = this.state
                      delete filterFake.description
                      if (e.target.value)
                        filterFake['description'] = { $regex: e.target.value, $options: 'gi' }
                      this.setState({ description: e.target.value, filterFake: filterFake })

                    }}
                    fullWidth
                    variant="outlined"
                    label='Nội dung công việc'
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item md={3} style={{ marginTop: 7 }}>
                  <CustomInputField
                    fullWidth
                    type={'ObjectId|Employee|Array'}
                    name={'taskMaster.name'}
                    label={'Người giao việc'}
                    noRequired={false}
                    hiddenOptionDefault={true}
                    clone={true}
                    value={this.state['taskMaster.name']}
                    onChange={(newVal, e) => {
                      this.setState({ 'taskMaster.name': newVal })
                      let { filterFake } = this.state
                      delete filterFake['taskMaster']
                      if (newVal && Array.isArray(newVal) && newVal.length) {
                        filterFake['taskMaster'] = { $in: newVal.map(i => i._id) };
                      }
                    }}
                  />
                </Grid>
                <Grid item md={3} style={{ marginTop: 7 }}>
                  <CustomInputField
                    fullWidth
                    // dateFilterType={c.dateFilterType}
                    // filterType={c.filterType ? c.filterType : null}
                    // options={c.menuItem ? c.menuItem : ''}
                    // configType={c.configType ? c.configType : ''}
                    // configCode={c.configCode ? c.configCode : ''}
                    type={'ObjectId|Employee|Array'}
                    name={'inCharge'}
                    label={'Cán bộ xử lý'}
                    noRequired={false}
                    hiddenOptionDefault={true}
                    clone={true}
                    onChange={(newVal, e) => {
                      this.setState({ 'inCharge': newVal })
                      let { filterFake } = this.state
                      delete filterFake['inCharge']
                      if (newVal && Array.isArray(newVal) && newVal.length) {
                        filterFake['inCharge'] = { $in: newVal.map(i => i._id) };
                      }
                    }}
                  />

                </Grid>
                <Grid item md={6}>
                  <TextField
                    name='support'
                    fullWidth
                    variant="outlined"
                    label='Cán bộ phối hợp'
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      let { filterFake } = this.state
                      delete filterFake.supportStr
                      if (e.target.value)
                        filterFake['supportStr'] = { $regex: e.target.value, $options: 'gi' }
                      this.setState({ supportStr: e.target.value, filterFake: filterFake })
                    }}
                  />
                </Grid>
                <Grid item md={3} style={{ marginTop: 7 }}>
                  <CustomInputField
                    fullWidth
                    options={[
                      { "code": 0, "color": "rgb(52, 11, 214)", "version": 1, "name": "Rất thấp", "type": "0" },
                      { "code": 1, "color": "#18ed00", "version": 1, "name": "Rất cao", "type": "1" },
                      { "code": 2, "color": "#ed0000", "version": 1, "name": "Cao", "type": "2" },
                      { "code": 3, "color": "rgb(214, 129, 11)", "version": 1, "name": "Trung bình", "type": "3" },
                      { "code": 4, "color": "rgb(214, 129, 11)", "version": 1, "name": "Thấp", "type": "4" }
                    ]}
                    type="MenuItem"
                    name={'priority'}
                    label={'Độ ưu tiên'}
                    noRequired={false}
                    // hiddenOptionDefault={true}
                    clone={true}
                    value={this.state.priority}
                    onChange={(newVal, e) => {
                      let { filterFake } = this.state
                      delete filterFake.priority
                      if (newVal.target.value)
                        if (newVal.target.value.value)
                          filterFake.priority = newVal.target.value.value
                      this.setState({ priority: newVal, filterFake: filterFake })
                    }}
                  />
                </Grid>
                <Grid item md={3} style={{ marginTop: 7 }}>
                  <CustomInputField
                    fullWidth
                    configCode="TASKTYPE"
                    configType="taskStatus"
                    type="Source|TaskConfig,TASKTYPE|Id||code"
                    name={'typeTask'}
                    label={'Loại công văn'}
                    noRequired={false}
                    value={this.state.typeTask}
                    hiddenOptionDefault={true}
                    clone={true}
                    onChange={(newVal, e) => {
                      let { filterFake } = this.state
                      delete filterFake.typeTask
                      if (newVal.target.value)
                        if (newVal.target.value.value)
                          filterFake.typeTask = newVal.target.value.value
                      this.setState({ typeTask: newVal, filterFake: filterFake })
                    }}
                  />

                </Grid>
                <Grid item md={3} >
                  <CustomDatePicker
                    label=" Ngày giao việc, từ ngày"
                    value={this.state.startDate || null}
                    variant="outlined"
                    // InputProps={{ inputProps: { min: this.state.orderDate } }}
                    name="startDate"
                    margin="normal"
                    top='15px'
                    onChange={e => {
                      console.log(e, 'njdfjndjv')
                      let { filterFake } = this.state
                      delete filterFake.startDate
                      if (e) {
                        filterFake.startDate = {
                          $gte: moment(e)
                            .startOf('days')
                            .toISOString()
                        }
                        this.setState({ startDate: e })
                      }
                      else this.setState({ startDate: e, filterFake: filterFake })
                    }}
                    style={{ width: '100%' }}
                    required={false}
                  />
                </Grid>
                <Grid item md={3} >
                  <CustomDatePicker
                    label="Đến ngày (Ngày kết thúc)"
                    value={this.state.endDate || null}
                    variant="outlined"
                    // InputProps={{ inputProps: { min: this.state.orderDate } }}
                    name="endDate"
                    margin="normal"
                    top='15px'
                    onChange={e => {
                      console.log(e, 'njdfjndjv')

                      let { filterFake } = this.state
                      delete filterFake.endDate
                      if (e) {
                        filterFake.endDate = {
                          $lte: moment(e)
                            .endOf('days')
                            .toISOString()
                        }
                        this.setState({ endDate: e })
                      }
                      else this.setState({ endDate: e, filterFake: filterFake })
                    }}
                    style={{ width: '100%' }}
                    required={false}
                  />

                </Grid>

                <Grid item md={3} style={{ marginTop: 7 }}>
                  <CustomInputField
                    fullWidth
                    options={workStatus}
                    type="MenuItem"
                    name={'statusAccept'}
                    label={'Trạng thái'}
                    noRequired={false}
                    hiddenOptionDefault={true}
                    clone={true}
                    value={this.state.statusAccept}
                    onChange={(newVal, e) => {
                      console.log(newVal, "")
                      let { filterFake } = this.state
                      delete filterFake.statusAccept
                      if (newVal.target.value)
                        if (newVal.target.value.value)
                          filterFake.statusAccept = newVal.target.value.value
                      this.setState({ statusAccept: newVal, filterFake: filterFake })

                    }}
                  />

                </Grid>
              </Grid>
              <Grid item md={12} style={{ display: "flex", justifyContent: "center" }}>
                <Button variant="contained" color="primary" onClick={(e) => {
                  // this.handleFilter()
                  this.setState({ filter: this.state.filterFake })
                }}>
                  Tra cứu
                </Button>
              </Grid>

              <ListTastStatistical
                // filterStartEnd="documentDate"
                withPagination
                notDelete
                noKanban
                disableSearch
                disableSelect
                notChangeApi
                exportExcel
                // customFunction={item => customFC(item)}
                disableImport
                disableAdd
                // reload={reloadPage}
                filter={filter}
                disableEmployee
                code="Task"
                employeeFilterKey="createdBy"
                apiUrl={API_TASKS_STATISTICS}
                listMenus={[]}
                disableViewConfig
                pointerCursor="pointer"
                createdDraft={false}
                height={'calc(100vh - 350px)'}
                mapFunction={this.mapFunction}
                noSelectors
                exportFile
                customDataExport={this.customDataExport}
              // onCellClick={(column, row) => {
              //   if (column && column.name) {
              //     let col = `${column.name}Filter`;
              //     let filter =
              //       row && row.originItem && row.originItem[col] && Array.isArray(row.originItem[col]) && row.originItem[col][0]
              //         ? row.originItem[col][0]
              //         : null;
              //     if (filter) {
              //       setOpenDialog(true);
              //       setFilterDocs(filter.$match);
              //     } else {
              //       props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí chọn sai trường dữ liệu, vui lòng chọn lại!', status: true });
              //     }
              //   }
              // }} 
              />
            </Grid>
          }

        </div>
        <SwipeableDrawer anchor="right" onClose={this.closeDrawer} open={open} width={window.innerWidth - 260}>
          <AddProjects data={data} id={id} callback={this.callbackTask} />
        </SwipeableDrawer>
      </div>
    );
  }
}

TaskPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  taskPage: makeSelectTaskPage(),
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getProject: () => dispatch(getProject()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'taskPage', reducer });
const withSaga = injectSaga({ key: 'taskPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(TaskPage);
