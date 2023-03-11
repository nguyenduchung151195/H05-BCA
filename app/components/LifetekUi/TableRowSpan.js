/* eslint-disable eqeqeq */
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Toolbar from '@material-ui/core/Toolbar';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import { Dialog as DialogUI } from 'components/LifetekUi';
import { criteriaColumns } from 'variable';
import { convertTableNested } from '../../helper';

export default function TableRowSpan(props) {
  const { numSelected } = props;
  const [selected, setSelected] = React.useState([]);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const rangess = props.rangesArr;
  const newRows = convertTableNested(props.rows.map(i => ({ ...i, cri: i.criterionType._id })), 'cri');
  function totalRatio(id) {
    let total = 0;
    id
      ? newRows.filter(elm => elm.criterionType._id === id).forEach(i => {
          total += i.ratio * 1;
        })
      : (total += 0 * 1);

    return total;
  }

  function editCriteria(id) {
    props.edit(id);
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const EnhancedTableToolbar = props => {
    const { numSelected } = props;
    return (
      <Toolbar>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : null}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteIcon onClick={e => handleDelete(e, selected)} />
            </IconButton>
          </Tooltip>
        ) : null}
      </Toolbar>
    );
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = newRows.map(n => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  function handleDelete() {
    setDeleteDialog(true);
  }

  function closeDialog() {
    setDeleteDialog(false);
  }

  function handleDeleteItem() {
    setDeleteDialog(false);
    props.delete(selected);
  }

  return (
    <div>
      <EnhancedTableToolbar numSelected={selected.length} />
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < newRows.length}
                checked={numSelected}
                onChange={handleSelectAllClick}
                inputProps={{ 'aria-label': 'select all desserts' }}
              />
            </TableCell>
            <TableCell colSpan={2}>Tỷ trọng</TableCell>
            {criteriaColumns.map(item => (
              <TableCell key={item.name}>{item.title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {newRows.map((row, index) => {
            const isItemSelected = isSelected(row._id);
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <TableRow key={row._id} hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected}>
                <TableCell padding="checkbox">
                  <Checkbox onClick={event => handleClick(event, row._id)} checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                </TableCell>
                {row.ord === 0 ? <TableCell rowSpan={row.total}>{row.criterionType._id ? totalRatio(row.criterionType._id) : 0}%</TableCell> : null}
                <TableCell>{row.ratio}%</TableCell>
                {row.ord === 0 ? <TableCell rowSpan={row.total}>{row.criterionType ? row.criterionType.name : ''}</TableCell> : null}
                <TableCell style={{ color: '#276de6', cursor: 'pointer' }} onClick={() => editCriteria(row._id)}>
                  {row.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.formula}
                </TableCell>
                <TableCell>{row.expected}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>
                  {row.frequency == 0 ? 'Ngày' : row.frequency == 1 ? 'Tuần' : row.frequency == 2 ? 'Tháng' : row.frequency == 3 ? 'Quý' : 'Năm'}
                </TableCell>
                <TableCell>{rangess.find(elm => elm._id === row.ranges) ? rangess.find(elm => elm._id === row.ranges).name : ''}</TableCell>
                <TableCell>{row.order}</TableCell>
                <TableCell>{row.use}</TableCell>
                <TableCell>{row.note}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <DialogUI
        maxWidth="sm"
        title="Đồng chí có chắc chắn muốn xóa không?"
        onSave={handleDeleteItem}
        onClose={closeDialog}
        open={deleteDialog}
        saveText="Đồng ý"
      />
    </div>
  );
}
