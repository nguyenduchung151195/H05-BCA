import { emphasize } from '@material-ui/core/styles/colorManipulator';
const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },

  menu: {
    width: 200,
  },

  input: {
    display: 'flex',
    padding: 8,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700], 0.08),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    marginTop: 20,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  HeaderAppBarAppProveGroup: {
    zIndex: '1030 !important',
    width: '86.5% !important'
  },
  BTNAppProveGroup :{
    // marginLeft: '15% !important'
  },
});
export default styles;
