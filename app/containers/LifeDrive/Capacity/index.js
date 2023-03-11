import React, { useState, useCallback, useEffect, useRef } from 'react';
// import { Editor, EditorTools, EditorUtils } from '@progress/kendo-react-editor';
import { Tab, Tabs, Grid, Typography, Button, Tooltip, Box } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
// import Box from '@material-ui/core/Box';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import './styles.scss'
function Capacity(props) {
    const [process, setProcess] = useState(0)

    useEffect(() => {
        const { capacity = {} } = props
        const { currentCapacity = 0, maxCapacity = 0 } = capacity
        if (!(currentCapacity)) {
            setProcess(0)
        } else {
            const newProcess = (currentCapacity / maxCapacity) * 100 || 0
            console.log(newProcess, 'newProcess')
            setProcess(newProcess)
        }
    }, [props.capacity])
    const { capacity = {} } = props
    const { usedStorage = 0, storageCapacity = 0 } = capacity
    return (
        <>
            <Grid item md={12} container className='Capacity'>
                <Grid item md={4} container>
                    <CloudQueueIcon style={{
                        width: "80%",
                        height: 50,
                        color: "var(--dt-primary-action-stateful,rgb(24,90,188))",
                    }} />
                </Grid>
                <Grid item md={8} container style={{
                    color: "var(--dt-primary-action-stateful,rgb(24,90,188))",
                    fontSize: "180%",
                    lineHeight: "50px"
                }}>
                    Bộ nhớ
                </Grid>
                <Grid style={{
                    width: '100%'
                }}>
                    <LinearProgress variant="buffer" value={process} color="primary" />
                </Grid>
                <Grid style={{ width: '100%', marginTop: 10 }}>
                    {usedStorage} / {storageCapacity}
                </Grid>
                <Grid item md={12} container className='Capacity' style={{
                    fontSize: 16,
                    color: "var(--dt-primary-action-stateful,rgb(24,90,188))",
                    fontWeight: "bold",
                    cursor: "pointer"
                }}
                    onClick={() => {
                        props.handleChangeTab && props.handleChangeTab("", "storage")
                    }}
                >
                    Quản lý bộ nhớ
                </Grid>
            </Grid>
        </>
    )
}

export default Capacity;

