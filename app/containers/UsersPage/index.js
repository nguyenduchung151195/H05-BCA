/**
 *
 * UsersPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import {
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
  Tooltip,
  Grid,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import GridUI from '@material-ui/core/Grid';
import TableUI from '@material-ui/core/Table';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Circle from '@material-ui/icons/CheckCircle';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import LoadingIndicator from '../../components/LoadingIndicator';
import makeSelectUsersPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  fetchAllUserAction,
  fetchConfigAction,
  fetchUpdateConfigAction,
  fetchDeleteUsersAction,
  resetNoti,
  fetchListDepartment,
  fetchChangePassword,
  mergeData,
} from './actions';
import styles from './styles';
import HistoryLogin from './HistoryLogin';
import ListPage from '../../components/List';
import { API_USERS } from '../../config/urlConfig';
import { SwipeableDrawer, Tab, Tabs } from '../../components/LifetekUi';
import avatarA from '../../images/default-avatar.png';
import RoleGroupPage from 'containers/RoleGroupPage';
import RoleGroupPagePortal from 'containers/RoleGroupPagePortal';
import ListOfDepartmentPage from 'containers/ListOfDepartmentPage';
import ResetRoleModule from './ResetRoleModule';
import { changeSnackbar } from './../Dashboard/actions';
import Buttons from 'components/CustomButtons/Button';
import { isPort } from 'variable'
/* eslint-disable react/prefer-stateless-function */
const CustomAvt = props => <Avatar src={`${props.item.avatar}?allowDefault=true`} />;

const CustomStatus = props => {
  if (props.item.status === 1) return <div style={{ color: '#40FF00' }}>Hoạt động</div>;
  return <div style={{ color: 'red' }}>Không hoạt động</div>;
};
const CustomGender = props => {
  if (props.item.gender === 'male') return <div>Nam</div>;
  return <div>Nữ</div>;
};
function Bt(props) {
  return (
    <Buttons color={props.color} right round size="sm" onClick={props.onClick}>
      {props.children}
    </Buttons>
  );
}
export class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      filter: { status: 1 },
      data: [],
      onDelete: false,
      arrDelete: [],
      currentDepart: '',
      pageDetail: {
        currentPage: 0,
        pageSize: 10,
        totalCount: 0,
      },
      changePassword: false,
      userChangePass: '',
      newPassword: '',
      historyUser: false,
      tab: 0,
      tabUser: 0,
      count: 0,
      reLoad: false,
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

    this.props.location.state && this.setState({ tab: this.props.location.state });
  }

  componentWillMount() {
    const filter = {
      skip: 0,
      limit: this.state.pageDetail.pageSize,
    };
    this.props.onGetListDepartment();
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { usersPage } = props;
      if (usersPage.arrUser && usersPage.success) {
        this.state.data = usersPage.arrUser || [];
        this.state.pageDetail.totalCount = usersPage.count || 0;
        this.state.pageDetail.currentPage = Number(usersPage.skip || 0) || 0;
        this.state.pageDetail.pageSize = usersPage.limit || 10;
        this.props.onResetNoti();
      }
    }
  }

  componentDidUpdate() {
    const { usersPage } = this.props;
    if (usersPage.successDelete) {
      this.onDeleteSuccess();
      this.state.onDelete = false;
      this.props.onResetNoti();
    }
    if (usersPage.error) {
      this.props.onResetNoti();
    }
  }
  historyItem = () => {
    // const { dashboardPage } = this.props;
    // const roleCode =
    //   dashboardPage.role.roles && dashboardPage.role.roles && dashboardPage.role.roles.find(item => item.codeModleFunction === 'LoginLog');
    // const roleModule = roleCode && roleCode.methods ? roleCode.methods : [];
    // const allow = (roleModule.find(elm => elm.name === 'GET') || { allow: true }).allow;
    // if (allow) {
    return (
      <Tooltip title="Lịch sử đăng nhập">
        <AccountCircle style={{ color: 'white' }} onClick={() => this.setState({ historyUser: true })} />
      </Tooltip>
    );
    // }
    // return null;
  };

  handlecloseDrawer = () => {
    this.setState({ historyUser: false });
  };

  // checkImage = async (API_USERS) => {
  //   // const url = API_USERS;
  //   let result;
  //   let file;
  //   const config = {
  //     responseType: 'blob',
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       'Content-Type': 'application/json',
  //     },
  //   };
  //   await axios.get(API_USERS, config)
  //     .then(res => file = new Blob(
  //       [res.value],
  //       { type: 'application/pdf' }))
  //   if (file && file.size) {
  //     result = true
  //   } else {
  //     result = false;
  //   }
  //   return result;
  // }

  mapFunction = item => {
    return {
      ...item,
      status: item.status,
      type: item.type,
      gender: item.gender === 'male' ? 'Nam' : item.gender === 'female' ? 'Nữ' : 'Khác',
      avatar: <Avatar src={avatarA} srcSet={item.avatar === 'https://g.lifetek.vn:203/api/files/5f8684e931365b51d00afec6' ? avatarA : item.avatar} />,
      online: item.online ? (
        <div style={{ textAlign: 'center' }}>
          <Circle style={{ color: 'green' }} />
        </div>
      ) : null,
    };
  };

  render() {
    const { classes, usersPage, intl } = this.props;
    const level = 0;
    const arrDepartment = usersPage.arrDepartment || [];
    // if (this.state.changeOpen === true) {
    //   this.state.changeOpen = false;
    // console.log(rowsPerPage * page, rowsPerPage * page + rowsPerPage);
    const { tab, tabUser } = this.state;

    let topNavList = isPort ? [
      {
        name: 'user',
        id: 'Người dùng',
      },
      {
        name: 'role',
        id: 'Vai trò',
      },
      {
        name: 'unit',
        id: 'Đơn vị',
      },
      {
        name: 'rolePortal',
        id: 'Vai trò Portal',
      },
      // {
      //   name: 'reset-role',
      //   id: 'Làm mới quyền',
      // },
    ] : [
      {
        name: 'user',
        id: 'Người dùng',
      },
      {
        name: 'role',
        id: 'Vai trò',
      },
      {
        name: 'unit',
        id: 'Đơn vị',
      },

      // {
      //   name: 'reset-role',
      //   id: 'Làm mới quyền',
      // },
    ]

    this.state.content = arrDepartment.map(depart => {
      if (depart.child && depart.child.length > 0) {
        return (
          <React.Fragment key={depart._id}>
            <TableRow onClick={() => this.selectDepartment(depart)} className={classes.tbRow}>
              <TableCell onClick={() => this.clickOpen(depart)}>
                {depart.open ? <ExpandLess /> : <ExpandMore />}
                &nbsp;
                {depart.name}
              </TableCell>
            </TableRow>
            {depart.open ? this.displayTableContent(depart.child, level + 20) : null}
          </React.Fragment>
        );
      }
      return (
        // <React.Fragment>
        <TableRow key={depart._id} onClick={() => this.selectDepartment(depart)} className={classes.tbRow}>
          <TableCell>{depart.name}</TableCell>
        </TableRow>
        // </React.Fragment>
      );
    });
    this.state.content.unshift(
      <TableRow onClick={() => this.selectDepartment('')} className={classes.tbRow}>
        <TableCell>Tất cả cán bộ</TableCell>
      </TableRow>,
    );
    return (
      <div>
        <Helmet>
          <title>Cán bộ phòng ban</title>
          <meta name="description" content="Description of AddUserPage" />
        </Helmet>
        {/* <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Typography color="textPrimary">Danh sách cán bộ</Typography>
          </Breadcrumbs>
        </Paper> */}
        {/* <GridUI container>
          <GridUI item md={11}>
            <Button component={NavLink} to="/setting/roleGroup" style={{ marginBottom: 10, marginRight: 10 }} variant="outlined" color="primary">
              {intl.formatMessage(messages.groupdecentralization || { id: 'groupdecentralization' })}
            </Button>
            <Button
              component={NavLink}
              to="/setting/Employee/department"
              style={{ marginBottom: 10, marginRight: 10 }}
              variant="outlined"
              color="primary"
            >
              {intl.formatMessage(messages.listofunit || { id: 'listofunit' })}
            </Button>
            
          </GridUI>
        </GridUI> */}
        <Tabs value={tab} onChange={(e, tab) => this.setState({ tab })}>
          {topNavList.map((item, key) => (
            <Tab value={key} label={item.id} />
          ))}
        </Tabs>
        {tab === 0 && (
          <Paper className={classes.tableContainer} id="table-full-width" style={{ padding: 10, overflow: 'hidden' }}>
            <>
              <GridUI container style={{ marginTop: 8, paddingBottom: 10 }}>
                <Grid justifyContent="flex-end" container direction="row-reverse">
                  <Bt onClick={() => this.handleChangeTab(1, 0)} color={tabUser === 1 ? 'gradient' : 'simple'}>
                    Tắt kích hoạt
                  </Bt>
                  <Bt onClick={() => this.handleChangeTab(0, 1)} color={tabUser === 0 ? 'gradient' : 'simple'}>
                    Kích hoạt
                  </Bt>
                </Grid>
              </GridUI>
              {tabUser === 0 ? (
                <Paper className={classes.tableContainer} id="table-full-width" style={{ padding: 10, overflow: 'hidden' }}>
                  <GridUI container item md={12} spacing={32}>
                    <GridUI item md={4} ms={3}>
                      <TableUI className={classes.table} aria-labelledby="tableTitle">
                        <TableHead>
                          <TableRow>
                            <TableCell component="th">Tên phòng ban</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>{this.state.content ? this.state.content : ''}</TableBody>
                      </TableUI>
                    </GridUI>
                    <GridUI item md={8} xs={9}>
                      {!this.state.reLoad ? <ListPage
                        apiUrl={API_USERS}
                        code="Employee"
                        // disableMenuAction
                        isPlanChild
                        settingBar={[this.historyItem()]}
                        onEdit={this.handleEditClick}
                        mapFunction={this.mapFunction}
                        exportExcel
                        filter={this.state.filter}
                        disableChangePassword={true}
                        listMenus={[]}
                        disableExportForm
                      /> : <LoadingIndicator />}
                    </GridUI>
                  </GridUI>
                </Paper>
              ) : null}
              {tabUser === 1 ? (
                <Paper className={classes.tableContainer} id="table-full-width" style={{ padding: 10, overflow: 'hidden' }}>
                  <GridUI container item md={12} spacing={32}>
                    <GridUI item md={4} ms={3}>
                      <TableUI className={classes.table} aria-labelledby="tableTitle">
                        <TableHead>
                          <TableRow>
                            <TableCell component="th">Tên phòng ban</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>{this.state.content ? this.state.content : ''}</TableBody>
                      </TableUI>
                    </GridUI>
                    <GridUI item md={8} xs={9}>
                      {!this.state.reLoad ? (
                        <ListPage
                          apiUrl={`${API_USERS}`}
                          code="Employee"
                          // disableMenuAction
                          isPlanChild
                          settingBar={[this.historyItem()]}
                          onEdit={this.handleEditClick}
                          mapFunction={this.mapFunction}
                          exportExcel
                          importExport={undefined}
                          filter={this.state.filter}
                          disableChangePassword={true}
                          disableAdd
                          disableMenuAction
                        />
                      ) : (
                        <LoadingIndicator />
                      )}
                    </GridUI>
                  </GridUI>
                </Paper>
              ) : null}
            </>
          </Paper>
        )}
        {tab === 1 && <RoleGroupPage />}
        {tab === 2 && <ListOfDepartmentPage />}
        {/* {
          tab === 3 && (
            <ResetRoleModule
              mergeData={this.props.mergeData}
              users={(usersPage && usersPage.users) || []}
              moduleListChoseReset={(usersPage && usersPage.moduleListChoseReset) || []}
              onChangeSnackbar={this.props.onChangeSnackbar}
              checkedAllUser={(usersPage && usersPage.checkedAllUser) || false}
              checkedAllModule={(usersPage && usersPage.checkedAllModule) || false}
            />
          )
        } */}
        {/* phân quyền portal */}
        {
          console.log(isPort, 'isPort')
        }
        {tab === 3 && isPort && <RoleGroupPagePortal />}
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.handlecloseDrawer()}
          open={this.state.historyUser}
          title="Lịch Sử Đăng Nhập"
          width={window.innerWidth - 260}
        >
          <div style={{ padding: '15px', width: 'calc(100vw - 260px)' }}>
            <HistoryLogin />
          </div>
        </SwipeableDrawer>
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
              ĐỒNG Ý
            </Button>
            <Button variant="contained" onClick={this.handleCloseDelete} color="secondary" autoFocus>
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.changePassword}
          onClose={this.handleOpenChangePassword}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Đổi mật khẩu</DialogTitle>
          <DialogContent>
            {/* <DialogContentText id="alert-dialog-description">Đồng chí có chắc chắn muốn xóa?</DialogContentText> */}
            {/* <TextField /> */}
            <TextField
              margin="dense"
              placeholder="Mật khẩu mới"
              variant="outlined"
              name="newPassword"
              value={this.state.newPassword}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleChangePassword} variant="contained">
              LƯU
            </Button>
            <Button onClick={this.handleOpenChangePassword} variant="contained" color="primary" autoFocus>
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
        {usersPage.loading ? <LoadingIndicator /> : ''}
      </div>
    );
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onDeleteSuccess = () => {
    this.child.callBack('delete-success');
  };

  handleAddClick = () => {
    const { history } = this.props;
    history.push('/setting/Employee/add');
  };

  handleDelete = () => {
    this.props.onDeleteUsers(this.state.arrDelete);
  };

  handleCloseDelete = () => {
    this.setState({ onDelete: false });
  };

  handleEditClick = item => {
    const { history } = this.props;
    history.push(`/setting/Employee/add/${item._id}`);
  };

  handleDeleteClick = item => {
    const { data } = this.state;
    const arrDelete = [];
    item.forEach(n => {
      arrDelete.push(data[n]._id);
    });
    this.setState({ onDelete: true, arrDelete });
  };

  clickOpen = depart => {
    /* eslint-disable */
    if (!depart.open) {
      depart.open = true;
    } else {
      depart.open = false;
    }
    this.setState({ changeOpen: true, reLoad: true });
    setTimeout(() => {
      this.setState({ reLoad: false });
    }, 1);
    /* eslint-enable */
  };

  selectDepartment = depart => {
    let filter = {};
    const { tabUser } = this.state;
    if (depart !== '') {
      filter = {
        'organizationUnit.organizationUnitId': depart._id,
      };
    }
    if (tabUser === 0) filter = { ...filter, status: 1 };
    else filter = { ...filter, status: 0 };
    this.setState({ filter, currentDepart: depart._id, reLoad: true });
    setTimeout(() => {
      this.setState({ reLoad: false });
    }, 1);
  };
  handleChangeTab = (tabUser, status) => {
    let { filter } = this.state;
    filter = { ...filter, status: status };
    this.setState({ tabUser, filter });
  };
  handleOpenChangePassword = user => {
    const { changePassword } = this.state;

    this.setState({ userChangePass: user.userId, changePassword: !changePassword });
  };

  handleChangePassword = () => {
    const { userChangePass, newPassword } = this.state;
    this.props.onChangePassword({
      user: userChangePass,
      password: newPassword,
    });
    this.setState({ changePassword: false });
  };

  ChangePassword = props => <MenuItem onClick={() => this.handleOpenChangePassword(props)}>Đổi mật khẩu</MenuItem>;

  displayTableContent = (dataList, level) => {
    // eslint-disable-line
    const { classes } = this.props;
    this.state.changeOpen = false;
    return dataList.map(department => {
      if (department.child && department.child.length > 0) {
        return (
          <React.Fragment key={department._id}>
            <TableRow onClick={() => this.selectDepartment(department)} className={classes.tbRow}>
              <TableCell onClick={() => this.clickOpen(department)}>
                <p>
                  <span style={{ padding: `0px ${level}px` }} />
                  {department.open ? <ExpandLess /> : <ExpandMore />}
                  &nbsp;
                  {department.name}
                </p>
              </TableCell>
            </TableRow>

            {department.open ? this.displayTableContent(department.child, level + 15) : null}
          </React.Fragment>
        );
      }
      return (
        // <React.Fragment>
        <TableRow key={department._id} onClick={() => this.selectDepartment(department)} className={classes.tbRow}>
          <TableCell>
            {/* <p>
              <span style={{ padding: `0px ${level}px` }} />
              {department.name}
            </p> */}
             <p style={{display:"flex"}}>
              <div style={{ padding: `0px ${level}px` }} />
              <p>{department.name}</p>
            </p>
          </TableCell>
        </TableRow>
        // </React.Fragment>
      );
    });
  };
}

UsersPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  onGetAllUser: PropTypes.func.isRequired,
  classes: PropTypes.object,
  onDeleteUsers: PropTypes.func.isRequired,
  usersPage: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  usersPage: makeSelectUsersPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllUser: id => {
      dispatch(fetchAllUserAction(id));
    },
    onGetConfig: () => {
      dispatch(fetchConfigAction());
    },
    onUpdateConfig: body => {
      dispatch(fetchUpdateConfigAction(body));
    },
    onDeleteUsers: body => {
      dispatch(fetchDeleteUsersAction(body));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onGetListDepartment: () => {
      dispatch(fetchListDepartment());
    },
    onChangePassword: body => {
      dispatch(fetchChangePassword(body));
    },
    mergeData: data => {
      dispatch(mergeData(data));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'usersPage', reducer });
const withSaga = injectSaga({ key: 'usersPage', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(UsersPage);
