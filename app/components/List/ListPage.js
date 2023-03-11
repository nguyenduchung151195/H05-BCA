import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
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
import { Item } from 'devextreme-react/accordion';
import { DragDropContext, Droppable, Draggable, DraggableProvided } from 'react-beautiful-dnd';
import NumberFormat from 'react-number-format';

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

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {props.disableCheckbox ? null : (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'Select all desserts' }}
            />
          </TableCell>
        )}

        {props.headRows.map(row => (
          <TableCell
            key={row.name}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.name ? order : false}
          >
            <TableSortLabel active={orderBy === row.name} direction={order} onClick={createSortHandler(row.name)}>
              {row.title}
            </TableSortLabel>
          </TableCell>
        ))}
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

const styles = theme => ({
  root: {
    // paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(1),
  },

  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

const EnhancedTableToolbar = withStyles(styles)(props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      style={{ display: 'inline-block' }}
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            {props.title}
          </Typography>
        )}
      </div>
      <div className={classes.spacer}>{props.toolbar}</div>
      <div className={classes.actions} style={{ position: 'absolute' }}>
        {numSelected > 0 ? (
          <Tooltip title="Xóa">
            <IconButton
              disableRipple
              aria-label="Delete"
              onClick={() => {
                props.reset && props.reset();
                this.setState({ selected: [] })   // phuongtv mới có icon chứ chưa có tính năng lọc
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : // (
          //   <Tooltip title="Filter list">
          //     <IconButton aria-label="Filter list">
          //       <FilterListIcon />
          //     </IconButton>
          //   </Tooltip>
          // )
          null}
      </div>
    </Toolbar>
  );
});

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = () => ({
  root: {
    width: '100%',
  },
  paper: {
    // boxShadow: 'none!important',
    width: '100%',
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});
// them ham cho drag table
/**
 * Moves an item from one list to another list.
 */
const getItemStyle = (isDragging, draggableStyle) => ({
  background: isDragging && 'lightblue',
  ...draggableStyle,
});
//
// eslint-disable-next-line prefer-arrow-callback
export default withStyles(useStyles)(function EnhancedTable(props) {
  const { classes } = props;

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n._id);
      setSelected(newSelecteds);
      if (props.onSelectChange) {
        props.onSelectChange(newSelecteds);
      }
      return;
    }
    setSelected([]);
    if (props.onSelectChange) {
      props.onSelectChange([]);
    }
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
    if (props.onSelectChange) {
      props.onSelectChange(newSelected);
    }
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  useEffect(
    () => {
      setRows(props.rows);
      setColumns(props.columns);
    },
    [props.rows, props.columns],
  );

  useEffect(
    () => {
      if (props.onRows) {
        props.onRows(rows);
      }
    },
    [rows],
  );

  const curParsePrice = str => {
    if (!str) return 0;
    return parseFloat(str.replace(/,/g, ''));
  };
  function mapRow(row, columns) {
    // const rows = Object.keys(row).map(item => <TableCell>{row[item]}</TableCell>);
    const rows = columns.map(item => {
      if (item.name === 'priceEUR') {
        const priceEUR = curParsePrice(row[item.name]);
        // if (row[item.name] !== 0) {
        if (priceEUR > 0) {
          return <TableCell>{`${!props.noMonyUnit ? '€' : ''}${row[item.name]}`}</TableCell>;
        }

        return <TableCell>{!props.noMonyUnit ? '€' : ''}0</TableCell>;
      }

      return <TableCell>{row[item.name]}</TableCell>;
    });
    return rows;
  }
  const GridRight = ({ children }) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px 20px 5px 0', alignItems: 'flex-end' }}>{children}</div>
  );
  const totalPrice = () => {
    let total = 0;
    let selectedRows = rows;
    if (props.onSelectedTotal) {
      selectedRows = rows.filter(item => selected.find(s => s === item.value));
    }
    selectedRows.map(item => {
      if (item.priceEUR) {
        total += curParsePrice(item.priceEUR);
      }
    });
    if (props.onSelectedTotal) {
      props.onSelectedTotal(total);
    }
    return total;
  };

  // function dragTable

  const onDragEnd = result => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (source.index === destination.index) {
    } else {
      const sourceItem = rows[source.index];
      const tagetItem = rows[destination.index];
      rows[source.index] = tagetItem;
      rows[destination.index] = sourceItem;
    }
  };

  // function dragTable
  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <EnhancedTableToolbar
          toolbar={props.toolbar}
          reset={() => {
            props.resetOnCart && props.resetOnCart(rows.filter(row => !selected.includes(row._id)));
            setRows(rows.filter(row => !selected.includes(row._id)));
            setSelected([]);
          }}
          title={props.title}
          numSelected={selected.length}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle" size="small">
            <EnhancedTableHead
              headRows={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              disableCheckbox={props.disableCheckbox}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      {props.disableCheckbox ? null : (
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                        </TableCell>
                      )}

                      {mapRow(row, columns)}
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
        {columns && columns.find(c => c.name === 'priceEUR') ? (
          <React.Fragment>
            <GridRight>
              <Typography variant="subtitle1" color="primary">
                Tổng số tiền: {totalPrice().toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })}
              </Typography>
            </GridRight>
          </React.Fragment>
        ) : null}
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
});
