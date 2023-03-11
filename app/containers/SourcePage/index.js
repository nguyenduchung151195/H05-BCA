/**
 *
<<<<<<< HEAD
<<<<<<< HEAD
 * SourcePage
=======
 * SourcePageƯ
>>>>>>> 3a392685bdac351a113d40725d942d83606ec1ba
=======
 * SourcePageƯ
>>>>>>> 1fa29e01e9c2c982eceb51071c28d769b213e44a
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Tree from 'react-d3-tree';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSourcePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getTradingAct, getPOAct } from './actions';


/* eslint-disable react/prefer-stateless-function */
export class SourcePage extends React.Component {
  state = {
    treeData: [],
  };

  componentDidMount() {
    if (!this.props.isTrading) {
      const { boDialog, editData } = this.props;
      if (editData.exchangingAgreement) {
        this.props.onGetTrading(editData.exchangingAgreement);
      }
      const expense = [];
      const sale = [];
      boDialog.expenses
        ? boDialog.expenses.forEach(element => {
            expense.push({ name: element.name });
          })
        : null;
      boDialog.sales
        ? boDialog.sales.forEach(element1 => {
            sale.push({ name: element1.name });
          })
        : null;
      const sales = {
        name: 'Báo giá',
        _collapsed: true,
        children: sale,
      };
      const expenses = {
        name: 'Dự toán chi phí',
        _collapsed: true,
        children: expense,
      };
      const x = [];
      x.push(sales);
      x.push(expenses);
      const parent = {
        name: editData.name,
        // _collapsed: true,
        children: x,
      };
      const tree = [
        {
          name: `Nguồn ${editData.source}`,
          children: [parent],
        },
      ];
      this.setState({ treeData: tree });
    } else {
      this.props.onGetPO(this.props.editData._id);
    }
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      if (!props.isTrading) {
        const { boDialog, editData, sourcePage } = props;
        const expense = [];
        const sale = [];
        let exchangingAgreement = {};
        if (sourcePage.trading) {
          exchangingAgreement = { name: `TDTT: ${sourcePage.trading.name}` || '' };
        }
        boDialog.expenses
          ? boDialog.expenses.forEach(element => {
              expense.push({ name: element.name });
            })
          : null;
        boDialog.sales
          ? boDialog.sales.forEach(element1 => {
              sale.push({ name: element1.name });
            })
          : null;
        const sales = {
          name: 'Báo giá',
          // _collapsed: true,
          children: sale,
        };
        const expenses = {
          name: 'Dự toán chi phí',
          // _collapsed: true,
          children: expense,
        };
        const x = [];
        x.push(sales);
        x.push(expenses);
        if (sourcePage.trading) {
          x.push(exchangingAgreement);
        }
        const parent = {
          name: editData.name,
          // _collapsed: true,
          children: x,
        };
        const tree = [
          {
            name: `Nguồn ${editData.source}`,
            children: [parent],
          },
        ];
        this.setState({ treeData: tree });
      } else {
        const { boDialog, editData, sourcePage } = props;
        const expense = [];
        const sale = [];
        const poList = [];
        const billList = [];
        const contractList = [];
        if (sourcePage.po && sourcePage.po.length > 0) {
          sourcePage.po.forEach(item => {
            poList.push({ name: item.name });
          });
        }
        boDialog.expenses
          ? boDialog.expenses.forEach(element => {
              expense.push({ name: element.name });
            })
          : null;
        boDialog.sales
          ? boDialog.sales.forEach(element1 => {
              sale.push({ name: element1.name });
            })
          : null;
        boDialog.contracts
          ? boDialog.contracts.data.forEach(element => {
              contractList.push({ name: element.name });
            })
          : null;
        boDialog.bills
          ? boDialog.bills.data.forEach(element => {
              billList.push({ name: element.name });
            })
          : null;
        const sales = {
          name: 'Báo giá',
          // _collapsed: true,
          children: sale,
        };
        const expenses = {
          name: 'Dự toán chi phí',
          // _collapsed: true,
          children: expense,
        };
        const po = {
          name: 'Đơn hàng PO',
          // _collapsed: true,
          children: poList,
        };
        const contracts = {
          name: 'Hợp đồng',
          // _collapsed: true,
          children: contractList,
        };
        const bills = {
          name: 'Hóa đơn',
          // _collapsed: true,
          children: billList,
        };
        const x = [];
        x.push(sales);
        x.push(expenses);
        x.push(po);
        x.push(contracts);
        x.push(bills);
        const parent = {
          name: editData.name,
          // _collapsed: true,
          children: x,
        };
        if (editData['businessOpportunities.name']) {
          const bos = [
            {
              name: `CHKH: ${editData['businessOpportunities.name']}`,
              children: [parent],
            },
          ];
          const tree = [
            {
              name: `Nguồn ${editData.source}`,
              children: bos,
            },
          ];
          this.setState({ treeData: tree });
        } else {
          const tree = [
            {
              name: `Nguồn ${editData.source}`,
              children: [parent],
            },
          ];
          this.setState({ treeData: tree });
        }
      }
    }
  }

  render() {
    console.log('treeData', this.state.treeData);
    return (
      <div id="treeWrapper" style={{ width: '100%', height: '45em' }}>
        {this.state.treeData && this.state.treeData.length > 0 ? (
          <Tree data={this.state.treeData} translate={{ x: 15, y: 250 }} scaleExtent={{ min: 0.5, max: 2 }} />
        ) : null}
      </div>
    );
  }
}

SourcePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  sourcePage: makeSelectSourcePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetTrading: data => {
      dispatch(getTradingAct(data));
    },
    onGetPO: data => {
      dispatch(getPOAct(data));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'sourcePage', reducer });
const withSaga = injectSaga({ key: 'sourcePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SourcePage);
