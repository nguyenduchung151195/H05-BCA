import React, { useState, useEffect } from 'react';
import { withStyles, Table, TableBody, TableCell, Typography, TextField, TableHead, TableRow, Button, Grid } from '@material-ui/core';
import styles from './styles';
import SaveIcon from '@material-ui/icons/Save';
const TableComponent = props => {
  const [salaries, setSalaries] = useState(props.salary);
  const { dataSalary } = props.salary;
  const { classes } = props;
  const [cell, setCell] = useState({ row: 0, column: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const data = [];

  useEffect(() => {
    setSalaries(props.salary);
  }, [props.salary]);
  const displayColumns = dataSalary => {
    if (dataSalary && dataSalary.length > 0) {
      const [{ data }] = dataSalary;
      if (data && data.length > 0) {
        return data.map((column, key) => (
          <TableCell className={classes.MuitableCell} key={key}>
            {column.allowanceTypeName}
          </TableCell>
        ));
      }
    }
  };
  function handleChange(e, index, key) {
    if (dataSalary && dataSalary.length > 0) {
      let data = dataSalary[key].data;
      let contractSource = dataSalary[key].contractSource;
      data[index].value = e.target.value;
      dataSalary[key] = {
        contractSource,
        data,
      };
      setShowSave(true);
      setSalaries({...salaries, dataSalary});
    }
  }
  function handleClick(e, index, key) {
    setIsEditing(!isEditing);
    let cell = {
      row: key,
      column: index,
    };
    setCell(cell);
    setIsFocus(true);
  }

  function changeCell(row, column) {
    let cell = {
      row,
      column,
    };
    setCell(cell);
  }
  function handleSaveData() {
    props.onSave(salaries);
  }

  const displayRows = dataSalary => {
    if (dataSalary && dataSalary.length > 0) {
      return dataSalary.map((row, key) => (
        <TableRow key={key}>
          <TableCell className={classes.MuitableCell}> {row.contractSource.title} </TableCell>
          {row.data &&
            row.data.length > 0 &&
            row.data.map((column, index) => (
              <TableCell
                className={classes.MuitableCell}
                onClick={isFocus ? e => changeCell(key, index) : e => handleClick(e, index, key)}
                key={index}
              >
                {isEditing ? (
                  cell && cell.row === key && cell.column === index ? (
                    <React.Fragment>
                      <TextField
                        type="number"
                        name={column._id}
                        onChange={e => handleChange(e, index, key)}
                        defaultValue={column.value === 0 ? '' : column.value}
                        autoFocus
                      />
                    </React.Fragment>
                  ) : (
                    <Typography>{column.value}</Typography>
                  )
                ) : (
                  <Typography>{column.value}</Typography>
                )}
              </TableCell>
            ))}
        </TableRow>
      ));
    }
  };
  useEffect(
    () => {
      setSalaries(props.salary);
    },
    [props.salary, isEditing, cell, isFocus, showSave],
  );
  return (
    <React.Fragment>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.MuitableCell}>Các loại hợp đồng</TableCell>
            {displayColumns(dataSalary)}
          </TableRow>
        </TableHead>
        <TableBody>{displayRows(dataSalary)}</TableBody>
      </Table>
      <Grid container justify="flex-end">
        <Button variant="outlined" color="primary" size="large" className={'mt-2'} onClick={() => handleSaveData()}>
          <SaveIcon /> Save
        </Button>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(TableComponent);
