/**
 *
 * EmployeeDetail
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { Paper, FormControl, Typography, Grid, Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
/* eslint-disable react/prefer-stateless-function */
class EmployeeDetail extends React.Component {
  render() {
    const { classes, data } = this.props;

    return (
      <div>
        <Grid container>
          <Grid style={{ height: 200 }} item md={4} container justify="center">
            <Avatar style={{ width: 250, height: 250, marginTop: '100px' }} src={`${data.avatar}?allowDefault=true`} className={classes.avatar} srcSet="" />
            <span className={classes.spanAva} />
          </Grid>
          <Grid item md={8} container center>
            <Grid container md={12} justify="center" style={{ paddingTop: '30px' }}>
              <Grid container md={12}>
                <Paper style={{ width: '80%', background: '#169BDD', margin: 'auto', marginBottom: '30px' }}>
                  <Typography className={classes.textTitle} style={{ color: 'white' }}>
                    Thông tin cán bộ
                  </Typography>
                </Paper>
              </Grid>
              <FormControl className={classes.textField1} error>
                <Typography style={{ fontWeight: 400 }}>
                  Mã nhân sự:{' '}
                  <span name="code" className={classes.textContent} style={{ color: '#2AA4E0' }}>
                    {data.code}
                  </span>
                </Typography>
              </FormControl>
              <FormControl className={classes.textField1} error>
                <Typography style={{ fontWeight: 400 }}>
                  Họ và tên:{' '}
                  <span name="name" style={{ fontSize: '23px' }}>
                    {data.name}
                  </span>
                </Typography>
              </FormControl>
              <hr width="500px" style={{ fontWeight: '500' }} />
              <Grid justify="flex-start" item md={6} style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Giới tính:
                    <span name="gender" className={classes.textContent}>
                      {data.gender === 'male' ? 'Nam' : 'Nữ'}
                    </span>
                  </Typography>
                </FormControl>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Email:
                    <span name="email" className={classes.textContent}>
                      {data.email}
                    </span>
                  </Typography>
                </FormControl>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Số điện thoại:
                    <span name="mobileNumber" className={classes.textContent}>
                      {data.mobileNumber}
                    </span>
                  </Typography>
                </FormControl>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Thời gian vào:
                    <span name="timeToJoin" className={classes.textContent}>
                      {data.timeToJoin}
                    </span>
                  </Typography>
                </FormControl>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Cấp bậc:
                    <span name="positions" className={classes.textContent}>
                      {data.positions}
                    </span>
                  </Typography>
                </FormControl>
              </Grid>
              <Grid container justify="flex-end" item md={6} style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Ngày sinh:
                    <span name="dob" className={classes.textContent}>
                      {data.dob}
                    </span>
                  </Typography>
                </FormControl>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Số CMND/CCCD:
                    <span name="IDcard" className={classes.textContent}>
                      {data.IDcard}
                    </span>
                  </Typography>
                </FormControl>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Địa chỉ:
                    <span name="address" className={classes.textContent}>
                      {data.address}
                    </span>
                  </Typography>
                </FormControl>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Đơn vị:
                    <span name="organizationUnit" className={classes.textContent}>
                      {data.organizationUnit ? data.organizationUnit.name : ''}
                    </span>
                  </Typography>
                </FormControl>
                <FormControl className={classes.textField1} error>
                  <Typography style={{ fontWeight: 400 }}>
                    Ghi chú :
                    <span name="note" className={classes.textContent}>
                      {data.note}
                    </span>
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

EmployeeDetail.propTypes = {};

export default withStyles(styles)(EmployeeDetail);
