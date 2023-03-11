/**
 *
 * ModelTableDisplaySetting
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
/* eslint-disable react/prefer-stateless-function */
class ModelTableDisplaySetting extends React.Component {
  state = {
    columns: [],
  };

  componentDidMount() {
    const { columns } = this.props;
    this.setState({ columns });
  }

  componentWillUpdate() {
    const { columns } = this.props;
    // this.setState({ columns });
    this.state.columns = columns;
  }

  // Lựa chọn các dòng hiện trên bảng
  handleSelectConfigTable = (e, value) => {
    const currentColumnChecked = this.state.columns;
    currentColumnChecked.forEach((item, index) => {
      if (item.name === value) {
        currentColumnChecked[index].checked = e.target.checked;
      }
    });
    const newCol = [];
    currentColumnChecked.forEach(item => {
      newCol.push(item);
    });
    this.setState({ columns: newCol });
  };

  // Thay đổi số dòng hiển thị trên trang
  handleOnChange = (event, name) => {
    const { columns } = this.state;
    const currentColumns = columns.find(item => item.name === name);
    currentColumns.title = event.target.value;
    this.setState({ columns });
  };

  render() {
    return (
      <Dialog
        fullWidth
        open={this.props.openDialogTableSetting}
        onClose={() => this.props.handleChangeDialogTableSetting(this.state.openDialogTableSetting)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Thiết lập hiển thị bảng</DialogTitle>
        <DialogContent>
          <List dense>
            {this.state.columns.map(value => {
              if (value.name === 'checkbox') return false;
              return (
                <ListItem key={value.name} button>
                  <TextField
                    defaultValue={value.title}
                    name={value.name}
                    onChange={e => this.handleOnChange(e, value.name)}
                    style={{ width: '100%' }}
                  />
                  <ListItemSecondaryAction>
                    <Checkbox checked={value.checked} onClick={e => this.handleSelectConfigTable(e, value.name)} color="primary" />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
        <Button
            variant="contained"
            color="primary"
            onClick={() => this.props.handleChangeDialogTableSetting(this.props.openDialogTableSetting, true, this.state.columns)}
          >
            LƯU
          </Button>
          <Button variant="contained" onClick={() => this.props.handleChangeDialogTableSetting(this.props.openDialogTableSetting, false)}>
            Hủy
          </Button>
         
        </DialogActions>
      </Dialog>
    );
  }
}

ModelTableDisplaySetting.propTypes = {
  columns: PropTypes.array.isRequired,
  openDialogTableSetting: PropTypes.bool.isRequired,
  handleChangeDialogTableSetting: PropTypes.func.isRequired,
};

export default ModelTableDisplaySetting;
