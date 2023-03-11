import React from 'react';
import PropTypes from 'prop-types';
// import RaisedButton from 'material-ui/RaisedButton';
import { Button, Fab } from '@material-ui/core';
// import AnswerIcon from 'material-ui/svg-icons/communication/phone';
// import RejectIcon from 'material-ui/svg-icons/communication/call-end';
import AnswerIcon from '@material-ui/icons/Phone';
import RejectIcon from '@material-ui/icons/CallEnd';
import Logger from '../../utils/call/Logger';
import TransitionAppear from './TransitionAppear';
import UserChip from './UserChip';

const logger = new Logger('Incoming');

export default class Incoming extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const session = this.props.session;
    // const name = session.remote_identity.display_name;
    // const uri = session.remote_identity.uri.toString();
    // console.log(session._remote_identity._display_name);
    return (
      <TransitionAppear duration={1000}>
        <div data-component="Incoming">
          {/* <UserChip name={name} uri={uri} /> */}
          <div style={{ height: 200 }}>
            <p style={{ textAlign: 'center' }}>Cuộc gọi đến</p>
            <h4 style={{ fontWeight: 'bold', textAlign: 'center' }}>{session._remote_identity._display_name}</h4>
          </div>
          <div className="buttons" style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Fab label="Answer" color="primary" onClick={this.handleClickAnswer.bind(this)}>
              <AnswerIcon color="#fff" />
            </Fab>
            <Fab label="Reject" color="secondary" onClick={this.handleClickReject.bind(this)}>
              <RejectIcon color="#fff" />
            </Fab>
          </div>
        </div>
      </TransitionAppear>
    );
  }

  handleClickAnswer() {
    logger.debug('handleClickAnswer()');

    this.props.onAnswer();
  }

  handleClickReject() {
    logger.debug('handleClickReject()');

    this.props.onReject();
  }
}

Incoming.propTypes = {
  session: PropTypes.object.isRequired,
  onAnswer: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};
