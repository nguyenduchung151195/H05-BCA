import React, { useState, useCallback } from 'react';
import { Button, Grid, Table, TableCell, TableHead, TableRow, Typography,TableBody } from '@material-ui/core';
import moment from 'moment';
import { Dialog as DialogUI } from 'components/LifetekUi';
import CustomDatePicker from '../CustomDatePicker';

function AddHandleDialog(props) {
    // const { setDialogHanle, sendHanle, dialogHanle, dateHanle, setDateHanle } = props;
    const  {dashboardPage} = props;
    const [localState, setLocalState] = useState({});
    const [columns, setColumns] = useState([
        {
          name: 'mainTreatment',
          title: 'Xử lý chính',
          _id: '5fb3ad613918a44b3053f080',
        },
        {
            name: 'combinationTreatment',
            title: 'Phối hợp xử lý',
            _id: '5fb3ad613918a44b3053f080',
        },
        {
            name: 'getToKnow',
            title: 'Nhận để biết',
            _id: '5fb3ad613918a44b3053f080',
        },
      ]);
      const [departments, setDepartments] = useState([]);



    return (
        <div>
            <Typography variant="h6" component="h2" gutterBottom display="block" style={{textTransform: 'uppercase' }}>
                Thêm gia hạn
            </Typography>
            <Grid container spacing={8} justifyContent="space-between">
                <Grid item xs="12">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên đơn vị các nhân</TableCell>
                                {columns.map(i => (
                                    <TableCell>{i.title}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        {/* <TableBody>
                            {departments.map(
                                (i, rowIndex) =>
                                    i.open ? (
                                        <>
                                            <TableRow>
                                                <TableCell style={styles.codeCol}>
                                                    <p
                                                        style={{ paddingLeft: i.level ? i.level * 10 : 0, fontWeight: i.child ? 'bold' : false }}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            expandRow(i.slug, i.name, i.expand);
                                                        }}
                                                    >
                                                        {i.title}
                                                        {i.child || (data[rowIndex] && data[rowIndex].users && data[rowIndex].users.length) ? (
                                                            i.expand ? (
                                                                <ExpandLess />
                                                            ) : (
                                                                <ExpandMore />
                                                            )
                                                        ) : null}
                                                    </p>
                                                </TableCell>
                                                {columns.map(it => (
                                                    <TableCell>
                                                        {props.position && it.name === 'position' ? (
                                                            ''
                                                        ) : (
                                                            <CheckDerpartment
                                                                isView={props.isView ? props.isView : null}
                                                                handleCheckDerpartment={handleCheckDerpartment}
                                                                checked={data[rowIndex] && data[rowIndex].data && data[rowIndex].data[it.name] ? true : false}
                                                                column={it.name}
                                                                row={i.name}
                                                            />
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </>
                                    ) : null,
                            )}
                        </TableBody> */}
                    </Table>
                </Grid>

            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button  color="primary" variant="contained">
                    Lưu
                </Button>
            </div>
        </div>
    );
};

export default AddHandleDialog;