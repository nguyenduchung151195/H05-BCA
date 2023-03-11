/* eslint-disable no-console */
import React from 'react';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { withSnackbar } from 'notistack';
import {
  withStyles,
  MenuItem,
  MenuList,
  Paper,
  Grow,
  IconButton,
  Hidden,
  TextField,
  Grid,
  Avatar,
  Menu,
  Typography,
  ClickAwayListener,
  Tooltip,
} from '@material-ui/core'; // Menu, Typography
import { NotificationsActive, Create, Title, AlarmOn, ChatBubble, ExpandMore, ExpandLess } from '@material-ui/icons'; // , AccountCircle, Input, Dashboard, Person
import headerLinksStyle from 'assets/jss/material-dashboard-pro-react/components/headerLinksStyle';
import { Dialog as DialogUI, MakeCreateTaskRequest } from 'components/LifetekUi';
import axios from 'axios';
// import { appLocalesDetail } from '../../i18n';
import { changeLocale } from '../../containers/LanguageProvider/actions';
import { makeSelectLocale } from '../../containers/LanguageProvider/selectors';

import makeSelectConversation from '../../containers/Conversation/selectors';
import { mergeData } from '../../containers/Conversation/actions';
import { API_NOTIFY, API_CONVERSATION } from '../../config/urlConfig';
import './index.css';
import { clientId } from '../../variable';
import avatarDefault from '../../images/default-avatar.png';
import { testAvatar, checkAvatar } from 'utils/common';
import CustomAvatar from 'components/CustomAvatar';
import _ from 'lodash';

class HeaderLinks extends React.Component {
  state = {
    open: false,
    notifications: [],
    counter: 0,
    anchorEl: null,
    // getMore: false,
    limit: 0,
    // chatNotice: 0,
    chatList: [],
    openTaskRequest: false,
    taskRequestId: null,
    expandedItems: [],
  };

  handleClick = () => {
    const { open } = this.state;

    this.setState({ open: !open, counter: 0 });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    try {
      this.props.socket.on('chat', a => {
        const { chatList } = this.state;
        const { converstion } = this.props;

        const find = converstion.conversations.find(i => i._id === a.id);
        if (!find) {
          const mess = `${a.userName}: ${a.content}`;
          this.snackbarNotice(mess);
        }
        const check = chatList.find(i => i.id === a.id);
        if (!find && !check) {
          const chat = [{ type: a.type, name: a.type ? a.userName : a.name, id: a.id }];
          const newChat = chat.concat(chatList);

          this.setState({ chatList: newChat });
        }
      });
      this.getMoreNotice();
      this.props.socket.on('notice', a => {
        if (a.content === 'Bạn có bình luận mới') {
          _.debounce(() => {
            this.snackbarNotice(a.content);
          }, 1000);
        } else {
          this.snackbarNotice(a.content);
        }
        this.getMoreNotice();
      });
    } catch (e) {
      // console.log(e);
    }
  }

  componentWillUnmount() {
    try {
      this.props.socket.off('chat');
    } catch (e) {
      // console.log(e);
    }
  }

  componentWillReceiveProps(props) {
    try {
      if (props.notifications && props.notifications.isNotRead !== this.props.notifications.isNotRead) {
        this.setState({ counter: props.notifications.isNotRead || 0, limit: props.notifications.limit || 0 });
      }
      this.state.notifications = props.notifications && props.notifications.data;
      // if (props.notifications.data && props.notifications.data.length !== this.state.notifications.length) {
      //   this.setState({ getMore: false });
      // }
    } catch (e) {
      // console.log('Đây là lỗi tại componentWillReceiveProps của HeaderLinks: ', e);
    }
  }

  handleLogOut = () => {
    localStorage.clear();
    let cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf('=');
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    // document.cookie = 'ZM_AUTH_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    this.props.mergeData({ tab: 0 });
    this.props.history.push('/login');
  };

  snackbarNotice = message => {
    this.props.enqueueSnackbar(message, {
      variant: 'info',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
    });
  };

  render() {
    const { chatList, expandedItems } = this.state;
    const { classes, rtlActive, notAcceptRecord } = this.props;
    const { open, anchorEl } = this.state; // anchorEl
    // const wrapperPage = withStyles(()=>{

    // })
    // const wrapper = classNames({
    //   [classes.wrapperRTL]: rtlActive,
    // });
    const managerClasses = classNames({
      [classes.managerClasses]: true,
    });
    return (
      <div>
        {/* {clientId === 'MIPEC' ? null :
          <TextField
            id="standard-select-currency"
            select
            // label="Kho"
            name="stock"
            // variant="outlined"
            value={this.props.locale}
            onChange={this.props.onchangeLocale}
            style={{
              width: '200px',
              marginRight: '20px',
              marginTop: 5,
            }}
           helperText="Please select your currency"
           margin="normal"
          >
           {appLocalesDetail.map(item => (
              <MenuItem key={item.id} value={item.id}>
                {item.title}
              </MenuItem>
            ))}
          </TextField>} */}

        {/* <TextField
          id="standard-select-currency"
          select
          // label="Kho"
          name="stock"
          // variant="outlined"
          value={this.props.currentStock}
          onChange={this.props.handleChangeStock}
          style={{
            width: '200px',
            marginRight: '20px',
            marginTop: 5,
          }}
          className="menu-header"
        // helperText="Please select your currency"
        // margin="normal"
        >
          {this.props.allStock
            ? this.props.allStock.map(item => {
              let isItemShowed = false;
              if (!item.parent) isItemShowed = true;
              else if (expandedItems.find(exp => exp === item.parent)) {
                isItemShowed = true;
              } else if (this.props.currentStock === item.id) {
                isItemShowed = true;
              }
              if (isItemShowed) {
                const isItemExpanded = expandedItems.find(exp => exp === item.id);
                return (
                  <MenuItem
                    key={item.id}
                    value={item.id}
                    style={item.padding !== 0 ? { paddingLeft: `${parseInt(item.padding, 10) * 1.5}px` } : {}}
                  >
                    {this.props.allStock.find(org => org.parent === item.id) ? (
                      <span
                        style={{ width: '40px' }}
                        onClick={e => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (isItemExpanded) {
                            const newExpandedItems = expandedItems.filter(exp => exp !== item.id);
                            this.setState({ expandedItems: newExpandedItems });
                          } else {
                            const newExpandedItems = [...expandedItems, item.id];
                            this.setState({ expandedItems: newExpandedItems });
                          }
                        }}
                      >
                        {isItemExpanded ? <ExpandLess /> : <ExpandMore />}
                      </span>
                    ) : null}
                    {item.name}
                  </MenuItem>
                );
              }
              return null;
            })
            : ''}
        </TextField> */}

        {/* <div className={managerClasses}>
          <Link to="/approve">
            <Tooltip title="Danh sách phê duyệt">
              <IconButton
                // onClick={this.snackbarNotice}
                color="inherit"
                aria-label="Notifications"
                aria-owns={open ? 'menu-list' : null}
                aria-haspopup="true"
                // onClick={this.handleClick}
                className={classes.buttonLink}
                classes={{
                  label: '',
                }}
              >
                <Create className={classes.links} />
                {notAcceptRecord > 0 ? <span className={classes.notifications}>{notAcceptRecord > 99 ? '99+' : notAcceptRecord}</span> : ""}
                <Hidden mdUp>
                  <p className={classes.linkText}>Thông báo</p>
                </Hidden>
              </IconButton>
            </Tooltip>
          </Link>
        </div> */}
        {/* <div className={managerClasses}>
          <IconButton
            onClick={this.openMenuMessage}
            color="inherit"
            aria-label="Notifications"
            aria-owns={open ? 'menu-list' : null}
            aria-haspopup="true"
            // onClick={this.handleClick}
            className={classes.buttonLink}
            classes={{
              label: '',
            }}
          >
            <ChatBubble style={{ color: '#2196f3' }} className={classes.links} />
            {chatList.length ? <span className={classes.notifications}>{chatList.length}</span> : null}
            <Hidden mdUp>
              <p className={classes.linkText}>Thông báo</p>
            </Hidden>
          </IconButton>
        </div> */}
        <div className="d-inline position-relative">
          <Tooltip title="Thông báo">
            <IconButton
              color="primary"
              aria-label="Notifications"
              aria-owns={open ? 'menu-list' : null}
              aria-haspopup="true"
              onClick={() => {
                if (this.pauseClickNoti) return;

                this.state.limit = 0;
                this.getMoreNotice();
                // eslint-disable-next-line react/no-access-state-in-setstate
                this.setState({ open: !this.state.open });
              }}
              className={classes.buttonLink}
              classes={{
                label: '',
              }}
            >
              <NotificationsActive className={classes.links} />
              {Number(this.state.counter) !== 0 ? (
                <span className={classes.notifications}>{this.state.counter > 99 ? '99+' : this.state.counter}</span>
              ) : (
                ''
              )}
              <Hidden mdUp>
                <p className={classes.linkText}>Thông báo</p>
              </Hidden>
            </IconButton>
          </Tooltip>
          {this.state.open === true ? (
            <ClickAwayListener
              onClickAway={() => {
                this.setState({ open: false });
                this.pauseClickNoti = true;
                setTimeout(() => {
                  this.pauseClickNoti = false;
                }, 100);
              }}
            >
              <div style={{ position: 'absolute', left: -300, maxHeight: 1000, overflow: 'auto' }} className={classes.dropdown}>
                <Grow
                  in={open}
                  onClose={this.handleCloseNotice}
                  id="menu-list"
                  className={classes.menuNotice}
                  style={{ transformOrigin: '0 0 0', boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0)', width: 316 }}
                >
                  <Paper style={{ boxShadow: 'none' }}>
                    <Typography component="p" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', marginTop: '5px' }}>
                      Thông báo
                      {/* <Link to="/notifications">
                        <Typography
                          component="p"
                          className={classes.moreNotice}
                          style={{ position: 'absolute', top: 4, right: 10, color: '#0795db', fontSize: '13px' }}
                        >
                          Xem tất cả
                        </Typography>
                      </Link> */}
                    </Typography>
                    <hr style={{ marginTop: 5, marginBottom: 0 }} />
                    <MenuList role="menu" style={{ margin: 0, paddingTop: 0, whiteSpace: 'normal' }} className={classes.menuNotice}>
                      {/* {console.log(this.state.notifications)} */}
                      {this.state.notifications && this.state.notifications.length > 0 ? (
                        this.state.notifications.map(item => (
                          <MenuItem
                            className="p-2 border-top  border-bottom "
                            style={
                              item.isRead
                                ? { width: 300, height: 'auto', backgroundColor: '#fff', borderColor: '#dddfe2', margin: 0, whiteSpace: 'normal' }
                                : { width: 300, height: 'auto', backgroundColor: '#edf2fa', borderColor: '#dddfe2', margin: 0, whiteSpace: 'normal' }
                            }
                            onClick={() => {
                              const token = localStorage.getItem('token');
                              item.isRead = true;
                              axios
                                .put(`${API_NOTIFY}/${item._id}`, item, {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                  },
                                })
                                .then(() => {
                                  this.setState({ open: false });
                                  if (item.type === 'TaskRequest') {
                                    this.setState({ openTaskRequest: true, taskRequestId: item.link });
                                    return;
                                  }
                                  this.props.history.push(item.link);
                                  localStorage.setItem(
                                    'timeLineData',
                                    JSON.stringify({
                                      value: 1,
                                      id: item._id,
                                    }),
                                  );
                                });
                              // .catch(err => {});
                              this.state.limit = 0;
                              const { counter } = this.state;
                              if (counter > 0) this.setState({ counter: counter - 1 });
                              this.getMoreNotice();
                            }}
                          >
                            <Grid container justify="center" alignItems="center">
                              <Grid item sm="2" style={{ width: 50 }}>
                                <CustomAvatar src={this.props.profile && this.props.profile.avatar} />
                              </Grid>
                              <Grid item sm="10" style={{ width: 250 }}>
                                <p style={{ fontSize: 12, width: 250, wordBreak: 'break-word', display: 'block !important' }} className="mb-0">
                                  {/* <Title style={{ fontSize: 16 }} color="primary" /> Đồng chí có lịch{' '} */}
                                  <b style={{ wordBreak: 'break-word', fontWeight: item.isRead ? 400 : 'bold' }}>{item.title}</b>
                                </p>
                                <p style={{ fontSize: 12 }} className="mb-0">
                                  <AlarmOn style={{ fontSize: 16 }} color="primary" /> {moment(item.date).format('HH:mm DD-MM-YYYY')}
                                </p>
                              </Grid>
                            </Grid>
                          </MenuItem>
                        ))
                      ) : (
                        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>Đồng chí không có thông báo nào!</div>
                      )}
                      {/* {this.state.notifications && this.state.notifications.length > 0 ? (
                        <Typography
                          component="p"
                          className={classes.moreNotice}
                          style={{ textAlign: 'center', color: '#0795db', fontSize: '13px', padding: '5px', marginTop: '10px' }}
                          onClick={() => {
                            // this.setState({ getMore: true });
                            this.getMoreNotice();
                          }}
                        >
                          Xem thêm
                        </Typography>
                      ) : null} */}

                      <Link to="/notifications">
                        <Typography
                          component="p"
                          className={classes.moreNotice}
                          style={{ textAlign: 'center', color: '#0795db', fontSize: '13px', padding: '5px', marginTop: '10px' }}
                        >
                          Xem tất cả
                        </Typography>
                      </Link>
                    </MenuList>
                  </Paper>
                </Grow>
              </div>
            </ClickAwayListener>
          ) : (
            ''
          )}
        </div>
        <Menu onClose={() => this.setState({ anchorEl: null })} open={Boolean(anchorEl)} anchorEl={anchorEl}>
          {chatList.map(i => (
            <MenuItem onClick={() => this.readChat(i.id)} key={i.id}>
              {i.name}
            </MenuItem>
          ))}
        </Menu>
        <DialogUI dialogAction={false} onClose={() => this.setState({ openTaskRequest: false })} open={this.state.openTaskRequest}>
          <MakeCreateTaskRequest taskRequestId={this.state.taskRequestId} />
        </DialogUI>
      </div>
    );
  }

  readChat = id => {
    const { chatList } = this.state;
    const newList = chatList.filter(i => i.id !== id);
    this.setState({ anchorEl: null, chatList: newList });
    this.makeConversation(id);
  };

  handleCloseNotice = () => {
    this.setState({ open: false });
  };

  openMenuMessage = e => {
    const { chatList } = this.state;
    if (chatList.length) this.setState({ anchorEl: e.currentTarget });
  };

  makeConversation = id => {
    try {
      const { converstion } = this.props;
      const check = converstion.conversations.find(i => i._id === id);
      if (check) return;

      const fetchData = url =>
        fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

      Promise.all([fetchData(`${API_CONVERSATION}/${id}`), fetchData(`${API_CONVERSATION}/message/${id}`)]).then(respon => {
        Promise.all(respon.map(i => i.json())).then(newData => {
          const result = newData[0];
          result.messages = newData[1].data;
          const conversations = converstion.conversations.concat(result);
          this.props.setStateCv({ conversations });
        });
      });
    } catch (error) {
      // console.log(error);
    }
  };

  getMoreNotice = () => {
    const { limit } = this.state;
    const { socket } = this.props;
    socket.emit('notification', {
      command: 1001,
      data: {
        skip: 0,
        limit: limit === 0 ? 5 : limit + 10,
      },
      // Authorization: localStorage.getItem('token'),
    });
    this.setState({ limit: limit + 10 });
  };
}

HeaderLinks.propTypes = {
  classes: PropTypes.object,
  rtlActive: PropTypes.bool,
  history: PropTypes.object,
};

const mapStateToProps = createSelector(makeSelectLocale(), makeSelectConversation(), (locale, converstion) => ({
  locale,
  converstion,
}));

export function mapDispatchToProps(dispatch) {
  return {
    onchangeLocale: e => dispatch(changeLocale(e.target.value)),
    setStateCv: data => dispatch(mergeData(data)),
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withSnackbar,
  withConnect,
  withStyles(headerLinksStyle),
)(HeaderLinks);
