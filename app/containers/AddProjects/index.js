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
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List/ListTaskHistory';
import { Update, SwapHoriz, VisibilityOffRounded, Edit } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
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
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  CardMedia,
  Menu,
  IconButton,
  Avatar,
  // withStyles,
  Tooltip,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { EditorUtils } from '@progress/kendo-react-editor';
import Buttons from 'components/CustomButtons/Button';
import { Link } from 'react-router-dom';
import { ValidatorForm } from 'react-material-ui-form-validator';
import axios from 'axios';
import { taskStatusArr, clientId } from 'variable';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import cover from '../../assets/img/task/task_cover_01.jpg';
import cover2 from '../../assets/img/task/task_cover_02.jpg';
import cover3 from '../../assets/img/task/task_cover_03.jpg';
import cover4 from '../../assets/img/task/task_cover_04.jpg';
import CustomAppBar from 'components/CustomAppBar';
import CustomDatePicker from '../../components/CustomDatePicker';
import { viewConfigCheckForm, canUpdateTaskPlan, getListData } from 'utils/common';
import moment from 'moment';
import _ from 'lodash';
import request from '../../utils/request';
import TaskDocs from './component/TaskDocs';
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
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_ROLE_GROUP,
  API_INCOMMING_DOCUMENT,
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
import messages from './messages';
import { makeSelectProfile, makeSelectSocket, makeSelectMiniActive } from '../Dashboard/selectors';
import makeSelectDashboardPage from '../Dashboard/selectors';
import makeSelectTotalTask from '../TotalTask/selectors';
import { convertTree, taskPrioty, priotyColor, getDatetimeLocal, toVietNamDate, totalArray, serialize, fetchData } from '../../helper';
import Breadcrumbs from '../../components/LifetekUi/Breadcrumbs';
import ConfirmDialog from '../../components/CustomDialog/ConfirmDialog';
import CustomInputBase from '../../components/Input/CustomInputBase';
import FilterDocs from './component/FilterDocs';
import DocumentAssignModal from 'components/TaskAsignModal';
import EditExecutiveDocuments from '../EditExecutiveDocuments';
import EditGoDocuments from '../EditGoDocuments';
import { Tabs, Tab } from '@material-ui/core';



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
const urlParams = new URLSearchParams(window.location.search);
const docSeen = urlParams.get('docSeen') ||"";
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
      openDialogFilter: false,
      randCover,
      taskInCharge: null,
      taskSupport: null,
      taskJoin: null,
      assigner: null,
      taskApproved: null,
      // speciall: null,
      confirmAddProjectNoCustomerOpen: false,
      checkRequired,
      checkShowForm,
      localMessages: {},
      crmSource,
      openEvaluate: false,
      openCompleteAny: false,
      noteHistory: '',
      onCompleteAny: '',
      reload: 0,
      taskData: {},
      openInCharge: false,
      openDelete: false,
      noteDig: '',
      docDetail: null,
      localState: {
        file: [],
      },
      openTaskAsign: false,
      dataUser: [],
      openEditDialog: false,
      idEdit: null,
      editIndex: null,
      dataHistory: [],
      datakProcessFlow: [],
      dataPeople: [],
      openContent: false,
      view: false,
      roleGroup: [],
      disableSave: false,
      processType: '',
      openEditOutGoingDialog: false,
      openDialogTask: false,
      openDialogDeleteTask: false,
      idTaskDelete: "",
      tabTask: 0,
      taskAttachedd: []
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
    localStorage.removeItem('taskCallBack');

    const id = this.props.id ? this.props.id : this.props.match.params.id;
    this.props.getProjectCurrent(id, this.props.data);
    if (!!this.props.description && this.props.description.length > 0) {
      let str = '';
      for (let i = 0; i < this.props.description.length; i++) {
        str = `${str + this.props.description[i].name} : ${this.props.description[i].value} . `;
      }
      this.props.mergeData({ description: str });
    }
    const { addProjects } = this.props;
    // const dataSource = JSON.parse(localStorage.getItem('crmSource'))
    // const dataValSource = dataSource && dataSource.find(item => item.code === 'S301')
    // const dataVal = dataValSource ? dataValSource.data : []
    // let dataTypes = ''
    // user.type.forEach(item => {
    // const data = dataVal.find(i => i.value === addProjects.taskLevel)
    // this.props.mergeData({ taskLevel: data });
    this.props.getData();
    this.props.getEmployee();
    if (id === 'add') {
      const urlParams = new URLSearchParams(window.location.search);
      let toBookCode = urlParams.get('toBookCode') || '';
      this.props.mergeData({ taskMaster: this.props && this.props.profile });
      this.getBookCode(toBookCode);
    }
    if (id && id !== 'add') {
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

    fetch(`${API_USERS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ dataUser: data.data });
      });

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
          this.setState({ dataHistory: data.data });
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
  }

  getBookCode = async toBookCode => {
    // const urlParams = new URLSearchParams(window.location.search);
    // let toBookCode = urlParams.get('toBookCode') || '';
    let result = [];
    const query = {
      filter: { toBookCode: toBookCode },
      limit: 1,
    };
    const json = await fetch(`${API_INCOMMING_DOCUMENT}?${serialize(query)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
        'Content-Type': 'application/json',
      },
    });
    let data = await json.json();
    if (data && data.data && data.data.length > 0) {
      data.data &&
        data.data.map(item => {
          if (item.toBookCode == toBookCode) {
            result.push(item);
          }
        });
    }
    this.onGet(result);
  };

  onGet = data => {
    const urlParams = new URLSearchParams(window.location.search);
    let toBookCode = urlParams.get('toBookCode') || '';
    const { addProjects } = this.props;
    if (toBookCode !== '') {
      let newDataConcat = addProjects.incommingDocuments || [];
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
    }
  };

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

    const nextId = nextProps.id ? nextProps.id : nextProps.match.params.id;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (id !== nextId) {
      this.props.getProjectCurrent(id, this.props.data);
    }
    const { addProjects } = this.props;
    if (this.state.taskAttachedd.length === 0 && addProjects.taskAttached.length > 0) {
      const filter = { _id: { $in: addProjects.taskAttached } };
      const query = serialize({ filter });
      const projectData = fetchData(`${API_TASK_PROJECT}/projects?${query}`).then((res) => {
        this.setState({ taskAttachedd: res.data })
      })
    }


  }

  componentWillReceiveProps(props) {
    const { addProjects } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    // if (props !== this.props && addProjects.taskLevel !== undefined) {

    //   const dataSource = JSON.parse(localStorage.getItem('crmSource'))
    //   const dataValSource = dataSource && dataSource.find(item => item.code === 'S301')
    //   const dataVal = dataValSource ? dataValSource.data : []
    //   // user.type.forEach(item => {
    //   const data = dataVal.find(i => i.value === addProjects.taskLevel)
    //   // console.log('data', data)
    //   this.props.mergeData({ taskLevel: data });

    // }

    if (!!props.dashboardPage.roleTask.roles && props.dashboardPage.roleTask.roles !== undefined && props.dashboardPage.roleTask.roles.length > 0) {
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
            /* eslint camelcase: ["error", {ignoreDestructuring: true}] */
            /* eslint-disable */
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
        console.log(newAdd.startDate, 'newAdd.startDate', newAdd.endDate)
        const timeDiff = new Date(newAdd.startDate)*1 - new Date(newAdd.endDate)*1
        // if ((new Date(newAdd.startDate)).toLocaleDateString('en-US') > (new Date(newAdd.endDate)).toLocaleDateString('en-US')) {
          if(timeDiff >0){
          this.setState({ localMessages: { ...(this.state.localMessages || {}), endDate: 'Ngày kết thúc phải lớn hơn ngày bắt đầu' } });
        } else this.setState({ localMessages: { ...(this.state.localMessages || {}), endDate: null } });
      }
    }

    if (name === 'hasRelatedDocument') {
      this.props.mergeData({ [name]: value, relatedDoc: null });
    } else if (name === 'hasRelatedProject') {
      this.props.mergeData({ [name]: value, relatedTask: null });
    } else this.props.mergeData({ [name]: value });
    // console.log('value',value)
    //     if (name === 'inCharge') {
    //       this.props.mergeData({ [name]: value });
    //     } else {

    //     }
  };
  handleChangeDate = (name, value) => {
    const { addProjects } = this.props;
    const newAdd = { ...addProjects, [name]: value };
    if (name === 'startDate') {
      if (moment(value).isAfter(moment(newAdd.endDate))) {
        this.props.mergeData({ ['endDate']: moment(value).format('YYYY-MM-DD') });
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

  handleSaveProject = () => {
    const { addProjects } = this.props;
    const { endDate, approvedProgress, customer ,startDate} = addProjects;
    console.log((new Date(addProjects.startDate)), "startDate")
    console.log((new Date(addProjects.endDate)), "endDate")
    console.log((new Date(addProjects.startDate)).toLocaleDateString('en-US') - (new Date(addProjects.endDate)).toLocaleDateString('en-US'))

    console.log((new Date(addProjects.startDate)).toLocaleDateString('en-US') > (new Date(addProjects.endDate)).toLocaleDateString('en-US'))
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const currentDate = new Date(moment(new Date(),"YYYY-MM-DD").format("YYYY-MM-DD"))*1
    const newStartDate =new Date(moment(startDate).format("YYYY-MM-DD"))*1
    const newEndDate = new Date(moment(endDate).format("YYYY-MM-DD"))*1
    console.log(new Date(moment(new Date(),"YYYY-MM-DD").format("YYYY-MM-DD"))*1, 'new Date')
    console.log(new Date(moment(startDate).format("YYYY-MM-DD"))*1, 'startDate', startDate)
    console.log(new Date(moment(endDate).format("YYYY-MM-DD"))*1, 'endDate', endDate, )


    if(currentDate > newStartDate ){
      console.log("lỗi start Date")
      this.props.onChangeSnackbar({ status: true, message: 'Ngày bắt đầu  phải lớn hơn hoặc bằng ngày hiện tại', variant: 'error' });
      this.setState({ localMessages: { ...(this.state.localMessages || {}), startDate: 'Ngày bắt đầu  phải lớn hơn hoặc bằng ngày hiện tại' } });
      return;
    }else{
      let {localMessages} = this.state
      delete localMessages.startDate
      this.setState({ localMessages});

    }
     if(currentDate > newEndDate){
      console.log("lỗi end Date")
      this.props.onChangeSnackbar({ status: true, message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày hiện tại', variant: 'error' });
      this.setState({ localMessages: { ...(this.state.localMessages || {}), endDate: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày hiện tại' } });
      return;
    }else{
      let {localMessages} = this.state
      delete localMessages.endDate
      this.setState({ localMessages});

    }



    if (newStartDate > newEndDate) {
      console.log("lỗi nè")
      this.props.onChangeSnackbar({ status: true, message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu', variant: 'error' });
      this.setState({ localMessages: { ...(this.state.localMessages || {}), endDate: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu' } });
      return;
    }else{
      let {localMessages} = this.state
      delete localMessages.endDate
      this.setState({ localMessages});

    }
    if (addProjects.name.length < 5) {
      this.props.onChangeSnackbar({ status: true, message: 'Tên công việc phải lớn hơn 5 kí tự', variant: 'error' });
      this.setState({ localMessages: { ...(this.state.localMessages || {}), name: 'Tên công việc phải lớn hơn 5 kí tự' } });
      return;
    }else{
      let {localMessages} = this.state
      delete localMessages.name
      this.setState({ localMessages});

    }
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
    const { endDate, approvedProgress, customer , startDate} = addProjects;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const currentDate = new Date(moment(new Date(),"YYYY-MM-DD").format("YYYY-MM-DD"))*1
    const newStartDate =new Date(moment(startDate).format("YYYY-MM-DD"))*1
    const newEndDate = new Date(moment(endDate).format("YYYY-MM-DD"))*1
    console.log(new Date(moment(new Date(),"YYYY-MM-DD").format("YYYY-MM-DD"))*1, 'new Date')
    console.log(new Date(moment(startDate).format("YYYY-MM-DD"))*1, 'startDate', startDate)
    console.log(new Date(moment(endDate).format("YYYY-MM-DD"))*1, 'endDate', endDate, )

    if(currentDate > newStartDate ){
      console.log("lỗi start Date")
      this.props.onChangeSnackbar({ status: true, message: 'Ngày bắt đầu  phải lớn hơn hoặc bằng ngày hiện tại', variant: 'error' });
      this.setState({ localMessages: { ...(this.state.localMessages || {}), startDate: 'Ngày bắt đầu  phải lớn hơn hoặc bằng ngày hiện tại' } });
      return;
    }else{
      let {localMessages} = this.state
      delete localMessages.startDate
      this.setState({ localMessages});

    }
    
    if(currentDate > newEndDate){
      console.log("lỗi end Date")
      this.props.onChangeSnackbar({ status: true, message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày hiện tại', variant: 'error' });
      this.setState({ localMessages: { ...(this.state.localMessages || {}), endDate: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày hiện tại' } });
      return;
    }else{
      let {localMessages} = this.state
      delete localMessages.endDate
      this.setState({ localMessages});

    }
    if (newStartDate > newEndDate) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu', variant: 'error' });
      this.setState({ localMessages: { ...(this.state.localMessages || {}), endDate: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu' } });
      return;
    }else{
      let {localMessages} = this.state
      delete localMessages.endDate
      this.setState({ localMessages});

    }
    const localMessages = viewConfigCheckForm('Task', this.props.addProjects);
    this.setState({ localMessages });
    const errMsg = {};
    Object.keys(localMessages).forEach(key => {
      if (localMessages[key]) errMsg[key] = localMessages[key];
    });
    if (Object.keys(errMsg).length === 0) {
      this.setState({ disableSave: true })
      setTimeout(() => {
        this.setState({ disableSave: false })
      }, 500);
      this.onSaveKanban();
    } else {
      this.setState({ disableSave: false })
      const allMessages = Object.values(errMsg).join(', ');
      this.props.onChangeSnackbar({ status: true, message: allMessages, variant: 'error' });
    }
  };

  onCloseProject = () => {
    if (this.props.history) {
      this.props.history.goBack();
    } else if (this.props.callback) this.props.callback();
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

  onSaveFilterDocs = (data, processType) => {
    if (processType === "outgoingDocument") {
      let newDataConcat = this.props.addProjects.outGoingDocuments || [];
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
  }

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

  deleteDocs = (e, index) => {
    e.stopPropagation();
    const newData = this.props.addProjects.incommingDocuments.filter(item => item._id !== index);
    this.props.mergeData({ incommingDocuments: newData });
  };
  deleteDocsOut = (e, index) => {
    e.stopPropagation();
    const newData = this.props.addProjects.outGoingDocuments.filter(item => item._id !== index);
    this.props.mergeData({ outGoingDocuments: newData });
  };
  deleteTaskDocs = index => {
    const newData = this.props.addProjects.processors.filter(item => item.receiver !== index);
    this.props.mergeData({ processors: newData });
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
  closeDialog = data => {
    this.setState({ openDialogFilter: false });
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
    typeCalendar: item.typeCalendar === '1' ? 'Lịch cá nhân' : 'Lịch đơn vị',
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

  handleFileChange = e => {
    const { localState } = this.state;
    const files = e.target.files;

    const newFiles = [...localState.file];
    for (let i = 0; i < files.length; i += 1) {
      newFiles.push(files[i]);
    }
    this.setState({ localState: { ...localState, file: newFiles } });
    this.setState({ view: true });
  };

  handleFileDelete = f => {
    const { localState } = this.state;
    const newFiles = localState.file.filter((i, idx) => idx !== f);
    this.setState({ localState: { ...localState, file: newFiles } });
  };

  cb = () => {
    this.props.history && this.props.history.goBack && this.props.history.goBack();
  };

  onClickOpenEvaluate = () => {
    if (this.state.openEvaluate === false) {
      this.setState({ openEvaluate: true });
    }
    if (this.state.openEvaluate === true) {
      this.setState({ openEvaluate: false });
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

  saveDone = () => {
    const { noteHistory } = this.state;
    const { addProjects, profile } = this.props;
    const dataSource = JSON.parse(localStorage.getItem('crmSource'));
    const dataValSource = dataSource && dataSource.find(item => item.code === 'S301');
    const dataVal = dataValSource ? dataValSource.data : [];
    const dataFm = dataVal && dataVal.find(i => i._id === addProjects.taskLevel);
    const dataTaskLevel = dataFm && dataFm.title;
    request(`${API_TASK_HISTORY}/${noteHistory}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskLevel: dataTaskLevel ? dataTaskLevel : '',
        // receiver: profile._id
        reason: addProjects.reason ? addProjects.reason : '',
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
        this.props.onChangeSnackbar({ variant: 'success', message: 'Chỉnh sửa nội dung công việc thành công', status: true });
        this.setState({ openContent: false });
        this.reloadState();
      })
      .catch(error => {
        this.props.onChangeSnackbar({ variant: 'success', message: 'Chỉnh sửa nội dung công việc thất bại', status: false });
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
        statusAccept: 'Hoàn thành',
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

  reloadId = () => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    fetch(`${API_TASK_PROJECT}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({ ...this.props.addProjects }),
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ data: data.data });
      });
    this.setState({ reload: new Date() * 1 });
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
        this.setState({ dataHistory: data.data });
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
    request(`${API_TASK_ACCEPT}/${dataFm && dataFm.tab}`, {
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
  };

  saveAgree = () => {
    const dataFm = JSON.parse(localStorage.getItem('TaskTab'));
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { noteDig } = this.state;
    request(`${API_TASK_ACCEPT}/${dataFm && dataFm.tab}`, {
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

  onClickRow = (e, ids) => {
    e.preventDefault();
    // this.props.history.valueData = id;
    this.setState({ idEdit: ids, openEditDialog: true });
    // this.props.history.push(`/incomming-document-detail/${ids}`)
  };

  onClickRowGoDocument = (e, ids) => {
    e.preventDefault();
    // this.props.history.valueData = id;
    this.setState({ idEdit: ids, openEditOutGoingDialog: true });
    // this.props.history.push(`/incomming-document-detail/${ids}`)
  }
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
        statusAccept: 'Đang thực hiện', //  đã xử lý ....
        taskLevel: '', // trạng thái: Tốt || Yếu
        receiver: allData[i] && allData[i]._id ? allData[i]._id : '', // người xử lý chính hoạc phối hợp
        note: '', // nhận xét
        name: allData[i] && allData[i].userName ? allData[i].userName : '',
        content: '',
        roleGroup: allData[i] && allData[i].roleGroupSource ? allData[i].roleGroupSource : '',
        unit: allData[i] && allData[i].organizationUnit ? allData[i].organizationUnit : null,
        reason: '',
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

  editUser(index) {
    const { addProjects } = this.props;
    const { processors, taskLevel } = addProjects;
    const dataSource = JSON.parse(localStorage.getItem('crmSource'));
    const dataValSource = dataSource && dataSource.find(item => item.code === 'S301');
    const dataVal = dataValSource ? dataValSource.data : [];
    const dataFm = dataVal && dataVal.find(i => i._id === addProjects.taskLevel).title;

    processors[index].taskLevel = dataFm;
    return processors;
  }

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
      startDate: (new Date(addProjects.startDate)).toLocaleDateString('en-US'),
      endDate: (new Date(addProjects.endDate)).toLocaleDateString('en-US'),
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

    const { location } = this.props;
    let code = undefined,
      idd = undefined;
    if (location && location.state !== undefined) {
      code = location.state.code;
      idd = location.state.idd;
    }
    if (code != undefined && idd !== undefined) {
      //console.log(code, idd);
      data = {
        ...data,
        others: {
          [code]: idd,
        },
      };
    }
    if (id === 'add') {
      // this.props.postProject(data, this.cb);
      if(docSeen){
        this.props.postProject(data, this.cb,docSeen );

      }else {
        this.props.postProject(data, this.cb);
      }
      this.setState({ disableSave: true });
      setTimeout(() => {
        this.setState({ disableSave: false })
      }, 500);
    } else {
      this.props.putProject(data, id, this.cb);
      this.setState({ disableSave: true });
      setTimeout(() => {
        this.setState({ disableSave: false })
      }, 500);
    }
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
      startDate: (new Date(addProjects.startDate)).toLocaleDateString('en-US'),
      endDate: (new Date(addProjects.endDate)).toLocaleDateString('en-US'),
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

    const { location } = this.props;
    let code = undefined,
      idd = undefined;
    if (location && location.state !== undefined) {
      code = location.state.code;
      idd = location.state.idd;
    }
    if (code != undefined && idd !== undefined) {
      //console.log(code, idd);
      data = {
        ...data,
        others: {
          [code]: idd,
        },
      };
    }
    if (id === 'add') {
      if(docSeen){
        this.props.postProject(data, this.cb,docSeen );

      }else {
        this.props.postProject(data, this.cb);
      }
      
    } else this.props.putProject(data, id, this.cb);
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

  showDialogContent = index => {
    const { addProjects } = this.props;
    const { textContent, processors } = addProjects;
    console.log("showDialogContent", '')
    this.setState({ openContent: true });

    // if (id === 'add') {
    //   processors[index].content = textContent;

    //   this.props.mergeData({ processors: processors })
    //   this.setState({ openContent: false })
    // }
  };
  onSaveTask = data => {
    // const { addProjects } = this.props;
    // let { taskAttached } = addProjects
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
    // this.props.mergeData({ taskAttachedd: taskAttachedd });
    // this.setState({ taskAttachedd: taskAttachedd })
    this.setState({ openDialogTask: false, taskAttachedd: taskAttachedd })
  };
  handleDeleteTask = () => {
    // const newData = this.props.addProjects.taskAttached.filter(item => item._id !== this.state.idTaskDelete);
    const newData = this.state.taskAttachedd.filter(item => item._id !== this.state.idTaskDelete);

    // this.props.mergeData({ taskAttached: newData });
    this.setState({ openDialogDeleteTask: false, taskAttachedd: newData })
  }
  handleChangeTabsTask = (e, tab) => {
    this.setState({ tabTask: tab })
  }
  render() {
    const {
      tabIndex,
      tab,
      openDialogProgress,
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
      localState,
      openTaskAsign,
      openEditDialog,
      openEditOutGoingDialog,
      idEdit,
      dataHistory,
      datakProcessFlow,
      dataPeople,
      openContent,
      view,
      roleGroup,
      openDialogTask, openDialogDeleteTask,
      tabTask, taskAttachedd
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
      taskAttached
    } = addProjects;

    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const list = viewConfig.find(item => item.code === 'HistoryTask');
    const dataTitle = (list && list.listDisplay && list.listDisplay.type.fields.type.columns) || [];

    const dataUserFm = addProjects.inCharge.concat(addProjects.support);
    const dataFm = JSON.parse(localStorage.getItem('TaskTab'));
    const notParentId = dataFm && dataFm.tab && (dataFm.tab === 'inCharge' || (dataFm && dataFm.tab && dataFm.tab === 'support')) ? true : null;

    const dataCallBack = dataFm && dataFm.tab && dataFm.tab === 'inCharge' ? 1 : dataFm && dataFm.tab && dataFm.tab === 'support' ? 2 : 0;
    localStorage.setItem('taskAddCallBack', dataCallBack);
    localStorage.setItem('taskChildAddCallBack', dataFm && dataFm.tabChild);
    // localStorage.setItem('taskAddCallBack', dataCallBack);
    // const configs = JSON.parse(localStorage.getItem('crmSource'));
    // const taskStatusFm = configs && configs.find(item => item.code === 'S301').data;
    // console.log('taskStatusFm',taskStatusFm)

    const dataSource = JSON.parse(localStorage.getItem('crmSource'));
    const dataValSource = dataSource && dataSource.find(item => item.code === 'S301');
    const dataVal = dataValSource ? dataValSource.data : [];
    const dataFm1 = dataVal && dataVal.find(i => i._id === addProjects.taskLevel);

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

    // const obligate =
    //   Array.isArray(this.props.dashboardPage.roleTask.roles) && this.props.dashboardPage.roleTask.roles.find(item => item.code === 'SPECIALL');
    // const roleModuleObligate = obligate && obligate.data ? obligate.data : [];
    // const roleModuleObligateData =
    //   roleModuleObligate.find(elm => elm.name === 'obligate') && roleModuleObligate.find(elm => elm.name === 'obligate').data;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const avt = addProjects.objectAvatar || addProjects.avatar || randCover;
    const nameTask = parentId ? projectName : addProjects.name;
    const idTask = parentId ? projectId : id;

    const dataTask = JSON.parse(localStorage.getItem('TaskTabData'));
    const dataFmTask = dataTask && dataTask.newList && dataTask.newList.find(i => i._id === id);

    let dayDiff = new Date(addProjects.endDate) - new Date();
    if (!dayDiff) dayDiff = 1;
    const day = Math.abs(dayDiff / 86400000);
    const hours = Math.abs((dayDiff % 86400000) / 3600000);
    const dayProgress =
      ((new Date() - new Date(addProjects.startDate)) * 100) / (new Date(addProjects.endDate) - new Date(addProjects.startDate)).toFixed();

    let fillColor = dayDiff > 0 ? 'blue' : 'red';
    if (addProjects.taskStatus === 3) fillColor = 'green';

    const roleFm = addProjects.inCharge && addProjects.inCharge[0] && addProjects.inCharge[0]._id;

    const showButton = (id !== 'add' && dataHistory && dataHistory.find(i => i.receiver && i.receiver._id === profile._id)) || null;
    const showButton1 = showButton && showButton.statusAccept && showButton.statusAccept === 'Đang thực hiện';
    const showButton2 = addProjects.createdBy && addProjects.createdBy._id === profile._id && addProjects.statusAccept !== 'success';
    const dataCheckTask = showButton1 || showButton2;

    const general = () => {
      return (
        <Grid className="hello">
          <Grid item md={12}>
            <CustomAppBar
              title={
                id === 'add'
                  ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới Công việc' })}`
                  : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Công việc' })}`
              }
              onGoBack={() => {
                if (this.props.location && this.props.location.state && this.props.location.state.getCurrentData) {
                  //console.log("getCurrentData")
                  this.props.location.state.getCurrentData()
                }
                if (this.props.onClose) {
                  return this.props.onClose();
                }
                !selectTask ? this.handlecloseDrawer() : this.onCloseProject();
              }}
              // onSubmit={this.handleSaveProject}
              disableAdd
              moreButtons={
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {(id !== 'add' && (addProjects.createdBy && addProjects.createdBy._id === profile._id) && addProjects.statusAccept !== 'success') ||
                    id === 'add' ? (
                    <Button
                      variant="outlined"
                      color="inherit"
                      style={{ marginRight: 10, fontWeight: 'bold' }}
                      onClick={this.handleSaveProjectComPlate}
                      disabled={this.state.disableSave}
                    >
                      Hoàn thành
                    </Button>
                  ) : null}
                  {dataCheckTask || id === 'add' ? (
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={this.handleSaveProject}
                      style={{ fontWeight: 'bold' }}
                      disabled={this.state.disableSave}
                    >
                      Lưu
                    </Button>
                  ) : null}
                  {id !== 'add' && notParentId === true && addProjects && dataFmTask && dataFmTask.isAccept === false ? (
                    <>
                      <Button
                        variant="contained"
                        color="inherit"
                        style={{ marginRight: 10, fontWeight: 'bold' }}
                        onClick={e => {
                          this.setState({
                            openInCharge: true,
                          });
                        }}
                      >
                        Đồng ý
                      </Button>
                      <Button
                        variant="contained"
                        color="inherit"
                        style={{ marginRight: 10, fontWeight: 'bold' }}
                        onClick={e => {
                          this.setState({
                            openDelete: true,
                          });
                        }}
                      >
                        Từ chối
                      </Button>
                    </>
                  ) : null}
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Tabs value={tabTask} onChange={this.handleChangeTabsTask} indicatorColor="primary">
              <Tab label={"THÔNG TIN CÔNG VIỆC"} />
              
              { addProjects && addProjects._id && dataFm && dataFm.tab === "assignTask" && <Tab label={"HỒ SƠ CÔNG VIỆC LIÊN QUAN"} />}

              {/* {(addProjects.relateTo && Array.isArray(addProjects.relateTo) && addProjects.relateTo.length > 0) && dataFm && dataFm.tab === "assignTask" && <Tab label={"HỒ SƠ CÔNG VIỆC LIÊN QUAN"} />} */}
            </Tabs>
          </Grid>
          <PaperUI style={{ zIndex: '1 !important' }}>
            {tabTask === 0 && (
              <Grid item container spacing={8} md={12}>
                {/* {id !== "add" ? (
                 <Grid item md={12} style={{ marginTop: 70, margin: 10 }}>
                   <KanbanStep handleStepper={this.handleStepper} kanbanStatus={addProjects.kanbanStatus} currentStatus={currentStatus} />
                 </Grid>
               ) : null} */}
                <Grid item md={12}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>THÔNG TIN CÔNG VIỆC</span>
                  <Grid container spacing={8} style={{ paddingTop: 20 }}>
                    <Grid item md={3}>
                      <CustomInputBase
                        className={checkRequired.name ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                        autoFocus
                        error={localMessages && localMessages.name}
                        helperText={localMessages && localMessages.name}
                        required={checkRequired.name}
                        checkedShowForm={checkShowForm.name}
                        fullWidth
                        label={_.get(names, 'name', 'Tên công việc')}
                        onChange={e => this.handleChange('name', e.target.value)}
                        value={addProjects.name}
                        name="name"
                      />
                    </Grid>
                    <Grid item md={3}>
                      <AsyncAutocomplete
                        name="Chọn người được xem..."
                        label={'Người giao việc'}
                        onChange={value => this.props.mergeData({ taskMaster: value })}
                        url={API_USERS}
                        disabled
                        value={addProjects.taskMaster}
                        className={checkRequired.taskMaster ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                      />
                    </Grid>

                    <Grid item md={6}>
                      <Grid md={12} style={{ display: 'flex' }}>
                        <Grid item md={6} style={{ marginRight: 5 }}>
                          <CustomDatePicker
                            label={_.get(names, 'startDate', 'Ngày bắt đầu')}
                            value={addProjects.startDate}
                            name="startDate"
                            error={localMessages.startDate}
                            helperText={localMessages.startDate}
                            required={checkRequired.startDate}
                            checkedShowForm={checkShowForm.startDate}
                            className={checkRequired.startDate ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                            disabled={(!addProjects.isSmallest || !canUpdateTaskPlan(addProjects, currentUser)) && id !== 'add'}
                            minDate={moment().format('YYYY/MM/DD')}
                            onChange={value => this.handleChangeDate('startDate', value && moment(value).format('YYYY-MM-DD'))}
                            maxDateMessage={false}
                            minDateMessage={false}
                          />
                        </Grid>
                        <Grid item md={6} style={{ marginLeft: 5 }}>
                          <CustomDatePicker
                            label={_.get(names, 'endDate', 'Ngày kết thúc')}
                            value={addProjects.endDate ? addProjects.endDate : null}
                            name="endDate"
                            error={localMessages.endDate}
                            helperText={localMessages.endDate}
                            required={checkRequired.endDate}
                            checkedShowForm={checkShowForm.endDate}
                            className={checkRequired.endDate ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                            isFuture={true}
                            disabled={
                              ((!addProjects.isSmallest || !canUpdateTaskPlan(addProjects, currentUser)) && id !== 'add') || addProjects.template
                            }
                            minDate={addProjects.startDate}
                            onChange={value => this.handleChangeDate('endDate', value && moment(value).format('YYYY-MM-DD'))}
                            maxDateMessage={false}
                            minDateMessage={false}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={3}>
                      <CustomInputBase
                        value={addProjects.typeTask}
                        label={_.get(names, 'typeTask', 'Loại công việc')}
                        checkedShowForm={checkShowForm.typeTask}
                        required={checkRequired.typeTask}
                        error={localMessages && localMessages.typeTask}
                        helperText={localMessages && localMessages.typeTask}
                        onChange={e => this.handleChange('typeTask', e.target.value)}
                        select
                        className={checkRequired.typeTask ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                      >
                        {addProjects.configs.map((it, idx) => (
                          <MenuItem value={idx + 1} key={it.code}>
                            {it.name}
                          </MenuItem>
                        ))}
                      </CustomInputBase>
                    </Grid>
                    <Grid item md={3}>
                      <React.Fragment>
                        <AsyncAutocomplete
                          name="Chọn..."
                          label={_.get(names, 'template', 'Quy trình thực hiện')}
                          required={checkRequired.template}
                          checkedShowForm={checkShowForm.template}
                          error={localMessages && localMessages.template}
                          helperText={localMessages && localMessages.template}
                          onChange={this.selectTemplate}
                          filter={{
                            type: 'Task',
                          }}
                          url={API_SAMPLE_PROCESS}
                          value={addProjects.template}
                          className={checkRequired.template ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                          defaultOptions
                        />
                      </React.Fragment>
                    </Grid>
                    <Grid item md={3}>
                      <TextField
                        fullWidth
                        select
                        label={_.get(names, 'priority', 'Độ ưu tiên')}
                        value={addProjects.priority}
                        name="priority"
                        onChange={e => this.handleChange('priority', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        className={checkRequired.priority ? 'CustomRequiredLetter' : 'CustomIconRequired'}
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
                        required={checkRequired.inCharge}
                        checkedShowForm={checkShowForm.inCharge}
                        error={localMessages && localMessages.inCharge}
                        helperText={localMessages && localMessages.inCharge}
                        onChange={value => {
                          if (value && value.length > 1) {
                            return this.props.onChangeSnackbar({ status: true, message: 'Đồng chí không thể nhập 2 người xử lý chính', variant: 'error' });
  
                          } else {
                            return this.props.mergeData({ inCharge: value })
                          }
  
                        }
                        }
                        url={API_USERS}
                        filter={addProjects.support && addProjects.support.length ? { _id: { $nin: addProjects.support.map(item => item._id) } } : {}}
                        value={addProjects.inCharge}
                        className={checkRequired.inCharge ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                      />
                    </Grid> */}

                    {/* <Grid item md={6}>
                      <AsyncAutocomplete
                        isMulti
                        name="Chọn người được xem..."
                        label={_.get(names, 'support', 'Phối hợp xử lý')}
                        required={checkRequired.support}
                        checkedShowForm={checkShowForm.support}
                        error={localMessages && localMessages.support}
                        helperText={localMessages && localMessages.support}
                        onChange={value => this.props.mergeData({ support: value })}
                        url={API_USERS}
                        filter={addProjects.inCharge && addProjects.inCharge.length ? { _id: { $nin: addProjects.inCharge.map(item => item._id) } } : {}}
                        value={addProjects.support}
                        className={checkRequired.support ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                      />
                    </Grid> */}

                    {/* {console.log('addProjects.taskLevel', addProjects.taskLevel)} */}
                    {/* <Grid item md={12}  >
                     {roleModuleObligateData && roleModuleObligateData.access === true
                       ? id === 'add' && (
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
                        onChange={e => this.props.mergeData({ description: e.target.value })}
                        value={addProjects.description}
                        label={_.get(names, 'description', 'Nội dung công việc')}
                        rows={5}
                        multiline
                        checkedShowForm={checkShowForm.description}
                        required={checkRequired.description}
                        error={localMessages && localMessages.description}
                        helperText={localMessages && localMessages.description}
                        name="description"
                        style={{ zIndex: 0 }}
                        className={checkRequired.description ? 'CustomRequiredLetter' : 'CustomIconRequired'}
                      />
                    </Grid>

                    <Grid item xs={12} style={{ marginTop: 20 }}>
                      {id && docDetail ? (
                        <>
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
                            deleteFile={dataFm && dataFm.tab === "assignTask" ? true : false}
                          />
                        </>
                      ) : (
                        <div>
                          <div>
                            <span style={{ fontSize: 14, fontWeight: 600, marginRight: 10, width: 140, display: 'inline-block' }}>TỆP ĐÍNH KÈM</span>
                            <label htmlFor="fileUpload" style={{ display: 'inline-block', marginRight: 10 }}>
                              <Button color="primary" variant="contained" component="span" style={{ fontWeight: 'bold' }}>
                                {/* <span style={{ marginRight: 5 }}>
                                 <AttachFileIcon />
                               </span> */}
                                Tải lên
                              </Button>
                            </label>
                          </div>
                          <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            {localState.file && <FileUpload file={localState.file} id={'add'} onDeleteFile={this.handleFileDelete} />}
                          </div>
                          <input onChange={this.handleFileChange} id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" multiple />
                        </div>
                      )}
                    </Grid>

                    <Grid item xs={12} style={{ marginTop: 20 }}>
                      <span style={{ marginRight: 10, fontSize: 14, fontWeight: 600,  display: 'inline-block' }}>VĂN BẢN ĐẾN ĐÍNH KÈM</span>

                      {id === 'add' ? (
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
                            Tìm kiếm
                          </Button>
                        </label>
                      ) : null}
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
                            Tìm kiếm
                          </Button>
                        </label>
                      ) : null}

                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ alignItems: 'center', fontWeight: 'bold', width: '20%' }}>Số văn bản</TableCell>
                            <TableCell style={{ alignItems: 'center', fontWeight: 'bold', width: '20%' }}>Ngày văn bản</TableCell>
                            <TableCell style={{ alignItems: 'center', fontWeight: 'bold', width: '40%' }}>Trích yếu</TableCell>
                            {id === 'add' || dataCheckTask ? (
                              <TableCell style={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold', width: '20%' }}>Hành động</TableCell>
                            ) : null}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(addProjects.incommingDocuments) &&
                            addProjects.incommingDocuments.length > 0 ?
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
                                    {item.documentDate}
                                  </TableCell>
                                  <TableCell style={{ cursor: 'pointer', width: '40%', color: "blue" }} onClick={e => this.onClickRow(e, item._id)}>
                                    <span
                                      style={{
                                        alignItems: 'center',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        WebkitLineClamp: 3,
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        minWidth: 220,
                                        maxWidth: 500,
                                      }}
                                    >
                                      {item.abstractNote}
                                    </span>
                                  </TableCell>

                                  {dataCheckTask ? (
                                    <TableCell style={{ alignItems: 'center', textAlign: 'center', width: '20%' }}>
                                      <Tooltip title="Xóa văn bản">
                                        <Delete style={{ cursor: 'pointer' }} onClick={e => this.deleteDocs(e, item._id)} />
                                      </Tooltip>
                                    </TableCell>
                                  ) : null}
                                  {id === 'add' ? (
                                    <TableCell style={{ alignItems: 'center', textAlign: 'center', width: 220 }}>
                                      <Tooltip title="Xóa văn bản">
                                        <Delete
                                          style={{ cursor: 'pointer' }}
                                          onClick={e => {
                                            this.deleteDocs(e, item._id);
                                          }}
                                        />
                                      </Tooltip>
                                    </TableCell>
                                  ) : null}
                                </TableRow>
                              );
                            }):
                            <>
                            <TableRow>
                            <TableCell style={{ textAlign: 'center' }} colSpan="4">Bảng không có dữ liệu</TableCell>
                            
                          </TableRow>
                            
                            </>
                          }
                        </TableBody>
                      </Table>
                    </Grid>


                    <Grid item xs={12} style={{ marginTop: 20 }}>
                      <span style={{ marginRight: 10, fontSize: 14, fontWeight: 600, display: 'inline-block' }}>VĂN BẢN ĐI ĐÍNH KÈM</span>

                      {id === 'add' ? (
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
                            Tìm kiếm
                          </Button>
                        </label>
                      ) : null}
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
                            Tìm kiếm
                          </Button>
                        </label>
                      ) : null}

                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ alignItems: 'center', fontWeight: 'bold', width: '20%' }}>Số văn bản</TableCell>
                            <TableCell style={{ alignItems: 'center', fontWeight: 'bold', width: '20%' }}>Ngày văn bản</TableCell>
                            <TableCell style={{ alignItems: 'center', fontWeight: 'bold', width: '40%' }}>Trích yếu</TableCell>
                            {id === 'add' || dataCheckTask ? (
                              <TableCell style={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold', width: '20%' }}>Hành động</TableCell>
                            ) : null}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(addProjects.outGoingDocuments) &&
                            addProjects.outGoingDocuments.length > 0 ? 
                            addProjects.outGoingDocuments.map((item, index) => {
                              return (
                                <TableRow>
                                  <TableCell
                                    style={{ cursor: 'pointer', alignItems: 'center', width: '20%', color: "blue" }}
                                    onClick={e => this.onClickRowGoDocument(e, item._id)}
                                  >
                                    {item.toBook}
                                  </TableCell>
                                  <TableCell
                                    style={{ cursor: 'pointer', alignItems: 'center', width: '20%', color: "blue" }}
                                    onClick={e => this.onClickRowGoDocument(e, item._id)}
                                  >
                                    {item.documentDate}
                                  </TableCell>
                                  <TableCell style={{ cursor: 'pointer', width: '40%', color: "blue" }}
                                    onClick={e => this.onClickRowGoDocument(e, item._id)}
                                  >
                                    <span
                                      style={{
                                        alignItems: 'center',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        WebkitLineClamp: 3,
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        minWidth: 220,
                                        maxWidth: 500,
                                      }}
                                    >
                                      {item.abstractNote}
                                    </span>
                                  </TableCell>

                                  {dataCheckTask ? (
                                    <TableCell style={{ alignItems: 'center', textAlign: 'center', width: '20%' }}>
                                      <Tooltip title="Xóa văn bản">
                                        <Delete style={{ cursor: 'pointer' }} onClick={e => this.deleteDocsOut(e, item._id)} />
                                      </Tooltip>
                                    </TableCell>
                                  ) : null}
                                  {id === 'add' ? (
                                    <TableCell style={{ alignItems: 'center', textAlign: 'center', width: 220 }}>
                                      <Tooltip title="Xóa văn bản">
                                        <Delete
                                          style={{ cursor: 'pointer' }}
                                          onClick={e => {
                                            this.deleteDocsOut(e, item._id);
                                          }}
                                        />
                                      </Tooltip>
                                    </TableCell>
                                  ) : null}
                                </TableRow>
                              );
                            }) :
                            <>
                            {/* id === 'add' || dataCheckTask */}
                          <TableRow>
                            <TableCell style={{ textAlign: 'center' }} colSpan="4">Bảng không có dữ liệu</TableCell>
                            
                          </TableRow>
                            </>
                            }
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
                            taskAttachedd.map((item, index) => {
                              return (
                                <TableRow>
                                  <TableCell
                                    // onClick={() => {
                                    //   this.props.history.push({
                                    //     pathname: `/Task/task-detail/${item._id}`,
                                    //     ids: id
                                    //   });
                                    // }}

                                    style={{ cursor: 'pointer', alignItems: 'center' }}
                                  >
                                    {item.name}
                                  </TableCell>
                                  <TableCell
                                    // onClick={() => {
                                    //   this.props.history.push({
                                    //     pathname: `/Task/task-detail/${item._id}`,
                                    //     ids: id
                                    //   });
                                    // }}

                                    style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left' }}
                                  >
                                    {item.typeTask}
                                  </TableCell>
                                  <TableCell
                                    // onClick={() => {
                                    //   this.props.history.push({
                                    //     pathname: `/Task/task-detail/${item._id}`,
                                    //     ids: id
                                    //   });
                                    // }}

                                    style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left'}}
                                  >
                                    {item.description}
                                  </TableCell>
                                  <TableCell
                                  // onClick={() => {
                                  //   props.history.push({
                                  //     pathname: `/Task/task-detail/${item._id}`,
                                  //     state: {
                                  //       idd: id ? id : "add",
                                  //       localState: JSON.stringify(localState)
                                  //     }
                                  //   });
                                  // }}

                                  // style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'left', color: 'blue' }}
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



                    <Grid item xs={12} style={{ marginTop: 20 }}>
                      <span style={{ marginRight: 10, fontSize: 14, fontWeight: 600, width: 140, display: 'inline-block' }}>NGƯỜI THAM GIA</span>
                      {id === 'add' ? (
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

                      {id === 'add' ? (
                        <div style={{ overflowX: 'auto' }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                {Array.isArray(dataTitle) &&
                                  dataTitle.length > 0 &&
                                  dataTitle.map(item => {
                                    return <TableCell style={{ alignItems: 'center', fontWeight: 'bold' }}>{item.title}</TableCell>;
                                  })}
                                <TableCell style={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}>Hành động</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Array.isArray(addProjects.processors) &&
                                addProjects.processors.length > 0 &&
                                addProjects.processors.map((item, index) => {
                                  return (
                                    <TableRow>
                                      {/* {Array.isArray(addProjects.processors) && addProjects.processors.length > 0 && addProjects.processors.map(i => {
                                     <TableCell style={{ cursor: 'pointer', alignItems: 'center' }}>{ }</TableCell>
                                   }
 
                                   )} */}
                                      {/* <TableCell style={{ cursor: 'pointer', alignItems: 'center' }}>{( dataUserFm.find(i => i._id === item.receiver) && dataUserFm.find(i => i._id === item.receiver)).name || ''}</TableCell> */}
                                      <TableCell style={{ alignItems: 'center' }}>{item.name}</TableCell>

                                      <TableCell style={{ alignItems: 'center' }}>
                                        {item.roleGroup
                                          ? roleGroup.find(i => i.code === item.roleGroup)
                                            ? roleGroup.find(i => i.code === item.roleGroup).name
                                            : null
                                          : ''}
                                      </TableCell>

                                      <TableCell style={{ alignItems: 'center' }}>{item.unit && item.unit.name}</TableCell>

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
                                            <IconButton
                                              style={{ textTransform: 'inherit', cursor: 'pointer' }}
                                              variant="contained"
                                              size="small"
                                              color="primary"
                                              onClick={() => {
                                                console.log("NGƯỜI THAM GIA 1")
                                                this.setState({ openContent: true, noteHistory: index });
                                                this.props.mergeData({ textContent: item.content });
                                              }}
                                            >
                                              <Edit />
                                            </IconButton>
                                          </div>
                                        ) : (
                                          <IconButton
                                            style={{ textTransform: 'inherit', cursor: 'pointer' }}
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            onClick={() => {
                                              console.log("NGƯỜI THAM GIA 2")
                                              this.setState({ openContent: true, noteHistory: index });
                                              this.props.mergeData({ textContent: '' });
                                            }}
                                          >
                                            <Edit />
                                          </IconButton>
                                        )}
                                      </TableCell>
                                      <TableCell style={{ alignItems: 'center' }}>{item.statusAccept}</TableCell>
                                      <TableCell style={{ alignItems: 'center' }}>{''}</TableCell>
                                      <TableCell style={{ alignItems: 'center' }}>{''}</TableCell>
                                      <TableCell style={{ alignItems: 'center' }}>{''}</TableCell>
                                      <TableCell style={{ alignItems: 'center', textAlign: 'center' }}>
                                        <Tooltip title="Xóa người tham gia">
                                          <Delete style={{ cursor: 'pointer' }} onClick={() => this.deleteTaskDocs(item.receiver)} />
                                        </Tooltip>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : null}
                    </Grid>

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
                              <TableCell style={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}>Hành động</TableCell>
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
                                            <IconButton
                                              style={{ textTransform: 'inherit', cursor: 'pointer' }}
                                              variant="contained"
                                              size="small"
                                              color="primary"
                                              onClick={() => {
                                                console.log("NGƯỜI THAM GIA 3")
                                                this.setState({ openContent: true, noteHistory: item._id });
                                                this.props.mergeData({ textContent: item.content });
                                              }}
                                            >
                                              <Edit />
                                            </IconButton>
                                          ) : null}
                                        </div>
                                      ) : (
                                        <>
                                          {id !== 'add' && showButton2 ? (
                                            <IconButton
                                              style={{ textTransform: 'inherit', cursor: 'pointer' }}
                                              variant="contained"
                                              size="small"
                                              color="primary"
                                              onClick={() => {
                                                console.log("NGƯỜI THAM GIA 2")
                                                this.setState({ openContent: true, noteHistory: item._id });
                                                this.props.mergeData({ textContent: '' });
                                              }}
                                            >
                                              <Edit />
                                            </IconButton>
                                          ) : null}
                                        </>
                                      )}
                                    </TableCell>
                                    <TableCell style={{ alignItems: 'center' }}>{item.statusAccept}</TableCell>

                                    <TableCell style={{ alignItems: 'center' }}>
                                      {item.taskLevel}
                                      {showButton2 &&
                                        item.statusAccept === 'Hoàn thành' &&
                                        (!item.taskLevel || item.taskLevel === '' || item.taskLevel === null) ? (
                                        <Button
                                          style={{ textTransform: 'inherit', cursor: 'pointer' }}
                                          variant="outlined"
                                          size="small"
                                          color="primary"
                                          onClick={() => {
                                            this.setState({ openEvaluate: true, noteHistory: item._id });
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
                                          variant="outlined"
                                          size="small"
                                          color="primary"
                                          onClick={() => {
                                            this.setState({ openCompleteAny: true, noteHistory: item._id });
                                          }}
                                        >
                                          Hoàn thành
                                        </Button>
                                      ) : null}
                                      {dataCheckTask ? (
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
              </Grid>
            )}
                        {/* {tabTask === 1 && dataFm && dataFm.tab === "assignTask" && (addProjects.relateTo && Array.isArray(addProjects.relateTo) && addProjects.relateTo.length > 0) && ( */}

            {addProjects._id && tabTask === 1 && dataFm && dataFm.tab === "assignTask"  && (
              <>
                <ListPage
                  disableEdit
                  disableAdd
                  disableViewConfig
                  disableDelete
                  // mapFunction={mapFunction}
                  // filter={{ _id: addProjects.relateTo[0] }}
                  disableImport
                  pointerCursor="pointer"
                  code="Task"
                  apiUrl={`${API_TASK_PROJECT}/projects?id=${addProjects._id}`}
                  height="calc(100vh - 310px)"
                // parent
                />
              </>
            )}
            <Dialog
              title="Đánh giá"
              onSave={this.saveDone}
              saveText="Đánh giá"
              open={openEvaluate}
              onClose={() => this.setState({ openEvaluate: false })}
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
              title="Đồng chí có chắc chắn muốn từ chối không ?"
              onSave={this.saveDelete}
              saveText="Từ chối"
              open={openDelete}
              onClose={() => this.setState({ openDelete: false })}
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

            {
              openTaskAsign && <DocumentAssignModal
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
                // onSuccess={() => {
                //   setOpenAsignProcessor(false);
                //   setSelectedTemplate(null);
                //   cb();
                // }}
                onChangeSnackbar={onChangeSnackbar}
                currentRole={profile.organizationUnit.organizationUnitId}
                // allTemplates={allTemplates}
                // businessRole={businessRole}
                filterPeople={dataPeople && dataPeople}
              />
            }

            <SwipeableDrawer
              anchor="right"
              onClose={() => this.setState({ openEditDialog: false })}
              open={openEditDialog}
              width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
            >
              {
                openEditDialog && <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
                  <EditExecutiveDocuments id={idEdit} goBack={() => this.setState({ openEditDialog: false })} />
                </div>
              }

            </SwipeableDrawer>
            <SwipeableDrawer
              anchor="right"
              onClose={() => this.setState({ openEditOutGoingDialog: false })}
              open={openEditOutGoingDialog}
              width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
            >
              {
                openEditOutGoingDialog && <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260, marginTop: 58, padding: 20 }}>
                  <EditGoDocuments id={idEdit} goBack={() => this.setState({ openEditOutGoingDialog: false })} />
                </div>
              }

            </SwipeableDrawer>
            {
              this.state.openDialogFilter && <Dialog dialogAction={false} onClose={this.closeDialog} open={this.state.openDialogFilter}>
                <FilterDocs onSave={this.onSaveFilterDocs} handleCloseFilter={this.closeDialog} onChangeSnackbar={onChangeSnackbar} processType={this.state.processType} profile={this.props.profile}/>
              </Dialog>
            }

          </PaperUI >
        </Grid >
      );
    };

    return (
      <div className="project-main" >
        <div className="bg-color" />
        <Helmet>
          <title> Công việc</title>
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
          {/* {(this.props.id ? this.props.id : this.props.match.params.id) === 'add' ? (
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
                    {speciall && speciall.find(elm => elm.name === 'addSpecial').data.access === true ? (
                      <TaskType
                        background="linear-gradient(45deg, rgb(246, 61, 47), #ff9d95)"
                        hanldeClick={() => this.props.mergeData({ selectTask: false, type: 2 })}
                        icon={<PersonAddDisabled style={{ fontSize: '5rem' }} />}
                        description={intl.formatMessage(messages.tieudecongkhai || { id: 'tieudean', defaultMessage: 'tieudean' })}
                        title={intl.formatMessage(messages.nhoman || { id: 'nhoman', defaultMessage: 'nhoman' })}
                      />
                    ) : null}
  
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
              </div> */}

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
                  {/* <TypographyDetail data={<Files files={addProjects.files} />}>Tài liệu đính kèm: </TypographyDetail> */}
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
                  <TextField select fullWidth label="Chọn công việc và dự án" name="idSelect" value={addProjects.idSelect} onChange={this.selectTask}>
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
                <Grid item md={12}>
                  {tabContract === 0 ? (
                    <ListPage
                      hightLight
                      disableEdit
                      disableAdd
                      disableDot
                      disableSelect
                      code="TaskContract"
                      parentCode="Task"
                      apiUrl={GET_TASK_CONTRACT}
                      typeContract="2"
                      taskId={addProjects._id}
                      mapFunction={this.mapContract}
                    />
                  ) : null}
                  {tabContract === 1 ? (
                    <ListPage
                      disableEdit
                      disableAdd
                      disableDot
                      disableSelect
                      code="TaskContract"
                      parentCode="Task"
                      typeContract="1"
                      taskId={addProjects._id}
                      apiUrl={GET_TASK_CONTRACT}
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
                  {/* <React.Fragment>
                     <AsyncAutocomplete
                       name="Chọn..."
                       label="Nhóm phê duyệt"
                       onChange={this.handleAddApprovedGroup}
                       url={API_APPROVE_GROUPS}
                       value={approvedObj.group}
                     />
                   </React.Fragment> */}
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

          {(selectTask && id === 'add' && this.props.data.isProject) || tabIndex === 3 ? null : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 10, marginRight: 40 }} />
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
        <Dialog dialogAction={false} onClose={() => this.setState({ openDialogTask: false })} open={openDialogTask}>
          {
            openDialogTask && <TaskDocs onSave={this.onSaveTask} handleCloseFilter={() => this.setState({ openDialogTask: false })}  profile={this.props.profile}/>

          }
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
      </div>
    );
  }
}

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
    postProject: (data, cb, docSeen) => dispatch(postProject(data, cb, docSeen)),
    postFile: data => dispatch(postFile(data)),
    getProjectCurrent: (id, data) => dispatch(getProjectCurrent(id, data)),
    putProject: (data, id, cb) => dispatch(putProject(data, id, cb)),
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
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  // withStyles(stylePaper),
)(AddProjects);
