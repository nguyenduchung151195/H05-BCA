/* eslint-disable react/prop-types */
/* eslint-disable indent */
/**
 *
 * CreateProjectContentDialog
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import AsyncSelect from 'react-select/async';
import { TextField, Grid, Button } from '@material-ui/core';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
//  import AsyncSelect from '../AsyncComponent';
import { API_USERS } from 'config/urlConfig';
/* eslint-disable react/prefer-stateless-function */

class ScanFile extends React.Component {
  // state = {
  //   project: {
  //     fullPath: '',
  //   },
  // };

  // handleChangeSelect = (selectedOption, key) => {
  //   const { project } = this.state;
  //   project[key] = selectedOption;
  //   this.setState({ project });
  //   this.props.onChangeNewProject(project);
  // };

  render() {
    // const { project } = this.state;
    const {onChangeFile} = this.props

    return (
          <Grid container>
            <Grid item sm={12} className="my-2">
              <input
                type="file"
                id="fileUpload"
                name="fileUpload"
                onChange={event => {
                  onChangeFile && onChangeFile(event)
                }}
                // value={project.fullPath}
                accept=".pdf"
              />
            </Grid>
          </Grid>
    );
  }
}

ScanFile.propTypes = {};

export default ScanFile;
