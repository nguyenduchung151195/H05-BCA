/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * OthersProductInfo
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Grid, TextField } from '@material-ui/core';
// import { FormattedMessage } from 'react-intl';


/* eslint-disable react/prefer-stateless-function */
class OthersProductInfo extends React.Component {
  state = {
    fieldAdded: this.props.fieldAdded,
  };

  componentDidMount() {
    this.props.onRef ? this.props.onRef(this) : null;
  }

  componentWillReceiveProps() {
    const { product } = this.props;
    if (product && product.others && Object.keys(product.others).length > 0) {
      const { fieldAdded } = this.state;
      const keys = Object.keys(product.others);
      fieldAdded.forEach(item => {
        const index = keys.findIndex(n => n === item.name.replace('others.', ''));
        if (index > -1) {
          item.value = product.others[keys[index]];
        }
      });
      this.state.fieldAdded = fieldAdded;
    }
  }

  render() {
    return (
      <div>
        <Grid item md={12} container spacing={24}>
          {this.state.fieldAdded.length > 0
            ? this.state.fieldAdded.map((item, index) => {
                if (item.checked) {
                  return (
                    <Grid item md={6} key={item.name}>
                      <TextField
                        label={item.title}
                        variant="outlined"
                        type={item.type === 'string' ? 'text' : item.type}
                        value={item.value}
                        onChange={event => this.handleChangeAddedField(index, event)}
                        style={{ width: '100%' }}
                        margin="normal"
                      />
                    </Grid>
                  );
                }
              })
            : ''}
        </Grid>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  getData = () => {
    this.props.othersProductInfo.data = this.state;
  };

  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };
}

OthersProductInfo.propTypes = {};

export default OthersProductInfo;
