import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Fab, Dialog, DialogActions, DialogContent, TextField, DialogTitle, Button, MenuItem } from '@material-ui/core';
import { Edit, Delete, Add } from '@material-ui/icons';
import SortableTree, { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';
import styles from './styles';
import './styles.css';
import CustomTheme from 'components/ThemeSortBar/index';
import CustomInputBase from 'components/Input/CustomInputBase';
import DialogAcceptRemove from 'components/DialogAcceptRemove';
import NumberFormat from 'react-number-format';
import { addSingle, previewTextToPdf } from '../../../utils/api/file';
import DialogUI from '../../../components/LifetekUi/Dialog';

class WordPositionModal extends React.Component {
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

  onSave = () => {
    const treeData = this.state.treeData.map(e => {
      const data = { ...e }
      data.x = data.x ? Number(data.x) : 0
      data.y = data.y ? Number(data.y) : 0
      data.fontSize = data.fontSize ? Number(data.fontSize) : 0
      return data
    })
    this.props.callBack('update-source', treeData, this.props.data, this.props.sourceIndex);
  }

  onDemo = async (e) => {
    const file = e.target.files[0]
    const url = await addSingle(file)
    const { x, y, fontSize } = this.state.dialogData
    const body = {
      x: x ? Number(x) : 0,
      y: y ? Number(y) : 0,
      fontSize: fontSize ? Number(fontSize) : 0,
      id: url.split('/').pop(),
      content: 'XXXX/DEMO-SCV'
      // newFile: true,
    }
    const base64 = await previewTextToPdf(body)
    const uri = `data:application/pdf;base64,${base64}`
    this.setState({ docFile: uri });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root} style={{ height: '80%' }}>
        <h4>{this.props.title}</h4>
        <div className="text-right">
          {this.state.treeData !== this.props.data.data ? (
            <Button
              onClick={this.onSave}
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

        <DialogUI maxWidth={false} fullScreen open={this.state.docFile} onClose={() => this.setState({ docFile: null })}>
          <div style={{ height: 1200 }}>
            {this.state.docFile && <iframe title="PDF" src={this.state.docFile} width="100%" height="100%" value="file" />}
          </div>
        </DialogUI>

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
                dialogData.value = event.target.value;
                this.setState({ dialogData });
              }}
              error={this.state.dialogData.value === ''}
              autoFocus
            />

            <NumberFormat
              label={'X'}
              customInput={CustomInputBase}
              value={this.state.dialogData.x}
              name="x"
              onChange={event => {
                const { dialogData } = this.state;
                dialogData.x = event.target.value;
                this.setState({ dialogData });
              }}
              error={this.state.dialogData.x === ''}
              autoFocus
            />

            <NumberFormat
              label={'Y'}
              customInput={CustomInputBase}
              value={this.state.dialogData.y}
              name="y"
              onChange={event => {
                const { dialogData } = this.state;
                dialogData.y = event.target.value;
                this.setState({ dialogData });
              }}
              error={this.state.dialogData.y === ''}
              autoFocus
            />

            <NumberFormat
              label={'Phông chữ'}
              customInput={CustomInputBase}
              value={this.state.dialogData.fontSize}
              name="fontSize"
              onChange={event => {
                const { dialogData } = this.state;
                dialogData.fontSize = event.target.value;
                this.setState({ dialogData });
              }}
              error={this.state.dialogData.fontSize === ''}
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <label for='fileDemo'>
              <Button
                variant="contained"
                color="primary"
                component="span"
              >
                <span style={{ fontWeight: 'bold' }}>Chọn mẫu</span>
              </Button>
            </label>
            <input
              type="file"
              id='fileDemo'
              name='fileDemo'
              onChange={this.onDemo}
              style={{ display: 'none' }}
              accept={['.pdf']}
            />
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
              LƯU
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
      </div >
    );
  }
}

WordPositionModal.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string.isRequired,
  // items: PropTypes.array,
};

export default withStyles(styles)(WordPositionModal);
