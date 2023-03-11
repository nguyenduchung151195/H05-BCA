import React, { useState, useEffect } from 'react';
import { Checkbox, MenuItem, Tooltip, Chip } from '@material-ui/core';
import { Add, Delete, Edit } from '@material-ui/icons';
import moment from 'moment';
import { API_MEETING } from 'config/urlConfig';
import RemoveDialog from './RemoveDialog';
import CustomInputBase from 'components/Input/CustomInputBase';
import { Typography, Paper, TextField, Grid, AsyncAutocomplete, Dialog } from 'components/LifetekUi';
import CustomDatePicker from 'components/CustomDatePicker';
import { getById, addCalenDetail, updateCalenDetail, deleteById } from 'utils/api/metting';
import NumberFormat from 'react-number-format';
import _ from 'lodash';

const formatDay = day => {
  switch (day) {
    case 0:
      return 'Chủ nhật';
    case 1:
      return 'Thứ hai';
    case 2:
      return 'Thứ ba';
    case 3:
      return 'Thứ tư';
    case 4:
      return 'Thứ năm';
    case 5:
      return 'Thứ sáu';
    case 6:
      return 'Thứ bảy';
  }
};

const CalendarDetail = props => {
  const { id, item, onChangeSnackbar, profile, disabled } = props;

  const [calenDetail, setCalenDetail] = useState([]);
  const [type, setType] = useState([]);
  const [openAddSchedule, setOpenAddSchedule] = useState();
  const [openRemoveSchedule, setOpenRemoveSchedule] = useState();
  const [deleteIndex, setDeleteIndex] = useState();
  const [errorTime, setErrorTime] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [messageErrorContent, setMessageErrorContent] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isIndexs, setIsIndexs] = useState();

  const query = {
    // // processors: profile._id,
    // stage: 'complete',
    // calendarId: id,
    filter: {
      // processors: profile._id,
      // stage: 'complete',
      calendarId: id,
    },
  };

  useEffect(() => {
    const dataSource = JSON.parse(localStorage.getItem('crmSource'));
    const dataValSource = dataSource && dataSource.find(item => item.code === 'S600');
    dataValSource && setType(dataValSource.data);

    getData();
  }, []);

  useEffect(
    () => {
      Array.isArray(calenDetail) && props.getData && props.getData(calenDetail);
    },
    [calenDetail],
  );

  useEffect(
    () => {
      props.reload && getData();
    },
    [props.reload],
  );

  const onSucess = async () => {
    setOpenAddSchedule(null);
  };

  const getData = async () => {
    const dataFm = JSON.parse(localStorage.getItem('workingScheduletab'));
    if (id && id !== 'add') {
      const res = await getById(query);
      if (Array.isArray(res)) {
        setCalenDetail(res);
        return;
      }

      if (dataFm && dataFm.tab && dataFm.tab === 2) {
        if (dataFm && dataFm.tabChild && dataFm.tabChild === 1) {
          const res = await getById({
            // processors: profile._id,
            publishBy: profile._id,
            calendarId: id,
          });
          if (Array.isArray(res)) {
            setCalenDetail(res);
          }
        } else {
          const res = await getById(query);
          if (Array.isArray(res)) {
            setCalenDetail(res);
          }
        }
      } else {
        const res = await getById({
          processors: profile._id,
          stage: 'processing',
          calendarId: id,
        });
        if (Array.isArray(res)) {
          setCalenDetail(res);
        }
      }
    }
  };
  const handleDeleteSchedule = async () => {
    if (!id || id === 'add') {
      setCalenDetail(calenDetail.map((arr, index) => (deleteIndex === index ? arr.filter(e => !e.checkMeet) : arr)).filter(e => e.length));
    } else {
      const selected = [];
      if (calenDetail && calenDetail.length) {
        calenDetail[deleteIndex].forEach(e => {
          if (e.checkMeet) selected.push(e._id);
        });
      }
      deleteById(selected).then(getData);
    }
    setOpenRemoveSchedule(false);
  };
  const handleAddSchedule = async () => {
    const DATE = 'DD/MM/YYYY';
    const { _id, calendarId = id, timeMeet, addressMeet, contentMeet, roomMetting, timeEndMeet, typeCalendar, time, updatePos, join, preparedBy } = openAddSchedule;
    if (errorTime === true && timeMeet !== undefined) {
      return onChangeSnackbar({ variant: 'error', message: 'Thời gian không hợp lệ, vui lòng nhập lại', status: true });
    } else {
      if (!time) return;

      const date = moment(time).format(DATE);
      // nếu có tg kết thúc thì lấy tg kết thúc, con không thì tính tg kết thúc của buổi đó
      // 'DD/MM/YYYY HH:mm:ss'
      let newBody = {
        calendarId,
        timeMeet: timeMeet,
        addressMeet: _.get(roomMetting, 'address', addressMeet),
        contentMeet: contentMeet,
        roomMetting: roomMetting,
        join: join,
        preparedBy: preparedBy,
        typeCalendar: typeCalendar,
        time: moment(time).toISOString(),
        timeStart: moment(`${moment(time).format('YYYY-MM-DD')} ${timeMeet && timeMeet.slice(0, 5)}`).toISOString(),
        timeEnd: moment(`${moment(time).format('YYYY-MM-DD')} ${timeMeet && timeMeet.slice(6, 11)}`).toISOString(),
      };
      const timeStart = moment(`${moment(time).format('YYYY-MM-DD')} ${timeMeet && timeMeet.slice(0, 5)}`).toISOString()

      let timeEnd = moment(`${moment(time).format('YYYY-MM-DD')} ${timeMeet && timeMeet.slice(6, 11)}`).toISOString()
      if(!timeEnd){
        console.log(timeEnd, "timeEnd")
        const hoursStart = timeMeet && timeMeet.slice(0, 2)
        console.log(hoursStart, 'hoursStart')
        if(hoursStart<12) {
          timeEnd = moment(`${moment(time).format('YYYY-MM-DD')} 12:00`).toISOString()
        }else {
          timeEnd = moment(`${moment(time).format('YYYY-MM-DD')} 23:59`).toISOString()
        }
        newBody= {
          ...newBody, 
          timeEnd
        }
      }
      console.log(newBody, 'newBody')
      if (!id || id === 'add') {
        if (!openAddSchedule.calendarId) {
          let added,
            result = [];
          calenDetail.forEach(carlen => {
            if (moment(carlen[0].time).format(DATE) === date) {
              added = true;
              result.push([...carlen, newBody]);
            } else result.push([...carlen]);
          });
          !added && result.push([newBody]);
          setCalenDetail(result);
          onSucess(result);
        } else {
          let result = [];
          calenDetail.map((carlen, index) => {
            // if (moment(carlen[0].time).format(DATE) === date) {
            if (index !== updatePos) {
              result.push(carlen);
            } else {
              let data = [];
              carlen.map((el, idx) => {
                if (idx === isIndexs) {
                  data.push(newBody);
                } else data.push(el);
              });
              result.push(data);
            }
            // result.push(

            //   carlen.map((e, i) => (i === updatePos ? { ...e, ...newBody } : e))
            // );
            // } else result.push([...carlen]);
          });
          setCalenDetail(result);
          onSucess(result);
        }
      } else {
        if (!_id) {
          addCalenDetail(newBody).then((res)=>{
            console.log(res, "res")
            if(res.status) {
              getData()
            }else {
              onChangeSnackbar({ variant: 'error', message: res.message || 'Thao tác thất bại', status: true });
            }
          });
          onSucess(newBody);
        } else {
          updateCalenDetail(_id, newBody).then((res)=>{
            console.log(res, "res")
            if(res.status) {
              getData()
            }else {
              onChangeSnackbar({ variant: 'error', message: res.message || 'Thao tác thất bại', status: true });
            }
          });
          onSucess();
        }
      }
    }
  };

  const getMaxDate = () => {
    let res = item.timeStart ? moment(item.timeStart) : moment();
    calenDetail.forEach(calen => {
      if (
        !moment(calen[0].time)
          .startOf('day')
          .isBefore(moment(res).startOf('day'))
      )
        res = moment(calen[0].time).add('day', 1);
    });
    return moment(res).toISOString();
  };
  const handleChangeTimeMeet = event => {
    setOpenAddSchedule({ ...openAddSchedule, timeMeet: event.target.value });
    let pos = -1;
    if (event && event.target && event.target.value) {
      pos = event.target.value.indexOf('-');
      if (pos !== -1) {
        const startTime = event.target.value.slice(0, pos);
        const endTime = event.target.value.slice(pos + 1);
        const format = 'hh:mm:ss';
        let res_startTime = moment(startTime, format),
          res_endTime = moment(endTime, format),
          beforeTime = moment('00:00:00', format),
          afterTime = moment('23:59:59', format);
        if (
          (res_startTime.isBetween(beforeTime, afterTime) || startTime.indexOf('_') === 0) &&
          (startTime.indexOf('_') === -1 || startTime.indexOf('_') === 0) &&
          (res_endTime.isBetween(beforeTime, afterTime) || endTime.indexOf('_') === 0) &&
          (endTime.indexOf('_') === -1 || endTime.indexOf('_') === 0) &&
          (res_endTime.diff(res_startTime, 'seconds') > 0 || startTime.indexOf('_') === 0 || endTime.indexOf('_') === 0)
        ) {
          setErrorTime(false);
        } else {
          setErrorTime(true);
        }
      }
    }
  };
  return (
    <>
      <Grid md={12} container spacing={8}>
        <Grid md={8}>
          <Typography variant="h6" align="start" style={{ marginTop: 20, fontSize: 14, fontWeight: 600 }}>
            Lịch chi tiết
          </Typography>
        </Grid>
        <Grid md={4} style={{ paddingTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
          {!disabled && (
            <span className="CustomIconList">
              <Tooltip title="Thêm mới" onClick={() => setOpenAddSchedule({ time: getMaxDate(), updateTime: true })}>
                <Add style={{ marginRight: 38, color: '#2196F3', cursor: 'pointer' }} />
              </Tooltip>
            </span>
          )}
        </Grid>
      </Grid>
      {calenDetail.map((item, index) => (
        <div style={{ border: '1px solid #c3c3c3', margin: 10 }}>
          <Grid md={12} container>
            <Grid md={8}>
              <p style={{ marginTop: 20, marginLeft: 30 }}>
                {`${formatDay(moment(item[0] && item[0].time).days())}, Ngày ${moment(item[0] && item[0].time).format('DD/MM/YYYY')}`}
              </p>
            </Grid>
            <Grid md={4} style={{ paddingTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
              {!disabled && (
                <>
                  {!item.find(e => e.checkMeet) ? null : (
                    <span className="CustomIconList">
                      <Tooltip
                        title="Xóa"
                        onClick={() => {
                          setOpenRemoveSchedule(true);
                          setDeleteIndex(index);
                        }}
                      >
                        <Delete style={{ marginRight: 30, color: '#2196F3', cursor: 'pointer' }} />
                      </Tooltip>
                    </span>
                  )}
                  <span className="CustomIconList">
                    <Tooltip title="Thêm mới" onClick={e => setOpenAddSchedule({ time: moment(_.get(item, '[0].time')).toISOString() })}>
                      <Add style={{ marginRight: 30, color: '#2196F3', cursor: 'pointer' }} />
                    </Tooltip>
                  </span>
                </>
              )}
            </Grid>
          </Grid>
          {Array.isArray(item) &&
            item.map((i, indexs) => (
              <Grid container spacing={8} style={{ alignItems: 'center', padding: 10 }} key={`${index}-${indexs}`}>
                <Grid item md={2} style={{ paddingLeft: 10, display: 'flex' }}>
                  {!disabled && (
                    <Checkbox
                      onChange={event => {
                        let res = [...calenDetail];
                        res[index][indexs].checkMeet = !res[index][indexs].checkMeet;
                        setCalenDetail(res);
                      }}
                      color="primary"
                      checked={calenDetail[index][indexs].checkMeet ? true : false}
                      value="checkMeet"
                    />
                  )}
                  <CustomInputBase
                    inputVariant="outlined"
                    label={'Thời gian'}
                    value={i.timeMeet}
                    name="timeStart"
                    margin="dense"
                    variant="outlined"
                    //invalidLabel="HH:SS"
                    invalidDateMessage={false}
                    onChange={event => {
                      const { addWorkingSchedule } = this.props;
                      addWorkingSchedule.calenDetail[index][indexs].timeMeet = event.target.value;
                      this.props.mergeData(addWorkingSchedule);
                    }}
                    mask={value => (value ? [/\d/, /\d/, ':', /\d/, /\d/, '-', /\d/, /\d/, ':', /\d/, /\d/] : [])}
                    placeholder={'__:__-__:__'}
                    fullWidth
                    className={'CustomIconRequired'}
                    disabled
                  />
                </Grid>
                <Grid item md={4}>
                  <AsyncAutocomplete
                    name="Chọn..."
                    label="Phòng họp"
                    onChange={event => {
                      const { addWorkingSchedule } = this.props;
                      addWorkingSchedule.calenDetail[index][indexs].roomMetting = event;
                      this.props.mergeData(addWorkingSchedule);
                    }}
                    url={`${API_MEETING}/room`}
                    value={i.roomMetting}
                    className={'CustomIconRequired'}
                    disabled
                  />
                </Grid>
                <Grid item md={4}>
                  <CustomInputBase
                    label="Địa điểm"
                    validators={['required']}
                    InputLabelProps={{ shrink: true }}
                    value={i.addressMeet}
                    disabled
                    name="name"
                    onChange={event => {
                      const { addWorkingSchedule } = this.props;
                      addWorkingSchedule.calenDetail[index][indexs].addressMeet = event.target.value;
                      this.props.mergeData(addWorkingSchedule);
                    }}
                    fullWidth
                    className={'CustomIconRequired'}
                  />
                </Grid>
                <Grid item md={2}>
                  <CustomInputBase
                    value={i.typeCalendar}
                    label="Loại lịch"
                    onChange={event => {
                      const { addWorkingSchedule } = this.props;
                      addWorkingSchedule.calenDetail[index][indexs].typeCalendar = event.target.value;
                      this.props.mergeData(addWorkingSchedule);
                    }}
                    select
                    className="CustomIconRequired"
                    disabled
                  >
                    {type.map((it, idx) => (
                      <MenuItem key={it._id} value={it._id}>
                        {it.title}
                      </MenuItem>
                    ))}
                  </CustomInputBase>
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label="Thành phần tham dự"
                    validators={['required']}
                    InputLabelProps={{ shrink: true }}
                    value={i.join}
                    name="name"
                    fullWidth
                    className={'CustomIconRequired'}
                    disabled
                  />
                </Grid>
                <Grid item md={6}>
                  <CustomInputBase
                    label="Đơn vị chuẩn bị, ghi chú (nếu có)"
                    validators={['required']}
                    InputLabelProps={{ shrink: true }}
                    value={i.preparedBy}
                    name="name"
                    fullWidth
                    disabled
                    className={'CustomIconRequired'}
                  />
                </Grid>
                <Grid item md={10}>
                  <CustomInputBase
                    label="Nội dung"
                    validators={['required']}
                    InputLabelProps={{ shrink: true }}
                    value={i.contentMeet}
                    name="name"
                    onChange={event => {
                      const { addWorkingSchedule } = this.props;
                      addWorkingSchedule.calenDetail[index][indexs].contentMeet = event.target.value;
                      this.props.mergeData(addWorkingSchedule);
                    }}
                    fullWidth
                    className={'CustomIconRequired'}
                    disabled
                  />
                </Grid>
                <Grid md={1} spacing={16} style={{ display: 'flex', alignItems: 'end' }}>
                  <Chip
                    label={i.publish ? 'Đã xuất bản' : i.approved ? 'Đã duyệt' : 'Chưa duyệt'}
                    variant="outlined"
                    style={{
                      // minWidth: 160,
                      // marginLeft: "10%",
                      fontSize: 16,
                      // padding: '15px 10px',
                      fontWeight: 450,
                    }}
                  />
                  {!disabled && (
                    <Tooltip title="Chỉnh sửa">
                      <Edit
                        fontSize="small"
                        color="primary"
                        onClick={e => {
                          setOpenAddSchedule({ ...i, updatePos: index });
                          setIsUpdate(true);
                          setIsIndexs(indexs);
                        }}
                        style={{
                          cursor: 'pointer',
                          margin: 'auto',
                        }}
                      />
                    </Tooltip>
                  )}
                </Grid>
                {/* ) : null} */}
              </Grid>
            ))}
        </div>
      ))}

      <Dialog
        maxWidth="lg"
        title={!_.has(openAddSchedule, '_id') || !_.has(openAddSchedule, 'updatePos') ? 'Thêm mới lịch chi tiết' : 'Cập nhật lịch chi tiết'}
        onSave={e => {
          // if (messageError === null) {
          //   handleAddSchedule();
          // }
          // else {
          //   return onChangeSnackbar({ variant: 'error', message: 'Dữ nhiệu nhập chưa đầy đủ vui lòng nhập lại', status: true });
          // }
          if (!openAddSchedule.time) {
            return onChangeSnackbar({ variant: 'error', message: 'Không được để trống ngày!', status: true });
          } else if (!openAddSchedule.timeMeet) {
            return onChangeSnackbar({ variant: 'error', message: 'Không được để trống thời gian!', status: true });
          } else if (!openAddSchedule.contentMeet) {
            return onChangeSnackbar({ variant: 'error', message: 'Không được để trống nội dung!', status: true });
          } else {
            if (messageError === null && messageErrorContent === null) {
              handleAddSchedule();
            } else {
              return onChangeSnackbar({ variant: 'error', message: 'Dữ nhiệu nhập chưa đầy đủ vui lòng nhập lại', status: true });
            }
          }
        }}
        saveText={!_.has(openAddSchedule, 'calendarId') ? 'Thêm mới' : 'Cập nhật'}
        open={openAddSchedule}
        onClose={() => {
          setOpenAddSchedule(null)
          setMessageError(null)
        }}
      >
        <Grid container spacing={8}>
          <Grid item md={2}>
            <CustomDatePicker
              inputVariant="outlined"
              format="DD/MM/YYYY"
              label={'Ngày'}
              name="timeEnd"
              margin="dense"
              variant="outlined"
              value={_.get(openAddSchedule, 'time')}
              onChange={event => {
                setOpenAddSchedule(e => ({ ...e, time: event }));
              }}
              fullWidth
              required={true}
              clearable
              className={'CustomRequiredLetter'}
            // disabled={!_.get(openAddSchedule, 'updateTime')}
            />
          </Grid>
          <Grid item md={2}>
            <NumberFormat
              label={'Thời gian'}
              required
              value={_.get(openAddSchedule, 'timeMeet')}
              onChange={event => {
                setOpenAddSchedule({ ...openAddSchedule, timeMeet: event.target.value });
                if (
                  String(event.target.value)
                    .slice(9, 11)
                    .indexOf('_') === 1 ||
                  String(event.target.value)
                    .slice(3, 5)
                    .indexOf('_') === 1 ||
                  (!parseInt(String(event.target.value).slice(0, 2)) && parseInt(String(event.target.value).slice(0, 2)) !== 0) ||
                  // (!parseInt(String(event.target.value).slice(6, 8)) && parseInt(String(event.target.value).slice(6, 8)) !== 0) ||
                  (!parseInt(String(event.target.value).slice(3, 5)) && parseInt(String(event.target.value).slice(3, 5)) !== 0) ||
                  // (!parseInt(String(event.target.value).slice(9, 11)) && parseInt(String(event.target.value).slice(9, 11)) !== 0) ||

                  ((!!parseInt(String(event.target.value).slice(6, 8)) || parseInt(String(event.target.value).slice(6, 8)) === 0) &&
                    (!parseInt(String(event.target.value).slice(9, 11)) && parseInt(String(event.target.value).slice(9, 11)) !== 0)) ||
                  parseInt(String(event.target.value).slice(0, 2)) > 23 ||
                  parseInt(String(event.target.value).slice(6, 8)) > 23 ||
                  parseInt(String(event.target.value).slice(3, 5)) > 59 ||
                  parseInt(String(event.target.value).slice(9, 11)) > 59 ||
                  parseInt(String(event.target.value).slice(0, 2)) > parseInt(String(event.target.value).slice(6, 8)) ||
                  (parseInt(String(event.target.value).slice(0, 2)) === parseInt(String(event.target.value).slice(6, 8)) &&
                    parseInt(String(event.target.value).slice(3, 5)) >= parseInt(String(event.target.value).slice(9, 11)))
                ) {
                  setMessageError('Thời gian không hợp lệ');
                } else {
                  setMessageError(null);
                }
              }}
              margin="dense"
              customInput={CustomInputBase}
              allowNegative={false}
              decimalSeparator={null}
              displayType="input"
              mask="_"
              format="##:##-##:##"
              placeholder={'__:__-__:__'}
              helperText={messageError !== null && messageError}
              error={messageError !== null}
            />

            {/* <CustomInputBase
                        inputVariant="outlined"
                        label={"Thời gian"}
                        value={_.get(openAddSchedule, 'timeMeet')}
                        name="timeStart"
                        margin="dense"
                        variant="outlined"
                        //invalidLabel="HH:SS"
                        invalidDateMessage={false}
                        onChange={event => setOpenAddSchedule(e => ({ ...e, timeMeet: event.target.value }))}
                        mask={value =>
                            value
                                ? [/\d/, /\d/, ":", /\d/, /\d/, "-", /\d/, /\d/, ":", /\d/, /\d/]
                                : []
                        }
                        placeholder={"__:__-__:__"}
                        fullWidth
                        // keyboard
                        className={'CustomIconRequired'}
                    /> */}
          </Grid>
          <Grid item md={2}>
            <AsyncAutocomplete
              name="Chọn..."
              label="Phòng họp"
              onChange={event => setOpenAddSchedule(e => ({ ...e, roomMetting: event }))}
              url={`${API_MEETING}/room`}
              value={_.get(openAddSchedule, 'roomMetting')}
              className={'CustomIconRequired'}
            />
          </Grid>
          <Grid item md={4}>
            <CustomInputBase
              label="Địa điểm"
              validators={['required']}
              InputLabelProps={{ shrink: true }}
              value={_.get(openAddSchedule, 'roomMetting.address', _.get(openAddSchedule, 'addressMeet'))}
              disabled={_.get(openAddSchedule, 'roomMetting.address')}
              name="name"
              onChange={event => setOpenAddSchedule(e => ({ ...e, addressMeet: event.target.value }))}
              fullWidth
              className={'CustomIconRequired'}
            />
          </Grid>
          <Grid item md={2}>
            <CustomInputBase
              value={_.get(openAddSchedule, 'typeCalendar')}
              label="Loại lịch"
              onChange={event => {
                setOpenAddSchedule(e => ({ ...e, typeCalendar: event.target.value }));
              }}
              select
              className="CustomIconRequired"
            >
              <MenuItem key={'chon'} value={null}>
                {'-- CHỌN LOẠI LỊCH --'}
              </MenuItem>
              {type.map((it, idx) => (
                <MenuItem key={it._id} value={it._id}>
                  {it.title}
                </MenuItem>
              ))}
            </CustomInputBase>
          </Grid>
          <Grid item md={12}>
            <CustomInputBase
              label="Nội dung"
              validators={['required']}
              required
              InputLabelProps={{ shrink: true }}
              value={_.get(openAddSchedule, 'contentMeet')}
              name="name"
              onChange={event => {
                setOpenAddSchedule(e => ({ ...e, contentMeet: event.target.value }));
                if (!event.target.value) setMessageErrorContent('Không được để trống nội dung');
                else setMessageErrorContent(null);
              }}
              fullWidth
              className={'CustomIconRequired'}
              rows={5}
              multiline
              helperText={messageErrorContent}
              error={messageErrorContent}
            />
          </Grid>
          <Grid item md={6}>
            <CustomInputBase
              label="Thành phần tham dự"
              validators={['required']}
              InputLabelProps={{ shrink: true }}
              value={_.get(openAddSchedule, 'join')}
              name="join"
              onChange={event => {
                setOpenAddSchedule(e => ({ ...e, join: event.target.value }));
              }}
              fullWidth
              className={'CustomIconRequired'}
            />
          </Grid>
          <Grid item md={6}>
            <CustomInputBase
              label="Đơn vị chuẩn bị, ghi chú (nếu có)"
              validators={['required']}
              InputLabelProps={{ shrink: true }}
              value={_.get(openAddSchedule, 'preparedBy')}
              name="preparedBy"
              onChange={event => {
                setOpenAddSchedule(e => ({ ...e, preparedBy: event.target.value }));
              }}
              fullWidth
              className={'CustomIconRequired'}
            />
          </Grid>

        </Grid>
      </Dialog>

      <RemoveDialog
        title="Đồng chí có muốn xóa trạng thái này không?"
        openDialogRemove={openRemoveSchedule}
        handleClose={() => setOpenRemoveSchedule(false)}
        handleDelete={handleDeleteSchedule}
      />
    </>
  );
};

export default CalendarDetail;
