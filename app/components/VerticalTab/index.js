import withStyles from '@material-ui/core/styles';
import { Tab } from '@material-ui/core/';
const VerticalTab = withStyles(() => ({
    selected: {
        color: 'white',
        backgroundColor: `#2196F3`,
        borderRadius: '5px',
        boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
    },
    root: {},
}))(Tab);
VerticalTab.propTypes = {};

export default VerticalTab;