import React from 'react';
import {
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  Input,
  Button,
} from '@material-ui/core';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class ModalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
    };
  }

  handleSave() {
    const { columns } = this.state;
    this.props.saveSetting(columns);
  }

  handleCancel() {
    const { columns } = this.props;
    this.setState({ columns });
    this.props.saveSetting(columns);
  }

  handleChecked(e) {
    const { columns } = this.state;
    const curentColumns = { name: e.target.name, checked: e.target.checked };
    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...curentColumns, title: item.title } : item));
    this.setState({ columns: newColumns });
  }

  handleChange(e) {
    const { columns } = this.state;
    const curentColumns = { name: e.target.name, title: e.target.value };
    const newColumns = columns.map(item => (item.name === curentColumns.name ? { ...curentColumns, checked: item.checked } : item));
    this.setState({ columns: newColumns });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.statusColumn !== this.props.statusColumn) this.setState({ columns: nextProps.columns });
  }

  // componentDidUpdate(prevProps) {
  //   // Typical usage (don't forget to compare props):
  //   if (this.props.statusColumn !== prevProps.statusColumn) {
  //     this.setState({ columns: this.props.columns });
  //   }
  // }

  render() {
    const { classes, onClose, saveSetting, ...rest } = this.props;
    const { columns } = this.state;
    return (
      <Dialog TransitionComponent={Transition} {...rest} onClose={onClose}>
        <DialogTitle>
          <h4>Cài đặt hiển thị</h4>
        </DialogTitle>
        <DialogContent>
          <List dense>
            {columns.map(item => (
              <ListItem key={item.name}>
                <ListItemText primary={<Input name={item.name} value={item.title} onChange={e => this.handleChange(e)} />} />
                <ListItemSecondaryAction>
                  <Checkbox
                    color="primary"
                    onChange={e => this.handleChecked(e)}
                    inputProps={{
                      name: item.name,
                    }}
                    checked={item.checked}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => this.handleSave()} color="primary">
            Lưu
          </Button>
          <Button variant="contained" color="secondary" onClick={() => this.handleCancel()}>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ModalForm;
