import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';

let ps;

class SidebarWrapper extends Component {
  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(this.sidebarWrapper, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
     ps && ps.destroy();
    }
  }

  render() {
    const { className, user, headerLinks, links } = this.props;
    return (
      <div className={className} ref={el => (this.sidebarWrapper = el)}>
        {user}
        {headerLinks}
        {links}
      </div>
    );
  }
}

export default SidebarWrapper;
