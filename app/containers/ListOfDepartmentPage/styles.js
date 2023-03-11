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
      // borderRadius: '5px',
    },
  },
  select: {
    width: '450px',
    display: 'block',
  },
  wrapContentDialog: {
    width: '505px',
    '&::-webkit-scrollbar': {
      width: '5px',
      borderRadius: '25px',
      background: '#E6E6E6',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#A4A4A4',
      borderRadius: '25px',
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
  HeaderAppBarListOfDepartment: {
    width: '100% !important',
    zIndex: '10 !important'
  },
  BTNListOfDepartment: {
    marginLeft: '15% !important  '
  }
});

export default styles;
