/* eslint-disable react/no-unused-prop-types */
/**
 *
 * KpiExchangePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import ListPage from 'components/List';
import injectReducer from 'utils/injectReducer';
import { API_CRITERIA } from '../../config/urlConfig';
import makeSelectKpiExchangePage from './selectors';
import { kpiExchangeColumns } from '../../variable';
import reducer from './reducer';
import saga from './saga';


/* eslint-disable react/prefer-stateless-function */
export class KpiExchangePage extends React.Component {
  mapFunctionExchange = item => ({
    ...item,
    frequency: item.frequency === 1 ? 'Ngày' : item.frequency === 2 ? 'Tuần' : item.frequency === 3 ? 'Tháng' : item.frequency === 4 ? 'Quý' : 'Năm',
    unit: item.unit === 1 ? 'Triệu đồng' : 'Nghìn đồng',
    coefficient: item.coefficient === 1 ? '   Phần trăm (Kết quả thực hiện/chỉ tiêu * 100%)' : '   Kết quả thực hiện',
  });

  render() {
    return (
      <div>
        <ListPage apiUrl={`${API_CRITERIA}/exchange`} columns={kpiExchangeColumns} mapFunction={this.mapFunctionExchange} client />
      </div>
    );
  }
}

KpiExchangePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  kpiExchangePage: makeSelectKpiExchangePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'kpiExchangePage', reducer });
const withSaga = injectSaga({ key: 'kpiExchangePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(KpiExchangePage);
