/**
 *
 * SampleProcess
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSampleProcess from './selectors';
import reducer from './reducer';
import saga from './saga';
import { API_SAMPLE_PROCESS } from '../../config/urlConfig';
import { getTemplate } from './actions';
import { Typography, Paper } from '../../components/LifetekUi';
import { injectIntl } from 'react-intl';
import messages from './messages';
/* eslint-disable react/prefer-stateless-function */
export class SampleProcess extends React.Component {
  componentDidMount() {
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack'); 
    localStorage.removeItem('addWorkingScheduleCallback'); 
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');
    this.props.getTemplate();
  }

  mapFunction = item => {
    return {
      ...item,
      updateBy: item.originItem.updateBy ? item.originItem.updateBy.name : "",
    }
  };

  render() {
    const { sampleProcess, intl } = this.props;
    const { templates } = sampleProcess;

    return (
      <div>
        <Helmet>
          <title>{intl.formatMessage(messages.quytrinhmau || { id: 'quytrinhmau', defaultMessage: 'quytrinhmau' })}</title>
          <meta name="description" content="Description of TaskPage" />
        </Helmet>
        <Paper className="py-3" style={{ height: '100%' }}>
          {/* <Typography color="primary" variant="subtitle1">
            {intl.formatMessage(messages.lotrinhmau || { id: 'lotrinhmau', defaultMessage: 'lotrinhmau' })}: {templates.count}
          </Typography> */}

          <ListPage
            disableImport
            code="TemplateTask"
            client
            filter={{
              type: 'Task'
            }}
            apiUrl={`${API_SAMPLE_PROCESS}`}
            mapFunction={this.mapFunction}
            othersButton={['XuatBieuMau']}
          />
        </Paper>
      </div>
    );
  }
}

// SampleProcess.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  sampleProcess: makeSelectSampleProcess(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getTemplate: () => {
      dispatch(getTemplate());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'sampleProcess', reducer });
const withSaga = injectSaga({ key: 'sampleProcess', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(SampleProcess);
