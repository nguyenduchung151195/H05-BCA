import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import Slide from '@material-ui/core/Slide';
import DownloadLink from 'react-download-link';
const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class FullScreenDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button variant="contained" color="dark" onClick={this.handleClickOpen}>
          Đọc File
        </Button>
        <Dialog fullScreen style={{ marginLeft: '271px' }} open={this.state.open} onClose={this.handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label=" Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                {/* Writting about English */}
                Viết về tiếng anh
              </Typography>

              <DownloadLink filename="DocumentDriver.doc" style={{ color: 'white' }} label={<GetAppIcon />} exportFile={() => 'ngoc'} />

              {/* <Button color="inherit">
                <GetAppIcon />
              </Button> */}
            </Toolbar>
          </AppBar>
          <div>
            <iframe
              title="Excel"
              src="https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fzalo-file-doc6.zdn.vn%2Fd9accc9f3d15d14b8804%2F1582976287059835770"
              width="100%"
              style={{ height: 'calc(100vh - 60px)' }}
              value="file"
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

FullScreenDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullScreenDialog);
