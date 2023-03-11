import React from 'react';
import { Badge } from '@material-ui/core';
import PropTypes from 'prop-types';

const TitleBadge = props => (
  <h4>
    <span style={{ marginRight: '7px' }}>{props.children}</span>{' '}
    <Badge style={{ margin: '5px' }} color="primary" badgeContent={props.length}>
      {''}
    </Badge>
  </h4>
);

TitleBadge.propTypes = {
  length: PropTypes.number,
  children: PropTypes.string,
};

export default TitleBadge;
