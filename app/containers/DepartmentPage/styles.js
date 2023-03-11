const styles = theme => ({
  card: {
    padding: theme.spacing.unit * 3,
  },
  title: {
    fontWeight: 600,
    color: '#0795db',
    verticalAlign: 'middle',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  paper: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    marginBottom: '20px',
  },
  breadcrumbs: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    marginBottom: '20px',
    // maxWitdth: 500,
  },
  wrap: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  dialog: {
    '&::-webkit-scrollbar': {
      width: '0px',
    },
  },
  select: {
    width: '450px',
    display: 'block',
  },
  wrapContentDialog: {
    width: '500px',
    '&::-webkit-scrollbar': {
      width: '0px',
    },
  },
  textField: {
    marginTop: '15px',
    width: '220px',
  },
  textField2: {
    marginTop: '15px',
    width: '450px',
  },
});

export default styles;
