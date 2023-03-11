import React, { useEffect } from 'react';
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
import Comment from '../Comment';
// import AutoComplete from '../LtAutocomplete';
import { UPLOAD_IMG_SINGLE, API_USERS, API_ORIGANIZATION, API_SAMPLE_PROCESS, API_LOG } from '../../../config/urlConfig';
import DepartmentAndEmployee from '../../Filter/DepartmentAndEmployee';
import Join from './Join';
import { formatNumber, delSpace } from 'utils/common';
import lodash from 'lodash';
import CommentBO from './CommentBO'
import request from 'utils/request';
import moment from 'moment';

const TaskDialog = props => {
  const { data, taskId, profile, filterItem, API, customContent } = props;

  const [file, setFile] = React.useState([]);
  const [state, setState] = React.useState({ name: '', description: '', priority: 1, join: [] });
  const [fileReview, setFileReview] = React.useState(false);
  const [currentFile, setCurrentFile] = React.useState({ name: '', size: 0, originFile: '', type: '', url: '', taskId: '', fileName: '' });
  const [obImg, setObImg] = React.useState('');
  const [joins, setJoins] = React.useState([]);

  useEffect(() => {
    const taskPromise = fetch(`${API}/${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const projectId = data.projectId ? data.projectId._id : data._id;
    const projectPromise = fetch(`${API}/${projectId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const filePromise = fetch(`${API}/file/${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    Promise.all([taskPromise, filePromise, projectPromise]).then(respon => {
      Promise.all(respon.map(i => i.json())).then(dt => {
        setState({ ...state, ...dt[0] });
        setFile(dt[1]);
        setJoins(dt[2].join);
      });
    });
  }, []);

  function changeFile(e) {
    const uploadData = e.target.files[0];
    const type = uploadData.type.includes('image') ? 'image' : 'doc';

    setCurrentFile({ fileName: uploadData.name, size: uploadData.size, originFile: uploadData.type, type, taskId, data: uploadData });
    if (type === 'image') {
      const preview = URL.createObjectURL(uploadData);
      setObImg(preview);
    }

    setFileReview(true);
  }

  // Lưu ảnh upload
  async function saveFileUpload() {
    const formData = new FormData();
    formData.append('file', currentFile.data);

    const respon = await fetch(UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    const dataRespon = await respon.json();
    const dataUpload = { ...currentFile, url: dataRespon.url, data: undefined };
    const dataResponTask = await fetch(`${API}/file/${taskId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataUpload),
    });
    const result = await dataResponTask.json();
    const newFile = file.concat(result);
    setFile(newFile);
    setFileReview(false);
  }

  const handleCreateLog = (payload) => {
    const content = payload.content
    const objectId = taskId;
    const employee = {
      employeeId: profile._id,
      name: profile.name,
    };
    if (content) {
      const addLogData = { content, objectId, type: 'message', employee }
      try {
        request(API_LOG, {
          method: 'POST',
          body: JSON.stringify(delSpace(addLogData)),
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json',
          },
        })
      } catch (err) { }
    }
  };

  return (
    <div className="task-dialog">
      <div className="task-dialog-content-section">
        <div className="task-dialog-content-row">
          <div className="task-section-header">
            <Assignment />
            <b className="task-dialog-name">{state.name}</b>
          </div>
        </div>
        {/* <div className="task-dialog-desctiption">Tech Startup Board Hot Backlog</div> */}
        {/* <div className="task-dialog-user-label dialog-ct">
          <ListJoin joins={joins} join={state.join} />
          <div>
            <p>ƯU TIÊN</p>
            <span style={{ background: taskPriotyColor[state.priority - 1].color }} className="task-dialog-priority">
              {taskPriotyColor[state.priority - 1].name}
            </span>
          </div>
        </div> */}
      </div>

      <div className="task-dialog-content-section">
        <div className="task-dialog-content-row">
          <div className="task-section-header">
            <Description /> Mô tả
          </div>
        </div>

        {/* <p className="dialog-ct">{data.description}</p> */}

        {Array.isArray(customContent) &&
          customContent.map(item => {
            const obj = lodash.get(data, `${item.fieldName}`); //data[item.fieldName];
            return obj ? (
              <p style={{ textAlign: 'left' }}>
                {item.title}:{' '}
                {obj
                  ? item.type === 'number'
                    ? formatNumber(obj)
                    : item.type === 'date'
                      ? moment(props.obj).format('DD/MM/YYYY')
                      : item.type === 'array'
                        ? obj.join()
                        : obj
                  : ''}
              </p>
            ) : (
              ''
            );
          })}
      </div>
      {/* <div className="task-dialog-content-section">
        <div className="task-dialog-content-row">
          <div className="task-section-header">
            <AttachFile /> Đính kèm
          </div>
          <div>
            <input onChange={changeFile} style={{ display: 'none' }} id="upload-file-task" type="file" />
            <label htmlFor="upload-file-task">
              <Button component="span" outlined color="primary">
                <Add /> Thêm Tệp đính kèm
              </Button>
            </label>
          </div>
        </div>
        <Dialog maxWidth="sm" onClose={() => setFileReview(false)} onSave={saveFileUpload} open={fileReview}>
          <div className="dialog-upload">
            <div className="dialog-upload-image">
              {currentFile.type === 'image' ? (
                <img alt="fd" style={{ width: '100%' }} src={obImg} />
              ) : (
                <InsertDriveFile style={{ fontSize: '3rem' }} />
              )}
            </div>
            <div className="dialog-upload-detail">
              <p>Thông tin file</p>
              <p>Tên file: {currentFile.fileName}</p>
              <p>
                Dung lượng :{currentFile.size}
                KB
              </p>
              <p>Loại file :{currentFile.type === 'image' ? 'Ảnh' : 'Tài liệu'}</p>
            </div>
          </div>
        </Dialog>
        <div className="attachment-list dialog-ct">
          {Array.isArray(file) && file.map(i => <FileItem setCoverTask={props.setCoverTask} taskId={taskId} type={data[filterItem]} data={i} />)}
        </div>
      </div> */}
      <div className="task-dialog-content-section">
        <div className="task-dialog-content-row">
          <div className="task-section-header">
            <InsertCommentOutlined />
            Thảo luận
          </div>
        </div>

        <Comment profile={profile} code="BusinessOpportunities" id={taskId} handleCreateLog={handleCreateLog} />
        {/* <CommentBO id={taskId} profile={profile} /> */}
      </div>
    </div>
  );
};

const ListJoin = React.memo(props => {
  const [anchorEl, setAnchorEl] = React.useState(false);
  const { joins } = props;
  return (
    <div className="task-dialog-user">
      <p>NGƯỜI THAM GIA</p>
      <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
        <Join add onAdd={e => setAnchorEl(e.currentTarget)} joins={props.join} />
      </span>
      <div className="task-dialog-user" />
      <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)}>
        {Array.isArray(joins) &&
          joins.map(i => (
            <MenuItem>
              <Checkbox color="primary" /> <Avatar style={{ width: 25, height: 25, margin: 5 }} src={`${i.avatar}?allowDefault=true`} /> {i.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
});

function FileItem({ data, taskId, type, setCoverTask }) {
  const [anchorEl, setAnchorEl] = React.useState(false);
  const [dialog, setDialog] = React.useState(false);

  function setCover() {
    // console.log('GGG');

    fetch(`${API}/${taskId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatar: data.url }),
    }).then(() => {
      setAnchorEl(null);
      setCoverTask(taskId, type, data.url);
    });
    // .catch(e => console.log(e));
  }

  return (
    <div className="attachment-item">
      <div className="attachmnet-item-picture">
        <Tooltip title={`Ngày tạo: ${new Date(data.createdAt).toLocaleString('vi')}`}>
          {data.type === 'image' ? (
            <img alt=" " onClick={() => setDialog(true)} src={data.url} />
          ) : (
            <InsertDriveFile style={{ fontSize: '2.5rem' }} />
          )}
        </Tooltip>
      </div>
      <div className="attachment-file-name">
        <span> {data.fileName}</span>
        <span>
          <Star style={{ fontSize: '1rem' }} /> {data.size} KB
        </span>
      </div>
      <MoreVert style={{ cursor: 'pointer' }} onClick={e => setAnchorEl(e.currentTarget)} />
      <Menu open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <MenuItem onClick={() => alert('Đồng chí không có quyền xóa file này')}>
          <Delete /> Xóa
        </MenuItem>
        {data.type === 'image' ? (
          <MenuItem onClick={setCover}>
            <Image /> Đặt ảnh bìa
          </MenuItem>
        ) : null}
      </Menu>
      <Dialog dialogAction={false} onClose={() => setDialog(false)} maxWidth="lg" open={dialog}>
        <img alt="ds" className="image-preview" src={data.url} />
      </Dialog>
    </div>
  );
}

export default TaskDialog;
