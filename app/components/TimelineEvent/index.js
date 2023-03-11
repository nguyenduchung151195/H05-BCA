/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/**
 *
 * TimelineEvent
 *
 */

import React from 'react';
import { Divider, TextField, Tab, Tabs, Typography, Chip, Grid, Button, Paper } from '@material-ui/core';
import { Add, Phone, CommentOutlined, MeetingRoom, CalendarToday, AirportShuttle } from '@material-ui/icons';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import { Timeline, TimelineEvent } from 'react-event-timeline';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import AddTask from 'containers/AddProjects';
import axios from 'axios';
// import { Loading } fro./components/loadingonents/loading';
import { API_NOTIFY, API_MEETING, API_VISIT } from '../../config/urlConfig';
import { SwipeableDrawer, FileUpload } from '../LifetekUi';
import CallPage from '../../containers/CallPage';
import Email from '../Email';
import { convertDatetimeToDate } from '../../utils/common';
import { logNames } from '../../variable';
import Meeting from './components/meeting';
import Visit from './components/visit';
/* eslint-disable react/prefer-stateless-function */

function TabContainer({ children }) {
  return <Typography style={{ padding: 8 * 3, overflow: 'auto' }}>{children}</Typography>;
}
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    // width: 500,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  customTab: {
    minWidth: 0,
    '& span': {
      padding: 2.5,
    },
  },
  titleTimeline: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

class TimelineEventComponent extends React.Component {
  state = {
    value: 0,
    content: '',
    openDrawer: false,
    reminder: {
      date: new Date(),
      content: '',
      title: '',
    },
    meetingDetail: undefined,
    visitDetail: undefined,
    loading: false,
  };

  componentWillMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const typeLine = urlParams.get('typeLine');
    if (typeLine) {
      this.setState({ value: Number(typeLine) });
    }
  }

  componentDidMount() {
    const timelineData = JSON.parse(localStorage.getItem('timeLineData'));
    if (timelineData) {
      if (timelineData.value === 1) {
        this.handleClickDetailReminder(timelineData.id);
      }
      localStorage.removeItem('timeLineData');
    }
  }

  componentDidUpdate() {
    this.swipeableActions.updateHeight();
  }

  handleChangeInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleCreateLog = () => {
    const { editData, dashboardPage } = this.props;
    const { content } = this.state;
    const objectId = editData._id;
    const employee = {
      employeeId: dashboardPage.profile._id,
      name: dashboardPage.profile.name,
    };
    this.state.content = '';

    this.props.onPostLog({ content, objectId, type: 'message', employee });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleChangeSwitch = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleDrawer = () => {
    this.setState({ openDrawer: false });
  };

  handleClickDetailReminder = (reminderId, logId) => {
    const token = localStorage.getItem('token');
    this.setState({ loading: true });
    axios
      .get(`${API_NOTIFY}/${reminderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        this.setState({
          reminder: {
            logId,
            id: response.data._id,
            date: response.data.date,
            content: response.data.content,
            title: response.data.title,
          },
          value: 1,
          loading: false,
        });
      })
      .catch(err => {
        //console.log(err);
      });
  };

  handleClickDetailMeeting = (meetingId, logId) => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_MEETING}/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        this.setState({
          meetingDetail: { ...response.data, logId },
          value: 6,

          loading: false,
        });
      })
      .catch(err => {
        //console.log(err);
      });
  };

  handleClickDetailVisit = visitId => {
    const token = localStorage.getItem('token');

    axios
      .get(`${API_VISIT}/${visitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        this.setState({
          visitDetail: response.data,
          value: 7,
          loading: false,
        });
      })
      .catch(err => {
        //console.log(err);
      });
  };

  backTask = data => {
    this.setState({ openDrawer: false, content: data && data.data && data.data.name });
    const { editData, dashboardPage } = this.props;
    const objectId = editData._id;
    const employee = {
      employeeId: dashboardPage.profile._id,
      name: dashboardPage.profile.name,
    };

    this.props.onPostLog({ content: this.state.content, objectId, type: 'task', employee });
  };

  handleDescription = () => {
    const data = this.props.viewConfig
      .filter(item => item.name.slice(0, 6) === 'others')
      .map(item => ({
        name: item.title,
        value: this.props.data[item.name],
      }))
      .filter(item => item.value !== null && item.value !== undefined);
    return data;
  };

  render() {
    const { classes, boDialog } = this.props;
    const { openDrawer, loading, meetingDetail, visitDetail } = this.state;
    const { id } = boDialog;
    const description = this.handleDescription();
    let logs = [];
    if (this.props.isEditting) {
      logs = boDialog.logs || [];
    }

    const renderTimeLine = (item, logNames) => {
      if (logNames !== undefined && logNames.includes(item.type)) {
        switch (item.type) {
          case 'message':
            return (
              <TimelineEvent
                iconColor="white"
                icon={<CommentOutlined fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Bình luận</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span> {item.content}</span>
                  <span>{convertDatetimeToDate(item.createdAt)}</span>
                </div>
              </TimelineEvent>
            );
          case 'Reminder': {
            const objectContent = JSON.parse(item.content);
            return (
              <TimelineEvent
                iconColor="white"
                icon={<CalendarToday fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Nhắc lịch</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span> {objectContent.content}</span>
                  <span>{convertDatetimeToDate(item.createdAt)}</span>
                </div>
                <div>
                  <span
                    style={{ cursor: 'pointer' }}
                    className="text-primary"
                    onClick={() => {
                      this.handleClickDetailReminder(objectContent.reminderId, item._id);
                    }}
                  >
                    <b>Chi tiết</b>
                  </span>
                </div>
              </TimelineEvent>
            );
          }
          case 'Meeting': {
            const objectContent = JSON.parse(item.content);
            return (
              <TimelineEvent
                iconColor="white"
                icon={<MeetingRoom fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Lịch cá nhân</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span> {objectContent.content}</span>
                  <span>{convertDatetimeToDate(item.createdAt)}</span>
                </div>
                <div>
                  <span
                    style={{ cursor: 'pointer' }}
                    className="text-primary"
                    onClick={() => {
                      this.setState({ loading: true });
                      this.handleClickDetailMeeting(objectContent.meetingId, item._id);
                    }}
                  >
                    <b>Chi tiết</b>
                  </span>
                </div>
              </TimelineEvent>
            );
          }
          case 'Visit': {
            const objectContent = JSON.parse(item.content);
            return (
              <TimelineEvent
                iconColor="white"
                icon={<AirportShuttle fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Thăm doanh nghiệp</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span> {objectContent.content}</span>
                  <span>{convertDatetimeToDate(item.createdAt)}</span>
                </div>
                <div>
                  <span
                    style={{ cursor: 'pointer' }}
                    className="text-primary"
                    onClick={() => {
                      this.setState({ loading: true });
                      this.handleClickDetailVisit(objectContent.visitId);
                    }}
                  >
                    <b>Chi tiết</b>
                  </span>
                </div>
              </TimelineEvent>
            );
          }
          case 'call':
            return (
              <TimelineEvent
                iconColor="white"
                icon={<Phone fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043', borderLeft: '4px solid blue' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Gọi điện</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span> {item.content}</span>
                  <span>{convertDatetimeToDate(item.createdAt)}</span>
                </div>
              </TimelineEvent>
            );
          case 'task':
            return (
              <TimelineEvent
                iconColor="white"
                icon={<Phone fontSize="small" />}
                bubbleStyle={{ backgroundColor: '#7bc043', borderColor: '#7bc043', borderLeft: '4px solid blue' }}
                contentStyle={{ borderLeft: '2px solid #63ace5' }}
              >
                <div className={classes.titleTimeline}>
                  <b>Công việc</b>
                  <b>{item.employee ? item.employee.name : ''}</b>
                </div>
                <div className={classes.titleTimeline}>
                  <span>Đã thêm công việc : {item.content}</span>
                  <span>{convertDatetimeToDate(item.createdAt)}</span>
                </div>
              </TimelineEvent>
            );

          default:
            return <div />;
        }
      } else {
        return <div />;
      }
    };
    return (
      <div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Timeline style={{ paddingTop: 0 }}>
            <TimelineEvent
              iconColor="white"
              icon={this.state.value === 0 ? <i className="fas fa-comment-alt fa-lg" /> : <i className="fas fa-handshake fa-lg" />}
              bubbleStyle={{ backgroundColor: '#63ace5', borderColor: '#63ace5' }}
              contentStyle={{ boxShadow: 'none', backgroundColor: '#F4F6F8' }}
            >
              <Paper style={!this.props.businessOpportunities1 ? { backgroundColor: '#F4F6F8', opacity: 0.5 } : {}}>
                <Tabs
                  variant="scrollable"
                  scrollButtons="auto"
                  value={this.state.value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab className={classes.customTab} label="Bình luận" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Nhắc lịch" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Gọi điện" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="SMS" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Email" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Tạo công việc/dự án" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Lịch cá nhân" disabled={!this.props.businessOpportunities1} />
                  <Tab className={classes.customTab} label="Thăm doanh nghiệp" disabled={!this.props.businessOpportunities1} />
                </Tabs>

                <SwipeableViews
                  index={this.state.value}
                  onChangeIndex={this.handleChangeIndex}
                  action={actions => {
                    this.swipeableActions = actions;
                  }}
                  width={window.innerWidth - 260}
                >
                  <TabContainer>
                    <TextField
                      label="Bình luận"
                      multiline
                      rows={4}
                      onChange={this.handleChangeInput}
                      value={this.state.content}
                      name="content"
                      variant="outlined"
                      style={{ width: '100%' }}
                      margin="normal"
                    />
                    <Button variant="outlined" color="primary" onClick={this.handleCreateLog}>
                      Gửi
                    </Button>
                  </TabContainer>
                  {this.state.value === 1 && (
                    <TabContainer>
                      <Grid container justify="center" alignItems="center">
                        <Grid item sm={6}>
                          <TextField
                            fullWidth
                            id="outlined-name"
                            label="Tiêu đề"
                            className=""
                            value={this.state.reminder.title}
                            onChange={event => {
                              const { reminder } = this.state;
                              reminder.title = event.target.value;
                              this.setState({ reminder });
                            }}
                            margin="normal"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item sm={2} />
                        <Grid item sm={4}>
                          <DateTimePicker
                            disablePast
                            keyboard
                            variant="outlined"
                            disableOpenOnEnter
                            keyboardIcon={<i className="far fa-clock fa-xs" />}
                            label="Thời gian"
                            value={this.state.reminder.date}
                            onChange={event => {
                              const { reminder } = this.state;
                              reminder.date = event;
                              this.setState({ reminder });
                            }}
                            format="DD/MM/YYYY HH:mm"
                          />
                        </Grid>
                        <Grid item sm={12}>
                          <TextField
                            fullWidth
                            id="outlined-name"
                            label="Nội dung"
                            className=""
                            value={this.state.reminder.content}
                            onChange={event => {
                              const { reminder } = this.state;
                              reminder.content = event.target.value;
                              this.setState({ reminder });
                            }}
                            margin="normal"
                            variant="outlined"
                            multiline
                            rows={4}
                          />
                        </Grid>
                        <Grid item sm={12} justify="flex-end">
                          <Button
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                              const body = {
                                ...this.state.reminder,
                                ...{
                                  link: `${this.props.path}/${this.props.generalData._id}`,
                                  to: this.props.dashboardPage.profile._id,
                                  type: 'system',
                                  isRead: false,
                                },
                              };
                              this.props.onCreateReminder(body, this.props.generalData._id);
                              this.setState({
                                reminder: {
                                  date: new Date(),
                                  content: '',
                                  title: '',
                                },
                              });
                            }}
                          >
                            Tạo nhắc lịch
                          </Button>
                        </Grid>
                      </Grid>
                    </TabContainer>
                  )}
                  {this.state.value === 2 && <CallPage title="Gọi cho khách hàng" {...this.props} paramId={this.props.data['customer.customerId']} />}
                  <TabContainer>Đồng chí chưa thiết lập cấu hình</TabContainer>
                  {this.state.value === 4 && (
                    <TabContainer>
                      <Email moduleCode={this.props.moduleCode} />
                    </TabContainer>
                  )}
                  {this.state.value === 5 && (
                    <TabContainer>
                      <Button variant="outlined" color="primary" onClick={() => this.setState({ openDrawer: true })}>
                        <Add />
                        {this.props.isTrading === true ? 'Thêm dự án' : 'Thêm công việc'}
                      </Button>
                      <SwipeableDrawer anchor="right" onClose={this.handleDrawer} open={openDrawer} width={window.innerWidth - 260}>
                        <div style={{ width: window.innerWidth - 260 }}>
                          <AddTask
                            data={this.props.isTrading === false ? { isProject: false } : { isProject: true }}
                            id={id}
                            businessOpportunities={this.props.businessOpportunities}
                            exchangingAgreement={this.props.exchangingAgreement}
                            callback={this.backTask}
                            customerBos={this.props.generalData.customer}
                            description={description}
                          />
                        </div>
                      </SwipeableDrawer>
                    </TabContainer>
                  )}
                  {this.state.value === 6 && (
                    <TabContainer>
                      <Meeting
                        onChangeSnackbar={this.props.onChangeSnackbar}
                        isEdittingMeeting={this.state.isEdittingMeeting}
                        meetingDetail={meetingDetail}
                        profile={this.props.profile}
                        handleClear={this.handleClear}
                        {...this.props}
                      />
                    </TabContainer>
                  )}
                  {this.state.value === 7 && (
                    <TabContainer>
                      <Visit handleClear={this.handleClear} {...this.props} visitDetail={visitDetail} />
                    </TabContainer>
                  )}
                </SwipeableViews>
              </Paper>
            </TimelineEvent>
          </Timeline>
          <div className="dividerContainer ">
            <div className="timelineTitle ">
              <Chip style={{ background: '#7bc043', color: 'white' }} label="Kế hoạch dự kiến" className={classes.chip} />
            </div>
            <Divider />
          </div>
          <Timeline style={{ paddingTop: 20, paddingBottom: 40 }}>
            {logs.map(item => renderTimeLine(item, [logNames.MEETING, logNames.VISIT]))}
          </Timeline>
          <div className="dividerContainer ">
            <div className="timelineTitle ">
              <Chip style={{ background: '#7bc043', color: 'white' }} label="Dòng thời gian" className={classes.chip} />
            </div>
            <Divider />
          </div>
          <Timeline style={{ paddingTop: 20 }}>
            {logs.map(item => renderTimeLine(item, [logNames.MESSAGE, logNames.UPDATE, logNames.REMINDER, logNames.TASK]))}
          </Timeline>
        </MuiPickersUtilsProvider>
      </div>
    );
  }

  handleClear = () => {
    this.setState({ meetingDetail: undefined, visitDetail: undefined });
  };
}

TimelineEvent.propTypes = {
  //   classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TimelineEventComponent);
