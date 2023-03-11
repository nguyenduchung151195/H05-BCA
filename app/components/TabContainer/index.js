/**
 *
 * TabContainer
 *
 */

import React from 'react';
// import { Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// function TabContainer(props) {
//   return <Paper style={{ marginLeft: 20, width: '100%' }}>{props.children}</Paper>;
// }
class TabContainer extends React.Component {
  shouldComponentUpdate() {
    if (this.props.tabIndex === this.props.order) {
      return true;
    }
    return false;

    // console.log(this.props.order);
  }

  render() {
    // console.log(this.props.order);
    // console.log(this.props);
    return <div>{this.props.children}</div>;
  }
}

TabContainer.propTypes = {
  children: PropTypes.object,
};

export default TabContainer;
