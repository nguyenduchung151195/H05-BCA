import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Badge, TextField } from '@material-ui/core';
import lodash from 'lodash';
import { inorgesign } from '../../utils/common';
// fake data generator
// const getItems = (count, offset = 0) =>
//   Array.from({ length: count }, (v, k) => k).map(k => ({
//     id: `item-${k + offset}`,
//     content: `Nhan vien ${k + offset}`,
//   }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  borderRadius: '3px',
  color: 'white',

  // change background colour if dragging
  background: isDragging ? 'linear-gradient(to right, rgb(40, 43, 45), #607d8beb)' : 'linear-gradient(to right,#2196F3,#00BCD4)',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : '#d3d3d300',
  padding: grid,
  width: '50%',
});

class DndUser extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    items: [],
    selected: [],
    authorityAdd: [],
    searchText: '',
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    droppable: 'items',
    droppable2: 'selected',
    droppable3: 'authorityAdd',
  };

  getList = id => {
    return this.state[this.id2List[id]];
  };

  onDragEnd = result => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(this.getList(source.droppableId), source.index, destination.index);

      let state = { items };
      if (source.droppableId === 'droppable2') {
        state = { selected: items };
        if (this.props.onSelectedChange) {
          this.props.onSelectedChange(items);
        }
      }
      if (source.droppableId === 'droppable3') {
        state = { authorityAdd: items };
        if (this.props.onSelectedChange) {
          this.props.onSelectedChange(items);
        }
      }
      this.setState(state);
    } else if (destination.droppableId === 'droppable2' || destination.droppableId === 'droppable') {
      const result = move(this.getList(source.droppableId), this.getList(destination.droppableId), source, destination);
      const newItems = result.droppable || [];
      const newSelected = result.droppable2 || [];
      this.props.handleUpdateApproveGroup(newSelected);
      this.setState({
        items: newItems,
        selected: newSelected,
      });
    } else if (destination.droppableId === 'droppable3') {
      const result = move(this.getList(source.droppableId), this.getList(destination.droppableId), source, destination);
      const newItems = result.droppable || [];
      const newAuthorityAdd = result.droppable3 || [];
      // this.props.handleUpdateApproveGroup(newSelected);
      this.setState({
        items: newItems,
        authorityAdd: newAuthorityAdd,
      });
    }
  };

  componentWillReceiveProps(props) {
    let newItems = props.users;
    let newSelected = [];
    let newAuthorityAdd = [];
    if (props.selected.length !== 0) {
      props.selected.map(item => {
        const person = props.users.find(d => d.userId === item.person);
        if (person) {
          newSelected.push(person);
        }
      });
      newItems = lodash.differenceBy(newItems, newSelected, 'userId');
    }

    if (props.authorityAdd && props.authorityAdd.length) {
      props.authorityAdd.forEach(item => {
        const innerItems = [];
        item.forEach(inner => {
          const person = props.users.find(d => d.userId === inner.person);
          if (person) {
            innerItems.push(person);
          }
        });
        newAuthorityAdd.push(innerItems);
        newItems = lodash.differenceBy(newItems, innerItems, 'userId');
      });
    }
    this.setState({
      selected: newSelected,
      authorityAdd: newAuthorityAdd,
      items: newItems,
    });
  }

  handleOnChange = e => {
    let newValue = [];
    const textSearch = inorgesign(e.target.value);
    if (textSearch === '') {
      newValue = this.props.users;
    } else {
      newValue = this.props.users.filter(item => {
        if (inorgesign(item.name).search(textSearch) >= 0) {
          return true;
        }
        return false;
      });
    }

    this.setState({ items: newValue });
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <div style={{ display: 'flex' }}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ paddingTop: 20, fontSize: 17 }}>Danh sách nhân viên</span>
                  <TextField onChange={this.handleOnChange} variant="outlined" label="Tìm kiếm" />
                </div>
                <div style={{ height: 500, overflowY: 'auto' }}>
                  {this.state.items.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          {`${item.name} - ${item.code}`}
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="droppable2">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                <div style={{ marginTop: 20, marginBottom: 27 }}>
                  <span style={{ paddingTop: 20, fontSize: 17 }}>Danh sách nhân viên trong nhóm</span>
                </div>
                <div style={{ height: 500, overflowY: 'auto' }}>
                  {this.state.selected.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          {`${item.name} - ${item.code}`}
                          <Badge color="secondary" style={{ marginLeft: '20px' }} badgeContent={index + 1} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* <div style={{ width: 300 }}>
            {this.state.selected
              ? this.state.selected.map((item, index) => {
                  return (
                    <div>
                      <Droppable droppableId={`droppable_${index}`}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                            <div style={{ marginTop: 20, marginBottom: 27 }}>
                              <span style={{ paddingTop: 20, fontSize: 17 }}>Nhân viên {item.name} ủy quyền cho</span>
                            </div>
                            <div style={{ height: 500, overflowY: 'auto' }}>
                              {this.state.authorityAdd
                                ? this.state.authorityAdd.map((item, index) => (
                                    <Draggable key={item._id} draggableId={item._id} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                        >
                                          {`${item.name} - ${item.code}`}
                                          <Badge color="secondary" style={{ marginLeft: '20px' }} badgeContent={index + 1} />
                                        </div>
                                      )}
                                    </Draggable>
                                  ))
                                : null}
                            </div>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })
              : null}
          </div> */}
        </DragDropContext>
      </div>
    );
  }
}

// Put the things into the DOM!
export default DndUser;
