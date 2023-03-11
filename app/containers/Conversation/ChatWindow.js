/* eslint-disable no-alert */
import React from 'react';

import { Avatar, Tooltip } from '@material-ui/core';
import { Close, Videocam, Phone, Settings } from '@material-ui/icons';

import { API_CONVERSATION } from '../../config/urlConfig';
import { fetchData } from '../../helper';
export default class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.refContent = React.createRef(null);
    this.state = { hide: false, messages: [], input: '', data: { name: '', join: [], type: 1, names: [] } };
  }

  appendMessage = message => {
    const { messages } = this.state;
    const newMessages = messages.concat(message);

    this.setState({ messages: newMessages }, () => (this.refContent.current.scrollTop = this.refContent.current.scrollHeight));
  };

  componentDidMount() {
    this.props.socket.on('chat', dt => {
      const message = {
        content: dt.content,
        updateAt: new Date().toISOString(),
        time: new Date().toLocaleString(),
        user: { _id: dt.userId, name: dt.userName, avatar: dt.userAvatar },
      };
      this.appendMessage(message);
    });
    this.getConversation();
    this.getMessages();
  }

  getMessages = () => {
    fetchData(`${API_CONVERSATION}/message/${this.props.id}`).then(result => {
      this.setState({ messages: result.data });
      try {
        this.refContent.current.scrollTop = this.refContent.current.scrollHeight;
      } catch (e) {

      }
    });
  };

  getConversation = () => {
    const { profile, id } = this.props;
    fetchData(`${API_CONVERSATION}/${id}`).then(result => {
      const names = result.join.map(i => i.name);
      const join = result.join.map(i => i._id);
      if (result.type === 0) {
        const name = result.join.find(i => i._id !== profile._id);
        if (!name) {
          alert('Không thể tạo cuộc trò chuyện này');
          return;
        }
        result.name = name.name;
      }
      result.join = join;

      this.setState({ data: result, names });
    });
  };

  hideChatWindown = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({ hide: !this.state.hide });
  };

  changeInput = e => {
    this.setState({ input: e.target.value });
  };

  submitInput = e => {
    const { profile, id } = this.props;
    const { data } = this.state;

    if (e.keyCode === 13 && e.target.value) {
      if (!this.props.profile._id || this.state.data.join.length < 2) {
        alert('Có lỗi với cuộc trò chuyện, Đồng chí không thể trả lời bây giờ!');
        return;
      }
      const join = this.state.data.join.filter(i => i !== profile._id);
      this.props.socket.emit('conversation', {
        data: {
          id,
          content: e.target.value,
          userName: profile.name,
          userAvatar: profile.avatar,
          userId: profile._id,
          type: data.type,
          join,
          name: data.name,
          time: new Date().toLocaleString('vi'),
        },
        type: 'CHAT',
        Authorization: localStorage.getItem('token'),
      });
      this.setState({ input: '' });
      const messAppend = { content: e.target.value, createdAt: new Date(), user: { _id: profile._id } };
      this.appendMessage(messAppend);
    }
  };

  closeChatWindow = () => {
    this.props.closeChat(this.props.id);
  };

  render() {
    const { messages, data, hide, input, names } = this.state;
    const { profile } = this.props;
    return (
      <div style={{ width: '270px', margin: '0px 5px' }}>
        <div className={hide ? 'chat-window-item-close' : 'chat-window-item'}>
          <div className="chat-window-item-header">
            <Tooltip placement="top" title={<Names names={names} />}>
              {/* <Link to={`/userprofile/${}`}></Link> */}
              <button className="chat-header-name" type="button">
                {data.name}
              </button>
            </Tooltip>
            <button type="button" onClick={this.hideChatWindown} className="chat-header-cosllap" />
            <span>
              <Tooltip placement="top" title="Gọi video">
                <Videocam style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 2, color: '#8a8a8a' }} />
              </Tooltip>
              <Tooltip placement="top" title="Cuộc gọi">
                <Phone style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 2, color: '#8a8a8a' }} />
              </Tooltip>
              <Tooltip placement="top" title="Cài đặt">
                <Settings style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 2, color: '#8a8a8a' }} />
              </Tooltip>
              <Tooltip placement="top" title="Đóng lại">
                <Close onClick={this.closeChatWindow} style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 2 }} />
              </Tooltip>
            </span>
          </div>
          {hide ? null : (
            <React.Fragment>
              <div ref={this.refContent} className="chat-window-item-content">
                {messages.map(
                  it =>
                    profile._id === it.user._id ? (
                      <div className="my-messege">
                        <Tooltip title={new Date(it.createdAt).toLocaleString('vi')}>
                          <span>{it.content}</span>
                        </Tooltip>
                      </div>
                    ) : (
                      <div className="friend-message">
                        <span>
                          <Avatar style={{ width: 25, height: 25 }} src={it.user.avatar} />
                        </span>
                        <Tooltip title={new Date(it.createdAt).toLocaleString('vi')}>
                          <span>{it.content}</span>
                        </Tooltip>
                      </div>
                    ),
                )}
              </div>
              <input
                value={input}
                onChange={this.changeInput}
                onKeyUp={this.submitInput}
                placeholder="Nhập tin nhắn"
                className="chat-window-item-input"
              />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

function Names({ names }) {
  return (
    <div>
      {names.map(i => (
        <p>{i}</p>
      ))}
    </div>
  );
}
