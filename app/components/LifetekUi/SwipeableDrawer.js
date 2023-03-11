import React, { useEffect, useState } from 'react';
import { Drawer, IconButton, Tooltip } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import {
  // ArrowForwardIos,
  ArrowForward,
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import './drawer.css';
const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const LtSwipeableDrawer = React.memo(props => {
  const [width, setWidth] = useState(props.width ? props.width : getWidth());

  useEffect(() => {
    const resizeListener = () => {
      setWidth(getWidth());
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  // TT: LẤY - "DRAWER - ĐANG ĐƯỢC CLICK" - TỪ STORE ĐỂ HIỂN THỊ.
  return (
    <Drawer anchor="right" onClose={props.onClose} open={props.open} onOpen={props.onOpen}>
      {/* 1.BUTTON - ĐÓNG */}
      {props.disableClose ? null :
        <IconButton style={{ position: 'fixed', top: '0px', right: '10px' }} onClick={props.onClose}>
          <Tooltip title="Đóng">
            <CancelIcon style={{ color: '#2196F3', fontSize: '30px' }} />
            {/* <ArrowForward style={{ color: '#2196F3' }} /> */}
          </Tooltip>
        </IconButton>
      }
      {/* 2.NỘI DUNG */}
      {/* tuantran - giao dien: ADD FAVORITE PAGE - đổ vào đây */}
      {
        props.disableClose ?
          <div >{props.children}</div>
          : <div >{props.children}</div>
      }
      {/* <div style={{ width, overflow: 'auto', paddingTop: 50 }}>{props.children}</div> */}
    </Drawer>
  );
});
export default LtSwipeableDrawer;

LtSwipeableDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// LtSwipeableDrawer.defaultProps = {
//   width:
// }
