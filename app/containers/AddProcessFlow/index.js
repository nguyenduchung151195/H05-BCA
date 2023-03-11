// AddProcessFlow

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { mergeData, updateApproveGroupAction, addApproveGroupAction, getApproveGroupDetailPageAction, resetNotis, getAllUserAct } from './actions';
import makeAddSelectProcessFlow from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Grid } from '@material-ui/core';
import { Paper as PaperUI } from 'components/LifetekUi';
import { makeSelectMiniActive, makeSelectProfile } from '../Dashboard/selectors';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomAppBar from 'components/CustomAppBar';
import { clientId } from 'variable';
import { API_ORIGANIZATION } from '../../config/urlConfig';
import _ from 'lodash';
import { Treeview } from '../../components/LifetekUi';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { fetchData, flatChild } from '../../helper';
import MenuItem from '@material-ui/core/MenuItem';

const Container = styled.div`
  display: contents;
`;
const dataDocType = [
  {
    code: 'IncommingDocument',
    color: 'rgb(52, 11, 214)',
    name: 'Văn bản đến',
    type: 'IncommingDocument',
    label: 'Loại công văn',
    title: 'Văn bản đến',
    value: 'IncommingDocument',
  },
  {
    code: 'OutGoingDocument',
    color: 'rgb(52, 11, 214)',
    name: 'Văn bản đi',
    type: 'OutGoingDocument',
    title: 'Văn bản đi',
    value: 'OutGoingDocument',
    label: 'Loại công văn',
  },
];
function AddProcessFlow(props) {
  const { mergeData, addProcessFlow, miniActive, profile } = props;
  const id = props.match && props.match.params && props.match.params.id;
  const { reload, users } = addProcessFlow;
  let queryFilter = { filter: { type: localStorage.getItem('tabFlow') }, limit: 50 };

  const [localState, setLocalState] = useState({
    flow: '',
    group: [],
    clientId,
    authorityAdd: [],
    docType: {},
  });
  const [groupTree, setGroupTree] = useState([]);
  const [disableButton, setdisableButton] = useState(false);
  const [localMessages, setLocalMessages] = useState({});
  const [departmentss, setDepartmentss] = useState([]);
  const [parentOrgId, setParentOrgId] = useState([]);
  const [tasks, setTasks] = useState([
    {
      id: '0',
      content: '',
      subItems: [],
    },
  ]);
  const getDataa = async () => {
    try {
      const departmentsRes = await fetchData(`${API_ORIGANIZATION}`);
      const flattedDepartment = flatChild(departmentsRes);
      setDepartmentss(flattedDepartment);
    } catch (error) {}
  };

  useEffect(
    () => {
      props.onGetAllUser();
      if (id !== 'add') {
        props.onGetApproveGroupDetailPage(props.match.params.id);
      }
    },
    [id],
  );

  useEffect(
    () => {
      const { addProcessFlow: detail = {} } = addProcessFlow;
      if (id !== 'add' && detail) {
        setParentOrgId(detail.parentOrgId);
        setLocalState({
          ...detail,
          isActive: detail.isActive ? true : false,
          docType: dataDocType.find(f => detail.docType && f.code === detail.docType.value),
        });
      }
    },
    [addProcessFlow],
  );

  const handleInputChange = e => {
    setLocalState({ ...localState, [e.target.name]: e.target.value });
  };

  const handleChangeCheckbox = name => e => {
    if (name !== 'docType') {
      setLocalState({ ...localState, [name]: e.target.checked });
    } else {
      setLocalState({ ...localState, [name]: e.target.value });
    }
  };

  const handleUpdateApproveGroup = listUser => {
    const newGroup = listUser.map((item, index) => ({
      person: item.code,
      order: index,
      name: item.name,
    }));
    localState.group = newGroup;
    // setLocalState({ ...localState });
  };

  const handleSelectedUserChange = newSelected => {
    if (!Array.isArray(newSelected)) newSelected = [];
    localState.group = newSelected.map(u => ({ person: u.code, order: u.order, name: u.name }));
    // setLocalState({ ...localState });
  };

  function getUrl() {
    const res = window.location.pathname.split('/');
    const path = props.path ? props.path : res[res.length - 2];
    return path;
  }

  const cb = () => {
    props.history.push({
      pathname: `/${getUrl()}`,
      index: props.location.index,
    });
  };
  const handleChangeType = name => e => {
    if (localStorage.getItem('processFlowType') === 'reject') {
      let array = e.target.value && e.target.value.group ? e.target.value.group.reverse() : [];
      array = array.map((item, index) => ({ ...item, order: index + 1 }));
      // setLocalState({ ...localState, [name]: e.target.value });
    }
  };

  const handleGetDataTree = treeData => {
    setGroupTree(treeData);
  };

  const handleSubmit = useCallback(
    () => {
      const message = {};
      if (!localState.code && !localState.name) {
        props.onChangeSnackbar({ status: true, message: 'Vui lòng nhập đầy đủ thông tin', variant: 'error' });
        return;
      }

      let taskSending = tasks && tasks.filter(f => f.id !== '0');
      let group = [];
      if (taskSending.length > 0) {
        taskSending.map(task => {
          let obj = {
            attributeGroupId: task.id,
            attributes: [...task.subItems],
            name: task.content,
          };
          group.push(obj);
        });
      }

      let body = {
        ...localState,
        children: groupTree,
        type: localStorage.getItem('tabFlow'),
        parentOrgId: parentOrgId,
      };
      try {
        setdisableButton(true);
        props.match.params.id === 'add' ? props.onAddApproveGroup(body, cb) : props.onUpdateApproveGroup(body, cb);
      } catch (error) {
        setdisableButton(false);
      }
    },
    [localState, groupTree, parentOrgId],
  );
  useEffect(
    () => {
      const { success, error } = addProcessFlow;
      if (success === false && error === true) setdisableButton(false);
    },
    [addProcessFlow],
  );
  useEffect(() => {
    getDataa();
    // if (id && id !== "add") {
    //   const { addProcessFlow: detail = {} } = addProcessFlow
    //   console.log(detail, "detail")
    //   setParentOrgId(detail.parentOrgId)
    // }
  }, []);
  // const handleAddOrgID = (value) => {
  //   // this.props.mergeData({ users: users })
  //   // if (!users || users.length <= 0) {
  //   //     this.props.mergeData({ checkedAllUser: false })
  //   // }
  //   let listID = []
  //   value.map((el) => {
  //     listID.push(el._id)
  //   })
  //   setParentOrgId(listID)

  // }
  const processFlowTypeISLetter = localStorage.getItem('processFlowType') === 'letter';
  const processFlowTypeISCalendar = localStorage.getItem('processFlowType') === 'calendar';
  const processFlowTypeISReject = localStorage.getItem('processFlowType') === 'reject';
  const saveRef = React.createRef();

  return (
    <div>
      <CustomAppBar
        title={id && id !== 'add' ? 'Chỉnh sửa luồng' : 'Thêm mới luồng'}
        onGoBack={() => {
          props.history.push({
            pathname: `/${getUrl()}`,
            index: props.location.index,
          });
        }}
        disableSave={disableButton}
        onSubmit={handleSubmit}
      />
      <PaperUI style={{ zIndex: '0 !important', marginTop: 30 }}>
        <Grid container spacing={16}>
          <Grid item xs={4}>
            <CustomInputBase
              autoFocus
              onChange={handleInputChange}
              value={localState.code}
              name="code"
              id="outlined-full-width"
              label="Mã luồng "
              style={{ margin: 8 }}
              fullWidth
              variant="outlined"
            />
          </Grid>
          {processFlowTypeISLetter || processFlowTypeISCalendar ? (
            <Grid item xs={4}>
              <CustomInputBase
                onChange={handleInputChange}
                value={localState.name}
                name="name"
                id="outlined-full-width"
                label="Tên luồng"
                style={{ margin: 8 }}
                fullWidth
                variant="outlined"
              />
            </Grid>
          ) : (
            <>
              <Grid item xs={4}>
                <CustomInputBase
                  onChange={handleInputChange}
                  value={localState.name}
                  name="name"
                  id="outlined-full-width"
                  label={'Tên luồng'}
                  style={{ margin: 8 }}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              {/* <Grid item xs={4}>
                <CustomInputField
                  label={'Loại công văn'}
                  type="MenuItem"
                  options={dataDocType}
                  name="docType"
                  value={localState.docType}
                  onChange={(value) => handleChangeCheckbox('docType')(value)}
                  required
                  className={"CustomRequiredLetter"}
                  checkedShowForm
                  error={localMessages.docType}
                  helperText={localMessages.docType}
                />
              </Grid> */}
            </>
          )}
          <Grid item xs={4}>
            <CustomInputBase
              id="standard-select-currency"
              select
              label={`Phạm vi đơn vị luồng chạy qua:`}
              name="parentOrgId"
              variant="outlined"
              value={parentOrgId}
              onChange={e => setParentOrgId(e.target.value)}
            >
              {departmentss &&
                Array.isArray(departmentss) &&
                departmentss.length > 0 &&
                departmentss.map(item => (
                  <MenuItem key={item.id} value={item.id} style={{ paddingLeft: `${item.level * 20}px` }}>
                    {item.title}
                  </MenuItem>
                ))}
            </CustomInputBase>
          </Grid>
          {/* <Grid item xs={2}>
            <FormControlLabel
              control={<Checkbox value="isActive" color="primary" checked={localState.isActive ? true : false} onChange={(v) => handleChangeCheckbox('isActive')(v)} />}
              label="Là luồng chính"
            />
          </Grid> */}
        </Grid>
      </PaperUI>
      <Grid md={12}>
        <Treeview
          users={users}
          isCalendar={processFlowTypeISCalendar}
          treeData={localState.children}
          saveRef={saveRef}
          getTreeData={handleGetDataTree}
          isProcessFlow={true}
        />
        {/* <Treeview treeData={treeData} saveRef={saveRef} templateId={_id} onSave={this.onSave} configs={this.state.taskStatus} /> */}
      </Grid>
    </div>
  );
}

AddProcessFlow.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
  onGetAllUser: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addProcessFlow: makeAddSelectProcessFlow(),
  miniActive: makeSelectMiniActive(),
  // dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
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
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
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
