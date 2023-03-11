/**
 *
 * ExportStockDialog
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  MenuItem,
  Dialog,
  DialogContent,
  Slide,
  Grid,
  TextField,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import NumberFormat from 'react-number-format';
import moment from 'moment';
// import { FormattedMessage } from 'react-intl';

import { convertDatetimeToDateForTextField } from '../../utils/common';
import { GET_CONTRACT } from '../../config/urlConfig';

function formatNumber(num) {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  return '';
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
    />
  );
}

/* eslint-disable react/prefer-stateless-function */
class ExportStockDialog extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
    this.state = {
      data: null,
      type: 'save',
    };
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      if (props.data !== this.props.data) {
        this.setState({ data: props.data });
        if (props.data && props.data.contract && props.data.contract !== null) {
          fetch(`${GET_CONTRACT}/${props.data.contract.contractId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
            .then(res => res.json())
            .then(result => {
              const { data } = this.state;
              data.contract.name = result.name;
              if (result.deliverimentRequest && result.deliverimentRequest.length > 0) {
                result.deliverimentRequest.forEach(item => {
                  if (String(item._id) === String(props.data.contract.contractStage)) {
                    data.contract.stageName = `Giao hàng ngày ${moment(item.timeDelivery).format('DD-MM-YYYY')}`;
                  }
                });
              }
              this.setState({ data });
            });
        }
      }
      if (props.productList && props.productList.length > 0) {
        const list = props.productList || [];
        if (list.length > 0 && this.state.data && this.state.data.products.length > 0) {
          // eslint-disable-next-line react/no-access-state-in-setstate
          const newList = this.state.data.products.map(item => {
            const x = list.find(n => n._id === item.productId);
            item.description = '';
            if (x && x.isDescription) {
              item.description = x.description;
            }
            item.code = '';
            item.unit = '';
            let totalAmount = 0;
            if (x) {
              item.code = x.code || '';
              item.unit = x.unit ? x.unit.name : '';
              const stock = x.sellingPoint.find(a => a.organizationUnitId === this.state.data.fromStock.organizationUnitId);
              if (stock) {
                totalAmount = stock.amount;
              } else {
                totalAmount = 0;
              }
            }
            item.totalAmount = totalAmount;
            if (!item.totalDelivery) {
              item.totalDelivery = item.amount;
            }
            if (!item.amountExport) {
              item.amountExport = item.amount;
            }
            item.exported = item.exported || 0;
            return item;
          });
          this.state.data.products = newList;
        }
      }
    }
  }

  render() {
    const { data } = this.state;
    return (
      <Dialog fullScreen open={this.props.open} onClose={this.props.handleClose} TransitionComponent={Transition} style={{ marginLeft: 250 }}>
        <AppBar style={{ position: 'relative' }}>
          <Toolbar>
            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
              Xuất kho
            </Typography>
            <Button
              color="inherit"
              onClick={() => {
                this.setState({ type: 'done' });
                this.submitBtn.current.click();
              }}
            >
              Hoàn thành
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                this.setState({ type: 'save' });
                this.submitBtn.current.click();
              }}
            >
              Lưu
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent style={{ padding: 30 }}>
          <Grid container item md={12} spacing={24}>
            <Grid item md={6}>
              <TextField
                label="Mã xuất kho"
                value={data ? data.code : ''}
                margin="normal"
                variant="outlined"
                style={{ width: '100%' }}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                label="Tên"
                value={data ? data.name : ''}
                margin="normal"
                variant="outlined"
                disabled
                style={{ width: '100%' }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                label="Người tạo"
                value={data ? (data.employee ? data.employee.name : '') : ''}
                margin="normal"
                variant="outlined"
                disabled
                style={{ width: '100%' }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            {data && data.customer ? (
              <Grid item md={6}>
                <TextField
                  label="Khách hàng"
                  value={data.customer ? data.customer.name : ''}
                  margin="normal"
                  disabled
                  variant="outlined"
                  style={{ width: '100%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            ) : (
              <Grid item md={6}>
                <TextField
                  label="Nhà cung cấp"
                  disabled
                  value={data ? (data.supplier ? data.supplier.name : '') : ''}
                  margin="normal"
                  variant="outlined"
                  style={{ width: '100%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            )}
            <Grid item md={6}>
              <TextField
                label="Loại xuất kho"
                disabled
                select
                value={data ? data.type : ''}
                margin="normal"
                variant="outlined"
                style={{ width: '100%' }}
                InputLabelProps={{
                  shrink: true,
                }}
              >
                <MenuItem value={0}>Xuất kho theo đơn hàng</MenuItem>
                <MenuItem value={1}>Xuất kho trực tiếp</MenuItem>
                <MenuItem value={2}>Trả hàng</MenuItem>
                <MenuItem value={4}>Xuất kho theo lô</MenuItem>
                <MenuItem value={5}>Xuất kho theo hợp đồng</MenuItem>
              </TextField>
            </Grid>
            {data && (Number(data.type) !== 1 || (Number(data.type) === 2 && Number(data.typeOfReturn) === 0)) ? (
              <Grid item md={6}>
                <TextField
                  disabled
                  label="Tên đơn xuất"
                  value={this.renderNameOfSale(data ? data.type : '')}
                  margin="normal"
                  variant="outlined"
                  style={{ width: '100%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            ) : null}
            {data && Number(data.type === 5) ? (
              <Grid item md={6}>
                <TextField
                  disabled
                  label="Giai đoạn giao hàng"
                  value={data ? data.contract.stageName : ''}
                  margin="normal"
                  variant="outlined"
                  style={{ width: '100%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            ) : null}
            <Grid item md={6}>
              <TextField
                disabled
                label="Ngày xuất"
                value={data ? convertDatetimeToDateForTextField(data.createdDate) : ''}
                margin="normal"
                type="datetime-local"
                variant="outlined"
                style={{ width: '100%' }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                disabled
                label="Kho"
                value={data ? data.fromStock.name : ''}
                margin="normal"
                variant="outlined"
                style={{ width: '100%' }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                disabled
                label="Ghi chú"
                value={data ? data.note : ''}
                margin="normal"
                variant="outlined"
                style={{ width: '100%' }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item md={12}>
              <ValidatorForm style={{ width: '100%', zIndex: 0, display: 'inline' }} onSubmit={this.handleSubmitForm}>
                <Table>
                  <TableHead>
                    <TableCell>Tên mặt hàng</TableCell>
                    <TableCell>Giá nhập</TableCell>
                    <TableCell>Đã xuất</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Đơn vị tính</TableCell>
                    <TableCell>Chiết khấu</TableCell>
                    <TableCell>Thành tiền</TableCell>
                  </TableHead>
                  <TableBody>
                    {data &&
                      data.products.map(item => {
                        const totalPrice = item.importPrice * item.amountExport - item.importPrice * item.amountExport * (item.discountPercent / 100);
                        return (
                          <TableRow key={item._id}>
                            <TableCell style={{ padding: '5px', width: '200px' }}>
                              <div>
                                <b style={{ fontSize: '16px' }}>{item.name}</b>
                                <br />
                                {`Mã sản phẩm: ${item.code}`}
                                <br />
                                {`Trong kho: ${item.totalAmount === 0 ? 0 : formatNumber(Number(item.totalAmount))}`}
                                <br />
                                {`Mô tả: ${item.description}`}
                              </div>
                            </TableCell>
                            <TableCell style={{ width: '250px' }}>{formatNumber(item.importPrice)}</TableCell>
                            <TableCell>{`${item.exported === 0 ? 0 : formatNumber(item.exported)}/${formatNumber(item.totalDelivery)}`}</TableCell>
                            <TableCell style={{ width: '250px' }}>
                              <TextValidator
                                onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amountExport')}
                                style={{ width: '100%' }}
                                value={item.amountExport}
                                type="number"
                                validators={[
                                  `required`,
                                  `minNumber:0`,
                                  `${`maxNumber:${
                                    item.totalDelivery - item.exported > item.totalAmount ? item.totalAmount : item.totalDelivery - item.exported
                                  }`}`,
                                ]}
                                errorMessages={[
                                  'Không được để trống',
                                  `Không được nhỏ hơn 0`,
                                  `Giới hạn nhập ${
                                    item.totalDelivery - item.exported > item.totalAmount ? item.totalAmount : item.totalDelivery - item.exported
                                  }`,
                                ]}
                              />
                            </TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>
                              <TextValidator
                                style={{ width: '30%' }}
                                value={item.discountPercent}
                                validators={['minNumber:0', 'maxNumber:100']}
                                errorMessages={['Không được nhỏ hơn 0', 'Không được vượt quá 100']}
                                InputProps={{
                                  inputComponent: NumberFormatCustom,
                                }}
                              />
                              %
                            </TableCell>
                            <TableCell>{formatNumber(totalPrice)}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
                <div style={{ display: 'none' }}>
                  <button ref={this.submitBtn} type="submit" />
                </div>
              </ValidatorForm>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }

  handleSubmitForm = () => {
    const { data, type } = this.state;
    data.products.forEach(item => {
      item.exported = Number(item.amountExport) + Number(item.exported || 0);
    });
    if (type === 'done') {
      data.state = 4;
    }
    this.props.onUpdateItem(data);
  };

  renderNameOfSale = type => {
    const { data } = this.state;
    if (data) {
      if (Number(type) === 0) return data.salesQuotation ? data.salesQuotation.name : '';
      if (Number(type) === 2) return data.stockImport ? data.stockImport.name : '';
      if (Number(type) === 4) return data.stockImport ? data.stockImport.name : '';
      if (Number(type) === 5) return data.contract ? data.contract.name : '';
    }
    return '';
  };

  handleOnChangeValueProductSelect = (e, id, name) => {
    const { data } = this.state;
    const { products } = data;
    const index = products.findIndex(item => item._id === id);
    // const (products[index])[name] = value;
    products[index][name] = e.target.value;
    data.products = products;
    this.setState({ data });
  };
}

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

ExportStockDialog.propTypes = {};

export default ExportStockDialog;
