import React, { useRef } from 'react';
import { Fab as Fa, TextField as TextFieldUI, MenuItem, Tooltip } from '@material-ui/core';
import { Delete, CloudUpload } from '@material-ui/icons';
import { API_CUSTOMERS } from 'config/urlConfig';
import { TextField, Dialog as DialogUI, AsyncAutocomplete } from 'components/LifetekUi';
// import dot from 'dot-object';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import { convertTemplate } from '../../helper';
import { clearWidthSpace } from '../../utils/common';

const EmailDialog = props => {
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

  const { setDialogEmail, sendMail, dialogEmail, mail, setMail, state, setState, deleteFile } = props;
  const { templatess } = state;
  const editor = useRef();

  return (
    <DialogUI
      title="EMAIL"
      onSave={() => sendMail({ content: EditorUtils.getHtml(editor.current.view.state) })}
      saveText="Gửi mail"
      onClose={() => setDialogEmail(false)}
      open={dialogEmail}
      style={{ position: 'relative' }}
    >
      {/* <DialogTitle style={{ textAlign: 'center' }}>EMAIL</DialogTitle> */}
      <AsyncAutocomplete
        error={!mail.to || !mail.to.length}
        helperText={mail.to && mail.to.length ? false : 'Không được bỏ trống'}
        url={API_CUSTOMERS}
        value={mail.to}
        isMulti
        onChange={value => setMail({ ...mail, to: value })}
        label="Người nhận"
      />

      <TextField
        error={!mail.subject}
        helperText={mail.subject ? false : 'Không được bỏ trống'}
        onChange={e => setMail({ ...mail, subject: e.target.value = clearWidthSpace(e.target.value).trimStart()})}
        value={mail.subject}
        fullWidth
        label="Tiêu đề"
        autoFocus
      />
      <TextField
        error={!state.template}
        helperText={state.template ? false : 'Không được bỏ trống'}
        value={state.template}
        fullWidth
        select
        onChange={e => {
          const { value } = e.target;
          const { content } = templatess.find(e => e._id === value);
          convertTemplate({
            content,
            data: props.mail.to[0] ? (props.mail.to[0].originItem ? props.mail.to[0].originItem : props.mail.to[0]) : {},
            code: state.templatess[0].moduleCode,
          })
            .then(template => {
              EditorUtils.setHtml(editor.current.view, template);
              setState({ ...state, template: value });
            })
            .catch(console.log);
        }}
        label="Mẫu Email"
      >
        {templatess.map(item => (
          <MenuItem key={item._id} value={item._id}>
            {item.title}
          </MenuItem>
        ))}
      </TextField>

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
        ref={editor}
      />

      {/* <Tooltip title="Đính kèm file">
        <label
          htmlFor="contained-button-file"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '5px',
            cursor: 'pointer',
            marginLeft: '20px',
            padding: '6px 30px',
            border: '1px solid #359ff4',
            borderRadius: '4px',
            color: '#359ff4',
          }}
        >
          <CloudUpload />
        </label>
      </Tooltip> */}

      {state.files.map((i, v) => (
        <React.Fragment>
          <p style={{ padding: '0px', margin: '0px' }}>
            <span style={{ fontWeight: 'bold' }}>{i.name}</span>
            <span>
              <Tooltip title="Xóa file">
                <Delete onClick={() => deleteFile(v)} style={{ cursor: 'pointer', marginLeft: 20, color: '#f5594d' }} />
              </Tooltip>
            </span>
          </p>
        </React.Fragment>
      ))}
    </DialogUI>
  );
};

export default EmailDialog;
