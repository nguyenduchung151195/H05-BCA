/* eslint-disable array-callback-return */
/* eslint-disable array-callback-return */
/**
 *
 * ListOfDepartmentPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import {
  Paper,
  Typography,
  Grid,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  // Checkbox,
  Fab,
  Dialog,
  DialogContent,
  AppBar, Toolbar,
  IconButton,
  DialogActions,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
  DialogContentText,
  TablePagination,
} from '@material-ui/core'; // Card
import { Link } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import { Edit, Delete, Close } from '@material-ui/icons';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectListOfDepartmentPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
// import data from './data';
// import { fetchAllDepartment } form './actions';
import { fetchListDepartment, fetchAddDepartment, resetNoti, deleteDepartmentAct, editDepartmentAct } from './actions';

import CustomInputBase from '../../components/Input/CustomInputBase';

/* eslint-disable react/prefer-stateless-function */
export class ListOfDepartmentPage extends React.Component {
  state = {
    selected: [],
    dataLength: 0,
    content: '',
    // departments: [],
    openDialog: false,
    name: '',
    typeList: [
      { name: 'Bộ công an', type: 'corporation' },
      { name: 'CATP/ CAT/ Cục/ Vụ/ Viện/ Trường/ Bộ tư lệnh', type: 'company' },
      { name: 'Phòng/ Quận/ Huyện/ Thành phố/ Thị xã/ Khóa', type: 'department' },
      { name: 'Đội/ Tổ/ Phường/ Xã', type: 'salePoint' },
    ],
    type: '',
    parent: '',
    priority: 0,
    oUFunction: '',
    duty: '',
    note: '',
    id: '',
    code: '',
    departmentRole: '',
    accoutingBranchCode: '',
    accountingDepartmentCode: '',
    // status: '',
    // isDelete: false,
    rowsPerPage: 5,
    page: 0,
    listOrganizationUnit: [],
    indexCurrentDepart: 0,
    errorCode: false,
    errorName: false,

    onAdd: false,
    onDelete: false,
    disableButton: false
  };

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
    this.props.onGetListDepratment();
  }

  componentDidUpdate(props) {
    // if (props !== this.props) {
    const { listOfDepartmentPage } = props;
    if (listOfDepartmentPage.successCreate) {
      /* eslint-disable */
      this.setState({ openDialog: false, disableButton: false });
      this.props.enqueueSnackbar('Thao tác thành công!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.state.listOrganizationUnit[this.state.indexCurrentDepart].hiden = false;
      this.props.onGetListDepratment();
      this.props.onReset();
    }
    if (listOfDepartmentPage.successDelete) {
      this.setState({ onDelete: false, disableButton: false });
      this.props.enqueueSnackbar('Thao tác thành công!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      /* eslint-enable */
      this.props.onGetListDepratment();
      this.props.onReset();
    }
    if (listOfDepartmentPage.error) {
      this.setState({ disableButton: false })
      this.props.enqueueSnackbar('Thao tác thất bại!', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      /* eslint-enable */
      this.props.onReset();
    }
    // }
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { listOfDepartmentPage } = props;
      if (listOfDepartmentPage.successCreate) {
        /* eslint-disable */
        this.setState({ openDialog: false });
        /* eslint-enable */
        this.props.onReset();
      }
      this.state.listOrganizationUnit = [];
      // if (addUserPage.listOrganizationUnit) {
      const arrDepartment = listOfDepartmentPage.arrDepartment || [];
      this.state.dataLength = arrDepartment.length;
      arrDepartment.forEach(unit => {
        const newItem = {
          id: unit._id,
          name: unit.name,
          code: unit.code,
          parent: unit.parent,
          level: unit.level,
          type: unit.type,
          hiden: false,
          priority: unit.priority,
          oUFunction: unit.oUFunction,
          duty: unit.duty,
          note: unit.note,
          accoutingBranchCode: unit.accountingDepartmentCode || '',
          accountingDepartmentCode: unit.accoutingBranchCode || '',
        };
        this.state.listOrganizationUnit.push(newItem);
        if (unit.child) {
          this.listChil(unit.child, 20);
        }
      });
      this.props.onReset();
    }
  }

  listChil = (chil, level) => {
    if (chil.length > 0) {
      chil.forEach(item => {
        const newItem = {
          padding: `${level}`,
          id: item._id,
          name: item.name,
          code: item.code,
          type: item.type,
          parent: item.parent,
          level: item.level,
          hiden: false,
          priority: item.priority,
          oUFunction: item.oUFunction,
          duty: item.duty,
          note: item.note,
          accoutingBranchCode: item.accountingDepartmentCode || '',
          accountingDepartmentCode: item.accoutingBranchCode || '',
        };
        this.state.listOrganizationUnit.push(newItem);
        if (item.child) {
          this.listChil(item.child, level + 20);
        }
      });
    }
  };

  render() {
    const { classes, listOfDepartmentPage, intl } = this.props;
    const { rowsPerPage, page } = this.state;
    const level = 0;
    const arrDepartment = listOfDepartmentPage.arrDepartment || [];
    // const nameAdd = this.props ? this.props : this.props.match.path;
    // const stock = nameAdd.match.path;
    // const addStock =  stock.slice(stock.length -10,nameAdd.length)
    // if (this.state.changeOpen === true) {
    //   this.state.changeOpen = false;
    // console.log(rowsPerPage * page, rowsPerPage * page + rowsPerPage);
    this.state.content = arrDepartment.slice(rowsPerPage * page, rowsPerPage * page + rowsPerPage).map(depart => {
      if (depart.child && depart.child.length > 0) {
        return (
          <React.Fragment key={depart._id}>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox color="primary" />
              </TableCell> */}
              <TableCell onClick={() => this.clickOpen(depart)}>
                {depart.open ? <ExpandLess /> : <ExpandMore />}
                &nbsp;
                {depart.name}
              </TableCell>
              <TableCell>{depart.code}</TableCell>
              <TableCell>{depart.priority}</TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                <Fab size="small" color="primary" onClick={() => this.handleEditDepartment(depart._id)}>
                  <Edit />
                </Fab>
                &nbsp;
                <Fab size="small" color="secondary" onClick={() => this.handleClickOpenDelete(depart._id)}>
                  <Delete style={{ color: 'white' }} />
                </Fab>
              </TableCell>
            </TableRow>
            {depart.open ? this.displayTableContent(depart.child, level + 20) : null}
          </React.Fragment>
        );
      }
      return (
        // <React.Fragment>
        <TableRow key={depart._id}>
          {/* <TableCell padding="checkbox">
            <Checkbox color="primary" />
          </TableCell> */}
          <TableCell>{depart.name}</TableCell>
          <TableCell>{depart.code}</TableCell>
          <TableCell>{depart.priority}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>
            <Fab size="small" color="primary" onClick={() => this.handleEditDepartment(depart._id)}>
              <Edit />
            </Fab>
            &nbsp;
            <Fab size="small" color="secondary" onClick={() => this.handleClickOpenDelete(depart._id)}>
              <Delete style={{ color: 'white' }} />
            </Fab>
          </TableCell>
        </TableRow>
        // </React.Fragment>
      );
    });
    // }
    return (
      <div>

        <Helmet>
          <title>Danh sách đơn vị</title>
          <meta name="description" content="Description of ListOfDepartmentPage" />
        </Helmet>
        <div className={classes.wrap}>
        </div>
        <Grid item container md={12} style={{ marginBottom: 20, marginTop: 20 }}>
          <Grid item md={6}>
            <Typography variant="h6" className={classes.title}>
              XÂY DỰNG CÂY SƠ ĐỒ TỔ CHỨC
            </Typography>
          </Grid>

          <Grid item container md={6} justify="flex-end">
            <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
              Thêm mới đơn vị
            </Button>
          </Grid>
        </Grid>
        <Paper>
          {/* <Table className={classes.table} aria-labelledby="tableTitle"> */}
          <Table aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox" style={{ width: '50px' }}>
                  <Checkbox color="primary" />
                </TableCell> */}
                <TableCell component="th" style={{ fontWeight: 'bold', width: 400 }}>Tên đơn vị</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Mã đơn vị</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Thứ tự</TableCell>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.state.content ? this.state.content : ''}</TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 50, 100]}
            component="div"
            count={this.state.dataLength}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Trang trước',
            }}
            nextIconButtonProps={{
              'aria-label': 'Trang tiếp theo',
            }}
            labelRowsPerPage="Hàng trên mỗi trang: "
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
        <Dialog
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className={classes.dialog}
        >
          <DialogTitle id="alert-dialog-title"><p style={{ fontSize: 16, fontWeight: 'bold' }}>Thông tin đơn vị</p></DialogTitle>
          <DialogContent className={classes.wrapContentDialog}>
            {/* <FormControl>
              <InputLabel htmlFor="departmentBig">Phòng ban cha</InputLabel>
              <Select
                className={classes.select}
                value={this.state.parent}
                onChange={this.handleChange}
                name="parent"
                inputProps={{
                  id: 'departmentBig',
                }}
              >
                <MenuItem value="">-- Chọn phòng ban --</MenuItem>
                <MenuItem value={0}>Phòng 1</MenuItem>
                <MenuItem value={1}>Phòng 2</MenuItem>
                <MenuItem value={2}>Phòng 3</MenuItem>
              </Select>
            </FormControl> */}
            <Grid container spacing={8} style={{ marginTop: 10 }} >
              <Grid md={12}>
                <CustomInputBase
                  // id="standard-select-currency"
                  select
                  label="Đơn vị cha"
                  name="parent"
                  // className={classes.textField2}
                  value={this.state.parent}
                  onChange={this.handleChange}
                // SelectProps={{
                //   MenuProps: {
                //     className: classes.menu,
                //   },
                // }}
                // helperText="Please select your currency"
                // margin="normal"
                >
                  <MenuItem value="">--Chọn đơn vị--</MenuItem>
                  {/* eslint-disable */}
                  {this.state.listOrganizationUnit.map(item => {
                    if (item.hiden === false) {
                      return (
                        <MenuItem
                          key={item.id}
                          value={item.id}
                          style={item.padding !== 0 ? { paddingLeft: `${parseInt(item.padding, 10) * 1.5}px` } : {}}
                        >
                          {item.name}
                        </MenuItem>
                      );
                    }
                  })}
                  {/* eslint-enable */}
                </CustomInputBase>
              </Grid>

              <Grid md={12}>
                <Grid container>
                  <Grid md={6} style={{ paddingRight: 10 }}>
                    {/* <FormControl className={classes.textField}> */}
                    <CustomInputBase
                      label="Mã đơn vị"
                      type="text"
                      // className={classes.textField}
                      value={this.state.code}
                      onChange={this.handleChange}
                      name="code"
                    />
                    {this.state.errorCode ? (
                      <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                        Mã đơn vị cần ít nhất 5 kí tự, không chứa kí tự đặc biệt
                      </FormHelperText>
                    ) : (
                      ''
                    )}
                    {/* </FormControl> */}
                  </Grid>
                  <Grid md={6}>
                    <CustomInputBase
                      label="Số thứ tự"
                      // className={classes.textField}
                      // style={{ marginLeft: '10px' }}
                      value={this.state.priority}
                      name="priority"
                      type="number"
                      onChange={this.handleChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid md={12}>
                {/* <FormControl className={classes.textField2}> */}
                <CustomInputBase
                  label="Tên đơn vị"
                  type="text"
                  // className={classes.textField2}
                  value={this.state.name}
                  onChange={this.handleChange}
                  name="name"
                />
                {this.state.errorName ? (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Tên đơn vị tối thiểu 5 kí tự
                  </FormHelperText>
                ) : (
                  ''
                )}
                {/* </FormControl> */}
              </Grid>
              <Grid md={12}>
                {/* <FormControl className={classes.textField2}> */}
                <CustomInputBase
                  // id="standard-select-currency"
                  select
                  label="Loại đơn vị"
                  name="type"
                  // className={classes.textField2}
                  value={this.state.type}
                  onChange={this.handleChange}
                // SelectProps={{
                //   MenuProps: {
                //     className: classes.menu,
                //   },
                // }}
                // helperText="Please select your currency"
                // margin="normal"
                >
                  {/* <MenuItem value="">-- Chọn chức vụ --</MenuItem> */}
                  {/* <MenuItem value={0}>Tập đoàn</MenuItem>
              <MenuItem value="Công ty">Công ty</MenuItem>
              <MenuItem value="Kho">Kho</MenuItem> */}
                  {this.state.typeList.map((item, index) => (
                    <MenuItem key={item.type} value={index}>
                      {item.name}
                    </MenuItem>
                  ))}
                </CustomInputBase>
                {this.state.errorDepart ? (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Chưa chọn loại đơn vị
                  </FormHelperText>
                ) : (
                  ''
                )}
                {/* </FormControl> */}
              </Grid>
              <Grid md={12}>
                <CustomInputBase
                  label="Chức năng"
                  multiline
                  rows={4}
                  rowsMax={4}
                  // className={classes.textField2}
                  name="oUFunction"
                  onChange={this.handleChange}
                  value={this.state.oUFunction}
                />
              </Grid>
              <Grid md={12}>
                <CustomInputBase
                  label="Nhiệm vụ"
                  multiline
                  rows={4}
                  rowsMax={4}
                  // className={classes.textField2}
                  name="duty"
                  onChange={this.handleChange}
                  value={this.state.duty}
                />
              </Grid>
              <Grid md={12}>
                <CustomInputBase
                  label="Ghi chú"
                  multiline
                  rows={4}
                  rowsMax={4}
                  // className={classes.textField2}
                  name="note"
                  onChange={this.handleChange}
                  value={this.state.note}
                />
              </Grid>
              <Grid md={12}>

              </Grid>
              {/* <Grid md={12}>
                <CustomInputBase
                  label="Mã chi nhánh hạch toán"
                  type="text"
                  name="accoutingBranchCode"
                  // className={classes.textField}
                  value={this.state.accoutingBranchCode}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid md={12}>
                <CustomInputBase
                  label="Mã phòng ban hạch toán"
                  type="number"
                  name="accountingDepartmentCode"
                  // className={classes.textField}
                  // style={{ marginLeft: '10px' }}
                  value={this.state.accountingDepartmentCode}
                  onChange={this.handleChange}
                />
              </Grid> */}


            </Grid>





            {/* <FormControl style={{ marginTop: '10px' }}>
              <InputLabel htmlFor="departmentRole">Chức vụ lãnh đạo</InputLabel>
              <Select
                className={classes.select}
                value={this.state.departmentRole}
                onChange={this.handleChange}
                inputProps={{
                  id: 'departmentRole',
                }}
                name="departmentRole"
              >
                <MenuItem value="">-- Chọn chức vụ --</MenuItem>
                <MenuItem value={10}>Giám đốc</MenuItem>
                <MenuItem value={20}>Nhân viên</MenuItem>
                <MenuItem value={30}>Trưởng phòng</MenuItem>
              </Select>
            </FormControl> */}






          </DialogContent>
          <DialogActions>
            <Button color="primary" variant="contained" autoFocus onClick={() => this.handleAddDepartment()} disabled={this.state.disableButton}>
              Lưu
            </Button>
            <Button onClick={this.handleClose} variant="contained" color="secondary">
              hủy
            </Button>
          </DialogActions>
        </Dialog>
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
            <Button variant="contained" color="primary" onClick={() => this.handleDeleteDepartment()} disabled={this.state.disableButton}>
              Đồng ý
            </Button>
            <Button variant="contained" onClick={this.handleCloseDelete} color="secondary" autoFocus>
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  handleChange = event => {
    if (event.target.name === 'name' || event.target.name === 'code' || event.target.name === 'type') {
      if (event.target.name === 'name') {
        this.state.errorName = false;
      }
      if (event.target.name === 'code') {
        this.state.errorCode = false;
      }
      if (event.target.name === 'type') {
        this.state.errorDepart = false;
      }
    }
    this.setState({ [event.target.name]: event.target.value });
  };

  // handleDeletes = () => {
  //   this.props.onDeletePropertie(this.state.id);
  // };

  handleClickOpenDelete = id => {
    this.setState({ onDelete: true, id });
  };

  handleCloseDelete = () => {
    this.setState({ onDelete: false, disableButton: false });
  };

  handleClickOpen = () => {
    this.setState({
      openDialog: true,
      onAdd: true,
      name: '',
      code: '',
      parent: '',
      priority: 0,
      oUFunction: '',
      duty: '',
      note: '',
      accoutingBranchCode: '',
      accountingDepartmentCode: '',
      disableButton: false
    });
  };

  handleClose = () => {
    this.state.listOrganizationUnit[this.state.indexCurrentDepart].hiden = false;
    this.setState({ openDialog: false, disableButton: false });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleAddDepartment = () => {
    const {
      name,
      parent,
      listOrganizationUnit,
      departmentRole,
      priority,
      oUFunction,
      duty,
      note,
      code,
      accountingDepartmentCode,
      accoutingBranchCode,
      onAdd,
      type,
      typeList,
    } = this.state;
    let level = 0;
    if (parent !== '') {
      listOrganizationUnit.forEach(e => {
        if (e.id === parent) {
          level = e.level + 1;
        }
      });
    }
    const id = this.state.id || '';
    const bodyCreate = {
      name,
      parent,
      priority,
      oUFunction,
      duty,
      note,
      code,
      level,
      departmentRole,
      accountingDepartmentCode,
      accoutingBranchCode,
      id,
      type: typeList[type].type || '',
    };
    const bodyEdit = {
      name,
      parent: parent !== '' ? parent : null,
      priority,
      oUFunction,
      duty,
      note,
      code,
      level,
      departmentRole,
      accountingDepartmentCode,
      accoutingBranchCode,
      id,
      type: typeList[type].type || '',
    };
    const rex = /^[A-Za-z0-9.]+$/;
    if (name.length < 5 || code.length < 5 || type === '' || !rex.test(code.trim())) {
      if (name.length < 5) {
        this.setState({ errorName: true });
      }
      if (code.length < 5 || !rex.test(code.trim())) {
        this.setState({ errorCode: true });
      }
      if (type === '') {
        this.setState({ errorDepart: true });
      }
    } else if (onAdd) {
      this.setState({ disableButton: true })
      this.props.onAddDepartment(bodyCreate);
    } else {
      this.setState({ disableButton: true })
      this.props.onEditDepartment(bodyEdit);
    }
    // console.log('thang')
  };

  displayTableContent = (dataList, level) => {
    // eslint-disable-line
    this.state.changeOpen = false;
    return dataList.map(department => {
      if (department.child && department.child.length > 0) {
        return (
          <React.Fragment key={department._id}>
            <TableRow >
              {/* <TableCell padding="checkbox">
                <Checkbox color="primary" />
              </TableCell> */}
              <TableCell onClick={() => this.clickOpen(department)}  >
                <p>
                  <span style={{ padding: `0px ${level}px` }} />
                  {department.open ? <ExpandLess /> : <ExpandMore />}
                  &nbsp;
                  {department.name}
                </p>
              </TableCell>
              <TableCell>{department.code}</TableCell>
              <TableCell>{department.priority}</TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                <Fab size="small" color="primary" onClick={() => this.handleEditDepartment(department._id)}>
                  <Edit />
                </Fab>
                &nbsp;
                <Fab size="small" color="secondary" onClick={() => this.handleClickOpenDelete(department._id)}>
                  <Delete style={{ color: 'white' }} />
                </Fab>
              </TableCell>
            </TableRow>

            {department.open ? this.displayTableContent(department.child, level + 20) : null}
          </React.Fragment>
        );
      }
      return (
        // <React.Fragment>
        <TableRow key={department._id} >
          {/* <TableCell padding="checkbox">
            <Checkbox color="primary" />
          </TableCell> */}
          <TableCell>
            <p style={{display:"flex"}}>
              <div style={{ padding: `0px ${level}px` }} />
              <p>{department.name}</p>
            </p>
          </TableCell>
          <TableCell>{department.code}</TableCell>
          <TableCell>{department.priority}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>
            <Fab size="small" color="primary" onClick={() => this.handleEditDepartment(department._id)}>
              <Edit />
            </Fab>
            &nbsp;
            <Fab size="small" color="secondary" onClick={() => this.handleClickOpenDelete(department._id)}>
              <Delete style={{ color: 'white' }} />
            </Fab>
          </TableCell>
        </TableRow>
        // </React.Fragment>
      );
    });
  };

  clickOpen = depart => {
    /* eslint-disable */
    if (!depart.open) {
      depart.open = true;
    } else {
      depart.open = false;
    }
    this.setState({ changeOpen: true });
    /* eslint-enable */
  };

  handleDeleteDepartment = () => {
    this.props.onDeleteDepartment(this.state.id);
  };

  handleEditDepartment = id => {
    const { listOrganizationUnit } = this.state;
    let indexCurrentDepart = 0;
    const currentDepart = listOrganizationUnit.find((item, index) => {
      if (item.id === id) {
        indexCurrentDepart = index;
        return true;
      }
      return false;
    });
    listOrganizationUnit[indexCurrentDepart].hiden = true;

    let typeId;
    this.state.typeList.forEach((item, index) => {
      // console.log(item, currentDepart);
      if (item.type === currentDepart.type) typeId = index;
    });
    // console.log(typeId);
    this.setState({
      name: currentDepart.name,
      code: currentDepart.code,
      id: currentDepart.id,
      type: typeId,
      parent: currentDepart.parent !== null ? currentDepart.parent : '',
      priority: currentDepart.priority,
      oUFunction: currentDepart.oUFunction,
      duty: currentDepart.duty,
      note: currentDepart.note,
      listOrganizationUnit,
      indexCurrentDepart,
      accoutingBranchCode: currentDepart.accountingDepartmentCode,
      accountingDepartmentCode: currentDepart.accoutingBranchCode,
      openDialog: true,
      onAdd: false,
      disableButton: false
    });
  };
}

ListOfDepartmentPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  onGetListDepratment: PropTypes.func.isRequired,
  onAddDepartment: PropTypes.func.isRequired,
  listOfDepartmentPage: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  listOfDepartmentPage: makeSelectListOfDepartmentPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetListDepratment: () => {
      dispatch(fetchListDepartment());
    },
    onAddDepartment: body => {
      dispatch(fetchAddDepartment(body));
    },
    onDeleteDepartment: body => {
      dispatch(deleteDepartmentAct(body));
    },
    onEditDepartment: body => {
      dispatch(editDepartmentAct(body));
    },
    onReset: () => {
      dispatch(resetNoti());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'listOfDepartmentPage', reducer });
const withSaga = injectSaga({ key: 'listOfDepartmentPage', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(ListOfDepartmentPage);
