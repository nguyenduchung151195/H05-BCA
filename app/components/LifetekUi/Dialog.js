import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Dialog as DialogUi, DialogTitle, DialogContent, DialogActions, Button, Slide } from '@material-ui/core';
import { Loading } from 'components/LifetekUi';
import { Visibility } from '@material-ui/icons';
import { Close } from '@material-ui/icons';
import * as docx from 'docx-preview';
import './drawer.css';
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
    className:  "docx", //class name/prefix for default and document style classes
    inWrapper: true, //enables rendering of wrapper around document content
    ignoreWidth:  true, //disables rendering width of page
    ignoreHeight:  true, //disables rendering height of page
    ignoreFonts: true, //disables fonts rendering
    breakPages:  true, //enables page breaking on page breaks
    ignoreLastRenderedPageBreak: true, //disables page breaking on lastRenderedPageBreak elements
    experimental: true, //enables experimental features (tab stops calculation)
    trimXmlDeclaration: true, //if true, xml declaration will be removed from xml documents before parsing
    useBase64URL: true, //if true, images, fonts, etc. will be converted to base 64 URL, otherwise URL.createObjectURL is used
    useMathMLPolyfill:  true, //includes MathML polyfills for chrome, edge, etc.
    debug: true
  });

  const [view, setView] = useState(false);
  const [reload, setReload] = useState(new Date()*1);

  const isOpen = useRef()
  function downloadDocx(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
  const loadDocx = useCallback(
    (file, container) => {
      if (!file) return;
      // downloadDocx(file, "filename", "docx")
      // docx.renderAsync(file, container, null, docxOptions).then(function (x) { }).catch(e => {
      docx.renderAsync(file, container, null, docxOptions).then(function (x) { }).catch(e => {
        setTimeout(() => {
          if (isOpen.current) {
            console.log(e, "err preview")
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
      const container = document.getElementById('docx-container');
      if (view)
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
