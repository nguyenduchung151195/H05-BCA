import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

import QuoteList from './quote-list';

const grid = 8;
const borderRadius = 2;

const Container = styled.div`
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

export default class Column extends Component {
  render() {
    const { title, quotes, index, color, id, borderRight } = this.props;
    return (
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <Container color={color} ref={provided.innerRef} {...provided.draggableProps}>
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
              listType="QUOTE"
              borderRight={borderRight}
              style={{
                backgroundColor: snapshot.isDragging ? 'white' : null,
              }}
              quotes={quotes}
              internalScroll={this.props.isScrollable}
              isCombineEnabled={Boolean(this.props.isCombineEnabled)}
            />
          </Container>
        )}
      </Draggable>
    );
  }
}

//
