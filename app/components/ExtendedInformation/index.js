/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * ExtendedInformation
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  Grid,
  TextField,
  Checkbox,
  withStyles,
  MenuItem,
  FormControlLabel,
  FormGroup,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Button,
  Fab,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import NumberFormat from 'react-number-format';
// import { FormattedMessage } from 'react-intl';

import dot from 'dot-object';
import styles from './styles';
import { viewConfigCheckForm, viewConfigHandleOnChange } from 'utils/common';
import CustomInputBase from '../Input/CustomInputBase';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onChange={onChange}
      // onValueChange={values => {
      //   onChange({
      //     target: {
      //       value: values.value,
      //     },
      //   });
      // }}
      thousandSeparator
    />
  );
}

/* eslint-disable react/prefer-stateless-function */
class ExtendedInformation extends React.Component {
  state = {
    statusPrice: false,
    statusTitleMoney: false,
    titleMoney: 0,
    commission: '',
    maximumLimit: '',
    orderLimit: '',
    isSale: false,
    salePrice: 0,
    startDayForSale: '',
    endDayForSale: '',
    methodMoney: 0,
    transferUnit: false,
    dateExpire: '',
    convertUnitArr: [],
    calculateUnitList: [],
    codeOptions: [],
    localMessages: {}
  };

  getMessages() {
    const { convertUnitArr, codeOptions, statusPrice, statusTitleMoney, titleMoney, methodMoney, commission, maximumLimit, orderLimit, isSale, salePrice, startDayForSale, endDayForSale, transferUnit, dateExpire } = this.state;
    const unitChange = [];
    if (Array.isArray(convertUnitArr) && convertUnitArr.length > 0) {
      convertUnitArr.map(item => unitChange.push({
        from: {
          unit: item.nameUnitOriginal,
          unitId: item.idUnitOriginal,
        },
        to: {
          unitId: item.idUnitExchange,
          unit: item.nameUnitExchange,
        },
        numberExchange: item.numberExchange,
        sourcePrice: item.costPriceAfterExchange,
        costPrice: item.sellPriceAfterExchange,
      }));
    }
    const additionalItems = [];
    if (Array.isArray(codeOptions) && codeOptions.length > 0) {
      codeOptions.forEach(item => {
        additionalItems.push(item.key);
      });
    }
    const body = {
      otherInfo: {
        taxInclude: statusPrice,
        commission: {
          status: statusTitleMoney,
          titleMoney: titleMoney,
          methodMoney: methodMoney,
          promotionPrice: commission,
        },
        maximumLimit: maximumLimit,
        limitOrder: orderLimit,
        isSale: isSale,
        salePrice: salePrice,
        startDayForSale: startDayForSale,
        endDayForSale: endDayForSale,
        isUnitChange: transferUnit,
        expirationDate: dateExpire,
        unitChange,
        additionalItems,
      }
    }
    const data = dot.dot(body);
    const messages = viewConfigCheckForm('Stock', data)
    // console.log('messages', messages)
    this.state.localMessages = messages;
  }

  handleChangeCheck = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChange = (e, fieldName) => {
    const { moduleCode } = this.props;
    const { localMessages } = this.state;
    const { target: { name, value } } = e;
    const messages = viewConfigHandleOnChange(moduleCode, localMessages, fieldName, value);
    this.setState({
      [name]: value,
      localMessages: messages
    });
  };

  handleAddField = () => {
    const { convertUnitArr } = this.state;
    convertUnitArr.push({
      idUnitOriginal: '',
      nameUnitOriginal: '',
      numberExchange: 0,
      idUnitExchange: '',
      nameUnitExchange: '',
      costPriceAfterExchange: 0,
      sellPriceAfterExchange: 0,
    });
    this.setState({ convertUnitArr });
  };

  handleAdditonalItems = () => {
    const { codeOptions } = this.state;
    codeOptions.push({
      key: '',
    });
    this.setState({ codeOptions });
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  componentDidUpdate() {
    const { calculateUnitList } = this.props;
    this.state.calculateUnitList = calculateUnitList || [];
    this.getMessages();
  }

  render() {
    const { classes, checkShowForm, checkRequired, name2Title } = this.props;
    const { localMessages } = this.state;
    return (
      <div>
        <div>
          <div>
            <Grid container>
              <Grid md={3}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.statusPrice}
                        onChange={this.handleChangeCheck('statusPrice')}
                        value="statusPrice"
                        color="primary"
                      />
                    }
                    label={name2Title['otherInfo.taxInclude']}
                    labelPlacement="start"
                  />
                </FormGroup>
              </Grid>
            </Grid>
            <Grid container>
              <Grid md={3}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.statusTitleMoney}
                        onChange={this.handleChangeCheck('statusTitleMoney')}
                        value="statusTitleMoney"
                        color="primary"
                      />
                    }
                    // label={getLabelName('otherInfo.commission.status', 'Stock')}
                    label={name2Title['otherInfo.commission.status']}
                    labelPlacement="start"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </div>
          <div style={{ marginTop: '40px' }}>
            {this.state.statusTitleMoney ? (
              <React.Fragment>
                <Typography align="left">
                  Phần trăm hoa hồng dựa trên giá bán hoặc lợi nhuận của một sản phẩm
                </Typography>
                <Grid container spacing={16}>
                  <Grid item md={6}>
                    <CustomInputBase
                      select
                      label={name2Title['otherInfo.commission.titleMoney']}
                      name="titleMoney"
                      value={this.state.titleMoney}
                      onChange={e => this.handleChange(e, 'otherInfo.commission.titleMoney')}
                      error={localMessages && localMessages["otherInfo.commission.titleMoney"]}
                      helperText={localMessages && localMessages["otherInfo.commission.titleMoney"]}
                      required={checkRequired["otherInfo.commission.titleMoney"]}
                      checkedShowForm={checkShowForm["otherInfo.commission.titleMoney"]}
                    >
                      <MenuItem key={0} value={0}>
                        Tỉ lệ phần trăm
                      </MenuItem>
                      <MenuItem key={1} value={1}>
                        Số tiền cố định
                      </MenuItem>
                    </CustomInputBase>
                  </Grid>
                  <Grid item md={6}>
                    <CustomInputBase
                      label={name2Title['otherInfo.commission.promotionPrice']}
                      // className={classes.textField}
                      value={this.state.commission}
                      name="commission"
                      onChange={e => this.handleChange(e, 'otherInfo.commission.promotionPrice')}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      error={localMessages && localMessages["otherInfo.commission.promotionPrice"]}
                      helperText={localMessages && localMessages["otherInfo.commission.promotionPrice"]}
                      required={checkRequired["otherInfo.commission.promotionPrice"]}
                      checkedShowForm={checkShowForm["otherInfo.commission.promotionPrice"]}
                    />
                  </Grid>
                  {this.state.titleMoney === 1 ? '' : (
                    <Grid item md={6}>
                      <CustomInputBase
                        select
                        label={name2Title['otherInfo.commission.methodMoney']}
                        name="methodMoney"
                        value={this.state.methodMoney}
                        onChange={e => this.handleChange(e, 'otherInfo.commission.methodMoney')}
                        error={localMessages && localMessages["otherInfo.commission.methodMoney"]}
                        helperText={localMessages && localMessages["otherInfo.commission.methodMoney"]}
                        required={checkRequired["otherInfo.commission.methodMoney"]}
                        checkedShowForm={checkShowForm["otherInfo.commission.methodMoney"]}
                      >
                        <MenuItem key={0} value={0}>
                          Giá bán
                    </MenuItem>
                        <MenuItem key={1} value={1}>
                          Lợi nhuận
                    </MenuItem>
                      </CustomInputBase>
                    </Grid>
                  )}
                </Grid>
                {/* {this.state.titleMoney === 1 ? (
                  ''
                ) : (
                    <div>
                      <Grid container>
                        <Grid md={6}>
                          <CustomInputBase
                            id="standard-select-currency"
                            select
                            label={name2Title['otherInfo.commission.methodMoney']}
                            name="methodMoney"
                            value={this.state.methodMoney}
                            onChange={e => this.handleChange(e, 'otherInfo.commission.methodMoney')}
                            error={localMessages && localMessages["otherInfo.commission.methodMoney"]}
                            helperText={localMessages && localMessages["otherInfo.commission.methodMoney"]}
                            required={checkRequired["otherInfo.commission.methodMoney"]}
                            checkedShowForm={checkShowForm["otherInfo.commission.methodMoney"]}
                          >
                            <MenuItem key={0} value={0}>
                              Giá bán
                          </MenuItem>
                            <MenuItem key={1} value={1}>
                              Lợi nhuận
                          </MenuItem>
                          </CustomInputBase>
                        </Grid>
                      </Grid>
                    </div>
                  )} */}
              </React.Fragment>
            ) : (
                ''
              )}

            <div>
              <CustomInputBase
                label={name2Title['otherInfo.maximumLimit']}
                className={classes.textField}
                value={this.state.maximumLimit}
                onChange={e => this.handleChange(e, 'otherInfo.maximumLimit')}
                type="number"
                name="maximumLimit"
                error={localMessages && localMessages["otherInfo.maximumLimit"]}
                helperText={localMessages && localMessages["otherInfo.maximumLimit"]}
                required={checkRequired["otherInfo.maximumLimit"]}
                checkedShowForm={checkShowForm["otherInfo.maximumLimit"]}
              />
              <CustomInputBase
                label={name2Title['otherInfo.limitOrder']}
                className={classes.textField}
                value={this.state.orderLimit}
                onChange={e => this.handleChange(e, 'otherInfo.limitOrder')}
                name="orderLimit"
                type="number"
                error={localMessages && localMessages["otherInfo.limitOrder"]}
                helperText={localMessages && localMessages["otherInfo.limitOrder"]}
                required={checkRequired["otherInfo.limitOrder"]}
                checkedShowForm={checkShowForm["otherInfo.limitOrder"]}
              />
              <FormGroup style={{ textAlign: 'left', width: '25%' }}>
                <FormControlLabel
                  control={<Checkbox checked={this.state.isSale} onChange={this.handleChangeCheck('isSale')} value="isSale" color="primary" />}
                  label={name2Title['otherInfo.isSale']}
                  labelPlacement="start"
                />
              </FormGroup>
              {this.state.isSale ? (
                <React.Fragment>
                  <CustomInputBase
                    label={name2Title['otherInfo.salePrice']}
                    className={classes.textField}
                    value={this.state.salePrice}
                    name="salePrice"
                    onChange={e => this.handleChange(e, 'otherInfo.salePrice')}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    error={localMessages && localMessages["otherInfo.salePrice"]}
                    helperText={localMessages && localMessages["otherInfo.salePrice"]}
                    required={checkRequired["otherInfo.salePrice"]}
                    checkedShowForm={checkShowForm["otherInfo.salePrice"]}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <form className={classes.container} style={{ width: '40%' }} noValidate>
                      <CustomInputBase
                        label={name2Title['otherInfo.startDayForSale']}
                        type="date"
                        value={this.state.startDayForSale}
                        name="startDayForSale"
                        onChange={e => this.handleChange(e, 'otherInfo.startDayForSale')}
                        className={classes.textField}
                        error={localMessages && localMessages["otherInfo.startDayForSale"]}
                        helperText={localMessages && localMessages["otherInfo.startDayForSale"]}
                        required={checkRequired["otherInfo.startDayForSale"]}
                        checkedShowForm={checkShowForm["otherInfo.startDayForSale"]}
                      />
                    </form>
                    <form className={classes.container} style={{ width: '40%' }} noValidate>
                      <CustomInputBase
                        label={name2Title['otherInfo.endDayForSale']}
                        type="date"
                        value={this.state.endDayForSale}
                        name="endDayForSale"
                        onChange={e => this.handleChange(e, 'otherInfo.endDayForSale')}
                        className={classes.textField}
                        error={localMessages && localMessages["otherInfo.endDayForSale"]}
                        helperText={localMessages && localMessages["otherInfo.endDayForSale"]}
                        required={checkRequired["otherInfo.endDayForSale"]}
                        checkedShowForm={checkShowForm["otherInfo.endDayForSale"]}
                      />
                    </form>
                  </div>
                </React.Fragment>
              ) : (
                  ''
                )}
            </div>
          </div>
          <div>
            <Grid container>
              <Grid md={3}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.transferUnit}
                        onChange={this.handleChangeCheck('transferUnit')}
                        value="transferUnit"
                        color="primary"
                      />
                    }
                    label={name2Title['otherInfo.isUnitChange']}
                    labelPlacement="start"
                  />
                </FormGroup>
              </Grid>
            </Grid>
            <div hidden={!this.state.transferUnit} >
              <div>
                <div>
                  {this.state.convertUnitArr.map((item, index) => (
                    <div style={{ width: '100%', marginTop: '15px' }} key={index}>
                      <div>
                        <div style={{ display: 'flex', border: '1px solid #000', background: '#f5f5f5' }}>
                          <Typography style={{ width: '16%' }}>Quy đổi từ</Typography>
                          <Typography style={{ width: '4%' }} className={classes.border}>
                            x
                          </Typography>
                          <Typography style={{ width: '16%' }}>Số lượng quy đổi</Typography>
                          <Typography style={{ width: '4%' }} className={classes.border}>
                            =
                          </Typography>
                          <Typography style={{ width: '20%' }}>Đơn vị quy đổi</Typography>
                          <Typography style={{ width: '20%' }} className={classes.border}>
                            Giá vốn sau khi quy đổi
                          </Typography>
                          <Typography style={{ width: '20%' }} className={classes.border}>
                            Giá bán sau khi quy đổi
                          </Typography>
                          <Typography style={{ width: '20%' }} />
                        </div>
                        <div style={{ display: 'flex', border: '1px solid #000' }}>
                          <TextField
                            id="standard-select-currency"
                            select
                            name="calculateUnit"
                            style={{ width: '16%' }}
                            value={item.idUnitOriginal}
                            onChange={e => this.handleChangeConvertUnit(index, 'idUnitOriginal', e)}
                            margin="normal"
                            InputProps={{
                              disableUnderline: true,
                            }}
                          >
                            {this.state.calculateUnitList.map(item => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </TextField>
                          <Typography
                            style={{ width: '4%', color: 'red', justifyContent: 'center', display: 'flex', alignItems: 'center' }}
                            className={classes.border}
                          >
                            x
                          </Typography>
                          <div style={{ width: '16%' }}>
                            <TextField
                              id="outlined-name"
                              className={classes.textField}
                              value={item.numberExchange}
                              type="number"
                              onChange={e => this.handleChangeTextExchange(index, 'numberExchange', e)}
                              margin="normal"
                              style={{ width: '90%' }}
                            />
                          </div>
                          <Typography
                            style={{ width: '4%', color: 'red', justifyContent: 'center', display: 'flex', alignItems: 'center' }}
                            className={classes.border}
                          >
                            =
                          </Typography>
                          <div style={{ width: '20%' }}>
                            <TextField
                              id="standard-select-currency"
                              select
                              name="calculateUnit"
                              style={{ width: '100%' }}
                              value={item.idUnitExchange}
                              onChange={e => this.handleChangeConvertUnit(index, 'idUnitExchange', e)}
                              margin="normal"
                              InputProps={{
                                disableUnderline: true,
                              }}
                            >
                              {this.state.calculateUnitList.map(item => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                          <div style={{ display: 'flex', width: '20%', justifyContent: 'center', alignItems: 'center' }} className={classes.border}>
                            <TextField
                              id="outlined-name"
                              className={classes.textField}
                              type="number"
                              value={item.costPriceAfterExchange}
                              onChange={e => this.handleChangeTextExchange(index, 'costPriceAfterExchange', e)}
                              margin="normal"
                              style={{ width: '60%', marginRight: '5%' }}
                            />
                            {/* <Typography>(NaN)</Typography> */}
                          </div>
                          <div style={{ display: 'flex', width: '20%', justifyContent: 'center', alignItems: 'center' }} className={classes.border}>
                            <TextField
                              id="outlined-name"
                              type="number"
                              className={classes.textField}
                              value={item.sellPriceAfterExchange}
                              onChange={e => this.handleChangeTextExchange(index, 'sellPriceAfterExchange', e)}
                              margin="normal"
                              style={{ width: '60%', marginRight: '5%' }}
                            />
                            {/* <Typography>(NaN)</Typography> */}
                          </div>
                          <div style={{ display: 'flex', width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                            <Fab size="small" color="secondary" onClick={() => this.handleDeleteConvert(index)} className={classes.margin}>
                              <Delete />
                            </Fab>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button size="small" style={{ float: 'left', marginTop: '15px' }} onClick={this.handleAddField} variant="contained" color="primary">
                    Thêm trường
                  </Button>
                </div>
              </div>
            </div>
            <CustomInputBase
              label={name2Title['otherInfo.expirationDate']}
              className={classes.textField}
              value={this.state.dateExpire}
              name="dateExpire"
              type="date"
              onChange={e => this.handleChange(e, 'otherInfo.expirationDate')}
              error={localMessages && localMessages["otherInfo.expirationDate"]}
              helperText={localMessages && localMessages["otherInfo.expirationDate"]}
              required={checkRequired["otherInfo.expirationDate"]}
              checkedShowForm={checkShowForm["otherInfo.expirationDate"]}
            />
            <Grid container style={{ marginTop: '40px' }}>
              <Grid md={3}>
                <Typography>Số mục bổ sung</Typography>
              </Grid>
              <Grid md={7}>
                <Table style={{ border: '1px solid #f5f5f5' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" style={{ width: '80%', borderRight: '1px solid #f5f5f5' }}>
                        Mã Số
                      </TableCell>
                      <TableCell align="center">Xóa</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.codeOptions.map((item, index) => (
                      <TableRow key={item.name}>
                        <TableCell style={{ borderRight: '1px solid #f5f5f5' }}>
                          <div>
                            <TextField
                              margin="normal"
                              value={item.key}
                              style={{ width: '100%' }}
                              onChange={e => this.changeCodeOption(index, e)}
                              variant="outlined"
                            />
                          </div>
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <Fab size="small" color="secondary" onClick={() => this.handleDeleteCodeOption(index)} className={classes.margin}>
                            <Delete />
                          </Fab>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* // eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <Button style={{ color: '#346086', textAlign: 'left', marginTop: '15px', cursor: 'pointer' }} onClick={this.handleAdditonalItems}>
                  Thêm số mục
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  }

  getData = () => {
    this.props.extendedInformation.data = this.state;
  };

  handleDeleteCodeOption = index => {
    const { codeOptions } = this.state;
    codeOptions.splice(index, 1);
    this.setState({ codeOptions });
  };

  changeCodeOption = (index, e) => {
    const { codeOptions } = this.state;
    codeOptions[index].key = e.target.value;
    this.setState({ codeOptions });
  };

  handleChangeConvertUnit = (index, name, e) => {
    const { convertUnitArr, calculateUnitList } = this.state;
    const unitId = e.target.value;
    // eslint-disable-next-line consistent-return
    const indexUnit = calculateUnitList.findIndex(item => {
      if (item.id === unitId) return true;
    });
    if (name === 'idUnitOriginal') {
      convertUnitArr[index].nameUnitOriginal = calculateUnitList[indexUnit].name;
    } else {
      convertUnitArr[index].nameUnitExchange = calculateUnitList[indexUnit].name;
    }
    convertUnitArr[index][name] = e.target.value;
    this.setState({ convertUnitArr });
  };

  handleDeleteConvert = index => {
    const { convertUnitArr } = this.state;
    convertUnitArr.splice(index, 1);
    this.setState({ convertUnitArr });
  };

  handleChangeTextExchange = (index, name, e) => {
    const { convertUnitArr } = this.state;
    convertUnitArr[index][name] = e.target.value;
    this.setState({ convertUnitArr });
  };
}

ExtendedInformation.propTypes = {};

export default withStyles(styles)(ExtendedInformation);
