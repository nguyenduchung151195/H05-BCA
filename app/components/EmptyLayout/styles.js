const styles = theme => ({
  card: {
    width: 500,
    minwidth: 350,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    paddingBottom: 52,
  },
  paper: {
    width: '100%',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  cardAct: {
    marginTop: -20,
  },
  textField: {
    margin: '0 auto',
    width: 350,
  },
  textField2: {
    marginTop: -8,
  },
  dense: {
    marginTop: 20,
  },
  button: {
    width: 350,
    margin: '0 auto',
  },
  login: {
    marginTop: 20,
  },
  GloginImg: {
    position: 'absolute',
    left: 10,
  },
  all: {
    width: '100%',
    margin: 'auto',
  },
  fogot: {
    float: 'left',
    textDecoration: 'none',
    color: '#00BFFF',
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    fontStyle: 'italic',
  },
  newAcc: {
    float: 'right',
    textDecoration: 'none',
    color: '#00BFFF',
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    fontStyle: 'italic',
  },
  formControl: {
    margin: theme.spacing.unit * 2,
  },
  footerText: {
    color: '#848484',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 30,
  },
});
export default styles;
