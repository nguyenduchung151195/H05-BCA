import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import { Tab, Tabs, Grid, Typography, Button, Tooltip } from '@material-ui/core';
import moment from 'moment';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Scanner } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import CustomInputBase from '../../../components/Input/CustomInputBase';
import CustomDatePicker from '../../../components/CustomDatePicker';
import CustomInputField from '../../../components/Input/CustomInputField';
import ScanDialog from 'components/ScanDoc/ScanDialog'

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
    Link: EditorLink,
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

function FormFile(props) {
    const { onGetData } = props;
    const editor = useRef();
    const INIT_STATE = {
        file: [],
        name: '',
        notation: '',
        docs: [],
    }
    const [tab, setTab] = useState();
    const [localStateData, setLocalStateData] = useState(INIT_STATE)
    const [localMessages, setLocalMessages] = useState({

    })
    const [scanDialog, setScanDialog] = useState();

    const handleChangeTab = (e, value) => {
        setTab(value)
    }
    const handleInputChange = useCallback(
        (e, _name, _value) => {
            const name = e ? e.target.name : _name;
            const value = e ? e.target.value : _value;
            setLocalStateData({ ...localStateData, [name]: value });
        },
        [localStateData],
    );
    const handleGetDocument = useCallback(
        () => {
            // call get list
        },
        [localStateData.name, localStateData.notation],
    );

    const handleChangeType = name => e => {
        setLocalStateData({ ...localStateData, [name]: e.target.value });
    };

    function handleFileChange(e) {
        const files = e.target.files;
        setLocalStateData(pre => ({ ...pre, file: [...pre.file, ...files] }));
    }

    function handleFileDelete(index) {
        const newFiles = localStateData.file.filter((i, idx) => idx !== index);
        setLocalStateData({ ...localStateData, file: newFiles });
    }
    useEffect(() => {
        onGetData(localStateData)
    }, [localStateData.file.length])

    return (
        <div>
            <Tabs value={tab} onChange={handleChangeTab} indicatorColor="primary" textColor="primary">
                <Tab value="content" label="Nội dung văn bản" />
                <Tab value="documentReplace" label="Văn bản thay thế" />
            </Tabs>
            {tab === 'content' ? (
                <Grid container spacing={8} justify="space-between" alignItems="center" style={{ marginTop: 20 }}>
                    <Grid item xs="3">
                        <CustomInputBase
                            label={"Số ký hiệu văn bản"}
                            value={localStateData.notation}
                            name="notation"
                            onChange={e => handleInputChange(e)}
                            error={localMessages && localMessages.notation}
                            helperText={localMessages && localMessages.notation}
                        // required={checkRequired.name}
                        // checkedShowForm={checkShowForm.name}
                        />
                    </Grid>
                    <Grid item xs="9">
                        <CustomInputBase
                            label={"Tên văn bản"}
                            value={localStateData.name}
                            name="name"
                            onChange={e => handleInputChange(e)}
                            error={localMessages && localMessages.name}
                            helperText={localMessages && localMessages.name}
                        // required={checkRequired.name}
                        // checkedShowForm={checkShowForm.name}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomDatePicker
                            label={'Ngày ban hành'}
                            value={localStateData.documentDate}
                            name="documentDate"
                            invalidLabel="DD/MM/YYYY"
                            onChange={e => handleInputChange(null, 'documentDate', moment(e).format('YYYY-MM-DD'))}
                            error={localMessages && localMessages.documentDate}
                            helperText={localMessages && localMessages.documentDate}
                        // required={checkRequired.documentDate}
                        // checkedShowForm={checkShowForm.documentDate}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomDatePicker
                            label={'Ngày có hiệu lực'}
                            value={localStateData.toBookDate}
                            name="toBookDate"
                            invalidLabel="DD/MM/YYYY"
                            onChange={e => handleInputChange(null, 'toBookDate', moment(e).format('YYYY-MM-DD'))}
                            error={localMessages && localMessages.toBookDate}
                            helperText={localMessages && localMessages.toBookDate}
                        // required={checkRequired.toBookDate}
                        // checkedShowForm={checkShowForm.toBookDate}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomDatePicker
                            label={'Ngày hết hiệu lực'}
                            value={localStateData.toBookExpireDate}
                            name="toBookExpireDate"
                            invalidLabel="DD/MM/YYYY"
                            onChange={e => handleInputChange(null, 'toBookExpireDate', moment(e).format('YYYY-MM-DD'))}
                            error={localMessages && localMessages.toBookExpireDate}
                            helperText={localMessages && localMessages.toBookExpireDate}
                        // required={checkRequired.toBookDate}
                        // checkedShowForm={checkShowForm.toBookDate}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomInputField
                            label={"Trạng thái"}
                            configType="crmSource"
                            configCode="S29"
                            type="Source|CrmSource,S29|Value||value"
                            name="signingType"
                            value={localStateData.signingType}
                            onChange={handleChangeType('signingType')}
                            error={localMessages && localMessages.signingType}
                            helperText={localMessages && localMessages.signingType}
                        // required={checkRequired.signingType}
                        // checkedShowForm={checkShowForm.signingType}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomInputField
                            label={"Hình thức văn bản"}
                            configType="crmSource"
                            configCode="S28"
                            type="Source|CrmSource,S28|Value||value"
                            name="source"
                            value={localStateData.source}
                            onChange={handleChangeType('source')}
                            error={localMessages && localMessages.source}
                            helperText={localMessages && localMessages.source}
                        // required={checkRequired.source}
                        // checkedShowForm={checkShowForm.source}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomInputBase
                            label={"Cơ quan ban hành"}
                            value={localStateData.sourceDetail}
                            name="sourceDetail"
                            onChange={e => handleInputChange(e)}
                            error={localMessages && localMessages.sourceDetail}
                            helperText={localMessages && localMessages.sourceDetail}
                        // required={checkRequired.sourceDetail}
                        // checkedShowForm={checkShowForm.sourceDetail}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography align="left" variant="h6">Nội dung văn bản</Typography>
                    </Grid>
                    <Grid item xs={12}>
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
                                [EditorLink, Unlink, InsertImage, ViewHtml],
                                [InsertTable],
                                [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                                [DeleteRow, DeleteColumn, DeleteTable],
                                [MergeCells, SplitCell],
                            ]}
                            contentStyle={{ height: 200 }}
                            ref={editor}
                            defaultContent={'<p>Hello world</p>'}
                        // contentElement={props.addPlan.desHtml}
                        />
                    </Grid>
                    <div style={{ marginTop: 10 }}>
                        <span style={{ marginRight: 10, fontSize: 14, fontWeight: 600 }}>Tệp đính kèm</span>
                        <label htmlFor="fileUpload" style={{ display: 'inline-block', marginRight: 10 }}>
                            <Button color="primary" variant="outlined" component="span">
                                <span style={{ marginRight: 5 }}>
                                    <AttachFileIcon />
                                </span>
                                Tệp đính kèm
                            </Button>
                        </label>
                        <label htmlFor="fileScan">
                            <Button color="primary" variant="contained" component="span" onClick={() => setScanDialog({})}>
                                {/* <span style={{ marginRight: 5 }}>
                                    <Scanner />
                                </span> */}
                                <span style={{ fontWeight: 'bold' }}>
                                    Quét văn bản
                                </span>
                            </Button>
                        </label>
                    </div>
                    <input onChange={handleFileChange} id="fileUpload" style={{ display: 'none' }} name="fileUpload" type="file" multiple />
                    <Grid container style={{ marginTop: 15 }} alignItems="center" spacing={8}>
                        {localStateData.file &&
                            localStateData.file.map((item, index) => (
                                <Grid item>
                                    {item.name}
                                    <Tooltip title="Hủy bỏ">
                                        <CloseIcon
                                            style={{ width: 14, height: 14, marginLeft: 10 }}
                                            onClick={() => {
                                                handleFileDelete(index);
                                            }}
                                        />
                                    </Tooltip>
                                </Grid>
                            ))}
                    </Grid>
                </Grid>
            ) : null}
            {tab === 'documentReplace' ? (
                <Grid container spacing={8} justify="space-between" alignItems="center" style={{ marginTop: 20 }}>
                    <Grid item xs="3">
                        <CustomInputBase
                            label={"Số ký hiệu văn bản"}
                            value={localStateData.notation}
                            name="notation"
                            onChange={e => handleInputChange(e)}
                            error={localMessages && localMessages.notation}
                            helperText={localMessages && localMessages.notation}
                        // required={checkRequired.name}
                        // checkedShowForm={checkShowForm.name}
                        />
                    </Grid>
                    <Grid item xs="9">
                        <CustomInputBase
                            label={"Tên văn bản"}
                            value={localStateData.name}
                            name="name"
                            onChange={e => handleInputChange(e)}
                            error={localMessages && localMessages.name}
                            helperText={localMessages && localMessages.name}
                        // required={checkRequired.name}
                        // checkedShowForm={checkShowForm.name}
                        />
                    </Grid>

                    <div style={{ marginTop: 10 }}>
                        <label htmlFor="Searching" style={{ display: 'inline-block', marginRight: 10 }}>
                            <Button color="primary" variant="outlined" component="span" onClick={() => handleGetDocument()}>
                                <span style={{ marginRight: 5 }}>
                                    <AttachFileIcon />
                                </span>
                                <span style={{ fontWeight: 'bold' }}>
                                    Tải văn bản
                                </span>
                            </Button>
                        </label>
                        <label htmlFor="Scanning">
                            <Button color="primary" variant="outlined" component="span">
                                <span style={{ marginRight: 5 }}>
                                    <Scanner />
                                </span>
                                Scan Văn bản
                            </Button>
                        </label>
                    </div>
                </Grid>
            ) : null}


            <ScanDialog
                onSave={(file) => handleFileChange(file)}
                scanDialog={scanDialog}
                setScanDialog={setScanDialog}
            />
        </div>
    )
}

export default FormFile;