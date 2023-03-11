/**
 *
 * UpdatePaymentRequestDialog
 *
 */

import React from 'react';
import { Grid, Dialog, DialogTitle, FormHelperText, DialogActions, DialogContent, TextField, Button, MenuItem } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
// import AsyncSelect from 'react-select/async';
// import { components } from 'react-select';
import moment from 'moment';
import { API_TASK_CONTRACT_PROJECT } from '../../config/urlConfig';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';

const date = moment().format('YYYY-MM-DD');
/* eslint-disable react/prefer-stateless-function */
class UpdatePaymentRequestDialog extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn1 = React.createRef();
    // if (this.props.taskChoose !== null) {
    //   this.loadOptions();
    // }
  }

  state = {
    currentStage: {
      name: '',
      statusPay: 0,
      timePay: date,
      amount: 0,
      contractWork: 0,
      workCompleted: {},
      currency: 'VNĐ',
      VAT: false,
      jobs: null,
      // jobChoose: {},
    },
    jobs: null,
  };

  componentWillReceiveProps(props) {
    // if (props !== this.props) {
    if (props.open !== this.props.open && props.currentStage !== null) {
      this.state.currentStage = props.currentStage;
      this.state.currentStage.timePay = moment(props.currentStage.timePay).format('YYYY-MM-DD');
      this.state.currentStage.contractWork = props.currentStage.contractWork ? props.currentStage.contractWork : null;
      const { amount } = props.currentStage;
      if (props.currentStage.currency === '%' && (Number(amount) / Number(props.totalMoney)) * 100 > 0.1) {
        this.state.currentStage.amount = (Number(amount) / Number(props.totalMoney)) * 100;
      }
    }
    // }
    if (this.props.taskChoose !== null) {
      if (this.props.edit === 'true') {
        this.loadOptions2(this.props.taskChoose);
      } else {
        this.setState({ jobs: this.props.jobs }, () => {
        });
      }
    }
  }

  loadOptions2 = value => {
    const token = localStorage.getItem('token');
    const url = `${API_TASK_CONTRACT_PROJECT}/${value.taskId}`;
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myJson => {
        this.setState({
          jobs: myJson,
        });
      });
  };

  handleChangeInputStage = e => {
    const { currentStage } = this.state;
    currentStage[e.target.name] = e.target.value;
    this.setState({ currentStage });
  };

  handleChangePrice = e => {
    const { currentStage } = this.state;
    currentStage[e.target.name] = e.target.value;
    if (currentStage.amount >= this.props.totalMoney) {
      // alert('số tiền không được vượt quá số tiền của báo giá');
    }
    this.setState({ currentStage });
  };

  handleSave = () => {
    const { currentStage } = this.state;
    if (currentStage.currency === '%') {
      const { amount } = currentStage;
      currentStage.amount = (Number(this.props.totalMoney) * Number(amount)) / 100;
    }
    // if (currentStage.amount >= this.props.totalMoney) {
    //   alert('số tiền không được vượt quá số tiền của báo giá');
    //   return;
    // }
    this.props.handleAddtoList(currentStage);
  };

  // handleChangeJobs = val => {
  //   this.setState({ contractWork: val.target.value });
  // };

  render() {
    const { intl, messages } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          fullWidth
          maxWidth="md"
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose}>
            {intl.formatMessage(messages.ycttCapnhat || { id: 'ycttCapnhat', defaultMessage: 'ycttCapnhat' })}
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <ValidatorForm style={{ width: '100%' }} onSubmit={this.handleSave}>
              <Grid item container md={12}>
                <Grid item md={12}>
                  <TextValidator
                    label={intl.formatMessage(messages.ycghGiaiDoan || { id: 'ycghGiaiDoan', defaultMessage: 'ycghGiaiDoan' })}
                    name="name"
                    value={this.state.currentStage.name}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    validators={['required', 'trim']}
                    errorMessages={[`Không được để trống`, `Không được để trống`]}
                  />
                </Grid>
                {/* &nbsp;&nbsp;&nbsp;
              <TextField
                label="Đến ngày"
                name="searchEndDay"
                type="date"
                value={this.state.searchEndDay}
                onChange={this.handleChangeInput}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                style={{ width: '100%' }}
              /> */}
                <Grid item md={12}>
                  <TextField
                    label={intl.formatMessage(messages.ycttTrangThai || { id: 'ycttTrangThai', defaultMessage: 'ycttTrangThai' })}
                    name="statusPay"
                    select
                    value={this.state.currentStage.statusPay}
                    onChange={this.handleChangeInputStage}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value={0}>
                      {intl.formatMessage(messages.ycttChuaNghiemThu || { id: 'ycttChuaNghiemThu', defaultMessage: 'ycttChuaNghiemThu' })}
                    </MenuItem>
                    <MenuItem value={2}>
                      {intl.formatMessage(messages.ycttDeNghiThanhToan || { id: 'ycttDeNghiThanhToan', defaultMessage: 'ycttDeNghiThanhToan' })}
                    </MenuItem>
                    <MenuItem value={1}>
                      {intl.formatMessage(messages.ycttDaThanhLy || { id: 'ycttDaThanhLy', defaultMessage: 'ycttDaThanhLy' })}
                    </MenuItem>

                    <MenuItem value={3}>
                      {intl.formatMessage(messages.ycttDaNghiemThu || { id: 'ycttDaNghiemThu', defaultMessage: 'ycttDaNghiemThu' })}
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item md={12}>
                  <TextValidator
                    label={intl.formatMessage(messages.ycttNgayThanhToan || { id: 'ycttNgayThanhToan', defaultMessage: 'ycttNgayThanhToan' })}
                    name="timePay"
                    type="date"
                    InputProps={{ inputProps: { min: this.props.minDay } }}
                    value={this.state.currentStage.timePay}
                    onChange={this.handleChangeInputStage}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    style={{ width: '100%', display: 'flex !important' }}
                    validators={['required', 'trim']}
                    errorMessages={[`Không được để trống`, `Không được để trống`]}
                  />
                </Grid>
                <Grid item md={12}>
                  {/* <Typography
                    style={{
                      color: 'grey',
                    }}
                  >
                    Chọn quy trình mẫu
                  </Typography>

                  <AsyncSelect
                    className={classes.reactSelect1}
                    placeholder="Tìm kiếm ..."
                    loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_TASK_CONTRACT_PROJECT)}
                    loadingMessage={() => 'Đang tải ...'}
                    components={{ Option, SingleValue }}
                    onChange={this.handleAddTemplate}
                    value={this.state.currentStage.template}
                    theme={theme => ({
                      ...theme,
                      spacing: {
                        ...theme.spacing,
                        controlHeight: '55px',
                      },
                    })}
                  /> */}

                  <TextField
                    // id="standard-select-currency"
                    select
                    // disabled={(this.props.id ? this.props.id : match.params.id) !== '1' && (this.props.id ? this.props.id : match.params.id) !== '2'}
                    label="Chọn công việc"
                    // name="belong"
                    variant="outlined"
                    name="contractWork"
                    value={this.state.currentStage.contractWork}
                    style={{ width: '100%' }}
                    onChange={this.handleChangeInputStage}

                    // helperText="Please select your currency"
                  >
                    {this.state.jobs && Array.isArray(this.state.jobs.data) 
                      ? this.state.jobs.data.map(item => (
                          <MenuItem
                            value={item._id}
                            key={item._id}
                            style={item.level !== 0 ? { paddingLeft: `${parseInt(item.level, 10) * 1.5 * 2 * 10}px` } : {}}
                          >
                            {item.name}
                          </MenuItem>
                        )) : ''}
                  </TextField>
                </Grid>
                <Grid item md={12}>
                  <TextValidator
                    label={intl.formatMessage(messages.ycttSoTien || { id: 'ycttSoTien', defaultMessage: 'ycttSoTien' })}
                    name="amount"
                    value={this.state.currentStage.amount}
                    onChange={this.handleChangePrice}
                    variant="outlined"
                    type="number"
                    style={{ width: '80%', display: 'flex !important' }}
                    margin="normal"
                    validators={['minNumber:0', this.state.currentStage.currency === '%' ? 'maxNumber: 100' : 'matchRegexp:[0-9]']}
                    errorMessages={[
                      `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                      this.state.currentStage.currency === '%'
                        ? 'Không vượt quá 100%'
                        : `${intl.formatMessage(messages.canNhapSo || { id: 'canNhapSo', defaultMessage: 'canNhapSo' })}`,
                    ]}
                  />
                  <TextField
                    // label="Ngày kí biên bản"
                    name="currency"
                    select
                    value={this.state.currentStage.currency}
                    onChange={this.handleChangeInputStage}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    style={{ width: '20%', display: 'flex !important' }}
                    margin="normal"
                  >
                    <MenuItem value="VNĐ">VNĐ</MenuItem>
                    <MenuItem value="%">%</MenuItem>
                  </TextField>
                  <FormHelperText id="component-error-text" style={this.state.amountError ? { color: 'red' } : { color: 'red', display: 'none' }}>
                    {intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}
                  </FormHelperText>
                </Grid>
                <TextField
                  label="VAT"
                  name="VAT"
                  select
                  value={this.state.currentStage.VAT}
                  onChange={this.handleChangeInputStage}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  margin="normal"
                  style={{ width: '100%', display: 'flex !important' }}
                >
                  <MenuItem value={false}>{intl.formatMessage(messages.ycttKhong || { id: 'ycttKhong', defaultMessage: 'ycttKhong' })}</MenuItem>
                  <MenuItem value>{intl.formatMessage(messages.ycttCo || { id: 'ycttCo', defaultMessage: 'ycttCo' })}</MenuItem>
                </TextField>
              </Grid>
              <div style={{ display: 'none' }}>
                <button ref={this.submitBtn1} type="submit" />
              </div>
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.submitBtn1.current.click();
              }}
              color="primary"
              variant="contained"
              autoFocus
            >
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </Button>
            <Button onClick={this.handleClose} color="secondary" variant="contained">
              {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'hủy' })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleAddTemplate = temp => {
    const choose = {
      contractWorkId: temp._id,
      name: temp.name,
    };
    const { currentStage } = this.state;
    currentStage.contractWork = choose;
    this.setState({ currentStage });
  };
}

// const Option = props => (
//   <components.Option {...props}>
//     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//       {/* <Avatar src={props.data.avatar} /> */}
//       <div style={{ marginTop: 10 }}>{props.data.name}</div>
//     </div>
//   </components.Option>
// );

// const SingleValue = ({ children, ...props }) => (
//   <components.SingleValue {...props}>
//     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//       {/* <Avatar style={{ height: 30, width: 30 }} src={props.data.avatar} /> */}
//       <div style={{ marginTop: 5 }}>{props.data.name}</div>
//     </div>
//   </components.SingleValue>
// );

UpdatePaymentRequestDialog.propTypes = {};

export default UpdatePaymentRequestDialog;
