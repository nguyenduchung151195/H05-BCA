import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Folder, InsertDriveFile, Description } from '@material-ui/icons';

const styles = {
  root: {
    flexGrow: 1,
  },
};

const data = [
  { name: 'Windows 10 Vesion', type: 'folder', createdBy: { _id: '45451', name: 'Hoàng Tiến Lăng' } },
  { name: 'MKE', type: 'folder', createdBy: { _id: '45452', name: 'Hoàng Tiến Lăng' } },
  { name: 'PROJECT', type: 'folder', createdBy: { _id: '45453', name: 'Hoàng Tiến Lăng' } },
  { name: 'CARBON', type: 'folder', createdBy: { _id: '45454', name: 'Hoàng Tiến Lăng' } },
  { name: 'tailieumat.docx', type: 'image', createdBy: { _id: '45454', name: 'Hoàng Tiến Lăng' } },
  { name: 'anhdep.jpg', type: 'jpg', createdBy: { _id: '45454', name: 'Hoàng Tiến Lăng' } },
];

const WrapIcon = props => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 150,
      height: 160,
      border: '1px solid #9281816b',
      borderRadius: 2,
      margin: 10,
      padding: 5,
      flexDirection: 'column',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 140,
      }}
    >
      {props.children}
    </div>
    <div
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis ',
        width: '100%',
        margin: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      {props.description}
    </div>
  </div>
);
const FolderIcon = props => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 150,
      height: 160,
      border: '1px solid #9281816b',
      borderRadius: 2,
      margin: 10,
      padding: 5,
      flexDirection: 'column',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 140,
      }}
    >
      {' '}
      <Folder {...props} style={{ fontSize: '4rem', color: 'rgba(77, 77, 77, 0.72)' }} />
    </div>
    <div
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis ',
        width: '100%',
        margin: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Folder {...props} style={{ fontSize: '1.6rem', color: 'rgba(77, 77, 77, 0.72)', padding: 3 }} /> <span>Windows 10 Vesion</span>
    </div>
  </div>
);
const InsertDriveFileIcon = props => <InsertDriveFile {...props} style={{ fontSize: '5rem', margin: 10, color: 'blue' }} />;
class Drive extends React.Component {
  state = {
    value: 0,
    test: 1,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { test } = this.state;
    return (
      <Paper className={classes.root}>
        <Tabs value={this.state.value} onChange={this.handleChange} indicatorColor="primary" textColor="primary" centered>
          <Tab label="Kho dữ liệu số cá nhân" />
          <Tab label="Kho dữ liệu số công ty" />
          <Tab label="Kho dữ liệu số dự án" />
          <Tab label="Được chia sẻ với tôi" />
        </Tabs>
        {this.state.value === 0 && (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {test === 1 && <FolderIcon onDoubleClick={() => this.setState({ test: 2 })} />}
            {test === 2 && (
              <React.Fragment>
                <FolderIcon onDoubleClick={() => this.setState({ test: 3 })} />
                <FolderIcon onDoubleClick={() => this.setState({ test: 3 })} />
                <FolderIcon onDoubleClick={() => this.setState({ test: 3 })} />
                <FolderIcon onDoubleClick={() => this.setState({ test: 3 })} />
                <FolderIcon onDoubleClick={() => this.setState({ test: 3 })} />
                <WrapIcon
                  description={
                    <React.Fragment>
                      {' '}
                      <Description style={{ fontSize: '1.6rem', color: '#2196F3', padding: 3 }} /> <span>Windows 10 Vesion</span>
                    </React.Fragment>
                  }
                >
                  <Description style={{ fontSize: '4rem', color: '#2196F3' }} />
                </WrapIcon>
              </React.Fragment>
            )}
            {test === 3 && (
              <React.Fragment>
                <InsertDriveFileIcon />
              </React.Fragment>
            )}
          </div>
        )}
        {this.state.value === 1 && <div>34</div>}
        {this.state.value === 2 && <div>434</div>}
      </Paper>
    );
  }
}

Drive.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Drive);
