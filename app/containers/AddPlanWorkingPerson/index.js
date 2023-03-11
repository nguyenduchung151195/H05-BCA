import React, { useState, useEffect, useCallback } from 'react';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { changeSnackbar } from '../Dashboard/actions';
import { connect } from 'react-redux';
import { Comment } from '../../components/LifetekUi';
import {
  Button,
  Paper,
  Typography,
  Grid,
  Tooltip,
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Menu,
  MenuItem,
  Fab,
} from '@material-ui/core';
import { Print as PrintUI } from '@material-ui/icons';
import CustomAppBar from 'components/CustomAppBar';
import CustomDatePicker from 'components/CustomDatePicker';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE, API_PLAN_WORKING, API_ROLE_APP } from '../../config/urlConfig';
import makeSelectDashboardPage, { makeSelectProfile } from '../../containers/Dashboard/selectors';
import request from '../../utils/request';
// import RemoveDialog from './RemoveDialog';
import styles from './styles';
import moment from 'moment';
import PlanSign from '../../components/PlanWorking/PlanSign';
import DocumentAssignModal from '../../components/PlanWorking';
import { getListData } from '../../utils/common';
import { fetchData, PrintContentTable } from '../../helper';

const INITIALDATA = {
  name: '',
  timeStart: moment().startOf('week'),
  timeEnd: moment().endOf('week'),
  planDetail: [],
};
function AddPlanWorkingPerson(props) {
  const { classes, onChangeSnackbar, profile } = props;
  const [errors, setErrors] = useState({});
  const id = props.match && props.match.params && props.match.params.id ? props.match.params.id : 'add';
  const [signed, setSigned] = useState(false);
  const [formData, setFormData] = useState(INITIALDATA);
  const [disableSave, setDisableSave] = useState(false);
  const [comentPlan, setComentPlan] = useState(false);
  const [checkCreatePerson, setCheckCreatePerson] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [processDialog, setProcessDialog] = useState(null);
  const [openProcess, setOpenProcess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [processType, setProcessType] = useState('');
  const [ID, setID] = useState(null);
  const [templatesSelected, setTemplatesSelected] = useState({});
  const [tab, setTab] = useState(localStorage.getItem('planWorkingPerson'));
  const [unit, setUnit] = useState(null);
  const [detailPlan, setDetailPlan] = useState({});
  const [inStream, setInStream] = useState(false);
  const [endFlow, setEndFlow] = useState(false);
  const [questioner, setQuestioner] = useState();
  const [firstIn, setFirstIn] = useState(true);
  const [count, setCount] = useState(0);
  const [role, setRole] = useState([]);
  const [openSign, setOpenSign] = useState(false);

  const thead = ['Thời gian', 'Nội dung', 'Địa điểm', 'Ghi chú', 'Kết quả thực hiện', 'Ghi chú kết quả thực hiện'];
  const handleGoBack = () => {
    props.history.push({
      pathname: '/PlanWorking/personWorking',
      childTab: props.location && props.location.childTab,
      tab: props.location && props.location.tab,
    });
  };
  const isValid = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return 'Cần nhập thông tin tên kế hoạch';
        return '';
      case 'timeStart':
        if (!value) return 'Cần nhập thông tin ngày bắt đầu';
        if (formData.timeEnd && moment(value).diff(moment(formData.timeEnd), 'day') > 0) {
          return 'Ngày bắt đầu không được lớn hơn ngày kết thúc';
        }
        return '';
      case 'timeEnd':
        if (!value) return 'Cần nhập thông tin ngày kết thúc';
        if (formData.timeStart && moment(value).diff(moment(formData.timeStart), 'day') < 0) {
          return 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu';
        }
        return '';
    }
  };
  const checkValidForm = useCallback(
    data => {
      let fields = ['name', 'timeStart', 'timeEnd'];
      let errors = {};
      fields.forEach(f => {
        errors[f] = isValid(f, data[f]);
      });
      if (Object.values(errors).every(x => x === '')) {
        return true;
      } else {
        let fieldErrors = Object.keys(errors);
        let message = fieldErrors && fieldErrors.reduce((result, el) => (result += el ? (errors[el] ? errors[el] + ',' : '') : ''), '');
        onChangeSnackbar({ variant: 'error', message, status: true });
        setErrors(errors);
        return false;
      }
    },
    [formData.name, formData.timeEnd, formData.timeStart],
  );

  const handleSave = useCallback(
    () => {
      try {
        let body = { ...formData, typeCalendar: 2 };
        if (checkValidForm(body)) {
          setDisableSave(true);
          let url = id !== 'add' ? `${API_PLAN_WORKING}/${id}` : `${API_PLAN_WORKING}`;
          const message = id && id !== 'add'? 'Cập nhật kế hoạch cá nhân thành công' : 'Thêm mới kế hoạch cá nhân thành công';
          const messageError = id && id !== 'add' ? 'Cập nhật kế hoạch cá nhân thất bại' : 'Thêm mới kế hoạch cá nhân thất bại';
          request(url, {
            method: id !== 'add' ? 'PUT' : 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })
            .then(res => {
              setDisableSave(true);
              if (res.status === 0) {
                setDisableSave(false);
                return onChangeSnackbar({ variant: 'error', message: res.message || 'Thao tác thất bại', status: true });
              } else onChangeSnackbar({ variant: 'success', message, status: true });
              if (res) {
                //console.log(res);
                handleGoBack();
              }
            })
            .catch(error => {
              setDisableSave(false);
              onChangeSnackbar({ variant: 'error', message: error.message || messageError, status: true });
            });
        }
      } catch (error) {
        setDisableSave(false);
        //console.log(error, 'error');
      }
    },
    [formData],
  );

  const handleChangeValue = useCallback(
    e => {
      const { name, value } = e.target;
      setFormData(pre => ({ ...pre, [name]: value }));
    },
    [formData.name],
  );

  const handleChangeDateValue = (e, _name, _value) => {
    const name = e && e.target ? e.target.name : _name;
    const value = e && e.target ? e.target.value : _value;
    const message = isValid(name, value);
    if (name === 'timeStart') {
      setCount(count + 1);
      setFirstIn(true);
    } else if (name === 'timeEnd' && count === 0) {
      // console.log(count);
      setFirstIn(false);
    } else if (name === 'timeEnd' && count !== 0) {
      // console.log(count);
      setFirstIn(true);
    }
    if (message === '') {
      setFormData(pre => ({ ...pre, [name]: value }));
    } else {
      onChangeSnackbar({ variant: 'error', message, status: true });
    }
  };

  const handleChangeValueChild = (e, index) => {
    const { name, value } = e.target;
    let planDetail = [...formData.planDetail];
    planDetail[index] = {
      ...planDetail[index],
      [name]: value,
    };

    setFormData(pre => ({ ...pre, planDetail }));
  };

  const getDataInWeek = useCallback(
    () => {
      let rangeTime = moment(formData.timeEnd).diff(moment(formData.timeStart), 'day');
      // if (firstIn === true) {
      //   rangeTime = moment(formData.timeEnd).diff(moment(formData.timeStart), 'day');
      // } else {
      //   rangeTime = moment(formData.timeEnd).diff(moment(formData.timeStart), 'day') + 1;
      // }
      let data = [];
      for (let i = 0; i <= rangeTime; i++) {
        data.push({
          time: moment(formData.timeStart).add(i, 'day'),
          content: '',
          address: '',
          note: '',
          result: '',
          comment: '',
        });
      }
      if (formData.planDetail && formData.planDetail.length > 0) {
        formData.planDetail.map(plan => {
          let index = data.findIndex(f => moment(f.time).format('DD/MM/YYYY') === moment(plan.time).format('DD/MM/YYYY'));
          if (index !== -1) {
            data[index] = plan;
          }
        });
      }
      setFormData(pre => ({ ...pre, planDetail: [...data] }));
    },
    [formData],
  );

  useEffect(
    () => {
      if (formData && formData.timeStart && formData.timeEnd) {
        getDataInWeek();
      }
    },
    [formData.timeStart, formData.timeEnd],
  );

  useEffect(() => {
    getListData(`${API_DOCUMENT_PROCESS_TEMPLATE_ACTIVE}/planWorkingPerson`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res) {
        if (res._id) setID(res._id);
        setTemplates([{ ...res }]);
        checkChildren([{ ...res }]);
        customTemplate({ role: props.profile.roleGroupSource, childrens: res.children, type: props.profile.type });
      } else {
        onChangeSnackbar({ variant: 'error', message: 'Vui lòng kích hoạt luồng xử lý', status: true });
      }
    });
  }, []);

  const handleClose = () => {
    setProcessDialog(null);
    setOpenProcess(false);
    setSelectedPlan([]);
  };

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

  useEffect(
    () => {
      if (id && id !== 'add') {
        request(`${API_PLAN_WORKING}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            if (res) {
              setDetailPlan(res);
              setFormData({ ...res });
              setSelectedPlan([res._id]);
              if (res.signBy && Array.isArray(res.signBy) && res.signBy.length > 0) setSigned(true);
              setCheckCreatePerson(profile && res && res.createdBy && res.createdBy.employeeId === profile._id);
            }
          })
          .catch(error => {
            onChangeSnackbar({ variant: 'success', message: error, status: false });
          });
      }
    },
    [id],
  );

  const getDayInWeek = (value, index) => {
    let day = value && moment(value).format('ddd');
    switch (day) {
      case 'T2':
        return 'Thứ hai';
      case 'T3':
        return 'Thứ ba';
      case 'T4':
        return 'Thứ tư';
      case 'T5':
        return 'Thứ năm';
      case 'T6':
        return 'Thứ sáu';
      case 'T7':
        return 'Thứ bảy';
      case 'CN':
        return 'Chủ nhật';
    }
  };
  const handleTypeChange = useCallback(
    (value, name) => {
      setFormData(pre => ({ ...pre, [name]: moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD') }));
    },
    [formData.timeStart, formData.timeEnd],
  );

  const keyPress = (event, index) => {
    let planDetail = [...formData.planDetail];
    let content = planDetail[index].content;
    if (event.keyCode === 13) {
      planDetail[index] = {
        ...planDetail[index],
        content: content + '\n' + '-',
      };
      setFormData(pre => ({ ...pre, planDetail }));
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

  const handleSelectTemplate = (bool, temp, type) => {
    setUnit(null);
    if (temp && temp.unit) {
      setUnit(temp.unit);
    }
    setProcessType(type);
    setTemplatesSelected(temp);
    setOpenProcess(bool);
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
    fetchData(`${API_ROLE_APP}/PersonPlan/${profile._id}`).then(res => {
      const newBusinessRole = {};
      const { roles } = res;
      const code = 'BUSSINES';

      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code);
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
      setRole(newBusinessRole);
    });
  }, []);
  const isEndFlow = formData && formData.children && checkEndFlow(formData.children);
  const canSign = role && role.plan && role.plan.sign;
  const childTab = props.location.childTab
  return (
    <>
      <Paper style={{ padding: 20 }}>
        <CustomAppBar
          title={props.location.state === 'view' ? 'Chi tiết kế hoạch' : id !== 'add' ? 'Cập nhật kế hoạch  ' : 'Thêm mới kế hoạch '}
          onGoBack={handleGoBack}
          disableAdd
          moreButtons={
            // signed === false ||
            <>
              {props.location && props.location.typeList === 'plan' ? (
                <div style={{ marginRight: 10, display: 'flex', justifyContent: 'space-around' }}>
                  <Button variant="outlined" color="inherit" onClick={e => setProcessDialog(e.currentTarget)} style={{ marginRight: 10 }}>
                    Chuyển xử lý
                  </Button>
                </div>
              ) : null}
              {props.location && props.location.typeList === 'enfor' && props.location.childTab === 0 ? (
                <div style={{ marginRight: 10, display: 'flex', justifyContent: 'space-around' }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      setComentPlan(true);
                      setQuestioner(profile && profile._id);
                    }}
                    style={{ marginRight: 10 }}
                  >
                    Yêu cầu nhận xét
                  </Button>
                </div>
              ) : null}
              {id === 'add' ||
                (props.location &&
                  ((props.location.typeList === 'enfor' && !props.location.complete && !props.location.waitComent) ||
                    props.location.state === 'edit' ||
                    (props.location.typeList !== 'enfor' && props.location.state !== 'view'))) ? (
                <>
                  <div style={{ marginRight: 10, display: 'flex', justifyContent: 'space-around' }}>
                    <Button variant="outlined" color="inherit" onClick={handleSave} style={{ marginRight: 10 }} disabled={disableSave}>
                      Lưu
                    </Button>
                  </div>
                </>
              ) : null}
              {props.location && props.location.waitComent && checkCreatePerson === false ? (
                <div style={{ marginRight: 10, display: 'flex', justifyContent: 'space-around' }}>
                  <Button variant="outlined" color="inherit" onClick={() => setComentPlan(true)} style={{ marginRight: 10 }}>
                    Nhận xét
                  </Button>
                </div>
              ) : null}
             
              {
                tab === "processingPlan" && (!isEndFlow || canSign) && childTab === 0 ? <>
                <div style={{ marginRight: 10, display: 'flex', justifyContent: 'space-around' }}>
                  <Button variant="outlined" color="inherit"
                   onClick={() => {
                    setOpenSign(true)
                    setComentPlan(true)
                   } } 
                   style={{ marginRight: 10 }}>
                    Phê duyệt
                  </Button>
                </div>
                </> : null
              }
                
            </>
          }
        />
        <Typography variant="h6" align="start" style={{ margin: '10px 0', fontSize: 14, fontWeight: 'bold' }}>
          {id ? ' Thông tin kế hoạch ' : '  Thông tin kế hoạch'}
        </Typography>
        <Grid container md={12}>
          <Grid item container md={id && id !== 'add' ? 8 : 12} spacing={8} >
            
            <Grid item  md={12} container  spacing={8}>
            <Grid item md={12} container spacing={8}>
              <CustomInputBase
                label={'Tên kế hoạch công tác'}
                validators={['required']}
                required
                InputLabelProps={{ shrink: true }}
                value={formData.name}
                name="name"
                onBlur={handleTypeChange}
                onChange={handleChangeValue}
                fullWidth
                autoFocus
                error={errors.name}
                helperText={errors ? errors.name : ''}
                disabled={props.location.state === 'view' || signed === true}
              />
            </Grid>
            <Grid item md={6}>
              <CustomDatePicker
                // inputVariant="outlined"
                label={'Ngày bắt đầu'}
                // format="DD/MM/YYYY"
                value={formData.timeStart}
                name="timeStart"
                // onBlur={handleTypeChange}
                margin="dense"
                variant="outlined"
                onChange={e => handleChangeDateValue(null, 'timeStart', moment(e).format('YYYY-MM-DD'))}
                fullWidth
                error={errors && errors.timeStart}
                helperText={errors && errors.timeStart}
                required
                disabled={props.location.state === 'view' || signed === true}
              // checkedShowForm={checkShowForm.timeStart}
              // minDate={new Date()}
              />
            </Grid>
            <Grid item md={6}>
              <CustomDatePicker
                label={'Ngày kết thúc'}
                value={formData.timeEnd}
                name="timeEnd"
                margin="dense"
                onChange={e => handleChangeDateValue(null, 'timeEnd', moment(e).format('YYYY-MM-DD'))}
                // onBlur={handleTypeChange}
                error={errors && errors.timeEnd}
                helperText={errors && errors.timeEnd}
                required
                disabled={props.location.state === 'view' || signed === true}

              // checkedShowForm={checkShowForm.timeEnd}
              />
            </Grid>
            <Grid md={12} container spacing={8} alignItems="center">
              <Grid md={10}>
                <Typography variant="h6" align="start" style={{ margin: '20px 10px', fontSize: 14, fontWeight: 'bold' }}>
                  Kế hoạch chi tiết
                </Typography>

                {/* {id &&
                  id !== 'add' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div className="control-panel calendar-export" style={{ textAlign: 'right' }}>
                        <Fab
                          onClick={() => {
                            const { allTemplates } = props.dashboardPage;
                            console.log('allTemplates', allTemplates);
                            if (allTemplates) {
                              const foundPersonPlanTemplate = allTemplates.find(elm => elm.moduleCode === 'PersonPlan');
                              if (foundPersonPlanTemplate) {
                                return PrintContentTable({
                                  content: foundPersonPlanTemplate.content,
                                  data: formData,
                                  code: 'PersonPlan',
                                  isClone: false,
                                });
                              }
                            }
                            console.log('show notify here');
                          }}
                        >
                          <Tooltip title="IN">
                            <PrintUI />
                          </Tooltip>
                        </Fab>
                      </div>
                    </div>
                  )} */}
              </Grid>
              <Grid md={2}>
                {id &&
                  id !== 'add' && (
                    <Fab
                      onClick={() => {
                        const { allTemplates } = props.dashboardPage;
                        if (allTemplates) {
                          const foundPersonPlanTemplate = allTemplates.find(elm => elm.moduleCode === 'PersonPlan');
                          if (foundPersonPlanTemplate) {
                            return PrintContentTable({
                              content: foundPersonPlanTemplate.content,
                              data: formData,
                              code: 'PersonPlan',
                              isClone: false,
                            });
                          }
                        }
                      }}
                    >
                      <Tooltip title="IN">
                        <PrintUI />
                      </Tooltip>
                    </Fab>
                  )}
              </Grid>
            </Grid>
            <Grid item md={12}>
              <Table style={{ marginTop: 15 }}>
                <TableHead>
                  <TableRow className={classes.cell}>
                    {thead.map((th, index) => (
                      <TableCell style={{ width: index === 1 && 100 }} colSpan={index === 1 || index === 4 ? 3 : 1} className={classes.cellTh}>
                        {th}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData &&
                    formData.planDetail &&
                    formData.planDetail.map((plan, index) => {
                      return (
                        <TableRow className={classes.cell}>
                          <TableCell className={classes.cellTh}>
                            {' '}
                            {`${getDayInWeek(plan.time, index)}, ${moment(plan.time).format('DD/MM/YYYY')}`}
                          </TableCell>
                          <TableCell className={classes.cell} colSpan={3}>
                            {/* <CustomInputBase
                              rows={5}
                              multiline
                              label={' '}
                              value={plan.content}
                              name="content"
                              onKeyDown={e => keyPress(e, index)}
                              onChange={e => handleChangeValueChild(e, index)}
                              disabled={props.location.state === 'view' || signed === true}
                            /> */}
                            <textarea
                              name="content"
                              style={{ height: 'auto', width: '100%', fontFamily: 'sans-serif' }}
                              value={plan.content}
                              onChange={e => handleChangeValueChild(e, index)}
                              disabled={props.location.state === 'view' || signed === true}
                              rows={10}
                            >
                              {plan.content}
                            </textarea>
                          </TableCell>
                          <TableCell className={classes.cell} colSpan={1}>
                            {/* <CustomInputBase
                              rows={5}
                              multiline
                              label={' '}
                              value={plan.address}
                              name="address"
                              onChange={e => handleChangeValueChild(e, index)}
                              disabled={props.location.state === 'view' || signed === true}
                            /> */}
                            <textarea
                              name="address"
                              style={{ height: 'auto', width: '100%', fontFamily: 'sans-serif' }}
                              value={plan.address}
                              onChange={e => handleChangeValueChild(e, index)}
                              disabled={props.location.state === 'view' || signed === true}
                              rows={10}
                            >
                              {plan.address}
                            </textarea>
                          </TableCell>
                          <TableCell className={classes.cell} colSpan={1}>
                            {/* <CustomInputBase
                              rows={5}
                              multiline
                              label={' '}
                              value={plan.note}
                              name="note"
                              onChange={e => handleChangeValueChild(e, index)}
                              disabled={props.location.state === 'view' || signed === true}
                            /> */}
                            <textarea
                              name="note"
                              style={{ height: 'auto', width: '100%', fontFamily: 'sans-serif' }}
                              value={plan.note}
                              onChange={e => handleChangeValueChild(e, index)}
                              disabled={props.location.state === 'view' || signed === true}
                              rows={10}
                            >
                              {plan.note}
                            </textarea>
                          </TableCell>
                          <TableCell className={classes.cell} colSpan={3}>
                            {/* <CustomInputBase
                              rows={5}
                              multiline
                              label={' '}
                              value={plan.result}
                              name="result"
                              onChange={e => handleChangeValueChild(e, index)}
                              disabled={props.location.state === 'view' || signed === true}
                            /> */}
                            <textarea
                              name="result"
                              style={{ height: 'auto', width: '100%', fontFamily: 'sans-serif' }}
                              value={plan.result}
                              onChange={e => handleChangeValueChild(e, index)}
                              disabled={
                                id === 'add' ||
                                props.location.state === 'edit' ||
                                (props.location.state === 'view' && props.location.typeList === 'enfor' && !props.location.enforComplete
                                  ? false
                                  : true)
                              }
                              rows={10}
                            >
                              {plan.result}
                            </textarea>
                          </TableCell>
                          <TableCell className={classes.cell} colSpan={1}>
                            {/* <CustomInputBase
                              rows={5}
                              multiline
                              label={' '}
                              value={plan.comment}
                              name="comment"
                              onChange={e => handleChangeValueChild(e, index)}
                              disabled={props.location.state === 'view' || signed === true}
                            /> */}
                            <textarea
                              name="comment"
                              style={{ height: 'auto', width: '100%', fontFamily: 'sans-serif' }}
                              value={plan.comment}
                              onChange={e => handleChangeValueChild(e, index)}
                              disabled={
                                id === 'add' ||
                                props.location.state === 'edit' ||
                                (props.location.state === 'view' && props.location.typeList === 'enfor' && !props.location.enforComplete
                                  ? false
                                  : true)
                              }
                              rows={10}
                            >
                              {plan.comment}
                            </textarea>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Grid>
            </Grid>
            <Grid item  md={12} container >
             
            </Grid>
          </Grid>
          
          {id && id !== 'add' ? (
            <Grid item md={4} style={{ height: 'calc(100vh)', overflowY: 'auto' }}>
              <Comment
                profile={profile}
                code={'WorkingCalendar'}
                id={id}
                // viewOnly={currentTab !== 0 }
                viewOnly={false}
                disableLike
                revert
              />
            </Grid>
          ) : null}
        </Grid>
        <PlanSign
          open={comentPlan}
          docIds={[formData._id]}
          onClose={() => setComentPlan(false)}
          handleSave={handleSave}
          comentPlan={openSign ? false : comentPlan}
          onSuccess={() => {
            props.history.push({
              pathname: '/PlanWorking/personWorking',
              childTab: props.location && props.location.childTab,
              tab: props.location && props.location.tab,
            });
          }}
          onChangeSnackbar={onChangeSnackbar}
          tab={props.location && props.location.tab}
          childTab={props.location && props.location.childTab}
          questioner={questioner}
        />
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
          onSuccess={() => handleGoBack()}
          role={tab}
          unit={unit}
        />

        {/* <PlanSign
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
        /> */}
      </Paper>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  dashboardPage: makeSelectDashboardPage(),
});
function mapDispatchToProps(dispatch) {
  return {
    // mergeData: data => dispatch(mergeData(data)),
    // onAddExecutiveDocument: (query, cb) => {
    //     dispatch(addExecutiveDocument(query, cb));
    // },
    // onDeleteExecutiveDocument: ids => {
    //     dispatch(deleteExecutiveDocument(ids));
    // },
    // onUpdateExecutiveDocument: (data, cb) => {
    //     dispatch(updateExecutiveDocument(data, cb));
    // },
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
)(AddPlanWorkingPerson);
