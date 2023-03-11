const styles = theme => ({
  root: {
    width: '95%',
    margin: '0 auto',
    marginTop: 20,
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightRegular,
  },
  button: {
    margin: theme.spacing.unit,
  },
  textField: {
    width: '100%',
  },
  demo: {
    background: 'red',
  },
});

export default styles;
