/**
 *
 * EmployeesDetailDialog
 *
 */

import React from 'react';
import {
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  OutlinedInput,
  FormControl,
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import SearchBar from 'material-ui-search-bar';
import { observer } from 'mobx-react';
// import { observable, toJS } from 'mobx';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import avatar from '../../assets/img/faces/avatar.jpg';
/* eslint-disable react/prefer-stateless-function */
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}
let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Nguyễn Thị Hà',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  customTab: {
    minWidth: 0,
    '& span': {
      padding: 2.5,
    },
  },
});
class EmployeesDetailDialog extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Dialog open={this.props.isOpeningEmloyeeDialog} aria-labelledby="form-dialog-title" fullWidth maxWidth="xl">
          <DialogTitle id="form-dialog-title">Chi tiết nhân viên</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item sm={6} className="px-3">
                <Tabs
                  variant="scrollable"
                  scrollButtons="auto"
                  value={this.state.value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  {/* <Tab className={classes.customTab} label="Tình trạng công việc" />
                  <Tab className={classes.customTab} label="Drive" />
                  <Tab className={classes.customTab} label="Tasks" />
                  <Tab className={classes.customTab} label="Calendar" />
                  <Tab className={classes.customTab} label="Conversations" />
                  <Tab className={classes.customTab} label="Photo" /> */}
                  <Tab className={classes.customTab} label="Tình trạng công việc" />
                  <Tab className={classes.customTab} label="Kho dữ liệu" />
                  <Tab className={classes.customTab} label="Công việc / Dự án" />
                  <Tab className={classes.customTab} label="Lịch" />
                  <Tab className={classes.customTab} label="Đàm thoại" />
                  <Tab className={classes.customTab} label="Ảnh" />
                </Tabs>
                <SwipeableViews
                  style={{ backgroundColor: '#e5e6eb' }}
                  index={this.state.value}
                  onChangeIndex={this.handleChangeIndex}
                  width={window.innerWidth - 260}
                >
                  {/* <TabContainer>Item Three</TabContainer>
                  <TabContainer>Item Three</TabContainer>
                  <TabContainer>Item Three</TabContainer>
                  <TabContainer>Item Three</TabContainer>
                  <TabContainer>Item Three</TabContainer> */}
                  <TabContainer>Mục thứ 3</TabContainer>
                  <TabContainer>Mục thứ 3</TabContainer>
                  <TabContainer>Mục thứ 3</TabContainer>
                  <TabContainer>Mục thứ 3</TabContainer>
                </SwipeableViews>
              </Grid>
              <Grid item sm={6} className="px-3">
                <Grid container>
                  <Grid item sm={4} className="border border-secondary p-1 rounded">
                    <img className="w-100 h-100" alt="avatar" src={avatar} />
                  </Grid>
                  <Grid item className="px-2" sm={8}>
                    <p>Thông tin liên hệ</p>
                    <p>Email: truong.lifetake@gmail.com</p>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12}>
                <Grid container className="mt-3" justify="center" alignItems="center">
                  <Grid item sm={2} className="px-3">
                    <FormControl variant="outlined" fullWidth>
                      <Select value={10} input={<OutlinedInput labelWidth={0} name="age" id="outlined-age-simple" />}>
                        <MenuItem value="">
                          <em>Không có</em>
                        </MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item sm={2} className="px-3">
                    <FormControl variant="outlined" fullWidth>
                      <Select value={10} input={<OutlinedInput labelWidth={0} name="age" id="outlined-age-simple" />}>
                        <MenuItem value="">
                          <em>Không có</em>
                        </MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item sm={2} className="px-3">
                    <FormControl variant="outlined" fullWidth>
                      <Select value={10} input={<OutlinedInput labelWidth={0} name="age" id="outlined-age-simple" />}>
                        <MenuItem value="">
                          <em>Không có </em>
                        </MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item sm={2} className="px-3">
                    <FormControl variant="outlined" fullWidth>
                      <Select value={10} input={<OutlinedInput labelWidth={0} name="age" id="outlined-age-simple" />}>
                        <MenuItem value="">
                          <em>Không có</em>
                        </MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item sm={2} className="px-3">
                    <Button variant="outlined" fullWidth color="primary">
                      Thực hiện
                    </Button>
                  </Grid>
                  <Grid item sm={2} className="px-3">
                    <FormControl variant="outlined" fullWidth>
                      <Select value={10} input={<OutlinedInput labelWidth={0} name="age" id="outlined-age-simple" />}>
                        <MenuItem value="">
                          <em>None</em>
                          <em>Không có</em>
                        </MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <div className="w-100 my-5">
                  <h6 className="text-center text-center">Thống kê doanh thu</h6>
                  <p className="w-100 text-center mb-4"> Nguồn: Lifetek.vn</p>
                  <Line options={{ responsive: true, maintainAspectRatio: false }} data={data} />
                </div>
              </Grid>
              <Grid item sm={12}>
                <div className="w-100 my-5">
                  <h6 className="text-center text-center">Số lượng dự án</h6>
                  <p className="w-100 text-center mb-4"> Nguồn: Lifetek.vn</p>
                  <Line options={{ responsive: true, maintainAspectRatio: false }} data={data} />
                </div>
              </Grid>
              <Grid item sm={12}>
                <Paper>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        {/* <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat (g)</TableCell>
                        <TableCell align="right">Carbs (g)</TableCell>
                        <TableCell align="right">Protein (g)</TableCell> */}
                        <TableCell>Thành phần (mỗi 100 g)</TableCell>
                        <TableCell align="right">Calo</TableCell>
                        <TableCell align="right">Chất béo(g)</TableCell>
                        <TableCell align="right">Tinh bột(g)</TableCell>
                        <TableCell align="right">Protein(g)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.calories}</TableCell>
                          <TableCell align="right">{row.fat}</TableCell>
                          <TableCell align="right">{row.carbs}</TableCell>
                          <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {/* <Button
              variant="outlined"
              className="border-success text-success"
              onClick={() => {
                this.props.callBack('CLOSEEMPLOYEE');
              }}
            >
              LƯU
            </Button> */}
            <Button
              variant="contained"
              className="border-success text-success"
              onClick={() => {
                this.props.callBack('CLOSEEMPLOYEE');
              }}
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

EmployeesDetailDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(EmployeesDetailDialog);
