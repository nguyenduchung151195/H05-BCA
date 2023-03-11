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
import './style.css'
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
  };

  handleGetData = e => {
    const { params } = e.query;
    const { column, stage } = this.props;

    if (this.state.params.length !== 0) {
      if (params[0].value !== this.state.params[0].value) {
        const query = {
          url: this.props.url,
          filter: {
            stage: stage ? stage : null,
            filter: {
              [column.StartTime]: {
                $gte: `${params[0].value}`,
                $lte: `${params[1].value}`,
              },
            },
          },
        };

        this.props.onGetData(query, this.props.querySort);
        this.setState({
          params,
        });
      }
    } else {
      const query = {
        url: this.props.url,
        filter: {
          stage: stage ? stage : null,
          filter: {
            [column.StartTime]: {
              $gte: `${params[0].value}`,
              $lte: `${params[1].value}`,
            },
          },
        },
      };

      this.props.onGetData(query, this.props.querySort);
      this.setState({
        params,
      });
    }
  };

  componentDidMount() {
    let sortedKanbanStatus = [];
    if (this.props.code) {
      // console.log(this.props.code);
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

  componentWillReceiveProps(props) {
    if (props.querySort && props.querySort !== this.props.querySort) {
      // this.handleGetData();
      const { column } = this.props;
      const { params } = this.state;
      let query = {};
      if (this.state.params.length !== 0) {
        query = {
          url: this.props.url,
          filter: {
            filter: {
              [column.StartTime]: {
                $gte: `${params[0].value}`,
                $lte: `${params[1].value}`,
              },
            },
          },
        };
      } else
        query = {
          url: this.props.url,
          filter: {},
        };

      this.props.onGetData(query, props.querySort);
      // console.log(this.state.params);
    }
    if (props.calendarContainer.data !== this.props.calendarContainer.data) {
      const { column, source, sourceCode } = this.props;
      const items = props.calendarContainer.data.data || [];
      let colorSetting;
      if (source && sourceCode) {
        const dataConfig = JSON.parse(localStorage.getItem(source)) || null
        const config = dataConfig && dataConfig.find(item => item.code === sourceCode);
        if (config && config.data) {
          colorSetting = {};
          config.data.forEach(c => {
            colorSetting[c[this.props.sourceKey || '_id']] = c.color;
          });
        }
      }
      const newData = items.map(item => ({
        ...item,
        Id: item[column.Id],
        Subject: item[column.Subject],
        Location: item[column.Location],
        StartTime: item[column.StartTime],
        EndTime: item[column.EndTime],
        CategoryColor:
          colorSetting && colorSetting[item.kanbanStatus]
            ? colorSetting[item.kanbanStatus]
            : item[column.CategoryColor]
              ? item[column.CategoryColor]
              : this.state.kanbanStatus.lanes
                ? this.state.kanbanStatus.lanes[item.kanbanStatus]
                  ? this.state.kanbanStatus.lanes[item.kanbanStatus].color
                  : '#357cd2'
                : '#357cd2',
      }));
      this.setState({ data: newData });
    }
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
            <ViewDirective option="Day" displayName="Ngày" />
            <ViewDirective option="Week" displayName="Tuần" />
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
