import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  // PagingPanel,
  // TableFilterRow,
} from '@devexpress/dx-react-grid-material-ui';
import { Button } from '@material-ui/core';

// import { generateRows } from '../../../demo-data/generator';

export default class HomePage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'sex', title: 'Sex' },
        { name: 'city', title: 'City' },
        { name: 'action', title: 'action' },
        { name: 'car', title: 'Car' },
      ],
      rows: [
        {
          sex: 'Male',
          name: 'Robert',
          city: 'Las Vegas',
          car: 'Chevrolet Cruze',
          action: this.addResetBtn.call(this, { index: 0 }),
        },
        {
          sex: 'Male',
          name: 'Robert',
          city: 'Las Vegas',
          car: 'Chevrolet Cruze',
          action: this.addResetBtn.call(this, { index: 0 }),
        },
        {
          sex: 'Male',
          name: 'Robert',
          city: 'Las Vegas',
          car: 'Chevrolet Cruze',
          action: this.addResetBtn.call(this, { index: 0 }),
        },
        {
          sex: 'Male',
          name: 'Robert',
          city: 'Las Vegas',
          car: 'Chevrolet Cruze',
          action: this.addResetBtn.call(this, { index: 0 }),
        },
        {
          sex: 'Male',
          name: 'Robert',
          city: 'Las Vegas',
          car: 'Chevrolet Cruze',
          action: this.addResetBtn.call(this, { index: 0 }),
        },
        {
          sex: 'Male',
          name: 'Robert',
          city: 'Las Vegas',
          car: 'Chevrolet Cruze',
          action: this.addResetBtn.call(this, { index: 0 }),
        },
        {
          sex: 'Male',
          name: 'Robert',
          city: 'Las Vegas',
          car: 'Chevrolet Cruze',
          action: this.addResetBtn.call(this, { index: 0 }),
        },
        {
          sex: 'Male',
          name: 'Robert',
          city: 'Las Vegas',
          car: 'Chevrolet Cruze',
          action: this.addResetBtn.call(this, { index: 0 }),
        },
      ],
      // pageSizes: [5, 10, 15],
    };
  }

  addResetBtn = ({ index }) => (
    <Button
      // onClick={this.handleResetClick.bind(this, { index })}
      onClick={() => this.handleResetClick(index)}
    >
      Reset
    </Button>
  );

  handleResetClick = ({ index }) => {
    const { rows } = this.state;
    // const updatedRows = this.state.rows;
    rows[index].car = '';
    this.setState({ rows });
  };

  handleChangePage = e => {
    // console.log(e);
  };

  render() {
    const { rows, columns, tableColumnExtensions } = this.state;

    return (
      <Paper>
        <Grid rows={rows} columns={columns}>
          <DragDropProvider />
          <Table columnExtensions={tableColumnExtensions} />
          <TableColumnReordering defaultOrder={['city', 'sex', 'car', 'name', 'action']} />
          <TableHeaderRow />
          {/* <TableHeaderRow showSortingControls /> */}
          {/* <TableFilterRow showFilterSelector /> */}
          {/* <PagingPanel currentPage={1} pageSizes={pageSizes} /> */}
        </Grid>
      </Paper>
    );
  }
}
