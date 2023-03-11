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
  avatar: {
    width: '300px',
    height: '300px',
    // height: '100%',
    marginBottom: '20px',
    '@media screen and (max-width: 1360px)': {
      width: '190px',
      height: '190px',
    },
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  textFieldAva: {
    opacity: 0,
    width: '300px',
    height: '300px',
    position: 'absolute',
    zIndex: '999',
    margin: '0px',
  },
  spanAva: {
    width: '300px',
    height: '300px',
    position: 'absolute',
    backgroundColor: '#0795db',
    opacity: '0',
    borderRadius: '50%',
    '@media screen and (max-width: 1360px)': {
      width: '190px',
      height: '190px',
    },
  },
  iconCam: {
    fontSize: '50px',
    marginTop: '130px',
    marginLeft: '125px',
    '@media screen and (max-width: 1360px)': {
      marginTop: '75px',
      marginLeft: '70px',
    },
  },
  textField: {
    width: '95%',
    marginLeft: 25,
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  button: {
    margin: 25,
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

export default styles;
