/**
 *
 * MeetingPage
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import ListPage from 'components/List';
import { Grid as GridMUI, Paper } from '@material-ui/core';
import { Notifications, Comment as InsertCommentOutlined } from '@material-ui/icons';
import AddProjects from 'containers/AddProjects';
import AddMeetingSchedule from 'containers/AddMeetingSchedule';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectMeetingPage, { makeSelectDashboardPage } from './selectors';
import reducer from './reducer';
import { SwipeableDrawer, Dialog, Tab, Tabs } from '../../components/LifetekUi';
import saga from './saga';
import { API_MEETING } from '../../config/urlConfig';
import { makeSelectMiniActive } from '../Dashboard/selectors';

import MeetingDialogContent from '../../components/MeetingDialogContent/Loadable';
import Loading from '../../components/LoadingIndicator';
import { getAllMeetingsAction, addMeetingAction, deleteMeetingsAction } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
// import { calendarColumns } from '../../variable';
import CalendarComponent from '../../components/Calendar';
import ConfirmDialog from '../../components/CustomDialog/ConfirmDialog';
// import CalendarContainer from '../CalendarContainer';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';
import DemoDialog from '../../components/LifetekUi/Planner/DemoDialog';
/* eslint-disable react/prefer-stateless-function */

export class MeetingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      tabIndex: Number(localStorage.getItem('WorkingMeetingTab')),
      id: 'add',
      openDrawer: false,
      openDrawerMeeting: false,
      openConfirmDelete: false,
      kanbanStatus: 0,
      kanbanData: {},
      openKanbanDialog: false,
      taskItem: {
        priority: 1,
      },
    };
  }

  componentDidMount() {
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
    const { dashboardPage } = this.props;
    this.props.onGetAllMeetings({
      typeCalendar: '1',
      people: { $in: [{ _id: dashboardPage.profile._id, name: dashboardPage.profile.name }] },
    });
    this.setState({ tabIndex: this.state.tabIndex })
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.tabIndex !== this.state.tabIndex)) {
      this.setState({ canView: false })
      // mergeData({ tab: 0 });
      // const { tab } = workingSchedule;
      // this.props.mergeData({ tab: 0 });
      localStorage.setItem('WorkingMeetingTab', this.state.tabIndex);
    }
  }

  componentWillReceiveProps(props) {
    const { dashboardPage } = this.props;
    if (props.meetingPage.successDeleteC !== this.props.meetingPage.successDeleteC) {
      props.onGetAllMeetings({
        typeCalendar: '1',
        people: { $in: [{ _id: dashboardPage.profile._id, name: dashboardPage.profile.name }] },
      });
    }
  }
  mapFunctionCalendar = item => {
    return {
      ...item,
      createdBy: item['createdBy.name'] ? item['createdBy.name'] : null,
      typeCalendar: item.typeCalendar === '1' ? 'Lịch cá nhân' : 'Lịch công tác',
      'organizer.name': item.organizer ? item.organizer : null,
      task: item['task.name'],
      roomMetting: item['roomMetting.name'],
      approved: item['approved.name'],
    }

  };

  handleChangeTask = id => {
    this.setState({ openDrawer: true, id });
  };

  checkItem(ft) {
    if (!ft.people) delete ft.people;

    return ft;
  }

  handleAddClick = () => {
    // this.props.mergeData({ open: true, id: 'add' });
  };

  handleClickEdit = data => {
    const roles = this.props.dashboardPage && this.props.dashboardPage.role && this.props.dashboardPage.role.roles

    const roleCode = roles && roles.find(item => item.codeModleFunction === 'MeetingCalendar');
    const roleModule = roleCode && roleCode.methods ? roleCode.methods : [];
    // this.setState({ openDrawerMeeting: true, id: data.Id });
    if ((roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true) {

      this.props.history.push(`/AllCalendar/MeetingCalendar/${data._id}`);
    } else {
      return this.props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí không có quyền sửa thông tin', status: true });
    }
  };

  handleDelete = data => {
    const roles = this.props.dashboardPage && this.props.dashboardPage.role && this.props.dashboardPage.role.roles

    const roleCode = roles && roles.find(item => item.codeModleFunction === 'MeetingCalendar');
    const roleModule = roleCode && roleCode.methods ? roleCode.methods : [];
    if ((roleModule.find(elm => elm.name === 'DELETE') || { allow: false }).allow === true) {
      this.setState({ openConfirmDelete: true, selectedId: data._id });
    } else {
      return this.props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí không có quyền xóa thông tin', status: true });
    }
  };
  acceptDelete = ids => {
    this.setState({ openConfirmDelete: false, selectedId: ids._id });
    this.props.onDeleteMeeting(ids);
  };

  closeDrawer = () => {
    this.setState({ open: false });
  };

  openTitleDialog = (id) => {
    this.props.history.push(`MeetingCalendar-detail/${id}`);
  };

  render() {
    const { tabIndex } = this.state;
    const { meetingPage, dashboardPage, intl, profile, miniActive, onChangeSnackbar } = this.props;
    const { reload, id } = this.props.meetingPage;
    // const query = {
    //   typeCalendar: '1', people: { $in: [{ _id: dashboardPage.profile._id, name: dashboardPage.profile.name }] }
    // }

    return (
      <div>
        <Helmet>
          <title>Lịch cá nhân</title>
          <meta name="description" content="Description of MeetingPage" />
        </Helmet>
        <Tabs value={tabIndex} onChange={(e, tabIndex) => this.setState({ tabIndex })} aria-label="simple tabs example">
          <Tab value={0} label={`Danh sách`} />
          {/* <Tab value={1} label="Công việc" /> */}
          {/* <Tab value={2} label={intl.formatMessage(messages.calendar || { id: 'calendar' })} />
          <Tab value={3} label={intl.formatMessage(messages.kanban || { id: 'kanban' })} />
          <Tab value={4} label="Bảng tự động hóa" /> */}
        </Tabs>
        <GridMUI container>
          <GridMUI item sm={12}>
            {tabIndex === 0 ? (
              <Paper style={{ position: 'relative' }}>
                <ListPage
                  showDepartmentAndEmployeeFilter
                  exportExcel
                  kanban="ST15"
                  // reload={calendarPage.reload}
                  filter={{
                    typeCalendar: '1',
                    $or: [
                      {
                        'createdBy.employeeId': dashboardPage.profile._id
                      },
                      { 'people.employeeId': dashboardPage.profile._id },
                      { 'organizer.employeeId': dashboardPage.profile._id },
                    ]

                  }}
                  // columns={calendarColumns}
                  code="MeetingCalendar"
                  apiUrl={API_MEETING}
                  mapFunction={this.mapFunctionCalendar}
                  columnExtensions={[{ columnName: 'edit', width: 150 }]}
                  className="mt-2"
                  listMenus={[]}
                  onRowClick={item => {
                    this.openTitleDialog(item._id,);
                  }}
                  pointerCursor="pointer"
                  onEdit={row => {
                    this.props.history.push(`MeetingCalendar/${row._id}`)
                  }}
                />
                {this.props.meetingPage.loading && <Loading />}
              </Paper>
            ) : null}
            {tabIndex === 2 ? (
              <CalendarComponent
                meetings={meetingPage.meetings}
                handleAdd={this.handleAddClick}
                handleEdit={this.handleClickEdit}
                handleDelete={this.handleDelete}
                statusCallApi={meetingPage.successDeleteC}
                dashboardPage={dashboardPage}
                onChangeSnackbar={onChangeSnackbar}
              />
            ) : null}
          </GridMUI>
          <GridMUI item sm={12}>
            <Dialog fullWidth maxWidth="lg" open={this.state.openDialog}>
              <MeetingDialogContent
                closeDialog={() => {
                  this.setState({ openDialog: false });
                }}
                {...this.props}
                editData={this.state.editData}
                isEditting={this.state.isEditting}
              />
            </Dialog>
            <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
              <DemoDialog profile={profile} taskId={this.state.taskItem._id} data={this.state.taskItem} />
            </Dialog>
          </GridMUI>
        </GridMUI>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawer: false, id: 'add' })}
          open={this.state.openDrawer}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div>
            <AddProjects mettingSchedule={this.state.id} data={{ isProject: false }} id="add" callback={this.callbackTask} />
          </div>
        </SwipeableDrawer>

        <SwipeableDrawer
          onClose={() => this.setState({ openDrawerMeeting: false, id: 'add' })}
          open={this.state.openDrawerMeeting}
          width={window.innerWidth - 260}
        >
          <div>
            <AddMeetingSchedule isMeting id={this.state.id} callback={this.callback} kanbanStatus={this.state.kanbanStatus} />
          </div>
        </SwipeableDrawer>
        <ConfirmDialog
          title="Đồng chí có chắc chắn muốn xóa công việc này?"
          open={this.state.openConfirmDelete}
          handleClose={() => this.setState({ openConfirmDelete: false, selectedId: null })}
          handleSave={() => this.acceptDelete(this.state.selectedId)}
        />
      </div>
    );
  }

  addItemKanban = id => {
    this.setState({ openDrawerMeeting: true, kanbanStatus: id });
  };

  callback = () => {
    this.setState({ openDrawerMeeting: false, reload: this.props.meetingPage.reload + 1 });
  };

  ItemComponent = data => (
    <div
      style={{
        padding: '20px 5px',
        margin: '20px 5px',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <p className="kanban" onClick={() => this.handleMeetingPage(data._id)}>
        Tên cuộc họp: <b> {data.name}</b>
      </p>
      <p className="kanban-planner">
        Người tham gia: <b> {data.people ? data.people.map(item => item.name).join(', ') : ''}</b>
      </p>
      <p className="kanban-planner">
        Địa điểm: <b> {data.roomMetting ? data.roomMetting.name : ''}</b>
      </p>

      <div className="footer-kanban-item">
        <button type="button" className="footer-kanban-item-time">
          <Notifications style={{ fontSize: '1rem' }} /> {new Date(data.date).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
        </button>
        <InsertCommentOutlined style={{ cursor: 'pointer' }} onClick={() => this.handleMeetingDialog(data)} />
      </div>
    </div>
  );

  handleMeetingDialog = id => {
    this.setState({ id, openKanbanDialog: true });
  };

  handleMeetingPage = id => {
    this.setState({ id, openDrawerMeeting: true });
  };

  callbackTask = () => {
    this.setState({ openDrawer: false });
  };
}

const mapStateToProps = createStructuredSelector({
  meetingPage: makeSelectMeetingPage(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectEditProfilePage(),
  miniActive: makeSelectMiniActive(),

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllMeetings: query => {
      dispatch(getAllMeetingsAction(query));
    },
    onCreateMeeting: (meeting, reminderBefore) => {
      dispatch(addMeetingAction(meeting, reminderBefore));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onDeleteMeeting: deleteIds => {
      dispatch(deleteMeetingsAction(deleteIds));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'meetingPage', reducer });
const withSaga = injectSaga({ key: 'meetingPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(MeetingPage);

const customContent = [
  {
    title: 'Ngày bắt đầu',
    fieldName: 'timeStart',
    type: 'date',
  },
  {
    title: 'Ngày kết thúc',
    fieldName: 'timeEnd',
    type: 'date',
  },
];

