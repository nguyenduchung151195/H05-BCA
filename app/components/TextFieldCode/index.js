/**
 *
 * TextFieldCode
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import CustomInputBase from 'components/Input/CustomInputBase';
// import { FormattedMessage } from 'react-intl';


/* eslint-disable react/prefer-stateless-function */
class TextFieldCode extends React.Component {
  render() {
    const codeConfig = JSON.parse(localStorage.getItem('codeConfig'));
    const { code } = this.props;

    let codeGenerate = '';
    if (codeConfig) {
      const codeConfigForCodeProps = codeConfig.find(item => Number(item.code) === Number(code));

      if (codeConfigForCodeProps) {
        switch (Number(codeConfigForCodeProps.method)) {
          case 0:
            codeGenerate = codeConfigForCodeProps.prefix + new Date().valueOf() + codeConfigForCodeProps.suffixes;
            break;

          default:
            break;
        }
        if (!this.props.value) {
          this.props.onChange({
            target: {
              value: codeGenerate,
              name: this.props.name,
            },
          });
        }
      }
    }

    return <CustomInputBase disabled defaultValue={codeGenerate} {...this.props} />;
  }
}

TextFieldCode.propTypes = {};

export default TextFieldCode;
