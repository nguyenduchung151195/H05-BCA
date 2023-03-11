/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Grid, Button } from '@material-ui/core';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import { TextField } from 'components/LifetekUi';
// import { ThumbUpAltRounded } from '@material-ui/icons';
// import { useHistory } from 'react-router-dom';
import moment from 'moment'
import { SPEECH_2_TEXT } from 'config/urlConfig';
import CircularProgress from '@material-ui/core/CircularProgress';

function SearchVoice(props) {
    const [isRecording, setIsRecording] = useState(false);
    const [timeStart, setTimeStart] = useState();
    const [recorder, setRecorder] = useState(null);
    const [waitConvert, setWaitConvert] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [dataUpload, setDataUpload] = useState(null);
    const [loadingVoice, setloadingVoice] = useState(false);
    const [contentVoice, setContentVoice] = useState();


    useEffect(() => {
        if (waitConvert && dataUpload && dataUpload.data) {
            startConvert();
        }
    }, [waitConvert, dataUpload]);
    useEffect(() => {
        if (isRecording) {
            setTimeStart(new Date())
        }
    }, [isRecording])
    const startRecording = () => {
        setIsRecording(true);
    };
    const stopRecording = () => {
        setIsRecording(false);
        // setUpload(true)
    };
    useEffect(
        () => {
            try {
                if (!recorder) {
                    if (isRecording) {
                        requestRecorder().then(setRecorder, console.error);
                    }
                    return;
                }
                if (isRecording) {
                    recorder.start();
                } else {
                    // console.log('stop')
                    recorder.stop();
                }

                // Obtain the audio when ready.
                const handleData = e => {
                    // console.log('e', e);
                    setAudioURL(URL.createObjectURL(e.data));
                    setDataUpload(e);
                };

                recorder.addEventListener('dataavailable', handleData);
                return () => recorder.removeEventListener('dataavailable', handleData);
            } catch (error) {
                console.log("error", error)
            }

        },
        [recorder, isRecording],
    );
    async function requestRecorder() {
        let stream;
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } else console.log('error');
            return new MediaRecorder(stream);
        } catch (error) {
            // console.log(error, "djfnb")
            // alert("Vui lòng kiểm tra lại thiết bị ghi âm của bạn!")
        }
    }
    const startConvert = () => {
        const data = {
            lastModified: dataUpload ? dataUpload.timecode : null,
            lastModifiedDate: moment(),
            name: `File_ghi_âm_${moment().format('hh:mm DD/MM/YYYY')}`,
        };
        const dataUploads = dataUpload ? dataUpload.data : null;
        const dataRecord = dataUpload ? Object.assign(dataUploads, data) : null;
        const form = new FormData();

        let file = dataRecord;
        file.href = URL.createObjectURL(file);
        form.append('data', file);
        setDataUpload()
        if (file !== null) {
            try {
                const url = SPEECH_2_TEXT;
                const head = {
                    body: form,
                    method: 'POST',
                };
                setloadingVoice(true)
                fetch(url, head)
                    .then(res => res.json())
                    .then(res => {
                        if (res.status === 'ok') {
                            // const str = res.str.join('\n');
                            // onChange && onChange({ target: { name: restProps.name, value: str } });
                            if (res && res.str && Array.isArray(res.str) && res.str.length) {
                                setContentVoice(res.str[0])
                            }

                        } else {
                            setContentVoice()
                            // onChange && onChange({ target: { name: restProps.name, value: res.traceback } });
                            // alert(res.traceback);
                        }
                        setWaitConvert(false);
                        setloadingVoice(false)
                    })
                    .catch(e => {
                        // console.log(e, 'error');
                        setWaitConvert(false);
                    });
            } catch (err) {
                console.log(err, 'error');
                setloadingVoice(false)
            }
        } else {
            setWaitConvert(false);
            setloadingVoice(false)
        }
    };
    return (
        <Grid item sm={12}  >
            <Grid item sm={12} >
                <Grid item sm={12} md={12} style={{ display: "flex", justifyContent: "center" }}>
                    {
                        !loadingVoice ? <KeyboardVoiceIcon color={isRecording === true ? 'secondary' : 'primary'}
                            onClick={e => {
                                props.onStartVoice && props.onStartVoice()
                                setContentVoice()

                                if (!isRecording) {
                                    // bắt đầu ghi âm

                                    setIsRecording(true);
                                    if (!recorder) {
                                        setTimeout(() => {
                                            startRecording();
                                        }, 100);
                                    }
                                } else {
                                    // dừng ghi âm
                                    stopRecording();
                                    setWaitConvert(true);
                                }
                            }
                            } /> : <div >
                            <CircularProgress />

                        </div>
                    }

                </Grid>

                {/* {
          isRecording && <Grid item sm={12} md={12} style={{ display: "flex", justifyContent: "center", marginTop: 15 }}>
            Bắt đầu ghi âm:
          </Grid>
        } */}
            </Grid>
            {
                !!contentVoice && <Grid item sm={12} style={{ paddingTop: 10 }}>
                    <span style={{ fontWeight: "bolder" }}>Nội dung: </span> {contentVoice}
                </Grid>
            }
            <Grid item sm={12} className="text-center" style={{ paddingTop: 10, display: "flex", justifyContent: "end" }}>
                <Button
                    className="mx-3"
                    type="button"
                    onClick={() => {
                        props.onClose && props.onClose(0);
                    }}
                    variant="outlined"
                    color="secondary"
                >
                    Hủy
                </Button>
                {
                    !!contentVoice && <Button variant="outlined" color="primary" onClick={() => {
                        props.onSubmit && props.onSubmit(contentVoice)
                        props.setReloadVoice && props.setReloadVoice()
                        props.onClose && props.onClose(0);
                    }}>
                        Tìm kiếm
                    </Button>
                }
            </Grid>
        </Grid>
    );
}
const mapStateToProps = createStructuredSelector({
});
const withConnect = connect(mapStateToProps);
// export default compose(withConnect)(SearchVoice);


export default SearchVoice
