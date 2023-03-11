/**
 *
 * MeetingRoom
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListPage from 'components/List';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { FormControl, Checkbox } from '@material-ui/core';
import { Tabs, Tab } from 'components/LifetekUi';
import { Add } from '@material-ui/icons';
import { Dialog, Paper, TextField, Typography, SwipeableDrawer } from '../../components/LifetekUi';
import { API_MEETING } from '../../config/urlConfig';
import makeSelectMeetingRoom from './selectors';
import reducer from './reducer';
import { mergeData, postData, getCurrent, putData, getData } from './actions';
import saga from './saga';
import AddMeetingSchedule from '../AddMeetingSchedule/Loadable';
import { meetingRoomColumns } from '../../variable';
import CalendarComponent from '../../components/Calendar';
import { viewConfigCheckRequired, viewConfigCheckForm, getHost } from 'utils/common';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { changeSnackbar } from '../Dashboard/actions';
/* eslint-disable react/prefer-stateless-function */
export class MeetingRoom extends React.Component {
  constructor(props) {
    super(props);
    const moduleCode = 'MettingRoom';
    const dispatchColumns = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === moduleCode).listDisplay.type.fields.type
      .columns;
    const names = {};
    dispatchColumns.forEach(item => {
      names[item.name] = item.title;
    });
    const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');
    this.state = {
      moduleCode,
      names,
      checkRequired,
      checkShowForm,
      localMessages: {},
      disableSave: false,
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
    this.props.getData();
  }

  // componentWillReceiveProps(props) {
  //   if ((props.meetingRoom && props.meetingRoom.error) !== (this.props.meetingRoom && this.props.meetingRoom.error)) {
  //     this.setState({ disableSave: false });
  //   }
  // }

  mapFunctionCalendar = item => {
    return {
      ...item,
      // name: (
      //   // eslint-disable-next-line react/button-has-type
      //   <button style={{ cursor: 'pointer' }} onClick={() => this.handleChangeRoom(item._id)}>
      //     {item.name}
      //   </button>
      // ),
      utilities: <span>{item.originItem && item.originItem.utilities && item.originItem.utilities.join(', ')}</span>,
    };
  };

  handleChangeRoom = id => {
    this.props.mergeData({ openDrawer: true, id });
    this.props.getCurrent(id);
  };

  addItemRoom = () => (
    <Add
      style={{ color: 'white' }}
      onClick={() => {
        this.props.mergeData({
          openDrawer: true,
          name: '',
          code: '',
          address: '',
          acreage: 0,
          utilities: [],
        });
        this.setState({ disableSave: false, localMessages: {} });
      }}
    >
      Open Menu
    </Add>
  );

  handleChange = (e, item) => {
    const { meetingRoom } = this.props;
    const newPlan = [...meetingRoom.utilities];
    let newUtilities = [];
    const check = meetingRoom.utilities.map(i => i).includes(item);
    if (check) newUtilities = newPlan.filter(i => i !== item);
    else newUtilities = newPlan.concat(item);
    this.props.mergeData({ utilities: newUtilities });
  };

  openTitleDialog = id => {
    // this.props.history.push(`Calendar/working-schedule-detail-room/${id}`);
    this.props.mergeData({ openEditMeetingRoom: true, id });
    this.props.getCurrent(id);
  };

  render() {
    const { meetingRoom } = this.props;
    const { names, checkRequired, checkShowForm, localMessages } = this.state;
    const newMeeting = meetingRoom.meetings.filter(elm => (elm.roomMetting ? elm.roomMetting._id === meetingRoom._id : ''));

    return (
      <div>
        <Paper style={{ position: 'relative', zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px', marginTop: 10 }}>
          <ListPage
            reload={meetingRoom.reload}
            settingBar={[this.addItemRoom()]}
            disableAdd
            isPlanChild
            // disableEdit
            onEdit={item => {
              this.handleChangeRoom(item._id);
              this.setState({ disableSave: false, localMessages: {} });
            }}
            // columns={meetingRoomColumns}
            apiUrl={`${API_MEETING}/room`}
            mapFunction={this.mapFunctionCalendar}
            code="MettingRoom"
            onRowClick={item => {
              this.openTitleDialog(item._id);
            }}
            pointerCursor="pointer"
            listMenus={[]}
          />
        </Paper>

        <Dialog
          anchor="right"
          onClose={() => this.props.mergeData({ openDrawer: false, id: 'add', tab: 0 })}
          open={meetingRoom.openDrawer}
          // title=" Thông tin nhóm đánh giá"
          disableSave={this.state.disableSave}
          onSave={() => {
            this.setState({ disableSave: true });
            setTimeout(() => {
              this.onSaveRoom();
            }, 1);
          }}
        >
          <div>
            <Typography variant="h6" style={{ fontWeight: 600, fontSize: 16 }}>
              {meetingRoom.id === 'add' ? 'Thêm mới quản lý phòng họp' : 'Chỉnh sửa quản lý phòng họp'}
            </Typography>
            {meetingRoom.id !== 'add' ? (
              <Tabs value={meetingRoom.tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
                <Tab value={0} label="Thông tin chi tiết" />
                <Tab value={1} label="Lịch phòng họp" />
              </Tabs>
            ) : null}
            {meetingRoom.tab === 0 ? (
              <div style={{ marginTop: 20 }}>
                <CustomInputBase
                  value={meetingRoom.code}
                  fullWidth
                  onChange={e => this.props.mergeData({ code: e.target.value })}
                  label={names.code}
                  InputLabelProps={{ shrink: true }}
                  // error={meetingRoom.code === ''}
                  // helperText={meetingRoom.code === '' ? null : 'Không được bỏ trống'}
                  error={localMessages && localMessages.code}
                  helperText={localMessages && localMessages.code}
                  required={checkRequired.code}
                  checkedShowForm={checkShowForm.code}
                />
                <CustomInputBase
                  value={meetingRoom.name}
                  fullWidth
                  onChange={e => this.props.mergeData({ name: e.target.value })}
                  label={names.name}
                  InputLabelProps={{ shrink: true }}
                  // error={meetingRoom.name === ''}
                  // helperText={meetingRoom.name === '' ? null : 'Không được bỏ trống'}
                  error={localMessages && localMessages.name}
                  helperText={localMessages && localMessages.name}
                  required={checkRequired.name}
                  checkedShowForm={checkShowForm.name}
                />
                <CustomInputBase
                  value={meetingRoom.address}
                  fullWidth
                  onChange={e => this.props.mergeData({ address: e.target.value })}
                  label={names.address}
                  InputLabelProps={{ shrink: true }}
                  // error={meetingRoom.address === ''}
                  // helperText={meetingRoom.address === '' ? null : 'Không được bỏ trống'}
                  error={localMessages && localMessages.address}
                  helperText={localMessages && localMessages.address}
                  required={checkRequired.address}
                  checkedShowForm={checkShowForm.address}
                />

                <CustomInputBase
                  value={meetingRoom.acreage}
                  fullWidth
                  onChange={e => this.props.mergeData({ acreage: e.target.value })}
                  label={names.acreage}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  error={localMessages && localMessages.acreage}
                  helperText={localMessages && localMessages.acreage}
                  required={checkRequired.acreage}
                  checkedShowForm={checkShowForm.acreage}
                />

                <FormControl component="fieldset">
                  <Typography variant="subtitle2" style={{ fontWeight: 600, fontSize: 14 }}>
                    {' '}
                    Tiện ích
                  </Typography>
                  {meetingRoom.utilitiesArr.map(item => (
                    <div style={{ display: 'flex' }}>
                      <Checkbox
                        onChange={e => this.handleChange(e, item)}
                        checked={meetingRoom.utilities.map(i => i).includes(item)}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                      <Typography>{item}</Typography>{' '}
                    </div>
                  ))}
                </FormControl>
              </div>
            ) : null}
            {meetingRoom.tab === 1 ? (
              <div>
                {' '}
                <CalendarComponent meetings={newMeeting} handleEdit={this.handleEditMeeting} handleAdd handleDelete={this.handleDelete} />{' '}
              </div>
            ) : null}
          </div>
        </Dialog>

        {/* <Dialog
          anchor="right"
          onClose={() => this.props.mergeData({ openEditMeetingRoom: false, id: 'add' })}
          open={meetingRoom.openEditMeetingRoom}
          // title=" Thông tin nhóm đánh giá"
          disableSave={this.state.disableSave}
        >
          <div>
            <Typography align="center" variant="h6" style={{ fontWeight: 600, fontSize: 16 }}>
              Chi tiết Quản lý phòng họp
            </Typography>
            {meetingRoom.id !== 'add' ? (
              <Tabs value={meetingRoom.tab} onChange={(e, tab) => this.props.mergeData({ tab })}>
                <Tab value={0} label="Thông tin chi tiết" />
                <Tab value={1} label="Lịch phòng họp" />
              </Tabs>
            ) : null}
            {meetingRoom.tab === 0 ? (
              <div style={{ marginTop: 20 }}>
                <CustomInputBase value={meetingRoom.code} fullWidth label={names.code} InputLabelProps={{ shrink: true }} disabled />
                <CustomInputBase value={meetingRoom.name} fullWidth label={names.name} InputLabelProps={{ shrink: true }} disabled />
                <CustomInputBase value={meetingRoom.address} fullWidth label={names.address} InputLabelProps={{ shrink: true }} disabled />

                <CustomInputBase
                  value={meetingRoom.acreage}
                  fullWidth
                  label={names.acreage}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  disabled
                />

                <FormControl component="fieldset">
                  <Typography variant="subtitle2" style={{ fontWeight: 600, fontSize: 14 }}>
                    {' '}
                    Tiện ích
                  </Typography>
                  {meetingRoom.utilitiesArr.map(item => (
                    <div style={{ display: 'flex' }}>
                      <Checkbox
                        onChange={e => this.handleChange(e, item)}
                        checked={meetingRoom.utilities.map(i => i).includes(item)}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        disabled
                      />
                      <Typography>{item}</Typography>{' '}
                    </div>
                  ))}
                </FormControl>
              </div>
            ) : null}
            {meetingRoom.tab === 1 ? (
              <div>
                {' '}
                <CalendarComponent meetings={newMeeting} handleEdit={this.handleEditMeeting} handleAdd handleDelete={this.handleDelete} />{' '}
              </div>
            ) : null}
          </div>
        </Dialog> */}

        <SwipeableDrawer
          anchor="right"
          onClose={() => this.props.mergeData({ openDrawerMeeting: false, id: 'idCalendar' })}
          open={meetingRoom.openDrawerMeeting}
          width={window.innerWidth - 260}
        >
          <div style={{ width: window.innerWidth - 260 }}>
            <AddMeetingSchedule id={meetingRoom.idCalendar} callback={this.callbackMeeting} />
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

  onSaveRoom = () => {
    const { moduleCode } = this.state;
    // const messages = viewConfigCheckForm(moduleCode, dot.dot(data));

    const { meetingRoom } = this.props;
    // if (meetingRoom.name === '' || meetingRoom.address === '' || meetingRoom.code === '') return;
    const data = {
      code: meetingRoom.code,
      address: meetingRoom.address,
      acreage: meetingRoom.acreage,
      utilities: meetingRoom.utilities,
      name: meetingRoom.name,
    };
    const messages = viewConfigCheckForm(moduleCode, data);
    this.setState({
      localMessages: messages,
    });
    if (Object.values(messages).filter(v => v).length) {
      return (
        this.props.onChangeSnackbar({ status: true, message: 'Vui lòng nhập đầy đủ các trường thông tin', variant: 'error' }),
        this.setState({ disableSave: false })
      );
    }
    if (meetingRoom.id === 'add') {
      this.setState({ disableSave: true });
      this.props.postData(data);
    } else {
      this.setState({ disableSave: true });
      this.props.putData(meetingRoom.id, data);
    }
    this.props.mergeData({ openDrawer: false, reload: meetingRoom.reload + 1, id: 'add' });
  };

  handleEditMeeting = arg => {
    return this.props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí chỉ có thể xem ở phần này', status: true });
  };

  handleDelete = data => {
    return this.props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí chỉ có thể xem ở phần này', status: true });
  };

  callbackMeeting = () => {
    const { meetingRoom } = this.props;
    this.props.mergeData({ openDrawerMeeting: false, reload: meetingRoom.reload + 1 });
  };
}

MeetingRoom.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  meetingRoom: makeSelectMeetingRoom(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    postData: data => dispatch(postData(data)),
    getCurrent: id => dispatch(getCurrent(id)),
    putData: (id, data) => dispatch(putData(id, data)),
    getData: () => dispatch(getData()),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'meetingRoom', reducer });
const withSaga = injectSaga({ key: 'meetingRoom', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(MeetingRoom);
