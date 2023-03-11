/**
 *
 * NewCard
 *
 */

import React from 'react';
import { Checkbox, FormControlLabel, Button, Dialog } from '@material-ui/core';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class NewCard extends React.Component {
  state = {
    id: 'Milk1',
    title: 'Xây dựng đồ thị 1000 sao',
    time: 'today,5h20',
    action: ['sms', 'email', 'call'],
    description: 'Đô thị nghìn sao đẹp nhất',
    dialog: false,
  };

  componentDidMount() {
    this.setState({ dialog: true });
  }

  updateField = (field, evt) => {
    this.setState({ [field]: evt.target.value });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleAdd = () => {
    this.props.onAdd(this.state);
  };

  render() {
    const { onCancel } = this.props;
    return (
      <Dialog open={this.state.dialog} onClose={onCancel}>
        <div style={{ background: 'white', borderRadius: 3, border: '1px solid #eee', borderBottom: '1px solid #ccc' }}>
          <div style={{ padding: 5, margin: 5, color: 'black' }}>
            <div>
              <div style={{ marginBottom: 5, backgroundColor: '#EEEEEE', paddingTop: 7, paddingBottom: 7, borderRadius: 5 }}>
                <input style={{ cursor: 'pointer !important' }} type="text" onChange={evt => this.updateField('title', evt)} placeholder="Tên" />
              </div>
              <div style={{ marginBottom: 5, backgroundColor: '#EEEEEE', paddingTop: 7, paddingBottom: 7, borderRadius: 5 }}>
                <input type="text" onChange={evt => this.updateField('Miêu tả', evt)} placeholder="Mô tả" />
              </div>
              <div style={{ marginBottom: 5 }}>
                <p>Hoạt động</p>

                <FormControlLabel
                  control={<Checkbox checked={this.state.checkedB} onChange={this.handleChange('checkedB')} value="checkedB" color="primary" />}
                  label="Email"
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.checkedB} onChange={this.handleChange('checkedB')} value="checkedB" color="primary" />}
                  label="Gọi điện"
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.checkedB} onChange={this.handleChange('checkedB')} value="checkedB" color="primary" />}
                  label="Nhắn tin"
                />
              </div>
            </div>
            <footer style={{ display: 'flex', flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary" onClick={this.handleAdd} style={{ marginRight: 10 }}>
                LƯU
              </Button>
              <Button color="secondary" variant="contained" onClick={onCancel}>
                Hủy
              </Button>
            </footer>
          </div>
        </div>
      </Dialog>
    );
  }
}
NewCard.propTypes = {
  onCancel: PropTypes.func,
  onAdd: PropTypes.func,
};

export default NewCard;
