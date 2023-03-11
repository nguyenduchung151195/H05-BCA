import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Dialog as DialogUi, DialogTitle, DialogContent, DialogActions, Button, Slide } from '@material-ui/core';
import { Loading } from 'components/LifetekUi';
import { Visibility } from '@material-ui/icons';
import { Close } from '@material-ui/icons';
import * as docx from 'docx-preview';
// import './drawer.css';
import { connect } from 'react-redux';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { compose } from 'redux';

function Dialog({
  title,
  docFile,
  typeFile = '',
  children,
  onClose,
  open,
  onSave,
  onCancel,
  saveText,
  cancelText,
  maxWidth,
  dialogAction,
  noClose,
  disableSave,
  disableCancel,
  moreButtons,
  height,
  onChangeSnackbar,
}) {
  const docxOptions = Object.assign(docx.defaultOptions, {
    debug: true,
    experimental: true,
  });

  const [view, setView] = useState(false);
  const isOpen = useRef()

  const loadDocx = useCallback(
    (file, container) => {
      if (!file) return;
      docx.renderAsync(file, container, null, docxOptions).then(function (x) { }).catch(e => {
        console.log(isOpen.current, 'error');
        setTimeout(() => {
          if (isOpen.current) {
            onChangeSnackbar && onChangeSnackbar({ status: true, message: 'Định dạng không hỗ trợ, xin vui lòng tải xuống!', variant: 'error' })
            if (onCancel) onCancel()
            else if (onClose) onClose()
          }
        }, 1000)
      });
    },
    [docxOptions, view],
  );

  useEffect(
    () => {
      var container = document.getElementById('docx-container');
      if(view)
        loadDocx(docFile, container);
    },
    [view],
  );

  useEffect(
    () => {
      isOpen.current = open
      let timer = setTimeout(() => {
        setView(open);
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    },
    [open, docFile],
  );

  return (
    <DialogUi fullWidth maxWidth={maxWidth} onClose={onClose} open={open}>
      {/* <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 10 }}>
        {' '}
        <Close onClick={onClose} />
      </div> */}

      {title ? (
        <DialogTitle id="alert-dialog-title" style={{ padding: '10px 24px' }}>
          <p style={{ fontSize: 16, fontWeight: 'bold' }}>{title}</p>
        </DialogTitle>
      ) : null}

      <DialogContent
        className="dialog-content"
        style={
          height === undefined
            ? { display: 'flex', flexDirection: 'column', paddingBottom: 10 }
            : { display: 'flex', flexDirection: 'column', paddingBottom: 10, height: height }
        }
      >
        {children}
        {(typeFile === 'docx' || typeFile === 'doc') && <div id="docx-container" />}
      </DialogContent>
      {dialogAction ? (
        <DialogActions>
          {docFile && view === false ? <Loading /> : null}
          {/* {docFile && (typeFile === 'docx' || typeFile === 'doc') && (

            <Button onClick={() => {
              setTimeout(() => {
           
              }, 3000)
            }}
             color="secondary" variant="outlined">
          <Visibility /> Xem file
        </Button>
      )} */}
          {moreButtons && moreButtons}
          {onSave ? (
            <Button onClick={onSave} disabled={disableSave} color="primary" variant="contained">
              {saveText}
            </Button>
          ) : null}
          {noClose ? null : (
            <Button
              disabled={disableCancel}
              onClick={() => {
                setView(false);
                if (onCancel) {
                  onCancel();
                }
                if (onClose) {
                  onClose();
                }
              }}
              color="secondary"
              variant="contained"
            >
              {cancelText}
            </Button>
          )}
        </DialogActions>
      ) : null}
    </DialogUi>
  );
}
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

Dialog.defaultProps = {
  maxWidth: 'md',
  saveText: 'Lưu',
  cancelText: 'Hủy',
  dialogAction: true,
  TransitionComponent: Transition,
};


function mapDispatchToProps(dispatch) {
  return {
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(Dialog);
