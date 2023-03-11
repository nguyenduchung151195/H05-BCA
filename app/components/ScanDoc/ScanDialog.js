

import React, { useState, useEffect, useRef } from 'react';
import { DialogTitle, TextField, MenuItem, Button, Grid, Fab } from '@material-ui/core';
import { API_DOWNLOAD_SCAN_DOC } from 'config/urlConfig';
import Dialog from '../LifetekUi/Dialog'
import { getDevice, scan } from 'utils/api/scanners';
import _ from 'lodash'
import { sortableContainer } from 'react-sortable-hoc';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Menu, Delete, Edit, Home, Visibility } from '@material-ui/icons';
import CustomInputField from 'components/Input/CustomInputField';
import CustomInputBase from 'components/Input/CustomInputBase';
import jsPDF from "jspdf";
import { checkExistHtml } from '../../utils/common';

const OPTIONS = ['JPEG']

const A4_PAPER_DIMENSIONS = {
    width: 210,
    height: 297,
};

const SortableContainer = sortableContainer(({ children }) => <ul style={{ width: '100%', padding: 0 }}>{children}</ul>);

function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

const ScanDialog = props => {
    const { onSave, scanDialog, setScanDialog } = props

    const [scanDevices, setScanDevices] = useState([]);
    const [name, setName] = useState('Tài liệu');
    const [option, setOption] = useState(OPTIONS[0]);
    const [open, setOpen] = useState();
    const [spinning, setSpinning] = useState();
    const [findingScan, setFindingScan] = useState();
    const [uploadedImages, setUploadedImages] = useState([]);
    const [url, setUrl] = useState();
    const [error, setError] = useState(false)
    const page = useRef(0)
    
    useEffect(() => {
        if (!open && scanDialog) setOpen(true)
        else if (open && !scanDialog) setOpen(false)
    }, [open, scanDialog])


    useEffect(() => {
        if (open) {
            page.current = 0
            onGetDevice()
            setUploadedImages([])
        }
    }, [open])

    const onGetDevice = () => {
        getDevice({
            onGetMessage: (res) => {
                if (res && res.data) {
                    const arr = JSON.parse(res.data.replace(/\\/g, '\\'))
                    if (Array.isArray(arr)) {
                        setScanDevices(arr)
                        if (arr.length > 0) {
                            setScanDialog(e => e ? ({ ...e, scan: arr[0].Id }) : e)
                        }
                    } else if (true) {

                    }
                }
            },
            onGetError: () => {
                setScanDialog(e => e ? ({ ...e, error: 'noSocket' }) : e)
            }
        })
    }

    const onScan = () => {
        if (!scanDialog.scan) return
        const fileName = name
        setSpinning(true)
        setFindingScan(true)
        scan({
            body: {
                "DeviceId": scanDialog.scan,
                "ImgType": option
            },
            onGetMessage: (res) => {
                // setFindingScan(false)
                //console.log(res)
                if (res && res.data && res.data.length > 100) {
                    page.current = page.current + 1
                    const base64 = res.data
                    let newName = `${fileName}`
                    newName = `${page.current}`
                    // if (page > 1) newName += `_trang_${page}`
                    newName += '.jpg'
                    setUploadedImages(e => [...e, { name: newName, base64 }])
                    // const file = { target: { files: [dataURLtoFile(`data:image/jpg;base64,${base64}`, newName)], name: scanDialog.name } }
                    // onSave(file)
                }
            }
        })

        setTimeout(() => {
            setFindingScan(false)
        }, [3000])

        setTimeout(() => {
            setSpinning(false)
            // setScanDialog()
        }, [10000])
    }

    const reload = () => {
        setScanDialog(e => ({ ...e, error: null }))
        onGetDevice()
    }


    const onDragEnd = result => {
        const { source, destination } = result;
        if (!destination) return
        const s = source.index
        const e = destination.index
        const newList = []
        uploadedImages.forEach((img, idx) => {
            if (idx !== s) {
                if (idx === e && s > e) newList.push({ ...uploadedImages[s] })
                newList.push(img)
                if (idx === e && e > s) newList.push({ ...uploadedImages[s] })
            }
        })
        setUploadedImages(newList)
    };

    const onUpload = () => {
        setSpinning(true)
        const files = uploadedImages.map((e, idx) => dataURLtoFile(`data:image/jpg;base64,${e.base64}`, idx > 0 ? `${name}_trang_${idx + 1}.jpg` : `${name}.jpg`))
        onSave({ target: { files, name: scanDialog.name } })

        setTimeout(() => {
            setSpinning(false)
            setScanDialog()
        }, [1000])
    }

    const onUploadPDF = () => {
        setSpinning(true)
        setTimeout(() => {
            const doc = new jsPDF();
            doc.deletePage(1);

            uploadedImages.forEach((image) => {
                doc.addPage();
                doc.addImage(`data:image/jpg;base64,${image.base64}`, 'image/jpg', 0, 0, A4_PAPER_DIMENSIONS.width, A4_PAPER_DIMENSIONS.height);
            });

            const pdfURL = doc.output("arraybuffer");
            onSave({ target: { files: [new File([pdfURL], `${name}.pdf`,{type : 'application/pdf'})] }, name: scanDialog.name })

            setTimeout(() => {
                setSpinning(false)
                setScanDialog()
            }, [1000])
        }, [100])
    }
    return <Dialog maxWidth='md' fullWidth open={scanDialog}
        onSave={onScan}
        onClose={() => setScanDialog()}
        saveText='Quét văn bản'
        disableSave={spinning}
        disableCancel={spinning}
        moreButtons={
            <>
                {uploadedImages.length > 0 ?
                    <>
                        <Button color="primary" variant="contained" component="span" onClick={onUploadPDF} disabled={spinning} style={{ marginRight: 5 }}>
                            <span style={{}}>Tải lên PDF</span>
                        </Button>
                        <Button color="primary" variant="contained" component="span" onClick={onUpload} disabled={spinning} style={{ marginRight: 5 }}>
                            <span style={{}}>Tải lên</span>
                        </Button>
                    </>
                    : null}
                <Button color="primary" variant="contained" component="span" onClick={reload} disabled={spinning}>
                    <span style={{}}>Tìm máy quét</span>
                </Button>
            </>
        }
    >
        <DialogTitle style={{ padding: '0 0 20px 0' }}>
            Quét văn bản
        </DialogTitle>

        <TextField
            label={_.get(scanDialog, 'scan') ? '' : 'Chọn máy quét'}
            select
            variant="outlined"
            fullWidth
            value={_.get(scanDialog, 'scan')}
            onChange={e => {
                setScanDialog({ ...scanDialog, scan: e.target.value });
            }}
        >
            {scanDevices.map((item, index) => {
                return <MenuItem value={item.Id}>{item.Name}</MenuItem>;
            })}
        </TextField>


        <CustomInputBase
            label={'Tên mặc định'}
            value={name}
            onChange={e => {
                const value = e.target.value
                if (checkExistHtml(value) ){
                    setError(true)
                }
                else {
                    setError(false)
                    setName(value)
                }
                console.log(error);
            }
                
               }

            
        />
        <p style={{color: 'red'}}>{error ? 'Ko nhập ký tự chứa HTML' : ''}</p>

        {/* <Grid container spacing={8}>
            {images.map(image => {

                return <G
            })}
        </Grid> */}






        {/* <TextField
            label={''}
            select
            variant="outlined"
            fullWidth
            value={option}
            onChange={e => setOption(e.target.value)}
        >
            {OPTIONS.map((item, index) => {
                return <MenuItem value={item}>{item}</MenuItem>;
            })}
        </TextField> */}

        {_.get(scanDialog, 'error') === 'noSocket' && <p style={{ color: '#dc3545' }}>Không tìm thấy phần mềm! <a onClick={() => { }} href={API_DOWNLOAD_SCAN_DOC} download target="_blank">Tải xuống</a></p>}
        {findingScan ? <p style={{ color: '#2196F3' }}>Đang mở phần mềm quét</p> : null}
        {/* {uploadedImages.map((base64) => (
            <img key={image.src} src={image.src} className="uploaded-image" />
        ))} */}
        <SortableContainer useDragHandle>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} style={{
                            background: snapshot.isDraggingOver ? 'lightblue' : '#d3d3d300',
                            padding: 5,
                        }}>
                            {uploadedImages.map((item, index) => (
                                <Draggable key={item.base64} draggableId={item.base64} index={index}>
                                    {(provided, snapshot) => (
                                        <React.Fragment>
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    userSelect: 'none',
                                                    padding: 5 * 1.75,
                                                    margin: `0 0 ${5}px 0`,
                                                    borderRadius: '3px',
                                                    color: 'white',
                                                    background: 'linear-gradient(to right,#2196F3,#00BCD4)',
                                                    ...provided.draggableProps.style,
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <Menu />
                                                        <span style={{ paddingLeft: 5 }}>{item.name}</span>
                                                    </div>
                                                    <div>
                                                        <Fab color="secondary" size="small" onClick={() => setUploadedImages(uploadedImages.filter((e, idx) => idx !== index))}>
                                                            <Delete />
                                                        </Fab>
                                                        <Fab color="primary" size="small" onClick={() => setUrl(item)}>
                                                            <Visibility />
                                                        </Fab>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </Draggable>
                            ))}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </SortableContainer>


        <Dialog maxWidth={false} fullScreen open={url} onClose={() => setUrl()}>
            <div style={{ height: '1000px', textAlign: 'center' }} >
                <img alt="HHH" src={`data:image/jpg;base64,${_.get(url, 'base64')}`} style={{ maxHeight: 800 }} />
            </div>
        </Dialog>
    </Dialog >
}

export default ScanDialog