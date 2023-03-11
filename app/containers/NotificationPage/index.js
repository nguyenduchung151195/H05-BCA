/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-danger */
/**
 *
 * NotificationPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Paper,
  Grid as GridMatarialUI,
  TextField,
  MenuItem,
} from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withStyles } from '@material-ui/core/styles';
import makeSelectNotificationPage from './selectors';
import reducer from './reducer';
import request from 'utils/request';
import { API_COMMON_MODULE, API_NOTIFY } from 'config/urlConfig';
import saga from './saga';
import { getApproveAction, resetNotis, updateApproveAction } from './actions';
import ListPage from '../../components/List';
import _ from 'lodash';
import axios from 'axios';
import { Dialog as DialogUI, MakeCreateTaskRequest } from 'components/LifetekUi';

/* eslint-disable react/prefer-stateless-function */
const columns = [
  { name: 'title', title: 'Tên thông báo', checked: true, width: 400 },
  { name: 'subCodeText', title: 'Danh mục', checked: true, width: 400 },
  { name: 'date', title: 'Thời gian', checked: true, displayType: 'Datetime', width: 400 },
];

const styles = () => ({
  badge: {
    background: '#f37736',
    width: 16,
  },
  accepted: {
    background: '#7bc043',
    width: 16,
  },
  denied: {
    background: '#ee4035',
    width: 16,
  },
});

export class NotificationPage extends React.Component {
  state = {
    moduleList: null
  };

  componentWillMount() {
  }

  componentDidMount() {
    this.getModuleList();
  }

  componentWillReceiveProps(props) {
  }

  async getModuleList() {
    try {
      const res = await request(API_COMMON_MODULE, { method: 'GET' });
      const newModuleList = [];
      Object.keys(res).forEach(key => {
        if (key) {
          newModuleList.push({
            value: key,
            label: res[key].title
          })
        }
      });
      const allModule = [{ value: 'all', label: 'Tất cả' }, ...newModuleList.sort((a, b) => {
        if (a.label > b.label) return 1;
        return -1;
      })];
      this.setState({ moduleList: allModule, currentModuleCode: 'all' });
    } catch (e) {
      this.setState({ moduleList: [] });
    }
  }

  mapFunction = item => {
    const { moduleList } = this.state
    const { link = '' } = item

    const subCode = item.subCode || link.split('/')[0] || link.split('/')[1]
    const subCodeObj = moduleList.find(e => e.value === subCode)

    return {
      subCodeText: _.get(subCodeObj, 'label'),
      seen: !item.isRead && -1,
      ...item,
    }
  };

  render() {
    return (
      <div>
        <Paper className="p-4">
          <GridMatarialUI container>
            <GridMatarialUI item sm={2}>
              <TextField
                fullWidth
                id="outlined-select-currency"
                select
                value={this.state.currentModuleCode}
                margin="normal"
                variant="outlined"
                onChange={event => {
                  this.setState({ currentModuleCode: event.target.value });
                }}
              >
                {Array.isArray(this.state.moduleList) && this.state.moduleList.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </GridMatarialUI>
          </GridMatarialUI>

          <Paper>
            <ListPage
              disableSearch
              disableEdit
              disableAdd
              disableConfig
              columns={columns}
              apiUrl={`${API_NOTIFY}`}
              filter={(!this.state.currentModuleCode || this.state.currentModuleCode === 'all') ? null : {
                subCode: this.state.currentModuleCode
              }}
              mapFunction={this.mapFunction}
              onRowClick={item => {
                const token = localStorage.getItem('token');
                item.isRead = true;
                axios
                  .put(`${API_NOTIFY}/${item._id}`, item, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                  })
                  .then(() => {
                    this.setState({ open: false });
                    if (item.type === 'TaskRequest') {
                      this.setState({ openTaskRequest: true, taskRequestId: item.link });
                      return;
                    }
                    this.props.history.push(item.link);
                    localStorage.setItem(
                      'timeLineData',
                      JSON.stringify({
                        value: 1,
                        id: item._id,
                      }),
                    );
                  });
              }}
            />
          </Paper>
        </Paper>

        <DialogUI dialogAction={false} onClose={() => this.setState({ openTaskRequest: false })} open={this.state.openTaskRequest}>
          <MakeCreateTaskRequest taskRequestId={this.state.taskRequestId} />
        </DialogUI>
      </div>
    );
  }
}

NotificationPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  notificationPage: makeSelectNotificationPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onResetNotis: () => {
      dispatch(resetNotis());
    },
    onGetApprove: () => {
      dispatch(getApproveAction());
    },
    onSendApprove: (approve, result, user) => {
      dispatch(updateApproveAction(approve, result, user));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'notificationPage', reducer });
const withSaga = injectSaga({ key: 'notificationPage', saga });

export default compose(
  withStyles(styles),
  withReducer,
  withSaga,
  withConnect,
)(NotificationPage);
