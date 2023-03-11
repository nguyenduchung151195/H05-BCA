/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
/**
 *
 * HocCollectionDialog
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Slide,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  DialogActions,
  DialogTitle,
  OutlinedInput,
  FormControl,
  MenuItem,
  TextField,
  Select,
  InputLabel,
  Checkbox,
  ListItemText,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  Radio,
  InputAdornment,
} from '@material-ui/core';
import { Close, CloudDownload, Delete } from '@material-ui/icons';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import axios from 'axios';
import GridMUI from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import moment from 'moment';
import dot from 'dot-object';
import KanbanStepper from '../KanbanStepper';
import { API_USERS, API_CUSTOMERS, API_BOS, API_TRADINGS, GET_CONTRACT, UPLOAD_IMG_SINGLE, API_EXPENSES, API_DOCS } from '../../config/urlConfig';
import { serialize } from '../../utils/common';
/* eslint-disable react/prefer-stateless-function */
const stylePaper = {
  paperFullScreen: { marginLeft: 260 },
  appBar: {
    left: 260,
    width: 'calc(100% - 260px)',
    zIndex: '999 !important'
  },
  flex: {
    flex: 1,
  },
  // paperFullScreen: { maxWidth: 'calc(100% - 260px)' },
};
function Transition(props) {
  return <Slide direction="left" {...props} />;
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
const listAPIUrl = [
  { ref: 'Customer', url: API_CUSTOMERS },
  { ref: 'Employee', url: API_USERS },
  { ref: 'BusinessOpportunities', url: API_BOS },
  { ref: 'ExchangingAgreement', url: API_TRADINGS },
  { ref: 'Contract', url: GET_CONTRACT },
  { ref: 'CostEstimate', url: API_EXPENSES },
];
const promiseOptions = (searchString, putBack, ref) => {
  // console.log(searchString);
  // console.log(ref);
  const param = {
    limit: '10',
    skip: '0',
  };
  if (searchString !== '') {
    param.filter = {
      name: { $regex: searchString, $options: 'gi' },
    };
  }

  let currentAPIUrl = '';
  if (listAPIUrl.findIndex(d => d.ref === ref) !== -1) {
    currentAPIUrl = listAPIUrl[listAPIUrl.findIndex(d => d.ref === ref)].url;
  } else {
    currentAPIUrl = `${API_DOCS}/${ref}`;
  }

  // putBack([{ label: 'test' }]);
  const token = localStorage.getItem('token');
  axios
    .get(`${currentAPIUrl}?${serialize(param)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const convertedData = [];
      response.data.data.map(item => convertedData.push({ ...item, ...{ label: item.name, value: item._id } }));

      putBack(convertedData);
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      // console.log(err);
    });
};

class HocCollectionDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogData: {},
      viewConfig: [],
      listRelationRef: [],
      openFieldDialog: false,
      others: [],
      nameField: '',
      type: 'String',
      fromSource: '',
    };
    this.submitBtn = React.createRef();
  }

  componentDidMount() {
    const { viewConfig } = this.props;
    const listRelationRef = [];
    // console.log('run to willreceiveprops');
    if (this.props.isEditting) {
      this.setState({ dialogData: Object.assign({}, this.props.editData), viewConfig: viewConfig.filter(item => item.name !== 'state') });
    } else {
      this.setState({
        viewConfig,
      });
      this.state.dialogData.others = {};
    }
    viewConfig.filter(item => item.name !== 'state').forEach(element => {
      if (element.type.includes('Relation')) {
        let ref = '';
        ref = element.type.replace('Relation|', '');
        ref = ref.replace(/'/g, '"');
        const objectRef = JSON.parse(ref);
        // console.log(objectRef);
        // const indexOfRef = listRelationRef.findIndex(d => d.ref === objectRef.ref);

        // if (indexOfRef === -1) {
        //   listRelationRef.push({ ref: objectRef.ref, arrSelect: [objectRef.select] });
        // } else {
        //   // console.log(listRelationRef[indexOfRef]);
        //   listRelationRef[indexOfRef].arrSelect.push(objectRef.select);
        // }
        listRelationRef.push({ ref: objectRef.ref, title: element.title, name: element.name, arrSelect: [objectRef.select] });
        if (this.props.isEditting && this.props.editData[element.name]) {
          fetch(`${API_DOCS}/${objectRef.ref}/${this.props.editData[element.name]}`, {
            // Your POST endpoint
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
            .then(
              response => response.json(), // if the response is a JSON object
            )
            .then(success => {
              const { dialogData } = this.state;
              if (success.stack) {
                dialogData[element.name] = { name: 'Đối tượng đã bị xóa, cần chọn lại!', value: this.props.editData[element.name] };
              } else {
                dialogData[element.name] = success;
              }
              this.setState({ dialogData });
            })
            .catch(
              // eslint-disable-next-line no-unused-vars
              error => {
                // console.log(error);
                // eslint-disable-next-line no-alert
                // alert(error);
              }, // Handle the error response object
            );
        }
      }
      if (!this.props.isEditting && element.type === 'Date') {
        this.state.dialogData[element.name] = this.props.date || new Date();
      }
    });
    this.setState({ listRelationRef });
  }

  handleChangeSelect = (selectedOption, name) => {
    const { dialogData } = this.state;
    // viewConfig.forEach(element => {
    //   if (element.type.includes(ref)) {
    //     dialogData[element.name] = selectedOption._id;
    //   }
    //   this.setState({ dialogData });
    // });
    dialogData[name] = selectedOption;
    this.setState({ dialogData });
  };

  render() {
    const { isEditting, classes } = this.props;
    const { viewConfig, openFieldDialog, others, listRelationRef, dialogData } = this.state;
    const listSources = JSON.parse(localStorage.getItem('crmSource'));
    return (
      <div>
        <Dialog
          classes={{ paperFullScreen: classes.paperFullScreen }}
          fullScreen
          maxWidth="md"
          fullWidth
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={() => {
                  this.props.handleClose();
                  this.setState({ others: [] });
                }}
                aria-label="Close"
              >
                <Close />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                {this.props.dialogTitle
                  ? isEditting
                    ? `Chỉnh sửa`
                    : `Thêm mới`
                  : isEditting
                    ? 'Chỉnh sửa'
                    : 'Thêm mới'}
              </Typography>
              <Button
                color="inherit"
                variant='outlined'
                onClick={
                  () => {
                    this.submitBtn.click();
                  }
                }
              >
                {isEditting ? 'Lưu' : 'LƯU'}
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <ValidatorForm
              style={{ marginTop: 88 }}
              onSubmit={() => {
                const { dialogData, listRelationRef } = this.state;
                listRelationRef.forEach(item => {
                  if (typeof dialogData[item.name] === 'object') {
                    dialogData[item.name] = dialogData[item.name]._id;
                  }
                });
                if (this.props.arrKanban && this.props.arrKanban.length > 0 && !this.state.dialogData.kanbanStatus) {
                  this.state.dialogData.kanbanStatus = this.props.arrKanban[0]._id;
                }
                isEditting
                  ? this.props.callBack('update', this.state.dialogData, others)
                  : this.props.callBack('create-new', this.state.dialogData, others);
                this.setState({ others: [] });
              }}
            >
              {this.props.arrKanban && this.props.arrKanban.length > 0 ? (
                <KanbanStepper
                  listStatus={this.props.arrKanban}
                  onKabanClick={value => {
                    const { dialogData } = this.state;
                    dialogData.kanbanStatus = value;
                    this.setState({ dialogData });
                  }}
                  activeStep={dialogData.kanbanStatus ? dialogData.kanbanStatus : this.props.arrKanban[0]._id}
                />
              ) : null}
              <GridMUI container alignItems="center" className="mt-5">
                {viewConfig
                  ? viewConfig.map(item => {
                    if (item.name !== 'kanbanStatus') {
                      return (
                        <GridMUI item sm={12}>
                          {this.renderFieldByType(item)}
                        </GridMUI>
                      );
                    }
                  })
                  : ''}
                {others
                  ? others.map(item => (
                    <GridMUI item sm={12}>
                      {this.renderFieldByType(item)}
                    </GridMUI>
                  ))
                  : ''}
                {listRelationRef
                  ? listRelationRef.map(item => (
                    <GridMUI container alignItems="center">
                      <GridMUI item sm={12} style={{ marginTop: '5px' }}>
                        <p>{item.title}</p>
                      </GridMUI>
                      <GridMUI item sm={12}>
                        <AsyncSelect
                          defaultOptions
                          onChange={selectedOption => {
                            this.handleChangeSelect(selectedOption, item.name);
                          }}
                          value={dialogData[item.name] || null}
                          components={{
                            Option,
                            SingleValue: ({ children, ...props }) => (
                              <components.SingleValue {...props}>
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                  <div style={{ marginTop: 5 }}>
                                    {props.data[item.arrSelect[0]] ? props.data[item.arrSelect[0]] : ''} ({props.data.name})
                                  </div>
                                </div>
                              </components.SingleValue>
                            ),
                          }}
                          loadOptions={(inputValue, callback) => {
                            clearTimeout(this[`timer${item.ref}`]);
                            this[`timer${item.ref}`] = setTimeout(() => {
                              promiseOptions(inputValue, callback, item.ref);
                            }, 200);
                          }}
                          theme={theme => ({
                            ...theme,
                            spacing: {
                              ...theme.spacing,
                              controlHeight: '55px',
                            },
                          })}
                        />
                      </GridMUI>
                    </GridMUI>
                  ))
                  : ''}
              </GridMUI>
              <button type="submit"
                // ref={this.submitBtn} 
                ref={input => this.submitBtn = input}
                hidden />
            </ValidatorForm>
            <Button
              variant="contained"
              style={{ marginTop: 20 }}
              size="small"
              color="primary"
              className={classes.margin}
              onClick={this.openFieldDialog}
            >
              Thêm trường dữ liệu
            </Button>
          </DialogContent>
        </Dialog>
        <Dialog
          open={openFieldDialog}
          onClose={() => {
            this.setState({ openFieldDialog: false });
          }}
        >
          <DialogTitle id="alert-dialog-title">Thêm mới trường</DialogTitle>
          <DialogContent style={{ width: 600 }}>
            <TextField
              id="outlined-name"
              label="Tên trường"
              className={classes.textField}
              value={this.state.nameField}
              name="nameField"
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            <FormControl variant="outlined" className={classes.textField} fullWidth>
              <Select
                value={this.state.type}
                onChange={this.handleChange}
                name="type"
                input={<OutlinedInput labelWidth={this.state.labelWidth} name="age" id="outlined-age-simple" />}
              >
                <MenuItem value="String">String</MenuItem>
                <MenuItem value="Number">Number</MenuItem>
                <MenuItem value="Date">Date</MenuItem>
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="Source">Kiểu loại</MenuItem>
                <MenuItem value="File">File</MenuItem>
              </Select>
            </FormControl>
            {this.state.type === 'Source' ? (
              <TextField
                variant="outlined"
                fullWidth
                select
                label="Chọn danh sách loại"
                value={this.state.fromSource}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={event => {
                  let { fromSource } = this.state;
                  fromSource = event.target.value;
                  this.setState({ fromSource });
                }}
              >
                {listSources.map(option => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.title}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              ''
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAddFiled} variant="outlined" color="primary">
              LƯU
            </Button>
            <Button
              onClick={() => {
                this.setState({ openFieldDialog: false });
              }}
              variant="outlined"
              color="secondary"
              autoFocus
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  openFieldDialog = () => {
    this.setState({ openFieldDialog: true, nameField: '', type: 'String', fromSource: '' });
  };

  handleAddFiled = () => {
    const { others, nameField, type, fromSource } = this.state;
    if (type === 'Source') {
      others.push({
        checked: true,
        isFilter: false,
        isRequire: false,
        isSort: false,
        name: `others.${convertToSlug(nameField)}`,
        order: -1,
        title: nameField,
        type,
        fromSource,
      });
    } else {
      others.push({
        checked: true,
        isFilter: false,
        isRequire: false,
        isSort: false,
        name: `others.${convertToSlug(nameField)}`,
        order: -1,
        title: nameField,
        type,
      });
    }

    this.setState({ openFieldDialog: false, others });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  renderFieldByType = column => {
    const validator = [];
    const errMessage = [];
    if (column.isRequire) {
      validator.push('required');
      errMessage.push('Đồng chí phải nhập dữ liệu cho trường này.');
    }
    let fieldStyle;
    switch (column.type) {
      case 'String':
        fieldStyle = (
          <TextValidator
            onChange={event => {
              const { dialogData } = this.state;
              dialogData[column.name] = event.target.value;
              this.setState({ dialogData });
            }}
            value={this.state.dialogData[column.name]}
            label={column.title}
            variant="outlined"
            fullWidth
            margin="normal"
          />
        );
        if (column.name === 'state') {
          fieldStyle = null;
        }
        break;
      case 'Email':
        validator.push('isEmail');
        errMessage.push('Sai định dạng email');
        fieldStyle = (
          <TextValidator
            validators={validator}
            errorMessages={errMessage}
            onChange={event => {
              const { dialogData } = this.state;
              dialogData[column.name] = event.target.value;
              this.setState({ dialogData });
            }}
            value={this.state.dialogData[column.name]}
            label={column.title}
            variant="outlined"
            fullWidth
            margin="normal"
          />
        );
        break;
      case 'Number':
        fieldStyle = (
          <TextValidator
            validators={validator}
            errorMessages={errMessage}
            onChange={event => {
              const { dialogData } = this.state;
              dialogData[column.name] = event.target.value;
              this.setState({ dialogData });
            }}
            type="number"
            value={this.state.dialogData[column.name]}
            label={column.title}
            variant="outlined"
            fullWidth
            margin="normal"
          />
        );
        if (column.name === 'status' || column.name === 'kanbanStatus') {
          fieldStyle = null;
        }
        break;
      case 'Boolean':
        fieldStyle = (
          <FormControl component="fieldset">
            <FormLabel component="legend">{column.title}</FormLabel>
            <RadioGroup
              aria-label="Gender"
              name="gender1"
              value={this.state.dialogData[column.name] ? this.state.dialogData[column.name].toString() : undefined}
              onChange={event => {
                const { dialogData } = this.state;
                dialogData[column.name] = event.target.value;
                this.setState({ dialogData });
              }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Có" />
              <FormControlLabel value="false" control={<Radio />} label="Không" />
            </RadioGroup>
          </FormControl>
        );
        break;
      case 'File': {
        const { dialogData } = this.state;
        const dotDialogData = dot.dot(dialogData);
        dotDialogData[column.name]
          ? (fieldStyle = (
            <TextField
              id="outlined-adornment-password"
              variant="outlined"
              label={column.title}
              value={dotDialogData[column.name]}
              fullWidth
              margin="normal"
              className="my-2"
              // onChange={this.handleChange('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => {
                        window.open(dotDialogData[column.name]);
                      }}
                    >
                      <CloudDownload />
                    </IconButton>
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={() => {
                        dialogData[column.name] = undefined;
                        this.setState({ dialogData });
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ))
          : (fieldStyle = (
            <TextValidator
              validators={validator}
              errorMessages={errMessage}
              InputLabelProps={{ shrink: true }}
              onChange={event => {
                const { dialogData } = this.state;

                const formData = new FormData();
                formData.append('file', event.target.files[0]);
                fetch(`${UPLOAD_IMG_SINGLE}`, {
                  // Your POST endpoint
                  method: 'POST',
                  headers: {},
                  body: formData, // This is your file object
                })
                  .then(
                    response => response.json(), // if the response is a JSON object
                  )
                  .then(success => {
                    dialogData[column.name] = success.url;
                    // console.log(dialogData);
                    this.setState({ dialogData });
                  })
                  .catch(
                    // eslint-disable-next-line no-unused-vars
                    error => {
                      // console.log(error);
                      // alert(error);
                    }, // Handle the error response object
                  );
              }}
              type="file"
              label={column.title}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          ));
        break;
      }
      case 'Date':
        fieldStyle = (
          <TextValidator
            pattern="\d{1,2}/\d{1,2}/\d{4}"
            InputLabelProps={{
              shrink: true,
            }}
            validators={validator}
            errorMessages={errMessage}
            onChange={event => {
              const { dialogData } = this.state;
              dialogData[column.name] = event.target.value;
              this.setState({ dialogData });
            }}
            type="date"
            value={moment(this.state.dialogData[column.name]).format('YYYY-MM-DD')}
            label={column.title}
            variant="outlined"
            fullWidth
            margin="normal"
          />
        );

        break;
      case 'Source': {
        const { dialogData } = this.state;
        const dotDialogData = dot.dot(dialogData);
        const listSources = JSON.parse(localStorage.getItem('crmSource'));
        const currentSource = listSources[listSources.findIndex(d => d._id === column.fromSource)];
        if (column.fromSource !== '') {
          let convertedSelected = [];
          if (dotDialogData[`${column.name}`]) {
            convertedSelected = dotDialogData[`${column.name}`].split(', ');
          }
          fieldStyle = (
            <FormControl variant="outlined" className="my-3" fullWidth>
              <InputLabel htmlFor="select-multiple-checkbox">{column.title}</InputLabel>
              <Select
                variant="outlined"
                fullWidth
                multiple
                value={convertedSelected}
                input={<OutlinedInput labelWidth={60} id="select-multiple-checkbox" />}
                renderValue={selected => selected.join(', ')}
              >
                {currentSource.data.map(element => (
                  <MenuItem key={element.value} value={element.value}>
                    <Checkbox
                      onChange={event => {
                        if (event.target.checked) {
                          convertedSelected.push(element.title);
                        } else {
                          convertedSelected.splice(convertedSelected.indexOf(element.title), 1);
                        }
                        dotDialogData[`${column.name}`] = convertedSelected.join(', ');

                        this.setState({ dialogData: dotDialogData });
                      }}
                      checked={dotDialogData[`${column.name}`] ? dotDialogData[`${column.name}`].indexOf(element.title) > -1 : false}
                    />
                    <ListItemText primary={element.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }

        break;
      }

      default:
        break;
    }
    return fieldStyle;
  };
}

const Option = props => (
  <components.Option {...props}>
    {/* {console.log(props)} */}
    <div style={{ display: 'flex', justifyContent: 'flex-start', zIndex: 100 }}>
      <div style={{ marginTop: 10 }}>{props.data.name}</div>
    </div>
  </components.Option>
);

// const SingleValue = ({ children, ...props }) => (
//   <components.SingleValue {...props}>
//     {console.log(props, children)}
//     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//       <div style={{ marginTop: 5 }}>{props.data.name}</div>
//     </div>
//   </components.SingleValue>
// );

HocCollectionDialog.propTypes = {};

export default withStyles(stylePaper)(HocCollectionDialog);
