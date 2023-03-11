/**
 *
 * ListOfCustomer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import classNames from 'classnames';
import { Grid, DragDropProvider, Table, TableHeaderRow, TableColumnReordering, TableColumnResizing } from '@devexpress/dx-react-grid-material-ui';
import { NavLink } from 'react-router-dom';
import { SortingState, IntegratedSorting, IntegratedFiltering } from '@devexpress/dx-react-grid';
import { Button, TablePagination, Checkbox, Fab, Paper, TextField, Menu, MenuItem, ListItemIcon, CheckBox, ListItemText } from '@material-ui/core';
import GridUI from '@material-ui/core/Grid';
import { Settings, Edit, Delete, ViewList, TableChart, CloudDownload, DeleteForever, Timeline } from '@material-ui/icons';
import ModelTableDisplaySetting from '../ModelTableDisplaySetting';
// import { FormattedMessage } from 'react-intl';

let allId = [];

/* eslint-disable react/prefer-stateless-function */
class ListOfCustomer extends React.Component {
  state = {
    columns: [
      { name: 'id', title: 'ID' },
      { name: 'name', title: 'Tên' },
      { name: 'email', title: 'Email' },
      { name: 'phone', title: 'Số điện thoại' },
      { name: 'companyName', title: 'Tên công ty' },
      { name: 'bankName', title: 'Tên ngân hàng' },
      { name: 'bankAccount', title: 'STK ngân hàng' },
    ], // các cột được hiển thị
    // defaultOrder: [], // sắp xếp thứ tự hiển thị của các cột
    defaultColumnWidths: [
      { columnName: 'checkbox', width: 100 },
      { columnName: 'id', width: 100 },
      { columnName: 'name', width: 200 },
      { columnName: 'email', width: 200 },
      { columnName: 'phone', width: 200 },
      { columnName: 'companyName', width: 200 },
      { columnName: 'bankName', width: 200 },
      { columnName: 'bankAccount', width: 150 },
      { columnName: 'action', width: 100 },
    ], // chiều ngang mặc định của các cột
    rows: [
      {
        id: 1,
        name: 'Minh Chiến',
        email: 'chiendev98@gmail.com',
        phone: '0123456789',
        companyName: 'Came.vn',
        bankName: 'Vietcombank',
        bankAccount: '001010101001010',
      },
      {
        id: 2,
        name: 'Minh Chiến',
        email: 'chiendev98@gmail.com',
        phone: '0123456789',
        companyName: 'Came.vn',
        bankName: 'Vietcombank',
        bankAccount: '001010101001010',
      },
      {
        id: 3,
        name: 'Minh Chiến',
        email: 'chiendev98@gmail.com',
        phone: '0123456789',
        companyName: 'Came.vn',
        bankName: 'Vietcombank',
        bankAccount: '001010101001010',
      },
      {
        id: 4,
        name: 'Minh Chiến',
        email: 'chiendev98@gmail.com',
        phone: '0123456789',
        companyName: 'Came.vn',
        bankName: 'Vietcombank',
        bankAccount: '001010101001010',
      },
    ], // dữ liệu hiển thị
    columnOrder: ['id', 'name', 'email', 'phone', 'companyName', 'bankName', 'bankAccount', 'action'],
    //   pageSizes: [5, 10, 15],
    rowsPerPage: 10, // số hàng hiển thị trên một bảng
    page: 0, // trang hiện tại
    openDialogTableSetting: false, // hiển thị dialog
    selected: [], // các hàng được lựa chọn
    // rightColumns: ['action'], // cột fixed bên phải
    selectAll: false,
    isOpen: false,
    // defaultColumnWidths: [], // chiều ngang mặc định của các cột
    // leftColumns: ['checkbox'], //  cột fixed bên trái
    // rightColumns: ['action'], // cột fixed bên phải
  };

  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page, columns, columnOrder, isOpen } = this.state;
    allId = [];
    const newRows = rows.map(row => {
      const action = (
        <Fab size="small" title="Chỉnh sửa" style={{ marginLeft: 10 }} color="primary" onClick={this.handleDeletes}>
          <Edit color="disabled" style={{ color: '#fff' }} />
        </Fab>
      );
      const checkbox = this.addCheckbox(row.id);
      allId.push(row.id);
      return { ...row, action, checkbox };
    });
    const newColumns = [...columns, { name: 'checkbox', title: this.addCheckboxAll() }, { name: 'action', title: 'Thao tác' }];
    return (
      <div>
        <Paper className={classes.tableContainer} id="table-full-width">
          <GridUI container>
            <GridUI item md={10}>
              {this.state.selected.length !== 0 ? (
                <Fab color="secondary" style={{ marginLeft: 29 }} className={classes.button} size="small">
                  <Delete onClick={() => this.handleDeleteItem()} />
                </Fab>
              ) : (
                <div style={{ width: 40, height: 40, float: 'left', marginLeft: 29 }} className={classes.button} />
              )}
              <TextField className={classes.search} label="Tìm kiếm" margin="dense" />
            </GridUI>
            <GridUI item md={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button className={classes.button} variant="contained" component={NavLink} to="/crm/customers/add" color="primary">
                Thêm mới
              </Button>
              &nbsp;
              <Fab
                color="primary"
                className={classNames(classes.button, classes.success)}
                size="small"
                aria-owns={isOpen ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <ViewList />
              </Fab>
              <Menu id="simple-menu" open={isOpen} onClose={this.handleClose}>
                <MenuItem className={classes.menuItem}>
                  <ListItemIcon className={classes.icon} onClick={this.handleClose}>
                    <CheckBox />
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }} inset primary="Kiểm tra hàng tồn kho" />
                </MenuItem>
                <MenuItem className={classes.menuItem} onClick={this.handleClose}>
                  <ListItemIcon className={classes.icon}>
                    <TableChart />
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }} inset primary="Khởi tạo tệp Excel" />
                </MenuItem>
                <MenuItem className={classes.menuItem} onClick={this.handleClose}>
                  <ListItemIcon className={classes.icon}>
                    <CloudDownload />
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }} inset primary="Xuất tệp Excel" />
                </MenuItem>
                <MenuItem className={classes.menuItem} onClick={this.handleClose}>
                  <ListItemIcon className={classes.icon}>
                    <DeleteForever />
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }} inset primary="Xóa mặt hàng cũ" />
                </MenuItem>
                <MenuItem className={classes.menuItem} onClick={this.handleClose}>
                  <ListItemIcon className={classes.icon}>
                    <Timeline />
                  </ListItemIcon>
                  <ListItemText classes={{ primary: classes.primary }} inset primary="Lịch sử chuyển kho" />
                </MenuItem>
              </Menu>
              <Fab
                className={classes.button}
                color="primary"
                title="Thiết lập hiển thị"
                onClick={() => this.handleChangeDialogTableSetting(this.state.openDialogTableSetting)}
                size="small"
              >
                <Settings />
              </Fab>
              {/* <Modal
                update={state => this.handleUpdate(state)}
                open={dialogStatus}
                columns={columns}
                display={display => this.handleDisplay(display)}
              /> */}
            </GridUI>
          </GridUI>

          <Grid rows={newRows} columns={newColumns} style={{ width: '100%' }}>
            <DragDropProvider />
            <SortingState
              defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
              // columnExtensions={[{ columnName: 'checkbox', sortingEnabled: false }]}
            />
            {/* <SearchState defaultValue="" /> */}
            <IntegratedFiltering />
            <IntegratedSorting />

            <Table />
            {columnOrder.length !== 0 ? <TableColumnReordering defaultOrder={columnOrder} /> : null}
            {columnOrder.length !== 0 ? <TableColumnResizing defaultColumnWidths={this.state.defaultColumnWidths} /> : null}

            <TableHeaderRow showSortingControls />
            {/* <TableFixedColumns /> */}
            {/* <Toolbar /> */}
            {/* <SearchPanel /> */}
          </Grid>
          <TablePagination
            rowsPerPageOptions={[10, 50, 100]}
            component="div"
            count={rows.length}
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
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  handleClick = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  addCheckbox = id => <Checkbox checked={this.state.selected.includes(id)} color="primary" value={`${id}`} onClick={() => this.handleSelect(id)} />;

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

ListOfCustomer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default ListOfCustomer;
