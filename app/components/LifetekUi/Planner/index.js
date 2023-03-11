/**
 *
 * Planner
 *
 */

import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Add } from '@material-ui/icons';
// eslint-disable-next-line no-unused-vars
import { Fab, Avatar, Typography } from '@material-ui/core';

import Snackbar from 'components/Snackbar';
// import { API_TASK_PROJECT } from '../../config/urlConfig';
// import './kanban.css';
import { serialize } from '../../../helper';
// import PerfectScrollbar from 'perfect-scrollbar';
const grid = 8;
const borderRadius = 2;

const getBackgroundColorItem = (isDragging, isGroupedOver, color) => {
  if (isDragging) {
    return color;
  }

  if (isGroupedOver) {
    return color;
  }

  return '#ffffff9c';
};

const getBorderColor = (isDragging, color) => (isDragging ? color : 'transparent');

const ItemContainer = styled.div`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${props => getBorderColor(props.isDragging, props.colors)};
  background-color: ${props => getBackgroundColorItem(props.isDragging, props.isGroupedOver, props.colors)};
  padding: ${grid}px;
  min-height: 40px;
  margin-bottom: ${grid}px;
  user-select: none;
  font-size: 1rem;
  /* anchor overrides */
  color: #000000;

  // &:hover,
  // &:active {
  //   color: red;
  //   text-decoration: none;
  // }

  &:focus {
    outline: none;
    border-color: ${props => props.colors};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const Content = styled.div`
  /* flex child */
  flex-grow: 1;

  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`;

const Footer = styled.div`
  display: flex;
  margin-top: ${grid}px;
  align-items: center;
`;

const ItemTitle = styled.p`
  margin: 0;
  border-radius: ${borderRadius}px;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 0px;
  // color: #2196f3;
`;

const QuoteId = styled.small`
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0;
  font-weight: normal;
  text-overflow: ellipsis;
  text-align: right;
`;

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent

function AvatarItem(props) {
  const [hover, setHover] = React.useState(1);

  return (
    <Avatar
      onMouseEnter={() => setHover(1.5)}
      onMouseLeave={() => setHover(1)}
      style={{
        marginLeft: '-8px',
        width: hover * 33,
        height: hover * 33,
        border: `${hover === 1 ? '1px solid white' : '2px solid #2196f3'}`,
        zIndex: hover === 1 ? 0 : 10,
      }}
      {...props}
    />
  );
}

function Join(props) {
  const joins = props.joins;
  const length = joins.length;
  switch (length) {
    case 0:
      return null;
    case 1:
    case 2:
    case 3:
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
          {joins.map(i => (
            <AvatarItem alt="Nguyễn văn A" key={i._id} src={i.avatar} />
          ))}

          <div style={{ height: 55, width: 10 }} />
        </div>
      );
    default:
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
          <AvatarItem alt="Nguyễn văn A" key={joins[0]._id} src={`${joins[0].avatar}?allowDefault=true`} />
          <AvatarItem alt="Nguyễn văn A" key={joins[1]._id} src={`${joins[1].avatar}?allowDefault=true`} />
          <AvatarItem alt="Nguyễn văn A" key={joins[2]._id} src={`${joins[2].avatar}?allowDefault=true`} />

          <div style={{ height: 55, width: 10 }} />
        </div>
      );
  }
}

function QuoteItem(props) {
  const { quote, isDragging, isGroupedOver, provided, color } = props;
  const priotyArr = ['#ff0000', '#ffc107', '#03a9f4', '#009688', '#8bc34a'];
  const priotyStr = ['Rất cao', 'Cao', 'Trung bình', 'Thấp', 'Rất thấp'];

  return (
    <ItemContainer
      isDragging={isDragging}
      isGroupedOver={isGroupedOver}
      colors={color}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Content>
        <p variant="subtile1">{quote.name}</p>

        <p>Tiến độ: {(quote.progress * 1).toFixed(2)}%</p>
        <p>
          Ưu tiên: <span style={{ color: priotyArr[quote.priority - 1] }}>{priotyStr[quote.priority - 1]}</span>
        </p>
        <Join joins={quote.join} />
        <ItemTitle> {quote.projectId ? quote.projectId.name : ''}</ItemTitle>
        <Footer>
          {/* <Author colors={quote.author.colors}>{quote.author.name}</Author> */}
          <QuoteId>
            id:
            {quote._id}
          </QuoteId>
        </Footer>
      </Content>
    </ItemContainer>
  );
}

const Item = React.memo(QuoteItem);

const getBackgroundColor = (isDraggingOver, isDraggingFrom) => {
  if (isDraggingOver) {
    return '#007bff00';
  }
  if (isDraggingFrom) {
    return '#007bff54';
  }
  return '#00000000';
};

const QuoteListTitle = styled.h4`
  padding: ${grid}px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  &:focus {
    outline: 2px solid red;
    outline-offset: 2px;
  }
`;
const Wrapper = styled.div`
  background-color: ${props => getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 280px;
  height: 100vh;
  border-left: 1px dashed #d7dee1;
  border-right: ${({ borderRight }) => (borderRight ? '1px dashed #d7dee1' : 'none')};
`;

const scrollContainerHeight = window.innerHeight;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;

  padding-bottom: ${grid}px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
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
        <AddDiv>
          <Fab style={{ cursor: 'pointer' }} onClick={props.addItem} color="primary" size="small">
            <Add />
          </Fab>
        </AddDiv>
        {props.quotes.map((quote, index) => (
          <Draggable key={quote._id} draggableId={quote._id} index={index}>
            {(dragProvided, dragSnapshot) => (
              <Item
                key={quote._id}
                quote={quote}
                color={props.color}
                isDragging={dragSnapshot.isDragging}
                isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
                provided={dragProvided}
              />
            )}
          </Draggable>
        ))}
        {dropProvided.placeholder}
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
    addItem,
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
            <InnerList color={color} addItem={addItem} quotes={quotes} title={title} dropProvided={dropProvided} />
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
  // background: linear-gradient(to right, ${({ color }) => color}, ${({ color }) => color});
  // border:1px solid black;
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

  &:focus {
    outline: 2px solid black;
    outline-offset: 2px;
  }
`;

function Column(props) {
  const { title, quotes, index, color, id, borderRight, addItem } = props;
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <ColumnContainer color={color} ref={provided.innerRef} {...provided.draggableProps}>
          <Header color={color} isDragging={snapshot.isDragging}>
            <Title color={color} isDragging={snapshot.isDragging} {...provided.dragHandleProps}>
              {title} ({quotes.length})
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
          <QuoteList
            listId={id}
            addItem={addItem}
            listType="QUOTE"
            borderRight={borderRight}
            style={{
              backgroundColor: snapshot.isDragging ? 'white' : null,
            }}
            color={color}
            quotes={quotes}
            internalScroll={props.isScrollable}
            isCombineEnabled={Boolean(props.isCombineEnabled)}
          />
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
  // justify-content: center;
  position: relative;
  background: linear-gradient(#ffffff, #008eff);
  width: 100%;
`;

function Planner(props) {
  const { containerHeight, addItem, apiUrl, configUrl } = props;
  const [columns, setColumns] = React.useState([]);
  const [snackbar, setSnackbar] = React.useState({ variant: 'success', message: 'Cập nhật thành công', open: false });
  const [ordered, setOrdered] = React.useState([
    { code: 1, name: 'Công việc mới', type: 1, color: '#2196f3' },
    { code: 2, name: 'Công việc đang xử lý', type: 1, color: '#51afe1' },
    { code: 3, name: 'Công việc thành công', type: 1, color: '#2a6d00' },
    { code: 4, name: 'Công việc thất bại', type: 1, color: '#cb0000' },
  ]);
  async function loadData() {
    const filter = { ...props.filter };
    filter.status = 1;
    // filter[props.filterItem] = { $not: 'CV4' };
    const query = serialize({ filter });
    const api = `${apiUrl}?${query}`;
    const config = configUrl || `${apiUrl}/config`;
    try {
      const fetchData = url =>
        fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then(res => res.json());

      const dt = await Promise.all([fetchData(api), fetchData(config)]);
      setColumns(dt[0].data);
      const planner = dt[1].find(item => item.code === props.code).data.sort((a, b) => a.type - b.type);
      setOrdered(planner);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  async function updateKanbanStatus(item) {
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
        else setSnackbar({ variant: 'success', message: 'Cập nhật thất bại', open: true });
      });
    };
    updateData(apiUrl);
  }

  useEffect(() => {
    loadData();
  }, []);

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
    updateKanbanStatus(data.find(item => item._id === draggableId));
  }

  return (
    <div style={{ overflow: 'auto' }} className="planner-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="board"
          type="COLUMN"
          direction="horizontal"
          ignoreContainerClipping={Boolean(containerHeight)}
          isCombineEnabled={props.isCombineEnabled}
        >
          {provided => (
            <Container className="kanban-container" length={ordered.length} ref={provided.innerRef} {...provided.droppableProps}>
              {ordered.map((key, index) => (
                <Column
                  key={key._id}
                  id={key.code}
                  index={index}
                  title={key.name}
                  color={key.color}
                  borderRight={index === ordered.length - 1}
                  quotes={columns.filter(ele => ele[props.filterItem] === key[props.filterColumn])}
                  isScrollable
                  isCombineEnabled={props.isCombineEnabled}
                  addItem={addItem}
                />
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
      <Snackbar open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} />
    </div>
  );
}

Planner.propTypes = {};
Planner.defaultProps = {
  filterItem: 'plannerStatus',
  filterColumn: 'code',
  filter: {},
  withScrollableColumns: true,
  code: 'PLANER',
};

export default Planner;
