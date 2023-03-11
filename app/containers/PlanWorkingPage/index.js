import React, { useState, useEffect } from 'react';
import { SwipeableDrawer, Tab, Tabs } from '../../components/LifetekUi';
import ListPage from 'components/List';
import { Grid, Paper, withStyles, Fab, Menu, MenuItem, Badge } from '@material-ui/core';
import { Replay, Send, ArrowRight, ArrowLeft, ChatBubbleOutline } from '@material-ui/icons';
import Buttons from 'components/CustomButtons/Button';
import { getListData } from '../../utils/common';
import makeSelectDashboardPage, { makeSelectMiniActive, makeSelectProfile } from '../Dashboard/selectors';
import PlanView from '../../components/PlanWorking/PlanView';
import PlanSign from '../../components/PlanWorking/PlanSign';
import { API_PLAN_WORKING, API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE, API_ROLE_APP, COUNT_PLAN_PERSON, API_EXPORT_BY_TIME } from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styles from './styles';
import DocumentAssignModal from '../../components/PlanWorking';
import ReturnDocs from '../../components/PlanWorking';
import { fetchData, serialize } from '../../helper';
import moment from 'moment';
import { useCallback } from 'react';
import _ from 'lodash';
import { PrintContentTable } from '../../helper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePickerCustom';

function PlanWorkingPage(props) {
  const { onChangeSnackbar, profile } = props;
  const [tab, setTab] = useState(localStorage.getItem('planWorkingPerson') || 'plan');
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
  const [endFlow, setEndFlow] = useState(false);
  const [inStream, setInStream] = useState(false);
  const [screenComplete, setScreenComplete] = useState(null);
  const [processor, setProcessor] = useState([]);
  const [countPlan, setCountPlan] = useState({
    countPerson: null,
    countProcessors: null,
    countReceive: null,
  });
  const [questioner, setQuestioner] = useState();
  const [openDialogExport, setOpenDialogExport] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [stage, setStage] = useState('sign');

  const typeCalendar = 2;
  const handleChangeTab = value => {
    setTab(value);
    setChildTab(0);
    if(value !== tab)
    setCanView(false);

  };
  const handleChangeChildTab = value => {
    setChildTab(value);
  };
  const path = window.location.pathname;
  useEffect(() => {
    if (path === '/PlanWorking') {
      props.history.replace('/PlanWorking/personWorking');
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack');
    localStorage.removeItem('addWorkingScheduleCallback');
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');
    // return () => {
    //   localStorage.removeItem('planWorkingPerson');
    // };
  }, []);
  useEffect(
    () => {
      localStorage.setItem('planWorkingPerson', tab);
    },
    [tab],
  );

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

  const handleSelectPlan = useCallback(
    plan => {
      if (plan) {
        let result = plan.map(pl => pl._id);
        setSelectedPlan(result);
      } else setSelectedPlan([]);
    },
    [setSelectedPlan],
  );

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
    if (action === 'enfor') {
      setOpenSign(true);
      setQuestioner(profile && profile._id);
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
    setCanView(false);
  };

  const handleOpenDialog = (action, bool, type) => {
    if (action === 'process') {
      setOpenProcess(bool);
    }
    if (action === 'return') {
      setOpenReturn(bool);
    }
  };

  const mapFunction = item => {
    return {
      ...item,
      timeStart: moment(item.timeStart).format('DD/MM/YYYY'),
      timeEnd: moment(item.timeEnd).format('DD/MM/YYYY'),
      ['sendBy.name']: item.createdByName,
    };
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
        setSelectedPlan([]);
        setProcessDialog(null);
        setProcessType('');
      });
    setReload(new Date() * 1);
    console.log("setCanView")
    setCanView(false);
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
    if (props.location && props.location.tab && props.location.childTab) {
      setTab(props.location.tab);
      setChildTab(props.location.childTab);
    }
  }, []);

  useEffect(
    () => {
      if (selectedPlan.length > 0) {
        setCanView(true);
        getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/planWorkingPerson`).then(res => {
          if (res) {
            setTemplates([{ ...res }]);
            if (res._id) setID(res._id);
            checkChildren([{ ...res }]);
            customTemplate({ role: props.profile.roleGroupSource, childrens: res.children, type: props.profile.type });
            // const temp = [{ ...res }]
            // const arr = _.get(temp, '[0].children', [])
            // let newArr = arr.filter(e => e.code !== _.get(profile, 'roleGroupSource'))
            // if (arr.length !== newArr.length) {
            //     const extend = arr.find(e => e.code === _.get(profile, 'roleGroupSource')).children
            //     newArr = [...newArr, ...extend]
            //     temp[0].children = newArr
            //     console.log(temp, newArr)
            // }

            // let temp = customTemplate({ role: profile.roleGroupSource, childrens: res.children, type: profile.type });
            // if (temp && temp.templates && temp.templates) {
            //     temp = [{
            //         ...res,
            //         children: temp.templates
            //     }]
            //     setTemplates(temp)
            //     checkChildren(temp)
            // }
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
    fetchData(`${API_ROLE_APP}/PersonPlan/${profile._id}`).then(res => {
      const newBusinessRole = {};
      const { roles } = res;
      const code = 'BUSSINES';

      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
      setAllRoles(foundRoleDepartment);
      if (foundRoleDepartment) {
        const { data } = foundRoleDepartment;
        let check = false;
        if (data) {
          data.forEach(d => {
            newBusinessRole[d.name] = d.data;
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
      for (const key in newBusinessRole) {

        if(newBusinessRole[key] && newBusinessRole[key].view && checkFirst) {
          setTab(key)
          checkFirst= false
        }
      }
      setRole(newBusinessRole);
    });
  }, []);
const getCodeTab = code=>{
   switch (code) {
    case 'view':
      return "plan";
    case 'processor':
      return 'processingPlan';
    case 'sign':
      return 'enfor';
    case 'know':
      return ;
    default:
      break;
   }
}
  const getNameByTab = value => {
    switch (value) {
      case 'plan':
        return 'Kế hoạch';
      case 'viewer':
        return 'Nhận để biết';
      case 'comment':
        return 'Cho ý kiến';
      case 'commented':
        return 'Xin ý kiến';
      case 'signer':
        return 'Ký nhận';
      case 'enfor':
        return 'Thực thi';
      case 'processingPlan':
        return 'Kế hoạch cán bộ';
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
  useEffect(() => {
    let data = fetchData(COUNT_PLAN_PERSON).then(res => {
      setCountPlan(res);
    });
  }, []);

  useEffect(
    () => {
      if (role) {
        let tabs = Object.keys(role);
        let value = Object.values(role);
        if (tabs && tabs.length > 0) {
          tabs = tabs.map(
            (tab, index) =>
              value[index] &&
              value[index].view && {
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
  const customTemplate = ({ role, childrens, type = [], first = false }) => {
    if (role && childrens) {
      const child = childrens.find(f => f.code === role);
      if (child) {
        if (type.length && child.type && child.type !== '' && type.find(t => child.type === t)) {
          setTemplates(child.children);
        } else {
          if (first === false) {
            setTemplates(child.children);
          }
          for (const item of childrens) {
            if (item.children) {
              customTemplate({ role, childrens: item.children, type, first: true });
            }
          }
        }
      } else {
        for (const item of childrens) {
          if (item.children) {
            customTemplate({ role, childrens: item.children, type });
          }
        }
      }
    }
  };
  const checkChildren = obj => {
    let listEndFlow = [];
    const code = props.profile && props.profile.roleGroupSource;
    obj.forEach(subObj => {
      if (code === subObj.code) setInStream(true);
      if (subObj.hasOwnProperty('children') && subObj.children instanceof Array && subObj.children.length > 0) {
        checkChildren(subObj.children);
      } else {
        listEndFlow.push(subObj);
      }
    });
    for (let i = 0; i < listEndFlow.length; i++) {
      if (code === listEndFlow[i].code) {
        setEndFlow(true);
      }
    }
  };
  const isEndFlow = detailPlan && detailPlan.children && checkEndFlow(detailPlan.children);
  const canSign = role && role.plan && role.plan.sign;
  const canProcessor = role && role.plan && role.plan.processor;

  const countDocument = title => {
    switch (title) {
      case 'plan':
        return countPlan.countProcessors || 0;
      case 'processingPlan':
        return countPlan.countPerson || 0;
      case 'enfor':
        return countPlan.countReceive || 0;
      default:
        0;
    }
  };
  const handleExportData = async () => {
    setDisableBtn(true);
    const { allTemplates } = props.dashboardPage;

    // const diff = startDate.diff(endDate, 'days')
    const time = new Date(endDate) - new Date(startDate);
    if (time >= 0) {
      if (allTemplates) {
        const foundPersonPlanTemplate = allTemplates.find(elm => elm.moduleCode === 'PersonPlan');
        if (foundPersonPlanTemplate) {
          const filter = { timeStart: startDate.format('YYYY/MM/DD'), timeEnd: endDate.format('YYYY/MM/DD') };
          const query = serialize({ filter });
          // const data = await fetchData(`${API_EXPORT_BY_TIME}?${query}`)
          const data = await fetchData(
            `${API_EXPORT_BY_TIME}?timeStart=${startDate.format('YYYY/MM/DD')}&timeEnd=${endDate.format('YYYY/MM/DD')}&stage=${stage}`,
          );

          if (data && data.status) {
            if (data && data.dataReturn && Array.isArray(data.dataReturn) && data.dataReturn.length) {
              const formData = {
                planDetail: data.dataReturn,
                timeStart: startDate,
                timeEnd: endDate,
                'createdBy.name': props.profile && props.profile.name,
                name: 'KẾ HOẠCH CÁ NHÂN',
              };
              PrintContentTable({
                content: foundPersonPlanTemplate.content,
                data: formData,
                code: 'PersonPlan',
                isClone: false,
              });
            } else {
              onChangeSnackbar({ variant: 'warning', message: 'Không có kế hoạch các nhân trong khoảng thời gian này!', status: true });
            }

            setDisableBtn(false);
            setOpenDialogExport(false);
          } else {
            setDisableBtn(false);
            onChangeSnackbar({ variant: 'error', message: data.message || 'Lấy dữ liệu thất bại', status: true });
          }
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
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs>
          <Tabs value={tab} onChange={(e, v) => handleChangeTab(v)} aria-label="simple tabs example">
            {roleTabs &&
              roleTabs.length > 0 &&
              roleTabs.map((role, index) => (
                <Tab
                  value={role.title}
                  label={
                    <Badge color="primary" badgeContent={countDocument(role.title)} max={9999}>
                      {role.name}
                    </Badge>
                  }
                />
              ))}
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
            {canView &&
              tab === 'commented' && (
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
                      handleOpen && handleOpen(e, 'command');
                      return;
                    }}
                  >
                    Xin ý kiến {`(${detailPlan && detailPlan.processeds && detailPlan.processeds.name})`}
                  </span>
                </Fab>
              )}
            {canView &&
              tab === 'enfor' &&
              (!isEndFlow || canSign) && (
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
                      handleOpen && handleOpen(e, 'enfor');
                      return;
                    }}
                  >
                    Yêu cầu nhận xét
                  </span>
                </Fab>
              )}
             
            {canView &&
              tab !== 'enfor' &&
              childTab === 0 &&
              (!isEndFlow || canSign) && (
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
              {inStream === true &&
                Array.isArray(templates) &&
                templates.map(t => (
                  <>
                    <MenuItem
                      value={t.code}
                      onClick={() => {
                        handleSelectTemplate && handleSelectTemplate(true, t, 'flow');
                      }}
                    >
                      <span>Chuyển cho {t.name}</span>
                    </MenuItem>
                  </>
                ))}

              {inStream === false &&
                templates &&
                Array.isArray(templates) &&
                templates.map(t => (
                  <>
                    {t.children &&
                      t.children.length > 0 && (
                        <>
                          {t.children.map(item => {
                            return (
                              <MenuItem
                                value={item.code}
                                onClick={() => {
                                  handleSelectTemplate && handleSelectTemplate(true, item, 'flow');
                                }}
                              >
                                <span>Chuyển cho {item.name}</span>
                              </MenuItem>
                            );
                          })}
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
          {tab === 'processingPlan' && (
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
          {tab === 'commented' && (
            <>
              <Bt onClick={handleChangeChildTab} tab={1} color={childTab === 1 ? 'gradient' : 'simple'}>
                Đã xin ý kiến
              </Bt>
              <Bt onClick={handleChangeChildTab} tab={0} color={childTab === 0 ? 'gradient' : 'simple'}>
                Chờ xin ý kiến
              </Bt>
            </>
          )}
          {tab === 'comment' && (
            <>
              <Bt onClick={handleChangeChildTab} tab={1} color={childTab === 1 ? 'gradient' : 'simple'}>
                Đã cho ý kiến
              </Bt>
              <Bt onClick={handleChangeChildTab} tab={0} color={childTab === 0 ? 'gradient' : 'simple'}>
                Chờ cho ý kiến
              </Bt>
            </>
          )}
          {tab === 'signer' && (
            <>
              <Bt onClick={handleChangeChildTab} tab={1} color={childTab === 1 ? 'gradient' : 'simple'}>
                Đã ký
              </Bt>
              <Bt onClick={handleChangeChildTab} tab={0} color={childTab === 0 ? 'gradient' : 'simple'}>
                Chờ ký
              </Bt>
            </>
          )}
          {tab === 'enfor' && (
            <>
              <Bt onClick={handleChangeChildTab} tab={2} color={childTab === 2 ? 'gradient' : 'simple'}>
                Đã hoàn thành
              </Bt>
              <Bt onClick={handleChangeChildTab} tab={1} color={childTab === 1 ? 'gradient' : 'simple'}>
                Chờ nhận xét
              </Bt>
              <Bt onClick={handleChangeChildTab} tab={0} color={childTab === 0 ? 'gradient' : 'simple'}>
                Đang thực thi
              </Bt>
            </>
          )}
        </Grid>
      </Grid>
      {console.log(childTab, tab, 'tab')}
      {childTab === 0 ? (
        <>
          {tab === 'plan' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                // showDepartmentAndEmployeeFilter
                isPlanChild
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
                  ['createdBy.employeeId']: profile._id,
                  typeCalendar,
                  processors: profile._id,
                }}
                code="PersonPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'edit',
                    typeList: 'plan',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'plan',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}

          {/* đang xử lý công việc cán bộ */}
          {tab === 'processingPlan' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                // showDepartmentAndEmployeeFilter
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
                  ['createdBy.employeeId']: { $ne: profile._id },
                  processors: { $in: [profile._id] },
                  stage: 'processing',
                  typeCalendar,
                }}
                code="PersonPlan"
                reload={reload}
                disableAdd
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                pointerCursor="pointer"
                disableOneEdit
                // onEdit={row => {
                //   props.history.push({
                //     pathname: `/PlanWorking/personWorking/${row._id}`,
                //     state: 'edit'
                //   });
                // }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'processingPlan',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}

          {tab === 'viewer' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  typeCalendar,
                  views: profile._id,
                }}
                code="PersonPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'edit',
                    typeList: 'viewer',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'viewer',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'commented' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  typeCalendar,
                  stage: 'command',
                  processors: profile._id,
                }}
                code="PersonPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'edit',
                    typeList: 'commented',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'commented',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'comment' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  typeCalendar,
                  stage: 'commanding',
                  commander: profile._id,
                }}
                code="PersonPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'edit',
                    typeList: 'comment',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'comment',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'signer' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  typeCalendar,
                  stage: { $ne: 'sign' },
                  processors: profile._id,
                }}
                code="PersonPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'edit',
                    typeList: 'signer',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'signer',
                    childTab: childTab,
                    tab: tab,
                  });
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
                disableAdd
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                  setScreenComplete('enfor');
                  setProcessor(Array.isArray(val).length !== 0 && val[0].originItem && val[0].originItem.processors);
                }}
                filter={{
                  typeCalendar,
                  stage: 'sign',
                  'createdBy.employeeId': profile._id,
                }}
                code="PersonPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                disableOneEdit
                onEdit={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'edit',
                    typeList: 'enfor',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'enfor',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
                exportPlan
                handleExportData={() => {
                  setOpenDialogExport(true);
                  setStartDate(moment());
                  setEndDate(moment());
                  setDisableBtn(false);
                  setStage('sign');
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
                showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  ['createdBy.employeeId']: profile._id,
                  typeCalendar,
                  // stage: 'processeds',
                  processeds: profile._id,
                }}
                code="PersonPlan"
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                disableOneEdit
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                disableAdd
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'edit',
                    typeList: 'plan',
                    childTab: childTab,
                    tab: tab,
                  });
                }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'plan',
                    complete: true,
                    childTab: childTab,
                    tab: tab,
                  });
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {/* đã xử lý kế hoạch cán bộ */}
          {tab === 'processingPlan' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                // showDepartmentAndEmployeeFilter
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
                  ['createdBy.employeeId']: { $ne: profile._id },
                  processeds: { $in: [profile._id] },
                  stage: 'sign',
                }}
                code="PersonPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                disableAdd
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                // onEdit={row => {
                //   props.history.push({
                //     pathname: `/PlanWorking/personWorking/${row._id}`,
                //     state: 'edit'
                //   });
                // }}
                disableOneEdit
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'processingPlan',
                    complete: true,
                    childTab: childTab,
                    tab: tab,
                  });
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'commented' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  typeCalendar,
                  commanding: profile._id,
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                code="PersonPlan"
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'edit',
                    typeList: 'commented',
                  });
                }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'commented',
                    complete: true,
                    childTab: childTab,
                    tab: tab,
                  });
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'comment' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  typeCalendar,
                  commandeds: profile._id,
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                code="PersonPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'edit',
                    typeList: 'comment',
                  });
                }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'comment',
                    complete: true,
                    childTab: childTab,
                    tab: tab,
                  });
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
          {tab === 'signer' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                showDepartmentAndEmployeeFilter
                exportExcel
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                filter={{
                  typeCalendar,
                  signBy: profile._id,
                }}
                code="PersonPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                onEdit={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'edit',
                    typeList: 'signer',
                  });
                }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'signer',
                    complete: true,
                    childTab: childTab,
                    tab: tab,
                  });
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
                disableAdd
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  typeCalendar,
                  stage: 'enforcement',
                  processeds: { $in: [profile._id] },
                }}
                onSuccess={reloadState}
                onFinally={()=>setCanView(false)}
                code="PersonPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                disableOneEdit
                disableSelect
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                // onEdit={row => {
                //   props.history.push({
                //     pathname: `/PlanWorking/personWorking/${row._id}`,
                //     state: 'edit',
                //     typeList: 'enfor'
                //   });
                // }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'enfor',
                    waitComent: true,
                    childTab: childTab,
                    tab: tab,
                    enforComplete: true,
                  });
                }}
                exportPlan
                handleExportData={() => {
                  setOpenDialogExport(true);
                  setStartDate(moment());
                  setEndDate(moment());
                  setDisableBtn(false);
                  setStage('enforcement');
                }}
              />
              {/* { <Loading />} */}
            </Paper>
          ) : null}
        </>
      ) : null}
      {childTab === 2 ? (
        <>
          {tab === 'enfor' ? (
            <Paper style={{ position: 'relative' }}>
              <ListPage
                // showDepartmentAndEmployeeFilter
                exportExcel
                disableAdd
                kanban="ST15"
                getStateSelection={e => getStateSelection(e)}
                selectMultiple={false}
                onSelectCustomers={val => {
                  handleSelectPlan(val);
                }}
                filter={{
                  typeCalendar,
                  stage: 'complete',
                  'createdBy.employeeId': profile._id,
                }}
                code="PersonPlan"
                reload={reload}
                apiUrl={API_PLAN_WORKING}
                mapFunction={mapFunction}
                columnExtensions={[{ columnName: 'edit', width: 150 }]}
                className="mt-2"
                listMenus={[]}
                disableOneEdit
                disableSelect
                // onRowClick={item => {
                //     this.openTitleDialog(item._id,);
                // }}
                pointerCursor="pointer"
                // onEdit={row => {
                //   props.history.push({
                //     pathname: `/PlanWorking/personWorking/${row._id}`,
                //     state: 'edit',
                //     typeList: 'enfor'
                //   });
                // }}
                onRowClick={row => {
                  props.history.push({
                    pathname: `/PlanWorking/personWorking/${row._id}`,
                    state: 'view',
                    typeList: 'enfor',
                    complete: true,
                    enforComplete: true,
                    childTab: childTab,
                    tab: tab,
                  });
                }}
                exportPlan
                handleExportData={() => {
                  setOpenDialogExport(true);
                  setStartDate(moment());
                  setEndDate(moment());
                  setDisableBtn(false);
                  setStage('complete');
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
        typeCalendar={2}
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
        screenComplete={screenComplete}
        childTab={childTab}
        processors={processor}
        questioner={questioner}
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
        <DialogTitle id="alert-dialog-title">{'Xuất dữ liệu kế hoạch cá nhân'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid item md={12} container spacing={8}>
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
)(PlanWorkingPage);
