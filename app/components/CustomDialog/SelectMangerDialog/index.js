/**
 *
 * AdvanceSearch
 *
 */

import React, { memo, useState } from 'react';
import { compose } from 'redux';
import { Dialog, DialogActions, DialogTitle, DialogContent, Grid, FormControlLabel, Checkbox, TextField, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import CustomButton from '../../Button/CustomButton';
import DepartmentAndEmployee from '../../Filter/DepartmentAndEmployee';
import CustomInputBase from 'components/Input/CustomInputBase';
// import styled from 'styled-components';

function SelectManagerDialog(props) {
  const { onSave, role, numberSelected, templates = [] } = props;
  const [value, setValue] = useState(null);
  const [enableSelectedAll, setEnableSelectedAll] = useState(false);
  const [isSetToManager, setIsSetToManager] = useState(true);
  const [isSetToViewer, setIsSetToViewer] = useState(false);
  const [isOverrideManager, setIsOverrideManager] = useState(false);
  const [isOverrideViewer, setIsOverrideViewer] = useState(false);

  const [isRevokeManager, setIsRevokeManager] = useState(true);
  const [isRevokeViewer, setIsRevokeViewer] = useState(false);
  const [isRevokeAllViewer, setIsRevokeAllViewer] = useState(false);

  const [campaignName, setCampaignName] = useState(null);
  const [sendBy, setSendBy] = useState('email');
  const [template, setTemplate] = useState({});
  const [title, setTitle] = useState('');

  const handleChange = newVal => {
    setValue(newVal);
  };

  const getSelectedValue = val => {
    if (!val) return null;
    return templates.find(i => i._id === val._id);
  };

  const handleRender = role => {
    switch (role) {
      case 'select':
        return (
          <>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox checked={isSetToManager} onClick={() => setIsSetToManager(!isSetToViewer || !isSetToManager)} name="isSetToManager" />
                }
                label="Chọn làm người phụ trách"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={isOverrideManager} onClick={() => setIsOverrideManager(!isOverrideManager)} name="isOverrideManager" />}
                label="Cho phép ghi đè người phụ trách"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox checked={isSetToViewer} onClick={() => setIsSetToViewer(!isSetToManager || !isSetToViewer)} name="isSetToViewer" />
                }
                label="Chọn làm người được xem"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={isOverrideViewer} onClick={() => setIsOverrideViewer(!isOverrideViewer)} name="isOverrideViewer" />}
                label="Cho phép ghi đè người được xem"
              />
            </Grid>
            <Grid item xs={12}>
              <DepartmentAndEmployee value={value} onChange={handleChange} />
            </Grid>
          </>
        );
      case 'revoke':
        return (
          <>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRevokeManager}
                    onClick={() => setIsRevokeManager(!isRevokeViewer || !isRevokeManager)}
                    name="isRevokeManager"
                  />
                }
                label="Quyền người phụ trách"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox checked={isRevokeViewer} onClick={() => setIsRevokeViewer(!isRevokeManager || !isRevokeViewer)} name="isRevokeViewer" />
                }
                label="Quyền người được xem"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={isRevokeAllViewer} onClick={() => setIsRevokeAllViewer(!isRevokeAllViewer)} name="isRevokeAllViewer" />}
                label="Áp dụng cho tất cả người được xem"
              />
            </Grid>
          </>
        );
      case 'create':
        return (
          <>
            <Grid item xs={9}>
              <CustomInputBase onChange={val => setCampaignName(val.target.value)} label="Tên chiến dịch" value={campaignName} />
            </Grid>
            <Grid item xs={3}>
              <CustomInputBase select onChange={setSendBy} label="Phương thức gửi" value={sendBy}>
                <MenuItem key={'email'} value={'email'}>
                  Email
                </MenuItem>
                {/* <MenuItem key={'sms'} value={'sms'}>
                  SMS
                </MenuItem> */}
              </CustomInputBase>
            </Grid>
            <Grid item xs={12}>
              <CustomInputBase onChange={val => setTitle(val.target.value)} label="Tiêu đề" value={title} />
            </Grid>
            <Grid item xs={12}>
              <CustomInputBase select onChange={e => {
                setTemplate(e.target.value);
              }} label="Biểu mẫu" value={getSelectedValue(template)}>
                {templates.map((t, index) => (
                  <MenuItem key={index} value={t}>
                    {t.title}
                  </MenuItem>
                ))}
                {/* <MenuItem key={'sms'} value={'sms'}>
                  SMS
                </MenuItem> */}
              </CustomInputBase>
            </Grid>
          </>
        );
    }
  };

  const handleSave = () => {
    if (!value || !value.employee || !value.employee._id) {
      if (role !== 'revoke' && role !== 'create') {
        return;
      }
    }
    const employeeId = value && value.employee && value.employee._id;
    if (onSave) {
      onSave({
        employeeId,
        enableSelectedAll,
        isSetToManager,
        isOverrideManager,
        isSetToViewer,
        isOverrideViewer,
        isRevokeManager,
        isRevokeViewer,
        isRevokeAllViewer,
        campaignName,
        template,
        title,
      });
    }
  };
  return (
    <>
      <Dialog fullWidth open={props.open} onClose={props.onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {role === 'select'
            ? 'Cập nhật thông tin người phụ trách & người được xem'
            : role === 'revoke'
              ? 'Thu hồi quyền quản lý & được xem của nhân viên'
              : 'Tạo mới chiên dịch'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={8}>
            {handleRender(role)}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={!enableSelectedAll} onClick={() => setEnableSelectedAll(false)} name="disableSelectAll" />}
                label={`Áp dụng cho ${numberSelected} khách hàng được chọn`}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={enableSelectedAll} onClick={() => setEnableSelectedAll(true)} name="enableSelectAll" />}
                label="Áp dụng cho tất cả khách hàng của phép lọc"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleSave} color="primary" autoFocus>
            Lưu
          </CustomButton>
          <CustomButton onClick={props.onClose} color="secondary">
            HỦY
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

SelectManagerDialog.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  handleSave: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default compose(
  memo,
)(SelectManagerDialog);
