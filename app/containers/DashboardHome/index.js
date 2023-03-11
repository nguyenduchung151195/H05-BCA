/* eslint-disable no-unused-vars */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * DashboardHome
 *
 */

import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import makeSelectDashboardHome from './selectors';
import makeSelectDashboardPage from '../Dashboard/selectors';
import { changeSnackbar } from '../Dashboard/actions';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePickerCustom';

import reducer from './reducer';
import saga from './saga';
import { mergeData, getApi, getKpi, getRevenueChartData, getProfitChart } from './actions';
import { Paper, Grid, Typography } from '../../components/LifetekUi';
import { mergeDataProject } from '../ProjectPage/actions';
import { mergeData as mergeDataTask } from '../TaskPage/actions';
import { fetchData, flatChild, removeWaterMark } from '../../helper';
import { formatNumber } from '../../utils/common';
import { getData } from './actions';
import {
  API_INCOMMING_DOCUMENT_COUNT,
  API_OUTGOING_DOCUMENT_COUNT,
  API_ROLE_APP,
  API_TASK_PROJECT,
  API_ORIGANIZATION,
  DASHBOARD_TREE_SETTING,
  API_DASHBOARD_DOCUMENT_REPORT,
} from '../../config/urlConfig';
import { makeSelectProfile } from '../Dashboard/selectors';
import makeSelectWorkingSchedule from './selectors';
import './index.css';
import { CircularProgress } from '@material-ui/core';
import moment from 'moment';
import { ThirtyFpsSelect } from '@mui/icons-material';

/* eslint-disable react/prefer-stateless-function */
am4core.useTheme(Am4themesAnimated);
const ReportBox = props => (
  <Grid item md={12} style={{ background: props.color, padding: '25px 10px', width: '100%', position: 'relative' }}>
    <div style={{ padding: 5, zIndex: 999 }}>
      <Typography style={{ color: 'white' }} variant="h4">
        {props.number}
      </Typography>
      <Typography variant="body1">{props.text}</Typography>
    </div>
    <div
      className="hover-dashboard"
      style={{
        position: 'absolute',
        background: props.backColor,
        textAlign: 'center',
        padding: 'auto',
        display: 'block',
        textDecoration: 'none',
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        textShadow: 'none',
        cursor: 'pointer',
        zIndex: 555,
      }}
      onClick={props.openDetail}
    >
      Xem chi tiết
    </div>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 88,
        fontSize: '70px',
        padding: 5,
      }}
    >
      {props.icon}
    </div>
  </Grid>
);
function getNameBy(value, type) {
  switch (value) {
    case 'countDocumentarys':
      if (type === 'inDoc') {
        return 'Tiếp nhận';
      }
      return 'Trình ký';

    case 'documentCommanders':
      return 'Chỉ đạo';

    case 'projects':
      return 'Công việc mới';
    case 'completeSelect':
      return 'Hoàn thành';
    case 'doingSelect':
      return 'Đang thực hiện';
    case 'stopSelect':
      return 'Tạm dừng';
    case 'cancelSelect':
      return 'Thất bại';

    case 'documentarysProcessors':
      return 'Xử lý chính';

    case 'documentarysSupporters':
      return 'Phối hợp xử lý';

    case 'documentarysViewers':
      return 'Nhận để biết';

    case 'documentGoing':
      return 'Văn bản đi';

    case 'documentarysRelease':
      return 'Ban hành';

    case 'feedBackCount':
      return 'Ý kiến';
    case 'createdByCount':
      return 'Giao việc';
    case 'inChargeCount':
      return 'Xử lý chính';
    case 'supportCount':
      return 'Phối hợp';

    default:
      'value ';
  }
}
function CircleChart(props) {
  const { id, data, type = '', titleTex, isExport } = props;
  let circleChart1;
  let final = [];
  if (!Array.isArray(data)) {
    let keys = (data && Object.keys(data)) || [];
    keys.map(key => {
      let obj = {
        name: getNameBy(key, type),
        proportion: data && data[key],
      };
      final.push(obj);
    });
  }

  useEffect(
    () => {
      const chart = am4core.create(id, am4charts.PieChart3D);
      chart.depth = 15;
      chart.angle = 30;
      // remove logo am4chart
      am4core.addLicense('ch-custom-attribution');
      const title = chart.titles.create();
      title.text = titleTex && titleTex.toUpperCase();
      title.fontSize = 16;
      title.marginBottom = 20;
      title.marginTop = 5;
      title.fontWeight = 600;
      // title.fontFamily = 'sans-serif';
      // title.color = 'black'

      // Add data
      chart.data = final && type !== '' ? final : data;

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries3D());
      pieSeries.dataFields.value = 'proportion';
      pieSeries.dataFields.category = 'name';
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;
      chart.legend = new am4charts.Legend();
      pieSeries.legendSettings.itemValueText = '{value}';
      chart.legend.width = 150;
      chart.legend.position = 'right';
      chart.legend.scrollable = true;
      circleChart1 = chart;
    },
    [data],
  );
  useEffect(
    () => () => {
      if (circleChart1) {
        circleChart1.dispose();
      }
    },
    [data],
  );

  return <div {...props} style={{ height: 350, border: '1px solid #cfc4c4', padding: '20px 0', width: '100%' }} id={id} />;
}

export class DashboardHome extends React.Component {
  state = {
    tabTask: 0,
    tabs: 0,
    isExportRevenueChart: false,
    dataCount: [],
    goDocumentsCount: {},
    outDocumentCount: {},
    taskDocumentCount: {},
    listDer: [],
    listDerGo: [],
    listManagerInfo: [],
    tableWidth: window.innerWidth,
    startDate: moment().startOf("month"),
    endDate: moment().endOf("month")
  };

  componentWillMount() {}

  async getData() {
    // fix
    
    const {listDer} = this.state
    console.log(listDer, "listDer")
    const {startDate, endDate} = this.state
    fetch(`${API_DASHBOARD_DOCUMENT_REPORT}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          console.log(data, "data")
          if (listDer && Array.isArray(listDer) && listDer.length > 0 && data.data && Array(data.data) && data.data.length > 0) {
            let datas = [];
            listDer.map(el => {
              data.data.map(ell => {
                if (el._id && ell._id && el._id === ell._id) {
                  datas.push(ell);
                }
              });
            });
            console.log(datas, "datas")
            this.setState({ listManagerInfo: datas || [] });
          } else {
            this.setState({ listManagerInfo: data.data || [] });
          }
        }
      });
  }

  async componentDidMount() {
    const flattedDepartment = await fetchData(API_ORIGANIZATION);
    const listDer = flatChild(flattedDepartment);
    this.setState({listDer })
    const resizeListener = () => {
      this.setState({ tableWidth: window.innerWidth });
    };
    window.addEventListener('resize', resizeListener);
    this.props.getApi();
    // this.getOriganization();
    this.getData();
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack');
    localStorage.removeItem('addWorkingScheduleCallback');
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');
    Promise.all([
      fetch(`${API_INCOMMING_DOCUMENT_COUNT}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(response => response.json()),
      fetchData(`${API_ROLE_APP}/IncommingDocument/currentUser`),
    ]).then(res => {
      const dataReport = res[0];
      const role = res[1];
      const code = 'BUSSINES';
      const newData = {};
      // tinh toan
      const { roles } = role;
      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
      if (foundRoleDepartment) {
        const { data } = foundRoleDepartment;
        if (data) {
          data.forEach(d => {
            if (d.name === 'receive' && d.data.view) {
              newData.countDocumentarys = dataReport.countDocumentarys;
              return;
            }
            if (d.name === 'processing' && d.data.view) {
              newData.documentarysProcessors = dataReport.documentarysProcessors;
              return;
            }
            if (d.name === 'support' && d.data.view) {
              newData.documentarysSupporters = dataReport.documentarysSupporters;
              return;
            }
            if (d.name === 'view' && d.data.view) {
              newData.documentarysViewers = dataReport.documentarysViewers;
              return;
            }
            if (d.name === 'command' && d.data.view) {
              newData.documentCommanders = dataReport.documentCommanders;
              return;
            }
            if (d.name === 'feedback' && d.data.view) {
              newData.feedBackCount = dataReport.feedBackCount;
              return;
            }
          });
          this.setState({ dataCount: newData, goDocumentsCount: newData });
        }
      }
    });
    Promise.all([
      fetch(`${API_OUTGOING_DOCUMENT_COUNT}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(response => response.json()),
      fetchData(`${API_ROLE_APP}/OutGoingDocument/currentUser`),
    ]).then(res => {
      const dataReport = res[0];
      const role = res[1];
      const code = 'BUSSINES';
      const newData = {};
      // tinh toan
      const { roles } = role;
      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
      if (foundRoleDepartment) {
        const { data } = foundRoleDepartment;
        if (data) {
          data.forEach(d => {
            if (d.name === 'receive' && d.data.view) {
              newData.countDocumentarys = dataReport.countDocumentarys;
              return;
            }
            if (d.name === 'processing' && d.data.view) {
              newData.documentarysProcessors = dataReport.documentarysProcessors;
              return;
            }
            if (d.name === 'release' && d.data.view) {
              newData.documentarysRelease = dataReport.documentarysRelease;
              return;
            }
            if (d.name === 'outgoing' && d.data.view) {
              newData.documentGoing = dataReport.documentGoing;
              return;
            }
            if (d.name === 'feedback' && d.data.view) {
              newData.feedBackCount = dataReport.feedBackCount;
              return;
            }
          });
          this.setState({ outDocumentCount: newData });
        }
      }
    });

    Promise.all([
      fetch(`${API_TASK_PROJECT}/count`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(response => response.json()),
    ]).then(response => {
      const dataReport = response[0];
      const newData = {};
      newData.createdByCount = dataReport.createdByCount;
      newData.inChargeCount = dataReport.inChargeCount;
      newData.supportCount = dataReport.supportCount;
      this.setState({ taskDocumentCount: newData });
    });
  }

  getOriganization = () => {
    fetchData(API_ORIGANIZATION).then(res => {
      const flattedDepartment = flatChild(res);
      this.setState({ listDer: flattedDepartment });
    });
  };

  getCountProjects = () => {
    const apiUrl = `${API_TASK_PROJECT}/count`;
    fetch(`${apiUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ count: data });
      });
  };

  componentWillUnmount() {
    if (this.pieChart) {
      this.pieChart.dispose();
    }
    if (this.columnChart) {
      this.columnChart.dispose();
    }
  }

  openContract = () => {
    this.props.history.push('./IncommingDocument');
  };

  openProject = () => {
    this.props.history.push('/OutGoingDocument');
  };

  openCustomer = () => {
    this.props.history.push('/Task');
  };

  openBusiness = () => {
    this.props.history.push('/crm/BusinessOpportunities');
  };

  // mở cong viec
  openTask = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // open phu trach
  openInCharge = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // Mở được xem
  openViewable = () => {
    const { profile } = this.props.dashboardHome;
    this.props.history.push('/Task');
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // Mở đóng dung
  openStop = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // CHưa thực hiện
  openCancel = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // Mở đang thực hiện
  openDoing = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataTask({
      tab: 1,
    });
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

  // Mở chậm tiến độ
  openProgress = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // mở cong viec hoan thanh
  openComplete = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  // mo k thuc hien

  openNotDoing = () => {
    const { profile } = this.props;
    this.props.history.push('/Task');
    this.props.mergeDataTask({
      tab: 1,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevState.startDate !== this.state.startDate || prevState.endDate !== this.state.endDate){
      this.getData()
    }
    removeWaterMark();
  }

  render() {
    const { tabTask, tabs, dataCount, goDocumentsCount, outDocumentCount, taskDocumentCount, listManagerInfo, tableWidth } = this.state;

    const { dashboardHome, onGetRevenueChartData, getProfitChart, profile } = this.props;
    const {
      contracts,
      projects,
      customers,
      businessOpportunities,
      tasks,
      inChargeSelect,
      viewableSelect,
      stopSelect,
      cancelSelect,
      doingSelect,
      progressSelect,
      completeSelect,
      projectSkip,
      notDoingSelect,
      columnXYRevenueChart,
      profitChart,
      loadingRevenueChart,
      loadingProfitChart,
    } = dashboardHome;
    let dataChart3 = { projects, completeSelect, doingSelect, stopSelect, cancelSelect };
    const INIT_CHART_DATA3 = [
      { name: 'Công việc mới', proportion: 20 },
      { name: 'Đang thực hiện', proportion: 10 },
      { name: 'Hoàn thành', proportion: 20 },
      { name: 'Thất bại', proportion: 20 },
      { name: 'Tạm dừng', proportion: 20 },
    ];

    const customFC = item => {
      const { listDer } = this.state;
      let listDerr = [];
      let data = [];
      listDer &&
        Array.isArray(listDer) &&
        listDer.length > 0 &&
        listDer.map(el => {
          item.map((ell, index) => {
            if (el._id && ell._id && el._id === ell._id) {
              data.push({
                ...ell,
                nameOrg: <div style={{ paddingLeft: `${ell.level * 15}px` }}>{ell.nameOrg}</div>,
              });
            }
          });
        });
      return data.length && data.length > 0 ? data : item;
    };

    const unit = DASHBOARD_TREE_SETTING.find(i => i.ROLE.includes(profile.roleGroupSource));
    const unitTypes = unit && unit.UNITS;

    return (
      <div>
        <Paper>
          <Grid container spacing={8}>
            <Grid item md={4}>
              <ReportBox
                icon={null}
                number={
                  formatNumber(
                    (dataCount.countDocumentarys || 0) +
                      (dataCount.documentCommanders || 0) +
                      (dataCount.documentarysProcessors || 0) +
                      (dataCount.documentarysSupporters || 0) +
                      (dataCount.documentarysViewers || 0) +
                      (dataCount.feedBackCount || 0),
                  ) || 0
                }
                text="Văn bản đến chưa xử lý"
                color="linear-gradient(to right, #03A9F4, #03a9f4ad)"
                backColor="rgb(0, 126, 255)"
                openDetail={this.openContract}
              />
            </Grid>
            <Grid item md={4}>
              <ReportBox
                icon={null}
                number={
                  formatNumber(
                    (outDocumentCount.countDocumentarys ? outDocumentCount.countDocumentarys : 0) +
                      (outDocumentCount.documentGoing ? outDocumentCount.documentGoing : 0) +
                      (outDocumentCount.documentarysProcessors ? outDocumentCount.documentarysProcessors : 0) +
                      (outDocumentCount.documentarysRelease ? outDocumentCount.documentarysRelease : 0) +
                      (outDocumentCount.feedBackCount ? outDocumentCount.feedBackCount : 0),
                  ) || 0
                }
                text="Văn bản đi chờ xử lý"
                color="linear-gradient(to right, rgb(76, 175, 80), rgba(76, 175, 80, 0.68))"
                backColor="#237f1c"
                openDetail={this.openProject}
              />
            </Grid>
            <Grid item md={4}>
              <ReportBox
                icon={null}
                number={
                  formatNumber(
                    (taskDocumentCount.createdByCount ? taskDocumentCount.createdByCount : 0) +
                      (taskDocumentCount.inChargeCount ? taskDocumentCount.inChargeCount : 0) +
                      (taskDocumentCount.supportCount ? taskDocumentCount.supportCount : 0),
                  ) || 0
                }
                text="Hồ sơ công việc chưa hoàn thành"
                color="linear-gradient(to right, #FFC107, rgba(255, 193, 7, 0.79))"
                backColor="#cd7e2c"
                openDetail={this.openCustomer}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} justify="space-between" style={{ marginTop: 30 }}>
            <Grid item container md={12} spacing={8}>
              <Grid item md={4}>
                <CircleChart style={{ width: '100%', height: '50vh' }} id="chart1" titleTex="Văn bản đến" data={goDocumentsCount} type="inDoc" />
              </Grid>

              <Grid item md={4}>
                <CircleChart style={{ width: '100%', height: '50vh' }} id="chart2" titleTex="Văn bản đi" data={outDocumentCount} type="outDoc" />
              </Grid>
              <Grid item md={4}>
                <CircleChart
                  style={{ width: '100%', height: '50vh' }}
                  id="chart3"
                  titleTex="Hồ sơ công việc"
                  data={taskDocumentCount}
                  type="infoDoc"
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        {localStorage.getItem('viewConfig') && listManagerInfo && listManagerInfo.length !== 0 ? (
          <>
            <Paper style={{ width: 'calc(100vw - 285px)' }}>
              <Grid item md={12} sm={12} container>
                <Grid item md={4} sm={4}>
                  <Typography variant="h5">Thông tin quản lý</Typography>
                </Grid>
                <Grid item md={8} sm={8} style={{ display: 'flex', justifyContent: 'end' }} container spacing={16}>
                  <Grid item md={4} sm={4}>
                    <CustomDatePicker
                      label="Từ ngày"
                      value={this.state.startDate || null}
                      variant="outlined"
                      name="startDate"
                      margin="normal"
                      top="12px"
                      // disableFuture
                      onChange={e => {
                        const end = this.state.endDate.format("MM/DD/YYYY")
                        const start = e.format("MM/DD/YYYY")
                        const diffDate = moment(start).diff(moment(end), 'days')
                        console.log(diffDate, "diffDate")
                        if(diffDate > 0){
                          this.props.onChangeSnackbar &&
                          this.props.onChangeSnackbar({
                            variant: 'warning',
                            message: 'Từ ngày phải nhỏ hơn đến ngày, đồng chí vui lòng chọn lại!',
                            status: true,
                          });
                          return 
                        }
                        this.setState({startDate: e })
                      }}
                      style={{ width: '100%' }}
                      required={true}
                      isClear={false}
                    />
                  </Grid>
                  <Grid item md={4} sm={4}>
                    <CustomDatePicker
                      label="Đến ngày"
                      value={this.state.endDate || null}
                      variant="outlined"
                      name="startDate"
                      margin="normal"
                      top="12px"
                      // disableFuture
                      onChange={e => {
                        const end = this.state.startDate.format("MM/DD/YYYY")
                        const start = e.format("MM/DD/YYYY")
                        const diffDate = moment(start).diff(moment(end), 'days')
                        console.log(diffDate, "diffDate")
                        if(diffDate < 0){
                          this.props.onChangeSnackbar &&
                          this.props.onChangeSnackbar({
                            variant: 'warning',
                            message: 'Đến ngày phải lớn hơn từ ngày, đồng chí vui lòng chọn lại!',
                            status: true,
                          });
                          return 
                        }
                        this.setState({endDate: e })
                      }}
                      style={{ width: '100%' }}
                      required={true}
                      isClear={false}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <table
                width={`${tableWidth - 330}px`}
                border="1"
                className="table_dashboard"
                style={{
                  textAlign: 'center',
                  border: 'solid thin #c1c1c1',
                  fontSize: 14,
                  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                }}
              >
                <tbody>
                  <tr style={{ backgroundColor: '#e1e1e1', fontWeight: 'bold' }}>
                    <td rowspan="3" colspan="3">
                      Đơn vị
                    </td>
                    <td
                      style={{ height: 50, cursor: 'pointer' }}
                      colspan="4"
                      onClick={() =>
                        this.props.history.push({
                          pathname: '/IncommingDocument',
                          tabs: 'findStatistics',
                        })
                      }
                    >
                      Văn bản đến
                    </td>
                    <td
                      style={{ height: 50, cursor: 'pointer' }}
                      colspan="3"
                      onClick={() =>
                        this.props.history.push({
                          pathname: '/OutGoingDocument',
                          tabs: 'findStatistics',
                        })
                      }
                    >
                      Văn bản đi
                    </td>
                    <td
                      colspan="4"
                      style={{ border: 'solid thin #c1c1c1', height: 50, cursor: 'pointer' }}
                      onClick={() => {
                        const { dashboardPage } = this.props;
                        const bussines =
                          dashboardPage &&
                          dashboardPage.roleTask &&
                          dashboardPage.roleTask.roles &&
                          dashboardPage.roleTask.roles.find(elm => elm.code === 'BUSSINES').data;
                        if (
                          bussines &&
                          bussines.find(elm => elm.name === 'findStatistics') &&
                          bussines.find(elm => elm.name === 'findStatistics').data &&
                          bussines.find(elm => elm.name === 'findStatistics').data.view === true
                        ) {
                          this.props.history.push({
                            pathname: '/Task',
                            tab: 3,
                          });
                        } else {
                          this.props.onChangeSnackbar &&
                            this.props.onChangeSnackbar({
                              variant: 'warning',
                              message: 'Đồng chí không có quyền xem tra cứu thống kê của hồ sơ công việc !',
                              status: true,
                            });
                        }
                      }}
                    >
                      Hồ sơ công việc
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#e1e1e1', fontWeight: 'bold' }}>
                    <td style={{ height: 50 }} colspan="2">
                      Hoàn Thành
                    </td>
                    <td style={{ height: 50 }} colspan="2">
                      Chưa hoàn thành
                    </td>
                    <td style={{ height: 50 }} rowspan="2">
                      Tổng số
                    </td>
                    <td style={{ height: 50 }} rowspan="2">
                      Chờ xử lý
                    </td>
                    <td style={{ height: 50 }} rowspan="2">
                      Ban hành
                    </td>
                    <td style={{ height: 50 }} rowspan="2">
                      Tổng số
                    </td>
                    <td style={{ height: 50 }} rowspan="2">
                      Chưa xử lý
                    </td>
                    <td style={{ height: 50 }} rowspan="2">
                      Đang xử lý
                    </td>
                    <td rowspan="2" style={{ border: 'solid thin #c1c1c1', height: 50 }}>
                      Hoàn thành
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#e1e1e1', fontWeight: 'bold' }}>
                    <td style={{ height: 50 }}>Tổng số</td>
                    <td style={{ height: 50 }}>Quá hạn</td>
                    <td style={{ height: 50 }}>Tổng số</td>
                    <td style={{ border: 'solid thin #c1c1c1' }}>Quá hạn</td>
                  </tr>
                  {listManagerInfo.map(item => {
                    return (
                      <tr>
                        <td
                          style={{
                            textAlign: 'left',
                            paddingLeft: `${item.level * 15}px`,
                            width: 150,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          colspan="3"
                        >
                          <div
                            style={{
                              // width: 100,
                              // whiteSpace: 'nowrap',
                              // overflow: 'hidden',
                              // textOverflow: 'ellipsis',
                              fontWeight: 'bold',
                            }}
                          >
                            {item.nameOrg}
                          </div>
                        </td>
                        <td style={{ height: 50 }}>{item.countComplete}</td>
                        <td>{item.countCompleteOutDeadline}</td>
                        <td>{item.countNoComplete}</td>
                        <td>{item.countNoCompleteOutDeadline}</td>
                        <td>{item.count}</td>
                        <td>{item.countProcessingDoc}</td>
                        <td>{item.countPromulgateDoc}</td>
                        <td>{item.countTasks}</td>
                        <td>{item.countNoProcessTasks}</td>
                        <td>{item.countProcessingTasks}</td>
                        <td style={{ border: 'solid thin #c1c1c1' }}>{item.countCompleteTasks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Paper>
          </>
        ) : (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }
}

// DashboardHome.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  dashboardHome: makeSelectDashboardHome(),
  profile: makeSelectProfile(),
  workingSchedule: makeSelectWorkingSchedule(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getApi: () => dispatch(getApi()),
    getKpi: () => dispatch(getKpi()),
    onGetRevenueChartData: () => dispatch(getRevenueChartData()),
    mergeDataProject: data => dispatch(mergeDataProject(data)),
    mergeDataTask: data => dispatch(mergeDataTask(data)),
    getProfitChart: () => dispatch(getProfitChart()),
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

const withReducer = injectReducer({ key: 'dashboardHome', reducer });
const withSaga = injectSaga({ key: 'dashboardHome', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DashboardHome);

ReportBox.defaultProps = {
  color: 'linear-gradient(to right, #03A9F4, #03a9f4ad)',
  icon: 'CardTravel',
};
