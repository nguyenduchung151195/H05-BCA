import React from 'react';

export default class LtComponent extends React.Component {
  isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  isNull(value) {
    return value === null;
  }

  isBoolean(value) {
    return typeof value === 'boolean';
  }

  isRegExp(value) {
    return value && typeof value === 'object' && value.constructor === RegExp;
  }

  isString(value) {
    return typeof value === 'string' || value instanceof String;
  }

  isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
  }
}
