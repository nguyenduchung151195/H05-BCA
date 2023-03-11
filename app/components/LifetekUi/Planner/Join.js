import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectProfile } from 'containers/Dashboard/selectors';
// eslint-disable-next-line import/no-unresolved
import './kanban.css';
import {
  // ArrowBackIos,
  // ArrowForwardIos,
  // Done,
  // Close,
  Add,
  Notifications,
  Description,
  AttachFile,
  Comment as InsertCommentOutlined,
  // ModeComment,
  Assignment,
  MoreVert,
  Star,
  InsertDriveFile,
  Delete,
  Image,
  Search,
} from '@material-ui/icons';
// import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Snackbar from 'components/Snackbar';
import { Avatar, Tooltip, Button, Menu, Checkbox, MenuItem, Grid } from '@material-ui/core';
import AddTask from 'containers/AddProjects';
// import AddProjects from 'containers/AddProjects';
import { serialize, priotyColor, taskPrioty, taskPriotyColor, groupBy, fetchData } from '../../../helper';
import lang from '../../../assets/img/faces/lang.jpg';
import Dialog from '../Dialog';
// import AutoComplete from '../LtAutocomplete';
import { API_TASK_PROJECT, UPLOAD_IMG_SINGLE, API_USERS, API_ORIGANIZATION, API_SAMPLE_PROCESS } from '../../../config/urlConfig';
import DepartmentAndEmployee from '../../Filter/DepartmentAndEmployee';

function Join({ joins, add, onAdd }) {
  const length = joins.length;
  const [anchorEl, setAnchorEl] = React.useState(null);
  switch (length) {
    case 0:
      return add ? <Add onClick={onAdd} /> : null;
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
          {add ? (
            <span className="add-member">
              {' '}
              <Add onClick={onAdd} />{' '}
            </span>
          ) : null}
          <div style={{ height: 30, width: 10 }} />
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

          {add ? (
            <span className="add-member">
              {' '}
              <Add onClick={onAdd} />{' '}
            </span>
          ) : null}
          <span onClick={e => setAnchorEl(e.currentTarget)} style={{ fontWeight: 'bold', padding: 5 }}>
            +{length - 3}
          </span>
          <div style={{ height: 55, width: 10 }} />
          <Menu onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)} anchorEl={anchorEl}>
            {joins.map(i => (
              <MenuItem key={i._id}>
                <Tooltip className="kanban-avatar" placement="top-start" title={joins[1].name}>
                  <Avatar alt={i.name} src={i.avatar} />
                </Tooltip>
                {i.name}
              </MenuItem>
            ))}
          </Menu>
        </div>
      );
  }
}

export default Join