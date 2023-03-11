/* eslint-disable no-alert */
/**
 *
 * LabelList
 *
 */

import React from 'react';
import TreeView from 'devextreme-react/tree-view';
import PropTypes from 'prop-types';

import { withStyles, Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Add } from '@material-ui/icons';
import DialogAcceptRemove from '../DialogAcceptRemove';
import styles from './styles';
import './styles.scss';
/* eslint-disable react/prefer-stateless-function */
class LabelList extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }

  state = {
    dialogData: {
      name: '',
      code: '',
    },
    dialog: false,
    isEditting: false,
    dialogRemove: false,
    treeData: [],
  };

  componentWillReceiveProps(props) {
    if (props.data !== undefined) {
      // const convertedData = convertChildToItems(props.data);
      // console.log(convertedData);
      this.setState({ treeData: props.data });
    }
  }

  render() {
    const { classes } = this.props;
    const { dialog, dialogRemove } = this.state;
    return (
      <div>
        <Button
          style={{ display: 'block' }}
          variant="contained"
          color='primary'
          onClick={() => {
            this.setState({
              dialog: true,
              dialogData: {
                name: '',
                code: '',
              },
            });
          }}
          className={classes.button}
          color="primary"
        >
          {/* <Add />  */}
          Thêm mới
        </Button>
        <TreeView
          items={this.state.treeData}
          dataStructure="plain"
          parentIdExpr="parent"
          keyExpr="_id"
          onItemSelectionChanged={this.selectionChanged('catagories')}
          showCheckBoxesMode="none"
          itemRender={this.renderTreeViewItem}
        />
        <Dialog onClose={this.handleDialog} aria-labelledby="customized-dialog-title" open={dialog}>
          <DialogTitle id="customized-dialog-title" onClose={this.handleDialog}>
            {this.state.isEditting ? 'Sửa loại' : 'Thêm loại'}
          </DialogTitle>
          <DialogContent style={{ width: 600 }}>
            <ValidatorForm onSubmit={this.handleSubmitForm}>
              <TextValidator
                id="standard-name"
                label="Tên danh mục"
                name="name"
                className={classes.textField}
                value={this.state.dialogData.name}
                onChange={this.handleChange('name')}
                margin="normal"
                validators={['required', 'trim']}
                errorMessages={['Đồng chí phải nhập dữ liệu cho trường này', 'Dữ liệu không được nhập khoảng trắng']}
              />
              <TextValidator
                id="standard-name"
                label="Code"
                name="name"
                className={classes.textField}
                value={this.state.dialogData.code}
                onChange={this.handleChange('code')}
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

  handleDialog = () => {
    const { dialog } = this.state;
    this.setState({ dialog: !dialog });
  };

  handleDialogRemove = () => {
    const { dialogRemove } = this.state;
    this.setState({ dialogRemove: !dialogRemove });
  };

  handleChange = key => e => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const newDialogData = Object.assign({}, this.state.dialogData);
    newDialogData[key] = e.target.value;
    this.setState({ dialogData: newDialogData });
  };

  renderTreeViewItem = item => {
    const { classes } = this.props;
    return (
      <p className={classes.treeItem}>
        <span>{`${item.name}  `}</span>
        <Button
          size="small"
          className={classes.edit}
          onClick={() => {
            const editData = Object.assign({}, item);
            this.setState({
              dialog: true,
              isEditting: true,
              dialogData: editData,
            });
          }}
        >
          [Sửa]
        </Button>
        <Button
          size="small"
          className={classes.delete}
          onClick={() => {
            // eslint-disable-next-line no-restricted-globals
            const r = confirm('Đồng chí có muốn xóa loại này');
            if (r) {
              this.props.callBack('delete-tag', item);
            }
          }}
        >
          [Xóa]
        </Button>
      </p>
    );
  };

  handleSubmitForm = () => {
    // const { dialog } = this.state;
    this.setState({ dialog: false });

    if (!this.state.isEditting) {
      this.props.callBack('add-tag', this.state.dialogData);
    } else {
      this.props.callBack('update-tag', this.state.dialogData);
    }
  };

  selectionChanged = name => e => {
    const value = e.node;
    if (this.isRole(value)) {
      this.processRoles(
        {
          id: value.key,
          text: value.text,
          itemData: value.itemData,
          selected: value.selected,
          category: value.parent.text,
        },
        name,
      );
    } else {
      value.items.forEach(role => {
        this.processRoles(
          {
            id: role.key,
            text: role.text,
            itemData: role.itemData,
            selected: role.selected,
            category: value.text,
          },
          name,
        );
      });
    }
  };

  isRole = data => !data.items.length;

  processRoles = (role, name) => {
    /* eslint-disable */
    this.setState(prevState => {
      if (name === 'warningTree') {
        let itemIndex = -1;
        const { waringCheckedList } = prevState;
        waringCheckedList.forEach((item, index) => {
          if (item.id === role.id) {
            itemIndex = index;
            return false;
          }
        });
        if (role.selected && itemIndex === -1) {
          waringCheckedList.push(role);
        } else if (!role.selected) {
          waringCheckedList.splice(itemIndex, 1);
        }
        return { waringCheckedList: waringCheckedList.slice(0) };
      }
    });
    /* eslint-enable */
  };
}

LabelList.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(LabelList);
