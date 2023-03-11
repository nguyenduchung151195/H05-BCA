const styles = theme => ({
  breadcrumbs: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    marginBottom: '20px',
    // maxWitdth: 500,
  },
  paper: {
    padding: 20,
    marginBottom: 20,
  },
  paperTitle: {
    fontWeight: 550,
    fontSize: '18px',
    verticalAlign: 'middle',
    marginLeft: 10,
  },
  spanTitle: {
    color: '#A4A4A4',
    fontStyle: 'italic',
    fontWeight: 600,
  },
  textField: {
    width: '99%',
    margin: '0 10px',
    marginTop: 10,
    marginBottom: 10,
  },
  btn: {
    marginLeft: 10,
    marginTop: 10,
  },
  treeView: {
    display: 'inline-block',
    verticalAlign: 'top',
    marginLeft: 10,
    marginTop: 10,
    fontSize: '18px',
  },
  tabRoot: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  tabSelected: {},
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  HeaderAppBarRoleGroup: {
    width: '100% !important',
    zIndex: '999 !important'
  },
  BTNRoleGroup: {
    marginLeft: '15% !important',
  }
});

export default styles;
