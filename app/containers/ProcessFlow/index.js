// ProcessFlow

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, SwipeableDrawer, VerticalTabs, VerticalTab } from '../../components/LifetekUi';
import Buttons from 'components/CustomButtons/Button';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { mergeData } from './actions';
import makeSelectProcessFlow from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Grid, Fab, Tooltip, Button } from '@material-ui/core';
import request from '../../utils/request';
import { SettingsPower } from '@material-ui/icons'
import ListPage from '../../components/List';
import { API_DOCUMENT_PROCESS_TEMPLATE } from '../../config/urlConfig';
import { Paper as PaperUI } from 'components/LifetekUi';
import { makeSelectMiniActive, makeSelectProfile } from '../Dashboard/selectors';
import { changeSnackbar } from '../Dashboard/actions';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog
} from '@material-ui/core';
import DepartmentSelect from '../../components/DepartmentSelect/CloneDouble'
const tabs = [
  {
    label: 'Văn bản đến',
    value: 'inCommingDocument',
    for: ['DocumentProcessTemplate'],
  },
  {
    label: 'Văn bản đi',
    value: 'outGoingDocument',
    for: ['DocumentProcessTemplate'],
  },
  {
    label: 'Luồng xử lý đơn thư',
    value: 'letter',
    for: ['LetterProcessFlow'],
  },
  {
    label: 'Luồng xử lý công tác',
    value: 'calendar',
    for: ['CalendarProcessFlow'],
  },
  {
    label: 'Kế hoạch cá nhân',
    value: 'planWorkingPerson',
    for: ['PlanProcessTemplate'],
  },
  {
    label: 'Kế hoạch đơn vị',
    value: 'planWorking',
    for: ['PlanProcessTemplate'],
  },
  {
    label: 'Luồng xử lý công việc',
    value: 'task',
    for: ['TaskProcessFlow'],
  }
];
function ProcessFlow(props) {
  const { onChangeSnackbar } = props;
  const [index, setIndex] = useState('');
  const [activeTabs, setActiveTabs] = useState([]);
  const [moduleCode, setModuleCode] = useState('');
  const [selected, setSelected] = useState([]);
  const [canView, setCanView] = useState(false);
  const [openDialog, setOpendialog] = useState(false);
  const [roomApply, setRoomApply] = useState([])
  const [listDer, setListDer] = useState([])
  const [reload, setReload] = useState(false)
  useEffect(() => {

    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    localStorage.removeItem('PlanProcessTemplate');
    localStorage.removeItem('tabFlow');
    localStorage.removeItem('processFlowType');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack');
    localStorage.removeItem('addWorkingScheduleCallback');
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');

    const refs = window.location.href.split('/');

    setModuleCode(refs[refs.length - 1]);
    const newTabs = tabs.filter(t => t.for.find(code => window.location.href && window.location.href.includes(code)));
    setActiveTabs(newTabs);
    if (index === '' && newTabs.length) {
      localStorage.setItem('tabFlow', newTabs[0].value)
      setIndex(newTabs[0].value);
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('tabFlow', index)
  }, [index]);

  useEffect(() => {
    if(props.location && props.location.index){
      setIndex(props.location.index)
    }
  },[])

  const handleChangeTab = (event, newValue) => {
    localStorage.setItem('tabFlow', newValue);
    setIndex(newValue);
  };
  const handleSelectItem = (array) => {
    if (array.length === 1) {
      let result = [...array];
      result = result && result.map(f => f._id);
      setSelected(result);
      // if (result[0] && result[0].applies) setListName(result[0].applies.split(", "))
    }
    if (array.length > 1) {
      setCanView(false);
    }
  }
  const handleChangeSelectActive = useCallback(() => {
    if (selected && selected.length > 0) {
      setOpendialog(true)
      setReload(false)
    }
  }, [selected]);


  const getStateSelection = e => {
    Array.isArray(e) && e.length > 0 ? setCanView(true) : setCanView(false)
  }
  const handleChangeAllowedSellingOrganization = viewedDepartmentIds => {
    setRoomApply(viewedDepartmentIds)
  };
  const handleActive = () => {
    let [item] = selected;
    request(`${API_DOCUMENT_PROCESS_TEMPLATE}/v2/${item}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orgIds: roomApply })
    }).then(res => {
      onChangeSnackbar({ variant: 'success', message: 'Kích hoạt luồng thành công', status: true });
      setOpendialog(false)
      setReload(true)
      if (props.onSuccess) {
        return props.onSuccess();
      }
      props.onClose && props.onClose()
    }).catch(error => {
      onChangeSnackbar({ variant: 'success', message: 'Kích hoạt luồng thất bại', status: true })
    })
  }
  useEffect(() => {
    let array = []
    Array.isArray(listDer) && listDer.length > 0 && listDer.map((el) => {
      array.push(el._id)
    })
    setRoomApply(array)
  }, [listDer])
  const customItem = (array) => {
    let listName = Array.isArray(array) && array.length > 0 && array.map(it => (it ? it.name : null))
      .filter(Boolean)
      .join(', ');
    return listName
  }
  const mapFunction = (item) => {
    return {
      ...item,
      nameOrgs: customItem(item.applies || []),
      isActive: item.isActive === true ? 'Luồng chính' : ''
    }
  }

  function getUrl() {
    const res = window.location.pathname.split('/');
    const path = props.path ? props.path : res[res.length - 1];
    return path;
  }
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => setOpendialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"      >
        <DialogTitle id="alert-dialog-title">Áp dụng cho</DialogTitle>
        <DialogContent>
          <DepartmentSelect
            title=""
            byOrg
            allowedDepartmentIds={roomApply || []}
            onChange={handleChangeAllowedSellingOrganization}
            isMultiple
            customTitle="Áp dụng"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => handleActive()}>
            LƯU
          </Button>
          <Button
            variant="contained"
            color="secondary"
            autoFocus
            onClick={() => setOpendialog(false)}
          >
            HỦY
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <div style={{ zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px', marginTop: 20, paddingLeft: 10 }}>
          <Grid container spacing={16}>
            <Grid item sm="2" style={{ marginTop: 15 }}>
              <VerticalTabs onChange={handleChangeTab} value={index}>
                {activeTabs.map(a => (
                  <VerticalTab label={a.label} value={a.value} />
                ))}
              </VerticalTabs>
            </Grid>
            <Grid item sm="10" style={{ marginTop: 10 }}>
              {canView && (
                <div style={{ textAlign: 'right', padding: '0px 20px' }}>
                  <Button variant='contained' color="primary" onClick={handleChangeSelectActive}> Đặt làm luồng chính</Button>
                </div>
              )}
              <PaperUI style={{ zIndex: '0 !important', padding: '10px 20px' }}>
                <div style={{ zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px' }}>
                  {moduleCode && (
                    <ListPage
                      withPagination
                      getStateSelection={e => getStateSelection(e)}
                      // exportExcel  
                      enableView
                      onSelectCustomers={val => {
                        setListDer(val[0] && val[0].applies ? val[0].applies : [])
                        handleSelectItem(val)
                      }}
                      onEdit={(val) => props.history.push({
                        pathname: `/${getUrl()}/${val._id}`,
                        index: index
                      })}
                      filter={{ type: index }}
                      disableEmployee
                      code={moduleCode}
                      apiUrl={API_DOCUMENT_PROCESS_TEMPLATE}
                      selectMultiple={false}
                      disableDot
                      mapFunction={mapFunction}
                      reload={reload}
                      disableMenuAction
                      isPlanChild
                    />
                  )}
                </div>
              </PaperUI>
            </Grid>
          </Grid>
        </div>
      </div>
    </>

  );
}

ProcessFlow.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  processFlow: makeSelectProcessFlow(),
  miniActive: makeSelectMiniActive(),

  // dashboardPage: makeSelectDashboardPage(),
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

const withReducer = injectReducer({ key: 'processFlow', reducer });
// const withSaga = injectSaga({ key: 'processFlow', saga });

export default compose(
  withReducer,
  // withSaga,
  withConnect,
)(ProcessFlow);
