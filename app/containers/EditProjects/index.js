/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * AddProjects
 *
 */

import React, { createRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import {
  NetworkLocked,
  Group,
  GroupAdd,
  Update,
  SwapHoriz,
  VisibilityOffRounded,
  Delete,
} from '@material-ui/icons';
import {
  MenuItem,
  Button,
  TableRow,
  TableCell,
  TableHead,
  Table,
  TableBody,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  CardMedia,
  Menu,
  Avatar,
  withStyles,
} from '@material-ui/core';
import { injectIntl } from 'react-intl';

import { fetchData } from 'helper';
import { EditorUtils } from '@progress/kendo-react-editor';
import Buttons from 'components/CustomButtons/Button';
import { Link } from 'react-router-dom';
import { ValidatorForm } from 'react-material-ui-form-validator';
import axios from 'axios';
import { taskStatusArr, clientId } from 'variable';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE, API_RETURN_TASK } from '../../config/urlConfig';
import cover from '../../assets/img/task/task_cover_01.jpg';
import cover2 from '../../assets/img/task/task_cover_02.jpg';
import cover3 from '../../assets/img/task/task_cover_03.jpg';
import cover4 from '../../assets/img/task/task_cover_04.jpg';
import CustomAppBar from 'components/CustomAppBar';
import CustomDatePicker from '../../components/CustomDatePicker';
import moment from 'moment';
import _ from 'lodash';
import { Tabs, Tab } from '@material-ui/core';
import TaskDocs from './components/TaskDocs';
import Addtask from "../../containers/AddProjectsClone"
import {
  API_PROGRESS,
  API_TRANFER,
  API_TASK_PROJECT,
  API_USERS,
  API_SAMPLE_PROCESS,
  API_CONVERSATION,
  API_DISPATCH,
  API_MEETING,
  GET_TASK_CONTRACT,
  API_TASK_HISTORY,
  API_TASK_ACCEPT,
  API_ROLE_GROUP,
} from '../../config/urlConfig';
import {
  mergeData,
  handleChange,
  postProject,
  getProjectCurrent,
  putProject,
  putProgress,
  postTranfer,
  postFile,
  putRatio,
  getData,
  postApprove,
  getEmployee,
  clean,
} from './actions';

import {
  Grid,
  Typography,
  TextField,
  Autocomplete,
  Dialog,
  Comment,
  ProgressBar,
  AsyncAutocomplete,
  FileUpload,
  SwipeableDrawer,
  Paper as PaperUI,
} from '../../components/LifetekUi';
import {
  DialogTitle,
  DialogActions,
  DialogContent,
  Dialog as Dialogg,
} from '@material-ui/core'
import makeSelectAddProjects from './selectors';
import { changeSnackbar } from '../Dashboard/actions';
import { getConversation } from '../Conversation/actions';
import reducer from './reducer';
import saga from './saga';
import './style.css';

import { makeSelectProfile, makeSelectSocket, makeSelectMiniActive } from '../Dashboard/selectors';
import makeSelectDashboardPage from '../Dashboard/selectors';
import makeSelectTotalTask from '../TotalTask/selectors';
import { convertTree, taskPrioty, priotyColor, getDatetimeLocal, toVietNamDate, totalArray, serialize } from '../../helper';
import Breadcrumbs from '../../components/LifetekUi/Breadcrumbs';
import ConfirmDialog from '../../components/CustomDialog/ConfirmDialog';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { viewConfigCheckForm } from 'utils/common';
import FilterDocs from '../AddProjects/component/FilterDocs';
import request from '../../utils/request';
import EditExecutiveDocuments from '../EditExecutiveDocuments';
import EditGoDocuments from '../EditGoDocuments';
import EditProjects from '../EditProjects'

import DocumentAssignModal from 'components/TaskAsignModal';
import { getListData } from '../../utils/common';



function KanbanStep(props) {
  const { kanbanStatus } = props;

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

function TaskType(props) {
  return (
    <div>
      <Typography style={{ fontSize: '20px', fontWeight: 'bold' }}>{props.title}</Typography>
      <div
        className="task-type"
        onClick={props.hanldeClick}
        style={{
          background: props.background,
        }}
      >
        {props.icon}
      </div>
      <Typography className="task-type-description">{props.description}</Typography>
    </div>
  );
}

function People({ people, planPeople }) {
  if (!people) return null;
  const leng = people.length;
  const [anchorEl, setAnchorEl] = React.useState(null);
  return (
    <React.Fragment>
      {people.filter(i => Boolean(i)).map(
        (person, index) =>
          index === leng - 1 ? (
            <span>
              <Link to={`/setting/Employee/add/${person._id}`}>{person.name}</Link>
            </span>
          ) : (
            <span>
              <Link to={`/setting/Employee/add/${person._id}`}>{person.name}</Link>,{' '}
            </span>
          ),
      )}

      <VisibilityOffRounded onClick={e => setAnchorEl(e.currentTarget)} style={{ fontSize: '0,5rem', marginLeft: 5 }} />
      <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)}>
        {planPeople.map(i => (
          <MenuItem>
            <Avatar style={{ width: 25, height: 25 }} src={i.avatar} />
            <span style={{ color: people.map(it => it._id).includes(i._id) ? 'transparent' : 'red' }}>{i.name}</span>
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

function TypographyDetail({ children, data }) {
  return (
    <div className="task-info-detail">
      <p>{children}</p>
      <p>{data}</p>
    </div>
  );
}

export class AddProjects extends React.Component {
  constructor(props) {
    super(props);
    const names = {};
    const checkRequired = {};
    const checkShowForm = {};
    const myCover = [cover, cover2, cover3, cover4];
    const randCover = myCover[Math.floor(Math.random() * myCover.length)];
    this.editor = createRef();
    const listCrmStatus = JSON.parse(localStorage.getItem('taskStatus'));
    const currentStatus = listCrmStatus.find(i => i.code === 'KANBAN').data.sort((a, b) => a.code - b.code);
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    this.state = {
      tabIndex: 1,
      tab: 0,
      openDialog: false,
      openDialogProgress: false,
      openAddProject: false,
      tabContract: 0,
      names,
      currentStatus,
      randCover,
      taskInCharge: null,
      taskSupport: null,
      taskJoin: null,
      taskApproved: null,
      speciall: null,
      confirmAddProjectNoCustomerOpen: false,
      checkRequired,
      checkShowForm,
      localMessages: {},
      crmSource,
      openEvaluate: false,
      openCompleteAny: false,
      noteHistory: '',
      receiver: '',
      onCompleteAny: '',
      reload: 0,
      taskData: {},
      openInCharge: false,
      openDelete: false,
      noteDig: '',
      docDetail: null,
      openDialogFilter: false,
      openEditDialog: false,
      openEditDialogOut: false,
      idEdit: null,
      openTaskAsign: false,
      dataHistory: [],
      datakProcessFlow: [],
      dataPeople: [],
      openContent: false,
      view: false,
      roleGroup: [],
      returnTask: false,
      position: null,
      processType: "",
      checkInchage: false,
      tabTask: 0,
      permission: false,
      permissionDoc: false, 
      openDialogTask: false,
      openAddTask: false,
      dataLocal: {},
      openDialogDeleteTask: false,
      idTaskDelete: "",
      count: 0,
      nonDisableAppBar: false,
      openDialogEditProject: false,
      idDialogEditProject: null,
      taskAttachedd: [],
      countFilter: 0
    };
  }

  customTemplate({ role, childrens = [], type = [], first = false }) {
    if (role && childrens) {
      const child = childrens.find(f => f.code === role);
      if (child) {
        if (type.length && child.type && child.type !== '' && type.find(t => child.type === t)) {
          this.setState({ datakProcessFlow: child.children || [] });
        } else {
          if (!first) {
            this.setState({ datakProcessFlow: child.children || [] });
          }
          for (const item of childrens) {
            if (item.children) {
              this.customTemplate({ role, childrens: item.children, type, first: true });
            }
          }
        }
      } else {
        for (const item of childrens) {
          if (item.children) {
            this.customTemplate({ role, childrens: item.children, type });
          }
        }
      }
    }
  }

  componentDidMount() {
    localStorage.removeItem('taskAddCallBack');
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    this.props.getProjectCurrent(id, this.props.data);
    if (!!this.props.description && this.props.description.length > 0) {
      let str = '';
      for (let i = 0; i < this.props.description.length; i++) {
        str = `${str + this.props.description[i].name} : ${this.props.description[i].value} . `;
      }
      this.props.mergeData({ description: str });
    }
    this.props.getData();
    this.props.getEmployee();
    if (id !== 'add') {
      fetch(`${API_TASK_PROJECT}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          this.setState({ taskData: data });
          let a = [];
          let b = [];
          let dataTaskFm = [];
          a = data && data.inCharge;
          b = data && data.support;
          dataTaskFm = a && a.concat(b);
          this.props.mergeData({ dataTask: dataTaskFm });
        });
    }
    if (id) {
      this.getDetail(id);
    }
    if (id !== 'add') {
      this.getDetail(id);

      let obj = {};

      obj = {
        filter: {
          docId: id,
        },
      };

      fetch(`${API_TASK_HISTORY}?${serialize(obj)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => response.json())
        .then(data => {

          let checkInchage = false
          let listInCharge = []
          if (data.data && Array.isArray(data.data)) {
            data.data.map((el) => {
              if (el.action === "inchage")
                listInCharge.push(el)
            })
          }
          const found = listInCharge.find(element => element.statusAccept === "Trả lại");
          if (found)
            checkInchage = true
          this.setState({ dataHistory: data.data, checkInchage });
          const dataFm = data.data && data.data.filter(i => i.position === 'Phối hợp xử lý');
          const datainCharge = data.data && data.data.filter(i => i.position === 'Xử lý chính');
          this.props.mergeData({ support: dataFm, inCharge: datainCharge });
        });
    }

    getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/task`).then(res => {
      if (res) {
        this.setState({ datakProcessFlow: res.children || [], templatesData: [{ ...res }] });
        this.customTemplate({ role: this.props.profile.roleGroupSource, childrens: res.children, type: this.props.profile.type });
      } else {
        this.props.onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng xử lý', status: true });
      }
      const { profile } = this.props;
      const a = res.children && res.children.find(i => i.code === (profile && profile.roleGroupSource));

      const b = a && a.children && a.children.length > 0 && a.children.map(i => ({ code: i.code, internal: i.internal }));

      this.setState({ dataPeople: b });
    });

    fetch(`${API_ROLE_GROUP}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ roleGroup: data.data });
      });
    const roleCodeTask = this.props && this.props.dashboardPage && this.props.dashboardPage.role && this.props.dashboardPage.role.roles && this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Task');
    const roleCodeDoc = this.props && this.props.dashboardPage && this.props.dashboardPage.role && this.props.dashboardPage.role.roles  && this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'OutGoingDocument');
      console.log(roleCodeDoc, "OutGoingDocument")
    let permission
    if (roleCodeTask && roleCodeTask.methods && Array.isArray(roleCodeTask.methods) && roleCodeTask.methods.length > 0)
      permission = roleCodeTask.methods.find(element => element.name === "POST" && element.allow === true);
    if (permission) {
      this.setState({ permission: true })
    }
    else this.setState({ permission: false })


    let permissionDoc

    if (roleCodeDoc && roleCodeDoc.methods && Array.isArray(roleCodeDoc.methods) && roleCodeDoc.methods.length > 0)
      permissionDoc = roleCodeDoc.methods.find(element => element.name === "POST" && element.allow === true);
    if (permissionDoc) {
      this.setState({ permissionDoc: true })
    }
    else this.setState({ permissionDoc: false })

    // fetchData(`${API_TASK_PROJECT}/projects?parent=true`).then(res => {
    //  // console.log(res, "ssssssssss")
    // });
  }

  componentWillUnmount() {
    this.props.onClean();
  }

  componentDidUpdate(nextProps) {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));

    if (Array.isArray(viewConfig) && !_.isEqual(this.runFirstTime, viewConfig)) {
      this.runFirstTime = viewConfig;
      const names = {};
      const checkRequired = {};
      const checkShowForm = {};
      const taskColumns = _.get(viewConfig.find(item => item.code === 'Task'), 'listDisplay.type.fields.type.columns', []);
      taskColumns.forEach(item => {
        names[item.name] = item.title;
        checkRequired[item.name] = item.checkedRequireForm;
        checkShowForm[item.name] = item.checkedShowForm;
      });
      this.setState({ names, checkShowForm, checkRequired });
    }

    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const nextId = nextProps.id ? nextProps.id : nextProps.match.params.id;
    if (id !== nextId) this.props.getProjectCurrent(id, this.props.data);
    const { addProjects } = this.props;
    if (this.state.taskAttachedd.length === 0 && addProjects.taskAttached.length > 0 && !this.state.countFilter) {
      this.setState({ countFilter: 1 })
      const filter = { _id: { $in: addProjects.taskAttached } };
      const query = serialize({ filter });
      const projectData = fetchData(`${API_TASK_PROJECT}/projects?${query}`).then((res) => {
        this.setState({ taskAttachedd: res.data })
      })
    }
  }

  componentWillReceiveProps(props) {
    if (!!props.dashboardPage.roleTask.roles && props.dashboardPage.roleTask.roles !== undefined && props.dashboardPage.roleTask.roles.length > 0) {
      if (this.props.location && this.props.location.tab) {
        this.setState({ tabTask: this.props.location.tab })
      } else if (this.props && this.props.location && this.props.location.state && this.props.location.state.id) {
        this.setState({ tabTask: 0 })
        //console.log(this.props.location);
      }
      this.setState({
        taskInCharge: props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data.find(elm => elm.name === 'inCharge').data,
        taskSupport: props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data.find(elm => elm.name === 'support').data,
        // speciall: props.dashboardPage.roleTask.roles.find(elm => elm.code === 'SPECIALL').data,
      });
    }
  }

  handlecloseDrawer = () => {
    this.props.mergeData({ selectTask: true });
  };

  mapHistory = (item, index) => ({
    ...item,
    updatedBy: item.updatedBy ? item.updatedBy.name : null,
    index: index + 1,
    taskStatus: taskStatusArr[item.taskStatus - 1],
    taskId: item.taskId ? item.taskId.name : null,
    priority:
      item.priority === 1 ? 'Rất cao' : item.priority === 2 ? 'Cao' : item.priority === 3 ? 'Trung bình' : item.priority === 4 ? 'Thấp' : 'Rất thấp',
  });

  mapApproved = (item, index) => ({
    ...item,
    index: index + 1,
    taskStatus: taskStatusArr[item.taskStatus - 1],
    pheduyet:
      item.taskStatus === 3 ? (
        <Button variant="outlined" color="primary">
          Phê duyệt
        </Button>
      ) : (
        'Chờ phê duyệt'
      ),
  });

  mapProgrees = item => ({
    ...item,
    priority:
      item.priority === 1 ? 'Rất cao' : item.priority === 2 ? 'Cao' : item.priority === 3 ? 'Trung bình' : item.priority === 4 ? 'Thấp' : 'Rất thấp',
    taskStatus: taskStatusArr[item.taskStatus - 1],
  });

  handleInputChange = e => {
    this.props.mergeData({ search: e.target.value, locationAddress: e.target.value });
  };

  handleSelectSuggest = suggest => {
    const lat = suggest.geometry.location.lat();
    const lng = suggest.geometry.location.lng();
    this.props.mergeData({ search: '', locationAddress: suggest.formatted_address, location: { lat, lng } });
  };

  onMarkerDragEnd = evt => {
    if (window.google) {
      const cityCircle = new google.maps.Circle({
        strokeColor: '#57aad7',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#69c0ef',
        fillOpacity: 0.35,
        radius: 50,
      });
      this.state.cityCircle = cityCircle;
    }
    this.getLocationByLatLng(evt.latLng.lat(), evt.latLng.lng());
  };

  getLocationByLatLng(latitude, longitude, df = false) {
    const self = this;
    let location = null;
    if (window.navigator && window.navigator.geolocation) {
      location = window.navigator.geolocation;
    }
    if (location) {
      location.getCurrentPosition(position => {
        let lat = latitude;
        let lng = longitude;
        if (df === 'default') {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        }

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAXhItM5DtDeNF7uesxuyhEGd3Wb_5skTg`;
        axios.get(url).then(data => {
          const { results } = data.data;
          if (!!results && !!results.length) {
            const { formatted_address } = results[0];
            self.props.mergeData({
              locationAddress: formatted_address,
              location: { lat, lng },
            });
          }
        });
      });
    }
  }

  mapContract = (item, index) => ({
    ...item,
    index: index + 1,
    realExpense: item.amountReven,
    paymentRequest: item.amount,
    estimateExpense: item.costEstimate,
  });

  handleTabs = tabContract => {
    this.setState({ tabContract });
  };

  handleChangeButton(tabIndex) {
    this.setState({ tabIndex }, () => {
      if (tabIndex === 1) {
        setTimeout(() => {
          if (this.editor && this.editor.view) {
            EditorUtils.setHtml(this.editor.view, this.props.addProjects.desHtml);
          }
        }, 1000);
      }
    });
  }

  totalRatio;

  makeConversation = () => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addProjects, searchControl } = this.props;
    const { join, name } = addProjects;
    const newJoin = join.map(i => i._id);
    if (newJoin.length < 2) {
      alert('Không thể tạo nhóm dưới 2 thành viên');
      return;
    }
    const data = { join: newJoin, type: 1, name, id, moduleName: 'Task' };
    fetch(API_CONVERSATION, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(() => {
      this.props.mergeData({ hideAddConversation: true });
      this.props.getConversation();
    });
  };

  updateRatio = () => {
    if (!this.props.addProjects.projectId) {
      alert('Không thể cập nhật tỉ trọng của công việc');
      return;
    }
    const listRatio = this.props.addProjects.listRatio;

    const total = totalArray(listRatio, 0, listRatio.length, 'ratio');
    if (total > 100 || !Number.isInteger(total)) {
      alert('Tỉ trọng không được lớn hơn 100 và phải là số nguyên');
      return;
    }
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    this.props.putRatio(id, listRatio);
  };

  selectTemplate = template => {
    if (!template) this.props.mergeData({ template: null });
    const { startDate } = this.props.addProjects;
    this.calculateEndate(startDate, template);
  };

  calculateEndate = (startDate, template) => {
    const treeData = template.treeData;
    const joinChild = convertTree(treeData, new Date(startDate), 'DATA', [], true);
    let endDate = getDatetimeLocal();
    for (let index = 0; index < treeData.length; index++) {
      const element = treeData[index];
      const start = new Date(endDate);
      const end = new Date(element.endDate);
      if (end - start > 0) endDate = element.endDate;
    }
    const newEndDate = new Date(endDate);
    this.props.mergeData({ endDate: newEndDate, template, joinChild: joinChild.joins, startDate, joinChildData: joinChild.joinsData });
  };

  onSelectImg = e => {
    const objectAvatar = URL.createObjectURL(e.target.files[0]);
    this.props.mergeData({ objectAvatar, avatar: e.target.files[0] });
  };

  handleChange = (name, value) => {
    const { addProjects } = this.props;
    const newAdd = { ...addProjects, [name]: value };
    const localMessages = viewConfigCheckForm('Task', newAdd);
    this.setState({ localMessages: { ...(this.state.localMessages || {}), [name]: localMessages[name] } });
    if (name === 'startDate' || name === 'endDate') {
      if (newAdd.startDate && newAdd.endDate) {
        if (new Date(newAdd.startDate) > new Date(newAdd.endDate)) {
          this.setState({ localMessages: { ...(this.state.localMessages || {}), endDate: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu' } });
        } else this.setState({ localMessages: { ...(this.state.localMessages || {}), endDate: null } });
      }
    }

    if (name === 'hasRelatedDocument') {
      this.props.mergeData({ [name]: value, relatedDoc: null });
    } else if (name === 'hasRelatedProject') {
      this.props.mergeData({ [name]: value, relatedTask: null });
    } else this.props.mergeData({ [name]: value });
  };

  handleDialogAdd = () => {
    this.setState({ openDialog: false });
  };

  handleDialog = () => {
    const { openDialog } = this.state;
    this.setState({ openDialog: !openDialog });
  };

  handleDialogProgress = () => {
    this.setState({
      openDialogProgress: false,
    });
  };

  handleOpenDialogProgress = () => {
    const { openDialogProgress } = this.state;
    this.setState({ openDialogProgress: !openDialogProgress });
  };

  handleChangeInputFile = e => {
    this.props.mergeData({ url: e.target.files[0] });
  };

  mapPeople(people) {
    if (!people) return null;
    return people.map(i => i.name).join();
  }

  handleStepper = item => {
    const { addProjects, profile } = this.props;
    const inChargePlanFm = addProjects && addProjects.inChargePlan && addProjects.inChargePlan.find(i => i._id === profile._id);
    const supportPlanFm = addProjects && addProjects.supportPlan && addProjects.supportPlan.find(i => i._id === profile._id);
    const createdBynFm = addProjects && addProjects.createdBy && addProjects.createdBy._id === profile._id;
    if (inChargePlanFm || supportPlanFm) {
      if (item && item.type > 2) {
        this.props.onChangeSnackbar({ status: true, message: 'Đồng chí không thể thay đổi trạng thái này', variant: 'error' });
      } else {
        this.props.mergeData({ kanbanStatus: item.type, taskStatus: item.code });
      }
    }
    if (createdBynFm) {
      if (item && item.type == '2') {
        this.props.onChangeSnackbar({ status: true, message: 'Đồng chí không thể thay đổi trạng thái này', variant: 'error' });
      } else {
        this.props.mergeData({ kanbanStatus: item.type, taskStatus: item.code });
      }
    }
  };
  showConfirmAddProjectNoCustomer = () => {
    this.setState({ confirmAddProjectNoCustomerOpen: true });
  };

  handleCloseAddProjectNoCustomer = () => {
    this.setState({ confirmAddProjectNoCustomerOpen: false });
  };

  handleConfirmAddProjectNoCustomer = () => {
    this.handleCloseAddProjectNoCustomer();

    this.onSave();
  };

  onSave = () => {
    const { addProjects } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { localState } = this.state;
    let content = '';
    if (this.editor && this.editor.view) {
      const view = this.editor.view;
      content = EditorUtils.getHtml(view.state);
    }
    const listJoin = addProjects.joinChild.concat(addProjects.join.map(item => item._id));
    const join = [...new Set(listJoin)];

    const addSupport = addProjects.support && addProjects.support.length > 0 ? addProjects.support.map(item => item.receiver) : [];

    const editSupportNew = id !== 'add' && addProjects.support && addProjects.support.length > 0 ? addProjects.support.map(item => item._id) : [];
    const editSupport =
      id !== 'add' && addProjects.support && addProjects.support.length > 0
        ? (addProjects.support[0].receiver ? addProjects.support.map(item => item.receiver._id) : false) || editSupportNew
        : [];

    const addInCharge = addProjects.inCharge && addProjects.inCharge.length > 0 ? addProjects.inCharge.map(item => item.receiver) : [];

    const editInChargeNew = id !== 'add' && addProjects.inCharge && addProjects.inCharge.length > 0 ? addProjects.inCharge.map(item => item._id) : [];
    const editInCharge =
      id !== 'add' && addProjects.inCharge && addProjects.inCharge.length > 0
        ? (addProjects.inCharge[0].receiver ? addProjects.inCharge.map(item => item.receiver._id) : false) || editInChargeNew
        : [];


    let taskAttached = []
    if (this.state.taskAttachedd && Array.isArray(this.state.taskAttachedd) && this.state.taskAttachedd.length > 0) {
      this.state.taskAttachedd.map((el) => {
        taskAttached.push(el._id)
      })
    }
    let data = {
      taskAttached: taskAttached,
      name: addProjects.name,
      template: addProjects.template ? addProjects.template._id : null,
      description: addProjects.description,
      startDate: addProjects.startDate,
      endDate: addProjects.endDate,
      taskStatus: addProjects.taskStatus,
      taskStage: addProjects.taskStage,
      priority: addProjects.priority,
      customer: addProjects.customer ? addProjects.customer._id : null,
      taskMaster: addProjects.taskMaster ? addProjects.taskMaster._id : null,
      viewable: addProjects.viewable ? addProjects.viewable.map(item => item._id) : [],
      // inCharge: addProjects.inCharge ? addProjects.inCharge.map(item => item._id) : [],
      inCharge: id === 'add' ? addInCharge : editInCharge,
      taskManager: addProjects.taskManager ? addProjects.taskManager.map(item => item._id) : [],
      approved: addProjects.approved ? addProjects.approved.map(item => ({ id: item.id ? item.id : item._id, name: item.name })) : [],
      isProject: addProjects.isProject,
      kanban: addProjects.kanban,
      progress: addProjects.progress,
      // file: addProjects.file,
      join,
      incommingDocuments: addProjects.incommingDocuments,
      outGoingDocuments: addProjects.outGoingDocuments,
      taskType: addProjects.taskType,
      source: addProjects.source,
      assigner: this.props.profile ? this.props.profile._id : null,
      type: addProjects.type,
      planerStatus: addProjects.planerStatus,
      ratio: addProjects.ratio,
      parentId: addProjects.parentId,
      createdBy: addProjects.createdBy,
      support: id !== 'add' ? editSupport : addSupport,
      // taskLevel: addProjects.taskLevel && addProjects.taskLevel.value ? addProjects.taskLevel.value : '',
      kanbanStatus: addProjects.kanbanStatus,
      objectAvatar: addProjects.objectAvatar,
      avatar: addProjects.avatar,
      category: addProjects.category,
      typeTask: addProjects.typeTask,
      callback: this.props.callback,
      remember: addProjects.remember,
      rememberTo: addProjects.rememberTo,
      dateRemember: addProjects.dateRemember,
      isObligatory: addProjects.isObligatory,
      businessOpportunities: this.props.businessOpportunities ? this.props.businessOpportunities : null,
      exchangingAgreement: this.props.exchangingAgreement ? this.props.exchangingAgreement : null,
      mettingSchedule: this.props.mettingSchedule ? this.props.mettingSchedule : null,
      documentary: this.props.documentary ? this.props.documentary : null,
      order: addProjects.order,
      planApproval: addProjects.planApproval,
      acceptApproval: addProjects.acceptApproval,
      approvedProgress: addProjects.approvedProgress,
      updatedBy: addProjects.updatedBy,
      locationAddress: addProjects.locationAddress,
      provincial: addProjects.provincial,
      others: addProjects.others,
      desHtml: content,
      sourceData: addProjects.sourceData,
      geography: addProjects.geography,
      relatedDoc: addProjects.relatedDoc,
      relatedTask: addProjects.relatedTask,
      file: localState && localState.file,
      processors: id !== 'add' ? [] : addProjects.processors,
      abc: addProjects.abc,
    };

    const customJoin = arr => (arr ? arr.map(e => e.name).join(', ') : '');
    data = {
      ...data,
      viewableStr: customJoin(addProjects.viewable),
      inChargeStr: customJoin(addProjects.inCharge),
      taskManagerStr: customJoin(addProjects.taskManager),
      approvedStr: customJoin(addProjects.approved),
      joinStr: customJoin(addProjects.joinChildData.concat(addProjects.join)),
      supportStr: customJoin(addProjects.support),
    };

    if (id === 'add') {
      this.props.postProject(data);
    } else this.props.putProject(data, id);
  };

  onSaveKanban = () => {
    const { addProjects } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { localState } = this.state;
    let content = '';
    if (this.editor && this.editor.view) {
      const view = this.editor.view;
      content = EditorUtils.getHtml(view.state);
    }
    const listJoin = addProjects.joinChild.concat(addProjects.join.map(item => item._id));
    const join = [...new Set(listJoin)];

    const addSupport = addProjects.support && addProjects.support.length > 0 ? addProjects.support.map(item => item.receiver) : [];

    const editSupportNew = id !== 'add' && addProjects.support && addProjects.support.length > 0 ? addProjects.support.map(item => item._id) : [];
    const editSupport =
      id !== 'add' && addProjects.support && addProjects.support.length > 0
        ? (addProjects.support[0].receiver ? addProjects.support.map(item => item.receiver._id) : false) || editSupportNew
        : [];

    const addInCharge = addProjects.inCharge && addProjects.inCharge.length > 0 ? addProjects.inCharge.map(item => item.receiver) : [];

    const editInChargeNew = id !== 'add' && addProjects.inCharge && addProjects.inCharge.length > 0 ? addProjects.inCharge.map(item => item._id) : [];
    const editInCharge =
      id !== 'add' && addProjects.inCharge && addProjects.inCharge.length > 0
        ? (addProjects.inCharge[0].receiver ? addProjects.inCharge.map(item => item.receiver._id) : false) || editInChargeNew
        : [];
    let taskAttached = []
    if (this.state.taskAttachedd && Array.isArray(this.state.taskAttachedd) && this.state.taskAttachedd.length > 0) {
      this.state.taskAttachedd.map((el) => {
        taskAttached.push(el._id)
      })
    }
    let data = {
      taskAttached: taskAttached,
      name: addProjects.name,
      template: addProjects.template ? addProjects.template._id : null,
      description: addProjects.description,
      startDate: addProjects.startDate,
      endDate: addProjects.endDate,
      taskStatus: addProjects.taskStatus,
      taskStage: addProjects.taskStage,
      priority: addProjects.priority,
      customer: addProjects.customer ? addProjects.customer._id : null,
      taskMaster: addProjects.taskMaster ? addProjects.taskMaster._id : null,
      viewable: addProjects.viewable ? addProjects.viewable.map(item => item._id) : [],
      // inCharge: addProjects.inCharge ? addProjects.inCharge.map(item => item._id) : [],
      inCharge: id === 'add' ? addInCharge : editInCharge,
      taskManager: addProjects.taskManager ? addProjects.taskManager.map(item => item._id) : [],
      approved: addProjects.approved ? addProjects.approved.map(item => ({ id: item.id ? item.id : item._id, name: item.name })) : [],
      isProject: addProjects.isProject,
      kanban: addProjects.kanban,
      progress: addProjects.progress,
      // file: addProjects.file,
      join,
      incommingDocuments: addProjects.incommingDocuments,
      outGoingDocuments: [...addProjects.outGoingDocuments],
      taskType: addProjects.taskType,
      source: addProjects.source,
      assigner: this.props.profile ? this.props.profile._id : null,
      type: addProjects.type,
      planerStatus: addProjects.planerStatus,
      ratio: addProjects.ratio,
      parentId: addProjects.parentId,
      createdBy: addProjects.createdBy,
      support: id !== 'add' ? editSupport : addSupport,
      // taskLevel: addProjects.taskLevel && addProjects.taskLevel.value ? addProjects.taskLevel.value : '',
      kanbanStatus: '3',
      objectAvatar: addProjects.objectAvatar,
      avatar: addProjects.avatar,
      category: addProjects.category,
      typeTask: addProjects.typeTask,
      callback: this.props.callback,
      remember: addProjects.remember,
      rememberTo: addProjects.rememberTo,
      dateRemember: addProjects.dateRemember,
      isObligatory: addProjects.isObligatory,
      businessOpportunities: this.props.businessOpportunities ? this.props.businessOpportunities : null,
      exchangingAgreement: this.props.exchangingAgreement ? this.props.exchangingAgreement : null,
      mettingSchedule: this.props.mettingSchedule ? this.props.mettingSchedule : null,
      documentary: this.props.documentary ? this.props.documentary : null,
      order: addProjects.order,
      planApproval: addProjects.planApproval,
      acceptApproval: addProjects.acceptApproval,
      approvedProgress: addProjects.approvedProgress,
      updatedBy: addProjects.updatedBy,
      locationAddress: addProjects.locationAddress,
      provincial: addProjects.provincial,
      others: addProjects.others,
      desHtml: content,
      sourceData: addProjects.sourceData,
      geography: addProjects.geography,
      relatedDoc: addProjects.relatedDoc,
      relatedTask: addProjects.relatedTask,
      file: localState && localState.file,
      processors: id !== 'add' ? [] : addProjects.processors,
      abc: addProjects.abc,
      statusAccept: 'success',
    };

    const customJoin = arr => (arr ? arr.map(e => e.name).join(', ') : '');
    data = {
      ...data,
      viewableStr: customJoin(addProjects.viewable),
      inChargeStr: customJoin(addProjects.inCharge),
      taskManagerStr: customJoin(addProjects.taskManager),
      approvedStr: customJoin(addProjects.approved),
      joinStr: customJoin(addProjects.joinChildData.concat(addProjects.join)),
      supportStr: customJoin(addProjects.support),
    };

    if (id === 'add') {
      this.props.postProject(data);
    } else this.props.putProject(data, id);
  };

  handleSaveProject = () => {
    const { addProjects } = this.props;
    const { endDate, approvedProgress, customer } = addProjects;
    if (new Date(addProjects.startDate) > new Date(addProjects.endDate)) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu', variant: 'error' });
      this.setState({ localMessages: { ...(this.state.localMessages || {}), endDate: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu' } });
      return;
    }
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const localMessages = viewConfigCheckForm('Task', this.props.addProjects);
    this.setState({ localMessages });
    const errMsg = {};
    Object.keys(localMessages).forEach(key => {
      if (localMessages[key]) errMsg[key] = localMessages[key];
    });
    if (Object.keys(errMsg).length === 0) {
      this.onSave();
    } else {
      const allMessages = Object.values(errMsg).join(', ');
      this.props.onChangeSnackbar({ status: true, message: allMessages, variant: 'error' });
    }
  };

  handleSaveProjectComPlate = () => {
    const { addProjects } = this.props;
    const { endDate, approvedProgress, customer } = addProjects;
    if (new Date(addProjects.startDate) > new Date(addProjects.endDate)) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu', variant: 'error' });
      this.setState({ localMessages: { ...(this.state.localMessages || {}), endDate: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu' } });
      return;
    }
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const localMessages = viewConfigCheckForm('Task', this.props.addProjects);
    this.setState({ localMessages });
    const errMsg = {};
    Object.keys(localMessages).forEach(key => {
      if (localMessages[key]) errMsg[key] = localMessages[key];
    });
    if (Object.keys(errMsg).length === 0) {
      this.onSaveKanban();
    } else {
      const allMessages = Object.values(errMsg).join(', ');
      this.props.onChangeSnackbar({ status: true, message: allMessages, variant: 'error' });
    }
  };

  onCloseProject = () => {
    if (this.props.history && this.props.location && this.props.location.state && this.props.location.state.idd === undefined) {
      this.setState({ nonDisableAppBar: true })
      this.props.history.push({
        pathname: `/Task/task-detail/${this.props.location.state.id}`,
        tab: 1
      });
    } else if (this.props.callback) {
      this.setState({ nonDisableAppBar: false })
      this.props.callback();
    } else {
      this.setState({ nonDisableAppBar: false })
      this.props.history.push({
        pathname: this.props.location && this.props.location.link || "/Task",
        // tab: 'work'
        tab: 0

      });
    }
  };

  onSaveProgress = () => {
    const { addProjects } = this.props;
    if (addProjects.selectNote === '') {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Ghi chú không được bỏ trống',
        variant: 'warning',
      });
      return;
    }
    const selectedTaskId = addProjects.idSelect;
    const data = {
      taskId: selectedTaskId,
      taskStatus: addProjects.selectStatus,
      priority: addProjects.selectPiority,
      progress: addProjects.selectProgress * 1,
      note: addProjects.selectNote,
      callback: this.props.callback,
    };
    this.props.putProgress(data, selectedTaskId);
    this.setState({ openDialogProgress: false });
  };

  onSaveTranfer = () => {
    const { addProjects } = this.props;
    const id = addProjects._id;
    const data = {
      type: addProjects.typeTranfer,
    };

    if (addProjects.typeTranfer === 2) {
      if (!addProjects.tranferJoin.length && !addProjects.currentJoin.length) return;
      data.tranferEmployees = addProjects.tranferJoin.map(item => item._id);
      data.currentEmployees = addProjects.currentJoin.map(item => item._id);
    } else {
      if (!addProjects.tranferInCharge.length && !addProjects.currentInCharge.length) return;
      data.currentEmployees = addProjects.currentInCharge.map(item => item._id);
      data.tranferEmployees = addProjects.tranferInCharge.map(item => item._id);
    }

    this.props.postTranfer(data, id, null);
  };

  caculeDisable = value => {
    const { smallest, parentStatus, selectStatus } = this.props.addProjects;
    if ((selectStatus === 3 || selectStatus === 4 || selectStatus === 6) && selectStatus !== value) return true;
    if ([4, 5, 6].includes(parentStatus)) return true;
    if (value === 1) return true;
    if (selectStatus === 3 && value === 2 && !smallest) return true;
    return false;
  };

  selectTask = e => {
    const idSelect = e.target.value;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { projects } = this.props.addProjects;
    const check = projects.findIndex(item => item.parentId === idSelect);

    const data = { ...projects.find(item => item._id === idSelect) };
    const displayProgress = check === -1 && data.taskStatus === 2;
    let parentStatus;
    if (id === idSelect) parentStatus = this.props.addProjects.parentId ? this.props.addProjects.parentId.taskStatus : null;
    else {
      const parent = projects.find(item => data.parentId === item._id);
      parentStatus = parent ? parent.taskStatus : null;
    }
    this.props.mergeData({
      idSelect,
      selectPiority: data.priority,
      selectProgress: data.progress,
      selectStatus: data.taskStatus,
      displayProgress,
      parentStatus,
      smallest: check === -1,
    });
  };

  changeRatio = (index, value) => {
    const listRatio = this.props.addProjects.listRatio.map((it, idx) => (idx === index ? { ...it, ratio: value } : it));
    this.props.mergeData({ listRatio });
  };

  changeCostEstimate = (index, value) => {
    const listRatio = this.props.addProjects.listRatio.map((it, idx) => (idx === index ? { ...it, costEstimate: value } : it));
    this.props.mergeData({ listRatio });
  };

  changeTaskStatus = e => {
    const selectStatus = e.target.value;
    const { projects, idSelect } = this.props.addProjects;
    const check = projects.findIndex(item => item.parentId === idSelect);
    const displayProgress = check === -1 && selectStatus === 2;
    this.props.mergeData({ selectStatus, displayProgress });
  };

  onSaveFile = () => {
    const { url } = this.props.addProjects;
    this.props.postFile(url);
    this.setState({ openDialog: false });
  };

  handleChangeApproved(e, name) {
    const approvedObj = { ...this.props.addProjects.approvedObj };
    approvedObj[name] = e.target.value;
    this.props.mergeData({ approvedObj });
  }

  handleAddApprovedGroup = value => {
    const approvedObj = { ...this.props.addProjects.approvedObj };
    approvedObj.group = value;
    this.props.mergeData({ approvedObj });
  };

  saveApprove = () => {
    const { approvedObj, templates, projects } = this.props.addProjects;
    const exsist = templates.find(i => String(i._id) === String(approvedObj.form));
    let content = '';
    let dynamicForm = '';
    if (exsist) {
      content = exsist.content;
      dynamicForm = exsist._id;
    }
    if (approvedObj.group === null) {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Đồng chí phải nhập nhóm phê duyệt',
        variant: 'warning',
      });
    }

    if (approvedObj.form === '') {
      this.props.onChangeSnackbar({
        status: true,
        message: 'Đồng chí phải chọn biểu mẫu',
        variant: 'warning',
      });
    }

    const groupInfo = [];
    approvedObj.group.group.forEach(item => {
      groupInfo.push({
        order: item.order,
        person: item.person,
        approve: 0,
        reason: '',
      });
    });
    const itemCurrent = projects.find(item => item);

    const data = {
      name: approvedObj.name,
      subCode: approvedObj.subCode,
      collectionCode: 'Task',
      content,
      dataInfo: itemCurrent,
      dynamicForm,
      convertMapping: '5d832729c252b2577006c5ab',
      approveGroup: approvedObj.group._id,
      groupInfo,
      clientId,
    };
    this.props.postApprove(data);
    this.props.mergeData({
      anchorElMenu: null,
      openApproved: false,
      approvedObj: {
        name: '',
        subCode: 'Task',
        form: '',
        group: null,
      },
    });
  };

  handleCustomer = value => {
    const { employeesData } = this.props.addProjects;
    const newEmploy = employeesData.filter(item => item.type === value.type);
    this.props.mergeData({ customer: value, errorCustomer: value ? false : true });
  };

  mapFunctionDocument = item => {
    const { crmSource } = this.state;
    const typeDocumentArr = crmSource.find(elm => elm.code === 'S19').data;
    const urgencyArr = crmSource.find(elm => elm.code === 'S20').data;
    const whereArr = crmSource.find(elm => elm.code === 'S23').data;
    const storageArr = crmSource.find(elm => elm.code === 'S22').data;
    const densityArr = crmSource.find(elm => elm.code === 'S21').data;

    return {
      ...item,
      task: item['task.name'],
      receiverSign: item['receiverSign.name'],
      viewer: item['viewerName'],
      replyDispatch: item['replyDispatch.name'],
      type: item.type === '2' ? 'Công văn đến' : 'Công văn đi',
      typeDocument: typeDocumentArr.find(elm => elm.value === item.typeDocument)
        ? typeDocumentArr.find(elm => elm.value === item.typeDocument).title
        : item.typeDocument,
      urgency: urgencyArr.find(elm => elm.value === item.urgency) ? urgencyArr.find(elm => elm.value === item.urgency).title : item.urgency,
      where: whereArr.find(elm => elm.value === item.where) ? whereArr.find(elm => elm.value === item.where).title : item.where,
      storage: storageArr.find(elm => elm.value === item.storage) ? storageArr.find(elm => elm.value === item.storage).title : item.storage,
      density: densityArr.find(elm => elm.value === item.density) ? densityArr.find(elm => elm.value === item.density).title : item.density,
    };
  };

  mapFunctionCalendar = item => ({
    ...item,
    typeCalendar: item.typeCalendar === '1' ? 'Lịch cá nhân' : 'Lịch công tác',
    organizer: item['organizer.name'],
    task: item['task.name'],
    roomMetting: item['roomMetting.name'],
    approved: item['approved.name'],
  });

  getDetail = id => {
    this.setState({ docDetail: 'abc' });
  };

  onChangeFile = data => {
    // // console.log(e.target.files[0],'111');
    // const {localState} = this.state
    // const newFiles = [...localState.file];

    // const a = data.abc
    // newFiles.push(a);
    // this.setState({ localState: { ...localState, file: newFiles } })
    this.props.mergeData({ ...data });
  };

  saveDone = () => {
    // hoàn thành nè
    const { noteHistory, receiver } = this.state;
    const { addProjects, profile } = this.props;
    const dataSource = JSON.parse(localStorage.getItem('crmSource'));
    const dataValSource = dataSource && dataSource.find(item => item.code === 'S301');
    const dataVal = dataValSource ? dataValSource.data : [];
    const dataFm = dataVal && dataVal.find(i => i._id === addProjects.taskLevel);
    const dataTaskLevel = dataFm && dataFm.title;
    if (!receiver) {
      return this.props.onChangeSnackbar({ variant: 'error', message: 'Lấy dữ liệu người được đánh giá thất bại', status: false });
    }
    request(`${API_TASK_HISTORY}/${noteHistory}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskLevel: dataTaskLevel ? dataTaskLevel : '',
        receiver: receiver,
        reason: addProjects.reason ? addProjects.reason : '',
        statusAccept: 'Hoàn thành'
      }),
    })
      .then(response => response.data)
      .then(async res => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Đánh giá thành công', status: true });
        this.setState({ openEvaluate: false });
        this.reloadState();
      })
      .catch(error => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Đánh giá thất bại', status: false });
      });
  };

  saveContentId = () => {
    const { noteHistory } = this.state;
    const { addProjects } = this.props;
    const { textContent } = addProjects;
    request(`${API_TASK_HISTORY}/${noteHistory}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: textContent,
      }),
    })
      .then(response => response.data)
      .then(async res => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Thêm nội dung công việc thành công', status: true });
        this.setState({ openContent: false });
        this.reloadState();
      })
      .catch(error => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Thêm nội dung công việc thất bại', status: false });
      });
  };

  saveComplate = () => {
    const { noteHistory } = this.state;
    request(`${API_TASK_HISTORY}/${noteHistory}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // statusAccept: 'Hoàn thành',
        statusAccept: 'Chờ đánh giá',

      }),
    })
      .then(response => response.data)
      .then(async res => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Hoàn thành thành công', status: true });
        this.setState({ openCompleteAny: false });
        this.reloadState();
        this.handleSaveProject();
      })
      .catch(error => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Hoàn thành thất bại', status: false });
      });
  };

  reloadState = () => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    let obj = {};

    obj = {
      filter: {
        docId: id,
      },
    };

    fetch(`${API_TASK_HISTORY}?${serialize(obj)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        let checkInchage = false
        let listInCharge = []
        if (data.data && Array.isArray(data.data)) {
          data.data.map((el) => {
            if (el.action === "inchage")
              listInCharge.push(el)
          })
        }
        const found = listInCharge.find(element => element.statusAccept === "Trả lại");
        if (found)
          checkInchage = true
        this.setState({ dataHistory: data.data, checkInchage });
        const dataFm = data.data && data.data.filter(i => i.position === 'Phối hợp xử lý');
        const datainCharge = data.data && data.data.filter(i => i.position === 'Xử lý chính');
        this.props.mergeData({ support: dataFm, inCharge: datainCharge });
      });
    this.setState({ reload: new Date() * 1 });
  };

  saveDelete = () => {
    const dataFm = JSON.parse(localStorage.getItem('TaskTab'));
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { noteDig } = this.state;
    if (this.state.returnTask === false) {
      request(`${API_TASK_ACCEPT}/${dataFm.tab}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [id], action: false, note: noteDig }),
      })
        .then(response => response.data)
        .then(async res => {
          this.props.onChangeSnackbar({ variant: 'success', message: 'Từ chối thành công', status: true });
          this.setState({ openDelete: false });
          // this.reloadState();
          this.props.history.goBack();
        })
        .catch(error => {
          this.props.onChangeSnackbar({ variant: 'success', message: 'Từ chối thất bại', status: false });
        });
    } else {
      request(`${API_RETURN_TASK}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, note: noteDig }),
      })
        .then(response => response.data)
        .then(async res => {
          this.props.onChangeSnackbar({ variant: 'success', message: 'Trả lại thành công', status: true });
          this.setState({ openDelete: false });
          // this.reloadState();
          this.props.history.goBack();
        })
        .catch(error => {
          this.props.onChangeSnackbar({ variant: 'success', message: 'Trả lại thất bại', status: false });
        });
    }
  };

  saveAgree = () => {
    const dataFm = JSON.parse(localStorage.getItem('TaskTab'));
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { noteDig } = this.state;
    request(`${API_TASK_ACCEPT}/${dataFm.tab}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: [id], action: true, note: noteDig }),
    })
      .then(response => response.data)
      .then(async res => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Chấp nhận thành công', status: true });
        this.setState({ openInCharge: false });
        // this.reloadState();
        this.props.history.goBack();
      })
      .catch(error => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Chấp nhận thất bại', status: false });
      });
  };

  deleteDocs = index => {
    const newData = this.props.addProjects.incommingDocuments.filter(item => item._id !== index);
    this.props.mergeData({ incommingDocuments: newData });
  };
  deleteDocsOut = index => {
    const newData = this.props.addProjects.outGoingDocuments.filter(item => item._id !== index);
    this.props.mergeData({ outGoingDocuments: newData });
  };

  closeDialog = data => {
    this.setState({ openDialogFilter: false });
  };

  onSaveFilterDocs = (data, processType) => {
    if (processType === "outgoingDocument") {
      let newDataConcat = this.props.addProjects.outGoingDocuments;
      if (newDataConcat.length == 0) {
        newDataConcat = newDataConcat.concat(data);
      } else {
        newDataConcat.forEach(item => {
          const index = data.findIndex(i => i._id === item._id);
          if (index !== -1) {
            data.splice(index, 1);
          }
        });
        newDataConcat = newDataConcat.concat(data);
      }
      this.props.mergeData({ outGoingDocuments: newDataConcat });
      this.setState({ openDialogFilter: false });
    }
    else {
      let newDataConcat = this.props.addProjects.incommingDocuments;
      if (newDataConcat.length == 0) {
        newDataConcat = newDataConcat.concat(data);
      } else {
        newDataConcat.forEach(item => {
          const index = data.findIndex(i => i._id === item._id);
          if (index !== -1) {
            data.splice(index, 1);
          }
        });
        newDataConcat = newDataConcat.concat(data);
      }
      this.props.mergeData({ incommingDocuments: newDataConcat });
      this.setState({ openDialogFilter: false });
    }
  };

  onClickRow = (e, ids) => {
    e.preventDefault();
    // this.props.history.valueData = id;
    this.setState({ idEdit: ids, openEditDialog: true });
    // this.props.history.push(`/incomming-document-detail/${ids}`)
  };
  onClickRowOut = (e, ids) => {
    e.preventDefault();
    // this.props.history.valueData = id;
    this.setState({ idEdit: ids, openEditDialogOut: true });
    // this.props.history.push(`/incomming-document-detail/${ids}`)
  };

  deleteTaskDocs = index => {
    const newData = this.props.addProjects.dataTask.filter(item => item._id !== index);
    this.props.mergeData({ dataTask: newData });
  };

  onSaveTaskAssign = data => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { dataUser } = this.state;
    const { addProjects } = this.props;
    const { processors } = addProjects;
    let dataSupportUsers = data.supportUsers;
    let processingUsersFm = data.processingUsers;
    let allData = processingUsersFm && processingUsersFm.concat(dataSupportUsers);

    const dataProcessingUsers = dataUser && dataUser.filter(i => allData.find(t => t === i._id));
    // let newDataConcat = this.props.addProjects.dataTask
    // if (newDataConcat.length == 0) {
    //   newDataConcat = newDataConcat.concat(data)
    // } else {
    //   newDataConcat.forEach(item => {
    //     const index = data.findIndex(i => i._id === item._id)
    //     if (index !== -1) {
    //       data.splice(index, 1)
    //     }
    //   })
    //   newDataConcat = newDataConcat.concat(data)
    // }
    const titleTab = JSON.parse(localStorage.getItem('TaskTab'));
    const newProcessors = [...processors];

    const dataSupportFm = dataUser && dataUser.filter(i => dataSupportUsers.find(t => t._id === i._id));
    const dataprocessingUsersFm = processingUsersFm;

    this.props.mergeData({ dataTask: dataProcessingUsers });

    // for (let i = 0; i < dataProcessingUsers.length; i += 1) {
    //   newProcessors.push(dataFm);
    // }
    // console.log('newProcessors',newProcessors)
    // this.props.mergeData({ processors: newProcessors })

    this.listUers(dataprocessingUsersFm, dataProcessingUsers, allData);
    this.setState({ openTaskAsign: false });
  };
  listUers = (dataprocessingUsersFm, dataProcessingUsers, allData) => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addProjects, profile } = this.props;
    const { processors } = addProjects;
    const roleFm = dataprocessingUsersFm && dataprocessingUsersFm[0] && dataprocessingUsersFm[0]._id;
    const newProcessors = [...processors];
    const dataUserFm = addProjects.inCharge.concat(addProjects.support);

    // let newArr = [];

    for (let i = 0; i < allData.length; ++i) {
      const dataFm = {
        action: roleFm === allData[i]._id ? 'inchage' : 'support', // inchage || support
        position: roleFm === allData[i]._id ? 'Xử lý chính' : 'Phối hợp xử lý', // Xử lí chính hoặc phối hợp
        createdBy: profile._id,
        statusAccept: 'Đang thực hiện', //  đang xử lý ....
        taskLevel: '', // trạng thái: Tốt || Yếu
        receiver: allData[i] && allData[i]._id ? allData[i]._id : '', // người xử lý chính hoạc phối hợp
        note: '', // nhận xét
        name: allData[i] && allData[i].userName ? allData[i].userName : '',
      };
      processors.push(dataFm);
    }

    const dataTaskFm = processors && processors.filter(i => i.position === 'Phối hợp xử lý');

    const dataInCharge = processors && processors.filter(i => i.position === 'Xử lý chính');

    // console.log('dataTaskFm', dataTaskFm)

    // this.props.mergeData({ dataTask: dataProcessingUsers, inCharge: dataprocessingUsersFm, support: dataSupportFm, processors: dataFm })

    if (id === 'add') {
      this.props.mergeData({ processors: processors, support: dataTaskFm, inCharge: dataInCharge });
    } else {
      this.props.mergeData({ support: dataTaskFm, inCharge: dataInCharge });
    }

    if (id !== 'add' && processors.length > 0) {
      this.saveProccesor(id, processors);
      // this.reloadId();
    }
  };

  saveProccesor = (id, processors) => {
    let newArr = [];
    newArr = processors;
    const { noteHistory } = this.state;
    const { addProjects, profile } = this.props;
    // const { processors } = addProjects;
    request(`${API_TASK_HISTORY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        processors: newArr,
        docId: id,
      }),
    })
      .then(response => response.data)
      .then(async res => {
        // this.props.onChangeSnackbar({ variant: 'success', message: 'Thêm mới thành công', status: true });
        // this.setState({ openCompleteAny: false })
        this.reloadState();
      })
      .catch(error => {
        //console.log('error', error);
        // this.props.onChangeSnackbar({ variant: 'success', message: 'Hoàn thành thất bại', status: false });
      });
  };

  saveContent = () => {
    const { noteHistory } = this.state;
    const { addProjects } = this.props;
    const { textContent, processors } = addProjects;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (id === 'add') {
      processors[noteHistory].content = textContent;

      this.props.mergeData({ processors: processors });
      this.setState({ openContent: false });
    } else {
      this.saveContentId();
    }
  };

  deleteTaskEditDocs = id => {
    const { noteHistory } = this.state;
    request(`${API_TASK_HISTORY}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: [id],
      }),
    })
      .then(response => response.data)
      .then(async res => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Xóa người tham gia thành công', status: true });
        // this.setState({ openCompleteAny: false })
        // const newData = this.props.addProjects.processors.filter(item => item.receiver !== index)
        // this.props.mergeData({ processors: newData })
        this.reloadState();
      })
      .catch(error => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Xóa người tham gia thất bại', status: false });
      });
  };
  handleChangeTabsTask = (e, tab) => {
    this.setState({ tabTask: tab })
  }
  onSaveTask = data => {
    // console.log(data)
    // const { addProjects } = this.props;
    // let { taskAttached } = addProjects
    // if (taskAttached.length == 0) {
    //   taskAttached = taskAttached.concat(data);
    // } else {
    //   taskAttached.forEach(item => {
    //     const index = data.findIndex(i => i._id === item._id);
    //     if (index !== -1) {
    //       data.splice(index, 1);
    //     }
    //   });
    //   taskAttached = taskAttached.concat(data);
    // }
    // this.props.mergeData({ taskAttached: taskAttached });
    // this.setState({ openDialogTask: false })


    let taskAttachedd = this.state.taskAttachedd
    if (taskAttachedd.length == 0) {
      taskAttachedd = taskAttachedd.concat(data);
    } else {
      taskAttachedd.forEach(item => {
        const index = data.findIndex(i => i._id === item._id);
        if (index !== -1) {
          data.splice(index, 1);
        }
      });
      taskAttachedd = taskAttachedd.concat(data);
    }
    this.setState({ openDialogTask: false, taskAttachedd: taskAttachedd })
  };
  getCurrentData = () => {
    //console.log(this.state.dataLocal, 'his.state.dataLocal')
    this.props.mergeData({ addProjects: this.state.dataLocal });
  }
  handleDeleteTask = () => {
    // const newData = this.props.addProjects.taskAttached.filter(item => item._id !== this.state.idTaskDelete);
    // this.props.mergeData({ taskAttached: newData });
    // this.setState({ openDialogDeleteTask: false })

    const newData = this.state.taskAttachedd.filter(item => item._id !== this.state.idTaskDelete);

    this.setState({ openDialogDeleteTask: false, taskAttachedd: newData })
  }

  mapFunctionProject = (item) => {
    const priority = (priority) => {
      let data
      switch (priority) {
        case 1:
          return data = 'Rất cao'
        case 2:
          return data = 'Cao'
        case 3:
          return data = 'Trung bình'
        case 4:
          return data = 'Thấp'
        case 5:
          return data = 'Rất thấp'
      }
      return data;
    }

    const typeTask = (typeTask) => {
      let data;
      switch (typeTask) {
        case 1:
          return data = 'Xử lý công văn'
        case 2:
          return data = 'Xử lý công việc'
        case 3:
          return data = 'Xử lý hồ sơ'
        case 4:
          return data = 'Xử lý đơn thư'
        case 5:
          return data = 'Tốt'
        case 6:
          return data = 'Kém'
      }
      return data
    }

    return ({
      ...item,
      priority: priority(item.priority),
      typeTask: typeTask(item.typeTask)
    })
  }

  handleOpenDialogEditPorject(id) {
    this.setState({ openDialogEditProject: true, idDialogEditProject: id })
  }

  render() {
    const {
      tabIndex,
      tab,
      openDialogProgress,
      openAddProject,
      tabContract,
      names,
      currentStatus,
      randCover,
      checkRequired,
      checkShowForm,
      localMessages,
      openEvaluate,
      openCompleteAny,
      reload,
      taskData,
      openInCharge,
      openDelete,
      noteDig,
      docDetail,
      openDialogFilter,
      openEditDialog,
      openEditDialogOut,
      idEdit,
      openTaskAsign,
      dataHistory,
      dataPeople,
      openContent,
      view,
      roleGroup,
      checkInchage,
      tabTask,
      permission,
      permissionDoc,
      openDialogTask,
      openAddTask,
      openDialogDeleteTask,
      taskAttachedd = []
    } = this.state;
    const { addProjects, intl, profile, dashboardPage, miniActive, onChangeSnackbar } = this.props;
    const { currentUser } = dashboardPage;
    const {
      isProject,
      employees,
      selectTask,
      hideAddConversation,
      taskStage,
      listRatio,
      isObligatory,
      approvedObj,
      templates,
      parentId,
      projectName,
      projectId,
      taskAttached,
      loading
    } = addProjects;
    const bussines =
      this.props.dashboardPage &&
      this.props.dashboardPage.roleTask &&
      this.props.dashboardPage.roleTask.roles &&
      this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data;
    // const speciall =
    //   this.props.dashboardPage &&
    //   this.props.dashboardPage.roleTask &&
    //   this.props.dashboardPage.roleTask.roles &&
    //   this.props.dashboardPage.roleTask.roles.find(elm => elm.code === 'SPECIALL').data;

    const dataFm = JSON.parse(localStorage.getItem('TaskTab')) || {};
    const notParentId = dataFm && dataFm.tab && (dataFm.tab === 'inCharge' || dataFm.tab === 'support') ? true : null;
    const dataCallBack = dataFm && dataFm.tab && dataFm.tab === 'inCharge' ? 1 : dataFm && dataFm.tab && dataFm.tab === 'support' ? 2 : 0;
    const tabChildTask = dataFm && dataFm.tabChild;
    localStorage.setItem('taskCallBack', dataCallBack);
    localStorage.setItem('taskChildEditCallBack', tabChildTask);
    const dataSource = JSON.parse(localStorage.getItem('crmSource'));
    const dataValSource = dataSource && dataSource.find(item => item.code === 'S301');
    const dataVal = dataValSource ? dataValSource.data : [];

    // const obligate =
    //   Array.isArray(this.props.dashboardPage.roleTask.roles) && this.props.dashboardPage.roleTask.roles.find(item => item.code === 'SPECIALL');
    // const roleModuleObligate = obligate && obligate.data ? obligate.data : [];
    // const roleModuleObligateData =
    //   roleModuleObligate.find(elm => elm.name === 'obligate') && roleModuleObligate.find(elm => elm.name === 'obligate').data;

    // const roleCodeCalendar = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Calendar');
    // const roleCodeDocumentary = this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === 'Documentary');


    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const avt = addProjects.objectAvatar || addProjects.avatar || randCover;
    const nameTask = parentId ? projectName : addProjects.name;
    const idTask = parentId ? projectId : id;
    const dataTask = JSON.parse(localStorage.getItem('TaskTabData'));
    const dataFmTask = dataTask && dataTask.newList && dataTask.newList.find(i => i._id === id);

    const roleFm = addProjects.inCharge && addProjects.inCharge[0] && addProjects.inCharge[0]._id;

    const showButton = (id !== 'add' && dataHistory && dataHistory.find(i => i.receiver && i.receiver._id === profile._id)) || null;
    // Đang thực hiện, k phải thêm mới, là người đc giao
    const showButton1 = showButton && showButton.statusAccept && showButton.statusAccept === 'Đang thực hiện';
    // là người tạo, và chưa hoàn thành
    const showButton2 = addProjects.createdBy && addProjects.createdBy._id === profile._id && addProjects.statusAccept !== 'success';
    const dataCheckTask = showButton1 || showButton2;
    console.log(dataHistory, 'dataHistory')
    // const cantReturn = dataHistory.filter(item => item.receiver && item.receiver._id === profile._id && (item.position === "Xử lý chính" || item.position === "Phối hợp xử lý") && !item.statusAccept === "Đang thực hiện")
    // người tham gia với vai trò support hoặc xử lí chính đã thực hiện
    const cantReturn = dataHistory.filter(item => item.receiver && item.receiver._id === profile._id && (item.action === "support" || item.action === "inchage") && !(item.statusAccept === "Đang thực hiện"))

    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const list = viewConfig.find(item => item.code === 'HistoryTask');
    const dataTitle = (list && list.listDisplay && list.listDisplay.type.fields.type.columns) || [];

    const ButtonUI = props => (
      <Buttons onClick={() => this.handleChangeButton(props.tabIndex)} color={props.tabIndex === tabIndex ? 'gradient' : 'simple'}>
        {props.children}
      </Buttons>
    );

    let dayDiff = new Date(addProjects.endDate) - new Date();
    if (!dayDiff) dayDiff = 1;
    const day = Math.abs(dayDiff / 86400000);
    const hours = Math.abs((dayDiff % 86400000) / 3600000);
    const dayProgress =
      ((new Date() - new Date(addProjects.startDate)) * 100) / (new Date(addProjects.endDate) - new Date(addProjects.startDate)).toFixed();

    let fillColor = dayDiff > 0 ? 'blue' : 'red';
    if (addProjects.taskStatus === 3) fillColor = 'green';

    const general = () => {
      return (
        <Grid className="hello">
          <Grid item md={12}>
            <CustomAppBar
              title={'Chi tiết Công việc'}
              onGoBack={() => {
                if (this.props.location && this.props.location.state && this.props.location.state.idd !== undefined && this.props.page !== 'meetings') {
                  this.setState({ nonDisableAppBar: false })
                  this.props.history.push({
                    pathname: `/OutGoingDocument/${this.props.location.state.idd}`,
                    state: { status: true, localState: this.props.location.state.localState },
                  });
                } else if (this.props.goBack && this.props.page === 'meeting') {
                  this.setState({ nonDisableAppBar: false })
                  this.props.goBack ? this.props.goBack() : this.props.history.goBack();
                } else if (this.props.history && this.props.history.valueData && this.props.page !== 'meetings') {
                  this.setState({ nonDisableAppBar: false })
                  this.props.history.replace(`/OutGoingDocument/editGoDocuments/${this.props.history.valueData}`);
                } else if (this.props.onClose && this.props.page !== 'meetings') {
                  this.setState({ nonDisableAppBar: false })
                  return this.props.onClose();
                } else if (this.props.location && this.props.location.ids && this.props.page !== 'meetings') {
                  this.props.history.push('/Task');
                  setTimeout(() => {
                    this.props.history.push(`/Task/${this.props.location.ids}`);
                  }, 1);
                } if (this.props.location && this.props.location.idEdit && this.props.page !== 'meetings') {
                  this.props.history.push('/Task');
                  setTimeout(() => {
                    this.props.history.push(`/Task/task-detail/${this.props.location.idEdit}`);
                  }, 1);
                } else if (this.props.page === 'meetings') {
                  this.props.goback();
                } else if (this.props.page === 'meeting') {
                  this.props.goBack();
                } else {
                  !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
                }
              }}
              nonDisableAppBar={this.state.nonDisableAppBar}
              disableAdd
              moreButtons={
                
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {
                  console.log(dataFm, 'dataFm', dataCheckTask)
                }
                  {/* {id !== 'add' && dataCheckTask && (dataFm && dataFm.tab && dataFm.tab === 'inCharge' || dataFm && dataFm.tab && dataFm.tab === 'support') ? ( */}
                  {/* k phải thêm mới, có quyền thêm mới văn bản đi, và xử lý chính hoặc là phối hợp */}
                  {id !== 'add' && permissionDoc && (dataFm && dataFm.tab && dataFm.tab === 'inCharge' || dataFm && dataFm.tab && dataFm.tab === 'support') ? (

                    <Button
                      color="inherit"
                      variant="outlined"
                      disabled={loading}
                      onClick={() => {
                        this.props.history.push({
                          pathname: `/OutGoingDocument/add`,
                          state: {
                            dataTask: addProjects,
                          },
                        });
                      }}
                      component="span"
                      style={{ marginRight: 10, fontWeight: 'bold' }}
                    >
                      Tạo dự thảo
                    </Button>
                  ) : null}

                  {id !== 'add' && notParentId === true && addProjects && dataFmTask && dataFmTask.isAccept === false && !(cantReturn && Array.isArray(cantReturn) && cantReturn.length) ? (
                    <>
                      {/* <Button variant="outlined" color="inherit" style={{ marginRight: 10, fontWeight: 'bold' }}
                        onClick={e => {
                          this.setState({
                            openInCharge: true
                            returnTask: false,
                          })
                        }}
                      >
                        Đồng ý
                      </Button> */}
                      {/* <Button
                        variant="outlined"
                        color="inherit"
                        style={{ marginRight: 10, fontWeight: 'bold' }}
                        onClick={e => {
                          this.setState({
                            openDelete: true,
                            returnTask: false,
                          });
                        }}
                      >
                        Từ chối
                      </Button> */}
                      <Button
                        variant="outlined"
                        color="inherit"
                        disabled={loading}
                        style={{ marginRight: 10, fontWeight: 'bold' }}
                        onClick={e => {
                          this.setState({
                            openDelete: true,
                            returnTask: true,
                          });
                        }}
                      >
                        Trả lại
                      </Button>
                    </>
                  ) : null}

                  {addProjects.createdBy && addProjects.createdBy._id === profile._id && addProjects.statusAccept !== 'success' ? (
                    <Button
                      variant="outlined"
                      color="inherit"
                      disabled={loading}
                      style={{ marginRight: 10, fontWeight: 'bold' }}
                      onClick={this.handleSaveProjectComPlate}
                    >
                      Hoàn thành
                    </Button>
                  ) : null
                  }
                  {/* có quyền tạo hscv và hscv này k phải nó tạo và (đang ở tab  xử lý chính hoặc phối hợp) */}

                  {permission && !(addProjects.createdBy && addProjects.createdBy._id === profile._id) && dataFm && (dataFm.tab === "inCharge" || dataFm.tab === 'support') ? (
                    <Button
                      variant="outlined"
                      color="inherit"
                      disabled={loading}
                      style={{ marginRight: 10, fontWeight: 'bold' }}
                      onClick={() => {
                        this.setState({ dataLocal: addProjects, openAddTask: true })
                        // this.props.history.push({
                        //   pathname: `/Task/add`,
                        //   state: {
                        //     dataTask: addProjects,
                        //     getCurrentData: this.getCurrentData
                        //   },
                        // });
                      }}
                    >
                      Tạo hồ sơ công việc
                    </Button>
                  ) : null

                  }
                  {dataCheckTask ? (
                    <Button variant="outlined" color="inherit" disabled={loading} onClick={this.handleSaveProject} style={{ fontWeight: 'bold' }}>
                      Lưu
                    </Button>
                  ) : null}
                </div>
              }
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Tabs value={tabTask} onChange={this.handleChangeTabsTask} indicatorColor="primary">
              <Tab label={"THÔNG TIN CÔNG VIỆC"} />
              {addProjects._id &&  dataFm && dataFm.tab === "assignTask" && <Tab label={"HỒ SƠ CÔNG VIỆC LIÊN QUAN"} />}

              {/* {(addProjects.relateTo && Array.isArray(addProjects.relateTo) && addProjects.relateTo.length > 0) && dataFm.tab === "assignTask" && <Tab label={"HỒ SƠ CÔNG VIỆC LIÊN QUAN"} />} */}
            </Tabs>
          </Grid>
          <PaperUI style={{ zIndex: '1 !important' }}>
            {tabTask === 0 && (
              <>

                <Grid item container spacing={8}>
                  <Grid item spacing={8} md={8}>
                    <Grid item container spacing={8} md={12}>
                      <Grid item md={12}>
                        {/* <span style={{ fontSize: 14, fontWeight: 600 }}>THÔNG TIN CÔNG VIỆC</span> */}
                        <Grid container spacing={8} style={{ paddingTop: 20 }}>
                          <Grid item md={6}>
                            <CustomInputBase
                              label={_.get(names, 'name', 'Tên công việc')}
                              value={addProjects.name}
                              name="name"
                              className="setCustomInput"
                              disabled
                            />
                          </Grid>

                          <Grid item md={6}>
                            <AsyncAutocomplete
                              name="Chọn người được xem..."
                              label={'Người giao việc'}
                              url={API_USERS}
                              disabled
                              value={addProjects.taskMaster}
                              className="setCustomInput"
                            />
                          </Grid>

                          <Grid item md={6}>
                            <Grid item container spacing={8}>
                              <Grid item md={6}>
                                <CustomDatePicker
                                  label={_.get(names, 'startDate', 'Ngày bắt đầu')}
                                  value={addProjects.startDate}
                                  name="startDate"
                                  disabled
                                  className="setCustomInput"
                                  required={false}
                                />
                              </Grid>
                              <Grid item md={6}>
                                <CustomDatePicker
                                  label={_.get(names, 'endDate', 'Ngày kết thúc')}
                                  value={addProjects.endDate ? addProjects.endDate : null}
                                  name="endDate"
                                  disabled
                                  className="setCustomInput"
                                  required={false}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item md={6}>
                            <CustomInputBase
                              value={addProjects.typeTask}
                              label={_.get(names, 'typeTask', 'Loại công việc')}
                              disabled
                              className="setCustomInput"
                              select
                            >
                              {addProjects.configs.map((it, idx) => (
                                <MenuItem value={idx + 1} key={it.code}>
                                  {it.name}
                                </MenuItem>
                              ))}
                            </CustomInputBase>
                          </Grid>
                          {/* <Grid item md={6}>
                {(addProjects.hasRelatedProject || !!addProjects.relatedTask) && (
                  <AsyncAutocomplete
                    name="Chọn..."
                    label={'Công việc liên quan'}
                    url={API_TASK_CONTRACT_PROJECT}
                    value={addProjects.relatedTask}
                    disabled
                    className="setCustomInput"
                  />
                )}
              </Grid> */}

                          <Grid item md={6}>
                            <React.Fragment>
                              <AsyncAutocomplete
                                name="Chọn..."
                                label={_.get(names, 'template', 'Quy trình thực hiện')}
                                filter={{
                                  type: 'Task',
                                }}
                                url={API_SAMPLE_PROCESS}
                                value={addProjects.template}
                                disabled
                                className="setCustomInput"
                                disablePlaceholder
                              />
                            </React.Fragment>
                          </Grid>

                          {/* <Grid item md={6}>
                {(addProjects.hasRelatedDocument || !!addProjects.relatedDoc) && (
                  <AsyncAutocomplete
                    optionValue="id"
                    optionLabel="label"
                    name="Chọn..."
                    label={'Văn bản đính kèm'}
                    url={API_INCOMMING_DOCUMENT}
                    value={addProjects.relatedDoc}
                    disabled
                    className="setCustomInput"
                  />
                )}
              </Grid> */}

                          <Grid item md={6}>
                            <TextField
                              fullWidth
                              select
                              label={_.get(names, 'priority', 'Độ ưu tiên')}
                              value={addProjects.priority}
                              name="priority"
                              InputLabelProps={{ shrink: true }}
                              disabled
                              className="setCustomInput"
                            >
                              {taskPrioty.map((it, id) => (
                                <MenuItem key={it} value={id + 1}>
                                  {it}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          {/* <Grid item md={6}>
                <AsyncAutocomplete
                  isMulti
                  name="Chọn người quản lý..."
                  label={_.get(names, 'inCharge', 'Xử lý chính')}
                  disabled
                  className="setCustomInput"
                  url={API_USERS}
                  filter={addProjects.support && addProjects.support.length ? { _id: { $nin: addProjects.support.map(item => item._id) } } : {}}
                  value={addProjects.inCharge}
                />
              </Grid> */}
                          {/* <Grid item md={6}>
                <AsyncAutocomplete
                  isMulti
                  name="Chọn người được xem..."
                  label={_.get(names, 'support', 'Phối hợp xử lý')}
                  url={API_USERS}
                  filter={addProjects.inCharge && addProjects.inCharge.length ? { _id: { $nin: addProjects.inCharge.map(item => item._id) } } : {}}
                  value={addProjects.support}
                  disabled
                  className="setCustomInput"
                />
              </Grid> */}
                          <input
                            onChange={this.onSelectImg}
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="contained-button-file"
                            multiple
                            type="file"
                          />
                        </Grid>
                      </Grid>

                      {/* <Grid item md={12}  >
            {roleModuleObligateData && roleModuleObligateData.access === true
              ? (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    onChange={e => this.props.mergeData({ isObligatory: e.target.checked })}
                    color="primary"
                    checked={isObligatory}
                    disabled={speciall && speciall.find(elm => elm.name === 'obligate').data.access !== true}
                  />
                  Bắt buộc tham gia
                </span>
              )
              : null}
          </Grid> */}

                      <Grid item md={12}>
                        <CustomInputBase
                          value={addProjects.description}
                          label={_.get(names, 'description', 'Nội dung công việc')}
                          rows={5}
                          multiline
                          name="description"
                          disabled
                          className="setCustomInput"
                        />
                      </Grid>

                      <Grid item xs={12} style={{ marginTop: 20 }}>
                        {docDetail && (
                          <FileUpload
                            view={view}
                            newWay
                            name={docDetail}
                            onChangeFile={this.onChangeFile}
                            id={id}
                            code="Task"
                            profile={profile}
                            checkDisableEditTask
                            isCreator
                            dataCheckTask={dataCheckTask}
                            checkTabs={dataFm}
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} style={{ marginTop: 20 }}>
                        <span style={{ marginRight: 10, fontSize: 14, fontWeight: 600, width: 200, display: 'inline-block' }}>VĂN BẢN ĐẾN ĐÍNH KÈM </span>
                        {id !== 'add' && dataCheckTask ? (
                          <label style={{ display: 'inline-block', marginRight: 10 }}>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={() => {
                                this.setState({ openDialogFilter: true, processType: "incomingDocument" });
                              }}
                              component="span"
                              style={{ fontWeight: 'bold' }}
                            >
                              {/* <span style={{ marginRight: 5 }}>
                    <Search />
                  </span> */}
                              <span style={{ fontWeight: 'bold' }}>Tìm kiếm</span>
                            </Button>
                          </label>
                        ) : null}
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ alignItems: 'center', fontWeight: 'bold', width: '20%' }}>Số văn bản</TableCell>
                              <TableCell style={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold', width: '20%' }}>Ngày văn bản</TableCell>
                              <TableCell style={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold', width: '40%' }}>Trích yếu</TableCell>
                              {id === 'add' || dataCheckTask ? (
                                <TableCell style={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold', width: '20%' }}>Hành động</TableCell>
                              ) : null}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Array.isArray(addProjects.incommingDocuments) &&
                              addProjects.incommingDocuments.length > 0 &&
                              addProjects.incommingDocuments.map((item, index) => {
                                return (
                                  <TableRow>
                                    <TableCell
                                      style={{ cursor: 'pointer', alignItems: 'center', width: '20%', color: "blue" }}
                                      onClick={e => this.onClickRow(e, item._id)}
                                    >
                                      {item.toBook}
                                    </TableCell>
                                    <TableCell
                                      style={{ cursor: 'pointer', alignItems: 'center', width: '20%', color: "blue" }}
                                      onClick={e => this.onClickRow(e, item._id)}
                                    >
                                      {moment(item.documentDate).format('DD/MM/YYYY') === 'Invalid date'
                                        ? item.documentDate
                                        : moment(item.documentDate).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell style={{ cursor: 'pointer', width: '40%' }} onClick={e => this.onClickRow(e, item._id)}>
                                      <span
                                        style={{
                                          alignItems: 'center',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          WebkitLineClamp: 3,
                                          display: '-webkit-box',
                                          WebkitBoxOrient: 'vertical',
                                          textAlign: 'center',
                                          minWidth: 220,
                                          maxWidth: 350,
                                          color: "blue"
                                        }}
                                      >
                                        {item.abstractNote}
                                      </span>
                                    </TableCell>
                                    {dataCheckTask ? (
                                      <TableCell style={{ alignItems: 'center', textAlign: 'center', width: '20%' }}>
                                        <Tooltip title="Xóa văn bản">
                                          <Delete style={{ cursor: 'pointer' }} onClick={() => this.deleteDocs(item._id)} />
                                        </Tooltip>
                                      </TableCell>
                                    ) : (
                                      <TableCell style={{ alignItems: 'center', textAlign: 'center', width: '20%' }} />
                                    )}
                                    {id === 'add' ? (
                                      <TableCell style={{ alignItems: 'center', textAlign: 'center', width: '20%' }}>
                                        <Tooltip title="Xóa văn bản">
                                          <Delete
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                              this.deleteDocs(item._id);
                                            }}
                                          />
                                        </Tooltip>
                                      </TableCell>
                                    ) : null}
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </Grid>

                      <Grid item xs={12} style={{ marginTop: 20 }}>
                        <span style={{ marginRight: 10, fontSize: 14, fontWeight: 600, width: 200, display: 'inline-block' }}>VĂN BẢN ĐI ĐÍNH KÈM</span>
                        {id !== 'add' && dataCheckTask ? (
                          <label style={{ display: 'inline-block', marginRight: 10 }}>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={() => {
                                this.setState({ openDialogFilter: true, processType: "outgoingDocument" });
                              }}
                              component="span"
                              style={{ fontWeight: 'bold' }}
                            >
                              {/* <span style={{ marginRight: 5 }}>
                    <Search />
                  </span> */}
                              <span style={{ fontWeight: 'bold' }}>Tìm kiếm</span>
                            </Button>
                          </label>
                        ) : null}
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ alignItems: 'center', fontWeight: 'bold', width: '20%' }}>Số văn bản</TableCell>
                              <TableCell style={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold', width: '20%' }}>Ngày văn bản</TableCell>
                              <TableCell style={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold', width: '40%' }}>Trích yếu</TableCell>
                              {id === 'add' || dataCheckTask ? (
                                <TableCell style={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold', width: '20%' }}>Hành động</TableCell>
                              ) : null}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Array.isArray(addProjects.outGoingDocuments) &&
                              addProjects.outGoingDocuments.length > 0 &&
                              addProjects.outGoingDocuments.map((item, index) => {
                                return (
                                  <TableRow>
                                    <TableCell
                                      style={{ cursor: 'pointer', alignItems: 'center', width: '20%', color: "blue" }}
                                      onClick={e => this.onClickRowOut(e, item._id)}
                                    >
                                      {item.toBook}
                                    </TableCell>
                                    <TableCell
                                      style={{ cursor: 'pointer', alignItems: 'center', width: '20%', color: "blue" }}
                                      onClick={e => {
                                        this.onClickRowOut(e, item._id)
                                      }}
                                    >
                                      {moment(item.documentDate).format('DD/MM/YYYY') === 'Invalid date'
                                        ? item.documentDate
                                        : moment(item.documentDate).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell style={{ cursor: 'pointer', width: '40%', color: "blue" }} onClick={e => this.onClickRowOut(e, item._id)}>
                                      <span
                                        style={{
                                          alignItems: 'center',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          WebkitLineClamp: 3,
                                          display: '-webkit-box',
                                          WebkitBoxOrient: 'vertical',
                                          textAlign: 'center',
                                          minWidth: 220,
                                          maxWidth: 350,
                                        }}
                                      >
                                        {item.abstractNote}
                                      </span>
                                    </TableCell>
                                    {dataCheckTask ? (
                                      <TableCell style={{ alignItems: 'center', textAlign: 'center', width: '20%' }}>
                                        <Tooltip title="Xóa văn bản">
                                          <Delete style={{ cursor: 'pointer' }} onClick={() => this.deleteDocsOut(item._id)} />
                                        </Tooltip>
                                      </TableCell>
                                    ) : (
                                      <TableCell style={{ alignItems: 'center', textAlign: 'center', width: '20%' }} />
                                    )}
                                    {id === 'add' ? (
                                      <TableCell style={{ alignItems: 'center', textAlign: 'center', width: '20%' }}>
                                        <Tooltip title="Xóa văn bản">
                                          <Delete
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                              this.deleteDocsOut(item._id);
                                            }}
                                          />
                                        </Tooltip>
                                      </TableCell>
                                    ) : null}
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </Grid>

                      <Grid item xs={12} style={{ marginTop: 20 }}>
                        <span style={{ marginRight: 10, fontSize: 14, fontWeight: 'bold', color: 'black' }}>HỒ SƠ CÔNG VIỆC LIÊN QUAN</span>
                        <label style={{ display: 'inline-block', marginRight: 10 }}>
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={() => {
                              // setOpenDialogTask(true);
                              this.setState({ openDialogTask: true })
                            }}
                            component="span"
                          >
                            {/* <span style={{ marginRight: 5 }}>
                    <Search />
                  </span> */}
                            <span style={{ fontWeight: 'bold' }}>Tìm kiếm</span>
                          </Button>
                        </label>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ cursor: 'pointer', alignItems: 'center', fontWeight: 'bold' }}>
                                Tên công việc
                              </TableCell>
                              <TableCell

                                style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left', fontWeight: 'bold' }}
                              >
                                Loại công việc
                              </TableCell>
                              <TableCell
                                c
                                style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left', fontWeight: 'bold' }}
                              >
                                Nội dung công việc
                              </TableCell>
                              <TableCell

                                style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left', fontWeight: 'bold' }}
                              >
                                Hành động
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Array.isArray(taskAttachedd) &&
                              taskAttachedd.length > 0 &&
                              taskAttachedd.map(item => {
                                return (
                                  <TableRow>
                                    <TableCell
                                      // onClick={() => {
                                      //   if (this.props.page !== 'meetings') {
                                      //     if (this.props.page === 'meeting') {
                                      //       this.handleOpenDialogEditPorject(item._id)
                                      //     } else {
                                      //       this.props.history.push(`/Task`);
                                      //       setTimeout(() => {
                                      //         this.props.history.push({
                                      //           pathname: `/Task/task-detail/${item._id}`,
                                      //           idEdit: id,
                                      //         });
                                      //       }, 1);
                                      //     }
                                      //   }
                                      // }}

                                      style={{ cursor: 'pointer', alignItems: 'center' }}
                                    >
                                      {item.name}
                                    </TableCell>
                                    <TableCell
                                      // onClick={() => {
                                      //   if (this.props.page !== 'meetings') {
                                      //     if (this.props.page === 'meeting') {
                                      //       this.handleOpenDialogEditPorject(item._id)
                                      //     } else {
                                      //       this.props.history.push(`/Task`);
                                      //       setTimeout(() => {
                                      //         this.props.history.push({
                                      //           pathname: `/Task/task-detail/${item._id}`,
                                      //           idEdit: id,
                                      //         });
                                      //       }, 1);
                                      //     }
                                      //   }
                                      // }}

                                      style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left' }}
                                    >
                                      {item.typeTask}
                                    </TableCell>
                                    <TableCell
                                      // onClick={() => {
                                      //   if (this.props.page !== 'meetings') {
                                      //     if (this.props.page === 'meeting') {
                                      //       this.handleOpenDialogEditPorject(item._id)
                                      //     } else {
                                      //       this.props.history.push(`/Task`);
                                      //       setTimeout(() => {
                                      //         this.props.history.push({
                                      //           pathname: `/Task/task-detail/${item._id}`,
                                      //           idEdit: id,
                                      //         });
                                      //       }, 1);
                                      //     }
                                      //   }
                                      // }}

                                      style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left' }}
                                    >
                                      {item.description}
                                    </TableCell>
                                    <TableCell
                                    // onClick={() => {
                                    //   this.props.history.push({
                                    //     pathname: `/Task/task-detail/${item._id}`,
                                    //     state: {
                                    //       idd: id ? id : "add",
                                    //       // localState: JSON.stringify(localState)
                                    //     }
                                    //   });
                                    // }}

                                    style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left' }}
                                    >
                                      <Tooltip title="Xóa">
                                        <Delete
                                          style={{ cursor: 'pointer' }}
                                          onClick={e => {
                                            this.setState({ openDialogDeleteTask: true, idTaskDelete: item._id })
                                          }}
                                        />
                                      </Tooltip>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item spacing={8} md={4}>
                    {id && (
                      <Comment
                        profile={profile}
                        code={'Task'}
                        id={id}
                        checkDisableEditTask
                        dataCheckTask={dataCheckTask}
                        viewOnly={
                          (dataFm && dataFm.tabChild === 6) ||
                            (id !== 'add' && notParentId === true && addProjects && dataFmTask && dataFmTask.isAccept === false)
                            ? true
                            : false
                        }
                        // isAuthory={isAuthory}
                        // viewOnly={currentTab !== 0 }
                        // viewOnly={
                        //   (isProcessorsAuthor || isCommanders || isCommandersAuthor || isProcessors)
                        //     ? false
                        //     : (
                        //       isProcesseds ||
                        //       isCommandeds ||
                        //       isProcessedsAuthor ||
                        //       isCommandered ||
                        //       isCommanderedAuthor ||
                        //       isSupported ||
                        //       isSupportedAuthor ||
                        //       isViewers ||
                        //       isViewered ||
                        //       isVieweredAuthor
                        //     )
                        // }
                        disableLike
                        revert
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} style={{ marginTop: 20 }}>
                    <span style={{ marginRight: 10, fontSize: 14, fontWeight: 600, width: 140, display: 'inline-block' }}>NGƯỜI THAM GIA</span>
                    {id !== 'add' && showButton2 ? (
                      <label style={{ display: 'inline-block', marginRight: 10 }}>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => {
                            if (!dataPeople && !Array.isArray(dataPeople)) {
                              this.props.onChangeSnackbar({ status: true, message: 'Vui lòng thiết lập lập luồng', variant: 'error' });
                            }
                            this.setState({ openTaskAsign: true });
                          }}
                          component="span"
                          style={{ fontWeight: 'bold' }}
                        >
                          {/* <span style={{ marginRight: 5 }}>
                <Search />
              </span> */}
                          Tìm kiếm
                        </Button>
                      </label>
                    ) : null}

                    {id !== 'add' && (
                      <Grid item xs={12} style={{ marginTop: 20, overflowX: 'auto' }}>
                        {/* <span style={{ fontSize: 12, fontWeight: 600 }}>THÔNG TIN GỬI NHẬN</span> */}
                        <Table>
                          <TableHead>
                            <TableRow>
                              {Array.isArray(dataTitle) &&
                                dataTitle.length > 0 &&
                                dataTitle.map(item => {
                                  return <TableCell style={{ alignItems: 'center', fontWeight: 'bold' }}>{item.title}</TableCell>;
                                })}
                              <TableCell style={{ alignItems: 'center', fontWeight: 'bold', textAlign: 'center' }}>Hành động</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {Array.isArray(dataHistory) &&
                              dataHistory.length > 0 &&
                              dataHistory.map((item, index) => {
                                return (
                                  <TableRow>
                                    <TableCell style={{ alignItems: 'center' }}>{item.receiver && item.receiver.name}</TableCell>
                                    <TableCell style={{ alignItems: 'center' }}>
                                      {item.roleGroup
                                        ? roleGroup.find(i => i.code === item.roleGroup)
                                          ? roleGroup.find(i => i.code === item.roleGroup).name
                                          : null
                                        : ''}
                                    </TableCell>
                                    <TableCell style={{ alignItems: 'center' }}>
                                      {item.receiver && item.receiver.organizationUnit && item.receiver.organizationUnit.name}
                                    </TableCell>
                                    <TableCell style={{ alignItems: 'center' }}>{item.position}</TableCell>

                                    <TableCell style={{ alignItems: 'center' }}>
                                      {item.content ? (
                                        <div>
                                          <span
                                            style={{
                                              alignItems: 'center',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                              WebkitLineClamp: 3,
                                              display: '-webkit-box',
                                              WebkitBoxOrient: 'vertical',
                                              maxWidth: 500,
                                            }}
                                          >
                                            {item.content}
                                          </span>
                                          {showButton2 ? (
                                            <Button
                                              style={{ textTransform: 'inherit', cursor: 'pointer', marginTop: 10 }}
                                              variant="contained"
                                              size="small"
                                              color="primary"
                                              onClick={() => {
                                                this.setState({ openContent: true, noteHistory: item._id });
                                                this.props.mergeData({ textContent: item.content });
                                              }}
                                            >
                                              Sửa nội dung
                                            </Button>
                                          ) : null}
                                        </div>
                                      ) : (
                                        <>
                                          {id !== 'add' && showButton2 ? (
                                            <Button
                                              style={{ textTransform: 'inherit', cursor: 'pointer' }}
                                              variant="contained"
                                              size="small"
                                              color="primary"
                                              onClick={() => {
                                                this.setState({ openContent: true, noteHistory: item._id });
                                                this.props.mergeData({ textContent: '' });
                                              }}
                                            >
                                              Nội dung
                                            </Button>
                                          ) : null}
                                        </>
                                      )}
                                    </TableCell>
                                    <TableCell style={{ alignItems: 'center' }}>{item.statusAccept}</TableCell>

                                    <TableCell style={{ alignItems: 'center' }}>

                                      {item.taskLevel}
                                      {showButton2 &&
                                        // item.statusAccept === 'Hoàn thành' &&
                                        item.statusAccept === 'Chờ đánh giá' &&
                                        (!item.taskLevel || item.taskLevel === '' || item.taskLevel === null) ? (
                                        <Button
                                          style={{ textTransform: 'inherit', cursor: 'pointer' }}
                                          variant="outlined"
                                          size="small"
                                          color="primary"
                                          disabled={loading}
                                          onClick={() => {
                                            this.setState({ openEvaluate: true, noteHistory: item._id, receiver: item.receiver && item.receiver._id || "" });
                                            this.props.mergeData({ taskLevel: null, reason: '' });
                                          }}
                                        >
                                          Đánh giá
                                        </Button>
                                      ) : null}
                                    </TableCell>
                                    <TableCell style={{ alignItems: 'center' }}>{item.reason}</TableCell>
                                    <TableCell style={{ alignItems: 'center' }}>{item.returnReason ? item.returnReason : "  "}</TableCell>
                                    <TableCell style={{ alignItems: 'center', textAlign: 'center' }}>
                                      {(item.receiver && item.receiver._id) === this.props.profile._id && item.statusAccept === 'Đang thực hiện' ? (
                                        <Button
                                          style={{ textTransform: 'inherit', cursor: 'pointer' }}
                                          variant="contained"
                                          size="small"
                                          color="primary"
                                          disabled={loading}
                                          onClick={() => {
                                            this.setState({ openCompleteAny: true, noteHistory: item._id });
                                          }}
                                        >
                                          Hoàn thành
                                        </Button>
                                      ) : null}
                                      {addProjects.createdBy && addProjects.createdBy._id === profile._id && addProjects.statusAccept !== 'success' ? (
                                        <Tooltip title="Xóa người tham gia">
                                          <Delete style={{ cursor: 'pointer' }} onClick={() => this.deleteTaskEditDocs(item._id)} />
                                        </Tooltip>
                                      ) : null}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
            {/* tab hscv liên quan */}
            {/* ở tab giao việc những  hscv */}
            {/* xem ds các cv con */}
            {/* {tabTask === 1 && dataFm.tab === "assignTask" && (addProjects.relateTo && Array.isArray(addProjects.relateTo) && addProjects.relateTo.length > 0) && ( */}
          
            {addProjects._id && tabTask === 1  && dataFm && dataFm.tab === "assignTask" && (
              <>
                <ListPage
                  disableEdit
                  disableAdd
                  disableViewConfig
                  disableDelete
                  // mapFunction={mapFunction}
                  filter={{ _id: addProjects && addProjects.relateTo && Array.isArray(addProjects.relateTo) && addProjects.relateTo.length && addProjects.relateTo[0] || "11111111111111111111111a"}}
                  disableImport
                  pointerCursor="pointer"
                  code="Task"
                  apiUrl={`${API_TASK_PROJECT}/projects`}
                  height="calc(100vh - 310px)"
                  mapFunction={this.mapFunctionProject}
                  onRowClick={(el) => {
                    this.props.history.push({
                      pathname: `/Task/task-detail/${el._id}`,
                      state: {
                        // idd: id ? id : 'add',
                        flag: true,
                        id: id,
                        // localState: JSON.stringify(localState),
                      },
                    })
                    this.setState({ tabTask: 0, nonDisableAppBar: false })
                  }}
                // parent
                />
              </>
            )}


            <Dialog
              title="Đánh giá"
              onSave={this.saveDone}
              saveText="Đánh giá"
              open={openEvaluate}
              onClose={() => this.setState({ openEvaluate: false, receiver: "" })}
            >
              <CustomInputBase
                value={addProjects.taskLevel}
                label={_.get(names, 'taskLevel', 'Mức độ hoàn thành')}
                checkedShowForm={checkShowForm.taskLevel}
                required={checkRequired.taskLevel}
                error={localMessages && localMessages.taskLevel}
                helperText={localMessages && localMessages.taskLevel}
                onChange={e => {
                  this.props.mergeData({ taskLevel: e.target.value });
                }}
                select
                className={checkRequired.taskLevel ? 'CustomRequiredLetter' : 'CustomIconRequired'}
              >
                {dataVal.map((it, idx) => (
                  <MenuItem key={it._id} value={it._id}>
                    {it.title}
                  </MenuItem>
                ))}
              </CustomInputBase>

              <CustomInputBase
                value={addProjects.reason}
                label="Lý do"
                onChange={e => {
                  this.props.mergeData({ reason: e.target.value });
                }}
                name="reason"
                className={'CustomIconRequired'}
                rows={5}
                multiline
              />
            </Dialog>

            <Dialog
              title="Nội dung công việc"
              onSave={this.saveContent}
              saveText="Lưu"
              open={openContent}
              onClose={() => this.setState({ openContent: false })}
            >
              <CustomInputBase
                value={addProjects.textContent}
                label="Nội dung"
                onChange={e => {
                  this.props.mergeData({ textContent: e.target.value });
                }}
                name="textContent"
                className={'CustomIconRequired'}
                rows={5}
                multiline
              />
            </Dialog>

            <Dialog
              title="Bạn có chắc chắn hoàn thành không"
              onSave={this.saveComplate}
              saveText="Hoàn thành"
              open={openCompleteAny}
              onClose={() => this.setState({ openCompleteAny: false })}
            />

            <Dialog
              title="Đồng chí có chắc chắn muốn đồng ý không ?"
              onSave={this.saveAgree}
              saveText="Đồng ý"
              open={openInCharge}
              onClose={() => this.setState({ openInCharge: false })}
            >
              <CustomInputBase
                multiline
                rows={4}
                value={noteDig}
                name="note"
                onChange={e => this.setState({ noteDig: e.target.value })}
                label="Nội dung"
              />
            </Dialog>

            <Dialog
              title={this.state.returnTask === true ? 'Đồng chí có chắc chắn muốn trả lại không ?' : 'Đồng chí có chắc chắn muốn từ chối không ?'}
              onSave={this.saveDelete}
              saveText={this.state.returnTask === true ? 'Trả lại' : 'Từ chối'}
              open={openDelete}
              onClose={() => this.setState({ openDelete: false })}
            >
              <CustomInputBase
                multiline
                rows={4}
                value={noteDig}
                name="note"
                onChange={e => this.setState({ noteDig: e.target.value })}
                label="Lý do trả lại"
              />
            </Dialog>

            <DocumentAssignModal
              inCharge={addProjects.processors}
              historyTask={dataHistory}
              open={openTaskAsign}
              onSave={this.onSaveTaskAssign}
              docIds={id}
              // template={selectedTemplate}
              // saveAndSend={saveAndSend}
              onClose={() => {
                this.setState({ openTaskAsign: false });
                // setOpenAsignProcessor(false);
                // setSelectedTemplate(null);
              }}
              position={this.state.position}
              // onSuccess={() => {
              //   setOpenAsignProcessor(false);
              //   setSelectedTemplate(null);
              //   cb();
              // }}
              onChangeSnackbar={onChangeSnackbar}
              currentRole={profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId}
              // allTemplates={allTemplates}
              // businessRole={businessRole}
              filterPeople={dataPeople && dataPeople}
              checkInchage={checkInchage}
            />
            {/* văn bản đến  */}
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.setState({ openEditDialog: false, idEdit: null })}
              open={openEditDialog}
              width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
            >
              <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
                <EditExecutiveDocuments id={idEdit} goBack={() => this.setState({ openEditDialog: false, idEdit: null })} />
              </div>
            </SwipeableDrawer>


            {/* văn bản đi */}
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.setState({ openEditDialogOut: false })}
              open={openEditDialogOut}
              width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
            >
              <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
                <EditGoDocuments id={idEdit} goBack={() => this.setState({ openEditDialogOut: false })} goBackTask={() => this.props.history.goBack()} />
              </div>
            </SwipeableDrawer>
            {/* hồ sơ công việc */}
            {
              openAddTask && <SwipeableDrawer
                anchor="right"
                onClose={() => {
                  this.setState({ openAddTask: false })
                  // this.getCurrentData()
                }}
                open={openAddTask}
                width={window.innerWidth - 260}
              >
                <Grid item xs={12} md={12} style={{ width: window.innerWidth - 260 }}>
                  <Addtask onClose={() => {
                    this.setState({ openAddTask: false })
                    // this.getCurrentData()
                  }}
                    ID={id} addProjectsCurrent={addProjects} />

                </Grid>
              </SwipeableDrawer>
            }
            {
              this.state.openDialogFilter && <Dialog dialogAction={false} onClose={this.closeDialog} open={this.state.openDialogFilter}>
                <FilterDocs onSave={this.onSaveFilterDocs} handleCloseFilter={this.closeDialog} onChangeSnackbar={onChangeSnackbar} processType={this.state.processType} profile={this.props.profile}/>
              </Dialog>
            }

          </PaperUI>
        </Grid>
      );
    };
    return (
      <div className="project-main">
        <div className="bg-color" />
        <Helmet>
          <title>Công việc</title>
          <meta name="description" content="Description of AddProjects" />
        </Helmet>
        <ValidatorForm onSubmit={this.handleSaveProject}>
          {this.props.id ? null : (
            <Breadcrumbs
              links={[
                { title: 'Dashboard', to: '/' },
                {
                  title: 'Dự án',
                  to: '/Task',
                },
              ]}
              title={addProjects.name || 'Thêm mới'}
            />
          )}
          {(this.props.id ? this.props.id : this.props.match.params.id) === 'add' ? (
            <div>
              {this.props.data.isProject ? (
                <div className="add-project">
                  <TaskType
                    hanldeClick={() => this.props.mergeData({ selectTask: false, type: 1 })}
                    icon={<NetworkLocked style={{ fontSize: '5rem' }} />}
                    description={intl.formatMessage(messages.tieudebaomat || { id: 'tieudebaomat', defaultMessage: 'tieudebaomat' })}
                    title={intl.formatMessage(messages.nhombaomat || { id: 'nhombaomat', defaultMessage: 'nhombaomat' })}
                    background="linear-gradient(45deg, #464846, #5f5f5f)"
                  />
                  <TaskType
                    background="linear-gradient(45deg, #2196F3, #72c7edeb)"
                    hanldeClick={() => this.props.mergeData({ selectTask: false, type: 4 })}
                    icon={<Group style={{ fontSize: '5rem' }} />}
                    description={intl.formatMessage(messages.tieudecongkhai || { id: 'tieudecongkhai', defaultMessage: 'tieudecongkhai' })}
                    title={intl.formatMessage(messages.nhomcongkhai || { id: 'nhomcongkhai', defaultMessage: 'nhomcongkhai' })}
                  />
                  {/* {speciall && speciall.find(elm => elm.name === 'addSpecial').data.access === true ? (
                    <TaskType
                      background="linear-gradient(45deg, rgb(246, 61, 47), #ff9d95)"
                      hanldeClick={() => this.props.mergeData({ selectTask: false, type: 2 })}
                      icon={<PersonAddDisabled style={{ fontSize: '5rem' }} />}
                      description={intl.formatMessage(messages.tieudecongkhai || { id: 'tieudean', defaultMessage: 'tieudean' })}
                      title={intl.formatMessage(messages.nhoman || { id: 'nhoman', defaultMessage: 'nhoman' })}
                    />
                  ) : null} */}

                  <TaskType
                    background="linear-gradient(45deg, #4CAF50, #90ce48)"
                    hanldeClick={() => this.props.mergeData({ selectTask: false, type: 3 })}
                    icon={<GroupAdd style={{ fontSize: '5rem' }} />}
                    description={intl.formatMessage(messages.tieudecongkhai || { id: 'tieudemorong', defaultMessage: 'tieudemorong' })}
                    title={intl.formatMessage(messages.nhommorong || { id: 'nhommorong', defaultMessage: 'nhommorong' })}
                  />
                </div>
              ) : (
                <div style={{ width: '100%' }}>{general()}</div>
              )}
            </div>
          ) : (
            <div className="project-content" style={{ padding: 20 }}>
              {tabIndex === 0 ? (
                <Grid container>
                  <Grid item md={5}>
                    <Typography variant="h5">
                      {intl.formatMessage(messages.thongtinchitiet || { id: 'thongtinchitiet', defaultMessage: 'thongtinchitiet' })}
                    </Typography>
                    <TypographyDetail data={addProjects.name}>{names.name}: </TypographyDetail>
                    {addProjects.isProject && <TypographyDetail data={addProjects.code}>Code: </TypographyDetail>}
                    {addProjects.projectId && <TypographyDetail data={addProjects.projectName}>Tên dự án: </TypographyDetail>}
                    <TypographyDetail data={addProjects.customer ? addProjects.customer.name : null}>{names.customer}: </TypographyDetail>
                    <TypographyDetail data={toVietNamDate(addProjects.startDate)}>{names.startDate}: </TypographyDetail>
                    <TypographyDetail data={toVietNamDate(addProjects.endDate)}>{names.endDate}: </TypographyDetail>
                    <TypographyDetail data={taskStatusArr[addProjects.taskStatus * 1 - 1]}>{names.taskStatus}: </TypographyDetail>
                    <TypographyDetail
                      data={<span style={{ color: priotyColor[addProjects.priority * 1 - 1] }}>{taskPrioty[addProjects.priority * 1 - 1]}</span>}
                    >
                      {names.priority}:
                    </TypographyDetail>
                    <TypographyDetail data={addProjects.finishDate !== null ? toVietNamDate(addProjects.finishDate) : ''}>
                      {names.finishDate}:{' '}
                    </TypographyDetail>
                    <TypographyDetail data={addProjects.createdBy ? addProjects.createdBy.name : null}>{names.createdBy}: </TypographyDetail>
                    <Typography variant="h5">Thông tin người tham gia</Typography>

                    <TypographyDetail data={this.mapPeople(addProjects.taskManager)}>{names.taskManager}: </TypographyDetail>
                    <TypographyDetail data={this.mapPeople(addProjects.viewable)}>{names.viewable}: </TypographyDetail>
                    <TypographyDetail data={this.mapPeople(addProjects.inCharge)}>{names.inCharge}: </TypographyDetail>
                    <TypographyDetail data={this.mapPeople(addProjects.support)}>{names.support}: </TypographyDetail>
                    <TypographyDetail data={this.mapPeople(addProjects.approved)}>{names.approved}: </TypographyDetail>
                    <TypographyDetail data={<People planPeople={addProjects.joinPlan} people={addProjects.join} />}>{names.join}: </TypographyDetail>
                    <Typography variant="h5">Mô tả chi tiết</Typography>
                    <div dangerouslySetInnerHTML={{ __html: addProjects.desHtml }} style={{ padding: '0 20px' }} />
                  </Grid>
                  <Grid className="progress-column" item md={3}>
                    <ProgressBar fillColor={fillColor} textCenter={`${addProjects.progress.toFixed()}%`} progress={addProjects.progress.toFixed()} />
                    <ProgressBar fillColor={fillColor} textCenter={`${Math.floor(day)}d ${hours.toFixed()}h`} progress={dayProgress} />
                  </Grid>
                  <Grid item md={4}>
                    <Card>
                      <CardActionArea>
                        <CardMedia component="img" alt="Contemplative Reptile" image={avt} title="Contemplative Reptile" />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {addProjects.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {addProjects.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        {clientId === 'MIPEC' ? null : (
                          <Button onClick={this.makeConversation} size="small" color="primary">
                            {hideAddConversation ? null : 'Tạo nhóm trò chuyện'}
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item md={12}>
                    <div className="commnent-tilte">
                      <Typography variant="h5">Thảo luận</Typography>
                    </div>
                    <Comment profile={profile} code="Task" id={id} />
                  </Grid>
                </Grid>
              ) : null}

              {tabIndex === 1 ? general() : null}
              {tabIndex === 2 ? (
                <Grid container>
                  <Grid item md={12}>
                    <TextField
                      select
                      fullWidth
                      label="Chọn công việc và dự án"
                      name="idSelect"
                      value={addProjects.idSelect}
                      onChange={this.selectTask}
                    >
                      {addProjects.projects.map(item => (
                        <MenuItem value={item._id} style={{ paddingLeft: 20 * item.level }}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item md={12}>
                    <Button variant="outlined" color="primary" onClick={this.handleOpenDialogProgress}>
                      <Update
                        style={{
                          marginRight: 5,
                          fontSize: '1.3rem',
                        }}
                      />
                      {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
                    </Button>
                  </Grid>
                  <Grid item md={12} style={{ display: 'flex' }}>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {intl.formatMessage(messages.tiendovapheduyet || { id: 'tiendovapheduyet', defaultMessage: 'tiendovapheduyet' })}
                    </Typography>
                  </Grid>
                  <Grid item md={12}>
                    <div>
                      <Buttons onClick={() => this.setState({ tab: 0 })} color={tab === 0 ? 'gradient' : 'simple'} size="sm">
                        {intl.formatMessage(messages.tiendo || { id: 'tiendo', defaultMessage: 'tiendo' })}
                      </Buttons>
                      <Buttons onClick={() => this.setState({ tab: 1 })} color={tab === 1 ? 'gradient' : 'simple'} size="sm">
                        {intl.formatMessage(messages.lichsu || { id: 'lichsu', defaultMessage: 'lichsu' })}
                      </Buttons>
                      <Buttons onClick={() => this.setState({ tab: 2 })} color={tab === 2 ? 'gradient' : 'simple'} size="sm">
                        {intl.formatMessage(messages.phesuyet || { id: 'phesuyet', defaultMessage: 'phesuyet' })}
                      </Buttons>
                    </div>
                  </Grid>

                  {tab === 0 && (
                    <Grid container md={12}>
                      <ListPage
                        reload={addProjects.reloadProgress}
                        disableEdit
                        disableAdd
                        disableSelect
                        code="TaskProgress"
                        parentCode="Task"
                        apiUrl={API_TASK_PROJECT}
                        filter={{ _id: addProjects.idSelect }}
                        mapFunction={this.mapProgrees}
                      />
                    </Grid>
                  )}
                  {tab === 1 && (
                    <ListPage
                      reload={addProjects.reloadHistory}
                      client
                      disableEdit
                      disableAdd
                      disableSelect
                      code="TaskHistory"
                      parentCode="Task"
                      apiUrl={`${API_PROGRESS}/${addProjects._id}`}
                      mapFunction={this.mapHistory}
                      filter={{ _id: addProjects.idSelect }}
                    />
                  )}
                  {tab === 2 && (
                    <Grid item md={12}>
                      <ListPage
                        reload={addProjects.reloadApproved}
                        disableAdd
                        disableEdit
                        code="Task"
                        apiUrl={API_TASK_PROJECT}
                        mapFunction={this.mapApproved}
                        filter={{ _id: addProjects.idSelect }}
                      />
                    </Grid>
                  )}

                  <Dialog
                    onSave={this.onSaveProgress}
                    title={intl.formatMessage(messages.capnhattiendo || { id: 'capnhattiendo', defaultMessage: 'capnhattiendo' })}
                    open={openDialogProgress}
                    onClose={this.handleDialogProgress}
                  >
                    {tab === 0 ? (
                      <React.Fragment>
                        <TextField
                          fullWidth
                          select
                          label={names.taskStatus}
                          value={addProjects.selectStatus}
                          name="selectStatus"
                          onChange={this.changeTaskStatus}
                        >
                          {taskStatusArr.map((item, index) => (
                            <MenuItem disabled={this.caculeDisable(index + 1)} key={item} value={index + 1}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                        {addProjects.displayProgress ? (
                          <TextField
                            fullWidth
                            id="standard-name"
                            label={names.progress}
                            margin="normal"
                            name="selectProgress"
                            onChange={e => this.handleChange('selectProgress', e.target.value)}
                            value={addProjects.selectProgress}
                            type="number"
                          />
                        ) : null}

                        <TextField
                          fullWidth
                          select
                          label={names.priority}
                          value={addProjects.selectPiority}
                          name="priority"
                          onChange={e => this.handleChange('selectPiority', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        >
                          {taskPrioty.map((it, id) => (
                            <MenuItem key={it} value={id + 1}>
                              {it}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          fullWidth
                          id="standard-name"
                          label="Ghi chú"
                          margin="normal"
                          name="note"
                          onChange={e => this.handleChange('selectNote', e.target.value)}
                          value={addProjects.selectNote}
                          error={!addProjects.selectNote}
                          helperText={addProjects.selectNote ? null : 'Không được bỏ trống'}
                        />
                      </React.Fragment>
                    ) : null}
                    {tab === 1 ? (
                      <React.Fragment>
                        <TextField
                          fullWidth
                          select
                          label={names.taskStatus}
                          value={addProjects.selectStatus}
                          name="selectStatus"
                          onChange={this.changeTaskStatus}
                        >
                          {taskStatusArr.map((item, index) => (
                            <MenuItem disabled={this.caculeDisable(index + 1)} key={item} value={index + 1}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                        {addProjects.displayProgress ? (
                          <TextField
                            fullWidth
                            id="standard-name"
                            label={names.progress}
                            margin="normal"
                            name="selectProgress"
                            onChange={e => this.handleChange('selectProgress', e.target.value)}
                            value={addProjects.selectProgress}
                            type="number"
                          />
                        ) : null}

                        <TextField
                          fullWidth
                          select
                          label={names.priority}
                          value={addProjects.selectPiority}
                          name="priority"
                          onChange={e => this.handleChange('selectPiority', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        >
                          {taskPrioty.map((it, id) => (
                            <MenuItem key={it} value={id + 1}>
                              {it}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          fullWidth
                          id="standard-name"
                          label="Ghi chú"
                          margin="normal"
                          name="note"
                          onChange={e => this.handleChange('selectNote', e.target.value)}
                          value={addProjects.selectNote}
                        />
                      </React.Fragment>
                    ) : null}
                    {tab === 2 ? (
                      <React.Fragment>
                        <TextField
                          fullWidth
                          select
                          label={names.taskStatus}
                          value={addProjects.selectStatus}
                          name="selectStatus"
                          onChange={this.changeTaskStatus}
                        >
                          {taskStatusArr.map((item, index) => (
                            <MenuItem disabled={this.caculeDisable(index + 1)} key={item} value={index + 1}>
                              {item}
                            </MenuItem>
                          ))}
                        </TextField>
                        {addProjects.displayProgress ? (
                          <TextField
                            fullWidth
                            id="standard-name"
                            label={names.progress}
                            margin="normal"
                            name="selectProgress"
                            onChange={e => this.handleChange('selectProgress', e.target.value)}
                            value={addProjects.selectProgress}
                            type="number"
                          />
                        ) : null}

                        <TextField
                          fullWidth
                          select
                          label={names.priority}
                          value={addProjects.selectPiority}
                          name="priority"
                          onChange={e => this.handleChange('selectPiority', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        >
                          {taskPrioty.map((it, id) => (
                            <MenuItem key={it} value={id + 1}>
                              {it}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          fullWidth
                          id="standard-name"
                          label="Ghi chú"
                          margin="normal"
                          name="note"
                          onChange={e => this.handleChange('selectNote', e.target.value)}
                          value={addProjects.selectNote}
                        />
                      </React.Fragment>
                    ) : null}
                  </Dialog>
                </Grid>
              ) : null}
              {tabIndex === 3 ? (
                <Grid item md={12} spacing={4}>
                  <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
                    {intl.formatMessage(messages.danhsachtailieu || { id: 'danhsachtailieu', defaultMessage: 'danhsachtailieu' })}
                  </Typography>

                  <FileUpload
                    disableEdit={!uploadFilePermission}
                    disableDelete={!deleteFilePermission}
                    name={nameTask}
                    disableWhenApproved
                    id={idTask}
                    code="Task"
                    taskId={id}
                  />
                </Grid>
              ) : null}
              {tabIndex === 4 ? (
                <Grid container>
                  <Grid item md={12}>
                    <div>
                      <Buttons
                        onClick={() => this.props.mergeData({ typeTranfer: 1 })}
                        color={addProjects.typeTranfer === 1 ? 'gradient' : 'simple'}
                        size="sm"
                      >
                        {intl.formatMessage(messages.nguoiphutrach || { id: 'nguoiphutrach', defaultMessage: 'nguoiphutrach' })}
                      </Buttons>
                      <Buttons
                        onClick={() => this.props.mergeData({ typeTranfer: 2 })}
                        color={addProjects.typeTranfer === 2 ? 'gradient' : 'simple'}
                        size="sm"
                      >
                        {intl.formatMessage(messages.nguoithamgia || { id: 'nguoithamgia', defaultMessage: 'nguoithamgia' })}
                      </Buttons>
                    </div>
                  </Grid>
                  {addProjects.typeTranfer === 1 && (
                    <React.Fragment>
                      <Grid item md={5}>
                        <Autocomplete
                          isMulti
                          name="Chọn "
                          label={names.inCharge}
                          suggestions={addProjects.listInCharge}
                          onChange={value => this.props.mergeData({ currentInCharge: value })}
                          value={addProjects.currentInCharge}
                        />
                      </Grid>
                      <Grid item md={2}>
                        <div className="tranfer-employee">
                          <SwapHoriz style={{ fontSize: '3rem' }} />
                        </div>
                      </Grid>
                      <Grid item md={5}>
                        {addProjects.parentId ? (
                          <Autocomplete
                            isMulti
                            name="Chọn "
                            label="Người thay thế"
                            suggestions={employees}
                            onChange={value => this.props.mergeData({ tranferInCharge: value })}
                            value={addProjects.tranferInCharge}
                          />
                        ) : (
                          <React.Fragment>
                            <AsyncAutocomplete
                              isMulti
                              name="Chọn..."
                              label="Người thay thế"
                              url={API_USERS}
                              onChange={value => this.props.mergeData({ tranferInCharge: value })}
                              value={addProjects.tranferInCharge}
                            />
                          </React.Fragment>
                        )}
                      </Grid>
                      <Grid item md={12}>
                        <Button variant="outlined" color="primary" style={{ marginLeft: '90%' }} onClick={this.onSaveTranfer}>
                          {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
                        </Button>
                        <ListPage
                          disableEdit
                          disableAdd
                          disableSearch
                          disableSelect
                          client
                          filter={{ type: 1 }}
                          code="TaskUserReplacement"
                          parentCode="Task"
                          // columns={replaceColumns}
                          apiUrl={`${API_TRANFER}/${addProjects._id}`}
                          reload={addProjects.reloadTranfer}
                        />
                      </Grid>
                    </React.Fragment>
                  )}
                  {addProjects.typeTranfer === 2 && (
                    <React.Fragment>
                      <Grid item md={5}>
                        <Autocomplete
                          isMulti
                          name="Chọn "
                          label={names.join}
                          suggestions={addProjects.listJoin}
                          onChange={value => this.props.mergeData({ currentJoin: value })}
                          value={addProjects.currentJoin}
                        />
                      </Grid>
                      <Grid item md={2}>
                        <div className="tranfer-employee">
                          <SwapHoriz style={{ fontSize: '3rem' }} />
                        </div>
                      </Grid>
                      <Grid item md={5}>
                        {addProjects.parentId ? (
                          <Autocomplete
                            isMulti
                            name="Chọn "
                            label="Người thay thế"
                            suggestions={employees}
                            onChange={value => this.props.mergeData({ tranferJoin: value })}
                            value={addProjects.tranferJoin}
                          />
                        ) : (
                          <React.Fragment>
                            <AsyncAutocomplete
                              isMulti
                              name="Chọn..."
                              label="Người thay thế"
                              url={API_USERS}
                              onChange={value => this.props.mergeData({ tranferJoin: value })}
                              value={addProjects.tranferJoin}
                            />
                          </React.Fragment>
                        )}
                      </Grid>
                      <Grid md={12} item>
                        <Button variant="outlined" color="primary" style={{ marginLeft: '90%' }} onClick={this.onSaveTranfer}>
                          {intl.formatMessage(messages.capnhat || { id: 'capnhat', defaultMessage: 'capnhat' })}
                        </Button>
                        <ListPage
                          disableEdit
                          disableAdd
                          disableSearch
                          disableSelect
                          client
                          reload={addProjects.reloadTranfer}
                          filter={{ type: 2 }}
                          code="TaskUserReplacement"
                          parentCode="Task"
                          // columns={replaceColumns}
                          apiUrl={`${API_TRANFER}/${addProjects._id}`}
                        />
                      </Grid>
                    </React.Fragment>
                  )}
                </Grid>
              ) : null}
              {tabIndex === 5 && isProject === true ? (
                <Grid container>
                  <div>
                    <Buttons onClick={() => this.setState({ tabContract: 0 })} color={tabContract === 0 ? 'gradient' : 'simple'} size="sm">
                      {intl.formatMessage(messages.hopdongnhacungcap || { id: 'hopdongnhacungcap', defaultMessage: 'hopdongnhacungcap' })}
                    </Buttons>
                    <Buttons onClick={() => this.setState({ tabContract: 1 })} color={tabContract === 1 ? 'gradient' : 'simple'} size="sm">
                      {intl.formatMessage(messages.hopdongkhachhang || { id: 'hopdongkhachhang', defaultMessage: 'hopdongkhachhang' })}
                    </Buttons>
                  </div>
                  {/* <Grid item md={12}>
                       <Typography>Tổng: 0</Typography>
                     </Grid> */}
                  <Grid item md={12}>
                    {tabContract === 0 ? (
                      <ListPage
                        hightLight
                        disableEdit
                        disableAdd
                        disableDot
                        // client
                        disableSelect
                        code="TaskContract"
                        parentCode="Task"
                        // columns={supplierColumns}
                        apiUrl={GET_TASK_CONTRACT}
                        typeContract="2"
                        taskId={addProjects._id}
                        // filter={{ typeContract: '2', 'taskId': addProjects._id }}
                        mapFunction={this.mapContract}
                      />
                    ) : null}
                    {tabContract === 1 ? (
                      <ListPage
                        disableEdit
                        disableAdd
                        disableDot
                        // client
                        disableSelect
                        code="TaskContract"
                        parentCode="Task"
                        typeContract="1"
                        taskId={addProjects._id}
                        // columns={supplierColumns}
                        apiUrl={GET_TASK_CONTRACT}
                        // filter={{ typeContract: '1', 'taskId': addProjects._id }}
                        mapFunction={this.mapContract}
                      />
                    ) : null}
                  </Grid>
                </Grid>
              ) : null}

              {tabIndex === 6 ? (
                <Grid container>
                  <Grid item md={12}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold' }}>Tên công việc</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Tỷ trọng tùy chỉnh </TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Tỷ trọng theo thời lượng</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Dự toán chi phí</TableCell>
                          <TableCell style={{ fontWeight: 'bold' }}>Chi phí thực tế</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listRatio.map((i, idx) => (
                          <RatioItem
                            changeRatio={this.changeRatio}
                            index={idx}
                            name={i.name}
                            ratio={i.ratio}
                            costEstimate={i.costEstimate}
                            changeCostEstimate={this.changeCostEstimate}
                            planRatio={i.planRatio}
                            costRealityValue={i.costRealityValue}
                          />
                        ))}

                        <TableRow>
                          <TableCell style={{ fontWeight: 'bold' }}>Tổng</TableCell>
                          <TableCell
                            style={{ fontWeight: 'bold', color: totalArray(listRatio, 0, listRatio.length, 'ratio') === 100 ? 'black' : 'red' }}
                          >
                            {totalArray(listRatio, 0, listRatio.length, 'ratio')}
                          </TableCell>
                          <TableCell />
                          <TableCell>{totalArray(listRatio, 0, listRatio.length, 'costEstimate')}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                  <Grid item md={12}>
                    <Button style={{ float: 'right' }} variant="outlined" color="primary" onClick={this.updateRatio}>
                      Cập nhật tỷ trọng
                    </Button>
                  </Grid>
                </Grid>
              ) : null}
              {tabIndex === 7 ? (
                <Grid container>
                  <Grid item md={6} style={{ padding: '4px 20px' }}>
                    <TextField
                      label="Tên phê duyệt"
                      name="name"
                      onChange={e => this.handleChangeApproved(e, 'name')}
                      value={approvedObj.name}
                      fullWidth
                    />
                    <React.Fragment>
                      {/* <AsyncAutocomplete
                           placeholder="Tìm kiếm nhóm phê duyệt ..."
                           url={API_APPROVE_GROUPS}
                           value={approvedObj.group}
                           onChange={this.handleAddApprovedGroup}
                           label=" Nhóm phê duyệt"
                         /> */}
                      {/* <AsyncAutocomplete
                        name="Chọn..."
                        label="Nhóm phê duyệt"
                        onChange={this.handleAddApprovedGroup}
                        url={API_APPROVE_GROUPS}
                        value={approvedObj.group}
                      /> */}
                    </React.Fragment>
                  </Grid>
                  <Grid item md={6} style={{ padding: '4px 20px' }}>
                    <TextField
                      label="Tên quy trình"
                      name="name"
                      onChange={e => this.handleChangeApproved(e, 'subCode')}
                      value={approvedObj.subCode}
                      fullWidth
                    />
                    <TextField
                      label="Chọn biểu mẫu phê duyệt"
                      name="name"
                      onChange={e => this.handleChangeApproved(e, 'form')}
                      value={approvedObj.form}
                      style={{ width: '100%' }}
                      select
                    >
                      {templates.map(form => (
                        <MenuItem key={form._id} value={form._id}>
                          {form.title}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button variant="outlined" color="primary" style={{ marginTop: 15, float: 'right' }} onClick={this.saveApprove}>
                      Tạo phê duyệt
                    </Button>
                  </Grid>
                </Grid>
              ) : null}
              {tabIndex === 8 ? (
                <Grid container>
                  <Grid item md={12}>
                    <ListPage
                      disableEdit
                      disableAdd
                      disableSelect
                      code="Documentary"
                      apiUrl={API_DISPATCH}
                      filter={{ task: addProjects._id }}
                      mapFunction={this.mapFunctionDocument}
                    />
                  </Grid>
                </Grid>
              ) : null}
              {tabIndex === 9 ? (
                <Grid container>
                  <Grid item md={12}>
                    <ListPage
                      disableEdit
                      disableAdd
                      disableSelect
                      code="Calendar"
                      apiUrl={API_MEETING}
                      filter={{ task: addProjects._id }}
                      mapFunction={this.mapFunctionCalendar}
                    />
                  </Grid>
                </Grid>
              ) : null}
            </div>
          )}
          {(selectTask && id === 'add' && this.props.data.isProject) || tabIndex === 3 ? null : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 10, marginRight: 40 }}>
              {/* <Button style={{ marginRight: 5 }} variant="outlined" color="primary" onClick={this.handleSaveProject}>
                   {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })}
                 </Button> */}
              {/* <Button variant="outlined" color="secondary" onClick={this.onCloseProject}>
                   {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
                 </Button> */}
            </div>
          )}
        </ValidatorForm>
        <ConfirmDialog
          title={intl.formatMessage({ id: 'task.addProject.confirmAddProjectWithoutCustomer' })}
          open={this.state.confirmAddProjectNoCustomerOpen}
          handleClose={this.handleCloseAddProjectNoCustomer}
          handleSave={this.handleConfirmAddProjectNoCustomer}
        />
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.handlecloseDrawer()}
          open={!selectTask ? true : false}
        // width={window.innerWidth - 260}
        >
          {general()}
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDialogEditProject: false })}
          open={this.state.openDialogEditProject}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >

          <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
            <EditProjects
              id={this.state.idDialogEditProject}
              goback={() => this.setState({ openDialogEditProject: false })}
              history={this.props.history}
              page={'meetings'}
            />
          </div>
        </SwipeableDrawer>


        <Dialog dialogAction={false} onClose={() => this.setState({ openDialogTask: false })} open={openDialogTask}>
          <TaskDocs onSave={this.onSaveTask} handleCloseFilter={() => this.setState({ openDialogTask: false })} profile={this.props.profile}/>
        </Dialog>
        <Dialogg
          onClose={() => {
            this.setState({ openDialogDeleteTask: false })
          }}
          aria-labelledby="customized-dialog-title"
          open={openDialogDeleteTask}
          maxWidth="md"
        >
          <DialogTitle id="customized-dialog-title" onClose={() => {
            this.setState({ openDialogDeleteTask: false })
          }}>
            Thông báo
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>Đồng chí có chắc chắn muốn xóa?</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="primary" variant="contained" onClick={() => this.handleDeleteTask()}>
              Đồng ý
            </Button>
            <Button
              onClick={() => this.setState({ openDialogDeleteTask: false })}
              color="secondary"
              variant="contained"
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialogg>

        <Dialogg dialogAction={false} open={addProjects.loading} >
        <DialogContent>Đang load dữ liệu, đồng chí vui lòng chờ...</DialogContent>
      </Dialogg>
      </div>
    );
  }
}

// AddProjects.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  addProjects: makeSelectAddProjects(),
  profile: makeSelectProfile(),
  socket: makeSelectSocket(),
  dashboardPage: makeSelectDashboardPage(),
  toTalTask: makeSelectTotalTask(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    handleChange: (name, value) => {
      dispatch(handleChange(name, value));
    },
    postProject: data => dispatch(postProject(data)),
    postFile: data => dispatch(postFile(data)),
    getProjectCurrent: (id, data) => dispatch(getProjectCurrent(id, data)),
    putProject: (data, id) => dispatch(putProject(data, id)),
    putProgress: (data, id) => dispatch(putProgress(data, id)),
    postTranfer: (data, id, tranfer) => dispatch(postTranfer(data, id, tranfer)),
    getConversation: () => dispatch(getConversation()),
    putRatio: (id, data) => dispatch(putRatio(id, data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getData: () => dispatch(getData()),
    postApprove: data => dispatch(postApprove(data)),
    getEmployee: () => dispatch(getEmployee()),
    onClean: () => dispatch(clean()),
  };
}

function RatioItem({ name, ratio, planRatio, index, changeRatio, costEstimate, changeCostEstimate, costRealityValue }) {
  function handleChange(e) {
    const value = (e.target.value * 1).toFixed();
    if (value > 100) return;
    changeRatio(index, value);
  }
  function handleChangeCostEstimate(e) {
    changeCostEstimate(index, e.target.value);
  }
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>
        <TextField onChange={handleChange} value={ratio} margin="dense" variant="outlined" type="number" />
      </TableCell>
      <TableCell>{planRatio}</TableCell>
      <TableCell>
        {/* <TextField onChange={handleChangeCostEstimate} value={costEstimate} margin="dense" variant="outlined" type="number" /> */}
        <CustomInputBase
          label={'Dự toán chi phí'}
          onChange={handleChangeCostEstimate}
          value={costEstimate}
          type="number"
          formatType="Money"
          margin="dense"
          variant="outlined"
          fullWidth={false}
        />
      </TableCell>
      <TableCell>{costRealityValue}</TableCell>
    </TableRow>
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addProjects', reducer });
const withSaga = injectSaga({ key: 'addProjects', saga });

AddProjects.defaultProps = { data: { isProject: true } };
export default compose(
  withReducer,
  injectIntl,
  withSaga,
  withConnect,
  // withStyles(stylePaper),
)(AddProjects);
