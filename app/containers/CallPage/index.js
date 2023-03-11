/**
 *
 * CallPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Dialog, Button, DialogContent, DialogActions } from '@material-ui/core';
import makeSelectCallPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getCustomerAction, resetNotis } from './actions';

import Call from '../../components/Call/Call';

/* eslint-disable react/prefer-stateless-function */
export class CallPage extends React.Component {
  state = {
    open: false,
    phoneNumber: null,
  };

  componentDidMount() {
    if (this.props.paramId) {
      this.props.onGetCustomer(this.props.paramId);
    }
  }

  componentWillReceiveProps(props) {
    // console.log(props);
    const { callPage } = props;

    this.setState({ phoneNumber: callPage.customerPhone });

    this.props.onResetNotis();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
    this.handleCreateLog();
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleCreateLog = () => {
    const { editData, dashboardPage } = this.props;
    const objectId = editData._id;
    const employee = {
      employeeId: dashboardPage.profile._id,
      name: dashboardPage.profile.name,
    };
    const content = `Gọi đến ${this.state.phoneNumber}`;
    this.props.onPostLog({ content, objectId, type: 'call', employee });
  };

  render() {
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          {this.props.title ? this.props.title : 'Gọi điện'}
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          {/* <DialogTitle id="alert-dialog-title">Tên khách hàng: Đỗ Thắng</DialogTitle> */}
          <DialogContent>
            <Call phoneNumber={this.state.phoneNumber !== 'nodata' ? this.state.phoneNumber : null} />
            {this.state.phoneNumber === 'nodata' ? <p style={{ color: 'red' }}>*Khách hàng này chưa có số điện thoại trên hệ thống</p> : ''}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Đóng bỏ
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

CallPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  callPage: makeSelectCallPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetCustomer: customerId => {
      dispatch(getCustomerAction(customerId));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'callPage', reducer });
const withSaga = injectSaga({ key: 'callPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CallPage);
