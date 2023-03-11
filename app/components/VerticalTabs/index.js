/**
 *
 * VerticalTabs
 *
 */

// import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles';
import { Tabs } from '@material-ui/core/';
const VerticalTabs = withStyles(theme => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);
VerticalTabs.propTypes = {};

export default VerticalTabs;
