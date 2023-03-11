/**
 *
 * AdvanceSearch
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import { TextField } from 'components/LifetekUi';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import { Grid, Typography, Button } from '@material-ui/core';
import moment from 'moment'
import { API_INCOMMING_DOCUMENT, API_GOING_DOCUMENT } from 'config/urlConfig';
import ListPage from 'components/List';
import CustomInputBase from 'components/Input/CustomInputBase';
import { serialize } from '../../../helper';

function FilterDocs(props) {
    const { onSave, handleCloseFilter, onChangeSnackbar , profile} = props;
    const [localState, setLocalState] = useState({
        toBook: '',
        startDate: '',
        endDate: '',
        abstractNote: '',
    })
    const [filter, setFilter] = useState({})
    const [filterDatas, setFilterDatas] = useState([])
    const [urlApi, setUrlApi] = useState(API_INCOMMING_DOCUMENT)



    useEffect(() => {
        let filters = {}
        if (localState.toBook !== '') {
            filters.toBook = localState.toBook
        }

        if (localState.startDate !== '') {
            filters.startDate = localState.startDate
        }
        if (localState.endDate !== '') {
            filters.endDate = localState.endDate
        }
        if (localState.abstractNote !== '') {
            filters.abstractNote = localState.abstractNote
        }
       
        setFilter(filters)
    }, [localState])




    const handleRefactor = val => {
        setFilterDatas(val)
    }
    const handleInputChange =
        (e, _name, _value) => {
            const name = e && e.target ? e.target.name : _name;
            const value = e && e.target ? e.target.value : _value;
            const newFilter = { ...localState, [name]: value };
            if (newFilter.startDate && newFilter.endDate && new Date(newFilter.endDate) <= new Date(newFilter.startDate)) {
                return onChangeSnackbar({ variant: 'error', message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu', status: true });
            }
            setLocalState(newFilter);
            setLocalState({ ...localState, [name]: value });
            //   setLocalState(pre => ({ ...pre, [name]: value }));

        };

    const mapFunction = item => {
        return {
            ...item,
            documentDate: item.documentDate,
            abstractNote: item.abstractNote ? item.abstractNote.slice(0, 200) : "",
            deadline: item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : '',
            toBookCode: item.toBookCode,
            toBookDate: item.toBookDate ? moment(item.toBookDate).format('DD/MM/YYYY') : '',
            receiveDate: item.receiveDate,
        }
    }
    useEffect(() => {
        console.log("addproject")
        if (props && props.processType == 'outgoingDocument'){
            if(profile){
                let filterDefault ={}
                filterDefault['$or'] = [
                    {processors: { $in: [profile._id] }},
                    {processeds:{ $in: [profile._id] }},
                    {createdBy: { $in: [profile._id] }},
                    {commandeds: { $in: [profile._id] }},
                    {commanders: { $in: [profile._id] }},
                    {supporteds: { $in: [profile._id] }},
                    {supporters: { $in: [profile._id] }}
                ]
                const query = serialize({ filter: filterDefault });
                setUrlApi(`${API_GOING_DOCUMENT}?${query}`)
            }
            else {
                setUrlApi(API_GOING_DOCUMENT)
            }
        }else {
            if(profile){
                let filterDefault ={}
                filterDefault['$or'] = [
                    {processors: { $in: [profile._id] }},
                    {processeds:{ $in: [profile._id] }},
                    {createdBy: { $in: [profile._id] }},
                    {commandeds: { $in: [profile._id] }},
                    {commanders: { $in: [profile._id] }},
                    {supporteds: { $in: [profile._id] }},
                    {supporters: { $in: [profile._id] }}
                ]
                const query = serialize({ filter: filterDefault });
                setUrlApi(`${API_INCOMMING_DOCUMENT}?${query}`)
            }
            else {
                setUrlApi(API_INCOMMING_DOCUMENT)
            }
        }
        
            
    }, [profile])
    return (
        <div>
            <Typography variant='h6'>TÌM KIẾM VĂN BẢN ĐÍNH KÈM</Typography>
            <Grid container spacing={8} style={{ marginTop: -8 }}>
                <Grid item xs={6} >
                    <CustomDatePicker
                        inputVariant="outlined"
                        variant="outlined"
                        name="startDate"
                        invalidLabel="DD/MM/YYYY"
                        invalidDateMessage={false}
                        onChange={e => handleInputChange(null, 'startDate', moment(e).format('YYYY-MM-DD'))}
                        value={localState.startDate}
                        label="Ngày bắt đầu"
                        margin="dense"
                        className={'CustomIconRequired'}
                        required={false}
                    />
                </Grid>
                <Grid item xs={6} >
                    <CustomDatePicker
                        inputVariant="outlined"
                        variant="outlined"
                        name="endDate"
                        invalidLabel="DD/MM/YYYY"
                        invalidDateMessage={false}
                        onChange={e => handleInputChange(null, 'endDate', moment(e).format('YYYY-MM-DD'))}
                        value={localState.endDate}
                        label="Ngày kết thúc"
                        margin="dense"
                        className={'CustomIconRequired'}
                        required={false}
                    />
                </Grid>
                <Grid item xs={6} style={{ marginTop: -7 }}>
                    <CustomInputBase
                        onChange={(e) => {
                            setLocalState({ ...localState, toBook: e.target.value })
                        }}
                        name="toBook"
                        fullWidth
                        inputLableProps={{
                            shrink: true
                        }}
                        value={localState.toBook}
                        label="Số văn bản"
                    />
                </Grid>
                <Grid item xs={6} style={{ marginTop: -7 }}>
                    <CustomInputBase
                        onChange={(e) => {
                            setLocalState({ ...localState, abstractNote: e.target.value })
                        }}
                        name="abstractNote"
                        fullWidth
                        margin="normal"
                        inputLableProps={{
                            shrink: true
                        }}
                        value={localState.abstractNote}
                        label="Trích yếu"
                    />
                </Grid>
            </Grid>
            <Grid container style={{ overflow: 'hidden', marginTop: -22 }} >
                <Grid md={12}>
                    {/* {console.log('filter',filter)} */}
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
                        code="IncommingDocument"
                        apiUrl={urlApi}
                        kanban="ST21"
                        kanbanKey="type"
                        height='calc(100vh - 365px)'
                        mapFunction={mapFunction}
                    />

                </Grid>

            </Grid>


            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -30 }}>
                <Button onClick={() => onSave(filterDatas, props.processType)} color="primary" variant="contained" disabled={filterDatas && filterDatas.length === 0} >
                    Lưu
                </Button>
                <Button onClick={handleCloseFilter} color="secondary" variant="contained" style={{ marginLeft: 5 }}>
                    Hủy
                </Button>
            </div>


        </div>
    );
}

export default compose(
    memo,
)(FilterDocs);
