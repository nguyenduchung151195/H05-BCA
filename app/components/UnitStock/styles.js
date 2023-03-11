const styles = theme => ({
  treeView: {
    verticalAlign: 'top',
    marginLeft: 10,
    marginTop: 10,
    fontSize: '18px',

    overflow: 'auto',
  },
  treeItem: {
    '&:hover': {
      backgoundColor: 'white !important',
    },
  },
  add: {
    color: 'green',
    marginLeft: 10,
    textTransform: 'none',
  },
  edit: {
    color: 'orange',
    marginLeft: 10,
    textTransform: 'none',
  },
  delete: {
    color: 'red',
    marginLeft: 10,
    textTransform: 'none',
  },
  button: { textTransform: 'none' },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '97%',
  },
});
export default styles;
