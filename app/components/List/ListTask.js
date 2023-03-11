import React, { useState, useEffect } from 'react';
import {
  Fab as Fa,
  TablePagination,
  InputAdornment,
  TextField as TextFieldUI,
  Menu,
  MenuItem,
  Checkbox,
  Typography,
  Button,
  Tooltip,
  Paper,
  IconButton
} from '@material-ui/core';
import XLSX from 'xlsx';
import {
  Visibility,
  Delete,
  ImportExport,
  Add,
  Edit,
  FilterList,
  Dehaze,
  Archive,
  CloudUpload,
  CloudDownload,
  Send,
  Done,
  Close,
} from '@material-ui/icons';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import {
  SortingState,
  IntegratedSorting,
  IntegratedFiltering,
  IntegratedSelection,
  SelectionState,
  TreeDataState,
  CustomTreeData,
  DataTypeProvider,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import { VolumeUp, KeyboardVoice } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  TableFixedColumns,
  TableSelection,
  TableTreeColumn,
  TableColumnResizing,
  VirtualTable,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import {
  API_VIEW_CONFIG,
  API_APPROVE_GROUPS,
  API_APPROVE,
  API_COMMON_APPROVE_FINISH,
  API_CUSTOMERS,
  API_MAIL,
  API_FIELD,
  API_TASK_PROJECT,
  UPLOAD_APP_URL,
  API_SMS1,
  SPEECH_2_TEXT
} from 'config/urlConfig';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/ItemGrid';
import CustomInputField from '../Input/CustomInputField';
import { Link } from 'react-router-dom';
import Dialog from 'components/Modal/DialogAsync';
import AddProjects from 'containers/AddProjects';
import { TextField, Dialog as DialogUI, SwipeableDrawer, AsyncAutocomplete, Loading, AssignTask, MakeCreateTaskRequest } from 'components/LifetekUi';
import Snackbar from 'components/Snackbar';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { tableToExcel, tableToPDF } from '../../helper';

import _ from 'lodash';
import moment from 'moment';
import makeSelectDashboardPage, { makeSelectMiniActive } from '../../containers/Dashboard/selectors';
// import dot from 'dot-object';
import { convertDot, serialize, convertOb, printTemplte, fetchData, getDataBeforeSend } from '../../helper';
// import { STATE } from '../../config/const';
import { clientId } from '../../variable';
import { SAVE_VIEWCONFIG_ON_RESIZE_DELAY } from '../../utils/constants';
import { parseTask } from '../../utils/common';
import EmailDialog from './EmailDialog';
import SMSDialog from './SMSDialog';
import { API_UPDATE_ALL_SYSTEM } from '../../config/urlConfig';
import './CustomCSS.css';
const Process = ({ title, value, color }) => (
  <Tooltip title={title}>
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'no-wrap', height: 10, width: '100%', borderRadius: 2 }}>
      <div style={{ width: `${value}%`, background: `${color}`, height: '100%' }} />
      <div style={{ width: `${100 - value}%`, height: '100%', background: '#9e9e9e75' }} />
    </div>
  </Tooltip>
);

// function downloadFile(url, fileName) {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', url, true);
//   xhr.responseType = 'blob';
//   xhr.onload = function() {
//     const urlCreator = window.URL || window.webkitURL;
//     const imageUrl = urlCreator.createObjectURL(this.response);
//     const tag = document.createElement('a');
//     tag.href = imageUrl;
//     tag.download = fileName;
//     document.body.appendChild(tag);
//     tag.click();
//     document.body.removeChild(tag);
//   };
//   xhr.send();
// }

function getChildRows(row, rootRows) {
  const childRows = rootRows.filter(r => r.parentId === (row ? row._id : null));
  return childRows.length ? childRows : null;
}

const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: {
    margin: '5px',
    float: 'right',
    boxShadow: 'none',
    padding: 0,
    margin: ' 0 5px',
    minHeight: 35,
    height: 35,
    width: 35,
    transform: 'translateX(-12px)',
  },
};
function DragColumn({ draggingEnabled, sortingEnabled, ...rest }) {
  if (rest.column.name === 'edit') return <TableHeaderRow.Cell {...rest} sortingEnabled={false} draggingEnabled={false} />;
  return <TableHeaderRow.Cell sortingEnabled draggingEnabled={draggingEnabled} {...rest} />;
}

const ExportTable = React.memo(
  ({ filters, filter, open, onClose, listKanbanStatus, apiUrl, moduleCode, customData, kanban, viewConfigUpdateTime }) => {
    const url = apiUrl;
    // const type = typeOf.type
    // console.log(type,type.type, 'nnnnn')
    //  const [customDatas, setCustomDatas] = useState({})
    //  const [departments, setDepartments] = useState();
    // console.log(moduleCode);
    const [dataPageExcell, setDataPageExcell] = useState({
      data: [],
      totalPage: 1,
      pageNumber: 1,
      numberOrderFirstPage: 1,
    });
    const [viewConfigData, setViewConfigData] = useState([]);

    const { data, totalPage, pageNumber, numberOrderFirstPage } = dataPageExcell;
    //  const { category, startDate, department, endDate, employee } = customDatas || {}

    useEffect(
      () => {
        if (moduleCode) {
          // fetchData(API_ORIGANIZATION, 'GET', null).then(departmentsData => {
          //   const mapItem = array => {
          //     array.forEach(item => {
          //       if (item && item._id) result.push({ id: item._id, name: item.name });
          //       if (item.child) mapItem(item.child);
          //     });
          //   };

          //   let result = [];
          //   mapItem(departmentsData);
          //   //  setDepartments(result)
          // });
          const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
          const list = viewConfig.find(item => item.code === 'Task');
          const data = (list && list.listDisplay && list.listDisplay.type.fields.type.columns) || [];
          const others = (list && list.listDisplay && list.listDisplay.type.fields.type.others) || [];
          const exportColumns = data && data.concat(others).filter(c => c.exportTable);
          setViewConfigData(exportColumns);
        }
      },
      [viewConfigUpdateTime],
    );

    //  useEffect(() => {
    //    setCustomDatas(customData)
    //  }, [customData])

    useEffect(
      () => {
        if (url && open) {
          getDataFirstTime();
        }
      },
      [filters, open],
    );

    const getDataFirstTime = async () => {
      try {
        const filterLinK = filters.slice(9, filters.length);

        const query = serialize({ filters });
        let arr = [];
        viewConfigData.forEach(item => {
          arr.push(item.name);
        });
        const selectors = _.join(arr, ' ');

        const apiUrl = `${url}?selector=${selectors}&${filterLinK}`;

        const res = await fetchData(apiUrl);
        const numberRecordLimitBackEnd = res.limit;
        if (!res.data) throw res;
        if (res.count > numberRecordLimitBackEnd) {
          const numberTotalPageLimitBackEnd = Math.ceil(res.count / numberRecordLimitBackEnd);
          for (let i = 0; i < numberTotalPageLimitBackEnd; i++) {
            await getDataPagination(numberRecordLimitBackEnd * i, numberRecordLimitBackEnd, numberTotalPageLimitBackEnd, i + 1);
          }
        } else {
          setDataPageExcell({ ...dataPageExcell, data: res.data, totalPage: 1, pageNumber: 1, numberOrderFirstPage: 1 });
          onClose({ lastPage: true });
        }
      } catch (err) {
        // console.log(err, 'hhh');
        onClose({ res: err, error: true, lastPage: true });
      }
    };

    const getDataPagination = async (skip, limit, totalPage, pageNumber) => {
      const lastPage = totalPage === pageNumber;
      try {
        // let newFilter = { filter: { ...filters }, skip: skip, limit: limit };
        let arr = [];
        viewConfigData.forEach(item => {
          arr.push(item.name);
        });
        const selectors = _.join(arr, ' ');
        // const query = serialize(newFilter);
        const apiUrl = `${url}?${selectors}&${filters}`;
        const res = await fetchData(apiUrl);
        if (!res.data) throw res;
        setDataPageExcell({ ...dataPageExcell, data: res.data, totalPage: totalPage, pageNumber: pageNumber, numberOrderFirstPage: skip + 1 });
        onClose({ totalPage, pageNumber, lastPage });
      } catch (err) {
        // console.log(err, 'loinay');
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
          {/* check22 */}
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>STT</th>
                {viewConfigData.map(cols => (
                  <th style={{ width: cols.width }}>{cols.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                return (
                  <tr>
                    <td style={{ width: 80 }}>{index + 1}</td>
                    {viewConfigData.map(cols => (
                      <td
                        style={{
                          width: cols.width,
                          textAlign: cols.type === 'Date' || cols.type === 'Number' ? 'center' : null,
                          paddingTop: cols.type === 'Number' ? '10px' : null,
                          paddingRight: cols.type === 'Number' ? 0 : null,
                        }}
                      >
                        {typeof row[cols.name] === 'string' || typeof row[cols.name] === 'number' ? row[cols.name] : ''}
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
      columns: [],
      columnOrder: [],
      rows: [],
      // files: [],
      selected: [],
      dialogStatus: false,
      activePage: 0,
      openExport: null,
      exportAnchor: null,
      perPage: this.props.perPage,
      search: '',
      searchClient: '',
      deleteDialog: false,
      loading: true,
      open: false,
      queryFilter: null,
      totalRows: [],
      anchorEl: null,
      variant: 'success',
      message: '',
      sorting: [{ columnName: 'createdAt', direction: 'desc' }],
      filters: ['name'],
      count: 0,
      anchorElAction: false,
      importExport: this.props.importExport ? `/import?type=${this.props.importExport}` : this.props.code ? `/import?type=${this.props.code}` : null,
      id: null,
      itemCurrent: { originItem: '' },
      openDialogApprove: false,
      kanbanList: [],
      plannerList: {},
      columnExtensions: this.props.columnExtensions,
      rightColumns: this.props.rightColumns,
      departments: [],
      hasPermissionViewConfig: false,
      filterAdvance: {},
      innerFilter: {},
      valueFilter: 0,
      startDate: '',
      html: [],
      htmlTotal: 0,
      endDate: '',
      reloadCount: 'reload',
      loadingVoice: false,

    };
  }
  componentDidMount() {
    const localData = JSON.parse(localStorage.getItem([this.props.status])) || null;
    const localDataKanBan = localData ? localData.find(item => item.code === this.props.kanban) : null;
    const kanbanList = this.props.kanban ? (localDataKanBan ? localDataKanBan.data : []) : [];
    const localDataPlane = JSON.parse(localStorage.getItem('taskStatus')) || null;
    const localDataKanBanPlane = localDataPlane ? localData.find(item => item.code === 'PLANER') : null;
    const plannerList = localDataKanBanPlane ? localDataKanBanPlane.data : [];
    if (this.props.code) {
      try {
        const { dashboardPage } = this.props;
        let currentRole;
        if (dashboardPage.role.roles) {
          currentRole = dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.code);
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
      } catch (error) {
        // ignore error
      }
      const code = this.props.code;
      const view = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === code);
      const columns = (view && view.listDisplay && view.listDisplay.type && view.listDisplay.type.fields.type.columns) || [];
      const fileColumns = view && view.listDisplay && view.listDisplay.type && view.listDisplay.type.fields.type.fileColumns;
      const others = view && view.listDisplay.type.fields.type.others.map(item => ({ ...item, tp: 1 }));
      const newCls = [...columns, ...others, { name: 'edit', checked: !this.props.disableEdit, title: 'Hành động' }];
      const columnOrder = newCls
        .sort((a, b) => a.order - b.order)
        .map(item => item.name)
        .concat(['edit']);
      this.setState({ columns: newCls, columnOrder, fileColumns, loading: true, kanbanList, plannerList: _.keyBy(plannerList, 'type') }, () => {
        this.loadData();
      });
    } else {
      this.setState(
        {
          columns: this.props.columns.concat({ name: 'edit', checked: !this.props.disableEdit, title: 'Hành động' }),
          loading: true,
          kanbanList,
          plannerList: _.keyBy(plannerList, 'type'),
        },
        () => {
          this.loadData();
        },
      );
    }
  }
  startRecording = () => {
    // setIsRecording(true);
    this.setState({ isRecording: true })
  };
  requestRecorder = async () => {
    let stream;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } else console.log('error');
    return new MediaRecorder(stream);
  }
  setDataUpdate = () => {
    this.setState({ dataUpload: null })

    console.log("setDataUpdate")
    const { recorder, isRecording } = this.state
    if (!recorder) {
      if (isRecording) {
        this.requestRecorder().then((data) => {
          this.setState({
            recorder: data
          })
        });
        // this.requestRecorder().then(setRecorder, console.error);
      }
      return;
    }
    if (isRecording) {
      this.setState({ activeConvert: false })

      recorder.start();
    } else {
      console.log("dbhdfbvhdhfvbhfdv")
      this.setState({ activeConvert: true })
      recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = (e) => {
      // console.log('e', e);
      // setAudioURL(URL.createObjectURL(e.data));
      this.setState({ audioURL: URL.createObjectURL(e.data), dataUpload: e })
      // setDataUpload(e);
      console.log(e, "sss")

    };

    recorder.addEventListener('dataavailable', handleData);
    return () => recorder.removeEventListener('dataavailable', handleData);

  }
  startConvert = async () => {
    const { dataUpload } = this.state

    this.setState({ activeConvert: false })
    const data = {
      lastModified: dataUpload ? dataUpload.timecode : null,
      lastModifiedDate: moment(),
      name: `File_ghi_âm_${moment().format('hh:mm DD/MM/YYYY')}`,
    };
    const dataUploads = dataUpload ? dataUpload.data : null;
    let dataRecord = dataUpload ? Object.assign(dataUploads, data) : null;
    const form = new FormData();

    let file = dataRecord;
    form.append('data', file);
    console.log(file, "file")
    this.setState({ waitConvert: false, dataUpload: null })

    if (file !== null) {
      try {
        const url = SPEECH_2_TEXT;
        const head = {
          body: form,
          method: 'POST',
        };
        this.setState({ loadingVoice: true })
        await fetch(url, head)
          .then(res => res.json())
          .then(res => {
            this.setState({ loadingVoice: false })
            if (res.status === 'ok') {
              const str = res.str.join('\n');
              // onChange && onChange({ target: { name: restProps.name, value: str } });
              if (res && res.str && Array.isArray(res.str) && res.str.length) {
                const e = {
                  target: {
                    value: res.str[0]
                  }
                }
                this.handleSearch(e)
              }
            } else {
              // onChange && onChange({ target: { name: restProps.name, value: res.traceback } });
              // alert(res.traceback);
            }
            // setWaitConvert(false);
            this.setState({ waitConvert: false })
          })
          .catch(e => {
            console.log(e, 'error');
            // setWaitConvert(false);

            this.setState({ waitConvert: false, loadingVoice: false })
          });
      } catch (err) {
        console.log(err, 'error');
      }
    } else {
      // setWaitConvert(false);
      this.setState({ waitConvert: false })
      // this.props.onChangeSnackbar && this.props.onChangeSnackbar({ variant: 'warning', message: 'Có vẻ không thu được âm thanh nào!', status: true });
    }

  };
  stopRecording = () => {
    this.setState({ isRecording: false })
  };
  stopRecording = () => {
    this.setState({ isRecording: false })
  };
  setWaitConvert(value) {
    this.setState({ waitConvert: value });
  }
  async componentDidUpdate(preProps, preState) {
    // console.log('this.props.reload', this.props.reload, 'preProps.reload', preProps.reload);
    // if (this.state.search !== preState.search || this.props.code !== preProps.code) {
    const reload = this.props.reload && this.props.reload !== preProps.reload;
    if (typeof this.lastQuery !== 'undefined') {
      this.loadData(reload);
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

    if (preState.openImport !== openImport) {
      this.setState({ reload: reload + 1 });
    }
    // if (this.state.search !== preState.search || this.props.code !== preProps.code) {
    //   this.loadData(reload);
    // }
    if (preState.recorder !== this.state.recorder || preState.isRecording !== this.state.isRecording) {
      await this.setDataUpdate()
    }
    const { waitConvert, dataUpload } = this.state
    if ((preState.dataUpload !== this.state.dataUpload || preState.dataUpactiveConvertload !== this.state.activeConvert) && (this.state.activeConvert || this.state.dataUpload)) {

      if (waitConvert && dataUpload && dataUpload.data)
        this.startConvert()
    }
  }

  // componentDidUpdate(preProps, preState) {
  //   {
  //     const ARRAY = JSON.parse(localStorage.getItem([this.props.status]))
  //     if (!this.hasKanbanList && Array.isArray(ARRAY)) {
  //       this.hasKanbanList = true
  //       const kanbanList = this.props.kanban
  //         ? ARRAY.find(item => item.code === this.props.kanban).data
  //         : [];
  //       const plannerList = JSON.parse(localStorage.getItem('taskStatus')).find(item => item.code === 'PLANER').data || [];
  //       if (this.props.code) {
  //         try {
  //           const { dashboardPage } = this.props;
  //           let currentRole;
  //           if (dashboardPage.role.roles) {
  //             currentRole = dashboardPage.role.roles.find(item => item.codeModleFunction === this.props.code);
  //           }
  //           let functionAllow = [];
  //           if (currentRole) {
  //             functionAllow = currentRole.methods.filter(item => item.allow).map(item => item.name);
  //           }
  //           if (functionAllow.includes('VIEWCONFIG')) {
  //             this.state.hasPermissionViewConfig = true;
  //           } else {
  //             this.state.hasPermissionViewConfig = false;
  //           }
  //         } catch (error) {
  //           // ignore error
  //         }
  //         const code = this.props.code;
  //         const view = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === code);
  //         const columns = _.get(view, 'listDisplay.type.fields.type.columns', []);
  //         const fileColumns = view.listDisplay.type.fields.type.fileColumns;
  //         const others = view.listDisplay.type.fields.type.others.map(item => ({ ...item, tp: 1 }));
  //         const newCls = [...columns, ...others, { name: 'edit', checked: !this.props.disableEdit, title: 'Hành động' }];
  //         const columnOrder = newCls
  //           .sort((a, b) => a.order - b.order)
  //           .map(item => item.name)
  //           .concat(['edit']);
  //         this.setState({ columns: newCls, columnOrder, fileColumns, loading: true, kanbanList, plannerList: _.keyBy(plannerList, 'type') }, () => {
  //           this.loadData();
  //         });
  //       } else {
  //         this.setState(
  //           {
  //             columns: this.props.columns.concat({ name: 'edit', checked: !this.props.disableEdit, title: 'Hành động' }),
  //             loading: true,
  //             kanbanList,
  //             plannerList: _.keyBy(plannerList, 'type'),
  //           },
  //           () => {
  //             this.loadData();
  //           },
  //         );
  //       }
  //     }
  //   }

  //   const reload = this.props.reload && this.props.reload !== preProps.reload;
  //   if (typeof this.lastQuery !== 'undefined') {
  //     this.loadData(reload);
  //   }

  //   const { html, htmlTotal, openImport, search, filters } = this.state;
  //   if ((html && html.length > 0) & (htmlTotal !== 0)) {
  //     if (html.length === htmlTotal) {
  //       for (let index = 0; index < htmlTotal; index++) {
  //         const win = window.open();
  //         if (win) {
  //           win.document.write(html[index].content);
  //           win.document.close();
  //           win.print();
  //         } else {
  //           return;
  //         }
  //       }
  //       this.setState({ html: [] });
  //       this.setState({ htmlTotal: 0 });
  //     }
  //   }

  //   if (preState.openImport && !openImport) {
  //     this.setState({ reload: reload + 1 });
  //   }
  // }

  debounceLoadData = _.debounce(reload => {
    this.loadData(reload);
  }, 300);

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
  handleCloseExportTable = payload => {
    const { openExport } = this.state;
    if (payload && payload.lastPage) this.setState({ openExport: null });
    // if (payload && payload.error) {
    // if (payload.res && payload.res.message) {
    //   const { message } = payload.res;
    //   // console.log(message,'ppp')
    //   //  this.props.onChangeSnackbar({ status: true, message, variant: 'error' });
    // }
    // console.log(message,'ppp000')
    // else this.props.onChangeSnackbar({ status: true, message: 'Có lỗi xảy ra', variant: 'error' });
    //   return;
    // }

    switch (openExport) {
      case 'PDF':
        const { totalPage = 1, pageNumber = 1 } = payload || {};
        const content = tableToPDF(`${this.props.code}${this.props.kanban}`, this.props.code);
        this.setState({ html: [...this.state.html, { content, pageNumber }], htmlTotal: totalPage });
        break;
      default:
        tableToExcel(`${this.props.code}${this.props.kanban}`, 'W3C Example Table', this.props.code);
    }
  };

  getData = dt => {
    if (this.props.noData) {
      return this.setState({ count: 0 });
    }
    // eslint-disable-next-line no-unused-vars
    const { mapFunction, customFunction, apiUrl, disableDot, disableEdit, client, filter, isReport = false } = this.props;
    const { kanbanList, plannerList } = this.state;

    if (!apiUrl) {
      this.setState(dt);
      return;
    }
    const query = this.queryString();
    const queryClient = serialize({ filter });
    const URL = client ? `${apiUrl}?${queryClient}` : `${apiUrl}?${query}`;
    fetch(URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        let newList;
        if (data.data) newList = data.data;
        else newList = data;
        if (!disableDot) newList = newList.map(item => convertDot({ ob: item, newOb: { originItem: item }, convertArr: true }));
        let kanbanStatus = [];
        let max = 1;

        if (this.props.kanban) {
          kanbanStatus = convertOb(kanbanList, 'type');

          kanbanList.forEach(element => {
            if (element.code > max) max = element.code;
          });
        }

        localStorage.setItem('TaskTabData', JSON.stringify({ newList }));

        newList = newList.map(it => {
          let result;
          let kbStatus = 'gg';
          if (this.props.kanban) {
            kanbanStatus = convertOb(kanbanList, 'type');
            let max = 1;

            kanbanList.forEach(element => {
              if (element.code > max) max = element.code;
            });

            let value = 0;
            let color = 'red';
            let title = 'Không xác định';

            if (kanbanStatus[it.kanbanStatus * 1]) {
              value = ((100 * kanbanStatus[it.kanbanStatus].code) / max).toFixed();
              color = kanbanStatus[it.kanbanStatus].color;
              title = kanbanStatus[it.kanbanStatus].name;
            }

            kbStatus = kanbanStatus[it.kanbanStatus].name;
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
            edit: this.addEdit(it._id, it),
            state: result,
            kanbanStatus: kbStatus,
            planerStatus: plannerList[it.planerStatus] ? plannerList[it.planerStatus].name : '',
          };
        });

        if (!isReport) {
          if (mapFunction) newList = newList.map(mapFunction);
          if (customFunction) newList = customFunction(newList);
        }
        const count = client ? newList.length : data.count;
        if (client) {
          const { perPage, activePage, searchClient } = this.state;
          this.setState({ count, totalRows: newList, loading: false, ...dt }, () => this.client({ perPage, activePage, searchClient }));
        } else {
          const newState = {
            ...dt,
            rows: newList,
            loading: false,
            count,
          };
          this.setState(newState);
        }
      })
      .catch(() => {
        // console.log(err);
        this.setState({ loading: false });
      });
  };

  handleApproveTable = id => {
    this.setState({ openDialogApprove: true, id });
  };

  queryString = () => {
    const { sorting, perPage, activePage, search, filters, setPage, innerFilter } = this.state;
    // if (filters.includes("inCharge")) { this.setState({ ...filters, filters: ["inChargeStr"] }) }

    const filter = { ...this.props.filter, ...innerFilter };
    const filterChildren = this.props.filterChildren ? { ...this.props.filter } : null;
    const rex = `${search}`;
    if (search) {
      filter.$or = filters.map(i => ({ [i !== 'inCharge' ? i : 'inChargeStr']: { $regex: rex, $options: 'gi' } }));
    }
    const skip = perPage * activePage;
    const columnSorting = sorting[0].direction === 'asc' ? sorting[0].columnName : `-${sorting[0].columnName}`;
    let query;
    if (this.props.isReport) {
      query = { limit: perPage, skip, sort: columnSorting, ...filter };
    } else {
      if (this.props.notParentId === true) {
        query = { limit: perPage, skip, isAccept: this.props.isAccept, sort: columnSorting };
        if (filter) query.filter = filter;
      } else {
        query = { limit: perPage, skip, sort: columnSorting };
        if (filter) query.filter = filter;
      }
    }

    // if (this.props.setPage) this.props.setPage()
    const queryString = serialize(query);
    this.setState({ queryFilter: queryString });
    return queryString;
  };

  deleteItem = () => {
    const deleteUrl = this.props.deleteUrl ? this.props.deleteUrl : this.props.apiUrl;
    const deleteOption = this.props.deleteOption;
    const URL = deleteUrl;
    const { selected } = this.state;
    const list = this.state.rows.filter((item, index) => selected.includes(index)).map(i => i._id);
    fetch(URL, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [deleteOption]: list }),
    })
      .then(res => res.json())
      .then(respon => {
        // eslint-disable-next-line eqeqeq
        if (respon.success) this.getData({ open: true, variant: 'success', message: 'Xóa thành công' });
        else {
          this.setState({ loading: false, open: true, variant: 'error', message: respon.err || respon.message || 'Xóa không thành công' });
        }
      })

      .catch(e => this.setState({ loading: false, open: true, variant: 'error', message: e.message || 'Không có phản hồi, kiểm tra lại kết nối' }));
  };

  changeColumnOrder = newOrder => {
    const columns = this.state.columns;
    const newColumns = columns.map(item => ({ ...item, order: newOrder.indexOf(item.name) }));
    this.setState({ columnOrder: newOrder });
    this.saveConfig(newColumns);
  };

  saveConfig = (columns, fileColumns) => {
    const code = this.props.code;
    // debugger;
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const data = viewConfig.find(item => item.code === code);
    const index = viewConfig.findIndex(item => item.code === code);
    const newColumns = columns.filter(item => item.tp !== 1 && item.name !== 'edit');

    const newOthers = columns.filter(item => item.tp === 1);
    data.listDisplay.type.fields.type.columns = newColumns;
    data.listDisplay.type.fields.type.others = newOthers;
    data.listDisplay.type.fields.type.fileColumns = fileColumns;
    const URL = `${API_VIEW_CONFIG}/${data._id}`;

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
    this.setState({ deleteDialog: false, selected: [] });
    if (this.state.selected.length !== 0) {
      this.deleteItem();
    }

    this.props.reloadCount(this.state.reloadCount);
    this.getCountProjects();
  };

  getCountProjects = () => {
    const apiUrl = `${API_TASK_PROJECT}/count`;
    fetch(`${apiUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ countTask: data });
        localStorage.setItem('countTask', JSON.stringify({ data }));
        // this.props.reloadCount(this.state.reloadCount)
        // this.setState({ count: data });
      });
  };

  saveSetting = (columns, status, third, forth, fileColumns) => {
    if (status) {
      this.setState({ dialogStatus: false, columns });
      this.saveConfig(columns, fileColumns);
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
    const search = e.target.value;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ search });
    }, 500);
  };

  getUrl() {
    const res = window.location.pathname.split('/');
    const path = this.props.path ? this.props.path : res[res.length - 1];
    return path;
  }

  addEdit = (id, item) => {
    if (this.props.addIcon && this.props.notParentId === true && item && item.isAccept === false) {
      return (
        <>
          {/* <Fab
            style={{ background: '#fff' }}
            size="small"
            onClick={e => {
              e.stopPropagation();
              this.props.onAgree(this.props.tabType, [item._id]);
            }}
          >
            <Tooltip title="Chấp nhận" >
              <Done fontSize="small" color="primary" />
            </Tooltip>
          </Fab> */}
          <Button
            color="primary"
            variant="contained"
            style={{ marginRight: 10, fontWeight: 'bold' }}
            onClick={e => {
              e.stopPropagation();
              this.props.onAgree(this.props.tabType, [item._id]);
            }}
          >
            Đồng ý
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{ fontWeight: 'bold' }}
            onClick={e => {
              e.stopPropagation();
              this.props.offAccept(this.props.tabType, [item._id]);
            }}
          >
            Từ chối
          </Button>
          {/* <Fab
            style={{ background: '#fff' }}
            size="small"
            onClick={e => {
              e.stopPropagation();
              this.props.offAccept(this.props.tabType, [item._id]);
            }}
          >
            <Tooltip title="Từ chối">
              <Close fontSize="small" color="secondary" />
            </Tooltip>
          </Fab> */}
        </>
      );
    }

    if (this.props.code) {
      const roles = this.props.dashboardPage && this.props.dashboardPage.role && this.props.dashboardPage.role.roles
      const roleCode = roles && roles.find(item => item.codeModleFunction === this.props.code);
      const roleModule = roleCode.methods ? roleCode.methods : [];
      const derpartment = _.get(_.get(this, 'props.dashboardPage.roleTask.roles', []).find(elm => elm.code === 'DERPARTMENT'), 'data');
      const organizationUnit = this.props.dashboardPage.profile.organizationUnit
        ? this.props.dashboardPage.profile.organizationUnit.organizationUnitId
        : '';

      const derpartmentRole = organizationUnit ? derpartment.find(elm => elm.name === organizationUnit) : '';

      return (roleModule.find(elm => elm.name === 'PUT') || { allow: false }).allow === true ? (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {this.props.disableOneEdit ? null : (
            <>
              {typeof this.props.onEdit === 'function' ? (
                <Fab
                  // color="primary"
                  size="small"
                  className="CustomIconListTask"
                  onClick={e => {
                    e.stopPropagation();
                    this.props.onEdit(item);
                  }}
                >
                  <Tooltip title="Cập nhật">
                    <Edit className='CustomIconListTask' fontSize="small" />
                  </Tooltip>
                </Fab>
              ) : (
                <Link to={`${this.getUrl()}/${id}`} perPage={this.props.perPage}>
                  <Fab className="CustomIconListTask" size="small">
                    {/* {console.log(this.props,'fffffffffffffffff')} */}
                    <Edit className='CustomIconListTask' propsAll={this.props} />
                  </Fab>
                </Link>
              )}

              <Fab
                className="CustomIconListTask"
                onClick={e => {
                  e.stopPropagation();
                  this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item });
                }}
              >
                <Dehaze className='CustomIconListTask' />
              </Fab>
            </>
          )}
        </div>
      ) : null;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Link to={`${this.getUrl()}/${id}`}>
          <Fab
            className="CustomIconListTask"
            // color="primary"
            size="small"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <Edit />
          </Fab>
        </Link>
        <Fab
          className="CustomIconListTask"
          onClick={e => {
            e.stopPropagation();
            this.setState({ id, anchorElAction: e.currentTarget, itemCurrent: item });
          }}
        >
          <Dehaze />
        </Fab>
      </div>
    );
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
    const queryClient = serialize({ filter });
    const URL = `${apiUrl}?${queryClient}`;

    const data = await fetchData(URL);

    /* convert state to workbook */
    const ws = XLSX.utils.json_to_sheet(data.data ? data.data : data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, `${this.props.code}_ImportTemplate.xlsx`);
  };

  // getDepartment = () => {
  //   fetch(API_APPROVE_GROUPS, {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   })
  //     .then(result => result.json())
  //     .then(data => {
  //       this.setState({ departments: data });
  //     });
  // };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  render() {
    const {
      dialogStatus,
      activePage,
      perPage,
      deleteDialog,
      loading = false,
      exportAnchor,
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
      departments,
      fileColumns,
      loadingVoice,
      isRecording,
      recorder
    } = this.state;

    const { client, disableAdd, settingBar, tree, code, disableSelect, disableSearch, addFunction, exportExcel, intl, miniActive } = this.props;

    const roleDashboard = _.get(this, 'props.dashboardPage.roleTask.roles', []);

    const path = this.getUrl();
    const roles = this.props.dashboardPage && this.props.dashboardPage.role && this.props.dashboardPage.role.roles

    const roleCode = roles && roles.find(item => item.codeModleFunction === this.props.code);
    const roleModule = roleCode ? roleCode.methods : [];

    // const extra = roleDashboard.find(elm => elm.code === 'EXTRA') ? roleDashboard.find(elm => elm.code === 'EXTRA').data : [];

    // const hideTask = extra.find(elm => elm.name === 'hide').data;
    // const protectedTask = extra.find(elm => elm.name === 'protected').data;
    // const publicTask = extra.find(elm => elm.name === 'public').data;
    // const openTask = extra.find(elm => elm.name === 'open').data;
    const derpartment = (roleDashboard.find(elm => elm.code === 'DERPARTMENT') || {}).data || [];
    const organizationUnit = this.props.dashboardPage.profile.organizationUnit
      ? this.props.dashboardPage.profile.organizationUnit.organizationUnitId
      : '';

    const derpartmentRole = organizationUnit ? derpartment.find(elm => elm.name === organizationUnit) : '';
    const bussinesRole = (roleDashboard.find(elm => elm.code === 'BUSSINES') || {}).data || [];
    return (
      <GridContainer style={{ backgroundColor: '#ffffff', paddingTop: '0px' }}>
        <MenuFilter selectField={this.selectField} columns={columns} closeFilter={this.closeFilter} anchorEl={anchorEl} filters={filters} />
        <MenuAction
          handleClose={this.closeAnchorElAction}
          anchorEl={anchorElAction}
          code={this.props.code}
          id={this.state.id}
          itemCurrent={this.state.itemCurrent}
          addChildTask={this.props.addChildTask}
          extraMenu={this.props.extraMenu}
          getData={this.getData}
          departments={departments}
          bussines={bussinesRole}
          miniActive={miniActive}
          dashboardPage={this.props.dashboardPage}
        />
        <GridItem md={6} sm={6}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {disableSearch ? null : client ? (
              <TextField style={{ marginLeft: 15 }} placeholder="Tìm kiếm ..." value={searchClient} onChange={this.changeSearch} />
            ) : (
              <GridItem md={6} sm={6} style={{ marginRight: 50 }}>
                {/* <GridItem md={6} sm={6} > */}
                <TextFieldUI
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <>
                        <InputAdornment style={{ cursor: 'pointer' }} position="end">
                          <FilterList onClick={e => this.setState({ anchorEl: e.currentTarget })} />
                        </InputAdornment>
                        {
                          !loadingVoice ? <InputAdornment style={{ cursor: 'pointer' }} position="end">
                            <div>
                              <IconButton
                                variant="contained"
                                onClick={() => {
                                  if (!isRecording) {
                                    // bắt đầu ghi âm
                                    // setIsRecording(true);
                                    this.setState({ isRecording: true })
                                    if (!recorder) {
                                      setTimeout(() => {
                                        this.startRecording();
                                      }, 100);
                                    }
                                  } else {
                                    // dừng ghi âm
                                    this.stopRecording();
                                    this.setWaitConvert(true);
                                  }
                                }}
                                color={isRecording === true ? 'secondary' : 'primary'}
                              >
                                <KeyboardVoice />
                              </IconButton>
                            </div>
                          </InputAdornment> : <div><CircularProgress /></div>
                        }
                      </>
                    ),
                  }}
                  inputProps={{
                    style: {
                      padding: '15px 32px 15px 14px',
                      margin: '0 15px',
                    },
                  }}
                  value={this.state.search}
                  style={{ marginLeft: 50, width: '100%' }}
                  placeholder="Tìm kiếm ..."
                  ref={input => (this.search = input)}
                  onChange={this.handleSearch}
                // fullWidth
                />
                {/* </GridItem> */}

                <DialogUI
                  title="Bộ lọc nâng cao"
                  onClose={() => this.setState({ dialogAllFilter: false })}
                  onSave={() => {
                    const currentInnerFilter = this.state.innerFilter;
                    const currFilterAdvance = this.state.filterAdvance;
                    const newInnerFilter = { ...currentInnerFilter };
                    Object.keys(currFilterAdvance).forEach(key => {
                      if (
                        (!currFilterAdvance[key] && !currFilterAdvance[key] !== 0) ||
                        (Array.isArray(currFilterAdvance[key]) && !currFilterAdvance[key].length)
                      ) {
                        delete newInnerFilter[key];
                      } else {
                        const col = columns.find(c => c.name === key);
                        if (col.type) {
                          const [firstEle, model, thirdEle] = col.type.split('|');

                          const isMulti = thirdEle === 'Array' ? true : false;
                          if (firstEle === 'ObjectId' && model) {
                            if (model === 'approve-group') {
                              newInnerFilter['approved.id'] = { $in: currFilterAdvance[key]._id };
                              return;
                            }
                            if (isMulti) {
                              newInnerFilter[key] = { $in: currFilterAdvance[key].map(i => i._id) };
                            } else {
                              newInnerFilter[key] = currFilterAdvance[key]._id;
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
                        } else if (col.type === 'Date') {
                          newInnerFilter[key] = {
                            $gte: moment(currFilterAdvance[key]._d)
                              .startOf('day')
                              .toString(),
                            $lt: moment(currFilterAdvance[key]._d)
                              .endOf('day')
                              .toString(),
                          };
                        } else if (col.dateRange === 'start') {
                          newInnerFilter[key] = {
                            $gte: moment(currFilterAdvance[key]._d)
                              .startOf('day')
                              .toString(),
                          };
                        } else if (col.type === 'Number') {
                          newInnerFilter[key] = currFilterAdvance[key];
                        } else {
                          newInnerFilter[key] = currFilterAdvance[key].type ? currFilterAdvance[key].type : currFilterAdvance[key].code;
                        }
                      }
                    });
                    this.setState({ innerFilter: newInnerFilter, dialogAllFilter: false }, () => {
                      // this.getData();
                    });
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
                      {/* {console.log(columns,'ggggggggggggg')} */}
                      {columns.find(
                        c => (c.dateRange === 'start' && c.enabaleSearch === true) || (c.dateRange === 'end' && c.enabaleSearch === true),
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
                            {columns.find(c => c.dateRange === 'start' && c.enabaleSearch === true) ? (
                              <CustomInputField
                                type={columns.find(c => c.dateRange === 'start').type}
                                label={columns.find(c => c.dateRange === 'start').title}
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
                            {columns.find(c => c.dateRange === 'end' && c.enabaleSearch === true) ? (
                              <CustomInputField
                                type={columns.find(c => c.dateRange === 'end').type}
                                label={columns.find(c => c.dateRange === 'end').title}
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
                        columns.filter(c => c.enabaleSearch && c.type !== 'String').map(
                          c =>
                            !c.dateRange ? (
                              <GridItem item xs={6}>
                                <CustomInputField
                                  options={c.menuItem ? c.menuItem : ''}
                                  configType={c.configType ? c.configType : ''}
                                  configCode={c.configCode ? c.configCode : ''}
                                  type={c.type}
                                  label={c.title}
                                  value={this.state.filterAdvance[c.name]}
                                  onChange={(newVal, e) => {
                                    const { filterAdvance } = this.state;
                                    const newFilterAdvance = {
                                      ...filterAdvance,
                                      [c.name]:
                                        c.type.includes('Source') || c.type.includes('MenuItem') || c.type === 'Number'
                                          ? newVal.target.value
                                          : newVal,
                                    };
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
            {/* <Dialog
            title="thêm trường filter"
            // onSave={this.handleSaveData}
            onClose={false}
            open={editDialog}
            dialogAction={false}
          > */}
            {/* </Dialog> */}
            <div style={{ display: 'flex', marginRight: 50 }}>
              {document.documentElement.clientWidth <= 1285 ? (
                <></>
              ) : this.props.modalRequiredFilter ? (
                <div style={{ marginRight: 5 }}>{this.props.modalRequiredFilter}</div>
              ) : null}
              {(this.props.showDepartmentAndEmployeeFilter && document.documentElement.clientWidth <= 1285) ||
                columns.filter(c => c.enabaleSearch && c.type !== 'String').length ? (
                <div style={{ paddingTop: '12px', marginRight: 20 }}>
                  <Fab
                    onClick={() => this.setState({ dialogAllFilter: true })}
                    color="primary"
                    style={{ marginLeft: 15, width: 40, height: 40, minWidth: 40 }}
                  >
                    <Tooltip title="Xem thêm filter">
                      <FilterList />
                    </Tooltip>
                  </Fab>
                </div>
              ) : null}
            </div>
            {/* {this.props.modalFilter ? this.props.modalFilter : null} */}
          </div>
        </GridItem>

        <GridItem md={6} sm={6} style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
          {this.state.selected.length !== 0 &&
            this.props.code &&
            (roleModule.find(elm => elm.name === 'DELETE') || { allow: false }).allow === true ? (
            <Fab color="secondary">
              <Delete onClick={this.openDialog('deleteDialog')} />
            </Fab>
          ) : null}
          {!disableAdd ? (
            this.props.code ? (
              (roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow === true ? (
                addFunction ? (
                  <Fab onClick={addFunction}>
                    <Add />
                  </Fab>
                ) : (
                  <Fab>
                    <Link to={`${path}/add`}>
                      <Add style={{ color: 'white' }} />
                    </Link>
                  </Fab>
                )
              ) : null
            ) : (
              <Fab>
                <Link to={`${path}/add`}>
                  <Add style={{ color: 'white' }} />
                </Link>
              </Fab>
            )
          ) : null}
          {settingBar
            ? this.props.code
              ? (roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow === true
                ? settingBar.map(item => <Fab>{item}</Fab>)
                : null
              : settingBar.map(item => <Fab>{item}</Fab>)
            : null}
          {/* {exportExcel ? (
            this.props.code ? (
              (roleModule.find(elm => elm.name === 'EXPORT') || { allow: false }).allow === true ? (
                <Fab onClick={this.exportExcel}>
                  <Archive />
                </Fab>
              ) : null
            ) : (
              <Fab onClick={this.exportExcel}>
                <Archive />
              </Fab>
            )
          ) : null} */}
          {/* {exportExcel && (roleModule.find(elm => elm.name === 'EXPORT') || { allow: false }).allow ? (
            this.props.customExport ? (
              <Fab>{this.props.customExport}</Fab>
            ) : (
              <Fab onClick={this.props.exportExcel}>
                <Tooltip title="Xuất dữ liệu">
                  <Archive />
                </Tooltip>
              </Fab>
            )
          ) : null} */}
          {exportExcel && !this.props.disableExport ? (
            (roleModule.find(elm => elm.name === 'EXPORT') || { allow: false }).allow ? (
              <Fab onClick={e => this.setState({ exportAnchor: e.currentTarget })}>
                <Tooltip title="Xuất dữ liệu">
                  <Archive />
                </Tooltip>
              </Fab>
            ) : null
          ) : null}

          {importExport && !this.props.disableImport ? (
            // this.props.code && this.props.tabTask ? (
            (roleModule.find(elm => elm.name === 'IMPORT') || { allow: false }).allow ? (
              <Link to={importExport}>
                <Fab>
                  <ImportExport />
                </Fab>
              </Link>
            ) : null
          ) : //    : (
            //     <Link to={importExport}>
            //       <Fab>
            //         <ImportExport />
            //       </Fab>
            //     </Link>
            //   )
            // )
            null}
          {code && this.state.hasPermissionViewConfig && !this.props.disableViewConfig ? (
            <Fab onClick={this.openDialog('dialogStatus')}>
              <Visibility />
            </Fab>
          ) : null}
        </GridItem>
        {/* modal is here */}
        <GridList
          columnExtensions={columnExtensions}
          rightColumns={rightColumns}
          loading={loading}
          filters={this.state.queryFilter}
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
          changeSelect={this.changeSelect}
          onSaveConfig={this.saveConfig}
          onRowClick={this.props.onRowClick}
          notParentId={this.props.notParentId}
          noSlice={this.props.noSlice}
        />
        <ExportTable
          exportType={this.state.openExport}
          filters={this.state.queryFilter}
          apiUrl={`${API_TASK_PROJECT}/export`}
          onClose={this.handleCloseExportTable}
          open={Boolean(this.state.openExport)}
          listKanbanStatus={this.state.kanbanList}
          moduleCode="Task"
          kanban={this.props.kanban}
          viewConfigUpdateTime={this.state.viewConfigUpdateTime}
          // filter={this.props.filter ? this.props.filter : null}
          // customData={() => {
          //    const { filter } = this.props.filter ? this.props.filter : null;
          //    let { type } = filter;
          //    return { type };
          //  }}
          customChildRows={this.props.customChildRows}
        />

        {/* <GridItem style={{ justifyContent: 'flex-end', display: 'flex' }} md={12}>
          <table>
            <tbody>
              <tr>
                {count > 0 ? (
                  <TablePagination
                    rowsPerPageOptions={[10, 50, 100]}
                    colSpan={3}
                    count={count}
                    rowsPerPage={perPage}
                    page={activePage}
                    onChangePage={this.handleChangePage}
                    labelRowsPerPage={'Số dòng hiển thị:'}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  // ActionsComponent={TablePaginationActionsWrapped}
                  />
                ) : (
                  <div />
                )}
              </tr>
            </tbody>
          </table>
        </GridItem> */}
        <Dialog
          saveSetting={this.saveSetting}
          saveUpdateAllSystem={this.saveUpdateAllSystem}
          code={code}
          columns={columns}
          fileColumns={fileColumns}
          open={dialogStatus}
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
          <MenuItem onClick={() => this.setState({ openExport: 'Excel' })}>Xuất Excel</MenuItem>
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
        <Snackbar open={open} variant={variant} message={message} onClose={this.closeDialog('open')} />
      </GridContainer>
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
    this.setState({ selected });
  };

  closeDialog = dialog => () => {
    this.setState({ [dialog]: false });
  };

  openDialog = dialog => () => {
    this.setState({ [dialog]: true });
  };

  changeSearch = e => {
    const { activePage, perPage } = this.state;
    this.client({ activePage, perPage, searchClient: e.target.value });
  };
}

const GridList = React.memo(
  ({
    changeSorting,
    rows,
    columns,
    tree,
    disableSelect,
    changeColumnOrder,
    rightColumns,
    code,
    selected,
    columnExtensions,
    loading,
    columnOrder,
    changeSelect,
    onSaveConfig,
    onRowClick,
    notParentId,
    customChildRows,
    noSlice
  }) => {
    const [newCls, setNewCls] = React.useState(columns);
    const [defaultColumnWidths, setDefaultColumnWidths] = React.useState([]);
    const dateFormat = localStorage.getItem('dateFomat');
    const ref = React.useRef(null);
    useEffect(
      () => {
        const newColumns = columns.filter(i => i.checked);
        setNewCls(newColumns);
        setDefaultColumnWidths(
          newColumns.map(item => ({
            columnName: item.name,
            width: item.width || 220,
          })),
        );
      },
      [columns],
    );
    // useEffect(
    //   () => {
    //     const tableContainerElm = ref.current.firstChild.firstChild;
    //     if (tableContainerElm) {
    //       if (newRows.length === 0) {
    //         tableContainerElm.style.overflow = 'hidden';
    //       } else {
    //         tableContainerElm.style.overflow = 'auto';
    //       }
    //     }
    //   },
    //   [newRows],
    // );

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

    const DateFormatter = ({ value }) => {
      return (moment(value).isValid() ? moment(value).format(dateFormat) : '')
    };

    const DateData = () => {
      const listDateData = [];
      newCls.map(item => {
        if (item.type === 'Date') {
          listDateData.push(item);
        }
      });
      return listDateData;
    };
    const DateTypeProvider = props => <DataTypeProvider for={DateData().map(({ name }) => name)} formatterComponent={DateFormatter} {...props} />;

    const DatetimeFormatter = ({ value }) => (moment(value).isValid() ? moment(value).format(`hh:mm ${dateFormat}`) : '');

    const DatetimeData = () => {
      const listDateData = [];
      newCls.map(item => {
        if (item.type === 'Datetime') {
          listDateData.push(item);
        }
      });
      return listDateData;
    };
    const DatetimeTypeProvider = props => (
      <DataTypeProvider for={DatetimeData().map(({ name }) => name)} formatterComponent={DatetimeFormatter} {...props} />
    );
    const [newRows, setNewRows] = React.useState([]);

    useEffect(
      () => {
        if (Array.isArray(rows) && rows.length > 0) {
          setNewRows(
            rows.map(item => {
              // if (notParentId == true) {
              //   if (items.parentId) {
              //     const row = rows.find(f => items.parentId === f._id);
              //     if (!row) {
              //       items.parentIds = items.parentId
              //       items.parentId = null;
              //     }
              //   }
              // }
              const items = {
                ...item,
                startDate: !!item.startDate ? item.startDate.slice(0, 10) : null,
                endDate: !noSlice ? !!item.endDate ? item.endDate.slice(0, 10) : null : item.endDate,
                finishDate: !!item.finishDate ? item.finishDate.slice(0, 10) : null,
                startDatePlan: !!item.startDatePlan ? item.startDatePlan.slice(0, 10) : null,
                endDatePlan: !!item.endDatePlan ? item.endDatePlan.slice(0, 10) : null,
              };
              if (notParentId == true) {
                if (items.parentId) {
                  const row = rows.find(f => items.parentId === f._id);
                  if (!row) {
                    items.parentIds = items.parentId;
                    items.parentId = null;
                  }
                }
              }

              return items;
            }),
          );
        } else if (Array.isArray(rows) && rows.length === 0) {
          setNewRows(rows);
        }
      },
      [rows],
    );

    const TableRow = ({ row, ...restProps }) => (
      <Table.Row {...restProps} onClick={() => onRowClick && onRowClick(row)} style={{ cursor: onRowClick ? 'pointer' : 'default' }} />
    );

    const containerRef = React.useRef(null);
    const pagingPanelMessages = {
      showAll: 'Alle',
      rowsPerPage: 'Số dòng hiển thị',
      info: '{from} - {to} của {count} ',
    };
    return (
      <div ref={containerRef} style={{ width: '100%' }}>
        <Paper className="CustomlistTable" md={12} style={{ overflow: 'auto', boxShadow: 'none' }}>
          {true ? (
            <Grid rows={newRows} columns={newCls}>
              {tree ? <TreeDataState /> : null}
              {tree ? (
                <CustomTreeData getChildRows={(row, rootRows) => (!customChildRows ? getChildRows(row, rootRows) : customChildRows(row, rootRows))} />
              ) : null}
              <DragDropProvider />
              <PagingState defaultCurrentPage={0} defaultPageSize={50} />
              <IntegratedPaging />
              <SortingState defaultSorting={[{ columnName: 'order', direction: 'asc' }]} onSortingChange={changeSorting} />
              {disableSelect ? null : <SelectionState onSelectionChange={changeSelect} selection={selected} />}
              {/* <IntegratedFiltering />
              <IntegratedSorting key="integrated-sorting" /> */}
              {disableSelect ? null : <IntegratedSelection />}
              <VirtualTable rowComponent={TableRow} columnExtensions={columnExtensions} messages={{ noData: 'Không có dữ liệu' }} />
              <TableColumnResizing
                columnWidths={defaultColumnWidths}
                onColumnWidthsChange={value => {
                  setDefaultColumnWidths(value);
                  handleResizeWidth(value);
                }}
              />
              {tree ? null : disableSelect ? null : <TableSelection showSelectAll />}
              {code ? <TableColumnReordering order={columnOrder} onOrderChange={changeColumnOrder} /> : null}
              <TableHeaderRow cellComponent={DragColumn} showSortingControls />
              <DateTypeProvider />
              <DatetimeTypeProvider />
              {tree ? <TableTreeColumn for="name" showSelectionControls={!(tree && disableSelect)} showSelectAll={!(tree && disableSelect)} /> : null}

              <TableFixedColumns rightColumns={rightColumns} />
              <PagingPanel messages={pagingPanelMessages} pageSizes={[50, 100, 200]} />
            </Grid>
          ) : null}

          {loading && <Loading />}
        </Paper>
      </div>
    );
  },
);

const MenuFilter = React.memo(({ anchorEl, closeFilter, columns, selectField, filters }) => (
  <Menu keepMounted open={Boolean(anchorEl)} onClose={closeFilter} anchorEl={anchorEl}>
    <MenuItem>
      <Typography style={{ fontSize: 15, fontWeight: 'bold', textTransform: 'uppercase' }}>Chọn trường tìm kiếm</Typography>
    </MenuItem>
    {columns
      .filter(
        i =>
          i.enabaleSearch === true &&
          (i.name === 'code' || i.name === 'name' || i.name === 'description' || i.name === 'source' || i.name === 'inCharge'),
      )
      .map(i => (
        <MenuItem key={i.name} value={i.name}>
          <Checkbox color="primary" checked={filters.includes(i.name)} onClick={selectField(i.name)} />{' '}
          <Typography style={{ fontSize: 14 }}>{i.title}</Typography>
        </MenuItem>
      ))}
  </Menu>
));

const MenuAction = React.memo(
  ({ code, id, itemCurrent, handleClose, anchorEl, addChildTask, extraMenu, getData, bussines, miniActive, dashboardPage }) => {
    const [openDialog, setopenDialog] = useState(false);
    const [dialogAssign, setDialogAssign] = useState(false);
    const [openMakeCreateTaskRequestDialog, setOpenMakeCreateTaskRequestDialog] = useState(false);
    const [mail, setMail] = useState({ to: [], subject: '', text: '' });
    const [dialogEmail, setDialogEmail] = useState(false);
    const [SMS, setSMS] = useState({ subject: '', text: '' });
    const [dialogSMS, setDialogSMS] = useState(false);
    const [openDialogTask, setopenDialogTask] = useState(false);
    const [show, setShow] = useState(false);
    const [state, setState] = useState({
      templatess: [],
      template: '',
      sales: [],
      files: [],
      file: [],
      loading: true,
      templatesItem: '',
      approvedObj: {
        name: '',
        subCode: code,
        form: '',
        group: null,
      },
      dynamicForms: [],
      field: '',
      fields: [],
      data: '',
      project: null,
    });

    const [snackbar, setSnackbar] = useState({
      open: false,
      variant: 'success',
      message: '',
    });

    function assignWork() {
      setDialogAssign(true);
    }

    function makeCreateTaskRequest() {
      setOpenMakeCreateTaskRequestDialog(true);
    }

    const [openApproved, setopenApproved] = useState(false);
    // const findGroup = [];
    // if (itemCurrent.originItem.approved)
    //   // eslint-disable-next-line consistent-return
    //   itemCurrent.originItem.approved.forEach(elm => {
    //     const a = departments.find(item => item._id === (elm.id ? elm.id : elm._id));
    //     if (a) return findGroup.push(a);
    //   });

    // const taskManagerRole = bussines.find(elm => elm.name === 'taskManager').data;
    // const taskInCharge = bussines.find(elm => elm.name === 'inCharge').data;
    // const taskSupport = bussines.find(elm => elm.name === 'support').data;
    // const taskViewable = bussines.find(elm => elm.name === 'viewable').data;
    // const taskJoin = bussines.find(elm => elm.name === 'join').data;
    // const taskApproved = bussines.find(elm => elm.name === 'approved').data;
    const source = itemCurrent.source ? itemCurrent.source : null;
    const module = source ? source.slice(0, source.indexOf('/')) : null;

    // Xuất biểu mẫu
    function handleDialogTemplate(open = true) {
      if (open === true) setopenDialog({ openDialog: open });
      const { allTemplates } = dashboardPage;
      if (code && allTemplates) {
        const templatesItem = allTemplates.filter(elm => elm.moduleCode === code && elm.clientId === clientId);
        setState(state => ({ ...state, templatess: templatesItem }));
      }
    }
    function closeDialogTemplate() {
      setopenDialog(false);
    }

    function handleTemplate() {
      printTemplte(state.template, id, code);
    }
    // Tạo công việc

    function handleTask() {
      setopenDialogTask(true);
    }

    // Phê duyệt
    function handleApprove() {
      setopenApproved(true);
      const { allTemplates } = dashboardPage;
      const listApi = [fetchData(API_FIELD)];
      if (code === 'Task' && itemCurrent.projectId) {
        listApi.push(fetchData(`${API_TASK_PROJECT}/${itemCurrent.projectId}`));
      }
      Promise.all(listApi).then(result => {
        if (code) {
          const templatesItem = allTemplates ? allTemplates.filter(elm => elm.moduleCode === code) : [];
          const fields = result[0].filter(i => i.code === code);
          const project = result[1];
          const { approvedObj } = state;
          if (code === 'Task' && itemCurrent.projectId) approvedObj.name = `Công việc ${itemCurrent.name} trong dự án ${result[1].name}`;
          setState(state => ({ ...state, templatess: templatesItem, fields, approvedObj, project }));
        }
      });
    }

    function handleAddApprovedGroup(value) {
      setState({ ...state, approvedObj: { ...state.approvedObj, group: value } });
    }

    function handleChangeApproved(e, name) {
      const { approvedObj } = state;
      approvedObj[name] = e.target.value;
      setState(state => ({ ...state, approvedObj }));
    }

    function handleFileChange(e) {
      const files = e.target.files[0];
      setState({ ...state, file: files });
      setShow(true);
    }

    function handleFileDelete(f) {
      const files = state.files.filter(i => i !== f);
      setState({ ...state, file: files });
      setShow(false);
    }

    async function addApprove() {
      const { approvedObj, templatess, file, project } = state;
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
      const groupInfo = [];
      const planApprovalUsers = [];
      approvedObj.group.group.forEach(item => {
        planApprovalUsers.push(item.person);
        groupInfo.push({
          order: item.order,
          person: item.person,
          approve: 0,
          reason: '',
        });
      });
      const dataInfo = {
        ...itemCurrent.originItem,
      };
      let checkPlanApproval = false;
      if (state.field) {
        const foundFieldChanged = state.fields.find(f => f._id === state.field);
        if (foundFieldChanged && foundFieldChanged.fields.find(k => k.name === 'planApproval')) {
          checkPlanApproval = true;
        }
      }
      if (checkPlanApproval) {
        dataInfo.planApprovalUsers = planApprovalUsers;
      }

      const body = {
        name: approvedObj.name,
        subCode: approvedObj.subCode,
        collectionCode: code,
        content,
        dataInfo,
        dynamicForm,
        convertMapping: '5d832729c252b2577006c5ab',
        approveGroup: approvedObj.group._id,
        groupInfo,
        clientId,
        field: state.field,
      };

      onCreateApprove(body);

      if (file && project) {
        const form = new FormData();
        form.append('fileUpload', file);
        const head = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token_03')}`,
          },
          body: form,
        };
        const { name, _id } = project;
        const url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=Task&mid=${_id}&mname=${name}&fname=root&ftype=0`;
        await fetch(url, head);
      }
      setState(state => ({ ...state, openApproved: false, approvedObj: { name: '', subCode: '', form: '', group: null }, field: '', file: null }));
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
          fetch(`${API_TASK_PROJECT}/${body.dataInfo._id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-type': 'application/json',
            },
            body: JSON.stringify(parseTask(body.dataInfo)),
          })
            .then(res => { })
            .catch(err => console.log(err));
          getData();
        })
        .catch(() => {
          setSnackbar({ open: false, message: 'Thêm phê duyệt thất bại', variant: 'error' });
        });
    }

    function closeDialogTask() {
      setopenDialogTask(false);
    }



    function closeAssignTask() {
      setDialogAssign(false);
    }
    // console.log('fdf');

    function callbackAssign(snack, close = true) {
      setSnackbar(snack);
      if (close) setDialogAssign(false);
    }

    async function handleEmailDialog() {
      if (code === 'Task') {
        const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent._id}`);
        setMail({ ...mail, to: [customer] });
      }

      handleDialogTemplate(false);
      setDialogEmail(!dialogEmail);
    }

    async function handleSMSDialog() {
      if (code === 'Customer') {
        const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent._id}`);
        setSMS({ ...SMS, to: customer.phoneNumber });
      }

      if (code === 'BusinessOpportunities' && itemCurrent.originItem && itemCurrent.originItem.customerId) {
        const customer = await fetchData(`${API_CUSTOMERS}/${itemCurrent.originItem.customerId._id}`);
        setSMS({ ...SMS, to: customer.phoneNumber });
      }

      handleDialogTemplate(false);
      setDialogSMS(!dialogSMS);
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
        // const formData = new FormData();

        // for (let index = 0; index < state.files.length; index++) {
        //   formData.append('files', state.files[index]);
        // }

        // // formData.append('file', state.files);
        // const x = await fetch(`${API_MAIL}/upload`, {
        //   method: 'POST',
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   },
        //   body: formData,
        // });

        // const filesSend = await x.json();
        // data.html = await getDataBeforeSend({ templateId: state.template, dataId: id, moduleCode: code });
        // data.filesSend = filesSend;

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
        // data.to = _.uniq(SMS.to.map(i => i.phoneNumber).filter(i => Boolean(i))).join();
        if (!data.to) {
          alert('Danh sách Khách hàng chọn không có SMS');
          return;
        }
        // const formData = new FormData();

        // for (let index = 0; index < state.files.length; index++) {
        //   formData.append('files', state.files[index]);
        // }

        // formData.append('file', state.files);
        // const x = await fetch(`${API_SMS}/upload`, {
        //   method: 'POST',
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   },
        //   body: formData,
        // });

        // const filesSend = await x.json();
        // data.html = await getDataBeforeSend({ templateId: state.template, dataId: id, moduleCode: code });
        // data.filesSend = filesSend;
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

    return (
      <div>
        <Menu open={Boolean(anchorEl)} onClose={handleClose} anchorEl={anchorEl}>
          <MenuItem onClick={() => handleDialogTemplate(true)}>Xuất biểu mẫu</MenuItem>
        </Menu>
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

        <DialogUI dialogAction={false} onClose={closeAssignTask} open={dialogAssign}>
          <AssignTask id={id} callbackAssign={callbackAssign} code={code} itemCurrent={itemCurrent} />
        </DialogUI>
        <DialogUI dialogAction={false} onClose={() => setOpenMakeCreateTaskRequestDialog(false)} open={openMakeCreateTaskRequestDialog}>
          <MakeCreateTaskRequest id={id} itemCurrent={itemCurrent} callbackAssign={callbackAssign} code={code} />
        </DialogUI>
        {/* formExport */}
        <DialogUI onSave={handleTemplate} open={openDialog} onClose={closeDialogTemplate} saveText="In biểu mẫu">
          <TextField value={state.template} fullWidth select onChange={e => setState({ ...state, template: e.target.value })} label="Biểu mẫu">
            {state.templatess.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item.title}
              </MenuItem>
            ))}
          </TextField>
          <CloudDownload />
        </DialogUI>
        <SwipeableDrawer
          anchor="right"
          onClose={closeDialogTask}
          open={openDialogTask}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          <AddProjects
            id="add"
            isCreateTask
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
            }}
            callback={() => {
              closeDialogTask(false);
              getData();
            }}
          />
        </SwipeableDrawer>

        <DialogUI
          title="Tạo phê duyệt"
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
            filter={{ clientId }}
            onChange={handleAddApprovedGroup}
            label=" Nhóm phê duyệt"
          /> */}
          <TextField label="Tên quy trình" name="name" onChange={e => handleChangeApproved(e, 'subCode')} value={state.approvedObj.subCode} />
          <TextField label="Field name" select onChange={e => setState({ ...state, field: e.target.value })} value={state.field}>
            {state.fields.map(i => (
              <MenuItem key={i._id} value={i._id}>
                {i.name}
              </MenuItem>
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
            {state.templatess.map(form => (
              <MenuItem key={form._id} value={form._id}>
                {form.title}
              </MenuItem>
            ))}
          </TextField>
          <div>
            <label htmlFor="fileUpload">
              <CloudUpload color="primary" />
              <span style={{ marginLeft: 10 }}>{state.file && state.file.name}</span>
            </label>
            <span>{show ? <Delete onClick={handleFileDelete} /> : ''}</span>
          </div>
          <input onChange={handleFileChange} id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" />
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
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);

export default compose(
  withConnect,
)(ListPage);

ListPage.defaultProps = {
  deleteOption: 'ids',
  filter: { status: 1 },
  treeName: 'name',
  columnExtensions: [{ columnName: 'edit', width: 150 }],
  rightColumns: ['edit', 'statusAccept'],
  reload: false,
  perPage: 50,
  status: 'crmStatus',
  disableEdit: false,
  extraMenu: null,
};
