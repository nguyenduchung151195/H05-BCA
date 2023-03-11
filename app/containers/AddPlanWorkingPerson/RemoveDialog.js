/**
 *
 * RemoveDialog
 *
 */

import React from 'react';
import { Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function RemoveDialog(props) {
    const { index, childIndex, handleDelete } = props;
    return (
        <div>
            <Dialog
                open={props.openDialogRemove}
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{props.title}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDelete(index, childIndex)} color="primary" variant="outlined" autoFocus>
                        Xóa
                    </Button>
                    <Button onClick={props.handleClose} color="secondary" variant="outlined">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

RemoveDialog.propTypes = {
    title: PropTypes.string,
    handleClose: PropTypes.func,
    openDialogRemove: PropTypes.bool,
};

export default RemoveDialog;
