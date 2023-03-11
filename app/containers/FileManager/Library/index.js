import React from 'react';
import {Grid} from '@material-ui/core';
import ListPage from '../../../components/List';
import MuiTreeView from 'material-ui-treeview';
function LibraryTab(props){
    const tree = [
        {
          value: 'Bộ công an',
          nodes: [{ value: '2021' }, { value: '2020' }],
        },
        {
          value: ' Chính phủ',
          nodes: [
            {
              value: 'Child C',
            },
            {
              value: 'Parent C',
              nodes: [
                { value: 'Child D' },
                { value: 'Child E' },
                { value: 'Child F' },
              ],
            },
          ],
        },
        {
          value: ' Chính phủ',
          nodes: [
            {
              value: 'Child C',
            },
            {
              value: 'Parent C',
              nodes: [
                { value: 'Child D' },
                { value: 'Child E' },
                { value: 'Child F' },
              ],
            },
          ],
        },
        {
          value: 'A08',
          nodes: [
            {
              value: 'Child C',
            },
          ],
        },
        {
          value: 'A03',
          nodes: [
            {
              value: 'Child C',
            },
          ],
        },
      ];
    return (
        <Grid container spacing={8}>
        <Grid item md={2}>
          <MuiTreeView
            softSearch
            onLeafClick={e => console.log(e)}
            onParentClick={e => console.log(e)}
            tree={tree}
          />
        </Grid>
        <Grid item md={10}>
          <ListPage
            withPagination
            // showDepartmentAndEmployeeFilter
            // exportExcel
            // enableView
            onSelectCustomers={val => {
              const docIds = Array.isArray(val) ? val.map(v => v._id) : [];
          
            }}
            // filter={{
            //   $or: [{ createdBy: props.profile._id }, { processors: { $in: [props.profile._id] } }],
            // }}
            disableEmployee
            code="Letter"
            employeeFilterKey="createdBy"
            // apiUrl={API_LETTER}
            kanban="ST21"
          />
        </Grid>
      </Grid>
    )
}

export default LibraryTab;