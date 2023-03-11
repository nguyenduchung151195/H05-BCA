// ##############################
// // // LoginPage view styles
// #############################

import { container } from 'assets/jss/material-dashboard-pro-react';
import { green } from '@material-ui/core/colors';
const loginPageStyle = {
  content: {
    paddingTop: '18vh',
    minHeight: 'calc(100vh - 80px)',
    position: 'relative',
    zIndex: '4',
  },
  container,
  customButtonClass: {
    '&,&:focus,&:hover': {
      color: '#FFFFFF',
    },
    marginLeft: '5px',
    marginRight: '5px',
  },
  inputAdornment: {
    marginRight: '18px',
  },
  inputAdornmentIcon: {
    color: '#555',
  },
  cardHidden: {
    opacity: '0',
    transform: 'translate3d(0, -60px, 0)',
  },
  wrapper: {
    // margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
};

export default loginPageStyle;
