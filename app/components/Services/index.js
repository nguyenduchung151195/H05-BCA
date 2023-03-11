/* eslint-disable no-restricted-globals */
/**
 *
 * Services
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { SelectionState, PagingState, IntegratedPaging, IntegratedSelection } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel, TableSelection } from '@devexpress/dx-react-grid-material-ui';
import { Paper, IconButton, Fab, Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Add, Edit, Delete } from '@material-ui/icons';
/* eslint-disable react/prefer-stateless-function */
class Services extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{ name: 'id', title: 'STT' }, { name: 'code', title: 'Mã' }, { name: 'name', title: 'Tên' }, { name: 'action', title: 'Hành động' }],
      pageSizes: [10, 50, 100],
      selection: [],
      dialog: false,
      isEditting: false,
      dialogData: {},
    };
    this.changeSelection = selection => this.setState({ selection });
    // this.changeCurrentPage = currentPage => this.setState({ currentPage });
    // this.changePageSize = pageSize => this.setState({ pageSize });
    this.submitBtn = React.createRef();
  }

  handleSubmitForm = () => {
    if (this.state.isEditting === false) {
      this.props.callBack('add-service', this.state.dialogData);
    } else {
      this.props.callBack('update-service', this.state.dialogData);
    }
    this.setState({ dialog: false, dialogData: {} });
  };

  render() {
    const { columns, pageSizes, selection } = this.state;

    const newRows = this.props.data.map((item, index) => ({
      ...item,
      ...{
        action: (
          <div>
            <IconButton
              onClick={() => {
                this.setState({
                  dialogData: Object.assign({}, item),
                  dialog: true,
                  isEditting: true,
                });
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </div>
        ),
        id: index + 1,
      },
    }));
    const pagingPanelMessages = {
      showAll: 'Alle',
      rowsPerPage: 'Số dòng hiển thị',
      info: '{from} - {to} của {count} ',
    };
    return (
      <div>
        <Paper>
          <div className="text-right p-3">
            {selection.length > 0 ? <span className="float-left">Đã chọn: {selection.length}</span> : ''}

            {selection.length > 0 ? (
              <Fab
                onClick={() => {
                  // eslint-disable-next-line no-alert
                  const r = confirm('Đồng chí có muốn xóa dịch vụ này?');
                  if (r) {
                    const deleteIds = [];
                    this.state.selection.forEach(element => {
                      deleteIds.push(this.props.data[element]._id);
                    });
                    this.setState({ selection: [] });

                    this.props.callBack('delete-services', deleteIds);
                  }
                }}
                size="small"
                color="secondary"
              >
                <Delete />
              </Fab>
            ) : (
              <div>
                <Fab
                  className="mx-3"
                  onClick={() => {
                    this.setState({
                      dialogData: { name: '', code: '', description: '' },
                      dialog: true,
                      isEditting: false,
                    });
                  }}
                  size="small"
                  color="primary"
                  aria-label="Add"
                >
                  <Add />
                </Fab>
              </div>
            )}
            <div className="clearfix" />
          </div>
          <Grid rows={newRows} columns={columns}>
            <SelectionState selection={selection} onSelectionChange={this.changeSelection} />
            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
            <IntegratedPaging />
            <IntegratedSelection />
            <Table />
            <TableHeaderRow />
            <TableSelection showSelectAll />
            <PagingPanel messages={pagingPanelMessages}
              pageSizes={pageSizes} />
          </Grid>
        </Paper>
        {/* DIALOG THEM SUA */}
        <Dialog
          onClose={() => {
            const { dialog } = this.state;
            this.setState({
              dialog: !dialog,
              isEditting: false,
            });
          }}
          aria-labelledby="customized-dialog-title"
          open={this.state.dialog}
        >
          <DialogTitle id="customized-dialog-title">{this.state.isEditting ? 'Sửa dịch vụ' : ' Thêm mới dịch vụ'}</DialogTitle>
          <DialogContent style={{ width: 600 }}>
            <ValidatorForm onSubmit={this.handleSubmitForm}>
              <TextValidator
                fullWidth
                variant="outlined"
                id="standard-name"
                label="Tên dịch vụ"
                name="name"
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
                fullWidth
                variant="outlined"
                id="standard-name"
                label="Mô tả dịch vụ"
                multiline
                rows="4"
                rowsMax="4"
                name="name"
                validators={['required', 'trim']}
                errorMessages={['Đồng chí phải nhập dữ liệu cho trường này', 'Dữ liệu không được nhập khoảng trắng']}
                value={this.state.dialogData.description}
                onChange={event => {
                  const { dialogData } = this.state;
                  dialogData.description = event.target.value;
                  this.setState({ dialogData });
                }}
                margin="normal"
              />
              <TextValidator
                fullWidth
                variant="outlined"
                id="standard-name"
                label="Code"
                name="name"
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
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                const { dialog } = this.state;
                this.setState({
                  dialog: !dialog,
                  isEditting: false,
                });
              }}
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Services.propTypes = {};

export default Services;
