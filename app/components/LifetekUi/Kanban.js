/* eslint-disable react/no-access-state-in-setstate */
// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Column from './column';

import { generateQuoteMap } from './dataDnd';

const data = generateQuoteMap(20);

// const reorder = (list, startIndex, endIndex) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);

//   return result;
// };

const reorderQuoteMap = ({ quoteMap, draggableId, destination, ordered }) => {
  // const current = [...quoteMap[source.droppableId]];
  // const next = [...quoteMap[destination.droppableId]];
  // const target = current[source.index];

  // // moving to same list
  // if (source.droppableId === destination.droppableId) {
  //   const reordered = reorder(current, source.index, destination.index);
  //   const result = {
  //     ...quoteMap,
  //     [source.droppableId]: reordered,
  //   };

  const newQuoteMap = quoteMap.map(item => {
    if (item._id === draggableId) return { ...item, kanbanStatus: ordered.findIndex(ele => ele._id === destination.droppableId) + 1 };
    return item;
  });

  return newQuoteMap;

  // }

  // // moving to different list

  // // remove from original
  // current.splice(source.index, 1);
  // // insert into next
  // next.splice(destination.index, 0, target);

  // const result = {
  //   ...quoteMap,
  //   [source.droppableId]: current,
  //   [destination.droppableId]: next,
  // };

  // return {
  //   quoteMap: result,
  // };
};

const ParentContainer = styled.div`
  height: ${({ height }) => height};
`;

const Container = styled.div`
  padding: ${({ length }) => `10px 30px 10px ${length > 4 ? '200px' : '15px'}`};
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  // min-width: 100%;
  // max-width: 100%;
  width: 100%;
  overflow: auto;
  // display: flex;
  justify-content: left;
  display: inline-flex;
`;

class Board extends Component {
  /* eslint-disable react/sort-comp */
  static defaultProps = {
    isCombineEnabled: false,
  };

  state = {
    columns: [],
    ordered: JSON.parse(localStorage.getItem('crmStatus'))
      .find(item => item.code === this.props.code)
      .data.sort((a, b) => a.code - b.code)
      .sort((a, b) => a.index - b.index),
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const URL = this.props.apiUrl;
    const { ordered } = this.state;
    const fetchData = async () => {
      const reponse = await fetch(URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await reponse.json();
      const newData = data.data.map(item => ({ ...item, color: ordered.find((ele, index) => index === item.kanbanStatus * 1).color }));

      this.setState({ columns: newData });
    };
    fetchData();
  };

  updateKanbanStatus = item => {
    const URL = this.props.apiUrl;
    const updateData = async () => {
      await fetch(`${URL}/${item._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
    };
    updateData();
  };

  onDragEnd = result => {
    if (result.combine) {
      if (result.type === 'COLUMN') {
        const ors = this.state.ordered;
        const shallow = [...ors];
        shallow.splice(result.source.index, 1);
        this.setState({ ordered: shallow });
        return;
      }

      const column = this.state.columns[result.source.droppableId];
      const withQuoteRemoved = [...column];
      withQuoteRemoved.splice(result.source.index, 1);
      const cls = this.state.columns;
      const columns = {
        ...cls,
        [result.source.droppableId]: withQuoteRemoved,
      };
      this.setState({ columns });
      return;
    }

    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;
    const draggableId = result.draggableId;

    // did not move anywhere - can bail early
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // reordering column
    if (result.type === 'COLUMN') {
      return;
      // const ordered = reorder(this.state.ordered, source.index, destination.index);

      // this.setState({
      //   ordered,
      // });

      // return;
    }

    const data = reorderQuoteMap({
      // eslint-disable-next-line react/no-access-state-in-setstate
      quoteMap: this.state.columns,
      draggableId,
      destination,
      ordered: this.state.ordered,
    });

    this.updateKanbanStatus(data.find(item => item._id === draggableId));
    this.setState({
      columns: data,
    });
  };

  render() {
    const columns = this.state.columns;
    const ordered = this.state.ordered;
    const { containerHeight } = this.props;

    const board = (
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
        isCombineEnabled={this.props.isCombineEnabled}
      >
        {provided => (
          <Container length={ordered.length} ref={provided.innerRef} {...provided.droppableProps}>
            {ordered.map((key, index) => (
              <Column
                key={key._id}
                id={key._id}
                index={index}
                title={key.name}
                color={key.color}
                borderRight={index === ordered.length - 1}
                quotes={columns.filter(ele => ele.kanbanStatus * 1 === index + 1)}
                isScrollable={this.props.withScrollableColumns}
                isCombineEnabled={this.props.isCombineEnabled}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );

    return (
      <React.Fragment>
        <DragDropContext onDragEnd={this.onDragEnd}>
          {containerHeight ? <ParentContainer height={containerHeight}>{board}</ParentContainer> : board}
        </DragDropContext>
      </React.Fragment>
    );
  }
}

export default function Hor(props) {
  return <Board {...props} initial={data} />;
}
