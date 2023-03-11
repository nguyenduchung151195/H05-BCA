/**
 *
 * DragDropFile
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class DragDropFile extends React.Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }

  suppress(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }

  onDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    // eslint-disable-next-line prefer-destructuring
    const files = evt.dataTransfer.files;
    // eslint-disable-next-line react/prop-types
    if (files && files[0]) this.props.handleFile(files[0]);
  }

  render() {
    return (
      <div onDrop={this.onDrop} onDragEnter={this.suppress} onDragOver={this.suppress}>
        {' '}
        {this.props.children}{' '}
      </div>
    );
  }
}

DragDropFile.propTypes = {};

export default DragDropFile;
