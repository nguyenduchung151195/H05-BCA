/**
 *
 * ImportItemsPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Dialog, DialogActions, DialogContent, DialogContentText, Button, DialogTitle } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import dot from 'dot-object';
import makeSelectImportItemsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

import { getAllItemsAct, deleteItemsAct, resetNotiAct } from './actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import { serialize } from '../../utils/common';
import ListPage from '../../components/List';
import { API_ORDER_PO } from '../../config/urlConfig';

/* eslint-disable react/prefer-stateless-function */
export class ImportItemsPage extends React.Component {
  state = {
    itemsList: [],
    onDelete: false,
    arrDelete: [],
    pageDetail: {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    },
  };

  // componentWillMount() {
  //   this.props.onGetAllItems({ limit: 10, skip: 0 });
  // }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { importItemsPage } = props;
      const itemsList = importItemsPage.itemsList || [];
      this.state.pageDetail.totalCount = importItemsPage.count || 0;
      this.state.pageDetail.currentPage = Number(importItemsPage.skip || 0) || 0;
      this.state.pageDetail.pageSize = importItemsPage.limit || 0;
      this.setState({ itemsList });
    }
  }

  componentDidUpdate(props) {
    const { importItemsPage } = props;
    if (importItemsPage.successDelete) {
      this.props.onResetNoti();
      this.state.onDelete = false;
    }
  }
  mapFunction = item => {
    return {
      ...item,
      "createdBy.employeeId" : item.createdByCode ? item.createdByCode : null,
      // createdBy :item.createdByName ? item .createdByName : null,
      "exchangingAgreement.exchangingAgreementId": item.exchangingAgreementCode ? item.exchangingAgreementCode : null,
      "supplier.supplierId":item.supplierCode ? item.supplierCode : null
    };
  };

  render() {
    const { importItemsPage } = this.props;
    const { itemsList } = this.state;
    const newItemsList = itemsList.map(item => dot.dot(item));

    return (
      <div>
        <Helmet>
          <title>Nhập hàng</title>
          <meta name="description" content="Description of ImportItemsPage" />
        </Helmet>
        {importItemsPage.loading ? <LoadingIndicator /> : null}
        <Grid container>
          {/* <Grid item md={12}>
            <TextField
              label="Loại"
              name="type"
              select
              value={this.state.type}
              onChange={this.handleChange('type')}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ width: '20%' }}
              color="primary"
              margin="normal"
            >
              <MenuItem value={-1}>Tất cả</MenuItem>
              <MenuItem value={0}>Đơn đặt hàng</MenuItem>
              <MenuItem value={1}>Đặt hàng PO</MenuItem>
              <MenuItem value={2}>Trả hàng</MenuItem>
              <MenuItem value={3}>Nhập hàng</MenuItem>
              <MenuItem value={4}>Chuyển kho</MenuItem>
            </TextField>
          </Grid> */}
          <Grid item md={12}>
          <ListPage
            onEdit = {this.handleEditClick}
            showDepartmentAndEmployeeFilter
            apiUrl={API_ORDER_PO}
            exportExcel
            code="OrderPo"
            kanbanKey="_id"
            withPagination
            mapFunction={this.mapFunction}
          />
          </Grid>
        </Grid>
        <Dialog
          open={this.state.onDelete}
          onClose={this.handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Đồng chí có chắc chắn muốn xóa không?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => this.handleDelete()}>
              Đồng ý
            </Button>
            <Button variant="contained" onClick={this.handleCloseDelete} color="secondary">
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  onGetAllItemsCustom = params1 => {
    let query = '';
    if (this.props.isTrading && this.props.editData) {
      localStorage.setItem('traddingItem', JSON.stringify({ exchangingAgreementId: this.props.editData._id, name: this.props.editData.name }));
      const filter = {
        filter: {
          'exchangingAgreement.exchangingAgreementId': this.props.editData._id || '',
        },
        ...params1,
      };
      query = serialize(filter);
    } else {
      query = serialize(params1);
    }
    this.props.onGetAllItems(query);
  };

  handleDelete = () => {
    this.props.onDelete({ ids: this.state.arrDelete, limit: 10, skip: 0 });
  };

  handleCloseDelete = () => {
    this.setState({ onDelete: false });
  };

  handleDeleteClick = item => {
    const { itemsList } = this.state;
    const arrDelete = [];
    item.forEach(n => {
      arrDelete.push(itemsList[n]._id);
    });
    this.setState({ onDelete: true, arrDelete });
  };

  // handleChange = name => e => {
  //   const params = {
  //     filter: {
  //       type: e.target.value,
  //     },
  //   };
  //   if (Number(e.target.value) === -1) {
  //     this.props.onGetAllItems('');
  //   } else {
  //     this.props.onGetAllItems(serialize(params));
  //   }
  //   this.setState({ [name]: e.target.value });
  // };

  handleAddClick = () => {
    this.props.history.push('/crm/OrderPo/add');
  };

  handleEditClick = item => {
    const { history } = this.props;
    history.push(`/crm/OrderPo/edit/${item._id}`);
  };
}

ImportItemsPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  importItemsPage: makeSelectImportItemsPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllItems: params => {
      dispatch(getAllItemsAct(params));
    },
    onDelete: body => {
      dispatch(deleteItemsAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNotiAct());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'importItemsPage', reducer });
const withSaga = injectSaga({ key: 'importItemsPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ImportItemsPage);
