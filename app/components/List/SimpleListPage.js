/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/**
 *
 * ListPage
 *
 */

import React, { useEffect } from 'react';
import {
  Fab as Fa,
  TablePagination,
} from '@material-ui/core';
import { ImportExport, Edit, Add, Remove, Delete } from '@material-ui/icons';
import {
  SortingState,
  IntegratedFiltering,
  IntegratedSelection,
  SelectionState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableFixedColumns,
  TableSelection,
  TableTreeColumn,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/ItemGrid';
import { Link } from 'react-router-dom';
import Dialog from 'components/Modal/DialogAsync';
import { Dialog as DialogUI } from 'components/LifetekUi';

import _ from 'lodash';
// import dot from 'dot-object';
import { SAVE_VIEWCONFIG_ON_RESIZE_DELAY } from '../../utils/constants';
const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right' },
};
function DragColumn({ draggingEnabled, sortingEnabled, ...rest }) {
  if (rest.column.name === 'edit') return <TableHeaderRow.Cell {...rest} sortingEnabled={false} draggingEnabled={false} />;
  return <TableHeaderRow.Cell sortingEnabled draggingEnabled={draggingEnabled} {...rest} />;
}
class SimpleListPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timeout = 0;

    this.state = {
      columns: [],
      columnOrder: [],
      rows: [],
      selected: [],
      dialogStatus: false,
      shareDialog: false,
      activePage: 0,
      deleteDialog: false,
      loading: true,
      totalRows: [],
      message: '',
      count: 0,
      id: null,
      itemCurrent: { originItem: '' },
      columnExtensions: this.props.columnExtensions,
      rightColumns: this.props.rightColumns,
    };
  }

  componentDidMount() {
    let newCls = [...this.props.columns];
    if (this.props.showAction) {
      newCls = [...newCls, { name: 'edit', title: 'Hành động' }]
    }
    const columnOrder = newCls
      .sort((a, b) => a.order - b.order)
      .map(item => item && item.name)
      .concat(['edit']);
    this.setState({ columns: newCls, columnOrder, loading: true });
  }


  componentDidUpdate(preProps) {
    if (preProps.rows !== this.props.rows) {
      this.handleParseRows({ activePage: 0, perPage: 10 });
    }
  }

  changeColumnOrder = newOrder => {
    const columns = this.state.columns;
    const newColumns = columns.map(item => ({ ...item, order: newOrder.indexOf(item.name) }));
    this.setState({ columnOrder: newOrder });
    this.saveConfig(newColumns);
  };

  handleDeleteItem = () => {
    if (this.state.selected.length !== 0) {
      this.props.onDelete(this.state.selected);
    }
    this.setState({ deleteDialog: false, selected: [] });
  };

  handleOpenDeleteDialog = () => {
    this.setState({ deleteDialog: true });
  }

  saveSetting = (columns, status) => {
    if (status) {
      this.setState({ dialogStatus: false, columns });
      this.saveConfig(columns);
    } else {
      const columnOrder = [...columns].sort((a, b) => a.order - b.order);
      this.setState({ columns, dialogStatus: false, columnOrder });
    }
  };

  addEdit = (item) =>
    this.props.onEdit && (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Fab color="primary" size="small" onClick={() => this.props.onEdit(item)}>
          <Edit />
        </Fab>
      </div>
    )



  changeSelect = selected => {
    this.setState({ selected });
  };


  render() {
    const {
      activePage,
      perPage,
      deleteDialog,
      loading,
      columns,
      selected,
      columnOrder,
      rows,
      count,
      sorting,
      columnExtensions,
      rightColumns,
    } = this.state;

    const { onAdd, onDelete, onImport, disableSelect } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <GridContainer justify="flex-end" >
            {onAdd && (
              <Fab onClick={onAdd}>
                <Add />
              </Fab>
            )}
            {onDelete && selected && selected.length > 0 && (
              <Fab color="secondary" onClick={this.handleOpenDeleteDialog}>
                <Delete />
              </Fab>
            )}
            {onImport && (
              <Fab onClick={onAdd}>
                <ImportExport />
              </Fab>
            )}
          </GridContainer>
        </GridItem>

        <GridList
          columnExtensions={columnExtensions}
          rightColumns={rightColumns}
          loading={loading}
          changeSorting={this.changeSorting}
          changeColumnOrder={this.changeColumnOrder}
          selected={selected}
          rows={rows}
          columns={columns}
          columnOrder={columnOrder}
          sorting={sorting}
          disableSelect={disableSelect}
          changeSelect={this.changeSelect}
        />

        <GridItem style={{ justifyContent: 'flex-end', display: 'flex' }} md={12}>
          <table>
            <tbody>
              <tr>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15]}
                  colSpan={3}
                  count={count}
                  rowsPerPage={perPage}
                  page={activePage}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActionsWrapped}
                />
              </tr>
            </tbody>
          </table>
        </GridItem>
        <DialogUI
          maxWidth="sm"
          title="Đồng chí có chắc chắn muốn xóa không?"
          onSave={this.handleDeleteItem}
          onClose={this.closeDialog('deleteDialog')}
          open={deleteDialog}
          saveText="Đồng ý"
        />
      </GridContainer>
    );
  }

  closeDialog = dialog => () => {
    this.setState({ [dialog]: false });
  };

  openDialog = dialog => () => {
    this.setState({ [dialog]: true });
  };


  // Xử lý phân trang
  handleChangePage = (event, activePage) => {
    this.client({ activePage, perPage, searchClient });
  };

  handleChangeRowsPerPage = event => {
    this.client({ activePage: 0, perPage: event.target.value, searchClient });
  };

  handlePage = page => {
    this.client({ activePage: page, perPage, searchClient });
  };

  handleParseRows = ({ activePage, perPage, searchClient }) => {
    const { rows, mapFunction } = this.props;
    console.log(rows, 'rows');
    let rowsCount = rows;
    if (searchClient) {
      rowsCount = rowsCount.filter(item =>
        Object.keys(item).some(
          key =>
            item[key]
              ? item[key]
                .toString()
                .toLowerCase()
                .indexOf(searchClient.toLowerCase()) !== -1
              : false,
        ));
    }
    const newRows = rowsCount ? rowsCount.slice(perPage * activePage, perPage * (activePage + 1)).map(row => {
      let newRow = row;
      if (mapFunction) {
        newRow = mapFunction(row);
      }
      return {
        ...newRow,
        edit: this.addEdit(row),
      }
    }) : [];
    this.setState({ rows: newRows, searchClient, activePage, perPage, count: rowsCount ? rowsCount.length : 0, loading: false });
  };
}

const GridList = React.memo(
  ({
    changeSorting,
    rows,
    columns,
    tree,
    disableSelect,
    rightColumns,
    selected,
    columnExtensions,
    changeSelect,
    onSaveConfig,
  }) => {
    const [newCls, setNewCls] = React.useState(columns);
    const [defaultColumnWidths, setDefaultColumnWidths] = React.useState([]);

    useEffect(
      () => {
        setNewCls(columns);
        setDefaultColumnWidths(
          columns.map(item => ({
            columnName: item.name,
            width: item.width || 200,
          })),
        );
      },
      [columns],
    );

    const handleResizeWidth = _.debounce(newColumnsData => {
      if (typeof onSaveConfig === 'function') {
        const newColumns = columns.map(c => {
          const foundColumnData = newColumnsData.find(cData => cData.columnName === c.name);
          if (foundColumnData) {
            c.width = foundColumnData.width;
          }
          return c;
        });
        onSaveConfig(newColumns);
      }
    }, SAVE_VIEWCONFIG_ON_RESIZE_DELAY);

    return (
      <GridItem md={12}>
        <Grid rows={rows} columns={newCls}>
          <DragDropProvider />
          <SortingState defaultSorting={[{ columnName: 'order', direction: 'asc' }]} onSortingChange={changeSorting} />
          {disableSelect || <SelectionState onSelectionChange={changeSelect} selection={selected} />}
          <IntegratedFiltering />
          {disableSelect || <IntegratedSelection />}
          <Table columnExtensions={columnExtensions} />
          <TableColumnResizing
            columnWidths={defaultColumnWidths}
            onColumnWidthsChange={value => {
              setDefaultColumnWidths(value);
              handleResizeWidth(value);
            }}
          />
          {<TableSelection showSelectAll />}
          <TableHeaderRow cellComponent={DragColumn} showSortingControls />
          {tree ? <TableTreeColumn for="name" showSelectionControls showSelectAll /> : null}
          <TableFixedColumns rightColumns={rightColumns} />
        </Grid>
      </GridItem>
    );
  },
);



export default SimpleListPage;

SimpleListPage.defaultProps = {
  deleteOption: 'ids',
  filter: { status: 1 },
  treeName: 'name',
  columnExtensions: [{ columnName: 'edit', width: 150 }],
  rightColumns: ['edit'],
  reload: false,
  perPage: 10,
  status: 'crmStatus',
  disableEdit: false,
  extraMenu: null,
  disableViewConfig: false,
  showAction: true,
};
