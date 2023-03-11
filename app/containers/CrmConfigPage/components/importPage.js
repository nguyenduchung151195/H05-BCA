/**
 *
 * ImportPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Icon,
  FormLabel,
  Paper,
  withStyles,
  Button,
  StepLabel,
  Table,
  Stepper,
  Step,
  StepContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
  Grid,
  IconButton,
} from '@material-ui/core';

import { GetAppOutlined, RotateRightOutlined, InsertDriveFile, Close } from '@material-ui/icons';

import XLSX from 'xlsx';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import moment from 'moment';
import _ from 'lodash';
import { select } from 'redux-saga/effects';
import { Dialog as DialogUI } from 'components/LifetekUi';
import makeSelectImportPage from '../../../containers/ImportPage/selectors';
import reducer from '../../../containers/ImportPage/reducer';
import saga from '../../../containers/ImportPage/saga';
// import DragDropFile from '../../components/DragDropFile';
import ImportFile from '../../../components/ImportFile';
// import OutTable from '../../components/OutTable';
import styles from '../../../containers/ImportPage/styles';
import TableHeaderImport from '../../../components/TableHeaderImport';
import TableBodyImport from '../../../components/TableBodyImport';
import ImportResult from '../../../components/ImportResult';
import { importExcel, mergeData } from '../../../containers/ImportPage/actions';
import makeSelectDashboardPage from '../../Dashboard/selectors';
import { API_IMPORT_CRM_CONFIG } from '../../../config/urlConfig';


const makeCols = refstr => {
  const o = [];
  const C = XLSX.utils.decode_range(refstr).e.c + 1;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};

function setDescendantProp(options, value, obj) {
  options.split('.').reduce((r, a, index) => {
    if (typeof r[a] === 'object') return r[a];
    if (options.split('.').length - 1 === index) {
      return (r[a] = value);
    }
    return (r[a] = {});
  }, obj);
  return obj;
}

/* eslint-disable react/prefer-stateless-function */
export class ImportPageConfigCRM extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [] /* Array of Arrays e.g. [["a","b"],[1,2]] */,
      cols: [] /* Array of column objects e.g. { name: "C", K: 2 } */,
      file: null,
      steps: [
        'Bước 1: Tải về một trong các file dưới đây sau đó thêm/ cập nhật dữ liệu của bạn',
        'Bước 2: Tải lên các tập tin từ bước 1 để hoàn thành cập nhật bổ sung dữ liệu của bạn ',
        'Bước 3: Hiện kết quả tải tệp excel ở bước 2, lọc danh sách cần thêm và thực hiện tải        ',
      ],
      methodImport: 'add',
      filterUpdate: '',
      filterImport: 0,
      modelName: '',
      selects: [],
      activeStep: 0,
      fields: [],
      fieldsImport: [],
      fieldObj: {},
      fieldIndexObj: {},
      dateFormat: 'MM/DD/YYYY',
    };
    this.handleFile = this.handleFile.bind(this);
    window.test = moment;
  }

  componentWillMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    let reType = '';
    if (type === 'dynamicForms') {
      reType = 'DynamicForm';
    } else if (type === 'true') {
      reType = 'HrmRecruitment';
    } else {
      reType = type;
    }
    const viewConfigs = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = viewConfigs.find(item => item.code === reType);
    if (currentViewConfig || this.props.columns) {
      let columns = [];
      if (currentViewConfig) {
        columns = currentViewConfig.listDisplay.type.fields.type.columns.filter(i => i.name !== 'avatar');
        let columnsOthers = currentViewConfig.listDisplay.type.fields.type.others;
        columns = [...columns, ...columnsOthers];
      }
      let columnsImport = [];
      if (currentViewConfig) {
        columnsImport = currentViewConfig.listDisplay.type.fields.type.columns.typeImport;
      }

      currentViewConfig && currentViewConfig.listDisplay.type.fields.type.columns.concat(currentViewConfig.listDisplay.type.fields.type.others);
      const fields = this.props.columns ? this.props.columns : columns;
      const fieldObj = _.keyBy(fields, 'name');
      const fieldsImport = columnsImport;
      const fieldIndexObj = {};
      const filed = fields.filter(e => e.importTable === true);
      this.getExportFields(filed).forEach((item, index) => {
        fieldIndexObj[index] = item;
      });

      this.setState({
        fields,
        fieldsImport: fieldsImport,
        fieldObj,
        fieldIndexObj,
        modelName: this.props.modelName ? this.props.modelName : type,
      });
    }
  }

  // shouldComponentUpdate(props) {
  //   const { dashboarPage } = props;
  //   const { sysConf = {} } = dashboarPage;
  //   if (sysConf.dateFomat) {
  //     this.state.dateFormat = sysConf.dateFomat;
  //     return true;
  //   }
  //   return false;
  // }
  importData = () => {
    const { data } = this.state;
    let newData = [];
    for (let i = 1; i < data.length; i++) {
      newData.push({
        code: data[i][0] ? data[i][0] : ' ',
        dataTitle: data[i][1] ? data[i][1] : ' ',
        dataValue: data[i][2] ? data[i][2] : ' ',
        title: data[i][0] ? data[i][0] : ' ',
        module: data[i][3] ? data[i][3] : ' ',
        type: this.props.module.split(' ')[1],
      });
    }

    fetch(API_IMPORT_CRM_CONFIG, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: newData }),
    }).then(response => {
      if (response.status === 200) {
        this.props.callBack();
      }
    });
    // this.props.onImportExcel(body);
  };

  customMapping(value, config, isDisplay) {
    if (config && config.type === 'Date') {
      if (isNaN(value)) {
        const newDate = moment(value, this.state.dateFormat);
        if (newDate.isValid()) {
          if (isDisplay) {
            return newDate.format(this.state.dateFormat);
          }
          return newDate.toISOString();
        }
      } else {
        const newDate = moment()
          .set('years', 1900)
          .startOf('y')
          .add(value, 'd');
        return newDate.format(this.state.dateFormat);
      }
    }
    return value;
  }

  handleFile(file /* :File */) {
    this.setState({ file });
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', cellText: false, cellDates: true });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils
        .sheet_to_json(ws, {
          header: 1,
        })
        .filter(item => item.length !== 0);

      const mappedData = data.map((row, index) => {
        if (index === 0) return row;
        return row.map((cell, cellIndex) => {
          cell = this.customMapping(cell, this.state.fieldIndexObj[cellIndex], true);
          return cell;
        });
      });
      this.setState({ data: mappedData, cols: makeCols(ws['!ref']) });
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  }
  // getDes(type,name){
  //   console.log(type)
  //  const date = moment().format('DD/MM/YYYY')
  //  type.includes("ObjectId") ? this.genMessageForRelationiField(type) : (type === 'String' ? name : (type === 'Date' ? `'${date}` :(type === 'Number' ? 'Nhập số' : name)));
  // //  name === 'gender' ? 'Nam : Male, Nữ : Female': name === 'type' ? '1 : Đến, 2 : Đi' : name;
  // }

  getExportFields = fields =>
    fields.filter(item => {
      if (item.isRequire) return true;

      if (item.name === 'kanbanStatus') {
        return true;
      }

      if (item.type.includes('ObjectId')) {
        return true;
      }
      if (item.name === 'crmStatus') {
        return false;
      }

      return true;
    });

  elToVn(name) {
    const allModule = JSON.parse(localStorage.getItem('allModules'));
    const value = allModule ? Object.entries(allModule) : null;
    const item = value ? value.filter(item => item[0] === name) : null;
    const result = item[0];
    return result ? result[1].title : '';
  }

  renderSource(item) {
    const key = item.type.split('|')[item.type.split('|').length - 1];
    const config = JSON.parse(localStorage.getItem(item.configType));
    if (config) {
      const foundConfigByCode = config.find(i => i.code === item.configCode);
      if (foundConfigByCode) {
        return foundConfigByCode.data
          .map(i => {
            return `${i[key]}:${i.title || i.name}`;
          })
          .join(', ');
      }
    }
    return item.title;
  }

  renderMenu(menu) {
    return menu.map((item, index) => `${item.type}:${item.name}`).join(', ');
  }

  genMessageForRelationiField(type) {
    if (type) {
      const arr = type.split('|');
      if (arr[0] === 'ObjectId') {
        if (arr[2] === 'Array') {
          return `Nhập mã ${this.elToVn(arr[1])} ngăn cách bới dấu ,`;
        }
        return `Nhập mã ${this.elToVn(arr[1])}`;
      }
    }
    return '';
  }

  exportFileFilter = () => {
    function jsUcfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const code = 'IncommingDocument';
    const codeModule = jsUcfirst(code);
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const dataField = viewConfig.find(i => i.code === codeModule);
    const list = dataField.listDisplay.type.fields.type.columns;
    const typeImport = list.find(item => item.name === this.state.filterImport);
    const typeImportData = typeImport ? typeImport.typeImport : null;
    // const list = dataField.listDisplay.type.fields.type.columns
    const { fields, fieldsImport } = this.state;
    const date = moment().format('YYYY/MM/DD');
    let data = this.getExportFields(typeImportData).map(item => ({
      title: this.removeStr(item.title),
      name: item.name,
      des: item.des,
      checked: item.checked,
      checkedRequireForm: item.checkedRequireForm,
      checkedShowForm: item.checkedShowForm,
      isFilter: item.isFilter,
      isRequire: item.isRequire,
      isSort: item.isSort,
      max: item.max,
      maxLength: item.maxLength,
      min: item.min,
      minLength: item.minLength,
      order: item.order,
      type: item.type,
      width: item.width,
      importTable: item.importTable,
      des: item.type.includes('ObjectId')
        ? this.genMessageForRelationiField(item.type)
        : item.name === 'gender'
          ? 'male: Nam, female: Nữ'
          : item.name === 'type'
            ? '1: Đi, 2: Đến'
            : item.type === 'String'
              ? item.name
              : item.type === 'Date'
                ? `'${date}`
                : item.type === 'Number'
                  ? 'Nhập số'
                  : item.type === 'Boolean'
                    ? 'true: đúng, false: sai'
                    : item.name,
    }));

    data = _.uniqBy(data, 'title');
    const title = data.map(e => (e.isRequire === true || e.checkedRequireForm === true ? e.title + '(*)' : e.title));
    const name = data.map(e => (e.isRequire === true || e.checkedRequireForm === true ? e.name + '(*)' : e.name));
    const des = data.map(e => e.des);
    const ws = XLSX.utils.aoa_to_sheet([
      title,
      des,
      ['Các trường dấu (*) là trường bắt buộc!'],
      ["Thêm dấu ' trước số, ngày tháng để không bị mất dữ liệu!"],
    ]);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    // XLSX.utils.sheet_add_aoa(wb['SheetJS'], [
    //   [data]
    // ], { origin: "A2" });

    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, `${this.state.modelName}_ImportTemplate.xlsx`);
  };

  exportFile = () => {
    let typeUrl = this.props.module === ' DocumentConfig' ? true : false;
    let modules = [];
    let inDoc;
    let outDoc;
    if (typeUrl) {
      modules =
        JSON.parse(localStorage.getItem('viewConfig')) &&
        JSON.parse(localStorage.getItem('viewConfig')).map(f => f.api && { value: f.code, api: f.api, title: f.title });
      modules = modules.filter(f => f);
      inDoc = modules[0].value;
      outDoc = modules[1].value;
    }
    var wscols = [{ width: 30 }, { width: 30 }, { width: 30 }];

    const ws = XLSX.utils.json_to_sheet([{ 'Tên cấu hình': ' ', ['Tên loại']: ' ', ['Mã loại']: ' ', [`Module (${inDoc}, ${outDoc})`]: ' ' }]);
    ws['!cols'] = wscols;

    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    XLSX.writeFile(wb, `${this.props.module}.xlsx`);
  };

  handleChangeSelect = e => {
    const { cols } = this.state;
    const index = this.state.selects.findIndex(item => item === e.target.value);
    if (index >= 0) {
      cols[index].value = undefined;
    } else {
      cols[e.target.name].value = e.target.value;
    }

    const selects = cols.map(item => item.value);
    this.setState({ selects, cols });
  };

  handleNext = () => {
    if (this.state.activeStep === 1) {
      document.querySelector('#dialog').style.display = 'block';
    }
    setTimeout(() => {
      this.setState(state => ({
        activeStep: state.activeStep + 1,
      }));
      document.querySelector('#dialog').style.display = 'none';
    }, 100);
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
      selects: [],
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };
  handleChangeImport = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  mapItem = array => {
    array.map((item, index) => (
      <MenuItem key={`${index}`} value={item}>
        Import theo {item.title ? item.title : item.name}
      </MenuItem>
    ));
  };

  getStepContent = step => {
    // const { classes } = this.props;

    function jsUcfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const code = 'IncommingDocument';
    const codeModule = jsUcfirst(code);
    // console.log(code, codeModule);
    let codeField;
    if (codeModule === 'Hrm') {
      codeField = 'hrm';
    } else if (codeModule === 'True') {
      codeField = 'HrmRecruitment';
    } else {
      codeField = codeModule;
    }
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const dataField = viewConfig.find(i => i.code === codeField);
    const list = dataField.listDisplay.type.fields.type.columns;
    const typeImport = list.filter(item => item.typeImport);
    const typeName = typeImport.map(item => `${item.name}`).join('-');

    switch (step) {
      case 0:
        return (
          <div
            style={{
              width: 'calc(100vw - 345px)',
            }}
          >
            <FormLabel style={{ display: 'block', margin: 10 }}>Bạn click vào nút dưới đây để tải file Excel mẫu xuống </FormLabel>
            {typeImport ? (
              <FormControl variant="contained" style={{ marginLeft: 20, maxheight: '38px', minWidth: 300 }}>
                {/* {<InputLabel htmlFor="select-multiple" >Lựa chọn trường để import</InputLabel>} */}
                <Select
                  style={{ height: '38px' }}
                  name="filterImport"
                  title="Lựa chọn trường để import"
                  value={this.state.filterImport}
                  onChange={this.handleChangeImport}
                  input={<OutlinedInput name="age" id="outlined-age-simple" />}
                >
                  {/* {newFields.map(item => (
                           <MenuItem key={item.title} value={item.title}>
                             {`${item.title} - ${item.name}`}
                           </MenuItem>
                         ))} */}
                  <MenuItem value={0}>IMPORT TRƯỜNG MẶC ĐỊNH</MenuItem>
                  {typeImport && typeImport.map(item => <MenuItem value={item.name}>IMPORT {item.title}</MenuItem>)}
                </Select>
              </FormControl>
            ) : null}
            <Button
              style={{ marginLeft: 10 }}
              onClick={!typeImport || !typeName.includes(this.state.filterImport) ? this.exportFile : this.exportFileFilter}
              variant="contained"
              color="primary"
            >
              {/* <Icon style={{ marginRight: 10 }} className="fa fa-file-excel" /> */}
              {/* <InsertDriveFile style={{ marginRight: 10 }} /> */}
              Tải xuống file Excel mẫu
            </Button>
          </div>
        );
      case 1:
        return (
          <div
            style={{
              width: 'calc(100vw - 345px)',
            }}
          >
            <FormLabel>Vui lòng chọn file định dạng .xlsx .xls để tiếp tục bước tiếp theo </FormLabel>
            <ImportFile handleFile={this.handleFile} fileName={this.state.file ? this.state.file.name : ''} />
          </div>
        );
      case 2:
        let newFields = this.getExportFields(this.state.fields);
        newFields = newFields.map(e => {
          const { name, title } = e;
          return {
            ...e,
            title: this.removeStr(title),
            // name: this.removeStr(name)
          };
        });
        // newFields = _.uniqBy(newFields, 'title');
        const newFieldsFilter = newFields.filter(e => e.importTable === true);
        const fileds = newFields.filter(i => i.name === 'code' || i.name === 'name');
        let filed = [];
        if (fileds.length > 1) {
          filed = fileds.filter(i => i.name === 'code');
        } else {
          filed = fileds;
        }
        const typeImport1 = list.find(item => item.name === this.state.filterImport);
        const typeImportData = typeImport1 ? typeImport1.typeImport : '';
        let newFieldsImport = typeImportData ? this.getExportFields(typeImportData) : null;
        const filedsFilter = newFieldsImport ? newFieldsImport : null;

        return (
          <div>
            <Paper
              style={{
                width: 'calc(100vw - 345px)',
                height: '500px',
                overflow: 'scroll',
              }}
            >
              <Table>
                <TableBodyImport
                  disableCheckbox
                  data={this.state.data}
                  cols={this.state.cols}
                  fields={!typeImport || !typeName.includes(this.state.filterImport) ? newFieldsFilter : newFieldsImport}
                />
              </Table>
            </Paper>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  onCancle = () => {
    this.props.history.goBack();
  };

  removeStr = str => {
    let newStr = str;
    newStr = newStr.slice(-3) === '_en' ? newStr.substr(0, newStr.length - 3) : newStr;
    newStr = newStr.slice(-3) === 'Str' ? newStr.substr(0, newStr.length - 3) : newStr;
    return newStr;
  };

  getEnableFilter = () => {
    const enableFilter = this.state.modelName !== 'Employee';
    return enableFilter;
  };

  render() {
    const { classes, importPage, onMergeData } = this.props;
    const { openCountDialog, importCount, importedCount, flagDialog } = importPage;
    const { activeStep, steps } = this.state;
    document.getElementsByTagName('body')[0].style.overflow = 'auto';
    const disableNextButton = activeStep === 1 && (!this.state.file || ['xlsx', 'xls'].indexOf(this.state.file.name.split('.').pop()) === -1);

    return (
      <>
        <Grid container style={{ justifyContent: 'flex-end' }}>
          <IconButton onClick={() => this.props.onClose()}>
            <Close />
          </IconButton>
        </Grid>
        <Paper>
          <DialogUI
            title="Thông báo"
            onSave={() => {
              onMergeData({ flagDialog: false });
              this.importData();
            }}
            open={flagDialog}
            onClose={() => onMergeData({ flagDialog: false })}
            saveText="Đồng ý"
            style={{ position: 'relative' }}
          >
            <h4 style={{ textAlign: 'center' }}>Số điện thoại đã bị trùng, tiếp tục?</h4>
          </DialogUI>

          <Dialog id="dialog" style={{ display: 'none' }} open aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">Đang xử lý tệp Excel, vui lòng chờ ...</DialogContentText>
              <DialogContentText style={{ textAlign: 'center' }}>
                {/* <Icon style={{ margin: 10, color: 'green' }} className="fa fa-spinner fa-pulse" /> */}
                {/* <RotateRightOutlined style={{ margin: 10, color: 'green' }} /> */}
                <CircularProgress style={{ margin: 10, color: 'green' }} />
              </DialogContentText>
            </DialogContent>
          </Dialog>

          <Dialog id="dialog" open={openCountDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
              Thông báo
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description" style={{ textAlign: 'center' }}>
                Đang tải lên dữ liệu, vui lòng chờ ...
              </DialogContentText>
              <DialogContentText id="alert-dialog-description" style={{ textAlign: 'center' }}>
                {importCount !== null && `${importCount}/${importedCount}`}
              </DialogContentText>
              <DialogContentText style={{ textAlign: 'center' }}>
                <CircularProgress style={{ margin: 10, color: 'green' }} />
              </DialogContentText>
            </DialogContent>
          </Dialog>

          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {this.getStepContent(activeStep)}
                  <Grid className={classes.actionsContainer} container>
                    {/* disabled={activeStep === 0} */}
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={activeStep === 0 ? (this.props.onClose ? this.props.onClose : this.onCancle) : this.handleBack}
                        className={classes.button}
                      >
                        Trở lại
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={activeStep !== 2 ? this.handleNext : this.importData}
                        disabled={disableNextButton}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1 ? 'Tiến hành import' : 'Tiếp theo'}
                      </Button>
                    </Grid>
                    <Grid item style={{ marginTop: 10, marginLeft: 10 }}>
                      <ImportResult {...importPage} />
                    </Grid>
                  </Grid>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>All steps completed - you&quot;re finished</Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </Paper>
          )}
        </Paper>
      </>
    );
  }
}

ImportPageConfigCRM.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  importPage: makeSelectImportPage(),
  dashboarPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onImportExcel: data => {
      dispatch(importExcel(data));
    },
    onMergeData: data => {
      dispatch(mergeData(data));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'importPage', reducer });
const withSaga = injectSaga({ key: 'importPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(ImportPageConfigCRM);
