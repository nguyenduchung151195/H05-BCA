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
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  tabv: {
    '&::after': {
      width: 0,
      height: 0,
      borderTop: '25px solid transparent',
      borderLeft: '20px solid red',
      borderBottom: '25px solid transparent',
      float: 'left',
    },
  },
});

export default styles;
