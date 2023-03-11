const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    margin: '0 auto',
    width: 660,
  },
  productBlock: {
    display: 'flex',
    justifyContent: 'space-around',
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
});
export default styles;
