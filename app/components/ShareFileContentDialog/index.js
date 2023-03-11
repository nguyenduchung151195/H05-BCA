/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * ShareFileContentDialog
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import AsyncSelect from 'react-select/async';
import { TextField, Grid, MenuItem, Divider, withStyles, Button } from '@material-ui/core';
import { Link, LinkOff } from '@material-ui/icons';
import axios from 'axios';
import { serialize } from '../../utils/common';
import { API_USERS } from '../../config/urlConfig';
/* eslint-disable react/prefer-stateless-function */
const sharedFileModel = {
  path: '',
  fullPath: '',
  permissions: [],
  type: '',
  users: [],
  _id: '',
  status: 1,
};

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3,
  },
});

const promiseOptions = (searchString, putBack) => {
  const param = {
    limit: '10',
    skip: '0',
  };
  if (searchString != null) {
    param.filter = {
      name: {
        $regex: searchString,
      },
    };
  }
  axios
    .get(`${API_USERS}?${serialize(param)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const convertedData = [];
      response.data.data.map(
        item =>
          item.userId
            ? convertedData.push({
              ...item,
              ...{ label: item.name, value: item.userId },
            })
            : '',
      );

      putBack(convertedData);
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      //console.log(err);
    });
};
class ShareFileContentDialog extends React.Component {
  constructor(props) {
    super(props);
    this.urlInput = null;
  }

  state = {
    sharedFileInfor: sharedFileModel,
    permission: '',
  };

  componentWillReceiveProps(props) {
    if (props.sharedFileInfor) {
      const { sharedFileInfor } = this.state;
      sharedFileInfor.users = props.sharedFileInfor.users.map(item => ({
        userId: item,
        value: item,
        label: item,
      }));

      this.setState({ sharedFileInfor });
      props.updateSharedFileInfor(sharedFileInfor);
    }
  }

  componentWillMount() {
    const { sharedFileInfor } = this.props;
    let { permission } = this.state;

    if (this.props.sharedFileInfor) {
      permission = sharedFileInfor.public;
      const userIds = sharedFileInfor.users;

      if (userIds.length !== 0) {
        axios
          .get(
            `${API_USERS}?${serialize({
              filter: {
                username: {
                  $in: userIds,
                },
              },
            })}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
            },
          )
          .then(response => {
            const convertedData = [];

            response.data.data.map(
              item =>
                item.userId
                  ? convertedData.push({
                    ...item,
                    ...{ label: item.name, value: item.userId },
                  })
                  : '',
            );
            sharedFileInfor.users = convertedData;
            this.setState({ sharedFileInfor, permission });
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            //console.log(err);
          });
      } else {
        this.setState({ sharedFileInfor, permission });
      }
    }
  }

  handleChangeSelect = (selectedOption, key) => {
    const { sharedFileInfor } = this.state;
    if (!selectedOption) sharedFileInfor[key] = [];
    else sharedFileInfor[key] = selectedOption;
    this.setState({ sharedFileInfor });
    this.props.updateSharedFileInfor(sharedFileInfor);
  };

  render() {
    const { sharedFileInfor, permission } = this.state;

    return (
      <div>
        <Grid container>
          <Grid item sm={6}>
            <p className="font-weight-bold mt-0 text-left">Chia sẻ tài liệu</p>
          </Grid>
          <Grid item sm={6}>
            {sharedFileInfor && sharedFileInfor.status === 1 ? (
              <p
                onClick={() => {
                  const newStatus = Object.assign({}, sharedFileInfor);
                  newStatus.status = 2;

                  this.setState({ sharedFileInfor: newStatus });
                  this.props.updateSharedFileInfor(newStatus);
                }}
                className=" mt-0 text-right"
              >
                Khóa link <LinkOff />
              </p>
            ) : (
              <p
                onClick={() => {
                  const newStatus = Object.assign({}, sharedFileInfor);
                  newStatus.status = 1;
                  this.setState({ sharedFileInfor: newStatus });
                  this.props.updateSharedFileInfor(newStatus);
                }}
                className=" mt-0 text-right"
              >
                Mở link <Link />
              </p>
            )}
          </Grid>
          <p>Tài liệu được chia sẻ ở đường dẫn:</p>
          <Grid item sm={9}>
            <TextField
              select
              variant="outlined"
              fullWidth
              value={permission}
              onChange={event => {
                const { sharedFileInfor } = this.state;
                let { permission } = this.state;
                permission = event.target.value;

                switch (permission) {
                  case 1:
                    sharedFileInfor.public = 1;
                    sharedFileInfor.permissions = ['read', 'download'];
                    break;
                  case 2:
                    sharedFileInfor.public = 2;
                    sharedFileInfor.permissions = ['copy', 'download', 'edit', 'editContents', 'read', 'upload'];

                    break;
                  case 3:
                    sharedFileInfor.public = 3;
                    sharedFileInfor.permissions = ['read', 'download'];
                    break;
                  case 4:
                    sharedFileInfor.public = 4;
                    sharedFileInfor.permissions = ['copy', 'download', 'edit', 'editContents', 'read', 'upload'];
                    break;
                  default:
                    break;
                }

                this.setState({ sharedFileInfor, permission });
                this.props.updateSharedFileInfor(sharedFileInfor);
              }}
            >
              <MenuItem value={1}>Chỉ những người được chọn mới có quyền xem</MenuItem>
              <MenuItem value={2}>Chỉ những người được chọn mới có quyền sửa</MenuItem>
              <Divider />
              <MenuItem value={3}>Tất cả mọi người có thể xem</MenuItem>
              <MenuItem value={4}>Tất cả mọi người có thể chỉnh sửa</MenuItem>
            </TextField>
          </Grid>
          <Grid item sm={3}>
            <Button
              className="w-100 h-100"
              variant="outlined"
              onClick={() => {
                const textField = document.createElement('textarea');
                textField.innerText = `${window.location.host}/share/${sharedFileInfor._id}`;
                document.body.appendChild(textField);
                textField.select();
                document.execCommand('copy');
                textField.remove();
                // document.execCommand('copy');
              }}
            >
              Copy link
            </Button>
          </Grid>
          <Grid item sm={12} className="mb-3">
            <TextField
              disabled={sharedFileInfor.status === 2}
              // label="Tài liệu được chia sẻ ở đường dẫn"
              // placeholder="Tài liệu được chia sẻ ở đường dẫn"
              fullWidth
              variant="outlined"
              value={`${window.location.host}/Documentary/${sharedFileInfor._id}`}
              ref={urlInput => (this.urlInput = urlInput)}
            />
          </Grid>
          {sharedFileInfor.public === 1 || sharedFileInfor.public === 2 ? (
            <Grid item sm={12} className="my-3">
              <p className="text-left mt-0">Chia sẻ với:</p>

              <AsyncSelect
                onChange={selectedOption => {
                  this.handleChangeSelect(selectedOption, 'users');
                }}
                placeholder="Tìm kiếm ..."
                value={this.state.sharedFileInfor.users}
                isMulti
                defaultOptions
                loadOptions={(inputValue, callback) => {
                  clearTimeout(this.organizer);
                  this.organizer = setTimeout(() => {
                    promiseOptions(inputValue, callback);
                  }, 1000);
                }}
              />
            </Grid>
          ) : (
            ''
          )}
        </Grid>
      </div>
    );
  }
}

ShareFileContentDialog.propTypes = {};

export default withStyles(styles)(ShareFileContentDialog);
