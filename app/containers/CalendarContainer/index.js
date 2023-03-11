/**
 *
 * CalendarContainer
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, Month, Inject } from '@syncfusion/ej2-react-schedule';
import { extend } from '@syncfusion/ej2-base';
// import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import Paper from '@material-ui/core/Paper';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectCalendarContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getDataAction } from './actions';
import moment from 'moment';
import { API_MEETING_UPDATE_CALEN_DETAIL } from '../../config/urlConfig';
import _ from 'lodash';
// L10n.load({
//   'vn': {
//       'calendar': { today:'Hôm nay' }
//   }
//   });

function applyCategoryColor(args, currentView) {
  const categoryColor = args.data.CategoryColor;
  if (!args.element || !categoryColor) {
    return;
  }
  if (currentView === 'Agenda') {
    args.element.firstChild.style.borderLeftColor = categoryColor;
  } else {
    args.element.style.backgroundColor = categoryColor;
  }
}
/* eslint-disable react/prefer-stateless-function */
export class CalendarContainer extends React.Component {
  // dataManger = new DataManager({
  //   url: 'https://js.syncfusion.com/demos/ejservices/api/Schedule/LoadData',
  //   adaptor: new WebApiAdaptor(),
  //   crossDomain: true,
  // });
  state = {
    params: [],
    // dateTime: new Date(),
    data: [],
    kanbanStatus: {},
    timeStart: moment()
      .startOf('months')
      .format('YYYY/MM/DD'),
    timeEnd: moment()
      .endOf('months')
      .format('YYYY/MM/DD'),
    count: 0,
  };

  onGetData() {
    fetch(`${API_MEETING_UPDATE_CALEN_DETAIL}/get-by-time?isOrg=true&timeStart=${this.state.timeStart}&timeEnd=${this.state.timeEnd}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          let newData = [];
          data.data.map((item, index) => {
            item.calenDetail.map((element, idx) => {
              // newData.push(...this.state.data, ...element);
              newData.push( ...element);

            });
          });
          let datas = [];
          _.uniq(newData).map((item, index) => {
            datas.push({
              ...item,
              Id: item._id,
              Subject: item.contentMeet,
              StartTime: `${moment(item.time).format('YYYY/MM/DD')} ${item.timeMeet && item.timeMeet.slice(0, 5)}`,
              EndTime: `${moment(item.time).format('YYYY/MM/DD')} 
              ${
                item.timeMeet && item.timeMeet.slice(6, 11).indexOf('_') === -1
                  ? item.timeMeet && item.timeMeet.slice(6, 11)
                  : parseInt(item.timeMeet && item.timeMeet.slice(0, 2)) < 12
                    ? '11:59'
                    : '23:59'
              }`,
              CategoryColor: '#357cd2',
            });
          });
          this.setState({ data: _.uniq(datas) , count:1});
        }
      });
  }

  handleGetData = e => {
    const { params } = e.query;
    console.log("handleGetData :",params[0].value, moment(params[0].value).format('YYYY/MM/DD'))

    this.setState({
      timeStart: moment(params[0].value).format('YYYY/MM/DD'),
      timeEnd: moment(params[1].value).format('YYYY/MM/DD'),
      count: 2,
    });
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log("hahhaha")
  //   if (this.state.count !== 1 || nextState.data !== this.state.data) {
  //     console.log("hahhaha 1")

  //     if (nextState.timeStart !== this.state.timeStart || nextState.timeEnd !== this.state.timeEnd) {
  //       console.log("hahhaha 3")

  //       this.setState({ data: [] });
  //       this.onGetData();
  //     }
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  componentDidUpdate(preProps, preState){
    console.log("hahhaha : ", preState)
    if (this.state.count !== 1 || preState.data !== this.state.data) {
      console.log("hahhaha 1")
      if (preState.timeStart !== this.state.timeStart || preState.timeEnd !== this.state.timeEnd) {
        console.log("hahhaha 3")
        // this.setState({ data: [] , count:1});
        this.onGetData();
      }
    } 
  }
  componentDidMount() {
    this.onGetData();
    this.setState({ count: 1 });
    let sortedKanbanStatus = [];
    if (this.props.code) {
      const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
      let listStatus = [];
      const currentStatusIndex = listCrmStatus.findIndex(d => d.code === this.props.code);
      if (currentStatusIndex !== -1) {
        listStatus = listCrmStatus[currentStatusIndex].data;
      } else {
        // eslint-disable-next-line no-alert
        alert('Trạng thái kanban đã bị xóa');
      }

      const laneStart = [];
      const laneAdd = [];
      const laneSucces = [];
      const laneFail = [];
      listStatus.forEach(item => {
        switch (item.code) {
          case 1:
            laneStart.push({
              id: item._id,
              title: item.name,
              color: item.color,
            });
            break;
          case 2:
            laneAdd.push({
              id: item._id,
              title: item.name,
              color: item.color,
            });
            break;

          case 3:
            laneSucces.push({
              id: item._id,
              title: item.name,
              color: item.color,
            });
            break;

          case 4:
            laneFail.push({
              id: item._id,
              title: item.name,
              color: item.color,
            });
            break;

          default:
            break;
        }
      });
      sortedKanbanStatus = { lanes: [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail] };
    }
    this.setState({ kanbanStatus: JSON.parse(JSON.stringify(sortedKanbanStatus)) });
  }

  onEventRendered(args) {
    applyCategoryColor(args, this.scheduleObj.currentView);
  }

  handleClickDay = e => {
    if (e.type === 'DeleteAlert') {
      e.cancel = true;
      if (this.props.handleDelete) {
        this.props.handleDelete();
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

  render() {
    return (
      <Paper>
        {
          console.log(this.state.data, 'this.state.data')
        }
        <ScheduleComponent
          // locale="vn"
          // id="calendar"
          currentView="Month"
          width="100%"
          height="650px"
          // selectedDate={this.state.dateTime}
          eventSettings={{ dataSource: extend([], this.state.data, null, true) }}
          // eslint-disable-next-line react/jsx-no-bind
          eventRendered={this.onEventRendered.bind(this)}
          ref={schedule => (this.scheduleObj = schedule)}
          readonly
          popupOpen={this.handleClickDay}
          dataBinding={this.handleGetData}
        >
          <Inject services={[Day, Week, Month]} />
          <ViewsDirective>
            {!this.props.disabledOption && (
              <>
                <ViewDirective option="Day" displayName="Ngày" />
                <ViewDirective option="Week" displayName="Tuần" />
              </>
            )}
            <ViewDirective option="Month" displayName="Tháng" />
          </ViewsDirective>
        </ScheduleComponent>
      </Paper>
    );
  }
}

CalendarContainer.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  calendarContainer: makeSelectCalendarContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetData: (query, queryProps) => {
      dispatch(getDataAction(query, queryProps));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'calendarContainer', reducer });
const withSaga = injectSaga({ key: 'calendarContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CalendarContainer);
