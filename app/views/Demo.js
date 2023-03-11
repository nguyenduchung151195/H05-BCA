import React from 'react';

// material-ui components
import { withStyles, Slide } from '@material-ui/core';

import notificationsStyle from 'assets/jss/material-dashboard-pro-react/views/notificationsStyle';

import { observer } from 'mobx-react';
import { observable } from 'mobx';
// import TradingDetail from '../containers/TradingDetail';

@observer
class Notifications extends React.Component {
  @observable
  isOpening = true;

  constructor(props) {
    super(props);
    this.state = {
      tl: false,
      tc: false,
      tr: false,
      bl: false,
      bc: false,
      br: false,
      classicModal: false,
      noticeModal: false,
      smallModal: false,
    };
  }

  showNotification(place) {
    if (!this.state[place]) {
      const x = [];
      x[place] = true;
      this.setState(x);
      setTimeout(() => {
        x[place] = false;
        this.setState(x);
      }, 6000);
    }
  }

  handleClickOpen(modal) {
    const x = [];
    x[modal] = true;
    this.setState(x);
  }

  handleClose(modal) {
    const x = [];
    x[modal] = false;
    this.setState(x);
  }

  callback = key => {
    switch (key) {
      case 'close':
        this.isOpening = false;
        break;

      default:
        break;
    }
  };

  render() {
    return (
      <div>
        {/* <Heading title="Notifications" textAlign="center" /> */}
        <Slide direction="right" in={!this.isOpening} mountOnEnter unmountOnExit />
        <Slide direction="right" in={this.isOpening} mountOnEnter unmountOnExit />
        {/* <TradingDetail callback={this.callback} isOpening={this.isOpening} /> */}
        {/* </Slide> */}
      </div>
    );
  }
}

export default withStyles(notificationsStyle)(Notifications);
