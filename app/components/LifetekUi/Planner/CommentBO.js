import React, { useEffect, useState } from 'react';
import { Divider, TextField, Tab, Tabs, Typography, Chip, Grid, Button, Paper } from '@material-ui/core';
import { Timeline } from 'react-event-timeline';
import { API_LOG } from 'config/urlConfig';
import { logNames } from '../../../variable';
import { serialize, fetchData } from '../../../helper';
import { delSpace } from 'utils/common';
import request from 'utils/request';

const Comment = props => {
    const { profile, id } = props
    const [content, setContent] = useState('')
    const [logs, setLogs] = useState([])
    const [reload, setReload] = useState(0)

    useEffect(() => {
        async function getData() {
            try {
                const url = `${API_LOG}?${serialize({ filter: { objectId: id } })}`
                const log = await request(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                setLogs(log.data)
            } catch (err) { }
        }

        getData()
        setContent('')
    }, [reload])

    const createLogSaga = (data) => {
        try {
            fetch(`${API_LOG}`, {
                method: 'POST',
                body: JSON.stringify(delSpace(data)),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }).then(e => setReload(reload + 1))
        } catch (err) { }
    }

    const handleCreateLog = () => {
        createLogSaga({
            type: 'message',
            employee: {
                employeeId: profile._id,
                name: profile.name,
            },
            objectId: id,
            content,
        });
    };

    return <React.Fragment>
        <Timeline style={{ paddingTop: 20 }}>
            {logs.map(item =>
                <RenderTimeLine
                    item={item}
                // logNames={[logNames.MESSAGE, logNames.UPDATE, logNames.REMINDER, logNames.TASK]}
                />
            )}
        </Timeline>
        <TextField
            label="Bình luận"
            multiline
            rows={4}
            onChange={e => setContent(e.target.value)}
            value={content}
            name="content"
            variant="outlined"
            style={{ width: '100%' }}
            margin="normal"
        />
        <Button
            variant="contained"
            color="primary"
            disabled={!content.trim().length}
            onClick={handleCreateLog}>
            Gửi
        </Button>
    </React.Fragment>
}

export default Comment

const RenderTimeLine = props => {
    const { item, logNames } = props
    // console.log(item, logNames)
    return null
}