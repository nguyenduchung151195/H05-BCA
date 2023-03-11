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
import { API_INCOMMING_DOCUMENT, API_GOING_DOCUMENT, API_GOING_DOCUMENT_REPORT } from '../../../config/urlConfig';
import ListPage from 'components/List/ListPrint';
import { getShortNote } from '../../../utils/functions';
import CustomInputBase from '../../../components/Input/CustomInputBase';

// import styled from 'styled-components';
import { Radio, Tooltip } from '@material-ui/core';

function FilterDocs(props) {
    const { onSave, toBookCode, handleCloseFilter, onChangeSnackbar, onGet, filterDocs } = props;
    const [localState, setLocalState] = useState({
        releaseNo: '',
      
    })
    const [filter, setFilter] = useState({})
    const [filterDatas, setFilterDatas] = useState([])
    const [search, setSearch] = useState(false);


    useEffect(() => {
        let filters = {}
        if (localState.releaseNo !== '') {
            filters.releaseNo = localState.releaseNo
        }
     
        setFilter(filters)
    }, [localState])

    const handleRefactor = val => {
        setFilterDatas(val)
    }


    const mapFunction = (item) => {
        let files = ""
        const { originItem } = item
        let lengthFiles = 0
        if (originItem && originItem.files && Array.isArray(originItem.files) && originItem.files.length > 0) {
            lengthFiles = originItem.files.length
            originItem.files.map((el, index) => {
                if (index < originItem.files.length)
                    files = files + el.name.slice(0, 25) + "..., "
                else files = files + el.name.slice(0, 25) + "... "
            });
        }
        files = files ? files : item.files || ""

        return {
            ...item,
            deadline: item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : '',
            documentDate: item.documentDate ? item.documentDate : '',
            toBookDate: item.toBookDate ? moment(item.toBookDate).format('DD/MM/YYYY') : '',
            receiveDate: item.receiveDate ? item.receiveDate : '',
            abstractNote: (
                <p style={{ textAlign: 'left', width: 250 }}> {item.abstractNote && getShortNote(item.abstractNote, 60)}</p>
            ),
            files:
                files.length < 150 ? (files) : (
                    <>
                        <Tooltip title={`Hiện có: ${lengthFiles} file đính kèm`} >
                            <p>{files.slice(0, 150)}</p>
                        </Tooltip>
                    </>
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
    return (
        <div>
            <Typography variant='h6'>Danh sách văn bản đi</Typography>
            <Grid container spacing={8} >
                <Grid item xs={6} >
                    <CustomInputBase
                        onChange={(e) => {
                            setLocalState({ ...localState, releaseNo: e.target.value })
                        }}
                        name="releaseNo"
                        fullWidth
                        inputLableProps={{
                            shrink: true
                        }}
                        value={localState.releaseNo}
                        label="Số văn bản đi"
                        style={{ zIndex: 99999 }}
                    />
                </Grid>
            </Grid>
            <Grid style={{ position: "relative", marginTop: -47 }}>
                <ListPage
                    disableEdit
                    disableAdd
                    disableViewConfig
                    disableDelete
                    hideSearch
                    disableSelect
                    exportExcel
                    regexSearch
                    filterData={Object.entries(filter)}
                    disableImport
                    pointerCursor="pointer"
                    code="OutGoingDocument"
                    onRowClick={(data)=>{
                        // props.onRowClick && props.onRowClick(data)
                        console.log(data, "dataa out")
                    }}
                    mapFunction={mapFunction}
                    apiUrl={`${API_GOING_DOCUMENT_REPORT}`}
                    kanban="ST21"
                    kanbanKey="type"
                    filter={{ queryStr: JSON.stringify(filterDocs) }}
                    height='calc(100vh - 350px)'
                    notChangeApi
                />
                {
                    console.log(filterDocs, 'filterDocs')
                }
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {/* <Button onClick={() => onSave(filterDatas)} color="primary" variant="contained" disabled={filterDatas && filterDatas.length === 0}>
                    Lưu
                </Button> */}
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
