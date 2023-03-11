/**
 *
 * MeetingPage
 *
 */

import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectMeetingPage, { makeSelectDashboardPage } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { makeSelectMiniActive } from '../Dashboard/selectors';
import { makeSelectProfile } from 'containers/Dashboard/selectors';
import { TextField, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { withStyles, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePickerCustom';
import { FormControl } from '@material-ui/core';
import ListSalary from '../../components/List/listSalary';

import { fetchData, flatChild } from '../../helper';
import { API_ROLE_APP, API_USERS, API_SALARY, API_SALARY_STATISTIC , API_ORIGANIZATION} from '../../config/urlConfig';
import { Grid } from '@material-ui/core';
import { Tabs, Tab, Button, Typography, Badge } from '@material-ui/core';
import ListPage from 'components/List';
import NumberFormat from 'react-number-format';
import CustomInputBase from '../../components/Input/CustomInputBase';
import moment from 'moment'
import { Autocomplete } from 'components/LifetekUi';
import { addSalary } from './actions';
import { updateSalary } from './actions';
import { changeSnackbar } from '../../containers/Dashboard/actions';
import Buttons from 'components/CustomButtons/Button';

function Bt(props) {
  return (
    <Buttons
      // color={props.tab === tab ? 'gradient' : 'simple'}
      color={props.color}
      right
      round
      size="sm"
      onClick={props.onClick}
    >
      {props.children}
    </Buttons>
  );
}
export function TimeKeeping(props) {
  const [tab, setTab] = useState(0)
  const [tab1, setTab1] = useState(0)

  const [reload, setReload] = useState(new Date() * 1)

  const [dialogTimeKeeping, setDialogTimeKeeping] = useState(false)
  const [idEdit, setIdEdit] = useState("add")
  const [filter, setFilter] = useState({
    startDate: {
      $gte: moment()
        .startOf('days')
        .toISOString()
    },
    endDate: {
      $lte: moment()
        .endOf('days')
        .toISOString()
    }
  })

  const [currentItem, setCurrentItem] = useState()


  const [departments, setDepartments] = useState({})
  const [permison, setPermison] = useState({})
  const [listUser, setListUser] = useState([])
  const [listUserMission, setListUserMission] = useState([])
  const [listUserTraining, setListUserTraining] = useState([])
  const [listUserOnLeave, setListUserOnLeave] = useState([])
  const [listUserSickLeav, setListUserSickLeave] = useState([])
  const [listUserMaternityLeave, setListUserMaternityLeave] = useState([])
  const [listUserVacationLeave, setListUserVacationLeave] = useState([])
  const [listUserOtherLeave, setListUserOtherLeave] = useState([])


  const [localState, setLocalState] = useState({
    dateShow: moment(),
    mission: [],
    training: [],
    onLeave: [],
    sickLeave: [],
    maternityLeave: [],
    vacationLeave: [],
    otherLeave: []
  })
  const [startDate, setStartDate] = useState(moment().startOf('months'))
  const [endDate, setEndDate] = useState(moment())
  const [listDer, setListDer] = useState([]);





  useEffect(() => {
    fetchData(`${API_ROLE_APP}/Salary/${props && props.profile && props.profile._id}`).then((res) => {
      const code = 'BUSSINES';
      const { roles } = res;
      const foundRoleDepartment = Array.isArray(roles) && roles.find(it => it.code === code) || {};
      const { data } = foundRoleDepartment || []
      console.log(data, 'res')
      const muster = data.find(it => it.name === "muster") && data.find(it => it.name === "muster").data && data.find(it => it.name === "muster").data.view
      const statistic = data.find(it => it.name === "statistic") && data.find(it => it.name === "statistic").data && data.find(it => it.name === "statistic").data.view
      if (!muster) setTab(1)
      setPermison({ muster: muster, statistic: statistic })
    }).catch(() => {
      setPermison({})
    })
    fetchData(`${API_USERS}`, 'GET', null).then((res) => {
      console.log(res, 'res')
      setListUser(res.data)
      setListUserMission(res.data)
      setListUserTraining(res.data)
      setListUserOnLeave(res.data)
      setListUserSickLeave(res.data)
      setListUserMaternityLeave(res.data)
      setListUserVacationLeave(res.data)
      setListUserOtherLeave(res.data)
    }).catch(() => {
      setListUser([])
      setListUserMission([])
      setListUserTraining([])
      setListUserOnLeave([])
      setListUserSickLeave([])
      setListUserMaternityLeave([])
      setListUserVacationLeave([])
      setListUserOtherLeave([])
    })

  }, [])

  useEffect(() => {
    console.log(idEdit, "idEdit")

    if (idEdit === "add") {
      if (props.profile && props.profile.organizationUnit && props.profile.organizationUnit) {
        console.log(props.profile.organizationUnit.organizationUnitId, "props.profile.organizationUnit.organizationUnitId")
        setDepartments(props.profile.organizationUnit)
      } else {
        setDepartments({})
      }
    }

  }, [idEdit])
  useEffect(() => {
    const listUserExist1 = [
      ...localState.training, ...localState.onLeave,
      ...localState.sickLeave, ...localState.maternityLeave,
      ...localState.vacationLeave, ...localState.otherLeave
    ]
    const listUserExist2 = [
      ...localState.mission, ...localState.onLeave,
      ...localState.sickLeave, ...localState.maternityLeave,
      ...localState.vacationLeave, ...localState.otherLeave
    ]
    const listUserExist3 = [
      ...localState.mission, ...localState.training,
      ...localState.sickLeave, ...localState.maternityLeave,
      ...localState.vacationLeave, ...localState.otherLeave
    ]
    const listUserExist4 = [
      ...localState.mission, ...localState.training,
      ...localState.onLeave, ...localState.maternityLeave,
      ...localState.vacationLeave, ...localState.otherLeave
    ]
    const listUserExist5 = [

      ...localState.mission, ...localState.training,
      ...localState.onLeave, ...localState.sickLeave,
      ...localState.vacationLeave, ...localState.otherLeave
    ]
    const listUserExist6 = [
      ...localState.mission, ...localState.training,
      ...localState.onLeave, ...localState.sickLeave,
      ...localState.maternityLeave, ...localState.otherLeave
    ]
    const listUserExist7 = [
      ...localState.mission, ...localState.training,
      ...localState.onLeave, ...localState.sickLeave,
      ...localState.vacationLeave, ...localState.otherLeave
    ]
    const res1 = listUser.filter(item => !listUserExist1.includes(item));
    const res2 = listUser.filter(item => !listUserExist2.includes(item));
    const res3 = listUser.filter(item => !listUserExist3.includes(item));
    const res4 = listUser.filter(item => !listUserExist4.includes(item));
    const res5 = listUser.filter(item => !listUserExist5.includes(item));
    const res6 = listUser.filter(item => !listUserExist6.includes(item));
    const res7 = listUser.filter(item => !listUserExist7.includes(item));
    setListUserMission(res1)
    setListUserTraining(res2)
    setListUserOnLeave(res3)
    setListUserSickLeave(res4)
    setListUserMaternityLeave(res5)
    setListUserVacationLeave(res6)
    setListUserOtherLeave(res7)
  }, [localState])
  const handleChangeTab = (e, tab) => {

    setTab(tab)
  }
  const handleAddSalary = (stage) => {
    if (!localState.count) {
      props.onChangeSnackbar && props.onChangeSnackbar({ variant: 'error', message: 'Tổng sĩ số không hợp lệ!', status: true });
      return;
    }
    const { mission, training, onLeave, sickLeave, maternityLeave, vacationLeave, otherLeave } = localState
    const missionClone = mission.map((el) => el._id)
    const trainingClone = training.map((el) => el._id)
    const onLeaveClone = onLeave.map((el) => el._id)
    const sickLeaveClone = sickLeave.map((el) => el._id)
    const maternityLeaveClone = maternityLeave.map((el) => el._id)
    const vacationLeaveClone = vacationLeave.map((el) => el._id)
    const otherLeaveClone = otherLeave.map((el) => el._id)
    const body = {
      ...localState,
      dateShow: moment(localState.dateShow).format("YYYY-MM-DD"),
      organizationUnit: departments && departments.organizationUnitId,
      mission: missionClone,
      training: trainingClone,
      onLeave: onLeaveClone,
      sickLeave: sickLeaveClone,
      maternityLeave: maternityLeaveClone,
      vacationLeave: vacationLeaveClone,
      otherLeave: otherLeaveClone,
      stage
    }
    if (idEdit === "add") {
      props.addSalary && props.addSalary(body, handleCloseDialog)

    } else {
      props.updateSalary && props.updateSalary(body, idEdit, handleCloseDialog)
    }

  }
  const handleCloseDialog = () => {
    setReload(new Date() * 1)
    setDialogTimeKeeping(false)
    setIdEdit(false)
    handleGetCurrentItem()
    setLocalState({
      dateShow: moment(),
      mission: [],
      training: [],
      onLeave: [],
      sickLeave: [],
      maternityLeave: [],
      vacationLeave: [],
      otherLeave: []
    })
  }
  const handleGetCurrentItem = (item) => {
    if (item) {
      const { originItem } = item

      const missionClone = listUser.filter((item) => {
        return originItem.mission.includes(item._id);
      })
      const trainingClone = listUser.filter((item) => {
        return originItem.training.includes(item._id);
      })
      const onLeaveClone = listUser.filter((item) => {
        return originItem.onLeave.includes(item._id);
      })
      const sickLeaveClone = listUser.filter((item) => {
        return originItem.sickLeave.includes(item._id);
      })
      const maternityLeaveClone = listUser.filter((item) => {
        return originItem.maternityLeave.includes(item._id);
      })
      const vacationLeaveClone = listUser.filter((item) => {
        return originItem.vacationLeave.includes(item._id);
      })
      const otherLeaveClone = listUser.filter((item) => {
        return originItem.otherLeave.includes(item._id);
      })
      setLocalState({
        dateShow: originItem.dateShow || null,
        count: originItem.count || 0,
        mission: missionClone || [],
        training: trainingClone || [],
        onLeave: onLeaveClone || [],
        sickLeave: sickLeaveClone || [],
        maternityLeave: maternityLeaveClone || [],
        vacationLeave: vacationLeaveClone || [],
        otherLeave: otherLeaveClone || [],
      })
      setDepartments({
        name: originItem && originItem.organizationUnit && originItem.organizationUnit.name,
        organizationUnitId: originItem && originItem.organizationUnit && originItem.organizationUnit._id
      })

    } else {
      setLocalState({
        dateShow: moment(),
        mission: [],
        training: [],
        onLeave: [],
        sickLeave: [],
        maternityLeave: [],
        vacationLeave: [],
        otherLeave: []
      })
      setDepartments({})
    }
    console.log(item)
  }
  useEffect(() => {
    fetchData(API_ORIGANIZATION).then(res => {
      const flattedDepartment = flatChild(res);
      setListDer(flattedDepartment);
    });
  }, []);
  const customFunction = (data, parent, exportFile) => {
    console.log(data, 'data')
    if (Object.keys(parent).length === 0) return []
    if (Array.isArray(data) && data.length) {
      let dataClone = [
        {
          ...parent,
          maternityLeave: exportFile ? parent.maternityLeave : <p style={{ fontWeight: "bold" }}>{parent.maternityLeave}</p>,
          mission: exportFile ? parent.mission : <p style={{ fontWeight: "bold" }}>{parent.mission}</p>,
          onLeave: exportFile ? parent.onLeave : <p style={{ fontWeight: "bold" }}>{parent.onLeave}</p>,
          otherLeave: exportFile ? parent.otherLeave : <p style={{ fontWeight: "bold" }}>{parent.otherLeave}</p>,
          sickLeave: exportFile ? parent.sickLeave : <p style={{ fontWeight: "bold" }}>{parent.sickLeave}</p>,
          training: exportFile ? parent.training : <p style={{ fontWeight: "bold" }}>{parent.training}</p>,
          vacationLeave: exportFile ? parent.vacationLeave : <p style={{ fontWeight: "bold" }}>{parent.vacationLeave}</p>,
          acount: exportFile ? parent.count : <p style={{ fontWeight: "bold" }}>{parent.count}</p>,
          dateCommon: exportFile ? "Tổng" : <p style={{ fontWeight: "bold" }}>Tổng</p>
        }
      ]
      data.map((el) => {
        let dateCommon = el.dateCommon
        if (el && el.units && Array.isArray(el.units) && el.units.length) {
          const unit = el.units
          let newUnit = []
          console.log(unit, "unit", listDer)
          listDer &&
          Array.isArray(listDer) &&
          listDer.length > 0 &&
          listDer.map(el => {
            unit.map(ell => {
              if (el._id && ell.orgId && el._id === ell.orgId ) {
                
              // if (el.title && ell.orgName && el.title === ell.orgName ) {
                newUnit.push(ell)
                console.log(ell, 'ell')
                // data.push(ell);
              }
            });
          });





          // for (let idx = 0; idx < el.units.length; idx++) {
          //   dataClone.push({
          //     ...el.units[idx],
          //     acount: el.units[idx].count,
          //     orgName: exportFile ? el.units[idx] && el.units[idx].orgName || "" : <p style={{ marginLeft: (el.units[idx] && el.units[idx].level || 0) * 10 }}>{el.units[idx] && el.units[idx].orgName || ""}</p>,
          //     dateCommon: idx === 0 ? dateCommon : ""
          //   })
          // }

          console.log(newUnit, 'newUnit')
          for (let idx = 0; idx < newUnit.length; idx++) {
            dataClone.push({
              ...newUnit[idx],
              acount: newUnit[idx].count,
              orgName: exportFile ? newUnit[idx] && newUnit[idx].orgName || "" : <p style={{ marginLeft: (newUnit[idx] && newUnit[idx].level || 0) * 10 }}>{newUnit[idx] && newUnit[idx].orgName || ""}</p>,
              dateCommon: idx === 0 ? dateCommon : ""
            })
          }
        }
      })
      console.log(dataClone, 'dataClone')
      return dataClone || []

    }
    return []
  }

  const customDataExport = data => {
    let dataa = []
    console.log(data, 'data')
    data.map((el) => {
      dataa.push({
        ...el,
        'organizationUnit.name': el.organizationUnit && el.organizationUnit.name,
        dateShow: el.dateShow && moment(el.dateShow).format("DD/MM/YYYY") || ""
      })

    })
    return dataa || []
  };
  return (
    <>
      <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example" variant="scrollable" indicatorColor="primary">
        {
          permison.muster && <Tab
            // value={role ? getValueTabByRole(role) : ''}
            value={0}
            label={
              <Badge color="primary" badgeContent="0">
                <Typography style={{ fontSize: 12, fontWeight: 600 }}>Báo cáo quân số</Typography>
              </Badge>
            }
          />
        }
        {
          permison.statistic && <Tab
            // value={role ? getValueTabByRole(role) : ''}
            value={1}
            label={
              <Badge color="primary" badgeContent="0">
                <Typography style={{ fontSize: 12, fontWeight: 600 }}>Thống kê quân số</Typography>
              </Badge>
            }
          />
        }
      </Tabs>
      {/* Báo cáo quân số */}
      {
        tab === 0 ?
          <>
            <Grid item md={12}>
              <Bt onClick={() => setTab1(1)} color={tab1 === 1 ? 'gradient' : 'simple'}>
                Đã chuyển
              </Bt>
              <Bt onClick={() => setTab1(0)} color={tab1 === 0 ? 'gradient' : 'simple'}>
                Lưu nháp
              </Bt>
            </Grid>
            {
              tab1 === 0 ? <ListPage
                disableViewConfig
                exportExcel
                disableExportExcell
                disableImport
                disableEmployee
                disableAdd
                settingBar={[
                  <Tooltip title="Thêm mới" onClick={() => {
                    setDialogTimeKeeping(true)
                    setIdEdit("add")
                  }}>
                    <Add style={{ color: 'white' }} />
                  </Tooltip>
                ]}
                reload={reload}
                code="Salary"
                apiUrl={API_SALARY}
                filter={{ stage: 1 }}
                // onRowClick={item => openTitleDialog(item._id, 'view', tab)}
                pointerCursor="pointer"
                // selectMultiple={false}
                notChangeApi
                disableMenuAction
                kanbanKey="type"
                mapFunction={(item) => {
                  console.log(item, 'item')
                  return {
                    ...item,
                    dateShow: item.dateShow ? moment(item.dateShow).format("DD/MM/YYYY") : "",
                    'organizationUnit.name': <p style={{ marginLeft: (item.level || 0) * 10 }}>{item['organizationUnit.name'] || ""}</p>,
                  }
                }}
                onEdit={(item) => {
                  handleGetCurrentItem(item)
                  setDialogTimeKeeping(true)
                  setIdEdit(item._id)
                }}
                customDataExport={customDataExport}
              // disableOneEdit
              /> : null
            }

            {
              tab1 === 1 ? <ListPage
                disableViewConfig
                exportExcel
                disableImport
                disableEmployee
                notChangeApi
                disableExportExcell
                disableAdd
                reload={reload}
                code="Salary"
                apiUrl={API_SALARY}
                pointerCursor="pointer"
                selectMultiple={false}
                kanbanKey="type"
                filter={{ stage: 2 }}
                mapFunction={(item) => {
                  return {
                    ...item,
                    dateShow: item.dateShow ? moment(item.dateShow).format("DD/MM/YYYY") : ""
                  }
                }}
                onRowClick={(item) => {
                  handleGetCurrentItem(item)
                  setDialogTimeKeeping(true)
                  setIdEdit("view")
                }}
                customDataExport={customDataExport}
                disableOneEdit
              /> : null
            }

          </> : null
      }
      {/* Thống kê quân số */}

      {
        tab === 1 ?
          <>

            <Grid item md={12} container spacing={8}>
              <Grid md={2}>
                <CustomDatePicker
                  label="Từ ngày"
                  value={startDate || null}
                  variant="outlined"
                  // InputProps={{ inputProps: { min: this.state.orderDate } }}
                  name="startDate"
                  margin="normal"
                  top='15px'
                  disableFuture
                  onChange={e => {
                    // setLocalState({ ...localState, dateShow: e })
                    let filterFake = filter || {}
                    delete filterFake.startDate
                    if (e) {
                      filterFake.startDate = {
                        $gte: moment(e)
                          .startOf('days')
                          .toISOString()
                      }
                      setStartDate(e)
                      setFilter(filterFake)
                    }
                    else {
                      setStartDate(null)
                      setFilter(filterFake)
                    }
                  }}
                  style={{ width: '100%' }}
                  required={false}
                // isClear={false}
                />
              </Grid>
              <Grid md={2} style={{ marginLeft: 5 }}>
                <CustomDatePicker
                  label="Đến ngày"
                  value={endDate || null}
                  variant="outlined"
                  // InputProps={{ inputProps: { min: this.state.orderDate } }}
                  name="startDate"
                  margin="normal"
                  top='15px'
                  disableFuture
                  onChange={e => {
                    let filterFake = filter || {}
                    delete filterFake.endDate
                    if (e) {
                      filterFake.endDate = {
                        $lte: moment(e)
                          .endOf('days')
                          .toISOString()
                      }
                      setEndDate(e)
                      setFilter(filterFake)
                    }
                    else {
                      setEndDate(null)
                      setFilter(filterFake)
                    }
                  }}
                  style={{ width: '100%' }}
                  required={false}
                // isClear={false}
                />
              </Grid>
            </Grid>
            <ListSalary
              // filterStartEnd="documentDate"
              withPagination
              notDelete
              noKanban
              disableSelect
              notChangeApi
              exportExcel
              disableImport
              disableAdd
              // reload={reloadPage}
              disableEmployee
              disableMenuAction
              code="Salary"
              // filter={filter ? { ...filter } : null}
              filter={{
                $and: [{
                  dateShow: {
                    $gte: startDate ? moment(moment(startDate)
                      .startOf('days')
                      .toISOString()).format("YYYY-MM-DD") : moment(moment()
                        .startOf('days')
                        .toISOString()).format("YYYY-MM-DD")
                  }
                }, {

                  dateShow: {
                    $lte: endDate ? moment(moment(endDate)
                      .endOf('days')
                      .toISOString()).format("YYYY-MM-DD") : moment(moment()
                        .endOf('days')
                        .toISOString()).format("YYYY-MM-DD")
                  }
                }]
              }}
              // employeeFilterKey="createdBy"
              customFunction={(data, parent) => customFunction(data, parent, false)}
              disableDot
              apiUrl={API_SALARY_STATISTIC}
              kanbanKey="type"
              customDataExport={(data, parent) => customFunction(data, parent, true)
              }
              disableViewConfig
              pointerCursor="pointer"
              height={'calc(100vh - 100px)'}
            // onCellClick={(column, row) => {
            //   if (column && column.name) {
            //     let col = `${column.name}Filter`;
            //     let filter =
            //       row && row.originItem && row.originItem[col] && Array.isArray(row.originItem[col]) && row.originItem[col][0]
            //         ? row.originItem[col][0]
            //         : null;
            //     if (filter) {
            //       setOpenDialog(true);
            //       setFilterDocs(filter.$match);
            //     } else {
            //       props.onChangeSnackbar({ variant: 'error', message: 'Đồng chí chọn sai trường dữ liệu, vui lòng chọn lại!', status: true });
            //     }
            //   }
            // }}
            // tree
            />
          </> : null
      }


      <Dialog onClose={() => {
        setDialogTimeKeeping(false)
        setIdEdit("add")
        handleGetCurrentItem()
        setLocalState({
          dateShow: moment(),
          mission: [],
          training: [],
          onLeave: [],
          sickLeave: [],
          maternityLeave: [],
          vacationLeave: [],
          otherLeave: []
        })
      }} aria-labelledby="customized-dialog-title" open={dialogTimeKeeping} maxWidth="lg">
        <DialogTitle id="customized-dialog-title" >
          {idEdit === "view" ? "Xem chi tiết báo cáo quân số" : idEdit === "add" ? 'Thêm mới báo cáo quân số' : 'Cập nhật báo cáo quân số'}
        </DialogTitle>
        <DialogContent >

          <Grid item md={12} container spacing={8}>
            <Grid item md={6}>
              {/* <DepartmentAndEmployee
                disabled
                // onChange={this.handleDepartmentAndEmployeeChange}
                labelDepartment={"Đơn vị"}
                disableEmployee
                department={departments}
                moduleCode="Salary"
                profile={props.profile}
              /> */}

              <TextField
                value={departments && departments.name}
                // onChange={props.handleChangeAtt(at.attributeId)}
                fullWidth
                disabled
                label={"Đơn vị"}
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />

            </Grid>
            <Grid item md={6} >
              <CustomDatePicker
                label="Ngày"
                value={localState.dateShow || null}
                variant="outlined"
                // InputProps={{ inputProps: { min: this.state.orderDate } }}
                name="startDate"
                margin="normal"
                top='12px'
                disableFuture
                onChange={e => {
                  setLocalState({ ...localState, dateShow: e })
                }}
                style={{ width: '100%' }}
                required={false}
                isClear={false}
              />
            </Grid>

            <Grid item md={6} style={{ marginTop: -10 }}>
              <FormControl error style={{ marginTop: 10 }} fullWidth>
                <NumberFormat
                  label={'Tổng sĩ số'}
                  customInput={CustomInputBase}
                  value={localState.count}
                  required
                  onChange={e => {
                    setLocalState({ ...localState, count: e.target.value })
                    // this.setState({ userAfkTime: e.target.value })
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={6}>

              <Autocomplete
                suggestions={listUserMission}
                value={localState.mission}
                name="mission"
                label="Công tác"
                isMulti
                optionLabel="name"
                optionValue="_id"
                checkedShowForm={true}
                onChange={value => {
                  console.log(value, "value")
                  setLocalState({ ...localState, mission: value || [] })
                  // if (value) {

                  //   const val = value.map((it) => it._id)
                  //   setLocalState({ ...localState, mission: val })
                  // } else {
                  //   setLocalState({ ...localState, mission: [] })
                  // }
                }}
              />
            </Grid>
            <Grid item md={6}>
              <Autocomplete
                suggestions={listUserTraining}
                value={localState.training}
                name="training"
                label="Đi học"
                isMulti
                optionLabel="name"
                checkedShowForm={true}
                onChange={value => {
                  setLocalState({ ...localState, training: value || [] })
                }}
              />
            </Grid>

            <Grid item md={6}>

              <Autocomplete
                suggestions={listUserOnLeave}
                value={localState.onLeave}
                name="onLeave"
                label="Nghỉ phép"
                isMulti
                optionLabel="name"
                checkedShowForm={true}
                onChange={value => {
                  setLocalState({ ...localState, onLeave: value || [] })
                }}
              />
              {/* <AsyncAutocomplete
                name="onLeave"
                label="Nghỉ phép"
                // onChange={value => this.handleChangeInput('approvedProgress', value)}
                url={API_USERS}
                isMulti
                value={localState.onLeave}
                onChange={value => {
                  if (value) {
                    const val = value.map((it) => it._id)
                    setLocalState({ ...localState, onLeave: val })
                  } else {
                    setLocalState({ ...localState, onLeave: [] })
                  }
                }}
              /> */}
            </Grid>

            <Grid item md={6}>
              {/* <AsyncAutocomplete
                name="sickLeave"
                label="Nghỉ ốm"
                // onChange={value => this.handleChangeInput('approvedProgress', value)}
                url={API_USERS}
                isMulti
                value={localState.sickLeave}
                onChange={value => {
                  if (value) {
                    const val = value.map((it) => it._id)
                    setLocalState({ ...localState, sickLeave: val })
                  } else {
                    setLocalState({ ...localState, sickLeave: [] })
                  }
                }}
              /> */}

              <Autocomplete
                suggestions={listUserSickLeav}
                value={localState.sickLeave}
                name="sickLeave"
                label="Nghỉ ốm"
                isMulti
                optionLabel="name"
                checkedShowForm={true}
                onChange={value => {
                  setLocalState({ ...localState, sickLeave: value || [] })
                }}
              />
            </Grid>

            <Grid item md={6}>
              {/* <AsyncAutocomplete
                name="maternityLeave"
                label="Nghỉ thai sản"
                // onChange={value => this.handleChangeInput('approvedProgress', value)}
                url={API_USERS}
                isMulti
                value={localState.maternityLeave}
                onChange={value => {
                  if (value) {
                    const val = value.map((it) => it._id)
                    setLocalState({ ...localState, maternityLeave: val })
                  } else {
                    setLocalState({ ...localState, maternityLeave: [] })
                  }
                }}
              /> */}

              <Autocomplete
                suggestions={listUserMaternityLeave}
                value={localState.maternityLeave}
                name="maternityLeave"
                label="Nghỉ thai sản"
                isMulti
                optionLabel="name"
                checkedShowForm={true}
                onChange={value => {
                  setLocalState({ ...localState, maternityLeave: value || [] })
                }}
              />
            </Grid>

            <Grid item md={6}>
              {/* <AsyncAutocomplete
                name="vacationLeave"
                label="Nghỉ chế độ"
                // onChange={value => this.handleChangeInput('approvedProgress', value)}
                url={API_USERS}
                isMulti
                value={localState.vacationLeave}
                onChange={value => {
                  if (value) {
                    const val = value.map((it) => it._id)
                    setLocalState({ ...localState, vacationLeave: val })
                  } else {
                    setLocalState({ ...localState, vacationLeave: [] })
                  }
                }}
              /> */}
              <Autocomplete
                suggestions={listUserVacationLeave}
                value={localState.vacationLeave}
                name="vacationLeave"
                label="Nghỉ chế độ"
                isMulti
                optionLabel="name"
                checkedShowForm={true}
                onChange={value => {
                  setLocalState({ ...localState, vacationLeave: value || [] })
                }}
              />
            </Grid>

            <Grid item md={6}>
              <Autocomplete
                suggestions={listUserOtherLeave}
                value={localState.otherLeave}
                name="otherLeave"
                label="Nghỉ khác"
                isMulti
                optionLabel="name"
                checkedShowForm={true}
                onChange={value => {
                  setLocalState({ ...localState, otherLeave: value || [] })
                }}
              />

              {/* <AsyncAutocomplete
                name="otherLeave"
                label="Nghỉ khác"
                // onChange={value => this.handleChangeInput('approvedProgress', value)}
                url={API_USERS}
                isMulti
                value={localState.otherLeave}
                onChange={value => {
                  if (value) {
                    const val = value.map((it) => it._id)
                    setLocalState({ ...localState, otherLeave: val })
                  } else {
                    setLocalState({ ...localState, otherLeave: [] })
                  }
                }}
              /> */}
            </Grid>
            <div style={{ height: 100 }}></div>
          </Grid>
        </DialogContent>
        <DialogActions>
          {
            idEdit !== "view" ? <>
              <Button
                onClick={() => {
                  handleAddSalary(1)
                }}
                variant="contained"
                color="primary"
              >
                Lưu
              </Button>

              <Button
                style={{ marginLeft: 5 }}
                onClick={() => {
                  handleAddSalary(2)

                }}
                variant="contained"
                color="primary"
              >
                Chuyển
              </Button>
            </> : null
          }

          <Button onClick={() => {
            setDialogTimeKeeping(false)
            setIdEdit("add")
            setLocalState({
              dateShow: moment(),
              mission: [],
              training: [],
              onLeave: [],
              sickLeave: [],
              maternityLeave: [],
              vacationLeave: [],
              otherLeave: []
            })
          }}
            variant="contained"
            color="secondary"
          >Hủy</Button>
        </DialogActions>
      </Dialog>
    </ >

  )
}

const mapStateToProps = createStructuredSelector({
  salary: makeSelectMeetingPage(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
  miniActive: makeSelectMiniActive(),

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    addSalary: (body, close) => {
      dispatch(addSalary(body, close));
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },

    updateSalary: (body, id, close) => {
      dispatch(updateSalary(body, id, close));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'TimeKeeping', reducer });
const withSaga = injectSaga({ key: 'TimeKeeping', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TimeKeeping);



