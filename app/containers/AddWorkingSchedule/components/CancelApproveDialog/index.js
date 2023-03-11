/**
 *
 * RemoveDialog
 *
 */

 import React from 'react';
 import { Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
 import PropTypes from 'prop-types';
 // import styled from 'styled-components';
 
 function CancelApproveDialog(props) {
   return (
     <div>
       <Dialog
         open={props.openDialogApproveCancel}
         onClose={props.handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
       >
         <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
         <DialogContent>
           <DialogContentText id="alert-dialog-description">{props.title}</DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button onClick={props.handleApproveDialogCancel} color="primary" variant="contained" autoFocus>
            Đồng ý hủy phê duyệt
           </Button>
           <Button onClick={props.handleClose} color="secondary" variant="contained">
             Đóng
           </Button>
         </DialogActions>
       </Dialog>
     </div>
   );
 }
 
 CancelApproveDialog.propTypes = {
   title: PropTypes.string,
   handleClose: PropTypes.func,
   openDialogApproveCancel: PropTypes.bool,
 };
 
 export default CancelApproveDialog;
 