/**
 *
 * RemoveDialog
 *
 */

 import React from 'react';
 import { Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
 import PropTypes from 'prop-types';
 // import styled from 'styled-components';
 
 function ShowPublishDialog(props) {
   return (
     <div>
       <Dialog
         open={props.openPublishDialog}
         onClose={props.handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
       >
         <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
         <DialogContent>
           <DialogContentText id="alert-dialog-description">{props.title}</DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button onClick={props.handlePublishDialog} color="primary" variant="outlined" autoFocus>
             Xuất bản
           </Button>
           <Button onClick={props.handleClose} color="secondary" variant="outlined">
             Đóng
           </Button>
         </DialogActions>
       </Dialog>
     </div>
   );
 }
 
 ShowPublishDialog.propTypes = {
   title: PropTypes.string,
   handleClose: PropTypes.func,
   openDialogApprove: PropTypes.bool,
 };
 
 export default ShowPublishDialog;
 