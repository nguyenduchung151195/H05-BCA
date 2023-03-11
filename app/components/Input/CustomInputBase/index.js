import React, { useState, useEffect, useCallback, memo } from 'react';
import { TextField } from '../../LifetekUi';
import { convertDatetime2Date } from 'utils/common';
import { InputAdornment, IconButton, Typography } from '@material-ui/core';
import { Visibility, VolumeUp, KeyboardVoice } from '@material-ui/icons';
import request from 'utils/request';
import { UPLOAD_APP_URL } from 'config/urlConfig';
import moment from 'moment';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { clientId } from '../../../variable';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
// const MicRecorder = require('mic-recorder-to-mp3');
import FileUpload from '../../LifetekUi/FileUpload';
// import { Button } from '@amcharts/amcharts4/core';

function CustomInputBase(props) {
  const { variant, value = '', label = '', type, checkedShowForm, onChange, formatType, setReload, ...restProps } = props;
  const [audioURL, setAudioURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recorderUpload, setRecorderUpload] = useState(null);
  const [dataUpload, setDataUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [waitConvert, setWaitConvert] = useState(false);
  console.log('props_base',props)

  useEffect(() => {
    if (props.voiceInput && waitConvert && dataUpload && dataUpload.data) {
      startConvert();
    }
  }, [waitConvert, dataUpload]);

  const curParsePrice = str => {
    if (!str) return 0;
    // if (typeof str === Number) return str
    return parseFloat(typeof str === 'number' ? str : str.replace(/,/g, ''));
  };
  const datetime2Date = val => {
    if (type === 'date') {
      return val && Number(val).toString().length > 3 ? convertDatetime2Date(val) : val;
    }
    if (type === 'number' && formatType === 'Money') {
      return curParsePrice(val).toLocaleString('en-IE');
    }

    return val;
  };
  // const recorders = new MicRecorder({
  //   bitRate: 128
  // });
  // useEffect(()=>{
  //   fetch(`${UPLOAD_APP_URL}/file-system/company?clientId=${clientId}&code=${props.code}&id=${props.id}}`, {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token_03')}`,
  //     },
  //   })
  //     .then(res => {
  //       console.log(res)
  //     })
  //     .catch(e => {
  //       console.log('e', e);
  //     });
  // },[reload])
  useEffect(
    () => {
      if (recorder === null) {
        if (isRecording) {
          requestRecorder().then(setRecorder, console.error);
        }
        return;
      }
      if (isRecording) {
        recorder.start();
        // console.log('start')
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
    },
    [recorder, isRecording],
  );

  // useCallback(()=>{
  //   setUpload(true)
  //   const data = {
  //     lastModified: dataUpload ? dataUpload.timecode : null,
  //     lastModifiedDate: moment(),
  //     name: `File_ghi_âm_${moment().format('hh:mm DD/MM/YYYY')}`
  //   }
  //   const dataUploads = dataUpload ? dataUpload.data : null
  //   const dataRecord = dataUpload ? Object.assign(dataUploads, data) : null
  //   const form = new FormData();

  //   const file = dataRecord;
  //   console.log(file,'file')
  //   form.append('fileUpload',file);

  //   request(`${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=${props.code}&mid=${props.id}&mname=${props.name}&fname=root&ftype=0&childTaskId=${props.taskId}`, {
  //     body: JSON.stringify(form),
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token_03')}`,
  //     },
  //   })
  //     .then(res => {
  //       console.log(res)
  //       setReload(true)
  //       setUpload(false)
  //       setDataUpload(null)
  //       alert("Tải lên thành công")
  //     })
  //     .catch(e => {
  //       console.log(e,'error')
  //       setReload(true)
  //       setUpload(false)
  //       setDataUpload(null)
  //       // alert("Tải lên thất bại")
  //     });
  // },[upload])
  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    // setUpload(true)
  };
  const startUplod = () => {
    setUploading(true);
    const data = {
      lastModified: dataUpload ? dataUpload.timecode : null,
      lastModifiedDate: moment(),
      name: `File_ghi_âm_${moment().format('hh:mm DD/MM/YYYY')}`,
    };
    const dataUploads = dataUpload ? dataUpload.data : null;
    const dataRecord = dataUpload ? Object.assign(dataUploads, data) : null;
    const form = new FormData();

    const file = dataRecord;
    form.append('fileUpload', file);
    if (file !== null) {
      try {
        const url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=${props.code}&mid=${props.id}&mname=${props.name
          }&fname=root&ftype=0&childTaskId=${props.taskId}`;
        const head = {
          body: form,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token_03')}`,
          },
        };
        fetch(url, head)
          .then(res => {
            // console.log(res);
            setReload && setReload();
            setUploading(false);
            alert('Tải lên thành công');
          })
          .catch(e => {
            // console.log(e, 'error');
            setReload && setReload(true);
            setUploading(false);
            alert('Tải lên thất bại');
          });
      } catch (err) {
        // console.log(err, 'error');
      }
    }
  };
  const startConvert = () => {
    const data = {
      lastModified: dataUpload ? dataUpload.timecode : null,
      lastModifiedDate: moment(),
      name: `File_ghi_âm_${moment().format('hh:mm DD/MM/YYYY')}`,
    };
    const dataUploads = dataUpload ? dataUpload.data : null;
    const dataRecord = dataUpload ? Object.assign(dataUploads, data) : null;
    const form = new FormData();

    const file = dataRecord;
    form.append('data', file);
    if (file !== null) {
      try {
        const url = `https://g.lifetek.vn:227/speech2text`;
        const head = {
          body: form,
          method: 'POST',
        };
        fetch(url, head)
          .then(res => res.json())
          .then(res => {
            if (res.status === 'ok') {
              const str = res.str.join('\n');
              onChange && onChange({ target: { name: restProps.name, value: str } });
            } else {
              onChange && onChange({ target: { name: restProps.name, value: res.traceback } });
              alert(res.traceback);
            }
            setWaitConvert(false);
          })
          .catch(e => {
            // console.log(e, 'error');
            setWaitConvert(false);
          });
      } catch (err) {
        // console.log(err, 'error');
      }
    } else {
      setWaitConvert(false);
    }
  };

  async function requestRecorder() {
    let stream;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // var constraints = { audio: true};
      // var chunks = [];

      // stream = navigator.mediaDevices.getUserMedia(constraints)
      //   .then(function(stream) {
      //     var options = {
      //       audioBitsPerSecond: 128000,
      //       mimeType: 'audio/wav'
      //     }
      //     var mediaRecorder = new MediaRecorder(stream,options);
      //     m = mediaRecorder;

      //     m.mimeType;
      //   })
      //   .catch(function(error) {
      //     console.log(error.message);
      //   });
    } else console.log('error');
    return new MediaRecorder(stream);
  }

  const handleChange = e => {
    if (!onChange) return;
    switch (type) {
      case 'date': {
        const [y, m, d] = e.target.value.split('-');
        const year = Number(y).toString().length > 3 && (y > 3000 || y < 1900) ? moment().year() : y;
        e.target.value = `${year}-${m}-${d}`;
        onChange(e);
        break;
      }
      case 'number': {
        if (formatType === 'Money') {
          e.target.value = curParsePrice(e.target.value);
          onChange(e);
        } else {
          onChange(e);
        }
        break;
      }
      default: {
        if (e.target.value) {
          const value = e.target.value;
          const newValue = !Number(value) && typeof value !== 'object' ? value.replace(/^\s+|\s+$/g, ' ') : value;
          e.target.value = !Number(value) && typeof value !== 'object' ? newValue.trimStart() : newValue;
          onChange(e);
        } else {
          onChange(e);
        }
      }
    }
    // if (type === 'date') {
    //   const [y, m, d] = e.target.value.split('-');
    //   const year = Number(y).toString().length > 3 && (y > 3000 || y < 1900) ? moment().year() : y;
    //   e.target.value = `${year}-${m}-${d}`;
    //   onChange(e);
    // } else {
    //   if (e.target.value) {
    //     const value = e.target.value;
    //     const newValue = !Number(value) && typeof value !== 'object' ? value.replace(/^\s+|\s+$/g, ' ') : value;
    //     e.target.value = !Number(value) && typeof value !== 'object' ? newValue.trimStart() : newValue;
    //     onChange(e)
    //   } else {
    //     onChange(e)
    //   }
    //   // e.target.value = e.target.value ? e.target.value.replace(/^\s+|\s+$/g, ' ') : e.target.value;
    //   // e.target.value = e.target.value ? e.target.value.trimStart() : e.target.value;
    // }

    // onChange(e);
  };
  function changeIcon() {
    if (isRecording === true) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  const renderCheckForm = check => {
    const x = onChange;
    let xhtml = null;
    if (check === false) {
      xhtml = null;
    } else {
      if (formatType === 'Money') {
        xhtml = (
          <TextField
            className="CustomIconRequired"
            variant="outlined"
            value={datetime2Date(value)}
            label={label}
            InputLabelProps={{ shrink: true }}
            fullWidth
            onChange={handleChange}
            {...restProps}
          />
        );
      } else {
        xhtml = (
          <>
            <input
              onChange={e => {
                const form = new FormData();
                const file = e.target.files[0];
                form.append('data', file);
                const url = `https://g.lifetek.vn:227/speech2text`;
                const head = {
                  body: form,
                  method: 'POST',
                };
                fetch(url, head)
                  .then(res => res.json())
                  .then(res => {
                    if (res.status === 'ok') {
                      const str = res.str.join('\n');
                      x({ target: { name: restProps.name, value: str } });
                      const uploadForm = new FormData();
                      uploadForm.append('fileUpload', file);
                      const url = `${UPLOAD_APP_URL}/file-system/company/Upload?clientId=${clientId}&code=${props.code}&mid=${props.id}&mname=${props.name
                        }&fname=root&ftype=0&childTaskId=${props.taskId}`;
                      const head = {
                        body: uploadForm,
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token_03')}`,
                        },
                      };
                      fetch(url, head)
                        .then(res => {
                          // console.log(res);
                          setReload && setReload();
                          alert('Tải lên thành công');
                        })
                        .catch(e => {
                          // console.log(e, 'error');
                          setReload && setReload(true);
                          alert('Tải lên thất bại');
                        });
                    } else {
                      x({ target: { name: restProps.name, value: res.traceback } });
                      alert(res.traceback);
                    }
                  })
                  .catch(e => {
                    // console.log(e, 'error');
                  });
              }}
              id={`fileUpload_${restProps.name}`}
              style={{ display: 'none' }}
              name="fileUpload"
              type="file"
            />
            <TextField
              className="CustomIconRequired"
              variant="outlined"
              type={type}

              value={datetime2Date(value)}
              label={label}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment:
                  props.showSpeaker || props.showRecorder ? (
                    <InputAdornment position="end">
                      {props.showSpeaker ? (
                        <IconButton
                          disabled={disable}
                          aria-label="Toggle password visibility"
                          onClick={() => {
                            setDisable(true);
                            const body = {
                              data: [value],
                              speaker: 1,
                              silence_duration: 0.5,
                            };
                            request('https://g.lifetek.vn:227/text2speech', {
                              body: JSON.stringify(body),
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                mode: 'no-cors',
                              },
                            })
                              .then(res => {
                                if (res && res.url) {
                                  const audio = new Audio(res.url);
                                  audio.play();
                                  setDisable(false);
                                }
                              })
                              .catch(e => {
                                // console.log('e', e);
                              });
                          }}
                        >
                          <VolumeUp />
                        </IconButton>
                      ) : null}
                      {props.showRecorder ? (
                        <>
                          {!props.voiceInput ? (
                            <PopupState variant="popover" popupId="demo-popup-popover">
                              {popupState => (
                                <div>
                                  <IconButton variant="contained" {...bindTrigger(popupState)} color={isRecording === true ? 'secondary' : 'primary'}>
                                    <KeyboardVoice />
                                  </IconButton>
                                  <Popover
                                    {...bindPopover(popupState)}
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                      vertical: 'top',
                                      horizontal: 'center',
                                    }}
                                  >
                                    <div>
                                      <audio src={audioURL} controls />
                                      <br />
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={startRecording}
                                        disabled={isRecording}
                                        style={{ marginLeft: 10 }}
                                      >
                                        Bắt đầu
                                      </Button>
                                      <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={stopRecording}
                                        disabled={!isRecording}
                                        style={{ marginLeft: 10 }}
                                      >
                                        Kết thúc
                                      </Button>
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={startUplod}
                                        disabled={uploading || !dataUpload}
                                        style={{ marginLeft: 10 }}
                                      >
                                        Tải lên
                                      </Button>

                                      <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={startConvert}
                                        disabled={uploading || !dataUpload}
                                        style={{ marginLeft: 10, marginRight: 10 }}
                                      >
                                        Chuyển thành văn bản
                                      </Button>
                                      <label
                                        htmlFor={`fileUpload_${restProps.name}`}
                                        style={{ marginLeft: 10, marginRight: 10, cursor: 'pointer', color: 'blue' }}
                                      >
                                        Tải lên từ máy tính
                                      </label>
                                      <br />
                                      <p>
                                        <em style={{ color: 'blue' }}>("Nhấn start recording để bắt đầu ghi âm và stop recording để kết thúc")</em>
                                      </p>
                                    </div>
                                  </Popover>
                                </div>
                              )}
                            </PopupState>
                          ) : (
                            <div>
                              <IconButton
                                variant="contained"
                                onClick={(e) => {
                                  if (!isRecording) {
                                    setIsRecording(true);
                                    if (!recorder) {
                                      setTimeout(() => {
                                        startRecording()
                                      }, 100);
                                    }
                                  } else {
                                    stopRecording();
                                    setWaitConvert(true);
                                  }
                                }}
                                color={isRecording === true ? 'secondary' : 'primary'}
                              >
                                <KeyboardVoice />
                              </IconButton>
                            </div>
                          )}
                        </>
                      ) : null}
                    </InputAdornment>
                  ) : null,
              }}
              fullWidth
              onChange={handleChange}
              {...restProps}
            />
          </>
        );
      }
    }
    return xhtml;
  };

  return label
    ? // checkedShowForm === true ? (
    //   <TextField
    //     variant="outlined"
    //     type={type}
    //     value={datetime2Date(value)}
    //     label={label}
    //     InputLabelProps={{ shrink: true }}
    //     fullWidth
    //     {...restProps}
    //   />
    // ) : null
    renderCheckForm(checkedShowForm)
    : null;
}
export default memo(CustomInputBase);
