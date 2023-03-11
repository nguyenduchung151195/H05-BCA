import React, { useRef, useState } from 'react';
import { API_INCOMMING_DOCUMENT, API_LETTER } from 'config/urlConfig';
import { MenuItem, Grid, Select, Button, Tooltip, Typography } from '@material-ui/core'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { TextValidator } from 'react-material-ui-form-validator';
import { Scanner } from '@material-ui/icons';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import DepartmentSelect from '../DepartmentSelect/ForDocument';
import CloseIcon from '@material-ui/icons/Close';
import CustomInputBase from 'components/Input/CustomInputBase';
import request from '../../utils/request';
import { API_MEETING } from '../../config/urlConfig';

const ReturnMeetingDoc = (props) => {
  const { open, handleSave, onClose } = props
  return <DialogUI title="Đồng chí có chắc chắn muốn trả lại không ?"
    open={open}
    onSave={async () => {
      await handleSave()
      onClose()
    }}
    saveText="Trả lại" onClose={() => onClose()}
    style={{ position: 'relative' }}>
  </DialogUI>
}

export default ReturnMeetingDoc
