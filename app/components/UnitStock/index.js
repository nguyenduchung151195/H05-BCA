/* eslint-disable no-alert */
/**
 *
 * UnitStock
 *
 */

import React from 'react';

import PropTypes from 'prop-types';
// import classNames from 'classnames';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';

import { withStyles, Button, Dialog, DialogTitle, DialogActions, DialogContent, ListItem } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import DialogAcceptRemove from '../DialogAcceptRemove';

import styles from './styles';
import './styles.scss';
/* eslint-disable react/prefer-stateless-function */
class UnitStock extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }

  state = {
    dialog: false,
    dialogRemove: false,
    dialogData: { name: '', code: '' },
    isEditting: false,
  };

  handleDialog = () => {
    const { dialog } = this.state;
    this.setState({
      dialog: !dialog,
      isEditting: false,
    });
  };

  handleEdit = item => () => {
    const editData = Object.assign({}, item);
    this.setState({
      dialog: true,
      isEditting: true,
      dialogData: editData,
    });
  };

  handleDialogRemove = () => {
    const { dialogRemove } = this.state;
    this.setState({ dialogRemove: !dialogRemove });
  };

  handleSubmitForm = () => {
    if (this.state.isEditting === false) {
      this.props.callBack('add-unit', this.state.dialogData);
    } else {
      this.props.callBack('update-unit', this.state.dialogData);
    }
    this.setState({ dialog: false, dialogData: {} });
  };

  render() {
    const { classes, data } = this.props;
    const { dialog, dialogRemove } = this.state;
    // console.log(data);
    return (
      <div>
        <Button
          style={{ display: 'block' }}
          onClick={() => {
            this.setState({
              dialog: true,
              dialogData: { name: '', code: '' },
              isEditting: false,
            });
          }}
          className={classes.button}
          variant='contained'
          color="primary"
        >
          {/* <Add />  */}
          Thêm mới
        </Button>
        {data ? (
          <div>
            {data.map(item => (
              <ListItem divider key={item.code}>
                <p className={classes.treeItem}>
                  <span>{`${item.name}  `}</span>
                  <Button size="small" className={classes.edit} onClick={this.handleEdit(item)}>
                    [Sửa]
                  </Button>
                  <Button
                    onClick={() => {
                      // eslint-disable-next-line no-restricted-globals
                      const r = confirm('Đồng chí có muốn xóa đơn vị này ?');
                      if (r) {
                        this.props.callBack('delete-unit', item);
                      }
                    }}
                    size="small"
                    className={classes.delete}
                  >
                    [Xóa]
                  </Button>
                </p>
              </ListItem>
            ))}
          </div>
        ) : (
          ''
        )}

        <Dialog onClose={this.handleDialog} aria-labelledby="customized-dialog-title" open={dialog}>
          <DialogTitle id="customized-dialog-title" onClose={this.handleDialog}>
            {this.state.isEditting ? 'Sửa đơn vị tính' : ' Thêm mới đơn vị tính'}
          </DialogTitle>
          <DialogContent style={{ width: 600 }}>
            <ValidatorForm onSubmit={this.handleSubmitForm}>
              <TextValidator
                variant="outlined"
                id="standard-name"
                label="Tên đơn vị tính"
                name="name"
                className={classes.textField}
                validators={['required', 'trim']}
                errorMessages={['Đồng chí phải nhập dữ liệu cho trường này', 'Dữ liệu không được nhập khoảng trắng']}
                value={this.state.dialogData.name}
                onChange={event => {
                  const { dialogData } = this.state;
                  dialogData.name = event.target.value;
                  this.setState({ dialogData });
                }}
                margin="normal"
              />
              <TextValidator
                variant="outlined"
                id="standard-name"
                label="Code"
                name="name"
                className={classes.textField}
                value={this.state.dialogData.code}
                onChange={event => {
                  const { dialogData } = this.state;
                  dialogData.code = event.target.value;
                  this.setState({ dialogData });
                }}
                margin="normal"
                validators={['required', 'minStringLength: 5', 'trim']}
                errorMessages={['Đồng chí phải nhập dữ liệu cho trường này', 'Độ dài code lớn hơn hoặc bằng 5', 'Dữ liệu không được nhập khoảng trắng']}
              />
              <div className="d-none">
                <button ref={this.submitBtn} type="submit" />
              </div>
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                // console.log(this.submitBtn.current.click());
                this.submitBtn.current.click();
              }}
              variant="contained"
              color="primary"
            >
              {this.state.isEditting ? 'LƯU' : 'LƯU'}
            </Button>
            <Button variant="contained" color="secondary" onClick={this.handleDialog}>Hủy</Button>
          </DialogActions>
        </Dialog>
        <DialogAcceptRemove handleClose={this.handleDialogRemove} openDialogRemove={dialogRemove} title="Đồng chí có muốn xóa danh mục" />
      </div>
    );
  }
}

UnitStock.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(UnitStock);
