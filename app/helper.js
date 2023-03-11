/* eslint-disable eqeqeq */
/* eslint-disable no-unreachable */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import dot from 'dot-object';
import { extraFields } from './variable';
import {
  API_TEMPLATE,
  API_COMMON,
  API_CUSTOMERS,
  API_TASK_PROJECT,
  API_USERS,
  API_STOCK,
  API_SALE,
  API_INCOMMING_DOCUMENT,
  API_GOING_DOCUMENT,
} from './config/urlConfig';
import { EXPORT_FILE_NAME } from './contants';
import moment from 'moment';
import { getCurrentUrl } from './utils/common';
import XLSX from 'xlsx';

export async function convertTemplate({ content, data, code, codeTemplate }) {
  try {
    // content.replace(regex, rep);
    let newData = dot.object(data);
    newData = convertDot({ ob: data, newOb: data });
    const result = [];
    let extra = [];
    const extraField = extraFields.find(i => i.code === code);
    if (extraField) extra = extraField.data;
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    function getName(codeName, refName) {
      const list = viewConfig.find(item => item.code === codeName);
      if (list) {
        list.listDisplay.type.fields.type.columns.forEach(item => {
          const newItem = { ...item, name: `${refName}.${item.name}` };
          result.push(newItem);
        });

        list.listDisplay.type.fields.type.others.forEach(item => {
          const newItem = { ...item, name: `${refName}.${item.name}` };
          result.push(newItem);
        });
      }
    }
    const viewFind = viewConfig.find(item => item.code === code).listDisplay.type.fields.type;
    const codes = [...viewFind.columns, ...viewFind.others];
    const crmSource = _.keyBy(JSON.parse(localStorage.getItem('crmSource')), '_id');
    codes.forEach(item => {
      if (item.type.includes('ObjectId')) {
        const ref = item.type.substring(9);
        getName(ref, item.name);
      } else if (item.type.includes('Relation')) {
        const ref = item.type.split("'")[3];
        getName(ref, item.name);
      } else if (item.type.includes('Array')) {
        // eslint-disable-next-line no-useless-escape
        const replaceArr = `<tr>(?:(?!<tr>|<\/tr>).)*?{${item.name}}(?:(?!<tr>|<\/tr>).)*?<\/tr>`;
        const regexArr = new RegExp(replaceArr, 'gs');
        const found = content.match(regexArr);
        if (found) {
          found.forEach(i => {
            content = findReplaceArr({ arrName: item.name, content, arrItems: item.type, data: newData[item.name], dataReplace: i });
          });
        }
      } else if (item.type.length === 24 || item.type.length === 33) {
        if (crmSource[item.type]) {
          if (crmSource[item.type].data) {
            const foundItem = crmSource[item.type].data.find(i => i.value === newData[item.name]);
            if (foundItem) {
              newData[item.name] = foundItem.title;
            }
          }
        } else {
          let newCrmSource = _.keyBy(JSON.parse(localStorage.getItem('crmSource')), 'code');
          if (newCrmSource[item.configCode] && newCrmSource[item.configCode].data) {
            const foundItem = newCrmSource[item.configCode].data.find(i => i.value === newData[item.name]);
            if (foundItem) {
              newData[item.name] = foundItem.title;
              newData['documentDate'] = moment(newData.receiveDate, 'YYYY/MM/DD').format('DD/MM/YYYY');
              newData['toBookDate'] = moment(newData.toBookDate, 'YYYY/MM/DD').format('DD/MM/YYYY');
            }
          }
        }
      }
    });

    async function replaceExtra() {
      for (const item of extra) {
        const replace = `{${item.name}}`;
        const regex = new RegExp(replace, 'gs');
        const rep = await item.function(newData);
        content = content.replace(regex, rep);
      }
    }

    content = findCal({ content, data: newData });
    const newResult = result.concat(codes);
    newResult.forEach(item => {
      const replace = `{${item.name}}`;
      const regex = new RegExp(replace, 'gs');
      const rep = newData[item.name] ? newData[item.name] : '';
      content = content.replace(regex, rep);
    });
    await replaceExtra();
    return content;
  } catch (error) {
    console.log(error, 'errorerror')
  }
}

function findReplaceArr({ content, arrItems, data, arrName, dataReplace }) {
  if (!data) return content;
  // eslint-disable-next-line no-useless-escape
  let newReplace = '';
  const listItems = arrItems.split('|');
  if (!listItems[1]) return content;
  const items = listItems[1].split(',');
  if (items) {
    data.forEach((ele, index) => {
      let replace = dataReplace;
      replace = findCal({ content: replace, data: ele });
      replace = replace.replace(`{${arrName}}`, index + 1);
      items.forEach(e => {
        const regex = `{${e}}`;
        replace = replace.replace(regex, ele[e]);
      });
      newReplace = `${newReplace}${replace}`;
    });
    return content.replace(dataReplace, newReplace);
  }

  return content;
}

function formula(fn) {
  // eslint-disable-next-line no-new-func
  return new Function(`return ${fn}`)();
}

function findCal({ content, data }) {
  const rex = /CAL\[(?!\]).*?\]/g;
  const found = content.match(rex);

  if (!found) return content;
  found.forEach(item => {
    let newCt = item;
    Object.keys(data).forEach(pro => {
      console.log(pro);
      const reg = `{${pro}}`;
      const reg1 = new RegExp(reg, 'g');
      newCt = newCt.replace(reg1, data[pro]);
    });
    newCt = newCt.substring(4, newCt.length - 1);
    try {
      newCt = formula(newCt);
    } catch (error) {
      // console.log(error);
      newCt = '';
    }

    content = content.replace(item, newCt);
  });
  return content;
}

export function isArray(value) {
  return value && typeof value === 'object' && value.constructor === Array;
}

export function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

export function tableToPDF(id, code, fileName = 'PDF') {
  console.log("export pdf")
  const sTable = document.getElementById(id).innerHTML;

  const listName = EXPORT_FILE_NAME;
  if (listName[id]) fileName = listName[id];
  try {
    const allModules = JSON.parse(localStorage.getItem('allModules'));
    if (allModules[code] && allModules[code].title) {
      fileName = allModules[code].title;
    }
  } catch (e) {
    console.log('e', e);
  }
  if (getCurrentUrl() === 'inComingDocument') {
    fileName = 'Công văn đến';
  }
  if (getCurrentUrl() === 'outGoingDocument') {
    fileName = 'Công văn đi';
  }

  const style = `<style>
      table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
      }

      td,
      th {
        word-wrap: break-word;
        max-width: 100px;
        min-width: 40px;
        border: 1px solid #dddddd;
        min-height: 100px;
        padding: 8px;
    }

   
  </style>`;

  // CREATE A WINDOW OBJECT.
  // var win = window.open('', '', 'height=700,width=700');
  // var win = window.open(`${pageNumber}`);

  let html = '<!DOCTYPE html><html><head>';
  html += `<title>${fileName}</title>`;
  html += style;
  html += '</head>';
  html += '<body>';
  html += `<h2 style="text-align:center">${fileName}</h2>`;
  html += sTable;
  html += '</body></html>';

  const removeContext = 'tfoot';
  if (html.includes(removeContext)) {
    const start = html.indexOf(`<${removeContext}>`);
    const end = html.indexOf(`</${removeContext}>`);
    html = `${html.substr(0, start)}${html.substr(end + removeContext.length + 3)}`;
  }

  return html;
}

export function tableToExcel(id, n, code, fileName = 'download') {
  const listName = EXPORT_FILE_NAME;
  if (listName[id]) fileName = listName[id];
  try {
    const allModules = JSON.parse(localStorage.getItem('allModules'));
    if (allModules[code] && allModules[code].title) {
      fileName = allModules[code].title;
    }
  } catch (e) {
    console.log('e', e);
  }
  if (getCurrentUrl() === 'inComingDocument') {
    fileName = 'Công văn đến';
  }
  if (getCurrentUrl() === 'outGoingDocument') {
    fileName = 'Công văn đi';
  }
  const uri = 'data:application/vnd.ms-excel;base64,';
  const template = `<html 
    xmlns:o="urn:schemas-microsoft-com:office:office" 
    xmlns:x="urn:schemas-microsoft-com:office:excel" 
    xmlns="http://www.w3.org/TR/REC-html40">
    <head>
    <!--[if gte mso 9]>
    <xml>
    <x:ExcelWorkbook>
    <x:ExcelWorksheets>
    <x:ExcelWorksheet>
    <x:Name>{worksheet}</x:Name>
    <x:WorksheetOptions>
    <x:DisplayGridlines/>
    </x:WorksheetOptions>
    </x:ExcelWorksheet>
    </x:ExcelWorksheets>
    </x:ExcelWorkbook></xml>
    <![endif]-->
    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    </head><body>
        ${fileName.trim() && fileName !== 'download'
      ? `<table>
          <body>
            <tr rowspan='1'>
              <td></td>
              <td></td>
              <td colspan='5'><h3>${fileName}<h3></td>
            </tr>
          </body>
        </table><br/>`
      : ''
    }
        {table}
    </body></html>`;

  function base64(s) {
    return window.btoa(unescape(encodeURIComponent(s)));
  }

  function format(s, c) {
    return s.replace(/{(\w+)}/g, (m, p) => c[p]);
  }

  function getHtml(table) {
    if (!table.nodeType) table = document.getElementById(table);
    table = table.innerHTML;
    table = table.split('<tfoot>');
    // table[0] = table[0].replaceAll('<td>', '<td>="')
    // table[0] = table[0].replaceAll('</td>', '"</td>')
    table = table.join('<tfoot>');
    return table;
  }

  function print(table, name) {
    table = getHtml(table);
    const ctx = { worksheet: name || 'Worksheet', table };
    // window.location.href = uri + base64(format(template, ctx));
    const a = document.createElement('a');
    a.href = uri + base64(format(template, ctx));
    a.download = `${fileName}.xls`;
    a.click();
  }
  print(id, n);
}
export function tableToExcelCustom(id, n, code, fileName = 'download', titleCustom, lengthColum) {
  const listName = EXPORT_FILE_NAME;
  if (listName[id]) fileName = listName[id];
  console.log(lengthColum, 'lengthColum');
  try {
    const allModules = JSON.parse(localStorage.getItem('allModules'));
    if (allModules[code] && allModules[code].title) {
      fileName = allModules[code].title;
    }
  } catch (e) {
    console.log('e', e);
  }
  if (getCurrentUrl() === 'inComingDocument') {
    fileName = 'Công văn đến';
  }
  if (getCurrentUrl() === 'outGoingDocument') {
    fileName = 'Công văn đi';
  }
  const uri = 'data:application/vnd.ms-excel;base64,';
  const template = `<html 
    xmlns:o="urn:schemas-microsoft-com:office:office" 
    xmlns:x="urn:schemas-microsoft-com:office:excel" 
    xmlns="http://www.w3.org/TR/REC-html40">
    <head>
    <!--[if gte mso 9]>
    <xml>
    <x:ExcelWorkbook>
    <x:ExcelWorksheets>
    <x:ExcelWorksheet>
    <x:Name>{worksheet}</x:Name>
    <x:WorksheetOptions>
    <x:DisplayGridlines/>
    </x:WorksheetOptions>
    </x:ExcelWorksheet>
    </x:ExcelWorksheets>
    </x:ExcelWorkbook></xml>
    <![endif]-->
    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    </head><body>
        ${fileName.trim() && fileName !== 'download'
      ? `<table>
          <body>
            <tr rowspan='1'>
              <td></td>
              <td></td>
              <td colspan='${lengthColum ? lengthColum : 5}' style="text-align:center"><h3>${titleCustom ? titleCustom + ' ' + fileName : fileName
      }<h3></td>
            </tr>
           
          </body>
        </table><br/>`
      : ''
    }
        {table}
    </body></html>`;

  function base64(s) {
    return window.btoa(unescape(encodeURIComponent(s)));
  }

  function format(s, c) {
    return s.replace(/{(\w+)}/g, (m, p) => c[p]);
  }

  function getHtml(table) {
    if (!table.nodeType) table = document.getElementById(table);

    table = table.innerHTML;
    table = table.split('<tfoot>');
    // table[0] = table[0].replaceAll('<td>', '<td>="')
    // table[0] = table[0].replaceAll('</td>', '"</td>')
    table = table.join('<tfoot>');
    return table;
  }

  function print(table, name) {
    table = getHtml(table);
    const ctx = { worksheet: name || 'Worksheet', table };
    // window.location.href = uri + base64(format(template, ctx));
    const a = document.createElement('a');
    a.href = uri + base64(format(template, ctx));
    a.download = `${fileName}.xls`;
    a.click();
  }
  print(id, n);
}
export function convertDotOther(others) {
  if (!isObject(others)) return {};
  const newOthers = {};
  Object.keys(others).forEach(key => {
    newOthers[key] = isObject(others[key]) ? others[key].title : others[key];
  });
  return newOthers;
}

export function convertDot({ ob, newOb = {}, prefix = false, convertArr = false }) {
  // eslint-disable-next-line no-restricted-syntax
  for (const property in ob) {
    if (isObject(ob[property])) {
      const newPrefix = prefix ? `${prefix}.${property}` : property;
      convertDot({ ob: ob[property], newOb, prefix: newPrefix, convertArr });
    } else if (isArray(ob[property]) && convertArr) {
      const newPrefix = prefix ? `${prefix}.${property}` : property;
      newOb[newPrefix] = ob[property]
        .map(it => (it ? it.name : null))
        .filter(Boolean)
        .join(', ');
    } else if (prefix) newOb[`${prefix}.${property}`] = ob[property];
    else newOb[property] = ob[property];
  }
  // eslint-disable-next-line no-console
  return newOb;
}

export function serialize(obj, prefix) {
  const str = [];
  let p;
  // eslint-disable-next-line no-restricted-syntax
  for (p in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p;
      const v = obj[p] || obj[p] === 0 ? obj[p] : '';
      if (v) {
        str.push(v !== null && typeof v === 'object' ? serialize(v, k) : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
      } else if (v === 0 && p === 'status') {
        str.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
      }
    }
  }
  return str.join('&');
}

// TINH TOAN CHO DU AN
// eslint-disable-next-line consistent-return
export function convertTree(treeData, startDate, prefix = false, result = [], cv = false, joins = [], joinsData = []) {
  treeData.forEach((item, index) => {
    item.startDate = convertDate(startDate);
    item.order = index;
    item.endDate = addDate(startDate, item.duration, item.durationUnit);
    item.parent = prefix || null;
    item.id = prefix ? `${prefix}.${index}` : index;
    item.isSmallest = false;
    const str = item.id.split('.');
    if (str.length > 1) item.kanbanCode = `${str[0]}.${str[1]}`;
    const join = item.join.map(i => i.id);
    joins.push(...join);
    joinsData.push(...item.join);
    const newPre = item.id;
    result.push(item);
    if (item.children && item.children.length) {
      convertTree(item.children, startDate, newPre, result, false, joins, joinsData);
    } else item.isSmallest = true;
  });
  if (cv) {
    makeRootDependent(result);
    const rootDependent = result.filter(i => i.isRoot === true);
    rootDependent.forEach(i => {
      caculeDependent(i, result);
    });
    caculateStartDate(treeData, startDate);
    result.forEach(i => {
      if (i.isSmallest) calculateDate(i, result);
    });
    calculateRatio(prefix, result);

    return { array: result, joins, joinsData };
  }
}

function caculateStartDate(treeData, startDate) {
  treeData.forEach((item, index) => {
    const check = dateDiff(item.startDate, startDate);
    if (check > 0) {
      item.startDate = convertDate(startDate);
      item.endDate = addDate(startDate, item.duration);
    }
    if (item.children && item.children.length) {
      caculateStartDate(item.children, item.startDate);
    }
  });
}
// Tao root dependent
function makeRootDependent(result) {
  result.forEach(item => {
    if (!item.dependent && checkRoot(result, item.idTree)) item.isRoot = true;
  });
}

function caculeDependent(rootDependent, result) {
  const data = result.filter(item => item.dependent === rootDependent.idTree);
  if (data.length) {
    data.forEach(i => {
      i.startDate = rootDependent.endDate;
      i.endDate = addDate(rootDependent.endDate, i.duration);
      caculeDependent(i, result);
    });
  }
}

// Kiem tra phan tu cha
function checkRoot(result, dependent) {
  const length = result.length;
  let check = false;
  for (let index = 0; index < length; index++) {
    const element = result[index];
    if (element.dependent === dependent) {
      check = true;
      break;
    }
  }
  return check;
}

export function convertDate(date = new Date()) {
  return new Date(date);
}

function addDate(date, duration, unit) {
  const newDate = new Date(date);
  let d;
  if (unit === 'hour') {
    d = moment(newDate)
      .add(duration, 'hours')
      .toDate();
  } else {
    d = newDate.setDate(newDate.getDate() + duration * 1);
  }
  const result = new Date(d);
  return convertDate(result);
}

function calculateDate(item, list) {
  let startDate = new Date(item.startDate);
  let endDate = new Date(item.endDate);
  // eslint-disable-next-line eqeqeq
  const listChild = list.filter(i => i.parent == item.parent);

  listChild.forEach(e => {
    const durationUnit = e.durationUnit;
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    e.duration = dateDiff(start, end, durationUnit);
    if (startDate - start > 0) startDate = start;
    if (end - endDate > 0) endDate = end;
  });
  const parent = list.find(i => i.id === item.parent);
  if (parent) {
    parent.startDate = convertDate(startDate);
    parent.endDate = convertDate(endDate);
    parent.duration = dateDiff(startDate, endDate);
    calculateDate(parent, list);
  }
}

function dateDiff(d1, d2, durationUnit) {
  const start = new Date(d1);
  const end = new Date(d2);
  if (durationUnit === 'day') {
    return (end - start) / 86400000;
  } else {
    return (end - start) / 3600000;
  }
}

function calculateRatio(id, list) {
  const listTask = list.filter(i => i.parent === id);
  let totalDay = 0;
  let totalRatio = 100;
  if (!listTask.length) {
    return;
  }
  listTask.forEach(i => {
    totalDay = i.duration * 1 + totalDay;
  });
  totalDay = totalDay || 1;
  // eslint-disable-next-line array-callback-return
  listTask.map((it, d) => {
    const task = list.find(i => it.id === i.id);
    if (d === listTask.length - 1) task.ratio = totalRatio.toFixed(2);
    else {
      task.ratio = (((it.duration * 1) / totalDay) * 100).toFixed(2);
      totalRatio -= task.ratio;
    }
    // eslint-disable-next-line no-mixed-operators
    calculateRatio(it.id, list);
  });
}

// END

export function convert2Money(number) {
  if (number) return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  // eslint-disable-next-line prettier/prettier
  return 0.0;
}

export function flatChild(data =[], list = [], level = 0, open = true, slug = '', expand = false) {
  data.forEach(i => {
    const sl = slug ? `${slug}/${i._id}` : i._id;
    if (i.child && i.child.length) {
      list.push({ name: i._id, title: i.name, access: false, _id: i._id, level, id: i._id, open, parent: i.parent, child: true, slug: sl, expand });
      flatChild(i.child, list, level + 1, false, sl);
    } else {
      list.push({ name: i._id, title: i.name, id: i._id, access: false, _id: i._id, level, open, parent: i.parent, slug: sl, expand });
    }
  });
  return list;
}

export function flatChildCustom(data =[], list = [], level = 0, open = true, slug = '', expand = false) {
  data.forEach(i => {
    const sl = slug ? `${slug}/${i._id}` : i._id;
    if (i.child && i.child.length) {
      list.push({
        name: i._id,
        title: i.name,
        access: false,
        _id: i._id,
        level,
        id: i._id,
        open,
        parent: i.parent,
        child: true,
        slug: sl,
        expand,
        code: i.code,
      });
      flatChildCustom(i.child, list, level + 1, false, sl);
    } else {
      list.push({ name: i._id, title: i.name, id: i._id, access: false, _id: i._id, level, open, parent: i.parent, slug: sl, expand, code: i.code });
    }
  });
  return list;
}

export function flatChildOpen(data =[], list = [], level = 0, open = true, slug = '', expand = true, type) {
  data.forEach(i => {
    const sl = slug ? `${slug}/${i._id}` : i._id;
    if (i.child && i.child.length) {
      list.push({ name: i._id, title: i.name, access: false, _id: i._id, level, id: i._id, open, parent: i.parent, child: true, slug: sl, expand });
      flatChild(i.child, list, level + 1, true, sl, expand);
    } else {
      list.push({ name: i._id, title: i.name, id: i._id, access: false, _id: i._id, level, open, parent: i.parent, slug: sl, expand });
    }
  });
  return list;
}

export function printTemplte(templateId, dataId, moduleCode, isClone = false, templateCode) {
  const templateData = fetchData(`${API_TEMPLATE}/${templateId}`);
  const dataItem = fetchData(`${API_COMMON}/${moduleCode}/${dataId}`);
  Promise.all([templateData, dataItem]).then(result => {
    PrintElem({ content: result[0].content, data: result[1], code: moduleCode, isClone, templateCode });
  });
}

export function workingCalendarTable(templateId, dataItem, moduleCode, isClone = false, datePicker) {
  console.log(templateId, dataItem, moduleCode, isClone, 'templateId, dataItem, moduleCode, isClone')
  if (datePicker)
    localStorage.setItem('datePicker', datePicker);
  try {
    const templateData = fetchData(`${API_TEMPLATE}/${templateId}`);
    Promise.all([templateData, dataItem]).then(result => {
      PrintContentTable({ content: result[0].content, data: result[1], code: moduleCode, isClone });
    });
  } catch (error) {
    console.log(error, 'error')
  }

}

export function printTemplteExcel(templateId, dataId, moduleCode, isClone = false, templateCode) {
  const templateData = fetchData(`${API_TEMPLATE}/${templateId}`);
  const dataItem = fetchData(`${API_COMMON}/${moduleCode}/${dataId}`);
  Promise.all([templateData, dataItem]).then(result => {
    PrintElemExcel({ content: result[0].content, data: result[1], code: moduleCode, isClone, templateCode });
  });
}

export async function getDataBeforeSend({ templateId, dataId, moduleCode, isClone = false }) {
  const templateData = fetchData(`${API_TEMPLATE}/${templateId}`);
  const dataItem = fetchData(`${API_COMMON}/${moduleCode}/${dataId}`);
  const result = await Promise.all([templateData, dataItem]);
  return convertTemplate({ content: result[0].content, data: result[1], code: moduleCode });
}

async function apiCloneModule(data, moduleCode) {
  const listApi = [];
  const listName = [];

  const viewConfig = JSON.parse(localStorage.getItem('viewConfig')).find(i => i.code === moduleCode);
  if (viewConfig) {
    const list = viewConfig.listDisplay.type.fields.type.columns.filter(i => i.type.includes('Relation'));
    list.forEach(i => {
      if (data[i.name]) {
        const code = i.type.split("'")[3];
        const api = fetchData(`${API_COMMON}/${code}/${data[i.name]}`);
        listApi.push(api);
        listName.push(i.name);
      }
    });
  }
  if (listApi.length) {
    const dataList = await Promise.all(listApi);

    listName.forEach((item, index) => {
      data[item] = dataList[index];
    });
  }

  return data;
}

export function contentTable({ data }) {
  let dayOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', ' Thứ Bảy', 'Chủ Nhật'];
  let pickers = moment(localStorage.getItem('datePicker')).format('YYYY/MM/DD');
  const getTypeCalendar = (id) => {
    const dataSource = JSON.parse(localStorage.getItem('crmSource'));
    const dataValSource = dataSource && dataSource.find(item => item.code === 'S600');
    const typeCalendar = (dataValSource && dataValSource.data.find(i => i._id === id));
    return typeCalendar ? `(${typeCalendar.title})` : ' '
  }


  // ${element.addressMeet ? ' . Địa điểm: ' + element.addressMeet + element.preparedBy ? `(Đơn vị chuẩn bị, ghi chú: ${element.preparedBy})` : '' : element.preparedBy ? `(Đơn vị chuẩn bị, ghi chú: ${element.preparedBy})` : ''}</p>

  let html = `
  <table style="width: calc(100vw - 30px)" border="1" ">
    <tbody>
      ${dayOfWeek.map(
    (item, index) =>
      `<tr>
            <td style="text-align: center" width="80" rowspan="2">
                ${item}<br />${moment(pickers)
        .startOf('weeks')
        .add(index, 'days')
        .format('DD/MM')}
            </td>
            ${`<td width="50" style="text-align: center">Sáng</td>`}
            <td style="padding: 5px">
              ${Array.isArray(data) &&
      _.sortBy(data, ['timeMeet']).map((element, idx) => {
        if (
          moment(pickers)
            .startOf('week')
            .add(index, 'days')
            .isSame(moment(element.time).format('YYYY/MM/DD')) &&
          (element.timeMeet && parseInt(element.timeMeet.slice(0, 3)) < 12)
        ) {
          return `
                      <p style="margin: 3px 0px" >${getTypeCalendar(element.typeCalendar)} 
                      <span style="font-weight: bold" >${element.timeMeet
              ? element.timeMeet.slice(0, 5) : ' '}</span>: 
                        ${element.contentMeet ? element.contentMeet : ''}${element.join ? '. Thành phần: ' + element.join : ''}${element.addressMeet ? '. Địa điểm: ' + element.addressMeet : ''}${element.preparedBy ? `. (${element.preparedBy})` : ''} `;
        } else {
          return `<p></p>`;
        }
      })}
            </td>
			      <tr>
				      ${`<td width="50" style="background-color: rgb(125, 120, 120) !important; text-align: center" >Chiều</td>`}
	      		  <td style="padding: 5px">
                ${Array.isArray(data) &&
      _.sortBy(data, ['timeMeet']).map((element, idx) => {
        if (
          moment(pickers)
            .startOf('week')
            .add(index, 'days')
            .isSame(moment(element.time).format('YYYY/MM/DD')) &&
          (element.timeMeet && parseInt(element.timeMeet.slice(0, 3)) >= 12)
        ) {
          return `
          <p style="margin: 3px 0px" >${getTypeCalendar(element.typeCalendar)} 
          <span style="font-weight: bold" >${element.timeMeet
              ? element.timeMeet.slice(0, 5) : ' '}</span>: 
            ${element.contentMeet ? element.contentMeet : ''}${element.join ? '. Thành phần: ' + element.join : ''}${element.addressMeet ? '. Địa điểm: ' + element.addressMeet : ''}${element.preparedBy ? `. (${element.preparedBy})` : ''}`;
        } else {
          return `<p></p>`;
        }
      })}
                </td>
		  	    </tr>
          </tr>
          `,
  )}
    </tbody>
  </table>`;

  return html;
}



export function contentTableBook({ data = [] }) {
  let html = `
  <table style="border-collapse: collapse; width: 95%;margin: 0 auto;">
                    <thead class="">
                        <tr>
                            <th style="width: 1%;border: 1px solid black;background-color: grey;">STT</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Số, ký hiệu ban hành</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Ngày tháng VB</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Trích yếu nội dung</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Độ mật văn bản</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Người ký</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Nơi nhận văn bản</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Đơn vị chủ trì soạn thảo</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Số bản đóng dấu</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Ngày chuyển</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Ký nhận</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Đơn vị lưu</th>
                            <th style="width: 5%;border: 1px solid black;background-color: grey;">Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody style="text-align: left;">
                    ${data && Array.isArray(data) && data.map((item, index) => {
    const mapkanban = data => {
      if (!data) {
        return item.kanbanStatus;
      } else {
        switch (data) {
          case 'waitting':
            if (item.stage === 'complete') {
              return "Chờ ban hành"
            } else {
              return "Chờ ban hành một phần"
            }
          case 'released':
            if (item.completeStatus && item.completeStatus === 'promulgated') {
              return "Đã ban hành"
            } else {
              return "Đã ban hành một phần"
            }
        }
      }
    };
    // ký nhận
    {/* <td style="width: 5%;border: 1px solid black;">${item.signingStatus === 'waitingSign' ? (
        <a style={{ color: 'rgba(26, 144, 50, 0.91)' }}>Chờ ký nháy</a>
      ) : item.signingStatus === 'signed' ? (
        <a style={{ color: 'rgba(26, 144, 50, 0.91)' }}>Đã ký nháy</a>
      ) : item.isReturned === true ? (
        <a style={{ color: 'red', fontSize: 15 }}>Trả lại</a>
      ) : (
        mapkanban(item.releasePartStatus)
      )}</td> */}
      // <td style="width: 5%;border: 1px solid black;">${item.textSymbols ? `${item.toBook || ""}/${item.textSymbols || ""}` : item.toBook || ""}</td>

    return `<tr>
                        <td style="width: 1%;border: 1px solid black;text-align: center;">${index + 1}</td>
                        <td style="width: 5%;border: 1px solid black;">${item.toBook}</td>
                        <td style="width: 5%;border: 1px solid black;">${item.createdAt || ""}</td>
                        <td style="width: 5%;border: 1px solid black;">${item.abstractNote || ""}</td>
                        <td style="width: 5%;border: 1px solid black;">${item.privateLevel || ""}</td>
                        <td style="width: 5%;border: 1px solid black;">${item.signer || ""}</td>
                        <td style="width: 5%;border: 1px solid black;">${item.recipientIds}</td>
                        <td style="width: 5%;border: 1px solid black;">${item.senderUnit || ""}</td>
                        <td style="width: 5%;border: 1px solid black;">${" "}</td>
                        <td td style="width: 5%;border: 1px solid black;" >${item.updatedAt && moment(item.updatedAt).format("DD/MM/YYYY") || ""}</td >
                        <td td style="width: 5%;border: 1px solid black;" >${" "}</td >
                        <td style="width: 5%;border: 1px solid black;">${item.nameOrgBH || ""}</td>
                        <td style="width: 5%;border: 1px solid black;">${" "}</td>
                    </tr > `
  })
    }
                    </tbody>
                </table>
`
  return html;
}

export function contentTableBookNormal({ data = [] }) {
  console.log(data, "data")
  let html = `
  <table style="border-collapse: collapse; width: 95%;margin: 0 auto;">
  <thead class="">
  <tr>
      <th
          style="width: 1%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          STT</th>
      <th
          style="width: 7%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Số, ký hiệu ban hành</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Ngày tháng VB</th>
      <th
          style="width: 15%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Trích yếu nội dung</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Người ký</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Nơi nhận văn bản</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Đơn vị chủ trì soạn thảo</th>
      <th
          style="width: 1%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Số bản đóng dấu</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Ngày chuyển</th>
      <th
          style="width: 3%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Ký nhận</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Đơn vị lưu</th>
      <th
          style="width: 5%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Ghi chú</th>
  </tr>
</thead>
                    <tbody style="text-align: left;">
                    ${data && Array.isArray(data) && data.map((item, index) => {
    const mapkanban = data => {
      if (!data) {
        return item.kanbanStatus;
      } else {
        switch (data) {
          case 'waitting':
            if (item.stage === 'complete') {
              return "Chờ ban hành"
            } else {
              return "Chờ ban hành một phần"
            }
          case 'released':
            if (item.completeStatus && item.completeStatus === 'promulgated') {
              return "Đã ban hành"
            } else {
              return "Đã ban hành một phần"
            }
        }
      }
    };
    // <td style="width: 7%;border: 1px solid black; text-align: left;">${item.textSymbols ? `${item.toBook || ""}/${item.textSymbols || ""}` : item.toBook || ""}</td>

    return ` <tr>
    <td style="width: 1%;border: 1px solid black;text-align: center;">${index + 1}</td>
    <td style="width: 7%;border: 1px solid black; text-align: left;">${item.toBook }</td>
    <td style="width: 2%;border: 1px solid black;">${item.createdAt || ""}</td>
    <td style="width: 15%;border: 1px solid black; text-align: left;">${item.abstractNote || ""}</td>
    <td style="width: 2%;border: 1px solid black; text-align: left;">${item.signer || ""}</td>
    <td style="width: 2%;border: 1px solid black; text-align: left;">${item.recipientIds}</td>
    <td style="width: 2%;border: 1px solid black; text-align: left;">${item.senderUnit|| ""}</td>
    <td style="width: 1%;border: 1px solid black;">${" "}</td>
    <td style="width: 2%;border: 1px solid black;">${item.updatedAt && moment(item.updatedAt).format("DD/MM/YYYY") || ""}</td>
    <td style="width: 3%;border: 1px solid black;">${" "}</td>
    <td style="width: 2%;border: 1px solid black; text-align: left;">${item.nameOrgBH || ""}</td>
    <td style="width: 5%;border: 1px solid black; text-align: left;">${" "}</td>
</tr> `
  })
    }
                    </tbody>
                </table>
`
  return html;
}

export function contentTableBookInPrivate({ data = [] }) {
  console.log(data, 'data')
  // <td style="width: 2%;border: 1px solid black;">${item.toBookCode && item.toBookCode.slice(item.toBookCode.lastIndexOf('/') + 1)}</td>
  let html = `
  <table style="border-collapse: collapse; width: 95%;margin: 0 auto;">
  <thead class="">
  <tr>
      <th
          style="width: 1%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          STT</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Ngày đến</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Số đến</th>
      <th
          style="width: 4%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Số, ký hiệu ban hành</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Ngày văn bản</th>
      <th
          style="width: 3%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Cơ quan, đơn vị ban hành</th>
      <th
          style="width: 15%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Trích yếu nội dung văn bản</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Độ mật</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Người ký</th>
      <th
          style="width: 7%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Ý kiến chỉ đạo của Lãnh đạo</th>
      <th
          style="width: 8%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Đơn vị hoặc người nhận</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Hạn xử lý</th>
  </tr>
</thead>
                    <tbody style="text-align: left;">
                    ${data && Array.isArray(data) && data.map((item, index) => {
                      console.log(item, "nsjdnvjsnvd")
    return ` <tr>
    <td style="width: 1%;border: 1px solid black;text-align:center">${index + 1}</td>
    <td style="width: 2%;border: 1px solid black;">${item.receiveDate && moment(item.receiveDate, "DD/MM/YYYY").format("DD/MM/YYYY") || ""}</td>
    <td style="width: 2%;border: 1px solid black;text-align:center">${item.toBookCode && item.toBookCode.slice(item.toBookCode.lastIndexOf('/') + 1)}</td>
    <td style="width: 4%;border: 1px solid black; text-align: left;">${splitString(item.toBook)}</td>
    <td style="width: 2%;border: 1px solid black;">${item.documentDate && moment(item.documentDate, "DD/MM/YYYY").format("DD/MM/YYYY") || ""}</td>
    <td style="width: 3%;border: 1px solid black; text-align: left;">${item.senderUnit || ''}</td>
    <td style="width: 10%;border: 1px solid black; text-align: left;">${item.abstractNote}</td>
    <td style="width: 2%;border: 1px solid black; text-align: left;">${item.privateLevel}</td>
    <td style="width: 2%;border: 1px solid black; text-align: left;">${item  && item['signer.title']}</td>
    <td style="width: 7%;border: 1px solid black; text-align: left;">${item.comment || ""}</td>
    <td td style = "width: 8%;border: 1px solid black; text-align: left;" > ${item.processorUnitsName || ""}</td >
    <td style="width: 2%;border: 1px solid black;">${item.deadline}</td>
</tr > `
  })
    }
                    </tbody>
                </table>
`
  return html;
}
const splitString = (value) => {
  if (!value) return ""
  // indexOf('/', 2)
  const ArrayValue = value.split("/") || []
  let lengthString = ArrayValue && ArrayValue.length && ArrayValue.length / 3 || 1
  lengthString = Math.ceil(lengthString)
  let newValue = ""
  for (let i = 1; i <= ArrayValue.length; i++) {
    if (i === 0) {
      newValue = ArrayValue[i - 1] + "/"
    }
    else if (i && i % 3 === 0) {
      newValue = newValue + ArrayValue[i - 1] + "/ "
    } else if (i === ArrayValue.length) {
      newValue = newValue + ArrayValue[i - 1]
    }
    else newValue = newValue + ArrayValue[i - 1] + "/"
  }
  return newValue || value
}
export function contentTableBookInNormal({ data = [] }) {
  let html = `
  <table style="border-collapse: collapse; width: 95%;margin: 0 auto;">
  <thead class="">
  <tr>
      <th
          style="width: 1%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          STT</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Ngày đến</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Số đến</th>
      <th
          style="width: 4%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Số, ký hiệu ban hành</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Ngày văn bản</th>
      <th
          style="width: 3%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Cơ quan, đơn vị ban hành</th>
      <th
          style="width: 15%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Trích yếu nội dung văn bản</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Người ký</th>
      <th
          style="width: 7%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Ý kiến chỉ đạo của Lãnh đạo</th>
      <th
          style="width: 8%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Đơn vị hoặc người nhận</th>
      <th
          style="width: 2%;border: 1px solid black; background-color: grey; font-weight: bold; font-size: 110%;">
          Hạn xử lý</th>
  </tr>
</thead>
                    <tbody style="text-align: left;">
                    ${data && Array.isArray(data) && data.map((item, index) => {
    return ` <tr>
    <td style="width: 1%;border: 1px solid black;text-align:center">${index + 1}</td>
    <td style="width: 2%;border: 1px solid black;">${item.receiveDate && moment(item.receiveDate, "DD/MM/YYYY").format("DD/MM/YYYY") || ""}</td>
    <td style="width: 2%;border: 1px solid black;text-align:center">${item.toBookCode && item.toBookCode.slice(item.toBookCode.lastIndexOf('/') + 1)}</td>
    <td style="width: 4%;border: 1px solid black; text-align: left;">${splitString(item.toBook)}</td>
    <td style="width: 2%;border: 1px solid black;">${item.documentDate && moment(item.documentDate, "DD/MM/YYYY").format("DD/MM/YYYY") || ""}</td>
    <td style="width: 3%;border: 1px solid black; text-align: left;">${item.senderUnit || ''}</td>
    <td style="width: 10%;border: 1px solid black; text-align: left;">${item.abstractNote}</td>
    <td style="width: 2%;border: 1px solid black; text-align: left;">${item  && item['signer.title']}</td>
    <td style="width: 7%;border: 1px solid black; text-align: left;">${item.comment}</td>
    <td style="width: 8%;border: 1px solid black; text-align: left;">${item.processorUnitsName || " "}</td>
    <td style="width: 2%;border: 1px solid black;">${item.deadline}</td>
</tr>`
  })
    }
                    </tbody>
                </table>
`
  return html;
}

export function organizationPlanTable({ data }) {
  const { planDetail, resultDetail , NoNextWeeK} = data;
  let dayOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', ' Thứ Bảy', 'Chủ Nhật'];
  let pickers = moment(localStorage.getItem('datePicker')).format('YYYY/MM/DD');
  const session = timeMeet => {
    return timeMeet && parseInt(timeMeet.slice(0, 3)) >= 12 ? 'Chiều' : 'Sáng';
  };
  let html = `
  <style>
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
  </style>
  <p style="text-align:left"> KẾT QUẢ TRONG TUẦN</p>
  <table style="width: calc(100vw - 30px)">
    <tbody>
    <tr>
    <td style="width:15%;text-align:center">STT</td>
    <td style="width:15%;text-align:center">Tên công việc</td>
    <td style="width:35%;text-align:center">Nội dung</td>
    <td style="width:35%;text-align:center">Kết quả tuần này</td>
    </tr>
    `
    if(!NoNextWeeK){
    let htmltable = `${resultDetail.map(
    (item, index) =>
    `<tr>
           ${item.type && `<td rowspan=${item.type}>${item.title}</td>`}
           <td>${cutString(item.name).map(el => {
        return `${el}</br>`
      })}</td>
           <td>${cutString(item.content).map(el => {
        return `${el}</br>`
      })}</td>
           <td>${cutString(item.result).map(el => {
        return `${el}</br>`
      })}</td>
          </tr>
          `,
  )}
    </tbody>
  </table>
  `
  console.log(htmltable, "htmltablehtmltable")
  html = html + htmltable
}else {
  let htmltable =
    `${
      data.data.map((els)=>
         `<tr><td colspan="4">Kế hoạch: ${els.name}</td></tr>
        ${els.resultDetail.map(
          (item, index) =>
            `<tr>
                 ${item.type && `<td rowspan=${item.type}>${item.title}</td>`}
                 <td>${cutString(item.name).map(el => {
              return `${el}</br>`
            })}</td>
                 <td>${cutString(item.content).map(el => {
              return `${el}</br>`
            })}</td>
                 <td>${cutString(item.result).map(el => {
              return `${el}</br>`
            })}</td>
                </tr>
                `,
        )}
        `
      )

    } </tbody>
    </table>`
    html= html+htmltable
  }
  if(!NoNextWeeK){
  html = html +
  `
  <p style="text-align:left"> KẾT QUẢ TUẦN TỚI</p>
  <table style="width: calc(100vw - 30px)">
    <tbody>
    <tr>
    <td style="width:15%;text-align:center">STT</td>
    <td style="width:15%;text-align:center">Tên công việc</td>
    <td style="width:35%;text-align:center">Nội dung</td>
    <td style="width:35%;text-align:center">Kết quả tuần này</td>
    </tr>
      ${planDetail.map(
    (item, index) =>
      `<tr>
          ${item.type && `<td rowspan=${item.type}>${item.title}</td>`}
           <td>${cutString(item.name).map(el => {
        return `${el}</br>`
      })}</td>
           <td>${cutString(item.content).map(el => {
        return `${el}</br>`
      })}</td>
           <td>${cutString(item.result).map(el => {
        return `${el}</br>`
      })}</td>
          </tr>
          `,
  )}
    </tbody>
  </table>
  `;
}
  return html;
}
const cutString = text => {
  return text && text.split('\n') || []
};
export function personPlanTable({ data }) {
  const { planDetail } = data;
  let dayOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', ' Thứ Bảy', 'Chủ Nhật'];
  let pickers = moment(localStorage.getItem('datePicker')).format('YYYY/MM/DD');
  const session = timeMeet => {
    return timeMeet && parseInt(timeMeet.slice(0, 3)) >= 12 ? 'Chiều' : 'Sáng';
  };
  var countForHeightMorning = 0;
  var countForHeightAfternoon = 0;
  const getday = todate => {
    const thu = moment(todate).day();

    switch (thu) {
      case 0:
        return 'Chủ nhật';
      case 1:
        return 'Thứ 2';
      case 2:
        return 'Thứ 3';
      case 3:
        return 'Thứ 4';
      case 4:
        return 'Thứ 5';
      case 5:
        return 'Thứ 6';
      case 6:
        return 'Thứ 7';
      default:
        break;
    }
  };

  // ${checkDisplay(index) !== 'false' ? `<td width="50" style="text-align: center">Sáng</td>` : `<td></td>`}
  let html = `
  <style>
    table, th, td {
      border: 1px solid black;
      border-collapse: collapse;
}
  tr{
    height: 100px;
  }
</style>
  <table style="width: calc(100vw - 30px)">
    <tbody>
    <tr>
    <td style="text-align:center">Thời gian</td>
    <td style="text-align:center">Nội dung</td>
    <td style="text-align:center">Địa điểm</td>
    <td style="text-align:center">Ghi chú</td>
    <td style="text-align:center">Kết quả thực hiện</td>
    <td style="text-align:center">Ghi chú kết quả thực hiện</td>
    </tr>
    
   ${planDetail.map(
    el =>
      `<tr >
       <td valign="top" style="text-align:center;  width:11.6%">
       ${getday(el.time)},</br>
       ${moment(el.time).format('DD/MM/YYYY')}
       </td>
       <td valign="top" style="width:25%">${cutString(el.content).map(ell => {
        return `${ell}</br>`
      })}</td>
       <td valign="top" style="width:11.6%"> ${cutString(el.address).map(ell => {
        return `${ell}</br>`
      })}</td>
       <td valign="top" style="width:11.6%">${cutString(el.note).map(ell => {
        return `${ell}</br>`
      })}</td>
       <td valign="top" style="width:25%">${cutString(el.result).map(ell => {
        return `${ell}</br>`
      })}</td>
       <td valign="top" style="width:15%">${cutString(el.comment).map(ell => {
        return `${ell}</br>`
      })}</td>
     </tr>`,
  )}
    </tbody>
  </table>`;

  return html;
}

export async function PrintContentTable({ content, data, code, isClone }) {
  try {
    const element = await convertTemplate({ content, data, code });
    const mywindow = window.open('');
    const newData = element && element.replaceAll('</tr>,', '</tr>');
    const newData1 = newData && newData.replaceAll(' ,', '');
    const newData2 = newData1 && newData1.replaceAll(',,', '');
    const newData3 = newData2 && newData2.replaceAll('</p>,', '');
    const newData4 = newData3 && newData3.replaceAll('undefined', '');
    const newData5 = newData3 && newData4.replaceAll('</br>,', '</br>');
    // console.log(newData3);
    // nth-last-child
    mywindow.document.write(`${newData5}`);
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
  } catch (error) {
    console.log(error, 'error')
  }
}

export async function PrintElem({ content, data, code, isClone, templateCode }) {
  if (isClone) data = await apiCloneModule(data, code);
  console.log(templateCode, 'templateCode')
  let element = await convertTemplate({ content, data, code, templateCode });
  // if (templateCode === "PHIEUXULY") { bookDoc
  if (templateCode && (templateCode.includes("PHIEUXULY") || templateCode.includes("bookDoc"))) {
    element = element && element.replaceAll('<p>', '')
    element = element && element.replaceAll('</p>', '')
  }
  const mywindow = window.open('');

  const style = `<style>

  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  p{
    height: 10px;
} 

  </style>`;
  // nth-last-child
  mywindow.document.write(`${element}${style}`);
  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/
  mywindow.print();
  // mywindow.close();

  // return true;
}
export async function PrintElemExcel({ content, data, code, isClone, templateCode }) {
  if (isClone) data = await apiCloneModule(data, code);
  let element = await convertTemplate({ content, data, code });
  if (templateCode && templateCode.includes("PHIEUXULY")) {
    element = element.replaceAll('<p>', '')
    element = element.replaceAll('</p>', '')
  }
  let downloadLink = document.createElement('a');
  let block = document.createElement('div');
  block.id = code + 'ST01';
  block.style.cssText = 'display: none;';

  block.innerHTML = element;
  document.body.appendChild(downloadLink);
  document.body.appendChild(block);
  let tdStyles = document.querySelectorAll(`#table-excel tr td`);
  tdStyles.forEach(td => {
    td.style.cssText = 'border: 1px solid; text-align: center';
  });

  let tableSelect = document.getElementById(`${code}ST01`);
  let tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

  // let file = XLSX.utils.table_to_book(tableSelect, {sheet: "hello"});
  // XLSX.write(file, { bookType: 'xlsx', bookSST: true, type: 'base64'  });
  // XLSX.writeFile(file, 'file.xlsx');

  if (navigator.msSaveOrOpenBlob) {
    var blob = new Blob(['\ufeff', tableHTML], {
      type: 'application/vnd.ms-excel',
    });
    navigator.msSaveOrOpenBlob(blob, 'hello');
  } else {
    // Create a link to the file
    downloadLink.href = 'data:application/vnd.ms-excel,' + tableHTML;

    // Setting the file name
    downloadLink.download = 'hello';

    //triggering the function
    downloadLink.click();
  }
}

// eslint-disable-next-line consistent-return
export function sortTask(list, result = [], id, rt = false) {
  const current = list.find(i => i._id === id);
  if (current) result.push(current);
  const child = list.filter(i => i.parentId === id).sort((a, b) => a.order - b.order);
  if (child.length) {
    child.forEach(item => {
      sortTask(list, result, item._id);
    });
  }

  if (rt) return result;
}

export function convertDateFacebook(item) {
  const date = new Date();
  const end = new Date(item.createdAt);
  const diff = ((date - end) / 60000).toFixed();
  // eslint-disable-next-line eqeqeq
  return { ...item, time: convertDateFb(item.createdAt) };
}

// export function convertComment(comments) {
//   const newComments = comments.map(i => {});
// }

export function convertDateFb(d1) {
  const date = new Date();
  const end = new Date(d1);
  const diff = ((date - end) / 60000).toFixed();
  // eslint-disable-next-line eqeqeq
  if (diff < 1) return 'Vừa xong';
  if (diff < 60) return `${diff} phút trước`;
  if (diff < 1440) {
    const h = (diff / 60).toFixed();
    return `${h} giờ trước`;
  }
  const d = (diff / 3600).toFixed();
  return `${d} ngày trước`;
}
export function compareArr(array1, array2) {
  const newArr1 = [...array1];
  const newArr2 = [...array2];
  return newArr1.length === newArr2.length && newArr1.sort().every((value, index) => value === newArr2.sort()[index]);
}
export const taskStatus = ['Đang thực hiện', ' Hoàn thành', 'Đóng dừng', 'Không thực hiện'];
export const taskPrioty = ['Rất cao', 'Cao', 'Trung bình', 'Thấp', 'Rất thấp'];
export const priotyColor = ['#ff0000', '#ffc107', '#03a9f4', '#009688', '#8bc34a'];
export const taskPriotyColor = [
  { name: 'Rất cao', color: '#ff0000' },
  { name: 'Cao', color: '#ffc107' },
  { name: 'Trung bình', color: '#03a9f4' },
  { name: 'Thấp', color: '#009688' },
  { name: 'Rất thấp', color: '#8bc34a' },
];
export const workStatus = [
  {
    "code": 0,
    "color": "rgb(52, 11, 214)",
    "version": 1,
    "name": "Công việc mới",
    "type": "new"
  },
  {
    "code": 0,
    "color": "rgb(52, 11, 214)",
    "version": 1,
    "name": "Trả lại",
    "type": "return"
  },
  {
    "code": 1,
    "color": "#18ed00",
    "version": 1,
    "name": "Chờ xác nhận",
    "type": "wait"
  },
  {
    "code": 2,
    "color": "#ed0000",
    "version": 1,
    "name": "Đã từ chối",
    "type": "refuse"
  },
  {
    "code": 4,
    "color": "rgb(215, 130, 12)",
    "version": 1,
    "name": "Đang thực hiện",
    "type": "okay"
  },
  {
    "code": 4,
    "color": "rgb(215, 130, 12)",
    "version": 1,
    "name": "Chờ đánh giá",
    "type": "rate"
  },
  {
    "code": 4,
    "color": "rgb(215, 130, 12)",
    "version": 1,
    "name": "Hoàn thành",
    "type": "success"
  }
];
export function generateId() {
  return `_${Math.random()
    .toString(36)
    .substr(2, 9)}${Math.random()
      .toString(36)
      .substr(2, 9)}`;
}

export function findListDep(idTree, list, listDep) {
  if (listDep.includes(idTree)) return;
  listDep.push(idTree);
  const item = list.find(item => item.idTree === idTree);
  if (item && item.dependent) {
    findListDep(item.dependent, list, listDep);
  }
}

export function checkDuplicate(w) {
  return new Set(w).size !== w.length;
}

export function findChildren(data, filter = 'parentId') {
  data.forEach(item => {
    const child = data.filter(ele => ele[filter] === item._id);
    if (child.length) {
      item.data = child;
    }
  });
  return data.filter(i => i.type === 0);
}

export function groupBy(objectArray, property) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

export function convertOb(objectArray, property) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    acc[key] = obj;
    return acc;
  }, {});
}

export function convertTableNested(rows, property) {
  const result = [];
  const newRows = groupBy(rows, property);
  Object.keys(newRows).forEach(item => {
    newRows[item].forEach((element, index) => {
      element.total = newRows[item].length;
      element.ord = index;

      result.push(element);
    });
  });
  return result;
}

export function getDatetimeLocal(time = new Date(), l = -8) {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  const localISOTime = new Date(new Date(time) - tzoffset).toISOString().slice(0, l);
  return localISOTime;
}

export function toVietNamDate(date = new Date()) {
  return new Date(date).toLocaleDateString('vi', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}

function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export function fetchData(url, method = 'GET', body = null, token = 'token') {
  const head = {
    method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem(token)}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) head.body = JSON.stringify(body);
  return fetch(url, head)
    .then(checkStatus)
    .then(parseJSON);
}

export function removeWaterMark(container, selectorTag = 'g') {
  const list = getElementsByIdStartsWith(container, selectorTag, 'aria-labelledby', '-title');
  list.forEach(i => {
    i.style.display = 'none';
  });
}

function getTotal(cir, oza) {
  let total = 0;
  oza.forEach(i => {
    const idx = cir.detailRanges.findIndex(ele => ele.id === i._id);
    if (idx !== -1) {
      total += cir.detailRanges[idx].plan * 1;
    } else if (i.child && i.child.length) {
      total += getTotal(cir, i.child) * 1;
    }
  });

  return total;
}

function getElementsByIdStartsWith(container, selectorTag, attribute, prefix) {
  const items = [];
  const myPosts = document.getElementsByTagName(selectorTag);
  for (let i = 0; i < myPosts.length; i++) {
    if (myPosts[i].getAttribute(attribute)) {
      if (myPosts[i].getAttribute(attribute).lastIndexOf(prefix) !== -1) {
        items.push(myPosts[i]);
      }
    }
  }

  return items;
}

export function getListOpen(listDer, list = []) {
  listDer.forEach(i => {
    list.push(i);
    if (i.open && i.child && i.child.length) getListOpen(i.child, list);
    else if (i.open) list.push(i);
  });
  return list;
}

export function getPlan(i, item) {
  const reult = i.detailRanges.findIndex(ele => ele.id === item._id);
  if (reult !== -1) return i.detailRanges[reult].plan;
  if (item.child && item.child.length) return getTotal(i, item.child);
  return 0;
}

export function addUserToDepartment(departments, users) {
  if (!users) return departments;
  departments.forEach(item => {
    const userList = users.filter(i => i.organizationUnit && i.organizationUnit.organizationUnitId === item._id);
    if (item.child && item.child.length) addUserToDepartment(item.child, users);
    if (!Array.isArray(item.child)) item.child = [];
    item.child = item.child.concat(userList);
  });
  return departments;
}

export function addHrmToDepartment(departments, users) {
  if (!users) return departments;
  departments.forEach(item => {
    const userList = users.filter(i => i.organizationUnit && i.organizationUnit._id === item._id);
    if (item.child && item.child.length) addHrmToDepartment(item.child, users);
    if (!Array.isArray(item.child)) item.child = [];
    item.child = item.child.concat(userList);
  });
  return departments;
}

export function getKpiPlan(range, kpiId, kpiPlan) {
  const plan = kpiPlan.find(i => i.rangeId === range._id && i.kpi === kpiId);
  const vertical = getVerticalKpiPlan(range.child, kpiId, kpiPlan);
  if (!plan)
    return {
      yearPlan: 0,
      quarterPlan: getArr(4),
      monthPlan: getArr(12),
      horizontalYearPlan: 0,
      horizontalQuarterPlan: 0,
      horizontalMonthPlan: 0,
      ...vertical,
    };
  const quarterPlan = plan.quarter.length ? plan.quarter : [0, 0, 0, 0];
  const monthPlan = plan.month.length ? plan.month : getArr(12);
  const horizontalYearPlan = totalHorizontalArray(quarterPlan);
  const horizontalQuarterPlan = totalHorizontalArray(monthPlan);
  // const horizontalMonthPlan: 0,
  return { yearPlan: plan.plan, quarterPlan, horizontalYearPlan, horizontalQuarterPlan, monthPlan, ...vertical };
}

function getVerticalKpiPlan(range, kpiId, kpiPlan) {
  const total = {
    verticalYearPlan: 0,
    verticalMonthPlan: getArr(12),
    verticalQuarterPlan: getArr(4),
  };
  if (range && range.length)
    range.forEach(i => {
      const find = kpiPlan.find(it => it.rangeId === i._id && it.kpi === kpiId);
      if (find) {
        total.verticalYearPlan += find.plan;
        totalVertialArray(total.verticalQuarterPlan, find.quarter);
        totalVertialArray(total.verticalMonthPlan, find.month);
      } else if (i.child && i.child.length) {
        total.verticalYearPlan += getVerticalKpiPlan(i.child, kpiId, kpiPlan).verticalYearPlan;
        totalVertialArray(total.verticalQuarterPlan, getVerticalKpiPlan(i.child, kpiId, kpiPlan).verticalQuarterPlan);
        totalVertialArray(total.verticalMonthPlan, getVerticalKpiPlan(i.child, kpiId, kpiPlan).verticalMonthPlan);
      }
    });

  return total;
}

function totalVertialArray(array1, array2) {
  array1.forEach((it, id) => {
    array1[id] += array2[id];
  });
}

function totalHorizontalArray(array) {
  let total = 0;
  array.forEach(item => {
    total += item;
  });
  return total;
}

function getArr(number, callback = () => 0) {
  return Array.from({ length: number }, callback);
}

export function totalArray(array, from = 0, to = array.length, property = null) {
  let total = 0;
  for (let index = from; index < to; index++) {
    const element = property ? array[index][property] : array[index];
    total += element * 1;
  }
  return total;
}

// export function tableToExcel(id, n) {
//   const uri = 'data:application/vnd.ms-excel;base64,';
//   const template =
//     '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>';

//   function base64(s) {
//     return window.btoa(unescape(encodeURIComponent(s)));
//   }

//   function format(s, c) {
//     return s.replace(/{(\w+)}/g, (m, p) => c[p]);
//   }
//   function print(table, name) {
//     if (!table.nodeType) table = document.getElementById(table);
//     const ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };
//     window.location.href = uri + base64(format(template, ctx));
//   }
//   print(id, n);
// }

export function convertRatio(list, id) {
  const listChild = list.filter(i => i.parentId === id).map(i => ({
    name: i.name,
    ratio: i.ratio,
    duration: i.duration,
    costEstimate: i.costEstimate,
    id: i._id,
    costRealityValue: i.costRealityValue,
  }));

  let totalDuration = 0;
  listChild.forEach(i => {
    totalDuration += i.duration * 1;
  });
  totalDuration = totalDuration || 1;
  let leftRatio = 100;

  listChild.forEach((item, index) => {
    const planRatio = ((item.duration * 100) / totalDuration).toFixed();
    if (index === listChild.length - 1) item.planRatio = leftRatio;
    else {
      leftRatio -= planRatio;
      item.planRatio = planRatio;
    }
  });
  return listChild;
}

function romanize(num) {
  if (Number.isNaN(Number(num))) return NaN;
  const digits = String(+num).split('');

  const key = [
    '',
    'C',
    'CC',
    'CCC',
    'CD',
    'D',
    'DC',
    'DCC',
    'DCCC',
    'CM',
    '',
    'X',
    'XX',
    'XXX',
    'XL',
    'L',
    'LX',
    'LXX',
    'LXXX',
    'XC',
    '',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
  ];

  let roman = '';

  let i = 3;
  while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
  return Array(+digits.join('') + 1).join('M') + roman;
}

export function printGroupSaleClosure(lang) {
  return function printGroupSales(data) {
    const contentGroup = groupBy(data.products, 'productGroup');
    let content = '';
    Object.keys(contentGroup).forEach((i, e) => {
      const itemContent = `<tr >
        <td colspan="7"><p>${romanize(e + 1)}. ${i}</p>
        </td>
      </tr>`;
      content = `${content}${itemContent}`;
      contentGroup[i].forEach((ele, eled) => {
        const eleContent = `<tr class="tr">
          <td>
            <p>${eled + 1}</p>
          </td>
          <td>
            <img src="${ele.logo}" width="150" height="150">
          </td>
          <td>
            <p>${ele.code}</p>
          </td>
          <td style="width: 300px">
            <p>${`
                <b>${ele.productGroup}</b>
                ${ele.description ? `<p>${ele.description}</p>` : ``}
                ${ele.size ? `<p>Kích thước: ${ele.size}</p>` : ``}
              `}</p>
          </td>
          <td>
            <p>${ele.amount || 0}</p>
          </td>
          <td>
            <p>${ele.pricePolicy ? ele.pricePolicy.costPrice || 0 : 0}</p>
          </td>
          <td>
            <p>${(parseFloat(ele.amount) || 0) * (ele.pricePolicy ? parseFloat(ele.pricePolicy.costPrice) || 0 : 0)}</p>
          </td>
        </tr>`;
        content = `${content}${eleContent}`;
      });
    });

    return `<table class="table">
      <tbody>
        <tr class="tr">
          <td>
            <p>${lang === 'en' ? 'NO' : 'STT'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'PICTURE' : 'ẢNH SP'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'CODE' : 'MÃ SP'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'DESCRIPTION' : 'MÔ TẢ'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'QTY' : 'SỐ LƯỢNG'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'UNIT PRICE' : 'ĐƠN GIÁ'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'TOTAL' : 'TỔNG TIỀN'}</p>
          </td>
        </tr>
      ${content}
      </tbody>
    </table>`;
  };
}

export async function printSaleOffer(data) {
  let content = '<table><tbody>';
  data.products.forEach((item, index) => {
    const nameContent = `<tr><td colspan="6"><p><strong>${item.name}</strong></p>
      </td>
      </tr>`;
    content = `${content}${nameContent}`;

    const heightContent = `<tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
      normal" class="MsoNormal"><span style="font-size:12.0pt; font-family: 'Times New Roman', Times,serif;">&nbsp;Khối lượng trên hóa đơn</span></p>
    </td>
    <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
      normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">${data.relityProducts[index].amount}</span></p>
    </td>
    <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
      text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif; font-size: medium;">Nội dung</span></strong></p>
    </td>
    <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
      text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Dự kiến</span></strong></p>
    </td>
    <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
      text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Hợp đồng</span></strong></p>
    </td>
    <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
      text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Chênh lệch</span></strong></p>
    </td>
    </tr>`;
    content = `${content}${heightContent}`;

    const etimasteContent = `<tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-size:12.0pt; font-family: 'Times New Roman', Times,serif;">&nbsp;Khối lượng dự kiến</span></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">${item.amount}</span></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">Đơn giá vật liệu </span><span style="color: rgb(156, 39, 176); font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 700; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none; font-family: 'Times New Roman', Times,serif;">&nbsp;</span><span style="font-family: 'Times New Roman', Times,serif;">(1)</span></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">${convert2Money(item.costPrice)}</span></p>

  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">${convert2Money(
      data.relityProducts[index].costPrice,
    )}</span></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal">${convert2Money(data.relityProducts[index].costPrice - item.costPrice)}</p>
  </td>
  </tr>`;
    content = `${content}${etimasteContent}`;

    const reviseContent = `<tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-size:12.0pt; font-family: 'Times New Roman', Times,serif;">&nbsp;Chênh lệch</span></p>
  </td>
  <td><p>${data.relityProducts[index].amount * 1 - item.amount * 1}</p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">Đơn giá vận chuyển&nbsp; </span><span style="color: rgb(156, 39, 176); font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 700; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none; font-family: 'Times New Roman', Times,serif;">&nbsp;</span><span style="font-family: 'Times New Roman', Times,serif;">(2)</span></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"></p>
  </td>
  </tr>`;

    content = `${content}${reviseContent}`;

    const percent =
      data.relityProducts[index].amount * 1
        ? convert2Money(((data.relityProducts[index].amount * 1 - item.amount * 1) * 100) / data.relityProducts[index].amount)
        : 0;
    const endContent = `


<tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal"><span style="font-size:12.0pt; font-family: 'Times New Roman', Times,serif;">&nbsp;%</span></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">${percent}</span></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">Đơn giá (1+2):</span></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal">${convert2Money(item.costPrice)}</p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal">${convert2Money(data.relityProducts[index].costPrice)}</p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal">${convert2Money(data.relityProducts[index].costPrice - item.costPrice)}</p>
</td>
</tr>
`;

    content = `${content}${endContent}`;
  });

  return `${content}</tbody></table>`;
}

export async function addressPoint(data) {
  return data.transports.map(i => i.adress).join();
}

export async function destinationPoint(data) {
  return data.transports.map(i => i.destination).join();
}

export async function getNameByApi(data) {
  console.log(data);
}
export async function getCustomer(data) {
  try {
    const sale1 = await fetchData(`${API_SALE}/${data.saleQuotation.saleQuotationId._id}`);

    if (sale1) return sale1.customer.name;
    return null;
  } catch (error) {
    return '';
  }
}

export async function getAddress(data) {
  try {
    const customerAddress = await fetchData(`${API_CUSTOMERS}/${data.task.taskId.customer}`);
    return customerAddress.address;
  } catch (error) {
    return '';
  }
}

export async function getPhone(data) {
  try {
    const phone = await fetchData(`${API_SALE}/${data.saleQuotation.saleQuotationId._id}`);
    if (phone) return phone.customer.phoneNumber;
    return null;
  } catch (error) {
    return '';
  }
}

export async function getTax(data) {
  try {
    const tax = await fetchData(`${API_SALE}/${data.saleQuotation.saleQuotationId._id}`);
    if (tax) return tax.customer.taxCode;
    return null;
  } catch (error) {
    return '';
  }
}

export async function getBank(data) {
  try {
    const bank = await fetchData(`${API_CUSTOMERS}/${data.task.taskId.customer}`);
    return bank.bankAccountNumber;
  } catch (error) {
    return '';
  }
}
export function getParentId(item, parents, tasks) {
  if (!item.level) return parents.findIndex(element => element._id === item._id);
  const foundItem = tasks.find(element => element._id === item.parentId);
  return getParentId(foundItem, parents, tasks);
}
export function getOrderCode(item, tasks) {
  if (!item.level) return (tasks.find(element => element._id === item._id).order + 1).toString();
  const foundItem = tasks.find(element => element._id === item.parentId);
  return `${getOrderCode(foundItem, tasks)}.${(item.order + 1).toString()}`;
}
const ROOT_PARENT_LEVEL = 0;
export function assignOrderCode(tasks) {
  const parents = tasks
    .filter(item => item.level === ROOT_PARENT_LEVEL)
    .sort((a, b) => a.order - b.order)
    .map(item => ({ ...item, child: [] }));
  const children = tasks
    .filter(item => item.level !== ROOT_PARENT_LEVEL)
    .sort((a, b) => a.order - b.order)
    .sort((a, b) => a.level - b.level);

  for (const child of children) {
    try {
      const parentIdx = getParentId(child, parents, tasks);
      child.orderCode = getOrderCode(child, tasks);
      parents[parentIdx].child.push(child);
    } catch (e) {
      console.log('Error in assign task code:', e);
    }
  }
}
export async function getRepresent(data) {
  try {
    const Represent = await fetchData(`${API_CUSTOMERS}/${data.task.taskId.customer}`);
    return Represent.detailInfo.represent.name;
  } catch (error) {
    return '';
  }
}

export async function getIncomingDocs(data) {
  try {
    const query = { limit: 500 };
    const queryString = serialize(query);
    const Represent = await fetchData(`${API_INCOMMING_DOCUMENT}?${queryString}`);
    return Represent.data;
  } catch (error) {
    console.log(error, 'eee');
  }
}

export async function getOutGoingDocs(data) {
  try {
    const query = { limit: 500 };
    const queryString = serialize(query);
    const Represent = await fetchData(`${API_GOING_DOCUMENT}?${queryString}`);
    return Represent.data;
  } catch (error) {
    console.log(error, 'eee');
  }
}

export async function getPosition(data) {
  try {
    const Position = await fetchData(`${API_CUSTOMERS}/${data.task.taskId.customer}`);
    return Position.detailInfo.represent.position;
  } catch (error) {
    return '';
  }
}

export async function printGroupTask(data) {
  try {
    const filter = { filter: { projectId: data.projectId._id } };
    const query = serialize(filter);
    const projectData = await fetchData(`${API_TASK_PROJECT}/projects?${query}`);

    const project = await fetchData(`${API_TASK_PROJECT}/projects`);

    const arr = await project.data.filter(item => item.projectId._id === data.projectId._id);
    const contenttask = groupBy(projectData.data.filter(i => i.kanbanCode), 'kanbanCode');
    assignOrderCode(projectData.data);
    Object.values(contenttask).forEach(e =>
      e.sort((a, b) => {
        const x = a.orderCode
          .substr(4)
          .split('.')
          .map(Number);
        const y = b.orderCode
          .substr(4)
          .split('.')
          .map(Number);
        const maxLength = x.length > y.length ? x.length : y.length;
        for (let i = 0; i < maxLength; i++) {
          if (x[i] > y[i]) return true ? 1 : -1;
          if (x[i] < y[i]) return true ? -1 : 1;
          // eslint-disable-next-line
          if (!isNaN(x[i]) && isNaN(y[i])) return true ? 1 : -1;
          // eslint-disable-next-line
          if (isNaN(x[i]) && !isNaN(y[i])) return true ? -1 : 1;
        }
        return 0;
      }),
    );

    const listparent = projectData.data.find(i => i.isProject).kanban;
    const newList = listparent.map(i => ({ ...i, child: contenttask[i.code] }));
    let content = '<table><tbody>';
    const heightContent = `<tr style="background:green"><td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">TT</span></strong></p>
  </td>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Giai đoạn</span></strong></p>
  </td>
  <td rowspan="2" colspan = "2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif; font-size: medium;">Nội dung thực hiện</span></strong></p>
  </td>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">BP phụ trách</span></strong></p>
  </td>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Kiểm tra,Tham gia</span></strong></p>
  </td>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Phối hợp</span></strong></p>
  </td>
  <th colspan = "3"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Thời gian thực hiện</span></strong></p>
  </th>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Mức độ đã triển khai</span></strong></p>
  </td>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Tiến độ (%)</span></strong></p>
  </td>
  <td colspan = "2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Thông tin người liên hệ</span></strong></p>
  </td>
  <td rowspan = "2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Ghi chú</span></strong></p>
  </td>

  </tr>`;

    content = `${content}${heightContent}`;
    const dateContent = `<tr style="background:green"><td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Bắt đầu</span></strong></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Ngày thực hiện</span></strong></p></td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Kết thúc</span></strong></p></td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Họ tên</span></strong></p></td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">CV/BP/ĐT</span></strong></p></p>
  </td>
  </tr>`;
    content = `${content}${dateContent}`;
    newList.forEach((item, index) => {
      const dataParent = `<tr><td ${isArray(item.child) ? `rowspan=${item.child.length + 1}` : ''}><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">${index +
        1}</span></strong></p>
  </td>
  <td ${isArray(item.child) ? `rowspan=${item.child.length + 1}` : ''}><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">${item.name
        }</span></strong></p>
  </td>

  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  </tr>`;
      content = `${content}${dataParent}`;
      if (isArray(item.child)) {
        item.child.forEach(it => {
          const chidData = `<tr>
    <td>${it.orderCode.substr(4)}</td>
    <td>${it.name}</td>
    <td>${mapName(it.inCharge)}</td>
    <td>${mapName(it.join)}</td>
    <td>${mapName(it.support)}</td>
    <td>${it.startDate.slice(0, 10)}</td>
    <td></td>
    <td>${it.endDate.slice(0, 10)}</td>
    <td>${it.kanbanStatus == 1
              ? 'Công việc mới'
              : it.kanbanStatus == 2
                ? 'Đang thực hiện'
                : it.kanbanStatus == 3
                  ? 'Không Hoàn thành'
                  : it.kanbanStatus == 4
                    ? ' Thất bại'
                    : it.kanbanStatus == 5
                      ? 'Tạm dừng'
                      : 'Không thực hiện'
            }
    </td>
    <td style = "text-align: center">${it.progress}</td>
      <td></td>
      <td></td>
      <td></td></tr>`;
          content = `${content}${chidData}`;
        });
      }
    });
    return `${content}</tbody></table>`;
  } catch (error) {
    return '';
  }
}

export async function getIncharge(data) {
  try {
    const filter = { inCharge: { $in: data.inCharge } };
    const query = serialize({ filter });
    const projectData = await fetchData(`${API_TASK_PROJECT}?${query}`);
    const list = projectData.data.map(i => i.inCharge.map(i => i.name));
    return list;
  } catch (error) {
    return '';
  }
}
function mapName(i) {
  if (isArray(i)) return i.map(iz => iz.name).join();
  return '';
}
export async function getJoin(data) {
  try {
    const filter = { join: { $in: data.join } };
    const query = serialize({ filter });
    const projectData = await fetchData(`${API_TASK_PROJECT}?${query}`);
    const list = projectData.data.map(i => i.join.map(i => i.name));
    return list;
  } catch (error) {
    return '';
  }
}

export async function getViewable(data) {
  try {
    const filter = { viewable: { $in: data.viewable } };
    const query = serialize({ filter });
    const projectData = await fetchData(`${API_TASK_PROJECT}?${query}`);
    const list = projectData.data.map(i => i.viewable.map(i => i.name));
    return list;
  } catch (error) {
    return '';
  }
}

export async function getApproved(data) {
  try {
    const app = data.approved.map(i => i.name);
    return app;
  } catch (error) {
    return '';
  }
}

export async function printUndertakingPerson(data) {
  try {
    const responsibility = data.responsibilityPerson.map(i => i.name);
    return responsibility;
  } catch (error) {
    return '';
  }
}

export async function printSupervisor(data) {
  try {
    const listSupervisoer = data.supervisor.map(i => i.name);
    return listSupervisoer;
  } catch (error) {
    return '';
  }
}

export async function printQuotation(data) {
  try {
    const productList = data.products.map(async i => {
      const item = await fetchData(`${API_STOCK}/${i.productId}`);
      return item;
    });

    const list = await Promise.all(productList);
    let content = '<table><tbody>';
    const heightContent = `<tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
        normal" class="MsoNormal"><span style="font-size:12.0pt; font-family: 'Times New Roman', Times,serif; font-size: medium;">&nbsp;Product</span></p>
      </td>
      <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
        normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif; font-size: medium;">Specification</span></p>
      </td>
      <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
        text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif; font-size: medium;">Price CIF</span></strong></p>
      </td>
      <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
        text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Port of destination</span></strong></p>
      </td>
      <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
        text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Packing</span></strong></p>
      </td>
      <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
        text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Container capacity</span></strong></p>
      </td>
      </tr>`;
    content = `${content}${heightContent}`;

    list.forEach(i => {
      const contentItem = `<tr><td>${i.name}</td><td><p>Moisture:${i.others.Moisture}</p><p>Admixture: ${i.others.Moisture}</p><p>Length: ${i.others.Length
        }</p><p> ${i.others.Fungus}</p><p> ${i.others.Color}</p></td><td>${i.pricePolicy.costPrice}</td><td>${i.others.Portofdestination}</td><td>${i.others.Packing
        }</td><td>${i.others.ContainerCapacity}</td><tr>`;
      content = `${content}${contentItem}`;
    });

    return `${content}</tbody></table>`;
  } catch (error) {
    return '';
  }
}

export async function printContract(data) {
  try {
    const sales = await fetchData(`${API_SALE}/${data.saleQuotation.saleQuotationId._id}`);
    let headContent = `<table><tbody><tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; font-size: medium; font-family: 'Times New Roman', Times,serif;">No.</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Commodity</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Quantity<br>(MTs)</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Price<br>(USD/MT)</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Total Amount<br>(USD)</span></b></p>
  </td>
  </tr>`;
    let total = 0;
    sales.products.forEach((item, idx) => {
      const content = ` <tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;
   text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">${idx + 1}</p>
 </td>
 <td><p>${item.name}</p>
 </td>
 <td><p>${item.amount}</p>
 </td>
 <td><p>${item.costPrice}</p>
 </td>
 <td><p>${item.costPrice * item.amount}</p>
 </td>
 </tr>`;
      headContent = `${headContent}${content}`;
      total += item.costPrice * item.amount;
    });
    const last = ` <tr><td colspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">TOTAL</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"></p>
  </td>
  <td><p></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
    ${total}
    </p>
  </td>
  </tr>
  </tbody></table>`;
    headContent = `${headContent}${last}`;
    return headContent;
  } catch (error) {
    return '';
  }
}
export async function printCustomerInfo(data) {
  try {
    const customerAddress = await fetchData(`${API_CUSTOMERS}/${data.task.taskId.customer}`);
    return customerAddress.name;
  } catch (error) {
    return '';
  }
}
function convertDescription(description) {
  description = description.toString().replace(/\|/g, '<br>');
  return description;
}
function convertCurrency(number) {
  number = number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
  return number;
}
function convertToEuro(number) {
  number = '€' + number.toLocaleString('da-DK', { style: 'currency', currency: 'EUR' }).slice(0, -1);
  return number;
}
function convertToVND(number) {
  number = number.toLocaleString('da-DK', { style: 'currency', currency: 'VND' });
  return number;
}
export async function printPall(data) {
  try {
    const productList = data.products.map(async i => {
      const item = await fetchData(`${API_STOCK}/${i.productId}`);
      item.rate = data.rate;
      return { ...item, ...i };
    });
    const list = await Promise.all(productList);
    let headContent = `<table><tbody><tr style="background-color: #A0A09F;-webkit-print-color-adjust: exact;">
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">NO</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
  &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">PICTURE</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; font-size: medium; font-family: 'Times New Roman', Times,serif;">CODE</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">DESCRIPTION</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">QTY</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">UNIT PRICE</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">TOTAL</span></b></p>
</td>
  </tr>`;
    let total = 0;
    list.forEach((i, idx) => {
      const contentItem = `<tr>
      <td><p style="text-align:center">${idx + 1}</p></td>
      <td><img src="${i.logo}" alt="sanpham" style=" height: 200px;"></td>
      <td><p style="text-align:center">${i.tags}</p></td>
      <td><p style="max-width:500px">Tên sản phẩm: <b>${i.name}</b> <br> Nhãn Hiệu: <b>${i.tags}</b> <br> Kích thước: <b>${i.size
        }</b> <br> Mô tả thêm: <br> ${convertDescription(i.description)}</p></td>
      <td><p style="text-align:center">${i.amount}</p></td>
      <td><p style="text-align:center">${convertToEuro(i.costPrice)}</p></td>
      <td><p style="text-align:center">${convertToEuro(i.costPrice * i.amount)}</p> </td>
      <tr>`;
      headContent = `${headContent}${contentItem}`;
      total += i.costPrice * i.amount;
    });
    const last = ` <tr><td colspan="5" style="background-color: #BFBFBE;-webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    -height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Tổng giá sản phẩm EURO đã bao gồm thuế VAT</span></b></p>
  </td>
  <td colspan="2" style="background-color: #BFBFBE; -webkit-print-color-adjust: exact; "><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
   ${convertToEuro(total)}
  </p>
  </td>
  </tr>`;
    headContent = `${headContent}${last}`;
    const heightContent = ` <tr><td colspan="5" style="background-color: #808080; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
 line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
  &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Tổng giá sản phẩm VNĐ đã bao gồm thuế VAT</span></b></p>
</td>
<td colspan="2" style="background-color: #808080; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
${convertToVND(total * data.rate)}
</p>
</td>
</tr>
  </tbody></table>`;

    headContent = `${headContent}${heightContent}`;
    return headContent;
  } catch (error) {
    return '';
  }
}
// € ${convertCurrencyEuro(total)}
export async function printName(data) {
  try {
    const filter = { name: { $in: data.name } };
    const query = serialize({ filter });
    const projectData = await fetchData(`${API_TASK_PROJECT}?${query}`);
    const list = projectData.data.map(i => i.name);
    return list;
  } catch (error) {
    return '';
  }
}
export async function printCode(data) {
  try {
    const filter = { code: { $in: data.code } };
    const query = serialize({ filter });
    const projectData = await fetchData(`${API_TASK_PROJECT}?${query}`);
    const list = projectData.data.map(i => i.code);
    return list;
  } catch (error) {
    return '';
  }
}
export async function printRate(data) {
  try {
    return convertCurrency(data.rate);
  } catch (error) {
    return '';
  }
}

export async function printProduct(data) {
  try {
    const product = await fetchData(`${API_STOCK}/${data._id}`);
    let headContent = `<table><tbody><tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; font-size: medium; font-family: 'Times New Roman', Times,serif;">Nhãn hiệu</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">TT</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Hình ảnh minh họa</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Sản phẩm</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
  &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Mã SP</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Mô tả chung</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Kích thước (cm)</span></b></p>
</td>

<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">SL</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Giá sản phẩm (EUR)</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Thành tiền (EUR)</span></b></p>
</td>


<td style = "border-style: none">&nbsp&nbsp</td>


<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Giá bán lẻ VN <br> có VAT</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">HS</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Point</span></b></p>
</td>
  </tr>`;

    const contentItem = `<tr>
    <td> ${product.supplier.name}</td>
    <td style="text-align:center">1</td>
    <td style="text-align: center;"> <img src=${product.logo}  style="max-width: 200px;"></td>
    <td>${product.name}</td>
    <td>Mã sp</td>
    <td>${product.description}</td>
    <td>${product.size}</td>
    <td>SL</td>
    <td> €    </td>
    <td> €    </td>
    <td style = "border-style: none"></td>
    <td style="text-align:center">0</td>
    <td></td>
    <td></td>
    <tr>`;
    headContent = `${headContent}${contentItem}`;
    const last = ` <tr><td colspan="9" style="background-color: #BFBFBE; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt; 
    -height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Tổng giá sản phẩm EUR(không bao gồm VAT)</span></b></p>
  </td>
  <td style="background-color: #BFBFBE; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
  ${convertCurrency(1000)}
  </p>
  </td>
  </tr>`;
    headContent = `${headContent}${last}`;
    const heightContent = ` <tr><td colspan="9" style="background-color: #BFBFBE; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt; 
    line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
     &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Tổng giá sản phẩm VNĐ(không bao gồm VAT)</span></b></p>
   </td>
   <td style="background-color: #BFBFBE; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
   text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
   ${convertCurrency(20000000)} VND
   </p>
   </td>
   </tr>
   <tr><td colspan="9" style="background-color: #808080; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
     &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Tổng giá sản phẩm VNĐ(bao gồm VAT)</span></b></p>
   </td>
   <td style="background-color: #808080; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
   text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
   ${convertCurrency(22000000)} VND
   </p>
   </td>
   </tr>
     </tbody></table>`;

    headContent = `${headContent}${heightContent}`;
    // product.forEach((i, idx) => {});
    return headContent;
  } catch (error) {
    return '';
  }
}
export async function printTable() {
  const table = `
  <table id="table-excel" style="border: 1px solid; max-width: 100%;  border-spacing: 0;">
  <thead>
      <!-- row1 -->
      <tr>
          <td rowspan="3">STT</td>
          <td rowspan="3">Họ tên</td>
          <td rowspan="3">Mã số BHXH</td>
          <td colspan="2">Ngày tháng năm sinh</td>
          <td rowspan="3">
              Cấp bậc, chức vụ, chức danh, nghề, nơi làm việc
          </td>
          <td rowspan="3">
              Số CMND/CCCD, Hộ chiếu
          </td>
          <td colspan="6" >Tiền lương</td>
          <td rowspan="2" colspan="2">Ngành nghề nặng nhọc độc hại</td>
          <td colspan="5" rowspan="1" >Loại và hiệu lực hợp đông lao động</td>
          <td rowspan="3">Thời điểm đơn vị bắt đầu đóng BHXH</td>
          <td rowspan="3">Thời điểm đơn vị kết thúc đóng BHXH</td>
          <td rowspan="3">Ghi chú</td>
      </tr>
      <!-- row2 -->
      <tr>
          <td rowspan="2"> Nam</td>
          <td rowspan="2">Nữ</td>
          <td rowspan="2"> Hệ số mức lương</td>
          <td colspan="5" >Phụ cấp</td>
          <td rowspan="2">Ngày bắt đầu HĐLĐ không xác định thời hạn</td>
          <td colspan="2">Hiệu lực HĐLĐ xác định thời hạn</td>
          <td colspan="2">Hiệu lực HĐLĐ khác (dưới 1 tháng, thử việc)</td>
      </tr>
      <tr>
          <td>Chức vụ</td>
          <td>Thâm niên VK(%)</td>
          <td>Thâm niên nghề(%)</td>
          <td>Phụ cấp lương</td>
          <td>Các khoản bổ sung</td>
          <td>Ngày bắt đầu</td>
          <td>Ngày kết thúc</td>
          <td>Ngày bắt đầu</td>
          <td>Ngày kết thúc</td>
          <td>Ngày bắt đầu</td>
          <td>Ngày kết thúc</td>
      </tr>
  </thead>
  <tbody>
      <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>4</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
      </tr>

  </tbody>
</table>
<p>Số lao động trên 35 tuổi:</p>
<div style="display: flex; justify-content: space-between;">
  <div style="flex-basis: 70%;">
  </div>
  <div style="flex-basis: 30%; text-align: center; ">
      <h4>
          ĐẠI DIỆN DOANH NGHIỆP, CƠ QUAN, TỔ CHỨC
      </h4>
      <i>(Chữ ký, dấu)</i>
  </div>
</div>
  `;
  return table;
}
export async function formatTemplateSendEmailSalary(content, data, moduleCode, attribute) {
  const date = new Date();
  const table = `
    <table>
      <tbody>
        <tr class="tr_padding">
          <td colspan="6"></td>
        </tr>
        <tr>
          <td>STT</td>
          <td>Các Khoản Thu Nhập</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          
        </tr>
        ${attribute.map(
    (item, index) =>
      `
            <tr>
              <td>${index + 1}</td>
              <td>${item.name}</td>
              <td>{${item.code}}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            `,
  )}
        <tr>
          <td colspan="2">Tổng cộng</td>
          <td>{total}</td>
          <td colspan="2"></td>
          <td></td>
          
          
        </tr>
        <tr class="tr_padding">
          <td colspan="6"></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td>Tổng Số Tiền Lương Thực Nhận</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td></td>
          <td>Bằng chữ:</td>
          <td colspan="4"></td>
        </tr>
      
      
      </tfoot>
    </table>
  `;
  let newContent = content.replace('{sendEmailSalary}', table);
  // convertTemplate({ content: newContent, data, code: moduleCode }).then(element => {
  //   newContent = formatTemplateSendEmail(element).then(
  //     result => result
  //   )
  // });

  // async function formatTemplateSendEmail(element) {
  //   const styles = `
  //     table:nth-child(2), tr, td,td{
  //       border: 1px solid black;
  //     }

  //     table{
  //       border-collapse: collapse;
  //       width: 100%
  //     }
  //     .tr_padding td{
  //       padding: 8px;
  //     }
  //   `;

  //   const newEl = `
  //     <html>
  //       <head>
  //         <style>${styles}</style>
  //       </head>
  //       <body>
  //         ${element}
  //       </body>
  //     </html>
  //   `
  //   return newEl;
  // }

  return newContent;
}
