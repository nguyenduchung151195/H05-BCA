/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-access-state-in-setstate */
/**
 *
 * CustomSellingPoint
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  TextField,
  Grid,
  MenuItem,
  // Button,
  // Fab,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NumberFormat from 'react-number-format';
import { LocationCity } from '@material-ui/icons';
import styles from './styles';
import DepartmentSelect from '../DepartmentSelect';
import { fetchData, flatChild } from '../../helper';
import { API_ORIGANIZATION } from '../../config/urlConfig';
import CustomInputBase from '../Input/CustomInputBase';

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
class CustomSellingPoint extends React.Component {
  state = {
    departmentList: [],
    currentTax: 0,
    isService: false,
    allowedSellingOrganization: [],
    allowedUsers: [],
  };

  handleChangeExpan = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleAddField = index => {
    const { departmentList } = this.state;
    departmentList[index].taxOptions.push({ title: `Thuế ${this.state.currentTax + 1}`, option: { name: '', value: '' } });
    this.setState({ departmentList, currentTax: this.state.currentTax + 1 });
  };

  changeStatus = (index, name) => {
    const { departmentList } = this.state;
    departmentList[index][name] = !departmentList[index][name];
    this.setState({ departmentList });
  };

  async componentDidMount() {
    this.props.onRef(this);

    // lấy dữ liệu toàn bộ id phòng ban
    const departmentsRes = await fetchData(API_ORIGANIZATION);
    const flattedDepartment = flatChild(departmentsRes);
    const ids = [];
    flattedDepartment.map(item => ids.push(item.name));
    this.setState({
      allowedSellingOrganization: ids,
    });
  }

  componentDidUpdate() {
    const { departmentList, agencyList } = this.props;
    if (this.state.departmentList.length === 0) {
      departmentList.forEach(department => {
        if (department.type === 'salePoint' || department.type === 'stock') {
          const agencyCustom = [];
          agencyList.forEach(agency => {
            agencyCustom.push({
              id: agency.index,
              name: agency.title,
              value: '',
              option: 0,
            });
          });
          const newItem = {
            id: department._id,
            name: department.name,
            code: department.code,
            agencyCustom,
            isCustom: false,
            isSale: false,
            currentQuantity: 0,
            inventoryChange: 0,
            costPrice: 0,
            sellPrice: 0,
            maximumLimit: 0,
            salePrice: 0,
            startDayForSale: '',
            endDayForSale: '',
            orderLimit: 0,
            address: '',
            taxOptions: [{ title: `Thuế`, option: { name: '', value: '' } }],
            isCustomTax: false,
          };
          this.state.departmentList.push(newItem);
        }

        if (department.child) {
          this.listChil(department.child, agencyList);
        }
      });
    }
  }

  listChil = (chil, agencyList) => {
    if (chil.length > 0) {
      chil.forEach(item => {
        if (item.type === 'salePoint' || item.type === 'stock') {
          const agencyCustom = [];
          agencyList.forEach(agency => {
            agencyCustom.push({
              id: agency.index,
              name: agency.title,
              value: '',
              option: 0,
            });
          });
          const newItem = {
            id: item._id,
            name: item.name,
            code: item.code,
            agencyCustom,
            isCustom: false,
            isSale: false,
            currentQuantity: 0,
            inventoryChange: 0,
            costPrice: 0,
            sellPrice: 0,
            maximumLimit: 0,
            salePrice: 0,
            startDayForSale: '',
            endDayForSale: '',
            orderLimit: 0,
            address: '',
            taxOptions: [{ title: `Thuế`, option: { name: '', value: '' } }],
            isCustomTax: false,
          };
          this.state.departmentList.push(newItem);
        }
        if (item.child) {
          this.listChil(item.child, agencyList);
        }
      });
    }
  };

  handleChangeInputBasicInfoMoney = (index, name, e) => {
    const { departmentList } = this.state;
    departmentList[index][name] = e.target.value;
    if (e.target.name === 'inventoryChange') {
      departmentList[index].currentQuantity = e.target.value;
    }
    this.setState({ departmentList });
  };

  handleChangeInputBasicInfo = (index, e) => {
    const { departmentList } = this.state;
    departmentList[index][e.target.name] = e.target.value;
    if (e.target.name === 'inventoryChange') {
      departmentList[index].currentQuantity = e.target.value;
    }
    this.setState({ departmentList });
  };

  render() {
    const { classes } = this.props;
    const { expanded, departmentList } = this.state;
    // console.log(this.state)
    return (
      <>
        <div style={{ marginTop: '20px' }}>
          <p>Cài đặt kho</p>
        </div>
        <div className={classes.expanDiv}>
          {departmentList.map((place, index) => (
            <ExpansionPanel expanded={expanded === place.id} onChange={this.handleChangeExpan(place.id)}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                {' '}
                <LocationCity />
                <b>
                  &nbsp;
                  {place.name}
                </b>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container>
                  <Grid md={6}>
                    {/* <TextField
                    label="Số lượng hiện tại"
                    className={classes.textField}
                    // value={this.state.props.currentCount}
                    name="currentCount"
                    // onChange={this.handleChange('name')}
                    margin="normal"
                  /> */}
                    {this.state.isService === false ? (
                      <React.Fragment>
                        <Typography style={{ textAlign: 'left', fontSize: '13px', marginLeft: '15px' }}>
                          Số lượng hiện tại: {place.currentQuantity}
                        </Typography>
                        <TextField
                          label="Thêm bớt hàng tồn kho"
                          className={classes.textField}
                          onChange={e => this.handleChangeInputBasicInfo(index, e)}
                          name="inventoryChange"
                          variant="outlined"
                          type="number"
                          margin="normal"
                        />
                        <TextField
                          label="Hạn mức tối đa"
                          className={classes.textField}
                          type="number"
                          variant="outlined"
                          onChange={e => this.handleChangeInputBasicInfo(index, e)}
                          name="maximumLimit"
                          margin="normal"
                        />
                        <TextField
                          label="Hạn mức đặt hàng"
                          className={classes.textField}
                          type="number"
                          variant="outlined"
                          onChange={e => this.handleChangeInputBasicInfo(index, e)}
                          name="orderLimit"
                          margin="normal"
                        />
                      </React.Fragment>
                    ) : (
                      ''
                    )}

                    <TextField
                      label="Địa điểm tại cửa hàng"
                      className={classes.textField}
                      variant="outlined"
                      onChange={e => this.handleChangeInputBasicInfo(index, e)}
                      name="address"
                      margin="normal"
                    />
                  </Grid>
                  <Grid md={6}>
                    <FormGroup style={{ marginLeft: 40, marginTop: 40 }}>
                      <FormControlLabel
                        control={<Checkbox color="primary" value={place.isCustom} onChange={() => this.changeStatus(index, 'isCustom')} />}
                        label="Thay đổi giá"
                      />
                      <div hidden={!place.isCustom}>
                        <div>
                          <TextField
                            style={{ marginTop: 8 }}
                            label="Giá vốn (chưa bao gồm thuế)"
                            className={classes.textField}
                            variant="outlined"
                            onChange={e => this.handleChangeInputBasicInfoMoney(index, 'costPrice', e)}
                            margin="normal"
                            name="costPrice"
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                          <TextField
                            label="Giá bán"
                            className={classes.textField}
                            variant="outlined"
                            onChange={e => this.handleChangeInputBasicInfoMoney(index, 'sellPrice', e)}
                            margin="normal"
                            name="sellPrice"
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                            }}
                          />
                        </div>
                        {place.agencyCustom.map((item, indexAgency) => (
                          <div style={{ display: 'flex' }} key={item.id}>
                            <span style={{ marginTop: 44, width: 150 }}>{item.name}</span>
                            <TextField
                              id="standard-select-currency"
                              select
                              // label="Đơn vị tính"
                              variant="outlined"
                              value={item.option}
                              onChange={e => this.handleChangeOption(index, indexAgency, e)}
                              className={classes.textField}
                              style={{ width: '30%' }}
                              margin="normal"
                            >
                              <MenuItem key={0} value={0}>
                                Giá tính theo tiền
                              </MenuItem>
                              <MenuItem key={0} value={1}>
                                Giá tính theo %
                              </MenuItem>
                            </TextField>
                            <TextField
                              label="Giá bán"
                              className={classes.textField}
                              variant="outlined"
                              onChange={e => this.handleChangeValue(index, indexAgency, e)}
                              margin="normal"
                              style={{ marginTop: 20, width: '30%' }}
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </FormGroup>
                    <FormGroup style={{ marginLeft: 40 }}>
                      <FormControlLabel
                        control={<Checkbox value={place.isSale} onChange={() => this.changeStatus(index, 'isSale')} color="primary" />}
                        label="Khuyến mại"
                      />
                      <div hidden={!place.isSale}>
                        <CustomInputBase
                          label="Giá khuyến mại"
                          className={classes.textField}
                          onChange={e => this.handleChangeInputBasicInfoMoney(index, 'salePrice', e)}
                          margin="normal"
                          name="salePrice"
                          InputProps={{
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                        <CustomInputBase
                          label="Ngày bắt đầu giảm giá"
                          type="date"
                          className={classes.textField}
                          onChange={e => this.handleChangeInputBasicInfo(index, e)}
                          name="startDayForSale"
                          margin="normal"
                        />
                        <CustomInputBase
                          label="Ngày kết thúc"
                          type="date"
                          className={classes.textField}
                          onChange={e => this.handleChangeInputBasicInfo(index, e)}
                          name="endDayForSale"
                          margin="normal"
                        />
                      </div>
                    </FormGroup>
                    <FormGroup style={{ marginLeft: 40 }}>
                      <FormControlLabel
                        control={<Checkbox value={place.isCustomTax} onChange={() => this.changeStatus(index, 'isCustomTax')} color="primary" />}
                        label="Thay đổi thuế mặc định"
                      />
                      <div hidden={!place.isCustomTax}>
                        {place.taxOptions.length > 0
                          ? place.taxOptions.map((item, indexTax) => (
                            <div style={{ display: 'flex' }} key={indexTax}>
                              <span style={{ marginTop: 44, width: 150 }}>{item.title} </span>

                              <CustomInputBase
                                label="Tên thuế"
                                onChange={e => this.handleChangeOptionTaxName(index, indexTax, e)}
                                style={{ marginTop: 16, width: '50%' }}
                                className={classes.textField}
                                value={item.option.name}
                                margin="normal"
                              />
                              <CustomInputBase
                                label="%"
                                style={{ marginTop: 16, width: '50%' }}
                                onChange={e => this.handleChangeOptionTaxValue(index, indexTax, e)}
                                className={classes.textField}
                                value={item.option.value}
                                margin="normal"
                                type="number"
                              />
                              {/* <Fab
                              size="small"
                              color="secondary"
                              onClick={() => this.handleDeleteTax(index, indexTax)}
                              style={{ marginTop: 20, width: '10%' }}
                              className={classes.margin}
                            >
                              <Delete />
                            </Fab> */}
                            </div>
                          ))
                          : ''}
                        {/* <Button size="small" style={{ float: 'left' }} onClick={() => this.handleAddField(index)} variant="contained" color="primary">
                        Thêm trường
                      </Button> */}
                      </div>
                    </FormGroup>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </div>
        <DepartmentSelect
          title="Cài đặt điểm bán hàng"
          allowedDepartmentIds={this.state.allowedSellingOrganization}
          onChange={this.handleChangeAllowedSellingOrganization}
          allowedUsers={this.state.allowedUsers}
          onAllowedUsersChange={this.handleChangeAllowedUsers}
        />
      </>
    );
  }

  handleDeleteTax = (index, indexTax) => {
    const { departmentList } = this.state;
    departmentList[index].taxOptions.splice(indexTax, 1);
    this.setState({ departmentList });
  };

  handleChangeAllowedUsers = value => {
    // console.log('allowedUsers', value);
    this.setState({ allowedUsers: value });
  };

  handleChangeAllowedSellingOrganization = value => {
    this.setState({ allowedSellingOrganization: value });
  };

  handleChangeIsService = () => {
    this.setState({ isService: !this.state.isService });
  };

  handleChangeOption = (index, indexAgency, e) => {
    const { departmentList } = this.state;
    departmentList[index].agencyCustom[indexAgency].option = e.target.value;
    this.setState({ departmentList });
  };

  handleChangeOptionTaxName = (index, indexTax, e) => {
    const { departmentList } = this.state;
    departmentList[index].taxOptions[indexTax].option.name = e.target.value;
    this.setState({ departmentList });
  };

  handleChangeOptionTaxValue = (index, indexTax, e) => {
    const { departmentList } = this.state;
    departmentList[index].taxOptions[indexTax].option.value = e.target.value;
    this.setState({ departmentList });
  };

  handleChangeValue = (index, indexAgency, e) => {
    const { departmentList } = this.state;
    departmentList[index].agencyCustom[indexAgency].value = e.target.value;
    this.setState({ departmentList });
  };

  getData = () => {
    this.props.customSellingPoint.data = this.state.departmentList;
    this.props.customSellingPoint.allowedSellingOrganization = this.state.allowedSellingOrganization;
    this.props.customSellingPoint.allowedUsers = this.state.allowedUsers;
  };
}

CustomSellingPoint.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(CustomSellingPoint);
