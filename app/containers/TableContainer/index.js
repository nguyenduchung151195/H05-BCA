/**
 *
 * TableContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Button,
  Fab,
  FormControlLabel,
  Checkbox,
  Menu,
  Paper,
} from '@material-ui/core';
import {
  SortingState,
  SelectionState,
  PagingState,
  CustomPaging,
  SearchState,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedFiltering,
  IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  TableFixedColumns,
  PagingPanel,
  TableSelection,
  SearchPanel,
  Toolbar,
} from '@devexpress/dx-react-grid-material-ui';
import { Add, Edit, Delete, Visibility, ImportExport, Print } from '@material-ui/icons';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTableContainer from './selectors';
import reducer from './reducer';
import saga from './saga';


/* eslint-disable react/prefer-stateless-function */
export class TableContainer extends React.Component {
  render() {
    const pagingPanelMessages = {
      showAll: 'Alle',
      rowsPerPage: 'Số dòng hiển thị',
      info: '{from} - {to} của {count} ',
    };
    return (
      <div>
        <Paper>
          <Grid rows={newRows} columns={columns}>
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={this.changeCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={this.changePageSize}
            />
            <SortingState />
            <SearchState defaultValue="" />
            <IntegratedFiltering />
            {this.props.enableDelete === false ? '' : <SelectionState selection={selection} onSelectionChange={this.changeSelection} />}
            {this.props.enableServerPaging === true ? <CustomPaging totalCount={this.props.pageDetail.totalCount} /> : ''}

            {this.props.enableServerPaging === true ? '' : <IntegratedPaging />}
            {this.props.enableDelete === false ? '' : <IntegratedSelection />}
            <IntegratedSorting />
            <DragDropProvider />
            <Table columnExtensions={tableColumnExtensions} />
            <TableHeaderRow showSortingControls cellComponent={HeaderCell} />

            <TableColumnReordering order={defaultOrder} onOrderChange={this.changeColumnOrder} />
            {this.props.enableDelete === false ? '' : <TableSelection showSelectAll />}
            {this.props.enableEdit ? <TableFixedColumns rightColumns={['actions']} /> : ''}
            <PagingPanel pageSizes={pageSizes} />

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
                            this.callBack('delete-click');
                          }}
                          size="small"
                          color="secondary"
                        >
                          <Delete />
                        </Fab>
                      ) : (
                        <div>
                          <Fab
                            className="mx-2"
                            onClick={() => {
                              this.callBack('add-click');
                            }}
                            size="small"
                            color="primary"
                            aria-label="Add"
                          >
                            <Add />
                          </Fab>
                          <Link to={`/import?type=${this.props.collectionCode}`}>
                            <Fab className="mx-2" size="small" color="primary" aria-label="Add">
                              <ImportExport />
                            </Fab>
                          </Link>

                          <Fab
                            onClick={() => {
                              this.setState({
                                open: true,
                              });
                            }}
                            size="small"
                            color="primary"
                            aria-label="Add"
                            className="ml-2"
                          >
                            <Visibility />
                          </Fab>
                        </div>
                      )}
                      <div className="clearfix" />
                    </div>
                  </div>
                  <div style={{ clear: 'both' }} />
                </div>
              )}
            />
            {/* <CustomSearchPanel inputComponent={SearchPanel.Input} /> */}
          </Grid>
        </Paper>
      </div>
    );
  }
}

TableContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  tableContainer: makeSelectTableContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'tableContainer', reducer });
const withSaga = injectSaga({ key: 'tableContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TableContainer);
