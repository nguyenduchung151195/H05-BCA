
/**
 *
 * TableHeaderImport
 *
 */

 import React,{ useEffect } from 'react';
 import { TableRow, TableCell, FormControl, Select, MenuItem, OutlinedInput } from '@material-ui/core';
 import { Done } from '@material-ui/icons';
 // import PropTypes from 'prop-types';
 // import styled from 'styled-components';
 
 /* eslint-disable react/prefer-stateless-function */
//  class TableHeaderImport extends React.Component {
//    render() {
//      const { fields, cols } = this.props;
//      return (
//        <TableRow>
//          <TableCell />
//          {cols.map((c, index) => (
//            <TableCell key={c.key} style={{ marginLeft: '10px', padding: 0 }}>
//              <FormControl variant="outlined" style={{ width: '220px', padding: '3px 12px' }}>
//                <Select
//                  value={c.value}
//                  name={c.key}
//                  onChange={this.props.handleChangeSelect}
//                  key={c.key}
//                  input={<OutlinedInput name="age" id="outlined-age-simple" />}
//                >
//                  {fields
//                    .filter(item => {
//                      if (item.name === 'kanbanStatus') {
//                        return true;
//                      }
//                      if (item.type.includes('ObjectId')) {
//                        return false;
//                      }
//                      if (item.name === 'crmStatus') {
//                        return false;
//                      }
//                      return true;
//                    })
//                    .map(item => (
//                      <MenuItem
//                        style={{ display: 'flex', justifyContent: 'space-between' }}
//                        disabled={this.props.selects.includes(item.name) && this.props.selects[index] !== item.name}
//                        key={item.name}
//                        value={item.name}
//                      >
//                        {item.title}
//                        {this.props.selects[index] === item.name ? <Done /> : null}
//                      </MenuItem>
//                    ))}
//                </Select>
//              </FormControl>
//            </TableCell>
//          ))}
//        </TableRow>
//      );
//    }
//  }
 
//  TableHeaderImport.propTypes = {};
 
//  export default TableHeaderImport;

 const TableHeaderImport = props => {
   const { fields, cols, handleChangeSelect, selects } = props;
 
   return (
     <TableRow>
       <TableCell />
       {cols.map((c, index) => {
         useEffect(() => {
           try {
             const value = fields[index].name
             handleChangeSelect({ target: { value, name: c.key } })
           } catch { }
         }, [])
 
         return <TableCell key={c.key} style={{ marginLeft: '10px', padding: 0 }}>
           <FormControl variant="outlined" style={{ width: '220px', padding: '3px 12px' }}>
             <Select
               value={c.value}
               name={c.key}
               onChange={handleChangeSelect}
               key={c.key}
               input={<OutlinedInput name="age" id="outlined-age-simple" />}
             >
               {fields.filter(item => {
                     if (item.name === 'kanbanStatus') {
                       return true;
                     }
                     if (item.type.includes('ObjectId')) {
                       return true;
                     }
                     if (item.name === 'crmStatus') {
                       return false;
                     }
                     return true;
                   }).map((item) => <MenuItem
                 style={{ display: 'flex', justifyContent: 'space-between' }}
                 disabled={selects.includes(item.name) && selects[index] !== item.name}
                 key={item.name}
                 value={item.name}
               >
                 {item.title}
                 {selects[index] === item.name ? <Done /> : null}
               </MenuItem>
               )}
             </Select>
           </FormControl>
         </TableCell>
       }
       )}
     </TableRow>
   );
 }
 
 TableHeaderImport.propTypes = {};
 
 export default TableHeaderImport;
 