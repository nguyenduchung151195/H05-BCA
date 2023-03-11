const styles = theme => ({
  breadcrumbs: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    marginBottom: '20px',
    // maxWitdth: 500,
  },
  tableContainer: {
    overflow: 'scroll',
    [theme.breakpoints.down('sm')]: {
      overflow: 'scroll',
      // width: 300,
      // width: window.screen.width - 115,
    },
    // [theme.breakpoints.up('md')]: {
    //   width: window.screen.width - 310,
    // },
    /* width */
    // '&::-webkit-scrollbar': {
    //   width: 10,
    // },
    // /* Track */
    // '&::-webkit-scrollbar-track': {
    //   background: '#f1f1f1',
    // },
    // /* Handle */
    // '&::-webkit-scrollbar-thumb': {
    //   background: '#888',
    // },
  },
  tbRow: {
    '&:hover': {
      backgroundColor: '#58D3F7',
      cursor: 'pointer',
    },
  },
});
export default styles;
