import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

// material-ui components
import { withStyles, AppBar, Toolbar, IconButton, Button, Hidden, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { nameLocation } from '../../variable';
// material-ui-icons
import { Menu } from '@material-ui/icons';

import pagesRoutes from 'routes/pages';

import pagesHeaderStyle from 'assets/jss/material-dashboard-pro-react/components/pagesHeaderStyle';

class PagesHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleDrawerToggle = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1;
  }

  render() {
    const { classes, color } = this.props;
    const appBarClasses = cx({
      [` ${classes[color]}`]: color,
    });
    const list = (
      <List className={classes.list}>
        {/* <ListItem className={classes.listItem}>
          <NavLink to="/dashboard" className={classes.navLink}>
            <ListItemIcon className={classes.listItemIcon}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" disableTypography className={classes.listItemText} />
          </NavLink>
        </ListItem> */}
        {pagesRoutes.map((prop, key) => {
          if (prop.redirect) {
            return null;
          }
          const navLink =
            classes.navLink +
            cx({
              [` ${classes.navLinkActive}`]: this.activeRoute(prop.path),
            });
          return (
            // eslint-disable-next-line react/no-array-index-key
            <ListItem key={key} className={classes.listItem}>
              <NavLink to={prop.path} className={navLink}>
                <ListItemIcon className={classes.listItemIcon}>
                  <prop.icon />
                </ListItemIcon>
                <ListItemText primary={prop.short} disableTypography className={classes.listItemText} />
              </NavLink>
            </ListItem>
          );
        })}
      </List>
    );
    return (
      <AppBar position="static" className={classes.appBar + appBarClasses}>
        <Toolbar className={classes.container}>
          <div className={classes.flex}>
            <Button href="#" className={classes.title}>
              {nameLocation}
            </Button>
          </div>
          <Hidden smDown implementation="css">
            {list}
          </Hidden>
          <Hidden mdUp>
            <IconButton className={classes.sidebarButton} color="inherit" aria-label="open drawer" onClick={this.handleDrawerToggle}>
              <Menu />
            </IconButton>
          </Hidden>
          <Hidden mdUp implementation="css">
            <Hidden mdUp>
              <Drawer
                variant="temporary"
                anchor="right"
                open={this.state.open}
                classes={{
                  paper: classes.drawerPaper,
                }}
                onClose={this.handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {list}
              </Drawer>
            </Hidden>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}

PagesHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  location: PropTypes.object,
};

export default withStyles(pagesHeaderStyle)(PagesHeader);
