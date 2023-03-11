/**
 *
 * Location
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Grid, withStyles, Paper, Typography, TextField, FormControl, Button, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Done, Close } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
/* eslint-disable react/prefer-stateless-function */
import styles from './styles';

import CustomAppBar from 'components/CustomAppBar';

class Location extends React.Component {
  // state = {
  //   tabIndex: 0,
  // };

  render() {
    const { classes, crmConfigPage, intl } = this.props;
    // const stock = this.props.propsAll.match.path;
    // const addStock = stock && stock.slice(stock.length - 3, stock.length);
    const checkAddEdit = this.props.crmConfigPage.code
    //console.log("vvvvvv", this.props)
    return (
      <div>
        <ValidatorForm onSubmit={this.onSave}>
          {/* <AppBar className="HeaderAppBarAutomation">
            <Toolbar>
              <IconButton
                className="BTNAutomation"
                color="inherit"
                variant="contained"
                onClick={() => this.props.propsAll.history.goBack()}
                aria-label="Close"
              >
                <Close />
              </IconButton>
              <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                {checkAddEdit === ''
                  ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
                  : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`}
              </Typography>
              <Button variant="outlined" color="primary" type="submit">
                {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
              </Button>
            </Toolbar>
          </AppBar> */}
          <CustomAppBar
            title={checkAddEdit === ''
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới Location' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật location' })}`}
            onGoBack={() => this.props.propsAll.history.goBack()}
            onSubmit={this.onSave}
          />
          <Grid item md={12}>
            <div>
              <Typography variant="h6" style={{ marginTop: '20px', marginLeft: 40 }}>
                {crmConfigPage._id
                  ? intl.formatMessage(messages.them || { id: 'them', defaultMessage: 'them' })
                  : intl.formatMessage(messages.sua || { id: 'sua', defaultMessage: 'sua' })}
              </Typography>

              <Paper className={classes.root} style={{ display: 'block', verticalAlign: 'inherit' }}>
                <FormControl className={classes.textField}>
                  <TextValidator
                    validators={['required', 'matchRegexp:^[a-zA-Z0-9]{3,20}$']}
                    errorMessages={['Không được bỏ trống', 'Mã symbolic chỉ bao gồm ký tự chữ hoặc số hoặc ký tự "-" ']}
                    label={intl.formatMessage(messages.ma || { id: 'ma', defaultMessage: 'ma' })}
                    onChange={e => this.handleChangeLocation('code', e.target.value)}
                    className={classes.textField}
                    value={crmConfigPage.code}
                    name="code"
                    margin="normal"
                    variant="outlined"
                    required
                  />
                </FormControl>
                <FormControl className={classes.textField}>
                  <TextField
                    label={intl.formatMessage(messages.sapxep || { id: 'sapxep', defaultMessage: 'sapxep' })}
                    onChange={e => this.handleChangeLocation('sort', e.target.value)}
                    className={classes.textField}
                    value={crmConfigPage.sort}
                    name="sort"
                    margin="normal"
                    variant="outlined"
                  />
                </FormControl>
                <FormControl className={classes.textField}>
                  <TextField
                    label={intl.formatMessage(messages.kieu || { id: 'kieu', defaultMessage: 'kieu' })}
                    className={classes.textField}
                    value="Country"
                    name="type"
                    margin="normal"
                    variant="outlined"
                  />
                </FormControl>
                <Paper className={classes.paper} style={{ background: '#c0c9d8', marginTop: 25, width: '94%', fontWeight: 'bold' }}>
                  {intl.formatMessage(messages.dulieudialy || { id: 'dulieudialy', defaultMessage: 'dulieudialy' })}
                </Paper>
                <FormControl className={classes.textField}>
                  <TextField
                    label={intl.formatMessage(messages.kinhdo || { id: 'kinhdo', defaultMessage: 'kinhdo' })}
                    onChange={e => this.handleChangeLocation('longitude', e.target.value)}
                    className={classes.textField}
                    value={crmConfigPage.longitude}
                    name="longitude"
                    margin="normal"
                    variant="outlined"
                  />
                </FormControl>
                <FormControl className={classes.textField}>
                  <TextField
                    label={intl.formatMessage(messages.vido || { id: 'vido', defaultMessage: 'vido' })}
                    onChange={e => this.handleChangeLocation('latitude', e.target.value)}
                    className={classes.textField}
                    value={crmConfigPage.latitude}
                    name="latitude"
                    margin="normal"
                    variant="outlined"
                  />
                </FormControl>
                <Paper className={classes.paper} style={{ background: '#c0c9d8', marginTop: 25, width: '94%', fontWeight: 'bold' }}>
                  {intl.formatMessage(messages.chucnangngonngu || { id: 'chucnangngonngu', defaultMessage: 'chucnangngonngu' })}
                </Paper>
                <FormControl className={classes.textField}>
                  <TextValidator
                    validators={['required']}
                    errorMessages={['Không được bỏ trống']}
                    label={intl.formatMessage(messages.ten || { id: 'ten', defaultMessage: 'ten' })}
                    onChange={e => this.handleChangeLocation('name', e.target.value)}
                    className={classes.textField}
                    value={crmConfigPage.name}
                    name="name"
                    margin="normal"
                    variant="outlined"
                    required
                  />
                </FormControl>
                <FormControl className={classes.textField}>
                  <TextValidator
                    validators={['required']}
                    errorMessages={['Không được bỏ trống']}
                    label={intl.formatMessage(messages.tenngan || { id: 'tenngan', defaultMessage: 'tenngan' })}
                    onChange={e => this.handleChangeLocation('shortname', e.target.value)}
                    className={classes.textField}
                    value={crmConfigPage.shortname}
                    name="shortname"
                    margin="normal"
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Paper>
            </div>
            {/* <div style={{ marginLeft: '260px' }}>
              <Button variant="outlined" color="primary" className={classes.button} type="submit">
                {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
              </Button>
              <Button variant="outlined" color="secondary" className={classes.button} onClick={this.onClose}>
                {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'hủy' })}
              </Button>
            </div> */}
          </Grid>
        </ValidatorForm>
      </div>
    );
  }

  handleChangeLocation = (a, b) => {
    this.props.handleChangeLocation(a, b);
  };

  onSave = () => {
    const { crmConfigPage } = this.props;
    const data = {
      name: crmConfigPage.name,
      titlesByLanguage: [
        {
          shortNameE: crmConfigPage.shortName,
        },
      ],
      code: crmConfigPage.code,
      sort: crmConfigPage.sort,
      latitude: crmConfigPage.latitude,
      longitude: crmConfigPage.longitude,
      type: 'Country',
    };
    this.props.onSaveLocation(data);
  };

  onClose = () => {
    this.props.onCloseLocation();
  };
}

Location.propTypes = {};

export default compose(
  withStyles(styles),
)(Location);
