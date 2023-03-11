/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useState } from 'react';
import { VolumeUp, KeyboardVoice } from '@material-ui/icons';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Dialog } from '.';
import {
  Fab as Fa,
  Avatar,
  Button,
  InputAdornment,
  IconButton,
  FormHelperText,
  Grid,
  Tooltip,
  Typography,
  Menu,
  Checkbox,
  MenuItem,
  Icon,
  //  Tooltip
} from '@material-ui/core';
import { TextField } from 'components/LifetekUi';
import CircularProgress from '@material-ui/core/CircularProgress';

// import { ThumbUpAltRounded } from '@material-ui/icons';
// import { useHistory } from 'react-router-dom';
import { AttachFile, Image, Clear, GetApp, Visibility, Download, Delete } from '@material-ui/icons';
import Axios from 'axios';
import { convertDateFb, convertDateFacebook, findChildren, serialize, fetchData } from '../../helper';
import { API_PROFILE, API_COMMENT, UPLOAD_IMG_SINGLE, API_USERS_INTERNAL, SPEECH_2_TEXT } from '../../config/urlConfig';
import { makeSelectNewComment } from '../../containers/Dashboard/selectors';
import './style.css';
import _ from 'lodash';
import moment from 'moment'
import XLSX from 'xlsx';

import avatarDefault from '../../images/default-avatar.png';
import { testAvatar, checkAvatar, CheckImage } from 'utils/common';
import CustomAvatar from 'components/CustomAvatar';
import { array, element } from 'prop-types';
const Fab = props => <Fa {...props} />;
Fab.defaultProps = {
  size: 'small',
  color: 'primary',
  style: { margin: '5px', float: 'right' },
};

function Comments({
  id,
  code,
  limit = 10,
  newComment,
  disableDelete,
  viewOnly,
  disableLike,
  revert,
  checkDisableEditTask,
  dataCheckTask,
  feedbackTab,
  reload = 0,
  prevSender,
  showSpeaker,
  showRecorder,
  ...rest
}) {
  const [input, setInput] = React.useState('');
  const [comments, setComments] = React.useState([]);
  const [skip, setSkip] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [profile, setProfile] = React.useState({});
  const [errorImageMesssage, setErrorImageMesssage] = React.useState();
  const [imageList, setImageList] = useState([]);
  const [fileName, setFileName] = useState('');
  const [openComent, setOpenComent] = React.useState(false);
  const [avatar, setAvatar] = React.useState();
  const [replyUser, setReplyUser] = React.useState();
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [waitConvert, setWaitConvert] = useState(false);
  const [dataUpload, setDataUpload] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [loadingVoice, setloadingVoice] = useState(false);

  useEffect(() => {
    if (waitConvert && dataUpload && dataUpload.data) {
      startConvert();
    }
  }, [waitConvert, dataUpload]);

  useEffect(
    () => {
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
    },
    [recorder, isRecording],
  );
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
                changeInput(res.str[0], true)
              }

            } else {
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

  useEffect(() => {
    getProfile();
  }, []);
  const startRecording = () => {
    setIsRecording(true);
  };
  const stopRecording = () => {
    setIsRecording(false);
    // setUpload(true)
  };
  useEffect(
    () => {
      if (profile && profile.avatar && profile.avatar !== avatar) {
        testAvatar(profile.avatar, () => setAvatar(profile.avatar), () => { });
      }
    },
    [profile, avatar],
  );

  useEffect(
    () => {
      if (newComment && profile) {
        if (newComment.from !== profile._id) {
          const query = { limit: 10, skip: 0, code, id };
          const queryString = serialize(query);
          fetchData(`${API_COMMENT}?${queryString}`).then(data => {
            setCount(data.count);
            const newDt = [].concat(data.data.map(i => convertDateFacebook(i)));
            const newCm = findChildren(newDt);
            _.sortBy(newCm, ['createdAt']);
            revert && _.reverse(newCm);
            setComments(newCm);
          });
        } else {
          // console.log('no need to refresh');
        }
      }
    },
    [newComment],
  );

  useEffect(() => {
    const query = { limit: 10, skip: 0, code, id };
    const queryString = serialize(query);
    fetchData(`${API_COMMENT}?${queryString}`).then(data => {
      setCount(data.count);
      const newDt = [].concat(data.data.map(i => convertDateFacebook(i)));
      const newCm = findChildren(newDt);
      _.sortBy(newCm, ['createdAt']);
      revert && _.reverse(newCm);
      setComments(newCm);
    });
  }, []);

  const clearItem = () => {
    setInput('');
    setImageList([]);
  };

  function reply(id) {
    const newComment = comments.map(i => (i._id === id ? { ...i, reply: true } : { ...i, reply: false }));
    setComments(newComment);
  }

  useEffect(
    () => {
      if (feedbackTab === true) {
        fetch(API_USERS_INTERNAL, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            if (data && data.data) {
              data.data.map((item, index) => {
                if (item._id === prevSender) {
                  setReplyUser(item.name);
                }
              });
            }
          });
      }
    },
    [prevSender],
  );

  function addComment() {
    if (!input && imageList.length === 0) return;
    let idd = id;
    console.log(replyUser, input, "input")
    if (Array.isArray(id) && id.length === 1) idd = id[0];
    if (idd && idd !== 'add')
      fetchData(`${API_COMMENT}`, 'POST', {
        id,
        // content: feedbackTab === true ? `@${replyUser} ${input}` : input,
        content: input,
        replyUser: feedbackTab === true && prevSender ? [prevSender] : [],
        code,
        image: imageList,
      }).then(result => {
        setComments(
          revert
            ? [{ content: result.content, user: profile, _id: result._id, time: convertDateFb(result.createdAt), image: result.image, replyUser: result.replyUser }, ...comments]
            : [{ content: result.content, user: profile, _id: result._id, time: convertDateFb(result.createdAt), image: result.image, replyUser: result.replyUser }, ...comments],
        );
        clearItem();
      });
  }

  function changeInput(e, voice) {
    if (voice) {
      setInput(e)
    } else
      setInput(e.target.value);
  }
  function deleteComment(status, itemId) {
    if (status === 1) {
      setComments(comments.filter(x => x._id !== itemId));
    }
  }
  useEffect(
    () => {
      if (!id) return;
      const query = { limit, skip, code, id };
      const queryString = serialize(query);
      fetchData(`${API_COMMENT}?${queryString}`).then(data => {
        setCount(data.count);
        const newDt = comments.concat(data.data.map(i => convertDateFacebook(i)));
        const newCm = findChildren(newDt);
        _.sortBy(newCm, ['createdAt']);
        _.reverse(newCm);
        setComments(newCm);
      });
    },
    [id, skip, reload],
  );

  function onClickOpenComent() {
    if (openComent === false) {
      setOpenComent(true);
    }
    if (openComent === true) {
      setOpenComent(false);
    }
  }

  function getProfile() {
    try {
      fetchData(API_PROFILE).then(data => {
        if (!data) {
          errorToken();
          return;
        }

        setProfile(data);
      });
    } catch (error) {
      errorToken();
    }
  }

  function errorToken() {
    // eslint-disable-next-line no-alert
    alert('Sai token');
    localStorage.clear();
    window.location.href = '/';
  }

  function handleSkipComent() {
    setSkip(skip + (parseInt(limit, 10) || 10));
  }

  const handleUploadFile = async e => {
    setErrorImageMesssage(null);
    const file = e.target.files[0];
    if (file.size > 1073741824) {
      setErrorImageMesssage('Dung lượng file không được quá 1GB');
      return;
    }
    const newImageList = [...imageList, { file: 'Đang tải lên...', fileName: file.name }];
    setImageList(newImageList);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    const fileData = await res.json();
    // setFileName(file.name);
    setImageList(
      newImageList.map(item => {
        if (item.fileName === file.name) {
          item.file = fileData.url;
        }
        return item;
      }),
    );
  };
  const handleUploadFileMany = useCallback(
    (e, name) => {
      setErrorImageMesssage(null);
      let files = [...e.target.files];
      if (Array.isArray(files) && files.length > 0) {
        Promise.all(
          files.map(async file => {
            if (file.size > 1073741824) {
              setErrorImageMesssage('Dung lượng file không được quá 1GB');
              return;
            }
            const newImageList = [...imageList, { file: 'Đang tải lên...', fileName: file.name }];

            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(UPLOAD_IMG_SINGLE, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: formData,
            });
            const fileData = await res.json();
            let obj = { ...fileData, name: file.name };
            return obj;
          }),
        ).then(res => {
          setImageList(pre => [...pre, ...res]);
        });
      }
    },
    [imageList],
  );
  const convertBase64 = file =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = error => {
        reject(error);
      };
    });

  return (
    <div className="dialog-ct">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        {checkDisableEditTask ? (
          <>
            {dataCheckTask ? (
              <>
                <span style={{ marginRight: 10, fontSize: 14, fontWeight: 600 }}>Ý KIẾN XỬ LÝ</span>
                {!viewOnly && (
                  <Button variant="contained" onClick={onClickOpenComent}>
                    Ý kiến
                  </Button>
                )}
              </>
            ) : null}
          </>
        ) : (
          <>
            <span style={{ marginRight: 10, fontSize: 14, fontWeight: 600 }}>Ý KIẾN XỬ LÝ</span>
            {!viewOnly && (
              <Button variant="contained" onClick={onClickOpenComent}>
                Ý kiến
              </Button>
            )}
          </>
        )}
      </div>
      <div style={{ marginTop: 27 }}>
        {openComent === true && (
          <>
            {profile._id && (
              <div className="comment">
                <Avatar
                  style={{ width: 30, height: 30, border: '1px solid' }}
                  alt={profile.name}
                  // src={avatarDefault}
                  src={avatarDefault}
                  srcSet={avatar === 'https://g.lifetek.vn:203/api/files/5f8684e931365b51d00afec6' ? avatarDefault : avatar}
                />
                <TextField
                  multiline
                  style={{ marginLeft: 10, borderRadius: '4px' }}
                  fullWidth
                  value={input}
                  className="setInput"
                  placeholder="Viết ý kiến"
                  onChange={changeInput}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (e.ctrlKey) {
                        setInput(`${e.target.value} \n`);
                      } else {
                        addComment();
                      }
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <>
                        <InputAdornment>
                          <label htmlFor="uploadImage" style={{ cursor: 'pointer', marginRight: 10, position: 'relative' }} position="end">
                            <AttachFile color="primary" />
                          </label>
                          <input id="uploadImage" multiple type="file" onChange={handleUploadFileMany} style={{ display: 'none' }} />
                        </InputAdornment>
                        {/* voice */}

                        {
                          !loadingVoice && (showSpeaker || showRecorder) ? (
                            <InputAdornment position="end">
                              {showSpeaker ? (
                                <IconButton
                                  disabled={false}
                                  aria-label="Toggle password visibility"
                                  onClick={() => {
                                    setDisable(true);
                                    const body = {
                                      data: ["value"],
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
                                        console.log('e', e);
                                      });
                                  }}
                                >
                                  <VolumeUp />
                                </IconButton>
                              ) : null}
                              {true ? (
                                <>
                                  {
                                    !true ? (
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
                                          onClick={e => {

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
                          ) : null
                        }
                        {
                          loadingVoice && <div><CircularProgress /></div>
                        }
                        <InputAdornment onClick={addComment} style={{ cursor: 'pointer', position: 'relative' }} position="end">
                          <span style={{ color: '#2196F3', fontWeight: 'bold', position: 'relative' }}>GỬI </span>
                        </InputAdornment>

                      </>
                    ),
                  }}
                />
              </div>
            )}
          </>
        )}
        {id !== 'add' &&
          imageList && (
            <Grid container spacing={8} style={{ padding: 4 }}>
              {imageList &&
                imageList.map((img, index) => (
                  <Grid
                    container
                    item
                    xs={12}
                    style={{
                      width: '100%',
                      height: '30px',
                      background: '#e2e2e2',
                      lineHeight: '30px',
                      borderRadius: 4,
                      margin: '5px 0',
                      padding: '5px 10px',
                    }}
                  >
                    <Grid item xs={10}>
                      {img.name}
                    </Grid>
                    <Grid item xs>
                      <Visibility onClick={() => handleView(img.url, checkExtension(img.name))} />
                    </Grid>
                    <Grid item xs>
                      <GetApp onClick={() => handleDownLoad(img.url, img.name)} />
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          )}
      </div>
      {comments &&
        comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(i => (
          <Comment
            key={i._id}
            addComment={addComment}
            profile={profile}
            avatar={avatar}
            reply={reply}
            item={i}
            likeCmt={cmtId => {
              const newComments = comments.map(c => {
                if (c._id === cmtId) {
                  if (!c.likeds) {
                    c.likeds = [];
                  }
                  c.likeds.push(profile._id);
                }
                return c;
              });
              setComments(newComments);
            }}
            id={id}
            code={code}
            limit={limit}
            viewOnly={viewOnly}
            deleteComment={deleteComment}
            disableLike={disableLike}
            feedbackTab={feedbackTab}
          />
        ))}
      {count > skip + limit ? (
        <p style={{ color: '#1127b8', cursor: 'pointer' }} onClick={handleSkipComent}>
          Xem thêm bình luận
        </p>
      ) : null}

      {/* {id !== 'add' && imageList && (
        <Grid container spacing={8}>
          {imageList.map((img, index) => (
            <Grid item xs={2}>
              {img.file === 'Đang tải lên...' ? <span>{img.file}</span> : <a href={img.file}>{img.fileName}</a>}
              <span onClick={() => setImageList(imageList.filter((e, i) => i !== index))}>
                <Clear />
              </span>
            </Grid>
          ))}
        </Grid>
      )} */}

      {errorImageMesssage && (
        <FormHelperText id="component-error-text1" style={{ color: 'red', display: 'inline' }}>
          {errorImageMesssage}
        </FormHelperText>
      )}
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  newComment: makeSelectNewComment(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(Comments);

function Comment({
  item,
  reply,
  profile,
  avatar,
  code,
  id,
  limit,
  deleteComment,
  disableDelete,
  viewOnly,
  isAuthory = false,
  disableLike,
  key,
  likeCmt,
  feedbackTab,
}) {
  const [isInit, setInit] = useState(true);
  const [childComments, setChildComments] = useState([]);
  const [skip, setSkip] = useState(0);
  const [imageShow, setImageShow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [imageView, setImageView] = useState({});
  const [useData, setUserData] = useState([]);
  const [previewHtml, setPreviewHtml] = useState(null);
  const [docFile, setDocFile] = useState();
  const [roleGroupsAndName, setRoleGroupsAndName] = React.useState(JSON.parse(localStorage.getItem('roleGroupsAndName') || []));

  let show = document.getElementById('show');
  function postComment(value) {
    if (!value) return;
    sendComment({ content: value, parentId: item._id, replyUser: item.user._id });
  }
  useEffect(
    () => {
      if (show && previewHtml !== '') {
        show.innerHTML = previewHtml;
      }
      setPreviewHtml('')
    },
    [previewHtml],
  );
  function sendComment(data) {
    try {
      data.id = id;
      data.code = code;
      let url = isAuthory ? `${API_COMMENT}?authority=true` : `${API_COMMENT}`;
      fetchData(url, 'POST', data).then(result => {
        const it = [
          {
            ...result,
            // user: { name: profile.name, avatar: profile.avatar ? `${profile.avatar}` : avatarDefault, _id: profile._id },
            user: { name: profile.name, avatar: profile.avatar, _id: profile._id },
            time: convertDateFb(result.createdAt),
          },
        ];
        const newChildComments = childComments.concat(it);
        setChildComments(newChildComments);
      });
      // eslint-disable-next-line no-empty
    } catch (error) { }
  }

  function likeComment(id) {
    fetchData(`${API_COMMENT}/like/${id}`, 'POST', {});
  }

  function fetchComments() {
    const query = { limit, skip, code, id, parentId: item._id };
    const queryString = serialize(query);
    fetchData(`${API_COMMENT}?${queryString}`).then(data => {
      setSkip(skip + limit);
      let newChildComments = [
        ...data.data.reverse().map(i => convertDateFacebook(i)),
        ...childComments,
        // _.sortBy(childComments, ['createdAt']),
        // _.reverse(childComments)
      ];
      // newChildComments = newChildComments.filter(e => !_.isEqual(e, []))

      setChildComments(newChildComments);
    });
  }
  const deleteComments = itemId => {
    fetchData(`${API_COMMENT}/${itemId}`, 'DELETE').then(res => {
      deleteComment(res.status, itemId);
    });
  };
  const checkExtension = name => {
    let extension = (name && name.split('.')) || [];
    let typeFile = '';
    if (extension && extension.length > 0) {
      typeFile = extension[extension.length - 1];
    }
    return typeFile;
  };
  const handleDownload = (url, name) => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = name && name.toLowerCase();
    a.click();
  };

  const handleClose = () => {
    setOpenDialog(false);
    console.log("imageViewimageView")
    setImageView({});
  };
  const handlePdf = async (url, type) => {
    let blob = url && (await fetch(url).then(async data => await data.blob()));
    let typeFile = 'application/pdf';

    var file = new Blob([blob], { type: typeFile });
    var fileURL = URL.createObjectURL(file);
    return fileURL;
  };

  const handleView = async (url, type) => {
    let urlForDoc = '';
    if (['jpg', 'png', 'JPG', 'PNG'].indexOf(type) !== -1) {
      setImageView({
        url,
        type: 'image',
      });
    }
    else if (type === 'pdf') {
      setImageView({
        url: await handlePdf(url),
        type: 'pdf',
      });
    }
    else if (type === 'xlsx' || type === 'xls') {
      setImageView({ type: type })
      await displayFileExcel(url);
    }
    else if (type === 'docx' || type === 'doc' || type === 'txt') {
      urlForDoc = `https://docs.google.com/gview?url=${url}&embedded=true`;
      if (type === 'docx') {
        fetch(url)
          .then((res) => res.blob()) // Gets the response and returns it as a blob
          .then((blob) => {
            setDocFile(blob)
            let objectURL = URL.createObjectURL(blob);
            console.log(blob, "blob");
            console.log(objectURL, 'objectURL')
          })
          .catch((er) => {
            console.log(er);
          });
      }
      console.log(urlForDoc, "urlForDoc", type)

      setImageView({
        url: urlForDoc !== '' ? urlForDoc : url,
        type,
      });
    }
    setOpenDialog(true);

  };

  const displayFileExcel = async f => {
    let reader = new FileReader();
    let file;
    await fetch(f).then(async response => (file = await response.blob()));
    reader.readAsArrayBuffer(file);
    reader.onload = function (e) {
      var data = new Uint8Array(reader.result);

      var wb = XLSX.read(data, { type: 'array' });
      var htmlstr = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]], { editable: true }).replace('<table', '<table id="table" border="1"');
      if (htmlstr) {
        htmlstr = htmlstr.replace(
          '</head>',
          `<style>
          table, td, tr {
            border: 1px solid gray;
            font-family: 'roboto',
          }
        </style></head>`,
        );
        // htmlstr = htmlstr.replace('</body></html>', '');

        setPreviewHtml(htmlstr);
      }
    };
  };

  useEffect(() => {
    fetch(API_USERS_INTERNAL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.data) {
          setUserData(data.data);
        }
      });
  }, []);

  function renderReplyUser(replyUser) {
    let user = [];
    useData.forEach(element => {
      replyUser &&
        replyUser.map(item => {
          if (element._id === item) {
            const roleGroupsName = roleGroupsAndName.find(it => it.code === element.roleGroupSource) || {}
            user.push(`${element.name} - ${roleGroupsName.name || ''}`);
          }
        });
    });
    return user;
  }
  const renderContentComment = (content) => {
    if (!content) return (
      <>
        {
          content
        }
        <br></br>
      </>
    )
  }
  function renderContent(content) {
    if (content && content.noteTag && content.noteTag.length) {
      // console.log(content, 'content')
      return (
        <>
          {/* {
            renderContentComment(content.content)
          } */}
          {/* {
            content && content.content ? <>
              {
                content.content
              }
              <br></br>
            </> : null
          } */}
          {
            content.noteTag.map((el) => {
              return (
                <>
                  {/* <span style={{ color: '#2196f3' }}>@{el.taggerName} &nbsp; </span> */}
                  <span style={{ color: '#2196f3' }}> {el.taggerName || ""} &nbsp; </span>

                  {el.note}
                  {/* <span style={{ color: '#2196f3' }}> &nbsp; @{el.nameReply}</span> */}
                  <span style={{ color: '#2196f3' }}> &nbsp; {el.nameReply || ""}</span>

                  <br></br>
                </>
              )
            })
          }
          {
            content && content.content ? <>
              <br></br>
              {

                content.content
              }
            </> : null
          }
        </>
      );
    }
    else if (content && content.replyUser && content.replyUser.length) {
      return (
        <>
          {/* <span style={{ color: '#2196f3' }}>{renderReplyUser(content.replyUser).map(i => `@${i} `)}</span> {content.content} */}
          <span style={{ color: '#2196f3' }}>{renderReplyUser(content.replyUser).join(", ")}</span>
          <br></br>
          <br></br>
          {content.content}

        </>
      );
    } else {
      if (feedbackTab === true) {
        let newName;
        useData.map((item, index) => {
          if (content.content && content.content.includes(item.name)) {
            newName = item.name;
          }
        });
        return (
          <>
            {/* <span style={{ color: '#2196f3' }}>{`@${newName} `}</span> {content.content && content.content.replaceAll(`@${newName} `, '')} */}
            <span style={{ color: '#2196f3' }}>{`${newName || ""} `}</span> {content.content && content.content.replaceAll(`@${newName} `, '')}

          </>
        );
      }
      else {
        return content.content;
      }
    }
  }

  return (
    <div style={{ borderRadius: '10px', margin: '15px 0px' }} key={key}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="wrapperFile">
                <div className="avatarBlock">
                  {/* <Avatar
                    style={{ width: 32, height: 32, marginRight: 10, border: '1px solid' }}
                    // src={item.user && item.user.avatar ? `${item.user.avatar}?allowDefault=true` : avatarDefault}
                    src={checkAvatar(item.user && item.user.avatar)}
                  /> */}
                  <CustomAvatar style={{ width: 32, height: 32, marginRight: 10, border: '1px solid' }} src={item.user && item.user.avatar} />
                  <span className="avatarText">{item.user ? item.user.name : 'Admin'}</span>
                </div>
                <br />

                {/* {item.content ? <p className="paraStyle">{renderContent(item)}</p> : null} */}
                {(item.content || (!item.content && item.noteTag && Array.isArray(item.noteTag) && item.noteTag.length)) && <p className="paraStyle">{renderContent(item)}</p> || null}

                {item.image &&
                  item.image.length > 0 && (
                    <div className="block">
                      {item.image.map((image, idx) => (
                        <>
                          {['jpg', 'png', 'JPG', 'PNG'].indexOf(checkExtension(image.name)) !== -1 ? (
                            <div className="wrapperImage">
                              <div className="imageItem">
                                {image.url ? (
                                  <img
                                    title={image.url === imageShow ? '' : 'Phóng to'}
                                    onClick={() => {
                                      setImageShow(image.url);
                                    }}
                                    src={image.url}
                                    alt=""
                                    className="imageStyle"
                                  />
                                ) : null}
                              </div>
                              <div className="btns">
                                <Grid item xs>
                                  <Visibility className="icon" onClick={() => handleView(image.url, checkExtension(image.name))} />
                                </Grid>
                                <Grid item xs>
                                  <GetApp className="icon" onClick={() => handleDownload(image.url, image.name)} />
                                </Grid>
                              </div>
                              <hr className="hrStyle" />
                            </div>
                          ) : (
                            <>
                              <div className="wrapperDoc">
                                <p className="nameImage">{image.name}</p>
                                <div className="btns">
                                  <Grid item xs>
                                    <Visibility className="icon" onClick={() => handleView(image.url, checkExtension(image.name))} />
                                  </Grid>
                                  <Grid item xs>
                                    <GetApp className="icon" onClick={() => handleDownload(image.url, image.name)} />
                                  </Grid>
                                </div>
                                <hr className="hrStyle" />
                              </div>
                            </>
                          )}
                        </>
                      ))}
                    </div>
                  )}
                {
                  openDialog && <Dialog maxWidth={false} docFile={docFile} fullScreen open={openDialog} onClose={() => handleClose()} typeFile={imageView.type}>
                    <div style={{ height: '1000px' }}>
                      {
                        console.log(imageView, 'imageView')
                      }
                      {imageView.type === 'image' ? (
                        <img alt="HHH" src={imageView.url} />
                      ) : (
                        <>
                          {imageView.type === 'pdf' && <iframe title="PDF" src={`${imageView.url}`} width="100%" height="100%" value="file" />}
                          {(imageView.type === 'xlsx' || imageView.type === 'xls') && <div id="show" />}
                          {/* {(imageView.type === 'docx' || imageView.type === 'doc' || imageView.type === 'txt') && ( */}
                          {(imageView.type === 'doc' || imageView.type === 'txt') && (
                            <iframe title="docx" src={`${imageView.url}`} width="100%" height="100%" value="file" />
                          )}
                        </>
                      )}
                    </div>
                  </Dialog>
                }

              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className="mt2">
        <div>
          {/* {!disableLike && (
            <>
              {item && item.likeds && item.likeds.find(i => i === profile._id) ? (
                <span style={{ marginRight: 6, cursor: 'pointer', color: '#385898' }}>Đã thích</span>
              ) : (
                <span
                  onClick={() => {
                    likeComment(item._id);
                    likeCmt(item._id);
                  }}
                  style={{ marginRight: 6, cursor: 'pointer', color: '#385898' }}
                >
                  Thích
                </span>
              )}
            </>
          )} */}
          {/* Tắt reply */}
          {!viewOnly && (
            <button onClick={() => reply(item._id)} type="button" style={{ cursor: 'pointer', color: '#385898', marginRight: 6 }}>
              Trả lời
            </button>
          )}
          <span>{item.time}</span>
        </div>
      </div>
      {isInit && item.totalReply ? (
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setInit(false);
            fetchComments();
          }}
        >
          xem {item.totalReply} câu trả lời...
        </span>
      ) : null}
      {childComments && childComments.length
        ? childComments.map(i => (
          <div style={{ borderRadius: '4px', margin: '15px 0 15px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
              {/* <Avatar
                style={{ width: 22, height: 22, marginRight: 8, border: '1px solid' }}
                // src={i.user && i.user.avatar ? `${i.user.avatar}?allowDefault=true` : avatarDefault}
                src={checkAvatar(i.user && i.user.avatar)}
              /> */}

              <CustomAvatar style={{ width: 22, height: 22, marginRight: 8, border: '1px solid' }} src={i.user && i.user.avatar} />

              <div style={{ backgroundColor: '#e2e2e2', borderRadius: '4px', width: '100%' }}>
                <p style={{ margin: 0, padding: '5px 25px' }}>
                  <span style={{ cursor: 'pointer', fontWeight: 'bold', marginRight: 5, display: 'block', fontSize: '13px' }}>
                    {i.user ? i.user.name : 'Admin'}
                  </span>
                  <span style={{ maxWidth: 260, wordWrap: 'break-word' }}>{i.content}</span>
                </p>
              </div>

              {/* <Tooltip title="Nguyexn Văn Khuong">
                  <span style={{ width: 20, height: 20, borderRadius: 999, margin: '5px 0px 0px 5px' }}>
                    <ThumbUpAltRounded style={{ fontSize: '1rem', color: '#385898', cursor: 'pointer' }} />
                  </span>
                </Tooltip> */}
            </div>
            <div style={{ marginLeft: 30 }}>
              <div>
                {!disableLike && <span style={{ marginRight: 6, cursor: 'pointer', color: '#385898' }}>Thích</span>}
                {/* <button onClick={() => reply(item._id)} type="button" style={{ cursor: 'pointer', color: '#385898', marginRight: 6 }}>
                  Trả lời
                </button> */}
                <span>{i.time}</span>
              </div>
            </div>
          </div>
        ))
        : null}
      {!isInit && item.totalReply > skip ? (
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setSkip(skip + limit);
            fetchComments();
          }}
        >
          xem thêm trả lời
        </span>
      ) : null}

      {/* {item.reply ? <InputComment sendComment={postComment} avatar={profile.avatar ? `${profile.avatar}?allowDefault=true` : avatarDefault} /> : null} */}
      {item.reply ? <InputComment sendComment={postComment} avatar={avatar} /> : null}
    </div>
  );
}

function InputComment(props) {
  const [value, setValue] = React.useState('');
  function changeValue(e) {
    setValue(e.target.value);
  }
  function sendCm() {
    props.sendComment(value);
    setValue('');
  }
  return (
    <div className="input-container">
      {/* <Avatar style={{ width: 26, height: 26 }} src={props.avatar ? `${props.avatar}?allowDefault=true` : avatarDefault} /> */}
      <Avatar style={{ width: 26, height: 26 }} src={checkAvatar(props.avatar)} />
      <div className="commnent-input-container">
        <input
          multiline
          value={value}
          onChange={changeValue}
          className="input-comment"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (e.ctrlKey) {
                setValue(`${e.target.value}\n`);
              } else {
                sendCm();
              }
            }
          }}
        />

        <Button onClick={sendCm} color="primary">
          Gửi
        </Button>
      </div>
    </div>
  );
}
