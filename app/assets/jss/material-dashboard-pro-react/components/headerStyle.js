// ##############################
// // // Header styles
// #############################

import {
  containerFluid,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
} from 'assets/jss/material-dashboard-pro-react';

const headerStyle = theme => ({
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderBottom: '0',
    marginBottom: '0',
    position: 'absolute',
    width: '100%',
    zIndex: '1300!important',
    color: 'black',
    border: '0',
    borderRadius: '3px',
    padding: 0,
    transition: 'all 150ms ease 0s',
    minHeight: '50px',
    display: 'block',
  },
  container: {
    ...containerFluid,
    minHeight: '50px',
  },
  flex: {
    flex: 1,
  },
  title: {
    ...defaultFont,
    lineHeight: '16px',
    fontSize: '16px',
    borderRadius: '3px',
    textTransform: 'none',
    color: 'inherit',
    '&:hover,&:focus': {
      background: 'transparent',
    },
  },
  primary: {
    backgroundColor: primaryColor,
    color: '#FFFFFF',
   
  },
  info: {
    backgroundColor: infoColor,
    color: '#FFFFFF',

  },
  success: {
    backgroundColor: successColor,
    color: '#FFFFFF',
 
  },
  warning: {
    backgroundColor: warningColor,
    color: '#FFFFFF',

  },
  danger: {
    backgroundColor: dangerColor,
    color: '#FFFFFF',
  },
  sidebarMinimize: {
    float: 'left',
    padding: '0 0 0 15px',
    display: 'block',
    color: '#555555',
  },
  sidebarMinimizeRTL: {
    padding: '0 15px 0 0 !important',
  },
  sidebarMiniIcon: {
    width: '20px',
    height: '17px',
  },
});

export default headerStyle;
