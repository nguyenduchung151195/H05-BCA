// EditTaskPage

import { Grid, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import { mergeData } from './actions';
import makeSelectEditTaskPage from './selectors';
import reducer from './reducer';
import { FileUpload, AsyncAutocomplete, SwipeableDrawer } from '../../components/LifetekUi';
import CustomAppBar from 'components/CustomAppBar';
import { Check } from '@material-ui/icons';
import { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import { Paper as PaperUI } from 'components/LifetekUi';
import { API_MEETING, API_USERS } from '../../config/urlConfig';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { viewConfigName2Title } from '../../utils/common';
import moment from 'moment';
import { DateTimePicker } from 'material-ui-pickers';
import EditExecutiveDocuments from '../EditExecutiveDocuments';
import EditProjects from '../EditProjects';



function KanbanStep(props) {
    const { kanbanStatus } = props;

    // eslint-disable-next-line eqeqeq
    const idx = props.currentStatus.findIndex(i => i.type == kanbanStatus);

    return (
        <Stepper style={{ background: 'transparent' }} activeStep={idx}>
            {props.currentStatus.map(item => (
                <Step onClick={() => props.handleStepper(item)} key={item.type}>
                    <StepLabel style={{ cursor: 'pointer' }}>{item.name}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}

function EditTaskPage(props) {
    const { profile, code = 'MeetingCalendar', editTaskPage, miniActive } = props;

    const listCrmStatus = JSON.parse(localStorage.getItem('taskStatus'));
    const currentStatus = listCrmStatus.find(i => i.code === 'KANBAN').data.sort((a, b) => a.code - b.code);


    const id = props.id ? props.id : props.match.params.id;
    const [selectedDocs, setSelectedDocs] = useState([id]);
    const [docDetail, setDocDetail] = useState(null);
    const [openDialog, setOpenDialog] = useState(null);
    const [viewType, setViewType] = useState('any');
    const [localState, setLocalState] = useState({
        others: {},
        timeStart: "",
        timeEnd: "",

    });
    const [currentRole, setCurrentRole] = useState(null);
    const [nextRole, setNextRole] = useState(null);
    const requestURL = API_MEETING;
    const [openAsignProcessor, setOpenAsignProcessor] = useState(false);
    const [openSetCommanders, setOpenSetCommanders] = useState(false);
    const [openReturnDocs, setOpenReturnDocs] = useState(false);
    const [openComplete, setOpenComplete] = useState(false);
    const [name2Title, setName2Title] = useState({});
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openEditprojects, setOpenEditprojects] = useState(false);
    const [idEdit, setIdEdit] = useState('');

    useEffect(
        () => {
            if (id) {
                getDetail(id);
            }
        },
        [id],
    );

    useEffect(() => {
        const newNam2Title = viewConfigName2Title(code);
        setName2Title(newNam2Title);

        return () => {
            newNam2Title;
        };
    }, []);

    useEffect(
        () => {
            if (id && id !== 'add')
                fetch(`${requestURL}/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        setLocalState(data);
                    });
        },
        [id],
    );

    const getDetail = id => {
        setDocDetail({ name: 'abc' });
    };

    function handleViewType(newViewType) {
        setViewType(newViewType);
        if (newViewType === 'project') {
            <Check />;
        }

        setOpenDialogTask(null);
    }

    const handleOpen = e => {
        setOpenDialog(e.currentTarget);
    };

    const handleClose = e => {
        setOpenDialog(null);
    };

    const handleChangeKanban = item => {
        props.mergeData({ kanbanStatus: item.type });
    };

    const taskPrioty = ['Rất cao', 'Cao', 'Trung bình', 'Thấp', 'Rất thấp'];
    const editPriority = localState && localState.priority ? taskPrioty[localState.priority - 1] : null;
    const configs = JSON.parse(localStorage.getItem('taskStatus'));
    const taskStatus = configs.find(item => item.code === 'TASKTYPE').data;

    const editCategory = localState && localState.category ? taskStatus[localState.category - 1].name : null;

    const mapCate = cate => {
        //console.log(cate)
        switch (cate) {
            case 1:
                return 'Xứ lý công văn'
            case 2:
                return 'Xứ lý công việc'
            case 3:
                return 'Xứ lý hồ sơ'
            case 4:
                return 'Xứ lý đơn thư'
        }
    }

    const onClickRow = (e, ids) => {
        e.preventDefault()

        // this.setState({ idEdit: ids, openEditDialog: true })
        setOpenEditDialog(true)
        setIdEdit(ids)
        // this.props.history.push(`/incomming-document-detail/${ids}`)
    }

    const onClickRowTask = (e, ids) => {
        e.preventDefault()

        // this.setState({ idEdit: ids, openEditDialog: true })
        setOpenEditprojects(true)
        setIdEdit(ids)
        // this.props.history.push(`/incomming-document-detail/${ids}`)
    }

    const mapTypeTask = (cate) => {
        const taskStt = JSON.parse(localStorage.getItem('taskStatus'))
        const taskType = taskStt && taskStt.find(item => item.code === 'TASKTYPE').data
        const data = taskType && taskType.find(i => i.type == cate)
        return data && data.name
    }

    return (
        <div>
            <CustomAppBar
                title={'Chi tiết Lịch cá nhân'}
                onGoBack={() => {
                    props.history.goBack();
                }}
                disableAdd

            />
            {/* <div>
                <KanbanStep kanbanStatus={editTaskPage.kanbanStatus} currentStatus={currentStatus} />
            </div> */}
            {/* {console.log('localState', localState)} */}
            <div>
                <Grid container spacing={8} style={{ marginTop: 30 }} >
                    <Grid item xs="16">
                        <PaperUI >
                            <Typography variant="h6" component="h2" gutterBottom display="block" style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}>
                                Thông tin Lịch cá nhân
                            </Typography>
                            <Grid container spacing={8}>
                                <Grid item xs={6}>
                                    <CustomInputBase
                                        label={name2Title.code || "Mã Lịch cá nhân"}
                                        value={localState.code}
                                        name="name"
                                        className="setCustomInput"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomInputBase
                                        label={name2Title.name}
                                        value={localState.name}
                                        name="name"
                                        className="setCustomInput"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>

                                    <DateTimePicker
                                        label={name2Title.timeStart || 'Thời gian bắt đầu'}
                                        value={localState.timeStart}
                                        name="timeStart"
                                        disabled
                                        className="setCustomInput"
                                        required={false}
                                        maxDateMessage={false}
                                        minDateMessage={false}
                                        format="DD/MM/YYYY HH:mm"
                                        variant="outlined"
                                        keyboard
                                        fullWidth
                                        keyboardIcon={<i className="far fa-clock fa-xs" />}
                                        margin="dense"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <DateTimePicker
                                        label={name2Title.timeEnd || 'Thời gian kết thúc'}
                                        value={localState.timeEnd}
                                        name="timeEnd"
                                        disabled
                                        className="setCustomInput"
                                        required={false}
                                        maxDateMessage={false}
                                        minDateMessage={false}
                                        format="DD/MM/YYYY HH:mm"
                                        variant="outlined"
                                        keyboard
                                        fullWidth
                                        keyboardIcon={<i className="far fa-clock fa-xs" />}
                                        margin="dense"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    {/* <FormControl>
                                        <FormControlLabel
                                            className="setCustomCheckbox"
                                            control={<Checkbox checked={localState.isObligatory ? true : false} value="isObligatory" color="primary" disabled />}
                                            label=" Bắt buộc tham gia"
                                        />
                                    </FormControl> */}
                                    <AsyncAutocomplete
                                        name="Chọn "
                                        label={name2Title.roomMetting || 'Phòng họp'}
                                        value={localState.roomMetting}
                                        url={`${API_MEETING}/room`}
                                        disabled
                                        className="setCustomInput"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    {/* <FormControl>
                                        <FormControlLabel
                                            className="setCustomCheckbox"
                                            control={<Checkbox checked={localState.hasRelatedProject ? true : false} value="hasRelatedProject" color="primary" disabled />}
                                            label=" Công việc liên quan"
                                        />
                                    </FormControl> */}
                                    <AsyncAutocomplete
                                        name="Chọn "
                                        label={name2Title.organizer || 'Người tổ chức'}
                                        value={localState.organizer}
                                        url={`${API_USERS}`}
                                        disabled
                                        className="setCustomInput"
                                        isMulti
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomInputBase
                                        label={name2Title.address}
                                        value={localState.address}
                                        name="name"
                                        className="setCustomInput"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    {/* <FormControl>
                                        <FormControlLabel
                                            className="setCustomCheckbox"
                                            control={<Checkbox checked={localState.hasRelatedProject ? true : false} value="hasRelatedProject" color="primary" disabled />}
                                            label="Văn bản đính kèm"
                                        />
                                    </FormControl> */}
                                    <AsyncAutocomplete
                                        name="Chọn "
                                        label={name2Title.people || 'Người tham gia'}
                                        value={localState.people}
                                        url={`${API_USERS}`}
                                        disabled
                                        className="setCustomInput"
                                        isMulti
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomInputBase
                                        label={name2Title.content}
                                        value={localState.content}
                                        name="name"
                                        className="setCustomInput"
                                        disabled
                                        rows={4}
                                        multiline
                                    />
                                </Grid>
                                <Grid item xs="12" style={{ marginTop: 20 }}>
                                    <PaperUI>
                                        <Typography variant="h6" component="h2" gutterBottom display="block" style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}>
                                            Văn bản đính kèm
                                        </Typography>
                                        {localState.dataIncoming && (
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ width: 20, fontWeight: 'bold', cursor: 'pointer' }} >STT</TableCell>
                                                        <TableCell style={{ width: 220, fontWeight: 'bold', cursor: 'pointer' }}>Số văn bản</TableCell>
                                                        <TableCell style={{ width: 220, fontWeight: 'bold', cursor: 'pointer' }} >Ngày văn bản</TableCell>
                                                        <TableCell style={{ width: 220, fontWeight: 'bold', cursor: 'pointer' }}>Trích yếu</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                {Array.isArray(localState.dataIncoming) && localState.dataIncoming
                                                    ? localState.dataIncoming.map((item, index) => (
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell style={{ cursor: 'pointer' }} onClick={e => onClickRow(e, item._id)}>{index + 1}</TableCell>
                                                                <TableCell style={{ cursor: 'pointer' }} onClick={e => onClickRow(e, item._id)}>{item.toBookCode}</TableCell>
                                                                <TableCell style={{ cursor: 'pointer' }} onClick={e => onClickRow(e, item._id)}>{moment(item.toBookDate).format('DD/MM/YYYY')}</TableCell>
                                                                <TableCell style={{ cursor: 'pointer' }} onClick={e => onClickRow(e, item._id)}>{item.abstractNote}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    ))
                                                    : null}
                                            </Table>
                                        )}
                                    </PaperUI>
                                </Grid>
                                <Grid item xs="12" style={{ marginTop: 20, marginBottom: 30 }}>
                                    <PaperUI>
                                        <Typography variant="h6" component="h2" gutterBottom display="block" style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}>
                                            Công việc liên quan
                                        </Typography>
                                        {localState.dataTask && (
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ width: 20, fontWeight: 'bold' }}>STT</TableCell>
                                                        <TableCell style={{ width: 220, fontWeight: 'bold' }}>Tên công việc</TableCell>
                                                        <TableCell style={{ width: 220, fontWeight: 'bold' }}>Loại công việc</TableCell>
                                                        <TableCell style={{ width: 220, fontWeight: 'bold' }}>Nội dung công việc</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                {Array.isArray(localState.dataTask) && localState.dataTask
                                                    ? localState.dataTask.map((item, index) => (
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell style={{ cursor: 'pointer' }} onClick={e => onClickRowTask(e, item._id)}>{index + 1}</TableCell>
                                                                <TableCell style={{ cursor: 'pointer' }} onClick={e => onClickRowTask(e, item._id)}>{item.name}</TableCell>
                                                                <TableCell style={{ cursor: 'pointer' }} onClick={e => onClickRowTask(e, item._id)}>{mapTypeTask(item.typeTask)}</TableCell>
                                                                <TableCell style={{ cursor: 'pointer' }} onClick={e => onClickRowTask(e, item._id)}>{item.description}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    ))
                                                    : null}
                                            </Table>
                                        )}
                                    </PaperUI>
                                </Grid>
                                <Grid item xs="12" >
                                    <PaperUI>
                                        <Typography variant="h6" component="h2" gutterBottom display="block" style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 'bold' }}>
                                            Tệp đính kèm
                                        </Typography>
                                        {docDetail && <FileUpload name={docDetail.name} id={id} code={code} viewOnly />}
                                    </PaperUI>

                                </Grid>
                            </Grid>

                        </PaperUI>

                    </Grid>


                </Grid>
                {/* <Grid container spacing={8} >
                    <Grid item xs="12">
                        <PaperUI>
                            <Typography variant="h6" component="h2" disabled gutterBottom display="block" style={{ textTransform: 'uppercase' }}>
                                Tệp đính kèm
                            </Typography>
                            {docDetail && <FileUpload name={docDetail.name} disabled id={id} code={code} />}
                        </PaperUI>

                    </Grid>
                </Grid> */}
            </div>
            <SwipeableDrawer
                anchor="right"
                onClose={() => setOpenEditDialog(true)}
                open={openEditDialog}
                width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
            >

                <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
                    <EditExecutiveDocuments id={idEdit} goBack={() => setOpenEditDialog(false)} />
                </div>
            </SwipeableDrawer>

            <SwipeableDrawer
                anchor="right"
                onClose={() => setOpenEditprojects(false)}
                open={openEditprojects}
                width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
            >

                <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
                    <EditProjects id={idEdit} goBack={() => setOpenEditprojects(false)} history={props.history} page={'meeting'} />
                </div>
            </SwipeableDrawer>
        </div>
    );
}

EditTaskPage.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    editTaskPage: makeSelectEditTaskPage(),
    profile: makeSelectProfile(),
    miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
    return {
        mergeData: data => dispatch(mergeData(data)),
    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'editTaskPage', reducer });
// const withSaga = injectSaga({ key: 'executiveDocuments', saga });

export default compose(
    withReducer,
    // withSaga,
    withConnect,
)(EditTaskPage);
