/**
 *
 * TemplatePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { clientId } from 'variable';
import { NavLink } from 'react-router-dom';
import { Description } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTemplatePage from './selectors';
import reducer from './reducer';
import { Paper } from '../../components/LifetekUi';
import saga from './saga';
import { getTemplates, deleteTemplates, mergeData } from './actions';
import ListAsync from '../../components/List';
import { API_TEMPLATE, API_TEMPLATE_LIST } from '../../config/urlConfig';
import { Tooltip } from '@material-ui/core';

/* eslint-disable react/prefer-stateless-function */
export class TemplatePage extends React.Component {
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
    this.props.getTemplates();
  }

  render() {
    return (
      <div>
        <Paper
          style={{ zIndex: '0 !important', boxShadow: '#c5c0c0 0.5px 1px 10px', borderRadius: '0px', height: '100%', width: '100%', marginTop: 10 }}
        >
          <ListAsync
            code="DynamicForm"
            parentCode="setting"
            apiUrl={API_TEMPLATE_LIST}
            deleteUrl={API_TEMPLATE}
            client
            filter={{ $or: [{ clientId }, { clientId: 'ALL' }] }}
            importExport="DynamicForm"
            disableImport
            settingBar={[
              <NavLink to="/setting/template_type">
                <Tooltip title="Loại văn bản">
                  <Description style={{ color: 'white' }} />
                </Tooltip>
              </NavLink>,
            ]}
          />
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  templatePage: makeSelectTemplatePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getTemplates: () => dispatch(getTemplates()),
    deleteTemplates: templates => dispatch(deleteTemplates(templates)),
    mergeData: data => dispatch(mergeData(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'templatePage', reducer });
const withSaga = injectSaga({ key: 'templatePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TemplatePage);
