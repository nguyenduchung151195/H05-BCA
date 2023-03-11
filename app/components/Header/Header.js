import React from 'react';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import messages from './messages';
import { injectIntl } from 'react-intl';

// material-ui components
import { withStyles, AppBar, Toolbar, IconButton, Tooltip, Button, Hidden } from '@material-ui/core';

// material-ui icons
import { Menu, MoreVert, ViewList } from '@material-ui/icons';

// core components

import CustomIconButton from 'components/CustomButtons/IconButton';

import headerStyle from 'assets/jss/material-dashboard-pro-react/components/headerStyle';
import HeaderLinks from './HeaderLinks';
import "./index.css";

function Header({ ...props }) {
  function makeBrand() {
    let name;
    let { intl } = props;
    props.routes.map(prop => {
      if (prop.collapse) {
        prop.views.map(prop => {
          if (prop.path === props.location.pathname) {
            name = prop.name;
          }
          return null;
        });
      }
      if (prop.path === props.location.pathname) {
        name = prop.name;
      }
      if (props.location.pathname === '/approve') {
        name = 'Danh sách phê duyệt';
      } else if (props.location.pathname === '/IncommingDocument') {
        name = 'Văn bản đến';
      } else if (props.location.pathname === '/notifications') {
        name = 'Danh sách thông báo';
      }
      return null;
    });
    if (name && name !== 'dashboard') return intl.formatMessage(messages[name] || { id: name }).toUpperCase();
    if (name === 'dashboard') return 'BẢNG ĐIỀU KHIỂN';
    return name;
  }
  const { classes, color, rtlActive, ...other } = props;
  const appBarClasses = classNames({
    [` ${classes[color]}`]: color,
  });
  const sidebarMinimize = `${classes.sidebarMinimize} ${classNames({
    [classes.sidebarMinimizeRTL]: rtlActive,
  })}`;

  return (
    <AppBar color="inherit" className={`${classes.appBar + appBarClasses} CustomPaperUI`} style={{ maxWidth: '100vw' }} >
      <Toolbar className='CustomPaperUI' style={{ maxWidth: '100vw' }}>
        <Hidden smDown>
          <div className={sidebarMinimize}>
            {props.miniActive ? (
              <Tooltip title="Mở rộng">
                <CustomIconButton color="white" onClick={props.sidebarMinimize}>
                  <ViewList className={classes.sidebarMiniIcon} />
                </CustomIconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Thu nhỏ">
                <CustomIconButton color="white" onClick={props.sidebarMinimize}>
                  <MoreVert className={classes.sidebarMiniIcon} />
                </CustomIconButton>
              </Tooltip>
            )}
          </div>
        </Hidden>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button className={classes.title}>{makeBrand() || ''}</Button>
        </div>
        <Hidden smDown implementation="css">
          <HeaderLinks
            {...props}
            allStock={props.allStock}
            handleChangeStock={props.handleChangeStock}
            currentStock={props.currentStock}
            rtlActive={classes.wrapper}
            {...other}
          />
        </Hidden>
        <Hidden mdUp>
          <IconButton className={classes.appResponsive} color="inherit" aria-label="open drawer" onClick={props.handleDrawerToggle}>
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

// Header.propTypes = {
//   classes: PropTypes.object,
//   color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger', '#90a4ae']),
//   rtlActive: PropTypes.bool,
// };

export default compose(
  injectIntl,
  withStyles(headerStyle),
)(Header);
