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
import AsyncSelect from '../AsyncComponent';
import { API_USERS } from '../../config/urlConfig';
/* eslint-disable react/prefer-stateless-function */

class CreateProjectContentDialog extends React.Component {
  state = {
    project: {
      name: '',
      users: [],
      state: '',
      description: '',
    },
  };

  handleChangeSelect = (selectedOption, key) => {
    const { project } = this.state;
    project[key] = selectedOption;
    this.setState({ project });
    this.props.onChangeNewProject(project);
  };

  render() {
    const { project } = this.state;

    return (
      <div>
        <ValidatorForm
          onSubmit={() => {
            this.props.onSubmit('ok');
          }}
        >
          <Grid container>
            <Grid item sm={12} className="my-2">
              <TextValidator
                variant="outlined"
                label="Tên dự án"
                placeholder="Tên dự án"
                fullWidth
                onChange={event => {
                  project.name = event.target.value;
                  this.setState({ project });
                  this.props.onChangeNewProject(project);
                }}
                validators={['required']}
                errorMessages={['Tên dự án không được để trống']}
                value={project.name}
              />
            </Grid>
            <Grid item sm={12} className="my-2">
              <AsyncSelect
                onChange={value => {
                  this.handleChangeSelect(value, 'users');
                }}
                value={this.state.project.users}
                placeholder="Người tham gia"
                API={API_USERS}
                modelName="Employee"
                isMulti
              />
            </Grid>
            <Grid item sm={12} className="my-2">
              <TextValidator
                variant="outlined"
                type="number"
                label="Trạng thái dự án"
                placeholder="Trạng thái dự án"
                fullWidth
                inputProps={{ min: 0 }}
                onChange={event => {
                  project.state = event.target.value;
                  this.setState({ project });
                  this.props.onChangeNewProject(project);
                }}
                validators={['required', 'isNumber', 'minNumber: 0']}
                errorMessages={[
                  'Trạng thái dự án không được để trống',
                  'Trạng thái dự án phải là số tự nhiên',
                  'Trạng thái dự án phải lớn hơn hoặc bầng 0',
                ]}
                value={project.state}
              />
            </Grid>
            <Grid item sm={12} className="my-2">
              <TextField
                variant="outlined"
                label="Mô tả"
                placeholder="Mô tả"
                fullWidth
                multiline
                rows={4}
                onChange={event => {
                  project.description = event.target.value;
                  this.setState({ project });
                  this.props.onChangeNewProject(project);
                }}
                value={project.description}
              />
            </Grid>
            <Grid item sm={12} className="text-right">
              <Button
                className="mx-3"
                type="button"
                onClick={() => {
                  this.props.onSubmit('cancel');
                }}
                variant="contained"
                color="secondary"
              >
                Hủy
              </Button>
              <Button variant="outlined" color="primary" type="submit">
                Tạo mới
              </Button>
            </Grid>
          </Grid>
        </ValidatorForm>
      </div>
    );
  }
}

CreateProjectContentDialog.propTypes = {};

export default CreateProjectContentDialog;
