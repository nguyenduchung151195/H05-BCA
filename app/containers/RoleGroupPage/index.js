/**
 *
 * RoleGroupPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  TableColumnResizing,
  TableFixedColumns,
  SearchPanel,
  Toolbar as ToolbarUI,
} from '@devexpress/dx-react-grid-material-ui';
import { NavLink, Link } from 'react-router-dom';
import {
  Button,
  TablePagination,
  Checkbox,
  Menu,
  MenuItem,
  InputAdornment,
  Fab,
  Typography,
  TextField as MuiTextField,
  Paper,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab as Fa,
  Tooltip,
  TextField,
} from '@material-ui/core';
import _ from 'lodash';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import { clearWidthSpace } from 'utils/common';
import GridUI from '@material-ui/core/Grid';
import { Settings, Edit, Delete, Close, Add, FilterList } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import ModelTableDisplaySetting from '../../components/ModelTableDisplaySetting';
import makeSelectRoleGroupPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { getRoleGroupAction, deleteRoleGroupAct, defaultAction } from './actions';
import { IntegratedFiltering, IntegratedSorting, SearchState } from '@devexpress/dx-react-grid';
import { Plugin } from '@devexpress/dx-react-core';
/* eslint-disable react/prefer-stateless-function */



const TextFieldUI = props => <MuiTextField {...props} />;
TextFieldUI.defaultProps = {
  size: 'small',
};
let allId = [];
export class RoleGroupPage extends React.Component {
  constructor(props) {
    super(props);
    this.timeout = 0;
    this.state = {
      count: 0,
      onDelete: false,
      columns: [{ name: 'code', title: 'Mã vai trò' }, { name: 'name', title: 'Tên vai trò' }, { name: 'description', title: 'Mô tả' }], // các cột được hiển thị
      // defaultOrder: [], // sắp xếp thứ tự hiển thị của các cột
      defaultColumnWidths: [
        { columnName: 'checkbox', width: 200 },
        { columnName: 'code', width: 200 },
        { columnName: 'name', width: 500 },
        { columnName: 'description', width: 500 },
        { columnName: 'action', width: 90 },
      ], // chiều ngang mặc định của các cột

      columnOrder: ['code', 'name', 'description', 'action'],
      //   pageSizes: [5, 10, 15],
      rowsPerPage: 10, // số hàng hiển thị trên một bảng
      page: 0, // trang hiện tại
      openDialogTableSetting: false, // hiển thị dialog
      selected: [], // các hàng được lựa chọn
      rightColumns: ['action'], // cột fixed bên phải
      anchorEl: null,
      filters: ['name', 'code'],
      roleData: [],
      roleDataTemp: [],
      search: '',
      dataSearch: [{ name: 'code', title: 'Mã vai trò' }, { name: 'name', title: 'Tên vai trò' }]
    };
  }

  componentDidMount() {
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
  }

  componentDidUpdate(preProps, preState) {
    if (preState.search !== this.state.search || preState.filters !== this.state.filters) {
      const { search, roleData, filters, roleDataTemp } = this.state
      let data = []
      //console.log(filters, "filters")
      if (search !== '') {
        if (filters.length > 0) {
          filters.forEach(item => {
            data.push(roleDataTemp.length > 0 && roleDataTemp.filter(items => {
              if (
                this.removeVietnameseTones(items[item].toLowerCase()).includes(this.removeVietnameseTones(search.toLowerCase()))
              ) return true
            }))
          })
        }
        if (filters.length === 2) {
          data = data[0] && data[1] && data[0].concat(data[1])
          const newData = _.union(data)
          this.setState({ roleData: newData })
        }
        else {
          const newData = _.union(data)
          this.setState({ roleData: newData[0] })
        }
      } else (
        this.setState({ roleData: roleDataTemp })
      )
    }
    else if (this.state.count === 0 && this.props && this.props.roleGroupPage && this.props.roleGroupPage.success === true) {
      this.setState({ roleData: this.props.roleGroupPage.roleGroups, roleDataTemp: this.props.roleGroupPage.roleGroups, count: this.state.count + 1 })
    }
    else if (preProps.roleGroupPage && this.props.roleGroupPage && preProps.roleGroupPage !== this.props.roleGroupPage) {
      this.setState({ roleData: this.props.roleGroupPage.roleGroups, roleDataTemp: this.props.roleGroupPage.roleGroups })
    }
  }
  removeVietnameseTones = str => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    str = str.replace(/\u02C6|\u0306|\u031B/g, '');
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
    return str;
  };

  componentDidMount() {
    this.props.onGetRoleGroup();
    this.setState({ roleData: this.props.roleGroupPage.roleGroups, roleDataTemp: this.props.roleGroupPage.roleGroups })
  }

  componentWillReceiveProps(props) {
    if (props.roleGroupPage.successDelete) {
      this.state.onDelete = false;
      this.state.selected = [];
      this.props.onResetNotic();
    }
  }

  closeFilter = () => {
    this.setState({ anchorEl: null });
  };

  selectField = name => () => {
    const { filters } = this.state;
    const index = filters.indexOf(name);
    if (index === -1) {
      const newFilter = filters.concat(name);
      this.setState({ filters: newFilter });
    } else {
      const newFilter = filters.filter((it, id) => id !== index);
      this.setState({ filters: newFilter });
    }
  };

  handleSearch = e => {
    e.target.value = clearWidthSpace(e.target.value).trimStart();
    const search = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ search: search.toLowerCase() });
    }, 500);
  };

  render() {
    const Fab = props => <Fa {...props} />;
    Fab.defaultProps = {
      size: 'large',
      color: 'primary',
      style: { margin: '5px', float: 'right', boxShadow: 'none', padding: 0, margin: ' 0 5px', minHeight: 35, height: 35, width: 35 },
    };
    const { classes, roleGroupPage, intl } = this.props;
    // console.log(roleGroupPage.roleGroups);
    const { rowsPerPage, page, columns, columnOrder, anchorEl, filters, dataSearch, roleData } = this.state;
    // const nameAdd = this.props ? this.props : this.props.match.path;
    // const stock = nameAdd.match.path;
    // const addStock = stock.slice(stock.length - 9, nameAdd.length);
    allId = [];
    const newRows = _.chunk(
      _.map(roleData, row => {
        const action = (
          <Fab
            component={NavLink}
            to={`/setting/roleGroup/edit/${row._id}`}
            size="small"
            title="Chỉnh sửa"
            style={{ marginLeft: 10 }}
            color="primary"
            onClick={this.handleEdit}
          >
            <Edit color="default" />
          </Fab>
        );
        const checkbox = this.addCheckbox(row._id);
        allId.push(row._id);
        return { ...row, action, checkbox };
      }),
      this.state.rowsPerPage,
    )[this.state.page];

    const newColumns = [...columns, { name: 'checkbox', title: this.addCheckboxAll() }, { name: 'action', title: 'Cập nhật' }];
    return (
      <div>
        {/* <AppBar className={classes.HeaderAppBarRoleGroup}>
              <Toolbar>
                <IconButton
                  className={classes.BTNRoleGroup}
                  color="inherit"
                  variant="contained"
                  onClick={()=> this.props.history.goBack()}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                  {addStock === "roleGroup"
                    ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`}
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={this.saveTemplate}
                >
                  {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                </Button>
              </Toolbar>
            </AppBar> */}
        <Helmet>
          <title>Nhóm quyền </title>
          <meta name="description" content="Description of RoleGroupPage" />
        </Helmet>
        {/* <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting/Employee">
              Danh sách Cán bộ
            </Link>
            <Typography color="textPrimary">Danh sách vai trò</Typography>
          </Breadcrumbs>
        </Paper> */}
        <MenuFilter
          selectField={this.selectField}
          closeFilter={this.closeFilter}
          anchorEl={anchorEl}
          filters={filters}
          dataSearch={dataSearch}
        />

        <GridUI container>
          <GridUI item md={4} style={{ paddingRight: 30, padding: 5 }} >
            <TextFieldUI
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment style={{ cursor: 'pointer' }} position="end">
                    <FilterList onClick={e => this.setState({ anchorEl: e.currentTarget })} />
                  </InputAdornment>
                ),
              }}
              placeholder="Tìm kiếm ..."
              ref={input => (this.search = input)}
              onChange={this.handleSearch}
            />
          </GridUI>
          <GridUI item md={12} xs={12} style={{ paddingRight: 30, padding: 10 }} justifyContent="flex-end" >
            {/* <Button component={NavLink} to="/setting/roleGroup/add" style={{ marginBottom: 10, marginRight: 10 }} variant="outlined" color="primary">
              Thêm mới
            </Button> */}
            <Fab>
              <Link to="/setting/roleGroup/add">
                <Tooltip title="Thêm mới">
                  <Add style={{ color: 'white', fontSize: 24 }} />
                </Tooltip>
              </Link>
            </Fab>
            {this.state.selected.length !== 0 ? (
              <Fab size="small" title="Xóa mục đã chọn" color="secondary">
                <Tooltip title="Xóa">
                  <Delete style={{ color: 'white' }} onClick={this.handleDeleteDialog} />
                </Tooltip>

              </Fab>
            ) : null}
            {/* <GridUI container  item md={1}>
            {this.state.selected.length !== 0 ? (
              <Fab size="small" title="Xóa mục đã chọn" style={{ marginRight: 10 }} color="secondary" onClick={this.handleDeletes}>
                <Delete style={{ color: 'white' }} onClick={this.handleDeleteDialog} />
              </Fab>
            ) : null}
            <Fab size="small" title="Thiết lập hiển thị" onClick={() => this.handleChangeDialogTableSetting(this.state.openDialogTableSetting)}>
              <Settings />
            </Fab>
          </GridUI> */}
          </GridUI>
        </GridUI>
        <Paper className={classes.tableContainer} id="table-full-width">
          {newRows && (
            <Grid rows={newRows} columns={newColumns} style={{ width: '100%' }}>
              <DragDropProvider />
              <SearchState value={this.state.searchText} />
              <IntegratedFiltering />
              {/* <IntegratedSorting /> */}

              <Table />
              {columnOrder.length !== 0 ? <TableColumnReordering defaultOrder={columnOrder} /> : null}
              {columnOrder.length !== 0 ? <TableColumnResizing defaultColumnWidths={this.state.defaultColumnWidths} /> : null}

              <TableHeaderRow
                contentComponent={({ children, ...restProps }) => (
                  <TableHeaderRow.Content {...restProps} style={{ fontWeight: 'bold', ...(restProps.style || {}) }}>
                    {children}
                  </TableHeaderRow.Content>
                )}
              />
              <TableFixedColumns rightColumns={this.state.rightColumns} />
            </Grid>
          )}
          <TablePagination
            rowsPerPageOptions={[10, 50, 100]}
            component="div"
            count={roleGroupPage.roleGroups.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Trang trước',
            }}
            nextIconButtonProps={{
              'aria-label': 'Trang tiếp theo',
            }}
            labelRowsPerPage="Hiển thị: "
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>

        <ModelTableDisplaySetting
          handleChangeDialogTableSetting={this.handleChangeDialogTableSetting}
          columns={this.state.columns}
          openDialogTableSetting={this.state.openDialogTableSetting}
        />
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
            <Button variant="contained" onClick={this.handleCloseDelete} color="secondary" autoFocus>
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleCloseDelete = () => {
    this.setState({ onDelete: false });
  };

  handleDeleteDialog = () => {
    this.setState({ onDelete: true });
  };

  handleDelete = () => {
    const { selected } = this.state;
    this.props.onDelete(selected);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  addCheckbox = id => <Checkbox checked={this.state.selected.includes(id)} color="primary" value={id} onClick={() => this.handleSelect(id)} />;

  addCheckboxAll = () => <Checkbox checked={this.state.selectAll} onClick={() => this.handleSelectAll()} />;

  // Thay đổi số dòng trên một trang
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleSelectAll = () => {
    const selectAll = !this.state.selectAll;
    if (this.state.selectAll) {
      this.setState({ selected: [], selectAll });
    } else {
      this.setState({ selected: allId, selectAll });
    }
  };

  // Thay đổi các trường hiện trên table
  handleChangeDialogTableSetting = open => {
    this.setState({ openDialogTableSetting: !open });
    // if (save) {
    //   console.log(save);
    //   // body.columns = this.state.columns.filter(item => item.name !== 'checkbox' && item.name !== 'stt' && item.name !== 'action');
    // }
  };

  handleSelect = id => {
    const { selected } = this.state;
    const index = this.state.selected.findIndex(i => i === id);
    if (index === -1) selected.push(id);
    else selected.splice(index, 1);
    this.setState({ selected });
  };
}

const MenuFilter = React.memo(({ anchorEl, closeFilter, selectField, filters, dataSearch }) => {
  return (
    <Menu keepMounted open={Boolean(anchorEl)} onClose={closeFilter} anchorEl={anchorEl}>
      <MenuItem>
        <Typography style={{ fontSize: 15, fontWeight: 'bold', textTransform: 'uppercase' }}>Chọn trường tìm kiếm</Typography>
      </MenuItem>
      {dataSearch &&
        dataSearch.map(i => (
          <MenuItem key={i.name} value={i.name}>
            <Checkbox color="primary" checked={filters.includes(i.name)} onClick={selectField(i.name)} />{' '}
            <Typography style={{ fontSize: 14 }}>{i.title}</Typography>
          </MenuItem>
        ))}
    </Menu>
  );
});

RoleGroupPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roleGroupPage: makeSelectRoleGroupPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetRoleGroup: (filter) => dispatch(getRoleGroupAction(filter)),
    onDelete: body => dispatch(deleteRoleGroupAct(body)),
    onResetNotic: body => dispatch(defaultAction(body)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'roleGroupPage', reducer });
const withSaga = injectSaga({ key: 'roleGroupPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(RoleGroupPage);
