import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { TableHead, TableCell, TableRow, Table } from '@material-ui/core';
const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
    minWidth: 600,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
  err: {
    color: 'red',
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} style={{ borderBottom: '1px solid gainsboro' }}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    maxHeight: '60vh',
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

class ImportResult extends React.PureComponent {
  state = {
    open: false,
  };

  componentWillUpdate(props) {
    const { data } = props;
    // LocalConvenienceStoreOutlined
    if (data.success === false) {
      this.state.open = true;
    } else {
      this.state.open = false;
    }
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, data } = this.props;
    let currentData = data.data || [];
    const currentDataResult = currentData[0] !== undefined ? currentData.filter(item => item.success === false) : null;
    return (
      <div>
        <Button style={!this.props.data.success ? {} : { display: 'none' }} variant="outlined" color="secondary" onClick={this.handleClickOpen}>
          Xem lại log
        </Button>
        <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.open}>
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            Lỗi
          </DialogTitle>
          <DialogContent dividers>
            <Table>
              <TableHead>
                <TableCell>Dòng</TableCell>
                <TableCell>Lỗi</TableCell>
              </TableHead>
              {currentDataResult && currentDataResult.length !== 0
                ? currentDataResult.map((item, index) => (
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className={classes.err}>
                      {item && item.errors && item.errors && Array.isArray(item.errors) && item.errors.map(err => (
                        <p>{err}</p>
                      ))}
                    </TableCell>
                  </TableRow>
                ))
                : null}
            </Table>
          </DialogContent>
          <DialogActions style={{ borderTop: '1px solid gainsboro' }}>
            <Button onClick={this.handleClose} color="primary">
              Tiếp tục
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(ImportResult);
