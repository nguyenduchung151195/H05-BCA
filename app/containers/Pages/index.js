import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
// creates a beautiful scrollbar
// import PerfectScrollbar from "perfect-scrollbar";
// import "perfect-scrollbar/css/perfect-scrollbar.css";

// material-ui components
import { withStyles } from '@material-ui/core';

// core components
import PagesHeader from 'components/Header/PagesHeader';
import Footer from 'components/Footer/Footer';

import pagesRoutes from 'routes/pages';

import pagesStyle from 'assets/jss/material-dashboard-pro-react/layouts/pagesStyle';
import makeSelectLoginPage from '../LoginPage/selectors';

// import bg_3 from '../../images/login_slides/3.jpg';
// import bg_4 from '../../images/login_slides/4.jpg';
// import bg_6 from '../../images/login_slides/6.jpg';
// import bg_7 from '../../images/login_slides/7.jpg';
// import bg_8 from '../../images/login_slides/8.jpg';
// import bg_9 from '../../images/login_slides/9.jpg';
import bg_10 from '../../images/login_slides/10.jpg';
// import bg_11 from '../../images/login_slides/11.jpg';
// import bg_12 from '../../images/login_slides/12.jpg';
// import bg_13 from '../../images/login_slides/13.jpg';
// var ps;

class Pages extends React.Component {
  state = {
    bg: null,
  }
  componentDidMount() {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps = new PerfectScrollbar(this.refs.wrapper, {
    //     suppressScrollX: true,
    //     suppressScrollY: false
    //   });
    // }
    // const list = [bg_3, bg_4, bg_6, bg_7, bg_8, bg_9, bg_10, bg_11, bg_12, bg_13];
    const list = [bg_10];

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const randomImageIndex = getRandomInt(0, list.length - 1);
    this.setState({ bg: list[randomImageIndex] });
  }

  componentWillUnmount() {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps.destroy();
    // }
  }

  handleAuthencation(user) {
    this.props.authentication(user);
  }

  render() {
    const { classes, ...rest } = this.props;
    /* eslint-disable */
    return (
      <div>
        <PagesHeader {...rest} />
        <div className={classes.wrapper} ref="wrapper">
          <div className={classes.fullPage}>
            <Switch>
              {pagesRoutes.map((prop, key) => {
                if (prop.collapse) {
                  return null;
                }
                if (prop.redirect) {
                  return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
                }
                return <Route path={prop.path} render={() => <prop.component {...rest} authentication={user => this.handleAuthencation(user)} />} key={key} />;
              })}
              <Route path="/" props={this.props} render={() => <Redirect to="/login" />} />
            </Switch>
            <Footer white />
            <div className={classes.fullPageBackground} style={{ backgroundImage: `url(${this.state.bg})` }} />
          </div>
        </div>
      </div>
    );
    /* eslint-enable */
  }
}

Pages.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage(),
});

const withConnect = connect(
  mapStateToProps,
);
const StyledAutocomplete = withStyles(pagesStyle)

export default compose(withConnect, StyledAutocomplete)(Pages);
