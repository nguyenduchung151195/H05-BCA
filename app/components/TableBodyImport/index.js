/**
 *
 * TableBodyImport
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { TableBody, TableRow, TableCell, TextField, Checkbox } from '@material-ui/core';

/* eslint-disable react/prefer-stateless-function */
class TableBodyImport extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.data !== this.props.data) return true;
    return false;
  }

  render() {
    return (
      <TableBody>
        {this.props.data.map((r, i) => (
          <TableRow
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            style={{ height: '60px' }}
            className="tbl_Value"
          >
            <TableCell style={{ padding: '0 8px' }}>
              {!this.props.disableCheckbox && <Checkbox style={{ padding: '5px', height: '50px' }} defaultChecked={i !== 0} />}
            </TableCell>
            {this.props.cols.map(c => (
              <TableCell key={c.key} style={{ marginLeft: '10px', padding: 0 }}>
                <TextField style={{ width: '220px', padding: '3px 12px' }} margin="normal" variant="outlined" defaultValue={r[c.key]} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }
}

TableBodyImport.propTypes = {};

export default TableBodyImport;
