/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 *
 * RoleByFunction
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { TableHead, Table, TableRow, TableCell, TableBody, Checkbox, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
// import { FormattedMessage } from 'react-intl';

import DetailRole from '../DetailRole';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
const FUNCTION_REORDER = [
  {
    code: 'Quanlytinbai',
    childCodes: [
      'Danhsachtinbai',
      'Soanbai',
      'Luunhap',
      'Choduyet',
      'Choxuatban',
      'Daxuatban',
      'Huyduyet',
      'Huyxuatban',
      'Thongketinbai',
      'Quanlybinhluan',
      'sapxepchuyenmuc'
    ],
  },
  {
    code: 'QuanlyVBPL',
    childCodes: ['DanhsachVBPL', 'ThemmoiVBPL', 'LuunhapVBPL', 'ChoduyetVBPL', 'ChoxuatbanVBPL', 'DaxuatbanVBPL', 'HuyduyetVBPL', 'HuyxuatbanVBPL'],
  },
  { code: 'quanlymedia', childCodes: [] },
  { code: 'Quanlyphanhoi', childCodes: ['Danhsachphanhoi', 'Linhvucphanhoi'] },
  { code: 'Quanlylienket', childCodes: ['Danhsachlienket', 'Themmoilk', 'Themmoinhomlk'] },
  { code: 'quanlyvideo', childCodes: ['themmoivideo','danhsachchuyenmucvideo' ] },
  { code: 'quanlyhinhanh', childCodes: ['danhsachchuyenmuc', 'themmoianh', 'themmoichuyenmucanh','thongtinchuyenmucanh' ] },
];
let ALL_MODULES = [];
FUNCTION_REORDER.forEach(c => {
  ALL_MODULES.push(c.code);
  ALL_MODULES = ALL_MODULES.concat(c.childCodes);
});
const enableReorder = true;
/* eslint-disable react/prefer-stateless-function */
class RoleByFunctionPortal extends React.Component {
  state = {
    allFunctionForAdd: [],
    dialogDetail: false,
    moduleCode: '',
    allowedDepartment: [],
    checked: '',
    openModule: null,
  };

  componentDidMount() {
    this.setState({
      allFunctionForAdd: this.props.allFunctionForAdd,
    });
  }
  componentWillReceiveProps(props) {
    // this.state.allFunctionForAdd = props.allFunctionForAdd;
    this.setState({
      allFunctionForAdd: props.allFunctionForAdd,
      allowedDepartment: props.allowedDepartment,
    });
  }

  detailRole = code => {
    this.setState({ dialogDetail: true, moduleCode: code });
  };

  handleCheckbox = e => {
    const { allFunctionForAdd } = this.state;

    const foundCodeModuleFunction = allFunctionForAdd;
    // const GET = foundCodeModuleFunction[0].methods && foundCodeModuleFunction[0].methods.find(item => item.name === 'GET') ;

    if (e.target.name === 'View') {
      for (const element of foundCodeModuleFunction) {
        if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
          const newMethod = element.methods.find(item => item.name === 'GET');
          newMethod.allow = false;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        } else {
          const newMethod = element.methods.find(item => item.name === 'GET');
          newMethod.allow = e.target.checked;
          this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
        }
      }
    }

    // if (e.target.name === 'Add') {
    //   for (const element of foundCodeModuleFunction) {
    //     if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
    //       const newMethod = element.methods.find(item => item.name === 'POST');
    //       newMethod.allow = false;
    //       this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //     } else {
    //       const newMethod = element.methods.find(item => item.name === 'POST');
    //       newMethod.allow = e.target.checked;
    //       this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //     }
    //   }
    // }
    // if (e.target.name === 'Edit') {
    //   for (const element of foundCodeModuleFunction) {
    //     if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
    //       const newMethod = element.methods.find(item => item.name === 'PUT');
    //       newMethod.allow = false;
    //       this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //     } else {
    //       const newMethod = element.methods.find(item => item.name === 'PUT');
    //       newMethod.allow = e.target.checked;
    //       this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //     }
    //   }
    // }
    // if (e.target.name === 'Delete') {
    //   for (const element of foundCodeModuleFunction) {
    //     if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
    //       const newMethod = element.methods.find(item => item.name === 'DELETE');
    //       newMethod.allow = false;
    //       this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //     } else {
    //       const newMethod = element.methods.find(item => item.name === 'DELETE');
    //       newMethod.allow = e.target.checked;
    //       this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //     }
    //   }
    // }

    //  if (e.target.name === 'Import') {
    //    for (const element of foundCodeModuleFunction) {
    //      if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
    //        const newMethod = element.methods.find(item => item.name === 'IMPORT');
    //        newMethod.allow = false;
    //        this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //      } else {
    //        const newMethod = element.methods.find(item => item.name === 'IMPORT');
    //        newMethod.allow = e.target.checked;
    //        this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //      }
    //    }
    //  }
    //  if (e.target.name === 'Export') {
    //    for (const element of foundCodeModuleFunction) {
    //      if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
    //        const newMethod = element.methods.find(item => item.name === 'EXPORT');
    //        newMethod.allow = false;
    //        this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //      } else {
    //        const newMethod = element.methods.find(item => item.name === 'EXPORT');
    //        newMethod.allow = e.target.checked;
    //        this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //      }
    //    }
    //  }
    //  if (e.target.name === 'ViewConfig') {
    //    for (const element of foundCodeModuleFunction) {
    //      if (!ALL_MODULES.find(c => c === element.codeModleFunction)) {
    //        const newMethod = element.methods.find(item => item.name === 'VIEWCONFIG') || { name: '' }.name;
    //        newMethod.allow = false;
    //        this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //      } else {
    //        const newMethod = element.methods.find(item => item.name === 'VIEWCONFIG') || { name: '' }.name;
    //        newMethod.allow = e.target.checked;
    //        this.setState({ foundCodeModuleFunction, methods: newMethod.allow });
    //      }
    //    }
    //  }
  };

  handleOnChange = (e, moduleCode) => {
    const [codeModleFunction, method] = e.target.name.split('/');
    const { allFunctionForAdd } = this.state;
    const currentFunction = allFunctionForAdd.find(item => item.codeModleFunction === codeModleFunction);
    const currentMethod = currentFunction.methods.find(item => item.name === method);
    currentMethod.allow = e.target.checked;
    const found = FUNCTION_REORDER.find(c => c.code === moduleCode);
    if (found && found.childCodes) {
      found.childCodes.forEach(c => {
        console.log(allFunctionForAdd, "allFunctionForAdd", c)
        const currChildModule = allFunctionForAdd.find(item => item.codeModleFunction === c);
        console.log(currChildModule, "currChildModule")
        if(currChildModule){
          const currChildMethod = currChildModule.methods.find(item => item.name === method);
          currChildMethod.allow = e.target.checked;
        }
        
      });
    }
    // this.state.allFunctionForAdd = allFunctionForAdd;
    this.setState({ allFunctionForAdd });
    this.props.handleChangeRole(allFunctionForAdd);
  };

  renderDetailRole = () => {
    let xhtml = null;
    const foundCodeModuleFunction = this.state.allFunctionForAdd.find(row => this.state.moduleCode === row.codeModleFunction);

    const { allowedDepartment } = this.props;
    let cloneAllowedDepartment = { ...allowedDepartment };

    let newDepartment = [];
    if (cloneAllowedDepartment && cloneAllowedDepartment.roles && foundCodeModuleFunction) {
      const GET = foundCodeModuleFunction.methods && foundCodeModuleFunction.methods.find(item => item.name === 'GET').allow;
      const PUT = foundCodeModuleFunction.methods && foundCodeModuleFunction.methods.find(item => item.name === 'PUT').allow;
      const DELETE = foundCodeModuleFunction.methods && foundCodeModuleFunction.methods.find(item => item.name === 'DELETE').allow;
      // newDepartment = cloneAllowedDepartment.roles.map(it => ({ ...it, data: it.data.map(i => ({ ...i, data: { view: GET ? i.data.view : false, edit: PUT ? i.data.edit : false, delete: DELETE ? i.data.delete : false } })) }))
      newDepartment = !this.props.applyEmployeeOrgToModuleOrg
        ? allowedDepartment.roles.map(it => ({
            ...it,
            name: 'Phòng ban',
            data: it.data.map(i => ({
              ...i,
              // data: { view: GET ? i.data.view : false, edit: PUT ? i.data.edit : false, delete: DELETE ? i.data.delete : false },
              data: { view: GET ? i.data.view : false },
            })),
          }))
        : allowedDepartment.roles.map(it => ({
            ...it,
            name: 'Phòng ban',
            // data: it.data.map(i => ({ ...i, data: { view: false, edit: false, delete: false } })),
            data: it.data.map(i => ({ ...i, data: { view: false } })),
          }));
    }
    cloneAllowedDepartment = { ...cloneAllowedDepartment, roles: newDepartment };

    if (this.props.id === 'add' && !this.props.employeeId) {
      const departments =
        Array.isArray(newDepartment) && newDepartment.length > 0 ? newDepartment[0].data.map(it => ({ ...it.data, id: it.id })) : [];
      return (xhtml = (
        <DepartmentSelect allowedDepartmentIds={departments || []} onSave={this.handleSave} onClose={() => this.setState({ dialogDetail: false })} />
      ));
    }
    if (
      foundCodeModuleFunction &&
      cloneAllowedDepartment &&
      Array(cloneAllowedDepartment.roles) &&
      cloneAllowedDepartment.roles.length > 0 &&
      !this.props.fromAddUser
    ) {
      xhtml = (
        <DetailRole
          moduleCode={this.state.moduleCode}
          closeDialog={() => this.setState({ dialogDetail: false })}
          employeeId={this.props.employeeId}
          isDialog={true}
          departments={cloneAllowedDepartment ? cloneAllowedDepartment.roles : []}
        />
      );
    } else {
      xhtml = (
        <DetailRole
          moduleCode={this.state.moduleCode}
          closeDialog={() => this.setState({ dialogDetail: false })}
          employeeId={this.props.employeeId}
          isDialog={true}
        />
      );
    }

    return xhtml;
  };

  handleSave = (data, row) => {
    const foundCodeModuleFunction = this.state.allFunctionForAdd.find(row => this.state.moduleCode === row.codeModleFunction);

    const { allowedDepartment } = this.state;
    let cloneAllowedDepartment = { ...allowedDepartment };

    let newDepartment = [];
    if (cloneAllowedDepartment && cloneAllowedDepartment.roles && foundCodeModuleFunction) {
      // newDepartment = cloneAllowedDepartment.roles.map(it => ({ ...it, data: it.data.map(i => ({ ...i, data: { view: GET ? i.data.view : false, edit: PUT ? i.data.edit : false, delete: DELETE ? i.data.delete : false } })) }))
      newDepartment = allowedDepartment.roles.map(it => ({ ...it, name: 'Phòng ban', data }));
      cloneAllowedDepartment = { ...cloneAllowedDepartment, roles: newDepartment };
    } else {
      const { moduleCode } = this.state;

      // module code
      if (moduleCode) {
        const roles = {
          module: moduleCode,
          roles: [
            {
              code: 'DERPARTMENT',
              column: [
                {
                  name: 'view',
                  title: 'Truy cập',
                },
                // {
                //   name: 'edit',
                //   title: 'Sửa',
                // },
                // {
                //   name: 'delete',
                //   title: 'Xóa',
                // },
              ],
              data,
              type: 0,
              name: 'Phòng ban',
              row,
            },
          ],
        };
        if (this.props.handleSaveDepartmentLocal) this.props.handleSaveDepartmentLocal(roles);
        cloneAllowedDepartment = { ...roles };
      }
    }
    this.setState({ allowedDepartment: cloneAllowedDepartment });
  };

  render() {
    const { allFunctionForAdd } = this.state;
    let newAllFunctionForAdd = allFunctionForAdd;
    if (FUNCTION_REORDER.length && allFunctionForAdd.length && enableReorder) {
      newAllFunctionForAdd = [];
      FUNCTION_REORDER.forEach(reo => {
        const found = allFunctionForAdd.find(a => a.codeModleFunction === reo.code);
        if (found) {
          newAllFunctionForAdd.push(found);
          if (reo.childCodes && reo.childCodes.length) {
            reo.childCodes.forEach(k => {
              const foundChild = allFunctionForAdd.find(a => a.codeModleFunction === k);
              if (foundChild) {
                newAllFunctionForAdd.push(foundChild);
              }
            });
          }
        }
      });
    }
    return (
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Phân quyền chức năng</TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                <Checkbox
                  onChange={this.handleCheckbox}
                  disabled={this.props.id === 'add' || this.props.disableCheckBox}
                  name="View"
                  checked={this.state.cheker}
                  style={{ display: 'block' }}
                />
                Truy cập
              </TableCell>

              <TableCell style={{ textAlign: 'center' }}> </TableCell>
              {/*               
              <TableCell style={{ textAlign: 'center' }}>
                <Checkbox
                  onChange={this.handleCheckbox}
                  disabled={this.props.id === 'add' || this.props.disableCheckBox}
                  name="Add"
                  checked={this.state.cheker}
                  style={{ display: 'block' }}
                />
                Thêm
              </TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                <Checkbox
                  onChange={this.handleCheckbox}
                  disabled={this.props.id === 'add' || this.props.disableCheckBox}
                  name="Edit"
                  checked={this.state.cheker}
                  style={{ display: 'block' }}
                />
                Sửa
              </TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                <Checkbox
                  onChange={this.handleCheckbox}
                  disabled={this.props.id === 'add' || this.props.disableCheckBox}
                  name="Delete"
                  checked={this.state.cheker}
                  style={{ display: 'block' }}
                />
                Xóa
              </TableCell> */}

              {/* <TableCell style={{ textAlign: 'center' }}>
                 <Checkbox
                   onChange={this.handleCheckbox}
                   disabled={this.props.id === 'add' || this.props.disableCheckBox}

                   name="Export"
                   checked={this.state.cheker}
                   style={{ display: 'block' }}
                 />
                 Xuất file
               </TableCell>
               <TableCell style={{ textAlign: 'center' }}>
                 <Checkbox
                   onChange={this.handleCheckbox}
                   disabled={this.props.id === 'add' || this.props.disableCheckBox}

                   name="Import"
                   checked={this.state.cheker}
                   style={{ display: 'block' }}
                 />
                 Import file
               </TableCell>
               <TableCell style={{ textAlign: 'center' }}>
                 <Checkbox
                   onChange={this.handleCheckbox}
                   disabled={this.props.id === 'add' || this.props.disableCheckBox}

                   name="ViewConfig"
                   checked={this.state.cheker}
                   style={{ display: 'block' }}
                 />
                 View Config
               </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {newAllFunctionForAdd.map(row => {
              const parent = FUNCTION_REORDER.find(c => c.code === row.codeModleFunction);
              let foundParent;
              let isChildOpen;
              if (!parent) {
                foundParent = FUNCTION_REORDER.find(c => c.code === this.state.openModule);
                if (foundParent) {
                  isChildOpen = foundParent.childCodes.find(c => c === row.codeModleFunction);
                }
              }
              if (parent) {
                return (
                  <TableRow key={row.codeModleFunction}>
                    <TableCell>
                      <div style={{ display: 'flex' }}>
                        <p
                          onClick={() =>
                            this.props.id === 'add' ? console.log('minh') : this.props.addStock ? null : this.detailRole(row.codeModleFunction)
                          }
                          style={
                            this.props.id === 'add'
                              ? { color: 'black', cursor: this.props.addStock ? null : 'pointer' }
                              : { color: '#2196F3', cursor: this.props.addStock ? null : 'pointer' }
                          }
                        >
                          {row.titleFunction}
                        </p>
                        &nbsp;&nbsp;&nbsp;
                        <p
                          style={{ paddingRight: '10px', cursor: 'pointer' }}
                          onClick={() => {
                            if (this.props.id !== 'add') {
                              if (this.state.openModule && this.state.openModule === row.codeModleFunction) {
                                this.setState({ openModule: '' });
                              } else {
                                this.setState({ openModule: row.codeModleFunction });
                              }
                            }
                          }}
                        >
                          {parent.childCodes.length ? <>{row.codeModleFunction === this.state.openModule ? <ExpandLess /> : <ExpandMore />}</> : null}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Checkbox
                        onChange={e => {
                          this.handleOnChange(e, row.codeModleFunction);
                        }}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'GET').name}`}
                        disabled={this.props.id === 'add' || this.props.disableCheckBox}
                        checked={row.methods.find(item => item.name === 'GET').allow}
                      />
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}> </TableCell>
                    {/* <TableCell style={{ textAlign: 'center' }}>
                      {parent.code !== 'PhoneBook' && (
                        <Checkbox
                          onChange={e => {
                            this.handleOnChange(e, row.codeModleFunction);
                          }}
                          disabled={this.props.id === 'add' || this.props.disableCheckBox}
      
                          name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'POST').name}`}
                          checked={row.methods.find(item => item.name === 'POST').allow}
                        />
                      )}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {parent.code !== 'PhoneBook' && (
                        <Checkbox
                          onChange={e => {
                            this.handleOnChange(e, row.codeModleFunction);
                          }}
                          disabled={this.props.id === 'add' || this.props.disableCheckBox}
      
                          name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'PUT').name}`}
                          checked={row.methods.find(item => item.name === 'PUT').allow}
                        />
                      )}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {parent.code !== 'PhoneBook' && (
                        <Checkbox
                          onChange={e => {
                            this.handleOnChange(e, row.codeModleFunction);
                          }}
                          disabled={this.props.id === 'add' || this.props.disableCheckBox}
      
                          name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'DELETE').name}`}
                          checked={row.methods.find(item => item.name === 'DELETE').allow}
                        />
                      )}
                    </TableCell> */}

                    {/* <TableCell style={{ textAlign: 'center' }}>
                       <Checkbox
                         onChange={e => {
                           this.handleOnChange(e, row.codeModleFunction);
                         }}
                         disabled={this.props.id === 'add' || this.props.disableCheckBox}
      
                         name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'EXPORT').name}`}
                         checked={row.methods.find(item => item.name === 'EXPORT').allow}
                       />
                     </TableCell>
                     <TableCell style={{ textAlign: 'center' }}>
                       {parent.code !== 'PhoneBook' && (
                         <Checkbox
                           onChange={e => {
                             this.handleOnChange(e, row.codeModleFunction);
                           }}
                           disabled={this.props.id === 'add' || this.props.disableCheckBox}
        
                           name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'IMPORT').name}`}
                           checked={row.methods.find(item => item.name === 'IMPORT').allow}
                         />
                       )}
                     </TableCell>
                     <TableCell style={{ textAlign: 'center' }}>
                       <Checkbox
                         onChange={e => {
                           this.handleOnChange(e, row.codeModleFunction);
                         }}
                         disabled={this.props.id === 'add' || this.props.disableCheckBox}
      
                         name={`${row.codeModleFunction}/${(row.methods.find(item => item.name === 'VIEWCONFIG') || { name: '' }).name}`}
                         checked={(row.methods.find(item => item.name === 'VIEWCONFIG') || { allow: false }).allow}
                       />
                     </TableCell> */}
                  </TableRow>
                );
              }
              if (isChildOpen)
                return (
                  <TableRow key={row.codeModleFunction}>
                    <TableCell>
                      <p
                        onClick={() => (this.props.addStock ? null : this.detailRole(row.codeModleFunction))}
                        style={{ color: '#2196F3', cursor: this.props.addStock ? null : 'pointer', paddingLeft: '20px' }}
                      >
                        {row.titleFunction}
                      </p>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Checkbox
                        disabled={this.props.id === 'add' || this.props.disableCheckBox}
                        onChange={this.handleOnChange}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'GET').name}`}
                        checked={row.methods.find(item => item.name === 'GET').allow}
                      />
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}> </TableCell>
                    {/* <TableCell style={{ textAlign: 'center' }}>
                      <Checkbox
                        disabled={this.props.id === 'add' || this.props.disableCheckBox}
    
                        onChange={this.handleOnChange}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'POST').name}`}
                        checked={row.methods.find(item => item.name === 'POST').allow}
                      />
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Checkbox
                        disabled={this.props.id === 'add' || this.props.disableCheckBox}
    
                        onChange={this.handleOnChange}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'PUT').name}`}
                        checked={row.methods.find(item => item.name === 'PUT').allow}
                      />
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Checkbox
                        disabled={this.props.id === 'add' || this.props.disableCheckBox}
    
                        onChange={this.handleOnChange}
                        name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'DELETE').name}`}
                        checked={row.methods.find(item => item.name === 'DELETE').allow}
                      />
                    </TableCell> */}

                    {/* <TableCell style={{ textAlign: 'center' }}>
                       <Checkbox
                         disabled={this.props.id === 'add' || this.props.disableCheckBox}
      
                         onChange={this.handleOnChange}
                         name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'EXPORT').name}`}
                         checked={row.methods.find(item => item.name === 'EXPORT').allow}
                       />
                     </TableCell>
                     <TableCell style={{ textAlign: 'center' }}>
                       <Checkbox
                         disabled={this.props.id === 'add' || this.props.disableCheckBox}
      
                         onChange={this.handleOnChange}
                         name={`${row.codeModleFunction}/${row.methods.find(item => item.name === 'IMPORT').name}`}
                         checked={row.methods.find(item => item.name === 'IMPORT').allow}
                       />
                     </TableCell>
                     <TableCell style={{ textAlign: 'center' }}>
                       <Checkbox
                         disabled={this.props.id === 'add' || this.props.disableCheckBox}
      
                         onChange={this.handleOnChange}
                         name={`${row.codeModleFunction}/${(row.methods.find(item => item.name === 'VIEWCONFIG') || { name: '' }).name}`}
                         checked={(row.methods.find(item => item.name === 'VIEWCONFIG') || { allow: false }).allow}
                       />
                     </TableCell> */}
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
        <Dialog fullWidth maxWidth="lg" onClose={() => this.setState({ dialogDetail: false })} open={this.state.dialogDetail}>
          <DialogContent>
            <DetailRole
              moduleCode={this.state.moduleCode}
              closeDialog={() => this.setState({ dialogDetail: false })}
              employeeId={this.props.employeeId}
              onClose={() => this.setState({ dialogDetail: false })}
              byOrg={this.props.byOrg}
              roleGroupScreen={this.props.roleGroupScreen}
              code={this.props.code}
            />
          </DialogContent>
          {/* <DialogActions>
              <Button variant="outlined" color="primary" onClick={() => this.setState({ dialogDetail: false })}>
                Lưu
              </Button>
            </DialogActions> */}
        </Dialog>
      </React.Fragment>
    );
  }
}

RoleByFunctionPortal.propTypes = {};

export default RoleByFunctionPortal;
