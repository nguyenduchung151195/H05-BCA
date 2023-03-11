// EditPromulgate

import { Button, Checkbox, FormControlLabel, Grid, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import { mergeData } from './actions';
import makeSelectEditPromulgate from './selectors';
import reducer from './reducer';
import { Comment, FileUpload, KanbanStep } from '../../components/LifetekUi';
import CustomAppBar from 'components/CustomAppBar';
import { Check, CheckBox } from '@material-ui/icons';
import { makeSelectProfile } from '../Dashboard/selectors';
import ListPage from 'components/List';
import { Paper as PaperUI } from 'components/LifetekUi';
import { API_RELEASE_DOCUMENT, API_DOCUMENT_HISTORY } from '../../config/urlConfig';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomInputField from '../../components/Input/CustomInputField';
import { viewConfigCheckShowForm } from '../../utils/common';
import Department from 'components/Filter/DepartmentAndEmployee';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomGroupInputField from '../../components/Input/CustomGroupInputField';
import DocumentAssignModal from 'components/DocumentAssignModalGo';
import DocumentSetCommanders from 'components/DocumentAssignModal/SetCommanders';
import ReturnDocs from 'components/DocumentAssignModal/ReturnDocs';
import CompleteDocs from 'components/DocumentAssignModal/CompleteDocs';

function EditPromulgate(props) {
    const { profile, code = 'Documentary', editPromulgate } = props;
    const id = props.id ? props.id : props.match.params.id;
    const [selectedDocs, setSelectedDocs] = useState([id]);
    const [docDetail, setDocDetail] = useState(null);
    const [openDialog, setOpenDialog] = useState(null);
    const [viewType, setViewType] = useState('any');
    const [localState, setLocalState] = useState({
        others: {},
    });
    const [currentRole, setCurrentRole] = useState(null);
    const [nextRole, setNextRole] = useState(null);
    const requestURL = API_RELEASE_DOCUMENT;
    const [openAsignProcessor, setOpenAsignProcessor] = useState(false);
    const [openSetCommanders, setOpenSetCommanders] = useState(false);
    const [openReturnDocs, setOpenReturnDocs] = useState(false);
    const [openComplete, setOpenComplete] = useState(false);

    useEffect(
        () => {
            if (id) {
                getDetail(id);
            }
        },
        [id],
    );

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
                        setCurrentRole(data.currentRole);
                        setNextRole(data.nextRole);
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

    function getLabel(name) {
        return viewConfigCheckShowForm('OutGoingDocument', name, '', 'title');
    }

    return (
        <div>
            <CustomAppBar
                title={'Chi tiết công văn đi'}
                onGoBack={() => {
                    props.history.goBack();
                }}
                disableAdd

                moreButtons={
                    <div style={{ marginLeft: 10, display: 'flex', justifyContent: 'space-around' }}>
                        {((localState &&
                            localState.template &&
                            localState.template.group &&
                            localState.currentRole === localState.template.group[localState.template.group.length - 1].person) ||
                            (localState &&
                                !localState.template &&
                                localState.stage === 'processing')) && (
                                <Button
                                    style={{ marginRight: 10 }}
                                    variant="outlined"
                                    color="inherit"
                                    onClick={e => {
                                        setOpenComplete(true);
                                    }}
                                >
                                    <span style={{ marginRight: 5 }}>
                                        <CheckBox />
                                    </span>
                                    Hoàn thành xử lý
                                </Button>
                            )}
                        <Button
                            style={{ marginRight: 10 }}
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                                setOpenSetCommanders(true);
                            }}
                        >
                            {/* <span style={{ marginRight: 5 }}>
                                <ChatBubbleOutline />
                            </span> */}
                            Xin ý kiến
                        </Button>
                        <Button
                            style={{ marginRight: 10 }}
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                                setOpenReturnDocs(true);
                            }}
                        >
                            {/* <span style={{ marginRight: 5 }}>
                                <Replay />
                            </span> */}
                            Trả lại
                        </Button>
                        {localState &&
                            localState.stage === 'processing' &&
                            (!localState.template ||
                                !localState.template.group ||
                                !(localState.currentRole === localState.template.group[localState.template.group.length - 1].person)) && (
                                <Button
                                    variant="outlined"
                                    color="inherit"

                                    onClick={() => {
                                        setOpenAsignProcessor(true);
                                    }}
                                >
                                    {/* <span style={{ marginRight: 5 }}>
                                        <Send />
                                    </span> */}
                                    Chuyển xử lý
                                </Button>
                            )}

                    </div>
                }
            // onSubmit={onSave}
            />
            <div>
                <KanbanStep handleStepper={handleChangeKanban} kanbanStatus={editPromulgate.kanbanStatus} code="ST22" />
            </div>
            <div>
                <Grid container spacing={8} >
                    <Grid item xs="8">
                        <PaperUI >
                            <Typography variant="h6" component="h2" gutterBottom display="block" style={{ textTransform: 'uppercase' }}>
                                Thông tin chung
                            </Typography>
                            <Grid container spacing={8}>
                                <Grid item xs={6}>
                                    <CustomInputBase
                                        label={getLabel('toBook')}
                                        value={localState.toBook}
                                        name="toBook"
                                        disable
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomInputBase
                                        label={getLabel('toBookCode')}
                                        value={localState.toBookCode}
                                        name="toBookCode"
                                        disable
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomDatePicker
                                        label={getLabel('toBookDate')}
                                        value={localState.toBookDate}
                                        name="toBookDate"
                                        disable
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Department labelDepartment={getLabel('senderUnit')} department={localState.senderUnit} disableEmployee profile={profile} moduleCode="ReleaseDocument" disable />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomInputField
                                        label={getLabel('documentType')}
                                        value={localState.documentType}
                                        configType="crmSource"
                                        configCode="S19"
                                        type="Source|CrmSource,S19|Value||value"
                                        disable
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomInputField
                                        label={getLabel('privateLevel')}
                                        configType="crmSource"
                                        configCode="S21"
                                        type="Source|CrmSource,S21|Value||value"
                                        name="privateLevel"
                                        value={localState.privateLevel}
                                        disable
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomInputField
                                        label={getLabel('documentField')}
                                        configType="crmSource"
                                        configCode="S26"
                                        type="Source|CrmSource,S26|Value||value"
                                        name="documentField"
                                        value={localState.documentField}
                                        disable
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomInputField
                                        label={getLabel('urgencyLevel')}
                                        configType="crmSource"
                                        configCode="S20"
                                        type="Source|CrmSource,S20|Value||value"
                                        name="urgencyLevel"
                                        value={localState.urgencyLevel}
                                        disable
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={localState.answer4docCheck}
                                                value="answer4docCheck"
                                                color="primary"
                                                disable
                                            />
                                        }
                                        label="Phúc đáp văn bản"
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <CustomGroupInputField code={code} columnPerRow={4} value={localState.others}  />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomInputBase
                                        rows={5}
                                        multiline
                                        label={getLabel('abstractNote')}
                                        value={localState.abstractNote}
                                        name="abstractNote"
                                        disable
                                    />

                                </Grid>
                            </Grid>
                        </PaperUI>

                    </Grid>
                    <Grid item xs="4">
                        <PaperUI style={{ height: '100%' }}>
                            <Typography variant="h6" component="h2" gutterBottom disabled display="block" style={{ textTransform: 'uppercase' }} >
                                Lịch sử ý kiến
                            </Typography>
                            {docDetail && <Comment profile={profile} disabled code={code} id={id} />}
                        </PaperUI>

                    </Grid>


                </Grid>
                <Grid container spacing={8} >
                    <Grid item xs="12">
                        <PaperUI>
                            <Typography variant="h6" component="h2" disabled gutterBottom display="block" style={{ textTransform: 'uppercase' }}>
                                Tệp đính kèm
                            </Typography>
                            {docDetail && <FileUpload name={docDetail.name} disabled id={id} code={code} />}
                        </PaperUI>

                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid item xs="12">
                        <PaperUI>
                            <Typography variant="h6" component="h2" gutterBottom display="block" style={{ textTransform: 'uppercase' }}>
                                Thông tin người nhận
                            </Typography>
                            {id && <ListPage code="DocumentHistory" apiUrl={API_DOCUMENT_HISTORY} filter={{ docId: id }} disableAdd disableSearch disableImport disableViewConfig />}
                        </PaperUI>
                    </Grid>
                </Grid>
            </div>
            <DocumentAssignModal
                open={openAsignProcessor}
                docIds={selectedDocs}
                onClose={() => {
                    setOpenAsignProcessor(false);
                    props.history.goBack();
                }}
                onChangeSnackbar={props.onChangeSnackbar}
            />

            <DocumentSetCommanders
                open={openSetCommanders}
                docIds={selectedDocs}
                onClose={() => {
                    setOpenSetCommanders(false);
                    props.history.goBack();
                }}
                onChangeSnackbar={props.onChangeSnackbar}
            />
            <ReturnDocs
                open={openReturnDocs}
                docIds={selectedDocs}
                onClose={() => {
                    setOpenReturnDocs(false);
                    props.history.goBack();
                }}
                onChangeSnackbar={props.onChangeSnackbar}
            />
            <CompleteDocs
                open={openComplete}
                docIds={selectedDocs}
                template={setOpenComplete}
                onClose={() => {
                    setOpenComplete(false);
                    props.history.goBack();
                }}
                onChangeSnackbar={props.onChangeSnackbar}
            />
        </div>
    );
}

EditPromulgate.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    editPromulgate: makeSelectEditPromulgate(),
    profile: makeSelectProfile(),
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

const withReducer = injectReducer({ key: 'editPromulgate', reducer });
// const withSaga = injectSaga({ key: 'executiveDocuments', saga });

export default compose(
    withReducer,
    // withSaga,
    withConnect,
)(EditPromulgate);
