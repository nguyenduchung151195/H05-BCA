import React from 'react';
import PropTypes from 'prop-types';

// material-ui components
import {
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';

// material-ui-icons
import { ExpandMore } from '@material-ui/icons';

import accordionStyle from 'assets/jss/material-dashboard-pro-react/components/accordionStyle';

class Accordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active,
    };
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      active: expanded ? panel : -1,
    });
  };

  render() {
    const { classes, collapses } = this.props;
    return (
      <div className={classes.root}>
        {collapses.map((prop, key) => (
          <ExpansionPanel
            expanded={this.state.active === key}
            onChange={this.handleChange(key)}
            key={key}
            classes={{
              root: classes.expansionPanel,
              expanded: classes.expansionPanelExpanded,
            }}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMore />}
              classes={{
                root: classes.expansionPanelSummary,
                expanded: classes.expansionPanelSummaryExpaned,
                content: classes.expansionPanelSummaryContent,
                expandIcon: classes.expansionPanelSummaryExpandIcon,
                expandIconExpanded:
                  classes.expansionPanelSummaryExpandIconExpanded,
              }}
            >
              <h4 className={classes.title}>{prop.title}</h4>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionPanelDetails}>
              {prop.content}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </div>
    );
  }
}

Accordion.defaultProps = {
  active: -1,
};

Accordion.propTypes = {
  classes: PropTypes.object.isRequired,
  // index of the default active collapse
  active: PropTypes.number,
  collapses: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.node,
    }),
  ).isRequired,
};

export default withStyles(accordionStyle)(Accordion);
