/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-useless-escape */
/**
 *
 * CrmCollectionDetail
 *
 */

import React from 'react';
import {
  Table,
  Paper,
  TableCell,
  TableRow,
  TableBody,
  withStyles,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  TableHead,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Chip,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  OutlinedInput,
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Close } from '@material-ui/icons';
import classnames from 'classnames';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import styles from './styles';
import LoadingIndicator from '../LoadingIndicator';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
function getStyles() {
  return {
    // fontWeight: that.state.name.indexOf(name) === -1 ? that.props.theme.typography.fontWeightRegular : that.props.theme.typography.fontWeightMedium,
  };
}
function convertToSlug(text) {
  let slug;
  const title = text;
  // Lấy text từ thẻ input title

  // Đổi chữ hoa thành chữ thường
  slug = title.toLowerCase();

  // Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  // Xóa các ký tự đặt biệt
  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  // Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, '');
  // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');
  // Xóa các ký tự gạch ngang ở đầu và cuối
  slug = `@${slug}@`;
  // eslint-disable-next-line no-useless-escape
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');
  // In slug ra textbox có id “slug”
  return slug;
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const listFixedModule = [
  { code: 'Customer', moduleName: 'Khách hàng' },
  { code: 'Employee', moduleName: 'Người dùng' },
  { code: 'BusinessOpportunities', moduleName: 'Cơ hội kinh doanh' },
  { code: 'ExchangingAgreement', moduleName: 'Trao đổi thỏa thuận' },
  { code: 'Contract', moduleName: 'Hợp đồng' },
  { code: 'CostEstimate', moduleName: 'Dự toán chi phí' },
];
/* eslint-disable react/prefer-stateless-function */
class CrmCollectionDetail extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
    this.submitBtnDialog = React.createRef();
  }

  state = {
    nameField: '',
    type: 'String',
    objectRef: {
      ref: '',
      select: '',
    },
    openDialog: false,

    plugins: [
      { name: 'Automation rules', code: 'PL_SERVICES_AUTOMATION' },
      { name: 'Danh sách', code: 'PL_VIEW_LIST' },
      { name: 'Kanban', code: 'PL_VIEW_KANBAN' },
      { name: 'Lịch', code: 'PL_WIDGET_CALENDAR' },
      { name: 'Báo cáo', code: 'PL_VIEW_REPORT' },
    ],
    crmStatusName: '',
    dialogData: undefined,
    collectionSchema: undefined,
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const data = { ...props.data };
      const dialogData = Object.assign({}, data);
      if (dialogData.code === '' && dialogData.plugins.length === 0) {
        dialogData.plugins.push({ name: 'Danh sách', code: 'PL_VIEW_LIST' });
      }
      this.setState({ dialogData, collectionSchema: Object.assign({}, data.collectionSchema) });
    }
  }

  render() {
    const { plugins, dialogData, collectionSchema, crmStatusName, objectRef } = this.state;
    const { classes } = this.props;
    const crmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfigLocalStorage.find(d => d.code === objectRef.ref);
    let columns = [];
    let others = [];
    if (currentViewConfig) {
      columns = currentViewConfig && currentViewConfig.listDisplay &&   currentViewConfig.listDisplay.type && currentViewConfig.listDisplay.type.fields.type.columns;
      others = currentViewConfig.listDisplay.type.fields.type.others;
    }

    return (
      <div>
        {this.props.showLoading ? (
          <LoadingIndicator />
        ) : (
          <div style={{ marginTop: 100 }}>
            <AppBar>
              <Toolbar>
                <IconButton color="inherit" onClick={this.props.onClose} aria-label="Close">
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className={classes.BoCRM}>
                  Bộ CRM
                </Typography>
                <Button
                onClick={() => {
                  this.submitBtn.current.click();
                }}
                variant="outlined"
               color="inherit"

              >
                LƯU
              </Button>
              </Toolbar>
            </AppBar>
            <div>
              {dialogData ? (
                <Paper className={classnames(classes.paper, classes.productBlock)}>
                  <ValidatorForm style={{ width: '100%', zIndex: 0, display: 'inline' }} onSubmit={this.handleAddNewCollection}>
                    <TextValidator
                      id="outlined-name"
                      label="Tên Bộ CRM"
                      className={classes.textField}
                      value={dialogData.name}
                      name="name"
                      onChange={event => {
                        const { dialogData } = this.state;
                        dialogData.name = event.target.value;
                        this.setState({ dialogData });
                      }}
                      validators={['required', `trim`]}
                      errorMessages={['Không được để trống!', 'Không được để trống!']}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextValidator
                      disabled={!!this.props.isEditting}
                      id="outlined-name"
                      label="Mã"
                      className={classes.textField}
                      value={dialogData.code}
                      name="code"
                      onChange={event => {
                        const { dialogData } = this.state;
                        dialogData.code = event.target.value;
                        this.setState({ dialogData });
                      }}
                      validators={['required', `trim`, 'matchRegexp:^[A-Za-z0-9]+$']}
                      errorMessages={['Không được để trống!', 'Không được để trống!', 'Không được nhập kí tự đặc biệt']}
                      margin="normal"
                      variant="outlined"
                    />
                    <FormControl margin="dense" variant="outlined" className={classes.formControl} style={{ width: '90%', marginLeft: 35 }}>
                      <InputLabel htmlFor="select-multiple-chip">Plugins</InputLabel>
                      <Select
                        disabled={!!this.props.isEditting}
                        multiple
                        value={dialogData.plugins ? dialogData.plugins.map(e => e.name) : ''}
                        onChange={event => {
                          const { dialogData } = this.state;
                          const newPlugins = event.target.value.map(name => plugins[plugins.findIndex(d => d.name === name)]);
                          dialogData.plugins = newPlugins;
                          this.setState({ dialogData });
                        }}
                        name="itemPlugin"
                        input={<OutlinedInput labelWidth="60" id="select-multiple-chip" />}
                        renderValue={selected => (
                          <div className={classes.chips}>
                            {selected.map(value => (
                              <Chip key={value} label={value} className={classes.chip} />
                            ))}
                          </div>
                        )}
                        MenuProps={MenuProps}
                      >
                        {plugins.map(item => {
                          if (item.code !== 'PL_VIEW_LIST') {
                            return (
                              <MenuItem key={item.code} value={item.name} style={getStyles(item.name, this)}>
                                {item.name}
                              </MenuItem>
                            );
                          }
                        })}
                      </Select>
                    </FormControl>
                    {dialogData.plugins.findIndex(d => d.code === 'PL_VIEW_KANBAN') !== -1 ? (
                      <TextValidator
                        label="Trạng thái thẻ trực quan"
                        style={{ width: '90%', marginLeft: 35 }}
                        select
                        disabled={!!this.props.isEditting}
                        value={
                          this.props.isEditting
                            ? dialogData.plugins[dialogData.plugins.findIndex(d => d.code === 'PL_VIEW_KANBAN')].data.kanbanConfig.fromId
                            : crmStatusName
                        }
                        onChange={event => {
                          const { dialogData } = this.state;
                          dialogData.plugins[dialogData.plugins.findIndex(d => d.code === 'PL_VIEW_KANBAN')].data = {
                            kanbanConfig: { fromId: event.target.value },
                          };

                          this.setState({ dialogData, crmStatusName: event.target.value });
                        }}
                        // input={<OutlinedInput labelWidth="130" id="outlined-age-native-simple" />}
                        // MenuProps={MenuProps}
                        variant="outlined"
                        marign="normal"
                        validators={['required', `trim`]}
                        errorMessages={['Không được để trống!', 'Không được để trống!']}
                      >
                        {crmStatus.map(item => (
                          <MenuItem key={item.code} value={item.code}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </TextValidator>
                    ) : (
                      ''
                    )}
                    <div style={{ display: 'none' }}>
                      <button ref={this.submitBtn} type="submit" />
                    </div>
                  </ValidatorForm>
                </Paper>
              ) : (
                ''
              )}

              {dialogData ? (
                <Paper className={classes.paper}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, height: 30 }}>
                    <h4 className={classes.titleTable}>Trường dữ liệu</h4>
                    <Button
                      onClick={() => {
                        this.setState({ openDialog: true });
                      }}
                      size="small"
                      variant="contained"
                      color="primary"
                      style={{ marginRight: 10 }}
                    >
                      Thêm mới
                    </Button>
                  </div>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell component="th">Tên trường</TableCell>
                        <TableCell component="th" align="right">
                          Kiểu dữ liệu
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {collectionSchema ? (
                      <TableBody>
                        {Object.keys(collectionSchema).map(key => (
                          <TableRow key={key}>
                            <TableCell scope="row">{key}</TableCell>
                            <TableCell align="right">
                              <span> {collectionSchema[key]}</span>

                              <span
                                onClick={() => {
                                  const r = confirm('Đồng chí có muốn xóa trường này?');
                                  if (r) {
                                    const { collectionSchema, dialogData } = this.state;
                                    delete collectionSchema[key];
                                    dialogData.collectionSchema = collectionSchema;
                                    this.setState({ collectionSchema, dialogData });
                                  }
                                }}
                                className="close ml-3"
                                aria-hidden="true"
                              >
                                &times;
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      ''
                    )}
                  </Table>
                </Paper>
              ) : (
                ''
              )}
              {/* <Button className={classes.BTNH} onClick={this.props.onClose} variant="outlined" color="secondary" autoFocus>
                HỦY
              </Button> */}
              
              
            </div>
            <Dialog open={this.state.openDialog} onClose={this.handleClose}>
              <DialogTitle id="alert-dialog-title">Thêm mới trường</DialogTitle>
              <DialogContent style={{ width: 600 }}>
                <ValidatorForm style={{ width: '100%', zIndex: 0, display: 'inline' }} onSubmit={this.handleAddFiled}>
                  <TextValidator
                    className="my-2"
                    fullWidth
                    id="outlined-name"
                    label="Tên trường"
                    value={this.state.nameField}
                    name="nameField"
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    validators={['required', `trim`, 'matchRegexp:^[A-Za-z0-9]+$']}
                    errorMessages={['Không được để trống!', 'Không được để trống!', 'Chỉ nhận chữ và số']}
                  />
                  <FormControl fullWidth>
                    <Select
                      fullWidth
                      value={this.state.type}
                      onChange={this.handleChange}
                      name="type"
                      input={<OutlinedInput fullWidth labelWidth={this.state.labelWidth} name="age" id="outlined-age-simple" />}
                    >
                      <MenuItem value="String">String</MenuItem>
                      <MenuItem value="Number">Number</MenuItem>
                      <MenuItem value="Date">Date</MenuItem>

                      <MenuItem value="Email">Email</MenuItem>
                      <MenuItem value="Phone">Phone</MenuItem>
                      {/* <MenuItem value="JSON">JSON</MenuItem> */}
                      <MenuItem value="Boolean">Boolean</MenuItem>
                      <MenuItem value="Relation">Relation</MenuItem>
                    </Select>
                  </FormControl>
                  {this.state.type === 'Relation' ? (
                    <TextField
                      label="Chọn module liên kết"
                      fullWidth
                      className="my-2"
                      value={this.state.objectRef.ref}
                      select
                      variant="outlined"
                      onChange={event => {
                        const { objectRef } = this.state;
                        objectRef.ref = event.target.value;
                        this.setState({ objectRef });
                      }}
                    >
                      {listFixedModule.map(option => (
                        <MenuItem key={option.code} value={option.code}>
                          {option.moduleName}
                        </MenuItem>
                      ))}
                      {this.props.listModule.map(option => (
                        <MenuItem key={option.code} value={option.code}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    ''
                  )}
                  {/* {console.log(columns)} */}
                  {columns.length !== 0 ? (
                    <TextField
                      fullWidth
                      className="my-2"
                      label="Chọn trường liên kết"
                      value={this.state.objectRef.select}
                      select
                      variant="outlined"
                      onChange={event => {
                        const { objectRef } = this.state;
                        objectRef.select = event.target.value;
                        this.setState({ objectRef });
                      }}
                    >
                      {columns.map(option => (
                        <MenuItem key={option.name} value={option.name}>
                          {option.title}
                        </MenuItem>
                      ))}
                      {others.map(option => (
                        <MenuItem key={option.name} value={option.name}>
                          {option.title}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    ''
                  )}
                  <div style={{ display: 'none' }}>
                    <button ref={this.submitBtnDialog} type="submit" />
                  </div>
                </ValidatorForm>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    this.submitBtnDialog.current.click();
                  }}
                  variant="contained"
                  color="primary"
                >
                  LƯU
                </Button>
                <Button onClick={this.handleClose} variant="contained" color="secondary" autoFocus>
                  HỦY
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </div>
    );
  }

  handleClose = () => {
    const { openDialog } = this.state;
    this.setState({ openDialog: !openDialog });
  };

  handleAddFiled = () => {
    let { collectionSchema } = this.state;
    const { nameField, type, dialogData, objectRef } = this.state;
    if (nameField !== '') {
      const varField = convertToSlug(nameField);

      if (!collectionSchema) {
        collectionSchema = {};
      }
      if (type !== 'Relation') {
        collectionSchema[varField] = type;
      } else {
        collectionSchema[varField] = `Relation|{'ref':'${objectRef.ref}','select':'${objectRef.select}'}`;
      }

      dialogData.collectionSchema = { ...collectionSchema, ...dialogData.collectionSchema };
      this.setState({
        openDialog: false,
        nameField: '',
        objectRef: {
          ref: '',
          select: '',
        },
        collectionSchema,
        dialogData,
        type: 'String',
      });
    }
  };

  handleAddNewCollection = () => {
    const { dialogData } = this.state;
    if (Object.keys(dialogData.collectionSchema).length === 0) {
      this.props.onChangeSnackbar({ status: true, message: 'Đồng chí không được để danh sách trường trống!', variant: 'error' });
      return;
    }
    if (this.props.isEditting) {
      this.props.callBack('update-collection', this.state.dialogData, this.props.data);
    } else {
      this.props.callBack('add-collection', this.state.dialogData);
    }
  };
}

CrmCollectionDetail.propTypes = {
  classes: PropTypes.object,
  onClose: PropTypes.func,
  // addNewCollection: PropTypes.func,
};

export default withStyles(styles)(CrmCollectionDetail);
