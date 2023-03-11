/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { TextField, AsyncAutocomplete, SwipeableDrawer } from 'components/LifetekUi';
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import AddProjects from 'containers/AddProjects';
import { Button, MenuItem, Checkbox, Typography } from '@material-ui/core';
import { Close, NearMeSharp } from '@material-ui/icons';
import { API_USERS, API_TASK_PROJECT, UPLOAD_IMG_SINGLE } from '../../config/urlConfig';
// import { getDatetimeLocal } from '../../helper';
import { priorityArr } from '../../variable';
import { fetchData, serialize, sortTask } from '../../helper';

export default function MakeCreateTaskRequest(props) {
  const [body, setBody] = useState({
    startDate: new Date(),
    endDate,
    join: [],
    name: '',
    description: '',
    priority: 3,
    file: null,
    parentId: props.code === 'Task' ? props.id : null,
    errorName: true,
  });
  const [taskRequestDetail, setTaskRequestDetail] = useState({});
  const [sourceTask, setSourceTask] = useState({});
  const [parentTask, setParentTask] = useState({});
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [projectTree, setProjectTree] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState({});

  const onSave = async () => {
    const { startDate, endDate, name, join, description, priority, parentId } = body;
    // console.log(body);
    if (!name || !join.length) return;

    const data = {
      priority,
      source: props.code,
      requestTo: join.map(i => i._id),
      name,
      reason: description,
      taskId: parentId,
      selectedTaskId,
    };
    try {
      const allData = [fetchData(`${API_TASK_PROJECT}/task-request`, 'POST', data)];
      if (body.file) allData.push(fileUpload());

      Promise.all(allData).then(result => {
        if (body.file) {
          fetchData(`${API_TASK_PROJECT}/file/${result[0].data._id}`, 'POST', {
            name: 'Tai lieu giao viec ',
            fileName: body.file.name,
            size: 124264,
            originFile: body.file.type,
            type: body.file.type.includes('image') ? 'image' : 'doc',
            taskId: result[0].data._id,
            description: '',
            url: result[1].url,
          });
        }
      });

      props.callbackAssign({ variant: 'success', message: 'Tạo đề xuất công việc thành công', open: true });
    } catch (error) {
      // console.log('ERRRR', error);
      props.callbackAssign({ variant: 'error', message: error.message, open: true });
    }
  };

  useEffect(
    () => {
      if (props.taskRequestId) {
        fetchData(`${API_TASK_PROJECT}/task-request?taskRequestId=${props.taskRequestId}`, 'GET').then(data => {
          setTaskRequestDetail(data);
          if (data) {
            const newBody = { ...body, name: data.name, description: data.reason };
            setBody(newBody);
            if (data.taskId) {
              setSourceTask(data.taskId);
            }
            if (data.selectedTaskId) {
              setParentTask(data.selectedTaskId);
            }
          }
        });
      }
    },
    [props.taskRequestId],
  );

  useEffect(
    () => {
      if (props.itemCurrent && props.itemCurrent.projectId) {
        const filter = serialize({ filter: { projectId: props.itemCurrent.projectId, status: 1 } });
        fetchData(`${API_TASK_PROJECT}?${filter}`, 'GET').then(projects => {
          const newProject = sortTask(projects.data, [], props.itemCurrent.projectId, true);
          setProjectTree(newProject);
        });
      }
    },
    [props.itemCurrent],
  );

  const onAcceptTaskRequest = () => {
    setOpenCreateTask(true);
  };
  const handleChange = e => {
    setBody({ ...body, [e.target.name]: e.target.value });
  };

  const handleChangeName = e => {
    const rex = /^[a-zA-Z0-9_-]+.{4,}$/g;
    const errorName = !rex.test(e.target.value);
    setBody({ ...body, [e.target.name]: e.target.value, errorName });
  };

  const changeJoin = value => {
    setBody({ ...body, join: value });
  };

  const { startDate, endDate, name, join, description, priority, parentId } = body;
  const onChangeFile = e => {
    // console.log(e.target.files[0]);

    setBody({ ...body, file: e.target.files[0] });
  };

  const fileUpload = async () => {
    const formData = new FormData();
    formData.append('file', body.file);

    const file = await fetch(UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    const fileData = await file.json();
    return fileData;
  };
  console.log('body', body);
  return (
    <div>
      <Typography variant="h6" gutterBottom >
        Đề xuất công việc
      </Typography>
      <TextField
        error={!body.name || body.name.trim().length < 5}
        value={name}
        helperText={(!body.name || body.name.trim().length < 5) ? 'Tên ít nhất 5 ký tự và không có khoảng trắng đầu tiên' : null}
        onChange={handleChangeName}
        name="name"
        fullWidth
        label="Tên công việc"
      />
      {projectTree && projectTree.length ? (
        <TextField select fullWidth label="Thuộc công việc" name="idSelect" value={selectedTaskId} onChange={e => {
          setSelectedTaskId(e.target.value)
          let newJoin = [];
          const taskItem = projectTree.find(i => i._id === e.target.value);
          if (taskItem) {
            newJoin = taskItem.inCharge;
          }
          // changeJoin(newJoin)
          setBody({ ...body, join: newJoin });
        }}>
          {projectTree.map(item => (
            <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
      ) : null}
      <TextField fullWidth select name="priority" value={priority} onChange={handleChange} label="Độ ưu tiên">
        {priorityArr.map((it, idx) => (
          <MenuItem value={idx + 1}>{it}</MenuItem>
        ))}
      </TextField>

      {props.id ? (
        <>
          <AsyncAutocomplete
            error={join && join.length ? null : true}
            helperText={join && join.length ? null : 'Phải chọn người được giao'}
            value={join}
            isMulti
            onChange={changeJoin}
            label="Người được giao"
            url={API_USERS}
          />
          <TextField fullWidth value={description} name="description" onChange={handleChange} label="Mô tả" />
          <div>
            <input onChange={onChangeFile} style={{ display: 'none' }} id="upload-file-task" type="file" />
            <label htmlFor="upload-file-task">
              <Button color="primary" variant="contained" component="span">
                Tệp đính kèm
              </Button>
            </label>
            {body.file ? (
              <p>
                {body.file.name}
                <Close onClick={() => setBody({ ...body, file: null })} />
              </p>
            ) : null}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onSave} color="primary" variant="contained">
              Lưu
            </Button>
          </div>
        </>
      ) : (
        <>
          <TextField fullWidth value={description} name="description" onChange={handleChange} label="Mô tả" />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onAcceptTaskRequest} color="primary" variant="contained">
              Tạo công việc
            </Button>
          </div>
        </>
      )}
      <SwipeableDrawer anchor="right" onClose={() => setOpenCreateTask(false)} open={openCreateTask}>
        <AddProjects
          id="add"
          isCreateTask
          data={{
            source: 'Task',
            sourceData: {
              model: 'Task',
              objectId: sourceTask._id,
              objectName: sourceTask.name,
            },
            taskType: 1,
            customer: null,
            join: [],
            inCharge: [],
            approved: [],
            support: [],
            viewable: [],
            isProject: false,
            parentId: parentTask._id,
            minDate: null,
            maxDate: null,
            startDate: null,
          }}
          callback={() => {
            props.callbackAssign({ variant: 'success', message: 'Tạo công việc thành công', open: true });
            setOpenCreateTask(false);
          }}
        />
      </SwipeableDrawer>
    </div>
  );
}
