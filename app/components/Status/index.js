/* eslint-disable no-alert */
/**
 *
 * Status
 *
 */

import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Fab, Dialog, DialogActions, DialogContent, TextField, DialogTitle, Button, MenuItem } from '@material-ui/core';
import { Edit, Delete, Add } from '@material-ui/icons';

import SortableTree, { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';

import styles from './styles';
import './styles.css';
import CustomInputField from '../Input/CustomInputField';
import CustomTheme from '../ThemeSortBar/index';
import DialogAcceptRemove from '../DialogAcceptRemove';
import CustomInputBase from '../../components/Input/CustomInputBase';

/* eslint-disable react/prefer-stateless-function */
function convertToSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

class Status extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialogRemove: false,
      openDialog: false,
      dialogData: { title: '', value: '', moduleCode: {} },
      isEditting: false,
      rowInfo: undefined,
      module: 'null',
      treeData: [],
    };
  }

  componentDidMount() {
    this.setState({ treeData: this.props.data.data });
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      // this.setState({
      //   treeData: props.data.data,
      // });
    }

    // console.log(props);
  }

  handleDialogRemove = () => {
    const { openDialogRemove } = this.state;
    this.setState({
      openDialogRemove: !openDialogRemove,
    });
  };

  addChild = () => {
    const { dialogData, treeData } = this.state;
    if (dialogData.title !== '' && dialogData.value !== '') {
      const newTree = [...treeData, dialogData];
      this.setState({ treeData: newTree, openDialog: false, isEditting: false });
    } else {
      alert('Không được để trống tên loại, mã loại!!!');
    }
  };

  updateChild = () => {
    const { rowInfo, dialogData, treeData } = this.state;
    if (dialogData.title !== '' && dialogData.value !== '') {
      const getNodeKey = ({ treeIndex }) => treeIndex;
      const newTree = changeNodeAtPath({
        treeData,
        path: rowInfo.path,
        getNodeKey,
        newNode: { ...dialogData, ...{ value: dialogData.value } },
      });
      this.setState({ treeData: newTree });
    } else {
      alert('Không được để trống tên loại!!!');
    }
  };

  handleChangeModule = event => {
    let { dialogData } = this.state;
    let val = event.target.value;
    this.setState({ module: val });

    switch (val) {
      case 0:
        dialogData.moduleCode = {
          api: '/api/incommingdocument',
          label: 'Module',
          title: 'Văn bản đến',
          value: 'IncommingDocument',
        };
        this.setState({ dialogData });
        break;
      case 1:
        dialogData.moduleCode = {
          api: '/api/outgoingdocument',
          label: 'Module',
          title: 'Văn bản đi',
          value: 'OutGoingDocument',
        };
        this.setState({ dialogData });
        break;
      default:
        break;
    }
  };

  removeChild = rowInfo => {
    const { treeData } = this.state;
    const getNodeKey = ({ treeIndex }) => treeIndex;
    // eslint-disable-next-line no-restricted-globals
    const r = confirm('Đồng chí có muốn xóa phần tử này?');
    if (r) {
      const newTree = removeNodeAtPath({ treeData, path: rowInfo.path, getNodeKey });
      this.setState({ treeData: newTree });
    }
  };

  render() {
    const { classes } = this.props;
    let href = window.location.href;
    href = href.split('/');
    let typeUrl = href && href.length > 0 && href[href.length - 1] === 'DocumentConfig' ? true : false;
    const { extraFields } = this.props.data;
    let modules = [];
    if (typeUrl) {
      modules =
        JSON.parse(localStorage.getItem('viewConfig')) &&
        JSON.parse(localStorage.getItem('viewConfig')).map(f => f.api && { value: f.code, api: f.api, title: f.title });
      modules = modules.filter(f => f);
    }

    return (
      <div className={classes.root} style={{ height: '80%' }}>
        <h4>{this.props.title}</h4>
        <div className="text-right">
          {this.state.treeData !== this.props.data.data ? (
            <Button
              onClick={() => {
                this.props.callBack('update-source', this.state.treeData, this.props.data, this.props.sourceIndex);
              }}
              size="small"
              variant="contained"
              color="primary"
              autoFocus
              round
              className="mx-3"
            >
              Lưu
            </Button>
          ) : (
            ''
          )}
          <Button
            color="primary"
            size="small"
            variant="contained"
            round
            onClick={() => {
              this.setState({ isEditting: false, dialogData: { title: '', value: '', extraValue: {} }, openDialog: true });
            }}
          >
            {/* <Add />  */}
            Thêm mới
          </Button>
        </div>

        <div style={{ width: '100%', height: '100%' }}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => {
              this.setState({ treeData });
            }}
            theme={CustomTheme}
            canDrag={({ node }) => !node.noDragging}
            isVirtualized
            // eslint-disable-next-line consistent-return
            generateNodeProps={rowInfo => {
              // console.log('rowINfo', rowInfo);
              if (!rowInfo.node.noDragging) {
                return {
                  buttons: [
                    <Fab
                      color="primary"
                      size="small"
                      onClick={() => {
                        const dialogData = Object.assign({ extraValue: {} }, rowInfo.node);

                        this.setState({ isEditting: true, openDialog: true, dialogData, rowInfo });
                      }}
                      style={{ marginLeft: 10 }}
                      title="Chỉnh sửa"
                    >
                      <Edit />
                    </Fab>,
                    <Fab
                      color="secondary"
                      size="small"
                      style={{ marginLeft: 10 }}
                      title="Xóa"
                      onClick={() => {
                        this.removeChild(rowInfo);
                      }}
                    >
                      <Delete />
                    </Fab>,
                  ],
                };
              }
            }}
            style={{ fontFamily: 'Tahoma' }}
          />
        </div>

        <DialogAcceptRemove
          title="Đồng chí có muốn xóa trạng thái này không?"
          openDialogRemove={this.state.openDialogRemove}
          handleClose={this.handleDialogRemove}
        />
        <Dialog open={this.state.openDialog} onClose={this.handleDialogAdd}>
          <DialogTitle id="alert-dialog-title">
            <p style={{ fontSize: 18, fontWeight: 600 }}>{this.state.isEditting ? 'Cập nhật loại' : 'Thêm mới loại'}</p>
          </DialogTitle>
          <DialogContent style={{ width: 600, height: 300 }}>
            <CustomInputBase
              label={'Tên loại'}
              value={this.state.dialogData.title}
              name="name"
              onChange={event => {
                const { dialogData } = this.state;
                dialogData.title = event.target.value;
                this.setState({ dialogData });
              }}
              error={this.state.dialogData.value === ''}
              autoFocus
            />
            {/* <TextField
              id="standard-name"
              label="Tên loại"
              className={classes.textField}
              value={this.state.dialogData.title}
              onChange={event => {
                const { dialogData } = this.state;
                dialogData.title = event.target.value;
                this.setState({ dialogData });
              }}
              error={this.state.dialogData.title === ''}
              margin="normal"
              name="name"
            /> */}
            <CustomInputBase
              label={'Mã loại'}
              value={this.state.dialogData.value}
              name="value"
              onChange={event => {
                const { dialogData } = this.state;
                dialogData.value = event.target.value;
                this.setState({ dialogData });
              }}
              error={this.state.dialogData.value === ''}
              autoFocus
            />
            {/* <TextField
              id="standard-value"
              label="Mã loại"
              className={classes.textField}
              value={this.state.dialogData.value}
              onChange={event => {
                const { dialogData } = this.state;
                dialogData.value = event.target.value;
                this.setState({ dialogData });
              }}
              error={this.state.dialogData.value === ''}
              margin="normal"
              name="value"
            /> */}
            {typeUrl && (
              // <CustomInputField
              //   options={modules}
              //   name={'moduleCode'}
              //   label={'Module'}
              //   typeDoc={this.state.dialogData && this.state.dialogData.moduleCode && this.state.dialogData.moduleCode.value}
              //   value={this.state.dialogData.value}
              //   onChange={(newVal, e) => {
              //     const { dialogData } = this.state;
              //     dialogData.moduleCode = newVal.target.value;
              //     this.setState({ ...dialogData, moduleCode: newVal.target.value });
              //   }}
              // />

              <TextField
                select
                fullWidth
                label="Module"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                onChange={this.handleChangeModule}
                value={this.state.module}
              >
                <MenuItem value={'null'}>---Chọn---</MenuItem>
                <MenuItem value={0}>Văn bản đến</MenuItem>
                <MenuItem value={1}>Văn bản đi</MenuItem>
              </TextField>
            )}

            {extraFields.length > 0
              ? extraFields.map(
                c =>
                  c.type !== 'String' ? (
                    <CustomInputField
                      options={c.menuItem ? c.menuItem : ''}
                      configType={c.configType ? c.configType : ''}
                      configCode={c.configCode ? c.configCode : ''}
                      type={c.type}
                      name={c.name}
                      label={c.title}
                      value={this.state.dialogData.extraValue ? this.state.dialogData.extraValue[c.title] : null}
                      onChange={(newVal, e) => {
                        const { dialogData } = this.state;
                        // console.log(newVal, e, 'hhh')
                        (dialogData.extraValue[c.title] =
                          c.type.includes('Source') || c.type.includes('MenuItem') || c.type === 'Number' || c.type === 'date'
                            ? newVal.target.value
                            : c.type === 'Date' && (c.filterType || c.dateFilterType)
                              ? newVal.target.value
                              : newVal),
                          this.setState({ dialogData });
                        // console.log(this.state.dialogData, 'llll');
                      }}
                    />
                  ) : (
                    <TextField
                      label={c.title}
                      className={classes.textField}
                      value={this.state.dialogData.extraValue ? this.state.dialogData.extraValue[c.title] : null}
                      onChange={event => {
                        const { dialogData } = this.state;
                        // console.log(dialogData,'dialogData')
                        dialogData.extraValue[c.title] = event.target.value;
                        this.setState({ dialogData });
                      }}
                      // error={this.state.dialogData.extraValue.value === ''}
                      margin="normal"
                      name="value"
                    />
                  ),
              )
              : null}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                if (this.state.isEditting) {
                  this.setState({ openDialog: false });
                  this.updateChild();
                } else {
                  this.addChild();
                }
              }}
              variant="contained"
              color="primary"
            >
              {this.state.isEditting ? 'LƯU' : 'LƯU'}
            </Button>
            <Button
              onClick={() => {
                this.setState({ openDialog: false });
              }}
              variant="contained"
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
}

Status.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string.isRequired,
  // items: PropTypes.array,
};

export default withStyles(styles)(Status);
