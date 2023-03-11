// EditTaskPage

import { Button, Grid, Menu, MenuItem, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import { mergeData } from './actions';
import makeSelectEditTaskPage from './selectors';
import reducer from './reducer';
import CustomAppBar from 'components/CustomAppBar';
import { Check } from '@material-ui/icons';
import { makeSelectProfile } from '../Dashboard/selectors';
import { Paper as PaperUI } from 'components/LifetekUi';
import {
    API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
    API_MEETING,
    API_ROLE_APP} from '../../config/urlConfig';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { getListData, viewConfigName2Title } from '../../utils/common';
import CustomDatePicker from '../../components/CustomDatePicker';

import { fetchData } from '../../helper';
import CalendarAssignModal from '../../components/CalendarAssignModal';
import CompleteDocs from '../../components/CalendarAssignModal/CompleteDocs';
import PublishDocs from '../../components/CalendarAssignModal/PublishDocs';
import DeltetePublishDocs from '../../components/CalendarAssignModal/DeltetePublishDocs';
import DestroyDocs from '../../components/CalendarAssignModal/DestroyDocs';
import { changeSnackbar } from '../Dashboard/actions';
import _ from 'lodash'
import CalendarDetail from '../AddWorkingSchedule/components/CalendarDetail';


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
    const { profile, code = 'Calendar', editTaskPage, onChangeSnackbar } = props;

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
    const [allRoles, setAllRoles] = useState([]);

    const [openDestroy, setOpenDestroy] = useState(false);
    const [openPublish, setOpenPublish] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [openDeletePublish, setOpenDeletePublish] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [businessRole, setBusinessRole] = useState({});
    const [templatesData, setTemplatesData] = useState([]);
    const [typeRole, setTypeRole] = useState(null);
    const [newCalendeDetail, setNewCalendeDetail] = useState([]);

    useEffect(
        () => {
            if (id) {
                getDetail(id);
            }
        },
        [id],
    );

    function customTemplate({ role, childrens = [], type = [], first = false }) {
        if (role && childrens) {
            const child = childrens.find(f => f.code === role);
            if (child) {
                if (type.length && child.type && child.type !== '' && type.find(t => child.type === t)) {
                    setTemplates(child.children || []);
                } else {
                    if (!first) {
                        setTemplates(child.children || []);
                    }
                    for (const item of childrens) {
                        if (item.children) {
                            customTemplate({ role, childrens: item.children, type, first: true });
                        }
                    }
                }
            } else {
                for (const item of childrens) {
                    if (item.children) {
                        customTemplate({ role, childrens: item.children, type });
                    }
                }
            }
        }
    }

    useEffect(() => {
        localStorage.removeItem('addWorkingScheduleCallback');
        const newNam2Title = viewConfigName2Title(code);
        setName2Title(newNam2Title);

        getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/calendar`).then(res => {
            if (res) {
                const newTemplate = _.get(res, '[0].children', [])
                setTemplates(newTemplate);
                setTemplatesData(res);
                customTemplate({
                    role: props.profile.roleGroupSource,
                    childrens: newTemplate,
                    type: props.profile.type
                });
            } else {
                onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng xử lý', status: true })
            }
        })

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

    useEffect(() => {
        fetchData(`${API_ROLE_APP}/Calendar/${profile._id}`).then(res => {
            const { roles } = res;
            const code = 'BUSSINES';
            const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
            const { data } = foundRoleDepartment;
            setAllRoles(data);
        });
    }, []);


    useEffect(() => {

        const dataProcessors = allRoles && allRoles.find(elm => elm.name === 'processors');
        const dataCompalte = allRoles && allRoles.find(elm => elm.name === 'compalte');
        const dataPublish = allRoles && allRoles.find(elm => elm.name === 'publish');
        const dataProcessorsFm = dataProcessors && dataProcessors.data;
        const dataCompalteFm = dataCompalte && dataCompalte.data;
        const dataPublishFm = dataPublish && dataPublish.data;

        const dataFm = JSON.parse(localStorage.getItem('workingScheduletab'))
        if (dataFm && dataFm.tab === 0) {
            setBusinessRole(dataProcessorsFm);
        }
        else if (dataFm && dataFm.tab === 1) {
            setBusinessRole(dataCompalteFm);
        }
        else if (dataFm && dataFm.tab === 2) {
            setBusinessRole(dataPublishFm);
        }
    }, [allRoles, profile]);

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

    const formatDay = (day) => {
        switch (day) {
            case 0:
                return 'Chủ nhật'
            case 1:
                return 'Thứ hai'
            case 2:
                return 'Thứ ba'
            case 3:
                return 'Thứ tư'
            case 4:
                return 'Thứ năm'
            case 5:
                return 'Thứ sáu'
            case 6:
                return 'Thứ bảy'
        }
    }

    const handleCloseCalendar = e => {
        setOpenDialog(null);
    };

    const dataFm = JSON.parse(localStorage.getItem('workingScheduletab'))

    _.has(dataFm, 'tabChild') && localStorage.setItem('editWorkingScheduleCallback', JSON.stringify({ tab: dataFm.tab, tabChild: dataFm.tabChild }));
    const dataProcessors = allRoles && allRoles.find(elm => elm.name === 'processors');
    const dataCompalte = allRoles && allRoles.find(elm => elm.name === 'compalte');
    const dataPublish = allRoles && allRoles.find(elm => elm.name === 'publish');
    const dataProcessorsFm = dataProcessors && dataProcessors.data;
    const dataCompalteFm = dataCompalte && dataCompalte.data;
    const dataPublishFm = dataPublish && dataPublish.data;


    const saveAndSend = () => {

    }




    return (
        <div>
            <CustomAppBar
                title={'Chi tiết lịch đơn vị'}
                onGoBack={() => {
                    props.history.goBack();
                }}
                disableAdd
                moreButtons={
                    <div style={{ marginRight: 10, display: 'flex', justifyContent: 'space-around' }}>
                        {/* {(dataFm && dataFm.tab === 0) && (dataFm && dataFm.tabChild === 0) ? (
              <Button variant="outlined" color="inherit" style={{ marginRight: 10 }} >
                Trình duyệt
              </Button>
            ) : null} */}

                        {/* {(dataFm && dataFm.tabChild !== 2) && (dataFm && dataFm.tab !== 2 && (dataFm.tab === 1 && dataFm.tabChild !== 1)) && businessRole && businessRole.compalte && businessRole.compalte === true && dataFm.tabChild !== 3 ? (
                            <>


                                <Button variant="outlined" color="inherit" style={{ marginRight: 10 }}
                                    onClick={() => {
                                        setOpenComplete(true)
                                    }}
                                >
                                    Phê duyệt
                                </Button>
                            </>
                        ) : null} */}
                        {/* {(dataFm && dataFm.tabChild !== 2) && id !== 'add' && businessRole && businessRole.unCompalte && businessRole.unCompalte === true
                            && ((dataFm && dataFm.tab === 2 && dataFm.tabChild !== 1) || (dataFm.tab === 1 && dataFm.tabChild !== 0)
                                && dataFm.tabChild !== 3
                            ) ? (
                            <>
                                <Button variant="outlined" color="inherit" style={{ marginRight: 10 }}
                                    onClick={() => setOpenDestroy(true)} >
                                    Hủy phê duyệt
                                </Button>

                            </>
                        ) : null} */}
                        {/* {(dataFm && dataFm.tabChild !== 2) && (dataFm && dataFm.tabChild === 0) && businessRole && businessRole.publish && businessRole.publish === true && dataFm.tabChild !== 3 ? (
                            <Button variant="outlined" color="inherit" style={{ marginRight: 10 }}
                                onClick={() => setOpenPublish(true)} >
                                Xuất bản
                            </Button>
                        ) : null} */}


                        {dataFm && dataFm.tab === 2 && dataFm.tabChild === 1 && id !== 'add' && businessRole && businessRole.unPublish && businessRole.unPublish === true ? (
                            <Button variant="outlined" color="inherit" style={{ marginRight: 10 }}
                                onClick={() => setOpenDeletePublish(true)} >
                                Huỷ xuất bản
                            </Button>
                        ) : null}
                        {/* {dataFm && dataFm.tab !== 2 && (dataFm && dataFm.tabChild !== 2) && (localState.children && localState.children.length === 0) && dataFm.tabChild !== 3
                            && (dataFm && dataFm.tabChild === 0) && businessRole && businessRole.approval && businessRole.approval === true
                            ? (
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    style={{ marginRight: 10 }}
                                    onClick={e => {
                                        if (currentRole) {
                                            setOpenAsignProcessor(true);
                                            return;
                                        }
                                        handleOpen(e);
                                    }}
                                >

                                    Trình duyệt
                                </Button>
                            ) : (
                                dataFm && dataFm.tab !== 2 && id !== 'add' && localState && localState.children && localState.children[0] && localState.children[0].children && localState.children[0].children.length > 0 ?
                                    (
                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            style={{ marginRight: 10 }}
                                            onClick={e => {
                                                if (currentRole) {
                                                    setOpenAsignProcessor(true);
                                                    return;
                                                }
                                                handleOpen(e);
                                            }}
                                        >

                                            Trình duyệt
                                        </Button>

                                    ) : null



                            )} */}



                        <Menu open={Boolean(openDialog)} anchorEl={openDialog} onClose={handleCloseCalendar}>
                            {localState.children && localState.children.length > 0 ? (
                                <div style={{ alignItems: 'center', padding: '0 10px' }}>

                                    {
                                        Array.isArray(localState.children) && localState.children.map(t => (

                                            <>
                                                {Array.isArray(localState.children) && Array.isArray(t.children) && t.children.map(i => (
                                                    <>
                                                        <MenuItem
                                                            value={i.code}
                                                            onClick={() => {
                                                                setOpenAsignProcessor(true);
                                                                setNextRole(i.code)
                                                                setSelectedTemplate(i)
                                                                setTypeRole(i.type)
                                                            }}

                                                        >
                                                            <span style={{ paddingLeft: 60 }}>Chuyển cho {i.name}</span>
                                                        </MenuItem>
                                                    </>
                                                ))
                                                }
                                            </>
                                        ))}
                                </div>
                            ) : (
                                <div style={{ alignItems: 'center', padding: '0 10px' }}>
                                    {
                                        templates && Array.isArray(templates) &&
                                        templates.map(t => (
                                            <>


                                                <>
                                                    <MenuItem
                                                        value={t.code}
                                                        onClick={() => {
                                                            setOpenAsignProcessor(true);
                                                            setSelectedTemplate(t)
                                                            setTypeRole(t.type)
                                                        }}
                                                    >
                                                        <span >Chuyển cho {t.name}</span>
                                                    </MenuItem>
                                                </>


                                            </>



                                        ))}
                                </div>
                            )}

                        </Menu>

                    </div>
                }

            />
            {/* <div>
                <KanbanStep kanbanStatus={editTaskPage.kanbanStatus} currentStatus={currentStatus} />
            </div> */}
            <div>
                <Grid container spacing={8} style={{ marginTop: 30 }} >
                    <Grid item xs="12">
                        <PaperUI >
                            <Typography variant="h6" component="h2" gutterBottom display="block" style={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 600 }}>
                                Thông tin lịch đơn vị
                            </Typography>
                            <Grid container spacing={8}>
                                {/* <Grid item xs={6}>
                                    <CustomInputBase
                                        label={name2Title.code}
                                        value={localState.code}
                                        name="name"
                                        className="setCustomInput"
                                        disabled
                                    />
                                </Grid> */}
                                <Grid item xs={12}>
                                    <CustomInputBase
                                        label={name2Title.name}
                                        value={localState.name}
                                        name="name"
                                        className="setCustomInput"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>

                                    <CustomDatePicker
                                        label={name2Title.timeStart || 'Thời gian bắt đầu'}
                                        value={localState.timeStart}
                                        name="timeStart"
                                        disabled
                                        className="setCustomInput"
                                        required={false}
                                        maxDateMessage={false}
                                        minDateMessage={false}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomDatePicker
                                        label={name2Title.timeEnd || 'Thời gian kết thúc'}
                                        value={localState.timeEnd}
                                        name="timeEnd"
                                        disabled
                                        className="setCustomInput"
                                        required={false}
                                        maxDateMessage={false}
                                        minDateMessage={false}
                                    />
                                </Grid>
                            </Grid>
                            {localState && <CalendarDetail
                                disabled
                                id={id}
                                profile={profile}
                                item={localState}
                                onChangeSnackbar={onChangeSnackbar}
                                query={_.get(props, 'location.state.queryCalen')}
                            />}

                            {/* {docDetail && <FileUpload name={docDetail.name} id={id} code={code} viewOnly />} */}
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
                <CalendarAssignModal
                    open={openAsignProcessor}
                    template={templatesData}
                    childTemplate={selectedTemplate}
                    onClose={() => {
                        setOpenAsignProcessor(false);
                        setSelectedTemplate(null)
                    }}
                    onSuccess={() => {

                        props.history.goBack();
                    }}
                    onChangeSnackbar={onChangeSnackbar}
                    currentRole={nextRole}
                    typeRole={typeRole ? typeRole : ''}
                    saveAndSend={saveAndSend}
                    docIds={selectedDocs}
                />

                <CompleteDocs
                    open={openComplete}
                    docIds={selectedDocs}
                    // template={setOpenComplete}
                    onClose={() => {
                        setOpenComplete(false);
                        // props.history.goBack();
                    }}
                    onSuccess={() => {
                        props.history.goBack();
                    }}
                    onChangeSnackbar={onChangeSnackbar}
                />

                <PublishDocs
                    open={openPublish}
                    docIds={selectedDocs}
                    // template={setOpenComplete}
                    onClose={() => {
                        setOpenPublish(false);
                        // props.history.goBack();
                    }}
                    onSuccess={() => {
                        props.history.goBack();
                    }}
                    onChangeSnackbar={onChangeSnackbar}
                />

                <DeltetePublishDocs
                    open={openDeletePublish}
                    docIds={selectedDocs}
                    // template={setOpenComplete}
                    // onClose={() => {
                    //     this.setState({
                    //         openDeletePublish: false
                    //     })
                    // }}
                    onClose={() => {
                        setOpenDeletePublish(false);
                        // props.history.goBack();
                    }}
                    onSuccess={() => {
                        props.history.goBack();
                    }}
                    onChangeSnackbar={onChangeSnackbar}
                />

                <DestroyDocs
                    open={openDestroy}
                    docIds={selectedDocs}
                    // template={setOpenComplete}
                    onClose={() => {
                        setOpenDestroy(false);
                        // props.history.goBack();
                    }}
                    onSuccess={() => {
                        props.history.goBack();
                    }}
                    onChangeSnackbar={onChangeSnackbar}
                />
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
        onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
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
