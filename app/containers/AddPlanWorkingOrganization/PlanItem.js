import React from 'react';
import { Grid, Typography, Table, TableBody, TableCell, TableRow, TableHead, Tooltip, withStyles, Checkbox, TextField } from '@material-ui/core';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { Add, Delete } from '@material-ui/icons';
import styles from './styles';
function PlanItem(props) {
  const { classes, disabled } = props;
  const theads = ['STT', 'Tên công việc', 'Nội dung', 'Kết quả tuần này'];
  const { handleChangeValueChild, titleTable = '', handleAddWorking, nameTable, formData, handleDelete } = props;
  let selected = (formData && formData[nameTable] && formData[nameTable].filter(f => f.checked)) || [];
  let canDetele = selected && selected.length > 0;
  function renderTitlePlan(index, title, type) {
    let item;
    switch (type) {
      case 3:
        item = (
          <TableCell rowSpan={3} colSpan={1} width={'100px'} className={classes.cellTh}>
            {index + 1}. {title}
          </TableCell>
        );
      case 2:
        item = (
          <TableCell rowSpan={2} colSpan={1} width={'100px'} className={classes.cellTh}>
            {index + 1}. {title}
          </TableCell>
        );
      case 2:
        item = (
          <TableCell rowSpan={1} colSpan={1} width={'100px'} className={classes.cellTh}>
            {index + 1}. {title}
          </TableCell>
        );
      case 0:
        item = <TableCell colSpan={1} width={'100px'} className={classes.cellTh} />;
    }
    return item;
  }
  return (
    <>
      <Grid container spacing={8} alignItems="center" justifyContent="space-between" style={{ marginTop: 10 }}>
        <Grid xs={11}>
          <Typography variant="h6" align="start" style={{ fontSize: 14, fontWeight: 'bold' }}>
            {titleTable}
          </Typography>
        </Grid>
        {/* <Grid item xs style={{ textAlign: 'right' }}>
          <span className="CustomIconList">
            {!disabled && (
              <Tooltip title="Thêm mới công việc" onClick={() => handleAddWorking(nameTable)}>
                <Add style={{ color: '#2196F3', cursor: 'pointer', marginLeft: 20 }} />
              </Tooltip>
            )}
          </span>
          {canDetele && (
            <span className="CustomIconList">
              <Tooltip title="Xóa công việc" onClick={() => handleDelete(formData[nameTable], nameTable)}>
                <Delete style={{ color: '#2196F3', cursor: 'pointer' }} />
              </Tooltip>
            </span>
          )}
        </Grid> */}
      </Grid>

      <Table style={{ marginTop: 15 }}>
        <TableHead>
          <TableRow className={classes.cell}>
            {theads &&
              theads.map((th, index) => (
                <TableCell colSpan={index === 0 ? 2 : 4} width={'100px'} className={classes.cellTh}>
                  {th}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {formData &&
            formData[nameTable] &&
            formData[nameTable].map((plan, index) => {
              return (
                <TableRow>
                  {/* <TableCell rowSpan={2} colSpan={2} width={'100px'} className={classes.cellTh}> */}
                  {/* <Checkbox
                      disabled={disabled}
                      name="checked"
                      checked={plan.checked ? true : false}
                      onChange={e => handleChangeValueChild(e, index, nameTable)}
                    /> */}
                  {/* </TableCell> */}
                  {/* {renderTitlePlan(index, plan.title, plan.type)} */}
                  {plan.type && (
                    <TableCell rowSpan={plan.type && plan.type} colSpan={2} width={'100px'} className={classes.cellTh}>
                      {plan.title && plan.title}
                    </TableCell>
                  )}
                  <TableCell colSpan={2} width={'150px'} className={classes.cell}>
                    <TextField
                      variant="outlined"
                      rows={4}
                      multiline
                      label={' '}
                      value={plan.name}
                      name="name"
                      disabled
                      fullWidth
                      onChange={e => handleChangeValueChild(e, index, nameTable)}
                    />
                  </TableCell>
                  <TableCell colSpan={4} className={classes.cell}>
                    <TextField
                      variant="outlined"
                      rows={4}
                      multiline
                      label={' '}
                      value={plan.content}
                      name="content"
                      fullWidth
                      disabled={disabled}
                      onChange={e => handleChangeValueChild(e, index, nameTable)}
                    />
                  </TableCell>
                  <TableCell colSpan={4} className={classes.cell}>
                    <TextField
                      variant="outlined"
                      rows={4}
                      multiline
                      label={' '}
                      value={plan.result}
                      name="result"
                      fullWidth
                      disabled={disabled || nameTable === 'planDetail'}
                      onChange={e => handleChangeValueChild(e, index, nameTable)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
}

export default withStyles(styles)(PlanItem);
