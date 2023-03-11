/**
 *
 * AsyncComponent
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { components } from 'react-select';
import { serialize } from '../../utils/common';
import { API_COMMON } from '../../config/urlConfig';

// eslint-disable-next-line no-unused-vars
const { ValueContainer, Placeholder } = components;

const CustomValueContainer = ({ children, ...props }) => (
  <components.ValueContainer {...props} style>
    <Placeholder {...props} isFocused={props.isFocused}>
      {props.selectProps.placeholder}
    </Placeholder>
    {React.Children.map(children, child => (child && child.type !== Placeholder ? child : null))}
  </components.ValueContainer>
);
const customStyles = {
  menu: base => ({
    ...base,
    backgroundColor: 'white',
    zIndex: '2!important',
  }),
  menuList: base => ({
    ...base,
    backgroundColor: 'white',
    zIndex: '2!important',
  }),
  input: base => ({
    ...base,
    padding: '13px 14px',
  }),
  container: provided => ({
    ...provided,
    marginTop: 8,
  }),
  placeholder: (provided, state) => ({
    ...provided,
    position: 'absolute',
    top: state.hasValue || state.selectProps.inputValue ? -5 : '50%',
    transition: 'top 0.1s, font-size 0.1s',
    fontSize: (state.hasValue || state.selectProps.inputValue) && 10,
    // zIndex: '5!important',
    backgroundColor: 'white',
    padding: '0 4px',
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    position: state.hasValue || state.selectProps.inputValue ? '' : 'relative',
  }),
};

const promiseOptions = (searchString, putBack, rootUrl) => {
  const param = {
    limit: '10',
    skip: '0',
  };
  if (searchString != null) {
    param.filter = {
      name: {
        $regex: searchString,
        $options: 'gi',
      },
    };
  }
  // http://g.lifetek.vn:220/api/employees
  axios
    .get(`${rootUrl}?${serialize(param)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const convertedData = [];

      response.data.data.map(item => {
        delete item.user;
        convertedData.push({
          ...item,
          ...{ label: item.name, value: item._id },
        });
      });

      putBack(convertedData);
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      // console.log(err);
    });
};
/* eslint-disable react/prefer-stateless-function */
class AsyncComponent extends React.Component {
  state = {
    value: undefined,
  };

  componentDidMount() {
    if (this.props.value) {
      if (this.props.noFormatValue) {
        this.setState({ value: this.props.value });
      } else {
        // eslint-disable-next-line no-lonely-if
        if (!this.props.modelName) {
          // singel select
          axios
            .get(`${this.props.API}?${serialize({ filter: { _id: this.props.value } })}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
            })
            .then(response => {
              if (response.data.data) {
                this.setState({
                  value: { ...response.data.data[0], ...{ label: response.data.data[0].name, value: response.data.data[0]._id } },
                });
              }
            })
            .catch(err => {
              // eslint-disable-next-line no-console
              // console.log(err);
            });
        } else {
          // multi select

          axios
            .get(`${API_COMMON}?${serialize({ model: this.props.modelName, ids: this.props.value })}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
            })
            .then(response => {
              if (response.data.data) {
                const convertedData = [];
                response.data.data.map(item => {
                  delete item.user;
                  convertedData.push({
                    ...item,
                    ...{ label: item.name, value: item._id },
                  });
                });
                this.setState({
                  value: convertedData,
                });
              }
            })
            .catch(err => {
              // eslint-disable-next-line no-console
              // console.log(err);
            });
        }
      }
    }
  }

  render() {
    return (
      <div>
        <AsyncSelect
          isClearable
          isMulti={this.props.isMulti}
          cacheOptions
          defaultOptions
          onChange={selectedOption => {
            this.setState({ value: selectedOption });
            this.props.onChange(selectedOption);
          }}
          // styles={customStyles}
          value={this.state.value}
          placeholder={this.props.placeholder}
          styles={customStyles}
          components={{
            ValueContainer: CustomValueContainer,
          }}
          loadOptions={(inputValue, callback) => {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              promiseOptions(inputValue, callback, this.props.API);
            }, 500);
          }}
        />
      </div>
    );
  }
}

AsyncComponent.propTypes = {};

export default AsyncComponent;
