/**
 *
 * AdvanceSearch
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import { TextField } from 'components/LifetekUi';
import { Grid, Typography, Button, MenuItem } from '@material-ui/core';
import moment from 'moment'
import { API_TASK_PROJECT, API_TASK_CONFIG } from '../../../config/urlConfig';
import { fetchData } from 'helper';
import ListPage from 'components/List';
import CustomInputBase from '../../../components/Input/CustomInputBase';
import { getShortNote } from '../../../utils/functions';
// import styled from 'styled-components';

function TaskDocs(props) {
    const { onSave, handleCloseFilter } = props;
    const [localState, setLocalState] = useState({
        name: '',
        description: '',
        category: '',
    })
    const [filter, setFilter] = useState({})
    const [filterDatas, setFilterDatas] = useState([])
    const [categorys, setCategorys] = useState([])
    useEffect(() => {
        let filters = {}
        if (localState.name !== '') {
            filters.name = localState.name
        }
        if (localState.description !== '') {
            filters.description = localState.description
        }
        if (localState.category !== '') {
            filters.category = localState.category
        }
        setFilter(filters)
    }, [localState])
    useEffect(() => {
        fetchData(API_TASK_CONFIG).then(res => {
            const taskType = res.find(item => item.code === 'TASKTYPE').data
            setCategorys(taskType)
        });
    }, [])

    const handleRefactor = val => {
        setFilterDatas(val)
    }

    const mapFunction = item => {
        const taskStt = JSON.parse(localStorage.getItem('taskStatus'))
        const taskType = taskStt && taskStt.find(item => item.code === 'TASKTYPE').data
        const mapTypeTask = (cate) => {
            const data = taskType && taskType.find(i => i.type == cate)
            return data && data.name
        }
        const statusAcceptFm = JSON.parse(localStorage.getItem('viewConfig'))
        const taskTypeFm = statusAcceptFm && statusAcceptFm.find(item => item.code === 'Task').listDisplay.type.fields.type.columns.find(i => i.name === 'statusAccept').menuItem
        const mapStatusAccept = (cate) => {
            const data = taskTypeFm && taskTypeFm.find(item => item.type == cate)
            return data && data.name
        }
        return {
            ...item,
            typeTask: mapTypeTask(item.typeTask),
            priority:
                item.priority === 1
                    ? 'Rất cao'
                    : item.priority === 2
                        ? 'Cao'
                        : item.priority === 3
                            ? 'Trung bình'
                            : item.priority === 4
                                ? 'Thấp'
                                : 'Rất thấp',
            statusAccept: mapStatusAccept(item.statusAccept),
            abstractNote: item.abstractNote && (
                <p style={{ textAlign: 'left', width: 250 }}>
                    {getShortNote(item.abstractNote, 50)}
                </p>
            )
        }
    }

    return (
        <div>
            <Typography variant='h6'>TÌM KIẾM CÔNG VIỆC LIÊN QUAN</Typography>
            <Grid container spacing={8}>
                <Grid item xs={4}>
                    <CustomInputBase
                        onChange={(e) => {
                            setLocalState({ ...localState, name: e.target.value })
                        }}
                        name="name"
                        fullWidth
                        inputLableProps={{
                            shrink: true
                        }}
                        value={localState.name}
                        label="Tên công việc"
                    />
                </Grid>
                <Grid item xs={4}>
                    <CustomInputBase
                        onChange={(e) => {
                            //console.log(e, 'llll')
                            setLocalState({ ...localState, category: e.target.value })
                        }}
                        name="category"
                        fullWidth
                        inputLableProps={{
                            shrink: true
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
                        onChange={(e) => {
                            setLocalState({ ...localState, description: e.target.value })
                        }}
                        name="description"
                        fullWidth
                        inputLableProps={{
                            shrink: true
                        }}
                        value={localState.description}
                        label="Nội dung công việc"
                    />
                </Grid>
            </Grid>
            <Grid container style={{ overflow: 'hidden' }}>
                <ListPage
                    disableEdit
                    disableAdd
                    disableViewConfig
                    disableDelete
                    hideSearch
                    onSelectCustomers={val => {
                        handleRefactor(val);
                    }}
                    regexSearch
                    filterData={Object.entries(filter)}
                    disableImport
                    pointerCursor="pointer"
                    code="Task"
                    apiUrl={`${API_TASK_PROJECT}/projects`}
                    height='calc(100vh - 330px)'
                    parent
                    mapFunction={mapFunction}
                />
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -30 }}>
                <Button onClick={() => onSave(filterDatas)} color="primary" variant="contained" disabled={filterDatas && filterDatas.length === 0}>
                    Lưu
                </Button>
                <Button onClick={handleCloseFilter} color="secondary" variant="contained" style={{ marginLeft: 5 }}>
                    Hủy
                </Button>
            </div>

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
