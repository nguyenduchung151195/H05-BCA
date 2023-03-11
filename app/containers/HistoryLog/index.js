/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * HistoryLog
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PagingState, IntegratedPaging, SelectionState, IntegratedSelection } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel, TableSelection, Toolbar } from '@devexpress/dx-react-grid-material-ui';
import { PersonOutline, Delete } from '@material-ui/icons';
import { Avatar, Grid as GridMUI, Dialog, DialogContent, DialogActions, Button, TextField, MenuItem, Fab } from '@material-ui/core';
// import { Update, Visibility } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import lodash from 'lodash';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import moment from 'moment';
import makeSelectHistoryLog from './selectors';
import { getLogAct, deleteLogsAction } from './actions';
import reducer from './reducer';
import saga from './saga';
import EmployeeInfor from '../../components/EmployeeInfor';
const columns = [
  { name: 'customCreatedAt', title: 'Thời gian' },
  { name: 'customEmployee', title: 'Nhân viên' },
  { name: 'content', title: 'Thông tin chi tiết' },
  { name: 'type', title: 'Loại sự kiện' },
];
const CustomEmployee = props => (
  <div>
    {props.item.employee ? (
      <GridMUI container justify="center" alignItems="center">
        <GridMUI item sm={2}>
          {props.item.employee.avatar ? (
            <Avatar style={{ height: 32, width: 32, margin: 8 }} src={props.item.employee.avatar} />
          ) : (
            <Avatar style={{ height: 32, width: 32, margin: 8 }}>
              <PersonOutline />
            </Avatar>
          )}
        </GridMUI>
        <GridMUI item sm={10}>
          <span
            onClick={() => {
              props.nameClick(props.item.employee);
            }}
            className="text-primary"
            style={{ cursor: 'pointer' }}
          >
            {props.item.employee.name}
          </span>
        </GridMUI>
      </GridMUI>
    ) : (
      ''
    )}
  </div>
);
const CustomEvent = props => {
  if (String(props.item.type) === 'message') return <div>Tin nhắn</div>;
  if (String(props.item.type) === 'Reminder') return <div>Nhắc lịch</div>;
  if (String(props.item.type) === 'Meeting') return <div>Họp</div>;
  if (String(props.item.type) === 'view') return <div>Xem chi tiết</div>;
  if (String(props.item.type) === 'update') return <div>Cập nhật</div>;
  if (String(props.item.type) === 'create') return <div>Thêm mới</div>;
  if (String(props.item.type) === 'call') return <div>Gọi điện</div>;
  if (String(props.item.type) === 'task') return <div>Công việc</div>;
  if (String(props.item.type) === 'Visit') return <div>Thăm doanh nghiệp</div>;
  return <div />;
};
const CustomCreatedAt = props => {
  const date = moment(props.item.createdAt);
  const strDate = date.format('DD/MM/YYYY');
  const time = date.format('hh:mm');

  const today = moment()
    .endOf('day')
    .format('DD/MM/YYYY');
  const yesterday = moment()
    .subtract(1, 'days')
    .format('DD/MM/YYYY');
  // if()

  let formatStrDate = '';
  if (strDate === today) {
    formatStrDate = `Hôm nay, ${time}`;
  } else if (strDate === yesterday) {
    formatStrDate = `Hôm qua, ${time}`;
  } else {
    formatStrDate = `${strDate}, ${time}`;
  }

  return <div>{formatStrDate}</div>;
};
/* eslint-disable react/prefer-stateless-function */
export class HistoryLog extends React.Component {
  state = {
    logs: [],
    employeeData: {},
    originLogs: [],
    listEmployee: [],
    filter: {
      from: '',
      to: '',
      employeeId: 'all',
    },
    open: false,
    selection: [],
    tableColumnExtensions: [
      { columnName: 'customCreatedAt', width: 300 },
      { columnName: 'customEmployee' },
      { columnName: 'content', width: 700 },
      { columnName: 'type', width: 150 },
    ],
  };

  componentDidMount() {
    this.props.onGetLogs({
      objectId: this.props.generalData._id,
    });
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { historyLog } = props;
      if (historyLog.logs && historyLog.logs.length > 0) {
        this.state.logs = historyLog.logs.filter(d => d.type !== 'message');
        this.state.originLogs = this.state.logs;
        this.state.listEmployee = lodash.uniqBy(
          this.state.logs.map(item => {
            if (item.employee) return item.employee;
            return { _id: '' };
          }),
          '_id',
        );
      }
    }
  }

  showEmployee = data => {
    this.setState({ employeeData: data, open: true });
  };

  changeSelection = selection => this.setState({ selection });

  deleteLogs = () => {
    // eslint-disable-next-line no-restricted-globals
    const r = confirm('Đồng chí có muốn xóa những mục đã chọn?');
    if (r) {
      // console.log(this.state.selection);
      const ids = this.state.selection.map(item => this.state.logs[item]._id);
      // console.log(ids);
      this.props.onDeleteLogs(ids);
      this.state.selection = [];
    }
  };

  filterLog = name => event => {
    const { filter, originLogs } = this.state;
    filter[name] = event.target.value;

    const result = originLogs.filter(d => {
      const itemDate = moment(d.createdAt);
      let condition1 = true;
      let condition2 = true;
      let condition3 = true;
      if (d.employee && filter.employeeId !== d.employee._id && filter.employeeId !== 'all') {
        condition3 = false;
      }
      if (filter.from !== '') {
        const fromDate = moment(filter.from).startOf('day');
        if (fromDate >= itemDate) {
          condition1 = false;
        }
      }
      if (filter.to !== '') {
        const toDate = moment(filter.to).endOf('day');
        if (itemDate >= toDate) {
          condition2 = false;
        }
      }
      if (condition1 && condition2 && condition3) {
        return d;
      }
    });

    this.setState({ filter, logs: result });
  };

  render() {
    const { logs, filter, selection } = this.state;
    // eslint-disable-next-line prettier/prettier
    // console.log('AAAAA,',  this.state.listEmployee);
    // console.log('logs,', logs);
    const newRows = logs.map(item => {
      const newItem = Object.assign({}, item);
      newItem.customEmployee = <CustomEmployee nameClick={this.showEmployee} item={item} />;
      newItem.type = <CustomEvent item={item} />;
      newItem.customCreatedAt = <CustomCreatedAt item={item} />;
      if (newItem.content.includes('<div>')) {
        // eslint-disable-next-line react/no-danger
        newItem.content = <div dangerouslySetInnerHTML={{ __html: item.content }} />;
      }
      if (newItem.content[0] === '{') {
        const contentObj = JSON.parse(newItem.content);
        newItem.content = <div>{contentObj.content}</div>;
      }
      return newItem;
    });
    const pagingPanelMessages = {
      showAll: 'Alle',
      rowsPerPage: 'Số dòng hiển thị',
      info: '{from} - {to} của {count} ',
    };
    return (
      <div style={{ backgroundColor: 'white' }}>
        <GridMUI container className="p-3">
          <GridMUI item sm={3} className="px-2">
            <TextField
              name="from"
              type="date"
              label="Từ ngày"
              value={filter.from}
              margin="normal"
              variant="outlined"
              onChange={this.filterLog('from')}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </GridMUI>
          <GridMUI item sm={3} className="px-2">
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              name="to"
              type="date"
              label="Đến ngày"
              value={filter.to}
              margin="normal"
              variant="outlined"
              onChange={this.filterLog('to')}
            />
          </GridMUI>
          <GridMUI item sm={3} className="px-2">
            <TextField
              name="employeeId"
              label="Nhân viên"
              value={filter.employeeId}
              margin="normal"
              variant="outlined"
              select
              onChange={this.filterLog('employeeId')}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {this.state.listEmployee.map(option => {
                if (option.employeeId)
                  return (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  );
              })}
            </TextField>
          </GridMUI>
        </GridMUI>
        <Grid rows={newRows} columns={columns}>
          <PagingState defaultCurrentPage={0} pageSize={5} />
          <SelectionState selection={selection} onSelectionChange={this.changeSelection} />
          <IntegratedPaging />

          <IntegratedSelection />
          <Table columnExtensions={this.state.tableColumnExtensions} />
          <TableHeaderRow />
          <TableSelection showSelectAll />
          <PagingPanel messages={pagingPanelMessages} />
          <Toolbar
            rootComponent={({ children }) => (
              <div className="p-3">
                <div style={{ float: 'left' }}>{children}</div>
                <div style={{ float: 'right' }}>
                  <div className="text-right align-item-center">
                    {selection.length > 0 ? <span className="mx-3">Đã chọn: {selection.length}</span> : ''}

                    {selection.length > 0 ? (
                      <Fab
                        onClick={() => {
                          this.deleteLogs();
                        }}
                        size="small"
                        color="secondary"
                      >
                        <Delete />
                      </Fab>
                    ) : (
                      ''
                    )}
                    <div className="clearfix" />
                  </div>
                </div>
                <div style={{ clear: 'both' }} />
              </div>
            )}
          />
        </Grid>
        {this.state.open ? (
          <Dialog
            fullWidth
            maxWidth="lg"
            open={this.state.open}
            onClose={() => {
              this.setState({ open: false });
            }}
          >
            <DialogContent>
              <EmployeeInfor data={this.state.employeeData} />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  this.setState({ open: false });
                }}
                color="primary"
              >
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          ''
        )}
      </div>
    );
  }
}

HistoryLog.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  historyLog: makeSelectHistoryLog(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetLogs: query => {
      dispatch(getLogAct(query));
    },
    onDeleteLogs: ids => {
      dispatch(deleteLogsAction(ids));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'historyLog', reducer });
const withSaga = injectSaga({ key: 'historyLog', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HistoryLog);
