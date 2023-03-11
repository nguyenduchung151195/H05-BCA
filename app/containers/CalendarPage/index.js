/**
 *
 * CalendarPage
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Tab, Tabs, Paper, Button } from '@material-ui/core';
import { Notifications, Comment as InsertCommentOutlined } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import AddProjects from 'containers/AddProjects';
import injectReducer from 'utils/injectReducer';
import ListPage from 'components/List';
import Kanban from 'components/LifetekUi/Planner/PlanDemo';
import { API_MEETING } from '../../config/urlConfig';
import { makeSelectCalendarPage, makeSelectDashboardPage } from './selectors';
import { makeSelectMiniActive } from '../Dashboard/selectors';

import reducer from './reducer';
import saga from './saga';
import { Dialog, SwipeableDrawer } from '../../components/LifetekUi';
import { getMeetingAct, getVisitAct, mergeData } from './actions';
// import { calendarColumns } from '../../variable';

import CalendarComponent from '../../components/Calendar';
import DemoDialog from '../../components/LifetekUi/Planner/DemoDialog';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';

/* eslint-disable react/prefer-stateless-function */
export class CalendarPage extends React.Component {
  state = {
    meetings: [],
    visits: [],
    id: 'add',
    openDrawer: false,
    openKanbanDialog: false,
    taskItem: {
      priority: 1,
    },
  };

  componentDidMount() {
    this.props.onGetMeetings({
      'people._id': { $in: [this.props.dashboardPage.profile._id] },
    });
    this.props.onGetVisits({
      'people.employeeId': this.props.dashboardPage.profile._id,
    });
  }

  componentWillReceiveProps(props) {
    const { calendarPage } = props;
    if (calendarPage.meetings !== undefined) {
      this.state.meetings = calendarPage.meetings;
    }
    if (calendarPage.visits !== undefined) {
      this.state.visits = calendarPage.visits;
    }
  }

  mapFunctionCalendar = item => ({
    ...item,
    typeCalendar: item.typeCalendar === '1' ? 'Lịch cá nhân' : 'Lịch công tác',
    organizer: item['organizer.name'],
    task: item['task.name'],
    roomMetting: item['roomMetting.name'],
    editcustom: (
      <Button variant="outlined" onClick={() => this.handleChangeTask(item._id)} color="primary">
        Tạo công việc
      </Button>
    ),
  });

  handleMeetingDialog = id => {
    this.setState({ id, openKanbanDialog: true });
  };

  handleChangeTask = id => {
    this.setState({ openDrawer: true, id });
  };

  render() {
    const { meetings, visits } = this.state;
    const { calendarPage, profile, miniActive } = this.props;
    return (
      <div>
        <Helmet>
          <title>CalendarPage</title>
          <meta name="description" content="Description of CalendarPage" />
        </Helmet>
        <Tabs value={calendarPage.tabIndex} onChange={(e, tabIndex) => this.props.mergeData({ tabIndex })} aria-label="simple tabs example">
          <Tab value={0} label="Danh sách" />
          <Tab value={1} label="Lịch" />
          <Tab value={2} label="Kanban" />
        </Tabs>
        {calendarPage.tabIndex === 0 ? (
          <Paper>
            <ListPage
              kanban="ST15"
              reload={calendarPage.reload}
              columnExtensions={[{ columnName: 'editcustom', width: 200 }]}
              disableEdit
              disableAdd
              disableConfig
              // columns={calendarColumns}
              code="Calendar"
              apiUrl={API_MEETING}
              mapFunction={this.mapFunctionCalendar}
            />
          </Paper>
        ) : null}
        {calendarPage.tabIndex === 1 ? <CalendarComponent meetings={meetings} visits={visits} /> : null}
        {calendarPage.tabIndex === 2 ? (
          <Kanban reload={calendarPage.reload} module="crmStatus" code="ST15" apiUrl={API_MEETING} itemComponent={this.ItemComponent} />
        ) : null}
        <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
          <DemoDialog profile={profile} taskId={this.state.taskItem._id} data={this.state.taskItem} />
        </Dialog>
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
      </div>
    );
  }

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
      <p className="kanban-planner">
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
}

const mapStateToProps = createStructuredSelector({
  calendarPage: makeSelectCalendarPage(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectEditProfilePage(),
  miniActive: makeSelectMiniActive(),

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetMeetings: query => {
      dispatch(getMeetingAct(query));
    },
    onGetVisits: query => {
      dispatch(getVisitAct(query));
    },
    mergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'calendarPage', reducer });
const withSaga = injectSaga({ key: 'calendarPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CalendarPage);
