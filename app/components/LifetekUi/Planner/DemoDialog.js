/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect,useCallback  } from 'react';
// eslint-disable-next-line import/no-unresolved
import './kanban.css';
import { ArrowBackIos, ArrowForwardIos, Done, Close, Add, Search, Archive, Comment as InsertCommentOutlined, Assignment, Description, AttachFile, InsertDriveFile, Notifications,} from '@material-ui/icons';
// import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Snackbar from 'components/Snackbar';
import { priotyColor, serialize, tableToExcel, taskPriotyColor } from '../../../helper';
import { Button, Fab, Grid, Paper, Tooltip } from '@material-ui/core';
import { TextField,Loading } from '..';
import { clearWidthSpace } from '../../../utils/common';
import Dialog from '../Dialog';
import { createStructuredSelector } from 'reselect';
import { makeSelectProfile } from '../../../containers/Dashboard/selectors';
import { connect } from 'react-redux';
// import { Comment} from '..';
import Comment from '../Comment';
import { API_MEETING } from '../../../config/urlConfig';


function TaskDialog(props) {
    const { data, taskId, profile, filterItem } = props;
  
    const [file, setFile] = React.useState([]);
    const [state, setState] = React.useState({ name: '', description: '', priority: 1, join: [] });
    const [fileReview, setFileReview] = React.useState(false);
    const [currentFile, setCurrentFile] = React.useState({ name: '', size: 0, originFile: '', type: '', url: '', taskId: '', fileName: '' });
    const [obImg, setObImg] = React.useState('');
    const [joins, setJoins] = React.useState([]);
  
    useEffect(() => {
      const taskPromise = fetch(`${API_MEETING}/${taskId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const projectId = data.projectId ? data.projectId._id : data._id;
      const projectPromise = fetch(`${API_MEETING}/${projectId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const filePromise = fetch(`${API_MEETING}/file/${taskId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      Promise.all([taskPromise, filePromise, projectPromise]).then(respon => {
        Promise.all(respon.map(i => i.json())).then(dt => {
          setState(dt[0]);
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
      const dataResponTask = await fetch(`${API_MEETING}/file/${taskId}`, {
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
  
    return (
      <div className="task-dialog">
        <div className="task-dialog-content-section">
          <div className="task-dialog-content-row">
            <div className="task-section-header">
              <Assignment />
              <b className="task-dialog-name">{data.name}</b>
            </div>
          </div>
          {/* <div className="task-dialog-desctiption">Tech Startup Board Hot Backlog</div> */}
        </div>
  
        <div className="task-dialog-content-section">
          <div className="task-dialog-content-row">
            <div className="task-section-header">
              <Description /> Mô tả
            </div>
          </div>
  
          <p className="dialog-ct">{data.description}</p>
        </div>
        <div className="task-dialog-content-section">
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
          {/* <div className="attachment-list dialog-ct">
            {file.map(i => (
              <FileItem taskId={taskId} type={data[filterItem]} data={i} />
            ))}
          </div> */}
        </div>
        <div className="task-dialog-content-section">
          <div className="task-dialog-content-row">
            <div className="task-section-header">
              <InsertCommentOutlined />
              Thảo luận
            </div>
          </div>
  
          <Comment profile={profile} code="Task" id={taskId} />
        </div>
      </div>
    );
  }

  const mapStateToProps = createStructuredSelector({
    profile: makeSelectProfile(),
  });
  const withConnectComment = connect(mapStateToProps);

  export default withConnectComment(TaskDialog);