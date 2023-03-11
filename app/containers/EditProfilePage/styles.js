const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
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
  },
  textField1: {
    width: '100%',
  },
  tetxCheckBox: {
    justifyContent: 'left',
    alignItems: 'center',
  },
  btnAppBar: {
    width: '25%',
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
});
export default styles;
