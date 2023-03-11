// EditTaskPage

import { Checkbox, FormControl, Grid, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import { mergeData } from './actions';
import makeSelectEditTaskPage from './selectors';
import reducer from './reducer';
import { Tabs, Tab, } from '../../components/LifetekUi';
import CustomAppBar from 'components/CustomAppBar';
import { Check } from '@material-ui/icons';
import { makeSelectProfile } from '../Dashboard/selectors';
import { Paper as PaperUI } from 'components/LifetekUi';
import { API_MEETING } from '../../config/urlConfig';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { viewConfigName2Title, serialize } from '../../utils/common';
import CalendarComponent from '../../components/Calendar';
import { changeSnackbar } from '../Dashboard/actions';



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
    const { profile, code = 'MettingRoom', editTaskPage } = props;

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
    const [index, setIndex] = useState(0);
    const [dataFm, setDataFm] = useState([])

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
                fetch(`${requestURL}/room/${id}`, {
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

    useEffect(
        () => {
            const meetingFilter = serialize({
                filter: {
                  typeCalendar: '1',
                },
              });

            if (id && id !== 'add')
                fetch(`${API_MEETING}?${meetingFilter}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        setDataFm(data.data);
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



    const handleChangeTab = (event, newValue) => {
        setIndex(newValue);
    };

    const handleEditMeeting = arg => {
        return props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí chỉ có thể xem ở phần này', status: true });
      };
    
      const handleDelete = data => {
        return props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí chỉ có thể xem ở phần này', status: true });
      }


      const newMeeting = dataFm.filter(elm => (elm.roomMetting ? elm.roomMetting._id === localState._id : ''));




    return (
        <div>
            <CustomAppBar
                title={'Chi tiết quản lý phòng họp'}
                onGoBack={() => {
                    props.history.goBack();
                }}
                disableAdd

            />
            {/* <div>
                <KanbanStep kanbanStatus={editTaskPage.kanbanStatus} currentStatus={currentStatus} />
            </div> */}
            <div>
                <Grid container spacing={8}  >
                    <Tabs onChange={handleChangeTab} value={index} aria-label="simple tabs example">
                        <Tab label="Thông tin chi tiết" />
                        <Tab label="Lịch phòng họp" />
                    </Tabs>
                    {index === 0 ? (
                        <Grid item xs="12"  style={{marginTop: 30}}>

                            <PaperUI >
                               
                                <Grid container spacing={8}>
                                    <Grid item xs={6}>
                                        <CustomInputBase
                                            label={name2Title.code}
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
                                        <CustomInputBase
                                            label={name2Title.address}
                                            value={localState.address}
                                            name="name"
                                            className="setCustomInput"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <CustomInputBase
                                            label={name2Title.acreage}
                                            value={localState.acreage}
                                            name="name"
                                            className="setCustomInput"
                                            disabled
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl component="fieldset">
                                            <Typography variant="subtitle2"> Tiện ích</Typography>
                                            {localState.utilities && localState.utilities.map(item => (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Checkbox

                                                        checked={localState.utilities.map(i => i).includes(item)}
                                                        color="primary"
                                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                    />
                                                    <Typography>{item}</Typography>{' '}
                                                </div>
                                            ))}
                                        </FormControl>
                                    </Grid>
                                </Grid>

                            </PaperUI>

                        </Grid>
                    ) : null}
                     {index === 1 ? (
                         <Grid item xs="12"  style={{marginTop: 30}}>
                             <CalendarComponent meetings={newMeeting} handleEdit={handleEditMeeting} handleAdd handleDelete={handleDelete} />{' '}
                         </Grid>
                         ) : null}


                </Grid>
            </div>
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
});

function mapDispatchToProps(dispatch) {
    return {
        mergeData: data => dispatch(mergeData(data)),
        onChangeSnackbar: obj => {
            dispatch(changeSnackbar(obj));
          },
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
