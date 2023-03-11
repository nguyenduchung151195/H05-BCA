/* eslint-disable react/no-unused-state */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/**
 *
 * EditProductInfo
 *
 */

import React from 'react';

import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  Grid,
  TextField,
  withStyles,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  FormControl,
  MenuItem,
  Typography,
  Fab,
  Button,
  Paper,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { CameraAlt, Delete } from '@material-ui/icons';
import { FileUpload } from '../LifetekUi';
import styles from './styles';
import AvatarImg from '../../images/product.png';
import { getLabelName } from '../../utils/common';
import TextFieldCode from '../TextFieldCode';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigHandleOnChange } from 'utils/common';
import dot from 'dot-object';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomInputField from '../Input/CustomInputField';

/* eslint-disable react/prefer-stateless-function */
class EditProductInfo extends React.Component {
  state = {
    productId: null,
    avatar: null,
    avatarURL: '',
    tags: '',
    calculateUnit: '',
    supplier: '',
    name: '',
    productCate: '',
    origin: '',
    categoryList: [],
    code: '',
    barcode: '',
    size: '',
    description: '',
    optionsInfo: {
      isServices: false,
      isDescribe: false,
      displayCaptital: false,
      isSeri: false,
    },
    serialList: [],
    // avatarURL: null,
    errorName: false,
    errorCode: false,
    errorSize: false,
    errorUnit: false,
    errorCatalog: false,
    errorSupplier: false,
    // errorCodeBar: false,

    isSubmit: false,
    warrantyPeriod: '',
    warrantyPeriodUnit: 'months',
    localMessages: {},
  };

  time = null;

  listChil = (chil, level) => {
    if (chil.length > 0) {
      chil.forEach(item => {
        const newItem = {
          padding: `${level}`,
          id: item._id,
          name: item.name,
        };
        this.state.categoryList.push(newItem);
        if (item.child) {
          this.listChil(item.child, level + 20);
        }
      });
    }
  };

  getMessages() {
    const { calculateUnitList, originList, categoryList, suppliersList, tagsList, moduleCode } = this.props;
    const {
      avatar,
      avatarURL,
      name,
      code,
      barcode,
      isService,
      osDescription,
      isDisplaySourcePrice,
      isSerial,
      tags,
      size,
      calculateUnit,
      productCate,
      supplier,
      description,
      origin,
      serialList,
    } = this.state;
    const serials = [];
    serialList.forEach(item => {
      serials.push({
        serialNumber: item.serialName,
        price: item.value,
      });
    });
    const body = {
      avatar,
      avatarURL,
      name,
      code,
      barcode,
      isService,
      osDescription,
      isDisplaySourcePrice,
      isSerial,
      tags: tags !== '' ? (tagsList[tags] ? tagsList[tags].name : '') : '',
      size,
      unit: {
        name: calculateUnitList[calculateUnit] ? calculateUnitList[calculateUnit].name : '',
        unitId: calculateUnitList[calculateUnit] && calculateUnitList[calculateUnit].id,
      },
      catalog: {
        name: categoryList[productCate] ? categoryList[productCate].name : '',
        catalogId: categoryList[productCate] && categoryList[productCate].id,
      },
      serials,
      supplier: {
        name: suppliersList[supplier] ? suppliersList[supplier].name : '',
        supplierId: suppliersList[supplier] && suppliersList[supplier].id,
      },
      origin: {
        name: originList[origin] ? originList[origin].name : '',
        originId: originList[origin] && originList[origin].id,
      },
      description,
    };

    const data = dot.dot(body);
    const messages = viewConfigCheckForm(moduleCode, data);
    this.state.localMessages = messages;
  }

  componentDidMount() {
    this.props.onRef(this);
    this.state.isSubmit = false;
  }

  componentWillReceiveProps(props) {
    const { product } = props;
    if (Object.keys(product).length !== 0 && !this.state.isSubmit && props.product !== this.props.product) {
      this.state.productId = product._id;
      this.state.avatarURL = product.logo || '';
      this.state.name = product.name || '';
      this.state.code = product.code || '';
      this.state.barcode = product.barcode || '';
      this.state.optionsInfo.isServices = product.isService;
      this.state.optionsInfo.isDescribe = product.isDescription;
      this.state.optionsInfo.displayCaptital = product.isDisplaySourcePrice;
      this.state.optionsInfo.isSeri = product.isSerial;
      this.state.warrantyPeriod = product.warrantyPeriod;
      let serials = [];
      if (product.serials) {
        serials = product.serials.map(item => ({
          serialName: item.serialNumber,
          value: item.price,
        }));
      }
      this.state.serialList = serials;
      if (!!product.size && product.size !== '') {
        this.state.size = product.size;
      }
      if (product.tags) {
        const indexTag = this.props.tagsList.findIndex(item => {
          if (item.name === product.tags[0]) return true;
        });
        this.state.tags = indexTag === -1 ? '' : indexTag;
      }
      if (product.supplier) {
        const indexSupplier = this.props.suppliersList.findIndex(item => {
          if (item.id === product.supplier.supplierId) return true;
        });
        this.state.supplier = indexSupplier === -1 ? '' : indexSupplier;
      }
      if (product.unit) {
        const indexUnit = this.props.calculateUnitList.findIndex(item => {
          if (item.id === product.unit.unitId) return true;
        });
        this.state.calculateUnit = indexUnit === -1 ? '' : indexUnit;
      }
      if (product.catalog) {
        const indexCatalog = this.state.categoryList.findIndex(item => {
          if (item.id === product.catalog.catalogId) return true;
        });
        this.state.productCate = indexCatalog === -1 ? '' : indexCatalog;
      }
      if (product.origin) {
        const indexOrigin = this.props.originList.findIndex(item => {
          if (item.id === product.origin.originId) return true;
        });
        this.state.origin = indexOrigin === -1 ? '' : indexOrigin;
      }
      this.state.description = product.description || '';
      this.state.isSubmit = true;
    }
  }

  componentDidUpdate(props) {
    const { categoryList, product } = props;
    this.state.categoryList = [];
    categoryList.forEach(unit => {
      const newItem = {
        id: unit.id,
        name: unit.name,
      };
      this.state.categoryList.push(newItem);
      if (unit.child) {
        this.listChil(unit.child, 20);
      }
    });
    if (Object.keys(product).length !== 0 && !this.state.isSubmit && props.product !== this.props.product) {
      this.state.avatarURL = product.logo || '';
      this.state.name = product.name || '';
      this.state.code = product.code || '';
      this.state.barcode = product.barcode || '';
      this.state.optionsInfo.isServices = product.isService;
      this.state.optionsInfo.isDescribe = product.isDescription;
      this.state.optionsInfo.displayCaptital = product.isDisplaySourcePrice;
      this.state.optionsInfo.isSeri = product.isSerial;
      let serials = [];
      if (product.serials) {
        serials = product.serials.map(item => ({
          serialName: item.serialNumber,
          value: item.price,
        }));
      }
      this.state.serialList = serials;
      if (!!product.size && product.size !== '') {
        this.state.size = product.size;
      }
      if (product.tags) {
        const indexTag = this.props.tagsList.findIndex(item => {
          if (item.name === product.tags[0]) return true;
        });
        this.state.tags = indexTag === -1 ? '' : indexTag;
      }
      if (product.supplier) {
        const indexSupplier = this.props.suppliersList.findIndex(item => {
          if (item.id === product.supplier.supplierId) return true;
        });
        this.state.supplier = indexSupplier === -1 ? '' : indexSupplier;
      }
      if (product.unit) {
        const indexUnit = this.props.calculateUnitList.findIndex(item => {
          if (item.id === product.unit.unitId) return true;
        });
        this.state.calculateUnit = indexUnit === -1 ? '' : indexUnit;
      }
      if (product.catalog) {
        const indexCatalog = this.state.categoryList.findIndex(item => {
          if (item.id === product.catalog.catalogId) return true;
        });
        this.state.productCate = indexCatalog === -1 ? '' : indexCatalog;
      }
      if (product.origin) {
        const indexOrigin = this.props.originList.findIndex(item => {
          if (item.id === product.origin.originId) return true;
        });
        this.state.origin = indexOrigin === -1 ? '' : indexOrigin;
      }
      this.state.describe = product.description || '';
      this.state.isSubmit = true;
    }
    this.getMessages();
  }

  render() {
    const { classes, suppliersList, tagsList, calculateUnitList } = this.props;
    const { localMessages } = this.state;
    const { checkRequired, checkShowForm, name2Title } = this.props;
    return (
      <div>
        <Grid container>
          <Grid md={2} item>
            <div
              style={{
                // width: 200,
                // height: 200,
                display: 'flex',
                justifyContent: 'center',
                marginTop: 50,
                position: 'relative',
                borderRadius: 5,
                boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img src={this.state.avatarURL || AvatarImg} alt="Ảnh sản phẩm" className={classes.avatar} />
              <input
                accept="image/*"
                className={classes.inputAvt}
                type="file"
                onChange={this.onSelectImg}
                onMouseEnter={this.onHoverIn}
                onMouseLeave={this.onHoverOut}
                name="avatar"
              />
              <span className={classes.spanAva} style={this.state.showAva ? { opacity: 100 } : {}}>
                <CameraAlt className={classes.iconCam} />
              </span>
            </div>
          </Grid>
          <Grid md={5} item>
            <FormControl className={classes.textField}>
              <CustomInputBase
                // label={getLabelName('name', 'Stock')}
                label={name2Title.name}
                name="name"
                value={this.state.name}
                onChange={e => this.handleChangeInput(e, 'name')}
                error={localMessages && localMessages.name}
                helperText={localMessages && localMessages.name}
                required={checkRequired.name}
                checkedShowForm={checkShowForm.name}
              />

              {/* {this.state.errorName ? (
                <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                  Tên có độ dài không quá 200 kí tự và không được để trống
                </FormHelperText>
              ) : (
                  ''
                )} */}
              <CustomInputField
                type="WARRANTY_PERIOD_UNITS"
                value={{
                  period: this.state.warrantyPeriod,
                  unit: this.state.warrantyPeriodUnit,
                }}
                onChange={e =>
                  this.setState({
                    warrantyPeriod: e.period,
                    warrantyPeriodUnit: e.unit,
                  })
                }
                periodLabel={name2Title.warrantyPeriod}
                unitLabel={name2Title.warrantyPeriodUnit}
              />
            </FormControl>
            {/* <CustomInputBase
              className={classes.textField}
              label="Thời gian bảo hành"
              value={this.state.warrantyPeriod}
              onChange={e => this.setState({ warrantyPeriod: e.target.value })}
              type="date"
              error={localMessages && localMessages.warrantyPeriod}
              helperText={localMessages && localMessages.warrantyPeriod}
              required={checkRequired.warrantyPeriod}
              checkedShowForm={checkShowForm.warrantyPeriod}
            /> */}

            <FormControl className={classes.checkBoxGroup} style={{ marginTop: 37 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.optionsInfo.isServices}
                    onChange={this.handleChangeCheckbox('isServices')}
                    value="isServices"
                    color="primary"
                  />
                }
                // label={getLabelName('isService', 'Stock')}
                label={name2Title.isService}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.optionsInfo.isDescribe}
                    onChange={this.handleChangeCheckbox('isDescribe')}
                    value="isDescribe"
                    color="primary"
                  />
                }
                // label={getLabelName('isDescription', 'Stock')}
                label={name2Title.isDescription}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.optionsInfo.displayCaptital}
                    onChange={this.handleChangeCheckbox('displayCaptital')}
                    value="displayCaptital"
                    color="primary"
                  />
                }
                // label={getLabelName('isDisplaySourcePrice', 'Stock')}
                label={name2Title.isDisplaySourcePrice}
              />
              <FormControlLabel
                control={
                  <Checkbox checked={this.state.optionsInfo.isSeri} onChange={this.handleChangeCheckbox('isSeri')} value="isSeri" color="primary" />
                }
                // label={getLabelName('isSerial', 'Stock')}
                label={name2Title.isSerial}
              />
            </FormControl>
            {/* <FormControl className={classes.textField}> */}
            {this.state.optionsInfo.isSeri ? (
              <React.Fragment>
                <Typography component="p" style={{ textAlign: 'left', marginLeft: '20px' }}>
                  Các số Serial
                </Typography>
                {this.state.serialList.length > 0
                  ? this.state.serialList.map((item, index) => (
                      <Grid key={index} style={{ marginTop: '5px' }}>
                        <CustomInputBase
                          label="Số Serial"
                          // label={name2Title.serialName}
                          onChange={e => this.handleChangeSerial(index, 'serialName', e)}
                          className={classes.textField}
                          style={{ width: '40%', marginTop: 0 }}
                          value={item.serialName}
                          error={localMessages && localMessages.serialName}
                          helperText={localMessages && localMessages.serialName}
                          required={checkRequired.serialName}
                          checkedShowForm={checkShowForm.serialName}
                        />
                        &nbsp;&nbsp;
                        <CustomInputBase
                          label="Giá"
                          // label={name2Title.value}
                          type="number"
                          className={classes.textField}
                          value={item.value}
                          onChange={e => this.handleChangeSerial(index, 'value', e)}
                          style={{ width: '40%', marginTop: 0 }}
                          error={localMessages && localMessages.value}
                          helperText={localMessages && localMessages.value}
                          required={checkRequired.value}
                          checkedShowForm={checkShowForm.value}
                        />
                        <Fab size="small" color="secondary" onClick={() => this.handleDeleteSerial(index)} className={classes.margin}>
                          <Delete />
                        </Fab>
                      </Grid>
                    ))
                  : ''}
                <Button variant="contained" style={{ marginTop: '10px' }} onClick={this.handleAddSerial}>
                  Thêm
                </Button>
              </React.Fragment>
            ) : (
              ''
            )}
            <FormControl className={classes.textField}>
              <CustomInputBase
                select
                // label={getLabelName('unit.name', 'Stock')}
                label={name2Title['unit.name']}
                name="calculateUnit"
                value={this.state.calculateUnit}
                onChange={e => this.handleChangeInput(e, 'unit.name')}
                error={localMessages && localMessages['unit.name']}
                helperText={localMessages && localMessages['unit.name']}
                required={checkRequired['unit.name']}
                checkedShowForm={checkShowForm['unit.name']}
              >
                {calculateUnitList.map((item, index) => (
                  <MenuItem key={item.id} value={index}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomInputBase>
              <Link to="/Stock/config" style={{ display: 'inline-block', textAlign: 'right' }}>
                Quản lý đơn vị tính
              </Link>
            </FormControl>
            <FormControl className={classes.textField}>
              <CustomInputBase
                id="standard-select-currency"
                select
                // label={getLabelName('catalog.name', 'Stock')}
                label={name2Title['catalog.name']}
                name="productCate"
                value={this.state.productCate}
                onChange={e => this.handleChangeInput(e, 'catalog.name')}
                error={localMessages && localMessages['catalog.name']}
                helperText={localMessages && localMessages['catalog.name']}
                required={checkRequired['catalog.name']}
                checkedShowForm={checkShowForm['catalog.name']}
              >
                {this.state.categoryList.map((item, index) => (
                  <MenuItem key={item.id} value={index} style={item.padding !== 0 ? { paddingLeft: `${parseInt(item.padding, 10) * 1.5}px` } : {}}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomInputBase>

              <Link to="/Stock/config" style={{ display: 'inline', textAlign: 'right' }}>
                Quản lý danh mục sản phẩm
              </Link>
            </FormControl>
            <CustomInputBase
              select
              // label={getLabelName('origin.name', 'Stock')}
              label={name2Title['origin.name']}
              name="origin"
              value={this.state.origin}
              onChange={e => this.handleChangeInput(e, 'origin.name')}
              className={classes.textField}
              error={localMessages && localMessages['origin.name']}
              helperText={localMessages && localMessages['origin.name']}
              required={checkRequired['origin.name']}
              checkedShowForm={checkShowForm['origin.name']}
            >
              {this.props.originList.map((item, index) => (
                <MenuItem key={item.id} value={index} style={item.padding !== 0 ? { paddingLeft: `${parseInt(item.padding, 10) * 1.5}px` } : {}}>
                  {item.name}
                </MenuItem>
              ))}
            </CustomInputBase>
          </Grid>
          <Grid md={5} item>
            <FormControl className={classes.textField}>
              {/* <TextField
                label={getLabelName('code', 'Stock')}
                // className={classes.textField}
                variant="outlined"
                name="code"
                value={this.state.code}
                onChange={this.handleChangeInput}
                margin="normal"
              />
              {this.state.errorCode ? (
                <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                  Mã sản phẩm tối thiểu 5 kí tự và chỉ chứa số và kí tự chữ thường
                </FormHelperText>
              ) : (
                ''
              )} */}
              <TextFieldCode
                // label={getLabelName('code', 'Stock')}
                label={name2Title.code}
                // className={classes.textField}
                variant="outlined"
                name="code"
                value={this.state.code}
                onChange={e => this.handleChangeInput(e, 'code')}
                margin="normal"
              />
            </FormControl>
            {/* <FormControl className={classes.textField}> */}
            <CustomInputBase
              // label={getLabelName('barcode', 'Stock')}
              label={name2Title.barcode}
              className={classes.textField}
              value={this.state.barcode}
              onChange={e => this.handleChangeInput(e, 'barcode')}
              name="barcode"
              error={localMessages && localMessages.barcode}
              helperText={localMessages && localMessages.barcode}
              required={checkRequired.barcode}
              checkedShowForm={checkShowForm.barcode}
            />
            {/* {this.state.errorCodeBar ? (
                <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                  Không được để trống mã vạch sản phẩm
                </FormHelperText>
              ) : (
                ''
              )}
            </FormControl> */}
            <CustomInputBase
              select
              // label={getLabelName('tags', 'Stock')}
              label={name2Title.tags}
              name="tags"
              value={this.state.tags}
              onChange={e => this.handleChangeInput(e, 'tags')}
              className={classes.textField}
              error={localMessages && localMessages.tags}
              helperText={localMessages && localMessages.tags}
              required={checkRequired.tags}
              checkedShowForm={checkShowForm.tags}
            >
              {tagsList.map((item, index) => (
                <MenuItem key={item.id} value={index}>
                  {item.name}
                </MenuItem>
              ))}
            </CustomInputBase>
            <Link to="/Stock/config" style={{ display: 'block', textAlign: 'right', marginRight: '30px' }}>
              Quản lý loại
            </Link>
            <FormControl className={classes.textField}>
              <CustomInputBase
                // label={getLabelName('size', 'Stock')}
                label={name2Title.size}
                name="size"
                value={this.state.size}
                onChange={e => this.handleChangeInput(e, 'size')}
                error={localMessages && localMessages.size}
                helperText={localMessages && localMessages.size}
                required={checkRequired.size}
                checkedShowForm={checkShowForm.size}
              />
            </FormControl>
            {/* <TextField
              label="Nhà cung cấp"
              className={classes.textField}
              variant="outlined"
              // value={this.state.name}
              // onChange={this.handleChange('name')}
              margin="normal"
            /> */}
            <FormControl className={classes.textField}>
              <CustomInputBase
                select
                label={name2Title['supplier.name']}
                name="supplier"
                value={this.state.supplier}
                onChange={e => this.handleChangeInput(e, 'supplier.name')}
                error={localMessages && localMessages['supplier.name']}
                helperText={localMessages && localMessages['supplier.name']}
                required={checkRequired['supplier.name']}
                checkedShowForm={checkShowForm['supplier.name']}
              >
                {suppliersList.map((item, index) => (
                  <MenuItem key={item.id} value={index}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomInputBase>

              <Link to="/crm/Supplier" style={{ display: 'block', textAlign: 'right' }}>
                Quản lý nhà cung cấp
              </Link>
            </FormControl>
            <CustomInputBase
              // label={getLabelName('description', 'Stock')}
              label={name2Title.description}
              className={classes.textField}
              multiline
              rows={3}
              name="description"
              value={this.state.description}
              onChange={e => this.handleChangeInput(e, 'description')}
              error={localMessages && localMessages.description}
              helperText={localMessages && localMessages.description}
              required={checkRequired.description}
              checkedShowForm={checkShowForm.description}
            />

            <FormControl style={{ marginLeft: 15 }}>
              <FileUpload name={this.state.name} id={this.state.productId} size="4px 20px" code="Stock" />
            </FormControl>
          </Grid>
        </Grid>
      </div>
    );
  }

  handleChangeSerial = (index, name, e) => {
    // console.log(name, index, e.target.value);
    const { serialList } = this.state;
    serialList[index][name] = e.target.value;
    this.setState({ serialList });
  };

  handleDeleteSerial = index => {
    const { serialList } = this.state;
    serialList.splice(index, 1);
    this.setState({ serialList });
  };

  handleAddSerial = () => {
    const { serialList } = this.state;
    serialList.push({
      serialName: '',
      value: '',
    });
    this.setState({ serialList });
  };

  handleChangeCheckbox = name => event => {
    if (name === 'isServices') {
      this.props.handleIsServices();
    }
    const { optionsInfo } = this.state;
    const target = optionsInfo;
    /* eslint-enable */
    target[name] = event.target.checked;
    this.setState({ optionsInfo: target });
  };

  setValue = tags => {
    this.setState({ tags });
  };

  handleChangeInput = (e, fieldName) => {
    if (fieldName) {
      const { localMessages } = this.state;
      this.setState({ [e.target.name]: e.target.value });
      const messages = viewConfigHandleOnChange(this.props.moduleCode, localMessages, fieldName, e.target.value);
      this.setState({ localMessages: messages });
    }
  };

  onHoverIn = () => {
    this.setState({ showAva: true });
  };

  onHoverOut = () => {
    this.setState({ showAva: false });
  };

  // eslint-disable-next-line consistent-return
  onSelectImg = e => {
    const types = ['image/png', 'image/jpeg', 'image/gif'];
    const file = e.target.files[0];
    // k có file
    if (!file) return false;

    let checkFile = true;
    let txt = '';
    // check image type
    if (types.every(type => file.type !== type)) {
      checkFile = false;
      txt = 'File đồng chí vừa chọn không đúng định dạng';
      // check image size > 3mb
    } else if (file.size / 1024 / 1024 > 3) {
      checkFile = false;
      txt = 'Dung lượng file tối đa là 3MB';
    }

    // confirm logo
    if (!checkFile) {
      this.props.enqueueSnackbar(txt, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
    } else {
      const urlAvt = URL.createObjectURL(e.target.files[0]);
      // eslint-disable-next-line react/no-unused-state
      this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] }); // ,
    }
  };

  getData = () => {
    const { name, code, size, calculateUnit, productCate, supplier } = this.state;
    // const rex = /^[A-Za-z0-9]+$/;
    // if (
    //   name.trim() === '' ||
    //   name.trim().length > 200 ||
    //   code.trim().length < 5 ||
    //   !rex.test(code.trim()) ||
    //   size.trim() === '' ||
    //   calculateUnit === '' ||
    //   productCate === '' ||
    //   supplier === ''
    // ) {
    //   if (name.trim() === '' || name.trim().length > 200) {
    //     this.setState({ errorName: true });
    //   }
    //   if (code.trim().length < 5 || !rex.test(code.trim())) {
    //     this.setState({ errorCode: true });
    //   }
    //   if (size.trim() === '') {
    //     this.setState({ errorSize: true });
    //   }
    //   if (calculateUnit === '') {
    //     this.setState({ errorUnit: true });
    //   }
    //   if (productCate === '') {
    //     this.setState({ errorCatalog: true });
    //   }
    //   if (supplier === '') {
    //     this.setState({ errorSupplier: true });
    //   }
    //   // if (barCode.trim() === '') {
    //   //   this.setState({ errorCodeBar: true });
    //   // }
    //   this.props.handleChangeIndex(0);
    // } else {
    //   // console.log(this.state);
    //   this.setState({ isSubmit: true });
    //   this.props.productInfo.data = this.state;
    // }
    this.setState({ isSubmit: true });
    this.props.productInfo.data = this.state;
  };
}

EditProductInfo.propTypes = {
  classes: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
};

// export default withStyles(styles)(ProductInfo);
export default compose(
  withStyles(styles),
  withSnackbar,
)(EditProductInfo);
