import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Paper,
  Avatar,
  MenuItem,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Menu,
  InputAdornment,
  Fab,
} from '@material-ui/core';
import dot from 'dot-object';
import { Grid as GridLife, SwipeableDrawer, TextField, Dialog } from 'components/LifetekUi';
import { Assignment, Work, FilterList, Archive } from '@material-ui/icons';
import AddProjects from 'containers/AddProjects';
import CustomButton from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { taskStatusArr, taskStageArr } from 'variable';
import { Link } from 'react-router-dom';
import makeSelectTotalTask from './selectors';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData, deleteTasks, getTasks, addBoAction, getTasksForTimeManagement } from './actions';
import { API_TASK_ACCEPT, API_TASK_PROJECT } from '../../config/urlConfig';
import List from '../../components/List/ListTask';
import { injectIntl } from 'react-intl';
import { changeSnackbar } from '../Dashboard/actions';
import { getCurrentUrl } from '../../utils/common';
import DepartmentAndEmployee from '../../components/Filter/DepartmentAndEmployee';
import messages from './messages';
// import { makeSelectMiniActive } from '../Dashboard/selectors';
import GridItem from 'components/Grid/ItemGrid';
import _ from 'lodash';
import request from '../../utils/request';
import CustomInputBase from '../../components/Input/CustomInputBase';

const Process = props => (
  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 22, width: '100%', position: 'relative' }}>
    <div
      style={{
        width: `${props.value}%`,
        background: `${props.color2}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    />
    <div
      style={{
        width: `${100 - props.value}%`,
        background: `${props.color}`,
        height: '100%',
        animation: '2s alternate slidein',
      }}
    />
    <span style={{ fontSize: 12, marginLeft: 3, color: '#e0e0e0', position: 'absolute' }}>
      {props.progress}
      %- {props.time}
      {/* ngày */}
    </span>
  </div>
);

//

const GridList = React.memo(
  ({
    reload,
    openTask,
    filter,
    openBusiness,
    addFunction,
    modalRequiredFilter,
    modalFilter,
    disableAdd,
    disableImport,
    openTitleDialog,
    openEditDialog,
    tabType,
    openonAgreeDialog,
    openonDelteDialog,
    tab,
    reloadCount,
  }) => {
    const { isProject, ...rest } = filter;

    const mapTask = item => {
      const taskStt = JSON.parse(localStorage.getItem('taskStatus'));
      const taskType = taskStt && taskStt.find(item => item.code === 'TASKTYPE').data;
      const mapTypeTask = cate => {
        const data = taskType && taskType.find(item => item.type == cate);
        return data && data.name;
      };
      const statusAcceptFm = JSON.parse(localStorage.getItem('viewConfig'));
      const taskTypeFm =
        statusAcceptFm &&
        statusAcceptFm.find(item => item.code === 'Task').listDisplay.type.fields.type.columns.find(i => i.name === 'statusAccept').menuItem;
      const mapStatusAccept = cate => {
        const data = taskTypeFm && taskTypeFm.find(item => item.type == cate);
        return data && data.name;
      };
      const dataSource = JSON.parse(localStorage.getItem('crmSource'));
      const dataValSource = dataSource && dataSource.find(item => item.code === 'S301');
      const dataVal = dataValSource ? dataValSource.data : [];
      const mapTaskLevel = cate => {
        const data = dataVal && dataVal.find(item => item.value == cate);
        return data && data.title;
      };
      return {
        ...item,
        // parentId: item.parentId ? item['parentId.name'] : null,
        // name: (
        //   <button onClick={() => openTask(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
        //     {item.name}
        //   </button>
        // ),

        avatar: <Avatar src={`${item.avatar}?allowDefault=true`} />,
        progress: (
          <Process
            value={item.progress}
            progress={item.progress}
            color={colorProgress(item)}
            time={ProcessTask(item)}
            color2={color2Progress(item)}
          />
        ),
        note: (
          <Tooltip title={item.note || null}>
            <p>{item.note || null}</p>
          </Tooltip>
        ),
        planApproval:
          item.planApproval === 1 ? (
            <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã phê duyệt kế hoạch</p>
          ) : item.planApproval === 2 ? (
            <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Không phê duyệt kế hoạch</p>
          ) : item.planApproval === 3 ? (
            <p style={{ color: 'rgb(214, 129, 11)', fontWeight: 'bold' }}>Chờ phê duyệt kế hoạch</p>
          ) : (
            <p style={{ color: 'rgb(52, 11, 214)', fontWeight: 'bold' }}>Chưa phê duyệt kế hoạch</p>
          ),
        template: item.templateName,
        acceptApproval:
          item.acceptApproval === 1 ? (
            <p style={{ color: '#18ed00', fontWeight: 'bold' }}>Đã phê duyệt nghiệm thu </p>
          ) : item.acceptApproval === 2 ? (
            <p style={{ color: '#ed0000', fontWeight: 'bold' }}>Không phê duyệt nghiệm thu</p>
          ) : item.acceptApproval === 3 ? (
            <p style={{ color: 'rgb(214, 129, 11)', fontWeight: 'bold' }}>Chờ phê duyệt nghiệm thu</p>
          ) : (
            <p style={{ color: 'rgb(52, 11, 214)', fontWeight: 'bold' }}>Chưa phê duyệt nghiệm thu</p>
          ),
        approvedProgress: item['approvedProgress.name'],
        support: item.support,
        taskStage: taskStageArr[item.taskStage - 1],
        customer: item['customer.name'],
        createdBy: item['createdBy.name'],
        businessOpportunities: item['businessOpportunities.name'],
        exchangingAgreement: item['exchangingAgreement.name'],
        taskStatus: taskStatusArr[item.taskStatus - 1],
        type: item.type === 1 ? 'Nhóm bảo mật' : item.type === 4 ? 'Nhóm công khai' : item.type === 2 ? 'Nhóm ẩn' : 'Nhóm mở rộng',
        priority:
          item.priority === 1
            ? 'Rất cao'
            : item.priority === 2
              ? 'Cao'
              : item.priority === 3
                ? 'Trung bình'
                : item.priority === 4
                  ? 'Thấp'
                  : 'Rất thấp',
        organizationUnit: item.organizationUnitName || item.organizationUnit,
        taskType: item.taskType === 1 ? 'Công việc' : item.taskType === 2 ? 'Công việc không doanh thu' : 'Công việc cá nhân',
        typeTask: mapTypeTask(item.typeTask),
        statusAccept: mapStatusAccept(item.statusAccept),
        taskLevel: mapTaskLevel(item.taskLevel),
      };
    };
    // const setPage = (page) => {
    //   // this.page = page
    //   this.setState({page})
    // }
    return (
      <GridLife item md={12}>

        {tab === 5 ? (
          <List
            onRowClick={item => openTitleDialog(item._id)}
            onEdit={row => {
              openEditDialog(row._id);
            }}
            showDepartmentAndEmployeeFilter
            columnExtensions={[{ columnName: 'name', width: 300 }, { columnName: 'edit', width: 150 }, { columnName: 'progress', width: 180 }]}
            tree
            reload={reload}
            // addFunction={addFunction}
            apiUrl={
              tabType === 'assignTask'
                ? `${API_TASK_PROJECT}/projects`
                : tabType === 'inCharge' || tabType === 'support'
                  ? `${API_TASK_PROJECT}`
                  : `${API_TASK_PROJECT}`
            }
            code="Task"
            exportExcel
            kanban="KANBAN"
            status="taskStatus"
            mapFunction={mapTask}
            // customExport={customExport}
            modalRequiredFilter={modalRequiredFilter}
            modalFilter={modalFilter}
            addChildTask
            perPage={50}
            filter={rest}
            // isAccept={tabType === "inCharge" ? "incharge" : tabType === "support" ? "support" : null}
            tabType={tabType}
            extraMenu={openBusiness}
            disableAdd={disableAdd}
            disableImport={disableImport}
            notParentId={tabType === 'inCharge' || tabType === 'support' ? true : null}
            // setPage={setPage}
            onAgree={(tabType, row) => {
              openonAgreeDialog(tabType, row);
            }}
            offAccept={(tabType, row) => {
              openonDelteDialog(tabType, row);
            }}
            disableOneEdit={tabType === 'inCharge' || tabType === 'support' ? true : null}
            disableSelect
            reloadCount={data => {
              // console.log('data', data);
              reloadCount(data);
            }}
          />
        ) : null}
        {tab === 0 ? (
          <List
            onRowClick={item => openTitleDialog(item._id)}
            onEdit={row => {
              openEditDialog(row._id);
            }}
            showDepartmentAndEmployeeFilter
            columnExtensions={[{ columnName: 'name', width: 300 }, { columnName: 'edit', width: 150 }, { columnName: 'progress', width: 180 }]}
            tree
            reload={reload}
            // addFunction={addFunction}
            apiUrl={
              tabType === 'assignTask'
                ? `${API_TASK_PROJECT}/projects`
                : tabType === 'inCharge' || tabType === 'support'
                  ? `${API_TASK_PROJECT}`
                  : `${API_TASK_PROJECT}`
            }
            code="Task"
            exportExcel
            kanban="KANBAN"
            status="taskStatus"
            mapFunction={mapTask}
            // customExport={customExport}
            modalRequiredFilter={modalRequiredFilter}
            modalFilter={modalFilter}
            addChildTask
            perPage={50}
            filter={tabType === 'assignTask' ? { ...rest, isProject: true } : { ...rest }}
            isAccept={tabType === 'inCharge' ? 'incharge' : tabType === 'support' ? 'support' : null}
            tabType={tabType}
            extraMenu={openBusiness}
            disableAdd={disableAdd}
            disableImport={disableImport}
            notParentId={tabType === 'inCharge' || tabType === 'support' ? true : null}
            // setPage={setPage}
            onAgree={(tabType, row) => {
              openonAgreeDialog(tabType, row);
            }}
            offAccept={(tabType, row) => {
              openonDelteDialog(tabType, row);
            }}
            // addIcon
            disableOneEdit={tabType === 'inCharge' || tabType === 'support' ? true : null}
            reloadCount={data => {
              //console.log('data', data);
              reloadCount(data);
            }}
            noSlice={true}
          />
        ) : null}
        {/* hoàn thành */}
        {tab === 6 ? (
          <List
            onRowClick={item => openTitleDialog(item._id)}
            onEdit={row => {
              openEditDialog(row._id);
            }}
            showDepartmentAndEmployeeFilter
            columnExtensions={[{ columnName: 'name', width: 300 }, { columnName: 'edit', width: 150 }, { columnName: 'progress', width: 180 }]}
            tree
            reload={reload}
            // addFunction={addFunction}
            apiUrl={
              tabType === 'assignTask'
                ? `${API_TASK_PROJECT}/projects`
                : tabType === 'inCharge' || tabType === 'support'
                  ? `${API_TASK_PROJECT}`
                  : `${API_TASK_PROJECT}`
            }
            code="Task"
            exportExcel
            kanban="KANBAN"
            status="taskStatus"
            mapFunction={mapTask}
            // customExport={customExport}
            modalRequiredFilter={modalRequiredFilter}
            modalFilter={modalFilter}
            addChildTask
            perPage={50}
            filter={rest}
            // isAccept={tabType === 'inCharge' ? 'incharge' : tabType === 'support' ? 'support' : null}
            tabType={tabType}
            extraMenu={openBusiness}
            disableAdd={disableAdd}
            disableImport={disableImport}
            notParentId={tabType === 'inCharge' || tabType === 'support' ? true : null}
            // setPage={setPage}
            // onAgree={(tabType, row) => {
            //   openonAgreeDialog(tabType, row);
            // }}
            // offAccept={(tabType, row) => {
            //   openonDelteDialog(tabType, row);
            // }}
            // addIcon
            disableOneEdit={tabType === 'inCharge' || tabType === 'support' ? true : null}
            reloadCount={data => {
              // console.log('data', data);
              reloadCount(data);
            }}
            disableSelect
            disableExport
          />
        ) : null}
      </GridLife>
    );
  },
);

function colorProgress(item) {
  let color;
  if (item.finishDate) {
    color = new Date(item.finishDate) > new Date(item.endDate) ? '#fa0522' : '#009900';
  } else {
    color = new Date(item.endDate) >= new Date() ? '#056ffa' : '#f00707';
  }

  return color;
}

function color2Progress(item) {
  let color2;
  if (item.finishDate) {
    color2 = new Date(item.finishDate) > new Date(item.endDate) ? '#f28100' : '#009900';
  } else {
    color2 = new Date(item.endDate) >= new Date() ? '#05c9fa' : '#6e1305';
  }

  return color2;
}

function ProcessTask(item) {
  let date;
  let total;
  if (item.finishDate) {
    if (new Date(item.finishDate) > new Date(item.endDate)) {
      date = ((new Date(item.finishDate) - new Date(item.endDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Trễ ${date3} ngày ${date4} giờ`;
    } else {
      date = ((new Date(item.endDate) - new Date(item.finishDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Sớm ${date3} ngày ${date4} giờ`;
    }
  } else {
    if (new Date(item.endDate) > new Date()) {
      date = ((new Date(item.endDate) - new Date()) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Còn ${date3} ngày ${date4} giờ`;
    } else {
      date = ((new Date() - new Date(item.endDate)) / 3600000).toFixed(2);
      const date2 = Number(date) / 24;
      const date3 = Math.floor(date2);
      const date4 = Number(((date2 - date3) * 24).toFixed());
      total = `Quá ${date3} ngày ${date4} giờ`;
    }
  }

  return total;
}

export class TotalTask extends React.Component {
  state = {
    open: false,
    data: {},
    reload: 0,
    crmStatusSteps: [],
    editDialog: false,
    hasPermissionViewConfig: false,
    addTaskAnchorEl: null,
    openDialogFilter: false,
    categoryTaskArr: [],
    exportAnchor: null,
    openExport: null,
    html: [],
    htmlTotal: 0,
    queryFilter: null,
    dialogAllFilter: false,
    windowHeight: null,
    windowWidth: null,
    agreeFilter: false,
    timeFilter: 0,
    openInCharge: false,
    dataInCharge: [],
    textInCharge: '',
    openDelete: false,
    note: '',
  };
  handleResize = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });
  };
  componentDidMount() {
    try {
      const { dashboardPage } = this.props;
      let currentRole;
      if (dashboardPage.role.roles) {
        currentRole = dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.collectionCode);
      }
      let functionAllow = [];
      if (currentRole) {
        functionAllow = currentRole.methods.filter(item => item.allow).map(item => item.name);
      }
      if (functionAllow.includes('VIEWCONFIG')) {
        this.state.hasPermissionViewConfig = true;
      } else {
        this.state.hasPermissionViewConfig = false;
      }
    } catch (error) {
      // ignore error
    }
    this.props.getTasks();
    const a = localStorage.getItem('taskChildAddCallBack');

    const b = localStorage.getItem('taskChildEditCallBack');
    if ((a !== null && a) || (b !== null && b)) {
      this.props.mergeData({ tab: Number(a) || Number(b) });
    } else {
      this.props.mergeData({ tab: 0 });
    }

    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));

    const currentCrmStatus = listCrmStatus ? listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST01')] : null;
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus &&
      currentCrmStatus.data.forEach(item => {
        switch (item.code) {
          case 1:
            laneStart.push(item);
            break;
          case 2:
            laneAdd.push(item);
            break;

          case 3:
            laneSucces.push(item);
            break;

          case 4:
            laneFail.push(item);
            break;

          default:
            break;
        }
      });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    const categoryTaskArr = JSON.parse(localStorage.getItem('taskStatus')).find(item => item.code === 'TASKTYPE').data;
    this.setState({ crmStatusSteps: sortedKanbanStatus, categoryTaskArr });
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    //console.log('11');
    this.reloadState();
  }
  mergeData = data => {
    this.props.mergeData(data);
  };

  addItem = (type, code) => {
    this.setState({ data: { planerStatus: type, taskStatus: code, isProject: false, kanbanStatus: code }, open: true, id: 'add' });
  };

  onAddFunctionClick = e => {
    // this.setState({ addTaskAnchorEl: e.target });
    this.openCreateTask();
  };

  openCreateTask = () => {
    this.setState({ open: true, addTaskAnchorEl: null, data: { taskType: 1, isProject: false } });
  };

  callbackTask = () => {
    const { reload } = this.state;
    this.setState({ reload: reload + 1, open: false });
  };

  openTask = id => {
    this.setState({ id, editDialog: true });
  };

  reloadState = () => {
    fetch(`${API_TASK_PROJECT}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ data: data.data });
      });
    this.setState({ reload: new Date() * 1 });
  };

  openTitleDialog = id => {
    //console.log('this.props',this.props)
    // localStorage.setItem('IncommingDocumentProcess', JSON.stringify(selectedProcess));
    const { history } = this.props;
    history.push(`Task/task-detail/${id}`);
  };

  openEditDialog = id => {
    //console.log('this.props',this.props)
    // localStorage.setItem('IncommingDocumentProcess', JSON.stringify(selectedProcess));
    const { history } = this.props;
    history.push(`Task/${id}`);
  };

  openonAgreeDialog = (key, ids) => {
    this.setState({ openInCharge: true, dataInCharge: ids, textInCharge: key, note: '' });
  };

  saveAgree = () => {
    const { dataInCharge, textInCharge, note } = this.state;
    request(`${API_TASK_ACCEPT}/${textInCharge}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: dataInCharge, action: true, note }),
    })
      .then(response => response.data)
      .then(async res => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Chấp nhận thành công', status: true });
        this.setState({ openInCharge: false });
        this.reloadState();
      })
      .catch(error => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Chấp nhận thất bại', status: false });
      });
  };

  openonDelteDialog = (key, ids) => {
    this.setState({ openDelete: true, dataInCharge: ids, textInCharge: key, note: '' });
  };

  getCountProjects = () => {
    const apiUrl = `${API_TASK_PROJECT}/count`;
    fetch(`${apiUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(response => response.json());
  };

  saveDelete = () => {
    const { dataInCharge, textInCharge, note } = this.state;
    request(`${API_TASK_ACCEPT}/${textInCharge}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: dataInCharge, action: false, note }),
    })
      .then(response => response.data)
      .then(async res => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Từ chối thành công', status: true });
        this.setState({ openDelete: false });
        this.reloadState();
        this.getCountProjects();
        this.props.reloadCount('reload');
      })
      .catch(error => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Từ chối thất bại', status: false });
      });
  };

  closeDrawer = () => {
    this.setState({ open: false });
  };

  handleEmployees = value => {
    this.props.mergeData({
      employee: value,
      filter: {
        $or: [
          { createdBy: value._id ? value._id : '' },
          { inCharge: { $in: value._id ? value._id : '' } },
          { viewable: { $in: value._id ? value._id : '' } },
          { support: { $in: value._id ? value._id : '' } },
          { join: { $in: value._id ? value._id : '' } },
        ],
      },
    });
  };

  handleChange = (name, value) => {
    this.props.mergeData({ [name]: value });
  };

  findChildren(data) {
    const newData = data.filter(item => item.parent === null);
    this.getLevel(newData, 0);
    return newData;
  }

  getLevel(arr, lvl) {
    arr.forEach(item => {
      item.level = lvl;
      if (item.child) {
        this.getLevel(item.child, lvl + 1);
      }
    });
  }

  mapItem(array, result = []) {
    array.forEach(item => {
      result.push(
        <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
          {item.name}
        </MenuItem>,
      );
      if (item.child) this.mapItem(item.child, result);
    });
    return result;
  }

  handleDepartment = e => {
    if (e.target.value === 0) {
      this.props.mergeData({
        department: e.target.value,
        filter: {
          isProject: false,
        },
      });
    } else if (e.target.value === 'gantt') {
      this.props.mergeData({
        department: e.target.value,
        filter: {
          organizationUnit: e.target.value,
        },
      });
    } else {
      this.props.mergeData({
        department: e.target.value,
        filter: {
          organizationUnit: e.target.value,
        },
      });
    }
  };

  handleDepartmentAndEmployeeChange = data => {
    const { department, employee } = data;
    this.props.mergeData({
      department,
      employee,
    });
  };

  openBusiness = () => <MenuItem onClick={this.handleDialogBusiness}>Thêm cơ hội kinh doanh</MenuItem>;

  handleDialogBusiness = () => {
    this.props.mergeData({ openDialog: true });
  };

  handleCloseDialog = () => {
    this.props.mergeData({ openDialog: false });
  };

  callBackBos = (cmd, data) => {
    this.props.onAddBo(dot.object(data));
    this.props.mergeData({ openDialog: false });
  };

  checkItem(ft) {
    if (!ft.taskManager) delete ft.taskManager;
    if (!ft.inCharge) delete ft.inCharge;
    if (!ft.join) delete ft.join;
    if (!ft.support) delete ft.support;
    if (!ft.viewable) delete ft.viewable;
    if (!ft.approved) delete ft.approved;
    if (!ft.type) delete ft.type;

    return ft;
  }

  checkDate(ft) {
    if (!ft.startDate) delete ft.startDate;
    if (!ft.endDate) delete ft.endDate;
    if (!ft.category) delete ft.category;
    return ft;
  }

  changeSearch = e => {
    const filter = { ...this.props.totalTask.filter };
    const searchClient = e.target.value;
    if (searchClient) {
      filter.name = { $regex: searchClient, $options: 'gi' };
    } else delete filter.name;
    this.props.mergeData({ filter });
  };
  exportTable = queryFilter => {
    this.setState({ queryFilter: queryFilter });
    return (
      <Tooltip title="Xuất dữ liệu">
        <Archive onClick={e => this.setState({ exportAnchor: e.currentTarget })} />
      </Tooltip>
    );
  };

  filterAdvanced = () => {
    const { search, categoryCurrent, startDate1, startDate2, endDate2, endDate1 } = this.props.totalTask;
    const { profile } = this.props.dashboardPage;
    let ft;
    switch (search) {
      case 0:
        ft = this.checkDate({
          isProject: false,
          category: categoryCurrent !== 0 ? categoryCurrent : '',
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 1:
        ft = this.checkDate({
          category: categoryCurrent !== 0 ? categoryCurrent : '',
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
          taskStatus: 2,
          isProject: false,
          $or: [
            { createdBy: profile._id ? profile._id : '' },
            { inCharge: { $in: profile._id ? profile._id : '' } },
            { viewable: { $in: profile._id ? profile._id : '' } },
            { join: { $in: profile ? profile._id : '' } },
            { support: { $in: profile._id ? profile._id : '' } },
          ],
        });
        this.props.mergeData({ filter: ft });
        break;
      case 2:
        ft = this.checkDate({
          support: profile._id ? profile._id : '',
          isProject: false,
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });
        break;
      case 3:
        ft = this.checkDate({
          createdBy: profile._id ? profile._id : '',
          isProject: false,
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 4:
        ft = this.checkDate({
          viewable: profile._id ? profile._id : '',
          isProject: false,
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 5:
        ft = this.checkDate({
          state: '0',
          isProject: false,
          $or: [
            { createdBy: profile ? profile._id : '' },
            { inCharge: { $in: profile ? profile._id : '' } },
            { viewable: { $in: profile ? profile._id : '' } },
            { join: { $in: profile ? profile._id : '' } },
            { support: { $in: profile ? profile._id : '' } },
          ],
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 6:
        ft = this.checkDate({
          isProject: false,
          taskStatus: 3,
          $or: [
            { createdBy: profile ? profile._id : '' },
            { inCharge: { $in: profile ? profile._id : '' } },
            { viewable: { $in: profile ? profile._id : '' } },
            { join: { $in: profile ? profile._id : '' } },
            { support: { $in: profile ? profile._id : '' } },
          ],

          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 7:
        ft = this.checkDate({
          taskStatus: { $not: { $eq: 3 } },
          endDate:
            endDate1 !== '' && endDate2 !== ''
              ? { $lt: new Date().toISOString(), $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() }
              : { $lt: new Date().toISOString() },
          isProject: false,
          $or: [
            { createdBy: profile._id ? profile._id : '' },
            { inCharge: { $in: profile._id ? profile._id : '' } },
            { viewable: { $in: profile._id ? profile._id : '' } },
            { join: { $in: profile ? profile._id : '' } },
            { support: { $in: profile._id ? profile._id : '' } },
          ],

          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
        });

        this.props.mergeData({ filter: ft });

        break;
      case 8:
        ft = this.checkDate({
          isProject: false,
          $or: [
            { createdBy: profile._id ? profile._id : '' },
            { inCharge: { $in: profile._id ? profile._id : '' } },
            { viewable: { $in: profile._id ? profile._id : '' } },
            { join: { $in: profile ? profile._id : '' } },
            { support: { $in: profile._id ? profile._id : '' } },
          ],
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });
        this.props.mergeData({ filter: ft });
        break;
      case 9:
        ft = this.checkDate({
          isProject: false,
          inCharge: { $in: profile._id ? profile._id : '' },
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });
        this.props.mergeData({ filter: ft });
        break;
      case 10:
        ft = this.checkDate({
          isProject: false,
          join: { $in: profile ? profile._id : '' },
          category: categoryCurrent,
          startDate:
            startDate1 !== '' && startDate2 !== '' ? { $gte: new Date(startDate1).toISOString(), $lte: new Date(startDate2).toISOString() } : '',
          endDate: endDate1 !== '' && endDate2 !== '' ? { $gte: new Date(endDate1).toISOString(), $lte: new Date(endDate2).toISOString() } : '',
        });
        this.props.mergeData({ filter: ft });
        break;
      default:
        break;
    }
    this.setState({
      openDialogFilter: false,
    });
  };

  handleCloseEdit = () => {
    this.setState({ editDialog: false });
  };
  componentDidUpdate(preProps, preState) {
    const { html, htmlTotal, openImport, reload, search, filters } = this.state;
    const { tab } = this.props.totalTask;
    localStorage.setItem('TaskTab', JSON.stringify({ tab: this.props.tabType, tabChild: tab }));

    if ((html.length > 0) & (htmlTotal !== 0)) {
      if (html.length === htmlTotal) {
        for (let index = 0; index < htmlTotal; index++) {
          const win = window.open();
          win.document.write(html[index].content);
          win.document.close();
          win.print();
        }
        this.setState({ html: [], htmlTotal: 0 });
      }
    }

    if (preState.openImport && !openImport) {
      this.setState({ reload: reload + 1 });
    }
  }

  // handleCloseExportTable = payload => {
  //   const { openExport } = this.state;
  //   if (payload && payload.lastPage) this.setState({ openExport: null });

  //   if (payload && payload.error) {
  //     if (payload.res && payload.res.message) {
  //       const { message } = payload.res;
  //       this.props.onChangeSnackbar({ status: true, message, variant: 'error' });
  //     } else this.props.onChangeSnackbar({ status: true, message: 'Có lỗi xảy ra', variant: 'error' });
  //     return;
  //   }

  //   switch (openExport) {
  //     case 'PDF':
  //       const { totalPage = 1, pageNumber = 1 } = payload || {};
  //       const content = tableToPDF('excel-table-task', 'Task');
  //       this.setState({ html: [...this.state.html, { content, pageNumber }], htmlTotal: totalPage });
  //       break;
  //     default:
  //       tableToExcel('excel-table-task', 'W3C Example Table', 'Task');
  //   }
  // };

  callbackSaveTask = () => {
    const { reload } = this.state;
    this.setState({ reload: reload + 1, open: false });
  };

  handleChangeTab(tabBt) {
    this.setState({ timeFilter: tabBt });
  }
  modalRequiredFilter = () => {
    const { employee, department, profile } = this.props;
    return (
      <div style={{ width: '30em' }}>
        <DepartmentAndEmployee
          onChange={this.handleDepartmentAndEmployeeChange}
          employee={employee}
          department={department}
          moduleCode="Task"
          profile={profile}
          fullWidth
        />
      </div>
    );
  };
  onSaveDialog = () => {
    this.handleChange('searchTime', this.state.timeFilter);
    const { roleTask, profile } = this.props.dashboardPage;
    const bussines = roleTask.roles ? roleTask.roles.find(elm => elm.code === 'BUSSINES').data : [];
    const extra = roleTask.roles ? roleTask.roles.find(elm => elm.code === 'EXTRA').data : [];
    const hideTask = roleTask.roles ? extra.find(elm => elm.name === 'hide').data : false;
    const protectedTask = roleTask.roles ? extra.find(elm => elm.name === 'protected').data : false;
    const publicTask = roleTask.roles ? extra.find(elm => elm.name === 'public').data : false;
    const openTask = roleTask.roles ? extra.find(elm => elm.name === 'open').data : false;

    const taskManager = roleTask.roles ? bussines.find(elm => elm.name === 'taskManager').data : false;
    const taskInCharge = roleTask.roles ? bussines.find(elm => elm.name === 'inCharge').data : false;
    const taskSupport = roleTask.roles ? bussines.find(elm => elm.name === 'support').data : false;
    const taskViewable = roleTask.roles ? bussines.find(elm => elm.name === 'viewable').data : false;
    const taskJoin = roleTask.roles ? bussines.find(elm => elm.name === 'join').data : false;
    let time;
    const today = new Date();
    // // GET ngay
    // const interval = 1000 * 60 * 60 * 24;
    // const dayst = Math.floor(Date.now() / interval) * interval;
    // const startOfDay = new Date(dayst).toISOString();
    // const dayen = new Date(dayst + interval - 1);
    // const endOfDay = new Date(dayen).toISOString();

    // Get tuần
    const first = today.getDate() - today.getDay() + 1; // First day is the day of the month - the day of the week
    const last = first + 6; // last day is the first day + 6
    const firstday = new Date(new Date().setDate(first)).toISOString();
    const lastday = new Date(new Date().setDate(last)).toISOString();
    // GET tháng
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString();

    // GET Quý

    const quarter = Math.floor(today.getMonth() / 3);
    const startFullQuarter = new Date(today.getFullYear(), quarter * 3, 1);
    const endFullQuarter = new Date(startFullQuarter.getFullYear(), startFullQuarter.getMonth() + 3, 1);
    this.setState({ agreeFilter: true, dialogAllFilter: false, timeFilter: 0 });
    switch (this.state.timeFilter) {
      case 0:
        time = this.props.mergeData({
          filter: {
            isProject: false,
          },
        });
        break;
      case 1:
        time = this.props.mergeData({
          filter: {
            isProject: false,
            endDate: { $lte: lastday, $gte: firstday },
            // $or: [
            //   { createdBy: profile._id },

            //   this.checkItem({ taskManager: taskManager.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ inCharge: taskInCharge.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ join: taskJoin.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ support: taskSupport.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ viewable: taskViewable.view === true ? { $in: [profile._id] } : '' }),
            // ],
          },
        });
        break;
      case 2:
        time = this.props.mergeData({
          filter: {
            isProject: false,
            endDate: { $lte: lastDay, $gte: firstDay },
            // $or: [
            //   { createdBy: profile._id },
            //   this.checkItem({ type: hideTask.view === true ? 2 : '' }),
            //   this.checkItem({ type: protectedTask.view === true ? 1 : '' }),
            //   this.checkItem({ type: publicTask.view === true ? 4 : '' }),
            //   this.checkItem({ type: openTask.view === true ? 3 : '' }),
            //   this.checkItem({ taskManager: taskManager.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ inCharge: taskInCharge.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ join: taskJoin.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ support: taskSupport.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ viewable: taskViewable.view === true ? { $in: [profile._id] } : '' }),
            // ],
          },
        });
        break;
      case 3:
        time = this.props.mergeData({
          filter: {
            isProject: false,
            endDate: { $lte: endFullQuarter.toISOString(), $gte: startFullQuarter.toISOString() },
            // $or: [
            //   { createdBy: profile._id },

            //   this.checkItem({ taskManager: taskManager.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ inCharge: taskInCharge.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ join: taskJoin.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ support: taskSupport.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ viewable: taskViewable.view === true ? { $in: [profile._id] } : '' }),
            // ],
          },
        });
        break;
      case 4:
        time = this.props.mergeData({
          filter: {
            isProject: true,
            // $or: [
            //   { createdBy: profile._id },

            //   this.checkItem({ taskManager: taskManager.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ inCharge: taskInCharge.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ join: taskJoin.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ support: taskSupport.view === true ? { $in: [profile._id] } : '' }),
            //   this.checkItem({ viewable: taskViewable.view === true ? { $in: [profile._id] } : '' }),
            // ],
          },
        });
        break;
      default:
        break;
    }
    return time;
  };
  modalFilter = (intl, totalTask, tab) => (
    <React.Fragment>
      <Fab
        onClick={() => this.setState({ dialogAllFilter: true, timeFilter: null })}
        color="primary"
        style={{ marginLeft: 15, width: 40, height: 40, minWidth: 40 }}
      >
        <Tooltip title="Xem thêm filter">
          <FilterList />
        </Tooltip>
      </Fab>
      <Dialog
        onClose={() => this.setState({ dialogAllFilter: false })}
        onSave={this.onSaveDialog}
        saveText="ĐỒNG Ý"
        open={this.state.dialogAllFilter}
      >
        {document.documentElement.clientWidth <= 1285 ? (
          <GridItem>
            <p style={{ marginBottom: 0 }}>LỌC THEO PHÒNG BAN</p>
            {this.modalRequiredFilter()}
          </GridItem>
        ) : null}
        <GridItem>
          <p style={{ marginBottom: 0 }}>LỌC THEO TÊN DỰ ÁN</p>
          {this.modalProjectName(intl)}
        </GridItem>
        <GridItem>
          <p style={{ marginBottom: 0 }}>LỌC THEO THỜI GIAN TẠO</p>
          {this.modalSelectField(intl, totalTask)}
        </GridItem>
      </Dialog>
    </React.Fragment>
  );
  modalProjectName = intl => (
    <div style={{ display: 'flex' }}>
      <TextField
        label={intl.formatMessage(messages.projectname || { id: 'projectname' })}
        // style={{ marginLeft: 15 }}
        placeholder={intl.formatMessage(messages.seaching || { id: 'searching' })}
        onChange={this.changeSearch}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment style={{ cursor: 'pointer' }} position="end">
              <FilterList color="primary" onClick={() => this.setState({ openDialogFilter: true })} />{' '}
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
  modalSelectField = (intl, totalTask) => (
    <TextField
      value={this.state.timeFilter || totalTask.searchTime}
      fullWidth
      // style={{ marginLeft: 15 }}
      select
      onChange={val => {
        this.handleChangeTab(val.target.value);
      }}
    >
      <MenuItem value={0}>{intl.formatMessage(messages.selected || { id: 'selected' })}</MenuItem>
      <MenuItem value={1}>{intl.formatMessage(messages.week || { id: 'week' })}</MenuItem>
      <MenuItem value={2}>{intl.formatMessage(messages.month || { id: 'month' })}</MenuItem>
      <MenuItem value={3}>{intl.formatMessage(messages.quarter || { id: 'quarter' })}</MenuItem>
      <MenuItem value={4}>Dự án</MenuItem>
    </TextField>
  );

  render() {
    const { totalTask, profile, miniActive, tabType, history } = this.props;
    const { tab, tasks, employee, filter, department, openDialog, isEditting, editData, approvedGroups, taskType } = totalTask;
    const { open, data, id, reload, editDialog, exportAnchor, openInCharge, openDelete, note } = this.state;

    const ROLES = _.get(this, 'props.dashboardPage.roleTask.roles', []);
    const extra = (ROLES.find(elm => elm.code === 'EXTRA') || {}).data || [];
    const hideTask = (extra.find(elm => elm.name === 'hide') || {}).data || {};
    const protectedTask = (extra.find(elm => elm.name === 'protected') || {}).data || {};
    const publicTask = (extra.find(elm => elm.name === 'public') || {}).data || {};
    const openTask = (extra.find(elm => elm.name === 'open') || {}).data || {};
    const employeeId = employee ? employee._id : '';

    const addProject = ROLES.find(item => item.code === 'SPECIALL');
    const roleModuleAddProject = addProject && addProject.data ? addProject.data : [];
    const roleModuleAddProjectData = (roleModuleAddProject.find(elm => elm.name === 'add') || {}).data || {};

    const { department: departmentId, organizationUnit, ...rest } = filter;
    let or = [
      this.checkItem({ type: hideTask.view === true ? 2 : '' }),
      this.checkItem({ type: protectedTask.view === true ? 1 : '' }),
      this.checkItem({ type: publicTask.view === true ? 4 : '' }),
      this.checkItem({ type: openTask.view === true ? 3 : '' }),
    ];
    if (employeeId) {
      or = [{ createdBy: employeeId }, { taskManager: employeeId }, { inCharge: employeeId }, { join: employeeId }, { support: employeeId }];
    }

    let tabTypeFilter = {};
    if (profile && profile._id) {
      if (tabType === 'assignTask') {
        tabTypeFilter.createdBy = profile._id;
        // $ne: [profile._id]
        tabTypeFilter = {
          createdBy: profile._id,
          statusAccept: { $ne: 'success' },
        };
      }

      if (tab === 5 && tabType === 'inCharge') {
        tabTypeFilter.inChargeRefuse = {
          $in: [profile._id],
        };
      } else {
        if (tabType === 'inCharge') {
          tabTypeFilter.inCharge = {
            $in: [profile._id],
          };
        }
      }

      if (tab === 5 && tabType === 'support') {
        tabTypeFilter.supportRefuse = { $in: [profile._id] };
      } else {
        if (tabType === 'support') {
          tabTypeFilter.support = { $in: [profile._id] };
        }
      }

      if (tab === 6) {
        // tabTypeFilter.statusAccept = 'success';
        tabTypeFilter.statusAccept = { $in: ['success', 'noComplete'] }
      }
    }
    const newFilter = {
      ...rest,
      $or: or,
      ...tabTypeFilter,
    };
    if (department) {
      newFilter.organizationUnit = department;
    }

    const { intl } = this.props;
    const Bt = props => (
      <CustomButton
        onClick={() => {
          this.props.mergeData({ tab: props.tab });
          if (props.tab === 3) {
            this.props.onGetTasksForTimeManagement();
          }
        }}
        {...props}
        color={props.tab === tab ? 'gradient' : 'simple'}
        right
        round
        size="sm"
      >
        {props.children}
      </CustomButton>
    );
    return (
      <Paper>
        <GridLife container style={{ justifyContent: 'flex-end' }}>
          <GridLife item md={12}>
            {/* <Bt tab={4}> Bảng tự động hóa</Bt> */}
            {/* <Bt tab={3}>{intl.formatMessage(messages.timemanagement || { id: 'timemanagement' })}</Bt> */}
            {/* <Bt tab={2}> {intl.formatMessage(messages.grattchar || { id: 'grattchar' })}</Bt> */}
            {/* <Bt tab={1}> {intl.formatMessage(messages.plan || { id: 'plan' })}</Bt> */}
            {/* <Bt tab={5}> {intl.formatMessage({ id: 'Hoàn thành' })}</Bt> */}
            {tabType === 'inCharge' || tabType === 'support' ? <Bt tab={5}> Đã trả lại</Bt> : null}
            {tabType === 'assignTask' ? <Bt tab={6}>Hoàn thành</Bt> : null}
            <Bt tab={0}> {intl.formatMessage({ id: 'Danh sách' })}</Bt>
            {/* <Bt tab={6}> {intl.formatMessage(messages.list || { id: 'Đang thực hiện' })}</Bt> */}
          </GridLife>
          {tab === 5 ? (
            <React.Fragment>
              <GridList
                openTask={this.openTask}
                openTitleDialog={this.openTitleDialog}
                openEditDialog={this.openEditDialog}
                openonAgreeDialog={this.openonAgreeDialog}
                openonDelteDialog={this.openonDelteDialog}
                addFunction={this.onAddFunctionClick}
                reload={reload}
                filter={newFilter}
                openBusiness={this.openBusiness}
                modalRequiredFilter={this.modalRequiredFilter()}
                modalFilter={this.modalFilter(intl, totalTask, tab)}
                disableAdd={this.props.disableAdd}
                disableImport={this.props.disableImport}
                tabType={tabType}
                tab={tab}
                reloadCount={this.props.reloadCount}
              // customExport={this.exportTable()}
              />
            </React.Fragment>
          ) : null}
          <SwipeableDrawer
            anchor="right"
            onClose={this.closeDrawer}
            open={open}
            width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
          >
            <div style={{ marginTop: 58, padding: 20, width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260 }}>
              <AddProjects data={data} id={id || 'add'} callback={this.callbackTask} />
            </div>
          </SwipeableDrawer>
          {tab === 0 || tab === 6 ? (
            <React.Fragment>
              <GridList
                openTask={this.openTask}
                openTitleDialog={this.openTitleDialog}
                openEditDialog={this.openEditDialog}
                openonAgreeDialog={this.openonAgreeDialog}
                openonDelteDialog={this.openonDelteDialog}
                addFunction={this.onAddFunctionClick}
                reload={reload}
                filter={newFilter}
                filterChildren={this.props.isChildren ? true : false}
                openBusiness={this.openBusiness}
                modalRequiredFilter={this.modalRequiredFilter()}
                modalFilter={this.modalFilter(intl, totalTask, tab)}
                disableAdd={this.props.disableAdd}
                disableImport={this.props.disableImport}
                tabType={tabType}
                tab={tab}
                reloadCount={this.props.reloadCount}
              // customExport={this.exportTable()}
              />
            </React.Fragment>
          ) : null}
          <Dialog
            title="Đồng chí có chắc chắn muốn đồng ý không ?"
            onSave={this.saveAgree}
            saveText="Đồng ý"
            open={openInCharge}
            onClose={() => this.setState({ openInCharge: false })}
          >
            <CustomInputBase multiline rows={4} value={note} name="note" onChange={e => this.setState({ note: e.target.value })} label="Nội dung" />
          </Dialog>

          <Dialog
            title="Đồng chí có chắc chắn muốn từ chối không ?"
            onSave={this.saveDelete}
            saveText="Từ chối"
            open={openDelete}
            onClose={() => this.setState({ openDelete: false })}
          >
            <CustomInputBase multiline rows={4} value={note} name="note" onChange={e => this.setState({ note: e.target.value })} label="Nội dung" />
          </Dialog>
        </GridLife>
        <Menu
          id="simple-menu"
          anchorEl={this.state.addTaskAnchorEl}
          keepMounted
          open={Boolean(this.state.addTaskAnchorEl)}
          onClose={() => this.setState({ addTaskAnchorEl: null })}
        >
          <MenuItem onClick={this.openCreateTask}>
            {' '}
            <ListItemIcon>
              <Assignment color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={intl.formatMessage({ id: 'task.Task' })} />
          </MenuItem>
          {roleModuleAddProjectData.access === true ? (
            <MenuItem>
              {' '}
              <Link style={{ display: 'flex' }} to={`${getCurrentUrl()}/add`}>
                <ListItemIcon>
                  <Work color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'task.Project' })} />
              </Link>
            </MenuItem>
          ) : null}
        </Menu>
      </Paper>
    );
  }
}
TotalTask.propTypes = {
  dispatch: PropTypes.func.isRequired,
  // component: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  totalTask: makeSelectTotalTask(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    deleteTasks: data => dispatch(deleteTasks(data)),
    getTasks: data => dispatch(getTasks(data)),
    onAddBo: bo => {
      dispatch(addBoAction(bo));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onGetTasksForTimeManagement: () => {
      dispatch(getTasksForTimeManagement());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'totalTask', reducer });
const withSaga = injectSaga({ key: 'totalTask', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(TotalTask);
