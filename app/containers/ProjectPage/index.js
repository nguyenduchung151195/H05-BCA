/**
 *
 * ProjectPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List/ListTask';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import ProjectDetail from 'components/ProjectDetail';
import dot from 'dot-object';
import { Drawer, Avatar, MenuItem } from '@material-ui/core';
import CustomButton from 'components/CustomButtons/Button';
import makeSelectDashboardPage from '../Dashboard/selectors';
import Planner from '../../components/LifetekUi/Planner/TaskKanban';
import { API_TASK_PROJECT } from '../../config/urlConfig';
import makeSelectProjectPage from './selectors';
import reducer from './reducer';
import { Paper, Grid, AsyncAutocomplete } from '../../components/LifetekUi';
import saga from './saga';
import { mergeDataProject, addBos, getData } from './actions';
import { taskStatusArr } from '../../variable';
/* eslint-disable react/prefer-stateless-function */

const GridList = React.memo(({ reload, openTask, filter, openBusiness, projectss }) => {
  const columnExtensions = React.useState([
    { columnName: 'name', width: 300 },
    { columnName: 'edit', width: 150 },
    { columnName: 'progress', width: 180 },
  ])[0];

  const mapTask = item => {
    const child = projectss.find(elm => elm._id === item.projectId);
    return {
      ...item,
      // parentId: item['parentId.name'],
      name: (
        <button onClick={() => openTask(item)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
          {item.name}
        </button>
      ),
      avatar: <Avatar src={`${item.avatar}?allowDefault=true`} />,
      progress: (
        <Process value={item.progress} progress={item.progress} color={colorProgress(item)} time={ProcessTask(item)} color2={color2Progress(item)} />
      ),
      planApproval:
        item.planApproval === 1 ? (
          <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã duyệt kế hoạch</p>
        ) : child && child.planApproval === 1 ? (
          <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã duyệt kế hoạch</p>
        ) : (
          <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Chưa duyệt kế hoạch</p>
        ),
      acceptApproval:
        item.acceptApproval === 1 ? (
          <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã duyệt nghiệm thu </p>
        ) : child && child.acceptApproval === 1 ? (
          <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã duyệt nghiệm thu</p>
        ) : (
          <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Chưa duyệt nghiệm thu</p>
        ),
      customer: item['customer.name'],
      createdBy: item['createdBy.name'],
      taskStatus: taskStatusArr[item.taskStatus - 1],
      type: item.type === 1 ? 'Nhóm bảo mật' : item.type === 4 ? 'Nhóm công khai' : item.type === 2 ? 'Nhóm ẩn' : 'Nhóm mở rộng',
      priority:
        item.priority === 1 ? 'Rất cao' : item.priority === 2 ? 'Cao' : item.priority === 3 ? 'Trung bình' : item.priority === 4 ? 'Thấp' : 'Rất thấp',
      projectId: projectss.find(elm => elm._id === item.projectId) ? projectss.find(elm => elm._id === item.projectId).name : null,
      organizationUnit: item.organizationUnitName || item.organizationUnit,
      template: item.templateName,
    }
  };

  return (
    <Grid style={{ paddingTop: 10 }} item md={12}>
      <ListPage
        columnExtensions={columnExtensions}
        tree
        exportExcel
        reload={reload}
        apiUrl={`${API_TASK_PROJECT}/projects`}
        code="Task"
        kanban="KANBAN"
        status="taskStatus"
        mapFunction={mapTask}
        addChildTask
        filter={filter}
        perPage={5}
        extraMenu={openBusiness}
      />
    </Grid>
  );
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
    <span style={{ fontSize: 14, marginLeft: 3, color: '#e0e0e0', position: 'absolute' }}>
      {props.progress}
      %- {props.time}
    </span>
  </div>
);

function ProcessTask(item) {
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

function colorProgress(item) {
  let color;
  if (item.finishDate) {
    color = new Date(item.finishDate) > new Date(item.endDate) ? '#fa0522' : '#009900';
  } else {
    color = new Date(item.endDate) >= new Date() ? '#056ffa' : '#f00707';
  }

  return color;
}

function color2Progress(item) {
  let color2;
  if (item.finishDate) {
    color2 = new Date(item.finishDate) > new Date(item.endDate) ? '#f28100' : '#009900';
  } else {
    color2 = new Date(item.endDate) >= new Date() ? '#05c9fa' : '#6e1305';
  }

  return color2;
}

export class ProjectPage extends React.Component {
  state = { tab: 0, task: null, reload: 0, crmStatusSteps: [] };

  toggleDrawer = () => {
    const { openDrawer } = this.props.projectPage;
    this.props.mergeDataProject({ openDrawer: !openDrawer });
  };

  openBusiness = () => <MenuItem onClick={this.handleDialogBusiness}>Thêm cơ hội kinh doanh</MenuItem>;

  handleDialogBusiness = () => {
    this.props.mergeDataProject({ openDialog: true });
  };

  componentDidMount() {
    this.props.getData();
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST01')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus && currentCrmStatus.data.forEach(item => {
      switch (item.code) {
        case 1:
          laneStart.push(item);
          break;
        case 2:
          laneAdd.push(item);
          break;

        case 3:
          laneSucces.push(item);
          break;

        case 4:
          laneFail.push(item);
          break;

        default:
          break;
      }
    });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    this.setState({ crmStatusSteps: sortedKanbanStatus });
  }

  checkItem(ft) {
    if (!ft.taskManager) delete ft.taskManager;
    if (!ft.inCharge) delete ft.inCharge;
    if (!ft.join) delete ft.join;
    if (!ft.support) delete ft.support;
    if (!ft.viewable) delete ft.viewable;
    if (!ft.approved) delete ft.approved;
    if (!ft.type) delete ft.type;
    // if (!ft.taskManager && !ft.inCharge && !ft.join && !ft.support && !ft.viewable && !ft.approved && !ft.type) delete ft.isProject;
    return ft;
  }

  render() {
    const { tab, task, reload } = this.state;
    const { projectPage } = this.props;
    const { openDrawer, filter, isEditting, editData, openDialog } = projectPage;
    const bussines = this.props.dashboard.roleTask.roles.find(elm => elm.code === 'BUSSINES').data;
    const extra = this.props.dashboard.roleTask.roles.find(elm => elm.code === 'EXTRA').data;
    const hideTask = extra.find(elm => elm.name === 'hide').data;
    const protectedTask = extra.find(elm => elm.name === 'protected').data;
    const publicTask = extra.find(elm => elm.name === 'public').data;
    const openTask = extra.find(elm => elm.name === 'open').data;

    const taskManager = bussines.find(elm => elm.name === 'taskManager').data;
    const taskInCharge = bussines.find(elm => elm.name === 'inCharge').data;
    const taskSupport = bussines.find(elm => elm.name === 'support').data;
    const taskViewable = bussines.find(elm => elm.name === 'viewable').data;
    const taskJoin = bussines.find(elm => elm.name === 'join').data;
    // const taskApproved = bussines.find(elm => elm.name === "approved").data;
    const profile = this.props.dashboard.profile;
    // console.log('filter',filter);

    return (
      <div>
        <Helmet>
          <title>Project</title>
          <meta name="description" content="Description of ProjectPage" />
        </Helmet>
        <Paper>
          <CustomButton onClick={() => this.setState({ tab: 1 })} size="sm" right color={tab === 1 ? 'gradient' : 'simple'} round>
            Bảng trạng thái
          </CustomButton>
          <CustomButton onClick={() => this.setState({ tab: 0 })} size="sm" right color={tab === 0 ? 'gradient' : 'simple'} round>
            Danh sách
          </CustomButton>
          <Grid container>
            {!tab && (
              <Grid item md={12}>
                <GridList
                  filter={{
                    ...filter,
                    $or: [
                      { createdBy: profile._id },
                      this.checkItem({ type: hideTask.view === true ? 2 : '' }),
                      this.checkItem({ type: protectedTask.view === true ? 1 : '' }),
                      this.checkItem({ type: publicTask.view === true ? 4 : '' }),
                      this.checkItem({ type: openTask.view === true ? 3 : '' }),
                      this.checkItem({ taskManager: taskManager.view === true ? { $in: [profile._id] } : '' }),
                      this.checkItem({ inCharge: taskInCharge.view === true ? { $in: [profile._id] } : '' }),
                      this.checkItem({ join: taskJoin.view === true ? { $in: [profile._id] } : '' }),
                      this.checkItem({ support: taskSupport.view === true ? { $in: [profile._id] } : '' }),
                      this.checkItem({ viewable: taskViewable.view === true ? { $in: [profile._id] } : '' }),
                    ],
                  }}
                  openTask={this.openTask}
                  reload={reload}
                  openBusiness={this.openBusiness}
                  projectss={this.props.projectPage.projectss}
                />
              </Grid>
            )}
            {tab === 1 && (
              <Grid item md={12}>
                <div style={{ width: '50%', padding: '0px 20px' }}>
                  <AsyncAutocomplete onChange={task => this.setState({ task })} value={task} filter={{ isProject: true }} url={API_TASK_PROJECT} />
                  {/* <Button onClick={this.printTask} variant="outlined">
                    In nhiem vu du an
                  </Button> */}
                </div>

                {task && <Planner id={task._id} code="KANBAN" filterItem="kanbanCode" apiUrl={API_TASK_PROJECT} />}
              </Grid>
            )}
          </Grid>

          <Drawer anchor="right" open={openDrawer} onClose={this.toggleDrawer} style={{ width: 700 }}>
            <div style={{ width: 700, marginTop: 80 }}>
              <ProjectDetail onClose={this.toggleDrawer} projects={projectPage.projects} />
            </div>
          </Drawer>
        </Paper>
      </div>
    );
  }

  handleCloseDialog = () => {
    this.props.mergeDataProject({ openDialog: false });
  };

  callBackBos = (cmd, data) => {
    this.props.addBos(dot.object(data));
    this.props.mergeDataProject({ openDialog: false });
  };

  openTask = item => {
    this.props.mergeDataProject({ openDrawer: true, projects: item });
  };
}

// ProjectPage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  projectPage: makeSelectProjectPage(),
  dashboard: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeDataProject: data => dispatch(mergeDataProject(data)),
    addBos: data => dispatch(addBos(data)),
    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'projectPage', reducer });
const withSaga = injectSaga({ key: 'projectPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ProjectPage);
