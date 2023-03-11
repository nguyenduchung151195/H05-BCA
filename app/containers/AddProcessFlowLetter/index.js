
// AddProcessFlow

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, SwipeableDrawer, VerticalTabs, VerticalTab } from '../../components/LifetekUi';
import Buttons from 'components/CustomButtons/Button';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { mergeData, updateApproveGroupAction, addApproveGroupAction, getApproveGroupDetailPageAction, resetNotis, getAllUserAct } from './actions';
import makeAddSelectProcessFlow from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
    Grid,
    Fab,
    FormControlLabel,
    Checkbox,

} from '@material-ui/core';
import { Paper as PaperUI } from 'components/LifetekUi';
import { makeSelectMiniActive } from '../Dashboard/selectors';
import CustomInputBase from '../../components/Input/CustomInputBase';
import DepartmentSelect from '../../components/DepartmentSelect/Clone';
import CustomAppBar from 'components/CustomAppBar';
import DndUserProcessFlow from '../../components/DndUserProcessFlow';
import { clientId } from 'variable';


function AddProcessFlow(props) {
    const { mergeData, addProcessFlow, miniActive } = props;
    const id = props.match && props.match.params && props.match.params.id;
    const { reload, users } = addProcessFlow;
    const [localState, setLocalState] = useState({
        name: '',
        code: '',
        group: [],
        clientId,
        authorityAdd: [],

    });

    useEffect(() => {
        props.onGetAllUser();
        if (props.match.params.id && props.match.params.id !== 'add') {
            props.onGetApproveGroupDetailPage(props.match.params.id);
        }
    }, []);

    useEffect(() => {
        if (addProcessFlow.addProcessFlow && props.match.params.id !== 'add') {
            setLocalState({ ...addProcessFlow.addProcessFlow });
        }
    }, [addProcessFlow.addProcessFlow]);

    const handleInputChange = e => {
        setLocalState({ ...localState, [e.target.name]: e.target.value });
    };


    const handeChangeDepartment = viewedDepartmentIds => {
        setLocalState({ ...localState, organizationId: viewedDepartmentIds });
    };

    const handleChangeCheckbox = name => e => {
        setLocalState({ ...localState, [name]: e.target.checked });
    };

    const handleUpdateApproveGroup = (listUser) => {
        const newGroup = listUser.map((item, index) => ({
            person: item.code,
            order: index,
            name: item.name,
        }));
        localState.group = newGroup;
        setLocalState({ ...localState });
    };

    const handleSelectedUserChange = newSelected => {
        if (!Array.isArray(newSelected)) newSelected = [];
        localState.group = newSelected.map(u => ({ person: u.code, order: u.order, name: u.name }));
        setLocalState({ ...localState });;
    }

    const cb = () => {
        props.history.goBack();
    }

    return (
        <div>
            <CustomAppBar
                title={id && id !== 'add' ? 'Chỉnh sửa quy trình' : 'Thêm mới quy trình'}
                onGoBack={() => {
                    props.history.goBack()
                }}
                onSubmit={() => {
                    props.match.params.id === 'add'
                        ? props.onAddApproveGroup(localState, cb)
                        : props.onUpdateApproveGroup(localState, cb);
                }}

            />
            <PaperUI style={{ zIndex: '0 !important', marginTop: 30 }}>
                <Grid container spacing={16}>
                    <Grid item xs={6} >
                        <CustomInputBase
                            onChange={handleInputChange}
                            value={localState.code}
                            name="code"
                            id="outlined-full-width"
                            label="Mã quy trình"
                            style={{ margin: 8 }}
                            fullWidth
                            variant="outlined"
                        />
                        <CustomInputBase
                            onChange={handleInputChange}
                            value={localState.name}
                            name="name"
                            id="outlined-full-width"
                            label="Tên quy trình"
                            style={{ margin: 8 }}
                            fullWidth
                            variant="outlined"
                        />
                        {/* <DepartmentSelect
                            title=""
                            allowedDepartmentIds={localState.organizationId || []}
                            onChange={handeChangeDepartment}
                            isMultiple
                        /> */}
                    </Grid>
                    <Grid item xs={6} >
                        <FormControlLabel control={<Checkbox value="checkedB" color="primary" checked={localState.approveType}
                            onChange={handleChangeCheckbox('checkedB')} />} label="Hoạt động" />
                    </Grid>
                </Grid>
            </PaperUI>
            <PaperUI style={{ zIndex: '0 !important' }} >
                <DndUserProcessFlow selected={localState.group}
                    authorityAdd={localState.authorityAdd}
                    handleUpdateApproveGroup={handleUpdateApproveGroup}
                    users={users}
                    onSelectedChange={handleSelectedUserChange} 
                    title={"Danh sách vai trò trong quy trình"}
                />
            </PaperUI>

        </div>
    );
};

AddProcessFlow.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    dispatch: PropTypes.func.isRequired,
    onGetAllUser: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    addProcessFlow: makeAddSelectProcessFlow(),
    miniActive: makeSelectMiniActive(),
    // dashboardPage: makeSelectDashboardPage(),
    // profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
    return {
        mergeData: data => dispatch(mergeData(data)),
        onGetAllUser: () => {
            dispatch(getAllUserAct());
        },
        onAddApproveGroup: (localState, cb) => {
            dispatch(addApproveGroupAction(localState, cb));
        },
        onUpdateApproveGroup: (localState, cb) => {
            dispatch(updateApproveGroupAction(localState, cb));
        },
        onGetApproveGroupDetailPage: id => {
            dispatch(getApproveGroupDetailPageAction(id));
        },
        onResetNotis: () => {
            dispatch(resetNotis());
        },
    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addProcessFlow', reducer });
const withSaga = injectSaga({ key: 'addProcessFlow', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect,
)(AddProcessFlow);

