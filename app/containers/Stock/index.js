import * as React from 'react';
import { Paper, withStyles, Link, Typography, Button, Grid as GridUI, Checkbox, Fab, TablePagination } from '@material-ui/core';
import { Settings, Edit, Delete } from '@material-ui/icons';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import { Helmet } from 'react-helmet';
import { SortingState, IntegratedSorting, IntegratedFiltering, SearchState } from '@devexpress/dx-react-grid';
import { Grid, DragDropProvider, Table, TableHeaderRow, TableColumnReordering, SearchPanel, Toolbar } from '@devexpress/dx-react-grid-material-ui';
import propTypes from 'prop-types';
import PositionedSnackbar from 'components/PositionedSnackbar';
import Modal from 'components/Modal';
// import { bold } from 'ansi-colors';
import { NavLink } from 'react-router-dom';
import styles from './styles';
let allId = [];
class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      columns: [
        { name: 'codePro', title: 'Mã sản phẩm' },
        { name: 'barCode', title: 'Mã vạch' },
        { name: 'cate', title: 'Tên	Danh mục' },
        { name: 'name', title: 'Tên Sản Phẩm' },
        { name: 'image', title: 'Ảnh Sản Phẩm' },
        { name: 'sizePro', title: 'Kích thước' },
        { name: 'salePrice', title: 'Giá bán' },
        { name: 'costPrice', title: 'Giá vốn' },
        { name: 'amount', title: 'Số lượng' },
        { name: 'amountTotal', title: 'Tổng số lượng' },
        { name: 'inventory', title: 'Hàng tồn kho' },
        { name: 'action', title: 'HÀNH ĐỘNG' },
        { name: 'status', title: 'TRẠNG THÁI' },
      ],
      tableColumnExtensions: [{ columnName: 'codePro', width: 100 }],
      rows: [
        {
          id: 1,
          codePro: 'PT112',
          barCode: '234',
          name: <NavLink to="/detail-product/1">Mũ GC</NavLink>,
          image: <img height="50px" src="https://centimet.vn/wp-content/uploads/Mu-Gucci-GG-canvas-baseball-cap-3-400x600.jpg" alt="" />,
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 2,
          codePro: 'T1189',
          barCode: '234',
          name: 'Quần Kaki Túi Hộp HST727',
          image: <img height="50px" src="https://centimet.vn/wp-content/uploads/Mu-Gucci-GG-canvas-baseball-cap-3-400x600.jpg" alt="" />,
          cate: 'Quần',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 3,
          codePro: 'HD112',
          barCode: '234',
          name: 'Quần đũi nam dáng quần âu ghi',
          image: <img height="50px" src="https://centimet.vn/wp-content/uploads/Mu-Gucci-GG-canvas-baseball-cap-3-400x600.jpg" alt="" />,
          cate: 'Quần',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 4,
          codePro: 'TQ112',
          barCode: '234',
          name: 'Áo Hoodie Nam Trơn Đủ Size Mẫu Áo Khoác Nam Đẹp',
          image: <img height="50px" src="https://centimet.vn/wp-content/uploads/Mu-Gucci-GG-canvas-baseball-cap-3-400x600.jpg" alt="" />,
          cate: 'Áo',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 5,
          codePro: 'AO112',
          barCode: '234',
          name: 'Áo Thun Nam Nữ Tay Lở Unisex ASALA U005',
          image: <img height="50px" src="https://centimet.vn/wp-content/uploads/Mu-Gucci-GG-canvas-baseball-cap-3-400x600.jpg" alt="" />,
          cate: 'Áo',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 6,
          codePro: 'POD112',
          barCode: '234',
          name: 'Mũ lưỡi trai đen trơn Tap hoa 38',
          image: <img height="50px" src="https://centimet.vn/wp-content/uploads/Mu-Gucci-GG-canvas-baseball-cap-3-400x600.jpg" alt="" />,
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
        {
          id: 7,
          codePro: 'LKD112',
          barCode: '234',
          name: 'Mũ Tai Bèo Bucket Trơn',
          image: <img height="50px" src="https://centimet.vn/wp-content/uploads/Mu-Gucci-GG-canvas-baseball-cap-3-400x600.jpg" alt="" />,
          cate: 'Mũ',
          sizePro: 'M',
          salePrice: '2000000',
          costPrice: '1600000',
          amount: 100,
          amountTotal: 200,
          inventory: 50,
          action: 'DEL',
          status: 1,
        },
      ],
      columnOrder: [
        'codePro',
        'barCode',
        'action',
        'status',
        'cate',
        'name',
        'image',
        'sizePro',
        'salePrice',
        'costPrice',
        'amount',
        'amountTotal',
        'inventory',
      ],
      selected: ['125'],
      selectAll: false,
      openSnackbar: false,
      message: { content: '', type: null },
      dialogStatus: false,
    };

    this.changeColumnOrder = this.changeColumnOrder.bind(this);
  }

  addCheckbox = id => <Checkbox checked={this.state.selected.includes(id)} color="primary" value={id} onClick={() => this.handleSelect(id)} />;

  addCheckboxAll = () => <Checkbox checked={this.state.selectAll} onClick={() => this.handleSelectAll()} />;

  changeColumnOrder(newOrder) {
    this.setState({ columnOrder: newOrder });
  }

  handleSelect(id) {
    const { selected } = this.state;
    const index = this.state.selected.findIndex(i => i === id);
    if (index === -1) selected.push(id);
    else selected.splice(index, 1);
    this.setState({ selected });
  }

  handleSelectAll() {
    const selectAll = !this.state.selectAll;
    if (this.state.selectAll) {
      this.setState({ selected: [], selectAll });
    } else {
      this.setState({ selected: allId, selectAll });
    }
  }

  handleChange(e) {
    const { columns } = this.state;
    const currentColumn = columns.find(column => column.name === e.target.name);
    currentColumn.title = e.target.value;
    this.setState({ columns });
  }

  onCloseSnackbar = () => {
    this.setState({ openSnackbar: false });
  };

  callSnackbar = () => {
    this.setState({ openSnackbar: true });
  };

  handleDeleteItem() {
    if (this.state.selected.length !== 0) {
      const { rows, selected } = this.state;
      const newRows = rows.filter(row => !selected.includes(row.id));
      this.setState({ rows: newRows, selected: [], message: { content: 'Deleted succesfully', type: 'success' } });
      this.callSnackbar();
    }
  }

  // Đóng/Mở dialog setting
  handleDisplay(display) {
    this.setState({ dialogStatus: display });
  }
  /* eslint-disable */
  handleUpdate(state) {
    //console.log(state);
  }
  /* eslint-enable */

  handleClickRow = id => {
    // console.log(id);
    // this.props.history.push(`/detail-product/${id}`);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { rows, columns, tableColumnExtensions, columnOrder, openSnackbar, message, dialogStatus } = this.state;
    const { classes } = this.props;
    allId = [];
    const newsRows = rows.map(row => {
      const statusList = [
        <p style={{ color: 'green', fontWeight: 'bold' }}>Cơ hội</p>,
        <p style={{ color: 'orange', fontWeight: 'bold' }}>Tồn kho</p>,
        <p style={{ color: 'red', fontWeight: 'bold' }}>Quá hạn</p>,
      ];
      const status = statusList[row.status];
      const action = <Edit />;
      const checkbox = this.addCheckbox(row.id);
      allId.push(row.id);
      return { ...row, action, checkbox, status };
    });
    const newColumns = [...columns, { name: 'checkbox', title: this.addCheckboxAll() }];
    const TableRow = ({ row, ...restProps }) => (
      <Table.Row
        {...restProps}
        // eslint-disable-next-line no-alert
        // onClick={() => this.handleClickRow(row.id)}
        style={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#81DAF5',
          },
        }}
      />
    );
    return (
      <div>
        <Paper className={classes.breadcrumbs}>
          <Helmet>
            <title>Kho</title>
            <meta name="description" content="Description of AddUserPage" />
          </Helmet>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Typography color="textPrimary">CRM</Typography>
          </Breadcrumbs>
        </Paper>
        <Paper className={classes.breadcrumbs}>
          <GridUI container>
            <GridUI item md={10}>
              <Button className={classes.menuButton} variant="contained" color="primary">
                Cơ hội
              </Button>
              <Button className={classes.menuButton} variant="contained" color="primary">
                Chưa làm
              </Button>
              <Button className={classes.menuButton} variant="contained" color="primary">
                Quá hạn
              </Button>
            </GridUI>
            <GridUI item md={2}>
              <Button style={{ marginRight: 10 }} variant="contained" color="primary">
                Thêm mới
              </Button>
              {this.state.selected.length !== 0 ? (
                <Fab size="small">
                  <Delete onClick={() => this.handleDeleteItem()} color="secondary" />
                </Fab>
              ) : null}
              &nbsp;
              <Fab onClick={() => this.handleDisplay(true)} size="small">
                <Settings />
              </Fab>
              <Modal
                update={state => this.handleUpdate(state)}
                open={dialogStatus}
                columns={columns}
                display={display => this.handleDisplay(display)}
              />
            </GridUI>
          </GridUI>

          <Grid rows={newsRows} columns={newColumns} style={{ width: '100%' }}>
            <DragDropProvider />
            <SortingState defaultSorting={[{ columnName: 'title', direction: 'asc' }]} />
            <SearchState defaultValue="" />
            <IntegratedFiltering />
            <IntegratedSorting />
            <Table columnExtensions={tableColumnExtensions} rowComponent={TableRow} />
            <TableColumnReordering order={columnOrder} onOrderChange={this.changeColumnOrder} />
            <TableHeaderRow showSortingControls />
            <Toolbar />
            <SearchPanel />
          </Grid>
        </Paper>
        {openSnackbar ? <PositionedSnackbar message={message} onClose={() => this.onCloseSnackbar()} /> : null}
      </div>
    );
  }
}

Stock.propTypes = {
  classes: propTypes.object,
  history: propTypes.object,
};
export default withStyles(styles)(Stock);
