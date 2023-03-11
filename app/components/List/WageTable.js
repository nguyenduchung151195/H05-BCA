/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/**
 *
 * ListPage
 *
 */

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
} from '@material-ui/core';
import XLSX from 'xlsx';
import { Visibility, Delete, ImportExport, Add, Edit, FilterList, Dehaze, Archive, Share, CloudUpload, CloudDownload } from '@material-ui/icons';
import {
  SortingState,
  IntegratedSorting,
  IntegratedFiltering,
  IntegratedSelection,
  SelectionState,
  TreeDataState,
  CustomTreeData,
} from '@devexpress/dx-react-grid';
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
  TableBandHeader,
} from '@devexpress/dx-react-grid-material-ui';
import {
  API_VIEW_CONFIG,
  API_TEMPLATE,
  API_APPROVE_GROUPS,
  API_APPROVE,
  API_COMMON_APPROVE_FINISH,
  API_USERS,
  API_CUSTOMERS,
  API_MAIL,
  API_FIELD,
  API_VIEW_CONFIG_FORMULA,
  API_SMS1,
} from 'config/urlConfig';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/ItemGrid';
import Dialog from 'components/Modal/DialogAsync';
import AddProjects from 'containers/AddProjects';
import { TextField, Dialog as DialogUI, SwipeableDrawer, AsyncAutocomplete, Loading, AssignTask } from 'components/LifetekUi';
import Snackbar from 'components/Snackbar';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import _ from 'lodash';
import makeSelectDashboardPage, { makeSelectMiniActive } from '../../containers/Dashboard/selectors';
// import dot from 'dot-object';
import { convertDot, serialize, convertOb, printTemplte, fetchData, getDataBeforeSend, convertDotOther } from '../../helper';
import { SAVE_VIEWCONFIG_ON_RESIZE_DELAY } from '../../utils/constants';
// import { STATE } from '../../config/const';
import { clientId } from '../../variable';
import EmailDialog from './EmailDialog';
import SMSDialog from './SMSDialog';

const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right' },
};
function DragColumn({ draggingEnabled, sortingEnabled, ...rest }) {
  if (rest.column.name === 'edit') return <TableHeaderRow.Cell {...rest} sortingEnabled={false} draggingEnabled={false} />;
  return <TableHeaderRow.Cell sortingEnabled draggingEnabled={draggingEnabled} {...rest} />;
}
class ListPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timeout = 0;

    this.state = {
      columns: [],
      columnOrder: [],
      rows: [],
      selected: [],
      dialogStatus: false,
      shareDialog: false,
      activePage: 0,
      perPage: this.props.perPage,
      search: '',
      searchClient: '',
      deleteDialog: false,
      loading: true,
      open: false,
      totalRows: [],
      anchorEl: null,
      variant: 'success',
      message: '',
      sorting: [{ columnName: 'createdAt', direction: 'desc' }],
      filters: ['name'],
      count: 0,
      anchorElAction: false,
      importExport: this.props.importExport
        ? `/import?type=${this.props.importExport}`
        : this.props.code && !this.props.parentCode
          ? `/import?type=${this.props.code}`
          : null,
      id: null,
      itemCurrent: { originItem: '' },
      openDialogApprove: false,
      kanbanList: [],
      columnExtensions: this.props.columnExtensions,
      rightColumns: this.props.rightColumns,
      // peopleCanView: [],
      employessCustomer: [],
      hasPermissionViewConfig: false,
      viewConfigId: null,
    };
  }

  changeMutil(value) {
    // console.log('aaaa', value);

    this.setState({ employessCustomer: value });
  }

  componentWillReceiveProps(props) {
    if (props.columns) {
      const columnOrder = props.columns.sort((a, b) => a.order - b.order).map(item => item.name);
      // console.log('columnOrder', columnOrder);
      this.setState({ columnOrder, columns: props.columns });
    }
    if (props.rows) {
      const { rows } = props;
      const { client } = this.props;
      const count = client ? rows.length : 0;
      if (client) {
        const { perPage, activePage, searchClient } = this.state;
        this.setState({ count, totalRows: rows, loading: false }, () => this.client({ perPage, activePage, searchClient }));
      }
    }
  }

  handleApproveTable = id => {
    this.setState({ openDialogApprove: true, id });
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
      .then(respon => {
        // eslint-disable-next-line eqeqeq
        if (respon.status == 200) this.getData({ open: true, variant: 'success', message: 'Xóa thành công' });
        else this.setState({ loading: false, open: true, variant: 'error', message: 'Xóa không thành công' });
      })

      .catch(() => this.setState({ loading: false, open: true, variant: 'error', message: 'Không có phản hồi, kiểm tra lại kết nối' }));
  };

  changeColumnOrder = (newOrder, a, b) => {
    const columns = this.state.columns;
    const newColumns = columns.map(item => ({ ...item, order: newOrder.indexOf(item.name) }));
    this.setState({ columnOrder: newOrder });
    this.saveConfig(newColumns);
  };

  saveConfig = columns => {
    if (!this.props.formulaId) return;
    const URL = `${API_VIEW_CONFIG_FORMULA}`;
    const _id = this.state.viewConfigId;
    fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id,
        columns,
        formulaId: this.props.formulaId,
      }),
    })
      .then(() => {
        // viewConfig[index].listDisplay.type.fields.type.columns = newColumns;
        // localStorage.setItem('viewConfig', JSON.stringify(viewConfig));
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
    }
  };

  saveSetting = (columns, status) => {
    if (status) {
      this.setState({ dialogStatus: false, columns });
      this.saveConfig(columns);
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
      customActions,
      extraColumns,
      miniActive,
    } = this.props;
    // console.log('this.props.rows', this.props.rows);
    // console.log('columns', this.props.columns);
    // const mappingRows = this.props.rows.map(item => )
    return (
      <GridContainer>
        <GridList
          // columnExtensions={columnExtensions}
          // rightColumns={rightColumns}
          // loading={loading}
          changeSorting={this.changeSorting}
          changeColumnOrder={this.changeColumnOrder}
          selected={selected}
          rows={rows || []}
          tree={tree}
          code={code}
          columns={columns}
          columnOrder={columnOrder}
          sorting={sorting}
          disableSelect={disableSelect}
          changeSelect={this.changeSelect}
          onSaveConfig={this.saveConfig}
          // extraColumns={extraColumns}
          columnBands={this.props.columnBands || []}
        />

        <GridItem style={{ justifyContent: 'flex-end', display: 'flex' }} md={12}>
          <table>
            <tbody>
              <tr>
                <TablePagination
                  rowsPerPageOptions={[10, 50, 100]}
                  colSpan={3}
                  count={count}
                  rowsPerPage={perPage}
                  page={activePage}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  // ActionsComponent={TablePaginationActionsWrapped}
                />
              </tr>
            </tbody>
          </table>
        </GridItem>
        <Dialog saveSetting={this.saveSetting} code={code} columns={columns} open={dialogStatus} onClose={this.closeDialogStatus} />
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
    if (this.props.onSelectCustomers) {
      const newSelectedRows = this.state.rows.filter((row, index) => selected && selected.includes(index));
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
    extraColumns,
    columnBands,
  }) => {
    const [newCls, setNewCls] = React.useState(columns);
    const [defaultColumnWidths, setDefaultColumnWidths] = React.useState([]);

    useEffect(
      () => {
        let newColumns = columns.filter(i => i.checked);
        if (extraColumns) newColumns = newColumns.concat(extraColumns);
        setNewCls(newColumns);
        setDefaultColumnWidths(
          newColumns.map(item => ({
            columnName: item.name,
            width: item.width || 120,
          })),
        );
      },
      [columns],
    );

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

    return (
      <GridItem md={12}>
        <Grid rows={rows} columns={newCls}>
          <DragDropProvider />
          <SortingState defaultSorting={[{ columnName: 'order', direction: 'asc' }]} onSortingChange={changeSorting} />
          {disableSelect ? null : <SelectionState onSelectionChange={changeSelect} selection={selected} />}
          <IntegratedFiltering />
          <IntegratedSorting key="integrated-sorting" />
          {disableSelect ? null : <IntegratedSelection />}
          <Table columnExtensions={columnExtensions} />
          <TableColumnResizing
            columnWidths={defaultColumnWidths}
            onColumnWidthsChange={value => {
              setDefaultColumnWidths(value);
              handleResizeWidth(value);
            }}
          />
          {/* <DragDropProvider /> */}
          <TableColumnReordering order={columnOrder} onOrderChange={changeColumnOrder} />
          <TableHeaderRow cellComponent={DragColumn} showSortingControls />
          <TableBandHeader columnBands={columnBands} />
          {tree ? <TableTreeColumn for="name" showSelectionControls showSelectAll /> : null}
          <TableFixedColumns rightColumns={rightColumns} />
        </Grid>
        {loading && <Loading />}
      </GridItem>
    );
  },
);

const MenuFilter = React.memo(({ anchorEl, closeFilter, columns, selectField, filters }) => (
  <Menu keepMounted open={Boolean(anchorEl)} onClose={closeFilter} anchorEl={anchorEl}>
    <MenuItem>
      <Typography style={{ fontSize: 15, fontWeight: 'bold', textTransform: 'uppercase' }}>Chọn trường tìm kiếm</Typography>
    </MenuItem>
    {columns.filter(i => i.type === 'String').map(i => (
      <MenuItem key={i.name} value={i.name}>
        <Checkbox color="primary" checked={filters.includes(i.name)} onClick={selectField(i.name)} />{' '}
        <Typography style={{ fontSize: 14 }}>{i.title}</Typography>
      </MenuItem>
    ))}
  </Menu>
));

const MenuAction = React.memo(({ code, id, itemCurrent, handleClose, anchorEl, addChildTask, extraMenu, getData, miniActive }) => {
  const [openDialog, setopenDialog] = useState(false);
  const [dialogAssign, setDialogAssign] = useState(false);
  const [openDialogTask, setopenDialogTask] = useState(false);
  const [mail, setMail] = useState({ to: [], subject: '', text: '' });
  const [dialogEmail, setDialogEmail] = useState(false);
  const [SMS, setSMS] = useState({ subject: '', text: '' });
  const [dialogSMS, setDialogSMS] = useState(false);
  const [state, setState] = useState({
    templatess: [],
    template: '',
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
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    variant: 'success',
    message: '',
  });

  function assignWork() {
    setDialogAssign(true);
  }

  const [openApproved, setopenApproved] = useState(false);
  // Xuất biểu mẫu
  function handleDialogTemplate(open = true) {
    if (open === true) setopenDialog({ openDialog: open });
    fetchData(`${API_TEMPLATE}?clientId=${clientId}`)
      .then(templates => {
        if (code) {
          const templatesItem = templates ? templates.filter(elm => elm.moduleCode === code && elm.clientId === clientId) : null;
          setState(state => ({ ...state, templatess: templatesItem }));
        }
      })
      .catch(() => {
        setState({ loading: false });
      });
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
    Promise.all([fetchData(`${API_TEMPLATE}?clientId=${clientId}`), fetchData(API_FIELD)]).then(result => {
      if (code) {
        const templatesItem = result[0] ? result[0].filter(elm => elm.moduleCode === code) : [];
        const fields = result[1].filter(i => i.code === code);
        setState(state => ({ ...state, templatess: templatesItem, fields }));
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
      })
      .catch(() => {
        setSnackbar({ open: false, message: 'Thêm phê duyệt thất bại', variant: 'error' });
      });
  }

  function closeDialogTask() {
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

  function closeAssignTask() {
    setDialogAssign(false);
  }
  // console.log('fdf');

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
      console.log(error);
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
      console.log(error);
      alert('Gửi không thành công');
    }
  }

  async function exportPdf() {
    const html = await getDataBeforeSend({ templateId: state.template, dataId: id, moduleCode: code });

    document.getElementById('divToPrint').innerHTML = html;
    const input = document.getElementById('divToPrint');

    input.html = html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'JPEG', 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save('download.pdf');
    });
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
        <MenuItem onClick={assignWork}>Giao việc</MenuItem>
        <MenuItem onClick={handleTask}>Tạo công việc</MenuItem>
        <MenuItem onClick={handleEmailDialog}>Gửi mail</MenuItem>
        <MenuItem>Gọi điện</MenuItem>
        <MenuItem onClick={handleSMSDialog}>SMS</MenuItem>
        <MenuItem onClick={handleApprove}>Yêu cầu phê duyệt</MenuItem>
        <MenuItem onClick={() => handleDialogTemplate(true)}>Xuất biểu mẫu</MenuItem>
        {extraMenu && extraMenu(id)}
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
        <AssignTask id={id} callbackAssign={callbackAssign} code={code} />
      </DialogUI>
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
          data={{
            source: code,
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
          {state.templatess.map(form => (
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
          // error={this.props.addSalesQuotation.rate === ''}
          // helperText={this.props.addSalesQuotation.rate === '' ? 'tỷ giá ngoại lệ không được bỏ trống' : null}
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
      {/* <div style={{ width: '100vw' }} id="divToPrint" /> */}
    </div>
  );
});

const mapStateToProps = createStructuredSelector({
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(ListPage);

ListPage.defaultProps = {
  deleteOption: 'ids',
  filter: { status: 1 },
  treeName: 'name',
  columnExtensions: [{ columnName: 'edit', width: 150 }],
  rightColumns: ['edit'],
  reload: false,
  perPage: 10,
  status: 'crmStatus',
  disableEdit: false,
  extraMenu: null,
  kanbanKey: 'type',
};
