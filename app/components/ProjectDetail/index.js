/**
 *
 * ProjectDetail
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Toolbar, AppBar, Typography, IconButton, Table, TableCell, TableRow, TableBody } from '@material-ui/core';
import { Close, Edit } from '@material-ui/icons';
import { Paper, Grid } from '../LifetekUi';

// import { FormattedMessage } from 'react-intl';


/* eslint-disable react/prefer-stateless-function */
class ProjectDetail extends React.Component {
  render() {
    const { projects, intl } = this.props;
    return (
      <div>
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" onClick={this.props.onClose} aria-label="Close">
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit">
              {intl.formatMessage(messages.chitietduan || { id: 'chitietduan', defaultMessage: 'chitietduan' })}
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Paper>
            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
              <Edit />
              <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
                {intl.formatMessage(messages.thongtinchitiet || { id: 'thongtinchitiet', defaultMessage: 'thongtinchitiet' })}
              </Typography>
            </Grid>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.ten || { id: 'ten', defaultMessage: 'ten' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.khachhang || { id: 'khachhang', defaultMessage: 'khachhang' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects['customer.name']}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.ngaybatdau || { id: 'ngaybatdau', defaultMessage: 'ngaybatdau' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects.startDate}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.ngayketthuc || { id: 'ngayketthuc', defaultMessage: 'ngayketthuc' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects.endDate}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.trangthai || { id: 'trangthai', defaultMessage: 'trangthai' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects.taskStatus === 1
                      ? intl.formatMessage(messages.dangthuchien || { id: 'dangthuchien', defaultMessage: 'dangthuchien' })
                      : projects.taskStatus === 2
                        ? intl.formatMessage(messages.hoanthanh || { id: 'hoanthanh', defaultMessage: 'hoanthanh' })
                        : projects.taskStatus === 3
                          ? intl.formatMessage(messages.dongdung || { id: 'dongdung', defaultMessage: 'dongdung' })
                          : intl.formatMessage(messages.khongthuchien || { id: 'khongthuchien', defaultMessage: 'khongthuchien' })}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.duan || { id: 'duan', defaultMessage: 'duan' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects['projectId.name']}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.tiendo || { id: 'tiendo', defaultMessage: 'tiendo' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects.progress}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.uutien || { id: 'uutien', defaultMessage: 'uutien' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects.priority === 1
                      ? intl.formatMessage(messages.ratcao || { id: 'ratcao', defaultMessage: 'ratcao' })
                      : projects.priority === 2
                        ? intl.formatMessage(messages.cao || { id: 'cao', defaultMessage: 'cao' })
                        : projects.priority === 3
                          ? intl.formatMessage(messages.trungbinh || { id: 'trungbinh', defaultMessage: 'trungbinh' })
                          : projects.priority === 4
                            ? intl.formatMessage(messages.thap || { id: 'thap', defaultMessage: 'thap' })
                            : intl.formatMessage(messages.ratthap || { id: 'ratthap', defaultMessage: 'ratthap' })}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.duocxem || { id: 'duocxem', defaultMessage: 'duocxem' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects.viewable}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.phutrach || { id: 'phutrach', defaultMessage: 'phutrach' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects.inCharge}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.thamgia || { id: 'thamgia', defaultMessage: 'thamgia' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects.join}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.nguoitao || { id: 'nguoitao', defaultMessage: 'nguoitao' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects['createdBy.name']}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {intl.formatMessage(messages.mota || { id: 'mota', defaultMessage: 'mota' })}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>
                    {projects.description}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}

ProjectDetail.propTypes = {};

export default ProjectDetail;
