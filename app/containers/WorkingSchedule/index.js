/**
 *
 * WorkingSchedule
 *
 */

import React from 'react';
import PropTypes, { element } from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import { clientId } from '../../variable';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

import {
  Badge,
  Fab,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button,
  withStyles,
  TextField,
  Grid as GridUI,
} from '@material-ui/core';
import { Grid as GridLife } from 'components/LifetekUi';
import { Notifications, Comment as InsertCommentOutlined, Send, Grid, ArrowDropDown, Print as PrintUI, Today } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import CustomButton from 'components/CustomButtons/Button';
import AddProjects from 'containers/AddProjects';
import CalendarContainer from '../CalendarContainer';
import AddWorkingSchedule from 'containers/AddWorkingSchedule';
import injectReducer from 'utils/injectReducer';
import {
  API_DOCUMENT_PROCESS_TEMPLATE,
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_MEETING,
  API_MEETING_UPDATE_CALEN_DETAIL,
  API_ROLE_APP,
  API_USERS,
} from '../../config/urlConfig';
import { Paper, SwipeableDrawer, Tabs, Tab } from '../../components/LifetekUi';
import { Dialog as DialogUI } from 'components/LifetekUi';
import makeSelectWorkingSchedule from './selectors';
import makeSelectDashboardPage, { makeSelectMiniActive, makeSelectProfile } from '../Dashboard/selectors';
//import ExportToExcel from "./ExportToExcel"
import reducer from './reducer';
import saga from './saga';
import { getData, mergeData } from './actions';
import moment from 'moment';
// import { calendarColumns } from '../../variable';
import CalendarComponent from '../../components/Calendar';

import DocumentAssignMeeting from '../../components/DocumentAssignModal/DocumentAssignMeeting';
import CalendarAssignModal from 'components/CalendarAssignModal';
import { getListData } from '../../utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import CompleteDocs from 'components/CalendarAssignModal/CompleteDocs';
import PublishDocs from 'components/CalendarAssignModal/PublishDocs';
import DeltetePublishDocs from 'components/CalendarAssignModal/DeltetePublishDocs';
import DestroyDocs from 'components/CalendarAssignModal/DestroyDocs';
import { fetchData, serialize, workingCalendarTable, printTemplte } from '../../helper';
import { ButtonComponent, SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
import styles from './styles';
import messages from './messages';
import { injectIntl } from 'react-intl';
import Buttons from 'components/CustomButtons/Button';
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Year,
  TimelineViews,
  TimelineMonth,
  TimelineYear,
  ViewsDirective,
  ViewDirective,
  ResourcesDirective,
  ResourceDirective,
  Inject,
  Resize,
  DragAndDrop,
  Agenda,
  Print,
  ExcelExport,
  ICalendarImport,
  ICalendarExport,
  Timezone,
} from '@syncfusion/ej2-react-schedule';
import { extend } from '@syncfusion/ej2-base';
import './index.css';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { meetingReturnDoc } from '../../utils/api/metting';
import ReturnMeetingDoc from '../../components/CalendarAssignModal/ReturnMeetingDoc';
import _ from 'lodash';
import { ItemExtra } from 'semantic-ui-react';
import { WindowRounded } from '@mui/icons-material';
//import ScheduleWork from '../ScheduleWork';

/* eslint-disable react/prefer-stateless-function */
export class WorkingSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.multiple = false;
    this.showFileList = false;
    this.allowedExtensions = '.ics';
    this.state = {
      tab: 0,
      openDialog: null,
      openAsignProcessor: null,
      selectedDocs: [],
      canView: false,
      newTab: false,
      tabIndex: 5,
      id: 'add',
      openDrawer: false,
      openDrawerMeeting: false,
      showTemplates: false,
      templates: [],
      currentRole: null,
      openComplete: false,
      openPublish: false,
      openDestroy: false,
      openDeletePublish: false,
      allRoles: [],
      reload: 0,
      typeRole: null,
      businessRole: {},
      dataSource: [],
      listUsers: [],
      export: 0,
      exportItems: [{ text: 'iCalendar', iconCss: 'e-icons e-export' }, { text: 'Excel', iconCss: 'e-icons e-export-excel' }],
      countWorking: {},
      templatesData: [],
      goBack: false,
      unit: null,
      processType: '',
      tabCalendar: 1,
      datePlan: moment(),
      dataPlan: [],
      dayOfWeek: ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ Năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'],
      printInfo: false,
      position: '',
      cap_bac: '',
      disableWeek: 0,
      showTV: false
    };
  }

  Buttons(props) {
    return (
      <Buttons
        // color={props.tab === tab ? 'gradient' : 'simple'}
        color={props.color}
        right
        round
        size="sm"
        onClick={props.onClick}
      >
        {props.children}
      </Buttons>
    );
  }

  onPopupOpen = e => {
    if (e.type === 'DeleteAlert') {
      e.cancel = true;
      if (this.props.handleDelete) {
        this.props.handleDelete(e.data.event);
      }
    }
    if (e.type === 'Editor') {
      if (this.props.handleAdd) {
        e.cancel = true;
        if (e.data.Id) {
          if (this.props.handleEdit) {
            this.props.handleEdit(e.data);
          }
        } else {
          this.props.handleAdd(e.data.StartTime);
        }
      }
    }
    if (e.type === 'QuickInfo') {
      if (!e.data.Id) {
        e.cancel = true;
      }
    }
    if (e.type === '"DeleteAlert"') {
      e.cancel = true;
    }
  };

  random = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  getID = () => {
    return (
      this.random() +
      '-' +
      this.random() +
      '-' +
      this.random() +
      '-' +
      this.random() +
      '-' +
      this.random() +
      '-' +
      this.random() +
      '-' +
      this.random() +
      '-' +
      this.random()
    );
  };
  onNavigating(args) {
    if (args.action == 'view' && this.isHubConnected) {
      this.connection.invoke('SendData', args.action, args.currentView);
    }
  }
  onActionComplete(args) {
    if (this.isHubConnected && (args.requestType === 'eventCreated' || args.requestType === 'eventChanged' || args.requestType === 'eventRemoved')) {
      this.connection.invoke('SendData', args.requestType, this.scheduleObj.eventSettings.dataSource);
    }
  }
  onPrint() {
    this.scheduleObj.print();
  }
  onExportClick(args) {
    if (args.item.text === 'Excel') {
      const exportFields = [
        { name: 'Id', text: 'Mục' },
        { name: 'Subject', text: 'Cuộc họp' },
        { name: 'StartTime', text: 'Thời gian bắt đầu' },
        { name: 'EndTime', text: 'Thời gian kết thúc' },
        { name: 'Location', text: 'Địa điểm' },
      ];
      let eventCollection = this.scheduleObj.getEvents();
      this.scheduleObj.exportToExcel({
        exportType: 'xlsx',
        customData: eventCollection,
        fields: ['Id', 'Subject', 'StartTime', 'EndTime', 'Location'],
        fieldsInfo: exportFields,
      });
    } else {
      this.scheduleObj.exportToICalendar();
    }
  }
  onSelect(args) {
    this.scheduleObj.importICalendar(args.event.target.files[0]);
  }
  componentWillMount() {
    this.props.getData();
  }

  customTemplate({ role, childrens = [], type = [], first = false }) {
    if (role && childrens) {
      const child = childrens.find(f => f.code === role);
      if (child) {
        if (type.length && child.type && child.type !== '' && type.find(t => child.type === t)) {
          this.setState({ templates: child.children || [] });
        } else {
          if (!first) {
            this.setState({ templates: child.children || [] });
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
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');

    this.getDataTabPlan(this.state.tabCalendar);

    getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/calendar`).then(res => {
      if (res) {
        this.setState({ templates: res.children || [], templatesData: res });
        this.customTemplate({ role: this.props.profile.roleGroupSource, childrens: res.children, type: this.props.profile.type });
      } else {
        this.props.onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng xử lý', status: true });
      }
    });

    fetch(`${API_MEETING}/count`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ countWorking: data });
      });
    fetch(`${API_USERS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ listUsers: data.data });
      });
    fetchData(`${API_ROLE_APP}/Calendar/${this.props.profile._id}`)
      .then(res => {
        const newBusinessRole = {};
        const { roles } = res;
        const code = 'BUSSINES';
        const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
        const { data } = foundRoleDepartment;
        this.setState({ allRoles: data });
        const { allRoles, tabIndex } = this.state;
        const dataProcessorsFmx = allRoles && allRoles.find(elm => elm.name === 'processors');
        const dataCompalteFmx = allRoles && allRoles.find(elm => elm.name === 'compalte');
        const dataPublishFmx = allRoles && allRoles.find(elm => elm.name === 'publish');

        const dataProcessorsFmC = dataProcessorsFmx && dataProcessorsFmx.data;
        const dataCompalteFmC = dataCompalteFmx && dataCompalteFmx.data;
        const dataPublishFmC = dataPublishFmx && dataPublishFmx.data;

        const dataFm =
          dataProcessorsFmC && dataProcessorsFmC.view && dataProcessorsFmC.view === true
            ? 0
            : dataCompalteFmC && dataCompalteFmC.view && dataCompalteFmC.view === true
              ? 1
              : dataPublishFmC && dataPublishFmC.view && dataPublishFmC.view === true
                ? 2
                // : 3;
                : 5;
        // console.log('tab: 0')
        const a = JSON.parse(localStorage.getItem('addWorkingScheduleCallback'));
        const b = JSON.parse(localStorage.getItem('editWorkingScheduleCallback'));
        if (a !== null || a || (b !== null || b)) {
          const tabFmAdd = a && a.tab;
          const tabChildFmAdd = a && a.tabChild;
          const tabFmEdit = b && b.tab;
          const tabChildFmEdit = b && b.tabChild;
          this.setState({ tabIndex: Number(tabFmAdd) || Number(tabFmEdit), tab: Number(tabChildFmAdd) || Number(tabChildFmEdit) });
        } else {
          this.setState({ tabIndex: dataFm, tab: 0 });
        }
      })
      .catch(error => {
        // console.log('error', error);
      });

    // let task_mettings = this.props.workingSchedule.mettings;
    // let list = [];
    // //console.log(task_mettings);
    // if (task_mettings !== undefined) {
    //   task_mettings.forEach(item => {
    //     if (item.publishStatus === 'publish') {
    //       if (item.calenDetail.length === 1 && item.calenDetail[0].length === 1) {
    //         // list.push({
    //         //   ...item,
    //         //   Id: item._id,
    //         //   CategoryColor: '#7fa900',
    //         //   Subject: item.name,
    //         //   Location: item.address?item.address :"ha Noi",
    //         //   StartTime: item.calenDetail[0][0].timeMeet,
    //         //   EndTime: item.timeEnd,
    //         //Description: item.content,
    //         // });
    //       } else {
    //         for (const i of item.calenDetail) {
    //           for (const j of i) {
    //             //console.log("day",j.timeMeet.getDay());
    //             const year = parseInt(j.timeMeet.substr(0, 4));
    //             const month = parseInt(j.timeMeet.substr(5, 7));
    //             const day = parseInt(j.timeMeet.substr(8, 10));
    //             const hour = parseInt(j.timeMeet.substr(11, 13));
    //             const minute = parseInt(j.timeMeet.substr(14, 16));
    //             // console.log(year,month,day,hour);
    //             let new_id = this.getID();
    //             let new_item = {
    //               ...item,
    //               Id: new_id,
    //               CategoryColor: '#7fa900',
    //               Subject: item.content,
    //               Location: item.address ? item.address : 'ha Noi',
    //               StartTime: j.timeMeet,
    //               //EndTime: new Date(year, month - 1, day, hour + 7, minute + 1).toISOString(),
    //               EndTime: j.timeEndMeet,
    //               // Description: item.content,
    //             };
    //             // console.log("starttime",new_item.StartTime)
    //             // console.log("endtime",new_item.EndTime)
    //             list.push(new_item);
    //           }
    //         }
    //       }
    //     }
    //   });
    //   this.setState({ dataSource: extend([], list, null, true) });
    // }
  }

  componentWillReceiveProps = props => {
    if (this.props.workingSchedule !== props.workingSchedule) {
      let taskMettings = props.workingSchedule.mettings;
      let list = [];
      if (taskMettings !== undefined) {
        taskMettings.forEach(item => {
          if (item.publishStatus === 'publish') {
            if (item.calenDetail.length === 1 && item.calenDetail[0].length === 1) {
              // list.push({
              //   ...item,
              //   Id: item._id,
              //   CategoryColor: '#7fa900',
              //   Subject: item.name,
              //   Location: item.address?item.address :"ha Noi",
              //   StartTime: item.calenDetail[0][0].timeMeet,
              //   EndTime: item.timeEnd,
              //Description: item.content,
              // });
            } else {
              for (const i of item.calenDetail) {
                for (const j of i) {
                  //console.log("day",j.timeMeet.getDay());
                  const year = parseInt(j.timeMeet.substr(0, 4));
                  const month = parseInt(j.timeMeet.substr(5, 7));
                  const day = parseInt(j.timeMeet.substr(8, 10));
                  const hour = parseInt(j.timeMeet.substr(11, 13));
                  const minute = parseInt(j.timeMeet.substr(14, 16));
                  // console.log(year,month,day,hour);
                  let new_id = this.getID();
                  let new_item = {
                    ...item,
                    Id: new_id,
                    CategoryColor: '#7fa900',
                    Subject: item.content,
                    Location: item.address ? item.address : 'ha Noi',
                    StartTime: j.timeMeet,
                    // EndTime: new Date(year, month - 1, day, hour + 7, minute + 1).toISOString(),
                    EndTime: j.timeEndMeet,
                    // Description: item.content,
                  };
                  // console.log("starttime",new_item.StartTime)
                  // console.log("endtime",new_item.EndTime)
                  list.push(new_item);
                }
              }
            }
          }
        });
        this.setState({ dataSource: extend([], list, null, true) });
      }
    }
  };
  onEventRendered(args) {
    let categoryColor = args.data.CategoryColor;
    if (!args.element || !categoryColor) {
      return;
    }
    if (this.scheduleObj.currentView === 'Agenda') {
      args.element.firstChild.style.borderLeftColor = categoryColor;
    } else {
      args.element.style.backgroundColor = categoryColor;
    }
  }

  getStateSelection = (e, tab) => {
    Array.isArray(e) && e.length > 0 ? this.setState({ canView: true }) : this.setState({ canView: false });
    if (tab) {
      this.setState({ newTab: true });
    } else {
      this.setState({ newTab: false });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tabIndex !== this.state.tabIndex || prevState.tab !== this.state.tab) {
      const { allRoles, tabIndex } = this.state;

      const dataProcessors = allRoles && allRoles.find(elm => elm.name === 'processors');
      const dataCompalte = allRoles && allRoles.find(elm => elm.name === 'compalte');
      const dataPublish = allRoles && allRoles.find(elm => elm.name === 'publish');
      const dataProcessorsFm = dataProcessors && dataProcessors.data;
      const dataCompalteFm = dataCompalte && dataCompalte.data;
      const dataPublishFm = dataPublish && dataPublish.data;
      if (tabIndex === 0) {
        this.setState({ businessRole: dataProcessorsFm });
      } else if (tabIndex === 1) {
        this.setState({ businessRole: dataCompalteFm });
      } else if (tabIndex === 2) {
        this.setState({ businessRole: dataPublishFm });
      }

      this.setState({ canView: false });
      // mergeData({ tab: 0 });
      // const { tab } = workingSchedule;
      // this.props.mergeData({ tab: 0 });
      localStorage.setItem('WorkingCalendarTab', this.state.tabIndex);
    }
  }

  handleOpen = e => {
    this.setState({
      openDialog: e.currentTarget,
    });
  };

  handleClose = e => {
    this.setState({ openDialog: false });
  };

  handleRefactor = (val, rootTab) => {
    const docIds = Array.isArray(val) ? val.map(v => v._id) : [];
    if (rootTab === 'receive') {
      const childrenFm = Array.isArray(val) ? val.map(v => v !== undefined && v.children) : [];
      const selectedDocsData = Array.isArray(val) ? val : [];
      this.setState({ selectedDocs: docIds, children: val.children, selectedDocsData });
      switch (rootTab) {
        case 'receive':
          this.setState({ selectedDocs: docIds });
          break;
        case 'feedback':
        case 'viewers':
        case 'commander':
          this.setState({ selectedDocs: docIds });
          break;
      }
    } else {
      const childrenFm = Array.isArray(val) ? val.map(v => v !== undefined && v.originItem !== undefined && v.originItem.children) : [];
      const selectedDocsData = Array.isArray(val) ? val : [];
      this.setState({ selectedDocs: docIds, children: childrenFm, selectedDocsData });
      switch (rootTab) {
        case 'receive':
          this.setState({ selectedDocs: docIds });
          break;
        case 'feedback':
        case 'viewers':
        case 'commander':
          this.setState({ selectedDocs: docIds });
          break;
      }
    }
  };

  handleShowTemplates = () => {
    this.setState({ showTemplates: true });
  };

  mapFunctionCalendar = item => {
    const customMaping = arr => {
      if (Array.isArray(arr) && arr.length <= 1) {
        return arr;
      } else if (Array.isArray(arr) && arr.length > 1) {
        return _.join(arr, ',');
      } else {
        return arr;
      }
    };
    return {
      ...item,
      typeCalendar: item.typeCalendar === '1' ? 'Lịch cá nhân' : 'Lịch đơn vị',
      organizer: item['organizer.name'],
      task: item['task.name'],
      roomMetting: item['roomMetting.name'],
      approved: item['approved.name'],
      'completedBy.name': customMaping(item['completeName']),
      'publishBy.name': customMaping(item['publishName']),
      createdBy: item.createdByName ? item.createdByName : null,
      timeStart: moment(item.timeStart).format('DD/MM/YYYY'),
      timeEnd: moment(item.timeEnd).format('DD/MM/YYYY'),
    };
  };

  mapFunction = item => {
    const customMaping = arr => {
      if (Array.isArray(arr) && arr.length <= 1) {
        return arr;
      } else if (Array.isArray(arr) && arr.length > 1) {
        return _.join(arr, ',');
      } else {
        return arr;
      }
    };
    return {
      ...item,
      typeCalendar: item.typeCalendar === '1' ? 'Lịch cá nhân' : 'lịch đơn vị',
      organizer: item['organizer.name'],
      task: item['task.name'],
      roomMetting: item['roomMetting.name'],
      approved: item['approved.name'],
      'completedBy.name': customMaping(item['completeName']),
      'publishBy.name': customMaping(item['publishName']),
      timeStart: moment(item.timeStart).format('DD/MM/YYYY'),
      timeEnd: moment(item.timeEnd).format('DD/MM/YYYY'),
      'createdBy.name': item.createdBy ? item.createdBy.name : null,
      timeStart: moment(item.timeStart).format('DD/MM/YYYY'),
      timeEnd: moment(item.timeEnd).format('DD/MM/YYYY'),
    };
  };

  handleChangeTask = id => {
    this.setState({ openDrawer: true, id });
  };

  openTitleDialog = (id, params) => {
    this.props.history.push(`Calendar/working-schedule-detail/${id}`, params);
  };

  reloadState = () => {
    fetch(`${API_MEETING}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ data });
      });
    this.setState({ reload: new Date() * 1 });
  };

  handleCloseCalendar = e => {
    this.setState({ openDialog: null });
  };

  callBack = (cmd, data) => {
    const { id } = this.props.match.params;
    switch (cmd) {
      case 'update':
        this.props.onUpdateBo(dot.object(data));
        if (id) {
          this.props.history.push(`/alendar/working-schedule-detail/${id}`);
        }
      default:
        break;
    }
  };

  checkPermission = data => {
    let originItem = {};
    if (data && data[0] && data[0] !== undefined) originItem = data[0];
    const processeds = originItem !== undefined && originItem.processeds ? originItem.processeds : [];
    if (processeds && processeds.length > 0) this.setState({ goBack: true });
    else this.setState({ goBack: false });
  };

  changeDatePlan(type) {
    let newDate = this.state.datePlan;
    if (type === true) {
      this.setState({ datePlan: newDate.subtract(1, 'days'), dataPlan: [] });
      this.getDataTabPlan(this.state.tabCalendar);
    } else {
      this.setState({ datePlan: newDate.add(1, 'days'), dataPlan: [] });
      this.getDataTabPlan(this.state.tabCalendar);
    }
  }

  changeWeekPlan(type) {
    let newDate = this.state.datePlan;
    if (type === true) {
      this.setState({ datePlan: newDate.subtract(1, 'weeks'), dataPlan: [] });
      this.getDataTabPlan(this.state.tabCalendar);
    } else {
      this.setState({ datePlan: newDate.add(1, 'weeks'), dataPlan: [] });
      this.getDataTabPlan(this.state.tabCalendar);
    }
  }

  getDetailPlan(publishBy, calendarId) {
    let filter = {
      filter: {
        ['calendarId']: calendarId,
      },
    };
    fetch(`${API_MEETING_UPDATE_CALEN_DETAIL}?${serialize(filter)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        let newData = this.state.dataPlan;
        data.map((item, index) => {
          item.map((element, idx) => {
            newData.push(...this.state.dataPlan, element);
            this.setState({ dataPlan: _.uniq(newData) });
          });
        });
      });
  }

  getDataTabPlan(val) {
    console.log(val, "sss")
    let filter;
    let newDateFilter = _.cloneDeep(this.state.datePlan);
    let firstWeekDay = _.cloneDeep(newDateFilter)
      .startOf('week')
      // .subtract(1, 'days')
      .format('YYYY/MM/DD HH:mm:ss');
    if (val === 2) {
      (filter = {
        filter: {
          ['timeEnd']: {
            $gte: `${newDateFilter.endOf('days').format('YYYY/MM/DD')}`,
          },
          ['timeStart']: {
            $lte: `${this.state.datePlan.endOf('days').format('YYYY/MM/DD')}`,
          },
        },
      }),
        fetch(
          `${API_MEETING_UPDATE_CALEN_DETAIL}/get-by-time?isOrg=true&timeStart=${this.state.datePlan.format(
            'YYYY/MM/DD',
          )}&timeEnd=${this.state.datePlan.format('YYYY/MM/DD')}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )
          .then(res => res.json())
          .then(data => {
            if (data.data) {
              let newData = this.state.dataPlan;
              data.data.map((item, index) => {
                item.calenDetail.map((element, idx) => {
                  newData.push(...this.state.dataPlan, ...element);
                  this.setState({ dataPlan: _.uniq(newData) });
                });
              });
            }
          });
    } else if (val === 1) {
      (filter = {
        filter: {
          ['timeEnd']: {
            $gte: `${moment(firstWeekDay)
              .endOf('days')
              .format('YYYY/MM/DD')}`,
          },
          ['timeStart']: {
            $lte: `${newDateFilter.endOf('week').format('YYYY/MM/DD')}`,
          },
        },
      }),
        fetch(
          `${API_MEETING_UPDATE_CALEN_DETAIL}/get-by-time?isOrg=true&timeStart=${this.state.datePlan
            .startOf('weeks')
            .format('YYYY/MM/DD')}&timeEnd=${this.state.datePlan.endOf('weeks').format('YYYY/MM/DD')}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )
          .then(res => res.json())
          .then(data => {
            if (data.data) {
              let newData = this.state.dataPlan;
              data.data.map((item, index) => {
                item.calenDetail.map((element, idx) => {
                  newData.push(...this.state.dataPlan, ...element);
                  this.setState({ dataPlan: _.uniq(newData) });
                });
              });
            }
          });
    }
  }

  handleChangeTabCalendar(val) {
    this.setState({ tabCalendar: val, datePlan: moment(), dataPlan: [] });
    setTimeout(() => {
      this.getDataTabPlan(val);
    }, 1);
    localStorage.removeItem('datePicker');
    localStorage.removeItem('signer');
    localStorage.removeItem('nameSigner');
  }

  printWorkingPlan() {
    if (this.state.tabCalendar === 1) {
      // workingCalendarTable()
      const { allTemplates } = this.props.dashboardPage;
      if ('Calendar') {
        const templatesItem = allTemplates && allTemplates.find(elm => (elm.moduleCode === 'Calendar' && elm.clientId === clientId));
        if (templatesItem) {
          let data = []
          this.state.dataPlan.map((el) => {
            // console.log(el, "sjdnvjsndv")
            data.push(el)
          })
          workingCalendarTable(templatesItem._id, data, 'Calendar', false, this.state.datePlan);
        } else {
          this.props.onChangeSnackbar && this.props.onChangeSnackbar({ variant: 'warning', message: 'Chưa có biểu mẫu để in lịch!', status: true });
        }
      }
    }
  }
  onClosePrintScreen() {
    this.setState({ printInfo: false, position: '', cap_bac: '' });
    localStorage.removeItem('datePicker');
    localStorage.removeItem('signer');
    localStorage.removeItem('nameSigner');
  }
  handleShowTV(){

    let contentEle = document.getElementById('tableWeekCalender');
    if (contentEle) {
      let displayItem = document.getElementById('display-calendar');
      if (displayItem) {
      
        // contentEle.removeClass("tableremove-tableremove")
        // let element = document.getElementsByClassName("tableremove-tableremove")
        
        // for (let i = 0; i < element.length; i++) {
        //   element[i].remove()
          
        // }
        
        displayItem.innerHTML = contentEle.outerHTML;
        document.getElementById('app').style.display = 'none';
        displayItem.style.display = 'block';

        let i = 0;
        let tableHeight = document.getElementById('display-calendar').getBoundingClientRect().height;
        console.log(window.innerHeight, "dnjfvndfv")
        setInterval(() => {
          let newY = (i * 2);
          console.log('newY', newY);
          // console.log('tableHeight', window.innerHeight);
          // if (newY > window.innerHeight) {
            if((window.innerHeight + window.scrollY) > tableHeight){
            newY = 0;
            i = 1;
          } else {
            i ++;
          }
          window.scroll(window.innerWidth, newY);
        }, 100);

      }
    }
  }
  render() {
    const {
      tabIndex,
      openDialog,
      openAsignProcessor,
      templates,
      selectedTemplate,
      selectedDocs,
      nextRole,
      currentRole,
      openComplete,
      openPublish,
      openDestroy,
      openDeletePublish,
      allRoles,
      reload,
      children,
      typeRole,
      businessRole,
      tab,
      countWorking,
      templatesData,
    } = this.state;
    const { workingSchedule, intl, miniActive, onChangeSnackbar, profile, dashboardPage } = this.props;

    localStorage.setItem('workingScheduletab', JSON.stringify({ tab: this.state.tabIndex, tabChild: tab }));

    const dataProcessors = allRoles && allRoles.find(elm => elm.name === 'processors');
    const dataCompalte = allRoles && allRoles.find(elm => elm.name === 'compalte');
    const dataPublish = allRoles && allRoles.find(elm => elm.name === 'publish');
    const dataProcessorsFm = dataProcessors && dataProcessors.data;
    const dataCompalteFm = dataCompalte && dataCompalte.data;
    const dataPublishFm = dataPublish && dataPublish.data;
    const Bt = props => (
      <CustomButton
        onClick={() => {
          this.setState({ tab: props.tab });
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
    const cutTimeMeet = time => {
      if (time.indexOf('_') === -1) return time;
      else return time.slice(0, 5);
    };

    const getTypeCalendar = (id) => {
      const dataSource = JSON.parse(localStorage.getItem('crmSource'));
      const dataValSource = dataSource && dataSource.find(item => item.code === 'S600');
      const typeCalendar = (dataValSource && dataValSource.data.find(i => i._id === id));
      return typeCalendar ? `(${typeCalendar.title})` : ''
    }

    const renderSang = (index, hidden) => {
      const data = [];
      {
        this.state.dataPlan.map((element, idx) => {
          if (
            this.state.datePlan
              .startOf('week')
              .add(index, 'days')
              .isSame(moment(element.time).format('YYYY/MM/DD')) &&
            (element.timeMeet && parseInt(element.timeMeet.slice(0, 3)) < 12)
          ) {
            data.push(
              <TableRow>
                <TableCell
                  style={{
                    textAlign: 'left',
                    // border: '1px solid rgba(224, 224, 224, 1)',
                    borderRight: 'none',
                    width: '100vh',
                    paddingLeft:50,
                    visibility: `${!hidden ? "visible" : "hidden"}`
                  }}
                  colSpan={5}
                >
                  {`${getTypeCalendar(element.typeCalendar)} ${cutTimeMeet(element.timeMeet)}:
                  ${element.contentMeet ? `${element.contentMeet}` : ''}${element.join ? `. Thành phần: ${element.join}` : ''}${element.addressMeet ? `. Địa điểm: ${element.addressMeet}${element.preparedBy ? `. (${element.preparedBy})` : ''}` : `${element.preparedBy ? `.(${element.preparedBy})` : ''}`}`}
                </TableCell>
              </TableRow>,
            );
          }
        });
      }
      return data.length > 0
        ? data
        : !this.state.showTV ?  [
          <TableRow>
            <TableCell
              style={{
                textAlign: 'left',
                // border: '1px solid rgba(224, 224, 224, 1)',

                borderRight: 'none',
                width: '100vh',
                visibility: "hidden"
              }}
              colSpan={5}
            >
              {''}
            </TableCell>
          </TableRow>,
        ] : [];
    };

    const renderChieu = (index, hidden) => {
      const data = [];
      {
        this.state.dataPlan.map((element, idx) => {
          if (
            this.state.datePlan
              .startOf('week')
              .add(index, 'days')
              .isSame(moment(element.time).format('YYYY/MM/DD')) &&
            (element.timeMeet && parseInt(element.timeMeet.slice(0, 3)) >= 12)
          ) {
            data.push(
              <TableRow>
                <TableCell
                  style={{
                    textAlign: 'left',
                    // border: '1px solid rgba(224, 224, 224, 1)',
                    borderRight: 'none',
                    width: '100vh',
                    visibility: `${!hidden ? "visible" : "hidden"}`,
                    paddingLeft:50,
                  }}
                  colSpan={5}
                >
                  {/* {`${getTypeCalendar(element.typeCalendar)} ${cutTimeMeet(element.timeMeet)} : 
                  ${element.contentMeet ? `${element.contentMeet}` : ' '} ${element.join ? ` - Thành phần: ${element.join}` : ' '}
                  ${element.addressMeet ? ` - Địa điểm: ${element.addressMeet} ${element.preparedBy ? `(Đơn vị chuẩn bị, ghi chú: ${element.preparedBy})` : ' '}` : `${element.preparedBy ? `(Đơn vị chuẩn bị, ghi chú: ${element.preparedBy})` : ' '}`}`} */}
                  {`${getTypeCalendar(element.typeCalendar)} ${cutTimeMeet(element.timeMeet)}: 
                  ${element.contentMeet ? `${element.contentMeet}` : ''}${element.join ? `. Thành phần: ${element.join}` : ''}${element.addressMeet ? `. Địa điểm: ${element.addressMeet}${element.preparedBy ? `. (${element.preparedBy})` : ''}` : `${element.preparedBy ? `.(${element.preparedBy})` : ''}`}`}
                </TableCell>
              </TableRow>,
            );
          }
        });
      }
      return data.length > 0
        ? data
        : !this.state.showTV ? [
          <TableRow>
            <TableCell
              style={{
                textAlign: 'left',
                // border: '1px solid rgba(224, 224, 224, 1)',
                borderRight: 'none',
                borderTop: 'none',
                width: '100vh',
              }}
              colSpan={5}
            >
              {''}
            </TableCell>
          </TableRow>,
        ] : [];
    };
    return (
      <div>

        <Helmet>
          <title>Lịch cá nhân</title>
          <meta name="description" content="Description of MeetingPage" />
        </Helmet>
        <GridLife container justifyContent="space-between">
          <GridLife item sm={9}>
            <Tabs
              value={tabIndex}
              onChange={(e, tabIndex) => {
                if (!this.tabState) this.tabState = {};
                this.tabState[this.state.tabIndex] = this.state.tab;
                this.setState({ tabIndex, tab: this.tabState[tabIndex] || 0 });
                if (tabIndex === 5) {
                  this.setState({ datePlan: moment(), dataPlan: [] }, () => {
                    this.getDataTabPlan(this.state.tabCalendar);
                  });
                }
              }}
              aria-label="simple tabs example"
            >
              {dataProcessorsFm && dataProcessorsFm.view && dataProcessorsFm.view === true ? (
                <Tab
                  value={0}
                  label={
                    <Badge color="primary" badgeContent={(countWorking && countWorking.countComplete) || 0} max={9999}>
                      <Typography style={{ fontWeight: 600, fontSize: 12 }}>Soạn lịch</Typography>
                    </Badge>
                  }
                />
              ) : null}
              {/* {dataCompalteFm && dataCompalteFm.compalte ? (
                <Tab
                  value={1}
                  label={
                    <Badge color="primary" badgeContent={countWorking && countWorking.countProcessors || 0} max={9999}>
                      <Typography style={{ fontWeight: 600, fontSize: 12 }}>Phê duyệt lịch</Typography>
                    </Badge>
                  }
                />
              ) : null} */}
              {dataPublishFm && dataPublishFm.view && dataPublishFm.view === true ? (
                <Tab
                  value={2}
                  label={
                    <Badge color="primary" badgeContent={(countWorking && countWorking.countPublish) || 0} max={9999}>
                      <Typography style={{ fontWeight: 600, fontSize: 12 }}>Xuất bản lịch</Typography>
                    </Badge>
                  }
                />
              ) : null}
              {/* <Tab value={3} style={{ fontWeight: 600, fontSize: 12 }} label={'Trạng thái'} />
              <Tab value={4} style={{ fontWeight: 600, fontSize: 12 }} label={'Bảng tự động hóa'} /> */}
              <Tab value={5} style={{ fontWeight: 600, fontSize: 12 }} label={'Lịch'} />
            </Tabs>
          </GridLife>

          <GridLife item sm={3}>
            {this.state.tabIndex !== 2 &&
              this.state.canView &&
              businessRole &&
              businessRole.approval &&
              businessRole.approval === true &&
              Array.isArray(templates) &&
              templates.length > 0 && (
                <>
                  {this.state.canView && this.state.tabIndex === 0 ? (
                    <Fab
                      variant="extended"
                      color="primary"
                      size="small"
                      aria-label="add"
                      style={{
                        marginTop: 10,
                        float: 'right',
                        marginRight: 5,
                        height: 30,
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{ fontSize: '0.8125rem' }}
                        onClick={e => {
                          if (currentRole) {
                            this.setState({
                              openAsignProcessor: true,
                            });
                            return;
                          }
                          this.handleOpen(e);
                        }}
                      >
                        Trình duyệt
                      </span>
                    </Fab>
                  ) : children &&
                    children[0] &&
                    children[0][0] &&
                    children[0][0].children &&
                    children[0][0].children &&
                    children[0][0].children.length > 0 &&
                    this.state.canView &&
                    this.state.tabIndex === 1 ? (
                    <Fab
                      variant="extended"
                      color="primary"
                      size="small"
                      aria-label="add"
                      style={{
                        marginTop: 10,
                        float: 'right',
                        marginRight: 5,
                        height: 30,
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{ fontSize: '0.8125rem' }}
                        onClick={e => {
                          if (currentRole) {
                            this.setState({
                              openAsignProcessor: true,
                            });
                            return;
                          }
                          this.handleOpen(e);
                        }}
                      >
                        Trình duyệt
                      </span>
                    </Fab>
                  ) : null}
                </>
              )}

            {!this.state.newTab &&
              (this.state.canView && businessRole && businessRole.publish && businessRole.publish === true) && (
                <Fab
                  variant="extended"
                  color="primary"
                  size="small"
                  aria-label="add"
                  style={{
                    marginTop: 10,
                    float: 'right',
                    marginRight: 5,
                    height: 30,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{ fontSize: '0.8125rem' }}
                    onClick={e => {
                      this.setState({
                        openPublish: true,
                      });
                    }}
                  >
                    Xuất bản
                  </span>
                </Fab>
              )}

            <Menu open={Boolean(openDialog)} anchorEl={openDialog} onClose={this.handleCloseCalendar}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                {/* <MenuItem
                   style={{ flex: 'auto' }}
                   value="any"
                   onClick={e => {
                     this.setState({
                       openAsignProcessor: true
                     })
                   }}
                 >
                   Chuyển bất kỳ
                 </MenuItem> */}
              </div>
              {_.has(children, '[0][0]') ? (
                <>
                  {Array.isArray(children) &&
                    children[0][0] &&
                    children.map(t => (
                      <>
                        {Array.isArray(children) &&
                          t[0] &&
                          t[0].children &&
                          Array.isArray(t[0].children) &&
                          t[0].children.map(i => (
                            <>
                              <MenuItem
                                value={i.code}
                                onClick={() => {
                                  this.setState({
                                    selectedTemplate: i,
                                    openAsignProcessor: true,
                                    nextRole: i.code,
                                    typeRole: i.type,
                                    unit: i.unit,
                                    processType: 'flow',
                                  });
                                }}
                              >
                                <span style={{ paddingLeft: 60 }}>
                                  Chuyển cho
                                  {i.name}
                                </span>
                              </MenuItem>
                            </>
                          ))}
                        {/* {
                             Array.isArray(children) &&
                             Array.isArray(t.children) &&
                             t.children[0] && (
                               <MenuItem
                                 value={t.children[0].code}
                                 onClick={() => {
                                   this.setState({
                                     selectedTemplate: t,
                                     openAsignProcessor: true
                                   })
                                 }}
                               >
                                 <span style={{ paddingLeft: 60 }}>Chuyển cho {t.children[0].name}</span>
                               </MenuItem>
                             )} */}

                        {/* <MenuItem
                               value={t.code}
                               onClick={() => {
                                 this.setState({
                                   selectedTemplate: t,
                                   openAsignProcessor: true,
                                   nextRole: t.code
                                 })
                               }}
                             >
                               <span style={{ paddingLeft: 30 }}>{t.name}</span>
                             </MenuItem> */}
                      </>
                    ))}
                </>
              ) : (
                <div style={{ alignItems: 'center', padding: '0 10px' }}>
                  {templates &&
                    Array.isArray(templates) &&
                    templates.map(t => (
                      <>
                        <>
                          <MenuItem
                            value={t.code}
                            onClick={() => {
                              this.setState({
                                selectedTemplate: t,
                                openAsignProcessor: true,
                                typeRole: t.type,
                                unit: t.unit,
                                processType: 'flow',
                              });
                            }}
                          >
                            <span>Chuyển cho {t.name}</span>
                          </MenuItem>
                        </>
                      </>
                    ))}
                </div>
              )}
            </Menu>

            {this.state.canView &&
              (this.state.tabIndex !== 2 && (this.state.tabIndex === 0 || this.state.tab === 1)) &&
              businessRole &&
              businessRole.compalte &&
              businessRole.compalte === true && (
                <>
                  <Fab
                    variant="extended"
                    color="primary"
                    size="small"
                    aria-label="add"
                    style={{
                      marginTop: 10,
                      float: 'right',
                      marginRight: 5,
                      height: 30,
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{ fontSize: '0.8125rem' }}
                      onClick={e => {
                        this.setState({
                          openComplete: true,
                        });
                      }}
                    >
                      Phê duyệt
                    </span>
                  </Fab>
                </>
              )}

            {this.state.canView &&
              (this.state.tabIndex === 2 || (this.state.tabIndex === 1 && this.state.tab !== 0)) &&
              (!this.state.newTab ? (
                <div style={{ float: 'right' }}>
                  {this.state.canView &&
                    businessRole &&
                    businessRole.unCompalte &&
                    businessRole.unCompalte === true && (
                      <Fab
                        variant="extended"
                        color="primary"
                        size="small"
                        aria-label="add"
                        style={{
                          marginTop: 10,
                          float: 'right',
                          marginRight: 5,
                          height: 30,
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{ fontSize: '0.8125rem' }}
                          onClick={e => {
                            this.setState({
                              openDestroy: true,
                            });
                          }}
                        >
                          Hủy phê duyệt
                        </span>
                      </Fab>
                    )}
                </div>
              ) : (
                <>
                  {this.state.canView &&
                    businessRole &&
                    businessRole.unPublish &&
                    businessRole.unPublish === true && (
                      <Fab
                        variant="extended"
                        color="primary"
                        size="small"
                        aria-label="add"
                        style={{
                          marginTop: 10,
                          float: 'right',
                          marginRight: 5,
                          height: 30,
                          marginBottom: 2,
                        }}
                      >
                        <span style={{ fontSize: '0.8125rem' }} onClick={e => this.setState({ openDeletePublish: true })}>
                          Huỷ xuất bản
                        </span>
                      </Fab>
                    )}
                </>
              ))}

            {this.state.goBack === false ? null : (
              <>
                {!(
                  this.state.canView &&
                  ((this.state.tabIndex === 0 && this.state.tab === 0 && !this.state.newTab) ||
                    (this.state.tabIndex === 1 && this.state.tab === 0 && !this.state.newTab))
                ) ? null : (
                  <Fab
                    variant="extended"
                    color="primary"
                    size="small"
                    aria-label="add"
                    style={{
                      marginTop: 10,
                      float: 'right',
                      marginRight: 5,
                      height: 30,
                      marginbottom: 2,
                    }}
                  >
                    <span style={{ fontSize: '0.8125rem' }} onClick={() => this.setState({ returnDoc: true })}>
                      Trả lại {_.get(_.get(this, 'state.selectedDocsData[0].originItem.processeds', []).pop(), 'name', '')}
                    </span>
                  </Fab>
                )}
              </>
            )}
          </GridLife>
        </GridLife>
        
        <div>
          {tabIndex === 0 ? (
            <Paper style={{ zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px', height: '100%', width: '100%' }}>
              <GridLife container style={{ justifyContent: 'flex-end' }}>
                <GridLife item md={12}>
                  {/* <Bt tab={3}>{intl.formatMessage(messages.timemanagement || { id: 'Automations' })}</Bt>
                   <Bt tab={2}> {intl.formatMessage(messages.grattchar || { id: 'Trạng thái' })}</Bt> */}
                  {_.get(dataProcessors, 'data.compalte') && <Bt tab={1}> {intl && intl.formatMessage(messages.plan || { id: 'Đã phê duyệt' })}</Bt>}
                  <Bt tab={2}> {intl && intl.formatMessage({ id: 'Đã trình duyệt' })}</Bt>
                  <Bt tab={0}> {intl && intl.formatMessage({ id: 'Lịch nháp' })}</Bt>
                  {/* <Bt tab={6}> {intl.formatMessage(messages.list || { id: 'Đang thực hiện' })}</Bt> */}
                </GridLife>
                {tab === 1 ? (
                  <ListPage
                    disable3Action
                    // getStateSelection={e => this.getStateSelection(e)}
                    disableImport
                    disableAdd
                    // showDepartmentAndEmployeeFilter
                    kanban="ST16"
                    reload={workingSchedule.reload}
                    exportExcel
                    isPlanChild
                    queryParams={{
                      stage: 'completed',
                    }}
                    customPageSize={10}
                    filter={{
                      stage: 'completed',
                      typeCalendar: '2',
                    }}
                    code="Calendar"
                    apiUrl={`${API_MEETING}/processors`}
                    mapFunction={this.mapFunctionCalendar}
                    columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
                    onSelectCustomers={val => {
                      this.handleRefactor(val);
                    }}
                    onRowClick={item => {
                      this.openTitleDialog(item._id, {
                        allowGiveback: true,
                        showUnApprove: true,
                        queryCalen: {
                          filter: {
                            calendarId: item._id,
                            completedBy: profile._id,
                          },
                        },
                      });
                      // this.props.history.push(`Calendar/${item._id}`, {
                      //   allowGiveback: true,
                      //   showUnApprove: true,
                      //   queryCalen: {
                      //     filter: {
                      //       calendarId: item._id,
                      //       completedBy: profile._id,
                      //     },
                      //   },
                      // });
                    }}
                    pointerCursor="pointer"
                    onEdit={row => {
                      this.props.history.push(`Calendar/${row._id}`, {
                        showUnApprove: true,
                        queryCalen: {
                          filter: {
                            calendarId: row._id,
                            completedBy: profile._id,
                          },
                        },
                      });
                    }}
                    disableSelect
                    disableOneEdit
                  />
                ) : null}
                {tab === 2 ? (
                  <ListPage
                    disable3Action
                    // showDepartmentAndEmployeeFilter
                    kanban="ST16"
                    reload={reload}
                    exportExcel
                    customPageSize={10}
                    // filter={{
                    //   typeCalendar: '2',
                    //   processeds: profile._id,
                    //   stage: { $in: ['processing'] },
                    // }}
                    isPlanChild
                    queryParams={{
                      stage: 'processed',
                    }}
                    filter={{
                      stage: 'processed',
                      typeCalendar: '2',
                    }}
                    // columns={calendarColumns}
                    code="Calendar"
                    apiUrl={`${API_MEETING}/processors`}
                    mapFunction={this.mapFunctionCalendar}
                    disableOneEdit
                    onRowClick={item => {
                      this.openTitleDialog(item._id);
                    }}
                    pointerCursor="pointer"
                  />
                ) : null}
                {/* {tab === 3 ? (
                   <ListPage
                     disable3Action
                     // showDepartmentAndEmployeeFilter
                     kanban="ST16"
                     reload={reload}
                     exportExcel
                     filter={{ typeCalendar: '2' }}
                     // columns={calendarColumns}
                     code="Calendar"
                     apiUrl={API_MEETING}
                     mapFunction={this.mapFunctionCalendar}
                     columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
                   />
                 ) : null} */}

                {/* soạn lịch - lịch nháp */}
                {tab === 0 ? (
                  <React.Fragment>
                    <ListPage
                      disable3Action
                      onSelectCustomers={val => {
                        this.handleRefactor(val, 'receive');
                        this.checkPermission(val);
                        this.setState({ processors: val[0] && val[0] && val[0].processors });
                      }}
                      getStateSelection={e => this.getStateSelection(e)}
                      // showDepartmentAndEmployeeFilter
                      kanban="ST16"
                      customPageSize={10}
                      isPlanChild
                      reload={reload}
                      exportExcel
                      selectMultiple={false}
                      queryParams={{
                        stage: 'complete',
                      }}
                      disableDot
                      filter={{
                        stage: 'complete',
                        typeCalendar: '2',
                      }}
                      // queryParams={{
                      //   stage: 'processing',
                      // }}
                      // filter={{
                      //   typeCalendar: '2',
                      //   // stage: 'processing',
                      //   // processors: profile._id,
                      // }}
                      // columns={calendarColumns}
                      code="Calendar"
                      apiUrl={`${API_MEETING}/processors`}
                      mapFunction={this.mapFunction}
                      columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
                      onRowClick={item => {
                        this.openTitleDialog(item._id, {
                          queryCalen: {
                            filter: {
                              stage: 'processing',
                              // processors: profile._id,
                              calendarId: item._id,
                            },
                          },
                        });
                      }}
                      pointerCursor="pointer"
                      onEdit={row => {
                        this.props.history.push(`Calendar/${row._id}`, {
                          allowGiveback: true,
                          queryCalen: {
                            filter: {
                              stage: 'processing',
                              // processors: profile._id,
                              calendarId: row._id,
                            },
                          },
                        });
                      }}
                    />
                  </React.Fragment>
                ) : null}
              </GridLife>
              {/* <ListPage
                 disable3Action
                 // showDepartmentAndEmployeeFilter
                 kanban="ST16"
                 reload={workingSchedule.reload}
                 exportExcel
                 filter={{ typeCalendar: '2' }}
                 // columns={calendarColumns}
                 code="Calendar"
                 apiUrl={API_MEETING}
                 mapFunction={this.mapFunctionCalendar}
                 columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
               /> */}
            </Paper>
          ) : null}
          {tabIndex === 1 ? (
            <Paper style={{ zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px', height: '100%', width: '100%' }}>
              <GridLife container style={{ justifyContent: 'flex-end' }}>
                <GridLife item md={12}>
                  {/* <Bt tab={3}>{intl.formatMessage(messages.timemanagement || { id: 'Automations' })}</Bt>
                   <Bt tab={2}> {intl.formatMessage(messages.grattchar || { id: 'Trạng thái' })}</Bt> */}

                  <Bt tab={1}> {intl.formatMessage(messages.plan || { id: 'Đã phê duyệt' })}</Bt>
                  {dataProcessorsFm && dataProcessorsFm.approval && <Bt tab={2}> {intl.formatMessage({ id: 'Đã trình duyệt' })}</Bt>}
                  <Bt tab={0}> {intl.formatMessage({ id: 'Chờ phê duyệt' })}</Bt>
                  {/* <Bt tab={6}> {intl.formatMessage(messages.list || { id: 'Đang thực hiện' })}</Bt> */}
                </GridLife>
                {tab === 1 ? (
                  <ListPage
                    disable3Action
                    disableImport
                    disableAdd
                    // showDepartmentAndEmployeeFilter
                    kanban="ST16"
                    reload={reload}
                    exportExcel
                    queryParams={{
                      stage: 'completed',
                    }}
                    filter={{
                      stage: 'completed',
                      typeCalendar: '2',
                    }}
                    customPageSize={10}
                    // columns={calendarColumns}
                    code="Calendar"
                    apiUrl={`${API_MEETING}/processors`}
                    mapFunction={this.mapFunctionCalendar}
                    columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
                    onRowClick={item => {
                      this.props.history.push(`Calendar/${item._id}`, {
                        readOnly: true,
                        showUnApprove: true,
                        queryCalen: {
                          filter: {
                            completedBy: profile._id,
                            calendarId: item._id,
                          },
                        },
                      });
                    }}
                    pointerCursor="pointer"
                    onEdit={row => {
                      this.props.history.push(`Calendar/${row._id}`, {
                        showUnApprove: true,
                        queryCalen: {
                          filter: {
                            completedBy: profile._id,
                            calendarId: row._id,
                          },
                        },
                      });
                    }}
                    // disableSelect
                    disableDelete
                    getStateSelection={e => this.getStateSelection(e)}
                    onSelectCustomers={val => {
                      this.handleRefactor(val);
                    }}
                    disableOneEdit
                  />
                ) : null}
                {tab === 2 ? (
                  <ListPage
                    disable3Action
                    // showDepartmentAndEmployeeFilter
                    kanban="ST16"
                    reload={reload}
                    exportExcel
                    customPageSize={10}
                    queryParams={{
                      stage: 'complete',
                    }}
                    filter={{
                      stage: 'complete',
                      typeCalendar: '2',
                    }}
                    // filter={{
                    //   typeCalendar: '2',
                    //   processeds: profile._id,
                    //   stage: { $ne: 'completed' },
                    // }}
                    // columns={calendarColumns}
                    code="Calendar"
                    apiUrl={`${API_MEETING}/processors`}
                    mapFunction={this.mapFunctionCalendar}
                    disableSelect
                    disableOneEdit
                    onRowClick={item => {
                      this.openTitleDialog(item._id, {
                        readOnly: true,
                        showUnApprove: true,
                        queryCalen: {
                          filter: {
                            completedBy: profile._id,
                            calendarId: item._id,
                          },
                        },
                      });
                    }}
                    onEdit={row => {
                      this.props.history.push(`Calendar/${row._id}`, {
                        readOnly: true,
                        showUnApprove: true,
                        queryCalen: {
                          filter: {
                            completedBy: profile._id,
                            calendarId: row._id,
                          },
                        },
                      });
                    }}
                  />
                ) : null}
                {/* {tab === 3 ? (
                   <ListPage
                     disable3Action
                     // showDepartmentAndEmployeeFilter
                     kanban="ST16"
                     reload={reload}
                     exportExcel
                     filter={{ typeCalendar: '2' }}
                     // columns={calendarColumns}
                     code="Calendar"
                     apiUrl={API_MEETING}
                     mapFunction={this.mapFunctionCalendar}
                     columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
                   />
                 ) : null} */}
                {tab === 0 ? (
                  <React.Fragment>
                    <ListPage
                      disable3Action
                      disableImport
                      disableAdd
                      getStateSelection={e => this.getStateSelection(e)}
                      // showDepartmentAndEmployeeFilter
                      kanban="ST16"
                      reload={reload}
                      exportExcel
                      queryParams={{
                        stage: 'complete',
                      }}
                      customPageSize={10}
                      filter={{
                        stage: 'complete',
                        typeCalendar: '2',
                      }}
                      // columns={calendarColumns}
                      code="Calendar"
                      apiUrl={`${API_MEETING}/processors`}
                      mapFunction={this.mapFunctionCalendar}
                      columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
                      onSelectCustomers={val => {
                        this.handleRefactor(val);
                      }}
                      onRowClick={item => {
                        this.openTitleDialog(item._id, {
                          queryCalen: {
                            filter: {
                              completedBy: profile._id,
                              calendarId: item._id,
                            },
                          },
                        });
                      }}
                      pointerCursor="pointer"
                      onEdit={row => {
                        this.props.history.push(`Calendar/${row._id}`, {
                          queryCalen: {
                            filter: {
                              completedBy: profile._id,
                              calendarId: row._id,
                            },
                          },
                        });
                      }}
                      disableDelete
                    />
                  </React.Fragment>
                ) : null}
              </GridLife>
            </Paper>
          ) : null}
          {tabIndex === 2 ? (
            <Paper>
              <GridLife container style={{ justifyContent: 'flex-end' }}>
                <GridLife item md={12}>
                  {/* <Bt tab={3}>{intl.formatMessage(messages.timemanagement || { id: 'Automations' })}</Bt>
                   <Bt tab={2}> {intl.formatMessage(messages.grattchar || { id: 'Trạng thái' })}</Bt> */}
                  <Bt tab={1}> {intl.formatMessage(messages.plan || { id: 'Đã xuất bản' })}</Bt>
                  <Bt tab={0}> {intl.formatMessage({ id: 'Chờ xuất bản' })}</Bt>
                  {/* <Bt tab={6}> {intl.formatMessage(messages.list || { id: 'Đang thực hiện' })}</Bt> */}
                </GridLife>
                {tab === 1 ? (
                  <ListPage
                    disable3Action
                    disableImport
                    disableAdd
                    customPageSize={10}
                    getStateSelection={e => this.getStateSelection(e, 'xb')}
                    // showDepartmentAndEmployeeFilter
                    kanban="ST16"
                    reload={reload}
                    exportExcel
                    queryParams={{
                      stage: 'published',
                    }}
                    filter={{
                      stage: 'published',
                      typeCalendar: '2',
                      // publishStatus: 'publish',
                      // stage: 'publish'
                      // publishBy: profile._id
                    }}
                    // columns={calendarColumns}
                    code="Calendar"
                    apiUrl={`${API_MEETING}/processors`}
                    mapFunction={this.mapFunctionCalendar}
                    columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
                    onSelectCustomers={val => {
                      this.handleRefactor(val);
                    }}
                    onRowClick={item => {
                      this.openTitleDialog(item._id, {
                        queryCalen: {
                          filter: {
                            stage: 'publish',
                            // processors: profile._id,
                            publishBy: profile._id,
                            calendarId: item._id,
                          },
                        },
                      });
                    }}
                    pointerCursor="pointer"
                    onEdit={row => {
                      this.props.history.push(`Calendar/${row._id}`, {
                        queryCalen: {
                          // stage: 'published',
                          filter: {
                            // processors: profile._id,
                            stage: 'publish',
                            publishBy: profile._id,
                            calendarId: row._id,
                          },
                        },
                      });
                    }}
                    disableDelete
                    disableOneEdit
                  />
                ) : null}
                {/* {tab === 2 ? (
                   <ListPage
                     disable3Action
                     // showDepartmentAndEmployeeFilter
                     kanban="ST16"
                     reload={reload}
                     exportExcel
                     filter={{ typeCalendar: '2' }}
                     // columns={calendarColumns}
                     code="Calendar"
                     apiUrl={API_MEETING}
                     mapFunction={this.mapFunctionCalendar}
                     columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
                   />
                 ) : null} */}
                {/* {tab === 3 ? (
                   <ListPage
                     disable3Action
                     // showDepartmentAndEmployeeFilter
                     kanban="ST16"
                     reload={reload}
                     exportExcel
                     filter={{ typeCalendar: '2' }}
                     // columns={calendarColumns}
                     code="Calendar"
                     apiUrl={API_MEETING}
                     mapFunction={this.mapFunctionCalendar}
                     columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
                   />
                 ) : null} */}
                {tab === 0 ? (
                  <React.Fragment>
                    <ListPage
                      disable3Action
                      disableImport
                      customPageSize={10}
                      disableAdd
                      getStateSelection={e => this.getStateSelection(e)}
                      // showDepartmentAndEmployeeFilter
                      kanban="ST16"
                      reload={reload}
                      exportExcel
                      filter={{
                        typeCalendar: '2',
                        stage: 'publish',
                        // stage: 'complete',
                      }}
                      // columns={calendarColumns}
                      code="Calendar"
                      queryParams={{
                        stage: 'publish',
                      }}
                      apiUrl={`${API_MEETING}/processors`}
                      mapFunction={this.mapFunctionCalendar}
                      columnExtensions={[{ columnName: 'editcustom', width: 180 }, { columnName: 'edit', width: 150 }]}
                      onSelectCustomers={val => {
                        this.handleRefactor(val);
                      }}
                      onRowClick={row => {
                        this.openTitleDialog(row._id, {
                          queryCalen: {
                            filter: {
                              stage: 'complete',
                              calendarId: row._id,
                            },
                          },
                        });
                        // this.props.history.push(`Calendar/${row._id}`, {
                        //   queryCalen: {
                        //     filter: {
                        //       stage: 'complete',
                        //       calendarId: row._id,
                        //     },
                        //   },
                        // });
                      }}
                      pointerCursor="pointer"
                      onEdit={row => {
                        this.props.history.push(`Calendar/${row._id}`, {
                          queryCalen: {
                            filter: {
                              stage: 'complete',
                              calendarId: row._id,
                            },
                          },
                        });
                      }}
                      disableDelete
                      disableOneEdit
                    />
                  </React.Fragment>
                ) : null}
              </GridLife>
            </Paper>
          ) : null}
        </div>
        {tabIndex === 5 ? (
          <div
            style={{
              width: '100%',
              flexDirection: 'row',
              //justifyContent:"flex-end",
              alignItems: 'flex-end',
            }}
          >
            <GridLife
              item
              md={12}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                height: '10px',
                marginBottom: '30px',
              }}
            >
              {/* <Tabs value={this.state.tabCalendar} onChange={(e, val) => this.handleChangeTabCalendar(val)}>
                <Tab value={0} label="Lịch tháng" />
                <Tab value={1} label="Lịch tuần" />
                <Tab value={2} label="Lịch ngày" />
              </Tabs> */}
              <Buttons
                style={{ borderRadius: '30px' }}
                onClick={() => this.handleChangeTabCalendar(0)}
                color={this.state.tabCalendar === 0 ? 'gradient' : 'simple'}
              >
                Lịch tháng
              </Buttons>
              <Buttons
                style={{ borderRadius: '30px' }}
                onClick={() => this.handleChangeTabCalendar(1)}
                color={this.state.tabCalendar === 1 ? 'gradient' : 'simple'}
              >
                Lịch tuần
              </Buttons>
              <Buttons
                style={{ borderRadius: '30px' }}
                onClick={() => this.handleChangeTabCalendar(2)}
                color={this.state.tabCalendar === 2 ? 'gradient' : 'simple'}
              >
                Lịch ngày
              </Buttons>
            </GridLife>
            {this.state.tabCalendar === 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {/* <div className="control-panel calendar-export" style={{ textAlign: 'right' }}>
                <DropDownButtonComponent id="exporting" content="Tải xuống" items={this.state.exportItems} select={this.onExportClick.bind(this)} />
              </div> */}
                <div className="control-panel calendar-export" style={{ textAlign: 'right' }}>
                  {/* <ButtonComponent id="printBtn" cssClass="title-bar-btn" iconCss="e-icons e-print" onClick={this.onPrint.bind(this)} /> */}
                  
                  <Fab
                    onClick={() => {
                      this.printWorkingPlan();
                      this.setState({ tabCalendar: 2 });
                      setTimeout(() => {
                        this.setState({ tabCalendar: 1 });
                      }, 100);
                    }}
                  >
                    <Tooltip title="IN">
                      <PrintUI />
                    </Tooltip>
                  </Fab>

                  <Fab
                    onClick={() => {
                      this.setState({ datePlan: moment(), disableWeek: 0 }, () => this.getDataTabPlan(1));
                    }}
                    disabled={this.state.disableWeek === 0}
                  >
                    <Tooltip title="Tuần hiện tại">
                      <Today />
                    </Tooltip>
                  </Fab>
                  <Fab
                    onClick={() => {
                      this.setState({showTV: true})
                      // setTimeout(() => {
                      //   this.handleShowTV()
                      // }, 1);
                      localStorage.setItem("datePlanCalendar",this.state.datePlan)
                      this.props.history.push(`/`);
                      setTimeout(() => {
                        this.props.history.push(`/AllCalendar/Calendar`);
                      }, 1);
                      window.open("/AllCalendar/ViewCalendar", '_blank').focus();

                      // window.location.reload()
                    }}
                    // disabled={this.state.disableWeek === 0}
                  >
                    <Tooltip title="Full View">
                    <FullscreenExitIcon/>
                    </Tooltip>
                  </Fab>
                </div>
              </div>
            )}

            {/* <div className="control-panel calendar-export" style={{ textAlign: 'right' }}>
              <UploaderComponent
                id="fileUpload"
                type="file"
                allowedExtensions={this.allowedExtensions}
                cssClass="calendar-import"
                buttons={{ browse: 'Tải lên ICS' }}
                multiple={this.multiple}
                showFileList={this.showFileList}
                selected={this.onSelect.bind(this)}
              />
            </div> */}
{/* lịch tháng */}
            {this.state.tabCalendar === 0 && (
              <CalendarContainer
                column={{
                  Id: '_id',
                  Subject: 'name',
                  Location: '',
                  StartTime: 'timeStart',
                  EndTime: 'timeEnd',
                  CategoryColor: '',
                }}
                source="crmStatus"
                sourceCode="ST16"
                sourceKey="type"
                // stage='publish'
                isCloneModule
                isOrg={true}
                url={`${API_MEETING}`}
                disabledOption
              // handleAdd={this.handleAddClick}
              // handleEdit={this.handleClickEdit}
              />
            )}

            {this.state.tabCalendar === 1 && (
              <Table id='tableWeekCalender' style={{ textAlign: 'center', border: 'solid 1px #80808030'}}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: 'left', width: 220 }}>
                      <Button onClick={() => {
                        this.changeWeekPlan(true)
                        this.setState({ disableWeek: this.state.disableWeek - 1 })
                      }} style={{ cursor: 'pointer', marginLeft: 10 }}>
                        Tuần trước
                      </Button>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 18, fontWeight: 'bold' }}>
                        Từ ngày {this.state.datePlan.startOf('week').format('DD/MM/YYYY')} đến{' '}
                        {this.state.datePlan.endOf('week').format('DD/MM/YYYY')}
                      </p>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right', width: 220 }}>
                      <Button onClick={() => {
                        this.changeWeekPlan(false)
                        this.setState({ disableWeek: this.state.disableWeek + 1 })
                      }} style={{ cursor: 'pointer', marginRight: 10 }}>
                        Tuần sau
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.dayOfWeek.map((item, index) => {
                    return (
                      <TableRow>
                        <TableCell style={{ padding: 0, width: 200 }}>
                          <p style={{ color: '#2196f3', height: '30px', lineHeight: '40px', paddingLeft: 5 }}>
                            {item}, Ngày{' '}
                            {this.state.datePlan
                              .startOf('week')
                              .add(index, 'days')
                              .format('DD/MM/YYYY')}
                          </p>
                        </TableCell>
                        {/* sáng */}
                        <TableCell style={{ padding: 0 }} colSpan="2">
                          <TableRow>
                            <TableCell
                              style={{
                                textAlign: 'left',
                                borderRight: '1px solid rgba(224, 224, 224, 1)',
                                borderLeft: '1px solid rgba(224, 224, 224, 1)',
                              }}
                            >
                              Sáng
                            </TableCell>
                            <TableCell
                              style={{
                                textAlign: 'center',
                                padding: 0,
                                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                               
                              }}
                            >
                              {/* renderSang */}
                              {renderSang(index, false).map(el => {
                                return el;
                              })}
                            </TableCell>
                            {
                              !this.state.showTV && <TableCell
                              style={{
                                textAlign: 'center',
                                padding: 0,
                                // borderRight: '1px solid rgba(224, 224, 224, 1)',
                               
                              }}
                              className="tableremove-tableremove"
                            >
                              
                              {renderSang(index, true).map(el => {
                                return el;
                              })}
                            </TableCell>
                            }
                            
                          </TableRow>
                          {/* chiều */}
                          <TableRow>
                            <TableCell
                              style={{
                                textAlign: 'left',
                                borderRight: '1px solid rgba(224, 224, 224, 1)',
                                borderLeft: '1px solid rgba(224, 224, 224, 1)',
                              }}
                            >
                              Chiều
                            </TableCell>
                            <TableCell style={{ textAlign: 'center', padding: 0, borderRight: 'none' }}>
                              {/* <p style={{ height: '30px', lineHeight: '40px' }}> </p> */}
                              {/* {this.state.dataPlan.map((element, idx) => {
                                if (
                                  this.state.datePlan
                                    .startOf('week')
                                    .add(index, 'days')
                                    .isSame(moment(element.time).format('YYYY/MM/DD')) &&
                                  (element.timeMeet && parseInt(element.timeMeet.slice(0, 3)) >= 12)
                                ) {
                                  return (
                                    <TableRow>
                                      <TableCell
                                        style={{
                                          textAlign: 'left',
                                          border: '1px solid rgba(224, 224, 224, 1)',
                                          borderRight: 'none',
                                          width: '100vh',
                                        }}
                                        colSpan={5}
                                      >
                                        {element.timeMeet}: {element.contentMeet}
                                      </TableCell>
                                    </TableRow>
                                  );
                                }
                              })} */}
                              {renderChieu(index, false).map(el => el)}
                            </TableCell>

                            {
                              !this.state.showTV && <TableCell
                              style={{
                                textAlign: 'center',
                                padding: 0,
                                // borderRight: '1px solid rgba(224, 224, 224, 1)',
                                
                              }}
                              className="tableremove-tableremove"
                            >
                              {renderChieu(index, true).map(el => el)}
                            </TableCell>
                            }
                            
                          </TableRow>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}

            {this.state.tabCalendar === 2 && (
              <Table style={{ border: 'solid 1px #80808030' }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Button onClick={() => this.changeDatePlan(true)} style={{ cursor: 'pointer' }}>
                        Ngày trước
                      </Button>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 18, fontWeight: 'bold' }}>Ngày {this.state.datePlan.format('DD/MM/YYYY')}</p>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Button onClick={() => this.changeDatePlan(false)} style={{ cursor: 'pointer' }}>
                        Ngày sau
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.dataPlan.length !== 0 ? (
                    this.state.dataPlan.map((item, index) => {
                      if (
                        parseInt(this.state.datePlan.format('YYYY')) === parseInt(moment(item.time).format('YYYY')) &&
                        parseInt(this.state.datePlan.format('MM')) === parseInt(moment(item.time).format('MM')) &&
                        parseInt(this.state.datePlan.format('DD')) === parseInt(moment(item.time).format('DD'))
                      ) {
                        return (
                          <TableRow>
                            <TableCell style={{ textAlign: 'center', borderRight: 'solid thin #80808030' }}>
                              {parseInt(item.timeMeet && item.timeMeet.slice(0, 3)) > 12 ? 'Chiều' : 'Sáng'}
                            </TableCell>
                            <TableCell style={{ textAlign: 'left' }}>
                              {item.timeMeet}: {item.contentMeet}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}> </TableCell>
                          </TableRow>
                        );
                      }
                    })
                  ) : (
                    <TableRow>
                      <TableCell style={{ textAlign: 'center' }}> </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>Không có lịch đơn vị</TableCell>
                      <TableCell style={{ textAlign: 'center' }}> </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* <ScheduleWork /> */}
          </div>
        ) : null}
        {/* pop up */}
        <CalendarAssignModal
          open={openAsignProcessor}
          docIds={selectedDocs}
          template={templatesData}
          childTemplate={selectedTemplate}
          onClose={() => {
            // setOpenAsignProcessor(false);
            // setSelectedTemplate(null);
            this.setState({
              openAsignProcessor: false,
              selectedTemplate: null,
              // canView: false,
              // openDialog: null
            });
            // this.reloadState();
          }}
          onSuccess={() => {
            // setOpenAsignProcessor(false);
            // setSelectedTemplate(null);
            this.setState({
              openAsignProcessor: false,
              selectedTemplate: null,
              canView: false,
              openDialog: null,
            });
            this.reloadState();
          }}
          // onChangeSnackbar={onChangeSnackbar}
          currentRole={nextRole}
          processType={this.state.processType}
          onChangeSnackbar={onChangeSnackbar}
          typeRole={typeRole ? typeRole : ''}
          unit={this.state.unit}
        />

        <CompleteDocs
          open={openComplete}
          docIds={selectedDocs}
          // template={setOpenComplete}
          onClose={() => {
            this.setState({
              openComplete: false,
              // canView: false,
            });
          }}
          onSuccess={() => {
            this.setState({
              openComplete: false,
              canView: false,
            });
            this.reloadState();
          }}
          onChangeSnackbar={onChangeSnackbar}
        />
        <PublishDocs
          open={openPublish}
          docIds={selectedDocs}
          // template={setOpenComplete}
          onClose={() => {
            this.setState({
              openPublish: false,
              // canView: false,
            });
          }}
          onSuccess={() => {
            this.setState({
              openPublish: false,
              canView: false,
            });
            this.reloadState();
          }}
          onChangeSnackbar={onChangeSnackbar}
        />

        <DeltetePublishDocs
          open={openDeletePublish}
          docIds={selectedDocs}
          // template={setOpenComplete}
          onClose={() => {
            this.setState({
              openDeletePublish: false,
              // canView: false,
            });
          }}
          onSuccess={() => {
            this.setState({
              openDeletePublish: false,
              canView: false,
            });
            this.reloadState();
          }}
          onChangeSnackbar={onChangeSnackbar}
        />

        <DestroyDocs
          open={openDestroy}
          docIds={selectedDocs}
          // template={setOpenComplete}
          onClose={() => {
            this.setState({
              openDestroy: false,
              // canView: false,
            });
          }}
          onSuccess={() => {
            this.setState({
              openDestroy: false,
              canView: false,
            });
            this.reloadState();
          }}
          onChangeSnackbar={onChangeSnackbar}
        />

        <ReturnMeetingDoc
          open={this.state.returnDoc}
          handleSave={async () => {
            await meetingReturnDoc({
              data: this.state.selectedDocsData.map(e => {
                // const { originItem } = e;
                // const last = originItem.processeds.pop();
                const last = e.processeds.pop();

                const processors = _.get(last, '_id', last);
                return {
                  docId: e._id,
                  processors: this.state.processors,
                };
              }),
            });
            this.setState({ returnDoc: false, reload: new Date() * 1 });
            this.handleRefactor([], '');
          }}
          onClose={() => this.setState({ returnDoc: false })}
        />

        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawer: false, id: 'add' })}
          open={this.state.openDrawer}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <div>
            <AddProjects
              mettingSchedule={this.state.id}
              data={{ isProject: false }}
              id="add"
              callback={this.callbackTask}
              onClose={() => this.setState({ openDrawer: false, id: 'add' })}
            />
          </div>
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawerMeeting: false, id: 'add' })}
          open={this.state.openDrawerMeeting}
          width={window.innerWidth - 260}
        >
          <div>
            <AddWorkingSchedule id="add" callback={this.callback} kanbanStatus={this.state.kanbanStatus} propsAll={this.props} />
          </div>
        </SwipeableDrawer>

        <DialogUI
          title="Chọn thông tin in lịch"
          onClose={() => this.onClosePrintScreen()}
          open={this.state.printInfo}
          onSave={() => {
            this.printWorkingPlan();
            setTimeout(() => {
              this.onClosePrintScreen();
            }, 500);
          }}
          saveText="IN"
        >
          <GridUI container style={{ marginTop: 10 }}>
            <GridUI item xs={5} style={{ marginRight: 10 }}>
              <TextField
                label="Chức vụ"
                variant="outlined"
                fullWidth
                value={this.state.position}
                InputLabelProps={{ shrink: true }}
                onChange={e => {
                  this.setState({ position: e.target.value });
                  localStorage.setItem('signer', e.target.value);
                }}
              />
            </GridUI>
            <GridUI item xs={5}>
              <TextField
                label="Cấp bậc và tên"
                variant="outlined"
                fullWidth
                value={this.state.cap_bac}
                InputLabelProps={{ shrink: true }}
                onChange={e => {
                  this.setState({ cap_bac: e.target.value });
                  localStorage.setItem('nameSigner', e.target.value);
                }}
              />
            </GridUI>
          </GridUI>
        </DialogUI>
      </div>
    );
  }

  addItemKanban = id => {
    this.setState({ openDrawerMeeting: true, kanbanStatus: id });
  };

  callbackTask = () => {
    this.setState({ openDrawer: false });
  };

  ItemComponent = data => (
    <div
      style={{
        padding: '20px 5px',
        margin: '20px 5px',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <p className="kanban-planner">
        Tên cuộc họp: <b> {data.name}</b>
      </p>
      <p className="kanban-planner">
        Người tham gia: <b> {data.people ? data.people.map(item => item.name).join(', ') : ''}</b>
      </p>
      <p className="kanban-planner">
        Địa điểm: <b> {data.address}</b>
      </p>

      <div className="footer-kanban-item">
        <button type="button" className="footer-kanban-item-time">
          <Notifications style={{ fontSize: '1rem' }} /> {new Date(data.date).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
        </button>
        <InsertCommentOutlined style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
}

WorkingSchedule.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  workingSchedule: makeSelectWorkingSchedule(),
  miniActive: makeSelectMiniActive(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getData: () => dispatch(getData()),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'workingSchedule', reducer });
const withSaga = injectSaga({ key: 'workingSchedule', saga });

export default compose(
  withStyles(styles),
  withReducer,
  injectIntl,
  withSaga,
  withConnect,
)(WorkingSchedule);

const customContent = [
  {
    title: 'Ngày bắt đầu',
    fieldName: 'timeStart',
    type: 'date',
  },
  {
    title: 'Ngày kết thúc',
    fieldName: 'timeEnd',
    type: 'date',
  },
];
