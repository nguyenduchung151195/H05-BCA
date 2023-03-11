/**
 *
 * OutTable
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Checkbox, TextField, Paper, Table, TableBody, TableCell, TableRow, FormControl, Select, OutlinedInput, MenuItem } from '@material-ui/core';
// eslint-disable-next-line react/no-multi-comp
class OutTable extends React.Component {
  render() {
    const { data, fields } = this.props;

    return (
      <Paper
        style={{
          width: '100%',
          height: '500px',
          // border: 1px dotted black;
          overflow: 'scroll',
        }}
      >
        {data.length === 0 ? null : (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell />
                {this.props.cols.map(c => (
                  <TableCell key={c.key} style={{ marginLeft: '10px', padding: 0 }}>
                    <FormControl variant="outlined" style={{ width: '220px', padding: '3px 12px' }}>
                      <Select
                        value={c.value}
                        name={c.key}
                        onChange={this.props.handleChangeSelect}
                        key={c.key}
                        input={<OutlinedInput name="age" id="outlined-age-simple" />}
                      >
                        {fields.map(item => (
                          <MenuItem disabled={this.props.selects.includes(item.name)} key={item.name} value={item.name}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                ))}
              </TableRow>
              {this.props.data.map((r, i) => (
                <TableRow
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  style={{ height: '60px' }}
                  className="tbl_Value"
                >
                  <TableCell style={{ padding: '0 8px' }}>
                    <Checkbox style={{ padding: '5px', height: '50px' }} defaultChecked={i !== 0} />
                  </TableCell>
                  {this.props.cols.map(c => (
                    <TableCell key={c.key} style={{ marginLeft: '10px', padding: 0 }}>
                      <TextField style={{ width: '220px', padding: '3px 12px' }} margin="normal" variant="outlined" value={r[c.key]} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    );
  }
}
OutTable.propTypes = {};

export default OutTable;
