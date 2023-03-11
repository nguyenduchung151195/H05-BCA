import React, { useEffect, useState } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import NumberFormat from 'react-number-format';
import { Dialog as DialogUI } from 'components/LifetekUi';
import { Fab,Grid,} from '@material-ui/core';
import CustomInputField from 'components/Input/CustomInputField';
import { svb } from '../../../variable';
import _ from 'lodash';
import {Visibility,AttachFile as AttachFileIcon} from '@material-ui/icons';
import { previewTextToPdf } from 'utils/api/file';
import {Tooltip, Dialog} from '@material-ui/core';

const ReleaseNoLocation = props => {
    const { id, content, onChange } = props
    const [state, setState] = useState({})
    const [docFile, setDocFile] = useState()

    useEffect(() => {
        onChange && onChange(state)
    }, [state])




    const base64toBlob = (data) => {
        // Cut the prefix `data:application/pdf;base64` from the raw base 64
        // const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);
    
        const bytes = atob(data);
        let length = bytes.length;
        let out = new Uint8Array(length);
    
        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }
    
        return new Blob([out], { type: 'application/pdf' });
    };
    console.log(props.file, 'file')
    const onPreview = async () => {
        const { x, y, fontSize } = state
        const body = {
            x: x ? Number(x) : 0,
            y: y ? Number(y) : 0,
            fontSize: fontSize ? Number(fontSize) : 0,
            id,
            content,
            newFile: true,
        }
        const base64 = await previewTextToPdf(body)
        const uri = `data:application/pdf;base64,${base64}`
       
        if(props.file && props.file.type && props.file.type.toLowerCase() === ".pdf"){
            const blob = base64toBlob(base64)
            const urlFile = URL.createObjectURL(blob);
            console.log(urlFile, 'urlFile')
            setDocFile(urlFile);

        }else {
            setDocFile(uri);

        }
    }

    const handleChange = (key, val) => {
        const newState = { ...state }

        if (key === 'type') {
            const obj = svb[val.title]
            newState.x = val.x || _.get(obj, `x`, 0)
            newState.y = val.y || _.get(obj, `y`, 0)
            newState.fontSize = val.fontSize || _.get(obj, `fontSize`, 16)
        } else {
            newState[key] = val ? Number(val) : 0
        }
        setState(newState)
    }

    return <>
        <Grid container spacing={8}>
            <Grid item xs={5}>
                <CustomInputField
                    label='Loại'
                    configType="crmSource"
                    configCode="vi tri so van ban"
                    type="Source|CrmSource,S27|Value||value"
                    value={state.type}
                    onChange={e => handleChange('type', e.target.value)}
                />
            </Grid>

            <Grid item xs={2}>
                <NumberFormat
                    label={'X'}
                    customInput={CustomInputBase}
                    value={state.x}
                    onChange={e => handleChange('x', e.target.value)}
                />
            </Grid>
            <Grid item xs={2}>
                <NumberFormat
                    label={'Y'}
                    customInput={CustomInputBase}
                    value={state.y}
                    onChange={e => handleChange('y', e.target.value)}
                />
            </Grid>

            <Grid item xs={2}>
                <NumberFormat
                    label={'Font'}
                    customInput={CustomInputBase}
                    value={state.fontSize}
                    onChange={e => handleChange('fontSize', e.target.value)}
                />
            </Grid>

            <Grid item xs={1}>
                <div style={{ margin: 14, marginLeft: 40 }}>
                    <Fab onClick={onPreview}>
                        <Tooltip title="Xem trước">
                            <Visibility />
                        </Tooltip>
                    </Fab>
                </div>
            </Grid>
        </Grid>

        <DialogUI maxWidth={false} fullScreen open={docFile} onClose={() => setDocFile(null)}>
            <div style={{ height: 1200 }}>
                {docFile && <iframe title="PDF" src={docFile} width="100%" height="100%" value="file"  type="application/pdf"/>}
            </div>
        </DialogUI>
    </>
}

export default ReleaseNoLocation