const styles = theme => ({
  BTNH: {
    color: 'danger !important',
    float: 'right !important',
    marginRight: 20,
    marginTop: 20,
  },
  textField: {
    width: '90%',
    marginLeft: 35,
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    margin: '0 auto',
    width: 660,
  },
  productBlock: {
    // display: 'flex',
    // justifyContent: 'space-around',
    marginTop: 10,
  },
  boxProductBlock: {
    width: '10%',
    float: 'left',
  },
  table: {
    // minWidth: 500,
    // margin: 10,
  },
  titleTable: {
    marginLeft: '20px',
  },
  link: {
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    // maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },

  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  BTNL: {
    float: 'right !important',
    marginRight: 20,
    marginTop: 20,
  },
  HearderappBarCollection: {
    zIndex: '1002 !important',
    width: '100% !important',
  },
  BTNCollection: {
    // marginLeft: '266px !important',
  },
  BoCRM: {
    flex: 1,
  }
});
export default styles;
