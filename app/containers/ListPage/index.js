/**
 *
 * ListPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Fab as Fa, TablePagination, Checkbox, InputAdornment, Button, Dialog as DialogUI, DialogActions, DialogContent } from '@material-ui/core';
import { Visibility, Delete, ImportExport, Add, Edit, Search } from '@material-ui/icons';
import { SortingState, IntegratedSorting, IntegratedFiltering } from '@devexpress/dx-react-grid';
import { Grid, DragDropProvider, Table, TableHeaderRow, TableColumnReordering, TableFixedColumns } from '@devexpress/dx-react-grid-material-ui';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/ItemGrid';
import { Link } from 'react-router-dom';
import Dialog from 'components/Modal/DialogAsync';
import { Component, TextField } from 'components/LifetekUi';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectListPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { handleDelete, setState, getRows, putViewConfig } from './actions';

let allId = [];

const Fab = props => <Fa size="small" color="primary" {...props} style={{ margin: '5px', float: 'right' }} />;

/* eslint-disable react/prefer-stateless-function */
export class ListPage extends Component {
  constructor(props) {
    super(props);
    this.setStateStore = this.props.setStateStore;
    this.state = {
      columns: [],
      columnOrder: [],
      importExport: this.props.importExport ? `/import?type=${this.props.importExport}` : this.props.code ? `/import?type=${this.props.code}` : null,
    };
  }

  componentDidMount() {
    if (this.props.code) {
      const code = this.props.code;
      const view = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === code);
      const columns = view.editDisplay.type.fields.type.columns.filter(item => ['String', 'Number', 'ObjectId', 'Date'].includes(item.type));
      const columnOrder = columns
        .sort((a, b) => a.order - b.order)
        .map(item => item.name)
        .concat('edit');
      this.setState({ columns, columnOrder });
    }
    this.props.getRows(this.props.apiUrl, this.props.mapFunction, this.props.filterFunction);
  }

  componentWillReceiveProps(props) {
    if (this.props.apiUrl !== props.apiUrl) {
      this.props.getRows(props.apiUrl, this.props.mapFunction, this.props.filterFunction);
    }
  }

  addCheckbox = id => (
    <Checkbox color="primary" onClick={() => this.handleSelect(id)} value={id} checked={this.props.listPage.selected.includes(id)} />
  );

  addCheckboxAll = () => <Checkbox onClick={() => this.handleSelectAll()} checked={this.props.listPage.selectAll} />;

  // Popover

  addAction = row => (
    <button type="button" style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={e => this.handlePop(e)}>
      Xem chi tiết {row.action}
    </button>
  );

  changeColumnOrder = newOrder => {
    const columns = this.state.columns;
    const newColumns = columns.map(item => ({ ...item, order: newOrder.indexOf(item.name) }));
    this.setState({ columnOrder: newOrder });
    this.props.saveConfig(newColumns, this.props.code);
  };

  handleSelect(id) {
    const { selected } = this.props.listPage;
    const index = this.props.listPage.selected.findIndex(i => i === id);
    if (index === -1) selected.push(id);
    else selected.splice(index, 1);
    this.setStateStore({ selected });
  }

  // Chọn tất cả
  handleSelectAll() {
    const selectAll = !this.props.listPage.selectAll;
    if (this.props.listPage.selectAll) {
      this.setStateStore({ selected: [], selectAll });
    } else {
      this.setStateStore({ selected: allId, selectAll });
    }
  }

  handleChange(e) {
    const { columns } = this.props.listPage;
    const currentColumn = columns.find(column => column.name === e.target.name);
    currentColumn.title = e.target.value;
    this.setStateStore({ columns });
  }

  handleDeleteItem = () => {
    this.setStateStore({ deleteDialog: false, selected: [] });
    if (this.props.listPage.selected.length !== 0) {
      const { selected } = this.props.listPage;
      const deleteUrl = this.props.deleteUrl ? this.props.deleteUrl : this.props.apiUrl;
      const apiUrl = this.props.apiUrl;
      const deleteOption = this.props.deleteOption ? this.props.deleteOption : 'ids';
      this.props.handleDelete(selected, deleteUrl, apiUrl, deleteOption);
    }
  };

  // Xử lý phân trang
  handleChangePage = (event, activePage) => {
    this.setStateStore({ activePage });
    const { perPage, onLoad } = this.props;
    onLoad && onLoad(activePage, perPage * activePage, perPage);
  };

  handleChangeRowsPerPage = event => {
    const { onLoad } = this.props;
    this.setStateStore({ activePage: 0, perPage: event.target.value });
    onLoad && onLoad(0, 0, event.target.value);
  };

  handlePage = page => this.setStateStore({ activePage: page });

  saveSetting = (columns, status) => {
    if (status) {
      this.setStateStore({ dialogStatus: false });
      this.setState({ columns });
      this.props.saveConfig(columns, this.props.code);
    } else {
      this.setStateStore({ columns, dialogStatus: false });
    }
  };

  handleSearch = e => {
    this.setStateStore({ search: e.target.value });
  };

  getUrl() {
    const res = window.location.pathname.split('/');
    const path = this.props.path ? this.props.path : res[res.length - 1];
    return path;
  }

  addEdit = (id, row) => {
    if (this.props.onEdit) {
      this.props.onEdit(row);
    } else {
      return (
        <Link to={`${this.getUrl()}/${id}`}>
          <Fab color="primary" size="small">
            <Edit />
          </Fab>
        </Link>
      );
    }
  };


  render() {
    const { rows, tableColumnExtensions, dialogStatus, activePage, perPage, search, rightColumns, deleteDialog } = this.props.listPage;
    const { mapFunction, filterFunction, customColumns, customRows, count, isReport = false, isUserPage = false, disabledPagination=false } = this.props;
    const { importExport } = this.state;
    const path = this.getUrl();
    const columns = this.props.columns ? this.props.columns : customColumns ? customColumns(this.state.columns) : this.state.columns;
    const columnOrder = this.state.columnOrder;
    let newRow = customRows ? customRows(rows) : rows;
    allId = [];
    const newFilter =
      newRow &&
      newRow
        .filter(filterFunction)
        .map(mapFunction)
        .filter(item =>
          Object.keys(item).some(
            key =>
              item[key]
                ? item[key]
                  .toString()
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
                : false,
          ),
        );
    let newRows = [];
    if (isReport) {
      newRows = [...newFilter];
    } else {
      newRows =
        this.props.disableEdit === true
          ? newFilter.slice(perPage * activePage, perPage * (activePage + 1)).map(row => {
            const checkbox = this.addCheckbox(row._id);
            allId.push(row._id);
            let obj = { ...row, checkbox };
            return obj;
          })
          : newFilter.slice(perPage * activePage, perPage * (activePage + 1)).map(row => {
            const checkbox = this.addCheckbox(row._id);
            const edit = this.addEdit(row._id, row);
            allId.push(row._id);
            return { ...row, checkbox, edit };
          });
    }
    let newColumns = [];
    if (isReport === false) {
      newColumns = this.props.disableEdit
        ? [{ name: 'checkbox', title: this.addCheckboxAll(), checked: true }, ...columns].filter(item => item.checked === true)
        : [{ name: 'checkbox', title: this.addCheckboxAll(), checked: true }, ...columns, { name: 'edit', title: 'Sửa', checked: true }].filter(
          item => item.checked === true,
        );
    } else {
      newColumns = [...columns]
    }

    return (
      <GridContainer>
        <GridItem md={6} sm={6}>
          <TextField
            placeholder="Tìm kiếm"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            value={search}
            onChange={this.handleSearch}
          />
        </GridItem>

        <GridItem md={6} sm={6} style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
          {this.props.listPage.selected.length !== 0 ? (
            <Fab color="secondary">
              <Delete onClick={() => this.setStateStore({ deleteDialog: true })} />
            </Fab>
          ) : null}
          {!this.props.disableAdd ? (
            <Fab style={{ margin: '5px' }} color="primary" size="small">
              <Link to={`${path}/add`}>
                {' '}
                <Add style={{ color: 'white' }} />
              </Link>
            </Fab>
          ) : null}

          {this.props.settingBar
            ? this.props.settingBar.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fab key={index + 1} style={{ margin: '5px' }} color="primary" size="small">
                {item}
              </Fab>
            ))
            : null}
          {this.props.code ? (
            <Fab onClick={() => this.setStateStore({ dialogStatus: true })} style={{ margin: '5px' }} color="primary" size="small">
              <Visibility />
            </Fab>
          ) : null}

          {importExport ? (
            <Link to={importExport}>
              <Fab style={{ margin: '5px' }} color="primary" size="small">
                <ImportExport />
              </Fab>
            </Link>
          ) : null}
        </GridItem>

        <GridItem md={12}>
          <Grid rows={newRows} columns={newColumns}>
            <DragDropProvider />
            <SortingState />
            <IntegratedFiltering />
            <IntegratedSorting />
            {/* <Table columnExtensions={tableColumnExtensions} /> */}
            <Table columnExtensions={this.props.columnExtension||tableColumnExtensions} />
            {this.props.code ? <TableColumnReordering order={columnOrder} onOrderChange={this.changeColumnOrder} /> : null}
            <TableHeaderRow showSortingControls />
            <TableFixedColumns rightColumns={rightColumns} />
          </Grid>
        </GridItem>
        {disabledPagination?(""):
        <GridItem style={{ justifyContent: 'flex-end', display: 'flex' }} md={12}>
          <table>
            <tbody>
              <tr>
                <TablePagination
                  rowsPerPageOptions={[10, 50, 100]}
                  colSpan={3}
                  count={count}
                  rowsPerPage={perPage}
                  page={activePage}
                  SelectProps={{
                    native: true,
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActionsWrapped}
                />
              </tr>
            </tbody>
          </table>
        </GridItem>}

        <Dialog
          saveSetting={(column, status) => this.saveSetting(column, status)}
          columns={columns}
          open={dialogStatus}
          onClose={() => this.setStateStore({ dialogStatus: false })}
        />

        <DialogUI onClose={() => this.setStateStore({ deleteDialog: false })} open={deleteDialog}>
          <DialogContent>
            {' '}
            <h4>Đồng chí có chắc chắn muốn xóa không?</h4>
          </DialogContent>
          <DialogActions>
            {' '}
            <Button variant="contained" color="primary" onClick={this.handleDeleteItem}>
              Đồng Ý
            </Button>
            <Button variant="contained" color="primary" onClick={() => this.setStateStore({ deleteDialog: false })}>
              Không
            </Button>
          </DialogActions>
        </DialogUI>
      </GridContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  listPage: makeSelectListPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    setStateStore: data => dispatch(setState(data)),
    handleDelete: (selected, deleteUrl, apiUrl, deleteOption) => dispatch(handleDelete(selected, deleteUrl, apiUrl, deleteOption)),
    getRows: url => dispatch(getRows(url)),
    saveConfig: (columns, code) => dispatch(putViewConfig(columns, code)),
  };
}

ListPage.defaultProps = {
  mapFunction: item => item,
  filterFunction: () => true,
};
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'listPage', reducer });
const withSaga = injectSaga({ key: 'listPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ListPage);
