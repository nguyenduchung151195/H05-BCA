/**
 *
 * WorkingSchedule
 *
 */

import React from 'react';
import PropTypes, { element } from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

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
import injectSaga from 'utils/injectSaga';

import injectReducer from 'utils/injectReducer';
import {
  API_DOCUMENT_PROCESS_TEMPLATE,
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_MEETING,
  API_MEETING_UPDATE_CALEN_DETAIL,
  API_ROLE_APP,
  API_USERS,
} from '../../config/urlConfig';
import makeSelectWorkingSchedule from './selectors';
import makeSelectDashboardPage, { makeSelectMiniActive, makeSelectProfile } from '../Dashboard/selectors';
import reducer from './reducer';
import saga from './saga';
import { getData, mergeData } from './actions';
import moment from 'moment';

import { getListData } from '../../utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import { fetchData, serialize, workingCalendarTable, printTemplte } from '../../helper';
import styles from './styles';
import { injectIntl } from 'react-intl';

import { extend } from '@syncfusion/ej2-base';
import './index.css';
import _ from 'lodash';
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
      datePlan:  localStorage.getItem("datePlanCalendar") ? moment(localStorage.getItem("datePlanCalendar")) : moment(),
      dataPlan: [],
      dayOfWeek: ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ Năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'],
      printInfo: false,
      position: '',
      cap_bac: '',
      disableWeek: 0,
      showTV: true,
      renderCalender: false,
      statusGetData: false,
      afterRender: false
    };
  }





 componentDidUpdate(prevProps, prevState){
  if(prevState.renderCalender !== this.state.renderCalender && this.state.renderCalender){
    console.log("haha")
    this.handleShowTV()
  }
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
    

  }


  getDataTabPlan(val) {
    console.log(val, 'nsjvnjsndv')
    let filter;
    let newDateFilter = _.cloneDeep(this.state.datePlan);
    let firstWeekDay = _.cloneDeep(newDateFilter)
      .startOf('week')
      // .subtract(1, 'days')
      .format('YYYY/MM/DD HH:mm:ss');
    
      filter = {
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
      }
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
                  this.setState({ dataPlan: _.uniq(newData), statusGetData: true });
                });
              });
            }
          }).catch((err)=>{
            this.setState({statusGetData: true})
          })
    }
  handleShowTV(){

    let contentEle = document.getElementById('tableWeekCalendertableWeekCalender');
    if (contentEle) {
      let displayItem = document.getElementById('display-calendar');

      if (displayItem) {
        displayItem.innerHTML = contentEle.outerHTML;
        document.getElementById('app').style.display = 'none';
        displayItem.style.display = 'block';

        let i = 0;
        let tableHeight = document.getElementById('display-calendar').getBoundingClientRect().height;
        console.log(window.innerHeight, "dnjfvndfv")
        setInterval(() => {
          let newY = (i * 2);
          // if (newY > window.innerHeight) {
            if((window.innerHeight + window.scrollY) >= tableHeight){
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
      tab,
      statusGetData,
      renderCalender
    } = this.state;

    localStorage.setItem('workingScheduletab', JSON.stringify({ tab: this.state.tabIndex, tabChild: tab }));

 

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
              <TableRow style={{border: '1px solid rgba(224, 224, 224, 1)',}}>
                <TableCell
                  style={{
                    textAlign: 'left',
                    // border: '1px solid rgba(224, 224, 224, 1)',
                    width: '100vh',
                    paddingLeft:50,
                    visibility: `${!hidden ? "visible" : "hidden"}`,
                    
                  }}
                  colSpan={5}
                >
                  <b style={{fontWeight:"bold", margin:0, padding:0}}>{getTypeCalendar(element.typeCalendar)} {cutTimeMeet(element.timeMeet)}</b>{`: ${element.contentMeet ? `${element.contentMeet}` : ''}${element.join ? `. Thành phần: ${element.join}` : ''}${element.addressMeet ? `. Địa điểm: ${element.addressMeet}${element.preparedBy ? `. (${element.preparedBy})` : ''}` : `${element.preparedBy ? `.(${element.preparedBy})` : ''}`}`}
                </TableCell>
              </TableRow>,
            );
          }
        });
      }
      return data.length > 0
        ? data
        : !this.state.afterRender ?  [
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
        ] 
        : []
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
                    border: '1px solid rgba(224, 224, 224, 1)',
                  }}
                  colSpan={5}
                >
                 <b style={{fontWeight:"bold", margin:0, padding:0}}>{getTypeCalendar(element.typeCalendar)} {cutTimeMeet(element.timeMeet)}</b>{`:${element.contentMeet ? `${element.contentMeet}` : ''}${element.join ? `. Thành phần: ${element.join}` : ''}${element.addressMeet ? `. Địa điểm: ${element.addressMeet}${element.preparedBy ? `. (${element.preparedBy})` : ''}` : `${element.preparedBy ? `.(${element.preparedBy})` : ''}`}`}
                </TableCell>
              </TableRow>,
            );
          }
        });
      }
      return data.length > 0
        ? data
        :  !this.state.afterRender ? [
          <TableRow>
            <TableCell
              style={{
                textAlign: 'left',
                // border: '1px solid rgba(224, 224, 224, 1)',
                visibility: `${!hidden ? "visible" : "hidden"}`,
                borderRight: 'none',
                borderTop: 'none',
                width: '100vh',
              }}
              colSpan={5}
            >
              {''}
            </TableCell>
          </TableRow>,
        ] 
        : []
    };
    return (
      <div>
        {tabIndex === 5 ? (
          <div
            style={{
              width: '100%',
              flexDirection: 'row',
              //justifyContent:"flex-end",
              alignItems: 'flex-end',
              display:"none"
            }}
          >
            {this.state.tabCalendar === 1 && (
              <Table id='tableWeekCalendertableWeekCalender' style={{ textAlign: 'center', border: 'solid 1px #80808030', }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: 'left', width: 220 }}>
                      <Button style={{ cursor: 'pointer', marginLeft: 10 }}>
                      </Button>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 18, fontWeight: 'bold' }}>
                        Từ ngày {this.state.datePlan.startOf('week').format('DD/MM/YYYY')} đến{' '}
                        {this.state.datePlan.endOf('week').format('DD/MM/YYYY')}
                      </p>
                    </TableCell>
                    <TableCell style={{ textAlign: 'right', width: 220 }}>
                      <Button  style={{ cursor: 'pointer', marginRight: 10 }}>
                        
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.dayOfWeek.map((item, index) => {
                   
                    if(index === this.state.dayOfWeek.length -1){
                      if(!renderCalender && statusGetData){
                        setTimeout(() => {
                          this.setState({renderCalender: true, afterRender : true})
                        }, 2000);
                      }
                    }
                    return (
                      <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)',}}>
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
                          <TableRow style={{ border: '1px solid rgba(224, 224, 224, 1)',}}>
                            <TableCell
                              style={{
                                textAlign: 'left',
                                // border: '1px solid rgba(224, 224, 224, 1)',
                                borderRight: "none",

                              }}
                            >
                              Sáng
                            </TableCell>
                            <TableCell
                              style={{
                                textAlign: 'center',
                                padding: 0,
                                // border: '1px solid rgba(224, 224, 224, 1)',
                               
                              }}
                            >
                              {/* renderSang */}
                              {renderSang(index, false).map(el => {
                                return el;
                              })}
                            </TableCell>
                            {/* <TableCell
                              style={{
                                textAlign: 'center',
                                padding: 0,
                                //  border: '1px solid rgba(224, 224, 224, 1)',
                               
                              }}
                              className="tableremove-tableremove"
                            >
                              
                              {renderSang(index, true).map(el => {
                                return el;
                              })}
                            </TableCell>  */}
                             
                            
                            
                          </TableRow>





                          {/* chiều */}
                          <TableRow>
                            <TableCell
                              style={{
                                textAlign: 'left',
                                // borderRight: '1px solid rgba(224, 224, 224, 1)',
                                // borderLeft: '1px solid rgba(224, 224, 224, 1)',
                                // border: '1px solid rgba(224, 224, 224, 1)',
                              }}
                            >
                              Chiều
                            </TableCell>
                            <TableCell style={{ textAlign: 'center', padding: 0, borderRight: 'none',
                            // border: '1px solid rgba(224, 224, 224, 1)', 
                            }}>
                              {renderChieu(index, false).map(el => el)}
                            </TableCell>
                             {/* <TableCell
                              style={{
                                textAlign: 'center',
                                padding: 0,
                                // borderRight: '1px solid rgba(224, 224, 224, 1)',
                                //  border: '1px solid rgba(224, 224, 224, 1)',
                              }}
                              className="tableremove-tableremove"
                            >
                              {renderChieu(index, true).map(el => el)}
                            </TableCell>   */}
                            
                            
                          </TableRow>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        ) : null}
      </div>
    );
  }


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
