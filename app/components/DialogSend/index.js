/* eslint-disable no-underscore-dangle */
/**
 *
 * DialogSend
 *
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Typography, IconButton, Button, Dialog, Radio } from '@material-ui/core';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Close } from '@material-ui/icons';
import _ from 'lodash';
import AsyncSelect from '../AsyncComponent';
import { API_USERS } from '../../config/urlConfig';
import './style.scss';
// import { da } from 'date-fns/locale';

/* eslint-disable react/prefer-stateless-function */

// Select

// const filter = (inputValue: string) =>
//   data.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];
const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

class DialogSend extends React.Component {
  state = {
    open: false,
    toUsers: [],
    superVision: '',
  };

  handleChangeRadio = event => {
    this.setState({ selectedValue: event.target.value });
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChangeSelect = (selectedOption, key) => {
    const { data } = this.state;
    data[key].name = selectedOption.value;
    this.setState({});
  };

  render() {
    let { toUsers, superVision } = this.state;
    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.handleClickOpen} style={{ margin: '20px 0px', float: 'right' }}>
          Chuyển tiếp
        </Button>

        <Dialog onClose={this.handleClose} fullWidth maxWidth="sm" open={this.state.open} aria-labelledby="scroll-dialog-title">
          <DialogTitle id="scroll-dialog-title">Bàn giao công văn</DialogTitle>
          <DialogContent style={{ height: '400px' }}>
            <div className="marginSelect">
              <Typography style={{ paddingBottom: '10px' }}>Chọn cá nhân, đơn vị nhận công văn</Typography>
              <AsyncSelect
                onChange={value => {
                  toUsers = value;
                  this.setState({ toUsers });
                }}
                value={toUsers}
                placeholder="Người nhận"
                API={API_USERS}
                modelName="Employee"
                isMulti
                noFormatValue
              />
            </div>
            {/*
            <div className="marginSelect">
              <Typography style={{ paddingBottom: '10px' }}>
                Chọn phòng ban nhận công văn
              </Typography>
              <Select
                defaultValue={colourOptions[1]}
                options={groupedOptions}
                components={{ Menu }}
              />
            </div> */}
            <div className="marginSelect">
              <Typography style={{ paddingBottom: '10px' }}>Chọn người theo dõi</Typography>
              <AsyncSelect
                onChange={value => {
                  superVision = value;
                  this.setState({ superVision });
                }}
                value={superVision}
                placeholder="Người theo dõi"
                API={API_USERS}
                modelName="Employee"
                isMulti
                noFormatValue
              />
            </div>
            <div>
              <Radio
                checked={this.state.selectedValue === 'a'}
                onChange={this.handleChangeRadio}
                value="a"
                name="radio-button-demo"
                aria-label="A"
                color="primary"
              />
              <span>Nhận xử lý</span>
              <Radio
                checked={this.state.selectedValue === 'b'}
                onChange={this.handleChangeRadio}
                value="b"
                name="radio-button-demo"
                aria-label="B"
                color="primary"
              />
              <span>Nhận công văn</span>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant='outlined'
              onClick={() => {
                const newDocumentary = Object.assign({}, this.props.documentary);
                const x = toUsers.map(user => user._id);
                // console.log(x, newDocumentary.toUsers);
                newDocumentary.toUsers = _.uniq([...newDocumentary.toUsers, ...x]);
                newDocumentary.type = '1';
                // console.log(newDocumentary);
                this.props.onSendDocument(newDocumentary);
              }}
            >
              Chuyển tiếp
            </Button>
            <Button onClick={this.handleClose} variant='outlined' color="primary">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DialogSend.propTypes = {};

export default DialogSend;
