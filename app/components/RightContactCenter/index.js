/**
 *
 * RightContactCenter
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Paper, InputBase, List, ListItem, Checkbox, ListItemText, withStyles } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import styles from './styles';
import { convertString } from '../../utils/common';
/* eslint-disable react/prefer-stateless-function */
class RightContactCenter extends React.Component {
  state = {
    fields: [],
    textSearch: '',
  };

  componentDidMount() {
    const { fields } = this.props;
    this.setState({
      fields,
    });
  }

  handleChangeTextSearch = e => {
    this.setState({
      textSearch: e.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const { fields } = this.state;
    return (
      <div>
        <Paper>
          <div className={classes.topbar}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <Search />
              </div>
              <InputBase
                placeholder="Tìm kiếm trường ..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={this.handleChangeTextSearch}
              />
            </div>
          </div>
          <List className={classes.list}>
            {fields
              .filter(item => {
                const x = item.type.split('|');
                if (
                  !x.includes('objectid') &&
                  !x.includes('hard array') &&
                  item.name !== 'kanbanStatus' &&
                  item.name !== 'crmStatus' &&
                  item.name !== 'contactCenter.name' &&
                  item.name !== 'value.currencyUnit' &&
                  item.name !== 'source' &&
                  item.name !== 'customer.name' &&
                  item.name !== 'state' &&
                  item.name !== 'code'
                ) {
                  return convertString(item.title).search(convertString(this.state.textSearch)) >= 0;
                }
                return false;
              })
              .map(item => (
                <ListItem key={item.name} role={undefined} dense button onClick={() => this.props.handleSelect(item.name)}>
                  <Checkbox color="primary" checked={item.selected} tabIndex={-1} disableRipple />
                  <ListItemText primary={item.title} />
                </ListItem>
              ))}
          </List>
        </Paper>
      </div>
    );
  }
}

RightContactCenter.propTypes = {};

export default withStyles(styles)(RightContactCenter);
