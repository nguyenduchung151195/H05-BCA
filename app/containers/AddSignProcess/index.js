/**
 *
 * AddSignProcess
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@material-ui/core';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm, viewConfigHandleOnChange } from 'utils/common';
import { compose } from 'redux';
import DepartmentSelect from '../../components/DepartmentSelect/Clone';
/* eslint-disable react/prefer-stateless-function */
function AddSignProcess(props) {
    const {  onSave, onClose, code, open, onChangeSnackbar, profile } = props;
    const [localState, setLocalState] = useState({
        others: {},
    });
    const [name2Title, setName2Title] = useState({});
    const [checkRequired, setCheckRequired] = useState({});
    const [checkShowForm, setCheckShowForm] = useState({});
    const [localMessages, setLocalMessages] = useState({});

    useEffect(() => {
        const newNam2Title = viewConfigName2Title(code);
        setName2Title(newNam2Title);
        const checkRequired = viewConfigCheckRequired(code, 'required');
        const checkShowForm = viewConfigCheckRequired(code, 'showForm');
        const messages = viewConfigCheckForm(code, localState);
        setLocalMessages(messages);
        setCheckRequired(checkRequired);
        setCheckShowForm(checkShowForm);
        return () => {
            newNam2Title;
            checkRequired;
            checkShowForm;
            messages;
        }
    }, []);


    const handleInputChange = e => {
        setLocalState({ ...localState, [e.target.name]: e.target.value });
        const messages = viewConfigHandleOnChange(code, localMessages, e.target.name, e.target.value);
        setLocalMessages(messages);
    };

    const handleOtherDataChange = useCallback(newOther => {
        setLocalState(state => ({ ...state, others: newOther }));
    }, [localState]);


    const handleSave = () => {
        // if (localState.month && localState.year && localState.organizationUnitId && localState.inChargedEmployeeId !== null) {
        //     onSave(localState);
        //     setLocalState({});
        // } else {
        //     if (!localState.month) {
        //         setLocalMessages({ ...localMessages, month: 'Không được để trống tháng' })
        //     } else {
        //         delete localMessages.month
        //     }
        //     if (!localState.year) {
        //         setLocalMessages({ ...localMessages, year: 'Không được để trống năm' })
        //     } else {
        //         delete localMessages.year
        //     }
        //     if (!localState.organizationUnitId) { onChangeSnackbar({ status: true, message: 'Không được để trống phòng ban', variant: 'error' }) }
        //     if (localState.inChargedEmployeeId === null) { onChangeSnackbar({ status: true, message: 'Không được để trống người phụ trách', variant: 'error' }) }
        // }
    }

    const handleClose = () => {
        onClose();
        setLocalState({});
    }

    const handeChangeDepartment = viewedDepartmentIds => {
        setLocalState({ ...localState, organizationId: viewedDepartmentIds });
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="md" >
                <DialogTitle id="alert-dialog-title">Trình ký</DialogTitle>
                <DialogContent >
                    <Grid container spacing={8}>
                        <Grid item sm={12}>
                            <DepartmentSelect
                                titleSelect="Xử lý chính"
                                allowedDepartmentIds={localState.organizationId || []}
                                onChange={handeChangeDepartment}
                                isMultiple
                                titleDepartment="Tên đơn vị cá nhân"
                            />
                        </Grid>
                        
                        <Grid item sm={12}>
                            <CustomInputBase
                                rows={5}
                                maxRows={5}
                                label="Nội dung xử lý"
                                value={localState.ProcessingContent}
                                name="ProcessingContent"
                                onChange={handleInputChange}
                                required={checkRequired && checkRequired.ProcessingContent}
                                checkedShowForm={checkShowForm && checkShowForm.ProcessingContent}
                                error={localMessages && localMessages.ProcessingContent}
                                helperText={localMessages && localMessages.ProcessingContent}
                            />
                        </Grid>
                        <Grid item sm={12}>
                            <CustomGroupInputField code={code} columnPerRow={1} value={localState.others} onChange={handleOtherDataChange} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid item xs={12}>
                        <Grid container spacing={8} justify="flex-end">
                            <Grid item>
                                <CustomButton
                                    color="primary"
                                    onClick={e => {
                                        if (Object.keys(localMessages).length === 0) {
                                            handleSave()
                                        } else {
                                            onChangeSnackbar({ status: true, message: 'Gửi đi thất bại!', variant: 'error' })
                                        }
                                    }}
                                >
                                    Gửi
                                </CustomButton>
                            </Grid>
                            <Grid item>
                                <CustomButton color="secondary" onClick={e => handleClose()}>
                                    HỦY
                                </CustomButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </>
    );
}


AddSignProcess.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    dispatch: PropTypes.func.isRequired,
};

export default compose(memo)(AddSignProcess);
