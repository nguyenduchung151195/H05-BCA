import React from 'react';
import './note.css';
import { Fab, Popover } from '@material-ui/core';
import { EventNoteRounded, ChatBubbleRounded } from '@material-ui/icons';
import Conversation from '../../containers/Conversation';
import AntTab from './AntTab';
// import { fetchData } from '../../helper';
// import { API_PROFILE } from '../../config/urlConfig';
export default function Extends({ socket }) {
  const [display, setDisplay] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  // const [profile, setProfile] = React.useState({});
  const handleClick = event => {
    if (open) {
      setOpen(null);
      return;
    }
    setOpen(event.currentTarget);
  };

  function handleDisplayChat() {
    setDisplay(!display);
  }

  // function getProfile() {
  //   fetchData(API_PROFILE).then(response => {
  //     setProfile(response);
  //   });
  // }

  // useEffect(() => {
  //   getProfile();
  // }, []);

  return (
    <React.Fragment>
      {/* <Conversation setDisplay={handleDisplayChat} display={display} socket={socket} />
      <div className="note-container">
        <Fab size="small" onClick={handleClick} color="primary">
          <EventNoteRounded />
        </Fab>
        <Fab size="small" onClick={handleDisplayChat} color="primary">
          <ChatBubbleRounded />
        </Fab>
        <Popover
          onClose={() => setOpen(false)}
          // anchorReference="anchorPosition"
          anchorPosition={{ top: 20 }}
          anchorEl={open}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={Boolean(open)}
        >
          <AntTab />
        </Popover>
      </div> */}
    </React.Fragment>
  );
}
