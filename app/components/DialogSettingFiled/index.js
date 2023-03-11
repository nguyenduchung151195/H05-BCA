/**
 *
 * DialogSettingFiled
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';

import {
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  FormControlLabel,
  Checkbox,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  Button,
} from '@material-ui/core';

/* eslint-disable react/prefer-stateless-function */
class DialogSettingFiled extends React.Component {
  state = {
    currentFields: {},
  };

  componentWillMount() {
    this.state.currentFields = this.props.currentFields;
  }

  handleChangeValueSetting = e => {
    const { currentFields } = this.state;
    if (e.target.name === 'isRequire') {
      currentFields.isRequire = !currentFields.isRequire;
    } else currentFields[e.target.name] = e.target.value;
    this.setState({ currentFields });
  };

  render() {
    const { currentFields } = this.state;
    const { openDialog, classes } = this.props;
    return (
      <div style={{ zIndex: 1000 }}>
        <Dialog
          open={openDialog}
          onClose={this.handleSelectDialogSetting}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Thiết lập trường</DialogTitle>
          <DialogContent style={{ minWidth: 500 }}>
            <TextField
              id="outlined-number"
              label="Tiêu đề"
              value={currentFields.title}
              name="title"
              type="textField"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.handleChangeValueSetting}
              margin="normal"
              variant="outlined"
              style={{ width: '100%' }}
            />
            <TextField
              id="outlined-number"
              label="Mô tả"
              value={currentFields.description}
              type="textField"
              InputLabelProps={{
                shrink: true,
              }}
              name="description"
              onChange={this.handleChangeValueSetting}
              multiline
              margin="normal"
              variant="outlined"
              style={{ width: '100%' }}
            />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
                htmlFor="outlined-age-simple"
              >
                Kiểu dữ liệu
              </InputLabel>
              <Select
                value={currentFields.type}
                // onChange={this.handleChange}
                name="type"
                onChange={this.handleChangeValueSetting}
                input={<OutlinedInput labelWidth={this.state.labelWidth} name="age" id="outlined-age-simple" />}
              >
                <MenuItem value="text">Văn bản</MenuItem>
                <MenuItem value="number">Số </MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentFields.isRequire}
                  // onChange={this.handleChange('jason')}
                  onChange={this.handleChangeValueSetting}
                  value={currentFields.isRequire}
                  name="isRequire"
                />
              }
              label="Trường bắt buộc nhập"
            />
          </DialogContent>
          <DialogActions>
          <Button variant="contained" onClick={this.props.handleSelectDialogSetting} color="primary" autoFocus>
              LƯU
            </Button>
            <Button variant="contained" onClick={() => this.props.handleChangeSettingField(currentFields)} color="secondary">
              Hủy
            </Button>
            
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DialogSettingFiled.propTypes = {};

export default DialogSettingFiled;
