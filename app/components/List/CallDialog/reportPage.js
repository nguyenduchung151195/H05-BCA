import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Fab as Fa, TablePagination } from '@material-ui/core';
import { SortingState, IntegratedSorting, IntegratedFiltering, EditingState } from '@devexpress/dx-react-grid';
import { Grid, DragDropProvider, Table, TableHeaderRow, TableEditColumn } from '@devexpress/dx-react-grid-material-ui';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/ItemGrid';
import { Component } from 'components/LifetekUi';
import { API_CCALL, API_CALL } from '../../../config/urlConfig';
import { submission } from './constants';
import _ from 'lodash';
import request from 'utils/request';
import { VolumeUp, Forum } from '@material-ui/icons';
import moment from 'moment';
import RowComponent from "../../../containers/ListPage/headerRow/style"

const Fab = props => <Fa size="small" color="primary" {...props} style={{ margin: '5px', float: 'right' }} />;

export class ReportPage extends Component {
  INIT_STATE = {
    count: 0,
    rows: [],
    columns: [],
    columnOrder: [],
    filter: {
      submission: {
        ...submission,
        page: 1,
        limit: 20,
      },
    },
  };

  constructor(props) {
    super(props);
    this.state = this.INIT_STATE;
  }

  componentDidMount() {
    const newState = {};
    if (this.props.columns) newState.columns = this.props.columns;
    this.getRows(this.state.filter);
    this.setState(e => ({ ...e, ...newState }));
  }

  componentDiđUpate(preProps, preState) {
    const { filter } = state;
    if (!_.isEqual(preState.filter, filter)) {
      this.getRows(filter);
    }
  }

  async getRows(filter) {
    try {
      const { paging, rows } = await this.getData(filter);
      const { page_count, page_current, limit } = paging;
      const startCout = (page_current - 1) * limit;

      let newRows = [];
      rows.forEach((row, index) => {
        const { Cdr } = row;
        const { cid_name, destination, direction, duration, mos, pdd, recording_file, source, start, status, tta } = Cdr;
        const newRow = {
          order: startCout + index,
          employee: cid_name,
          sip: source,
          customer: destination,
          record: recording_file && (
            <VolumeUp
              color="rgb(33, 150, 243)"
              onClick={() => {
                this.playAudio(recording_file);
              }}
            />
          ),
          chat: recording_file && (
            <Forum
              color="rgb(33, 150, 243)"
              onClick={() => {
                this.showAudio(recording_file);
              }}
            />
          ),
          date: start,
        };
        newRows.push(newRow);
      });

      this.setState({ rows: newRows, count: page_count });
    } catch (error) {
      //('error', error);
      this.setState(this.INIT_STATE);
    }
  }

  playAudio = url => {
    let audio = new Audio(url);
    audio.type = 'audio/wav';
    audio.play();
  };

  showAudio = async url => {
    this.startConvert(url);
  };

  startConvert(uri) {
    const url = `https://g.lifetek.vn:227/speech2text`;
    const head = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uri }),
      method: 'POST',
    };
    fetch(url, head)
      .then(res => res.json())
      .then(res => {
        console.log('res', res);
        if (res.status === 'ok') {
          const str = res.str.join('\n');
          // onChange && onChange({ target: { name: restProps.name, value: str } });
        } else {
          // onChange && onChange({ target: { name: restProps.name, value: res.traceback } });
        }
      })
      .catch(e => {
        //console.log(e, 'error');
      });
  }

  async getData(filter) {
    const data = await request(API_CALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filter),
    });
    return data.response;
  }

  // Xử lý phân trang
  handleChangePage = (event, activePage) => {
    const { filter } = this.state;
    this.setState({ filter: { ...filter, page: activePage } });
  };

  handleChangeRowsPerPage = event => {
    const { filter } = this.state;
    this.setState({ filter: { ...filter, limit: event.target.value } });
  };

  render() {
    const { rows, filter, count } = this.state;
    const { columns } = this.props;
    const activePage = filter.page;
    const perPage = filter.limit;
    const { } = this.state;
    //console.log(rows);
    return (
      <GridContainer>
        <GridItem md={12}>
          <Grid rows={rows} columns={columns}>
            <DragDropProvider />
            <SortingState />
            <IntegratedFiltering />
            <IntegratedSorting />

            <Table />
            <TableHeaderRow showSortingControls contentComponent={RowComponent} />
          </Grid>
        </GridItem>
        <GridItem style={{ justifyContent: 'flex-end', display: 'flex' }} md={12}>
          <table>
            <tbody>
              <tr>
                <TablePagination
                  labelRowsPerPage={'Số dòng hiển thị:'}
                  rowsPerPageOptions={[15, 30, 50]}
                  colSpan={3}
                  count={count}
                  rowsPerPage={perPage}
                  page={activePage}
                  SelectProps={{
                    native: true,
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActionsWrapped}
                />
              </tr>
            </tbody>
          </table>
        </GridItem>
      </GridContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ReportPage);
