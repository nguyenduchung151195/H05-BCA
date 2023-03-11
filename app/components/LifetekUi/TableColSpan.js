/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable eqeqeq */
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { TextField, Dialog } from '.';
import { API_CRITERIA } from '../../config/urlConfig';
import { convertTableNested } from '../../helper';
// import { serialize } from '../../utils/common';

export default function TableRowSpan(props) {
  const [data, setData] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  // const [plan, setPlan] = React.useState([{ id: '', plan: '' }]);
  const [value1, setvalue1] = React.useState('');
  const [id, setId] = React.useState('');

  const newCols = convertTableNested(props.rows.map(i => ({ ...i, cri: i.criterionType._id })), 'cri');

  function handleOpenDialog(id) {
    setOpenDialog(true);
    setId(id);
  }

  function closeDialog() {
    setOpenDialog(false);
  }

  function handleSave() {
    // const data = {};
    fetch(`${API_CRITERIA}?${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(data => {
        setData(data);
      });

    setOpenDialog(false);
  }

  return (
    <Table size="small" aria-label="a dense table">
      <TableBody>
        {newCols.length ? (
          newCols.map(col => (
            <TableCell rowSpan={col.total}>
              {col.ord === 0 ? (
                <TableRow colSpan={col.total} style={{ color: 'blue' }}>
                  {col.criterionType.name}
                </TableRow>
              ) : (
                <TableRow />
              )}
              <TableRow>{col.name} </TableRow>
              <TableRow>
                <p onClick={() => handleOpenDialog(col._id)} style={{ fontWeight: 600 }}>
                  {col.detailRanges.plan ? col.detailRanges.plan : null}
                </p>
              </TableRow>
            </TableCell>
          ))
        ) : (
          <p style={{ color: '#344ceb', justifyContent: 'center', display: 'flex' }}>Không có tiêu chí nào</p>
        )}
      </TableBody>
      <Dialog onSave={handleSave} open={openDialog} onClose={closeDialog}>
        <TextField fullWidth label="Kế hoạch" value={value1} onChange={e => setvalue1(e.target.value)} />
      </Dialog>
    </Table>
  );
}
