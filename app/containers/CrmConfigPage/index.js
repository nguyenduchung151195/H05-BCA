/**
 *
 * CrmConfigPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  Paper,
  Button,
  TextField,
  SwipeableDrawer,
  Fab,
  Menu,
  MenuItem,
  Grid,
  Tooltip,
  Fab as Fa,
} from '@material-ui/core';
import { Add, Edit, Reorder, ImportExport } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { locationColumns, taxColumns, taxVATColumns } from 'variable';
import ListPage from 'containers/ListPage';
import makeSelectCrmConfigPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import TabContainer from '../../components/TabContainer';
import BusinessStatus from '../../components/BusinessStatus/index';
import Status from '../../components/Status';
import {
  fetchAllStatusAction,
  addStatusAction,
  addCRMStatusAction,
  editCRMStatusAction,
  deleteCRMStatusAction,
  resetNotis,
  deleteStatusAction,
  updateStatusAction,
  updateStatusIndexAction,
  resetAllStatus,
  fetchAllSourcesAction,
  addSourceAction,
  editSourceAction,
  updateSourcesAction,
  deleteCRMSourcesAction,
  resetAllSources,
  fetchAllCurrency,
  addCurrencyAction,
  updateCurrencyAction,
  handleChangeNameCurrency,
  onChangeNameCurrency,
  handleDiscount,
  getCurrentCurrency,
  getMoney,
  getCurrencyDefault,
  changeBaseCurrency,
  // Location
  getLocation,
  addLocation,
  handleChangeLocation,
  getCurrentLocation,
  updateLocation,
  // Tax
  getTax,
  handleChangeTax,
  addTax,
  getCurrentTax,
  updateTax,
  handleSelectTax,
  getCurrentTaxVAT,
  addTaxLevel,
  handleChangeTaxLevel,
  getTaxlevel,
  updateTaxLevel,
} from './actions';
import { API_LOCATION, API_TAX } from '../../config/urlConfig';
import Location from '../../components/Location';
import Tax from '../../components/Tax';
import TaxVat from '../../components/TaxVat';
import CustomerVerticalTabList from '../../components/CustomVerticalTabList';
import DialogCreateEdit from '../../components/CustomDialog/DialogCreateEdit';
import ConfirmDialog from '../../components/CustomDialog/ConfirmDialog';
import ImportPageConfigCRM from './components/importPage';
import WordPositionModal from './components/WordPositionModal'
// const addSource = useCallback(() => {
//   this.props.onAddCRMSource(this.state.newSource)
// }, [this.state.newSource])

const TextFieldUI = props => <TextField id="id" {...props} />;
TextFieldUI.defaultProps = {
  size: 'small',
};

const FabUI = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right', boxShadow: 'none', padding: 0, margin: ' 0 5px', height: 35, width: 35 },
};

export class CrmConfigPage extends React.Component {
  state = {
    statusTabIndex: 0,
    sourceTabIndex: 0,
    tabIndex: 0,
    listStatus: [],
    listSource: [],
    newSource: '',
    newStatus: '',
    chooseId: '',
    openStatus: false,
    openSource: false,
    deleteStatus: false,
    deleteSource: false,
    returnStatus: false,
    returnSource: false,
    isEdit: false,
    type: '',
    openDrawer: false,
    openDrawerLocation: false,
    anchorEl: false,
    openTax: false,
    openDrawerTax: false,
    openDrawerTaxVAT: false,
    search: [],
    employees: '',
    importPage: false,
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
    const refs = window.location.href.split('/')[window.location.href.split('/').length - 1];
    this.setState({ type: refs });
    this.props.onGetCRMStatus(refs ? refs : this.state.type);
    this.props.onGetCRMSource(refs ? refs : this.state.type);
    this.props.getMoney();
    this.props.getLocation();
    this.props.getTax();
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

  componentWillReceiveProps(props) {
    const { crmConfigPage } = props;
    if (crmConfigPage.listStatus !== undefined) {
      this.state.listStatus = crmConfigPage.listStatus;
    }

    if (crmConfigPage.sources !== undefined) {
      this.state.listSource = crmConfigPage.sources;
    }

    if (crmConfigPage.callAPIStatus === 1) {
      this.props.enqueueSnackbar(crmConfigPage.notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'success',
      });
    }
    if (crmConfigPage.callAPIStatus === 0) {
      this.props.enqueueSnackbar(crmConfigPage.notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    }
    this.props.onResetNotis();
  }

  mapFunction = item => ({
    ...item,
    base: item.base === false ? 'Không' : 'Có',
    reportingCurrency: item.reportingCurrency === false ? 'Không' : 'Có',
    defaultInvoicingCurrency: item.defaultInvoicingCurrency === false ? 'Không' : 'Có',
    name: (
      <Typography style={{ cursor: 'pointer' }} color="primary" onClick={() => this.getCurrency(item)}>
        {item.name}
      </Typography>
    ),
    setting: (
      <Button onClick={this.showBaseCurrency(item._id, item.base)}>
        <Reorder />
      </Button>
    ),
    edit: (
      <Fab color="primary" aria-label="Edit" size="small" onClick={() => this.getCurrency(item)}>
        <Edit />
      </Fab>
    ),
  });

  addItem = () => <Add onClick={this.handleClick}>Open Menu</Add>;

  // function status

  handleChange = (_, statusTabIndex) => {
    console.log(statusTabIndex, 'statusTabIndex')
    this.setState({ statusTabIndex })
  };

  handleChangeInputStatus = val => {
    this.setState({
      newStatus: val,
    });
  };

  handleOpenStatus = (item, isEdit) => {
    if (isEdit) {
      this.setState({
        openStatus: true,
        isEdit: isEdit,
        idChoose: item._id,
        newStatus: item.title,
      });
    } else {
      this.setState({
        openStatus: true,
        isEdit: isEdit,
        idChoose: '',
        newStatus: '',
      });
    }
  };

  handleCloseStatus = () => {
    this.setState({
      openStatus: false,
      isEdit: false,
      idChoose: '',
      newStatus: '',
    });
    this.props.onGetCRMStatus(this.state.type);
  };

  handleSubmitStatusAddEdit = () => {
    if (this.state.isEdit) {
      this.props.onEditCMRStatus(this.state.newStatus, this.state.idChoose, this.state.type);
    } else {
      this.props.onAddCRMStatus(this.state.newStatus, this.state.type);
    }
    this.handleCloseStatus();
  };

  handleOpenStatusDelete = item => {
    this.setState({
      deleteStatus: true,
      idChoose: item._id,
    });
  };

  handleCloseStatusDelete = () => {
    this.setState({
      deleteStatus: false,
      idChoose: '',
    });
  };

  handleSubmitStatusDelete = () => {
    this.props.onDeleteCRMStatus(this.state.idChoose, this.state.type);
    this.handleCloseStatusDelete();
  };

  handleOpenReturnStatus = () => {
    this.setState({
      returnStatus: true,
    });
  };

  handleCloseReturnStatus = () => {
    this.setState({
      returnStatus: false,
    });
  };

  handleSubmitStatusReturn = () => {
    this.props.onResetCRMStatus();
    this.handleCloseReturnStatus();
  };

  // function source

  handleChangeSource = (_, sourceTabIndex) => this.setState({ sourceTabIndex });

  handleChangeInputSource = val => {
    this.setState({
      newSource: val,
    });
  };

  handleOpenSource = (item, isEdit) => {
    if (isEdit) {
      this.setState({
        openSource: true,
        isEdit: isEdit,
        idChoose: item._id,
        newSource: item.title,
      });
    } else {
      this.setState({
        openSource: true,
        isEdit: isEdit,
        idChoose: '',
        newSource: '',
      });
    }
  };

  handleCloseSource = () => {
    this.setState({
      openSource: false,
      isEdit: false,
      idChoose: '',
      newSource: '',
    });
  };

  handleSubmitSourceAddEdit = () => {
    if (this.state.isEdit) {
      this.props.onEditCRMSource(this.state.newSource, this.state.idChoose, this.state.type);
    } else {
      this.props.onAddCRMSource(this.state.newSource, this.state.type);
    }
    this.handleCloseSource();
  };

  handleOpenSourceDelete = item => {
    this.setState({
      deleteSource: true,
      idChoose: item._id,
    });
  };

  handleCloseSourceDelete = () => {
    this.setState({
      deleteSource: false,
      idChoose: '',
    });
  };

  handleSubmitSourceDelete = () => {
    this.props.onDeleteCMRSource(this.state.idChoose, this.state.type);
    this.handleCloseSourceDelete();
  };

  handleOpenReturnSource = () => {
    this.setState({
      returnSource: true,
    });
  };

  handleCloseReturnSource = () => {
    this.setState({
      returnSource: false,
    });
  };

  handleSubmitSourceReturn = () => {
    this.props.onResetCRMSource();
    this.handleCloseReturnSource();
  };

  handleClick = () => {
    const openDrawer = this.state.openDrawer;
    this.setState({
      openDrawer: !openDrawer,
    });
    this.props.crmConfigPage._id;
  };

  addItemLocation = () => <Add onClick={this.handleClickLocation}>Open Menu</Add>;

  handleClickLocation = () => {
    const openDrawerLocation = this.state.openDrawerLocation;
    this.setState({
      openDrawerLocation: !openDrawerLocation,
    });
    this.props.crmConfigPage._id;
  };

  mapFunctionLocation = item => ({
    ...item,
    code: (
      <Typography style={{ cursor: 'pointer' }} color="primary" onClick={() => this.handleLocation(item)}>
        {item.code}
      </Typography>
    ),
    effective: item.effective === true ? 'Có' : 'Không',
    edit: (
      <Fab color="primary" aria-label="Edit" size="small" onClick={() => this.handleLocation(item)}>
        <Edit />
      </Fab>
    ),
  });

  handleLocation = item => {
    this.setState({
      openDrawerLocation: true,
    });
    this.props.getCurrentLocation(item);
  };

  addItemTax = () => <Add onClick={this.handleClickTax}>Open Menu</Add>;

  handleClickTax = () => {
    const openDrawerTax = this.state.openDrawerTax;
    this.setState({
      openDrawerTax: !openDrawerTax,
    });
    this.props.crmConfigPage._id;
  };

  mapFunctionTax = item => ({
    ...item,
    name: (
      <Typography style={{ cursor: 'pointer' }} color="primary" onClick={() => this.handleTax(item)}>
        {item.name}
      </Typography>
    ),
    edit: (
      <Fab color="primary" aria-label="Edit" size="small" onClick={() => this.handleTax(item)}>
        <Edit />
      </Fab>
    ),
  });

  handleTax = item => {
    this.setState({
      openDrawerTax: true,
    });
    this.props.getCurrentTax(item);
  };

  addItemTaxVAT = () => <Add onClick={this.handleClickTaxVTA}>Open Menu</Add>;

  handleClickTaxVTA = () => {
    const openDrawerTaxVAT = this.state.openDrawerTaxVAT;
    this.setState({
      openDrawerTaxVAT: !openDrawerTaxVAT,
    });
    this.props.crmConfigPage._id;
  };

  mapFunctionTaxVAT = item => ({
    ...item,
    name: (
      <Typography style={{ cursor: 'pointer' }} color="primary" onClick={() => this.handleTaxVAT(item)}>
        {item.name}
      </Typography>
    ),
    effective: item.effective === true ? 'Có' : 'Không',
    edit: (
      <Fab color="primary" aria-label="Edit" size="small" onClick={() => this.handleTaxVAT(item)}>
        <Edit />
      </Fab>
    ),
  });

  handleTaxVAT = item => {
    this.setState({
      openDrawerTaxVAT: true,
    });
    this.props.getCurrentTax(item);
  };

  getCurrency = item => {
    this.setState({
      openDrawer: true,
    });
    this.props.getCurrentCurrency(item);
  };

  showBaseCurrency = (id, base) => event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
    this.props.changeBaseCurrency(id, base);
  };

  handleClose = () => {
    this.setState({
      anchorEl: false,
    });
  };

  setBaseCurrency = () => {
    const currentBase = this.props.crmConfigPage.currency.find(item => item._id === this.props.crmConfigPage.currencyId);
    if (currentBase) this.props.changeBaseCurrency(currentBase._id, currentBase.base);
    const newCurrentBase = { ...currentBase, base: true };
    this.props.onUpdateCurrency(newCurrentBase, this.props.crmConfigPage.currencyId);
    return null;
  };

  callBack = (cmd, data, param) => {
    switch (cmd) {
      case 'add-status':
        this.props.onAddCRMStatusItem(data, param._id, this.state.type);
        break;
      case 'delete-status':
        this.props.onDeleteCRMStatusItem(data, param._id, this.state.type);
        break;
      case 'update-status':
        this.props.onUpdateCRMStatus(data, param._id, this.state.type);
        break;
      case 'update-status-index':
        this.props.onUpdateCRMStatusIndex(data, param._id);
        break;
      case 'update-source':
        this.props.onUpdateCRMSource(data, param, this.state.type);
        break;
      default:
        break;
    }
  };

  callBackImport = () => {
    const refs = window.location.href.split('/')[window.location.href.split('/').length - 1];
    this.props.onGetCRMSource(refs ? refs : this.state.type);
    this.setState({ tabIndex: 100 });
    setTimeout(() => {
      this.setState({ tabIndex: 1 });
    }, 200);
    this.setState({ importPage: false });
  };

  render() {
    const {
      statusTabIndex,
      listSource,
      listStatus,
      tabIndex,
      sourceTabIndex,
      openDrawer,
      openDrawerLocation,
      openTax,
      openDrawerTax,
      openDrawerTaxVAT,
    } = this.state;
    const { classes } = this.props;
    const {
      currency,
      sort,
      faceValue,
      exchangeRate,
      code,
      nameCurrency,
      checked,
      money,
      name,
      reportingCurrency,
      defaultInvoicingCurrency,
      base,
      isHandmade,
    } = this.props.crmConfigPage;

    const tabStyleP = {
      fontWeight: 600,
      fontFamily: `Roboto, Helvetica, Arial, sans-serif`,
      fontSize: '12px',
      margin: 0,
    };

    return (
      <div>
        <Helmet>
          <title>Cấu hình CRM</title>
          <meta name="description" content="Cấu hình CRM" />
        </Helmet>
        {/* <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting/Employee">
              CRM
            </Link>
            <Typography color="textPrimary">Cấu hình CRM</Typography>
          </Breadcrumbs>
        </Paper> */}
        <Tabs
          indicatorColor="primary"
          value={tabIndex}
          onChange={(event, value) => {
            this.setState({ tabIndex: value });
          }}
        >
          <Tab indicatorColor="primary" label={<p style={tabStyleP}>Kiểu trạng thái</p>} />
          <Tab indicatorColor="primary" label={<p style={tabStyleP}>Kiểu loại</p>} />
          {/* <Tab label="Tiền tệ" />
          <Tab label="Địa điểm" />
          <Tab label="Thuế" /> */}
          {this.props.location.pathname.replace('/', ' ') === " DocumentConfig" && <Grid container style={{ justifyContent: 'flex-end', paddingTop: 5 }}>
            <FabUI onClick={() => this.setState({ importPage: true })}>
              <Tooltip title="Tải lên">
                <ImportExport />
              </Tooltip>
            </FabUI>
          </Grid>}
        </Tabs>
        <SwipeableDrawer anchor="right" onClose={() => this.setState({ importPage: false })} open={this.state.importPage}>
          <ImportPageConfigCRM
            onClose={() => this.setState({ importPage: false })}
            module={this.props.location.pathname.replace('/', ' ')}
            callBack={() => this.callBackImport()}
          />
        </SwipeableDrawer>
        {tabIndex === 0 && (
          <div className="my-3">
            <Paper className="py-3" style={{ height: '100%' }}>
              <Grid container>
                <Grid item container sm={6} md={5} xl={3} justify="center" style={{ maxWidth: 390 }}>
                  <Grid item>
                    <CustomerVerticalTabList
                      value={statusTabIndex}
                      data={listStatus}
                      onChange={this.handleChange}
                      onChangeAdd={this.handleOpenStatus}
                      onChangeEdit={this.handleOpenStatus}
                      onChangeDelete={this.handleOpenStatusDelete}
                      onChangeUndo={this.handleOpenReturnStatus}
                    />
                  </Grid>
                </Grid>
                <Grid item sm={6} md={7} xl={9}>
                  {listStatus.map((item, index) => {
                    let renderPaper;
                    if (statusTabIndex === index && listStatus[index] !== undefined) {
                      renderPaper = (
                        <TabContainer>
                          <BusinessStatus callBack={this.callBack} data={this.state.listStatus[index]} />
                        </TabContainer>
                      );
                    }
                    return renderPaper;
                  })}
                </Grid>
              </Grid>
            </Paper>
          </div>
        )}
        {tabIndex === 1 && (
          <div className="my-3">
            <Paper className="py-3" style={{ height: '100%' }}>
              <Grid container>
                <Grid item container sm={6} md={4} xl={3} justify="center">
                  <Grid item>
                    <CustomerVerticalTabList
                      value={sourceTabIndex}
                      data={listSource}
                      onChange={this.handleChangeSource}
                      onChangeAdd={this.handleOpenSource}
                      onChangeEdit={this.handleOpenSource}
                      onChangeDelete={this.handleOpenSourceDelete}
                      onChangeUndo={this.handleOpenReturnSource}
                    />
                  </Grid>
                </Grid>
                <Grid item sm={6} md={8} xl={9} style={{ minHeight: 700 }}>
                  <div
                    style={{
                      zIndex: '0 !important',
                      boxShadow: '#c5c0c0 0.5px 1px 10px',
                      borderRadius: '0px',
                      height: '100%',
                      width: '100%',
                      paddingBottom: 40,
                      paddingTop: 10,
                      marginBottom: 10,
                    }}
                  >
                    {listSource.map((item, index) => {
                      let renderPaper
                      if (sourceTabIndex === index && listSource[index] !== undefined) {
                        renderPaper = <Status callBack={this.callBack} data={this.state.listSource[index]} />;
                      }

                      if (sourceTabIndex === index && listSource[index] !== undefined && item.code === 'vi tri so van ban') {
                        renderPaper = <WordPositionModal callBack={this.callBack} data={this.state.listSource[index]} />
                      }
                      return renderPaper;
                    })}
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </div>
        )}
        {tabIndex === 3 && (
          <div
            className="my-3"
            style={{
              display: 'flex',
            }}
          >
            {!openDrawerLocation ? (
              <Paper className="py-3" style={{ height: '100%' }}>
                <ListPage
                  disableAdd
                  disableEdit
                  deleteOption="data"
                  settingBar={[this.addItemLocation()]}
                  columns={locationColumns}
                  disableConfig
                  apiUrl={API_LOCATION}
                  mapFunction={this.mapFunctionLocation}
                />
              </Paper>
            ) : null}
          </div>
        )}
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawerLocation: false })}
          open={openDrawerLocation}
          width={window.innerWidth - 260}
        >
          <div style={{ width: window.innerWidth - 260 }}>
            {/* <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => this.setState({ openDrawerLocation: false })} aria-label="Close">
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar> */}
            <Location
              crmConfigPage={this.props.crmConfigPage}
              handleChangeLocation={(a, b) => this.props.handleChangeLocation(a, b)}
              onSaveLocation={data => {
                this.onSaveLocation(data);
              }}
              onCloseLocation={() => {
                this.onCloseLocation();
              }}
              propsAll={this.props}
            />
          </div>
        </SwipeableDrawer>
        {tabIndex === 4 && (
          <div
            className="my-3"
            style={{
              display: 'flex',
            }}
          >
            {!openDrawerTax && !openDrawerTaxVAT ? (
              <Paper className="py-3" style={{ height: '100%' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  style={{ marginLeft: 25, marginBottom: 10 }}
                  onClick={() => this.setState({ openTax: !openTax })}
                >
                  {openTax === false ? 'Thuế hóa đơn' : 'Thuế giá trị gia tăng(VAT)'}
                </Button>
                {openTax === false ? (
                  <ListPage
                    disableAdd
                    disableEdit
                    deleteOption="data"
                    settingBar={[this.addItemTax()]}
                    columns={taxColumns}
                    disableConfig
                    apiUrl={API_TAX}
                    mapFunction={this.mapFunctionTax}
                    filterFunction={item => item.isBillTax === true}
                  />
                ) : (
                  <ListPage
                    disableAdd
                    disableEdit
                    deleteOption="data"
                    settingBar={[this.addItemTaxVAT()]}
                    columns={taxVATColumns}
                    disableConfig
                    apiUrl={API_TAX}
                    mapFunction={this.mapFunctionTaxVAT}
                    filterFunction={item => item.isVATTax === true}
                  />
                )}
              </Paper>
            ) : null}
          </div>
        )}
        <SwipeableDrawer anchor="right" onClose={() => this.setState({ openDrawerTax: false })} open={openDrawerTax} width={window.innerWidth - 260}>
          <div style={{ width: window.innerWidth - 260 }}>
            {/* <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => this.setState({ openDrawerTax: false })} aria-label="Close">
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar> */}
            <Tax
              onCLoseTax={() => this.onCLoseTax()}
              crmConfigPage={this.props.crmConfigPage}
              handleChangeTax={(a, b) => this.props.handleChangeTax(a, b)}
              onSaveTax={data => this.onSaveTax(data)}
              handleSelectTax={value => this.props.handleSelectTax(value)}
              handleDiscount={(name, checked) => this.props.handleDiscount(name, checked)}
              SaveTaxLevel={data => this.SaveTaxLevel(data)}
              handleChangeTaxLevel={(name, data) => this.props.handleChangeTaxLevel(name, data)}
              getTaxlevel={(taxLevel, index) => this.props.getTaxlevel(taxLevel, index)}
              updateTaxLevel={id => this.props.updateTaxLevel(this.props.crmConfigPage, id)}
              propsAll={this.props}
            />
          </div>
        </SwipeableDrawer>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawerTaxVAT: false })}
          open={openDrawerTaxVAT}
          width={window.innerWidth - 260}
        >
          <div style={{ width: window.innerWidth - 260 }}>
            {/* <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => this.setState({ openDrawerTaxVAT: false })} aria-label="Close">
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar> */}
            <TaxVat
              crmConfigPage={this.props.crmConfigPage}
              handleDiscount={(name, checked) => this.props.handleDiscount(name, checked)}
              handleChangeTax={(a, b) => this.props.handleChangeTax(a, b)}
              onSaveTax={data => this.onSaveTax(data)}
              onCLoseTax={() => this.onCLoseTax()}
              propsAll={this.props}
            />
          </div>
        </SwipeableDrawer>

        {/* ---------------- kiểu loại add + edit ----------------------  */}

        <DialogCreateEdit
          openModal={this.state.openSource}
          handleClose={this.handleCloseSource}
          title={'Kiểu loại'}
          label={'Tên cấu hình loại'}
          isEdit={this.state.isEdit}
          value={this.state.newSource}
          onChangeInput={this.handleChangeInputSource}
          handleEdit={this.handleSubmitSourceAddEdit}
          handleAdd={this.handleSubmitSourceAddEdit}
        />

        {/* ---------------- kiểu loại delete ----------------------  */}

        <ConfirmDialog
          open={this.state.deleteSource}
          handleClose={this.handleCloseSourceDelete}
          description={'Bạn có chắc chắn xóa kiểu loại này không?'}
          handleSave={this.handleSubmitSourceDelete}
        />

        {/* ---------------- kiểu trạng thái add + edit ----------------------  */}

        <DialogCreateEdit
          openModal={this.state.openStatus}
          handleClose={this.handleCloseStatus}
          title={'Trạng thái'}
          label={'Tên cấu hình trạng thái'}
          isEdit={this.state.isEdit}
          value={this.state.newStatus}
          onChangeInput={this.handleChangeInputStatus}
          handleAdd={this.handleSubmitStatusAddEdit}
          handleEdit={this.handleSubmitStatusAddEdit}
        />

        {/* ---------------- kiểu trạng thái delete ----------------------  */}

        <ConfirmDialog
          open={this.state.deleteStatus}
          handleClose={this.handleCloseStatusDelete}
          description={'Đồng chí có chắc chắn xóa trạng thái này không?'}
          handleSave={this.handleSubmitStatusDelete}
        />

        <Menu id="simple-menu" anchorEl={this.state.anchorEl} keepMounted open={this.state.anchorEl} onClose={this.handleClose}>
          <MenuItem onClick={this.setBaseCurrency}>Làm cơ sở tiền tệ</MenuItem>
        </Menu>

        {/* ------------------------------- hoàn tác trạng thái -------------------------------------- */}
        <ConfirmDialog
          open={this.state.returnStatus}
          handleClose={this.handleCloseReturnStatus}
          description={'Đồng chí có chắc chắn hoàn tác kiểu trạng thái không?'}
          handleSave={this.handleSubmitStatusReturn}
        />

        <Menu id="simple-menu" anchorEl={this.state.anchorEl} keepMounted open={this.state.anchorEl} onClose={this.handleClose}>
          <MenuItem onClick={this.setBaseCurrency}>Làm cơ sở tiền tệ</MenuItem>
        </Menu>

        {/* ------------------------------- hoàn tác loại -------------------------------------- */}

        <ConfirmDialog
          open={this.state.returnSource}
          handleClose={this.handleCloseReturnSource}
          description={'Đồng chí có chắc chắn hoàn tác kiểu loại không?'}
          handleSave={this.handleSubmitSourceReturn}
        />
      </div>
    );
  }
  // CURRENCY

  onSave = data => {
    this.props.onAddCurrent(data);
    this.setState({
      openDrawer: false,
    });
    this.props.getCurrencyDefault();
  };

  onUpdate = data => {
    const id = this.props.crmConfigPage._id;
    if (id) {
      this.props.onUpdateCurrency(data, id);
    } else {
      this.props.onAddCurrent(data);
    }
    this.setState({
      openDrawer: false,
    });
    this.props.getCurrencyDefault();
  };

  onCLoseCurrency = () => {
    this.setState({
      openDrawer: false,
    });
    this.props.getCurrencyDefault();
  };

  handleChangeNameCurrency = (a, b) => {
    this.props.handleChangeNameCurrency(a, b);
  };

  // LOCATION

  onSaveLocation = data => {
    const id = this.props.crmConfigPage._id;
    if (id) {
      this.props.updateLocation(data, id);
    } else {
      this.props.addLocation(data);
    }
    this.setState({
      openDrawerLocation: false,
    });

    this.props.getCurrencyDefault();
  };

  onCloseLocation = () => {
    this.setState({
      openDrawerLocation: false,
    });
    this.props.getCurrencyDefault();
  };

  // Tax

  onSaveTax = data => {
    const id = this.props.crmConfigPage.idTax;
    if (id) {
      this.props.onUpdateTax(data, id);
    } else {
      this.props.addTax(data);
    }
    this.setState({
      openDrawerTax: false,
      openDrawerTaxVAT: false,
    });
    this.props.getCurrencyDefault();
  };

  onCLoseTax = () => {
    this.setState({
      openDrawerTax: false,
      openDrawerTaxVAT: false,
    });
    this.props.getCurrencyDefault();
  };

  SaveTaxLevel = data => {
    const id = this.props.crmConfigPage._id;
    if (id) {
      this.props.addTaxLevel(data, id);
    }
  };
}

CrmConfigPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  crmConfigPage: makeSelectCrmConfigPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetCRMStatus: type => {
      dispatch(fetchAllStatusAction(type));
    },
    onAddCRMStatusItem: (data, id, types) => {
      dispatch(addStatusAction(data, id, types));
    },
    onDeleteCRMStatusItem: (statusId, id, types) => {
      dispatch(deleteStatusAction(statusId, id, types));
    },
    onUpdateCRMStatus: (data, id, types) => {
      dispatch(updateStatusAction(data, id, types));
    },
    onUpdateCRMStatusIndex: (data, id) => {
      dispatch(updateStatusIndexAction(data, id));
    },
    onAddCRMStatus: (title, type) => {
      dispatch(addCRMStatusAction(title, type));
    },
    onEditCMRStatus: (body, id, types) => {
      dispatch(editCRMStatusAction(body, id, types));
    },
    onDeleteCRMStatus: (id, types) => {
      dispatch(deleteCRMStatusAction(id, types));
    },
    onResetCRMStatus: () => {
      dispatch(resetAllStatus());
    },
    // SOURCE
    onGetCRMSource: type => {
      dispatch(fetchAllSourcesAction(type));
    },
    onAddCRMSource: (title, type) => {
      dispatch(addSourceAction(title, type));
    },
    onEditCRMSource: (body, id, types) => {
      dispatch(editSourceAction(body, id, types));
    },
    onUpdateCRMSource: (newData, param, types) => {
      dispatch(updateSourcesAction(newData, param, types));
    },
    onDeleteCMRSource: (id, types) => {
      dispatch(deleteCRMSourcesAction(id, types));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
    onResetCRMSource: () => {
      dispatch(resetAllSources());
    },
    getCurrency: () => {
      dispatch(fetchAllCurrency());
    },
    onAddCurrent: data => {
      dispatch(addCurrencyAction(data));
    },
    onUpdateCurrency: (data, id) => {
      dispatch(updateCurrencyAction(data, id));
    },
    handleChangeNameCurrency: (a, b) => {
      dispatch(handleChangeNameCurrency(a, b));
    },
    onChangeNameCurrency: newCurency => {
      dispatch(onChangeNameCurrency(newCurency));
    },
    handleDiscount: (name, checked) => {
      dispatch(handleDiscount(name, checked));
    },
    getCurrentCurrency: currentCurrency => {
      dispatch(getCurrentCurrency(currentCurrency));
    },
    getMoney: () => {
      dispatch(getMoney());
    },
    getCurrencyDefault: () => {
      dispatch(getCurrencyDefault());
    },
    changeBaseCurrency: (currencyId, base) => {
      dispatch(changeBaseCurrency(currencyId, base));
    },
    // Location

    getLocation: () => {
      dispatch(getLocation());
    },
    addLocation: data => {
      dispatch(addLocation(data));
    },
    handleChangeLocation: (a, b) => {
      dispatch(handleChangeLocation(a, b));
    },
    getCurrentLocation: currentLocation => {
      dispatch(getCurrentLocation(currentLocation));
    },
    updateLocation: (data, id) => {
      dispatch(updateLocation(data, id));
    },

    // Tax
    getTax: () => {
      dispatch(getTax());
    },

    handleChangeTax: (a, b) => {
      dispatch(handleChangeTax(a, b));
    },
    addTax: data => {
      dispatch(addTax(data));
    },
    onUpdateTax: (data, id) => {
      dispatch(updateTax(data, id));
    },
    getCurrentTax: currentTax => {
      dispatch(getCurrentTax(currentTax));
    },
    handleSelectTax: value => {
      dispatch(handleSelectTax(value));
    },
    getCurrentTaxVAT: currentTaxVAT => {
      dispatch(getCurrentTaxVAT(currentTaxVAT));
    },
    addTaxLevel: (data, id) => {
      dispatch(addTaxLevel(data, id));
    },
    handleChangeTaxLevel: (name, data) => dispatch(handleChangeTaxLevel(name, data)),
    getTaxlevel: (taxLevel, index) => {
      dispatch(getTaxlevel(taxLevel, index));
    },
    updateTaxLevel: (crmConfigPage, id) => {
      const data = {
        effective: crmConfigPage.effective,
        typeCustomer: crmConfigPage.typeCustomer,
        priceTax: crmConfigPage.priceTax,
        order: crmConfigPage.order,
        selectLocation: crmConfigPage.selectLocation,
        level: crmConfigPage.level,
      };
      const taxRates = [...crmConfigPage.taxRates];
      taxRates[crmConfigPage.index] = data;
      dispatch(updateTaxLevel(taxRates, id));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'crmConfigPage', reducer });
const withSaga = injectSaga({ key: 'crmConfigPage', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(CrmConfigPage);
