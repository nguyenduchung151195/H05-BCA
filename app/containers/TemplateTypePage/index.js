/**
 *
 * TemplateTypePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { templateTypeColumns } from 'variable';
import { compose } from 'redux';
import { NavLink } from 'react-router-dom';
import { Note } from '@material-ui/icons';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTemplateTypePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getTemplateTypes, deleteTemplateTypes } from './actions';
import ListAsync from '../../components/List';
import { API_TEMPLATE } from '../../config/urlConfig';
import moment from 'moment';
import { Tooltip } from '@material-ui/core';
/* eslint-disable react/prefer-stateless-function */
export class TemplateTypePage extends React.Component {
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
  }
  mapFunction = item => {
    return {
      ...item,
      createdAt: moment(item.createdAt).format('DD/MM/YYYY'),
    };
  };
  render() {
    return (
      <div>
        <Helmet>
          <title>Loại biểu mẫu</title>
          <meta name="description" content="Description of TemplateTypePage" />
        </Helmet>
        <ListAsync
          columns={templateTypeColumns}
          apiUrl={`${API_TEMPLATE}/category`}
          mapFunction={item => this.mapFunction(item)}
          code="DynamicForm"
          settingBar={[
            <NavLink to="/setting/DynamicForm">
              <Tooltip title="Biểu mẫu động">
                <Note style={{ color: 'white' }} />
              </Tooltip>
            </NavLink>,
          ]}
        />
      </div>
    );
  }
}

// TemplateTypePage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  templateTypePage: makeSelectTemplateTypePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getTemplateTypes: () => dispatch(getTemplateTypes()),
    deleteTemplateTypes: templates => dispatch(deleteTemplateTypes(templates)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'templateTypePage', reducer });
const withSaga = injectSaga({ key: 'templateTypePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TemplateTypePage);
