/**
 *
 * MainLayout
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import { Grid } from '@material-ui/core';


// import ChangeLocale from '../../containers/ChangeLocale';
import mainLogo from '../../images/logo-1-Copy.png';
import styles from './styles';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class EmptyLayout extends React.Component {
  render() {
    const { children, classes } = this.props;

    return (
      <div className={classes.appBar}>
        <CssBaseline />

        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar style={{ justifyContent: 'space-between', background: 'white' }}>
            <Grid>
              <img src={mainLogo} alt="logo" height="50px" style={{ marginTop: -8 }} />
              {/* <Typography variant="h6" className={classes.logoText}>
                Wisami
              </Typography> */}
            </Grid>
          </Toolbar>
        </AppBar>
        <main className={classes.content} container justifyContent="center">
          <div className={classes.toolbar} />
          {children}
        </main>
      </div>
    );
  }
}

EmptyLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

export default withStyles(styles)(EmptyLayout);
