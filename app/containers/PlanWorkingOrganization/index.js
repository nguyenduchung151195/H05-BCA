import React, { useState, useEffect } from 'react';
import { SwipeableDrawer, Tab, Tabs } from '../../components/LifetekUi';
import ListPage from 'components/List';
import { Grid, Paper, withStyles, Fab, Menu, MenuItem } from '@material-ui/core';
import { Replay, Send, ArrowRight, ArrowLeft, ChatBubbleOutline } from '@material-ui/icons';
import Buttons from 'components/CustomButtons/Button';
import { getListData } from '../../utils/common';
import makeSelectDashboardPage, { makeSelectMiniActive, makeSelectProfile } from '../Dashboard/selectors';
import PlanView from '../../components/PlanWorking/PlanView';
import PlanSign from '../../components/PlanWorking/PlanSign';
import {
  API_PLAN_WORKING,
  API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE,
  API_ROLE_APP,
  COUNT_PLAN_UNIT,
  API_ORIGANIZATION,
  API_EXPORT_BY_TIME_RESULT,
} from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styles from './styles';
import DocumentAssignModal from '../../components/PlanWorking';
import ReturnDocs from '../../components/PlanWorking';
import { fetchData, PrintContentTable, flatChildOpen, serialize } from '../../helper';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePickerCustom';
import CustomInputBase from 'components/Input/CustomInputBase';

function PlanWorkingOrganization(props) {
  const { onChangeSnackbar, profile } = props;
  const [tab, setTab] = useState(localStorage.getItem('organizationPlan') || 'plan');
  const [childTab, setChildTab] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [responseDialog, setResponseDialog] = useState(null);
  const [processDialog, setProcessDialog] = useState(null);
  const [detailPlan, setDetailPlan] = useState({});
  const [showMore, setShowMore] = useState(false);
  const [canView, setCanView] = useState(false);
  const [openProcess, setOpenProcess] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const [openCommand, setOpenCommand] = useState(false);
  const [openSign, setOpenSign] = useState(false);
  const [returnType, setReturnType] = useState('');
  const [processType, setProcessType] = useState('');
  const [templatesSelected, setTemplatesSelected] = useState({});
  const [reload, setReload] = useState(new Date());
  const [allRoles, setAllRoles] = useState([]);
  const [role, setRole] = useState([]);
  const [roleTabs, setRoleTabs] = useState([]);
  const [ID, setID] = useState(null);
  const [unit, setUnit] = useState(null);

  const [openDialogExport, setOpenDialogExport] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [listDepartment, setListDepartment] = useState([]);
  const [departmentSelect, setDepartmentSelect] = useState({});
  const [departmentSelectDefault, setDepartmentSelectDefault] = useState({});

  const [errorDepartment, setErrorDepartment] = useState(false);
  const typeCalendar = 1;
  const handleChangeTab = value => {
    setTab(value);
    setChildTab(0);
    if(value !== tab)
    setCanView(false);
  };
  const handleChangeChildTab = value => {
    setChildTab(value);
    setCanView(false);
  };
  useEffect(() => {
    fetchData(API_ORIGANIZATION)
      .then(data => {
        const flattedDepartment = flatChildOpen(data);
        console.log(data, 'dât');
        console.log(flattedDepartment, 'flattedDepartment');
        setListDepartment(flattedDepartment);
        const organizationUnit = {
          _id: props.profile.organizationUnit.organizationUnitId,
          title: props.profile.organizationUnit.name,
        };
        setDepartmentSelectDefault(organizationUnit);
        setDepartmentSelect(organizationUnit);
        console.log(props.profile, 'props.profile');
        setErrorDepartment(false);
      })
      .catch(err => {
        console.log(err, 'err');
        onChangeSnackbar({ variant: 'error', message: 'Lấy dữ liệu phòng ban thất bại', status: true });
        setListDepartment([]);
        setErrorDepartment(true);
        setDepartmentSelect({});
      });
  }, []);
  function Bt(props) {
    return (
      <Buttons
        // color={props.tab === tab ? 'gradient' : 'simple'}
        color={props.color}
        right
        round
        size="sm"
        onClick={() => props.onClick(props.tab)}
      >
        {props.children}
      </Buttons>
    );
  }
  const getStateSelection = e => {
    // Array.isArray(e) && e.length > 0 ? setCanView(true) : setCanView(false)
  };
  const handleSelectPlan = plan => {
    if (plan) {
      let result = plan.map(pl => pl._id);
      setSelectedPlan(result);
    }
  };
  const handleOpen = (e, action) => {
    if (action === 'process') {
      setProcessDialog(e.currentTarget);
    }
    if (action === 'return') {
      setResponseDialog(e.currentTarget);
    }
    if (action === 'command') {
      setOpenCommand(true);
    }
    if (action === 'sign') {
      setOpenSign(true);
    }
  };

  const handleClose = () => {
    setProcessDialog(null);
    setOpenProcess(false);
    setOpenCommand(false);
    setOpenSign(false);
    setOpenReturn(false);
    setResponseDialog(null);
    setSelectedPlan([]);
  };

  const handleOpenDialog = (action, bool, type) => {
    if (action === 'process') {
      setOpenProcess(bool);
    }
    if (action === 'return') {
      setOpenReturn(bool);
    }
  };

  const findNode = (templates, child, count) => {
    let d = count;
    templates.map(temp => {
      if (temp.children) {
        if (child) {
          let [item] = child;
          let index = temp && temp.children && temp.children.findIndex(f => f.idTree == item.idTree);
          if (index !== -1) {
            if (temp.children) {
              setFinalChild([{ ...temp }]);
            }
          } else {
            findNode(temp.children, child, d + 1);
          }
        }
      }
    });
  };

  const handleSelectReturnTemplate = (bool, template) => {
    setSelectedTemplate(template);
    setReturnDocType(type);
    detailPlan && detailPlan.template && findNode([detailPlan.template], template, 0);
  };

  const handleSelectTemplate = (bool, temp, type) => {
    setUnit(null);
    if (temp && temp.unit) {
      setUnit(temp.unit);
    }
    setProcessType(type);
    setTemplatesSelected(temp);
    setOpenProcess(bool);
  };
  useEffect(() => {
    return () => {
      localStorage.removeItem('organizationPlan');
    };
  }, []);
  useEffect(
    () => {
      if (selectedPlan.length > 0) {
        setCanView(true);
        getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/planWorking`).then(res => {
          if (res) {
            setTemplates([{ ...res }]);
            if (res._id) setID(res._id);
          } else {
            onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng xử lý', status: true });
          }
        });
        if (selectedPlan.length === 1) {
          let [item] = selectedPlan || [];
          fetchData(`${API_PLAN_WORKING}/${item}`, 'GET').then(res => {
            setDetailPlan(res);
          });
        }
      } else {
        setCanView(false);
      }
    },
    [selectedPlan],
  );
  useEffect(() => {
    fetchData(`${API_ROLE_APP}/OrganizationPlan/${profile._id}`).then(res => {
      const newBusinessRole = {};
      console.log(res)
      const { roles } = res;
      const code = 'BUSSINES';

      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
      setAllRoles(foundRoleDepartment);
      if (foundRoleDepartment) {
        const { data } = foundRoleDepartment;
        let check = false;
        if (data) {
          data.forEach(d => {
            newBusinessRole[d.name] = d.data.view;
            if (!check && d.data.view) {
              check = true;
            }
          });
        }
      }
      // if (tab == 'null') {
      //   setTab('plan');
      // }
      let checkFirst = true
      console.log(newBusinessRole, 'newBusinessRole newBusinessRole')
      for (const key in newBusinessRole) {

        if(newBusinessRole[key] && checkFirst) {
          setTab(key)
          checkFirst= false
          console.log(newBusinessRole[key], key, 'object[key]')
          
        }
      }
      setRole(newBusinessRole);
    });
  }, []);
  const mapFunction = item => {
    return {
      ...item,
      timeStart: moment(item.timeStart).format('DD/MM/YYYY'),
      timeEnd: moment(item.timeEnd).format('DD/MM/YYYY'),
    };
  };

  const reloadState = () => {
    fetch(`${API_PLAN_WORKING}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setOpenProcess(false);
        setProcessDialog(null);
        setSelectedPlan([]);
        setProcessType('');
      });
    setReload(new Date() * 1);
    console.log("setCanView")
    setCanView(false);
  };
  const getNameByTab = value => {
    switch (value) {
      case 'plan':
        return 'Kế hoạch';
      case 'viewer':
        return 'Nhận để biết';
      case 'comment':
        return 'Xin ý kiến';
      case 'commented':
        return 'Cho ý kiến';
      // case 'signer': return 'Ký nhận';
      case 'signer':
        return 'Phê duyệt';
      case 'enfor':
        return 'Thực thi';
    }
  };
  const checkEndFlow = array => {
    let result = false;
    if (array && array.length > 0) {
      array.map(item => {
        if (!item.children || (item.children && item.children.length === 0)) {
          result = false;
        } else {
          result = true;
        }
      });
    } else {
      result = true;
    }

    return result;
  };

  useEffect(
    () => {
      if (role) {
        let tabs = Object.keys(role);
        let value = Object.values(role);
        if (tabs && tabs.length > 0) {
          tabs = tabs.map(
            (tab, index) =>
              value[index] && {
                title: tab,
                name: getNameByTab(tab),
                value: value[index],
              },
          );
        }
        tabs = tabs && tabs.filter(f => f);
        setRoleTabs(tabs);
      }
    },
    [allRoles, role],
  );
  // useEffect(() => {
  //     let data = fetchData(COUNT_PLAN_UNIT).then(res => {
  //         console.log(res)
  //     });
  // }, [])
  const handleExportData = async () => {
    setDisableBtn(true);
    const { allTemplates } = props.dashboardPage;
    const time = new Date(endDate) - new Date(startDate);
    if (time >= 0) {
      if (allTemplates) {
        const foundPersonPlanTemplate = allTemplates.find(elm => elm.moduleCode === 'OrganizationPlan');
        if (foundPersonPlanTemplate) {
          const filter = { organizationUnitId: departmentSelect._id };
          const query = serialize({ filter });
          // const data = await fetchData(`${API_EXPORT_BY_TIME}?${query}`)
          //   departmentSelect
          console.log(departmentSelect, 'departmentSelect');
          const data = await fetchData(
            `${API_EXPORT_BY_TIME_RESULT}?timeStart=${startDate.format('YYYY/MM/DD')}&timeEnd=${endDate.format('YYYY/MM/DD')}&${query}`,
          );

          if (data && data.status) {
            if (data && data.data && Array.isArray(data.data) && data.data.length) {
              console.log(props.profile);
              const formData = {
                data: data.data,
                timeStart: startDate,
                timeEnd: endDate,
                NoNextWeeK: true,
                'createdBy.name': props.profile && props.profile.name,
                name: 'KẾ HOẠCH ĐƠN VỊ',
                organizationUnitName: departmentSelect && departmentSelect.title,
              };
              PrintContentTable({ content: foundPersonPlanTemplate.content, data: formData, code: 'OrganizationPlan', isClone: false });
            } else {
              onChangeSnackbar({ variant: 'warning', message: 'Không có kế hoạch các nhân trong khoảng thời gian này!', status: true });
            }

            setDisableBtn(false);
            setOpenDialogExport(false);
          } else {
            setDisableBtn(false);
            onChangeSnackbar({ variant: 'error', message: data.message || 'Lấy dữ liệu thất bại', status: true });
          }
          console.log(data, 'datadatadata');
        } else {
          setDisableBtn(false);
          onChangeSnackbar({ variant: 'error', message: 'Vui lòng thiết lập biểu mẫu', status: true });
        }
      } else {
        setDisableBtn(false);
        onChangeSnackbar({ variant: 'error', message: 'Vui lòng thiết lập biểu mẫu', status: true });
      }
    } else {
      setDisableBtn(false);
      onChangeSnackbar({ variant: 'warning', message: 'Thời gian không hợp lệ vui lòng chọn lại', status: true });
    }
  };
  useEffect(
    () => {
      localStorage.setItem('organizationPlan', tab);
    },
    [tab],
  );
  const canFeedBack = roleTabs && roleTabs.find(f => f.title === 'comment') && roleTabs.find(f => f.title === 'comment').value;
  const nameFeedBack =
    detailPlan &&
    detailPlan.processeds &&
    detailPlan.processeds[detailPlan.processeds.length - 1] &&
    detailPlan.processeds[detailPlan.processeds.length - 1];
  const name = nameFeedBack && nameFeedBack._id !== profile._id ? nameFeedBack.name : '';
  const isEndFlow = detailPlan && detailPlan.children && checkEndFlow(detailPlan.children);
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs>
          <Tabs value={tab} onChange={(e, v) => handleChangeTab(v)} aria-label="simple tabs example">
            {roleTabs && roleTabs.length > 0 && roleTabs.map((role, index) => <Tab value={role.title} label={role.name} />)}
            {/* {!showMore && <Tab isArrow={true} value={'more'} label={<ArrowRight />} />}
                    {showMore && (
                        <>
                            <Tab value={5} onClick={() => setTab(5)} label={'Thực thi'} />
                            <Tab value={'noMore'} isArrow={true} onClick={() => setShowMore(false)} label={<ArrowLeft />} />
                        </>
                    )} */}
          </Tabs>
        </Grid>
        <Grid item xs style={{ textAlign: 'right' }}>
          <>
            {canView &&
              tab !== 2 &&
              tab !== 4 && (
                <>
                  {isEndFlow && (
                    <Fab
                      variant="extended"
                      size="small"
                      color="primary"
                      aria-label="add"
                      style={{
                        minWidth: '150px!important',
                        height: '30px!important',
                        marginRight: 10,
                        boxShadow: 'none',
                      }}
                    >
             
                      <span
                        style={{ fontSize: '0.8125rem' }}
                        onClick={e => {
                          handleOpen && handleOpen(e, 'process');
                          return;
                        }}
                      >
                        Chuyển xử lý
                      </span>
                    </Fab>
                  )}
                </>
              )}
            {/* {canView && canFeedBack && ( */}
            {/* 22/10/2022 yc bỏ nút xin ý kiến phạm minh thắng */}

            {/* { canView && name && 
                            <Fab variant="extended" size="small" color="primary" aria-label="add" style={{
                  minWidth: '150px!important',
                  height: '30px!important',
                  marginRight: 10,
                  boxShadow: 'none',
                }} style={{ padding: 5 }} >
                                
                                <span
                                    style={{ fontSize: '0.8125rem' }}
                                    onClick={e => {
                                        handleOpen && handleOpen(e, 'command');
                                        return;
                                    }}
                                >
                                    {`Xin ý kiến ${name ? name : ''} `}
                                </span>
                            </Fab>
                        
                        } */}
                        {
                          console.log(childTab, 'childTab', tab)
                        }
            {canView &&
              tab === 'signer' &&
              childTab === 0 && (
                <Fab
                  variant="extended"
                  size="small"
                  color="primary"
                  aria-label="add"
                  style={{
                    minWidth: '150px!important',
                    height: '30px!important',
                    marginRight: 10,
                    boxShadow: 'none',
                  }}
                >
                 
                  <span
                    style={{ fontSize: '0.8125rem' }}
                    onClick={e => {
                      handleOpen && handleOpen(e, 'sign');
                      return;
                    }}
                  >
                    {/* Ký nhận */}
                    Phê duyệt
                  </span>
                </Fab>
              )}
          </>
        </Grid>
      </Grid>
      {/* chuyen xu ly */}
      <Menu open={Boolean(processDialog)} anchorEl={processDialog} onClose={handleClose}>
        {detailPlan.children && detailPlan.children.length > 0 ? (
          <>
            <div style={{ alignItems: 'center', padding: '0 10px' }}>
              {detailPlan.children.map(t => (
                <>
                  {t.children &&
                    t.children.length > 0 &&
                    t.children.map(item => (
                      <MenuItem
                        value={item.code}
                        onClick={() => {
                          handleSelectTemplate && handleSelectTemplate(true, item, 'flow');
                        }}
                      >
                        <span style={{ paddingLeft: 10 }}> Chuyển cho {item.name}</span>
                      </MenuItem>
                    ))}
                  {t.children &&
                    t.children.length === 0 && (
                      <MenuItem
                        value={t.code}
                        onClick={() => {
                          handleSelectTemplate && handleSelectTemplate(true, t, 'flow');
                        }}
                      >
                        <span style={{ paddingLeft: 10 }}> Chuyển cho {t.name}</span>
                      </MenuItem>
                    )}
                </>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ alignItems: 'center', padding: '0 10px' }}>
              {Array.isArray(templates) &&
                templates.map(t => (
                  <>
                    {t.children &&
                      t.children.length > 0 && (
                        <>
                          {t.children.map(item => (
                            <MenuItem
                              value={item.code}
                              onClick={() => {
                                handleSelectTemplate && handleSelectTemplate(true, item, 'flow');
                              }}
                            >
                              <span>Chuyển cho {item.name}</span>
                            </MenuItem>
                          ))}
                        </>
                      )}
                  </>
                ))}
            </div>
          </>
        )}
      </Menu>
      {/* tra lai */}
      <Menu
        open={Boolean(responseDialog)}
        anchorEl={responseDialog}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleClose}
      >
        <MenuItem
          value="any"
          onClick={e => {
            handleOpenDialog && handleOpenDialog('return', true, 'any');
          }}
        >
          Trả bất kỳ
        </MenuItem>
        <MenuItem
          value="flow"
          onClick={e => {
            handleOpenDialog && handleOpenDialog('return', true, 'flow');
          }}
        >
          Trả theo luồng
        </MenuItem>
        <MenuItem
          value="startFlow"
          onClick={e => {
            let [item] = templates || [];
            handleOpenDialog && handleOpenDialog(true, item, 'startFlow');
          }}
        >
          Trả cho văn thư
        </MenuItem>
      </Menu>
      <Grid container>
        <Grid item sm={12}>
          {tab === 'plan' && (
            <>
              <Bt onClick={handleChangeChildTab} tab={1} color={childTab === 1 ? 'gradient' : 'simple'}>
                Đã xử lý
              </Bt>
              <Bt onClick={handleChangeChildTab} tab={0} color={childTab === 0 ? 'gradient' : 'simple'}>
                Đang xử lý
              </Bt>
            </>
          )}
          {tab === 'viewer' && (
            <>
              <Bt onClick={() => mergeData({ tab: 3 })} color={tab === 'comment' ? 'gradient' : 'simple'}>
                Bảng tự động hóa
              </Bt>
              <Bt onClick={() => mergeData({ tab: 3 })} color={tab === 'comment' ? 'gradient' : 'simple'}>
                Trạng thái
              </Bt>
              <Bt onClick={() => mergeData({ tab: 3 })} color={tab === 'comment' ? 'gradient' : 'simple'}>
                Đã phê duyệt
              </Bt>
              <Bt onClick={() => mergeData({ tab: 3 })} color={tab === 'comment' ? 'gradient' : 'simple'}>
                Chờ phê duyệt
              </Bt>
            </>
          )}
          {/* {tab === 'comment' && (
                        <>
                            <Bt onClick={handleChangeChildTab} tab={1} color={childTab === 1 ? 'gradient' : 'simple'}>
                                Đã xin ý kiến
                            </Bt>
                            <Bt onClick={handleChangeChildTab} tab={0} color={childTab === 0 ? 'gradient' : 'simple'}>
                                Chờ xin ý kiến
                            </Bt>
                        </>
                    )}
                    {tab === 'commented' && (
                        <>
                            <Bt onClick={handleChangeChildTab} tab={1} color={childTab === 1 ? 'gradient' : 'simple'}>
                                Đã cho ý kiến
                            </Bt>
                            <Bt onClick={handleChangeChildTab} tab={0} color={childTab === 0 ? 'gradient' : 'simple'}>
                                Chờ cho ý kiến
                            </Bt>
                        </>
                    )} */}
          {tab === 'signer' && (
            <>
              <Bt onClick={handleChangeChildTab} tab={1} color={childTab === 1 ? 'gradient' : 'simple'}>
                {/* Đã ký */}
                Đã phê duyệt
              </Bt>
              <Bt onClick={handleChangeChildTab} tab={0} color={childTab === 0 ? 'gradient' : 'simple'}>
                {/* Chờ ký */}
                Chờ phê duyệt
              </Bt>
            </>
          )}
        </Grid>
      </Grid>

      {childTab === 0 ? (
        <>
          {tab === 'plan' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                //  // showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  stage: 'processing',
                  typeCalendar,
                  processors: profile._id,
                }}
                code="OrganizationPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/organizationPlan/${row._id}`,
                    state: 'view',
                  });
                }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push(`/PlanWorking/organizationPlan/${row._id}`);
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'viewer' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                //  // showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  views: profile._id,
                  typeCalendar,
                }}
                code="OrganizationPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/organizationPlan/${row._id}`,
                    state: 'view',
                  });
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push(`/PlanWorking/organizationPlan/${row._id}`);
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'commented' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                //  // showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  // stage: "command",
                  typeCalendar,
                  commander: profile._id,
                }}
                code="OrganizationPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/organizationPlan/${row._id}`,
                    state: 'view',
                  });
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push(`/PlanWorking/organizationPlan/${row._id}`);
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'comment' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                //  // showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  stage: 'command',
                  typeCalendar,
                  processors: profile && profile._id,
                }}
                code="OrganizationPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/organizationPlan/${row._id}`,
                    state: 'view',
                  });
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push(`/PlanWorking/organizationPlan/${row._id}`);
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'signer' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                //  // showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  stage: { $ne: 'sign' },
                  typeCalendar,
                  processors: profile._id,
                }}
                code="OrganizationPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/organizationPlan/${row._id}`,
                    state: 'view',
                  });
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push(`/PlanWorking/organizationPlan/${row._id}`);
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'enfor' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                // showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  stage: 'sign',
                  typeCalendar,
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                code="OrganizationPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/organizationPlan/${row._id}`,
                    state: 'view',
                  });
                }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push(`/PlanWorking/organizationPlan/${row._id}`);
                }}
                exportPlan={!errorDepartment}
                handleExportData={() => {
                  // organizationUnit
                  setDepartmentSelect(departmentSelectDefault);
                  setOpenDialogExport(true);
                  setStartDate(moment());
                  setEndDate(moment());
                  setDisableBtn(false);
                  // ()=>handleExportData()
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
        </>
      ) : null}

      {childTab === 1 ? (
        <>
          {tab === 'plan' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                // showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  processeds: profile._id,
                  typeCalendar,
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                code="OrganizationPlan"
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/organizationPlan/${row._id}`,
                    state: 'view',
                  });
                }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push(`/PlanWorking/organizationPlan/${row._id}`);
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'commented' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                // showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  commandeds: profile._id,
                  typeCalendar,
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                code="OrganizationPlan"
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/organizationPlan/${row._id}`,
                    state: 'view',
                  });
                }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push(`/PlanWorking/organizationPlan/${row._id}`);
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'comment' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                // showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  commanding: profile._id,
                  typeCalendar,
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                code="OrganizationPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/organizationPlan/${row._id}`,
                    state: 'view',
                  });
                }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push(`/PlanWorking/organizationPlan/${row._id}`);
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'signer' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                // showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  signBy: profile._id,
                  typeCalendar,
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                code="OrganizationPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/organizationPlan/${row._id}`,
                    state: 'view',
                  });
                }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push(`/PlanWorking/organizationPlan/${row._id}`);
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
        </>
      ) : null}

      <DocumentAssignModal
        open={openProcess}
        docIds={selectedPlan}
        processType={processType}
        template={ID}
        childTemplate={templatesSelected}
        onClose={handleClose}
        profile={profile}
        typeCalendar={1}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => reloadState()}
        role={tab}
        unit={unit}
      />
      <PlanView
        open={openCommand}
        docIds={selectedPlan}
        onClose={handleClose}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setOpenCommand(false);
          reloadState();
        }}
        profile={profile}
      />
      <PlanSign
        open={openSign}
        docIds={selectedPlan}
        onClose={handleClose}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setOpenSign(false);
          reloadState();
        }}
        profile={profile}
      />

      <ReturnDocs
        open={openReturn}
        docIds={selectedPlan}
        type={returnType}
        template={templates}
        childTemplate={templatesSelected}
        role={tab}
        processeds={detailPlan ? detailPlan.processeds : []}
        onClose={handleClose}
        onChangeSnackbar={onChangeSnackbar}
        onSuccess={() => {
          setReturnType('');
          setCanView(false);
          setSelectedPlan([]);
          setResponseDialog(null);
          setOpenReturn(false);
        }}
      />

      <Dialog
        open={openDialogExport}
        onClose={() => setOpenDialogExport(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">{'Xuất dữ liệu kế hoạch đơn vị'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item md={12} container spacing={8}>
              <Grid item md={12}>
                <CustomInputBase
                  onChange={e => {
                    console.log(e.target.value, 'e.target.value');
                    const value = e.target.value;
                    const newValue = listDepartment.find(it => it._id === value) || {};
                    setDepartmentSelect(newValue);
                  }}
                  select
                  value={departmentSelect && departmentSelect._id}
                  label="Đơn vị"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                >
                  {listDepartment.map(item => (
                    <MenuItem value={item._id} style={{ paddingLeft: item.level * 20 }}>
                      {item.title}
                    </MenuItem>
                  ))}
                </CustomInputBase>
              </Grid>
              <Grid item md={6}>
                <CustomDatePicker
                  label="Từ ngày"
                  value={startDate || null}
                  variant="outlined"
                  // InputProps={{ inputProps: { min: this.state.orderDate } }}
                  name="endDate"
                  margin="normal"
                  top="15px"
                  onChange={e => {
                    setStartDate(e);
                  }}
                  isClear={false}
                  style={{ width: '100%' }}
                  required={false}
                />
              </Grid>
              <Grid item md={6}>
                <CustomDatePicker
                  label="Đến ngày"
                  value={endDate || null}
                  variant="outlined"
                  // InputProps={{ inputProps: { min: this.state.orderDate } }}
                  name="endDate"
                  margin="normal"
                  top="15px"
                  onChange={e => {
                    setEndDate(e);
                  }}
                  isClear={false}
                  style={{ width: '100%' }}
                  required={false}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" autoFocus onClick={() => handleExportData()} disabled={disableBtn}>
            Đồng ý
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setOpenDialogExport(false)} disabled={disableBtn}>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withConnect,
  withStyles(styles),
)(PlanWorkingOrganization);
