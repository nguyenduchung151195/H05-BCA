/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
/**
 *
 * AutomationDialog
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  Button,
  IconButton,
  Grid,
  MenuItem,
  Card,
  CardContent,
  FormHelperText,
} from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { renderActionContent } from './CustomAction';
import { Autocomplete } from 'components/LifetekUi';
import loadash from 'lodash';
import CustomInputField from '../Input/CustomInputField';

/* eslint-disable react/prefer-stateless-function */

const listAction = [
  {
    title: 'Gửi mail',
    actionType: 'mail',
    actionCommand: 1,
  },
  {
    title: 'Yêu cầu phê duyệt',
    actionType: 'approve',
    actionCommand: 1,
  },
  {
    title: 'SMS',
    actionType: 'sms',
    actionCommand: 1,
  },
  // {
  //   title: 'Gọi điện',
  //   actionType: 'call',
  //   actionCommand: 1,
  // },
  {
    title: 'Tạo công việc',
    actionType: 'task',
    actionCommand: 1,
  },
  {
    title: 'Thông báo',
    actionType: 'notice',
    actionCommand: 1,
  },
  {
    title: 'Thay đổi field',
    actionType: 'field',
    actionCommand: 1,
  },
];

const OPERATORS = [
  {
    title: 'Bằng',
    value: 'Equal',
  },
  {
    title: 'Lớn hơn',
    value: 'Greater',
  },
  {
    title: 'Lớn hơn hoặc bằng',
    value: 'GreaterOrEqual',
  },
  {
    title: 'Nhỏ hơn',
    value: 'Less',
  },
  {
    title: 'Nhỏ hơn hoặc bằng',
    value: 'LessThanOrEqual',
  },
];

class AutomationDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogData: {
        name: '',
        code: '',
        isAuto: true,
        conditions: [],
        actions: [],
        timeCondition: {
          value: 0,
          field: undefined,
        },
        path: '',
      },
      listField: [],
      fields: [],
      timerUnit: 'second',
      timerValue: 0,
      error: {},
      sendTo: [],
      status: false,
    };
    this.submitBtn = React.createRef();
  }

  componentDidMount() {
    const { viewConfig } = this.props;
    let localViewConfig = [];
    localViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    this.setState({ localViewConfig });
    this.setState(state => {
      let columns = [];
      let others = [];
      state.localViewConfig &&
        state.localViewConfig.filter(x => x.code == (this.props.viewConfig && this.props.viewConfig.code)).map(item => {
          columns = item.listDisplay.type.fields.type.columns;
          others = item.listDisplay.type.fields.type.others;
        });
      state.fields = columns.concat(others);
      return state;
    });
    const dialogData = this.state.dialogData;
    dialogData.path = this.props.viewConfig && this.props.viewConfig.path ? this.props.viewConfig.path : null;
    this.setState({ dialogData });
    const { columns = [], others = [] } = viewConfig ? viewConfig.listDisplay.type.fields.type : [];
    this.setState({ listField: [...columns, ...others] });
    if (this.props.isEditting) {
      const { editData } = this.props;
      let timerUnitConvert;
      let timerValueConvert;
      if (editData.timeCondition.value / 86400 > 1) {
        timerValueConvert = editData.timeCondition.value / 86400;
        timerUnitConvert = 'day';
      } else if (editData.timeCondition.value / 3600 > 1) {
        timerValueConvert = editData.timeCondition.value / 3600;
        timerUnitConvert = 'hour';
      } else if (editData.timeCondition.value / 60 > 1) {
        timerValueConvert = editData.timeCondition.value / 60;
        timerUnitConvert = 'min';
      } else {
        timerValueConvert = editData.timeCondition.value;
        timerUnitConvert = 'second';
      }
      this.setState({ dialogData: this.props.editData, timerUnit: timerUnitConvert, timerValue: timerValueConvert });
    }

    ValidatorForm.addValidationRule('whiteSpace', value => {
      const len = value.split('').length;
      const finalIndex = value.split('')[len - 1];
      if (value.split('')[0] === ' ' || finalIndex === ' ') {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule('multiSpace', value => {
      const arrValue = value.split('');
      for (let i = 0; i < arrValue.length; i++) {
        if (arrValue[i] === ' ' && arrValue[i + 1] === ' ') {
          return false;
        }
      }
      return true;
    });
    ValidatorForm.addValidationRule('vnUnicode', value => {
      const vnUnicode =
        'àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ';
      const arrCode = value.split('');
      const findArr = arrCode.find(value => vnUnicode.includes(value));
      if (value.includes(' ') || findArr !== undefined) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule('isEmail', value => {
      const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      const temp = re.test(value);
      if (!temp) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule('whiteSpace');
    ValidatorForm.removeValidationRule('multiSpace');
    ValidatorForm.removeValidationRule('vnUnicode');
    ValidatorForm.removeValidationRule('isEmail');
  }

  validate = state => {
    const { actions = [], conditions = [] } = state;
    const temp = {};
    temp.actions = actions.length === 0 ? '* Action không được để trống' : '';
    temp.trigger = conditions.length === 0 ? '* Trigger không được để trống' : '';

    function isRepeatCreateTaskAction(action = {}) {
      // debugger;
      const { actionType, additionData = {} } = action;
      const { timeCircle = {} } = additionData;
      const { active } = timeCircle;
      if (actionType === 'task') {
        if (active) {
          return true;
        }
      }
      return false;
    }

    if (conditions.length === 0) {
      if (actions.length && actions.filter(isRepeatCreateTaskAction).length === actions.length) {
        temp.trigger = '';
      }
    }

    state.actions.filter(action => action.actionType === 'field').forEach(z => {
      if (!z.additionData.fieldId) {
        temp.field = 'Không được bỏ trống';
      }
    });
    this.setState({
      error: temp,
    });
    return Object.values(temp).every(x => x === '');
  };

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'addition-data-change': {
        const { dialogData } = this.state;
        dialogData.actions[data.actionIndex].additionData = data.newAddtionData;
        this.setState({ dialogData });
        break;
      }
      default:
        break;
    }
  };
  genMessageForRelationiField(type) {
    if (type) {
      const arr = type.split('|');
      if (arr[0] === 'ObjectId') {
        return arr[1];
      }
    }
    return '';
  }
  changeField(value, index) {
    const valueAsync = value || [];
    this.setState(state => {
      // valueAsync.map(x => {
      // });
      state.dialogData.actions[index].sendTo = Array.isArray(valueAsync) && valueAsync.map(item => ({
        ref: (item.type && this.genMessageForRelationiField(item.type)) || null,
        field: item.field,
        name: item.name,
        _id: item._id,
      }));
      return state;
    });
  }
  render() {
    const { dialogData, listField, timerUnit, timerValue, error } = this.state;
    const { open, isEditting, listDynamicForms, listApproveGroup, listMappingConvert } = this.props;
    const firstList = [
      {
        title: this.props.nameViewConfig,
        name: '_id',
        type: this.props.viewConfig && this.props.viewConfig.code,
      },
    ];
    let relations = [];
    let newListFields =
      this.props.nameViewConfig === false
        ? this.state.fields.filter(x => x.type.includes('ObjectId')).map((item, index) => {
          try {
            const fieldRelationCols = item.type && typeof item.type === "string" && JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]) &&
              JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]).listDisplay.type.fields.type.columns;

            relations = Array.isArray(fieldRelationCols) && fieldRelationCols.filter(j => j.type.includes('ObjectId')).map((jItem, jIndex) => {
              return {
                ...jItem,
                _id: `${item.name}-${index}-${jItem.name}-${jIndex}`,
                name: `${item.title} - ${jItem.title}`,
                field: `${item.name}|${jItem.name},${jItem.split('|')[1]}`,
              };
            });
          } catch (error) {
            // console.log('error', error);
          }
          return {
            ...item,
            _id: `${item.name}-${index}`,
            name: item.title,
            field: item.name,
          };
        })
        : firstList.concat(this.state.fields.filter(x => x.type.includes('ObjectId'))).map((item, index) => {
          try {
            const fieldRelationCols = item.type && typeof item.type === "string" && JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]) &&
              JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]).listDisplay.type.fields.type.columns;
            relations = Array.isArray(fieldRelationCols) && fieldRelationCols.filter(j => j.type.includes('ObjectId')).map((jItem, jIndex) => {
              return {
                ...jItem,
                _id: `${item.name}-${index}-${jItem.name}-${jIndex}`,
                name: `${item.title} - ${jItem.title}`,
                field: `${item.name}|${jItem.name},${jItem.type.split('|')[1]}`,
              };
            });
          } catch (error) {
            // console.log('error', error);
          }
          return {
            ...item,
            _id: `${item.name}-${index}`,
            name: item.title,
            field: item.name,
          };
        });
    this.state.fields.forEach(i => {
      if (i.typeImport) {
        try {
          i.typeImport.filter(x => x.type.includes('ObjectId')).map((item, index) => {
            const fieldRelationCols = item.type && typeof item.type === "string" && JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]) &&
              JSON.parse(localStorage.getItem('viewConfig')).find(j => j.code === item.type.split('|')[1]).listDisplay.type.fields.type.columns;
            const importList = Array.isArray(fieldRelationCols) && fieldRelationCols.filter(j => j.type.includes('ObjectId')).map((jItem, jIndex) => {
              return {
                ...jItem,
                _id: `${i.name}-${item.name}-${index}-${jItem.name}-${jIndex}`,
                name: `${i.title} - ${item.title} - ${jItem.title}`,
                field: `Array|${i.name}|${item.name},${item.type.split('|')[1]}|${jItem.name}`,
              };
            });
            newListFields = newListFields.concat(importList);
          });
        } catch (error) {
          // console.log('err', err);
        }
      }
    });
    newListFields = newListFields.concat(relations);
    const calendarViewConfig = JSON.parse(localStorage.getItem('viewConfig')).find(x => x.path === this.props.path);

    const columnListFieldApplys =
      calendarViewConfig && loadash.has(calendarViewConfig, 'listDisplay.type.fields.type')
        ? calendarViewConfig.listDisplay.type.fields.type.columns
        : [];
    const othersListFieldApplys =
      calendarViewConfig && loadash.has(calendarViewConfig, 'listDisplay.type.fields.type')
        ? calendarViewConfig.listDisplay.type.fields.type.columns
        : [];
    const listFieldApplys = columnListFieldApplys.concat(othersListFieldApplys).filter(x => x.type.includes('Date'));
    return (
      <div>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={() => {
            this.props.callBack('cancel-dialog', null);
          }}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">{isEditting ? 'Sửa tự động hóa' : 'Thêm tự động hóa'}</DialogTitle>
          <DialogContent>
            <ValidatorForm
              onSubmit={() => {
                const { dialogData, timerUnit, timerValue } = this.state;
                switch (timerUnit) {
                  case 'second':
                    dialogData.timeCondition.value = timerValue;
                    break;
                  case 'min':
                    dialogData.timeCondition.value = timerValue * 60;
                    break;
                  case 'hour':
                    dialogData.timeCondition.value = timerValue * 60 * 60;
                    break;
                  case 'day':
                    dialogData.timeCondition.value = timerValue * 60 * 60 * 24;
                    break;
                  default:
                    break;
                }
                if (this.validate(this.state.dialogData)) {
                  const x = Object.assign({}, dialogData);
                  x.conditions = x.conditions.filter(item => item.field.trim() !== '');
                  isEditting ? this.props.callBack('update', x) : this.props.callBack('create-new', x);
                }
              }}
            >
              <Grid container>
                <Grid item sm={12}>
                  <TextValidator
                    // validators={['required']}
                    // errorMessages={['Trường bắt buộc']}
                    onChange={event => {
                      const { dialogData } = this.state;
                      dialogData.name = event.target.value;
                      this.setState({ dialogData });
                    }}
                    value={dialogData.name}
                    label="Tên bảng tự động hóa *"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    validators={['required', 'whiteSpace', 'multiSpace']}
                    errorMessages={['Trường bắt buộc', 'Tên bảng tự động hóa không hợp lệ', '2 Dấu cách không được liền kề']}
                  />
                </Grid>
                <Grid item sm={12}>
                  <TextValidator
                    onChange={event => {
                      const { dialogData } = this.state;
                      dialogData.code = event.target.value;
                      this.setState({ dialogData });
                    }}
                    value={dialogData.code}
                    label="Code *"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    disabled={!!this.props.isEditting}
                    validators={['required', 'vnUnicode']}
                    errorMessages={['Trường bắt buộc', 'Code không hợp lệ']}
                  />
                </Grid>
                <Grid item sm={4} className="pr-2">
                  <TextValidator
                    onChange={event => {
                      let { timerValue } = this.state;
                      timerValue = event.target.value;
                      this.setState({ timerValue });
                    }}
                    type="number"
                    value={timerValue}
                    label="Giá trị "
                    variant="outlined"
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                <Grid item sm={4} className="pl-2">
                  <TextValidator
                    onChange={event => {
                      let { timerUnit } = this.state;
                      timerUnit = event.target.value;
                      this.setState({ timerUnit });
                    }}
                    select
                    value={timerUnit}
                    label="Đơn vị thời gian"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                  >
                    <MenuItem value="second">Giây</MenuItem>
                    <MenuItem value="min">Phút</MenuItem>
                    <MenuItem value="hour">Giờ</MenuItem>
                    <MenuItem value="day">Ngày</MenuItem>
                  </TextValidator>
                </Grid>
                <Grid item sm={4} className="pl-2">
                  <TextValidator
                    onChange={event => {
                      const { dialogData } = this.state;
                      dialogData.timeCondition.field = event.target.value;
                      this.setState({
                        dialogData,
                      });
                    }}
                    select
                    value={this.state.dialogData.timeCondition.field}
                    label="Áp dụng cho"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                  >
                    {listFieldApplys.map(x => (
                      <MenuItem key={x.name} value={x.name}>
                        {x.title}
                      </MenuItem>
                    ))}
                  </TextValidator>
                </Grid>
                <Grid item sm={6}>
                  <h5>Điều kiện</h5>
                </Grid>
                {this.state.status === false ? (
                  <Grid className="text-right" item sm={6} alignItems="flex-end">
                    <IconButton
                      onClick={() => {
                        const { dialogData } = this.state;
                        let status = true;
                        this.setState({ status: status });
                        dialogData.conditions.push({
                          field: '',
                          operator: '',
                          value: '',
                          valueType: '',
                          valueInfor: '',
                          configType: '',
                          configCode: '',
                          options: '',
                        });
                        this.setState({ dialogData });

                        this.setState(prevState => ({
                          error: {
                            ...prevState.error,
                            trigger: '',
                          },
                        }));
                      }}
                      disabled={this.state.status}
                    >
                      <Add color="primary" />
                    </IconButton>
                  </Grid>
                ) : null}
                <Grid item sm={12}>
                  {dialogData.conditions.map((item, index) => {
                    // if (index !== dialogData.conditions.length - 1) {
                    const itemViewconfig = listField.find(i => i.name === item.field && i.type === 'Array');
                    const childs = itemViewconfig ? itemViewconfig.typeImport : [];
                    return (
                      <>
                        <Grid container key={item.field}>
                          <Grid item sm={4}>
                            <TextValidator
                              validators={['required']}
                              errorMessages={['Trường bắt buộc']}
                              onChange={event => {
                                event.preventDefault();
                                const { dialogData } = this.state;
                                let status = false;
                                this.setState({ status: status });
                                dialogData.conditions[index].field = event.target.value;
                                const itemConfig = listField.find(d => d.name === event.target.value);
                                dialogData.conditions[index].valueType = itemConfig.type;
                                dialogData.conditions[index].configType = itemConfig.configType ? itemConfig.configType : null;
                                dialogData.conditions[index].configCode = itemConfig.configCode ? itemConfig.configCode : null;
                                dialogData.conditions[index].options = itemConfig.menuItem ? itemConfig.menuItem : null;
                                if (itemConfig.type === 'Array') {
                                  dialogData.conditions[index].conditions = (itemConfig.typeImport || []).map(i => {
                                    return {
                                      title: i.title,
                                      operator: '',
                                      field: i.name,
                                      valueType: i.type,
                                      configType: i.configType,
                                      configCode: i.configCode,
                                      options: i.menuItem || null,
                                    };
                                  });
                                }
                                this.setState({ dialogData });
                              }}
                              select
                              value={dialogData.conditions[index].field}
                              label="Tên trường *"
                              variant="outlined"
                              fullWidth
                              margin="dense"
                            >
                              {listField.map(field => (
                                <MenuItem key={field.name} value={field.name}>
                                  {field.title}
                                </MenuItem>
                              ))}
                            </TextValidator>
                          </Grid>
                          {item.valueType !== 'Array' ? (
                            <>
                              <Grid item sm={3} className="px-2">
                                <TextValidator
                                  validators={['required']}
                                  errorMessages={['Trường bắt buộc']}
                                  onChange={event => {
                                    const { dialogData } = this.state;
                                    dialogData.conditions[index].operator = event.target.value;
                                    this.setState({ dialogData });
                                  }}
                                  select
                                  value={dialogData.conditions[index].operator}
                                  label="Điều kiện so sánh *"
                                  variant="outlined"
                                  fullWidth
                                  margin="dense"
                                >
                                  <MenuItem key="-83" value="">
                                    -- Chọn --
                                  </MenuItem>
                                  {OPERATORS.map(field => (
                                    <MenuItem key={field.value} value={field.value}>
                                      {field.title}
                                    </MenuItem>
                                  ))}
                                </TextValidator>
                              </Grid>
                              <Grid item sm={4}>
                                {dialogData.conditions[index].valueType === '' || dialogData.conditions[index].valueType === 'String' ? (
                                  <TextValidator
                                    validators={['required']}
                                    errorMessages={['Trường bắt buộc']}
                                    onChange={event => {
                                      const { dialogData } = this.state;
                                      dialogData.conditions[index].value = event.target.value;
                                      this.setState({ dialogData });
                                    }}
                                    value={dialogData.conditions[index].value}
                                    label="Giá trị *"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                  />
                                ) : dialogData.conditions[index].valueType === 'Date' ? (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <p> So sánh với ngày hiện tại</p>
                                    <Checkbox
                                      onChange={event => {
                                        const { dialogData } = this.state;
                                        dialogData.conditions[index].currentDay = event.target.checked;
                                        this.setState({ dialogData });
                                      }}
                                      checked={dialogData.conditions[index].currentDay}
                                    />
                                    <TextValidator
                                      validators={['required']}
                                      errorMessages={['Trường bắt buộc']}
                                      onChange={event => {
                                        const { dialogData } = this.state;
                                        dialogData.conditions[index].value = event.target.value;
                                        this.setState({ dialogData });
                                      }}
                                      value={dialogData.conditions[index].value}
                                      label="Giá trị *"
                                      variant="outlined"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      type={dialogData.conditions[index].currentDay ? 'number' : 'date'}
                                      margin="dense"
                                    />
                                    {dialogData.conditions[index].currentDay ? 's' : null}
                                  </div>
                                ) : (
                                  <CustomInputField
                                    validators={['required']}
                                    errorMessages={['Trường bắt buộc']}
                                    onChange={event => {
                                      const { dialogData } = this.state;
                                      dialogData.conditions[index].valueInfor =
                                        dialogData.conditions[index].valueType.includes('Source') ||
                                          dialogData.conditions[index].valueType.includes('MenuItem') ||
                                          dialogData.conditions[index].valueType === 'Number'
                                          ? event.target.value
                                          : event;
                                      dialogData.conditions[index].value =
                                        dialogData.conditions[index].valueType.includes('Source') ||
                                          dialogData.conditions[index].valueType.includes('MenuItem')
                                          ? event.target.value.type
                                          : event._id;
                                      this.setState({ dialogData });
                                    }}
                                    name={dialogData.conditions[index].field}
                                    value={dialogData.conditions[index].valueInfor}
                                    type={dialogData.conditions[index].valueType}
                                    label="Giá trị *"
                                    configType={dialogData.conditions[index].configType ? dialogData.conditions[index].configType : null}
                                    configCode={dialogData.conditions[index].configCode ? dialogData.conditions[index].configCode : null}
                                    options={dialogData.conditions[index].options ? dialogData.conditions[index].options : null}
                                  />
                                )}
                              </Grid>
                              <Grid item sm={1} className="text-center">
                                <IconButton
                                  onClick={() => {
                                    // eslint-disable-next-line no-alert
                                    const r = confirm('Đồng chí có muốn xóa hành động này?');
                                    if (r) {
                                      const { dialogData } = this.state;
                                      let status;
                                      if (dialogData.conditions[index + 1] && dialogData.conditions[index + 1].valueType === '') {
                                        status = true;
                                      } else {
                                        status = false;
                                      }
                                      dialogData.conditions.splice(index, 1);
                                      this.setState({ dialogData, status: status });
                                    }
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Grid>
                            </>
                          ) : null}
                        </Grid>
                        {item.conditions &&
                          item.conditions.map((childItem, childIndex) => (
                            <Grid container key={childItem.field}>
                              <Grid item sm={4}>
                                <TextValidator
                                  errorMessages={['Trường bắt buộc']}
                                  value={childItem.title}
                                  label="Tên trường *"
                                  variant="outlined"
                                  fullWidth
                                  margin="dense"
                                />
                              </Grid>
                              <Grid item sm={3} className="px-2">
                                <TextValidator
                                  errorMessages={['Trường bắt buộc']}
                                  onChange={event => {
                                    const { dialogData } = this.state;
                                    dialogData.conditions[index].conditions[childIndex].operator = event.target.value;
                                    this.setState({ dialogData });
                                  }}
                                  select
                                  value={dialogData.conditions[index].conditions[childIndex].operator}
                                  label="Điều kiện so sánh *"
                                  variant="outlined"
                                  fullWidth
                                  margin="dense"
                                >
                                  {OPERATORS.map(field => (
                                    <MenuItem key={field.value} value={field.value}>
                                      {field.title}
                                    </MenuItem>
                                  ))}
                                </TextValidator>
                              </Grid>
                              <Grid item sm={4}>
                                {dialogData.conditions[index].conditions[childIndex].valueType === '' ||
                                  dialogData.conditions[index].conditions[childIndex].valueType === 'String' ? (
                                  <TextValidator
                                    errorMessages={['Trường bắt buộc']}
                                    onChange={event => {
                                      const { dialogData } = this.state;
                                      dialogData.conditions[index].conditions[childIndex].value = event.target.value;
                                      this.setState({ dialogData });
                                    }}
                                    value={dialogData.conditions[index].conditions[childIndex].value}
                                    label="Giá trị *"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                  />
                                ) : dialogData.conditions[index].conditions[childIndex].valueType === 'Date' ? (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <p> So sánh với ngày hiện tại</p>
                                    <Checkbox
                                      onChange={event => {
                                        const { dialogData } = this.state;
                                        dialogData.conditions[index].conditions[childIndex].currentDay = event.target.checked;
                                        this.setState({ dialogData });
                                      }}
                                      checked={dialogData.conditions[index].conditions[childIndex].currentDay}
                                    />
                                    <TextValidator
                                      errorMessages={['Trường bắt buộc']}
                                      onChange={event => {
                                        const { dialogData } = this.state;
                                        dialogData.conditions[index].conditions[childIndex].value = event.target.value;
                                        this.setState({ dialogData });
                                      }}
                                      value={dialogData.conditions[index].conditions[childIndex].value}
                                      label="Giá trị *"
                                      variant="outlined"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      type={dialogData.conditions[index].conditions[childIndex].currentDay ? 'number' : 'date'}
                                      margin="dense"
                                    />
                                    {dialogData.conditions[index].conditions[childIndex].currentDay ? 's' : null}
                                  </div>
                                ) : (
                                  <CustomInputField
                                    errorMessages={['Trường bắt buộc']}
                                    onChange={event => {
                                      const { dialogData } = this.state;
                                      dialogData.conditions[index].conditions[childIndex].valueInfor =
                                        dialogData.conditions[index].conditions[childIndex].valueType.includes('Source') ||
                                          dialogData.conditions[index].conditions[childIndex].valueType.includes('MenuItem') ||
                                          dialogData.conditions[index].conditions[childIndex].valueType === 'Number'
                                          ? event.target.value
                                          : event;
                                      dialogData.conditions[index].conditions[childIndex].value =
                                        dialogData.conditions[index].conditions[childIndex].valueType.includes('Source') ||
                                          dialogData.conditions[index].conditions[childIndex].valueType.includes('MenuItem')
                                          ? event.target.value.type
                                          : event._id;
                                      this.setState({ dialogData });
                                    }}
                                    name={dialogData.conditions[index].conditions[childIndex].field}
                                    value={dialogData.conditions[index].conditions[childIndex].valueInfor}
                                    type={dialogData.conditions[index].conditions[childIndex].valueType}
                                    label="Giá trị *"
                                    configType={
                                      dialogData.conditions[index].conditions[childIndex].configType
                                        ? dialogData.conditions[index].conditions[childIndex].configType
                                        : null
                                    }
                                    configCode={
                                      dialogData.conditions[index].conditions[childIndex].configCode
                                        ? dialogData.conditions[index].conditions[childIndex].configCode
                                        : null
                                    }
                                    options={
                                      dialogData.conditions[index].conditions[childIndex].options
                                        ? dialogData.conditions[index].conditions[childIndex].options
                                        : null
                                    }
                                  />
                                )}
                              </Grid>
                            </Grid>
                          ))}
                      </>
                    );
                    // }
                  })}
                  {error.trigger ? <FormHelperText style={{ color: 'red' }}>{error.trigger}</FormHelperText> : null}
                </Grid>
                <Grid item sm={6}>
                  <h5>HÀNH ĐỘNG</h5>
                </Grid>
                <Grid className="text-right" item sm={6} alignItems="flex-end">
                  <IconButton
                    onClick={() => {
                      const { dialogData } = this.state;
                      dialogData.actions.push({
                        actionType: '',
                        actionCommand: '',
                        additionData: {
                          dynamicForm: '',
                          convertMapping: '',
                          // approveName: '',
                          approveGroup: '',
                        },
                        sendTo: [],
                      });
                      this.setState({ dialogData });
                      this.setState(prevState => ({
                        error: {
                          ...prevState.error,
                          actions: '',
                        },
                      }));
                    }}
                  >
                    <Add color="primary" />
                  </IconButton>
                </Grid>
                {dialogData.actions.map((item, index) => (
                  <Grid sm={12} className="my-2">
                    <Card>
                      <CardContent>
                        <Grid container alignItems="center">
                          <Grid item sm={10}>
                            <TextValidator
                              validators={['required']}
                              errorMessages={['Trường bắt buộc']}
                              onChange={event => {
                                if (String(event.target.value) === 'call' || String(event.target.value) === 'sms') {
                                  this.props.onChangeSnackbar({ status: true, message: 'Đồng chí không có quyền truy cập!', variant: 'error' });
                                  return;
                                }
                                const { dialogData } = this.state;
                                dialogData.actions[index].actionType = event.target.value;
                                dialogData.actions[index].actionCommand =
                                  listAction[listAction.findIndex(d => d.actionType === event.target.value)].actionCommand;
                                this.setState({ dialogData });
                              }}
                              select
                              value={dialogData.actions[index].actionType}
                              label="Hành động *"
                              variant="outlined"
                              fullWidth
                              margin="dense"
                            >
                              {listAction.map(action => (
                                <MenuItem key={action.actionType} value={action.actionType}>
                                  {action.title}
                                </MenuItem>
                              ))}
                            </TextValidator>
                          </Grid>
                          <Grid item sm={1} className="text-center">
                            <IconButton
                              onClick={() => {
                                // eslint-disable-next-line no-alert
                                const r = confirm('Đồng chí có muốn xóa hành động này?');
                                if (r) {
                                  const { dialogData } = this.state;
                                  dialogData.actions.splice(index, 1);
                                  this.setState({ dialogData });
                                }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Grid>
                          <Grid item sm={12}>
                            {renderActionContent(
                              dialogData.actions[index],
                              listDynamicForms,
                              listApproveGroup,
                              listMappingConvert,
                              index,
                              this.callBack,
                              this.setState.bind(this),
                              error,
                              dialogData.conditions && dialogData.conditions.length,
                            )}
                          </Grid>
                          <Grid item sm={6}>
                            <h5>Nơi nhận</h5>
                          </Grid>
                          <Grid item sm={12}>
                            <Grid>
                              <Autocomplete
                                onChange={value => this.changeField(value, index)}
                                suggestions={newListFields}
                                value={dialogData.actions[index].sendTo}
                                label="Nơi nhận"
                                isMulti
                                checkedShowForm={true}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {error.actions ? <FormHelperText style={{ color: 'red' }}>{error.actions}</FormHelperText> : null}
                <Grid>
                  Tự động:
                  <Checkbox
                    onChange={event => {
                      const { dialogData } = this.state;
                      dialogData.isAuto = event.target.checked;
                      this.setState({ dialogData });
                    }}
                    checked={dialogData.isAuto}
                  />
                </Grid>

                {/* <Grid item sm={12}>
                  <CircleSelect
                    value={dialogData.timeCircle}
                    onChange={value => {
                      const newDialogData = {
                        ...dialogData,
                        timeCircle: value,
                      };

                      this.setState({ dialogData: newDialogData });
                    }}
                  />
                </Grid> */}
              </Grid>
              <button type="submit" ref={this.submitBtn} hidden />
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            {isEditting &&
              dialogData.originData && (
                <Button
                  onClick={() => {
                    this.setState({
                      dialogData: {
                        originData: JSON.parse(JSON.stringify(dialogData.originData)),
                        isAuto: dialogData.originData.isAuto,
                        actions: dialogData.originData.actions,
                        conditions: dialogData.originData.conditions,
                        name: dialogData.originData.name,
                      },
                    });
                  }}
                  color="primary"
                  variant="contained"
                >
                  KHÔI PHỤC MẶC ĐỊNH
                </Button>
              )}
            <Button
              onClick={() => {
                this.submitBtn.current.click();
              }}
              color="primary"
              variant="contained"
            >
              {isEditting ? 'LƯU' : 'LƯU'}
            </Button>

            <Button
              onClick={() => {
                this.props.callBack('cancel-dialog', null);
              }}
              color="secondary"
              variant="contained"
            >
              HỦY
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AutomationDialog.propTypes = {};

export default AutomationDialog;
