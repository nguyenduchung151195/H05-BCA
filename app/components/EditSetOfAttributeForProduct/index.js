/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * EditSetOfAttributeForProduct
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import classNames from 'classnames';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  MenuItem,
  withStyles,
  TextField,
  Grid,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Select,
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import styles from './styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
/* eslint-disable react/prefer-stateless-function */
class EditSetOfAttributeForProduct extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }

  state = {
    propertiesSetChoosen: '',
    expanded: false,
    propertiesSetList: [],
    setValue: [],
    index: -1,
    attrArrHasValue: [],
    isSubmit: false,
  };

  componentDidMount() {
    this.props.onRef(this);
    this.state.isSubmit = false;
  }

  timer = null;

  handleChangeInput = e => {
    if (e.target.name === 'propertiesSetChoosen') {
      const { propertiesSetList } = this.state;
      const group = propertiesSetList[e.target.value] ? propertiesSetList[e.target.value].attributeGroups : [];
      const set = [];
      group.forEach(item => {
        const propertiesList = [];
        if (item.attributes.length > 0) {
          item.attributes.forEach(attr => {
            if (attr.type === 'select') {
              propertiesList.push({
                name: attr.name,
                code: attr.code,
                type: attr.type,
                require: attr.config.isType,
                options: attr.options,
                id: attr.attributeId,
                value: attr.options[0] ? attr.options[0]._id : null,
              });
            } else if (attr.type === 'multiSelect' || attr.type === 'list') {
              propertiesList.push({
                name: attr.name,
                code: attr.code,
                type: attr.type,
                require: attr.config.isType,
                options: attr.options,
                id: attr.attributeId,
                value: attr.options[0] ? [`${attr.options[0].name}`] : [],
              });
            } else if (attr.type === 'bool') {
              propertiesList.push({
                name: attr.name,
                code: attr.code,
                type: attr.type,
                require: attr.config.isType,
                options: attr.options,
                id: attr.attributeId,
                value: false,
              });
            } else {
              propertiesList.push({
                name: attr.name,
                code: attr.code,
                type: attr.type,
                require: attr.config.isType,
                options: attr.options,
                id: attr.attributeId,
                value: null,
              });
            }
          });
        }
        const groupId = item.attributeGroupId;
        set.push({
          groupId,
          name: item.name,
          propertiesList,
        });
      });
      if (e.target.value === this.state.index) {
        const { attrArrHasValue } = this.state;
        attrArrHasValue.forEach(val => {
          set.forEach(group => {
            group.propertiesList.forEach(item => {
              if (item.id === val.id) {
                item.value = val.value;
              }
            });
          });
        });
      }

      this.setState({
        setValue: set,
      });
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeExpan = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  componentWillReceiveProps(props) {
    const { propertiesSet, product } = props;
    const arr = [];
    propertiesSet.forEach(item => {
      if (item.objects.Product) {
        arr.push(item);
      }
    });
    this.state.propertiesSetList = arr;
    if (Object.keys(product).length > 0 && !this.state.isSubmit && props.product !== this.props.product && product.attributeSet) {
      const { attributeSet } = product;
      if (Object.keys(attributeSet).length > 0) {
        const index = arr.findIndex(item => {
          if (item.id === attributeSet.setId) return true;
        });
        // console.log(index);
        this.state.index = index;
        const arrAttrHasValue = [];
        attributeSet.content.forEach(group => {
          group.propertiesList.forEach(item => {
            arrAttrHasValue.push(item);
          });
        });
        // this.setState({ attrArrHasValue: arrAttrHasValue });
        this.state.attrArrHasValue = arrAttrHasValue;
        this.state.propertiesSetChoosen = index;
        const group = arr[index] ? arr[index].attributeGroups : [];
        const set = [];
        group.forEach(item => {
          const propertiesList = [];
          if (item.attributes.length > 0) {
            item.attributes.forEach(attr => {
              if (attr.type === 'select') {
                propertiesList.push({
                  name: attr.name,
                  code: attr.code,
                  type: attr.type,
                  require: attr.config.isType,
                  options: attr.options,
                  id: attr.attributeId,
                  value: '',
                });
              } else if (attr.type === 'multiSelect' || attr.type === 'list') {
                propertiesList.push({
                  name: attr.name,
                  code: attr.code,
                  type: attr.type,
                  require: attr.config.isType,
                  options: attr.options,
                  id: attr.attributeId,
                  value: '',
                });
              } else if (attr.type === 'bool') {
                propertiesList.push({
                  name: attr.name,
                  code: attr.code,
                  type: attr.type,
                  require: attr.config.isType,
                  options: attr.options,
                  id: attr.attributeId,
                  value: '',
                });
              } else {
                propertiesList.push({
                  name: attr.name,
                  code: attr.code,
                  type: attr.type,
                  require: attr.config.isType,
                  options: attr.options,
                  id: attr.attributeId,
                  value: '',
                });
              }
            });
          }

          const groupId = item.attributeGroupId;
          set.push({
            groupId,
            name: item.name,
            propertiesList,
          });
        });
        arrAttrHasValue.forEach(val => {
          set.forEach(group => {
            group.propertiesList.forEach(item => {
              if (item.id === val.id) {
                item.value = val.value;
              }
            });
          });
        });

        this.state.setValue = set;
        this.state.isSubmit = true;
      }
    }
  }

  componentDidUpdate(props) {
    const { propertiesSet, product } = props;
    const arr = [];
    propertiesSet.forEach(item => {
      if (item.objects.Product) {
        arr.push(item);
      }
    });
    this.state.propertiesSetList = arr;
    if (Object.keys(product).length > 0 && !this.state.isSubmit && props.product !== this.props.product && product.attributeSet) {
      const { attributeSet } = product;
      if (Object.keys(attributeSet).length > 0) {
        const index = arr.findIndex(item => {
          if (item.id === attributeSet.setId) return true;
        });
        // console.log(index);
        this.state.index = index;
        const arrAttrHasValue = [];
        attributeSet.content.forEach(group => {
          group.propertiesList.forEach(item => {
            arrAttrHasValue.push(item);
          });
        });
        // this.setState({ attrArrHasValue: arrAttrHasValue });
        this.state.attrArrHasValue = arrAttrHasValue;
        this.state.propertiesSetChoosen = index;
        const group = arr[index] ? arr[index].attributeGroups : [];
        const set = [];
        group.forEach(item => {
          const propertiesList = [];
          if (item.attributes.length > 0) {
            item.attributes.forEach(attr => {
              if (attr.type === 'select') {
                propertiesList.push({
                  name: attr.name,
                  code: attr.code,
                  type: attr.type,
                  require: attr.config.isType,
                  options: attr.options,
                  id: attr.attributeId,
                  value: '',
                });
              } else if (attr.type === 'multiSelect' || attr.type === 'list') {
                propertiesList.push({
                  name: attr.name,
                  code: attr.code,
                  type: attr.type,
                  require: attr.config.isType,
                  options: attr.options,
                  id: attr.attributeId,
                  value: '',
                });
              } else if (attr.type === 'bool') {
                propertiesList.push({
                  name: attr.name,
                  code: attr.code,
                  type: attr.type,
                  require: attr.config.isType,
                  options: attr.options,
                  id: attr.attributeId,
                  value: '',
                });
              } else {
                propertiesList.push({
                  name: attr.name,
                  code: attr.code,
                  type: attr.type,
                  require: attr.config.isType,
                  options: attr.options,
                  id: attr.attributeId,
                  value: '',
                });
              }
            });
          }

          const groupId = item.attributeGroupId;
          set.push({
            groupId,
            name: item.name,
            propertiesList,
          });
        });
        arrAttrHasValue.forEach(val => {
          set.forEach(group => {
            group.propertiesList.forEach(item => {
              if (item.id === val.id) {
                item.value = val.value;
              }
            });
          });
        });

        this.state.setValue = set;
        this.state.isSubmit = true;
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    // console.log(this.state);
    return (
      <div>
        <TextField
          id="standard-select-currency"
          select
          label="Chọn bộ thuộc tính"
          name="propertiesSetChoosen"
          style={{ marginLeft: 0, textAlign: 'left' }}
          variant="outlined"
          value={this.state.propertiesSetChoosen}
          onChange={this.handleChangeInput}
          className={classes.textField}
          // helperText="Please select your currency"
          margin="normal"
        >
          {this.state.propertiesSetList.map((item, index) => (
            <MenuItem key={item.id} value={index}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
        <div className={classes.expanDiv} hidden={this.state.propertiesSetChoosen === ''}>
          {this.state.setValue.map(item => (
            <ExpansionPanel expanded={expanded === item.groupId} onChange={this.handleChangeExpan(item.groupId)}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>{item.name}</ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <ValidatorForm style={{ width: '100%', display: 'inline' }} onSubmit={this.handleSubmitForm}>
                  <Grid container item md={12} spacing={24}>
                    {item.propertiesList &&
                      // eslint-disable-next-line consistent-return
                      item.propertiesList.map(control => {
                        if (
                          control.type !== 'list' &&
                          control.type !== 'select' &&
                          control.type !== 'multiSelect' &&
                          control.type !== 'bool' &&
                          control.type !== 'excel'
                        ) {
                          return (
                            <Grid item md={6} key={control.id}>
                              <TextValidator
                                label={`${control.name} (${control.code})`}
                                className={classes.textFieldControl}
                                variant="outlined"
                                type={control.type}
                                // value={control.value}
                                onKeyDown={e => this.handleChangeProperty(control.id, e)}
                                margin="normal"
                                // validators={['required', 'trim']}
                                // errorMessages={['Đồng chí phải nhập dữ liệu cho trường này', 'Dữ liệu không được nhập khoảng trắng']}
                                validators={control.require ? ['required', 'trim'] : []}
                                errorMessages={
                                  control.require ? ['Đồng chí phải nhập dữ liệu cho trường này', 'Dữ liệu không được nhập khoảng trắng'] : []
                                }
                              />
                            </Grid>
                          );
                        }
                        if (control.type === 'select') {
                          return (
                            <Grid item md={6} key={control.id}>
                              <TextField
                                id="standard-select-currency"
                                select
                                label={`${control.name} (${control.code})`}
                                variant="outlined"
                                value={control.value}
                                onChange={e => this.changeValue(control.id, e)}
                                className={classes.textFieldControl}
                                // helperText="Please select your currency"
                                margin="normal"
                              >
                                {control.options.map(item => (
                                  <MenuItem key={item._id} value={item._id}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          );
                        }
                        if (control.type === 'multiSelect' || control.type === 'list') {
                          return (
                            <Grid item md={6} key={control.id}>
                              <InputLabel style={{ fontSize: 12, marginLeft: 10, textAlign: 'left', display: 'block' }}>{`${control.name} (${
                                control.code
                              })`}</InputLabel>
                              <Select
                                multiple
                                style={{ marginTop: 8 }}
                                value={control.value}
                                className={classes.textFieldControl}
                                onChange={e => this.changeValue(control.id, e)}
                                // input={<Input id="select-multiple-checkbox" />}
                                renderValue={selected => selected.join(', ')}
                                MenuProps={MenuProps}
                                input={<OutlinedInput labelWidth={0} id="select-multiple-checkbox" />}
                              >
                                {control.options.map(item => (
                                  <MenuItem value={item.name} key={item.id}>
                                    <Checkbox checked={control.value.indexOf(item.name) > -1} />
                                    <ListItemText primary={`${item.name}`} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </Grid>
                          );
                        }
                        if (control.type === 'bool') {
                          return (
                            <Grid item md={6} key={control.id}>
                              <FormControlLabel
                                className={classes.textFieldControl}
                                control={
                                  <Checkbox
                                    checked={control.value}
                                    onChange={e => this.handleChangeCheckbox(control.id, e)}
                                    value="isDescribe"
                                    color="primary"
                                  />
                                }
                                label={`${control.name} (${control.code})`}
                              />
                            </Grid>
                          );
                        }
                      })}
                    <div className="d-none">
                      <button ref={this.submitBtn} type="submit" />
                    </div>
                  </Grid>
                </ValidatorForm>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </div>
      </div>
    );
  }

  handleChangeCheckbox = (propertyId, e) => {
    const { setValue } = this.state;
    setValue.forEach(group => {
      group.propertiesList.forEach(prop => {
        if (prop.id === propertyId) {
          prop.value = e.target.checked;
        }
      });
    });
    this.setState({ setValue });
  };

  handleChangeProperty = (propertyId, e) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.changeValue(propertyId, e), 1000);
  };

  changeValue = (propertyId, e) => {
    const { setValue } = this.state;
    setValue.forEach(group => {
      group.propertiesList.forEach(prop => {
        if (prop.id === propertyId) {
          prop.value = e.target.value;
        }
      });
    });
    this.setState({ setValue });
  };

  getData = () => {
    this.setState({ isSubmit: true });
    this.props.setOfAttribute.data = {
      setId: this.state.propertiesSetList[this.state.propertiesSetChoosen] ? this.state.propertiesSetList[this.state.propertiesSetChoosen].id : '',
      content: this.state.setValue || {},
    };
  };
}

EditSetOfAttributeForProduct.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(EditSetOfAttributeForProduct);
