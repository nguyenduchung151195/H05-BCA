/* eslint-disable no-alert */
import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { AccessAlarmRounded, DeleteOutline, PriorityHighOutlined } from '@material-ui/icons';
import { Avatar, Button, Checkbox } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import { toVietNamDate, fetchData, serialize } from '../../helper';
import { API_NOTE } from '../../config/urlConfig';
import logoBCA from '../../assets/img/logoBoCongAn.png'

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      //   maxWidth: 30,
      width: '100%',
      backgroundColor: 'transparent',
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: 1,
    '&:focus': {
      opacity: 1,
    },
  },
}))(props => <Tab disableRipple {...props} />);

const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: 3,
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
  demo2: {
    backgroundColor: '#1f84cc',
  },
});

export default withStyles(useStyles)(({ classes }) => {
  const [value, setValue] = React.useState(0);
  const [addNote, setAddNote] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [selectedDate, handleDateChange] = React.useState(new Date());
  const [notes, setNotes] = React.useState([]);
  const [priority, setPriority] = React.useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function getNote() {
    const filter = {};
    switch (value) {
      case 0:
        filter.priority = true;
        break;
      case 1:
        {
          const d1 = new Date();
          d1.setHours(0, 0, 0, 0);
          d1.setDate(d1.getDate() + 1);
          const d2 = new Date();
          d2.setHours(0, 0, 0, 0);
          filter.time = { $lt: new Date(d1).toISOString(), $gt: new Date(d2).toISOString() };
        }
        break;
    }
    try {
      const query = serialize({ filter });
      fetchData(`${API_NOTE}?${query}`).then(respon => {
        setInput('');
        setAddNote(false);
        setNotes(respon.data);
      });
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  useEffect(() => {
    getNote();
  }, []);

  useEffect(() => getNote(), [value]);

  function sendNote() {
    if (!input.trim()) return;
    const body = { content: input, priority, time: selectedDate };
    try {
      fetchData(API_NOTE, 'POST', body).then(() => {
        getNote();
      });
    } catch (error) {
      window.alert('Có loi vơi du lieu');
    }
  }

  function setInputValue(e) {
    setInput(e.target.value);
  }

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
          <StyledTab label="Quan trọng" />
          <StyledTab label="Trong ngày" />
          <StyledTab label="Khác" />
        </StyledTabs>
        <Typography className={classes.padding} />
      </div>
      <div className="note-main-content">
        {/* <ClickAwayListener onClickAway={() => setAddNote(false)}> */}
        <div className="note-main-add">
          <span style={{ alignItems: 'flex-start' }}>
            <Avatar
              style={{ width: 25, height: 25 }}
              src={logoBCA}
            />
            <textarea value={input} onChange={setInputValue} onClick={() => setAddNote(true)} placeholder="Ghi chú" />
          </span>
          {addNote ? (
            <React.Fragment>
              <span>
                Quan trọng: <Checkbox checked={priority} onChange={e => setPriority(e.target.checked)} color="primary" />
              </span>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DateTimePicker inputVariant="outlined" format="DD/MM/YYYY HH:mm" value={selectedDate} onChange={handleDateChange} />
                </MuiPickersUtilsProvider>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={sendNote} color="primary">
                  Tạo mới
                </Button>
              </div>
            </React.Fragment>
          ) : null}
        </div>
        {/* </ClickAwayListener> */}
        {notes.map(i => (
          <NoteItem priority={i.priority} getNote={getNote} id={i._id} key={i._id} content={i.content} />
        ))}
      </div>
    </div>
  );
});

function NoteItem({ id, content, getNote, priority }) {
  const color = React.useState(priority ? '#FF9800' : null)[0];
  function deleteNote() {
    const result = window.confirm('Đồng chí có muốn xóa ghi chú này?');
    if (!result) return;
    fetchData(`${API_NOTE}/${id}`, 'DELETE').then(() => {
      getNote();
    });
  }

  return (
    <div className="note-main-item">
      <p className="note-main-item-content">
        <span style={{ color }}>{content}</span>
        <div>
          <DeleteOutline onClick={deleteNote} style={{ fontSize: '1rem', color: '#3c4858', cursor: 'pointer' }} />

          {/* <Edit style={{ fontSize: '1rem', color: '#007bff' }} /> */}
          {/* <PriorityHighRounded style={{ fontSize: '1rem', color, cursor: 'pointer' }} /> */}
          <PriorityHighOutlined style={{ fontSize: '1rem', color, cursor: 'pointer' }} />
        </div>
      </p>
      <p>
        <AccessAlarmRounded style={{ fontSize: '1rem' }} color="primary" />
        {toVietNamDate()}
      </p>
    </div>
  );
}
