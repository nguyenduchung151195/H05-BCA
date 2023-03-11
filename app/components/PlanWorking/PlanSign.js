import React, { useEffect, useRef, useState } from 'react';
import { API_PLAN_WORKING } from '../../config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
import CustomInputBase from '../../components/Input/CustomInputBase';
import request from '../../utils/request';
import FeedBackDocument from '../DepartmentSelect/FeedBackDocument';

const PlanSign = props => {
  const { open, docIds, onChangeSnackbar, template, currentRole, isAuthory = false, 
    screenComplete, childTab, processors, comentPlan, tab, questioner , handleSave} = props;
  const [note, setNote] = useState(null);
  const [result, setResult] = useState({});

  useEffect(
    () => {
      setNote(null);
    },
    [open],
  );

  return (
    <DialogUI
      title={
        (screenComplete === 'enfor' && childTab === 0) || (tab === 'enfor' && childTab === 0)
          ? 'Xin nhận xét'
          : comentPlan === true
            ? 'Nhận xét'
            : 'Phê duyệt'
      }
      maxWidth="sm"
      disableSave={!note && !docIds.length}
      onSave={async () => {
        let url;
        let body;
        if ((screenComplete == 'enfor' && childTab === 0) || (tab === 'enfor' && childTab === 0)) {
          if(handleSave)
            await handleSave(true)
          url = `${API_PLAN_WORKING}/set-enforcement`;
          body = {
            docIds,
            note,
            processors,
            questioner
          };
        } else if (comentPlan === true) {
          url = `${API_PLAN_WORKING}/rate-workingCal`;
          body = {
            docIds,
            note,
            questioner
          };
        } else {
          url = `${API_PLAN_WORKING}/set-sign`;
          body = {
            docIds,
            note,
            questioner
          };
        }
        request(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }).then(res => {
          if (res.status === 1 || res.successNo === 1) {
            onChangeSnackbar({
              variant: 'success',
              message:
                screenComplete === 'enfor' && childTab === 0
                  ? 'Xin nhận xét thành công'
                  : comentPlan === true
                    ? 'Nhận xét thành công'
                    : 'Phê duyệt thành công',
              status: true,
            });
            props.onSuccess && props.onSuccess();
            props.onClose && props.onClose();
          } else {
            onChangeSnackbar({
              variant: 'success',
              message:
                screenComplete === 'enfor' && childTab === 0
                  ? 'Xin nhận xét thất bại'
                  : comentPlan === true
                    ? 'Nhận xét thất bại'
                    : 'Phê duyệt thất bại',
              status: false,
            });
          }
        });
      }}
      saveText="Gửi"
      onClose={() => props.onClose && props.onClose()}
      open={open}
      style={{ position: 'relative' }}
    >
      <CustomInputBase
        multiline
        rows={2}
        value={note}
        name="note"
        // showSpeaker
        onChange={e => setNote(e.target.value)}
        label={
          (screenComplete == 'enfor' && childTab === 0) || (tab === 'enfor' && childTab === 0) ? 'Nội dung xin nhận xét' : comentPlan === true ? 'Nội dung nhận xét' : 'Nội dung phê duyệt'
        }
        checkedShowForm
      />
    </DialogUI>
  );
};

export default PlanSign;
