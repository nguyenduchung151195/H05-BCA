/**
 *
 * Tax
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { compose } from 'redux';
// import ListPage from 'containers/ListPage';
import {
  Grid,
  withStyles,
  Paper,
  Typography,
  TextField,
  FormControl,
  Button,
  Tabs,
  Tab,
  SwipeableDrawer,
  AppBar,
  Toolbar,
  IconButton,
  FormControlLabel,
  Checkbox,
  // InputLabel,
  // Select,
  // OutlinedInput,
  // MenuItem,
  Fab,
} from '@material-ui/core';
import { Close, Add, Edit } from '@material-ui/icons';
// import styled from 'styled-components';
import { Autocomplete } from '../LifetekUi';
import List from '../List/Edit';
import styles from './styles';

import { CUSTOMER_TYPE_CODE } from '../../utils/constants';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */

const ListTab = ({ addRow, onChange, rows, columns, deleteRow, toolbar, extendRow }) => (
  <div dir="ltr">
    <Grid dir="ltr" style={{ margin: '30px 0px' }} item md={12}>
      <List addRow={addRow} onChange={onChange} rows={rows} columns={columns} deleteRow={deleteRow} toolbar={toolbar} extendRow={extendRow} />
    </Grid>
  </div>
);
class Tax extends React.Component {
  state = {
    tabIndex: 0,
    openDrawers: false,
    // selectLocation: [],
    indexLevel: 0,
  };

  render() {
    const { classes, crmConfigPage, intl } = this.props;
    const { openDrawers } = this.state;
    const { sources, typeCustomer, location } = crmConfigPage;
    const id = this.props.crmConfigPage.name;
    return (
      <div>
        {/* <AppBar className="HeaderAppBarAutomation">
          <Toolbar>
            <IconButton className="BTNAutomation" color="inherit" variant="contained" onClick={() => this.onCLoseTax()} aria-label="Close">
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
              {id === ''
                ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`}
            </Typography>
            <Button variant="outlined" color="inherit" onClick={this.onSave} type="submit">
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </Button>
          </Toolbar>
        </AppBar> */}
        <CustomAppBar
          title={
            id === ''
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới thuế phí' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật thuế phí' })}`
          }
          onGoBack={() => this.onCLoseTax()}
          onSubmit={this.onSave}
        />
        <Grid item md={12} style={{ marginTop: '70px' }}>
          <Tabs
            value={this.state.tabIndex}
            onChange={(event, value) => {
              this.setState({ tabIndex: value });
            }}
          >
            <Tab label={intl.formatMessage(messages.thue || { id: 'thue', defaultMessage: 'thue' })} />
            <Tab label={intl.formatMessage(messages.cacmucthue || { id: 'cacmucthue', defaultMessage: 'cacmucthue' })} />
          </Tabs>
          {this.state.tabIndex === 0 && (
            <div>
              <Typography variant="h6" style={{ marginTop: '20px', marginLeft: 40 }}>
                {intl.formatMessage(messages.cacmucthue || { id: 'cacmucthue', defaultMessage: 'cacmucthue' })}
              </Typography>
              <Paper className={classes.root} style={{ display: 'block', verticalAlign: 'inherit' }}>
                <FormControl className={classes.textField}>
                  <TextField
                    label={intl.formatMessage(messages.ten || { id: 'ten', defaultMessage: 'ten' })}
                    onChange={e => this.handleChangeTax('name', e.target.value)}
                    className={classes.textField}
                    value={crmConfigPage.name}
                    name="name"
                    margin="normal"
                    variant="outlined"
                    required
                  />
                </FormControl>
                <FormControl className={classes.textField}>
                  <TextField
                    label={intl.formatMessage(messages.ma || { id: 'ma', defaultMessage: 'ma' })}
                    onChange={e => this.handleChangeTax('code', e.target.value)}
                    className={classes.textField}
                    value={crmConfigPage.code}
                    name="code"
                    margin="normal"
                    variant="outlined"
                  />
                </FormControl>
                <FormControl className={classes.textField}>
                  <TextField
                    label={intl.formatMessage(messages.mieuta || { id: 'mieuta', defaultMessage: 'mieuta' })}
                    onChange={e => this.handleChangeTax('describe', e.target.value)}
                    className={classes.textField}
                    value={crmConfigPage.describe}
                    name="describe"
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows="5"
                  />
                </FormControl>
              </Paper>
            </div>
          )}
          {crmConfigPage._id
            ? this.state.tabIndex === 1 && (
                <div>
                  {!openDrawers ? (
                    <>
                      <Typography variant="h6" style={{ marginTop: '20px', marginLeft: 40 }}>
                        {intl.formatMessage(messages.cacmucthue || { id: 'cacmucthue', defaultMessage: 'cacmucthue' })} {crmConfigPage.name}
                      </Typography>
                      <Button
                        style={{ display: 'flex', alignItems: 'center' }}
                        variant="outlined"
                        color="primary"
                        className={classes.button}
                        onClick={this.handleDrawer}
                      >
                        <Add style={{ fontSize: '20px' }} />
                        {intl.formatMessage(messages.themmuc || { id: 'themmuc', defaultMessage: 'themmuc' })}
                      </Button>

                      <ListTab
                        // addRow={this.addRow('taxRates')}
                        onChange={data => this.changeTab('taxRates')(data)}
                        rows={crmConfigPage.taxRates.map((item, index) => ({
                          ...item,
                          edit: (
                            <Fab variant="contained" color="primary" size="small" onClick={() => this.editTaxLevel(item, index)}>
                              <Edit />
                            </Fab>
                          ),
                        }))}
                        columns={crmConfigPage.taxRatesColumns}
                        deleteRow={index => this.deleteRow('taxRates')(index)}
                      />
                    </>
                  ) : null}
                </div>
              )
            : null}

          <SwipeableDrawer anchor="right" onClose={() => this.setState({ openDrawers: false })} open={openDrawers} width={window.innerWidth - 260}>
            <div style={{ width: window.innerWidth - 260 }}>
              <AppBar style={{ position: 'relative' }}>
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={() => this.setState({ openDrawers: false })} aria-label="Close">
                    <Close />
                  </IconButton>
                  <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                    {/* {id === ''
                      ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                      : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`} */}
                    THÊM MỚI
                  </Typography>
                  <Button variant="contained" color="primary" onClick={this.onSaveTaxLevel} type="submit">
                    {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                  </Button>
                </Toolbar>
              </AppBar>

              <Paper style={{ marginTop: '50px' }}>
                <FormControl className={classes.textField}>
                  <TextField
                    label={intl.formatMessage(messages.thue || { id: 'thue', defaultMessage: 'thue' })}
                    className={classes.textField}
                    value={crmConfigPage.name}
                    name="name"
                    margin="normal"
                    variant="outlined"
                  />
                </FormControl>
                <FormControl className={classes.textField}>
                  <FormControlLabel
                    style={{ marginLeft: 15 }}
                    label={intl.formatMessage(messages.cohieuluc || { id: 'cohieuluc', defaultMessage: 'cohieuluc' })}
                    control={
                      <Checkbox
                        onChange={e => this.handleDiscount('effective', e.target.checked)}
                        checked={crmConfigPage.effective}
                        color="primary"
                      />
                    }
                  />
                </FormControl>
                <FormControl className={classes.textField}>
                  <TextField
                    id="outlined-select-currency-native"
                    select
                    label={intl.formatMessage(messages.loaikhachhang || { id: 'loaikhachhang', defaultMessage: 'loaikhachhang' })}
                    className={classes.textField}
                    value={typeCustomer}
                    name="typeCustomer"
                    onChange={this.handleSelect}
                    SelectProps={{
                      native: true,
                      MenuProps: {
                        className: classes.menu,
                      },
                    }}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    {sources.find(item => item.code === CUSTOMER_TYPE_CODE).data.map(item => (
                      <option value={item.title}>{item.title}</option>
                    ))}
                  </TextField>
                </FormControl>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 25, width: '95%' }}>
                  <TextField
                    style={{ marginLeft: 25, width: '95%' }}
                    label={intl.formatMessage(messages.muc || { id: 'muc', defaultMessage: 'muc' })}
                    onChange={e => this.handleChangeTax('level', e.target.value)}
                    value={crmConfigPage.level}
                    name="level"
                    margin="normal"
                    variant="outlined"
                  />
                  <span style={{ fontSize: 20 }}>%</span>
                </div>
                <FormControl className={classes.textField}>
                  <FormControlLabel
                    style={{ marginLeft: 15 }}
                    label={intl.formatMessage(messages.thuetronggia || { id: 'thuetronggia', defaultMessage: 'thuetronggia' })}
                    control={
                      <Checkbox onChange={e => this.handleDiscount('priceTax', e.target.checked)} checked={crmConfigPage.priceTax} color="primary" />
                    }
                  />
                </FormControl>
                <FormControl className={classes.textField}>
                  <TextField
                    label={intl.formatMessage(messages.thutuungdung || { id: 'thutuungdung', defaultMessage: 'thutuungdung' })}
                    onChange={e => this.handleChangeTax('order', e.target.value)}
                    className={classes.textField}
                    value={crmConfigPage.order}
                    name="order"
                    margin="normal"
                    variant="outlined"
                  />
                </FormControl>
                <FormControl className={classes.textField} style={{ width: '90%', marginLeft: 50 }}>
                  <Autocomplete
                    isMulti
                    label={intl.formatMessage(messages.chondiadiem || { id: 'chondiadiem', defaultMessage: 'chondiadiem' })}
                    select={value => this.selectLocation(value)}
                    suggestions={location.map(item => ({ ...item, locationId: item._id }))}
                    value={crmConfigPage.selectLocation}
                    optionLabel="name"
                    optionValue="locationId"
                  />
                </FormControl>
              </Paper>
              {/* <div style={{ marginLeft: '260px' }}>
                <Button variant="outlined" color="primary" className={classes.button} onClick={this.onSaveTaxLevel}>
                  {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
                </Button>
                <Button variant="outlined" color="secondary" className={classes.button} onClick={() => this.onCLoseTax()}>
                  {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'hủy' })}
                </Button>
              </div> */}
            </div>
          </SwipeableDrawer>
          {/* <div style={{ marginLeft: '260px' }}>
            <Button variant="outlined" color="primary" className={classes.button} onClick={this.onSave}>
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </Button>
            <Button variant="outlined" color="secondary" className={classes.button} onClick={() => this.onCLoseTax()}>
              {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'hủy' })}
            </Button>
          </div> */}
        </Grid>
      </div>
    );
  }

  handleChangeTax = (a, b) => {
    this.props.handleChangeTax(a, b);
  };

  selectLocation = selectLocation => {
    this.props.handleChangeTax('selectLocation', selectLocation);
  };

  onSave = () => {
    const { crmConfigPage } = this.props;
    const data = {
      _id: crmConfigPage._id,
      name: crmConfigPage.name,
      code: crmConfigPage.code,
      describe: crmConfigPage.describe,
      updatedAt: crmConfigPage.updatedAt,
      isBillTax: crmConfigPage.isBillTax,
      taxRates: crmConfigPage.taxRates,
    };
    this.props.onSaveTax(data);
  };

  onCLoseTax = () => {
    this.props.onCLoseTax();
  };

  handleDrawer = () => {
    const openDrawers = this.state.openDrawers;
    this.setState({
      openDrawers: !openDrawers,
    });
  };

  handleSelect = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    this.props.handleSelectTax(e.target.value);
  };

  // handleSelectLocation = e => {
  //   // console.log('DDD', e.target.value);

  //   const crmLocation = this.props.crmConfigPage.location;
  //   const newLocation = crmLocation.filter(ele => e.target.value.includes(ele._id)).map(item => ({ name: item.name, locationId: item._id }));
  //   console.log('LOCATION', newLocation);
  //   this.props.handleSelectTax(newLocation);
  //   // this.setState({ selectLocation: newLocation });
  // };

  handleDiscount = (name, checked) => {
    this.props.handleDiscount(name, checked);
  };

  onSaveTaxLevel = () => {
    const { crmConfigPage } = this.props;
    const id = crmConfigPage.idTax;
    // const index = crmConfigPage.index;
    // const taxRates = [...crmConfigPage.taxRates];
    // const data2 = {  effective: crmConfigPage.effective,
    //   typeCustomer: crmConfigPage.typeCustomer,
    //   priceTax: crmConfigPage.priceTax,
    //   order: crmConfigPage.order,
    //   selectLocation: crmConfigPage.selectLocation,
    //   level: crmConfigPage.level,}
    // taxRates[index] =data2;
    const data = {
      _id: crmConfigPage._id,
      code: crmConfigPage.code,
      name: crmConfigPage.name,
      describe: crmConfigPage.describe,
      exchangeRate: crmConfigPage.exchangeRate,
      taxRates: crmConfigPage.taxRates.map(item => ({ ...item, selectLocation: crmConfigPage.selectLocation })).concat({
        effective: crmConfigPage.effective,
        typeCustomer: crmConfigPage.typeCustomer,
        priceTax: crmConfigPage.priceTax,
        order: crmConfigPage.order,
        selectLocation: crmConfigPage.selectLocation,
        level: crmConfigPage.level,
      }),
      updatedAt: crmConfigPage.updatedAt,
      isBillTax: crmConfigPage.isBillTax,
    };

    // const data2 = [...crmConfigPage.tax].find(elm => elm._id === id);

    this.setState({
      openDrawers: false,
    });
    if (this.state.indexLevel === 2) {
      this.props.updateTaxLevel(id);
    } else {
      this.props.SaveTaxLevel(data);
    }
  };

  changeTab = name => data => {
    const tabData = this.props.crmConfigPage[name];
    const newTab = [...tabData];
    newTab[data.index] = { ...tabData[data.index], [data.name]: data.value };
    this.props.handleChangeTaxLevel(name, newTab);
  };

  editTaxLevel = (item, index) => {
    this.setState({
      openDrawers: true,
      indexLevel: 2,
    });
    this.props.getTaxlevel(item, index);
  };

  deleteRow = name => index => {
    const tabData = this.props.crmConfigPage[name];
    const newTab = [...tabData];
    newTab.splice(index, 1);
    this.props.handleChangeTaxLevel(name, newTab);
  };
}

Tax.propTypes = {};

export default compose(
  withStyles(styles),
)(Tax);
