/**
 *
 * RemoveDialog
 *
 */

 import React from 'react';
 import { Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
 import PropTypes from 'prop-types';
 // import styled from 'styled-components';
 
 function CancelPublishDialog(props) {
   return (
     <div>
       <Dialog
         open={props.openPublishDialogCancel}
         onClose={props.handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
       >
         <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
         <DialogContent>
           <DialogContentText id="alert-dialog-description">{props.title}</DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button onClick={props.handlePublishDialogCancel} color="primary" variant="contained" autoFocus>
            Đồng ý hủy xuất văn bản
           </Button>
           <Button onClick={props.handleClose} color="secondary" variant="contained">
             Đóng
           </Button>
         </DialogActions>
       </Dialog>
     </div>
   );
 }
 
 CancelPublishDialog.propTypes = {
   title: PropTypes.string,
   handleClose: PropTypes.func,
   openDialogApproveCancel: PropTypes.bool,
 };
 
 export default CancelPublishDialog;
 