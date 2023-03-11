/**
 *
 * PersonalPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Grid, Avatar, Paper, withStyles, Button } from '@material-ui/core';
import { Call, Work, Email, AccessTime, AddCircle, Accessibility } from '@material-ui/icons';
import makeSelectPersonalPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { Tabs, Tab, Typography } from '../../components/LifetekUi';
import { fetchData, serialize } from '../../helper';
import { API_USERS } from '../../config/urlConfig';

/* eslint-disable react/prefer-stateless-function */
export class PersonalPage extends React.Component {
  state = {
    tab: 0,
    avatar: 'https://img.thuthuattinhoc.vn/uploads/2019/02/18/hinh-nen-dep-dem-sao_110817536.jpg',
    name: 'Nguyen Trung Khuong',
    email: 'trungtuyen3009@gmail.com',
    phoneNumber: '0973424277',
    cover: 'http://coverstimeline.com/app/template/492.jpg',
  };

  loadData = () => {
    try {
      const filter = { username: this.props.match.params.id };
      const query = serialize({ filter });
      fetchData(`${API_USERS}?${query}`).then(data => {
        const info = data.data[0];
        if (info) {
          const a1 = 'http://topcoverphoto.com/app/template/220.jpg';
          const a2 = 'http://coverstimeline.com/app/template/390.jpg';
          const a3 = 'http://coverstimeline.com/app/template/398.jpg';
          const items = [a1, a2, a3];
          const cover = items[Math.floor(Math.random() * items.length)];
          this.setState({ name: info.name, email: info.email, phoneNumber: info.phoneNumber, avatar: info.avatar, cover });
        }
      });
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  componentDidMount() {
    localStorage.removeItem('IncommingDocumentTab');
    localStorage.removeItem('OutGoingDocumentTab');
    localStorage.removeItem('AuthoriyDocument');
    localStorage.removeItem('WorkingCalendarTab');
    localStorage.removeItem('WorkingMeetingTab');
    localStorage.removeItem('taskCallBack');
    localStorage.removeItem('taskAddCallBack'); 
    localStorage.removeItem('addWorkingScheduleCallback'); 
    localStorage.removeItem('editWorkingScheduleCallback');
    localStorage.removeItem('taskChildAddCallBack');
    localStorage.removeItem('taskChildEditCallBack');
    this.loadData();
  }

  componentDidUpdate(next) {
    if (this.props.match.params.id !== next.match.params.id) this.loadData();
  }

  render() {
    const { tab, avatar, name, phoneNumber, email, cover } = this.state;

    return (
      <div>
        <div>
          <Paper
            style={{
              backgroundImage: ` url(${cover})`,
              width: '100%',
              backgroundSize: 'cover',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}
            >
              <Button style={{ marginTop: '14%', marginRight: 20 }} variant="outlined">
                Follow
              </Button>
              <Button style={{ marginRight: 30 }} variant="outlined">
                Add Friend
              </Button>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              <Avatar alt="Ảnh đại diện" src={avatar} style={{ width: 100, height: 100, marginTop: '-35px', marginLeft: 25 }} />
              <p
                style={{
                  color: '#d1d1d1',
                  fontƯeight: 'bold',
                  margin: 3,
                  fontSize: '1.4rem',
                }}
              >
                {name}
              </p>
            </div>
          </Paper>
        </div>

        <Tabs value={tab} onChange={(e, tab) => this.setState({ tab })} style={{ marginLeft: 60 }}>
          <Tab value={0} label="ABOUT" />
          <Tab value={1} label="TIMELINE" />
          <Tab value={2} label="PHOTOS" />
        </Tabs>
        {tab === 0 ? (
          <Grid container md={12}>
            <Grid item md={8}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '20px',
                  marginLeft: '30px',
                  marginTop: '30px',
                }}
              >
                About
              </Typography>
            </Grid>

            <Grid item md={4}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '20px',
                  marginLeft: '30px',
                  marginTop: '30px',
                }}
              >
                Friend Suggestions
              </Typography>
            </Grid>
            <Grid item md={4}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '20px',
                  marginTop: '30px',
                }}
              />
              <Call style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
              {phoneNumber}
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '20px',
                  marginTop: '30px',
                }}
              />
              <Email style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
              {email}
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '20px',
                  marginTop: '30px',
                }}
              />
              <AddCircle style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
              Add an address
            </Grid>

            <Grid item md={4}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '20px',
                  marginTop: '30px',
                }}
              />
              <Work style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
              Web developer
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '20px',
                  marginTop: '30px',
                }}
              />
              <AccessTime style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
              Usually available
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '20px',
                  marginTop: '30px',
                }}
              />
              <Accessibility style={{ fontSize: '20px', marginBottom: '5px', marginLeft: '30px' }} />
              Add social profiles
            </Grid>
          </Grid>
        ) : null}
        {tab === 2 ? (
          <Grid container md={12}>
            <Grid item md={8}>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '20px',
                  marginLeft: '30px',
                  marginTop: '30px',
                }}
              >
                Ảnh
              </Typography>
            </Grid>
          </Grid>
        ) : null}
      </div>
    );
  }
}

PersonalPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  personalPage: makeSelectPersonalPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'personalPage', reducer });
const withSaga = injectSaga({ key: 'personalPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(PersonalPage);
