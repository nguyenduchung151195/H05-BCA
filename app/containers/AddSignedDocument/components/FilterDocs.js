/**
 *
 * AdvanceSearch
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { compose } from 'redux';
import { TextField, AsyncAutocomplete } from 'components/LifetekUi';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import {
    Dialog, DialogActions, DialogTitle, DialogContent, Grid, FormControlLabel, Typography, Table,
    TableCell,
    TableHead,
    TableRow,
    TableBody, Checkbox, Button, MenuItem
} from '@material-ui/core';
import moment from 'moment'
import PropTypes from 'prop-types';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { API_INCOMMING_DOCUMENT } from '../../../config/urlConfig';
import ListPage from 'components/List';
import { getShortNote } from '../../../utils/functions';
import CustomInputBase from '../../../components/Input/CustomInputBase';
import { serialize } from '../../../helper';
// import styled from 'styled-components';

function FilterDocs(props) {
    const { onSave, toBookCode, handleCloseFilter, onChangeSnackbar, onGet, profile } = props;
    const [localState, setLocalState] = useState({
        toBook: '',
        startDate: '',
        endDate: '',
        abstractNote: '',
    })
    const [filter, setFilter] = useState({})
    const [filterDatas, setFilterDatas] = useState([])
    const [search, setSearch] = useState(false);
    const [urlApi, setUrlApi] = useState(API_INCOMMING_DOCUMENT)

    const handleSearch = () => {
        // console.log('aaa')
    }
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


    const mapFunction = (item) => {
        return {
            ...item,
            documentDate: item.documentDate ? item.documentDate : '',
            toBookDate: item.toBookDate ? moment(item.toBookDate).format('DD/MM/YYYY') : '',
            deadline: item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : '',
            receiveDate: item.receiveDate ? item.receiveDate : '',
            abstractNote: (
                <p style={{ textAlign: 'left', width: 250 }}> {item.abstractNote && getShortNote(item.abstractNote, 60)}</p>
            )
        }
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

    useEffect(() => {
        if (props && props.search) setSearch(props.search)
        else setSearch(false)
    }, [])

    
    useEffect(() => {
        // if (props && props.processType == 'outgoingDocument'){
        //     if(profile){
        //         let filterDefault ={}
        //         filterDefault['$or'] = [
        //             {processors: { $in: [profile._id] }},
        //             {processeds:{ $in: [profile._id] }},
        //             {createdBy: { $in: [profile._id] }},
        //             {commandeds: { $in: [profile._id] }},
        //             {commanders: { $in: [profile._id] }},
        //             {supporteds: { $in: [profile._id] }},
        //             {supporters: { $in: [profile._id] }}
        //         ]
        //         const query = serialize({ filter: filterDefault });
        //         setUrlApi(`${API_GOING_DOCUMENT}?${query}`)
        //     }
        //     else {
        //         setUrlApi(API_GOING_DOCUMENT)
        //     }
        // }else {
        //     if(profile){
        //         let filterDefault ={}
        //         filterDefault['$or'] = [
        //             {processors: { $in: [profile._id] }},
        //             {processeds:{ $in: [profile._id] }},
        //             {createdBy: { $in: [profile._id] }},
        //             {commandeds: { $in: [profile._id] }},
        //             {commanders: { $in: [profile._id] }},
        //             {supporteds: { $in: [profile._id] }},
        //             {supporters: { $in: [profile._id] }}
        //         ]
        //         const query = serialize({ filter: filterDefault });
        //         setUrlApi(`${API_INCOMMING_DOCUMENT}?${query}&${search === true ? "search=true" : ""}`)
        //     }
        //     else {
        //         setUrlApi(`${API_INCOMMING_DOCUMENT}?${search === true ? "search=true" : ""}`)
        //     }
        // }

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
            setUrlApi(`${API_INCOMMING_DOCUMENT}?${query}&${search === true ? "search=true" : ""}`)
        }
        else {
            setUrlApi(`${API_INCOMMING_DOCUMENT}?${search === true ? "search=true" : ""}`)
        }
            // setUrlApi(API_GOING_DOCUMENT)
    }, [profile])
    return (
        <div>
            <Typography variant='h6'>TÌM KIẾM PHÚC ĐÁP VĂN BẢN</Typography>
            <Grid container spacing={8}>

                <Grid item xs={6}>
                    <CustomDatePicker
                        inputVariant="outlined"
                        // helperText={startDate ? null : 'Không được bỏ trống'}
                        variant="outlined"
                        // error={!startDate}
                        name="startDate"
                        invalidLabel="DD/MM/YYYY"
                        invalidDateMessage={false}
                        onChange={e => handleInputChange(null, 'startDate', moment(e).format('YYYY-MM-DD'))}
                        value={localState.startDate}
                        label="Ngày bắt đầu"
                        margin="dense"
                    />
                </Grid>
                <Grid item xs={6} >
                    <CustomDatePicker
                        inputVariant="outlined"
                        // helperText={startDate ? null : 'Không được bỏ trống'}
                        variant="outlined"
                        // error={!startDate}
                        name="endDate"
                        invalidLabel="DD/MM/YYYY"
                        invalidDateMessage={false}
                        onChange={e => handleInputChange(null, 'endDate', moment(e).format('YYYY-MM-DD'))}
                        // onChange={this.changeDate('endDate')}
                        value={localState.endDate}
                        label="Ngày kết thúc"
                        margin="dense"
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
                        inputLableProps={{
                            shrink: true
                        }}
                        value={localState.abstractNote}
                        label="Trích yếu"
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
                    }}
                    regexSearch
                    filterData={Object.entries(filter)}
                    disableImport
                    pointerCursor="pointer"
                    code="IncommingDocument"
                    mapFunction={mapFunction}
                    // apiUrl={`${API_INCOMMING_DOCUMENT}?${search === true ? "search=true" : ""}`}
                    apiUrl={urlApi}
                    kanban="ST21"
                    kanbanKey="type"
                    height='calc(100vh - 380px)'
                />
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -18 }}>
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

FilterDocs.propTypes = {
    // title: PropTypes.string,
    // handleClose: PropTypes.func,
    // open: PropTypes.bool,
    // handleSave: PropTypes.func,
    // confirmText: PropTypes.string,
    // cancelText: PropTypes.string,
};

export default compose(
    memo,
)(FilterDocs);
