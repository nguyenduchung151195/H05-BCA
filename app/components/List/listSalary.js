import React, { useState, useEffect, useRef } from 'react';
import {
  Fab as Fa,
  TablePagination,
  InputAdornment,
  TextField as MuiTextField,
  Menu,
  MenuItem,
  Checkbox,
  Typography,
  Button,
  Tooltip,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Dialog as Dialogg,
  Grid as Gridd
} from '@material-ui/core';
import XLSX from 'xlsx';
import './CustomCSS.css';
import './CustomCSS2.css';

import {
  Visibility,
  Delete,
  ImportExport,
  Add,
  Edit,
  FilterList,
  Dehaze,
  Archive,
  Share,
  CloudUpload,
  Lock,
  LockOpen,
  CloudDownload,
} from '@material-ui/icons';
import {
  SortingState,
  IntegratedSorting,
  IntegratedFiltering,
  IntegratedSelection,
  SelectionState,
  TreeDataState,
  CustomTreeData,
  DataTypeProvider,
  DataTypeProviderProps,
  PagingState,
  IntegratedPaging,
  CustomPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  DragDropProvider,
  Table,
  VirtualTable,
  TableHeaderRow,
  TableColumnReordering,
  TableFixedColumns,
  TableSelection,
  TableTreeColumn,
  TableColumnResizing,
  TableEditRow,
  TableBandHeader,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import {
  API_VIEW_CONFIG,
  API_APPROVE_GROUPS,
  API_APPROVE,
  API_COMMON_APPROVE_FINISH,
  API_USERS,
  API_CUSTOMERS,
  API_MAIL,
  API_FIELD,
  API_ORIGANIZATION,
  API_SMS1,
  API_CHANGE_PASSWORD_PERSON,
  API_ROLEAPP_CHANGE_PASSWORD_PERSON,
  API_ROLE_APP,
  API_COMMENT,
} from 'config/urlConfig';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/ItemGrid';
import { Link } from 'react-router-dom';
import Dialog from 'components/Modal/DialogAsync';
import AddProjects from 'containers/AddProjects';
import { TextField as Input, Dialog as DialogUI, SwipeableDrawer, AsyncAutocomplete, Loading, AssignTask } from 'components/LifetekUi';
import Snackbar from 'components/Snackbar';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { clearWidthSpace } from '../../utils/common';
import _ from 'lodash';
import makeSelectDashboardPage, { makeSelectProfile, makeSelectMiniActive } from '../../containers/Dashboard/selectors';

import { convertDot, serialize, convertOb, printTemplte, printTemplteExcel, fetchData, getDataBeforeSend, convertDotOther, flatChild } from '../../helper';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import { SAVE_VIEWCONFIG_ON_RESIZE_DELAY } from '../../utils/constants';
import { clientId } from '../../variable';
import { tableToExcelCustom, tableToPDF } from '../../helper';
import CustomInputField from '../Input/CustomInputField';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import EmailDialog from './EmailDialog';
import SMSDialog from './SMSDialog';
import ExtendHanleDialog from './ExtendHanleDialog';
import AddHandleDialog from '../DocumentAssignModal/DocumentAddMoreProcessors';
import { changeSnackbar } from '../../containers/Dashboard/actions';
import CustomDatePicker from 'components/CustomDatePicker';
import { API_ADD_TASK_DOCUMENT, API_UPDATE_ALL_SYSTEM, APP_URL, API_INCOMMING_DOCUMENT } from '../../config/urlConfig';
import TaskDocs from '../../containers/AddSignedDocument/components/TaskDocs';
import request from '../../utils/request';

const Process = ({ title, value, color }) => (
  <Tooltip title={title}>
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 10, width: '100%', borderRadius: 2 }}>
      <div style={{ width: `${value}%`, background: `${color}`, height: '100%' }} />
      <div style={{ width: `${100 - value}%`, height: '100%', background: '#9e9e9e75' }} />
    </div>
  </Tooltip>
);

function getChildRows(row, rootRows) {
  const childRows = rootRows.filter(r => r.parentId == (row ? row._id : null));
  return childRows.length ? childRows : null
}

const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right', boxShadow: 'none', padding: 0, margin: ' 0 5px', height: 35, width: 35 },
};
const TextFieldUI = props => <MuiTextField {...props} />;
TextFieldUI.defaultProps = {
  size: 'small',
};
const TextField = props => <Input {...props} />;
TextField.defaultProps = {
  size: 'small',
};
function DragColumn({ draggingEnabled, sortingEnabled, ...rest }) {
  if (rest.column.name === 'edit') return <TableHeaderRow.Cell {...rest} sortingEnabled={false} draggingEnabled={false} />;
  return <TableHeaderRow.Cell sortingEnabled draggingEnabled={draggingEnabled} {...rest} />;
}

const ExportTable = React.memo(
  ({ filters, filter, filter1, filter2, open, onClose, apiUrl, moduleCode, kanban, viewConfigUpdateTime, exportUrl, customDataExport }) => {
    const url = exportUrl || apiUrl;
    const [listDer, setListDer] = useState([])

    const [dataPageExcell, setDataPageExcell] = useState({
      data: [],
      totalPage: 1,
      pageNumber: 1,
      numberOrderFirstPage: 1,
    });
    const [viewConfigData, setViewConfigData] = useState([
      { name: "stt", order: 0, title: "STT", title_init: "STT", type: "String", width: 50 },
      { name: "dateCommon", order: 1, title: "Ngày", title_init: "Date", type: "String", width: 50 },
      { name: "orgName", order: 2, title: "Đơn vị", title_init: "orgName", type: "String", width: 50 },
      { name: "acount", order: 3, title: "Tổng sĩ số", title_init: "count", type: "String", width: 50 },
      { name: "mission", order: 4, title: "Công tác", title_init: "mission", type: "String", width: 50 },
      { name: "training", order: 5, title: "Đi học", title_init: "training", type: "String", width: 50 },
      { name: "onLeave", order: 6, title: "Nghỉ phép", title_init: "Nghỉ phép", type: "String", width: 50 },
      { name: "sickLeave", order: 7, title: "Nghỉ ốm", title_init: "onLeave", type: "String", width: 50 },
      { name: "maternityLeave", order: 8, title: "Nghỉ thai sản", title_init: "maternityLeave", type: "String", width: 50 },
      { name: "vacationLeave", order: 9, title: "Nghỉ chế độ", title_init: "vacationLeave", type: "String", width: 50 },
      { name: "otherLeave", order: 10, title: "Nghỉ khác", title_init: "otherLeave", type: "String", width: 50 },


    ]);

    const { data, totalPage, pageNumber, numberOrderFirstPage } = dataPageExcell;

    // useEffect(
    //   () => {
    //     if (moduleCode) {
    //       const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    //       const list = viewConfig.find(item => item.code === moduleCode);
    //       const data = (list && list.listDisplay && list.listDisplay.type.fields.type.columns) || [];
    //       const others = (list && list.listDisplay && list.listDisplay.type.fields.type.others) || [];
    //       const exportColumns = data && data.concat(others).filter(c => c.exportTable);
    //       setViewConfigData(exportColumns);
    //     }
    //   },
    //   [viewConfigUpdateTime],
    // );
    useEffect(
      () => {
        if (url && open) {
          getDataFirstTime();
        }
      },
      [filters, open],
    );
    useEffect(() => {
      fetchData(API_ORIGANIZATION).then((res) => {
        const flattedDepartment = flatChild(res);
        setListDer(flattedDepartment)

      })
    }, [])
    const getDataFirstTime = async () => {
      try {
        const filterLinK = filters.slice(9, filters.length);
        const query = serialize({ filters, filter, filter1, filter2 });
        let arr = [];
        viewConfigData.forEach(item => {
          arr.push(item.name);
        });
        const selectors = _.join(arr, ' ');
        let apiUrl;
        if (url.includes('?')) {
          apiUrl = `${url}&selector=${selectors}&${filterLinK}`;
        } else {
          apiUrl = `${url}?selector=${selectors}&${filterLinK}`;
        }

        const res = await fetchData(apiUrl);
        const numberRecordLimitBackEnd = res.limit;
        if (!res.data) throw res;
        let dataExport = res.data || []
        let parent = res.parent || {}
        if (customDataExport && typeof customDataExport === 'function') {
          dataExport = customDataExport(dataExport, parent);
        }
        if (res.count > numberRecordLimitBackEnd) {
          const numberTotalPageLimitBackEnd = Math.ceil(res.count / numberRecordLimitBackEnd);
          for (let i = 0; i < numberTotalPageLimitBackEnd; i++) {
            await getDataPagination(numberRecordLimitBackEnd * i, numberRecordLimitBackEnd, numberTotalPageLimitBackEnd, i + 1);
          }
        } else {
          console.log(dataExport, 'dataExport')
          setDataPageExcell({ ...dataPageExcell, data: dataExport, totalPage: 1, pageNumber: 1, numberOrderFirstPage: 1 });
          onClose({ lastPage: true });
        }
      } catch (err) {
        onClose({ res: err, error: true, lastPage: true });
      }
    };

    const getDataPagination = async (skip, limit, totalPage, pageNumber) => {
      const lastPage = totalPage === pageNumber;
      try {
        let arr = [];
        viewConfigData.forEach(item => {
          arr.push(item.name);
        });
        const selectors = _.join(arr, ' ');
        let apiUrl;
        if (url.includes('?')) {
          apiUrl = `${url}&${selectors}&${filters}`;
        } else {
          apiUrl = `${url}?${selectors}&${filters}`;
        }
        const res = await fetchData(apiUrl);
        if (!res.data) throw res;
        let dataExport = res.data || []
        let parent = res.parent || {}
        if (customDataExport && typeof customDataExport === 'function') {
          dataExport = customDataExport(dataExport, parent);
        }
        if (data.length === 0) data = listData
        setDataPageExcell({ ...dataPageExcell, data: dataExport, totalPage: totalPage, pageNumber: pageNumber, numberOrderFirstPage: skip + 1 });
        onClose({ totalPage, pageNumber, lastPage });
      } catch (err) {
        onClose({ error: true, lastPage });
      }
    };
    let dataKey = [];
    data.map(item => {
      dataKey.push(Object.keys(item));
    });
    return (
      <React.Fragment>
        {open ? <Loading /> : null}
        <div id={moduleCode + kanban} style={{ display: 'none' }}>
          <table>
            <tbody>
              <tr>
                <td />
                <td>Ngày xuất báo cáo:</td>
                <td>{moment().format('DD/MM/YYYY')}</td>
              </tr>
              <tr />
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                {/* <th style={{ width: 80 }}>STT</th> */}

                {/* <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colspan='4' style={{ textAlign: 'center' }}><h5>NV chưa hoàn thành (đạt tỷ lệ %)</h5></td>
                  <td colspan='4' style={{ textAlign: 'center' }}><h5>NV đã hoàn thành (đạt tỷ lệ %)</h5></td>
                </tr> */}
                {viewConfigData.map(cols => (
                  <th style={{ width: cols.width }}>{cols.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                return (
                  <tr>
                    {/* <td style={{ width: 80 }}>{index + 1}</td> */}

                    {viewConfigData.map(cols => (
                      <td
                        style={{
                          width: cols.width,
                          textAlign: cols.type === 'Date' || cols.type === 'Number' ? 'center' : null,
                          paddingTop: cols.type === 'Number' ? '10px' : null,
                          paddingRight: cols.type === 'Number' ? 0 : null,
                        }}
                      >
                        {cols.title === "STT" ? index + 1 : typeof row[cols.name] === 'string' || typeof row[cols.name] === 'number' ? row[cols.name] : ''}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td style={{ textAlign: 'center', background: '#959a95' }}>Trang số </td>
                <td style={{ textAlign: 'center', background: '#959a95' }}>{pageNumber}</td>
              </tr>
              <tr>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td style={{ textAlign: 'center', background: '#959a95' }}>Tổng số trang</td>
                <td style={{ textAlign: 'center', background: '#959a95' }}>{totalPage}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </React.Fragment>
    );
  },
);

class ListPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timeout = 0;

    this.state = {
      html: [],
      htmlTotal: 0,
      reload: 0,
      exportAnchor: null,
      openExport: null,
      columns: [],
      show: true,
      columnOrder: [],
      rows: [],
      selected: [],
      dialogStatus: false,
      shareDialog: false,
      activePage: 0,
      perPage: 50,
      search: '',
      searchClient: '',
      deleteDialog: false,
      currentPage: 0,
      loading: true,
      open: false,
      totalRows: [],
      anchorEl: null,
      variant: 'success',
      message: '',
      sorting: [{ columnName: 'updatedAt', direction: 'desc' }],
      filters: [],
      count: 0,
      anchorElAction: false,
      importExport: this.props.importExport
        ? `/import?type=${this.props.importExport}`
        : this.props.code && !this.props.parentCode
          ? `/import?type=${this.props.code}`
          : null,
      id: null,
      isChecked: false,
      isCheckedNo: false,
      itemCurrent: { originItem: '' },
      openDialogApprove: false,
      kanbanList: [],
      columnExtensions: this.props.columnExtensions,
      rightColumns: this.props.rightColumns,
      employessCustomer: [],
      hasPermissionViewConfig: false,
      innerFilter: {},
      queryFilter: null,
      firstLoad: true,
      filterAdvance: {},
      valueFilter: 0,
      dayOfBirth: 0,
      monthOfBirth: 0,
      yearOfBirth: 0,
      fileColumns: [],
      checkRecallDocs: false,
      filterDate_startDatee: "",
      filterDate_endDatee: "",
      filterDate_endDateee: "",
      filterDate_startDateee: ""

    };
    this.getLimit = this.getLimit.bind(this);
    this.getPage = this.getPage.bind(this);
  }

  componentDidMount() {
    const viewCf = JSON.parse(localStorage.getItem('viewConfig')) && JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === this.props.code);
    const listDisplays = _.get(viewCf, 'listDisplay.type.fields.type.columns', []);
    // const allList = listDisplays.filter(item => item.checked === true && item.type === 'String' && item.enabaleSearch === true);
    const allList = listDisplays

    let listName = [];
    allList.forEach(item => {
      listName.push(item.name);
    });
    this.setState({ filters: listName });
    let kanbanList = [];
    const x =
      this.props.kanban && this.props.status && JSON.parse(localStorage.getItem([this.props.status]))
        ? JSON.parse(localStorage.getItem([this.props.status])).find(item => item.code === this.props.kanban)
        : null;

    if (x) {
      kanbanList = x.data;
    }
    if (this.props.code && !this.props.columns) {
      try {
        const { dashboardPage } = this.props;
        let currentRole;
        if (dashboardPage.role.roles) {
          currentRole = dashboardPage.role.roles.find(
            item => item.codeModleFunction === this.props.code || item.codeModleFunction === this.props.parentCode,
          );
        }
        let functionAllow = [];
        if (currentRole) {
          functionAllow = currentRole.methods.filter(item => item.allow).map(item => item.name);
        }
        if (functionAllow.includes('VIEWCONFIG')) {
          this.state.hasPermissionViewConfig = true;
        } else {
          this.state.hasPermissionViewConfig = false;
        }
      } catch (error) { }
      const code = this.props.code;
      this.getDataAsynce(code, kanbanList);
    } else {
      this.setState(
        {
          columns: this.props.columns && this.props.columns.concat({ name: 'edit', checked: !this.props.disableEdit, title: 'Hành động' }),
          loading: true,
          kanbanList,
        },
        () => {
          if (this.props.client) {
            this.getData({ loading: false });
          } else {
            this.loadData();
          }
        },
      );
    }
    if (this.props.profile && this.props.code) {
      fetchData(`${API_ROLE_APP}/${this.props.code}/${this.props.profile._id}`).then(res => {
        const { roles } = res;
        const code = 'BUSSINES';
        const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
        if (foundRoleDepartment) {
          let { data } = foundRoleDepartment
          if (this.props.rootTab && data && Array.isArray(data) && data.length > 0) {
            let roottab = this.props.rootTab
            if (roottab === "processors")
              roottab = "processing"
            else if (roottab === "supporters")
              roottab = "support"
            else if (roottab === "viewers")
              roottab = "view"
            else if (roottab === "commander")
              roottab = "command"
            let role = data.find(element => element.name === roottab);
            this.setState({ checkRecallDocs: role.data.recallDocs })
          }
        }

      })

    }

  }

  getDataAsynce = async (code, kanbanList) => {
    const view = await JSON.parse(localStorage.getItem('viewConfig')) && JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === code);
    if (view) {
      const columns = view.listDisplay.type.fields.type.columns;
      const fileColumns = view.listDisplay.type.fields.type.fileColumns;
      const others = view.listDisplay.type.fields.type.others.map(item => ({ ...item, tp: 1 }));
      const newCls = [...columns, ...others, { name: 'edit', checked: !this.props.disableEdit, title: 'Hành động' }];
      const columnOrder = newCls
        .sort((a, b) => a.order - b.order)
        .map(item => item.name)
        .concat(['edit']);
      this.setState({ columns: newCls, columnOrder, fileColumns, loading: true, kanbanList, filterField: view.filterField }, () => {
        if (this.props.client) {
          this.getData({ loading: false });
        } else {
          this.loadData();
        }
      });
    } else {
      alert('Mã code bị lỗi');
    }
  };

  changeMutil(value) {
    this.setState({ employessCustomer: value });
  }

  getItemConfig = item => {
    let itemConfig = {};
    if (item.filterConfig && item.filterConfig[this.props.filter[this.state.filterField]]) {
      itemConfig = item.filterConfig[this.props.filter[this.state.filterField]];
    }
    const newItem = { ...item, ...itemConfig };
    return newItem;
  };

  componentDidUpdate(preProps, preState) {
    let reload = this.props.reload !== preProps.reload;
    if (
      this.props.dashboardPage &&
      this.props.dashboardPage.docUpdated &&
      this.props.dashboardPage.docUpdated.data &&
      preProps.dashboardPage.docUpdated &&
      this.props.dashboardPage.docUpdated.moduleCode === this.props.code &&
      preProps.dashboardPage.docUpdated.data !== this.props.dashboardPage.docUpdated.data
    ) {
      reload = true;
    }
    if (typeof this.lastQuery !== 'undefined' || this.props.client) {
      this.loadData(reload);
    }

    let checker = false;
    if (this.state.filterField) {
      if (
        (!preProps.filter || typeof preProps.filter[this.state.filterField] === 'undefined') &&
        this.props.filter &&
        typeof this.props.filter[this.state.filterField] !== 'undefined'
      ) {
        checker = true;
      } else if (
        this.props.filter &&
        typeof this.props.filter[this.state.filterField] !== 'undefined' &&
        (this.props.filter[this.state.filterField] !== preProps.filter[this.state.filterField] || this.state.firstLoad)
      ) {
        checker = true;
      }
      if (checker) {
        const code = this.props.code;
        const view = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === code);
        if (view) {
          const columns = view.listDisplay.type.fields.type.columns.map(this.getItemConfig);
          const others = view.listDisplay.type.fields.type.others.map(item => ({ ...item, tp: 1 })).map(this.getItemConfig);
          const newCls = [...columns, ...others, { name: 'edit', checked: !this.props.disableEdit, title: 'Hành động' }];
          const columnOrder = newCls
            .sort((a, b) => a.order - b.order)
            .map(item => item.name)
            .concat(['edit']);
          this.setState({ columns: newCls, columnOrder, firstLoad: false });
        }
      }
    }
    const { html, htmlTotal, openImport, search, filters } = this.state;
    if ((html && html.length > 0) & (htmlTotal !== 0)) {
      if (html.length === htmlTotal) {
        for (let index = 0; index < htmlTotal; index++) {
          const win = window.open();
          if (win) {
            win.document.write(html[index].content);
            win.document.close();
            win.print();
          } else {
            return;
          }
        }
        this.setState({ html: [] });
        this.setState({ htmlTotal: 0 });
      }
    }

    if (preState.openImport && !openImport) {
      this.setState({ reload: reload + 1 });
    }
  }

  handleCloseExportTable = payload => {

    const { openExport } = this.state;
    if (payload && payload.lastPage) this.setState({ openExport: null });
    if (payload && payload.error) {
      if (payload.res && payload.res.message) {
        const { message } = payload.res;
      }
      return;
    }

    switch (openExport) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = payload || {};
        const content = tableToPDF(`${this.props.code}${this.props.kanban}`, this.props.code);
        this.setState({ html: [...this.state.html, { content, pageNumber }], htmlTotal: totalPage });
        break;
      default:
        tableToExcelCustom(`${this.props.code}${this.props.kanban}`, 'W3C Example Table', this.props.code, "", "Tra cứu thống kê", 9);
    }
  };

  getLimit(limit) {
    let pageSize = limit && limit;
    this.setState({ perPage: pageSize });
  }
  getPage(page) {
    let currentPage = page && page;
    this.setState({ currentPage: currentPage });
  }

  loadData = (reload = false) => {
    if (reload) {
      this.getData();
      return;
    }
    if (this.props.client) return;
    const queryString = this.queryString();
    if (queryString === this.lastQuery) {
      this.setState({ loading: false });
      return;
    }
    this.getData();
    this.lastQuery = queryString;
  };

  getData = dt => {
    if (this.props.noData) {
      return this.setState({ count: 0, rows: [], selected: [] });
    }
    const {
      mapFunction,
      customFunction,
      apiUrl,
      disableDot,
      isRecall = false,
      client,
      filter,
      filterCan,
      noQuery,
      isUserPage = false,
      codeStatus,
    } = this.props;
    const { kanbanList } = this.state;
    if (!apiUrl) {
      this.setState(dt);
      return;
    }
    let query = this.queryString();
    let queryClient = serialize({ filter });
    let queryClientCan = serialize({ filterCan });
    let URL;
    if (apiUrl.includes('?')) {
      URL = noQuery
        ? `${apiUrl}`
        : filterCan
          ? `${apiUrl}&${queryClientCan}`
          : client
            ? `${apiUrl}&${queryClient}`
            : codeStatus
              ? `${apiUrl}?${query}&codeStatus=${codeStatus}`
              : `${apiUrl}&${query}`;
    } else {
      URL = noQuery
        ? `${apiUrl}`
        : filterCan
          ? `${apiUrl}?${queryClientCan}`
          : client
            ? `${apiUrl}?${queryClient}`
            : codeStatus
              ? `${apiUrl}?${query}&codeStatus=${codeStatus}`
              : `${apiUrl}?${query}`;
    }

    fetch(URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(async data => {
        let newList;
        let parent;
        let enableEdit = false;
        if (data.parent) {
          parent = data.parent
        }
        if (data.data) {
          enableEdit = data.enableEdit;
          newList = data.data;
        } else newList = data;
        if (!disableDot)
          newList = newList && newList.map(item => {
            if (item.gender === '0') {
              item.gender = 'Nam';
            } else if (item.gender === '1') {
              item.gender = 'Nữ';
            }
            const { others, ...restItem } = item;
            const newItem = {
              ...restItem,
              others: {
                ...convertDotOther(others),
              },
            };
            return convertDot({ ob: newItem, newOb: { originItem: item }, convertArr: true });
          });

        let kanbanStatus = [];
        let max = 1;

        if (this.props.kanban) {
          kanbanStatus = convertOb(kanbanList, this.props.kanbanKey);
          kanbanList.forEach(element => {
            if (element.code > max) max = element.code;
          });
        }
        newList = newList.map(it => {
          let result;
          let kbStatus = 'gg';
          if (this.props.kanban) {
            kanbanStatus = convertOb(kanbanList, this.props.kanbanKey);
            let max = 1;
            kanbanList.forEach(element => {
              if (element.code > max) max = element.code;
            });
            let value = 0;
            let color = 'red';
            let title = 'Không xác định';
            if (kanbanStatus[it.kanbanStatus]) {
              value = ((100 * kanbanStatus[it.kanbanStatus].code) / max).toFixed();
              color = kanbanStatus[it.kanbanStatus].color;
              title = kanbanStatus[it.kanbanStatus].name;
            }
            kbStatus = (
              <Typography title={title} style={{ color: color }}>
                {' '}
                {title}{' '}
              </Typography>
            );
          }

          switch (it.state) {
            case '0':
              result = <p style={{ color: '#d6810b', fontWeight: 'bold' }}>Đang yêu cầu phê duyệt</p>;
              break;
            case '1':
              result = (
                <Tooltip title="Click vào để hoàn thành">
                  <Button variant="outlined" color="primary" onClick={() => this.handleApproveTable(it._id)}>
                    Đã phê duyệt
                  </Button>
                </Tooltip>
              );
              break;
            case '2':
              result = <p style={{ color: '#d60b0b', fontWeight: 'bold' }}>Không phê duyệt</p>;
              break;
            case '3':
              result = <p style={{ color: '#340bd6', fontWeight: 'bold' }}>Không yêu cầu phê duyệt</p>;
              break;
            case '4':
              result = <p style={{ color: 'rgb(16, 109, 10)', fontWeight: 'bold' }}>Hoàn thành</p>;
              break;
            default:
              result = <p>Không xác định</p>;
              break;
          }

          return {
            ...it,
            edit: this.addEdit(it._id, it, enableEdit, it.endDate, it.status),
            state: result,
            kanbanStatus: !this.props.noKanban ? (!isRecall ? kbStatus : it.kanbanStatus) : it.kanbanStatus,
          };
        });
        if (isUserPage === false) {
          if (mapFunction) newList = newList && newList.map(mapFunction);
        } else {
          if (mapFunction) newList = await Promise.all(newList.map(mapFunction));
        }
        if (customFunction) newList = customFunction(newList, parent, this.state.currentPage);
        const count = client ? newList.length : data.count;
        if (client) {
          const { perPage, activePage, searchClient } = this.state;
          this.setState({ count, totalRows: newList, loading: false, ...dt }, () => this.client({ perPage, activePage, searchClient }));
        } else {
          let rowss = []

          newList.map((el, index) => {
            rowss.push({ stt: index + 1, ...el })
          })
          const newState = {
            ...dt,
            rows: rowss,
            loading: false,
            count,
            selected: [],
          };
          this.setState(newState);
        }
      })
      .catch(err => {
        // console.log('List page mapping error', err);
        this.props.onChangeSnackbar && this.props.onChangeSnackbar({ variant: 'error', message: 'Lấy dữ liệu thất bại', status: true });
        this.setState({ loading: false });
      });
  };

  handleApproveTable = id => {
    this.setState({ openDialogApprove: true, id });
  };

  queryString = () => {
    const { typeContract, taskId, isReport = false, regexSearch } = this.props;
    const { sorting, perPage, activePage, search, filters, innerFilter, monthOfBirth, yearOfBirth, currentPage } = this.state;
    let filter;

    if (this.props.typeContract) {
      filter = '';
    } else {
      filter = { ...this.props.filter, ...innerFilter };
    }
    if (regexSearch && this.props.filterData.length > 0) {
      this.props.filterData.forEach((i, index) => {
        if (i[0] === 'startDate') {
          {
            filter['documentDate'] = {
              $gte: moment(i[1])
                .startOf('days')
                .toISOString(),
            };
          }
        } else if (i[0] === 'endDate') {
          {
            filter['documentDate'] = {
              ...filter['documentDate'],
              $lte: moment(i[1])
                .endOf('days')
                .toISOString(),
            };
          }
        } else {
          {
            filter[i[0]] = { $regex: i[1], $options: 'gi' };
          }
        }
      });
    }
    // console.log(innerFilter, "innerFilter", filter)
    const rex = `${search}`;
    if (search) {
      filter.$or = filters.map(i => ({ [i]: { $regex: rex, $options: 'gi' } }));
    }
    const skip = perPage * currentPage;
    const queryParams = this.props.queryParams ? this.props.queryParams : {};
    const columnSorting = sorting[0].direction === 'asc' ? sorting[0].columnName : `-${sorting[0].columnName}`;
    let query;
    if (this.props.typeContract) {
      query = { limit: perPage, skip, typeContract, taskId };
    } else {
      query = { limit: perPage, skip, sort: columnSorting };
    }
    if (this.props.parent) {
      query = { limit: perPage, skip, parent: true, sort: columnSorting };
    } else {
      query = { limit: perPage, skip, sort: columnSorting };
    }
    query.filter = filter;
    if (this.props.filterType) {
      const { $or, filter: oldFilter, ...rest } = filter;
      query = { ...query, ...rest, filter: { ...oldFilter, $or: { ...$or } } };
      this.setState({ queryFilter: query });
    }

    if (this.props.filterStartEnd) {
      const str = this.props.filterStartEnd;
      delete query['filter'][str];
      if (this.state.filterDate_startDate) {
        if (!['filter'][str]) query['filter'][str] = {};
        query['filter'][str]['$gte'] = moment(this.state.filterDate_startDate, 'YYYY-MM-DD').toISOString();
      }
      if (this.state.filterDate_endDate) {
        if (!query['filter'][str]) query['filter'][str] = {};
        query['filter'][str]['$lt'] = moment(this.state.filterDate_endDate, 'YYYY-MM-DD')
          .add(1, 'day')
          .toISOString();
      }
    }

    if (this.props.filterStartEnd && Array.isArray(this.props.filterStartEnd)) {
      const str = this.props.filterStartEnd;
      delete query['filter'][str];
      if (this.state.filterDate_startDate) {
        if (!['filter']['startDate']) query['filter']['startDate'] = {};
        query['filter']['startDate'] = moment(this.state.filterDate_startDate).format('YYYY-MM-DD');
      }
      if (this.state.filterDate_endDate) {
        if (!query['filter']['endDate']) query['filter']['endDate'] = {};
        query['filter']['endDate'] = moment(this.state.filterDate_endDate).add(1, 'day').format('YYYY-MM-DD');
      }
    }
    // console.log(query, 'query')

    query = { ...queryParams, ...query };
    const queryString = serialize(query);
    this.setState({ queryFilter: queryString });
    return queryString;
  };

  deleteItem = () => {
    const deleteUrl = this.props.deleteUrl ? this.props.deleteUrl : this.props.apiUrl;
    const deleteOption = this.props.deleteOption;
    const URL = deleteUrl;
    const { selected = [] } = this.state;
    const list = this.state.rows.filter((item, index) => selected.includes(index)).map(i => i._id);
    fetch(URL, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [deleteOption]: list }),
    })
      .then(respon => {
        if (respon.status == 200) {
          return respon.json().then(res => {
            this.getData({ open: true, variant: 'success', message: 'Xóa thành công' });
            this.props.onSuccess && this.props.onSuccess();
          });
        } else {
          return respon.json().then(res => {
            this.setState({
              loading: false,
              open: true,
              variant: 'error',
              message: res.status === 0 && res.message ? res.message : 'Xóa không thành công',
            });
          });
        }
      })
      .catch(() => this.setState({ loading: false, open: true, variant: 'error', message: 'Không có phản hồi, kiểm tra lại kết nối' }));
  };

  changeColumnOrder = newOrder => {
    const columns = this.state.columns;
    const newColumns = columns.map(item => ({ ...item, order: newOrder.indexOf(item.name) }));
    this.setState({ columnOrder: newOrder });
    this.saveConfig(newColumns);
  };

  saveConfig = (columns, fileColumns) => {
    const code = this.props.code;
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const data = viewConfig.find(item => item.code === code);
    const index = viewConfig.findIndex(item => item.code === code);
    const newColumns = Array.isArray(columns) && columns.filter(item => item.tp !== 1 && item.name !== 'edit');

    const newOthers = Array.isArray(columns) && columns.filter(item => item.tp === 1);
    data ? (data.filterField = this.state.filterField) : null;
    data ? (data.listDisplay.type.fields.type.columns = newColumns) : null;
    data ? (data.listDisplay.type.fields.type.others = newOthers) : null;
    data.listDisplay.type.fields.type.fileColumns = fileColumns;
    const URL = data ? `${API_VIEW_CONFIG}/${data._id}` : null;

    fetch(URL, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        viewConfig[index].listDisplay.type.fields.type.columns = newColumns;
        viewConfig[index].filterField = this.state.filterField;
        viewConfig[index].listDisplay.type.fields.type.fileColumns = fileColumns;
        localStorage.setItem('viewConfig', JSON.stringify(viewConfig));
        this.setState({ viewConfigUpdateTime: new Date() * 1 });
      })
      .catch(() => this.setState({ open: true, variant: 'error', message: 'Cập nhật thất bại' }));
  };

  saveAllSystem = (columns, fileColumns) => {
    const code = this.props.code;
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const data = viewConfig.find(item => item.code === code);
    const index = viewConfig.findIndex(item => item.code === code);
    const newColumns = Array.isArray(columns) && columns.filter(item => item.tp !== 1 && item.name !== 'edit');

    const newOthers = Array.isArray(columns) && columns.filter(item => item.tp === 1);
    data ? (data.filterField = this.state.filterField) : null;
    data ? (data.listDisplay.type.fields.type.columns = newColumns) : null;
    data ? (data.listDisplay.type.fields.type.others = newOthers) : null;
    data.listDisplay.type.fields.type.fileColumns = fileColumns;
    const URL = data ? `${API_UPDATE_ALL_SYSTEM}` : null;

    fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        viewConfig[index].listDisplay.type.fields.type.columns = newColumns;
        viewConfig[index].filterField = this.state.filterField;
        viewConfig[index].listDisplay.type.fields.type.fileColumns = fileColumns;
        localStorage.setItem('viewConfig', JSON.stringify(viewConfig));
        this.setState({ viewConfigUpdateTime: new Date() * 1 });
      })
      .catch(() => this.setState({ open: true, variant: 'error', message: 'Cập nhật thất bại' }));
  };

  handleDeleteItem = () => {
    const { selected } = this.state;
    this.setState({ deleteDialog: false, selected: [] });

    if (typeof this.props.onDelete === 'function') {
      const list = this.state.rows.filter((item, index) => selected.includes(index)).map(i => i._id);
      this.props.onDelete(list);
    } else if (selected.length !== 0) {
      this.deleteItem();
      this.props.setCanView && this.props.setCanView(false)
    }
  };

  saveSetting = (columns, status, filterField, forth, fileColumns) => {
    if (status) {
      this.setState({ dialogStatus: false, columns, filterField }, () => {
        this.saveConfig(columns, fileColumns);
      });
    } else {
      const columnOrder = [...columns].sort((a, b) => a.order - b.order);
      this.setState({ columns, dialogStatus: false, columnOrder });
    }
  };

  saveUpdateAllSystem = (columns, status, filterField, forth, fileColumns) => {
    if (status) {
      this.setState({ dialogStatus: false, columns, filterField }, () => {
        this.saveAllSystem(columns, fileColumns);
      });
    } else {
      const columnOrder = [...columns].sort((a, b) => a.order - b.order);
      this.setState({ columns, dialogStatus: false, columnOrder });
    }
  };

  handleSearch = e => {
    e.target.value = clearWidthSpace(e.target.value).trimStart();
    const search = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ search: search.toLowerCase() });
    }, 500);
  };

  getUrl() {
    const res = window.location.pathname.split('/');
    const path = this.props.path ? this.props.path : res[res.length - 1];
    return path;
  }

  addEdit = (id, item, enableEdit, endDate, status) => {
    if (this.props.addIcon) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {this.props.addIcon &&
            this.props.taskData.createdBy._id === this.props.profile._id &&
            item.statusAccept === 'Hoàn thành' &&
            (!item.taskLevel || item.taskLevel === '' || item.taskLevel === null) ? (
            <Button
              style={{ textTransform: 'inherit' }}
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => {
                this.props.onEditAny(item);
              }}
            >
              Đánh giá
            </Button>
          ) : null}
          {this.props.addIcon && item['receiver._id'] === this.props.profile._id && item.statusAccept === 'Đang thực hiện' ? (
            <Button
              style={{ marginLeft: 10, textTransform: 'inherit' }}
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => {
                this.props.onCompleteAny(item);
              }}
            >
              Hoàn thành
            </Button>
          ) : null}
        </div>
      );
    }

    if (this.props.code && !this.props.parentCode) {
      let codeModule;
      if (this.props.codeModule) {
        codeModule = this.props.codeModule;
      } else if (this.props.codeRole) {
        codeModule = this.props.codeRole;
      } else {
        codeModule = this.props.code;
      }
      const roleCode = this.props && this.props.dashboardPage && this.props.dashboardPage.role && this.props.dashboardPage.role.roles && this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === codeModule);
      const roleModule = roleCode && roleCode.methods ? roleCode.methods : [];
      const checkEndAuthority = moment(endDate, 'DD/MM/YYYY HH:mm').isBefore(moment());
      return (roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true || enableEdit ? (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {this.props.disableOneEdit ? null : (
            <>
              {typeof this.props.onEdit === 'function' ? (
                <Fab
                  color="primary"
                  size="small"
                  className="CustomIconListTask"
                  disabled={checkEndAuthority || status === 2}
                  onClick={e => {
                    e.stopPropagation();
                    this.props.onEdit(item);
                  }}
                >
                  <Tooltip title="Cập nhật">
                    <Edit fontSize="small" />
                  </Tooltip>
                </Fab>
              ) : (
                <Link to={`${this.props.customUrl ? this.props.customUrl(item) : this.getUrl()}/${id}`}>
                  <Fab className="CustomIconListTask" color="primary" size="small">
                    <Tooltip title="Cập nhật">
                      <Edit fontSize="small" />
                    </Tooltip>
                  </Fab>
                </Link>
              )}
            </>
          )}

          {/* <Fab onClick={e => this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item })}>
              <Tooltip title="Khác">
                <Dehaze />
              </Tooltip>
            </Fab> */}
          {this.props.disableMenuAction ? null : (
            <Fab
              className="CustomIconListTask"
              size="small"
              onClick={e => {
                e.stopPropagation();
                this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item });
              }}
            >
              <Tooltip title="Khác">
                <Dehaze fontSize="small" />
              </Tooltip>
            </Fab>
          )}
        </div>
      ) : this.props.disableMenuAction ? null : (
        <Fab
          className="CustomIconListTask"
          size="small"
          onClick={e => {
            e.stopPropagation();
            this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item });
          }}
        >
          <Tooltip title="Khác">
            <Dehaze fontSize="small" />
          </Tooltip>
        </Fab>
      );
    } else {
      let codeModule;
      if (this.props.codeModule) {
        codeModule = this.props.codeModule;
      } else if (this.props.codeRole) {
        codeModule = this.props.codeRole;
      } else {
        codeModule = this.props.code;
      }
      const roles = this.props.dashboardPage && this.props.dashboardPage.role && this.props.dashboardPage.role.roles
      const roleCode = roles && roles.find(item => item && item.codeModleFunction === codeModule);
      const roleModule = roleCode && roleCode.methods ? roleCode.methods : [];
      return (roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true ? (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {this.props.disableOneEdit ? null : (
            <>
              {typeof this.props.onEdit === 'function' ? (
                <Fab
                  color="primary"
                  size="small"
                  onClick={() => {
                    this.props.onEdit(item);
                  }}
                >
                  <Tooltip title="Cập nhật">
                    <Edit fontSize="small" />
                  </Tooltip>
                </Fab>
              ) : (
                <Link to={`${this.getUrl()}/${id}`}>
                  <Fab color="primary" size="small">
                    <Tooltip title="Cập nhật">
                      <Edit fontSize="small" />
                    </Tooltip>
                  </Fab>
                </Link>
              )}
            </>
          )}

          {this.props.disableMenuAction ? null : (
            <Fab
              size="small"
              onClick={e => {
                e.stopPropagation();
                this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item });
              }}
            >
              <Tooltip title="Hoạt động">
                <Dehaze fontSize="small" />
              </Tooltip>
            </Fab>
          )}
          {/* <Fab onClick={e => this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item })}>
            <Dehaze />
          </Fab> */}
        </div>
      ) : null;
      // }
    }
  };

  closeFilter = () => {
    this.setState({ anchorEl: null });
  };

  changeSorting = sorting => {
    if (this.props.client) {
      this.setState({
        sorting,
      });
      return;
    }
    this.setState({
      loading: true,
      sorting,
    });
  };

  selectField = name => () => {
    const { filters } = this.state;
    const index = filters.indexOf(name);
    if (index === -1) {
      const newFilter = filters.concat(name);
      this.setState({ filters: newFilter });
    } else {
      const newFilter = filters.filter((it, id) => id !== index);
      this.setState({ filters: newFilter });
    }
  };

  addApproveTable = () => {
    const data = {
      model: this.props.code,
      id: this.state.id,
    };
    fetch(API_COMMON_APPROVE_FINISH, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(() => {
      this.setState({ open: true, variant: 'success', message: 'Thay đổi trạng thái thành công', openDialogApprove: false });
      this.getData();
    });
  };

  closeAnchorElAction = () => {
    this.setState({ anchorElAction: false });
  };

  closeDialogStatus = () => {
    this.setState({ dialogStatus: false });
  };

  exportExcel = async dt => {
    const { apiUrl, filter } = this.props;
    if (!apiUrl) {
      this.setState(dt);
      return;
    }
    let URL;

    const queryClient = serialize({ filter });
    if (apiUrl.includes('?')) {
      URL = `${apiUrl}&${queryClient}`;
    } else {
      URL = `${apiUrl}?${queryClient}`;
    }
    const data = await fetchData(URL);
    const ws = XLSX.utils.json_to_sheet(data.data ? data.data : data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(wb, `${this.props.code}_ImportTemplate.xlsx`);
  };

  shareItem = () => {
    const { selected, rows, employessCustomer } = this.state;
    const customerIds = rows.filter((i, id) => selected.includes(id)).map(i => i._id);
    const employeeIds = employessCustomer.map(i => i._id);
    fetch(`${API_CUSTOMERS}/updateViewable`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employeeIds, customerIds }),
    })
      .then(() => {
        this.setState({ open: true, variant: 'success', message: 'Chia sẻ thành công', shareDialog: false });
        this.getData();
      })
      .catch(() => this.setState({ open: true, variant: 'error', message: 'Chia sẻ thất bại' }));
  };

  handleShare = () => {
    this.setState({ shareDialog: false, selected: [] });
    if (this.state.selected.length !== 0) {
      this.shareItem();
    }
  };
  onChangeCheck = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  checkShow = show => {
    this.setState({ show });
  };

  onFilterSearch = () => {
    const currentInnerFilter = this.state.innerFilter;
    const currFilterAdvance = this.state.filterAdvance;
    const { columns } = this.state;
    const newInnerFilter = { ...currentInnerFilter };
    Object.keys(currFilterAdvance).forEach(key => {
      if ((!currFilterAdvance[key] && !currFilterAdvance[key] !== 0) || (Array.isArray(currFilterAdvance[key]) && !currFilterAdvance[key].length)) {
        const col = columns.find(c => c.name === key);
        delete newInnerFilter[key];
        delete newInnerFilter[`${key}.employeeId`];
        delete newInnerFilter[`${key}.customerId`];
        delete newInnerFilter[`${key}.value`];
        delete newInnerFilter[col.filterKey || key];
      } else {
        const col = columns.find(c => c.name === key);
        // console.log(col, "col")
        if (col.dateFilterType) {
          newInnerFilter[key] = {
            $gte: moment()
              .set(col.dateFilterType, currFilterAdvance[key])
              .startOf(col.dateFilterType)
              .format(),
            $lt: moment()
              .set(col.dateFilterType, currFilterAdvance[key])
              .endOf(col.dateFilterType)
              .format(),
          };
          return;
        }
        if (col.type) {
          const [firstEle, model, thirdEle] = col.type.split('|');
          const isMulti = thirdEle === 'Array' ? true : false;
          if (col.name === 'responsibilityPerson') {
            if (isMulti) {
              newInnerFilter[`${key}.employeeId`] = { $in: currFilterAdvance[key].map(i => i._id) };
            } else {
              newInnerFilter[`${key}.employeeId`] = currFilterAdvance[key]._id;
            }
            return;
          } else if (firstEle === 'ObjectId' && model) {
            if (isMulti) {
              newInnerFilter[col.filterKey || key] = { $in: currFilterAdvance[key].map(i => i._id) };
            } else {
              newInnerFilter[col.filterKey || key] = currFilterAdvance[key]._id;
            }
            return;
          } else if (firstEle === 'Object' && col.name === "signer") {
            newInnerFilter[key] = currFilterAdvance[key]._id;
            return;
          }
          // else if (col.type === 'Date') {
          //   this.setState({
          //     filterDate_startDate: moment(currFilterAdvance[key])
          //       .startOf('day')
          //       .format(),
          //     filterDate_endDate: moment(currFilterAdvance[key])
          //       .endOf('day')
          //       .format(),

          //   })
          //   // newInnerFilter[key] = {
          //   //   $gte: moment(currFilterAdvance[key])
          //   //     .startOf('day')
          //   //     .format(),
          //   //   $lte: moment(currFilterAdvance[key])
          //   //     .endOf('day')
          //   //     .format(),
          //   // };
          //   return
          // }
          else if (firstEle === 'Source') {
            if (key === 'kanbanStatus') {
              newInnerFilter[`${key}`] = currFilterAdvance[key][col.type.split('|').pop()];
              return;
            }
            if (col.name === 'position') {
              newInnerFilter[`${key}.value`] = currFilterAdvance[key].type ? currFilterAdvance[key].type : currFilterAdvance[key].value;
            } else if (col.name === 'vacancy.roleName') {
              newInnerFilter[`${key}`] = currFilterAdvance[key].name ? currFilterAdvance[key].name : currFilterAdvance[key].code;
            }

            else {
              newInnerFilter[col.filterKey || key] = currFilterAdvance[key].type ? currFilterAdvance[key].type : currFilterAdvance[key].value;
            }
            return;
          }

        }
        if (col.type === 'Date' && col.dateRange === 'start') {
          newInnerFilter[key] = {
            $gte: moment(currFilterAdvance[key]._d)
              .startOf('day')
              .toString(),
          };
        } else if (col.type === 'Date' && col.dateRange === 'end') {
          newInnerFilter[key] = {
            $lt: moment(currFilterAdvance[key]._d)
              .endOf('day')
              .toString(),
          };
        } else if (col.type === 'Date' && col.filterType) {
          newInnerFilter[key] = {
            $gte: moment(currFilterAdvance[key][0])
              .startOf('day')
              .format(),
            $lte: moment(currFilterAdvance[key][1])
              .endOf('day')
              .format(),
          };
        } else if (col.type === 'Date' || col.type === 'date') {
          // console.log(key)
          newInnerFilter[key] = {
            $gte: moment(currFilterAdvance[key]._d)
              .startOf('day')
              .toString(),
            $lte: moment(currFilterAdvance[key]._d)
              .endOf('day')
              .toString(),
          };

        } else if (col.dateRange === 'start') {
          newInnerFilter[key] = {
            $gte: moment(currFilterAdvance[key]._d)
              .startOf('day')
              .toString(),
          };
        } else if (col.type === 'Datetime') {
          newInnerFilter[key] = {
            $gte: moment(currFilterAdvance[key]._d)
              .startOf('day')
              .format(),
            $lt: moment(currFilterAdvance[key]._d)
              .endOf('day')
              .format(),
          };
        } else if (col.type === 'Boolean') {
          newInnerFilter[key] = this.state.isCheckedNo;
        } else if (col.type === 'Number') {
          newInnerFilter[key] = currFilterAdvance[key];
        } else {
          newInnerFilter[key] = currFilterAdvance[key].type ? currFilterAdvance[key].type : currFilterAdvance[key].value;
        }
      }
    });
    this.setState({ innerFilter: newInnerFilter, dialogAllFilter: false }, () => { });
  };
  getApiExport = apiUrl => {
    if (apiUrl && apiUrl.includes('?')) {
      let splitQuestionQuota = apiUrl.split('?') || [];
      if (splitQuestionQuota.length > 0) {
        let url = splitQuestionQuota[0];
        let query = splitQuestionQuota[splitQuestionQuota.length - 1];
        return `${url}/export?${query}`;
      }
    } else {
      return `${apiUrl}/export`;
    }
  };

  render() {
    const {
      dialogStatus,
      activePage,
      perPage,
      deleteDialog,
      loading,
      open,
      variant,
      message,
      importExport,
      columns,
      selected,
      columnOrder,
      rows,
      count,
      sorting,
      searchClient,
      anchorEl,
      filters,
      anchorElAction,
      openDialogApprove,
      columnExtensions,
      rightColumns,
      shareDialog,
      filterField,
      exportAnchor,
      show,
      fileColumns,
      checkRecallDocs,
      filterDate_startDatee,
      filterDate_endDatee,
    } = this.state;
    const {
      client,
      disableAdd,
      settingBar,
      tree,
      code,
      disableSelect,
      disableSearch,
      addFunction,
      exportExcel,
      advanceFilter,
      extraColumns,
      isRecall = false,
      docIds,
      miniActive,
      excludeDatetype,
      tab,
      index,
      handleOpenAddRecallDialog,
      OpenRecallsDialog,
      onRowClick,
      onCellClick,
      pointerCursor,
      listMenus,
      rootTab,
      changeSelect,
      showExport,
    } = this.props;

    localStorage.setItem('dafault', JSON.stringify(this.props.defaultValue));
    const path = this.getUrl();
    let codeModule;
    if (this.props.codeModule) {
      codeModule = this.props.codeModule;
    } else if (this.props.codeRole) {
      codeModule = this.props.codeRole;
    } else {
      codeModule = this.props.code;
    }
    const roleCode = this.props && this.props.dashboardPage && this.props.dashboardPage.role && this.props.dashboardPage.role.roles && this.props.dashboardPage.role.roles.find(item => item.codeModleFunction === codeModule);

    const roleModule = roleCode ? roleCode.methods : [];
    const months = [
      {
        value: '1',
        label: 'Tháng 1',
      },
      {
        value: '2',
        label: 'Tháng 2',
      },
      {
        value: '3',
        label: 'Tháng 3',
      },
      {
        value: '4',
        label: 'Tháng 4',
      },
      {
        value: '5',
        label: 'Tháng 5',
      },
      {
        value: '6',
        label: 'Tháng 6',
      },
      {
        value: '7',
        label: 'Tháng 7',
      },
      {
        value: '8',
        label: 'Tháng 8',
      },
      {
        value: '9',
        label: 'Tháng 9',
      },
      {
        value: '10',
        label: 'Tháng 10',
      },
      {
        value: '11',
        label: 'Tháng 11',
      },
      {
        value: '12',
        label: 'Tháng 12',
      },
    ];

    let days = [];
    for (let i = 31; i >= 1; i--) {
      days.unshift(i);
    }

    let years = [];
    const currentYear = moment().format('YYYY');
    for (let i = 1921; i <= currentYear; i++) {
      years.unshift(i);
    }
    const height = this.props.height;

    return (
      <>
        <GridContainer>
          <MenuFilter
            selectField={this.selectField}
            columns={columns}
            closeFilter={this.closeFilter}
            anchorEl={anchorEl}
            filters={filters}
            code={this.props.code}
          />
          <MenuAction
            disable3Action={this.props.disable3Action}
            ID={this.props.profile && this.props.profile._id}
            handleClose={this.closeAnchorElAction}
            anchorEl={anchorElAction}
            code={this.props.code}
            exportExcel={exportExcel}
            showExport={showExport}
            roleModule={roleModule}
            id={this.state.id}
            itemCurrent={this.state.itemCurrent}
            addChildTask={this.props.addChildTask}
            extraMenu={this.props.extraMenu}
            getData={this.getData}
            miniActive={miniActive}
            dashboardPage={this.props.dashboardPage}
            listMenus={listMenus}
            rootTab={rootTab}
            history={this.props.history}
            onChangeSnackbar={this.props.onChangeSnackbar}
            othersButton={this.props.othersButton}
            disableChangePassword={this.props.disableChangePassword}
            createdDraft={this.props.createdDraft}
            feedback={this.props.feedback}
            profile={this.props.profile}
            checkRecallDocs={checkRecallDocs}
          />
          {!this.props.disableFilter && <>
            {this.props.reports ? (
              <GridItem item xs={2}>
                <TextFieldUI variant="outlined" placeholder="Tìm kiếm ..." ref={input => (this.search = input)} onChange={this.handleSearch} />
              </GridItem>
            ) : null}
            <GridItem md={this.props.reports ? 9 : 12} sm={this.props.reports ? 9 : 12}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {disableSearch ? null : client ? (
                  <GridItem md={12} sm={12}>
                    <TextField style={{ marginLeft: 15 }} placeholder="Tìm kiếm ..." value={searchClient} onChange={this.changeSearch} />
                  </GridItem>
                ) : (
                  <GridItem md={12} sm={12} style={{ display: 'flex', alignItems: 'center' }} container>
                    {this.props.hideSearch ? null : this.props.notChangeSearch ? (
                      <TextFieldUI variant="outlined" placeholder="Tìm kiếm ..." ref={input => (this.search = input)} onChange={this.handleSearch} />
                    ) : (
                      <>
                        {/* <GridItem xs={3} style={{ marginLeft: -5 }}>
                        <TextFieldUI
                          variant="outlined"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment style={{ cursor: 'pointer' }} position="end">
                                <FilterList onClick={e => this.setState({ anchorEl: e.currentTarget })} />
                              </InputAdornment>
                            ),
                          }}
                          placeholder="Tìm kiếm ..."
                          ref={input => (this.search = input)}
                          onChange={this.handleSearch}
                          fullWidth
                          margin="normal"
                        />
                      </GridItem> */}
                      </>
                    )}
                    {this.props.filterStartEnd && (
                      <>
                        <GridItem md={2} sm={3} xs={3} style={{ position: 'relative', marginLeft: -7, marginTop: -5 }} >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CustomDatePicker
                              label="Từ ngày"
                              InputLabelProps={{ style: { fontSize: 14 }, shrink: true }}
                              value={this.state.filterDate_startDatee}
                              onChange={e => this.setState({ filterDate_startDatee: e && e.format('YYYY-MM-DD') })}
                              required={false}
                              maxDateMessage=""
                              allowRemove2
                              minDateMessage=""
                              invalidDateMessage=""
                              minDate={moment(1900, 'YYYY')}
                            />
                          </div>
                        </GridItem>

                        <GridItem md={2} sm={3} xs={3} style={{ position: 'relative', marginBottom: 5, marginLeft: -7, marginRight: 13 }} custom="customLeft">
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CustomDatePicker
                              label="Đến ngày"
                              InputLabelProps={{ style: { fontSize: 14 }, shrink: true }}
                              value={this.state.filterDate_endDatee}
                              onChange={e => this.setState({ filterDate_endDatee: e && e.format('YYYY-MM-DD') })}
                              required={false}
                              maxDateMessage=""
                              allowRemove2
                              minDateMessage=""
                              invalidDateMessage=""
                              minDate={moment(1900, 'YYYY')}
                            />
                          </div>
                        </GridItem>
                      </>
                    )}

                    {this.props.showDepartmentAndEmployeeFilter && document.documentElement.clientWidth > 685 ? (
                      <>
                        {show === true && (
                          // <GridItem md={this.props.disableEmployee ? 3 : 6}>
                          <GridItem md={this.props.disableEmployee ? 0 : 3}>
                            <DepartmentAndEmployee
                              onChangeShow={this.checkShow}
                              onChange={result => {
                                let employeeId = '';
                                let organizationUnitId = '';
                                const { innerFilter } = this.state;
                                const newFilter = {};
                                if (result) {
                                  if (result.department) {
                                    newFilter[this.props.organizationUnitFilterKey || 'organizationUnitId'] = result.department;
                                  }
                                  if (result.employee) {
                                    newFilter[this.props.employeeFilterKey || 'employeeId'] = result.employee._id;
                                  }
                                }
                                this.setState({ innerFilter: newFilter }, () => {
                                  this.loadData();
                                });
                              }}
                              employment={this.props.employment}
                              disableEmployee={this.props.disableEmployee}
                              disableDepartmentH05
                              isHrm={this.props.isHrm}
                              profile={this.props.profile}
                              moduleCode={this.props.code}
                            />
                          </GridItem>
                        )}
                      </>
                    ) : null}

                    {/* <CustomDatePicker
                    label="Đến ngày"
                    value={localState.filterDate_endDate}
                    name="newDeadline"
                    type="date-time"
                    format="DD/MM/YYYY"
                    onChange={e => handleInputChange(e, 'newDeadline', e)}
                  /> */}
                    {/* 
                    {Array.isArray(columns) &&
                      // columns.filter(c => c.enabaleSearch && c.isInSearchbar && c.type !== 'String') &&
                      // columns.filter(c => c.enabaleSearch && c.isInSearchbar && c.type !== 'String').map(
                      columns.filter(c => c.type !== 'String') &&
                      _.sortBy(columns.filter(c => c.type !== 'String'), ["filterOrder"]).map(
                        c =>
                          !c.dateRange && c.showInReport ? (
                            <GridItem item xs={3} md={2} style={{ position: 'relative', marginBottom: 5 }} custom="customRight" >
                              <CustomInputField
                                fullWidth

                                dateFilterType={c.dateFilterType}
                                filterType={c.filterType ? c.filterType : null}
                                options={c.menuItem ? c.menuItem : ''}
                                configType={c.configType ? c.configType : ''}
                                configCode={c.configCode ? c.configCode : ''}
                                type={c.type}
                                name={c.name}
                                label={c.title}
                                isChecked={this.state.isChecked}
                                noRequired={false}
                                isCheckedNo={this.state.isCheckedNo}
                                value={this.state.filterAdvance[c.name] || null}
                                hiddenOptionDefault={true}
                                clone={true}
                                onChange={(newVal, e) => {
                                  const { filterAdvance } = this.state;
                                  let newFilterAdvance;
                                  if (e === 'true' || e === 'false') {
                                    newFilterAdvance = { ...filterAdvance, [c.name]: e };
                                    this.setState({ isCheckedNo: e });
                                  } else {
                                    newFilterAdvance = {
                                      ...filterAdvance,
                                      [c.name]:
                                        c.type.includes('Source') || c.type.includes('MenuItem') || c.type === 'Number' || c.type === 'date'
                                          ? newVal.target.value
                                          : c.type === 'Date' && (c.filterType || c.dateFilterType)
                                            ? newVal.target.value
                                            : newVal,
                                    };
                                  }
                                  this.setState({ filterAdvance: newFilterAdvance });
                                  // this.setState({ filterAdvance: newFilterAdvance }, () => {
                                  //   this.onFilterSearch();
                                  // });
                                }}
                              />
                            </GridItem>
                          ) : null,
                      )}
*/}
                    {/* {this.props.hideSearch ? null : (this.props.showDepartmentAndEmployeeFilter && document.documentElement.clientWidth <= 1285) ||
                    (Array.isArray(columns) && columns.filter(c => c.enabaleSearch && !c.isInSearchbar && c.type !== 'String').length) ? (
                    <Fab
                      onClick={() => this.setState({ dialogAllFilter: true })}
                      color="primary"
                      style={{ width: 40, height: 40, minWidth: 40, marginLeft: this.props.isPlanChild ? 12 : 0 }}
                    >
                      <Tooltip title="Xem thêm filter">
                        <FilterList />
                      </Tooltip>
                    </Fab>
                  ) : null} */}
                    {/* <GridItem xs={12} md={12} container>
                      <GridItem xs={6} md={6} style={{ display: 'flex', alignItems: 'center', justifyContent: "end" }}>
                        <Button variant="contained" color="primary" onClick={() => {
                          this.onFilterSearch()
                          this.setState({ filterDate_startDate: this.state.filterDate_startDatee })
                          this.setState({ filterDate_endDate: this.state.filterDate_endDatee })

                        }}>Tra cứu</Button>
                      </GridItem>
                      <GridItem xs={6} md={6} style={{ display: 'flex', alignItems: 'center', justifyContent: "end" }}>

                        <Fab onClick={e => this.setState({ exportAnchor: e.currentTarget })}>
                          <Tooltip title="Tải xuống">
                            <Archive />
                          </Tooltip>
                        </Fab>
                      </GridItem>



                    </GridItem> */}
                    <DialogUI
                      title="Bộ lọc nâng cao"
                      onClose={() => this.setState({ dialogAllFilter: false })}
                      onSave={() => {
                        this.onFilterSearch();
                      }}
                      saveText="ĐỒNG Ý"
                      open={this.state.dialogAllFilter}
                    >
                      <div style={{ height: 500 }}>
                        {this.props.showDepartmentAndEmployeeFilter && document.documentElement.clientWidth <= 1285 ? (
                          <GridItem md={12} sm={12}>
                            <DepartmentAndEmployee
                              disableDepartmentH05
                              onChange={result => {
                                let employeeId = '';
                                let organizationUnitId = '';
                                const { innerFilter } = this.state;
                                const newFilter = {};
                                if (result) {
                                  if (result.department) {
                                    newFilter[this.props.organizationUnitFilterKey || 'organizationUnitId'] = result.department;
                                  }
                                  if (result.employee) {
                                    newFilter[this.props.employeeFilterKey || 'employeeId'] = result.employee._id;
                                  }
                                }
                                this.setState({ innerFilter: newFilter }, () => {
                                  this.loadData();
                                });
                              }}
                              isHrm={this.props.isHrm}
                              profile={this.props.profile}
                              moduleCode={this.props.code}
                            />
                          </GridItem>
                        ) : null}
                        <GridItem container>
                          {Array.isArray(columns) && columns.find(c => c.name === 'birthDay') ? (
                            <>
                              <GridItem item xs={4}>
                                <TextField
                                  value={this.state.dayOfBirth}
                                  fullWidth
                                  label="Ngày sinh"
                                  select
                                  onChange={e => {
                                    this.setState({ dayOfBirth: e.target.value });
                                    const { innerFilter } = this.state;
                                    const newFilterAdvance = { ...innerFilter, $expr: { $eq: [{ $dayOfMonth: '$birthDay' }, e.target.value] } };
                                    this.setState({ innerFilter: newFilterAdvance });
                                  }}
                                >
                                  {days.map(i => (
                                    <MenuItem key={i} value={i}>
                                      {`${i}`}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </GridItem>
                              <GridItem item xs={4}>
                                <TextField
                                  value={this.state.monthOfBirth}
                                  fullWidth
                                  label="Tháng sinh"
                                  select
                                  onChange={e => {
                                    this.setState({ monthOfBirth: e.target.value });
                                    const { innerFilter } = this.state;
                                    const newFilterAdvance = { ...innerFilter, $expr: { $eq: [{ $month: '$birthDay' }, e.target.value] } };
                                    this.setState({ innerFilter: newFilterAdvance });
                                  }}
                                >
                                  {months.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </GridItem>
                              <GridItem item xs={4}>
                                <TextField
                                  value={this.state.yearOfBirth}
                                  fullWidth
                                  label="Năm sinh"
                                  select
                                  onChange={e => {
                                    this.setState({ yearOfBirth: e.target.value });
                                    const { innerFilter } = this.state;
                                    const newFilterAdvance = { ...innerFilter, $expr: { $eq: [{ $year: '$birthDay' }, e.target.value] } };
                                    this.setState({ innerFilter: newFilterAdvance });
                                  }}
                                >
                                  {years.map(i => (
                                    <MenuItem key={i} value={i}>
                                      {`Năm ${i}`}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </GridItem>
                            </>
                          ) : null}
                        </GridItem>
                        <GridItem container>
                          {Array.isArray(columns) &&
                            columns.find(
                              c =>
                                (c.dateRange === 'start' && c.enabaleSearch === true && !c.isInSearchbar) ||
                                (c.dateRange === 'end' && c.enabaleSearch === true),
                            ) ? (
                            <>
                              <GridItem item xs={2}>
                                <TextField
                                  value={this.state.valueFilter}
                                  fullWidth
                                  label="Lọc theo"
                                  select
                                  onChange={e => {
                                    this.setState({ valueFilter: e.target.value });
                                    if (e.target.value === 1) {
                                      this.setState({
                                        innerFilter: {
                                          startDate: {
                                            $gte: moment()
                                              .startOf('week')
                                              .startOf('day')
                                              .toString(),
                                          },
                                          endDate: {
                                            $lte: moment()
                                              .endOf('week')
                                              .endOf('day')
                                              .toString(),
                                          },
                                        },
                                      });
                                    } else if (e.target.value === 2) {
                                      this.setState({
                                        innerFilter: {
                                          startDate: {
                                            $gte: moment()
                                              .startOf('month')
                                              .startOf('day')
                                              .toString(),
                                          },
                                          endDate: {
                                            $lte: moment()
                                              .endOf('month')
                                              .endOf('day')
                                              .toString(),
                                          },
                                        },
                                      });
                                    } else if (e.target.value === 3) {
                                      this.setState({
                                        innerFilter: {
                                          startDate: {
                                            $gte: moment()
                                              .startOf('quarter')
                                              .startOf('day')
                                              .toString(),
                                          },
                                          endDate: {
                                            $lte: moment()
                                              .endOf('quarter')
                                              .endOf('day')
                                              .toString(),
                                          },
                                        },
                                      });
                                    } else {
                                      this.setState({
                                        innerFilter: {},
                                      });
                                    }
                                  }}
                                >
                                  <MenuItem value={0}>--CHỌN--</MenuItem>
                                  <MenuItem value={1}>Tuần</MenuItem>
                                  <MenuItem value={2}>Tháng</MenuItem>
                                  <MenuItem value={3}>Quý</MenuItem>
                                </TextField>
                              </GridItem>
                              <GridItem item xs={4}>
                                {Array.isArray(columns) && columns.find(c => c.dateRange === 'start' && c.enabaleSearch === true) ? (
                                  <CustomInputField
                                    type={Array.isArray(columns) && columns.find(c => c.dateRange === 'start').type}
                                    label={Array.isArray(columns) && columns.find(c => c.dateRange === 'start').title}
                                    value={this.state.filterAdvance[columns.find(c => c.dateRange === 'start').name]}
                                    onChange={newVal => {
                                      const { filterAdvance } = this.state;
                                      const newFilterAdvance = { ...filterAdvance, [columns.find(c => c.dateRange === 'start').name]: newVal };
                                      this.setState({ filterAdvance: newFilterAdvance });
                                    }}
                                  />
                                ) : null}
                              </GridItem>
                              <GridItem item xs={6}>
                                {Array.isArray(columns) && columns.find(c => c.dateRange === 'end' && c.enabaleSearch === true) ? (
                                  <CustomInputField
                                    type={Array.isArray(columns) && columns.find(c => c.dateRange === 'end').type}
                                    label={Array.isArray(columns) && columns.find(c => c.dateRange === 'end').title}
                                    value={this.state.filterAdvance[columns.find(c => c.dateRange === 'end').name]}
                                    onChange={newVal => {
                                      const { filterAdvance } = this.state;
                                      const newFilterAdvance = { ...filterAdvance, [columns.find(c => c.dateRange === 'end').name]: newVal };
                                      this.setState({ filterAdvance: newFilterAdvance });
                                    }}
                                  />
                                ) : null}
                              </GridItem>
                            </>
                          ) : null}
                          {Array.isArray(columns) &&
                            // columns.filter(c => c.enabaleSearch && !c.isInSearchbar && c.type !== 'String').map(
                            columns.filter(c => c.enabaleSearch && !c.isInSearchbar && c.type !== 'String').map(

                              c =>
                                !c.dateRange ? (
                                  <GridItem item xs={6}>
                                    <CustomInputField
                                      dateFilterType={c.dateFilterType}
                                      filterType={c.filterType ? c.filterType : null}
                                      options={c.menuItem ? c.menuItem : ''}
                                      configType={c.configType ? c.configType : ''}
                                      configCode={c.configCode ? c.configCode : ''}
                                      type={c.type}
                                      name={c.name}
                                      label={c.title}
                                      isChecked={this.state.isChecked}
                                      isCheckedNo={this.state.isCheckedNo}
                                      value={this.state.filterAdvance[c.name]}
                                      onChange={(newVal, e) => {
                                        const { filterAdvance } = this.state;
                                        let newFilterAdvance;
                                        if (e === 'true' || e === 'false') {
                                          newFilterAdvance = { ...filterAdvance, [c.name]: e };
                                          this.setState({ isCheckedNo: e });
                                        } else {
                                          newFilterAdvance = {
                                            ...filterAdvance,
                                            [c.name]:
                                              c.type.includes('Source') || c.type.includes('MenuItem') || c.type === 'Number' || c.type === 'date'
                                                ? newVal.target.value
                                                : c.type === 'Date' && c.filterType
                                                  ? newVal.target.value
                                                  : newVal,
                                          };
                                        }
                                        this.setState({ filterAdvance: newFilterAdvance });
                                      }}
                                    />
                                  </GridItem>
                                ) : null,
                            )}
                        </GridItem>
                      </div>
                    </DialogUI>
                  </GridItem>
                )}
              </div>
            </GridItem>
            {this.props.showStartEnd ? (
              <GridItem md={3} sm={3}>
                <GridItem item xs={6} style={{ position: 'relative', marginBottom: 5 }}>
                  <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
                    <DatePicker
                      inputVariant="outlined"
                      format="DD/MM/YYYY"
                      value={this.props.valueStartDate}
                      variant="outlined"
                      label="Từ ngày"
                      margin="dense"
                      required={false}
                      fullWidth
                      name="startDate"
                      onChange={e => this.props.onChangeDate(e, true, true)}
                    />
                  </MuiPickersUtilsProvider>
                  {this.props.errorStartDateEndDate ? (
                    <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{this.props.errorTextStartDate}</p>
                  ) : null}
                </GridItem>
                <GridItem item xs={6} style={{ position: 'relative', marginBottom: 5 }}>
                  <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
                    <DatePicker
                      inputVariant="outlined"
                      fullWidth
                      format="DD/MM/YYYY"
                      value={this.props.valueEndDate}
                      variant="outlined"
                      label="Đến ngày"
                      margin="dense"
                      required={false}
                      name="endDate"
                      onChange={e => this.props.onChangeDate(e, true, false)}
                    />
                  </MuiPickersUtilsProvider>
                  {this.props.errorStartDateEndDate ? (
                    <p style={{ color: 'red', margin: '0px', position: 'absolute', top: '68px', left: '10px' }}>{this.props.errorTextEndDate}</p>
                  ) : null}
                </GridItem>
              </GridItem>
            ) : null}

            {advanceFilter ? (
              <GridItem md={12} sm={12}>
                {advanceFilter}
              </GridItem>
            ) : null}
            {/* <GridItem md={8} sm={8}>
             {advanceFilter ? advanceFilter : null}
           </GridItem> */}
            {/* {customActions ? (
             <GridItem md={4} sm={4} style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
               {customActions.map(item => item)}
             </GridItem>
           ) : null} */}
            <GridItem md={12} sm={12} style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
              {!advanceFilter ? (
                <GridItem style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
                  {this.state.selected.length !== 0 && !this.props.disableDelete ? (
                    // this.props.code && !this.props.parentCode ? (
                    (roleModule.find(elm => elm.name === 'DELETE') || { allow: false }).allow && !this.props.notDelete ? (
                      <Fab color="secondary">
                        <Tooltip title="Xóa">
                          <Delete onClick={this.openDialog('deleteDialog')} />
                        </Tooltip>
                      </Fab>
                    ) : null
                  ) : null}
                  {this.state.selected.length !== 0 ? (
                    this.props.share ? (
                      <Fab color="primary">
                        <Share onClick={this.openDialog('shareDialog')} />
                      </Fab>
                    ) : null
                  ) : null}



                  {!disableAdd ? (
                    (roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow ? (
                      addFunction ? (
                        <Fab onClick={addFunction}>
                          <Tooltip title="Thêm mới">
                            <Add style={{ color: 'white' }} />
                          </Tooltip>
                        </Fab>
                      ) : (
                        <Fab>
                          <Link to={`${path}/add`}>
                            <Tooltip title="Thêm mới">
                              <Add style={{ color: 'white' }} />
                            </Tooltip>
                          </Link>
                        </Fab>
                      )
                    ) : null
                  ) : null}

                  {(roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow
                    ? this.props.code && !this.props.parentCode
                      ? settingBar
                        ? settingBar.map(item => (item ? <Fab>{item}</Fab> : null))
                        : null
                      : settingBar
                        ? settingBar.map(item => (item ? <Fab>{item}</Fab> : null))
                        : null
                    : null}
                  {exportExcel ? (
                    ((roleModule.find(elm => elm.name === 'EXPORT') || { allow: false }).allow || showExport) ? (
                      <Fab onClick={e => this.setState({ exportAnchor: e.currentTarget })}>
                        <Tooltip title="Tải xuống">
                          <Archive />
                        </Tooltip>
                      </Fab>
                    ) : null
                  ) : null}
                  {importExport ? (
                    (roleModule.find(elm => elm.name === 'IMPORT') || { allow: false }).allow ? (
                      this.props.disableImport ? null : (
                        <Link to={importExport}>
                          <Fab>
                            <Tooltip title="Tải lên">
                              <ImportExport />
                            </Tooltip>
                          </Fab>
                        </Link>
                      )
                    ) : null
                  ) : null}
                  {code && (roleModule.find(elm => elm.name === 'VIEWCONFIG') || { allow: false }).allow ? (
                    this.props.disableViewConfig ? null : (
                      <Fab onClick={this.openDialog('dialogStatus')}>
                        <Tooltip title="Cấu hình bảng">
                          <Visibility />
                        </Tooltip>
                      </Fab>
                    )
                  ) : null}
                </GridItem>
              ) : null}
            </GridItem>
          </>}
          <GridList
            pointerCursor={pointerCursor}
            onRowClick={onRowClick}
            onCellClick={onCellClick}
            count={count}
            height={height}
            columnExtensions={columnExtensions}
            rightColumns={rightColumns}
            loading={loading}
            changeSorting={this.changeSorting}
            changeColumnOrder={this.changeColumnOrder}
            selected={selected}
            rows={rows}
            tree={tree}
            code={code}
            columns={columns}
            columnOrder={columnOrder}
            sorting={sorting}
            disableSelect={disableSelect}
            customChildRows={this.props.customChildRows}
            changeSelect={this.changeSelect}
            onSaveConfig={this.saveConfig}
            filterField={filterField}
            extraColumns={extraColumns}
            excludeDatetype={excludeDatetype}
            selectMultiple={this.props.selectMultiple}
            getLimit={this.getLimit}
            getPage={this.getPage}
            disableSTT={this.props.disableSTT}
          />

          <ExportTable
            exportType={this.state.openExport}
            filters={this.state.queryFilter}
            filter={this.state.innerFilter}
            filter1={this.state.search}
            filter2={this.state.filterAdvance}
            apiUrl={this.props.notChangeApi ? this.props.apiUrl : this.getApiExport(this.props.apiUrl)}
            exportUrl={this.props.exportUrl}
            onClose={this.handleCloseExportTable}
            open={Boolean(this.state.openExport)}
            listKanbanStatus={this.state.kanbanList}
            moduleCode={this.props.code}
            kanban={this.props.kanban}
            viewConfigUpdateTime={this.state.viewConfigUpdateTime}
            customDataExport={this.props.customDataExport}

          />

          <Dialog
            saveSetting={this.saveSetting}
            saveUpdateAllSystem={this.saveUpdateAllSystem}
            code={code}
            columns={columns}
            fileColumns={fileColumns}
            open={dialogStatus}
            filterField={filterField}
            onClose={this.closeDialogStatus}
            profile={this.props.profile}
          />
          <DialogUI
            maxWidth="sm"
            title="Đồng chí có chắc chắn muốn xóa không?"
            onSave={this.handleDeleteItem}
            onClose={this.closeDialog('deleteDialog')}
            open={deleteDialog}
            saveText="Đồng ý"
          />
          <Menu keepMounted open={Boolean(exportAnchor)} onClose={() => this.setState({ exportAnchor: null })} anchorEl={exportAnchor}>
            {/* <MenuItem onClick={() => this.setState({ openExport: 'Excel', exportAnchor: null })}>Xuất Excel</MenuItem> */}
            <MenuItem onClick={() => this.setState({ openExport: 'PDF' })}>Xuất PDF</MenuItem>
          </Menu>
          <DialogUI
            maxWidth="sm"
            title="Đồng chí có muốn hoàn thành?"
            onSave={this.addApproveTable}
            onClose={() => this.setState({ openDialogApprove: false })}
            open={openDialogApprove}
            saveText="Hoàn thành"
          />

          <DialogUI maxWidth="sm" onClose={this.closeDialog('shareDialog')} open={shareDialog} onSave={this.handleShare}>
            <div style={{ height: 180 }}>
              <Typography variant="h6" align="center">
                Chia sẻ khách hàng
              </Typography>
              <AsyncAutocomplete
                onChange={value => this.changeMutil(value)}
                value={this.state.employessCustomer}
                label="viewableEmployees"
                isMulti
                url={API_USERS}
              />
            </div>
          </DialogUI>
          <Snackbar open={open} variant={variant} message={message} onClose={this.closeDialog('open')} />
        </GridContainer>
      </>
    );
  }

  // Xử lý phân trang
  handleChangePage = (event, activePage) => {
    if (this.props.client) {
      const { perPage, searchClient } = this.state;
      this.client({ activePage, perPage, searchClient });
      return;
    }
    this.setState({ activePage, loading: true });
  };

  handleChangeRowsPerPage = event => {
    if (this.props.client) {
      const { searchClient } = this.state;
      this.client({ activePage: 0, perPage: event.target.value, searchClient });
      return;
    }
    this.setState({ activePage: 0, perPage: event.target.value });
  };

  handlePage = page => {
    if (this.props.client) {
      const { perPage, searchClient } = this.state;
      this.client({ activePage: page, perPage, searchClient });
      return;
    }
    this.setState({ activePage: page, selected: [] });
  };

  client = ({ activePage, perPage, searchClient }) => {
    const { totalRows } = this.state;
    const rowsCount = totalRows.filter(item =>
      Object.keys(item).some(
        key =>
          item[key]
            ? item[key]
              .toString()
              .toLowerCase()
              .indexOf(searchClient.toLowerCase()) !== -1
            : false,
      ),
    );
    const rows = rowsCount.slice(perPage * activePage, perPage * (activePage + 1));
    this.setState({ rows, searchClient, activePage, perPage, count: rowsCount.length, loading: false });
  };

  changeSelect = selected => {
    let newSelected = selected;
    this.props.getStateSelection && this.props.getStateSelection(newSelected);
    if (!this.props.selectMultiple && selected.length === 2) {
      newSelected = [selected[1]];
    }
    this.setState({ selected: newSelected });
    if (this.props.onSelectCustomers) {
      const newSelectedRows = this.state.rows.filter((row, index) => newSelected && newSelected.includes(index));
      this.props.onSelectCustomers(newSelectedRows);
    }
    if (this.props.onSelectCustomers) {
      const newSelectedRows = this.state.rows.filter((row, index) => newSelected && newSelected.includes(index));
      this.props.onSelectCustomers(newSelectedRows);
    }
  };

  closeDialog = dialog => () => {
    this.setState({ [dialog]: false });
  };

  openDialog = dialog => () => {
    this.setState({ [dialog]: true });
  };

  changeSearch = e => {
    e.target.value = clearWidthSpace(e.target.value).trimStart();
    const { activePage, perPage } = this.state;
    this.client({ activePage, perPage, searchClient: e.target.value });
  };
}

const GridList = React.memo(
  ({
    changeSorting,
    rows,
    columns,
    count,
    tree,
    disableSelect,
    changeColumnOrder,
    rightColumns,
    code,
    onRowClick,
    onCellClick,
    pointerCursor,
    selected,
    columnExtensions,
    loading,
    columnOrder,
    changeSelect,
    onSaveConfig,
    extraColumns,
    customChildRows,
    excludeDatetype,
    selectMultiple,
    height,
    getLimit,
    getPage,
    disableSTT
  }) => {
    const [newCls, setNewCls] = React.useState(
      [
        { name: "stt", order: 0, title: "STT", title_init: "STT", type: "String", width: 50 },
        { name: "dateCommon", order: 1, title: "Ngày", title_init: "Date", type: "String", width: 50 },
        { name: "orgName", order: 2, title: "Đơn vị", title_init: "orgName", type: "String", width: 50 },
        { name: "acount", order: 3, title: "Tổng sĩ số", title_init: "count", type: "String", width: 50 },
        { name: "mission", order: 4, title: "Công tác", title_init: "mission", type: "String", width: 50 },
        { name: "training", order: 5, title: "Đi học", title_init: "training", type: "String", width: 50 },
        { name: "onLeave", order: 6, title: "Nghỉ phép", title_init: "Nghỉ phép", type: "String", width: 50 },
        { name: "sickLeave", order: 7, title: "Nghỉ ốm", title_init: "onLeave", type: "String", width: 50 },
        { name: "maternityLeave", order: 8, title: "Nghỉ thai sản", title_init: "maternityLeave", type: "String", width: 50 },
        { name: "vacationLeave", order: 9, title: "Nghỉ chế độ", title_init: "vacationLeave", type: "String", width: 50 },
        { name: "otherLeave", order: 10, title: "Nghỉ khác", title_init: "otherLeave", type: "String", width: 50 },

      ]
    );
    const [defaultColumnWidths, setDefaultColumnWidths] = React.useState([]);
    const dateFormat = localStorage.getItem('dateFomat');
    const containerRef = React.useRef(null);
    const [autoWidth, setAutoWidth] = React.useState(180);
    const [containerWidth, setContainerWidth] = React.useState(0);
    const [pageSizes] = useState([50, 100, 150]);
    const [pageSize, setPageSize] = useState(50);
    const [currentPage, setCurrentPage] = useState(0);
    const [newcollumm, setNewcollumm] = useState([
      {
        title: 'NV Chưa hoàn thành (đạt tỷ lệ %)',
        children: [
          { columnName: 'countNoComplete' },
          { columnName: 'countNoCompleteNoDeadline' },
          { columnName: 'countNoCompleteOutDeadline' },
          { columnName: 'countNoCompleteInDeadline' }
        ]
      },
      {
        title: "NV đã hoàn thành (đạt tỷ lệ %)",
        children: [
          { columnName: 'countComplete' },
          { columnName: 'countCompleteNoDeadline' },
          { columnName: 'countCompleteOutDeadline' },
          { columnName: 'countCompleteInDeadline' }
        ]
      },
    ]);

    useEffect(
      () => {
        // let newColumns = Array.isArray(columns) && columns.filter(i => i.checked);
        // if (extraColumns) newColumns = newColumns.concat(extraColumns);
        // setNewCls(newColumns);
        // let newClss = newCls
        // setDefaultColumnWidths(
        //   Array.isArray(newClss) &&
        //   newClss.map(item => ({
        //     columnName: item.name,
        //     width: item.width || 120,
        //   })),
        // );
      },
      [columns],
    );


    useEffect(
      () => {
        setContainerWidth(containerRef.current.clientWidth);
      },
      [containerRef.current],
    );
    function initialWidthColumn() {
      if (_.find(newCls, i => i && i.width === 'auto')) {
        const info = { total: 0, key: 0, item: {} };
        _.each((i, key) => {
          if (i.width === 'auto') {
            info.key = key;
            info.item = i;
          } else if (Number(i.width)) {
            info.total += i.width;
          }
        });
        const newColumns = newCls.slice();
        setAutoWidth(containerWidth - info.total - 160);
        newColumns.splice(info.key, 1, { ...info.item, width: autoWidth });
        setNewCls(newColumns);
      }
    }

    useEffect(
      () => {
        initialWidthColumn();
      },
      [newCls],
    );
    useEffect(() => {
      window.addEventListener('resize', initialWidthColumn);
      return () => {
        window.removeEventListener('resize', initialWidthColumn);
      };
    }, []);

    const handleResizeWidth = _.debounce(newColumnsData => {
      if (typeof onSaveConfig === 'function') {
        const newColumns = columns.map(c => {
          const foundColumnData = newColumnsData.find(cData => cData.columnName === c.name);
          if (foundColumnData) {
            c.width = foundColumnData.width;
          }
          return c;
        });
        onSaveConfig(newColumns);
      }
    }, SAVE_VIEWCONFIG_ON_RESIZE_DELAY);
    const DateFormatter = ({ value }) => (moment(value).isValid() ? moment(value).format('DD/MM/YYYY') : '');
    const DateData = () => {
      const listDateData = [];
      let excludeDatetypeA = {};
      excludeDatetypeA = excludeDatetype;
      Array.isArray(newCls) &&
        newCls.map(item => {
          if (item.displayType === 'Date' && (!excludeDatetypeA || item.name !== excludeDatetypeA)) {
            listDateData.push(item);
          }
        });
      return listDateData;
    };
    const DateTypeProvider = props => {
      return <DataTypeProvider for={DateData().map(({ name }) => name)} formatterComponent={DateFormatter} {...props} />;
    };

    const DatetimeFormatter = ({ value }) => (moment(value).isValid() ? moment(value).format('DD/MM/YYYY HH:mm:ss') : '');

    const DatetimeData = () => {
      const listDateData = [];
      let excludeDatetypeA = {};
      excludeDatetypeA = excludeDatetype;
      Array.isArray(newCls) &&
        newCls.map(item => {
          if (item.displayType === 'Datetime' && (!excludeDatetypeA || item.name !== excludeDatetypeA)) {
            listDateData.push(item);
          }
        });
      return listDateData;
    };
    const DatetimeTypeProvider = props => (
      <DataTypeProvider for={DatetimeData().map(({ name }) => name)} formatterComponent={DatetimeFormatter} {...props} />
    );
    const NewDateTypeProvider = props => {
      const DateFormatter = ({ value }) => {
        try {
          if (moment(value).isValid()) {
            return moment(value).format('DD/MM/YYYY');
          }
          if (moment(value, 'YYYY-MM-DD').isValid()) {
            return moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY');
          }
          return value;
        } catch { }
        return value;
      };

      return <DataTypeProvider formatterComponent={DateFormatter} {...props} />;
    };

    const TableRow = ({ row, ...restProps }) => (
      <Table.Row
        {...restProps}
        onClick={() => onRowClick && onRowClick(row)}
        style={{
          cursor: pointerCursor,
          backgroundColor: row && row.seen === -1 ? 'lightgrey' : '',
        }}
      />
    );
    const TableCell = ({ column, row, ...restProps }) => {
      return (
        <Table.Cell
          {...restProps}
          onClick={() => {
            onCellClick && onCellClick(column, row)

          }}
          style={{
            cursor: pointerCursor,
            // backgroundColor: cell && cell.seen === -1 ? 'lightgrey' : '',
          }}
        />
      )
    };
    const pagingPanelMessages = {
      showAll: 'Alle',
      rowsPerPage: 'Số dòng hiển thị',
      info: '{from} - {to} của {count} ',
    };
    return (
      <div ref={containerRef} style={{ width: '100%' }} className="ktCustom ktCustom3">
        <Paper className="CustomlistTable" md={12} style={{ overflow: 'auto', boxShadow: 'none' }}>
         
          {!loading ? (
            <Grid className="CustomlistTable" rows={rows} columns={newCls}>
              {tree ? <TreeDataState /> : null}
              {tree ? (
                <CustomTreeData getChildRows={(row, rootRows) => (!customChildRows ? getChildRows(row, rootRows) : customChildRows(row, rootRows))} />
              ) : null}
              <DragDropProvider />
              <PagingState
                pageSize={pageSize}
                onPageSizeChange={value => {
                  setPageSize(value);
                  getLimit && getLimit(value);
                }}
                currentPage={currentPage}
                onCurrentPageChange={value => {
                  setCurrentPage(value);
                  getPage && getPage(value);
                }}
              />
              {<CustomPaging totalCount={count} />}
              <SortingState defaultSorting={[{ columnName: 'order', direction: 'asc' }]} onSortingChange={changeSorting} sortingEnabled={false} />
              {disableSelect ? null : <SelectionState onSelectionChange={changeSelect} selection={selected} />}
              {/* <IntegratedFiltering />
              <IntegratedSorting key="integrated-sorting" /> */}
              {disableSelect ? null : <IntegratedSelection />}
              <VirtualTable
                rowComponent={TableRow}
                cellComponent={TableCell}
                columnExtensions={columnExtensions}
                height={height ? height : 'auto'}
                messages={{ noData: 'Không có dữ liệu' }}
              />
              {/* <TableColumnResizing
                columnWidths={defaultColumnWidths}
                onColumnWidthsChange={value => {
                  setDefaultColumnWidths(value);
                  handleResizeWidth(value);
                }}
              /> */}
              {tree ? null : disableSelect ? null : <TableSelection showSelectAll={selectMultiple} />}
              {code ? <TableColumnReordering order={columnOrder} onOrderChange={changeColumnOrder} /> : null}
              {/* <TableHeaderRow cellComponent={DragColumn} showSortingControls /> */}
              <TableHeaderRow cellComponent={DragColumn} />

              <DateTypeProvider />
              <DatetimeTypeProvider />
              {tree ? <TableTreeColumn for="name" showSelectionControls={!(tree && disableSelect)} showSelectAll={!(tree && disableSelect)} /> : null}

              {/* <TableBandHeader columnBands={newcollumm} /> */}
              <TableFixedColumns rightColumns={rightColumns} />
              {/* <PagingPanel messages={pagingPanelMessages} pageSizes={pageSizes} /> */}
            </Grid>
          ) : <Loading />}

          {/* {loading && <Loading />} */}
        </Paper>
      </div>
    );
  },
);

const MenuFilter = React.memo(({ anchorEl, closeFilter, columns, selectField, filters, code }) => {
  if (code) {
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const list = viewConfig && viewConfig.find(item => item.code === code);
    const data = list && list.listDisplay && list.listDisplay.type.fields.type.columns;
    const others = list && list.listDisplay && list.listDisplay.type.fields.type.others;
    const dataSearch = data && data.filter(item => item.enabaleSearch === true && item.type === 'String');
    return (
      <Menu keepMounted open={Boolean(anchorEl)} onClose={closeFilter} anchorEl={anchorEl}>
        <MenuItem>
          <Typography style={{ fontSize: 15, fontWeight: 'bold', textTransform: 'uppercase' }}>Chọn trường tìm kiếm</Typography>
        </MenuItem>
        {dataSearch &&
          dataSearch.map(i => (
            <MenuItem key={i.name} value={i.name}>
              <Checkbox color="primary" checked={filters.includes(i.name)} onClick={selectField(i.name)} />{' '}
              <Typography style={{ fontSize: 14 }}>{i.title}</Typography>
            </MenuItem>
          ))}
      </Menu>
    );
  }
  return null;
});

const MenuAction = React.memo(
  ({
    code,
    disable3Action,
    id,
    itemCurrent,
    handleClose,
    anchorEl,
    addChildTask,
    extraMenu,
    getData,
    miniActive,
    dashboardPage,
    onChangeSnackbar,
    listMenus,
    rootTab,
    history,
    othersButton,
    disableChangePassword,
    ID,
    profile,
    createdDraft,
    feedback,
    checkRecallDocs
  }) => {
    const [openDialog, setopenDialog] = useState(false);
    const [dialogAssign, setDialogAssign] = useState(false);
    const [openDialogTask, setopenDialogTask] = useState(false);
    const [isPlan, setIsPlan] = useState(false);
    const [mail, setMail] = useState({ to: [], subject: '', text: '' });
    const [idItem, setIdItem] = useState(null);
    const [dialogEmail, setDialogEmail] = useState(false);
    const [SMS, setSMS] = useState({ subject: '', text: '' });
    const [dialogSMS, setDialogSMS] = useState(false);
    const [state, setState] = useState({
      templatess: [],
      template: '',
      typeFile: 'PDF',
      sales: [],
      files: [],
      loading: true,
      templatesItem: '',
      field: null,
      fields: [],
      approvedObj: {
        name: '',
        subCode: code,
        form: '',
        group: null,
        description: '',
      },
      dynamicForms: [],

      data: '',
      openChangePassword: false,
      openFeedback: false,
      id: id,
      password: null,
      rePassword: null,
      feedback: null,
    });
    const [errormessgage, setErrormessage] = useState({});
    const [errorMessgageFeedback, setErrorMessgageFeedback] = useState({});

    const [permissionChangePass, setpermissionChangePass] = useState(false);
    const [snackbar, setSnackbar] = useState({
      open: false,
      variant: 'success',
      message: '',
    });
    const [addHandleDialog, setAddHandleDialog] = useState(false);

    const [dialogHanle, setDialogHanle] = useState(false);
    const [addTask, setAddTask] = useState(false);
    const [idAddTask, setIdAddTask] = useState([]);
    const [disableSave, setDisaleSave] = useState(false);
    const [handleDialogReturnItem, setHandleDialogReturnItem] = useState(false);

    function hanldAddHandle() {
      setSelectedDocs([itemCurrent._id]);
      setCurrentRole(itemCurrent.nextRole);
      setCurrentChild(itemCurrent.originItem && itemCurrent.originItem.children);
      setAddHandleDialog(true);
    }
    function handleDialogReturn() {
      setSelectedDocs([itemCurrent._id]);
      // setCurrentRole(itemCurrent.nextRole);
      // setCurrentChild(itemCurrent.originItem && itemCurrent.originItem.children);
      setHandleDialogReturnItem(true);
    }

    function handleCreateOutGoingDoc(item) {
      history.valueId = itemCurrent._id;
      history.valueCode = itemCurrent.toBookCode;
      history.push(`OutGoingDocument/add?docId=${itemCurrent._id}&toBookCode=${itemCurrent.toBookCode}`);
    }

    function handleDate() {
      setDialogHanle(true);
    }

    function assignWork() {
      setDialogAssign(true);
    }

    const [openApproved, setopenApproved] = useState(false);
    // Xuất biểu mẫu
    function handleDialogTemplate(open = true) {
      if (open === true) setopenDialog({ openDialog: open });
      const { allTemplates } = dashboardPage;
      if (code) {
        const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === code) : [];
        setState(state => ({ ...state, templatess: templatesItem }));
      }
    }

    function closeDialogTemplate() {
      setopenDialog(false);
    }

    function handleTemplate() {
      if (state.typeFile === 'PDF') {
        printTemplte(state.template, id, code);
      } else {
        printTemplteExcel(state.template, id, code);
      }
    }
    // Tạo công việc

    function handleTask() {
      history.valueId = itemCurrent._id;
      history.valueCode = itemCurrent.toBookCode;
      history.push(`Task/add?docId=${itemCurrent._id}&toBookCode=${itemCurrent.toBookCode}`);
    }
    function handleAddTask() {
      setAddTask(true);
      handleClose();
    }
    function handlePlan(item) {
      setIsPlan(true);
      setopenDialogTask(true);
    }

    // Phê duyệt

    function handleApprove() {
      setopenApproved(true);
      const { allTemplates } = dashboardPage;
      Promise.all([fetchData(API_FIELD)]).then(result => {
        if (code) {
          const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === code) : [];
          const fields = result[0].filter(i => i.code === code);
          setState(state => ({ ...state, templatess: templatesItem, fields }));
        }
      });
    }

    function handleAddApprovedGroup(value) {
      setState({ ...state, approvedObj: { ...state.approvedObj, group: value } });
    }

    function handleChangeApproved(e, name) {
      const { approvedObj } = state;
      e.target.value = clearWidthSpace(e.target.value).trimStart();
      approvedObj[name] = e.target.value;
      setState(state => ({ ...state, approvedObj }));
    }

    function addApprove() {
      const { approvedObj, templatess } = state;
      const exsist = templatess.find(i => String(i._id) === String(approvedObj.form));
      let content = '';
      let dynamicForm = '';
      if (exsist) {
        content = exsist.content;
        dynamicForm = exsist._id;
      }
      if (approvedObj.group === null) {
        setSnackbar({
          open: false,
          message: 'Đồng chí phải nhập nhóm phê duyệt',
          variant: 'error',
        });
      }
      if (approvedObj.description === null) {
        setSnackbar({
          open: false,
          message: 'Đồng chí phải nhập ghi chú',
          variant: 'error',
        });
      }
      const groupInfo = [];
      approvedObj.group.group.forEach(item => {
        groupInfo.push({
          order: item.order,
          person: item.person,
          approve: 0,
          reason: '',
        });
      });
      const body = {
        name: approvedObj.name,
        subCode: approvedObj.subCode,
        description: approvedObj.description,
        collectionCode: code,
        content,
        dataInfo: itemCurrent.originItem,
        dynamicForm,
        convertMapping: '5d832729c252b2577006c5ab',
        approveGroup: approvedObj.group._id,
        groupInfo,
        clientId,
        field: state.field,
      };
      onCreateApprove(body);
      setState(state => ({ ...state, openApproved: false, approvedObj: { name: '', subCode: '', form: '', group: null, description: '' } }));
    }
    function handleReturnItem() {
      const body = {
        docIds: selectedDocs || [],
      };
      const url = `${API_INCOMMING_DOCUMENT}/recall-sent-doc`;
      request(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then(res => {
          // setDisableSave(true);
          onChangeSnackbar({ variant: 'success', message: 'Thu hồi văn bản thành công', status: true });
          setHandleDialogReturnItem(false);
          getData();
        })
        .catch(error => {
          // setDisableSave(false);
          onChangeSnackbar({ variant: 'success', message: 'Thu hồi văn bản thất bại', status: false });
        });
    }

    function onCreateApprove(body) {
      fetch(API_APPROVE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then(() => {
          setSnackbar({ open: true, message: 'Thêm phê duyệt thành công', variant: 'success' });
          setopenApproved(false);
          getData();
        })
        .catch(() => {
          setSnackbar({ open: false, message: 'Thêm phê duyệt thất bại', variant: 'error' });
        });
    }

    function closeDialogTask() {
      setIsPlan(false);
      setopenDialogTask(false);
    }

    async function handleEmailDialog() {
      if (code === 'SalesQuotation') {
        const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent['customer.customerId']}`);
        setMail({ ...mail, to: [customer] });
      }
      if (code === 'Customer') {
        const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent._id}`);
        setMail({ ...mail, to: [customer] });
      }

      handleDialogTemplate(false);
      setDialogEmail(!dialogEmail);
    }

    async function handleSMSDialog() {
      handleDialogTemplate(false);
      setDialogSMS(!dialogSMS);
    }

    function closeAddHandleDialog() {
      setAddHandleDialog(false);
    }

    function closeHanleDate() {
      setDialogHanle(false);
    }

    function closeAssignTask() {
      setDialogAssign(false);
    }

    function callbackAssign(snack, close = true) {
      setSnackbar(snack);
      if (close) setDialogAssign(false);
    }

    async function sendMail(props) {
      if (!(mail.text || props.content) || !mail.subject || !state.template || !mail.to || !mail.to.length) {
        return;
      }
      try {
        const data = { ...mail };

        const content = props;
        if (content) {
          data.content = content;
        }

        data.to = _.uniq(mail.to.map(i => i.email).filter(i => Boolean(i))).join();
        if (!data.to) {
          alert('Danh sách Khách hàng chọn không có email');
          return;
        }
        const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
        const formatData = {
          title: data.subject,
          template: state.template,
          viewConfig, // .find(item => item.code === code),
          html: data.content,
          listCustomer: mail.to,
          code,
        };

        await fetchData(API_MAIL, 'POST', formatData);
        setDialogEmail(false);
        alert('Gửi mail thành công');
      } catch (error) {
        // console.log(error);
      }
    }

    async function sendSMS() {
      if (!SMS.text || !state.template || !SMS.to || !SMS.to.length) {
        return;
      }
      try {
        const data = { ...SMS };
        if (!data.to) {
          alert('Danh sách Khách hàng chọn không có SMS');
          return;
        }
        const formatData = {
          template: state.template,
          html: data.text,
          listCustomer: SMS.to,
          code,
        };

        await fetchData(API_SMS1, 'POST', formatData);
        setDialogSMS(false);
        alert('Gửi SMS thành công');
      } catch (error) {
        // console.log(error);
        alert('Gửi không thành công');
      }
    }

    function onSelectFile(e) {
      let listFile = [];
      const array = e.target.files;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        listFile.push(element);
      }
      listFile = _.uniqBy(state.files.concat(listFile), 'name');
      setState({ ...state, files: listFile });
    }

    function deleteFile(v) {
      const listFile = state.files.filter((i, b) => b !== v);
      setState({ ...state, files: listFile });
    }
    function changePassword(id) {
      let ress = null;
      if (Object.keys(errormessgage).length > 0) setSnackbar({ open: true, message: 'Vui lòng nhập đủ thông tin', variant: 'error' });
      else
        fetch(API_ROLEAPP_CHANGE_PASSWORD_PERSON, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: id,
            password: state.password,
          }),
        })
          .then(response => {
            ress = response;
            if (response.status === 401) {
              setState({ ...state, openChangePassword: false });
              setSnackbar({ open: true, message: 'Token hết hạn vui lòng đăng nhập lại', variant: 'error' });
              return response.json();
            } else if (response.status === 200) {
              setState({ ...state, openChangePassword: false, password: null, rePassword: null });
              setSnackbar({ open: true, message: 'Thay đổi mật khẩu thành công', variant: 'success' });
              return response.json();
            } else if (response.status === 400) {
              return response.json();
            } else {
              setSnackbar({ open: true, message: 'Thay đổi mật khẩu thất bại', variant: 'error' });
              return response.json();
            }
          })
          .then(data => {
            if (ress.status === 400) {
              setSnackbar({ open: true, message: data.message, variant: 'error' });
            }
          })
          .catch(() => {
            setSnackbar({ open: true, message: 'Thay đổi mật khẩu thất bại', variant: 'error' });
          });
    }
    const changePasswordUser = e => {
      setState({ ...state, [e.target.name]: e.target.value });
    };
    // feedback
    useEffect(
      () => {
        let messFeedback = { ...errorMessgageFeedback };
        if (state.feedback === null || state.feedback.trim() === '') {
          messFeedback = { feedback: 'Ý kiến không được để trống', errorFeedback: true };
        } else {
          delete messFeedback.feedback;
          delete messFeedback.errorFeedback;
        }
        setErrorMessgageFeedback({ ...messFeedback });
      },
      [state.feedback],
    );
    const changeFeedback = e => {
      setState({ ...state, [e.target.name]: e.target.value });
    };
    const saveFeedback = id => {
      try {
        if (Object.keys(errorMessgageFeedback).length > 0)
          return setSnackbar({ open: true, message: 'Vui lòng nhập đủ thông tin', variant: 'error' });
        else {
          fetch(API_COMMENT, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: 'IncommingDocument',
              content: state.feedback,
              id: id,
              image: [],
            }),
          })
            .then(res => res.json())
            .then(data => {
              setSnackbar({ open: true, message: 'Cho ý kiến thành công', variant: 'success' });
              setState({ ...state, openFeedback: false, feedback: null });
            })
            .catch(error => {
              setSnackbar({ open: true, message: 'Cho ý kiến thất bại', variant: 'error' });
              setState({ ...state, openFeedback: false, feedback: null });
            });
        }
      } catch (error) {
        setSnackbar({ open: true, message: 'Cho ý kiến thất bại', variant: 'error' });
        setState({ ...state, openFeedback: false, feedback: null });
      }
    };
    function onSaveAddTask() {
      setDisaleSave(true);
      fetch(API_ADD_TASK_DOCUMENT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId: itemCurrent._id,
          taskIds: idAddTask,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 1) {
            setSnackbar({ open: true, message: 'Thêm công việc liên quan thành công!', variant: 'success' });
            setAddTask(false);
          } else {
            setSnackbar({ open: true, message: data.message, variant: 'error' });
            setDisaleSave(false);
          }
        });
    }
    useEffect(
      () => {
        let mess = errormessgage;

        if (state.password === null) mess = { ...mess, password: 'Mật khẩu không được để trống', errorpass: true };
        else if (state.password.length < 8) mess = { ...mess, password: 'Mật khẩu tối thiểu 8 ký tự!', errorpass: true };
        else if (state.password.length > 100) mess = { ...mess, password: 'Mật khẩu tối đa 100 ký tự!', errorpass: true };
        else {
          delete mess.password;
          delete mess.errorpass;
        }
        if (state.rePassword === null) mess = { ...mess, rePassword: 'Mật khẩu không được để trống', errorrepass: true };
        else if (state.rePassword.length < 8) mess = { ...mess, rePassword: 'Mật khẩu tối thiểu 8 ký tự!', errorrepass: true };
        else if (state.rePassword.length > 100) mess = { ...mess, rePassword: 'Mật khẩu tối đa 100 ký tự!', errorrepass: true };
        else {
          delete mess.rePassword, delete mess.errorrepass;
        }
        if (
          state.password !== null &&
          state.rePassword !== null &&
          state.password !== state.rePassword &&
          state.rePassword.length >= 8 &&
          state.password.length >= 8 &&
          state.rePassword.length <= 100 &&
          state.password.length <= 100
        )
          mess = { ...mess, rePassword: 'Mật khẩu không khớp với mật khẩu mới vui lòng nhập lại!', errorrepass: true };
        else if (
          state.password !== null &&
          state.rePassword !== null &&
          state.password === state.rePassword &&
          state.rePassword.length >= 8 &&
          state.password.length >= 8 &&
          state.rePassword.length <= 100 &&
          state.password.length <= 100
        ) {
          delete mess.rePassword, delete mess.errorrepass;
        }
        setErrormessage({ ...mess });
      },
      [state.password, state.rePassword],
    );
    const getPermissionChangePass = async id => {
      const data = await fetchData(`${API_ROLE_APP}/Employee/${id}`);
      if (data && data.roles[1] && data.roles[1].data) {
        data.roles[1].data.map(el => {
          if (el.name === 'password') setpermissionChangePass(el.data && el.data.changePassWord);
        });
      }
    };
    useEffect(() => {
      getPermissionChangePass(ID);


    }, []);
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [currentRole, setCurrentRole] = useState('');
    const [currentChild, setCurrentChild] = useState([]);
    return (
      <div>
        {othersButton ? (
          <Menu open={Boolean(anchorEl)} onClose={handleClose} anchorEl={anchorEl}>
            {!othersButton.includes('XuatBieuMau') ? null : <MenuItem onClick={() => handleDialogTemplate(true)}>Xuất biểu mẫu</MenuItem>}
            {checkRecallDocs && <MenuItem onClick={() => handleDialogReturn()}>Thu hồi</MenuItem>}
          </Menu>
        ) : (
          <Menu open={Boolean(anchorEl)} onClose={handleClose} anchorEl={anchorEl}>
            {/* <MenuItem onClick={assignWork}>Giao việc</MenuItem>
          
          <MenuItem onClick={handleEmailDialog}>Gửi mail</MenuItem>
          <MenuItem>Gọi điện</MenuItem>
          <MenuItem onClick={handleSMSDialog}>SMS</MenuItem>
          <MenuItem onClick={handleApprove}>Yêu cầu phê duyệt</MenuItem> */}

            {disable3Action || !listMenus || rootTab === 'supporters' || rootTab === 'viewers'
              ? null
              : listMenus.map(n => {
                if (n === 'setProcessor') {
                  return <MenuItem onClick={hanldAddHandle}>Thêm xử lý</MenuItem>;
                }
                if (n === 'changeDeadline') {
                  return <MenuItem onClick={handleDate}>Gia hạn xử lý</MenuItem>;
                }
                if (n === 'createTask') {
                  return (
                    <>
                      <MenuItem onClick={handleTask}>Tạo hồ sơ công việc</MenuItem>
                      <MenuItem onClick={handleAddTask}>Hồ sơ công việc liên quan</MenuItem>
                    </>
                  );
                }
                if (n === 'createPlan') {
                  return <MenuItem onClick={handlePlan}>Tạo kế hoạch</MenuItem>;
                }
                return null;
              })}

            {
              checkRecallDocs && <MenuItem onClick={() => handleDialogReturn()}>Thu hồi</MenuItem>
            }

            {profile && profile.roleGroupSource === 'VANTHU'
              ? null
              : code === 'IncommingDocument' &&
              (createdDraft === undefined || createdDraft === true) && <MenuItem onClick={handleCreateOutGoingDoc}>Tạo dự thảo</MenuItem>}
            {/* {code === 'IncommingDocument' && (createdDraft === undefined || createdDraft === true) && <MenuItem onClick={handleCreateOutGoingDoc}>Tạo dự thảo</MenuItem>} */}
            <MenuItem onClick={() => handleDialogTemplate(true)}>Xuất biểu mẫu</MenuItem>
            {extraMenu && extraMenu(id)}
            {disableChangePassword === true &&
              permissionChangePass === true && (
                <MenuItem
                  onClick={() => {
                    setState({ ...state, openChangePassword: true, id: id });
                    handleClose();
                  }}
                >
                  Đặt lại mật khẩu
                </MenuItem>
              )}

            {code === 'IncommingDocument' &&
              feedback === true && (
                <MenuItem
                  onClick={() => {
                    setState({ ...state, openFeedback: true, id: id });
                    handleClose();
                  }}
                >
                  Cho ý kiến
                </MenuItem>
              )}
          </Menu>
        )}
        {/* đặt lại mật khẩu */}
        <Dialogg
          onClose={() => {
            setHandleDialogReturnItem(false);
          }}
          aria-labelledby="customized-dialog-title"
          open={handleDialogReturnItem}
          maxWidth="md"
        >
          <DialogTitle id="customized-dialog-title">Thông báo</DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>Đồng chí có chắc chắn muốn thu hồi?</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleReturnItem} color="primary" variant="contained">
              Đồng ý
            </Button>
            <Button
              onClick={() => {
                setHandleDialogReturnItem(false);
              }}
              color="secondary"
              variant="contained"
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialogg>
        <Dialogg
          open={state.openChangePassword}
          onClose={() => setState({ ...state, openChangePassword: false, pass: null, rePassword: null })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">Đặt lại mật khẩu</DialogTitle>
          <DialogContent>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              variant="outlined"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới..."
              style={{ marginTop: 10 }}
              value={state.password}
              name="password"
              type="password"
              onChange={e => changePasswordUser(e)}
              required={true}
              error={errormessgage.errorpass}
              helperText={errormessgage.password}
            />
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              variant="outlined"
              label="Nhập lại mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới..."
              style={{ marginTop: 10 }}
              value={state.rePassword}
              name="rePassword"
              type="password"
              onChange={e => changePasswordUser(e)}
              required={true}
              error={errormessgage.errorrepass}
              helperText={errormessgage.rePassword}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => changePassword(id)}>
              LƯU
            </Button>
            <Button
              variant="contained"
              color="secondary"
              autoFocus
              onClick={() => setState({ ...state, openChangePassword: false, id: null, password: null, rePassword: null })}
            >
              HỦY
            </Button>
          </DialogActions>
        </Dialogg>
        {/* cho ý kiến */}
        <Dialogg
          open={state.openFeedback}
          onClose={() => setState({ ...state, openFeedback: false, feedback: null })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">Cho ý kiến</DialogTitle>
          <DialogContent>
            <TextField
              rows={5}
              label={'Ý kiến'}
              onChange={e => changeFeedback(e)}
              name="feedback"
              value={state.feedback}
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              required={true}
              error={errorMessgageFeedback.errorFeedback}
              helperText={errorMessgageFeedback.feedback}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => saveFeedback(id)}>
              LƯU
            </Button>
            <Button variant="contained" color="secondary" autoFocus onClick={() => setState({ ...state, openFeedback: false, feedback: null })}>
              HỦY
            </Button>
          </DialogActions>
        </Dialogg>
        <EmailDialog
          dialogEmail={dialogEmail}
          setDialogEmail={setDialogEmail}
          sendMail={sendMail}
          mail={mail}
          setMail={setMail}
          state={state}
          setState={setState}
          deleteFile={deleteFile}
        />
        <input style={{ display: 'none' }} id="contained-button-file" multiple onChange={onSelectFile} type="file" />
        <SMSDialog dialogSMS={dialogSMS} setDialogSMS={setDialogSMS} sendSMS={sendSMS} SMS={SMS} state={state} setState={setState} setSMS={setSMS} />

        <AddHandleDialog
          open={addHandleDialog}
          docIds={selectedDocs}
          currentRole={currentRole}
          onClose={() => {
            setAddHandleDialog(false);
          }}
          onChangeSnackbar={onChangeSnackbar}
          onSuccess={() => {
            setAddHandleDialog(false);
          }}
          role={rootTab}
          currentChild={currentChild}
        />

        <DialogUI dialogAction={false} onClose={closeHanleDate} open={dialogHanle} maxWidth="sm">
          <ExtendHanleDialog
            onClose={closeHanleDate}
            onChangeSnackbar={onChangeSnackbar}
            onSuccess={() => {
              closeHanleDate();
              getData();
            }}
            item={itemCurrent}
          />
        </DialogUI>

        <DialogUI dialogAction={false} onClose={closeAssignTask} open={dialogAssign}>
          <AssignTask id={id} callbackAssign={callbackAssign} code={code} itemCurrent={itemCurrent} />
        </DialogUI>
        <DialogUI title="Xuất biểu mẫu" onSave={handleTemplate} open={openDialog} onClose={closeDialogTemplate} saveText="In biểu mẫu">
          <TextField
            value={state.template}
            fullWidth
            select
            onChange={e => setState({ ...state, template: e.target.value })}
            label="Biểu mẫu"
            autoFocus
          >
            {state.templatess &&
              state.templatess.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item.title}
                </MenuItem>
              ))}
          </TextField>
          {state.template ? (
            <>
              <TextField
                value={state.typeFile}
                fullWidth
                select
                onChange={e => setState({ ...state, typeFile: e.target.value })}
                label="Định dạng file"
              >
                <MenuItem value="PDF">PDF</MenuItem>
                <MenuItem value="XLSX">EXCEL</MenuItem>
              </TextField>
            </>
          ) : null}
        </DialogUI>
        <SwipeableDrawer
          anchor="right"
          onClose={closeDialogTask}
          open={openDialogTask}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <AddProjects
            id="add"
            isPlan={isPlan}
            data={{
              source: code,
              sourceData: {
                model: code,
                objectId: itemCurrent.originItem._id,
                objectName: itemCurrent.originItem.name,
              },
              taskType: 1,
              customer: itemCurrent.originItem ? itemCurrent.originItem.customer : null,
              join: itemCurrent.originItem.join ? itemCurrent.originItem.join : [],
              inCharge: itemCurrent.originItem.inCharge ? itemCurrent.originItem.inCharge : [],
              approved: itemCurrent.originItem.approved ? itemCurrent.originItem.approved : [],
              support: itemCurrent.originItem.support ? itemCurrent.originItem.support : [],
              viewable: itemCurrent.originItem.viewable ? itemCurrent.originItem.viewable : [],
              isProject: false,
              parentId: addChildTask ? id : null,
              minDate: addChildTask ? itemCurrent.originItem.startDate : null,
              maxDate: addChildTask ? itemCurrent.originItem.endDate : null,
              startDate: addChildTask ? itemCurrent.originItem.startDate : null,
              others: {
                [code]: id,
              },
            }}
            callback={() => {
              closeDialogTask(false);
              getData();
            }}
          />
        </SwipeableDrawer>
        <DialogUI
          onSave={addApprove}
          maxWidth="md"
          fullWidth
          open={openApproved}
          onClose={() => {
            setopenApproved(false);
          }}
          aria-labelledby="form-dialog-title1"
        >
          <TextField label="Tên phê duyệt" name="name" onChange={e => handleChangeApproved(e, 'name')} value={state.approvedObj.name} />

          {/* <AsyncAutocomplete
            placeholder="Tìm kiếm nhóm phê duyệt ..."
            url={API_APPROVE_GROUPS}
            value={state.approvedObj.group}
            onChange={handleAddApprovedGroup}
            label=" Nhóm phê duyệt"
          /> */}

          <TextField label="Tên quy trình" name="name" onChange={e => handleChangeApproved(e, 'subCode')} value={state.approvedObj.subCode} />
          <TextField label="Field name" select onChange={e => setState({ ...state, field: e.target.value })} value={state.field}>
            {state.fields.map(i => (
              <MenuItem value={i._id}>{i.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Chọn biểu mẫu phê duyệt"
            name="name"
            onChange={e => handleChangeApproved(e, 'form')}
            value={state.approvedObj.form}
            style={{ width: '100%' }}
            select
          >
            {state.templatess &&
              state.templatess.map(form => (
                <MenuItem key={form._id} value={form._id}>
                  {form.title}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            label="Ghi chú"
            name="description"
            onChange={e => handleChangeApproved(e, 'description')}
            value={state.approvedObj.description}
          />
        </DialogUI>
        <DialogUI
          onSave={() => onSaveAddTask()}
          maxWidth="md"
          fullWidth
          open={addTask}
          disableSave={disableSave}
          onClose={() => {
            setAddTask(false);
          }}
          aria-labelledby="form-dialog-title1"
        >
          <TaskDocs
            getDataTask={value => {
              let newData = idAddTask;
              value.map(item => newData.push(item._id));
              setIdAddTask(newData);
            }}
            menuAction={true}
          />
        </DialogUI>
        <Snackbar
          open={snackbar.open}
          variant={snackbar.variant}
          message={snackbar.message}
          onClose={() =>
            setSnackbar({
              open: false,
              message: '',
              variant: '',
            })
          }
        />
      </div>
    );
  },
);

const mapStateToProps = createStructuredSelector({
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ListPage);

ListPage.defaultProps = {
  deleteOption: 'ids',
  // filter: { status: 1 },
  filter: {},
  treeName: 'name',
  columnExtensions: [{ columnName: 'stt', width: 100 }],
  rightColumns: ['edit'],
  reload: false,
  perPage: 50,
  status: 'crmStatus',
  disableEdit: false,
  extraMenu: null,
  kanbanKey: 'type',
  selectMultiple: true,
  listMenus: ['setProcessor', 'changeDeadline', 'createTask', 'createPlan', 'createOutGoingDoc'],
};
