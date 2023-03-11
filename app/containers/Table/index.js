import * as React from 'react';
import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
import {
  SortingState,
  SelectionState,
  FilteringState,
  GroupingState,
  // SearchState,
  IntegratedFiltering,
  IntegratedGrouping,
  IntegratedSorting,
  IntegratedSelection,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  // VirtualTable,
  TableHeaderRow,
  TableFilterRow,
  TableSelection,
  TableGroupRow,
  GroupingPanel,
  DragDropProvider,
  // TableColumnReordering,
  Toolbar,
  // SearchPanel,
  PagingPanel,
  Table,
} from '@devexpress/dx-react-grid-material-ui';
// import {HighlightedCell} from '@material-ui/core';
// import { ProgressBarCell } from '../../components/ProgressBarCell';
// import { HighlightedCell } from '../../components/HighlightedCell';
import { CurrencyTypeProvider } from '../../components/CurrencyTypeProvider';
// import { PercentTypeProvider } from '../../components/PercentTypeProvider';
// import { BooleanTypeProvider } from '../../components/BooleanTypeProvider';

import { generateRows, globalSalesValues } from '../../generateData';

// const Cell = props => {
//   const { column } = props;
//   if (column.name === 'discount') {
//     return <ProgressBarCell {...props} />;
//   }
//   if (column.name === 'amount') {
//     return <HighlightedCell {...props} />;
//   }
//   return <VirtualTable.Cell {...props} />;
// };

// const getRowId = row => row.id;

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'product', title: 'Product' },
        { name: 'region', title: 'Region' },
        { name: 'sector', title: 'Sector' },
        { name: 'channel', title: 'Channel' },
        { name: 'amount', title: 'Sale Amount' },
        { name: 'discount', title: 'Discount' },
        { name: 'saleDate', title: 'Sale Date' },
        { name: 'customer', title: 'Customer' },
        { name: 'units', title: 'Units' },
        { name: 'action', title: 'action' },
      ],
      // tableColumnExtensions: [{ columnName: 'amount', align: 'right' }, { columnName: 'units', align: 'right' }],
      rows: generateRows({
        columnValues: { id: ({ index }) => index, ...globalSalesValues },
        length: 100,
      }),
      currencyColumns: ['amount'],
      // percentColumns: ['discount'],
      // booleanColumns: ['shipped'],
      pageSize: [10, 50, 100],
    };
  }

  render() {
    const { rows, columns, currencyColumns, pageSize } = this.state;
    const pagingPanelMessages = {
      showAll: 'Alle',
      rowsPerPage: 'Số dòng hiển thị',
      info: '{from} - {to} của {count} ',
    };
    // console.log(rows);
    return (
      <Paper>
        <Grid rows={rows} columns={columns}>
          <DragDropProvider />
          <FilteringState defaultFilters={[{ columnName: 'saleDate', value: '2016-02' }]} />
          <SortingState defaultSorting={[{ columnName: 'product', direction: 'asc' }, { columnName: 'saleDate', direction: 'asc' }]} />
          <SelectionState />
          {/* Tạo phân nhóm */}
          <GroupingState defaultGrouping={[{ columnName: 'product' }]} defaultExpandedGroups={['EnviroCare Max']} />
          {/* Phân nhóm  */}
          <IntegratedGrouping />
          {/* Tạo trạng thái phân trang */}
          <PagingState />
          {/* Lọc  */}
          <IntegratedFiltering />
          {/* Sắp xếp */}
          <IntegratedSorting />
          <IntegratedPaging />
          <IntegratedSelection />
          <CurrencyTypeProvider for={currencyColumns} />

          <Table />
          <TableSelection showSelectAll />
          {/* Thanh phần trăm */}
          {/* <VirtualTable columnExtensions={tableColumnExtensions} cellComponent={Cell} /> */}
          <TableHeaderRow showSortingControls />
          <TableFilterRow showFilterSelector />
          <PagingPanel messages={pagingPanelMessages} pageSizes={pageSize} />
          <TableGroupRow />
          <Toolbar />
          <GroupingPanel showSortingControls />
        </Grid>
      </Paper>
    );
  }
}
