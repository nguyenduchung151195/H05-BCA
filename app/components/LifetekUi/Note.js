import React from 'react';
import './note.css';
import { Fab, Popover } from '@material-ui/core';
import { EventNoteRounded, ChatBubbleRounded } from '@material-ui/icons';
import AntTab from './AntTab';

export default function Note() {
  const [open, setOpen] = React.useState(false);
  const handleClick = event => {
    if (open) {
      setOpen(null);
      return;
    }
    setOpen(event.currentTarget);
  };

  return (
    <div className="note-container">
      <Fab onClick={handleClick} color="primary">
        <EventNoteRounded style={{ fontSize: '2rem' }} />
      </Fab>
      <Fab color="primary">
        <ChatBubbleRounded style={{ fontSize: '2rem' }} />
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
    </div>
  );
}
