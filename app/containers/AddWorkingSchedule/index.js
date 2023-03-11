/**
 *
 * AddWorkingSchedule
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Button, Menu, MenuItem } from '@material-ui/core';
import moment from 'moment';
import CustomDatePicker from 'components/CustomDatePicker';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../Dashboard/selectors';
import makeSelectAddWorkingSchedule from './selectors';
import { Typography, Paper, Grid } from '../../components/LifetekUi';
import { mergeData, postData, getCurrent, getDefault, putData, getData, putAppropved, postGiveBack } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import reducer from './reducer';
import saga from './saga';
import { injectIntl } from 'react-intl';
import './style.css';
import CustomAppBar from 'components/CustomAppBar';
import CalendarAssignModal from 'components/CalendarAssignModal';
import { getListData } from 'utils/common';
import { addMeeting, meetingCalenReturnDoc } from '../../utils/api/metting'
import messages from './messages';
import {
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_MEETING,
  API_MEETING_UPDATE_CALEN_DETAIL,
  API_ROLE_APP,
} from '../../config/urlConfig';
import CompleteDocs from 'components/CalendarAssignModal/CompleteDocs';
import PublishDocs from 'components/CalendarAssignModal/PublishDocs';
import DeltetePublishDocs from 'components/CalendarAssignModal/DeltetePublishDocs';
import DestroyDocs from 'components/CalendarAssignModal/DestroyDocs';
import RemoveDialog from './components/RemoveDialog';
import { viewConfigCheckForm } from 'utils/common';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { fetchData } from '../../helper';
import AddApproveDialog from './components/AddApproveDialog';
import CancelApproveDialog from './components/CancelApproveDialog';
import ShowPublishDialog from './components/ShowPublishDialog';
import CancelPublishDialog from './components/CancelPublishDialog';
import GiveBackDialog from './components/GiveBackDialog';
import _ from 'lodash'
import request from '../../utils/request';
import CalendarDetail from './components/CalendarDetail';
import { sendProcessor, sendApprove, setProcessor } from '../../utils/api/metting';


/* eslint-disable react/prefer-stateless-function */
export class AddWorkingSchedule extends React.Component {
  constructor(props) {
    super(props);
    const dispatchColumns = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'Calendar') && JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'Calendar').listDisplay.type.fields.type.columns || [];
    const names = {};
    dispatchColumns.forEach(item => {
      names[item.name] = item.title;
    });
    const moduleCode = 'Calendar';
    // const checkRequired = viewConfigCheckRequired(moduleCode, 'required');
    // const checkShowForm = viewConfigCheckRequired(moduleCode, 'showForm');

    const checkRequired = {};
    dispatchColumns.forEach(item => {
      checkRequired[item.name] = item.checkedRequireForm;
    });
    const checkShowForm = {};
    dispatchColumns.forEach(item => {
      checkShowForm[item.name] = item.checkedShowForm;
    });
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    const id = this.props.id ? this.props.id : this.props.match && this.props.match.params.id;
    this.state = {
      names,
      checkRequired,
      checkShowForm,
      localMessages: {},
      stopAdd: false,
      crmSource,
      openSelectDocumentType: null,
      currentRole: null,
      openAsignProcessor: false,
      currentTargetMenu: null,
      openLetterDialog: null,
      openLetterAsignModal: false,
      templatesLetter: [],
      openDialog: null,
      templates: [],
      templatesData: [],
      selectedTemplate: null,
      selectedDocs: id && id !== 'add' ? [id] : [],
      nextRole: null,
      showTemplates: false,
      openComplete: false,
      roleForProcess: null,
      openPublish: false,
      openDestroy: false,
      openDeletePublish: false,
      openDialogRemove: false,
      allRoles: [],
      typeRole: null,
      businessRole: {},
      anchorElAction: null,
      anchorElAction1: null,
      openDialogRemoveToday: false,
      removeToday: [],
      openDialogApprove: false,
      openDialogApproveCancel: false,
      openGiveBackDialog: false,
      chosenCalenderId: null,
      indexItemAction: null,
      indexsItemAction: null,
      calenderDetailApprove: [],
      openAddSchedule: false,
      reload: 0,
      editId: '',
      openEditSchedule: false,
      readOnly: _.get(this, 'props.location.state.readOnly'),
      showUnApprove: _.get(this, 'props.location.state.showUnApprove'),
      allowGiveback: _.get(this, 'props.location.state.allowGiveback'),
      reloadCalenDetail: 0,
      disableButton: false,
      unit: ""
    };
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
    localStorage.removeItem('editWorkingScheduleCallback');
    this.props.getData();
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/calendar`).then(res => {
      if (res) {
        this.setState({ templates: res.children || [], templatesData: res });
        this.customTemplate({ role: this.props.profile.roleGroupSource, childrens: res.children, type: this.props.profile.type });
      } else {
        this.props.onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng xử lý', status: true })
      }

    });

    fetchData(`${API_ROLE_APP}/Calendar/${this.props.profile._id}`)
      .then(res => {
        const newBusinessRole = {};
        const { roles } = res;
        const code = 'BUSSINES';
        const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
        const { data } = foundRoleDepartment;
        this.setState({ allRoles: data })

        const { allRoles } = this.state;
        const dataProcessors = allRoles && allRoles.find(elm => elm.name === 'processors');
        const dataCompalte = allRoles && allRoles.find(elm => elm.name === 'compalte');
        const dataPublish = allRoles && allRoles.find(elm => elm.name === 'publish');
        const dataProcessorsFm = dataProcessors && dataProcessors.data;
        const dataCompalteFm = dataCompalte && dataCompalte.data;
        const dataPublishFm = dataPublish && dataPublish.data;

        const dataFm = JSON.parse(localStorage.getItem('workingScheduletab'))

        if (dataFm && dataFm.tab === 0) {
          this.setState({ businessRole: dataProcessorsFm })
        }
        else if (dataFm && dataFm.tab === 1) {
          this.setState({ businessRole: dataCompalteFm })
        }
        else if (dataFm && dataFm.tab === 2) {
          this.setState({ businessRole: dataPublishFm })
        }
      })
      .catch(error => {
        //console.log('error', error);
      });

    if (id === 'add') {
      this.props.getDefault();
    } else {
      this.props.getCurrent(id);
      this.props.mergeData({
        employee: null,
        department: '',
        timeStart: new Date(),
        timeEnd: new Date(),
        filter: {
          isProject: false,
          mettingSchedule: id,
        },
      });
    }
  }

  handleReloadCalen = () => this.setState({ reloadCalenDetail: this.state.reloadCalenDetail + 1 })

  handleAdd = (e) => {
    const { addWorkingSchedule } = this.props
    const lengths = addWorkingSchedule.calenDetail.length
    const lateDays = addWorkingSchedule.calenDetail[Number(lengths) - 1] ? addWorkingSchedule.calenDetail[Number(lengths) - 1][0] && addWorkingSchedule.calenDetail[Number(lengths) - 1][0].time : [];

    const dataFm = addWorkingSchedule.calenDetail && addWorkingSchedule.calenDetail[addWorkingSchedule.calenDetail.length - 1]
    if (dataFm) {
      const dataTime = dataFm[0] && dataFm[0].time;
      if (moment(dataTime).format('DD/MM/YYYY') == moment(addWorkingSchedule.timeEnd).format('DD/MM/YYYY')) {
        this.setState({ stopAdd: true })
      } else {
        this.setState({ stopAdd: false })
      }
    }
    const newData = [
      {
        timeMeet: '',
        timeEndMeet: '',
        contentMeet: '',
        time: moment(lateDays).add(1, "day"),
        typeCalendar: {},
        addressMeet: '',
        roomMetting: null,
        checkMeet: false,
      }
    ]
    addWorkingSchedule.calenDetail.push(newData)
    this.props.mergeData(addWorkingSchedule)
  }
  handleAddContent = (e, index) => {
    const { addWorkingSchedule } = this.props
    const newData = {
      timeMeet: '',
      timeEndMeet: '',
      contentMeet: '',
      typeCalendar: {},
      addressMeet: '',
      roomMetting: null,
      checkMeet: false,
    }
    addWorkingSchedule.calenDetail[index].push(newData)
    this.props.mergeData(addWorkingSchedule)
  }

  handleAddSchedule = (time) => {
    const { addSchedule } = this.props.addWorkingSchedule;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const dataAddressMeet = addSchedule && addSchedule.roomMetting
      && addSchedule.roomMetting !== null
      && addSchedule.roomMetting.address ?
      addSchedule.roomMetting.address :
      addSchedule.addressMeet
    request(`${API_MEETING_UPDATE_CALEN_DETAIL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMeet: addSchedule.timeMeet,
        addressMeet: dataAddressMeet,
        contentMeet: addSchedule.contentMeet,
        roomMetting: addSchedule.roomMetting,
        timeEndMeet: addSchedule.timeEndMeet,
        typeCalendar: addSchedule.typeCalendar,
        calendarId: id,
        time: time,
      }),
    })
      .then(response => response.data)
      .then(async res => {

        this.props.onChangeSnackbar({ variant: 'success', message: 'Thêm mới thành công', status: true });
        this.setState({ openAddSchedule: false })
        this.reloadState();
        // this.handleSaveProject();
      })
      .catch(error => {
        this.props.onChangeSnackbar({ variant: 'error', message: 'Thêm mới thất bại', status: false });
      });
  }

  handleEditSchedule = (time) => {
    const { addSchedule } = this.props.addWorkingSchedule;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const dataAddressMeet = addSchedule && addSchedule.roomMetting
      && addSchedule.roomMetting !== null
      && addSchedule.roomMetting.address ?
      addSchedule.roomMetting.address :
      addSchedule.addressMeet
    request(`${API_MEETING_UPDATE_CALEN_DETAIL}/${addSchedule._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMeet: addSchedule.timeMeet,
        addressMeet: dataAddressMeet,
        contentMeet: addSchedule.contentMeet,
        roomMetting: addSchedule.roomMetting,
        timeEndMeet: addSchedule.timeEndMeet,
        typeCalendar: addSchedule.typeCalendar,
        calendarId: id,
        time: time,
      }),
    })
      .then(response => response.data)
      .then(async res => {

        this.props.onChangeSnackbar({ variant: 'success', message: 'Thêm mới thành công', status: true });
        this.setState({ openEditSchedule: false })
        this.reloadState();
        // this.handleSaveProject();
      })
      .catch(error => {
        this.props.onChangeSnackbar({ variant: 'error', message: 'Thêm mới thất bại', status: false });
      });
  }



  reloadState = () => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    // let obj = {};

    // obj = {
    //   filter: {
    //     calendarId: id

    //   }
    // }

    fetch(`${API_MEETING}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
    // .then(data => {
    //   this.setState({ dataHistory: data.data });
    //   const dataFm = data.data && data.data.filter(i => i.position === "Phối hợp xử lý")
    //   const datainCharge = data.data && data.data.filter(i => i.position === "Xử lý chính")
    //   console.log('datainCharge', datainCharge)
    //   this.props.mergeData({ support: dataFm, inCharge: datainCharge })
    // });
    this.setState({ reload: new Date() * 1 });

    this.props.getCurrent(id);
  };

  handleClose = () => {
    this.props.history.goBack()
  }
  handleCloseCalendar = e => {
    this.setState({ openDialog: null });
  };

  handleOpen = e => {
    this.setState({
      openDialog: e.currentTarget
    })
  };

  handleViewType() {
    this.setState({ showTemplates: true });
  }

  deleteCarRental = (index, indexs) => {
    const { addWorkingSchedule } = this.props;
    const { calenDetail } = addWorkingSchedule;
    const data = calenDetail[index];


    if (calenDetail && calenDetail[index] && calenDetail[index].length === 1) {
      calenDetail.splice(index, 1);
    } else {

      data.splice(indexs, 1);
    }



    this.setState({ openDialogRemove: false, anchorElAction: false });
  };

  deleteCarRentalToday = () => {
    const { removeToday } = this.state;
    let deteleFm = [];
    deteleFm = removeToday && removeToday.map(i => i._id);

    request(`${API_MEETING_UPDATE_CALEN_DETAIL}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: deteleFm
      }),
    })
      .then(response => response.data)
      .then(async res => {

        this.props.onChangeSnackbar({ variant: 'success', message: 'Xóa thành công', status: true });
        this.setState({ openDialogRemoveToday: false, anchorElAction: false })
        this.reloadState();

        // this.handleSaveProject();
      })
      .catch(error => {
        this.props.onChangeSnackbar({ variant: 'error', message: 'Xóa thất bại', status: false });
      });

    // const { addWorkingSchedule } = this.props;
    // const { calenDetail } = addWorkingSchedule;
    // const data = calenDetail[index];


    // if (addWorkingSchedule.calenDetail[index]) {
    //   let orderCheck = addWorkingSchedule.calenDetail[index].filter(i => i.checkMeet === true);
    // }



    // this.setState({ openDialogRemoveToday: false, anchorElAction: false });
  };
  addApproveFunction = (_id) => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addWorkingSchedule } = this.props;
    const { calenDetail } = addWorkingSchedule;
    if (id && _id) {
      const data = {
        ids: [_id],
        approved: true,
        calenDetail
        // task: addWorkingSchedule.task,
      };

      if (id && id !== "add") {
        this.props.putAppropved(data, id);
        // this.props.mergeData(addWorkingSchedule)
      }
    };
  }
  handleApproveDialogCancel = (_id) => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addWorkingSchedule } = this.props;
    const { calenDetail } = addWorkingSchedule;
    if (id && _id) {
      const data = {
        ids: [_id],
        approved: false,
        calenDetail
        // task: addWorkingSchedule.task,
      };

      if (id && id !== "add") {
        this.props.putAppropved(data, id);
        // this.props.mergeData(addWorkingSchedule)
      }
    };
  }
  handlePublishDialog = (_id) => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addWorkingSchedule } = this.props;
    const { calenDetail } = addWorkingSchedule;
    if (id && _id) {
      const data = {
        ids: [_id],
        publish: true,
        calenDetail
      };

      if (id && id !== "add") {
        this.props.putAppropved(data, id);
      }
    };
  }
  handlePublishDialogCancel = (_id) => {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { addWorkingSchedule } = this.props;
    const { calenDetail } = addWorkingSchedule;
    if (id && _id) {
      const data = {
        ids: [_id],
        publish: false,
        calenDetail
      };

      if (id && id !== "add") {
        this.props.putAppropved(data, id);
      }
    };
  }

  handleChange = (name, value) => {
    const { addWorkingSchedule } = this.props
    const newAdd = { ...addWorkingSchedule, [name]: value }
    const localMessages = viewConfigCheckForm('Task', newAdd);
    const {names} = this.state
    this.setState({ localMessages: { ... this.state.localMessages || {}, [name]: localMessages[name] } });
    if (name === 'timeStart' || name === 'timeEnd') {
      if (newAdd.timeStart && newAdd.timeEnd) {
        // if (newAdd.timeStart) {

        //   this.props.mergeData({ [name]: value, timeEnd: firstDayOfWeek });
        // }
        // const firstDayOfWeek = moment(newAdd.timeStart).add(6, "days") || value
        if (new Date(newAdd.timeStart) > new Date(newAdd.timeEnd)) {


          // this.setState({ localMessages: { ... this.state.localMessages || {}, endDate: 'Ngày kết thúc phải lớn hơn ngày bắt đầu' } });
          return this.props.onChangeSnackbar({ variant: 'error', message: `${names.timeEnd} phải lớn hơn ${names.timeStart}`, status: true });
        }
        else {
          this.props.mergeData({ [name]: value });
        }
      }
    }


  };

  cb = () => {
    this.props.history.goBack();
  };

  onSuccess = () => {
    this.setState({
      openAsignProcessor: false,
      selectedTemplate: null
    });
    this.cb();
  }

  render() {
    const { addWorkingSchedule, intl, miniActive, onChangeSnackbar, dashboardPage, profile } = this.props;
    const { calenDetail, addSchedule, editSchedule } = addWorkingSchedule;
    const { readOnly } = this.state
    const showGiveback = this.state.showGiveback && this.state.allowGiveback
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    localStorage.setItem('workingScheduleId', id);
    localStorage.removeItem('mettingScheduleId');
    const dataFm = JSON.parse(localStorage.getItem('workingScheduletab'))

    _.has(dataFm, 'tabChild') && localStorage.setItem('addWorkingScheduleCallback', JSON.stringify({ tab: dataFm.tab, tabChild: dataFm.tabChild }));
    const { names, currentRole, openAsignProcessor, currentTargetMenu, openLetterDialog, openLetterAsignModal,
      templatesLetter, openDialog, templates, selectedTemplate, selectedDocs, nextRole, showTemplates, openComplete, roleForProcess,
      openPublish, openDestroy, openDeletePublish, openDialogRemove,
      checkRequired, checkShowForm, localMessages, allRoles, typeRole, businessRole,
      templatesData, anchorElAction, openDialogRemoveToday, removeToday, openDialogApprove, openDialogApproveCancel, openPublishDialog,
      openPublishDialogCancel, openGiveBackDialog, openMenuGiveBack, openAddSchedule, openEditSchedule } = this.state;

    const dataProcessors = allRoles && allRoles.find(elm => elm.name === 'processors');
    const dataCompalte = allRoles && allRoles.find(elm => elm.name === 'compalte');
    const dataPublish = allRoles && allRoles.find(elm => elm.name === 'publish');
    const dataProcessorsFm = dataProcessors && dataProcessors.data;
    const dataCompalteFm = dataCompalte && dataCompalte.data;
    const dataPublishFm = dataPublish && dataPublish.data;


    const roleCode = dashboardPage && dashboardPage.role && dashboardPage.role.roles && dashboardPage.role.roles.find(item => item.codeModleFunction === 'Calendar');
    const roleModule = roleCode && roleCode.methods ? roleCode.methods : [];

    // const receiveChild = addWorkingSchedule && addWorkingSchedule.stage && addWorkingSchedule.stage.code === 'receive';
    const receivePut = (roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true;
    // const receive = id && id !== 'add' ? receiveChild && receivePut : true;
    const receive = id && id !== 'add' ? receivePut : true;

    const orEndRole =
      addWorkingSchedule &&
      addWorkingSchedule.template &&
      addWorkingSchedule.template.group &&
      addWorkingSchedule.currentRole === addWorkingSchedule.template.group[addWorkingSchedule.template.group.length - 1].person;

    const isFreeToSetProcessor = addWorkingSchedule && !addWorkingSchedule.template && addWorkingSchedule.processors && addWorkingSchedule.processors.length;
    const isProcessor = addWorkingSchedule && addWorkingSchedule.processors && addWorkingSchedule.processors.indexOf(profile._id) !== -1 && !orEndRole;
    const isCreator = addWorkingSchedule && addWorkingSchedule.createdBy && addWorkingSchedule.createdBy.employeeId === profile._id && (!addWorkingSchedule.processors || !addWorkingSchedule.processors.length);
    const canSetProcessor = (isProcessor || isCreator) && (addWorkingSchedule && addWorkingSchedule.stage && addWorkingSchedule.stage.code !== 'complete');
    // const setProcessor = id && id !== 'add' ? canSetProcessor : true;

    const showUnpublish = (businessRole && businessRole.unPublish && businessRole.unPublish === true) && ((dataFm && dataFm.tab === 2) && (dataFm && dataFm.tabChild === 1))
      && businessRole && businessRole.unPublish && businessRole.unPublish === true

    const showPublish = addWorkingSchedule && addWorkingSchedule.stage && addWorkingSchedule.stage && addWorkingSchedule.stage.code === "complete"
      && businessRole && businessRole.publish && businessRole.publish === true

    const showUnApproval = addWorkingSchedule && addWorkingSchedule.stage && addWorkingSchedule.stage && addWorkingSchedule.stage.code === "complete"
      && businessRole && businessRole.unCompalte && dataFm && dataFm.tab !== 2 && id !== 'add';

    // const showApproval1 = ((dataFm && dataFm.tab !== 2 && id === 'add') && (addWorkingSchedule.children && addWorkingSchedule.children.length === 0))
    //   && (dataFm && dataFm.tabChild === 0) && businessRole && businessRole.approval && businessRole.approval === true;

    const showApproval2 = dataFm && dataFm.tab !== 2 && id !== 'add'
    //   && addWorkingSchedule && addWorkingSchedule.children && addWorkingSchedule.children[0] && addWorkingSchedule.children[0].children
    //   && addWorkingSchedule.children[0].children.length > 0;
    // const showApproval1 = dataFm && (dataFm.tab === 0 || dataFm.tab === 1) && dataFm.tabChild === 0 && businessRole && businessRole.approval && businessRole.approval === true
    //   && ((id === "add" && (!addWorkingSchedule.children || addWorkingSchedule.children && addWorkingSchedule.children.length === 0)) || (id !== 'add'
    //     && addWorkingSchedule && addWorkingSchedule.children && addWorkingSchedule.children[0] && addWorkingSchedule.children[0].children
    //     && addWorkingSchedule.children[0].children.length > 0));


    const showApproval1 =
      ((dataFm && dataFm.tab !== 2 && id === 'add')
        || (id === 'add' && addWorkingSchedule.children && addWorkingSchedule.children.length === 0))
      && (dataFm && dataFm.tabChild === 0) && businessRole && businessRole.approval && businessRole.approval === true;

    const showApprove = dataFm && (dataFm.tab === 0 || dataFm.tab === 1) && dataFm.tabChild === 0 && businessRole && businessRole.compalte && businessRole.compalte === true;

    const showApprove1 = dataFm && (dataFm.tab === 0 || dataFm.tab === 1) && dataFm.tabChild === 0 && (!addWorkingSchedule || !addWorkingSchedule.stage || addWorkingSchedule.stage.code !== "complete")
      && businessRole && businessRole.compalte === true;

    const showUnApprove = businessRole.unCompalte && this.state.showUnApprove
    const showComplete =
      (isFreeToSetProcessor || orEndRole) &&
      (addWorkingSchedule && addWorkingSchedule.stage && addWorkingSchedule.stage.code === 'processing');
    const { processeds } = addWorkingSchedule;
    const itemAction = addWorkingSchedule.calenDetail && addWorkingSchedule.calenDetail[this.state.indexItemAction] && addWorkingSchedule.calenDetail[this.state.indexItemAction][this.state.indexsItemAction] ?
      addWorkingSchedule.calenDetail[this.state.indexItemAction][this.state.indexsItemAction] : null;
    const showApproveItem = businessRole && businessRole.compalte && businessRole.compalte === true && itemAction && !itemAction.approved;
    const showApproveItemCacel = businessRole && businessRole.compalte && businessRole.compalte === true && itemAction && itemAction.approved;
    const showPublishItem = businessRole && businessRole.publish && businessRole.publish === true && itemAction && !itemAction.publish;
    const showPublishItemCancel = businessRole && businessRole.publish && businessRole.publish === true && itemAction && itemAction.publish;
    //approval: trình duyệt
    //compalte: phê duyệt
    //publish: xuất bản

    const dafaultt = this.calenDetail;

    const docId = [];
    if (dafaultt && dafaultt.length) {
      dafaultt.forEach(el => {
        el.forEach(element => {
          if (element.checkMeet) {
            docId.push(element.children)
          }
        });
      });
    }


    return (
      <div >
        <Paper className="Paperdetail" >
          <CustomAppBar
            title={id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'THÊM MỚI lịch đơn vị' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật lịch đơn vị' })}`}
            onGoBack={this.handleClose}
            disableAdd
            moreButtons={
              <div style={{ marginRight: 10, display: 'flex', justifyContent: 'space-around' }}>
                {showGiveback &&
                  <Button variant="outlined" color="inherit" style={{ marginRight: 10 }}
                    onClick={e => {
                      this.setState({
                        // openMenuGiveBack: e.currentTarget
                        openGiveBackDialog: true
                      })
                    }} >
                    Trả lại
                  </Button>
                }

                {(showApprove || showApprove1) && id !== 'add' ? (
                  <>
                    <Button variant="outlined" color="inherit" style={{ marginRight: 10 }}
                      onClick={e => {
                        this.setState({
                          openComplete: true
                        })
                      }}
                    >
                      Phê duyệt
                    </Button>
                  </>
                ) : null}
                {showUnApprove ? (
                  <>
                    <Button variant="outlined" color="inherit" style={{ marginRight: 10 }}
                      onClick={e => {
                        this.setState({
                          openDestroy: true
                        })
                      }} >
                      Huỷ phê duyệt
                    </Button>

                  </>
                ) : null}

                {(dataFm && dataFm.tabChild === 0) && businessRole && businessRole.publish && businessRole.publish === true || showPublish ? (
                  <Button variant="outlined" color="inherit" style={{ marginRight: 10 }}
                    onClick={e => {
                      this.setState({
                        openPublish: true
                      })
                    }} >
                    Xuất bản
                  </Button>
                ) : null}


                {showUnpublish ? (
                  <Button variant="outlined" color="inherit" style={{ marginRight: 10 }}
                    onClick={e => this.setState({ openDeletePublish: true })} >
                    Huỷ xuất bản
                  </Button>
                ) : null}
                {showApproval1 && Array.isArray(templates) && templates.length > 0 ? (
                  <>
                    <Button variant="outlined" color="inherit" style={{ marginRight: 10 }}
                      onClick={e => {
                        this.setState({
                          openDialog: e.currentTarget,
                          dialogType: 'approval'
                        });
                      }}
                    >
                      Trình duyệt
                    </Button>
                  </>
                ) : null}

                {showApproval2 && Array.isArray(templates) && templates.length > 0 &&
                  <Button
                    variant="outlined"
                    color="inherit"
                    style={{ marginRight: 10 }}
                    onClick={e => {
                      if (currentRole) {
                        this.setState({
                          openAsignProcessor: true
                        })
                        return;
                      }
                      this.handleOpen(e);
                    }}
                  >

                    Trình duyệt
                  </Button>
                }

                {/* <Menu open={Boolean(openMenuGiveBack)} anchorEl={openMenuGiveBack} onClose={() => this.setState({ openMenuGiveBack: null })}>
                   <MenuItem onClick={() => this.setState({ openGiveBackDialog: true })}>{processeds && processeds[processeds.length - 1].name}</MenuItem>
                 </Menu> */}

                <Menu open={Boolean(openDialog)} anchorEl={openDialog} onClose={this.handleCloseCalendar}>
                  {docId && docId.length > 0 ?
                    (
                      <>
                        {
                          Array.isArray(docId) && docId.length < 1 ? (docId.map(a => (
                            <>
                              {a && a.length > 0 ? (
                                <>
                                  {Array.isArray(a) && a.map(fm => (
                                    <>

                                      <MenuItem

                                        value={fm.code}
                                        onClick={() => {
                                          this.setState({
                                            selectedTemplate: fm,
                                            openAsignProcessor: true,
                                            nextRole: fm.code,
                                            typeRole: fm.type,
                                          })
                                        }}
                                      >
                                        <span style={{ paddingLeft: 60 }}>Chuyển cho {fm.name}</span>
                                      </MenuItem>
                                    </>

                                  ))}
                                </>
                              ) : (
                                <>
                                  {
                                    templates && Array.isArray(templates) &&
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
                                              })
                                            }}
                                          >
                                            <span >Chuyển cho {t.name}</span>
                                          </MenuItem>
                                        </>
                                      </>
                                    ))}
                                </>
                              )}

                            </>
                          ))) : (
                            <>
                              {
                                templates && Array.isArray(templates) &&
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
                                          })
                                        }}
                                      >
                                        <span >Chuyển cho {t.name}</span>
                                      </MenuItem>
                                    </>
                                  </>
                                ))}
                            </>
                          )
                        }
                      </>
                    )
                    : (
                      <>

                        {
                          addWorkingSchedule.children && addWorkingSchedule.children.length > 0 ? (
                            <div style={{ alignItems: 'center', padding: '0 10px' }}>
                              {
                                Array.isArray(addWorkingSchedule.children) && addWorkingSchedule.children.map(t => (
                                  <>
                                    {Array.isArray(addWorkingSchedule.children) && Array.isArray(t.children) && t.children.map(i => (
                                      <>
                                        <MenuItem

                                          value={t.code}
                                          onClick={() => {

                                            if (t.unit) {
                                              this.setState({
                                                selectedTemplate: i,
                                                openAsignProcessor: true,
                                                nextRole: i.code,
                                                typeRole: i.type,
                                                unit: i.unit
                                              })
                                            }
                                            else
                                              this.setState({
                                                selectedTemplate: i,
                                                openAsignProcessor: true,
                                                nextRole: i.code,
                                                typeRole: i.type,
                                                unit: ""
                                              })
                                            // this.setState({
                                            //   selectedTemplate: t,
                                            //   openAsignProcessor: true,
                                            //   nextRole: t.code,
                                            //   typeRole: t.type,
                                            // })
                                          }}
                                        >
                                          <span style={{ paddingLeft: 60 }}>Chuyển cho {i.name}</span>
                                        </MenuItem>
                                      </>
                                    ))}
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
                                          if (t.unit) {
                                            this.setState({
                                              selectedTemplate: t,
                                              openAsignProcessor: true,
                                              typeRole: t.type,
                                              unit: t.unit
                                            })
                                          }
                                          else
                                            this.setState({
                                              selectedTemplate: t,
                                              openAsignProcessor: true,
                                              typeRole: t.type,
                                              unit: ""
                                            })
                                        }}
                                      >
                                        <span >Chuyển cho {t.name}</span>
                                      </MenuItem>
                                    </>
                                  </>
                                ))}
                            </div>
                          )
                        }
                      </>
                    )

                  }

                </Menu>

                {receive && (
                  <Button variant="outlined" color="inherit" onClick={() => this.onSaveData()} style={{ marginRight: 10 }} disabled={this.state.disableButton}>
                    Lưu
                  </Button>
                )}
              </div>
            }
          />
          < Typography variant="h6" align="start" style={{ marginTop: 20, fontSize: 14, fontWeight: 600 }}>
            {/* <p style={{ marginTop: 20, fontSize: 24 }}> */}
            {id === 'add' ? ' Thông tin chung' : ' Thông tin chung'}
          </Typography >
          {/* </p> */}
          < Grid container md={12} spacing={8} >
            <Grid item md={12}>
              <CustomInputBase
                // label={'Tên lịch đơn vị'}
                label={names.name}
                // errorMessages={['Không được bỏ trống']}
                validators={['required']}
                // required
                InputLabelProps={{ shrink: true }}
                value={addWorkingSchedule.name}
                name="name"
                onChange={e => this.props.mergeData({ name: e.target.value })}
                // error={!addWorkingSchedule.name}
                // helperText={addWorkingSchedule.name ? null : 'Không được bỏ trống'}
                fullWidth
                autoFocus
                // className={"CustomRequiredLetter"}
                error={localMessages && localMessages.name}
                helperText={localMessages && localMessages.name}
                required={checkRequired.name}
                checkedShowForm={checkShowForm.name}
                className={checkRequired.name ? "CustomRequiredLetter" : 'CustomIconRequired'}
              // autoFocus
              />
            </Grid>
            <Grid item md={6} >
              <CustomDatePicker
                inputVariant="outlined"
                label={names.timeStart}
                value={addWorkingSchedule.timeStart}
                name="timeStart"
                margin="dense"
                variant="outlined"
                // onChange={value => this.props.mergeData({ timeStart: value })}
                onChange={e => this.handleChange('timeStart', e && moment(e).format('YYYY-MM-DD'))}
                fullWidth
                error={localMessages && localMessages.timeStart}
                helperText={localMessages && localMessages.timeStart}
                required={checkRequired.timeStart}
                checkedShowForm={checkShowForm.timeStart}
                className={checkRequired.timeStart ? "CustomRequiredLetter" : 'CustomIconRequired'}
                minDate={new Date()}
                minDateMessage={false}
              />
            </Grid>
            <Grid item md={6} >
              <CustomDatePicker
                inputVariant="outlined"
                label={names.timeEnd}
                value={addWorkingSchedule.timeEnd}
                name="timeEnd"
                margin="dense"
                variant="outlined"
                //onChange={value => this.props.mergeData({ timeEnd: value })}
                onChange={e => this.handleChange('timeEnd', e && moment(e).format('YYYY-MM-DD'))}
                fullWidth
                // keyboard

                error={localMessages && localMessages.timeEnd}
                helperText={localMessages && localMessages.timeEnd}
                required={checkRequired.timeEnd}
                checkedShowForm={checkShowForm.timeEnd}
                className={checkRequired.timeEnd ? "CustomRequiredLetter" : 'CustomIconRequired'}
              />
            </Grid>
          </Grid >
          <CalendarDetail
            reload={this.state.reloadCalenDetail}
            id={_.get(this, 'props.id') || _.get(this, 'props.match.params.id')}
            profile={this.props.profile}
            item={addWorkingSchedule}
            getData={(result) => {
              this.calenDetail = result;
              if (Array.isArray(result)) {
                const selected = []
                let giveback = false
                result.forEach(el => {
                  el.forEach(e => {
                    if (e.checkMeet) {
                      selected.push(e)
                      giveback = giveback || !!_.get(e, 'processeds[0]')
                    }
                  });
                });
                this.selectedCalenDetail = selected
                this.setState({ showGiveback: giveback })
              }
            }}
            onChangeSnackbar={this.props.onChangeSnackbar}
            query={_.get(this, 'props.location.state.queryCalen')}
          />
        </Paper >

        <RemoveDialog
          title="Đồng chí có muốn xóa trạng thái này không?"
          openDialogRemove={openDialogRemoveToday}
          handleClose={() => this.setState({ openDialogRemoveToday: false })}
          handleDelete={() => {
            const id = this.props.id ? this.props.id : this.props.match.params.id;
            if (id === 'add') {
            }
            else {
              this.deleteCarRentalToday()
            }
          }}
        />

        <AddApproveDialog
          title={`Đồng chí có muốn phê duyệt lịch đơn vị này?`}
          openDialogApprove={openDialogApprove}
          handleClose={() => this.setState({ openDialogApprove: false })}
          handleAddApproveDialog={() => {
            const id = this.state.chosenCalenderId;
            this.addApproveFunction(id);
            this.setState({ openDialogApprove: false })
          }}

        />
        <CancelApproveDialog
          title="Đồng chí có muốn hủy phê duyệt lịch đơn vị này?"
          openDialogApproveCancel={openDialogApproveCancel}
          handleClose={() => this.setState({ openDialogApproveCancel: false })}
          handleApproveDialogCancel={() => {
            const id = this.state.chosenCalenderId;
            this.handleApproveDialogCancel(id);
            this.setState({ openDialogApproveCancel: false })
          }}
        />
        <ShowPublishDialog
          title={`Đồng chí có muốn xuất bản lịch đơn vị này`}
          openPublishDialog={openPublishDialog}
          handleClose={() => this.setState({ openPublishDialog: false })}
          handlePublishDialog={
            () => {
              const id = this.state.chosenCalenderId;
              this.handlePublishDialog(id);
              this.setState({ openPublishDialog: false })
            }
          }
        />

        <CancelPublishDialog
          title='Đồng chí có muốn hủy xuất bản lịch đơn vị này'
          openPublishDialogCancel={openPublishDialogCancel}
          handleClose={() => this.setState({ openPublishDialogCancel: false })}
          handlePublishDialogCancel={
            () => {
              const id = this.state.chosenCalenderId;
              this.handlePublishDialogCancel(id);
              this.setState({ openPublishDialogCancel: false })
            }
          }
        />
        <GiveBackDialog
          title='Đồng chí có đồng ý trả lại lịch đơn vị này'
          openGiveBackDialog={openGiveBackDialog}
          handleClose={() => this.setState({ openGiveBackDialog: false })}
          handleGiveBackDialog={
            () => {
              meetingCalenReturnDoc({ data: this.selectedCalenDetail.map(e => e._id) }).then(this.reloadCalenDetail)
              this.setState({ openGiveBackDialog: false })
            }
          }
        />

        <Menu keepMounted open={Boolean(anchorElAction)} onClose={() => this.setState({ anchorElAction: null })} anchorEl={anchorElAction}>
          <MenuItem >Sửa</MenuItem>
          {showApproveItem && <MenuItem onClick={() => this.setState({ openDialogApprove: true })}>Duyệt</MenuItem>}
          {showApproveItemCacel && <MenuItem onClick={() => this.setState({ openDialogApproveCancel: true })}>Hủy duyệt</MenuItem>}
          {showPublishItem && <MenuItem onClick={() => this.setState({ openPublishDialog: true })}>Xuất bản</MenuItem>}
          {showPublishItemCancel && <MenuItem onClick={() => this.setState({ openPublishDialogCancel: true })}>Hủy xuất bản</MenuItem>}
          <MenuItem onClick={() => this.setState({ openDialogRemove: true })} >Xóa</MenuItem>
        </Menu>

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
              selectedTemplate: null
            })
          }}
          onSuccess={() => {
            this.props.history.goBack();
          }}
          onChangeSnackbar={onChangeSnackbar}
          currentRole={roleForProcess ? roleForProcess : nextRole}
          customSave={(body) => {
            const newBody = {
              children: selectedTemplate.children,
              processors: body.processors,
              template: _.get(this, 'state.templatesData._id'),
            }

            if (id === 'add') {
              this.onSaveData(async res => {
                newBody.docIds = [res._id]
                setProcessor(newBody)
                this.props.onChangeSnackbar({ variant: 'success', message: 'Trình duyệt thành công', status: true });
                this.props.history.goBack()
              })
            } else {
              if (Array.isArray(this.selectedCalenDetail) && this.selectedCalenDetail.length > 0) {
                newBody.docIds = this.selectedCalenDetail.map(e => e._id)
                sendProcessor(newBody).then(this.handleReloadCalen)
                this.props.onChangeSnackbar({ variant: 'success', message: 'Trình duyệt thành công', status: true });
              } else {
                newBody.docIds = [id]
                setProcessor(newBody)
                this.props.onChangeSnackbar({ variant: 'success', message: 'Trình duyệt thành công', status: true });
                this.props.history.goBack()
              }
            }

            this.setState({ openAsignProcessor: false })
          }}
          saveAndSend={this.saveAndSend}
          typeRole={typeRole ? typeRole : ''}
          handleComplete={this.onSaveData}
          id={id}
          unit={this.state.unit}
          processType="flow"

        />

        <CompleteDocs
          open={openComplete}
          docIds={selectedDocs}
          // template={setOpenComplete}
          onClose={() => {
            this.setState({
              openComplete: false
            })
          }}
          calenDetail={this.calenDetail}
          customSubmit={({ docIds }) => {
            sendApprove({ docIds })
          }}
          onSuccess={() => {
            this.setState({
              openDeletePublish: false
            })
            this.props.history.goBack();
          }}
          handleComplete={this.onSaveData}
          onChangeSnackbar={onChangeSnackbar}
          saveAndSend={this.saveAndSend}
          calenderDetailData={this.state.calenderDetailApprove}
          id={id}
        />

        <PublishDocs
          open={openPublish}
          docIds={selectedDocs}
          // template={setOpenComplete}
          onClose={() => {
            this.setState({
              openPublish: false
            })
          }}
          calenDetail={this.calenDetail}
          // customSubmit={({ docIds }) => {
          //   sendPublish({ docIds })
          // }}
          customSubmit={() => {
            if (id === 'add') {
              this.onSaveData(async res => {
                request(`${API_MEETING}/set-publish`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ docIds: [res._id] }),
                }).then(response => {
                  if (response.successNo === 1) {
                    this.props.onChangeSnackbar({ variant: 'success', message: 'Xuất bản thành công', status: true });
                    this.props.history.goBack()
                  }
                })
              })
            } else {
              request(`${API_MEETING}/set-publish`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ docIds: [id] }),
              }).then(response => {
                if (response.successNo === 1) {
                  this.props.onChangeSnackbar({ variant: 'success', message: 'Xuất bản thành công', status: true });
                  this.props.history.goBack()
                }
              })
            }
          }}
          onSuccess={() => {
            this.setState({
              openDeletePublish: false
            })
            this.props.history.goBack();
          }}
          onChangeSnackbar={onChangeSnackbar}
          // saveAndSend={this.saveAndSend}
          // handleComplete={this.onSaveData}
          id={id}
        />

        <DeltetePublishDocs
          open={openDeletePublish}
          docIds={selectedDocs}
          // template={setOpenComplete}
          onClose={() => {
            this.setState({
              openDeletePublish: false
            })
          }}
          onSuccess={() => {
            this.setState({
              openDeletePublish: false
            })
            this.props.history.goBack();
          }}
          calenDetail={this.calenDetail}
          onChangeSnackbar={onChangeSnackbar}
          handleComplete={this.onSaveData}
          id={id}
        />

        <DestroyDocs
          open={openDestroy}
          docIds={[1]}
          customSave={() => {
            if (Array.isArray(this.selectedCalenDetail) && this.selectedCalenDetail.length) {
              sendApprove({
                docIds: this.selectedCalenDetail.map(e => e._id),
                stage: 'processing',
              }).then(this.handleReloadCalen)
            }
            this.setState({ openDestroy: false })

          }}
          onClose={() => {
            this.setState({
              openDestroy: false
            })
          }}
          onSuccess={() => {
            this.setState({
              openDestroy: false
            })
            this.cb();
          }}
          onChangeSnackbar={onChangeSnackbar}
          handleComplete={this.onSaveData}
          id={id}
        />

      </div >

    );

  }

  onGoBack = () => {
    if (this.props.history) {
      this.props.history.goBack();
    } else if (this.props.callback) this.props.callback();
  };

  updateCheckMeeting = calenDetail => {
    const { openDialog, openPublish } = this.state;
    if (Array.isArray(calenDetail)) {
      if (openDialog) {
        return calenDetail.map(arr => arr.map(e => ({ ...e, approved: _.has(e, 'checkMeet') ? e.checkMeet : e.approved })))
      } else if (openPublish) {
        return calenDetail.map(arr => arr.map(e => ({ ...e, publish: _.has(e, 'checkMeet') ? e.checkMeet : e.publish })))
      }
    }
    return calenDetail
  }

  onSaveData = async (callback) => {
    const { addWorkingSchedule } = this.props;
    const {names} = this.state
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (new Date(addWorkingSchedule.timeStart) >= new Date(addWorkingSchedule.timeEnd)) {
      this.props.onChangeSnackbar({ status: true, message: `${names.timeEnd} phải lớn hơn ${names.timeStart}`, variant: 'error' });
      return;
    }
    const messages = viewConfigCheckForm('Calendar', addWorkingSchedule);
    this.setState({
      localMessages: messages,
    });
    this.setState({ messages });
    if (Object.values(messages).filter(v => v).length) {
      return this.props.onChangeSnackbar({ variant: 'error', message: 'Vui lòng nhập đầy đủ các trường thông tin', status: true });
    }

    const createdBy = {
      name: this.props.profile.name,
      employeeId: this.props.profile._id,
    };

    const data = {
      calenDetail: this.calenDetail,
      typeCalendar: addWorkingSchedule.typeCalendar,
      name: addWorkingSchedule.name,
      timeStart: addWorkingSchedule.timeStart,
      timeEnd: addWorkingSchedule.timeEnd,
      createdBy,
      people: [],
      date: new Date(),
      callback: this.props.callback,
      // task: addWorkingSchedule.task,
    };

    // data.calenDetail = this.updateCheckMeeting(data.calenDetail)
    // if (callback) data.callback = callback
    if (!id || id === 'add') {
      this.setState({ disableButton: true })
      const meeting = await addMeeting(data)
      if (_.get(meeting.data, '_id')) {
        if (typeof callback === 'function') {
          callback(meeting.data)
        }
        else {
          this.props.onChangeSnackbar({ variant: 'success', message: 'Thêm mới thành công', status: true });
          this.props.history.goBack();

          // this.setState({ disableButton: false })
          // this.props.onChangeSnackbar({ variant: 'error', message: meeting.message || "Thêm mới thất bại", status: true });
        }
      } else {
        this.setState({ disableButton: false })
        this.props.onChangeSnackbar({ variant: 'error', message: meeting.message || "Thêm mới thất bại", status: true });

        // this.props.onChangeSnackbar({ variant: 'success', message: 'Thêm mới thành công', status: true });
        // this.props.history.goBack();
      }
    }
    else {
      this.setState({ disableButton: true })
      this.props.putData(data, id, this.handleOpenBtnSave);
    }
  };
  handleOpenBtnSave =()=>{
    this.setState({ disableButton: false })
  }
  saveAndSend = onSaveSuccess => {
    const { addWorkingSchedule } = this.props;

    const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (new Date(addWorkingSchedule.timeStart) >= new Date(addWorkingSchedule.timeEnd)) {
      this.props.onChangeSnackbar({ status: true, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu', variant: 'warning' });
      return;
    }

    const createdBy = {
      name: this.props.profile.name,
      employeeId: this.props.profile._id,
    };

    const data = {
      calenDetail: addWorkingSchedule.calenDetail,
      typeCalendar: addWorkingSchedule.typeCalendar,
      name: addWorkingSchedule.name,
      timeStart: addWorkingSchedule.timeStart,
      timeEnd: addWorkingSchedule.timeEnd,
      createdBy,
      people: [],
      date: new Date(),
      callback: this.props.callback,
      // task: addWorkingSchedule.task,
    };

    data.calenDetail = this.updateCheckMeeting(data.calenDetail)

    if (id === 'add') {
      this.props.postData(data, onSaveSuccess);
    } else {
      this.props.putData(data, id);
    }

  };
}

const mapStateToProps = createStructuredSelector({
  addWorkingSchedule: makeSelectAddWorkingSchedule(),
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    postData: (data, cb) => dispatch(postData(data, cb)),
    getCurrent: id => dispatch(getCurrent(id)),
    getDefault: () => dispatch(getDefault()),
    putData: (data, id, handleOpenBtnSave) => dispatch(putData(data, id, handleOpenBtnSave)),
    putAppropved: (data, id) => dispatch(putAppropved(data, id)),
    postGiveBack: (data, id) => dispatch(postGiveBack(data, id)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    getData: () => dispatch(getData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addWorkingSchedule', reducer });
const withSaga = injectSaga({ key: 'addWorkingSchedule', saga });

export default compose(
  withReducer,
  withSaga,
  injectIntl,
  withConnect,
)(AddWorkingSchedule);
