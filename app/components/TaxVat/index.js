/**
 *
 * TaxVat
 *
 */

import React from 'react';
import { compose } from 'redux';
// import PropTypes from 'prop-types';
import {
  Grid,
  withStyles,
  Typography,
  TextField,
  FormControl,
  Button,
  FormControlLabel,
  Checkbox,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import { Close, Add, Edit } from '@material-ui/icons';
import CustomAppBar from 'components/CustomAppBar';

import styles from './styles';

/* eslint-disable react/prefer-stateless-function */
class TaxVat extends React.Component {
  render() {
    const { classes, crmConfigPage, intl } = this.props;
    const id = this.props.crmConfigPage.name;
    //console.log('fdfdfd', this.props);
    return (
      <div style={{ marginTop: '70px' }}>
        {/* <AppBar className="HeaderAppBarAutomation">
        <Toolbar>
          <IconButton className="BTNAutomation" color="inherit" variant="contained" onClick={() => this.onCLoseTax()} aria-label="Close">
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
            {id === ''
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`}
          </Typography>
          <Button variant="outlined" color="inherit"  onClick={this.onSave} type="submit">
            {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
          </Button>
        </Toolbar>
      </AppBar> */}
        <CustomAppBar
          title={
            id === ''
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới taxvat' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật taxvat' })}`
          }
          onGoBack={() => this.onCLoseTax()}
          onSubmit={this.onSave}
        />
        <Grid item md={12}>
          <Typography variant="h6" style={{ marginTop: '20px', marginLeft: 40 }}>
            {intl.formatMessage(messages.thue || { id: 'thue', defaultMessage: 'thue' })}
          </Typography>
          <FormControl className={classes.textField}>
            <TextField
              label={intl.formatMessage(messages.ten || { id: 'ten', defaultMessage: 'ten' })}
              onChange={e => this.handleChangeTax('name', e.target.value)}
              className={classes.textField}
              value={crmConfigPage.name}
              name="name"
              margin="normal"
              variant="outlined"
              required
            />
          </FormControl>
          <FormControl className={classes.textField}>
            <TextField
              label={intl.formatMessage(messages.tygia || { id: 'tygia', defaultMessage: 'tygia' })}
              onChange={e => this.handleChangeTax('exchangeRate', e.target.value)}
              className={classes.textField}
              value={crmConfigPage.exchangeRate}
              name="exchangeRate"
              margin="normal"
              variant="outlined"
              required
            />
          </FormControl>
          <FormControl className={classes.textField}>
            <FormControlLabel
              style={{ marginLeft: 15 }}
              label={intl.formatMessage(messages.cohieuluc || { id: 'cohieuluc', defaultMessage: 'cohieuluc' })}
              control={
                <Checkbox onChange={e => this.handleDiscount('effective', e.target.checked)} checked={crmConfigPage.effective} color="primary" />
              }
            />
          </FormControl>
          <FormControl className={classes.textField}>
            <TextField
              label={intl.formatMessage(messages.phanloai || { id: 'phanloai', defaultMessage: 'phanloai' })}
              defaultValue="0"
              onChange={e => this.handleChangeTax('classify', e.target.value)}
              className={classes.textField}
              value={crmConfigPage.classify}
              name="classify"
              margin="normal"
              variant="outlined"
              required
            />
          </FormControl>
        </Grid>
        {/* <div style={{ marginLeft: '260px' }}>
          <Button variant="outlined" color="primary" className={classes.button} onClick={this.onSave}>
            {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
          </Button>
          <Button variant="outlined" color="secondary" className={classes.button} onClick={() => this.onCLoseTax()}>
            {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'hủy' })}
          </Button>
        </div> */}
      </div>
    );
  }

  handleChangeTax = (a, b) => {
    this.props.handleChangeTax(a, b);
  };

  handleDiscount = (name, checked) => {
    this.props.handleDiscount(name, checked);
  };

  onSave = () => {
    const { crmConfigPage } = this.props;
    const data = {
      _id: crmConfigPage._id,
      name: crmConfigPage.name,
      classify: crmConfigPage.classify,
      exchangeRate: crmConfigPage.exchangeRate,
      effective: crmConfigPage.effective,
      isVATTax: crmConfigPage.isVATTax,
    };
    this.props.onSaveTax(data);
  };

  onCLoseTax = () => {
    this.props.onCLoseTax();
  };
}

TaxVat.propTypes = {};

export default compose(
  withStyles(styles),
)(TaxVat);
