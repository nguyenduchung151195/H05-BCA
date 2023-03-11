import React, { useState, useCallback, memo, useEffect } from 'react';
import { Grid, FormControlLabel, Checkbox, Typography, MenuItem } from '@material-ui/core';
import { Paper, Comment } from 'components/LifetekUi';
import { createStructuredSelector } from 'reselect';

import moment from 'moment'
import { connect } from 'react-redux';
import { compose } from 'redux';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomInputField from '../../components/Input/CustomInputField';
import makeSelectDashboardPage, { makeSelectProfile } from '../Dashboard/selectors';
import { changeSnackbar } from '../Dashboard/actions';
import CustomAppBar from 'components/CustomAppBar';
import request from '../../utils/request';
import ListPage from 'components/List';
import NumberFormat from 'react-number-format';
import { Fab, Tooltip } from '@material-ui/core'

import { Archive } from '@material-ui/icons';
import {
    API_USERS,
    APP_URL,
    API_BOOK_DOCUMENT,
    API_GET_GEN_CODE,
    SYS_CONF,
    API_GET_COMMENT_BY_CODE,
} from '../../config/urlConfig';
import { fetchData, flatChild, workingCalendarTable } from '../../helper';

import { Dialog, DialogActions, DialogTitle, DialogContent, Button, TextField } from '@material-ui/core';
import { DataArray } from '@mui/icons-material';
function ViewDetailBookDocument(props) {
    const { profile, onChangeSnackbar } = props;
    const [years, setYears] = useState([]);
    const [tab, setTab] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [listTemplate, setListTemplate] = useState([]);
    const [template, setTemplate] = useState([]);
    const [listDataExport, setListDataExport] = useState([]);
    // const [unitConfig, setUnitConfig] = useState({});

    const [templateCode, setTemplateCode] = useState();


    const [openDialogIn, setOpenDialogIn] = useState(false);
    const [reloadPage, setReloadpage] = useState(new Date() * 1);

    const [disableExport, setDisableExport] = useState(true);




    const [listKanban, setListKanban] = useState([]);

    const [localState, setLocalState] = useState({
        others: {},
        receiverUnit: profile && profile.organizationUnit && profile.organizationUnit,
        receiveDate: '',
        toBookDate: '',
        typeDocument: {},
        documentDate: '',
        year: moment().format('YYYY'),
        deadline: '',
        active: false
    });
    let code = 'IncomingDocument';
    let api = '/api/incommingdocument';
    const id = props.match && props.match.params && props.match.params.id;

    const generateYear = () => {
        let count = 0;
        let years = [];
        while (count <= 5) {
            let year = moment().add(count, 'year').format('YYYY')
            let obj = {
                value: year,
                title: `Năm ${year}`
            }
            years.push(obj);
            count += 1;
        }
        setYears(years);
    }


    useEffect(() => {
        generateYear();
        fetchData(SYS_CONF).then((data) => {
            const unitConfig = {
                hostUnit: data.hostUnit,
                subordinateUnit: data.subordinateUnit
            }
            // console.log(unitConfig, 'unitConfig')
            localStorage.setItem('unitConfig', JSON.stringify(unitConfig))
        }).catch((err) => {
            console.log(err, 'errerr')
            localStorage.removeItem('unitConfig')
        })
    }, [])
    useEffect(() => {
        if (id) {
            request(`${API_BOOK_DOCUMENT}/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
            }).then(res => {
                if (res) {
                    setLocalState({ ...res })
                }
            }).catch(error => {
                onChangeSnackbar({ variant: 'success', message: error, status: false })
            })
        }
    }, [id])

    useEffect(() => {
        if (localState) {
            let { typeDocument } = localState || {};
            let { moduleCode = {} } = typeDocument || {}
            let { api, value } = moduleCode;
            if (api) {
                api = api
            }
            if (value) {
                code = moduleCode.value;
            }
        }
    }, [localState])

    useEffect(() => {
        const kanbanStt = JSON.parse(localStorage.getItem('crmStatus'));
        const kanbanSttDatas = kanbanStt && kanbanStt.find(item => item.code === 'ST21');
        const kanbanSttData = kanbanSttDatas ? kanbanSttDatas.data : [];
        setListKanban(kanbanSttData || [])
        if (props.location && props.location.state && props.location.state.tab) {
            setTab(props.location.state.tab)
            let listData = props.dashboardPage && props.dashboardPage.allTemplates || []
            listData = listData.filter(it => it.code.includes('bookDoc')) || []
            listData = listData.filter(it => it.moduleCode === props.location.state.tab)
            setListTemplate(listData)
            if (listData && listData.length) {
                setTemplate(listData[0]._id)
                setTemplateCode(listData[0].code)
                console.log(listData[0].code, 'listData[0].code')
                localStorage.setItem("templateCode", listData[0].code || "")
            }
            else
                onChangeSnackbar({ variant: 'warning', message: 'Đồng chí vui lòng cấu hình biểu mẫu động hợp lệ!', status: true });
        }
        else onChangeSnackbar({ variant: 'warning', message: 'Đồng chí vui lòng cấu hình biểu mẫu động hợp lệ!', status: true });
    }, [])
    const mapFunction = (item) => {


        const mapkanban = data => {
            if (!data) {
                return item.kanbanStatus;
            } else {
                switch (data) {
                    case 'waitting':
                        if (item.stage === 'complete') {
                            return <a style={{ color: 'rgb(62, 168, 235)' }}>Chờ ban hành</a>;
                        } else {
                            return <a style={{ color: 'rgb(62, 168, 235)' }}>Chờ ban hành một phần</a>;
                        }
                    case 'released':
                        if (item.completeStatus && item.completeStatus === 'promulgated') {
                            return <a style={{ color: 'rgba(26, 144, 50, 0.91)' }}>Đã ban hành </a>;
                        } else {
                            return <a style={{ color: 'rgba(26, 144, 50, 0.91)' }}>Đã ban hành một phần</a>;
                        }
                }
            }
        };
        const customKanbanStt = data => {
            const data1 = listKanban && listKanban.find(item => item.type === data);
            return data1 ? data1.name : 'Không xác định';
        };
        return {
            ...item,
            toBook: item.toBook && item.textSymbols ? `${item.toBook}/${item.textSymbols}` : item.toBook ? item.toBook : "",
            kanbanStatus: tab === "IncommingDocument" ? customKanbanStt(item.kanbanStatus) :

                // kanbanStatus:
                item.signingStatus === 'waitingSign' ? (
                    <a style={{ color: 'rgba(26, 144, 50, 0.91)' }}>Chờ ký nháy</a>
                ) : item.signingStatus === 'signed' ? (
                    <a style={{ color: 'rgba(26, 144, 50, 0.91)' }}>Đã ký nháy</a>
                ) : item.isReturned === true ? (
                    <a style={{ color: 'red', fontSize: 15 }}>Trả lại</a>
                ) : (
                    mapkanban(item.releasePartStatus)
                ),
            documentDate: item.documentDate && moment(item.documentDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
            receiveDate: item.receiveDate && moment(item.receiveDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
            toBookDate: moment(item.toBookDate).format('DD/MM/YYYY'),
            deadline: item.deadline && item.deadline != 'dd/mm/yyyy' ? moment(item.deadline).format('DD/MM/YYYY') : '',
        }
    }
    const handleChangeDate = (value, name) => {
        console.log(value, 'value')
        if (name === "startDate") {
            localStorage.setItem('startDate', value)
            setStartDate(value)
            return
        }
        if (name === "endDate") {
            localStorage.setItem('endDate', value)
            setEndDate(value)
            return
        }
    }
    // useEffect(() => {


    // }, [tab])
    useEffect(() => {
        localStorage.setItem('nameOfBook', localState.name)
        return () => {
            localStorage.removeItem('nameOfBook')
            localStorage.removeItem('endDate')
            localStorage.removeItem('startDate')
            // localStorage.removeItem('templateCode')


        }
    }, [localState])
    return (
        <>
            <CustomAppBar
                title={"Thông tin chi tiết sổ văn bản"}
                onGoBack={() => {
                    props.history.goBack();
                }}
                disableAdd
            />
            <Paper style={{ zIndex: '0 !important' }}>
                <Grid container spacing={8} alignItems='center' style={{ marginTop: 16 }}>
                    <Grid item xs={6} >
                        <CustomInputField
                            label={'Năm'}
                            configType="year"
                            configCode="S302"
                            type="Source|CrmSource,S302|Value||value"
                            name="year"
                            options={years}
                            value={localState.year}
                            disabled

                        />

                    </Grid>
                    <Grid item xs={6}>
                        <CustomInputField
                            label={'Loại sổ'}
                            configType="crmSource"
                            configCode="S302"
                            type="Source|CrmSource,S302|Value||value"
                            name="bookDocumentId"
                            typeDoc={localState.typeDocument && localState.typeDocument.moduleCode && localState.typeDocument.moduleCode.value}
                            value={localState.bookDocumentId}
                            disabled

                        />
                    </Grid>
                    <Grid item xs={6}>
                        <CustomInputBase
                            label={'Tên sổ'}
                            value={localState.name}
                            disabled
                            name="name"
                            // onChange={handleChangeValue}
                            autoFocus

                        />
                    </Grid>
                    <Grid item xs={6}>
                        <CustomInputBase
                            label={'Mã sổ'}
                            value={localState.toBookCode}
                            disabled
                            name="code"
                            // onChange={handleChangeValue}
                            autoFocus

                        />
                    </Grid>
                    <Grid item xs={6}>
                        <NumberFormat
                            label="Số bắt đầu"
                            value={localState.codeStart || 1}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
                            margin="normal"
                            customInput={CustomInputBase}
                            allowNegative={false}
                            decimalSeparator={null}
                        />
                    </Grid>
                    {/* <Grid item xs={12}></Grid> */}
                    <Grid item xs={1}>
                        <FormControlLabel
                            control={<Checkbox name="active" color="primary" checked={localState.active ? true : false} />}
                            label="Hoạt động"
                        />
                    </Grid>
                    <Grid container spacing={8} >
                        <Typography variant="h6" style={{ fontSize: 18, padding: '0 8px', color: 'black' }}> Danh sách văn bản</Typography>
                        <Grid item xs={12} style={{ marginTop: 5 }}>

                            {localState.typeDocument && localState.typeDocument.moduleCode && (
                                <>
                                    <Grid item md={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Fab onClick={() => setOpenDialogIn(true)} disabled={disableExport}>
                                            <Tooltip title="Tải xuống">
                                                <Archive />
                                            </Tooltip>
                                        </Fab>
                                    </Grid>
                                    {
                                        tab === "IncommingDocument" ? <ListPage
                                            // showDepartmentAndEmployeeFilter
                                            // exportExcel
                                            filter={{
                                                // typeDocument: tab,
                                                bookDocumentId: id
                                            }}
                                            filterStartEnd="documentDate"
                                            // reload={new Date()}
                                            reload={reloadPage}
                                            disableAdd
                                            disableEdit
                                            disableUpload
                                            code={localState.typeDocument.moduleCode.value}
                                            apiUrl={`${APP_URL}${localState.typeDocument.moduleCode.api}?svb=true`}
                                            className="mt-2"
                                            kanban="ST21"
                                            noKanban
                                            kanbanKey="type"
                                            customFunction={(data) => {
                                                let dataExportComment = []
                                                let dataClone = data || []
                                                dataClone = dataClone.map((el) => el._id)
                                                fetchData(API_GET_COMMENT_BY_CODE, "POST", {
                                                    ids: dataClone || [],
                                                    code: tab
                                                }).then((res) => {
                                                    console.log(res, "res")
                                                    if (res.status) {
                                                        const dataComment = res.dataReturn || []
                                                        data.map((el) => {
                                                            const commentOfDoc = dataComment.find(it => it.id === el._id)
                                                            let newComment = ""
                                                            if (commentOfDoc) {
                                                                const { comment } = commentOfDoc
                                                                const commentHasNoteTag = comment.findLast((element) => element.noteTag && element.noteTag.length);
                                                                if (commentHasNoteTag) {
                                                                    const { noteTag } = commentHasNoteTag || []
                                                                    noteTag.map((elComment, idx) => {
                                                                        if (idx == noteTag.length - 1) {
                                                                            newComment = `${newComment}${elComment.taggerName} ${elComment.note} ${elComment.nameReply}`
                                                                        }
                                                                        else {
                                                                            newComment = `${newComment}${elComment.taggerName} ${elComment.note} ${elComment.nameReply}, `

                                                                        }

                                                                    })
                                                                }
                                                            }
                                                            dataExportComment.push({
                                                                ...el,
                                                                comment: newComment
                                                            })

                                                        })
                                                        setListDataExport(dataExportComment)


                                                    }
                                                    else {
                                                        setListDataExport(data)

                                                    }
                                                    setDisableExport(false)
                                                }).catch((err) => {
                                                    console.log(err, "err")
                                                    setListDataExport(data)
                                                    setDisableExport(false)

                                                })
                                                return data
                                            }}
                                            handleChangeDate={handleChangeDate}
                                            mapFunction={mapFunction}
                                            // settingBar={[addButton()]}
                                            // onRowClick={item => {
                                            //     handleViewDetail(item._id)
                                            // }}
                                            pointerCursor="pointer"
                                        // onEdit={row => {
                                        //     // setId(row._id);
                                        //     // setOpenDialog(true);
                                        // }}
                                        /> : null
                                    }

                                    {
                                        tab === "OutGoingDocument" ? <ListPage
                                            // showDepartmentAndEmployeeFilter
                                            // exportExcel
                                            filterStartEnd="documentDate"
                                            filter={{
                                                // typeDocument: tab,
                                                bookDocumentId: id
                                            }}
                                            handleChangeDate={handleChangeDate}
                                            reload={reloadPage}
                                            disableAdd
                                            disableEdit
                                            disableUpload
                                            code={localState.typeDocument.moduleCode.value}
                                            apiUrl={`${APP_URL}${localState.typeDocument.moduleCode.api}?svb=true`}
                                            className="mt-2"
                                            kanban="ST21"
                                            noKanban
                                            kanbanKey="type"
                                            mapFunction={mapFunction}
                                            customFunction={(data) => {
                                                let dataClone = []
                                                const flattedDepartment = flatChild(props.dashboardPage && props.dashboardPage.allDepartment || []);
                                                // console.log(flattedDepartment, 'flattedDepartment')
                                                // console.log(dataClone, "dataClone", recipientIds)
                                                data.map((el) => {
                                                    let recipientIds = el && el.originItem && el.originItem && el.originItem.recipientIds || []
                                                    recipientIds = recipientIds.map((it) => it.recipientId)
                                                    let recipientIdsName = flattedDepartment.filter((item) => {
                                                        return recipientIds.includes(item._id);
                                                    }) || []

                                                    recipientIdsName = recipientIdsName.map((it) => it.title)
                                                    let name = `${recipientIdsName.join(', ')}`
                                                    if (name) {
                                                        name = el.recipientsOutSystem ? `${name}, ${el.recipientsOutSystem || ""}` : name
                                                    } else name = el.recipientsOutSystem
                                                    dataClone.push({
                                                        ...el,
                                                        recipientIds: name || "",
                                                        nameOrgBH: el.senderUnit === el.nameOrgBH ? el.senderUnit : `${el.senderUnit}, ${el.nameOrgBH}`

                                                    })
                                                })
                                                setDisableExport(false)
                                                setListDataExport(dataClone)
                                                return data
                                            }}
                                            // settingBar={[addButton()]}
                                            onRowClick={item => {
                                                handleViewDetail(item._id)
                                            }}
                                            pointerCursor="pointer"
                                        // onEdit={row => {
                                        //     // setId(row._id);
                                        //     // setOpenDialog(true);
                                        // }}
                                        /> : null
                                    }

                                </>

                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>





            <Dialog open={openDialogIn} onClose={() => setOpenDialogIn(false)} maxWidth="md" fullWidth>
                <DialogTitle id="alert-dialog-title" >
                    Xuất Biểu Mẫu
                </DialogTitle>
                <DialogContent >
                    <TextField
                        value={template}
                        fullWidth
                        select
                        onChange={e => {
                            console.log(e.target.value, 'e.target.value')
                            const temp = listTemplate.find(it => it._id === e.target.value)
                            setTemplate(e.target.value)
                            localStorage.setItem("templateCode", temp && temp.code || "")
                            setTemplateCode(temp && temp.code || "")
                        }}
                        label="Biểu mẫu"
                        autoFocus
                    >
                        {listTemplate &&
                            listTemplate.map(item => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.title}
                                </MenuItem>
                            ))}
                    </TextField>


                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={async () => {
                            console.log(listDataExport, 'listDataExport')
                            await workingCalendarTable(template, listDataExport, tab, false);
                            setOpenDialogIn(false)
                            setReloadpage(new Date() * 1)
                        }}
                        variant="contained"
                        color="primary"
                        disabled={!listTemplate.length}
                    >
                        Thực hiện
                    </Button>
                    <Button variant="contained" color="secondary" autoFocus onClick={() => setOpenDialogIn(false)}>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
const mapStateToProps = createStructuredSelector({
    profile: makeSelectProfile(),
    dashboardPage: makeSelectDashboardPage(),

});
function mapDispatchToProps(dispatch) {
    return {
        // mergeData: data => dispatch(mergeData(data)),
        // onAddExecutiveDocument: (query, cb) => {
        //     dispatch(addExecutiveDocument(query, cb));
        // },
        // onDeleteExecutiveDocument: ids => {
        //     dispatch(deleteExecutiveDocument(ids));
        // },
        // onUpdateExecutiveDocument: (data, cb) => {
        //     dispatch(updateExecutiveDocument(data, cb));
        // },
        onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
    };
}

// const withReducer = injectReducer({ key: 'viewDetailBookDocument', reducer });
// const withSaga = injectSaga({ key: 'viewDetailBookDocument', saga });

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    // withReducer,
    // withSaga,
    memo,
    withConnect,
)(ViewDetailBookDocument);

// export default ViewDetailBookDocument;

