/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import './kanban.css';
import { ArrowBackIos, ArrowForwardIos, Done, Close, Add, Search, Archive } from '@material-ui/icons';
// import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Snackbar from 'components/Snackbar';
import { serialize, tableToExcel } from '../../../helper';
import { Fab, Grid, Paper, Tooltip } from '@material-ui/core';
import { TextField, Loading } from '..';
import { clearWidthSpace } from '../../../utils/common';

export default function PlanDemo(props) {
  const { apiUrl, addItem, dashboardPage } = props;
  const [snackbar, setSnackbar] = React.useState({ variant: 'success', message: 'Cập nhật thành công', open: false });
  const [done, setDone] = React.useState(false);
  const [columns, setColumns] = React.useState([]);
  const containerRef = React.useRef(null);
  const [data, setData] = React.useState([]);
  const searchEl = React.useRef(null);
  const [searchInput, setSearchInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [reloadData, setReloadData] = React.useState(false);
  const [roleModule, setRoleModule] = React.useState([]);

  let timeout = 0;

  useEffect(
    () => {
      reload();
      setReloadData(false)
    },
    [props.reload, reloadData, searchInput],
  );


  useEffect(
    () => {
      loadData();
      try {
        const roleCode = props.dashboardPage.role.roles.find(item => item.codeModleFunction === props.codeModule);
        const roleModule = roleCode ? roleCode.methods : [];
        setRoleModule(roleModule)
      } catch (error) {
        // console.log('errr', error);
      }
    }, []);

  function loadData(load = false) {

    if (id) loadDataProject(load);
    else reloadData(load);
    // console.log('id', id);
  }


  // async function reloadData(load = true) {
  //   setLoading(true);
  //   try {
  //     const filter = {};
  //     console.log('filter2',filter)
  //     filter.status = 1;
  //     let newInnerFilterItem = filterItem;
  //     if (id) {
  //       filter.projectId = id;
  //     } 
  //     if (searchInput) filte.name = {$regex: searchInput, $options: 'gi'};
  //     let newFilterItem;

  //     newFilterItem = filterItem;


  //     setInnerFilterItem(newFilterItem);
  //     const query = serialize({ filter });
  //     const api = `${apiUrl}/kanban?${query}`;

  //     const dt = await fetchData(api);
  //     const dtResult = groupBy(dt.data, newFilterItem);
  //     setDataNoFormat(dt.data);
  //     setData(dtResult);
  //     if (load === false) {
  //       const columns = JSON.parse(localStorage.getItem('taskStatus'))
  //         .find(item => item.code === code)
  //         .data.sort((a, b) => a.code - b.code);
  //       setColumns(columns);
  //     }

  //     setLoading(false);
  //     // eslint-disable-next-line no-empty
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // }

  async function loadData() {
    setLoading(true);
    const filter = { ...props.filter };
    filter.status = 1;
    filter.code = { $not: { $in: [3, 4] } };
    filter.isSmallest = true;
    if (searchInput) filter.name = { $regex: searchInput, $options: 'gi' };

    // filter[props.filterItem] = { $not: 'CV4' };
    const query = serialize({ filter });
    const api = `${apiUrl}?${query}`;
    // const config = configUrl || `${apiUrl}/config`;
    try {
      const fetchData = url =>
        fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then(res => res.json());

      const dt = await fetchData(api);
      setData(dt.data);

      const columns = JSON.parse(localStorage.getItem(props.module)).find(item => item[props.filterColumn] === props.code).data.sort((a, b) => a.code - b.code);

      // console.log(columns);

      setColumns(columns);
      // eslint-disable-next-line no-empty
    } catch (error) { }
  }

  async function reload() {
    const filter = { ...props.filter };
    filter.status = 1;
    filter.code = { $not: { $in: [3, 4] } };
    if (searchInput) filter.name = { $regex: searchInput, $options: 'gi' };
    // filter[props.filterItem] = { $not: 'CV4' };
    const query = serialize({ filter });
    const api = `${apiUrl}?${query}`;
    // const config = configUrl || `${apiUrl}/config`;
    try {
      const fetchData = url =>
        fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then(res => res.json());

      const dt = await fetchData(api);
      setData(dt.data);
      // eslint-disable-next-line no-empty
    } catch (error) { }
  }


  async function updateKanbanStatus(item) {
    if (item.notChangeKanban === true) {
      setSnackbar({ variant: 'error', message: 'Đồng chí không thể thay đổi trạng thái thẻ trực quan này!', open: true })
      setReloadData(true)
      return
    }
    const updateData = url => {
      fetch(`${url}/${item._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      }).then(res => {
        if (res.status === 200) setSnackbar({ variant: 'success', message: 'Cập nhật thành công', open: true });
        else setSnackbar({ variant: 'error', message: 'Cập nhật thất bại', open: true });
      });
    };
    updateData(apiUrl);
  }




  function onDragEnd(result) {
    if (!result.destination || result.destination.droppableId === result.source.droppableId) {
      setDone(false);
      return;
    }
    const item = data.find(i => i._id === result.draggableId);
    const newItem = { ...item, [props.filterItem]: result.destination.droppableId };
    const newData = data.map(i => (i._id === newItem._id ? newItem : i));
    setData(newData);
    setDone(false);
    // const task = data.find(it => it._id === result.draggableId)
    if (result.source.droppableId === '26' || result.source.droppableId === '89') {
      newItem.notChangeKanban = true
      updateKanbanStatus(newItem);
    }
    updateKanbanStatus(newItem);
  }

  function setScroll(px) {
    containerRef.current.scrollBy(px, 0);
  }

  function onDragStart() {
    setDone(true);
  }

  function handleSearch(e) {
    const search = clearWidthSpace(e.target.value).trimStart();
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setSearchInput(search);
    }, 500);
  }

  return (
    <Paper>
      <div className="kanban-main">
        <Grid container spacing={8} alignItems="center">
          <Grid item style={{ width: 'calc(60%/3)' }}>
            <TextField onChange={handleSearch} ref={searchEl} label="Tìm kiếm theo tên" variant="outlined" fullWidth
              InputProps={{
                startAdornment: <Search />,
              }} />
          </Grid>
          {/* <Grid item style={{flex: '1 1 auto', textAlign: 'right'}}>
              <button onClick={() => {
                tableToExcel('excel-table-instance', 'W3C Example Table');
              }}><Tooltip title="Xuất dữ liệu">
                  <Fab color="primary" size="small">
                    <Archive  />
                  </Fab></Tooltip></button>
            </Grid> */}
        </Grid>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="kaban-arr-left">
            <button type="button" onClick={() => setScroll(-280)} className="kanban-arr">
              <ArrowBackIos style={{ fontSize: '3rem' }} />
            </button>
          </div>

          <div ref={containerRef} className="kanban-container">
            {/* {columns.filter(i => i.code < 3).map(item => ( */}
            {columns.map(item => (
              <Column
                roleModule={roleModule}
                handleItem={props.handleItem}
                itemComponent={props.itemComponent}
                module={props.module}
                addItem={addItem}
                codeModule={props.codeModule}
                id={item.type}
                // eslint-disable-next-line eqeqeq
                data={data ? data.filter(i => i[props.filterItem] == item.type) : []}
                name={item.name}
                color={item.color}
              />
            ))}
          </div>

          <div className="kaban-arr-right">
            <button type="button" onClick={() => setScroll(280)} className="kanban-arr">
              <ArrowForwardIos style={{ fontSize: '3rem' }} />
            </button>
          </div>

          <div className={done ? 'kanban-done' : 'kanban-done-hide'}>
            <div className="main-kanban-done">
              <Droppable droppableId={4}>
                {provided => (
                  <div ref={provided.innerRef} className="kanban-column-fail">
                    <Close style={{ fontSize: '7rem', color: 'red' }} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId={3}>
                {provided => (
                  <div ref={provided.innerRef} className="kanban-column-success">
                    <Done style={{ fontSize: '7rem', color: 'green' }} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
        <Snackbar
          variant={snackbar.variant}
          open={snackbar.open}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </div>
    </Paper>

  );
}

function Column({ color, name, data, id, addItem, itemComponent, roleModule, codeModule }) {
  return (
    <div className="kanban-column">
      <div className="main-kanban-column-title">
        <div className="main-kanban-column-title-wrapper main-kanban-column-title-dark">
          <div className="main-kanban-column-title-bg" style={{ background: color }} />
          <div className="main-kanban-column-title-info">
            <div className="main-kanban-column-title-text">
              <div className="main-kanban-column-title-text-inner">{name}</div>
              <div className="main-kanban-column-total-item">({data.length})</div>
            </div>
          </div>
          <span className="main-kanban-column-title-right">
            <svg xmlns="http://www.w3.org/2000/svg" width={13} height={32} viewBox="0 0 13 32">
              <path fill={color} fillOpacity={1} d="M0 0h3c2.8 0 4 3 4 3l6 13-6 13s-1.06 3-4 3H0V0z" />
            </svg>
          </span>
        </div>
        <div className="main-kanban-column-title-add-column" />
      </div>
      {(roleModule.find(elm => elm.name === 'POST') || { allow: false }).allow ? (
        <div className="main-kanban-column-subtitle">
          <Add onClick={() => addItem(id)} style={{ cursor: 'pointer', color: '03a9f4eb', fontSize: '1.5rem', fontWeight: 'bold' }} />
        </div>
      ) : null}
      <Droppable droppableId={id}>
        {provided => (
          <div ref={provided.innerRef} className="main-kanban-column-body">
            {data.map((item, index) => (
              <ModuleItem itemComponent={itemComponent} key={item._id} index={index} data={item} roleModule={roleModule} codeModule={codeModule} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

Column.defaultProps = { color: '#00c4fb' };

// eslint-disable-next-line no-unused-vars
function ModuleItem(props) {
  return (
    <Draggable index={props.index} draggableId={props.data._id}>
      {(provided, snapshot) => (
        <div
          className="main-kanban-item"
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          isGroupedOver={Boolean(snapshot.combineTargetFor)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="tasks-kanban-item">
            {props.itemComponent(props.data, props.roleModule, props.codeModule)}
            {/* <p style={{ textAlign: 'center' }}>{props.data.name}</p> */}
          </div>
        </div>
      )}
    </Draggable>
  );
}

PlanDemo.defaultProps = {
  filterItem: 'kanbanStatus',
  filterColumn: 'code',
  filter: {},
  code: 'KANBAN',
  module: 'taskStatus',
  reload: 0,
};
