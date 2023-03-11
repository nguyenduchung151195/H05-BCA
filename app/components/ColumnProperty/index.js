/**
 *
 * ColumnProperty
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import { Droppable } from 'react-beautiful-dnd';
import TaskProperty from '../TaskProperty';

// import { FormattedMessage } from 'react-intl';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: '400px';
  display: flex;
  flex-direction: column;
`;
// const Title = styled.h3`
//   padding: 8px;
// `;
const TaskList = styled.div`
  padding: 8px;
  width: '400px';
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')}
  flex-grow: 1;
  min-height: 400px;
`;
/* eslint-disable react/prefer-stateless-function */
class ColumnProperty extends React.Component {
  render() {
    const { column, tasks } = this.props;
    // console.log('tasks', tasks)
    return (
      <React.Fragment>
        <Grid item md={6}>
          <Container>
            {/* <Title>{this.props.column.title}</Title> */}
            <Droppable droppableId={column.id} type="TASK">
              {provided => (
                <TaskList ref={provided.innerRef}>
                  {tasks.map((task, index) => (
                    <TaskProperty key={task.id} columnID={column.id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          </Container>
        </Grid>
      </React.Fragment>
    );
  }
}

ColumnProperty.propTypes = {
  column: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
};

export default ColumnProperty;
