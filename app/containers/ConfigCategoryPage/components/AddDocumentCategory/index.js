import React, { useEffect, memo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';

function AddDocumentCategory(props) {
  const { openModal, handleClose, onSave, title, label, name, localData, onChange, error } = props
  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">{localData && localData._id ? `Cập nhật ${title}` : `Thêm mới ${title}`}</DialogTitle>
      <DialogContent style={{ width: 600 }}>
        <CustomInputBase
          label={label && label.title}
          value={localData && localData.title}
          onChange={onChange}
          name={name && name.title}
          error={error && error.title}
          helperText={error && error.title}
        />
        <CustomInputBase
          label={label && label.code}
          value={localData && localData.code}
          onChange={onChange}
          name={name && name.code}
          error={error && error.code}
          helperText={error && error.code}
        />
      </DialogContent>
      <DialogActions>
        <CustomButton
          onClick={onSave}
          color="primary"
          variant="contained"
        >
          {localData && localData._id ? 'LƯU' : 'LƯU'}
        </CustomButton>
        <CustomButton
          onClick={handleClose}
          color="secondary"
          variant="outlined"
          // autoFocus
        >
          Hủy
        </CustomButton>
      </DialogActions>
    </Dialog>
  )
}
export default memo(AddDocumentCategory);
