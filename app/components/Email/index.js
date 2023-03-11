import React from 'react';
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  Input,
  Select,
  MenuItem,
  withStyles,
  Chip,
  Button,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import './style.css';
import { AsyncAutocomplete, TextField } from 'components/LifetekUi';
import { API_CUSTOMERS, API_TEMPLATE, API_MAIL } from 'config/urlConfig';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import { startCase } from 'lodash-es';
import _ from 'lodash';
import { convertTemplate, fetchData } from '../../helper';
import { clientId } from '../../variable';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  button: {
    margin: '5px',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3,
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];
const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell,
} = EditorTools;

const code = 'BusinessOpportunities';
const formType = 'email';

function getStyles(name, that) {
  return {
    fontWeight: that.state.name.indexOf(name) === -1 ? that.props.theme.typography.fontWeightRegular : that.props.theme.typography.fontWeightMedium,
  };
}

class EmailForm extends React.Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
    this.state = { name: [], templatess: [], mail: { to: [], subject: '', text: '' } };
  }



  handleChange = event => {
    this.setState({ name: event.name, mail: { to: event } });
  };

  componentDidMount() {
    // this.handleEmailDialog();
    this.handleDialogTemplateAlter();
  }

  componentUnmount() {
    this.sendMail();
  }

  handleDialogTemplateAlter() {
    fetchData(`${API_TEMPLATE}?clientId=${clientId}&filter[moduleCode]=${code}&filter[formType]=${formType}`)
      .then(templates => {
        const templatesItem = templates ? templates.filter(elm => elm.clientId === clientId) : null;
        this.setState(state => ({ ...state, templatess: templates }));
      })
      .catch(error => {
        // console.log(error);
      });
  }

  async sendMail(content) {

    try {
      const data = { ...this.state.mail };
      data.to = _.uniq(this.state.mail.to.map(i => i.email).filter(i => Boolean(i))).join();
      if (!data.to) {
        alert('Danh sách Khách hàng chọn không có email');
        return;
      }
      // const template = { ...this.state.template };
      if (!this.state.template || !this.state.mail.to) {
        alert('Gửi mail thất bại');
        return;
      }
      const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
      const formatData = {
        title: this.state.subject,
        template: this.state.template,
        viewConfig, // .find(item => item.code === code),
        html: content,
        listCustomer: this.state.mail.to,
        code,
      };
      await fetchData(API_MAIL, 'POST', formatData);
      alert('Gửi mail thành công');
    } catch (error) {
      // console.log(error);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid>
        <List>
          {/* <ListItem>
            <ListItemText primary="Từ:" />

            <Input
              fullWidth
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </ListItem> */}
          {/* <ListItem> */}
          {/* <ListItemText primary="Đến:" />
            <ListItemSecondaryAction /> */}
          {/* <Select
              fullWidth
              multiple
              value={this.state.name}
              onChange={this.handleChange}
              input={<Input id="select-multiple-chip" />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(value => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {names.map(name => (
                <MenuItem key={name} value={name} style={getStyles(name, this)}>
                  {name}
                </MenuItem>
              ))}
            </Select> */}
          {/* <div style={{width: '90%'}}> */}
          <AsyncAutocomplete
            isView={this.props.isView}
            error={!this.state.mail.to || !this.state.mail.to.length}
            helperText={this.state.mail.to && this.state.mail.to.length ? false : 'Không được bỏ trống'}
            url={API_CUSTOMERS}
            value={this.state.mail.to}
            isMulti
            fullWidth
            label="Đến"
            onChange={value => this.setState({ mail: { to: value } })}
          // style={{ width: '490px' }}
          />
          {/* </div> */}
          {/* </ListItem> */}
          {/* <ListItem> */}
          {/* <ListItemText primary="Tiêu đề:" />
            <ListItemSecondaryAction /> */}
          <TextField
            error={!this.state.subject}
            label="Tiêu đề"
            helperText={this.state.subject ? false : 'Không được bỏ trống'}
            onChange={e => this.setState({ ...this.state.mail, subject: e.target.value })}
            value={this.state.mail.subject}
            fullWidth
          />
          {/* </ListItem> */}
          <TextField
            error={!this.state.template}
            helperText={this.state.template ? false : 'Không được bỏ trống'}
            value={this.state.template}
            fullWidth
            select
            name="template"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => {
              this.setState({ [e.target.name]: e.target.value })
              const { value } = e.target;
              const { content } = this.state.templatess.find(e => e._id === value);
              convertTemplate({
                content,
                data: this.state.mail.to[0] ? this.state.mail.to[0] : {},
                code: this.props.moduleCode,
              })
                .then(template => {
                  EditorUtils.setHtml(this.editor.current.view, template);
                  this.setState(state => ({ ...state, template: value }));
                })
                .catch(console.log);

            }}
            label="Mẫu Email"
          >
            {this.state.templatess.map(item => (
              <MenuItem key={item._id} value={item._id}>
                {item.title}
              </MenuItem>
            ))}
          </TextField>
        </List>
        <Editor
          tools={[
            [Bold, Italic, Underline, Strikethrough],
            [Subscript, Superscript],
            [AlignLeft, AlignCenter, AlignRight, AlignJustify],
            [Indent, Outdent],
            [OrderedList, UnorderedList],
            FontSize,
            FontName,
            FormatBlock,
            [Undo, Redo],
            [Link, Unlink, InsertImage, ViewHtml],
            [InsertTable],
            [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
            [DeleteRow, DeleteColumn, DeleteTable],
            [MergeCells, SplitCell],
          ]}
          contentStyle={{ height: 300 }}
          ref={this.editor}
        />
        {this.props.isView
          ? null
          : <Button
            className={classes.button}
            color="primary"
            onClick={() => this.sendMail({ content: EditorUtils.getHtml(this.editor.current.view.state) })}
            variant="contained"
          >
            Gửi
          </Button>}
      </Grid>
    );
  }
}

EmailForm.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles, { withTheme: true })(EmailForm);
