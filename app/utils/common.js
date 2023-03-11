/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */

const dot = require('dot-object');
const moment = require('moment');
const avatarDefault = require('../images/default-avatar.png');
var FormulaParser = require('hot-formula-parser').Parser;
var parser = new FormulaParser();
// import { convertTemplate } from '../helper';
// const { API_TEMPLATE } = require('../config/urlConfig');
function serialize(obj, prefix) {
  const str = [];
  let p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p;

      const v = obj[p];
      str.push(v !== null && typeof v === 'object' ? serialize(v, k) : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
  }
  return str.join('&');
}
function convertDatetime2Date(datetime) {
  const date = moment(datetime, 'DD/MM/YYYY').format('YYYY-MM-DD');
  if (date === 'Invalid date') {
    return datetime;
  }
  return date;
}

function clearWidthSpace(str) {
  return !!str ? str.replaceAll(/\s+/g, ' ') : ' ';
}

function removeVietnameseTones(str) {
  if (!str || typeof str !== 'string') return str;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
  return str.toLowerCase();
}

function convertDatetimeToDate(datetime) {
  let date = new Date(datetime);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = date.getFullYear();
  date = `${yyyy}-${mm}-${dd}`;
  return date;
}

function convertDatetimeToDateForTextField(datetime) {
  let date;
  if (datetime === '') {
    date = new Date();
  } else {
    date = new Date(datetime);
  }
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const hh = String(date.getHours()).padStart(2, '0');
  const ms = String(date.getMinutes()).padStart(2, '0');
  const yyyy = date.getFullYear();
  date = `${yyyy}-${mm}-${dd}T${hh}:${ms}`;
  return date;
}

const inorgesign = alias => {
  let str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');

  // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  return str;
};

const getLabelName = (name, viewConfigCode) => {
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const currentViewConfig = viewConfig.find(n => n.code === viewConfigCode);
  const column = currentViewConfig && currentViewConfig.listDisplay && currentViewConfig.listDisplay.type.fields.type.columns;
  const currentField = column && column.find(i => i.name === name);
  if (currentField) return currentField.title;
  return '';
};

function convertTemplate({ content, data, code }) {
  const newData = dot.dot(data);
  const result = [];
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  function getName(codeName, refName) {
    const list = viewConfig.find(item => item.code === codeName);
    if (list) {
      list.listDisplay.type.fields.type.columns.forEach(item => {
        const newItem = { ...item, name: `${refName}.${item.name}` };
        result.push(newItem);
      });
    }
  }

  const codes = viewConfig.find(item => item.code === code).listDisplay.type.fields.type.columns;
  codes.forEach(item => {
    if (item.type.includes('ObjectId')) {
      const ref = item.type.substring(9);
      getName(ref, item.name);
    }
  });

  const newResult = result.concat(codes);
  newResult.forEach(item => {
    const replace = `{${item.name}}`;
    const regex = new RegExp(replace, 'g');
    const rep = newData[item.name] ? newData[item.name] : '';
    content = content.replace(regex, rep);
  });
  return content;
}

function viewConfigName2Title(moduleCode) {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const result = {};
    column.forEach(element => {
      result[element.name] = element.title;
    });
    return result;
  } catch (error) {
    return {};
  }
}

function viewConfigCheckShowForm(moduleCode, name, filterValue, value) {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const others = currentViewConfig.listDisplay.type.fields.type.others;
    const checks = column.concat(others);

    const foundColumn = checks.find(item => item.name === name);
    // const filterConfig = foundColumn.
    if (!foundColumn) {
      return false;
    }
    if (
      typeof filterValue === 'undefined' ||
      !foundColumn.filterConfig ||
      typeof foundColumn.filterConfig[filterValue] === 'undefined' ||
      typeof foundColumn.filterConfig[filterValue][value] === 'undefined'
    ) {
      return foundColumn[value];
    }
    return foundColumn.filterConfig[filterValue][value];
  } catch (error) {
    return false;
  }
}

function viewConfigShowLabel(moduleCode, name, filterValue) {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const others = currentViewConfig.listDisplay.type.fields.type.others;
    const checks = column.concat(others);

    const foundColumn = checks.find(item => item.name === name);
    // const filterConfig = foundColumn.
    if (!foundColumn) {
      return '';
    }
    if (
      typeof filterValue === 'undefined' ||
      !foundColumn.filterConfig ||
      typeof foundColumn.filterConfig[filterValue] === 'undefined' ||
      typeof foundColumn.filterConfig[filterValue].title === 'undefined'
    ) {
      return foundColumn.title;
    }
    return foundColumn.filterConfig[filterValue].title;
  } catch (error) {
    return '';
  }
}

function viewConfigCheckRequired(moduleCode, type) {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const others = currentViewConfig.listDisplay.type.fields.type.others;
    const checks = column.concat(others);
    let checkRequired = {};

    if (type === 'required') {
      checks.forEach(item => {
        checkRequired[item.name] = item.checkedRequireForm;
      });
    }
    if (type === 'showForm') {
      checks.forEach(item => {
        checkRequired[item.name] = item.checkedShowForm;
      });
    }
    return checkRequired;
  } catch (error) {
    return {};
  }
}

function formatMessages(obj) {
  const { min, max, maxLength, minLength, checkedRequireForm, html, especially, email, excludeChar, excludeRegexMsg } = obj;
  if (min) {
    return `Yêu cầu nhập lớn hơn hoặc bằng ${min}`;
  }
  if (max) {
    return `Yêu cầu nhập nhỏ hơn hoặc bằng ${max}`;
  }
  if (maxLength) {
    return `Yêu cầu nhập nhỏ hơn hoặc bằng ${maxLength}`;
  }
  if (minLength) {
    return `Yêu cầu nhập lớn hơn hoặc bằng ${minLength}`;
  }
  if (html) {
    return `Yêu cầu nhập trường ${obj.title} không chứa HTML`;
  }
  if (especially) {
    return `Yêu cầu nhập trường ${obj.title} không chứa ký tự đặc biệt`;
  }
  if (email) {
    return `Định dạng ${obj.title} không hợp lệ`;
  }
  if (excludeRegexMsg) {
    return excludeRegexMsg || '';
  }
  if (excludeChar) {
    return `Yêu cầu nhập trường ${obj.title} không chứa ${excludeChar}`;
  }
  if (checkedRequireForm) {
    return `Không được để trống ${obj.title}`;
  }
}
function checkExistHtml(str) {
  const a = document.createElement('div');
  a.innerHTML = str;
  for (var c = a.childNodes, i = c.length; i--;) {
    if (c[i].nodeType == 1) return true;
  }
  return false;
}
function checkExistHtmlAndNoString(str) {
  if (str && checkString(str)) return true
  const a = document.createElement('div');
  a.innerHTML = str;
  for (var c = a.childNodes, i = c.length; i--;) {
    if (c[i].nodeType == 1) return true;
  }
  return false;
}
function Validate(check, value) {
  const { type, name, title, checkedRequireForm, min, max, maxLength, minLength, excludeChar, excludeRegex, excludeRegexMsg } = check;

  if (checkedRequireForm) {
    if (!value) {
      return formatMessages({ title, checkedRequireForm });
    }
    // convert dot name includes . and value is obj and type in viewconfig is String
    // if (name && name.includes(".") && type === 'String' && typeof value === 'object' && !Array.isArray(value) && value !== null) {
    //   console.log(value, "value")
    //   value = convertDot(value)
    //   console.log(value, "value")

    // }
    if (type === 'String' && typeof value === 'string' && value.length === 0) {
      return formatMessages({ title, checkedRequireForm });
    }
    if ((type === 'Date' && typeof value === 'string' && value.length === 0) || (Array.isArray(value) && value.length === 0) || value === null) {
      return formatMessages({ title, checkedRequireForm });
    }

    if (type === 'String' && minLength && typeof value === 'string' && value.length < minLength) {
      return formatMessages({ minLength, title });
    }
    if (type === 'String' && maxLength && typeof value === 'string' && value.length > maxLength) {
      return formatMessages({ maxLength, title });
    }
    // html
    if (type === 'String' && value && value.length && checkExistHtml(value)) {
      return formatMessages({ title, checkedRequireForm, html: true });
    }
    // ký tự đặc biệt
    // if (type === 'String' && value && value.length && checkString(value) && name !== "email" && name !== "phoneNumber" && name !== "toBookCode" && name !== "updatedAt" && name !== "createdAt") {
    //   return formatMessages({ title, checkedRequireForm, especially: true });
    // }
    if (type === 'String' && typeof value === 'string' && (name === 'email' || name === 'accountEmail') && validateEmail(value)) {
      const email = value;
      return formatMessages({ email, title });
    }
    // kiểm tra tồn tại ký tự
    if (type === 'String' && value && value.length && excludeChar && excludeChar.length && checkExistExcludeChar(value, excludeChar)) {
      return formatMessages({ title, checkedRequireForm, excludeChar });
    }
    // kiểm tra tồn tại ký tự regex
    if (
      type === 'String' &&
      value &&
      value.length &&
      excludeRegex &&
      excludeRegex.length &&
      excludeRegexMsg &&
      excludeRegexMsg.length &&
      checkExistExcludeRegex(value, excludeRegex)
    ) {
      return formatMessages({ title, checkedRequireForm, excludeRegexMsg });
    }
    // Kiểm tra loại chuỗi và rỗng
    if (typeof value === 'string' && value.length === 0) {
      return formatMessages({ title, checkedRequireForm });
    }
  } else {
    if (type === 'String' && value && value.length && checkExistHtml(value)) {
      return formatMessages({ title, checkedRequireForm, html: true });
    }
    // ký tự đặc biệt
    // if (type === 'String' && value && value.length && checkString(value) && name !== "email" && name !== "phoneNumber" && name !== "toBookCode" && name !== "updatedAt" && name !== "createdAt") {
    //   return formatMessages({ title, checkedRequireForm, especially: true });
    // }
    // kiểm tra tồn tại ký tự
    if (type === 'String' && value && value.length && excludeChar && excludeChar.length && checkExistExcludeChar(value, excludeChar)) {
      return formatMessages({ title, checkedRequireForm, excludeChar });
    }
    // kiểm tra tồn tại ký tự regex
    if (
      type === 'String' &&
      value &&
      value.length &&
      excludeRegex &&
      excludeRegex.length &&
      excludeRegexMsg &&
      excludeRegexMsg.length &&
      checkExistExcludeRegex(value, excludeRegex)
    ) {
      return formatMessages({ title, checkedRequireForm, excludeRegexMsg });
    }
  }
}

function viewConfigHandleOnChange(moduleCode, messages, fieldName, fieldValue) {
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
  const column = currentViewConfig.listDisplay.type.fields.type.columns;
  const others = currentViewConfig.listDisplay.type.fields.type.others;
  const checks = { ...column, ...others };
  const newMesages = { ...messages };
  if (fieldName) {
    Object.entries(checks).forEach(([configKey, check]) => {
      if (check.name === fieldName) {
        if (Validate(check, fieldValue)) {
          newMesages[check.name] = Validate(check, fieldValue);
        } else {
          delete newMesages[check.name];
        }
      }
    });
  }
  return newMesages;
}

function viewConfigCheckForm(moduleCode, data) {
  try {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfig.find(n => n.code === moduleCode);
    // const column = currentViewConfig.listDisplay.type.fields.type.columns;
    const others = currentViewConfig.listDisplay.type.fields.type.others;
    const checkForm = currentViewConfig.listDisplay.type.fields.type.columns;
    const checks = { ...others, ...checkForm };

    let messages = {};
    if (checks && data) {
      Object.entries(checks).forEach(([configKey, check]) => {
        messages[check.name] = Validate(check, data[check.name]);
        // Object.entries(data).forEach(([dataKey, dataValue]) => {
        //   if (check.name === dataKey) {
        //     if (Validate(check, dataValue)) messages[check.name] = Validate(check, dataValue);
        //   }
        // });
      });
    }

    return messages;
  } catch (error) {
    return {};
  }
}

function convertStrToSlug(str) {
  // Lấy text từ thẻ input title
  let slug;
  // Đổi chữ hoa thành chữ thường
  slug = str.toLowerCase();

  // Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  // Xóa các ký tự đặt biệt
  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  // Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, ' - ');
  // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');
  // Xóa các ký tự gạch ngang ở đầu và cuối
  slug = `@${slug}@`;
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');
  // In slug ra textbox có id “slug”
  return slug;
}
function convertString(str) {
  // Lấy text từ thẻ input title
  let newString;
  // Đổi chữ hoa thành chữ thường
  newString = str.toLowerCase();
  // Đổi ký tự có dấu thành không dấu
  newString = newString.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  newString = newString.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  newString = newString.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  newString = newString.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  newString = newString.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  newString = newString.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  newString = newString.replace(/đ/gi, 'd');
  newString = newString.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  newString = newString.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  newString = newString.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  newString = newString.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  newString = newString.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  newString = newString.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  newString = newString.replace(/Đ/g, 'D');
  // Xóa các ký tự đặt biệt
  newString = newString.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  // Gộp nhiều dấu space thành 1 space
  newString = newString.replace(/\s+/g, ' ');
  // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của xâu
  newString.trim();
  // In newString ra textbox có id “newString”
  return newString;
}
function convertString1(str) {
  if (typeof str !== 'string' || !str) return '';
  // Lấy text từ thẻ input title
  let newString;
  // Đổi chữ hoa thành chữ thường
  newString = str.toLowerCase();
  // Đổi ký tự có dấu thành không dấu
  newString = newString.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  newString = newString.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  newString = newString.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  newString = newString.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  newString = newString.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  newString = newString.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  newString = newString.replace(/đ/gi, 'd');
  // Gộp nhiều dấu space thành 1 space
  newString = newString.replace(/\s+/g, ' ');
  // loại bỏ toàn bộ dấu space (nếu có) ở 2 đầu của xâu
  newString.trim();
  // In newString ra textbox có id “newString”
  return newString;
}
function formatNumber(num) {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  return 0;
}
function getDataI18N(scope, data) {
  const listObjectKey = Object.keys(data);
  const resultDataI18N = {};
  listObjectKey.map(item => (resultDataI18N[item.replace(`${scope}.`, '')] = { id: item, defaultMessage: item }));
  return resultDataI18N;
}
function getLogString(oldData, newData, code, kanban) {
  const contentArr = [];
  if (String(oldData.name) !== String(newData.name)) {
    contentArr.push({ old: oldData.name, new: newData.name });
  }
  if (oldData.customer && newData.customer && String(oldData.customer.customerId) !== String(newData.customer.customerId)) {
    contentArr.push({ old: oldData.customer.name, new: newData.customer.name });
  }
  if (oldData.value && newData.value && Number(oldData.value.amount) !== Number(newData.value.amount)) {
    contentArr.push({
      old: `${formatNumber(oldData.value.amount)} ${oldData.value.currencyUnit}`,
      new: `${formatNumber(newData.value.amount)} ${newData.value.currencyUnit}`,
    });
  }
  if (
    oldData.responsibilityPerson &&
    newData.responsibilityPerson &&
    String(oldData.responsibilityPerson.employeeId) !== String(newData.responsibilityPerson.employeeId)
  ) {
    contentArr.push({ old: oldData.responsibilityPerson.name, new: newData.responsibilityPerson.name });
  }
  if (oldData.supervisor && newData.supervisor && String(oldData.supervisor.employeeId) !== String(newData.supervisor.employeeId)) {
    contentArr.push({ old: oldData.supervisor.name, new: newData.supervisor.name });
  }
  if (String(oldData.kanbanStatus) !== String(newData.kanbanStatus)) {
    // console.log('xxx');
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => String(d.code) === String(code))];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus.data.forEach(item => {
      switch (item.code) {
        case 1:
          laneStart.push(item);
          break;
        case 2:
          laneAdd.push(item);
          break;

        case 3:
          laneSucces.push(item);
          break;

        case 4:
          laneFail.push(item);
          break;

        default:
          break;
      }
    });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    let old = '';
    let newKan = '';
    let oldKanban = '';

    if (kanban) {
      oldKanban = sortedKanbanStatus.find(x => String(x.type) === String(oldData.kanbanStatus));
    } else {
      oldKanban = sortedKanbanStatus.find(x => String(x._id) === String(oldData.kanbanStatus));
    }

    if (oldKanban) {
      old = oldKanban.name;
    } else {
      old = 'Trạng thái kanban đã xóa';
    }
    let newKanban;
    if (kanban) {
      newKanban = sortedKanbanStatus.find(x => String(x.type) === String(newData.kanbanStatus));
    } else {
      newKanban = sortedKanbanStatus.find(x => String(x._id) === String(newData.kanbanStatus));
    }
    if (newKanban) {
      newKan = newKanban.name;
    } else {
      newKan = 'Trạng thái kanban đã xóa';
    }
    contentArr.push({ old, new: newKan });
  }
  const content = `<div><span style="font-size: 13px;">${
    code === 'ST01' ? 'Cập nhật cơ hội kinh doanh' : code === 'ST03' ? 'Cập nhật trao đổi thỏa thuận' : 'Cập nhật công văn'
  }</span><ul style="margin-top: 8px">${contentArr.map(item => {
    const str = `<li><b>${item.old}</b> thành <b>${item.new}</b></li>`;
    return str;
  })}</ul></div>`;
  return content;
}

function getDescendantProp(obj, desc) {
  if (!desc) {
    return '';
  }
  const arr = desc.split('.');
  // eslint-disable-next-line no-cond-assign
  while (
    arr.length &&
    // eslint-disable-next-line no-param-reassign
    (obj = obj[arr.shift()])
  );
  return obj;
}

function generateTimekeepingData(month, year) {
  const endDate = moment()
    .set('year', year)
    .set('month', month)
    .endOf('month')
    .date();
  const results = [];
  let day = 0;
  while (day < endDate) {
    results.push({
      date: moment()
        .set('year', year)
        .set('month', month)
        .startOf('month')
        .add(day, 'day')
        .startOf('day'),
    });
    day += 1;
  }
  // console.log('result', results);
  return results;
}

function getCurrentUrl() {
  const res = window.location.pathname.split('/');
  return res[res.length - 1];
}

function getDataFile() {
  // const form = new FormData();
  //           form.append('fileUpload', data[0]);
  //           const head = {
  //             method: 'POST',
  //             headers: {
  //               Authorization: `Bearer ${localStorage.getItem('token_03')}`,
  //             },
  //             body: form,
  //           };
  //           const codeFileDoc = data.nameData === 'duthao' ? "OutGoingDocument-fileDocs" : 'OutGoingDocument-files';
  //           const url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=OutGoingDocument&mid=${_id}&mname=${documentType}&fname=root&ftype=0`;
  //           fetch(url, head)
  //             .then(res => res.json())
  //             .then(firstRes => {
  //               if (data[`${data.nameData }`]) {
  //                 const head = {
  //                   method: 'POST',
  //                   headers: {
  //                     Authorization: `Bearer ${localStorage.getItem('token_03')}`,
  //                   },
  //                 };
  //                 let urlFile = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&mid=${_id}&mname=${documentType}&ftype=1`
  //                 let urlData = `${API_GOING_DOCUMENT}/${_id}`
  //                 if (data[`${data.nameData }`].length >= 1) {
  //                   uploadFileGo(data[`${data.nameData }`], urlFile, urlData, head, codeFileDoc, data.nameData, tasks, cb, request, firstRes)
  //                 }
  //               }
  //               else {
  //                 const files = [];
  //                 files.push({
  //                   id: firstRes.data[0]._id,
  //                   name: firstRes.data[0].name,
  //                 });
  //                 return request(`${API_GOING_DOCUMENT}/${_id}`, {
  //                   headers: {
  //                     Authorization: `Bearer ${token}`,
  //                     'Content-Type': 'application/json',
  //                   },
  //                   method: 'PUT',
  //                   body: JSON.stringify({ files }),
  //                 }).then(ok => {
  //                   cb && cb(res._id);
  //                 });
  //               }
  //             });
}

function getFileData(data, url, code, fname, type, files = [], docFiles = [], dataAll, promises) {
  const form = new FormData();
  form.append('fileUpload', data);
  const head = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token_03')}`,
    },
    body: form,
  };

  fetch(`${url} &code=${code}&fname=${fname}&ftype=${type}`, head)
    .then(res => res.json())
    .then(firstRes => {
      if (promises) {
        const data = {
          name: firstRes.data[0].name,
          id: firstRes.data[0]._id,
        };
        promises.push(data);
        return promises;
      }
      if (dataAll.duthao) {
        const data = {
          name: firstRes.data[0].name,
          id: firstRes.data[0]._id,
        };
        files.push(data);
        return files;
      } else {
        const data = {
          name: firstRes.data[0].name,
          id: firstRes.data[0]._id,
        };
        docFiles.push(data);
        return docFiles;
      }
    });
}

function uploadFileGo(data, urlFile, urlData, head, codeFileDoc, name, task, cb, request, firstRes) {
  for (let i = 0; i < data.length; i += 1) {
    const form = new FormData();
    form.append('fileUpload', data[i]);
    const headN = Object.assign(head, { body: form });
    task.push(fetch(`${urlFile}&code=${codeFileDoc}&fname=${name}`, headN).then(res => res.json()));
  }
  task.length > 0 &&
    Promise.all(task)
      .then(res => {
        const filesDocument = res
          .map(r => {
            if (r && r.data && r.data[0]) {
              return {
                id: r.data[0]._id,
                name: r.data[0].name,
              };
            }
            return null;
          })
          .filter(r => r);
        filesDocument.push({
          id: firstRes.data[0]._id,
          name: firstRes.data[0].name,
        });
        return request(urlData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify({ filesDocument }),
        }).then(ok => {
          cb && cb(res._id);
        });
      })
      .catch(error => {
        alert(error.message);
      });
}
function uploadFileGo1(data, urlFile, urlData, head, codeFileDoc, name, task, request, firstRes, oldFile) {
  // console.log(data, urlFile, urlData, head, codeFileDoc, name, task, request, firstRes, oldFile)
  if (firstRes.data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      const form = new FormData();
      form.append('fileUpload', data[i]);
      const headN = Object.assign(head, { body: form });
      task.push(fetch(`${urlFile}&code=${codeFileDoc}&fname=${name}`, headN).then(res => res.json()));
    }
    task.length > 0 &&
      Promise.all(task).then(res => {
        // console.log(res, 'resresresres')
        const filesDocument = res
          .map(r => {
            if (r && r.data && r.data[0]) {
              return {
                id: r.data[0]._id,
                name: r.data[0].name,
              };
            }
            return null;
          })
          .filter(r => r);
        filesDocument.push({
          id: firstRes.data[0]._id,
          name: firstRes.data[0].name,
        });

        return filesDocument;
      });
  } else {
    return [];
  }
}

function uploadFile(data, urlUpload, urlData, tasks, request, cb) {
  if (data.length) {
    const form = new FormData();
    form.append('fileUpload', data[0]);
    const head = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
      },
      body: form,
    };
    fetch(urlUpload, head)
      .then(res => res.json())
      .then(firstRes => {
        if (data.length > 1) {
          for (let i = 1; i < data.length; i += 1) {
            const form = new FormData();
            form.append('fileUpload', data[i]);
            const head = {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token_03')}`,
              },
              body: form,
            };

            tasks.push(fetch(urlUpload, head).then(res => res.json()));
          }
          Promise.all(tasks)
            .then(res => {
              const files = res
                .map(r => {
                  if (r && r.data && r.data[0]) {
                    return {
                      id: r.data[0]._id,
                      name: r.data[0].name,
                    };
                  }
                  return null;
                })
                .filter(r => r);
              files.push({
                id: firstRes.data[0]._id,
                name: firstRes.data[0].name,
              });
              return request(urlData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify({ files }),
              }).then(ok => {
                cb && cb(res._id);
              });
            })
            .catch(console.log);
        } else {
          const files = [];
          files.push({
            id: firstRes.data[0]._id,
            name: firstRes.data[0].name,
          });
          return request(urlData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify({ files }),
          }).then(ok => {
            cb && cb(res._id);
          });
        }
      })
      .catch(error => {
        alert(error.message);
      });
  }
}

function getHost() {
  const res = window.location.pathname.split('/');
  return res[0];
}

function getUserRole(roles, modules, clientId) {
  return Object.keys(modules).map(item => {
    if (Array.isArray(roles)) {
      const currentRole = roles.find(cuRole => cuRole.codeModleFunction === item);
      if (currentRole) {
        return currentRole;
      }
    }
    return {
      titleFunction: modules[item].title,
      codeModleFunction: item,
      clientId,
      methods: [
        {
          name: 'GET',
          allow: false,
        },
        {
          name: 'POST',
          allow: false,
        },
        {
          name: 'PUT',
          allow: false,
        },
        {
          name: 'DELETE',
          allow: false,
        },
        {
          name: 'EXPORT',
          allow: false,
        },
        {
          name: 'IMPORT',
          allow: false,
        },
        {
          name: 'VIEWCONFIG',
          allow: false,
        },
      ],
    };
  });
}

function spreadObjectLv1(item) {
  const result = { ...item };

  Object.keys(item).forEach(key => {
    if (typeof item[key] === 'object' && item[key] !== null && !Array.isArray(item[key])) {
      Object.keys(item[key]).forEach(childKey => {
        result[`${key}.${childKey}`] = item[key][childKey];
      });
    }
  });
  return result;
}

function getAlternativeSortColumn(oldSort, columnConfigs) {
  if (!oldSort || !Object.keys(oldSort) || !Array.isArray(columnConfigs) || !columnConfigs.length) return oldSort;
  const foundAltColumn = columnConfigs.find(column => oldSort[column.columnName] && column.alternativeSortColumnName);
  if (!foundAltColumn) return oldSort;
  return { [foundAltColumn.alternativeSortColumnName]: oldSort[foundAltColumn.columnName] };
}

function canUpdateTaskPlan(task, user) {
  if (!task || task.planApproval !== 1 || !task.planApprovalUsers || !task.planApprovalUsers.length) return true;
  if (user && user.userId && task.planApprovalUsers.includes(user.userId)) {
    return true;
  }
  return false;
}

function parseTask(addProjects) {
  const data = {
    ...addProjects,
    customer: addProjects.customer ? addProjects.customer._id : null,
    viewable: addProjects.viewable ? addProjects.viewable.map(item => item._id) : [],
    inCharge: addProjects.inCharge ? addProjects.inCharge.map(item => item._id) : [],
    taskManager: addProjects.taskManager ? addProjects.taskManager.map(item => item._id) : [],
    approved: addProjects.approved ? addProjects.approved.map(item => ({ id: item.id ? item.id : item._id, name: item.name })) : [],
    support: addProjects.support ? addProjects.support.map(item => item._id) : [],
    join: addProjects.join ? addProjects.join.map(item => item._id) : [],
  };

  return data;
}

function calAttributes(dataSource, attributes = []) {
  const results = {
    ...dataSource,
  };
  // console.log('results', results)
  const formatCurrency = number => {
    const newNumber = number && Number(number);
    if (typeof newNumber === 'number') {
      return newNumber.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return number;
  };
  const newData = {};
  attributes.forEach(att => {
    if (!att.formula) {
      newData[att.code] = {
        name: att.name,
        value: results[att.code],
        code: att.code,
      };
    } else {
      let formula = att.formula;
      Object.keys(newData).map(it => {
        formula = formula.replaceAll(`($${it})`, newData[it].value);
      });

      // tim nhung code khong ton tai trong cong thuc tinh = 0
      const rex = /\(\$[\d\w\b]*\)/g;
      const arrFormula = formula.match(rex);
      if (Array.isArray(arrFormula) && arrFormula.length) {
        arrFormula.forEach(item => {
          formula = formula.replaceAll(item, 0);
        });
      }
      // tinh toan
      const result = parser.parse(`${formula}`);

      newData[att.code] = {
        name: att.name,
        value: result.result || 0,
        formula: att.formula,
        code: att.code,
      };
    }
  });
  Object.keys(newData).map(key => {
    newData[key].value = formatCurrency(newData[key].value);
  });

  return newData;
}

function addColumnNameToGroup(list, paths, columnName) {
  if (!paths || !paths.length) return;
  if (paths.length === 1) {
    const foundNode = list.find(l => l.title === paths[0]);
    if (foundNode) {
      if (!foundNode.children) {
        foundNode.children = [];
      }
      foundNode.children.push({ columnName });
    } else {
      list.push({
        title: paths[0],
        children: [
          {
            columnName,
          },
        ],
      });
    }
  }
  if (paths.length === 2) {
    let foundNode = list.find(l => l.title === paths[0]);
    if (foundNode) {
      if (!foundNode.children) {
        foundNode.children = [];
      }
      // foundNode.children.push({ columnName });
    } else {
      list.push({
        title: paths[0],
        children: [],
      });
      foundNode = list[list.length - 1];
    }

    const foundChildNode = foundNode.children.find(l => l.title === paths[1]);
    if (foundChildNode) {
      if (!foundChildNode.children) {
        foundChildNode.children = [];
      }
      foundChildNode.children.push({ columnName });
    } else {
      foundNode.children.push({
        title: paths[1],
        children: [
          {
            columnName,
          },
        ],
      });
    }
  }
}

function buildColumnBands(columns) {
  const results = [];
  columns.forEach(c => {
    if (!c.groupName) return;
    const paths = c.groupName.split('/');
    addColumnNameToGroup(results, paths, c.name);
  });
  return results;
}

function delSpace(object) {
  if (object) {
    Object.keys(object).forEach(key => {
      if (typeof object[key] === 'undefined' || object[key] === null) return;
      if (typeof object[key] === 'string') {
        const a = object[key].trim();
        object[key] = a;
      } else if (typeof object[key] === 'object') {
        delSpace(object[key]);
      }
    });
  }
  return object;
}

function convertBody(body, code) {
  const result = {};
  Object.keys(body).forEach(key => {
    if (typeof body[key] === 'string') {
      result[key] = body[key].trim();
      return;
    }
    if (Array.isArray(body[key]) && typeof body[key][0] === 'string') {
      result[key] = body[key];
      return;
    }
    if (
      (typeof body[key] === 'object' && key === 'sendingMan') ||
      (typeof body[key] === 'object' && key === 'signer') ||
      (typeof body[key] === 'object' && key === 'receiver')
    ) {
      result[key] = body[key];
      return;
    }
    if (typeof body[key] === 'object' && key === 'drafter') {
      result[key] = body[key];
      return;
    }
    if (typeof body[key] === 'object' && key === 'others') {
      result[key] = body[key];
      return;
    }
    if (key.toLowerCase().includes('date') || key === 'deadline' || key === 'timeStart' || key === 'timeEnd') {
      result[key] = body[key];
      return;
    }
    if (key === 'incommingDocument' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'outGoingDocuments' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'listTaskRemoved' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'recipientIds' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'tasks' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'taskAttached' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'viewers' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'viewers' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'answer4doc' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'task' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'people' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'organizer' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'dataIncoming' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'dataTask' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'incommingDocuments' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (key === 'processors' && Array.isArray(body[key])) {
      result[key] = body[key];
      return;
    }
    if (!body[key]) {
      return (result[key] = body[key]);
    }
    result[key] =
      typeof body[key] === 'object'
        ? (key === 'signer' || key === 'roomMetting') && body[key]
          ? body[key]._id
          : body[key].value || body[key].type
        : body[key];
  });

  return result;
}

async function getListData(url, filter = {}, onChangeSnackbar) {
  try {
    const queryString = serialize({ filter });
    const res = await fetch(`${url}?${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(response => response.json());
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) {
      return res.data;
    }
    if (res && typeof res.data == 'object') {
      return res.data;
    }
    console.log(res, " res res nè ")
    if(!res.status && onChangeSnackbar && typeof onChangeSnackbar === 'function'){
      onChangeSnackbar({ variant: 'error', message:res.message ||  'Thao tác thất bại', status: true });
    }
    return [];
  } catch (error) {
    return [];
  }
}

function toDataUrl(url, name, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    const file = new File([xhr.response], name);
    callback(file);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

const testAvatar = (avatar, resolve, reject) => {
  if (typeof avatar !== 'string') {
    reject();
    return;
  }

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      xhr.status === 200 ? resolve() : reject();
    }
  };
  xhr.open('GET', avatar);
  xhr.send(null);
};

const checkAvatar = avatar => {
  if (typeof avatar === 'string' && (avatar.includes('?allowDefault=true') || avatar)) {
    return `${avatar}?allowDefault=true`;
  }
  return avatarDefault;
};

function CheckImage(img) {
  fetch(img, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data && data.message === 'Not Found') {
        return (img = avatarDefault);
      } else {
        return img;
      }
    });
}

const closeWebsocket = socket => {
  if (!socket) return;
  socket.onclose = () => {};
  socket.close();
};

module.exports = {
  serialize,
  uploadFile,
  convertDatetimeToDate,
  inorgesign,
  getLabelName,
  getDataFile,
  convertTemplate,
  convertStrToSlug,
  formatNumber,
  convertDatetimeToDateForTextField,
  getDataI18N,
  getLogString,
  convertString,
  viewConfigCheckShowForm,
  viewConfigShowLabel,
  getDescendantProp,
  convertString1,
  getCurrentUrl,
  getUserRole,
  uploadFileGo1,
  spreadObjectLv1,
  viewConfigName2Title,
  getFileData,
  convertDatetime2Date,
  viewConfigCheckForm,
  viewConfigCheckRequired,
  viewConfigHandleOnChange,
  getAlternativeSortColumn,
  generateTimekeepingData,
  canUpdateTaskPlan,
  parseTask,
  calAttributes,
  uploadFileGo,
  buildColumnBands,
  clearWidthSpace,
  delSpace,
  getHost,
  removeVietnameseTones,
  convertBody,
  getListData,
  toDataUrl,
  checkAvatar,
  testAvatar,
  CheckImage,
  closeWebsocket,
  checkExistHtml,
  checkExistHtmlAndNoString
};
