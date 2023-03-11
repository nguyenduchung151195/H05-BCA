import React from 'react';
import { Grid, TextField, Table, TableHead, TableCell, TableBody, TableRow, Checkbox } from '@material-ui/core';
// import { Save } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { Cancel, Add } from '@material-ui/icons';

// import styled from 'styled-components';

function ListEdit({ columns, rows, onChange, addRow, deleteRow, toolbar, extendRow, ...props }) {
  return (
    <Grid container>
      {toolbar}
      <Table>
        <TableHead>
          <TableRow>
            {Array.isArray(columns) && columns.filter(el => el.checked === true).map(item => (
              <TableCell>{item.title}</TableCell>
            ))}
            {deleteRow ? <TableCell>Hành động</TableCell> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow>
              {Array.isArray(columns) && columns.filter(el => el.checked === true).map(item => {
                let dt;
                switch (item.type) {
                  case 'order':
                    dt = <TableCell>{index + 1}</TableCell>;
                    break;
                  case 'text':
                    dt = <TableCell>{row[item.name]}</TableCell>;
                    break;
                  case 'boolean':
                    dt = (
                      <TableCell>
                        <Checkbox
                          color="primary"
                          checked={row[item.name]}
                          onChange={e => onChange({ name: item.name, value: e.target.checked, index })}
                        />
                      </TableCell>
                    );
                    break;
                  case 'number':
                    dt = (
                      <TableCell>
                        <TextField
                          style={{ padding: '5px' }}
                          onChange={e => onChange({ name: item.name, value: e.target.value * 1, index })}
                          key={item.name}
                          // label={item.title}
                          value={row[item.name]}
                          type="number"
                          disabled={item.disabled}
                        />
                      </TableCell>
                    );
                    break;
                  default:
                    dt = (
                      <TableCell>
                        <TextField
                          style={{ padding: '5px' }}
                          onChange={e => onChange({ name: item.name, value: e.target.value, index })}
                          key={item.name}
                          // label={item.title}
                          value={row[item.name]}
                          type={item.type ? item.type : 'text'}
                          disabled={item.disabled}
                        />
                      </TableCell>
                    );
                }
                return dt;
              })}
              {deleteRow ? (
                <TableCell style={{ cursor: 'pointer' }} onClick={() => deleteRow(index)}>
                  <Cancel />
                </TableCell>
              ) : null}
            </TableRow>
          ))}
          {extendRow}
        </TableBody>
        {props.disableAdd ? null : <Add style={{ cursor: 'pointer' }} onClick={addRow} />}
      </Table>
    </Grid>
  );
}

ListEdit.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  onChange: PropTypes.func,
};

export default ListEdit;
