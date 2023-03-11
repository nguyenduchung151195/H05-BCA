import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import moment from 'moment';
import { useEffect, memo, useState } from 'react';
import './styles.scss';
let counter = 0;
function createData(name, calories, fat, carbs, protein) {
  counter += 1;
  return { id: counter, name, calories, fat, carbs, protein };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'name', numeric: true, disablePadding: false, label: 'Tên', width: 250 },
  { id: 'username', numeric: true, disablePadding: false, label: 'Chủ sở hữu', width: 180 },
  { id: 'size', numeric: true, disablePadding: false, label: 'Kích thước', width: 180 },
  { id: 'createdAt', numeric: true, disablePadding: false, label: 'Ngày tạo', width: 180 },
  { id: 'dateModified', numeric: true, disablePadding: false, label: 'Chỉnh sửa cuối', width: 200 },
  { id: 'username', numeric: true, disablePadding: false, label: 'Người duyệt', width: 180 },
  { id: 'dateModified', numeric: true, disablePadding: false, label: 'Ngày duyệt', width: 180 },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, check } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };
  const [checked, setChecked] = useState(false);
  useEffect(
    () => {
      console.log(check, 'check');
      setChecked(Boolean(check));
      if (!Boolean(check)) {
        onSelectAllClick(Boolean(check));
      }
    },
    [check],
  );
  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            // checked={numSelected === rowCount}
            checked={checked}
            onChange={e => {
              setChecked(!checked);
              onSelectAllClick(!checked);
            }}
          />
        </TableCell> */}
        {rows.map(
          row => (
            <TableCell
              key={row.id}
              numeric={row.numeric}
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === row.id ? order : false}
              style={{ width: row.width, textAlign: 'center' }}
            >
              <Tooltip title="Sort" placement={row.numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
                <TableSortLabel active={orderBy === row.id} direction={order} onClick={createSortHandler(row.id)}>
                  {row.label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          ),
          this,
        )}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = props => {
  const { numSelected } = props;

  return (
    <Toolbar>
      <div>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} Đã chọn
          </Typography>
        ) : (
          // <Typography variant="h6" id="tableTitle">
          //   Nutrition
          // </Typography>
          ''
        )}
      </div>
      <div />
      <div>
        {numSelected > 0 ? (
          <Tooltip title="Xóa">
            <IconButton aria-label="Delete">
              <DeleteIcon
                color="secondary"
                onClick={() => {
                  props.handleDeleteItem && props.handleDeleteItem();
                }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          // <Tooltip title="Filter list">
          //   <IconButton aria-label="Filter list">
          //     <FilterListIcon />
          //   </IconButton>
          // </Tooltip>
          ''
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function EnhancedTable(props) {
  const { rows = [], renderBackground, setDetailItem, onContextMenu,onDoubleClick, ...rest } = props;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [data, setData] = React.useState(rows);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  useEffect(
    () => {
      setData(rows);
    },
    [rows],
  );

  useEffect(()=>{
    
  },[])
  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(checked) {
    if (checked) {
      const newSelecteds = data.map(n => n._id);
      const listSelect = newSelecteds.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
      setSelected(listSelect);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, n) {
    const selectedIndex = selected.indexOf(n._id);
    console.log('setDetailItem called', n )
    setDetailItem(n)
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, n._id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  const isSelected = id => {
    return selected.indexOf(id) !== -1;
  };
  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const { checkSelect } = props;
  // useEffect(()=>{
  //   console.log(checkSelect, "checkSelect")
  //   if(!checkSelect){
  //     setSelected([])
  //   }
  // }, [checkSelect])
  return (
    <Paper>
      <EnhancedTableToolbar
        numSelected={selected.length}
        handleDeleteItem={() => {
          props.handleDeleteItem && props.handleDeleteItem(selected);
        }}
      />
      <div>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            check={checkSelect}
          />
          <TableBody>
            {stableSort(data, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(n => {
                const isItemSelected = isSelected(n._id);
                return (
                  <TableRow
                    hover
                    onClick={event => {
                      handleClick(event, n);
                    }}
                    onContextMenu = {e=>{
                      onContextMenu(e,n)
                    }}
                    onDoubleClick= {(e)=>onDoubleClick(e,n)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isItemSelected}
                     style={{textAlign:'center'}}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} />
                    </TableCell> */}
                    <TableCell>
                      <p className="nameFolder" style={{ width: 250 }}>
                        {' '}
                        <>{renderBackground(n, 30, 'imgFileList')} &nbsp; &nbsp;</>
                        {n.name}
                       
                        {
                          n.searchInfo ? 
                          <p>
                            <Tooltip title={n.searchInfo}>
                            <span style={{backgroundColor: "yellow"}}>{n.searchInfo}</span> 

                          </Tooltip>

                          </p> : ""
                        }
                      </p>
                    </TableCell>
                    <TableCell align='center'>{n.username}</TableCell>
                    <TableCell numeric>{n.isFile ? formatBytes(n.size) : ''}</TableCell>
                    <TableCell numeric>{(n.createdAt && moment(n.createdAt).format('DD/MM/YYYY')) || ''}</TableCell>
                    <TableCell align='center'>{(n.dateModified && moment(n.dateModified).format('DD/MM/YYYY')) || ''}</TableCell>
                    <TableCell numeric>{n.username}</TableCell>
                    <TableCell align='center'>{(n.dateModified && moment(n.dateModified).format('DD/MM/YYYY')) || ''}</TableCell>
                  </TableRow>
                );
              })}

            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        labelRowsPerPage={'Số dòng hiển thị:'}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default EnhancedTable;
