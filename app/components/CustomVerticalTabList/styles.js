const styles = theme => ({
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
  