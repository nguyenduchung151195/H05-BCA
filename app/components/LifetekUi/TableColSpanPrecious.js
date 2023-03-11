/* eslint-disable eqeqeq */
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import { criteriaColumns } from 'variable';
import { convertTableNested } from '../../helper';

export default function TableRowSpan(props) {
  const newCols = convertTableNested(props.rows.map(i => ({ ...i, cri: i.criterionType._id })), 'cri');
  return (
    <Table size="small" aria-label="a dense table">
      <TableBody>
        {newCols.map(col => (
          <TableCell rowSpan={col.total}>
            {col.ord === 0 ? (
              <TableRow colSpan={col.total} style={{ color: 'blue' }}>
                {col.criterionType.name}
              </TableRow>
            ) : (
              <TableRow />
            )}
            <TableRow>{col.name} </TableRow>
            <TableRow>{col.detailRanges ? col.detailRanges.map(it => it.plan) : ''} </TableRow>
          </TableCell>
        ))}
      </TableBody>
    </Table>
  );
}
