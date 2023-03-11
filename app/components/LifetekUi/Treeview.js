/* eslint-disable no-alert */
/* eslint-disable react/no-unused-state */
import React from 'react';
import SortableTree, { toggleExpandedForAll, changeNodeAtPath, removeNodeAtPath, getFlatDataFromTree, addNodeUnderParent } from 'react-sortable-tree';
import { Edit, Delete, FileCopy } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Button, withStyles, Typography, MenuItem, Checkbox, FormControlLabel, FormControl, InputLabel, Select, Input, Chip } from '@material-ui/core';
import { AsyncAutocomplete, CustomInputBase } from 'components/LifetekUi';
import TextField from './LtTextField';
import Grid from './LtGrid';
import Dialog from './Dialog';
import GridMUI from '@material-ui/core/Grid';

import './tree.css';
// import messages from '../../containers/AddSampleProcess/messages';
import { generateId, findListDep, fetchData, flatChild } from '../../helper';
import 'react-sortable-tree/style.css';
import { clientId } from '../../variable';
import { API_USERS, API_TEMPLATE, API_APPROVE_GROUPS, API_ORIGANIZATION } from '../../config/urlConfig';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
});

const maxDepth = 5;

const getNodeKey = ({ treeIndex }) => treeIndex;

const mapFunction = item => ({ name: item.name, id: item._id });

class Treeview extends React.Component {
  state = {
    treeData: [],
    open: false,
    name: '',
    duration: 0,
    node: {},
    join: [],
    inCharge: [],
    approved: [],
    employees: [],
    // eslint-disable-next-line react/no-unused-state
    treeIndex: 0,
    subtitle: '',
    templateId: null,
    modules: JSON.parse(localStorage.getItem('crmStatus')),
    md: '',
    listMd: [],
    moduleStatus: '',
    category: 1,
    durationUnit: 'day',
    list: [],
    path: [],
    crmSource: [],
    dependent: '',
    isRoot: false,
    idTree: '',
    isApproved: false,
    isObligatory: false,
    note: {},
    listTemplates: [],
    type: '',
    template: null,
    internal: false,
    view: false,
    roleDirection: null,
    consult: null,
    checkOrg: false,
    offerProcess: false,
    allowSendToUnit: false,
    signedProcess: false,
    listDepartment: [],
    apostropher: false,
    agreeFiles: false,
    deleteFile: false,
    reUpFile: false,
    unit: [],
    unit: "",
    sendUnit: "",
    typeList: [
      { name: 'Bộ công an', type: 'corporation' },
      { name: 'CATP/ CAT/ Cục/ Vụ/ Viện/ Trường/ Bộ tư lệnh', type: 'company' },
      { name: 'Phòng/ Quận/ Huyện/ Thành phố/ Thị xã/ Khóa', type: 'department' },
      { name: 'Đội/ Tổ/ Phường/ Xã', type: 'salePoint' },
    ],
  };

  loadData = async () => {
    const data = await Promise.all([fetchData(`${API_TEMPLATE}?clientId=${clientId}`)]);
    const newData = data[0].filter(i => i.moduleCode === 'Task').map(i => ({ name: i.title, id: i._id }));
    let crmSource = JSON.parse(localStorage.getItem('crmSource')) || [];
    crmSource = crmSource && crmSource.find(f => f.code === 'S300');
    this.setState({ listTemplates: newData, crmSource });
  };

  componentDidMount() {
    this.loadData();
    fetchData(`${API_ORIGANIZATION}`).then((departmentsData) => {
      const flattedDepartment = flatChild(departmentsData && departmentsData[0] && departmentsData[0].child);
      this.setState({ listDepartment: flattedDepartment || [] })
    })
  }

  getNodeInfo = ({ node, path, treeIndex }) => {
    const totalNode = getFlatDataFromTree({ treeData: this.state.treeData, getNodeKey: ({ treeIndex }) => treeIndex });

    const mapNode = totalNode.map((item, index) => ({ name: item.node.title, disabled: path.includes(index), idTree: item.node.idTree }));

    // function checkPath(currentPath, ItemPath, index) {
    //   let x = true;
    //   currentPath.forEach((it, id) => {
    //     it !== ItemPath[id];
    //     x = false;
    //   });
    // }
    // eslint-disable-next-line react/no-unused-state
    if (!this.props.isProcessFlow) {
      const join = [...node.join];
      const inCharge = [...node.inCharge];
      const approved = [...node.approved];

      this.setState({
        open: true,
        name: node.title,
        duration: node.duration,
        durationUnit: node.durationUnit || 'day',
        // subtitle: node.subtitle,
        category: node.category,
        path,
        node,
        treeIndex,
        join,
        inCharge,
        description: node.description,
        idTree: node.idTree,
        approved,
        dependent: node.dependent,
        link: node.link,
        moduleStatus: node.moduleStatus,
        list: mapNode,
        isApproved: node.isApproved,
        isObligatory: node.isObligatory,
        template: node.template,
      });
    } else {
      this.setState({
        open: true,
        name: node.title,
        duration: node.duration,
        durationUnit: node.durationUnit || 'day',
        // subtitle: node.subtitle,
        category: node.category,
        path,
        node,
        treeIndex,
        description: node.description,
        idTree: node.idTree,
        dependent: node.dependent,
        link: node.link,
        moduleStatus: node.moduleStatus,
        list: mapNode,
        isApproved: node.isApproved,
        isObligatory: node.isObligatory,
        template: node.template,
        checkOrg: node.checkOrg,
        offerProcess: node.offerProcess,
        allowSendToUnit: node.allowSendToUnit,
        apostropher: node.apostropher,
        agreeFiles: node.agreeFiles,
        deleteFile: node.deleteFile,
        reUpFile: node.reUpFile,
        signedProcess: node.signedProcess,
        roleDirection: node.roleDirection,
        consult: node.consult,
        unit: node.unit,
        sendUnit: node.sendUnit
      });
    }
  };

  handleTreeOnChange = treeData => {
    // alert('gfdg)');
    this.setState({ treeData });
  };

  static getDerivedStateFromProps(props, state) {
    if (props.templateId !== state.templateId)
      return {
        treeData: props.treeData,
        templateId: props.templateId,
      };
    return null;
  }

  saveNode = () => {
    // alert('cv');
    const {
      treeData,
      path,
      node,
      name,
      description,
      duration,
      join,
      inCharge,
      approved,
      category,
      link,
      moduleStatus,
      dependent,
      idTree,
      isApproved,
      isObligatory,
      template,
      durationUnit,
      checkOrg,
      offerProcess,
      allowSendToUnit,
      apostropher,
      agreeFiles,
      deleteFile,
      reUpFile,
      signedProcess,
      roleDirection,
      consult, unit, sendUnit
    } = this.state;

    const totalNode = getFlatDataFromTree({ treeData, getNodeKey: ({ treeIndex }) => treeIndex });
    const mapNode = totalNode.map((item, index) => ({
      name: item.node.title,
      disabled: path.includes(index),
      idTree: item.node.idTree,
      dependent: item.node.dependent,
      checkOrg: item.node.checkOrg,
      offerProcess: item.node.offerProcess,
      allowSendToUnit: item.node.allowSendToUnit,
      apostropher: item.node.apostropher,
      agreeFiles: item.node.agreeFiles,
      deleteFile: item.node.deleteFile,
      reUpFile: item.node.reUpFile,


      signedProcess: item.node.signedProcess,
      roleDirection: item.node.roleDirection,
      consult: item.node.consult,
      unit: item.node.unit,
      sendUnit: item.node.sendUnit
    }));

    const a = [];

    findListDep(dependent, mapNode, a);
    // console.log('A', a);
    const check = a.includes(idTree);
    if (check) {
      alert('Không thể chọn công việc này vì sẽ gây vòng lặp vô hạn');
      return;
    }
    const tieude = mapNode.find(i => i.idTree === dependent);
    const sub = tieude ? ` Phụ thuộc:${tieude.name}` : '';
    const newJoin = [...join];
    const newInCharge = [...inCharge];
    const newApproved = [...approved];
    const newTree = changeNodeAtPath({
      treeData,
      path,
      getNodeKey,
      newNode: {
        ...node,
        title: name,
        subtitle: sub,
        checkOrg,
        offerProcess,
        allowSendToUnit,
        apostropher,
        agreeFiles,
        deleteFile,
        reUpFile,
        signedProcess,
        roleDirection,
        consult,
        unit,
        sendUnit,
        duration,
        durationUnit,
        join: newJoin,
        inCharge: newInCharge,
        approved: newApproved,
        category,
        link,
        description,
        moduleStatus,
        dependent,
        idTree,
        isApproved,
        isObligatory,
        template,
      },
    });
    this.setState({
      treeData: newTree,
      open: false,
    });
  };

  toggleNodeExpansion = expanded => {
    this.setState(prevState => ({
      treeData: toggleExpandedForAll({
        treeData: prevState.treeData,
        expanded,
      }),
    }));
  };

  handleChange = name => e => {
    let value;
    if (name === 'duration') {
      value = parseInt(e.target.value);
    } else if (name === 'checkOrg') {
      value = e.target.checked;
    }
    else if (name === 'offerProcess') {
      value = e.target.checked;
    }
    else if (name === 'allowSendToUnit') {
      value = e.target.checked;
    }
    else if (name === 'apostropher') {
      value = e.target.checked;
    }
    else if (name === 'agreeFiles') {
      value = e.target.checked;
    }
    else if (name === 'deleteFile') {
      value = e.target.checked;
    }
    else if (name === 'reUpFile') {
      value = e.target.checked;
    }
    else if (name === 'signedProcess') {
      value = e.target.checked;
    }
    else {
      value = e.target.value;
    }
    this.setState({ [name]: value });
  };
  addNewTask = () => {
    const treeData = this.state.treeData;
    const newTree = [
      {
        title: 'Công việc mới',
        description: '',
        duration: 1,
        expanded: true,
        join: [],
        inCharge: [],
        approved: [],
        moduleStatus: '',
        link: '',
        idTree: generateId(),
        dependent: '',
        isApproved: false,
        isObligatory: false,
        durationUnit: 'day',
      },
    ].concat(treeData);
    // this.setState({ treeData: addNodeUnderParent({ ...newTree }) });
    this.setState({ treeData: newTree, internal: false, command: false, view: false });
    this.setState({ node: {}, type: '' });
  };
  getTitle = (type, command, internal, view) => {
    let result = '';
    if (type) {
      result += `(${type.title}) `;
    }
    if (internal) {
      result += `(Nội bộ) `;
    }
    // if (command) {
    //   result += `(Xin ý kiến) `
    // }
    if (view) {
      result += `(Nhận để biết) `;
    }
    return result;
  };
  addNode = () => {
    const { node, treeData, type, internal, view, command } = this.state;
    const newTree = [
      {
        name: node.name,
        code: node.code,
        children: node.children,
        type: type ? type.value : '',
        idTree: generateId(),
        title: node.name + ' ' + this.getTitle(type, command, internal, view),
        internal,
        // command,
        view,
      },
    ].concat(treeData);
    this.setState({ treeData: newTree, internal: false, command: false, view: false });
    this.setState({ node: {}, type: '' });
  };
  componentDidUpdate(preProps, preState) {
    if (preState.treeData !== this.state.treeData) {
      this.props.getTreeData && this.props.getTreeData(this.state.treeData);
    }
    if (preProps.treeData !== this.props.treeData) {
      this.setState({ treeData: this.props.treeData });
    }
  }
  handleChangeChip = (event) => {
    this.setState({ unit: event.target.value })
  };
  handleDelete = (chipToDelete) => () => {
    this.setState({ unit: (chips) => chips.filter((chip) => chip.id !== chipToDelete.id) })
  };
  render() {
    const { treeData, isApproved, template, listTemplates, isObligatory, internal, node, view, command, listDepartment } = this.state;
    const flowType = localStorage.getItem('tabFlow');
    const isInternal = flowType === 'calendar' || flowType === 'task' || flowType === 'planWorkingPerson' || flowType === 'planWorking';
    const isNonInternal = flowType !== 'calendar' && flowType !== 'task';
    const isDoc = flowType !== 'inCommingDocument' && flowType !== 'outGoingDocument';
    return (
      <Grid container>
        <Grid style={{ display: 'flex', padding: 20 }} container alignItems="center" spacing={8} item md={12}>
          {this.props.isProcessFlow ? (
            <>
              <Grid item md={2}>
                <TextField
                  style={{ width: '100%' }}
                  value={this.state.node}
                  onChange={e => this.setState({ node: e.target.value })}
                  select
                  label="Nhóm vai trò"
                >
                  {this.props.users &&
                    this.props.users.map((item, index) => (
                      <MenuItem key={item.code} value={item}>
                        {item.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>

              <Grid item md={2}>
                <TextField
                  style={{ width: '100%' }}
                  name="type"
                  value={this.state.type}
                  onChange={e => this.setState({ type: e.target.value })}
                  select
                  label="Vai trò"
                >
                  <MenuItem key={0} value={''}>
                    --Chọn--
                  </MenuItem>
                  {this.state.crmSource &&
                    this.state.crmSource.data &&
                    this.state.crmSource.data.map(crm => (
                      <MenuItem key={crm._id} value={crm}>
                        {crm.title}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              {isDoc && (
                <>
                  {isInternal && (
                    <Grid item>
                      <FormControlLabel
                        control={
                          <Checkbox color="primary" checked={internal ? true : false} onChange={e => this.setState({ internal: e.target.checked })} />
                        }
                        label="Nội bộ"
                      />
                    </Grid>
                  )}
                  {isNonInternal && (
                    <>
                      {/* <Grid item >
                        <FormControlLabel
                          control={<Checkbox color="primary" checked={command ? true : false} onChange={e => this.setState({ command: e.target.checked })} />}
                          label="Xin ý kiến"
                        />
                      </Grid> */}
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" checked={view ? true : false} onChange={e => this.setState({ view: e.target.checked })} />
                          }
                          label="Nhận để biết"
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}

              <Grid item xs={3}>
                <Button color="primary" variant="contained" onClick={this.addNode}>
                  Thêm vai trò
                </Button>
              </Grid>
            </>
          ) : (
            <Button color="primary" variant="contained" onClick={this.addNewTask}>
              Thêm mới công việc
            </Button>
          )}

          {/* <Button onClick={() => this.props.onSave(treeData)} color="primary" variant="contained">
            Lưu Lại
          </Button> */}
          <button
            type="button"
            ref={this.props.saveRef}
            onClick={() => {
              this.props.onSave(treeData);
            }}
            hidden
          />
        </Grid>
        {this.props.isProcessFlow ? (
          <Grid style={{ display: 'flex', padding: 20 }} item md={12}>
            <Button style={{ margin: ' 0px 5px' }} color="primary" variant="contained" onClick={() => this.toggleNodeExpansion(true)}>
              Mở rộng
            </Button>
            <Button color="primary" variant="contained" onClick={() => this.toggleNodeExpansion(false)}>
              Thu gọn
            </Button>
          </Grid>
        ) : (
          <Grid style={{ display: 'flex' }} item md={6}>
            <Button style={{ margin: ' 0px 5px' }} color="primary" variant="contained" onClick={() => this.toggleNodeExpansion(true)}>
              Mở rộng
            </Button>
            <Button color="primary" variant="contained" onClick={() => this.toggleNodeExpansion(false)}>
              Thu gọn
            </Button>
          </Grid>
        )}
        <Grid item md={2} />
        <Grid style={{ textAlign: 'center' }} item md={12}>
          <SortableTree
            treeData={treeData}
            isVirtualized={false}
            onChange={this.handleTreeOnChange}
            onMoveNode={({ node, treeIndex, path }) => global.console.debug('node:', node, 'treeIndex:', treeIndex, 'path:', path)}
            // maxDepth={maxDepth}
            fullWidth
            canDrag={({ node }) => !node.noDragging}
            canDrop={({ nextParent }) => !nextParent || !nextParent.noChildren}
            generateNodeProps={rowInfo => ({
              title: <Typography variant="body1">{rowInfo.node.title}</Typography>,
              buttons: [
                <Edit style={{ cursor: 'pointer' }} onClick={() => this.getNodeInfo(rowInfo)} />,
                <FileCopy
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.setState(state => ({
                      treeData: addNodeUnderParent({
                        treeData: state.treeData,
                        // parentKey: path[path.length - 2],
                        expandParent: true,
                        getNodeKey,
                        newNode: {
                          ...rowInfo.node,
                        },
                      }).treeData,
                    }));
                  }}
                />,
                <Delete
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    this.setState(state => ({
                      treeData: removeNodeAtPath({
                        treeData: state.treeData,
                        path: rowInfo.path,
                        getNodeKey,
                      }),
                    }))
                  }
                />,
              ],
            })}
          />
        </Grid>
        <Grid item md={1} />
        <Dialog
          onSave={this.saveNode}
          onCancel={() => this.setState({ open: false })}
          title={this.props.isProcessFlow ? 'Cập nhật vai trò' : 'Sửa công việc'}
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
        >
          <GridMUI container spacing={8}>
            <GridMUI item xs={12} >
              <TextField
                autoFocus
                fullWidth
                onChange={this.handleChange('name')}
                value={this.state.name}
                label={!this.props.isProcessFlow ? 'Tên công việc' : 'Tên vai trò'}
              />
            </GridMUI>
            {flowType === "inCommingDocument" && (
              <GridMUI item xs={flowType === "outGoingDocument" ? 4 : 6}>
                <TextField
                  onChange={event => {
                    let { roleDirection } = this.state;
                    roleDirection = event.target.value;
                    this.setState({ roleDirection });
                  }}
                  select
                  value={this.state.roleDirection}
                  label="Chuyển bất kỳ theo"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                >

                  <MenuItem value={null}>-- Chọn --</MenuItem>
                  <MenuItem value="up">Chỉ được chuyển cho cấp trên</MenuItem>
                  <MenuItem value="down">Chỉ được chuyển cho cấp dưới</MenuItem>
                  <MenuItem value="equal">Chỉ được chuyển cho ngang cấp</MenuItem>
                </TextField>
              </GridMUI>
            )}

            <GridMUI item xs={6}>
              <TextField
                onChange={event => {
                  let { consult } = this.state;
                  consult = event.target.value;
                  this.setState({ consult });
                }}
                select
                value={this.state.consult}
                label="Xin ý kiến"
                variant="outlined"
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value={null}>-- Chọn --</MenuItem>
                <MenuItem value="up">Chỉ xin ý kiến cấp trên</MenuItem>
                <MenuItem value="equal">Chỉ xin ý kiến ngang cấp</MenuItem>
                {/* <MenuItem value="upandequal">Chỉ xin ý kiến cấp trên và ngang cấp</MenuItem> */}
              </TextField>
            </GridMUI>



            <GridMUI item xs={6}>
              <TextField
                onChange={event => {
                  let { unit } = this.state;
                  unit = event.target.value;
                  this.setState({ unit });
                }}
                select
                value={this.state.unit}
                label="Phạm vi đơn vị chuyển theo luồng khi nhận"
                variant="outlined"
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value={null}>-- Chọn phạm vi đơn vị nhận --</MenuItem>
                {this.state.typeList && Array.isArray(this.state.typeList) && this.state.typeList.length > 0 && this.state.typeList.map(item => (
                  <MenuItem key={item._id} value={item.type} >
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </GridMUI>
            {
              flowType === "inCommingDocument" && (
                <GridMUI item xs={6}>
                  <TextField
                    onChange={event => {
                      let { sendUnit } = this.state;
                      sendUnit = event.target.value;
                      this.setState({ sendUnit });
                    }}
                    select
                    value={this.state.sendUnit}
                    label="Phạm vi đơn vị chuyển bất kỳ khi gửi"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value={null}>-- Chọn phạm vi đơn vị nhận --</MenuItem>
                    {this.state.typeList && Array.isArray(this.state.typeList) && this.state.typeList.length > 0 && this.state.typeList.map(item => (
                      <MenuItem key={item._id} value={item.type} >
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </GridMUI>
              )
            }

            {
              flowType === "inCommingDocument" && (
                <GridMUI item xs={6}>
                  <FormControlLabel
                    control={<Checkbox checked={this.state.allowSendToUnit} onChange={this.handleChange('allowSendToUnit')} color="primary" />}
                    label="Chuyển đầu phòng cho đơn vị"
                  />
                </GridMUI>
              )
            }
            {/* <GridMUI item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={this.state.checkOrg} onChange={this.handleChange('checkOrg')} color="primary" />}
                label="Chỉ được chuyển cho cán bộ thuộc phòng"
              />
            </GridMUI> */}
            <GridMUI item xs={6}>
              {flowType === "inCommingDocument" && <FormControlLabel
                control={<Checkbox checked={this.state.offerProcess} onChange={this.handleChange('offerProcess')} color="primary" />}
                label="Đề xuất phiếu xử lý"
              />}
              {flowType === "outGoingDocument" && <FormControlLabel
                control={<Checkbox checked={this.state.signedProcess} onChange={this.handleChange('signedProcess')} color="primary" />}
                label="Ký văn bản báo cáo"
              />}
            </GridMUI>

            {
              flowType === "outGoingDocument" && (
                <GridMUI item xs={6}>
                  <FormControlLabel
                    control={<Checkbox checked={this.state.apostropher} onChange={this.handleChange('apostropher')} color="primary" />}
                    label="Người ký nháy"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.agreeFiles} onChange={this.handleChange('agreeFiles')} color="primary" />}
                    label="Đồng ý dự thảo"
                  />
                </GridMUI>
              )
            }
            {
              flowType === "outGoingDocument" && (
                <GridMUI item xs={6}>
                  <FormControlLabel
                    control={<Checkbox checked={this.state.deleteFile} onChange={this.handleChange('deleteFile')} color="primary" />}
                    label="Xóa file"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.reUpFile} onChange={this.handleChange('reUpFile')} color="primary" />}
                    label="Tải lại file"
                  />
                </GridMUI>
              )
            }
          </GridMUI>

          {this.props.isProcessFlow ? null : (
            <>
              <GridMUI container spacing={2}>
                <GridMUI item xs={10}>
                  <TextField fullWidth onChange={this.handleChange('duration')} value={this.state.duration} type="number" label="Thời lượng" />
                </GridMUI>
                <GridMUI item xs={2}>
                  <TextField
                    fullWidth
                    onChange={e => this.setState({ durationUnit: e.target.value })}
                    select
                    value={this.state.durationUnit}
                    label="Đơn vị"
                  >
                    <MenuItem key="day" value="day">
                      Ngày
                    </MenuItem>
                    <MenuItem key="hour" value="hour">
                      Giờ
                    </MenuItem>
                  </TextField>
                </GridMUI>
              </GridMUI>
              <TextField
                InputLabelProps={{ shrink: true }}
                onChange={e => this.setState({ dependent: e.target.value })}
                select
                value={this.state.dependent}
                label="Bắt đầu sau công việc"
              >
                {this.state.list.map(item => (
                  <MenuItem key={item.idTree} disabled={item.disabled} value={item.idTree}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField InputLabelProps={{ shrink: true }} value={this.state.category} onChange={e => this.setState({ category: e.target.value })} select label="Loại công việc">
                {this.props.configs &&
                  this.props.configs.map((item, index) => (
                    <MenuItem key={item.code} value={index + 1}>
                      {item.name}
                    </MenuItem>
                  ))}
              </TextField>
              <AsyncAutocomplete
                optionValue="id"
                url={API_USERS}
                isMulti
                onChange={this.handleAutocomplele('join')}
                value={this.state.join}
                label="Người tham gia"
                mapFunction={mapFunction}
              />
              {/* <AsyncAutocomplete
                optionValue="id"
                url={API_USERS}
                isMulti
                onChange={this.handleAutocomplele('inCharge')}
                value={this.state.inCharge}
                label="Người phụ trách"
                mapFunction={mapFunction}
              />
              <AsyncAutocomplete
                optionValue="id"
                url={API_APPROVE_GROUPS}
                isMulti
                onChange={value => this.setState({ approved: value })}
                value={this.state.approved}
                label="Nhóm phê duyệt"
                mapFunction={mapFunction}
              />

              <TextField select onChange={this.handleChangeModules} value={this.state.link} label="Chọn module">
                {this.state.modules.map(item => (
                  <MenuItem value={item.code}>{item.title}</MenuItem>
                ))}
              </TextField>
              <TextField select onChange={this.handleChange('moduleStatus')} value={this.state.moduleStatus} label="Chọn Trạng thái">
                {this.state.listMd.map(item => (
                  <MenuItem value={item.type}>{item.name}</MenuItem>
                ))}
              </TextField> */}
              <TextField multiline rows={2} onChange={this.handleChange('description')} value={this.state.description} label="Mô tả" />
              {/* <div>
                <Checkbox onChange={e => this.setState({ isApproved: e.target.checked })} color="primary" checked={this.state.isApproved} />
                Phê duyệt
                <Checkbox onChange={e => this.setState({ isObligatory: e.target.checked })} color="primary" checked={isObligatory} />
                Bắt buộc
              </div> */}
              {isApproved ? (
                <TextField label="Chọn biểu mẫu" onChange={e => this.setState({ template: e.target.value })} select value={template}>
                  {listTemplates.map(i => (
                    <MenuItem key={i.id} value={i.id}>
                      {i.name}
                    </MenuItem>
                  ))}
                </TextField>
              ) : null}
            </>
          )}
        </Dialog>
      </Grid >
    );
  }

  handleAutocomplele = name => value => {
    let newValue;
    if (value) {
      newValue = value;
    } else newValue = [];
    this.setState({ [name]: newValue });
  };

  handleChangeModules = e => {
    const { modules } = this.state;
    const listMd = modules.find(item => item.code === e.target.value).data;
    this.setState({ listMd, link: e.target.value, moduleStatus: '' });
  };
}

export default withStyles(styles)(Treeview);

Treeview.defaultProps = {
  treeData: [],
  templateId: null,
};
