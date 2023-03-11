/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable react/no-string-refs */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
// javascript plugin used to create scrollbars on windows
import { NavLink } from 'react-router-dom';
import { compose } from 'redux';
import messages from './messages';
import { injectIntl } from 'react-intl';

import cx from 'classnames';
// material-ui components
import { withStyles, Drawer, List, ListItem, ListItemIcon, ListItemText, Hidden, Collapse, Avatar } from '@material-ui/core';

import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Email from '@material-ui/icons/Email';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Backup from '@material-ui/icons/Backup';
import AssignmentIndSharpIcon from '@material-ui/icons/AssignmentIndSharp';
import _ from 'lodash';
// core components
import request from '../../utils/request';
import { clientId, emailSso, portalSso } from '../../variable';
import { AUTOMATION_URL, API_LOGOUT } from '../../config/urlConfig';
import HeaderLinks from 'components/Header/HeaderLinks';

import sidebarStyle from 'assets/jss/material-dashboard-pro-react/components/sidebarStyle';
import { fetchData } from '../../helper';
import avatar from 'assets/img/faces/lang.jpg';
import SidebarWrapper from './SidebarWrapper';
import logoDefault from '../../images/logo.jpg';
import avatarDefault from '../../images/default-avatar.png';
import { checkAvatar, testAvatar } from 'utils/common';
import moment from 'moment';
import { CheckImage } from '../../utils/common';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAvatar: false,
      openComponents: this.activeRoute('/components'),
      openForms: this.activeRoute('/forms'),
      openTables: this.activeRoute('/tables'),
      openMaps: this.activeRoute('/maps'),
      openPages: this.activeRoute('-page'),
      openTask: this.activeRoute('task'),
      miniActive: true,
    };
    this.activeRoute.bind(this);
  }
  // verifies if routeName is the one active (in browser input)


  componentWillReceiveProps(props) {
    try {
      if (props.profile && props.profile.avatar && props.profile.avatar !== this.state.profileAva) {
        if (!this.testingAva) {
          this.testingAva = true
          // testAvatar(props.profile.avatar,
          //   () => { this.setState({ profileAva: props.profile.avatar }); this.testingAva = false },
          //   () => this.testingAva = false
          // )
        }
      }

    } catch (e) { }
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1;
  }

  openCollapse(collapse) {
    const st = {};
    st[collapse] = !this.state[collapse];
    this.setState(st);
  }
  redect = () => {
    window.location.href(emailSso)
  }

  logout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchData(API_LOGOUT, 'POST', { token });
    }
    localStorage.clear();
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf('=');
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    this.props.history.push('/');
  };

  render() {
    const { classes, color, logo, image, logoText, routes, bgColor, rtlActive, intl } = this.props;
    let { companyWebsite } = this.props;
    if (companyWebsite) {
      if (companyWebsite.indexOf('www.') === -1) {
        companyWebsite = `www.${companyWebsite}`;
      }
      if (companyWebsite.indexOf('http://') === -1) {
        companyWebsite = `http://${companyWebsite}`;
      }
    }
    const itemText = `${classes.itemText} ${cx({
      [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
      [classes.itemTextMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
      [classes.itemTextRTL]: rtlActive,
    })}`;
    const collapseItemText = `${classes.collapseItemText} ${cx({
      [classes.collapseItemTextMini]: this.props.miniActive && this.state.miniActive,
      [classes.collapseItemTextMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
      [classes.collapseItemTextRTL]: rtlActive,
    })}`;
    const userWrapperClass = `${classes.user} ${cx({
      [classes.whiteAfter]: bgColor === 'white',
    })}`;
    const caret = `${classes.caret} ${cx({
      [classes.caretRTL]: rtlActive,
    })}`;
    const collapseItemMini = `${classes.collapseItemMini} ${cx({
      [classes.collapseItemMiniRTL]: rtlActive,
    })}`;
    const photo = `${classes.photo} ${cx({
      [classes.photoRTL]: rtlActive,
    })}`;

    // Thông tin người dùng
    const user = (
      <div className={userWrapperClass}>
        <div className={photo}>
          {/* <img
            style={{ height: 34 }}
            src={checkAvatar(this.state.profileAva)}
            className={classes.avatarImg}
            alt="..."
          /> */}
          <Avatar style={{ height: 34 }} 
          srcSet={this.props.profile.avatar}
          className={classes.avatarImg}
          src={avatarDefault} 
          />
        </div>
      
        <List className={classes.list}>
          <ListItem className={`${classes.item} ${classes.userItem}`}>
            <NavLink to="#" className={`${classes.itemLink} ${classes.userCollapseButton}`} onClick={() => this.openCollapse('openAvatar')}>
              <ListItemText
                primary={this.props.profile ? this.props.profile.name : 'Admin'}
                secondary={<b className={`${caret} ${classes.userCaret} ${this.state.openAvatar ? classes.caretActive : ''}`} />}
                disableTypography
                className={`${itemText} ${classes.userItemText}`}
              />
            </NavLink>
            <Collapse in={this.state.openAvatar} unmountOnExit>
              <List className={`${classes.list} ${classes.collapseList}`}>
                {/* <ListItem className={classes.collapseItem}>
                  <NavLink
                    to={`/userprofile/${this.props.profile ? this.props.profile.username : ''}`}
                    className={`${classes.itemLink} ${classes.userCollapseLinks}`}
                  >
                    <span className={collapseItemMini}>
                      <AssignmentIndSharpIcon />
                    </span>
                    <ListItemText primary={intl.formatMessage(messages.personalpage)} disableTypography className={collapseItemText} />
                  </NavLink>
                </ListItem> */}
                <ListItem className={classes.collapseItem}>
                  <NavLink to="/admin/profile" className={`${classes.itemLink} ${classes.userCollapseLinks}`}>
                    <span className={collapseItemMini}>
                      <AccountCircleIcon />
                    </span>
                    <ListItemText primary={intl.formatMessage(messages.profile)} disableTypography className={collapseItemText} />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <a href={`${emailSso}`} className={`${classes.itemLink} ${classes.userCollapseLinks}`}>
                    <span className={collapseItemMini}>
                      <Email />
                    </span>
                    <ListItemText primary="Email" disableTypography className={collapseItemText} />
                  </a>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <a href={portalSso} className={`${classes.itemLink} ${classes.userCollapseLinks}`}>
                    <span className={collapseItemMini}>
                      <Backup />
                    </span>
                    <ListItemText primary="Cổng thông tin" disableTypography className={collapseItemText} />
                  </a>
                </ListItem>
                {/* <ListItem className={classes.collapseItem}>
                  <NavLink to="/admin/profile" className={`${classes.itemLink} ${classes.userCollapseLinks}`}>
                    <span className={collapseItemMini}>
                      <EditSharpIcon />
                    </span>
                    <ListItemText primary={intl.formatMessage(messages.update)} disableTypography className={collapseItemText} />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink to="#" className={`${classes.itemLink} ${classes.userCollapseLinks}`}>
                    <span className={collapseItemMini}>
                      <SettingsIcon />
                    </span>
                    <ListItemText primary={intl.formatMessage(messages.settings)} disableTypography className={collapseItemText} />
                  </NavLink>
                </ListItem> */}
                <ListItem className={classes.collapseItem} onClick={this.logout}>
                  <NavLink to="/login" className={`${classes.itemLink} ${classes.userCollapseLinks}`}>
                    <span className={collapseItemMini}>
                      <ExitToAppIcon />
                    </span>
                    <ListItemText
                      onClick={this.logout}
                      primary={intl.formatMessage(messages.logout)}
                      disableTypography
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem} onClick={this.logout}>
                  <ListItemText primary={moment().format('DD/MM/YYYY HH:mm')} disableTypography className={collapseItemText} />
                </ListItem>
              </List>
            </Collapse>
          </ListItem>
        </List>
      </div>
    );

    // Link
    const links = (
      <List className={classes.list} style={{ paddingBottom: 15 }}>
        {this.props.codeModleFunctionAllowForFunction &&
          routes
            .filter(item => !item.empty)
            .map(item => {
              const { codeModleFunctionAllowForFunction } = this.props;

              if (item.isNode) {
                let visible = false;
                if (Array.isArray(item.childModules) && item.childModules.length) {
                  if (item.childModules.find(e => codeModleFunctionAllowForFunction.includes(e))) visible = true;
                }
                return visible && item;
              }

              if (item.dynamicNode) {
                if (item.collapse) {
                  item.views = item.views.filter(view => {
                    if (view.isNode) {
                      let visible = false;
                      if (Array.isArray(view.childModules) && view.childModules.length) {
                        view.childModules.forEach(e => {
                          if (codeModleFunctionAllowForFunction.includes(e)) visible = true;
                        });
                      }
                      return visible;
                    }

                    if (view.moduleCode && !codeModleFunctionAllowForFunction.includes(view.moduleCode)) return false;
                    const splitLinkCollapse = view.path.split('/');
                    if (splitLinkCollapse.length !== 0) {
                      for (let i = 0; i < splitLinkCollapse.length; i++) {
                        if (splitLinkCollapse[i] && codeModleFunctionAllowForFunction.includes(splitLinkCollapse[i])) {
                          return true;
                        }
                      }
                    }
                  });

                  if (item.views.length === 0) return false;
                  if (!codeModleFunctionAllowForFunction.includes(item.defaultModuleCode)) {
                    item.path = item.views[0].path;
                    // item.name = item.views[0].name;
                    // item.component = item.views[0].component;
                  }
                  return item;
                }
              }
              const listPath = item.path.split('/');
              const x = _.intersectionWith(listPath, this.props.codeModleFunctionAllowForFunction, _.isEqual);

              if (x[1] || item.name === 'dashboard' || (x.length === 1 && x[0] !== '')) {
                if (item.collapse) {
                  item.views = item.views.filter(view => {
                    if (view.isNode) {
                      let visible = false;
                      if (Array.isArray(view.childModules) && view.childModules.length) {
                        view.childModules.forEach(e => {
                          if (codeModleFunctionAllowForFunction.includes(e)) visible = true;
                        });
                      }
                      return visible;
                    }

                    if (view.moduleCode && !codeModleFunctionAllowForFunction.includes(view.moduleCode)) return false;
                    const splitLinkCollapse = view.path.split('/');
                    if (splitLinkCollapse.length !== 0) {
                      for (let i = 0; i < splitLinkCollapse.length; i++) {
                        if (codeModleFunctionAllowForFunction.includes(splitLinkCollapse[i])) {
                          return true;
                        }
                      }
                    }
                  });
                  if (item.views.length !== 0) return item;
                }
                const splitLink = item.path.split('/');
                if (splitLink.length !== 0) {
                  for (let i = 0; i < splitLink.length; i++) {
                    if (this.props.codeModleFunctionAllowForFunction.includes(splitLink[i])) {
                      return item;
                    }
                  }
                }
                if (item.name === 'dashboard') return item;
                return false;
              }
              return false;
            })
            .filter(item => item)
            .map((prop, key) => {
              if (prop.redirect) {
                return null;
              }
              if (prop.collapse) {
                const navLinkClasses = `${classes.itemLink} ${cx({
                  [` ${classes.collapseActive}`]: this.activeRoute(prop.path),
                })}`;
                const itemText = `${classes.itemText} ${cx({
                  [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
                  [classes.itemTextMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
                  [classes.itemTextRTL]: rtlActive,
                })}`;
                const collapseItemText = `${classes.collapseItemText} ${cx({
                  [classes.collapseItemTextMini]: this.props.miniActive && this.state.miniActive,
                  [classes.collapseItemTextMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
                  [classes.collapseItemTextRTL]: rtlActive,
                })}`;
                const itemIcon = `${classes.itemIcon} ${cx({
                  [classes.itemIconRTL]: rtlActive,
                })}`;
                const caret = `${classes.caret} ${cx({
                  [classes.caretRTL]: rtlActive,
                })}`;
                const logoText = prop.name;

                return (
                  <ListItem key={key} className={classes.item}>
                    {!prop.path ? (
                      <div className={navLinkClasses} onClick={() => this.openCollapse(prop.state)} style={{ cursor: 'pointer' }}>
                        {/* <ListItemIcon className={itemIcon}>
                          <prop.icon />
                        </ListItemIcon> */}
                        <ListItemText
                          primary={intl.formatMessage(messages[prop.name] || { id: prop.name }).toUpperCase()}
                          secondary={<b className={`${caret} ${this.state[prop.state] ? classes.caretActive : ''}`} />}
                          disableTypography
                          className={itemText}
                        />
                      </div>
                    ) : (
                      <NavLink to={prop.path} className={navLinkClasses} onClick={() => this.openCollapse(prop.state)}>
                        {/* <ListItemIcon className={itemIcon}>
                          <prop.icon />
                        </ListItemIcon> */}
                        <ListItemText
                          primary={intl.formatMessage(messages[prop.name] || { id: prop.name }).toUpperCase()}
                          secondary={<b className={`${caret} ${this.state[prop.state] ? classes.caretActive : ''}`} />}
                          disableTypography
                          className={itemText}
                        />
                      </NavLink>
                    )}

                    <Collapse in={this.state[prop.state]} unmountOnExit>
                      <List className={`${classes.list} ${classes.collapseList}`}>
                        {prop.views.map((prop, key) => {
                          if (prop.redirect || prop.hide) {
                            return null;
                          }
                          const navLinkClasses = `${classes.collapseItemLink} ${cx({
                            [` ${classes[color]}`]: this.activeRoute(prop.path),
                          })}`;
                          const collapseItemMini = `${classes.collapseItemMini} ${cx({
                            [classes.collapseItemMiniRTL]: rtlActive,
                          })}`;
                          return (
                            <ListItem key={key} className={classes.collapseItem}>
                              <NavLink to={prop.path} className={navLinkClasses}>
                                <span className={collapseItemMini}>{prop.mini}</span>
                                <ListItemText
                                  primary={intl.formatMessage(messages[prop.name] || { id: prop.name })}
                                  disableTypography
                                  className={collapseItemText}
                                />
                              </NavLink>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  </ListItem>
                );
              }
              const navLinkClasses = `${classes.itemLink} ${cx({
                [` ${classes[color]}`]: this.activeRoute(prop.path),
              })}`;
              const itemText = `${classes.itemText} ${cx({
                [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
                [classes.itemTextMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
                [classes.itemTextRTL]: rtlActive,
              })}`;
              const itemIcon = `${classes.itemIcon} ${cx({
                [classes.itemIconRTL]: rtlActive,
              })}`;
              return (
                <ListItem className={classes.item}>
                  <NavLink to={prop.path} className={navLinkClasses}>
                    {/* <ListItemIcon className={itemIcon}>
                      <prop.icon />
                    </ListItemIcon> */}
                    <ListItemText
                      primary={prop.name === 'dashboard' ? ' BẢNG ĐIỀU KHIỂN' : prop.name === 'reports' ? 'BÁO CÁO' : prop.name.toUpperCase()}
                      disableTypography
                      className={itemText}
                    />
                  </NavLink>
                </ListItem>
              );
            })}
      </List>
    );

    // Endlink

    const logoNormal = `${classes.logoNormal} ${cx({
      [classes.logoNormalSidebarMini]: this.props.miniActive && this.state.miniActive,
      [classes.logoNormalSidebarMiniRTL]: rtlActive && this.props.miniActive && this.state.miniActive,
      [classes.logoNormalRTL]: rtlActive,
    })}`;
    const logoMini = `${classes.logoMini} ${cx({
      [classes.logoMiniRTL]: rtlActive,
    })}`;
    const logoClasses = `${classes.logo} ${cx({
      [classes.whiteAfter]: bgColor === 'white',
    })}`;
    const deleteAllCookies = () => {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
    const reloadPage = () => {
      localStorage.clear();
      deleteAllCookies()
      console.log("reload Page")
      window.location.reload();
    }
    const brand = (
      // href="/"
      <div className={logoClasses}>
        <a
          onClick={() => {
            reloadPage()
          }}
          className={logoMini}>
          {/* <img  style = {{objectFit: 'contain', height: 35}} src={logo.indexOf('https://g.lifetek.vn:203') > -1 || logo.indexOf('	https://hado.lifetek.vn') > -1 ? logo : logoDefault} alt="logo" className={classes.img} /> */}
          <img style={{ objectFit: 'contain', height: 35 }} src={`${logo}`} alt="logo" className={classes.img} />
        </a>
        <a onClick={() => {
          reloadPage()
        }}
          className={logoNormal}>
          {logoText}
        </a>
      </div>
    );
    const drawerPaper = `${classes.drawerPaper} ${cx({
      [classes.drawerPaperMini]: this.props.miniActive && this.state.miniActive,
      [classes.drawerPaperRTL]: rtlActive,
    })}`;
    const sidebarWrapper = `${classes.sidebarWrapper} ${cx({
      [classes.drawerPaperMini]: this.props.miniActive && this.state.miniActive,
      [classes.sidebarWrapperWithPerfectScrollbar]: navigator.platform.indexOf('Win') > -1,
    })}`;

    // RETURN
    return (
      <div ref="mainPanel">
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor="right"
            open={this.props.open}
            classes={{
              paper: `${drawerPaper} ${classes[`${bgColor}Background`]}`,
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {brand}
            <SidebarWrapper className={sidebarWrapper} user={user} headerLinks={<HeaderLinks rtlActive={rtlActive} />} links={links} />
            {image !== undefined ? <div className={classes.background} /> : null}
            {/* {image !== undefined ? <div className={classes.background} style={{ backgroundImage: `url(${image})` }} /> : null} */}
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            anchor={rtlActive ? 'right' : 'left'}
            variant="permanent"
            open
            classes={{
              paper: `${drawerPaper} ${classes[`${bgColor}Background`]}`,
            }}
          >
            {brand}
            <SidebarWrapper className={sidebarWrapper} user={user} links={links} />
            {image !== undefined ? <div className={classes.background} /> : null}
            {/* {image !== undefined ? <div className={classes.background} style={{ backgroundImage: `url(${image})` }} /> : null} */}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  bgColor: 'blue',
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  bgColor: PropTypes.oneOf(['white', 'black', 'blue']),
  rtlActive: PropTypes.bool,
  color: PropTypes.oneOf(['white', 'red', 'orange', 'green', 'blue', 'purple', 'rose']),
  logo: PropTypes.string,
  logoText: PropTypes.string,
  image: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.object,
};
export default compose(
  injectIntl,
  withStyles(sidebarStyle),
)(Sidebar);

// export default withStyles(sidebarStyle)(Sidebar);
