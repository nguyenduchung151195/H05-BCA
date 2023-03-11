/**
 *
 * Planner
 *
 */

import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// eslint-disable-next-line no-unused-vars
import { Fab, Avatar, Typography } from '@material-ui/core';

const grid = 8;
const borderRadius = 2;

const QuoteListTitle = styled.h4`
  padding: ${grid}px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
`;
const Wrapper = styled.div`
  background-color: 'white';
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 10vh;
  border-left: 1px dashed #4a3333;
  border-right: ${({ borderRight }) => (borderRight ? '1px dashed #4a3333' : 'none')};
`;

const scrollContainerHeight = window.innerHeight;

const DropZone = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 3px;
  justify-content: flex-start;
  align-items: flex-start;
  //   position: relative;
`;

const ScrollContainer = styled.div`
  max-height: ${scrollContainerHeight}px;
`;

/* stylelint-disable block-no-empty */

/* stylelint-enable */

const AddDiv = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
`;

function InnerList(props) {
  const { dropProvided } = props;
  return (
    <div>
      <QuoteListTitle>{props.title}</QuoteListTitle>
      <DropZone ref={dropProvided.innerRef}>
        <div
          style={{
            borderRadius: '0px 20px 20px 0px',
            backgroundColor: 'red',
            padding: '6px',
            justifyContent: 'center',
            position: 'relative',
            color: '#edf4ff',
          }}
        >
          <p>
            {' '}
            {props.quotes[0].reality}/{props.quotes[0].plan}
          </p>
        </div>

        <AddDiv>
          <p style={{ color: '#000000', fontWeight: 'bold', fontSize: 20 }}>{props.quotes[0].point}%</p>
        </AddDiv>
      </DropZone>
    </div>
  );
}

function QuoteList(props) {
  const {
    ignoreContainerClipping,
    scrollContainerStyle,
    isDropDisabled,
    isCombineEnabled,
    listId = 'LIST',
    listType,
    style,
    quotes,
    title,
    borderRight,

    color,
  } = props;

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
    >
      {(dropProvided, dropSnapshot) => (
        <Wrapper
          borderRight={borderRight}
          style={style}
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={isDropDisabled}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          <ScrollContainer className="planner-quote-list" style={scrollContainerStyle}>
            <InnerList color={color} quotes={quotes} title={title} dropProvided={dropProvided} />
          </ScrollContainer>
        </Wrapper>
      )}
    </Droppable>
  );
}

const ColumnContainer = styled.div`
  margin: ${grid / 4}px;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
`;

const Arrow = styled.span`
  content: '';
  width: 14px;
  height: 32px;
  position: absolute;
  right: 0;
  top: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position:relative;
  height: 32px;
  padding: ${grid * 2.5}px;
  flex-direction:row;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  // background-color: ${({ isDragging, color }) => (isDragging ? 'black' : color)};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: 'violet';
  }
`;

const Title = styled.div`
  padding: ${grid}px;
  text-align: center;
  background: linear-gradient(to right, ${({ color }) => color}, ${({ color }) => color});
  transition: background-color ease 0.2s;
  display: flex;
  border-radius: 3px 0px 0px 3px;
  justify-content: flex-start;
  align-items: center;
  user-select: none;
  // font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 13px;
  color: white;
`;

function Column(props) {
  const { title, quotes, index, color, id, borderRight } = props;
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <ColumnContainer color={color} ref={provided.innerRef} {...provided.draggableProps}>
          <Header color={color} isDragging={snapshot.isDragging}>
            <Title color={color} isDragging={snapshot.isDragging} {...provided.dragHandleProps}>
              {title}
            </Title>
            <Arrow>
              {borderRight ? (
                <svg style={{ borderRadius: '0px 3px 3px 0px' }} width="13" height="40">
                  <rect fill={color} fillOpacity="1" width="40" height="40" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="40" viewBox="0 0 13 32">
                  <path fill={color} fillOpacity="1" d="M0 0h3c2.8 0 4 3 4 3l6 13-6 13s-1.06 3-4 3H0V0z" />
                </svg>
              )}
            </Arrow>
          </Header>
          <QuoteList listId={id} listType="QUOTE" borderRight={borderRight} color={color} quotes={quotes} internalScroll={props.isScrollable} />
        </ColumnContainer>
      )}
    </Draggable>
  );
}

// eslint-disable-next-line no-unused-vars
const reorderQuoteMap = ({ quoteMap, draggableId, destination, ordered, filterItem }) => {
  const newQuoteMap = quoteMap.map(item => {
    if (item._id === draggableId) return { ...item, [filterItem]: destination.droppableId };
    return item;
  });

  return newQuoteMap;
};

const Container = styled.div`
  padding: 30px;
  display: flex;
  position: relative;
  width: 100%;
`;

function PlanKpi(props) {
  const { containerHeight } = props;
  const [columns, setColumns] = React.useState(props.columns);
  const [ordered, setOrdered] = React.useState([
    { code: 'khachhang', name: 'Khách hàng mới', type: 'khachhang', color: '#2196f3' },
    { code: 'traodoi', name: 'Trao đổi', type: 'traodoi', color: '#51afe1' },
    { code: 'donhang', name: 'Đơn hàng', type: 'donhang', color: '#2a6d00' },
    { code: 'hopdong', name: 'Hợp đồng', type: 'hopdong', color: '#f16464' },
    { code: 'doanhthu', name: 'Doanh số', type: 'doanhthu', color: '#5555cc' },
    { code: 'duan', name: 'Công việc dự án', type: 'duan', color: '#0e0917' },
  ]);

  useEffect(
    () => {
      setColumns(props.columns);
    },
    [props.columns],
  );

  function onDragEnd(result) {
    if (result.combine) {
      if (result.type === 'COLUMN') {
        const ors = ordered;
        const shallow = [...ors];
        shallow.splice(result.source.index, 1);
        setOrdered(shallow);
        return;
      }

      const column = columns[result.source.droppableId];
      const withQuoteRemoved = [...column];
      withQuoteRemoved.splice(result.source.index, 1);
      const cls = props.columns;
      const columns = {
        ...cls,
        [result.source.droppableId]: withQuoteRemoved,
      };
      setColumns(columns);
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
    }

    const data = reorderQuoteMap({
      // eslint-disable-next-line react/no-access-state-in-setstate
      quoteMap: columns,
      draggableId,
      destination,
      ordered,
      filterItem: props.filterItem,
    });
    setColumns(data);
  }

  return (
    <div style={{ overflow: 'auto' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="board"
          type="COLUMN"
          direction="horizontal"
          ignoreContainerClipping={Boolean(containerHeight)}
          isCombineEnabled={props.isCombineEnabled}
        >
          {provided => (
            <Container length={ordered.length} ref={provided.innerRef} {...provided.droppableProps}>
              {ordered.map((key, index) => (
                <Column
                  key={key._id}
                  id={key.code}
                  index={index}
                  title={key.name}
                  color={key.color}
                  borderRight={index === ordered.length - 1}
                  quotes={columns.filter(ele => ele.code === key.code)}
                  isScrollable
                  isCombineEnabled={props.isCombineEnabled}
                />
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

PlanKpi.propTypes = {};
PlanKpi.defaultProps = {
  filterItem: 'plannerStatus',
  filterColumn: 'code',
  filter: {},
  withScrollableColumns: true,
  code: 'PLANER',
};

export default PlanKpi;
