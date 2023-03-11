/**
 *
 * CurrencyAuto
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  Grid,
  Paper,
  Typography,
  // Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core';
// import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

/* eslint-disable react/prefer-stateless-function */
class CurrencyAuto extends React.Component {
  state = {
    money: '',
    checked: null,
    infoCurrent: { code: '', name: '' },
    search: '',
    defaultCurrency: '',
    changeCurrency: '',
  };

  handleChangeInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSelect = e => {
    const currency = this.props.currency.find(item => item._id === e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
      infoCurrent: currency,
    });
  };

  handleSeach = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes, currency } = this.props;
    const { checked, infoCurrent, defaultCurrency, changeCurrency } = this.state;

    return (
      <div>
        <Grid container spacing={3}>
          <Grid item md={6}>
            <Paper className={classes.paper}>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>TÌM ĐỒNG TIỀN</Typography>
              <TextField
                label="Tìm đồng tiền"
                onChange={this.handleSeach}
                className={classes.textField}
                value={this.state.search}
                name="search"
                margin="normal"
                variant="outlined"
                placeholder="Gõ vào đây"
              />
              <InputLabel shrink style={{ fontSize: 14, marginLeft: 25, marginTop: 15, display: 'block' }}>
                Chọn đồng tiền
              </InputLabel>

              <Select
                className={classes.textField}
                value={this.state.money}
                name="money"
                onChange={this.handleSelect}
                input={<OutlinedInput labelWidth={0} id="select" />}
              >
                {currency.filter(element => element.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1).map(item => (
                  <option value={item._id}>{item.name} </option>
                ))}
              </Select>

              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>THUỘC TÍNH CỦA ĐỒNG TIỀN</Typography>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>Mã dạng số</Typography>
              <Typography style={{ marginLeft: 25 }}>{infoCurrent.name}</Typography>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>Mã ký hiệu</Typography>
              <Typography style={{ marginLeft: 25 }}>{infoCurrent.code}</Typography>
              <div style={{ marginLeft: '25px', display: 'flex', alignItems: 'center' }}>
                <Typography required style={{ marginTop: 15 }}>
                  Tỷ giá hối đoái (mặc định)
                </Typography>
                <div>
                  <TextField
                    style={{ width: '40%', marginTop: 0 }}
                    onChange={() => this.handleChangeInput('defaultCurrency')}
                    value={defaultCurrency}
                    name="defaultCurrency"
                    margin="normal"
                    variant="outlined"
                    defaultValue="1"
                  />
                  <span>{infoCurrent.code}</span>
                  <span style={{ marginLeft: 20, fontSize: 20 }}>=</span>
                  <TextField
                    style={{ width: '40%', marginTop: 0 }}
                    onChange={() => this.handleChangeInput('changeCurrency')}
                    value={changeCurrency}
                    name="changeCurrency"
                    margin="normal"
                    variant="outlined"
                  />
                  <span style={{ fontSize: 20 }}>USD</span>
                </div>
              </div>
              <TextField
                label="Phân loại chỉ số"
                onChange={this.handleChangeInput}
                className={classes.textField}
                // value={this.state.companyName}
                name="companyName"
                margin="normal"
                variant="outlined"
                defaultValue="100"
              />
              <FormGroup style={{ marginLeft: 25 }} row>
                <FormControlLabel
                  control={<Checkbox onChange={this.handleChange('checked')} value={checked} color="primary" />}
                  label="Đồng tiền báo cáo"
                />
              </FormGroup>
              <FormGroup style={{ marginLeft: 25 }} row>
                <FormControlLabel
                  control={<Checkbox onChange={this.handleChange('checked')} value={checked} color="primary" />}
                  label="Tiền tệ lập hóa đơn mặc định"
                />
              </FormGroup>
            </Paper>
          </Grid>
          <Grid item md={6}>
            <Paper className={classes.paper}>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>VIETNAMESE</Typography>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>Tên</Typography>
              <Typography style={{ marginLeft: 25 }}>{infoCurrent.name}</Typography>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>Ví dụ về định dạng tiền tệ</Typography>
              <Typography style={{ marginLeft: 25 }}>Br85,242.82</Typography>
            </Paper>
            <Paper className={classes.paper}>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>ENGLISH</Typography>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>Tên</Typography>
              <Typography style={{ marginLeft: 25 }}>{infoCurrent.name}</Typography>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>Ví dụ về định dạng tiền tệ</Typography>
              <Typography style={{ marginLeft: 25 }}>Br85,242.82</Typography>
            </Paper>
            <Paper className={classes.paper}>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>JAPAN</Typography>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>Tên</Typography>
              <Typography style={{ marginLeft: 25 }}>{infoCurrent.name}</Typography>
              <Typography style={{ marginTop: '30px', marginLeft: 25 }}>Ví dụ về định dạng tiền tệ</Typography>
              <Typography style={{ marginLeft: 25 }}>Br85,242.82</Typography>
            </Paper>
          </Grid>
        </Grid>
        );
      </div>
    );
  }
}

CurrencyAuto.propTypes = {};

export default compose(withStyles(styles))(CurrencyAuto);
