/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
// import StepContent from '@material-ui/core/StepContent';
import {
  PriorityHigh,
  // MailOutline,
  EventNote,
  Call,
  Check,
  PhoneMissed,
  //  MoreHoriz
  Chat,
  SignalCellularAlt,
  DeleteForever,
  AddCircle,
} from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import AddProjects from 'containers/AddProjects';
import { Fab, Tabs, Tab, TableBody, Table, TableCell, TableRow, TextField, Checkbox, Tooltip, Avatar, MenuItem, Menu } from '@material-ui/core';
import lang from '../../assets/img/faces/lang.jpg';
import { API_NOTIFY, API_VOTE, API_PROFILE, API_CUSTOMERS, API_MAIL, API_TEMPLATE, API_MEETING } from '../../config/urlConfig';
import { serialize, fetchData } from '../../helper';
import { Dialog, AsyncAutocomplete, SwipeableDrawer } from '.';
import Comment from './Comment';
import CalendarComponent from '../Calendar';
import { clientId } from '../../variable';

import './Planner/kanban.css';
const tabStyle = () => ({
  customTab: {
    minWidth: 0,
    '& span': {
      padding: 2.5,
    },
  },
});

const TabsChat = withStyles(tabStyle)(props => {
  const { classes } = props;
  const [value, setValue] = React.useState(0);
  const [openDialogVote, setOpenDialogVote] = React.useState(false);
  const [plans, setPlans] = React.useState([{ plan: '', join: [] }]);
  const [title, setTitle] = React.useState('');
  const skip = React.useState('')[0];
  const [vote, setVote] = React.useState([]);
  const [id, setId] = React.useState('');
  const [profile, setProfile] = React.useState('');
  const [mail, setMail] = React.useState({ to: [], subject: '', text: '' });
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [state, setState] = React.useState({
    templatess: [],
    template: '',
    meetingCalendars: [],
  });

  // const modules = JSON.parse(localStorage.getItem('viewConfig'))

  useEffect(() => {
    fetchData(
      `${API_MEETING}?${serialize({
        filter: { $and: [{ typeCalendar: '1' }, { 'people._id': { $in: [props.profile ? props.profile._id : '5d7b1bed6369c11a047844e7'] } }] },
      })}`,
    )
      .then(meetingCalendar => setState(state => ({ ...state, meetingCalendars: meetingCalendar.data })))
      .catch(() => {
        setState({ loading: false });
      });
  }, []);
  // console.log('sadasda', state.meetingCalendars);
  useEffect(() => {
    fetchData(`${API_TEMPLATE}?clientId=${clientId}`)
      .then(templates => setState(state => ({ ...state, templatess: templates })))
      .catch(() => {
        setState({ loading: false });
      });
  }, []);

  function handleAddVote() {
    setId('');
    setOpenDialogVote(true);
  }

  function handleCLoseVote() {
    setOpenDialogVote(false);
  }

  function handleChangePlan(e, index) {
    const newArr = [...plans];
    newArr[index].plan = e.target.value;
    setPlans(newArr);
  }

  function addPlan() {
    const data = {
      plan: '',
      join: [],
    };
    const tabData = plans.concat(data);
    setPlans(tabData);
  }

  function deletePlan(e, index) {
    const tabData = plans;
    const newTab = [...tabData];
    newTab.splice(index, 1);
    setPlans(newTab);
  }

  function onSaveVote() {
    const data = {
      title,
      plans,
    };
    if (id === '')
      fetch(API_VOTE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(() => {
          // eslint-disable-next-line no-alert
          alert('Thêm mới thành công');
          setOpenDialogVote(false);
          getData;
        })
        // eslint-disable-next-line no-alert
        .catch(() => alert('Thêm mới thất bại'));
    else
      fetch(`${API_VOTE}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(() => {
          // eslint-disable-next-line no-alert
          alert('Cập nhật thành công');
          setOpenDialogVote(false);
          getData;
        })
        // eslint-disable-next-line no-alert
        .catch(() => {
          alert('Cập nhật thất bại');
        });
  }

  const getData = useEffect(() => {
    const query = { limit: 1, skip };
    const queryString = serialize(query);

    fetch(`${API_VOTE}?${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(data => {
        setVote(data.data);
      });
  }, []);

  function totalPlan(item) {
    let total = 0;
    item.plans.forEach(element => {
      total += element.join.length;
    });
    return total;
  }

  function getCurrentVote(id) {
    fetch(`${API_VOTE}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(data => {
        setTitle(data.title);
        setId(id);
        setPlans(data.plans);
      });
    setOpenDialogVote(true);
  }

  function JoinVote(joinArr) {
    const joins = joinArr.joins;

    const length = joins.length;
    const [anchorEl, setAnchorEl] = React.useState(null);
    switch (length) {
      case 0:
        return null;
      case 1:
      case 2:
      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            {joins.map(i => (
              <Tooltip className="kanban-avatar" placement="top-start" key={i._id} title={i.name}>
                <Avatar alt="Nguyễn văn A" src={i.avatar ? `${i.avatar}?allowDefault=true` : lang} />
              </Tooltip>
            ))}
          </div>
        );
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
            <Tooltip className="kanban-avatar kanban-avatar-firt" placement="top-start" title={joins[0].name}>
              <Avatar alt={joins[0].name} src={joins[0].avatar ? `${joins[0].avatar}?allowDefault=true` : lang} />
            </Tooltip>
            <Tooltip className="kanban-avatar" placement="top-start" title={joins[1].name}>
              <Avatar alt={joins[1].name} src={joins[1].avatar ? `${joins[1].avatar}?allowDefault=true` : lang} />
            </Tooltip>
            <Tooltip className="kanban-avatar" placement="top-start" title={joins[2].name}>
              <Avatar alt={joins[2].name} src={joins[2].avatar ? `${joins[2].avatar}?allowDefault=true` : lang} />
            </Tooltip>

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

  useEffect(() => {
    fetch(API_PROFILE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(data => {
        setProfile(data);
      });
  }, []);

  function handleProfile(e, joins, index) {
    const newPlan = [...plans];
    let newJoin = [];
    const check = joins.map(i => i._id).includes(profile._id);
    if (check) newJoin = joins.filter(i => i._id !== profile._id);
    else newJoin = joins.concat(profile);

    newPlan[index].join = newJoin;
    setPlans(newPlan);
  }

  async function sendMail() {
    if (!mail.text || !mail.subject || !state.template || !mail.to || !mail.to.length) {
      return;
    }
    try {
      const data = { ...mail };
      data.to = _.uniq(mail.to.map(i => i.email).filter(i => Boolean(i))).join();
      if (!data.to) {
        alert('Danh sách Khách hàng chọn không có email');
        return;
      }
      data.html = 'xin chao';
      await fetchData(API_MAIL, 'POST', data);
      alert('Gui mail thanh cong');
    } catch (error) {
      alert(error);
    }
  }

  function backTask() {
    setOpenDrawer(false);
  }

  return (
    <div>
      <Tabs
        // variant="scrollable"
        // scrollButtons="auto"
        value={value}
        onChange={(e, value) => setValue(value)}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab value={0} className={classes.customTab} label="Bình luận" />
        <Tab value={1} className={classes.customTab} label="Gọi điện" />
        <Tab value={2} className={classes.customTab} label="SMS" />
        <Tab value={3} className={classes.customTab} label="Email" />
        <Tab value={4} className={classes.customTab} label="Tạo công việc" />
        <Tab value={5} className={classes.customTab} label="Tạo Vote" />
        <Tab value={6} className={classes.customTab} label="Lịch cá nhân" />
      </Tabs>

      {value === 0 ? <Comment code="DaskBoard" id="5d1dcb4cb876351c423b0117" /> : null}

      {value === 3 ? (
        <div>
          <Typography variant="subtitle2" gutterBottom align="center" style={{ marginTop: '20px' }}>
            Gửi Email
          </Typography>
          <TextField
            // error={!mail.subject}
            // helperText={mail.subject ? false : 'Không được bỏ trống'}
            onChange={e => setMail({ ...mail, subject: e.target.value })}
            value={mail.subject}
            fullWidth
            label="Subject"
            variant="outlined"
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <AsyncAutocomplete
            // error={!mail.to || !mail.to.length}
            // helperText={mail.to && mail.to.length ? false : 'Không được bỏ trống'}
            label="Khách hàng"
            url={API_CUSTOMERS}
            value={mail.to}
            isMulti
            onChange={value => setMail({ ...mail, to: value })}
            variant="outlined"
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            // error={!mail.text}
            // helperText={mail.text ? false : 'Không được bỏ trống'}
            onChange={e => setMail({ ...mail, text: e.target.value })}
            value={mail.text}
            fullWidth
            label="Text"
            variant="outlined"
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            // error={!state.template}
            // helperText={state.template ? false : 'Không được bỏ trống'}
            value={state.template}
            fullWidth
            select
            onChange={e => setState({ ...state, template: e.target.value })}
            label="Biểu mẫu"
            variant="outlined"
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          >
            {state.templatess.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item.title}
              </MenuItem>
            ))}
          </TextField>
          {/* <TextField
            // required
            className={classes.textField}
            label="Module"
            select
            value={moduleCode}
            fullWidth
            onChange={e => setModuleCode(e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="dense"
          >
            {modules.map(item => (
              <MenuItem value={item.code}>{item.code}</MenuItem>
            ))}
          </TextField> */}
          <Button variant="outlined" color="primary" onClick={sendMail}>
            Gửi Email
          </Button>
        </div>
      ) : null}

      {value === 4 ? (
        <div style={{ marginTop: '20px' }}>
          <Button variant="outlined" color="primary" onClick={() => setOpenDrawer(true)}>
            Tạo công việc
          </Button>
        </div>
      ) : null}

      {value === 5 ? (
        <div>
          <Button variant="outlined" color="primary" onClick={handleAddVote}>
            Tạo Vote
          </Button>
          <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
            <SignalCellularAlt color="primary" fontSize="small" />
            <Typography variant="body1">Bình chọn</Typography>
          </div>
          {vote.map(item => (
            <div>
              <Typography style={{ color: '#000000', fontWeight: 'bold', fontSize: 16, padding: '5px 0px' }}>{item.title}</Typography>
              <Typography style={{ color: '#0040e0' }} variant="body2">
                {totalPlan(item)} lượt bình chọn
              </Typography>
              {item.plans.map(it => (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0px' }}>
                  <Typography variant="body2">{it.plan}</Typography>
                  <Typography variant="body2">{it.join.length}</Typography>
                </div>
              ))}
              <Typography
                onClick={() => getCurrentVote(item._id)}
                variant="subtitle2"
                color="primary"
                style={{ display: 'flex', justifyContent: 'center', marginTop: 10, cursor: 'pointer' }}
              >
                Xem bình chọn
              </Typography>
            </div>
          ))}
        </div>
      ) : null}

      {value === 6 ? (
        <div style={{ marginTop: 20 }}>
          {' '}
          <CalendarComponent meetings={state.meetingCalendars} />
        </div>
      ) : null}
      {/* // them vote */}
      <Dialog onSave={onSaveVote} title="Bình chọn" open={openDialogVote} onClose={handleCLoseVote}>
        <TextField
          style={{ width: '75%' }}
          multiline
          rows={2}
          onChange={e => setTitle(e.target.value)}
          placeholder="Đặt câu hỏi cho bình chọn"
          value={title}
        />
        <div>
          <Table>
            <TableBody>
              {plans.map((item, index) => (
                <TableRow>
                  <TableCell style={{ width: 8 }}>
                    <Checkbox
                      onChange={e => handleProfile(e, item.join, index)}
                      checked={item.join.map(i => i._id).includes(profile._id)}
                      color="primary"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField fullWidth onChange={e => handleChangePlan(e, index)} placeholder={`Phương án ${index + 1}`} value={item.plan} />
                  </TableCell>
                  <TableCell>
                    <DeleteForever style={{ cursor: 'pointer' }} color="primary" onClick={e => deletePlan(e, index)} />
                  </TableCell>
                  {item.join && item.join.length ? (
                    <TableCell>
                      <JoinVote joins={item.join} />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AddCircle color="primary" onClick={addPlan} style={{ cursor: 'pointer' }} />
      </Dialog>
      <SwipeableDrawer anchor="right" onClose={() => setOpenDrawer(false)} open={openDrawer} width={window.innerWidth - 260}>
        <div>
          <AddProjects data={{ isProject: false }} callback={backTask} id="add" />
        </div>
      </SwipeableDrawer>
    </div>
  );
});

const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.unit * 1,
    marginRight: theme.spacing.unit * 1,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

function Icon(icon, color) {
  const Hio = () => (
    <Fab color="primary" size="small" style={{ background: color }}>
      {icon}
    </Fab>
  );
  return Hio;
}

export default withStyles(styles)(props => {
  const { classes } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const [skip, setSkip] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState([]);
  const [votes, setVotes] = React.useState([]);
  const [skipVote, setSkipVote] = React.useState(0);
  const [countVote, setCountVote] = React.useState(0);

  useEffect(
    () => {
      const query = { limit: 3, skip };
      const queryString = serialize(query);

      fetch(`${API_NOTIFY}?${queryString}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(result => result.json())
        .then(data => {
          setCount(data.count);
          const newDt = notifications.concat(data.data);
          setNotifications(newDt);
        });
    },
    [skip],
  );

  useEffect(
    () => {
      const query = { limit: 4, skipVote };
      const queryString = serialize(query);

      fetch(`${API_VOTE}?${queryString}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(result => result.json())
        .then(data => {
          setCountVote(data.count);
          const newDt = votes.concat(data.data);
          setVotes(newDt);
        });
    },
    [skipVote],
  );

  function handleNotifica() {
    setSkip(skip + 5);
  }

  function handleVote() {
    setSkipVote(skip + 3);
  }
  // console.log('props.meetingCalenda', props.meetingCalenda);

  const steps = [
    {
      content: (
        <React.Fragment>
          <TabsChat profile={props.profile} />
          {/* <Comment code="DaskBoard" id="5d1dcb4cb876351c423b0117" /> */}
        </React.Fragment>
      ),
      icon: <Chat />,
      color: '#2196f3',
    },
    {
      content: (
        <React.Fragment>
          {notifications.map(elm => (
            <div style={{ display: 'flex' }}>
              <p style={{ fontWeight: 'bold', marginRight: 5, fontSize: 12 }}>{props.profile ? props.profile.name : 'Admin'}:</p>
              <p style={{ fontSize: 11 }}>{elm.title}</p>
            </div>
          ))}
          {count > (skip * 1 + 1) * 5 ? (
            <div onClick={() => handleNotifica()} style={{ color: '#1127b8', cursor: 'pointer', fontSize: 12 }}>
              Xem thêm
            </div>
          ) : null}
        </React.Fragment>
      ),
      icon: <EventNote />,
      color: '#2196f3',
      time: 'Dòng sự kiện',
    },
    {
      content: (
        <React.Fragment>
          {votes.map(elm => (
            <div style={{ display: 'flex' }}>
              <p style={{ fontWeight: 'bold', marginRight: 5, fontSize: 12 }}>{elm.createdBy ? elm.createdBy.name : 'Admin'}:</p>
              <p style={{ fontSize: 11 }}>{elm.title}</p>
            </div>
          ))}
          {countVote > (skipVote * 1 + 1) * 3 ? (
            <div onClick={() => handleVote()} style={{ color: '#1127b8', cursor: 'pointer', fontSize: 12 }}>
              Xem thêm
            </div>
          ) : null}
        </React.Fragment>
      ),
      icon: <PriorityHigh />,
      color: '#2196f3',
      time: 'Vote',
    },
    {
      content: (
        <React.Fragment>
          <p>
            Cuộc gọi nhỡ khách hàng <b>Đỗ Thắng</b>
          </p>
          <div>
            <span style={{ color: '#2196f3', cursor: 'pointer', fontWeight: 'bold' }}>
              Gọi lại
              <Link to="/call">
                <Call />
              </Link>
            </span>
          </div>
        </React.Fragment>
      ),
      icon: <PhoneMissed />,
      color: '#ff3d2e',
      time: '30-07-2019 6PM',
    },
    {
      content: (
        <React.Fragment>
          <p>
            Hoàn thành công việc <b>Kiểm tra rà soát an ninh hệ thống máy chủ </b>
          </p>
          <div>
            <p onClick={props.openComplete}>
              <span style={{ color: '#2196f3', cursor: 'pointer', fontWeight: 'bold' }}>Xem chi tiết ...</span>
            </p>
          </div>
        </React.Fragment>
      ),
      icon: <Check />,
      color: 'rgb(87, 228, 17)',
      time: '30-07-2019 6PM',
    },
  ].map(item => ({ ...item, icon: Icon(item.icon, item.color) }));

  function handleReset() {
    setActiveStep(0);
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map(item => (
          <Step key={item.content}>
            <StepLabel StepIconComponent={item.icon}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: '#03a9f4', borderRadius: '15px', padding: 4, color: 'white' }}>{item.time}</div>
              </div>

              <div style={{ background: 'white', padding: '15px 5px', borderRadius: '4px' }}>
                <Typography>{item.content}</Typography>
              </div>
            </StepLabel>
            <hr />
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
});
