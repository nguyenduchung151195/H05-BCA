/**
 *
 * AdvanceSearch
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import { TextField } from 'components/LifetekUi';
import { Grid, Typography, Button, MenuItem } from '@material-ui/core';
import moment from 'moment';
import { API_TASK_PROJECT, API_TASK_CONFIG } from '../../../config/urlConfig';
import { fetchData } from 'helper';
import ListPage from 'components/List';
import { getShortNote } from '../../../utils/functions';
import { priorityArr, taskStatusArr, taskStageArr } from '../../../variable';
import CustomInputBase from '../../../components/Input/CustomInputBase';
import { serialize } from '../../../helper';
// import styled from 'styled-components';

function TaskDocs(props) {
  const { onSave, handleCloseFilter, onChangeSnackbar, getDataTask, menuAction ,profile, setDisaleSave} = props;
  const [localState, setLocalState] = useState({
    name: '',
    description: '',
    category: '',
  });
  const [filter, setFilter] = useState({});
  const [filter2, setFilter2] = useState({});

  const [filterDatas, setFilterDatas] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [urlApi, setUrlApi] = useState(`${API_TASK_PROJECT}/projects`);

  useEffect(
    () => {
      let filters = {};
      if (localState.name !== '') {
        filters.name = localState.name;
      }
      if (localState.description !== '') {
        filters.description = localState.description;
      }
      if (localState.category !== '') {
        setFilter2({ typeTask: localState.category });
      }
      setFilter(filters);
    },
    [localState],
  );
  useEffect(() => {
    fetchData(API_TASK_CONFIG).then(res => {
      const taskType = res.find(item => item.code === 'TASKTYPE').data;
      setCategorys(taskType);
    });
  }, []);

  const handleRefactor = val => {
    console.log(val, "val")
    setFilterDatas(val);
    const status = val && val.length ? false : true
    setDisaleSave && setDisaleSave(status)
  };

  const mapFunction = item => {
    const taskStt = JSON.parse(localStorage.getItem('taskStatus'));
    const taskType = taskStt && taskStt.find(item => item.code === 'TASKTYPE').data;
    const mapTypeTask = cate => {
      const data = taskType && taskType.find(i => i.type == cate);
      return data && data.name;
    };
    const statusAcceptFm = JSON.parse(localStorage.getItem('viewConfig'));
    const taskTypeFm =
      statusAcceptFm &&
      statusAcceptFm.find(item => item.code === 'Task').listDisplay.type.fields.type.columns.find(i => i.name === 'statusAccept').menuItem;
    const mapStatusAccept = cate => {
      const data = taskTypeFm && taskTypeFm.find(item => item.type == cate);
      return data && data.name;
    };
    return {
      ...item,
      typeTask: mapTypeTask(item.typeTask),
      kanbanStatus: item.taskStatus ? taskStatusArr.find((i, index) => index + 1 === item.taskStatus) : '',
      statusAccept: mapStatusAccept(item.statusAccept),
      priority: item.priority ? priorityArr.find((i, index) => index + 1 === item.priority) : '',
      abstractNote: item.abstractNote && <p style={{ textAlign: 'left', width: 250 }}>{getShortNote(item.abstractNote, 50)}</p>,
    };
  };
  useEffect(()=>{
    if(profile){
      // createdBy inCharge support
      let filterDefault = {}
      filterDefault['$or'] = [
        {createdBy: { $in: [profile._id] }},
        {inCharge: { $in: [profile._id] }},
        {support: { $in: [profile._id] }}
    ] 
    const query = serialize({ filter: filterDefault });
    setUrlApi(`${API_TASK_PROJECT}/projects?${query}`)
    }else {
      setUrlApi(`${API_TASK_PROJECT}/projects`)
    }
  }, [profile])
  return (
    <div>
      <Typography variant="h6">TÌM KIẾM HỒ SƠ CÔNG VIỆC</Typography>
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase
            onChange={e => {
              setLocalState({ ...localState, name: e.target.value });
            }}
            name="name"
            fullWidth
            inputLableProps={{
              shrink: true,
            }}
            value={localState.name}
            label="Tên công việc"
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            onChange={e => {
              setLocalState({ ...localState, category: e.target.value });
            }}
            name="category"
            fullWidth
            inputLableProps={{
              shrink: true,
            }}
            select
            value={localState.category}
            label="Loại công việc"
          >
            {categorys.map(item => (
              <MenuItem value={item.type}>{item.name}</MenuItem>
            ))}
          </CustomInputBase>
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            onChange={e => {
              setLocalState({ ...localState, description: e.target.value });
            }}
            name="description"
            fullWidth
            inputLableProps={{
              shrink: true,
            }}
            value={localState.description}
            label="Nội dung công việc"
          />
        </Grid>
      </Grid>
      <Grid container style={{ overflow: 'hidden', marginTop: -22 }}>
        <ListPage
          disableEdit
          disableAdd
          disableViewConfig
          disableDelete
          hideSearch
          onSelectCustomers={val => {
            handleRefactor(val);
            getDataTask && getDataTask(val);
          }}
          mapFunction={mapFunction}
          regexSearch
          filterData={Object.entries(filter)}
          filter={{ ...filter2 }}
          disableImport
          pointerCursor="pointer"
          code="Task"
          // apiUrl={`${API_TASK_PROJECT}/projects`}
          apiUrl={urlApi}
          height="calc(100vh - 310px)"
          parent
        />
      </Grid>
      
      {!menuAction && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -30 }}>
          <Button onClick={() => onSave(filterDatas)} color="primary" variant="contained" disabled={filterDatas && filterDatas.length === 0}>
            Lưu
          </Button>
          <Button onClick={handleCloseFilter} color="secondary" variant="contained" style={{ marginLeft: 5 }}>
            Hủy
          </Button>
        </div>
      )}
    </div>
  );
}

TaskDocs.propTypes = {
  // title: PropTypes.string,
  // handleClose: PropTypes.func,
  // open: PropTypes.bool,
  // handleSave: PropTypes.func,
  // confirmText: PropTypes.string,
  // cancelText: PropTypes.string,
};

export default compose(
  memo,
)(TaskDocs);
