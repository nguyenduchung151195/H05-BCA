/* eslint-disable no-alert */
/**
 *
 * TdtProduct
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogContent,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  OutlinedInput,
  TablePagination,
} from '@material-ui/core';
import SearchBar from 'material-ui-search-bar';
import { withStyles } from '@material-ui/core/styles';
import TreeView from 'devextreme-react/tree-view';
// import MuiTreeView from 'material-ui-treeview';

import './styles.scss';
/* eslint-disable react/prefer-stateless-function */

import { observer } from 'mobx-react';
import { observable } from 'mobx';
const tree = [
  // danh sách các hành động trong quyền
  {
    id: '1',
    text: 'Chọn tất cả các phòng ban',
    expanded: true,
    items: [
      {
        id: '1_1',
        text: 'Phòng kinh doanh:',
        items: [
          {
            id: '1_1_1',
            text: 'Phòng kinh doanh 1',
          },
          {
            id: '1_1_2',
            text: 'Phòng kinh doanh 2',
          },
        ],
      },
      {
        id: '1_2',
        text: 'Phòng nhân sự:  ',
        items: [
          {
            id: '1_2_1',
            text: 'Phòng nhân sự 1',
          },
          {
            id: '1_2_2',
            text: 'Phòng nhân sự 2',
          },
          {
            id: '1_2_3',
            text: 'Phòng nhân sự 3',
          },
        ],
      },
      {
        id: '1_3',
        text: 'Phòng IT:',
        items: [
          {
            id: '1_3_1',
            text: 'Phòng IT 1',
          },
          {
            id: '1_3_2',
            text: 'Phòng IT 2',
          },
        ],
      },
    ],
  },
];
/* eslint-disable react/prefer-stateless-function */
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

@observer
class TdtProduct extends React.Component {
  @observable
  isAddDialogOpening = false;

  @observable
  isDrawerOpen = true;

  @observable
  datafake = [{ product: 'Sản phẩm 1', unit: 300000, qty: 2, countType: 1 }, { product: 'Sản phẩm 2', unit: 200000, qty: 1, countType: 3 }];

  @observable
  productfake = [{ product: 'Sản phẩm 1', unit: 300000, qty: 2, countType: 1 }, { product: 'Sản phẩm 2', unit: 200000, qty: 1, countType: 3 }];

  state = {
    checkedA: true,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  getTotalMoney = () => {
    let total = 0;
    this.datafake.forEach(element => {
      total += element.qty * element.unit;
    });
    return total;
  };

  openNav = () => {
    const mainViewWidth = document.getElementById('mainView').offsetWidth;

    if (document.getElementById('mySidebar').offsetWidth === 300) {
      document.getElementById('mySidebar').style.width = '0';
      document.getElementById('mainView').style.width = '100%';

      this.isDrawerOpen = false;
    } else {
      document.getElementById('mySidebar').style.width = '300px';

      document.getElementById('mainView').style.width = `${mainViewWidth - 300}px`;
      this.isDrawerOpen = true;
    }
  };

  closeNav = () => {};

  handleDeleteProduct = index => {
    this.datafake.splice(index, 1);
  };

  handleSelectProduct = item => {
    // eslint-disable-next-line no-restricted-globals
    const r = confirm('Đồng chí muốn thêm dịch vụ/ sản phẩm này?');
    if (r) {
      this.datafake.push(item);
    }
  };

  render() {
    // const { classes } = props;

    return (
      <div>
        <div className="py-3 text-right bg-light">
          <FormControlLabel
            control={<Checkbox checked={this.state.checkedA} onChange={this.handleChange('checkedA')} value="checkedA" />}
            label="Show discount"
          />
          <Button
            className="mx-2"
            variant="contained"
            onClick={() => {
              this.isAddDialogOpening = true;
            }}
          >
            Chọn SP/DV
          </Button>
          <Button className="mx-2" variant="contained">
            Thêm mới SP/DV
          </Button>
        </div>
        <div className="bg-light">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell align="right">Sản phẩm/Dịch vụ</TableCell>
                <TableCell align="right">Đơn giá</TableCell>
                <TableCell align="right">Số lượng</TableCell>
                <TableCell align="right">Đơn vị tính</TableCell>
                <TableCell align="right">Tổng tiền</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {this.datafake.map((item, index) => (
                <TableRow key={item.product}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="right">{item.product}</TableCell>
                  <TableCell align="right">{item.unit}</TableCell>
                  <TableCell align="right">
                    <TextField
                      id="outlined-name"
                      value={item.qty}
                      onChange={event => {
                        this.datafake[index].qty = event.target.value;
                      }}
                      margin="normal"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <FormControl fullWidth>
                      <Select variant="outlined" value={item.countType} input={<OutlinedInput labelWidth={0} name="age" id="outlined-age-simple" />}>
                        <MenuItem value={1}>Ten</MenuItem>
                        <MenuItem value={3}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right">{item.unit * item.qty}</TableCell>
                  <TableCell align="right">
                    {/* eslint-disable jsx-a11y/click-events-have-key-events */}

                    {/* eslint-disable jsx-a11y/no-static-element-interactions */}
                    <i
                      onClick={() => {
                        this.handleDeleteProduct(index);
                      }}
                      className="fas fa-times close-btn"
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell align="right" />
                <TableCell align="right" />
                <TableCell align="right" />
                <TableCell align="right" />
                <TableCell>Total amount</TableCell>
                <TableCell align="right">{this.getTotalMoney()}</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* DIALOG */}

        <Dialog fullWidth maxWidth="xl" open={this.isAddDialogOpening} aria-labelledby="max-width-dialog-title">
          <DialogContent>
            <div className="mb-3">
              <p className="mb-0 float-left font-weight-bold">Sản phẩm</p>

              <Button
                className="close float-right"
                onClick={() => {
                  this.isAddDialogOpening = false;
                }}
              >
                <span aria-hidden="true">&times;</span>
              </Button>
              <div className="clearfix" />
            </div>

            <div id="mySidebar" className="sidebar vh-75 float-left bg-light">
              <TreeView
                className=" p-2"
                items={tree}
                showCheckBoxesMode="none"
                name="departmentTree"
                // onItemSelectionChanged={this.selectionChanged('departmentTree')}
                // itemRender={this.renderTreeViewItem}
              />
            </div>
            <div id="mainView" className="vh-75 float-left">
              <Button className="openbtn py-4" onClick={this.openNav}>
                {this.isDrawerOpen ? <i className="fas fa-caret-left " /> : <i className="fas fa-caret-right " />}
              </Button>
              <SearchBar />
              <FormControlLabel
                control={<Checkbox checked={this.state.checkedA} onChange={this.handleChange('checkedA')} value="checkedA" />}
                label="Do not use complex search query logic"
              />
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell align="right">Sản phẩm/Dịch vụ</TableCell>
                      <TableCell align="right">Đơn giá</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                      <TableCell align="right">Đơn vị tính</TableCell>
                      <TableCell align="right">Tổng tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.productfake.map((item, index) => (
                      <TableRow
                        key={item.product}
                        onClick={() => {
                          this.handleSelectProduct(item);
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell align="right">{item.product}</TableCell>
                        <TableCell align="right">{item.unit}</TableCell>
                        <TableCell align="right">{item.qty}</TableCell>
                        <TableCell align="right">{item.countType}</TableCell>
                        <TableCell align="right">{item.unit * item.qty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination count={5} onChangePage={() => {}} page={0} rowsPerPage={15} />
              </Paper>
            </div>

            <div className="clearfix" />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

TdtProduct.propTypes = {};

export default withStyles(styles, { withTheme: true })(TdtProduct);
