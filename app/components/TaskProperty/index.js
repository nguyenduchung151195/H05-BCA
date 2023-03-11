/**
 *
 * TaskProperty
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Draggable, Droppable } from 'react-beautiful-dnd';
// import { FormattedMessage } from 'react-intl';


/* eslint-disable */
const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  width: '400px';
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDragDisabled ? 'lightgrey' : props.isDragging ? 'lightgreen' : 'white')};
`;
/* eslint-enable */
/* eslint-disable react/prefer-stateless-function */
class TaskProperty extends React.Component {
  render() {
    /* eslint-disable */
    return (
      <React.Fragment>
        {this.props.columnID === 'column-1' ? (
          <Draggable draggableId={this.props.task.id} index={this.props.index}>
            {provided => (
              <div>
                <Container ref={provided.innerRef} innerRef={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={this.props.task.subItems && this.props.task.subItems.length > 0 ? { backgroundColor: '#58ACFA' } : { backgroundColor: 'white' }}>
                  {this.props.task.content}
                  <Droppable droppableId={this.props.task.id} type="droppableSubItem">
                    {provided => (
                      <Container ref={provided.innerRef} innerRef={provided.innerRef}>
                        {Array.isArray(this.props.task.subItems) && this.props.task.subItems.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {provided => (
                              <Container
                                ref={provided.innerRef}
                                innerRef={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {item.content}

                                {provided.placeholder}
                              </Container>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Container>
                    )}
                  </Droppable>
                </Container>
                {provided.placeholder}
              </div>
            )}
          </Draggable>
        ) : (
            <Draggable draggableId={this.props.task.id} index={this.props.index}>
              {provided => (
                <div>
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    {this.props.task.content}
                    <Droppable droppableId={this.props.task.id} type="droppableSubItem">
                      {provided => (
                        <div ref={provided.innerRef} innerRef={provided.innerRef}>
                          { this.props.task.subItems.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {provided => (
                                <Container ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  {item.content}

                                  {provided.placeholder}
                                </Container>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Draggable>
          )}
      </React.Fragment>
    );
    /* eslint-enable */
  }
}

TaskProperty.propTypes = {};

export default TaskProperty;
